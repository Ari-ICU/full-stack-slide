"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  BookOpen, Code, Database, Zap, Palette, Server,
  Star, HardDrive, CheckCircle2, Clock, ArrowRight,
  ChevronRight, Layers, Globe, Terminal, GitBranch,
  MousePointer2, ArrowLeft,
} from "lucide-react";

/* ─── MODULE DATA ────────────────────────────────────────────────── */
interface Module {
  href: string;
  num: string;
  label: string;
  tag: string;
  description: string;
  color: string;
  dimColor: string;
  icon: React.ElementType;
  weeks: string;
  lessons: number;
  skills: string[];
  lessonsList: string[];
}

const modules: Module[] = [
  {
    href: "/courses/full-stack/lessons/html",
    num: "01",
    label: "HTML5 Essentials",
    tag: "Foundation",
    description: "Semantic structure, forms, accessibility — the skeleton of every web page.",
    color: "#3b82f6",
    dimColor: "rgba(59,130,246,0.12)",
    icon: Code,
    weeks: "Week 1",
    lessons: 12,
    skills: ["Semantic Tags", "Forms", "Accessibility", "SEO"],
    lessonsList: [
      "Document Structure", "Global Attributes", "Text Hierarchy", "Text Elements",
      "Hyperlinks", "Images", "List Structures", "Data Tables", "Forms & Inputs",
      "The Div Tag", "Semantic Layout", "Final Project"
    ],
  },
  {
    href: "/courses/full-stack/lessons/css",
    num: "02",
    label: "CSS Mastery",
    tag: "Styling",
    description: "Flexbox, Grid, animations, and modern responsive design patterns.",
    color: "#a855f7",
    dimColor: "rgba(168,85,247,0.12)",
    icon: Palette,
    weeks: "Weeks 2–3",
    lessons: 16,
    skills: ["Flexbox", "CSS Grid", "Animations", "Media Queries"],
    lessonsList: [
      "CSS Intro", "CSS Inclusion", "Class vs ID", "The Box Model", "Color Systems",
      "Typography", "Border Radius", "Hover Effects", "Positioning", "Flexbox Basics",
      "Flex Direction", "Flex Wrap", "CSS Grid", "Grid Areas", "Media Queries", "Final Project"
    ],
  },
  {
    href: "/courses/full-stack/lessons/js",
    num: "03",
    label: "JavaScript",
    tag: "Interactivity",
    description: "Variables, DOM, async/await, and the full power of ES6+ syntax.",
    color: "#eab308",
    dimColor: "rgba(234,179,8,0.12)",
    icon: Zap,
    weeks: "Weeks 4–6",
    lessons: 24,
    skills: ["DOM API", "Promises", "ES6+", "Fetch"],
    lessonsList: [
      "What is JS?", "Variables", "Data Types", "Operators", "If / Else", "Switch / Case",
      "Ternary Operator", "Logical Operators", "Nullish & Optional", "Loops", "Functions",
      "Arrow Functions", "Arrays", "Objects", "DOM Selectors", "DOM Styles & Classes",
      "DOM Content", "Events", "Destructuring", "Spread & Rest", "ES Modules", "Promises",
      "Async / Await", "Final Project"
    ],
  },
  {
    href: "/courses/full-stack/lessons/git",
    num: "04",
    label: "Git & GitHub",
    tag: "Workflow",
    description: "Version control, branching, and cloud collaboration — essential for modern engineering.",
    color: "#f05032",
    dimColor: "rgba(240,80,50,0.12)",
    icon: GitBranch,
    weeks: "Week 7",
    lessons: 11,
    skills: ["Init", "Commits", "Branching", "Push/Pull"],
    lessonsList: [
      "What is Git?", "Install & Config", "git init", "Staging Area", "git commit",
      "Commit Messages", "Branches", "git merge", "Merge Conflicts", "git rebase", "Final Project"
    ],
  },
  {
    href: "/courses/full-stack/lessons/react",
    num: "05",
    label: "React Mastery",
    tag: "Components",
    description: "Components, state, hooks, context, and the modern React ecosystem.",
    color: "#06b6d4",
    dimColor: "rgba(6,182,212,0.12)",
    icon: Layers,
    weeks: "Weeks 8–10",
    lessons: 37,
    skills: ["Hooks", "Context", "TanStack", "Framer Motion"],
    lessonsList: [
      "Welcome to React", "Project Setup", "JSX Syntax", "Components", "Props", "State",
      "Lifting State Up", "Rendering Logic", "Forms & Inputs", "Fragments", "useEffect",
      "useContext", "Advanced Hooks", "Custom Hooks", "RSCs & Suspense", "Performance & Deploy",
      "Virtual DOM", "Immutable State", "Composition", "Styling with Tailwind",
      "TanStack Query", "React Router v7", "React Portals", "Error Boundaries", "Code Splitting",
      "Zustand", "React Hook Form", "Vitest & RTL", "Playwright", "Framer Motion", "React 19 Actions",
      "useFormStatus", "Optimisation", "Portfolio Power", "Deploying Live", "The Journey Continues", "Final Project"
    ],
  },
  {
    href: "/courses/full-stack/lessons/nextjs",
    num: "06",
    label: "Next.js 15",
    tag: "Framework",
    description: "App Router, Server Components, Server Actions — full-stack architecture.",
    color: "#f43f5e",
    dimColor: "rgba(244,63,94,0.12)",
    icon: Globe,
    weeks: "Weeks 11–12",
    lessons: 14,
    skills: ["App Router", "RSC", "Metadata", "Deploy"],
    lessonsList: [
      "Intro to Next.js 15", "Project Setup", "App Router", "Server Components", "Client Components",
      "Dynamic Routes", "Data Fetching", "Server Actions", "Next.js Image", "Metadata & SEO",
      "Middleware", "Route Handlers", "Rendering Modes", "Final Project"
    ],
  },
  {
    href: "/courses/full-stack/lessons/db",
    num: "07",
    label: "MongoDB & Mongoose",
    tag: "Database",
    description: "Atlas, schemas, CRUD, aggregation pipelines, and NoSQL architecture.",
    color: "#14b8a6",
    dimColor: "rgba(20,184,166,0.12)",
    icon: HardDrive,
    weeks: "Weeks 13–14",
    lessons: 34,
    skills: ["Schemas", "CRUD", "Aggregation", "Indexing"],
    lessonsList: [
      "Database Intro", "JSON Structure", "Atlas Setup", "Connecting Node.js", "Collections",
      "The _id Field", "Mongoose", "Schema Basics", "Data Types", "Required & Validation",
      "Defaults & Enums", "Timestamps", "Mongoose Models", "Create Documents", "Read — Find All",
      "Read — Find One", "Comparison Operators", "Logical Operators", "Sorting & Pagination",
      "Update Documents", "Atomic Operators", "Delete Documents", "Mongoose Middleware",
      "Virtuals", "Custom Validation", "Indexing", "References (Ref)", "populate()",
      "Embedded Documents", "Aggregation Pipeline", "Error Handling", "Transactions", "Best Practices", "Final Project"
    ],
  },
  {
    href: "/courses/full-stack/lessons/backend-db",
    num: "08",
    label: "PHP & Laravel",
    tag: "Backend",
    description: "PHP fundamentals, Eloquent ORM, Sanctum auth, REST APIs, and deployment.",
    color: "#10b981",
    dimColor: "rgba(16,185,129,0.12)",
    icon: Terminal,
    weeks: "Weeks 15–16",
    lessons: 31,
    skills: ["Eloquent", "Sanctum", "Queues", "Deploy"],
    lessonsList: [
      "PHP & Laravel", "PHP Basics", "Arrays & Loops", "Functions & OOP", "Composer & Setup",
      "Laravel Install", "Routing", "Controllers", "Request & Response", "Middleware", "Validation",
      "Eloquent ORM", "Migrations", "CRUD: Create & Read", "CRUD: Update & Delete", "Query Builder",
      "Eloquent Relationships", "Eager Loading", "API Resources", "Authentication", "Password Hashing",
      "Environment & Config", "Seeders & Factories", "File Uploads", "Queues & Jobs", "Caching",
      "Rate Limiting", "Testing with Pest", "Artisan Commands", "CORS & Headers", "Deployment", "Final Project"
    ],
  },
];

const totalLessons = modules.reduce((s, m) => s + m.lessons, 0);

/* ─── MODULE CARD ────────────────────────────────────────────────── */
function ModuleCard({ mod, isLeft }: { mod: Module; isLeft: boolean }) {
  const [hovered, setHovered] = useState(false);
  const Icon = mod.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={mod.href} className="block">
        <div
          className="relative rounded-3xl border overflow-hidden"
          style={{
            background: hovered
              ? `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, ${mod.dimColor} 100%)`
              : 'rgba(255,255,255,0.02)',
            borderColor: hovered ? `${mod.color}55` : 'rgba(255,255,255,0.07)',
            boxShadow: hovered ? `0 0 40px ${mod.color}15, 0 0 0 1px ${mod.color}25` : 'none',
            transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
            transition: 'all 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
          }}
        >
          {/* Top accent bar */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-400"
            style={{
              background: `linear-gradient(90deg, transparent, ${mod.color}, transparent)`,
              opacity: hovered ? 1 : 0,
            }}
          />

          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border"
                  style={{ borderColor: `${mod.color}45`, background: mod.dimColor, color: mod.color }}
                >
                  {mod.num}
                </div>
                <span
                  className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border"
                  style={{ color: mod.color, borderColor: `${mod.color}35`, background: `${mod.color}08` }}
                >
                  {mod.tag}
                </span>
              </div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: mod.dimColor,
                  transform: hovered ? 'rotate(8deg) scale(1.08)' : 'rotate(0deg) scale(1)',
                  transition: 'transform 0.3s ease',
                }}
              >
                <Icon className="w-5 h-5" style={{ color: mod.color }} />
              </div>
            </div>

            {/* Content */}
            <h3 className="text-lg font-black tracking-tight text-white mb-1.5">{mod.label}</h3>
            <p className="text-sm text-white/30 leading-relaxed mb-4 font-light">{mod.description}</p>

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {mod.skills.map(skill => (
                <span
                  key={skill}
                  className="text-[9px] font-bold px-2 py-1 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.35)' }}
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] text-white/20 font-mono">
                <span>{mod.weeks}</span>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span>{mod.lessons} slides</span>
              </div>
              <div
                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest"
                style={{ color: mod.color, gap: hovered ? '10px' : '6px', transition: 'gap 0.3s' }}
              >
                Open <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── SPINE NODE (centre column) ─────────────────────────────────── */
function SpineNode({ mod }: { mod: Module }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 240, damping: 22, delay: 0.15 }}
      className="flex flex-col items-center gap-2"
    >
      <div
        className="w-14 h-14 rounded-full border-2 flex items-center justify-center text-xs font-black"
        style={{
          borderColor: `${mod.color}50`,
          background: `${mod.color}10`,
          color: mod.color,
          boxShadow: `0 0 20px ${mod.color}20`,
        }}
      >
        {mod.num}
      </div>
    </motion.div>
  );
}

/* ─── SVG CONNECTOR ──────────────────────────────────────────────── */
function Connector({ from, to, toRight }: { from: string; to: string; toRight: boolean }) {
  return (
    <div className="flex justify-center h-12 items-center">
      <svg width="320" height="48" viewBox="0 0 320 48" fill="none">
        <defs>
          <linearGradient id={`cg-${from}-${to}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={from} stopOpacity="0.5" />
            <stop offset="100%" stopColor={to} stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {toRight ? (
          // Card on left → Card on right: sweep right
          <>
            <path
              d="M 40 8 Q 160 8 160 24 Q 160 40 280 40"
              stroke={`url(#cg-${from}-${to})`}
              strokeWidth="1.5"
              strokeDasharray="7 5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="280" cy="40" r="3" fill={to} opacity="0.7" />
            <path d="M 275 36 L 280 40 L 285 36" stroke={to} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
          </>
        ) : (
          // Card on right → Card on left: sweep left
          <>
            <path
              d="M 280 8 Q 160 8 160 24 Q 160 40 40 40"
              stroke={`url(#cg-${from}-${to})`}
              strokeWidth="1.5"
              strokeDasharray="7 5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="40" cy="40" r="3" fill={to} opacity="0.7" />
            <path d="M 35 36 L 40 40 L 45 36" stroke={to} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
          </>
        )}
      </svg>
    </div>
  );
}

/* ─── ROADMAP SECTION ────────────────────────────────────────────── */
function RoadmapSection() {
  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Vertical spine — desktop only */}
      <div
        className="absolute left-1/2 top-8 bottom-8 w-px -translate-x-1/2 hidden md:block pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.05) 8%, rgba(255,255,255,0.05) 92%, transparent)',
        }}
      />

      <div className="space-y-0">
        {modules.map((mod, i) => {
          const isLeft = i % 2 === 0;   // card on LEFT side
          const nextMod = modules[i + 1];

          return (
            <div key={mod.href}>
              {/* ── ROW ── */}
              <div className="grid md:grid-cols-[1fr_auto_1fr] gap-x-6 items-center">

                {/* Left column */}
                <div>
                  {isLeft
                    ? <ModuleCard mod={mod} isLeft={true} />
                    : <div className="hidden md:flex justify-end pr-4">
                        <div
                          className="text-[9px] font-black uppercase tracking-widest text-right"
                          style={{ color: mod.color, opacity: 0.4 }}
                        >{mod.weeks}</div>
                      </div>
                  }
                </div>

                {/* Centre spine node — desktop */}
                <div className="hidden md:flex justify-center">
                  <SpineNode mod={mod} />
                </div>

                {/* Right column */}
                <div>
                  {!isLeft
                    ? <ModuleCard mod={mod} isLeft={false} />
                    : <div className="hidden md:flex justify-start pl-4">
                        <div
                          className="text-[9px] font-black uppercase tracking-widest"
                          style={{ color: mod.color, opacity: 0.4 }}
                        >{mod.weeks}</div>
                      </div>
                  }
                </div>

                {/* Mobile: always show card */}
                <div className="md:hidden col-span-3">
                  <ModuleCard mod={mod} isLeft={true} />
                </div>
              </div>

              {/* ── CONNECTOR ── */}
              {nextMod && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="hidden md:block"
                >
                  <Connector
                    from={mod.color}
                    to={nextMod.color}
                    toRight={isLeft}  // card was on left → connector goes right
                  />
                </motion.div>
              )}

              {/* Mobile: simple vertical line between cards */}
              {nextMod && (
                <div className="md:hidden flex flex-col items-center py-3">
                  <div
                    className="w-px h-8"
                    style={{ background: `linear-gradient(to bottom, ${mod.color}55, ${nextMod.color}55)` }}
                  />
                  <div className="w-2 h-2 rounded-full mt-1" style={{ background: nextMod.color, opacity: 0.6 }} />
                </div>
              )}
            </div>
          );
        })}

        {/* ── FINISH NODE ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 180 }}
          className="flex justify-center mt-8 pt-4"
        >
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-20 h-20 rounded-full border-2 flex items-center justify-center"
              style={{
                borderColor: 'rgba(234,179,8,0.45)',
                background: 'rgba(234,179,8,0.08)',
                boxShadow: '0 0 50px rgba(234,179,8,0.12)',
              }}
            >
              <Star className="w-8 h-8 fill-current" style={{ color: '#eab308' }} />
            </div>
            <div className="text-center">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400/60">Full-Stack Engineer</p>
              <p className="text-[10px] text-white/20 mt-1 font-mono">{totalLessons}+ slides · 16 weeks</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── MODULE STRIP (top navigation bar) ─────────────────────────── */
function ModuleStrip() {
  return (
    <div className="flex items-stretch rounded-2xl overflow-hidden border border-white/6 mt-8">
      {modules.map((mod, i) => (
        <Link
          key={mod.href}
          href={mod.href}
          className="flex-1 group relative flex flex-col items-center gap-1.5 py-3.5 px-2 hover:bg-white/4 transition-colors"
          style={{ borderRight: i < modules.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
        >
          <mod.icon className="w-4 h-4" style={{ color: mod.color, opacity: 0.7 }} />
          <span className="text-[8px] font-black text-white/20 uppercase tracking-widest text-center leading-tight hidden sm:block">
            {mod.num}
          </span>
          <div
            className="absolute bottom-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: mod.color }}
          />
        </Link>
      ))}
    </div>
  );
}

/* ─── PAGE ───────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div
      className="min-h-screen bg-[#080c14] text-white selection:bg-blue-500/25 overflow-x-hidden"
      style={{ fontFamily: "'DM Mono','JetBrains Mono',system-ui,sans-serif" }}
    >
      {/* Fixed background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-15%] w-[55%] h-[55%] bg-blue-700/5 rounded-full blur-[180px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] bg-emerald-700/5 rounded-full blur-[160px]" />
        <div className="absolute top-[45%] left-[35%] w-[30%] h-[30%] bg-purple-700/4 rounded-full blur-[130px]" />
        <div
          className="absolute inset-0 opacity-100"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <main className="max-w-5xl mx-auto px-6 py-20 md:py-28 relative z-10">
        
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors mb-12">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Courses
        </Link>

        {/* ── HERO ── */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.32, 0.72, 0, 1] }}
          className="mb-20 space-y-7"
        >
          {/* Live badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/6 text-blue-400 text-[10px] font-black uppercase tracking-[0.22em]">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Full-Stack Development Roadmap · 2024–2025
          </div>

          {/* Headline */}
          <div className="max-w-3xl space-y-3">
            <h1
              className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.86]"
              style={{ fontFamily: "'DM Mono','JetBrains Mono',monospace" }}
            >
              From Zero
              <br />
              <span
                style={{
                  WebkitTextStroke: '2px rgba(255,255,255,0.12)',
                  color: 'transparent',
                }}
              >
                to Engineer.
              </span>
            </h1>
            <p
              className="text-base text-white/28 leading-relaxed max-w-xl"
              style={{ fontFamily: 'system-ui', fontWeight: 300 }}
            >
              A precision-engineered{' '}
              <span className="text-white/55 font-semibold">16-week journey</span>
              {' '}— one hour a day, five days a week. From semantic HTML to full-stack
              PHP APIs and production databases.
            </p>
          </div>

          {/* Stat chips */}
          <div className="flex flex-wrap gap-2.5">
            {[
              { label: `${totalLessons}+ Slides`, Icon: BookOpen, color: '#3b82f6' },
              { label: '16 Weeks',                Icon: Clock,    color: '#a855f7' },
              { label: `${modules.length} Modules`, Icon: CheckCircle2, color: '#10b981' },
              { label: '1h / Day',                Icon: Zap,      color: '#eab308' },
            ].map(s => (
              <div
                key={s.label}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold"
                style={{
                  borderColor: `${s.color}22`,
                  background: `${s.color}07`,
                  color: `${s.color}bb`,
                }}
              >
                <s.Icon className="w-3.5 h-3.5" />
                {s.label}
              </div>
            ))}
          </div>

          {/* Quick-access strip */}
          <ModuleStrip />
        </motion.div>

        {/* ── SECTION DIVIDER ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-14"
        >
          <div className="h-px flex-1 bg-white/5" />
          <div className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
            <ArrowRight className="w-3 h-3" />
            The Journey
          </div>
          <div className="h-px flex-1 bg-white/5" />
        </motion.div>

        {/* ── ZIGZAG ROADMAP ── */}
        <RoadmapSection />

        {/* ── FOOTER ── */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-6 flex-wrap justify-center md:justify-start">
            {[
              { l: 'Pace',    v: '5h / Week' },
              { l: 'Format',  v: 'Interactive Slides' },
              { l: 'Level',   v: 'Beginner → Pro' },
            ].map((s, i) => (
              <div key={s.l} className="flex items-center gap-6">
                {i > 0 && <div className="w-px h-6 bg-white/5 hidden md:block" />}
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-black text-white/18 uppercase tracking-[0.2em]">{s.l}</span>
                  <span className="text-sm font-bold text-white/38">{s.v}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Beta Access
          </div>
        </motion.footer>

      </main>
    </div>
  );
}