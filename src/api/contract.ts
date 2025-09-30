// Helper function to get organization ID
const getOrganizationId = (): string => {
  const orgId = localStorage.getItem('organizationId');
  const userData = localStorage.getItem('userData');
  
  if (orgId) return orgId;
  
  if (userData) {
    try {
      const user = JSON.parse(userData);
      if (user.organizationId) return user.organizationId;
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
  
  // No organization ID found - user is not properly authenticated
  throw new Error('Organization ID not found. Please log in again.');
};

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
        headers: {
          'Content-Type': 'application/json',
        },
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
      const response = await fetch(`${BASE_URL}/contractTypes/${contractId}`, {
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
      console.error('Error updating contract type:', error);
      throw error;
    }
  },

  /**
   * Delete contract type
   */
  async delete(contractId: string): Promise<{ success: boolean; message?: string }> {
    try {
      console.log("this is contract id", contractId);
      const response = await fetch(`${BASE_URL}/contractTypes/${contractId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
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
