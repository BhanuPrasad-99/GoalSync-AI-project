import { useGoals } from '../../context/GoalContext'
import { KPICard, InsightCard, SectionHeader, ProgressBar } from '../../components/ui'
import { AI_INSIGHTS, DEPT_ANALYTICS, USERS } from '../../data/mockData'
import { Users, Target, CheckSquare, TrendingUp, AlertTriangle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const COLORS = ['#534AB7','#10B981','#F59E0B','#EF4444','#3B82F6']

export default function AdminDashboard() {
  const { goals, auditLogs } = useGoals()
  const insights = AI_INSIGHTS.filter(i => i.role === 'admin')
  const employees = USERS.filter(u => u.role === 'employee')
  const pending = goals.filter(g => g.status === 'pending').length
  const approved = goals.filter(g => g.status === 'approved').length
  const orgAvg = Math.round(DEPT_ANALYTICS.reduce((s,d) => s+d.completion, 0) / DEPT_ANALYTICS.length)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Organisation Overview</h2>
        <p className="text-slate-400 text-sm mt-0.5">FY2026 · Real-time performance intelligence</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Employees" value={employees.length} icon={Users} color="brand" />
        <KPICard title="Goals Approved" value={approved} icon={Target} color="emerald" />
        <KPICard title="Pending Approval" value={pending} icon={AlertTriangle} color="amber" />
        <KPICard title="Org Avg Completion" value={`${orgAvg}%`} icon={TrendingUp} color="blue" trendValue="+9% vs Q4 FY25" trend="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <SectionHeader title="Department Completion" subtitle="FY2026 average" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={DEPT_ANALYTICS} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="dept" tick={{ fontSize:11, fill:'#94A3B8' }} />
              <YAxis domain={[0,100]} tick={{ fontSize:11, fill:'#94A3B8' }} unit="%" />
              <Tooltip formatter={v=>[`${v}%`,'Completion']} contentStyle={{ borderRadius:'8px', fontSize:'13px' }} />
              <Bar dataKey="completion" radius={[4,4,0,0]}>
                {DEPT_ANALYTICS.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <SectionHeader title="Department Detail" />
          <div className="space-y-3">
            {DEPT_ANALYTICS.map(d => (
              <div key={d.dept}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">{d.dept}</span>
                  <div className="flex gap-3 text-xs text-slate-400">
                    <span>{d.approved}/{d.submitted} approved</span>
                    <span className="font-semibold text-slate-700">{d.completion}%</span>
                  </div>
                </div>
                <ProgressBar value={d.completion} max={100} showLabel={false} height="h-1.5"
                  color={d.completion>=80?'emerald':d.completion>=60?'brand':'amber'} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-5">
        <SectionHeader title="AI Insights" subtitle="Organisational intelligence" />
        <div className="space-y-3">
          {insights.map(i => <InsightCard key={i.id} insight={i} />)}
        </div>
      </div>

      <div className="card p-5">
        <SectionHeader title="Recent Activity" subtitle="Last 5 audit events" />
        <div className="space-y-2">
          {useGoals().auditLogs.slice(0,5).map(log => (
            <div key={log.id} className="flex items-start gap-3 py-2 border-b border-slate-50 last:border-0">
              <div className="w-2 h-2 rounded-full bg-brand-400 mt-1.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700"><span className="font-medium">{log.userName}</span> · {log.action}</p>
                <p className="text-xs text-slate-400">{log.entity} · {new Date(log.timestamp).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
