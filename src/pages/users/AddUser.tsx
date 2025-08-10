import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { usersAPI, type CreateUserRequest } from "../../api/users";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Shield,
  Save,
  X,
  Camera,
} from "lucide-react";

export const AddUser: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<CreateUserRequest>({
    email: "",
    displayName: "",
    userType: "EMPLOYEE",
    phone: "",
    avatar: "",
    status: true,
  });

  const [errors, setErrors] = useState<Partial<CreateUserRequest>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateUserRequest> = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Display name validation
    if (!formData.displayName.trim()) {
      newErrors.displayName = "Display name is required";
    } else if (formData.displayName.trim().length < 2) {
      newErrors.displayName = "Display name must be at least 2 characters";
    }

    // Phone validation (optional)
    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      console.log("Creating user with data:", formData);
      
      // Call the actual API
      const result = await usersAPI.create(formData);
      console.log("User created successfully:", result);
      
      // Show success message (you can replace this with a toast notification)
      alert("User created successfully!");
      
      // Navigate back to user list
      navigate("/users/list");
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof CreateUserRequest]) {
      setErrors((prev: Partial<CreateUserRequest>) => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/users/list")}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New User</h1>
            <p className="text-gray-600 mt-1">
              Create a new user account and assign permissions
            </p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-lg shadow">
        <form onSubmit={handleSubmit}>
          {/* Form Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">User Information</h2>
            <p className="text-sm text-gray-600">
              Fill in the details below to create a new user account
            </p>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            {/* Profile Picture Section */}
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  {formData.avatar ? (
                    <img
                      className="h-20 w-20 rounded-full object-cover"
                      src={formData.avatar}
                      alt="Profile"
                    />
                  ) : (
                    <span className="text-lg font-medium text-white">
                      {formData.displayName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase() || "?"}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Upload Photo
                  </button>
                  <input
                    type="url"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleInputChange}
                    placeholder="Or paste image URL"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: Square image, at least 150x150px
                </p>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Display Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Display Name *
                </label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.displayName ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.displayName && (
                  <p className="text-red-600 text-sm mt-1">{errors.displayName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john.doe@company.com"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 555-123-4567"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.phone ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Shield className="w-4 h-4 inline mr-1" />
                  User Role *
                </label>
                <select
                  name="userType"
                  value={formData.userType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="EMPLOYEE">Employee</option>
                  <option value="MANAGER">Manager</option>
                  {currentUser?.role === "admin" && (
                    <option value="ADMIN">Administrator</option>
                  )}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.userType === "ADMIN" && "Full system access with administrative privileges"}
                  {formData.userType === "MANAGER" && "Access to manage teams and schedules"}
                  {formData.userType === "EMPLOYEE" && "Standard employee access"}
                </p>
              </div>
            </div>

            {/* Account Status */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Account Status
                    </label>
                    <p className="text-sm text-gray-500">
                      Enable or disable the user account
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="status"
                      checked={formData.status}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      {formData.status ? "Active" : "Inactive"}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Form Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/users/list")}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Creating User..." : "Create User"}
            </button>
          </div>
        </form>
      </div>

      {/* Additional Information Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          📧 User Account Setup
        </h4>
        <p className="text-sm text-blue-700">
          After creating the account, the user will receive an email with setup instructions 
          and a temporary password to access the system. They will be required to change 
          their password on first login.
        </p>
      </div>
    </div>
  );
};
