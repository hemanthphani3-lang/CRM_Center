'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, Calendar, User, Trash2, Check, CheckSquare, X } from 'lucide-react'
import { db, Task, Lead, Deal, Contact } from '@/lib/db'

export default function TasksPage() {
  const [mounted, setMounted] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all')

  // Create modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newPriority, setNewPriority] = useState<Task['priority']>('medium')
  const [newDueDate, setNewDueDate] = useState('2026-06-30T17:00:00Z')
  const [newAssignee, setNewAssignee] = useState('Sarah Connor')
  const [newLinkedType, setNewLinkedType] = useState<'lead' | 'contact' | 'deal' | ''>('')
  const [newLinkedId, setNewLinkedId] = useState('')

  useEffect(() => {
    setMounted(true)
    db.initialize()
    loadData()

    window.addEventListener('jesty_db_synced', loadData)
    return () => {
      window.removeEventListener('jesty_db_synced', loadData)
    }
  }, [])

  const loadData = () => {
    setTasks(db.getTasks())
    setLeads(db.getLeads())
    setDeals(db.getDeals())
  }

  // Filter logic
  useEffect(() => {
    let result = tasks
    if (search.trim()) {
      result = result.filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
    }
    if (statusFilter === 'pending') {
      result = result.filter(t => t.status === 'pending')
    } else if (statusFilter === 'completed') {
      result = result.filter(t => t.status === 'completed')
    }
    setFilteredTasks(result)
  }, [tasks, search, statusFilter])

  const handleToggleStatus = (id: string) => {
    const updated = tasks.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: (t.status === 'pending' ? 'completed' : 'pending') as Task['status']
        }
      }
      return t
    })
    db.saveTasks(updated)
    setTasks(updated)
  }

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id)
    db.saveTasks(updated)
    setTasks(updated)
  }

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const newTask: Task = {
      id: `tk-${Date.now()}`,
      title: newTitle,
      description: newDesc || undefined,
      priority: newPriority,
      status: 'pending',
      dueDate: newDueDate,
      assignedTo: newAssignee,
      linkedType: newLinkedType || undefined,
      linkedId: newLinkedId || undefined,
      createdAt: new Date().toISOString()
    }

    const currentTasks = db.getTasks()
    db.saveTasks([newTask, ...currentTasks])
    loadData()
    setIsCreateOpen(false)

    // Reset inputs
    setNewTitle('')
    setNewDesc('')
    setNewPriority('medium')
    setNewDueDate('2026-06-30T17:00:00Z')
    setNewAssignee('Sarah Connor')
    setNewLinkedType('')
    setNewLinkedId('')
  }

  if (!mounted) return null

  return (
    <div className="p-6 space-y-6 bg-gray-50/40 min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">CRM Tasks</h1>
          <p className="text-sm text-gray-500">Coordinate representative actions, priorities, and deadlines.</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-brand-hover active:scale-98 transition-all"
        >
          <Plus size={16} />
          New Task
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search task title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none transition-colors"
          />
        </div>
        <div className="flex border border-gray-200 rounded-lg overflow-hidden text-xs font-semibold select-none">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-2 transition-colors ${statusFilter === 'all' ? 'bg-brand text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-2 transition-colors border-l border-gray-200 ${statusFilter === 'pending' ? 'bg-brand text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-2 transition-colors border-l border-gray-200 ${statusFilter === 'completed' ? 'bg-brand text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden divide-y divide-gray-150">
        {filteredTasks.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">
            No tasks registered. Try adding one!
          </div>
        ) : (
          filteredTasks.map(t => {
            const isCompleted = t.status === 'completed'
            return (
              <div
                key={t.id}
                className={`flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-4 hover:bg-gray-50/50 transition-colors ${
                  isCompleted ? 'bg-gray-50/20' : ''
                }`}
              >
                {/* Left checkbox & text details */}
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggleStatus(t.id)}
                    className={`mt-0.5 h-5 w-5 rounded border flex items-center justify-center transition-all ${
                      isCompleted ? 'border-brand bg-brand text-white' : 'border-gray-300 bg-white hover:border-brand'
                    }`}
                  >
                    {isCompleted && <Check size={14} strokeWidth={3} />}
                  </button>

                  <div>
                    <h3 className={`text-sm font-bold text-gray-800 ${isCompleted ? 'line-through text-gray-400' : ''}`}>
                      {t.title}
                    </h3>
                    {t.description && (
                      <p className={`text-xs text-gray-500 mt-0.5 ${isCompleted ? 'text-gray-450 line-through' : ''}`}>
                        {t.description}
                      </p>
                    )}
                    {t.dueDate && (
                      <div className="flex items-center gap-1 mt-1.5 text-[10px] text-gray-400 font-semibold">
                        <Calendar size={12} />
                        <span>Due: {new Date(t.dueDate).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right badges & delete button */}
                <div className="flex items-center gap-3 ml-8 sm:ml-0">
                  <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                    t.priority === 'urgent' ? 'bg-red-50 text-red-600' :
                    t.priority === 'high' ? 'bg-orange-50 text-orange-600' :
                    t.priority === 'medium' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {t.priority}
                  </span>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                    <div className="h-6 w-6 rounded-full bg-brand-light text-brand flex items-center justify-center text-[10px]">
                      {t.assignedTo.charAt(0)}
                    </div>
                    <span className="hidden sm:inline">{t.assignedTo.split(' ')[0]}</span>
                  </div>

                  <button
                    onClick={() => handleDeleteTask(t.id)}
                    className="text-gray-300 hover:text-red-500 p-1.5 rounded transition-all"
                    title="Delete Task"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )
          })
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
              <h2 className="text-lg font-bold text-gray-900">Add CRM Task</h2>
              <form onSubmit={handleCreateTask} className="mt-4 space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Task Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Follow up on scoping session"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Enter task details..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Priority</label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as Task['priority'])}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none bg-white font-medium"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Assignee</label>
                    <select
                      value={newAssignee}
                      onChange={(e) => setNewAssignee(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none bg-white font-medium"
                    >
                      <option value="Sarah Connor">Sarah Connor</option>
                      <option value="John Doe">John Doe</option>
                      <option value="Jane Smith">Jane Smith</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Due Date</label>
                    <input
                      type="datetime-local"
                      value={newDueDate.substring(0, 16)}
                      onChange={(e) => setNewDueDate(new Date(e.target.value).toISOString())}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Link Reference</label>
                    <select
                      value={newLinkedType}
                      onChange={(e) => setNewLinkedType(e.target.value as any)}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none bg-white"
                    >
                      <option value="">None</option>
                      <option value="lead">Lead</option>
                      <option value="deal">Deal</option>
                    </select>
                  </div>
                </div>

                {newLinkedType === 'lead' && (
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Link Prospect Lead</label>
                    <select
                      value={newLinkedId}
                      onChange={(e) => setNewLinkedId(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none bg-white"
                    >
                      <option value="">Select Lead...</option>
                      {leads.map(l => (
                        <option key={l.id} value={l.id}>{l.name} ({l.company})</option>
                      ))}
                    </select>
                  </div>
                )}

                {newLinkedType === 'deal' && (
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Link Pipeline Deal</label>
                    <select
                      value={newLinkedId}
                      onChange={(e) => setNewLinkedId(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none bg-white"
                    >
                      <option value="">Select Deal...</option>
                      {deals.map(d => (
                        <option key={d.id} value={d.id}>{d.title} (${d.value.toLocaleString()})</option>
                      ))}
                    </select>
                  </div>
                )}

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
                    Create Task
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
