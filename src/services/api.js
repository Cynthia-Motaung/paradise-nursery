// API service for future backend integration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const apiService = {
  async get(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return response.json();
  },

  async post(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return response.json();
  },

  async put(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return response.json();
  },

  async delete(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return response.json();
  }
};

// Product API methods
export const productAPI = {
  async getAll() {
    return apiService.get('/products');
  },

  async getById(id) {
    return apiService.get(`/products/${id}`);
  },

  async getByCategory(category) {
    return apiService.get(`/products/category/${category}`);
  }
};

// Cart API methods
export const cartAPI = {
  async get() {
    return apiService.get('/cart');
  },

  async addItem(item) {
    return apiService.post('/cart/items', item);
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