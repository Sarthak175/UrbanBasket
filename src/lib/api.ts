import axios from 'axios';
import { Product } from '@/contexts/CartContext';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://fakestoreapi.com';

// Create axios instance with default configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('shopease_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('shopease_token');
      localStorage.removeItem('shopease_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types for API responses
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CartRequest {
  userId: string;
  products: CartItem[];
}

// API Error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Helper function to handle API errors
export const handleApiError = (error: any): ApiError => {
  if (error.response) {
    // Server responded with error status
    return new ApiError(
      error.response.data?.message || 'An error occurred',
      error.response.status,
      error.response.data
    );
  } else if (error.request) {
    // Request was made but no response received
    return new ApiError('Network error - please check your connection');
  } else {
    // Something else happened
    return new ApiError(error.message || 'An unexpected error occurred');
  }
};
