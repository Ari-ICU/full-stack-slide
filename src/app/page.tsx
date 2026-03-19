"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Code, Palette, Smartphone, Database, ArrowRight,
  Sparkles, CheckCircle2, Clock, BookOpen, Star, Terminal, Server
} from "lucide-react";

const coursePaths = [
  {
    id: "full-stack",
    title: "Full-Stack Engineer",
    tag: "Most Popular",
    tagColor: "#3b82f6",
    description: "From semantic HTML to professional PHP & Laravel APIs. The complete 4-month mastery.",
    icon: Code,
    color: "#3b82f6",
    dimColor: "rgba(59,130,246,0.1)",
    weeks: 16,
    modules: 8,
    difficulty: "Beginner → Pro",
  },
  {
    id: "backend",
    title: "Backend Engineer",
    tag: "Core Logic",
    tagColor: "#10b981",
    description: "Deep dive into APIs, System Design, and Server Architecture. Node.js, Go & Databases.",
    icon: Server,
    color: "#10b981",
    dimColor: "rgba(16,185,129,0.1)",
    weeks: 12,
    modules: 6,
    difficulty: "Beginner → Expert",
  },
  {
    id: "ux-ui",
    title: "UX/UI Design",
    tag: "Creative",
    tagColor: "#a855f7",
    description: "Master modern aesthetics, Figma design systems, and user-centric architecture.",
    icon: Palette,
    color: "#a855f7",
    dimColor: "rgba(168,85,247,0.1)",
    weeks: 12,
    modules: 6,
    difficulty: "Visual → UI",
  },
];

function CourseCard({ course }: { course: typeof coursePaths[0] }) {
  const Icon = course.icon;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="group relative"
    >
      <Link href={`/courses/${course.id}`} className="block">
        <div 
          className="h-full rounded-[32px] border bg-[#0d1117] overflow-hidden transition-all duration-300"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          {/* Border Glow */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[32px] pointer-events-none"
            style={{ 
              boxShadow: `0 0 40px ${course.color}15, inset 0 0 20px ${course.color}10`,
              border: `1px solid ${course.color}30`
            }}
          />

          <div className="p-8 relative z-10 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                style={{ background: course.dimColor, color: course.color }}
              >
                <Icon className="w-7 h-7" />
              </div>
              <span 
                className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border"
                style={{ color: course.tagColor, borderColor: `${course.tagColor}30`, background: `${course.tagColor}10` }}
              >
                {course.tag}
              </span>
            </div>

            {/* Title & Description */}
            <div className="flex-1">
              <h2 className="text-2xl font-black tracking-tight text-white mb-3 group-hover:text-blue-400 transition-colors">
                {course.title}
              </h2>
              <p className="text-sm text-white/30 leading-relaxed font-light mb-8">
                {course.description}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-white/10" />
                <span className="text-xs font-mono text-white/20 whitespace-nowrap">{course.weeks} Weeks</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-white/10" />
                <span className="text-xs font-mono text-white/20 whitespace-nowrap">{course.modules} Modules</span>
              </div>
            </div>

            {/* Action */}
            <div 
              className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between group-hover:border-white/10"
            >
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-white/10 uppercase tracking-widest">Level</span>
                <span className="text-[10px] font-bold text-white/30">{course.difficulty}</span>
              </div>
              <div 
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all"
                style={{ color: course.color }}
              >
                View Roadmap 
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#080c14] text-white overflow-hidden p-6 md:p-12 selection:bg-blue-500/25">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-600/10 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-600/10 blur-[140px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <main className="max-w-6xl mx-auto relative z-10">
        
        {/* Navigation / Logo */}
        <div className="flex items-center justify-between mb-24">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black italic shadow-lg shadow-blue-600/20">
              AC
            </div>
            <span className="text-sm font-black uppercase tracking-[0.3em] opacity-40">Academy.hq</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["Roadmaps", "Learning", "Pricing", "Support"].map(l => (
              <a key={l} href="#" className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">{l}</a>
            ))}
            <button className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Student Portal</button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="mb-24 space-y-8">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/6 bg-white/2 text-white/40 text-[10px] font-black uppercase tracking-[0.25em]">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            2026 Learning Curriculum
          </div>
          <div className="max-w-3xl space-y-4">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.88] italic">
              Choose your
              <br />
              <span style={{ WebkitTextStroke: '1px rgba(255,255,255,0.15)', color: 'transparent' }}>specialty.</span>
            </h1>
            <p className="text-base text-white/30 max-w-xl leading-relaxed font-light">
              Master world-class skills with precision-engineered roadmaps. Every pathway is designed to take you from architectural foundations to professional production mastery.
            </p>
          </div>
        </div>

        {/* Grid Selection */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursePaths.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {/* Footer Stats / Global Info */}
        <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex items-center gap-10 flex-wrap justify-center">
            {[
              { l: 'Certification', v: 'Industry Standard' },
              { l: 'Pace', v: 'Flexible / Part-time' },
              { l: 'Live Sessions', v: 'Weekly Masterclass' }
            ].map(s => (
              <div key={s.l} className="flex flex-col gap-1">
                <span className="text-[9px] font-black text-white/15 uppercase tracking-widest">{s.l}</span>
                <span className="text-xs font-bold text-white/40">{s.v}</span>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}