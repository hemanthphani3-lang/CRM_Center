'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GitMerge, Plus, Trash2, Edit2, Play, Settings, X, ChevronRight, Sparkles, Sliders, Check } from 'lucide-react'
import { db, Workflow, WorkflowNode } from '@/lib/db'

export default function WorkflowsPage() {
  const [mounted, setMounted] = useState(false)
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
  
  // Custom states for nodes graph
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null)
  const [editLabel, setEditLabel] = useState('')
  const [editConfigVal, setEditConfigVal] = useState('')

  // Create Modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newTrigger, setNewTrigger] = useState('Lead Created')

  useEffect(() => {
    setMounted(true)
    db.initialize()
    loadData()
  }, [])

  const loadData = () => {
    const data = db.getWorkflows()
    setWorkflows(data)
    if (data.length > 0) {
      setSelectedWorkflow(data[0])
    }
  }

  if (!mounted) return null

  const handleToggleWorkflow = (id: string) => {
    const updated = workflows.map(w => {
      if (w.id === id) {
        return { ...w, isActive: !w.isActive }
      }
      return w
    })
    db.saveWorkflows(updated)
    setWorkflows(updated)
    if (selectedWorkflow?.id === id) {
      setSelectedWorkflow(updated.find(w => w.id === id) || null)
    }
  }

  const handleCreateWorkflow = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return

    const newWf: Workflow = {
      id: `wf-${Date.now()}`,
      name: newName,
      isActive: true,
      triggerType: newTrigger,
      runCount: 0,
      createdAt: new Date().toISOString(),
      nodes: [
        { id: 'n-trig', type: 'trigger', label: `Trigger: ${newTrigger}`, config: {}, position: { x: 50, y: 150 } },
        { id: 'n-act1', type: 'action', label: 'Action: Send WhatsApp Welcome', config: { template: 'Outbound Welcome Scoping' }, position: { x: 280, y: 150 } }
      ]
    }

    const current = db.getWorkflows()
    db.saveWorkflows([...current, newWf])
    loadData()
    setSelectedWorkflow(newWf)
    setIsCreateOpen(false)

    // Reset fields
    setNewName('')
  }

  const handleNodeClick = (n: WorkflowNode) => {
    setSelectedNode(n)
    setEditLabel(n.label)
    setEditConfigVal(JSON.stringify(n.config))
  }

  const handleSaveNodeConfig = () => {
    if (!selectedWorkflow || !selectedNode) return

    const updatedNodes = selectedWorkflow.nodes.map(n => {
      if (n.id === selectedNode.id) {
        let parsedConfig = {}
        try {
          parsedConfig = JSON.parse(editConfigVal)
        } catch {
          parsedConfig = { raw: editConfigVal }
        }
        return {
          ...n,
          label: editLabel,
          config: parsedConfig
        }
      }
      return n
    })

    const updatedWfs = workflows.map(w => {
      if (w.id === selectedWorkflow.id) {
        const next = { ...w, nodes: updatedNodes }
        setSelectedWorkflow(next)
        return next
      }
      return w
    })

    db.saveWorkflows(updatedWfs)
    setWorkflows(updatedWfs)
    setSelectedNode(null)
  }

  const handleAddNode = () => {
    if (!selectedWorkflow) return
    const currentNodes = selectedWorkflow.nodes
    const lastNode = currentNodes[currentNodes.length - 1]
    
    const newNode: WorkflowNode = {
      id: `n-${Date.now()}`,
      type: 'action',
      label: 'Action: Create CRM Task',
      config: { taskName: 'Qualify Lead Profile' },
      position: {
        x: lastNode ? lastNode.position.x + 220 : 100,
        y: 150
      }
    }

    const updatedNodes = [...currentNodes, newNode]
    const updatedWfs = workflows.map(w => {
      if (w.id === selectedWorkflow.id) {
        const next = { ...w, nodes: updatedNodes }
        setSelectedWorkflow(next)
        return next
      }
      return w
    })

    db.saveWorkflows(updatedWfs)
    setWorkflows(updatedWfs)
  }

  const handleDeleteWorkflow = (id: string) => {
    const updated = workflows.filter(w => w.id !== id)
    db.saveWorkflows(updated)
    setWorkflows(updated)
    if (selectedWorkflow?.id === id) {
      setSelectedWorkflow(updated[0] || null)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50/50 overflow-hidden font-sans border-t border-gray-100">
      {/* Sidebar List panel */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-gray-150 flex justify-between items-center bg-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <GitMerge size={18} className="text-brand" />
            <h2 className="text-sm font-bold text-gray-800">Workflows List</h2>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="rounded-lg p-1.5 hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-all"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {workflows.map(w => {
            const isSelected = selectedWorkflow?.id === w.id
            return (
              <div
                key={w.id}
                onClick={() => setSelectedWorkflow(w)}
                className={`w-full p-4 text-left flex justify-between items-start hover:bg-gray-50/50 cursor-pointer transition-colors ${
                  isSelected ? 'bg-brand-light' : ''
                }`}
              >
                <div>
                  <h3 className="text-xs font-bold text-gray-800 line-clamp-1">{w.name}</h3>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Runs: {w.runCount} • Trigger: {w.triggerType}</p>
                </div>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleToggleWorkflow(w.id)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      w.isActive ? 'bg-brand' : 'bg-gray-250'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        w.isActive ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => handleDeleteWorkflow(w.id)}
                    className="text-gray-300 hover:text-red-500 p-0.5 rounded transition-all"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Visual Canvas Node viewport */}
      <div className="flex-1 bg-gray-50/50 flex flex-col overflow-hidden relative">
        {selectedWorkflow ? (
          <>
            {/* Header toolbar */}
            <div className="p-4 border-b border-gray-150 bg-white flex justify-between items-center flex-shrink-0 z-10 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-850">{selectedWorkflow.name}</span>
                <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                  selectedWorkflow.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {selectedWorkflow.isActive ? 'Active' : 'Draft'}
                </span>
              </div>

              <button
                onClick={handleAddNode}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
              >
                <Plus size={14} />
                Add Action Node
              </button>
            </div>

            {/* SVG Graphic Canvas nodes map */}
            <div className="flex-1 overflow-auto relative p-12">
              <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-60 pointer-events-none" />

              {/* Dynamic SVG links drawing */}
              <svg className="absolute inset-0 h-full w-full pointer-events-none z-0">
                {selectedWorkflow.nodes.map((node, index) => {
                  const nextNode = selectedWorkflow.nodes[index + 1]
                  if (!nextNode) return null
                  
                  // Coordinate bounds
                  const startX = node.position.x + 180
                  const startY = node.position.y + 40
                  const endX = nextNode.position.x
                  const endY = nextNode.position.y + 40

                  return (
                    <g key={`link-${node.id}-${nextNode.id}`}>
                      {/* Line vector */}
                      <path
                        d={`M ${startX} ${startY} C ${(startX + endX) / 2} ${startY}, ${(startX + endX) / 2} ${endY}, ${endX} ${endY}`}
                        fill="none"
                        stroke="var(--brand-color, #6366f1)"
                        strokeWidth="2.5"
                        strokeDasharray="4 4"
                        className="animate-dash"
                      />
                    </g>
                  )
                })}
              </svg>

              {/* Nodes viewport */}
              <div className="relative z-10 flex flex-wrap gap-8 items-center h-full">
                {selectedWorkflow.nodes.map(node => {
                  const isSelected = selectedNode?.id === node.id
                  return (
                    <motion.div
                      key={node.id}
                      onClick={() => handleNodeClick(node)}
                      style={{ transform: `translate(${node.position.x}px, ${node.position.y}px)` }}
                      className={`absolute w-44 rounded-xl border p-3.5 bg-white cursor-pointer shadow-sm hover:shadow-md hover:border-brand transition-all flex flex-col justify-between ${
                        isSelected ? 'border-brand ring-1 ring-brand' : 'border-gray-200'
                      }`}
                    >
                      <div>
                        <span className={`text-[8px] font-extrabold uppercase px-1 py-0.5 rounded-md ${
                          node.type === 'trigger' ? 'bg-indigo-50 text-[#6366f1]' :
                          node.type === 'condition' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {node.type}
                        </span>
                        <h4 className="text-xs font-bold text-gray-800 mt-2 leading-relaxed">{node.label}</h4>
                      </div>

                      <ChevronRight size={14} className="text-gray-400 mt-3 align-end ml-auto" />
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            Select a workflow to edit the node graph map.
          </div>
        )}
      </div>

      {/* Right Config side panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 340, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full bg-white border-l border-gray-200 shadow-xl overflow-hidden flex flex-col flex-shrink-0"
          >
            {/* Header info */}
            <div className="p-4 border-b border-gray-150 flex justify-between items-center bg-white flex-shrink-0">
              <div className="flex items-center gap-2">
                <Settings size={16} className="text-brand" />
                <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Node Configurator</h3>
              </div>
              <button onClick={() => setSelectedNode(null)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>

            {/* Config content */}
            <div className="p-5 flex-1 space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Node Label</label>
                <input
                  type="text"
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Parameter configurations (JSON)</label>
                <textarea
                  rows={4}
                  value={editConfigVal}
                  onChange={(e) => setEditConfigVal(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none font-mono"
                />
              </div>

              <button
                onClick={handleSaveNodeConfig}
                className="w-full mt-3 rounded-lg bg-brand py-2.5 text-xs font-bold text-white hover:bg-brand-hover active:scale-98 transition-all shadow-md"
              >
                Save Configuration
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Modal Dialog */}
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
              <h2 className="text-lg font-bold text-gray-900">Add Automation Workflow</h2>
              <form onSubmit={handleCreateWorkflow} className="mt-4 space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Workflow Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Scoping Alert Sequence"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Trigger Event</label>
                  <select
                    value={newTrigger}
                    onChange={(e) => setNewTrigger(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none bg-white font-medium"
                  >
                    <option value="Lead Created">Lead Created</option>
                    <option value="Deal Stage Updated">Deal Stage Updated</option>
                    <option value="Task Marked Completed">Task Marked Completed</option>
                  </select>
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
                    Create Workflow
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
