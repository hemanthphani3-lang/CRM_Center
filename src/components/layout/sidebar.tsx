'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, UserPlus, Contact, Handshake, GitBranch,
  CheckSquare, CalendarDays, MessageCircle, Phone, Mail,
  FileText, Megaphone, Bot, Mic, FileAudio, GitMerge,
  Zap, Webhook, DollarSign, TrendingUp, FileBarChart,
  Users2, Plug, CreditCard, Building2, ChevronLeft, ChevronRight,
} from 'lucide-react'

const STORAGE_KEY = 'crm-sidebar-collapsed'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const NAV_STRUCTURE: (NavItem | NavGroup)[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  {
    title: 'CRM',
    items: [
      { label: 'Leads', href: '/crm/leads', icon: UserPlus },
      { label: 'Contacts', href: '/crm/contacts', icon: Contact },
      { label: 'Deals', href: '/crm/deals', icon: Handshake },
      { label: 'Pipelines', href: '/crm/pipelines', icon: GitBranch },
      { label: 'Tasks', href: '/crm/tasks', icon: CheckSquare },
      { label: 'Calendar', href: '/crm/calendar', icon: CalendarDays },
    ],
  },
  {
    title: 'Communications',
    items: [
      { label: 'WhatsApp', href: '/communications/whatsapp', icon: MessageCircle },
      { label: 'Calls', href: '/communications/calls', icon: Phone },
      { label: 'Emails', href: '/communications/emails', icon: Mail },
      { label: 'Templates', href: '/communications/templates', icon: FileText },
      { label: 'Campaigns', href: '/communications/campaigns', icon: Megaphone },
    ],
  },
  {
    title: 'AI',
    items: [
      { label: 'AI Assistant', href: '/ai/assistant', icon: Bot },
      { label: 'Voice Agents', href: '/ai/voice-agents', icon: Mic },
      { label: 'Call Summaries', href: '/ai/call-summaries', icon: FileAudio },
    ],
  },
  {
    title: 'Automation',
    items: [
      { label: 'Workflows', href: '/automation/workflows', icon: GitMerge },
      { label: 'Triggers', href: '/automation/triggers', icon: Zap },
      { label: 'Webhooks', href: '/automation/webhooks', icon: Webhook },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { label: 'Revenue', href: '/analytics/revenue', icon: DollarSign },
      { label: 'Conversions', href: '/analytics/conversions', icon: TrendingUp },
      { label: 'Reports', href: '/analytics/reports', icon: FileBarChart },
    ],
  },
  {
    title: 'Settings',
    items: [
      { label: 'Team', href: '/settings/team', icon: Users2 },
      { label: 'Integrations', href: '/settings/integrations', icon: Plug },
      { label: 'Billing', href: '/settings/billing', icon: CreditCard },
      { label: 'Organization', href: '/settings/organization', icon: Building2 },
    ],
  },
]

function isNavGroup(item: NavItem | NavGroup): item is NavGroup {
  return 'items' in item
}

function NavLink({
  item,
  collapsed,
}: {
  item: NavItem
  collapsed: boolean
}) {
  const pathname = usePathname()
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      aria-label={item.label}
      aria-current={isActive ? 'page' : undefined}
      className={[
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2',
        isActive
          ? 'bg-brand-light text-brand font-semibold'
          : 'text-gray-600 hover:bg-gray-100',
      ].join(' ')}
    >
      <Icon size={18} className="flex-shrink-0" aria-hidden="true" />
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden whitespace-nowrap"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  )
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null) setCollapsed(stored === 'true')
    setMounted(true)
  }, [])

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem(STORAGE_KEY, String(next))
      return next
    })
  }

  if (!mounted) return <div style={{ width: 240 }} />

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="flex flex-col h-full bg-white border-r border-gray-200 overflow-hidden flex-shrink-0"
      aria-label="Main navigation"
    >
      {/* Logo + toggle */}
      <div className="flex items-center justify-between h-14 px-3 border-b border-gray-200 flex-shrink-0">
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="font-bold text-brand text-lg whitespace-nowrap overflow-hidden"
            >
              CRM Center
            </motion.span>
          )}
        </AnimatePresence>
        <button
          onClick={toggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
          className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 flex-shrink-0"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-1">
        {NAV_STRUCTURE.map((entry, i) => {
          if (!isNavGroup(entry)) {
            return <NavLink key={entry.href} item={entry} collapsed={collapsed} />
          }
          return (
            <div key={entry.title} className={i > 0 ? 'pt-2' : ''}>
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider"
                  >
                    {entry.title}
                  </motion.p>
                )}
              </AnimatePresence>
              {collapsed && <div className="border-t border-gray-100 my-1" />}
              <div className="space-y-0.5">
                {entry.items.map((item) => (
                  <NavLink key={item.href} item={item} collapsed={collapsed} />
                ))}
              </div>
            </div>
          )
        })}
      </nav>
    </motion.aside>
  )
}
