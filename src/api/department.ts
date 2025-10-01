import { getOrganizationId, getEmployeeId,getAuthHeaders } from '../utils/authUtils';


export interface Department {
  id: string; // UUID from backend
  departmentName: string;
  description: string;
  location: string;
  active: boolean;
  organization: string;
}

const API_BASE_URL = 'http://localhost:8080/api';



export const departmentAPI = {
  create: async (departmentData: Omit<Department, 'id'>): Promise<Department> => {
    const response = await fetch(`${API_BASE_URL}/departments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(departmentData)
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  getAllByOrganization: async (): Promise<Department[]> => {
        const organizationId = getOrganizationId();

    const response = await fetch(`${API_BASE_URL}/departments/organization/${organizationId}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  getAllByEmployee: async (): Promise<Department[]> => {
    const employeeId = getEmployeeId();
    const response = await fetch(`${API_BASE_URL}/departments/employee/${employeeId}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },


  update: async (id: string, departmentData: Department): Promise<Department> => {
    const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(departmentData)
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/departments/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  }
};
