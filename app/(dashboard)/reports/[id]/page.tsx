import Link from "next/link"
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
} from "lucide-react"

// Mock report data - in production, this would be fetched based on the ID
const reportData = {
  id: "1",
  symptom: "Persistent headache with mild fever",
  severity: "medium" as const,
  date: "March 28, 2026",
  time: "2:30 PM",
  description:
    "I have had a persistent headache for the past 2 days, mostly in the front of my head. It gets worse in the afternoon. I also feel slightly nauseous and have had a mild fever around 99°F.",
  analysis: {
    explanation:
      "Based on your symptoms and responses, this appears to be a moderate condition that should be monitored closely. The combination of symptoms suggests a possible viral infection or inflammatory response.",
    possibleCauses: [
      "Viral infection (common cold or flu)",
      "Tension headache with secondary symptoms",
      "Mild dehydration affecting multiple systems",
      "Stress-related physical manifestation",
    ],
    immediateActions: [
      "Rest and ensure adequate sleep (7-9 hours)",
      "Stay well hydrated with water and electrolytes",
      "Monitor temperature every 4-6 hours",
      "Avoid strenuous physical activity",
    ],
    dietRecommendations: [
      "Light, easily digestible foods",
      "Warm broths and soups",
      "Fresh fruits rich in Vitamin C",
      "Avoid caffeine and alcohol",
    ],
    medications: [
      "Over-the-counter pain relievers (acetaminophen or ibuprofen)",
      "Antihistamines if congestion is present",
      "Throat lozenges for sore throat relief",
    ],
    whenToSeekHelp:
      "Seek immediate medical attention if: fever exceeds 103°F (39.4°C), symptoms persist beyond 7 days, you experience difficulty breathing, severe chest pain, or confusion.",
  },
  answers: {
    duration: "1-3 days",
    severity: "Moderate - affecting daily activities",
    medications: "None",
    conditions: "No known conditions",
    worsening: "Staying the same",
  },
}

export default function ReportDetailPage() {
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
                  {reportData.symptom}
                </h1>
                <SeverityBadge
                  severity={reportData.severity}
                  className="text-sm"
                />
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {reportData.date} at {reportData.time}
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
            {reportData.description}
          </p>
        </CardContent>
      </Card>

      {/* Analysis Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Analysis Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{reportData.analysis.explanation}</p>
        </CardContent>
      </Card>

      {/* Detailed Sections */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ResultCard
          icon={HelpCircle}
          title="Possible Causes"
          items={reportData.analysis.possibleCauses}
        />
        <ResultCard
          icon={Zap}
          title="Immediate Actions"
          items={reportData.analysis.immediateActions}
          highlight
        />
        <ResultCard
          icon={Utensils}
          title="Diet Recommendations"
          items={reportData.analysis.dietRecommendations}
        />
        <ResultCard
          icon={Pill}
          title="Medications"
          items={reportData.analysis.medications}
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
                {reportData.analysis.whenToSeekHelp}
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
            {Object.entries(reportData.answers).map(([key, value]) => (
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
