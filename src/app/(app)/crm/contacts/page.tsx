'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, Mail, Phone, Briefcase, Tag, X, UserCheck, MessageSquare } from 'lucide-react'
import { db, Contact } from '@/lib/db'

export default function ContactsPage() {
  const [mounted, setMounted] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([])
  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState('all')

  // Create Modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newCompany, setNewCompany] = useState('')
  const [newRole, setNewRole] = useState('')
  const [newTagsString, setNewTagsString] = useState('')

  useEffect(() => {
    setMounted(true)
    db.initialize()
    loadContacts()

    window.addEventListener('jesty_db_synced', loadContacts)
    return () => {
      window.removeEventListener('jesty_db_synced', loadContacts)
    }
  }, [])

  const loadContacts = () => {
    setContacts(db.getContacts())
  }

  // Filter computation
  useEffect(() => {
    let result = contacts
    if (search.trim()) {
      const lower = search.toLowerCase()
      result = result.filter(c =>
        c.name.toLowerCase().includes(lower) ||
        c.company.toLowerCase().includes(lower) ||
        (c.email && c.email.toLowerCase().includes(lower))
      )
    }
    if (tagFilter !== 'all') {
      result = result.filter(c => c.tags.includes(tagFilter))
    }
    setFilteredContacts(result)
  }, [contacts, search, tagFilter])

  // Get all unique tags
  const allTags = Array.from(new Set(contacts.flatMap(c => c.tags)))

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return

    const newContact: Contact = {
      id: `ct-${Date.now()}`,
      name: newName,
      email: newEmail,
      phone: newPhone,
      company: newCompany || 'Independent',
      role: newRole || 'IT Lead',
      tags: newTagsString.split(',').map(t => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString()
    }

    const currentContacts = db.getContacts()
    db.saveContacts([newContact, ...currentContacts])
    loadContacts()
    setIsCreateOpen(false)

    // Reset inputs
    setNewName('')
    setNewEmail('')
    setNewPhone('')
    setNewCompany('')
    setNewRole('')
    setNewTagsString('')
  }

  const handleDeleteContact = (id: string) => {
    const updated = contacts.filter(c => c.id !== id)
    db.saveContacts(updated)
    setContacts(updated)
  }

  if (!mounted) return null

  return (
    <div className="p-6 space-y-6 bg-gray-50/40 min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">CRM Contacts</h1>
          <p className="text-sm text-gray-500">Manage customer accounts, roles, and profiles.</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-brand-hover active:scale-98 transition-all"
        >
          <Plus size={16} />
          Add Contact
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search contacts name, company, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none transition-colors"
          />
        </div>
        <select
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none bg-white font-medium text-gray-700"
        >
          <option value="all">All Tags</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>

      {/* Grid List of Contacts */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredContacts.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-400">
            No contacts match your filters.
          </div>
        ) : (
          filteredContacts.map(c => (
            <div
              key={c.id}
              className="relative flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition-all group"
            >
              {/* Profile Top */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {c.avatarUrl ? (
                    <img src={c.avatarUrl} alt={c.name} className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-brand-light text-brand font-extrabold flex items-center justify-center">
                      {c.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-brand transition-colors">{c.name}</h3>
                    <p className="text-[11px] font-medium text-gray-400">{c.role || 'IT Lead'}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteContact(c.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 rounded p-1 transition-all"
                  title="Remove Contact"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Company Info */}
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-600">
                <Briefcase size={13} className="text-gray-400" />
                <span>{c.company}</span>
              </div>

              {/* Email & Phone */}
              <div className="mt-2 space-y-1.5 text-xs text-gray-500">
                {c.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="text-gray-400" />
                    <span>{c.email}</span>
                  </div>
                )}
                {c.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-gray-400" />
                    <span>{c.phone}</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-1.5 border-t border-gray-100 pt-3">
                {c.tags.map(t => (
                  <span key={t} className="rounded bg-gray-50 border border-gray-150 px-2 py-0.5 text-[9px] font-semibold text-gray-500">{t}</span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Dialog */}
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
              <h2 className="text-lg font-bold text-gray-900">Add CRM Contact</h2>
              <form onSubmit={handleCreateContact} className="mt-4 space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Clark Kent"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Company</label>
                    <input
                      type="text"
                      placeholder="e.g. Daily Planet"
                      value={newCompany}
                      onChange={(e) => setNewCompany(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Role / Designation</label>
                    <input
                      type="text"
                      placeholder="e.g. Lead Journalist"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Email Address</label>
                    <input
                      type="email"
                      placeholder="clark@kent.com"
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

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="Decision-Maker, High-Value"
                    value={newTagsString}
                    onChange={(e) => setNewTagsString(e.target.value)}
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
                    Save Contact
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
