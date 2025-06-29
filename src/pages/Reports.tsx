import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../contexts/AuthContext';

export const Reports: React.FC = () => {
  const { user } = useAuth();

  const getReportsByRole = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return [
          { id: 1, name: 'Company Performance Overview', type: 'Executive', lastUpdated: '2024-01-15', status: 'Ready' },
          { id: 2, name: 'Financial Summary', type: 'Financial', lastUpdated: '2024-01-14', status: 'Ready' },
          { id: 3, name: 'Employee Productivity', type: 'HR', lastUpdated: '2024-01-13', status: 'Processing' },
          { id: 4, name: 'System Usage Analytics', type: 'Technical', lastUpdated: '2024-01-12', status: 'Ready' },
          { id: 5, name: 'Project ROI Analysis', type: 'Project', lastUpdated: '2024-01-11', status: 'Ready' }
        ];
      case 'manager':
        return [
          { id: 1, name: 'Team Performance Report', type: 'Team', lastUpdated: '2024-01-15', status: 'Ready' },
          { id: 2, name: 'Project Progress Summary', type: 'Project', lastUpdated: '2024-01-14', status: 'Ready' },
          { id: 3, name: 'Resource Utilization', type: 'Resource', lastUpdated: '2024-01-13', status: 'Processing' }
        ];
      default:
        return [];
    }
  };

  const reports = getReportsByRole(user?.role || 'employee');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Executive': return 'bg-purple-100 text-purple-800';
      case 'Financial': return 'bg-green-100 text-green-800';
      case 'HR': return 'bg-blue-100 text-blue-800';
      case 'Technical': return 'bg-orange-100 text-orange-800';
      case 'Project': return 'bg-indigo-100 text-indigo-800';
      case 'Team': return 'bg-pink-100 text-pink-800';
      case 'Resource': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600">Generate and view analytical reports</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Reports</span>
              <span className="font-semibold">{reports.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ready</span>
              <span className="font-semibold text-green-600">
                {reports.filter(r => r.status === 'Ready').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Processing</span>
              <span className="font-semibold text-yellow-600">
                {reports.filter(r => r.status === 'Processing').length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-2">
            {reports.slice(0, 3).map((report) => (
              <div key={report.id} className="flex justify-between items-center text-sm">
                <span className="text-gray-600 truncate">{report.name}</span>
                <span className="text-gray-400">{report.lastUpdated}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
          <div className="space-y-2">
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Generate New Report
            </button>
            <button className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              Export All
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Available Reports</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{report.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(report.type)}`}>
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.lastUpdated}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">View</button>
                      <button className="text-green-600 hover:text-green-900">Download</button>
                      {user?.role === 'admin' && (
                        <button className="text-red-600 hover:text-red-900">Delete</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}; 