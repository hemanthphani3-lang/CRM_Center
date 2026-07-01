'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

// ── Schemas ─────────────────────────────────────────────────
const passwordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

const magicLinkSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type PasswordFormValues = z.infer<typeof passwordSchema>
type MagicLinkFormValues = z.infer<typeof magicLinkSchema>

// ── Error message mapper ─────────────────────────────────────
function mapSupabaseError(message: string): string {
  if (message.includes('Invalid login credentials')) {
    return 'Incorrect email or password. Please try again.'
  }
  if (message.includes('Email not confirmed')) {
    return 'Please confirm your email before signing in.'
  }
  if (message.includes('Too many requests')) {
    return 'Too many attempts. Please wait a moment and try again.'
  }
  if (message.includes('User not found')) {
    return 'No account found with that email address.'
  }
  return 'Something went wrong. Please try again.'
}

// ── Password tab ─────────────────────────────────────────────
function PasswordTab({
  onSuccess,
}: {
  onSuccess: (returnUrl: string) => void
}) {
  const searchParams = useSearchParams()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormValues>({ resolver: zodResolver(passwordSchema) })
  const [serverError, setServerError] = useState<string | null>(null)

  const onSubmit = async (values: PasswordFormValues) => {
    setServerError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })
    if (error) {
      setServerError(mapSupabaseError(error.message))
      return
    }
    onSuccess(searchParams.get('returnUrl') ?? '/')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="pw-email">Email</Label>
        <Input
          id="pw-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="pw-password">Password</Label>
        <Input
          id="pw-password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          {...register('password')}
        />
        {errors.password && (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>
      {serverError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {serverError}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in…' : 'Sign In'}
      </Button>
    </form>
  )
}

// ── Magic link tab ───────────────────────────────────────────
function MagicLinkTab() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MagicLinkFormValues>({ resolver: zodResolver(magicLinkSchema) })
  const [serverError, setServerError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const onSubmit = async (values: MagicLinkFormValues) => {
    setServerError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email: values.email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) {
      setServerError(mapSupabaseError(error.message))
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <div className="text-center space-y-2 py-4">
        <p className="text-sm font-medium text-gray-800">Magic link sent!</p>
        <p className="text-sm text-gray-500">
          Check your email and click the link to sign in.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="ml-email">Email</Label>
        <Input
          id="ml-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>
      {serverError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {serverError}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Sending…' : 'Send Magic Link'}
      </Button>
    </form>
  )
}

// ── Inner component (uses useSearchParams — must be inside Suspense) ──
function SignInContent() {
  const router = useRouter()

  const handleSuccess = (returnUrl: string) => {
    router.push(returnUrl)
    router.refresh()
  }

  return (
    <Card className="w-full max-w-md mx-4 shadow-md">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-bold tracking-tight">
          CRM Center
        </CardTitle>
        <CardDescription>Sign in to your workspace</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="password">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="password" className="flex-1">
              Email &amp; Password
            </TabsTrigger>
            <TabsTrigger value="magic-link" className="flex-1">
              Magic Link
            </TabsTrigger>
          </TabsList>
          <TabsContent value="password">
            <PasswordTab onSuccess={handleSuccess} />
          </TabsContent>
          <TabsContent value="magic-link">
            <MagicLinkTab />
          </TabsContent>
        </Tabs>
        <p className="mt-4 text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link
            href="/sign-up"
            className="font-medium text-gray-900 underline underline-offset-2 hover:text-black"
          >
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}

// ── Page ─────────────────────────────────────────────────────
export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInContent />
    </Suspense>
  )
}
