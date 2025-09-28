import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import type { UserRole } from "../../contexts/AuthContext";
import {
  UserPlus,
  Save,
  X,
  Upload,
  Shield,
  Award,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { departmentAPI } from "../../api/department";
import { contractAPI } from "../../api/contract";
import { roleAPI } from "../../api/role";
import { skillAPI } from "../../api/skill";
import { employeeAPI } from "../../api/employee";
import type { Department } from "../../api/department";
import type { ContractType } from "../../api/contract";
import type { Role } from "../../api/role";

interface Skill {
  id: string;
  skillName: string;
  description: string;
}

interface EmployeeSkill {
  skill: Skill;
  proficiency: "CERTIFIED" | "EXPERIENCED" | "EXPERT" | null;
}




const steps = [
  { id: 1, name: "Basic Information", icon: UserPlus },
  { id: 2, name: "Role & Department", icon: Shield },
  { id: 3, name: "Contract Information", icon: Award },
  { id: 4, name: "Review & Submit", icon: CheckCircle },
];

export const AddEmployee: React.FC = () => {
  const { user: currentUser } = useAuth();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [contracts, setContracts] = useState<ContractType[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch departments
        const departmentsResponse = await departmentAPI.getAllByOrganization();
        console.log("Fetched departments:", departmentsResponse);
        setDepartments(departmentsResponse);

        // Fetch contracts
        const contractsResponse = await contractAPI.getAllContractTypes();
        console.log("Fetched contracts:", contractsResponse);
        setContracts(contractsResponse);

        // Load roles from API
        const rolesResponse = await roleAPI.getAllRoles();
        const activeRoles = rolesResponse.filter(role => role.active);
        setRoles(activeRoles);
        console.log("Loaded roles:", activeRoles);

        // Fetch skills
        const skillsResponse = await skillAPI.getAllSkills();
        console.log("Fetched skills:", skillsResponse);
        setSkills(skillsResponse);

      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    contractStart: "",
    contractEnd: "",
    ftePercentage: 0,
    activeContract: false,
    role: "employee" as UserRole,
    department: "",
    hireDate: "",
    contract: "",
    salary: "",
    skills: [] as EmployeeSkill[],
    avatar: null as File | null,
    organization : "123e4567-e89b-12d3-a456-426655440001",

  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.hireDate) newErrors.hireDate = "Hire date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSkillToggle = (skill: Skill) => {
    setFormData((prev) => {
      const existing = prev.skills.find((s) => s.skill.id === skill.id);
      return existing
        ? { ...prev, skills: prev.skills.filter((s) => s.skill.id !== skill.id) }
        : {
            ...prev,
            skills: [...prev.skills, { skill, proficiency: null }],
          };
    });
  };

  const handleProficiencyChange = (
    skill: Skill,
    level: "CERTIFIED" | "EXPERIENCED" | "EXPERT"
  ) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.map((employeeSkill) =>
        employeeSkill.skill.id === skill.id ? { ...employeeSkill, proficiency: level } : employeeSkill
      ),
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFormData((prev) => ({ ...prev, avatar: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    
    // Create the payload in the required format
    const payload = {
      id: crypto.randomUUID(), // Generate a new UUID for the employee
      employeeCode: `EMP${Date.now()}`, // Generate employee code
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      hireDate: formData.hireDate,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      roles: formData.role ? [formData.role] : [],
      skills: formData.skills.map(employeeSkill => employeeSkill.skill.id),
      departments: formData.department ? [formData.department] : [],
      organization: formData.organization
    };
    
    console.log("Payload to be sent:", payload);
    
    try {
      // API call to create employee
      const response = await employeeAPI.createEmployee(payload);
      console.log("Employee created successfully:", response);
      
      // Reset form on success
      resetForm();
      alert("Employee created successfully!");
    } catch (err) {
      console.error("Error creating employee:", err);
      alert("Failed to create employee. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "employee" as UserRole,
      department: "",
      hireDate: "",
      contract: "",
      salary: "",
      skills: [] as EmployeeSkill[],
      avatar: null,
      contractStart: "",
      contractEnd: "",
      ftePercentage: 0,
      activeContract: false,
      organization : "123e4567-e89b-12d3-a456-426655440001",
    });
    setErrors({});
    setActiveStep(1);
  };


  const nextStep = () =>
    setActiveStep((step) => Math.min(step + 1, steps.length));
  const prevStep = () => setActiveStep((step) => Math.max(step - 1, 1));

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New User</h1>
          <p className="text-gray-600 mt-1">
            Create a new user account with appropriate permissions
          </p>
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
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isActive
                      ? "border-blue-600 bg-blue-600 text-white"
                      : isCompleted
                      ? "border-green-600 bg-green-600 text-white"
                      : "border-gray-300 bg-white text-gray-500"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <div className="ml-3">
                  <p
                    className={`text-sm font-medium ${
                      isActive
                        ? "text-blue-600"
                        : isCompleted
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {step.name}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-4 ${
                      isCompleted ? "bg-green-600" : "bg-gray-300"
                    }`}
                  />
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
              <h2 className="text-xl font-semibold text-gray-900">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
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
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
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
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? "border-red-500" : "border-gray-300"
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
                    onChange={(e) => handleInputChange("phone", e.target.value)}
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
                    onChange={(e) =>
                      handleInputChange("hireDate", e.target.value)
                    }
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.hireDate ? "border-red-500" : "border-gray-300"
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
                    onChange={(e) =>
                      handleInputChange("salary", e.target.value)
                    }
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
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG or GIF. Max 2MB.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Role & Department */}
          {activeStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Role & Department
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.role ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select a role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.roleName}
                      </option>
                    ))}
                  </select>
                  {formData.role && (
                    <p className="mt-1 text-sm text-gray-500">
                      {roles.find(r => r.id === formData.role)?.description}
                    </p>
                  )}
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.role}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) =>
                      handleInputChange("department", e.target.value)
                    }
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.department ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.departmentName} - {dept.location}
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
                    onChange={(e) =>
                      handleInputChange("contract", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select contract type</option>
                    {contracts.map((contract) => (
                      <option key={contract.id} value={contract.id}>
                        {contract.contractName}
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
                  {skills.map((skill) => {
                    const selectedSkill = formData.skills.find(
                      (s) => s.skill.id === skill.id
                    );
                    const isSelected = !!selectedSkill;

                    return (
                      <div
                        key={skill.id}
                        className="border rounded p-2 text-sm"
                      >
                        <div className="flex items-center justify-between">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSkillToggle(skill)}
                              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <div>
                              <span className="text-gray-800">{skill.skillName}</span>
                              <p className="text-xs text-gray-500 mt-1">{skill.description}</p>
                            </div>
                          </label>

                          {isSelected && (
                            <div className="flex space-x-2 ml-4">
                              {(
                                ["CERTIFIED", "EXPERIENCED", "EXPERT"] as const
                              ).map((level) => (
                                <label
                                  key={level}
                                  className="flex items-center space-x-1 text-xs text-gray-600"
                                >
                                  <input
                                    type="radio"
                                    name={`proficiency-${skill.id}`}
                                    value={level}
                                    checked={
                                      selectedSkill?.proficiency === level
                                    }
                                    onChange={() =>
                                      handleProficiencyChange(skill, level)
                                    }
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

          {/* Contract Information */}
          {activeStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Contract Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contract Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.contractStart}
                    onChange={(e) =>
                      handleInputChange("contractStart", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contract End Date *
                  </label>
                  <input
                    type="date"
                    value={formData.contractEnd}
                    onChange={(e) =>
                      handleInputChange("contractEnd", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    FTE Percentage
                  </label>
                  <input
                    type="number"
                    value={formData.ftePercentage}
                    onChange={(e) =>
                      handleInputChange("ftePercentage", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter FTE percentage"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Please enter a value between 0 and 100.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Active Contract
                  </label>
                  <select
                    value={formData.activeContract ? "true" : "false"}
                    onChange={(e) =>
                      handleInputChange(
                        "activeContract",
                        e.target.value === "true"
                      )
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {activeStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Review & Submit
              </h2>

              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  User Information Summary
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Name</p>
                    <p className="text-sm text-gray-900">
                      {formData.firstName} {formData.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-sm text-gray-900">{formData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Role</p>
                    <p className="text-sm text-gray-900 capitalize">
                      {formData.role}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Department
                    </p>
                    <p className="text-sm text-gray-900">
                      {departments.find((d) => d.id === formData.department)
                        ?.departmentName || "Not selected"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Contract
                    </p>
                    <p className="text-sm text-gray-900">
                      {contracts.find((c) => c.id === formData.contract)
                        ?.contractName || "Not selected"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone</p>
                    <p className="text-sm text-gray-900">
                      {formData.phone || "Not selected"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Hire Date
                    </p>
                    <p className="text-sm text-gray-900">
                      {formData.hireDate || "Not selected"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Salary</p>
                    <p className="text-sm text-gray-900">
                      {formData.salary || "Not selected"}
                    </p>
                  </div>
                </div>

                {formData.skills.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Skills
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((employeeSkill) => (
                        <span
                          key={employeeSkill.skill.id}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-800"
                        >
                          <Award className="w-3 h-3 mr-1" />
                          {employeeSkill.skill.skillName}
                          {employeeSkill.proficiency && (
                            <span className="ml-1 text-blue-600 font-medium">
                              ({employeeSkill.proficiency})
                            </span>
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
                onClick={handleSubmit}
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
