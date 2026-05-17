import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { GoalProvider } from './context/GoalContext'

// Auth
import LoginPage from './pages/auth/LoginPage'

// Layouts
import AppLayout from './components/layout/AppLayout'

// Employee pages
import EmployeeDashboard from './pages/employee/Dashboard'
import GoalSheet from './pages/employee/GoalSheet'
import Checkins from './pages/employee/Checkins'
import EmployeeAnalytics from './pages/employee/Analytics'

// Manager pages
import ManagerDashboard from './pages/manager/Dashboard'
import Approvals from './pages/manager/Approvals'
import TeamCheckins from './pages/manager/TeamCheckins'
import TeamAnalytics from './pages/manager/TeamAnalytics'

// Admin pages
import AdminDashboard from './pages/admin/Dashboard'
import AuditTrail from './pages/admin/AuditTrail'
import SharedGoals from './pages/admin/SharedGoals'
import OrgAnalytics from './pages/admin/OrgAnalytics'

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

function RoleRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'manager') return <Navigate to="/manager" replace />
  if (user.role === 'admin')   return <Navigate to="/admin"   replace />
  return <Navigate to="/employee" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<RoleRedirect />} />

      {/* Employee */}
      <Route path="/employee" element={<ProtectedRoute roles={['employee']}><AppLayout /></ProtectedRoute>}>
        <Route index element={<EmployeeDashboard />} />
        <Route path="goals" element={<GoalSheet />} />
        <Route path="checkins" element={<Checkins />} />
        <Route path="analytics" element={<EmployeeAnalytics />} />
      </Route>

      {/* Manager */}
      <Route path="/manager" element={<ProtectedRoute roles={['manager']}><AppLayout /></ProtectedRoute>}>
        <Route index element={<ManagerDashboard />} />
        <Route path="approvals" element={<Approvals />} />
        <Route path="checkins" element={<TeamCheckins />} />
        <Route path="analytics" element={<TeamAnalytics />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AppLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="shared-goals" element={<SharedGoals />} />
        <Route path="analytics" element={<OrgAnalytics />} />
        <Route path="audit" element={<AuditTrail />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <GoalProvider>
        <AppRoutes />
      </GoalProvider>
    </AuthProvider>
  )
}
