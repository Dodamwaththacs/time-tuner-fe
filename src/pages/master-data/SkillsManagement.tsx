import React, { useState } from 'react';
import { 
  Award, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle 
} from 'lucide-react';

interface Skill {
  id: string;
  skillName: string;
  description: string;
  skillLevel: string;
  active: boolean; 
}

export const SkillsManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | 'Basic' | 'Intermediate' | 'Advanced' | 'Expert'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive' | 'Deprecated'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const skills: Skill[] = [
    { id: "123e4567-e89b-12d3-a456-426655440001", skillName: 'Cardiac Resuscitation', description: 'Basic life support for cardiac arrest', skillLevel: 'Advanced', active: true },
    { id: "123e4567-e89b-12d3-a456-426655440002", skillName: 'Advanced Cardiac Life Support', description: 'Advanced techniques for cardiac emergencies', skillLevel: 'Expert', active: true },
    { id: "123e4567-e89b-12d3-a456-426655440003", skillName: 'Wound Care Management', description: 'Techniques for managing and treating wounds', skillLevel: 'Intermediate', active: false },
    { id: "123e4567-e89b-12d3-a456-426655440004", skillName: 'Emergency Response Protocols', description: 'Protocols for emergency situations', skillLevel: 'Basic', active: true },
    { id: "123e4567-e89b-12d3-a456-426655440005", skillName: 'Patient Assessment Skills', description: 'Skills for assessing patient conditions', skillLevel: 'Advanced', active: false }
  ];

  const filteredSkills = skills.filter(skill => {
    const matchesSearch =
      skill.skillName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === 'all' || skill.skillLevel === levelFilter;
    const matchesStatus = statusFilter === 'all' || skill.active === (statusFilter === 'Active');
    return matchesSearch && matchesLevel && matchesStatus;
  });

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
                  <button className="text-red-600">
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
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Skill Name</label>
                <input
                  type="text"
                  defaultValue={editingSkill?.skillName}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Enter skill name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  defaultValue={editingSkill?.description}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Enter description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Level</label>
                  <select defaultValue={editingSkill?.skillLevel} className="w-full border rounded-lg px-3 py-2">
                    <option value="Basic">Basic</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select defaultValue={editingSkill?.active ? 'Active' : 'Inactive'} className="w-full border rounded-lg px-3 py-2">
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
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                  {editingSkill ? 'Update' : 'Create'} Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
