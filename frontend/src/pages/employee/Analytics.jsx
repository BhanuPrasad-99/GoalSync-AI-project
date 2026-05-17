import { useAuth } from '../../context/AuthContext'
import { useGoals } from '../../context/GoalContext'
import { QOQ_TREND } from '../../data/mockData'
import { SectionHeader, ProgressBar } from '../../components/ui'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const COLORS = ['#534AB7', '#10B981', '#F59E0B', '#EF4444', '#3B82F6']

export default function EmployeeAnalytics() {
  const { user } = useAuth()
  const { goals, achievements } = useGoals()

  const myGoals = goals.filter(g => g.employeeId === user.id && g.status === 'approved')
  const myAch = achievements.filter(a => myGoals.some(g => g.id === a.goalId))

  const statusDist = ['Completed', 'On Track', 'Not Started'].map(s => ({
    name: s, value: myAch.filter(a => a.status === s).length
  })).filter(d => d.value > 0)

  const goalProgress = myGoals.map(g => {
    const achs = achievements.filter(a => a.goalId === g.id)
    const avg = achs.length ? Math.round(achs.reduce((s, a) => s + a.progress, 0) / achs.length) : 0
    return { name: g.title.length > 20 ? g.title.slice(0, 20) + '…' : g.title, progress: avg, weightage: g.weightage }
  })

  const quarterlyData = ['Q1', 'Q2', 'Q3', 'Q4'].map(q => {
    const qAchs = myAch.filter(a => a.quarter === q)
    return { quarter: q, avg: qAchs.length ? Math.round(qAchs.reduce((s, a) => s + a.progress, 0) / qAchs.length) : 0 }
  })

  return (
    <div className="space-y-5">
      {/* QoQ comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <SectionHeader title="My Progress by Quarter" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={quarterlyData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="quarter" tick={{ fontSize: 12, fill: '#94A3B8' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#94A3B8' }} unit="%" />
              <Tooltip formatter={v => [`${v}%`, 'Avg Progress']} contentStyle={{ borderRadius: '8px', fontSize: '13px' }} />
              <Bar dataKey="avg" fill="#534AB7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <SectionHeader title="Goal Status Distribution" />
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusDist} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {statusDist.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '13px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Goal-by-goal progress */}
      <div className="card p-5">
        <SectionHeader title="Goal-wise Achievement" subtitle="Average across all quarters" />
        <div className="space-y-4">
          {goalProgress.length === 0 && <p className="text-slate-400 text-sm text-center py-6">No achievement data yet.</p>}
          {goalProgress.map((g, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-700 font-medium">{g.name}</span>
                <span className="text-slate-500">{g.progress}%</span>
              </div>
              <ProgressBar value={g.progress} max={100} showLabel={false} height="h-2"
                color={g.progress >= 100 ? 'emerald' : g.progress >= 75 ? 'brand' : g.progress >= 50 ? 'amber' : 'red'} />
              <p className="text-xs text-slate-400 mt-0.5">Weightage: {g.weightage}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Historical QoQ */}
      <div className="card p-5">
        <SectionHeader title="Historical QoQ Trend" subtitle="Organization benchmark" />
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={QOQ_TREND}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="quarter" tick={{ fontSize: 11, fill: '#94A3B8' }} />
            <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} unit="%" />
            <Tooltip formatter={v => [`${v}%`, 'Avg Score']} contentStyle={{ borderRadius: '8px', fontSize: '13px' }} />
            <Line type="monotone" dataKey="avg" stroke="#534AB7" strokeWidth={2.5} dot={{ fill: '#534AB7', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
