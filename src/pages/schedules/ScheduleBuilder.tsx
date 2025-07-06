import React from 'react';

export const ScheduleBuilder: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Schedule Builder</h1>
      <p className="text-gray-600 mb-4">Build and edit department schedules. Assign staff, set shift patterns, and optimize with OptaPlanner.</p>
      {/* TODO: Add staff selection, shift assignment, and OptaPlanner trigger UI */}
      <div className="bg-blue-50 p-4 rounded-lg text-blue-700">
        Schedule builder UI coming soon...
      </div>
    </div>
  );
}; 