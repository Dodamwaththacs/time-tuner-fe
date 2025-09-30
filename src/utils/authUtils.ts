// Centralized authentication and ID management utility

interface AuthData {
  token: string | null;
  organizationId: string | null;
  userId: string | null;
  departmentId: string | null;
  employeeId: string | null;
  user: any | null;
}

interface RequiredIds {
  organizationId?: boolean;
  userId?: boolean;
  departmentId?: boolean;
  employeeId?: boolean;
  token?: boolean;
}

/**
 * Get all authentication data at once
 */
export const getAuthData = (): AuthData => {
  const token = localStorage.getItem('authToken');
  const userData = localStorage.getItem('userData');
  const organizationId = localStorage.getItem('organizationId');
  const userId = localStorage.getItem('userId');
  const departmentId = localStorage.getItem('departmentId');

  let user = null;
  let userOrgId = null;
  let userEmployeeId = null;
  let userDepartmentId = null;

  if (userData) {
    try {
      user = JSON.parse(userData);
      userOrgId = user.organizationId;
      userEmployeeId = user.employeeId;
      userDepartmentId = user.departmentId;
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }

  return {
    token,
    organizationId: organizationId || userOrgId,
    userId: userId || user?.id,
    departmentId: departmentId || userDepartmentId,
    employeeId: userEmployeeId,
    user
  };
};

/**
 * Get specific IDs and validate they exist
 */
export const getRequiredIds = (required: RequiredIds): AuthData => {
  const authData = getAuthData();

  // Check for required IDs and throw error if missing
  if (required.organizationId && !authData.organizationId) {
    throw new Error('Organization ID not found. Please log in again.');
  }

  if (required.userId && !authData.userId) {
    throw new Error('User ID not found. Please log in again.');
  }

  if (required.departmentId && !authData.departmentId) {
    throw new Error('Department ID not found. Please contact your administrator.');
  }

  if (required.employeeId && !authData.employeeId) {
    throw new Error('Employee ID not found. Please contact your administrator.');
  }

  if (required.token && !authData.token) {
    throw new Error('Authentication token not found. Please log in again.');
  }

  return authData;
};

/**
 * Quick access functions for common scenarios
 */
export const getOrganizationId = (): string => {
  const { organizationId } = getRequiredIds({ organizationId: true });
  return organizationId!;
};

export const getUserId = (): string => {
  const { userId } = getRequiredIds({ userId: true });
  return userId!;
};

export const getDepartmentId = (): string => {
  const { departmentId } = getRequiredIds({ departmentId: true });
  return departmentId!;
};

export const getEmployeeId = (): string => {
  const { employeeId } = getRequiredIds({ employeeId: true });
  return employeeId!;
};

export const getAuthToken = (): string => {
  const { token } = getRequiredIds({ token: true });
  return token!;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const { token, user } = getAuthData();
  return !!(token && user);
};

/**
 * Get authorization headers for API calls
 */
export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  return {
    // 'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    // 'Accept': 'application/json'
  };
};

/**
 * Build API URL with organization context
 */
export const buildApiUrl = (
  baseUrl: string,
  endpoint: string,
  includeOrgId: boolean = true
): string => {
  const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  if (includeOrgId) {
    const organizationId = getOrganizationId();
    return `${base}/${endpoint}/${organizationId}`;
  }
  
  return `${base}/${endpoint}`;
};

/**
 * Get current user info
 */
export const getCurrentUser = () => {
  const { user } = getAuthData();
  return user;
};

/**
 * Clear all auth data (for logout)
 */
export const clearAuthData = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
  localStorage.removeItem('organizationId');
  localStorage.removeItem('userId');
  localStorage.removeItem('departmentId');
};