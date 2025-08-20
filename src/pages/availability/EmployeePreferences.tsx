import React, { useState,useEffect } from "react";
import { Plus, X, Edit, AlertCircle, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import  {shiftAPI} from "../../api/shiftType";
import type { ShiftType } from "../../api/shiftType";
import { departmentAPI } from "../../api/department";
import type { Department } from "../../api/department";
import type { EmployeePreference } from "../../api/employeePreference";
import type { EmployeePreferenceWithOutId } from "../../api/employeePreference";
import { employeePreferenceAPI } from "../../api/employeePreference";


// {
//   "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//   "preferenceType": "STRONGLY_PREFER",
//   "preferenceWeight": 1073741824,
//   "notes": "string",
//   "active": true,
//   "employee": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//   "shiftType": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//   "department": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
// }


// {
//   "id": "123e4567-e89b-12d3-a456-426655440002",
//   "preferenceType": "PREFER",
//   "preferenceWeight": 6,
//   "notes": "Will work nights in ICU if needed",
//   "active": true,
//   "employee": "Jessica",
//   "shiftName": "Night Shift",
//   "department": "Intensive Care Unit"
// },








// interface ScheduledShift {
//   id: number;
//   date: string;
//   shiftName: string;
//   department: string;
//   startTime: string;
//   endTime: string;
//   preferenceMatch: "STRONGLY_PREFER" | "PREFER" | "NEUTRAL" | "AVOID" | "STRONGLY_AVOID";
//   dateObj: Date;
// }

export const EmployeePreferences: React.FC = () => {

  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([]);
  const [loadingShiftTypes, setLoadingShiftTypes] = useState<boolean>(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState<boolean>(true);

  useEffect(() => {
    const fetchShiftTypes = async () => {
      try {
        setLoadingShiftTypes(true);
        const types = await shiftAPI.getAllByOrganization();  
        setShiftTypes(types);
      } catch (error) {
        console.error('Error fetching shift types:', error);
      } finally {
        setLoadingShiftTypes(false);
      }
    };

    fetchShiftTypes();
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoadingDepartments(true);
        const departments = await departmentAPI.getAllByEmployee();
        setDepartments(departments);
      } catch (error) {
        console.error('Error fetching departments:', error);
      } finally {
        setLoadingDepartments(false);
      }
    };
    fetchDepartments();
  }, []);


  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const preferences = await employeePreferenceAPI.getAllByEmployee();
        setPreferences(preferences);
      } catch (error) {
        console.error('Error fetching preferences:', error);
      }
    };
    fetchPreferences();
  }, []);


  const dummyPreferences: EmployeePreferenceWithOutId[] = [
    {
      id: "123e4567-e89b-12d3-a456-426655440002",
      preferenceType: "PREFER",
      preferenceWeight: 5,
      notes: "Best performance in mornings",
      employee: "Jessica",
      shiftName: "Morning Shift",
      department: "Emergency"
    },
    
  ];

  // const dummyScheduledShifts: ScheduledShift[] = [
  //   {
  //     id: 1,
  //     date: "2025-08-10",
  //     shiftName: "Morning Shift",
  //     department: "Emergency",
  //     startTime: "07:00",
  //     endTime: "15:00",
  //     preferenceMatch: "PREFER",
  //     dateObj: new Date("2025-08-10")
  //   },
  //   {
  //     id: 2,
  //     date: "2025-08-15",
  //     shiftName: "Night Shift",
  //     department: "ICU",
  //     startTime: "23:00",
  //     endTime: "07:00",
  //     preferenceMatch: "AVOID",
  //     dateObj: new Date("2025-08-15")
  //   },
    
  // ];

  const [preferences, setPreferences] = useState<EmployeePreferenceWithOutId[]>(dummyPreferences);
  // const [scheduledShifts, setScheduledShifts] = useState<any[]>(dummyScheduledShifts);
  // const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<EmployeePreference>({
    id: "",
    preferenceType: "PREFER",
    preferenceWeight: 3,
    notes: "",
    employee: "",
    shiftType: "",
    department: "",
    active: true
  });
  const [editMode, setEditMode] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "preferenceWeight" ? Number(value) : value
    }));
  };

  const handleSubmit = async (): Promise<void> => {
    if (!formData.shiftType || !formData.department || !formData.preferenceType) {
      alert("Please fill in all required fields");
      return;
    }
  
    // Define a variable to hold the successful submission status
    let isSuccess = false;
  
    try {
      // The API call is an asynchronous operation, so we use 'await'
      const createdPreference = await employeePreferenceAPI.create(formData);
      console.log("Preference created successfully:", createdPreference);
  
      // If the API call succeeds, set our status variable to true
      isSuccess = true;
  
    } catch (error) {
      // If the API call fails, the catch block will execute
      console.error('Error creating preference:', error);
      alert('Failed to submit preference. Please try again.');
    }
  
    // This block runs after the try...catch block finishes
    if (isSuccess) {
      // Reset the form data only if the submission was successful
      setFormData({
        id: "123e4567-e89b-12d3-a456-426655440001",
        preferenceType: "PREFER",
        preferenceWeight: 3,
        notes: "",
        employee: "123e4567-e89b-12d3-a456-426655440001",
        shiftType: "",
        department: "",
        active: true
      });
      // And then close the form
      setShowForm(false);
      setEditMode(false);
      alert('Preference submitted successfully!');
    }
  };

  
  const handleDelete = (id: string): void => {
    setPreferences(prev => prev.filter(item => item.id !== id));
  };

  const handleEdit = (pref: EmployeePreferenceWithOutId): void => {
    // setFormData(pref);
    setEditMode(true);
    setShowForm(true);
  };

  const getPreferenceStyle = (type: string): string => {
    switch (type) {
      case "PREFERRED":
        return "bg-green-100 text-green-800 border-green-200";
      case "ACCEPTABLE":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "AVOID":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Calendar helper functions
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

  // const getShiftsForDate = (day: number | null): ScheduledShift[] => {
  //   if (!day) return [];
    
  //   const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
  //   return scheduledShifts.filter(shift => {
  //     const shiftDate = new Date(shift.date);
  //     return shiftDate.toDateString() === targetDate.toDateString();
  //   });
  // };

  // const navigateMonth = (direction: number): void => {
  //   setCurrentDate(prev => {
  //     const newDate = new Date(prev);
  //     newDate.setMonth(newDate.getMonth() + direction);
  //     return newDate;
  //   });
  // };

  // const formatTime = (time: string): string => {
  //   const [hours, minutes] = time.split(':');
  //   const hour12 = parseInt(hours) % 12 || 12;
  //   const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
  //   return `${hour12}:${minutes} ${ampm}`;
  // };

  // const monthNames: string[] = [
  //   "January", "February", "March", "April", "May", "June",
  //   "July", "August", "September", "October", "November", "December"
  // ];

  // const dayNames: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          Shift Preferences
        </h1>
        <p className="text-gray-600">Manage employee shift preferences</p>
      </div>

      {/* Add Preference Button */}
      <div className="mb-6">
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditMode(false);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={16} />
          Add Preference
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-8 bg-gray-50 p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {editMode ? "Edit Preference" : "Add Preference"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shift Name
              </label>
              <select
                name="shiftType"
                value={formData.shiftType}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
                disabled={loadingShiftTypes}
              >
                <option value="">
                  {loadingShiftTypes ? "Loading shifts..." : "Select a shift"}
                </option>
                {shiftTypes
                  .filter(shift => shift.active)
                  .map(shift => (
                    <option key={shift.id} value={shift.id}>
                      {shift.shiftName} ({shift.startTime}:00 - {shift.endTime}:00)
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
                disabled={loadingDepartments}
              >
                <option value="">
                  {loadingDepartments ? "Loading departments..." : "Select a department"}
                </option>
                {departments
                  .filter(dept => dept.active)
                  .map(dept => (
                    <option key={dept.id} value={dept.id}>
                      {dept.departmentName}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preference Type
              </label>
              <select
                name="preferenceType"
                value={formData.preferenceType}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="STRONGLY_PREFER">Strongly Preferred</option>
                <option value="PREFER">Preferred</option>
                <option value="NEUTRAL">Neutral</option>
                <option value="AVOID">Avoid</option>
                <option value="STRONGLY_AVOID">Strongly Avoid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preference Weight
              </label>
              <input
                type="number"
                name="preferenceWeight"
                min={1}
                max={5}
                value={formData.preferenceWeight}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <input
                type="text"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                {editMode ? "Update Preference" : "Add Preference"}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditMode(false);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preference List */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Shift</th>
                <th className="px-4 py-2 text-left">Department</th>
                <th className="px-4 py-2 text-left">Preference</th>
                <th className="px-4 py-2 text-left">Weight</th>
                <th className="px-4 py-2 text-left">Notes</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {preferences.map(pref => (
                <tr key={pref.id} className="border-b border-gray-100">
                  <td className="px-4 py-2">{pref.shiftName}</td>
                  <td className="px-4 py-2">{pref.department}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full border ${getPreferenceStyle(
                        pref.preferenceType
                      )}`}
                    >
                      {pref.preferenceType}
                    </span>
                  </td>
                  <td className="px-4 py-2">{pref.preferenceWeight}</td>
                  <td className="px-4 py-2">{pref.notes}</td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(pref)}
                      className="text-blue-600 hover:underline"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(pref.id)}
                      className="text-red-600 hover:underline"
                    >
                      <X size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {preferences.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    No preferences found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


      {/* Calendar View */}
{/* 
      <div className="mt-8 bg-white border border-gray-200 rounded-lg shadow-sm">
\        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Calendar size={20} />
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

\        <div className="grid grid-cols-7 border-b border-gray-200">
          {dayNames.map(day => (
            <div key={day} className="p-3 text-center font-medium text-gray-600 bg-gray-50">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {getDaysInMonth(currentDate).map((day, index) => {
            const dayShifts = getShiftsForDate(day);
            
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
                    
                    {dayShifts.map(shift => (
                      <div
                        key={shift.id}
                        className={`text-xs p-1 rounded mb-1 relative group border ${getPreferenceStyle(shift.preferenceMatch)}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 truncate">
                            <Clock size={10} />
                            <span className="truncate">
                              {formatTime(shift.startTime)}-{formatTime(shift.endTime)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span 
                              className="text-xs font-bold" 
                              title={`Preference: ${shift.preferenceMatch}`}
                            >
                              {shift.preferenceMatch === "STRONGLY_PREFER" ? "💚" : 
                              shift.preferenceMatch === "PREFER" ? "💛" :
                              shift.preferenceMatch === "NEUTRAL" ? "⚪" :
                              shift.preferenceMatch === "AVOID" ? "💔" :
                              shift.preferenceMatch === "STRONGLY_AVOID" ? "💔" : "⚪"}
                            </span>
                          </div>
                        </div>
                        <div className="truncate font-medium" title={`${shift.shiftName} - ${shift.department}`}>
                          {shift.shiftName}
                        </div>
                        <div className="text-xs opacity-75 mt-1">
                          {shift.department}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            );
          })}
        </div> */}

        {/* Legend */}
{/*         
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Preference Match Legend:</h4>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-green-100 border border-green-200"></div>
              <span>💚 Preferred Shift</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-200"></div>
              <span>💛 Acceptable Shift</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-red-100 border border-red-200"></div>
              <span>💔 Avoided Shift</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-gray-100 border border-gray-200"></div>
              <span>⚪ No Preference Set</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Calendar shows scheduled shifts and how they match your preferences
          </p>
        </div>
      </div> */}

      {/* Summary */}
      {preferences.length > 0 && (
        <div className="mt-8 bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <AlertCircle className="text-blue-600" />
            Summary
          </h3>
          <p className="text-sm text-gray-700">
            You have {preferences.length} shift preferences recorded.
          </p>
        </div>
      )}
    </div>
  );
};
