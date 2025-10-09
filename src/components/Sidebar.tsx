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
  Paperclip,
  Menu,
  X,
  ChevronLeft
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
    path: '/employees/list',
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
      { label: 'Contract', path: '/master-data/contracts', icon: Paperclip, roles: ['admin'] },
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
      // { label: 'Optimization Engine', path: '/schedules/optimize', icon: Target, roles: ['manager'] },
      // { label: 'Schedule Builder Temp', path: '/schedules/builder-temp', icon: Plus, roles: ['manager'] }
    ]
  },
  {
    label: 'Team Management',
    path: '/team',
    icon: Users,
    roles: ['manager'],
    subItems: [
      { label: 'Employee Profiles', path: '/team/profiles', icon: Users, roles: ['manager'] },
      // { label: 'Skills Matrix', path: '/team/skills', icon: Award, roles: ['manager'] },
      // { label: 'Availability', path: '/team/availability', icon: Clock, roles: ['manager'] }
    ]
  },
  {
    label: 'Requests & Approvals',
    path: '/approvals/timeoff',
    icon: ClipboardList,
    roles: ['manager'],
    subItems: [
      { label: 'Time-off Requests', path: '/approvals/timeoff', icon: Calendar, roles: ['manager'] },
      // { label: 'Shift Swaps', path: '/approvals/swaps', icon: Clock, roles: ['manager'] },
      // { label: 'Overtime Requests', path: '/approvals/overtime', icon: TrendingUp, roles: ['manager'] }
    ]
  },
  // {
  //   label: 'Workforce Planning',
  //   path: '/planning',
  //   icon: Briefcase,
  //   roles: ['manager'],
  //   subItems: [
  //     { label: 'Demand Forecasting', path: '/planning/demand', icon: TrendingUp, roles: ['manager'] },
  //     { label: 'Staffing Requirements', path: '/planning/staffing', icon: Users, roles: ['manager'] },
  //     { label: 'Budget Planning', path: '/planning/budget', icon: BarChart3, roles: ['manager'] }
  //   ]
  // },

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
      { label: 'Manage Preferences', path: '/availability/preferences', icon: Calendar, roles: ['employee'] }
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
  // {
  //   label: 'Time Tracking',
  //   path: '/time-tracking',
  //   icon: Clock,
  //   roles: ['employee']
  // },

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user?.role || 'employee') &&
    (searchQuery === '' || item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
     item.subItems?.some(subItem => subItem.label.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
    // Close all expanded items when collapsing
    if (!isCollapsed) {
      setExpandedItems([]);
    }
  };

  const toggleExpanded = (path: string) => {
    if (isCollapsed) return; // Don't expand when collapsed
    
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

  const handleMouseEnter = (label: string) => {
    if (isCollapsed) {
      setShowTooltip(label);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(null);
  };

  return (
    <div className={`flex flex-col h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-2xl transition-all duration-300 ease-in-out relative ${
      isCollapsed ? 'w-16' : 'w-72'
    }`}>
      
      {/* Toggle Button */}
      <button
        onClick={toggleCollapsed}
        className="absolute -right-3 top-6 z-50 bg-slate-700 hover:bg-slate-600 text-white rounded-full p-1.5 shadow-lg border-2 border-slate-600 transition-all duration-200"
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
      </button>

      {/* Header */}
      <div className={`p-6 border-b border-slate-700/50 transition-all duration-300 ${isCollapsed ? 'p-4' : ''}`}>
        <div className={`text-2xl font-bold bg-gradient-to-r ${getRoleColor(user?.role || 'employee')} bg-clip-text text-transparent mb-2 transition-all duration-300 ${
          isCollapsed ? 'text-lg text-center' : ''
        }`}>
          {isCollapsed ? 'TT' : 'Time Tuner'}
        </div>
        
        {!isCollapsed && (
          <div className="flex items-center justify-between animate-fade-in">
            <div>
              <p className="text-sm text-slate-300 font-medium">{user?.name}</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(user?.role || 'employee')} mt-1`}>
                {(user?.role?.charAt(0)?.toUpperCase() ?? '') + (user?.role?.slice(1) ?? '')}
              </span>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="flex justify-center mt-2">
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getRoleColor(user?.role || 'employee')}`}></div>
          </div>
        )}
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="p-4 border-b border-slate-700/50 animate-fade-in">
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
      )}

      {/* Navigation */}
      <nav className={`flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent transition-all duration-300 ${
        isCollapsed ? 'p-2' : 'p-4'
      }`}>
        <ul className="space-y-1">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expandedItems.includes(item.path);
            const isItemActive = isActive(item.path);
            const hasActiveSubItem = isAnySubItemActive(item.subItems);

            return (
              <li key={item.path} className="relative">
                <div
                  className={`flex items-center justify-between rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                    isCollapsed ? 'px-2 py-3' : 'px-3 py-2.5'
                  } ${
                    isItemActive || hasActiveSubItem
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  {hasSubItems && !isCollapsed ? (
                    <button
                      onClick={() => toggleExpanded(item.path)}
                      className="flex items-center flex-1 text-left"
                    >
                      <Icon className={`flex-shrink-0 transition-all duration-200 ${
                        isCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'
                      }`} />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1">{item.label}</span>
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 transition-transform" />
                          ) : (
                            <ChevronRight className="w-4 h-4 transition-transform" />
                          )}
                        </>
                      )}
                    </button>
                  ) : (
                    <Link 
                      to={item.path} 
                      className="flex items-center flex-1"
                      onClick={() => isCollapsed && hasSubItems && toggleExpanded(item.path)}
                    >
                      <Icon className={`flex-shrink-0 transition-all duration-200 ${
                        isCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'
                      }`} />
                      {!isCollapsed && <span>{item.label}</span>}
                    </Link>
                  )}
                </div>

                {/* Tooltip for collapsed state */}
                {isCollapsed && showTooltip === item.label && (
                  <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 z-50 bg-slate-800 text-white px-3 py-2 rounded-lg shadow-lg border border-slate-600 whitespace-nowrap animate-fade-in">
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 border-l border-t border-slate-600 rotate-45"></div>
                    {item.label}
                    {hasSubItems && (
                      <div className="mt-2 pt-2 border-t border-slate-600">
                        {item.subItems?.map((subItem, index) => (
                          <div key={subItem.path} className="text-xs text-slate-300 py-1">
                            {subItem.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Sub Items */}
                {hasSubItems && isExpanded && !isCollapsed && (
                  <ul className="ml-4 mt-1 space-y-1 border-l-2 border-slate-600 pl-4 animate-slide-down">
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
      <div className={`border-t border-slate-700/50 transition-all duration-300 ${
        isCollapsed ? 'p-2' : 'p-4'
      }`}>
        <button
          onClick={logout}
          className={`w-full flex items-center rounded-lg text-sm font-medium text-slate-300 hover:bg-red-600/20 hover:text-red-200 transition-all duration-200 group ${
            isCollapsed ? 'px-2 py-3 justify-center' : 'px-3 py-2.5'
          }`}
          onMouseEnter={() => handleMouseEnter('Logout')}
          onMouseLeave={handleMouseLeave}
          title={isCollapsed ? 'Logout' : ''}
        >
          <LogOut className={`group-hover:text-red-400 transition-colors ${
            isCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'
          }`} />
          {!isCollapsed && <span>Logout</span>}
        </button>

        {/* Logout tooltip for collapsed state */}
        {isCollapsed && showTooltip === 'Logout' && (
          <div className="absolute left-full ml-2 bottom-4 z-50 bg-slate-800 text-white px-3 py-2 rounded-lg shadow-lg border border-slate-600 whitespace-nowrap animate-fade-in">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 border-l border-t border-slate-600 rotate-45"></div>
            Logout
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-down {
          from { 
            opacity: 0;
            transform: translateY(-10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};