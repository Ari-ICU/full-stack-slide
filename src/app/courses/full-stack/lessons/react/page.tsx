import ReactLessonSlides from '@/components/full-stack/lessons/react-slide';
import { ArrowLeft, Atom } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "React Essentials | Full-Stack Curriculum",
  description: "Learn to build interactive and dynamic user interfaces with React.",
};

export default function ReactLessonPage() {
  return (
    <main className="min-h-screen bg-[#030303] relative overflow-hidden">

      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[30%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[20%] w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/courses/full-stack"
            className="group flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/50 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Roadmap
          </Link>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-black/30 backdrop-blur-sm">
            <Atom className="w-3.5 h-3.5 text-blue-400" />
            <span className="sr-only">Module 05 — React</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse ml-1" />
          </div>
        </div>
      </nav>

      <ReactLessonSlides />
    </main>
  );
}
