import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { Zap, User, Lock, ChevronRight } from 'lucide-react'

const DEMO_CREDS = [
  { role: 'Employee', email: 'employee@goalsync.ai', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { role: 'Manager',  email: 'manager@goalsync.ai',  color: 'bg-purple-50 border-purple-200 text-purple-700' },
  { role: 'Admin',    email: 'admin@goalsync.ai',    color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    const result = login(email, password)
    setLoading(false)
    if (result.success) {
      toast.success(`Welcome, ${result.user.name}!`)
      navigate('/')
    } else {
      toast.error(result.error)
    }
  }

  const quickLogin = (cred) => {
    setEmail(cred.email)
    setPassword('demo1234')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-900 via-brand-800 to-brand-600 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

        {/* Left branding */}
        <div className="text-white hidden lg:block">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">GoalSync AI</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Align Goals.<br />Empower Performance.
          </h1>
          <p className="text-brand-200 text-lg mb-8">
            Enterprise-grade goal management with real-time analytics, approval workflows, and AI-driven insights.
          </p>
          <div className="space-y-3">
            {['Full goal lifecycle management', 'Role-based approval workflows', 'Quarterly check-in tracking', 'AI performance insights', 'Audit-ready governance'].map(f => (
              <div key={f} className="flex items-center gap-2 text-brand-100">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <ChevronRight className="w-3 h-3" />
                </div>
                <span className="text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Login card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <Zap className="w-6 h-6 text-brand-600" />
            <span className="text-xl font-bold text-brand-800">GoalSync AI</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Sign in</h2>
          <p className="text-slate-500 text-sm mb-6">Access your performance portal</p>

          {/* Quick demo buttons */}
          <div className="mb-6">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">Quick Demo Access</p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_CREDS.map(c => (
                <button key={c.role} onClick={() => quickLogin(c)}
                  className={`text-xs font-medium py-2 px-2 rounded-lg border ${c.color} hover:opacity-80 transition-opacity text-center`}>
                  {c.role}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-1 text-center">Password for all: <code className="bg-slate-100 px-1 rounded">demo1234</code></p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="input pl-9" placeholder="you@company.com" required />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  className="input pl-9" placeholder="••••••••" required />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-xs text-slate-400 text-center mt-6">
            AtomQuest 2026 · GoalSync AI Demo
          </p>
        </div>
      </div>
    </div>
  )
}
