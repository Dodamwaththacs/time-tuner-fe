import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Award, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  MoreVertical,
  Save,
  X,
  Clock,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Star,
  BookOpen,
  Shield,
  Zap,
  Target,
  TrendingUp,
  Users,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  Settings,
  Eye,
  EyeOff,
  Download,
  Upload,
  RefreshCw,
  Copy,
  ExternalLink
} from 'lucide-react';

interface Skill {
  id: number;
  name: string;
  code: string;
  description: string;
  category: 'Medical' | 'Technical' | 'Administrative' | 'Emergency' | 'Specialty';
  level: 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';
  certificationRequired: boolean;
  certificationName?: string;
  validityPeriod?: number; // in months
  department: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Active' | 'Inactive' | 'Deprecated';
  createdAt: string;
  lastModified: string;
  createdBy: string;
  employeeCount: number;
  // OptaPlanner specific fields
  optaPlannerWeight: number;
  hardConstraint: boolean;
  softConstraint: boolean;
  skillGapPenalty: number;
  skillMatchBonus: number;
}

export const SkillsManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'Medical' | 'Technical' | 'Administrative' | 'Emergency' | 'Specialty'>('all');
  const [levelFilter, setLevelFilter] = useState<'all' | 'Basic' | 'Intermediate' | 'Advanced' | 'Expert'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive' | 'Deprecated'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);

  const skills: Skill[] = [
    {
      id: 1,
      name: 'Emergency Medicine',
      code: 'EM-001',
      description: 'Comprehensive emergency medical care including trauma, cardiac, and respiratory emergencies',
      category: 'Emergency',
      level: 'Expert',
      certificationRequired: true,
      certificationName: 'Board Certification in Emergency Medicine',
      validityPeriod: 60,
      department: 'Emergency Department',
      priority: 'Critical',
      status: 'Active',
      createdAt: '2023-01-15',
      lastModified: '2024-01-10',
      createdBy: 'Dr. Sarah Johnson',
      employeeCount: 12,
      optaPlannerWeight: 100,
      hardConstraint: true,
      softConstraint: false,
      skillGapPenalty: 50,
      skillMatchBonus: 20
    },
    {
      id: 2,
      name: 'Critical Care Nursing',
      code: 'CCN-001',
      description: 'Specialized nursing care for critically ill patients in ICU settings',
      category: 'Medical',
      level: 'Advanced',
      certificationRequired: true,
      certificationName: 'CCRN Certification',
      validityPeriod: 36,
      department: 'Intensive Care Unit',
      priority: 'Critical',
      status: 'Active',
      createdAt: '2023-02-01',
      lastModified: '2024-01-05',
      createdBy: 'Nurse Manager David Brown',
      employeeCount: 18,
      optaPlannerWeight: 90,
      hardConstraint: true,
      softConstraint: false,
      skillGapPenalty: 40,
      skillMatchBonus: 15
    },
    {
      id: 3,
      name: 'Surgical Nursing',
      code: 'SN-001',
      description: 'Nursing care for surgical patients including pre-op, intra-op, and post-op care',
      category: 'Medical',
      level: 'Advanced',
      certificationRequired: true,
      certificationName: 'CNOR Certification',
      validityPeriod: 36,
      department: 'Operating Room',
      priority: 'High',
      status: 'Active',
      createdAt: '2023-02-15',
      lastModified: '2023-12-20',
      createdBy: 'Dr. Emily Chen',
      employeeCount: 15,
      optaPlannerWeight: 80,
      hardConstraint: true,
      softConstraint: false,
      skillGapPenalty: 35,
      skillMatchBonus: 12
    },
    {
      id: 4,
      name: 'Trauma Care',
      code: 'TC-001',
      description: 'Specialized care for trauma patients including assessment, stabilization, and treatment',
      category: 'Emergency',
      level: 'Expert',
      certificationRequired: true,
      certificationName: 'ATLS Certification',
      validityPeriod: 48,
      department: 'Emergency Department',
      priority: 'Critical',
      status: 'Active',
      createdAt: '2023-03-01',
      lastModified: '2024-01-08',
      createdBy: 'Dr. Mike Chen',
      employeeCount: 8,
      optaPlannerWeight: 95,
      hardConstraint: true,
      softConstraint: false,
      skillGapPenalty: 45,
      skillMatchBonus: 18
    },
    {
      id: 5,
      name: 'Ventilator Management',
      code: 'VM-001',
      description: 'Management and operation of mechanical ventilators for respiratory support',
      category: 'Technical',
      level: 'Advanced',
      certificationRequired: true,
      certificationName: 'Ventilator Management Certification',
      validityPeriod: 24,
      department: 'Intensive Care Unit',
      priority: 'High',
      status: 'Active',
      createdAt: '2023-03-15',
      lastModified: '2023-11-15',
      createdBy: 'Dr. Robert Taylor',
      employeeCount: 10,
      optaPlannerWeight: 75,
      hardConstraint: true,
      softConstraint: false,
      skillGapPenalty: 30,
      skillMatchBonus: 10
    },
    {
      id: 6,
      name: 'Medical Technology',
      code: 'MT-001',
      description: 'Laboratory testing and analysis using medical technology equipment',
      category: 'Technical',
      level: 'Intermediate',
      certificationRequired: true,
      certificationName: 'Medical Technologist Certification',
      validityPeriod: 60,
      department: 'Laboratory Services',
      priority: 'Medium',
      status: 'Active',
      createdAt: '2023-04-01',
      lastModified: '2023-12-10',
      createdBy: 'Dr. Lisa Wilson',
      employeeCount: 12,
      optaPlannerWeight: 60,
      hardConstraint: false,
      softConstraint: true,
      skillGapPenalty: 20,
      skillMatchBonus: 8
    },
    {
      id: 7,
      name: 'Patient Care Coordination',
      code: 'PCC-001',
      description: 'Coordination of patient care across multiple departments and services',
      category: 'Administrative',
      level: 'Intermediate',
      certificationRequired: false,
      department: 'All Departments',
      priority: 'Medium',
      status: 'Active',
      createdAt: '2023-04-15',
      lastModified: '2023-10-20',
      createdBy: 'HR Manager',
      employeeCount: 25,
      optaPlannerWeight: 40,
      hardConstraint: false,
      softConstraint: true,
      skillGapPenalty: 15,
      skillMatchBonus: 5
    },
    {
      id: 8,
      name: 'Cardiac Life Support',
      code: 'CLS-001',
      description: 'Advanced cardiac life support including ACLS and PALS protocols',
      category: 'Emergency',
      level: 'Advanced',
      certificationRequired: true,
      certificationName: 'ACLS/PALS Certification',
      validityPeriod: 24,
      department: 'Emergency Department',
      priority: 'High',
      status: 'Active',
      createdAt: '2023-05-01',
      lastModified: '2024-01-12',
      createdBy: 'Dr. Sarah Johnson',
      employeeCount: 20,
      optaPlannerWeight: 85,
      hardConstraint: true,
      softConstraint: false,
      skillGapPenalty: 35,
      skillMatchBonus: 12
    },
    {
      id: 9,
      name: 'Anesthesia Management',
      code: 'AM-001',
      description: 'Administration and management of anesthesia for surgical procedures',
      category: 'Specialty',
      level: 'Expert',
      certificationRequired: true,
      certificationName: 'Board Certification in Anesthesiology',
      validityPeriod: 60,
      department: 'Operating Room',
      priority: 'Critical',
      status: 'Active',
      createdAt: '2023-05-15',
      lastModified: '2023-12-05',
      createdBy: 'Dr. Emily Chen',
      employeeCount: 6,
      optaPlannerWeight: 100,
      hardConstraint: true,
      softConstraint: false,
      skillGapPenalty: 50,
      skillMatchBonus: 20
    },
    {
      id: 10,
      name: 'Legacy System Management',
      code: 'LSM-001',
      description: 'Management of legacy hospital information systems',
      category: 'Technical',
      level: 'Intermediate',
      certificationRequired: false,
      department: 'IT Department',
      priority: 'Low',
      status: 'Deprecated',
      createdAt: '2022-01-01',
      lastModified: '2023-06-01',
      createdBy: 'IT Manager',
      employeeCount: 3,
      optaPlannerWeight: 20,
      hardConstraint: false,
      softConstraint: true,
      skillGapPenalty: 5,
      skillMatchBonus: 2
    }
  ];

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || skill.category === categoryFilter;
    const matchesLevel = levelFilter === 'all' || skill.level === levelFilter;
    const matchesStatus = statusFilter === 'all' || skill.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesLevel && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'Inactive': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Deprecated': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Advanced': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Intermediate': return 'bg-green-100 text-green-800 border-green-200';
      case 'Basic': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Medical': return <UserCheck className="w-4 h-4" />;
      case 'Technical': return <Settings className="w-4 h-4" />;
      case 'Administrative': return <BookOpen className="w-4 h-4" />;
      case 'Emergency': return <AlertTriangle className="w-4 h-4" />;
      case 'Specialty': return <Star className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  const toggleSkillSelection = (skillId: number) => {
    setSelectedSkills(prev => 
      prev.includes(skillId) 
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  const getTotalSkills = () => skills.length;
  const getActiveSkills = () => skills.filter(s => s.status === 'Active').length;
  const getCriticalSkills = () => skills.filter(s => s.priority === 'Critical').length;
  const getCertifiedSkills = () => skills.filter(s => s.certificationRequired).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Skills Management</h1>
          <p className="text-gray-600 mt-1">Manage medical skills, certifications, and OptaPlanner optimization parameters</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </button>
          <button 
            onClick={() => setShowAddSkill(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Skills</p>
              <p className="text-2xl font-bold text-gray-900">{getTotalSkills()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Skills</p>
              <p className="text-2xl font-bold text-gray-900">{getActiveSkills()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Critical Skills</p>
              <p className="text-2xl font-bold text-gray-900">{getCriticalSkills()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Certified Skills</p>
              <p className="text-2xl font-bold text-gray-900">{getCertifiedSkills()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search skills by name, code, or description..."
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value as any)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    <option value="Medical">Medical</option>
                    <option value="Technical">Technical</option>
                    <option value="Administrative">Administrative</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Specialty">Specialty</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                  <select
                    value={levelFilter}
                    onChange={(e) => setLevelFilter(e.target.value as any)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Levels</option>
                    <option value="Basic">Basic</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
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
                    <option value="Deprecated">Deprecated</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Skills Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSkills(filteredSkills.map(s => s.id));
                      } else {
                        setSelectedSkills([]);
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Skill
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category & Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  OptaPlanner Config
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSkills.map((skill) => (
                <tr key={skill.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedSkills.includes(skill.id)}
                      onChange={() => toggleSkillSelection(skill.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Award className="w-5 h-5 text-blue-600 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{skill.name}</div>
                        <div className="text-sm text-gray-500">{skill.code}</div>
                        <div className="text-xs text-gray-400 truncate max-w-xs">{skill.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {getCategoryIcon(skill.category)}
                        <span className="ml-1 text-sm text-gray-900">{skill.category}</span>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getLevelColor(skill.level)}`}>
                        {skill.level}
                      </span>
                    </div>
                    {skill.certificationRequired && (
                      <div className="text-xs text-gray-500 mt-1">
                        <Shield className="w-3 h-3 inline mr-1" />
                        {skill.certificationName}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{skill.department}</div>
                    <div className="text-sm text-gray-500">{skill.employeeCount} employees</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(skill.priority)}`}>
                        {skill.priority}
                      </span>
                      <br />
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(skill.status)}`}>
                        {skill.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm space-y-1">
                      <div className="flex items-center">
                        <Zap className="w-3 h-3 text-yellow-600 mr-1" />
                        <span className="text-gray-900">Weight: {skill.optaPlannerWeight}</span>
                      </div>
                      <div className="flex items-center">
                        {skill.hardConstraint ? (
                          <CheckCircle className="w-3 h-3 text-red-600 mr-1" />
                        ) : (
                          <XCircle className="w-3 h-3 text-gray-400 mr-1" />
                        )}
                        <span className="text-xs text-gray-600">Hard Constraint</span>
                      </div>
                      <div className="flex items-center">
                        {skill.softConstraint ? (
                          <CheckCircle className="w-3 h-3 text-blue-600 mr-1" />
                        ) : (
                          <XCircle className="w-3 h-3 text-gray-400 mr-1" />
                        )}
                        <span className="text-xs text-gray-600">Soft Constraint</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setEditingSkill(skill)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900 p-1 rounded">
                        <Copy className="w-4 h-4" />
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

      {/* Add/Edit Skill Modal */}
      {(showAddSkill || editingSkill) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skill Name</label>
                  <input
                    type="text"
                    defaultValue={editingSkill?.name}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter skill name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skill Code</label>
                  <input
                    type="text"
                    defaultValue={editingSkill?.code}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter skill code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    defaultValue={editingSkill?.description}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Enter skill description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      defaultValue={editingSkill?.category}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Medical">Medical</option>
                      <option value="Technical">Technical</option>
                      <option value="Administrative">Administrative</option>
                      <option value="Emergency">Emergency</option>
                      <option value="Specialty">Specialty</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                    <select
                      defaultValue={editingSkill?.level}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Basic">Basic</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      defaultValue={editingSkill?.priority}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">OptaPlanner Weight</label>
                    <input
                      type="number"
                      defaultValue={editingSkill?.optaPlannerWeight}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0-100"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddSkill(false);
                      setEditingSkill(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingSkill ? 'Update' : 'Create'} Skill
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