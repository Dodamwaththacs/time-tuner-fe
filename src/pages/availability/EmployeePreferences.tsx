import React, { useState,useEffect } from "react";
import { Plus, X, AlertCircle, Edit2, Star, Clock, Users, Save, Loader2, Check, Trash2 } from "lucide-react";
import  {shiftAPI} from "../../api/shiftType";
import type { ShiftType } from "../../api/shiftType";
import { departmentAPI } from "../../api/department";
import type { Department } from "../../api/department";
import type { EmployeePreference } from "../../api/employeePreference";
import type { EmployeePreferenceWithOutId } from "../../api/employeePreference";
import { employeePreferenceAPI } from "../../api/employeePreference";
import { getOrganizationId, getEmployeeId,getDepartmentId,getAuthHeaders } from '../../utils/authUtils';



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
   
    
  ];

  const [preferences, setPreferences] = useState<EmployeePreferenceWithOutId[]>(dummyPreferences);
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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Notification helper
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Form validation
  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.shiftType) errors.shiftType = 'Shift type is required';
    if (!formData.department) errors.department = 'Department is required';
    if (!formData.preferenceType) errors.preferenceType = 'Preference type is required';
    if (formData.preferenceWeight < 1 || formData.preferenceWeight > 5) {
      errors.preferenceWeight = 'Weight must be between 1 and 5';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "preferenceWeight" ? Number(value) : value
    }));
    
    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      showNotification('error', 'Please fix the errors below');
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      if (editMode) {
        await employeePreferenceAPI.update(formData);
        showNotification('success', 'Preference updated successfully!');
      } else {
        const createData = {
        preferenceType: formData.preferenceType,
        preferenceWeight: formData.preferenceWeight,
        notes: formData.notes,
        employee: getEmployeeId(),
        shiftType: formData.shiftType,
        department: formData.department,
        active: true
      };
      
      await employeePreferenceAPI.create(createData);
      showNotification('success', 'Preference created successfully!');
      }
  
      // Reset form and close
      setFormData({
        id: "",
        preferenceType: "PREFER",
        preferenceWeight: 3,
        notes: "",
        employee: "",
        shiftType: "",
        department: "",
        active: true
      });
      setShowForm(false);
      setEditMode(false);
      setFormErrors({});
      
      // Refresh preferences list
      const preferences = await employeePreferenceAPI.getAllByEmployee();
      setPreferences(preferences);
  
    } catch (error) {
      console.error('Error submitting preference:', error);
      showNotification('error', 'Failed to submit preference. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (preference: EmployeePreferenceWithOutId): void => {
    // Find the actual shift and department objects to get their IDs
    const shift = shiftTypes.find(s => s.shiftName === preference.shiftName);
    const dept = departments.find(d => d.departmentName === preference.department);
    
    setFormData({
      id: preference.id,
      preferenceType: preference.preferenceType,
      preferenceWeight: preference.preferenceWeight,
      notes: preference.notes,
      employee: preference.employee,
      shiftType: shift?.id || "",
      department: dept?.id || "",
      active: true
    });
    setEditMode(true);
    setShowForm(true);
  };
  
  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this preference?')) {
      return;
    }

    try {
      await employeePreferenceAPI.delete(id);
      setPreferences(prev => prev.filter(item => item.id !== id));
      showNotification('success', 'Preference deleted successfully!');
    } catch (error) {
      console.error('Error deleting preference:', error);
      showNotification('error', 'Failed to delete preference. Please try again.');
    }
  };

  const getPreferenceStyle = (type: string): { style: string; icon: React.ReactElement; label: string } => {
    switch (type) {
      case "STRONGLY_PREFER":
        return {
          style: "bg-emerald-100 text-emerald-800 border-emerald-200",
          icon: <Star className="w-3 h-3 fill-current" />,
          label: "Strongly Preferred"
        };
      case "PREFER":
        return {
          style: "bg-green-100 text-green-800 border-green-200",
          icon: <Check className="w-3 h-3" />,
          label: "Preferred"
        };
      case "NEUTRAL":
        return {
          style: "bg-gray-100 text-gray-600 border-gray-200",
          icon: <Clock className="w-3 h-3" />,
          label: "Neutral"
        };
      case "AVOID":
        return {
          style: "bg-orange-100 text-orange-800 border-orange-200",
          icon: <X className="w-3 h-3" />,
          label: "Avoid"
        };
      case "STRONGLY_AVOID":
        return {
          style: "bg-red-100 text-red-800 border-red-200",
          icon: <X className="w-3 h-3" />,
          label: "Strongly Avoid"
        };
      default:
        return {
          style: "bg-gray-100 text-gray-800 border-gray-200",
          icon: <Clock className="w-3 h-3" />,
          label: "Unknown"
        };
    }
  };



  return (
    <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border ${
          notification.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        } transition-all duration-300 ease-in-out`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <Check className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{notification.message}</span>
            <button 
              onClick={() => setNotification(null)}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Clock className="w-8 h-8 text-blue-600" />
          Shift Preferences
        </h1>
        <p className="text-gray-600 text-lg">Manage your shift preferences to optimize your schedule</p>
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {preferences.length} preferences set
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            Personalized scheduling
          </span>
        </div>
      </div>

      {/* Add Preference Button */}
      <div className="mb-6">
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditMode(false);
            setFormData({
              id: "",
              preferenceType: "PREFER",
              preferenceWeight: 3,
              notes: "",
              employee: "",
              shiftType: "",
              department: "",
              active: true
            });
            setFormErrors({});
          }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
        >
          <Plus size={18} />
          Add New Preference
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-8 bg-white border border-gray-200 rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            {editMode ? (
              <Edit2 className="w-6 h-6 text-blue-600" />
            ) : (
              <Plus className="w-6 h-6 text-blue-600" />
            )}
            <h2 className="text-2xl font-bold text-gray-900">
              {editMode ? "Edit Preference" : "Add New Preference"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shift Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Shift Type *
              </label>
              <select
                name="shiftType"
                value={formData.shiftType}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.shiftType ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
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
              {formErrors.shiftType && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {formErrors.shiftType}
                </p>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Department *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.department ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
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
              {formErrors.department && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {formErrors.department}
                </p>
              )}
            </div>

            {/* Preference Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Star className="w-4 h-4 inline mr-1" />
                Preference Type *
              </label>
              <select
                name="preferenceType"
                value={formData.preferenceType}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.preferenceType ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="STRONGLY_PREFER">⭐ Strongly Preferred</option>
                <option value="PREFER">✅ Preferred</option>
                <option value="NEUTRAL">⚪ Neutral</option>
                <option value="AVOID">🔶 Avoid</option>
                <option value="STRONGLY_AVOID">❌ Strongly Avoid</option>
              </select>
              {formErrors.preferenceType && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {formErrors.preferenceType}
                </p>
              )}
            </div>

            {/* Preference Weight */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Preference Weight (1-5)
              </label>
              <input
                type="number"
                name="preferenceWeight"
                min={1}
                max={5}
                value={formData.preferenceWeight}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.preferenceWeight ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {formErrors.preferenceWeight && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {formErrors.preferenceWeight}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">Higher numbers indicate stronger preference</p>
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Additional Notes
              </label>
              <input
                type="text"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any additional details about this preference..."
                className="w-full p-3 border border-gray-300 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Actions */}
            <div className="md:col-span-2 flex gap-3 pt-4">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed shadow-md"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSubmitting ? 'Saving...' : (editMode ? "Update Preference" : "Add Preference")}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditMode(false);
                  setFormErrors({});
                }}
                disabled={isSubmitting}
                className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors disabled:cursor-not-allowed"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preference List */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Your Preferences ({preferences.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Shift
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <Users className="w-4 h-4 inline mr-1" />
                  Department
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <Star className="w-4 h-4 inline mr-1" />
                  Preference
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Weight
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Notes
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {preferences.map((pref) => {
                const preferenceData = getPreferenceStyle(pref.preferenceType);
                return (
                  <tr 
                    key={pref.id} 
                    className="hover:bg-gray-50 transition-colors duration-150 group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <Clock className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{pref.shiftName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{pref.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${preferenceData.style}`}
                      >
                        {preferenceData.icon}
                        {preferenceData.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i}
                            className={`w-4 h-4 ${
                              i < pref.preferenceWeight 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">({pref.preferenceWeight}/5)</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {pref.notes || <span className="text-gray-400 italic">No notes</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* <button
                          onClick={() => handleEdit(pref)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                          title="Edit preference"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button> */}
                        <button
                          onClick={() => handleDelete(pref.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
                          title="Delete preference"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {preferences.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center"
                  >
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Clock className="w-12 h-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No preferences yet</h3>
                      <p className="text-sm">Add your first shift preference to get started</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


      {/* Summary & Stats */}
      {preferences.length > 0 && (
        <div className="mt-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="text-blue-600 w-6 h-6" />
            Preference Summary
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{preferences.length}</p>
                  <p className="text-sm text-gray-600">Total Preferences</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {preferences.filter(p => p.preferenceType === 'STRONGLY_PREFER' || p.preferenceType === 'PREFER').length}
                  </p>
                  <p className="text-sm text-gray-600">Preferred Shifts</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <X className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {preferences.filter(p => p.preferenceType === 'AVOID' || p.preferenceType === 'STRONGLY_AVOID').length}
                  </p>
                  <p className="text-sm text-gray-600">Shifts to Avoid</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-100/50 rounded-lg">
            <p className="text-sm text-blue-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Your preferences help the scheduling system create optimized shifts that work better for you.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
