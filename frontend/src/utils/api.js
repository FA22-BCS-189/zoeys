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
  getAll: () => api.get('/content'),
  getByPageKey: (pageKey) => api.get(`/content/${pageKey}`)
};

// Settings API
export const settingsAPI = {
  getAll: () => api.get('/settings'),
  getByKey: (key) => api.get(`/settings/${key}`)
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
  
  // Stats
  getStats: () => api.get('/admin/stats')
};

export default api;
