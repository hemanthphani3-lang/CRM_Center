'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Plus, Filter, Tag, User, Briefcase, Phone, Mail,
  X, Calendar, ChevronRight, MessageSquare, Trash2, ArrowUpRight
} from 'lucide-react'
import { db, Lead, Contact } from '@/lib/db'

export default function LeadsPage() {
  const [mounted, setMounted] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  // Filters state
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sourceFilter, setSourceFilter] = useState<string>('all')

  // Create Modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newCompany, setNewCompany] = useState('')
  const [newVal, setNewVal] = useState(5000)
  const [newStatus, setNewStatus] = useState<Lead['status']>('new')
  const [newSource, setNewSource] = useState<Lead['source']>('website')
  const [newAssignee, setNewAssignee] = useState('Sarah Connor')
  const [newNotes, setNewNotes] = useState('')
  const [newTagsString, setNewTagsString] = useState('Enterprise')

  // Detail panel notes input
  const [noteInput, setNoteInput] = useState('')

  useEffect(() => {
    setMounted(true)
    db.initialize()
    loadLeads()

    window.addEventListener('jesty_db_synced', loadLeads)
    return () => {
      window.removeEventListener('jesty_db_synced', loadLeads)
    }
  }, [])

  const loadLeads = () => {
    const data = db.getLeads()
    setLeads(data)
  }

  // Filter computation
  useEffect(() => {
    let result = leads
    if (search.trim()) {
      const lower = search.toLowerCase()
      result = result.filter(l =>
        l.name.toLowerCase().includes(lower) ||
        l.company.toLowerCase().includes(lower) ||
        l.email.toLowerCase().includes(lower)
      )
    }
    if (statusFilter !== 'all') {
      result = result.filter(l => l.status === statusFilter)
    }
    if (sourceFilter !== 'all') {
      result = result.filter(l => l.source === sourceFilter)
    }
    setFilteredLeads(result)
  }, [leads, search, statusFilter, sourceFilter])

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return

    const newLead: Lead = {
      id: `ld-${Date.now()}`,
      name: newName,
      email: newEmail,
      phone: newPhone,
      company: newCompany || 'Independent',
      status: newStatus,
      source: newSource,
      value: Number(newVal),
      assignedTo: newAssignee,
      tags: newTagsString.split(',').map(t => t.trim()).filter(Boolean),
      notes: newNotes,
      createdAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString()
    }

    const currentLeads = db.getLeads()
    db.saveLeads([newLead, ...currentLeads])

    // Create a corresponding Contact record automatically
    const currentContacts = db.getContacts()
    const newContact: Contact = {
      id: `ct-${Date.now()}`,
      name: newName,
      email: newEmail,
      phone: newPhone,
      company: newCompany || 'Independent',
      role: 'Prospect',
      tags: newTagsString.split(',').map(t => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString()
    }
    db.saveContacts([newContact, ...currentContacts])

    // Create corresponding Deal record automatically
    const currentDeals = db.getDeals()
    const newDeal = {
      id: `dl-${Date.now()}`,
      title: `${newCompany || newName} CRM Partnership`,
      value: Number(newVal),
      stageId: 'stage-1' as const,
      contactId: newContact.id,
      leadId: newLead.id,
      closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      assignedTo: newAssignee,
      createdAt: new Date().toISOString()
    }
    db.saveDeals([newDeal, ...currentDeals])

    // Create corresponding Activity record
    const newActivity = {
      id: `act-${Date.now()}`,
      type: 'lead_created',
      actor_id: 'usr-1',
      linked_type: 'lead',
      linked_id: newLead.id,
      data: { name: newName, value: newVal },
      created_at: new Date().toISOString()
    }
    // Also simulate creating an Activity entry in localStorage db
    const rawActivities = localStorage.getItem('jesty_activities') || '[]'
    const parsedActivities = JSON.parse(rawActivities)
    localStorage.setItem('jesty_activities', JSON.stringify([newActivity, ...parsedActivities]))

    loadLeads()
    setIsCreateOpen(false)

    // Reset inputs
    setNewName('')
    setNewEmail('')
    setNewPhone('')
    setNewCompany('')
    setNewVal(5000)
    setNewStatus('new')
    setNewSource('website')
    setNewNotes('')
    setNewTagsString('Enterprise')
  }

  const handleUpdateLeadStatus = (id: string, status: Lead['status']) => {
    const updated = leads.map(l => {
      if (l.id === id) {
        const next = { ...l, status, lastActivityAt: new Date().toISOString() }
        if (selectedLead && selectedLead.id === id) {
          setSelectedLead(next)
        }
        return next
      }
      return l
    })
    db.saveLeads(updated)
    setLeads(updated)
  }

  const handleDeleteLead = (id: string) => {
    const filtered = leads.filter(l => l.id !== id)
    db.saveLeads(filtered)
    setLeads(filtered)
    setSelectedLead(null)
  }

  const handleAddNote = () => {
    if (!selectedLead || !noteInput.trim()) return
    const updated = leads.map(l => {
      if (l.id === selectedLead.id) {
        const divider = l.notes ? '\n' : ''
        const next = {
          ...l,
          notes: `${l.notes}${divider}[${new Date().toLocaleDateString()}]: ${noteInput}`,
          lastActivityAt: new Date().toISOString()
        }
        setSelectedLead(next)
        return next
      }
      return l
    })
    db.saveLeads(updated)
    setLeads(updated)
    setNoteInput('')
  }

  if (!mounted) return null

  return (
    <div className="flex h-screen bg-gray-50/50 overflow-hidden font-sans">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden p-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">CRM Leads</h1>
            <p className="text-sm text-gray-500">Track pipeline prospects, follow-up status, and tags.</p>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-brand-hover active:scale-98 transition-all"
          >
            <Plus size={16} />
            Add Lead
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
          {/* Search bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads name, company, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none transition-colors"
            />
          </div>

          <div className="flex gap-2">
            {/* Status Selector */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none bg-white font-medium text-gray-700"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="unqualified">Unqualified</option>
              <option value="converted">Converted</option>
            </select>

            {/* Source Selector */}
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none bg-white font-medium text-gray-700"
            >
              <option value="all">All Sources</option>
              <option value="website">Website</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="referral">Referral</option>
              <option value="manual">Manual</option>
            </select>
          </div>
        </div>

        {/* Leads Table Container */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-150 bg-gray-50/50 text-xs font-bold uppercase tracking-wider text-gray-400">
                  <th className="px-6 py-4">Name / Company</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Est. Value</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Source</th>
                  <th className="px-6 py-4">Assignee</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 text-sm text-gray-700">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                      No leads match your search criteria. Try a different filter setup.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map(l => (
                    <tr
                      key={l.id}
                      onClick={() => setSelectedLead(l)}
                      className={`hover:bg-gray-50/80 cursor-pointer transition-colors ${
                        selectedLead?.id === l.id ? 'bg-brand-light' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-800">{l.name}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <Briefcase size={12} />
                          {l.company}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Mail size={12} />
                          <span>{l.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                          <Phone size={12} />
                          <span>{l.phone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-850">
                        ${l.value.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          l.status === 'new' ? 'bg-indigo-50 text-[#6366f1]' :
                          l.status === 'contacted' ? 'bg-amber-50 text-amber-600' :
                          l.status === 'qualified' ? 'bg-emerald-50 text-emerald-600' :
                          l.status === 'converted' ? 'bg-teal-50 text-teal-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {l.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold capitalize text-gray-500">{l.source}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs">
                          <div className="h-6 w-6 rounded-full bg-brand-light text-brand font-bold flex items-center justify-center text-[10px]">
                            {l.assignedTo.charAt(0)}
                          </div>
                          <span className="font-semibold text-gray-700">{l.assignedTo}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ChevronRight size={16} className="text-gray-400 inline-block" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Details Side Panel Drawer */}
      <AnimatePresence>
        {selectedLead && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 400, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full bg-white border-l border-gray-200 shadow-xl overflow-hidden flex flex-col flex-shrink-0"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-brand-light text-brand font-extrabold flex items-center justify-center">
                  {selectedLead.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{selectedLead.name}</h3>
                  <p className="text-xs text-gray-400">{selectedLead.company}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="rounded-lg p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable contents */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Actions row */}
              <div className="flex gap-2">
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleUpdateLeadStatus(selectedLead.id, e.target.value as Lead['status'])}
                  className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold focus:border-brand focus:outline-none bg-white text-gray-700 shadow-sm"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="unqualified">Unqualified</option>
                  <option value="converted">Converted</option>
                </select>
                <button
                  onClick={() => handleDeleteLead(selectedLead.id)}
                  className="rounded-xl border border-red-150 p-2 text-red-500 hover:bg-red-50 transition-all shadow-sm"
                  title="Delete Lead"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Profile Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Contact Details</h4>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5 text-xs text-gray-700">
                    <Mail size={14} className="text-gray-400" />
                    <span>{selectedLead.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-gray-700">
                    <Phone size={14} className="text-gray-400" />
                    <span>{selectedLead.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-gray-700">
                    <Tag size={14} className="text-gray-400" />
                    <div className="flex gap-1 flex-wrap">
                      {selectedLead.tags.map(t => (
                        <span key={t} className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* CRM Telemetry */}
              <div className="rounded-xl border border-gray-150 bg-gray-50/50 p-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Estimate Value</span>
                  <span className="font-bold text-gray-800">${selectedLead.value.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Assigned Representative</span>
                  <span className="font-semibold text-gray-700">{selectedLead.assignedTo}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Lead Source</span>
                  <span className="capitalize font-semibold text-brand">{selectedLead.source}</span>
                </div>
              </div>

              {/* Notes Timeline */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Activity Timeline & Notes</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add progress note..."
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none"
                  />
                  <button
                    onClick={handleAddNote}
                    className="rounded-xl bg-brand px-3 py-2 text-xs font-semibold text-white hover:bg-brand-hover active:scale-98 transition-all"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-3 pl-2 border-l border-gray-100">
                  {selectedLead.notes ? (
                    selectedLead.notes.split('\n').map((n, i) => (
                      <div key={i} className="relative">
                        <div className="absolute -left-[13px] top-1.5 h-2 w-2 rounded-full bg-brand" />
                        <p className="text-xs text-gray-700">{n}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 italic">No notes logged for this prospect.</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Modal Dialog */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateOpen(false)}
              className="fixed inset-0 bg-black/40"
            />

            {/* Form Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl bg-white border border-gray-200 shadow-2xl p-6 overflow-hidden pointer-events-auto"
            >
              <h2 className="text-lg font-bold text-gray-900">Add New CRM Lead</h2>
              <p className="text-xs text-gray-500">Create a new lead to automatically initialize matching Contacts and Deals records.</p>

              <form onSubmit={handleCreateLead} className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Prospect Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tony Stark"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Company</label>
                    <input
                      type="text"
                      placeholder="Stark Industries"
                      value={newCompany}
                      onChange={(e) => setNewCompany(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Email Address</label>
                    <input
                      type="email"
                      placeholder="tony@stark.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Phone Number</label>
                    <input
                      type="text"
                      placeholder="+1 (555) 000-0000"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none"
                    />
                  </div>
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

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Initial Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as Lead['status'])}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none bg-white animate-in"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Lead Source</label>
                    <select
                      value={newSource}
                      onChange={(e) => setNewSource(e.target.value as Lead['source'])}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none bg-white"
                    >
                      <option value="website">Website</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="referral">Referral</option>
                      <option value="manual">Manual</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="Enterprise, High-Value, Stark"
                    value={newTagsString}
                    onChange={(e) => setNewTagsString(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Internal Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Enter scoping requirements..."
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none"
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
                    Save Lead
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
