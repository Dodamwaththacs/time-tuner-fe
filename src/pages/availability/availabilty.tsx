import React, { useState, useEffect } from "react";
import { getOrganizationId, getEmployeeId,getDepartmentId,getAuthHeaders } from '../../utils/authUtils';

import { 
  Calendar, 
  Clock, 
  Plus, 
  X, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight,
  Check,
  XCircle,
  Timer,
  CalendarDays,
  User
} from "lucide-react";
import { availabilityAPI } from "../../api/availability";


// TypeScript interfaces
interface UnavailabilityFormData {
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
  approved?: boolean;
}

interface Unavailability extends UnavailabilityFormData {
  id: number;
  dateObj: Date;
}

export const Availability: React.FC = () => {
  const [unavailabilities, setUnavailabilities] = useState<Unavailability[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'warning', message: string} | null>(null);
  const [formData, setFormData] = useState<UnavailabilityFormData>({
    date: "",
    startTime: "",
    endTime: "",
    reason: ""
  });
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setIsLoading(true);
        const availability = await availabilityAPI.getAvailabilityByUserId();
        const transformedData = availability
          .filter(item => item.availabilityType === 'UNAVAILABLE')
          .map(item => ({
            id: item.id || Date.now(),
            date: item.availabilityDate,
            startTime: item.startTime || '',
            endTime: item.endTime || '',
            reason: item.reason,
            approved: item.approved,
            dateObj: new Date(item.availabilityDate)
          }));
          console.log(transformedData);
        setUnavailabilities(transformedData);
      } catch (error) {
        console.error('Error fetching availability:', error);
        setNotification({
          type: 'error',
          message: 'Failed to load your availability data. Please try refreshing the page.'
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchAvailability();
  }, []);

  // Auto-hide notifications after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (): Promise<void> => {    
    if (!formData.date || !formData.startTime || !formData.endTime || !formData.reason) {
      setNotification({
        type: 'warning',
        message: 'Please fill in all required fields'
      });
      return;
    }

    // Validate that the date is not in the past or today
    const selectedDate = new Date(formData.date);
    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
    tomorrow.setDate(tomorrow.getDate() + 1); // Set to tomorrow
    
    if (selectedDate < tomorrow) {
      setNotification({
        type: 'warning',
        message: 'Cannot request time off for past dates or today. Please select tomorrow or a future date.'
      });
      return;
    }

    if (formData.startTime >= formData.endTime) {
      setNotification({
        type: 'warning',
        message: 'End time must be after start time'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create availability object for API
      // Convert date to LocalDateTime format (add T00:00:00 for midnight)
      const dateTimeString = `${formData.date}T00:00:00`;
      
      const availabilityData = {
        availabilityDate: dateTimeString,
        startTime: formData.startTime,
        endTime: formData.endTime,
        availabilityType: 'UNAVAILABLE',
        reason: formData.reason,
        createdAt: null,
        employee: getEmployeeId() 
      };

      // Call the API to create availability
      const createdAvailability = await availabilityAPI.createAvailability(availabilityData);

      // Create local unavailability object for UI
      const newUnavailability: Unavailability = {
        id: createdAvailability.id || 0,
        date: createdAvailability.availabilityDate,
        startTime: createdAvailability.startTime,
        endTime: createdAvailability.endTime || '',
        reason: createdAvailability.reason,
        dateObj: new Date(createdAvailability.availabilityDate)
      };

      setUnavailabilities(prev => [...prev, newUnavailability]);
      setFormData({ date: "", startTime: "", endTime: "", reason: "" });
      setShowForm(false);
      
      setNotification({
        type: 'success',
        message: 'Time off request submitted successfully! It will be reviewed by your manager.'
      });
    } catch (error) {
      console.error('Error creating unavailability:', error);
      setNotification({
        type: 'error',
        message: 'Failed to submit your request. Please check your connection and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDaysInMonth = (date: Date): (number | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getUnavailabilitiesForDate = (day: number | null): Unavailability[] => {
    if (!day) return [];

    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

    return unavailabilities.filter(unavail => {
      try {
        // Handle LocalDateTime format (2025-08-18T00:00:00) and other formats
        let unavailDate: Date;
        
        if (unavail.date.includes('T')) {
          // LocalDateTime format from backend
          unavailDate = new Date(unavail.date);
        } else {
          // Legacy YYYY-MM-DD format
          const [year, month, date] = unavail.date.split("-").map(Number);
          unavailDate = new Date(year, month - 1, date);
        }
        
        return unavailDate.toDateString() === targetDate.toDateString();
      } catch (error) {
        console.error('Error parsing date:', unavail.date, error);
        return false;
      }
    });
  };


  const navigateMonth = (direction: number): void => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour12 = parseInt(hours) % 12 || 12;
    const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Method to get styling based on approval status
  const getApprovalStyle = (approved?: boolean): string => {
    if (approved === true) {
      return "bg-green-100 text-green-800 border-green-200";
    } else if (approved === false) {
      return "bg-red-100 text-red-800 border-red-200";
    } else {
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  // Method to get approval status text
  const getApprovalStatusText = (approved?: boolean): string => {
    if (approved === true) {
      return "Approved";
    } else if (approved === false) {
      return "Rejected";
    } else {
      return "Pending";
    }
  };

  // Method to get approval icon
  const getApprovalIcon = (approved?: boolean): React.ReactNode => {
    if (approved === true) {
      return <Check size={14} className="text-green-600" />;
    } else if (approved === false) {
      return <XCircle size={14} className="text-red-600" />;
    } else {
      return <Timer size={14} className="text-yellow-600" />;
    }
  };

  const monthNames: string[] = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <div className={`p-4 rounded-xl shadow-lg border-l-4 ${
            notification.type === 'success' ? 'bg-green-50 border-green-400 text-green-800' :
            notification.type === 'error' ? 'bg-red-50 border-red-400 text-red-800' :
            'bg-yellow-50 border-yellow-400 text-yellow-800'
          } transition-all duration-300 transform animate-in slide-in-from-right`}>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {notification.type === 'success' && <Check size={20} className="text-green-600" />}
                {notification.type === 'error' && <XCircle size={20} className="text-red-600" />}
                {notification.type === 'warning' && <AlertCircle size={20} className="text-yellow-600" />}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{notification.message}</p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6">
        {/* Enhanced Header */}
        <div className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <CalendarDays className="text-blue-600" size={32} />
                </div>
                Availability Management
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                Request time off and manage your unavailable periods
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>Personal Schedule</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>Real-time Updates</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-xl text-white">
                <div className="text-2xl font-bold">{unavailabilities.length}</div>
                <div className="text-blue-100">Active Requests</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setShowForm(!showForm)}
            className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            aria-label={showForm ? "Close time off request form" : "Open time off request form"}
            aria-expanded={showForm}
          >
            <div className="p-1 bg-white bg-opacity-20 rounded-lg group-hover:bg-opacity-30 transition-all">
              <Plus size={18} />
            </div>
            <span className="font-semibold">Request Time Off</span>
          </button>
          
          {/* <div className="flex gap-3">
            <button className="px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700">
              <Calendar size={16} />
              <span>Export Calendar</span>
            </button>
            <button className="px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700">
              <Clock size={16} />
              <span>View History</span>
            </button>
          </div> */}
        </div>

        {/* Enhanced Form */}
        {showForm && (
          <div className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Plus size={20} className="text-blue-600" />
                    </div>
                    Request Time Off
                  </h2>
                  <p className="text-gray-600 mt-1">Fill in the details for your unavailability request</p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={isSubmitting}
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="date" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Calendar size={16} className="text-blue-500" />
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="reason" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <AlertCircle size={16} className="text-blue-500" />
                    Reason
                  </label>
                  <input
                    type="text"
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    placeholder="e.g., Medical appointment, Personal leave, Family event"
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-400"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="startTime" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Clock size={16} className="text-blue-500" />
                    Start Time
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="endTime" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Clock size={16} className="text-blue-500" />
                    End Time
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    required
                  />
                </div>
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`flex-1 sm:flex-none px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 ${
                    isSubmitting 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-400 border-t-transparent"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check size={18} />
                      Submit Request
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  disabled={isSubmitting}
                  className={`px-6 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                    isSubmitting 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                  }`}
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Calendar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Calendar Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-3 hover:bg-white hover:shadow-md rounded-xl transition-all duration-200 group"
                aria-label="Go to previous month"
              >
                <ChevronLeft size={20} className="text-gray-600 group-hover:text-blue-600" />
              </button>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3" role="heading" aria-level={2}>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar size={24} className="text-blue-600" />
                  </div>
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <p className="text-gray-600 mt-1">Click on any day to view details</p>
              </div>
              <button
                onClick={() => navigateMonth(1)}
                className="p-3 hover:bg-white hover:shadow-md rounded-xl transition-all duration-200 group"
                aria-label="Go to next month"
              >
                <ChevronRight size={20} className="text-gray-600 group-hover:text-blue-600" />
              </button>
            </div>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50" role="row">
            {dayNames.map(day => (
              <div key={day} className="p-4 text-center font-semibold text-gray-700 border-r border-gray-100 last:border-r-0" role="columnheader">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7" role="grid" aria-label="Calendar grid showing availability requests">
            {getDaysInMonth(currentDate).map((day, index) => {
              const dayUnavailabilities = getUnavailabilitiesForDate(day);
              const today = new Date();
              const isToday = day && 
                day === today.getDate() && 
                currentDate.getMonth() === today.getMonth() && 
                currentDate.getFullYear() === today.getFullYear();
              
              return (
                <div
                  key={index}
                  role="gridcell"
                  tabIndex={day ? 0 : -1}
                  aria-label={day ? `${monthNames[currentDate.getMonth()]} ${day}, ${currentDate.getFullYear()}${dayUnavailabilities.length > 0 ? `. ${dayUnavailabilities.length} unavailability request${dayUnavailabilities.length > 1 ? 's' : ''}` : ''}${isToday ? '. Today' : ''}` : 'Empty cell'}
                  className={`min-h-32 p-3 border-b border-r border-gray-100 last:border-r-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
                    day 
                      ? `bg-white hover:bg-blue-50 cursor-pointer ${isToday ? 'bg-blue-50 ring-2 ring-blue-200' : ''}` 
                      : 'bg-gray-25'
                  }`}
                >
                  {day && (
                    <>
                      <div className={`text-sm font-semibold mb-2 flex items-center justify-between ${
                        isToday ? 'text-blue-600' : 'text-gray-900'
                      }`}>
                        <span className={isToday ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs' : ''}>
                          {day}
                        </span>
                        {dayUnavailabilities.length > 0 && (
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        {dayUnavailabilities.slice(0, 2).map(unavail => (
                          <div
                            key={unavail.id}
                            className={`text-xs p-2 rounded-lg relative group border-l-3 shadow-sm ${getApprovalStyle(unavail.approved)}`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1">
                                <Clock size={12} className="text-gray-600" />
                                <span className="font-medium text-xs">
                                  {formatTime(unavail.startTime)}
                                </span>
                              </div>
                              <div className="flex items-center">
                                {getApprovalIcon(unavail.approved)}
                              </div>
                            </div>
                            <div className="truncate font-semibold text-gray-800" title={unavail.reason}>
                              {unavail.reason}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {getApprovalStatusText(unavail.approved)}
                            </div>
                          </div>
                        ))}
                        
                        {dayUnavailabilities.length > 2 && (
                          <div className="text-xs text-center py-1 text-blue-600 font-medium">
                            +{dayUnavailabilities.length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Enhanced Legend */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-t border-gray-100">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <AlertCircle size={20} className="text-blue-600" />
              Status Legend
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-green-200">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Check size={16} className="text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-green-800">Approved</div>
                  <div className="text-xs text-green-600">Request confirmed</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-red-200">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle size={16} className="text-red-600" />
                </div>
                <div>
                  <div className="font-semibold text-red-800">Rejected</div>
                  <div className="text-xs text-red-600">Request denied</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-yellow-200">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Timer size={16} className="text-yellow-600" />
                </div>
                <div>
                  <div className="font-semibold text-yellow-800">Pending</div>
                  <div className="text-xs text-yellow-600">Awaiting approval</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Summary */}
        {unavailabilities.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="text-blue-600" size={24} />
                </div>
                Recent Requests
              </h3>
              <p className="text-gray-600 mt-1">Your latest unavailability requests</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {unavailabilities
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 5)
                  .map(unavail => (
                    <div key={unavail.id} className={`p-5 rounded-xl border-l-4 transition-all duration-200 hover:shadow-md ${getApprovalStyle(unavail.approved)} bg-opacity-30`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                              <Calendar size={16} className="text-gray-600" />
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 text-lg">
                                {new Date(unavail.date).toLocaleDateString('en-US', { 
                                  weekday: 'short', 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </div>
                              <div className="text-gray-600 font-medium">
                                {unavail.reason}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock size={14} />
                              <span className="font-medium">
                                {formatTime(unavail.startTime)} - {formatTime(unavail.endTime)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className={`px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 ${getApprovalStyle(unavail.approved)}`}>
                            {getApprovalIcon(unavail.approved)}
                            {getApprovalStatusText(unavail.approved)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              
              {unavailabilities.length > 5 && (
                <div className="mt-6 text-center">
                  <button className="px-6 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold rounded-xl transition-colors">
                    View All Requests ({unavailabilities.length})
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}