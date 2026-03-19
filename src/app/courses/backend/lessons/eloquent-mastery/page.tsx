"use client";

import BackendGenericSlides, { Slide } from "@/components/backend/lessons/backend-generic-slides";
import { ArrowLeft, Database, HardDrive, Zap, Layers, Code, Search, Link as LinkIcon, Eye, Activity, RefreshCcw, Terminal, ShieldCheck } from "lucide-react";
import Link from "next/link";


const eloquentSlides: Slide[] = [
  {
    title: "Eloquent Data Specialist",
    subtitle: "Module 03: Database Engineering with ORM",
    content: "Master the most powerful object-relational mapper in the PHP world. Beyond basic queries into database performance engineering.",
    type: 'hero',
    icon: Database
  },
  {
    title: "Active Record Philosophy",
    subtitle: "ORM vs SQL",
    content: "Understand the Active Record pattern. Learn how Eloquent maps database rows to expressive PHP objects seamlessly.",
    type: 'concept',
    icon: Search
  },
  {
    title: "Schema Management",
    subtitle: "Migrations API",
    content: "Building and modifying databases through code. Learn about rollbacks, column types, and industrial migration workflows.",
    type: 'diagram',
    icon: HardDrive
  },
  {
    title: "Model Factories",
    subtitle: "Synthetic Data Generation",
    content: "Use Faker to generate millions of realistic testing records. Build complex data states for local development and CI testing.",
    type: 'code',
    icon: RefreshCcw
  },
  {
    title: "Basic CRUD & Beyond",
    subtitle: "Fluent Queries",
    content: "Mastering find, findOrFail, and complex where clauses. Learn how to use 'chunk' and 'cursor' for memory-efficient processing.",
    type: 'concept',
    icon: Zap
  },
  {
    title: "Relationships: 1-to-Many",
    subtitle: "The Foundation",
    content: "The most common relationship. Learn how to define 'hasMany' and 'belongsTo' with proper foreign key indexing.",
    type: 'diagram',
    icon: LinkIcon
  },
  {
    title: "Many-to-Many Logic",
    subtitle: "Pivot Tables",
    content: "Mastering the 'belongsToMany' relationship. Learn how to attach, detach, and sync records with pivot table data.",
    type: 'code',
    icon: Layers
  },
  {
    title: "Polymorphic Relations",
    subtitle: "Flexible Architecture",
    content: "Build one model that can belong to multiple other models. Perfect for likes, comments, and tagging systems.",
    type: 'concept',
    icon: Activity
  },
  {
    title: "Has-Many-Through",
    subtitle: "Deep Relationships",
    content: "Access related data across three tables effortlessly. Learn how to jump through intermediate models to find what you need.",
    type: 'diagram',
    icon: Search
  },
  {
    title: "The N+1 Problem",
    subtitle: "Performance Killer",
    content: "One of the biggest pitfalls in ORM usage. Learn how to detect N+1 queries and use Eager Loading ('with') to solve them.",
    type: 'concept',
    icon: Eye
  },
  {
    title: "Query Scopes",
    subtitle: "Reusable Logic",
    content: "Keep your controllers clean. Wrap complex query logic into reusable local and global scopes to keep your code DRY.",
    type: 'code',
    icon: Zap
  },
  {
    title: "Eloquent Observers",
    subtitle: "Event-Driven Data",
    content: "Hook into the model lifecycle. Automatically trigger actions when a record is created, updated, or deleted.",
    type: 'concept',
    icon: Activity
  },
  {
    title: "Custom Casts",
    subtitle: "Data Transformation",
    content: "Automatically transform database values into PHP objects, Enums, or unique data types as soon as they are accessed.",
    type: 'code',
    icon: Code
  },
  {
    title: "Mass Assignment",
    subtitle: "Security & Guarding",
    content: "Protecting your models from malicious data injection. Learn about 'fillable' vs 'guarded' and when to use them.",
    type: 'concept',
    icon: RefreshCcw
  },
  {
    title: "API Resources",
    subtitle: "Data Serialization",
    content: "The bridge between your models and the JSON output. Learn how to transform your data into clean, versioned API responses.",
    type: 'diagram',
    icon: Layers
  },
  {
    title: "Pagination Strategies",
    subtitle: "Large Data Handling",
    content: "Don't return everything. Master LengthAware pagination vs Simple pagination for different UX requirements.",
    type: 'concept',
    icon: Database
  },
  {
    title: "Raw SQL Queries",
    subtitle: "Breaking the ORM",
    content: "Sometimes the ORM isn't enough. Learn how to drop into raw SQL safely using DB::raw without risking injection.",
    type: 'code',
    icon: Terminal
  },
  {
    title: "Database Transactions",
    subtitle: "Atomicity & Safety",
    content: "Ensure multiple database operations either all succeed or all fail. Hardening your app against partial data corruption.",
    type: 'concept',
    icon: ShieldCheck
  },
  {
    title: "Query Optimization",
    subtitle: "High-Performance Data",
    content: "Using database indexes effectively. Learn how to read query execution plans and optimize slow Eloquent calls.",
    type: 'diagram',
    icon: Activity
  },
  {
    title: "Final Data Project",
    subtitle: "Review & Build",
    content: "Consolidating all Eloquent knowledge to build a highly optimized, complex multi-tenant database architecture.",
    type: 'hero',
    icon: Database
  }
];

export default function EloquentMasteryLessonPage() {
  return (
    <main className="min-h-screen bg-[#080c14] overflow-hidden">
      <nav className="p-6 pointer-events-none sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between pointer-events-auto">
          <Link
            href="/courses/backend"
            className="group flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/50 hover:text-white hover:bg-white/10 transition-all duration-300 shadow-2xl"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-sm font-medium tracking-wide">Back to Roadmap</span>
          </Link>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/6 bg-black/40 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30 truncate">Module 03: Eloquent Mastery</span>
          </div>
        </div>
      </nav>

      <BackendGenericSlides lessonTitle="Eloquent Data Specialist" slides={eloquentSlides} />
    </main>
  );
}
