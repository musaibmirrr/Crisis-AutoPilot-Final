import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "dummy", // In actual usage, configure this env var
})

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { symptom } = await req.json()

    if (!symptom) {
      return NextResponse.json({ error: "Symptom is required" }, { status: 400 })
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a medical triage assistant. Your goal is to generate 3-5 simple, relevant follow-up questions to understand a patient's symptoms better. Return ONLY a valid JSON array of strings, where each string is a question. Do not include any other text, markdown formatting, or explanations.",
        },
        {
          role: "user",
          content: `My symptom is: ${symptom}`,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.1,
      response_format: { type: "json_object" },
    })

    const rawContent = completion.choices[0]?.message?.content || "[]"

    // Attempt to parse if the model didn't return a pure array
    let questions: string[] = []
    try {
      const parsed = JSON.parse(rawContent)
      if (Array.isArray(parsed)) {
        questions = parsed
      } else if (parsed && typeof parsed === "object") {
        // Fallback if wrapped in an object
        const values = Object.values(parsed)
        const possibleArray = values.find(Array.isArray)
        if (possibleArray) {
          questions = possibleArray
        } else {
          questions = []
        }
      }
    } catch (e) {
      console.error("Failed to parse Groq response:", rawContent)
      questions = [
        "How long have you been experiencing this symptom?",
        "How severe is the symptom on a scale of 1-10?",
        "Are there any other symptoms you are experiencing?"
      ]
    }

    // Default fallback if we somehow still don't have questions
    if (!questions || questions.length === 0) {
      questions = [
        "How long have you been experiencing this symptom?",
        "How severe is the symptom on a scale of 1-10?",
        "Are there any other symptoms you are experiencing?"
      ]
    }

    return NextResponse.json({ questions })
  } catch (error) {
    console.error("Error generating questions:", error)
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 }
    )
  }
}
