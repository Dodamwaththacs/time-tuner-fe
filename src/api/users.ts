// Users API types and functions

import type { UserRole } from "../contexts/AuthContext";

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


const organizationId = "123e4567-e89b-12d3-a456-426655440001";


// API functions
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const usersAPI = {
  /**
   * Get all users
   */
  async getAll(): Promise<AppUser[]> {
    try {
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

};
