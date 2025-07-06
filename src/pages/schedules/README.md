# Schedule Management (Manager)

This directory contains the Schedule Management pages for the manager role in the healthcare roster allocation system powered by OptaPlanner.

## Pages

- **CurrentSchedules.tsx**: View and manage current department/team schedules. Displays staff assignments, shift details, and schedule status. Integrates with OptaPlanner for optimized roster display.
- **ScheduleBuilder.tsx**: Build and edit department schedules. Managers can assign staff, set shift patterns, and trigger OptaPlanner optimization for optimal scheduling.
- **OptimizationEngine.tsx**: Run and monitor OptaPlanner optimization. View constraint satisfaction, optimization progress, and review optimal roster results.

## Structure
- All pages are accessible to users with the `manager` role.
- Pages are linked from the sidebar under "Schedule Management" with subpages for Current Schedules, Schedule Builder, and Optimization Engine.
- Integrates with the backend via the `scheduleAPI` for fetching and managing schedules.

## OptaPlanner Integration
- Schedule data and optimization are powered by OptaPlanner, ensuring compliance with business rules and optimal staff allocation for healthcare settings.

---

_This section is under active development. UI and features will be expanded to support advanced scheduling, constraint management, and real-time optimization feedback._ 