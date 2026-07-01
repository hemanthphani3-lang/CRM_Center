'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar, CalendarDays, Plus, Clock, Briefcase, CheckSquare, X } from 'lucide-react'
import { db, Task, Deal } from '@/lib/db'

// Days of the week header
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Days in June 2026 (Starts on a Monday, 30 days)
const JUNE_2026_DAYS = Array.from({ length: 30 }, (_, i) => i + 1)
const JUNE_START_OFFSET = 1 // Monday start offset (0: Sun, 1: Mon, etc.)

export default function CalendarPage() {
  const [mounted, setMounted] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  useEffect(() => {
    setMounted(true)
    db.initialize()
    setTasks(db.getTasks())
    setDeals(db.getDeals())
  }, [])

  if (!mounted) return null

  const getEventsForDay = (day: number) => {
    // We assume the year is 2026 and month is June (06)
    const dateStr = `2026-06-${day.toString().padStart(2, '0')}`
    const dayTasks = tasks.filter(t => t.dueDate && t.dueDate.startsWith(dateStr))
    const dayDeals = deals.filter(d => d.closingDate && d.closingDate.startsWith(dateStr))
    return { tasks: dayTasks, deals: dayDeals }
  }

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-50/40 p-6 font-sans gap-6">
      {/* Calendar Grid Section */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        {/* Calendar Header */}
        <div className="p-4 border-b border-gray-150 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-brand-light p-2 text-brand">
              <Calendar size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-800">June 2026</h2>
              <p className="text-[10px] text-gray-400 font-semibold">Workspace Schedule View</p>
            </div>
          </div>

          <div className="flex border border-gray-200 rounded-lg overflow-hidden text-xs text-gray-500 font-semibold">
            <button className="px-3 py-1.5 hover:bg-gray-50 flex items-center gap-1 border-r border-gray-200">
              <ChevronLeft size={14} />
              Prev
            </button>
            <button className="px-3 py-1.5 bg-gray-50 font-bold border-r border-gray-200">Today</button>
            <button className="px-3 py-1.5 hover:bg-gray-50 flex items-center gap-1">
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50 text-center py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
          {DAYS_OF_WEEK.map(d => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Grid cells */}
        <div className="flex-1 grid grid-cols-7 grid-rows-5 divide-x divide-y divide-gray-100">
          {/* Empty cells for offset */}
          {Array.from({ length: JUNE_START_OFFSET }).map((_, idx) => (
            <div key={`offset-${idx}`} className="bg-gray-50/20" />
          ))}

          {/* Days cells */}
          {JUNE_2026_DAYS.map(day => {
            const { tasks: dayTasks, deals: dayDeals } = getEventsForDay(day)
            const hasEvents = dayTasks.length > 0 || dayDeals.length > 0

            return (
              <div
                key={day}
                onClick={() => {
                  if (hasEvents) {
                    setSelectedDay(day)
                  }
                }}
                className={`p-2 flex flex-col justify-between hover:bg-brand-light/30 transition-all cursor-pointer min-h-[80px] group ${
                  hasEvents ? 'bg-indigo-50/10' : ''
                }`}
              >
                <span className="text-xs font-bold text-gray-500 group-hover:text-brand transition-colors">{day}</span>

                {/* Event indicators */}
                <div className="mt-1 space-y-1 overflow-hidden">
                  {dayTasks.slice(0, 2).map(t => (
                    <div
                      key={t.id}
                      className={`text-[9px] font-semibold px-1 py-0.5 rounded truncate ${
                        t.status === 'completed'
                          ? 'bg-gray-100 text-gray-400 line-through'
                          : t.priority === 'urgent'
                          ? 'bg-red-50 text-red-600 border border-red-150'
                          : 'bg-indigo-50 text-[#6366f1] border border-indigo-150'
                      }`}
                    >
                      {t.title}
                    </div>
                  ))}
                  {dayDeals.slice(0, 1).map(d => (
                    <div
                      key={d.id}
                      className="text-[9px] font-semibold px-1 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-150 truncate"
                    >
                      Deal: ${d.value.toLocaleString()}
                    </div>
                  ))}
                  {(dayTasks.length + dayDeals.length) > 3 && (
                    <div className="text-[8px] font-bold text-gray-400 text-center">
                      +{(dayTasks.length + dayDeals.length) - 3} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Sidebar agenda section */}
      <div className="w-full md:w-80 bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col justify-between flex-shrink-0">
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Monthly Agenda</h3>
          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {tasks.filter(t => t.status === 'pending').map(t => (
              <div key={t.id} className="flex gap-2.5 items-start border border-gray-100 rounded-xl p-3 bg-gray-50/40">
                <CheckSquare size={14} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{t.title}</h4>
                  <p className="text-[10px] text-gray-450 mt-1 flex items-center gap-1">
                    <Clock size={10} />
                    {new Date(t.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-brand-light bg-brand-light p-4 mt-6">
          <h4 className="text-xs font-bold text-brand uppercase tracking-wider">AI Scheduler</h4>
          <p className="text-xs text-gray-600 mt-1.5">No schedule overlaps detected. 1 critical scoping task due tomorrow requires follow-up call validation.</p>
        </div>
      </div>

      {/* Day Events Dialog Modal */}
      <AnimatePresence>
        {selectedDay !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDay(null)}
              className="fixed inset-0 bg-black/40"
            />
            {/* Content card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm rounded-2xl bg-white border border-gray-200 shadow-2xl p-6 pointer-events-auto"
            >
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-850">Events for June {selectedDay}, 2026</h3>
                <button onClick={() => setSelectedDay(null)} className="rounded-lg p-1 hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-all">
                  <X size={16} />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {(() => {
                  const { tasks: tList, deals: dList } = getEventsForDay(selectedDay)
                  return (
                    <>
                      {tList.map(t => (
                        <div key={t.id} className="flex gap-2 items-start border border-gray-100 p-3 rounded-xl bg-gray-50/20">
                          <CheckSquare size={14} className="text-[#6366f1] mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-gray-850">{t.title}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">{t.description}</p>
                            <span className="inline-block mt-2 text-[9px] font-extrabold uppercase px-1.5 py-0.5 bg-indigo-50 text-[#6366f1] rounded-md">{t.priority}</span>
                          </div>
                        </div>
                      ))}
                      {dList.map(d => (
                        <div key={d.id} className="flex gap-2 items-start border border-gray-100 p-3 rounded-xl bg-gray-50/20">
                          <Briefcase size={14} className="text-emerald-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-gray-850">{d.title}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">Closing Date: {d.closingDate}</p>
                            <span className="inline-block mt-2 text-[9px] font-extrabold uppercase px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-md">${d.value.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </>
                  )
                })()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
