export type LessonPlan = {
  lessonOutline: string
  objectives: string[]
  keyConcepts: string[]
  slides: { title: string; bullets: string[]; visualSuggestion: string; discussionQuestions: string[] }[]
  discussionQuestions: string[]
}

export type Deduction = { points: number; reason: string }

export type Criterion = {
  score: number
  maxScore: 25
  explanation: string
  deductions: Deduction[]
}

export type EssayGrade = {
  insufficientContent: boolean
  insufficientReason: string
  overallScore: number | null
  criteria: {
    contentArgument: Criterion
    organization: Criterion
    clarity: Criterion
    languageMechanics: Criterion
  } | null
  actionableFeedback: string[]
  inlineFeedback: { excerpt: string; feedback: string }[]
  studentSummary: string
}