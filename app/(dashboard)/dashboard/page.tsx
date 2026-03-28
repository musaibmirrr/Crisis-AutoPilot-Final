"use client"

import Link from "next/link"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUser } from "@/hooks/use-user"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/dashboard/stat-card"
import { SeverityBadge } from "@/components/dashboard/severity-badge"
import {
  FileText,
  TrendingUp,
  Activity,
  Clock,
  ArrowRight,
  PlusCircle,
  Loader2,
} from "lucide-react"

export default function DashboardPage() {
  const { user, loading: userLoading } = useUser()

  const reports = useQuery(
    api.reports.getReportsByUser,
    !userLoading && user?.id ? { userId: user.id } : "skip"
  )

  const stats = useQuery(
    api.reports.getReportStats,
    !userLoading && user?.id ? { userId: user.id } : "skip"
  )

  const isLoading = userLoading || reports === undefined || stats === undefined

  // Get recent analyses (last 3)
  const recentAnalyses = (reports ?? []).slice(0, 3)

  // Calculate stats
  const totalAnalyses = stats?.total ?? 0
  const thisMonth = (reports ?? []).filter((r) => {
    const date = new Date(r.createdAt)
    const now = new Date()
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  }).length

  const lastMonth = (reports ?? []).filter((r) => {
    const date = new Date(r.createdAt)
    const now = new Date()
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    return date.getMonth() === lastMonthDate.getMonth() && date.getFullYear() === lastMonthDate.getFullYear()
  }).length

  const monthlyTrend = lastMonth > 0 ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100) : 0

  // Calculate average severity
  const avgSeverity = (): string => {
    if (!stats || stats.total === 0) return "N/A"
    const severityScore = (stats.lowSeverity * 1 + stats.mediumSeverity * 2 + stats.highSeverity * 3) / stats.total
    if (severityScore <= 1.5) return "Low"
    if (severityScore <= 2.5) return "Medium"
    return "High"
  }

  // Calculate days since last analysis
  const daysSinceLastAnalysis = (): string => {
    if (!reports || reports.length === 0) return "Never"
    const lastReport = reports[0]
    const daysDiff = Math.floor((Date.now() - lastReport.createdAt) / (1000 * 60 * 60 * 24))
    if (daysDiff === 0) return "Today"
    if (daysDiff === 1) return "1 day"
    return `${daysDiff} days`
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return `Today, ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`
    }
    if (diffDays === 1) {
      return `Yesterday, ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
      `, ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor your health analyses and track your wellness journey
          </p>
        </div>
        <Button asChild size="lg" className="gap-2">
          <Link href="/analysis">
            <PlusCircle className="h-5 w-5" />
            Start New Analysis
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Analyses"
          value={totalAnalyses}
          description="Lifetime assessments"
          icon={FileText}
        />
        <StatCard
          title="This Month"
          value={thisMonth}
          icon={Activity}
          trend={lastMonth > 0 ? { value: Math.abs(monthlyTrend), positive: monthlyTrend >= 0 } : undefined}
        />
        <StatCard
          title="Avg. Severity"
          value={avgSeverity()}
          description="Based on recent reports"
          icon={TrendingUp}
        />
        <StatCard
          title="Last Analysis"
          value={daysSinceLastAnalysis()}
          description="Time since last check"
          icon={Clock}
        />
      </div>

      {/* Recent Analyses & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Analyses */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Analyses</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/reports" className="gap-1">
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentAnalyses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileText className="h-10 w-10 text-muted-foreground/50" />
                <p className="mt-3 font-medium">No analyses yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Start your first analysis to see your reports here
                </p>
                <Button asChild className="mt-4">
                  <Link href="/analysis">Start Analysis</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentAnalyses.map((analysis) => (
                  <Link
                    key={analysis._id}
                    href={`/reports/${analysis._id}`}
                    className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-accent"
                  >
                    <div className="space-y-1">
                      <p className="font-medium leading-none">
                        {analysis.symptomInput}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(analysis.createdAt)}
                      </p>
                    </div>
                    <SeverityBadge severity={analysis.severity} />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/analysis">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Symptom Check
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/reports">
                <FileText className="mr-2 h-4 w-4" />
                View Reports
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/analytics">
                <Activity className="mr-2 h-4 w-4" />
                Health Analytics
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Health Tip */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-medium">Health Tip of the Day</p>
            <p className="text-sm text-muted-foreground">
              Stay hydrated and maintain regular sleep patterns to support your
              immune system and overall wellness.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
