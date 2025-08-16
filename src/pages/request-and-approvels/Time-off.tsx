import React, { useState } from 'react';
import { Calendar, Clock, User, CheckCircle, XCircle, Filter, List, CalendarDays } from 'lucide-react';

export const TimeOff: React.FC = () => {
  // Sample data - in real app this would come from props or API
  const [requests, setRequests] = useState([
    {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      Date: "2025-08-16T07:51:32.023Z",
      startTime: "18:30",
      endTime: "18:30",
      availabilityType: "UNAVAILABLE",
      reason: "Family emergency",
      approved: undefined,
      createdAt: "2025-08-16T07:51:32.023Z",
      employee: "John Doe"
    },
    {
      id: "4fb85f64-5717-4562-b3fc-2c963f66afa7",
      Date: "2025-08-18T07:51:32.023Z",
      startTime: "09:00",
      endTime: "17:00",
      availabilityType: "UNAVAILABLE",
      reason: "Medical appointment",
      approved: true,
      createdAt: "2025-08-15T07:51:32.023Z",
      employee: "Sarah Smith"
    },
    {
      id: "5gc85f64-5717-4562-b3fc-2c963f66afa8",
      Date: "2025-08-20T07:51:32.023Z",
      startTime: "08:00",
      endTime: "16:00",
      availabilityType: "UNAVAILABLE",
      reason: "Personal leave",
      approved: false,
      createdAt: "2025-08-14T07:51:32.023Z",
      employee: "Mike Johnson"
    },
    {
      id: "6hd85f64-5717-4562-b3fc-2c963f66afa9",
      Date: "2025-08-22T07:51:32.023Z",
      startTime: "10:00",
      endTime: "15:00",
      availabilityType: "UNAVAILABLE",
      reason: "Vacation",
      approved: undefined,
      createdAt: "2025-08-13T07:51:32.023Z",
      employee: "Emma Wilson"
    }
  ]);

  const [activeTab, setActiveTab] = useState('list');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleApproval = (requestId: string, approved: boolean) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, approved } : req
      )
    );
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

  const getStatusBadge = (approved?: boolean) => {
    if (approved === undefined) {
      return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Pending</span>;
    }
    if (approved) {
      return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Approved</span>;
    }
    return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">Rejected</span>;
  };

  const filteredRequests = requests.filter(req => {
    if (filterStatus === 'pending') return req.approved === undefined;
    if (filterStatus === 'approved') return req.approved === true;
    if (filterStatus === 'rejected') return req.approved === false;
    return true;
  });

  const generateCalendarDays = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const days = [];

    // Add empty cells for days before the first day of the month
    const firstDayOfWeek = startOfMonth.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= endOfMonth.getDate(); day++) {
      days.push(new Date(today.getFullYear(), today.getMonth(), day));
    }

    return days;
  };

  const getRequestsForDate = (date: Date | null) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return requests.filter(req => req.Date.startsWith(dateStr));
  };

  const ListView = () => (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Time-off Requests</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        <table className="w-full">
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
                    <span className="text-sm font-medium text-gray-900">{request.employee}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(request.Date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-400 mr-1" />
                    {formatTime(request.startTime)} - {formatTime(request.endTime)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {request.reason}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(request.approved)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {request.approved === undefined ? (
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

  const CalendarView = () => {
    const days = generateCalendarDays();
    const monthYear = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{monthYear}</h2>
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
                            request.approved === undefined 
                              ? 'bg-yellow-100 text-yellow-800'
                              : request.approved 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                          title={`${request.employee} - ${request.reason}`}
                        >
                          {request.employee}
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
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Roster Management - Time-off Requests</h1>
        
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
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