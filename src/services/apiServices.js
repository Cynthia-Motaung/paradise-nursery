
import { logger } from '../utils/logger';
import { createError, ErrorCodes, withErrorHandling } from '../utils/errorHandler';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = this.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const startTime = Date.now();
    
    try {
      const response = await fetch(url, config);
      const responseTime = Date.now() - startTime;

      logger.api.debug(`API ${options.method || 'GET'} ${endpoint}`, {
        status: response.status,
        responseTime: `${responseTime}ms`
      });

      if (!response.ok) {
        throw await this.handleError(response, endpoint);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      logger.api.error(`API request failed: ${endpoint}`, error, { endpoint, options });
      throw error;
    }
  }

  async handleError(response, endpoint) {
    let errorMessage = 'An error occurred';
    let errorData;

    try {
      errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }

    const error = createError(errorMessage, ErrorCodes.NETWORK_ERROR, {
      status: response.status,
      endpoint,
      data: errorData
    });

    // Handle specific status codes
    if (response.status === 401) {
      // Unauthorized - clear token and redirect to login
      this.clearAuthToken();
      window.location.href = '/';
    } else if (response.status === 429) {
      // Rate limited
      error.message = 'Too many requests. Please try again later.';
    }

    return error;
  }

  getAuthToken() {
    // Get token from Auth0 or localStorage
    return localStorage.getItem('auth_token');
  }

  setAuthToken(token) {
    localStorage.setItem('auth_token', token);
  }

  clearAuthToken() {
    localStorage.removeItem('auth_token');
  }

  // HTTP method shortcuts
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Create singleton instance
export const apiService = new ApiService();

// Product API methods
export const productAPI = {
  async getAll(filters = {}) {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    
    return apiService.get(endpoint);
  },

  async getById(id) {
    if (!id) throw createError('Product ID is required', ErrorCodes.VALIDATION_ERROR);
    return apiService.get(`/products/${id}`);
  },

  async getByCategory(category, filters = {}) {
    const queryParams = new URLSearchParams({ category, ...filters });
    return apiService.get(`/products?${queryParams.toString()}`);
  },

  async search(query, filters = {}) {
    const queryParams = new URLSearchParams({ q: query, ...filters });
    return apiService.get(`/products/search?${queryParams.toString()}`);
  },

  async getCategories() {
    return apiService.get('/categories');
  }
};

// Cart API methods
export const cartAPI = {
  async get() {
    return apiService.get('/cart');
  },

  async addItem(productId, quantity = 1) {
    return apiService.post('/cart/items', { productId, quantity });
  },

  async updateItem(itemId, quantity) {
    return apiService.put(`/cart/items/${itemId}`, { quantity });
  },

  async removeItem(itemId) {
    return apiService.delete(`/cart/items/${itemId}`);
  },

  async clear() {
    return apiService.delete('/cart');
  }
};

// Order API methods
export const orderAPI = {
  async create(orderData) {
    return apiService.post('/orders', orderData);
  },

  async getById(orderId) {
    return apiService.get(`/orders/${orderId}`);
  },

  async getUserOrders() {
    return apiService.get('/orders/user');
  },

  async updateStatus(orderId, status) {
    return apiService.patch(`/orders/${orderId}/status`, { status });
  }
};

// User API methods
export const userAPI = {
  async getProfile() {
    return apiService.get('/user/profile');
  },

  async updateProfile(profileData) {
    return apiService.put('/user/profile', profileData);
  },

  async getPreferences() {
    return apiService.get('/user/preferences');
  },

  async updatePreferences(preferences) {
    return apiService.put('/user/preferences', preferences);
  }
};
