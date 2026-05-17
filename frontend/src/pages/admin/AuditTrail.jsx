import { useState } from 'react'
import { useGoals } from '../../context/GoalContext'
import { SectionHeader } from '../../components/ui'
import { Shield, Download } from 'lucide-react'
import * as XLSX from 'xlsx'
import toast from 'react-hot-toast'

export default function AuditTrail() {
  const { auditLogs } = useGoals()
  const [search, setSearch] = useState('')

  const filtered = auditLogs.filter(l =>
    l.userName.toLowerCase().includes(search.toLowerCase()) ||
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.entity.toLowerCase().includes(search.toLowerCase())
  )

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(auditLogs.map(l => ({
      'User': l.userName, 'Action': l.action, 'Entity': l.entity,
      'Old Value': l.oldValue || '', 'New Value': l.newValue || '',
      'Timestamp': new Date(l.timestamp).toLocaleString()
    })))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Audit Log')
    XLSX.writeFile(wb, 'GoalSync_AuditLog.xlsx')
    toast.success('Audit log exported!')
  }

  const ACTION_COLOR = (action) => {
    if (action.includes('Approved')) return 'bg-emerald-100 text-emerald-700'
    if (action.includes('Rejected') || action.includes('Deleted')) return 'bg-red-100 text-red-700'
    if (action.includes('Modified')) return 'bg-amber-100 text-amber-700'
    if (action.includes('Pushed')) return 'bg-purple-100 text-purple-700'
    return 'bg-slate-100 text-slate-600'
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-brand-600" />
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Audit Trail</h2>
            <p className="text-xs text-slate-400">{auditLogs.length} events logged · Immutable record</p>
          </div>
        </div>
        <button onClick={exportExcel} className="btn-secondary flex items-center gap-2">
          <Download className="w-4 h-4" /> Export Excel
        </button>
      </div>

      <div className="card p-4">
        <input className="input" placeholder="Search by user, action or entity…" value={search}
          onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
                <th className="text-left px-5 py-3">Timestamp</th>
                <th className="text-left px-3 py-3">User</th>
                <th className="text-left px-3 py-3">Action</th>
                <th className="text-left px-3 py-3">Entity</th>
                <th className="text-left px-3 py-3">Old Value</th>
                <th className="text-left px-3 py-3">New Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 text-xs text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-3 py-3 text-sm font-medium text-slate-700">{log.userName}</td>
                  <td className="px-3 py-3">
                    <span className={`badge text-xs ${ACTION_COLOR(log.action)}`}>{log.action}</span>
                  </td>
                  <td className="px-3 py-3 text-xs text-slate-500">{log.entity}</td>
                  <td className="px-3 py-3 text-xs text-slate-400 max-w-32 truncate">{log.oldValue || '—'}</td>
                  <td className="px-3 py-3 text-xs text-slate-600 max-w-40 truncate">{log.newValue || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center text-slate-400 text-sm py-8">No matching audit records.</p>
          )}
        </div>
      </div>
    </div>
  )
}
