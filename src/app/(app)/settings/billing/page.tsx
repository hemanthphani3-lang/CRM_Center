'use client'

import { useState, useEffect } from 'react'
import { CreditCard, Check, ShieldCheck, ArrowRight, Download, RefreshCw } from 'lucide-react'
import { db } from '@/lib/db'

interface Invoice {
  id: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
  plan: string
}

export default function BillingSettingsPage() {
  const [mounted, setMounted] = useState(false)
  const [invoices, setInvoices] = useState<Invoice[]>([])

  useEffect(() => {
    setMounted(true)
    db.initialize()
    const initialInvoices: Invoice[] = [
      { id: 'INV-1094', date: '2026-06-01', amount: 79.00, status: 'paid', plan: 'Jesty Pro Scale' },
      { id: 'INV-1083', date: '2026-05-01', amount: 79.00, status: 'paid', plan: 'Jesty Pro Scale' },
      { id: 'INV-1071', date: '2026-04-01', amount: 79.00, status: 'paid', plan: 'Jesty Pro Scale' }
    ]
    setInvoices(initialInvoices)
  }, [])

  if (!mounted) return null

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 bg-gray-50/50 min-h-screen font-sans">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <CreditCard size={22} className="text-brand" />
          Subscription & Billing
        </h1>
        <p className="text-xs text-gray-500 font-semibold mt-1">
          Review your subscription parameters, registered payment profiles, and download invoice history.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Plan card info */}
        <div className="md:col-span-2 space-y-6">
          {/* Active plan card */}
          <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold bg-indigo-50 text-brand px-2 py-0.5 rounded-md uppercase">
                Active Plan
              </span>
              <h2 className="text-md font-black text-gray-850">Jesty Pro Scale</h2>
              <p className="text-xs text-gray-500 font-medium">
                Standard recurring license for enterprise contacts and sales pipelines optimization.
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-gray-400">
                <span>Seats: 3 / 10 Active</span>
                <span>•</span>
                <span>Renews: July 1, 2026</span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-2xl font-black text-gray-900">$79.00<span className="text-xs font-medium text-gray-400">/mo</span></div>
              <button className="mt-4 w-full sm:w-auto px-4 py-2 text-xs font-bold bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl transition-all">
                Change Plan
              </button>
            </div>
          </div>

          {/* Card payment profile details */}
          <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-450 mb-4">Payment Profile</h3>
            <div className="flex items-center justify-between border border-gray-100 rounded-xl p-4 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-white rounded-lg border border-gray-100 text-gray-700 font-mono text-xs font-black">
                  VISA
                </span>
                <div>
                  <h4 className="text-xs font-bold text-gray-850">Visa Ending In 4242</h4>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Expiry 12/28</p>
                </div>
              </div>
              <button className="text-[11px] font-bold text-brand hover:underline">
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* Plan Features sidebar summary list */}
        <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-450">Active Quotas</h3>
          <div className="space-y-3 pt-1">
            {[
              { label: 'Contacts Directory', val: 'Unlimited' },
              { label: 'Deals Pipelines', val: 'Unlimited' },
              { label: 'AI Voice Agents Calls', val: '240 mins remaining' },
              { label: 'Automation Workflows', val: 'Active (Unlimited)' }
            ].map(feat => (
              <div key={feat.label} className="flex justify-between text-xs font-semibold">
                <span className="text-gray-400">{feat.label}</span>
                <span className="text-gray-750 font-bold">{feat.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invoice Logs viewport */}
      <div className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-150 bg-white">
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-450">Billing Cycles Invoice Logs</h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-wider border-b border-gray-150">
              <th className="p-4">Invoice ID</th>
              <th className="p-4">Billing Date</th>
              <th className="p-4">Paid Plan</th>
              <th className="p-4">Status</th>
              <th className="p-4">Total Price</th>
              <th className="p-4 text-right">Invoice Pdf</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-755">
            {invoices.map(inv => (
              <tr key={inv.id} className="hover:bg-gray-50/50">
                <td className="p-4 font-mono font-bold text-gray-800">{inv.id}</td>
                <td className="p-4 text-gray-400 font-semibold">{inv.date}</td>
                <td className="p-4 text-gray-700">{inv.plan}</td>
                <td className="p-4">
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md">
                    {inv.status}
                  </span>
                </td>
                <td className="p-4 font-bold text-gray-800">${inv.amount.toFixed(2)}</td>
                <td className="p-4 text-right">
                  <button className="text-gray-400 hover:text-brand transition-colors p-1" title="Download invoice invoice">
                    <Download size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
