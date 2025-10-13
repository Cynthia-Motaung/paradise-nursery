// src/services/productService.js
import { liveProductService } from './liveProductService';
import { mockProductService } from './mockProductService';

const USE_LIVE_DATA = process.env.REACT_APP_USE_LIVE_DATA === 'true';

export const productService = {
  async getAll() {
    if (USE_LIVE_DATA && process.env.REACT_APP_PERENUAL_API_KEY) {
      try {
        return await liveProductService.getAll();
      } catch (error) {
        console.warn('🌱 Live data unavailable, using mock data:', error.message);
        return await mockProductService.getAll();
      }
    } else {
      console.log('🌱 Using mock plant data');
      return await mockProductService.getAll();
    }
  },

  async getById(id) {
    if (USE_LIVE_DATA && process.env.REACT_APP_PERENUAL_API_KEY) {
      try {
        return await liveProductService.getById(id);
      } catch (error) {
        console.warn('Falling back to mock data for product details');
        return await mockProductService.getById(id);
      }
    } else {
      return await mockProductService.getById(id);
    }
  },

  async getByCategory(category) {
    if (USE_LIVE_DATA && process.env.REACT_APP_PERENUAL_API_KEY) {
      try {
        return await liveProductService.getByCategory(category);
      } catch (error) {
        console.warn('Falling back to mock data for category');
        return await mockProductService.getByCategory(category);
      }
    } else {
      return await mockProductService.getByCategory(category);
    }
  }
};