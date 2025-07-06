import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Search, 
  Filter, 
  MoreVertical,
  Building2,
  Phone,
  Mail,
  Globe,
  Clock,
  Calendar,
  Target,
  TrendingUp,
  Settings,
  Save,
  X,
  Navigation,
  Car,
  Wifi,
  Coffee,
} from 'lucide-react';

interface Location {
  id: number;
  name: string;
  type: 'Headquarters' | 'Branch Office' | 'Remote Office' | 'Warehouse';
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  email: string;
  manager: string;
  employeeCount: number;
  capacity: number;
  status: 'Active' | 'Inactive' | 'Under Construction';
  timezone: string;
  amenities: string[];
  createdAt: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export const Locations: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'Headquarters' | 'Branch Office' | 'Remote Office' | 'Warehouse'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive' | 'Under Construction'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  const locations: Location[] = [
    {
      id: 1,
      name: 'Main Hospital Campus',
      type: 'Headquarters',
      address: '123 Medical Center Drive',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10001',
      phone: '+1 (555) 123-4567',
      email: 'main@hospital.com',
      manager: 'Dr. Sarah Johnson',
      employeeCount: 450,
      capacity: 600,
      status: 'Active',
      timezone: 'America/New_York',
      amenities: ['Parking', 'Cafeteria', 'Gym', 'Conference Rooms', 'WiFi', 'Medical Library'],
      createdAt: '2023-01-15',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    {
      id: 2,
      name: 'Emergency Care Center',
      type: 'Branch Office',
      address: '456 Emergency Way',
      city: 'Brooklyn',
      state: 'NY',
      country: 'USA',
      postalCode: '11201',
      phone: '+1 (555) 234-5678',
      email: 'emergency@hospital.com',
      manager: 'Dr. Mike Chen',
      employeeCount: 120,
      capacity: 150,
      status: 'Active',
      timezone: 'America/New_York',
      amenities: ['Parking', 'Coffee Bar', 'Meeting Rooms', 'WiFi', 'Helipad'],
      createdAt: '2023-02-01',
      coordinates: { lat: 40.6782, lng: -73.9442 }
    },
    {
      id: 3,
      name: 'Outpatient Clinic',
      type: 'Branch Office',
      address: '789 Health Plaza',
      city: 'Queens',
      state: 'NY',
      country: 'USA',
      postalCode: '11375',
      phone: '+1 (555) 345-6789',
      email: 'outpatient@hospital.com',
      manager: 'Dr. Lisa Wilson',
      employeeCount: 85,
      capacity: 100,
      status: 'Active',
      timezone: 'America/New_York',
      amenities: ['Parking', 'Kitchen', 'Meeting Rooms', 'WiFi', 'Pharmacy'],
      createdAt: '2023-03-15',
      coordinates: { lat: 40.7282, lng: -73.7949 }
    },
    {
      id: 4,
      name: 'Medical Laboratory',
      type: 'Warehouse',
      address: '321 Lab Street',
      city: 'Bronx',
      state: 'NY',
      country: 'USA',
      postalCode: '10451',
      phone: '+1 (555) 456-7890',
      email: 'lab@hospital.com',
      manager: 'Dr. Robert Taylor',
      employeeCount: 45,
      capacity: 60,
      status: 'Active',
      timezone: 'America/New_York',
      amenities: ['Parking', 'Loading Dock', 'Security', 'WiFi', 'Clean Room'],
      createdAt: '2023-04-01',
      coordinates: { lat: 40.8448, lng: -73.8648 }
    },
    {
      id: 5,
      name: 'Rehabilitation Center',
      type: 'Remote Office',
      address: '654 Recovery Road',
      city: 'Staten Island',
      state: 'NY',
      country: 'USA',
      postalCode: '10301',
      phone: '+1 (555) 567-8901',
      email: 'rehab@hospital.com',
      manager: 'Dr. Emily Davis',
      employeeCount: 35,
      capacity: 50,
      status: 'Active',
      timezone: 'America/New_York',
      amenities: ['WiFi', 'Meeting Rooms', 'Coffee', 'Therapy Rooms', 'Gym'],
      createdAt: '2023-05-01',
      coordinates: { lat: 40.5795, lng: -74.1502 }
    },
    {
      id: 6,
      name: 'New Medical Wing',
      type: 'Branch Office',
      address: '999 Expansion Blvd',
      city: 'Manhattan',
      state: 'NY',
      country: 'USA',
      postalCode: '10002',
      phone: '+1 (555) 678-9012',
      email: 'newwing@hospital.com',
      manager: 'Dr. Alex Rodriguez',
      employeeCount: 0,
      capacity: 200,
      status: 'Under Construction',
      timezone: 'America/New_York',
      amenities: [],
      createdAt: '2024-01-01',
      coordinates: { lat: 40.7589, lng: -73.9851 }
    }
  ];

  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         location.manager.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || location.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || location.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Headquarters': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Branch Office': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Remote Office': return 'bg-green-100 text-green-800 border-green-200';
      case 'Warehouse': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'Inactive': return 'bg-red-100 text-red-800 border-red-200';
      case 'Under Construction': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'parking': return <Car className="w-4 h-4" />;
      case 'wifi': return <Wifi className="w-4 h-4" />;
      case 'coffee': case 'coffee bar': case 'cafeteria': return <Coffee className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Location Management</h1>
          <p className="text-gray-600 mt-1">Manage office locations and facilities</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowAddLocation(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Location
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Locations</p>
              <p className="text-2xl font-bold text-gray-900">{locations.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">
                {locations.reduce((sum, loc) => sum + loc.employeeCount, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Capacity</p>
              <p className="text-2xl font-bold text-gray-900">
                {locations.reduce((sum, loc) => sum + loc.capacity, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Locations</p>
              <p className="text-2xl font-bold text-gray-900">
                {locations.filter(l => l.status === 'Active').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search locations by name, city, or manager..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as any)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="Headquarters">Headquarters</option>
                    <option value="Branch Office">Branch Office</option>
                    <option value="Remote Office">Remote Office</option>
                    <option value="Warehouse">Warehouse</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Under Construction">Under Construction</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Locations Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amenities
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLocations.map((location) => (
                <tr key={location.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-blue-600 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{location.name}</div>
                        <div className="text-sm text-gray-500">
                          {location.address}, {location.city}, {location.state} {location.postalCode}
                        </div>
                        <div className="text-sm text-gray-500">{location.country}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{location.manager}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Phone className="w-3 h-3 mr-1" />
                      {location.phone}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Mail className="w-3 h-3 mr-1" />
                      {location.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">{location.employeeCount}</span>
                      <span className="text-sm text-gray-500 mx-1">/</span>
                      <span className="text-sm text-gray-900">{location.capacity}</span>
                    </div>
                    <div className="text-sm text-gray-500">{location.timezone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(location.type)}`}>
                        {location.type}
                      </span>
                      <br />
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(location.status)}`}>
                        {location.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {location.amenities.slice(0, 3).map((amenity, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700">
                          {getAmenityIcon(amenity)}
                          <span className="ml-1">{amenity}</span>
                        </span>
                      ))}
                      {location.amenities.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700">
                          +{location.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setEditingLocation(location)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900 p-1 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 p-1 rounded">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Location Modal */}
      {(showAddLocation || editingLocation) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingLocation ? 'Edit Location' : 'Add New Location'}
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location Name</label>
                  <input
                    type="text"
                    defaultValue={editingLocation?.name}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter location name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    defaultValue={editingLocation?.type}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Headquarters">Headquarters</option>
                    <option value="Branch Office">Branch Office</option>
                    <option value="Remote Office">Remote Office</option>
                    <option value="Warehouse">Warehouse</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    defaultValue={editingLocation?.address}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter street address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      defaultValue={editingLocation?.city}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      defaultValue={editingLocation?.state}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="State"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <input
                      type="text"
                      defaultValue={editingLocation?.country}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Country"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                    <input
                      type="text"
                      defaultValue={editingLocation?.postalCode}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Postal Code"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Manager</label>
                  <input
                    type="text"
                    defaultValue={editingLocation?.manager}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter manager name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                  <input
                    type="number"
                    defaultValue={editingLocation?.capacity}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter capacity"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddLocation(false);
                      setEditingLocation(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingLocation ? 'Update' : 'Create'} Location
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 