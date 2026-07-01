'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail, Send, Search, Sparkles, AlertCircle, Eye, MousePointer,
  ChevronRight, ArrowUpRight, Check, X, FileText, Globe
} from 'lucide-react'
import { db, EmailThread, Contact } from '@/lib/db'

export default function EmailsPage() {
  const [mounted, setMounted] = useState(false)
  const [threads, setThreads] = useState<EmailThread[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [activeThreadId, setActiveThreadId] = useState<string>('')
  
  const [search, setSearch] = useState('')
  const [newMailBody, setNewMailBody] = useState('')
  const [newMailSubject, setNewMailSubject] = useState('')

  // Template dispatcher
  const [showTemplates, setShowTemplates] = useState(false)
  const templates = [
    { id: 't1', title: 'Contract Renewal Notice', subject: 'CRM Subscription Renewal', body: 'Hi {{name}},\n\nYour CRM subscription for {{company}} is due for renewal next month. We would love to hop on a scoping account review call.\n\nBest,\nSales Team' },
    { id: 't2', title: 'Outbound Welcome Proposal', subject: 'Custom Pricing Catalog', body: 'Hi {{name}},\n\nThanks for reaching out to Jesty CRM. Attached is the customized pricing catalog you requested for {{company}}.\n\nBest,\nSarah Connor' }
  ]

  useEffect(() => {
    setMounted(true)
    db.initialize()
    loadData()
  }, [])

  const loadData = () => {
    const data = db.getEmails()
    setThreads(data)
    setContacts(db.getContacts())
    if (data.length > 0) {
      setActiveThreadId(data[0].id)
    }
  }

  if (!mounted) return null

  const activeThread = threads.find(t => t.id === activeThreadId)
  const activeContact = activeThread ? contacts.find(c => c.id === activeThread.contactId) || null : null

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMailBody.trim() || !activeThreadId || !activeThread) return

    const newMsg = {
      id: `em-msg-${Date.now()}`,
      direction: 'outbound' as const,
      fromAddress: 'sales@acme.com',
      toAddress: activeContact?.email || 'client@chencorp.com',
      body: newMailBody,
      isOpened: false,
      isClicked: false,
      createdAt: new Date().toISOString()
    }

    const updatedThreads = threads.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          lastMessageAt: new Date().toISOString(),
          messages: [...t.messages, newMsg]
        }
      }
      return t
    })

    db.saveEmails(updatedThreads)
    setThreads(updatedThreads)
    setNewMailBody('')
    setShowTemplates(false)

    // Simulate customer opened and clicked mail after 3s & 6s
    setTimeout(() => {
      const openThreads = db.getEmails().map(t => {
        if (t.id === activeThreadId) {
          const msgs = t.messages.map(m => m.id === newMsg.id ? { ...m, isOpened: true } : m)
          return { ...t, messages: msgs }
        }
        return t
      })
      db.saveEmails(openThreads)
      setThreads(openThreads)
    }, 3000)

    setTimeout(() => {
      const clickThreads = db.getEmails().map(t => {
        if (t.id === activeThreadId) {
          const msgs = t.messages.map(m => m.id === newMsg.id ? { ...m, isClicked: true } : m)
          return { ...t, messages: msgs }
        }
        return t
      })
      db.saveEmails(clickThreads)
      setThreads(clickThreads)
    }, 6000)
  }

  const handleApplyTemplate = (subject: string, body: string) => {
    if (!activeContact) return
    const name = activeContact.name
    const company = activeContact.company || 'your organization'

    const filledSubject = subject.replace('{{name}}', name).replace('{{company}}', company)
    const filledBody = body.replace('{{name}}', name).replace('{{company}}', company)

    setNewMailSubject(filledSubject)
    setNewMailBody(filledBody)
    setShowTemplates(false)
  }

  return (
    <div className="flex h-screen bg-gray-50/50 overflow-hidden font-sans border-t border-gray-100">
      {/* Threads list */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-gray-150 flex justify-between items-center bg-white">
          <div className="flex items-center gap-2">
            <Mail size={18} className="text-brand" />
            <h2 className="text-sm font-bold text-gray-800">Email Threads</h2>
          </div>
        </div>

        <div className="p-3 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:border-brand focus:outline-none bg-gray-50/20"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {threads.filter(t => t.subject.toLowerCase().includes(search.toLowerCase())).map(t => {
            const isActive = t.id === activeThreadId
            const lastMsg = t.messages[t.messages.length - 1]
            const recipient = contacts.find(c => c.id === t.contactId)

            return (
              <button
                key={t.id}
                onClick={() => setActiveThreadId(t.id)}
                className={`w-full p-4 text-left flex flex-col gap-1 hover:bg-gray-50/50 transition-colors ${
                  isActive ? 'bg-brand-light' : ''
                }`}
              >
                <div className="flex justify-between items-baseline w-full">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand">{recipient?.name || 'Prospect'}</span>
                  <span className="text-[9px] text-gray-400 font-semibold">
                    {lastMsg ? new Date(lastMsg.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>
                <p className="text-xs font-bold text-gray-850 truncate">{t.subject}</p>
                <p className="text-[11px] text-gray-450 truncate line-clamp-1">
                  {lastMsg ? lastMsg.body : 'No body'}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Mail View */}
      <div className="flex-1 bg-white flex flex-col overflow-hidden">
        {activeThread ? (
          <>
            {/* Header info */}
            <div className="p-4 border-b border-gray-150 flex justify-between items-center bg-white flex-shrink-0">
              <div>
                <h3 className="text-xs font-bold text-gray-850">{activeThread.subject}</h3>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                  Thread with: {activeContact?.name} ({activeContact?.email})
                </p>
              </div>
            </div>

            {/* Messages log */}
            <div className="flex-1 overflow-y-auto p-5 bg-gray-50/30 space-y-4">
              {activeThread.messages.map(m => {
                const isOut = m.direction === 'outbound'
                return (
                  <div key={m.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <div>
                        <span className="text-xs font-bold text-gray-800">From: {m.fromAddress}</span>
                        <p className="text-[10px] text-gray-400 mt-0.5">To: {m.toAddress}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] text-gray-400 font-semibold">
                          {new Date(m.createdAt).toLocaleString()}
                        </span>
                        {isOut && (
                          <div className="flex gap-2 text-[9px] font-bold uppercase tracking-wider">
                            <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${m.isOpened ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                              <Eye size={10} />
                              Opened
                            </span>
                            <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${m.isClicked ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                              <MousePointer size={10} />
                              Clicked
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">{m.body}</p>
                  </div>
                )
              })}
            </div>

            {/* Template selector modal */}
            <AnimatePresence>
              {showTemplates && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mx-4 mt-2 p-3 bg-white border border-gray-200 rounded-xl shadow-xl space-y-2 absolute bottom-44 left-80 right-4 z-20 pointer-events-auto"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Email Templates</h4>
                    <button onClick={() => setShowTemplates(false)} className="text-gray-400 hover:text-gray-600">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {templates.map(t => (
                      <button
                        key={t.id}
                        onClick={() => handleApplyTemplate(t.subject, t.body)}
                        className="w-full text-left p-2 hover:bg-gray-50 border border-gray-100 rounded-lg transition-all"
                      >
                        <p className="text-xs font-bold text-gray-800">{t.title}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{t.body}</p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Outbound Form */}
            <form onSubmit={handleSendEmail} className="p-4 border-t border-gray-150 bg-white flex-shrink-0 space-y-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowTemplates(prev => !prev)}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 text-[10px] font-semibold text-gray-600 transition-all shadow-sm"
                >
                  <FileText size={12} />
                  Templates
                </button>
              </div>

              {newMailSubject && (
                <div className="flex gap-2 text-xs border border-gray-200 rounded-lg px-3 py-2 bg-gray-50/20">
                  <span className="text-gray-400">Subject:</span>
                  <span className="font-semibold text-gray-800">{newMailSubject}</span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <textarea
                  rows={2}
                  placeholder="Type email body content..."
                  value={newMailBody}
                  onChange={(e) => setNewMailBody(e.target.value)}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-xs focus:border-brand focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!newMailBody.trim()}
                  className="rounded-xl bg-brand p-3 text-white hover:bg-brand-hover active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md self-end"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            Select a thread thread to view logs.
          </div>
        )}
      </div>
    </div>
  )
}
