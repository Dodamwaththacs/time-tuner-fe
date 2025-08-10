// Organization API types and functions

export interface CreateOrganizationRequest {
  organizationName: string;
  organizationCode: string;
  organizationType: string;
  address: string;
  city: string;
  country: string;
  contactEmail: string;
  contactPhone: string;
  subscriptionPlan: string;
}

export interface Organization {
  id: string;
  organization_name: string;
  organization_code: string;
  organization_type: string;
  address: string;
  city: string;
  country: string;
  contact_email: string;
  contact_phone: string;
  subscription_plan: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOrganizationResponse {
  success: boolean;
  organization: Organization;
  message?: string;
}

// API functions
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const organizationAPI = {
  
  async create(data: CreateOrganizationRequest): Promise<CreateOrganizationResponse> {
    try {
      const response = await fetch(`${BASE_URL}/organizations`, {
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
      console.error('Error creating organization:', error);
      throw error;
    }
  },

  /**
   * Get organization by ID
   */
  async getById(id: string): Promise<Organization> {
    try {
      const response = await fetch(`${BASE_URL}/organizations/${id}`, {
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
      console.error('Error fetching organization:', error);
      throw error;
    }
  },

  /**
   * Update organization
   */
  async update(id: string, data: Partial<CreateOrganizationRequest>): Promise<CreateOrganizationResponse> {
    try {
      const response = await fetch(`${BASE_URL}/organizations/${id}`, {
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
      console.error('Error updating organization:', error);
      throw error;
    }
  },

  /**
   * Delete organization
   */
  async delete(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${BASE_URL}/organizations/${id}`, {
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
      console.error('Error deleting organization:', error);
      throw error;
    }
  },

  /**
   * Get all organizations
   */
  async getAll(): Promise<Organization[]> {
    try {
      const response = await fetch(`${BASE_URL}/organizations`, {
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
      console.error('Error fetching organizations:', error);
      throw error;
    }
  },
};
