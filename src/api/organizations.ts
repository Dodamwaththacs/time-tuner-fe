import { apiClient } from './index';

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
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  updated_at: string;
}

export interface CreateOrganizationRequest {
  organization_name: string;
  organization_code: string;
  organization_type: string;
  address: string;
  city: string;
  country: string;
  contact_email: string;
  contact_phone: string;
  subscription_plan: string;
}

export interface UpdateOrganizationRequest extends Partial<CreateOrganizationRequest> {
  id: string;
}

export const organizationAPI = {
  // Create new organization
  create: async (orgData: CreateOrganizationRequest): Promise<Organization> => {
    const response = await apiClient.post('/organizations', orgData);
    return response.data;
  },

  // Get organization by ID
  getById: async (id: string): Promise<Organization> => {
    const response = await apiClient.get(`/organizations/${id}`);
    return response.data;
  },

  // Get current user's organization
  getCurrent: async (): Promise<Organization> => {
    const response = await apiClient.get('/organizations/current');
    return response.data;
  },

  // Update organization
  update: async (orgData: UpdateOrganizationRequest): Promise<Organization> => {
    const { id, ...updateData } = orgData;
    const response = await apiClient.put(`/organizations/${id}`, updateData);
    return response.data;
  },

  // Delete organization
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/organizations/${id}`);
  },

  // Get all organizations (admin only)
  getAll: async (page = 1, limit = 10): Promise<{
    organizations: Organization[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    const response = await apiClient.get(`/organizations?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Check organization code availability
  checkCodeAvailability: async (code: string): Promise<{ available: boolean }> => {
    const response = await apiClient.get(`/organizations/check-code/${code}`);
    return response.data;
  },
};
