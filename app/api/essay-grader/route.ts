import { NextResponse } from 'next/server'
import { PDFParse } from 'pdf-parse'
import { GEMINI_MODEL, getGemini, isQuotaError, parseJson } from '@/lib/gemini'
import type { EssayGrade } from '@/lib/types'

export const runtime = 'nodejs'
const MAX_FILE_SIZE = 10 * 1024 * 1024
const allowedTypes = new Set(['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'])
const insufficientMessage = "There isn't enough writing here to provide a meaningful assessment yet. Add a few complete sentences that develop your idea, then try again."

function jsonError(code: string, error: string, status: number) {
  return NextResponse.json({ error, code }, { status })
}

const criterionSchema = { type: 'object', additionalProperties: false, required: ['score', 'maxScore', 'explanation', 'deductions'], properties: { score: { type: 'number', minimum: 0, maximum: 25 }, maxScore: { type: 'number', minimum: 25, maximum: 25 }, explanation: { type: 'string' }, deductions: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['points', 'reason'], properties: { points: { type: 'number', minimum: 0, maximum: 25 }, reason: { type: 'string' } } } } } }
const schema = { type: 'object', additionalProperties: false, required: ['insufficientContent', 'insufficientReason', 'overallScore', 'criteria', 'actionableFeedback', 'inlineFeedback', 'studentSummary'], properties: {
  insufficientContent: { type: 'boolean' }, insufficientReason: { type: 'string' }, overallScore: { type: 'number', nullable: true },
  criteria: { type: 'object', nullable: true, additionalProperties: false, required: ['contentArgument', 'organization', 'clarity', 'languageMechanics'], properties: { contentArgument: criterionSchema, organization: criterionSchema, clarity: criterionSchema, languageMechanics: criterionSchema } },
  actionableFeedback: { type: 'array', items: { type: 'string' } },
  inlineFeedback: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['excerpt', 'feedback'], properties: { excerpt: { type: 'string' }, feedback: { type: 'string' } } } },
  studentSummary: { type: 'string' },
} }

function insufficientResult(): EssayGrade {
  return { insufficientContent: true, insufficientReason: insufficientMessage, overallScore: null, criteria: null, actionableFeedback: [], inlineFeedback: [], studentSummary: insufficientMessage }
}

function isInsufficientText(text: string) {
  const words = text.toLowerCase().match(/[\p{L}\p{N}]+/gu) || []
  const meaningfulWords = words.filter((word) => word.length > 1)
  const uniqueWords = new Set(meaningfulWords)
  const hasMostlyGibberish = meaningfulWords.length > 3 && meaningfulWords.filter((word) => /[aeiouyıiouöüə]/i.test(word)).length < meaningfulWords.length * 0.4
  return meaningfulWords.length < 20 || uniqueWords.size < Math.max(3, meaningfulWords.length * 0.4) || hasMostlyGibberish
}

function validateGrade(grade: EssayGrade) {
  if (grade.insufficientContent) return grade
  if (!grade.criteria || grade.overallScore === null) throw new Error('The AI returned an incomplete grading rubric.')
  const criteria = Object.values(grade.criteria)
  const scoreTotal = criteria.reduce((total, criterion) => total + criterion.score, 0)
  if (criteria.length !== 4 || grade.overallScore !== scoreTotal || criteria.some((criterion) => criterion.maxScore !== 25 || criterion.score < 0 || criterion.score > 25 || criterion.deductions.reduce((total, deduction) => total + deduction.points, 0) !== 25 - criterion.score || (criterion.score === 25 && criterion.deductions.length > 0))) {
    throw new Error('The AI returned an inconsistent grading rubric.')
  }
  return grade
}

function parseEssayGrade(text: string | undefined, source: string) {
  console.info('[essay-grader] JSON parsing start', { source, hasText: Boolean(text), textLength: text?.length ?? 0 })
  try {
    return validateGrade(parseJson<EssayGrade>(text))
  } catch (error) {
    console.error('[essay-grader] JSON parsing failure', { source, error: getSafeError(error) })
    throw error
  }
}

function getSafeError(error: unknown) {
  if (!error || typeof error !== 'object') return { message: 'Unknown error' }
  const providerError = error as { name?: string; status?: number; message?: string }
  return { name: providerError.name, status: providerError.status, message: providerError.message?.slice(0, 300) }
}

async function grade(essay: string, source: string) {
  console.info('[essay-grader] Gemini request start', { source, model: GEMINI_MODEL })
  const response = await getGemini().models.generateContent({ model: GEMINI_MODEL, contents: `Evaluate the submitted student essay from ${source}. Base every judgment only on evidence in the essay. Return the exact JSON schema requested.\n\n${essay}`, config: { systemInstruction: `You are Madlen Essay Grader, a constructive K-12 writing assessment assistant for teachers.

Evaluate student writing fairly, consistently, and pedagogically. Your purpose is to help the teacher understand the strengths of the writing and what the student should improve next.

Score exactly four criteria, each from 0 to 25: Content & Argument (central idea, relevance, development, reasoning, evidence); Organization (structure, paragraphing, sequencing, transitions, introduction, conclusion); Clarity (understandability, precision, coherence, communication); Language & Mechanics (grammar, spelling, punctuation, sentence construction, appropriate language).

Only grade writing when there is enough coherent content to make a meaningful pedagogical assessment. Do not reward a submission merely for containing a few recognizable words or sentences. Extremely short, fragmentary, repetitive, meaningless, or off-task input should be classified as insufficient for assessment rather than forced into the 100-point rubric. A low score should represent weak but genuinely assessable writing, not the absence of an essay.

If the submission is insufficient, set insufficientContent to true, provide a short insufficientReason, set overallScore and criteria to null, and return empty actionableFeedback and inlineFeedback arrays. Do not generate artificial rubric scores or deductions. Otherwise set insufficientContent to false. For each criterion return a score, maxScore of exactly 25, a brief explanation, and deductions. Deductions must be evidence-based, non-arbitrary, and add up exactly to 25 minus the score. Do not include deductions when the score is 25. Overall score must equal the sum of all four criterion scores.

Provide several useful inline feedback items using short exact excerpts that actually appear in the essay. Finish with a concise student-facing summary identifying one genuine strength and one clear next step. Be constructive, age-appropriate, and concise. Do not rewrite the essay or add unrelated sections.`, responseMimeType: 'application/json', responseSchema: schema } })
  console.info('[essay-grader] Gemini response received', { source, hasText: Boolean(response.text), textLength: response.text?.length ?? 0 })
  return parseEssayGrade(response.text, source)
}

export async function POST(request: Request) {
  try {
    const form = await request.formData()
    const mode = form.get('mode')
    if (mode === 'paste') {
      const essay = form.get('essay')
      if (typeof essay !== 'string' || !essay.trim()) return jsonError('EMPTY_ESSAY', 'Please paste your essay before requesting feedback.', 400)
      if (isInsufficientText(essay)) return NextResponse.json(insufficientResult())
      return NextResponse.json(await grade(essay.trim(), 'pasted text'))
    }
    const file = form.get('file')
    if (!(file instanceof File)) return jsonError('FILE_REQUIRED', 'Please choose a PDF or image of the student essay.', 400)
    if (!allowedTypes.has(file.type)) return jsonError('UNSUPPORTED_FILE_TYPE', 'This file type is not supported. Choose a PDF, JPG, JPEG, or PNG file.', 400)
    if (file.size === 0) return jsonError('EMPTY_FILE', 'The selected file is empty. Choose a different essay file.', 400)
    if (file.size > MAX_FILE_SIZE) return jsonError('FILE_TOO_LARGE', 'This file is larger than 10 MB. Choose a smaller essay file.', 400)
    const buffer = Buffer.from(await file.arrayBuffer())
    if (file.type === 'application/pdf') {
      const parser = new PDFParse({ data: buffer })
      const result = await parser.getText()
      await parser.destroy()
      if (!result.text.trim()) return jsonError('PDF_NO_TEXT', 'No readable text was found in this PDF. Try a text-based PDF or upload an image instead.', 400)
      if (isInsufficientText(result.text)) return NextResponse.json(insufficientResult())
      return NextResponse.json(await grade(result.text, 'PDF text'))
    }
    console.info('[essay-grader] Gemini request start', { source: 'image', model: GEMINI_MODEL, mimeType: file.type, fileSize: file.size })
    const response = await getGemini().models.generateContent({ model: GEMINI_MODEL, contents: { parts: [{ text: 'Read the submitted student essay in this image and evaluate it using the exact JSON schema. Quote only short exact excerpts visible in the essay.' }, { inlineData: { mimeType: file.type, data: buffer.toString('base64') } }] }, config: { systemInstruction: 'Apply the Madlen Essay Grader rubric: score exactly four criteria from 0 to 25, return maxScore 25 and evidence-based deductions totaling exactly 25 minus each score, omit deductions at 25/25, make overallScore equal the four-score sum, provide inline exact excerpts, and finish with one strength plus one next step. Be constructive, age-appropriate, concise, and do not rewrite the essay.', responseMimeType: 'application/json', responseSchema: schema } })
    console.info('[essay-grader] Gemini response received', { source: 'image', hasText: Boolean(response.text), textLength: response.text?.length ?? 0 })
    return NextResponse.json(parseEssayGrade(response.text, 'image'))
  } catch (error) {
    console.error('[essay-grader] request failure', getSafeError(error))
    if (isQuotaError(error)) return jsonError('GEMINI_QUOTA', 'Gemini is temporarily unavailable because the API quota has been reached. Check your Gemini billing or try again later.', 429)
    const providerError = getSafeError(error)
    if (providerError.status === 400) return jsonError('AI_INPUT_ERROR', 'The essay file could not be processed. Check that it is a clear, readable PDF or image and try again.', 400)
    if (error instanceof SyntaxError || providerError.message?.includes('inconsistent grading rubric') || providerError.message?.includes('empty response')) return jsonError('INVALID_AI_RESPONSE', 'The grading response was incomplete. Please try again.', 502)
    if (providerError.message === 'GEMINI_API_KEY is not configured.') return jsonError('MISSING_GEMINI_KEY', 'The grading service is not configured. Add GEMINI_API_KEY and restart the server.', 503)
    return jsonError('GRADING_FAILED', 'We could not grade this essay right now. Please try again.', 500)
  }
}