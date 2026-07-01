# Implementation Plan: Jesty CRM Platform

## Overview

A premium AI-powered CRM platform built on Next.js 15, TypeScript, TailwindCSS, ShadCN UI, Framer Motion, TanStack Query, React Hook Form, Zod, Supabase, and Recharts. The implementation follows a feature-based architecture with sequential tasks from project setup through full feature implementation and final polish.

## Tasks

- [x] 1. Project Setup and Infrastructure
  - [x] 1.1 Initialize Next.js 15 app with TypeScript and App Router in the workspace root directory
  - [x] 1.2 Install and configure TailwindCSS with custom theme tokens including 16px border radius, Inter font, and F5F5F7 background color
  - [x] 1.3 Install and initialize ShadCN UI component library with all required components
  - [x] 1.4 Install Framer Motion, TanStack Query v5, React Hook Form, Zod, Recharts, dnd-kit core and sortable packages
  - [x] 1.5 Install Supabase client packages and configure environment variables from .env.local
  - [x] 1.6 Create feature-based folder structure under src/features for all CRM modules
  - [x] 1.7 Create shared directories for components, lib, hooks, and types
  - [x] 1.8 Set up TanStack Query QueryClientProvider in root layout
  - [x] 1.9 Configure tsconfig.json path aliases mapping @/ to src/
  - _Requirements: 1, 2, 20_

- [x] 2. Supabase Database Schema and Types
  - [x] 2.1 Create organizations and profiles tables with multi-tenant RLS
  - [x] 2.2 Create leads table with all CRM fields and RLS policy
  - [x] 2.3 Create contacts table with profile fields and RLS policy
  - [x] 2.4 Create deals, pipelines, and pipeline_stages tables
  - [x] 2.5 Create tasks table with priority, due_date, linked record fields
  - [x] 2.6 Create activities table for unified timeline events
  - [x] 2.7 Create whatsapp_conversations and whatsapp_messages tables
  - [x] 2.8 Create calls table with AI summary fields
  - [x] 2.9 Create emails and email_threads tables with open/click tracking
  - [x] 2.10 Create templates and campaigns tables
  - [x] 2.11 Create workflows, workflow_steps, workflow_executions tables
  - [x] 2.12 Create ai_conversations and ai_messages tables
  - [x] 2.13 Write org-scoped RLS policies for all tables
  - [x] 2.14 Generate TypeScript type definitions at src/types/database.ts
  - _Requirements: 2, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17_

- [x] 3. Authentication System
  - [x] 3.1 Create src/lib/supabase/server.ts and client.ts SSR helper utilities
  - [x] 3.2 Create Next.js middleware.ts protecting all routes except /sign-in and /sign-up
  - [x] 3.3 Build /sign-in page with email/password and magic link tabs (React Hook Form + Zod)
  - [x] 3.4 Build /sign-up page with organization creation form and validation
  - [x] 3.5 Implement /auth/callback route handler for OAuth and magic link
  - [x] 3.6 Create useAuth hook and AuthProvider wrapping the app
  - [x] 3.7 Handle sign-out: clear TanStack Query cache, invalidate session, redirect to /sign-in
  - _Requirements: 2_

- [x] 4. Application Shell — Sidebar and Top Navigation
  - [x] 4.1 Create AppLayout component wrapping sidebar + top nav + main content
  - [x] 4.2 Build Sidebar with 240px expanded / 64px collapsed Framer Motion animation, localStorage persistence
  - [x] 4.3 Implement all sidebar navigation groups with icons (Dashboard, CRM, Communications, AI, Automation, Analytics, Settings)
  - [x] 4.4 Implement active route highlighting with accent color and bold label
  - [x] 4.5 Build responsive mobile hamburger menu + Framer Motion slide-over drawer for viewports < 1024px
  - [x] 4.6 Build TopNav with global search input, quick actions dropdown, notifications bell, user avatar, Ctrl+K badge, Create button
  - [x] 4.7 Apply design tokens across all shell components (colors, radius, shadows, typography)
  - [x] 4.8 Implement global ErrorBoundary with retry action
  - [x] 4.9 Create SkeletonCard, SkeletonTable, SkeletonText reusable loader components
  - [x] 4.10 Ensure WCAG 2.1 AA focus rings on all interactive elements
  - _Requirements: 1_

- [ ] 5. Command Palette
  - [ ] 5.1 Create CommandPalette component as ShadCN Dialog centered overlay
  - [ ] 5.2 Register global Ctrl+K / Cmd+K keyboard listener in AppLayout
  - [ ] 5.3 Build fuzzy client-side search with grouped results: Navigation, Recent Records, Actions
  - [ ] 5.4 Implement focus trap and Escape-to-close behavior
  - [ ] 5.5 Wire navigation results to Next.js router and close on selection
  - _Requirements: 3_

- [ ] 6. Dashboard Page
  - [ ] 6.1 Create TanStack Query hooks for all dashboard data sources
  - [ ] 6.2 Build KPICard component with count, label, trend arrow, icon, and skeleton state
  - [ ] 6.3 Render 4-card KPI row: Total Leads, Active Deals, Revenue, Tasks Due Today
  - [ ] 6.4 Build Pipeline Overview with 5 stage cards (New, Qualified, Proposal, Won, Lost)
  - [ ] 6.5 Build Recent Activities feed (last 20 events, actor, timestamp, record link, icon)
  - [ ] 6.6 Build Upcoming Tasks panel (next 10 tasks, assignee avatar, due date badge, priority)
  - [ ] 6.7 Build AI Insights Panel with 3+ insight cards, dismiss and action buttons
  - [ ] 6.8 Build Revenue Trends Recharts LineChart (last 30 days, custom tooltip)
  - [ ] 6.9 Build Lead Sources Recharts DonutChart with legend
  - [ ] 6.10 Build Conversion Funnel Recharts BarChart per pipeline stage
  - [ ] 6.11 Implement simultaneous skeleton loaders for all sections
  - [ ] 6.12 Implement empty states with onboarding CTAs for each section
  - _Requirements: 4_

- [ ] 7. Lead Management
  - [ ] 7.1 Create Supabase query hooks: useLeads, useLead, useCreateLead, useUpdateLead, useDeleteLead, useBulkUpdateLeads
  - [ ] 7.2 Build Leads list page with paginated table (Name, Company, Status, Source, Assigned To, Created, Last Activity)
  - [ ] 7.3 Build filter bar with Status, Source, Assigned User, Date Range, Tags and removable chips
  - [ ] 7.4 Implement real-time search with 300ms debounce across name/email/company/phone
  - [ ] 7.5 Build Create Lead slide-over form with React Hook Form + Zod validation
  - [ ] 7.6 Build Lead detail page with profile fields and inline editing with auto-save on blur
  - [ ] 7.7 Build ActivityTimeline component for chronological event display
  - [ ] 7.8 Build Notes section with add, persist to Supabase, and append to timeline
  - [ ] 7.9 Build Tags multi-select input with create-on-type capability
  - [ ] 7.10 Implement bulk actions toolbar (Assign To, Change Status, Add Tag, Delete)
  - [ ] 7.11 Add Follow-up needed badge for leads with no activity in 7+ days
  - [ ] 7.12 Implement soft-delete confirmation dialog with lead name
  - _Requirements: 5_

- [ ] 8. Contact Management
  - [ ] 8.1 Create Supabase query hooks: useContacts, useContact, useCreateContact, useUpdateContact, useImportContacts
  - [ ] 8.2 Build Contacts list page with search, filter (company, tags, last activity), sort controls
  - [ ] 8.3 Build Contact detail page with profile header (name, avatar/initials fallback, company, role, email, phone)
  - [ ] 8.4 Build tabbed content area: Overview, Timeline, Tasks, Deals, Files
  - [ ] 8.5 Build sidebar quick-action buttons: Send WhatsApp, Log Call, Send Email, Create Task
  - [ ] 8.6 Build unified ActivityTimeline aggregating all interaction types in reverse-chronological order
  - [ ] 8.7 Build Notes add/edit within Contact Timeline
  - [ ] 8.8 Build Deals tab showing linked deals with stage badge and value
  - [ ] 8.9 Build CSV import flow with Zod row validation and per-row error table
  - _Requirements: 6_

- [ ] 9. Deal Management and Pipeline
  - [ ] 9.1 Create Supabase query hooks: useDeals, useDeal, useCreateDeal, useUpdateDeal, useMoveDeals, usePipelines
  - [ ] 9.2 Build Kanban board with horizontally scrollable columns per stage
  - [ ] 9.3 Implement @dnd-kit drag-and-drop with optimistic Supabase update and Framer Motion animation
  - [ ] 9.4 Build DealCard (title, contact name, formatted value, days-in-stage, assignee avatar)
  - [ ] 9.5 Build stage column headers with deal count badge and aggregate value
  - [ ] 9.6 Build Deal detail slide-over panel (full fields, timeline, linked contact, tasks, files)
  - [ ] 9.7 Build Won modal prompting closing date and final value
  - [ ] 9.8 Build Lost modal with configurable loss reason dropdown
  - [ ] 9.9 Build Deal list view (table) with view switcher toggle
  - [ ] 9.10 Build Pipelines settings sub-page for custom pipeline and stage creation
  - _Requirements: 7_

- [ ] 10. Task Management
  - [ ] 10.1 Create Supabase query hooks: useTasks, useCreateTask, useUpdateTask, useCompleteTask
  - [ ] 10.2 Build Tasks list page with table (Title, Priority, Due Date, Assigned To, Linked Record, Status)
  - [ ] 10.3 Build Create/Edit Task slide-over form (React Hook Form + Zod, all required fields)
  - [ ] 10.4 Implement priority color badges: Urgent red, High orange, Medium yellow, Low green
  - [ ] 10.5 Implement Overdue red badge for past-due incomplete tasks
  - [ ] 10.6 Implement optimistic task completion with TanStack Query and timeline activity logging
  - [ ] 10.7 Build filter bar: Priority, Assigned To, Due Date range, Linked Record type, Status
  - [ ] 10.8 Enable task creation from Lead, Contact, Deal pages and Top Nav Create button
  - _Requirements: 8_

- [ ] 11. Calendar
  - [ ] 11.1 Install react-big-calendar and date-fns
  - [ ] 11.2 Build Calendar page with month/week/day view switcher in page header
  - [ ] 11.3 Display tasks, calls, meetings as color-coded events by type
  - [ ] 11.4 Build event detail Popover with title, linked record, assignee, time, Edit and Delete actions
  - [ ] 11.5 Build inline create form on empty slot click pre-filled with date/time
  - [ ] 11.6 Sync task create/edit mutations to calendar in real time
  - _Requirements: 9_

- [ ] 12. WhatsApp Unified Inbox
  - [ ] 12.1 Create Supabase query hooks: useConversations, useMessages, useSendMessage
  - [ ] 12.2 Set up Supabase Realtime subscription on whatsapp_messages for active conversation
  - [ ] 12.3 Build two-panel layout: 320px conversation list + full-width message thread
  - [ ] 12.4 Build ConversationListItem (avatar, name, last message preview, unread badge, timestamp)
  - [ ] 12.5 Build MessageThread with sender-right / receiver-left chat bubbles
  - [ ] 12.6 Build message input area (text field, template picker popover, file attachment, send button)
  - [ ] 12.7 Append inbound Realtime messages without full page reload; update unread badges
  - [ ] 12.8 Build Contact Linking UI to associate thread with Lead/Contact record
  - [ ] 12.9 Build Templates sub-page with create/edit/delete and variable placeholder editor
  - [ ] 12.10 Implement template variable substitution before send
  - _Requirements: 10_

- [ ] 13. Call Management
  - [ ] 13.1 Create Supabase query hooks: useCalls, useCall, useCreateCall
  - [ ] 13.2 Build Calls list page (Contact Name, Direction, Duration, Date, Agent, Summary status)
  - [ ] 13.3 Build manual Log Call slide-over form (Contact, Direction, Duration, Date, Outcome, Notes)
  - [ ] 13.4 Build CallSummaryPanel (metadata, Key Topics / Outcomes / Next Steps, sentiment badge)
  - [ ] 13.5 Log call events to linked Contact/Lead ActivityTimeline
  - _Requirements: 11_

- [ ] 14. Email Management
  - [ ] 14.1 Create Supabase query hooks: useEmailThreads, useEmails, useSendEmail
  - [ ] 14.2 Build Emails page with two-panel threaded inbox
  - [ ] 14.3 Build ComposeEmail modal (To, Subject, Body, Template picker)
  - [ ] 14.4 Log email events to Contact ActivityTimeline
  - [ ] 14.5 Display open/click status badges on sent emails
  - _Requirements: 12_

- [ ] 15. Campaign Management
  - [ ] 15.1 Create Supabase query hooks: useCampaigns, useCreateCampaign, useCampaignDelivery
  - [ ] 15.2 Build Campaigns list page (Name, Channel, Status, Recipient Count, Sent Date)
  - [ ] 15.3 Build 3-step campaign creation wizard (channel+template, recipient segment, schedule)
  - [ ] 15.4 Validate each wizard step with Zod before advancing
  - [ ] 15.5 Build Campaign detail page with delivery/open/reply aggregate stats and per-recipient table
  - [ ] 15.6 Display per-recipient failure summary
  - _Requirements: 13_

- [ ] 16. AI Assistant
  - [ ] 16.1 Build AI Assistant page with full-height chat interface (sticky header, scrollable messages, fixed input)
  - [ ] 16.2 Build ChatMessage bubbles for user (right, accent bg) and assistant (left, white card, markdown)
  - [ ] 16.3 Implement TypingIndicator animation (three bouncing dots)
  - [ ] 16.4 Maintain conversation context across follow-up messages in session
  - [ ] 16.5 Render inline CRM record chips in AI responses linking to record detail pages
  - [ ] 16.6 Load and persist conversation history via Supabase ai_messages table
  - [ ] 16.7 Wire to AI API endpoint with realistic mock responses as fallback
  - _Requirements: 14_

- [ ] 17. Voice Agents
  - [ ] 17.1 Build Voice Agents list/config page (name, status, script summary, call count)
  - [ ] 17.2 Build Create/Edit Voice Agent form (name, script, qualification questions, fallback)
  - [ ] 17.3 Build Trigger Call UI from Lead detail and Voice Agents pages
  - [ ] 17.4 Display call outcome labels as color badges (Qualified, Not Interested, Voicemail, No Answer, Appointment Booked)
  - [ ] 17.5 Build Call Summaries sub-page with filters (date range, agent, outcome, contact)
  - _Requirements: 15_

- [ ] 18. Workflow Automation
  - [ ] 18.1 Build Workflows list page (Name, Trigger, Status toggle, Last Executed, Run Count)
  - [ ] 18.2 Build visual workflow builder with sequential step cards (Trigger → Conditions → Actions)
  - [ ] 18.3 Implement all Trigger step types (New Lead, Lead Status Changed, Deal Stage Changed, Inbound WhatsApp, Call Completed, Task Due, Scheduled Time)
  - [ ] 18.4 Implement all Action step types (Send WhatsApp, Send Email, Create Task, Assign Lead, Update Status, Update Stage, Send Webhook)
  - [ ] 18.5 Implement Condition step with field/operator/value selectors
  - [ ] 18.6 Build WorkflowExecutionLog panel showing run history with outcomes and errors
  - [ ] 18.7 Implement Active/Inactive toggle per workflow
  - [ ] 18.8 Build Triggers list page and Webhooks configuration page
  - _Requirements: 16_

- [ ] 19. Analytics Module
  - [ ] 19.1 Create TanStack Query hooks for all analytics data sources
  - [ ] 19.2 Build Revenue Analytics page (LineChart, 7d/30d/90d/custom date filter)
  - [ ] 19.3 Build Lead Sources page (DonutChart + data table)
  - [ ] 19.4 Build Conversion Rates page (BarChart per pipeline stage)
  - [ ] 19.5 Build Team Performance page (per-user metrics table)
  - [ ] 19.6 Build Communication Analytics page (WhatsApp volume, email opens, calls, response rates)
  - [ ] 19.7 Implement date range filter refreshing all charts within 2 seconds
  - [ ] 19.8 Add Export to CSV on all data tables
  - [ ] 19.9 Build Reports summary hub page
  - _Requirements: 17_

- [ ] 20. Settings Module
  - [ ] 20.1 Build Team settings page with member table, Invite Member form (email + role)
  - [ ] 20.2 Send Supabase Auth invitation email and show Pending badge until accepted
  - [ ] 20.3 Build Integrations page with connect/disconnect cards per integration
  - [ ] 20.4 Build Billing page with current plan, usage metrics, upgrade CTA
  - [ ] 20.5 Build Organization settings page (name, logo upload via Supabase Storage, timezone, currency)
  - [ ] 20.6 Implement role change updating Supabase user metadata and reflecting in UI immediately
  - _Requirements: 18_

- [ ] 21. Global Search
  - [ ] 21.1 Build SearchOverlay as full-width dropdown triggered on TopNav input focus
  - [ ] 21.2 Query Supabase for Leads, Contacts, Deals, Tasks on 2+ character input (top 5 per type)
  - [ ] 21.3 Build grouped result list with type badge, name, secondary detail line
  - [ ] 21.4 Implement matched substring highlighting in result items
  - [ ] 21.5 Navigate to record detail page on result click and close overlay
  - [ ] 21.6 Ensure full results render within 400ms
  - _Requirements: 19_

- [ ] 22. Polish, Performance, and Accessibility
  - [ ] 22.1 Audit and complete empty state designs (SVG illustration, heading, description, CTA) for every list/board
  - [ ] 22.2 Audit skeleton loaders — verify simultaneous rendering with no sequential waterfall
  - [ ] 22.3 Verify WCAG 2.1 AA focus rings on all interactive elements
  - [ ] 22.4 Add aria-label, aria-expanded, role attributes across Sidebar, TopNav, modals, tables
  - [ ] 22.5 Implement Next.js dynamic imports with skeleton fallbacks for heavy feature modules
  - [ ] 22.6 Apply next/image with width/height/alt for all avatars and logos
  - [ ] 22.7 Verify Framer Motion animations run smoothly (sidebar collapse, drag, slide-overs, transitions)
  - [ ] 22.8 Final responsive pass: mobile drawer, tablet stacked, desktop full layout
  - [ ] 22.9 Apply React.memo to DealCard, ConversationListItem, ActivityTimelineItem; useMemo for filtered lists
  - [ ] 22.10 Ensure all forms show loading spinners on submit and inline error messages on failure
  - _Requirements: 1, 20_

## Task Dependency Graph

```json
{
  "waves": [
    { "wave": 1, "tasks": ["1. Project Setup and Infrastructure"] },
    { "wave": 2, "tasks": ["2. Supabase Database Schema and Types"] },
    { "wave": 3, "tasks": ["3. Authentication System"] },
    { "wave": 4, "tasks": ["4. Application Shell — Sidebar and Top Navigation"] },
    { "wave": 5, "tasks": ["5. Command Palette", "6. Dashboard Page", "7. Lead Management", "8. Contact Management", "10. Task Management", "16. AI Assistant", "18. Workflow Automation", "19. Analytics Module", "20. Settings Module", "21. Global Search"] },
    { "wave": 6, "tasks": ["9. Deal Management and Pipeline", "11. Calendar", "12. WhatsApp Unified Inbox", "13. Call Management", "14. Email Management", "17. Voice Agents"] },
    { "wave": 7, "tasks": ["15. Campaign Management"] },
    { "wave": 8, "tasks": ["22. Polish, Performance, and Accessibility"] }
  ]
}
```

## Notes

- All pages must use TanStack Query for data fetching with proper loading/error/empty states.
- All forms must use React Hook Form with Zod validation.
- All mutations should use optimistic updates where appropriate.
- Supabase Realtime is used for the WhatsApp inbox live message subscription.
- Design tokens (colors, radius, shadows, typography) are defined in tailwind.config.ts and reused everywhere.
- The project workspace root is `y:\hemanth projects 1\pil`.
- The .env.local file already exists at the workspace root with Supabase credentials.
