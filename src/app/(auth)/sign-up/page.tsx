'use client'

import { useState } from 'react'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

// ── Schema ───────────────────────────────────────────────────
const signUpSchema = z
  .object({
    fullName: z.string().min(1, 'Full name is required'),
    organizationName: z.string().min(1, 'Organization name is required'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type SignUpFormValues = z.infer<typeof signUpSchema>

function mapSignUpError(message: string): string {
  if (message.includes('User already registered')) {
    return 'An account with this email already exists. Try signing in.'
  }
  if (message.includes('Password should be')) {
    return 'Password must be at least 8 characters.'
  }
  if (message.includes('Too many requests')) {
    return 'Too many sign-up attempts. Please wait a moment and try again.'
  }
  return `Something went wrong: ${message}. Please try again.`
}

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({ resolver: zodResolver(signUpSchema) })

  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const onSubmit = async (values: SignUpFormValues) => {
    setServerError(null)
    try {
      const supabase = createClient()

      // 1. Create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: { full_name: values.fullName },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) {
        setServerError(mapSignUpError(authError.message))
        return
      }

      const userId = authData.user?.id
      if (!userId) {
        setServerError('Sign-up failed. Please try again.')
        return
      }

      // 2. Create the organization
      const slug = values.organizationName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')

      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({ name: values.organizationName, slug })
        .select('id')
        .single()

      if (orgError) {
        setServerError('Account created but organization setup failed. Please contact support.')
        return
      }

      // 3. Upsert the profile (trigger may have already created it)
      await supabase.from('profiles').upsert({
        id: userId,
        full_name: values.fullName,
        email: values.email,
        org_id: org.id,
        role: 'admin',
        is_active: true,
      })

      setSuccess(true)
    } catch (err: any) {
      setServerError(`Client Error: ${err.message || err}`)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md mx-4 shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Check your email
          </CardTitle>
          <CardDescription>
            We sent a confirmation link to your email address. Click the link to
            activate your account and sign in.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link href="/sign-in">
            <Button variant="outline" className="mt-2">
              Back to Sign In
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-4 shadow-md">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-bold tracking-tight">
          CRM Center
        </CardTitle>
        <CardDescription>Create your workspace</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="Jane Smith"
              autoComplete="name"
              {...register('fullName')}
            />
            {errors.fullName && (
              <p className="text-sm text-red-600">{errors.fullName.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="organizationName">Organization Name</Label>
            <Input
              id="organizationName"
              placeholder="Acme Inc."
              {...register('organizationName')}
            />
            {errors.organizationName && (
              <p className="text-sm text-red-600">
                {errors.organizationName.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="su-email">Email</Label>
            <Input
              id="su-email"
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
            <Label htmlFor="su-password">Password</Label>
            <Input
              id="su-password"
              type="password"
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="su-confirm">Confirm Password</Label>
            <Input
              id="su-confirm"
              type="password"
              placeholder="Re-enter your password"
              autoComplete="new-password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          {serverError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {serverError}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account…' : 'Create Account'}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link
            href="/sign-in"
            className="font-medium text-gray-900 underline underline-offset-2 hover:text-black"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
