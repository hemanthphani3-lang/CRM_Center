'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Plus, Search, Edit2, Trash2, Globe, Send, X, Layers, Check } from 'lucide-react'
import { db } from '@/lib/db'

interface Template {
  id: string
  name: string
  channel: 'whatsapp' | 'email'
  subject?: string
  body: string
  variables: string[]
}

const INITIAL_TEMPLATES: Template[] = [
  { id: 'tmp-1', name: 'Contract Renewal Notice', channel: 'email', subject: 'CRM Subscription Renewal due soon', body: 'Hi {{contactName}},\n\nYour CRM subscription for {{companyName}} is due for renewal next month. We would love to schedule a scoping review call to discuss updates.\n\nBest regards,\nJesty Team', variables: ['contactName', 'companyName'] },
  { id: 'tmp-2', name: 'Outbound Welcome Scoping', channel: 'whatsapp', body: 'Hi {{contactName}}, thanks for reaching out to Jesty. Are you available for a brief scoping call tomorrow at 2 PM?', variables: ['contactName'] },
  { id: 'tmp-3', name: 'Leads Event Invitation', channel: 'email', subject: 'Jesty CRM Developer Keynote', body: 'Hello {{contactName}},\n\nWe are excited to invite you to the upcoming keynotes detailing AI Employees and triggering events in CRM.\n\nRegards,\nTeam Jesty', variables: ['contactName'] }
]

export default function TemplatesPage() {
  const [mounted, setMounted] = useState(false)
  const [templates, setTemplates] = useState<Template[]>(INITIAL_TEMPLATES)
  const [search, setSearch] = useState('')

  // Create Modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newChannel, setNewChannel] = useState<'whatsapp' | 'email'>('email')
  const [newSubject, setNewSubject] = useState('')
  const [newBody, setNewBody] = useState('')
  const [newVars, setNewVars] = useState('contactName, companyName')

  useEffect(() => {
    setMounted(true)
    db.initialize()
  }, [])

  if (!mounted) return null

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newBody.trim()) return

    const newTemplate: Template = {
      id: `tmp-${Date.now()}`,
      name: newTitle,
      channel: newChannel,
      subject: newChannel === 'email' ? newSubject : undefined,
      body: newBody,
      variables: newVars.split(',').map(v => v.trim()).filter(Boolean)
    }

    setTemplates([newTemplate, ...templates])
    setIsCreateOpen(false)

    // Reset fields
    setNewTitle('')
    setNewSubject('')
    setNewBody('')
    setNewVars('contactName')
  }

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id))
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50/40 min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Message Templates</h1>
          <p className="text-sm text-gray-500">Configure outbound layouts, variables, and default templates.</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-brand-hover active:scale-98 transition-all"
        >
          <Plus size={16} />
          Create Template
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search template name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.filter(t => t.name.toLowerCase().includes(search.toLowerCase())).map(t => (
          <div
            key={t.id}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition-all flex flex-col justify-between gap-4 group"
          >
            <div>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-brand-light p-2 text-brand">
                    <FileText size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-800">{t.name}</h3>
                    <p className="text-[9px] uppercase font-extrabold text-gray-400 tracking-wider mt-0.5">{t.channel}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteTemplate(t.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 rounded p-1.5 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {t.channel === 'email' && t.subject && (
                <div className="mt-3 text-xs bg-gray-50/50 px-3 py-1.5 rounded-lg border border-gray-150 font-semibold text-gray-700">
                  <span className="text-gray-400 font-medium">Subject:</span> {t.subject}
                </div>
              )}

              <p className="text-xs text-gray-500 mt-3 whitespace-pre-wrap leading-relaxed border-t border-gray-100 pt-3">
                {t.body}
              </p>
            </div>

            {/* Variables list */}
            <div className="flex flex-wrap gap-1 border-t border-gray-100 pt-3">
              {t.variables.map(v => (
                <span key={v} className="rounded bg-brand-light px-1.5 py-0.5 text-[9px] font-bold text-brand uppercase">{`{{${v}}}`}</span>
              ))}
            </div>
          </div>
        ))}
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
              <h2 className="text-lg font-bold text-gray-900">Create Template</h2>
              <form onSubmit={handleCreateTemplate} className="mt-4 space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Template Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Scoping Welcome Message"
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
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Insert Variables</label>
                    <input
                      type="text"
                      placeholder="contactName, companyName"
                      value={newVars}
                      onChange={(e) => setNewVars(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none"
                    />
                  </div>
                </div>

                {newChannel === 'email' && (
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Email Subject</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter subject header..."
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Template Body Content</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Use braces like {{contactName}} for dynamic fields..."
                    value={newBody}
                    onChange={(e) => setNewBody(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none font-mono"
                  />
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
                    Save Template
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
