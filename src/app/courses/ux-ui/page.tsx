"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Palette, Smartphone, ArrowRight, ArrowLeft,
  Sparkles, CheckCircle2, Clock, BookOpen, Star, Layers, MousePointer2
} from "lucide-react";

export default function UxUiRoadmap() {
  return (
    <div className="min-h-screen bg-[#080c14] text-white selection:bg-purple-500/25 overflow-x-hidden p-6 md:p-12">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-[-20%] left-[-15%] w-[55%] h-[55%] bg-purple-700/8 rounded-full blur-[180px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] bg-pink-700/8 rounded-full blur-[160px]" />
      </div>

      <main className="max-w-4xl mx-auto relative z-10 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors mb-12">
          <ArrowLeft className="w-3 h-3" /> Back to Courses
        </Link>
        
        <div className="space-y-6 mb-20">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-purple-500/20 bg-purple-500/6 text-purple-400 text-[10px] font-black uppercase tracking-[0.22em]">
            UX/UI Design Masterclass · 2026
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic">
            Visual
            <br />
            <span style={{ WebkitTextStroke: '1px rgba(255,255,255,0.15)', color: 'transparent' }}>Logic.</span>
          </h1>
          <p className="text-base text-white/30 max-w-xl leading-relaxed font-light">
            Master the art of conversion-centric design. From Figma architecture to advanced prototyping and product psychology — the complete 12-week design journey.
          </p>
        </div>

        {/* Placeholder Roadmap */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-14">
            <div className="h-px flex-1 bg-white/5" />
            <div className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
              Roadmap Coming Soon
            </div>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <div className="grid gap-4">
            {[
              { title: "Module 01: Visual Foundations", desc: "Color theory, layouts, and typography grids." },
              { title: "Module 02: Figma Architecture", desc: "Design systems, components, and auto-layout." },
              { title: "Module 03: UX Workflow", desc: "User research, wireframing, and flow-charts." },
              { title: "Module 04: Visual Logic", desc: "High-fidelity UI and interaction design." },
              { title: "Module 05: Prototyping", desc: "Logic-based transitions and user testing." },
              { title: "Module 06: Portfolio Power", desc: "Final Project: Building a SaaS Dashboard." }
            ].map((m, i) => (
              <div key={i} className="p-6 rounded-2xl border border-white/5 bg-white/2 flex items-center justify-between group hover:border-purple-500/30 transition-all">
                <div className="flex items-center gap-6">
                  <div className="text-2xl font-black text-white/10 font-mono italic">{String(i + 1).padStart(2, '0')}</div>
                  <div>
                    <h3 className="font-bold text-white/70 group-hover:text-purple-400 transition-colors">{m.title}</h3>
                    <p className="text-[11px] text-white/20 mt-0.5">{m.desc}</p>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="text-[9px] font-black uppercase text-purple-400 tracking-widest flex items-center gap-1.5">
                     Locked <BookOpen className="w-3 h-3" />
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
