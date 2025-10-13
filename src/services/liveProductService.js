// src/services/liveProductService.js
const PERENUAL_API_KEY = process.env.REACT_APP_PERENUAL_API_KEY;
const PERENUAL_BASE_URL = 'https://perenual.com/api';

// Fallback plant images in case API images are missing
const FALLBACK_IMAGES = {
  indoor: [
    'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1486082570281-d942afe5ed3a?w=400&h=400&fit=crop'
  ],
  outdoor: [
    'https://images.unsplash.com/photo-1463154545680-d59320fd685d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1598880940083-28df9d48d82a?w=400&h=400&fit=crop'
  ],
  succulent: [
    'https://images.unsplash.com/photo-1518536064595-7c40a24db9fe?w=400&h=400&fit=crop'
  ]
};

export const liveProductService = {
  async getAll(page = 1) {
    try {
      console.log('🌱 Fetching live plant data from Perenual API...');
      
      const response = await fetch(
        `${PERENUAL_BASE_URL}/species-list?key=${PERENUAL_API_KEY}&page=${page}&indoor=1`
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid API response format');
      }

      // Transform API data to match your app structure
      const products = data.data.map((plant, index) => ({
        id: plant.id || index + 1,
        name: plant.common_name || 'Beautiful Plant',
        scientificName: plant.scientific_name && plant.scientific_name.length > 0 
          ? plant.scientific_name[0] 
          : 'Plant species',
        price: this.generatePrice(plant.id || index),
        image: plant.default_image?.thumbnail || this.getFallbackImage(plant.cycle, index),
        category: this.mapCycleToCategory(plant.cycle),
        description: plant.description 
          ? plant.description.substring(0, 150) + '...' 
          : 'A beautiful plant that will enhance your living space. Easy to care for and perfect for beginners.',
        inStock: Math.random() > 0.2, // 80% in stock
        rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)), // Random rating 3.5-5.0
        water: plant.watering || 'Moderate',
        sunlight: plant.sunlight && plant.sunlight.length > 0 ? plant.sunlight[0] : 'Partial sun',
        careLevel: this.mapCareLevel(plant.maintenance),
        size: this.generateSize(plant.id)
      }));
      
      console.log(`✅ Successfully loaded ${products.length} plants`);
      return { data: products };
      
    } catch (error) {
      console.error('❌ Error fetching live plant data:', error);
      throw new Error(`Unable to fetch plant data: ${error.message}`);
    }
  },

  async getById(id) {
    try {
      console.log(`🌱 Fetching details for plant ID: ${id}`);
      
      const response = await fetch(
        `${PERENUAL_BASE_URL}/species/details/${id}?key=${PERENUAL_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const plant = await response.json();
      
      return {
        id: plant.id,
        name: plant.common_name || 'Unknown Plant',
        scientificName: plant.scientific_name?.[0] || '',
        price: this.generatePrice(plant.id),
        image: plant.default_image?.regular_url || this.getFallbackImage(plant.cycle, plant.id),
        category: this.mapCycleToCategory(plant.cycle),
        description: plant.description || 'No description available. This beautiful plant will enhance your space with its natural beauty.',
        careInstructions: {
          water: plant.watering || 'When soil is dry',
          sunlight: plant.sunlight?.join(', ') || 'Bright indirect light',
          humidity: plant.humidity || 'Average',
          soil: plant.soil || 'Well-draining potting mix',
          pruning: plant.pruning_month?.join(', ') || 'As needed'
        },
        inStock: Math.random() > 0.2,
        rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
        size: this.generateSize(plant.id)
      };
    } catch (error) {
      console.error('Error fetching plant details:', error);
      throw error;
    }
  },

  async getByCategory(category) {
    try {
      const allProducts = await this.getAll();
      return allProducts.data.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
    } catch (error) {
      console.error('Error filtering by category:', error);
      throw error;
    }
  },

  // Helper methods
  generatePrice(id) {
    const basePrice = 12.99;
    const variation = (id % 50) + 10; // $12.99 - $62.99
    return parseFloat((basePrice + variation).toFixed(2));
  },

  mapCycleToCategory(cycle) {
    const cycleMap = {
      'Perennial': 'Outdoor',
      'Annual': 'Outdoor', 
      'Biennial': 'Outdoor',
      'Herbaceous': 'Indoor',
      'Woody': 'Outdoor',
      'null': 'Indoor'
    };
    return cycleMap[cycle] || 'Indoor';
  },

  mapCareLevel(maintenance) {
    if (!maintenance) return 'Moderate';
    const lowMaintenance = ['Low', 'Easy', 'Minimal'];
    return lowMaintenance.includes(maintenance) ? 'Easy' : 'Moderate';
  },

  getFallbackImage(cycle, index) {
    const category = this.mapCycleToCategory(cycle);
    const images = FALLBACK_IMAGES[category.toLowerCase()] || FALLBACK_IMAGES.indoor;
    return images[index % images.length];
  },

  generateSize(id) {
    const sizes = ['Small', 'Medium', 'Large'];
    return sizes[id % sizes.length];
  }
};