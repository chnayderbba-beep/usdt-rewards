import fs from 'fs';
import path from 'path';
import {
  User,
  USDTOffer,
  PaymentOrder,
  ClippingApplication,
  WithdrawalRequest,
  SystemSettings,
  DashboardStats,
  ApplicationStatus
} from '../types.js';

const DATA_FILE = path.join(process.cwd(), 'data.json');

interface DatabaseSchema {
  users: User[];
  passwords: Record<string, string>; // userId -> password plain/hash
  orders: PaymentOrder[];
  clippingApps: ClippingApplication[];
  withdrawals: WithdrawalRequest[];
  settings: SystemSettings;
}

const defaultOffers: USDTOffer[] = [
  {
    id: 'offer-generator',
    title: 'Generator',
    category: 'Special',
    payAmount: 100,
    billingPeriod: '/week',
    popular: true,
    discountBadge: 'SPECIAL OFFER',
    description: 'Generator Special Access - 100 USDT per week'
  },
  {
    id: 'offer-2',
    title: 'Pro Tier',
    category: 'Standard',
    receiveAmount: 250,
    payAmount: 25,
    popular: true,
    discountBadge: '90% OFF - POPULAR',
    description: 'Pro Tier - High demand reward allocation'
  },
  {
    id: 'offer-3',
    title: 'VIP Trader',
    category: 'Standard',
    receiveAmount: 500,
    payAmount: 50,
    discountBadge: '90% OFF',
    description: 'VIP Trader - Save $450 instantly'
  },
  {
    id: 'offer-4',
    title: 'Whale Package',
    category: 'Standard',
    receiveAmount: 1000,
    payAmount: 100,
    discountBadge: 'MAX SAVINGS',
    description: 'Whale Package - Maximum reward bonus'
  }
];

const initialData: DatabaseSchema = {
  users: [
    {
      id: 'usr-admin',
      fullName: 'Platform Admin',
      username: 'admin',
      email: 'admin@cryptorewards.io',
      phone: '+1 (555) 019-2831',
      role: 'admin',
      createdAt: '2026-01-10T10:00:00.000Z',
      balance: 10000,
      totalEarnings: 0,
      pendingEarnings: 0
    },
    {
      id: 'usr-demo',
      fullName: 'Alex Morgan',
      username: 'alexm',
      email: 'demo@cryptorewards.io',
      phone: '+1 (555) 014-9922',
      role: 'user',
      createdAt: '2026-02-01T14:30:00.000Z',
      balance: 350,
      totalEarnings: 120,
      pendingEarnings: 45
    }
  ],
  passwords: {
    'usr-admin': 'adminio.1234',
    'usr-demo': 'user123'
  },
  orders: [
    {
      id: 'ORD-882910',
      userId: 'usr-demo',
      username: 'alexm',
      userEmail: 'demo@cryptorewards.io',
      receiveAmount: 100,
      payAmount: 10,
      network: 'TRC20',
      walletAddress: 'TG1LiM1h3iLf654gAx1msadrDf65q2AbAC',
      status: 'Completed',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      expiresAt: new Date(Date.now() - 86400000 * 2 + 900000).toISOString(),
      txHash: '0x3a9b8f1e2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f',
      notes: 'Payment verified on TRC20 network'
    },
    {
      id: 'ORD-882915',
      userId: 'usr-demo',
      username: 'alexm',
      userEmail: 'demo@cryptorewards.io',
      receiveAmount: 250,
      payAmount: 25,
      network: 'TRC20',
      walletAddress: 'TG1LiM1h3iLf654gAx1msadrDf65q2AbAC',
      status: 'Completed',
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      expiresAt: new Date(Date.now() - 86400000 * 1 + 900000).toISOString(),
      txHash: '0x7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8',
      notes: 'Payment verified on TRC20 network'
    }
  ],
  clippingApps: [
    {
      id: 'CLIP-4401',
      userId: 'usr-demo',
      username: 'alexm',
      userEmail: 'demo@cryptorewards.io',
      videoUrl: 'https://www.tiktok.com/@alexm_crypto/video/7391827401928374',
      views: 45000,
      estimatedReward: 45,
      status: 'Pending',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      notes: 'TikTok analytics screenshot uploaded'
    }
  ],
  withdrawals: [
    {
      id: 'WTH-1092',
      userId: 'usr-demo',
      username: 'alexm',
      userEmail: 'demo@cryptorewards.io',
      walletAddress: 'TFAx9K3jLs82PqNm10WzXyC49102837465',
      network: 'TRC20',
      amount: 50,
      status: 'Approved',
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
    }
  ],
  settings: {
    trc20WalletAddress: 'TG1LiM1h3iLf654gAx1msadrDf65q2AbAC',
    clippingRatePer1k: 1.0,
    minWithdrawalAmount: 20.0,
    offers: defaultOffers
  }
};

class DB {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Error reading data.json, falling back to initial default:', e);
    }
    this.saveData(initialData);
    return initialData;
  }

  private saveData(data: DatabaseSchema) {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write data.json:', e);
    }
  }

  // Users & Auth
  public findUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public findUserByUsername(username: string): User | undefined {
    return this.data.users.find(u => u.username.toLowerCase() === username.toLowerCase());
  }

  public verifyPassword(userId: string, pass: string): boolean {
    return this.data.passwords[userId] === pass;
  }

  public createUser(userData: Omit<User, 'id' | 'createdAt' | 'balance' | 'totalEarnings' | 'pendingEarnings'>, password: string): User {
    const newUser: User = {
      ...userData,
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      balance: 0,
      totalEarnings: 0,
      pendingEarnings: 0
    };
    this.data.users.push(newUser);
    this.data.passwords[newUser.id] = password;
    this.saveData(this.data);
    return newUser;
  }

  public updateUserProfile(userId: string, updates: Partial<Pick<User, 'fullName' | 'phone' | 'email'>>): User {
    const user = this.findUserById(userId);
    if (!user) throw new Error('User not found');
    if (updates.fullName) user.fullName = updates.fullName;
    if (updates.phone !== undefined) user.phone = updates.phone;
    if (updates.email) user.email = updates.email;
    this.saveData(this.data);
    return user;
  }

  public updateUserBalance(userId: string, deltaBalance: number, deltaTotalEarnings: number = 0, deltaPendingEarnings: number = 0): User {
    const user = this.findUserById(userId);
    if (!user) throw new Error('User not found');
    user.balance = Math.max(0, user.balance + deltaBalance);
    user.totalEarnings = Math.max(0, user.totalEarnings + deltaTotalEarnings);
    user.pendingEarnings = Math.max(0, user.pendingEarnings + deltaPendingEarnings);
    this.saveData(this.data);
    return user;
  }

  // Offers
  public getOffers(): USDTOffer[] {
    const offers = this.data.settings.offers || defaultOffers;
    const now = Date.now();
    return offers.filter(offer => {
      if (!offer.expiresAt) return true;
      return new Date(offer.expiresAt).getTime() > now;
    });
  }

  public getAllOffersAdmin(): USDTOffer[] {
    return this.data.settings.offers || defaultOffers;
  }

  public createOffer(offerData: Omit<USDTOffer, 'id'>): USDTOffer {
    const newOffer: USDTOffer = {
      ...offerData,
      id: `OFFER-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    };
    if (!this.data.settings.offers) {
      this.data.settings.offers = [];
    }
    this.data.settings.offers.push(newOffer);
    this.saveData(this.data);
    return newOffer;
  }

  public deleteOffer(offerId: string): void {
    if (this.data.settings.offers) {
      this.data.settings.offers = this.data.settings.offers.filter(o => o.id !== offerId);
      this.saveData(this.data);
    }
  }

  // Orders
  public createOrder(userId: string, receiveAmount: number, payAmount: number): PaymentOrder {
    const user = this.findUserById(userId);
    if (!user) throw new Error('User not found');

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 15 * 60 * 1000); // 15 min expiry

    const order: PaymentOrder = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: user.id,
      username: user.username,
      userEmail: user.email,
      receiveAmount,
      payAmount,
      network: 'TRC20',
      walletAddress: this.data.settings.trc20WalletAddress,
      status: 'Pending',
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString()
    };

    this.data.orders.unshift(order);
    this.saveData(this.data);
    return order;
  }

  public markOrderPaid(orderId: string, txHash?: string, proofDataUrl?: string): PaymentOrder {
    const order = this.data.orders.find(o => o.id === orderId);
    if (!order) throw new Error('Order not found');
    if (txHash) order.txHash = txHash;
    if (proofDataUrl) order.paymentProofUrl = proofDataUrl;
    order.notes = 'User submitted payment verification';
    this.saveData(this.data);
    return order;
  }

  public updateOrderStatus(orderId: string, status: 'Completed' | 'Rejected' | 'Cancelled', notes?: string): PaymentOrder {
    const order = this.data.orders.find(o => o.id === orderId);
    if (!order) throw new Error('Order not found');
    
    const prevStatus = order.status;
    order.status = status;
    if (notes) order.notes = notes;

    // If order is approved/completed for the first time, credit the user's USDT balance!
    if (status === 'Completed' && prevStatus !== 'Completed') {
      this.updateUserBalance(order.userId, order.receiveAmount, order.receiveAmount, 0);
    }

    this.saveData(this.data);
    return order;
  }

  public getOrdersByUserId(userId: string): PaymentOrder[] {
    return this.data.orders.filter(o => o.userId === userId);
  }

  public getAllOrders(): PaymentOrder[] {
    return this.data.orders;
  }

  // Clipping Applications
  public createClippingApp(userId: string, videoUrl: string, screenshotName?: string, screenshotDataUrl?: string): ClippingApplication {
    const user = this.findUserById(userId);
    if (!user) throw new Error('User not found');

    const app: ClippingApplication = {
      id: `CLIP-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: user.id,
      username: user.username,
      userEmail: user.email,
      videoUrl,
      screenshotName,
      screenshotDataUrl,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    this.data.clippingApps.unshift(app);
    this.saveData(this.data);
    return app;
  }

  public getClippingAppsByUserId(userId: string): ClippingApplication[] {
    return this.data.clippingApps.filter(a => a.userId === userId);
  }

  public getAllClippingApps(): ClippingApplication[] {
    return this.data.clippingApps;
  }

  public updateClippingStatus(appId: string, status: ApplicationStatus, views?: number, rewardAmount?: number, notes?: string): ClippingApplication {
    const app = this.data.clippingApps.find(a => a.id === appId);
    if (!app) throw new Error('Application not found');

    const prevStatus = app.status;
    app.status = status;
    if (views !== undefined) app.views = views;
    if (rewardAmount !== undefined) app.estimatedReward = rewardAmount;
    if (notes) app.notes = notes;

    // If approved, add reward amount to user balance & total earnings!
    if (status === 'Approved' && prevStatus !== 'Approved' && app.estimatedReward) {
      this.updateUserBalance(app.userId, app.estimatedReward, app.estimatedReward, -app.estimatedReward);
    }

    this.saveData(this.data);
    return app;
  }

  // Withdrawals
  public createWithdrawal(userId: string, walletAddress: string, amount: number): WithdrawalRequest {
    const user = this.findUserById(userId);
    if (!user) throw new Error('User not found');

    if (amount < this.data.settings.minWithdrawalAmount) {
      throw new Error(`Minimum withdrawal amount is $${this.data.settings.minWithdrawalAmount}`);
    }

    if (user.balance < amount) {
      throw new Error('Insufficient balance');
    }

    // Deduct balance immediately upon request
    this.updateUserBalance(userId, -amount);

    const withdrawal: WithdrawalRequest = {
      id: `WTH-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: user.id,
      username: user.username,
      userEmail: user.email,
      walletAddress,
      network: 'TRC20',
      amount,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    this.data.withdrawals.unshift(withdrawal);
    this.saveData(this.data);
    return withdrawal;
  }

  public getWithdrawalsByUserId(userId: string): WithdrawalRequest[] {
    return this.data.withdrawals.filter(w => w.userId === userId);
  }

  public getAllWithdrawals(): WithdrawalRequest[] {
    return this.data.withdrawals;
  }

  public updateWithdrawalStatus(withdrawalId: string, status: ApplicationStatus, notes?: string): WithdrawalRequest {
    const withdrawal = this.data.withdrawals.find(w => w.id === withdrawalId);
    if (!withdrawal) throw new Error('Withdrawal request not found');

    const prevStatus = withdrawal.status;
    withdrawal.status = status;
    if (notes) withdrawal.notes = notes;

    // If rejected after being pending, refund user balance
    if (status === 'Rejected' && prevStatus === 'Pending') {
      this.updateUserBalance(withdrawal.userId, withdrawal.amount);
    }

    this.saveData(this.data);
    return withdrawal;
  }

  // Settings
  public getSettings(): SystemSettings {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<SystemSettings>): SystemSettings {
    this.data.settings = {
      ...this.data.settings,
      ...updates
    };
    this.saveData(this.data);
    return this.data.settings;
  }

  // Stats for Admin
  public getStats(): DashboardStats {
    const totalUsers = this.data.users.length;
    const totalOrders = this.data.orders.length;
    const pendingOrders = this.data.orders.filter(o => o.status === 'Pending').length;
    const completedOrders = this.data.orders.filter(o => o.status === 'Completed').length;
    
    const totalClippingApps = this.data.clippingApps.length;
    const approvedClippingApps = this.data.clippingApps.filter(c => c.status === 'Approved').length;

    const totalRevenue = this.data.orders
      .filter(o => o.status === 'Completed')
      .reduce((sum, o) => sum + o.payAmount, 0);

    const totalUsdtDistributed = this.data.orders
      .filter(o => o.status === 'Completed')
      .reduce((sum, o) => sum + o.receiveAmount, 0);

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

  public getAllUsers(): User[] {
    return this.data.users;
  }
}

export const db = new DB();
