'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Megaphone, Plus, Search, Eye, Users, FileText, Play, ChevronRight, X, Sparkles } from 'lucide-react'
import { db } from '@/lib/db'

interface Campaign {
  id: string
  name: string
  channel: 'whatsapp' | 'email'
  templateName: string
  status: 'draft' | 'scheduled' | 'sending' | 'sent'
  recipientCount: number
  deliveredCount: number
  openedCount: number
  repliedCount: number
  sentAt?: string
}

const INITIAL_CAMPAIGNS: Campaign[] = [
  { id: 'cam-1', name: 'IT Leads Outbound Broadcast', channel: 'whatsapp', templateName: 'Outbound Welcome Scoping', status: 'sent', recipientCount: 45, deliveredCount: 43, openedCount: 38, repliedCount: 22, sentAt: '2026-06-25T14:00:00Z' },
  { id: 'cam-2', name: 'Stark Industries Scoping Blast', channel: 'email', templateName: 'Contract Renewal Notice', status: 'draft', recipientCount: 120, deliveredCount: 0, openedCount: 0, repliedCount: 0 }
]

export default function CampaignsPage() {
  const [mounted, setMounted] = useState(false)
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS)
  const [search, setSearch] = useState('')

  // Create Modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newChannel, setNewChannel] = useState<'whatsapp' | 'email'>('email')
  const [newTemplate, setNewTemplate] = useState('Contract Renewal Notice')
  const [newRecipients, setNewRecipients] = useState(60)

  useEffect(() => {
    setMounted(true)
    db.initialize()
  }, [])

  if (!mounted) return null

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const newCam: Campaign = {
      id: `cam-${Date.now()}`,
      name: newTitle,
      channel: newChannel,
      templateName: newTemplate,
      status: 'draft',
      recipientCount: Number(newRecipients),
      deliveredCount: 0,
      openedCount: 0,
      repliedCount: 0
    }

    setCampaigns([newCam, ...campaigns])
    setIsCreateOpen(false)

    // Reset inputs
    setNewTitle('')
    setNewRecipients(60)
  }

  const handleTriggerCampaign = (id: string) => {
    setCampaigns(prev =>
      prev.map(c => {
        if (c.id === id) {
          return {
            ...c,
            status: 'sent',
            deliveredCount: Math.floor(c.recipientCount * 0.95),
            openedCount: Math.floor(c.recipientCount * 0.8),
            repliedCount: Math.floor(c.recipientCount * 0.4),
            sentAt: new Date().toISOString()
          }
        }
        return c
      })
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50/40 min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Broadcast Campaigns</h1>
          <p className="text-sm text-gray-500">Configure template broadcasts, target leads list, and track conversion rates.</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-brand-hover active:scale-98 transition-all"
        >
          <Plus size={16} />
          Create Campaign
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search campaigns name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 gap-4">
        {campaigns.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map(c => {
          const isDraft = c.status === 'draft'

          return (
            <div
              key={c.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between md:items-center gap-6"
            >
              {/* Left Title & Status details */}
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-brand-light p-3 text-brand">
                  <Megaphone size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">{c.name}</h3>
                  <div className="flex flex-wrap items-center gap-2.5 mt-1 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                    <span>{c.channel}</span>
                    <span>•</span>
                    <span>Template: {c.templateName}</span>
                    {c.sentAt && (
                      <>
                        <span>•</span>
                        <span>Sent: {new Date(c.sentAt).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Center Metrics (if sent) */}
              {!isDraft && (
                <div className="grid grid-cols-4 gap-4 bg-gray-50/50 rounded-xl px-4 py-2.5 border border-gray-100 flex-1 max-w-sm text-center">
                  <div>
                    <p className="text-[10px] font-bold text-gray-450 uppercase">Targets</p>
                    <p className="text-xs font-extrabold text-gray-800 mt-0.5">{c.recipientCount}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-450 uppercase">Deliv</p>
                    <p className="text-xs font-extrabold text-gray-800 mt-0.5">{c.deliveredCount}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-450 uppercase">Open</p>
                    <p className="text-xs font-extrabold text-brand mt-0.5">{c.openedCount}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-450 uppercase">Reply</p>
                    <p className="text-xs font-extrabold text-emerald-600 mt-0.5">{c.repliedCount}</p>
                  </div>
                </div>
              )}

              {/* Right Trigger Controls */}
              <div className="flex gap-2 justify-end">
                {isDraft ? (
                  <button
                    onClick={() => handleTriggerCampaign(c.id)}
                    className="flex items-center gap-1.5 rounded-xl bg-brand px-3 py-2 text-xs font-semibold text-white hover:bg-brand-hover active:scale-98 transition-all shadow-sm"
                  >
                    <Play size={12} />
                    Trigger Launch
                  </button>
                ) : (
                  <span className="rounded-xl bg-emerald-50 text-emerald-600 px-3 py-2 text-xs font-semibold select-none">
                    Broadcast Sent
                  </span>
                )}
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
              <h2 className="text-lg font-bold text-gray-900">Configure Broadcast Campaign</h2>
              <form onSubmit={handleCreateCampaign} className="mt-4 space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Campaign Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. June IT Leads Broadcast"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Channel Type</label>
                    <select
                      value={newChannel}
                      onChange={(e) => setNewChannel(e.target.value as any)}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none bg-white font-medium"
                    >
                      <option value="email">Email</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Recipients Count</label>
                    <input
                      type="number"
                      value={newRecipients}
                      onChange={(e) => setNewRecipients(Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Select Template layout</label>
                  <select
                    value={newTemplate}
                    onChange={(e) => setNewTemplate(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none bg-white"
                  >
                    <option value="Contract Renewal Notice">Contract Renewal Notice</option>
                    <option value="Outbound Welcome Scoping">Outbound Welcome Scoping</option>
                  </select>
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
                    Save Campaign
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
