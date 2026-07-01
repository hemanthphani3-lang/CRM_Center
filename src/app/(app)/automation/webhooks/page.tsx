'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Webhook, Plus, Trash2, Shield, Play, Key, Check, Info, FileCode, CheckCircle2, XCircle } from 'lucide-react'

interface WebhookEndpoint {
  id: string
  url: string
  events: string[]
  status: 'active' | 'inactive'
  secret: string
  createdAt: string
}

interface WebhookLog {
  id: string
  endpointUrl: string
  event: string
  status: number
  duration: number // ms
  timestamp: string
  payload: string
}

export default function WebhooksPage() {
  const [mounted, setMounted] = useState(false)
  const [endpoints, setEndpoints] = useState<WebhookEndpoint[]>([])
  const [logs, setLogs] = useState<WebhookLog[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newUrl, setNewUrl] = useState('')
  const [selectedEvents, setSelectedEvents] = useState<string[]>(['lead.created'])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'endpoints' | 'logs'>('endpoints')

  useEffect(() => {
    setMounted(true)
    const storedEndpoints = localStorage.getItem('jesty_webhook_endpoints')
    const storedLogs = localStorage.getItem('jesty_webhook_logs')

    if (storedEndpoints) {
      setEndpoints(JSON.parse(storedEndpoints))
    } else {
      const initialEndpoints: WebhookEndpoint[] = [
        { id: 'wh-1', url: 'https://api.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX', events: ['lead.created', 'deal.won'], status: 'active', secret: 'whsec_a1b2c3d4e5f6g7h8i9j0', createdAt: '2026-05-10T12:00:00Z' },
        { id: 'wh-2', url: 'https://acme-analytics-sync.herokuapp.com/webhooks', events: ['deal.updated', 'deal.lost'], status: 'active', secret: 'whsec_z9y8x7w6v5u4t3s2r1q0', createdAt: '2026-06-01T09:30:00Z' }
      ]
      localStorage.setItem('jesty_webhook_endpoints', JSON.stringify(initialEndpoints))
      setEndpoints(initialEndpoints)
    }

    if (storedLogs) {
      setLogs(JSON.parse(storedLogs))
    } else {
      const initialLogs: WebhookLog[] = [
        { id: 'log-1', endpointUrl: 'https://api.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX', event: 'lead.created', status: 200, duration: 142, timestamp: '2026-06-26T11:00:00Z', payload: '{"event": "lead.created", "data": {"id": "ld-4", "name": "Diana Prince", "value": 18000}}' },
        { id: 'log-2', endpointUrl: 'https://acme-analytics-sync.herokuapp.com/webhooks', event: 'deal.updated', status: 200, duration: 256, timestamp: '2026-06-26T10:55:00Z', payload: '{"event": "deal.updated", "data": {"id": "dl-2", "stageId": "stage-2", "value": 8900}}' },
        { id: 'log-3', endpointUrl: 'https://api.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX', event: 'deal.won', status: 502, duration: 1105, timestamp: '2026-06-25T16:00:00Z', payload: '{"event": "deal.won", "data": {"id": "dl-3", "value": 24000}}' }
      ]
      localStorage.setItem('jesty_webhook_logs', JSON.stringify(initialLogs))
      setLogs(initialLogs)
    }
  }, [])

  const saveEndpoints = (updated: WebhookEndpoint[]) => {
    localStorage.setItem('jesty_webhook_endpoints', JSON.stringify(updated))
    setEndpoints(updated)
  }

  const saveLogs = (updated: WebhookLog[]) => {
    localStorage.setItem('jesty_webhook_logs', JSON.stringify(updated))
    setLogs(updated)
  }

  if (!mounted) return null

  const handleToggleEndpoint = (id: string) => {
    const next = endpoints.map(ep => {
      if (ep.id === id) {
        return { ...ep, status: ep.status === 'active' ? ('inactive' as const) : ('active' as const) }
      }
      return ep
    })
    saveEndpoints(next)
  }

  const handleDeleteEndpoint = (id: string) => {
    const next = endpoints.filter(ep => ep.id !== id)
    saveEndpoints(next)
  }

  const handleCopySecret = (secret: string, id: string) => {
    navigator.clipboard.writeText(secret)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleAddEndpoint = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUrl.trim()) return

    const newEp: WebhookEndpoint = {
      id: `wh-${Date.now()}`,
      url: newUrl,
      events: selectedEvents,
      status: 'active',
      secret: `whsec_${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}`,
      createdAt: new Date().toISOString()
    }

    saveEndpoints([...endpoints, newEp])
    setIsAddOpen(false)
    setNewUrl('')
    setSelectedEvents(['lead.created'])
  }

  const handleToggleEventSelection = (event: string) => {
    if (selectedEvents.includes(event)) {
      setSelectedEvents(selectedEvents.filter(e => e !== event))
    } else {
      setSelectedEvents([...selectedEvents, event])
    }
  }

  const handleTestPayload = (endpoint: WebhookEndpoint) => {
    // Generate a new test log entry
    const newLog: WebhookLog = {
      id: `log-${Date.now()}`,
      endpointUrl: endpoint.url,
      event: endpoint.events[0] || 'ping',
      status: 200,
      duration: Math.floor(Math.random() * 300) + 50,
      timestamp: new Date().toISOString(),
      payload: JSON.stringify({
        event: endpoint.events[0] || 'ping',
        triggeredBy: 'Manual Test Execution',
        timestamp: new Date().toISOString(),
        data: {
          test: true,
          message: 'This is a synthetic test webhook payload generated by Jesty CRM.'
        }
      }, null, 2)
    }

    const updatedLogs = [newLog, ...logs]
    saveLogs(updatedLogs)
    setActiveTab('logs')
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 bg-gray-50/50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <Webhook size={22} className="text-brand" />
            Webhooks Manager
          </h1>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            Subscribe to event updates and dispatch structured JSON payloads to third-party endpoints.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-brand text-white px-4 py-2 text-xs font-bold hover:bg-brand-hover active:scale-98 transition-all shadow-md shadow-brand/10"
        >
          <Plus size={15} />
          Add Endpoint
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('endpoints')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'endpoints'
              ? 'border-brand text-brand'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Endpoints ({endpoints.length})
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'logs'
              ? 'border-brand text-brand'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Delivery Logs ({logs.length})
        </button>
      </div>

      {/* Main viewport */}
      <AnimatePresence mode="wait">
        {activeTab === 'endpoints' ? (
          <motion.div
            key="endpoints"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="space-y-4"
          >
            {endpoints.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-150 p-12 text-center text-gray-400 font-semibold">
                No webhook endpoints registered yet. Click 'Add Endpoint' to start.
              </div>
            ) : (
              endpoints.map(endpoint => (
                <div
                  key={endpoint.id}
                  className="bg-white rounded-2xl border border-gray-150 p-5 shadow-sm space-y-4 hover:shadow-md transition-all"
                >
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-gray-800 break-all select-all font-mono bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                          {endpoint.url}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-semibold">
                        Added: {new Date(endpoint.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleEndpoint(endpoint.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-colors ${
                          endpoint.status === 'active'
                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                            : 'bg-gray-150 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {endpoint.status === 'active' ? 'Active' : 'Paused'}
                      </button>
                      <button
                        onClick={() => handleTestPayload(endpoint)}
                        title="Send ping test payload"
                        className="p-1 hover:bg-gray-50 rounded text-gray-400 hover:text-brand transition-colors"
                      >
                        <Play size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteEndpoint(endpoint.id)}
                        className="p-1 hover:bg-gray-50 rounded text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Config Info */}
                  <div className="flex flex-wrap items-center justify-between border-t border-gray-100 pt-3 gap-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9px] font-extrabold uppercase text-gray-400">Events:</span>
                      {endpoint.events.map(ev => (
                        <span
                          key={ev}
                          className="text-[9px] font-bold bg-indigo-50 text-brand px-2 py-0.5 rounded-md"
                        >
                          {ev}
                        </span>
                      ))}
                    </div>

                    {/* Signing Secret */}
                    <div className="flex items-center gap-1.5 text-xs">
                      <Key size={12} className="text-gray-400" />
                      <span className="text-[11px] font-semibold text-gray-500 font-mono">
                        {copiedId === endpoint.id ? 'Copied Secret!' : 'whsec_••••••••••••'}
                      </span>
                      <button
                        onClick={() => handleCopySecret(endpoint.secret, endpoint.id)}
                        className="text-[10px] font-extrabold text-brand hover:underline"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        ) : (
          <motion.div
            key="logs"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="space-y-4"
          >
            {logs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-150 p-12 text-center text-gray-400 font-semibold">
                No deliveries recorded yet. Trigger a webhook or run a manual ping test.
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-wider border-b border-gray-150">
                      <th className="p-4">Status</th>
                      <th className="p-4">Event</th>
                      <th className="p-4">Destination Endpoint</th>
                      <th className="p-4">Latency</th>
                      <th className="p-4">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-700">
                    {logs.map(log => (
                      <tr key={log.id} className="hover:bg-gray-50/50">
                        <td className="p-4 flex items-center gap-1.5">
                          {log.status === 200 ? (
                            <CheckCircle2 size={14} className="text-emerald-500" />
                          ) : (
                            <XCircle size={14} className="text-red-500" />
                          )}
                          <span className={log.status === 200 ? 'text-emerald-600 font-bold' : 'text-red-500 font-bold'}>
                            {log.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-mono bg-indigo-50 text-brand px-1.5 py-0.5 rounded-md text-[10px] font-bold">
                            {log.event}
                          </span>
                        </td>
                        <td className="p-4 max-w-xs truncate font-mono text-[10px] text-gray-450" title={log.endpointUrl}>
                          {log.endpointUrl}
                        </td>
                        <td className="p-4 font-semibold text-gray-500">{log.duration}ms</td>
                        <td className="p-4 text-gray-400 font-semibold">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Endpoint Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg rounded-2xl bg-white border border-gray-200 shadow-2xl p-6 pointer-events-auto"
            >
              <h2 className="text-md font-bold text-gray-900 flex items-center gap-2">
                <Webhook size={18} className="text-brand" />
                Add Webhook Endpoint
              </h2>
              <form onSubmit={handleAddEndpoint} className="mt-4 space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Endpoint URL</label>
                  <input
                    type="url"
                    required
                    placeholder="https://yourdomain.com/webhooks/jesty"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Event Subscriptions</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {['lead.created', 'lead.converted', 'deal.updated', 'deal.won', 'deal.lost', 'whatsapp.received'].map(ev => {
                      const isSelected = selectedEvents.includes(ev)
                      return (
                        <button
                          key={ev}
                          type="button"
                          onClick={() => handleToggleEventSelection(ev)}
                          className={`px-3 py-2 text-left rounded-xl border text-[11px] font-bold transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-brand bg-brand-light text-brand'
                              : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                          }`}
                        >
                          {ev}
                          {isSelected && <Check size={12} />}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold hover:bg-gray-50 text-gray-600 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand-hover active:scale-98 transition-all"
                  >
                    Save Endpoint
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
