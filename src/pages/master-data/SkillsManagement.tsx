import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle,
  Loader,
  AlertCircle
} from 'lucide-react';
import { Layout } from '../../components/Layout';
import { skillAPI, type Skill } from '../../api/skill';

export const SkillsManagement: React.FC = () => {
  // State management
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | 'Basic' | 'Intermediate' | 'Advanced' | 'Expert'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive' | 'Deprecated'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Fetch skills from API
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await skillAPI.getAllSkills();
        setSkills(data);
      } catch (err) {
        console.error('Failed to fetch skills:', err);
        setError('Failed to load skills. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const filteredSkills = skills.filter(skill => {
    const matchesSearch =
      skill.skillName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === 'all' || skill.skillLevel === levelFilter;
    const matchesStatus = statusFilter === 'all' || skill.active === (statusFilter === 'Active');
    return matchesSearch && matchesLevel && matchesStatus;
  });

  // API handlers
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const skillData = {
      skillName: formData.get('skillName') as string,
      description: formData.get('description') as string,
      skillLevel: formData.get('skillLevel') as string,
      active: formData.get('active') === 'Active',
    };

    try {
      setSubmitting(true);
      setError(null);
      
      if (editingSkill) {
        // Update existing skill
        const result = await skillAPI.update(editingSkill.id, skillData);
        if (result.success) {
          setSkills(prev => prev.map(skill => 
            skill.id === editingSkill.id ? result.skill : skill
          ));
        }
      } else {
        // Create new skill
        const result = await skillAPI.create(skillData);
        if (result.success) {
          setSkills(prev => [...prev, result.skill]);
        }
      }
      
      setShowAddSkill(false);
      setEditingSkill(null);
    } catch (err) {
      console.error('Failed to save skill:', err);
      setError('Failed to save skill. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (skillId: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) {
      return;
    }

    try {
      setError(null);
      const result = await skillAPI.delete(skillId);
      if (result.success) {
        setSkills(prev => prev.filter(skill => skill.id !== skillId));
      }
    } catch (err) {
      console.error('Failed to delete skill:', err);
      setError('Failed to delete skill. Please try again.');
    }
  };

  const getStatusColor = (status: boolean) => {
    switch (status) {
      case true: return 'bg-green-100 text-green-800 border-green-200';
      case false: return 'bg-red-100 text-red-800 border-red-200';
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

  const toggleSkillSelection = (skillId: string) => {
    setSelectedSkills(prev =>
      prev.includes(skillId) ? prev.filter(id => id !== skillId) : [...prev, skillId]
    );
  };

  const getTotalSkills = () => skills.length;
  const getActiveSkills = () => skills.filter(s => s.active === true).length;

  return (
      <div className="p-6 space-y-6">
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800 font-medium">Error</span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-blue-600 mr-3" />
            <span className="text-lg text-gray-600">Loading skills...</span>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Skills Management</h1>
              <button
                onClick={() => setShowAddSkill(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Skill
              </button>
            </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <Award className="w-6 h-6 text-blue-600 mr-4" />
          <div>
            <p className="text-sm text-gray-600">Total Skills</p>
            <p className="text-2xl font-bold text-gray-900">{getTotalSkills()}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <CheckCircle className="w-6 h-6 text-green-600 mr-4" />
          <div>
            <p className="text-sm text-gray-600">Active Skills</p>
            <p className="text-2xl font-bold text-gray-900">{getActiveSkills()}</p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value as any)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Deprecated">Deprecated</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Skills Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedSkills(e.target.checked ? filteredSkills.map(s => s.id) : [])
                  }
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Skill</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSkills.map((skill) => (
              <tr key={skill.id}>
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedSkills.includes(skill.id)}
                    onChange={() => toggleSkillSelection(skill.id)}
                  />
                </td>
                <td className="px-6 py-4">{skill.skillName}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getLevelColor(skill.skillLevel)}`}>
                    {skill.skillLevel}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(skill.active)}`}>
                    {skill.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button onClick={() => setEditingSkill(skill)} className="text-blue-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(skill.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="text-gray-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {(showAddSkill || editingSkill) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-4">{editingSkill ? 'Edit Skill' : 'Add Skill'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Skill Name</label>
                <input
                  type="text"
                  name="skillName"
                  defaultValue={editingSkill?.skillName}
                  required
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Enter skill name"
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  defaultValue={editingSkill?.description}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Enter description"
                  disabled={submitting}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Level</label>
                  <select 
                    name="skillLevel"
                    defaultValue={editingSkill?.skillLevel} 
                    className="w-full border rounded-lg px-3 py-2"
                    disabled={submitting}
                  >
                    <option value="Basic">Basic</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select 
                    name="active"
                    defaultValue={editingSkill?.active ? 'Active' : 'Inactive'} 
                    className="w-full border rounded-lg px-3 py-2"
                    disabled={submitting}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddSkill(false);
                    setEditingSkill(null);
                  }}
                  className="px-4 py-2 border rounded-lg"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin mr-2" />
                      {editingSkill ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {editingSkill ? 'Update' : 'Create'} Skill
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
          </>
        )}
      </div>
  );
};
