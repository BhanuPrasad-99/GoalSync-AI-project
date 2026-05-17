import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import {
  Zap, LayoutDashboard, Target, CheckSquare, BarChart2,
  Users, ClipboardCheck, Shield, Share2, BookOpen,
  LogOut, ChevronDown, Bell
} from 'lucide-react'

const NAV = {
  employee: [
    { to: '/employee',           icon: LayoutDashboard, label: 'Dashboard',    end: true },
    { to: '/employee/goals',     icon: Target,          label: 'My Goals' },
    { to: '/employee/checkins',  icon: CheckSquare,     label: 'Check-ins' },
    { to: '/employee/analytics', icon: BarChart2,       label: 'Analytics' },
  ],
  manager: [
    { to: '/manager',            icon: LayoutDashboard, label: 'Dashboard',    end: true },
    { to: '/manager/approvals',  icon: ClipboardCheck,  label: 'Approvals' },
    { to: '/manager/checkins',   icon: CheckSquare,     label: 'Team Check-ins' },
    { to: '/manager/analytics',  icon: BarChart2,       label: 'Team Analytics' },
  ],
  admin: [
    { to: '/admin',              icon: LayoutDashboard, label: 'Dashboard',    end: true },
    { to: '/admin/shared-goals', icon: Share2,          label: 'Shared Goals' },
    { to: '/admin/analytics',    icon: BarChart2,       label: 'Org Analytics' },
    { to: '/admin/audit',        icon: Shield,          label: 'Audit Trail' },
  ],
}

const ROLE_COLORS = {
  employee: 'bg-blue-100 text-blue-700',
  manager:  'bg-purple-100 text-purple-700',
  admin:    'bg-emerald-100 text-emerald-700',
}

export default function AppLayout() {
  const { user, logout, switchRole } = useAuth()
  const navigate = useNavigate()
  const nav = NAV[user?.role] || []

  const handleLogout = () => {
    logout()
    toast.success('Signed out')
    navigate('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-brand-900 flex flex-col">
        {/* Logo */}
        <div className="px-4 py-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-base">GoalSync AI</span>
          </div>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.avatar}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.name}</p>
              <p className="text-brand-300 text-xs capitalize">{user?.role} · {user?.department}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {nav.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Demo role switcher */}
        <div className="px-3 py-3 border-t border-white/10">
          <p className="text-brand-400 text-xs mb-2 px-1">Switch demo role</p>
          <div className="grid grid-cols-3 gap-1">
            {['employee','manager','admin'].map(r => (
              <button key={r} onClick={() => { switchRole(r); navigate('/') }}
                className={`text-xs py-1 rounded font-medium capitalize transition-colors ${user?.role === r ? 'bg-brand-600 text-white' : 'bg-white/10 text-brand-300 hover:bg-white/20'}`}>
                {r === 'employee' ? 'Emp' : r === 'manager' ? 'Mgr' : 'Admin'}
              </button>
            ))}
          </div>
        </div>

        {/* Logout */}
        <div className="px-3 pb-4">
          <button onClick={handleLogout}
            className="sidebar-link w-full text-slate-400 hover:text-white hover:bg-white/10">
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-slate-800 font-semibold text-base">
              {nav.find(n => {
                const path = window.location.pathname
                return n.end ? path === n.to : path.startsWith(n.to)
              })?.label || 'Dashboard'}
            </h1>
            <p className="text-slate-400 text-xs">FY2026 · Goal Setting Cycle</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <span className={`badge ${ROLE_COLORS[user?.role]} capitalize`}>{user?.role}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
