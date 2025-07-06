# Organization Management Pages

This directory contains the comprehensive organization management system for Time Tuner's roster allocation system with OptaPlanner integration.

## Pages Overview

### 1. Departments (`Departments.tsx`)
**Route:** `/organization/departments`

A comprehensive department management system for healthcare facilities featuring:
- **Healthcare Department Structure**: Emergency, ICU, OR, Laboratory departments with medical staffing requirements
- **OptaPlanner Integration**: Configuration for optimization algorithms and constraint weights
- **Staffing Requirements**: Minimum/maximum staffing levels per shift with skill requirements
- **Scheduling Constraints**: Medical-specific constraints like consecutive night shift limits, weekend rotations
- **Department Hierarchy**: Parent-child relationships for complex medical departments
- **Optimization Priority**: High/Medium/Low priority levels for OptaPlanner optimization
- **Skill Management**: Required medical skills and certifications for each department
- **Budget Tracking**: Department budgets and total organizational spending

### 2. Locations (`Locations.tsx`)
**Route:** `/organization/locations`

A complete healthcare facility management system with:
- **Healthcare Facility Types**: Main Hospital, Emergency Centers, Outpatient Clinics, Laboratories, Rehabilitation Centers
- **Medical Amenities**: Helipads, clean rooms, therapy rooms, medical libraries, pharmacies
- **Capacity Management**: Patient capacity vs. staff capacity for each facility
- **Geographic Distribution**: Multiple locations across different boroughs/cities
- **Medical Contact Information**: Department managers, medical staff contacts
- **Facility Status**: Active, Inactive, Under Construction for new medical wings
- **Timezone Support**: Location-specific timezone management for 24/7 operations

### 3. BusinessRules (`BusinessRules.tsx`)
**Route:** `/organization/rules`

A sophisticated business rules engine for healthcare scheduling with:
- **Healthcare-Specific Rules**: Medical staffing requirements, emergency coverage, skill-based assignments
- **OptaPlanner Rules**: Optimization algorithms, constraint weighting, automated roster generation
- **Medical Compliance**: Break time enforcement, overtime limits, labor law compliance
- **Scheduling Constraints**: Consecutive shift limits, weekend fairness, emergency coverage
- **Rule Categories**: Scheduling, Overtime, Compliance, Leave Management with medical focus
- **Automation Rules**: OptaPlanner integration for optimal roster generation
- **Role-Based Impact**: Rules affecting nurses, doctors, managers, and administrators

## Features

### Common Features Across All Pages
- **Healthcare Focus**: Medical department structure and healthcare facility management
- **OptaPlanner Integration**: Optimization algorithms and constraint configuration
- **Role-Based Access Control**: Medical staff roles (nurse, doctor, manager, admin)
- **Modern UI/UX**: Clean, professional design with Tailwind CSS
- **Responsive Design**: Mobile-first approach for on-the-go medical staff
- **Loading States**: Proper loading indicators and disabled states
- **Error Handling**: User-friendly error messages for medical staff

### Data Management
- **Healthcare Mock Data**: Realistic medical department and facility data
- **Type Safety**: Full TypeScript support with healthcare-specific interfaces
- **State Management**: React hooks for local state management
- **Form Handling**: Controlled components with medical validation

### Navigation Integration
- **Sidebar Integration**: All pages accessible through healthcare organization navigation
- **Breadcrumb Support**: Ready for breadcrumb navigation implementation
- **Route Protection**: All routes protected and require medical staff authentication

## File Structure

```
src/pages/organization/
├── index.ts              # Export file for all components
├── Departments.tsx       # Healthcare department management
├── Locations.tsx         # Healthcare facility management
├── BusinessRules.tsx     # Medical scheduling rules and OptaPlanner config
└── README.md            # This documentation file
```

## Usage

### Navigation
Users can access these pages through:
1. **Sidebar Navigation**: Organization section in the sidebar
2. **Direct URLs**: 
   - `/organization/departments` - Healthcare department management
   - `/organization/locations` - Healthcare facility management
   - `/organization/rules` - Medical scheduling rules and OptaPlanner config

### Permissions
- **Admin**: Full access to all organization management features
- **Manager**: Limited access (view and edit department configurations)
- **Doctor/Nurse**: No access (redirected or hidden from navigation)

## Key Features by Page

### Departments Page
- **Healthcare Departments**: Emergency, ICU, OR, Laboratory with medical staffing
- **OptaPlanner Config**: Hard/soft score weights, time windows, max overtime
- **Medical Skills**: Required certifications and skills for each department
- **Scheduling Constraints**: Medical-specific constraints and requirements
- **Staffing Levels**: Minimum/maximum staffing with optimization priorities

### Locations Page
- **Healthcare Facilities**: Hospitals, clinics, labs, rehabilitation centers
- **Medical Amenities**: Helipads, clean rooms, therapy rooms, medical equipment
- **Capacity Planning**: Patient and staff capacity monitoring
- **Geographic Distribution**: Multiple medical facility locations
- **Medical Contact Management**: Department managers and medical staff contacts

### Business Rules Page
- **Healthcare Rules**: Medical staffing, emergency coverage, skill requirements
- **OptaPlanner Integration**: Optimization algorithms and constraint management
- **Medical Compliance**: Break time, overtime, labor law enforcement
- **Scheduling Automation**: Automated roster generation with OptaPlanner
- **Constraint Weighting**: Department-specific optimization parameters

## OptaPlanner Integration

### Key Features
- **Constraint Configuration**: Hard and soft constraint weights for each department
- **Optimization Algorithms**: Automated roster generation with medical constraints
- **Time Windows**: Configurable optimization periods (7, 14, 21, 28 days)
- **Overtime Limits**: Department-specific maximum overtime configurations
- **Skill Matching**: Automatic assignment based on medical skills and certifications

### Business Rules
- **OptaPlanner Optimization**: Core rule for automated roster generation
- **Constraint Weighting**: Department-specific optimization parameters
- **Emergency Coverage**: Critical medical staffing requirements
- **Skill-Based Assignment**: Medical skill and certification matching

## Future Enhancements

### Planned Features
- **Real API Integration**: Replace mock data with actual healthcare system APIs
- **OptaPlanner Solver**: Real-time optimization engine integration
- **Medical Analytics**: Department performance and staffing efficiency metrics
- **Geographic Mapping**: Interactive maps for healthcare facility locations
- **Rule Testing**: Test environment for business rules and OptaPlanner constraints
- **Audit Trail**: Track all healthcare organization changes
- **Import/Export**: Bulk data import and export for medical departments
- **Workflow Integration**: Connect rules to actual healthcare scheduling processes

### Technical Improvements
- **OptaPlanner API**: Direct integration with OptaPlanner solver
- **State Management**: Consider Redux/Zustand for complex healthcare state
- **Form Libraries**: Integrate React Hook Form or Formik for medical forms
- **Data Validation**: Add server-side validation for healthcare data
- **Real-time Updates**: WebSocket integration for live healthcare updates
- **Caching**: Implement data caching for better performance
- **Offline Support**: Basic offline functionality for critical medical features

## Dependencies

- **React**: Core framework
- **React Router**: Navigation and routing
- **Lucide React**: Icons
- **Tailwind CSS**: Styling
- **TypeScript**: Type safety
- **OptaPlanner**: Optimization engine (planned integration)

## Contributing

When adding new features to the healthcare organization management system:
1. Follow the existing code patterns and structure
2. Add proper TypeScript interfaces for healthcare data types
3. Include proper error handling and loading states
4. Test responsive design on different screen sizes
5. Update this README with new features
6. Ensure role-based access control is properly implemented
7. Consider OptaPlanner integration requirements
8. Validate healthcare-specific business rules 