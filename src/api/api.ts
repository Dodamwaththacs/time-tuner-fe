// Export all API modules from a single entry point
export { apiClient } from './index';
export * from './auth';
export * from './organizations';
export * from './subscriptions';
export * from './staff';

// API error types
export interface APIError {
  message: string;
  code?: string;
  field?: string;
}

export interface APIResponse<T> {
  data: T;
  message?: string;
  status: number;
}

// Common API utilities
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  ORGANIZATIONS: {
    BASE: '/organizations',
    CURRENT: '/organizations/current',
    CHECK_CODE: '/organizations/check-code',
  },
  SUBSCRIPTIONS: {
    BASE: '/subscriptions',
    PLANS: '/subscriptions/plans',
    CURRENT: '/subscriptions/current',
    TRIAL: '/subscriptions/trial',
    USAGE: '/subscriptions/current/usage',
  },
  STAFF: {
    BASE: '/staff',
    SCHEDULES: '/schedules',
    BULK_SCHEDULES: '/schedules/bulk',
  },
} as const;
