import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Download, Upload } from "lucide-react";
import { contractAPI } from "../../api/contract";

interface ContractTemplate {
  id: string;
  contractName: string;
  maxHourPerWeek: number;
  maxShiftsPerWeek: number;
  maxConsecutiveDays: number;
  minRestHours: number;
  description: string;
  active: boolean;
}

export const Contract: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] =
    useState<ContractTemplate | null>(null);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [ContractTemplates, setContractTemplates] = useState<
    ContractTemplate[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    contractName: "",
    maxHourPerWeek: 0,
    maxShiftsPerWeek: 0,
    maxConsecutiveDays: 0,
    minRestHours: 0,
    description: "",
    active: true,
  });

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await contractAPI.getAllContractTypes();
        console.log("response from contract api", response);
        setContractTemplates(response);
      } catch (error) {
        console.error("Error fetching shift templates:", error);
      }
    };

    fetchTemplates();
  }, []);

  // Reset form data when modal opens/closes or editing changes
  useEffect(() => {
    if (showModal) {
      if (editingTemplate) {
        setFormData({
          contractName: editingTemplate.contractName,
          maxHourPerWeek: editingTemplate.maxHourPerWeek,
          maxShiftsPerWeek: editingTemplate.maxShiftsPerWeek,
          maxConsecutiveDays: editingTemplate.maxConsecutiveDays,
          minRestHours: editingTemplate.minRestHours,
          description: editingTemplate.description,
          active: editingTemplate.active,
        });
      } else {
        setFormData({
          contractName: "",
          maxHourPerWeek: 0,
          maxShiftsPerWeek: 0,
          maxConsecutiveDays: 0,
          minRestHours: 0,
          description: "",
          active: true,
        });
      }
    }
  }, [showModal, editingTemplate]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingTemplate) {
        // Update existing contract
        await contractAPI.update(editingTemplate.id, formData);
        console.log("Contract updated successfully");
      } else {
        // Create new contract
        await contractAPI.create(formData);
        console.log("Contract created successfully");
      }

      // Refresh the list
      const response = await contractAPI.getAllContractTypes();
      setContractTemplates(response);

      // Close modal and reset form
      setShowModal(false);
      setEditingTemplate(null);
      alert(
        editingTemplate
          ? "Contract updated successfully!"
          : "Contract created successfully!"
      );
    } catch (error) {
      console.error("Error saving contract:", error);
      alert("Failed to save contract. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this contract?"))
      return;

    try {
      await contractAPI.delete(id);
      // Refresh the list after successful deletion
      const response = await contractAPI.getAllContractTypes();
      setContractTemplates(response);
      alert("Contract deleted successfully!");
    } catch (error) {
      console.error("Error deleting contract:", error);
      alert("Failed to delete contract. Please try again.");
    }
  };

  const filteredTemplates = ContractTemplates.filter(
    (template) =>
      template.contractName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelection = (id: string) => {
    setSelectedTemplates((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Contract Templates
          </h1>
          <p className="text-gray-600 mt-1">
            Manage contracts and work hour rules
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Contract
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contracts..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setSelectedTemplates(
                        e.target.checked
                          ? filteredTemplates.map((t) => t.id)
                          : []
                      )
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contract Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Max Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Max Shifts
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Max Days
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Min Rest (hrs)
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
              {filteredTemplates.map((template) => (
                <tr key={template.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedTemplates.includes(template.id)}
                      onChange={() => toggleSelection(template.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {template.contractName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {template.maxHourPerWeek}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {template.maxShiftsPerWeek}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {template.maxConsecutiveDays}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {template.minRestHours}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {template.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${template.active
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-red-100 text-red-800 border-red-200"
                        }`}
                    >
                      {template.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingTemplate(template);
                          setShowModal(true); // Explicitly open the modal
                        }}
                        className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(template.id)}
                        className="p-1 text-red-600 hover:text-red-900 hover:bg-red-100 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingTemplate ? "Edit Contract" : "New Contract"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingTemplate(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
              {/* Contract Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contract Name
                </label>
                <input
                  type="text"
                  value={formData.contractName}
                  onChange={(e) =>
                    handleInputChange("contractName", e.target.value)
                  }
                  required
                  placeholder="Ex: Full-time Nurse"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Grid layout for numbers */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Hours / Week
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxHourPerWeek}
                    onChange={(e) =>
                      handleInputChange(
                        "maxHourPerWeek",
                        parseInt(e.target.value) || 0
                      )
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Shifts / Week
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxShiftsPerWeek}
                    onChange={(e) =>
                      handleInputChange(
                        "maxShiftsPerWeek",
                        parseInt(e.target.value) || 0
                      )
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Consecutive Days
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxConsecutiveDays}
                    onChange={(e) =>
                      handleInputChange(
                        "maxConsecutiveDays",
                        parseInt(e.target.value) || 0
                      )
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Rest Hours
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.minRestHours}
                    onChange={(e) =>
                      handleInputChange(
                        "minRestHours",
                        parseInt(e.target.value) || 0
                      )
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Add notes about this contract..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Active status */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) =>
                    handleInputChange("active", e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Active</span>
              </div>
            </form>

            {/* Footer */}
            <div className="px-6 py-4 border-t flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setEditingTemplate(null);
                }}
                disabled={isLoading}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="contract-form"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                    {editingTemplate ? "Updating..." : "Creating..."}
                  </>
                ) : editingTemplate ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
