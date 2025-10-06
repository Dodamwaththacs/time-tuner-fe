import { getOrganizationId, getEmployeeId,getDepartmentId,getAuthHeaders } from '../utils/authUtils';


export type Schedule = {
    id: string;
  staffId: string;
  staff: {
    name: string;
    role: string;
    department: string;
    phone?: string;
    email?: string;
  };
  shiftType: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  status: 'confirmed' | 'tentative' | 'cancelled';
  notes?: string;
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
// const orgId = "123e4567-e89b-12d3-a456-426655440001";
// const depId = "123e4567-e89b-12d3-a456-426655440004";



export const scheduleAPI = {
  getAll: async () => {
    const orgId = getOrganizationId();
    const depId = getDepartmentId();
    const response = await fetch(`${BASE_URL}/shifts/${orgId}/${depId}/current/schedule`);
    if (!response.ok) {
      throw new Error('Failed to fetch schedules');
    }
    return response.json();
  },
  // Add more API methods as needed
};
