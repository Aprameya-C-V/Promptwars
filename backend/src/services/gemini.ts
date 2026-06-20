import { GoogleGenAI, Modality } from "@google/genai";
import { z } from "zod";
import { GEMINI_LIVE_MODEL } from "../config/models.js";
import { buildLiveSystemInstruction } from "../prompts/live.js";

type GenerateStructuredOptions<TSchema extends z.ZodTypeAny> = {
  model: string;
  prompt: string;
  schema: TSchema;
};

function toJsonSchema(schema: z.ZodTypeAny): Record<string, unknown> {
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    const properties: Record<string, unknown> = {};
    const required: string[] = [];

    for (const key of Object.keys(shape)) {
      const child = shape[key];
      const json = toJsonSchema(child);
      properties[key] = json;
      if (!(child instanceof z.ZodOptional)) {
        required.push(key);
      }
    }

    return { type: "object", properties, required };
  }

  if (schema instanceof z.ZodString) return { type: "string" };
  if (schema instanceof z.ZodNumber) return { type: "number" };
  if (schema instanceof z.ZodArray) return { type: "array", items: toJsonSchema(schema.element) };
  if (schema instanceof z.ZodEnum) return { type: "string", enum: schema.options };
  if (schema instanceof z.ZodNullable) return { anyOf: [toJsonSchema(schema.unwrap()), { type: "null" }] };
  if (schema instanceof z.ZodOptional) return toJsonSchema(schema.unwrap());

  return { type: "string" };
}

export class GeminiService {
  private readonly client: GoogleGenAI | null;
  private readonly liveTokenClient: GoogleGenAI | null;

  constructor(apiKey: string | undefined) {
    this.client = apiKey ? new GoogleGenAI({ apiKey }) : null;
    this.liveTokenClient = apiKey
      ? new GoogleGenAI({
          apiKey,
          apiVersion: "v1alpha"
        })
      : null;
  }

  async generateStructured<TSchema extends z.ZodTypeAny>({
    model,
    prompt,
    schema
  }: GenerateStructuredOptions<TSchema>): Promise<z.infer<TSchema>> {
    if (!this.client) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const response = await this.client.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: toJsonSchema(schema)
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Gemini returned an empty response");
    }

    const parsed = JSON.parse(text);
    return schema.parse(parsed);
  }

  async createLiveEphemeralToken() {
    if (!this.liveTokenClient) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const token = await this.liveTokenClient.authTokens.create({
      config: {
        uses: 1,
        liveConnectConstraints: {
          model: GEMINI_LIVE_MODEL,
          config: {
            responseModalities: [Modality.AUDIO],
            systemInstruction: buildLiveSystemInstruction(),
            inputAudioTranscription: {},
            outputAudioTranscription: {}
          }
        },
        lockAdditionalFields: [
          "responseModalities",
          "systemInstruction",
          "inputAudioTranscription",
          "outputAudioTranscription"
        ]
      }
    });

    if (!token.name) {
      throw new Error("Gemini did not return an ephemeral token");
    }

    return {
      token: token.name
    };
  }
}

export const geminiService = new GeminiService(process.env.GEMINI_API_KEY);
