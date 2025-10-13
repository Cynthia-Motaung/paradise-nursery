// src/services/mockProductService.js
export const mockProductService = {
  async getAll() {
    // Return mock product data that matches your app structure
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [
            {
              id: 1,
              name: 'Monstera Deliciosa',
              price: 45.99,
              image: 'https://images.unsplash.com/photo-1525498128493-380d1990a112?w=400&h=400&fit=crop',
              category: 'Indoor',
              description: 'Beautiful Swiss Cheese Plant with unique leaf patterns. Perfect for modern interiors.',
              inStock: true,
              rating: 4.8,
              water: 'Weekly',
              sunlight: 'Indirect light',
              careLevel: 'Easy',
              size: 'Medium'
            },
            {
              id: 2,
              name: 'Snake Plant',
              price: 29.99,
              image: 'https://images.unsplash.com/photo-1593482892290-9d013abb5bd0?w=400&h=400&fit=crop',
              category: 'Indoor',
              description: 'Low maintenance plant perfect for beginners. Purifies air effectively.',
              inStock: true,
              rating: 4.6,
              water: 'Bi-weekly',
              sunlight: 'Low to bright light',
              careLevel: 'Very Easy',
              size: 'Small'
            },
            {
              id: 3,
              name: 'Fiddle Leaf Fig',
              price: 59.99,
              image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop',
              category: 'Indoor',
              description: 'Trendy tree with large, violin-shaped leaves. Makes a statement in any room.',
              inStock: false,
              rating: 4.7,
              water: 'Weekly',
              sunlight: 'Bright indirect light',
              careLevel: 'Moderate',
              size: 'Large'
            },
            {
              id: 4,
              name: 'Peace Lily',
              price: 35.99,
              image: 'https://images.unsplash.com/photo-1593696141132-8db60c8bb5bc?w=400&h=400&fit=crop',
              category: 'Indoor',
              description: 'Elegant plant with white flowers that purifies air. Great for offices and homes.',
              inStock: true,
              rating: 4.5,
              water: 'Weekly',
              sunlight: 'Low to medium light',
              careLevel: 'Easy',
              size: 'Medium'
            },
            {
              id: 5,
              name: 'Aloe Vera',
              price: 19.99,
              image: 'https://images.unsplash.com/photo-1525498128493-380d1990a112?w=400&h=400&fit=crop',
              category: 'Succulent',
              description: 'Medicinal plant that is easy to care for. Soothes burns and purifies air.',
              inStock: true,
              rating: 4.4,
              water: 'Every 2-3 weeks',
              sunlight: 'Bright light',
              careLevel: 'Easy',
              size: 'Small'
            },
            {
              id: 6,
              name: 'Spider Plant',
              price: 24.99,
              image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop',
              category: 'Hanging',
              description: 'Produces baby spiderettes, great for hanging baskets. Very easy to propagate.',
              inStock: true,
              rating: 4.3,
              water: 'Weekly',
              sunlight: 'Indirect light',
              careLevel: 'Very Easy',
              size: 'Small'
            },
            {
              id: 7,
              name: 'Pothos',
              price: 22.99,
              image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop',
              category: 'Hanging',
              description: 'Versatile trailing plant that grows well in various light conditions.',
              inStock: true,
              rating: 4.6,
              water: 'When soil is dry',
              sunlight: 'Low to bright light',
              careLevel: 'Very Easy',
              size: 'Small'
            },
            {
              id: 8,
              name: 'ZZ Plant',
              price: 39.99,
              image: 'https://images.unsplash.com/photo-1486082570281-d942afe5ed3a?w=400&h=400&fit=crop',
              category: 'Indoor',
              description: 'Extremely low maintenance plant that thrives on neglect. Perfect for busy people.',
              inStock: true,
              rating: 4.7,
              water: 'Every 2-3 weeks',
              sunlight: 'Low to bright light',
              careLevel: 'Very Easy',
              size: 'Medium'
            }
          ]
        });
      }, 800); // Simulate network delay
    });
  },

  async getById(id) {
    const products = await this.getAll();
    const productData = products.data || products;
    return productData.find(product => product.id === parseInt(id));
  },

  async getByCategory(category) {
    const products = await this.getAll();
    const productData = products.data || products;
    return productData.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  },

  async searchProducts(query) {
    const products = await this.getAll();
    const productData = products.data || products;
    return productData.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      (product.category && product.category.toLowerCase().includes(query.toLowerCase()))
    );
  }
};