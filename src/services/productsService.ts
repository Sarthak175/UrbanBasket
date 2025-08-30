import { apiClient, handleApiError, ProductsResponse } from '@/lib/api';
import { Product } from '@/contexts/CartContext';
import { products as mockProducts } from '@/data/products';

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  skip?: number;
}

export const productsService = {
  /**
   * Get all products with optional filtering
   */
  async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    try {
      // Mock API call with filtering
      const response = await new Promise<{ data: ProductsResponse }>((resolve) => {
        setTimeout(() => {
          let filteredProducts = [...mockProducts];
          
          // Apply filters
          if (filters.category && filters.category !== 'All Categories') {
            filteredProducts = filteredProducts.filter(
              product => product.category === filters.category
            );
          }
          
          if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filteredProducts = filteredProducts.filter(
              product =>
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm)
            );
          }
          
          if (filters.minPrice !== undefined) {
            filteredProducts = filteredProducts.filter(
              product => product.price >= filters.minPrice!
            );
          }
          
          if (filters.maxPrice !== undefined) {
            filteredProducts = filteredProducts.filter(
              product => product.price <= filters.maxPrice!
            );
          }
          
          // Apply pagination
          const skip = filters.skip || 0;
          const limit = filters.limit || filteredProducts.length;
          const paginatedProducts = filteredProducts.slice(skip, skip + limit);
          
          resolve({
            data: {
              products: paginatedProducts,
              total: filteredProducts.length,
              skip,
              limit,
            },
          });
        }, 800); // Simulate network delay
      });
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get a single product by ID
   */
  async getProduct(id: string): Promise<Product> {
    try {
      const response = await new Promise<{ data: Product }>((resolve, reject) => {
        setTimeout(() => {
          const product = mockProducts.find(p => p.id === id);
          if (product) {
            resolve({ data: product });
          } else {
            reject(new Error('Product not found'));
          }
        }, 500);
      });
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get all product categories
   */
  async getCategories(): Promise<string[]> {
    try {
      const response = await new Promise<{ data: string[] }>((resolve) => {
        setTimeout(() => {
          const categories = [...new Set(mockProducts.map(p => p.category))];
          resolve({ data: categories });
        }, 300);
      });
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Search products
   */
  async searchProducts(query: string, filters: Omit<ProductFilters, 'search'> = {}): Promise<ProductsResponse> {
    return this.getProducts({ ...filters, search: query });
  },

  /**
   * Get featured products
   */
  async getFeaturedProducts(limit: number = 4): Promise<Product[]> {
    try {
      const response = await new Promise<{ data: Product[] }>((resolve) => {
        setTimeout(() => {
          // Return first few products as featured
          const featured = mockProducts.slice(0, limit);
          resolve({ data: featured });
        }, 500);
      });
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get products by category
   */
  async getProductsByCategory(category: string, limit?: number): Promise<Product[]> {
    try {
      const response = await this.getProducts({ category, limit });
      return response.products;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get related products
   */
  async getRelatedProducts(productId: string, limit: number = 4): Promise<Product[]> {
    try {
      const response = await new Promise<{ data: Product[] }>((resolve, reject) => {
        setTimeout(() => {
          const product = mockProducts.find(p => p.id === productId);
          if (!product) {
            reject(new Error('Product not found'));
            return;
          }
          
          // Get products from the same category, excluding the current product
          const related = mockProducts
            .filter(p => p.category === product.category && p.id !== productId)
            .slice(0, limit);
          
          resolve({ data: related });
        }, 500);
      });
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
