import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Settings, 
  Calendar,
  ClipboardList,
  UserCheck,
  BarChart3,
  Clock,
  Bell,
  LogOut,
  ChevronDown,
  ChevronRight,
  Briefcase,
  Shield,
  Target,
  MapPin,
  Award,
  TrendingUp,
  Search,
  Plus,
  PaperclipIcon
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<any>;
  roles: UserRole[];
  subItems?: NavItem[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'manager', 'employee']
  },
  
  // Admin Navigation
  {
    label: 'Organization',
    path: '/organization',
    icon: Building2,
    roles: ['admin'],
    subItems: [
      { label: 'Departments', path: '/organization/departments', icon: Building2, roles: ['admin'] },
      { label: 'Locations', path: '/organization/locations', icon: MapPin, roles: ['admin'] },
      { label: 'Business Rules', path: '/organization/rules', icon: Shield, roles: ['admin'] }
    ]
  },
  {
    label: 'User Management',
    path: '/users',
    icon: Users,
    roles: ['admin'],
    subItems: [
      { label: 'All Users', path: '/users/list', icon: Users, roles: ['admin'] },
      { label: 'Roles & Permissions', path: '/users/roles', icon: Shield, roles: ['admin'] },
      { label: 'Add User', path: '/users/add', icon: Plus, roles: ['admin'] }
    ]
  },
  {
    label: 'Employee Management',
    path: '/employees',
    icon: Users,
    roles: ['admin'],
    subItems: [
      { label: 'All Employees', path: '/employees/list', icon: Users, roles: ['admin'] },
      { label: 'Roles & Permissions', path: '/employees/roles', icon: Shield, roles: ['admin'] },
      { label: 'Add Employee', path: '/employees/add', icon: Plus, roles: ['admin'] }
    ]
  },
  {
    label: 'Master Data',
    path: '/master-data',
    icon: Settings,
    roles: ['admin'],
    subItems: [
      { label: 'Skills Management', path: '/master-data/skills', icon: Award, roles: ['admin'] },
      { label: 'Shift Templates', path: '/master-data/shifts', icon: Clock, roles: ['admin'] },
      { label: 'Contract', path: '/master-data/contracts', icon: PaperclipIcon, roles: ['admin'] },
      { label: 'Holiday Calendar', path: '/master-data/holidays', icon: Calendar, roles: ['admin'] }
    ]
  },
  {
    label: 'System Config',
    path: '/system',
    icon: Settings,
    roles: ['admin'],
    subItems: [
      { label: 'OptaPlanner Settings', path: '/system/optaplanner', icon: Target, roles: ['admin'] },
      { label: 'Optimization Rules', path: '/system/rules', icon: Shield, roles: ['admin'] },
      { label: 'Performance', path: '/system/performance', icon: TrendingUp, roles: ['admin'] }
    ]
  },

  // Manager Navigation
  {
    label: 'Schedule Management',
    path: '/schedules',
    icon: Calendar,
    roles: ['manager'],
    subItems: [
      { label: 'Current Schedules', path: '/schedules/current', icon: Calendar, roles: ['manager'] },
      { label: 'Schedule Builder', path: '/schedules/builder', icon: Plus, roles: ['manager'] },
      { label: 'Optimization Engine', path: '/schedules/optimize', icon: Target, roles: ['manager'] }
    ]
  },
  {
    label: 'Team Management',
    path: '/team',
    icon: Users,
    roles: ['manager'],
    subItems: [
      { label: 'Employee Profiles', path: '/team/profiles', icon: Users, roles: ['manager'] },
      { label: 'Skills Matrix', path: '/team/skills', icon: Award, roles: ['manager'] },
      { label: 'Availability', path: '/team/availability', icon: Clock, roles: ['manager'] }
    ]
  },
  {
    label: 'Requests & Approvals',
    path: '/approvals',
    icon: ClipboardList,
    roles: ['manager'],
    subItems: [
      { label: 'Time-off Requests', path: '/approvals/timeoff', icon: Calendar, roles: ['manager'] },
      { label: 'Shift Swaps', path: '/approvals/swaps', icon: Clock, roles: ['manager'] },
      { label: 'Overtime Requests', path: '/approvals/overtime', icon: TrendingUp, roles: ['manager'] }
    ]
  },
  {
    label: 'Workforce Planning',
    path: '/planning',
    icon: Briefcase,
    roles: ['manager'],
    subItems: [
      { label: 'Demand Forecasting', path: '/planning/demand', icon: TrendingUp, roles: ['manager'] },
      { label: 'Staffing Requirements', path: '/planning/staffing', icon: Users, roles: ['manager'] },
      { label: 'Budget Planning', path: '/planning/budget', icon: BarChart3, roles: ['manager'] }
    ]
  },

  // Employee Navigation
  {
    label: 'My Schedule',
    path: '/my-schedule',
    icon: Calendar,
    roles: ['employee']
  },
  {
    label: 'Availability',
    path: '/availability',
    icon: Clock,
    roles: ['employee'],
    subItems: [
      { label: 'Set Availability', path: '/availability/set', icon: Clock, roles: ['employee'] },
      { label: 'Time-off Requests', path: '/availability/timeoff', icon: Calendar, roles: ['employee'] }
    ]
  },
  {
    label: 'Shift Management',
    path: '/shifts',
    icon: UserCheck,
    roles: ['employee'],
    subItems: [
      { label: 'Shift Swaps', path: '/shifts/swaps', icon: Clock, roles: ['employee'] },
      { label: 'Available Shifts', path: '/shifts/available', icon: Plus, roles: ['employee'] }
    ]
  },
  {
    label: 'My Profile',
    path: '/profile',
    icon: Users,
    roles: ['employee']
  },
  {
    label: 'Time Tracking',
    path: '/time-tracking',
    icon: Clock,
    roles: ['employee']
  },

  // Common Navigation
  {
    label: 'Reports',
    path: '/reports',
    icon: BarChart3,
    roles: ['admin', 'manager']
  },
  {
    label: 'Notifications',
    path: '/notifications',
    icon: Bell,
    roles: ['admin', 'manager', 'employee']
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: Settings,
    roles: ['admin', 'manager', 'employee']
  }
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user?.role || 'employee') &&
    (searchQuery === '' || item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
     item.subItems?.some(subItem => subItem.label.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const toggleExpanded = (path: string) => {
    setExpandedItems(prev => 
      prev.includes(path) 
        ? prev.filter(item => item !== path)
        : [...prev, path]
    );
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const isAnySubItemActive = (subItems?: NavItem[]) => {
    return subItems?.some(item => isActive(item.path)) || false;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'from-red-500 to-red-600';
      case 'manager': return 'from-blue-500 to-blue-600';
      case 'employee': return 'from-green-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'manager': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'employee': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white w-72 shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className={`text-2xl font-bold bg-gradient-to-r ${getRoleColor(user?.role || 'employee')} bg-clip-text text-transparent mb-2`}>
          Time Tuner
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-300 font-medium">{user?.name}</p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(user?.role || 'employee')} mt-1`}>
              {(user?.role?.charAt(0)?.toUpperCase() ?? '') + (user?.role?.slice(1) ?? '')}
            </span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search navigation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
        <ul className="space-y-1">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expandedItems.includes(item.path);
            const isItemActive = isActive(item.path);
            const hasActiveSubItem = isAnySubItemActive(item.subItems);

            return (
              <li key={item.path}>
                <div
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    isItemActive || hasActiveSubItem
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  {hasSubItems ? (
                    <button
                      onClick={() => toggleExpanded(item.path)}
                      className="flex items-center flex-1 text-left"
                    >
                      <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 transition-transform" />
                      ) : (
                        <ChevronRight className="w-4 h-4 transition-transform" />
                      )}
                    </button>
                  ) : (
                    <Link to={item.path} className="flex items-center flex-1">
                      <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  )}
                </div>

                {/* Sub Items */}
                {hasSubItems && isExpanded && (
                  <ul className="ml-4 mt-1 space-y-1 border-l-2 border-slate-600 pl-4">
                    {item.subItems?.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isSubItemActive = isActive(subItem.path);

                      return (
                        <li key={subItem.path}>
                          <Link
                            to={subItem.path}
                            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                              isSubItemActive
                                ? 'bg-blue-600/20 text-blue-200 border-l-2 border-blue-400'
                                : 'text-slate-400 hover:bg-slate-700/30 hover:text-slate-200'
                            }`}
                          >
                            <SubIcon className="w-4 h-4 mr-3 flex-shrink-0" />
                            {subItem.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50">
        <button
          onClick={logout}
          className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-red-600/20 hover:text-red-200 transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 mr-3 group-hover:text-red-400 transition-colors" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};