import { apiClient, handleApiError, LoginRequest, LoginResponse, SignupRequest } from '@/lib/api';

export const authService = {
  /**
   * Login user with credentials
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      // For demo purposes, we'll use a mock API response
      // In a real app, you would make an actual API call
      const response = await new Promise<{ data: LoginResponse }>((resolve, reject) => {
        setTimeout(() => {
          // Mock authentication - check against demo users
          const demoUsers = [
            { id: '1', username: 'demo', email: 'demo@shopease.com', password: 'demo123' },
            { id: '2', username: 'admin', email: 'admin@shopease.com', password: 'admin123' },
          ];
          
          const user = demoUsers.find(
            u => u.username === credentials.username && u.password === credentials.password
          );
          
          if (user) {
            resolve({
              data: {
                token: `mock_token_${user.id}_${Date.now()}`,
                user: {
                  id: user.id,
                  username: user.username,
                  email: user.email,
                },
              },
            });
          } else {
            reject(new Error('Invalid credentials'));
          }
        }, 1000); // Simulate network delay
      });
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Register new user
   */
  async signup(userData: SignupRequest): Promise<LoginResponse> {
    try {
      // Mock signup API response
      const response = await new Promise<{ data: LoginResponse }>((resolve, reject) => {
        setTimeout(() => {
          // Check if user already exists (mock check)
          const existingUsers = JSON.parse(localStorage.getItem('shopease_users') || '[]');
          const userExists = existingUsers.find(
            (u: any) => u.username === userData.username || u.email === userData.email
          );
          
          if (userExists) {
            reject(new Error('User already exists'));
            return;
          }
          
          const newUser = {
            id: Date.now().toString(),
            username: userData.username,
            email: userData.email,
            password: userData.password,
          };
          
          // Save to localStorage (mock database)
          existingUsers.push(newUser);
          localStorage.setItem('shopease_users', JSON.stringify(existingUsers));
          
          resolve({
            data: {
              token: `mock_token_${newUser.id}_${Date.now()}`,
              user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
              },
            },
          });
        }, 1000);
      });
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // In a real app, you might need to invalidate the token on the server
      localStorage.removeItem('shopease_token');
      localStorage.removeItem('shopease_user');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<LoginResponse['user']> {
    try {
      const token = localStorage.getItem('shopease_token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Mock API call to get user profile
      const response = await new Promise<{ data: LoginResponse['user'] }>((resolve, reject) => {
        setTimeout(() => {
          const savedUser = localStorage.getItem('shopease_user');
          if (savedUser) {
            resolve({ data: JSON.parse(savedUser) });
          } else {
            reject(new Error('User not found'));
          }
        }, 500);
      });
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<string> {
    try {
      const currentToken = localStorage.getItem('shopease_token');
      if (!currentToken) {
        throw new Error('No token to refresh');
      }
      
      // Mock token refresh
      const response = await new Promise<{ data: { token: string } }>((resolve) => {
        setTimeout(() => {
          const newToken = `refreshed_${currentToken}_${Date.now()}`;
          resolve({ data: { token: newToken } });
        }, 500);
      });
      
      localStorage.setItem('shopease_token', response.data.token);
      return response.data.token;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
