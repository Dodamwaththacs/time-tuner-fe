import React from 'react';

export const UIStrategyGuide: React.FC = () => {
  return (
    <div className="p-6 space-y-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Role-Based UI Strategy Guide</h1>
        <p className="text-lg text-gray-600">Comprehensive approaches for handling different UIs based on user roles</p>
      </div>

      {/* Strategy 1: Conditional Rendering */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Conditional Rendering</h2>
        <p className="text-gray-600 mb-4">Show/hide UI elements based on user role using conditional statements.</p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Example:</h4>
          <pre className="text-sm text-gray-700 overflow-x-auto">
{`// Simple conditional rendering
{user?.role === 'admin' && (
  <AdminOnlyComponent />
)}

// Multiple role conditions
{(user?.role === 'admin' || user?.role === 'manager') && (
  <ManagementComponent />
)}

// Role-specific content
{user?.role === 'employee' ? (
  <EmployeeView />
) : (
  <ManagerView />
)}`}
          </pre>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h5 className="font-medium text-green-900 mb-2">✅ Pros:</h5>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Simple to implement</li>
              <li>• Easy to understand</li>
              <li>• Good for small differences</li>
              <li>• No additional components needed</li>
            </ul>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h5 className="font-medium text-red-900 mb-2">❌ Cons:</h5>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Can become complex with many conditions</li>
              <li>• Harder to maintain</li>
              <li>• Code duplication</li>
              <li>• Difficult to test</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Strategy 2: Component Composition */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Component Composition</h2>
        <p className="text-gray-600 mb-4">Create separate components for each role and compose them based on user role.</p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Example:</h4>
          <pre className="text-sm text-gray-700 overflow-x-auto">
{`// Role-specific components
const AdminDashboard = () => <div>Admin Content</div>;
const ManagerDashboard = () => <div>Manager Content</div>;
const EmployeeDashboard = () => <div>Employee Content</div>;

// Composition function
const getDashboardByRole = (role) => {
  switch (role) {
    case 'admin': return <AdminDashboard />;
    case 'manager': return <ManagerDashboard />;
    case 'employee': return <EmployeeDashboard />;
    default: return <EmployeeDashboard />;
  }
};

// Usage
{getDashboardByRole(user?.role)}`}
          </pre>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h5 className="font-medium text-green-900 mb-2">✅ Pros:</h5>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Clean separation of concerns</li>
              <li>• Easy to test individual components</li>
              <li>• Reusable components</li>
              <li>• Better maintainability</li>
            </ul>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h5 className="font-medium text-red-900 mb-2">❌ Cons:</h5>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• More files to manage</li>
              <li>• Potential code duplication</li>
              <li>• Need to maintain multiple components</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Strategy 3: Higher-Order Components */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Higher-Order Components (HOCs)</h2>
        <p className="text-gray-600 mb-4">Create wrapper components that handle role-based logic.</p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Example:</h4>
          <pre className="text-sm text-gray-700 overflow-x-auto">
{`// HOC for role-based rendering
const withRoleCheck = (allowedRoles, Component) => {
  return (props) => {
    const { user } = useAuth();
    if (allowedRoles.includes(user?.role)) {
      return <Component {...props} />;
    }
    return null;
  };
};

// Usage
const AdminOnlyComponent = withRoleCheck(['admin'], AdminComponent);
const ManagementComponent = withRoleCheck(['admin', 'manager'], ManagementView);`}
          </pre>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h5 className="font-medium text-green-900 mb-2">✅ Pros:</h5>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Reusable role-checking logic</li>
              <li>• Clean component interfaces</li>
              <li>• Easy to apply to any component</li>
              <li>• Centralized role management</li>
            </ul>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h5 className="font-medium text-red-900 mb-2">❌ Cons:</h5>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• More complex to understand</li>
              <li>• Additional abstraction layer</li>
              <li>• Can make debugging harder</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Strategy 4: Configuration-Driven UI */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Configuration-Driven UI</h2>
        <p className="text-gray-600 mb-4">Define UI configurations based on roles and render dynamically.</p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Example:</h4>
          <pre className="text-sm text-gray-700 overflow-x-auto">
{`// UI Configuration
const uiConfig = {
  admin: {
    sidebar: ['dashboard', 'users', 'system', 'reports'],
    dashboard: { widgets: ['system', 'users', 'analytics'] },
    actions: ['create_user', 'system_backup', 'security_audit']
  },
  manager: {
    sidebar: ['dashboard', 'team', 'projects', 'reports'],
    dashboard: { widgets: ['team', 'projects', 'performance'] },
    actions: ['manage_team', 'create_project', 'generate_report']
  },
  employee: {
    sidebar: ['dashboard', 'tasks', 'time', 'profile'],
    dashboard: { widgets: ['tasks', 'time', 'progress'] },
    actions: ['view_tasks', 'log_time', 'submit_report']
  }
};

// Dynamic rendering based on config
const renderUI = (role, config) => {
  const roleConfig = uiConfig[role];
  return roleConfig[config];
};`}
          </pre>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h5 className="font-medium text-green-900 mb-2">✅ Pros:</h5>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Highly flexible and scalable</li>
              <li>• Easy to modify without code changes</li>
              <li>• Centralized configuration</li>
              <li>• Great for complex applications</li>
            </ul>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h5 className="font-medium text-red-900 mb-2">❌ Cons:</h5>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• More complex initial setup</li>
              <li>• Requires careful configuration management</li>
              <li>• Can be overkill for simple cases</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Strategy 5: Layout Variations */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Layout Variations</h2>
        <p className="text-gray-600 mb-4">Use different layouts, themes, and visual styles for different roles.</p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Example:</h4>
          <pre className="text-sm text-gray-700 overflow-x-auto">
{`// Role-based themes
const themes = {
  admin: {
    primary: 'red',
    secondary: 'purple',
    layout: 'full-width',
    sidebar: 'expanded'
  },
  manager: {
    primary: 'blue',
    secondary: 'indigo',
    layout: 'standard',
    sidebar: 'collapsible'
  },
  employee: {
    primary: 'green',
    secondary: 'teal',
    layout: 'compact',
    sidebar: 'minimal'
  }
};

// Apply theme based on role
const applyTheme = (role) => {
  const theme = themes[role];
  document.documentElement.className = \`theme-\${theme.primary}\`;
};`}
          </pre>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h5 className="font-medium text-green-900 mb-2">✅ Pros:</h5>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Clear visual distinction</li>
              <li>• Better user experience</li>
              <li>• Role-based branding</li>
              <li>• Easy to customize</li>
            </ul>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h5 className="font-medium text-red-900 mb-2">❌ Cons:</h5>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• More design work required</li>
              <li>• Potential consistency issues</li>
              <li>• Increased CSS complexity</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">🎯 Best Practices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-blue-900 mb-2">Do's:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Start with conditional rendering for simple cases</li>
              <li>• Use component composition for complex differences</li>
              <li>• Implement role-based routing for security</li>
              <li>• Create reusable role-checking utilities</li>
              <li>• Use TypeScript for better type safety</li>
              <li>• Test each role's UI separately</li>
              <li>• Maintain consistent design language</li>
              <li>• Document role-specific features</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-blue-900 mb-2">Don'ts:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Don't hardcode role checks everywhere</li>
              <li>• Avoid deeply nested conditional rendering</li>
              <li>• Don't duplicate code across role components</li>
              <li>• Avoid mixing UI strategies inconsistently</li>
              <li>• Don't forget to handle edge cases</li>
              <li>• Avoid over-engineering simple cases</li>
              <li>• Don't ignore accessibility considerations</li>
              <li>• Avoid role-based UI that's too different</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Implementation Checklist */}
      <div className="bg-green-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-green-900 mb-4">✅ Implementation Checklist</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <input type="checkbox" className="rounded" />
            <span className="text-sm text-green-700">Define clear role hierarchy and permissions</span>
          </div>
          <div className="flex items-center space-x-3">
            <input type="checkbox" className="rounded" />
            <span className="text-sm text-green-700">Choose appropriate UI strategy for your use case</span>
          </div>
          <div className="flex items-center space-x-3">
            <input type="checkbox" className="rounded" />
            <span className="text-sm text-green-700">Implement role-based routing and access control</span>
          </div>
          <div className="flex items-center space-x-3">
            <input type="checkbox" className="rounded" />
            <span className="text-sm text-green-700">Create reusable role-checking utilities</span>
          </div>
          <div className="flex items-center space-x-3">
            <input type="checkbox" className="rounded" />
            <span className="text-sm text-green-700">Design consistent visual language across roles</span>
          </div>
          <div className="flex items-center space-x-3">
            <input type="checkbox" className="rounded" />
            <span className="text-sm text-green-700">Test UI for each role thoroughly</span>
          </div>
          <div className="flex items-center space-x-3">
            <input type="checkbox" className="rounded" />
            <span className="text-sm text-green-700">Document role-specific features and behaviors</span>
          </div>
          <div className="flex items-center space-x-3">
            <input type="checkbox" className="rounded" />
            <span className="text-sm text-green-700">Implement proper error handling for unauthorized access</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 