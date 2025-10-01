
import { getOrganizationId, getAuthHeaders } from '../utils/authUtils';


export interface ShiftType {
  id: string;
  shiftName: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  description: string;
  active: boolean;
  organization: string;
}

const API_BASE_URL = 'http://localhost:8080/api';


export const shiftAPI = {
    create : async (shiftData: Omit<ShiftType, 'id' | 'organization'>): Promise<ShiftType> => {
        const organizationId = getOrganizationId();
        const payload = {
            ...shiftData,
            organization: organizationId
        };
        const response = await fetch(`${API_BASE_URL}/shiftTypes`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    } ,

    getAllByOrganization: async (): Promise<ShiftType[]> => {
        const organizationId = getOrganizationId();
        const response = await fetch(`${API_BASE_URL}/shiftTypes/${organizationId}/organization`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    },

    update : async (id :string, shiftData: Omit<ShiftType, 'organization'>): Promise<ShiftType> => {
        const organizationId = getOrganizationId();
        const response = await fetch(`${API_BASE_URL}/shiftTypes/${organizationId}/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(shiftData)
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    },

    delete : async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/shiftTypes/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        // Handle 204 No Content response (successful deletion)
        if (response.status === 204) {
            return;
        }

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    },
}

