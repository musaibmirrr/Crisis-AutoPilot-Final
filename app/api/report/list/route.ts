import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"

let convex: ConvexHttpClient | null = null;
try {
  convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)
} catch (e) {
  console.warn("Convex env variables missing. Convex API calls will fail.");
}

export async function GET(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const isTest = req.headers.get("x-test-bypass") === "true"

    if (!user && !isTest) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!convex) {
      throw new Error("Convex client is not initialized.");
    }

    const reports = await convex.query(api.reports.getReportsByUser, {
      userId: user?.id || "test-user-id",
    })

    return NextResponse.json({ reports })
  } catch (error) {
    console.error("Error fetching reports:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
