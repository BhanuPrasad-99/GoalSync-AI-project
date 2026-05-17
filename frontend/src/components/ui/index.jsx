import { TrendingUp, TrendingDown, Minus, Lightbulb, AlertTriangle, CheckCircle, Info } from 'lucide-react'

// ── KPI Card ─────────────────────────────────────────────────────
export function KPICard({ title, value, subtitle, trend, trendValue, icon: Icon, color = 'brand' }) {
  const colors = {
    brand:   'bg-brand-50 text-brand-600',
    blue:    'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber:   'bg-amber-50 text-amber-600',
    red:     'bg-red-50 text-red-600',
    purple:  'bg-purple-50 text-purple-600',
  }
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        {Icon && (
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colors[color]}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-800 mb-1">{value}</p>
      {subtitle && <p className="text-slate-400 text-xs">{subtitle}</p>}
      {trendValue !== undefined && (
        <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-500' : 'text-slate-400'}`}>
          {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : trend === 'down' ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
          {trendValue}
        </div>
      )}
    </div>
  )
}

// ── Progress Bar ──────────────────────────────────────────────────
export function ProgressBar({ value, max = 100, color = 'brand', showLabel = true, height = 'h-2' }) {
  const pct = Math.min((value / max) * 100, 100)
  const colors = { brand: 'bg-brand-600', emerald: 'bg-emerald-500', amber: 'bg-amber-500', red: 'bg-red-500', blue: 'bg-blue-500' }
  return (
    <div className="w-full">
      <div className={`w-full bg-slate-100 rounded-full ${height} overflow-hidden`}>
        <div className={`${height} rounded-full transition-all duration-500 ${colors[color]}`} style={{ width: `${pct}%` }} />
      </div>
      {showLabel && <p className="text-xs text-slate-500 mt-1 text-right">{Math.round(pct)}%</p>}
    </div>
  )
}

// ── Status Badge ──────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const map = {
    draft:      'bg-slate-100 text-slate-600',
    pending:    'bg-amber-100 text-amber-700',
    approved:   'bg-emerald-100 text-emerald-700',
    rejected:   'bg-red-100 text-red-700',
    'Not Started': 'bg-slate-100 text-slate-600',
    'On Track':    'bg-blue-100 text-blue-700',
    'Completed':   'bg-emerald-100 text-emerald-700',
  }
  return (
    <span className={`badge ${map[status] || 'bg-slate-100 text-slate-600'} capitalize`}>{status}</span>
  )
}

// ── AI Insight Card ───────────────────────────────────────────────
export function InsightCard({ insight }) {
  const config = {
    success: { bg: 'bg-emerald-50 border-emerald-200', icon: CheckCircle, color: 'text-emerald-600' },
    warning: { bg: 'bg-amber-50 border-amber-200',     icon: AlertTriangle, color: 'text-amber-600' },
    info:    { bg: 'bg-blue-50 border-blue-200',       icon: Info,         color: 'text-blue-600' },
  }
  const { bg, icon: Icon, color } = config[insight.type] || config.info
  return (
    <div className={`rounded-lg border p-4 flex gap-3 ${bg}`}>
      <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${color}`} />
      <p className="text-sm text-slate-700">{insight.text}</p>
    </div>
  )
}

// ── Section Header ────────────────────────────────────────────────
export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
        {subtitle && <p className="text-slate-400 text-sm mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

// ── Empty State ───────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="text-center py-16">
      {Icon && <Icon className="w-12 h-12 text-slate-300 mx-auto mb-4" />}
      <h3 className="text-slate-600 font-medium mb-1">{title}</h3>
      {subtitle && <p className="text-slate-400 text-sm mb-4">{subtitle}</p>}
      {action}
    </div>
  )
}

// ── Weightage Indicator ───────────────────────────────────────────
export function WeightageBar({ used }) {
  const remaining = 100 - used
  const color = used === 100 ? 'bg-emerald-500' : used > 100 ? 'bg-red-500' : 'bg-brand-600'
  return (
    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
      <div className="flex justify-between text-xs mb-2">
        <span className="font-medium text-slate-600">Weightage used</span>
        <span className={`font-bold ${used === 100 ? 'text-emerald-600' : used > 100 ? 'text-red-500' : 'text-brand-600'}`}>
          {used}% / 100%
        </span>
      </div>
      <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
        <div className={`h-3 rounded-full transition-all ${color}`} style={{ width: `${Math.min(used, 100)}%` }} />
      </div>
      <p className={`text-xs mt-1 ${used === 100 ? 'text-emerald-600' : used > 100 ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
        {used === 100 ? '✓ Total weightage is exactly 100%' : used > 100 ? `⚠ Over by ${used - 100}% — reduce weightage` : `${remaining}% remaining`}
      </p>
    </div>
  )
}

// ── Modal ─────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, maxWidth = 'max-w-lg' }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-xl shadow-xl w-full ${maxWidth} mx-4 max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">&times;</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
