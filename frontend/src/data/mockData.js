// ── USERS ────────────────────────────────────────────────────────
export const USERS = [
  { id: 1, name: 'Priya Sharma',   email: 'employee@goalsync.ai', password: 'demo1234', role: 'employee', department: 'Sales',      managerId: 2, avatar: 'PS' },
  { id: 2, name: 'Arjun Mehta',   email: 'manager@goalsync.ai',  password: 'demo1234', role: 'manager',  department: 'Sales',      managerId: 3, avatar: 'AM' },
  { id: 3, name: 'Neha Kapoor',   email: 'admin@goalsync.ai',    password: 'demo1234', role: 'admin',    department: 'HR',         managerId: null, avatar: 'NK' },
  { id: 4, name: 'Ravi Kumar',    email: 'ravi@goalsync.ai',     password: 'demo1234', role: 'employee', department: 'Sales',      managerId: 2, avatar: 'RK' },
  { id: 5, name: 'Sunita Pillai', email: 'sunita@goalsync.ai',   password: 'demo1234', role: 'employee', department: 'Operations', managerId: 2, avatar: 'SP' },
  { id: 6, name: 'Dev Anand',     email: 'dev@goalsync.ai',      password: 'demo1234', role: 'employee', department: 'Tech',       managerId: 2, avatar: 'DA' },
]

// ── THRUST AREAS ─────────────────────────────────────────────────
export const THRUST_AREAS = [
  'Revenue Growth', 'Customer Success', 'Operational Efficiency',
  'People & Culture', 'Innovation', 'Quality & Compliance',
  'Digital Transformation', 'Cost Optimisation'
]

// ── UOM TYPES ────────────────────────────────────────────────────
export const UOM_TYPES = [
  { value: 'min',      label: 'Numeric / % (Higher is better)',  formula: 'Achievement ÷ Target' },
  { value: 'max',      label: 'Numeric / % (Lower is better)',   formula: 'Target ÷ Achievement' },
  { value: 'timeline', label: 'Timeline (Date-based)',           formula: 'Completion vs Deadline' },
  { value: 'zero',     label: 'Zero-based (Zero = Success)',     formula: 'If 0 → 100%, else 0%' },
]

// ── GOALS ────────────────────────────────────────────────────────
export const INITIAL_GOALS = [
  // Employee 1 (Priya) - Approved & Locked
  { id: 1, employeeId: 1, title: 'Achieve Q1 Sales Target',        description: 'Close ₹50L in new business revenue for Q1 FY26', thrustArea: 'Revenue Growth',          uom: 'min',      targetValue: 50,  weightage: 30, status: 'approved', isLocked: true,  isShared: false, createdAt: '2026-05-02T09:00:00Z' },
  { id: 2, employeeId: 1, title: 'Customer Satisfaction Score',     description: 'Maintain CSAT above 90% across all accounts',    thrustArea: 'Customer Success',        uom: 'min',      targetValue: 90,  weightage: 25, status: 'approved', isLocked: true,  isShared: false, createdAt: '2026-05-02T09:05:00Z' },
  { id: 3, employeeId: 1, title: 'Reduce Customer Churn',          description: 'Keep monthly churn below 2%',                    thrustArea: 'Operational Efficiency',  uom: 'max',      targetValue: 2,   weightage: 20, status: 'approved', isLocked: true,  isShared: false, createdAt: '2026-05-02T09:10:00Z' },
  { id: 4, employeeId: 1, title: 'Complete Sales Training',        description: 'Finish 3 certified courses on Salesforce CRM',   thrustArea: 'People & Culture',        uom: 'timeline', targetValue: 0,   weightage: 15, status: 'approved', isLocked: true,  isShared: false, createdAt: '2026-05-02T09:15:00Z' },
  { id: 5, employeeId: 1, title: 'Zero Compliance Incidents',      description: 'Maintain zero data/compliance violations',       thrustArea: 'Quality & Compliance',    uom: 'zero',     targetValue: 0,   weightage: 10, status: 'approved', isLocked: true,  isShared: false, createdAt: '2026-05-02T09:20:00Z' },
  // Employee 4 (Ravi) - Pending
  { id: 6, employeeId: 4, title: 'Upsell Existing Accounts',       description: 'Generate ₹20L from upsell/cross-sell',          thrustArea: 'Revenue Growth',          uom: 'min',      targetValue: 20,  weightage: 40, status: 'pending',  isLocked: false, isShared: false, createdAt: '2026-05-10T10:00:00Z' },
  { id: 7, employeeId: 4, title: 'New Account Acquisition',        description: 'Onboard 5 new enterprise clients',              thrustArea: 'Revenue Growth',          uom: 'min',      targetValue: 5,   weightage: 35, status: 'pending',  isLocked: false, isShared: false, createdAt: '2026-05-10T10:05:00Z' },
  { id: 8, employeeId: 4, title: 'Pipeline Coverage Ratio',        description: 'Maintain 3x pipeline vs quota',                 thrustArea: 'Operational Efficiency',  uom: 'min',      targetValue: 3,   weightage: 25, status: 'pending',  isLocked: false, isShared: false, createdAt: '2026-05-10T10:10:00Z' },
  // Employee 5 (Sunita) - Draft
  { id: 9, employeeId: 5, title: 'Process Automation Initiative',  description: 'Automate 3 manual ops workflows',               thrustArea: 'Digital Transformation',  uom: 'min',      targetValue: 3,   weightage: 40, status: 'draft',    isLocked: false, isShared: false, createdAt: '2026-05-12T11:00:00Z' },
  { id:10, employeeId: 5, title: 'SLA Compliance',                 description: 'Maintain >98% SLA across all tickets',          thrustArea: 'Quality & Compliance',    uom: 'min',      targetValue: 98,  weightage: 35, status: 'draft',    isLocked: false, isShared: false, createdAt: '2026-05-12T11:05:00Z' },
  { id:11, employeeId: 5, title: 'Cost Reduction',                 description: 'Reduce operational costs by 10%',               thrustArea: 'Cost Optimisation',       uom: 'max',      targetValue: 10,  weightage: 25, status: 'draft',    isLocked: false, isShared: false, createdAt: '2026-05-12T11:10:00Z' },
  // Shared goal pushed by admin
  { id:12, employeeId: 1, title: '[Shared] Org NPS Target',        description: 'Department-wide Net Promoter Score target',     thrustArea: 'Customer Success',        uom: 'min',      targetValue: 45,  weightage: 0,  status: 'approved', isLocked: true,  isShared: true,  createdAt: '2026-05-03T08:00:00Z' },
]

// ── ACHIEVEMENTS ─────────────────────────────────────────────────
export const INITIAL_ACHIEVEMENTS = [
  { id: 1, goalId: 1, quarter: 'Q1', planned: 15, actual: 18, progress: 120, status: 'Completed',   comment: 'Exceeded target — strong lead conversion this quarter.' },
  { id: 2, goalId: 2, quarter: 'Q1', planned: 90, actual: 87, progress: 96,  status: 'On Track',    comment: 'Slightly below target due to onboarding delays.' },
  { id: 3, goalId: 3, quarter: 'Q1', planned: 2,  actual: 1.8,progress: 111, status: 'Completed',   comment: 'Churn rate well managed.' },
  { id: 4, goalId: 4, quarter: 'Q1', planned: 1,  actual: 1,  progress: 100, status: 'Completed',   comment: 'Module 1 done.' },
  { id: 5, goalId: 5, quarter: 'Q1', planned: 0,  actual: 0,  progress: 100, status: 'Completed',   comment: 'Zero incidents.' },
  { id: 6, goalId: 1, quarter: 'Q2', planned: 15, actual: 12, progress: 80,  status: 'On Track',    comment: 'Pipeline healthy, closing next month.' },
  { id: 7, goalId: 2, quarter: 'Q2', planned: 90, actual: 91, progress: 101, status: 'Completed',   comment: 'Customer success team performed well.' },
]

// ── APPROVAL HISTORY ─────────────────────────────────────────────
export const APPROVAL_HISTORY = [
  { id: 1, goalSheetEmployeeId: 1, managerId: 2, action: 'approved', comment: 'Well-structured goals. Revenue targets are ambitious but realistic.', timestamp: '2026-05-05T14:30:00Z' },
  { id: 2, goalSheetEmployeeId: 4, managerId: 2, action: 'pending',  comment: '', timestamp: '2026-05-10T10:30:00Z' },
]

// ── AUDIT LOGS ───────────────────────────────────────────────────
export const INITIAL_AUDIT_LOGS = [
  { id: 1,  userId: 1, userName: 'Priya Sharma',  action: 'Goal Created',         entity: 'Goal #1',   oldValue: null,        newValue: 'Achieve Q1 Sales Target',   timestamp: '2026-05-02T09:00:00Z' },
  { id: 2,  userId: 1, userName: 'Priya Sharma',  action: 'Goal Sheet Submitted',  entity: 'Goal Sheet', oldValue: 'Draft',      newValue: 'Pending Approval',          timestamp: '2026-05-03T11:00:00Z' },
  { id: 3,  userId: 2, userName: 'Arjun Mehta',   action: 'Goal Approved',         entity: 'Goal Sheet', oldValue: 'Pending',    newValue: 'Approved',                  timestamp: '2026-05-05T14:30:00Z' },
  { id: 4,  userId: 2, userName: 'Arjun Mehta',   action: 'Target Modified',       entity: 'Goal #2',   oldValue: 'Target: 85', newValue: 'Target: 90',                timestamp: '2026-05-05T14:25:00Z' },
  { id: 5,  userId: 3, userName: 'Neha Kapoor',   action: 'Shared Goal Pushed',    entity: 'Org NPS',   oldValue: null,        newValue: 'Pushed to Sales dept',      timestamp: '2026-05-03T08:00:00Z' },
  { id: 6,  userId: 1, userName: 'Priya Sharma',  action: 'Q1 Check-in Submitted', entity: 'Goal #1',   oldValue: null,        newValue: 'Actual: 18L',               timestamp: '2026-07-05T10:00:00Z' },
  { id: 7,  userId: 2, userName: 'Arjun Mehta',   action: 'Q1 Review Comment',     entity: 'Goal #1',   oldValue: null,        newValue: 'Strong quarter!',           timestamp: '2026-07-06T09:00:00Z' },
  { id: 8,  userId: 4, userName: 'Ravi Kumar',    action: 'Goal Sheet Submitted',  entity: 'Goal Sheet', oldValue: 'Draft',      newValue: 'Pending Approval',          timestamp: '2026-05-10T10:30:00Z' },
]

// ── CHECKIN SCHEDULE ─────────────────────────────────────────────
export const CHECKIN_SCHEDULE = [
  { period: 'Goal Setting', opens: '2026-05-01', closes: '2026-06-30', label: 'Phase 1 — Goal Setting', status: 'active' },
  { period: 'Q1',           opens: '2026-07-01', closes: '2026-07-31', label: 'Q1 Check-in',            status: 'upcoming' },
  { period: 'Q2',           opens: '2026-10-01', closes: '2026-10-31', label: 'Q2 Check-in',            status: 'upcoming' },
  { period: 'Q3',           opens: '2027-01-01', closes: '2027-01-31', label: 'Q3 Check-in',            status: 'upcoming' },
  { period: 'Q4',           opens: '2027-03-01', closes: '2027-04-30', label: 'Q4 / Annual',            status: 'upcoming' },
]

// ── TEAM STATS (for manager analytics) ───────────────────────────
export const TEAM_STATS = [
  { name: 'Priya Sharma',  completion: 92, checkIn: true,  goalsApproved: 5, pending: 0 },
  { name: 'Ravi Kumar',    completion: 0,  checkIn: false, goalsApproved: 0, pending: 3 },
  { name: 'Sunita Pillai', completion: 0,  checkIn: false, goalsApproved: 0, pending: 0 },
  { name: 'Dev Anand',     completion: 74, checkIn: true,  goalsApproved: 4, pending: 0 },
]

// ── DEPT ANALYTICS (for admin) ───────────────────────────────────
export const DEPT_ANALYTICS = [
  { dept: 'Sales',      completion: 68, submitted: 8,  approved: 6, pending: 2, checkins: 5 },
  { dept: 'Operations', completion: 45, submitted: 6,  approved: 4, pending: 2, checkins: 3 },
  { dept: 'Tech',       completion: 82, submitted: 10, approved: 9, pending: 1, checkins: 8 },
  { dept: 'HR',         completion: 91, submitted: 5,  approved: 5, pending: 0, checkins: 5 },
  { dept: 'Finance',    completion: 55, submitted: 7,  approved: 5, pending: 2, checkins: 4 },
]

// ── QOQ TREND DATA ───────────────────────────────────────────────
export const QOQ_TREND = [
  { quarter: 'Q3 FY25', avg: 72 },
  { quarter: 'Q4 FY25', avg: 78 },
  { quarter: 'Q1 FY26', avg: 85 },
  { quarter: 'Q2 FY26', avg: 81 },
]

// ── AI INSIGHTS ──────────────────────────────────────────────────
export const AI_INSIGHTS = [
  { id: 1, type: 'success', role: 'employee', text: 'Your Q1 Sales target was exceeded by 20%. Q2 pipeline looks strong — maintain momentum.' },
  { id: 2, type: 'warning', role: 'employee', text: 'Customer Satisfaction is 3% below target this quarter. Consider proactive check-ins with key accounts.' },
  { id: 3, type: 'info',    role: 'manager',  text: 'Team check-in completion is at 50%. Ravi Kumar and Sunita Pillai have not submitted Q1 updates.' },
  { id: 4, type: 'warning', role: 'manager',  text: 'Ravi Kumar\'s goal sheet has been pending approval for 7 days. Review recommended.' },
  { id: 5, type: 'success', role: 'manager',  text: 'Team average completion improved by 13% compared to Q4 FY25.' },
  { id: 6, type: 'warning', role: 'admin',    text: 'Operations dept check-in completion is at 45% — lowest across the org. Escalation may be needed.' },
  { id: 7, type: 'info',    role: 'admin',    text: 'Goal Setting phase closes June 30. 2 employees in Sales have not submitted goal sheets.' },
  { id: 8, type: 'success', role: 'admin',    text: 'HR and Tech departments lead org-wide with 91% and 82% completion rates respectively.' },
]
