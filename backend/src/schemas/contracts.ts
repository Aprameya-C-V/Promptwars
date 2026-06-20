import { z } from "zod";

export const examTypeSchema = z.enum(["NEET", "JEE", "CUET", "CAT", "GATE", "UPSC", "OTHER"]);
export const safetyStatusSchema = z.enum(["ok", "elevated", "crisis"]);
export const energyLevelSchema = z.enum(["low", "medium", "high"]);
export const urgencyLevelSchema = z.enum(["low", "medium", "high"]);

export const journalAnalysisSchema = z.object({
  moodScore: z.number().min(1).max(10),
  energyLevel: energyLevelSchema,
  primaryEmotion: z.string().min(1).max(80),
  stressTriggers: z.array(z.string().min(1).max(120)).max(8),
  hiddenPattern: z.string().max(240).nullable(),
  urgency: urgencyLevelSchema,
  supportiveSummary: z.string().min(1).max(280)
});

export const journalEntrySchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  examType: examTypeSchema.optional(),
  rawText: z.string(),
  quickMood: z.number().min(1).max(10).optional(),
  analysis: journalAnalysisSchema
});

export const companionMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant", "system"]),
  text: z.string(),
  createdAt: z.string()
});

export const copingExerciseSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(120),
  goal: z.string().min(1).max(180),
  durationMinutes: z.number().int().min(1).max(30),
  steps: z.array(z.string().min(1).max(240)).min(2).max(8),
  whyThisHelps: z.string().min(1).max(240)
});

export const analyzeRequestSchema = z.object({
  text: z.string().trim().min(10).max(4000),
  examType: examTypeSchema.optional(),
  quickMood: z.number().min(1).max(10).optional()
});

export const analyzeResponseSchema = z.object({
  analysis: journalAnalysisSchema,
  safety: z.object({
    status: safetyStatusSchema,
    message: z.string().optional()
  })
});

export const companionRequestSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  recentEntries: z.array(journalEntrySchema).max(3).default([]),
  recentMessages: z.array(companionMessageSchema).max(10).default([])
});

export const companionResponseSchema = z.object({
  reply: z.object({
    text: z.string().min(1).max(600)
  }),
  safety: z.object({
    status: safetyStatusSchema,
    message: z.string().optional()
  })
});

export const exerciseRequestSchema = z.object({
  currentAnalysis: journalAnalysisSchema,
  userRequest: z.string().trim().min(1).max(240).optional()
});

export const exerciseResponseSchema = z.object({
  exercise: copingExerciseSchema
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;
export type CompanionRequest = z.infer<typeof companionRequestSchema>;
export type ExerciseRequest = z.infer<typeof exerciseRequestSchema>;

