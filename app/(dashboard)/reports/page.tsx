"use client"

import Link from "next/link"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUser } from "@/hooks/use-user"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SeverityBadge } from "@/components/dashboard/severity-badge"
import { FileText, Calendar, ChevronRight, Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function ReportsPage() {
  const { user, loading: userLoading } = useUser()
  const [searchQuery, setSearchQuery] = useState("")

  const reports = useQuery(
    api.reports.getReports,
    user?.id ? { userId: user.id } : "skip"
  )

  const stats = useQuery(
    api.reports.getReportStats,
    user?.id ? { userId: user.id } : "skip"
  )

  const isLoading = userLoading || reports === undefined || stats === undefined

  const filteredReports = reports?.filter((report) =>
    report.symptomInput.toLowerCase().includes(searchQuery.toLowerCase())
  ) ?? []

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return {
      date: date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    }
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
            Reports
          </h1>
          <p className="text-muted-foreground">
            View and manage your health analysis history
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{stats?.total ?? 0}</p>
              <p className="text-sm text-muted-foreground">Total Reports</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <FileText className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{stats?.lowSeverity ?? 0}</p>
              <p className="text-sm text-muted-foreground">Low Severity</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <FileText className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{stats?.highSeverity ?? 0}</p>
              <p className="text-sm text-muted-foreground">High Severity</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredReports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium">No reports yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery
                  ? "No reports match your search"
                  : "Start a new analysis to see your reports here"}
              </p>
              {!searchQuery && (
                <Button asChild className="mt-4">
                  <Link href="/analysis">Start Analysis</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredReports.map((report) => {
                const { date, time } = formatDate(report.createdAt)
                return (
                  <Link
                    key={report._id}
                    href={`/reports/${report._id}`}
                    className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-accent lg:p-6"
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-medium">{report.symptomInput}</p>
                        <SeverityBadge severity={report.severity} />
                      </div>
                      <p className="line-clamp-1 text-sm text-muted-foreground">
                        {report.structuredReport.explanation}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          {date} at {time}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                  </Link>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
