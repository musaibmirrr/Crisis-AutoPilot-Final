"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUser } from "@/hooks/use-user"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts"
import { TrendingUp, TrendingDown, Activity, Loader2 } from "lucide-react"

// Fallback wellness data (will be replaced with real data in production)
const defaultWellnessData = [
  { week: "W1", score: 65 },
  { week: "W2", score: 70 },
  { week: "W3", score: 62 },
  { week: "W4", score: 75 },
  { week: "W5", score: 72 },
  { week: "W6", score: 80 },
  { week: "W7", score: 78 },
  { week: "W8", score: 85 },
]

export default function AnalyticsPage() {
  const { user, loading: userLoading } = useUser()
  const [feelingBetter, setFeelingBetter] = useState(false)

  const analyticsSummary = useQuery(
    api.analytics.getAnalyticsSummary,
    user?.id ? { userId: user.id } : "skip"
  )

  const createAnalyticsEntry = useMutation(api.analytics.createAnalyticsEntry)

  const handleFeelingBetterChange = async (checked: boolean) => {
    setFeelingBetter(checked)
    if (user?.id && checked) {
      await createAnalyticsEntry({
        userId: user.id,
        issue: "Daily wellness check-in",
        severity: "low",
        resolved: true,
      })
    }
  }

  const isLoading = userLoading || analyticsSummary === undefined

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const severityData = analyticsSummary?.severityDistribution ?? [
    { name: "Low", value: 0, color: "var(--color-success)" },
    { name: "Medium", value: 0, color: "var(--color-warning)" },
    { name: "High", value: 0, color: "var(--color-destructive)" },
  ]

  const monthlyData = analyticsSummary?.monthlyData ?? []
  const wellnessScore = analyticsSummary?.wellnessScore ?? 75
  const severityTrend = analyticsSummary?.severityTrend ?? 0
  const totalReportsThisYear = analyticsSummary?.totalReportsThisYear ?? 0

  // Generate wellness data based on the wellness score
  const wellnessData = defaultWellnessData.map((item, index) => ({
    ...item,
    score: Math.max(0, Math.min(100, wellnessScore - (defaultWellnessData.length - 1 - index) * 3 + Math.random() * 10)),
  }))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
            Analytics
          </h1>
          <p className="text-muted-foreground">
            Track your health patterns and trends over time
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
          <Label
            htmlFor="feeling-better"
            className="cursor-pointer text-sm font-medium"
          >
            Feeling better today?
          </Label>
          <Switch
            id="feeling-better"
            checked={feelingBetter}
            onCheckedChange={handleFeelingBetterChange}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
              {severityTrend <= 0 ? (
                <TrendingDown className="h-6 w-6 text-success" />
              ) : (
                <TrendingUp className="h-6 w-6 text-destructive" />
              )}
            </div>
            <div>
              <p className="text-2xl font-bold">
                {severityTrend <= 0 ? "" : "+"}
                {severityTrend}%
              </p>
              <p className="text-sm text-muted-foreground">
                Severity trend (30 days)
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalReportsThisYear}</p>
              <p className="text-sm text-muted-foreground">
                Total analyses this year
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{wellnessScore}</p>
              <p className="text-sm text-muted-foreground">Wellness score</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Severity Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Severity Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center gap-6">
              {severityData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reports Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Reports Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="reports"
                    fill="var(--color-primary)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wellness Trend */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Wellness Trend</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              1M
            </Button>
            <Button variant="secondary" size="sm">
              3M
            </Button>
            <Button variant="outline" size="sm">
              6M
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={wellnessData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="week"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  domain={[0, 100]}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="score"
                  name="Wellness Score"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-primary)", strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <h3 className="font-semibold">Key Insights</h3>
          <ul className="mt-3 space-y-2">
            <li className="flex items-start gap-2 text-sm">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span className="text-muted-foreground">
                {severityTrend <= 0
                  ? `Your average severity has decreased by ${Math.abs(severityTrend)}% over the past 30 days`
                  : `Your average severity has increased by ${severityTrend}% over the past 30 days`}
              </span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span className="text-muted-foreground">
                {severityData[0].value >= severityData[2].value
                  ? "Most analyses are in the low severity category, indicating good overall health monitoring"
                  : "Consider focusing on preventive care to reduce high severity cases"}
              </span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span className="text-muted-foreground">
                Your wellness score is {wellnessScore} - {wellnessScore >= 80 ? "excellent" : wellnessScore >= 60 ? "good" : "needs attention"}
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
