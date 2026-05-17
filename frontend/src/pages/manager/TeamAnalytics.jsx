import { TEAM_STATS, QOQ_TREND, DEPT_ANALYTICS } from '../../data/mockData'
import { SectionHeader, ProgressBar } from '../../components/ui'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts'

export default function TeamAnalytics() {
  const radarData = TEAM_STATS.map(m => ({ name: m.name.split(' ')[0], completion: m.completion, checkIn: m.checkIn ? 100 : 0, approved: m.goalsApproved * 20 }))

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <SectionHeader title="Team Completion Rate" subtitle="Current cycle" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={TEAM_STATS} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94A3B8' }} tickFormatter={n => n.split(' ')[0]} />
              <YAxis domain={[0,100]} tick={{ fontSize:11, fill:'#94A3B8' }} unit="%" />
              <Tooltip formatter={v=>[`${v}%`,'Completion']} contentStyle={{ borderRadius:'8px', fontSize:'13px' }} />
              <Bar dataKey="completion" fill="#534AB7" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <SectionHeader title="QoQ Trend" subtitle="Org benchmark" />
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={QOQ_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="quarter" tick={{ fontSize:11, fill:'#94A3B8' }} />
              <YAxis domain={[60,100]} tick={{ fontSize:11, fill:'#94A3B8' }} unit="%" />
              <Tooltip formatter={v=>[`${v}%`,'Avg']} contentStyle={{ borderRadius:'8px', fontSize:'13px' }} />
              <Line type="monotone" dataKey="avg" stroke="#10B981" strokeWidth={2.5} dot={{ fill:'#10B981', r:4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-5">
        <SectionHeader title="Member Breakdown" />
        <div className="space-y-4">
          {TEAM_STATS.map(m => (
            <div key={m.name} className="grid grid-cols-4 gap-4 items-center py-2 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {m.name.split(' ').map(n=>n[0]).join('')}
                </div>
                <span className="text-sm font-medium text-slate-700">{m.name.split(' ')[0]}</span>
              </div>
              <div>
                <ProgressBar value={m.completion} max={100} showLabel={false} height="h-2" color={m.completion>=80?'emerald':m.completion>=50?'brand':'amber'} />
                <p className="text-xs text-slate-500 mt-0.5">{m.completion}%</p>
              </div>
              <div className="text-center">
                <span className={`badge ${m.checkIn ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {m.checkIn ? '✓ Checked in' : 'Pending'}
                </span>
              </div>
              <div className="text-center text-sm text-slate-600">{m.goalsApproved} goals approved</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
