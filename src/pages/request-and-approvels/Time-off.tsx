import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, User, CheckCircle, XCircle, Filter, List, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { employeeAvailabilityAPI } from '../../api/employeeAvailablie';
import type { EmployeeAvailability } from '../../api/employeeAvailablie';

export const TimeOff: React.FC = () => {
  // Sample data - in real app this would come from props or API
  const [requests, setRequests] = useState<EmployeeAvailability[]>([]);
  const [activeTab, setActiveTab] = useState('list');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [employeeNames, setEmployeeNames] = useState<Record<string, string>>({});
  const [loadingEmployees, setLoadingEmployees] = useState<Set<string>>(new Set());

  const handleApproval = async (requestId: string, approved: boolean) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, approved } : req
      )
    );
    await employeeAvailabilityAPI.approveAvailability(requestId, approved);
  };

  const fetchEmployeeName = useCallback(async (employeeId: string) => {
    if (employeeNames[employeeId] || loadingEmployees.has(employeeId)) {
      return;
    }

    setLoadingEmployees(prev => new Set([...prev, employeeId]));
    
    try {
      const userData = await employeeAvailabilityAPI.getAppUser(employeeId);
      setEmployeeNames(prev => ({
        ...prev,
        [employeeId]: userData.firstName + ' ' + userData.lastName
      }));
    } catch (error) {
      console.error(`Error fetching user data for ${employeeId}:`, error);
      setEmployeeNames(prev => ({
        ...prev,
        [employeeId]: employeeId // Fallback to UUID if fetch fails
      }));
    } finally {
      setLoadingEmployees(prev => {
        const newSet = new Set(prev);
        newSet.delete(employeeId);
        return newSet;
      });
    }
  }, [employeeNames, loadingEmployees]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const allRequests = await employeeAvailabilityAPI.getAvailabilityByOrganizationAndDepartment();
        const timeOffRequests = allRequests.filter(request => request.availabilityType === 'UNAVAILABLE');
        setRequests(timeOffRequests);
        
        // Fetch employee names for all unique employees
        const uniqueEmployeeIds = [...new Set(timeOffRequests.map(req => req.employee))];
        uniqueEmployeeIds.forEach(employeeId => {
          fetchEmployeeName(employeeId);
        });
      } catch (error) {
        console.error('Error fetching time-off requests:', error);
        setRequests([]);
      }
    };
    fetchRequests();
  }, [fetchEmployeeName]);


  const getEmployeeDisplayName = (employeeId: string) => {
    return employeeNames[employeeId] || employeeId;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusBadge = (approved: boolean | null) => {
    if (approved === null) {
      return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Pending</span>;
    }
    if (approved) {
      return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Approved</span>;
    }
    return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">Rejected</span>;
  };

  const filteredRequests = requests.filter(req => {
    if (filterStatus === 'pending') return req.approved === null;
    if (filterStatus === 'approved') return req.approved === true;
    if (filterStatus === 'rejected') return req.approved === false;
    return true;
  });

  const generateCalendarDays = () => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const days = [];

    // Add empty cells for days before the first day of the month
    const firstDayOfWeek = startOfMonth.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= endOfMonth.getDate(); day++) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    }

    return days;
  };

  const getRequestsForDate = (date: Date | null) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return requests.filter(req => req.availabilityDate.startsWith(dateStr));
  };

  const ListView = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">All Requests</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">
                      {getEmployeeDisplayName(request.employee)}
                    </span>
                    {loadingEmployees.has(request.employee) && (
                      <div className="ml-2 w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(request.availabilityDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-400 mr-1" />
                    {request.startTime} - {request.endTime}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {request.reason}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(request.approved)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {request.approved === null ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApproval(request.id, true)}
                        className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleApproval(request.id, false)}
                        className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
          <p className="text-gray-500">No time-off requests match your current filter.</p>
        </div>
      )}
    </div>
  );

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const CalendarView = () => {
    const days = generateCalendarDays();
    const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">{monthYear}</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const dayRequests = day ? getRequestsForDate(day) : [];
              const isToday = day && day.toDateString() === new Date().toDateString();
              
              return (
                <div 
                  key={index} 
                  className={`min-h-24 p-2 border border-gray-100 ${
                    day ? 'bg-white' : 'bg-gray-50'
                  } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
                >
                  {day && (
                    <>
                      <div className={`text-sm font-medium mb-1 ${
                        isToday ? 'text-blue-600' : 'text-gray-900'
                      }`}>
                        {day.getDate()}
                      </div>
                      {dayRequests.map((request) => (
                        <div 
                          key={request.id}
                          className={`text-xs p-1 rounded mb-1 truncate ${
                            request.approved === null 
                              ? 'bg-yellow-100 text-yellow-800'
                              : request.approved 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                          title={`${getEmployeeDisplayName(request.employee)} - ${request.reason}`}
                        >
                          {getEmployeeDisplayName(request.employee)}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Time-off Requests</h1>
          <p className="text-gray-600 mt-1">
            Manage and review employee time-off requests
          </p>
        </div>
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
              activeTab === 'list'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <List className="w-4 h-4 mr-2" />
            List View
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
              activeTab === 'calendar'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <CalendarDays className="w-4 h-4 mr-2" />
            Calendar View
          </button>
        </div>
      </div>
      
      {activeTab === 'list' ? <ListView /> : <CalendarView />}
    </div>
  );
};

export default TimeOff;