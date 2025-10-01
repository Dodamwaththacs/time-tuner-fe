import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Plus, Edit, Trash2, Search, Filter, X } from "lucide-react";
import { departmentAPI } from "../../api/department";
import type { Department } from "../../api/department";
import { getOrganizationId, getAuthHeaders } from '../../utils/authUtils';



export const Departments: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Active" | "Inactive">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [organizationId, setOrganizationId] = useState("");

  // const organizationId = "123e4567-e89b-12d3-a456-426655440001";

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const response = await departmentAPI.getAllByOrganization();
        setOrganizationId(getOrganizationId() || "");
        setDepartments(response);
      } catch (error) {
        console.error("Error fetching departments:", error);
        alert("Error loading departments. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [organizationId]);

  // Filter departments based on search and status
  const filteredDepartments = departments.filter((dept) => {
  const matchesSearch = dept.departmentName
    ?.toLowerCase()
    .includes(searchQuery.toLowerCase()) ?? true;
  const matchesStatus =
    statusFilter === "all" ||
    (statusFilter === "Active" ? dept.active : !dept.active);
  return matchesSearch && matchesStatus;
});

  // Form state
  const [formData, setFormData] = useState({
    departmentName: "",
    description: "",
    location: "",
    active: true
  });

  // Update form data when editing department changes
  useEffect(() => {
    if (editingDepartment) {
      setFormData({
        departmentName: editingDepartment.departmentName,
        description: editingDepartment.description,
        location: editingDepartment.location,
        active: editingDepartment.active
      });
    } else {
      setFormData({
        departmentName: "",
        description: "",
        location: "",
        active: true
      });
    }
  }, [editingDepartment, showAddDepartment]);

  // Handle form submission for add/edit
  const handleSubmit = async () => {
    if (!formData.departmentName.trim()) {
      alert("Department name is required");
      return;
    }

    setSubmitting(true);
    
    const data: Omit<Department, "id"> = {
      departmentName: formData.departmentName,
      description: formData.description,
      location: formData.location,
      active: formData.active,
      organization: organizationId,
    };

    try {
      if (editingDepartment) {
        const updatedDept:any = await departmentAPI.update(editingDepartment.id, {
          ...data,
          id: editingDepartment.id,
        });
        setDepartments(deps => deps.map(d => d.id === editingDepartment.id ? updatedDept : d));
        alert("Department updated successfully!");
      } else {
        const newDept = await departmentAPI.create(data);
        setDepartments(deps => [...deps, newDept]);
        alert("Department created successfully!");
      }
      resetForm();
    } catch (error) {
      console.error("Error with department operation:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete department
  const handleDelete = async (dept: Department) => {
    if (window.confirm(`Are you sure you want to delete "${dept.departmentName}"?`)) {
      try {
        setDepartments(deps => deps.filter(d => d.id !== dept.id));
        await departmentAPI.delete(dept.id);
        alert("Department deleted successfully!");
      } catch (error) {
        console.error("Error deleting department:", error);
        alert("Error deleting department. Please try again.");
      }
    }
  };

  // Reset form and close modal
  const resetForm = () => {
    setShowAddDepartment(false);
    setEditingDepartment(null);
    setFormData({
      departmentName: "",
      description: "",
      location: "",
      active: true
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-600 mt-1">Manage your organization's departments</p>
        </div>
        <button
          onClick={() => setShowAddDepartment(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Department
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by department name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-4 py-2 border rounded-lg transition-colors ${
              showFilters 
                ? 'bg-blue-50 border-blue-300 text-blue-700' 
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {showFilters && <X className="w-4 h-4 ml-2" />}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Filter
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as "all" | "Active" | "Inactive")
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Departments</option>
                  <option value="Active">Active Only</option>
                  <option value="Inactive">Inactive Only</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>
          Showing {filteredDepartments.length} of {departments.length} departments
        </span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-blue-600 hover:text-blue-800"
          >
            Clear search
          </button>
        )}
      </div>

      {/* Departments Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDepartments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Search className="w-12 h-12 text-gray-300 mb-4" />
                      <p className="text-lg font-medium">No departments found</p>
                      <p className="text-sm">
                        {searchQuery 
                          ? "Try adjusting your search criteria" 
                          : "Get started by adding your first department"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDepartments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {dept.departmentName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {dept.location || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-500 max-w-xs truncate">
                        {dept.description || "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          dept.active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {dept.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingDepartment(dept)}
                          className="text-blue-600 hover:text-blue-900 transition-colors p-1"
                          title="Edit department"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(dept)}
                          className="text-red-600 hover:text-red-900 transition-colors p-1"
                          title="Delete department"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddDepartment || editingDepartment) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingDepartment ? "Edit Department" : "Add New Department"}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department Name *
                  </label>
                  <input
                    type="text"
                    value={formData.departmentName}
                    onChange={(e) => setFormData({...formData, departmentName: e.target.value})}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter department name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter department description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter location"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({...formData, active: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="active" className="ml-2 text-sm text-gray-700">
                    Active Department
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={submitting}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                  >
                    {submitting && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    )}
                    {editingDepartment ? "Update" : "Create"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}