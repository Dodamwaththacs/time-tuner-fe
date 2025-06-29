import React, { useMemo, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/Layout';
import type { UserRole } from '../contexts/AuthContext';

// Types for better type safety
interface DashboardStat {
  label: string;
  value: string;
  change: string;
  color: string;
  trend: 'up' | 'down' | 'neutral';
}

interface RecentActivity {
  id: string;
  action: string;
  time: string;
  type: ActivityType;
  priority: 'high' | 'medium' | 'low';
}

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  color: string;
  action: string;
  disabled?: boolean;
}

type ActivityType = 
  | 'user' | 'system' | 'schedule' | 'optimization' | 'swap' 
  | 'availability' | 'coverage' | 'shift' | 'training' | 'overtime' 
  | 'preferences' | 'budget' | 'compliance' | 'review';

// Constants
const ACTIVITY_ICONS: Record<ActivityType, string> = {
  user: '👤',
  system: '⚙️',
  schedule: '📅',
  optimization: '🎯',
  swap: '🔄',
  availability: '✅',
  coverage: '🛡️',
  shift: '⏰',
  training: '📚',
  overtime: '⏳',
  preferences: '⚙️',
  budget: '💰',
  compliance: '📋',
  review: '📊'
};

const ROLE_COLORS = {
  admin: 'purple',
  manager: 'blue',
  employee: 'green'
} as const;

// Utility functions
const formatChange = (change: string, trend: 'up' | 'down' | 'neutral') => {
  const isPositive = trend === 'up';
  const colorClass = isPositive ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';
  const symbol = isPositive ? '↗' : trend === 'down' ? '↘' : '→';
  
  return { colorClass, symbol };
};

// Data generation functions
const getDashboardStatsByRole = (role: UserRole): DashboardStat[] => {
  switch (role) {
    case 'admin':
      return [
        { 
          label: 'Total Staff', 
          value: '156', 
          change: '+8', 
          color: 'text-blue-600', 
          trend: 'up' 
        },
        { 
          label: 'Active Shifts', 
          value: '24', 
          change: '+3', 
          color: 'text-green-600', 
          trend: 'up' 
        },
        { 
          label: 'Schedule Coverage', 
          value: '98.5%', 
          change: '+2.1%', 
          color: 'text-purple-600', 
          trend: 'up' 
        },
        { 
          label: 'Overtime Hours', 
          value: '45.2h', 
          change: '-12%', 
          color: 'text-orange-600', 
          trend: 'down' 
        }
      ];
    case 'manager':
      return [
        { 
          label: 'Team Members', 
          value: '18', 
          change: '+2', 
          color: 'text-blue-600', 
          trend: 'up' 
        },
        { 
          label: 'Weekly Shifts', 
          value: '84', 
          change: '+5', 
          color: 'text-green-600', 
          trend: 'up' 
        },
        { 
          label: 'Schedule Conflicts', 
          value: '3', 
          change: '-2', 
          color: 'text-purple-600', 
          trend: 'down' 
        },
        { 
          label: 'Staff Satisfaction', 
          value: '92%', 
          change: '+3%', 
          color: 'text-orange-600', 
          trend: 'up' 
        }
      ];
    case 'employee':
      return [
        { 
          label: 'My Shifts', 
          value: '12', 
          change: '+2', 
          color: 'text-blue-600', 
          trend: 'up' 
        },
        { 
          label: 'Hours This Week', 
          value: '32', 
          change: '+5', 
          color: 'text-green-600', 
          trend: 'up' 
        },
        { 
          label: 'Swap Requests', 
          value: '2', 
          change: '+1', 
          color: 'text-purple-600', 
          trend: 'up' 
        },
        { 
          label: 'Performance Score', 
          value: '88%', 
          change: '+2%', 
          color: 'text-orange-600', 
          trend: 'up' 
        }
      ];
    default:
      return [];
  }
};

const getRecentActivityByRole = (role: UserRole): RecentActivity[] => {
  switch (role) {
    case 'admin':
      return [
        { 
          id: 'admin-1',
          action: 'OptaPlanner optimization completed successfully', 
          time: '2 minutes ago', 
          type: 'system',
          priority: 'high'
        },
        { 
          id: 'admin-2',
          action: 'New nurse registered in system', 
          time: '5 minutes ago', 
          type: 'user',
          priority: 'medium'
        },
        { 
          id: 'admin-3',
          action: 'Schedule conflict resolved automatically', 
          time: '10 minutes ago', 
          type: 'schedule',
          priority: 'high'
        },
        { 
          id: 'admin-4',
          action: 'Department coverage optimized', 
          time: '15 minutes ago', 
          type: 'optimization',
          priority: 'medium'
        },
        { 
          id: 'admin-5',
          action: 'Overtime budget updated', 
          time: '1 hour ago', 
          type: 'budget',
          priority: 'low'
        },
        { 
          id: 'admin-6',
          action: 'Staff certification verified', 
          time: '2 hours ago', 
          type: 'compliance',
          priority: 'medium'
        }
      ];
    case 'manager':
      return [
        { 
          id: 'mgr-1',
          action: 'Team schedule published for next week', 
          time: '30 minutes ago', 
          type: 'schedule',
          priority: 'high'
        },
        { 
          id: 'mgr-2',
          action: 'Shift swap request approved', 
          time: '1 hour ago', 
          type: 'swap',
          priority: 'medium'
        },
        { 
          id: 'mgr-3',
          action: 'OptaPlanner constraints updated', 
          time: '2 hours ago', 
          type: 'optimization',
          priority: 'medium'
        },
        { 
          id: 'mgr-4',
          action: 'Staff availability updated', 
          time: '3 hours ago', 
          type: 'availability',
          priority: 'low'
        },
        { 
          id: 'mgr-5',
          action: 'Coverage gap identified and resolved', 
          time: '4 hours ago', 
          type: 'coverage',
          priority: 'high'
        },
        { 
          id: 'mgr-6',
          action: 'Performance review scheduled', 
          time: '1 day ago', 
          type: 'review',
          priority: 'low'
        }
      ];
    case 'employee':
      return [
        { 
          id: 'emp-1',
          action: 'Night shift completed successfully', 
          time: '30 minutes ago', 
          type: 'shift',
          priority: 'medium'
        },
        { 
          id: 'emp-2',
          action: 'Availability updated for next week', 
          time: '2 hours ago', 
          type: 'availability',
          priority: 'low'
        },
        { 
          id: 'emp-3',
          action: 'Swap request submitted and pending', 
          time: '4 hours ago', 
          type: 'swap',
          priority: 'medium'
        },
        { 
          id: 'emp-4',
          action: 'Training session completed', 
          time: '1 day ago', 
          type: 'training',
          priority: 'low'
        },
        { 
          id: 'emp-5',
          action: 'Overtime hours logged', 
          time: '1 day ago', 
          type: 'overtime',
          priority: 'medium'
        },
        { 
          id: 'emp-6',
          action: 'Schedule preferences updated', 
          time: '2 days ago', 
          type: 'preferences',
          priority: 'low'
        }
      ];
    default:
      return [];
  }
};

const getQuickActionsByRole = (role: UserRole): QuickAction[] => {
  switch (role) {
    case 'admin':
      return [
        { 
          id: 'admin-opt',
          label: 'Run OptaPlanner', 
          icon: '🎯', 
          color: 'bg-purple-600 hover:bg-purple-700', 
          action: 'optimize' 
        },
        { 
          id: 'admin-staff',
          label: 'Staff Management', 
          icon: '👥', 
          color: 'bg-blue-600 hover:bg-blue-700', 
          action: 'staff' 
        },
        { 
          id: 'admin-settings',
          label: 'System Settings', 
          icon: '⚙️', 
          color: 'bg-gray-600 hover:bg-gray-700', 
          action: 'settings' 
        },
        { 
          id: 'admin-reports',
          label: 'Generate Reports', 
          icon: '📈', 
          color: 'bg-green-600 hover:bg-green-700', 
          action: 'reports' 
        }
      ];
    case 'manager':
      return [
        { 
          id: 'mgr-publish',
          label: 'Publish Schedule', 
          icon: '📅', 
          color: 'bg-blue-600 hover:bg-blue-700', 
          action: 'publish' 
        },
        { 
          id: 'mgr-review',
          label: 'Review Requests', 
          icon: '📋', 
          color: 'bg-green-600 hover:bg-green-700', 
          action: 'review' 
        },
        { 
          id: 'mgr-team',
          label: 'Team Overview', 
          icon: '👥', 
          color: 'bg-purple-600 hover:bg-purple-700', 
          action: 'team' 
        },
        { 
          id: 'mgr-optimize',
          label: 'Optimize Shifts', 
          icon: '🎯', 
          color: 'bg-orange-600 hover:bg-orange-700', 
          action: 'optimize' 
        }
      ];
    case 'employee':
      return [
        { 
          id: 'emp-schedule',
          label: 'View Schedule', 
          icon: '📅', 
          color: 'bg-blue-600 hover:bg-blue-700', 
          action: 'schedule' 
        },
        { 
          id: 'emp-swap',
          label: 'Request Swap', 
          icon: '🔄', 
          color: 'bg-green-600 hover:bg-green-700', 
          action: 'swap' 
        },
        { 
          id: 'emp-availability',
          label: 'Update Availability', 
          icon: '✅', 
          color: 'bg-purple-600 hover:bg-purple-700', 
          action: 'availability' 
        },
        { 
          id: 'emp-hours',
          label: 'Log Hours', 
          icon: '⏰', 
          color: 'bg-orange-600 hover:bg-orange-700', 
          action: 'hours' 
        }
      ];
    default:
      return [];
  }
};

// Components
const StatCard: React.FC<{ stat: DashboardStat }> = ({ stat }) => {
  const { colorClass, symbol } = formatChange(stat.change, stat.trend);
  
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
          <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
        </div>
        <div className="text-right ml-4">
          <div className={`flex items-center ${colorClass} text-sm font-medium`}>
            <span className="mr-1">{symbol}</span>
            <span>{stat.change}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActivityItem: React.FC<{ activity: RecentActivity }> = ({ activity }) => {
  const priorityColor = {
    high: 'border-l-red-500',
    medium: 'border-l-yellow-500',
    low: 'border-l-green-500'
  }[activity.priority];

  return (
    <div className={`flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg border-l-4 ${priorityColor} transition-colors duration-150`}>
      <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
        <span className="text-sm" role="img" aria-label={activity.type}>
          {ACTIVITY_ICONS[activity.type]}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 leading-relaxed">{activity.action}</p>
        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
      </div>
    </div>
  );
};

const QuickActionButton: React.FC<{ action: QuickAction; onClick: (actionId: string) => void }> = ({ 
  action, 
  onClick 
}) => {
  return (
    <button
      onClick={() => onClick(action.action)}
      disabled={action.disabled}
      className={`${action.color} text-white px-4 py-3 rounded-lg transition-all duration-200 
                 flex flex-col items-center space-y-2 disabled:opacity-50 disabled:cursor-not-allowed
                 hover:transform hover:-translate-y-0.5 hover:shadow-lg`}
      aria-label={action.label}
    >
      <span className="text-2xl" role="img" aria-hidden="true">{action.icon}</span>
      <span className="text-sm font-medium text-center">{action.label}</span>
    </button>
  );
};

const SchedulePreview: React.FC<{ role: UserRole }> = ({ role }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const getScheduleData = (dayIndex: number) => {
    if (role === 'employee') {
      return dayIndex < 5 ? 'Day Shift' : 'Off';
    }
    // For admin/manager, show staff count
    return `${Math.floor(Math.random() * 20) + 15} staff`;
  };

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day, index) => (
        <div key={day} className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150">
          <p className="text-sm font-medium text-gray-900 mb-1">{day}</p>
          <p className="text-xs text-gray-600">
            {getScheduleData(index)}
          </p>
        </div>
      ))}
    </div>
  );
};

const OptaPlannerStatus: React.FC = () => {
  const metrics = [
    { label: 'Schedule Coverage', value: '98.5%', color: 'text-blue-600' },
    { label: 'Optimization Time', value: '2.3s', color: 'text-green-600' },
    { label: 'Constraints Met', value: '156', color: 'text-purple-600' }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">OptaPlanner Optimization Status</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            Active
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
            <p className={`text-2xl font-bold ${metric.color} mb-1`}>{metric.value}</p>
            <p className="text-sm text-gray-600">{metric.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Dashboard Component
export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const userRole = user?.role || 'employee';

  // Memoized data to prevent unnecessary re-calculations
  const stats = useMemo(() => getDashboardStatsByRole(userRole), [userRole]);
  const activities = useMemo(() => getRecentActivityByRole(userRole), [userRole]);
  const quickActions = useMemo(() => getQuickActionsByRole(userRole), [userRole]);

  // Event handlers
  const handleQuickAction = useCallback((actionId: string) => {
    console.log(`Executing action: ${actionId}`);
    // Here you would implement the actual action logic
    // For now, just logging for demonstration
  }, []);

  const getRoleDisplayName = (role: UserRole) => {
    const roleNames = {
      admin: 'System Administrator',
      manager: 'Department Manager',
      employee: 'Healthcare Professional'
    };
    return roleNames[role] || 'User';
  };

  const getWelcomeMessage = (role: UserRole) => {
    const messages = {
      admin: 'Monitor system performance and optimize schedules with OptaPlanner.',
      manager: 'Manage your team schedules and review staff requests.',
      employee: 'View your schedule and manage your work preferences.'
    };
    return messages[role] || 'Welcome to your dashboard.';
  };

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Healthcare Roster Dashboard</h1>
              <p className="text-slate-600 mb-1">Welcome back, <span className="font-semibold text-slate-800">{user?.name}</span>!</p>
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <span className="inline-block px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-medium">
                  {getRoleDisplayName(userRole)}
                </span>
                <span className="text-xs text-green-500 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-1 inline-block"></span>
                  Online
                </span>
                <span className="text-xs">• Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">{getWelcomeMessage(userRole)}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={`${userRole}-stat-${index}`} stat={stat} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <span className="text-sm text-gray-500">
                  {activities.length} recent items
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {activities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <QuickActionButton 
                    key={action.id} 
                    action={action} 
                    onClick={handleQuickAction}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* OptaPlanner Status - Admin Only */}
        {userRole === 'admin' && (
          <div className="mb-8">
            <OptaPlannerStatus />
          </div>
        )}

        {/* Schedule Preview */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {userRole === 'employee' ? 'My Schedule This Week' : 'Department Schedule Overview'}
            </h2>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-150">
              View Full Schedule →
            </button>
          </div>
          <SchedulePreview role={userRole} />
        </div>

        {/* Performance Insights - Manager & Admin */}
        {(userRole === 'admin' || userRole === 'manager') && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">95.2%</p>
                <p className="text-sm text-gray-600">On-time Attendance</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">4.8/5</p>
                <p className="text-sm text-gray-600">Staff Satisfaction</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">12%</p>
                <p className="text-sm text-gray-600">Efficiency Gain</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">3.2h</p>
                <p className="text-sm text-gray-600">Avg. Overtime</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};