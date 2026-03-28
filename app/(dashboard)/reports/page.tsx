import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SeverityBadge } from "@/components/dashboard/severity-badge"
import { FileText, Calendar, ChevronRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

// Mock data for reports
const reports = [
  {
    id: "1",
    symptom: "Persistent headache with mild fever",
    severity: "medium" as const,
    date: "March 28, 2026",
    time: "2:30 PM",
    summary:
      "Moderate condition requiring monitoring. Possible viral infection.",
  },
  {
    id: "2",
    symptom: "Mild chest discomfort after exercise",
    severity: "low" as const,
    date: "March 27, 2026",
    time: "10:15 AM",
    summary: "Likely muscle strain. Rest recommended.",
  },
  {
    id: "3",
    symptom: "Severe abdominal pain with nausea",
    severity: "high" as const,
    date: "March 25, 2026",
    time: "9:00 AM",
    summary: "Urgent attention advised. Medical consultation recommended.",
  },
  {
    id: "4",
    symptom: "Recurring fatigue and muscle weakness",
    severity: "medium" as const,
    date: "March 22, 2026",
    time: "3:45 PM",
    summary: "May indicate vitamin deficiency or sleep issues.",
  },
  {
    id: "5",
    symptom: "Mild skin rash on forearms",
    severity: "low" as const,
    date: "March 18, 2026",
    time: "11:00 AM",
    summary: "Possible allergic reaction. Monitor for changes.",
  },
  {
    id: "6",
    symptom: "Persistent cough with mild congestion",
    severity: "low" as const,
    date: "March 15, 2026",
    time: "8:30 AM",
    summary: "Common cold symptoms. Rest and hydration advised.",
  },
]

export default function ReportsPage() {
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
          <Input placeholder="Search reports..." className="pl-9" />
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
              <p className="text-2xl font-semibold">{reports.length}</p>
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
              <p className="text-2xl font-semibold">
                {reports.filter((r) => r.severity === "low").length}
              </p>
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
              <p className="text-2xl font-semibold">
                {reports.filter((r) => r.severity === "high").length}
              </p>
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
          <div className="divide-y divide-border">
            {reports.map((report) => (
              <Link
                key={report.id}
                href={`/reports/${report.id}`}
                className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-accent lg:p-6"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-medium">{report.symptom}</p>
                    <SeverityBadge severity={report.severity} />
                  </div>
                  <p className="line-clamp-1 text-sm text-muted-foreground">
                    {report.summary}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {report.date} at {report.time}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Load More */}
      <div className="flex justify-center">
        <Button variant="outline">Load More Reports</Button>
      </div>
    </div>
  )
}
