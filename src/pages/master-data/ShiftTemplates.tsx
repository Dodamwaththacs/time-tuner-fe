import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  MoreVertical,
  Save,
  X,
  Calendar,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Star,
  BookOpen,
  Shield,
  Zap,
  Target,
  TrendingUp,
  Users,
  MapPin,
  Phone,
  Mail,
  Globe,
  Settings,
  Eye,
  EyeOff,
  Download,
  Upload,
  RefreshCw,
  Copy,
  ExternalLink,
  Sun,
  Moon,
  Sunrise,
  Sunset
} from 'lucide-react';

interface ShiftTemplate {
  id: number;
  name: string;
  code: string;
  description: string;
  shiftType: 'Day' | 'Evening' | 'Night' | 'Weekend' | 'On-Call' | 'Split' | 'Rotating';
  startTime: string;
  endTime: string;
  duration: number; // in hours
  breakTime: number; // in minutes
  department: string;
  requiredSkills: string[];
  minStaffing: number;
  maxStaffing: number;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Active' | 'Inactive' | 'Deprecated';
  createdAt: string;
  lastModified: string;
  createdBy: string;
  // OptaPlanner specific fields
  optaPlannerWeight: number;
  hardConstraint: boolean;
  softConstraint: boolean;
  skillGapPenalty: number;
  skillMatchBonus: number;
  consecutiveShiftLimit: number;
  restPeriodRequired: number; // in hours
}

export const ShiftTemplates: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [shiftTypeFilter, setShiftTypeFilter] = useState<'all' | 'Day' | 'Evening' | 'Night' | 'Weekend' | 'On-Call' | 'Split' | 'Rotating'>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive' | 'Deprecated'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddTemplate, setShowAddTemplate] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ShiftTemplate | null>(null);
  const [selectedTemplates, setSelectedTemplates] = useState<number[]>([]);

  const shiftTemplates: ShiftTemplate[] = [
    {
      id: 1,
      name: 'Emergency Day Shift',
      code: 'ED-DAY',
      description: 'Standard day shift for emergency department staff',
      shiftType: 'Day',
      startTime: '07:00',
      endTime: '19:00',
      duration: 12,
      breakTime: 60,
      department: 'Emergency Department',
      requiredSkills: ['Emergency Medicine', 'ACLS', 'PALS'],
      minStaffing: 8,
      maxStaffing: 15,
      priority: 'Critical',
      status: 'Active',
      createdAt: '2023-01-15',
      lastModified: '2024-01-10',
      createdBy: 'Dr. Sarah Johnson',
      optaPlannerWeight: 100,
      hardConstraint: true,
      softConstraint: false,
      skillGapPenalty: 50,
      skillMatchBonus: 20,
      consecutiveShiftLimit: 3,
      restPeriodRequired: 12
    },
    {
      id: 2,
      name: 'Emergency Night Shift',
      code: 'ED-NIGHT',
      description: 'Night shift for emergency department with critical staffing',
      shiftType: 'Night',
      startTime: '19:00',
      endTime: '07:00',
      duration: 12,
      breakTime: 60,
      department: 'Emergency Department',
      requiredSkills: ['Emergency Medicine', 'Trauma Care', 'ACLS'],
      minStaffing: 6,
      maxStaffing: 12,
      priority: 'Critical',
      status: 'Active',
      createdAt: '2023-01-15',
      lastModified: '2024-01-08',
      createdBy: 'Dr. Sarah Johnson',
      optaPlannerWeight: 100,
      hardConstraint: true,
      softConstraint: false,
      skillGapPenalty: 60,
      skillMatchBonus: 25,
      consecutiveShiftLimit: 2,
      restPeriodRequired: 16
    },
    {
      id: 3,
      name: 'ICU Day Shift',
      code: 'ICU-DAY',
      description: 'Day shift for intensive care unit nursing staff',
      shiftType: 'Day',
      startTime: '07:00',
      endTime: '19:00',
      duration: 12,
      breakTime: 45,
      department: 'Intensive Care Unit',
      requiredSkills: ['Critical Care Nursing', 'Ventilator Management'],
      minStaffing: 6,
      maxStaffing: 12,
      priority: 'High',
      status: 'Active',
      createdAt: '2023-02-01',
      lastModified: '2024-01-05',
      createdBy: 'Nurse Manager David Brown',
      optaPlannerWeight: 90,
      hardConstraint: true,
      softConstraint: false,
      skillGapPenalty: 40,
      skillMatchBonus: 15,
      consecutiveShiftLimit: 3,
      restPeriodRequired: 12
    },
    {
      id: 4,
      name: 'ICU Night Shift',
      code: 'ICU-NIGHT',
      description: 'Night shift for intensive care unit with specialized care',
      shiftType: 'Night',
      startTime: '19:00',
      endTime: '07:00',
      duration: 12,
      breakTime: 45,
      department: 'Intensive Care Unit',
      requiredSkills: ['Critical Care Nursing', 'ICU Protocols'],
      minStaffing: 4,
      maxStaffing: 8,
      priority: 'High',
      status: 'Active',
      createdAt: '2023-02-01',
      lastModified: '2023-12-20',
      createdBy: 'Nurse Manager David Brown',
      optaPlannerWeight: 85,
      hardConstraint: true,
      softConstraint: false,
      skillGapPenalty: 45,
      skillMatchBonus: 18,
      consecutiveShiftLimit: 2,
      restPeriodRequired: 16
    },
    {
      id: 5,
      name: 'OR Surgical Shift',
      code: 'OR-SURG',
      description: 'Surgical shift for operating room staff',
      shiftType: 'Day',
      startTime: '08:00',
      endTime: '18:00',
      duration: 10,
      breakTime: 30,
      department: 'Operating Room',
      requiredSkills: ['Surgical Nursing', 'Sterile Processing'],
      minStaffing: 4,
      maxStaffing: 10,
      priority: 'High',
      status: 'Active',
      createdAt: '2023-02-15',
      lastModified: '2023-11-15',
      createdBy: 'Dr. Emily Chen',
      optaPlannerWeight: 80,
      hardConstraint: true,
      softConstraint: false,
      skillGapPenalty: 35,
      skillMatchBonus: 12,
      consecutiveShiftLimit: 4,
      restPeriodRequired: 10
    },
    {
      id: 6,
      name: 'OR On-Call',
      code: 'OR-ONCALL',
      description: 'On-call shift for emergency surgeries',
      shiftType: 'On-Call',
      startTime: '18:00',
      endTime: '08:00',
      duration: 14,
      breakTime: 0,
      department: 'Operating Room',
      requiredSkills: ['Surgical Nursing', 'Anesthesia Management'],
      minStaffing: 2,
      maxStaffing: 4,
      priority: 'Critical',
      status: 'Active',
      createdAt: '2023-02-15',
      lastModified: '2024-01-12',
      createdBy: 'Dr. Emily Chen',
      optaPlannerWeight: 95,
      hardConstraint: true,
      softConstraint: false,
      skillGapPenalty: 55,
      skillMatchBonus: 22,
      consecutiveShiftLimit: 1,
      restPeriodRequired: 24
    },
    {
      id: 7,
      name: 'Lab Day Shift',
      code: 'LAB-DAY',
      description: 'Day shift for laboratory services',
      shiftType: 'Day',
      startTime: '08:00',
      endTime: '16:00',
      duration: 8,
      breakTime: 30,
      department: 'Laboratory Services',
      requiredSkills: ['Medical Technology', 'Lab Procedures'],
      minStaffing: 2,
      maxStaffing: 5,
      priority: 'Medium',
      status: 'Active',
      createdAt: '2023-03-01',
      lastModified: '2023-12-10',
      createdBy: 'Dr. Robert Taylor',
      optaPlannerWeight: 60,
      hardConstraint: false,
      softConstraint: true,
      skillGapPenalty: 20,
      skillMatchBonus: 8,
      consecutiveShiftLimit: 5,
      restPeriodRequired: 8
    },
    {
      id: 8,
      name: 'Weekend Coverage',
      code: 'WEEKEND',
      description: 'Weekend shift for all departments',
      shiftType: 'Weekend',
      startTime: '08:00',
      endTime: '20:00',
      duration: 12,
      breakTime: 60,
      department: 'All Departments',
      requiredSkills: ['Patient Care Coordination'],
      minStaffing: 3,
      maxStaffing: 8,
      priority: 'Medium',
      status: 'Active',
      createdAt: '2023-03-15',
      lastModified: '2023-10-20',
      createdBy: 'HR Manager',
      optaPlannerWeight: 50,
      hardConstraint: false,
      softConstraint: true,
      skillGapPenalty: 15,
      skillMatchBonus: 5,
      consecutiveShiftLimit: 2,
      restPeriodRequired: 12
    },
    {
      id: 9,
      name: 'Split Shift',
      code: 'SPLIT',
      description: 'Split shift for flexible scheduling',
      shiftType: 'Split',
      startTime: '06:00',
      endTime: '22:00',
      duration: 16,
      breakTime: 120,
      department: 'Emergency Department',
      requiredSkills: ['Emergency Medicine'],
      minStaffing: 4,
      maxStaffing: 8,
      priority: 'Low',
      status: 'Inactive',
      createdAt: '2023-04-01',
      lastModified: '2023-08-15',
      createdBy: 'Dr. Sarah Johnson',
      optaPlannerWeight: 30,
      hardConstraint: false,
      softConstraint: true,
      skillGapPenalty: 10,
      skillMatchBonus: 3,
      consecutiveShiftLimit: 1,
      restPeriodRequired: 20
    },
    {
      id: 10,
      name: 'Legacy Template',
      code: 'LEGACY',
      description: 'Deprecated shift template from old system',
      shiftType: 'Day',
      startTime: '09:00',
      endTime: '17:00',
      duration: 8,
      breakTime: 30,
      department: 'IT Department',
      requiredSkills: ['Legacy System Management'],
      minStaffing: 1,
      maxStaffing: 2,
      priority: 'Low',
      status: 'Deprecated',
      createdAt: '2022-01-01',
      lastModified: '2023-06-01',
      createdBy: 'IT Manager',
      optaPlannerWeight: 10,
      hardConstraint: false,
      softConstraint: true,
      skillGapPenalty: 5,
      skillMatchBonus: 1,
      consecutiveShiftLimit: 5,
      restPeriodRequired: 8
    }
  ];

  const filteredTemplates = shiftTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesShiftType = shiftTypeFilter === 'all' || template.shiftType === shiftTypeFilter;
    const matchesDepartment = departmentFilter === 'all' || template.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || template.status === statusFilter;
    
    return matchesSearch && matchesShiftType && matchesDepartment && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'Inactive': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Deprecated': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getShiftTypeIcon = (shiftType: string) => {
    switch (shiftType) {
      case 'Day': return <Sun className="w-4 h-4 text-yellow-600" />;
      case 'Evening': return <Sunset className="w-4 h-4 text-orange-600" />;
      case 'Night': return <Moon className="w-4 h-4 text-blue-600" />;
      case 'Weekend': return <Calendar className="w-4 h-4 text-purple-600" />;
      case 'On-Call': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'Split': return <Clock className="w-4 h-4 text-gray-600" />;
      case 'Rotating': return <RefreshCw className="w-4 h-4 text-green-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const toggleTemplateSelection = (templateId: number) => {
    setSelectedTemplates(prev => 
      prev.includes(templateId) 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  const getTotalTemplates = () => shiftTemplates.length;
  const getActiveTemplates = () => shiftTemplates.filter(t => t.status === 'Active').length;
  const getCriticalTemplates = () => shiftTemplates.filter(t => t.priority === 'Critical').length;
  const getTotalHours = () => shiftTemplates.reduce((sum, t) => sum + t.duration, 0);

  const departments = Array.from(new Set(shiftTemplates.map(t => t.department)));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shift Templates</h1>
          <p className="text-gray-600 mt-1">Manage shift patterns and OptaPlanner scheduling configurations</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </button>
          <button 
            onClick={() => setShowAddTemplate(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Template
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Templates</p>
              <p className="text-2xl font-bold text-gray-900">{getTotalTemplates()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Templates</p>
              <p className="text-2xl font-bold text-gray-900">{getActiveTemplates()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Critical Templates</p>
              <p className="text-2xl font-bold text-gray-900">{getCriticalTemplates()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Hours</p>
              <p className="text-2xl font-bold text-gray-900">{getTotalHours()}</p>
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
                  placeholder="Search templates by name, code, or description..."
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shift Type</label>
                  <select
                    value={shiftTypeFilter}
                    onChange={(e) => setShiftTypeFilter(e.target.value as any)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="Day">Day</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                    <option value="Weekend">Weekend</option>
                    <option value="On-Call">On-Call</option>
                    <option value="Split">Split</option>
                    <option value="Rotating">Rotating</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Deprecated">Deprecated</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Templates Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTemplates(filteredTemplates.map(t => t.id));
                      } else {
                        setSelectedTemplates([]);
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Template
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department & Staffing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  OptaPlanner Config
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTemplates.map((template) => (
                <tr key={template.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedTemplates.includes(template.id)}
                      onChange={() => toggleTemplateSelection(template.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-blue-600 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{template.name}</div>
                        <div className="text-sm text-gray-500">{template.code}</div>
                        <div className="text-xs text-gray-400 truncate max-w-xs">{template.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getShiftTypeIcon(template.shiftType)}
                      <span className="text-sm text-gray-900">{template.shiftType}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatTime(template.startTime)} - {formatTime(template.endTime)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {template.duration}h ({template.breakTime}m break)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{template.department}</div>
                    <div className="text-sm text-gray-500">
                      {template.minStaffing}-{template.maxStaffing} staff
                    </div>
                    <div className="text-xs text-gray-400">
                      {template.requiredSkills.length} skills required
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(template.priority)}`}>
                        {template.priority}
                      </span>
                      <br />
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(template.status)}`}>
                        {template.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm space-y-1">
                      <div className="flex items-center">
                        <Zap className="w-3 h-3 text-yellow-600 mr-1" />
                        <span className="text-gray-900">Weight: {template.optaPlannerWeight}</span>
                      </div>
                      <div className="flex items-center">
                        {template.hardConstraint ? (
                          <CheckCircle className="w-3 h-3 text-red-600 mr-1" />
                        ) : (
                          <XCircle className="w-3 h-3 text-gray-400 mr-1" />
                        )}
                        <span className="text-xs text-gray-600">Hard Constraint</span>
                      </div>
                      <div className="flex items-center">
                        {template.softConstraint ? (
                          <CheckCircle className="w-3 h-3 text-blue-600 mr-1" />
                        ) : (
                          <XCircle className="w-3 h-3 text-gray-400 mr-1" />
                        )}
                        <span className="text-xs text-gray-600">Soft Constraint</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setEditingTemplate(template)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900 p-1 rounded">
                        <Copy className="w-4 h-4" />
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
      </div>

      {/* Add/Edit Template Modal */}
      {(showAddTemplate || editingTemplate) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingTemplate ? 'Edit Template' : 'Add New Template'}
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
                  <input
                    type="text"
                    defaultValue={editingTemplate?.name}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter template name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Template Code</label>
                  <input
                    type="text"
                    defaultValue={editingTemplate?.code}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter template code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    defaultValue={editingTemplate?.description}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Enter template description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shift Type</label>
                    <select
                      defaultValue={editingTemplate?.shiftType}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Day">Day</option>
                      <option value="Evening">Evening</option>
                      <option value="Night">Night</option>
                      <option value="Weekend">Weekend</option>
                      <option value="On-Call">On-Call</option>
                      <option value="Split">Split</option>
                      <option value="Rotating">Rotating</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      defaultValue={editingTemplate?.priority}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                    <input
                      type="time"
                      defaultValue={editingTemplate?.startTime}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                    <input
                      type="time"
                      defaultValue={editingTemplate?.endTime}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Staffing</label>
                    <input
                      type="number"
                      defaultValue={editingTemplate?.minStaffing}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Min staff"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Staffing</label>
                    <input
                      type="number"
                      defaultValue={editingTemplate?.maxStaffing}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Max staff"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddTemplate(false);
                      setEditingTemplate(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingTemplate ? 'Update' : 'Create'} Template
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