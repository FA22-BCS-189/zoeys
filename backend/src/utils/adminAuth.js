export const adminAPI = {
  async makeAuthenticatedRequest(url, options = {}) {
    const password = localStorage.getItem('admin-password');
    
    if (!password) {
      throw new Error('No authentication token found');
    }

    const headers = {
      'x-admin-password': password,
      'Content-Type': 'application/json',
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    // Handle authentication errors specifically
    if (response.status === 401) {
      // Clear the invalid password and redirect to login
      localStorage.removeItem('admin-password');
      window.location.href = '/admin/login';
      throw new Error('Authentication failed - please login again');
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url.split('/').pop()}`);
    }

    return response.json();
  },

  // ... rest of your methods remain the same
};

export const adminAuth = {
  getPassword() {
    return localStorage.getItem('admin-password');
  },

  setPassword(password) {
    localStorage.setItem('admin-password', password);
  },

  isAuthenticated() {
    const password = this.getPassword();
    return !!password;
  },

  logout() {
    localStorage.removeItem('admin-password');
    window.location.href = '/admin/login';
  },

  // Add this method to validate the stored password
  async validatePassword() {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/stats`, {
        method: 'GET',
        headers: {
          'x-admin-password': this.getPassword(),
          'Content-Type': 'application/json'
        }
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
};