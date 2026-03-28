"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface FollowUpQuestionsProps {
  symptoms: string
  onComplete: (answers: Record<string, string>) => void
  onBack: () => void
}

const questions = [
  {
    id: "duration",
    question: "How long have you been experiencing these symptoms?",
    type: "choice" as const,
    options: [
      "Less than 24 hours",
      "1-3 days",
      "4-7 days",
      "More than a week",
    ],
  },
  {
    id: "severity",
    question: "How would you rate the severity of your symptoms?",
    type: "choice" as const,
    options: ["Mild - noticeable but not bothersome", "Moderate - affecting daily activities", "Severe - significantly impacting life", "Very severe - unbearable"],
  },
  {
    id: "medications",
    question: "Are you currently taking any medications?",
    type: "text" as const,
    placeholder: "List any medications or supplements, or type 'None'",
  },
  {
    id: "conditions",
    question: "Do you have any pre-existing medical conditions?",
    type: "choice" as const,
    options: [
      "No known conditions",
      "Heart or cardiovascular issues",
      "Diabetes",
      "Respiratory conditions",
      "Other chronic conditions",
    ],
  },
  {
    id: "worsening",
    question: "Have your symptoms been getting worse, staying the same, or improving?",
    type: "choice" as const,
    options: ["Getting worse", "Staying the same", "Slowly improving", "Fluctuating"],
  },
]

export function FollowUpQuestions({
  onComplete,
  onBack,
}: FollowUpQuestionsProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const question = questions[currentQuestion]
  const isLastQuestion = currentQuestion === questions.length - 1
  const hasAnswer = Boolean(answers[question.id])

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete(answers)
    } else {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion === 0) {
      onBack()
    } else {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-muted-foreground">
            {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
            complete
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{question.question}</h2>

        {question.type === "choice" && (
          <RadioGroup
            value={answers[question.id] || ""}
            onValueChange={handleAnswer}
            className="space-y-3"
          >
            {question.options?.map((option) => (
              <label
                key={option}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-accent",
                  answers[question.id] === option &&
                    "border-primary bg-primary/5"
                )}
              >
                <RadioGroupItem value={option} id={option} />
                <span className="text-sm font-medium">{option}</span>
                {answers[question.id] === option && (
                  <Check className="ml-auto h-4 w-4 text-primary" />
                )}
              </label>
            ))}
          </RadioGroup>
        )}

        {question.type === "text" && (
          <div className="space-y-2">
            <Label htmlFor={question.id} className="sr-only">
              {question.question}
            </Label>
            <Input
              id={question.id}
              value={answers[question.id] || ""}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder={question.placeholder}
              className="h-12 text-base"
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <Button variant="outline" onClick={handlePrevious} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!hasAnswer}
          className="gap-2"
        >
          {isLastQuestion ? "Analyze" : "Next"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
