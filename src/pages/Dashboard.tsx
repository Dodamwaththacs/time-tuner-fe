import React, { useMemo, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/Layout';
import { Calendar, Clock, Users, Activity, ArrowRight, CheckCircle, AlertCircle, TrendingUp, Plus } from 'lucide-react';
import type { UserRole } from '../contexts/AuthContext';

// Simplified types for better readability
interface DashboardStat {
  label: string;
  value: string;
  change?: string;
  icon: React.ComponentType<any>;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  action: string;
  description: string;
}

interface ActivityItem {
  id: string;
  title: string;
  time: string;
  type: 'success' | 'warning' | 'info';
  description: string;
}

// Data for different user roles
const getWelcomeMessage = (role: UserRole, name: string) => {
  const messages = {
    admin: `Welcome back, ${name}! Here's your system overview.`,
    manager: `Hello ${name}! Here's your team dashboard.`,
    employee: `Hi ${name}! Here's your schedule overview.`
  };
  return messages[role] || `Welcome, ${name}!`;
};

const getDashboardStatsByRole = (role: UserRole): DashboardStat[] => {
  switch (role) {
    case 'admin':
      return [
        { 
          label: 'Total Staff', 
          value: '156', 
          icon: Users,
          color: 'bg-blue-500 text-white'
        },
        { 
          label: 'Active Shifts', 
          value: '24', 
          icon: Clock,
          color: 'bg-green-500 text-white'
        },
        { 
          label: 'Coverage', 
          value: '98.5%', 
          icon: CheckCircle,
          color: 'bg-purple-500 text-white'
        },
        { 
          label: 'Performance', 
          value: 'Excellent', 
          icon: TrendingUp,
          color: 'bg-orange-500 text-white'
        }
      ];
    case 'manager':
      return [
        { 
          label: 'Team Size', 
          value: '18', 
          icon: Users,
          color: 'bg-blue-500 text-white'
        },
        { 
          label: 'This Week', 
          value: '84 shifts', 
          icon: Calendar,
          color: 'bg-green-500 text-white'
        },
        { 
          label: 'Pending', 
          value: '3 requests', 
          icon: AlertCircle,
          color: 'bg-orange-500 text-white'
        },
        { 
          label: 'Team Rating', 
          value: '4.8/5', 
          icon: TrendingUp,
          color: 'bg-purple-500 text-white'
        }
      ];
    case 'employee':
      return [
        { 
          label: 'My Shifts', 
          value: '5', 
          icon: Calendar,
          color: 'bg-blue-500 text-white'
        },
        { 
          label: 'This Week', 
          value: '32 hours', 
          icon: Clock,
          color: 'bg-green-500 text-white'
        },
        { 
          label: 'Next Shift', 
          value: 'Tomorrow', 
          icon: AlertCircle,
          color: 'bg-orange-500 text-white'
        },
        { 
          label: 'Rating', 
          value: '4.8/5', 
          icon: TrendingUp,
          color: 'bg-purple-500 text-white'
        }
      ];
    default:
      return [];
  }
};

const getRecentActivityByRole = (role: UserRole): ActivityItem[] => {
  switch (role) {
    case 'admin':
      return [
        { 
          id: 'admin-1',
          title: 'System Optimization Completed',
          description: 'Schedule optimization finished successfully',
          time: '2 minutes ago', 
          type: 'success'
        },
        { 
          id: 'admin-2',
          title: 'New Staff Member Added',
          description: 'Jessica Martinez joined the nursing team',
          time: '1 hour ago', 
          type: 'info'
        },
        { 
          id: 'admin-3',
          title: 'Schedule Conflict Resolved',
          description: 'Automatic conflict resolution applied',
          time: '3 hours ago', 
          type: 'success'
        }
      ];
    case 'manager':
      return [
        { 
          id: 'mgr-1',
          title: 'Weekly Schedule Published',
          description: 'Next week\'s schedule is now available',
          time: '30 minutes ago', 
          type: 'success'
        },
        { 
          id: 'mgr-2',
          title: 'Shift Swap Approved',
          description: 'Request from Sarah Johnson approved',
          time: '2 hours ago', 
          type: 'info'
        },
        { 
          id: 'mgr-3',
          title: 'Coverage Alert',
          description: 'Low coverage detected for Friday night',
          time: '4 hours ago', 
          type: 'warning'
        }
      ];
    case 'employee':
      return [
        { 
          id: 'emp-1',
          title: 'Shift Completed',
          description: 'Successfully completed night shift',
          time: '30 minutes ago', 
          type: 'success'
        },
        { 
          id: 'emp-2',
          title: 'Availability Updated',
          description: 'Your availability preferences were saved',
          time: '2 hours ago', 
          type: 'info'
        },
        { 
          id: 'emp-3',
          title: 'Swap Request Pending',
          description: 'Your shift swap request is under review',
          time: '1 day ago', 
          type: 'warning'
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
          id: 'admin-staff',
          label: 'Manage Staff', 
          icon: Users, 
          color: 'bg-blue-600 hover:bg-blue-700', 
          action: 'staff',
          description: 'Add, edit, or view staff members'
        },
        { 
          id: 'admin-schedules',
          label: 'View Schedules', 
          icon: Calendar, 
          color: 'bg-green-600 hover:bg-green-700', 
          action: 'schedules',
          description: 'Review and manage all schedules'
        },
        { 
          id: 'admin-reports',
          label: 'Generate Reports', 
          icon: Activity, 
          color: 'bg-purple-600 hover:bg-purple-700', 
          action: 'reports',
          description: 'Create performance and analytics reports'
        }
      ];
    case 'manager':
      return [
        { 
          id: 'mgr-schedule',
          label: 'Build Schedule', 
          icon: Calendar, 
          color: 'bg-blue-600 hover:bg-blue-700', 
          action: 'schedule',
          description: 'Create and publish team schedules'
        },
        { 
          id: 'mgr-team',
          label: 'Team Overview', 
          icon: Users, 
          color: 'bg-green-600 hover:bg-green-700', 
          action: 'team',
          description: 'View team performance and availability'
        },
        { 
          id: 'mgr-requests',
          label: 'Review Requests', 
          icon: AlertCircle, 
          color: 'bg-orange-600 hover:bg-orange-700', 
          action: 'requests',
          description: 'Approve or deny time-off and swap requests'
        }
      ];
    case 'employee':
      return [
        { 
          id: 'emp-schedule',
          label: 'My Schedule', 
          icon: Calendar, 
          color: 'bg-blue-600 hover:bg-blue-700', 
          action: 'schedule',
          description: 'View your upcoming shifts'
        },
        { 
          id: 'emp-availability',
          label: 'Set Availability', 
          icon: Clock, 
          color: 'bg-green-600 hover:bg-green-700', 
          action: 'availability',
          description: 'Update your available times'
        },
        { 
          id: 'emp-swap',
          label: 'Request Swap', 
          icon: ArrowRight, 
          color: 'bg-purple-600 hover:bg-purple-700', 
          action: 'swap',
          description: 'Request to swap shifts with colleagues'
        }
      ];
    default:
      return [];
  }
};

// Simplified Components
const StatCard: React.FC<{ stat: DashboardStat }> = ({ stat }) => {
  const Icon = stat.icon;
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{stat.label}</p>
          <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
        </div>
        <div className={`p-3 rounded-lg ${stat.color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const ActivityCard: React.FC<{ activity: ActivityItem }> = ({ activity }) => {
  const getIcon = () => {
    switch (activity.type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info': return <Activity className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="flex items-start space-x-3 p-4 hover:bg-gray-50 rounded-lg transition-colors duration-150">
      <div className="flex-shrink-0 mt-1">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900">{activity.title}</p>
        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
      </div>
    </div>
  );
};

const QuickActionCard: React.FC<{ action: QuickAction; onClick: (actionId: string) => void }> = ({ 
  action, 
  onClick 
}) => {
  const Icon = action.icon;
  
  return (
    <button
      onClick={() => onClick(action.action)}
      className={`${action.color} text-white p-6 rounded-xl transition-all duration-200 
                 text-left w-full hover:transform hover:-translate-y-1 hover:shadow-lg group`}
    >
      <div className="flex items-center justify-between mb-3">
        <Icon className="w-6 h-6" />
        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <h3 className="font-semibold text-lg mb-1">{action.label}</h3>
      <p className="text-sm opacity-90">{action.description}</p>
    </button>
  );
};

const WeeklySchedule: React.FC<{ role: UserRole }> = ({ role }) => {
  const days = [
    { name: 'Mon', date: '18', shift: role === 'employee' ? 'Day Shift' : '15 staff' },
    { name: 'Tue', date: '19', shift: role === 'employee' ? 'Off' : '12 staff' },
    { name: 'Wed', date: '20', shift: role === 'employee' ? 'Night Shift' : '18 staff' },
    { name: 'Thu', date: '21', shift: role === 'employee' ? 'Day Shift' : '20 staff' },
    { name: 'Fri', date: '22', shift: role === 'employee' ? 'Evening' : '14 staff' },
    { name: 'Sat', date: '23', shift: role === 'employee' ? 'Off' : '10 staff' },
    { name: 'Sun', date: '24', shift: role === 'employee' ? 'Off' : '8 staff' },
  ];

  return (
    <div className="grid grid-cols-7 gap-3">
      {days.map((day) => (
        <div key={day.name} className={`text-center p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
          day.shift === 'Off' ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
        }`}>
          <p className="font-semibold text-gray-900">{day.name}</p>
          <p className="text-2xl font-bold text-gray-800 my-1">{day.date}</p>
          <p className={`text-xs font-medium ${day.shift === 'Off' ? 'text-gray-500' : 'text-blue-600'}`}>
            {day.shift}
          </p>
        </div>
      ))}
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
  }, []);

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {getWelcomeMessage(userRole, user?.name || 'User')}
              </h1>
              <p className="text-blue-100 text-lg">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="text-right">
              <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
                <p className="text-sm opacity-90">Role</p>
                <p className="font-semibold capitalize">{userRole}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={`${userRole}-stat-${index}`} stat={stat} />
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
                <Plus className="w-5 h-5 text-gray-400" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action) => (
                  <QuickActionCard 
                    key={action.id} 
                    action={action} 
                    onClick={handleQuickAction}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {activities.length} items
              </span>
            </div>
            <div className="space-y-1">
              {activities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {userRole === 'employee' ? 'My Schedule This Week' : 'Team Schedule Overview'}
            </h2>
            <button className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors">
              View Full Schedule
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <WeeklySchedule role={userRole} />
        </div>
      </div>
    </Layout>
  );
};