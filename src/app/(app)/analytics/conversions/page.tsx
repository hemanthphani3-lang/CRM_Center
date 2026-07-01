'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, ArrowRight, Zap, Target, Award, Clock } from 'lucide-react'
import { db } from '@/lib/db'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line
} from 'recharts'

const FUNNEL_DATA = [
  { stage: 'New Leads', count: 120, pct: 100, color: '#7c3aed' },
  { stage: 'Contacted', count: 85, pct: 70.8, color: '#6366f1' },
  { stage: 'Scoping / Qualified', count: 50, pct: 41.6, color: '#3b82f6' },
  { stage: 'Proposal / Quote', count: 32, pct: 26.6, color: '#10b981' },
  { stage: 'Won Deals', count: 18, pct: 15.0, color: '#059669' }
]

const VELOCITY_DATA = [
  { month: 'Jan', days: 28 },
  { month: 'Feb', days: 26 },
  { month: 'Mar', days: 24 },
  { month: 'Apr', days: 25 },
  { month: 'May', days: 22 },
  { month: 'Jun', days: 19 }
]

export default function ConversionsPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    db.initialize()
  }, [])

  if (!mounted) return null

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 bg-gray-50/50 min-h-screen font-sans">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <TrendingUp size={22} className="text-brand" />
          Funnel Conversions
        </h1>
        <p className="text-xs text-gray-500 font-semibold mt-1">
          Monitor your customer journey progression rates and average sales cycle pipeline speeds.
        </p>
      </div>

      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Conv. Rate</span>
              <h2 className="text-2xl font-black text-gray-850 mt-1">15.0%</h2>
            </div>
            <span className="rounded-xl bg-emerald-50 text-emerald-600 p-2.5">
              <Target size={16} />
            </span>
          </div>
          <p className="text-[11px] font-bold text-emerald-650 mt-4 flex items-center gap-1">
            <span>+2.4%</span>
            <span className="text-gray-400 font-medium">vs industry average (12.6%)</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Avg. Scoping Velocity</span>
              <h2 className="text-2xl font-black text-gray-850 mt-1">19 Days</h2>
            </div>
            <span className="rounded-xl bg-indigo-50 text-brand p-2.5">
              <Clock size={16} />
            </span>
          </div>
          <p className="text-[11px] font-bold text-emerald-650 mt-4 flex items-center gap-1">
            <span>-3 Days</span>
            <span className="text-gray-400 font-medium">faster than last month</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Proposal to Won</span>
              <h2 className="text-2xl font-black text-gray-850 mt-1">56.2%</h2>
            </div>
            <span className="rounded-xl bg-amber-50 text-amber-600 p-2.5">
              <Award size={16} />
            </span>
          </div>
          <p className="text-[11px] font-bold text-emerald-650 mt-4 flex items-center gap-1">
            <span>+5.1%</span>
            <span className="text-gray-400 font-medium">increase in quote accuracy</span>
          </p>
        </motion.div>
      </div>

      {/* Main Charts grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Stage Conversions Funnel Chart */}
        <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-450">Pipeline Funnel Stage Conversion</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Absolute count of leads passing each criteria</p>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={FUNNEL_DATA} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                <XAxis type="number" hide />
                <YAxis dataKey="stage" type="category" axisLine={false} tickLine={false} style={{ fontSize: 11, fontWeight: 700, fill: '#374151' }} width={120} />
                <Tooltip
                  formatter={(value: any) => [`${value} leads`, 'Count']}
                  contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12 }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {FUNNEL_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales cycle velocity trend */}
        <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-450">Sales Velocity Cycle (Days)</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Average days elapsed from Lead Intake to Deal Closed Won</p>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={VELOCITY_DATA} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} style={{ fontSize: 10, fontWeight: 650, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} style={{ fontSize: 10, fontWeight: 650, fill: '#9ca3af' }} />
                <Tooltip
                  formatter={(value: any) => [`${value} days`, 'Avg. Velocity']}
                  contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12 }}
                />
                <Line type="monotone" dataKey="days" stroke="var(--brand-color, #7c3aed)" strokeWidth={3} activeDot={{ r: 6 }} name="Days to Close" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Conversion stats list */}
      <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-gray-450">Funnel Progression Efficiency</h3>
        <div className="space-y-4">
          {FUNNEL_DATA.slice(0, -1).map((item, idx) => {
            const nextItem = FUNNEL_DATA[idx + 1]
            const flowRate = ((nextItem.count / item.count) * 100).toFixed(1)
            return (
              <div key={item.stage} className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/30">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-800">{item.stage}</span>
                  <ArrowRight size={14} className="text-gray-400" />
                  <span className="text-xs font-bold text-gray-800">{nextItem.stage}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-brand h-full"
                      style={{ width: `${flowRate}%` }}
                    />
                  </div>
                  <span className="text-xs font-extrabold text-gray-800 w-12 text-right">{flowRate}%</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
