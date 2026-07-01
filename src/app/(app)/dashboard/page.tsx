'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users, DollarSign, Briefcase, CheckSquare, TrendingUp,
  Sparkles, ArrowUpRight, ChevronRight, Activity, CalendarDays
} from 'lucide-react'
import { db, Lead, Deal, Task } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts'

const PIE_COLORS = ['#6366f1', '#a855f7', '#3b82f6', '#10b981', '#f59e0b']

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [tasks, setTasks] = useState<Task[]>([])

  const loadData = () => {
    setLeads(db.getLeads())
    setDeals(db.getDeals())
    setTasks(db.getTasks())
  }

  useEffect(() => {
    setMounted(true)
    db.initialize()
    loadData()

    window.addEventListener('jesty_db_synced', loadData)
    return () => {
      window.removeEventListener('jesty_db_synced', loadData)
    }
  }, [])

  if (!mounted) return null

  // KPI Calculations
  const totalLeads = leads.length
  const activeDeals = deals.filter(d => d.stageId !== 'stage-4' && d.stageId !== 'stage-5')
  const totalRevenue = deals.filter(d => d.stageId === 'stage-4').reduce((sum, d) => sum + d.value, 0)
  const tasksDue = tasks.filter(t => t.status === 'pending').length

  // Charts data
  const revenueData = [
    { date: 'Jan', value: 8000 },
    { date: 'Feb', value: 12000 },
    { date: 'Mar', value: 10500 },
    { date: 'Apr', value: 17000 },
    { date: 'May', value: 22000 },
    { date: 'Jun', value: totalRevenue || 12500 }
  ]

  const leadSourcesData = [
    { name: 'Website', value: leads.filter(l => l.source === 'website').length || 2 },
    { name: 'WhatsApp', value: leads.filter(l => l.source === 'whatsapp').length || 1 },
    { name: 'Referral', value: leads.filter(l => l.source === 'referral').length || 1 },
    { name: 'Manual', value: leads.filter(l => l.source === 'manual').length || 0 }
  ].filter(item => item.value > 0)

  const conversionFunnelData = [
    { stage: 'New', count: leads.filter(l => l.status === 'new').length + activeDeals.length },
    { stage: 'Contacted', count: leads.filter(l => l.status === 'contacted').length + activeDeals.length },
    { stage: 'Qualified', count: leads.filter(l => l.status === 'qualified').length },
    { stage: 'Won', count: deals.filter(d => d.stageId === 'stage-4').length }
  ]

  return (
    <div className="p-6 space-y-6 bg-gray-50/40 min-h-screen">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">CRM Dashboard</h1>
          <p className="text-sm text-gray-500">Real-time pipeline metrics and agent activity logs.</p>
        </div>
        <div className="flex gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse self-center" />
          <span className="text-xs text-gray-500 font-semibold self-center">Workspace Sync active</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <Card className="rounded-2xl border-gray-150 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Leads</CardTitle>
            <div className="rounded-lg bg-indigo-50 p-2 text-[#6366f1]">
              <Users size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-gray-900">{totalLeads}</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 font-medium">
              <TrendingUp size={12} />
              <span>+12.4% vs last week</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card className="rounded-2xl border-gray-150 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-gray-400">Active Deals</CardTitle>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <Briefcase size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-gray-900">{activeDeals.length}</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 font-medium">
              <TrendingUp size={12} />
              <span>+8.2% in active stages</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card className="rounded-2xl border-gray-150 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-gray-400">Revenue</CardTitle>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <DollarSign size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-gray-900">${totalRevenue.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 font-medium">
              <TrendingUp size={12} />
              <span>+18.5% MRR increase</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4 */}
        <Card className="rounded-2xl border-gray-150 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-gray-400">Tasks Due</CardTitle>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <CheckSquare size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-gray-900">{tasksDue}</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-amber-600 font-medium">
              <span>{tasks.filter(t => t.priority === 'urgent').length} urgent prioritize tasks</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trends */}
        <Card className="lg:col-span-2 rounded-2xl border-gray-150 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-gray-800">Revenue Growth Trend</CardTitle>
            <span className="text-xs text-gray-400 font-medium">Monthly closed value</span>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--brand-color, #6366f1)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--brand-color, #6366f1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} tickLine={false} />
                <YAxis 
                  stroke="#9ca3af" 
                  fontSize={11} 
                  tickLine={false} 
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip 
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid #e5e7eb', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    padding: '8px 12px'
                  }}
                />
                <Area type="monotone" dataKey="value" stroke="var(--brand-color, #6366f1)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* AI Insights & Alerts */}
        <Card className="rounded-2xl border-gray-150 shadow-sm flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <Sparkles size={16} className="text-[#6366f1] animate-spin-slow" />
              AI Assistant Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            <div className="rounded-xl border border-[#6366f1]/20 bg-[#6366f1]/5 p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand">Critical Recommendations</h4>
              <ul className="text-xs text-gray-700 space-y-2 list-disc pl-4">
                <li>Robert Chen requested custom API document pricing. High conversion probability (78%).</li>
                <li>WhatsApp unread message pending from Elena Rostova due for follow-up call.</li>
                <li>Salesforce scoping migration deal active. Closing rate predicted positive.</li>
              </ul>
            </div>
            <div className="rounded-xl border border-amber-200/80 bg-amber-50/40 p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700">Automation Alerts</h4>
              <p className="text-xs text-gray-600 mt-1">Webhook endpoint listener caught 1 database sync latency increase (230ms). Restored automatically.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Funnel & Pie Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <Card className="rounded-2xl border-gray-150 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-gray-800">Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversionFunnelData} layout="vertical" margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                <XAxis type="number" stroke="#9ca3af" fontSize={11} tickLine={false} />
                <YAxis dataKey="stage" type="category" stroke="#9ca3af" fontSize={11} tickLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="var(--brand-color, #6366f1)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Lead Distribution */}
        <Card className="rounded-2xl border-gray-150 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-gray-800">Lead Sources Split</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            {leadSourcesData.length === 0 ? (
              <p className="text-sm text-gray-400">No lead sources logged yet.</p>
            ) : (
              <div className="h-full w-full flex items-center justify-center gap-6">
                <div className="w-[50%] h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={leadSourcesData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {leadSourcesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-[40%] flex flex-col gap-2">
                  {leadSourcesData.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                      <span className="text-xs font-semibold text-gray-700">{item.name} ({item.value})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Logs Table / Checklist Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Timeline */}
        <Card className="lg:col-span-2 rounded-2xl border-gray-150 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-gray-800">Recent Communication Logs</CardTitle>
            <Activity size={16} className="text-gray-400" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative border-l border-gray-200 pl-4 ml-2 space-y-4">
              <div className="relative">
                <div className="absolute -left-[21px] mt-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-indigo-500 shadow-sm" />
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="text-xs font-bold text-gray-800">WhatsApp Inbound Message Received</p>
                    <p className="text-xs text-gray-500 mt-0.5">Elena Rostova: "Thanks! This looks fantastic. Can we setup a quick call tomorrow?"</p>
                  </div>
                  <span className="text-[10px] text-gray-400 font-semibold shrink-0">Today, 11:00 AM</span>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -left-[21px] mt-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-purple-500 shadow-sm" />
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="text-xs font-bold text-gray-800">Task Completed</p>
                    <p className="text-xs text-gray-500 mt-0.5">John Doe checked off "Schedule technical scoping session" for Museum Logistics.</p>
                  </div>
                  <span className="text-[10px] text-gray-400 font-semibold shrink-0">Today, 2:00 PM</span>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -left-[21px] mt-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500 shadow-sm" />
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="text-xs font-bold text-gray-800">Inbound Call Connected</p>
                    <p className="text-xs text-gray-500 mt-0.5">Connected with Marcus Brody for 5 mins 42 secs. AI outcome: Qualified.</p>
                  </div>
                  <span className="text-[10px] text-gray-400 font-semibold shrink-0">Yesterday, 4:00 PM</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Checklist */}
        <Card className="rounded-2xl border-gray-150 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-gray-800">Upcoming Follow-Ups</CardTitle>
            <CalendarDays size={16} className="text-gray-400" />
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks.filter(t => t.status === 'pending').slice(0, 3).map(t => (
              <div key={t.id} className="flex items-start justify-between border border-gray-100 rounded-xl p-3 bg-gray-50/30">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    className="mt-1 h-3.5 w-3.5 rounded border-gray-300 text-brand focus:ring-brand"
                    readOnly
                    checked={false}
                  />
                  <div>
                    <p className="text-xs font-bold text-gray-850">{t.title}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Due: {new Date(t.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                  t.priority === 'urgent' ? 'bg-red-50 text-red-600' :
                  t.priority === 'high' ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gray-500'
                }`}>
                  {t.priority}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
