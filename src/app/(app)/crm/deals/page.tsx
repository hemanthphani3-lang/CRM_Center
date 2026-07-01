'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Briefcase, DollarSign, Calendar, User, ArrowLeft, ArrowRight,
  Plus, Search, ChevronRight, X, AlertCircle, Sparkles
} from 'lucide-react'
import { db, Deal, Contact } from '@/lib/db'

interface KanbanStage {
  id: Deal['stageId']
  title: string
  color: string
}

const KANBAN_STAGES: KanbanStage[] = [
  { id: 'stage-1', title: 'New Lead', color: 'border-t-[#6366f1]' },
  { id: 'stage-2', title: 'Qualified', color: 'border-t-amber-500' },
  { id: 'stage-3', title: 'Proposal', color: 'border-t-blue-500' },
  { id: 'stage-4', title: 'Won', color: 'border-t-emerald-500' },
  { id: 'stage-5', title: 'Lost', color: 'border-t-rose-500' }
]

export default function DealsPage() {
  const [mounted, setMounted] = useState(false)
  const [deals, setDeals] = useState<Deal[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [search, setSearch] = useState('')

  // Create modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newVal, setNewVal] = useState(10000)
  const [selectedContactId, setSelectedContactId] = useState('')
  const [newCloseDate, setNewCloseDate] = useState('2026-08-01')
  const [newAssignee, setNewAssignee] = useState('Sarah Connor')

  useEffect(() => {
    setMounted(true)
    db.initialize()
    loadData()

    window.addEventListener('jesty_db_synced', loadData)
    return () => {
      window.removeEventListener('jesty_db_synced', loadData)
    }
  }, [])

  const loadData = () => {
    setDeals(db.getDeals())
    setContacts(db.getContacts())
  }

  // Stage transition triggers
  const moveDeal = (dealId: string, direction: 'forward' | 'backward') => {
    const updatedDeals = deals.map(d => {
      if (d.id === dealId) {
        const currentIndex = KANBAN_STAGES.findIndex(s => s.id === d.stageId)
        let nextIndex = currentIndex
        if (direction === 'forward') {
          nextIndex = Math.min(currentIndex + 1, KANBAN_STAGES.length - 1)
        } else {
          nextIndex = Math.max(currentIndex - 1, 0)
        }
        return {
          ...d,
          stageId: KANBAN_STAGES[nextIndex].id
        }
      }
      return d
    })
    db.saveDeals(updatedDeals)
    setDeals(updatedDeals)
  }

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const newDeal: Deal = {
      id: `dl-${Date.now()}`,
      title: newTitle,
      value: Number(newVal),
      stageId: 'stage-1',
      contactId: selectedContactId || undefined,
      closingDate: newCloseDate,
      assignedTo: newAssignee,
      createdAt: new Date().toISOString()
    }

    const currentDeals = db.getDeals()
    db.saveDeals([newDeal, ...currentDeals])
    loadData()
    setIsCreateOpen(false)

    // Reset fields
    setNewTitle('')
    setNewVal(10000)
    setSelectedContactId('')
    setNewCloseDate('2026-08-01')
    setNewAssignee('Sarah Connor')
  }

  const getContactInfo = (contactId?: string) => {
    if (!contactId) return null
    return contacts.find(c => c.id === contactId) || null
  }

  if (!mounted) return null

  // Search filtering
  const filteredDeals = search.trim()
    ? deals.filter(d => d.title.toLowerCase().includes(search.toLowerCase()))
    : deals

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50/50 p-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Deals Pipeline</h1>
          <p className="text-sm text-gray-500">Manage pipeline progress stages and contract value estimates.</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-brand-hover active:scale-98 transition-all"
        >
          <Plus size={16} />
          New Deal
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm mt-4 flex-shrink-0">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search deals title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden flex gap-4 mt-6 pb-6 select-none scrollbar-thin">
        {KANBAN_STAGES.map(stage => {
          const stageDeals = filteredDeals.filter(d => d.stageId === stage.id)
          const totalValue = stageDeals.reduce((sum, d) => sum + d.value, 0)

          return (
            <div
              key={stage.id}
              className="flex-1 min-w-[280px] bg-gray-50/50 rounded-2xl border border-gray-200 flex flex-col max-h-full overflow-hidden"
            >
              {/* Stage Header */}
              <div className={`p-4 border-b border-gray-150 bg-white flex justify-between items-center rounded-t-2xl border-t-4 ${stage.color}`}>
                <div>
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">{stage.title}</h3>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{stageDeals.length} Deals</p>
                </div>
                <span className="text-xs font-extrabold text-gray-900">${totalValue.toLocaleString()}</span>
              </div>

              {/* Deals List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
                <AnimatePresence>
                  {stageDeals.length === 0 ? (
                    <div className="text-center py-10 text-[11px] text-gray-400 italic">
                      Empty stage
                    </div>
                  ) : (
                    stageDeals.map(d => {
                      const c = getContactInfo(d.contactId)
                      return (
                        <motion.div
                          key={d.id}
                          layoutId={d.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="group relative flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-grab active:cursor-grabbing"
                        >
                          <div>
                            <h4 className="text-xs font-bold text-gray-800 line-clamp-2">{d.title}</h4>
                            {c && (
                              <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1 font-medium">
                                <Briefcase size={10} />
                                {c.company} — {c.name}
                              </p>
                            )}
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <span className="text-xs font-extrabold text-brand">${d.value.toLocaleString()}</span>
                            <div className="flex items-center gap-1 text-[10px] text-gray-400">
                              <Calendar size={10} />
                              <span>{d.closingDate}</span>
                            </div>
                          </div>

                          {/* Quick Controls overlay on hover */}
                          <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center">
                            <div className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold">
                              <User size={10} />
                              <span>{d.assignedTo.split(' ')[0]}</span>
                            </div>
                            <div className="flex gap-1.5 opacity-60 group-hover:opacity-100 transition-all">
                              <button
                                onClick={() => moveDeal(d.id, 'backward')}
                                className="rounded bg-gray-50 border border-gray-150 p-1 hover:bg-brand-light hover:text-brand hover:border-brand transition-all"
                                title="Move Stage Back"
                              >
                                <ArrowLeft size={10} />
                              </button>
                              <button
                                onClick={() => moveDeal(d.id, 'forward')}
                                className="rounded bg-gray-50 border border-gray-150 p-1 hover:bg-brand-light hover:text-brand hover:border-brand transition-all"
                                title="Move Stage Forward"
                              >
                                <ArrowRight size={10} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })
                  )}
                </AnimatePresence>
              </div>
            </div>
          )
        })}
      </div>

      {/* Create Modal Dialog */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateOpen(false)}
              className="fixed inset-0 bg-black/40"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl bg-white border border-gray-200 shadow-2xl p-6 pointer-events-auto"
            >
              <h2 className="text-lg font-bold text-gray-900">Add New Deal</h2>
              <form onSubmit={handleCreateDeal} className="mt-4 space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Deal Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme API Subscription Integration"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Estimated Value ($)</label>
                    <input
                      type="number"
                      value={newVal}
                      onChange={(e) => setNewVal(Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Linked Customer</label>
                    <select
                      value={selectedContactId}
                      onChange={(e) => setSelectedContactId(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none bg-white"
                    >
                      <option value="">None</option>
                      {contacts.map(c => (
                        <option key={c.id} value={c.id}>{c.company} — {c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Closing Date</label>
                    <input
                      type="date"
                      value={newCloseDate}
                      onChange={(e) => setNewCloseDate(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Assignee</label>
                    <select
                      value={newAssignee}
                      onChange={(e) => setNewAssignee(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none bg-white"
                    >
                      <option value="Sarah Connor">Sarah Connor</option>
                      <option value="John Doe">John Doe</option>
                      <option value="Jane Smith">Jane Smith</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand-hover active:scale-98 transition-all"
                  >
                    Create Deal
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
