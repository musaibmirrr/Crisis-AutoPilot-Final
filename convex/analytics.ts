import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const getAnalytics = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const analytics = await ctx.db
      .query("analytics")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect()
    return analytics
  },
})

export const getAnalyticsSummary = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const reports = await ctx.db
      .query("reports")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect()

    const analytics = await ctx.db
      .query("analytics")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect()

    // Calculate severity distribution
    const severityDistribution = [
      { name: "Low", value: reports.filter((r) => r.severity === "low").length, color: "var(--color-success)" },
      { name: "Medium", value: reports.filter((r) => r.severity === "medium").length, color: "var(--color-warning)" },
      { name: "High", value: reports.filter((r) => r.severity === "high").length, color: "var(--color-destructive)" },
    ]

    // Calculate monthly data (last 6 months)
    const now = Date.now()
    const sixMonthsAgo = now - 6 * 30 * 24 * 60 * 60 * 1000
    const recentReports = reports.filter((r) => r.createdAt >= sixMonthsAgo)

    const monthlyData = getMonthlyData(recentReports)

    // Calculate wellness score based on resolved analytics
    const resolvedCount = analytics.filter((a) => a.resolved).length
    const totalAnalytics = analytics.length
    const wellnessScore = totalAnalytics > 0 ? Math.round((resolvedCount / totalAnalytics) * 100) : 75

    // Calculate severity trend (compare last 30 days to previous 30 days)
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000
    const sixtyDaysAgo = now - 60 * 24 * 60 * 60 * 1000
    
    const recentSeverity = reports
      .filter((r) => r.createdAt >= thirtyDaysAgo)
      .map((r) => severityToNumber(r.severity))
    const previousSeverity = reports
      .filter((r) => r.createdAt >= sixtyDaysAgo && r.createdAt < thirtyDaysAgo)
      .map((r) => severityToNumber(r.severity))

    const avgRecent = recentSeverity.length > 0 ? recentSeverity.reduce((a, b) => a + b, 0) / recentSeverity.length : 0
    const avgPrevious = previousSeverity.length > 0 ? previousSeverity.reduce((a, b) => a + b, 0) / previousSeverity.length : 0
    
    const severityTrend = avgPrevious > 0 ? Math.round(((avgRecent - avgPrevious) / avgPrevious) * 100) : 0

    return {
      severityDistribution,
      monthlyData,
      wellnessScore,
      severityTrend,
      totalReportsThisYear: reports.filter((r) => {
        const reportDate = new Date(r.createdAt)
        return reportDate.getFullYear() === new Date().getFullYear()
      }).length,
    }
  },
})

function severityToNumber(severity: "low" | "medium" | "high"): number {
  switch (severity) {
    case "low": return 1
    case "medium": return 2
    case "high": return 3
  }
}

function getMonthlyData(reports: Array<{ createdAt: number; severity: "low" | "medium" | "high" }>) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const now = new Date()
  const result = []

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthName = months[date.getMonth()]
    const monthReports = reports.filter((r) => {
      const reportDate = new Date(r.createdAt)
      return reportDate.getMonth() === date.getMonth() && reportDate.getFullYear() === date.getFullYear()
    })

    const avgSeverity = monthReports.length > 0
      ? monthReports.map((r) => severityToNumber(r.severity)).reduce((a, b) => a + b, 0) / monthReports.length
      : 0

    result.push({
      month: monthName,
      reports: monthReports.length,
      avgSeverity: Math.round(avgSeverity * 10) / 10,
    })
  }

  return result
}

export const createAnalyticsEntry = mutation({
  args: {
    userId: v.string(),
    issue: v.string(),
    severity: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    resolved: v.boolean(),
  },
  handler: async (ctx, args) => {
    const entryId = await ctx.db.insert("analytics", {
      userId: args.userId,
      issue: args.issue,
      severity: args.severity,
      resolved: args.resolved,
      createdAt: Date.now(),
    })
    return entryId
  },
})

export const markAsResolved = mutation({
  args: { analyticsId: v.id("analytics") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.analyticsId, { resolved: true })
  },
})
