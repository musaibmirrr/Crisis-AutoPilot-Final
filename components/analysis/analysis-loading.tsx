"use client"

import { Activity, Database, Brain, Shield } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

const steps = [
  { icon: Database, label: "Cross-referencing medical databases" },
  { icon: Brain, label: "Analyzing symptom patterns" },
  { icon: Shield, label: "Verifying with clinical guidelines" },
  { icon: Activity, label: "Generating personalized insights" },
]

export function AnalysisLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="relative">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Spinner className="h-10 w-10 text-primary" />
        </div>
        <div className="absolute -inset-4 animate-pulse rounded-full border-2 border-primary/20" />
      </div>

      <h2 className="mt-8 text-xl font-semibold">
        Analyzing using verified medical data...
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        This typically takes a few seconds
      </p>

      <div className="mt-8 w-full max-w-sm space-y-3">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <div
              key={step.label}
              className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3 text-left"
              style={{
                animationDelay: `${index * 500}ms`,
              }}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">{step.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
