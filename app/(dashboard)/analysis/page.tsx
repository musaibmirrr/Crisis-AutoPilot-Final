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
  questions?: string[]
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
  const [loadingQuestions, setLoadingQuestions] = useState(false)

  const handleSymptomSubmit = async (symptoms: string) => {
    setAnalysisData((prev) => ({ ...prev, symptoms }))
    setLoadingQuestions(true)
    setCurrentStep(2)

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptom: symptoms }),
      })
      const data = await res.json()
      if (data.questions) {
        setAnalysisData((prev) => ({ ...prev, questions: data.questions }))
      }
    } catch (e) {
      console.error("Error fetching questions", e)
    } finally {
      setLoadingQuestions(false)
    }
  }

  const handleQuestionsComplete = async (answers: Record<string, string>) => {
    setAnalysisData((prev) => ({ ...prev, answers }))
    setCurrentStep(3)

    try {
      const res = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptom: analysisData.symptoms, answers }),
      })
      const data = await res.json()

      if (data.report) {
        const results = data.report
        setAnalysisData((prev) => ({ ...prev, results }))
        setCurrentStep(4)

        if (user?.id) {
          try {
            await fetch("/api/report/save", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                symptomInput: analysisData.symptoms,
                answers,
                severity: results.severity,
                structuredReport: {
                  explanation: results.explanation,
                  possibleCauses: results.possible_causes || results.possibleCauses || [],
                  immediateActions: results.immediate_actions || results.immediateActions || [],
                  dietRecommendations: results.diet_recommendations || results.dietRecommendations || [],
                  medications: results.medications || [],
                  whenToSeekHelp: results.when_to_seek_help || results.whenToSeekHelp || "",
                },
              }),
            })
          } catch (error) {
            console.error("Failed to save report:", error)
          }
        }
      } else {
        console.error("No report generated", data.error)
      }
    } catch (e) {
      console.error("Error during triage", e)
    }
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
            loadingQuestions ? (
              <AnalysisLoading />
            ) : (
              <FollowUpQuestions
                symptoms={analysisData.symptoms}
                questions={analysisData.questions || []}
                onComplete={handleQuestionsComplete}
                onBack={() => setCurrentStep(1)}
              />
            )
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
