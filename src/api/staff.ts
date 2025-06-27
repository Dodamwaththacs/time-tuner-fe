import { apiClient } from './index';

export interface Staff {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: string;
  department?: string;
  specialization?: string;
  employee_id: string;
  status: 'active' | 'inactive' | 'on_leave';
  hire_date: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateStaffRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: string;
  department?: string;
  specialization?: string;
  employee_id: string;
  hire_date: string;
}

export interface UpdateStaffRequest extends Partial<CreateStaffRequest> {
  id: string;
}

export interface Schedule {
  id: string;
  staff_id: string;
  date: string;
  shift_start: string;
  shift_end: string;
  shift_type: 'regular' | 'overtime' | 'on_call' | 'holiday';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
  staff: Staff;
}

export interface CreateScheduleRequest {
  staff_id: string;
  date: string;
  shift_start: string;
  shift_end: string;
  shift_type: 'regular' | 'overtime' | 'on_call' | 'holiday';
  notes?: string;
}

export const staffAPI = {
  // Get all staff members
  getAll: async (page = 1, limit = 10, department?: string): Promise<{
    staff: Staff[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (department) params.append('department', department);
    
    const response = await apiClient.get(`/staff?${params}`);
    return response.data;
  },

  // Get staff member by ID
  getById: async (id: string): Promise<Staff> => {
    const response = await apiClient.get(`/staff/${id}`);
    return response.data;
  },

  // Create new staff member
  create: async (staffData: CreateStaffRequest): Promise<Staff> => {
    const response = await apiClient.post('/staff', staffData);
    return response.data;
  },

  // Update staff member
  update: async (staffData: UpdateStaffRequest): Promise<Staff> => {
    const { id, ...updateData } = staffData;
    const response = await apiClient.put(`/staff/${id}`, updateData);
    return response.data;
  },

  // Delete staff member
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/staff/${id}`);
  },

  // Get staff schedules
  getSchedules: async (staffId: string, startDate?: string, endDate?: string): Promise<Schedule[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const response = await apiClient.get(`/staff/${staffId}/schedules?${params}`);
    return response.data;
  },
};

export const scheduleAPI = {
  // Get all schedules
  getAll: async (startDate?: string, endDate?: string, department?: string): Promise<Schedule[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    if (department) params.append('department', department);
    
    const response = await apiClient.get(`/schedules?${params}`);
    return response.data;
  },

  // Get schedule by ID
  getById: async (id: string): Promise<Schedule> => {
    const response = await apiClient.get(`/schedules/${id}`);
    return response.data;
  },

  // Create new schedule
  create: async (scheduleData: CreateScheduleRequest): Promise<Schedule> => {
    const response = await apiClient.post('/schedules', scheduleData);
    return response.data;
  },

  // Update schedule
  update: async (id: string, scheduleData: Partial<CreateScheduleRequest>): Promise<Schedule> => {
    const response = await apiClient.put(`/schedules/${id}`, scheduleData);
    return response.data;
  },

  // Delete schedule
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/schedules/${id}`);
  },

  // Bulk create schedules
  bulkCreate: async (schedules: CreateScheduleRequest[]): Promise<Schedule[]> => {
    const response = await apiClient.post('/schedules/bulk', { schedules });
    return response.data;
  },
};
