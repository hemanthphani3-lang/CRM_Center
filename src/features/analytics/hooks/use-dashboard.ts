'use client'

import { useQuery } from '@tanstack/react-query'

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DashboardKPIs {
  totalLeads: number
  totalLeadsGrowth: number
  activeDeals: number
  activeDealValue: number
  revenue: number
  revenueGrowth: number
  tasksDueToday: number
}

export interface PipelineStage {
  stage: string
  count: number
  value: number
}

export interface Activity {
  id: string
  type: 'call' | 'whatsapp' | 'task' | 'note' | 'deal'
  actor: string
  description: string
  timestamp: string
  linkedRecord: string
  linkedRecordType: string
}

export interface UpcomingTask {
  id: string
  title: string
  priority: 'urgent' | 'high' | 'medium' | 'low'
  dueDate: string
  assignee: string
  assigneeInitials: string
}

export interface AIInsight {
  id: string
  text: string
  actionLabel: string
  actionHref: string
  color: string
}

export interface RevenueTrendPoint {
  date: string
  revenue: number
}

export interface LeadSource {
  name: string
  value: number
  color: string
}

export interface ConversionStep {
  label: string
  percentage: number
}
