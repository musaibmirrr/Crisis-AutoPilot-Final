"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Download, RefreshCw, Check, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnalysisActionsProps {
  onStartOver: () => void
}

export function AnalysisActions({ onStartOver }: AnalysisActionsProps) {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    // In production, this would save to a database
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">What would you like to do next?</h2>
        <p className="text-sm text-muted-foreground">
          Choose from the options below to continue your health journey
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Find Doctors */}
        <Card className="group cursor-pointer transition-all hover:border-primary hover:shadow-md">
          <CardContent className="p-6">
            <a
              href="https://www.google.com/maps/search/doctors+near+me"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                <MapPin className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold">Find Nearby Doctors</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Locate healthcare providers in your area
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                Open Maps
                <ExternalLink className="h-3.5 w-3.5" />
              </div>
            </a>
          </CardContent>
        </Card>

        {/* Save Report */}
        <Card
          className={cn(
            "group cursor-pointer transition-all",
            saved
              ? "border-success/50 bg-success/5"
              : "hover:border-primary hover:shadow-md"
          )}
          onClick={handleSave}
        >
          <CardContent className="flex flex-col items-center p-6 text-center">
            <div
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-full transition-colors",
                saved
                  ? "bg-success/20"
                  : "bg-primary/10 group-hover:bg-primary/20"
              )}
            >
              {saved ? (
                <Check className="h-7 w-7 text-success" />
              ) : (
                <Download className="h-7 w-7 text-primary" />
              )}
            </div>
            <h3 className="mt-4 font-semibold">
              {saved ? "Report Saved!" : "Save Report"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {saved
                ? "Access it anytime from your Reports"
                : "Keep a copy for your records"}
            </p>
            {saved && (
              <div className="mt-4 text-sm font-medium text-success">
                View in Reports
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Start Over */}
      <div className="flex flex-col items-center gap-4 pt-4">
        <div className="h-px w-full bg-border" />
        <Button
          variant="outline"
          size="lg"
          className="gap-2"
          onClick={onStartOver}
        >
          <RefreshCw className="h-4 w-4" />
          Start New Analysis
        </Button>
      </div>
    </div>
  )
}
