var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_vite = require("vite");

// src/server/db.ts
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var DATA_FILE = import_path.default.join(process.cwd(), "data.json");
var defaultOffers = [
  {
    id: "offer-1",
    receiveAmount: 100,
    payAmount: 10,
    discountBadge: "90% OFF",
    description: "Starter Boost - Get 100 USDT for just 10 USDT"
  },
  {
    id: "offer-2",
    receiveAmount: 250,
    payAmount: 25,
    popular: true,
    discountBadge: "90% OFF - POPULAR",
    description: "Pro Tier - High demand reward allocation"
  },
  {
    id: "offer-3",
    receiveAmount: 500,
    payAmount: 50,
    discountBadge: "90% OFF",
    description: "VIP Trader - Save $450 instantly"
  },
  {
    id: "offer-4",
    receiveAmount: 1e3,
    payAmount: 100,
    discountBadge: "MAX SAVINGS",
    description: "Whale Package - Maximum reward bonus"
  }
];
var initialData = {
  users: [
    {
      id: "usr-admin",
      fullName: "Platform Admin",
      username: "admin",
      email: "admin@cryptorewards.io",
      phone: "+1 (555) 019-2831",
      role: "admin",
      createdAt: "2026-01-10T10:00:00.000Z",
      balance: 1e4,
      totalEarnings: 0,
      pendingEarnings: 0
    },
    {
      id: "usr-demo",
      fullName: "Alex Morgan",
      username: "alexm",
      email: "demo@cryptorewards.io",
      phone: "+1 (555) 014-9922",
      role: "user",
      createdAt: "2026-02-01T14:30:00.000Z",
      balance: 350,
      totalEarnings: 120,
      pendingEarnings: 45
    }
  ],
  passwords: {
    "usr-admin": "adminio.1234",
    "usr-demo": "user123"
  },
  orders: [
    {
      id: "ORD-882910",
      userId: "usr-demo",
      username: "alexm",
      userEmail: "demo@cryptorewards.io",
      receiveAmount: 100,
      payAmount: 10,
      network: "TRC20",
      walletAddress: "TG1LiM1h3iLf654gAx1msadrDf65q2AbAC",
      status: "Completed",
      createdAt: new Date(Date.now() - 864e5 * 2).toISOString(),
      expiresAt: new Date(Date.now() - 864e5 * 2 + 9e5).toISOString(),
      txHash: "0x3a9b8f1e2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f",
      notes: "Payment verified on TRC20 network"
    },
    {
      id: "ORD-882915",
      userId: "usr-demo",
      username: "alexm",
      userEmail: "demo@cryptorewards.io",
      receiveAmount: 250,
      payAmount: 25,
      network: "TRC20",
      walletAddress: "TG1LiM1h3iLf654gAx1msadrDf65q2AbAC",
      status: "Completed",
      createdAt: new Date(Date.now() - 864e5 * 1).toISOString(),
      expiresAt: new Date(Date.now() - 864e5 * 1 + 9e5).toISOString(),
      txHash: "0x7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8",
      notes: "Payment verified on TRC20 network"
    }
  ],
  clippingApps: [
    {
      id: "CLIP-4401",
      userId: "usr-demo",
      username: "alexm",
      userEmail: "demo@cryptorewards.io",
      videoUrl: "https://www.tiktok.com/@alexm_crypto/video/7391827401928374",
      views: 45e3,
      estimatedReward: 45,
      status: "Pending",
      createdAt: new Date(Date.now() - 36e5 * 5).toISOString(),
      notes: "TikTok analytics screenshot uploaded"
    }
  ],
  withdrawals: [
    {
      id: "WTH-1092",
      userId: "usr-demo",
      username: "alexm",
      userEmail: "demo@cryptorewards.io",
      walletAddress: "TFAx9K3jLs82PqNm10WzXyC49102837465",
      network: "TRC20",
      amount: 50,
      status: "Approved",
      createdAt: new Date(Date.now() - 864e5 * 4).toISOString()
    }
  ],
  settings: {
    trc20WalletAddress: "TG1LiM1h3iLf654gAx1msadrDf65q2AbAC",
    clippingRatePer1k: 1,
    minWithdrawalAmount: 20,
    offers: defaultOffers
  }
};
var DB = class {
  constructor() {
    this.data = this.loadData();
  }
  loadData() {
    try {
      if (import_fs.default.existsSync(DATA_FILE)) {
        const raw = import_fs.default.readFileSync(DATA_FILE, "utf-8");
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error("Error reading data.json, falling back to initial default:", e);
    }
    this.saveData(initialData);
    return initialData;
  }
  saveData(data) {
    try {
      import_fs.default.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      console.error("Failed to write data.json:", e);
    }
  }
  // Users & Auth
  findUserByEmail(email) {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }
  findUserById(id) {
    return this.data.users.find((u) => u.id === id);
  }
  findUserByUsername(username) {
    return this.data.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  }
  verifyPassword(userId, pass) {
    return this.data.passwords[userId] === pass;
  }
  createUser(userData, password) {
    const newUser = {
      ...userData,
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1e3)}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      balance: 0,
      totalEarnings: 0,
      pendingEarnings: 0
    };
    this.data.users.push(newUser);
    this.data.passwords[newUser.id] = password;
    this.saveData(this.data);
    return newUser;
  }
  updateUserProfile(userId, updates) {
    const user = this.findUserById(userId);
    if (!user) throw new Error("User not found");
    if (updates.fullName) user.fullName = updates.fullName;
    if (updates.phone !== void 0) user.phone = updates.phone;
    if (updates.email) user.email = updates.email;
    this.saveData(this.data);
    return user;
  }
  updateUserBalance(userId, deltaBalance, deltaTotalEarnings = 0, deltaPendingEarnings = 0) {
    const user = this.findUserById(userId);
    if (!user) throw new Error("User not found");
    user.balance = Math.max(0, user.balance + deltaBalance);
    user.totalEarnings = Math.max(0, user.totalEarnings + deltaTotalEarnings);
    user.pendingEarnings = Math.max(0, user.pendingEarnings + deltaPendingEarnings);
    this.saveData(this.data);
    return user;
  }
  // Offers
  getOffers() {
    const offers = this.data.settings.offers || defaultOffers;
    const now = Date.now();
    return offers.filter((offer) => {
      if (!offer.expiresAt) return true;
      return new Date(offer.expiresAt).getTime() > now;
    });
  }
  getAllOffersAdmin() {
    return this.data.settings.offers || defaultOffers;
  }
  createOffer(offerData) {
    const newOffer = {
      ...offerData,
      id: `OFFER-${Date.now()}-${Math.floor(Math.random() * 1e3)}`
    };
    if (!this.data.settings.offers) {
      this.data.settings.offers = [];
    }
    this.data.settings.offers.push(newOffer);
    this.saveData(this.data);
    return newOffer;
  }
  deleteOffer(offerId) {
    if (this.data.settings.offers) {
      this.data.settings.offers = this.data.settings.offers.filter((o) => o.id !== offerId);
      this.saveData(this.data);
    }
  }
  // Orders
  createOrder(userId, receiveAmount, payAmount) {
    const user = this.findUserById(userId);
    if (!user) throw new Error("User not found");
    const now = /* @__PURE__ */ new Date();
    const expiresAt = new Date(now.getTime() + 15 * 60 * 1e3);
    const order = {
      id: `ORD-${Math.floor(1e5 + Math.random() * 9e5)}`,
      userId: user.id,
      username: user.username,
      userEmail: user.email,
      receiveAmount,
      payAmount,
      network: "TRC20",
      walletAddress: this.data.settings.trc20WalletAddress,
      status: "Pending",
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString()
    };
    this.data.orders.unshift(order);
    this.saveData(this.data);
    return order;
  }
  markOrderPaid(orderId, txHash, proofDataUrl) {
    const order = this.data.orders.find((o) => o.id === orderId);
    if (!order) throw new Error("Order not found");
    if (txHash) order.txHash = txHash;
    if (proofDataUrl) order.paymentProofUrl = proofDataUrl;
    order.notes = "User submitted payment verification";
    this.saveData(this.data);
    return order;
  }
  updateOrderStatus(orderId, status, notes) {
    const order = this.data.orders.find((o) => o.id === orderId);
    if (!order) throw new Error("Order not found");
    const prevStatus = order.status;
    order.status = status;
    if (notes) order.notes = notes;
    if (status === "Completed" && prevStatus !== "Completed") {
      this.updateUserBalance(order.userId, order.receiveAmount, order.receiveAmount, 0);
    }
    this.saveData(this.data);
    return order;
  }
  getOrdersByUserId(userId) {
    return this.data.orders.filter((o) => o.userId === userId);
  }
  getAllOrders() {
    return this.data.orders;
  }
  // Clipping Applications
  createClippingApp(userId, videoUrl, screenshotName, screenshotDataUrl) {
    const user = this.findUserById(userId);
    if (!user) throw new Error("User not found");
    const app2 = {
      id: `CLIP-${Math.floor(1e3 + Math.random() * 9e3)}`,
      userId: user.id,
      username: user.username,
      userEmail: user.email,
      videoUrl,
      screenshotName,
      screenshotDataUrl,
      status: "Pending",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.clippingApps.unshift(app2);
    this.saveData(this.data);
    return app2;
  }
  getClippingAppsByUserId(userId) {
    return this.data.clippingApps.filter((a) => a.userId === userId);
  }
  getAllClippingApps() {
    return this.data.clippingApps;
  }
  updateClippingStatus(appId, status, views, rewardAmount, notes) {
    const app2 = this.data.clippingApps.find((a) => a.id === appId);
    if (!app2) throw new Error("Application not found");
    const prevStatus = app2.status;
    app2.status = status;
    if (views !== void 0) app2.views = views;
    if (rewardAmount !== void 0) app2.estimatedReward = rewardAmount;
    if (notes) app2.notes = notes;
    if (status === "Approved" && prevStatus !== "Approved" && app2.estimatedReward) {
      this.updateUserBalance(app2.userId, app2.estimatedReward, app2.estimatedReward, -app2.estimatedReward);
    }
    this.saveData(this.data);
    return app2;
  }
  // Withdrawals
  createWithdrawal(userId, walletAddress, amount) {
    const user = this.findUserById(userId);
    if (!user) throw new Error("User not found");
    if (amount < this.data.settings.minWithdrawalAmount) {
      throw new Error(`Minimum withdrawal amount is $${this.data.settings.minWithdrawalAmount}`);
    }
    if (user.balance < amount) {
      throw new Error("Insufficient balance");
    }
    this.updateUserBalance(userId, -amount);
    const withdrawal = {
      id: `WTH-${Math.floor(1e3 + Math.random() * 9e3)}`,
      userId: user.id,
      username: user.username,
      userEmail: user.email,
      walletAddress,
      network: "TRC20",
      amount,
      status: "Pending",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.withdrawals.unshift(withdrawal);
    this.saveData(this.data);
    return withdrawal;
  }
  getWithdrawalsByUserId(userId) {
    return this.data.withdrawals.filter((w) => w.userId === userId);
  }
  getAllWithdrawals() {
    return this.data.withdrawals;
  }
  updateWithdrawalStatus(withdrawalId, status, notes) {
    const withdrawal = this.data.withdrawals.find((w) => w.id === withdrawalId);
    if (!withdrawal) throw new Error("Withdrawal request not found");
    const prevStatus = withdrawal.status;
    withdrawal.status = status;
    if (notes) withdrawal.notes = notes;
    if (status === "Rejected" && prevStatus === "Pending") {
      this.updateUserBalance(withdrawal.userId, withdrawal.amount);
    }
    this.saveData(this.data);
    return withdrawal;
  }
  // Settings
  getSettings() {
    return this.data.settings;
  }
  updateSettings(updates) {
    this.data.settings = {
      ...this.data.settings,
      ...updates
    };
    this.saveData(this.data);
    return this.data.settings;
  }
  // Stats for Admin
  getStats() {
    const totalUsers = this.data.users.length;
    const totalOrders = this.data.orders.length;
    const pendingOrders = this.data.orders.filter((o) => o.status === "Pending").length;
    const completedOrders = this.data.orders.filter((o) => o.status === "Completed").length;
    const totalClippingApps = this.data.clippingApps.length;
    const approvedClippingApps = this.data.clippingApps.filter((c) => c.status === "Approved").length;
    const totalRevenue = this.data.orders.filter((o) => o.status === "Completed").reduce((sum, o) => sum + o.payAmount, 0);
    const totalUsdtDistributed = this.data.orders.filter((o) => o.status === "Completed").reduce((sum, o) => sum + o.receiveAmount, 0);
    return {
      totalUsers,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalClippingApps,
      approvedClippingApps,
      totalRevenue,
      totalUsdtDistributed
    };
  }
  getAllUsers() {
    return this.data.users;
  }
};
var db = new DB();

// server.ts
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "20mb" }));
app.use(import_express.default.urlencoded({ extended: true, limit: "20mb" }));
var authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Authentication required" });
  }
  const token = authHeader.replace("Bearer ", "").trim();
  const userId = token.startsWith("user-") ? token.replace("user-", "") : token;
  const user = db.findUserById(userId);
  if (!user) {
    return res.status(401).json({ error: "Invalid authentication token" });
  }
  req.user = user;
  next();
};
var requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};
app.post("/api/auth/register", (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;
    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (db.findUserByEmail(email)) {
      return res.status(400).json({ error: "Email address is already registered" });
    }
    if (db.findUserByUsername(username)) {
      return res.status(400).json({ error: "Username is already taken" });
    }
    const newUser = db.createUser({ fullName, username, email, role: "user" }, password);
    const token = `user-${newUser.id}`;
    res.status(201).json({ user: newUser, token });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to register" });
  }
});
app.post("/api/auth/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    if (!db.verifyPassword(user.id, password)) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const token = `user-${user.id}`;
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message || "Login failed" });
  }
});
app.get("/api/auth/me", authenticateUser, (req, res) => {
  const user = db.findUserById(req.user.id);
  res.json({ user });
});
app.put("/api/users/profile", authenticateUser, (req, res) => {
  try {
    const { fullName, phone, email } = req.body;
    const updatedUser = db.updateUserProfile(req.user.id, { fullName, phone, email });
    res.json({ user: updatedUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.get("/api/offers", (_req, res) => {
  res.json({ offers: db.getOffers() });
});
app.get("/api/settings", (_req, res) => {
  const settings = db.getSettings();
  res.json({
    trc20WalletAddress: settings.trc20WalletAddress,
    clippingRatePer1k: settings.clippingRatePer1k,
    minWithdrawalAmount: settings.minWithdrawalAmount,
    offers: settings.offers
  });
});
app.post("/api/orders", authenticateUser, (req, res) => {
  try {
    const { receiveAmount, payAmount } = req.body;
    if (!receiveAmount || !payAmount) {
      return res.status(400).json({ error: "Invalid order parameters" });
    }
    const order = db.createOrder(req.user.id, Number(receiveAmount), Number(payAmount));
    res.status(201).json({ order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.post("/api/orders/:id/pay", authenticateUser, (req, res) => {
  try {
    const { txHash, proofDataUrl } = req.body;
    const order = db.markOrderPaid(req.params.id, txHash, proofDataUrl);
    res.json({ order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.get("/api/orders/my", authenticateUser, (req, res) => {
  const orders = db.getOrdersByUserId(req.user.id);
  res.json({ orders });
});
app.post("/api/clipping/submit", authenticateUser, (req, res) => {
  try {
    const { videoUrl, screenshotName, screenshotDataUrl } = req.body;
    if (!videoUrl || !videoUrl.includes("tiktok.com")) {
      return res.status(400).json({ error: "Valid TikTok video URL is required" });
    }
    const appItem = db.createClippingApp(req.user.id, videoUrl, screenshotName, screenshotDataUrl);
    res.status(201).json({ application: appItem });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.get("/api/clipping/my", authenticateUser, (req, res) => {
  const apps = db.getClippingAppsByUserId(req.user.id);
  res.json({ applications: apps });
});
app.post("/api/withdraw", authenticateUser, (req, res) => {
  try {
    const { walletAddress, amount } = req.body;
    if (!walletAddress || walletAddress.trim().length < 10) {
      return res.status(400).json({ error: "Please enter a valid USDT TRC20 wallet address" });
    }
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ error: "Invalid withdrawal amount" });
    }
    const withdrawal = db.createWithdrawal(req.user.id, walletAddress, numAmount);
    res.status(201).json({ withdrawal });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.get("/api/withdraw/my", authenticateUser, (req, res) => {
  const withdrawals = db.getWithdrawalsByUserId(req.user.id);
  res.json({ withdrawals });
});
app.get("/api/admin/stats", authenticateUser, requireAdmin, (_req, res) => {
  res.json({ stats: db.getStats() });
});
app.get("/api/admin/users", authenticateUser, requireAdmin, (_req, res) => {
  res.json({ users: db.getAllUsers() });
});
app.get("/api/admin/orders", authenticateUser, requireAdmin, (_req, res) => {
  res.json({ orders: db.getAllOrders() });
});
app.post("/api/admin/orders/:id/status", authenticateUser, requireAdmin, (req, res) => {
  try {
    const { status, notes } = req.body;
    if (!["Completed", "Rejected", "Cancelled", "Pending"].includes(status)) {
      return res.status(400).json({ error: "Invalid order status" });
    }
    const order = db.updateOrderStatus(req.params.id, status, notes);
    res.json({ order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.get("/api/admin/clipping", authenticateUser, requireAdmin, (_req, res) => {
  res.json({ applications: db.getAllClippingApps() });
});
app.post("/api/admin/clipping/:id/status", authenticateUser, requireAdmin, (req, res) => {
  try {
    const { status, views, rewardAmount, notes } = req.body;
    if (!["Approved", "Rejected", "Pending"].includes(status)) {
      return res.status(400).json({ error: "Invalid application status" });
    }
    const application = db.updateClippingStatus(
      req.params.id,
      status,
      views ? Number(views) : void 0,
      rewardAmount ? Number(rewardAmount) : void 0,
      notes
    );
    res.json({ application });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.get("/api/admin/withdrawals", authenticateUser, requireAdmin, (_req, res) => {
  res.json({ withdrawals: db.getAllWithdrawals() });
});
app.post("/api/admin/withdrawals/:id/status", authenticateUser, requireAdmin, (req, res) => {
  try {
    const { status, notes } = req.body;
    if (!["Approved", "Rejected", "Pending"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const withdrawal = db.updateWithdrawalStatus(req.params.id, status, notes);
    res.json({ withdrawal });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.get("/api/admin/offers", authenticateUser, requireAdmin, (_req, res) => {
  res.json({ offers: db.getAllOffersAdmin() });
});
app.post("/api/admin/offers", authenticateUser, requireAdmin, (req, res) => {
  try {
    const { receiveAmount, payAmount, popular, discountBadge, description, durationMinutes } = req.body;
    if (!receiveAmount || !payAmount) {
      return res.status(400).json({ error: "Receive amount and pay amount are required" });
    }
    let expiresAt = void 0;
    if (durationMinutes && Number(durationMinutes) > 0) {
      expiresAt = new Date(Date.now() + Number(durationMinutes) * 60 * 1e3).toISOString();
    }
    const offer = db.createOffer({
      receiveAmount: Number(receiveAmount),
      payAmount: Number(payAmount),
      popular: Boolean(popular),
      discountBadge: discountBadge || "FLASH DEAL",
      description,
      expiresAt
    });
    res.status(201).json({ offer });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.delete("/api/admin/offers/:id", authenticateUser, requireAdmin, (req, res) => {
  try {
    db.deleteOffer(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.put("/api/admin/settings", authenticateUser, requireAdmin, (req, res) => {
  try {
    const { trc20WalletAddress, clippingRatePer1k, minWithdrawalAmount, offers } = req.body;
    const settings = db.updateSettings({
      ...trc20WalletAddress && { trc20WalletAddress },
      ...clippingRatePer1k !== void 0 && { clippingRatePer1k: Number(clippingRatePer1k) },
      ...minWithdrawalAmount !== void 0 && { minWithdrawalAmount: Number(minWithdrawalAmount) },
      ...offers && { offers }
    });
    res.json({ settings });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: `API route ${req.originalUrl} not found` });
});
app.use((err, req, res, _next) => {
  console.error("Unhandled server error:", err);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path2.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path2.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Crypto Rewards Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
