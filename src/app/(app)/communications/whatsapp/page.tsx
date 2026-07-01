'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle, Send, Plus, Search, Check, CheckCheck,
  Sparkles, FileText, ChevronRight, X, Phone, User, Tag, Briefcase
} from 'lucide-react'
import { db, WhatsAppConversation, WhatsAppMessage, Contact } from '@/lib/db'

export default function WhatsAppPage() {
  const [mounted, setMounted] = useState(false)
  const [conversations, setConversations] = useState<WhatsAppConversation[]>([])
  const [messages, setMessages] = useState<WhatsAppMessage[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])

  const [activeConvId, setActiveConvId] = useState<string>('')
  const [replyText, setReplyText] = useState('')
  
  // Simulation template templates
  const [showTemplates, setShowTemplates] = useState(false)
  const templates = [
    { id: 't1', title: 'Outbound Qualification', body: 'Hi {{name}}, thanks for reaching out. Are you available for a brief scoping call tomorrow at 2 PM?' },
    { id: 't2', title: 'Contract Renewal Notice', body: 'Hi {{name}}, your CRM subscription for {{company}} is due for renewal next month. Would you like to schedule an account review?' }
  ]

  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    db.initialize()
    loadData()
  }, [])

  const loadData = () => {
    const convs = db.getWhatsAppConversations()
    setConversations(convs)
    setMessages(db.getWhatsAppMessages())
    setContacts(db.getContacts())
    if (convs.length > 0) {
      setActiveConvId(convs[0].id)
    }
  }

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, activeConvId])

  if (!mounted) return null

  const activeConv = conversations.find(c => c.id === activeConvId)
  const activeMessages = messages.filter(m => m.conversationId === activeConvId)
  const activeContact = activeConv ? contacts.find(ct => ct.id === activeConv.contactId || ct.email === activeConv.leadId) || null : null

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim() || !activeConvId) return

    const newMsg: WhatsAppMessage = {
      id: `msg-${Date.now()}`,
      conversationId: activeConvId,
      direction: 'outbound',
      content: textToSend,
      senderId: 'usr-1',
      status: 'sent',
      createdAt: new Date().toISOString()
    }

    const updatedMsgs = [...messages, newMsg]
    db.saveWhatsAppMessages(updatedMsgs)
    setMessages(updatedMsgs)
    setReplyText('')
    setShowTemplates(false)

    // Update conversation last message & read status
    const updatedConvs = conversations.map(c => {
      if (c.id === activeConvId) {
        return { ...c, lastMessageAt: new Date().toISOString(), unreadCount: 0 }
      }
      return c
    })
    db.saveWhatsAppConversations(updatedConvs)
    setConversations(updatedConvs)

    // Simulate customer reply after 1.5s
    setTimeout(() => {
      const incomingMsg: WhatsAppMessage = {
        id: `msg-${Date.now() + 1}`,
        conversationId: activeConvId,
        direction: 'inbound',
        content: `Thanks for the response! Yes, that works for me. Let me coordinate with our IT lead.`,
        status: 'read',
        createdAt: new Date().toISOString()
      }
      const withInbound = [...updatedMsgs, incomingMsg]
      db.saveWhatsAppMessages(withInbound)
      setMessages(withInbound)

      const withInboundConvs = updatedConvs.map(c => {
        if (c.id === activeConvId) {
          return { ...c, lastMessageAt: new Date().toISOString() }
        }
        return c
      })
      db.saveWhatsAppConversations(withInboundConvs)
      setConversations(withInboundConvs)
    }, 1500)
  }

  const handleApplyTemplate = (body: string) => {
    if (!activeConv) return
    const contactName = activeConv.name
    const companyName = activeContact?.company || 'your organization'
    const filledBody = body.replace('{{name}}', contactName).replace('{{company}}', companyName)
    setReplyText(filledBody)
    setShowTemplates(false)
  }

  const handleSuggestAI = () => {
    if (!activeConv) return
    // Simple mock AI reply suggestions based on the context of the last message
    const lastMsg = activeMessages[activeMessages.length - 1]
    let suggestion = ''
    if (lastMsg && lastMsg.direction === 'inbound') {
      if (lastMsg.content.includes('call') || lastMsg.content.includes('scoping')) {
        suggestion = `Hi ${activeConv.name}, absolutely! Scoping calls typically take 15 minutes. Let's lock in tomorrow at 2 PM. I'll send a calendar invite.`
      } else {
        suggestion = `Hi ${activeConv.name}, thanks for reaching out. Let me get right on this and send over our custom pricing scoping proposals.`
      }
    } else {
      suggestion = `Hi ${activeConv.name}, just wanted to check if you had a chance to review the materials I sent earlier. Let me know if you have any questions!`
    }
    setReplyText(suggestion)
  }

  return (
    <div className="flex h-screen bg-gray-50/50 overflow-hidden font-sans border-t border-gray-100">
      {/* Threads List Pane */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-gray-150 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle size={18} className="text-brand" />
            <h2 className="text-sm font-bold text-gray-800">WhatsApp Inbox</h2>
          </div>
          <button className="rounded-lg p-1.5 hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-all">
            <Plus size={16} />
          </button>
        </div>

        <div className="p-3 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search chat thread..."
              className="pl-8 w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:border-brand focus:outline-none bg-gray-50/20"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {conversations.map(c => {
            const isActive = c.id === activeConvId
            const convMsgs = messages.filter(m => m.conversationId === c.id)
            const lastMsg = convMsgs[convMsgs.length - 1]

            return (
              <button
                key={c.id}
                onClick={() => {
                  setActiveConvId(c.id)
                  // Mark as read in UI
                  setConversations(prev => prev.map(conv => conv.id === c.id ? { ...conv, unreadCount: 0 } : conv))
                }}
                className={`w-full p-4 text-left flex gap-3 hover:bg-gray-50/50 transition-colors ${
                  isActive ? 'bg-brand-light' : ''
                }`}
              >
                <div className="h-9 w-9 rounded-full bg-brand-light text-brand font-extrabold flex items-center justify-center text-xs flex-shrink-0">
                  {c.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="text-xs font-bold text-gray-800 truncate">{c.name}</p>
                    <span className="text-[9px] text-gray-400 font-semibold">
                      {lastMsg ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-450 truncate mt-0.5">
                    {lastMsg ? lastMsg.content : 'No messages'}
                  </p>
                </div>
                {c.unreadCount > 0 && (
                  <span className="h-4 w-4 rounded-full bg-brand text-white text-[9px] font-bold flex items-center justify-center self-center">
                    {c.unreadCount}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Message Chat Viewport */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {activeConv ? (
          <>
            {/* Active Thread Header */}
            <div className="p-4 border-b border-gray-150 flex justify-between items-center bg-white flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-brand-light text-brand font-extrabold flex items-center justify-center text-xs">
                  {activeConv.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-800">{activeConv.name}</h3>
                  <p className="text-[10px] text-gray-400 font-semibold">{activeConv.phone}</p>
                </div>
              </div>
            </div>

            {/* Message Bubble Log */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
              {activeMessages.map(m => {
                const isOut = m.direction === 'outbound'
                return (
                  <div key={m.id} className={`flex ${isOut ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-xs shadow-sm ${
                      isOut
                        ? 'bg-brand text-white rounded-br-none'
                        : 'bg-white text-gray-700 border border-gray-200 rounded-bl-none'
                    }`}>
                      <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                      <div className={`flex justify-end gap-1 items-center mt-1 text-[9px] ${isOut ? 'text-white/80' : 'text-gray-400'}`}>
                        <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {isOut && (
                          m.status === 'read' ? <CheckCheck size={10} strokeWidth={3} /> : <Check size={10} strokeWidth={3} />
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Templates Selector Dropdown */}
            <AnimatePresence>
              {showTemplates && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mx-4 mt-2 p-3 bg-white border border-gray-200 rounded-xl shadow-xl space-y-2 absolute bottom-24 left-80 right-[240px] z-20 pointer-events-auto"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400">WhatsApp Templates</h4>
                    <button onClick={() => setShowTemplates(false)} className="text-gray-400 hover:text-gray-600">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {templates.map(t => (
                      <button
                        key={t.id}
                        onClick={() => handleApplyTemplate(t.body)}
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

            {/* Bottom Editor */}
            <div className="p-4 border-t border-gray-150 bg-white flex-shrink-0 flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setShowTemplates(prev => !prev)}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 text-[10px] font-semibold text-gray-600 transition-all shadow-sm"
                >
                  <FileText size={12} />
                  Templates
                </button>
                <button
                  onClick={handleSuggestAI}
                  className="flex items-center gap-1.5 rounded-lg border border-brand-light bg-brand-light hover:bg-brand-light/70 px-3 py-1.5 text-[10px] font-semibold text-brand transition-all shadow-sm"
                >
                  <Sparkles size={12} />
                  Draft AI Reply
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend(replyText)
                }}
                className="flex items-center gap-3"
              >
                <input
                  type="text"
                  placeholder="Type WhatsApp reply message..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-xs focus:border-brand focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="rounded-xl bg-brand p-3 text-white hover:bg-brand-hover active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            Select a thread conversation to get started.
          </div>
        )}
      </div>

      {/* Customer Profile Sidebar Inspector */}
      {activeConv && activeContact && (
        <div className="w-60 bg-white border-l border-gray-200 p-5 flex flex-col gap-6 flex-shrink-0">
          <div className="text-center pb-4 border-b border-gray-100">
            {activeContact.avatarUrl ? (
              <img src={activeContact.avatarUrl} alt={activeContact.name} className="h-14 w-14 rounded-full mx-auto object-cover" />
            ) : (
              <div className="h-14 w-14 rounded-full bg-brand-light text-brand font-extrabold flex items-center justify-center text-lg mx-auto">
                {activeContact.name.charAt(0)}
              </div>
            )}
            <h4 className="text-sm font-bold text-gray-800 mt-3">{activeContact.name}</h4>
            <p className="text-[10px] text-gray-400 font-semibold">{activeContact.role}</p>
          </div>

          <div className="space-y-4">
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Account Details</h5>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Briefcase size={12} className="text-gray-400" />
                <span>{activeContact.company}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Phone size={12} className="text-gray-400" />
                <span>{activeContact.phone}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Contact Tags</h5>
            <div className="flex flex-wrap gap-1">
              {activeContact.tags.map(t => (
                <span key={t} className="rounded bg-gray-50 border border-gray-150 px-1.5 py-0.5 text-[9px] font-semibold text-gray-500">{t}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
