'use client'

import { useEffect } from 'react'

export default function WhatsAppCallbackPage() {
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')
    if (code) {
      if (window.opener) {
        window.opener.postMessage({ type: 'META_OAUTH_CODE', code }, window.location.origin)
      }
    }
    window.close()
  }, [])

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 font-sans">
      <div className="text-center space-y-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto"></div>
        <p className="text-xs font-semibold text-gray-500">Connecting your WhatsApp account with Jesty CRM...</p>
      </div>
    </div>
  )
}
