import React, { useState } from 'react';

interface DepartmentFormData {
  department_name: string;
  description: string;
  location: string;
  active: boolean;
}

const initialForm: DepartmentFormData = {
  department_name: '',
  description: '',
  location: '',
  active: true,
};

export const AddDepartment: React.FC = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.department_name.trim()) newErrors.department_name = 'Department name is required';
    if (!form.location.trim()) newErrors.location = 'Location is required';
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value,
      }));
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      console.log('Department added:', form);
      setForm(initialForm);
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add Department</h2>
      {submitted && (
        <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">Department added successfully!</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Department Name *</label>
          <input
            type="text"
            name="department_name"
            value={form.department_name}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${errors.department_name ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter department name"
          />
          {errors.department_name && <div className="text-red-600 text-sm mt-1">{errors.department_name}</div>}
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter description"
            rows={2}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Location *</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter location"
          />
          {errors.location && <div className="text-red-600 text-sm mt-1">{errors.location}</div>}
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            name="active"
            checked={form.active}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="font-medium">Active</label>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Department
        </button>
      </form>
    </div>
  );
};

export default AddDepartment; 