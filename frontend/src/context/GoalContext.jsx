import { createContext, useContext, useState, useCallback } from 'react'
import { INITIAL_GOALS, INITIAL_ACHIEVEMENTS, INITIAL_AUDIT_LOGS, APPROVAL_HISTORY } from '../data/mockData'

const GoalContext = createContext(null)

export function GoalProvider({ children }) {
  const [goals, setGoals] = useState(INITIAL_GOALS)
  const [achievements, setAchievements] = useState(INITIAL_ACHIEVEMENTS)
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS)
  const [approvalHistory, setApprovalHistory] = useState(APPROVAL_HISTORY)

  const addAuditLog = useCallback((userId, userName, action, entity, oldValue, newValue) => {
    const log = {
      id: Date.now(),
      userId, userName, action, entity,
      oldValue: oldValue ?? null,
      newValue: newValue ?? null,
      timestamp: new Date().toISOString()
    }
    setAuditLogs(prev => [log, ...prev])
  }, [])

  // ── GOAL CRUD ─────────────────────────────────────────────────
  const createGoal = useCallback((goalData, user) => {
    const goal = { ...goalData, id: Date.now(), status: 'draft', isLocked: false, isShared: false, createdAt: new Date().toISOString() }
    setGoals(prev => [...prev, goal])
    addAuditLog(user.id, user.name, 'Goal Created', `Goal: ${goalData.title}`, null, goalData.title)
    return goal
  }, [addAuditLog])

  const updateGoal = useCallback((id, updates, user) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g))
    if (user) addAuditLog(user.id, user.name, 'Goal Updated', `Goal #${id}`, null, JSON.stringify(updates))
  }, [addAuditLog])

  const deleteGoal = useCallback((id, user) => {
    setGoals(prev => prev.filter(g => g.id !== id))
    if (user) addAuditLog(user.id, user.name, 'Goal Deleted', `Goal #${id}`, null, null)
  }, [addAuditLog])

  const submitGoalSheet = useCallback((employeeId, user) => {
    setGoals(prev => prev.map(g =>
      g.employeeId === employeeId && g.status === 'draft' ? { ...g, status: 'pending' } : g
    ))
    addAuditLog(user.id, user.name, 'Goal Sheet Submitted', 'Goal Sheet', 'Draft', 'Pending Approval')
  }, [addAuditLog])

  // ── APPROVALS ─────────────────────────────────────────────────
  const approveGoals = useCallback((employeeId, comment, manager) => {
    setGoals(prev => prev.map(g =>
      g.employeeId === employeeId && g.status === 'pending' ? { ...g, status: 'approved', isLocked: true } : g
    ))
    setApprovalHistory(prev => [...prev, {
      id: Date.now(), goalSheetEmployeeId: employeeId,
      managerId: manager.id, action: 'approved', comment, timestamp: new Date().toISOString()
    }])
    addAuditLog(manager.id, manager.name, 'Goal Sheet Approved', 'Goal Sheet', 'Pending', 'Approved')
  }, [addAuditLog])

  const rejectGoals = useCallback((employeeId, comment, manager) => {
    setGoals(prev => prev.map(g =>
      g.employeeId === employeeId && g.status === 'pending' ? { ...g, status: 'draft' } : g
    ))
    setApprovalHistory(prev => [...prev, {
      id: Date.now(), goalSheetEmployeeId: employeeId,
      managerId: manager.id, action: 'rejected', comment, timestamp: new Date().toISOString()
    }])
    addAuditLog(manager.id, manager.name, 'Goal Sheet Rejected', 'Goal Sheet', 'Pending', `Returned for rework: ${comment}`)
  }, [addAuditLog])

  const managerUpdateGoal = useCallback((id, updates, manager) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== id) return g
      if (updates.targetValue !== undefined) addAuditLog(manager.id, manager.name, 'Target Modified', `Goal #${id}`, `Target: ${g.targetValue}`, `Target: ${updates.targetValue}`)
      if (updates.weightage !== undefined) addAuditLog(manager.id, manager.name, 'Weightage Modified', `Goal #${id}`, `${g.weightage}%`, `${updates.weightage}%`)
      return { ...g, ...updates }
    }))
  }, [addAuditLog])

  // ── ACHIEVEMENTS ─────────────────────────────────────────────
  const upsertAchievement = useCallback((data, user) => {
    setAchievements(prev => {
      const existing = prev.find(a => a.goalId === data.goalId && a.quarter === data.quarter)
      if (existing) return prev.map(a => a.goalId === data.goalId && a.quarter === data.quarter ? { ...a, ...data } : a)
      return [...prev, { id: Date.now(), ...data }]
    })
    addAuditLog(user.id, user.name, `${data.quarter} Check-in Updated`, `Goal #${data.goalId}`, null, `Actual: ${data.actual}`)
  }, [addAuditLog])

  // ── SHARED GOALS ──────────────────────────────────────────────
  const pushSharedGoal = useCallback((goalData, employeeIds, admin) => {
    const newGoals = employeeIds.map(empId => ({
      ...goalData, id: Date.now() + empId, employeeId: empId,
      status: 'approved', isLocked: true, isShared: true,
      createdAt: new Date().toISOString()
    }))
    setGoals(prev => [...prev, ...newGoals])
    addAuditLog(admin.id, admin.name, 'Shared Goal Pushed', `Goal: ${goalData.title}`, null, `Pushed to ${employeeIds.length} employees`)
  }, [addAuditLog])

  // ── COMPUTED HELPERS ──────────────────────────────────────────
  const computeProgress = useCallback((goal, actual) => {
    if (goal.uom === 'zero') return actual === 0 ? 100 : 0
    if (goal.uom === 'max')  return goal.targetValue === 0 ? 0 : Math.min((goal.targetValue / actual) * 100, 150)
    if (goal.uom === 'timeline') return actual === 1 ? 100 : 0
    return goal.targetValue === 0 ? 0 : Math.min((actual / goal.targetValue) * 100, 150)
  }, [])

  return (
    <GoalContext.Provider value={{
      goals, achievements, auditLogs, approvalHistory,
      createGoal, updateGoal, deleteGoal, submitGoalSheet,
      approveGoals, rejectGoals, managerUpdateGoal,
      upsertAchievement, pushSharedGoal, computeProgress
    }}>
      {children}
    </GoalContext.Provider>
  )
}

export const useGoals = () => {
  const ctx = useContext(GoalContext)
  if (!ctx) throw new Error('useGoals must be used within GoalProvider')
  return ctx
}
