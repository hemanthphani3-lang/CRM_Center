'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, LayoutDashboard, UserPlus, Contact, Handshake, GitBranch,
  CheckSquare, CalendarDays, MessageCircle, Phone, Mail,
  FileText, Megaphone, Bot, Mic, FileAudio, GitMerge,
  Zap, Webhook, DollarSign, TrendingUp, FileBarChart,
  Users2, Plug, CreditCard, Building2,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const NAV: (NavItem | NavGroup)[] = [
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

function isGroup(entry: NavItem | NavGroup): entry is NavGroup {
  return 'items' in entry
}

interface MobileNavProps {
  open: boolean
  onClose: () => void
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 lg:hidden"
            aria-hidden="true"
            onClick={onClose}
          />

          {/* Slide-over panel */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl flex flex-col lg:hidden"
            aria-label="Mobile navigation"
          >
            {/* Header */}
            <div className="flex items-center justify-between h-14 px-4 border-b border-gray-200 flex-shrink-0">
              <span className="font-bold text-[#6366f1] text-lg">CRM Center</span>
              <button
                onClick={onClose}
                aria-label="Close navigation menu"
                className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-[#6366f1] focus-visible:outline-offset-2"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            {/* Nav items */}
            <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
              {NAV.map((entry, i) => {
                if (!isGroup(entry)) {
                  const isActive = pathname === entry.href
                  const Icon = entry.icon
                  return (
                    <Link
                      key={entry.href}
                      href={entry.href}
                      onClick={onClose}
                      aria-current={isActive ? 'page' : undefined}
                      className={[
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2',
                        isActive
                          ? 'bg-[#6366f1]/10 text-[#6366f1] font-semibold'
                          : 'text-gray-600 hover:bg-gray-100',
                      ].join(' ')}
                    >
                      <Icon size={18} className="flex-shrink-0" aria-hidden="true" />
                      {entry.label}
                    </Link>
                  )
                }
                return (
                  <div key={entry.title} className={i > 0 ? 'pt-2' : ''}>
                    <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {entry.title}
                    </p>
                    <div className="space-y-0.5">
                      {entry.items.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            aria-current={isActive ? 'page' : undefined}
                            className={[
                              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2',
                              isActive
                                ? 'bg-[#6366f1]/10 text-[#6366f1] font-semibold'
                                : 'text-gray-600 hover:bg-gray-100',
                            ].join(' ')}
                          >
                            <Icon size={18} className="flex-shrink-0" aria-hidden="true" />
                            {item.label}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
