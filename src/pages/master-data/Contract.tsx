import React, { useState,useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Download,
  Upload
} from 'lucide-react';
import { contractAPI } from '../../api/contract';


interface ShiftTemplate {
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
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ShiftTemplate | null>(null);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [shiftTemplates, setShiftTemplates] = useState<ShiftTemplate[]>([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await contractAPI.getAllContractTypes();
        setShiftTemplates(response);
      } catch (error) {
        console.error('Error fetching shift templates:', error);
      }
    };

    fetchTemplates();
  }, []);

  const filteredTemplates = shiftTemplates.filter(template =>
    template.contractName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelection = (id: string) => {
    setSelectedTemplates(prev =>
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contract Templates</h1>
          <p className="text-gray-600 mt-1">Manage contracts and work hour rules</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2" />Export
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Upload className="w-4 h-4 mr-2" />Import
          </button>
          <button 
            onClick={() => setShowModal(true)} 
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />Add Contract
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
                      setSelectedTemplates(e.target.checked ? filteredTemplates.map(t => t.id) : [])
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Hours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Shifts</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Rest (hrs)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTemplates.map(template => (
                <tr key={template.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedTemplates.includes(template.id)}
                      onChange={() => toggleSelection(template.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{template.contractName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{template.maxHourPerWeek}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{template.maxShiftsPerWeek}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{template.maxConsecutiveDays}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{template.minRestHours}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{template.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${
                      template.active 
                        ? 'bg-green-100 text-green-800 border-green-200' 
                        : 'bg-red-100 text-red-800 border-red-200'
                    }`}>
                      {template.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setEditingTemplate(template)} 
                        className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:text-red-900 hover:bg-red-100 rounded transition-colors">
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-4">{editingTemplate ? 'Edit Contract' : 'New Contract'}</h3>
            <form className="space-y-4">
              <input 
                type="text" 
                placeholder="Contract Name" 
                defaultValue={editingTemplate?.contractName} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
              <input 
                type="number" 
                placeholder="Max Hours/Week" 
                defaultValue={editingTemplate?.maxHourPerWeek} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
              <input 
                type="number" 
                placeholder="Max Shifts/Week" 
                defaultValue={editingTemplate?.maxShiftsPerWeek} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
              <input 
                type="number" 
                placeholder="Max Consecutive Days" 
                defaultValue={editingTemplate?.maxConsecutiveDays} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
              <input 
                type="number" 
                placeholder="Min Rest Hours" 
                defaultValue={editingTemplate?.minRestHours} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
              <textarea 
                placeholder="Description" 
                defaultValue={editingTemplate?.description} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                rows={3}
              />
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  defaultChecked={editingTemplate?.active ?? true} 
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
              <div className="flex justify-end space-x-2">
                <button 
                  type="button" 
                  onClick={() => { setShowModal(false); setEditingTemplate(null); }} 
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingTemplate ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};