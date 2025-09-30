
import { getOrganizationId, getAuthHeaders } from '../utils/authUtils';


export interface ShiftType {
  id: string;
  shiftName: string;
  startTime: number;
  endTime: number;
  durationHours: number;
  description: string;
  active: boolean;
  organization: string;
}

const API_BASE_URL = 'http://localhost:8080/api';


export const shiftAPI = {
    create : async (shiftData: Omit<ShiftType, 'id'>): Promise<ShiftType> => {
        const response = await fetch(`${API_BASE_URL}/shiftTypes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(shiftData)
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

    update : async (id :string, shiftData: ShiftType): Promise<ShiftType> => {
        const response = await fetch(`${API_BASE_URL}/shiftTypes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(shiftData)
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    },

    delete : async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/shiftTypes/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    },
}

