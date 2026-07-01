'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileBarChart, Users2, Trophy, PhoneCall, MailCheck, ShieldCheck } from 'lucide-react'
import { db, TeamMember } from '@/lib/db'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'

interface RepPerformance {
  name: string
  wonAmount: number
  targetAmount: number
  calls: number
  emails: number
  meetings: number
}

export default function ReportsPage() {
  const [mounted, setMounted] = useState(false)
  const [teamPerformance, setTeamPerformance] = useState<RepPerformance[]>([])
  const [selectedRep, setSelectedRep] = useState<RepPerformance | null>(null)

  useEffect(() => {
    setMounted(true)
    db.initialize()
    
    // Create performance stats linked to our seed team members
    const team = db.getTeam()
    const performance: RepPerformance[] = team.map((member, idx) => {
      // Seed realistic data corresponding to names
      const performanceMap: Record<string, Omit<RepPerformance, 'name'>> = {
        'Sarah Connor': { wonAmount: 78000, targetAmount: 80000, calls: 240, emails: 410, meetings: 45 },
        'John Doe': { wonAmount: 64000, targetAmount: 60000, calls: 195, emails: 320, meetings: 38 },
        'Jane Smith': { wonAmount: 49000, targetAmount: 50000, calls: 280, emails: 520, meetings: 28 }
      }
      const data = performanceMap[member.fullName] || { wonAmount: 30000, targetAmount: 40000, calls: 120, emails: 200, meetings: 15 }
      return {
        name: member.fullName,
        ...data
      }
    })

    setTeamPerformance(performance)
    if (performance.length > 0) {
      setSelectedRep(performance[0])
    }
  }, [])

  if (!mounted) return null

  // Radar chart data for selected rep
  const repRadarData = selectedRep ? [
    { metric: 'Calls Done', score: (selectedRep.calls / 300) * 100 },
    { metric: 'Emails Dispatched', score: (selectedRep.emails / 600) * 100 },
    { metric: 'Meetings Booked', score: (selectedRep.meetings / 50) * 100 },
    { metric: 'Deals Closed Won', score: (selectedRep.wonAmount / selectedRep.targetAmount) * 100 }
  ] : []

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 bg-gray-50/50 min-h-screen font-sans">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <FileBarChart size={22} className="text-brand" />
          Reps Performance Reports
        </h1>
        <p className="text-xs text-gray-500 font-semibold mt-1">
          Review sales outcomes, activity counts, and quota achievement leaderboards per team member.
        </p>
      </div>

      {/* Quota Leaderboard Chart */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-150 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-450">Quota Achievement Leaderboard</h3>
            <Trophy size={16} className="text-amber-500 animate-bounce" />
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamPerformance} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} style={{ fontSize: 11, fontWeight: 700, fill: '#374151' }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: 10, fill: '#9ca3af' }} />
                <Tooltip
                  formatter={(value: any) => [`$${value.toLocaleString()}`, 'Amount']}
                  contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12 }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 10, fontWeight: 600 }} />
                <Bar dataKey="wonAmount" fill="var(--brand-color, #7c3aed)" radius={[4, 4, 0, 0]} name="Won Deals Value" />
                <Bar dataKey="targetAmount" fill="#e5e7eb" radius={[4, 4, 0, 0]} name="Quota Target" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rep breakdown activities */}
        <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-450">Activity Index</h3>
            <select
              value={selectedRep?.name || ''}
              onChange={(e) => setSelectedRep(teamPerformance.find(p => p.name === e.target.value) || null)}
              className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none"
            >
              {teamPerformance.map(p => (
                <option key={p.name} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>

          {selectedRep && (
            <div className="flex-1 flex flex-col justify-center space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <PhoneCall size={14} className="text-indigo-500 mx-auto mb-1.5" />
                  <span className="block text-[10px] text-gray-400 font-bold uppercase">Calls</span>
                  <span className="text-sm font-black text-gray-800">{selectedRep.calls}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <MailCheck size={14} className="text-emerald-500 mx-auto mb-1.5" />
                  <span className="block text-[10px] text-gray-400 font-bold uppercase">Emails</span>
                  <span className="text-sm font-black text-gray-800">{selectedRep.emails}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <Users2 size={14} className="text-purple-500 mx-auto mb-1.5" />
                  <span className="block text-[10px] text-gray-400 font-bold uppercase">Meetings</span>
                  <span className="text-sm font-black text-gray-800">{selectedRep.meetings}</span>
                </div>
              </div>

              {/* Radar chart breakdown of rep metrics */}
              <div className="h-44 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={repRadarData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="metric" style={{ fontSize: 9, fontWeight: 700, fill: '#6b7280' }} />
                    <Radar name={selectedRep.name} dataKey="score" stroke="var(--brand-color, #7c3aed)" fill="var(--brand-color, #7c3aed)" fillOpacity={0.15} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid summary table */}
      <div className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-wider border-b border-gray-150">
              <th className="p-4">Representative</th>
              <th className="p-4">Deals Won</th>
              <th className="p-4">Quota Target</th>
              <th className="p-4">Achievement %</th>
              <th className="p-4">Calls Made</th>
              <th className="p-4">Emails Sent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-700">
            {teamPerformance.map(p => {
              const achievementsPct = ((p.wonAmount / p.targetAmount) * 100).toFixed(1)
              return (
                <tr key={p.name} className="hover:bg-gray-50/50">
                  <td className="p-4 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-brand-light text-brand flex items-center justify-center font-bold text-[10px] uppercase">
                      {p.name.charAt(0)}
                    </span>
                    <span className="font-bold text-gray-800">{p.name}</span>
                  </td>
                  <td className="p-4">${p.wonAmount.toLocaleString()}</td>
                  <td className="p-4">${p.targetAmount.toLocaleString()}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                        parseFloat(achievementsPct) >= 100
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-indigo-50 text-brand'
                      }`}>
                        {achievementsPct}%
                      </span>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-gray-500">{p.calls}</td>
                  <td className="p-4 font-medium text-gray-500">{p.emails}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
