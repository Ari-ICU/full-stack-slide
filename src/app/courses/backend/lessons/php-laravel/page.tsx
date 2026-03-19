import PHPLaravelLesson from "@/components/backend/php-laravel-slides";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export const metadata = {
  title: "PHP & Laravel Masterclass | 3-Month Intensive",
  description:
    "The complete backend journey. Master PHP fundamentals, Laravel framework, database architecture, and production deployment.",
};

export default function BackendLessonPage() {
  return (
    <main className="min-h-screen bg-[#080c14] overflow-hidden">
      {/* Navigation / Header */}
      <nav className="p-4 pointer-events-none">
        <div className="max-w-6xl mx-auto flex items-center justify-between pointer-events-auto">
          {/* Back Button */}
          <Link
            href="/courses/backend"
            className="group flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-lg"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-sm font-medium tracking-wide">
              Roadmap
            </span>
          </Link>

          {/* Module Indicator */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-black/30 backdrop-blur-sm shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40">
              3-MONTH BACKEND MASTERCLASS
            </span>
          </div>
        </div>
      </nav>

      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white/20 font-black uppercase tracking-widest italic animate-pulse">Initializing Engineering Environment...</div>}>
        <PHPLaravelLesson />
      </Suspense>
    </main>
  );
}
