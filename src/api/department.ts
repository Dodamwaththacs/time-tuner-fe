export interface Department {
  id: string; // UUID from backend
  departmentName: string;
  description: string;
  location: string;
  active: boolean;
  organization: string;
}

const API_BASE_URL = 'http://localhost:8080/api';
const organizationId = "123e4567-e89b-12d3-a456-426655440001";


export const departmentAPI = {
  create: async (departmentData: Omit<Department, 'id'>): Promise<Department> => {
    const response = await fetch(`${API_BASE_URL}/departments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(departmentData)
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  getAllByOrganization: async (): Promise<Department[]> => {
    const response = await fetch(`${API_BASE_URL}/departments/organization/${organizationId}`);
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
