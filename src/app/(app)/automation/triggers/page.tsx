'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Plus, Trash2, ShieldAlert, Check, ToggleLeft, ToggleRight, Sparkles, RefreshCw, Layers } from 'lucide-react'
import { db } from '@/lib/db'

interface TriggerConfig {
  id: string
  name: string
  event: string
  source: string
  workflowName: string
  status: 'active' | 'inactive'
  runs: number
  lastFired: string
}

export default function TriggersPage() {
  const [mounted, setMounted] = useState(false)
  const [triggers, setTriggers] = useState<TriggerConfig[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEvent, setNewEvent] = useState('Lead Created')
  const [newSource, setNewSource] = useState('Website Form')
  const [newWorkflow, setNewWorkflow] = useState('New Lead Auto-Response')

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('jesty_triggers')
    if (stored) {
      setTriggers(JSON.parse(stored))
    } else {
      const initial: TriggerConfig[] = [
        { id: 'tr-1', name: 'Web Form Lead Intake', event: 'Lead Created', source: 'Website API', workflowName: 'New Lead Auto-Response', status: 'active', runs: 124, lastFired: '2026-06-26T11:00:00Z' },
        { id: 'tr-2', name: 'Inbound WhatsApp Reply', event: 'WhatsApp Received', source: 'WhatsApp Sandbox', workflowName: 'Simulated AI Outbound Draft', status: 'active', runs: 45, lastFired: '2026-06-26T10:50:00Z' },
        { id: 'tr-3', name: 'Deal Scoping Alert', event: 'Deal Stage Updated', source: 'CRM Pipelines', workflowName: 'Create High Priority Scoping Task', status: 'inactive', runs: 12, lastFired: '2026-06-25T16:00:00Z' }
      ]
      localStorage.setItem('jesty_triggers', JSON.stringify(initial))
      setTriggers(initial)
    }
  }, [])

  const saveTriggers = (updated: TriggerConfig[]) => {
    localStorage.setItem('jesty_triggers', JSON.stringify(updated))
    setTriggers(updated)
  }

  if (!mounted) return null

  const handleToggle = (id: string) => {
    const next = triggers.map(t => {
      if (t.id === id) {
        return { ...t, status: t.status === 'active' ? ('inactive' as const) : ('active' as const) }
      }
      return t
    })
    saveTriggers(next)
  }

  const handleDelete = (id: string) => {
    const next = triggers.filter(t => t.id !== id)
    saveTriggers(next)
  }

  const handleAddTrigger = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return

    const newTr: TriggerConfig = {
      id: `tr-${Date.now()}`,
      name: newName,
      event: newEvent,
      source: newSource,
      workflowName: newWorkflow,
      status: 'active',
      runs: 0,
      lastFired: 'Never'
    }

    saveTriggers([...triggers, newTr])
    setIsAddOpen(false)
    setNewName('')
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 bg-gray-50/50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <Zap size={22} className="text-brand animate-pulse" />
            Event Triggers
          </h1>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            Configure external webhook and database events that trigger automated workflows.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-brand text-white px-4 py-2 text-xs font-bold hover:bg-brand-hover active:scale-98 transition-all shadow-md shadow-brand/10"
        >
          <Plus size={15} />
          Create Trigger
        </button>
      </div>

      {/* Grid List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {triggers.map(trigger => (
          <motion.div
            key={trigger.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-150 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-50 text-brand">
                  {trigger.event}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(trigger.id)}
                    className="text-gray-400 hover:text-brand transition-colors"
                  >
                    {trigger.status === 'active' ? (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-gray-450 bg-gray-100 px-2 py-0.5 rounded-md">
                        Paused
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(trigger.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <h3 className="text-sm font-bold text-gray-850 mt-3">{trigger.name}</h3>

              <div className="mt-4 space-y-2 border-t border-gray-100 pt-3">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-gray-400">Event Source</span>
                  <span className="text-gray-700">{trigger.source}</span>
                </div>
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-gray-400">Workflow Target</span>
                  <span className="text-gray-800 flex items-center gap-1">
                    <Layers size={10} className="text-brand" />
                    {trigger.workflowName}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-gray-400">Total Executions</span>
                  <span className="text-gray-700 font-bold">{trigger.runs}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center text-[10px] text-gray-400 font-semibold">
              <span>Last Fired</span>
              <span>{trigger.lastFired === 'Never' ? 'Never' : new Date(trigger.lastFired).toLocaleString()}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Trigger Dialog Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl bg-white border border-gray-200 shadow-2xl p-6 pointer-events-auto"
            >
              <h2 className="text-md font-bold text-gray-900 flex items-center gap-2">
                <Zap size={18} className="text-brand" />
                Add Event Trigger
              </h2>
              <form onSubmit={handleAddTrigger} className="mt-4 space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Trigger Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zapier Webhook Intake"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Event Type</label>
                  <select
                    value={newEvent}
                    onChange={(e) => setNewEvent(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none bg-white font-medium text-gray-700"
                  >
                    <option value="Lead Created">Lead Created</option>
                    <option value="Deal Stage Updated">Deal Stage Updated</option>
                    <option value="WhatsApp Received">WhatsApp Message Received</option>
                    <option value="Task Marked Completed">Task Marked Completed</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Source Platform</label>
                  <input
                    type="text"
                    required
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Target Workflow</label>
                  <select
                    value={newWorkflow}
                    onChange={(e) => setNewWorkflow(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none bg-white font-medium text-gray-700"
                  >
                    <option value="New Lead Auto-Response">New Lead Auto-Response</option>
                    <option value="Simulated AI Outbound Draft">Simulated AI Outbound Draft</option>
                    <option value="Create High Priority Scoping Task">Create High Priority Scoping Task</option>
                  </select>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold hover:bg-gray-50 transition-all text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand-hover active:scale-98 transition-all"
                  >
                    Create Trigger
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
