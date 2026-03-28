"use client"

import { Button } from "@/components/ui/button"
import { SeverityBadge } from "@/components/dashboard/severity-badge"
import {
  AlertTriangle,
  ArrowRight,
  Pill,
  Utensils,
  Zap,
  HelpCircle,
  Stethoscope,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AnalysisResultsProps {
  results: {
    severity: "low" | "medium" | "high"
    explanation: string
    possibleCauses: string[]
    immediateActions: string[]
    dietRecommendations: string[]
    medications: string[]
    whenToSeekHelp: string
  }
  onContinue: () => void
}

export function AnalysisResults({ results, onContinue }: AnalysisResultsProps) {
  return (
    <div className="space-y-6">
      {/* Severity Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Analysis Complete</h2>
          <p className="text-sm text-muted-foreground">
            Based on your symptoms and responses
          </p>
        </div>
        <SeverityBadge severity={results.severity} className="text-sm" />
      </div>

      {/* Explanation */}
      <div className="rounded-lg border border-border bg-muted/30 p-4">
        <p className="text-sm leading-relaxed text-foreground">
          {results.explanation}
        </p>
      </div>

      {/* Result Sections */}
      <div className="space-y-4">
        <ResultSection
          icon={HelpCircle}
          title="Possible Causes"
          items={results.possibleCauses}
        />
        <ResultSection
          icon={Zap}
          title="Immediate Actions"
          items={results.immediateActions}
          highlight
        />
        <ResultSection
          icon={Utensils}
          title="Diet Recommendations"
          items={results.dietRecommendations}
        />
        <ResultSection
          icon={Pill}
          title="Medications (General Guidance)"
          items={results.medications}
        />
      </div>

      {/* When to Seek Help */}
      <div
        className={cn(
          "rounded-lg border p-4",
          results.severity === "high"
            ? "border-destructive/50 bg-destructive/5"
            : "border-warning/50 bg-warning/5"
        )}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle
            className={cn(
              "mt-0.5 h-5 w-5 shrink-0",
              results.severity === "high"
                ? "text-destructive"
                : "text-warning-foreground"
            )}
          />
          <div className="space-y-1">
            <p className="text-sm font-semibold">When to Seek Medical Help</p>
            <p className="text-sm text-muted-foreground">
              {results.whenToSeekHelp}
            </p>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end pt-2">
        <Button size="lg" className="gap-2" onClick={onContinue}>
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

interface ResultSectionProps {
  icon: typeof Stethoscope
  title: string
  items: string[]
  highlight?: boolean
}

function ResultSection({ icon: Icon, title, items, highlight }: ResultSectionProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border p-4",
        highlight && "border-primary/30 bg-primary/5"
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <Icon
          className={cn("h-5 w-5", highlight ? "text-primary" : "text-muted-foreground")}
        />
        <h3 className="font-medium">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
            <span className="text-muted-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
