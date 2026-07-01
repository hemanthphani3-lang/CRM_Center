'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users2, Plus, Mail, Shield, UserMinus, ToggleLeft, ToggleRight, Check, X } from 'lucide-react'
import { db, TeamMember } from '@/lib/db'

export default function TeamSettingsPage() {
  const [mounted, setMounted] = useState(false)
  const [team, setTeam] = useState<TeamMember[]>([])
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [inviteName, setInviteName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'admin' | 'manager' | 'agent'>('agent')

  useEffect(() => {
    setMounted(true)
    db.initialize()
    setTeam(db.getTeam())
  }, [])

  if (!mounted) return null

  const handleRoleChange = (memberId: string, role: 'admin' | 'manager' | 'agent') => {
    const updated = team.map(m => {
      if (m.id === memberId) {
        return { ...m, role }
      }
      return m
    })
    db.saveTeam(updated)
    setTeam(updated)
  }

  const handleStatusToggle = (memberId: string) => {
    const updated = team.map(m => {
      if (m.id === memberId) {
        return { ...m, isActive: !m.isActive }
      }
      return m
    })
    db.saveTeam(updated)
    setTeam(updated)
  }

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteName.trim() || !inviteEmail.trim()) return

    const newMember: TeamMember = {
      id: `usr-${Date.now()}`,
      fullName: inviteName,
      email: inviteEmail,
      role: inviteRole,
      isActive: true,
      createdAt: new Date().toISOString()
    }

    const updated = [...team, newMember]
    db.saveTeam(updated)
    setTeam(updated)
    setIsInviteOpen(false)
    setInviteName('')
    setInviteEmail('')
    setInviteRole('agent')
  }

  const handleRemoveMember = (memberId: string) => {
    const updated = team.filter(m => m.id !== memberId)
    db.saveTeam(updated)
    setTeam(updated)
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 bg-gray-50/50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <Users2 size={22} className="text-brand" />
            Team Directory & Roles
          </h1>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            Invite colleagues, modify RBAC roles, and manage team login permissions.
          </p>
        </div>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-brand text-white px-4 py-2 text-xs font-bold hover:bg-brand-hover active:scale-98 transition-all shadow-md shadow-brand/10"
        >
          <Plus size={15} />
          Invite Member
        </button>
      </div>

      {/* Directory Grid */}
      <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-wider border-b border-gray-150">
                <th className="p-4">Name & Email</th>
                <th className="p-4">Role Access</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date Joined</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-700">
              {team.map(member => (
                <tr key={member.id} className="hover:bg-gray-55/30 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    {member.avatarUrl ? (
                      <img src={member.avatarUrl} alt={member.fullName} className="w-9 h-9 rounded-full object-cover border border-gray-100" />
                    ) : (
                      <span className="w-9 h-9 rounded-full bg-brand-light text-brand flex items-center justify-center font-bold text-[11px] uppercase border border-brand/10">
                        {member.fullName.charAt(0)}
                      </span>
                    )}
                    <div>
                      <h4 className="font-bold text-gray-850">{member.fullName}</h4>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{member.email}</p>
                    </div>
                  </td>

                  <td className="p-4">
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value as any)}
                      className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-700 bg-white focus:outline-none"
                    >
                      <option value="admin">Administrator</option>
                      <option value="manager">Manager</option>
                      <option value="agent">Agent / Rep</option>
                    </select>
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => handleStatusToggle(member.id)}
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md transition-colors ${
                        member.isActive
                          ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-150'
                      }`}
                    >
                      {member.isActive ? 'Active' : 'Suspended'}
                    </button>
                  </td>

                  <td className="p-4 text-gray-400 font-semibold">
                    {new Date(member.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-gray-300 hover:text-red-500 p-1.5 rounded transition-all"
                      title="Revoke access"
                    >
                      <UserMinus size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {isInviteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInviteOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl bg-white border border-gray-200 shadow-2xl p-6 pointer-events-auto"
            >
              <h2 className="text-md font-bold text-gray-900 flex items-center gap-2">
                <Users2 size={18} className="text-brand" />
                Invite Team Member
              </h2>
              <form onSubmit={handleInviteSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Eleanor Vance"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="eleanor@acme.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">RBAC Role Access</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none bg-white font-medium text-gray-750"
                  >
                    <option value="admin">Administrator (Full write-access)</option>
                    <option value="manager">Manager (Read & Pipeline changes)</option>
                    <option value="agent">Agent (Leads assigned only)</option>
                  </select>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setIsInviteOpen(false)}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold hover:bg-gray-50 text-gray-600 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand-hover active:scale-98 transition-all"
                  >
                    Send Invitation
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
