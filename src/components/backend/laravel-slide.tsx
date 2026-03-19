"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Menu, X, ChevronDown, ArrowLeft,
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
  {
    id: 'L01-S3', chapter: 'setup',
    title: 'Artisan CLI', subtitle: 'The Developer Workflow',
    accent: '#f43f5e',
    bg: 'radial-gradient(ellipse at 50% 50%, rgba(244,63,94,0.1) 0%, transparent 60%)',
    concepts: [
      { label: 'php artisan', desc: 'The command-line interface included with Laravel.' },
      { label: 'Scaffolding', desc: 'Generate models, controllers, and migrations in seconds.' },
      { label: 'Maintenance', desc: 'Commands for clearing cache, running tasks, and migrations.' },
      { label: 'Tinker', desc: 'A REPL for interacting with your DB and models in real-time.' },
    ],
    tip: 'Run "php artisan list" to see the hundreds of powerful tools available.',
    lab: 'Open your terminal and run "php artisan tinker", then type "1 + 1".',
    result: 'The REPL returns "2", confirming Artisan is live.',
    filename: 'artisan.sh',
    code: `# Create a new model + migration + controller
php artisan make:model Task -mc

# List all your apps routes
php artisan route:list

# Launch the interactive logic shell
php artisan tinker`,
    terminal: 'php artisan list',
    terminalOutput: '   Laravel Framework 11.0.0\n   Usage: command [options] [arguments]',
    icon: Terminal,
  },
  {
    id: 'L01-S4', chapter: 'setup',
    title: 'Configuration', subtitle: 'Dotenv & App Keys',
    accent: '#f43f5e',
    bg: 'radial-gradient(ellipse at center, rgba(244,63,94,0.08) 0%, transparent 70%)',
    concepts: [
      { label: '.env File', desc: 'Stores sensitive data like DB passwords and API keys (never git push it!).' },
      { label: '.env.example', desc: 'A template for teammates to fill in their own local settings.' },
      { label: 'App Key', desc: 'A unique 32-char string used for cryptographically secure data.' },
      { label: 'config/', desc: 'PHP files that read from .env for app-wide settings.' },
    ],
    tip: 'If your site shows a decrypted error, run php artisan key:generate.',
    lab: 'Open your .env file and change DB_DATABASE to "academy_db".',
    result: 'The application is now configured to look for the "academy_db" database.',
    filename: '.env',
    code: `APP_NAME=Laravel
APP_ENV=local
APP_KEY=base64:Abc123...
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306`,
    icon: Key,
  },

  /* ── CHAPTER 2: ROUTING & CONTROLLERS ── */
  {
    id: 'L02-S1', chapter: 'routing',
    title: 'Route Engine', subtitle: 'Binding URLs to Logic',
    accent: '#f97316',
    bg: 'radial-gradient(ellipse at 30% 50%, rgba(249,115,22,0.15) 0%, transparent 60%)',
    concepts: [
      { label: 'Static Routes', desc: 'Direct URL to view or callback (e.g. /about).' },
      { label: 'Route Params', desc: 'Dynamic segments like /user/{id} for fetching data.' },
      { label: 'Named Routes', desc: 'Use route("home") in code to prevent broken links.' },
      { label: 'Grouping', desc: 'Apply common prefixes or auth middleware to many routes.' },
    ],
    tip: 'Always name your routes using ->name("..."). It makes your URLs portable.',
    lab: 'Create a route /hello/{name} that returns a friendly greeting back.',
    result: 'Visiting /hello/ari returns "Hello, ari" in the browser.',
    filename: 'routes/web.php',
    code: `<?php
    
use Illuminate\\Support\\Facades\\Route;

Route::get('/', fn() => view('welcome'));

// Parameters with a name
Route::get('/user/{id}', function ($id) {
    return "Profile: $id";
})->name('user.profile');`,
    icon: Globe,
  },
  {
    id: 'L02-S2', chapter: 'routing',
    title: 'Controllers', subtitle: 'The Brain of the Ops',
    accent: '#f97316',
    bg: 'radial-gradient(ellipse at 70% 40%, rgba(249,115,22,0.12) 0%, transparent 55%)',
    concepts: [
      { label: 'make:controller', desc: 'Scaffold a new class in app/Http/Controllers.' },
      { label: 'Methods', desc: 'Think of methods as "Actions" (e.g., list, save, delete).' },
      { label: 'Namespacing', desc: 'Keeps your logic organized and prevents name clashes.' },
      { label: 'Return types', desc: 'Controllers should return a view(), redirect(), or json().' },
    ],
    tip: 'Keep your web.php clean. 100% of your logic belongs in Controllers.',
    lab: 'Generate a ProjectController and write an "index" method that returns a view.',
    result: 'A new controller is created and wired to a route successfully.',
    filename: 'app/Http/Controllers/ProjectController.php',
    code: `<?php

namespace App\\Http\\Controllers;

class ProjectController extends Controller {
    public function index() {
        return view('projects.index');
    }
}`,
    terminal: 'php artisan make:controller ProjectController',
    terminalOutput: '   INFO  Controller created successfully.',
    icon: Server,
  },
  {
    id: 'L02-S3', chapter: 'routing',
    title: 'Route-Model Binding', subtitle: 'The Ultimate Shortcut',
    accent: '#f97316',
    bg: 'radial-gradient(ellipse at center, rgba(249,115,22,0.08) 0%, transparent 70%)',
    concepts: [
      { label: 'Implicit Binding', desc: 'Laravel automatically fetches the DB record if the param matches the model name.' },
      { label: 'IDs', desc: 'By default, Laravel looks for the "id" column.' },
      { label: 'Keys', desc: 'You can change the binding key to "slug" for SEO friendly URLs.' },
      { label: '404 Handling', desc: 'Laravel automatically shows a 404 page if the record is missing.' },
    ],
    tip: 'Using (User $user) as a type-hint replaces "User::findOrFail($id)".',
    lab: 'Modify a route to use implicit model binding for a "Task" model.',
    result: 'Code is shorter, cleaner, and handles missing data automatically.',
    filename: 'routes/web.php',
    code: `use App\\Models\\Task;

// Laravel fetches the Task from DB for you!
Route::get('/tasks/{task}', function (Task $task) {
    return $task->title;
});`,
    icon: Zap,
  },
  {
    id: 'L02-S4', chapter: 'routing',
    title: 'Middleware Intro', subtitle: 'The Gatekeeper',
    accent: '#f97316',
    bg: 'radial-gradient(ellipse at 10% 80%, rgba(249,115,22,0.06) 0%, transparent 60%)',
    concepts: [
      { label: 'Filters', desc: 'Middleware layers that code passes through before reaching the controller.' },
      { label: 'Verification', desc: 'Used for Auth, CSRF, and verifying if a user is an Admin.' },
      { label: 'Global vs Route', desc: 'Run on every request, or only on specific sensitive URLs.' },
      { label: 'Chaining', desc: 'Apply multiple guards using ->middleware(["auth", "verified"]).' },
    ],
    tip: 'Think of middleware as a security airport scanner: keep the bad out, let the good in.',
    lab: 'Lock a route so that only logged-in users can reach it.',
    result: 'Unauthorized users are kicked back to the login page.',
    filename: 'routes/web.php',
    code: `Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth']);`,
    icon: Lock,
  },

  /* ── CHAPTER 3: BLADE TEMPLATING ── */
  {
    id: 'L03-S1', chapter: 'blade',
    title: 'Blade Engine', subtitle: 'Elegant PHP Views',
    accent: '#22c55e',
    bg: 'radial-gradient(ellipse at 20% 60%, rgba(34,197,94,0.15) 0%, transparent 55%)',
    concepts: [
      { label: 'Echoing', desc: 'Use {{ $variable }} to print escaped data safely.' },
      { label: 'Logic', desc: '@if, @foreach, @empty - simplified control structures.' },
      { label: 'Shortcuts', desc: '@isset and @auth for quick conditional checks.' },
      { label: 'Security', desc: '@csrf generates hidden keys for form protection automatically.' },
    ],
    tip: 'Laravel escapes all {{ }} content by default. Use {!! !!} only for trusted HTML strings.',
    lab: 'Create a page that displays "Welcome" only if the user is authenticated.',
    result: 'User sees dynamic content based on their status.',
    filename: 'home.blade.php',
    code: `@auth
    <h1>Welcome, {{ Auth::user()->name }}</h1>
@else
    <h1>Please Login</h1>
@endauth`,
    icon: Layout,
  },
  {
    id: 'L03-S2', chapter: 'blade',
    title: 'Template Inheritance', subtitle: 'Master Layouts',
    accent: '#22c55e',
    bg: 'radial-gradient(ellipse at 80% 20%, rgba(34,197,94,0.12) 0%, transparent 55%)',
    concepts: [
      { label: '@extends', desc: 'A child page inherits the skeleton of a master parent view.' },
      { label: '@yield', desc: 'The parent defines a "hole" where child content will go.' },
      { label: '@section', desc: 'The child fills that "hole" with its specific HTML.' },
      { label: '@include', desc: 'Pull in small snippets like navigation or footers into any page.' },
    ],
    tip: 'Layouts make maintenance easy. Change your navbar once, and it updates everywhere!',
    lab: 'Create a "layout.blade.php" and extend it in a "contact.blade.php" page.',
    result: 'Contact page shows the site header and footer from the layout.',
    filename: 'resources/views/contact.blade.php',
    code: `@extends('layouts.app')

@section('content')
    <p>Contact us at support@app.com</p>
@endsection`,
    icon: Box,
  },
  {
    id: 'L03-S3', chapter: 'blade',
    title: 'Blade Components', subtitle: 'Modular UI Design',
    accent: '#22c55e',
    bg: 'radial-gradient(ellipse at center, rgba(34,197,94,0.08) 0%, transparent 70%)',
    concepts: [
      { label: 'Tags', desc: 'Use <x-name /> syntax for clean, reusable UI elements.' },
      { label: 'Slots', desc: 'Define where extra HTML goes inside your component.' },
      { label: 'Attributes', desc: 'Pass data or CSS classes down as standard HTML attributes.' },
      { label: 'Reusability', desc: 'Build once: Button, Input, Modal, Alert — use everywhere.' },
    ],
    tip: 'Components are modern. Use them for your design system elements.',
    lab: 'Build a reusable "Alert" component that accepts a "type" (success/error).',
    result: 'Clean, beautiful alert banners rendered from one file.',
    filename: 'views/components/alert.blade.php',
    code: `<div class="p-4 rounded {{ $type == 'error' ? 'bg-red-500' : 'bg-green-500' }}">
    {{ $slot }}
</div>

<!-- Usage -->
<x-alert type="success">Mission Accomplished!</x-alert>`,
    icon: Box,
  },
  {
    id: 'L03-S4', chapter: 'blade',
    title: 'Stacks & Pushes', subtitle: 'Dynamic Asset Loading',
    accent: '#22c55e',
    bg: 'radial-gradient(ellipse at 10% 80%, rgba(34,197,94,0.06) 0%, transparent 60%)',
    concepts: [
      { label: '@stack', desc: 'Place a placeholder in your layout for scripts/styles.' },
      { label: '@push', desc: 'Send code from a specific page into that layout stack.' },
      { label: 'Conditional Loading', desc: 'Only load map scripts on the "Location" page.' },
      { label: 'Efficiency', desc: 'Keeps your JS bundle small by only loading what is needed.' },
    ],
    tip: 'Use Stacks to keep your footer tidy. No more messy <script> tags everywhere!',
    lab: 'Push a specific JS "alert" only into the Contact page footer.',
    result: 'Script executes only on the intended page.',
    filename: 'resources/views/master.blade.php',
    code: `<!DOCTYPE html>
<html>
<body>
    @yield('content')
    @stack('scripts')
</body>
</html>

<!-- Child page -->
@push('scripts')
    <script>console.log("Contact Page Loaded");</script>
@endpush`,
    icon: List,
  },

  /* ── CHAPTER 4: DATABASE & ELOQUENT ── */
  {
    id: 'L04-S1', chapter: 'database',
    title: 'Migrations & Schema', subtitle: 'Database Version Control',
    accent: '#06b6d4',
    bg: 'radial-gradient(ellipse at 15% 45%, rgba(6,182,212,0.15) 0%, transparent 55%)',
    concepts: [
      { label: 'Migrations', desc: 'Blueprint files that create or modify database tables over time.' },
      { label: 'Schema Builder', desc: 'Fluent API: $table->string("name") to define columns easily.' },
      { label: 'Rollbacks', desc: 'Mistake? Undo the last migration with one command.' },
      { label: 'Team Sync', desc: 'Never send SQL dumps; teammates just run "migrate" to stay updated.' },
    ],
    tip: 'Treat migrations like Git for your database. Never change tables manually.',
    lab: 'Create a migration for a "posts" table with title and body fields.',
    result: 'Successful table creation confirmed in terminal.',
    filename: 'create_posts_table.php',
    code: `Schema::create('posts', function (Blueprint $table) {
    $table->id();
    $table->string('title'); // varchar(255)
    $table->text('body');    // long text
    $table->timestamps();    // created_at & updated_at
});`,
    terminal: 'php artisan migrate',
    terminalOutput: '   INFO  Running migrations.\\n   DONE  CreatePostsTable successfully.',
    icon: Database,
  },
  {
    id: 'L04-S2', chapter: 'database',
    title: 'Eloquent Models', subtitle: 'Object-Relational Mapping',
    accent: '#06b6d4',
    bg: 'radial-gradient(ellipse at 85% 55%, rgba(6,182,212,0.12) 0%, transparent 55%)',
    concepts: [
      { label: 'Active Record', desc: 'Each model class represents a table; each object represents a row.' },
      { label: 'Fluent Queries', desc: 'Post::where("active", true)->get() is pure English.' },
      { label: 'Fillables', desc: 'A security whitelist for fields that can be updated in bulk.' },
      { label: 'Casting', desc: 'Automatically convert JSON strings to arrays (or dates) for you.' },
    ],
    tip: 'Eloquent models are the heart of your data logic. Keep them thin and expressive.',
    lab: 'Instantiate a new User model, set its name, and save it to the database.',
    result: 'New record appears in your users table.',
    filename: 'app/Models/Post.php',
    code: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;

class Post extends Model {
    protected $fillable = ['title', 'body', 'user_id'];
    
    // Automatic JSON casting
    protected $casts = ['settings' => 'array'];
}`,
    icon: Layers,
  },
  {
    id: 'L04-S3', chapter: 'database',
    title: 'Relationships', subtitle: 'Connecting the Dots',
    accent: '#06b6d4',
    bg: 'radial-gradient(ellipse at center, rgba(6,182,212,0.08) 0%, transparent 70%)',
    concepts: [
      { label: 'One-to-One', desc: 'A User has exactly one Profile.' },
      { label: 'One-to-Many', desc: 'A Post has many Comments; the most common link.' },
      { label: 'Many-to-Many', desc: 'Students and Courses: many students take many courses.' },
      { label: 'Eager Loading', desc: 'Use User::with("posts") to prevent the "N+1" performance bug.' },
    ],
    tip: 'Always use Eager Loading when looping to keep your database fast!',
    lab: 'Define a "hasMany" relationship on a User model for their blog posts.',
    result: 'You can now access $user->posts and get a clean collection of data.',
    filename: 'app/Models/User.php',
    code: `public function posts() {
    return $this->hasMany(Post::class);
}

// In the controller:
$users = User::with('posts')->get();`,
    icon: Workflow,
  },
  {
    id: 'L04-S4', chapter: 'database',
    title: 'Factories & Seeders', subtitle: 'Mass Production',
    accent: '#06b6d4',
    bg: 'radial-gradient(ellipse at 10% 20%, rgba(6,182,212,0.06) 0%, transparent 60%)',
    concepts: [
      { label: 'Seeders', desc: 'Fill your database with "Real" static data for production.' },
      { label: 'Factories', desc: 'Producers of "Fake" random data for testing (using Faker).' },
      { label: 'Mass Creation', desc: 'Generate 1,000 users in 1 second for performance testing.' },
      { label: 'Refresh', desc: 'Wipe and re-seed your DB anytime with a single command.' },
    ],
    tip: 'Use Factories during development to see how your UI looks with "real-ish" content.',
    lab: 'Run a seeder to populate your project with 50 fake blog posts.',
    result: 'A lively, populated application UI without manual typing.',
    filename: 'database/seeders/DatabaseSeeder.php',
    code: `public function run(): void {
    // Generate 10 random users
    User::factory(10)->create();
    
    // Generate 50 posts for the first user
    Post::factory(50)->create([
        'user_id' => 1
    ]);
}`,
    terminal: 'php artisan db:seed',
    terminalOutput: '   INFO  Seeding database.\\n   DONE  DatabaseSeeder successfully.',
    icon: Database,
  },

  /* ── CHAPTER 5: FORMS & VALIDATION ── */
  {
    id: 'L05-S1', chapter: 'forms',
    title: 'Forms & CSRF', subtitle: 'Secure Submissions',
    accent: '#eab308',
    bg: 'radial-gradient(ellipse at 50% 10%, rgba(234,179,8,0.15) 0%, transparent 55%)',
    concepts: [
      { label: 'CSRF Shield', desc: 'Unique secret tokens that prevent Cross-Site Request Forgery attacks.' },
      { label: 'POST Action', desc: 'All data changing routes must be POST (or PUT/DELETE via spoofing).' },
      { label: 'Method Spoofing', desc: 'HTML forms only support GET/POST; use @method("PATCH") for updates.' },
      { label: 'Persistence', desc: 'Use the old() helper to keep input values after a validation fail.' },
    ],
    tip: 'Always include @csrf. Without it, Laravel will block your request with a 419 error.',
    lab: 'Build a form that sends a title and body to an "update" route using the PATCH method.',
    result: 'Submission works perfectly with full security and persistence.',
    filename: 'edit_post.blade.php',
    code: `<form action="/posts/{{ $id }}" method="POST">
    @csrf
    @method('PATCH')
    
    <input name="title" value="{{ old('title', $post->title) }}">
    <button>Submit</button>
</form>`,
    icon: Edit3,
  },
  {
    id: 'L05-S2', chapter: 'forms',
    title: 'Validation Logic', subtitle: 'The Sanitizer',
    accent: '#eab308',
    bg: 'radial-gradient(ellipse at 50% 90%, rgba(234,179,8,0.12) 0%, transparent 55%)',
    concepts: [
      { label: 'Declarative Rules', desc: 'Use "required|email|unique:users" to specify exactly what you expect.' },
      { label: 'Automatic Redirects', desc: 'Laravel automatically sends users back to the form if validation fails.' },
      { label: 'Inline Errors', desc: 'Use the @error directive to show specific red messages below each input.' },
      { label: 'Security', desc: 'Validation is your first line of defense against malicious database entries.' },
    ],
    tip: 'Never trust user data. If a field is not in your $validated array, do not save it!',
    lab: 'Write a validation rule for a "slug" that must be unique in the posts table.',
    result: 'System rejects duplicate slugs and shows a friendly error message.',
    filename: 'UserController.php',
    code: `public function store(Request $request) {
    $data = $request->validate([
        'email' => 'required|email|unique:users',
        'age'   => 'integer|min:18',
    ]);
    
    User::create($data); // Safe & clean
}`,
    icon: Search,
  },
  {
    id: 'L05-S3', chapter: 'forms',
    title: 'Form Requests', subtitle: 'Clean Controllers',
    accent: '#eab308',
    bg: 'radial-gradient(ellipse at center, rgba(234,179,8,0.08) 0%, transparent 70%)',
    concepts: [
      { label: 'Separation', desc: 'Move complex validation away from your controller into its own dedicated class.' },
      { label: 'Authorization', desc: 'The authorize() method lets you check if a user is ALLOWED to submit this form.' },
      { label: 'Rules Method', desc: 'A clean, centralized place for all your verification logic.' },
      { label: 'Reusability', desc: 'Share the same validation rules across multiple controllers.' },
    ],
    tip: 'If your controller method has more than 5 lines of validation, create a Form Request.',
    lab: 'Generate a StorePostRequest and move your validation rules into it.',
    result: 'Controller is now a single, beautiful line of logic.',
    filename: 'app/Http/Requests/StorePostRequest.php',
    code: `public function rules(): array {
    return [
        'title' => 'required|max:255',
        'tags'  => 'array|min:1',
    ];
}

// In Controller:
public function store(StorePostRequest $request) { ... }`,
    terminal: 'php artisan make:request StorePostRequest',
    terminalOutput: '   INFO  Request created successfully.',
    icon: Workflow,
  },
  {
    id: 'L05-S4', chapter: 'forms',
    title: 'Flash Messaging', subtitle: 'Feedback Loop',
    accent: '#eab308',
    bg: 'radial-gradient(ellipse at 90% 10%, rgba(234,179,8,0.06) 0%, transparent 60%)',
    concepts: [
      { label: 'Flash Session', desc: 'Data that lasts for exactly one more page load (perfect for "Success!").' },
      { label: 'with() Helper', desc: 'Chain ->with("status", "Saved") onto your redirects for easy messaging.' },
      { label: 'UI Feedback', desc: 'Check if(session("success")) in your Blade header to show banners.' },
      { label: 'Persistence', desc: 'Errors are also flashed automatically by the validator.' },
    ],
    tip: 'Users love feedback. Always tell them when their "Save" was successful!',
    lab: 'Redirect to the home page with a "Post Created" status message.',
    result: 'Successful user UX with a green banner confirming the action.',
    filename: 'PostController.php',
    code: `return redirect('/posts')
    ->with('success', 'New post is live!');

// In Blade:
@if (session('success'))
    <div class="alert alert-success">
        {{ session('success') }}
    </div>
@endif`,
    icon: Activity,
  },

  /* ── CHAPTER 6: AUTHENTICATION & SECURITY ── */
  {
    id: 'L06-S1', chapter: 'auth',
    title: 'Authentication Strategy', subtitle: 'Breeze, Jetstream & Fortify',
    accent: '#a855f7',
    bg: 'radial-gradient(ellipse at 0% 0%, rgba(168,85,247,0.15) 0%, transparent 55%)',
    concepts: [
      { label: 'Starter Kits', desc: 'Breeze (Minimal/Blade/Inertia) and Jetstream (Pro/Livewire) jumpstart your app.' },
      { label: 'Automation', desc: 'Laravel handles Login, Registration, Password Resets, and Verification out of the box.' },
      { label: 'Secure Storage', desc: 'Passwords are automatically hashed using Argon2 or Bcrypt — the industry gold standard.' },
      { label: 'Guard System', desc: 'Define how users are authenticated (Session for web, Token for API).' },
    ],
    tip: 'Don’t reinvent the wheel. Laravel’s auth system is battle-tested and secure for millions of users.',
    lab: 'Install Laravel Breeze and run migrations to enable the user dashboard.',
    result: 'A complete auth system running on your local machine instantly.',
    filename: 'terminal',
    code: `# 1. Install Breeze
composer require laravel/breeze --dev
php artisan breeze:install blade

# 2. Build the database
php artisan migrate`,
    icon: Fingerprint,
    terminal: 'php artisan breeze:install',
    terminalOutput: '   INFO  Authentication scaffolding installed.',
  },
  {
    id: 'L06-S2', chapter: 'auth',
    title: 'Authorization Gates', subtitle: 'The Permissions Layer',
    accent: '#a855f7',
    bg: 'radial-gradient(ellipse at 100% 100%, rgba(168,85,247,0.12) 0%, transparent 55%)',
    concepts: [
      { label: 'Gates', desc: 'Quick true/false checks for generic actions (e.g., "is-admin").' },
      { label: 'Policies', desc: 'Organized classes that group authorization logic for a specific model (e.g., PostPolicy).' },
      { label: 'Middleware Gate', desc: 'Restrict access to routes based on user roles or specific criteria.' },
      { label: 'Guest Access', desc: 'Easily handle visitors vs registered users in your templates.' },
    ],
    tip: 'Authentication checks WHO you are. Authorization checks WHAT you are allowed to do.',
    lab: 'Create a policy that only allows a User to delete their own created posts.',
    result: 'Unauthenticated or unauthorized users are blocked from destructive actions.',
    filename: 'app/Policies/PostPolicy.php',
    code: `public function delete(User $user, Post $post) {
    return $user->id === $post->user_id;
}

// Use in Blade:
@can('delete', $post)
    <button>Delete</button>
@endcan`,
    icon: Shield,
  },
  {
    id: 'L06-S3', chapter: 'auth',
    title: 'Sanctum & API Tokens', subtitle: 'Mobile & SPA Security',
    accent: '#a855f7',
    bg: 'radial-gradient(ellipse at center, rgba(168,85,247,0.08) 0%, transparent 70%)',
    concepts: [
      { label: 'Token Issuance', desc: 'Generate long-lived strings for mobile apps to access your API.' },
      { label: 'Abilities', desc: 'Give tokens specific permissions (e.g. "read-only" vs "delete-posts").' },
      { label: 'SPA Auth', desc: 'Use stateful cookies for React/Vue frontends instead of manual tokens.' },
      { label: 'revocation', desc: 'Easily "Log Out" of all devices by deleting all tokens for a user.' },
    ],
    tip: 'Use Sanctum for simple API auth. It is much easier than OAuth2/Passport for most projects.',
    lab: 'Issue a new personal access token via Tinker and use it to access a protected route.',
    result: 'Confirmed API access using Bearer token authentication.',
    filename: 'api.php',
    code: `$token = $user->createToken('mobile-app')->plainTextToken;

// Protected API Route
Route::middleware('auth:sanctum')->get('/user', ...);`,
    icon: Key,
  },
  {
    id: 'L06-S4', chapter: 'auth',
    title: 'Socialite', subtitle: 'Login with GitHub/Google',
    accent: '#a855f7',
    bg: 'radial-gradient(ellipse at 10% 80%, rgba(168,85,247,0.06) 0%, transparent 60%)',
    concepts: [
      { label: 'OAuth Made Easy', desc: 'Standardized way to connect to hundreds of social providers.' },
      { label: 'Redirect Flow', desc: 'Send users to Google -> They Approve -> They come back to your app with data.' },
      { label: 'User Sync', desc: 'Automatically create records in your DB for social-logged-in users.' },
      { label: 'Security', desc: 'No more managing passwords; rely on the security of major providers.' },
    ],
    tip: 'Social login increases conversion rates by making "Sign Up" a single click.',
    lab: 'Configure the Google driver in your config/services.php file.',
    result: 'Social login flow is wired and ready for testing.',
    filename: 'AuthController.php',
    code: `return Socialite::driver('github')->redirect();

// Callback logic
$user = Socialite::driver('github')->user();
Auth::login($user);`,
    icon: Globe,
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
  {
    id: 'L07-S2', chapter: 'crud',
    title: 'Mass Assignment', subtitle: 'Security & Whitelisting',
    accent: '#ec4899',
    bg: 'radial-gradient(ellipse at 10% 30%, rgba(236,72,153,0.12) 0%, transparent 55%)',
    concepts: [
      { label: '$fillable', desc: 'Defining which fields can be updated in bulk via create() or update().' },
      { label: '$guarded', desc: 'The opposite of fillable: prevent these fields from bulk modification.' },
      { label: 'Mass-Assignment Vuln', desc: 'Prevent hackers from changing their role to "admin" via form hacking.' },
      { label: 'Validation First', desc: 'Always validate input before passing it to create($request->all()).' },
    ],
    tip: 'NEVER use $guarded = []. It makes your entire database vulnerable to injection.',
    lab: 'Create a Model and restrict its input to "title" and "body" only.',
    result: 'Unauthorized fields are ignored during database operations.',
    filename: 'app/Models/Post.php',
    code: `class Post extends Model {
    protected $fillable = ['title', 'body'];
    
    // Hacker sends 'role' => 'admin', 
    // but Laravel ignores it!
}`,
    icon: Shield,
  },
  {
    id: 'L07-S3', chapter: 'crud',
    title: 'Route-Model Binding', subtitle: 'Automatic Fetching',
    accent: '#ec4899',
    bg: 'radial-gradient(ellipse at 90% 70%, rgba(236,72,153,0.08) 0%, transparent 55%)',
    concepts: [
      { label: 'Implicit Binding', desc: 'Laravel injects the model instance directly into your controller method.' },
      { label: 'Type-Hinting', desc: 'Controller: index(Post $post) automatically fetches the post by ID.' },
      { label: 'Query Scoping', desc: 'Filter your resourceful routes automatically using scope methods.' },
      { label: 'Key Mapping', desc: 'Use "slug" or "uuid" instead of "id" for cleaner, SEO friendly URLs.' },
    ],
    tip: 'Using (Post $post) eliminates the need for manual Post::findOrFail($id) calls.',
    lab: 'Refactor your "edit" method to use implicit Model Binding.',
    result: 'Controller code is reduced by 50% while maintaining clarity.',
    filename: 'PostController.php',
    code: `public function show(Post $post) {
    return view('posts.show', ['post' => $post]);
}

// Route: /posts/{post}`,
    icon: FileCode,
  },
  {
    id: 'L07-S4', chapter: 'crud',
    title: 'Soft Deletes', subtitle: 'Safeguarding Data',
    accent: '#ec4899',
    bg: 'radial-gradient(ellipse at center, rgba(236,72,153,0.05) 0%, transparent 55%)',
    concepts: [
      { label: 'Trash System', desc: 'Instead of removing rows, marks them with "deleted_at" timestamp.' },
      { label: 'Restoration', desc: 'Allows users to undo accidental deletions easily.' },
      { label: 'Trash Cleanup', desc: 'Permanently remove items using forceDelete().' },
      { label: 'Database Integrity', desc: 'Maintain foreign key relationships even after item "removal".' },
    ],
    tip: 'Use SoftDeletes for nearly every important business entity. Data is valuable!',
    lab: 'Add the SoftDeletes trait to your Post model and run a migration.',
    result: 'Deleted records stay in the DB but disappear from the UI.',
    filename: 'app/Models/Post.php',
    code: `use Illuminate\\Database\\Eloquent\\SoftDeletes;

class Post extends Model {
    use SoftDeletes;
}

// Restore it later:
$post->restore();`,
    icon: Activity,
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
      { label: 'Asset URLs', desc: 'Generate correct paths using Storage::url($path) for CDN support.' },
    ],
    tip: 'Never store images directly in the public/ folder. Upload them to storage/ and link them.',
    lab: 'Store an uploaded avatar in the "public" disk and display it.',
    result: 'File successfully persisted and publicly accessible.',
    filename: 'UploadController.php',
    code: `$path = $request->file('avatar')->store('avatars', 'public');
$user->update(['avatar' => $path]);`,
    icon: Clock,
  },
  {
    id: 'L08-S2', chapter: 'advanced',
    title: 'Queues & Jobs', subtitle: 'Async Scalability',
    accent: '#3b82f6',
    bg: 'radial-gradient(ellipse at 70% 80%, rgba(59,130,246,0.12) 0%, transparent 55%)',
    concepts: [
      { label: 'Background Prep', desc: 'Move slow tasks (like sending emails) out of the request cycle.' },
      { label: 'Retries', desc: 'Automatic retry logic if a job fails (e.g. API is down).' },
      { label: 'Parallelism', desc: 'Run multiple workers to process thousands of tasks per second.' },
      { label: 'Connections', desc: 'Use Database, Redis, or SQS to manage your job traffic.' },
    ],
    tip: 'Always queue external API calls and Emails. Don’t make your user wait!',
    lab: 'Create a job to send a Welcome Email onto a "low" priority queue.',
    result: 'User sees "Success" instantly while the email sends in the background.',
    filename: 'WelcomeJob.php',
    code: `ProcessEmail::dispatch($user)
    ->onQueue('low')
    ->delay(now()->addMinutes(10));`,
    terminal: 'php artisan queue:work',
    terminalOutput: '   Processing Job: SendWelcomeEmail...\n   DONE: Processed Job.',
    icon: RefreshCw,
  },
  {
    id: 'L08-S3', chapter: 'advanced',
    title: 'Task Scheduling', subtitle: 'The PHP Cron Replacement',
    accent: '#3b82f6',
    bg: 'radial-gradient(ellipse at 10% 90%, rgba(59,130,246,0.08) 0%, transparent 55%)',
    concepts: [
      { label: 'Eloquent Schedule', desc: 'Define your recurring tasks in pure PHP instead of messy server crontab files.' },
      { label: 'Daily/Weekly', desc: 'Fluent syntax: $schedule->command("backup")->dailyAt("01:00").' },
      { label: 'Overlap Prevention', desc: 'Ensure a task doesn’t start twice if the first one is still running.' },
      { label: 'Maintenance', desc: 'Automatically clear expired logs, backup DB, or prune old files.' },
    ],
    tip: 'Schedule everything. From database backups to daily activity summaries.',
    lab: 'Set up a command that runs every minute to check for expiring subscriptions.',
    result: 'Automation engine heartbeat is active.',
    filename: 'app/Console/Kernel.php',
    code: `$schedule->command('prune:logs')->daily();

$schedule->call(function () {
    // Custom logic here
})->everyFiveMinutes();`,
    terminal: 'php artisan schedule:list',
    terminalOutput: '   0 1 * * *  php artisan prune:logs',
    icon: List,
  },
  {
    id: 'L08-S4', chapter: 'advanced',
    title: 'Monitoring & Logs', subtitle: 'Laravel Pulse & Horizon',
    accent: '#3b82f6',
    bg: 'radial-gradient(ellipse at center, rgba(59,130,246,0.05) 0%, transparent 55%)',
    concepts: [
      { label: 'Laravel Pulse', desc: 'Real-time health dashboard for CPU, Cache, and Slow Queries.' },
      { label: 'Laravel Horizon', desc: 'Beautiful UI for monitoring your Redis-powered Queues.' },
      { label: 'Log Channels', desc: 'Send errors to Slack, Email, or Sentry automatically.' },
      { label: 'Performance', desc: 'Identify which users are experiencing the slowest requests.' },
    ],
    tip: 'Install Pulse on every production app. It’s like having an X-ray for your server.',
    lab: 'View your slow queries dashboard and identify the heaviest DB logic.',
    result: 'Visibility into application performance bottlenecks.',
    filename: 'terminal',
    code: `# Install the vitals dashboard
composer require laravel/pulse
php artisan migrate`,
    icon: Activity,
  },

  /* ── CHAPTER 9: API DEVELOPMENT ── */
  {
    id: 'L09-S1', chapter: 'api',
    title: 'JSON & Sanctum', subtitle: 'Laravel for Mobile/JS Apps',
    accent: '#10b981',
    bg: 'radial-gradient(ellipse at 70% 80%, rgba(16,185,129,0.12) 0%, transparent 55%)',
    concepts: [
      { label: 'API Routes', desc: 'Defining endpoints in routes/api.php with /api prefix by default.' },
      { label: 'Sanctum Tokens', desc: 'Lightweight authentication for SPAs and mobile apps.' },
      { label: 'Bearer Auth', desc: 'Securely passing tokens in the Authorization header.' },
      { label: 'Statelessness', desc: 'APIs don’t use sessions; every request must carry its own identity.' },
    ],
    tip: 'Use Sanctum for most projects. It is simpler than Passport and works perfectly for SPAs.',
    lab: 'Protect a route using the "auth:sanctum" middleware and hit it with a token.',
    result: 'Authorized access to sensitive JSON data streams.',
    filename: 'routes/api.php',
    code: `Route::middleware('auth:sanctum')
    ->get('/user', function (Request $request) {
        return $request->user();
    });`,
    icon: Lock,
  },
  {
    id: 'L09-S2', chapter: 'api',
    title: 'API Resources', subtitle: 'Pragmatic Data Shaping',
    accent: '#10b981',
    bg: 'radial-gradient(ellipse at 30% 20%, rgba(16,185,129,0.15) 0%, transparent 55%)',
    concepts: [
      { label: 'Data Wrapping', desc: 'Encapsulate your JSON response in a standardized "data" key.' },
      { label: 'Conditional Stats', desc: 'Only include fields if a relationship is loaded or user is admin.' },
      { label: 'Pagination', desc: 'Laravel handles "next_page_url" and totals automatically in resources.' },
      { label: 'Collections', desc: 'Format lists of items consistently across your entire API.' },
    ],
    tip: 'Always use Resources. They act as a security layer between your DB and the web.',
    lab: 'Create a UserResource that hides the user email from public API view.',
    result: 'Clean, secure, and formatted JSON output for frontend consumption.',
    filename: 'app/Http/Resources/UserResource.php',
    code: `public function toArray($request) {
    return [
        'id' => $this->id,
        'name' => $this->name,
        'joined' => $this->created_at->diffForHumans()
    ];
}`,
    icon: RefreshCw,
  },
  {
    id: 'L09-S3', chapter: 'api',
    title: 'Rate Limiting', subtitle: 'Protecting Your Resources',
    accent: '#10b981',
    bg: 'radial-gradient(ellipse at 90% 90%, rgba(16,185,129,0.08) 0%, transparent 55%)',
    concepts: [
      { label: 'Throttle', desc: 'Limit the number of requests a user can make per minute (e.g. 60/min).' },
      { label: 'Dynamic Limits', desc: 'Give Premium users 1,000 requests while Free users get 10.' },
      { label: 'Backoff', desc: 'Force agents to wait longer if they keep hitting your limits.' },
      { label: 'DDoS Defense', desc: 'Prevent bots from overwhelming your server with fake traffic.' },
    ],
    tip: 'Laravel’s RateLimiter uses Redis for high-performance tracking.',
    lab: 'Configure a limiter that allows 10 requests per minute for guests.',
    result: 'HTTP 429 "Too Many Requests" correctly returned for abusers.',
    filename: 'RouteServiceProvider.php',
    code: `RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
});`,
    icon: Activity,
  },
  {
    id: 'L09-S4', chapter: 'api',
    title: 'API Versioning', subtitle: 'Evolution without Breaking',
    accent: '#10b981',
    bg: 'radial-gradient(ellipse at center, rgba(16,185,129,0.05) 0%, transparent 55%)',
    concepts: [
      { label: 'v1 / v2 Routes', desc: 'House different versions of your API in separate folders/files.' },
      { label: 'Deprecation', desc: 'Inform developers that an endpoint will be removed in the future.' },
      { label: 'Compatibility', desc: 'Ensure old mobile apps keep working while you upgrade the backend.' },
      { label: 'Documentation', desc: 'Use tools like Scribe to auto-generate API docs from your code.' },
    ],
    tip: 'Start with v1 in your URL. You will thank yourself in 6 months.',
    lab: 'Set up a route group with the prefix "v1" for all your core endpoints.',
    result: 'Professional API structure ready for long-term growth.',
    filename: 'routes/api.php',
    code: `Route::prefix('v1')->group(function () {
    Route::apiResource('posts', PostController::class);
});`,
    icon: GitBranch,
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
  {
    id: 'L10-S2', chapter: 'frontend',
    title: 'Livewire', subtitle: 'Full-stack PHP Components',
    accent: '#fbbf24',
    bg: 'radial-gradient(ellipse at 80% 10%, rgba(251,191,36,0.12) 0%, transparent 55%)',
    concepts: [
      { label: 'TALL Stack', desc: 'Tailwind, Alpine, Laravel, Livewire — build SPAs with PHP logic.' },
      { label: 'Reactivity', desc: 'Input fields and buttons update the UI instantly without page refreshes.' },
      { label: 'Properties', desc: 'Sync public PHP variables directly with search inputs or form fields.' },
      { label: 'Actions', desc: 'Call PHP methods directly from your HTML: wire:click="save".' },
    ],
    tip: 'Use Livewire if you love PHP but want a modern, reactive user experience.',
    lab: 'Build a real-time search component that filters users as you type.',
    result: 'Dynamic, "JavaScript-like" behavior using only PHP code.',
    filename: 'SearchUsers.php',
    code: `class SearchUsers extends Component {
    public $search = '';

    public function render() {
        return view('livewire.search', [
            'users' => User::where('name', 'like', "%{$this->search}%")->get()
        ]);
    }
}`,
    icon: Zap,
  },
  {
    id: 'L10-S3', chapter: 'frontend',
    title: 'Inertia.js', subtitle: 'The Modern Monolith',
    accent: '#fbbf24',
    bg: 'radial-gradient(ellipse at 50% 50%, rgba(251,191,36,0.08) 0%, transparent 55%)',
    concepts: [
      { label: 'Protocol', desc: 'Glue that connects Laravel backends to React/Vue frontends perfectly.' },
      { label: 'No API Needed', desc: 'Build an SPA without writing a single API endpoint or using Axios.' },
      { label: 'Server Routing', desc: 'Keeps routing in Laravel while rendering components in React.' },
      { label: 'Shared State', desc: 'Easily pass Auth user or Flash messages to your React props.' },
    ],
    tip: 'Inertia gives you the power of React with the simplicity of traditional Laravel.',
    lab: 'Create a "Dashboard" React component and render it from a Laravel route.',
    result: 'High-performance SPA experience with zero boilerplate.',
    filename: 'DashboardController.php',
    code: `public function index() {
    return Inertia::render('Dashboard', [
        'stats' => $stats
    ]);
}`,
    icon: Layers,
  },
  {
    id: 'L10-S4', chapter: 'frontend',
    title: 'Alpine.js', subtitle: 'Lightweight Scripting',
    accent: '#fbbf24',
    bg: 'radial-gradient(ellipse at center, rgba(251,191,36,0.05) 0%, transparent 55%)',
    concepts: [
      { label: 'Micro-Interactions', desc: 'Handle dropdowns, modals, and toggles with tiny inline JS.' },
      { label: 'x-data', desc: 'Define your component state directly on the HTML tag.' },
      { label: 'x-on:click', desc: 'Intuitive event listeners that keep logic close to the UI.' },
      { label: 'Small Footprint', desc: 'Massive power in a tiny (~15kb) package compared to React.' },
    ],
    tip: 'Alpine is the "Tailwind of JavaScript". Perfect for sprinkles of reactivity.',
    lab: 'Create a mobile navigation menu that toggles open/closed using Alpine.',
    result: 'Functional, interactive UI elements with zero custom JS files.',
    filename: 'nav.blade.php',
    code: `<div x-data="{ open: false }">
    <button @click="open = !open">Menu</button>
    <nav x-show="open">...</nav>
</div>`,
    icon: Activity,
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
  {
    id: 'L11-S2', chapter: 'deploy',
    title: 'CI/CD Pipelines', subtitle: 'Automated Shipments',
    accent: '#8b5cf6',
    bg: 'radial-gradient(ellipse at 10% 20%, rgba(139,92,246,0.12) 0%, transparent 55%)',
    concepts: [
      { label: 'GitHub Actions', desc: 'Run your test suite automatically on every git push.' },
      { label: 'Linting', desc: 'Check for coding style violations before code is merged.' },
      { label: 'Staging Env', desc: 'Deploy to a test server first to verify features "in the wild".' },
      { label: 'Automated Deploy', desc: 'If tests pass, the pipeline pushes code to production for you.' },
    ],
    tip: 'Automation is security. It prevents human error during the "Push to Live" moment.',
    lab: 'Create a .github/workflows/tests.yml file and trigger a run.',
    result: 'Visual confirmation that your code is stable and production-ready.',
    filename: 'tests.yml',
    code: `name: Run Tests
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: php artisan test`,
    icon: GitBranch,
  },
  {
    id: 'L11-S3', chapter: 'deploy',
    title: 'Error Tracking', subtitle: 'Sentry & Bugsnag',
    accent: '#8b5cf6',
    bg: 'radial-gradient(ellipse at 90% 80%, rgba(139,92,246,0.08) 0%, transparent 55%)',
    concepts: [
      { label: 'Real-time Alerts', desc: 'Get notified via Slack or Email immediately when an error happens.' },
      { label: 'Contextual Data', desc: 'See the exact line of code, user ID, and browser that failed.' },
      { label: 'Stack Traces', desc: 'Deep dive into what led to the crash — even in production.' },
      { label: 'Resolve/Ignore', desc: 'Manage your technical debt by prioritizing critical bugs.' },
    ],
    tip: 'Don’t wait for users to report bugs. Know about them before they do!',
    lab: 'Install the Sentry SDK and trigger a test exception.',
    result: 'Detailed error report appears in your monitoring dashboard.',
    filename: 'logging.php',
    code: `'channels' => [
    'sentry' => [
        'driver' => 'sentry',
    ],
],`,
    icon: Activity,
  },
  {
    id: 'L11-S4', chapter: 'deploy',
    title: 'Scaling & Growth', subtitle: 'Beyond the Single Server',
    accent: '#8b5cf6',
    bg: 'radial-gradient(ellipse at center, rgba(139,92,246,0.05) 0%, transparent 55%)',
    concepts: [
      { label: 'Load Balancing', desc: 'Distribute traffic across multiple servers (AWS/DigitalOcean).' },
      { label: 'Redis Sentinel', desc: 'High-availability caching and queue management.' },
      { label: 'Read Replicas', desc: 'Offload database read queries to separate "follower" nodes.' },
      { label: 'Horizontal Scaling', desc: 'Adding more servers as your user base grows to millions.' },
    ],
    tip: 'Laravel is designed to scale. It powers some of the largest sites on the internet.',
    lab: 'Configure your DB connection to use a separate "read" host.',
    result: 'Higher database performance and reliability under heavy load.',
    filename: 'database.php',
    code: `'mysql' => [
    'read' => [
        'host' => '192.168.1.1',
    ],
    'write' => [
        'host' => '192.168.1.2'
    ],
],`,
    icon: Server,
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

      {/* ── CHAPTER NAV BAR (NEW VERSION) ── */}
      <div className="relative z-[60] flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/60 backdrop-blur-2xl custom-header">
        <div className="flex items-center gap-4">
          <Link href="/courses/backend" 
            className="group flex items-center gap-3 px-4 h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all active:scale-95 shadow-xl">
            <ArrowLeft className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-white transition-colors hidden md:block">Exit</span>
          </Link>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="group flex items-center gap-4 px-5 h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/12 hover:border-white/30 transition-all active:scale-95 shadow-2xl">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${isMenuOpen ? 'bg-white text-black rotate-0' : 'bg-black/40 text-zinc-400 group-hover:text-white'}`}>
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div key="x" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }}>
                    <X className="w-3.5 h-3.5" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ scale: 0, rotate: 90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: -90 }}>
                    <Menu className="w-3.5 h-3.5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex flex-col items-start leading-tight">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">Curriculum Map</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-tight">{chapterInfo.label}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-600 transition-transform duration-500 ${isMenuOpen ? 'rotate-180 text-white' : ''}`} />
              </div>
            </div>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-8">
          <div className="flex flex-col items-end gap-1.5 min-w-[140px]">
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="text-zinc-500 uppercase tracking-widest font-black">Chapter Mastery</span>
              <span className="text-white font-black bg-white/10 px-1.5 py-0.5 rounded-md">{Math.round(progress)}%</span>
            </div>
            <div className="w-44 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.2)]" 
                style={{ background: chapterInfo.color }} />
            </div>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <div className="flex items-center gap-3">
            <button onClick={prev} className="w-10 h-10 rounded-xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all active:scale-90 border border-white/5 flex items-center justify-center">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center min-w-[45px]">
               <span className="text-[9px] font-black text-zinc-600 uppercase tracking-tighter mb-0.5">Slide</span>
               <span className="text-sm font-mono text-zinc-500 flex items-center gap-1 leading-none">
                 <span className="text-white font-bold">{current + 1}</span>
                 <span className="text-zinc-800">/</span>
                 <span>{displaySlides.length}</span>
               </span>
            </div>
            <button onClick={next} className="w-10 h-10 rounded-xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all active:scale-90 border border-white/5 flex items-center justify-center">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── CHAPTER OVERLAY MENU ── */}
      <AnimatePresence mode="wait">
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-[50] bg-black/95 backdrop-blur-md"
            />
            <motion.div
              initial={{ y: -30, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -30, opacity: 0, scale: 0.98 }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed top-24 left-6 right-6 z-[55] max-w-5xl mx-auto bg-[#0d1117] border border-white/10 rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] p-12 backdrop-blur-3xl overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {CHAPTERS.map((ch, i) => {
                  const isActive = ch.id === chapterParam;
                  return (
                    <button key={ch.id} 
                      onClick={() => {
                        router.push(`?chapter=${ch.id}`);
                        setIsMenuOpen(false);
                      }}
                      className={`group relative flex items-center gap-5 p-5 rounded-2xl transition-all duration-300 border ${
                        isActive 
                          ? 'bg-white/5 border-white/20 shadow-xl' 
                          : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/10 hover:-translate-y-1'
                      }`}>
                      
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-500 overflow-hidden ${
                         isActive ? 'scale-110 shadow-2xl' : 'opacity-60 filter group-hover:opacity-100 group-hover:scale-105'
                      }`}
                      style={{ 
                        background: isActive ? ch.color : `${ch.color}25`, 
                        color: isActive ? '#000' : ch.color,
                        border: isActive ? 'none' : `1.5px solid ${ch.color}40`
                      }}>
                        {String(i + 1).padStart(2, '0')}
                      </div>

                      <div className="flex flex-col items-start leading-snug">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}
                            style={{ color: ch.color }}>
                            Part {i + 1}
                          </span>
                          {isActive && (
                            <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-white text-black uppercase tracking-tighter">Current</span>
                          )}
                        </div>
                        <span className={`text-[15px] font-bold tracking-tight transition-all ${isActive ? 'text-white' : 'text-zinc-200 group-hover:text-white'}`}>
                          {ch.label.split(' · ')[1] || ch.label}
                        </span>
                      </div>

                      {isActive && (
                        <div className="ml-auto w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_12px]" style={{ background: ch.color, boxShadow: `0 0 12px ${ch.color}` }} />
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-5">
                   <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">
                      Module Navigation
                   </div>
                   <div className="flex items-center gap-2 text-zinc-600 text-[10px] font-bold">
                      <span className="w-1 h-1 rounded-full bg-zinc-700" />
                      Select a chapter to jump directly to those slides
                   </div>
                </div>
                <div className="text-[10px] font-mono text-zinc-500 bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                   FULLSTACK ACADEMY • LARAVEL 11
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
