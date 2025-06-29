import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type UserRole = 'admin' | 'manager' | 'employee';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  provider?: 'email' | 'google'; // Track how user signed up
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, fullName: string, role: UserRole) => Promise<boolean>;
  googleSignIn: () => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Mock user database - in a real app, this would be in your backend
const mockUsers: Array<User & { password?: string }> = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    provider: 'email',
    password: 'password'
  },
  {
    id: '2',
    email: 'manager@example.com',
    name: 'Manager User',
    role: 'manager',
    provider: 'email',
    password: 'password'
  },
  {
    id: '3',
    email: 'employee@example.com',
    name: 'Employee User',
    role: 'employee',
    provider: 'email',
    password: 'password'
  }
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (e.g., token in localStorage)
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        if (token && userData) {
          // In a real app, you would validate the token with your backend
          const user = JSON.parse(userData);
          setUser(user);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Mock login - find user in mock database
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const userWithoutPassword = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          role: foundUser.role,
          provider: foundUser.provider
        };
        
        setUser(userWithoutPassword);
        localStorage.setItem('authToken', 'mock-jwt-token');
        localStorage.setItem('userData', JSON.stringify(userWithoutPassword));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, fullName: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === email);
      if (existingUser) {
        return false; // User already exists
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(), // Simple ID generation for demo
        email,
        name: fullName,
        role,
        provider: 'email' as const,
        password
      };

      // Add to mock database
      mockUsers.push(newUser);

      // Set current user (without password)
      const userWithoutPassword = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        provider: newUser.provider
      };

      setUser(userWithoutPassword);
      localStorage.setItem('authToken', 'mock-jwt-token');
      localStorage.setItem('userData', JSON.stringify(userWithoutPassword));
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const googleSignIn = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Mock Google Sign-In
      // In a real app, you would use Google's OAuth library
      
      // Simulate Google OAuth flow delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock Google user data
      const googleUser = {
        id: 'google-' + Date.now().toString(),
        email: 'user@gmail.com',
        name: 'Google User',
        role: 'employee' as UserRole, // Default role for Google sign-ins
        provider: 'google' as const
      };

      // Check if user exists in our system
      let existingUser = mockUsers.find(u => u.email === googleUser.email);
      
      if (!existingUser) {
        // Create new user from Google account
        const newUser = {
          ...googleUser,
          password: undefined // Google users don't have passwords in our system
        };
        mockUsers.push(newUser);
        existingUser = newUser;
      }

      const userWithoutPassword = {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role,
        provider: existingUser.provider || 'google'
      };

      setUser(userWithoutPassword);
      localStorage.setItem('authToken', 'mock-jwt-token');
      localStorage.setItem('userData', JSON.stringify(userWithoutPassword));
      return true;
    } catch (error) {
      console.error('Google sign-in failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  };

  const value = {
    user,
    login,
    signup,
    googleSignIn,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};