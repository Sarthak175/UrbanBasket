import { apiClient, handleApiError } from '@/lib/api';
import { CartItem } from '@/contexts/CartContext';

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'paypal' | 'stripe' | 'apple_pay' | 'google_pay';
  name: string;
  last4?: string;
  expiryDate?: string;
  isDefault: boolean;
}

export interface BillingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentRequest {
  userId: string;
  items: CartItem[];
  paymentMethodId: string;
  billingAddress: BillingAddress;
  totalAmount: number;
  currency: string;
}

export interface PaymentResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  transactionId: string;
  receiptUrl?: string;
  estimatedDelivery?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  billingAddress: BillingAddress;
  trackingNumber?: string;
}

export interface UPIPaymentRequest {
  transactionId: string;
  amount: number;
  merchantId: string;
  merchantName: string;
}

export interface UPIPaymentResponse {
  transactionId: string;
  status: 'pending' | 'completed' | 'failed';
  amount: number;
  timestamp: string;
  upiReferenceId?: string;
  errorMessage?: string;
}

export const paymentService = {
  /**
   * Get available payment methods for user
   */
  async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    try {
      // Mock payment methods
      const response = await new Promise<{ data: PaymentMethod[] }>((resolve) => {
        setTimeout(() => {
          const mockPaymentMethods: PaymentMethod[] = [
            {
              id: '1',
              type: 'credit_card',
              name: 'Visa ending in 4242',
              last4: '4242',
              expiryDate: '12/25',
              isDefault: true,
            },
            {
              id: '2',
              type: 'paypal',
              name: 'PayPal',
              isDefault: false,
            },
            {
              id: '3',
              type: 'apple_pay',
              name: 'Apple Pay',
              isDefault: false,
            },
          ];
          
          resolve({ data: mockPaymentMethods });
        }, 500);
      });
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Process payment
   */
  async processPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Mock payment processing
      const response = await new Promise<{ data: PaymentResponse }>((resolve, reject) => {
        setTimeout(() => {
          // Simulate payment processing with 90% success rate
          const isSuccess = Math.random() > 0.1;
          
          if (isSuccess) {
            const paymentResponse: PaymentResponse = {
              id: `payment_${Date.now()}`,
              status: 'completed',
              amount: paymentData.totalAmount,
              currency: paymentData.currency || 'INR',
              transactionId: `txn_${Math.random().toString(36).substr(2, 9)}`,
              receiptUrl: `https://receipts.shopease.com/payment_${Date.now()}`,
              estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            };
            
            resolve({ data: paymentResponse });
          } else {
            reject(new Error('Payment failed: Insufficient funds'));
          }
        }, 2000); // Simulate longer processing time
      });
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create order after successful payment
   */
  async createOrder(
    paymentResponse: PaymentResponse,
    paymentRequest: PaymentRequest
  ): Promise<Order> {
    try {
      const response = await new Promise<{ data: Order }>((resolve) => {
        setTimeout(() => {
          const order: Order = {
            id: `order_${Date.now()}`,
            userId: paymentRequest.userId,
            items: paymentRequest.items,
            totalAmount: paymentRequest.totalAmount,
            status: 'confirmed',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            billingAddress: paymentRequest.billingAddress,
            trackingNumber: `TRK${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
          };
          
          // Save order to localStorage (mock database)
          const orders = JSON.parse(localStorage.getItem('shopease_orders') || '[]');
          orders.push(order);
          localStorage.setItem('shopease_orders', JSON.stringify(orders));
          
          resolve({ data: order });
        }, 500);
      });
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get user orders
   */
  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const response = await new Promise<{ data: Order[] }>((resolve) => {
        setTimeout(() => {
          const orders = JSON.parse(localStorage.getItem('shopease_orders') || '[]');
          const userOrders = orders.filter((order: Order) => order.userId === userId);
          resolve({ data: userOrders });
        }, 500);
      });
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get order by ID
   */
  async getOrder(orderId: string): Promise<Order> {
    try {
      const response = await new Promise<{ data: Order }>((resolve, reject) => {
        setTimeout(() => {
          const orders = JSON.parse(localStorage.getItem('shopease_orders') || '[]');
          const order = orders.find((o: Order) => o.id === orderId);
          
          if (order) {
            resolve({ data: order });
          } else {
            reject(new Error('Order not found'));
          }
        }, 500);
      });
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Track order
   */
  async trackOrder(trackingNumber: string): Promise<{
    status: string;
    location: string;
    estimatedDelivery: string;
    updates: Array<{
      timestamp: string;
      status: string;
      location: string;
      description: string;
    }>;
  }> {
    try {
      const response = await new Promise<{ data: any }>((resolve) => {
        setTimeout(() => {
          const trackingInfo = {
            status: 'In Transit',
            location: 'Distribution Center, Your City',
            estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            updates: [
              {
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'Order Placed',
                location: 'ShopEase Warehouse',
                description: 'Your order has been received and is being processed',
              },
              {
                timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'Shipped',
                location: 'ShopEase Warehouse',
                description: 'Your order has been shipped',
              },
              {
                timestamp: new Date().toISOString(),
                status: 'In Transit',
                location: 'Distribution Center, Your City',
                description: 'Package is on its way to you',
              },
            ],
          };
          
          resolve({ data: trackingInfo });
        }, 800);
      });
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Validate payment details
   */
  async validatePaymentDetails(paymentMethodId: string, amount: number): Promise<boolean> {
    try {
      const response = await new Promise<{ data: boolean }>((resolve) => {
        setTimeout(() => {
          // Mock validation - always returns true for demo
          resolve({ data: true });
        }, 800);
      });
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Verify UPI payment status
   */
  async verifyUPIPayment(paymentRequest: UPIPaymentRequest): Promise<UPIPaymentResponse> {
    try {
      // Simulate API call to UPI server for payment verification
      const response = await new Promise<{ data: UPIPaymentResponse }>((resolve, reject) => {
        setTimeout(() => {
          // Simulate different payment scenarios
          const random = Math.random();
          
          if (random < 0.7) {
            // 70% chance of successful payment
            const paymentResponse: UPIPaymentResponse = {
              transactionId: paymentRequest.transactionId,
              status: 'completed',
              amount: paymentRequest.amount,
              timestamp: new Date().toISOString(),
              upiReferenceId: `UPI_${Math.random().toString(36).substr(2, 12).toUpperCase()}`,
            };
            
            resolve({ data: paymentResponse });
          } else if (random < 0.9) {
            // 20% chance of pending payment
            const paymentResponse: UPIPaymentResponse = {
              transactionId: paymentRequest.transactionId,
              status: 'pending',
              amount: paymentRequest.amount,
              timestamp: new Date().toISOString(),
            };
            
            resolve({ data: paymentResponse });
          } else {
            // 10% chance of failed payment
            const paymentResponse: UPIPaymentResponse = {
              transactionId: paymentRequest.transactionId,
              status: 'failed',
              amount: paymentRequest.amount,
              timestamp: new Date().toISOString(),
              errorMessage: 'Insufficient balance or transaction declined',
            };
            
            resolve({ data: paymentResponse });
          }
        }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
      });
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Poll UPI payment status until completion
   */
  async pollUPIPaymentStatus(
    paymentRequest: UPIPaymentRequest,
    maxAttempts: number = 10,
    intervalMs: number = 3000
  ): Promise<UPIPaymentResponse> {
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      try {
        const response = await this.verifyUPIPayment(paymentRequest);
        
        if (response.status === 'completed') {
          return response;
        } else if (response.status === 'failed') {
          throw new Error(response.errorMessage || 'Payment failed');
        }
        
        // Wait before next attempt
        await new Promise(resolve => setTimeout(resolve, intervalMs));
        attempts++;
        
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) {
          throw error;
        }
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, intervalMs));
      }
    }
    
    throw new Error('Payment verification timeout');
  },
};
