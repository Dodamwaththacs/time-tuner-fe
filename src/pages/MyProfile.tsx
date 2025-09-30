import React from 'react';
import { 
  User, 
  Building2, 
  Award, 
  Heart, 
  Mail, 
  Phone, 
  Calendar,
  Badge,
  MapPin,
  Clock,
  Star,
  CheckCircle,
  AlertTriangle,
  Edit,
  Settings,
  Camera
} from 'lucide-react';


import type { Employee } from '../api/employee';
import { employeeAPI } from '../api/employee';


// Dummy data from the provided JSON
// const dummyUserProfile: Employee = {
//   "id": "123e4567-e89b-12d3-a456-426655440001",
//   "employeeCode": "EMP001",
//   "firstName": "Jessica",
//   "lastName": "Martinez",
//   "email": "j.martinez@stmarys.com",
//   "phone": "+1-555-0201",
//   "hireDate": "2023-03-15",
//   "active": true,
//   "userAccount": {
//     "username": "jessica.martinez",
//     "email": "j.martinez@stmarys.com",
//     "userRole": "EMPLOYEE",
//     "avatar": "https://www.shutterstock.com/image-photo/close-head-shot-portrait-preppy-600nw-1433809418.jpg"
//   },
//   "primaryRole": {
//     "roleName": "Registered Nur",
//     "description": "Licensed nursing professional"
//   },
//   "primaryDepartment": {
//     "departmentName": "Intensive Care Unit",
//     "location": "Building A - Floor 3"
//   },
//   "contract": {
//     "contractName": "Full-Time RN",
//     "ftePercentage": 1,
//   },
//   "skills": [
//     {
//       "skillName": "BLS Certification",
//       "proficiencyLevel": "CERTIFIED",
//       "certifiedDate": "2023-02-01",
//       "expiryDate": "2025-02-01"
//     },
//     {
//       "skillName": "ACLS Certification",
//       "proficiencyLevel": "CERTIFIED",
//       "certifiedDate": "2023-02-15",
//       "expiryDate": "2025-02-15"
//     },
//     {
//       "skillName": "Critical Care",
//       "proficiencyLevel": "EXPERIENCED",
//       "certifiedDate": "2023-03-01",
//       "expiryDate": null
//     }
//   ],
//   "preferences": [
//     {
//       "shiftType": "Night Shift",
//       "department": "Intensive Care Unit",
//       "preferenceType": "PREFER",
//       "preferenceWeight": null
//     },
//     {
//       "shiftType": "Morning Shift",
//       "department": "Intensive Care Unit",
//       "preferenceType": "PREFER",
//       "preferenceWeight": null
//     }
//   ]
// };

const MyProfile: React.FC = () => {

  const [profile, setProfile] = React.useState<Employee | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const employee = await employeeAPI.getEmployeeWithDetails();
        setProfile(employee);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Null check
  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Profile not found</p>
        </div>
      </div>
    );
  }

  const getProficiencyColor = (level: string) => {
    switch (level) {
      case 'CERTIFIED': return 'bg-green-100 text-green-800';
      case 'EXPERIENCED': return 'bg-blue-100 text-blue-800';
      case 'ADVANCED': return 'bg-purple-100 text-purple-800';
      case 'BEGINNER': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPreferenceColor = (type: string) => {
    switch (type) {
      case 'PREFER': return 'bg-green-100 text-green-800';
      case 'DISLIKE': return 'bg-red-100 text-red-800';
      case 'NEUTRAL': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isSkillExpiringSoon = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const timeDiff = expiry.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff <= 90 && daysDiff > 0; // Expiring within 90 days
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Enhanced Header Section */}
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          
          <div className="relative p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              {/* Profile Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="relative group">
                  {profile.userAccount.avatar ? (
                    <img
                      src={profile.userAccount.avatar}
                      alt={`${profile.firstName} ${profile.lastName}`}
                      className="w-28 h-28 lg:w-32 lg:h-32 rounded-2xl border-4 border-white/20 shadow-2xl object-cover transition-transform group-hover:scale-105"
                      onError={(e) => {
                        // Fallback to default avatar if image fails to load
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  
                  {/* Default Avatar Fallback */}
                  <div className={`w-28 h-28 lg:w-32 lg:h-32 rounded-2xl border-4 border-white/20 shadow-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center transition-transform group-hover:scale-105 ${profile.userAccount.avatar ? 'hidden' : ''}`}>
                    <span className="text-white text-2xl lg:text-3xl font-bold">
                      {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                    </span>
                  </div>
                  
                  <button className="absolute -bottom-2 -right-2 p-2 bg-white text-blue-600 rounded-xl shadow-lg hover:shadow-xl transition-all group-hover:scale-105">
                    <Camera size={16} />
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                      {profile.firstName} {profile.lastName}
                    </h1>
                    <p className="text-blue-100 text-xl lg:text-2xl font-medium mt-1">
                      {profile.primaryRole.roleName}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 text-blue-200">
                      <Badge size={16} />
                      <span className="font-medium">ID: {profile.employeeCode}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 ${
                        profile.active 
                          ? 'bg-green-500/20 text-green-100 border border-green-400/30' 
                          : 'bg-red-500/20 text-red-100 border border-red-400/30'
                      }`}>
                        <CheckCircle size={16} />
                        {profile.active ? 'Active Employee' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-blue-200">
                    <Building2 size={16} />
                    <span>{profile.primaryDepartment.departmentName}</span>
                    <span className="text-blue-300">•</span>
                    <MapPin size={16} />
                    <span>{profile.primaryDepartment.location}</span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              {/* <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl transition-all hover:scale-105 font-semibold">
                  <Edit size={18} />
                  Edit Profile
                </button>
                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-700 hover:bg-blue-50 rounded-xl transition-all hover:scale-105 font-semibold shadow-lg">
                  <Settings size={18} />
                  Settings
                </button>
              </div> */}
            </div>
          </div>
        </div>

        {/* Enhanced Main Content Grid */}
        <div className="p-8 lg:p-12 space-y-8">
          
          {/* Information Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Personal Information */}
            <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                  <User className="text-blue-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <Mail className="text-blue-500" size={18} />
                    <span className="font-semibold text-gray-700">Email</span>
                  </div>
                  <span className="text-gray-800 font-medium mt-2 sm:mt-0">{profile.email}</span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <Phone className="text-green-500" size={18} />
                    <span className="font-semibold text-gray-700">Phone</span>
                  </div>
                  <span className="text-gray-800 font-medium mt-2 sm:mt-0">{profile.phone}</span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <User className="text-purple-500" size={18} />
                    <span className="font-semibold text-gray-700">Username</span>
                  </div>
                  <span className="text-gray-800 font-medium mt-2 sm:mt-0">{profile.userAccount.username}</span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <Badge className="text-orange-500" size={18} />
                    <span className="font-semibold text-gray-700">User Role</span>
                  </div>
                  <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-4 py-2 rounded-xl text-sm font-semibold border border-blue-200 mt-2 sm:mt-0">
                    {profile.userAccount.userRole}
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <Calendar className="text-indigo-500" size={18} />
                    <span className="font-semibold text-gray-700">Hire Date</span>
                  </div>
                  <span className="text-gray-800 font-medium mt-2 sm:mt-0">{formatDate(profile.hireDate)}</span>
                </div>
              </div>
            </div>

            {/* Work Information */}
            <div className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                  <Building2 className="text-green-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Work Information</h2>
              </div>
              
              <div className="space-y-6">
                <div className="p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <User className="text-blue-600" size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg mb-1">Primary Role</h3>
                      <p className="text-xl font-semibold text-blue-600 mb-2">{profile.primaryRole.roleName}</p>
                      <p className="text-gray-600">{profile.primaryRole.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                      <Building2 className="text-purple-600" size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg mb-1">Department</h3>
                      <p className="text-xl font-semibold text-purple-600 mb-2">{profile.primaryDepartment.departmentName}</p>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin size={16} />
                        <span>{profile.primaryDepartment.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                      <Award className="text-orange-600" size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg mb-1">Contract</h3>
                      <p className="text-xl font-semibold text-orange-600 mb-2">{profile.contract.contractName}</p>
                      <div className="flex items-center gap-2">
                        <span className="bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800 px-3 py-1 rounded-lg text-sm font-semibold">
                          FTE: {(profile.contract.ftePercentage * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

          {/* Enhanced Skills Section */}
          <div className="mt-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Award className="text-yellow-600" size={28} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Skills & Certifications</h2>
                <p className="text-gray-600 mt-1">Professional competencies and certifications</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {profile.skills.map((skill, index) => (
                <div key={index} className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                  {/* Background Decoration */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -translate-y-10 translate-x-10 opacity-50 group-hover:opacity-70 transition-opacity"></div>
                  
                  <div className="relative">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                          <Star className="text-blue-600" size={20} />
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg">{skill.skillName}</h3>
                      </div>
                      
                      {skill.expiryDate && isSkillExpiringSoon(skill.expiryDate) && (
                        <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs px-3 py-2 rounded-xl font-semibold border border-yellow-200">
                          <AlertTriangle size={14} />
                          Expiring Soon
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${getProficiencyColor(skill.proficiencyLevel)} border`}>
                        <CheckCircle size={14} />
                        {skill.proficiencyLevel}
                      </span>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={16} className="text-green-500" />
                        <span className="font-medium">Certified:</span>
                        <span className="font-semibold">{formatDate(skill.certifiedDate)}</span>
                      </div>
                      
                      {skill.expiryDate && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock size={16} className="text-red-500" />
                          <span className="font-medium">Expires:</span>
                          <span className="font-semibold">{formatDate(skill.expiryDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Preferences Section */}
          <div className="mt-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-pink-100 rounded-xl">
                <Heart className="text-pink-600" size={28} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Shift Preferences</h2>
                <p className="text-gray-600 mt-1">Your preferred working arrangements</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.preferences.map((preference, index) => (
                <div key={index} className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                  {/* Background Decoration */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full -translate-y-8 translate-x-8 opacity-50 group-hover:opacity-70 transition-opacity"></div>
                  
                  <div className="relative">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                          <Clock className="text-indigo-600" size={20} />
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg">{preference.shiftType}</h3>
                      </div>
                      
                      <span className={`px-4 py-2 rounded-xl text-sm font-bold ${getPreferenceColor(preference.preferenceType)} border flex items-center gap-2`}>
                        <Heart size={14} />
                        {preference.preferenceType}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Building2 size={16} className="text-purple-500" />
                        <span className="font-medium">Department:</span>
                        <span className="font-semibold">{preference.department}</span>
                      </div>
                      
                      {preference.preferenceWeight && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Star size={16} className="text-yellow-500" />
                          <span className="font-medium">Weight:</span>
                          <span className="font-semibold">{preference.preferenceWeight}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;