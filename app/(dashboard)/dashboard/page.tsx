import Link from "next/link"
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
} from "lucide-react"

// Mock data for recent analyses
const recentAnalyses = [
  {
    id: 1,
    symptom: "Persistent headache with mild fever",
    severity: "medium" as const,
    date: "Today, 2:30 PM",
  },
  {
    id: 2,
    symptom: "Mild chest discomfort after exercise",
    severity: "low" as const,
    date: "Yesterday, 10:15 AM",
  },
  {
    id: 3,
    symptom: "Severe abdominal pain with nausea",
    severity: "high" as const,
    date: "Mar 25, 9:00 AM",
  },
]

export default function DashboardPage() {
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
          value={24}
          description="Lifetime assessments"
          icon={FileText}
        />
        <StatCard
          title="This Month"
          value={8}
          icon={Activity}
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title="Avg. Severity"
          value="Low"
          description="Based on recent reports"
          icon={TrendingUp}
        />
        <StatCard
          title="Last Analysis"
          value="2 days"
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
            <div className="space-y-4">
              {recentAnalyses.map((analysis) => (
                <Link
                  key={analysis.id}
                  href={`/reports/${analysis.id}`}
                  className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-accent"
                >
                  <div className="space-y-1">
                    <p className="font-medium leading-none">
                      {analysis.symptom}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {analysis.date}
                    </p>
                  </div>
                  <SeverityBadge severity={analysis.severity} />
                </Link>
              ))}
            </div>
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
