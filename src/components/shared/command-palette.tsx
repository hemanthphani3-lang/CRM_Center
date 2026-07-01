'use client'

import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { COMMAND_ITEMS, type CommandItem } from '@/lib/command-palette-items'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

function DynamicIcon({ name, size = 16, className }: { name: string; size?: number; className?: string }) {
  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[name]
  if (!IconComponent) return <span className={className} style={{ width: size, height: size, display: 'inline-block' }} />
  return <IconComponent size={size} className={className} />
}

const GROUP_ORDER = ['Navigation', 'Actions', 'Recent'] as const

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const previousFocusRef = useRef<Element | null>(null)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  // Save & restore focus
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement
      // Small delay so the AnimatePresence mount finishes
      const t = setTimeout(() => inputRef.current?.focus(), 30)
      return () => clearTimeout(t)
    } else {
      const el = previousFocusRef.current
      if (el && typeof (el as HTMLElement).focus === 'function') {
        ;(el as HTMLElement).focus()
      }
    }
  }, [isOpen])

  // Reset query on open
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setActiveIndex(0)
    }
  }, [isOpen])

  const filteredItems = useMemo(() => {
    if (!query.trim()) return COMMAND_ITEMS
    const lower = query.toLowerCase()
    return COMMAND_ITEMS.filter(
      item =>
        item.label.toLowerCase().includes(lower) ||
        (item.description?.toLowerCase().includes(lower) ?? false),
    )
  }, [query])

  const visibleGroups = useMemo(
    () => GROUP_ORDER.filter(g => filteredItems.some(i => i.group === g)),
    [filteredItems],
  )

  // Flatten in group order for keyboard nav
  const flatItems = useMemo(
    () => visibleGroups.flatMap(g => filteredItems.filter(i => i.group === g)),
    [filteredItems, visibleGroups],
  )

  const handleSelect = useCallback(
    (item: CommandItem) => {
      if (item.href) {
        router.push(item.href)
      }
      onClose()
    },
    [router, onClose],
  )

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex(prev => Math.min(prev + 1, flatItems.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex(prev => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const item = flatItems[activeIndex]
        if (item) handleSelect(item)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, flatItems, activeIndex, onClose, handleSelect])

  // Reset activeIndex when results change
  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40"
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              className="pointer-events-auto w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden"
            >
              {/* Search input row */}
              <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100">
                <Search size={16} className="text-gray-400 flex-shrink-0" aria-hidden="true" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search pages, actions…"
                  className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
                  aria-label="Search command palette"
                  autoComplete="off"
                  spellCheck={false}
                />
                {query && (
                  <button
                    onClick={() => { setQuery(''); inputRef.current?.focus() }}
                    aria-label="Clear search"
                    className="p-0.5 rounded text-gray-400 hover:text-gray-600 focus-visible:outline-2 focus-visible:outline-[#6366f1] focus-visible:outline-offset-1"
                  >
                    <X size={14} aria-hidden="true" />
                  </button>
                )}
                <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 text-[11px] text-gray-400 bg-gray-100 border border-gray-200 rounded font-mono select-none flex-shrink-0">
                  Esc
                </kbd>
              </div>

              {/* Results list */}
              <div className="max-h-80 overflow-y-auto py-2" role="listbox" aria-label="Search results">
                {filteredItems.length === 0 ? (
                  <p className="text-center text-sm text-gray-400 py-8">
                    No results for &ldquo;{query}&rdquo;
                  </p>
                ) : (
                  visibleGroups.map(group => {
                    const groupItems = filteredItems.filter(i => i.group === group)
                    return (
                      <div key={group}>
                        <p className="px-3 pt-2 pb-1 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                          {group}
                        </p>
                        {groupItems.map(item => {
                          const idx = flatItems.indexOf(item)
                          const isActive = idx === activeIndex
                          return (
                            <button
                              key={item.id}
                              role="option"
                              aria-selected={isActive}
                              onClick={() => handleSelect(item)}
                              onMouseEnter={() => setActiveIndex(idx)}
                              className={[
                                'w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors',
                                isActive
                                  ? 'bg-[#6366f1]/10 text-[#6366f1]'
                                  : 'text-gray-700 hover:bg-gray-50',
                              ].join(' ')}
                            >
                              {item.icon && (
                                <DynamicIcon
                                  name={item.icon}
                                  size={15}
                                  className={isActive ? 'text-[#6366f1]' : 'text-gray-400'}
                                />
                              )}
                              <span className="flex-1 font-medium">{item.label}</span>
                              {item.description && (
                                <span className={[
                                  'text-xs',
                                  isActive ? 'text-[#6366f1]/70' : 'text-gray-400',
                                ].join(' ')}>
                                  {item.description}
                                </span>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    )
                  })
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
