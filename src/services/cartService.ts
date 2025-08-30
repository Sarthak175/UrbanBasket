import { apiClient, handleApiError, CartRequest, CartItem } from '@/lib/api';
import { CartItem as ContextCartItem } from '@/contexts/CartContext';

export interface CartResponse {
  id: string;
  userId: string;
  products: CartItem[];
  total: number;
  discountedTotal: number;
  totalProducts: number;
  totalQuantity: number;
}

export const cartService = {
  /**
   * Get user's cart
   */
  async getCart(userId: string): Promise<ContextCartItem[]> {
    try {
      // Mock API call - in a real app, this would fetch from server
      const response = await new Promise<{ data: ContextCartItem[] }>((resolve) => {
        setTimeout(() => {
          const savedCart = localStorage.getItem(`shopease_cart_${userId}`);
          const cartItems = savedCart ? JSON.parse(savedCart) : [];
          resolve({ data: cartItems });
        }, 500);
      });
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Save cart to server
   */
  async saveCart(userId: string, cartItems: ContextCartItem[]): Promise<void> {
    try {
      // Mock API call - in a real app, this would save to server
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          localStorage.setItem(`shopease_cart_${userId}`, JSON.stringify(cartItems));
          resolve();
        }, 300);
      });
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Add item to cart
   */
  async addToCart(userId: string, productId: string, quantity: number = 1): Promise<ContextCartItem[]> {
    try {
      const currentCart = await this.getCart(userId);
      
      // Check if item already exists in cart
      const existingItemIndex = currentCart.findIndex(item => item.id === productId);
      
      let updatedCart: ContextCartItem[];
      
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        updatedCart = [...currentCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity,
        };
      } else {
        // Add new item (you would typically fetch product details from products service)
        const { productsService } = await import('./productsService');
        const product = await productsService.getProduct(productId);
        
        const newItem: ContextCartItem = {
          ...product,
          quantity,
        };
        
        updatedCart = [...currentCart, newItem];
      }
      
      // Save updated cart
      await this.saveCart(userId, updatedCart);
      
      return updatedCart;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Remove item from cart
   */
  async removeFromCart(userId: string, productId: string): Promise<ContextCartItem[]> {
    try {
      const currentCart = await this.getCart(userId);
      const updatedCart = currentCart.filter(item => item.id !== productId);
      
      await this.saveCart(userId, updatedCart);
      
      return updatedCart;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update item quantity in cart
   */
  async updateCartItemQuantity(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<ContextCartItem[]> {
    try {
      if (quantity <= 0) {
        return this.removeFromCart(userId, productId);
      }
      
      const currentCart = await this.getCart(userId);
      const updatedCart = currentCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      
      await this.saveCart(userId, updatedCart);
      
      return updatedCart;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Clear entire cart
   */
  async clearCart(userId: string): Promise<void> {
    try {
      await this.saveCart(userId, []);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Sync local cart with server cart
   */
  async syncCart(userId: string, localCart: ContextCartItem[]): Promise<ContextCartItem[]> {
    try {
      // Get server cart
      const serverCart = await this.getCart(userId);
      
      // Merge local and server carts (prioritize local changes)
      const mergedCart = [...localCart];
      
      // Add any server items that aren't in local cart
      serverCart.forEach(serverItem => {
        const existsInLocal = localCart.find(localItem => localItem.id === serverItem.id);
        if (!existsInLocal) {
          mergedCart.push(serverItem);
        }
      });
      
      // Save merged cart to server
      await this.saveCart(userId, mergedCart);
      
      return mergedCart;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get cart summary
   */
  async getCartSummary(userId: string): Promise<{
    totalItems: number;
    totalPrice: number;
    items: ContextCartItem[];
  }> {
    try {
      const cartItems = await this.getCart(userId);
      
      const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        totalItems,
        totalPrice,
        items: cartItems,
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
