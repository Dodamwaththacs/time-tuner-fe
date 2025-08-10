import React, { useState } from "react";

export interface ShiftChangeRequest {
  id: number;
  requestingEmployee: string;
  shiftName: string;
  reason: string;
  requestTime: string; // ISO string
  status: "PENDING" | "APPROVED" | "REJECTED";
  responseNote?: string;
}

interface ShiftChangeRequestFormProps {
  availableShifts: string[];
  onNewRequest: (req: ShiftChangeRequest) => void;
}

export const ShiftChangeRequestForm: React.FC<ShiftChangeRequestFormProps> = ({
  availableShifts,
  onNewRequest
}) => {
  const [form, setForm] = useState({
    requestingEmployee: "",
    shiftName: "",
    reason: ""
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.requestingEmployee.trim() || !form.shiftName.trim() || !form.reason.trim()) {
      setError("Please fill in all fields");
      return;
    }

    const newRequest: ShiftChangeRequest = {
      id: Date.now(),
      requestingEmployee: form.requestingEmployee.trim(),
      shiftName: form.shiftName.trim(),
      reason: form.reason.trim(),
      requestTime: new Date().toISOString(),
      status: "PENDING"
    };

    onNewRequest(newRequest);
    setForm({ requestingEmployee: "", shiftName: "", reason: "" });
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4">Request Shift Change</h2>
      <form onSubmit={handleSubmit} noValidate>
        <label className="block mb-3">
          Employee Name
          <input
            name="requestingEmployee"
            value={form.requestingEmployee}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded"
            placeholder="Your name"
            required
          />
        </label>

        <label className="block mb-3">
          Shift Name
          <select
            name="shiftName"
            value={form.shiftName}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded"
            required
          >
            <option value="">Select a shift</option>
            {availableShifts.map((shift, idx) => (
              <option key={idx} value={shift}>
                {shift}
              </option>
            ))}
          </select>
        </label>

        <label className="block mb-3">
          Reason for Request
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded"
            placeholder="Explain why you want the shift change"
            required
            rows={3}
          />
        </label>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Submit Request
        </button>
      </form>
    </div>
  );
};
