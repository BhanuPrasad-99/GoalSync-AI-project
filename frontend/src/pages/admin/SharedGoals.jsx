import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useGoals } from '../../context/GoalContext'
import { USERS, THRUST_AREAS, UOM_TYPES } from '../../data/mockData'
import { SectionHeader, StatusBadge, Modal } from '../../components/ui'
import toast from 'react-hot-toast'
import { Share2, Plus } from 'lucide-react'

export default function SharedGoals() {
  const { user } = useAuth()
  const { goals, pushSharedGoal } = useGoals()
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', thrustArea: '', uom: 'min', targetValue: '' })
  const [selectedEmps, setSelectedEmps] = useState([])

  const sharedGoals = goals.filter(g => g.isShared)
  const employees = USERS.filter(u => u.role === 'employee')

  const toggleEmp = (id) => setSelectedEmps(p => p.includes(id) ? p.filter(e => e !== id) : [...p, id])

  const handlePush = () => {
    if (!form.title.trim()) return toast.error('Goal title required')
    if (!form.thrustArea)   return toast.error('Select thrust area')
    if (!form.targetValue)  return toast.error('Target value required')
    if (selectedEmps.length === 0) return toast.error('Select at least one employee')

    pushSharedGoal({ ...form, employeeId: null, targetValue: Number(form.targetValue), weightage: 0 }, selectedEmps, user)
    toast.success(`Shared goal pushed to ${selectedEmps.length} employee(s)!`)
    setModalOpen(false)
    setForm({ title: '', description: '', thrustArea: '', uom: 'min', targetValue: '' })
    setSelectedEmps([])
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Shared Goals</h2>
          <p className="text-slate-400 text-sm">Push departmental KPIs to multiple employees</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Push New Goal
        </button>
      </div>

      <div className="card p-4 bg-purple-50 border-purple-200">
        <p className="text-purple-800 text-sm">
          <strong>How it works:</strong> Employees receive the shared goal with the Title and Target locked.
          They can only adjust their own Weightage. Achievement updates by the primary owner sync automatically.
        </p>
      </div>

      {sharedGoals.length === 0 ? (
        <div className="card text-center py-16">
          <Share2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No shared goals yet</p>
          <p className="text-slate-400 text-sm mt-1">Push a departmental KPI to get started.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
                <th className="text-left px-5 py-3">Goal Title</th>
                <th className="text-left px-3 py-3">Thrust Area</th>
                <th className="text-center px-3 py-3">Target</th>
                <th className="text-center px-3 py-3">UoM</th>
                <th className="text-center px-3 py-3">Recipient</th>
                <th className="text-center px-3 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sharedGoals.map(g => {
                const emp = USERS.find(u => u.id === g.employeeId)
                return (
                  <tr key={g.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 text-sm font-medium text-slate-800">{g.title}</td>
                    <td className="px-3 py-3 text-xs text-slate-500">{g.thrustArea}</td>
                    <td className="px-3 py-3 text-center text-sm text-slate-700">{g.targetValue}</td>
                    <td className="px-3 py-3 text-center"><span className="badge bg-slate-100 text-slate-600 uppercase">{g.uom}</span></td>
                    <td className="px-3 py-3 text-center text-sm text-slate-600">{emp?.name || '—'}</td>
                    <td className="px-3 py-3 text-center"><StatusBadge status={g.status} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Push Shared Goal" maxWidth="max-w-xl">
        <div className="space-y-4">
          <div>
            <label className="label">Goal Title *</label>
            <input className="input" placeholder="e.g. Org NPS Target" value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input resize-none" rows={2} value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Thrust Area *</label>
              <select className="input" value={form.thrustArea} onChange={e => setForm(p => ({ ...p, thrustArea: e.target.value }))}>
                <option value="">Select…</option>
                {THRUST_AREAS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">UoM *</label>
              <select className="input" value={form.uom} onChange={e => setForm(p => ({ ...p, uom: e.target.value }))}>
                {UOM_TYPES.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Target Value *</label>
            <input type="number" className="input" placeholder="e.g. 45" value={form.targetValue}
              onChange={e => setForm(p => ({ ...p, targetValue: e.target.value }))} />
          </div>
          <div>
            <label className="label">Push to Employees * ({selectedEmps.length} selected)</label>
            <div className="space-y-2 max-h-40 overflow-y-auto border border-slate-200 rounded-lg p-3">
              {employees.map(emp => (
                <label key={emp.id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 rounded p-1">
                  <input type="checkbox" checked={selectedEmps.includes(emp.id)} onChange={() => toggleEmp(emp.id)}
                    className="rounded text-brand-600" />
                  <span className="text-sm text-slate-700">{emp.name}</span>
                  <span className="text-xs text-slate-400">({emp.department})</span>
                </label>
              ))}
            </div>
          </div>
          <p className="text-xs text-amber-600 bg-amber-50 rounded px-3 py-2">Recipients can only modify weightage. Title and Target are locked.</p>
          <div className="flex gap-2">
            <button onClick={handlePush} className="btn-primary flex-1">Push to Employees</button>
            <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
