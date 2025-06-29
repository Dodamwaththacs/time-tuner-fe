import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../contexts/AuthContext';

export const Tasks: React.FC = () => {
  const { user } = useAuth();

  const getTasksByRole = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return [
          { id: 1, title: 'Review project proposals', status: 'In Progress', priority: 'High', assignee: 'John Doe', dueDate: '2024-01-15' },
          { id: 2, title: 'Approve budget allocations', status: 'Pending', priority: 'High', assignee: 'Admin', dueDate: '2024-01-20' },
          { id: 3, title: 'System maintenance', status: 'Completed', priority: 'Medium', assignee: 'Tech Team', dueDate: '2024-01-10' },
          { id: 4, title: 'Team performance review', status: 'In Progress', priority: 'Medium', assignee: 'HR Team', dueDate: '2024-01-25' }
        ];
      case 'manager':
        return [
          { id: 1, title: 'Review project proposals', status: 'In Progress', priority: 'High', assignee: 'John Doe', dueDate: '2024-01-15' },
          { id: 2, title: 'Team meeting preparation', status: 'Pending', priority: 'Medium', assignee: 'Manager', dueDate: '2024-01-18' },
          { id: 3, title: 'Progress report submission', status: 'Completed', priority: 'High', assignee: 'Manager', dueDate: '2024-01-12' }
        ];
      case 'employee':
        return [
          { id: 1, title: 'Complete feature development', status: 'In Progress', priority: 'High', assignee: 'Employee', dueDate: '2024-01-15' },
          { id: 2, title: 'Code review', status: 'Pending', priority: 'Medium', assignee: 'Employee', dueDate: '2024-01-17' },
          { id: 3, title: 'Documentation update', status: 'Completed', priority: 'Low', assignee: 'Employee', dueDate: '2024-01-10' }
        ];
      default:
        return [];
    }
  };

  const tasks = getTasksByRole(user?.role || 'employee');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <p className="text-gray-600">Manage and track your tasks</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Task List</h2>
            {(user?.role === 'admin' || user?.role === 'manager') && (
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                + Add Task
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{task.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {task.assignee}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {task.dueDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">View</button>
                      {(user?.role === 'admin' || user?.role === 'manager') && (
                        <button className="text-green-600 hover:text-green-900">Edit</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}; 