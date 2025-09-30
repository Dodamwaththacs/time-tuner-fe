import { getOrganizationId, getAuthHeaders } from '../utils/authUtils';

// Contract API types and functions
export interface ContractType {
  id: string;
  contractName: string;
  maxHourPerWeek: number;
  maxShiftsPerWeek: number;
  maxConsecutiveDays: number;
  minRestHours: number;
  description: string;
  active: boolean;
}

export interface CreateContractRequest {
  contractName: string;
  maxHourPerWeek: number;
  maxShiftsPerWeek: number;
  maxConsecutiveDays: number;
  minRestHours: number;
  description: string;
  active: boolean;
  organization: string; 
}

// API functions
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const contractAPI = {
  /**
   * Get all contract types for an organization
   */
  async getAllContractTypes(): Promise<ContractType[]> {
    try {
      const organizationId = getOrganizationId();
      const response = await fetch(`${BASE_URL}/contractTypes/${organizationId}/organization`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching contract types:', error);
      throw error;
    }
  },

  /**
   * Get contract type by ID
   */
  async getById(contractId: string): Promise<ContractType> {
    try {
      const organizationId = getOrganizationId();
      const response = await fetch(`${BASE_URL}/contractTypes/${organizationId}/${contractId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching contract type:', error);
      throw error;
    }
  },

  /**
   * Create a new contract type
   */
  async create(data: Omit<CreateContractRequest, 'organization'>): Promise<{ success: boolean; contractType: ContractType }> {
    try {
      const organizationId = getOrganizationId();
      const payload = {
        ...data,
        organization: organizationId
      };
      const response = await fetch(`${BASE_URL}/contractTypes`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error creating contract type:', error);
      throw error;
    }
  },

  /**
   * Update contract type
   */
  async update(contractId: string, data: Partial<CreateContractRequest>): Promise<{ success: boolean; contractType: ContractType }> {
    try {
      const response = await fetch(`${BASE_URL}/contractTypes${contractId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error updating contract type:', error);
      throw error;
    }
  },

  /**
   * Delete contract type
   */
  async delete(contractId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${BASE_URL}/contractTypes/${contractId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // For 204 No Content, return success without parsing JSON
      if (response.status === 204) {
        return { success: true, message: 'Contract deleted successfully' };
      }

      // For other success responses, try to parse JSON
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error deleting contract type:', error);
      throw error;
    }
  },
};
