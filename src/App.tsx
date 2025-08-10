import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './pages/ProtectedRoute';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Pricing } from './pages/Pricing';
import { Registration }  from './pages/Registration';
import { Projects } from './pages/Projects';
import { Tasks } from './pages/Tasks';
import { Team } from './pages/Team';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Users } from './pages/Users';
import { System } from './pages/System';
import { Layout } from './components/Layout';
import { RoleBasedUI } from './components/RoleBasedUI';
import { UIStrategyGuide } from './components/UIStrategyGuide';
import { UserList, RolesPermissions, AddUser } from './pages/users/index';
import { Departments, Locations, BusinessRules } from './pages/organization/index';
import { SkillsManagement, ShiftTemplates, HolidayCalendar, Contract } from './pages/master-data/index';
import { CurrentSchedules, ScheduleBuilder ,OptimizationEngine,EnhancedScheduleBuilder} from './pages/schedules/index';
import { EmployeeRoles,AddEmployee ,AllEmployees} from './pages/employee-management/index';
import { Availability ,EmployeePreferences} from './pages/availability/index';
// import { ShiftChangeRequestForm  } from './pages/ShiftManagement/ShiftChangeRequestForm';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pricing" element={<Pricing />} />
                    
          {/* Protected Routes */}
          <Route 
            path="/registration" 
            element={
              <ProtectedRoute>
                <Registration />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/projects" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Projects />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tasks" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Tasks />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/team" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Team />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Reports />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Users />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          {/* User Management Routes */}
          <Route 
            path="/users/list" 
            element={
              <ProtectedRoute>
                <Layout>
                  <UserList />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users/roles" 
            element={
              <ProtectedRoute>
                <Layout>
                  <RolesPermissions />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users/add" 
            element={
              <ProtectedRoute>
                <Layout>
                  <AddUser />
                </Layout>
              </ProtectedRoute>
            } 
          />


          {/* Employee Management Routes */}

          <Route 
            path="/employees/list" 
            element={
              <ProtectedRoute>
                <Layout>
                  <AllEmployees />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route 
            path="/employees/roles" 
            element={
              <ProtectedRoute>
                <Layout>
                  <EmployeeRoles />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/employees/add" 
            element={
              <ProtectedRoute>
                <Layout>
                  <AddEmployee />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Organization Management Routes */}
          <Route 
            path="/organization/departments" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Departments />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/organization/locations" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Locations />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/organization/rules" 
            element={
              <ProtectedRoute>
                <Layout>
                  <BusinessRules />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          {/* Master Data Routes */}
          <Route 
            path="/master-data/skills" 
            element={
              <ProtectedRoute>
                <Layout>
                  <SkillsManagement />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/master-data/contracts" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Contract />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/master-data/shifts" 
            element={
              <ProtectedRoute>
                <Layout>
                  <ShiftTemplates />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/master-data/holidays" 
            element={
              <ProtectedRoute>
                <Layout>
                  <HolidayCalendar />
                </Layout>
              </ProtectedRoute>
            } 
          />

          {/* Schedules Routes */}
          <Route 
            path="/schedules/current" 
            element={
              <ProtectedRoute>
                <Layout>
                  <CurrentSchedules />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/schedules/builder" 
            element={
              <ProtectedRoute>
                <Layout>
                  <ScheduleBuilder />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/schedules/builder-temp" 
            element={
              <ProtectedRoute>
                <Layout>
                  <EnhancedScheduleBuilder />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/schedules/optimization" 
            element={
              <ProtectedRoute>
                <Layout>
                  <OptimizationEngine />
                </Layout>
              </ProtectedRoute>
            } 
          />

          {/* Availability Management Routes */}
          <Route
            path="/availability/set" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Availability />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route 
            path="/availability/preferences" 
            element={
              <ProtectedRoute>
                <Layout>
                  <EmployeePreferences />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* <Route 
            path="/shifts/swaps" 
            element={
              <ProtectedRoute>
                <Layout>
                  <ShiftChangeRequestForm 
                    availableShifts={[]}
                    onNewRequest={() => {}}
                  />
                </Layout>
              </ProtectedRoute>
            }
          /> */}
          
          {/* System Routes */}
          <Route 
            path="/system" 
            element={
              <ProtectedRoute>
                <Layout>
                  <System />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ui-examples" 
            element={
              <ProtectedRoute>
                <Layout>
                  <RoleBasedUI />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ui-guide" 
            element={
              <ProtectedRoute>
                <Layout>
                  <UIStrategyGuide />
                </Layout>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
