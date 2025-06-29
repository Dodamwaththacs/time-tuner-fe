import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../contexts/AuthContext';

export const Settings: React.FC = () => {
  const { user } = useAuth();

  const getSettingsByRole = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return [
          { id: 1, name: 'System Configuration', description: 'Configure system-wide settings', icon: '⚙️' },
          { id: 2, name: 'User Permissions', description: 'Manage user roles and permissions', icon: '🔐' },
          { id: 3, name: 'Security Settings', description: 'Configure security policies', icon: '🛡️' },
          { id: 4, name: 'Backup & Recovery', description: 'Manage system backups', icon: '💾' },
          { id: 5, name: 'Integration Settings', description: 'Configure third-party integrations', icon: '🔗' },
          { id: 6, name: 'Notification Preferences', description: 'Manage notification settings', icon: '🔔' }
        ];
      case 'manager':
        return [
          { id: 1, name: 'Team Settings', description: 'Configure team-specific settings', icon: '👥' },
          { id: 2, name: 'Project Preferences', description: 'Manage project settings', icon: '📁' },
          { id: 3, name: 'Notification Preferences', description: 'Manage notification settings', icon: '🔔' },
          { id: 4, name: 'Personal Profile', description: 'Update your profile information', icon: '👤' }
        ];
      case 'employee':
        return [
          { id: 1, name: 'Personal Profile', description: 'Update your profile information', icon: '👤' },
          { id: 2, name: 'Notification Preferences', description: 'Manage notification settings', icon: '🔔' },
          { id: 3, name: 'Work Preferences', description: 'Configure work-related settings', icon: '💼' }
        ];
      default:
        return [];
    }
  };

  const settings = getSettingsByRole(user?.role || 'employee');

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure your account and system preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settings.map((setting) => (
          <div key={setting.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">{setting.icon}</span>
              <h3 className="text-lg font-semibold text-gray-900">{setting.name}</h3>
            </div>
            <p className="text-gray-600 mb-4">{setting.description}</p>
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Configure
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={user?.name || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <input
              type="text"
              value={user?.role || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
            <input
              type="text"
              value={user?.provider || 'email'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 