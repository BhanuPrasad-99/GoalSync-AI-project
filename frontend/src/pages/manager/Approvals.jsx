import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useGoals } from '../../context/GoalContext'
import { USERS } from '../../data/mockData'
import { StatusBadge, Modal, SectionHeader, EmptyState, WeightageBar } from '../../components/ui'
import toast from 'react-hot-toast'
import { ClipboardCheck, CheckCircle, XCircle, Edit3 } from 'lucide-react'

export default function Approvals() {
  const { user } = useAuth()
  const { goals, approveGoals, rejectGoals, managerUpdateGoal } = useGoals()
  const [selectedEmp, setSelectedEmp] = useState(null)
  const [comment, setComment] = useState('')
  const [actionModal, setActionModal] = useState(null) // 'approve' | 'reject'
  const [editGoal, setEditGoal] = useState(null)
  const [editForm, setEditForm] = useState({})

  const teamIds = USERS.filter(u => u.managerId === user.id).map(u => u.id)
  const pendingEmployees = [...new Set(
    goals.filter(g => g.status === 'pending' && teamIds.includes(g.employeeId)).map(g => g.employeeId)
  )]

  const getEmployee = (id) => USERS.find(u => u.id === id)
  const getEmpGoals = (empId) => goals.filter(g => g.employeeId === empId && g.status === 'pending')

  const openAction = (empId, action) => {
    setSelectedEmp(empId); setComment(''); setActionModal(action)
  }

  const handleAction = () => {
    if (!comment.trim()) return toast.error('Please add a comment')
    if (actionModal === 'approve') {
      approveGoals(selectedEmp, comment, user)
      toast.success('Goal sheet approved and locked!')
    } else {
      rejectGoals(selectedEmp, comment, user)
      toast.success('Goal sheet returned for rework.')
    }
    setActionModal(null)
  }

  const openEdit = (goal) => { setEditGoal(goal); setEditForm({ targetValue: goal.targetValue, weightage: goal.weightage }) }
  const saveEdit = () => {
    managerUpdateGoal(editGoal.id, { targetValue: Number(editForm.targetValue), weightage: Number(editForm.weightage) }, user)
    toast.success('Goal updated')
    setEditGoal(null)
  }

  return (
    <div className="space-y-5">
      <div className="card p-4 bg-amber-50 border-amber-200">
        <p className="text-amber-800 text-sm font-medium">
          {pendingEmployees.length} employee{pendingEmployees.length !== 1 ? 's' : ''} awaiting approval.
          Review goal sheets below — you can edit targets/weightages before approving.
        </p>
      </div>

      {pendingEmployees.length === 0 ? (
        <div className="card">
          <EmptyState icon={ClipboardCheck} title="All caught up!" subtitle="No pending goal sheet approvals." />
        </div>
      ) : (
        pendingEmployees.map(empId => {
          const emp = getEmployee(empId)
          const empGoals = getEmpGoals(empId)
          const totalW = empGoals.reduce((s, g) => s + g.weightage, 0)
          return (
            <div key={empId} className="card">
              <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                    {emp?.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{emp?.name}</p>
                    <p className="text-xs text-slate-400">{emp?.department} · {empGoals.length} goals · Total weight: {totalW}%</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openAction(empId, 'approve')}
                    className="btn-success flex items-center gap-1.5 text-xs">
                    <CheckCircle className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button onClick={() => openAction(empId, 'reject')}
                    className="btn-danger flex items-center gap-1.5 text-xs">
                    <XCircle className="w-3.5 h-3.5" /> Return
                  </button>
                </div>
              </div>
              <WeightageBar used={totalW} />
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
                      <th className="text-left px-5 py-2">Goal Title</th>
                      <th className="text-left px-3 py-2">Thrust Area</th>
                      <th className="text-center px-3 py-2">UoM</th>
                      <th className="text-center px-3 py-2">Target</th>
                      <th className="text-center px-3 py-2">Weight</th>
                      <th className="text-right px-5 py-2">Edit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {empGoals.map(g => (
                      <tr key={g.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3 text-sm font-medium text-slate-800">{g.title}</td>
                        <td className="px-3 py-3 text-xs text-slate-500">{g.thrustArea}</td>
                        <td className="px-3 py-3 text-center"><span className="badge bg-slate-100 text-slate-600 uppercase">{g.uom}</span></td>
                        <td className="px-3 py-3 text-center text-sm font-semibold text-slate-700">{g.targetValue}</td>
                        <td className="px-3 py-3 text-center text-sm font-semibold text-brand-600">{g.weightage}%</td>
                        <td className="px-5 py-3 text-right">
                          <button onClick={() => openEdit(g)} className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded">
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })
      )}

      {/* Approve/Reject modal */}
      <Modal open={!!actionModal} onClose={() => setActionModal(null)}
        title={actionModal === 'approve' ? '✓ Approve Goal Sheet' : '↩ Return for Rework'}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            {actionModal === 'approve'
              ? 'Goals will be locked after approval. Add a comment for the employee.'
              : 'Goals will be returned to Draft. Specify what needs to be changed.'}
          </p>
          <div>
            <label className="label">Comment *</label>
            <textarea className="input resize-none" rows={3} value={comment}
              onChange={e => setComment(e.target.value)} placeholder="Add your feedback…" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleAction}
              className={actionModal === 'approve' ? 'btn-success flex-1' : 'btn-danger flex-1'}>
              {actionModal === 'approve' ? 'Confirm Approval' : 'Return for Rework'}
            </button>
            <button onClick={() => setActionModal(null)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </div>
      </Modal>

      {/* Edit goal modal */}
      <Modal open={!!editGoal} onClose={() => setEditGoal(null)} title={`Edit: ${editGoal?.title}`}>
        <div className="space-y-4">
          <p className="text-xs text-amber-600 bg-amber-50 rounded px-3 py-2">Changes will be logged in the audit trail.</p>
          <div>
            <label className="label">Target Value</label>
            <input type="number" className="input" value={editForm.targetValue}
              onChange={e => setEditForm(p => ({ ...p, targetValue: e.target.value }))} />
          </div>
          <div>
            <label className="label">Weightage %</label>
            <input type="number" className="input" value={editForm.weightage}
              onChange={e => setEditForm(p => ({ ...p, weightage: e.target.value }))} />
          </div>
          <div className="flex gap-2">
            <button onClick={saveEdit} className="btn-primary flex-1">Save Changes</button>
            <button onClick={() => setEditGoal(null)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
