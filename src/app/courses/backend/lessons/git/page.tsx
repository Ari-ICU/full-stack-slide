"use client";

import React, { Suspense } from 'react';
import GitSlides from '@/components/backend/git-slides';

export default function GitLessonPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Loading Git Masterclass...</span>
        </div>
      </div>
    }>
      <GitSlides />
    </Suspense>
  );
}
