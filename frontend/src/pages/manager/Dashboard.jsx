import { useAuth } from '../../context/AuthContext'
import { useGoals } from '../../context/GoalContext'
import { KPICard, InsightCard, StatusBadge, ProgressBar, SectionHeader } from '../../components/ui'
import { AI_INSIGHTS, TEAM_STATS, USERS } from '../../data/mockData'
import { Users, ClipboardCheck, TrendingUp, AlertCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function ManagerDashboard() {
  const { user } = useAuth()
  const { goals } = useGoals()
  const insights = AI_INSIGHTS.filter(i => i.role === 'manager')
  const teamMembers = USERS.filter(u => u.managerId === user.id)
  const pendingApprovals = goals.filter(g => g.status === 'pending').length
  const approved = goals.filter(g => g.status === 'approved').length
  const avgCompletion = Math.round(TEAM_STATS.reduce((s, t) => s + t.completion, 0) / TEAM_STATS.length)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Team Overview</h2>
        <p className="text-slate-400 text-sm mt-0.5">Manage your team's goals and check-ins</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Team Members" value={teamMembers.length} icon={Users} color="brand" />
        <KPICard title="Pending Approvals" value={pendingApprovals} subtitle="Needs review" icon={ClipboardCheck} color="amber" />
        <KPICard title="Avg Completion" value={`${avgCompletion}%`} icon={TrendingUp} color="emerald" trendValue="+13% vs Q4" trend="up" />
        <KPICard title="Approved Goals" value={approved} icon={AlertCircle} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <SectionHeader title="Team Completion Rate" subtitle="By member" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={TEAM_STATS} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94A3B8' }} tickFormatter={n => n.split(' ')[0]} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} unit="%" />
              <Tooltip formatter={v => [`${v}%`, 'Completion']} contentStyle={{ borderRadius: '8px', fontSize: '13px' }} />
              <Bar dataKey="completion" fill="#534AB7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <SectionHeader title="Team Status" />
          <div className="space-y-3">
            {TEAM_STATS.map(m => (
              <div key={m.name} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {m.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{m.name}</span>
                    <span className="text-slate-500">{m.completion}%</span>
                  </div>
                  <ProgressBar value={m.completion} max={100} showLabel={false} height="h-1.5"
                    color={m.completion >= 80 ? 'emerald' : m.completion >= 50 ? 'brand' : 'amber'} />
                </div>
                <div className="flex-shrink-0">
                  {m.pending > 0 ? <span className="badge bg-amber-100 text-amber-700">{m.pending} pending</span>
                    : m.checkIn ? <span className="badge bg-emerald-100 text-emerald-700">✓ Done</span>
                    : <span className="badge bg-slate-100 text-slate-500">No check-in</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-5">
        <SectionHeader title="AI Insights" subtitle="Smart recommendations for your team" />
        <div className="space-y-3">
          {insights.map(i => <InsightCard key={i.id} insight={i} />)}
        </div>
      </div>
    </div>
  )
}
