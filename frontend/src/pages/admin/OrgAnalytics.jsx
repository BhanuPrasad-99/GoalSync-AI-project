import { DEPT_ANALYTICS, QOQ_TREND, USERS } from '../../data/mockData'
import { useGoals } from '../../context/GoalContext'
import { SectionHeader, ProgressBar } from '../../components/ui'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts'
import * as XLSX from 'xlsx'
import toast from 'react-hot-toast'
import { Download } from 'lucide-react'

const COLORS = ['#534AB7','#10B981','#F59E0B','#EF4444','#3B82F6']

export default function OrgAnalytics() {
  const { goals, achievements } = useGoals()

  const exportReport = () => {
    const data = USERS.filter(u => u.role === 'employee').map(u => {
      const myGoals = goals.filter(g => g.employeeId === u.id && g.status === 'approved')
      const myAchs = achievements.filter(a => myGoals.some(g => g.id === a.goalId))
      const avg = myAchs.length ? Math.round(myAchs.reduce((s,a) => s+a.progress,0)/myAchs.length) : 0
      return { Employee: u.name, Department: u.department, 'Goals Approved': myGoals.length, 'Avg Progress %': avg, 'Check-ins Done': myAchs.length }
    })
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Achievement Report')
    XLSX.writeFile(wb, 'GoalSync_AchievementReport.xlsx')
    toast.success('Report exported!')
  }

  const thrustDist = ['Revenue Growth','Customer Success','Operational Efficiency','People & Culture','Innovation'].map(t => ({
    name: t.split(' ')[0], count: goals.filter(g => g.thrustArea === t).length
  }))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Org Analytics</h2>
          <p className="text-slate-400 text-sm">Organisation-wide performance intelligence</p>
        </div>
        <button onClick={exportReport} className="btn-secondary flex items-center gap-2">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="card p-5 lg:col-span-2">
          <SectionHeader title="Department Completion Rate" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={DEPT_ANALYTICS} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="dept" tick={{ fontSize:11, fill:'#94A3B8' }} />
              <YAxis domain={[0,100]} tick={{ fontSize:11, fill:'#94A3B8' }} unit="%" />
              <Tooltip formatter={v=>[`${v}%`,'Completion']} contentStyle={{ borderRadius:'8px',fontSize:'13px' }} />
              <Bar dataKey="completion" radius={[4,4,0,0]}>
                {DEPT_ANALYTICS.map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <SectionHeader title="Thrust Area Distribution" />
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={thrustDist} cx="50%" cy="50%" outerRadius={75} dataKey="count">
                {thrustDist.map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
              </Pie>
              <Legend wrapperStyle={{ fontSize:'11px' }} />
              <Tooltip contentStyle={{ borderRadius:'8px',fontSize:'13px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-5">
        <SectionHeader title="QoQ Org Trend" subtitle="Average achievement across all departments" />
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={QOQ_TREND}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="quarter" tick={{ fontSize:11, fill:'#94A3B8' }} />
            <YAxis domain={[60,100]} tick={{ fontSize:11, fill:'#94A3B8' }} unit="%" />
            <Tooltip formatter={v=>[`${v}%`,'Org Avg']} contentStyle={{ borderRadius:'8px',fontSize:'13px' }} />
            <Line type="monotone" dataKey="avg" stroke="#534AB7" strokeWidth={2.5} dot={{ fill:'#534AB7',r:4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 pt-5 pb-3">
          <SectionHeader title="Department Breakdown" />
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
              <th className="text-left px-5 py-2">Department</th>
              <th className="text-center px-3 py-2">Submitted</th>
              <th className="text-center px-3 py-2">Approved</th>
              <th className="text-center px-3 py-2">Pending</th>
              <th className="text-center px-3 py-2">Check-ins</th>
              <th className="text-left px-5 py-2">Completion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {DEPT_ANALYTICS.map((d,i) => (
              <tr key={d.dept} className="hover:bg-slate-50">
                <td className="px-5 py-3 text-sm font-medium text-slate-800">{d.dept}</td>
                <td className="px-3 py-3 text-center text-sm text-slate-600">{d.submitted}</td>
                <td className="px-3 py-3 text-center"><span className="badge bg-emerald-100 text-emerald-700">{d.approved}</span></td>
                <td className="px-3 py-3 text-center"><span className={`badge ${d.pending>0?'bg-amber-100 text-amber-700':'bg-slate-100 text-slate-500'}`}>{d.pending}</span></td>
                <td className="px-3 py-3 text-center text-sm text-slate-600">{d.checkins}/{d.submitted}</td>
                <td className="px-5 py-3 w-48">
                  <div className="flex items-center gap-2">
                    <ProgressBar value={d.completion} max={100} showLabel={false} height="h-1.5"
                      color={d.completion>=80?'emerald':d.completion>=60?'brand':'amber'} />
                    <span className="text-xs text-slate-600 flex-shrink-0">{d.completion}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
