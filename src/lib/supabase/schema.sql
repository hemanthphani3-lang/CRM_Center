-- ============================================================
-- Jesty CRM Platform — Full Database Schema
-- ============================================================

-- 2.1 Organizations
create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  logo_url text,
  timezone text default 'UTC',
  currency text default 'USD',
  created_at timestamptz default now()
);

-- 2.1 Profiles
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  org_id uuid references organizations(id) on delete cascade,
  full_name text,
  avatar_url text,
  role text check (role in ('admin','manager','agent')) default 'agent',
  email text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 2.2 Leads
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade not null,
  name text not null,
  email text,
  phone text,
  company text,
  status text check (status in ('new','contacted','qualified','unqualified','converted')) default 'new',
  source text check (source in ('website','whatsapp','manual','import','referral','social','other')) default 'manual',
  assigned_to uuid references profiles(id),
  tags text[] default '{}',
  notes text,
  last_activity_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2.3 Contacts
create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade not null,
  name text not null,
  email text,
  phone text,
  company text,
  role text,
  avatar_url text,
  tags text[] default '{}',
  last_activity_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2.4 Pipelines
create table if not exists pipelines (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade not null,
  name text not null,
  is_default boolean default false,
  created_at timestamptz default now()
);

-- 2.4 Pipeline Stages
create table if not exists pipeline_stages (
  id uuid primary key default gen_random_uuid(),
  pipeline_id uuid references pipelines(id) on delete cascade not null,
  name text not null,
  position integer not null,
  color text default '#6366f1'
);

-- 2.4 Deals
create table if not exists deals (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade not null,
  title text not null,
  contact_id uuid references contacts(id),
  lead_id uuid references leads(id),
  pipeline_id uuid references pipelines(id),
  stage text check (stage in ('new','qualified','proposal','won','lost')) default 'new',
  value numeric(12,2) default 0,
  currency text default 'USD',
  closing_date date,
  loss_reason text,
  assigned_to uuid references profiles(id),
  stage_entered_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2.5 Tasks
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade not null,
  title text not null,
  description text,
  priority text check (priority in ('urgent','high','medium','low')) default 'medium',
  status text check (status in ('pending','completed')) default 'pending',
  due_date timestamptz,
  assigned_to uuid references profiles(id),
  linked_type text check (linked_type in ('lead','contact','deal')),
  linked_id uuid,
  completed_at timestamptz,
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2.6 Activities (unified timeline)
create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade not null,
  type text check (type in ('note','call','whatsapp','email','task_completed','deal_created','lead_created','status_changed','stage_changed')) not null,
  actor_id uuid references profiles(id),
  linked_type text check (linked_type in ('lead','contact','deal')),
  linked_id uuid,
  data jsonb default '{}',
  created_at timestamptz default now()
);

-- 2.7 WhatsApp Conversations
create table if not exists whatsapp_conversations (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade not null,
  contact_id uuid references contacts(id),
  lead_id uuid references leads(id),
  phone_number text not null,
  contact_name text,
  unread_count integer default 0,
  last_message_at timestamptz,
  created_at timestamptz default now()
);

-- 2.7 WhatsApp Messages
create table if not exists whatsapp_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references whatsapp_conversations(id) on delete cascade not null,
  org_id uuid references organizations(id) on delete cascade not null,
  direction text check (direction in ('inbound','outbound')) not null,
  message_type text check (message_type in ('text','template','image','file')) default 'text',
  content text not null,
  template_id uuid,
  status text check (status in ('sent','delivered','read','failed')) default 'sent',
  sender_id uuid references profiles(id),
  created_at timestamptz default now()
);

-- 2.8 Calls
create table if not exists calls (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade not null,
  contact_id uuid references contacts(id),
  lead_id uuid references leads(id),
  direction text check (direction in ('inbound','outbound')) not null,
  duration_seconds integer,
  outcome text check (outcome in ('connected','voicemail','no_answer','busy','failed')),
  ai_outcome text check (ai_outcome in ('qualified','not_interested','voicemail','no_answer','appointment_booked')),
  assigned_to uuid references profiles(id),
  summary_text text,
  summary_topics jsonb,
  summary_outcomes jsonb,
  summary_next_steps jsonb,
  sentiment text check (sentiment in ('positive','neutral','negative')),
  has_summary boolean default false,
  notes text,
  called_at timestamptz default now(),
  created_at timestamptz default now()
);

-- 2.9 Email Threads
create table if not exists email_threads (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade not null,
  contact_id uuid references contacts(id),
  subject text not null,
  last_message_at timestamptz,
  created_at timestamptz default now()
);

-- 2.9 Emails
create table if not exists emails (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid references email_threads(id) on delete cascade not null,
  org_id uuid references organizations(id) on delete cascade not null,
  direction text check (direction in ('inbound','outbound')) not null,
  from_address text,
  to_address text,
  body text,
  template_id uuid,
  is_opened boolean default false,
  is_clicked boolean default false,
  opened_at timestamptz,
  clicked_at timestamptz,
  sent_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- 2.10 Templates
create table if not exists templates (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade not null,
  name text not null,
  channel text check (channel in ('whatsapp','email')) not null,
  subject text,
  body text not null,
  variables jsonb default '[]',
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2.10 Campaigns
create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade not null,
  name text not null,
  channel text check (channel in ('whatsapp','email')) not null,
  template_id uuid references templates(id),
  status text check (status in ('draft','scheduled','sending','sent','failed')) default 'draft',
  recipient_count integer default 0,
  delivered_count integer default 0,
  opened_count integer default 0,
  replied_count integer default 0,
  scheduled_at timestamptz,
  sent_at timestamptz,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- 2.10 Campaign Recipients
create table if not exists campaign_recipients (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references campaigns(id) on delete cascade not null,
  contact_id uuid references contacts(id),
  lead_id uuid references leads(id),
  status text check (status in ('pending','sent','delivered','opened','replied','failed')) default 'pending',
  failure_reason text,
  sent_at timestamptz,
  created_at timestamptz default now()
);

-- 2.11 Workflows
create table if not exists workflows (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade not null,
  name text not null,
  trigger_type text not null,
  is_active boolean default true,
  run_count integer default 0,
  last_executed_at timestamptz,
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2.11 Workflow Steps
create table if not exists workflow_steps (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid references workflows(id) on delete cascade not null,
  step_type text check (step_type in ('trigger','condition','action')) not null,
  position integer not null,
  config jsonb default '{}'
);

-- 2.11 Workflow Executions
create table if not exists workflow_executions (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid references workflows(id) on delete cascade not null,
  org_id uuid references organizations(id) on delete cascade not null,
  status text check (status in ('running','completed','failed')) not null,
  trigger_data jsonb default '{}',
  error_details text,
  started_at timestamptz default now(),
  completed_at timestamptz
);

-- 2.12 AI Conversations
create table if not exists ai_conversations (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade not null,
  user_id uuid references profiles(id) not null,
  created_at timestamptz default now()
);

-- 2.12 AI Messages
create table if not exists ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references ai_conversations(id) on delete cascade not null,
  role text check (role in ('user','assistant')) not null,
  content text not null,
  created_at timestamptz default now()
);

-- ============================================================
-- 2.13 Row Level Security Policies
-- ============================================================

-- organizations
alter table organizations enable row level security;
drop policy if exists "organizations_own" on organizations;
create policy "organizations_own" on organizations
  using (id = (select org_id from profiles where id = auth.uid()));

-- profiles
alter table profiles enable row level security;
drop policy if exists "profiles_own_org" on profiles;
create policy "profiles_own_org" on profiles
  using (org_id = (select org_id from profiles where id = auth.uid()));

-- leads
alter table leads enable row level security;
drop policy if exists "leads_org_isolation" on leads;
create policy "leads_org_isolation" on leads
  using (org_id = (select org_id from profiles where id = auth.uid()));

-- contacts
alter table contacts enable row level security;
drop policy if exists "contacts_org_isolation" on contacts;
create policy "contacts_org_isolation" on contacts
  using (org_id = (select org_id from profiles where id = auth.uid()));

-- pipelines
alter table pipelines enable row level security;
drop policy if exists "pipelines_org_isolation" on pipelines;
create policy "pipelines_org_isolation" on pipelines
  using (org_id = (select org_id from profiles where id = auth.uid()));

-- pipeline_stages (no org_id; scoped via pipeline)
alter table pipeline_stages enable row level security;
drop policy if exists "pipeline_stages_org_isolation" on pipeline_stages;
create policy "pipeline_stages_org_isolation" on pipeline_stages
  using (pipeline_id in (
    select id from pipelines
    where org_id = (select org_id from profiles where id = auth.uid())
  ));

-- deals
alter table deals enable row level security;
drop policy if exists "deals_org_isolation" on deals;
create policy "deals_org_isolation" on deals
  using (org_id = (select org_id from profiles where id = auth.uid()));

-- tasks
alter table tasks enable row level security;
drop policy if exists "tasks_org_isolation" on tasks;
create policy "tasks_org_isolation" on tasks
  using (org_id = (select org_id from profiles where id = auth.uid()));

-- activities
alter table activities enable row level security;
drop policy if exists "activities_org_isolation" on activities;
create policy "activities_org_isolation" on activities
  using (org_id = (select org_id from profiles where id = auth.uid()));

-- whatsapp_conversations
alter table whatsapp_conversations enable row level security;
drop policy if exists "whatsapp_conversations_org_isolation" on whatsapp_conversations;
create policy "whatsapp_conversations_org_isolation" on whatsapp_conversations
  using (org_id = (select org_id from profiles where id = auth.uid()));

-- whatsapp_messages
alter table whatsapp_messages enable row level security;
drop policy if exists "whatsapp_messages_org_isolation" on whatsapp_messages;
create policy "whatsapp_messages_org_isolation" on whatsapp_messages
  using (org_id = (select org_id from profiles where id = auth.uid()));

-- calls
alter table calls enable row level security;
drop policy if exists "calls_org_isolation" on calls;
create policy "calls_org_isolation" on calls
  using (org_id = (select org_id from profiles where id = auth.uid()));

-- email_threads
alter table email_threads enable row level security;
drop policy if exists "email_threads_org_isolation" on email_threads;
create policy "email_threads_org_isolation" on email_threads
  using (org_id = (select org_id from profiles where id = auth.uid()));

-- emails
alter table emails enable row level security;
drop policy if exists "emails_org_isolation" on emails;
create policy "emails_org_isolation" on emails
  using (org_id = (select org_id from profiles where id = auth.uid()));

-- templates
alter table templates enable row level security;
drop policy if exists "templates_org_isolation" on templates;
create policy "templates_org_isolation" on templates
  using (org_id = (select org_id from profiles where id = auth.uid()));

-- campaigns
alter table campaigns enable row level security;
drop policy if exists "campaigns_org_isolation" on campaigns;
create policy "campaigns_org_isolation" on campaigns
  using (org_id = (select org_id from profiles where id = auth.uid()));

-- campaign_recipients (scoped via campaign)
alter table campaign_recipients enable row level security;
drop policy if exists "campaign_recipients_org_isolation" on campaign_recipients;
create policy "campaign_recipients_org_isolation" on campaign_recipients
  using (campaign_id in (
    select id from campaigns
    where org_id = (select org_id from profiles where id = auth.uid())
  ));

-- workflows
alter table workflows enable row level security;
drop policy if exists "workflows_org_isolation" on workflows;
create policy "workflows_org_isolation" on workflows
  using (org_id = (select org_id from profiles where id = auth.uid()));

-- workflow_steps (scoped via workflow)
alter table workflow_steps enable row level security;
drop policy if exists "workflow_steps_org_isolation" on workflow_steps;
create policy "workflow_steps_org_isolation" on workflow_steps
  using (workflow_id in (
    select id from workflows
    where org_id = (select org_id from profiles where id = auth.uid())
  ));

-- workflow_executions
alter table workflow_executions enable row level security;
drop policy if exists "workflow_executions_org_isolation" on workflow_executions;
create policy "workflow_executions_org_isolation" on workflow_executions
  using (org_id = (select org_id from profiles where id = auth.uid()));

-- ai_conversations
alter table ai_conversations enable row level security;
drop policy if exists "ai_conversations_org_isolation" on ai_conversations;
create policy "ai_conversations_org_isolation" on ai_conversations
  using (org_id = (select org_id from profiles where id = auth.uid()));

-- ai_messages (scoped via conversation)
alter table ai_messages enable row level security;
drop policy if exists "ai_messages_org_isolation" on ai_messages;
create policy "ai_messages_org_isolation" on ai_messages
  using (conversation_id in (
    select id from ai_conversations
    where org_id = (select org_id from profiles where id = auth.uid())
  ));
