import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  Plus,
  Trash2,
  Building2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Copy,
  Eye,
  EyeOff,
  Star,
  Shield,
  Award,
  CheckCircle
} from "lucide-react";

export const EnhancedScheduleBuilder: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState("2024-03-04");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentView, setCurrentView] = useState("form"); // "form" or "calendar"
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 2, 1)); // March 2024
  const [editingShift, setEditingShift] = useState(null);
  const [showDetails, setShowDetails] = useState({});

  // Sample data based on the database example
  const departments = [
    { id: 1, name: "Emergency Room", location: "Building A - Floor 1", color: "bg-red-100 text-red-800" },
    { id: 2, name: "Intensive Care Unit", location: "Building A - Floor 3", color: "bg-purple-100 text-purple-800" },
    { id: 3, name: "General Surgery", location: "Building B - Floor 2", color: "bg-blue-100 text-blue-800" },
    { id: 4, name: "Pediatrics", location: "Building C - Floor 1", color: "bg-green-100 text-green-800" },
  ];

  const shiftTypes = [
    {
      id: 1,
      name: "Day Shift",
      startTime: "07:00",
      endTime: "19:00",
      duration: 12,
      color: "bg-yellow-200"
    },
    {
      id: 2,
      name: "Night Shift",
      startTime: "19:00",
      endTime: "07:00",
      duration: 12,
      color: "bg-blue-200"
    },
    {
      id: 3,
      name: "Morning Shift",
      startTime: "06:00",
      endTime: "14:00",
      duration: 8,
      color: "bg-orange-200"
    },
    {
      id: 4,
      name: "Evening Shift",
      startTime: "14:00",
      endTime: "22:00",
      duration: 8,
      color: "bg-indigo-200"
    },
  ];

  const roles = [
    { id: 1, name: "Registered Nurse", icon: "👩‍⚕️" },
    { id: 2, name: "Doctor", icon: "👨‍⚕️" },
    { id: 3, name: "Nursing Assistant", icon: "👩‍💼" },
    { id: 4, name: "Specialist", icon: "🩺" },
    { id: 5, name: "Charge Nurse", icon: "👩‍💼" },
  ];

  const skills = [
    { id: 1, name: "BLS Certification", level: "REQUIRED", icon: "🆘" },
    { id: 2, name: "ACLS Certification", level: "ADVANCED", icon: "❤️" },
    { id: 3, name: "Pediatric Care", level: "SPECIALIZED", icon: "🧸" },
    { id: 4, name: "Critical Care", level: "ADVANCED", icon: "🏥" },
    { id: 5, name: "Surgical Assistance", level: "SPECIALIZED", icon: "🔬" },
    { id: 6, name: "Emergency Response", level: "REQUIRED", icon: "🚨" },
    { id: 7, name: "Patient Education", level: "BASIC", icon: "📚" },
    { id: 8, name: "Medication Management", level: "ADVANCED", icon: "💊" },
  ];

  const [shifts, setShifts] = useState([
    {
      id: 1,
      date: "2024-03-04",
      shiftTypeId: 1,
      departmentId: 1,
      requiredRoleId: 1,
      requiredEmployees: 2,
      priority: 1,
      notes: "Monday ER day shift - expect high volume",
      minExperience: 2,
      maxConsecutiveDays: 3,
      allowOvertime: true,
      breakDuration: 30,
      skillRequirements: [
        { skillId: 1, count: 2, mandatory: true },
        { skillId: 2, count: 1, mandatory: false }
      ],
      costCenter: "CC-001",
      status: "draft"
    },
    {
      id: 2,
      date: "2024-03-04",
      shiftTypeId: 2,
      departmentId: 1,
      requiredRoleId: 1,
      requiredEmployees: 2,
      priority: 1,
      notes: "Monday ER night shift",
      minExperience: 1,
      maxConsecutiveDays: 2,
      allowOvertime: false,
      breakDuration: 45,
      skillRequirements: [
        { skillId: 1, count: 2, mandatory: true }
      ],
      costCenter: "CC-001",
      status: "approved"
    },
    {
      id: 3,
      date: "2024-03-05",
      shiftTypeId: 1,
      departmentId: 2,
      requiredRoleId: 1,
      requiredEmployees: 3,
      priority: 2,
      notes: "Tuesday ICU day shift - critical patients",
      minExperience: 3,
      maxConsecutiveDays: 2,
      allowOvertime: true,
      breakDuration: 30,
      skillRequirements: [
        { skillId: 4, count: 2, mandatory: true },
        { skillId: 2, count: 1, mandatory: true }
      ],
      costCenter: "CC-002",
      status: "published"
    },
  ]);

  const [newShift, setNewShift] = useState({
    date: selectedDate,
    shiftTypeId: 1,
    departmentId: 1,
    requiredRoleId: 1,
    requiredEmployees: 1,
    priority: 1,
    notes: "",
    minExperience: 0,
    maxConsecutiveDays: 5,
    allowOvertime: false,
    breakDuration: 30,
    skillRequirements: [],
    costCenter: "",
    status: "draft"
  });

  const addShift = () => {
    const shift = {
      ...newShift,
      id: Date.now(), // Better ID generation
    };
    setShifts([...shifts, shift]);
    setNewShift({
      date: selectedDate,
      shiftTypeId: 1,
      departmentId: 1,
      requiredRoleId: 1,
      requiredEmployees: 1,
      priority: 1,
      notes: "",
      minExperience: 0,
      maxConsecutiveDays: 5,
      allowOvertime: false,
      breakDuration: 30,
      skillRequirements: [],
      costCenter: "",
      status: "draft"
    });
    setShowAdvanced(false);
  };

  const duplicateShift = (shift) => {
    const newShiftData = {
      ...shift,
      id: Date.now(),
      date: selectedDate,
      status: "draft"
    };
    setShifts([...shifts, newShiftData]);
  };

  const removeShift = (id) => {
    if (window.confirm("Are you sure you want to delete this shift?")) {
      setShifts(shifts.filter((shift) => shift.id !== id));
    }
  };

  const toggleShiftDetails = (shiftId) => {
    setShowDetails(prev => ({
      ...prev,
      [shiftId]: !prev[shiftId]
    }));
  };

  const getDepartmentName = (id) =>
    departments.find((d) => d.id === id)?.name || "";
  const getDepartmentColor = (id) =>
    departments.find((d) => d.id === id)?.color || "bg-gray-100 text-gray-800";
  const getShiftTypeName = (id) =>
    shiftTypes.find((s) => s.id === id)?.name || "";
  const getShiftTypeColor = (id) =>
    shiftTypes.find((s) => s.id === id)?.color || "bg-gray-200";
  const getRoleName = (id) =>
    roles.find((r) => r.id === id)?.name || "";
  const getRoleIcon = (id) =>
    roles.find((r) => r.id === id)?.icon || "👤";
  const getSkillName = (id) =>
    skills.find((s) => s.id === id)?.name || "";
  const getSkillIcon = (id) =>
    skills.find((s) => s.id === id)?.icon || "🔧";

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 1: return "bg-red-100 text-red-800 border-red-200";
      case 2: return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-green-100 text-green-800 border-green-200";
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 1: return "High";
      case 2: return "Medium";
      default: return "Low";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "draft": return "bg-gray-100 text-gray-800";
      case "approved": return "bg-blue-100 text-blue-800";
      case "published": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Calendar functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getShiftsForDate = (dateStr) => {
    return shifts.filter(shift => shift.date === dateStr);
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1));
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 border border-gray-200"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dayShifts = getShiftsForDate(dateStr);
      const isSelected = dateStr === selectedDate;

      days.push(
        <div
          key={day}
          className={`h-32 border border-gray-200 p-1 overflow-hidden cursor-pointer hover:bg-gray-50 ${
            isSelected ? 'bg-blue-50 border-blue-300' : ''
          }`}
          onClick={() => setSelectedDate(dateStr)}
        >
          <div className={`text-sm font-medium mb-1 ${isSelected ? 'text-blue-600' : 'text-gray-900'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayShifts.slice(0, 3).map((shift, index) => (
              <div
                key={shift.id}
                className={`text-xs p-1 rounded truncate ${getShiftTypeColor(shift.shiftTypeId)} ${getDepartmentColor(shift.departmentId)}`}
                title={`${getShiftTypeName(shift.shiftTypeId)} - ${getDepartmentName(shift.departmentId)}`}
              >
                <div className="flex items-center">
                  <span className="mr-1">{getRoleIcon(shift.requiredRoleId)}</span>
                  <span className="truncate">{getShiftTypeName(shift.shiftTypeId)}</span>
                </div>
              </div>
            ))}
            {dayShifts.length > 3 && (
              <div className="text-xs text-gray-500 font-medium">
                +{dayShifts.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
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
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 border-b border-gray-200">
              {day}
            </div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Schedule Builder
        </h1>
        <p className="text-gray-600 mb-4">
          Create shifts and define skill requirements for the roster period
        </p>
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setCurrentView("form")}
            className={`px-4 py-2 rounded-md font-medium ${
              currentView === "form"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Shift Builder
          </button>
          <button
            onClick={() => setCurrentView("calendar")}
            className={`px-4 py-2 rounded-md font-medium ${
              currentView === "calendar"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Calendar View
          </button>
        </div>
      </div>

      {currentView === "calendar" ? (
        <div className="space-y-6">
          {renderCalendar()}
          
          {/* Selected date details */}
          {selectedDate && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">
                Shifts for {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              {getShiftsForDate(selectedDate).length === 0 ? (
                <p className="text-gray-500">No shifts scheduled for this date.</p>
              ) : (
                <div className="space-y-3">
                  {getShiftsForDate(selectedDate).map((shift) => (
                    <div key={shift.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl">{getRoleIcon(shift.requiredRoleId)}</span>
                        <div>
                          <div className="font-medium">{getShiftTypeName(shift.shiftTypeId)}</div>
                          <div className="text-sm text-gray-500">
                            {getDepartmentName(shift.departmentId)} • {shift.requiredEmployees} staff needed
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(shift.priority)}`}>
                          {getPriorityText(shift.priority)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => duplicateShift(shift)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Duplicate shift"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeShift(shift.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete shift"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Create New Shift
            </h2>
            
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date
                </label>
                <input
                  type="date"
                  value={newShift.date}
                  onChange={(e) =>
                    setNewShift({ ...newShift, date: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Shift Type
                </label>
                <select
                  value={newShift.shiftTypeId}
                  onChange={(e) =>
                    setNewShift({
                      ...newShift,
                      shiftTypeId: parseInt(e.target.value),
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {shiftTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name} ({type.startTime}-{type.endTime}) - {type.duration}hrs
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building2 className="w-4 h-4 inline mr-1" />
                  Department
                </label>
                <select
                  value={newShift.departmentId}
                  onChange={(e) =>
                    setNewShift({
                      ...newShift,
                      departmentId: parseInt(e.target.value),
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name} - {dept.location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Required Role
                </label>
                <select
                  value={newShift.requiredRoleId}
                  onChange={(e) =>
                    setNewShift({
                      ...newShift,
                      requiredRoleId: parseInt(e.target.value),
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.icon} {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Staff Count
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={newShift.requiredEmployees}
                  onChange={(e) =>
                    setNewShift({
                      ...newShift,
                      requiredEmployees: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Star className="w-4 h-4 inline mr-1" />
                  Priority Level
                </label>
                <select
                  value={newShift.priority}
                  onChange={(e) =>
                    setNewShift({
                      ...newShift,
                      priority: parseInt(e.target.value),
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={1}>🔴 High Priority</option>
                  <option value={2}>🟡 Medium Priority</option>
                  <option value={3}>🟢 Low Priority</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes & Instructions
              </label>
              <textarea
                value={newShift.notes}
                onChange={(e) =>
                  setNewShift({ ...newShift, notes: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Additional notes, special requirements, or instructions for this shift..."
              />
            </div>

            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="mb-4 text-sm text-blue-600 hover:underline flex items-center"
            >
              {showAdvanced ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
              {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
            </button>

            {showAdvanced && (
              <div className="space-y-6 border-t pt-6">
                {/* Experience and Constraints */}
                {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Award className="w-4 h-4 inline mr-1" />
                      Min. Experience (years)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={newShift.minExperience}
                      onChange={(e) =>
                        setNewShift({ ...newShift, minExperience: parseInt(e.target.value) || 0 })
                      }
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Consecutive Days
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="7"
                      value={newShift.maxConsecutiveDays}
                      onChange={(e) =>
                        setNewShift({ ...newShift, maxConsecutiveDays: parseInt(e.target.value) || 1 })
                      }
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Break Duration (minutes)
                    </label>
                    <select
                      value={newShift.breakDuration}
                      onChange={(e) =>
                        setNewShift({ ...newShift, breakDuration: parseInt(e.target.value) })
                      }
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={45}>45 minutes</option>
                      <option value={60}>60 minutes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cost Center
                    </label>
                    <input
                      type="text"
                      value={newShift.costCenter}
                      onChange={(e) =>
                        setNewShift({ ...newShift, costCenter: e.target.value })
                      }
                      placeholder="e.g., CC-001"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div> */}

                {/* Toggles */}
                {/* <div className="flex flex-wrap gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newShift.allowOvertime}
                      onChange={(e) =>
                        setNewShift({ ...newShift, allowOvertime: e.target.checked })
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Allow Overtime</span>
                  </label>
                </div> */}

                {/* Required Skills */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Required Skills & Certifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {skills.map((skill) => {
                      const current = newShift.skillRequirements.find(
                        (s) => s.skillId === skill.id
                      );
                      return (
                        <div
                          key={skill.id}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <label className="flex items-center text-sm text-gray-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!!current}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewShift({
                                    ...newShift,
                                    skillRequirements: [
                                      ...newShift.skillRequirements,
                                      { skillId: skill.id, count: 1, mandatory: true },
                                    ],
                                  });
                                } else {
                                  setNewShift({
                                    ...newShift,
                                    skillRequirements:
                                      newShift.skillRequirements.filter(
                                        (s) => s.skillId !== skill.id
                                      ),
                                  });
                                }
                              }}
                              className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-lg mr-2">{skill.icon}</span>
                            <div>
                              <div className="font-medium">{skill.name}</div>
                              <div className="text-xs text-gray-500">{skill.level}</div>
                            </div>
                          </label>

                          {current && (
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                min={1}
                                max={10}
                                value={current.count}
                                onChange={(e) => {
                                  const count = parseInt(e.target.value) || 1;
                                  setNewShift({
                                    ...newShift,
                                    skillRequirements: newShift.skillRequirements.map(
                                      (s) =>
                                        s.skillId === skill.id ? { ...s, count } : s
                                    ),
                                  });
                                }}
                                className="w-16 p-1 border border-gray-300 rounded-md text-sm"
                                title="Required count"
                              />
                              <label className="flex items-center text-xs cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={current.mandatory}
                                  onChange={(e) => {
                                    setNewShift({
                                      ...newShift,
                                      skillRequirements: newShift.skillRequirements.map(
                                        (s) =>
                                          s.skillId === skill.id 
                                            ? { ...s, mandatory: e.target.checked } 
                                            : s
                                      ),
                                    });
                                  }}
                                  className="mr-1"
                                />
                                Mandatory
                              </label>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-6 border-t">
              <div className="text-sm text-gray-500">
                {newShift.skillRequirements.length > 0 && (
                  <span className="flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {newShift.skillRequirements.length} skill requirement(s) defined
                  </span>
                )}
              </div>
              <button
                onClick={addShift}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Shift
              </button>
            </div>
          </div>

          {/* Created Shifts List */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Created Shifts</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {shifts.length} shift{shifts.length !== 1 ? 's' : ''} defined
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-sm text-gray-500">Status Legend:</div>
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Draft</span>
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Approved</span>
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Published</span>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {shifts.map((shift) => (
                <div key={shift.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <span className="text-2xl">{getRoleIcon(shift.requiredRoleId)}</span>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(
                              shift.priority
                            )}`}
                          >
                            {getPriorityText(shift.priority)} Priority
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(shift.status)}`}>
                            {shift.status.charAt(0).toUpperCase() + shift.status.slice(1)}
                          </span>
                          <span className="text-sm text-gray-500">
                            Shift #{shift.id}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-3">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="font-medium">
                            {new Date(shift.date).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{getShiftTypeName(shift.shiftTypeId)}</span>
                        </div>
                        <div className="flex items-center">
                          <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{getDepartmentName(shift.departmentId)}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2 text-gray-400" />
                          <span>
                            {shift.requiredEmployees} {getRoleName(shift.requiredRoleId)}
                            {shift.requiredEmployees > 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>

                      {/* Advanced details */}
                      {showDetails[shift.id] && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <span className="font-medium text-gray-700">Min Experience:</span>
                              <span className="ml-2">{shift.minExperience} years</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Max Consecutive:</span>
                              <span className="ml-2">{shift.maxConsecutiveDays} days</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Break Duration:</span>
                              <span className="ml-2">{shift.breakDuration} min</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Overtime:</span>
                              <span className="ml-2">{shift.allowOvertime ? '✅ Allowed' : '❌ Not allowed'}</span>
                            </div>
                            {shift.costCenter && (
                              <div>
                                <span className="font-medium text-gray-700">Cost Center:</span>
                                <span className="ml-2">{shift.costCenter}</span>
                              </div>
                            )}
                          </div>
                          
                          {shift.skillRequirements && shift.skillRequirements.length > 0 && (
                            <div>
                              <span className="font-medium text-gray-700 block mb-2">Required Skills:</span>
                              <div className="flex flex-wrap gap-2">
                                {shift.skillRequirements.map((req, index) => (
                                  <span
                                    key={index}
                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                      req.mandatory ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                    }`}
                                  >
                                    <span className="mr-1">{getSkillIcon(req.skillId)}</span>
                                    {getSkillName(req.skillId)} ({req.count})
                                    {req.mandatory && <span className="ml-1">*</span>}
                                  </span>
                                ))}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">* Mandatory requirement</div>
                            </div>
                          )}
                        </div>
                      )}

                      {shift.notes && (
                        <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-200 rounded-r">
                          <p className="text-sm text-blue-800">
                            <AlertCircle className="w-4 h-4 inline mr-1" />
                            {shift.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="ml-4 flex items-center space-x-2">
                      <button
                        onClick={() => toggleShiftDetails(shift.id)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title={showDetails[shift.id] ? "Hide details" : "Show details"}
                      >
                        {showDetails[shift.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => duplicateShift(shift)}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                        title="Duplicate shift"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeShift(shift.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete shift"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {shifts.length === 0 && (
                <div className="p-12 text-center">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No shifts created yet</h3>
                  <p className="text-gray-500">Create your first shift using the form above.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Save Actions */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          Total shifts: {shifts.length} • 
          High priority: {shifts.filter(s => s.priority === 1).length} • 
          Draft: {shifts.filter(s => s.status === 'draft').length}
        </div>
        <div className="flex space-x-4">
          <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
            Save as Draft
          </button>
          <button className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            Publish Schedule
          </button>
        </div>
      </div>
    </div>
  );
}