import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "https://dummy.convex.cloud")

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { symptomInput, answers, severity, structuredReport } = await req.json()

    if (!symptomInput || !answers || !severity || !structuredReport) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Convert answers object to array as per schema requirement
    const answersArray = Object.entries(answers).map(([key, value]) => ({
      question: key,
      answer: String(value)
    }))

    // Use Convex Client to execute mutations directly
    const reportId = await convex.mutation(api.reports.createReport, {
      userId: user.id,
      symptomInput,
      answers: answersArray as any, // We will update the schema to array shortly
      severity,
      structuredReport,
    })

    // Also update analytics based on the created report
    await convex.mutation(api.analytics.updateAnalytics, {
      userId: user.id,
      issue: symptomInput,
      severity,
      resolved: false,
    })

    return NextResponse.json({ success: true, reportId })
  } catch (error) {
    console.error("Error saving report:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
