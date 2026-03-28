"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, AlertCircle } from "lucide-react"

interface SymptomInputProps {
  onSubmit: (symptoms: string) => void
}

export function SymptomInput({ onSubmit }: SymptomInputProps) {
  const [symptoms, setSymptoms] = useState("")

  const handleSubmit = () => {
    if (symptoms.trim().length > 10) {
      onSubmit(symptoms.trim())
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Describe Your Symptoms</h2>
        <p className="text-sm text-muted-foreground">
          Please describe what you are experiencing in detail. Include when the
          symptoms started, their intensity, and any related observations.
        </p>
      </div>

      <Textarea
        placeholder="Example: I have had a persistent headache for the past 2 days, mostly in the front of my head. It gets worse in the afternoon. I also feel slightly nauseous and have had a mild fever around 99°F..."
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
        className="min-h-[180px] resize-none text-base leading-relaxed"
      />

      <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/50 p-4">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div className="space-y-1">
          <p className="text-sm font-medium">Medical Disclaimer</p>
          <p className="text-xs text-muted-foreground">
            This tool provides general health information only and is not a
            substitute for professional medical advice. Always consult a
            healthcare provider for medical concerns.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          size="lg"
          className="gap-2"
          onClick={handleSubmit}
          disabled={symptoms.trim().length <= 10}
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
