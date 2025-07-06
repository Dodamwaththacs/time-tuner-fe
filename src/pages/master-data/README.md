# Master Data Management System

This directory contains the master data management components for Time Tuner's roster allocation system with OptaPlanner integration. These components manage the foundational data that drives the scheduling and optimization algorithms.

## Pages Overview

### 1. Skills Management (`SkillsManagement.tsx`)
**Route:** `/master-data/skills`

A comprehensive skills and certification management system featuring:
- **Medical Skills**: Clinical skills, certifications, and competency levels
- **Skill Categories**: Emergency Medicine, Critical Care, Surgical, Laboratory, etc.
- **Certification Tracking**: Expiration dates, renewal requirements, and status
- **OptaPlanner Integration**: Skill weights and constraints for optimization
- **Skill Requirements**: Department-specific skill requirements and minimum levels
- **Competency Levels**: Beginner, Intermediate, Advanced, Expert with validation
- **Training Programs**: Associated training programs and development paths
- **Skill Matrix**: Visual representation of skills across departments and roles

### 2. Shift Templates (`ShiftTemplates.tsx`)
**Route:** `/master-data/shifts`

A complete shift template management system with:
- **Shift Types**: Day, Evening, Night, Weekend, On-Call, Emergency shifts
- **Template Configuration**: Duration, break times, start/end times, rotation patterns
- **OptaPlanner Constraints**: Hard and soft constraints for each shift type
- **Staffing Requirements**: Minimum/maximum staffing levels per shift type
- **Skill Requirements**: Required skills and certifications for each shift
- **Compensation Rules**: Overtime rates, holiday pay, weekend differentials
- **Rest Periods**: Minimum rest between shifts, consecutive shift limits
- **Department Mapping**: Which departments can use which shift templates

### 3. Holiday Calendar (`HolidayCalendar.tsx`)
**Route:** `/master-data/holidays`

A comprehensive holiday and special day management system including:
- **Holiday Types**: Public holidays, medical holidays, department holidays, training days
- **OptaPlanner Integration**: Holiday weights and scheduling constraints
- **Compensation Rules**: Holiday pay rates and overtime calculations
- **Staffing Impact**: How holidays affect minimum staffing requirements
- **Advance Planning**: Advance notice requirements and scheduling preparation
- **Department-Specific**: Holidays that apply to specific departments only
- **Calendar View**: Visual calendar representation of holidays
- **Import/Export**: Bulk holiday management and calendar synchronization

## Features

### Common Features Across All Pages
- **Healthcare Focus**: Medical-specific skills, shifts, and holiday management
- **OptaPlanner Integration**: Direct integration with optimization algorithms
- **Role-Based Access Control**: Admin-only access for master data management
- **Modern UI/UX**: Clean, professional design with Tailwind CSS
- **Responsive Design**: Mobile-first approach for on-the-go management
- **Data Validation**: Comprehensive validation for critical master data
- **Audit Trail**: Track all changes to master data with timestamps

### Data Management
- **Healthcare Mock Data**: Realistic medical skills, shifts, and holiday data
- **Type Safety**: Full TypeScript support with healthcare-specific interfaces
- **State Management**: React hooks for local state management
- **Form Handling**: Controlled components with medical validation
- **Bulk Operations**: Import/export and bulk editing capabilities

### Navigation Integration
- **Sidebar Integration**: All pages accessible through master data navigation
- **Breadcrumb Support**: Ready for breadcrumb navigation implementation
- **Route Protection**: All routes protected and require admin authentication

## File Structure

```
src/pages/master-data/
├── index.ts              # Export file for all components
├── SkillsManagement.tsx  # Skills and certification management
├── ShiftTemplates.tsx    # Shift template management
├── HolidayCalendar.tsx   # Holiday and special day management
└── README.md            # This documentation file
```

## Usage

### Navigation
Users can access these pages through:
1. **Sidebar Navigation**: Master Data section in the sidebar
2. **Direct URLs**: 
   - `/master-data/skills` - Skills and certification management
   - `/master-data/shifts` - Shift template management
   - `/master-data/holidays` - Holiday calendar management

### Permissions
- **Admin**: Full access to all master data management features
- **Manager**: No access (redirected or hidden from navigation)
- **Doctor/Nurse**: No access (redirected or hidden from navigation)

## Key Features by Page

### Skills Management Page
- **Skill Categories**: Medical specialties and skill domains
- **Certification Tracking**: Expiration dates and renewal management
- **Competency Levels**: Skill proficiency assessment and validation
- **OptaPlanner Weights**: Skill importance in optimization algorithms
- **Department Mapping**: Skills required by each department
- **Training Integration**: Associated training programs and development

### Shift Templates Page
- **Shift Types**: Various shift patterns and schedules
- **Duration Management**: Shift length and break time configuration
- **OptaPlanner Constraints**: Hard and soft constraints for optimization
- **Staffing Rules**: Minimum and maximum staffing requirements
- **Compensation Configuration**: Pay rates and differentials
- **Rest Periods**: Work-life balance and safety regulations

### Holiday Calendar Page
- **Holiday Types**: Different categories of holidays and special days
- **OptaPlanner Integration**: Holiday impact on scheduling optimization
- **Compensation Rules**: Holiday pay and overtime calculations
- **Staffing Impact**: How holidays affect minimum staffing
- **Advance Planning**: Notice periods and preparation requirements
- **Calendar View**: Visual representation of holiday schedule

## OptaPlanner Integration

### Key Features
- **Constraint Configuration**: Hard and soft constraints for each master data type
- **Weight Assignment**: Importance weights for optimization algorithms
- **Scheduling Impact**: How master data affects roster generation
- **Real-time Updates**: Immediate impact on optimization when data changes
- **Validation Rules**: Ensure data consistency for optimization

### Master Data Impact
- **Skills**: Required skills affect staff assignment and coverage
- **Shifts**: Shift templates define scheduling patterns and constraints
- **Holidays**: Holiday calendar affects availability and compensation

## Future Enhancements

### Planned Features
- **Real API Integration**: Replace mock data with actual healthcare system APIs
- **OptaPlanner Solver**: Real-time optimization engine integration
- **Advanced Analytics**: Master data performance and utilization metrics
- **Workflow Integration**: Connect master data to actual scheduling processes
- **Audit Trail**: Track all master data changes with approval workflows
- **Import/Export**: Bulk data import and export for system migration
- **Validation Engine**: Advanced validation rules and business logic

### Technical Improvements
- **OptaPlanner API**: Direct integration with OptaPlanner solver
- **State Management**: Consider Redux/Zustand for complex master data state
- **Form Libraries**: Integrate React Hook Form or Formik for master data forms
- **Data Validation**: Add server-side validation for master data integrity
- **Real-time Updates**: WebSocket integration for live master data updates
- **Caching**: Implement data caching for better performance
- **Offline Support**: Basic offline functionality for critical master data

## Dependencies

- **React**: Core framework
- **React Router**: Navigation and routing
- **Lucide React**: Icons
- **Tailwind CSS**: Styling
- **TypeScript**: Type safety
- **OptaPlanner**: Optimization engine (planned integration)

## Contributing

When adding new features to the master data management system:
1. Follow the existing code patterns and structure
2. Add proper TypeScript interfaces for healthcare data types
3. Include proper error handling and loading states
4. Test responsive design on different screen sizes
5. Update this README with new features
6. Ensure role-based access control is properly implemented
7. Consider OptaPlanner integration requirements
8. Validate healthcare-specific business rules
9. Maintain data integrity and consistency
10. Document any new master data relationships 