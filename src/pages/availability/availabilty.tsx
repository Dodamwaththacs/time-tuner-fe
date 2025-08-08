import React, { useState } from "react";
import { Calendar, Clock, Plus, X, AlertCircle } from "lucide-react";

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
  // Dummy data for demonstration
  const dummyUnavailabilities: Unavailability[] = [
    {
      id: 1,
      date: "2025-08-10",
      startTime: "09:00",
      endTime: "12:00",
      reason: "Doctor appointment",
      dateObj: new Date("2025-08-10"),
      approved: true
    },
    {
      id: 2,
      date: "2025-08-15",
      startTime: "14:00",
      endTime: "17:00",
      reason: "Personal leave",
      dateObj: new Date("2025-08-15"),
      approved: false
    },
    {
      id: 3,
      date: "2025-08-22",
      startTime: "10:30",
      endTime: "15:30",
      reason: "Family commitment",
      dateObj: new Date("2025-08-22"),
      approved: true
    },
    {
      id: 4,
      date: "2025-08-28",
      startTime: "08:00",
      endTime: "11:00",
      reason: "Medical checkup",
      dateObj: new Date("2025-08-28"),
      approved: false
    },
    {
      id: 5,
      date: "2025-09-05",
      startTime: "13:00",
      endTime: "16:00",
      reason: "Training session",
      dateObj: new Date("2025-09-05"),
      approved: true
    }
  ];

  const [unavailabilities, setUnavailabilities] = useState<Unavailability[]>(dummyUnavailabilities);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<UnavailabilityFormData>({
    date: "",
    startTime: "",
    endTime: "",
    reason: ""
  });
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (): void => {    
    if (!formData.date || !formData.startTime || !formData.endTime || !formData.reason) {
      alert("Please fill in all fields");
      return;
    }

    if (formData.startTime >= formData.endTime) {
      alert("End time must be after start time");
      return;
    }

    const newUnavailability: Unavailability = {
      id: Date.now(),
      ...formData,
      dateObj: new Date(formData.date)
    };

    setUnavailabilities(prev => [...prev, newUnavailability]);
    setFormData({ date: "", startTime: "", endTime: "", reason: "" });
    setShowForm(false);
  };

  const handleDelete = (id: number): void => {
    setUnavailabilities(prev => prev.filter(item => item.id !== id));
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
    const [year, month, date] = unavail.date.split("-").map(Number);
    const unavailDate = new Date(year, month - 1, date); // Local date, no timezone shift
    return unavailDate.toDateString() === targetDate.toDateString();
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
  const getApprovalIcon = (approved?: boolean): string => {
    if (approved === true) {
      return "✓";
    } else if (approved === false) {
      return "✗";
    } else {
      return "⏳";
    }
  };

  // Method to toggle approval status (for demo purposes)
  const toggleApprovalStatus = (id: number): void => {
    setUnavailabilities(prev => prev.map(unavail => {
      if (unavail.id === id) {
        const currentStatus = unavail.approved;
        let newStatus: boolean | undefined;
        
        if (currentStatus === undefined) {
          newStatus = true; // pending -> approved
        } else if (currentStatus === true) {
          newStatus = false; // approved -> rejected
        } else {
          newStatus = undefined; // rejected -> pending
        }
        
        return { ...unavail, approved: newStatus };
      }
      return unavail;
    }));
  };

  const monthNames: string[] = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Calendar className="text-blue-600" />
          Roster Management
        </h1>
        <p className="text-gray-600">Manage your unavailability schedule</p>
      </div>

      {/* Add Unavailability Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={16} />
          Add Unavailability
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-8 bg-gray-50 p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Add Unavailability</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                Reason
              </label>
              <input
                type="text"
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                placeholder="e.g., Medical appointment, Personal leave"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div className="md:col-span-2 flex gap-2">
              <button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Add Unavailability
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calendar */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ←
          </button>
          <h2 className="text-xl font-semibold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            →
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {dayNames.map(day => (
            <div key={day} className="p-3 text-center font-medium text-gray-600 bg-gray-50">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {getDaysInMonth(currentDate).map((day, index) => {
            const dayUnavailabilities = getUnavailabilitiesForDate(day);
            
            return (
              <div
                key={index}
                className={`min-h-24 p-2 border-b border-r border-gray-100 ${
                  day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                }`}
              >
                {day && (
                  <>
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      {day}
                    </div>
                    
                    {dayUnavailabilities.map(unavail => (
                      <div
                        key={unavail.id}
                        className={`text-xs p-1 rounded mb-1 relative group border ${getApprovalStyle(unavail.approved)}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 truncate">
                            <Clock size={10} />
                            <span className="truncate">
                              {formatTime(unavail.startTime)}-{formatTime(unavail.endTime)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span 
                              className="text-xs font-bold cursor-pointer" 
                              title={`Status: ${getApprovalStatusText(unavail.approved)}`}
                              onClick={() => toggleApprovalStatus(unavail.id)}
                            >
                              {getApprovalIcon(unavail.approved)}
                            </span>
                            <button
                              onClick={() => handleDelete(unavail.id)}
                              className="opacity-0 group-hover:opacity-100 hover:bg-red-200 rounded p-0.5 transition-all"
                              title="Delete unavailability"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        </div>
                        <div className="truncate font-medium" title={unavail.reason}>
                          {unavail.reason}
                        </div>
                        <div className="text-xs opacity-75 mt-1">
                          {getApprovalStatusText(unavail.approved)}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Status Legend:</h4>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-green-100 border border-green-200"></div>
              <span>✓ Approved</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-red-100 border border-red-200"></div>
              <span>✗ Rejected</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-200"></div>
              <span>⏳ Pending</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Click on status icons to toggle between states (for demo purposes)
          </p>
        </div>
      </div>

      {/* Summary */}
      {unavailabilities.length > 0 && (
        <div className="mt-8 bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <AlertCircle className="text-blue-600" />
            Upcoming Unavailabilities
          </h3>
          <div className="space-y-2">
            {unavailabilities
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 5)
              .map(unavail => (
                <div key={unavail.id} className={`flex items-center justify-between p-3 rounded border ${getApprovalStyle(unavail.approved)} bg-opacity-50`}>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-gray-900">
                        {new Date(unavail.date).toLocaleDateString()} - {unavail.reason}
                      </div>
                      <div className="flex items-center gap-2">
                        <span 
                          className={`px-2 py-1 text-xs font-semibold rounded-full cursor-pointer ${getApprovalStyle(unavail.approved)}`}
                          title={`Click to change status: ${getApprovalStatusText(unavail.approved)}`}
                          onClick={() => toggleApprovalStatus(unavail.id)}
                        >
                          {getApprovalIcon(unavail.approved)} {getApprovalStatusText(unavail.approved)}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {formatTime(unavail.startTime)} - {formatTime(unavail.endTime)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(unavail.id)}
                    className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors ml-2"
                    title="Delete unavailability"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}