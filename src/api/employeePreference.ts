
const API_BASE_URL = 'http://localhost:8080/api';
const organizationId = "123e4567-e89b-12d3-a456-426655440001";
const employeeId = "123e4567-e89b-12d3-a456-426655440001";


export interface EmployeePreference {
    id: string;
    preferenceType: "STRONGLY_PREFER" | "PREFER" | "NEUTRAL" | "AVOID" | "STRONGLY_AVOID";
    preferenceWeight: number;
    notes: string;
    employee: string;
    shiftType: string;
    department: string; 
    active: boolean;
  }


export interface EmployeePreferenceWithOutId{
    id: string;
    preferenceType: "STRONGLY_PREFER" | "PREFER" | "NEUTRAL" | "AVOID" | "STRONGLY_AVOID";
    preferenceWeight: number;
    notes: string;
    employee: string;
    shiftName: string;
    department: string;
  }
  

  
export const employeePreferenceAPI = {
  create: async (employeePreferenceData: Omit<EmployeePreference, 'id'>): Promise<EmployeePreference> => {
    const response = await fetch(`${API_BASE_URL}/employeePreferences`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employeePreferenceData)
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },
  
  getAllByEmployee: async (): Promise<EmployeePreferenceWithOutId[]> => {
    const response = await fetch(`${API_BASE_URL}/employeePreferences/employee/${employeeId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  update: async (employeePreferenceData: EmployeePreference): Promise<EmployeePreference> => {
    const response = await fetch(`${API_BASE_URL}/employeePreferences`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employeePreferenceData)
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/employeePreferences/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  }
}