const ADMIN_PASSWORD_KEY = 'zoeys_admin_password';

// Get the API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

console.log('Admin API Base URL:', API_BASE_URL); // Debug log

export const adminAuth = {
  setPassword: (password) => {
    localStorage.setItem(ADMIN_PASSWORD_KEY, password);
  },

  getPassword: () => {
    return localStorage.getItem(ADMIN_PASSWORD_KEY);
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(ADMIN_PASSWORD_KEY);
  },

  logout: () => {
    localStorage.removeItem(ADMIN_PASSWORD_KEY);
  },

  getAuthHeaders: () => {
    const password = adminAuth.getPassword();
    return {
      'x-admin-password': password,
      'Content-Type': 'application/json'
    };
  }
};

export const adminAPI = {
  // Stats
  getStats: async () => {
    const url = `${API_BASE_URL}/api/admin/stats`;
    console.log('Fetching from:', url);
    const res = await fetch(url, {
      headers: adminAuth.getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  // Orders
  getOrders: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/api/admin/orders${query ? `?${query}` : ''}`;
    console.log('Fetching from:', url);
    const res = await fetch(url, {
      headers: adminAuth.getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  getOrder: async (id) => {
    const url = `${API_BASE_URL}/api/admin/orders/${id}`;
    const res = await fetch(url, {
      headers: adminAuth.getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch order');
    return res.json();
  },

  updateOrderStatus: async (id, status) => {
    const url = `${API_BASE_URL}/api/admin/orders/${id}/status`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: adminAuth.getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update order');
    return res.json();
  },

  // Products
  getProducts: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/api/admin/products${query ? `?${query}` : ''}`;
    console.log('Fetching from:', url);
    const res = await fetch(url, {
      headers: adminAuth.getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  createProduct: async (productData) => {
    const url = `${API_BASE_URL}/api/admin/products`;
    const res = await fetch(url, {
      method: 'POST',
      headers: adminAuth.getAuthHeaders(),
      body: JSON.stringify(productData)
    });
    if (!res.ok) throw new Error('Failed to create product');
    return res.json();
  },

  updateProduct: async (id, productData) => {
    const url = `${API_BASE_URL}/api/admin/products/${id}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: adminAuth.getAuthHeaders(),
      body: JSON.stringify(productData)
    });
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
  },

  deleteProduct: async (id) => {
    const url = `${API_BASE_URL}/api/admin/products/${id}`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: adminAuth.getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete product');
    return res.json();
  },

  // Collections
  getCollections: async () => {
    const url = `${API_BASE_URL}/api/admin/collections`;
    console.log('Fetching from:', url);
    const res = await fetch(url, {
      headers: adminAuth.getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch collections');
    return res.json();
  },

  createCollection: async (collectionData) => {
    const url = `${API_BASE_URL}/api/admin/collections`;
    const res = await fetch(url, {
      method: 'POST',
      headers: adminAuth.getAuthHeaders(),
      body: JSON.stringify(collectionData)
    });
    if (!res.ok) throw new Error('Failed to create collection');
    return res.json();
  },

  updateCollection: async (id, collectionData) => {
    const url = `${API_BASE_URL}/api/admin/collections/${id}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: adminAuth.getAuthHeaders(),
      body: JSON.stringify(collectionData)
    });
    if (!res.ok) throw new Error('Failed to update collection');
    return res.json();
  },

  deleteCollection: async (id) => {
    const url = `${API_BASE_URL}/api/admin/collections/${id}`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: adminAuth.getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete collection');
    return res.json();
  },

  // AI SEO Description
  generateSEODescription: async (productId) => {
    const url = `${API_BASE_URL}/api/admin/products/${productId}/generate-seo`;
    const res = await fetch(url, {
      method: 'POST',
      headers: adminAuth.getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to generate SEO description');
    return res.json();
  },

  // Page Content Management
  getContent: async () => {
    const url = `${API_BASE_URL}/api/admin/content`;
    const res = await fetch(url, {
      headers: adminAuth.getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch content');
    return res.json();
  },

  getContentByKey: async (pageKey) => {
    const url = `${API_BASE_URL}/api/admin/content/${pageKey}`;
    const res = await fetch(url, {
      headers: adminAuth.getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch content');
    return res.json();
  },

  createContent: async (contentData) => {
    const url = `${API_BASE_URL}/api/admin/content`;
    const res = await fetch(url, {
      method: 'POST',
      headers: adminAuth.getAuthHeaders(),
      body: JSON.stringify(contentData)
    });
    if (!res.ok) throw new Error('Failed to create content');
    return res.json();
  },

  updateContent: async (id, contentData) => {
    const url = `${API_BASE_URL}/api/admin/content/${id}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: adminAuth.getAuthHeaders(),
      body: JSON.stringify(contentData)
    });
    if (!res.ok) throw new Error('Failed to update content');
    return res.json();
  },

  deleteContent: async (id) => {
    const url = `${API_BASE_URL}/api/admin/content/${id}`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: adminAuth.getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete content');
    return res.json();
  },

  generateContent: async (pageKey, context = {}) => {
    const url = `${API_BASE_URL}/api/admin/content/${pageKey}/generate`;
    const res = await fetch(url, {
      method: 'POST',
      headers: adminAuth.getAuthHeaders(),
      body: JSON.stringify({ context })
    });
    if (!res.ok) throw new Error('Failed to generate content');
    return res.json();
  },

  // Site Settings Management
  getSettings: async () => {
    const url = `${API_BASE_URL}/api/admin/settings`;
    const res = await fetch(url, {
      headers: adminAuth.getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  saveSetting: async (settingData) => {
    const url = `${API_BASE_URL}/api/admin/settings`;
    const res = await fetch(url, {
      method: 'POST',
      headers: adminAuth.getAuthHeaders(),
      body: JSON.stringify(settingData)
    });
    if (!res.ok) throw new Error('Failed to save setting');
    return res.json();
  },

  updateSetting: async (id, settingData) => {
    const url = `${API_BASE_URL}/api/admin/settings/${id}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: adminAuth.getAuthHeaders(),
      body: JSON.stringify(settingData)
    });
    if (!res.ok) throw new Error('Failed to update setting');
    return res.json();
  },

  deleteSetting: async (id) => {
    const url = `${API_BASE_URL}/api/admin/settings/${id}`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: adminAuth.getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete setting');
    return res.json();
  }
};