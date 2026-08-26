import { NextResponse } from 'next/server'
import { GEMINI_MODEL, getGemini, parseJson } from '@/lib/gemini'
import type { LessonPlan } from '@/lib/types'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const { gradeLevel, subject, topic, learningGoal } = await request.json()
    if (typeof gradeLevel !== 'string' || !gradeLevel.trim() || typeof topic !== 'string' || !topic.trim()) {
      return NextResponse.json({ error: 'Grade level and topic are required.' }, { status: 400 })
    }
    const response = await getGemini().models.generateContent({
      model: GEMINI_MODEL,
      contents: `You are Madlen Lesson Prep Assistant, an AI-powered pedagogical assistant for K–12 teachers.

Create a concise, practical, classroom-ready lesson plan based on the teacher's inputs.

Subject: ${typeof subject === 'string' && subject.trim() ? subject.trim() : 'Not specified'}
Topic: ${topic.trim()}
Grade Level: ${gradeLevel.trim()}
Learning Goal: ${typeof learningGoal === 'string' && learningGoal.trim() ? learningGoal.trim() : 'Not specified'}

Adapt the language, examples, activities, and difficulty level to the selected grade level.

The lesson plan must include:
1. LESSON OUTLINE: Provide a short overview of how the lesson progresses from introduction to conclusion.
2. LEARNING OBJECTIVES: Provide 2–4 clear and measurable learning objectives.
3. KEY CONCEPTS: Provide 3–5 essential concepts students should understand by the end of the lesson.
4. FIVE-SLIDE LESSON STRUCTURE: Create exactly 5 slides. For every slide include a title, 2–4 concise bullet points, one visual suggestion, and 1–2 discussion questions. Use this sequence: Slide 1 — Hook / Introduction; Slide 2 — Core Concept; Slide 3 — Explanation / Example; Slide 4 — Student Activity; Slide 5 — Recap / Check for Understanding.
5. DISCUSSION QUESTIONS: Provide 2–3 open-ended discussion questions appropriate for the selected grade level.

Make the lesson immediately usable by a real teacher. Keep it concise and practical, avoid generic filler, prefer active learning, and do not add unrelated sections. Return the exact structured JSON format requested by the schema.`,
      config: { systemInstruction: 'You are Madlen Lesson Prep Assistant. Return only the requested structured JSON.', responseMimeType: 'application/json', responseSchema: {
        type: 'object', required: ['lessonOutline', 'objectives', 'keyConcepts', 'slides', 'discussionQuestions'], properties: {
          lessonOutline: { type: 'string' }, objectives: { type: 'array', minItems: 2, maxItems: 4, items: { type: 'string' } }, keyConcepts: { type: 'array', minItems: 3, maxItems: 5, items: { type: 'string' } },
          slides: { type: 'array', minItems: 5, maxItems: 5, items: { type: 'object', required: ['title', 'bullets', 'visualSuggestion', 'discussionQuestions'], properties: { title: { type: 'string' }, bullets: { type: 'array', minItems: 2, maxItems: 4, items: { type: 'string' } }, visualSuggestion: { type: 'string' }, discussionQuestions: { type: 'array', minItems: 1, maxItems: 2, items: { type: 'string' } } } } },
          discussionQuestions: { type: 'array', minItems: 2, maxItems: 3, items: { type: 'string' } },
        },
      } },
    })
    return NextResponse.json(parseJson<LessonPlan>(response.text))
  } catch (error) {
    console.error('Lesson prep failed:', error)
    return NextResponse.json({ error: 'We could not create the lesson plan. Please try again.' }, { status: 500 })
  }
}