import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';

interface Role {
  id: number;
  role_name: string;
  description: string;
  active: boolean;
}

export const EmployeeRoles: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddRole, setShowAddRole] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const roles: Role[] = [
    { id: 1, role_name: 'Registered Nurse', description: 'Licensed nursing professional', active: true },
    { id: 2, role_name: 'Medical Assistant', description: 'Assists with clinical tasks', active: true },
    { id: 3, role_name: 'Pharmacist', description: 'Dispenses medications', active: false },
  ];

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.role_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'Active' ? role.active : !role.active);
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Role = {
      id: editingRole?.id || Date.now(),
      role_name: formData.get('role_name') as string,
      description: formData.get('description') as string,
      active: formData.get('active') === 'on',
    };
    // Save logic goes here
    setShowAddRole(false);
    setEditingRole(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Employee Roles</h1>
        <button
          onClick={() => setShowAddRole(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Role
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by role name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="mt-2 md:mt-0 flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4 mr-2" /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'Active' | 'Inactive')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        )}

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRoles.map(role => (
              <tr key={role.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{role.role_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{role.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${role.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {role.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button onClick={() => setEditingRole(role)} className="text-blue-600 hover:text-blue-900 mr-2">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(showAddRole || editingRole) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto z-50">
          <div className="relative top-20 mx-auto p-6 border w-full max-w-md bg-white rounded-lg">
            <h2 className="text-lg font-semibold mb-4">{editingRole ? 'Edit' : 'Add'} Role</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="role_name"
                defaultValue={editingRole?.role_name}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Role Name"
              />
              <textarea
                name="description"
                defaultValue={editingRole?.description}
                rows={3}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Description"
              />
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="active"
                  defaultChecked={editingRole?.active}
                  className="form-checkbox"
                />
                <span className="ml-2">Active</span>
              </label>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddRole(false);
                    setEditingRole(null);
                  }}
                  className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editingRole ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
