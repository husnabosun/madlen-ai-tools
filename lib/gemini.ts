import { GoogleGenAI } from '@google/genai'

export const GEMINI_MODEL = 'gemini-3.6-flash'

export function getGemini() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured.')
  return new GoogleGenAI({ apiKey })
}

export function parseJson<T>(value: string | undefined): T {
  if (!value) throw new Error('The AI returned an empty response.')
  return JSON.parse(value) as T
}

export function isQuotaError(error: unknown) {
  return Boolean(error && typeof error === 'object' && 'status' in error && (error.status === 429 || error.status === 403))
}