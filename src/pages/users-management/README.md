# User Management Pages

This directory contains the comprehensive user management system for Time Tuner.

## Pages Overview

### 1. UserList (`UserList.tsx`)
**Route:** `/users/list` or `/users`

A comprehensive user management dashboard featuring:
- **Advanced Search & Filtering**: Search by name, email, department with role and status filters
- **User Statistics**: Real-time counts of total, active, inactive, and pending users
- **Bulk Operations**: Select multiple users for batch actions
- **Detailed User Table**: Shows user info, role, status, department, location, and last login
- **Quick Actions**: Add user, bulk import, export functionality
- **User Actions**: View, edit, delete individual users
- **Responsive Design**: Works on desktop and mobile devices

### 2. RolesPermissions (`RolesPermissions.tsx`)
**Route:** `/users/roles`

A complete role and permissions management system with:
- **Role Management**: View, edit, and create user roles (Admin, Manager, Employee)
- **Permissions Matrix**: Visual grid showing which permissions each role has
- **Permission Categories**: Organized by User Management, Schedule Management, Reports, etc.
- **User Assignments**: Track role distribution and recent role changes
- **Role Details**: Shows user count, description, and key permissions for each role
- **Add/Edit Roles**: Modal forms for creating and modifying roles

### 3. AddUser (`AddUser.tsx`)
**Route:** `/users/add`

A multi-step user creation form with:
- **Step 1 - Basic Information**: Name, email, password, phone, profile picture
- **Step 2 - Role & Department**: Role selection, department assignment, location, manager, skills
- **Step 3 - Employment Details**: Hire date, start date, salary information
- **Step 4 - Review & Submit**: Summary of all entered information
- **Form Validation**: Real-time validation with error messages
- **Progress Indicator**: Visual step-by-step progress
- **Responsive Design**: Optimized for all screen sizes

## Features

### Common Features Across All Pages
- **Role-Based Access Control**: Pages respect user permissions
- **Modern UI/UX**: Clean, professional design with Tailwind CSS
- **Responsive Design**: Mobile-first approach
- **Loading States**: Proper loading indicators and disabled states
- **Error Handling**: User-friendly error messages
- **Accessibility**: Proper ARIA labels and keyboard navigation

### Data Management
- **Mock Data**: Currently uses realistic sample data
- **Type Safety**: Full TypeScript support with proper interfaces
- **State Management**: React hooks for local state management
- **Form Handling**: Controlled components with validation

### Navigation Integration
- **Sidebar Integration**: All pages are accessible through the sidebar navigation
- **Breadcrumb Support**: Ready for breadcrumb navigation implementation
- **Route Protection**: All routes are protected and require authentication

## File Structure

```
src/pages/users/
├── index.ts              # Export file for all components
├── UserList.tsx          # User list and management page
├── RolesPermissions.tsx  # Roles and permissions management
├── AddUser.tsx          # Add new user form
└── README.md            # This documentation file
```

## Usage

### Navigation
Users can access these pages through:
1. **Sidebar Navigation**: User Management section in the sidebar
2. **Direct URLs**: 
   - `/users/list` - User list
   - `/users/roles` - Roles and permissions
   - `/users/add` - Add new user

### Permissions
- **Admin**: Full access to all user management features
- **Manager**: Limited access (can view users, edit some details)
- **Employee**: No access (redirected or hidden from navigation)

## Future Enhancements

### Planned Features
- **Real API Integration**: Replace mock data with actual API calls
- **Bulk Operations**: Import/export users via CSV/Excel
- **Advanced Filtering**: More filter options and saved filters
- **User Activity Logs**: Track user actions and changes
- **Email Notifications**: Send welcome emails and role change notifications
- **Profile Management**: User profile editing and avatar upload
- **Audit Trail**: Track all user management actions

### Technical Improvements
- **State Management**: Consider Redux/Zustand for complex state
- **Form Libraries**: Integrate React Hook Form or Formik
- **Data Validation**: Add server-side validation
- **Real-time Updates**: WebSocket integration for live updates
- **Caching**: Implement data caching for better performance

## Dependencies

- **React**: Core framework
- **React Router**: Navigation and routing
- **Lucide React**: Icons
- **Tailwind CSS**: Styling
- **TypeScript**: Type safety

## Contributing

When adding new features to the user management system:
1. Follow the existing code patterns and structure
2. Add proper TypeScript interfaces for new data types
3. Include proper error handling and loading states
4. Test responsive design on different screen sizes
5. Update this README with new features 