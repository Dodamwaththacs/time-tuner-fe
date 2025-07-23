import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Search, 
  Filter, 
  MoreVertical,
  ChevronDown,
  ChevronRight,
  UserCheck,
  Calendar,
  Target,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  Globe,
  Settings,
  Save,
  X,
  Clock,
  Award,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Department {
  id: number;
  name: string;
  code: string;
  description: string;
  manager: string;
  employeeCount: number;
  location: string;
  status: 'Active' | 'Inactive';
  budget: number;
  createdAt: string;
  parentDepartment?: number;
  children?: Department[];
  // Roster allocation specific fields
  minStaffing: number;
  maxStaffing: number;
  requiredSkills: string[];
  shiftTypes: string[];
  optimizationPriority: 'High' | 'Medium' | 'Low';
  schedulingConstraints: string[];
  optaPlannerConfig: {
    hardScoreWeight: number;
    softScoreWeight: number;
    timeWindow: number;
    maxOvertime: number;
  };
}

export const Departments: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [expandedDepartments, setExpandedDepartments] = useState<number[]>([]);

  const departments: Department[] = [
    {
      id: 1,
      name: 'Emergency Department',
      code: 'ED',
      description: '24/7 emergency medical services with critical staffing requirements',
      manager: 'Dr. Sarah Johnson',
      employeeCount: 45,
      location: 'Main Hospital',
      status: 'Active',
      budget: 3500000,
      createdAt: '2023-01-15',
      minStaffing: 8,
      maxStaffing: 15,
      requiredSkills: ['Emergency Medicine', 'Trauma Care', 'ACLS', 'PALS'],
      shiftTypes: ['Day', 'Evening', 'Night', 'Weekend'],
      optimizationPriority: 'High',
      schedulingConstraints: ['Minimum 2 doctors per shift', 'No consecutive night shifts', 'Weekend rotation required'],
      optaPlannerConfig: {
        hardScoreWeight: 100,
        softScoreWeight: 50,
        timeWindow: 30,
        maxOvertime: 12
      },
      children: [
        {
          id: 2,
          name: 'ED Triage',
          code: 'ED-TRI',
          description: 'Patient triage and initial assessment',
          manager: 'Dr. Mike Davis',
          employeeCount: 12,
          location: 'Main Hospital',
          status: 'Active',
          budget: 1200000,
          createdAt: '2023-02-01',
          parentDepartment: 1,
          minStaffing: 3,
          maxStaffing: 6,
          requiredSkills: ['Triage', 'Emergency Assessment', 'Patient Care'],
          shiftTypes: ['Day', 'Evening', 'Night'],
          optimizationPriority: 'High',
          schedulingConstraints: ['Minimum 1 RN per shift', '24/7 coverage required'],
          optaPlannerConfig: {
            hardScoreWeight: 100,
            softScoreWeight: 30,
            timeWindow: 14,
            maxOvertime: 8
          }
        }
      ]
    },
    {
      id: 4,
      name: 'Intensive Care Unit',
      code: 'ICU',
      description: 'Critical care unit with specialized nursing requirements',
      manager: 'Nurse Manager David Brown',
      employeeCount: 32,
      location: 'Main Hospital',
      status: 'Active',
      budget: 2800000,
      createdAt: '2023-01-20',
      minStaffing: 6,
      maxStaffing: 12,
      requiredSkills: ['Critical Care Nursing', 'Ventilator Management', 'ICU Protocols'],
      shiftTypes: ['Day', 'Night'],
      optimizationPriority: 'High',
      schedulingConstraints: ['1:2 nurse-to-patient ratio', 'No more than 3 consecutive nights'],
      optaPlannerConfig: {
        hardScoreWeight: 100,
        softScoreWeight: 60,
        timeWindow: 28,
        maxOvertime: 8
      }
    },
    {
      id: 5,
      name: 'Operating Room',
      code: 'OR',
      description: 'Surgical services with complex scheduling requirements',
      manager: 'Dr. Emily Chen',
      employeeCount: 28,
      location: 'Main Hospital',
      status: 'Active',
      budget: 4200000,
      createdAt: '2023-01-25',
      minStaffing: 4,
      maxStaffing: 10,
      requiredSkills: ['Surgical Nursing', 'Anesthesia', 'Sterile Processing'],
      shiftTypes: ['Day', 'Evening', 'On-Call'],
      optimizationPriority: 'Medium',
      schedulingConstraints: ['Surgeon preference matching', 'Equipment availability', 'Room scheduling'],
      optaPlannerConfig: {
        hardScoreWeight: 80,
        softScoreWeight: 70,
        timeWindow: 21,
        maxOvertime: 10
      }
    },
    {
      id: 7,
      name: 'Laboratory Services',
      code: 'LAB',
      description: 'Medical laboratory with 24/7 testing requirements',
      manager: 'Dr. Robert Taylor',
      employeeCount: 15,
      location: 'Main Hospital',
      status: 'Active',
      budget: 1200000,
      createdAt: '2023-01-30',
      minStaffing: 2,
      maxStaffing: 5,
      requiredSkills: ['Medical Technology', 'Lab Procedures', 'Quality Control'],
      shiftTypes: ['Day', 'Evening', 'Night', 'Weekend'],
      optimizationPriority: 'Medium',
      schedulingConstraints: ['24/7 coverage required', 'Specialist availability for complex tests'],
      optaPlannerConfig: {
        hardScoreWeight: 70,
        softScoreWeight: 50,
        timeWindow: 14,
        maxOvertime: 8
      }
    }
  ];

  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dept.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dept.manager.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || dept.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const toggleExpanded = (departmentId: number) => {
    setExpandedDepartments(prev => 
      prev.includes(departmentId) 
        ? prev.filter(id => id !== departmentId)
        : [...prev, departmentId]
    );
  };

function handleSubmit(e:any) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = {
    department_name: formData.get('department_name'),
    description: formData.get('description'),
    location: formData.get('location'),
    active: formData.get('active') === 'on',
  };

  if (editingDepartment) {
    // update logic
  } else {
    // create logic
  }
}


  const getTotalEmployees = (department: Department): number => {
    let total = department.employeeCount;
    if (department.children) {
      total += department.children.reduce((sum, child) => sum + getTotalEmployees(child), 0);
    }
    return total;
  };

  const getTotalBudget = (department: Department): number => {
    let total = department.budget;
    if (department.children) {
      total += department.children.reduce((sum, child) => sum + getTotalBudget(child), 0);
    }
    return total;
  };

  const renderDepartmentRow = (department: Department, level: number = 0) => {
    const isExpanded = expandedDepartments.includes(department.id);
    const hasChildren = department.children && department.children.length > 0;

    return (
      <React.Fragment key={department.id}>
        <tr className="hover:bg-gray-50">
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center" style={{ paddingLeft: `${level * 24}px` }}>
              {hasChildren && (
                <button
                  onClick={() => toggleExpanded(department.id)}
                  className="mr-2 text-gray-400 hover:text-gray-600"
                >
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              )}
              <div className="flex items-center">
                <Building2 className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <div className="text-sm font-medium text-gray-900">{department.name}</div>
                  <div className="text-sm text-gray-500">{department.code}</div>
                </div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">{department.manager}</div>
            <div className="text-sm text-gray-500">{department.location}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <Users className="w-4 h-4 text-gray-400 mr-1" />
              <span className="text-sm text-gray-900">{getTotalEmployees(department)}</span>
            </div>
            <div className="text-sm text-gray-500">
              {department.minStaffing}-{department.maxStaffing} per shift
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className="text-sm text-gray-900">{formatCurrency(getTotalBudget(department))}</span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="space-y-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(department.status)}`}>
                {department.status}
              </span>
              <br />
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(department.optimizationPriority)}`}>
                {department.optimizationPriority} Priority
              </span>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setEditingDepartment(department)}
                className="text-blue-600 hover:text-blue-900 p-1 rounded"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button className="text-green-600 hover:text-green-900 p-1 rounded">
                <Zap className="w-4 h-4" />
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
        {hasChildren && isExpanded && department.children?.map(child => renderDepartmentRow(child, level + 1))}
      </React.Fragment>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Department Management</h1>
          <p className="text-gray-600 mt-1">Manage departments and their OptaPlanner scheduling configurations</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowAddDepartment(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Department
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Departments</p>
              <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900">
                {departments.reduce((sum, dept) => sum + getTotalEmployees(dept), 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">
                {departments.filter(d => d.optimizationPriority === 'High').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Zap className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">OptaPlanner Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {departments.filter(d => d.status === 'Active').length}
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
                  placeholder="Search departments by name, code, or manager..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'Active' | 'Inactive')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Departments Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Manager & Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staffing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status & Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDepartments.map(dept => renderDepartmentRow(dept))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Department Modal */}
      {(showAddDepartment || editingDepartment) && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div className="mt-3">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {editingDepartment ? 'Edit Department' : 'Add New Department'}
        </h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department Name</label>
            <input
              type="text"
              defaultValue={editingDepartment?.name}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter department name"
              name="department_name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              defaultValue={editingDepartment?.description}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Enter department description"
              name="description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              defaultValue={editingDepartment?.location}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter location"
              name="location"
            />
          </div>


          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowAddDepartment(false);
                setEditingDepartment(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {editingDepartment ? 'Update' : 'Create'} Department
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}

    </div>
  );
}; 