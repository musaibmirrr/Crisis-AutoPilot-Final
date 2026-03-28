import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Activity, Mail, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function SignUpSuccessPage() {
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
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <CardTitle className="text-2xl">Check your email</CardTitle>
              <CardDescription>
                We&apos;ve sent you a confirmation link
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
                <Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    Verify your email address
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Click the link in the email we sent you to confirm your account and start using Crisis Autopilot.
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-center">
                <p className="text-sm text-muted-foreground">
                  Didn&apos;t receive the email? Check your spam folder or{' '}
                  <Link href="/auth/sign-up" className="font-medium text-primary hover:underline">
                    try again
                  </Link>
                </p>
                <p className="text-sm text-muted-foreground">
                  Already confirmed?{' '}
                  <Link href="/auth/login" className="font-medium text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
