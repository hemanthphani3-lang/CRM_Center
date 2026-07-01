'use client'

import { createClient } from './supabase/client'

const isSupabaseConfigured = typeof window !== 'undefined' && 
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Jesty CRM Client-side Mock Database
// Synchronizes with window.localStorage to persist all user modifications,
// enabling a complete, responsive product demo with zero backend overhead.

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company: string
  status: 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted'
  source: 'website' | 'whatsapp' | 'manual' | 'import' | 'referral' | 'social' | 'other'
  value: number
  assignedTo: string
  tags: string[]
  notes: string
  createdAt: string
  lastActivityAt: string
}

export interface Contact {
  id: string
  name: string
  email: string
  phone: string
  company: string
  role: string
  avatarUrl?: string
  tags: string[]
  createdAt: string
  lastActivityAt: string
}

export interface Deal {
  id: string
  title: string
  value: number
  stageId: 'stage-1' | 'stage-2' | 'stage-3' | 'stage-4' | 'stage-5' // New, Qualified, Proposal, Won, Lost
  contactId?: string
  leadId?: string
  closingDate: string
  assignedTo: string
  lossReason?: string
  createdAt: string
}

export interface Task {
  id: string
  title: string
  description?: string
  priority: 'urgent' | 'high' | 'medium' | 'low'
  status: 'pending' | 'completed'
  dueDate: string
  assignedTo: string
  linkedType?: 'lead' | 'contact' | 'deal'
  linkedId?: string
  createdAt: string
}

export interface WhatsAppMessage {
  id: string
  conversationId: string
  direction: 'inbound' | 'outbound'
  content: string
  senderId?: string
  status: 'sent' | 'delivered' | 'read' | 'failed'
  createdAt: string
}

export interface WhatsAppConversation {
  id: string
  phone: string
  name: string
  unreadCount: number
  lastMessageAt: string
  leadId?: string
  contactId?: string
}

export interface CallLog {
  id: string
  phone: string
  name: string
  direction: 'inbound' | 'outbound'
  duration: number // in seconds
  outcome: 'connected' | 'voicemail' | 'no_answer' | 'busy' | 'failed'
  aiOutcome: 'qualified' | 'not_interested' | 'voicemail' | 'no_answer' | 'appointment_booked'
  summaryText: string
  sentiment: 'positive' | 'neutral' | 'negative'
  transcript: { speaker: string; text: string; time: string }[]
  createdAt: string
}

export interface EmailThread {
  id: string
  contactId: string
  subject: string
  lastMessageAt: string
  messages: {
    id: string
    direction: 'inbound' | 'outbound'
    fromAddress: string
    toAddress: string
    body: string
    isOpened: boolean
    isClicked: boolean
    createdAt: string
  }[]
}

export interface WorkflowNode {
  id: string
  type: 'trigger' | 'condition' | 'action'
  label: string
  config: Record<string, any>
  position: { x: number; y: number }
}

export interface Workflow {
  id: string
  name: string
  isActive: boolean
  triggerType: string
  nodes: WorkflowNode[]
  runCount: number
  lastExecutedAt?: string
  createdAt: string
}

export interface TeamMember {
  id: string
  fullName: string
  email: string
  role: 'admin' | 'manager' | 'agent'
  avatarUrl?: string
  isActive: boolean
  createdAt: string
}

export interface Organization {
  id: string
  name: string
  slug: string
  brandColor: string // hex
  timezone: string
  currency: string
  logoUrl?: string
}

// Initial Seed Data Configuration
const INITIAL_ORGANIZATION: Organization = {
  id: 'org-acme',
  name: 'My Workspace',
  slug: 'workspace',
  brandColor: '#7c3aed', // violet-600
  timezone: 'UTC',
  currency: 'USD'
}

const INITIAL_TEAM: TeamMember[] = []
const INITIAL_LEADS: Lead[] = []
const INITIAL_CONTACTS: Contact[] = []
const INITIAL_DEALS: Deal[] = []
const INITIAL_TASKS: Task[] = []
const INITIAL_WHATSAPP_CONVERSATIONS: WhatsAppConversation[] = []
const INITIAL_WHATSAPP_MESSAGES: WhatsAppMessage[] = []
const INITIAL_CALLS: CallLog[] = []
const INITIAL_EMAILS: EmailThread[] = []
const INITIAL_WORKFLOWS: Workflow[] = []

// Helper to map stage translations
const mapStageIdToDb = (stageId: string) => {
  const map: Record<string, string> = {
    'stage-1': 'new',
    'stage-2': 'qualified',
    'stage-3': 'proposal',
    'stage-4': 'won',
    'stage-5': 'lost'
  }
  return map[stageId] || 'new'
}

const mapDbToStageId = (stage: string) => {
  const map: Record<string, string> = {
    'new': 'stage-1',
    'qualified': 'stage-2',
    'proposal': 'stage-3',
    'won': 'stage-4',
    'lost': 'stage-5'
  }
  return map[stage] || 'stage-1'
}

// Background push sync helpers
const pushLead = async (lead: Lead) => {
  if (!isSupabaseConfigured) return
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const isMock = lead.id.startsWith('ld-')
    const payload: any = {
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      status: lead.status,
      source: lead.source,
      tags: lead.tags,
      notes: lead.notes,
      last_activity_at: lead.lastActivityAt || new Date().toISOString()
    }
    if (!isMock) {
      payload.id = lead.id
    }

    const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', session.user.id).maybeSingle()
    if (profile && profile.org_id) {
      payload.org_id = profile.org_id
      const { data, error } = await supabase.from('leads').upsert(payload).select()
      if (error) {
        console.error('Supabase leads push error:', error)
      } else if (data && data[0] && isMock) {
        const leads = JSON.parse(localStorage.getItem('jesty_leads') || '[]') as Lead[]
        const next = leads.map(l => l.id === lead.id ? { ...l, id: data[0].id } : l)
        localStorage.setItem('jesty_leads', JSON.stringify(next))
        window.dispatchEvent(new Event('jesty_db_synced'))
      }
    }
  } catch (err) {
    console.error(err)
  }
}

const pushContact = async (contact: Contact) => {
  if (!isSupabaseConfigured) return
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const isMock = contact.id.startsWith('ct-')
    const payload: any = {
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      company: contact.company,
      role: contact.role,
      avatar_url: contact.avatarUrl,
      tags: contact.tags,
      last_activity_at: contact.lastActivityAt || new Date().toISOString()
    }
    if (!isMock) {
      payload.id = contact.id
    }

    const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', session.user.id).maybeSingle()
    if (profile && profile.org_id) {
      payload.org_id = profile.org_id
      const { data, error } = await supabase.from('contacts').upsert(payload).select()
      if (error) {
        console.error('Supabase contacts push error:', error)
      } else if (data && data[0] && isMock) {
        const contacts = JSON.parse(localStorage.getItem('jesty_contacts') || '[]') as Contact[]
        const next = contacts.map(c => c.id === contact.id ? { ...c, id: data[0].id } : c)
        localStorage.setItem('jesty_contacts', JSON.stringify(next))
        window.dispatchEvent(new Event('jesty_db_synced'))
      }
    }
  } catch (err) {
    console.error(err)
  }
}

const pushDeal = async (deal: Deal) => {
  if (!isSupabaseConfigured) return
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const isMock = deal.id.startsWith('dl-')
    let contactId = deal.contactId
    let leadId = deal.leadId

    if (contactId && contactId.startsWith('ct-')) contactId = undefined
    if (leadId && leadId.startsWith('ld-')) leadId = undefined

    const payload: any = {
      title: deal.title,
      value: deal.value,
      stage: mapStageIdToDb(deal.stageId),
      contact_id: contactId,
      lead_id: leadId,
      closing_date: deal.closingDate,
      loss_reason: deal.lossReason
    }
    if (!isMock) {
      payload.id = deal.id
    }

    const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', session.user.id).maybeSingle()
    if (profile && profile.org_id) {
      payload.org_id = profile.org_id
      const { data, error } = await supabase.from('deals').upsert(payload).select()
      if (error) {
        console.error('Supabase deals push error:', error)
      } else if (data && data[0] && isMock) {
        const deals = JSON.parse(localStorage.getItem('jesty_deals') || '[]') as Deal[]
        const next = deals.map(d => d.id === deal.id ? { ...d, id: data[0].id } : d)
        localStorage.setItem('jesty_deals', JSON.stringify(next))
        window.dispatchEvent(new Event('jesty_db_synced'))
      }
    }
  } catch (err) {
    console.error(err)
  }
}

const pushTask = async (task: Task) => {
  if (!isSupabaseConfigured) return
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const isMock = task.id.startsWith('tk-')
    let linkedId = task.linkedId
    if (linkedId && (linkedId.startsWith('ld-') || linkedId.startsWith('ct-') || linkedId.startsWith('dl-'))) {
      linkedId = undefined
    }

    const payload: any = {
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      due_date: task.dueDate,
      linked_type: task.linkedType,
      linked_id: linkedId
    }
    if (!isMock) {
      payload.id = task.id
    }

    const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', session.user.id).maybeSingle()
    if (profile && profile.org_id) {
      payload.org_id = profile.org_id
      const { data, error } = await supabase.from('tasks').upsert(payload).select()
      if (error) {
        console.error('Supabase tasks push error:', error)
      } else if (data && data[0] && isMock) {
        const tasks = JSON.parse(localStorage.getItem('jesty_tasks') || '[]') as Task[]
        const next = tasks.map(t => t.id === task.id ? { ...t, id: data[0].id } : t)
        localStorage.setItem('jesty_tasks', JSON.stringify(next))
        window.dispatchEvent(new Event('jesty_db_synced'))
      }
    }
  } catch (err) {
    console.error(err)
  }
}

const pushOrg = async (org: Organization) => {
  if (!isSupabaseConfigured) return
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', session.user.id).maybeSingle()
    if (profile && profile.org_id) {
      const { error } = await supabase.from('organizations').update({
        name: org.name,
        slug: org.slug,
        timezone: org.timezone,
        currency: org.currency
      }).eq('id', profile.org_id)
      if (error) console.error('Supabase organization update error:', error)
    }
  } catch (err) {
    console.error(err)
  }
}

let isSyncingInitialized = false

// Database Access Methods
export const db = {
  // Local storage management
  initialize: () => {
    if (typeof window === 'undefined') return
    if (!localStorage.getItem('jesty_initialized')) {
      localStorage.setItem('jesty_org', JSON.stringify(INITIAL_ORGANIZATION))
      localStorage.setItem('jesty_team', JSON.stringify(INITIAL_TEAM))
      localStorage.setItem('jesty_leads', JSON.stringify(INITIAL_LEADS))
      localStorage.setItem('jesty_contacts', JSON.stringify(INITIAL_CONTACTS))
      localStorage.setItem('jesty_deals', JSON.stringify(INITIAL_DEALS))
      localStorage.setItem('jesty_tasks', JSON.stringify(INITIAL_TASKS))
      localStorage.setItem('jesty_whatsapp_conv', JSON.stringify(INITIAL_WHATSAPP_CONVERSATIONS))
      localStorage.setItem('jesty_whatsapp_msg', JSON.stringify(INITIAL_WHATSAPP_MESSAGES))
      localStorage.setItem('jesty_calls', JSON.stringify(INITIAL_CALLS))
      localStorage.setItem('jesty_emails', JSON.stringify(INITIAL_EMAILS))
      localStorage.setItem('jesty_workflows', JSON.stringify(INITIAL_WORKFLOWS))
      localStorage.setItem('jesty_integrations', JSON.stringify({ whatsapp: true, twilio: false, deepgram: true }))
      localStorage.setItem('jesty_initialized', 'true')
    }

    if (isSyncingInitialized) return
    isSyncingInitialized = true

    // Trigger asynchronous Supabase Pull Sync
    if (isSupabaseConfigured) {
      const supabase = createClient()
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (!session) return
        try {
          // 1. Fetch organization
          const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', session.user.id).maybeSingle()
          if (profile && profile.org_id) {
            const { data: orgData } = await supabase.from('organizations').select('*').eq('id', profile.org_id).maybeSingle()
            if (orgData) {
              const localOrg = JSON.parse(localStorage.getItem('jesty_org') || '{}')
              const nextOrg: Organization = {
                id: orgData.id,
                name: orgData.name,
                slug: orgData.slug,
                brandColor: localOrg.brandColor || '#7c3aed', // brandColor stored client-side
                timezone: orgData.timezone || 'UTC',
                currency: orgData.currency || 'USD',
                logoUrl: orgData.logo_url || undefined
              }
              localStorage.setItem('jesty_org', JSON.stringify(nextOrg))
            }
          }

          // 2. Fetch leads
          const { data: leadsData } = await supabase.from('leads').select('*')
          if (leadsData) {
            const nextLeads: Lead[] = leadsData.map(l => ({
              id: l.id,
              name: l.name,
              email: l.email || '',
              phone: l.phone || '',
              company: l.company || '',
              status: l.status as any,
              source: l.source as any,
              value: 0,
              assignedTo: 'Sarah Connor',
              tags: l.tags || [],
              notes: l.notes || '',
              createdAt: l.created_at || '',
              lastActivityAt: l.last_activity_at || ''
            }))
            localStorage.setItem('jesty_leads', JSON.stringify(nextLeads))
          }

          // 3. Fetch contacts
          const { data: contactsData } = await supabase.from('contacts').select('*')
          if (contactsData) {
            const nextContacts: Contact[] = contactsData.map(c => ({
              id: c.id,
              name: c.name,
              email: c.email || '',
              phone: c.phone || '',
              company: c.company || '',
              role: c.role || '',
              avatarUrl: c.avatar_url || undefined,
              tags: c.tags || [],
              createdAt: c.created_at || '',
              lastActivityAt: c.last_activity_at || ''
            }))
            localStorage.setItem('jesty_contacts', JSON.stringify(nextContacts))
          }

          // 4. Fetch deals
          const { data: dealsData } = await supabase.from('deals').select('*')
          if (dealsData) {
            const nextDeals: Deal[] = dealsData.map(d => ({
              id: d.id,
              title: d.title,
              value: Number(d.value) || 0,
              stageId: mapDbToStageId(d.stage || 'new') as any,
              contactId: d.contact_id || undefined,
              leadId: d.lead_id || undefined,
              closingDate: d.closing_date || '',
              assignedTo: 'Sarah Connor',
              lossReason: d.loss_reason || undefined,
              createdAt: d.created_at || ''
            }))
            localStorage.setItem('jesty_deals', JSON.stringify(nextDeals))
          }

          // 5. Fetch tasks
          const { data: tasksData } = await supabase.from('tasks').select('*')
          if (tasksData) {
            const nextTasks: Task[] = tasksData.map(t => ({
              id: t.id,
              title: t.title,
              description: t.description || undefined,
              priority: t.priority as any,
              status: t.status as any,
              dueDate: t.due_date || '',
              assignedTo: 'Sarah Connor',
              linkedType: t.linked_type as any,
              linkedId: t.linked_id || undefined,
              createdAt: t.created_at || ''
            }))
            localStorage.setItem('jesty_tasks', JSON.stringify(nextTasks))
          }

          window.dispatchEvent(new Event('jesty_db_synced'))
          window.dispatchEvent(new Event('jesty_branding_changed'))
        } catch (err) {
          console.error('Supabase pull sync error:', err)
        }
      })
    }
  },

  reset: () => {
    if (typeof window === 'undefined') return
    localStorage.removeItem('jesty_initialized')
    isSyncingInitialized = false
    db.initialize()
  },

  // Organization
  getOrg: (): Organization => {
    db.initialize()
    if (typeof window === 'undefined') return INITIAL_ORGANIZATION
    const raw = localStorage.getItem('jesty_org')
    return raw ? JSON.parse(raw) : INITIAL_ORGANIZATION
  },
  saveOrg: (org: Organization) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('jesty_org', JSON.stringify(org))
    window.dispatchEvent(new Event('jesty_branding_changed'))
    pushOrg(org)
  },

  // Team members
  getTeam: (): TeamMember[] => {
    db.initialize()
    if (typeof window === 'undefined') return INITIAL_TEAM
    const raw = localStorage.getItem('jesty_team')
    return raw ? JSON.parse(raw) : INITIAL_TEAM
  },
  saveTeam: (team: TeamMember[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('jesty_team', JSON.stringify(team))
  },

  // Leads
  getLeads: (): Lead[] => {
    db.initialize()
    if (typeof window === 'undefined') return INITIAL_LEADS
    const raw = localStorage.getItem('jesty_leads')
    return raw ? JSON.parse(raw) : INITIAL_LEADS
  },
  saveLeads: (leads: Lead[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('jesty_leads', JSON.stringify(leads))
    leads.forEach(pushLead)
  },

  // Contacts
  getContacts: (): Contact[] => {
    db.initialize()
    if (typeof window === 'undefined') return INITIAL_CONTACTS
    const raw = localStorage.getItem('jesty_contacts')
    return raw ? JSON.parse(raw) : INITIAL_CONTACTS
  },
  saveContacts: (contacts: Contact[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('jesty_contacts', JSON.stringify(contacts))
    contacts.forEach(pushContact)
  },

  // Deals
  getDeals: (): Deal[] => {
    db.initialize()
    if (typeof window === 'undefined') return INITIAL_DEALS
    const raw = localStorage.getItem('jesty_deals')
    return raw ? JSON.parse(raw) : INITIAL_DEALS
  },
  saveDeals: (deals: Deal[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('jesty_deals', JSON.stringify(deals))
    deals.forEach(pushDeal)
  },

  // Tasks
  getTasks: (): Task[] => {
    db.initialize()
    if (typeof window === 'undefined') return INITIAL_TASKS
    const raw = localStorage.getItem('jesty_tasks')
    return raw ? JSON.parse(raw) : INITIAL_TASKS
  },
  saveTasks: (tasks: Task[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('jesty_tasks', JSON.stringify(tasks))
    tasks.forEach(pushTask)
  },

  // WhatsApp Conversations
  getWhatsAppConversations: (): WhatsAppConversation[] => {
    db.initialize()
    if (typeof window === 'undefined') return INITIAL_WHATSAPP_CONVERSATIONS
    const raw = localStorage.getItem('jesty_whatsapp_conv')
    return raw ? JSON.parse(raw) : INITIAL_WHATSAPP_CONVERSATIONS
  },
  saveWhatsAppConversations: (convs: WhatsAppConversation[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('jesty_whatsapp_conv', JSON.stringify(convs))
  },

  // WhatsApp Messages
  getWhatsAppMessages: (): WhatsAppMessage[] => {
    db.initialize()
    if (typeof window === 'undefined') return INITIAL_WHATSAPP_MESSAGES
    const raw = localStorage.getItem('jesty_whatsapp_msg')
    return raw ? JSON.parse(raw) : INITIAL_WHATSAPP_MESSAGES
  },
  saveWhatsAppMessages: (msgs: WhatsAppMessage[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('jesty_whatsapp_msg', JSON.stringify(msgs))
  },

  // Calls
  getCalls: (): CallLog[] => {
    db.initialize()
    if (typeof window === 'undefined') return INITIAL_CALLS
    const raw = localStorage.getItem('jesty_calls')
    return raw ? JSON.parse(raw) : INITIAL_CALLS
  },
  saveCalls: (calls: CallLog[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('jesty_calls', JSON.stringify(calls))
  },

  // Emails
  getEmails: (): EmailThread[] => {
    db.initialize()
    if (typeof window === 'undefined') return INITIAL_EMAILS
    const raw = localStorage.getItem('jesty_emails')
    return raw ? JSON.parse(raw) : INITIAL_EMAILS
  },
  saveEmails: (emails: EmailThread[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('jesty_emails', JSON.stringify(emails))
  },

  // Workflows
  getWorkflows: (): Workflow[] => {
    db.initialize()
    if (typeof window === 'undefined') return INITIAL_WORKFLOWS
    const raw = localStorage.getItem('jesty_workflows')
    return raw ? JSON.parse(raw) : INITIAL_WORKFLOWS
  },
  saveWorkflows: (workflows: Workflow[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('jesty_workflows', JSON.stringify(workflows))
  },

  // Integrations
  getIntegrations: (): { whatsapp: boolean; twilio: boolean; deepgram: boolean } => {
    db.initialize()
    if (typeof window === 'undefined') return { whatsapp: true, twilio: false, deepgram: true }
    const raw = localStorage.getItem('jesty_integrations')
    return raw ? JSON.parse(raw) : { whatsapp: true, twilio: false, deepgram: true }
  },
  saveIntegrations: (integrations: { whatsapp: boolean; twilio: boolean; deepgram: boolean }) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('jesty_integrations', JSON.stringify(integrations))
  }
}
