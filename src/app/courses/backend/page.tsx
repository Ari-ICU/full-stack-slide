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
    href: "/courses/backend/lessons/php-laravel?module=01",
    num: "01",
    label: "PHP Zero to Pro & Laravel Setup",
    tag: "Weeks 1–2",
    description: "From deep PHP foundations to professional Laravel architecture.",
    color: "#3b82f6",
    dimColor: "rgba(59,130,246,0.12)",
    icon: Code,
    weeks: "Weeks 1–2",
    lessons: 10,
    skills: ["PHP OOP", "Logic Architecture", "Composer", "Artisan", "Routing"],
    lessonsList: [
      "PHP Foundations", "Advanced Arrays", "OOP Principles", "Logic Systems", "Pro Challenge",
      "Laravel Install", "PHP Composer", "Artisan CLI", "Routing Engine", "URL Params"
    ],
  },
  {
    href: "/courses/backend/lessons/php-laravel?module=02",
    num: "02",
    label: "MVC & Blade Template",
    tag: "Weeks 3–4",
    description: "Organise logic with Controllers and build UI with Blade engine.",
    color: "#a855f7",
    dimColor: "rgba(168,85,247,0.12)",
    icon: Palette,
    weeks: "Weeks 3–4",
    lessons: 10,
    skills: ["MVC", "Controllers", "Blade", "Layouts", "Passing Data"],
    lessonsList: [
      "MVC Concept", "Create Controller", "Methods", "Route Connect", "Practice",
      "Blade Basics", "Layouts", "Passing Data", "Blade Loops", "Mini Project"
    ],
  },
  {
    href: "/courses/backend/lessons/php-laravel?module=03",
    num: "03",
    label: "Database & Eloquent",
    tag: "Weeks 5–6",
    description: "Designing schemas and interacting with data using ORM.",
    color: "#eab308",
    dimColor: "rgba(234,179,8,0.12)",
    icon: Database,
    weeks: "Weeks 5–6",
    lessons: 10,
    skills: ["Migrations", "Schema", "Eloquent", "Models", "Collections"],
    lessonsList: [
      "Database Intro", "Migrations", "Schema Design", "Running Migrations", "Seeders",
      "Eloquent Basics", "Create Data", "Fetch Data", "Update Data", "Delete Data"
    ],
  },
  {
    href: "/courses/backend/lessons/php-laravel?module=04",
    num: "04",
    label: "CRUD & API Design",
    tag: "Weeks 7–8",
    description: "Building production-grade RESTful APIs and resource controllers.",
    color: "#f05032",
    dimColor: "rgba(240,80,50,0.12)",
    icon: Zap,
    weeks: "Weeks 7–8",
    lessons: 10,
    skills: ["CRUD", "REST API", "JSON", "Resources", "Validation"],
    lessonsList: [
      "API Routes", "JSON Responses", "Resource Controllers", "API Resources", "Error Responses",
      "Full Product CRUD", "Validation Rules", "Custom Validation", "Route Binding", "Practice"
    ],
  },
  {
    href: "/courses/backend/lessons/php-laravel?module=05",
    num: "05",
    label: "Auth & Relationships",
    tag: "Weeks 9–10",
    description: "Secure your apps and build complex data structures.",
    color: "#06b6d4",
    dimColor: "rgba(6,182,212,0.12)",
    icon: Server,
    weeks: "Weeks 9–10",
    lessons: 10,
    skills: ["Sanctum", "Middleware", "Breeze", "One-to-Many", "Many-to-Many"],
    lessonsList: [
      "Auth Intro", "Breeze/Sanctum", "Login/Register", "Middleware", "Protected Routes",
      "One-to-Many", "Belongs To", "Many-to-Many", "Pivot Tables", "Advanced Queries"
    ],
  },
  {
    href: "/courses/backend/lessons/php-laravel?module=06",
    num: "06",
    label: "Final Project & Deploy",
    tag: "Weeks 11–12",
    description: "Construct a professional E-commerce API and launch successfully.",
    color: "#10b981",
    dimColor: "rgba(16,185,129,0.12)",
    icon: Terminal,
    weeks: "Weeks 11–12",
    lessons: 10,
    skills: ["Ecommerce API", "Cart System", "Deployment", "Railway", "Production"],
    lessonsList: [
      "Project Plan", "Product Engine", "Cart Logic", "Order System", "User Auth",
      "Clean Code", "Env Config", "Railway Deploy", "Domain Setup", "Final Review"
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
                <span>{mod.lessons} lessons</span>
              </div>
              <div
                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest"
                style={{ color: mod.color, gap: hovered ? '10px' : '6px', transition: 'gap 0.3s' }}
              >
                Start Module <ChevronRight className="w-3.5 h-3.5" />
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
          </>
        )}
      </svg>
    </div>
  );
}

export default function BackendRoadmap() {
  return (
    <div className="min-h-screen bg-[#080c14] text-white selection:bg-emerald-500/25 overflow-x-hidden">
      {/* Fixed background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-15%] w-[55%] h-[55%] bg-emerald-700/5 rounded-full blur-[180px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] bg-blue-700/5 rounded-full blur-[160px]" />
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
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Specialties
        </Link>

        {/* ── HERO ── */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.32, 0.72, 0, 1] }}
          className="mb-20 space-y-7"
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/6 text-emerald-400 text-[10px] font-black uppercase tracking-[0.22em]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Backend Engineer Roadmap · 3-Month Mastery
          </div>

          <div className="max-w-3xl space-y-3">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.86] italic">
              Architect
              <br />
              <span style={{ WebkitTextStroke: '2px rgba(255,255,255,0.12)', color: 'transparent' }}>the Logic.</span>
            </h1>
            <p className="text-base text-white/28 leading-relaxed max-w-xl font-light">
              Master world-class <span className="text-white/55 font-semibold">PHP & Laravel</span> systems. 
              A 12-week comprehensive journey from foundations to scalable e-commerce APIs.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {[
              { label: '60 Lessons',              Icon: BookOpen, color: '#10b981' },
              { label: '12 Weeks',                Icon: Clock,    color: '#3b82f6' },
              { label: '6 Modules',               Icon: CheckCircle2, color: '#a855f7' },
              { label: 'PHP + Laravel',           Icon: Terminal, color: '#fb923c' },
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
        </motion.div>

        {/* ── ZIGZAG ROADMAP ── */}
        <div className="relative max-w-4xl mx-auto mt-20">
          <div className="absolute left-1/2 top-8 bottom-8 w-px -translate-x-1/2 hidden md:block pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.05) 8%, rgba(255,255,255,0.05) 92%, transparent)' }} />

          <div className="space-y-0">
            {modules.map((mod, i) => {
              const isLeft = i % 2 === 0;
              const nextMod = modules[i + 1];

              return (
                <div key={mod.num}>
                  <div className="grid md:grid-cols-[1fr_auto_1fr] gap-x-6 items-center">
                    <div>{isLeft ? <ModuleCard mod={mod} isLeft={true} /> : null}</div>
                    <div className="hidden md:flex justify-center"><SpineNode mod={mod} /></div>
                    <div>{!isLeft ? <ModuleCard mod={mod} isLeft={false} /> : null}</div>
                    <div className="md:hidden col-span-3"><ModuleCard mod={mod} isLeft={true} /></div>
                  </div>
                  {nextMod && (
                    <div className="hidden md:block">
                      <Connector from={mod.color} to={nextMod.color} toRight={isLeft} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-black text-white/18 uppercase tracking-[0.2em]">Format</span>
              <span className="text-sm font-bold text-white/38">Interactive Masterclass</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-black text-white/18 uppercase tracking-[0.2em]">Level</span>
              <span className="text-sm font-bold text-white/38">Beginner to Senior</span>
            </div>
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400/60 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5" /> Course Complete Verification
          </div>
        </footer>
      </main>
    </div>
  );
}
