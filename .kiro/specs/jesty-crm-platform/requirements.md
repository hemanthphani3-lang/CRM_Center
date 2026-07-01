# Requirements Document

## Introduction

Jesty CRM Platform is a premium, AI-powered customer relationship management application built for modern sales teams. It combines lead management, multi-channel communication (WhatsApp, calls, email), AI-driven voice agents, workflow automation, and analytics into a single cohesive product. The platform is inspired by the UX quality of Jesty CRM, Attio, HubSpot, Linear, and Stripe Dashboard — delivering a white/light-themed, desktop-first SaaS experience built on Next.js 15, TypeScript, TailwindCSS, ShadCN UI, Framer Motion, TanStack Query, React Hook Form, Zod, Supabase, and Recharts.

---

## Glossary

- **CRM_Platform**: The complete Jesty CRM web application.
- **Sidebar**: The persistent left navigation panel containing all primary module links.
- **Top_Nav**: The sticky horizontal bar at the top containing global search, quick actions, notifications, user profile, command palette shortcut, and create button.
- **Dashboard**: The main landing page showing KPIs, pipeline overview, activity feed, tasks, AI insights, and analytics charts.
- **Lead**: A prospective customer record in the early stage of the sales pipeline.
- **Contact**: A confirmed customer or stakeholder record with a full profile and communication history.
- **Deal**: A revenue opportunity linked to a contact or lead, tracked through pipeline stages.
- **Pipeline**: A Kanban-style board of Deal stages (New, Qualified, Proposal, Won, Lost).
- **Task**: An actionable item with a priority, due date, and assignee.
- **Calendar**: A scheduling view for meetings, follow-ups, and activities.
- **Unified_Inbox**: The WhatsApp conversation view aggregating all customer messages.
- **AI_Assistant**: The conversational AI interface for querying CRM data and generating reports.
- **Voice_Agent**: An AI-powered outbound/inbound calling agent for lead qualification and appointment booking.
- **Workflow**: An automation rule composed of a Trigger, optional Conditions, and one or more Actions.
- **Template**: A reusable message template for WhatsApp, email, or SMS.
- **Campaign**: A bulk outbound messaging sequence sent to a filtered list of Leads or Contacts.
- **Call_Summary**: An AI-generated structured summary of a recorded call.
- **Webhook**: An HTTP callback Action used in Workflow automation.
- **Command_Palette**: A keyboard-accessible overlay (⌘K / Ctrl+K) for instant navigation and action execution.
- **Skeleton_Loader**: An animated placeholder shown while data is being fetched.
- **Empty_State**: A designed illustration and call-to-action shown when a list or view has no data.
- **KPI_Card**: A top-level metric card on the Dashboard showing a number, label, trend, and icon.
- **Activity_Timeline**: A chronological log of all interactions (calls, WhatsApp, email, notes, tasks) on a Lead, Contact, or Deal record.
- **Supabase**: The backend platform providing PostgreSQL, Auth, Realtime, and Storage.
- **TanStack_Query**: The client-side data-fetching and caching library.
- **Zod**: The schema validation library used for forms and API payloads.
- **Recharts**: The charting library used for all analytics visualizations.

---

## Requirements

### Requirement 1: Application Shell and Navigation

**User Story:** As a sales team member, I want a persistent, clearly organized navigation shell, so that I can move between modules instantly without losing my place.

#### Acceptance Criteria

1. THE CRM_Platform SHALL render a fixed-width (240px expanded, 64px collapsed) Sidebar on the left side of every authenticated page.
2. THE Sidebar SHALL contain grouped navigation sections: Dashboard; CRM (Leads, Contacts, Deals, Pipelines, Tasks, Calendar); Communications (WhatsApp, Calls, Emails, Templates, Campaigns); AI (AI Assistant, Voice Agents, Call Summaries); Automation (Workflows, Triggers, Webhooks); Analytics (Revenue, Conversions, Reports); Settings (Team, Integrations, Billing, Organization).
3. THE CRM_Platform SHALL render a sticky Top_Nav bar at the top of every authenticated page, containing a global search input, a quick actions menu, a notifications bell, a user profile avatar, a Command_Palette shortcut badge (⌘K), and a prominent "Create" button.
4. WHEN a user clicks a Sidebar navigation item, THE CRM_Platform SHALL navigate to the corresponding route and highlight the active item with an accent color and bold label.
5. WHEN a user clicks the Sidebar collapse toggle, THE Sidebar SHALL animate to icon-only mode (64px) using Framer Motion and persist the state in localStorage.
6. WHEN the viewport width is below 1024px, THE CRM_Platform SHALL hide the Sidebar and expose a hamburger menu in the Top_Nav that opens a slide-over drawer containing full navigation.
7. THE CRM_Platform SHALL apply a white/light color theme with soft gray (#F5F5F7) background, 16px border radius on cards and panels, subtle box shadows (0 1px 3px rgba(0,0,0,0.08)), and Inter or Geist as the primary typeface.
8. THE CRM_Platform SHALL render Skeleton_Loaders for all data-dependent UI sections while TanStack_Query requests are in a loading state.
9. IF a page-level error occurs, THEN THE CRM_Platform SHALL render an error boundary UI with a retry action and a human-readable message rather than an unhandled crash screen.
10. THE CRM_Platform SHALL support keyboard navigation through all interactive elements with visible focus rings meeting WCAG 2.1 AA contrast requirements.

### Requirement 2: Authentication and User Session

**User Story:** As a user, I want secure, seamless authentication, so that my CRM data is protected and I can access the platform from any device.

#### Acceptance Criteria

1. THE CRM_Platform SHALL authenticate users via Supabase Auth supporting email/password sign-in and magic link sign-in.
2. WHEN an unauthenticated user navigates to any protected route, THE CRM_Platform SHALL redirect the user to the sign-in page and preserve the intended destination URL as a query parameter.
3. WHEN a user successfully signs in, THE CRM_Platform SHALL redirect the user to the Dashboard and initialize a TanStack_Query client session.
4. WHEN a user's Supabase session token expires, THE CRM_Platform SHALL silently refresh the token without requiring the user to re-enter credentials.
5. IF a sign-in attempt fails due to invalid credentials, THEN THE CRM_Platform SHALL display an inline error message validated by Zod schema and SHALL NOT expose raw error codes.
6. THE CRM_Platform SHALL support multi-tenant organization isolation so that a user's data is scoped exclusively to their organization's Supabase row-level-security policies.
7. WHEN a user signs out, THE CRM_Platform SHALL clear all TanStack_Query caches, invalidate the Supabase session, and redirect to the sign-in page.

---

### Requirement 3: Command Palette

**User Story:** As a power user, I want a keyboard-accessible command palette, so that I can navigate and execute actions without using the mouse.

#### Acceptance Criteria

1. WHEN a user presses ⌘K (macOS) or Ctrl+K (Windows/Linux), THE Command_Palette SHALL open as a centered modal overlay with a search input and grouped result list.
2. THE Command_Palette SHALL support searching across navigation routes, recent records (Leads, Contacts, Deals), and executable actions (Create Lead, Open Pipeline, Go to Settings).
3. WHEN a user types in the Command_Palette search input, THE Command_Palette SHALL display filtered results within 100ms using client-side fuzzy matching.
4. WHEN a user selects a navigation result, THE Command_Palette SHALL close and navigate to the corresponding route.
5. WHEN a user presses Escape, THE Command_Palette SHALL close without triggering any navigation or action.
6. THE Command_Palette SHALL trap focus within the modal while open and restore focus to the previously focused element on close.

---

### Requirement 4: Dashboard

**User Story:** As a sales manager, I want a comprehensive Dashboard, so that I can assess team performance and pipeline health at a glance.

#### Acceptance Criteria

1. THE Dashboard SHALL render four KPI_Cards at the top of the page showing: Total Leads (count with week-over-week trend), Active Deals (count with total pipeline value), Revenue (closed-won sum this month with month-over-month trend percentage), and Tasks Due Today (count).
2. THE Dashboard SHALL render a Pipeline Overview section displaying the count of Deals in each stage (New, Qualified, Proposal, Won, Lost) as horizontally arranged summary cards.
3. THE Dashboard SHALL render a Recent Activities feed showing the last 20 events (calls, WhatsApp messages, tasks completed, notes added) with actor name, timestamp, record link, and event icon.
4. THE Dashboard SHALL render an Upcoming Tasks panel listing the next 10 tasks sorted by due date, showing task title, assignee avatar, due date badge, and priority indicator.
5. THE Dashboard SHALL render an AI Insights Panel containing at least 3 dynamically generated insight cards (e.g., "12 leads require follow-up", "Revenue increased 18% this week", "3 deals are likely to close") with dismiss and action affordances.
6. THE Dashboard SHALL render a Revenue Trends line chart (Recharts) showing daily or weekly closed-won revenue over the last 30 days.
7. THE Dashboard SHALL render a Lead Sources doughnut chart (Recharts) showing the distribution of leads by source (Website, WhatsApp, Manual, Import, etc.).
8. THE Dashboard SHALL render a Conversion Funnel bar chart (Recharts) showing lead-to-deal conversion percentages per pipeline stage.
9. WHEN Dashboard data is loading, THE Dashboard SHALL display Skeleton_Loaders for every section simultaneously rather than sequentially.
10. WHEN the Dashboard has no data, THE Dashboard SHALL display meaningful Empty_State illustrations with onboarding call-to-action buttons for each empty section.

---

### Requirement 5: Lead Management

**User Story:** As a salesperson, I want to create, view, filter, and manage leads, so that I can track every prospective customer through the early sales process.

#### Acceptance Criteria

1. THE CRM_Platform SHALL provide a Leads list view displaying leads in a paginated table with columns: Name, Company, Status, Source, Assigned To, Created Date, and last activity timestamp.
2. THE CRM_Platform SHALL provide a Lead detail page showing full profile fields, an Activity_Timeline, Notes section, Tags, and related Deals and Tasks.
3. WHEN a user submits a Create Lead form validated by Zod schema, THE CRM_Platform SHALL persist the new Lead record to Supabase and optimistically update the Leads list via TanStack_Query.
4. THE CRM_Platform SHALL support inline editing of Lead fields (name, email, phone, company, status, source, assigned user, tags) with auto-save on blur.
5. THE CRM_Platform SHALL provide filter controls on the Leads list for Status, Source, Assigned User, Date Range, and Tags, with active filters displayed as removable chips.
6. WHEN a user searches the Leads list using the search input, THE CRM_Platform SHALL filter results by name, email, company, and phone in real time using TanStack_Query with a 300ms debounce.
7. THE CRM_Platform SHALL support bulk actions on selected leads: Assign To, Change Status, Add Tag, Delete.
8. THE CRM_Platform SHALL allow users to add timestamped Notes to a Lead from the detail page, with the note persisted to Supabase and immediately appended to the Activity_Timeline.
9. IF a Lead is deleted, THEN THE CRM_Platform SHALL display a confirmation dialog with the Lead's name before executing the delete and SHALL soft-delete the record in Supabase.
10. WHERE a Lead has no activity in the last 7 days, THE CRM_Platform SHALL display a "Follow-up needed" badge on the lead row and detail page.

---

### Requirement 6: Contact Management

**User Story:** As a salesperson, I want detailed contact profiles with full communication history, so that I can understand each customer's journey and engage them in context.

#### Acceptance Criteria

1. THE CRM_Platform SHALL provide a Contacts list view with search, filter (by company, tags, last activity), and sort controls.
2. THE CRM_Platform SHALL provide a Contact detail page containing: profile header (name, avatar, company, role, email, phone), a tabbed content area (Overview, Timeline, Tasks, Deals, Files), and a sidebar showing quick-action buttons (Send WhatsApp, Log Call, Send Email, Create Task).
3. THE CRM_Platform SHALL display a unified Activity_Timeline on each Contact page aggregating WhatsApp messages, calls, emails, notes, and task completions in reverse-chronological order.
4. WHEN a user adds a Note to a Contact, THE CRM_Platform SHALL persist the note to Supabase and render it in the Activity_Timeline with author name and timestamp within 500ms.
5. THE CRM_Platform SHALL allow users to link multiple Deals to a Contact and display linked Deals in the Contact detail page's Deals tab.
6. THE CRM_Platform SHALL support importing Contacts from a CSV file, validating each row against a Zod schema, and reporting per-row validation errors before committing to Supabase.

---

### Requirement 7: Deal Management and Pipeline

**User Story:** As a sales manager, I want a Kanban pipeline view for deals, so that my team can visually track deal progress and forecast revenue.

#### Acceptance Criteria

1. THE CRM_Platform SHALL render the Pipeline as a horizontal Kanban board with columns for each deal stage: New, Qualified, Proposal, Won, Lost.
2. WHEN a user drags a Deal card from one pipeline stage column to another, THE CRM_Platform SHALL update the Deal's stage in Supabase and animate the card movement using Framer Motion.
3. THE CRM_Platform SHALL display each Deal card with: deal title, associated contact name, deal value (formatted currency), days in current stage, and an assigned user avatar.
4. THE CRM_Platform SHALL show a stage-level summary header above each column displaying total deal count and aggregate pipeline value for that stage.
5. WHEN a user opens a Deal detail panel (slide-over), THE CRM_Platform SHALL display full deal fields, an Activity_Timeline, linked Contact, Tasks, and file attachments.
6. THE CRM_Platform SHALL support custom pipeline creation, allowing users to define pipeline names and stage labels from the Pipelines settings page.
7. WHEN a Deal is moved to "Won" stage, THE CRM_Platform SHALL prompt the user to record the closing date and final value, then update revenue analytics accordingly.
8. WHEN a Deal is moved to "Lost" stage, THE CRM_Platform SHALL prompt the user to select a loss reason from a configurable list.
9. THE CRM_Platform SHALL provide a Deal list view (table) as an alternative to the Kanban view, toggled via a view switcher in the page header.

---

### Requirement 8: Task Management

**User Story:** As a team member, I want to create and track tasks linked to leads, contacts, and deals, so that no follow-up or action item is forgotten.

#### Acceptance Criteria

1. THE CRM_Platform SHALL provide a Tasks list view showing all tasks with columns: Title, Priority, Due Date, Assigned To, Linked Record, and Status.
2. THE CRM_Platform SHALL support creating Tasks from: the Tasks list page, a Lead detail page, a Contact detail page, a Deal detail panel, and the Top_Nav "Create" button.
3. WHEN a Task is created or edited, THE CRM_Platform SHALL validate the form using a Zod schema requiring title, due date, assignee, and priority before submitting to Supabase.
4. THE CRM_Platform SHALL support task priorities: Urgent, High, Medium, Low — each rendered with a distinct color badge.
5. WHEN a Task's due date is in the past and the task is incomplete, THE CRM_Platform SHALL display the task with an "Overdue" red badge.
6. WHEN a user marks a Task as complete, THE CRM_Platform SHALL optimistically update the task status, persist to Supabase, and log the completion event in the linked record's Activity_Timeline.
7. THE CRM_Platform SHALL provide filter controls on the Tasks list for Priority, Assigned To, Due Date range, Linked Record type, and Completion status.

---

### Requirement 9: Calendar

**User Story:** As a salesperson, I want a calendar view of all meetings, follow-ups, and activities, so that I can manage my schedule without leaving the CRM.

#### Acceptance Criteria

1. THE CRM_Platform SHALL provide a Calendar page supporting month, week, and day views toggled by a view switcher in the page header.
2. THE Calendar SHALL display events representing Tasks with due dates, scheduled calls, and meetings, color-coded by event type.
3. WHEN a user clicks a calendar event, THE Calendar SHALL open a detail popover showing event title, linked record, assignee, and time, with edit and delete actions.
4. WHEN a user clicks an empty calendar slot, THE Calendar SHALL open an inline create form pre-filled with the selected date and time.
5. THE Calendar SHALL integrate with Tasks so that creating or editing a Task with a due date immediately reflects on the Calendar.

---

### Requirement 10: WhatsApp Unified Inbox

**User Story:** As a support or sales agent, I want a unified WhatsApp inbox, so that I can manage all customer conversations in one place with full context.

#### Acceptance Criteria

1. THE CRM_Platform SHALL render a WhatsApp inbox page with a two-panel layout: a left conversation list panel and a right message thread panel.
2. THE Unified_Inbox conversation list SHALL display each conversation with: contact avatar, contact name, last message preview (truncated to 60 characters), unread message count badge, and relative timestamp.
3. WHEN a user selects a conversation from the list, THE Unified_Inbox SHALL load and display the full message thread in the right panel with sender-aligned bubbles.
4. THE Unified_Inbox SHALL support sending text messages, Template messages, and file attachments from the message input area at the bottom of the thread panel.
5. WHEN a new inbound WhatsApp message is received via Supabase Realtime subscription, THE Unified_Inbox SHALL append the message to the active thread and increment the unread badge on the conversation list item without a full page reload.
6. THE CRM_Platform SHALL allow users to link a WhatsApp conversation thread to an existing Lead or Contact record, with the conversation then visible in that record's Activity_Timeline.
7. THE CRM_Platform SHALL provide a Templates sub-page under Communications where users can create, edit, and delete reusable WhatsApp message templates with variable placeholders (e.g., {{first_name}}).
8. WHEN a user sends a message using a Template, THE CRM_Platform SHALL replace all variable placeholders with the corresponding contact field values before sending.

---

### Requirement 11: Call Management

**User Story:** As a sales agent, I want to log calls and access AI-generated summaries, so that I can capture every conversation outcome without manual note-taking.

#### Acceptance Criteria

1. THE CRM_Platform SHALL provide a Calls page displaying a paginated list of all calls with columns: Contact Name, Direction (Inbound/Outbound), Duration, Date, Assigned Agent, and Summary status.
2. THE CRM_Platform SHALL allow users to manually log a call by filling a form with Contact, Direction, Duration, Date, Outcome, and optional Notes fields.
3. WHEN a call record has an associated AI summary, THE CRM_Platform SHALL display a "View Summary" action in the call list row and a full Call_Summary panel on the call detail page.
4. THE Call_Summary panel SHALL display: call metadata (contact, date, duration, agent), a structured summary (key topics, outcomes, next steps), and a sentiment indicator (Positive, Neutral, Negative).
5. THE CRM_Platform SHALL log all call events (manual and AI-generated) to the linked Contact's or Lead's Activity_Timeline.

---

### Requirement 12: Email Management

**User Story:** As a salesperson, I want to send and track emails from within the CRM, so that all customer email communications are captured in one place.

#### Acceptance Criteria

1. THE CRM_Platform SHALL provide an Emails page displaying a threaded inbox view of all tracked email conversations.
2. THE CRM_Platform SHALL allow users to compose and send emails to Contacts directly from the Emails page and from any Contact detail page.
3. WHEN an email is sent or received for a Contact, THE CRM_Platform SHALL log the email event to that Contact's Activity_Timeline.
4. THE CRM_Platform SHALL support email Templates with variable placeholders, managed from the Templates sub-page under Communications.
5. THE CRM_Platform SHALL track email open and link-click events and display open/click status badges on each sent email in the thread view.

---

### Requirement 13: Campaign Management

**User Story:** As a marketing or sales manager, I want to create and send broadcast campaigns, so that I can reach many leads or contacts at once with personalized messages.

#### Acceptance Criteria

1. THE CRM_Platform SHALL provide a Campaigns page listing all campaigns with columns: Name, Channel (WhatsApp/Email), Status (Draft, Scheduled, Sent), Recipient Count, and Sent Date.
2. WHEN a user creates a Campaign, THE CRM_Platform SHALL require selection of: channel, template, recipient list (filter-based segment of Leads or Contacts), and optional scheduled send time.
3. THE CRM_Platform SHALL validate the campaign form with Zod schema before persisting to Supabase, ensuring all required fields are present.
4. WHEN a Campaign is sent, THE CRM_Platform SHALL track per-recipient delivery status and display aggregate delivery, open, and reply rates on the Campaign detail page.
5. IF a Campaign send fails for one or more recipients, THEN THE CRM_Platform SHALL log the failure reason per recipient and display a failure summary without aborting the entire campaign.

---

### Requirement 14: AI Assistant

**User Story:** As a sales manager, I want a conversational AI assistant embedded in the CRM, so that I can query data, generate reports, and get customer insights using natural language.

#### Acceptance Criteria

1. THE CRM_Platform SHALL provide an AI Assistant page with a conversational chat interface styled consistently with the overall design system.
2. THE AI_Assistant SHALL accept natural language queries such as "How many leads came in this week?", "Summarize contact John Smith", and "Which deals are at risk?".
3. WHEN the AI_Assistant processes a query, THE CRM_Platform SHALL display a typing indicator animation and render the response as structured markdown within 5 seconds for typical queries.
4. THE AI_Assistant SHALL support follow-up questions within the same conversation thread, maintaining context from prior messages in the session.
5. THE AI_Assistant responses SHALL include actionable links to relevant CRM records (e.g., a referenced Lead or Deal) rendered as inline chips.
6. THE CRM_Platform SHALL persist AI_Assistant conversation history per user in Supabase and display the most recent 20 conversation turns on page load.

---

### Requirement 15: Voice Agents

**User Story:** As a sales team, I want AI-powered voice agents that can call leads, qualify prospects, and book appointments, so that the team's capacity is extended without additional headcount.

#### Acceptance Criteria

1. THE CRM_Platform SHALL provide a Voice Agents configuration page where users can create and manage Voice_Agent profiles with configurable scripts, qualification questions, and fallback behavior.
2. THE CRM_Platform SHALL allow users to trigger a Voice_Agent call for a specific Lead from the Lead detail page or from the Voice Agents page.
3. WHEN a Voice_Agent call is completed, THE CRM_Platform SHALL generate a Call_Summary and log the call event in the Lead's Activity_Timeline within 60 seconds of call end.
4. THE CRM_Platform SHALL display Voice_Agent call outcomes (Qualified, Not Interested, Voicemail, No Answer, Appointment Booked) as selectable result labels on the call record.
5. THE CRM_Platform SHALL provide a Call Summaries sub-page listing all AI-generated summaries with filter controls for date range, agent, outcome, and contact.

---

### Requirement 16: Workflow Automation

**User Story:** As a sales operations manager, I want to build automated workflows, so that repetitive manual steps are executed automatically and consistently.

#### Acceptance Criteria

1. THE CRM_Platform SHALL provide a Workflows page listing all automation workflows with columns: Name, Trigger, Status (Active/Inactive), Last Executed, and Run Count.
2. THE CRM_Platform SHALL support a visual workflow builder where users add a Trigger step followed by Condition and Action steps in sequence.
3. THE CRM_Platform SHALL support the following Trigger types: New Lead Created, Lead Status Changed, Deal Stage Changed, Inbound WhatsApp Received, Call Completed, Task Due, and Scheduled Time.
4. THE CRM_Platform SHALL support the following Action types: Send WhatsApp Message (using a Template), Send Email (using a Template), Create Task, Assign Lead to User, Update Lead Status, Update Deal Stage, Send Webhook (POST to a configured URL).
5. THE CRM_Platform SHALL support Condition steps that evaluate Lead, Contact, or Deal field values using operators: equals, not equals, contains, greater than, less than, is empty, is not empty.
6. WHEN a Workflow is triggered and all Conditions evaluate to true, THE CRM_Platform SHALL execute all Actions in sequence and log the execution event with timestamp and outcome.
7. IF a Workflow Action fails (e.g., webhook returns non-2xx), THEN THE CRM_Platform SHALL log the failure with error details and SHALL NOT silently skip the failure.
8. THE CRM_Platform SHALL support enabling and disabling individual Workflows without deleting them.

---

### Requirement 17: Analytics

**User Story:** As a sales manager, I want detailed analytics on revenue, lead sources, conversions, and team performance, so that I can make data-driven decisions.

#### Acceptance Criteria

1. THE CRM_Platform SHALL provide a Revenue Analytics page with a Recharts line chart of closed-won deal value over time, filterable by date range (7d, 30d, 90d, custom).
2. THE CRM_Platform SHALL provide a Lead Sources page with a Recharts doughnut chart showing distribution of leads by source and a supporting data table.
3. THE CRM_Platform SHALL provide a Conversion Rates page with a Recharts funnel or bar chart showing the percentage of leads that progress through each pipeline stage.
4. THE CRM_Platform SHALL provide a Team Performance page displaying per-user metrics: deals won, revenue closed, calls made, tasks completed, and leads assigned.
5. THE CRM_Platform SHALL provide a Communication Analytics page showing WhatsApp message volume, email open rates, call volume, and response rate trends over time.
6. WHEN a user applies a date range filter on any Analytics page, THE CRM_Platform SHALL refresh all charts and data tables for that page within 2 seconds.
7. THE CRM_Platform SHALL allow users to export data tables on Analytics pages to CSV format.

---

### Requirement 18: Settings

**User Story:** As an organization admin, I want to configure the platform's team, integrations, billing, and organization settings, so that the CRM is tailored to our business needs.

#### Acceptance Criteria

1. THE CRM_Platform SHALL provide a Team settings page where admins can invite new team members via email, assign roles (Admin, Manager, Agent), and deactivate existing members.
2. THE CRM_Platform SHALL provide an Integrations settings page listing available integration connections (WhatsApp Business API, email provider, calendar) with connect/disconnect controls.
3. THE CRM_Platform SHALL provide a Billing settings page showing current plan, usage metrics, and an upgrade path.
4. THE CRM_Platform SHALL provide an Organization settings page for editing organization name, logo, timezone, and currency.
5. WHEN an admin invites a team member, THE CRM_Platform SHALL send a Supabase Auth invitation email and display the member in a "Pending" state until the invitation is accepted.
6. WHEN an admin changes a team member's role, THE CRM_Platform SHALL update Supabase RLS policies and reflect the change immediately in the Team settings UI.

---

### Requirement 19: Global Search

**User Story:** As a user, I want to search across all CRM records from anywhere in the platform, so that I can find any Lead, Contact, Deal, or Task instantly.

#### Acceptance Criteria

1. THE CRM_Platform SHALL render a global search input in the Top_Nav that, when focused, opens a full-width search overlay.
2. WHEN a user types at least 2 characters in the global search input, THE CRM_Platform SHALL query Supabase for matching Leads, Contacts, Deals, and Tasks and display grouped results within 400ms.
3. THE CRM_Platform SHALL display each search result with a type badge (Lead, Contact, Deal, Task), the matched name, and a secondary detail line (e.g., company name for contacts, stage for deals).
4. WHEN a user selects a search result, THE CRM_Platform SHALL navigate to the corresponding record detail page and close the search overlay.
5. THE CRM_Platform SHALL highlight the matched query substring within each result item.

---

### Requirement 20: Performance and Accessibility

**User Story:** As any user, I want the platform to load quickly and be accessible, so that I can work efficiently regardless of network conditions or assistive technology use.

#### Acceptance Criteria

1. THE CRM_Platform SHALL achieve a Lighthouse Performance score of 85 or above on the Dashboard and Leads list pages.
2. THE CRM_Platform SHALL use Next.js 15 App Router server components for initial data fetching where applicable, reducing client-side bundle waterfall.
3. THE CRM_Platform SHALL lazy-load Recharts and other heavy client components using Next.js dynamic imports with Skeleton_Loader fallbacks.
4. THE CRM_Platform SHALL meet WCAG 2.1 Level AA requirements for color contrast, keyboard navigation, focus management, and ARIA labeling across all interactive components.
5. THE CRM_Platform SHALL support screen readers by providing descriptive aria-label attributes on all icon-only buttons, charts, and status badges.
6. THE CRM_Platform SHALL use TanStack_Query's staleTime and cacheTime configuration to minimize redundant network requests during typical navigation patterns.
