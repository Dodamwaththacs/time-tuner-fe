import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  MoreVertical,
  Settings,
  Clock,
  Users,
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Save,
  X,
  ToggleLeft,
  ToggleRight,
  FileText,
  Code,
  Zap,
  Lock,
  Unlock,
  Eye,
  EyeOff
} from 'lucide-react';

interface BusinessRule {
  id: number;
  name: string;
  category: 'Scheduling' | 'Time Tracking' | 'Leave Management' | 'Overtime' | 'Compliance' | 'Security';
  description: string;
  ruleType: 'Validation' | 'Automation' | 'Notification' | 'Restriction';
  status: 'Active' | 'Inactive' | 'Draft';
  priority: 'High' | 'Medium' | 'Low';
  conditions: string[];
  actions: string[];
  affectedRoles: string[];
  createdAt: string;
  lastModified: string;
  createdBy: string;
  isEnabled: boolean;
}

export const BusinessRules: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'Scheduling' | 'Time Tracking' | 'Leave Management' | 'Overtime' | 'Compliance' | 'Security'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive' | 'Draft'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddRule, setShowAddRule] = useState(false);
  const [editingRule, setEditingRule] = useState<BusinessRule | null>(null);
  const [activeTab, setActiveTab] = useState<'rules' | 'templates' | 'logs'>('rules');

  const businessRules: BusinessRule[] = [
    {
      id: 1,
      name: 'Maximum Consecutive Night Shifts',
      category: 'Scheduling',
      description: 'Prevent employees from working more than 3 consecutive night shifts',
      ruleType: 'Validation',
      status: 'Active',
      priority: 'High',
      conditions: ['Consecutive night shifts > 3', 'Employee status = Active'],
      actions: ['Block shift assignment', 'Send notification to scheduler'],
      affectedRoles: ['nurse', 'doctor', 'manager'],
      createdAt: '2023-01-15',
      lastModified: '2024-01-10',
      createdBy: 'Admin User',
      isEnabled: true
    },
    {
      id: 2,
      name: 'Minimum Staffing Requirements',
      category: 'Scheduling',
      description: 'Ensure minimum number of qualified staff are scheduled for each shift',
      ruleType: 'Automation',
      status: 'Active',
      priority: 'High',
      conditions: ['Shift type = Critical', 'Scheduled staff < minimum required', 'Skill requirements not met'],
      actions: ['Auto-assign available qualified staff', 'Send alert to manager', 'Flag for manual review'],
      affectedRoles: ['manager', 'admin'],
      createdAt: '2023-02-01',
      lastModified: '2024-01-05',
      createdBy: 'Admin User',
      isEnabled: true
    },
    {
      id: 3,
      name: 'Weekend Rotation Fairness',
      category: 'Scheduling',
      description: 'Ensure fair distribution of weekend shifts among qualified staff',
      ruleType: 'Validation',
      status: 'Active',
      priority: 'Medium',
      conditions: ['Weekend shift assignment', 'Employee weekend count > average + 2'],
      actions: ['Suggest alternative assignment', 'Notify scheduler of imbalance'],
      affectedRoles: ['nurse', 'doctor', 'manager'],
      createdAt: '2023-03-15',
      lastModified: '2023-12-20',
      createdBy: 'HR Manager',
      isEnabled: true
    },
    {
      id: 4,
      name: 'Overtime Limit Enforcement',
      category: 'Overtime',
      description: 'Enforce maximum overtime hours per week and month',
      ruleType: 'Restriction',
      status: 'Active',
      priority: 'High',
      conditions: ['Weekly overtime > 12 hours', 'Monthly overtime > 40 hours', 'Employee consent = No'],
      actions: ['Block overtime assignment', 'Send compliance warning', 'Require manager approval'],
      affectedRoles: ['nurse', 'doctor', 'manager'],
      createdAt: '2023-04-01',
      lastModified: '2024-01-15',
      createdBy: 'Compliance Officer',
      isEnabled: true
    },
    {
      id: 5,
      name: 'Skill-Based Assignment',
      category: 'Scheduling',
      description: 'Automatically assign staff based on required skills and certifications',
      ruleType: 'Automation',
      status: 'Active',
      priority: 'Medium',
      conditions: ['Shift requires specific skills', 'Available staff with skills', 'Certification valid'],
      actions: ['Prioritize qualified staff', 'Match skills to requirements', 'Notify of skill gaps'],
      affectedRoles: ['manager', 'admin'],
      createdAt: '2023-05-10',
      lastModified: '2024-01-08',
      createdBy: 'System Admin',
      isEnabled: true
    },
    {
      id: 6,
      name: 'Break Time Compliance',
      category: 'Compliance',
      description: 'Enforce mandatory break times for shifts longer than 8 hours',
      ruleType: 'Restriction',
      status: 'Active',
      priority: 'High',
      conditions: ['Shift duration > 8 hours', 'Break time < required minimum', 'Labor law compliance'],
      actions: ['Schedule mandatory breaks', 'Block time entry without breaks', 'Send compliance alert'],
      affectedRoles: ['nurse', 'doctor', 'manager'],
      createdAt: '2023-06-01',
      lastModified: '2023-11-15',
      createdBy: 'Compliance Officer',
      isEnabled: true
    },
    {
      id: 7,
      name: 'OptaPlanner Optimization',
      category: 'Scheduling',
      description: 'Apply OptaPlanner optimization algorithms for optimal roster generation',
      ruleType: 'Automation',
      status: 'Active',
      priority: 'High',
      conditions: ['Schedule generation mode = Auto', 'OptaPlanner solver available', 'Constraints defined'],
      actions: ['Run optimization algorithm', 'Apply hard and soft constraints', 'Generate optimal roster'],
      affectedRoles: ['manager', 'admin'],
      createdAt: '2023-07-01',
      lastModified: '2024-01-12',
      createdBy: 'System Admin',
      isEnabled: true
    },
    {
      id: 8,
      name: 'Emergency Coverage',
      category: 'Scheduling',
      description: 'Ensure emergency departments have adequate on-call coverage',
      ruleType: 'Validation',
      status: 'Active',
      priority: 'High',
      conditions: ['Department = Emergency', 'On-call staff < minimum required', 'Emergency protocols active'],
      actions: ['Alert emergency manager', 'Auto-assign on-call staff', 'Escalate to admin'],
      affectedRoles: ['doctor', 'manager', 'admin'],
      createdAt: '2023-08-01',
      lastModified: '2024-01-10',
      createdBy: 'Emergency Manager',
      isEnabled: true
    },
    {
      id: 9,
      name: 'Leave Request Validation',
      category: 'Leave Management',
      description: 'Validate leave requests against staffing requirements and coverage',
      ruleType: 'Validation',
      status: 'Active',
      priority: 'Medium',
      conditions: ['Leave request submitted', 'Staffing below minimum', 'No coverage available'],
      actions: ['Flag for manager review', 'Suggest alternative dates', 'Request coverage plan'],
      affectedRoles: ['nurse', 'doctor', 'manager'],
      createdAt: '2023-09-01',
      lastModified: '2023-12-15',
      createdBy: 'HR Manager',
      isEnabled: true
    },
    {
      id: 10,
      name: 'OptaPlanner Constraint Weighting',
      category: 'Scheduling',
      description: 'Configure OptaPlanner constraint weights for different departments',
      ruleType: 'Automation',
      status: 'Draft',
      priority: 'Medium',
      conditions: ['Department has OptaPlanner config', 'Constraint weights defined', 'Optimization enabled'],
      actions: ['Apply department-specific weights', 'Balance hard vs soft constraints', 'Optimize for department needs'],
      affectedRoles: ['manager', 'admin'],
      createdAt: '2024-01-01',
      lastModified: '2024-01-15',
      createdBy: 'System Admin',
      isEnabled: false
    }
  ];

  const filteredRules = businessRules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rule.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rule.createdBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || rule.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || rule.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Scheduling': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Time Tracking': return 'bg-green-100 text-green-800 border-green-200';
      case 'Leave Management': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Overtime': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Compliance': return 'bg-red-100 text-red-800 border-red-200';
      case 'Security': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'Inactive': return 'bg-red-100 text-red-800 border-red-200';
      case 'Draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRuleTypeIcon = (ruleType: string) => {
    switch (ruleType) {
      case 'Validation': return <CheckCircle className="w-4 h-4" />;
      case 'Automation': return <Zap className="w-4 h-4" />;
      case 'Notification': return <AlertTriangle className="w-4 h-4" />;
      case 'Restriction': return <Lock className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const toggleRuleStatus = (ruleId: number) => {
    // This would update the rule status in a real application
    console.log('Toggle rule status:', ruleId);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Rules</h1>
          <p className="text-gray-600 mt-1">Configure and manage business rules and policies</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowAddRule(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Rule
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Rules</p>
              <p className="text-2xl font-bold text-gray-900">{businessRules.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Rules</p>
              <p className="text-2xl font-bold text-gray-900">
                {businessRules.filter(r => r.status === 'Active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">
                {businessRules.filter(r => r.priority === 'High').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Automation Rules</p>
              <p className="text-2xl font-bold text-gray-900">
                {businessRules.filter(r => r.ruleType === 'Automation').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'rules', name: 'Business Rules', icon: Shield },
            { id: 'templates', name: 'Rule Templates', icon: FileText },
            { id: 'logs', name: 'Rule Logs', icon: Clock }
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

      {/* Business Rules Tab */}
      {activeTab === 'rules' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search rules by name, description, or creator..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </button>
                </div>
              </div>

              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value as any)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Categories</option>
                        <option value="Scheduling">Scheduling</option>
                        <option value="Time Tracking">Time Tracking</option>
                        <option value="Leave Management">Leave Management</option>
                        <option value="Overtime">Overtime</option>
                        <option value="Compliance">Compliance</option>
                        <option value="Security">Security</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Rules Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rule
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category & Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority & Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Affected Roles
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Shield className="w-5 h-5 text-blue-600 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{rule.name}</div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">{rule.description}</div>
                            <div className="text-sm text-gray-400">Created by {rule.createdBy}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(rule.category)}`}>
                            {rule.category}
                          </span>
                          <br />
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                            {getRuleTypeIcon(rule.ruleType)}
                            <span className="ml-1">{rule.ruleType}</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(rule.priority)}`}>
                            {rule.priority}
                          </span>
                          <br />
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(rule.status)}`}>
                            {rule.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {rule.affectedRoles.map((role, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-700">
                              {role}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleRuleStatus(rule.id)}
                            className={`p-1 rounded ${rule.isEnabled ? 'text-green-600 hover:text-green-900' : 'text-gray-400 hover:text-gray-600'}`}
                          >
                            {rule.isEnabled ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                          </button>
                          <button 
                            onClick={() => setEditingRule(rule)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900 p-1 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900 p-1 rounded">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Rule Templates Tab */}
      {activeTab === 'templates' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rule Templates</h3>
          <p className="text-gray-600">Pre-built rule templates for common business scenarios</p>
          {/* Template content would go here */}
        </div>
      )}

      {/* Rule Logs Tab */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rule Execution Logs</h3>
          <p className="text-gray-600">Track rule execution and performance metrics</p>
          {/* Logs content would go here */}
        </div>
      )}

      {/* Add/Edit Rule Modal */}
      {(showAddRule || editingRule) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingRule ? 'Edit Business Rule' : 'Add New Business Rule'}
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rule Name</label>
                  <input
                    type="text"
                    defaultValue={editingRule?.name}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter rule name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    defaultValue={editingRule?.category}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Scheduling">Scheduling</option>
                    <option value="Time Tracking">Time Tracking</option>
                    <option value="Leave Management">Leave Management</option>
                    <option value="Overtime">Overtime</option>
                    <option value="Compliance">Compliance</option>
                    <option value="Security">Security</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    defaultValue={editingRule?.description}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Enter rule description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    defaultValue={editingRule?.priority}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddRule(false);
                      setEditingRule(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingRule ? 'Update' : 'Create'} Rule
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