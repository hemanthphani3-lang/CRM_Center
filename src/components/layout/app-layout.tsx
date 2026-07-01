'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, X, Send, Sparkles, AlertCircle } from 'lucide-react'
import { Sidebar } from './sidebar'
import { TopNav } from './top-nav'
import { MobileNav } from './mobile-nav'
import { CommandPalette } from '@/components/shared/command-palette'
import { db } from '@/lib/db'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [copilotOpen, setCopilotOpen] = useState(false)
  const [brandColor, setBrandColor] = useState('#6366f1')

  // Copilot messages state
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string; id: string }[]>([
    { role: 'assistant', text: 'Hello! I am your Jesty AI Copilot. How can I help you manage your CRM workspace today?', id: '1' }
  ])
  const [inputText, setInputText] = useState('')

  useEffect(() => {
    db.initialize()
    const org = db.getOrg()
    if (org && org.brandColor) {
      setBrandColor(org.brandColor)
    }

    // Keypress for command palette
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(prev => !prev)
      }
    }

    // Listening for organization brand changes
    const handleBrandingChange = () => {
      const updatedOrg = db.getOrg()
      if (updatedOrg && updatedOrg.brandColor) {
        setBrandColor(updatedOrg.brandColor)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('jesty_branding_changed', handleBrandingChange)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('jesty_branding_changed', handleBrandingChange)
    }
  }, [])

  const handleCopilotSend = (text: string) => {
    if (!text.trim()) return

    const userMsg = { role: 'user' as const, text, id: Date.now().toString() }
    setMessages(prev => [...prev, userMsg])
    setInputText('')

    // Generate responsive response based on CRM data
    setTimeout(() => {
      let responseText = "I'm analyzing the active CRM telemetry. Let me check the records."
      const lower = text.toLowerCase()

      const leads = db.getLeads()
      const deals = db.getDeals()
      const tasks = db.getTasks()

      if (lower.includes('lead') || lower.includes('pipeline')) {
        const totalLeads = leads.length
        const newLeads = leads.filter(l => l.status === 'new').length
        const totalValue = leads.reduce((sum, l) => sum + l.value, 0)
        responseText = `You currently have **${totalLeads} leads** in your pipeline, with a combined estimation value of **$${totalValue.toLocaleString()}**. Of these, **${newLeads}** are flagged as 'New' and require immediate response.`
      } else if (lower.includes('deal') || lower.includes('won') || lower.includes('lost')) {
        const activeDeals = deals.filter(d => d.stageId !== 'stage-4' && d.stageId !== 'stage-5')
        const activeVal = activeDeals.reduce((sum, d) => sum + d.value, 0)
        const wonDeals = deals.filter(d => d.stageId === 'stage-4')
        responseText = `There are **${activeDeals.length} active deals** currently moving through pipeline stages, valued at a total of **$${activeVal.toLocaleString()}**. We have closed **${wonDeals.length} deals** as Won.`
      } else if (lower.includes('task') || lower.includes('todo') || lower.includes('due')) {
        const pending = tasks.filter(t => t.status === 'pending')
        const urgent = pending.filter(t => t.priority === 'urgent')
        responseText = `There are **${pending.length} pending tasks** registered. Crucially, **${urgent.length}** are marked as **Urgent priority** and due shortly. I recommend qualifying lead Robert Chen immediately.`
      } else if (lower.includes('summary') || lower.includes('status')) {
        responseText = `Active workspace summary:\n- Leads: ${leads.length} ($${leads.reduce((sum, l) => sum + l.value, 0).toLocaleString()})\n- Active Deals: ${deals.filter(d => d.stageId !== 'stage-4' && d.stageId !== 'stage-5').length}\n- Pending Tasks: ${tasks.filter(t => t.status === 'pending').length}`
      } else {
        responseText = "I can analyze your pipeline metrics in real-time. Try asking me:\n- *'Analyze leads pipeline'*\n- *'What active deals do we have?'*\n- *'List urgent tasks'*"
      }

      setMessages(prev => [...prev, { role: 'assistant', text: responseText, id: (Date.now() + 1).toString() }])
    }, 800)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F5F7]">
      {/* Brand Color CSS Injector */}
      <style jsx global>{`
        :root {
          --brand-color: ${brandColor};
          --brand-color-light: ${brandColor}15;
          --brand-color-hover: ${brandColor}dd;
        }
        .text-brand { color: var(--brand-color) !important; }
        .bg-brand { background-color: var(--brand-color) !important; }
        .bg-brand-light { background-color: var(--brand-color-light) !important; }
        .border-brand { border-color: var(--brand-color) !important; }
        .hover\:bg-brand-hover:hover { background-color: var(--brand-color-hover) !important; }
        .ring-brand:focus { --tw-ring-color: var(--brand-color) !important; }
      `}</style>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile nav slide-over */}
      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      {/* Main column */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Sticky top nav */}
        <TopNav 
          onMenuClick={() => setMobileNavOpen(true)} 
          onSearchClick={() => setCommandPaletteOpen(true)}
        />

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Cmd + K Command Palette */}
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />

      {/* Floating AI Copilot Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!copilotOpen ? (
            <motion.button
              key="copilot-btn"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCopilotOpen(true)}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-xl shadow-indigo-150 transition-all focus:outline-none"
              style={{ backgroundColor: brandColor }}
              aria-label="Open AI Copilot"
            >
              <Bot size={24} className="animate-pulse" />
            </motion.button>
          ) : (
            <motion.div
              key="copilot-panel"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="flex h-[480px] w-[360px] flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between bg-brand px-4 py-3 text-white" style={{ backgroundColor: brandColor }}>
                <div className="flex items-center gap-2">
                  <Bot size={20} />
                  <div>
                    <h3 className="text-sm font-bold">Jesty AI Copilot</h3>
                    <p className="text-[10px] text-white/80">Online & Analyzing CRM</p>
                  </div>
                </div>
                <button
                  onClick={() => setCopilotOpen(false)}
                  className="rounded-lg p-1 hover:bg-white/10 text-white transition-all"
                  aria-label="Close AI Copilot"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Chat Log */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
                {messages.map(m => (
                  <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs shadow-sm ${
                      m.role === 'user'
                        ? 'bg-brand text-white'
                        : 'bg-white text-gray-700 border border-gray-150'
                    }`} style={m.role === 'user' ? { backgroundColor: brandColor } : undefined}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Suggestions */}
              <div className="border-t border-gray-100 bg-white px-4 py-2 flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
                <button
                  onClick={() => handleCopilotSend('Analyze leads pipeline')}
                  className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] font-semibold text-gray-600 hover:border-brand hover:text-brand transition-all"
                >
                  Leads
                </button>
                <button
                  onClick={() => handleCopilotSend('What active deals do we have?')}
                  className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] font-semibold text-gray-600 hover:border-brand hover:text-brand transition-all"
                >
                  Deals
                </button>
                <button
                  onClick={() => handleCopilotSend('List urgent tasks')}
                  className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] font-semibold text-gray-600 hover:border-brand hover:text-brand transition-all"
                >
                  Tasks
                </button>
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleCopilotSend(inputText)
                }}
                className="flex items-center gap-2 border-t border-gray-100 bg-white p-3"
              >
                <input
                  type="text"
                  placeholder="Ask copilot about CRM..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:border-brand focus:outline-none transition-all"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-brand p-1.5 text-white hover:bg-brand-hover transition-all"
                  style={{ backgroundColor: brandColor }}
                  aria-label="Send message"
                >
                  <Send size={14} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
