import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, User, Users, Filter, Search, Eye, EyeOff, X, Grid, List, MapPin, Phone, Mail, Plus, Download, RefreshCw } from 'lucide-react';
import type { Schedule } from '../../api/shift';
import { scheduleAPI } from '../../api/shift';


export const CurrentSchedules: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month' | 'day'>('week');
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedShiftTypes, setSelectedShiftTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showEmptyDays, setShowEmptyDays] = useState(true);

useEffect(() => {
  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const data = await scheduleAPI.getAll();
      // Normalize shiftType, status, and date
      const normalized = data.map((s: any) => ({
        ...s,
        shiftType: s.shiftType === 'Night Shift' ? 'Night' : s.shiftType,
        status: s.status === 'ASSIGNED' ? 'confirmed' : s.status,
        date: s.date.split('T')[0], 
      }));


      console.log('Fetched schedules:', normalized);
      setSchedules(normalized);
      setFilteredSchedules(normalized);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  };
  fetchSchedules();
}, []);

  // Filter schedules when filters change
  useEffect(() => {
    let filtered = schedules;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(schedule =>
        schedule.staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.staff.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (schedule.notes && schedule.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Department filter
    if (selectedDepartments.length > 0) {
      filtered = filtered.filter(schedule =>
        selectedDepartments.includes(schedule.staff.department)
      );
    }

    // Shift type filter
    if (selectedShiftTypes.length > 0) {
      filtered = filtered.filter(schedule =>
        selectedShiftTypes.includes(schedule.shiftType)
      );
    }

    // Status filter
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(schedule =>
        selectedStatuses.includes(schedule.status)
      );
    }

    setFilteredSchedules(filtered);
  }, [schedules, searchTerm, selectedDepartments, selectedShiftTypes, selectedStatuses]);

  const getWeekDates = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      weekDates.push(currentDate);
    }
    return weekDates;
  };

  const getMonthDates = (date: Date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const startOfCalendar = new Date(startOfMonth);
    const startDay = startOfMonth.getDay();
    startOfCalendar.setDate(startOfMonth.getDate() - (startDay === 0 ? 6 : startDay - 1));
    
    const dates = [];
    const currentDate = new Date(startOfCalendar);
    
    for (let i = 0; i < 42; i++) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getSchedulesForDate = (date: string) => {
    return filteredSchedules.filter(schedule => schedule.date === date);
  };

  // Get unique values for filter options
  const getDepartments = () => {
    return [...new Set(schedules.map(s => s.staff.department))];
  };

  const getShiftTypes = () => {
    return [...new Set(schedules.map(s => s.shiftType))];
  };

  const getStatuses = () => {
    return [...new Set(schedules.map(s => s.status))];
  };

  // Filter handlers
  const handleDepartmentFilter = (department: string) => {
    setSelectedDepartments(prev =>
      prev.includes(department)
        ? prev.filter(d => d !== department)
        : [...prev, department]
    );
  };

  const handleShiftTypeFilter = (shiftType: string) => {
    setSelectedShiftTypes(prev =>
      prev.includes(shiftType)
        ? prev.filter(s => s !== shiftType)
        : [...prev, shiftType]
    );
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedDepartments([]);
    setSelectedShiftTypes([]);
    setSelectedStatuses([]);
  };

  const hasActiveFilters = searchTerm || selectedDepartments.length > 0 || selectedShiftTypes.length > 0 || selectedStatuses.length > 0;

  const getShiftTypeColor = (shiftType: string) => {
    const colors = {
      'Morning': 'bg-blue-100 text-blue-800 border-blue-200',
      'Evening': 'bg-orange-100 text-orange-800 border-orange-200',
      'Night': 'bg-purple-100 text-purple-800 border-purple-200',
      'On-call': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[shiftType as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'confirmed': 'bg-green-50 border-l-green-500 hover:bg-green-100',
      'tentative': 'bg-yellow-50 border-l-yellow-500 hover:bg-yellow-100',
      'cancelled': 'bg-red-50 border-l-red-500 hover:bg-red-100'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-50 border-l-gray-500 hover:bg-gray-100';
  };

  const navigate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    } else if (viewMode === 'month') {
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'day') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const data = await scheduleAPI.getAll();
      setSchedules(data);
      setFilteredSchedules(data);
    } catch (error) {
      console.error('Error refreshing schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderWeekView = () => {
    const weekDates = getWeekDates(currentDate);
    const weekStart = weekDates[0];
    const weekEnd = weekDates[6];

    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {weekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {weekEnd.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </h2>
        </div>

        <div className="grid grid-cols-7 gap-4">
          {weekDates.map((date, index) => {
            const dateStr = formatDate(date);
            const daySchedules = getSchedulesForDate(dateStr);
            const isToday = formatDate(new Date()) === dateStr;
            const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            
            if (!showEmptyDays && daySchedules.length === 0) {
              return null;
            }
            
            return (
              <div
                key={dateStr}
                className={`bg-white border rounded-xl p-4 min-h-[320px] transition-all duration-300 hover:shadow-lg ${
                  isToday ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md' : 'border-gray-200'
                } ${daySchedules.length === 0 ? 'opacity-75' : ''}`}
              >
                <div className="mb-4">
                  <div className={`text-sm font-medium ${isToday ? 'text-blue-700' : 'text-gray-500'}`}>
                    {dayNames[index]}
                  </div>
                  <div className={`text-xl font-bold ${isToday ? 'text-blue-900' : 'text-gray-900'}`}>
                    {date.getDate()}
                  </div>
                  {daySchedules.length > 0 && (
                    <div className="flex items-center text-xs text-gray-500 mt-2">
                      <Users className="h-3 w-3 mr-1" />
                      {daySchedules.length} schedule{daySchedules.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {daySchedules.length === 0 ? (
                    <div className="text-center text-xs text-gray-400 italic py-8">
                      <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      No schedules
                    </div>
                  ) : (
                    daySchedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className={`border-l-4 p-3 rounded-r-xl text-xs transition-all duration-300 hover:shadow-md cursor-pointer transform hover:scale-102 ${getStatusColor(schedule.status)}`}
                        onClick={() => setSelectedSchedule(schedule)}
                        title="Click for details"
                      >
                        <div className="font-semibold text-gray-900 mb-1 truncate">
                          {schedule.staff.name}
                        </div>
                        <div className="text-gray-600 mb-2 text-xs">
                          {schedule.staff.role} • {schedule.staff.department}
                        </div>
                        <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${getShiftTypeColor(schedule.shiftType)}`}>
                          {schedule.shiftType}
                        </div>
                        <div className="flex items-center text-gray-500 mb-1">
                          <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{schedule.startTime} - {schedule.endTime}</span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{schedule.location}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const monthDates = getMonthDates(currentDate);
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const dayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">{monthName}</h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 bg-gray-50">
            {dayHeaders.map(day => (
              <div key={day} className="p-4 text-center text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {monthDates.map((date, index) => {
              const dateStr = formatDate(date);
              const daySchedules = getSchedulesForDate(dateStr);
              const isToday = formatDate(new Date()) === dateStr;
              const isCurrentMonth = date.getMonth() === currentDate.getMonth();
              
              return (
                <div
                  key={dateStr}
                  className={`min-h-[120px] p-2 border-r border-b border-gray-200 transition-all duration-200 hover:bg-gray-50 ${
                    isToday ? 'bg-blue-50' : ''
                  } ${!isCurrentMonth ? 'bg-gray-50 opacity-50' : ''}`}
                >
                  <div className={`text-sm font-medium mb-2 ${
                    isToday ? 'text-blue-700' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {date.getDate()}
                  </div>
                  
                  <div className="space-y-1">
                    {daySchedules.slice(0, 3).map((schedule) => (
                      <div
                        key={schedule.id}
                        className={`text-xs p-1 rounded cursor-pointer transition-colors ${getShiftTypeColor(schedule.shiftType)} hover:opacity-75`}
                        onClick={() => setSelectedSchedule(schedule)}
                        title={`${schedule.staff.name} - ${schedule.startTime}`}
                      >
                        <div className="truncate font-medium">{schedule.staff.name}</div>
                        <div className="truncate">{schedule.startTime}</div>
                      </div>
                    ))}
                    {daySchedules.length > 3 && (
                      <div className="text-xs text-gray-500 font-medium">
                        +{daySchedules.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dateStr = formatDate(currentDate);
    const daySchedules = getSchedulesForDate(dateStr).sort((a, b) => a.startTime.localeCompare(b.startTime));
    const isToday = formatDate(new Date()) === dateStr;

    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {currentDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
            {isToday && <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Today</span>}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          {daySchedules.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No schedules for this day</h3>
              <p className="text-gray-500">There are no scheduled shifts or appointments.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {daySchedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className={`p-6 transition-all duration-200 hover:bg-gray-50 cursor-pointer ${getStatusColor(schedule.status).split(' ')[0]}`}
                  onClick={() => setSelectedSchedule(schedule)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{schedule.staff.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getShiftTypeColor(schedule.shiftType)}`}>
                          {schedule.shiftType}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          schedule.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          schedule.status === 'tentative' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {schedule.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          {schedule.staff.role} • {schedule.staff.department}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {schedule.startTime} - {schedule.endTime}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {schedule.location}
                        </div>
                      </div>
                      
                      {schedule.notes && (
                        <div className="mt-3 text-sm text-gray-600">
                          <strong>Notes:</strong> {schedule.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="grid grid-cols-7 gap-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Healthcare Schedule Calendar</h1>
            <p className="text-gray-600">Manage staff schedules and view department coverage at a glance.</p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <button
              onClick={refreshData}
              disabled={loading}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            <button className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Add Schedule
            </button>
            
            <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
        
        {/* Enhanced Search and Filter Controls */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search staff, role, department, location, or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 rounded-lg border flex items-center space-x-2 transition-all duration-200 ${
                  showFilters || hasActiveFilters
                    ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-sm'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 ml-1 animate-pulse">
                    {[selectedDepartments.length, selectedShiftTypes.length, selectedStatuses.length].filter(n => n > 0).length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setShowEmptyDays(!showEmptyDays)}
                className={`px-4 py-3 rounded-lg border flex items-center space-x-2 transition-all duration-200 ${
                  showEmptyDays
                    ? 'bg-green-50 border-green-300 text-green-700'
                    : 'bg-gray-50 border-gray-300 text-gray-700'
                }`}
              >
                {showEmptyDays ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                <span>{showEmptyDays ? 'Hide' : 'Show'} Empty</span>
              </button>
            </div>
          </div>

          {/* Enhanced Filter Panel */}
          {showFilters && (
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 space-y-6 border border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 text-lg">Advanced Filters</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Department Filter */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Departments</label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {getDepartments().map(department => (
                      <label key={department} className="flex items-center group cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedDepartments.includes(department)}
                          onChange={() => handleDepartmentFilter(department)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors"
                        />
                        <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{department}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Shift Type Filter */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Shift Types</label>
                  <div className="space-y-2">
                    {getShiftTypes().map(shiftType => (
                      <label key={shiftType} className="flex items-center group cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedShiftTypes.includes(shiftType)}
                          onChange={() => handleShiftTypeFilter(shiftType)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors"
                        />
                        <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{shiftType}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Status</label>
                  <div className="space-y-2">
                    {getStatuses().map(status => (
                      <label key={status} className="flex items-center group cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedStatuses.includes(status)}
                          onChange={() => handleStatusFilter(status)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors"
                        />
                        <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 transition-colors capitalize">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                  <Search className="h-3 w-3 mr-1" />
                  "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm('')}
                    className="ml-2 h-4 w-4 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {selectedDepartments.map(dept => (
                <span key={dept} className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                  {dept}
                  <button
                    onClick={() => handleDepartmentFilter(dept)}
                    className="ml-2 h-4 w-4 text-green-600 hover:text-green-800 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {selectedShiftTypes.map(shift => (
                <span key={shift} className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-orange-100 text-orange-800 border border-orange-200">
                  {shift}
                  <button
                    onClick={() => handleShiftTypeFilter(shift)}
                    className="ml-2 h-4 w-4 text-orange-600 hover:text-orange-800 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {selectedStatuses.map(status => (
                <span key={status} className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200">
                  {status}
                  <button
                    onClick={() => handleStatusFilter(status)}
                    className="ml-2 h-4 w-4 text-purple-600 hover:text-purple-800 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Enhanced Calendar Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('prev')}
              className="p-3 hover:bg-gray-100 rounded-xl transition-colors shadow-sm border border-gray-200"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            
            <button
              onClick={goToToday}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
            >
              Today
            </button>
            
            <button
              onClick={() => navigate('next')}
              className="p-3 hover:bg-gray-100 rounded-xl transition-colors shadow-sm border border-gray-200"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          
          <div className="flex items-center space-x-2 mt-4 lg:mt-0">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('day')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  viewMode === 'day' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Calendar className="h-4 w-4 mr-1 inline" />
                Day
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  viewMode === 'week' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="h-4 w-4 mr-1 inline" />
                Week
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  viewMode === 'month' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="h-4 w-4 mr-1 inline" />
                Month
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Views */}
        <div className="mb-8">
          {viewMode === 'week' && renderWeekView()}
          {viewMode === 'month' && renderMonthView()}
          {viewMode === 'day' && renderDayView()}
        </div>

        {/* Enhanced Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="text-3xl font-bold text-blue-600 mb-1">{filteredSchedules.length}</div>
            <div className="text-sm text-blue-700 font-medium">Total Schedules</div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {filteredSchedules.filter(s => s.status === 'confirmed').length}
            </div>
            <div className="text-sm text-green-700 font-medium">Confirmed</div>
          </div>
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
            <div className="text-3xl font-bold text-yellow-600 mb-1">
              {filteredSchedules.filter(s => s.status === 'tentative').length}
            </div>
            <div className="text-sm text-yellow-700 font-medium">Tentative</div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {[...new Set(filteredSchedules.map(s => s.staff.department))].length}
            </div>
            <div className="text-sm text-purple-700 font-medium">Departments</div>
          </div>
        </div>

        {/* Enhanced Legend */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Shift Types</h3>
              <div className="grid grid-cols-2 gap-3">
                {['Morning', 'Evening', 'Night', 'On-call'].map((type) => (
                  <div key={type} className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-3 ${getShiftTypeColor(type).split(' ')[0]}`}></div>
                    <span className="text-sm text-gray-700 font-medium">{type}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Status Types</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700 font-medium">Confirmed - Schedule is finalized</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700 font-medium">Tentative - Pending confirmation</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700 font-medium">Cancelled - Schedule cancelled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Schedule Detail Modal */}
      {selectedSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedSchedule.staff.name}</h2>
                  <p className="text-gray-600">{selectedSchedule.staff.role} • {selectedSchedule.staff.department}</p>
                </div>
                <button
                  onClick={() => setSelectedSchedule(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                      <div className="flex items-center text-gray-900">
                        <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                        {new Date(selectedSchedule.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="flex items-center text-gray-900 mt-2">
                        <Clock className="h-5 w-5 mr-2 text-gray-500" />
                        {selectedSchedule.startTime} - {selectedSchedule.endTime}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <div className="flex items-center text-gray-900">
                        <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                        {selectedSchedule.location}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Shift Type</label>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getShiftTypeColor(selectedSchedule.shiftType)}`}>
                        {selectedSchedule.shiftType}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${
                        selectedSchedule.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        selectedSchedule.status === 'tentative' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedSchedule.status}
                      </span>
                    </div>

                    {selectedSchedule.staff.phone && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <div className="flex items-center text-gray-900">
                          <Phone className="h-5 w-5 mr-2 text-gray-500" />
                          <a href={`tel:${selectedSchedule.staff.phone}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                            {selectedSchedule.staff.phone}
                          </a>
                        </div>
                      </div>
                    )}

                    {selectedSchedule.staff.email && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <div className="flex items-center text-gray-900">
                          <Mail className="h-5 w-5 mr-2 text-gray-500" />
                          <a href={`mailto:${selectedSchedule.staff.email}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                            {selectedSchedule.staff.email}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {selectedSchedule.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700">{selectedSchedule.notes}</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedSchedule(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                    Edit Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}