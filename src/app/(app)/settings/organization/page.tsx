'use client'

import { useState, useEffect } from 'react'
import { Building2, Save, Sparkles, Check, Globe, DollarSign } from 'lucide-react'
import { db, Organization } from '@/lib/db'

const COLOR_PRESETS = [
  { name: 'Violet', hex: '#7c3aed' },
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Amber', hex: '#d97706' },
  { name: 'Rose', hex: '#e11d48' }
]

export default function OrganizationSettingsPage() {
  const [mounted, setMounted] = useState(false)
  const [orgName, setOrgName] = useState('')
  const [orgSlug, setOrgSlug] = useState('')
  const [timezone, setTimezone] = useState('UTC')
  const [currency, setCurrency] = useState('USD')
  const [selectedColor, setSelectedColor] = useState('#7c3aed')
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    setMounted(true)
    db.initialize()
    const org = db.getOrg()
    if (org) {
      setOrgName(org.name)
      setOrgSlug(org.slug)
      setTimezone(org.timezone)
      setCurrency(org.currency)
      setSelectedColor(org.brandColor)
    }
  }, [])

  if (!mounted) return null

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()

    const updatedOrg: Organization = {
      id: 'org-acme',
      name: orgName,
      slug: orgSlug,
      timezone,
      currency,
      brandColor: selectedColor
    }

    db.saveOrg(updatedOrg)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6 bg-gray-50/50 min-h-screen font-sans">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <Building2 size={22} className="text-brand" />
          Organization Branding
        </h1>
        <p className="text-xs text-gray-500 font-semibold mt-1">
          Customize workspace settings, time zones, local currency indicators, and brand coloring.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Metadata */}
        <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-450">Company Profile</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Workspace Name</label>
              <input
                type="text"
                required
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Workspace Slug</label>
              <input
                type="text"
                required
                value={orgSlug}
                onChange={(e) => setOrgSlug(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                <Globe size={11} className="text-gray-400" />
                Default Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none bg-white font-medium text-gray-700"
              >
                <option value="UTC">UTC (Universal Time)</option>
                <option value="America/New_York">EST (Eastern Standard Time)</option>
                <option value="Europe/London">GMT (Greenwich Mean Time)</option>
                <option value="Asia/Kolkata">IST (Indian Standard Time)</option>
                <option value="Asia/Tokyo">JST (Japan Standard Time)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                <DollarSign size={11} className="text-gray-400" />
                Default Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none bg-white font-medium text-gray-700"
              >
                <option value="USD">USD ($ - United States Dollar)</option>
                <option value="EUR">EUR (€ - Euro)</option>
                <option value="GBP">GBP (£ - British Pound Sterling)</option>
                <option value="INR">INR (₹ - Indian Rupee)</option>
                <option value="JPY">JPY (¥ - Japanese Yen)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Color branding picker */}
        <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-450">Brand Themes Color</h3>
            <span className="text-[10px] text-brand font-bold flex items-center gap-1">
              <Sparkles size={11} className="animate-spin" />
              Applies instantly
            </span>
          </div>

          <p className="text-[11px] text-gray-400 font-semibold leading-relaxed">
            Select a harmonious color preset or specify a custom hex value. This adjusts the sidebar styling, buttons, and visual overlays instantly.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {COLOR_PRESETS.map(preset => {
              const isSelected = selectedColor.toLowerCase() === preset.hex.toLowerCase()
              return (
                <button
                  key={preset.hex}
                  type="button"
                  onClick={() => setSelectedColor(preset.hex)}
                  className={`px-3 py-2 rounded-xl text-[11px] font-bold transition-all border flex items-center gap-2 ${
                    isSelected
                      ? 'border-transparent text-white'
                      : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                  }`}
                  style={isSelected ? { backgroundColor: preset.hex } : undefined}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-black/10"
                    style={{ backgroundColor: preset.hex }}
                  />
                  {preset.name}
                  {isSelected && <Check size={12} />}
                </button>
              )
            })}
          </div>

          {/* Custom Hex input */}
          <div className="pt-2 max-w-xs">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Custom hex color</label>
            <div className="flex gap-2 mt-1.5">
              <div
                className="w-8 h-8 rounded-lg border border-gray-200 flex-shrink-0"
                style={{ backgroundColor: selectedColor }}
              />
              <input
                type="text"
                placeholder="#6366f1"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:border-brand focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end gap-3 items-center">
          {isSaved && (
            <span className="text-xs font-bold text-emerald-650 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100/50">
              <Check size={14} />
              Branding changes saved!
            </span>
          )}

          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-brand text-white px-5 py-2.5 text-xs font-bold hover:bg-brand-hover active:scale-98 transition-all shadow-md shadow-brand/15"
          >
            <Save size={15} />
            Save Organization
          </button>
        </div>
      </form>
    </div>
  )
}
