"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft, ChevronRight, Code2, Copy, Check, RotateCcw,
  Terminal, Rocket, Database, Globe, Lock, Shield, Zap, Layers,
  Server, Package, Workflow, FileCode, ArrowRight, BookOpen,
  GitBranch, Star, Trophy, ShoppingCart, Key, Fingerprint,
  List, RefreshCw, Send, Search, Activity, StickyNote, Play,
  Box, HardDrive, Layout, Edit3, Sparkles, Clock, Palette,
  Menu, X, ChevronDown, ArrowLeft, CheckCircle2
} from 'lucide-react';

/* ─── TYPES ──────────────────────────────────────────────────────── */
interface Slide {
  id: string;
  chapter: string;
  section?: string;
  title: string;
  subtitle: string;
  accent: string;
  bg: string;
  concepts: { label: string; desc: string }[];
  variables?: { label: string; desc: string }[];
  tip: string;
  lab: string;
  result: string;
  code: string;
  filename: string;
  terminal?: string;
  terminalOutput?: string;
  icon: React.ElementType;
}

type DisplayPage = Slide & { subType: 'concept' | 'variables' | 'lab' };

/* ─── CHAPTERS ───────────────────────────────────────────────────── */
const CHAPTERS = [
  { id: 'setup',         label: '01 · Setting Up Laravel',                    color: '#f43f5e' },
  { id: 'mvc',           label: '02 · Understanding the MVC Pattern',          color: '#f97316' },
  { id: 'routing',       label: '03 · Routes and Controllers',                 color: '#eab308' },
  { id: 'resources',     label: '04 · Resources and Controllers',              color: '#22c55e' },
  { id: 'middleware',    label: '05 · Middleware in Laravel',                  color: '#06b6d4' },
  { id: 'security',      label: '06 · Security and Protection',                color: '#a855f7' },
  { id: 'restapi',       label: '07 · Understanding REST APIs',                color: '#ec4899' },
  { id: 'database',      label: '08 · Database Overview',                      color: '#3b82f6' },
  { id: 'migrations',    label: '09 · Laravel Migrations',                     color: '#10b981' },
  { id: 'rawsql',        label: '10 · Working with Raw SQL Queries',           color: '#fb923c' },
  { id: 'eloquent',      label: '11 · Database with Eloquent ORM',             color: '#8b5cf6' },
  { id: 'tinker',        label: '12 · Using Laravel Tinker',                   color: '#f59e0b' },
  { id: 'relationships', label: '13 · Eloquent Relationships',                 color: '#ef4444' },
  { id: 'onetone',       label: '14 · Eloquent One-to-One',                    color: '#14b8a6' },
  { id: 'onetomany',     label: '15 · Eloquent One-to-Many',                   color: '#6366f1' },
  { id: 'manytomany',    label: '16 · Eloquent Many-to-Many',                  color: '#f43f5e' },
  { id: 'fileupload',    label: '17 · Uploading Files in Laravel',             color: '#84cc16' },
  { id: 'crud',          label: '18 · Building CRUD Operations',               color: '#f97316' },
  { id: 'postman',       label: '19 · API Requests with Postman',              color: '#06b6d4' },
  { id: 'auth',          label: '20 · Authentication: Passport or JWT',        color: '#a855f7' },
];

/* ─── SLIDES DATA ────────────────────────────────────────────────── */
const slides: Slide[] = [

  /* ── CH 01: SETTING UP LARAVEL ── */
  {
    id: 'L01-S1', chapter: 'setup',
    section: '1. CLI & Server',
    title: 'Setting Up Laravel', subtitle: 'ការដំឡើងគម្រោង Web Application',
    accent: '#f43f5e',
    bg: 'radial-gradient(ellipse at 10% 20%, rgba(244,63,94,0.15) 0%, transparent 55%)',
    concepts: [
      { label: 'Composer', desc: 'PHP Package Manager ─ ប្រើដំឡើង Laravel និង third-party libraries ទាំងអស់សម្រាប់ web app។' },
      { label: 'Laravel Installer', desc: '"composer global require laravel/installer" ─ បន្ទាប់ប្រើ "laravel new" command ។' },
      { label: 'php artisan serve', desc: 'Built-in dev server ─ run web app លើ http://127.0.0.1:8000 ដោយមិនចាំបាច់ Apache/Nginx ។' },
      { label: 'Project Folder', desc: 'app/, routes/, resources/views/, database/, public/ ─ រចនាសម្ព័ន្ធស្ដង់ដារ web project ។' },
    ],
    variables: [
      { label: 'Composer', desc: 'The dependency manager for PHP, similar to npm for Node.js.' },
      { label: 'php artisan', desc: 'Laravel\'s command-line interface providing helpful commands for development.' }
    ],
    tip: 'public/ folder ជា web root ─ browser ចូលដំបូងទីនេះ ─ index.php bootstrap ចូល Laravel ទាំងមូល ។',
    lab: 'ដំឡើង Laravel Installer ហើយបង្កើត web app ថ្មី "my-blog" ─ open browser http://localhost:8000 ។',
    result: 'Welcome page Laravel បង្ហាញ ─ web application ដំណើរការបានលើ local machine ។',
    filename: 'terminal',
    code: `# Step 1: Install Laravel Installer
composer global require laravel/installer

# Step 2: Create new web application
laravel new my-blog
# Choose: No starter kit, Pest testing, MySQL

# Step 3: Start development server
cd my-blog
php artisan serve
# → App running at http://127.0.0.1:8000

# Step 4: Generate secure APP_KEY
php artisan key:generate`,
    terminal: 'php artisan serve',
    terminalOutput: '   INFO  Server running on [http://127.0.0.1:8000].\n   Press Ctrl+C to stop the server.',
    icon: Rocket,
  },
  {
    id: 'L01-S2', chapter: 'setup',
    section: '2. Architecture',
    title: 'Project Structure', subtitle: 'ការស្គាល់ Folder នីមួយៗ',
    accent: '#f43f5e',
    bg: 'radial-gradient(ellipse at 80% 30%, rgba(244,63,94,0.12) 0%, transparent 55%)',
    concepts: [
      { label: 'app/Http/Controllers/', desc: 'Web Controllers ─ handle browser requests, return HTML views ឬ JSON responses ។' },
      { label: 'resources/views/', desc: 'Blade HTML templates ─ ទំព័រ web ដែល user ឃើញ ─ mix PHP + HTML ។' },
      { label: 'routes/web.php', desc: 'Web routes ─ URL ទៅ Controller mapping ─ ចំណុចប្រទាក់ HTTP ទាំងអស់ ។' },
      { label: 'public/', desc: 'Web root ─ CSS, JS, images ─ accessible ដោយ browser ─ index.php entry point ។' },
    ],
    variables: [
      { label: 'app/', desc: 'The core directory of your application, containing models and controllers.' },
      { label: 'resources/', desc: 'Contains your views as well as your raw, un-compiled assets (CSS/JS).' }
    ],
    tip: 'storage/app/public/ ─ upload files ទីនេះ ─ run "php artisan storage:link" ដើម្បី web-accessible ។',
    lab: 'ស្វែងរក resources/views/welcome.blade.php ─ កែ title ─ refresh browser ─ ឃើញការប្ដូរ ។',
    result: 'យល់ path flow: Browser Request → routes/web.php → Controller → resources/views/*.blade.php → Response ។',
    filename: 'project-structure.md',
    code: `my-blog/
├── app/
│   ├── Http/
│   │   ├── Controllers/   ← Web request handlers
│   │   └── Middleware/    ← Request guards/filters
│   └── Models/            ← Database models (Eloquent)
├── routes/
│   ├── web.php            ← Browser routes (HTML)
│   └── api.php            ← API routes (JSON)
├── resources/
│   └── views/             ← Blade HTML templates
├── public/
│   └── index.php          ← Web entry point
├── database/
│   └── migrations/        ← Database schema history
└── .env                   ← App configuration secrets`,
    icon: HardDrive,
  },
  {
    id: 'L01-S3', chapter: 'setup',
    title: 'Artisan CLI', subtitle: 'ឧបករណ៍ Generator ដ៏មានថាមពល',
    accent: '#f43f5e',
    bg: 'radial-gradient(ellipse at 50% 50%, rgba(244,63,94,0.1) 0%, transparent 60%)',
    concepts: [
      { label: 'make:controller', desc: 'Generate web Controller class ─ app/Http/Controllers/PostController.php ។' },
      { label: 'make:model -m', desc: 'Generate Model + Migration ─ ពីរ files ក្នុងពេលតែមួយ ─ -mc = +Controller ។' },
      { label: 'make:view', desc: 'Generate blank Blade template ─ resources/views/posts/index.blade.php ។' },
      { label: 'route:list', desc: 'មើល URL ទាំងអស់ក្នុង web app ─ method, path, name, controller ។' },
    ],
    tip: '"php artisan make:model Post -mcr" ─ Model + Migration + Controller (resource) ─ ចាប់ CRUD លឿន ！',
    lab: 'Run "php artisan route:list" ─ ស្គាល់ default routes ─ បន្ទាប់ run "php artisan make:model Post -mc" ។',
    result: 'Post.php Model, migration file, PostController.php ─ generated ក្នុង seconds ─ ready to code ！',
    filename: 'terminal',
    code: `# Generate full CRUD scaffold at once
php artisan make:model Post -mcr
# Creates:
# → app/Models/Post.php
# → database/migrations/..._create_posts_table.php
# → app/Http/Controllers/PostController.php (7 methods)

# See all web routes
php artisan route:list

# Generate Blade view
php artisan make:view posts.index

# Clear everything & fresh start
php artisan migrate:fresh --seed`,
    terminal: 'php artisan route:list',
    terminalOutput: `  GET|HEAD  / ................................ welcome
  GET|HEAD  api/user ........................ 
  GET|HEAD  posts .......... posts.index › PostController@index
  GET|HEAD  posts/create ... posts.create › PostController@create
  POST      posts .......... posts.store  › PostController@store`,
    icon: Terminal,
  },
  {
    id: 'L01-S4', chapter: 'setup',
    title: '.env Configuration', subtitle: 'Environment Variables & App Settings',
    accent: '#f43f5e',
    bg: 'radial-gradient(ellipse at center, rgba(244,63,94,0.08) 0%, transparent 70%)',
    concepts: [
      { label: '.env File', desc: 'Store secrets: DB password, mail credentials, API keys ─ NEVER commit to git ！' },
      { label: 'APP_KEY', desc: '32-byte secret ─ encrypt cookies, sessions, CSRF tokens ─ run key:generate ដំបូង ។' },
      { label: 'APP_DEBUG=true', desc: 'Development mode ─ shows detailed error pages ─ SET FALSE ក្នុង production ！' },
      { label: 'DB_* Variables', desc: 'DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD ─ connect web app ទៅ MySQL ។' },
    ],
    tip: 'Copy .env.example → .env ─ fill in your values ─ .env.example ចូល git, .env មិនចូល git ！',
    lab: 'Set DB_DATABASE="my_blog" DB_USERNAME="root" ─ run "php artisan migrate" ─ verify tables created ។',
    result: 'Web app connected to MySQL database ─ default users, sessions, cache tables auto-created ។',
    filename: '.env',
    code: `APP_NAME="My Blog"
APP_ENV=local
APP_KEY=base64:Xm8...
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=my_blog
DB_USERNAME=root
DB_PASSWORD=secret

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025

SESSION_DRIVER=database
CACHE_STORE=redis`,
    icon: Key,
  },

  /* ── CH 02: MVC PATTERN ── */
  {
    id: 'L02-S1', chapter: 'mvc',
    title: 'MVC Architecture', subtitle: 'Model – View – Controller Pattern',
    accent: '#f97316',
    bg: 'radial-gradient(ellipse at 30% 20%, rgba(249,115,22,0.15) 0%, transparent 55%)',
    concepts: [
      { label: 'Model', desc: 'Data layer ─ Eloquent class ─ handles database queries, relationships, business rules ។' },
      { label: 'View', desc: 'Presentation layer ─ Blade templates ─ HTML ដែល user ឃើញ ─ no business logic ។' },
      { label: 'Controller', desc: 'Logic layer ─ receives HTTP request, calls Model, passes data to View ─ "middleman" ។' },
      { label: 'Request Flow', desc: 'Browser → Router → Middleware → Controller → Model → View → HTML Response ។' },
    ],
    tip: 'Fat Models, Skinny Controllers ─ business logic ក្នុង Model ─ Controller គ្រាន់តែ coordinate ។',
    lab: 'Trace ទំព័រ /posts: routes/web.php → PostController@index → Post::all() → posts/index.blade.php ។',
    result: 'យល់ច្បាស់ MVC flow ─ ដឹងថា code ណាដាក់ Model, Controller, View ។',
    filename: 'mvc-request-flow.md',
    code: `// 1. BROWSER requests GET /posts
// 2. ROUTER matches route
Route::get('/posts', [PostController::class, 'index']);

// 3. MIDDLEWARE checks auth, CSRF, etc.

// 4. CONTROLLER handles request
class PostController extends Controller {
    public function index() {
        // 5. MODEL queries database
        $posts = Post::where('published', true)
                     ->latest()->paginate(10);
        
        // 6. VIEW renders HTML with data
        return view('posts.index', compact('posts'));
    }
}

// 7. BLADE VIEW renders the HTML page
// 8. HTML RESPONSE sent back to browser`,
    icon: Layers,
  },
  {
    id: 'L02-S2', chapter: 'mvc',
    title: 'MVC in Practice', subtitle: 'Web Request Lifecycle',
    accent: '#f97316',
    bg: 'radial-gradient(ellipse at 75% 60%, rgba(249,115,22,0.1) 0%, transparent 55%)',
    concepts: [
      { label: 'Blade as View', desc: '@foreach, {{ $var }}, @if ─ mix PHP logic into HTML templates cleanly ។' },
      { label: 'Eloquent as Model', desc: 'Post::latest()->get() ─ returns Collection of Post objects ─ no raw SQL needed ។' },
      { label: 'Controller Methods', desc: 'index (list page), show (detail page), create/store (form), edit/update, destroy ។' },
      { label: 'view() helper', desc: 'return view("posts.index", $data) ─ maps to resources/views/posts/index.blade.php ។' },
    ],
    tip: 'view("posts.index") looks for resources/views/posts/index.blade.php ─ dots = folder separators ។',
    lab: 'Build: Route → PostController index() returns view("posts.index") with $posts from DB ─ display list ។',
    result: 'Full MVC cycle works: browser sees list of posts fetched from database ─ rendered as HTML ！',
    filename: 'app/Http/Controllers/PostController.php',
    code: `<?php
namespace App\Http\Controllers;

use App\Models\Post;

class PostController extends Controller
{
    // GET /posts → Show list page
    public function index()
    {
        $posts = Post::published()
                     ->with('author')
                     ->latest()
                     ->paginate(10);

        return view('posts.index', compact('posts'));
    }

    // GET /posts/{post} → Show detail page
    public function show(Post $post) // Auto-fetched by ID
    {
        $post->increment('views'); // Track page views
        return view('posts.show', compact('post'));
    }
}`,
    icon: Server,
  },

  /* ── CH 03: ROUTES AND CONTROLLERS ── */
  {
    id: 'L03-S1', chapter: 'routing',
    title: 'Routes in Laravel', subtitle: 'URL Mapping for Web Applications',
    accent: '#eab308',
    bg: 'radial-gradient(ellipse at 20% 40%, rgba(234,179,8,0.15) 0%, transparent 55%)',
    concepts: [
      { label: 'HTTP Verbs', desc: 'Route::get() view pages, post() submit forms, put()/patch() update, delete() remove ។' },
      { label: 'Route Parameters', desc: '/posts/{post} ─ dynamic URL segment ─ passed to controller as argument ។' },
      { label: 'Named Routes', desc: '->name("posts.show") ─ generate URLs: route("posts.show", $post) ─ no hardcoded URLs ！' },
      { label: 'Route Groups', desc: 'Share prefix/middleware across routes ─ Route::prefix("admin")->middleware("auth") ។' },
    ],
    tip: 'ប្រើ Named Routes ALWAYS ─ ប្ដូរ URL ពី /posts ទៅ /articles ─ code ផ្សេងទៀតមិនបែក ！',
    lab: 'Add route /blog/{slug} → BlogController@show ─ name it "blog.show" ─ test in browser ។',
    result: '/blog/my-first-post loads BlogController@show with $slug = "my-first-post" ។',
    filename: 'routes/web.php',
    code: `<?php
use App\Http\Controllers\PostController;
use App\Http\Controllers\PageController;

// Static pages
Route::get('/', [PageController::class, 'home'])->name('home');
Route::get('/about', [PageController::class, 'about'])->name('about');

// Blog posts - full CRUD
Route::get('/posts', [PostController::class, 'index'])->name('posts.index');
Route::get('/posts/{post}', [PostController::class, 'show'])->name('posts.show');
Route::get('/posts/create', [PostController::class, 'create'])->name('posts.create');
Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
Route::get('/posts/{post}/edit', [PostController::class, 'edit'])->name('posts.edit');
Route::patch('/posts/{post}', [PostController::class, 'update'])->name('posts.update');
Route::delete('/posts/{post}', [PostController::class, 'destroy'])->name('posts.destroy');

// Route group with prefix
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'index'])->name('dashboard');
});`,
    icon: Globe,
  },
  {
    id: 'L03-S2', chapter: 'routing',
    title: 'Controllers', subtitle: 'Web Request Handlers',
    accent: '#eab308',
    bg: 'radial-gradient(ellipse at 75% 35%, rgba(234,179,8,0.12) 0%, transparent 55%)',
    concepts: [
      { label: 'Single Action', desc: '__invoke() ─ Controller with one job ─ great for simple pages like Home, About ។' },
      { label: 'Resource Controller', desc: '7 standard methods for web CRUD ─ index, create, store, show, edit, update, destroy ។' },
      { label: 'Route-Model Binding', desc: 'Type-hint Post $post ─ Laravel auto-fetches from DB by ID ─ 404 if not found ។' },
      { label: 'Return Types', desc: 'view() for HTML pages, redirect() after form submission, back() to previous page ។' },
    ],
    tip: 'After POST form submission, ALWAYS redirect ─ prevents duplicate submission on browser refresh ！',
    lab: 'Create PostController ─ index() returns view with $posts ─ show(Post $post) returns view with $post ។',
    result: 'Controller handles browser requests ─ fetches data ─ passes to Blade template for display ។',
    filename: 'app/Http/Controllers/PostController.php',
    code: `<?php
namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    // GET /posts → List all posts
    public function index()
    {
        $posts = Post::with('author')->latest()->paginate(12);
        return view('posts.index', compact('posts'));
    }

    // POST /posts → Save new post
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body'  => 'required|string',
        ]);

        auth()->user()->posts()->create($validated);

        // Always redirect after POST (PRG pattern)
        return redirect()->route('posts.index')
                         ->with('success', 'Post published!');
    }
}`,
    terminal: 'php artisan make:controller PostController --resource',
    terminalOutput: '   INFO  Controller [app/Http/Controllers/PostController.php] created successfully.',
    icon: Server,
  },

  /* ── CH 04: RESOURCES AND CONTROLLERS ── */
  {
    id: 'L04-S1', chapter: 'resources',
    title: 'Resource Controllers', subtitle: 'RESTful Web Routes in One Line',
    accent: '#22c55e',
    bg: 'radial-gradient(ellipse at 15% 50%, rgba(34,197,94,0.15) 0%, transparent 55%)',
    concepts: [
      { label: 'Route::resource()', desc: '1 line → 7 web routes: index, create, store, show, edit, update, destroy ─ full CRUD ！' },
      { label: '7 Web Actions', desc: 'index=list page, create=new form, store=save, show=detail, edit=edit form, update=save edit, destroy=delete ។' },
      { label: 'Shallow Resource', desc: 'Route::resource("posts.comments", ...) ─ nested URL: /posts/1/comments/5/edit ។' },
      { label: 'Partial Resource', desc: '->only(["index","show"]) ─ read-only web pages ─ ->except(["destroy"]) ─ no delete ។' },
    ],
    tip: '"php artisan make:controller PostController --resource --model=Post" ─ generates methods with type-hints ！',
    lab: 'Replace 7 individual routes with Route::resource("posts", PostController::class) ─ verify same result ។',
    result: 'php artisan route:list shows 7 posts.* routes ─ same behavior ─ cleaner routes/web.php ！',
    filename: 'routes/web.php',
    code: `// BEFORE: 7 individual routes (messy)
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/create', [PostController::class, 'create']);
Route::post('/posts', [PostController::class, 'store']);
// ... 4 more lines

// AFTER: 1 line = same 7 routes (clean!)
Route::resource('posts', PostController::class);

// Read-only pages only (no create/edit/delete)
Route::resource('tags', TagController::class)->only(['index', 'show']);

// Nested: /posts/{post}/comments/{comment}
Route::resource('posts.comments', CommentController::class)
      ->shallow(); // → /comments/{comment} for show/edit/destroy`,
    terminal: 'php artisan route:list --path=posts',
    terminalOutput: `  GET|HEAD  posts ................. posts.index   PostController@index
  POST      posts ................. posts.store   PostController@store  
  GET|HEAD  posts/create .......... posts.create  PostController@create
  GET|HEAD  posts/{post} .......... posts.show    PostController@show
  PUT|PATCH posts/{post} .......... posts.update  PostController@update
  DELETE    posts/{post} .......... posts.destroy PostController@destroy
  GET|HEAD  posts/{post}/edit ..... posts.edit    PostController@edit`,
    icon: Workflow,
  },
  {
    id: 'L04-S2', chapter: 'resources',
    title: 'Blade Views for Resources', subtitle: 'Standard Web View Structure',
    accent: '#22c55e',
    bg: 'radial-gradient(ellipse at 80% 40%, rgba(34,197,94,0.1) 0%, transparent 55%)',
    concepts: [
      { label: 'View Naming Convention', desc: 'posts/index.blade.php (list), posts/show.blade.php (detail), posts/create.blade.php (form) ។' },
      { label: '@extends Layout', desc: 'Child views extend master layout ─ DRY principle ─ nav/footer only written once ។' },
      { label: '@section Content', desc: '@section("content") fills @yield("content") in layout ─ page-specific HTML ។' },
      { label: 'route() helper', desc: 'route("posts.edit", $post) → /posts/5/edit ─ named route URL generation ។' },
    ],
    tip: 'Create layouts/app.blade.php first ─ all other views extend it ─ nav changes once = everywhere ！',
    lab: 'Create views/posts/index.blade.php that extends layout ─ loops $posts ─ shows title + link ។',
    result: '/posts renders HTML list of all posts ─ each linked to its show page ─ proper web app UX ！',
    filename: 'resources/views/posts/index.blade.php',
    code: `@extends('layouts.app')

@section('title', 'All Posts')

@section('content')
<div class="container mx-auto py-8">
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Blog Posts</h1>
        @auth
            <a href="{{ route('posts.create') }}" 
               class="btn btn-primary">New Post</a>
        @endauth
    </div>

    @forelse($posts as $post)
        <article class="card mb-4">
            <h2>
                <a href="{{ route('posts.show', $post) }}">
                    {{ $post->title }}
                </a>
            </h2>
            <p>By {{ $post->author->name }}</p>
        </article>
    @empty
        <p>No posts yet.</p>
    @endforelse

    {{ $posts->links() }}  {{-- Pagination --}}
</div>
@endsection`,
    icon: Layout,
  },

  /* ── CH 05: MIDDLEWARE ── */
  {
    id: 'L05-S1', chapter: 'middleware',
    title: 'Middleware in Laravel', subtitle: 'Web Request Filters & Guards',
    accent: '#06b6d4',
    bg: 'radial-gradient(ellipse at 25% 55%, rgba(6,182,212,0.15) 0%, transparent 55%)',
    concepts: [
      { label: 'What is Middleware?', desc: 'Code that runs BETWEEN browser request and Controller ─ inspect, modify or reject ។' },
      { label: 'auth Middleware', desc: 'Redirects unauthenticated users to /login ─ protects dashboard, profile, admin pages ។' },
      { label: 'verified Middleware', desc: 'Requires email verification ─ blocks access until user confirms email ។' },
      { label: 'Custom Middleware', desc: 'Your own logic: check subscription, set locale, log activity, check user role ។' },
    ],
    tip: 'Middleware runs for EVERY request in the pipeline ─ keep it fast ─ no heavy DB queries in global middleware ！',
    lab: 'Add ->middleware("auth") to /dashboard route ─ visit while logged out ─ observe redirect to /login ។',
    result: 'Unauthenticated users can\'t access dashboard ─ redirected to login page automatically ！',
    filename: 'routes/web.php',
    code: `// Protect single web page
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware('auth')
    ->name('dashboard');

// Protect group of web pages
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::get('/settings', [SettingsController::class, 'edit']);
    Route::resource('posts', PostController::class)
         ->except(['index', 'show']); // Create/edit/delete need auth
});

// Admin-only pages
Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/users', [AdminUserController::class, 'index']);
    Route::get('/analytics', [AnalyticsController::class, 'index']);
});`,
    icon: Lock,
  },
  {
    id: 'L05-S2', chapter: 'middleware',
    title: 'Custom Middleware', subtitle: 'Building Your Own Request Guards',
    accent: '#06b6d4',
    bg: 'radial-gradient(ellipse at 80% 30%, rgba(6,182,212,0.1) 0%, transparent 55%)',
    concepts: [
      { label: 'handle() Method', desc: 'Core logic: check condition → abort/redirect, or call $next($request) to continue ។' },
      { label: 'Before vs After', desc: 'Code before $next() runs BEFORE controller; after runs AFTER response generated ។' },
      { label: 'Registration', desc: 'Register in bootstrap/app.php or assign alias ─ then use in routes or controllers ។' },
      { label: 'Middleware Parameters', desc: '->middleware("role:admin,editor") ─ pass comma-separated values to handle() ។' },
    ],
    tip: 'abort(403) vs redirect() ─ use abort for API/AJAX, redirect() for browser web pages ─ better UX ！',
    lab: 'Build CheckSubscription middleware ─ if user->plan == "free" and posts > 3 ─ redirect to /upgrade ។',
    result: 'Free users hitting post creation limit see upgrade page ─ paid users continue ─ subscription gate working ！',
    filename: 'app/Http/Middleware/CheckSubscription.php',
    code: `<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckSubscription
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        // Free plan users limited to 3 posts
        if ($user && $user->plan === 'free') {
            if ($user->posts()->count() >= 3) {
                return redirect()->route('upgrade')
                    ->with('warning', 
                        'Upgrade to publish more posts!');
            }
        }

        return $next($request); // Allow through
    }
}

// Register in routes
Route::post('/posts', [PostController::class, 'store'])
    ->middleware(['auth', CheckSubscription::class]);`,
    terminal: 'php artisan make:middleware CheckSubscription',
    terminalOutput: '   INFO  Middleware [app/Http/Middleware/CheckSubscription.php] created successfully.',
    icon: Shield,
  },

  /* ── CH 06: SECURITY ── */
  {
    id: 'L06-S1', chapter: 'security',
    title: 'Security in Laravel', subtitle: 'Built-in Web Application Protection',
    accent: '#a855f7',
    bg: 'radial-gradient(ellipse at 10% 30%, rgba(168,85,247,0.15) 0%, transparent 55%)',
    concepts: [
      { label: 'CSRF Protection', desc: '@csrf in every form ─ generates hidden _token ─ Laravel validates on POST/PUT/DELETE ─ blocks forged requests ។' },
      { label: 'XSS Prevention', desc: '{{ $var }} auto-escapes HTML ─ <script> tags neutralized ─ safe output ─ use {!! !!} ONLY for trusted HTML ។' },
      { label: 'SQL Injection', desc: 'Eloquent + Query Builder use PDO prepared statements ─ user input NEVER injected into raw SQL ។' },
      { label: 'Mass Assignment', desc: '$fillable whitelist ─ users can\'t inject unexpected fields like "role" => "admin" via form ！' },
    ],
    tip: 'Security checklist: @csrf in forms, {{ }} for output, $fillable on models, validation before save ！',
    lab: 'Remove @csrf from a form ─ try submit ─ see 419 Page Expired error ─ add back ─ works again ！',
    result: 'CSRF protection confirmed working ─ forged cross-site requests blocked by Laravel automatically ！',
    filename: 'resources/views/posts/create.blade.php',
    code: `<form method="POST" action="{{ route('posts.store') }}"
      enctype="multipart/form-data">
    
    @csrf  {{-- Required! Generates hidden _token --}}
    
    {{-- XSS safe output with {{ }} --}}
    <input name="title" value="{{ old('title') }}" 
           class="@error('title') border-red-500 @enderror">
    
    @error('title')
        <p class="text-red-500">{{ $message }}</p>
    @enderror

    <textarea name="body">{{ old('body') }}</textarea>

    {{-- Method spoofing for PUT/PATCH/DELETE --}}
    {{-- @method('PATCH') --}}

    <button type="submit">Publish Post</button>
</form>

{{-- NEVER do this with user input: --}}
{{-- {!! $userContent !!} ← XSS vulnerability! --}}`,
    icon: Shield,
  },
  {
    id: 'L06-S2', chapter: 'security',
    title: 'Authorization', subtitle: 'Gates & Policies for Web Apps',
    accent: '#a855f7',
    bg: 'radial-gradient(ellipse at 80% 70%, rgba(168,85,247,0.12) 0%, transparent 55%)',
    concepts: [
      { label: 'Authentication vs Authorization', desc: 'Auth: ដឹងថាអ្នកជានរណា (login). Authorization: ដឹងថាអ្នកអាចធ្វើអ្វី (permissions) ។' },
      { label: 'Policies', desc: 'PostPolicy class ─ methods: view, create, update, delete ─ linked to Post model ។' },
      { label: '@can in Blade', desc: '@can("update", $post) → show Edit button ─ @cannot("delete", $post) → hide Delete ។' },
      { label: '$this->authorize()', desc: 'In Controller: $this->authorize("update", $post) ─ throws 403 if unauthorized ។' },
    ],
    tip: 'Show/hide UI with @can ─ ALSO protect Controller with authorize() ─ never rely on hidden buttons alone ！',
    lab: 'Create PostPolicy ─ update/delete only if $user->id === $post->user_id ─ apply in view + controller ។',
    result: 'Edit/Delete buttons only visible to post owner ─ direct URL access also blocked with 403 ！',
    filename: 'app/Policies/PostPolicy.php',
    code: `<?php
namespace App\Policies;

use App\Models\Post;
use App\Models\User;

class PostPolicy
{
    public function update(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }

    public function delete(User $user, Post $post): bool
    {
        return $user->id === $post->user_id 
               || $user->isAdmin();
    }
}

{{-- In Blade view: --}}
@can('update', $post)
    <a href="{{ route('posts.edit', $post) }}">Edit</a>
@endcan

@can('delete', $post)
    <form method="POST" action="{{ route('posts.destroy', $post) }}">
        @csrf @method('DELETE')
        <button>Delete</button>
    </form>
@endcan`,
    icon: Fingerprint,
  },

  /* ── CH 07: REST APIs ── */
  {
    id: 'L07-S1', chapter: 'restapi',
    title: 'Understanding REST APIs', subtitle: 'JSON APIs for Web & Mobile',
    accent: '#ec4899',
    bg: 'radial-gradient(ellipse at 40% 20%, rgba(236,72,153,0.15) 0%, transparent 55%)',
    concepts: [
      { label: 'REST Principles', desc: 'Stateless ─ every request self-contained ─ no sessions ─ Resource URLs ─ HTTP methods ។' },
      { label: 'HTTP Methods', desc: 'GET=read, POST=create, PUT/PATCH=update, DELETE=remove ─ match verb to action ！' },
      { label: 'JSON Response', desc: '{"data": {...}, "message": "ok"} ─ standard structure ─ status codes 200/201/404/422 ។' },
      { label: 'API vs Web Routes', desc: 'web.php → HTML pages with sessions; api.php → JSON with token auth ─ different guards ។' },
    ],
    tip: 'REST URLs use nouns (resources): /api/posts ✓ ─ /api/getPosts ✗ ─ method defines the action ！',
    lab: 'Design REST API for a blog: list, get, create, update, delete posts ─ define URLs + methods + responses ។',
    result: 'Clean REST API design: GET /api/posts, POST /api/posts, PATCH /api/posts/{id}, DELETE /api/posts/{id} ！',
    filename: 'api-design.md',
    code: `# Blog REST API Design
# Base URL: https://myblog.com/api/v1

GET    /posts          → 200 { data: [...posts], links: {pagination} }
GET    /posts/{id}     → 200 { data: {...post} } | 404 { message: "Not found" }
POST   /posts          → 201 { data: {...newPost} } | 422 { errors: {...} }
PATCH  /posts/{id}     → 200 { data: {...updatedPost} }
DELETE /posts/{id}     → 204 No Content

# Request headers:
Content-Type: application/json
Accept: application/json
Authorization: Bearer <token>

# POST /posts body:
{
    "title": "My Post",
    "body": "Content...",
    "category_id": 1
}`,
    icon: Globe,
  },
  {
    id: 'L07-S2', chapter: 'restapi',
    title: 'Building APIs in Laravel', subtitle: 'API Routes, Controllers, Resources',
    accent: '#ec4899',
    bg: 'radial-gradient(ellipse at 70% 80%, rgba(236,72,153,0.1) 0%, transparent 55%)',
    concepts: [
      { label: 'routes/api.php', desc: 'Auto-prefixed /api ─ stateless (no session middleware) ─ returns JSON ។' },
      { label: 'API Resource Classes', desc: 'Transform Eloquent → consistent JSON ─ hide sensitive fields ─ format dates ។' },
      { label: 'apiResource Route', desc: 'Route::apiResource() ─ like resource() but without create/edit (no form pages needed) ។' },
      { label: 'Accept: application/json', desc: 'Send this header ─ Laravel returns JSON errors instead of redirect HTML ។' },
    ],
    tip: 'Always return PostResource not raw $post ─ controls exactly what data leaves your web app ！',
    lab: 'Create API PostController ─ index() returns PostResource::collection ─ test with curl/Postman ។',
    result: 'GET /api/posts returns {"data": [...]} JSON ─ consistent, safe, ready for frontend/mobile ！',
    filename: 'app/Http/Resources/PostResource.php',
    code: `<?php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'         => $this->id,
            'title'      => $this->title,
            'body'       => $this->body,
            'slug'       => $this->slug,
            'author'     => [
                'id'   => $this->user->id,
                'name' => $this->user->name,
            ],
            'created_at' => $this->created_at->toISOString(),
            // Never expose: password, remember_token, etc.
            'comments_count' => $this->whenCounted('comments'),
        ];
    }
}

// In Controller:
public function index() {
    return PostResource::collection(Post::paginate(15));
}`,
    icon: Package,
  },

  /* ── CH 08: DATABASE OVERVIEW ── */
  {
    id: 'L08-S1', chapter: 'database',
    title: 'Database Overview', subtitle: 'Laravel Database Fundamentals',
    accent: '#3b82f6',
    bg: 'radial-gradient(ellipse at 20% 40%, rgba(59,130,246,0.15) 0%, transparent 55%)',
    concepts: [
      { label: 'Supported Databases', desc: 'MySQL (production), PostgreSQL (advanced), SQLite (development/testing), SQL Server ។' },
      { label: 'Three Layers', desc: 'Raw SQL (fastest) → Query Builder (safe, chainable) → Eloquent ORM (objects, easiest) ។' },
      { label: 'Database Tooling', desc: 'Migrations (schema versioning), Seeders (test data), Factories (fake data generation) ។' },
      { label: 'db:show', desc: 'php artisan db:show ─ inspect database tables, columns, indexes ─ great debugging tool ។' },
    ],
    tip: 'MySQL for most web apps ─ SQLite for unit tests ─ configure in config/database.php and .env ！',
    lab: 'Run "php artisan db:show" ─ see all tables ─ then "php artisan db:table users" ─ see columns ។',
    result: 'Understand database layers available ─ know when to use Eloquent vs Query Builder vs Raw SQL ។',
    filename: 'config/database.php',
    code: `// Three ways to query data in Laravel web apps:

// 1. RAW SQL (use for complex reports, max performance)
$results = DB::select(
    'SELECT u.name, COUNT(p.id) as post_count
     FROM users u LEFT JOIN posts p ON p.user_id = u.id
     GROUP BY u.id ORDER BY post_count DESC LIMIT 10',
);

// 2. QUERY BUILDER (safe, no ORM overhead)
$posts = DB::table('posts')
    ->where('published', true)
    ->orderByDesc('created_at')
    ->limit(10)
    ->get();

// 3. ELOQUENT ORM (recommended for web apps)
$posts = Post::published()
             ->with('author', 'tags')
             ->latest()
             ->paginate(10);`,
    icon: Database,
  },
  {
    id: 'L08-S2', chapter: 'database',
    title: 'Seeders & Factories', subtitle: 'Populating Your Web App with Test Data',
    accent: '#3b82f6',
    bg: 'radial-gradient(ellipse at 85% 60%, rgba(59,130,246,0.12) 0%, transparent 55%)',
    concepts: [
      { label: 'Factories', desc: 'Define fake data structure ─ PostFactory creates realistic posts with Faker library ។' },
      { label: 'Seeders', desc: 'DatabaseSeeder orchestrates all factories ─ run "php artisan db:seed" to populate ។' },
      { label: 'Relationships in Factories', desc: 'User::factory()->hasPosts(10)->create() ─ creates user with 10 related posts ！' },
      { label: 'Development Workflow', desc: 'migrate:fresh --seed ─ wipes DB + runs all migrations + seeds ─ clean slate ！' },
    ],
    tip: 'Always seed with realistic data ─ test pagination with 100+ records ─ UI looks different with real content ！',
    lab: 'Create UserFactory + PostFactory ─ seed 10 users each with 5 posts ─ verify in browser/tinker ។',
    result: '50 realistic posts in database ─ pagination works ─ web app looks like real production app ！',
    filename: 'database/seeders/DatabaseSeeder.php',
    code: `<?php
namespace Database\Seeders;

use App\Models\User;
use App\Models\Post;
use App\Models\Tag;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user for testing
        User::factory()->create([
            'name'  => 'Admin User',
            'email' => 'admin@example.com',
            'role'  => 'admin',
        ]);

        // Create 10 regular users, each with 5 posts
        User::factory(10)
            ->hasPosts(5)
            ->create();

        // Create tags for the blog
        Tag::factory(15)->create();
    }
}`,
    terminal: 'php artisan migrate:fresh --seed',
    terminalOutput: '   INFO  Dropping all tables.\n   INFO  Running migrations.\n   INFO  Seeding database.\n   DONE  DatabaseSeeder ran successfully.',
    icon: Database,
  },

  /* ── CH 09: MIGRATIONS ── */
  {
    id: 'L09-S1', chapter: 'migrations',
    title: 'Laravel Migrations', subtitle: 'Version Control for Your Database Schema',
    accent: '#10b981',
    bg: 'radial-gradient(ellipse at 30% 30%, rgba(16,185,129,0.15) 0%, transparent 55%)',
    concepts: [
      { label: 'What are Migrations?', desc: 'PHP files describing DB changes ─ team shares schema via git ─ no more manual SQL files ！' },
      { label: 'Schema Builder', desc: '$table->string(), ->text(), ->boolean(), ->foreignId() ─ fluent, readable syntax ។' },
      { label: 'up() & down()', desc: 'up() applies change; down() reverses it ─ enables rollback without data loss ─ safe ！' },
      { label: 'Foreign Keys', desc: '$table->foreignId("user_id")->constrained()->cascadeOnDelete() ─ DB-level integrity ！' },
    ],
    tip: 'NEVER edit old migrations ─ create new ones ─ old migrations are history ─ treat like git commits ！',
    lab: 'Create migration for "posts" table ─ id, title, body, slug (unique), user_id (FK), timestamps ។',
    result: 'Posts table created with proper columns and foreign key to users ─ schema version controlled ！',
    filename: 'database/migrations/create_posts_table.php',
    code: `<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();                // BIGINT unsigned auto-increment
            $table->string('title');     // VARCHAR(255)
            $table->string('slug')->unique();  // SEO-friendly URL
            $table->longText('body');    // Full article content
            $table->string('image')->nullable(); // Cover image
            $table->boolean('published')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->foreignId('user_id')
                  ->constrained()
                  ->cascadeOnDelete(); // Delete posts when user deleted
            $table->timestamps();      // created_at, updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};`,
    terminal: 'php artisan migrate',
    terminalOutput: '   INFO  Running migrations.\n   2024_01_01_000002_create_posts_table .......... DONE',
    icon: Database,
  },
  {
    id: 'L09-S2', chapter: 'migrations',
    title: 'Modifying Existing Tables', subtitle: 'Alter, Add, Rollback',
    accent: '#10b981',
    bg: 'radial-gradient(ellipse at 75% 70%, rgba(16,185,129,0.1) 0%, transparent 55%)',
    concepts: [
      { label: 'Add Column Migration', desc: '"add_column_to_table" naming ─ Schema::table() (not create) ─ $table->string("col")->after("x") ។' },
      { label: 'migrate:rollback', desc: 'Undo last migration batch ─ calls down() ─ safe in dev ─ NEVER in production ！' },
      { label: 'migrate:fresh', desc: 'Drop ALL + re-migrate + seed ─ development reset ─ DESTROYS all data ！' },
      { label: 'migrate:status', desc: 'See which migrations ran ─ which pending ─ useful for debugging schema issues ។' },
    ],
    tip: 'Production: use migrate (safe). Development: migrate:fresh --seed (full reset) ─ never mix them ！',
    lab: 'Create migration "add_views_to_posts_table" ─ add unsignedBigInteger views default 0 ─ run migrate ។',
    result: 'Posts table now has "views" column ─ existing posts have views=0 ─ no data lost ！',
    filename: 'database/migrations/add_views_to_posts_table.php',
    code: `<?php
// php artisan make:migration add_views_to_posts_table

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->unsignedBigInteger('views')
                  ->default(0)
                  ->after('published');
            $table->string('meta_description', 160)
                  ->nullable()
                  ->after('body');
        });
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn(['views', 'meta_description']);
        });
    }
};`,
    terminal: 'php artisan migrate:status',
    terminalOutput: `  Ran?   Migration
  ✓      2024_01_01_000000_create_users_table
  ✓      2024_01_01_000001_create_sessions_table
  ✓      2024_01_02_000001_create_posts_table
  Pending  2024_01_03_000001_add_views_to_posts_table`,
    icon: GitBranch,
  },

  /* ── CH 10: RAW SQL ── */
  {
    id: 'L10-S1', chapter: 'rawsql',
    title: 'Raw SQL Queries', subtitle: 'Direct Database Communication',
    accent: '#fb923c',
    bg: 'radial-gradient(ellipse at 20% 60%, rgba(251,146,60,0.15) 0%, transparent 55%)',
    concepts: [
      { label: 'DB::select()', desc: 'Execute raw SELECT ─ returns array of stdClass objects ─ always use ? bindings ！' },
      { label: 'DB::insert() / update()', desc: 'Execute INSERT/UPDATE statements ─ returns bool ─ use for bulk operations ។' },
      { label: 'DB::statement()', desc: 'DDL statements, stored procedures ─ CREATE INDEX, ALTER TABLE ─ any arbitrary SQL ។' },
      { label: 'When to use', desc: 'Complex JOINs, GROUP BY reports, window functions ─ when Eloquent is too slow ។' },
    ],
    tip: 'ALWAYS use ? or :named bindings ─ NEVER concatenate user input ─ prevents SQL injection attacks ！',
    lab: 'Write raw SQL query: COUNT posts per user ─ JOIN users + posts ─ ORDER BY count DESC ─ LIMIT 5 ។',
    result: 'Dashboard shows "Top 5 Authors" using raw SQL ─ faster than Eloquent for aggregate reports ！',
    filename: 'app/Http/Controllers/ReportController.php',
    code: `use Illuminate\Support\Facades\DB;

// Analytics: top authors by post count
$topAuthors = DB::select('
    SELECT 
        u.id, 
        u.name,
        u.avatar,
        COUNT(p.id)        AS post_count,
        SUM(p.views)       AS total_views,
        MAX(p.created_at)  AS last_posted
    FROM users u
    LEFT JOIN posts p ON p.user_id = u.id 
                      AND p.published = 1
    WHERE u.created_at >= :since
    GROUP BY u.id, u.name, u.avatar
    ORDER BY post_count DESC
    LIMIT 10
', ['since' => now()->subYear()]);

// SAFE ✓ - uses prepared statement binding
// UNSAFE ✗ - DB::select("... WHERE name = '$name'");`,
    icon: Database,
  },

  /* ── CH 11: ELOQUENT ORM ── */
  {
    id: 'L11-S1', chapter: 'eloquent',
    title: 'Eloquent ORM', subtitle: 'Object-Relational Mapping for Web Apps',
    accent: '#8b5cf6',
    bg: 'radial-gradient(ellipse at 35% 25%, rgba(139,92,246,0.15) 0%, transparent 55%)',
    concepts: [
      { label: 'Active Record Pattern', desc: 'Post class = posts table ─ $post object = one row ─ methods interact with database ។' },
      { label: 'CRUD Methods', desc: 'Post::create(), find(), where()->get(), save(), update(), delete() ─ no SQL needed ！' },
      { label: '$fillable', desc: 'Whitelist mass-assignable columns ─ prevents users injecting "role"="admin" via forms ！' },
      { label: 'Scopes', desc: 'Post::published()->featured()->latest()->get() ─ reusable chainable query conditions ។' },
    ],
    tip: 'Add $casts to auto-convert: "published_at" => "datetime", "settings" => "array", "price" => "decimal:2" ！',
    lab: 'Create Post model with $fillable, published() scope ─ test in Tinker: Post::published()->count() ។',
    result: 'Post::published()->with("author")->latest()->paginate(10) ─ clean, readable, efficient web query ！',
    filename: 'app/Models/Post.php',
    code: `<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use SoftDeletes; // Soft delete support

    protected $fillable = [
        'title', 'slug', 'body', 'image',
        'published', 'published_at', 'user_id',
    ];

    protected $casts = [
        'published'    => 'boolean',
        'published_at' => 'datetime',
    ];

    // Reusable query scope
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('published', true)
                     ->whereNotNull('published_at');
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }
}`,
    icon: Layers,
  },

  /* ── CH 12: TINKER ── */
  {
    id: 'L12-S1', chapter: 'tinker',
    title: 'Laravel Tinker', subtitle: 'Interactive Shell for Web App Development',
    accent: '#f59e0b',
    bg: 'radial-gradient(ellipse at 50% 30%, rgba(245,158,11,0.15) 0%, transparent 55%)',
    concepts: [
      { label: 'What is Tinker?', desc: 'REPL shell with full Laravel context ─ test Models, helpers, services ─ no browser needed ！' },
      { label: 'Test Queries Live', desc: 'Post::published()->count(), User::find(1)->posts ─ see results immediately ！' },
      { label: 'Create Test Data', desc: 'Post::factory()->create() ─ generate fake posts directly from terminal ！' },
      { label: 'Debug Web Issues', desc: 'Test relationships, check values, verify logic ─ faster than writing temporary routes ！' },
    ],
    tip: 'Tinker ជា developer\'s best friend ─ use it before writing code ─ prototype Eloquent queries first ！',
    lab: 'Open Tinker ─ create 1 user ─ create 3 posts for that user ─ query posts via user relationship ។',
    result: '$user->posts returns Collection of 3 posts ─ relationship confirmed working before writing views ！',
    filename: 'terminal',
    code: `# Open Tinker
php artisan tinker

# Create a test user
$user = User::factory()->create(['email' => 'test@blog.com']);

# Create posts for that user
$user->posts()->create([
    'title' => 'Hello Laravel',
    'slug'  => 'hello-laravel',
    'body'  => 'My first post content',
    'published' => true,
    'published_at' => now(),
]);

# Test Eloquent queries
Post::published()->count();          // → 1
Post::with('author')->latest()->get();
$user->posts->pluck('title');        // → ["Hello Laravel"]

# Test helpers
Str::slug('Hello World!');           // → "hello-world"
now()->addDays(7)->format('d/m/Y'); // → "27/01/2024"`,
    terminal: 'php artisan tinker',
    terminalOutput: 'Psy Shell v0.12.3 (PHP 8.3)\n> Post::published()->count()\n= 12\n> User::find(1)->posts->count()\n= 5',
    icon: Terminal,
  },

  /* ── CH 13: RELATIONSHIPS OVERVIEW ── */
  {
    id: 'L13-S1', chapter: 'relationships',
    title: 'Eloquent Relationships', subtitle: 'Connecting Models in Your Web App',
    accent: '#ef4444',
    bg: 'radial-gradient(ellipse at 25% 45%, rgba(239,68,68,0.15) 0%, transparent 55%)',
    concepts: [
      { label: 'One-to-One (1:1)', desc: 'User ↔ Profile ─ each user has exactly one profile ─ hasOne / belongsTo ។' },
      { label: 'One-to-Many (1:N)', desc: 'User → Posts ─ one user has many posts ─ most common in web apps ─ hasMany / belongsTo ។' },
      { label: 'Many-to-Many (N:N)', desc: 'Post ↔ Tags ─ post has many tags, tag has many posts ─ needs pivot table ─ belongsToMany ។' },
      { label: 'Eager Loading', desc: 'Post::with("author", "tags") ─ solves N+1 ─ 2 queries instead of 101 queries ！' },
    ],
    tip: 'N+1 Problem: looping $post->author in foreach without with() = 1 + N database queries ─ SLOW ！',
    lab: 'Test N+1 vs Eager Loading ─ use DB::enableQueryLog() ─ compare query counts with/without with() ។',
    result: 'Posts page goes from 51 queries to 2 queries ─ web app 10x faster with eager loading ！',
    filename: 'app/Http/Controllers/PostController.php',
    code: `// N+1 Problem - BAD for web performance
$posts = Post::all(); // 1 query
foreach ($posts as $post) {
    echo $post->author->name; // +1 query per post!
    // 50 posts = 51 total queries!
}

// Eager Loading - GOOD
$posts = Post::with(['author', 'tags'])->get(); // 2 queries total

// Check query count in development:
DB::enableQueryLog();
$posts = Post::with('author')->get();
$queries = DB::getQueryLog();
echo count($queries); // Should be 2, not 51!

// In Controller for web page:
public function index() {
    $posts = Post::published()
                 ->with(['author', 'tags', 'category'])
                 ->latest()
                 ->paginate(12);
    return view('posts.index', compact('posts'));
}`,
    icon: Workflow,
  },

  /* ── CH 14: ONE-TO-ONE ── */
  {
    id: 'L14-S1', chapter: 'onetone',
    title: 'One-to-One Relationship', subtitle: 'hasOne & belongsTo',
    accent: '#14b8a6',
    bg: 'radial-gradient(ellipse at 30% 20%, rgba(20,184,166,0.15) 0%, transparent 55%)',
    concepts: [
      { label: 'Use Case', desc: 'User ↔ Profile (bio, avatar, social links), User ↔ Settings ─ exclusive one-to-one ។' },
      { label: 'hasOne()', desc: 'User hasOne Profile ─ FK "user_id" lives in profiles table ─ returns single Model ។' },
      { label: 'belongsTo()', desc: 'Profile belongsTo User ─ inverse side ─ Profile can access its User ។' },
      { label: 'firstOrCreate()', desc: '$user->profile()->firstOrCreate([]) ─ get existing or create new profile safely ！' },
    ],
    tip: 'FK lives on "belongsTo" side ─ profiles.user_id references users.id ─ NOT users.profile_id ！',
    lab: 'Build User Profile system: Profile model + migration (user_id FK, bio, avatar) + hasOne/belongsTo ។',
    result: '$user->profile->bio and $profile->user->name both work ─ bidirectional navigation ！',
    filename: 'app/Models/User.php',
    code: `// User Model
class User extends Model
{
    public function profile(): HasOne
    {
        return $this->hasOne(Profile::class);
    }
}

// Profile Model  
class Profile extends Model
{
    protected $fillable = ['user_id', 'bio', 'avatar', 'website'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

// In web Controller:
public function show(User $user)
{
    // Eager load profile with user
    $user->load('profile');
    return view('users.show', compact('user'));
}

// In Blade view:
// {{ $user->profile->bio }}
// <img src="{{ $user->profile->avatar }}">`,
    icon: Layers,
  },

  /* ── CH 15: ONE-TO-MANY ── */
  {
    id: 'L15-S1', chapter: 'onetomany',
    title: 'One-to-Many Relationship', subtitle: 'hasMany & belongsTo',
    accent: '#6366f1',
    bg: 'radial-gradient(ellipse at 60% 30%, rgba(99,102,241,0.15) 0%, transparent 55%)',
    concepts: [
      { label: 'Use Case', desc: 'User → Posts, Post → Comments, Category → Products ─ most common relationship in web apps ！' },
      { label: 'hasMany()', desc: 'User hasMany Post ─ returns Eloquent Collection ─ FK "user_id" in posts table ។' },
      { label: 'belongsTo()', desc: 'Post belongsTo User ─ $post->author returns the User object ─ FK on Post side ។' },
      { label: 'Create via Relationship', desc: '$user->posts()->create([...]) ─ auto-sets user_id ─ no manual assignment ！' },
    ],
    tip: '$user->posts (property) = loaded Collection; $user->posts() (method) = QueryBuilder for chaining ！',
    lab: 'Define User hasMany Posts ─ Post belongsTo User ─ test $user->posts()->latest()->get() in Tinker ។',
    result: '$user->posts returns all posts by that user ─ $post->author returns the post\'s User ─ navigation works ！',
    filename: 'app/Models/Post.php',
    code: `// User Model
class User extends Model
{
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }
}

// Post Model
class Post extends Model
{
    // "author" = custom method name
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }
}

// In web Controller:
public function store(Request $request)
{
    // Auto-sets user_id = auth()->id()
    auth()->user()->posts()->create([
        'title' => $request->title,
        'body'  => $request->body,
    ]);
    return redirect()->route('posts.index');
}`,
    icon: GitBranch,
  },

  /* ── CH 16: MANY-TO-MANY ── */
  {
    id: 'L16-S1', chapter: 'manytomany',
    title: 'Many-to-Many Relationship', subtitle: 'belongsToMany & Pivot Tables',
    accent: '#f43f5e',
    bg: 'radial-gradient(ellipse at 40% 60%, rgba(244,63,94,0.15) 0%, transparent 55%)',
    concepts: [
      { label: 'Use Case', desc: 'Post ↔ Tags, User ↔ Roles, Student ↔ Courses ─ each side belongs to many of the other ！' },
      { label: 'Pivot Table', desc: '"post_tag" table with post_id + tag_id ─ alphabetical naming ─ Laravel finds automatically ។' },
      { label: 'belongsToMany()', desc: 'Both models use belongsToMany() ─ Post::with("tags") → loads all tags ！' },
      { label: 'sync() / attach()', desc: '$post->tags()->sync([1,2,3]) ─ sets exact tags ─ attach adds, detach removes ！' },
    ],
    tip: 'sync([1,2,3]) ─ removes tags not in array, adds new ones ─ perfect for tag checkbox forms ！',
    lab: 'Build tagging system: posts, tags, post_tag tables ─ form with checkboxes ─ sync on save ！',
    result: 'Blog posts have tags ─ tag pages list related posts ─ M:N working in web app ！',
    filename: 'app/Models/Post.php',
    code: `// Post Model
class Post extends Model
{
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
        // Auto-uses "post_tag" pivot table
    }
}

// Tag Model
class Tag extends Model
{
    public function posts(): BelongsToMany
    {
        return $this->belongsToMany(Post::class);
    }
}

// In web Controller (handle tag form):
public function update(Request $request, Post $post)
{
    $post->update($request->validated());

    // Sync tags from checkbox form: [1, 3, 7]
    $post->tags()->sync($request->input('tags', []));

    return redirect()->route('posts.show', $post);
}

// In Blade view:
// @foreach($post->tags as $tag)
//     <a href="/tags/{{ $tag->slug }}">{{ $tag->name }}</a>
// @endforeach`,
    icon: Workflow,
  },

  /* ── CH 17: FILE UPLOADING ── */
  {
    id: 'L17-S1', chapter: 'fileupload',
    title: 'Uploading Files in Laravel', subtitle: 'Images, Storage & Access',
    accent: '#84cc16',
    bg: 'radial-gradient(ellipse at 30% 40%, rgba(132,204,22,0.15) 0%, transparent 55%)',
    concepts: [
      { label: 'enctype Attribute', desc: 'Form needs enctype="multipart/form-data" ─ without it, file data never reaches Laravel ！' },
      { label: 'File Validation', desc: '"required|image|mimes:jpeg,png,webp|max:2048" ─ validate before storing ─ security first ！' },
      { label: 'Storage Disks', desc: '"public" disk = web-accessible (storage/app/public) ─ "local" = private storage ។' },
      { label: 'storage:link', desc: 'php artisan storage:link ─ creates public/storage symlink ─ run once after install ！' },
    ],
    tip: 'NEVER store uploads in public/ directly ─ use storage/ ─ run storage:link ─ use Storage::url() for paths ！',
    lab: 'Build cover image upload for posts: form + validation + store("covers","public") + display in view ។',
    result: 'Post creation form accepts image ─ saved to storage ─ displayed on post page with proper URL ！',
    filename: 'app/Http/Controllers/PostController.php',
    code: `public function store(Request $request)
{
    $validated = $request->validate([
        'title'  => 'required|string|max:255',
        'body'   => 'required|string',
        'cover'  => 'nullable|image|mimes:jpeg,png,webp|max:2048',
    ]);

    // Handle file upload
    if ($request->hasFile('cover')) {
        // Stores to storage/app/public/covers/
        $validated['cover'] = $request->file('cover')
            ->store('covers', 'public');
    }

    auth()->user()->posts()->create($validated);

    return redirect()->route('posts.index')
                     ->with('success', 'Post published!');
}`,
    icon: HardDrive,
  },
  {
    id: 'L17-S2', chapter: 'fileupload',
    title: 'Displaying Uploaded Files', subtitle: 'Storage URLs in Blade Views',
    accent: '#84cc16',
    bg: 'radial-gradient(ellipse at 75% 65%, rgba(132,204,22,0.1) 0%, transparent 55%)',
    concepts: [
      { label: 'Storage::url()', desc: 'Storage::url($post->cover) → /storage/covers/abc.jpg ─ correct web URL ！' },
      { label: 'storage:link', desc: 'Creates symlink: public/storage → storage/app/public ─ makes files web-accessible ！' },
      { label: 'asset() helper', desc: 'asset("storage/".$post->cover) ─ alternative to Storage::url() ─ same result ！' },
      { label: 'File Deletion', desc: 'Storage::disk("public")->delete($post->cover) ─ delete old file before replacing ！' },
    ],
    tip: 'Always delete old file when replacing ─ Storage::disk("public")->delete($old) ─ prevent orphan files ！',
    lab: 'Display cover image in posts/show.blade.php ─ handle nullable cover ─ show placeholder if none ！',
    result: 'Post detail page shows cover image with proper path ─ missing cover shows default placeholder ！',
    filename: 'resources/views/posts/show.blade.php',
    code: `@extends('layouts.app')

@section('content')
<article class="max-w-3xl mx-auto">

    {{-- Cover Image --}}
    @if($post->cover)
        <img src="{{ Storage::url($post->cover) }}"
             alt="{{ $post->title }}"
             class="w-full h-64 object-cover rounded-xl mb-8">
    @else
        <div class="w-full h-64 bg-gray-200 rounded-xl mb-8 
                    flex items-center justify-center">
            <span class="text-gray-400">No cover image</span>
        </div>
    @endif

    <h1 class="text-4xl font-bold mb-4">{{ $post->title }}</h1>
    <p class="text-gray-500 mb-8">
        By {{ $post->author->name }} • 
        {{ $post->published_at->format('d M Y') }}
    </p>

    <div class="prose max-w-none">
        {!! nl2br(e($post->body)) !!}
    </div>

</article>
@endsection`,
    icon: Layout,
  },

  /* ── CH 18: CRUD OPERATIONS ── */
  {
    id: 'L18-S1', chapter: 'crud',
    title: 'Building CRUD Operations', subtitle: 'Create, Read, Update, Delete Web Pages',
    accent: '#f97316',
    bg: 'radial-gradient(ellipse at 50% 20%, rgba(249,115,22,0.15) 0%, transparent 55%)',
    concepts: [
      { label: 'Full CRUD Flow', desc: 'index (list) → show (detail) → create+store (new) → edit+update (modify) → destroy (delete) ！' },
      { label: 'PRG Pattern', desc: 'Post-Redirect-Get ─ after store/update/destroy always redirect ─ prevents duplicate submissions ！' },
      { label: 'Flash Messages', desc: 'return redirect()->with("success","Saved!") ─ @if(session("success")) show banner @endif ！' },
      { label: 'Soft Deletes', desc: 'use SoftDeletes ─ sets deleted_at ─ data preserved ─ $post->restore() if needed ！' },
    ],
    tip: 'Add SoftDeletes to every important Model ─ users accidentally delete things ─ data is precious ！',
    lab: 'Build complete Post CRUD: 7 routes + views (index, create, show, edit) + all Controller methods ！',
    result: 'Full-featured blog CMS: create/read/update/delete posts via browser with validation & flash messages ！',
    filename: 'app/Http/Controllers/PostController.php',
    code: `public function store(Request $request)
{
    $data = $request->validate([
        'title' => 'required|string|max:255',
        'body'  => 'required|string',
        'cover' => 'nullable|image|max:2048',
    ]);

    if ($request->hasFile('cover')) {
        $data['cover'] = $request->file('cover')
                              ->store('covers','public');
    }

    auth()->user()->posts()->create($data);
    return redirect()->route('posts.index')
                     ->with('success','Post published!');
}

public function destroy(Post $post)
{
    $this->authorize('delete', $post);

    if ($post->cover) {
        Storage::disk('public')->delete($post->cover);
    }
    $post->delete(); // Soft delete

    return redirect()->route('posts.index')
                     ->with('success','Post deleted.');
}`,
    icon: Zap,
  },
  {
    id: 'L18-S2', chapter: 'crud',
    title: 'CRUD Forms & Validation UI', subtitle: 'Create & Edit Blade Views',
    accent: '#f97316',
    bg: 'radial-gradient(ellipse at 20% 75%, rgba(249,115,22,0.1) 0%, transparent 55%)',
    concepts: [
      { label: '@method("PATCH")', desc: 'HTML forms only support GET/POST ─ @method("PATCH") spoofs PUT for edit forms ！' },
      { label: '@error directive', desc: '@error("title") ─ renders error message if validation fails ─ per-field errors ！' },
      { label: 'old() helper', desc: 'old("title", $post->title) ─ shows last input on error or existing value on edit ！' },
      { label: 'Flash Success Banner', desc: '@if(session("success")) show green banner @endif ─ in layout, not every page ！' },
    ],
    tip: 'Put flash message display in layouts/app.blade.php ─ works for ALL pages without repeating code ！',
    lab: 'Build create.blade.php + edit.blade.php ─ reuse same form partial ─ @include("posts._form") ！',
    result: 'Post create + edit forms work ─ validation errors shown inline ─ old values preserved ─ PRG pattern ！',
    filename: 'resources/views/posts/_form.blade.php',
    code: `{{-- Reusable form partial: _form.blade.php --}}
<div class="space-y-6">
    <div>
        <label class="block font-medium mb-1">Title</label>
        <input type="text" name="title"
               value="{{ old('title', $post->title ?? '') }}"
               class="w-full border rounded-lg px-4 py-2 
                      @error('title') border-red-500 @enderror">
        @error('title')
            <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
        @enderror
    </div>

    <div>
        <label class="block font-medium mb-1">Content</label>
        <textarea name="body" rows="10" 
                  class="w-full border rounded-lg px-4 py-2">
            {{ old('body', $post->body ?? '') }}
        </textarea>
        @error('body')
            <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
        @enderror
    </div>

    <button type="submit" class="btn btn-primary">Save Post</button>
</div>`,
    icon: Edit3,
  },

  /* ── CH 19: POSTMAN ── */
  {
    id: 'L19-S1', chapter: 'postman',
    title: 'Testing APIs with Postman', subtitle: 'Create, Send & Verify API Requests',
    accent: '#06b6d4',
    bg: 'radial-gradient(ellipse at 60% 40%, rgba(6,182,212,0.15) 0%, transparent 55%)',
    concepts: [
      { label: 'Collections', desc: 'Group API requests by resource (Posts, Users, Auth) ─ share with team ─ version control ！' },
      { label: 'Headers', desc: 'Content-Type: application/json ─ Accept: application/json ─ Authorization: Bearer token ！' },
      { label: 'Request Body', desc: 'raw → JSON tab ─ type {"title":"..."} ─ POST/PUT requests use body ！' },
      { label: 'Environment Variables', desc: '{{BASE_URL}}, {{AUTH_TOKEN}} ─ switch dev/staging/production in one click ！' },
    ],
    tip: 'Add Accept: application/json header ─ Laravel returns JSON errors instead of HTML redirect ！',
    lab: 'Test your Blog API: GET /api/posts → POST /api/posts → PATCH /api/posts/1 → DELETE ─ verify each ！',
    result: 'Complete Postman collection with Auth + CRUD tests ─ all 200/201/204/422 responses verified ！',
    filename: 'postman-test-script.js',
    code: `// Postman Test Scripts (Tests tab)

// ─── Test: GET /api/posts ───────────────────
pm.test("Status 200", () => {
    pm.response.to.have.status(200);
});
pm.test("Has data array", () => {
    const body = pm.response.json();
    pm.expect(body).to.have.property('data');
    pm.expect(body.data).to.be.an('array');
});

// ─── Test: POST /api/posts ──────────────────
pm.test("Status 201 Created", () => {
    pm.response.to.have.status(201);
});
pm.test("Returns new post id", () => {
    const post = pm.response.json().data;
    pm.expect(post.id).to.be.a('number');
    pm.environment.set("POST_ID", post.id); // Save for next test
});

// ─── Pre-request: Set Auth Token ────────────
pm.request.headers.add({
    key: 'Authorization',
    value: 'Bearer ' + pm.environment.get('AUTH_TOKEN')
});`,
    icon: Send,
  },
  {
    id: 'L19-S2', chapter: 'postman',
    title: 'Sanctum Token Auth in Postman', subtitle: 'Authenticating API Requests',
    accent: '#06b6d4',
    bg: 'radial-gradient(ellipse at 30% 80%, rgba(6,182,212,0.1) 0%, transparent 55%)',
    concepts: [
      { label: 'Login to Get Token', desc: 'POST /api/login → receives plaintext token ─ copy to Authorization: Bearer in Postman ！' },
      { label: 'auth:sanctum Guard', desc: 'Route::middleware("auth:sanctum") ─ validates Bearer token ─ 401 if missing/expired ！' },
      { label: 'Token Management', desc: '$user->tokens()->delete() ─ logout from all devices ─ token revocation ！' },
      { label: '422 Validation Errors', desc: 'Accept: application/json ─ Laravel returns field errors as JSON, not redirect HTML ！' },
    ],
    tip: 'In Postman Collection: set Authorization = Bearer Token ─ use {{AUTH_TOKEN}} variable ─ inherit to all requests ！',
    lab: 'POST to /api/login ─ copy token from response ─ use in Bearer header ─ access GET /api/user ！',
    result: 'With token: 200 user data. Without token: 401 Unauthorized. Validation error: 422 with field details ！',
    filename: 'routes/api.php',
    code: `<?php
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PostController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Protected routes (require Bearer token)
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', fn($req) => $req->user());
    Route::post('/logout', [AuthController::class, 'logout']);

    // Blog API
    Route::apiResource('posts', PostController::class);

    // User posts
    Route::get('/my-posts', [PostController::class, 'myPosts']);
});

// In AuthController:
// public function login(Request $request) {
//     ...validate credentials...
//     $token = $user->createToken('web-app')->plainTextToken;
//     return response()->json(['token' => $token]);
// }`,
    icon: Lock,
  },

  {
    id: 'L19-S3', chapter: 'postman',
    title: 'HTTP Status Codes', subtitle: 'ស្វែងយល់ពី API Response Codes',
    accent: '#06b6d4',
    bg: 'radial-gradient(ellipse at 50% 50%, rgba(6,182,212,0.12) 0%, transparent 55%)',
    concepts: [
      { label: '200 OK & 201 Created', desc: '200: សំណើជោគជ័យ។ 201: បង្កើត Resource ថ្មីបានជោគជ័យ (ជាទូទៅក្រោយ POST) ！' },
      { label: '204 No Content', desc: 'សំណើជោគជ័យ តែមិនត្រលប់ទិន្នន័យ (ប្រើក្រោយពេល DELETE ជោគជ័យ) ！' },
      { label: '401 & 403 Errors', desc: '401 Unauthorized (មិនទាន់ Login) vs 403 Forbidden (គ្មានសិទ្ធិចូល Resource នេះ) ！' },
      { label: '404 & 422 Errors', desc: '404 Not Found (រកមិនឃើញ URL/ID) vs 422 Validation Error (ទិន្នន័យ Form មិនត្រឹមត្រូវ) ！' },
    ],
    tip: 'ប្រើ response()->json($data, 201) ដើម្បីកំណត់ status code ─ ឬ abort(403) សម្រាប់ឆែក permission លឿន ！',
    lab: 'តេស្ត manual status codes: បង្កើត route ដែល return 201 សម្រាប់ POST ─ បន្ទាប់មកសាក trigger 404 និង 422 ក្នុង Postman ！',
    result: 'យល់ច្បាស់ពីការប្រើប្រាស់ Status Code នីមួយៗ ─ ធ្វើឲ្យ API មានលក្ខណៈស្ដង់ដារ និងងាយស្រួលយល់ ！',
    filename: 'app/Http/Controllers/Api/PostController.php',
    code: `<?php

// ─── 1. Successful Responses ───────────────
return response()->json($post, 201); // 201: បង្កើតបានជោគជ័យ
return response()->noContent();      // 204: ជោគជ័យ តែគ្មាន content

// ─── 2. Client Errors (4xx) ────────────────
if (!$post) {
    return response()->json(['error' => 'Not Found'], 404);
}

// ─── 3. Shortcut: abort() ──────────────────
if ($user->cannot('update', $post)) {
    abort(403, 'You do not own this post.'); // 403: គ្មានសិទ្ធិ
}

// ─── 4. Automatic: Validation ────────────
$request->validate([...]); // Laravel នឹង return 422 ដោយស្វ័យប្រវត្តបើខុស`,
    icon: Activity,
  },

  /* ── CH 20: AUTH WITH PASSPORT / JWT ── */
  {
    id: 'L20-S1', chapter: 'auth',
    title: 'Authentication Overview', subtitle: 'Passport vs JWT vs Sanctum for Web Apps',
    accent: '#a855f7',
    bg: 'radial-gradient(ellipse at 20% 20%, rgba(168,85,247,0.15) 0%, transparent 55%)',
    concepts: [
      { label: 'Sanctum', desc: 'Session auth for web (Blade), Token auth for SPA/mobile ─ simple, lightweight, 90% of apps ！' },
      { label: 'Passport', desc: 'Full OAuth2 server ─ issue tokens to third-party clients ─ complex but powerful ！' },
      { label: 'JWT (tymon/jwt-auth)', desc: 'Stateless JSON Web Tokens ─ self-contained, no DB lookup ─ microservices/mobile APIs ！' },
      { label: 'Laravel Breeze/Jetstream', desc: 'Starter kits: Breeze (simple) Jetstream (full-featured) ─ auth scaffolding in minutes ！' },
    ],
    tip: 'Start with Sanctum + Breeze for web apps ─ upgrade to Passport only for OAuth2 provider role ！',
    lab: 'Install Breeze: composer require laravel/breeze ─ php artisan breeze:install ─ test register/login ！',
    result: 'Full web auth: register, login, logout, forgot password, email verify ─ all pages generated ！',
    filename: 'terminal',
    code: `# Option A: Laravel Breeze (recommended for most web apps)
composer require laravel/breeze --dev
php artisan breeze:install blade   # Blade + Tailwind
php artisan migrate
npm install && npm run dev
# → /login, /register, /dashboard all ready!

# Option B: Laravel Passport (OAuth2 server)
composer require laravel/passport
php artisan passport:install
# → Full OAuth2: authorize, token, refresh endpoints

# Option C: JWT via tymon/jwt-auth
composer require tymon/jwt-auth
php artisan vendor:publish --provider="Tymon\JWTAuth\..."
php artisan jwt:secret
# → Stateless JWT tokens for APIs`,
    terminal: 'php artisan breeze:install blade',
    terminalOutput: '   INFO  Breeze scaffolding installed successfully.\n   Please run: php artisan migrate\n              npm install && npm run dev',
    icon: Fingerprint,
  },
  {
    id: 'L20-S2', chapter: 'auth',
    title: 'JWT Authentication', subtitle: 'Stateless Token Auth for Web APIs',
    accent: '#a855f7',
    bg: 'radial-gradient(ellipse at 80% 70%, rgba(168,85,247,0.12) 0%, transparent 55%)',
    concepts: [
      { label: 'JWT Structure', desc: 'Header.Payload.Signature ─ Base64 encoded ─ carries user info inside ─ server verifies signature ！' },
      { label: 'Stateless Advantage', desc: 'No session storage ─ scales horizontally ─ works across multiple servers ─ great for APIs ！' },
      { label: 'Token Expiry (TTL)', desc: 'Tokens expire after TTL minutes ─ client sends refresh request ─ get new token ！' },
      { label: 'auth:api Guard', desc: 'config/auth.php: api guard driver = "jwt" ─ use auth("api")->user() in controllers ！' },
    ],
    tip: 'Store JWT in httpOnly cookie (not localStorage) ─ prevents XSS attacks stealing the token ！',
    lab: 'Build JWT auth API: POST /api/login → token ─ protected GET /api/profile ─ test all in Postman ！',
    result: 'Stateless API authentication: login → JWT token → send as Bearer → access protected web API ！',
    filename: 'app/Http/Controllers/Api/AuthController.php',
    code: `<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => auth('api')->factory()->getTTL() * 60,
            'user'         => auth('api')->user(),
        ]);
    }

    public function me()
    {
        return response()->json(auth('api')->user());
    }

    public function refresh()
    {
        return response()->json([
            'access_token' => auth('api')->refresh(),
            'token_type'   => 'bearer',
        ]);
    }

    public function logout()
    {
        auth('api')->logout();
        return response()->json(['message' => 'Logged out']);
    }
}`,
    icon: Key,
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
    const parts = line.split(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\$[a-zA-Z_]\w*|\b\d+(?:\.\d+)?\b|\b[a-zA-Z_]\w*\b)/g);
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
      <div className="flex items-center justify-between px-4 py-2 bg-[#0d1117] border-b border-white/5 flex-none">
        <div className="flex items-center gap-1 p-1 bg-black/40 rounded-xl border border-white/5">
          {(['code', 'terminal'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${tab === t ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>
              {t === 'code' ? <Code2 className="w-3 h-3" /> : <Terminal className="w-3 h-3" />}
              {t === 'code' ? 'Code' : 'Terminal'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={async () => { setTab('terminal'); setRunning(true); await new Promise(r => setTimeout(r, 800)); setRunning(false); }}
            disabled={running}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${running ? 'bg-zinc-800 text-zinc-500' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}>
            <Play className={`w-3 h-3 ${running ? 'animate-pulse' : ''}`} />
            {running ? 'កំពុងដំណើរការ...' : 'ដំណើរការ'}
          </button>
          <button onClick={() => { setCode(initialCode); setOutput(initialOutput); }}
            className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-white/5 transition-all">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button onClick={copy}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${copied ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'}`}>
            {copied ? <><Check className="w-3 h-3" />បានចម្លង</> : <><Copy className="w-3 h-3" />ចម្លង</>}
          </button>
        </div>
      </div>
      <div className="flex items-center gap-3 px-4 py-2 bg-[#0d1117]/60 border-b border-white/5 flex-none">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/40" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]/40" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]/40" />
        </div>
        <div className="flex items-center gap-2 bg-white/5 rounded-lg px-2.5 py-1">
          <FileCode className="w-3 h-3" style={{ color: accent }} />
          <span className="text-[10px] font-mono text-zinc-400">{tab === 'code' ? filename : 'bash — terminal'}</span>
        </div>
      </div>
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
              <span className="text-blue-400">~/my-blog</span>
              <span className="text-zinc-600 font-bold">$</span>
              <span className="text-zinc-200">{terminal || 'php artisan serve'}</span>
            </div>
            {output
              ? <pre className="text-zinc-200 whitespace-pre-wrap">{output}</pre>
              : <div className="text-zinc-600 animate-pulse">No output yet. Click ដំណើរការ to run.</div>
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

  const displayPages = useMemo(() => {
    const filtered = slides.filter(s => s.chapter === chapterParam);
    const result: DisplayPage[] = [];
    filtered.forEach(s => {
      result.push({ ...s, subType: 'concept' });
      if (s.variables && s.variables.length > 0) {
        result.push({ ...s, subType: 'variables' });
      }
      result.push({ ...s, subType: 'lab' });
    });
    return result.length > 0 ? result : [{ ...slides[0], subType: 'concept' }];
  }, [chapterParam]);

  const slideParam = searchParams.get('slide');
  const initialSlide = slideParam ? Math.max(0, Math.min(parseInt(slideParam) - 1, displayPages.length - 1)) : 0;

  const [current, setCurrent] = useState(initialSlide);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [dir, setDir] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const s = slideParam ? parseInt(slideParam) - 1 : 0;
    if (s !== current) {
      setCurrent(Math.max(0, Math.min(s, displayPages.length - 1)));
    }
  }, [chapterParam, slideParam, displayPages.length]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const newSlideStr = current === 0 ? null : String(current + 1);
    
    if (params.get('slide') !== newSlideStr) {
      if (newSlideStr === null) params.delete('slide');
      else params.set('slide', newSlideStr);
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [current, router, searchParams]);

  useEffect(() => {
    const saved = localStorage.getItem('laravel_notes_v3');
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  const slide = displayPages[current];
  const Icon = slide.icon;
  const progress = ((current + 1) / displayPages.length) * 100;
  const chapterInfo = CHAPTERS.find(c => c.id === slide.chapter)!;

  const saveNote = (val: string) => {
    const next = { ...notes, [slide.id]: val };
    setNotes(next);
    localStorage.setItem('laravel_notes_v3', JSON.stringify(next));
  };

  const goTo = useCallback((idx: number, d: number) => {
    if (isAnimating) return;
    setDir(d); setIsAnimating(true);
    setTimeout(() => { setCurrent(idx); setIsAnimating(false); }, 280);
  }, [isAnimating]);

  const next = useCallback(() => {
    if (current < displayPages.length - 1) { goTo(current + 1, 1); return; }
    const ci = CHAPTERS.findIndex(c => c.id === chapterParam);
    if (ci < CHAPTERS.length - 1) { setDir(1); router.push(`?chapter=${CHAPTERS[ci + 1].id}`); }
  }, [current, displayPages.length, chapterParam, goTo, router]);

  const prev = useCallback(() => {
    if (current > 0) { goTo(current - 1, -1); return; }
    const ci = CHAPTERS.findIndex(c => c.id === chapterParam);
    if (ci > 0) {
      setDir(-1);
      const prevCh = CHAPTERS[ci - 1];
      const prevSlidesCnt = slides.filter(s => s.chapter === prevCh.id).length * 2; // Approximate count
      router.push(`?chapter=${prevCh.id}&slide=${prevSlidesCnt}`);
    }
  }, [current, chapterParam, goTo, router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  const variants = {
    enter: (d: number) => ({ y: d * 30, opacity: 0, scale: 0.98 }),
    center: { y: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ y: d * -30, opacity: 0, scale: 0.98 }),
  };

  return (
    <div className="min-h-screen text-white flex flex-col overflow-hidden"
      style={{ background: '#07090f', fontFamily: "'Inter','DM Sans',system-ui,sans-serif" }}>
      <div className="fixed inset-0 pointer-events-none transition-all duration-700" style={{ background: slide.bg }} />
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(168,85,247,0.04) 0%, transparent 60%)' }} />

      {/* ── HEADER ── */}
      <div className="relative z-[60] border-b border-white/5 bg-black/60 backdrop-blur-2xl custom-header">
        <div className="max-w-[1800px] mx-auto w-full flex items-center justify-between px-6 lg:px-14 py-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/courses/backend"
              className="group flex items-center gap-3 px-3 sm:px-4 h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all active:scale-95 shadow-xl">
              <ArrowLeft className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-white transition-colors hidden lg:block">ចាកចេញ</span>
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="group flex items-center gap-3 sm:gap-4 px-4 sm:px-5 h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/12 hover:border-white/30 transition-all active:scale-95 shadow-2xl overflow-hidden max-w-[200px] sm:max-w-none">
              <div className={`w-7 h-7 rounded-lg flex-none flex items-center justify-center transition-all duration-300 ${isMenuOpen ? 'bg-white text-black' : 'bg-black/40 text-zinc-400 group-hover:text-white'}`}>
                <AnimatePresence mode="wait">
                  {isMenuOpen
                    ? <motion.div key="x" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }}><X className="w-3.5 h-3.5" /></motion.div>
                    : <motion.div key="menu" initial={{ scale: 0, rotate: 90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: -90 }}><Menu className="w-3.5 h-3.5" /></motion.div>
                  }
                </AnimatePresence>
              </div>
              <div className="flex flex-col items-start leading-tight overflow-hidden">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 hidden sm:block">ផែនទីមេរៀន</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white tracking-tight truncate">{chapterInfo.label}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-zinc-600 flex-none transition-transform duration-500 ${isMenuOpen ? 'rotate-180 text-white' : ''}`} />
                </div>
              </div>
            </button>
          </div>
          <div className="flex items-center gap-3 sm:gap-8">
            <div className="hidden sm:flex flex-col items-end gap-1.5 min-w-[100px] md:min-w-[140px]">
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="text-zinc-500 uppercase tracking-widest font-black hidden lg:block">ភាពស្ទាត់ជំនាញ</span>
                <span className="text-white font-black bg-white/10 px-1.5 py-0.5 rounded-md">{Math.round(progress)}%</span>
              </div>
              <div className="w-24 md:w-44 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                  className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                  style={{ background: chapterInfo.color }} />
              </div>
            </div>
            <div className="h-10 w-px bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-1.5 sm:gap-3">
              <button onClick={prev} className="w-10 h-10 rounded-xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all active:scale-90 border border-white/5 flex items-center justify-center">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex flex-col items-center min-w-[40px] sm:min-w-[45px]">
                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-tighter mb-0.5 hidden xs:block">ស្លាយ</span>
                <span className="text-sm font-mono text-zinc-500 flex items-center gap-1 leading-none">
                  <span className="text-white font-bold">{current + 1}</span>
                  <span className="text-zinc-800">/</span>
                  <span>{displayPages.length}</span>
                </span>
              </div>
              <button onClick={next} className="w-10 h-10 rounded-xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all active:scale-90 border border-white/5 flex items-center justify-center">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── CHAPTER MENU ── */}
      <AnimatePresence mode="wait">
        {isMenuOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-10 pointer-events-none">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-md pointer-events-auto" />
            <motion.div
              initial={{ y: 30, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.98 }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="relative w-full max-w-5xl max-h-full bg-[#0d1117] border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] flex flex-col pointer-events-auto overflow-hidden">
              <div className="flex-1 overflow-y-auto px-6 py-8 sm:p-12 scrollbar-none">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {CHAPTERS.map((ch, i) => {
                    const isActive = ch.id === chapterParam;
                    return (
                      <button key={ch.id}
                        onClick={() => {
                          const params = new URLSearchParams();
                          params.set('chapter', ch.id);
                          router.push(`?${params.toString()}`);
                          setCurrent(0);
                          setIsMenuOpen(false);
                        }}
                        className={`group relative flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 border ${isActive ? 'bg-white/5 border-white/20 shadow-xl' : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/10 hover:-translate-y-1'}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-all duration-500 overflow-hidden flex-none ${isActive ? 'scale-110 shadow-2xl' : 'opacity-60 group-hover:opacity-100'}`}
                          style={{ background: isActive ? ch.color : `${ch.color}25`, color: isActive ? '#000' : ch.color, border: isActive ? 'none' : `1.5px solid ${ch.color}40` }}>
                          {String(i + 1).padStart(2, '0')}
                        </div>
                        <div className="flex flex-col items-start leading-snug overflow-hidden text-left">
                          {isActive && <span className="text-[7px] font-black px-1.5 py-0.5 rounded bg-white text-black uppercase tracking-tighter mb-1">បច្ចុប្បន្ន</span>}
                          <span className={`text-xs font-bold tracking-tight transition-all truncate w-full ${isActive ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                            {ch.label.split(' · ')[1] || ch.label}
                          </span>
                        </div>
                        {isActive && <div className="ml-auto w-2 h-2 rounded-full animate-pulse flex-none" style={{ background: ch.color }} />}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex-none p-6 sm:px-12 sm:py-6 bg-black/20 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">20 Chapters · Laravel Web Application Development</div>
                <div className="text-[10px] font-mono text-zinc-600 bg-white/5 px-3 py-1 rounded-lg border border-white/5 uppercase tracking-tighter">FULLSTACK ACADEMY · LARAVEL 11</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MAIN LAYOUT ── */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row overflow-hidden max-w-[1800px] mx-auto w-full">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={`left-${current}`} custom={dir} variants={variants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="flex-none lg:w-[45%] flex flex-col p-8 lg:p-14 xl:p-20 lg:border-r border-white/6 overflow-y-auto gap-8">

            {/* Title */}
            <div className="flex items-center gap-6 mb-4">
              <div className="w-16 h-16 rounded-[1.25rem] flex items-center justify-center flex-none border border-white/10 shadow-2xl"
                style={{ background: `${slide.accent}15` }}>
                <Icon className="w-8 h-8" style={{ color: slide.accent }} />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] px-2.5 py-1 rounded-lg border shadow-sm"
                    style={{ color: chapterInfo.color, borderColor: `${chapterInfo.color}30`, background: `${chapterInfo.color}10` }}>
                    {chapterInfo.label}
                  </span>
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/5">
                    <div className={`w-1.5 h-1.5 rounded-full ${slide.subType === 'concept' ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`} />
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                      {slide.subType === 'concept' ? 'ទ្រឹស្តី' : 'ការអនុវត្ត'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-zinc-600 tracking-tighter ml-auto">{slide.id}</span>
                </div>
                <h1 className="text-4xl xl:text-5xl font-black leading-none text-white tracking-tight">{slide.title}</h1>
                <p className="text-[12px] text-white/30 font-black uppercase tracking-[0.3em] mt-1">{slide.subtitle}</p>
              </div>
            </div>

            {/* Content */}
            {slide.subType === 'concept' ? (
              <div className="grid grid-cols-1 gap-4">
                {slide.concepts.map((c, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className="rounded-2xl border p-8 flex flex-col gap-4 hover:bg-white/[0.02] transition-all hover:shadow-2xl"
                    style={{ borderColor: `${slide.accent}20`, background: `${slide.accent}05` }}>
                    <span className="text-[12px] font-black uppercase tracking-[0.2em] opacity-80" style={{ color: slide.accent }}>{c.label}</span>
                    <p className="text-xl text-zinc-300 leading-relaxed font-medium">{c.desc}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="rounded-2xl border p-6 flex gap-4 shadow-sm"
                  style={{ background: `${slide.accent}08`, borderColor: `${slide.accent}20` }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-none border"
                    style={{ background: `${slide.accent}15`, borderColor: `${slide.accent}25` }}>
                    <Play className="w-5 h-5" style={{ color: slide.accent }} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-2 opacity-70" style={{ color: slide.accent }}>គោលបំណង</p>
                    <p className="text-[18px] text-white font-bold leading-relaxed">{slide.lab}</p>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                  className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 flex gap-4 shadow-inner">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-none border border-amber-500/20">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">PRO TIP</span>
                    <p className="text-[15px] text-amber-200/90 leading-relaxed font-medium italic">« {slide.tip} »</p>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 flex gap-4 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-none border border-emerald-500/20">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-2 text-emerald-400 opacity-70">លទ្ធផលរំពឹងទុក</p>
                    <p className="text-[16px] text-white font-bold leading-relaxed">{slide.result}</p>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Nav */}
            <div className="flex items-center gap-4 mt-8 pt-4 border-t border-white/5">
              <button onClick={prev}
                className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center group shadow-xl">
                <ChevronLeft className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors" />
              </button>
              <button onClick={next}
                className="flex-1 h-14 rounded-2xl font-black text-[13px] uppercase tracking-[0.2em] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] group overflow-hidden relative"
                style={{ background: slide.accent, color: '#000' }}>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                <span className="relative z-10">{current === displayPages.length - 1 ? 'បញ្ចប់មេរៀន' : 'ស្លាយបន្ទាប់'}</span>
                <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => setShowNotes(!showNotes)}
                className={`w-14 h-14 rounded-2xl border transition-all shadow-xl flex items-center justify-center ${showNotes ? 'bg-amber-500/20 border-amber-500/40 text-amber-500' : 'bg-white/5 border-white/10 text-zinc-500 hover:text-white hover:border-white/20'}`}>
                <StickyNote className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* RIGHT — Code */}
        <div className="flex-none lg:w-[55%] flex flex-col p-4 lg:p-8 xl:p-10 gap-4 overflow-hidden">
          <div className="flex items-center gap-2 flex-none">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/8 bg-white/5"
              style={{ color: slide.accent }}>
              <Terminal className="w-3.5 h-3.5" />
              Interactive Code Editor
            </div>
            <div className="ml-auto text-[10px] font-mono text-zinc-700 hidden sm:block">← → Navigate</div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={`code-${current}`}
              initial={{ opacity: 0, scale: 0.99, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.99, y: -8 }}
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              className="flex-1 overflow-hidden">
              {slide.subType === 'lab' ? (
                <CodePanel
                  code={slide.code}
                  terminal={slide.terminal}
                  terminalOutput={slide.terminalOutput}
                  accent={slide.accent}
                  filename={slide.filename}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white/[0.02] border border-white/5 rounded-3xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="w-32 h-32 rounded-full flex items-center justify-center mb-8 relative"
                    style={{ background: `${slide.accent}10` }}>
                    <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: slide.accent }} />
                    <Icon className="w-16 h-16 relative z-10" style={{ color: slide.accent }} />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4 tracking-tight">ការរៀនទ្រឹស្តី</h3>
                  <p className="text-zinc-500 max-w-sm leading-relaxed font-medium italic">
                    « ស្វែងយល់ concept ជាមុន ─ Code editor ពេញ​លេញ​នឹង​ស្ថិត​ក្នុង​ស្លាយ​អនុវត្ត​ »
                  </p>
                </div>
              )}
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
                <h3 className="text-sm font-black uppercase tracking-widest text-amber-400">កំណត់ចំណាំ</h3>
                <p className="text-[10px] text-zinc-600 font-bold uppercase mt-0.5">{slide.id} · {slide.title}</p>
              </div>
              <button onClick={() => setShowNotes(false)} className="text-zinc-600 hover:text-white transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <textarea autoFocus
              value={notes[slide.id] || ''}
              onChange={e => saveNote(e.target.value)}
              placeholder="កត់ត្រានៅទីនេះ... (រក្សាទុកដោយស្វ័យប្រវត្តិ)"
              className="flex-1 w-full bg-black/40 rounded-xl p-4 text-sm text-zinc-300 resize-none outline-none border border-white/5 focus:border-amber-500/30 transition-all placeholder:text-zinc-700 font-mono"
            />
            <p className="mt-4 text-[10px] text-zinc-700 font-bold uppercase leading-relaxed">
              Auto-saved to localStorage per slide
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}