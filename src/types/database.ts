// Auto-generated types from Supabase schema
// Project: xeiwxjfhgsdzejidjyuj (pil)
// DO NOT EDIT — regenerate with: supabase gen types --linked > src/types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          actor_id: string | null
          created_at: string | null
          data: Json | null
          id: string
          linked_id: string | null
          linked_type: string | null
          org_id: string
          type: string
        }
        Insert: {
          actor_id?: string | null
          created_at?: string | null
          data?: Json | null
          id?: string
          linked_id?: string | null
          linked_type?: string | null
          org_id: string
          type: string
        }
        Update: {
          actor_id?: string | null
          created_at?: string | null
          data?: Json | null
          id?: string
          linked_id?: string | null
          linked_type?: string | null
          org_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_conversations: {
        Row: {
          created_at: string | null
          id: string
          org_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          org_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          org_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_conversations_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      calls: {
        Row: {
          ai_outcome: string | null
          assigned_to: string | null
          called_at: string | null
          contact_id: string | null
          created_at: string | null
          direction: string
          duration_seconds: number | null
          has_summary: boolean | null
          id: string
          lead_id: string | null
          notes: string | null
          org_id: string
          outcome: string | null
          sentiment: string | null
          summary_next_steps: Json | null
          summary_outcomes: Json | null
          summary_text: string | null
          summary_topics: Json | null
        }
        Insert: {
          ai_outcome?: string | null
          assigned_to?: string | null
          called_at?: string | null
          contact_id?: string | null
          created_at?: string | null
          direction: string
          duration_seconds?: number | null
          has_summary?: boolean | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          org_id: string
          outcome?: string | null
          sentiment?: string | null
          summary_next_steps?: Json | null
          summary_outcomes?: Json | null
          summary_text?: string | null
          summary_topics?: Json | null
        }
        Update: {
          ai_outcome?: string | null
          assigned_to?: string | null
          called_at?: string | null
          contact_id?: string | null
          created_at?: string | null
          direction?: string
          duration_seconds?: number | null
          has_summary?: boolean | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          org_id?: string
          outcome?: string | null
          sentiment?: string | null
          summary_next_steps?: Json | null
          summary_outcomes?: Json | null
          summary_text?: string | null
          summary_topics?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "calls_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calls_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calls_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calls_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_recipients: {
        Row: {
          campaign_id: string
          contact_id: string | null
          created_at: string | null
          failure_reason: string | null
          id: string
          lead_id: string | null
          sent_at: string | null
          status: string | null
        }
        Insert: {
          campaign_id: string
          contact_id?: string | null
          created_at?: string | null
          failure_reason?: string | null
          id?: string
          lead_id?: string | null
          sent_at?: string | null
          status?: string | null
        }
        Update: {
          campaign_id?: string
          contact_id?: string | null
          created_at?: string | null
          failure_reason?: string | null
          id?: string
          lead_id?: string | null
          sent_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_recipients_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_recipients_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_recipients_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          channel: string
          created_at: string | null
          created_by: string | null
          delivered_count: number | null
          id: string
          name: string
          opened_count: number | null
          org_id: string
          recipient_count: number | null
          replied_count: number | null
          scheduled_at: string | null
          sent_at: string | null
          status: string | null
          template_id: string | null
        }
        Insert: {
          channel: string
          created_at?: string | null
          created_by?: string | null
          delivered_count?: number | null
          id?: string
          name: string
          opened_count?: number | null
          org_id: string
          recipient_count?: number | null
          replied_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          template_id?: string | null
        }
        Update: {
          channel?: string
          created_at?: string | null
          created_by?: string | null
          delivered_count?: number | null
          id?: string
          name?: string
          opened_count?: number | null
          org_id?: string
          recipient_count?: number | null
          replied_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string | null
          email: string | null
          id: string
          last_activity_at: string | null
          name: string
          org_id: string
          phone: string | null
          role: string | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_activity_at?: string | null
          name: string
          org_id: string
          phone?: string | null
          role?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_activity_at?: string | null
          name?: string
          org_id?: string
          phone?: string | null
          role?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          assigned_to: string | null
          closing_date: string | null
          contact_id: string | null
          created_at: string | null
          currency: string | null
          id: string
          lead_id: string | null
          loss_reason: string | null
          org_id: string
          pipeline_id: string | null
          stage: string | null
          stage_entered_at: string | null
          title: string
          updated_at: string | null
          value: number | null
        }
        Insert: {
          assigned_to?: string | null
          closing_date?: string | null
          contact_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          lead_id?: string | null
          loss_reason?: string | null
          org_id: string
          pipeline_id?: string | null
          stage?: string | null
          stage_entered_at?: string | null
          title: string
          updated_at?: string | null
          value?: number | null
        }
        Update: {
          assigned_to?: string | null
          closing_date?: string | null
          contact_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          lead_id?: string | null
          loss_reason?: string | null
          org_id?: string
          pipeline_id?: string | null
          stage?: string | null
          stage_entered_at?: string | null
          title?: string
          updated_at?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_pipeline_id_fkey"
            columns: ["pipeline_id"]
            isOneToOne: false
            referencedRelation: "pipelines"
            referencedColumns: ["id"]
          },
        ]
      }
      email_threads: {
        Row: {
          contact_id: string | null
          created_at: string | null
          id: string
          last_message_at: string | null
          org_id: string
          subject: string
        }
        Insert: {
          contact_id?: string | null
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          org_id: string
          subject: string
        }
        Update: {
          contact_id?: string | null
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          org_id?: string
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_threads_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_threads_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      emails: {
        Row: {
          body: string | null
          clicked_at: string | null
          created_at: string | null
          direction: string
          from_address: string | null
          id: string
          is_clicked: boolean | null
          is_opened: boolean | null
          opened_at: string | null
          org_id: string
          sent_by: string | null
          template_id: string | null
          thread_id: string
          to_address: string | null
        }
        Insert: {
          body?: string | null
          clicked_at?: string | null
          created_at?: string | null
          direction: string
          from_address?: string | null
          id?: string
          is_clicked?: boolean | null
          is_opened?: boolean | null
          opened_at?: string | null
          org_id: string
          sent_by?: string | null
          template_id?: string | null
          thread_id: string
          to_address?: string | null
        }
        Update: {
          body?: string | null
          clicked_at?: string | null
          created_at?: string | null
          direction?: string
          from_address?: string | null
          id?: string
          is_clicked?: boolean | null
          is_opened?: boolean | null
          opened_at?: string | null
          org_id?: string
          sent_by?: string | null
          template_id?: string | null
          thread_id?: string
          to_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emails_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emails_sent_by_fkey"
            columns: ["sent_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emails_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "email_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string | null
          company: string | null
          created_at: string | null
          deleted_at: string | null
          email: string | null
          id: string
          last_activity_at: string | null
          name: string
          notes: string | null
          org_id: string
          phone: string | null
          source: string | null
          status: string | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          company?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          id?: string
          last_activity_at?: string | null
          name: string
          notes?: string | null
          org_id: string
          phone?: string | null
          source?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          company?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          id?: string
          last_activity_at?: string | null
          name?: string
          notes?: string | null
          org_id?: string
          phone?: string | null
          source?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          currency: string | null
          id: string
          logo_url: string | null
          name: string
          slug: string
          timezone: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          id?: string
          logo_url?: string | null
          name: string
          slug: string
          timezone?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          slug?: string
          timezone?: string | null
        }
        Relationships: []
      }
      pipeline_stages: {
        Row: {
          color: string | null
          id: string
          name: string
          pipeline_id: string
          position: number
        }
        Insert: {
          color?: string | null
          id?: string
          name: string
          pipeline_id: string
          position: number
        }
        Update: {
          color?: string | null
          id?: string
          name?: string
          pipeline_id?: string
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_stages_pipeline_id_fkey"
            columns: ["pipeline_id"]
            isOneToOne: false
            referencedRelation: "pipelines"
            referencedColumns: ["id"]
          },
        ]
      }
      pipelines: {
        Row: {
          created_at: string | null
          id: string
          is_default: boolean | null
          name: string
          org_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          org_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          org_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pipelines_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          org_id: string | null
          role: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean | null
          org_id?: string | null
          role?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          org_id?: string | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          linked_id: string | null
          linked_type: string | null
          org_id: string
          priority: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          linked_id?: string | null
          linked_type?: string | null
          org_id: string
          priority?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          linked_id?: string | null
          linked_type?: string | null
          org_id?: string
          priority?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          body: string
          channel: string
          created_at: string | null
          created_by: string | null
          id: string
          name: string
          org_id: string
          subject: string | null
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          body: string
          channel: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          name: string
          org_id: string
          subject?: string | null
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          body?: string
          channel?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string
          org_id?: string
          subject?: string | null
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "templates_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_conversations: {
        Row: {
          contact_id: string | null
          contact_name: string | null
          created_at: string | null
          id: string
          last_message_at: string | null
          lead_id: string | null
          org_id: string
          phone_number: string
          unread_count: number | null
        }
        Insert: {
          contact_id?: string | null
          contact_name?: string | null
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          lead_id?: string | null
          org_id: string
          phone_number: string
          unread_count?: number | null
        }
        Update: {
          contact_id?: string | null
          contact_name?: string | null
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          lead_id?: string | null
          org_id?: string
          phone_number?: string
          unread_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_conversations_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_conversations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_conversations_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          direction: string
          id: string
          message_type: string | null
          org_id: string
          sender_id: string | null
          status: string | null
          template_id: string | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          direction: string
          id?: string
          message_type?: string | null
          org_id: string
          sender_id?: string | null
          status?: string | null
          template_id?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          direction?: string
          id?: string
          message_type?: string | null
          org_id?: string
          sender_id?: string | null
          status?: string | null
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_messages_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_executions: {
        Row: {
          completed_at: string | null
          error_details: string | null
          id: string
          org_id: string
          started_at: string | null
          status: string
          trigger_data: Json | null
          workflow_id: string
        }
        Insert: {
          completed_at?: string | null
          error_details?: string | null
          id?: string
          org_id: string
          started_at?: string | null
          status: string
          trigger_data?: Json | null
          workflow_id: string
        }
        Update: {
          completed_at?: string | null
          error_details?: string | null
          id?: string
          org_id?: string
          started_at?: string | null
          status?: string
          trigger_data?: Json | null
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_executions_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_executions_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_steps: {
        Row: {
          config: Json | null
          id: string
          position: number
          step_type: string
          workflow_id: string
        }
        Insert: {
          config?: Json | null
          id?: string
          position: number
          step_type: string
          workflow_id: string
        }
        Update: {
          config?: Json | null
          id?: string
          position?: number
          step_type?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_steps_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflows: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          last_executed_at: string | null
          name: string
          org_id: string
          run_count: number | null
          trigger_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          last_executed_at?: string | null
          name: string
          org_id: string
          run_count?: number | null
          trigger_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          last_executed_at?: string | null
          name?: string
          org_id?: string
          run_count?: number | null
          trigger_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflows_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflows_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// ============================================================
// Convenience row type aliases
// ============================================================
export type Organization = Database["public"]["Tables"]["organizations"]["Row"]
export type OrganizationInsert = Database["public"]["Tables"]["organizations"]["Insert"]
export type OrganizationUpdate = Database["public"]["Tables"]["organizations"]["Update"]

export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"]
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"]

export type Lead = Database["public"]["Tables"]["leads"]["Row"]
export type LeadInsert = Database["public"]["Tables"]["leads"]["Insert"]
export type LeadUpdate = Database["public"]["Tables"]["leads"]["Update"]

export type Contact = Database["public"]["Tables"]["contacts"]["Row"]
export type ContactInsert = Database["public"]["Tables"]["contacts"]["Insert"]
export type ContactUpdate = Database["public"]["Tables"]["contacts"]["Update"]

export type Pipeline = Database["public"]["Tables"]["pipelines"]["Row"]
export type PipelineInsert = Database["public"]["Tables"]["pipelines"]["Insert"]
export type PipelineUpdate = Database["public"]["Tables"]["pipelines"]["Update"]

export type PipelineStage = Database["public"]["Tables"]["pipeline_stages"]["Row"]
export type PipelineStageInsert = Database["public"]["Tables"]["pipeline_stages"]["Insert"]
export type PipelineStageUpdate = Database["public"]["Tables"]["pipeline_stages"]["Update"]

export type Deal = Database["public"]["Tables"]["deals"]["Row"]
export type DealInsert = Database["public"]["Tables"]["deals"]["Insert"]
export type DealUpdate = Database["public"]["Tables"]["deals"]["Update"]

export type Task = Database["public"]["Tables"]["tasks"]["Row"]
export type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"]
export type TaskUpdate = Database["public"]["Tables"]["tasks"]["Update"]

export type Activity = Database["public"]["Tables"]["activities"]["Row"]
export type ActivityInsert = Database["public"]["Tables"]["activities"]["Insert"]
export type ActivityUpdate = Database["public"]["Tables"]["activities"]["Update"]

export type WhatsappConversation = Database["public"]["Tables"]["whatsapp_conversations"]["Row"]
export type WhatsappConversationInsert = Database["public"]["Tables"]["whatsapp_conversations"]["Insert"]
export type WhatsappConversationUpdate = Database["public"]["Tables"]["whatsapp_conversations"]["Update"]

export type WhatsappMessage = Database["public"]["Tables"]["whatsapp_messages"]["Row"]
export type WhatsappMessageInsert = Database["public"]["Tables"]["whatsapp_messages"]["Insert"]
export type WhatsappMessageUpdate = Database["public"]["Tables"]["whatsapp_messages"]["Update"]

export type Call = Database["public"]["Tables"]["calls"]["Row"]
export type CallInsert = Database["public"]["Tables"]["calls"]["Insert"]
export type CallUpdate = Database["public"]["Tables"]["calls"]["Update"]

export type EmailThread = Database["public"]["Tables"]["email_threads"]["Row"]
export type EmailThreadInsert = Database["public"]["Tables"]["email_threads"]["Insert"]
export type EmailThreadUpdate = Database["public"]["Tables"]["email_threads"]["Update"]

export type Email = Database["public"]["Tables"]["emails"]["Row"]
export type EmailInsert = Database["public"]["Tables"]["emails"]["Insert"]
export type EmailUpdate = Database["public"]["Tables"]["emails"]["Update"]

export type Template = Database["public"]["Tables"]["templates"]["Row"]
export type TemplateInsert = Database["public"]["Tables"]["templates"]["Insert"]
export type TemplateUpdate = Database["public"]["Tables"]["templates"]["Update"]

export type Campaign = Database["public"]["Tables"]["campaigns"]["Row"]
export type CampaignInsert = Database["public"]["Tables"]["campaigns"]["Insert"]
export type CampaignUpdate = Database["public"]["Tables"]["campaigns"]["Update"]

export type CampaignRecipient = Database["public"]["Tables"]["campaign_recipients"]["Row"]
export type CampaignRecipientInsert = Database["public"]["Tables"]["campaign_recipients"]["Insert"]
export type CampaignRecipientUpdate = Database["public"]["Tables"]["campaign_recipients"]["Update"]

export type Workflow = Database["public"]["Tables"]["workflows"]["Row"]
export type WorkflowInsert = Database["public"]["Tables"]["workflows"]["Insert"]
export type WorkflowUpdate = Database["public"]["Tables"]["workflows"]["Update"]

export type WorkflowStep = Database["public"]["Tables"]["workflow_steps"]["Row"]
export type WorkflowStepInsert = Database["public"]["Tables"]["workflow_steps"]["Insert"]
export type WorkflowStepUpdate = Database["public"]["Tables"]["workflow_steps"]["Update"]

export type WorkflowExecution = Database["public"]["Tables"]["workflow_executions"]["Row"]
export type WorkflowExecutionInsert = Database["public"]["Tables"]["workflow_executions"]["Insert"]
export type WorkflowExecutionUpdate = Database["public"]["Tables"]["workflow_executions"]["Update"]

export type AiConversation = Database["public"]["Tables"]["ai_conversations"]["Row"]
export type AiConversationInsert = Database["public"]["Tables"]["ai_conversations"]["Insert"]
export type AiConversationUpdate = Database["public"]["Tables"]["ai_conversations"]["Update"]

export type AiMessage = Database["public"]["Tables"]["ai_messages"]["Row"]
export type AiMessageInsert = Database["public"]["Tables"]["ai_messages"]["Insert"]
export type AiMessageUpdate = Database["public"]["Tables"]["ai_messages"]["Update"]

// ============================================================
// Domain-specific literal types (for use in forms / UI)
// ============================================================
export type UserRole = "admin" | "manager" | "agent"
export type LeadStatus = "new" | "contacted" | "qualified" | "unqualified" | "converted"
export type LeadSource = "website" | "whatsapp" | "manual" | "import" | "referral" | "social" | "other"
export type DealStage = "new" | "qualified" | "proposal" | "won" | "lost"
export type TaskPriority = "urgent" | "high" | "medium" | "low"
export type TaskStatus = "pending" | "completed"
export type LinkedRecordType = "lead" | "contact" | "deal"
export type ActivityType =
  | "note"
  | "call"
  | "whatsapp"
  | "email"
  | "task_completed"
  | "deal_created"
  | "lead_created"
  | "status_changed"
  | "stage_changed"
export type MessageDirection = "inbound" | "outbound"
export type WhatsappMessageType = "text" | "template" | "image" | "file"
export type WhatsappMessageStatus = "sent" | "delivered" | "read" | "failed"
export type CallOutcome = "connected" | "voicemail" | "no_answer" | "busy" | "failed"
export type AiCallOutcome = "qualified" | "not_interested" | "voicemail" | "no_answer" | "appointment_booked"
export type Sentiment = "positive" | "neutral" | "negative"
export type TemplateChannel = "whatsapp" | "email"
export type CampaignStatus = "draft" | "scheduled" | "sending" | "sent" | "failed"
export type CampaignRecipientStatus = "pending" | "sent" | "delivered" | "opened" | "replied" | "failed"
export type WorkflowStepType = "trigger" | "condition" | "action"
export type WorkflowExecutionStatus = "running" | "completed" | "failed"
export type AiMessageRole = "user" | "assistant"
