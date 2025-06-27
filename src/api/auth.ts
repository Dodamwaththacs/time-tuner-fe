import { apiClient } from './index';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  organization?: string;
}

export const authAPI = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  // Register user
  register: async (userData: any): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  // Logout user
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  // Refresh token
  refreshToken: async (): Promise<{ token: string }> => {
    const response = await apiClient.post('/auth/refresh');
    return response.data;
  },

  // Reset password
  resetPassword: async (email: string): Promise<void> => {
    await apiClient.post('/auth/reset-password', { email });
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },
};
