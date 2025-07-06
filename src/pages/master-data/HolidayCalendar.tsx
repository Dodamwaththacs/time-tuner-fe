import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  MoreVertical,
  Save,
  X,
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
  Sunset,
  Gift,
  Flag,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  CalendarDays,
  CalendarRange,
  CalendarCheck,
  CalendarX
} from 'lucide-react';

interface Holiday {
  id: number;
  name: string;
  date: string;
  type: 'Public Holiday' | 'Medical Holiday' | 'Department Holiday' | 'Personal Holiday' | 'Training Day' | 'Maintenance Day';
  description: string;
  department: string;
  status: 'Active' | 'Inactive' | 'Pending';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  createdAt: string;
  lastModified: string;
  createdBy: string;
  // OptaPlanner specific fields
  optaPlannerWeight: number;
  affectsScheduling: boolean;
  mandatoryDayOff: boolean;
  reducedStaffing: boolean;
  minStaffingRequired: number;
  maxStaffingAllowed: number;
  skillRequirements: string[];
  compensationRate: number; // 1.0 = normal, 1.5 = time and half, 2.0 = double time
  advanceNoticeDays: number;
}

export const HolidayCalendar: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive' | 'Pending'>('all');
  const [yearFilter, setYearFilter] = useState<string>('2024');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddHoliday, setShowAddHoliday] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [selectedHolidays, setSelectedHolidays] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const holidays: Holiday[] = [
    {
      id: 1,
      name: 'New Year\'s Day',
      date: '2024-01-01',
      type: 'Public Holiday',
      description: 'National holiday - minimal staffing required',
      department: 'All Departments',
      status: 'Active',
      priority: 'High',
      createdAt: '2023-12-01',
      lastModified: '2023-12-15',
      createdBy: 'HR Manager',
      optaPlannerWeight: 80,
      affectsScheduling: true,
      mandatoryDayOff: false,
      reducedStaffing: true,
      minStaffingRequired: 3,
      maxStaffingAllowed: 8,
      skillRequirements: ['Emergency Medicine', 'Critical Care'],
      compensationRate: 2.0,
      advanceNoticeDays: 30
    },
    {
      id: 2,
      name: 'Martin Luther King Jr. Day',
      date: '2024-01-15',
      type: 'Public Holiday',
      description: 'Federal holiday - reduced services',
      department: 'All Departments',
      status: 'Active',
      priority: 'Medium',
      createdAt: '2023-12-01',
      lastModified: '2023-12-10',
      createdBy: 'HR Manager',
      optaPlannerWeight: 60,
      affectsScheduling: true,
      mandatoryDayOff: false,
      reducedStaffing: true,
      minStaffingRequired: 4,
      maxStaffingAllowed: 10,
      skillRequirements: ['Patient Care'],
      compensationRate: 1.5,
      advanceNoticeDays: 21
    },
    {
      id: 3,
      name: 'Emergency Department Training',
      date: '2024-02-15',
      type: 'Training Day',
      description: 'Annual emergency response training for ED staff',
      department: 'Emergency Department',
      status: 'Active',
      priority: 'High',
      createdAt: '2023-11-15',
      lastModified: '2024-01-05',
      createdBy: 'Dr. Sarah Johnson',
      optaPlannerWeight: 70,
      affectsScheduling: true,
      mandatoryDayOff: false,
      reducedStaffing: false,
      minStaffingRequired: 6,
      maxStaffingAllowed: 12,
      skillRequirements: ['Emergency Medicine', 'ACLS', 'PALS'],
      compensationRate: 1.0,
      advanceNoticeDays: 45
    },
    {
      id: 4,
      name: 'ICU Equipment Maintenance',
      date: '2024-03-10',
      type: 'Maintenance Day',
      description: 'Scheduled maintenance of ICU equipment and systems',
      department: 'Intensive Care Unit',
      status: 'Active',
      priority: 'Critical',
      createdAt: '2023-10-20',
      lastModified: '2023-12-20',
      createdBy: 'Nurse Manager David Brown',
      optaPlannerWeight: 90,
      affectsScheduling: true,
      mandatoryDayOff: false,
      reducedStaffing: true,
      minStaffingRequired: 2,
      maxStaffingAllowed: 4,
      skillRequirements: ['Critical Care Nursing'],
      compensationRate: 1.5,
      advanceNoticeDays: 60
    },
    {
      id: 5,
      name: 'Memorial Day',
      date: '2024-05-27',
      type: 'Public Holiday',
      description: 'National holiday - emergency services only',
      department: 'All Departments',
      status: 'Active',
      priority: 'High',
      createdAt: '2023-12-01',
      lastModified: '2023-12-15',
      createdBy: 'HR Manager',
      optaPlannerWeight: 75,
      affectsScheduling: true,
      mandatoryDayOff: false,
      reducedStaffing: true,
      minStaffingRequired: 3,
      maxStaffingAllowed: 8,
      skillRequirements: ['Emergency Medicine'],
      compensationRate: 2.0,
      advanceNoticeDays: 30
    },
    {
      id: 6,
      name: 'Independence Day',
      date: '2024-07-04',
      type: 'Public Holiday',
      description: 'National holiday - critical care services',
      department: 'All Departments',
      status: 'Active',
      priority: 'High',
      createdAt: '2023-12-01',
      lastModified: '2023-12-15',
      createdBy: 'HR Manager',
      optaPlannerWeight: 80,
      affectsScheduling: true,
      mandatoryDayOff: false,
      reducedStaffing: true,
      minStaffingRequired: 4,
      maxStaffingAllowed: 10,
      skillRequirements: ['Emergency Medicine', 'Critical Care'],
      compensationRate: 2.0,
      advanceNoticeDays: 30
    },
    {
      id: 7,
      name: 'Labor Day',
      date: '2024-09-02',
      type: 'Public Holiday',
      description: 'National holiday - essential services only',
      department: 'All Departments',
      status: 'Active',
      priority: 'Medium',
      createdAt: '2023-12-01',
      lastModified: '2023-12-10',
      createdBy: 'HR Manager',
      optaPlannerWeight: 65,
      affectsScheduling: true,
      mandatoryDayOff: false,
      reducedStaffing: true,
      minStaffingRequired: 3,
      maxStaffingAllowed: 8,
      skillRequirements: ['Patient Care'],
      compensationRate: 1.5,
      advanceNoticeDays: 21
    },
    {
      id: 8,
      name: 'Thanksgiving Day',
      date: '2024-11-28',
      type: 'Public Holiday',
      description: 'National holiday - emergency and critical care',
      department: 'All Departments',
      status: 'Active',
      priority: 'High',
      createdAt: '2023-12-01',
      lastModified: '2023-12-15',
      createdBy: 'HR Manager',
      optaPlannerWeight: 85,
      affectsScheduling: true,
      mandatoryDayOff: false,
      reducedStaffing: true,
      minStaffingRequired: 4,
      maxStaffingAllowed: 10,
      skillRequirements: ['Emergency Medicine', 'Critical Care'],
      compensationRate: 2.0,
      advanceNoticeDays: 30
    },
    {
      id: 9,
      name: 'Christmas Day',
      date: '2024-12-25',
      type: 'Public Holiday',
      description: 'National holiday - minimal emergency services',
      department: 'All Departments',
      status: 'Active',
      priority: 'Critical',
      createdAt: '2023-12-01',
      lastModified: '2023-12-15',
      createdBy: 'HR Manager',
      optaPlannerWeight: 95,
      affectsScheduling: true,
      mandatoryDayOff: false,
      reducedStaffing: true,
      minStaffingRequired: 2,
      maxStaffingAllowed: 6,
      skillRequirements: ['Emergency Medicine'],
      compensationRate: 2.5,
      advanceNoticeDays: 45
    },
    {
      id: 10,
      name: 'OR Annual Shutdown',
      date: '2024-08-15',
      type: 'Department Holiday',
      description: 'Annual operating room maintenance and cleaning',
      department: 'Operating Room',
      status: 'Active',
      priority: 'High',
      createdAt: '2023-09-15',
      lastModified: '2023-11-20',
      createdBy: 'Dr. Emily Chen',
      optaPlannerWeight: 75,
      affectsScheduling: true,
      mandatoryDayOff: true,
      reducedStaffing: true,
      minStaffingRequired: 0,
      maxStaffingAllowed: 2,
      skillRequirements: ['Maintenance'],
      compensationRate: 1.0,
      advanceNoticeDays: 90
    }
  ];

  const filteredHolidays = holidays.filter(holiday => {
    const matchesSearch = holiday.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         holiday.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || holiday.type === typeFilter;
    const matchesDepartment = departmentFilter === 'all' || holiday.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || holiday.status === statusFilter;
    const matchesYear = holiday.date.startsWith(yearFilter);
    
    return matchesSearch && matchesType && matchesDepartment && matchesStatus && matchesYear;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'Inactive': return 'bg-red-100 text-red-800 border-red-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Public Holiday': return <Flag className="w-4 h-4 text-red-600" />;
      case 'Medical Holiday': return <Shield className="w-4 h-4 text-blue-600" />;
      case 'Department Holiday': return <Users className="w-4 h-4 text-purple-600" />;
      case 'Personal Holiday': return <Gift className="w-4 h-4 text-green-600" />;
      case 'Training Day': return <BookOpen className="w-4 h-4 text-yellow-600" />;
      case 'Maintenance Day': return <Settings className="w-4 h-4 text-gray-600" />;
      default: return <Calendar className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const holidayDate = new Date(dateString);
    const diffTime = holidayDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const toggleHolidaySelection = (holidayId: number) => {
    setSelectedHolidays(prev => 
      prev.includes(holidayId) 
        ? prev.filter(id => id !== holidayId)
        : [...prev, holidayId]
    );
  };

  const getTotalHolidays = () => holidays.length;
  const getActiveHolidays = () => holidays.filter(h => h.status === 'Active').length;
  const getCriticalHolidays = () => holidays.filter(h => h.priority === 'Critical').length;
  const getUpcomingHolidays = () => holidays.filter(h => getDaysUntil(h.date) > 0 && getDaysUntil(h.date) <= 30).length;

  const departments = Array.from(new Set(holidays.map(h => h.department)));
  const types = Array.from(new Set(holidays.map(h => h.type)));
  const years = Array.from(new Set(holidays.map(h => h.date.substring(0, 4))));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Holiday Calendar</h1>
          <p className="text-gray-600 mt-1">Manage holidays and their impact on OptaPlanner scheduling</p>
        </div>
        <div className="flex space-x-3">
          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-colors ${
                viewMode === 'calendar' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Calendar View
            </button>
          </div>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button 
            onClick={() => setShowAddHoliday(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Holiday
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Holidays</p>
              <p className="text-2xl font-bold text-gray-900">{getTotalHolidays()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Holidays</p>
              <p className="text-2xl font-bold text-gray-900">{getActiveHolidays()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Critical Holidays</p>
              <p className="text-2xl font-bold text-gray-900">{getCriticalHolidays()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CalendarDays className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming (30 days)</p>
              <p className="text-2xl font-bold text-gray-900">{getUpcomingHolidays()}</p>
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
                  placeholder="Search holidays by name or description..."
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    {types.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
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
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Holidays Table */}
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
                        setSelectedHolidays(filteredHolidays.map(h => h.id));
                      } else {
                        setSelectedHolidays([]);
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Holiday
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority & Days Until
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
              {filteredHolidays.map((holiday) => {
                const daysUntil = getDaysUntil(holiday.date);
                return (
                  <tr key={holiday.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedHolidays.includes(holiday.id)}
                        onChange={() => toggleHolidaySelection(holiday.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{holiday.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{holiday.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(holiday.type)}
                        <span className="text-sm text-gray-900">{holiday.type}</span>
                      </div>
                      <div className="text-sm text-gray-500">{formatDate(holiday.date)}</div>
                      <div className={`text-xs ${
                        daysUntil < 0 ? 'text-red-600' : 
                        daysUntil <= 7 ? 'text-orange-600' : 
                        daysUntil <= 30 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {daysUntil < 0 ? `${Math.abs(daysUntil)} days ago` : 
                         daysUntil === 0 ? 'Today' : 
                         daysUntil === 1 ? 'Tomorrow' : 
                         `${daysUntil} days away`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{holiday.department}</div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(holiday.status)}`}>
                        {holiday.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(holiday.priority)}`}>
                          {holiday.priority}
                        </span>
                        <div className="text-xs text-gray-500">
                          Compensation: {holiday.compensationRate}x
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm space-y-1">
                        <div className="flex items-center">
                          <Zap className="w-3 h-3 text-yellow-600 mr-1" />
                          <span className="text-gray-900">Weight: {holiday.optaPlannerWeight}</span>
                        </div>
                        <div className="flex items-center">
                          {holiday.affectsScheduling ? (
                            <CheckCircle className="w-3 h-3 text-green-600 mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 text-gray-400 mr-1" />
                          )}
                          <span className="text-xs text-gray-600">Affects Scheduling</span>
                        </div>
                        <div className="flex items-center">
                          {holiday.mandatoryDayOff ? (
                            <CheckCircle className="w-3 h-3 text-red-600 mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 text-gray-400 mr-1" />
                          )}
                          <span className="text-xs text-gray-600">Mandatory Day Off</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => setEditingHoliday(holiday)}
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Holiday Modal */}
      {(showAddHoliday || editingHoliday) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingHoliday ? 'Edit Holiday' : 'Add New Holiday'}
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Holiday Name</label>
                  <input
                    type="text"
                    defaultValue={editingHoliday?.name}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter holiday name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    defaultValue={editingHoliday?.date}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    defaultValue={editingHoliday?.type}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Public Holiday">Public Holiday</option>
                    <option value="Medical Holiday">Medical Holiday</option>
                    <option value="Department Holiday">Department Holiday</option>
                    <option value="Personal Holiday">Personal Holiday</option>
                    <option value="Training Day">Training Day</option>
                    <option value="Maintenance Day">Maintenance Day</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    defaultValue={editingHoliday?.description}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Enter holiday description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    defaultValue={editingHoliday?.department}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="All Departments">All Departments</option>
                    <option value="Emergency Department">Emergency Department</option>
                    <option value="Intensive Care Unit">Intensive Care Unit</option>
                    <option value="Operating Room">Operating Room</option>
                    <option value="Laboratory Services">Laboratory Services</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      defaultValue={editingHoliday?.priority}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      defaultValue={editingHoliday?.status}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddHoliday(false);
                      setEditingHoliday(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingHoliday ? 'Update' : 'Create'} Holiday
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