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
  questions: string[]
  onComplete: (answers: Record<string, string>) => void
  onBack: () => void
}

export function FollowUpQuestions({
  questions,
  onComplete,
  onBack,
}: FollowUpQuestionsProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  if (!questions || questions.length === 0) {
    return <div>Loading questions...</div>
  }

  const questionText = questions[currentQuestion]
  const questionId = `q${currentQuestion}`
  const isLastQuestion = currentQuestion === questions.length - 1
  const hasAnswer = Boolean(answers[questionText])

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
    setAnswers((prev) => ({ ...prev, [questionText]: value }))
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
        <h2 className="text-xl font-semibold">{questionText}</h2>

        <div className="space-y-2">
          <Label htmlFor={questionId} className="sr-only">
            {questionText}
          </Label>
          <Input
            id={questionId}
            value={answers[questionText] || ""}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="h-12 text-base"
          />
        </div>
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
