'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Menu, Search, Bell, Plus, ChevronDown, LogOut,
  User, Settings, BarChart2, Zap, Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { signOut } from '@/lib/auth-actions'

interface TopNavProps {
  onMenuClick: () => void
  onSearchClick: () => void
}

export function TopNav({ onMenuClick, onSearchClick }: TopNavProps) {
  const router = useRouter()
  const [notifCount] = useState(3)

  return (
    <header className="h-14 sticky top-0 z-40 flex items-center gap-3 bg-white border-b border-gray-200 px-4 flex-shrink-0">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        aria-label="Open navigation menu"
        className="lg:hidden p-1.5 rounded-md text-gray-500 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-[#6366f1] focus-visible:outline-offset-2"
      >
        <Menu size={20} aria-hidden="true" />
      </button>

      {/* Search bar */}
      <div className="flex-1 max-w-sm">
        <button
          onClick={onSearchClick}
          aria-label="Search (click to open search overlay)"
          className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-gray-400 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors"
        >
          <Search size={14} aria-hidden="true" />
          <span>Search…</span>
        </button>
      </div>

      {/* Right-side actions */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Cmd+K pill */}
        <kbd
          aria-label="Keyboard shortcut: Ctrl K or Command K to open command palette"
          className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-gray-400 bg-gray-100 border border-gray-200 rounded-md font-mono select-none"
        >
          <span>⌘K</span>
        </kbd>

        {/* Quick actions dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Quick actions"
            className="hidden sm:inline-flex items-center gap-1 h-7 px-2.5 rounded-[min(var(--radius-md),12px)] text-sm text-gray-600 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-[#6366f1] focus-visible:outline-offset-2 transition-colors"
          >
            <Zap size={16} aria-hidden="true" />
            <ChevronDown size={12} aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => router.push('/crm/leads')}>
              <Star size={14} className="mr-2" aria-hidden="true" />New Lead
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/crm/deals')}>
              <BarChart2 size={14} className="mr-2" aria-hidden="true" />New Deal
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/crm/tasks')}>
              <Zap size={14} className="mr-2" aria-hidden="true" />New Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications bell */}
        <button
          aria-label={`Notifications — ${notifCount} unread`}
          className="relative p-1.5 rounded-md text-gray-500 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
        >
          <Bell size={18} aria-hidden="true" />
          {notifCount > 0 && (
            <span
              aria-hidden="true"
              className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center leading-none"
            >
              {notifCount}
            </span>
          )}
        </button>

        {/* Create button */}
        <Button
          size="sm"
          className="bg-brand hover:bg-brand-hover text-white focus-visible:outline-2 focus-visible:outline-offset-2"
          aria-label="Create new record"
          onClick={() => router.push('/crm/leads')}
        >
          <Plus size={14} className="mr-1" aria-hidden="true" />
          <span className="hidden sm:inline">Create</span>
        </Button>

        {/* User avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="User menu"
            className="focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded-full"
          >
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarFallback className="bg-brand-light text-brand text-xs font-semibold">
                JC
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => router.push('/settings/team')}>
              <User size={14} className="mr-2" aria-hidden="true" />Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/settings/organization')}>
              <Settings size={14} className="mr-2" aria-hidden="true" />Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={() => signOut()}
            >
              <LogOut size={14} className="mr-2" aria-hidden="true" />Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
