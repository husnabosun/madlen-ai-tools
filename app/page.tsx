"use client";

import NextImage from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  Bot,
  Check,
  ChevronLeft,
  ClipboardList,
  FileText,
  GraduationCap,
  Image,
  Lightbulb,
  LoaderCircle,
  Menu,
  MessageCircle,
  PenLine,
  Send,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { EssayGrade, LessonPlan } from "@/lib/types";

type View = "roles" | "lesson" | "grader" | "chat";

const navItems = [
  { label: "Lesson Prep", icon: ClipboardList, view: "lesson" as View, href: "/teacher/lesson-prep" },
  { label: "Essay Grader", icon: PenLine, view: "grader" as View, href: "/teacher/essay-grader" },
];

const subjectsByGrade: Record<string, string[]> = {
  "1": ["Turkish", "Mathematics", "Life Studies"],
  "2": ["Turkish", "Mathematics", "Life Studies", "English"],
  "3": ["Turkish", "Mathematics", "Life Studies", "Science", "English"],
  "4": [
    "Turkish",
    "Mathematics",
    "Science",
    "Social Studies",
    "English",
    "Religious Culture and Ethics",
    "Human Rights and Citizenship",
    "Traffic Safety",
  ],
  "5": [
    "Turkish",
    "Mathematics",
    "Science",
    "Social Studies",
    "English",
    "Religious Culture and Ethics",
    "Information Technologies and Software",
  ],
  "6": [
    "Turkish",
    "Mathematics",
    "Science",
    "Social Studies",
    "English",
    "Religious Culture and Ethics",
    "Information Technologies and Software",
  ],
  "7": [
    "Turkish",
    "Mathematics",
    "Science",
    "Social Studies",
    "English",
    "Religious Culture and Ethics",
  ],
  "8": [
    "Turkish",
    "Mathematics",
    "Science",
    "Turkish Revolution History and Kemalism",
    "English",
    "Religious Culture and Ethics",
  ],
  "9": [
    "Turkish Language and Literature",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "History",
    "Geography",
    "English",
    "Second Foreign Language",
    "Religious Culture and Ethics",
    "Health and Traffic Culture",
  ],
  "10": [
    "Turkish Language and Literature",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "History",
    "Geography",
    "Philosophy",
    "English",
    "Second Foreign Language",
    "Religious Culture and Ethics",
  ],
  "11": [
    "Turkish Language and Literature",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "History",
    "Geography",
    "Philosophy",
    "Psychology",
    "Sociology",
    "Logic",
    "English",
    "Second Foreign Language",
    "Religious Culture and Ethics",
  ],
  "12": [
    "Turkish Language and Literature",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Turkish Revolution History and Kemalism",
    "Contemporary Turkish and World History",
    "Geography",
    "Philosophy",
    "Psychology",
    "Sociology",
    "Logic",
    "English",
    "Second Foreign Language",
    "Religious Culture and Ethics",
  ],
};

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${compact ? "logo-compact" : ""}`}>
      <NextImage
        src="/madlen-logo-placeholder.svg"
        alt="Madlen"
        width={120}
        height={40}
        priority
      />
    </div>
  );
}

function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline" | "soft";
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`button button-${variant} ${className}`}
    >
      {children}
    </button>
  );
}

function Sidebar({
  view,
  open,
  setOpen,
}: {
  view: View;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  return (
    <>
      {open && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-20 bg-ink/20 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand flex items-center justify-center">
          <Logo />
          <button
            className="sidebar-close md:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>
        <div className="mt-10 space-y-2">
          {navItems.map(({ label, icon: Icon, view: itemView, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className={`nav-item ${view === itemView ? "nav-active" : ""}`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
}

function AppShell({
  children,
  view,
}: {
  children: React.ReactNode;
  view: View;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <header className="mobile-header">
        <button aria-label="Open navigation" onClick={() => setOpen(true)}>
          <Menu size={22} />
        </button>
        <Logo />
      </header>
      <Sidebar view={view} open={open} setOpen={setOpen} />
      <main className="main-content">{children}</main>
    </div>
  );
}

function StudentSidebar({ open, setOpen }: { open: boolean; setOpen: (value: boolean) => void }) {
  return (
    <>
      {open && <button aria-label="Close navigation" className="fixed inset-0 z-20 bg-ink/20 md:hidden" onClick={() => setOpen(false)} />}
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand flex items-center justify-center"><Logo /><button className="sidebar-close md:hidden" onClick={() => setOpen(false)} aria-label="Close navigation"><X size={20} /></button></div>
        <div className="mt-10 space-y-2"><Link className="nav-item nav-active" href="/student" onClick={() => setOpen(false)}><MessageCircle size={18} /> Student Chat</Link></div>
      </aside>
    </>
  );
}

function Roles() {
  return (
    <main className="role-page">
      <div className="role-top">
        <Logo />
        <span className="eyebrow">WELCOME TO MADLEN</span>
      </div>
      <div className="role-hero">
        <span className="eyebrow">Great teachers, great futures</span>
        <h1>
          Bring the Future to Your
          <br />
          <em>Classroom with Madlen!</em>
        </h1>
        <p>
          AI-powered tools designed to support thoughtful teaching and active
          learning.
        </p>
      </div>
      <div className="role-grid">
        <Link className="role-card teacher" href="/teacher/lesson-prep">
          <div className="role-icon">
            <GraduationCap size={28} />
          </div>
          <div>
            <span className="eyebrow">FOR EDUCATORS</span>
            <h2>Teach with more room to think.</h2>
            <p>
              Plan lessons and understand student work with a little help from
              Madlen.
            </p>
          </div>
          <span className="card-arrow">→</span>
        </Link>
        <Link className="role-card student" href="/student">
          <div className="role-icon">
            <Lightbulb size={28} />
          </div>
          <div>
            <span className="eyebrow">FOR STUDENTS</span>
            <h2>Learn by thinking it through.</h2>
            <p>
              Work through questions with guidance that helps you understand,
              not just get the answer.
            </p>
          </div>
          <span className="card-arrow">→</span>
        </Link>
      </div>
      <p className="role-foot">
        Built for the moments that make learning click.
      </p>
    </main>
  );
}

function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-header">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}

async function requestJson<T>(url: string, options: RequestInit) {
  const response = await fetch(url, options);
  const data = (await response.json()) as T & { error?: string };
  if (!response.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}

function isMeaningfulTopic(value: string) {
  const words = value.toLowerCase().match(/[a-zA-ZÀ-ÿÇĞİÖŞÜçğıöşü]+/g) || []
  const compact = words.join('')
  if (compact.length < 3 || /^(.)\1+$/.test(compact)) return false
  if (words.length <= 3 && /^(bad|good|random|test|testing|hello|hi|hey|words?|essay|topic|thing|stuff|asdf|qwerty|lorem|ipsum)(\s|$)/.test(value.trim().toLowerCase())) return false
  const vowelCount = (compact.match(/[aeiouàâäèéêëîïôöùûüıİöÖüÜ]/gi) || []).length
  const repeatedWord = new Set(words).size < words.length * 0.6
  const gibberishPattern = /[bcdfghjklmnpqrstvwxz]{4,}/i.test(compact)
  return vowelCount > 0 && vowelCount / compact.length >= 0.12 && !repeatedWord && !gibberishPattern
}

function LoadingSkeleton({ className = "" }: { className?: string }) {
  return (
    <span className={`loading-skeleton ${className}`} aria-hidden="true" />
  );
}

function LessonLoadingState() {
  return (
    <div className="lesson-loading" aria-label="Building your lesson">
      <div className="skeleton-heading">
        <LoadingSkeleton className="skeleton-short" />
        <LoadingSkeleton className="skeleton-title" />
      </div>
      <LoadingSkeleton className="skeleton-line" />
      <LoadingSkeleton className="skeleton-line skeleton-medium" />
      <div className="skeleton-flow">
        {Array.from({ length: 5 }, (_, index) => (
          <div className="skeleton-flow-row" key={index}>
            <LoadingSkeleton className="skeleton-number" />
            <LoadingSkeleton className="skeleton-line" />
          </div>
        ))}
      </div>
    </div>
  );
}

function EssayLoadingState() {
  return (
    <div className="essay-loading" aria-label="Reviewing the essay">
      <LoadingSkeleton className="skeleton-title" />
      <LoadingSkeleton className="skeleton-line" />
      <LoadingSkeleton className="skeleton-line skeleton-medium" />
      {Array.from({ length: 4 }, (_, index) => (
        <div className="skeleton-criterion" key={index}>
          <LoadingSkeleton className="skeleton-line" />
          <LoadingSkeleton className="skeleton-bar" />
        </div>
      ))}
      <LoadingSkeleton className="skeleton-feedback" />
    </div>
  );
}

function LessonPrep() {
  const slideStages = [
    "Hook / Introduction",
    "Core Concept",
    "Explanation / Example",
    "Student Activity",
    "Recap / Check for Understanding",
  ];
  const learningGoalPlaceholder =
    "Students will be able to explain how water moves through the environment.";
  const [plan, setPlan] = useState<LessonPlan | null>(null);
  const [topic, setTopic] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [subject, setSubject] = useState("");
  const [learningGoal, setLearningGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    document
      .querySelector<HTMLTextAreaElement>(".setup-panel textarea")
      ?.setAttribute("placeholder", learningGoalPlaceholder);
  }, []);
  const generate = async () => {
    if (!gradeLevel || !topic.trim())
      return setError("Choose a grade level and add a topic to continue.");
    if (!isMeaningfulTopic(topic))
      return setError("Enter a valid educational topic so Madlen can build a useful lesson.");
    setLoading(true);
    setError("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setPlan(
        await requestJson<LessonPlan>("/api/lesson-prep", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gradeLevel, subject, topic, learningGoal }),
        }),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const gradeNumber = gradeLevel.replace("Grade ", "");
  const subjects = subjectsByGrade[gradeNumber] || [];
  return (
    <>
      <PageHeader
        eyebrow="TEACHER TOOLKIT / 01"
        title="Build a lesson with intention."
          description="Turn a topic into a thoughtful, ready-to-teach plan."
      />
      <section className="workspace-grid">
        <div className="panel setup-panel">
          <div className="panel-heading">
            <div className="icon-tile orange">
              <ClipboardList size={20} />
            </div>
            <div>
              <h2>Lesson brief</h2>
              <p>Tell us a little about your class.</p>
            </div>
          </div>
          <label>
            Grade level <span className="field-hint">Required</span>
            <select
              value={gradeLevel}
              onChange={(e) => {
                setGradeLevel(e.target.value);
                setSubject("");
                setPlan(null);
              }}
            >
              <option value="">Select a grade level</option>
              {Array.from({ length: 12 }, (_, index) => (
                <option key={index + 1}>Grade {index + 1}</option>
              ))}
            </select>
          </label>
          <label>
            Subject
            <select
              value={subject}
              disabled={!gradeLevel}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="">
                {gradeLevel ? "Select a subject" : "Select grade level first"}
              </option>
              {subjects.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <label>
            Topic <span className="field-hint">Required</span>
            <input
              value={topic}
              placeholder="The water cycle"
              onChange={(e) => setTopic(e.target.value)}
            />
          </label>
          <label>
            Learning goal
            <textarea
              value={learningGoal}
              onChange={(e) => setLearningGoal(e.target.value)}
            />
          </label>
          {error && <p className="error-note">{error}</p>}
          <Button onClick={generate} className="w-full" disabled={loading}>
            <Sparkles size={17} />{" "}
            {loading ? (
              <>
                <LoaderCircle className="spin" size={17} /> Building your
                lesson...
              </>
            ) : plan ? (
              "Regenerate plan"
            ) : (
              "Generate lesson plan"
            )}
          </Button>
          <p className="tiny-note">
            <Bot size={14} /> Madlen creates, you make it yours.
          </p>
        </div>
        <div className="panel lesson-output">
          {loading ? (
            <LessonLoadingState />
          ) : plan ? (
            <>
              <div className="output-top">
                <div>
                  <span className="eyebrow">YOUR LESSON PLAN</span>
                  <h2>{topic}</h2>
                </div>
                <span className="status">
                  <Check size={14} /> Ready to teach
                </span>
              </div>
              <div className="lesson-result-section lesson-overview">
                <span className="metric-label">LESSON OVERVIEW</span>
                <p>{plan.lessonOutline}</p>
              </div>
              <div className="lesson-result-section">
                <span className="metric-label">OBJECTIVES</span>
                <ul className="objective-list">
                  {plan.objectives.map((objective) => <li key={objective}>{objective}</li>)}
                </ul>
              </div>
              <div className="lesson-result-section">
                <span className="metric-label">KEY CONCEPTS</span>
                <div className="concept-tags">{plan.keyConcepts.map((concept) => <span key={concept}>{concept}</span>)}</div>
              </div>
              <div className="lesson-flow-section">
                <h3>Lesson flow</h3>
                <div className="flow-cards">
                  {plan.slides.slice(0, 5).map((slide, i) => (
                    <article className="flow-card" key={`${slide.title}-${i}`}>
                      <div className="flow-card-head"><span className="flow-number">{String(i + 1).padStart(2, "0")}</span><span className="flow-stage">{slideStages[i]}</span></div>
                      <h4>{slide.title}</h4>
                      <ul className="flow-bullets">{slide.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
                      <div className="visual-suggestion"><span className="flow-label">Visual suggestion</span><p>{slide.visualSuggestion}</p></div>
                      {slide.discussionQuestions.length > 0 && <div className="slide-prompt"><span className="flow-label">Discussion</span><p>{slide.discussionQuestions.join(" ")}</p></div>}
                    </article>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="empty-output">
              <div className="empty-orbit">
                <BookOpen size={30} />
              </div>
              <h2>Your lesson will take shape here.</h2>
              <p>
                Start with a topic on the left. Madlen will help you find the
                through-line.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function LessonPrepMock() {
  const [generated, setGenerated] = useState(false);
  const [topic, setTopic] = useState("The water cycle");
  return (
    <>
      <PageHeader
        eyebrow="TEACHER TOOLKIT / 01"
        title="Build a lesson with intention."
        description="Turn a topic into a thoughtful, ready-to-teach plan."
      />
      <section className="workspace-grid">
        <div className="panel setup-panel">
          <div className="panel-heading">
            <div className="icon-tile orange">
              <ClipboardList size={20} />
            </div>
            <div>
              <h2>Lesson brief</h2>
              <p>Tell us a little about your class.</p>
            </div>
          </div>
          <label>
            What are you teaching?
            <input value={topic} onChange={(e) => setTopic(e.target.value)} />
          </label>
          <label>
            Grade level
            <select defaultValue="Grade 7">
              <option>Grade 5</option>
              <option>Grade 7</option>
              <option>Grade 9</option>
            </select>
          </label>
          <label>
            Learning goal
            <textarea defaultValue="Students will be able to explain how water moves through the environment." />
          </label>
          <Button onClick={() => setGenerated(true)} className="w-full">
            <Sparkles size={17} />{" "}
            {generated ? "Plan refreshed" : "Generate lesson plan"}
          </Button>
          <p className="tiny-note">
            <Bot size={14} /> Madlen creates, you make it yours.
          </p>
        </div>
        <div className="panel lesson-output">
          {generated ? (
            <>
              <div className="output-top">
                <div>
                  <span className="eyebrow">YOUR LESSON PLAN</span>
                  <h2>{topic}</h2>
                </div>
                <span className="status">
                  <Check size={14} /> Ready to teach
                </span>
              </div>
              <div className="lesson-summary">
                <div>
                  <span className="metric-label">OBJECTIVE</span>
                  <p>
                    Students can map the journey of a water droplet and explain
                    each stage in their own words.
                  </p>
                </div>
                <div>
                  <span className="metric-label">ESTIMATED TIME</span>
                  <strong>45 min</strong>
                </div>
              </div>
              <h3>Lesson flow</h3>
              {[
                "Warm-up: Where does rain go?",
                "Mini lesson: Evaporation to precipitation",
                "Make it visible: Draw the cycle",
                "Exit ticket: Teach it back",
              ].map((item, i) => (
                <div className="flow-row" key={item}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <strong>{item}</strong>
                  <small>{[5, 12, 20, 8][i]} min</small>
                </div>
              ))}
              <div className="tip-box">
                <Lightbulb size={18} />
                <p>
                  <strong>Try this:</strong> Ask students to imagine the same
                  drop has been on Earth for millions of years.
                </p>
              </div>
            </>
          ) : (
            <div className="empty-output">
              <div className="empty-orbit">
                <BookOpen size={30} />
              </div>
              <h2>Your lesson will take shape here.</h2>
              <p>
                Add a topic on the left to start building your lesson plan.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function EssayGrader() {
  const essayPlaceholder =
    "The most important invention in history is the printing press. Before it was invented, books had to be copied by hand, which made them expensive and rare.\n\nThe printing press changed this by allowing books to be made quickly. More people could learn to read and share ideas. This helped science and education grow across Europe.";
  const [graded, setGraded] = useState<EssayGrade | null>(null);
  const [activeMode, setActiveMode] = useState<"paste" | "pdf" | "image">("paste");
  const [pasteText, setPasteText] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [gradedMode, setGradedMode] = useState<"paste" | "pdf" | "image" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    document
      .querySelector<HTMLTextAreaElement>(".essay-editor")
      ?.setAttribute("placeholder", essayPlaceholder);
  }, []);
  const chooseMode = (next: "paste" | "pdf" | "image") => {
    setActiveMode(next);
  };
  const onFile = (selected: File | undefined) => {
    if (!selected || activeMode === "paste") return;
    if (activeMode === "pdf") setPdfFile(selected);
    if (activeMode === "image") setImageFile(selected);
    setGraded(null);
    setError("");
  };
  const file = activeMode === "pdf" ? pdfFile : activeMode === "image" ? imageFile : null;
  const grade = async () => {
    if (activeMode === "paste" && !pasteText.trim())
      return setError("Please provide essay text.");
    if (activeMode !== "paste" && !file)
      return setError("Choose a file to continue.");
    const form = new FormData();
    form.set("mode", activeMode);
    activeMode === "paste"
      ? form.set("essay", pasteText)
      : form.set("file", file as File);
    setLoading(true);
    setError("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setGraded(
        await requestJson<EssayGrade>("/api/essay-grader", {
          method: "POST",
          body: form,
        }),
      );
      setGradedMode(activeMode);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const criteria = graded && !graded.insufficientContent && graded.criteria
    ? ([
        ["Content & argument", graded.criteria.contentArgument],
        ["Organization", graded.criteria.organization],
        ["Clarity", graded.criteria.clarity],
        ["Language & mechanics", graded.criteria.languageMechanics],
      ] as const)
    : [];
  return (
    <>
      <PageHeader
        eyebrow="TEACHER TOOLKIT / 02"
        title="Feedback that moves learning forward."
        description="Turn student writing into clear, actionable feedback."
      />
      <section className="grader-grid">
        <div className="panel essay-panel">
          <div className="panel-heading">
            <div className="icon-tile purple">
              <FileText size={20} />
            </div>
            <div>
              <h2>Student essay</h2>
              <p>Paste text or upload student work.</p>
            </div>
          </div>
          <div className="input-tabs" role="tablist">
            {[
              ["paste", "Paste text"],
              ["pdf", "Upload PDF"],
              ["image", "Upload image"],
            ].map(([value, label]) => (
              <button
                key={value}
                role="tab"
                aria-selected={activeMode === value}
                className={activeMode === value ? "input-tab active" : "input-tab"}
                onClick={() => chooseMode(value as "paste" | "pdf" | "image")}
              >
                {label}
              </button>
            ))}
          </div>
          {activeMode === "paste" ? (
            <textarea
              className="essay-editor"
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              aria-label="Essay text"
            />
          ) : (
            <>
              <input
                ref={inputRef}
                className="sr-only"
                type="file"
                accept={
                  activeMode === "pdf"
                    ? ".pdf,application/pdf"
                    : "image/png,image/jpeg,image/jpg"
                }
                onChange={(e) => onFile(e.target.files?.[0])}
              />
              <button
                className={`upload-zone ${file ? "upload-ready" : ""}`}
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  onFile(e.dataTransfer.files[0]);
                }}
              >
                {file ? (
                  <>
                    <div className="file-preview">
                      {activeMode === "image" ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Selected essay preview"
                        />
                      ) : (
                        <FileText size={27} />
                      )}
                    </div>
                    <strong>{file.name}</strong>
                    <small>
                      {(file.size / 1024 / 1024).toFixed(2)} MB · Ready to
                      evaluate
                    </small>
                    <span className="upload-action">Replace file</span>
                  </>
                ) : (
                  <>
                    <div className="upload-icon">
                      {activeMode === "pdf" ? (
                        <FileText size={25} />
                      ) : (
                        <Image size={25} />
                      )}
                    </div>
                    <strong>Upload student work</strong>
                    <small>
                      {activeMode === "pdf"
                        ? "Drag and drop a PDF here, or choose a file."
                        : "Upload a clear photo or scan of the student's writing."}
                    </small>
                    <span className="upload-action">Choose file</span>
                  </>
                )}
              </button>
            </>
          )}
          <div className="editor-footer">
            <span>
              {activeMode === "paste"
                ? `${pasteText.trim().split(/\s+/).filter(Boolean).length} words`
                : file
                  ? "File ready"
                  : "No file selected"}
            </span>
            <Button onClick={grade} disabled={loading}>
              {loading
                ? "Analyzing..."
                : graded
                  ? "Analysis complete"
                  : "Grade this essay"}{" "}
              <Target size={17} />
            </Button>
          </div>
          {error && <p className="error-note">{error}</p>}
        </div>
        <div className="panel feedback-panel">
          {graded && gradedMode === activeMode && graded.insufficientContent ? (
            <div className="empty-feedback insufficient-feedback">
              <div className="empty-icon"><Target size={28} /></div>
              <h2>More writing needed.</h2>
              <p>{graded.insufficientReason}</p>
            </div>
          ) : graded && gradedMode === activeMode ? (
            <>
              <div className="score-head">
                <div>
                  <span className="eyebrow">MADLEN SCORE</span>
                  <div className="feedback-summary">
                    <div><span className="summary-label">Strength</span><p>{graded.studentSummary}</p></div>
                    <div><span className="summary-label">Next step</span><p>{graded.actionableFeedback[0] || "Keep developing your ideas with specific evidence from the essay."}</p></div>
                  </div>
                </div>
                <div className="score">
                  {graded.overallScore}
                  <span>/100</span>
                </div>
              </div>
              {criteria.map(([name, criterion]) => (
                <div className="criterion" key={name}>
                  <div>
                    <strong>{name}</strong>
                    <span>{criterion.score} / {criterion.maxScore}</span>
                  </div>
                  <div className="progress">
                    <i style={{ width: `${(criterion.score / criterion.maxScore) * 100}%` }} />
                  </div>
                  <small><strong>Why:</strong> {criterion.explanation}</small>
                  {criterion.deductions.length > 0 && <div className="deductions"><span>Points deducted:</span><ul>{criterion.deductions.map((deduction) => <li key={`${deduction.points}-${deduction.reason}`}>−{deduction.points}: {deduction.reason}</li>)}</ul></div>}
                </div>
              ))}
              <div className="coach-note">
                <MessageCircle size={18} />
                <div>
                  <span className="eyebrow">ACTIONABLE FEEDBACK</span>
                  <p>{graded.actionableFeedback.join(" ")}</p>
                  {graded.inlineFeedback.map((item) => (
                    <p key={item.excerpt}>
                      <strong>“{item.excerpt}”</strong> {item.feedback}
                    </p>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="empty-feedback">
              <div className="empty-icon">
                <Target size={28} />
              </div>
              <h2>Your feedback will appear here.</h2>
              <p>
                Submit an essay to see strengths, patterns, and a clear next
                step.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function EssayGraderMock() {
  const [graded, setGraded] = useState(false);
  const [mode, setMode] = useState<"paste" | "pdf" | "image">("paste");
  const [essay, setEssay] = useState(
    "The most important invention in history is the printing press. Before it was invented, books had to be copied by hand, which made them expensive and rare.\n\nThe printing press changed this by allowing books to be made quickly. More people could learn to read and share ideas. This helped science and education grow across Europe.",
  );
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chooseMode = (next: "paste" | "pdf" | "image") => {
    setMode(next);
    setFile(null);
    setGraded(false);
  };
  const onFile = (selected: File | undefined) => {
    if (!selected) return;
    setFile(selected);
    setGraded(false);
  };
  const ready = mode === "paste" ? essay.trim().length > 0 : Boolean(file);
  return (
    <>
      <PageHeader
        eyebrow="TEACHER TOOLKIT / 02"
        title="Feedback that moves learning forward."
        description="Turn student writing into clear, actionable feedback."
      />
      <section className="grader-grid">
        <div className="panel essay-panel">
          <div className="panel-heading">
            <div className="icon-tile purple">
              <FileText size={20} />
            </div>
            <div>
              <h2>Student essay</h2>
              <p>Paste text or upload student work.</p>
            </div>
          </div>
          <div className="input-tabs" role="tablist">
            {[
              ["paste", "Paste text"],
              ["pdf", "Upload PDF"],
              ["image", "Upload image"],
            ].map(([value, label]) => (
              <button
                key={value}
                role="tab"
                aria-selected={mode === value}
                className={mode === value ? "input-tab active" : "input-tab"}
                onClick={() => chooseMode(value as "paste" | "pdf" | "image")}
              >
                {label}
              </button>
            ))}
          </div>
          {mode === "paste" ? (
            <textarea
              className="essay-editor"
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              aria-label="Essay text"
            />
          ) : (
            <>
              <input
                ref={inputRef}
                className="sr-only"
                type="file"
                accept={
                  mode === "pdf"
                    ? ".pdf,application/pdf"
                    : "image/png,image/jpeg,image/jpg"
                }
                onChange={(e) => onFile(e.target.files?.[0])}
              />
              <button
                className={`upload-zone ${file ? "upload-ready" : ""}`}
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  onFile(e.dataTransfer.files[0]);
                }}
              >
                {file ? (
                  <>
                    <div className="file-preview">
                      {mode === "image" ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Selected essay preview"
                        />
                      ) : (
                        <FileText size={27} />
                      )}
                    </div>
                    <strong>{file.name}</strong>
                    <small>
                      {(file.size / 1024 / 1024).toFixed(2)} MB · Ready to
                      evaluate
                    </small>
                    <span className="upload-action">Replace file</span>
                  </>
                ) : (
                  <>
                    <div className="upload-icon">
                      {mode === "pdf" ? (
                        <FileText size={25} />
                      ) : (
                        <Image size={25} />
                      )}
                    </div>
                    <strong>Upload student work</strong>
                    <small>
                      {mode === "pdf"
                        ? "Drag and drop a PDF here, or choose a file."
                        : "Upload a clear photo or scan of the student's writing."}
                    </small>
                    <span className="upload-action">Choose file</span>
                  </>
                )}
              </button>
            </>
          )}
          <div className="editor-footer">
            <span>
              {mode === "paste"
                ? `${essay.trim().split(/\s+/).filter(Boolean).length} words`
                : file
                  ? "File ready"
                  : "No file selected"}
            </span>
            <Button onClick={() => ready && setGraded(true)}>
              {graded ? "Analysis complete" : "Grade this essay"}{" "}
              <Target size={17} />
            </Button>
          </div>
        </div>
        <div className="panel feedback-panel">
          {graded ? (
            <>
              <div className="score-head">
                <div>
                  <span className="eyebrow">MADLEN SCORE</span>
                  <h2>Strong thinking.</h2>
                </div>
                <div className="score">
                  86<span>/100</span>
                </div>
              </div>
              <p className="feedback-lead">
                This essay makes a clear claim and supports it with relevant
                historical context. The next step is to make the connection
                between ideas even more explicit.
              </p>
              {[
                ["Ideas & evidence", "Excellent", 92],
                ["Structure", "Good", 81],
                ["Language", "Good", 84],
              ].map(([name, rating, value]) => (
                <div className="criterion" key={name as string}>
                  <div>
                    <strong>{name as string}</strong>
                    <span>{rating as string}</span>
                  </div>
                  <div className="progress">
                    <i style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
              <div className="coach-note">
                <MessageCircle size={18} />
                <div>
                  <span className="eyebrow">SUGGESTED FEEDBACK</span>
                  <p>
                    “Your explanation of access to knowledge is compelling.
                    Could you add one specific example of an idea that spread
                    because of the printing press?”
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-feedback">
              <div className="empty-icon">
                <Target size={28} />
              </div>
              <h2>Your feedback will appear here.</h2>
              <p>
                Submit an essay to see strengths, patterns, and a clear next
                step.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function EssayGraderLegacy() {
  const [graded, setGraded] = useState(false);
  return (
    <>
      <PageHeader
        eyebrow="TEACHER TOOLKIT / 02"
        title="Feedback that moves learning forward."
        description="Turn student writing into clear, actionable feedback."
      />
      <section className="grader-grid">
        <div className="panel essay-panel">
          <div className="panel-heading">
            <div className="icon-tile purple">
              <FileText size={20} />
            </div>
            <div>
              <h2>Student essay</h2>
              <p>Paste or write an essay to begin.</p>
            </div>
          </div>
          <textarea
            className="essay-editor"
            defaultValue={
              "The most important invention in history is the printing press. Before it was invented, books had to be copied by hand, which made them expensive and rare.\n\nThe printing press changed this by allowing books to be made quickly. More people could learn to read and share ideas. This helped science and education grow across Europe."
            }
          />
          <div className="editor-footer">
            <span>184 words</span>
            <Button onClick={() => setGraded(true)}>
              {graded ? "Analysis complete" : "Grade this essay"}{" "}
              <Target size={17} />
            </Button>
          </div>
        </div>
        <div className="panel feedback-panel">
          {graded ? (
            <>
              <div className="score-head">
                <div>
                  <span className="eyebrow">MADLEN SCORE</span>
                  <h2>Strong thinking.</h2>
                </div>
                <div className="score">
                  86<span>/100</span>
                </div>
              </div>
              <p className="feedback-lead">
                This essay makes a clear claim and supports it with relevant
                historical context. The next step is to make the connection
                between ideas even more explicit.
              </p>
              {[
                ["Ideas & evidence", "Excellent", 92],
                ["Structure", "Good", 81],
                ["Language", "Good", 84],
              ].map(([name, rating, value]) => (
                <div className="criterion" key={name as string}>
                  <div>
                    <strong>{name as string}</strong>
                    <span>{rating as string}</span>
                  </div>
                  <div className="progress">
                    <i style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
              <div className="coach-note">
                <MessageCircle size={18} />
                <div>
                  <span className="eyebrow">SUGGESTED FEEDBACK</span>
                  <p>
                    “Your explanation of access to knowledge is compelling.
                    Could you add one specific example of an idea that spread
                    because of the printing press?”
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-output">
              <div className="empty-orbit">
                <PenLine size={30} />
              </div>
              <h2>Your feedback will appear here.</h2>
              <p>
                Submit an essay to see strengths, patterns, and a clear next
                step.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function TypingIndicator() {
  return (
    <div className="typing-indicator" aria-label="Madlen is typing">
      <span />
      <span />
      <span />
    </div>
  );
}

function cleanAssistantResponse(response: string) {
  return response
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "($1 / $2)")
    .replace(/\\(?:text|mathrm|mathbf)\{([^{}]+)\}/g, "$1")
    .replace(/\$\$?([^$]+)\$\$?/g, "$1")
    .replace(/\\\[|\\\]|\\\(|\\\)/g, "")
    .replace(/\\([%*_{}])/g, "$1")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function StudentChat() {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [messages, loading]);
  const send = async () => {
    const content = input.trim();
    if (!content || loading) return;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError("");
    try {
      const result = await requestJson<{ message: string }>("/api/student-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      setMessages([...next, { role: "assistant", content: result.message }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Please try again.");
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <PageHeader
        eyebrow="STUDENT SPACE"
        title="Let's figure it out together."
        description="Ask questions, work through ideas, or start with a hint. Madlen helps you think it through."
      />
      <section className="chat-layout">
        <div className="panel chat-panel">
          <div className="chat-head">
            <div className="avatar">
              <Bot size={20} />
            </div>
            <div>
              <h2>Madlen Study Buddy</h2>
              <p>
                <span className="online-dot" />{" "}
                {loading ? "Thinking..." : "Ready to work it through"}
              </p>
            </div>
          </div>
          <div className="messages">
            <div className="message onboarding-message">Hi! I’m here to help you think it through. What are you working on today?</div>
            {messages.map((message, i) => (
              <div
                className={`message ${message.role === "user" ? "user-message" : ""}`}
                key={`${message.content}-${i}`}
              >
                {message.role === "assistant" ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {cleanAssistantResponse(message.content)}
                  </ReactMarkdown>
                ) : (
                  message.content
                )}
              </div>
            ))}
            {loading && (
              <div className="message">
                <TypingIndicator />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="suggestions">
            {["Give me a hint", "Explain it simply", "Quiz me"].map((s) => (
              <button key={s} onClick={() => setInput(s)} disabled={loading}>
                {s}
              </button>
            ))}
          </div>
          {error && <p className="error-note">{error}</p>}
          <div className="composer">
            <input
              value={input}
              disabled={loading}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.nativeEvent.isComposing &&
                  e.keyCode !== 229
                )
                  send();
              }}
              placeholder="Type your question..."
              aria-label="Type your question"
            />
            <button onClick={send} disabled={loading} aria-label="Send message">
              <Send size={18} />
            </button>
          </div>
        </div>
        <aside className="chat-side">
          <div className="side-illustration">
            <Sparkles size={25} />
          </div>
          <span className="eyebrow">WAYS TO WORK</span>
          <h2>Build understanding step by step.</h2>
          <p>
            Ask for a hint, an explanation, or a quick quiz as you work through
            an idea.
          </p>
        </aside>
      </section>
    </>
  );
}

function StudentSpace() {
  const [open, setOpen] = useState(false);
  return (
    <div className="student-space min-h-screen bg-background">
      <header className="mobile-header"><button aria-label="Open navigation" onClick={() => setOpen(true)}><Menu size={22} /></button><Logo /></header>
      <StudentSidebar open={open} setOpen={setOpen} />
      <main className="main-content"><Link className="back-link" href="/"><ChevronLeft size={16} /> Back to roles</Link><StudentChat /></main>
    </div>
  );
}

export default function Page() {
  const pathname = usePathname();
  const view: View = pathname === "/student" ? "chat" : pathname === "/teacher/essay-grader" ? "grader" : pathname.startsWith("/teacher") ? "lesson" : "roles";
  if (view === "roles") return <Roles />;
  if (view === "chat") return <StudentSpace />;
  return (
    <AppShell view={view}>
      <Link className="back-link" href="/">
        <ChevronLeft size={16} /> Back to roles
      </Link>
      {view === "lesson" && <LessonPrep />}
      {view === "grader" && <EssayGrader />}
    </AppShell>
  );
}
