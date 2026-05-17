import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useGoals } from '../../context/GoalContext'
import { StatusBadge, ProgressBar, Modal, SectionHeader } from '../../components/ui'
import { CHECKIN_SCHEDULE } from '../../data/mockData'
import toast from 'react-hot-toast'
import { CheckSquare, Calendar, TrendingUp } from 'lucide-react'

const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4']
const STATUS_OPTIONS = ['Not Started', 'On Track', 'Completed']

export default function Checkins() {
  const { user } = useAuth()
  const { goals, achievements, upsertAchievement, computeProgress } = useGoals()
  const [selectedQ, setSelectedQ] = useState('Q1')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState(null)
  const [form, setForm] = useState({ planned: '', actual: '', status: 'On Track', comment: '' })

  const approvedGoals = goals.filter(g => g.employeeId === user.id && g.status === 'approved' && !g.isShared)

  const getAch = (goalId, quarter) => achievements.find(a => a.goalId === goalId && a.quarter === quarter)

  const openCheckin = (goal) => {
    const existing = getAch(goal.id, selectedQ)
    setSelectedGoal(goal)
    setForm(existing ? { planned: existing.planned, actual: existing.actual, status: existing.status, comment: existing.comment || '' } : { planned: '', actual: '', status: 'On Track', comment: '' })
    setModalOpen(true)
  }

  const handleSave = () => {
    if (!form.planned && form.planned !== 0) return toast.error('Enter planned value')
    if (!form.actual  && form.actual  !== 0) return toast.error('Enter actual value')
    const progress = computeProgress(selectedGoal, Number(form.actual))
    upsertAchievement({ goalId: selectedGoal.id, quarter: selectedQ, planned: Number(form.planned), actual: Number(form.actual), progress: Math.round(progress), status: form.status, comment: form.comment }, user)
    toast.success(`${selectedQ} check-in saved!`)
    setModalOpen(false)
  }

  return (
    <div className="space-y-5">
      {/* Quarter selector */}
      <div className="card p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-slate-600 flex items-center gap-1.5"><Calendar className="w-4 h-4" />Select Quarter:</span>
          {QUARTERS.map(q => {
            const schedule = CHECKIN_SCHEDULE.find(s => s.period === q)
            return (
              <button key={q} onClick={() => setSelectedQ(q)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${selectedQ === q ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'}`}>
                {q}
                {schedule?.status === 'active' && <span className="ml-1.5 w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Goals check-in table */}
      <div className="card">
        <div className="px-5 pt-5 pb-3">
          <SectionHeader title={`${selectedQ} Check-in`} subtitle={`Log planned vs actual achievement for each goal`} />
        </div>
        {approvedGoals.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">No approved goals to check in.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
                  <th className="text-left px-5 py-3">Goal</th>
                  <th className="text-center px-3 py-3">Target</th>
                  <th className="text-center px-3 py-3">Planned</th>
                  <th className="text-center px-3 py-3">Actual</th>
                  <th className="text-center px-3 py-3">Progress</th>
                  <th className="text-center px-3 py-3">Status</th>
                  <th className="text-right px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {approvedGoals.map(goal => {
                  const ach = getAch(goal.id, selectedQ)
                  return (
                    <tr key={goal.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3">
                        <p className="text-sm font-medium text-slate-800">{goal.title}</p>
                        <p className="text-xs text-slate-400">{goal.thrustArea} · {goal.weightage}%</p>
                      </td>
                      <td className="px-3 py-3 text-center text-sm font-medium text-slate-700">{goal.targetValue}</td>
                      <td className="px-3 py-3 text-center text-sm text-slate-600">{ach?.planned ?? '—'}</td>
                      <td className="px-3 py-3 text-center text-sm text-slate-600">{ach?.actual ?? '—'}</td>
                      <td className="px-3 py-3 w-32">
                        {ach ? (
                          <div>
                            <ProgressBar value={ach.progress} max={100} showLabel={false} height="h-1.5" color={ach.progress >= 100 ? 'emerald' : ach.progress >= 75 ? 'brand' : 'amber'} />
                            <p className="text-xs text-center mt-0.5 text-slate-500">{ach.progress}%</p>
                          </div>
                        ) : <span className="text-slate-300 text-xs text-center block">—</span>}
                      </td>
                      <td className="px-3 py-3 text-center">{ach ? <StatusBadge status={ach.status} /> : <span className="text-slate-300 text-xs">—</span>}</td>
                      <td className="px-5 py-3 text-right">
                        <button onClick={() => openCheckin(goal)}
                          className={ach ? 'btn-secondary text-xs py-1' : 'btn-primary text-xs py-1'}>
                          {ach ? 'Update' : 'Log'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={`${selectedQ} Check-in — ${selectedGoal?.title}`}>
        <div className="space-y-4">
          {selectedGoal && (
            <div className="bg-slate-50 rounded-lg p-3 text-xs space-y-1">
              <div className="flex justify-between"><span className="text-slate-500">Thrust Area</span><span className="font-medium">{selectedGoal.thrustArea}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Target</span><span className="font-medium">{selectedGoal.targetValue}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">UoM Type</span><span className="font-medium capitalize">{selectedGoal.uom}</span></div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Planned (this quarter)</label>
              <input type="number" className="input" placeholder="0" value={form.planned}
                onChange={e => setForm(p => ({ ...p, planned: e.target.value }))} />
            </div>
            <div>
              <label className="label">Actual Achievement</label>
              <input type="number" className="input" placeholder="0" value={form.actual}
                onChange={e => setForm(p => ({ ...p, actual: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="label">Status</label>
            <div className="grid grid-cols-3 gap-2">
              {STATUS_OPTIONS.map(s => (
                <button key={s} onClick={() => setForm(p => ({ ...p, status: s }))}
                  className={`py-2 text-xs font-medium rounded-lg border transition-colors ${form.status === s ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Notes / Comment</label>
            <textarea className="input resize-none" rows={2} placeholder="Optional notes…"
              value={form.comment} onChange={e => setForm(p => ({ ...p, comment: e.target.value }))} />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="btn-primary flex-1">Save Check-in</button>
            <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
