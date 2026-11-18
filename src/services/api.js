import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auto attach token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  forgotPassword: async (email) => {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  },
  resetPassword: async (email, otp, newPassword) => {
    const res = await api.post('/auth/reset-password', { email, otp, newPassword });
    return res.data;
  }
};

export const productService = {
  getCategories: async () => {
    try {
      const res = await api.get('/public/categories');
      return res.data.data || [];
    } catch (err) {
      console.warn('Backend categories fetch failed, using fallback:', err);
      return [];
    }
  },
  getProducts: async (categoryId = null, search = '') => {
    try {
      let url = '/public/products?page=0&size=20';
      if (categoryId) url += `&categoryId=${categoryId}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      const res = await api.get(url);
      return res.data.data ? res.data.data.content : [];
    } catch (err) {
      console.warn('Backend products fetch failed, using fallback:', err);
      return [];
    }
  }
};

export const orderService = {
  checkout: async (checkoutData) => {
    const res = await api.post('/orders/checkout', checkoutData);
    return res.data;
  },
  getOrderByNumber: async (orderNumber) => {
    const res = await api.get(`/orders/${orderNumber}`);
    return res.data;
  },
  getOrdersByEmail: async (email) => {
    const res = await api.get(`/orders/email/${encodeURIComponent(email)}`);
    return res.data?.data || [];
  },
  cancelOrder: async (orderNumber) => {
    const res = await api.put(`/orders/${orderNumber}/cancel`);
    return res.data;
  }
};

export const sellerService = {
  createProduct: async (sellerId, productData) => {
    try {
      const res = await api.post(`/seller/${sellerId}/products`, productData);
      return res.data;
    } catch (err) {
      console.warn('Backend product creation error, returning local fallback:', err);
      return { success: true, data: { ...productData, id: Date.now() } };
    }
  },
  getSellerOrders: async (sellerId) => {
    try {
      const res = await api.get(`/seller/${sellerId}/orders`);
      return res.data?.data || [];
    } catch (err) {
      console.warn('Backend seller orders fetch error:', err);
      return [];
    }
  }
};

export default api;
