// Employee Availability API types and functions

export interface EmployeeAvailability {
  id?: number;
  employee_id: string;
  availability_date: string;
  start_time: string | null;
  end_time: string | null;
  availability_type: 'AVAILABLE' | 'UNAVAILABLE' | 'PREFERRED';
  reason: string;
  approved?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAvailabilityRequest {
  employee_id: string;
  availability_date: string;
  start_time: string | null;
  end_time: string | null;
  availability_type: 'AVAILABLE' | 'UNAVAILABLE' | 'PREFERRED';
  reason: string;
}

export interface AvailabilityListResponse {
  availabilities: EmployeeAvailability[];
  total: number;
  page: number;
  limit: number;
}

export interface AvailabilityFilters {
  employee_id?: string;
  start_date?: string;
  end_date?: string;
  availability_type?: 'AVAILABLE' | 'UNAVAILABLE' | 'PREFERRED';
  approved?: boolean;
  page?: number;
  limit?: number;
}

// API functions
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const availabilityAPI = {
  /**
   * Get all availability entries with optional filtering
   */
  async getAll(filters: AvailabilityFilters = {}): Promise<AvailabilityListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      const url = `${BASE_URL}/availability${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching availability:', error);
      throw error;
    }
  },

  /**
   * Get availability entry by ID
   */
  async getById(id: number): Promise<EmployeeAvailability> {
    try {
      const response = await fetch(`${BASE_URL}/availability/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching availability entry:', error);
      throw error;
    }
  },

  /**
   * Get availability for a specific employee
   */
  async getByEmployeeId(employeeId: string, filters: Omit<AvailabilityFilters, 'employee_id'> = {}): Promise<EmployeeAvailability[]> {
    try {
      const queryParams = new URLSearchParams({ employee_id: employeeId });
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(`${BASE_URL}/availability/employee/${employeeId}?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching employee availability:', error);
      throw error;
    }
  },

  /**
   * Get availability for a specific date range
   */
  async getByDateRange(startDate: string, endDate: string, filters: Omit<AvailabilityFilters, 'start_date' | 'end_date'> = {}): Promise<EmployeeAvailability[]> {
    try {
      const queryParams = new URLSearchParams({ 
        start_date: startDate, 
        end_date: endDate 
      });
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(`${BASE_URL}/availability/date-range?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching availability by date range:', error);
      throw error;
    }
  },

  /**
   * Create a new availability entry
   */
  async create(data: CreateAvailabilityRequest): Promise<{ success: boolean; availability: EmployeeAvailability }> {
    try {
      const response = await fetch(`${BASE_URL}/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error creating availability:', error);
      throw error;
    }
  },

  /**
   * Create multiple availability entries (bulk creation)
   */
  async createBulk(data: CreateAvailabilityRequest[]): Promise<{ success: boolean; availabilities: EmployeeAvailability[]; errors?: string[] }> {
    try {
      const response = await fetch(`${BASE_URL}/availability/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ availabilities: data }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error creating bulk availability:', error);
      throw error;
    }
  },

  /**
   * Update availability entry
   */
  async update(id: number, data: Partial<CreateAvailabilityRequest>): Promise<{ success: boolean; availability: EmployeeAvailability }> {
    try {
      const response = await fetch(`${BASE_URL}/availability/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error updating availability:', error);
      throw error;
    }
  },

  /**
   * Approve or reject availability entry
   */
  async updateApprovalStatus(id: number, approved: boolean, approverComment?: string): Promise<{ success: boolean; availability: EmployeeAvailability }> {
    try {
      const response = await fetch(`${BASE_URL}/availability/${id}/approval`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ 
          approved, 
          approver_comment: approverComment 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error updating approval status:', error);
      throw error;
    }
  },

  /**
   * Delete availability entry
   */
  async delete(id: number): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${BASE_URL}/availability/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error deleting availability:', error);
      throw error;
    }
  },

  /**
   * Get pending approvals (for managers)
   */
  async getPendingApprovals(filters: AvailabilityFilters = {}): Promise<EmployeeAvailability[]> {
    try {
      const queryParams = new URLSearchParams({ approved: 'false' });
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && key !== 'approved') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(`${BASE_URL}/availability/pending-approvals?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
      throw error;
    }
  },

  /**
   * Check for conflicts in availability
   */
  async checkConflicts(employeeId: string, date: string, startTime: string, endTime: string): Promise<{ hasConflicts: boolean; conflicts: EmployeeAvailability[] }> {
    try {
      const response = await fetch(`${BASE_URL}/availability/check-conflicts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          employee_id: employeeId,
          availability_date: date,
          start_time: startTime,
          end_time: endTime
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error checking conflicts:', error);
      throw error;
    }
  }
};
