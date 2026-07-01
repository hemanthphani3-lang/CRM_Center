'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GitBranch, Plus, Trash2, Edit2, Sliders, ChevronDown, Check, Sparkles } from 'lucide-react'
import { db, Deal } from '@/lib/db'

interface Stage {
  id: string
  name: string
  color: string
}

const INITIAL_STAGES: Stage[] = [
  { id: 'stage-1', name: 'New Lead', color: '#6366f1' },
  { id: 'stage-2', name: 'Qualified', color: '#f59e0b' },
  { id: 'stage-3', name: 'Proposal', color: '#3b82f6' },
  { id: 'stage-4', name: 'Won', color: '#10b981' },
  { id: 'stage-5', name: 'Lost', color: '#ef4444' }
]

export default function PipelinesPage() {
  const [mounted, setMounted] = useState(false)
  const [stages, setStages] = useState<Stage[]>(INITIAL_STAGES)
  const [deals, setDeals] = useState<Deal[]>([])
  
  // Custom states
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editColor, setEditColor] = useState('#6366f1')

  useEffect(() => {
    setMounted(true)
    db.initialize()
    setDeals(db.getDeals())
  }, [])

  if (!mounted) return null

  const handleStartEdit = (s: Stage) => {
    setIsEditing(s.id)
    setEditName(s.name)
    setEditColor(s.color)
  }

  const handleSaveStage = (id: string) => {
    setStages(prev =>
      prev.map(s => (s.id === id ? { ...s, name: editName, color: editColor } : s))
    )
    setIsEditing(null)
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50/40 min-h-screen font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">CRM Pipelines</h1>
        <p className="text-sm text-gray-500">Configure deal funnel stages, color badges, and sequence orders.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stages list config panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Funnel Stages</h3>
            
            <div className="space-y-3">
              {stages.map((stage, idx) => {
                const stageDeals = deals.filter(d => d.stageId === stage.id)
                const isEditingThis = isEditing === stage.id

                return (
                  <div
                    key={stage.id}
                    className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border border-gray-150 rounded-xl p-4 bg-gray-50/30"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 font-bold select-none">#{idx + 1}</span>
                      <div className="h-4 w-4 rounded-full" style={{ backgroundColor: stage.color }} />
                      
                      {isEditingThis ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="rounded-lg border border-gray-200 px-2 py-1 text-xs focus:outline-none focus:border-brand font-semibold text-gray-800"
                        />
                      ) : (
                        <span className="text-xs font-bold text-gray-800">{stage.name}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 ml-6 sm:ml-0 justify-between">
                      <span className="text-[10px] font-semibold text-gray-400">{stageDeals.length} Deals Active</span>

                      <div className="flex items-center gap-2">
                        {isEditingThis ? (
                          <>
                            <input
                              type="color"
                              value={editColor}
                              onChange={(e) => setEditColor(e.target.value)}
                              className="h-6 w-6 rounded cursor-pointer border border-gray-200 bg-white"
                            />
                            <button
                              onClick={() => handleSaveStage(stage.id)}
                              className="rounded-lg bg-brand px-2 py-1 text-[10px] font-bold text-white hover:bg-brand-hover transition-all"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setIsEditing(null)}
                              className="rounded-lg border border-gray-200 px-2 py-1 text-[10px] font-semibold hover:bg-gray-100 transition-all text-gray-600"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleStartEdit(stage)}
                            className="rounded bg-gray-50 border border-gray-150 p-1.5 text-gray-500 hover:text-brand hover:border-brand transition-all"
                            title="Edit Stage"
                          >
                            <Edit2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Dynamic Pipeline Summary sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <GitBranch size={14} className="text-brand" />
              Pipeline Telemetry
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Default Pipeline</span>
                <span className="font-semibold text-gray-800">Primary Funnel</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Total Pipeline Value</span>
                <span className="font-bold text-brand">${deals.reduce((sum, d) => sum + d.value, 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-indigo-200 bg-indigo-50/30 p-4 flex gap-3">
            <Sparkles size={18} className="text-brand shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-brand uppercase tracking-wider">AI Optimizer</h4>
              <p className="text-[11px] text-gray-600 mt-1">Funnel drop-off is highest at stage **Proposal**. Consider injecting automated WhatsApp follow-up sequence triggers to boost conversion rates by up to 14%.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
