// page.tsx (Server Component)
import NextLessonWrapper from "@/components/full-stack/lessons/next-slides";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Next.js 15 Masterclass | Full-Stack Curriculum",
  description: "Master the App Router, Server Components, and more with interactive slides.",
};

export default function NextjsLessonPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0b] overflow-hidden">
      <nav className="p-4 pointer-events-none">
        <div className="max-w-lg mx-auto flex items-center justify-between pointer-events-auto">
          <Link
            href="/courses/full-stack"
            className="group flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-2xl"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowLeft className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-sm font-medium tracking-wide">Back to Roadmap</span>
          </Link>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-black/20 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30">Module 06 · Weeks 11–12</span>
          </div>
        </div>
      </nav>
      <NextLessonWrapper />

    </main>
  );
}