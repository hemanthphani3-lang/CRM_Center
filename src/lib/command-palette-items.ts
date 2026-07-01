export interface CommandItem {
  id: string
  label: string
  description?: string
  group: 'Navigation' | 'Actions' | 'Recent'
  href?: string
  action?: string
  icon?: string
}

export const COMMAND_ITEMS: CommandItem[] = [
  // Navigation
  { id: 'nav-dashboard', label: 'Dashboard', group: 'Navigation', href: '/dashboard', icon: 'LayoutDashboard' },
  { id: 'nav-leads', label: 'Leads', description: 'CRM', group: 'Navigation', href: '/crm/leads', icon: 'UserPlus' },
  { id: 'nav-contacts', label: 'Contacts', description: 'CRM', group: 'Navigation', href: '/crm/contacts', icon: 'Contact' },
  { id: 'nav-deals', label: 'Deals', description: 'CRM', group: 'Navigation', href: '/crm/deals', icon: 'Handshake' },
  { id: 'nav-pipelines', label: 'Pipelines', description: 'CRM', group: 'Navigation', href: '/crm/pipelines', icon: 'GitBranch' },
  { id: 'nav-tasks', label: 'Tasks', description: 'CRM', group: 'Navigation', href: '/crm/tasks', icon: 'CheckSquare' },
  { id: 'nav-calendar', label: 'Calendar', description: 'CRM', group: 'Navigation', href: '/crm/calendar', icon: 'CalendarDays' },
  { id: 'nav-whatsapp', label: 'WhatsApp', description: 'Communications', group: 'Navigation', href: '/communications/whatsapp', icon: 'MessageCircle' },
  { id: 'nav-calls', label: 'Calls', description: 'Communications', group: 'Navigation', href: '/communications/calls', icon: 'Phone' },
  { id: 'nav-emails', label: 'Emails', description: 'Communications', group: 'Navigation', href: '/communications/emails', icon: 'Mail' },
  { id: 'nav-campaigns', label: 'Campaigns', description: 'Communications', group: 'Navigation', href: '/communications/campaigns', icon: 'Megaphone' },
  { id: 'nav-ai-assistant', label: 'AI Assistant', description: 'AI', group: 'Navigation', href: '/ai/assistant', icon: 'Bot' },
  { id: 'nav-voice-agents', label: 'Voice Agents', description: 'AI', group: 'Navigation', href: '/ai/voice-agents', icon: 'Mic' },
  { id: 'nav-workflows', label: 'Workflows', description: 'Automation', group: 'Navigation', href: '/automation/workflows', icon: 'GitMerge' },
  { id: 'nav-analytics-revenue', label: 'Revenue Analytics', description: 'Analytics', group: 'Navigation', href: '/analytics/revenue', icon: 'DollarSign' },
  { id: 'nav-settings-team', label: 'Team Settings', description: 'Settings', group: 'Navigation', href: '/settings/team', icon: 'Users2' },
  { id: 'nav-settings-org', label: 'Organization Settings', description: 'Settings', group: 'Navigation', href: '/settings/organization', icon: 'Building2' },
  // Actions
  { id: 'action-new-lead', label: 'New Lead', description: 'Create a new lead', group: 'Actions', href: '/crm/leads?create=true', icon: 'Plus' },
  { id: 'action-new-contact', label: 'New Contact', description: 'Create a new contact', group: 'Actions', href: '/crm/contacts?create=true', icon: 'Plus' },
  { id: 'action-new-deal', label: 'New Deal', description: 'Create a new deal', group: 'Actions', href: '/crm/deals?create=true', icon: 'Plus' },
  { id: 'action-new-task', label: 'New Task', description: 'Create a new task', group: 'Actions', href: '/crm/tasks?create=true', icon: 'Plus' },
]
