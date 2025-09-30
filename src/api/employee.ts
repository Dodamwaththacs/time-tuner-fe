const organizationId = "123e4567-e89b-12d3-a456-426655440001";
const departmentId = "123e4567-e89b-12d3-a456-426655440001";
const employeeId = "123e4567-e89b-12d3-a456-426655440002";

// Employee API types and functions
export interface EmployeeUserAccount {
  username: string;
  email: string;
  userRole: string;
  avatar: string;
}

export interface EmployeeRole {
  roleName: string;
  description: string;
}

export interface EmployeeDepartment {
  departmentName: string;
  location: string;
}

export interface EmployeeContract {
  contractName: string;
  ftePercentage: number;
}

export interface EmployeeSkill {
  skillName: string;
  proficiencyLevel: "CERTIFIED" | "EXPERIENCED" | "EXPERT";
  certifiedDate: string;
  expiryDate: string | null;
}

export interface EmployeePreference {
  shiftType: string;
  department: string;
  preferenceType: "PREFER" | "AVAILABLE" | "UNAVAILABLE";
  preferenceWeight: number | null;
}

export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  hireDate: string;
  active: boolean;
  userAccount: EmployeeUserAccount;
  primaryRole: EmployeeRole;
  primaryDepartment: EmployeeDepartment;
  contract: EmployeeContract;
  skills: EmployeeSkill[];
  preferences: EmployeePreference[];
}

// API functions
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const employeeAPI = {
  /**
   * Get all employees with details for an organization
   */
  async getAllEmployeesWithDetails(): Promise<Employee[]> {
    try {
      const response = await fetch(
        `${BASE_URL}/employees/${organizationId}/details`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add authorization header if needed
            // 'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching employees:", error);
      throw error;
    }
  },
  
  async getEmployeeWithDetails(): Promise<Employee> {
    try {
      const response = await fetch(
        `${BASE_URL}/employees/employee/${employeeId}/details`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add authorization header if needed
            // 'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching employees:", error);
      throw error;
    }
  },

  async getAllEmployeesWithDeparment(): Promise<Employee[]> {
    try {
      const response = await fetch(
        `${BASE_URL}/employees/organization/${organizationId}/department/${departmentId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add authorization header if needed
            // 'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching employees:", error);
      throw error;
    }
  },

  /**
   * Get employee by ID
   */
  async getById(employeeId: string): Promise<Employee> {
    try {
      const response = await fetch(
        `${BASE_URL}/employees/${organizationId}/${employeeId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching employee:", error);
      throw error;
    }
  },

  /**
   * Create a new employee
   */
  async create(
    data: Omit<Employee, "id">
  ): Promise<{ success: boolean; employee: Employee }> {
    try {
      const response = await fetch(`${BASE_URL}/employees/${organizationId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error creating employee:", error);
      throw error;
    }
  },

  /**
   * Update employee
   */
  async update(
    employeeId: string,
    data: Partial<Employee>
  ): Promise<{ success: boolean; employee: Employee }> {
    try {
      const response = await fetch(
        `${BASE_URL}/employees/${organizationId}/${employeeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error updating employee:", error);
      throw error;
    }
  },

  /**
   * Delete employee
   */
  async delete(
    employeeId: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(
        `${BASE_URL}/employees/${organizationId}/${employeeId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error deleting employee:", error);
      throw error;
    }
  },

  /**
   * Create a new employee with the specific payload structure
   */
  async createEmployee(data: {
    id: string;
    employeeCode: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    hireDate: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
    roles: string[];
    skills: string[];
    departments: string[];
    organization: string;
  }): Promise<any> {
    try {
      const response = await fetch(`${BASE_URL}/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error creating employee:", error);
      throw error;
    }
  },
};
