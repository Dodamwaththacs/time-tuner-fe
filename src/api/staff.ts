// Staff and Schedule API types and functions

export interface Staff {
  id: string;
  name: string;
  email: string;
  employee_id: string;
  department: string;
  position: string;
  skills: string[];
  availability: {
    [day: string]: {
      start: string;
      end: string;
      available: boolean;
    };
  };
  created_at: string;
  updated_at: string;
}

export interface Schedule {
  id: string;
  staff_id: string;
  staff?: Staff | { name: string };
  date: string;
  shift_start: string;
  shift_end: string;
  shift_type: 'morning' | 'afternoon' | 'evening' | 'night' | 'full_day';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  department: string;
  created_at: string;
  updated_at: string;
}

export interface CreateScheduleRequest {
  staff_id: string;
  date: string;
  shift_start: string;
  shift_end: string;
  shift_type: 'morning' | 'afternoon' | 'evening' | 'night' | 'full_day';
  department: string;
  notes?: string;
}

export interface CreateStaffRequest {
  name: string;
  email: string;
  employee_id: string;
  department: string;
  position: string;
  skills?: string[];
  availability?: {
    [day: string]: {
      start: string;
      end: string;
      available: boolean;
    };
  };
}

// API functions
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const staffAPI = {
  /**
   * Get all staff members
   */
  async getAll(): Promise<Staff[]> {
    try {
      const response = await fetch(`${BASE_URL}/staff`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching staff:', error);
      throw error;
    }
  },

  /**
   * Get staff member by ID
   */
  async getById(id: string): Promise<Staff> {
    try {
      const response = await fetch(`${BASE_URL}/staff/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching staff member:', error);
      throw error;
    }
  },

  /**
   * Create a new staff member
   */
  async create(data: CreateStaffRequest): Promise<{ success: boolean; staff: Staff }> {
    try {
      const response = await fetch(`${BASE_URL}/staff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error creating staff member:', error);
      throw error;
    }
  },

  /**
   * Update staff member
   */
  async update(id: string, data: Partial<CreateStaffRequest>): Promise<{ success: boolean; staff: Staff }> {
    try {
      const response = await fetch(`${BASE_URL}/staff/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error updating staff member:', error);
      throw error;
    }
  },

  /**
   * Delete staff member
   */
  async delete(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${BASE_URL}/staff/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error deleting staff member:', error);
      throw error;
    }
  },
};

export const scheduleAPI = {
  /**
   * Get all schedules
   */
  async getAll(): Promise<Schedule[]> {
    try {
      const response = await fetch(`${BASE_URL}/schedules`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching schedules:', error);
      throw error;
    }
  },

  /**
   * Get schedule by ID
   */
  async getById(id: string): Promise<Schedule> {
    try {
      const response = await fetch(`${BASE_URL}/schedules/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching schedule:', error);
      throw error;
    }
  },

  /**
   * Get schedules by staff ID
   */
  async getByStaffId(staffId: string): Promise<Schedule[]> {
    try {
      const response = await fetch(`${BASE_URL}/schedules/staff/${staffId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching staff schedules:', error);
      throw error;
    }
  },

  /**
   * Get schedules by date range
   */
  async getByDateRange(startDate: string, endDate: string): Promise<Schedule[]> {
    try {
      const response = await fetch(`${BASE_URL}/schedules?start_date=${startDate}&end_date=${endDate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching schedules by date range:', error);
      throw error;
    }
  },

  /**
   * Create a new schedule
   */
  async create(data: CreateScheduleRequest): Promise<{ success: boolean; schedule: Schedule }> {
    try {
      const response = await fetch(`${BASE_URL}/schedules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error creating schedule:', error);
      throw error;
    }
  },

  /**
   * Update schedule
   */
  async update(id: string, data: Partial<CreateScheduleRequest>): Promise<{ success: boolean; schedule: Schedule }> {
    try {
      const response = await fetch(`${BASE_URL}/schedules/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error updating schedule:', error);
      throw error;
    }
  },

  /**
   * Update schedule status
   */
  async updateStatus(id: string, status: Schedule['status']): Promise<{ success: boolean; schedule: Schedule }> {
    try {
      const response = await fetch(`${BASE_URL}/schedules/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error updating schedule status:', error);
      throw error;
    }
  },

  /**
   * Delete schedule
   */
  async delete(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${BASE_URL}/schedules/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error deleting schedule:', error);
      throw error;
    }
  },
};
