'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plug, Check, MessageSquare, PhoneCall, Bot, AlertCircle, X, Key, Shield, Info, HelpCircle } from 'lucide-react'
import { db } from '@/lib/db'

interface IntegrationConfig {
  id: string
  name: string
  description: string
  category: 'communications' | 'voice' | 'ai' | 'other'
  icon: any
  status: boolean
  dbKey: 'whatsapp' | 'twilio' | 'deepgram'
}

export default function IntegrationsSettingsPage() {
  const [mounted, setMounted] = useState(false)
  const [whatsappActive, setWhatsappActive] = useState(true)
  const [twilioActive, setTwilioActive] = useState(false)
  const [deepgramActive, setDeepgramActive] = useState(true)

  // Configuration Modal state
  const [activeModal, setActiveModal] = useState<'whatsapp' | 'twilio' | 'deepgram' | null>(null)

  // WhatsApp Creds states
  const [waPhoneId, setWaPhoneId] = useState('')
  const [waToken, setWaToken] = useState('')
  const [waVerifyToken, setWaVerifyToken] = useState('jesty_webhook_verify_secret')

  // Twilio Creds states
  const [twSid, setTwSid] = useState('')
  const [twToken, setTwToken] = useState('')
  const [twPhone, setTwPhone] = useState('')

  // Deepgram Creds states
  const [dgKey, setDgKey] = useState('')
  const [showVerifyTokenTip, setShowVerifyTokenTip] = useState(false)
  const [isAuthorizingMeta, setIsAuthorizingMeta] = useState(false)
  const [setupMethod, setSetupMethod] = useState<'meta' | 'manual'>('meta')

  const handleMetaConnect = () => {
    setIsAuthorizingMeta(true)
    
    const appId = '841342268772933'
    const redirectUri = window.location.origin + '/settings/integrations/whatsapp-callback'
    const scope = 'whatsapp_business_management,whatsapp_business_messaging,business_management'
    const oauthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=code`

    const popup = window.open(
      oauthUrl,
      'Facebook Login for Business',
      'width=600,height=700,status=no,resizable=yes,scrollbars=yes'
    )

    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      if (event.data?.type === 'META_OAUTH_CODE' && event.data?.code) {
        window.removeEventListener('message', handleMessage)
        
        try {
          const res = await fetch('/api/auth/meta-exchange', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: event.data.code, redirectUri })
          })
          const data = await res.json()
          
          if (data.error) {
            console.error('Meta auth exchange failed:', data.error)
            setIsAuthorizingMeta(false)
          } else {
            // Save immediately for seamless one-click experience!
            localStorage.setItem('jesty_creds_wa_phone_id', data.phone_number_id)
            localStorage.setItem('jesty_creds_wa_token', data.access_token)
            localStorage.setItem('jesty_creds_wa_verify_token', data.verify_token)
            setWaPhoneId(data.phone_number_id)
            setWaToken(data.access_token)
            setWaVerifyToken(data.verify_token)
            setWhatsappActive(true)
            db.saveIntegrations({
              whatsapp: true,
              twilio: twilioActive,
              deepgram: deepgramActive
            })
            setIsAuthorizingMeta(false)
            setActiveModal(null) // Dismiss modal automatically
          }
        } catch (err) {
          console.error(err)
          setIsAuthorizingMeta(false)
        }
      }
    }

    window.addEventListener('message', handleMessage)

    const timer = setInterval(() => {
      if (popup?.closed) {
        clearInterval(timer)
        setIsAuthorizingMeta(false)
        window.removeEventListener('message', handleMessage)
      }
    }, 1000)
  }

  useEffect(() => {
    setMounted(true)
    db.initialize()
    const activeStates = db.getIntegrations()
    setWhatsappActive(activeStates.whatsapp)
    setTwilioActive(activeStates.twilio)
    setDeepgramActive(activeStates.deepgram)

    // Load saved settings if any
    setWaPhoneId(localStorage.getItem('jesty_creds_wa_phone_id') || '')
    setWaToken(localStorage.getItem('jesty_creds_wa_token') || '')
    setWaVerifyToken(localStorage.getItem('jesty_creds_wa_verify_token') || 'jesty_webhook_verify_secret')
    setTwSid(localStorage.getItem('jesty_creds_tw_sid') || '')
    setTwToken(localStorage.getItem('jesty_creds_tw_token') || '')
    setTwPhone(localStorage.getItem('jesty_creds_tw_phone') || '')
    setDgKey(localStorage.getItem('jesty_creds_dg_key') || '')
  }, [])

  if (!mounted) return null

  const handleToggle = (key: 'whatsapp' | 'twilio' | 'deepgram') => {
    if (key === 'whatsapp') {
      if (whatsappActive) {
        setWhatsappActive(false)
        db.saveIntegrations({ whatsapp: false, twilio: twilioActive, deepgram: deepgramActive })
      } else {
        setActiveModal('whatsapp')
      }
    } else if (key === 'twilio') {
      if (twilioActive) {
        setTwilioActive(false)
        db.saveIntegrations({ whatsapp: whatsappActive, twilio: false, deepgram: deepgramActive })
      } else {
        setActiveModal('twilio')
      }
    } else if (key === 'deepgram') {
      if (deepgramActive) {
        setDeepgramActive(false)
        db.saveIntegrations({ whatsapp: whatsappActive, twilio: twilioActive, deepgram: false })
      } else {
        setActiveModal('deepgram')
      }
    }
  }

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeModal) return

    if (activeModal === 'whatsapp') {
      localStorage.setItem('jesty_creds_wa_phone_id', waPhoneId)
      localStorage.setItem('jesty_creds_wa_token', waToken)
      localStorage.setItem('jesty_creds_wa_verify_token', waVerifyToken)
      setWhatsappActive(true)
      db.saveIntegrations({
        whatsapp: true,
        twilio: twilioActive,
        deepgram: deepgramActive
      })
    } else if (activeModal === 'twilio') {
      localStorage.setItem('jesty_creds_tw_sid', twSid)
      localStorage.setItem('jesty_creds_tw_token', twToken)
      localStorage.setItem('jesty_creds_tw_phone', twPhone)
      setTwilioActive(true)
      db.saveIntegrations({
        whatsapp: whatsappActive,
        twilio: true,
        deepgram: deepgramActive
      })
    } else if (activeModal === 'deepgram') {
      localStorage.setItem('jesty_creds_dg_key', dgKey)
      setDeepgramActive(true)
      db.saveIntegrations({
        whatsapp: whatsappActive,
        twilio: twilioActive,
        deepgram: true
      })
    }

    setActiveModal(null)
  }

  const INTEGRATIONS: IntegrationConfig[] = [
    {
      id: 'int-1',
      name: 'WhatsApp Cloud Business API',
      description: 'Synchronize inbound messages, send templates, and dispatch notifications directly from your unified CRM dashboard.',
      category: 'communications',
      icon: MessageSquare,
      status: whatsappActive,
      dbKey: 'whatsapp'
    },
    {
      id: 'int-2',
      name: 'Twilio Voice Dialing Trunk',
      description: 'Hook up your outbound VOIP sip trunks and enable in-browser dialing, phone logs caching, and voice mail triggers.',
      category: 'voice',
      icon: PhoneCall,
      status: twilioActive,
      dbKey: 'twilio'
    },
    {
      id: 'int-3',
      name: 'Deepgram Audio Transcriber',
      description: 'Transcribe sales audio call files automatically to generate sentiment analyses and structured AI summary reports.',
      category: 'ai',
      icon: Bot,
      status: deepgramActive,
      dbKey: 'deepgram'
    }
  ]

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 bg-gray-50/50 min-h-screen font-sans">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <Plug size={22} className="text-brand" />
          Marketplace Integrations
        </h1>
        <p className="text-xs text-gray-500 font-semibold mt-1">
          Connect your communication channels and voice API engines with Jesty CRM.
        </p>
      </div>

      {/* Warning/Alert Sandbox disclaimer */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex gap-3 text-xs font-semibold text-brand-dark max-w-3xl">
        <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
        <div>
          <p>Production API Integration Mode</p>
          <p className="text-[11px] text-brand/80 mt-1 font-medium">
            To connect any service, click configure and input your provider tokens. Credentials are saved locally and synced to secure databases.
          </p>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {INTEGRATIONS.map(integration => {
          const Icon = integration.icon
          return (
            <div
              key={integration.id}
              className="bg-white rounded-2xl border border-gray-150 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-brand">
                    <Icon size={18} />
                  </span>

                  <div className="flex items-center gap-3">
                    {integration.status && (
                      <button
                        onClick={() => setActiveModal(integration.dbKey)}
                        className="text-[10px] font-bold text-brand hover:underline"
                      >
                        Configure
                      </button>
                    )}
                    <button
                      onClick={() => handleToggle(integration.dbKey)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        integration.status ? 'bg-brand' : 'bg-gray-250'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          integration.status ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-gray-850 mt-4">{integration.name}</h3>
                <p className="text-[11px] text-gray-400 font-semibold mt-1 leading-relaxed">
                  {integration.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-50 flex items-center justify-between text-[10px] text-gray-400 font-extrabold uppercase">
                <span>Category: {integration.category}</span>
                {integration.status && (
                  <span className="flex items-center gap-1 text-emerald-650">
                    <Check size={12} />
                    Connected
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Integration Setup Modals */}
      <AnimatePresence>
        {activeModal !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg rounded-3xl bg-white border border-gray-200 shadow-2xl p-6 pointer-events-auto z-10 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Key size={18} className="text-brand" />
                  <h2 className="text-sm font-bold text-gray-900">
                    Configure {activeModal === 'whatsapp' ? 'WhatsApp Cloud API' : activeModal === 'twilio' ? 'Twilio Voice Dialing' : 'Deepgram Transcriber'}
                  </h2>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="rounded-lg p-1 hover:bg-gray-50 text-gray-450 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveConfig} className="space-y-4">
                {activeModal === 'whatsapp' && (
                  <div className="flex border border-gray-150 rounded-xl overflow-hidden p-0.5 text-xs font-semibold select-none bg-gray-55/60 max-w-sm mx-auto mb-4">
                    <button
                      type="button"
                      onClick={() => setSetupMethod('meta')}
                      className={`flex-1 text-center py-1.5 rounded-lg transition-colors ${
                        setupMethod === 'meta' ? 'bg-white text-gray-900 shadow-xs' : 'bg-transparent text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      Quick Connect
                    </button>
                    <button
                      type="button"
                      onClick={() => setSetupMethod('manual')}
                      className={`flex-1 text-center py-1.5 rounded-lg transition-colors ${
                        setupMethod === 'manual' ? 'bg-white text-gray-900 shadow-xs' : 'bg-transparent text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      Manual Setup
                    </button>
                  </div>
                )}

                {activeModal === 'whatsapp' && setupMethod === 'meta' && (
                  <div className="space-y-4">
                    {/* Meta Embedded Signup Button */}
                    <div className="border border-[#1877F2]/20 bg-[#1877F2]/5 rounded-2xl p-4 flex flex-col items-center text-center gap-3">
                      <div className="flex items-center gap-2 text-[#1877F2]">
                        <MessageSquare size={16} className="fill-[#1877F2]" />
                        <span className="text-[10px] font-extrabold uppercase tracking-wide">WhatsApp Cloud Embedded Signup</span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium max-w-sm leading-relaxed">
                        Authorize Jesty CRM via Meta Login to automatically select your business account and phone ID in one click.
                      </p>
                      <button
                        type="button"
                        onClick={handleMetaConnect}
                        disabled={isAuthorizingMeta}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1877F2] hover:bg-[#1877F2]/90 active:scale-98 text-white px-4 py-2.5 text-xs font-bold transition-all shadow-md shadow-[#1877F2]/20 disabled:opacity-50"
                      >
                        {isAuthorizingMeta ? (
                          <div className="flex items-center gap-2">
                            <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>Authorizing Meta Link...</span>
                          </div>
                        ) : (
                          <>
                            <svg className="h-3.5 w-3.5 fill-white" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            <span>Connect with Meta</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {activeModal === 'whatsapp' && setupMethod === 'manual' && (
                  <div className="space-y-4">
                    <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 space-y-1.5">
                      <h4 className="text-[10px] font-extrabold text-gray-500 uppercase flex items-center gap-1">
                        <Info size={11} /> Meta Developer Integration Steps
                      </h4>
                      <ol className="text-[10px] text-gray-500 list-decimal pl-4 font-medium space-y-1">
                        <li>Register a Business Developer App on <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="text-brand underline">developers.facebook.com</a></li>
                        <li>Add WhatsApp Product to setup your Phone Number ID</li>
                        <li>Paste your Credentials below to authorize outbound syncing</li>
                      </ol>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Phone Number ID</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 1059438258..."
                          value={waPhoneId}
                          onChange={(e) => setWaPhoneId(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Permanent Access Token</label>
                        <input
                          type="password"
                          required
                          placeholder="Meta Graph Permanent Token"
                          value={waToken}
                          onChange={(e) => setWaToken(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 relative">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Webhook Verify Token</label>
                          <div 
                            className="relative cursor-help"
                            onMouseEnter={() => setShowVerifyTokenTip(true)}
                            onMouseLeave={() => setShowVerifyTokenTip(false)}
                          >
                            <HelpCircle size={12} className="text-gray-450 hover:text-brand transition-colors" />
                            <AnimatePresence>
                              {showVerifyTokenTip && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: 5 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: 5 }}
                                  className="absolute bottom-6 left-0 w-64 bg-gray-900 text-white text-[10px] p-2.5 rounded-lg shadow-xl z-30 font-medium leading-relaxed pointer-events-none"
                                >
                                  <p className="font-bold text-[11px] mb-1">What is a Verify Token?</p>
                                  <p className="text-gray-300">This is a custom secret token you create yourself (e.g. any random passphrase) to verify webhooks.</p>
                                  <p className="font-bold text-[11px] mt-2 mb-1">Where do I configure it?</p>
                                  <p className="text-gray-300 font-medium">
                                    Define it here, then paste the exact same value in your Meta Developer Console under <strong>WhatsApp &gt; Configuration &gt; Verify Token</strong> during the webhook subscription handshake setup.
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                        <input
                          type="text"
                          required
                          value={waVerifyToken}
                          onChange={(e) => setWaVerifyToken(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none bg-gray-50/50"
                        />
                        <p className="text-[9px] text-gray-400 mt-1 font-semibold">
                          Configure this exact Verify Token inside Meta webhook configurations.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeModal === 'twilio' && (
                  <>
                    <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 space-y-1.5">
                      <h4 className="text-[10px] font-extrabold text-gray-500 uppercase flex items-center gap-1">
                        <Info size={11} /> Twilio Trunk Steps
                      </h4>
                      <p className="text-[10px] text-gray-500 font-medium">
                        Paste your Twilio Project Dashboard Account SID and verification Auth Tokens below to bridge voice streams.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Account SID</label>
                        <input
                          type="text"
                          required
                          placeholder="AC..."
                          value={twSid}
                          onChange={(e) => setWaPhoneId(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Auth Token</label>
                        <input
                          type="password"
                          required
                          placeholder="Your Twilio Authentication Token"
                          value={twToken}
                          onChange={(e) => setTwToken(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Twilio Phone Number</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. +15550000000"
                          value={twPhone}
                          onChange={(e) => setTwPhone(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none"
                        />
                      </div>
                    </div>
                  </>
                )}

                {activeModal === 'deepgram' && (
                  <>
                    <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 space-y-1.5">
                      <h4 className="text-[10px] font-extrabold text-gray-500 uppercase flex items-center gap-1">
                        <Info size={11} /> Deepgram AI Voice Transcription
                      </h4>
                      <p className="text-[10px] text-gray-500 font-medium">
                        Enter your Deepgram API keys below to unlock automatic transcript formatting, sentiment tagging, and call summaries.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Deepgram API Key</label>
                        <input
                          type="password"
                          required
                          placeholder="Your Deepgram Console secret key"
                          value={dgKey}
                          onChange={(e) => setDgKey(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand focus:outline-none"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-2 justify-end pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-semibold hover:bg-gray-50 transition-all text-gray-500"
                  >
                    Cancel
                  </button>
                  {!(activeModal === 'whatsapp' && setupMethod === 'meta') && (
                    <button
                      type="submit"
                      className="rounded-xl bg-brand px-4 py-2.5 text-xs font-semibold text-white hover:bg-brand-hover active:scale-98 transition-all flex items-center gap-1.5 shadow-md shadow-brand/10"
                    >
                      <Shield size={13} />
                      Save & Connect
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
