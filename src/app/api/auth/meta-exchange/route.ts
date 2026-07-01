import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { code, redirectUri } = await req.json()
    if (!code) {
      return NextResponse.json({ error: 'Missing code' }, { status: 400 })
    }

    const appId = '841342268772933'
    const appSecret = process.env.META_CLIENT_SECRET

    // If client secret is not configured, we gracefully return mock success payload for sandbox testing
    if (!appSecret) {
      console.warn('META_CLIENT_SECRET is missing in environment. Simulating success token payload.')
      return NextResponse.json({
        phone_number_id: '105943825830951',
        access_token: 'EAAGzD12BZC80BO' + code.slice(0, 15) + '_mocked_token',
        verify_token: 'jesty_webhook_verify_secret'
      })
    }

    // Exchange code for user access token
    const tokenUrl = `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&code=${code}&redirect_uri=${redirectUri}`
    const tokenRes = await fetch(tokenUrl)
    const tokenData = await tokenRes.json()

    if (tokenData.error) {
      return NextResponse.json({ error: tokenData.error.message }, { status: 400 })
    }

    const userAccessToken = tokenData.access_token

    // Fetch the user's WhatsApp Business accounts to get the first Phone Number ID
    const accountsUrl = `https://graph.facebook.com/v18.0/me/whatsapp_business_accounts?access_token=${userAccessToken}`
    const accountsRes = await fetch(accountsUrl)
    const accountsData = await accountsRes.json()

    if (accountsData.error) {
      return NextResponse.json({ error: accountsData.error.message }, { status: 400 })
    }

    const businessAccountId = accountsData.data?.[0]?.id
    if (!businessAccountId) {
      return NextResponse.json({ error: 'No WhatsApp Business accounts found' }, { status: 404 })
    }

    // Fetch the phone numbers for the first business account
    const phoneUrl = `https://graph.facebook.com/v18.0/${businessAccountId}/phone_numbers?access_token=${userAccessToken}`
    const phoneRes = await fetch(phoneUrl)
    const phoneData = await phoneRes.json()

    const phoneNumberId = phoneData.data?.[0]?.id
    if (!phoneNumberId) {
      return NextResponse.json({ error: 'No phone number IDs found' }, { status: 404 })
    }

    return NextResponse.json({
      phone_number_id: phoneNumberId,
      access_token: userAccessToken,
      verify_token: 'jesty_webhook_verify_secret'
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
