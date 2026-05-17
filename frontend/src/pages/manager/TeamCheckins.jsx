// TeamCheckins.jsx
import { useState } from 'react'
import { useGoals } from '../../context/GoalContext'
import { USERS } from '../../data/mockData'
import { StatusBadge, ProgressBar, Modal, SectionHeader } from '../../components/ui'
import toast from 'react-hot-toast'

export default function TeamCheckins() {
  const { goals, achievements, upsertAchievement } = useGoals()
  const [selectedQ, setSelectedQ] = useState('Q1')
  const [commentModal, setCommentModal] = useState(null)
  const [comment, setComment] = useState('')

  const teamMembers = USERS.filter(u => u.role === 'employee')

  const getGoals = (empId) => goals.filter(g => g.employeeId === empId && g.status === 'approved' && !g.isShared)
  const getAch = (goalId, q) => achievements.find(a => a.goalId === goalId && a.quarter === q)

  const saveComment = () => {
    toast.success('Check-in comment saved!')
    setCommentModal(null)
    setComment('')
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-2 flex-wrap">
        {['Q1','Q2','Q3','Q4'].map(q => (
          <button key={q} onClick={() => setSelectedQ(q)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${selectedQ === q ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'}`}>
            {q}
          </button>
        ))}
      </div>

      {teamMembers.map(emp => {
        const empGoals = getGoals(emp.id)
        const achs = empGoals.map(g => getAch(g.id, selectedQ)).filter(Boolean)
        const done = achs.length
        return (
          <div key={emp.id} className="card">
            <div className="px-5 pt-4 pb-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">{emp.avatar}</div>
                <div>
                  <p className="font-medium text-slate-800">{emp.name}</p>
                  <p className="text-xs text-slate-400">{emp.department} · {done}/{empGoals.length} check-ins done</p>
                </div>
              </div>
              <button onClick={() => { setCommentModal(emp); setComment('') }}
                className="btn-secondary text-xs">Add Comment</button>
            </div>
            {empGoals.length === 0 ? (
              <p className="text-slate-400 text-sm px-5 py-4">No approved goals.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
                      <th className="text-left px-5 py-2">Goal</th>
                      <th className="text-center px-3 py-2">Target</th>
                      <th className="text-center px-3 py-2">Planned</th>
                      <th className="text-center px-3 py-2">Actual</th>
                      <th className="text-center px-3 py-2">Progress</th>
                      <th className="text-center px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {empGoals.map(g => {
                      const a = getAch(g.id, selectedQ)
                      return (
                        <tr key={g.id} className="hover:bg-slate-50">
                          <td className="px-5 py-3 text-sm font-medium text-slate-800">{g.title}</td>
                          <td className="px-3 py-3 text-center text-sm text-slate-600">{g.targetValue}</td>
                          <td className="px-3 py-3 text-center text-sm text-slate-600">{a?.planned ?? '—'}</td>
                          <td className="px-3 py-3 text-center text-sm font-medium text-slate-700">{a?.actual ?? '—'}</td>
                          <td className="px-3 py-3 w-28">
                            {a ? <><ProgressBar value={a.progress} max={100} showLabel={false} height="h-1.5" color={a.progress>=100?'emerald':'brand'} /><p className="text-xs text-center text-slate-500">{a.progress}%</p></> : <span className="text-slate-300 text-xs block text-center">—</span>}
                          </td>
                          <td className="px-3 py-3 text-center">{a ? <StatusBadge status={a.status} /> : <span className="text-slate-300 text-xs">—</span>}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )
      })}

      <Modal open={!!commentModal} onClose={() => setCommentModal(null)} title={`Add Check-in Comment — ${commentModal?.name}`}>
        <div className="space-y-4">
          <p className="text-sm text-slate-500">Document your {selectedQ} discussion with this team member.</p>
          <textarea className="input resize-none" rows={4} value={comment} onChange={e => setComment(e.target.value)} placeholder="Your structured check-in feedback…" />
          <div className="flex gap-2">
            <button onClick={saveComment} className="btn-primary flex-1">Save Comment</button>
            <button onClick={() => setCommentModal(null)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
