"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SeverityBadge } from "@/components/dashboard/severity-badge"
import {
  ArrowLeft,
  Calendar,
  Download,
  Share2,
  Printer,
  AlertTriangle,
  Zap,
  Utensils,
  Pill,
  HelpCircle,
  Loader2,
} from "lucide-react"

export default function ReportDetailPage() {
  const params = useParams()
  const reportId = params.id as Id<"reports">

  const report = useQuery(api.reports.getReportById, { reportId })

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

  if (report === undefined) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (report === null) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <Button variant="ghost" asChild className="gap-2">
          <Link href="/reports">
            <ArrowLeft className="h-4 w-4" />
            Back to Reports
          </Link>
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-lg font-medium">Report not found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              This report may have been deleted or does not exist.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { date, time } = formatDate(report.createdAt)

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Back Button */}
      <Button variant="ghost" asChild className="gap-2">
        <Link href="/reports">
          <ArrowLeft className="h-4 w-4" />
          Back to Reports
        </Link>
      </Button>

      {/* Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold lg:text-2xl">
                  {report.symptomInput}
                </h1>
                <SeverityBadge severity={report.severity} className="text-sm" />
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {date} at {time}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Printer className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Original Symptoms */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Original Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {report.symptomInput}
          </p>
        </CardContent>
      </Card>

      {/* Analysis Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Analysis Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">
            {report.structuredReport.explanation}
          </p>
        </CardContent>
      </Card>

      {/* Detailed Sections */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ResultCard
          icon={HelpCircle}
          title="Possible Causes"
          items={report.structuredReport.possibleCauses}
        />
        <ResultCard
          icon={Zap}
          title="Immediate Actions"
          items={report.structuredReport.immediateActions}
          highlight
        />
        <ResultCard
          icon={Utensils}
          title="Diet Recommendations"
          items={report.structuredReport.dietRecommendations}
        />
        <ResultCard
          icon={Pill}
          title="Medications"
          items={report.structuredReport.medications}
        />
      </div>

      {/* When to Seek Help */}
      <Card className="border-destructive/30 bg-destructive/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div className="space-y-1">
              <p className="font-semibold">When to Seek Medical Help</p>
              <p className="text-sm text-muted-foreground">
                {report.structuredReport.whenToSeekHelp}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Your Responses */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Responses</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 sm:grid-cols-2">
            {Object.entries(report.answers).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </dt>
                <dd className="text-sm">{value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}

function ResultCard({
  icon: Icon,
  title,
  items,
  highlight,
}: {
  icon: typeof HelpCircle
  title: string
  items: string[]
  highlight?: boolean
}) {
  return (
    <Card className={highlight ? "border-primary/30 bg-primary/5" : ""}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon
            className={`h-5 w-5 ${highlight ? "text-primary" : "text-muted-foreground"}`}
          />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
