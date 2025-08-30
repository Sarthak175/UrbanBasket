import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { productsService, ProductFilters } from '@/services/productsService';
import { cartService } from '@/services/cartService';
import { paymentService, PaymentRequest } from '@/services/paymentService';
import { toast } from 'sonner';

// Query keys
export const queryKeys = {
  auth: {
    profile: ['auth', 'profile'] as const,
  },
  products: {
    all: ['products'] as const,
    list: (filters: ProductFilters) => ['products', 'list', filters] as const,
    detail: (id: string) => ['products', 'detail', id] as const,
    categories: ['products', 'categories'] as const,
    featured: ['products', 'featured'] as const,
    related: (id: string) => ['products', 'related', id] as const,
  },
  cart: {
    all: (userId: string) => ['cart', userId] as const,
    summary: (userId: string) => ['cart', 'summary', userId] as const,
  },
  payment: {
    methods: (userId: string) => ['payment', 'methods', userId] as const,
    orders: (userId: string) => ['payment', 'orders', userId] as const,
    order: (orderId: string) => ['payment', 'order', orderId] as const,
  },
};

// Auth hooks
export const useLogin = () => {
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      localStorage.setItem('shopease_token', data.token);
      localStorage.setItem('shopease_user', JSON.stringify(data.user));
      toast.success('Successfully logged in!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Login failed');
    },
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: authService.signup,
    onSuccess: (data) => {
      localStorage.setItem('shopease_token', data.token);
      localStorage.setItem('shopease_user', JSON.stringify(data.user));
      toast.success('Account created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Signup failed');
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear();
      toast.success('Successfully logged out!');
    },
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: authService.getProfile,
    enabled: !!localStorage.getItem('shopease_token'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Products hooks
export const useProducts = (filters: ProductFilters = {}) => {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => productsService.getProducts(filters),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productsService.getProduct(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: queryKeys.products.categories,
    queryFn: productsService.getCategories,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useFeaturedProducts = (limit: number = 4) => {
  return useQuery({
    queryKey: queryKeys.products.featured,
    queryFn: () => productsService.getFeaturedProducts(limit),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useRelatedProducts = (productId: string, limit: number = 4) => {
  return useQuery({
    queryKey: queryKeys.products.related(productId),
    queryFn: () => productsService.getRelatedProducts(productId, limit),
    enabled: !!productId,
    staleTime: 10 * 60 * 1000,
  });
};

// Cart hooks
export const useCart = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.cart.all(userId),
    queryFn: () => cartService.getCart(userId),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useCartSummary = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.cart.summary(userId),
    queryFn: () => cartService.getCartSummary(userId),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, productId, quantity }: { userId: string; productId: string; quantity?: number }) =>
      cartService.addToCart(userId, productId, quantity),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all(variables.userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.summary(variables.userId) });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add item to cart');
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, productId }: { userId: string; productId: string }) =>
      cartService.removeFromCart(userId, productId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all(variables.userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.summary(variables.userId) });
      toast.success('Item removed from cart');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove item from cart');
    },
  });
};

export const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, productId, quantity }: { userId: string; productId: string; quantity: number }) =>
      cartService.updateCartItemQuantity(userId, productId, quantity),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all(variables.userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.summary(variables.userId) });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update cart');
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId: string) => cartService.clearCart(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.summary(userId) });
      toast.success('Cart cleared');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to clear cart');
    },
  });
};

// Payment hooks
export const usePaymentMethods = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.payment.methods(userId),
    queryFn: () => paymentService.getPaymentMethods(userId),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useProcessPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (paymentData: PaymentRequest) => paymentService.processPayment(paymentData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payment.orders(variables.userId) });
      toast.success('Payment processed successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Payment failed');
    },
  });
};

export const useUserOrders = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.payment.orders(userId),
    queryFn: () => paymentService.getUserOrders(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: queryKeys.payment.order(orderId),
    queryFn: () => paymentService.getOrder(orderId),
    enabled: !!orderId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useTrackOrder = (trackingNumber: string) => {
  return useQuery({
    queryKey: ['tracking', trackingNumber],
    queryFn: () => paymentService.trackOrder(trackingNumber),
    enabled: !!trackingNumber,
    staleTime: 2 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};
