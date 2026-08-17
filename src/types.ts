export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
  balance: number;
  totalEarnings: number;
  pendingEarnings: number;
}

export interface USDTOffer {
  id: string;
  title?: string;
  category?: string; // e.g., 'Standard' | 'Special'
  receiveAmount?: number;
  payAmount: number;
  billingPeriod?: string; // e.g. '/week' | 'week'
  popular?: boolean;
  discountBadge: string;
  description?: string;
  expiresAt?: string; // ISO string for expiration time
}

export type OrderStatus = 'Pending' | 'Completed' | 'Rejected' | 'Cancelled';

export interface PaymentOrder {
  id: string;
  userId: string;
  username: string;
  userEmail: string;
  receiveAmount: number;
  payAmount: number;
  network: string; // 'TRC20'
  walletAddress: string;
  status: OrderStatus;
  createdAt: string;
  expiresAt: string;
  txHash?: string;
  paymentProofUrl?: string;
  notes?: string;
}

export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected';

export interface ClippingApplication {
  id: string;
  userId: string;
  username: string;
  userEmail: string;
  videoUrl: string;
  screenshotName?: string;
  screenshotDataUrl?: string;
  views?: number;
  estimatedReward?: number;
  status: ApplicationStatus;
  createdAt: string;
  notes?: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  username: string;
  userEmail: string;
  walletAddress: string;
  network: string; // 'TRC20'
  amount: number;
  status: ApplicationStatus;
  createdAt: string;
  notes?: string;
}

export interface SystemSettings {
  trc20WalletAddress: string;
  clippingRatePer1k: number; // e.g., 1.00 ($1 per 1000 views)
  minWithdrawalAmount: number; // e.g., 20.00 ($20)
  offers: USDTOffer[];
}

export interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalClippingApps: number;
  approvedClippingApps: number;
  totalRevenue: number;
  totalUsdtDistributed: number;
}
