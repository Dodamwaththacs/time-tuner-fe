import { getOrganizationId, getAuthHeaders } from '../utils/authUtils';

// Skill API types and functions
export interface Skill {
  id: string;
  skillName: string;
  description: string;
  skillLevel: string;
  active: boolean;
}

export interface CreateSkillRequest {
  skillName: string;
  description: string;
  skillLevel: string;
  active: boolean;
  organization: string;
}

// API functions
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const skillAPI = {

  async getAllSkills(): Promise<Skill[]> {
    try {
      const organizationId = getOrganizationId();
      const response = await fetch(`${BASE_URL}/skills/${organizationId}/organization`, {
        method: 'GET',
        headers:getAuthHeaders()  ,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching skills:', error);
      throw error;
    }
  },

  /**
   * Get skill by ID
   */
  async getById(skillId: string): Promise<Skill> {
    try {
      const organizationId = getOrganizationId();
      const response = await fetch(`${BASE_URL}/skills/${organizationId}/${skillId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching skill:', error);
      throw error;
    }
  },

  /**
   * Create a new skill
   */
  async create(data: CreateSkillRequest): Promise<{ success: boolean; skill: Skill }> {
    try {
      const organizationId = getOrganizationId();
      
      // Add organization to data
      data.organization = organizationId;

      const response = await fetch(`${BASE_URL}/skills`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error creating skill:', error);
      throw error;
    }
  },

  /**
   * Update skill
   */
  async update(skillId: string, data: Partial<CreateSkillRequest>): Promise<{ success: boolean; skill: Skill }> {
    try {
      const organizationId = getOrganizationId();
      const response = await fetch(`${BASE_URL}/skills/${organizationId}/${skillId}`, {
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
      console.error('Error updating skill:', error);
      throw error;
    }
  },

  /**
   * Delete skill
   */
  async delete(skillId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${BASE_URL}/skills/${skillId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      // Handle 204 No Content response (successful deletion)
      if (response.status === 204) {
        return { success: true, message: 'Skill deleted successfully' };
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error deleting skill:', error);
      throw error;
    }
  },
};
