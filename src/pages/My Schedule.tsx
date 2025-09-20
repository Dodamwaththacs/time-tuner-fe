import React, { useState, useEffect } from "react";
import {
    Calendar,
    Clock,
    ChevronLeft,
    ChevronRight,
    MapPin,
    AlertCircle,
    Phone,
    Mail,
    Building2,
    CalendarDays,
} from "lucide-react";

// import PersonalShift interface from API module
import type { PersonalShift } from "../api/rosterAssigns";
import { personalScheduleAPI } from "../api/rosterAssigns";



export interface TimeOffRequest {
    id: string;
    startDate: Date;
    endDate: Date;
    type: "vacation" | "sick" | "personal" | "emergency";
    status: "pending" | "approved" | "denied";
    reason?: string;
    approvedBy?: string;
    requestedDate: Date;
}

export interface PersonalAvailability {
    id: string;
    date: Date;
    available: boolean;
    startTime?: Date;
    endTime?: Date;
    notes?: string;
}

export interface EmployeeProfile {
    id: string;
    employeeCode: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    department: string;
    role: string;
    hireDate: Date;
    contractType: string;
    workingHours: {
        totalHours: number;
    };
}


// Dummy Data Generator for Personal Schedule
const generatePersonalScheduleData = () => {
    // Current employee profile
    const employee: EmployeeProfile = {
        id: "emp001",
        employeeCode: "E001",
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@hospital.com",
        phone: "+1-555-0101",
        department: "Emergency Department",
        role: "Registered Nurse",
        hireDate: new Date(2022, 3, 15),
        contractType: "Full-time",
        workingHours: {
            totalHours: 80, // bi-weekly

        },
    };

    const shiftTypes = [
        { name: "Day Shift", start: "07:00", end: "15:00", color: "bg-blue-100 text-blue-800" },
        { name: "Evening Shift", start: "15:00", end: "23:00", color: "bg-orange-100 text-orange-800" },
       
    ];

    const shifts: PersonalShift[] = [];
    const timeOffRequests: TimeOffRequest[] = [];
    const availability: PersonalAvailability[] = [];
    const today = new Date();

    

    // Generate time off requests
    const timeOffTypes: ("vacation" | "sick" | "personal" | "emergency")[] = ["vacation", "sick", "personal", "emergency"];
    const statuses: ("pending" | "approved" | "denied")[] = ["pending", "approved", "denied"];

    for (let i = 0; i < 5; i++) {
        const startDate = new Date(today);
        startDate.setDate(today.getDate() + Math.floor(Math.random() * 60) + 10);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + Math.floor(Math.random() * 5) + 1);

        timeOffRequests.push({
            id: `timeoff_${i}`,
            startDate,
            endDate,
            type: timeOffTypes[Math.floor(Math.random() * timeOffTypes.length)],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            reason: "Personal time needed",
            requestedDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        });
    }

    return { employee, shifts, timeOffRequests, availability };
};

export const MySchedule: React.FC = () => {
    const [employee, setEmployee] = useState<EmployeeProfile | null>(null);
    const [shifts, setShifts] = useState<PersonalShift[]>([]);
    const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<"calendar" | "upcoming">("calendar");
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>("");


    
    useEffect(() => {
        // Simulate API call for personal schedule
        const loadPersonalSchedule = async () => {
            const data = generatePersonalScheduleData();

            setEmployee(data.employee);
            const shiftsData = await personalScheduleAPI.getShiftsByEmployee();

            setShifts(shiftsData);
            console.log(shiftsData);
            setTimeOffRequests(data.timeOffRequests);
        };

        loadPersonalSchedule();
    }, []);

    // Calendar navigation
    const navigateMonth = (direction: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + direction);
        setCurrentDate(newDate);
    };

    // Get shifts for specific date
    const getShiftsForDate = (date: Date) => {
        return shifts.filter(shift => {
            const shiftDate = new Date(shift.date);
            return (
                shiftDate.getDate() === date.getDate() &&
                shiftDate.getMonth() === date.getMonth() &&
                shiftDate.getFullYear() === date.getFullYear()
            );
        });
    };

    // Get time off for specific date
    const getTimeOffForDate = (date: Date) => {
        return timeOffRequests.filter(request => {
            const startDate = new Date(request.startDate);
            const endDate = new Date(request.endDate);
            return date >= startDate && date <= endDate && request.status === 'approved';
        });
    };



    // Get upcoming shifts (next 7 days)
    const getUpcomingShifts = () => {
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        return shifts.filter(shift => {
            const shiftDate = new Date(shift.date);
            return shiftDate >= today && shiftDate <= nextWeek;
        }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    };

    // Get calendar days
    const getCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const days = [];
        const currentDay = new Date(startDate);

        for (let i = 0; i < 42; i++) {
            days.push(new Date(currentDay));
            currentDay.setDate(currentDay.getDate() + 1);
        }

        return days;
    };

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case "scheduled": return "bg-blue-100 text-blue-800 border-blue-200";
            case "confirmed": return "bg-green-100 text-green-800 border-green-200";
            case "completed": return "bg-gray-100 text-gray-800 border-gray-200";
            case "cancelled": return "bg-red-100 text-red-800 border-red-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    // Get time off status color
    const getTimeOffStatusColor = (status: string) => {
        switch (status) {
            case "approved": return "bg-green-100 text-green-800";
            case "pending": return "bg-yellow-100 text-yellow-800";
            case "denied": return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    // Calculate total hours for a period
    const getTotalHours = (startDate: Date, endDate: Date) => {
        return shifts.filter(shift => {
            const shiftDate = new Date(shift.date);
            return shiftDate >= startDate && shiftDate <= endDate && shift.status !== 'cancelled';
        }).reduce((total, shift) => {
            const hours = (shift.endTime.getTime() - shift.startTime.getTime()) / (1000 * 60 * 60);
            return total + hours;
        }, 0);
    };

    // Render calendar view
    const renderCalendarView = () => {
        const days = getCalendarDays();
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        return (
            <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => navigateMonth(-1)}
                            className="p-2 hover:bg-gray-100 rounded-md"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => navigateMonth(1)}
                            className="p-2 hover:bg-gray-100 rounded-md"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-0">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div
                            key={day}
                            className="p-2 text-center text-sm font-medium text-gray-500 border-b border-gray-200"
                        >
                            {day}
                        </div>
                    ))}

                    {days.map((day, index) => {
                        const dayShifts = getShiftsForDate(day);
                        const dayTimeOff = getTimeOffForDate(day);
                        const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                        const isToday = day.toDateString() === new Date().toDateString();
                        const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();

                        return (
                            <div
                                key={index}
                                className={`min-h-24 p-2 border border-gray-100 cursor-pointer hover:bg-gray-50 ${!isCurrentMonth ? "bg-gray-50 text-gray-400" : ""
                                    } ${isToday ? "bg-blue-50 border-blue-200" : ""} ${isSelected ? "ring-2 ring-blue-500" : ""
                                    }`}
                                onClick={() => setSelectedDate(day)}
                            >
                                <div className={`text-sm font-medium mb-1 ${isToday ? "text-blue-600" : ""
                                    }`}>
                                    {day.getDate()}
                                </div>
                                <div className="space-y-1">
                                    {dayTimeOff.map((timeOff) => (
                                        <div
                                            key={timeOff.id}
                                            className={`text-xs p-1 rounded truncate ${getTimeOffStatusColor(timeOff.status)
                                                }`}
                                            title={`${timeOff.type.toUpperCase()} - ${timeOff.status}`}
                                        >
                                            🏖️ {timeOff.type}
                                        </div>
                                    ))}
                                    {dayShifts.map((shift) => (
                                        <div
                                            key={shift.id}
                                            className={`text-xs p-1 rounded truncate ${shift.shiftType.color
                                                }`}
                                            title={`${shift.shiftType.name} - ${shift.status}`}
                                        >
                                            {shift.shiftType.name.split(' ')[0]}
                                            {shift.startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                                        </div>
                                    ))}
                                    {(dayShifts.length + dayTimeOff.length) > 2 && (
                                        <div className="text-xs text-gray-500 font-medium">
                                            +{(dayShifts.length + dayTimeOff.length) - 2} more
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Render selected date details
    const renderSelectedDateDetails = () => {
        if (!selectedDate) return null;

        const dayShifts = getShiftsForDate(selectedDate);
        const dayTimeOff = getTimeOffForDate(selectedDate);

        return (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <CalendarDays className="w-5 h-5 mr-2" />
                    My Schedule for {selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </h3>

                {dayShifts.length === 0 && dayTimeOff.length === 0 ? (
                    <p className="text-gray-500">No shifts or time off scheduled for this date.</p>
                ) : (
                    <div className="space-y-4">
                        {/* Time Off */}
                        {dayTimeOff.map((timeOff) => (
                            <div key={timeOff.id} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium text-orange-900 flex items-center">
                                        🏖️ <span className="ml-2">{timeOff.type.charAt(0).toUpperCase() + timeOff.type.slice(1)} Day</span>
                                    </h4>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTimeOffStatusColor(timeOff.status)
                                        }`}>
                                        {timeOff.status.charAt(0).toUpperCase() + timeOff.status.slice(1)}
                                    </span>
                                </div>
                                {timeOff.reason && (
                                    <p className="text-sm text-orange-700">{timeOff.reason}</p>
                                )}
                            </div>
                        ))}

                        {/* Shifts */}
                        {dayShifts.map((shift) => (
                            <div key={shift.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h4 className="font-medium text-gray-900">
                                            {shift.shiftType.name}
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            {shift.department.name} • {shift.role}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(shift.status)
                                        }`}>
                                        {shift.status.charAt(0).toUpperCase() + shift.status.slice(1)}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-3">
                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                        <span>
                                            {shift.startTime.toLocaleTimeString("en-US", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })} - {shift.endTime.toLocaleTimeString("en-US", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                                        <span>{shift.department.location}</span>
                                    </div>

                                </div>

                                {shift.notes && (
                                    <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-200 rounded-r">
                                        <p className="text-sm text-blue-800">
                                            <AlertCircle className="w-4 h-4 inline mr-1" />
                                            {shift.notes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // Render upcoming shifts view
    const renderUpcomingView = () => {
        const upcomingShifts = getUpcomingShifts();
        const filteredShifts = statusFilter ? upcomingShifts.filter(shift => shift.status === statusFilter) : upcomingShifts;

        return (
            <div className="space-y-4">
                {/* Employee Profile Card */}
                {employee && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                                {employee.firstName[0]}{employee.lastName[0]}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {employee.firstName} {employee.lastName}
                                </h2>
                                <p className="text-gray-500">
                                    {employee.employeeCode} • {employee.role} • {employee.department}
                                </p>
                                <div className="flex items-center mt-1 space-x-4 text-sm text-gray-500">
                                    <span className="flex items-center">
                                        <Mail className="w-3 h-3 mr-1" />
                                        {employee.email}
                                    </span>
                                    <span className="flex items-center">
                                        <Phone className="w-3 h-3 mr-1" />
                                        {employee.phone}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <p className="text-2xl font-semibold text-blue-600">{employee.workingHours.totalHours}</p>
                                <p className="text-sm text-blue-600">Total Hours</p>
                            </div>

                        </div>
                    </div>
                )}

                {/* Upcoming Shifts */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Upcoming Shifts</h3>
                    {filteredShifts.length === 0 ? (
                        <p className="text-gray-500">No upcoming shifts scheduled.</p>
                    ) : (
                        <div className="space-y-4">
                            {filteredShifts.map((shift) => (
                                <div key={shift.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h4 className="font-medium text-gray-900">
                                                {shift.shiftType.name}
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                {shift.date.toLocaleDateString("en-US", {
                                                    weekday: "long",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(shift.status)
                                            }`}>
                                            {shift.status.charAt(0).toUpperCase() + shift.status.slice(1)}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                                        <div className="flex items-center">
                                            <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                            <span>
                                                {shift.startTime.toLocaleTimeString("en-US", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })} - {shift.endTime.toLocaleTimeString("en-US", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                                            <span>{shift.department.name}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                            <span>{shift.department.location}</span>
                                        </div>

                                    </div>

                                    {shift.notes && (
                                        <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-200 rounded-r">
                                            <p className="text-sm text-blue-800">
                                                <AlertCircle className="w-4 h-4 inline mr-1" />
                                                {shift.notes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Time Off Requests */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Time Off Requests</h3>
                    {timeOffRequests.length === 0 ? (
                        <p className="text-gray-500">No time off requests.</p>
                    ) : (
                        <div className="space-y-3">
                            {timeOffRequests.slice(0, 3).map((request) => (
                                <div key={request.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {request.type.charAt(0).toUpperCase() + request.type.slice(1)}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {request.startDate.toLocaleDateString()} - {request.endDate.toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTimeOffStatusColor(request.status)
                                        }`}>
                                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (!employee) {
        return (
            <div className="p-6 space-y-6 max-w-7xl mx-auto">
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
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    My Schedule
                </h1>
                <p className="text-gray-600">
                    View your upcoming shifts, time off, and personal schedule
                </p>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    {/* View Toggle */}
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setViewMode("calendar")}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${viewMode === "calendar"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            <Calendar className="w-4 h-4 inline mr-2" />
                            Calendar View
                        </button>
                        <button
                            onClick={() => setViewMode("upcoming")}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${viewMode === "upcoming"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            <Clock className="w-4 h-4 inline mr-2" />
                            Upcoming Shifts
                        </button>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex space-x-2">
                        <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm">
                            Request Time Off
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                            Swap Shifts
                        </button>
                    </div>

                    {/* Status Filter */}
                    {viewMode === "upcoming" && (
                        <div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Statuses</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center">
                        <Calendar className="w-8 h-8 text-blue-600" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">This Week</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {(() => {
                                    const today = new Date();
                                    const weekStart = new Date(today);
                                    weekStart.setDate(today.getDate() - today.getDay());
                                    const weekEnd = new Date(weekStart);
                                    weekEnd.setDate(weekStart.getDate() + 6);
                                    return Math.round(getTotalHours(weekStart, weekEnd));
                                })()}h
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center">
                        <Clock className="w-8 h-8 text-green-600" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Upcoming Shifts</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {getUpcomingShifts().length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <Timer className="w-8 h-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Overtime</p>
              <p className="text-2xl font-semibold text-gray-900">
                {employee?.workingHours.overtimeHours || 0}h
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <Target className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">PTO Balance</p>
              <p className="text-2xl font-semibold text-gray-900">
                {employee?.workingHours.remainingPTO || 0}
              </p>
            </div>
          </div>
        </div> */}
            </div>

            {/* Main Content */}
            {viewMode === "calendar" ? (
                <div className="space-y-6">
                    {renderCalendarView()}
                    {selectedDate && renderSelectedDateDetails()}
                </div>
            ) : (
                renderUpcomingView()
            )}
        </div>
    );
};

export default MySchedule;