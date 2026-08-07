import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './src/server/db.js';

const app = express();
const PORT = 3000;

// Increase payload limit for base64 screenshot uploads
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Helper Middleware to extract user from Authorization header
const authenticateUser = (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.replace('Bearer ', '').trim();
  // Simple token format: user-{userId} or directly {userId}
  const userId = token.startsWith('user-') ? token.replace('user-', '') : token;
  const user = db.findUserById(userId);

  if (!user) {
    return res.status(401).json({ error: 'Invalid authentication token' });
  }

  req.user = user;
  next();
};

const requireAdmin = (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// --- AUTH API ---
app.post('/api/auth/register', (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (db.findUserByEmail(email)) {
      return res.status(400).json({ error: 'Email address is already registered' });
    }

    if (db.findUserByUsername(username)) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    const newUser = db.createUser({ fullName, username, email, role: 'user' }, password);
    const token = `user-${newUser.id}`;

    res.status(201).json({ user: newUser, token });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to register' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    if (!db.verifyPassword(user.id, password)) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = `user-${user.id}`;
    res.json({ user, token });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Login failed' });
  }
});

app.get('/api/auth/me', authenticateUser, (req: any, res) => {
  // Always fetch fresh user record from DB to get latest balance
  const user = db.findUserById(req.user.id);
  res.json({ user });
});

// --- PROFILE API ---
app.put('/api/users/profile', authenticateUser, (req: any, res) => {
  try {
    const { fullName, phone, email } = req.body;
    const updatedUser = db.updateUserProfile(req.user.id, { fullName, phone, email });
    res.json({ user: updatedUser });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// --- OFFERS & SETTINGS ---
app.get('/api/offers', (_req, res) => {
  res.json({ offers: db.getOffers() });
});

app.get('/api/settings', (_req, res) => {
  const settings = db.getSettings();
  res.json({
    trc20WalletAddress: settings.trc20WalletAddress,
    clippingRatePer1k: settings.clippingRatePer1k,
    minWithdrawalAmount: settings.minWithdrawalAmount,
    offers: settings.offers
  });
});

// --- ORDERS API ---
app.post('/api/orders', authenticateUser, (req: any, res) => {
  try {
    const { receiveAmount, payAmount } = req.body;
    if (!receiveAmount || !payAmount) {
      return res.status(400).json({ error: 'Invalid order parameters' });
    }

    const order = db.createOrder(req.user.id, Number(receiveAmount), Number(payAmount));
    res.status(201).json({ order });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/orders/:id/pay', authenticateUser, (req: any, res) => {
  try {
    const { txHash, proofDataUrl } = req.body;
    const order = db.markOrderPaid(req.params.id, txHash, proofDataUrl);
    res.json({ order });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/orders/my', authenticateUser, (req: any, res) => {
  const orders = db.getOrdersByUserId(req.user.id);
  res.json({ orders });
});

// --- CLIPPING APPLICATION API ---
app.post('/api/clipping/submit', authenticateUser, (req: any, res) => {
  try {
    const { videoUrl, screenshotName, screenshotDataUrl } = req.body;
    if (!videoUrl || !videoUrl.includes('tiktok.com')) {
      return res.status(400).json({ error: 'Valid TikTok video URL is required' });
    }

    const appItem = db.createClippingApp(req.user.id, videoUrl, screenshotName, screenshotDataUrl);
    res.status(201).json({ application: appItem });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/clipping/my', authenticateUser, (req: any, res) => {
  const apps = db.getClippingAppsByUserId(req.user.id);
  res.json({ applications: apps });
});

// --- WITHDRAWAL API ---
app.post('/api/withdraw', authenticateUser, (req: any, res) => {
  try {
    const { walletAddress, amount } = req.body;
    if (!walletAddress || walletAddress.trim().length < 10) {
      return res.status(400).json({ error: 'Please enter a valid USDT TRC20 wallet address' });
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ error: 'Invalid withdrawal amount' });
    }

    const withdrawal = db.createWithdrawal(req.user.id, walletAddress, numAmount);
    res.status(201).json({ withdrawal });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/withdraw/my', authenticateUser, (req: any, res) => {
  const withdrawals = db.getWithdrawalsByUserId(req.user.id);
  res.json({ withdrawals });
});

// --- ADMIN API ENDPOINTS ---
app.get('/api/admin/stats', authenticateUser, requireAdmin, (_req, res) => {
  res.json({ stats: db.getStats() });
});

app.get('/api/admin/users', authenticateUser, requireAdmin, (_req, res) => {
  res.json({ users: db.getAllUsers() });
});

app.get('/api/admin/orders', authenticateUser, requireAdmin, (_req, res) => {
  res.json({ orders: db.getAllOrders() });
});

app.post('/api/admin/orders/:id/status', authenticateUser, requireAdmin, (req, res) => {
  try {
    const { status, notes } = req.body;
    if (!['Completed', 'Rejected', 'Cancelled', 'Pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid order status' });
    }

    const order = db.updateOrderStatus(req.params.id, status, notes);
    res.json({ order });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/admin/clipping', authenticateUser, requireAdmin, (_req, res) => {
  res.json({ applications: db.getAllClippingApps() });
});

app.post('/api/admin/clipping/:id/status', authenticateUser, requireAdmin, (req, res) => {
  try {
    const { status, views, rewardAmount, notes } = req.body;
    if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid application status' });
    }

    const application = db.updateClippingStatus(
      req.params.id,
      status,
      views ? Number(views) : undefined,
      rewardAmount ? Number(rewardAmount) : undefined,
      notes
    );
    res.json({ application });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/admin/withdrawals', authenticateUser, requireAdmin, (_req, res) => {
  res.json({ withdrawals: db.getAllWithdrawals() });
});

app.post('/api/admin/withdrawals/:id/status', authenticateUser, requireAdmin, (req, res) => {
  try {
    const { status, notes } = req.body;
    if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const withdrawal = db.updateWithdrawalStatus(req.params.id, status, notes);
    res.json({ withdrawal });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/admin/offers', authenticateUser, requireAdmin, (_req, res) => {
  res.json({ offers: db.getAllOffersAdmin() });
});

app.post('/api/admin/offers', authenticateUser, requireAdmin, (req, res) => {
  try {
    const { receiveAmount, payAmount, popular, discountBadge, description, durationMinutes } = req.body;
    if (!receiveAmount || !payAmount) {
      return res.status(400).json({ error: 'Receive amount and pay amount are required' });
    }

    let expiresAt: string | undefined = undefined;
    if (durationMinutes && Number(durationMinutes) > 0) {
      expiresAt = new Date(Date.now() + Number(durationMinutes) * 60 * 1000).toISOString();
    }

    const offer = db.createOffer({
      receiveAmount: Number(receiveAmount),
      payAmount: Number(payAmount),
      popular: Boolean(popular),
      discountBadge: discountBadge || 'FLASH DEAL',
      description,
      expiresAt
    });

    res.status(201).json({ offer });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/offers/:id', authenticateUser, requireAdmin, (req, res) => {
  try {
    db.deleteOffer(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/admin/settings', authenticateUser, requireAdmin, (req, res) => {
  try {
    const { trc20WalletAddress, clippingRatePer1k, minWithdrawalAmount, offers } = req.body;
    const settings = db.updateSettings({
      ...(trc20WalletAddress && { trc20WalletAddress }),
      ...(clippingRatePer1k !== undefined && { clippingRatePer1k: Number(clippingRatePer1k) }),
      ...(minWithdrawalAmount !== undefined && { minWithdrawalAmount: Number(minWithdrawalAmount) }),
      ...(offers && { offers })
    });
    res.json({ settings });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Catch-all for unmatched /api routes so they don't fall through to Vite SPA index.html
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: `API route ${req.originalUrl} not found` });
});

// Global Express Error Handler to ensure API errors are always JSON
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// --- VITE MIDDLEWARE / STATIC SERVING ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Crypto Rewards Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
