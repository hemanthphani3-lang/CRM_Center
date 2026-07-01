'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, FileText, ChevronRight, X, Play, Clock, Sparkles, Smile, ArrowUpRight } from 'lucide-react'
import { db, CallLog } from '@/lib/db'

export default function CallSummariesPage() {
  const [mounted, setMounted] = useState(false)
  const [calls, setCalls] = useState<CallLog[]>([])
  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null)

  useEffect(() => {
    setMounted(true)
    db.initialize()
    setCalls(db.getCalls())
  }, [])

  if (!mounted) return null

  // KPI Calculations
  const totalCalls = calls.length
  const positiveSentimentCount = calls.filter(c => c.sentiment === 'positive').length
  const avgDuration = calls.reduce((acc, c) => acc + c.duration, 0) / (totalCalls || 1)

  return (
    <div className="flex h-screen bg-gray-50/50 overflow-hidden font-sans border-t border-gray-100 p-6 gap-6">
      {/* Left side list of summaries */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-150 flex items-center justify-between bg-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-brand" />
            <h2 className="text-sm font-bold text-gray-800">AI Call Summaries & Transcripts</h2>
          </div>
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-3 gap-3 p-4 border-b border-gray-100 bg-gray-50/10 flex-shrink-0">
          <div className="rounded-xl border border-gray-150 bg-white p-3 shadow-sm text-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Processed</span>
            <p className="text-lg font-extrabold text-gray-800 mt-0.5">{totalCalls}</p>
          </div>
          <div className="rounded-xl border border-gray-150 bg-white p-3 shadow-sm text-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Avg Duration</span>
            <p className="text-lg font-extrabold text-gray-800 mt-0.5">{Math.floor(avgDuration)}s</p>
          </div>
          <div className="rounded-xl border border-gray-150 bg-white p-3 shadow-sm text-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Positive Sentiment</span>
            <p className="text-lg font-extrabold text-emerald-600 mt-0.5">{Math.round((positiveSentimentCount / (totalCalls || 1)) * 100)}%</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {calls.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCall(c)}
              className={`w-full p-4 text-left flex justify-between items-center hover:bg-gray-50/50 transition-all ${
                selectedCall?.id === c.id ? 'bg-brand-light' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-brand-light text-brand flex items-center justify-center text-xs">
                  <Play size={12} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-850">{c.name}</h4>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5 truncate max-w-sm line-clamp-1">{c.summaryText}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                  c.sentiment === 'positive' ? 'bg-emerald-50 text-emerald-600' :
                  c.sentiment === 'negative' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'
                }`}>
                  {c.sentiment}
                </span>
                <ChevronRight size={14} className="text-gray-400" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right side Detail inspector panel */}
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
                  <h3 className="text-xs font-bold text-gray-800">Transcript Timeline Summary</h3>
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

            {/* Scrollable details view */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Executive notes block */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">AI Call Summary Summary</h4>
                <p className="text-xs text-gray-700 leading-relaxed bg-brand-light/20 p-4 rounded-xl border border-brand/10">
                  {selectedCall.summaryText}
                </p>
              </div>

              {/* Sentiment gauges */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">AI Telemetry Sentiment</h4>
                <div className="flex items-center gap-2 bg-gray-50/50 p-3 border border-gray-150 rounded-xl text-xs font-semibold text-gray-700">
                  <Smile className="text-emerald-500" size={16} />
                  <span>Call Sentiment rated as **{selectedCall.sentiment}** (Confidence score 94%).</span>
                </div>
              </div>

              {/* Dialogue logs */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Call Transcript Dialogue Logs</h4>
                <div className="space-y-3 pl-2 border-l border-gray-100">
                  {selectedCall.transcript.map((t, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[13px] top-1.5 h-2 w-2 rounded-full bg-brand" />
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs font-bold text-gray-850">{t.speaker}</span>
                        <span className="text-[9px] text-gray-400 font-semibold">{t.time}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{t.text}</p>
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
