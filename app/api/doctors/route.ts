import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Exa from "exa-js"

const exa = new Exa(process.env.EXA_API_KEY || "dummy")

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { latitude, longitude } = await req.json()

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: "Latitude and longitude are required" },
        { status: 400 }
      )
    }

    // 1. Fetch Medical Professionals via Exa Search
    // Note: A real implementation might use Google Places API or Yelp API.
    // Exa search can find text matching a local business search query.
    let doctors = []
    try {
      const exaResult = await exa.searchAndContents(
        `medical clinic or hospital near coordinates ${latitude}, ${longitude}`,
        {
          numResults: 3,
          category: "company", // Focus on finding companies
        }
      )

      // Attempt to extract structured info from the text
      doctors = exaResult.results.map(r => ({
        name: r.title || "Local Medical Center",
        address: r.url || `See website near ${latitude}, ${longitude}`,
        contact: "Contact info not reliably available via search."
      }))
    } catch (e) {
      console.error("Exa search failed for doctors", e)
      doctors = [
        {
          name: "Local Urgent Care",
          address: `Searching near ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          contact: "Please search maps for local urgent care."
        }
      ]
    }

    return NextResponse.json({ doctors })
  } catch (error) {
    console.error("Error in doctors:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
