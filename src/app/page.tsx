'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, ChevronRight, Check, Compass, Users, Sparkles, Layers, Sliders } from 'lucide-react'
import { db, Organization } from '@/lib/db'

const INDUSTRIES = [
  'Technology',
  'Real Estate',
  'Logistics',
  'Consulting',
  'Healthcare',
  'Financial Services'
]

const COLORS = [
  { name: 'Standard Violet', hex: '#6366f1' },
  { name: 'Sleek Dark', hex: '#18181b' },
  { name: 'Crimson Red', hex: '#e11d48' },
  { name: 'Deep Emerald', hex: '#059669' },
  { name: 'Royal Blue', hex: '#2563eb' },
  { name: 'Warm Orange', hex: '#ea580c' }
]

const MODULES = [
  { id: 'crm', name: 'CRM Modules', desc: 'Leads, Contacts, deals pipeline, tasks, calendar', active: true },
  { id: 'comm', name: 'Unified Communications', desc: 'WhatsApp inbox, calling transcripts, emails', active: true },
  { id: 'ai', name: 'AI Employees & Assistant', desc: 'AI analyst, calling agents, summaries', active: true },
  { id: 'auto', name: 'Automation Workflows', desc: 'Trigger event nodes, webhook log listeners', active: true },
  { id: 'anal', name: 'Advanced Recharts Analytics', desc: 'Revenue, performance reports, conversion rates', active: true }
]

export default function Home() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState(0) // 0: Select Org / Start Wizard, 1: Details, 2: Theme, 3: Modules

  // Wizard fields
  const [companyName, setCompanyName] = useState('')
  const [companySlug, setCompanySlug] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('Technology')
  const [seats, setSeats] = useState(5)
  const [selectedColor, setSelectedColor] = useState('#6366f1')
  const [installedModules, setInstalledModules] = useState<string[]>(['crm', 'comm', 'ai', 'auto', 'anal'])

  // Existing orgs switcher
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null)

  useEffect(() => {
    setMounted(true)
    db.initialize()
    setCurrentOrg(db.getOrg())
  }, [])

  const handleNameChange = (val: string) => {
    setCompanyName(val)
    setCompanySlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
  }

  const handleOrgLaunch = () => {
    router.push('/dashboard')
  }

  const handleOnboardingSubmit = () => {
    const newOrg: Organization = {
      id: `org-${Date.now()}`,
      name: companyName || 'New Enterprise',
      slug: companySlug || 'new-enterprise',
      brandColor: selectedColor,
      timezone: 'UTC',
      currency: 'USD'
    }
    db.saveOrg(newOrg)
    router.push('/dashboard')
  }

  const toggleModule = (id: string) => {
    setInstalledModules(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  if (!mounted) return null

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50/50 p-6 font-sans text-gray-900">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60" />

      <div className="w-full max-w-xl">
        {/* Brand Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6366f1]/10 text-[#6366f1]">
            <Sparkles size={24} />
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">CRM Center</h1>
          <p className="mt-2 text-sm text-gray-500">Premium AI-Powered Customer Relationship Workspace</p>
        </div>

        {/* Portal Containers */}
        <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-8 shadow-xl shadow-gray-100/50">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-gray-900">Welcome back</h2>
                  <p className="text-sm text-gray-500">Select an existing workspace organization, or configure a new workspace from scratch.</p>
                </div>

                {currentOrg && (
                  <div className="rounded-xl border border-gray-150 bg-gray-50/40 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Active Workspaces</p>
                    <button
                      onClick={handleOrgLaunch}
                      className="mt-3 flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:border-[#6366f1] transition-all group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: currentOrg.brandColor }}
                        >
                          {currentOrg.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{currentOrg.name}</p>
                          <p className="text-xs text-gray-400">slug: {currentOrg.slug}</p>
                        </div>
                      </div>
                      <div className="rounded-full bg-gray-100 p-1.5 text-gray-400 group-hover:bg-[#6366f1]/10 group-hover:text-[#6366f1] transition-all">
                        <ChevronRight size={18} />
                      </div>
                    </button>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6366f1] px-5 py-3 font-semibold text-white shadow-md hover:bg-[#5356e2] active:scale-98 transition-all"
                  >
                    Setup New Workspace
                    <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step-details"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold tracking-tight text-gray-900">Workspace Profile</h2>
                    <span className="text-xs font-semibold text-gray-400">Step 1 of 3</span>
                  </div>
                  <p className="text-sm text-gray-500">Provide basic details to populate your CRM environment.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="company-name" className="block text-xs font-bold uppercase tracking-wider text-gray-500">Company Name</label>
                    <input
                      id="company-name"
                      type="text"
                      placeholder="e.g. Stark Industries"
                      value={companyName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="mt-2 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#6366f1] focus:outline-none transition-all shadow-inner bg-gray-50/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="company-slug" className="block text-xs font-bold uppercase tracking-wider text-gray-500">Workspace URL Slug</label>
                    <div className="mt-2 flex rounded-xl border border-gray-200 shadow-inner bg-gray-50/20 overflow-hidden">
                      <span className="flex items-center px-4 bg-gray-100 border-r border-gray-200 text-xs text-gray-400 font-medium select-none">crmcenter.com/</span>
                      <input
                        id="company-slug"
                        type="text"
                        placeholder="stark-industries"
                        value={companySlug}
                        onChange={(e) => setCompanySlug(e.target.value)}
                        className="block flex-1 border-0 px-4 py-3 text-sm focus:outline-none bg-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="industry" className="block text-xs font-bold uppercase tracking-wider text-gray-500">Industry</label>
                      <select
                        id="industry"
                        value={selectedIndustry}
                        onChange={(e) => setSelectedIndustry(e.target.value)}
                        className="mt-2 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#6366f1] focus:outline-none transition-all bg-white"
                      >
                        {INDUSTRIES.map(ind => (
                          <option key={ind} value={ind}>{ind}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="seats" className="block text-xs font-bold uppercase tracking-wider text-gray-500">Seats (Agents)</label>
                      <input
                        id="seats"
                        type="number"
                        min={1}
                        max={100}
                        value={seats}
                        onChange={(e) => setSeats(Number(e.target.value))}
                        className="mt-2 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#6366f1] focus:outline-none transition-all bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setStep(0)}
                    className="flex-1 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold hover:bg-gray-50 transition-all"
                  >
                    Back
                  </button>
                  <button
                    disabled={!companyName}
                    onClick={() => setStep(2)}
                    className="flex-1 rounded-xl bg-[#6366f1] px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#5356e2] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-theme"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold tracking-tight text-gray-900">Brand Identity</h2>
                    <span className="text-xs font-semibold text-gray-400">Step 2 of 3</span>
                  </div>
                  <p className="text-sm text-gray-500">Pick a primary brand color to theme CRM Center’s interface dashboard highlights.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {COLORS.map(c => {
                    const isSelected = selectedColor === c.hex
                    return (
                      <button
                        key={c.hex}
                        onClick={() => setSelectedColor(c.hex)}
                        className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                          isSelected ? 'border-gray-900 bg-gray-50 ring-1 ring-gray-900' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div
                          className="h-6 w-6 rounded-full border border-black/10 flex items-center justify-center text-white"
                          style={{ backgroundColor: c.hex }}
                        >
                          {isSelected && <Check size={12} strokeWidth={3} />}
                        </div>
                        <span className="text-xs font-semibold text-gray-700">{c.name}</span>
                      </button>
                    )
                  })}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold hover:bg-gray-50 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 rounded-xl bg-[#6366f1] px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#5356e2] transition-all"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step-modules"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold tracking-tight text-gray-900">CRM Modules Selection</h2>
                    <span className="text-xs font-semibold text-gray-400">Step 3 of 3</span>
                  </div>
                  <p className="text-sm text-gray-500">Toggle CRM Center capabilities to activate inside this client.</p>
                </div>

                <div className="space-y-2">
                  {MODULES.map(m => {
                    const isChecked = installedModules.includes(m.id)
                    return (
                      <button
                        key={m.id}
                        onClick={() => toggleModule(m.id)}
                        className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all ${
                          isChecked ? 'border-gray-950 bg-gray-50/50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`rounded-lg p-2 ${isChecked ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}>
                            <Layers size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800">{m.name}</p>
                            <p className="text-xs text-gray-500">{m.desc}</p>
                          </div>
                        </div>
                        <div className={`h-5 w-5 rounded border flex items-center justify-center transition-all ${
                          isChecked ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300 bg-white'
                        }`}>
                          {isChecked && <Check size={12} strokeWidth={3} />}
                        </div>
                      </button>
                    )
                  })}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold hover:bg-gray-50 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleOnboardingSubmit}
                    className="flex-1 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-gray-800 transition-all"
                  >
                    Complete Setup
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  )
}
