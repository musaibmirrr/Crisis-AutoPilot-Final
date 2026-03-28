"use client"

import { ConvexProvider, ConvexReactClient } from "convex/react"
import { ReactNode } from "react"

// Ensure we don't crash Next.js SSG/builds if the URL is completely missing.
// We fallback to a dummy URL but only during build or if truly not configured,
// and it'll fail at runtime gracefully instead of completely bricking Next.js routing.
const url = process.env.NEXT_PUBLIC_CONVEX_URL || "https://dummy.convex.cloud"
const convex = new ConvexReactClient(url)

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>
}
