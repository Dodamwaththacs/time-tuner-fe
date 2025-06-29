import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../contexts/AuthContext';

export const Projects: React.FC = () => {
  const { user } = useAuth();

  const getProjectsByRole = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return [
          { id: 1, name: 'Project Alpha', status: 'Active', team: 'Team A', progress: 75 },
          { id: 2, name: 'Project Beta', status: 'Planning', team: 'Team B', progress: 25 },
          { id: 3, name: 'Project Gamma', status: 'Completed', team: 'Team C', progress: 100 },
          { id: 4, name: 'Project Delta', status: 'On Hold', team: 'Team A', progress: 50 }
        ];
      case 'manager':
        return [
          { id: 1, name: 'Project Alpha', status: 'Active', team: 'Team A', progress: 75 },
          { id: 2, name: 'Project Beta', status: 'Planning', team: 'Team B', progress: 25 }
        ];
      case 'employee':
        return [
          { id: 1, name: 'Project Alpha', status: 'Active', team: 'Team A', progress: 75 }
        ];
      default:
        return [];
    }
  };

  const projects = getProjectsByRole(user?.role || 'employee');

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <p className="text-gray-600">Manage your projects and track progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                project.status === 'Active' ? 'bg-green-100 text-green-800' :
                project.status === 'Planning' ? 'bg-blue-100 text-blue-800' :
                project.status === 'Completed' ? 'bg-gray-100 text-gray-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {project.status}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">Team: {project.team}</p>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                View Details
              </button>
              {user?.role === 'admin' && (
                <button className="bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700 transition-colors">
                  Edit
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {user?.role === 'admin' && (
        <div className="mt-6">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            + Create New Project
          </button>
        </div>
      )}
    </div>
  );
}; 