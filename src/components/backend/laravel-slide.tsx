"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ChevronLeft, ChevronRight, Code2, Copy, Check, RotateCcw,
  Terminal, Rocket, Database, Globe, Lock, Shield, Zap, Layers,
  Server, Package, Workflow, FileCode, ArrowRight, BookOpen,
  GitBranch, Star, Trophy, ShoppingCart, Key, Fingerprint,
  List, RefreshCw, Send, Search, Activity, StickyNote, Play,
  Box, HardDrive, Layout, Edit3, Sparkles, Clock, Palette,
} from 'lucide-react';

/* ─── TYPES ──────────────────────────────────────────────────────── */
interface Slide {
  id: string;
  chapter: string;
  title: string;
  subtitle: string;
  accent: string;
  bg: string;
  concepts: { label: string; desc: string }[];
  tip: string;
  lab: string;
  result: string;
  code: string;
  filename: string;
  terminal?: string;
  terminalOutput?: string;
  icon: React.ElementType;
}

/* ─── CHAPTERS ───────────────────────────────────────────────────── */
const CHAPTERS = [
  { id: 'setup',        label: '01 · Intro & Setup',  color: '#f43f5e' },
  { id: 'routing',      label: '02 · Routing & Ctrl',  color: '#f97316' },
  { id: 'blade',        label: '03 · Blade Engine',   color: '#22c55e' },
  { id: 'database',     label: '04 · DB & Eloquent',  color: '#06b6d4' },
  { id: 'forms',        label: '05 · Forms & Vali',   color: '#eab308' },
  { id: 'auth',         label: '06 · Auth & Security', color: '#a855f7' },
  { id: 'crud',         label: '07 · CRUD Ops',       color: '#ec4899' },
  { id: 'advanced',     label: '08 · Advanced',       color: '#3b82f6' },
  { id: 'api',          label: '09 · API & Sanctum',  color: '#10b981' },
  { id: 'frontend',     label: '10 · Frontend',       color: '#fbbf24' },
  { id: 'deploy',       label: '11 · Deployment',     color: '#8b5cf6' },
];

/* ─── SLIDE DATA ─────────────────────────────────────────────────── */
const slides: Slide[] = [
  /* ── CHAPTER 1: SETUP ── */
  {
    id: 'L01-S1', chapter: 'setup',
    title: 'Laravel Ecosystem', subtitle: 'Herd, Sail & Composer',
    accent: '#f43f5e',
    bg: 'radial-gradient(ellipse at 10% 20%, rgba(244,63,94,0.15) 0%, transparent 55%)',
    concepts: [
      { label: 'Laravel Herd', desc: 'The fastest path to Laravel: Zero-config PHP, Nginx, and DNS for macOS.' },
      { label: 'Laravel Sail', desc: 'Docker-based development for Windows/Linux/Mac consistency.' },
      { label: 'Composer', desc: 'PHP Package Manager: The heavy lifter for Laravel dependencies.' },
      { label: 'env Config', desc: 'Centralized settings for database, mail, and app keys.' },
    ],
    tip: 'On Mac? Use Herd. It is 5x faster than Docker for local PHP execution.',
    lab: 'Install Herd or Sail and create your first Laravel project: laravel new my-app.',
    result: 'Fresh Laravel application running on localhost or a .test domain.',
    filename: 'terminal',
    code: `# 1. Install Laravel globally
composer global require laravel/installer

# 2. Spawn a new galaxy
laravel new nebula-project

# 3. Choose your starter kit
# -> None / Breeze / Jetstream`,
    terminal: 'laravel new nebula-project',
    terminalOutput: '   INFO  Galaxy [nebula-project] created successfully.',
    icon: Rocket,
  },
  {
    id: 'L01-S2', chapter: 'setup',
    title: 'Directory Structure', subtitle: 'Where everything lives',
    accent: '#f43f5e',
    bg: 'radial-gradient(ellipse at 80% 30%, rgba(244,63,94,0.12) 0%, transparent 55%)',
    concepts: [
      { label: 'app/', desc: 'Your Models, Controllers, and Middleware logic.' },
      { label: 'routes/', desc: 'The URL map: web.php for views, api.php for endpoints.' },
      { label: 'resources/', desc: 'Frontend assets: Blade, CSS (Tailwind), and JS (Vite).' },
      { label: 'database/', desc: 'Your schema history: Migrations and Seeders.' },
    ],
    tip: 'Focus on app/ and routes/ first. They are the brains of your operations.',
    lab: 'Navigate through the app/ directory and locate where Controllers are stored.',
    result: 'Clear understanding of standard Laravel folder hierarchy.',
    filename: 'folders.md',
    code: `project/
├── app/          ← Business Logic
├── routes/       ← URLs
├── resources/    ← Views & Assets
├── database/     ← Schema
└── config/       ← Settings`,
    icon: HardDrive,
  },

  /* ── CHAPTER 2: ROUTING & CONTROLLERS ── */
  {
    id: 'L02-S1', chapter: 'routing',
    title: 'Route Engine', subtitle: 'Binding URLs to Logic',
    accent: '#f97316',
    bg: 'radial-gradient(ellipse at 30% 50%, rgba(249,115,22,0.15) 0%, transparent 60%)',
    concepts: [
      { label: 'Static Routes', desc: 'Direct URL to view or callback (e.g. /about).' },
      { label: 'Route Params', desc: 'Dynamic segments: /user/{id}.' },
      { label: 'Named Routes', desc: 'Use route("home") instead of hardcoding "/".' },
      { label: 'Grouping', desc: 'Apply middleware or prefixes to multiple routes at once.' },
    ],
    tip: 'Always name your routes. If you change a URL later, your links won’t break!',
    lab: 'Add a route that returns your name as a JSON string.',
    result: 'Route responds correctly in the browser.',
    filename: 'routes/web.php',
    code: `<?php

use Illuminate\\Support\\Facades\\Route;

Route::get('/', function () {
    return view('welcome');
});

// Dynamic parameter route
Route::get('/user/{id}', function ($id) {
    return "User Profile ID: " . $id;
})->name('user.profile');`,
    icon: Globe,
  },
  {
    id: 'L02-S2', chapter: 'routing',
    title: 'Controllers', subtitle: 'Keep Routes Clean',
    accent: '#f97316',
    bg: 'radial-gradient(ellipse at 70% 40%, rgba(249,115,22,0.12) 0%, transparent 55%)',
    concepts: [
      { label: 'make:controller', desc: 'Artisan command to scaffold a new controller.' },
      { label: 'Action Methods', desc: 'Functions inside a class (index, show, store).' },
      { label: 'Type Hinting', desc: 'Laravel automatically injects dependencies into methods.' },
      { label: 'Requests', desc: 'Capture query params and form data via the Request object.' },
    ],
    tip: 'Routes should only delegate. Keep your real "Work" inside Controllers.',
    lab: 'Create a UserController using Artisan and move your profile logic there.',
    result: 'Clean web.php forwarding to UserController@show.',
    filename: 'app/Http/Controllers/UserController.php',
    code: `<?php

namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;

class UserController extends Controller
{
    public function show($id)
    {
        return view('user.show', ['userId' => $id]);
    }
}`,
    terminal: 'php artisan make:controller UserController',
    terminalOutput: '   INFO  Controller [app/Http/Controllers/UserController.php] created successfully.',
    icon: Server,
  },

  /* ── CHAPTER 3: BLADE TEMPLATING ── */
  {
    id: 'L03-S1', chapter: 'blade',
    title: 'Blade Basics', subtitle: 'Elegant PHP Views',
    accent: '#22c55e',
    bg: 'radial-gradient(ellipse at 20% 60%, rgba(34,197,94,0.15) 0%, transparent 55%)',
    concepts: [
      { label: 'Echoing', desc: 'Use {{ $variable }} to print escaped data safely.' },
      { label: 'Directives', desc: '@if, @foreach, @empty - elegant loops and logic.' },
      { label: 'Shortcuts', desc: '@auth / @guest for conditional authentication UI.' },
      { label: 'CSRF', desc: '@csrf generates a hidden token for form security.' },
    ],
    tip: 'Laravel escapes all {{ }} content by default. Use {!! !!} only for trusted HTML.',
    lab: 'Display a list of tasks using an @foreach loop in a Blade view.',
    result: 'Dynamic list rendered cleanly with Blade logic.',
    filename: 'resources/views/tasks.blade.php',
    code: `<h1>My Tasks</h1>

<ul>
    @foreach ($tasks as $task)
        <li>{{ $task->name }}</li>
    @empty
        <li>No tasks available.</li>
    @endforeach
</ul>`,
    icon: Layout,
  },
  {
    id: 'L03-S2', chapter: 'blade',
    title: 'Components & Layouts', subtitle: 'Template Inheritance',
    accent: '#22c55e',
    bg: 'radial-gradient(ellipse at 80% 20%, rgba(34,197,94,0.12) 0%, transparent 55%)',
    concepts: [
      { label: '@extends', desc: 'Child views inherit a master "app" layout.' },
      { label: '@section', desc: 'Inject specific content into the layout slots.' },
      { label: 'x-components', desc: 'Newer tag-based components: <x-alert type="error" />.' },
      { label: 'Props', desc: 'Passing data/variables down into smaller UI component pieces.' },
    ],
    tip: 'Components are better for UI logic (buttons, inputs), whereas Sections are better for Page structure.',
    lab: 'Create a reusable <x-card> component for consistent styling.',
    result: 'Multiple cards rendered using a single component file.',
    filename: 'resources/views/components/card.blade.php',
    code: `<div className="border p-4 rounded-lg shadow">
    <h2 className="font-bold border-b mb-2">{{ $title }}</h2>
    {{ $slot }}
</div>

<!-- Usage -->
<x-card title="Profile Info">
    User Name: {{ $user->name }}
</x-card>`,
    icon: Box,
  },

  /* ── CHAPTER 4: DATABASE & ELOQUENT ── */
  {
    id: 'L04-S1', chapter: 'database',
    title: 'Migrations & Schema', subtitle: 'Database as Code',
    accent: '#06b6d4',
    bg: 'radial-gradient(ellipse at 15% 45%, rgba(6,182,212,0.15) 0%, transparent 55%)',
    concepts: [
      { label: 'Migrations', desc: 'Blueprint files that create or modify database tables.' },
      { label: 'Schema Builder', desc: 'Fluent API: $table->string("name") etc.' },
      { label: 'Artisan migrate', desc: 'Syncs your local PHP blueprints with your database.' },
      { label: 'Seeders', desc: 'Populate your database with sample/mock test data.' },
    ],
    tip: 'Never edit tables manually in PHPMyAdmin. Always use Migrations for teamwork sync.',
    lab: 'Add a "bio" column to your users table via a fresh migration.',
    result: 'Bio column appears safely in the database.',
    filename: 'database/migrations/xxx_create_posts_table.php',
    code: `public function up(): void {
    Schema::create('posts', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->text('body');
        $table->timestamps();
    });
}`,
    terminal: 'php artisan migrate',
    terminalOutput: '   INFO  Preparing database.\n   INFO  Running migrations.\n   DONE  success.',
    icon: Database,
  },
  {
    id: 'L04-S2', chapter: 'database',
    title: 'Eloquent Models', subtitle: 'The Active Record Power',
    accent: '#06b6d4',
    bg: 'radial-gradient(ellipse at 85% 55%, rgba(6,182,212,0.12) 0%, transparent 55%)',
    concepts: [
      { label: 'Models', desc: 'Classes that represent a single DB table (Post -> posts).' },
      { label: 'CRUD made easy', desc: 'Post::all(), Post::find(1), Post::create([...]).' },
      { label: 'Fillable', desc: 'Protection against mass-assignment security vulnerabilities.' },
      { label: 'Relationships', desc: 'hasOne, hasMany, belongsTo - connecting data logic.' },
    ],
    tip: 'Eloquent is magic. Use it for 95% of queries instead of raw SQL queries.',
    lab: 'Establish a "Post belongsTo User" relationship in your model.',
    result: 'Accessing $post->user returns the related user object automatically.',
    filename: 'app/Models/User.php',
    code: `class User extends Model {
    // A User has many Posts
    public function posts() {
        return $this->hasMany(Post::class);
    }
}

// Usage:
$user = User.find(1);
foreach ($user->posts as $post) {
    echo $post->title;
}`,
    icon: Layers,
  },

  /* ── CHAPTER 5: FORMS & VALIDATION ── */
  {
    id: 'L05-S1', chapter: 'forms',
    title: 'Forms & CSRF', subtitle: 'Secure Submissions',
    accent: '#eab308',
    bg: 'radial-gradient(ellipse at 50% 10%, rgba(234,179,8,0.15) 0%, transparent 55%)',
    concepts: [
      { label: 'Route Handlers', desc: 'POST/PUT/DELETE routes for destructive actions.' },
      { label: 'CSRF Token', desc: 'Essential @csrf directive to block malicious cross-site requests.' },
      { label: 'Hiddens', desc: '@method("PUT") to spoof HTTP methods for HTML and forms.' },
      { label: 'Old Input', desc: 'old("name") helper to keep data in inputs after a fail.' },
    ],
    tip: 'Always use @csrf. Without it, Laravel throws a 419 Page Expired error for security.',
    lab: 'Create a simple form but forget the CSRF token. Watch it fail, then fix it.',
    result: 'Clear understanding of session-based form security.',
    filename: 'create.blade.php',
    code: `<form action="/posts" method="POST">
    @csrf
    @method('PATCH')
    <input type="text" name="title" value="{{ old('title') }}">
    <button type="submit">Update</button>
</form>`,
    icon: Edit3,
  },
  {
    id: 'L05-S2', chapter: 'forms',
    title: 'Validation Logic', subtitle: 'Zero Trust Backend',
    accent: '#eab308',
    bg: 'radial-gradient(ellipse at 50% 90%, rgba(234,179,8,0.12) 0%, transparent 55%)',
    concepts: [
      { label: '$request->validate()', desc: 'Declarative rules (required, min:5, unique:users).' },
      { label: 'Errors', desc: '@error("title") helper for showing specific inline failures.' },
      { label: 'Form Requests', desc: 'Move complex validation into their own dedicated classes.' },
      { label: 'Custom Messages', desc: 'Personalize the verification feedback for your users.' },
    ],
    tip: 'Never trust user input. If it is NOT validated, don’t save it to the database.',
    lab: 'Validate a registration form: email must be unique and password must be 8+ chars.',
    result: 'Form redirects automatically with errors if data is invalid.',
    filename: 'PostController.php',
    code: `public function store(Request $request) {
    $validated = $request->validate([
        'title' => 'required|max:255',
        'body'  => 'required|min:10',
    ]);

    Post::create($validated);
}`,
    icon: Search,
  },

  /* ── CHAPTER 6: AUTHENTICATION & SECURITY ── */
  {
    id: 'L06-S1', chapter: 'auth',
    title: 'Breeze & Sanctum', subtitle: 'Auth Out of the Box',
    accent: '#a855f7',
    bg: 'radial-gradient(ellipse at 0% 0%, rgba(168,85,247,0.15) 0%, transparent 55%)',
    concepts: [
      { label: 'Laravel Breeze', desc: 'Simple, minimal starter kit with registration and login.' },
      { label: 'Auth Middleware', desc: 'Lock routes easily using ->middleware("auth").' },
      { label: 'Hashing', desc: 'Laravel automatically uses Bcrypt for passwords - never plain text.' },
      { label: 'Sessions', desc: 'Default state management for logged-in web users.' },
    ],
    tip: 'Don’t build auth from scratch. Laravel Breeze gives you a professional system in 10 seconds.',
    lab: 'Install Breeze and inspect the LoginController logic.',
    result: 'Fully functioning user auth system ready for production.',
    terminal: 'composer require laravel/breeze --dev && php artisan breeze:install',
    icon: Lock,
    filename: 'terminal',
    code: `# Install the starter kit
composer require laravel/breeze --dev

# Run the installer
php artisan breeze:install blade

# Migrate the database
php artisan migrate`,
  },
  {
    id: 'L06-S2', chapter: 'auth',
    title: 'Middlewares & Gates', subtitle: 'Access Control',
    accent: '#a855f7',
    bg: 'radial-gradient(ellipse at 100% 100%, rgba(168,85,247,0.12) 0%, transparent 55%)',
    concepts: [
      { label: 'Middleware', desc: 'Filters that run before or after the request (e.g. EnsureUserIsAdmin).' },
      { label: 'Gates', desc: 'Closure-based authorization for simple true/false permissions.' },
      { label: 'Policies', desc: 'Full classes for managing complex model-based ownership logic.' },
      { label: 'can()', desc: 'Blade directive and PHP check: if ($user->can("edit", $post)).' },
    ],
    tip: 'Authentication checks WHO you are. Authorization checks WHAT you can do.',
    lab: 'Create a "Gate" that only allows post owners to edit their own posts.',
    result: 'Unauthorized users see a 403 Forbidden screen when attempting to edit.',
    filename: 'UserPolicy.php',
    code: `public function update(User $user, Post $post) {
    return $user->id === $post->user_id;
}

// In Blade:
@can('update', $post)
    <button>Edit Post</button>
@endcan`,
    icon: Shield,
  },

  /* ── CHAPTER 7: CRUD OPERATIONS ── */
  {
    id: 'L07-S1', chapter: 'crud',
    title: 'Resourceful CRUD', subtitle: 'The Standard Cycle',
    accent: '#ec4899',
    bg: 'radial-gradient(ellipse at 50% 50%, rgba(236,72,153,0.15) 0%, transparent 55%)',
    concepts: [
      { label: 'Index', desc: 'List all resources (e.g. List all Blog Posts).' },
      { label: 'Show', desc: 'Display a single item (e.g. View Post #5).' },
      { label: 'Create/Store', desc: 'Handle the "New Item" form and DB storage.' },
      { label: 'Update/Delete', desc: 'Managing changes and removal of data safely.' },
    ],
    tip: 'Use resource controllers. "php artisan make:controller PostController --resource" generates everything.',
    lab: 'Build a full Post CRUD: Create, Page, List, and Delete functionality.',
    result: 'Application can manage data effectively from the UI.',
    filename: 'routes/web.php',
    code: `// One line for 7 routes!
Route::resource('posts', PostController::class);`,
    icon: Zap,
  },

  /* ── CHAPTER 8: ADVANCED FEATURES ── */
  {
    id: 'L08-S1', chapter: 'advanced',
    title: 'Storage & Caching', subtitle: 'Performance & Assets',
    accent: '#3b82f6',
    bg: 'radial-gradient(ellipse at 30% 20%, rgba(59,130,246,0.15) 0%, transparent 55%)',
    concepts: [
      { label: 'FileSystem', desc: 'Manage uploads with Local, S3, or R2 drivers effortlessly.' },
      { label: 'Sessions', desc: 'Store temporary data across requests like flash messages.' },
      { label: 'Caching', desc: 'Store expensive queries in Redis/Memcached for 100x speed.' },
      { label: 'Queues', desc: 'Dispatch slow tasks (emails, resize) to run in the background.' },
    ],
    tip: 'Never store images directly in the public/ folder. Upload them to storage/ and link them.',
    lab: 'Store an uploaded avatar in the "public" disk and display it.',
    result: 'File successfully persisted and publicly accessible.',
    filename: 'UploadController.php',
    code: `$path = $request->file('avatar')->store('avatars', 'public');
$user->update(['avatar' => $path]);`,
    icon: Clock,
  },

  /* ── CHAPTER 9: API DEVELOPMENT ── */
  {
    id: 'L09-S1', chapter: 'api',
    title: 'JSON & Sanctum', subtitle: 'Laravel for Mobile/JS Apps',
    accent: '#10b981',
    bg: 'radial-gradient(ellipse at 70% 80%, rgba(16,185,129,0.12) 0%, transparent 55%)',
    concepts: [
      { label: 'API Resources', desc: 'Transform models into polished JSON objects.' },
      { label: 'Sanctum Tokens', desc: 'Issue Bearer tokens for mobile app authentication.' },
      { label: 'Status Codes', desc: 'Using correct HTTP codes (201 Created, 204 No Content).' },
      { label: 'Versioning', desc: 'Prefixing routes with /api/v1/ to prevent regression.' },
    ],
    tip: 'Always return JSON Resources. They clean up your data logic and prevent leaking DB passwords.',
    lab: 'Build an endpoint that returns all users in a simplified JSON format.',
    result: 'Professional API response structure.',
    filename: 'UserResource.php',
    code: `public function toArray($request) {
    return [
        'id' => $this->id,
        'username' => $this->name,
        'member_since' => $this->created_at->format('Y-m-d')
    ];
}`,
    icon: RefreshCw,
  },

  /* ── CHAPTER 10: FRONTEND INTEGRATION ── */
  {
    id: 'L10-S1', chapter: 'frontend',
    title: 'Vite & Tailwind', subtitle: 'The Modern Frontend Stack',
    accent: '#fbbf24',
    bg: 'radial-gradient(ellipse at 10% 90%, rgba(251,191,36,0.15) 0%, transparent 55%)',
    concepts: [
      { label: 'Vite', desc: 'The lightning-fast frontend build tool for Laravel.' },
      { label: 'Tailwind CSS', desc: 'Utility-first CSS: Style your app without leaving HTML.' },
      { label: 'Asset Bundling', desc: 'Compiling SCSS/JS/React into production-ready files.' },
      { label: 'HMR', desc: 'Hot Module Replacement: Instant updates as you save files.' },
    ],
    tip: 'Use @vite(["resources/css/app.css"]) in your master layout to boot up your styles.',
    lab: 'Install Tailwind and change the background color of your app.',
    result: 'Modern styles applied and auto-refreshed via Vite.',
    filename: 'vite.config.js',
    code: `export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
    ],
});`,
    icon: Sparkles,
  },

  /* ── CHAPTER 11: DEPLOYMENT ── */
  {
    id: 'L11-S1', chapter: 'deploy',
    title: 'Go Live', subtitle: 'Cloud & Forge',
    accent: '#8b5cf6',
    bg: 'radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.15) 0%, transparent 55%)',
    concepts: [
      { label: 'Laravel Forge', desc: 'Easiest way to provision servers on AWS/Digital Ocean.' },
      { label: 'Laravel Cloud', desc: 'Serverless deployment directly from GitHub commits.' },
      { label: 'Optimization', desc: 'php artisan config:cache, route:cache for production speed.' },
      { label: 'CI/CD', desc: 'Automatically run tests before every production push.' },
    ],
    tip: 'NEVER run migrate:fresh in production. It deletes ALL your live data!',
    lab: 'Run the production optimization commands and check the performance gain.',
    result: 'Site optimized and safe for global traffic.',
    terminal: 'php artisan optimize',
    terminalOutput: '   INFO  Caching configuration.\n   INFO  Caching routes.\n   DONE  Optimization complete.',
    icon: Rocket,
    filename: 'terminal',
    code: `# 1. Optimize configuration
php artisan config:cache

# 2. Optimize routes
php artisan route:cache

# 3. Optimize views
php artisan view:cache`,
  },
];

/* ─── SYNTAX HIGHLIGHTER ─────────────────────────────────────────── */
const PHP_KW = new Set([
  'php','echo','return','if','else','elseif','foreach','for','while',
  'class','extends','implements','namespace','use','new','public',
  'protected','private','static','function','fn','array','string',
  'int','float','bool','void','null','true','false','require',
  'include','throw','try','catch','match','readonly','const',
]);

const HighlightedCode = ({ code }: { code: string }) => {
  const tokenize = (line: string): React.ReactNode => {
    if (/^\s*(\/\/|#|\/\*|\*)/.test(line))
      return <span style={{ color: '#6b7280', fontStyle: 'italic' }}>{line}</span>;
    if (/^\s*{{--/.test(line))
      return <span style={{ color: '#6b7280', fontStyle: 'italic' }}>{line}</span>;

    const parts = line.split(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|$[a-zA-Z_]\w*|\b\d+(?:\.\d+)?\b|\b[a-zA-Z_]\w*\b)/g);
    return parts.map((p, i) => {
      if (!p) return null;
      if (p.startsWith('$')) return <span key={i} style={{ color: '#fbbf24' }}>{p}</span>;
      if (PHP_KW.has(p)) return <span key={i} style={{ color: '#f87171', fontWeight: 700 }}>{p}</span>;
      if (p.startsWith('"') || p.startsWith("'")) return <span key={i} style={{ color: '#86efac' }}>{p}</span>;
      if (/^\d/.test(p)) return <span key={i} style={{ color: '#c084fc' }}>{p}</span>;
      if (/^[A-Z]/.test(p)) return <span key={i} style={{ color: '#fbbf24' }}>{p}</span>;
      return <span key={i} style={{ color: '#e2e8f0' }}>{p}</span>;
    });
  };

  return (
    <div className="font-mono text-sm leading-6 whitespace-pre"
      style={{ fontFamily: "'JetBrains Mono','Fira Code',monospace" }}>
      {code.split('\n').map((line, i) => (
        <div key={i} className="min-h-[1.5rem]">{tokenize(line)}</div>
      ))}
    </div>
  );
};

/* ─── CODE PANEL ─────────────────────────────────────────────────── */
const CodePanel = ({
  code: initialCode, terminal, terminalOutput: initialOutput, accent, filename,
}: {
  code: string; terminal?: string; terminalOutput?: string; accent: string; filename: string;
}) => {
  const [tab, setTab] = useState<'code' | 'terminal'>('code');
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState(initialOutput);
  const [copied, setCopied] = useState(false);
  const [running, setRunning] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const hlRef = useRef<HTMLDivElement>(null);
  const lines = code.split('\n');

  useEffect(() => { setCode(initialCode); setOutput(initialOutput); }, [initialCode, initialOutput]);

  const copy = () => {
    navigator.clipboard.writeText(tab === 'code' ? code : (output || ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const syncScroll = () => {
    if (taRef.current && hlRef.current) {
      hlRef.current.scrollTop = taRef.current.scrollTop;
      hlRef.current.scrollLeft = taRef.current.scrollLeft;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#07090f] rounded-2xl overflow-hidden border border-white/8">
      {/* Tab bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0d1117] border-b border-white/5 flex-none">
        <div className="flex items-center gap-1 p-1 bg-black/40 rounded-xl border border-white/5">
          {(['code', 'terminal'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                tab === t ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}>
              {t === 'code' ? <Code2 className="w-3 h-3" /> : <Terminal className="w-3 h-3" />}
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={async () => {
            setTab('terminal');
            setRunning(true);
            await new Promise(r => setTimeout(r, 800));
            setRunning(false);
          }}
            disabled={running}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              running ? 'bg-zinc-800 text-zinc-500' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
            }`}>
            <Play className={`w-3 h-3 ${running ? 'animate-pulse' : ''}`} />
            {running ? 'Running...' : 'Run'}
          </button>
          <button onClick={() => { setCode(initialCode); setOutput(initialOutput); }}
            className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-white/5 transition-all">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button onClick={copy}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${
              copied ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
            }`}>
            {copied ? <><Check className="w-3 h-3" />Copied</> : <><Copy className="w-3 h-3" />Copy</>}
          </button>
        </div>
      </div>

      {/* File bar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-[#0d1117]/60 border-b border-white/5 flex-none">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/40" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]/40" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]/40" />
        </div>
        <div className="flex items-center gap-2 bg-white/5 rounded-lg px-2.5 py-1">
          <FileCode className="w-3 h-3" style={{ color: accent }} />
          <span className="text-[10px] font-mono text-zinc-400">
            {tab === 'code' ? filename : 'bash — terminal'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative overflow-hidden">
        {tab === 'code' ? (
          <div className="flex h-full overflow-hidden">
            <div className="flex-none w-10 bg-[#07090f] border-r border-white/5 pt-4 flex flex-col items-end pr-3 select-none overflow-hidden">
              {lines.map((_, i) => (
                <div key={i} className="text-[11px] font-mono text-zinc-700 leading-6 min-h-[1.5rem]">{i + 1}</div>
              ))}
            </div>
            <div className="relative flex-1 overflow-hidden">
              <div ref={hlRef} className="absolute inset-0 overflow-auto p-4 pointer-events-none" style={{ scrollbarWidth: 'none' }}>
                <HighlightedCode code={code} />
              </div>
              <textarea ref={taRef} value={code} onChange={e => setCode(e.target.value)} onScroll={syncScroll}
                className="absolute inset-0 w-full h-full bg-transparent text-transparent resize-none outline-none p-4 font-mono text-sm leading-6 border-none overflow-auto selection:bg-purple-500/25"
                style={{ fontFamily: "'JetBrains Mono',monospace", whiteSpace: 'pre', overflowWrap: 'normal' }}
                spellCheck={false} wrap="off" />
            </div>
          </div>
        ) : (
          <div className="p-6 font-mono text-sm leading-relaxed overflow-auto h-full">
            <div className="flex gap-2 text-zinc-500 mb-3">
              <span style={{ color: accent }}>➜</span>
              <span className="text-blue-400">~/laravel-app</span>
              <span className="text-zinc-600 font-bold">$</span>
              <span className="text-zinc-200">{terminal || 'php artisan serve'}</span>
            </div>
            {output
              ? <pre className="text-zinc-200 whitespace-pre-wrap">{output}</pre>
              : <div className="text-zinc-600 animate-pulse">No output yet.</div>
            }
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── MAIN COMPONENT ─────────────────────────────────────────────── */
export default function LaravelSlide() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chapterParam = searchParams.get('chapter') || 'setup';

  // ISOLATE SLIDES: Only show slides for the active chapter (2-5 slides)
  const activeSlides = slides.filter(s => s.chapter === chapterParam);
  const displaySlides = activeSlides.length > 0 ? activeSlides : slides.filter(s => s.chapter === 'setup');

  const slideParam = searchParams.get('slide');
  const initialSlide = slideParam ? Math.max(0, Math.min(parseInt(slideParam) - 1, displaySlides.length - 1)) : 0;

  const [current, setCurrent] = useState(initialSlide);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dir, setDir] = useState(1);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const slide = displaySlides[current];
  const Icon = slide.icon;
  const progress = ((current + 1) / displaySlides.length) * 100;
  const chapterInfo = CHAPTERS.find(c => c.id === slide.chapter)!;

  useEffect(() => {
    const saved = localStorage.getItem('laravel_slide_notes');
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  const saveNote = (val: string) => {
    const next = { ...notes, [slide.id]: val };
    setNotes(next);
    localStorage.setItem('laravel_slide_notes', JSON.stringify(next));
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('slide', (current + 1).toString());
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [current]);

  const goTo = useCallback((idx: number, d: number) => {
    if (isAnimating) return;
    setDir(d);
    setIsAnimating(true);
    setTimeout(() => { setCurrent(idx); setIsAnimating(false); }, 280);
  }, [isAnimating]);

  const next = () => goTo((current + 1) % displaySlides.length, 1);
  const prev = () => goTo((current - 1 + displaySlides.length) % displaySlides.length, -1);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Don't navigate if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, isAnimating]); // Keep deps to ensure functions use closure-latest state or depend on functions

  const variants = {
    enter: (d: number) => ({ y: d * 30, opacity: 0, scale: 0.98 }),
    center: { y: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ y: d * -30, opacity: 0, scale: 0.98 }),
  };

  return (
    <div className="min-h-screen text-white flex flex-col overflow-hidden"
      style={{ background: '#07090f', fontFamily: "'Inter','DM Sans',system-ui,sans-serif" }}>

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none transition-all duration-700" style={{ background: slide.bg }} />
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(168,85,247,0.04) 0%, transparent 60%)' }} />

      {/* ── CHAPTER NAV BAR ── */}
      <div className="relative z-20 flex items-center gap-1 px-6 py-3 border-b border-white/5 bg-black/30 backdrop-blur-xl overflow-x-auto mt-16 lg:mt-0">
        {CHAPTERS.map((ch, i) => {
          const isActive = ch.id === (activeSlides.length > 0 ? chapterParam : 'setup');
          return (
            <button key={ch.id} onClick={() => router.push(`?chapter=${ch.id}`)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                isActive
                  ? 'text-black border-transparent'
                  : 'bg-transparent border-white/8 text-zinc-500 hover:text-zinc-300 hover:border-white/20'
              }`}
              style={isActive ? { background: ch.color, borderColor: ch.color } : {}}>
              {ch.label}
            </button>
          );
        })}
        <div className="ml-auto flex items-center gap-3 flex-none pl-4">
          <div className="w-32 h-0.5 bg-white/8 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: chapterInfo.color }} />
          </div>
          <span className="text-[10px] font-mono text-zinc-600">
            {current + 1}<span className="text-zinc-800">/{displaySlides.length}</span>
          </span>
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row overflow-hidden">

        {/* LEFT — Concept cards */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={`left-${current}`} custom={dir} variants={variants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="flex-none lg:w-[45%] flex flex-col p-6 lg:p-10 xl:p-14 lg:border-r border-white/6 overflow-y-auto gap-6">

            {/* Title block */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-none border border-white/10"
                style={{ background: `${slide.accent}18` }}>
                <Icon className="w-6 h-6" style={{ color: slide.accent }} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] px-2 py-0.5 rounded-full border"
                    style={{ color: chapterInfo.color, borderColor: `${chapterInfo.color}40`, background: `${chapterInfo.color}12` }}>
                    {chapterInfo.label}
                  </span>
                  <span className="text-[9px] font-mono text-zinc-700">{slide.id}</span>
                </div>
                <h1 className="text-3xl xl:text-4xl font-black leading-tight text-white tracking-tighter">
                  {slide.title}
                </h1>
                <p className="text-sm text-white/40 font-bold uppercase tracking-widest mt-1">{slide.subtitle}</p>
              </div>
            </div>

            {/* Concept cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {slide.concepts.map((c, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 + i * 0.06 }}
                  className="rounded-xl border p-4 flex flex-col gap-1.5"
                  style={{ borderColor: `${slide.accent}20`, background: `${slide.accent}06` }}>
                  <span className="text-xs font-black uppercase tracking-widest" style={{ color: slide.accent }}>
                    {c.label}
                  </span>
                  <p className="text-sm text-zinc-300 leading-relaxed">{c.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Pro tip */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
              className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-4 flex gap-3">
              <Sparkles className="w-4 h-4 text-amber-400 flex-none mt-0.5" />
              <p className="text-sm text-amber-200/80 leading-relaxed"><span className="font-black text-amber-400">Pro tip: </span>{slide.tip}</p>
            </motion.div>

            {/* Lab + Result */}
            <div className="space-y-3">
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}
                className="rounded-xl border p-4 flex gap-3"
                style={{ background: `${slide.accent}08`, borderColor: `${slide.accent}25` }}>
                <Play className="w-4 h-4 flex-none mt-0.5" style={{ color: slide.accent }} />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1.5" style={{ color: slide.accent }}>Lab Exercise</p>
                  <p className="text-sm text-white font-semibold leading-relaxed">{slide.lab}</p>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-4 flex gap-3">
                <Check className="w-4 h-4 flex-none mt-0.5 text-emerald-400" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1.5 text-emerald-400">Expected Result</p>
                  <p className="text-sm text-white font-semibold leading-relaxed">{slide.result}</p>
                </div>
              </motion.div>
            </div>

            {/* Nav buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button onClick={prev}
                className="p-3 rounded-xl bg-white/5 border border-white/8 hover:bg-white/10 active:scale-95 transition-all flex items-center gap-2 group">
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-xs font-bold hidden sm:inline text-zinc-400">Prev</span>
              </button>
              <button onClick={next}
                className="flex-1 py-3 px-5 rounded-xl font-black text-xs active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg"
                style={{ background: slide.accent, color: '#000' }}>
                {current === displaySlides.length - 1 ? 'Restart' : 'Next'}
                <ChevronRight className="w-4 h-4" />
              </button>
              <button onClick={() => setShowNotes(!showNotes)}
                className={`p-3 rounded-xl border transition-all ${
                  showNotes ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-white/5 border-white/8 text-zinc-500 hover:text-white'
                }`}>
                <StickyNote className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* RIGHT — Code panel */}
        <div className="flex-none lg:w-[55%] flex flex-col p-4 lg:p-8 xl:p-10 gap-4 overflow-hidden">
          <div className="flex items-center gap-2 flex-none">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/8 bg-white/5"
              style={{ color: slide.accent }}>
              <Terminal className="w-3.5 h-3.5" />
              Interactive Editor
            </div>
            <div className="ml-auto text-[10px] font-mono text-zinc-700 hidden sm:block">
              ← → arrow keys to navigate
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={`code-${current}`}
              initial={{ opacity: 0, scale: 0.99, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.99, y: -8 }}
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              className="flex-1 overflow-hidden">
              <CodePanel
                code={slide.code}
                terminal={slide.terminal}
                terminalOutput={slide.terminalOutput}
                accent={slide.accent}
                filename={slide.filename}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ── NOTES PANEL ── */}
      <AnimatePresence>
        {showNotes && (
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed inset-y-0 right-0 w-80 bg-[#12151e] border-l border-white/8 z-[100] shadow-2xl p-6 flex flex-col pt-24">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-amber-400">Notes</h3>
                <p className="text-[10px] text-zinc-600 font-bold uppercase mt-0.5">{slide.id} · {slide.title}</p>
              </div>
              <button onClick={() => setShowNotes(false)} className="text-zinc-600 hover:text-white transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <textarea autoFocus
              value={notes[slide.id] || ''}
              onChange={e => saveNote(e.target.value)}
              placeholder="Your notes here... (auto-saves)"
              className="flex-1 w-full bg-black/40 rounded-xl p-4 text-sm text-zinc-300 resize-none outline-none border border-white/5 focus:border-amber-500/30 transition-all placeholder:text-zinc-700 font-mono"
            />
            <p className="mt-4 text-[10px] text-zinc-700 font-bold uppercase leading-relaxed">
              Saved per slide in localStorage
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
