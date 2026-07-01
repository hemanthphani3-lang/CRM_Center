'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, ArrowUpRight, ArrowDownRight, Calendar, Sparkles, Filter, TrendingUp, Briefcase } from 'lucide-react'
import { db } from '@/lib/db'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts'

const REVENUE_DATA = [
  { month: 'Jan', mrr: 45000, deals: 32000, target: 40000 },
  { month: 'Feb', mrr: 52000, deals: 41000, target: 45000 },
  { month: 'Mar', mrr: 61000, deals: 53000, target: 50000 },
  { month: 'Apr', mrr: 68000, deals: 59000, target: 60000 },
  { month: 'May', mrr: 75000, deals: 71000, target: 70000 },
  { month: 'Jun', mrr: 89000, deals: 82000, target: 80000 }
]

export default function RevenuePage() {
  const [mounted, setMounted] = useState(false)
  const [timeframe, setTimeframe] = useState('6m')
  const [currencySymbol, setCurrencySymbol] = useState('$')

  useEffect(() => {
    setMounted(true)
    db.initialize()
    const org = db.getOrg()
    if (org && org.currency) {
      setCurrencySymbol(org.currency === 'USD' ? '$' : org.currency === 'EUR' ? '€' : org.currency)
    }
  }, [])

  if (!mounted) return null

  // Calculate some simple metrics
  const totalMRR = REVENUE_DATA[REVENUE_DATA.length - 1].mrr
  const totalDealsWonValue = REVENUE_DATA.reduce((sum, item) => sum + item.deals, 0)
  const growthRate = (((REVENUE_DATA[REVENUE_DATA.length - 1].mrr - REVENUE_DATA[0].mrr) / REVENUE_DATA[0].mrr) * 100).toFixed(1)

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 bg-gray-50/50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <DollarSign size={22} className="text-brand animate-pulse" />
            Revenue Analytics
          </h1>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            Track your Monthly Recurring Revenue (MRR), total contract value, and growth trajectories.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-white border border-gray-200 p-0.5 shadow-sm">
            {[['3m', '3 Months'], ['6m', '6 Months'], ['1y', '1 Year']].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTimeframe(key)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  timeframe === key
                    ? 'bg-brand text-white shadow-xs'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm relative overflow-hidden group"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Current MRR</span>
              <h2 className="text-2xl font-black text-gray-850">
                {currencySymbol}
                {totalMRR.toLocaleString()}
              </h2>
            </div>
            <span className="rounded-xl bg-emerald-50 text-emerald-600 p-2.5 flex items-center justify-center">
              <TrendingUp size={16} />
            </span>
          </div>
          <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <ArrowUpRight size={14} />
            <span>+{growthRate}% from Jan</span>
            <span className="text-gray-400 font-medium ml-1">last 6 months</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm relative overflow-hidden group"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Pipeline Won</span>
              <h2 className="text-2xl font-black text-gray-850">
                {currencySymbol}
                {totalDealsWonValue.toLocaleString()}
              </h2>
            </div>
            <span className="rounded-xl bg-indigo-50 text-brand p-2.5 flex items-center justify-center">
              <Briefcase size={16} />
            </span>
          </div>
          <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <ArrowUpRight size={14} />
            <span>+12.4%</span>
            <span className="text-gray-400 font-medium ml-1">vs target pipeline</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm relative overflow-hidden group"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Avg. Contract Value</span>
              <h2 className="text-2xl font-black text-gray-850">
                {currencySymbol}
                {(totalDealsWonValue / 15).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </h2>
            </div>
            <span className="rounded-xl bg-purple-50 text-purple-600 p-2.5 flex items-center justify-center">
              <Sparkles size={16} />
            </span>
          </div>
          <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-red-500">
            <ArrowDownRight size={14} />
            <span>-1.5%</span>
            <span className="text-gray-400 font-medium ml-1">vs last month avg</span>
          </div>
        </motion.div>
      </div>

      {/* Recharts Area Chart */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-150 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-450">MRR Growth Trend</h3>
            <span className="text-[10px] font-bold text-gray-400">Monthly breakdown</span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--brand-color, #7c3aed)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--brand-color, #7c3aed)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} style={{ fontSize: 10, fontWeight: 600, fill: '#9ca3af' }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: 10, fontWeight: 600, fill: '#9ca3af' }} />
                <Tooltip
                  contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontSize: 11, fontWeight: 700, color: '#374151' }}
                  itemStyle={{ fontSize: 11, fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="mrr" stroke="var(--brand-color, #7c3aed)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMrr)" name="MRR" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-450">Deals vs Target</h3>
            <span className="text-[10px] font-bold text-gray-400">Values Comparison</span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} style={{ fontSize: 10, fontWeight: 600, fill: '#9ca3af' }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: 10, fontWeight: 600, fill: '#9ca3af' }} />
                <Tooltip
                  contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12 }}
                  labelStyle={{ fontSize: 11, fontWeight: 700, color: '#374151' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 10, fontWeight: 600 }} />
                <Bar dataKey="deals" fill="var(--brand-color, #7c3aed)" radius={[4, 4, 0, 0]} name="Won Value" />
                <Bar dataKey="target" fill="#e5e7eb" radius={[4, 4, 0, 0]} name="Target Value" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
