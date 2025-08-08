# Employee Availability Management

This module provides comprehensive employee availability management functionality based on the database schema for the `EMPLOYEE_AVAILABILITY` table.

## Features

### 1. Add Employee Availability (`AddEmployeeAvailability`)
- Select employee from dropdown
- Set availability date
- Choose availability type (Available, Preferred, Unavailable)
- Set time ranges (disabled for unavailable status)
- Add reason/description
- Form validation and error handling

### 2. View Availability (`AvailabilityList`)
- Display all availability entries in a table
- Filter by employee, date range, type, and approval status
- Approve/reject availability entries
- Delete availability entries
- Real-time status updates

### 3. Availability Manager (`AvailabilityManager`)
- Tabbed interface combining add and list functionality
- Seamless navigation between views

## Database Schema

The component is designed to work with the following database structure:

```sql
EMPLOYEE_AVAILABILITY (
  id - Primary key
  employee_id - Reference to employee
  availability_date - Date for availability
  start_time - Start time (NULL for unavailable)
  end_time - End time (NULL for unavailable)
  availability_type - AVAILABLE | UNAVAILABLE | PREFERRED
  reason - Description/reason for availability
  approved - Approval status (boolean)
)
```

## API Integration

The module uses the `availabilityAPI` for all server communication:
- `create()` - Add new availability
- `getAll()` - Fetch with filtering
- `updateApprovalStatus()` - Approve/reject
- `delete()` - Remove entries

## Usage

### As a standalone component:
```tsx
import { AddEmployeeAvailability } from './pages/availability';

// In your route
<Route path="/availability/add" component={AddEmployeeAvailability} />
```

### As a complete management interface:
```tsx
import AvailabilityPage from './pages/availability/availabilty';

// In your route
<Route path="/availability" component={AvailabilityPage} />
```

## Availability Types

1. **AVAILABLE**: Employee is available for regular shifts
   - Requires start and end times
   - Standard scheduling priority

2. **PREFERRED**: Employee prefers specific hours or shift types
   - Requires start and end times
   - Higher scheduling priority

3. **UNAVAILABLE**: Employee cannot work
   - No time fields required
   - Blocks scheduling for the date

## Approval Workflow

1. Employee or manager creates availability entry
2. Entry status is "Pending" by default
3. Manager can approve or reject
4. Approved entries are used for scheduling
5. Rejected entries are ignored

## Form Validation

- Employee selection is required
- Date is required (future dates only)
- Time fields required for Available/Preferred types
- End time must be after start time
- Reason is required for all entries

## Access Control

- Employees can create their own availability
- Managers can create for any employee
- Only managers can approve/reject entries
- All users can view (filtered by permissions)

## Error Handling

- Form validation with user-friendly messages
- API error handling with retry capabilities
- Loading states for better UX
- Confirmation dialogs for destructive actions
