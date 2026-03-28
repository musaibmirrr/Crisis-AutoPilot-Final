import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Activity, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

  const errorMessages: Record<string, string> = {
    could_not_authenticate: 'We could not authenticate your account. Please try again.',
    access_denied: 'Access was denied. Please check your credentials.',
    invalid_request: 'Invalid authentication request. Please try again.',
    server_error: 'A server error occurred. Please try again later.',
  }

  const errorMessage = errorMessages[params?.error] || 'An unexpected error occurred during authentication.'

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">Crisis Autopilot</span>
          </div>

          <Card className="border-border/50 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-2xl">Authentication Error</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-center text-sm text-muted-foreground">
                {errorMessage}
              </p>

              {params?.error && (
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-center text-xs text-muted-foreground">
                    Error code: <code className="font-mono">{params.error}</code>
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <Button asChild className="w-full">
                  <Link href="/auth/login">Try again</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/">Go to homepage</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
