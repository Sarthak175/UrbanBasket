import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLogin, useSignup, useLogout } from '@/hooks/useApi';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loginMutation = useLogin();
  const signupMutation = useSignup();
  const logoutMutation = useLogout();

  useEffect(() => {
    const savedUser = localStorage.getItem('shopease_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('shopease_user');
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const result = await loginMutation.mutateAsync({ username, password });
      setUser(result.user);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const result = await signupMutation.mutateAsync({ username, email, password });
      setUser(result.user);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    logoutMutation.mutate();
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      isAuthenticated: !!user,
      isLoading: isLoading || loginMutation.isPending || signupMutation.isPending
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};