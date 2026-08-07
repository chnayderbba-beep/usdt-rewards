import {
  User,
  USDTOffer,
  PaymentOrder,
  ClippingApplication,
  WithdrawalRequest,
  SystemSettings,
  DashboardStats
} from '../types';

const TOKEN_KEY = 'crypto_rewards_token';

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  const contentType = res.headers.get('content-type') || '';
  let data: any = {};

  if (contentType.includes('application/json')) {
    try {
      data = await res.json();
    } catch {
      data = {};
    }
  } else {
    const text = await res.text();
    if (!res.ok) {
      throw new Error(`Server error (${res.status}): ${text.slice(0, 100)}`);
    }
    throw new Error('Server returned non-JSON response');
  }

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  register: (fullName: string, username: string, email: string, password: string) =>
    fetchApi<{ user: User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName, username, email, password }),
    }),

  login: (email: string, password: string) =>
    fetchApi<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getMe: () => fetchApi<{ user: User }>('/api/auth/me'),

  updateProfile: (fullName?: string, phone?: string, email?: string) =>
    fetchApi<{ user: User }>('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify({ fullName, phone, email }),
    }),

  // Offers & Settings
  getOffers: () => fetchApi<{ offers: USDTOffer[] }>('/api/offers'),
  getSettings: () => fetchApi<SystemSettings>('/api/settings'),

  // Orders
  createOrder: (receiveAmount: number, payAmount: number) =>
    fetchApi<{ order: PaymentOrder }>('/api/orders', {
      method: 'POST',
      body: JSON.stringify({ receiveAmount, payAmount }),
    }),

  markOrderPaid: (orderId: string, txHash?: string, proofDataUrl?: string) =>
    fetchApi<{ order: PaymentOrder }>(`/api/orders/${orderId}/pay`, {
      method: 'POST',
      body: JSON.stringify({ txHash, proofDataUrl }),
    }),

  getMyOrders: () => fetchApi<{ orders: PaymentOrder[] }>('/api/orders/my'),

  // Clipping
  submitClippingApp: (videoUrl: string, screenshotName?: string, screenshotDataUrl?: string) =>
    fetchApi<{ application: ClippingApplication }>('/api/clipping/submit', {
      method: 'POST',
      body: JSON.stringify({ videoUrl, screenshotName, screenshotDataUrl }),
    }),

  getMyClippingApps: () => fetchApi<{ applications: ClippingApplication[] }>('/api/clipping/my'),

  // Withdrawals
  requestWithdrawal: (walletAddress: string, amount: number) =>
    fetchApi<{ withdrawal: WithdrawalRequest }>('/api/withdraw', {
      method: 'POST',
      body: JSON.stringify({ walletAddress, amount }),
    }),

  getMyWithdrawals: () => fetchApi<{ withdrawals: WithdrawalRequest[] }>('/api/withdraw/my'),

  // Admin
  getAdminStats: () => fetchApi<{ stats: DashboardStats }>('/api/admin/stats'),
  getAdminUsers: () => fetchApi<{ users: User[] }>('/api/admin/users'),
  getAdminOrders: () => fetchApi<{ orders: PaymentOrder[] }>('/api/admin/orders'),
  updateOrderStatus: (orderId: string, status: string, notes?: string) =>
    fetchApi<{ order: PaymentOrder }>(`/api/admin/orders/${orderId}/status`, {
      method: 'POST',
      body: JSON.stringify({ status, notes }),
    }),

  getAdminClippingApps: () => fetchApi<{ applications: ClippingApplication[] }>('/api/admin/clipping'),
  updateClippingStatus: (id: string, status: string, views?: number, rewardAmount?: number, notes?: string) =>
    fetchApi<{ application: ClippingApplication }>(`/api/admin/clipping/${id}/status`, {
      method: 'POST',
      body: JSON.stringify({ status, views, rewardAmount, notes }),
    }),

  getAdminWithdrawals: () => fetchApi<{ withdrawals: WithdrawalRequest[] }>('/api/admin/withdrawals'),
  updateWithdrawalStatus: (id: string, status: string, notes?: string) =>
    fetchApi<{ withdrawal: WithdrawalRequest }>(`/api/admin/withdrawals/${id}/status`, {
      method: 'POST',
      body: JSON.stringify({ status, notes }),
    }),

  updateAdminSettings: (data: Partial<SystemSettings>) =>
    fetchApi<{ settings: SystemSettings }>('/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getAdminOffers: () => fetchApi<{ offers: USDTOffer[] }>('/api/admin/offers'),

  createOffer: (offerData: {
    receiveAmount: number;
    payAmount: number;
    popular?: boolean;
    discountBadge?: string;
    description?: string;
    durationMinutes?: number;
  }) =>
    fetchApi<{ offer: USDTOffer }>('/api/admin/offers', {
      method: 'POST',
      body: JSON.stringify(offerData),
    }),

  deleteOffer: (id: string) =>
    fetchApi<{ success: boolean }>(`/api/admin/offers/${id}`, {
      method: 'DELETE',
    }),
};
