import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Collections API
export const collectionsAPI = {
  getAll: () => api.get('/collections'),
  getBySlug: (slug) => api.get(`/collections/${slug}`)
};

// Products API
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getBySlug: (slug) => api.get(`/products/${slug}`),
  getByCollection: (collectionSlug) => api.get(`/products/collection/${collectionSlug}`)
};

// Orders API
export const ordersAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getByOrderNumber: (orderNumber) => api.get(`/orders/${orderNumber}`)
};

// Content API
export const contentAPI = {
  getAll: async () => {
    const response = await api.get('/content');
    return response.data;
  },
  getByKey: async (pageKey) => {
    const response = await api.get(`/content/${pageKey}`);
    return response.data;
  },
  getByPageKey: async (pageKey) => {
    const response = await api.get(`/content/${pageKey}`);
    return response.data;
  }
};

// Settings API
export const settingsAPI = {
  getAll: async () => {
    const response = await api.get('/settings');
    // Backend returns { data: {...key: value}, all: [...] }
    // Return the key-value object for easier usage
    return response.data.data || {};
  },
  getByKey: async (key) => {
    const response = await api.get(`/settings/${key}`);
    return response.data.data;
  }
};

// Admin API
export const adminAPI = {
  authenticate: (password) => {
    api.defaults.headers['x-admin-password'] = password;
  },
  
  // Orders
  getOrders: (params) => api.get('/admin/orders', { params }),
  updateOrderStatus: (orderId, status) => 
    api.patch(`/admin/orders/${orderId}/status`, { status }),
  
  // Products
  createProduct: (productData) => api.post('/admin/products', productData),
  updateProduct: (productId, productData) => 
    api.patch(`/admin/products/${productId}`, productData),
  deleteProduct: (productId) => api.delete(`/admin/products/${productId}`),
  
  // Content Management
  getContent: () => api.get('/admin/content'),
  getContentByKey: (pageKey) => api.get(`/admin/content/${pageKey}`),
  createContent: (contentData) => api.post('/admin/content', contentData),
  updateContent: (id, contentData) => api.patch(`/admin/content/${id}`, contentData),
  deleteContent: (id) => api.delete(`/admin/content/${id}`),
  generateContent: (pageKey, context = {}) => api.post(`/admin/content/${pageKey}/generate`, context),
  
  // Stats
  getStats: () => api.get('/admin/stats')
};

export default api;
