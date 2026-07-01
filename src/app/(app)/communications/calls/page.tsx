'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Calendar, Clock, Smile, Sparkles, ChevronRight, X, Play, Mic, MessageSquare } from 'lucide-react'
import { db, CallLog } from '@/lib/db'

export default function CallsPage() {
  const [mounted, setMounted] = useState(false)
  const [calls, setCalls] = useState<CallLog[]>([])
  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null)

  useEffect(() => {
    setMounted(true)
    db.initialize()
    setCalls(db.getCalls())
  }, [])

  if (!mounted) return null

  return (
    <div className="flex h-screen bg-gray-50/50 overflow-hidden font-sans border-t border-gray-100 p-6 gap-6">
      {/* Calls list */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-150 flex items-center justify-between bg-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <Mic size={18} className="text-brand" />
            <h2 className="text-sm font-bold text-gray-800">AI Voice & Representative Call Logs</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {calls.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              No calls logged yet.
            </div>
          ) : (
            calls.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCall(c)}
                className={`w-full p-4 text-left flex justify-between items-center hover:bg-gray-50/50 transition-colors ${
                  selectedCall?.id === c.id ? 'bg-brand-light' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-brand-light text-brand flex items-center justify-center text-xs flex-shrink-0">
                    <Phone size={14} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-850">{c.name} ({c.phone})</h4>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400 font-semibold">
                      <span className="capitalize">{c.direction}</span>
                      <span>•</span>
                      <span>{c.duration} secs</span>
                      <span>•</span>
                      <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                    c.aiOutcome === 'qualified' ? 'bg-emerald-50 text-emerald-600' :
                    c.aiOutcome === 'not_interested' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {c.aiOutcome}
                  </span>
                  <ChevronRight size={14} className="text-gray-400" />
                </div>
              </button>
            )
          ))
        }
        </div>
      </div>

      {/* Details Side Panel agenda view */}
      <AnimatePresence>
        {selectedCall && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 440, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden flex flex-col flex-shrink-0"
          >
            {/* Header info */}
            <div className="p-4 border-b border-gray-150 flex justify-between items-center bg-white flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <Sparkles size={16} className="text-brand" />
                <div>
                  <h3 className="text-xs font-bold text-gray-800">AI Summary & Transcript</h3>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{selectedCall.name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCall(null)}
                className="rounded-lg p-1.5 hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable sections */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Outcome analytics info */}
              <div className="grid grid-cols-2 gap-3 bg-gray-50/50 border border-gray-150 rounded-xl p-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Sentiment</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Smile size={14} className="text-emerald-500" />
                    <span className="text-xs font-bold text-gray-800 capitalize">{selectedCall.sentiment}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">AI Classification</span>
                  <p className="text-xs font-extrabold text-brand mt-1 capitalize">{selectedCall.aiOutcome}</p>
                </div>
              </div>

              {/* Summary text block */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Call Summary Executive Notes</h4>
                <p className="text-xs text-gray-700 leading-relaxed bg-brand-light/20 p-4 rounded-xl border border-brand/10">
                  {selectedCall.summaryText}
                </p>
              </div>

              {/* Dialogue Transcript */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Dialogue Scoping Transcript</h4>
                <div className="space-y-3.5 pl-2 border-l border-gray-100">
                  {selectedCall.transcript.map((t, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[13px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-brand shadow-sm" />
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs font-bold text-gray-800">{t.speaker}</span>
                        <span className="text-[9px] text-gray-400 font-semibold">{t.time}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{t.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
