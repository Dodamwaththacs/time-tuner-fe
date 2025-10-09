// Employee Availability API types and functions
import { getOrganizationId, getEmployeeId,getDepartmentId,getAuthHeaders } from '../utils/authUtils';

export interface Availability {
  id?: number;
  availabilityDate: string;
  startTime: string;
  endTime: string | null;
  availabilityType: string | null;
  reason: string;
  approved?: boolean;
  createdAt: string | null;
  employee: string;
}


// API functions
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
// const userId = '123e4567-e89b-12d3-a456-426655440001';

export const availabilityAPI = {
 
  // get availability by user id
  async getAvailabilityByUserId(): Promise<Availability[]> {
    const userId = getEmployeeId();
    console.log("Fetching availability for user ID:", userId);
    const response = await fetch(`${BASE_URL}/employeeAvailabilities/employee/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
  const result = await response.json();
    return result;
  },
  
  // create availability
  async createAvailability(availability: Availability): Promise<Availability> {
    const response = await fetch(`${BASE_URL}/employeeAvailabilities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(availability),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  },
  


  


  
};
