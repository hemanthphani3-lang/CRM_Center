'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Send, Sparkles, Database, FileText, ChevronRight } from 'lucide-react'
import { db } from '@/lib/db'

export default function AIAssistantPage() {
  const [mounted, setMounted] = useState(false)
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string; id: string }[]>([
    { role: 'assistant', text: 'Hello! I am your Jesty AI Assistant analyst. Ask me anything about your current leads, active deals, pipeline value, or team tasks.', id: '1' }
  ])
  const [inputText, setInputText] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    db.initialize()
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!mounted) return null

  const handleSend = (text: string) => {
    if (!text.trim()) return

    const userMsg = { role: 'user' as const, text, id: Date.now().toString() }
    setMessages(prev => [...prev, userMsg])
    setInputText('')

    setTimeout(() => {
      let response = "I'm checking the database logs..."
      const lower = text.toLowerCase()

      const leads = db.getLeads()
      const deals = db.getDeals()
      const tasks = db.getTasks()

      if (lower.includes('lead') || lower.includes('prospect')) {
        const total = leads.length
        const val = leads.reduce((acc, l) => acc + l.value, 0)
        response = `You have **${total} leads** registered in the database, with a total estimated value of **$${val.toLocaleString()}**.\n\nHere are the top leads:\n` +
          leads.map(l => `- **${l.name}** (${l.company}) — Value: $${l.value.toLocaleString()} | Status: *${l.status}*`).join('\n')
      } else if (lower.includes('deal') || lower.includes('value') || lower.includes('revenue')) {
        const activeDeals = deals.filter(d => d.stageId !== 'stage-4' && d.stageId !== 'stage-5')
        const activeVal = activeDeals.reduce((acc, d) => acc + d.value, 0)
        const won = deals.filter(d => d.stageId === 'stage-4')
        const wonVal = won.reduce((acc, d) => acc + d.value, 0)
        response = `Pipeline Deal Statistics:\n- **Active Deals**: ${activeDeals.length} deals moving through stages, valued at **$${activeVal.toLocaleString()}**.\n- **Closed Won**: ${won.length} deals, representing **$${wonVal.toLocaleString()}** in closed revenue.`
      } else if (lower.includes('task') || lower.includes('todo')) {
        const pending = tasks.filter(t => t.status === 'pending')
        const urgent = pending.filter(t => t.priority === 'urgent')
        response = `Task Status Overview:\n- There are **${pending.length} pending tasks** requiring action.\n- **${urgent.length} tasks** are flagged as **Urgent** priority.\n\nPending high-priority list:\n` +
          pending.map(t => `- **${t.title}** (Assignee: *${t.assignedTo}* | Priority: *${t.priority}*)`).join('\n')
      } else if (lower.includes('summary') || lower.includes('hello') || lower.includes('hi')) {
        response = `Hello! Here is your quick CRM telemetry overview:\n\n1. **Leads**: ${leads.length} prospects registered ($${leads.reduce((sum, l) => sum + l.value, 0).toLocaleString()} estimate value).\n2. **Active Deals**: ${deals.filter(d => d.stageId !== 'stage-4' && d.stageId !== 'stage-5').length} deals currently moving.\n3. **Tasks**: ${tasks.filter(t => t.status === 'pending').length} tasks pending action.\n\nAsk me questions like "List active leads" or "How many deals are in progress?" for deep analysis.`
      } else {
        response = `I didn't quite catch that. You can ask me to:\n- *'Show active leads list'*\n- *'Analyze deal pipeline values'*\n- *'Give me pending tasks summary'*`
      }

      setMessages(prev => [...prev, { role: 'assistant', text: response, id: (Date.now() + 1).toString() }])
    }, 850)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50/50 font-sans border-t border-gray-100">
      {/* Sidebar suggestion panel */}
      <div className="hidden md:flex w-80 bg-white border-r border-gray-200 p-5 flex-col justify-between flex-shrink-0">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-brand animate-spin-slow" />
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">AI Copilot Prompts</h3>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">Select a preset to analyze local database schemas and compile conversion reports instantly.</p>
          
          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => handleSend('List all leads')}
              className="w-full text-left p-3 border border-gray-150 rounded-xl hover:border-brand hover:bg-brand-light/30 transition-all text-xs font-semibold text-gray-700"
            >
              Analyze Leads List
            </button>
            <button
              onClick={() => handleSend('Analyze deals pipeline values')}
              className="w-full text-left p-3 border border-gray-150 rounded-xl hover:border-brand hover:bg-brand-light/30 transition-all text-xs font-semibold text-gray-700"
            >
              Show Pipeline Deal Values
            </button>
            <button
              onClick={() => handleSend('Show pending tasks summary')}
              className="w-full text-left p-3 border border-gray-150 rounded-xl hover:border-brand hover:bg-brand-light/30 transition-all text-xs font-semibold text-gray-700"
            >
              Summarize Pending Tasks
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-gray-150 bg-gray-50/50 p-4 flex gap-2">
          <Database size={16} className="text-gray-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-gray-500">Telemetry synced directly with LocalStorage caching models.</p>
        </div>
      </div>

      {/* Main Chat viewport */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* Chat header */}
        <div className="p-4 border-b border-gray-150 bg-white flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-brand-light p-2 text-brand">
              <Bot size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-800">Jesty Assistant Playground</h2>
              <p className="text-[10px] text-gray-400 font-semibold">Active Model: Gemini 2.5 Flash</p>
            </div>
          </div>
        </div>

        {/* Chat bubble log */}
        <div className="flex-1 overflow-y-auto p-5 bg-gray-50/20 space-y-4">
          {messages.map(m => {
            const isUser = m.role === 'user'
            return (
              <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs shadow-sm leading-relaxed ${
                  isUser ? 'bg-brand text-white rounded-br-none' : 'bg-white text-gray-705 border border-gray-200 rounded-bl-none'
                }`}>
                  <p className="whitespace-pre-wrap">{m.text}</p>
                </div>
              </div>
            )
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend(inputText)
          }}
          className="p-4 border-t border-gray-150 bg-white flex gap-3 flex-shrink-0"
        >
          <input
            type="text"
            placeholder="Query CRM leads, deals value, pending tasks..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-xs focus:border-brand focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="rounded-xl bg-brand px-5 py-3 text-xs font-semibold text-white hover:bg-brand-hover disabled:opacity-50 transition-all shadow-md"
          >
            Send Query
          </button>
        </form>
      </div>
    </div>
  )
}
