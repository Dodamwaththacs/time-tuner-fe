import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { UserRole } from '../../contexts/AuthContext';
import { 
  Shield, 
  Users, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Check, 
  AlertTriangle,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  UserCheck,
  Calendar,
  BarChart3,
  Building2,
  Clock,
  FileText,
  Target,
  Bell,
  MapPin,
  Award
} from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  admin: boolean;
  manager: boolean;
  employee: boolean;
}

interface Role {
  id: UserRole;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
  color: string;
}

export const RolesPermissions: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'roles' | 'permissions' | 'assignments'>('roles');
  const [editingRole, setEditingRole] = useState<UserRole | null>(null);
  const [showAddRole, setShowAddRole] = useState(false);

  const permissions: Permission[] = [
    // User Management
    { id: 'users.view', name: 'View Users', description: 'View user profiles and information', category: 'User Management', admin: true, manager: true, employee: false },
    { id: 'users.create', name: 'Create Users', description: 'Create new user accounts', category: 'User Management', admin: true, manager: false, employee: false },
    { id: 'users.edit', name: 'Edit Users', description: 'Modify user information', category: 'User Management', admin: true, manager: true, employee: false },
    { id: 'users.delete', name: 'Delete Users', description: 'Remove user accounts', category: 'User Management', admin: true, manager: false, employee: false },
    
    // Schedule Management
    { id: 'schedules.view', name: 'View Schedules', description: 'View work schedules', category: 'Schedule Management', admin: true, manager: true, employee: true },
    { id: 'schedules.create', name: 'Create Schedules', description: 'Create new schedules', category: 'Schedule Management', admin: true, manager: true, employee: false },
    { id: 'schedules.edit', name: 'Edit Schedules', description: 'Modify existing schedules', category: 'Schedule Management', admin: true, manager: true, employee: false },
    { id: 'schedules.delete', name: 'Delete Schedules', description: 'Remove schedules', category: 'Schedule Management', admin: true, manager: false, employee: false },
    
    // Reports
    { id: 'reports.view', name: 'View Reports', description: 'Access system reports', category: 'Reports', admin: true, manager: true, employee: false },
    { id: 'reports.create', name: 'Create Reports', description: 'Generate custom reports', category: 'Reports', admin: true, manager: true, employee: false },
    { id: 'reports.export', name: 'Export Reports', description: 'Export report data', category: 'Reports', admin: true, manager: true, employee: false },
    
    // System Settings
    { id: 'settings.view', name: 'View Settings', description: 'View system settings', category: 'System Settings', admin: true, manager: false, employee: false },
    { id: 'settings.edit', name: 'Edit Settings', description: 'Modify system settings', category: 'System Settings', admin: true, manager: false, employee: false },
    
    // Organization
    { id: 'org.view', name: 'View Organization', description: 'View organization structure', category: 'Organization', admin: true, manager: true, employee: true },
    { id: 'org.edit', name: 'Edit Organization', description: 'Modify organization structure', category: 'Organization', admin: true, manager: false, employee: false },
    
    // Time Tracking
    { id: 'time.view', name: 'View Time', description: 'View time tracking data', category: 'Time Tracking', admin: true, manager: true, employee: true },
    { id: 'time.edit', name: 'Edit Time', description: 'Modify time entries', category: 'Time Tracking', admin: true, manager: true, employee: false },
    { id: 'time.approve', name: 'Approve Time', description: 'Approve time-off requests', category: 'Time Tracking', admin: true, manager: true, employee: false },
  ];

  const roles: Role[] = [
    {
      id: 'admin',
      name: 'Administrator',
      description: 'Full system access with all permissions',
      userCount: 2,
      permissions: permissions.filter(p => p.admin).map(p => p.id),
      color: 'bg-red-100 text-red-800 border-red-200'
    },
    {
      id: 'manager',
      name: 'Manager',
      description: 'Department management with limited administrative access',
      userCount: 5,
      permissions: permissions.filter(p => p.manager).map(p => p.id),
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    {
      id: 'employee',
      name: 'Employee',
      description: 'Basic user access with personal schedule management',
      userCount: 25,
      permissions: permissions.filter(p => p.employee).map(p => p.id),
      color: 'bg-green-100 text-green-800 border-green-200'
    }
  ];

  const categories = [...new Set(permissions.map(p => p.category))];

  const getPermissionIcon = (permissionId: string) => {
    if (permissionId.includes('users')) return <Users className="w-4 h-4" />;
    if (permissionId.includes('schedules')) return <Calendar className="w-4 h-4" />;
    if (permissionId.includes('reports')) return <BarChart3 className="w-4 h-4" />;
    if (permissionId.includes('settings')) return <Settings className="w-4 h-4" />;
    if (permissionId.includes('org')) return <Building2 className="w-4 h-4" />;
    if (permissionId.includes('time')) return <Clock className="w-4 h-4" />;
    return <Shield className="w-4 h-4" />;
  };

  const hasPermission = (role: UserRole, permissionId: string) => {
    const permission = permissions.find(p => p.id === permissionId);
    return permission ? permission[role] : false;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Roles & Permissions</h1>
          <p className="text-gray-600 mt-1">Manage user roles and their associated permissions</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowAddRole(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Role
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'roles', name: 'Roles', icon: Shield },
            { id: 'permissions', name: 'Permissions Matrix', icon: Lock },
            { id: 'assignments', name: 'User Assignments', icon: UserCheck }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
              <div key={role.id} className="bg-white rounded-lg shadow border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Shield className="w-6 h-6 text-gray-600 mr-3" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${role.color}`}>
                          {role.userCount} users
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setEditingRole(role.id)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {role.id !== 'admin' && (
                        <button className="text-red-600 hover:text-red-900 p-1 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{role.description}</p>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Key Permissions:</div>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map((permissionId) => {
                        const permission = permissions.find(p => p.id === permissionId);
                        return (
                          <span key={permissionId} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700">
                            {getPermissionIcon(permissionId)}
                            <span className="ml-1">{permission?.name}</span>
                          </span>
                        );
                      })}
                      {role.permissions.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700">
                          +{role.permissions.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Permissions Matrix Tab */}
      {activeTab === 'permissions' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permission
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Manager
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <React.Fragment key={category}>
                    <tr className="bg-gray-50">
                      <td colSpan={4} className="px-6 py-3">
                        <h4 className="text-sm font-semibold text-gray-900">{category}</h4>
                      </td>
                    </tr>
                    {permissions
                      .filter(p => p.category === category)
                      .map((permission) => (
                        <tr key={permission.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getPermissionIcon(permission.id)}
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{permission.name}</div>
                                <div className="text-sm text-gray-500">{permission.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {permission.admin ? (
                              <Check className="w-5 h-5 text-green-600 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-red-600 mx-auto" />
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {permission.manager ? (
                              <Check className="w-5 h-5 text-green-600 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-red-600 mx-auto" />
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {permission.employee ? (
                              <Check className="w-5 h-5 text-green-600 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-red-600 mx-auto" />
                            )}
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Assignments Tab */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Role Distribution</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {roles.map((role) => (
                  <div key={role.id} className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${role.color.replace('bg-', 'bg-').replace(' text-', ' text-')} mb-4`}>
                      <Shield className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">{role.name}</h4>
                    <p className="text-3xl font-bold text-gray-900">{role.userCount}</p>
                    <p className="text-sm text-gray-600">users</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Role Changes</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { user: 'John Doe', from: 'Employee', to: 'Manager', date: '2024-01-15', by: 'Admin User' },
                  { user: 'Jane Smith', from: 'Manager', to: 'Employee', date: '2024-01-14', by: 'Admin User' },
                  { user: 'Bob Johnson', from: 'Employee', to: 'Manager', date: '2024-01-13', by: 'Admin User' }
                ].map((change, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                        <span className="text-sm font-medium text-gray-700">
                          {change.user.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{change.user}</div>
                        <div className="text-sm text-gray-600">
                          {change.from} → {change.to}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">{change.date}</div>
                      <div className="text-sm text-gray-500">by {change.by}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Role Modal */}
      {showAddRole && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Role</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role Name</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter role name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Enter role description"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddRole(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create Role
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 