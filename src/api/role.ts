// const organizationId = "123e4567-e89b-12d3-a456-426655440001";


import { getOrganizationId, getEmployeeId,getDepartmentId,getAuthHeaders } from '../utils/authUtils';

// Role API types and functions
export interface Role {
  id: string;
  roleName: string;
  description: string;
  active: boolean;
}

export interface CreateRoleRequest {
  roleName: string;
  description: string;
  active: boolean;
  organization: string;
}

// API functions
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const roleAPI = {
  /**
   * Get all roles for an organization
   */
  async getAllRoles(): Promise<Role[]> {
    try {
      const organizationId = getOrganizationId();
      const response = await fetch(`${BASE_URL}/roles/${organizationId}/organization`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  },

  /**
   * Get role by ID
   */
  async getById(roleId: string): Promise<Role> {
    try {
      const organizationId = getOrganizationId(); 
      const response = await fetch(`${BASE_URL}/roles/${organizationId}/${roleId}`, {
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
      console.error('Error fetching role:', error);
      throw error;
    }
  },

  /**
   * Create a new role
   */
  async create(data: CreateRoleRequest): Promise<{ success: boolean; role: Role }> {
    try {
      const organizationId = getOrganizationId();

      // Add organization to data
      data.organization = organizationId;
      
      const response = await fetch(`${BASE_URL}/roles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  },

  /**
   * Update role
   */
  async update(roleId: string, data: Partial<CreateRoleRequest>): Promise<{ success: boolean; role: Role }> {
    try {
      const organizationId = getOrganizationId();
      const response = await fetch(`${BASE_URL}/roles/${organizationId}/${roleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error updating role:', error);
      throw error;
    }
  },

  /**
   * Delete role
   */
  async delete(roleId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const organizationId = getOrganizationId();
      const response = await fetch(`${BASE_URL}/roles/${organizationId}/${roleId}`, {
        method: 'DELETE',
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
      console.error('Error deleting role:', error);
      throw error;
    }
  },
};
