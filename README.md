# Madlen AI-Powered Mini Products

A collection of three AI-powered educational mini-products designed as an extension of the Madlen experience.

## Live Demo

**Production:** https://madlen-ai-tools.vercel.app/

## Products

### Lesson Prep
Helps educators turn a topic, grade level, subject, and learning goal into a structured, ready-to-teach lesson plan.

Generated plans include:
- Lesson overview
- Learning objectives
- Key concepts
- Structured lesson flow
- Student activities
- Discussion questions
- Visual suggestions

### Essay Grader
Provides structured and explainable feedback on student writing through pasted text or image uploads.

Feedback includes:
- Overall score
- Criterion-level scoring
- Score explanations and deductions
- Strengths
- Actionable feedback
- Inline feedback
- Student summary

### Study Buddy
A student-facing AI learning companion designed to support understanding rather than simply provide answers.

It can:
- Explain academic concepts
- Guide students through problems with hints
- Respond to misconceptions and follow-up questions
- Maintain conversation context
- Support multilingual learning
- Redirect clearly non-academic requests

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Google Gemini API
- Vercel

## AI-Assisted Development

AI tools were used throughout the development process:

- **v0** — initial UI exploration and scaffolding
- **GitHub Copilot** — implementation, refactoring, and debugging
- **ChatGPT** — product thinking, UX decisions, testing, debugging, and prompt design
- **Google Gemini** — AI functionality powering the final mini-products

The AI behavior was iteratively refined through happy-path and edge-case testing rather than relying on a single initial prompt.

## Running Locally

Install dependencies:

```bash
npm install
```

Create a `.env.local` file and add the required Gemini API key using the variable documented in `.env.example`.

Then start the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

For a production build:

```bash
npm run build
npm start
```

## Notes

This project was developed as a prototype focused on the core user experience. API credentials are not included in the repository.
