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
