import React, { useEffect, useState } from 'react';
import { scheduleAPI } from '../../api/staff';
import type { Schedule } from '../../api/staff';

export const CurrentSchedules: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      try {
        const data = await scheduleAPI.getAll();
        setSchedules(data);
      } catch (error) {
        // Handle error
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, []);

  const getStaffName = (schedule: Schedule): string => {
    if (schedule.staff && typeof schedule.staff === 'object' && 'name' in schedule.staff && typeof schedule.staff.name === 'string') {
      return schedule.staff.name;
    }
    return String(schedule.staff_id);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Current Schedules</h1>
      <p className="text-gray-600 mb-4">View and manage current department and team schedules. Powered by OptaPlanner optimization.</p>
      {loading ? (
        <div>Loading schedules...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schedules.map((schedule) => (
                <tr key={schedule.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{getStaffName(schedule)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{schedule.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{schedule.shift_start} - {schedule.shift_end}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{schedule.shift_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{schedule.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{schedule.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}; 