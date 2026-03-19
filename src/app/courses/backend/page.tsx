"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  BookOpen, Code, Database, Zap, Palette, Server,
  Star, HardDrive, CheckCircle2, Clock, ArrowRight,
  ChevronRight, Layers, Globe, Terminal, GitBranch,
  MousePointer2, ArrowLeft, ShieldCheck
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
    href: "/courses/backend/lessons/php-fundamentals",
    num: "01",
    label: "PHP Foundations",
    tag: "Base Language",
    description: "Modern PHP 8.x syntax, type system, OOP patterns, and Composer dependency management.",
    color: "#4f5b93",
    dimColor: "rgba(79,91,147,0.12)",
    icon: Code,
    weeks: "Weeks 1–2",
    lessons: 15,
    skills: ["PHP 8.x", "OOP", "Composer", "Attributes"],
    lessonsList: [
      "PHP Setup & Syntax", "Types & Variables", "Control Structures", "Functional PHP",
      "OOP: Classes & Interfaces", "Trait & Abstract Classes", "Namespaces & Autoloading", 
      "Composer Essentials", "Error Handling (Exceptions)", "Testing with Pest", "Project Alpha"
    ],
  },
  {
    href: "/courses/backend/lessons/laravel-core",
    num: "02",
    label: "Laravel Core",
    tag: "Framework",
    description: "The Service Container, Service Providers, Middlewares, and the elegant Request Lifecycle.",
    color: "#ff2d20",
    dimColor: "rgba(255,45,32,0.12)",
    icon: Zap,
    weeks: "Weeks 3–4",
    lessons: 22,
    skills: ["Routing", "Service Container", "Blade", "Controllers"],
    lessonsList: [
      "Laravel Installation", "The Request Lifecycle", "Service Container Deep Dive", "Service Providers",
      "Routing & Parameters", "Middleware Logic", "Controllers & Actions", "Blade Templating",
      "Form Requests", "Validation Logic", "Helpers & Collections", "Project Beta"
    ],
  },
  {
    href: "/courses/backend/lessons/eloquent-mastery",
    num: "03",
    label: "Eloquent & Data",
    tag: "Persistence",
    description: "Advanced ORM patterns, complex relationships, migrations, and query optimization.",
    color: "#f59e0b",
    dimColor: "rgba(245,158,11,0.12)",
    icon: Database,
    weeks: "Weeks 5–6",
    lessons: 28,
    skills: ["Eloquent", "Migrations", "Relationships", "Scopes"],
    lessonsList: [
      "DB Setup & Configuration", "Migrations & Factories", "Eloquent CRUD", "Relationships (1:1, 1:N, N:N)",
      "Polymorphic Relations", "Advanced Query Caching", "Eager vs Lazy Loading", "Mass Assignment",
      "Eloquent Observers", "Repository Pattern", "Raw SQL Queries", "Project Gamma"
    ],
  },
  {
    href: "/courses/backend/lessons/laravel-security",
    num: "04",
    label: "Auth & Security",
    tag: "Shield",
    description: "Laravel Sanctum, Policies, Gates, and guarding against industrial security threats.",
    color: "#6366f1",
    dimColor: "rgba(99,102,241,0.12)",
    icon: ShieldCheck,
    weeks: "Weeks 7–8",
    lessons: 16,
    skills: ["Sanctum", "Breeze", "Gates", "Policies"],
    lessonsList: [
      "Authentication Basics", "Laravel Breeze/Jetstream", "Sanctum for APIs", "Authorizing Actions (Gates)",
      "Policy Implementation", "Password Hashing Logic", "CSRF & XSS Protection", "Rate Limiting",
      "Security Headers", "Sanitizing Input", "Role Based Access (RBAC)", "Project Delta"
    ],
  },
  {
    href: "/courses/backend/lessons/laravel-advanced",
    num: "05",
    label: "Advanced Laravel",
    tag: "Concurrency",
    description: "Queues, Jobs, Redis integration, Event Broadcasting, and Enterprise Patterns.",
    color: "#a855f7",
    dimColor: "rgba(168,85,247,0.12)",
    icon: Layers,
    weeks: "Weeks 9–10",
    lessons: 24,
    skills: ["Queues", "Broadcasting", "API Design", "Redis"],
    lessonsList: [
      "Queues & Job Processing", "Redis Integration", "Event Listenters", "Broadcasting (Pusher/Reverb)",
      "Real-time Notifications", "API Resource Classes", "Versioning APIs", "Task Scheduling",
      "Package Development", "Job Batching", "Horizon Dashboard", "Project Sigma"
    ],
  },
  {
    href: "/courses/backend/lessons/laravel-devops",
    num: "06",
    label: "DevOps & Cloud",
    tag: "Ship",
    description: "Laravel Sail (Docker), Forge, Envoyer, and zero-downtime CI/CD workflows.",
    color: "#f43f5e",
    dimColor: "rgba(244,63,94,0.12)",
    icon: HardDrive,
    weeks: "Weeks 11–12",
    lessons: 15,
    skills: ["Docker", "Forge", "CI/CD", "Server Management"],
    lessonsList: [
      "Laravel Sail Setup", "Docker for PHP", "GitHub Actions for CI", "Deployment with Forge",
      "SSL & Domain Config", "Nginx for Laravel", "Supervisor Configuration", "Database Backups",
      "Monitoring (Sentry/Flare)", "Horizontal Scaling", "Server Hardening", "Graduation Project"
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
      <div
        className="absolute left-1/2 top-8 bottom-8 w-px -translate-x-1/2 hidden md:block pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.05) 8%, rgba(255,255,255,0.05) 92%, transparent)',
        }}
      />

      <div className="space-y-0">
        {modules.map((mod, i) => {
          const isLeft = i % 2 === 0;
          const nextMod = modules[i + 1];

          return (
            <div key={mod.href}>
              <div className="grid md:grid-cols-[1fr_auto_1fr] gap-x-6 items-center">
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
                <div className="hidden md:flex justify-center">
                  <SpineNode mod={mod} />
                </div>
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
                <div className="md:hidden col-span-3">
                  <ModuleCard mod={mod} isLeft={true} />
                </div>
              </div>

              {nextMod && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="hidden md:block"
                >
                  <Connector from={mod.color} to={nextMod.color} toRight={isLeft} />
                </motion.div>
              )}

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
                borderColor: 'rgba(16,185,129,0.45)',
                background: 'rgba(16,185,129,0.08)',
                boxShadow: '0 0 50px rgba(16,185,129,0.12)',
              }}
            >
              <Star className="w-8 h-8 fill-current" style={{ color: '#10b981' }} />
            </div>
            <div className="text-center">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-400/60">Backend Specialist</p>
              <p className="text-[10px] text-white/20 mt-1 font-mono">{totalLessons}+ slides · 12 weeks</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── MODULE STRIP ────────────────────────────────────────────── */
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
export default function BackendRoadmap() {
  return (
    <div
      className="min-h-screen bg-[#080c14] text-white selection:bg-emerald-500/25 overflow-x-hidden"
      style={{ fontFamily: "'DM Mono','JetBrains Mono',system-ui,sans-serif" }}
    >
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-15%] w-[55%] h-[55%] bg-emerald-700/5 rounded-full blur-[180px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] bg-blue-700/5 rounded-full blur-[160px]" />
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

        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.32, 0.72, 0, 1] }}
          className="mb-20 space-y-7"
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/6 text-emerald-400 text-[10px] font-black uppercase tracking-[0.22em]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Backend Architecture Roadmap · 2026 Curriculum
          </div>

          <div className="max-w-3xl space-y-3">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.86]" style={{ fontFamily: "'DM Mono','JetBrains Mono',monospace" }}>
              Architecting
              <br />
              <span style={{ WebkitTextStroke: '2px rgba(255,255,255,0.12)', color: 'transparent' }}>Logic.</span>
            </h1>
            <p className="text-base text-white/28 leading-relaxed max-w-xl" style={{ fontFamily: 'system-ui', fontWeight: 300 }}>
              Build world-class backends with a precision-engineered <span className="text-white/55 font-semibold">12-week journey</span>. From runtime internals to high-scale cloud deployment.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {[
              { label: `${totalLessons}+ Slides`, Icon: BookOpen, color: '#10b981' },
              { label: '12 Weeks',                Icon: Clock,    color: '#36bffa' },
              { label: `${modules.length} Modules`, Icon: CheckCircle2, color: '#a855f7' },
              { label: 'Adv. Core',                Icon: Zap,      color: '#f59e0b' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold"
                style={{ borderColor: `${s.color}22`, background: `${s.color}07`, color: `${s.color}bb` }}>
                <s.Icon className="w-3.5 h-3.5" />
                {s.label}
              </div>
            ))}
          </div>

          <ModuleStrip />
        </motion.div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex items-center gap-4 mb-14">
          <div className="h-px flex-1 bg-white/5" />
          <div className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
            <ArrowRight className="w-3 h-3" />
            Logic Roadmap
          </div>
          <div className="h-px flex-1 bg-white/5" />
        </motion.div>

        <RoadmapSection />

        <motion.footer initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6 flex-wrap justify-center md:justify-start">
            {[
              { l: 'Pace',    v: '6h / Week' },
              { l: 'Format',  v: 'System Architecture' },
              { l: 'Level',   v: 'Mid → Senior' },
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
            Live Access
          </div>
        </motion.footer>
      </main>
    </div>
  );
}
