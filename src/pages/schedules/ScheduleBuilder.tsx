import React, { useState, useEffect } from "react";
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
  CheckCircle,
} from "lucide-react";

export interface Shift {
  id: string; // Use string for UUIDs
  shiftDate: string;
  requiredEmployees: number;
  priorityLevel: number;
  notes: string;
  createdAt?: string;
  shiftType: string; // Make sure this matches what you're using
  department: string;
  requiredRole: string; // Make sure this matches what you're using
  isOptimized?: boolean;
  skillRequirements: {
    id: string;
    requiredCount: number;
    mandatory: boolean;
    skill: string;
    shift: string;
    role: string;
  }[];
  status: "draft" | "published";

}


import { departmentAPI } from "../../api/department";
import { shiftAPI } from "../../api/shiftType";
import { roleAPI } from "../../api/role";
import { skillAPI } from "../../api/skill";
import { createShiftAPI } from "../../api/createShift";
import type { Skill } from "../../api/skill";
import type { Role } from "../../api/role";
import type { ShiftType } from "../../api/shiftType";
import type { Department } from "../../api/department";

export const ScheduleBuilder: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState("2024-03-04");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentView, setCurrentView] = useState("form"); // "form" or "calendar"
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 2, 1)); // March 2024
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});
  const [departments, setDepartments] = useState<Department[]>([]);
  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      const response = await departmentAPI.getAllByOrganization();
      console.log("Fetched departments:", response);
      setDepartments(response);
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchShifts = async () => {
      const response = await createShiftAPI.getShifts();
      console.log("Fetched shifts:", response);
      setShifts(response);
    };

    fetchShifts();
  }, []);

  useEffect(() => {
    const fetchShiftTypes = async () => {
      const response = await shiftAPI.getAllByOrganization();
      console.log("Fetched shift types:", response);
      setShiftTypes(response);
    };

    fetchShiftTypes();
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      const response = await roleAPI.getAllRoles();
      console.log("Fetched roles:", response);
      setRoles(response);
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchSkills = async () => {
      const response = await skillAPI.getAllSkills();
      console.log("Fetched skills:", response);
      setSkills(response);
    };

    fetchSkills();
  }, []);

  const submitShift = async () => {
    try {
       await createShiftAPI.createShift(shifts);
      const updatedShifts = await createShiftAPI.getShifts(); // Refresh shifts after creation
      setShifts(updatedShifts);
    } catch (error) {
      console.error("Error creating shift:", error);
    }
  };

  const departmentColors = [
    "bg-red-100 text-red-800",
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-yellow-100 text-yellow-800",
    "bg-purple-100 text-purple-800",
    "bg-pink-100 text-pink-800",
    "bg-indigo-100 text-indigo-800",
    "bg-teal-100 text-teal-800",
    "bg-orange-100 text-orange-800",
    "bg-cyan-100 text-cyan-800",
    "bg-lime-100 text-lime-800",
    "bg-emerald-100 text-emerald-800",
  ];

  const shiftTypeColors = [
    "bg-yellow-200",
    "bg-blue-200",
    "bg-orange-200",
    "bg-indigo-200",
    "bg-green-200",
    "bg-purple-200",
    "bg-pink-200",
    "bg-teal-200",
    "bg-red-200",
    "bg-cyan-200",
    "bg-lime-200",
    "bg-emerald-200",
  ];

  const getDepartmentColorByIndex = (
    departmentId: string,
    departments: any[]
  ) => {
    const index = departments.findIndex((dept) => dept.id === departmentId);
    return departmentColors[index % departmentColors.length];
  };

  const getShiftTypeColorByIndex = (shiftTypeId: string, shiftTypes: any[]) => {
    const index = shiftTypes.findIndex((type) => type.id === shiftTypeId);
    return shiftTypeColors[index % shiftTypeColors.length];
  };

  // Dynamic icon assignment by skill level
  const getSkillIconByLevel = (
    skillLevel: string,
    skillName: string
  ): string => {
    const skillLevelIcons = {
      REQUIRED: ["🆘", "🚨", "⚡", "🔴", "📋"],
      ADVANCED: ["❤️", "🩺", "💊", "🔬", "⚕️"],
      SPECIALIZED: ["🧸", "🔬", "🧬", "🎯", "🏆"],
      BASIC: ["📚", "✏️", "📖", "💡", "📝"],
    };

    const icons = skillLevelIcons[
      skillLevel as keyof typeof skillLevelIcons
    ] || ["🔧"];

    // Use skill name to generate consistent index
    let hash = 0;
    for (let i = 0; i < skillName.length; i++) {
      const char = skillName.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }

    return icons[Math.abs(hash) % icons.length];
  };


  const [newShift, setNewShift] = useState<Omit<Shift, "id">>({
    shiftDate: selectedDate,
    shiftType: "123e4567-e89b-12d3-a456-426655440001",
    department: "123e4567-e89b-12d3-a456-426655440001",
    requiredRole: "123e4567-e89b-12d3-a456-426655440001",
    requiredEmployees: 1,
    priorityLevel: 1,
    notes: "",
    skillRequirements: [],
    status: "draft",
  });

  const addShift = () => {
    const shift: Shift = {
      ...newShift,
      id: generateUniqueId(), // Generate a unique ID for the shift
    };

    // Update shifts state
    const updatedShifts = [...shifts, shift];
    setShifts(updatedShifts);

    // Reset form
    setNewShift({
      shiftDate: selectedDate,
      shiftType: "123e4567-e89b-12d3-a456-426655440001",
      department: "123e4567-e89b-12d3-a456-426655440001",
      requiredRole: "123e4567-e89b-12d3-a456-426655440001", // Keep as string
      requiredEmployees: 1,
      priorityLevel: 1,
      notes: "",
      skillRequirements: [],
      status: "draft",
    });

    setShowAdvanced(false);

    // Log the updated shifts immediately
    console.log("Shift added. New total:", updatedShifts.length);
  };

  const duplicateShift = (shift: Shift) => {
    const newShiftData: Shift = {
      ...shift,
      id: generateUniqueId(),
      shiftDate: selectedDate,
      status: "draft",
      notes: shift.notes,
    };
    setShifts([...shifts, newShiftData]);
  };

  const removeShift = (shift: Shift) => {
    if (window.confirm("Are you sure you want to delete this shift?")) {

      if (shift.status ==="published") {
        // If the shift is published, we need to delete it from the server
        createShiftAPI.deleteShift(shift.id)
          .then(() => {
            // Remove the shift from the state
            setShifts(shifts.filter((s) => s.id !== shift.id));
          })
          .catch((error) => {
            console.error("Failed to delete shift:", error);
          });
      } else {
        // If the shift is not published, we can remove it directly
        setShifts(shifts.filter((s) => s.id !== shift.id));
      }
    }
  };

  const toggleShiftDetails = (shiftId: string) => {
    setShowDetails((prev) => ({
      ...prev,
      [shiftId]: !prev[shiftId],
    }));
  };

  const getDepartmentName = (id: string) =>
    departments.find((d) => d.id === id)?.departmentName || "";
  const getDepartmentColor = (id: string) =>
    getDepartmentColorByIndex(id, departments);
  const getShiftTypeName = (id: string) =>
    shiftTypes.find((s) => s.id === id)?.shiftName || "";

  const getRoleName = (id: string) =>
    roles.find((r) => r.id === id)?.roleName || "";
  const getSkillName = (id: string) =>
    skills.find((s) => s.id === id)?.skillName || "";
  const getSkillIcon = (id: string) => {
    const skill = skills.find((s) => s.id === id);
    return skill
      ? getSkillIconByLevel(skill.skillLevel, skill.skillName)
      : "🔧";
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return "bg-red-100 text-red-800 border-red-200";
      case 2:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-green-100 text-green-800 border-green-200";
    }
  };

  const getPriorityText = (priority: number) => {
    switch (priority) {
      case 1:
        return "High";
      case 2:
        return "Medium";
      default:
        return "Low";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "published":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Calendar functions
  const getDaysInMonth = (date: Date) => {


    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    console.log("Days in month:", daysInMonth);
    return daysInMonth;
  };

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    console.log("First day of month:", firstDay);
    return firstDay;
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
  };

  const getShiftsForDate = (dateStr: string) => {
  const targetDate = new Date(dateStr);
  const shiftsForDate = shifts.filter((shift) => {
    const shiftDate = new Date(shift.shiftDate);
    return (
      shiftDate.getFullYear() === targetDate.getFullYear() &&
      shiftDate.getMonth() === targetDate.getMonth() &&
      shiftDate.getDate() === targetDate.getDate()
    );
  });
  console.log("Shifts for date:", dateStr, shiftsForDate);
  return shiftsForDate;
};

  const navigateMonth = (direction: number) => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + direction,
        1
      )
    );
  };

  const generateUniqueId = (): string => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };


  useEffect(() => {
  console.log("Shifts state changed:", shifts);
}, [shifts]);

useEffect(() => {
  console.log("New shift state changed:", newShift);
}, [newShift]);

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-32 border border-gray-200"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      const dayShifts = getShiftsForDate(dateStr);
      const isSelected = dateStr === selectedDate;

      days.push(
        <div
          key={day}
          className={`h-32 border border-gray-200 p-1 overflow-hidden cursor-pointer hover:bg-gray-50 ${
            isSelected ? "bg-blue-50 border-blue-300" : ""
          }`}
          onClick={() => setSelectedDate(dateStr)}
        >
          <div
            className={`text-sm font-medium mb-1 ${
              isSelected ? "text-blue-600" : "text-gray-900"
            }`}
          >
            {day}
          </div>
          <div className="space-y-1">
            {dayShifts.slice(0, 3).map((shift) => (
              <div
                key={shift.id}
                className={`text-xs p-1 rounded truncate ${getShiftTypeColorByIndex(
                  shift.shiftType,
                  shiftTypes
                )} ${getDepartmentColor(shift.department)}`}
                title={`${getShiftTypeName(
                  shift.shiftType.toString()
                )} - ${getDepartmentName(shift.department)}`}
              >
                <div className="flex items-center">
                  <span className="truncate">
                    {getShiftTypeName(shift.shiftType.toString())}
                  </span>
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
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="p-2 text-center text-sm font-medium text-gray-500 border-b border-gray-200"
            >
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
                Shifts for{" "}
                {new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
              {getShiftsForDate(selectedDate).length === 0 ? (
                <p className="text-gray-500">
                  No shifts scheduled for this date.
                </p>
              ) : (
                <div className="space-y-3">
                  {getShiftsForDate(selectedDate).map((shift) => (
                    <div
                      key={shift.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div>
                          <div className="font-medium">
                            {getShiftTypeName(shift.shiftType.toString())}
                          </div>
                          <div className="text-sm text-gray-500">
                            {getDepartmentName(shift.department)} •{" "}
                            {shift.requiredEmployees} staff needed
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                            shift.priorityLevel
                          )}`}
                        >
                          {getPriorityText(shift.priorityLevel)}
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
                          onClick={() => removeShift(shift)}
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
                  value={newShift.shiftDate}
                  onChange={(e) =>
                    setNewShift({ ...newShift, shiftDate: e.target.value })
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
                  value={newShift.shiftType}
                  onChange={(e) =>
                    setNewShift({
                      ...newShift,
                      shiftType: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {shiftTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.shiftName} ({type.startTime}-{type.endTime}) -{" "}
                      {type.durationHours}hrs
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
                  value={newShift.department}
                  onChange={(e) =>
                    setNewShift({
                      ...newShift,
                      department: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.departmentName} - {dept.location}
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
                  value={newShift.requiredRole}
                  onChange={(e) =>
                    setNewShift({
                      ...newShift,
                      requiredRole: e.target.value, // Keep as string, don't convert to int then back to string
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.roleName}
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
                  value={newShift.priorityLevel}
                  onChange={(e) =>
                    setNewShift({
                      ...newShift,
                      priorityLevel: parseInt(e.target.value),
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
              {showAdvanced ? (
                <EyeOff className="w-4 h-4 mr-1" />
              ) : (
                <Eye className="w-4 h-4 mr-1" />
              )}
              {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
            </button>

            {showAdvanced && (
              <div className="space-y-6 border-t pt-6">
                {/* Required Skills */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Required Skills & Certifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {skills.map((skill) => {
                      const current = newShift.skillRequirements.find(
                        (s) => s.skill === skill.id
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
                                      {
                                        id: generateUniqueId(),
                                        skill: skill.id,
                                        requiredCount: 1,
                                        mandatory: true,
                                        role: newShift.requiredRole,
                                        shift: newShift.shiftType.toString(),
                                      },
                                    ],
                                  });
                                } else {
                                  setNewShift({
                                    ...newShift,
                                    skillRequirements:
                                      newShift.skillRequirements.filter(
                                        (s) => s.skill !== skill.id
                                      ),
                                  });
                                }
                              }}
                              className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-lg mr-2">
                              {getSkillIconByLevel(
                                skill.skillLevel,
                                skill.skillName
                              )}
                            </span>
                            <div>
                              <div className="font-medium">
                                {skill.skillName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {skill.skillLevel}
                              </div>
                            </div>
                          </label>

                          {current && (
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                min={1}
                                max={10}
                                value={current.requiredCount}
                                onChange={(e) => {
                                  const count = parseInt(e.target.value) || 1;
                                  setNewShift({
                                    ...newShift,
                                    skillRequirements:
                                      newShift.skillRequirements.map((s) =>
                                        s.skill === skill.id
                                          ? { ...s, count }
                                          : s
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
                                    const count = parseInt(e.target.value) || 1;
                                    setNewShift({
                                      ...newShift,
                                      skillRequirements:
                                        newShift.skillRequirements.map(
                                          (s) =>
                                            s.skill === skill.id
                                              ? { ...s, requiredCount: count }
                                              : s // Fix: was 'count', should be 'requiredCount'
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
                    {newShift.skillRequirements.length} skill requirement(s)
                    defined
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
                  {shifts.length} shift{shifts.length !== 1 ? "s" : ""} defined
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-sm text-gray-500">Status Legend:</div>
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                  Draft
                </span>
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                  Published
                </span>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {shifts.map((shift) => (
                <div key={shift.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(
                              shift.priorityLevel
                            )}`}
                          >
                            {getPriorityText(shift.priorityLevel)} Priority
                          </span>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                              shift.status
                            )}`}
                          >


                            {shift.status.charAt(0).toUpperCase() +
                              shift.status.slice(1)}
                          </span>

                          {/* is optimized or not */}
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${shift.isOptimized ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                          >
                            {shift.isOptimized ? "Optimized" : "Not Optimized"}
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
                            {new Date(shift.shiftDate).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          <span>
                            {getShiftTypeName(shift.shiftType.toString())}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{getDepartmentName(shift.department)}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2 text-gray-400" />
                          <span>
                            {shift.requiredEmployees}{" "}
                            {getRoleName(shift.requiredRole.toString())}
                            {shift.requiredEmployees > 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>

                      {/* Advanced details */}
                      {showDetails[shift.id] && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm">
                          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                          </div> */}

                          {shift.skillRequirements &&
                            shift.skillRequirements.length > 0 && (
                              <div>
                                <span className="font-medium text-gray-700 block mb-2">
                                  Required Skills:
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {shift.skillRequirements.map((req, index) => (
                                    <span
                                      key={index}
                                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                        req.mandatory
                                          ? "bg-red-100 text-red-800"
                                          : "bg-blue-100 text-blue-800"
                                      }`}
                                    >
                                      <span className="mr-1">
                                        {getSkillIcon(req.skill)}
                                      </span>
                                      {getSkillName(req.skill)} (
                                      {req.requiredCount})
                                      {req.mandatory && (
                                        <span className="ml-1">*</span>
                                      )}
                                    </span>
                                  ))}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  * Mandatory requirement
                                </div>
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
                        title={
                          showDetails[shift.id]
                            ? "Hide details"
                            : "Show details"
                        }
                      >
                        {showDetails[shift.id] ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => removeShift(shift)}
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No shifts created yet
                  </h3>
                  <p className="text-gray-500">
                    Create your first shift using the form above.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Save Actions */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          Total shifts: {shifts.length} • High priority:{" "}
          {shifts.filter((s) => s.priorityLevel === 1).length} • Draft:{" "}
          {shifts.filter((s) => s.status === "draft").length}
        </div>
        <div className="flex space-x-4">
          
          <button
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
            onClick={submitShift}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Create Schedule
          </button>

          {/* Optimize button */}
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            // onClick={optimizeSchedule}
          >
            <Star className="w-4 h-4 mr-2" />
            Optimize Schedule
          </button>
        </div>
      </div>
    </div>
  );
};
