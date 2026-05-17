import { useAuth } from '../../context/AuthContext'
import { useGoals } from '../../context/GoalContext'
import { KPICard, InsightCard, ProgressBar, StatusBadge, SectionHeader } from '../../components/ui'
import { AI_INSIGHTS, QOQ_TREND, CHECKIN_SCHEDULE } from '../../data/mockData'
import { Target, CheckSquare, TrendingUp, AlertCircle, Calendar } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function EmployeeDashboard() {
  const { user } = useAuth()
  const { goals, achievements } = useGoals()

  const myGoals = goals.filter(g => g.employeeId === user.id)
  const approvedGoals = myGoals.filter(g => g.status === 'approved')
  const myAchievements = achievements.filter(a => approvedGoals.some(g => g.id === a.goalId))
  const completedCount = myAchievements.filter(a => a.status === 'Completed').length
  const totalWeightage = myGoals.reduce((s, g) => s + g.weightage, 0)
  const insights = AI_INSIGHTS.filter(i => i.role === 'employee')

  const avgProgress = myAchievements.length
    ? Math.round(myAchievements.reduce((s, a) => s + a.progress, 0) / myAchievements.length)
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Good morning, {user.name.split(' ')[0]} 👋</h2>
        <p className="text-slate-400 text-sm mt-0.5">FY2026 · Goal Setting Cycle · Phase 1 Active</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="My Goals" value={myGoals.length} subtitle={`${approvedGoals.length} approved`} icon={Target} color="brand" />
        <KPICard title="Avg Progress" value={`${avgProgress}%`} subtitle="Across all goals" icon={TrendingUp} color="blue" trendValue="+13% vs Q3 FY25" trend="up" />
        <KPICard title="Completed" value={completedCount} subtitle={`of ${myAchievements.length} check-ins`} icon={CheckSquare} color="emerald" />
        <KPICard title="Weightage" value={`${totalWeightage}%`} subtitle={totalWeightage === 100 ? '✓ Balanced' : 'Needs adjustment'} icon={AlertCircle} color={totalWeightage === 100 ? 'emerald' : 'amber'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* QoQ Trend chart */}
        <div className="card p-5 lg:col-span-2">
          <SectionHeader title="Quarter-on-Quarter Progress" subtitle="Average achievement score" />
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={QOQ_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="quarter" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} unit="%" />
              <Tooltip formatter={v => [`${v}%`, 'Avg Score']} contentStyle={{ borderRadius: '8px', fontSize: '13px' }} />
              <Line type="monotone" dataKey="avg" stroke="#534AB7" strokeWidth={2.5} dot={{ fill: '#534AB7', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Check-in schedule */}
        <div className="card p-5">
          <SectionHeader title="Check-in Schedule" icon={Calendar} />
          <div className="space-y-3">
            {CHECKIN_SCHEDULE.map(s => (
              <div key={s.period} className={`flex items-start gap-3 p-2.5 rounded-lg ${s.status === 'active' ? 'bg-brand-50 border border-brand-200' : 'bg-slate-50'}`}>
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${s.status === 'active' ? 'bg-brand-600' : 'bg-slate-300'}`} />
                <div>
                  <p className={`text-sm font-medium ${s.status === 'active' ? 'text-brand-800' : 'text-slate-600'}`}>{s.label}</p>
                  <p className="text-xs text-slate-400">{s.opens}</p>
                </div>
                {s.status === 'active' && <span className="badge bg-brand-100 text-brand-700 ml-auto text-xs">Active</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* My Goals Summary */}
      <div className="card p-5">
        <SectionHeader title="My Goals Overview" subtitle={`${myGoals.length} goals · FY2026`} />
        {myGoals.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-8">No goals created yet. Go to My Goals to get started.</p>
        ) : (
          <div className="space-y-3">
            {myGoals.map(goal => {
              const ach = achievements.filter(a => a.goalId === goal.id)
              const latestAch = ach[ach.length - 1]
              return (
                <div key={goal.id} className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-slate-800 truncate">{goal.title}</p>
                      {goal.isShared && <span className="badge bg-purple-100 text-purple-700 text-xs">Shared</span>}
                      <StatusBadge status={goal.status} />
                    </div>
                    <p className="text-xs text-slate-400">{goal.thrustArea} · {goal.weightage}% weight</p>
                    {latestAch && <ProgressBar value={latestAch.progress} max={100} showLabel={false} height="h-1.5" color="brand" />}
                  </div>
                  <div className="text-right flex-shrink-0">
                    {latestAch ? (
                      <>
                        <p className="text-sm font-bold text-slate-800">{Math.round(latestAch.progress)}%</p>
                        <StatusBadge status={latestAch.status} />
                      </>
                    ) : (
                      <p className="text-xs text-slate-400">No check-in yet</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* AI Insights */}
      <div className="card p-5">
        <SectionHeader title="AI Insights" subtitle="Smart recommendations for you" />
        <div className="space-y-3">
          {insights.map(i => <InsightCard key={i.id} insight={i} />)}
        </div>
      </div>
    </div>
  )
}
