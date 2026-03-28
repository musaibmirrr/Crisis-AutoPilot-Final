"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUser } from "@/hooks/use-user"
import { SymptomInput } from "@/components/analysis/symptom-input"
import { FollowUpQuestions } from "@/components/analysis/follow-up-questions"
import { AnalysisLoading } from "@/components/analysis/analysis-loading"
import { AnalysisResults } from "@/components/analysis/analysis-results"
import { AnalysisActions } from "@/components/analysis/analysis-actions"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type AnalysisStep = 1 | 2 | 3 | 4 | 5

export interface AnalysisData {
  symptoms: string
  answers: Record<string, string>
  results?: {
    severity: "low" | "medium" | "high"
    explanation: string
    possibleCauses: string[]
    immediateActions: string[]
    dietRecommendations: string[]
    medications: string[]
    whenToSeekHelp: string
  }
}

const steps = [
  { id: 1, label: "Describe" },
  { id: 2, label: "Questions" },
  { id: 3, label: "Analyzing" },
  { id: 4, label: "Results" },
  { id: 5, label: "Actions" },
]

export default function AnalysisPage() {
  const { user } = useUser()
  const [currentStep, setCurrentStep] = useState<AnalysisStep>(1)
  const [analysisData, setAnalysisData] = useState<AnalysisData>({
    symptoms: "",
    answers: {},
  })

  const createReport = useMutation(api.reports.createReport)
  const createAnalyticsEntry = useMutation(api.analytics.createAnalyticsEntry)

  const handleSymptomSubmit = (symptoms: string) => {
    setAnalysisData((prev) => ({ ...prev, symptoms }))
    setCurrentStep(2)
  }

  const handleQuestionsComplete = async (answers: Record<string, string>) => {
    setAnalysisData((prev) => ({ ...prev, answers }))
    setCurrentStep(3)

    // Simulate analysis delay
    setTimeout(async () => {
      const results = {
        severity: "medium" as const,
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
      }

      setAnalysisData((prev) => ({ ...prev, results }))
      setCurrentStep(4)

      // Save report to Convex
      if (user?.id) {
        try {
          await createReport({
            userId: user.id,
            symptomInput: analysisData.symptoms,
            answers: {
              duration: answers.duration || "Not specified",
              severity: answers.severity || "Not specified",
              medications: answers.medications || "None",
              conditions: answers.conditions || "None",
              worsening: answers.worsening || "Not specified",
            },
            severity: results.severity,
            structuredReport: {
              explanation: results.explanation,
              possibleCauses: results.possibleCauses,
              immediateActions: results.immediateActions,
              dietRecommendations: results.dietRecommendations,
              medications: results.medications,
              whenToSeekHelp: results.whenToSeekHelp,
            },
          })

          // Also create an analytics entry
          await createAnalyticsEntry({
            userId: user.id,
            issue: analysisData.symptoms,
            severity: results.severity,
            resolved: false,
          })
        } catch (error) {
          console.error("Failed to save report:", error)
        }
      }
    }, 3000)
  }

  const handleStartOver = () => {
    setCurrentStep(1)
    setAnalysisData({ symptoms: "", answers: {} })
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
          New Analysis
        </h1>
        <p className="text-muted-foreground">
          Describe your symptoms for an AI-powered assessment
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                  currentStep >= step.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {step.id}
              </div>
              <span
                className={cn(
                  "mt-1 hidden text-xs sm:block",
                  currentStep >= step.id
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-0.5 w-8 sm:w-16 lg:w-24",
                  currentStep > step.id ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {currentStep === 1 && (
            <SymptomInput onSubmit={handleSymptomSubmit} />
          )}
          {currentStep === 2 && (
            <FollowUpQuestions
              symptoms={analysisData.symptoms}
              onComplete={handleQuestionsComplete}
              onBack={() => setCurrentStep(1)}
            />
          )}
          {currentStep === 3 && <AnalysisLoading />}
          {currentStep === 4 && analysisData.results && (
            <AnalysisResults
              results={analysisData.results}
              onContinue={() => setCurrentStep(5)}
            />
          )}
          {currentStep === 5 && (
            <AnalysisActions onStartOver={handleStartOver} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
