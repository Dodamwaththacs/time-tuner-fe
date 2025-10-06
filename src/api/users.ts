// Users API types and functions

import type { UserRole } from "../contexts/AuthContext";
import { getOrganizationId, getAuthHeaders } from '../utils/authUtils';


export interface AppUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: "Active" | "Inactive" ;
  lastLogin?: string;
  firstLogin?: string;
  phone?: string;
  avatar?: string;
}

export interface CreateUserRequest {
  email: string;
  displayName: string;
  userType: "ADMIN" | "MANAGER" | "EMPLOYEE";
  phone?: string;
  avatar?: string;
  status: boolean;
  department?: string;
}




// API functions
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const usersAPI = {
  /**
   * Get all users
   */
  async getAll(): Promise<AppUser[]> {
    try {
      const organizationId = getOrganizationId();
      const response = await fetch(`${BASE_URL}/appUsers/organization/${organizationId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  /**
   * Create a new user
   */
  async create(userData: CreateUserRequest): Promise<any> {
    try {
      const organizationId = getOrganizationId();
      const response = await fetch(`${BASE_URL}/appUsers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          organization: organizationId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

};
