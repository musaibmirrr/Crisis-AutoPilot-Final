import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  reports: defineTable({
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
    createdAt: v.number(),
  }).index("by_user", ["userId"]).index("by_user_created", ["userId", "createdAt"]),

  analytics: defineTable({
    userId: v.string(),
    issue: v.string(),
    severity: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    resolved: v.boolean(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
})
