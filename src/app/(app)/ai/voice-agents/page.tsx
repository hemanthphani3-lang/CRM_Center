'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Plus, Search, Play, Phone, Settings, Sparkles, AlertCircle, X, Check } from 'lucide-react'
import { db } from '@/lib/db'

interface VoiceAgent {
  id: string
  name: string
  voice: string
  status: 'active' | 'idle'
  prompt: string
  trigger: string
}

const INITIAL_AGENTS: VoiceAgent[] = [
  { id: 'v-1', name: 'Lead Inbound Qualifier Bot', voice: 'Rachel (Female)', status: 'active', prompt: 'You are an AI sales employee of Jesty CRM. Call the lead immediately upon creation, qualify their seat requirement, and book a technical scoping meeting on Sarah\'s calendar.', trigger: 'Lead Created' },
  { id: 'v-2', name: 'Subscription Renewal Advisor', voice: 'Adam (Male)', status: 'idle', prompt: 'Call customers whose accounts are expiring, confirm renewal intention, and answer basic licensing questions.', trigger: 'Deal Closing date imminent' }
]

export default function VoiceAgentsPage() {
  const [mounted, setMounted] = useState(false)
  const [agents, setAgents] = useState<VoiceAgent[]>(INITIAL_AGENTS)
  const [search, setSearch] = useState('')
  const [selectedAgent, setSelectedAgent] = useState<VoiceAgent | null>(null)

  // Simulation test call states
  const [testNumber, setTestNumber] = useState('+1 (555) 000-0000')
  const [testResultText, setTestResultText] = useState('')
  const [isCalling, setIsCalling] = useState(false)

  // Create Modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newVoice, setNewVoice] = useState('Drew (Male)')
  const [newPrompt, setNewPrompt] = useState('')
  const [newTrigger, setNewTrigger] = useState('Lead Created')

  useEffect(() => {
    setMounted(true)
    db.initialize()
    if (INITIAL_AGENTS.length > 0) {
      setSelectedAgent(INITIAL_AGENTS[0])
    }
  }, [])

  if (!mounted) return null

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim() || !newPrompt.trim()) return

    const newAgent: VoiceAgent = {
      id: `v-${Date.now()}`,
      name: newName,
      voice: newVoice,
      status: 'idle',
      prompt: newPrompt,
      trigger: newTrigger
    }

    setAgents([newAgent, ...agents])
    setSelectedAgent(newAgent)
    setIsCreateOpen(false)

    // Reset inputs
    setNewName('')
    setNewPrompt('')
  }

  const handleTestCall = () => {
    if (!selectedAgent) return
    setIsCalling(true)
    setTestResultText('Initiating outbound AI voice agent call bridge...')

    setTimeout(() => {
      setTestResultText('Call connected. AI starting prompt dialogue stream...')
    }, 1500)

    setTimeout(() => {
      setTestResultText(
        `Call completed. Transcript summary generated:\n` +
        `- Target: ${testNumber}\n` +
        `- AI Agent: ${selectedAgent.name}\n` +
        `- Dialogue duration: 45 secs\n` +
        `- AI Outcome: qualified (Seat requirements matched: 12 seats, scheduled scoping session).`
      )
      setIsCalling(false)
    }, 4500)
  }

  return (
    <div className="flex h-screen bg-gray-50/50 overflow-hidden font-sans border-t border-gray-100 p-6 gap-6">
      {/* Left side list of agents */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-150 flex items-center justify-between bg-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <Mic size={18} className="text-brand" />
            <h2 className="text-sm font-bold text-gray-800">AI Voice Calling Agents</h2>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1 bg-brand text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-brand-hover active:scale-98 transition-all"
          >
            <Plus size={14} />
            Add Bot
          </button>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {agents.map(a => {
            const isSelected = selectedAgent?.id === a.id
            return (
              <button
                key={a.id}
                onClick={() => setSelectedAgent(a)}
                className={`w-full p-4 text-left flex justify-between items-center hover:bg-gray-50/50 transition-colors ${
                  isSelected ? 'bg-brand-light' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-brand-light text-brand flex items-center justify-center text-xs">
                    <Mic size={14} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-850">{a.name}</h4>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Voice: {a.voice} • Trigger: {a.trigger}</p>
                  </div>
                </div>

                <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                  a.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
                }`}>
                  {a.status}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Right side Agent Config panel */}
      {selectedAgent && (
        <div className="w-96 bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col justify-between flex-shrink-0 overflow-y-auto">
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Agent Settings</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Agent Prompts & Instructions</label>
                <p className="mt-1 text-xs text-gray-700 bg-gray-50/50 border border-gray-150 p-3 rounded-xl leading-relaxed whitespace-pre-wrap">
                  {selectedAgent.prompt}
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Event Trigger</label>
                <p className="text-xs font-semibold text-brand mt-1 capitalize">{selectedAgent.trigger}</p>
              </div>
            </div>

            {/* Test Calling Console */}
            <div className="border-t border-gray-100 pt-5 space-y-3">
              <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <Sparkles size={14} className="text-brand animate-spin-slow" />
                Trigger Sandbox Dial-out
              </h4>
              <p className="text-[10px] text-gray-500">Test this agent’s response variables by entering a mock number and triggering a call.</p>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="+1 (555) 234-5678"
                  value={testNumber}
                  onChange={(e) => setTestNumber(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:border-brand focus:outline-none"
                />
                <button
                  onClick={handleTestCall}
                  disabled={isCalling}
                  className="flex items-center gap-1 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-hover disabled:opacity-50 transition-all shadow-sm"
                >
                  <Play size={10} />
                  Dial
                </button>
              </div>

              {testResultText && (
                <div className="rounded-xl border border-gray-150 bg-gray-50 p-3 text-[10px] text-gray-600 font-mono whitespace-pre-wrap leading-relaxed">
                  {testResultText}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
              <h2 className="text-lg font-bold text-gray-900">Add AI Voice Agent</h2>
              <form onSubmit={handleCreateAgent} className="mt-4 space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Agent Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Support Billing Bot"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Voice Profile</label>
                    <select
                      value={newVoice}
                      onChange={(e) => setNewVoice(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none bg-white font-medium"
                    >
                      <option value="Drew (Male)">Drew (Male)</option>
                      <option value="Rachel (Female)">Rachel (Female)</option>
                      <option value="Adam (Male)">Adam (Male)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Event Trigger</label>
                    <select
                      value={newTrigger}
                      onChange={(e) => setNewTrigger(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none bg-white font-medium"
                    >
                      <option value="Lead Created">Lead Created</option>
                      <option value="Deal Stage Updated">Deal Stage Updated</option>
                      <option value="Manual Dispatch">Manual Dispatch</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Custom Prompts & Instructions</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide prompt details for dynamic voice speech..."
                    value={newPrompt}
                    onChange={(e) => setNewPrompt(e.target.value)}
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
                    Save Agent
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
