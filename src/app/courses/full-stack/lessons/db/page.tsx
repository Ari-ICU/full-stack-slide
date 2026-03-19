"use client";

import React from 'react';
import DbLesson from '@/components/full-stack/lessons/db-slides';
import { ChevronLeft, Home } from 'lucide-react';
import Link from 'next/link';

export default function DbLessonPage() {
  return (
    <div className="min-h-screen bg-[#030303] flex flex-col">
      {/* Mini Nav */}
      <nav className="p-4 pointer-events-none">
        <div className="max-w-4xl mx-auto flex items-center justify-between pointer-events-auto">
          <Link
            href="/courses/full-stack"
            className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all pointer-events-auto flex items-center gap-2 group"
          >
            <ChevronLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Back to Roadmap</span>
          </Link>
          <div className="flex items-center gap-4 pointer-events-auto">
            <div className="px-5 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-3xl">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none">Database Masterclass</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col h-screen">
        <DbLesson />
      </main>
    </div>
  );
}
