import React, { useState } from 'react';

// Types based on the sample payload
interface ShiftSwapRequest {
  id: string;
  requestStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  managerApproval: 'PENDING' | 'APPROVED' | 'REJECTED';
  reason: string;
  requestedAt: string;
  respondAt: string | null;
  responseNotes: string | null;
  requestingEmployee: string;
  requestingEmployeeName: string;
  targetEmployee: string;
  targetEmployeeName: string;
  shift: string;
  shiftName: string;
}

interface Employee {
  id: string;
  name: string;
}

interface Shift {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
}

const ShiftSwap: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'send' | 'received'>('send');
  const [newRequest, setNewRequest] = useState({
    targetEmployee: '',
    shift: '',
    reason: ''
  });

  // Dummy data based on the sample payload
  const [shiftSwapRequests] = useState<ShiftSwapRequest[]>([
    {
      id: "123e4567-e89b-12d3-a456-426655440001",
      requestStatus: "PENDING",
      managerApproval: "PENDING",
      reason: "Family commitment on Tuesday",
      requestedAt: "2025-08-17T06:54:04.128579",
      respondAt: null,
      responseNotes: null,
      requestingEmployee: "123e4567-e89b-12d3-a456-426655440001",
      requestingEmployeeName: "Jessica Martinez",
      targetEmployee: "123e4567-e89b-12d3-a456-426655440002",
      targetEmployeeName: "Michael Chen",
      shift: "123e4567-e89b-12d3-a456-426655440007",
      shiftName: "Day Shift"
    },
    {
      id: "123e4567-e89b-12d3-a456-426655440002",
      requestStatus: "APPROVED",
      managerApproval: "APPROVED",
      reason: "Medical appointment",
      requestedAt: "2025-08-15T10:30:00.000000",
      respondAt: "2025-08-16T09:15:00.000000",
      responseNotes: "Approved - good coverage available",
      requestingEmployee: "123e4567-e89b-12d3-a456-426655440003",
      requestingEmployeeName: "Sarah Johnson",
      targetEmployee: "123e4567-e89b-12d3-a456-426655440001",
      targetEmployeeName: "Jessica Martinez",
      shift: "123e4567-e89b-12d3-a456-426655440008",
      shiftName: "Evening Shift"
    }
  ]);

  // Dummy employees data
  const employees: Employee[] = [
    { id: "123e4567-e89b-12d3-a456-426655440001", name: "Jessica Martinez" },
    { id: "123e4567-e89b-12d3-a456-426655440002", name: "Michael Chen" },
    { id: "123e4567-e89b-12d3-a456-426655440003", name: "Sarah Johnson" },
    { id: "123e4567-e89b-12d3-a456-426655440004", name: "David Wilson" }
  ];

  // Dummy shifts data
  const shifts: Shift[] = [
    { id: "123e4567-e89b-12d3-a456-426655440007", name: "Day Shift", date: "2025-08-20", startTime: "08:00", endTime: "16:00" },
    { id: "123e4567-e89b-12d3-a456-426655440008", name: "Evening Shift", date: "2025-08-20", startTime: "16:00", endTime: "00:00" },
    { id: "123e4567-e89b-12d3-a456-426655440009", name: "Night Shift", date: "2025-08-21", startTime: "00:00", endTime: "08:00" }
  ];

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the request to an API
    console.log('Shift swap request submitted:', newRequest);
    
    // Reset form
    setNewRequest({
      targetEmployee: '',
      shift: '',
      reason: ''
    });
    
    alert('Shift swap request submitted successfully!');
  };

  const handleApproveRequest = (requestId: string) => {
    console.log('Approving request:', requestId);
    alert('Request approved!');
  };

  const handleRejectRequest = (requestId: string) => {
    console.log('Rejecting request:', requestId);
    alert('Request rejected!');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shift Swap Management</h1>
        <p className="text-gray-600">Request shift swaps with colleagues or respond to incoming requests</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('send')}
          className={`px-6 py-3 font-medium text-sm ${
            activeTab === 'send'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Send Request
        </button>
        <button
          onClick={() => setActiveTab('received')}
          className={`px-6 py-3 font-medium text-sm ${
            activeTab === 'received'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Received Requests
        </button>
      </div>

      {/* Send Request Tab */}
      {activeTab === 'send' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Request a Shift Swap</h2>
          <form onSubmit={handleSubmitRequest} className="space-y-4">
            <div>
              <label htmlFor="targetEmployee" className="block text-sm font-medium text-gray-700 mb-2">
                Select Employee to Swap With
              </label>
              <select
                id="targetEmployee"
                value={newRequest.targetEmployee}
                onChange={(e) => setNewRequest({ ...newRequest, targetEmployee: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Choose an employee...</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="shift" className="block text-sm font-medium text-gray-700 mb-2">
                Select Shift
              </label>
              <select
                id="shift"
                value={newRequest.shift}
                onChange={(e) => setNewRequest({ ...newRequest, shift: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Choose a shift...</option>
                {shifts.map((shift) => (
                  <option key={shift.id} value={shift.id}>
                    {shift.name} - {shift.date} ({shift.startTime} - {shift.endTime})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Swap Request
              </label>
              <textarea
                id="reason"
                value={newRequest.reason}
                onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Please provide a reason for your shift swap request..."
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
            >
              Submit Swap Request
            </button>
          </form>
        </div>
      )}

      {/* Received Requests Tab */}
      {activeTab === 'received' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Shift Swap Requests</h2>
          
          {shiftSwapRequests.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-500">No shift swap requests found.</p>
            </div>
          ) : (
            shiftSwapRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Shift Swap Request from {request.requestingEmployeeName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Requested on {formatDate(request.requestedAt)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(request.requestStatus)}`}>
                      {request.requestStatus}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(request.managerApproval)}`}>
                      Manager: {request.managerApproval}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Shift Details</p>
                    <p className="text-sm text-gray-600">{request.shiftName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Target Employee</p>
                    <p className="text-sm text-gray-600">{request.targetEmployeeName}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Reason</p>
                  <p className="text-sm text-gray-600">{request.reason}</p>
                </div>

                {request.responseNotes && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Response Notes</p>
                    <p className="text-sm text-gray-600">{request.responseNotes}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Responded on {request.respondAt ? formatDate(request.respondAt) : 'N/A'}
                    </p>
                  </div>
                )}

                {request.requestStatus === 'PENDING' && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleApproveRequest(request.id)}
                      className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request.id)}
                      className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ShiftSwap;