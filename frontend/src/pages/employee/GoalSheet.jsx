import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useGoals } from '../../context/GoalContext'
import { THRUST_AREAS, UOM_TYPES } from '../../data/mockData'
import { StatusBadge, WeightageBar, Modal, SectionHeader, EmptyState } from '../../components/ui'
import toast from 'react-hot-toast'
import { Plus, Trash2, Edit3, Send, Lock, Target } from 'lucide-react'

const EMPTY_GOAL = { title: '', description: '', thrustArea: '', uom: 'min', targetValue: '', weightage: '' }

export default function GoalSheet() {
  const { user } = useAuth()
  const { goals, createGoal, updateGoal, deleteGoal, submitGoalSheet } = useGoals()
  const [modalOpen, setModalOpen] = useState(false)
  const [editGoal, setEditGoal] = useState(null)
  const [form, setForm] = useState(EMPTY_GOAL)

  const myGoals = goals.filter(g => g.employeeId === user.id)
  const draftGoals = myGoals.filter(g => g.status === 'draft')
  const otherGoals = myGoals.filter(g => g.status !== 'draft')
  const totalWeightage = myGoals.reduce((s, g) => s + Number(g.weightage), 0)
  const canSubmit = draftGoals.length > 0 && totalWeightage === 100

  const openAdd = () => { setEditGoal(null); setForm(EMPTY_GOAL); setModalOpen(true) }
  const openEdit = (goal) => {
    if (goal.isLocked) return toast.error('Goal is locked after approval.')
    setEditGoal(goal); setForm({ ...goal }); setModalOpen(true)
  }

  const handleSave = () => {
    if (!form.title.trim()) return toast.error('Goal title is required')
    if (!form.thrustArea)   return toast.error('Select a thrust area')
    if (!form.targetValue)  return toast.error('Target value is required')
    const w = Number(form.weightage)
    if (!w || w < 10)       return toast.error('Minimum weightage is 10%')

    const otherWeight = myGoals.filter(g => g.id !== editGoal?.id).reduce((s, g) => s + Number(g.weightage), 0)
    if (otherWeight + w > 100) return toast.error(`Total weightage would exceed 100% (currently ${otherWeight}% used)`)

    if (!editGoal && myGoals.length >= 8) return toast.error('Maximum 8 goals per employee')

    if (editGoal) {
      updateGoal(editGoal.id, { ...form, targetValue: Number(form.targetValue), weightage: w }, user)
      toast.success('Goal updated')
    } else {
      createGoal({ ...form, employeeId: user.id, targetValue: Number(form.targetValue), weightage: w }, user)
      toast.success('Goal added')
    }
    setModalOpen(false)
  }

  const handleDelete = (goal) => {
    if (goal.isLocked) return toast.error('Cannot delete a locked goal.')
    if (!window.confirm('Delete this goal?')) return
    deleteGoal(goal.id, user)
    toast.success('Goal deleted')
  }

  const handleSubmit = () => {
    if (totalWeightage !== 100) return toast.error(`Total weightage must be 100% (currently ${totalWeightage}%)`)
    submitGoalSheet(user.id, user)
    toast.success('Goal sheet submitted for manager approval!')
  }

  return (
    <div className="space-y-5">
      {/* Weightage indicator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <div className="lg:col-span-2">
          <WeightageBar used={totalWeightage} />
        </div>
        <div className="flex gap-2 justify-end">
          {draftGoals.length < 8 && (
            <button onClick={openAdd} className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Goal
            </button>
          )}
          <button onClick={handleSubmit} disabled={!canSubmit}
            className="btn-success flex items-center gap-2 disabled:opacity-40">
            <Send className="w-4 h-4" /> Submit
          </button>
        </div>
      </div>

      {/* Draft goals */}
      {draftGoals.length > 0 && (
        <div className="card">
          <div className="px-5 pt-5">
            <SectionHeader title="Draft Goals" subtitle="Edit before submitting" />
          </div>
          <div className="divide-y divide-slate-100">
            {draftGoals.map(goal => (
              <GoalRow key={goal.id} goal={goal} onEdit={() => openEdit(goal)} onDelete={() => handleDelete(goal)} />
            ))}
          </div>
        </div>
      )}

      {/* Other goals (pending/approved) */}
      {otherGoals.length > 0 && (
        <div className="card">
          <div className="px-5 pt-5">
            <SectionHeader title="Submitted / Approved Goals" subtitle="Locked after approval" />
          </div>
          <div className="divide-y divide-slate-100">
            {otherGoals.map(goal => (
              <GoalRow key={goal.id} goal={goal} onEdit={() => openEdit(goal)} onDelete={() => handleDelete(goal)} />
            ))}
          </div>
        </div>
      )}

      {myGoals.length === 0 && (
        <div className="card">
          <EmptyState icon={Target} title="No goals yet"
            subtitle="Add up to 8 goals. Total weightage must equal 100%."
            action={<button onClick={openAdd} className="btn-primary mx-auto flex items-center gap-2"><Plus className="w-4 h-4"/>Add first goal</button>} />
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editGoal ? 'Edit Goal' : 'Add New Goal'}>
        <div className="space-y-4">
          <div>
            <label className="label">Goal Title *</label>
            <input className="input" placeholder="e.g. Achieve Q1 Sales Target" value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input resize-none" rows={2} placeholder="Brief description…"
              value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
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
              <label className="label">Unit of Measurement *</label>
              <select className="input" value={form.uom} onChange={e => setForm(p => ({ ...p, uom: e.target.value }))}>
                {UOM_TYPES.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Target Value *</label>
              <input type="number" className="input" placeholder="e.g. 100" value={form.targetValue}
                onChange={e => setForm(p => ({ ...p, targetValue: e.target.value }))} />
            </div>
            <div>
              <label className="label">Weightage % * (min 10)</label>
              <input type="number" className="input" placeholder="10–100" min="10" max="100" value={form.weightage}
                onChange={e => setForm(p => ({ ...p, weightage: e.target.value }))} />
            </div>
          </div>
          {form.uom && (
            <p className="text-xs text-brand-600 bg-brand-50 rounded px-3 py-2">
              Formula: {UOM_TYPES.find(u => u.value === form.uom)?.formula}
            </p>
          )}
          <div className="flex gap-2 pt-2">
            <button onClick={handleSave} className="btn-primary flex-1">Save Goal</button>
            <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function GoalRow({ goal, onEdit, onDelete }) {
  return (
    <div className="px-5 py-4 flex items-start gap-4 hover:bg-slate-50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <p className="text-sm font-medium text-slate-800">{goal.title}</p>
          {goal.isLocked && <Lock className="w-3 h-3 text-slate-400" />}
          {goal.isShared && <span className="badge bg-purple-100 text-purple-700">Shared</span>}
          <StatusBadge status={goal.status} />
        </div>
        <p className="text-xs text-slate-500 truncate">{goal.description}</p>
        <div className="flex gap-3 mt-1 text-xs text-slate-400">
          <span>{goal.thrustArea}</span>
          <span>·</span>
          <span>Target: {goal.targetValue}</span>
          <span>·</span>
          <span>UoM: {goal.uom.toUpperCase()}</span>
        </div>
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="text-lg font-bold text-brand-600">{goal.weightage}%</p>
        <p className="text-xs text-slate-400">weight</p>
      </div>
      {!goal.isLocked && (
        <div className="flex gap-1 flex-shrink-0">
          <button onClick={onEdit} className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded transition-colors">
            <Edit3 className="w-4 h-4" />
          </button>
          <button onClick={onDelete} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
