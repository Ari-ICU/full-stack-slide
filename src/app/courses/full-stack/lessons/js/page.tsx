import JsLessonSlides from '@/components/full-stack/lessons/js-slides';
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "JavaScript Essentials | Full-Stack Curriculum",
  description: "Learn to add interactivity and logic to your web applications.",
};

export default function JsLessonPage() {
  return (
    <main className="min-h-screen overflow-hidden">
      {/* Premium Header / Navigation */}
      <nav className="p-4 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
          <Link
            href="/courses/full-stack"
            className="group flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-2xl"
          >
            <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowLeft className="w-4 h-4 text-yellow-400" />
            </div>
            <span className="text-sm font-medium tracking-wide">Back to Roadmap</span>
          </Link>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-black/20 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            <span className="sr-only">Module 03: JavaScript</span>
          </div>
        </div>
      </nav>
      <JsLessonSlides />
    </main>
  );
}
