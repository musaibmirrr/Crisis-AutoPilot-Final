import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const getReports = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const reports = await ctx.db
      .query("reports")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect()
    return reports
  },
})

export const getReportById = query({
  args: { reportId: v.id("reports") },
  handler: async (ctx, args) => {
    const report = await ctx.db.get(args.reportId)
    return report
  },
})

export const getReportStats = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const reports = await ctx.db
      .query("reports")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect()

    const total = reports.length
    const lowSeverity = reports.filter((r) => r.severity === "low").length
    const mediumSeverity = reports.filter((r) => r.severity === "medium").length
    const highSeverity = reports.filter((r) => r.severity === "high").length

    return { total, lowSeverity, mediumSeverity, highSeverity }
  },
})

export const createReport = mutation({
  args: {
    userId: v.string(),
    symptomInput: v.string(),
    answers: v.object({
      duration: v.string(),
      severity: v.string(),
      medications: v.string(),
      conditions: v.string(),
      worsening: v.string(),
    }),
    severity: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    structuredReport: v.object({
      explanation: v.string(),
      possibleCauses: v.array(v.string()),
      immediateActions: v.array(v.string()),
      dietRecommendations: v.array(v.string()),
      medications: v.array(v.string()),
      whenToSeekHelp: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const reportId = await ctx.db.insert("reports", {
      userId: args.userId,
      symptomInput: args.symptomInput,
      answers: args.answers,
      severity: args.severity,
      structuredReport: args.structuredReport,
      createdAt: Date.now(),
    })
    return reportId
  },
})

export const deleteReport = mutation({
  args: { reportId: v.id("reports") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.reportId)
  },
})
