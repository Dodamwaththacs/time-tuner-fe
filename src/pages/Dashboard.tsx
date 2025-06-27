import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Time Tuner Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Protected Dashboard
              </h2>
              <p className="text-gray-600 mb-6">
                This is a protected route that requires authentication to access.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    User Profile
                  </h3>
                  <p className="text-gray-600">ID: {user?.id}</p>
                  <p className="text-gray-600">Email: {user?.email}</p>
                  <p className="text-gray-600">Name: {user?.name}</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Quick Stats
                  </h3>
                  <p className="text-gray-600">Projects: 5</p>
                  <p className="text-gray-600">Tasks: 12</p>
                  <p className="text-gray-600">Completed: 8</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Recent Activity
                  </h3>
                  <p className="text-gray-600">Last login: Today</p>
                  <p className="text-gray-600">Status: Active</p>
                  <p className="text-gray-600">Role: Admin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
