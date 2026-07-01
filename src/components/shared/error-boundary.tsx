'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div
          role="alert"
          className="flex flex-col items-center justify-center min-h-[200px] gap-4 p-8 text-center"
        >
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-50 text-red-500">
            <AlertTriangle size={24} aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-gray-900">
              Something went wrong
            </h3>
            <p className="text-sm text-gray-500 max-w-sm">
              {this.state.error?.message ?? 'An unexpected error occurred. Please try again.'}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={this.handleRetry}
            className="gap-2 focus-visible:outline-2 focus-visible:outline-[#6366f1] focus-visible:outline-offset-2"
          >
            <RefreshCw size={14} aria-hidden="true" />
            Try again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
