import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../contexts/AuthContext';

export const Team: React.FC = () => {
  const { user } = useAuth();

  const getTeamMembersByRole = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return [
          { id: 1, name: 'John Doe', role: 'Manager', email: 'john@example.com', status: 'Active', department: 'Engineering' },
          { id: 2, name: 'Jane Smith', role: 'Employee', email: 'jane@example.com', status: 'Active', department: 'Design' },
          { id: 3, name: 'Bob Johnson', role: 'Employee', email: 'bob@example.com', status: 'Active', department: 'Engineering' },
          { id: 4, name: 'Alice Brown', role: 'Manager', email: 'alice@example.com', status: 'Active', department: 'Marketing' },
          { id: 5, name: 'Charlie Wilson', role: 'Employee', email: 'charlie@example.com', status: 'Inactive', department: 'Sales' }
        ];
      case 'manager':
        return [
          { id: 1, name: 'Jane Smith', role: 'Employee', email: 'jane@example.com', status: 'Active', department: 'Design' },
          { id: 2, name: 'Bob Johnson', role: 'Employee', email: 'bob@example.com', status: 'Active', department: 'Engineering' }
        ];
      default:
        return [];
    }
  };

  const teamMembers = getTeamMembersByRole(user?.role || 'employee');

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Manager': return 'bg-blue-100 text-blue-800';
      case 'Employee': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
        <p className="text-gray-600">Manage your team members and their roles</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
            {user?.role === 'admin' && (
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                + Add Member
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
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
              {teamMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">View</button>
                      {(user?.role === 'admin' || (user?.role === 'manager' && member.role === 'Employee')) && (
                        <button className="text-green-600 hover:text-green-900">Edit</button>
                      )}
                      {user?.role === 'admin' && (
                        <button className="text-red-600 hover:text-red-900">Remove</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Members</span>
              <span className="font-semibold">{teamMembers.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active Members</span>
              <span className="font-semibold">{teamMembers.filter(m => m.status === 'Active').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Managers</span>
              <span className="font-semibold">{teamMembers.filter(m => m.role === 'Manager').length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 