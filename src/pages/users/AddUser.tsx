import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { UserRole } from '../../contexts/AuthContext';
import {
  UserPlus,
  Save,
  X,
  Upload,
  Shield,
  Award,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Department {
  id: string;
  name: string;
  location: string;
}

interface Skill {
  name: string;
  proficiency: 'CERTIFIED' | 'EXPERIENCED' | 'EXPERT' | null;
}

const departments: Department[] = [
  { id: 'emergency', name: 'Emergency Department', location: 'Main Hospital' },
  { id: 'icu', name: 'Intensive Care Unit', location: 'Main Hospital' },
  { id: 'pediatrics', name: 'Pediatrics', location: 'Children\'s Wing' },
  { id: 'cardiology', name: 'Cardiology', location: 'Main Hospital' },
  { id: 'surgery', name: 'Surgery', location: 'Main Hospital' },
  { id: 'oncology', name: 'Oncology', location: 'Cancer Center' },
  { id: 'neurology', name: 'Neurology', location: 'Main Hospital' },
  { id: 'orthopedics', name: 'Orthopedics', location: 'Main Hospital' },
  { id: 'radiology', name: 'Radiology', location: 'Imaging Center' },
  { id: 'laboratory', name: 'Laboratory', location: 'Main Hospital' },
  { id: 'pharmacy', name: 'Pharmacy', location: 'Main Hospital' },
  { id: 'rehabilitation', name: 'Rehabilitation', location: 'Rehab Center' }
];

const availableSkills = [
  'ACLS', 'BLS', 'Pediatric Care', 'Critical Care', 'Emergency Medicine',
  'ICU Experience', 'Surgical Nursing', 'Cardiac Care', 'Neonatal Care',
  'Geriatric Care', 'Mental Health', 'Wound Care', 'IV Therapy',
  'Medication Administration', 'Patient Assessment', 'Vital Signs Monitoring'
];

const contracts = [
  { id: 'full-time', name: 'Full Time' },
  { id: 'part-time', name: 'Part Time' },
  { id: 'contract', name: 'Contract' },
  { id: 'internship', name: 'Internship' }
];

const steps = [
  { id: 1, name: 'Basic Information', icon: UserPlus },
  { id: 2, name: 'Role & Department', icon: Shield },
  { id: 3, name: 'Review & Submit', icon: CheckCircle }
];

export const AddUser: React.FC = () => {
  const { user: currentUser } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'employee' as UserRole,
    department: '',
    hireDate: '',
    contract: '',
    salary: '',
    skills: [] as Skill[],
    avatar: null as File | null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.hireDate) newErrors.hireDate = 'Hire date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSkillToggle = (skillName: string) => {
    setFormData(prev => {
      const existing = prev.skills.find(s => s.name === skillName);
      return existing
        ? { ...prev, skills: prev.skills.filter(s => s.name !== skillName) }
        : { ...prev, skills: [...prev.skills, { name: skillName, proficiency: null }] };
    });
  };

  const handleProficiencyChange = (skillName: string, level: Skill['proficiency']) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map(skill =>
        skill.name === skillName ? { ...skill, proficiency: level } : skill
      )
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFormData(prev => ({ ...prev, avatar: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (err) {
      console.error('Error creating user:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'employee' as UserRole,
      department: '',
      hireDate: '',
      contract: '',
      salary: '',
      skills: [],
      avatar: null
    });
    setErrors({});
    setActiveStep(1);
  };

  const nextStep = () => setActiveStep(step => Math.min(step + 1, steps.length));
  const prevStep = () => setActiveStep(step => Math.max(step - 1, 1));

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New User</h1>
          <p className="text-gray-600 mt-1">Create a new user account with appropriate permissions</p>
        </div>
        <button 
          onClick={resetForm}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </button>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.id === activeStep;
            const isCompleted = step.id < activeStep;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isActive 
                    ? 'border-blue-600 bg-blue-600 text-white' 
                    : isCompleted 
                    ? 'border-green-600 bg-green-600 text-white'
                    : 'border-gray-300 bg-white text-gray-500'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    isCompleted ? 'bg-green-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow">
        <div className="p-6">
          {/* Step 1: Basic Information */}
          {activeStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.lastName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter email address"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>

                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hire Date *
                  </label>
                  <input
                    type="date"
                    value={formData.hireDate}
                    onChange={(e) => handleInputChange('hireDate', e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.hireDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.hireDate && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.hireDate}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary
                  </label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => handleInputChange('salary', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter annual salary"
                  />
                </div>                
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Picture
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                    {formData.avatar ? (
                      <img 
                        src={URL.createObjectURL(formData.avatar)} 
                        alt="Avatar preview" 
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <UserPlus className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                    </label>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* Step 2: Role & Department */}
          {activeStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Role & Department</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="employee">Registered Nurse</option>
                    <option value="manager">Doctor</option>
                    <option value="admin">Nursing Assistant</option>
                    <option value="admin">Specialist</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.department ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name} - {dept.location}
                      </option>
                    ))}
                  </select>
                  {errors.department && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.department}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contract *
                  </label>
                  <select
                    value={formData.contract}
                    onChange={(e) => handleInputChange('contract', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select contract type</option>
                    {contracts.map(contract => (
                      <option key={contract.id} value={contract.id}>
                        {contract.name}
                      </option>
                    ))}
                  </select>
                </div>


                
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills & Proficiency
                </label>
                <div className="space-y-2">
                  {availableSkills.map(skillName => {
                    const selectedSkill = formData.skills.find(s => s.name === skillName);
                    const isSelected = !!selectedSkill;

                    return (
                      <div key={skillName} className="border rounded p-2 text-sm">
                        <div className="flex items-center justify-between">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSkillToggle(skillName)}
                              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-gray-800">{skillName}</span>
                          </label>

                          {isSelected && (
                            <div className="flex space-x-2 ml-4">
                              {(['CERTIFIED', 'EXPERIENCED', 'EXPERT'] as const).map(level => (
                                <label
                                  key={level}
                                  className="flex items-center space-x-1 text-xs text-gray-600"
                                >
                                  <input
                                    type="radio"
                                    name={`proficiency-${skillName}`}
                                    value={level}
                                    checked={selectedSkill?.proficiency === level}
                                    onChange={() => handleProficiencyChange(skillName, level)}
                                    className="h-3 w-3 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span>{level}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          
          {/* Step 3: Review & Submit */}
          {activeStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Review & Submit</h2>
              
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-medium text-gray-900">User Information Summary</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Name</p>
                    <p className="text-sm text-gray-900">{formData.firstName} {formData.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-sm text-gray-900">{formData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Role</p>
                    <p className="text-sm text-gray-900 capitalize">{formData.role}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Department</p>
                    <p className="text-sm text-gray-900">
                      {departments.find(d => d.id === formData.department)?.name || 'Not selected'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Contract</p>
                    <p className="text-sm text-gray-900">
                      {contracts.find(c => c.id === formData.contract)?.name || 'Not selected'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone</p>
                    <p className="text-sm text-gray-900">{formData.phone || 'Not selected'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Hire Date</p>
                    <p className="text-sm text-gray-900">{formData.hireDate || 'Not selected'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Salary</p>
                    <p className="text-sm text-gray-900">{formData.salary || 'Not selected'}</p>
                  </div>
                </div>

                {formData.skills.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map(skill => (
                        <span key={skill.name} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-800">
                          <Award className="w-3 h-3 mr-1" />
                          {skill.name}
                          {skill.proficiency && (
                            <span className="ml-1 text-blue-600 font-medium">({skill.proficiency})</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={activeStep === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex space-x-3">
            {activeStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating User...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create User
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}; 