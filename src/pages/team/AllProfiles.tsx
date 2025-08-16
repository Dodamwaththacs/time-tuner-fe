import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { 
  ChevronUp, 
  User, 
  Calendar, 
  MapPin, 
  Award, 
  Clock, 
  Search, 
  Filter, 
  Plus, 
  Edit,
  MoreVertical,
  Eye,
  Trash2,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Mail,
  Shield,
  Loader
} from 'lucide-react';
import { employeeAPI, type Employee, type EmployeeSkill, type EmployeePreference } from '../../api/employee';

// Type aliases for better compatibility
type FilterStatus = 'all' | 'active' | 'inactive';

// Constants
const PROFICIENCY_COLORS = {
  EXPERT: 'bg-green-100 text-green-800',
  EXPERIENCED: 'bg-blue-100 text-blue-800',
  CERTIFIED: 'bg-purple-100 text-purple-800'
} as const;

const PREFERENCE_COLORS = {
  PREFERRED: 'bg-green-100 text-green-800',
  AVAILABLE: 'bg-blue-100 text-blue-800',
  UNAVAILABLE: 'bg-red-100 text-red-800'
} as const;

export const AllProfiles: React.FC = () => {
  // State management
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedEmployees, setExpandedEmployees] = useState<Set<string>>(new Set());
  const [filterActive, setFilterActive] = useState<FilterStatus>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Fetch employees from API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await employeeAPI.getAllEmployeesWithDeparment();
        setEmployees(data);
      } catch (err) {
        console.error('Failed to fetch employees:', err);
        setError('Failed to load employees. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Utility functions with proper TypeScript typing
  const toggleEmployeeExpansion = useCallback((employeeId: string) => {
    setExpandedEmployees(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(employeeId)) {
        newExpanded.delete(employeeId);
      } else {
        newExpanded.add(employeeId);
      }
      return newExpanded;
    });
  }, []);

  const formatDate = useCallback((dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  const getProficiencyColor = useCallback((level: EmployeeSkill['proficiencyLevel']): string => {
    return PROFICIENCY_COLORS[level] || 'bg-gray-100 text-gray-800';
  }, []);

  const getPreferenceColor = useCallback((type: EmployeePreference['preferenceType']): string => {
    return PREFERENCE_COLORS[type] || 'bg-gray-100 text-gray-800';
  }, []);

  const isSkillExpiring = useCallback((expiryDate: string | null): boolean => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 90 && diffDays > 0;
  }, []);

  const isSkillExpired = useCallback((expiryDate: string | null): boolean => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  }, []);

  // Selection utility functions
  const toggleEmployeeSelection = useCallback((employeeId: string) => {
    setSelectedEmployees(prev =>
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  }, []);

  // Get unique departments and roles for filters
  const uniqueDepartments = useMemo(() => {
    const departments = employees.map(emp => emp.primaryDepartment.departmentName);
    return [...new Set(departments)];
  }, [employees]);

  const uniqueRoles = useMemo(() => {
    const roles = employees.map(emp => emp.primaryRole.roleName);
    return [...new Set(roles)];
  }, [employees]);

  // Status utility functions
  const getStatusColor = (active: boolean) => {
    return active 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const getStatusIcon = (active: boolean) => {
    return active ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />;
  };

  // Memoized filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      // Filter by status
      const statusMatch = 
        filterActive === 'all' || 
        (filterActive === 'active' && emp.active) || 
        (filterActive === 'inactive' && !emp.active);

      // Filter by search term
      const searchMatch = !searchTerm || 
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.primaryRole.roleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.primaryDepartment.departmentName.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by department
      const departmentMatch = departmentFilter === 'all' || emp.primaryDepartment.departmentName === departmentFilter;

      // Filter by role
      const roleMatch = roleFilter === 'all' || emp.primaryRole.roleName === roleFilter;

      return statusMatch && searchMatch && departmentMatch && roleMatch;
    });
  }, [employees, filterActive, searchTerm, departmentFilter, roleFilter]);

  const toggleAllEmployees = useCallback(() => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map(emp => emp.id));
    }
  }, [selectedEmployees.length, filteredEmployees]);

  return (
      <div className="p-6 space-y-6">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-blue-600 mr-3" />
            <span className="text-lg text-gray-600">Loading employees...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800 font-medium">Error</span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Main Content - Only show when not loading and no error */}
        {!loading && !error && (
          <>
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
                <p className="text-gray-600 mt-1">
                  Manage staff information, skills, and scheduling preferences
                </p>
              </div>
              <div className="flex space-x-3">
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Employee
                </button>
                <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Upload className="w-4 h-4 mr-2" />
                  Bulk Import
                </button>
                <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
              </div>
            </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Employees</p>
                <p className="text-2xl font-bold text-gray-900">
                  {employees.filter(e => e.active).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Skills</p>
                <p className="text-2xl font-bold text-gray-900">
                  {employees.reduce((sum, emp) => sum + emp.skills.length, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total FTE</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(employees.reduce((sum, emp) => sum + emp.contract.ftePercentage, 0)).toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search employees by name, code, email, role, or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={filterActive}
                      onChange={(e) => setFilterActive(e.target.value as FilterStatus)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <select
                      value={departmentFilter}
                      onChange={(e) => setDepartmentFilter(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Departments</option>
                      {uniqueDepartments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Roles</option>
                      {uniqueRoles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Employee Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedEmployees.length === filteredEmployees.length &&
                        filteredEmployees.length > 0
                      }
                      onChange={toggleAllEmployees}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role & Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contract & FTE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Skills Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(employee.id)}
                        onChange={() => toggleEmployeeSelection(employee.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {employee.firstName[0]}{employee.lastName[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {employee.firstName} {employee.lastName}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {employee.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <span className="mr-1">ID:</span>
                            {employee.employeeCode}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.primaryRole.roleName}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {employee.primaryDepartment.departmentName}
                      </div>
                      <div className="text-sm text-gray-500">{employee.primaryDepartment.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(employee.active)}`}
                      >
                        {getStatusIcon(employee.active)}
                        <span className="ml-1">{employee.active ? 'Active' : 'Inactive'}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.contract.contractName}</div>
                      <div className="text-sm text-gray-500">
                        FTE: {(employee.contract.ftePercentage * 100).toFixed(0)}%
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Hired {formatDate(employee.hireDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {employee.skills.length} skills
                      </div>
                      <div className="text-sm text-gray-500">
                        {employee.skills.filter(s => s.expiryDate && isSkillExpiring(s.expiryDate)).length > 0 && (
                          <span className="text-orange-600">
                            {employee.skills.filter(s => s.expiryDate && isSkillExpiring(s.expiryDate)).length} expiring
                          </span>
                        )}
                        {employee.skills.filter(s => s.expiryDate && isSkillExpired(s.expiryDate)).length > 0 && (
                          <span className="text-red-600">
                            {employee.skills.filter(s => s.expiryDate && isSkillExpired(s.expiryDate)).length} expired
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => toggleEmployeeExpansion(employee.id)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900 p-1 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 p-1 rounded">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">{filteredEmployees.length}</span> of{" "}
                <span className="font-medium">{employees.length}</span> results
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Details Modal/Expansion */}
        {filteredEmployees.filter(emp => expandedEmployees.has(emp.id)).map(employee => (
          <div key={`expanded-${employee.id}`} className="bg-white rounded-lg shadow border">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Employee Details: {employee.firstName} {employee.lastName}
              </h3>
              <button
                onClick={() => toggleEmployeeExpansion(employee.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 grid md:grid-cols-2 gap-6">
              {/* Contact & Basic Info */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Contact Information
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="text-gray-900">{employee.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Phone:</span>
                    <span className="text-gray-900">{employee.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Username:</span>
                    <span className="text-gray-900">{employee.userAccount.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">System Role:</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {employee.userAccount.userRole}
                    </span>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Department & Contract
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Department:</span>
                    <span className="text-gray-900">{employee.primaryDepartment.departmentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Location:</span>
                    <span className="text-gray-900">{employee.primaryDepartment.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Contract:</span>
                    <span className="text-gray-900">{employee.contract.contractName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">FTE:</span>
                    <span className="text-gray-900 font-semibold">
                      {(employee.contract.ftePercentage * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Skills & Preferences */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Skills & Certifications
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3 max-h-64 overflow-y-auto">
                  {employee.skills.map((skill, index) => (
                    <div key={index} className="border-l-4 border-blue-200 pl-3 py-2 bg-white rounded">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{skill.skillName}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProficiencyColor(skill.proficiencyLevel)}`}>
                          {skill.proficiencyLevel}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>Certified: {formatDate(skill.certifiedDate)}</div>
                        {skill.expiryDate && (
                          <div className={`${
                            isSkillExpired(skill.expiryDate) ? 'text-red-600 font-medium' :
                            isSkillExpiring(skill.expiryDate) ? 'text-orange-600 font-medium' :
                            'text-gray-600'
                          }`}>
                            Expires: {formatDate(skill.expiryDate)}
                            {isSkillExpired(skill.expiryDate) && ' (EXPIRED)'}
                            {isSkillExpiring(skill.expiryDate) && !isSkillExpired(skill.expiryDate) && ' (Expiring Soon)'}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Shift Preferences
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  {employee.preferences.map((pref, index) => (
                    <div key={index} className="border-l-4 border-green-200 pl-3 py-2 bg-white rounded">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{pref.shiftType}</span>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPreferenceColor(pref.preferenceType)}`}>
                            {pref.preferenceType}
                          </span>
                          <span className="text-sm text-gray-500 font-medium">
                            Weight: {pref.preferenceWeight}/10
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        Department: {pref.department}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {filteredEmployees.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow border">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? `No employees match your search "${searchTerm}"`
                : 'Try adjusting your filter criteria'
              }
            </p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        )}
            </>
          )}
        </div>
    );
};

export default AllProfiles;