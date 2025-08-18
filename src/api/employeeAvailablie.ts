const organizationId = "123e4567-e89b-12d3-a456-426655440001";
const departmentId = "123e4567-e89b-12d3-a456-426655440002";


  export interface EmployeeAvailability {
  id: string;
  availabilityDate: string;
  startTime: string ;
  endTime: string ;
  availabilityType: 'AVAILABLE' | 'UNAVAILABLE' | 'PREFERRED';
  reason: string;
  approved: boolean | null;
  createdAt: string | null;
  employee: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  hireDateuserType: string;
  active: string;
}

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';


  export const employeeAvailabilityAPI = {

    async getAvailabilityByOrganizationAndDepartment(): Promise<EmployeeAvailability[]> {
      const response = await fetch(`${BASE_URL}/employeeAvailabilities/organization/${organizationId}/department/${departmentId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result;
    },

    async approveAvailability(id: string, approved: boolean): Promise<EmployeeAvailability> {
      const response = await fetch(`${BASE_URL}/employeeAvailabilities/${id}/approve/${approved}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result;
    },

    async getAppUser(employeeId: string): Promise<Employee> {
      const response = await fetch(`${BASE_URL}/employees/${employeeId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result;
    }
  }