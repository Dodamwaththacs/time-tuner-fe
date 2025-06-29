import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../contexts/AuthContext';

// Role-specific components
const AdminDashboard: React.FC = () => (
  <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg border border-red-200">
    <h3 className="text-lg font-semibold text-red-800 mb-4">Admin Dashboard</h3>
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h4 className="font-medium text-gray-900">System Overview</h4>
        <p className="text-sm text-gray-600">Monitor all system activities</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h4 className="font-medium text-gray-900">User Management</h4>
        <p className="text-sm text-gray-600">Manage all user accounts</p>
      </div>
    </div>
  </div>
);

const ManagerDashboard: React.FC = () => (
  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
    <h3 className="text-lg font-semibold text-blue-800 mb-4">Manager Dashboard</h3>
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h4 className="font-medium text-gray-900">Team Overview</h4>
        <p className="text-sm text-gray-600">Monitor team performance</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h4 className="font-medium text-gray-900">Project Status</h4>
        <p className="text-sm text-gray-600">Track project progress</p>
      </div>
    </div>
  </div>
);

const EmployeeDashboard: React.FC = () => (
  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
    <h3 className="text-lg font-semibold text-green-800 mb-4">Employee Dashboard</h3>
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h4 className="font-medium text-gray-900">My Tasks</h4>
        <p className="text-sm text-gray-600">View assigned tasks</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h4 className="font-medium text-gray-900">Time Tracking</h4>
        <p className="text-sm text-gray-600">Log your work hours</p>
      </div>
    </div>
  </div>
);

// Role-based action buttons
const RoleBasedActions: React.FC = () => {
  const { user } = useAuth();

  const getActionsByRole = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return [
          { label: 'System Settings', icon: '⚙️', color: 'bg-red-600 hover:bg-red-700' },
          { label: 'User Management', icon: '👥', color: 'bg-purple-600 hover:bg-purple-700' },
          { label: 'System Backup', icon: '💾', color: 'bg-blue-600 hover:bg-blue-700' },
          { label: 'Security Audit', icon: '🛡️', color: 'bg-orange-600 hover:bg-orange-700' }
        ];
      case 'manager':
        return [
          { label: 'Team Management', icon: '👥', color: 'bg-blue-600 hover:bg-blue-700' },
          { label: 'Project Planning', icon: '📋', color: 'bg-green-600 hover:bg-green-700' },
          { label: 'Performance Review', icon: '📊', color: 'bg-purple-600 hover:bg-purple-700' },
          { label: 'Resource Allocation', icon: '📈', color: 'bg-indigo-600 hover:bg-indigo-700' }
        ];
      case 'employee':
        return [
          { label: 'View Tasks', icon: '✅', color: 'bg-green-600 hover:bg-green-700' },
          { label: 'Time Tracking', icon: '⏰', color: 'bg-blue-600 hover:bg-blue-700' },
          { label: 'Submit Report', icon: '📝', color: 'bg-purple-600 hover:bg-purple-700' },
          { label: 'Request Leave', icon: '🏖️', color: 'bg-orange-600 hover:bg-orange-700' }
        ];
      default:
        return [];
    }
  };

  const actions = getActionsByRole(user?.role || 'employee');

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <button
          key={index}
          className={`${action.color} text-white p-4 rounded-lg transition-colors duration-200 flex flex-col items-center space-y-2`}
        >
          <span className="text-2xl">{action.icon}</span>
          <span className="text-sm font-medium">{action.label}</span>
        </button>
      ))}
    </div>
  );
};

// Role-based navigation tabs
const RoleBasedTabs: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState('overview');

  const getTabsByRole = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return [
          { id: 'overview', label: 'System Overview', icon: '📊' },
          { id: 'users', label: 'User Management', icon: '👥' },
          { id: 'security', label: 'Security', icon: '🛡️' },
          { id: 'analytics', label: 'Analytics', icon: '📈' }
        ];
      case 'manager':
        return [
          { id: 'overview', label: 'Team Overview', icon: '👥' },
          { id: 'projects', label: 'Projects', icon: '📁' },
          { id: 'performance', label: 'Performance', icon: '📊' },
          { id: 'reports', label: 'Reports', icon: '📋' }
        ];
      case 'employee':
        return [
          { id: 'overview', label: 'My Overview', icon: '👤' },
          { id: 'tasks', label: 'My Tasks', icon: '✅' },
          { id: 'time', label: 'Time Tracking', icon: '⏰' },
          { id: 'profile', label: 'Profile', icon: '👤' }
        ];
      default:
        return [];
    }
  };

  const tabs = getTabsByRole(user?.role || 'employee');

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="p-6">
        <p className="text-gray-600">Active tab: {activeTab}</p>
      </div>
    </div>
  );
};

// Main component demonstrating different UI patterns
export const RoleBasedUI: React.FC = () => {
  const { user } = useAuth();

  const getDashboardByRole = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <AdminDashboard />;
      case 'manager':
        return <ManagerDashboard />;
      case 'employee':
        return <EmployeeDashboard />;
      default:
        return <EmployeeDashboard />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Role-Based UI Examples</h1>
        <p className="text-gray-600">Different UI patterns for different user roles</p>
      </div>

      {/* 1. Different Dashboard Layouts */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">1. Role-Specific Dashboards</h2>
        {getDashboardByRole(user?.role || 'employee')}
      </div>

      {/* 2. Role-Based Action Buttons */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">2. Role-Based Actions</h2>
        <RoleBasedActions />
      </div>

      {/* 3. Role-Based Navigation Tabs */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">3. Role-Based Navigation</h2>
        <RoleBasedTabs />
      </div>

      {/* 4. Conditional UI Elements */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">4. Conditional UI Elements</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            {/* Always visible */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900">Basic Information</h4>
              <p className="text-sm text-gray-600">This is visible to all users</p>
            </div>

            {/* Manager and Admin only */}
            {(user?.role === 'manager' || user?.role === 'admin') && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900">Management Tools</h4>
                <p className="text-sm text-blue-700">Only managers and admins can see this</p>
              </div>
            )}

            {/* Admin only */}
            {user?.role === 'admin' && (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h4 className="font-medium text-red-900">Administrative Controls</h4>
                <p className="text-sm text-red-700">Only admins can see this section</p>
              </div>
            )}

            {/* Employee specific */}
            {user?.role === 'employee' && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900">Employee Tools</h4>
                <p className="text-sm text-green-700">Only employees can see this section</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. Different Data Visualizations */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">5. Role-Based Data Views</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {user?.role === 'admin' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-medium text-gray-900 mb-4">System Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">CPU Usage</span>
                  <span className="text-sm font-medium">45%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Memory</span>
                  <span className="text-sm font-medium">62%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Storage</span>
                  <span className="text-sm font-medium">78%</span>
                </div>
              </div>
            </div>
          )}

          {(user?.role === 'manager' || user?.role === 'admin') && (
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-medium text-gray-900 mb-4">Team Performance</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Team Members</span>
                  <span className="text-sm font-medium">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Projects</span>
                  <span className="text-sm font-medium">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <span className="text-sm font-medium">92%</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-medium text-gray-900 mb-4">
              {user?.role === 'employee' ? 'My Progress' : 'General Stats'}
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  {user?.role === 'employee' ? 'Tasks Completed' : 'Total Tasks'}
                </span>
                <span className="text-sm font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  {user?.role === 'employee' ? 'Hours Logged' : 'Total Hours'}
                </span>
                <span className="text-sm font-medium">32</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Performance</span>
                <span className="text-sm font-medium">88%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 