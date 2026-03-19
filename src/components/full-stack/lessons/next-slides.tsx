"use client";

import React, { useState, useEffect, useCallback, Suspense, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Copy, Check, Play, RotateCcw,
  Server, Layout, Mouse, Sparkles, Zap, Globe2, RefreshCw,
  Lock, Image as ImageIcon, Search, Send, Activity,
  Code2, Monitor, Terminal, FileCode, Layers, GitBranch,
  Package, ArrowRight, Database, Shield, Cpu, Box,
} from "lucide-react";

/* ─── SLIDE DATA ─────────────────────────────────────────────────── */
interface Slide {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  tagColor: string;
  accent: string;
  bg: string;
  content: string[];
  lab: string;
  syntax: string;
  code: string;
  icon: React.ElementType;
}

const slides: Slide[] = [
  {
    id: "00",
    title: "Intro to Next.js 15",
    subtitle: "Fullstack React Framework",
    tag: "Overview",
    tagColor: "#60a5fa",
    accent: "#3b82f6",
    bg: "radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(99,102,241,0.08) 0%, transparent 50%)",
    content: [
      "Next.js is a React framework for production-grade apps",
      "App Router: file-based routing built into the framework",
      "Server Components ship zero JS to the browser by default",
      "Built-in image optimisation, fonts, and SEO tools",
    ],
    lab: "Identify the main performance benefit of Next.js over plain React.",
    syntax: `// Next.js sits on top of React
// React handles UI
// Next.js handles routing, data, and rendering`,
    code: `// next.config.ts — the project config
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable React strict mode
  reactStrictMode: true,
  // Allowed image domains
  images: {
    domains: ['images.unsplash.com'],
  },
};

export default nextConfig;`,
    icon: Globe2,
  },
  {
    id: "01",
    title: "Project Setup",
    subtitle: "Installation & Bootstrapping",
    tag: "Setup",
    tagColor: "#fbbf24",
    accent: "#f59e0b",
    bg: "radial-gradient(ellipse at 70% 30%, rgba(245,158,11,0.12) 0%, transparent 60%)",
    content: [
      "Use create-next-app for instant scaffolding",
      "Choose TypeScript, Tailwind CSS, and the App Router",
      "The /app directory replaces the old /pages directory",
      "Run 'npm run dev' to start the local dev server",
    ],
    lab: "Run the install command and explore the generated folder structure.",
    syntax: `npx create-next-app@latest my-app\n  --typescript\n  --tailwind\n  --app`,
    code: `// package.json — core dependencies
{
  "name": "my-app",
  "dependencies": {
    "next": "15.0.0",
    "react": "19.0.0",
    "react-dom": "19.0.0"
  },
  "scripts": {
    "dev":   "next dev",
    "build": "next build",
    "start": "next start",
    "lint":  "next lint"
  }
}`,
    icon: Zap,
  },
  {
    id: "02",
    title: "App Router",
    subtitle: "File-Based Routing",
    tag: "Routing",
    tagColor: "#34d399",
    accent: "#10b981",
    bg: "radial-gradient(ellipse at 30% 70%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    content: [
      "Every folder inside /app becomes a URL segment",
      "page.tsx defines the UI shown at that route",
      "layout.tsx wraps all children — stays mounted on navigate",
      "loading.tsx and error.tsx are built-in suspense boundaries",
    ],
    lab: "Create a /contact route by adding app/contact/page.tsx.",
    syntax: `app/\n├── layout.tsx        → shared shell\n├── page.tsx          → /\n├── about/\n│   └── page.tsx      → /about\n└── dashboard/\n    ├── layout.tsx    → dashboard shell\n    └── page.tsx      → /dashboard`,
    code: `// app/layout.tsx — root layout
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My App',
  description: 'Built with Next.js 15',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`,
    icon: Layout,
  },
  {
    id: "03",
    title: "Server Components",
    subtitle: "Zero JS by Default",
    tag: "Rendering",
    tagColor: "#a78bfa",
    accent: "#8b5cf6",
    bg: "radial-gradient(ellipse at 60% 40%, rgba(139,92,246,0.12) 0%, transparent 60%)",
    content: [
      "All components in /app are Server Components by default",
      "They render on the server — no JS is sent for them",
      "Can directly await data (databases, APIs) without useEffect",
      "Result: faster page load and better SEO out of the box",
    ],
    lab: "Explain why fetching data in a Server Component is faster than in useEffect.",
    syntax: `// No directive = Server Component\n// Can use async/await at the top level\nasync function Page() {\n  const data = await fetchData();\n  return <div>{data.title}</div>;\n}`,
    code: `// app/products/page.tsx — Server Component
async function getProducts() {
  const res = await fetch('https://api.example.com/products', {
    next: { revalidate: 3600 }, // cache 1 hour
  });
  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main>
      <h1>Products</h1>
      <ul>
        {products.map((p: { id: string; name: string }) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </main>
  );
}`,
    icon: Server,
  },
  {
    id: "04",
    title: "Client Components",
    subtitle: "Interactivity & Hooks",
    tag: "Rendering",
    tagColor: "#fb7185",
    accent: "#f43f5e",
    bg: "radial-gradient(ellipse at 25% 55%, rgba(244,63,94,0.12) 0%, transparent 60%)",
    content: [
      "Add 'use client' at the top to opt into client rendering",
      "Required for useState, useEffect, and browser APIs",
      "Keep client components small and push them to the leaves",
      "Server Components can import Client Components (not vice-versa)",
    ],
    lab: "Add 'use client' to a counter component that uses useState.",
    syntax: `"use client";\n\n// Now you can use React hooks\nimport { useState, useEffect } from 'react';`,
    code: `"use client";
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => setCount(count - 1)}
        className="px-4 py-2 bg-red-500 text-white rounded-lg"
      >
        −
      </button>
      <span className="text-2xl font-bold">{count}</span>
      <button
        onClick={() => setCount(count + 1)}
        className="px-4 py-2 bg-green-500 text-white rounded-lg"
      >
        +
      </button>
    </div>
  );
}`,
    icon: Mouse,
  },
  {
    id: "05",
    title: "Dynamic Routes",
    subtitle: "URL Parameters",
    tag: "Routing",
    tagColor: "#34d399",
    accent: "#10b981",
    bg: "radial-gradient(ellipse at 70% 60%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    content: [
      "Wrap a folder name in [brackets] for a dynamic segment",
      "Access the param via the 'params' prop in the page",
      "Use generateStaticParams() to pre-build pages at build time",
      "Catch-all routes use [...slug] to match nested paths",
    ],
    lab: "Create a /blog/[slug] route and log the slug param.",
    syntax: `app/blog/[slug]/page.tsx\n→ /blog/hello-world\n→ /blog/my-post\n\napp/shop/[...path]/page.tsx\n→ /shop/a/b/c`,
    code: `// app/blog/[slug]/page.tsx
interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;

  const post = await fetch(
    \`https://api.example.com/posts/\${slug}\`
  ).then(r => r.json());

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </article>
  );
}`,
    icon: GitBranch,
  },
  {
    id: "06",
    title: "Data Fetching",
    subtitle: "fetch() & Caching",
    tag: "Data",
    tagColor: "#fbbf24",
    accent: "#f59e0b",
    bg: "radial-gradient(ellipse at 40% 25%, rgba(245,158,11,0.12) 0%, transparent 60%)",
    content: [
      "Next.js extends native fetch() with built-in caching",
      "cache: 'no-store' — always fetch fresh (dynamic)",
      "next: { revalidate: N } — refresh every N seconds (ISR)",
      "Default: cached indefinitely until manually revalidated",
    ],
    lab: "Add { next: { revalidate: 60 } } to a fetch call.",
    syntax: `// Static (cached forever)\nawait fetch(url);\n\n// ISR (refresh every 60s)\nawait fetch(url, { next: { revalidate: 60 } });\n\n// Dynamic (no cache)\nawait fetch(url, { cache: 'no-store' });`,
    code: `// Three caching strategies
async function StaticPage() {
  // Cached at build time, never refetched
  const data = await fetch('https://api.example.com/data');
  return <div>{/* ... */}</div>;
}

async function ISRPage() {
  // Refreshes in the background every 30 seconds
  const data = await fetch('https://api.example.com/data', {
    next: { revalidate: 30 },
  });
  return <div>{/* ... */}</div>;
}

async function DynamicPage() {
  // Always fetches fresh data on every request
  const data = await fetch('https://api.example.com/data', {
    cache: 'no-store',
  });
  return <div>{/* ... */}</div>;
}`,
    icon: Database,
  },
  {
    id: "07",
    title: "Server Actions",
    subtitle: "Forms & Mutations",
    tag: "Data",
    tagColor: "#c084fc",
    accent: "#a855f7",
    bg: "radial-gradient(ellipse at 55% 65%, rgba(168,85,247,0.12) 0%, transparent 60%)",
    content: [
      "Server Actions run securely on the server, not the browser",
      "Mark async functions with 'use server' directive",
      "Pass them directly to form actions — no API route needed",
      "Automatically revalidate the page after mutation",
    ],
    lab: "Create a Server Action that logs form data on the server.",
    syntax: `"use server";\n\nasync function myAction(formData: FormData) {\n  // This code runs on the server\n  const name = formData.get('name');\n}`,
    code: `// app/contact/page.tsx
import { revalidatePath } from 'next/cache';

async function submitContact(formData: FormData) {
  "use server";

  const name  = formData.get('name') as string;
  const email = formData.get('email') as string;

  // Save to database (runs on server)
  await db.contacts.create({ name, email });

  // Refresh this page's data
  revalidatePath('/contact');
}

export default function ContactPage() {
  return (
    <form action={submitContact}>
      <input name="name"  placeholder="Name"  />
      <input name="email" placeholder="Email" type="email" />
      <button type="submit">Send</button>
    </form>
  );
}`,
    icon: Send,
  },
  {
    id: "08",
    title: "Next.js Image",
    subtitle: "Automatic Optimisation",
    tag: "Performance",
    tagColor: "#22d3ee",
    accent: "#06b6d4",
    bg: "radial-gradient(ellipse at 20% 40%, rgba(6,182,212,0.12) 0%, transparent 60%)",
    content: [
      "next/image automatically converts images to WebP/AVIF",
      "Lazy-loads images out of the viewport by default",
      "Prevents layout shift with required width and height",
      "Add priority prop for above-the-fold hero images",
    ],
    lab: "Replace an <img> tag with <Image> and add the priority prop.",
    syntax: `import Image from 'next/image';\n\n<Image\n  src="/photo.jpg"\n  alt="Description"\n  width={800}\n  height={600}\n/>`,
    code: `import Image from 'next/image';

export default function HeroSection() {
  return (
    <section>
      {/* Hero image — loads immediately */}
      <Image
        src="https://images.unsplash.com/photo-1516259762381"
        alt="Hero photo"
        width={1200}
        height={600}
        priority          // preloaded — above the fold
        className="rounded-2xl w-full object-cover"
      />

      {/* Gallery image — lazy loaded */}
      <Image
        src="/gallery/photo-1.jpg"
        alt="Gallery photo 1"
        width={400}
        height={300}
        // No priority = lazy loaded automatically
      />
    </section>
  );
}`,
    icon: ImageIcon,
  },
  {
    id: "09",
    title: "Metadata & SEO",
    subtitle: "Head Tags & Open Graph",
    tag: "SEO",
    tagColor: "#4ade80",
    accent: "#22c55e",
    bg: "radial-gradient(ellipse at 65% 35%, rgba(34,197,94,0.12) 0%, transparent 60%)",
    content: [
      "Export a 'metadata' object to set <head> tags",
      "generateMetadata() for dynamic per-page meta",
      "Open Graph fields control social media previews",
      "Metadata is only supported in Server Components",
    ],
    lab: "Add an openGraph object with title and image to a page's metadata.",
    syntax: `// Static metadata\nexport const metadata = { title: '...' };\n\n// Dynamic metadata\nexport async function generateMetadata({ params }) {\n  return { title: params.slug };\n}`,
    code: `// app/blog/[slug]/page.tsx
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPost(slug);

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title:  post.title,
      images: [{ url: post.coverImage }],
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await fetchPost(slug);
  return <article>{post.body}</article>;
}`,
    icon: Search,
  },
  {
    id: "10",
    title: "Middleware",
    subtitle: "Edge Request Handling",
    tag: "Advanced",
    tagColor: "#fb923c",
    accent: "#f97316",
    bg: "radial-gradient(ellipse at 35% 60%, rgba(249,115,22,0.12) 0%, transparent 60%)",
    content: [
      "Middleware runs at the edge before a request is processed",
      "Lives in middleware.ts at the project root",
      "Use it for auth checks, redirects, and A/B testing",
      "config.matcher controls which routes it runs on",
    ],
    lab: "Write middleware that redirects unauthenticated users to /login.",
    syntax: `// middleware.ts (root of project)\nimport { NextResponse } from 'next/server';\nimport type { NextRequest } from 'next/server';`,
    code: `// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  const isProtected = request.nextUrl.pathname.startsWith('/dashboard');

  if (isProtected && !token) {
    // Redirect to login if not authenticated
    return NextResponse.redirect(
      new URL('/login', request.url)
    );
  }

  return NextResponse.next();
}

// Run only on /dashboard routes
export const config = {
  matcher: ['/dashboard/:path*'],
};`,
    icon: Shield,
  },
  {
    id: "11",
    title: "Route Handlers",
    subtitle: "API Endpoints",
    tag: "API",
    tagColor: "#818cf8",
    accent: "#6366f1",
    bg: "radial-gradient(ellipse at 50% 30%, rgba(99,102,241,0.12) 0%, transparent 60%)",
    content: [
      "Route Handlers replace the old /pages/api directory",
      "Create app/api/route.ts — export named HTTP methods",
      "Supports GET, POST, PUT, DELETE, PATCH, and more",
      "Can access request body, headers, and cookies",
    ],
    lab: "Create a GET handler that returns a JSON list of users.",
    syntax: `// app/api/users/route.ts\nexport async function GET(req: Request) { }\nexport async function POST(req: Request) { }`,
    code: `// app/api/users/route.ts
import { NextResponse } from 'next/server';

const users = [
  { id: 1, name: 'Ratha' },
  { id: 2, name: 'Dara' },
];

export async function GET() {
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newUser = { id: users.length + 1, ...body };
  users.push(newUser);
  return NextResponse.json(newUser, { status: 201 });
}`,
    icon: Activity,
  },
  {
    id: "12",
    title: "Rendering Modes",
    subtitle: "SSG, SSR, ISR, PPR",
    tag: "Advanced",
    tagColor: "#f472b6",
    accent: "#ec4899",
    bg: "radial-gradient(ellipse at 70% 50%, rgba(236,72,153,0.12) 0%, transparent 60%)",
    content: [
      "Static (SSG) — HTML built once at deploy time",
      "Dynamic (SSR) — HTML generated fresh on every request",
      "ISR — static pages that refresh on a schedule",
      "PPR (Partial Pre-rendering) — static shell + dynamic streams",
    ],
    lab: "Decide which rendering mode suits a live sports scoreboard.",
    syntax: `// Force dynamic (SSR)\nexport const dynamic = 'force-dynamic';\n\n// Force static (SSG)\nexport const dynamic = 'force-static';\n\n// ISR — revalidate every 60s\nexport const revalidate = 60;`,
    code: `// app/scores/page.tsx — fully dynamic (SSR)
export const dynamic = 'force-dynamic';

export default async function ScoresPage() {
  const scores = await fetch('https://api.scores.com/live', {
    cache: 'no-store',
  }).then(r => r.json());

  return (
    <ul>
      {scores.map((s: { id: string; team: string; score: number }) => (
        <li key={s.id}>
          {s.team}: {s.score}
        </li>
      ))}
    </ul>
  );
}`,
    icon: Cpu,
  },
  {
    id: "FA",
    title: "Final Project",
    subtitle: "Full-Stack Blog App",
    tag: "Assignment",
    tagColor: "#fde047",
    accent: "#eab308",
    bg: "radial-gradient(ellipse at 50% 50%, rgba(234,179,8,0.15) 0%, transparent 60%), radial-gradient(ellipse at 10% 90%, rgba(249,115,22,0.08) 0%, transparent 50%)",
    content: [
      "App Router with at least 3 routes (/,  /blog, /blog/[slug])",
      "Server Components for data fetching with ISR caching",
      "Client Component for a search or filter input",
      "Metadata on every page for proper SEO",
      "next/image for all images with correct props",
    ],
    lab: "Build a full-stack blog with listing, detail pages, and a contact form using Server Actions.",
    syntax: `// Suggested structure\napp/\n├── page.tsx          → Home\n├── blog/\n│   ├── page.tsx      → Post list\n│   └── [slug]/\n│       └── page.tsx  → Post detail\n└── contact/\n    └── page.tsx      → Contact form`,
    code: `// app/blog/page.tsx — Blog listing page
import Link from 'next/link';
import Image from 'next/image';

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
}

async function getPosts(): Promise<Post[]> {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 },
  });
  return res.json();
}

export const metadata = {
  title: 'Blog | My App',
  description: 'Read the latest articles.',
};

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-black mb-8">Blog</h1>
      <div className="grid gap-8">
        {posts.map(post => (
          <Link key={post.slug} href={\`/blog/\${post.slug}\`}>
            <article className="flex gap-4 p-6 rounded-2xl border hover:bg-white/5">
              <Image src={post.cover} alt={post.title} width={120} height={80} />
              <div>
                <h2 className="text-xl font-bold">{post.title}</h2>
                <p className="text-zinc-400">{post.excerpt}</p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}`,
    icon: Sparkles,
  },
];

/* ─── SYNTAX HIGHLIGHTER ─────────────────────────────────────────── */
const TS_KEYWORDS = new Set([
  'const','let','var','function','return','if','else','for','while',
  'async','await','export','import','default','from','type','interface',
  'extends','implements','class','new','this','true','false','null',
  'undefined','typeof','as','in','of','break','continue','throw','try',
  'catch','finally','static','get','set','public','private','protected',
]);

const HighlightedCode = ({ code }: { code: string }) => {
  const tokenizeLine = (line: string): React.ReactNode => {
    const commentIdx = line.indexOf('//');
    if (commentIdx !== -1) {
      return <>
        {tokenizeLine(line.slice(0, commentIdx))}
        <span style={{ color: '#6b7280', fontStyle: 'italic' }}>{line.slice(commentIdx)}</span>
      </>;
    }
    const parts = line.split(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\b\d+(?:\.\d+)?\b|\b[a-zA-Z_$][a-zA-Z0-9_$]*\b)/g);
    return parts.map((part, i) => {
      if (!part) return null;
      if (TS_KEYWORDS.has(part)) return <span key={i} style={{ color: '#f87171', fontWeight: 700 }}>{part}</span>;
      if (/^["'`]/.test(part)) return <span key={i} style={{ color: '#86efac' }}>{part}</span>;
      if (/^\d/.test(part)) return <span key={i} style={{ color: '#c084fc' }}>{part}</span>;
      if (/^[A-Z]/.test(part)) return <span key={i} style={{ color: '#fbbf24' }}>{part}</span>;
      return <span key={i} style={{ color: '#e2e8f0' }}>{part}</span>;
    });
  };

  return (
    <div
      className="font-mono text-sm leading-6 whitespace-pre"
      style={{ fontFamily: "'JetBrains Mono','Fira Code','Cascadia Code',monospace" }}
    >
      {code.split('\n').map((line, i) => (
        <div key={i} className="min-h-[1.5rem]">{tokenizeLine(line)}</div>
      ))}
    </div>
  );
};

/* ─── SYNTAX REFERENCE PANEL ─────────────────────────────────────── */
const SyntaxPanel = ({ syntax, accent }: { syntax: string; accent: string }) => {
  if (!syntax) return null;
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: `${accent}30`, background: `${accent}08` }}>
      <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: `${accent}20` }}>
        <Code2 className="w-3 h-3" style={{ color: accent }} />
        <span className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: accent }}>Syntax Reference</span>
      </div>
      <div
        className="p-3 text-xs leading-6 font-mono whitespace-pre text-zinc-300 overflow-x-auto"
        style={{ fontFamily: "'JetBrains Mono','Fira Code',monospace" }}
      >
        {syntax.split('\n').map((line, i) => (
          <div key={i} className="min-h-[1.5rem]">
            {line.trimStart().startsWith('//') || line.trimStart().startsWith('#')
              ? <span style={{ color: '#6b7280', fontStyle: 'italic' }}>{line}</span>
              : line}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── CODE EDITOR (read-only for Next.js — no execution) ─────────── */
const CodeViewer = ({ code, accent }: { code: string; accent: string }) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-white/8 flex-none">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]/60" />
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 rounded px-2 py-1 ml-1">
            <FileCode className="w-3 h-3" style={{ color: accent }} />
            <span className="text-[10px] font-mono text-zinc-400">page.tsx</span>
          </div>
        </div>
        <button
          onClick={copy}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
            copied
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
              : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
          }`}
        >
          {copied ? <><Check className="w-3 h-3" />Copied!</> : <><Copy className="w-3 h-3" />Copy</>}
        </button>
      </div>

      {/* Code body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Line numbers */}
        <div className="flex-none w-9 bg-[#0d1117] border-r border-white/5 pt-4 pb-4 flex flex-col items-end pr-2 overflow-hidden select-none">
          {lines.map((_, i) => (
            <div key={i} className="text-[11px] font-mono text-zinc-600 leading-6 min-h-[1.5rem]">{i + 1}</div>
          ))}
        </div>
        {/* Highlighted code */}
        <div className="flex-1 overflow-auto p-4">
          <HighlightedCode code={code} />
        </div>
      </div>
    </div>
  );
};

/* ─── MAIN COMPONENT ─────────────────────────────────────────────── */
function NextLessonContent() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dir, setDir] = useState(1);

  const slide = slides[current];
  const IconComp = slide.icon;
  const progress = ((current + 1) / slides.length) * 100;

  const goTo = useCallback((idx: number, direction: number) => {
    if (isAnimating) return;
    setDir(direction);
    setIsAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setIsAnimating(false);
    }, 300);
  }, [isAnimating]);

  const next = () => goTo((current + 1) % slides.length, 1);
  const prev = () => goTo((current - 1 + slides.length) % slides.length, -1);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, isAnimating]);

  const variants = {
    enter: (d: number) => ({ x: d * 50, opacity: 0, scale: 0.97 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit:  (d: number) => ({ x: d * -50, opacity: 0, scale: 0.97 }),
  };

  return (
    <div
      className="min-h-screen text-white flex flex-col overflow-hidden"
      style={{ background: '#080c14', fontFamily: "'Inter','DM Sans',system-ui,sans-serif" }}
    >
      {/* Dynamic background glow */}
      <div
        className="fixed inset-0 pointer-events-none transition-all duration-700"
        style={{ background: slide.bg }}
      />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.02) 0%, transparent 70%)' }}
      />

      {/* ── HEADER ── */}
      <header className="relative z-20 flex items-center gap-4 px-6 py-3 border-b border-white/8 bg-black/20 backdrop-blur-xl flex-none">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center border border-white/10 flex-none"
          style={{ background: `${slide.accent}20` }}
        >
          <IconComp className="w-3.5 h-3.5" style={{ color: slide.accent }} />
        </div>
        <div className="flex-none">
          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-600 font-bold">Module 06 · Weeks 11–12</p>
          <p className="text-xs font-black text-white tracking-tight">Next.js 15 Masterclass</p>
        </div>

        {/* Progress bar */}
        <div className="flex-1 mx-6 hidden md:block">
          <div className="h-0.5 bg-white/8 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: slide.accent }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span
            className="text-[9px] font-bold px-2 py-0.5 rounded-full border"
            style={{ color: slide.tagColor, borderColor: `${slide.tagColor}40`, background: `${slide.tagColor}12` }}
          >
            {slide.tag}
          </span>
          <span className="text-xs font-mono text-zinc-600 ml-1">
            {current + 1}<span className="text-zinc-800">/{slides.length}</span>
          </span>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row overflow-hidden">

        {/* LEFT — Lesson content */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={`left-${current}`}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
            className="flex-none lg:w-[400px] xl:w-[440px] flex flex-col justify-between p-6 lg:p-8 lg:border-r border-white/8 overflow-y-auto"
          >
            <div className="space-y-5">
              {/* Slide ID + title */}
              <div className="flex items-start gap-3">
                <div
                  className="text-4xl font-black tabular-nums leading-none flex-none pt-1"
                  style={{ color: `${slide.accent}35`, fontFamily: "'JetBrains Mono',monospace" }}
                >
                  {slide.id}
                </div>
                <div>
                  <h1 className="text-xl xl:text-2xl font-black leading-tight text-white">{slide.title}</h1>
                  <p className="text-sm text-zinc-400 font-medium mt-0.5">{slide.subtitle}</p>
                </div>
              </div>

              {/* Bullets */}
              <div className="space-y-2.5">
                {slide.content.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.05 }}
                    className="flex items-start gap-2.5"
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-1.5 flex-none"
                      style={{ background: slide.accent }}
                    />
                    <p className="text-sm text-zinc-300 leading-relaxed font-medium">{item}</p>
                  </motion.div>
                ))}
              </div>

              {/* Syntax reference */}
              <SyntaxPanel syntax={slide.syntax} accent={slide.accent} />

              {/* Lab callout */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="rounded-xl border p-3.5 flex gap-2.5"
                style={{ background: `${slide.accent}0a`, borderColor: `${slide.accent}28` }}
              >
                <Play className="w-3.5 h-3.5 flex-none mt-0.5" style={{ color: slide.accent }} />
                <div>
                  <p
                    className="text-[9px] font-black uppercase tracking-widest mb-0.5"
                    style={{ color: slide.accent }}
                  >
                    Lab Exercise
                  </p>
                  <p className="text-xs text-zinc-300 leading-relaxed">{slide.lab}</p>
                </div>
              </motion.div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-3 mt-6 lg:mt-0">
              <button
                onClick={prev}
                className="p-2.5 rounded-xl bg-white/5 border border-white/8 hover:bg-white/10 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-xs font-bold hidden sm:inline">Prev</span>
              </button>
              <button
                onClick={next}
                className="flex-1 py-2.5 px-4 rounded-xl font-black text-xs active:scale-95 transition-all flex items-center justify-center gap-2"
                style={{ background: slide.accent, color: '#000' }}
              >
                {current === slides.length - 1 ? 'Restart' : 'Next Lesson'}
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* RIGHT — Code viewer */}
        <div className="flex-1 flex flex-col overflow-hidden p-4 lg:p-5 gap-3">
          <div className="flex items-center justify-between flex-none">
            <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1 border border-white/8">
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest"
                style={{ background: `${slide.accent}25`, color: slide.accent }}
              >
                <FileCode className="w-3 h-3" />
                Implementation
              </div>
            </div>
            <div className="text-[9px] font-mono text-zinc-700 hidden lg:flex items-center gap-1">
              <kbd className="px-1 py-0.5 border border-zinc-800 rounded text-[8px]">←</kbd>
              <kbd className="px-1 py-0.5 border border-zinc-800 rounded text-[8px]">→</kbd>
              navigate
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`code-${current}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-hidden rounded-xl border border-white/8"
            >
              {slide.code ? (
                <CodeViewer code={slide.code} accent={slide.accent} />
              ) : (
                /* Intro slide — decorative visual */
                <div className="w-full h-full flex flex-col items-center justify-center gap-6 bg-[#0d1117]">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
                    className="absolute w-64 h-64 rounded-full"
                    style={{ background: `conic-gradient(from 0deg, ${slide.accent}08, ${slide.accent}20, ${slide.accent}08)`, filter: 'blur(40px)' }}
                  />
                  <div
                    className="relative w-20 h-20 rounded-2xl flex items-center justify-center border border-white/10"
                    style={{ background: `${slide.accent}20` }}
                  >
                    <IconComp className="w-10 h-10" style={{ color: slide.accent }} />
                  </div>
                  <div className="text-center relative">
                    <p className="text-xs font-black uppercase tracking-[0.3em] mb-2" style={{ color: slide.accent }}>Next.js 15</p>
                    <p className="text-3xl font-black text-white">{slide.title}</p>
                    <p className="text-sm text-zinc-500 mt-1">{slide.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-6 relative">
                    {['App Router', 'RSC', 'TypeScript', 'Tailwind'].map((label, i) => (
                      <div key={i} className="text-center">
                        <div className="w-2 h-2 rounded-full mx-auto mb-1" style={{ background: slide.accent }} />
                        <span className="text-[9px] text-zinc-500 uppercase tracking-widest">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ── FOOTER DOTS ── */}
      <footer className="relative z-20 flex justify-center items-center gap-2 py-3 border-t border-white/8 bg-black/20 backdrop-blur-xl flex-none">
        {slides.map((s, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? 1 : -1)}
            title={s.title}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? 24 : 6,
              height: 6,
              background: i === current ? slide.accent : 'rgba(255,255,255,0.12)',
            }}
          />
        ))}
      </footer>
    </div>
  );
}

export default function NextLesson() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#080c14] flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
            <p className="text-zinc-600 text-sm font-mono">Loading Next.js Lab...</p>
          </div>
        </div>
      }
    >
      <NextLessonContent />
    </Suspense>
  );
}