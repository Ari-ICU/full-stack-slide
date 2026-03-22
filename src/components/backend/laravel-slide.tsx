'use client'

import { useState, useCallback, useEffect, useRef, type CSSProperties } from "react";

// ─── TYPES ─────────────────────────────────────────────────────
interface ModuleTopic {
  en: string;
  kh: string;
}

interface ModuleConcept {
  term: string;
  def: string;
}

interface ModuleLab {
  title: string;
  titleKh: string;
  duration: string;
  objective: string;
  steps: string[];
  code: string;
  output?: string | null;
}

interface ModuleData {
  id: string;
  num: string;
  section: string;
  hours: string;
  title: string;
  titleKh: string;
  goal: string;
  goalKh: string;
  color: string;
  badge: string;
  topics: ModuleTopic[];
  lab: ModuleLab;
  concepts: ModuleConcept[];
  tip: string;
  project: string | null;
}

// ─── GLOBAL STYLES ────────────────────────────────────────────
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,600;0,700;1,400&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,400&family=Noto+Sans+Khmer:wght@400;600;800;900&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #0a0a08;
  --surface: #111110;
  --surface2: #1a1a18;
  --border: rgba(255,255,255,0.08);
  --border-strong: rgba(255,255,255,0.18);
  --ink: #ffffff;
  --ink-dim: #ffffff;
  --ink-faint: rgba(255,255,255,0.45);
  
  --red: #ff4d4d;
  --red-dim: rgba(255,77,77,0.12);
  --orange: #ff8c42;
  --amber: #f5c842;
  --green: #52e3a0;
  --teal: #38c9c9;
  --blue: #4d9fff;
  --purple: #b06bff;
  --pink: #ff6bb5;
  --cyan: #42d9f5;
  
  --mono: 'IBM Plex Mono', monospace;
  --serif: 'Fraunces', serif;
  --sans: 'Noto Sans Khmer', sans-serif;

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}

body {
  background: var(--bg);
  color: var(--ink);
  font-family: var(--sans);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 2px; }

button { cursor: pointer; font-family: var(--sans); }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}

.anim-up { animation: fadeUp 0.5s var(--ease-out) both; }
.anim-in { animation: fadeIn 0.3s ease both; }

.module-btn:hover .module-arrow { transform: translateX(6px); }
.module-btn:hover { background: var(--hover-color, rgba(255,255,255,0.04)) !important; }

.tab-item:hover { color: var(--ink) !important; }

.step-item:hover { border-color: var(--step-color, var(--border)) !important; }

.copy-btn:hover { opacity: 1 !important; }
`;

// ─── DATA ──────────────────────────────────────────────────────
const MODULES = [
  {
    id: "m01", num: "01", section: "Section 1", hours: "1.5h",
    title: "Introduction to Laravel",
    titleKh: "ការណែនាំ Laravel",
    goal: "Understand the ecosystem, philosophy and folder architecture of Laravel 12",
    goalKh: "ស្វែងយល់ពី Ecosystem, គំនិតរចនា និងរចនាសម្ព័ន្ធ Folder របស់ Laravel 12",
    color: "#ff4d4d",
    badge: "FOUNDATION",
    topics: [
      { en: "What is Laravel & Modern PHP Ecosystem", kh: "Laravel ជាអ្វី? និង PHP Ecosystem សម័យទំនើប" },
      { en: "Why Laravel? Security, Speed & Convention over Configuration", kh: "ហេតុអ្វីជ្រើស Laravel? សុវត្ថិភាព, ល្បឿន និង Convention" },
      { en: "Laravel 12 Global Folder Architecture", kh: "រចនាសម្ព័ន្ធ Folder ទូទៅ (app/, routes/, resources/, config/)" },
      { en: "The HTTP Request Lifecycle (deep dive)", kh: "ដំណើរការ HTTP Request ពីដំបូងដល់ Response" },
    ],
    lab: {
      title: "First Installation & Hello World",
      titleKh: "ការដំឡើង Laravel ដំបូង",
      duration: "45 min",
      objective: "Install Laravel and trace a request from browser to view",
      steps: [
        "Install PHP 8.2+ (8.4 recommended) and Composer globally",
        "Run: composer create-project laravel/laravel my-shop",
        "Start: php artisan serve → open http://localhost:8000",
        "Edit welcome.blade.php and refresh to see live changes",
        "Open routes/web.php and add a second route for /hello",
      ],
      code: `# 1. Install Laravel 12
composer create-project laravel/laravel:^12 my-shop
cd my-shop

# 2. Start the dev server
php artisan serve
# → Server running at http://127.0.0.1:8000

# 3. Check your Laravel version
php artisan --version
# → Laravel Framework 12.x.x

# 4. Add a custom route (routes/web.php)
Route::get('/hello', function () {
    return '<h1>Hello from Laravel!</h1>';
});

Route::get('/json', function () {
    return response()->json([
        'app'     => 'my-shop',
        'version' => app()->version(),
        'time'    => now()->toDateTimeString(),
    ]);
});`,
      output: `INFO  Server running on [http://127.0.0.1:8000]

Browser: http://localhost:8000/hello
→ Hello from Laravel!

Browser: http://localhost:8000/json
→ { "app": "my-shop", "version": "12.x", "time": "..." }`,
    },
    concepts: [
      { term: "Framework", def: "A pre-built skeleton with common patterns. Laravel handles auth, routing, DB, mail, and queues so you write features, not plumbing." },
      { term: "Composer", def: "PHP's package manager. Like npm for JS. composer create-project downloads Laravel and all its dependencies." },
      { term: "Request Lifecycle", def: "Browser → public/index.php → Kernel → Middleware → Router → Controller → Response. Every request follows this path." },
      { term: "Convention over Config", def: "Laravel makes smart defaults. A model named Product automatically links to the products table. Less config = more speed." },
    ],
    tip: "Start every class by asking: 'What is happening inside the computer when you type a URL and press Enter?' The entire course is the answer to that question.",
    project: null,
  },
  {
    id: "m01b", num: "01B", section: "Section 1 (cont.)", hours: "1h",
    title: "Laravel Folder Structure",
    titleKh: "រចនាសម្ព័ន្ធ Folder របស់ Laravel",
    goal: "Navigate every folder and file in a fresh Laravel 12 project with confidence",
    goalKh: "ចេះរុករកគ្រប់ Folder និង File ក្នុង Laravel 12 Project ថ្មីបានដោយភាពជឿជាក់",
    color: "#ff4d4d",
    badge: "FOUNDATION",
    topics: [
      { en: "app/ — The brain: Models, Controllers, Middleware, Requests", kh: "app/ — ខួរក្បាល: Models, Controllers, Middleware, Requests" },
      { en: "routes/ — URL map: web.php, api.php, console.php", kh: "routes/ — ផែនទី URL: web.php, api.php, console.php" },
      { en: "resources/ & public/ — Views, assets, and the entry door", kh: "resources/ & public/ — Views, Assets, ច្រកចូល" },
      { en: "database/, config/, bootstrap/ & .env — Storage, settings, secrets", kh: "database/, config/, bootstrap/ & .env — ការផ្ទុក, ការកំណត់, អាថ៌កំបាំង" },
    ],
    lab: {
      title: "Folder Explorer — Map Every Directory",
      titleKh: "ស្វែងរក Folder ទាំងអស់ — គូរ Map",
      duration: "30 min",
      objective: "Open every key folder, read one real file in each, and draw a mental map of where things live",
      steps: [
        "Open the project in VS Code — collapse all folders first",
        "Open app/Http/Controllers/ — see the empty Controllers folder",
        "Open routes/web.php — read the default welcome route",
        "Open resources/views/welcome.blade.php — see the default view",
        "Open .env — read DB_CONNECTION, APP_NAME, APP_KEY",
        "Open config/app.php — see how .env values are read via env()",
        "Open bootstrap/app.php — Laravel 12 middleware & route registration",
        "Open database/migrations/ — see the default users table migration",
      ],
      code: `# ── FULL FOLDER MAP OF A FRESH LARAVEL 12 PROJECT ──────────────
my-shop/
│
├── app/                          ← 🧠 YOUR APPLICATION CODE LIVES HERE
│   ├── Http/
│   │   ├── Controllers/          ← Request handlers (you write these)
│   │   ├── Middleware/           ← Filters that run before controllers
│   │   └── Requests/             ← Form validation classes
│   ├── Models/
│   │   └── User.php              ← Default User model (Eloquent)
│   └── Providers/
│       └── AppServiceProvider.php ← Boot-time service registration
│
├── bootstrap/
│   ├── app.php                   ← 🆕 Laravel 12: middleware + routes here
│   └── cache/                    ← Auto-generated cache files (git-ignore)
│
├── config/                       ← ⚙️  ALL CONFIGURATION FILES
│   ├── app.php                   ← App name, timezone, locale
│   ├── database.php              ← DB connections (reads from .env)
│   ├── auth.php                  ← Authentication guards & providers
│   ├── cache.php                 ← Cache driver settings
│   ├── filesystems.php           ← Storage disks (local, public, s3)
│   └── mail.php                  ← Email driver settings
│
├── database/                     ← 🗄️  DATABASE BLUEPRINTS
│   ├── migrations/               ← Schema version history (run in order)
│   │   ├── 0001_01_01_create_users_table.php
│   │   └── 0001_01_01_create_cache_table.php
│   ├── factories/                ← Fake data generators for testing
│   └── seeders/
│       └── DatabaseSeeder.php    ← Seeds fake data into the DB
│
├── public/                       ← 🚪 THE ONLY FOLDER THE WEB SERVER SEES
│   ├── index.php                 ← Entry point — every request starts here
│   ├── .htaccess                 ← Apache URL rewriting rules
│   └── (your CSS/JS/images here) ← asset('image.png') points here
│
├── resources/                    ← 🎨 FRONTEND SOURCE FILES
│   ├── views/                    ← Blade HTML templates (.blade.php)
│   │   └── welcome.blade.php     ← Default homepage view
│   ├── css/
│   │   └── app.css               ← Source CSS (compiled by Vite)
│   └── js/
│       └── app.js                ← Source JS (compiled by Vite)
│
├── routes/                       ← 🗺️  URL DEFINITIONS
│   ├── web.php                   ← Browser routes (session, CSRF)
│   ├── api.php                   ← API routes (stateless, /api prefix)
│   └── console.php               ← Custom Artisan command definitions
│
├── storage/                      ← 💾 RUNTIME FILES (writable by app)
│   ├── app/public/               ← User uploads (linked to public/storage)
│   ├── framework/                ← Sessions, cache, compiled views
│   └── logs/
│       └── laravel.log           ← All application errors logged here
│
├── tests/                        ← 🧪 AUTOMATED TESTS
│   ├── Feature/                  ← End-to-end HTTP tests
│   └── Unit/                     ← Isolated function/class tests
│
├── vendor/                       ← 📦 COMPOSER PACKAGES (never edit!)
│
├── .env                          ← 🔐 SECRETS (never commit to Git!)
├── .env.example                  ← Template for .env (safe to commit)
├── artisan                       ← CLI entry point: php artisan ...
├── composer.json                 ← PHP dependencies definition
├── package.json                  ← JS dependencies (npm/yarn)
└── vite.config.js                ← Asset bundler configuration`,
      output: `Key rule: Web server points to public/ ONLY.
Everything else (app/, config/, .env) is private — never directly accessible.

public/index.php is the single entry point.
It loads vendor/autoload.php then bootstrap/app.php.
Every HTTP request — regardless of URL — goes through index.php first.

The most important files when starting:
  routes/web.php         ← define your URLs here
  app/Http/Controllers/  ← write your logic here
  resources/views/       ← write your HTML here
  .env                   ← set your DB credentials here`,
    },
    concepts: [
      { term: "public/ is the web root", def: "Your web server (Apache/Nginx) points to public/ only. The .env file, app/ code, and database/ are never directly accessible from a browser. This is a core security feature." },
      { term: "bootstrap/app.php", def: "In Laravel 12, this single file registers all middleware, exception handlers, and loads route files. There is no more Http/Kernel.php like in older versions." },
      { term: "config/ reads from .env", def: "config/database.php uses env('DB_HOST', '127.0.0.1'). You never hardcode credentials in config files — they always read from .env. This keeps secrets out of Git." },
      { term: "storage/ is writable", def: "Laravel writes logs, sessions, cached views, and user uploads to storage/. It must be writable by the web server. Run: chmod -R 775 storage/ bootstrap/cache/" },
      { term: "vendor/ is generated", def: "vendor/ contains all Composer packages. It is in .gitignore — never commit it. A new developer runs composer install to regenerate it from composer.json." },
      { term: "routes/web.php vs api.php", def: "web.php routes have sessions and CSRF protection — for browsers. api.php routes are stateless with /api prefix — for mobile apps and JavaScript clients." },
    ],
    tip: "Walk through each folder LIVE in VS Code. Open one real file in each. Students who can navigate the folder structure without hesitation learn everything else twice as fast.",
    project: null,
  },
  {
    id: "m02", num: "02", section: "Section 2", hours: "1.5h",
    title: "Artisan CLI & Environment",
    titleKh: "Artisan CLI និង Environment",
    goal: "Master the command-line interface and manage sensitive configuration with .env",
    goalKh: "ស្ទាត់ Artisan CLI និងគ្រប់គ្រង Configuration ដោយ .env",
    color: "#8a8680",
    badge: "TOOLS",
    topics: [
      { en: "Artisan CLI Architecture (built on Symfony Console)", kh: "Artisan CLI (បង្កើតផ្អែកលើ Symfony Console)" },
      { en: "make:* Code Generators — controllers, models, migrations", kh: "make:* — បង្កើត Controllers, Models, Migrations ដោយស្វ័យប្រវត្តិ" },
      { en: "Environment Variables (.env) and Config caching", kh: "Environment Variables (.env) និងការ Cache Config" },
      { en: "Tinker: Interactive PHP REPL for testing logic", kh: "Tinker — Shell PHP Interactive សម្រាប់ Test Logic" },
    ],
    lab: {
      title: "Artisan Exploration & Tinker Session",
      titleKh: "ស្វែងរក Artisan និង Tinker",
      duration: "45 min",
      objective: "Use artisan commands confidently and test PHP logic in Tinker",
      steps: [
        "Run: php artisan list — study the available commands",
        "Run: php artisan about — see environment summary",
        "Run: php artisan route:list — no routes yet, will add later",
        "Run: php artisan tinker — test PHP expressions live",
        "Generate first controller: php artisan make:controller HomeController",
      ],
      code: `# Explore available commands
php artisan list

# See your app environment snapshot
php artisan about

# List all registered routes
php artisan route:list

# ── Open the Tinker REPL ──────────────────
php artisan tinker

# Inside Tinker:
>>> now()
=> Illuminate\\Support\\Carbon @... {
     date: "2026-01-01 10:00:00.0 UTC (+00:00)",
   }

>>> str('hello world')->title()
=> Illuminate\\Support\\Stringable {#value: "Hello World"}

>>> collect([1, 2, 3, 4, 5])->sum()
=> 15

>>> collect([1, 2, 3, 4, 5])->filter(fn($n) => $n > 2)->values()
=> Illuminate\\Support\\Collection {#... all: [3, 4, 5]}

# Generate files
php artisan make:controller HomeController
php artisan make:model Product
php artisan make:migration create_products_table`,
      output: `INFO  Generating autoload files

Created: app/Http/Controllers/HomeController.php
Created: app/Models/Product.php
Created: database/migrations/2026_01_01_create_products_table.php`,
    },
    concepts: [
      { term: "Artisan", def: "Laravel's command-line tool. php artisan [command] runs generators, migrations, queues, and custom tasks from the terminal." },
      { term: "Tinker", def: "An interactive PHP shell. Type PHP code and get instant results. Perfect for testing Eloquent queries before writing them in code." },
      { term: ".env File", def: "Stores secrets like DB passwords and API keys. Never commit this to Git. Each deployment environment has its own .env." },
      { term: "Code Generator", def: "php artisan make:controller creates a controller file with correct namespace, extends, and stub. Saves time and prevents typos." },
    ],
    tip: "Tinker is the most underused tool in Laravel. Train students to test every Eloquent query in Tinker first, then move it to their controller.",
    project: null,
  },
  {
    id: "m02b", num: "02B", section: "Section 2 (cont.)", hours: "1.5h",
    title: "Docker Fundamentals for Backend",
    titleKh: "មូលដ្ឋានគ្រឹះ Docker សម្រាប់ Backend",
    goal: "Set up a professional Docker environment and understand containerization basics",
    goalKh: "តំឡើង Docker Environment និងយល់ពីមូលដ្ឋានគ្រឹះនៃ Containerization",
    color: "#4d9fff",
    badge: "DEVOPS",
    topics: [
      { en: "Docker Desktop Setup (Mac/Windows)", kh: "ការតំឡើង Docker Desktop" },
      { en: "Images vs Containers — the 'Class vs Object' analogy", kh: "ស្វែងយល់ពី Images និង Containers" },
      { en: "VirtioFS & Resource Settings for Performance", kh: "ការកំណត់ Resource ដើម្បីបង្កើនល្បឿន Docker" },
      { en: "Docker Dashboard — monitoring logs and stats", kh: "ការគ្រប់គ្រង Containers តាមរយៈ Dashboard" },
    ],
    lab: {
      title: "Preparing the Docker Engine",
      titleKh: "ការរៀបចំ Docker Engine",
      duration: "45 min",
      objective: "Install Docker and run your first generic container to verify setup",
      steps: [
        "Download and install Docker Desktop (macOS/Windows)",
        "Enable 'VirtioFS' in Settings -> General for 5x faster file access",
        "Allocate at least 4GB RAM and 4 CPUs to Docker",
        "Open terminal and run: docker --version",
        "Pull and run a test: docker run hello-world",
        "Inspect the running container in the Docker Desktop UI",
      ],
      code: `// ── 1. Check if Docker is healthy ──────────────
docker --version
docker info  // Detailed system information

// ── 2. Run your first container (The 'Class' → 'Object' flow) ──
docker pull hello-world    // Download the image (The Class)
docker run hello-world     // Create a container (The Object)

// ── 3. Essential Docker CLI ────────────────────
docker ps       // List running containers
docker ps -a    // List ALL containers (including stopped)
docker images   // List downloaded images
docker stop [id] // Stop a container
docker rm [id]   // Delete a container record`,
      output: `docker --version
Docker version 27.2.0, build 3f42231

docker run hello-world
Hello from Docker!
This message shows that your installation appears to be working correctly.`,
    },
    concepts: [
      { term: "Docker Image", def: "A read-only template that contains the instructions for creating a Docker container. Think of it as a 'snapshot' of a tiny OS with PHP installed." },
      { term: "Docker Container", def: "A runnable instance of an image. You can have 10 containers running from the same 1 image simultaneously." },
      { term: "VirtioFS", def: "A modern file system for Docker Desktop on macOS that drastically speeds up the communication between your code folder and the container." },
    ],
    tip: "Docker consumes a lot of power. Always quit Docker Desktop when you are finished developing to save your battery life and free up your RAM.",
    project: null,
  },
  {
    id: "m03", num: "03", section: "Section 3", hours: "1.5h",
    title: "Docker & Laravel Sail",
    titleKh: "Docker & Laravel Sail",
    goal: "Run a consistent development environment with Docker — never 'works on my machine' again",
    goalKh: "ដំណើរការ Dev Environment ដូចគ្នាលើ Computer ទាំងអស់ដោយ Docker",
    color: "#4d9fff",
    badge: "DEVOPS",
    topics: [
      { en: "Docker Philosophy — Containers vs Virtual Machines", kh: "Docker — Containers ធៀបនឹង Virtual Machines" },
      { en: "Laravel Sail — zero-config Docker for Laravel", kh: "Laravel Sail — Docker Wrapper ងាយស្រួល" },
      { en: "Multi-service: PHP + MySQL + Redis + Mailpit", kh: "Multi-service: PHP + MySQL + Redis + Mailpit" },
      { en: "Running Artisan & Composer inside containers", kh: "ដំណើរការ Artisan និង Composer ក្នុង Container" },
    ],
    lab: {
      title: "Launch Full Docker Stack",
      titleKh: "ដំណើរការ Docker Stack ពេញលេញ",
      duration: "60 min",
      objective: "Spin up PHP + MySQL + Redis using Sail and connect the database",
      steps: [
        "Install Docker Desktop and make sure it is running",
        "Verify: docker ps — now see 4 Sail containers running",
        "Run: ./vendor/bin/sail artisan migrate",
      ],
      code: `# ── STEP 1: Fast installation (Docker PATH) ────────
curl -s "https://laravel.build/my-shop" | bash
# This automatically creates the folder, .env, and Sail config!

# ── STEP 2: Start all containers ─────────────────────────────
cd my-shop
./vendor/bin/sail up -d
# If your machine is fast, this takes < 30 seconds.

# ── Useful tip: Alias Sail ──────────────────────────────────
alias sail="./vendor/bin/sail"
# Now you can just use 'sail artisan' instead of the long path

# ── STEP 3: Verify Running Services ─────────────────────────
sail ps
# CONTAINER ID   IMAGE              STATUS
# abc123         sail-8.4/app       Up 2 minutes  ← PHP 8.4
# def456         mysql/mysql-server Up 2 minutes  ← MySQL 8.0
# ghi789         redis:alpine       Up 2 minutes  ← Redis Cache
# jkl012         axllent/mailpit    Up 2 minutes  ← Mail Testing

# ── STEP 4: Common Commands ─────────────────────────────────
sail artisan migrate    # Migrate inside container
sail artisan tinker     # Test PHP logic inside container
sail composer require   # Install packages inside container
sail npm run dev        # Build Frontend inside container
sail down               # STOP and DELETE all containers`,
      output: `# After cp .env.example .env && php artisan key:generate:
INFO  Application key set successfully.

# After ./vendor/bin/sail up -d:
[+] Running 4/4
 ✔ Container my-shop-mysql-1    Started
 ✔ Container my-shop-redis-1    Started
 ✔ Container my-shop-mailpit-1  Started
 ✔ Container my-shop-laravel-1  Started

# After ./vendor/bin/sail artisan migrate:
INFO  Running migrations.
  2014_10_12_000000_create_users_table .......... 22ms DONE
  2019_12_14_000001_create_personal_access_tokens 18ms DONE

# docker ps (you should see 4 Sail containers):
CONTAINER ID   IMAGE           STATUS
abc123         sail-8.4/app    Up 2 minutes
def456         mysql/mysql     Up 2 minutes
ghi789         redis:alpine    Up 2 minutes
jkl012         mailpit         Up 2 minutes`,
    },
    concepts: [
      { term: "Container", def: "A lightweight isolated box with its own OS, PHP version, and dependencies. Different projects can use different PHP versions without conflict." },
      { term: "Sail", def: "A bash script that wraps Docker Compose for Laravel. ./vendor/bin/sail up starts your entire stack — PHP, MySQL, Redis — in one command." },
      { term: "docker-compose.yml", def: "The file Sail generates that defines all your services, their images, ports, and how they connect to each other." },
      { term: "Volume", def: "Docker Volumes persist your MySQL data even when containers are stopped or rebuilt. Your data is safe between restarts." },
      { term: ".env is required first", def: "Always run: cp .env.example .env && php artisan key:generate BEFORE sail up. Without APP_KEY set, Laravel refuses to start inside the container." },
    ],
    tip: "Screen-share the docker ps output during class. Seeing 4 running containers is a powerful moment — it makes abstract concepts concrete instantly.",
    project: null,
  },
  {
    id: "m03b", num: "03B", section: "Section 3 (cont.)", hours: "1.5h",
    title: "Advanced Sail & Customizations",
    titleKh: "ការកំណត់ Sail & Docker កម្រិតខ្ពស់",
    goal: "Customize your stack — adding services and changing port mappings",
    goalKh: "ប្តូរការកំណត់ Docker Stack — បន្ថែម Services និងផ្លាស់ប្តូរ Port Mappings",
    color: "#4d9fff",
    badge: "DEVOPS",
    topics: [
      { en: "Inside docker-compose.yml — structure and syntax", kh: "ស្វែងយល់ពី docker-compose.yml" },
      { en: "Port Mappings — dealing with 3306 conflicts", kh: "ការប្តូរ Port Mappings ដើម្បីបញ្ចៀសការជាន់គ្នា" },
      { en: "Docker Volumes — where your DB data is stored", kh: "Docker Volumes — កន្លែងផ្ទុកទិន្នន័យ Database" },
      { en: "Customizing PHP Version and Runtime", kh: "ការប្តូរជំនាន់ PHP និង Runtime" },
    ],
    lab: {
      title: "Customizing your Cluster",
      titleKh: "ការប្តូរការកំណត់ក្នុង Cluster",
      duration: "60 min",
      objective: "Change the default MySQL port and persist DB data across restarts",
      steps: [
        "Open docker-compose.yml and find the 'mysql' service",
        "Change the external port from 3306 to 3307 in .env",
        "Add 'Meilisearch' to your stack using artisan sail:add",
        "Inspect the 'sail-mysql' volume in the Docker Dashboard",
        "Switch PHP version from 8.4 to 8.2 in the runtime section",
        "Run: sail build --no-cache after changing versions",
      ],
      code: `// ── 1. Changing Ports (Avoid "Port already in use") ──
// Open .env file:
FORWARD_DB_PORT=3307  // Local machine port 3307 → Docker 3306
APP_PORT=8080         // Local machine port 8080 → Docker 80

// ── 2. The Power of volumes ────────────────────────
// Inside docker-compose.yml:
services:
  mysql:
    volumes:
      - 'sail-mysql:/var/lib/mysql' // This spans restarts!

// ── 3. Changing PHP Versions ──────────────────────
// Open docker-compose.yml, change the 'context':
build:
    context: ./vendor/laravel/sail/runtimes/8.2 // Change to 8.2

// Then run:
sail build --no-cache
sail up -d`,
      output: `sail artisan sail:add
Which services would you like to install? [mysql]:
  [0] mysql
  [1] pgsql
  [2] mariadb
  [3] redis
  [4] memcached
  [5] meilisearch
  [6] typesense
  [7] minio
  [8] mailpit
  [9] selenium
 > 5`,
    },
    concepts: [
      { term: "Port Forwarding", def: "Mapping a port on your physical computer (Host) to a port inside the virtual container (Guest). Standard for DB is 3306:3306." },
      { term: "Docker Volume", def: "A special folder managed by Docker that survives even if you delete the container. It is essential for database files; otherwise, all data is lost when you stop the container." },
      { term: "docker-compose.yml", def: "The 'Blueprint' file. It tells Docker exactly which images to use and how they should talk to each other." },
    ],
    tip: "If your MySQL data disappears, you likely deleted your Docker Volume accidentally. Always use 'sail down --volumes' with caution!",
    project: null,
  },
  {
    id: "m04", num: "04", section: "Section 4", hours: "2h",
    title: "MVC Architecture Deep Dive",
    titleKh: "MVC Architecture",
    goal: "Build the mental model of Model-View-Controller and implement your first complete page",
    goalKh: "យល់ Model-View-Controller ហើយបង្កើត Page ដំបូងពេញលេញ",
    color: "#b06bff",
    badge: "ARCHITECTURE",
    topics: [
      { en: "Model — Data blueprint & database interaction", kh: "Model — គំរូទិន្នន័យ & ការប្រាស្រ័យជាមួយ Database" },
      { en: "View — Blade templates & presentation layer", kh: "View — Blade Templates & ការបង្ហាញ UI" },
      { en: "Controller — The request handler connecting M & V", kh: "Controller — អ្នកគ្រប់គ្រង Request ភ្ជាប់ Model & View" },
      { en: "Named Routes & URL generation best practices", kh: "Named Routes & ការបង្កើត URL ត្រឹមត្រូវ" },
    ],
    lab: {
      title: "Home, About & Products Landing Pages",
      titleKh: "ទំព័រ Home, About និង Products",
      duration: "60 min",
      objective: "Create 3 linked Blade pages using a controller and named routes",
      steps: [
        "Create: php artisan make:controller PageController",
        "Add index(), about(), products() methods",
        "Register named routes in routes/web.php",
        "Create Blade views in resources/views/",
        "Build a layout.blade.php with @yield('content')",
        "Link pages using {{ route('about') }} helper",
      ],
      code: `// routes/web.php
use App\\Http\\Controllers\\PageController;

Route::get('/', [PageController::class, 'index'])->name('home');
Route::get('/about', [PageController::class, 'about'])->name('about');
Route::get('/products', [PageController::class, 'products'])->name('products');

// app/Http/Controllers/PageController.php
class PageController extends Controller
{
    public function index()
    {
        $stats = [
            'total_products' => 42,
            'categories'     => 8,
        ];
        return view('home', compact('stats'));
    }

    public function about()
    {
        return view('about', [
            'team' => ['Dara', 'Sophea', 'Rithy'],
        ]);
    }

    public function products()
    {
        return view('products.index');
    }
}

// resources/views/layouts/app.blade.php
<!DOCTYPE html>
<html>
<head>
    <title>MyShop — @yield('title', 'Home')</title>
</head>
<body>
    <nav>
        <a href="{{ route('home') }}">Home</a>
        <a href="{{ route('about') }}">About</a>
        <a href="{{ route('products') }}">Products</a>
    </nav>
    <main>@yield('content')</main>
</body>
</html>

// resources/views/home.blade.php
@extends('layouts.app')
@section('title', 'Welcome')
@section('content')
    <h1>Welcome to MyShop</h1>
    <p>{{ $stats['total_products'] }} products in {{ $stats['categories'] }} categories</p>
@endsection`,
      output: `Pages accessible at:
  GET /          → home (renders home.blade.php)
  GET /about     → about (renders about.blade.php)
  GET /products  → products (renders products/index.blade.php)

Blade compiled to: storage/framework/views/abc123.php`,
    },
    concepts: [
      { term: "MVC Pattern", def: "Model = data/logic. View = what user sees. Controller = the connector. Separating them keeps code organised and testable." },
      { term: "Blade Template", def: "Laravel's HTML template engine. {{ $var }} outputs data safely (XSS-escaped). @if, @foreach, @extends are Blade directives." },
      { term: "Named Route", def: "Route::get('/about')->name('about') lets you use route('about') instead of hardcoding '/about' everywhere." },
      { term: "compact()", def: "PHP helper. compact('products', 'stats') is shorthand for ['products' => $products, 'stats' => $stats]. Passes variables to views." },
    ],
    tip: "Use the restaurant analogy live: 'The Model is the kitchen. The View is the dining room. The Controller is the waiter. Could they work without each other?' Then build the pages.",
    project: null,
  },
  {
    id: "m05", num: "05", section: "Section 5", hours: "1.5h",
    title: "Routing & Request Flow",
    titleKh: "Routing & Request Flow",
    goal: "Master URL routing — parameters, groups, middleware, and resource routing",
    goalKh: "ស្ទាត់ URL Routing — Parameters, Groups, Middleware, Resource Routes",
    color: "#52e3a0",
    badge: "ROUTING",
    topics: [
      { en: "Route parameters, optional params & constraints", kh: "Route Parameters, Optional Params & Constraints" },
      { en: "Route Groups, Prefixes & Namespacing", kh: "Route Groups, Prefix & Namespace" },
      { en: "Middleware — auth, guest, throttle, custom", kh: "Middleware — auth, guest, throttle, custom" },
      { en: "Route::resource() — 7 RESTful routes in 1 line", kh: "Route::resource() — RESTful Routes ៧ ក្នុង ១ បន្ទាត់" },
    ],
    lab: {
      title: "Product Resource Routes & Route Model Binding",
      titleKh: "Routes ពេញលេញសម្រាប់ Products",
      duration: "60 min",
      objective: "Register resourceful routes, add middleware groups and dynamic segments",
      steps: [
        "Create: php artisan make:controller ProductController --resource",
        "Register: Route::resource('products', ProductController::class)",
        "Run: php artisan route:list — study the 7 routes",
        "Add Route::get('/category/{slug}', ...) with parameter",
        "Wrap admin routes in middleware('auth') group",
        "Implement show(Product $product) with Route Model Binding",
      ],
      code: `// routes/web.php

// ── Resourceful Routes ─────────────────────────
Route::resource('products', ProductController::class);
// Creates: index, create, store, show, edit, update, destroy

// ── Dynamic URL Parameters ─────────────────────
Route::get('/category/{slug}', function (string $slug) {
    return "Viewing category: {$slug}";
})->where('slug', '[a-z\\-]+'); // only lowercase + dashes

// ── Route Groups with Middleware ───────────────
Route::middleware(['auth'])->prefix('admin')->group(function () {
    Route::resource('products', AdminProductController::class);
    Route::get('/dashboard', [AdminController::class, 'index'])
         ->name('admin.dashboard');
});

// ── Route Model Binding ────────────────────────
// Laravel automatically fetches Product::findOrFail($id)
public function show(Product $product)
{
    return view('products.show', compact('product'));
    // $product is already a full Eloquent object ✓
}

// ── php artisan route:list output ─────────────
// GET    /products           products.index
// GET    /products/create    products.create
// POST   /products           products.store
// GET    /products/{id}      products.show
// GET    /products/{id}/edit products.edit
// PUT    /products/{id}      products.update
// DELETE /products/{id}      products.destroy`,
      output: `php artisan route:list

  GET|HEAD  /                  home
  GET|HEAD  /products          products.index
  POST      /products          products.store
  GET|HEAD  /products/create   products.create
  GET|HEAD  /products/{product} products.show
  PUT|PATCH /products/{product} products.update
  DELETE    /products/{product} products.destroy
  GET|HEAD  /products/{product}/edit products.edit`,
    },
    concepts: [
      { term: "Route Model Binding", def: "Type-hint a Model in your controller: show(Product $product). Laravel runs Product::findOrFail($id) for you automatically." },
      { term: "Route::resource()", def: "One line creates 7 standard CRUD routes. Always prefer this over writing individual routes for standard CRUD." },
      { term: "Middleware", def: "Code that runs before/after a request reaches your controller. auth checks login. throttle limits request rate." },
      { term: "Route Groups", def: "Route::middleware('auth')->prefix('admin')->group(...) applies middleware and /admin prefix to all routes inside." },
    ],
    tip: "Run php artisan route:list after every new route you register. Students who see the route list become more confident about what their app can do.",
    project: null,
  },
  {
    id: "m06", num: "06", section: "Section 6", hours: "1.5h",
    title: "Migrations & Schema Master",
    titleKh: "ការគ្រប់គ្រង Database តាមរយៈ Migrations",
    goal: "Master the full lifecycle of version-controlled database schemas in Laravel 12",
    goalKh: "ស្ទាត់ជំនាញលើការគ្រប់គ្រង Database Schema ជាមួយ Migrations",
    color: "#46a1ff",
    badge: "DATABASE",
    topics: [
      { en: "Anonymous Migrations (Laravel 12 standard)", kh: "Anonymous Migrations (ស្តង់ដារ Laravel 12)" },
      { en: "Column Types — from simple strings to JSON & UUIDs", kh: "ប្រភេទ Column — ពី String ធម្មតា ដល់ JSON & UUID" },
      { en: "Database Indexes — Primary, Unique, and Composite", kh: "ការបង្កើត Index — Primary, Unique, និង Composite" },
      { en: "Migration Lifecycle — fresh, refresh, status, and rollback", kh: "Lifecycle នៃ Migration — fresh, refresh, status, rollback" },
      { en: "Artisan CLI Master — status, reset, refresh, monitor", kh: "ស្ទាត់ជំនាញ Artisan CLI សម្រាប់គ្រប់គ្រង Database" },
    ],
    lab: {
      title: "Designing the Master Schema",
      titleKh: "ការរចនា Schema មេសម្រាប់ Shop",
      duration: "60 min",
      objective: "Build a multi-table schema with complex column types and constraints",
      steps: [
        "Create an anonymous migration for the categories table",
        "Add a slug column with a unique index: $table->string('slug')->unique()",
        "Create the products table with decimal(10,2) and boolean defaults",
        "Use migrate:status to check the version history",
        "Practice a partial rollback with migrate:rollback --step=1",
        "Reset the entire database with migrate:fresh --seed",
      ],
      code: `// Laravel 12 Anonymous Migration style
use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('products', function (Blueprint $table) {
            $table->id(); // BigIncrements ('id')
            
            // Relational Keys
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            
            // Core Data
            $table->string('sku')->unique();
            $table->string('name');
            $table->decimal('price', 12, 2)->default(0.00);
            $table->integer('stock_level')->default(0);
            
            // Advanced Types
            $table->json('attributes')->nullable(); // Store dynamic features
            $table->boolean('is_featured')->default(false)->index();
            
            $table->timestamps();
            $table->softDeletes(); // Adds deleted_at
        });
    }

    public function down(): void {
        Schema::dropIfExists('products');
    }
};

// ── Artisan CLI Masterclass ───────────────────────
php artisan make:migration create_users_table # Local Path
sail artisan make:migration create_users_table # Docker Path (✓)

php artisan migrate         # Run all pending migrations
sail artisan migrate         # → Run INSIDE Docker container

php artisan migrate:status   # View Ran/Pending/Batch history
sail artisan migrate:status  # → View history within Docker cluster`,
      output: `INFO  Running migrations.
  2026_01_01_000001_create_categories_table ... 14ms DONE
  2026_01_01_000002_create_products_table ..... 21ms DONE
  
php artisan migrate:status
+------+-------------------------------------------+-------+
| Ran? | Migration                                 | Batch |
+------+-------------------------------------------+-------+
| Yes  | 2026_01_01_000001_create_categories_table | 1     |
| Yes  | 2026_01_01_000002_create_products_table   | 1     |
+------+-------------------------------------------+-------+`,
    },
    concepts: [
      { term: "Anonymous Migration", def: "A feature that returns an anonymous class instance. It prevents class name collisions if you have multiple migrations with the same name (e.g. adding columns to the same table twice)." },
      { term: "migrate:fresh", def: "A destructive but useful command in local dev. It drops all tables and reruns everything from scratch. Always run with --seed to repopulate your test data." },
      { term: "Schema Builder", def: "A fluent interface provided by Laravel to interact with the database engine without writing raw SQL. It works across MySQL, PostgreSQL, SQLite, and SQL Server." },
      { term: "Batching", def: "Every time you run 'migrate', Laravel groups those migrations into a 'batch'. A rollback will undo the entire last batch, not just one file." },
    ],
    tip: "Always use nullable() for columns that aren't strictly required. Changing a column to nullable later via another migration is much harder than doing it right the first time.",
    project: null,
  },
  {
    id: "m06b", num: "06B", section: "Section 6 (cont.)", hours: "1.5h",
    title: "Advanced Schema & Seeding",
    titleKh: "Schema កម្រិតខ្ពស់ និងការ Seeding",
    goal: "Implement data integrity strategies and automate the generation of massive datasets",
    goalKh: "អនុវត្តយុទ្ធសាស្ត្រទិន្នន័យ និងការបង្កើតទិន្នន័យគំរូយ៉ាងច្រើនដោយស្វ័យប្រវត្តិ",
    color: "#46a1ff",
    badge: "DATABASE",
    topics: [
      { en: "Foreign Key constraints & Cascade strategies", kh: "Foreign Key constraints & Cascade strategies" },
      { en: "Composite Indexes for Query Optimization", kh: "Composite Indexes ដើម្បីបង្កើនល្បឿន Query" },
      { en: "Model Factories — generating 1,000s of realistic records", kh: "Model Factories — ការបង្កើតទិន្នន័យ Fake រាប់ពាន់" },
      { en: "Database Seeders — planning the initial app state", kh: "Database Seeders — ការរៀបចំទិន្នន័យដំបូងសម្រាប់ App" },
    ],
    lab: {
      title: "Industrial-Strength Seeding",
      titleKh: "ការបង្កើតទិន្នន័យ Fake កម្រិតអាជីព",
      duration: "60 min",
      objective: "Connect products to random users with realistic names and realistic timestamps",
      steps: [
        "Customize UserFactory to generate specific role-based users",
        "Scaffold with make:factory then define attributes using fake()",
        "Use the sequence() method to create alternating data types",
        "Set up DatabaseSeeder to call multiple specific seeders",
        "Run migrations and seeding in a single command",
        "Verify the new data in a DB manager (TablePlus or phpMyAdmin)",
      ],
      code: `// 1. Advanced Factory with Relationships
// database/factories/ProductFactory.php
public function definition(): array {
    return [
        'category_id' => Category::factory(), // Auto-creates a category!
        'name'        => fake()->unique()->sentences(1, true),
        'sku'         => 'PROD-' . fake()->unique()->postcode(),
        'price'       => fake()->randomFloat(2, 5, 2000),
        'stock_level' => fake()->numberBetween(0, 500),
        'attributes'  => ['color' => fake()->safeColorName()],
        'created_at'  => fake()->dateTimeBetween('-1 year', 'now'),
    ];
}

// 2. Seeding Strategy
// database/seeders/DatabaseSeeder.php
public function run(): void {
    // a. Create Fixed Data (for dev testing)
    Category::create(['name' => 'Laptops', 'slug' => 'laptops']);
    
    // b. Create Dynamic Volume
    Category::factory(10)->create()->each(function ($cat) {
        Product::factory(20)->create([
            'category_id' => $cat->id
        ]);
    });
}

// ── Artisan Generation & Seeding ──────────────────
# 1. Scaffolding
sail artisan make:factory ProductFactory
sail artisan make:seeder CategorySeeder

# 2. Executing
sail artisan db:seed                        # Run DatabaseSeeder
sail artisan db:seed --class=UserSeeder    # Run specific seeder
sail artisan migrate:fresh --seed         # THE DAILY RESET (Wipe, Migrate, Seed)`,
      output: `php artisan migrate:fresh --seed
INFO  Dropping all tables.
INFO  Running migrations.
INFO  Seeding database.
  √ Categories Table Seeded (10 records)
  √ Products Table Seeded (200 records)
  
Database seeding completed successfully.`,
    },
    concepts: [
      { term: "Consolidation", def: "Grouping your seeding logic. DatabaseSeeder should be the orchestrator that calls other specific seeders using $this->call()." },
      { term: "Faker Library", def: "A massive PHP library integrated into Laravel that generates realistic names, addresses, credit cards, images, and long-form text (fake() helper)." },
      { term: "Factory Sequencing", def: "Using Product::factory()->count(10)->sequence(['active' => true], ['active' => false]) to alternate states during generation." },
      { term: "Composite Index", def: "$table->index(['status', 'created_at']) — An index that spans two columns. Crucial for performance when you filter by status AND sort by date." },
    ],
    tip: "Artisan crafts the 'shell' of your factories with make:factory, but it's YOUR job to manually define the logic in the definition() method. Think of Artisan as the architect and Faker as the artist who paints the data.",
    project: null,
  },
  {
    id: "m07", num: "07", section: "Section 7", hours: "2h",
    title: "Eloquent ORM",
    titleKh: "Eloquent ORM",
    goal: "Work with database records as PHP objects — master CRUD, relationships, and query optimization",
    goalKh: "ប្រើ Database Records ដូច PHP Objects — CRUD, Relationships, Query Optimization",
    color: "#f5c842",
    badge: "ORM",
    topics: [
      { en: "Eloquent CRUD — create, find, update, delete fluently", kh: "Eloquent CRUD — create, find, update, delete" },
      { en: "Mass Assignment & $fillable/$guarded security", kh: "Mass Assignment & $fillable Security" },
      { en: "Relationships — hasMany, belongsTo, belongsToMany", kh: "Relationships — hasMany, belongsTo, belongsToMany" },
      { en: "Eager Loading & N+1 Query Problem", kh: "Eager Loading & N+1 Query Problem" },
    ],
    lab: {
      title: "Product CRUD in Tinker + Relationships",
      titleKh: "Product CRUD ក្នុង Tinker + Relationships",
      duration: "60 min",
      objective: "Perform all CRUD operations and query across relationships in Tinker",
      steps: [
        "Define $fillable in Product and Category models",
        "Define hasMany/belongsTo relationships",
        "Test all CRUD operations in php artisan tinker",
        "Demonstrate the N+1 problem, then fix it with with()",
        "Use scopes: Product::active()->expensive()->get()",
        "Test belongsToMany for a product-tags relationship",
      ],
      code: `// app/Models/Category.php
class Category extends Model
{
    protected $fillable = ['name', 'slug', 'description'];

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}

// app/Models/Product.php
class Product extends Model
{
    use SoftDeletes;

    protected $fillable = ['category_id','name','slug','price','stock'];

    protected $casts = [
        'price'  => 'decimal:2',
        'active' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Local scope
    public function scopeActive($query)  { return $query->where('active', true); }
    public function scopeInStock($query) { return $query->where('stock', '>', 0); }
}

// ── Tinker Demo ───────────────────────────────
// CREATE
Product::create(['category_id'=>1, 'name'=>'iPhone 15', 'price'=>999]);

// READ with relationships
Product::with('category')->active()->inStock()->paginate(15);

// UPDATE
Product::find(1)->update(['price' => 899]);

// SOFT DELETE (sets deleted_at, row remains)
Product::find(1)->delete();

// RESTORE
Product::withTrashed()->find(1)->restore();

// ── N+1 Demo ─────────────────────────────────
// BAD — runs 1 + N queries:
$products = Product::all();
foreach ($products as $p) { echo $p->category->name; } // N queries!

// GOOD — runs only 2 queries:
$products = Product::with('category')->get();`,
      output: `>>> Product::count()
=> 50

>>> Product::active()->inStock()->count()
=> 43

>>> Product::with('category')->first()->category->name
=> "Electronics"

>>> DB::getQueryLog()  // after eager loading
=> 2 queries total (vs 51 without eager loading)`,
    },
    concepts: [
      { term: "Eloquent Model", def: "One class = one table. class Product extends Model automatically links to the products table. No configuration needed." },
      { term: "$fillable", def: "Security whitelist. Only columns in $fillable can be set via ::create() or ->update(). Prevents mass assignment attacks." },
      { term: "Eager Loading", def: "Product::with('category')->get() runs 2 queries: one for products, one for all related categories. Without it: 1 + N queries." },
      { term: "Local Scope", def: "scopeActive($query) lets you chain ->active() on any query. Keeps complex queries readable: Product::active()->inStock()->get()." },
    ],
    tip: "Demonstrate the N+1 problem visually using DB::enableQueryLog(). Print the query count before and after with(). Students never forget this lesson.",
    project: null,
  },
  {
    id: "m07b", num: "07B", section: "Section 7 (cont.)", hours: "1.5h",
    title: "Eloquent Relationships Deep Dive",
    titleKh: "ទំនាក់ទំនង Eloquent (1-1, 1-N, M-M)",
    goal: "Master the three core relationship types and how to manipulate pivot data",
    goalKh: "ស្ទាត់ជំនាញលើទំនាក់ទំនង Database ទាំង ៣ ប្រភេទ និងការប្រើប្រាស់ Pivot Table",
    color: "#f5c842",
    badge: "ORM",
    topics: [
      { en: "One-to-One (1:1) — User hasOne Profile", kh: "1:1 (One-to-One) — hasOne & belongsTo" },
      { en: "One-to-Many (1:N) — Category hasMany Products", kh: "1:N (One-to-Many) — hasMany & belongsTo" },
      { en: "Many-to-Many (M:N) — Product belongsToMany Tags", kh: "M:N (Many-to-Many) — belongsToMany (Pivot Table)" },
      { en: "Pivot Operations — attach, detach, sync, toggle", kh: "Pivot Operations — attach, detach, sync, toggle" },
    ],
    lab: {
      title: "Building a Tagging System",
      titleKh: "បង្កើតប្រព័ន្ធ Tagging សម្រាប់ Products",
      duration: "60 min",
      objective: "Implement a Many-to-Many relationship between Products and Tags including a pivot table",
      steps: [
        "Create Tag model and 'tags' table migration",
        "Create 'product_tag' pivot table migration (alphabetical order!)",
        "Define belongsToMany relationship in both models",
        "Practice attaching tags to a product in Tinker",
        "Use sync([1, 2, 3]) to update tags without duplicates",
        "Display product tags in the Blade view",
      ],
      code: `// 1. Pivot Table Migration (database/migrations/..._create_product_tag_table.php)
Schema::create('product_tag', function (Blueprint $table) {
    $table->id();
    $table->foreignId('product_id')->constrained()->cascadeOnDelete();
    $table->foreignId('tag_id')->constrained()->cascadeOnDelete();
    $table->timestamps();
});

// 2. Defining Relationships
// app/Models/Product.php
public function tags() {
    return $this->belongsToMany(Tag::class)->withTimestamps();
}

// app/Models/Tag.php
public function products() {
    return $this->belongsToMany(Product::class);
}

// ── 3. Pivot Operations in Controller or Tinker ───────────────
$product = Product::find(1);
$tagIds  = [1, 5, 8];

// attach() -> adds new records (may create duplicates!)
$product->tags()->attach(1); 

// detach() -> removes records
$product->tags()->detach(1);

// sync() -> THE BEST: removes all others, sets only these IDs
$product->tags()->sync($tagIds);

// toggle() -> if exists remove, if not add
$product->tags()->toggle(2);

// ── 4. Querying ──────────────────────────────────────────────
// Find products that have a specific tag
$products = Product::whereHas('tags', function($q) {
    $q->where('name', 'Promotion');
})->get();`,
      output: `>>> $product->tags()->sync([1, 2])
=> [
     "attached" => [1, 2],
     "detached" => [],
     "updated"  => [],
   ]
   
>>> $product->tags->pluck('name')
=> ["Electronics", "New Arrival"]`,
    },
    concepts: [
      { term: "Pivot Table", def: "An intermediate table used for Many-to-Many relationships. It usually follows alphabetical naming (e.g., product_tag) and contains foreign keys to both related tables." },
      { term: "sync()", def: "One of the most powerful Eloquent methods. It takes an array of IDs and ensures ONLY those IDs are associated in the pivot table. It handles all attaching and detaching automatically." },
      { term: "withTimestamps()", def: "By default, pivot tables don't update created_at/updated_at. Adding ->withTimestamps() to the relationship definition enables this." },
      { term: "whereHas()", def: "Filter your query based on a relationship's existence or properties. Example: 'Get all users who have at least one post'." },
    ],
    tip: "For Many-to-Many, always use sync(). It prevents 99% of duplicate data bugs in your pivot tables. Also, remember the alphabetical order rule for pivot table naming if you want to follow Laravel conventions easily.",
    project: null,
  },
  {
    id: "m08", num: "08", section: "Section 8", hours: "1.5h",
    title: "Forms & Validation",
    titleKh: "Forms & Validation",
    goal: "Handle user input safely — build forms with CSRF protection and server-side validation",
    goalKh: "គ្រប់គ្រង Input ដោយសុវត្ថិភាព — Forms, CSRF, Validation",
    color: "#ff6bb5",
    badge: "SECURITY",
    topics: [
      { en: "CSRF Protection — how @csrf prevents attacks", kh: "CSRF Protection — @csrf ការពារការវាយប្រហារ" },
      { en: "Built-in validation rules — required, unique, exists", kh: "Validation Rules — required, unique, exists, regex" },
      { en: "Form Request classes — keeping controllers thin", kh: "Form Request Classes — Controller ស្អាតតូច" },
      { en: "Error display with @error and old() helper", kh: "Error Display ជាមួយ @error និង old()" },
    ],
    lab: {
      title: "Product Create & Edit Forms",
      titleKh: "Form Create ​& Edit Product",
      duration: "60 min",
      objective: "Build validated forms for creating and editing products with error display",
      steps: [
        "Build create.blade.php with @csrf and all product fields",
        "Create: php artisan make:request StoreProductRequest",
        "Create: php artisan make:request UpdateProductRequest",
        "Define validation rules in rules() method",
        "Implement error display with @error('field') blocks",
        "Use old('name') to refill fields on validation failure",
      ],
      code: `{{-- resources/views/products/create.blade.php --}}
<form method="POST" action="{{ route('products.store') }}" enctype="multipart/form-data">
    @csrf

    {{-- Name field with error --}}
    <div>
        <label>Product Name</label>
        <input type="text" name="name" value="{{ old('name') }}"
               class="{{ $errors->has('name') ? 'border-red-500' : '' }}">
        @error('name')
            <p class="text-red-500">{{ $message }}</p>
        @enderror
    </div>

    {{-- Price --}}
    <div>
        <label>Price ($)</label>
        <input type="number" name="price" step="0.01" value="{{ old('price') }}">
        @error('price') <p>{{ $message }}</p> @enderror
    </div>

    <button type="submit">Create Product</button>
</form>

// app/Http/Requests/StoreProductRequest.php
class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // or: auth()->check()
    }

    public function rules(): array
    {
        return [
            'name'        => ['required', 'string', 'max:255', 'unique:products,name'],
            'category_id' => ['required', 'exists:categories,id'],
            'price'       => ['required', 'numeric', 'min:0'],
            'stock'       => ['integer', 'min:0'],
            'image'       => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'description' => ['nullable', 'string', 'max:5000'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.unique' => 'A product with this name already exists.',
        ];
    }
}

// ProductController.php
public function store(StoreProductRequest $request)
{
    // $request->validated() only contains validated fields
    Product::create($request->validated());
    return redirect()->route('products.index')
                     ->with('success', 'Product created!');
}`,
      output: `Validation PASS → Product created! → redirect to /products
Validation FAIL → redirect back with $errors + old() data

$errors contents on failure:
  name:  "The name has already been taken."
  price: "The price field is required."`,
    },
    concepts: [
      { term: "@csrf", def: "Inserts a hidden token into your form. Laravel verifies it on every POST/PUT/DELETE. Prevents cross-site forgery attacks automatically." },
      { term: "Form Request", def: "A dedicated class (make:request) with rules() and authorize(). Validation runs before your controller method is even called." },
      { term: "old('field')", def: "Returns the user's previously submitted value. use old('name') as the input value so fields aren't empty after a validation failure." },
      { term: "unique:table,column", def: "Validation rule that queries the DB. 'unique:products,name' fails if any row in products already has that name." },
    ],
    tip: "Show the network tab in DevTools. Students see the POST request, the 422 response with errors, and the redirect. It demystifies how forms work end-to-end.",
    project: null,
  },
  {
    id: "m09a", num: "09A", section: "Section 9", hours: "1h",
    title: "Complete CRUD — Base Setup (DB & Model)",
    titleKh: "CRUD — ការរៀបចំ Database & Model",
    goal: "Architect the database schema and configure the Product model for mass assignment and relationships",
    goalKh: "រៀបចំ Table Schema និង Model Configuration សម្រាប់ការធ្វើ CRUD",
    color: "#38c9c9",
    badge: "CORE LAB",
    topics: [
      { en: "Migration Blueprint — name, price, image columns", kh: "Migration Blueprint — ការបង្កើត Table Columns" },
      { en: "Foreign Keys — connecting Products to Categories", kh: "Foreign Keys — ការភ្ជាប់ Products ទៅ Categories" },
      { en: "Model Security — $fillable whitelist prevention", kh: "Model Security — ការការពារដោយ $fillable" },
      { en: "Eloquent Casting — automated data transformation", kh: "Eloquent Casting — ការបំប្លែងប្រភេទ Data ក្នុង Model" },
      { en: "Model Relationships — BelongsTo category linkage", kh: "Model Relationships — ការភ្ជាប់ Model ជាមួយ Model ផ្សេង" },
    ],
    lab: {
      title: "Base Infrastructure Setup",
      titleKh: "ការរៀបចំគ្រឹះនៃ Database & Model",
      duration: "30 min",
      objective: "Create the products table migration and configure the Product model for a secure CRUD flow",
      steps: [
        "Create migration & model: php artisan make:model Product -m",
        "Define migration schema (price: decimal, description: text, has image)",
        "Implement constrained foreign key for category_id",
        "Configure $fillable in Product model to whitelist inputs",
        "Add $casts for price (decimal:2) and is_active (boolean)",
        "Establish belongsTo relationship with Category model",
      ],
      code: `// 1. DATABASE MIGRATION
// database/migrations/xxxx_xx_xx_xxxxxx_create_products_table.php
public function up(): void {
    Schema::create('products', function (Blueprint $table) {
        $table->id();
        $table->foreignId('category_id')->constrained()->onDelete('cascade');
        $table->string('name');
        $table->text('description')->nullable();
        $table->decimal('price', 10, 2);
        $table->string('image')->nullable();
        $table->boolean('is_active')->default(true);
        $table->timestamps();
    });
}

// 2. ELOQUENT MODEL
// app/Models/Product.php
class Product extends Model {
    // Security: Only these fields can be mass-assigned
    protected $fillable = [
        'category_id', 'name', 'description', 
        'price', 'image', 'is_active'
    ];

    // Consistency: Automatically convert types on access
    protected $casts = [
        'price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    // Relationship: Product belongs to one Category
    public function category() {
        return $this->belongsTo(Category::class);
    }
}

// 3. CATEGORY MODEL RELATIONSHIP
// app/Models/Category.php
public function products() {
    return $this->hasMany(Product::class);
}`,
      output: `Migration status: migrated ✓
        
Table "products" schema:
  - category_id: constrained foreign key
  - price: exact decimal(10,2) for money
  - $fillable protects against mass assignment
  - relationships ready for eager loading`,
    },
    concepts: [
      { term: "Schema::create()", def: "Blueprint for your DB. decimal(10,2) is essential for prices (stores exactly 10 digits total, 2 after dot) to avoid floating point math errors." },
      { term: "foreignId()", def: "Creates a column and index. constrained() tells Laravel this column belongs to the 'categories' table automatically." },
      { term: "$fillable", def: "A security whitelist. Prevents 'Mass Assignment' attacks where a hacker sends admin=1 in a POST request to make themselves an admin." },
      { term: "belongsTo()", def: "Defines the 'inverse' relationship. Lets you access $product->category->name without writing complex SQL joins." },
    ],
    tip: "Remind students: Never use plain 'float' or 'double' for currency! Always use 'decimal' to ensure 100% accuracy in financial transactions.",
    project: null,
  },
  {
    id: "m09b", num: "09B", section: "Section 9", hours: "1h",
    title: "Complete CRUD — Index (Viewing & Search)",
    titleKh: "CRUD — Index (ការបង្ហាញ & ការស្វែងរក)",
    goal: "Build a professional product listing page with pagination and multi-field search",
    goalKh: "បង្កើតទំព័របញ្ជីផលិតផល ដែលមានការបែងចែកទំព័រ និងការស្វែងរក",
    color: "#38c9c9",
    badge: "CORE LAB",
    topics: [
      { en: "Search queries with when() and like operator", kh: "ស្វែងរក Query ជាមួយ when() និង like operator" },
      { en: "Pagination with paginate() and links()", kh: "ការបែងចែកទំព័រ (Pagination) ប្រើ paginate()" },
      { en: "Eager Loading with with() to prevent N+1 issues", kh: "Eager Loading ការពារបញ្ហា N+1" },
      { en: "Blade @forelse pattern for empty states", kh: "Blade @forelse សម្រាប់បង្ហាញពេលគ្មានទិន្នន័យ" },
    ],
    lab: {
      title: "The Product Listing Page",
      titleKh: "ទំព័របញ្ជីផលិតផល",
      duration: "30 min",
      objective: "List all products from the database with category info and search",
      steps: [
        "Create ProductController and define index() method",
        "Implement 'when' search logic for name or description",
        "Add latest() and paginate(12) to the query",
        "In index.blade.php, use @forelse to loop through products",
        "Add search form that submits to the same route via GET",
        "Render {{ $products->links() }} at the bottom",
      ],
      code: `// ProductController.php
public function index(Request $request)
{
    $products = Product::with('category')  // Eager load category
        ->when($request->search, function ($query, $search) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
        })
        ->latest()
        ->paginate(12)
        ->withQueryString(); // Keep search params fixed

    return view('products.index', compact('products'));
}

{{-- products/index.blade.php --}}
<form action="{{ route('products.index') }}" method="GET" class="mb-4">
    <input type="text" name="search" value="{{ request('search') }}" placeholder="Search products...">
    <button type="submit">Search</button>
</form>

<table class="w-full">
    @forelse($products as $product)
        <tr>
            <td>{{ $product->name }}</td>
            <td>{{ $product->category->name }}</td>
            <td>$ {{ number_format($product->price, 2) }}</td>
            <td>
                <a href="{{ route('products.show', $product) }}">View</a>
            </td>
        </tr>
    @empty
        <tr><td colspan="4">No products found for "{{ request('search') }}".</td></tr>
    @endforelse
</table>

<div class="mt-4">
    {{ $products->links() }}
</div>`,
      output: `GET /products?search=macbook
          
Showing 1-12 of 45 products for "macbook"
  [✓] Products listed with category names
  [✓] Search works for name & description
  [✓] Pagination links appear and work
  [✓] Zero items show fallback message`,
    },
    concepts: [
      { term: "paginate()", def: "Runs two queries: one for items, one for total count. Returns a Paginator instance with methods helper UI generation." },
      { term: "withQueryString()", def: "Attaches current GET parameters to your pagination links. Without it, clicking Page 2 loses your search filters." },
      { term: "Eager Loading", def: "Product::with('category') loads all categories in one query. Without it, Laravel queries the DB for every single row (N+1 problem)." },
      { term: "@forelse", def: "Combines @foreach and @if count check. Cleaner code: loop if data exists, else render the @empty block." },
    ],
    tip: "Show the N+1 problem in Clockwork or Laravel Debugbar. Students understand Eager Loading immediately when they see 50 queries turn into 2.",
    project: null,
  },
  {
    id: "m09c", num: "09C", section: "Section 9", hours: "1h",
    title: "Complete CRUD — Create & Store (Data Entry)",
    titleKh: "CRUD — Create & Store (ការបញ្ចូលទិន្នន័យ)",
    goal: "Handle product creation with professional validation and file uploads",
    goalKh: "គ្រប់គ្រងការបង្កើតផលិតផល ជាមួយការត្រួតពិនិត្យទិន្នន័យ និងការ Upload រូបភាព",
    color: "#38c9c9",
    badge: "CORE LAB",
    topics: [
      { en: "Form Request classes for clean validation", kh: "Form Request Classes សម្រាប់ Validation" },
      { en: "File handling with store() and Storage disk", kh: "ការគ្រប់គ្រង File ជាមួយ store() និង Storage Disk" },
      { en: "Handling CSRF security with @csrf", kh: "ការពារសុវត្ថិភាពជាមួយ @csrf" },
      { en: "Old input preservation with old()", kh: "រក្សាទុកទិន្នន័យចាស់ដែលវាយខុសដោយ old()" },
    ],
    lab: {
      title: "Build the Creation Flow",
      titleKh: "បង្កើត Flow នៃការបញ្ចូលទិន្នន័យ",
      duration: "30 min",
      objective: "Create a secure form to upload products with images and validation",
      steps: [
        "Run php artisan make:request StoreProductRequest",
        "Define validation rules: name:required, image:mimes, price:numeric",
        "In controller, implement create() to show the form",
        "Implement store() to save data and file",
        "In create.blade.php, add @csrf and old('name') helpers",
        "Display validation errors using @error('field')",
      ],
      code: `// StoreProductRequest.php
public function rules(): array {
    return [
        'name'        => 'required|unique:products|max:255',
        'category_id' => 'required|exists:categories,id',
        'price'       => 'required|numeric|min:0',
        'image'       => 'nullable|image|max:2048', // 2MB max
    ];
}

// ProductController.php
public function create() {
    $categories = Category::all();
    return view('products.create', compact('categories'));
}

public function store(StoreProductRequest $request) {
    $data = $request->validated();

    if ($request->hasFile('image')) {
        $data['image'] = $request->file('image')->store('products', 'public');
    }

    Product::create($data);
    return redirect()->route('products.index')->with('success', 'Product created!');
}

{{-- products/create.blade.php --}}
<form action="{{ route('products.store') }}" method="POST" enctype="multipart/form-data">
    @csrf
    <div>
        <label>Name</label>
        <input type="text" name="name" value="{{ old('name') }}">
        @error('name')<p class="error">{{ $message }}</p>@enderror
    </div>
    <button type="submit">Save Product</button>
</form>`,
      output: `POST /products
Validated data → Image stored → Row created
  [✓] CSRF protects the submission
  [✓] Validation fails if name exists
  [✓] Image appears in storage/app/public/products
  [✓] Form doesn't clear on error (old() works)`,
    },
    concepts: [
      { term: "Form Request", def: "Dedicated classes that clean up controllers. They run authorize() and rules() before your method even starts." },
      { term: "Image Validation", def: "The 'image' rule ensures it's a real JPEG/PNG/WebP, not a renamed .exe file with malicious code." },
      { term: "enctype", def: "Required for file uploads: <form enctype=\"multipart/form-data\">. Without it, $request->file() will always be null." },
      { term: "Mass Assignment", def: "Product::create($data) requires $fillable to be defined in the Model for security." },
    ],
    tip: "Explain why we separate StoreProductRequest. It makes the controller easier to read and allows injecting the same validation into different methods.",
    project: null,
  },
  {
    id: "m09d", num: "09D", section: "Section 9", hours: "1h",
    title: "Complete CRUD — Edit & Update (Modification)",
    titleKh: "CRUD — Edit & Update (ការកែប្រែ)",
    goal: "Modify existing records and handle image swaps correctly",
    goalKh: "កែប្រែទិន្នន័យចាស់ និងគ្រប់គ្រងការផ្លាស់ប្តូររូបភាព",
    color: "#38c9c9",
    badge: "CORE LAB",
    topics: [
      { en: "Method Spoofing with @method('PUT')", kh: "Method Spoofing ជាមួយ @method('PUT')" },
      { en: "Route Model Binding automatic lookup", kh: "Route Model Binding បញ្ជូន Model មកស្រាប់" },
      { en: "Image Replacement: delete old, store new", kh: "ការផ្លាស់ប្តូររូបភាព: លុបចាស់ ជំនួសថ្មី" },
      { en: "Unique validation isolation during update", kh: "ការកំណត់ Unique Validation ពេល Update" },
    ],
    lab: {
      title: "Update Flow & Method Spoofing",
      titleKh: "Update Flow & Method Spoofing",
      duration: "30 min",
      objective: "Build an edit form that handles existing product data carefully",
      steps: [
        "In controller, implement edit(Product $product) using model binding",
        "Implement update(UpdateProductRequest $request, Product $product)",
        "In updateRequest, handle unique constraint (ignore self)",
        "Implement logic to delete old image file if a new one is uploaded",
        "Create edit.blade.php with @method('PUT') inside the form",
      ],
      code: `// UpdateProductRequest.php
public function rules(): array {
    return [
        'name' => 'required|max:255|unique:products,name,' . $this->product->id,
        'image' => 'nullable|image',
    ];
}

// ProductController.php
public function edit(Product $product) {
    return view('products.edit', compact('product'));
}

public function update(UpdateProductRequest $request, Product $product) {
    $data = $request->validated();
    
    if ($request->hasFile('image')) {
        // Delete old image file
        Storage::disk('public')->delete($product->image);
        $data['image'] = $request->file('image')->store('products', 'public');
    }

    $product->update($data);
    return redirect()->route('products.index')->with('success', 'Updated!');
}

{{-- products/edit.blade.php --}}
<form action="{{ route('products.update', $product) }}" method="POST">
    @csrf
    @method('PUT') {{-- Spoof PUT method --}}
    
    <input type="text" name="name" value="{{ old('name', $product->name) }}">
    <button>Save Changes</button>
</form>`,
      output: `PUT /products/12
Model found → Old image deleted → New data saved
  [✓] @method('PUT') tells Laravel this is an update
  [✓] Unique validation doesn't fail on own name
  [✓] Storage doesn't get cluttered with orphaned files`,
    },
    concepts: [
      { term: "Method Spoofing", def: "HTML forms don't support PUT/PATCH/DELETE. @method('PUT') adds a hidden input that Laravel uses to route correctly." },
      { term: "Unique:ignore", def: "When updating, you MUST tell the unique rule to ignore the current ID, otherwise it thinks the record it's updating is a duplicate." },
      { term: "Disk Cleanup", def: "Always delete the old file when replacing it to save server space. Storage::delete() is your friend here." },
    ],
    tip: "Ask students: 'If you upload a 5MB image 10 times during editing, how much space do you use?' Without cleanup, 50MB. With cleanup, just 5MB.",
    project: null,
  },
  {
    id: "m09e", num: "09E", section: "Section 9", hours: "0.5h",
    title: "Complete CRUD — Delete & Feedback",
    titleKh: "CRUD — Delete & Flash Messages",
    goal: "Handle safe deletion and provide proper user feedback",
    goalKh: "គ្រប់គ្រងការលុបដោយសុវត្ថិភាព និងផ្ដល់ Feedback ដល់ User",
    color: "#38c9c9",
    badge: "CORE LAB",
    topics: [
      { en: "Method Spoofing with @method('DELETE')", kh: "Method Spoofing ជាមួយ @method('DELETE')" },
      { en: "Flash Messages with session() helper", kh: "Flash Messages ជាមួយ session() helper" },
      { en: "User feedback loops and confirmation UI", kh: "Feedback Loops និង Confirmation UI" },
      { en: "Route Resource summary", kh: "សង្ខេប Route Resource" },
    ],
    lab: {
      title: "Delete button & Feedback System",
      titleKh: "Delete Button & Feedback System",
      duration: "15 min",
      objective: "Add a delete button and show success alerts on the index page",
      steps: [
        "In controller, implement destroy() with image deletion",
        "Add a delete form to the index.blade.php for each row",
        "Use onclick=\"return confirm('...')\" for safety",
        "Add a flash message alert to your layouts/app.blade.php",
      ],
      code: `// ProductController.php
public function destroy(Product $product) {
    Storage::disk('public')->delete($product->image);
    $product->delete();
    
    return redirect()->route('products.index')
        ->with('success', 'Product deleted forever!');
}

{{-- products/index.blade.php --}}
<form action="{{ route('products.destroy', $product) }}" method="POST">
    @csrf
    @method('DELETE')
    <button type="submit" onclick="return confirm('Are you sure?')">
        Delete
    </button>
</form>

{{-- layouts/app.blade.php --}}
@if(session('success'))
    <div class="alert success">
        {{ session('success') }}
    </div>
@endif`,
      output: `DELETE /products/12
Record deleted → Redirect → Flash message shown
  [✓] confirm() prevents accidental clicks
  [✓] Flash message disappears after one reload
  [✓] Route::resource handles all 7 methods correctly`,
    },
    concepts: [
      { term: "Flash Message", def: "Flash messages are stored in the session for ONLY one subsequent request. They are perfect for redirect success feedback." },
      { term: "confirm()", def: "A simple JS browser helper to ensure user intent. Essential for destructive actions like DELETE." },
      { term: "session()", def: "The session() helper can be used to read, write, or flash data to the user's permanent server-side session store." },
    ],
    tip: "Finish the CRUD section by showing the full 'Route::resource('products', ...)' command and explaining how it automates all these URLs.",
    project: "Mini-Project 1: Complete Product CRUD with categories, image upload, search, and pagination. Deploy to local environment and show it working.",
  },

  {
    id: "m10a", num: "10A", section: "Section 10", hours: "1h",
    title: "Auth Installation & Breeze Scaffolding",
    titleKh: "ការដំឡើង និងការរៀបចំ Breeze Auth",
    goal: "Deploy a complete authentication system in minutes using Laravel Breeze scaffolding",
    goalKh: "ដំឡើងប្រព័ន្ធ Login/Register ពេញលេញដោយប្រើ Laravel Breeze",
    color: "#ff8c42",
    badge: "AUTH",
    topics: [
      { en: "Laravel Breeze — starter kit for simple auth", kh: "Laravel Breeze — Starter Kit សម្រាប់ Auth" },
      { en: "Installation flow — composer, artisan, npm", kh: "លំហូរនៃការដំឡើង — composer, artisan, npm" },
      { en: "Understanding built-in auth routes & views", kh: "ស្វែងយល់ពី Routes និង Views របស់ Auth" },
      { en: "The Users table migration and password hashing", kh: "ការរៀបចំ Table Users និង Password Hashing" },
    ],
    lab: {
      title: "Zero-to-Auth Setup",
      titleKh: "ការរៀបចំ Auth ពីចំណុចសូន្យ",
      duration: "30 min",
      objective: "Install Laravel Breeze and perform your first registration and login",
      steps: [
        "Run: composer require laravel/breeze --dev",
        "Run: php artisan breeze:install blade",
        "Run: php artisan migrate to create the users table",
        "Run: npm install && npm run dev for frontend assets",
        "Test /register and /login routes in your browser",
        "Verify your new user in the database using TablePlus/HeidiSQL",
      ],
      code: `# 1. INSTALL STARTER KIT
composer require laravel/breeze --dev

# 2. RUN SCAFFOLDING (Blade Version)
php artisan breeze:install blade

# 3. SETUP DATABASE
php artisan migrate

# 4. COMPILE FRONTEND ASSETS
npm install && npm run dev

#  ══════════════════════════════════════════════════════
# Breeze creates these critical endpoints:
# ══════════════════════════════════════════════════════
GET  /login             -> login form
POST /login             -> AuthenticateSession
GET  /register          -> registration form
POST /register          -> RegisteredUserController
GET  /forgot-password   -> password reset request
POST /logout            -> AuthenticatedSessionController@destroy`,
      output: `Breeze Installation SUCCESS ✓
        
New files created:
  - app/Http/Controllers/Auth/
  - resources/views/auth/
  - resources/views/dashboard.blade.php
  - database/migrations/0001_01_01_000000_create_users_table.php`,
    },
    concepts: [
      { term: "Breeze", def: "A minimal, clean starter kit for authentication. It uses plain Blade templates and Tailwind CSS, making it easy to customize." },
      { term: "Migrations", def: "Breeze adds the users, password_reset_tokens, and sessions tables to your migration folder automatically." },
      { term: "Bcrypt", def: "Laravel never stores plain-text passwords. Breeze uses the Bcrypt hashing algorithm to encrypt passwords before saving them to the DB." },
      { term: "Starter Kit", def: "A set of pre-written controllers and views. It saves days of work and follows security best practices (rate limiting, secure sessions)." },
    ],
    tip: "Explain why we don't build auth from scratch: Security is hard. Breeze handles rate limiting, session hijacking prevention, and password resets correctly out of the box.",
    project: null,
  },
  {
    id: "m10b", num: "10B", section: "Section 10", hours: "1h",
    title: "Route Protection & Auth Middleware",
    titleKh: "ការការពារ Route ជាមួយ Middleware",
    goal: "Secure your application by restricting routes to authenticated users only",
    goalKh: "ការពារប្រព័ន្ធដោយអនុញ្ញាតឱ្យតែអ្នក Login រួចប៉ុណ្ណោះប្រើប្រាស់",
    color: "#ff8c42",
    badge: "AUTH",
    topics: [
      { en: "The 'auth' middleware — preventing guest access", kh: "Middleware 'auth' — ការពារភ្ញៀវមិនឱ្យចូល" },
      { en: "Grouping protected routes for efficiency", kh: "ការបែងចែកក្រុម Protected Routes" },
      { en: "The 'guest' middleware — redirecting logged-in users", kh: "Middleware 'guest' — ការបង្វែរទិសដៅសម្រាប់ User" },
      { en: "Customizing the redirect path (Login Response)", kh: "ការកំណត់ផ្លូវ Redirect បន្ទាប់ពី Login" },
    ],
    lab: {
      title: "Securing the CRUD System",
      titleKh: "ការពារប្រព័ន្ធ CRUD របស់អ្នក",
      duration: "30 min",
      objective: "Block guest users from accessing the product management system",
      steps: [
        "In routes/web.php, create a middleware('auth') group",
        "Move the Product Resource routes inside the group",
        "Try to access /products while logged out (verify redirect to /login)",
        "Implement a custom redirect after login in RouteServiceProvider",
        "Add a public '/shop' route that remains accessible to everyone",
      ],
      code: `// routes/web.php

// 1. PROTECTED ROUTES (Must be logged in)
Route::middleware(['auth'])->group(function () {
    // These routes will redirect to /login if you are a guest
    Route::resource('products', ProductController::class);
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
});

// 2. PUBLIC ROUTES (Anyone can access)
Route::get('/', function () { 
    return view('welcome'); 
});
Route::get('/shop', [ShopController::class, 'index'])->name('shop.index');

// 3. GUEST ONLY ROUTES (Redirects to /dashboard if logged in)
Route::middleware(['guest'])->group(function () {
    // Registration/Login forms handled by Breeze in auth.php
});`,
      output: `GET /products (logged out)  -> 302 Redirect to /login
GET /products (logged in)   -> 200 OK (Product List)
GET /shop     (anyone)      -> 200 OK (Public Store)`,
    },
    concepts: [
      { term: "Middleware", def: "A 'filter' that runs before your controller. The 'auth' middleware checks if a session exists; if not, it redirects to the login page." },
      { term: "Route Grouping", def: "Applying properties (like middleware or prefixes) to multiple routes at once. Keeps web.php clean and readable." },
      { term: "Authenticated session", def: "When a user logs in, Laravel stores their ID in the server session and gives the browser a 'cookie'. This is how it remembers who you are." },
    ],
    tip: "Show students how to check the 'laravel_session' cookie in the Application tab of Chrome DevTools. It demystifies how the server knows they are logged in.",
    project: null,
  },
  {
    id: "m10c", num: "10C", section: "Section 10", hours: "1h",
    title: "Auth UI Directives & User State",
    titleKh: "Blade Auth Directives & បញ្ហា User State",
    goal: "Create a dynamic UI that adapts based on the user's authentication status",
    goalKh: "បង្កើត UI ដែលផ្លាស់ប្តូរទៅតាមស្ថានភាព Login របស់អ្នកប្រើប្រាស់",
    color: "#ff8c42",
    badge: "AUTH",
    topics: [
      { en: "@auth and @guest Blade directives", kh: "Blade Directives — @auth និង @guest" },
      { en: "Accessing the logged-in user: Auth::user()", kh: "ការហៅប្រើប្រាស់ User — Auth::user()" },
      { en: "Displaying user profile info (Name, Role, Email)", kh: "បង្ហាញព័ត៌មាន Profile (ឈ្មោះ, តួនាទី, Email)" },
      { en: "The Logout pattern: POST request with CSRF", kh: "លំហូរនៃការ Logout: POST Request + CSRF" },
    ],
    lab: {
      title: "Building a Smart Navbar",
      titleKh: "ការបង្កើត Navbar ឆ្លាតវៃ",
      duration: "30 min",
      objective: "Build a navigation bar that shows login/register for guests and a user menu for members",
      steps: [
        "In navigation.blade.php, use @auth to show the 'Logout' button",
        "Use @guest to show 'Login' and 'Sign Up' links",
        "Display the current user's name using {{ Auth::user()->name }}",
        "Add a fallback for profile photos if one isn't set",
        "Implement a proper Logout form using POST method",
      ],
      code: `{{-- resources/views/layouts/navigation.blade.php --}}
<nav>
    <a href="/">Home</a>
    <a href="/shop">Shop</a>

    @auth
        {{-- Show only to logged-in users --}}
        <span>Welcome, {{ Auth::user()->name }}!</span>
        <a href="/dashboard">Dashboard</a>

        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit">Log Out</button>
        </form>
    @endauth

    @guest
        {{-- Show only to guests --}}
        <a href="/login">Login</a>
        <a href="/register">Create Account</a>
    @endguest
</nav>

{{-- Conditional Logic in View --}}
@auth
    @if(Auth::user()->is_admin)
        <a href="/admin">Admin Panel</a>
    @endif
@endauth`,
      output: `Header state (Guest):  [Home] [Shop] [Login] [Register]
Header state (Member): [Home] [Shop] [Welcome, Dara!] [Dashboard] [Logout]`,
    },
    concepts: [
      { term: "@auth", def: "A Blade shortcut: @auth ... @endauth. Anything inside only renders if the user has an active session." },
      { term: "@guest", def: "The opposite of @auth. Great for hiding login forms from people who are already logged in." },
      { term: "Auth facade", def: "Auth::user() returns the entire User model instance. Auth::id() returns just the numeric ID. Auth::check() returns true/false." },
      { term: "Logout POST", def: "Logout MUST be a POST request to prevent accidental logouts via simple GET links. Always include @csrf in the logout form." },
    ],
    tip: "Explain that Auth::user() is available in every Blade file and Controller. It's the most used class in any authenticated Laravel application.",
    project: "Final CRUD Polish: Secure all management routes. Update the layout to show the user's name and a logout button. Test the entire flow as a guest vs. a user.",
  },
  {
    id: "m11", num: "11", section: "Section 11", hours: "1.5h",
    title: "Authorization & Policies",
    titleKh: "Authorization & Policies",
    goal: "Control what each authenticated user is allowed to do — policies, gates, and roles",
    goalKh: "គ្រប់គ្រងសិទ្ធិ User — Policies, Gates, Roles",
    color: "#52e3a0",
    badge: "SECURITY",
    topics: [
      { en: "Authentication vs Authorization — two different problems", kh: "Authentication vs Authorization — ២ បញ្ហាផ្សេងគ្នា" },
      { en: "Gates — closure-based permission checks", kh: "Gates — Permission Check ដោយ Closure" },
      { en: "Policies — model-specific authorization classes", kh: "Policies — Authorization Classes ជាក់លាក់សម្រាប់ Model" },
      { en: "Role-based access — admin, editor, user", kh: "Role-based Access — admin, editor, user" },
    ],
    lab: {
      title: "Product Policy — Owner & Admin Rules",
      titleKh: "Product Policy — Owner ​& Admin",
      duration: "60 min",
      objective: "Ensure only product owners or admins can edit/delete; use @can in Blade",
      steps: [
        "Add role column to users: make:migration add_role_to_users_table",
        "Create: php artisan make:policy ProductPolicy --model=Product",
        "Implement update() and delete() methods",
        "Use $this->authorize('update', $product) in controller",
        "Add @can('update', $product) guards in Blade views",
        "Test with two user accounts (owner + different user)",
      ],
      code: `// Add role to users table
Schema::table('users', function (Blueprint $table) {
    $table->enum('role', ['user', 'editor', 'admin'])->default('user');
});

// app/Policies/ProductPolicy.php
class ProductPolicy
{
    // Can they view any products? (for index)
    public function viewAny(User $user): bool
    {
        return true;
    }

    // Can they edit THIS product?
    public function update(User $user, Product $product): bool
    {
        return $user->id === $product->user_id
            || $user->role === 'admin';
    }

    // Can they delete THIS product?
    public function delete(User $user, Product $product): bool
    {
        return $user->id === $product->user_id
            || $user->role === 'admin';
    }
}

// ProductController.php
public function update(UpdateProductRequest $request, Product $product)
{
    $this->authorize('update', $product);
    // ↑ Throws 403 automatically if policy returns false

    $product->update($request->validated());
    return redirect()->route('products.index');
}

// Blade — hide buttons based on policy
@can('update', $product)
    <a href="{{ route('products.edit', $product) }}">Edit</a>
@endcan

@can('delete', $product)
    <form method="POST" action="{{ route('products.destroy', $product) }}">
        @csrf @method('DELETE')
        <button>Delete</button>
    </form>
@endcan

// Simple admin check middleware
public function handle($request, Closure $next)
{
    if (auth()->user()->role !== 'admin') {
        abort(403, 'Admins only.');
    }
    return $next($request);
}`,
      output: `User A (owner) visits /products/1/edit  → ✓ Allowed
User B (other) visits /products/1/edit  → ✗ 403 Forbidden
Admin user visits /products/1/edit      → ✓ Allowed

@can('update', $product):
  Owner sees: [Edit] [Delete] buttons
  Other user sees: (buttons hidden)`,
    },
    concepts: [
      { term: "Policy", def: "A class per model with methods matching actions (view, create, update, delete). php artisan make:policy ProductPolicy --model=Product." },
      { term: "$this->authorize()", def: "Calls the policy and throws a 403 HTTP exception if it returns false. Cleaner than writing manual if/abort checks." },
      { term: "Gate", def: "A simple permission check defined in AppServiceProvider: Gate::define('admin-only', fn($user) => $user->role === 'admin')." },
      { term: "@can / @cannot", def: "Blade directives that check policies before rendering UI. IMPORTANT: always also check on the server — hiding UI is not security." },
    ],
    tip: "Demo a real 403 page in browser. Then show how @can hides the button. Emphasize: UI hiding is UX, not security. Server-side is security. Both are needed.",
    project: null,
  },
  {
    id: "m12", num: "12", section: "Section 12", hours: "1.5h",
    title: "REST API Development",
    titleKh: "REST API Development",
    goal: "Build a stateless JSON API for mobile apps and single-page applications",
    goalKh: "បង្កើត JSON API stateless សម្រាប់ Mobile App & SPA",
    color: "#4d9fff",
    badge: "API",
    topics: [
      { en: "REST principles — stateless, resources, HTTP verbs", kh: "REST Principles — stateless, resources, HTTP verbs" },
      { en: "API Routes in routes/api.php (prefix /api)", kh: "API Routes (prefix /api, version /api/v1)" },
      { en: "Eloquent API Resources — shaping JSON output", kh: "Eloquent API Resources — រចនា JSON Output" },
      { en: "HTTP status codes — 200, 201, 404, 422, 401, 403", kh: "HTTP Status Codes — 200, 201, 404, 422, 401, 403" },
    ],
    lab: {
      title: "Products JSON API with Resources",
      titleKh: "Products JSON API ជាមួយ Resources",
      duration: "60 min",
      objective: "Build a complete CRUD API with proper status codes and JSON Resources",
      steps: [
        "Run: php artisan install:api",
        "Create: php artisan make:controller Api/ProductController --api",
        "Create: php artisan make:resource ProductResource",
        "Create: php artisan make:resource ProductCollection",
        "Register routes in routes/api.php",
        "Test all endpoints with curl or Postman/Insomnia",
      ],
      code: `// Install API support (creates routes/api.php, Sanctum)
php artisan install:api

// routes/api.php
Route::prefix('v1')->group(function () {
    Route::apiResource('products', ProductController::class);
    // GET    /api/v1/products
    // POST   /api/v1/products
    // GET    /api/v1/products/{id}
    // PUT    /api/v1/products/{id}
    // DELETE /api/v1/products/{id}
});

// app/Http/Resources/ProductResource.php
class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'slug'        => $this->slug,
            'price'       => (float) $this->price,
            'in_stock'    => $this->stock > 0,
            'image_url'   => $this->image
                                ? Storage::url($this->image)
                                : null,
            'category'    => [
                'id'   => $this->category->id,
                'name' => $this->category->name,
            ],
            'created_at'  => $this->created_at->toIso8601String(),
        ];
    }
}

// Api/ProductController.php
public function index()
{
    $products = Product::with('category')
        ->active()->paginate(15);
    return ProductResource::collection($products);
}

public function store(StoreProductRequest $request)
{
    $product = Product::create($request->validated());
    return (new ProductResource($product))
        ->response()->setStatusCode(201);   // 201 Created
}

public function show(Product $product)
{
    return new ProductResource($product->load('category'));
}

public function destroy(Product $product)
{
    $product->delete();
    return response()->noContent();  // 204 No Content
}`,
      output: `GET /api/v1/products
{
  "data": [
    {
      "id": 1,
      "name": "iPhone 15 Pro",
      "price": 999.99,
      "in_stock": true,
      "category": { "id": 1, "name": "Electronics" }
    }
  ],
  "links": { "first": "...", "next": "..." },
  "meta":  { "total": 50, "per_page": 15 }
}`,
    },
    concepts: [
      { term: "API Resource", def: "Transforms a Model into a specific JSON shape. Hides sensitive fields (password_hash), renames keys, adds computed values like in_stock." },
      { term: "apiResource()", def: "Like resource() but excludes create and edit routes (APIs don't need HTML form pages). Creates 5 routes instead of 7." },
      { term: "HTTP 201 Created", def: "Return this status code when a POST successfully creates a resource. Don't always return 200 — use the right code." },
      { term: "Stateless", def: "Each API request contains all the information needed. No sessions. Authentication is done via token in the Authorization header." },
    ],
    tip: "Open Postman or curl during class and demo every endpoint live. The moment students see their API return real JSON is one of the most motivating moments of the course.",
    project: null,
  },
  {
    id: "m13", num: "13", section: "Section 13", hours: "1h",
    title: "API Authentication (Sanctum)",
    titleKh: "API Authentication ជាមួយ Sanctum",
    goal: "Secure your API with token authentication — issue, verify, and revoke access tokens",
    goalKh: "ការពារ API ដោយ Token Authentication ជាមួយ Sanctum",
    color: "#b06bff",
    badge: "API AUTH",
    topics: [
      { en: "Sanctum Token model — Personal Access Tokens", kh: "Sanctum Token Model — Personal Access Tokens" },
      { en: "Login API → issue token, Logout → revoke token", kh: "Login API → token, Logout → revoke token" },
      { en: "Protecting routes with auth:sanctum middleware", kh: "ការពារ Routes ជាមួយ auth:sanctum middleware" },
      { en: "CORS configuration for cross-origin frontends", kh: "CORS Configuration សម្រាប់ React/Vue Frontend" },
    ],
    lab: {
      title: "Token Auth — Login, Protected Routes, Logout",
      titleKh: "Token Auth — Login, Protected, Logout",
      duration: "45 min",
      objective: "Build login/logout API endpoints and protect product management routes with tokens",
      steps: [
        "Verify: php artisan install:api (creates personal_access_tokens table)",
        "Build POST /api/auth/login → returns token",
        "Build POST /api/auth/logout → revokes token",
        "Wrap write routes in auth:sanctum middleware",
        "Test with curl: Authorization: Bearer {token}",
        "Configure CORS in bootstrap/app.php for React frontend",
      ],
      code: `// routes/api.php
Route::prefix('v1')->group(function () {

    // Public — no token needed
    Route::post('/auth/login',  [AuthController::class, 'login']);
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{product}', [ProductController::class, 'show']);

    // Protected — token required
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{product}', [ProductController::class, 'update']);
        Route::delete('/products/{product}', [ProductController::class, 'destroy']);
    });
});

// app/Http/Controllers/Api/AuthController.php
public function login(Request $request)
{
    $request->validate([
        'email'    => 'required|email',
        'password' => 'required',
    ]);

    if (!Auth::attempt($request->only('email', 'password'))) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    $token = $request->user()->createToken('api-token')->plainTextToken;

    return response()->json([
        'token' => $token,
        'user'  => new UserResource($request->user()),
    ]);
}

public function logout(Request $request)
{
    $request->user()->currentAccessToken()->delete();
    return response()->json(['message' => 'Logged out']);
}

// ── Testing with curl ──────────────────────
// Login:
curl -X POST /api/v1/auth/login \\
     -H "Accept: application/json" \\
     -d "email=user@example.com&password=secret"

// Use token:
curl /api/v1/products \\
     -H "Authorization: Bearer 1|abc123xyz..."`,
      output: `POST /api/v1/auth/login
→ { "token": "1|abc123xyz...", "user": { "id": 1, "name": "Dara" } }

GET /api/v1/products (without token)
→ 200 OK (public endpoint)

POST /api/v1/products (without token)
→ 401 Unauthorized

POST /api/v1/products (with Bearer token)
→ 201 Created { product data }`,
    },
    concepts: [
      { term: "Personal Access Token", def: "A long random string stored (hashed) in personal_access_tokens table. $user->createToken('name')->plainTextToken." },
      { term: "auth:sanctum", def: "Middleware that reads the Authorization: Bearer header, looks up the token in DB, and injects the user into the request." },
      { term: "Token Revocation", def: "currentAccessToken()->delete() invalidates that one token. tokens()->delete() logs out all devices at once." },
      { term: "CORS", def: "Browser security policy. Without proper CORS headers, a React app on port 5173 cannot call an API on port 8000." },
    ],
    tip: "Show the personal_access_tokens table in DB client before and after login/logout. Students see tokens being created and deleted — it makes auth tangible.",
    project: null,
  },
  {
    id: "m14", num: "14", section: "Section 14", hours: "1.5h",
    title: "HTML Templates & Blade Components",
    titleKh: "HTML Templates & Blade Components",
    goal: "Convert real HTML/CSS templates into Laravel Blade — assets, layouts, components, and dynamic data",
    goalKh: "ដំឡើង HTML Template ទៅ Laravel Blade — Assets, Layouts, Components, Dynamic Data",
    color: "#ff8c42",
    badge: "FRONTEND",
    topics: [
      { en: "Step 1 — Copy HTML template assets into public/ or resources/", kh: "ជំហាន 1 — Copy Assets (CSS/JS/IMG) ទៅ public/ ឬ resources/" },
      { en: "Step 2 — Convert static HTML into a Blade layout file", kh: "ជំហាន 2 — បំប្លែង HTML ស្ថិតិ ជា Blade Layout" },
      { en: "Step 3 — Slice pages into @section / @yield blocks", kh: "ជំហាន 3 — បំបែក Page ជា @section / @yield blocks" },
      { en: "Step 4 — Replace static content with Blade & Eloquent data", kh: "ជំហាន 4 — ជំនួស Static Content ដោយ Blade + Eloquent" },
      { en: "Blade Components — reusable cards, buttons, alerts", kh: "Blade Components — Cards, Buttons, Alerts ដែលប្រើឡើងវិញ" },
      { en: "asset() vs Vite — linking CSS/JS correctly", kh: "asset() ធៀបនឹង Vite — ភ្ជាប់ CSS/JS ត្រឹមត្រូវ" },
    ],
    lab: {
      title: "Integrate a Free HTML Shop Template",
      titleKh: "ដំឡើង HTML Shop Template ទៅ Laravel",
      duration: "60 min",
      objective: "Take a downloaded HTML template and fully integrate it into Laravel with dynamic product data",
      steps: [
        "Download any free HTML template (e.g. colorlib, html5up, bootstrapmade)",
        "Copy CSS/JS/images into public/template/ folder",
        "Create resources/views/layouts/app.blade.php from the template index.html",
        "Replace <link href='style.css'> with {{ asset('template/css/style.css') }}",
        "Cut out the main content area and replace with @yield('content')",
        "Create home.blade.php that @extends('layouts.app') and fills @section('content')",
        "Wire up real product data with @forelse in the product grid section",
        "Extract the product card HTML into an x-product-card Blade Component",
      ],
      code: `{{-- STEP 1: Copy template assets to public/template/ --}}
{{--   public/template/css/style.css     → asset('template/css/style.css')  --}}
{{--   public/template/js/main.js        → asset('template/js/main.js')     --}}
{{--   public/template/images/logo.png   → asset('template/images/logo.png') --}}

{{-- STEP 2: resources/views/layouts/app.blade.php — the master layout --}}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>@yield('title', 'MyShop')</title>

    {{-- Link template CSS using asset() — NEVER hardcode paths --}}
    <link rel="stylesheet" href="{{ asset('template/css/bootstrap.min.css') }}">
    <link rel="stylesheet" href="{{ asset('template/css/style.css') }}">
    @stack('styles')  {{-- child pages can push extra CSS here --}}
</head>
<body>

    {{-- Navbar — shared on every page --}}
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="{{ route('home') }}">
                <img src="{{ asset('template/images/logo.png') }}" alt="MyShop" height="40">
            </a>
            <ul class="navbar-nav ms-auto">
                <li class="nav-item">
                    <a class="nav-link" href="{{ route('home') }}">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="{{ route('products.index') }}">Products</a>
                </li>
                @auth
                    <li class="nav-item">
                        <a class="nav-link" href="{{ route('dashboard') }}">Dashboard</a>
                    </li>
                    <li class="nav-item">
                        <form method="POST" action="{{ route('logout') }}" class="d-inline">
                            @csrf
                            <button class="btn btn-link nav-link p-0">Logout</button>
                        </form>
                    </li>
                @else
                    <li class="nav-item">
                        <a class="nav-link" href="{{ route('login') }}">Login</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link btn btn-primary px-3" href="{{ route('register') }}">Register</a>
                    </li>
                @endauth
            </ul>
        </div>
    </nav>

    {{-- Global flash messages --}}
    @if(session('success'))
        <div class="alert alert-success alert-dismissible m-3" role="alert">
            {{ session('success') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    @endif

    {{-- ★★★ THIS IS THE KEY — child views inject their HTML here ★★★ --}}
    <main class="container py-4">
        @yield('content')
    </main>

    <footer class="bg-dark text-white text-center py-4 mt-5">
        <p class="mb-0">&copy; {{ date('Y') }} MyShop. All rights reserved.</p>
    </footer>

    <script src="{{ asset('template/js/jquery.min.js') }}"></script>
    <script src="{{ asset('template/js/bootstrap.bundle.min.js') }}"></script>
    <script src="{{ asset('template/js/main.js') }}"></script>
    @stack('scripts')  {{-- child pages push extra JS here --}}
</body>
</html>

{{-- STEP 3: resources/views/home.blade.php --}}
@extends('layouts.app')        {{-- inherit everything from the layout --}}

@section('title', 'Home')      {{-- fills the @yield('title') slot --}}

@section('content')            {{-- fills the @yield('content') slot --}}

    {{-- Static hero from the template HTML — paste as-is --}}
    <section class="hero-section text-center py-5 bg-light mb-5">
        <h1 class="display-4 fw-bold">Welcome to MyShop</h1>
        <p class="lead">{{ $stats['total_products'] }} products in {{ $stats['categories'] }} categories</p>
        <a href="{{ route('products.index') }}" class="btn btn-primary btn-lg">Shop Now</a>
    </section>

    {{-- Featured Products — DYNAMIC data from the database --}}
    <section class="py-4">
        <h2 class="mb-4">Featured Products</h2>
        <div class="row g-4">
            @forelse($featured as $product)
                <div class="col-md-4">
                    {{-- x-product-card is a Blade Component (Step 4) --}}
                    <x-product-card :product="$product" />
                </div>
            @empty
                <p class="text-muted">No products available yet.</p>
            @endforelse
        </div>
    </section>

@endsection

{{-- ★ Page-specific JS pushed into layout's @stack('scripts') ★ --}}
@push('scripts')
<script>
    // This JS only loads on the home page
    console.log('Home page loaded');
</script>
@endpush

{{-- STEP 4: resources/views/components/product-card.blade.php --}}
{{-- Extract repeating product HTML into a reusable component  --}}
@props(['product'])

<div class="card h-100 shadow-sm border-0">
    <div class="position-relative overflow-hidden">
        @if($product->image)
            <img src="{{ Storage::url($product->image) }}"
                 alt="{{ $product->name }}"
                 class="card-img-top" style="height:220px;object-fit:cover">
        @else
            <img src="{{ asset('template/images/no-image.jpg') }}"
                 alt="No image" class="card-img-top" style="height:220px;object-fit:cover">
        @endif

        @if($product->stock === 0)
            <span class="badge bg-danger position-absolute top-0 end-0 m-2">Sold Out</span>
        @elseif($product->stock < 5)
            <span class="badge bg-warning text-dark position-absolute top-0 end-0 m-2">Low Stock</span>
        @endif
    </div>

    <div class="card-body d-flex flex-column">
        <small class="text-muted text-uppercase fw-bold">{{ $product->category->name }}</small>
        <h5 class="card-title mt-1">{{ $product->name }}</h5>
        <p class="fw-bold text-primary fs-5 mt-auto">\${{ number_format($product->price, 2) }}</p>
        <a href="{{ route('products.show', $product) }}"
           class="btn btn-outline-primary w-100 mt-2">
            View Details
        </a>
    </div>
</div>`,
      output: `After completing all 4 steps:

Folder structure:
  public/
  └── template/
      ├── css/style.css          ← asset('template/css/style.css')
      ├── js/main.js             ← asset('template/js/main.js')
      └── images/logo.png        ← asset('template/images/logo.png')

  resources/views/
  ├── layouts/app.blade.php      ← master layout (nav + footer)
  ├── home.blade.php             ← @extends layout, @section content
  ├── products/index.blade.php   ← @extends layout, @section content
  └── components/
      └── product-card.blade.php ← <x-product-card :product="$p" />

Browser results:
  / (home)        → hero + dynamic products from DB ✓
  /products       → full product listing from DB ✓
  /products/1     → single product detail ✓

CSS from downloaded template applies to all pages. ✓
Product data is dynamic — no more static HTML cards. ✓`,
    },
    concepts: [
      { term: "asset('path')", def: "Generates URL to a file in public/. asset('template/css/style.css') outputs http://localhost:8000/template/css/style.css. Never hardcode /template/... — always use asset()." },
      { term: "@extends / @yield", def: "Two-part inheritance: the layout defines @yield('content') as a slot. Every child page says @extends('layouts.app') to inherit the layout and fill its slots." },
      { term: "@section / @endsection", def: "Child pages fill layout slots. @section('title', 'Home') for a single value. @section('content')...@endsection for full HTML blocks." },
      { term: "@stack / @push", def: "For page-specific assets. Layout has @stack('scripts') in the footer. A child page uses @push('scripts')<script>...</script>@endpush to inject JS only on that page." },
      { term: "x-component-name", def: "<x-product-card :product=\"$product\" /> renders resources/views/components/product-card.blade.php. The colon prefix (:product) passes a PHP variable as a prop." },
      { term: "@forelse / @empty", def: "Like @foreach but with a built-in empty state. @forelse($products as $p)...@empty <p>None found</p>@endforelse — always use this instead of @foreach for lists." },
    ],
    tip: "Download a real Bootstrap template from bootstrapmade.com BEFORE class. Convert it live on screen — students see every file path, every @yield slot, every asset() call happen in real time. This is the most practical lesson of the entire course.",
    project: null,
  },
  {
    id: "m14b", num: "14B", section: "Section 14 (cont.)", hours: "1.5h",
    title: "Blade Directives & Dynamic Data",
    titleKh: "Blade Directives & ការបញ្ចូលទិន្នន័យ Dynamic",
    goal: "Master every Blade directive and wire real database data into your HTML template",
    goalKh: "ស្ទាត់ Blade Directives ទាំងអស់ ហើយភ្ជាប់ Database Data ចូល Template",
    color: "#ff8c42",
    badge: "FRONTEND",
    topics: [
      { en: "Output directives — {{ }}, {!! !!}, @verbatim", kh: "Output Directives — {{ }}, {!! !!}, @verbatim" },
      { en: "Control flow — @if, @elseif, @unless, @switch, @case", kh: "Control Flow — @if, @elseif, @unless, @switch, @case" },
      { en: "Loops — @foreach, @forelse, @for, @while, @break, @continue", kh: "Loops — @foreach, @forelse, @for, @while, @break, @continue" },
      { en: "Template helpers — @php, @json, @class, @style, @checked, @selected", kh: "Template Helpers — @php, @json, @class, @style, @checked, @selected" },
    ],
    lab: {
      title: "Products Page with Full Blade Directives",
      titleKh: "ទំព័រ Products ដោយប្រើ Blade Directives ពេញលេញ",
      duration: "45 min",
      objective: "Build a rich product listing page using every major Blade directive with real database data",
      steps: [
        "Pass products, categories, and stats from controller to view",
        "Use @forelse to loop products — show empty state with @empty",
        "Use @if / @elseif for stock status badge (In Stock / Low Stock / Sold Out)",
        "Use @switch for category color-coding",
        "Use @class directive for conditional CSS classes",
        "Use $loop variable: $loop->first, $loop->last, $loop->index, $loop->iteration",
        "Use @json to pass PHP array to JavaScript",
        "Use @php block for view-level calculations",
      ],
      code: `{{-- ══════════════════════════════════════════════════════════ --}}
{{-- resources/views/products/index.blade.php                   --}}
{{-- ══════════════════════════════════════════════════════════ --}}
@extends('layouts.app')

@section('title', 'Products — ' . $category?->name ?? 'All')

@section('content')

{{-- ── Output: escaped vs raw ────────────────────────────────── --}}
{{-- {{ $product->name }}   ← SAFE — HTML special chars escaped  --}}
{{-- {!! $product->description !!} ← RAW — only for trusted HTML --}}

{{-- ── Stats bar ──────────────────────────────────────────────── --}}
<div class="stats-bar">
    <span>Total: <b>{{ $stats['total'] }}</b> products</span>
    <span>In Stock: <b>{{ $stats['in_stock'] }}</b></span>
    <span>Value: <b>\${{ number_format($stats['total_value'], 2) }}</b></span>
</div>

{{-- ── Category filter tabs ───────────────────────────────────── --}}
<ul class="category-tabs">
    @foreach($categories as $cat)
        <li @class([
            'tab-item',
            'tab-active' => request('category') === $cat->slug,
            'tab-empty'  => $cat->products_count === 0,
        ])>
            <a href="{{ route('products.index', ['category' => $cat->slug]) }}">
                {{ $cat->name }}
                <span class="badge">{{ $cat->products_count }}</span>
            </a>
        </li>
    @endforeach
</ul>

{{-- ── Product grid with @forelse ────────────────────────────── --}}
<div class="product-grid">
    @forelse($products as $product)

        {{-- $loop variable gives metadata about the iteration --}}
        @if($loop->first)
            <div class="featured-banner">Featured Products</div>
        @endif

        <div class="product-card" id="product-{{ $product->id }}">

            {{-- ── Stock badge using @if / @elseif / @else ── --}}
            @if($product->stock === 0)
                <span class="badge badge-danger">Sold Out</span>
            @elseif($product->stock < 5)
                <span class="badge badge-warning">Only {{ $product->stock }} left!</span>
            @elseif($product->stock < 20)
                <span class="badge badge-info">Low Stock</span>
            @else
                <span class="badge badge-success">In Stock</span>
            @endif

            {{-- ── Category color using @switch ──────────── --}}
            @switch($product->category->slug)
                @case('electronics')
                    <span class="cat-label cat-blue">Electronics</span>
                    @break
                @case('clothing')
                    <span class="cat-label cat-pink">Clothing</span>
                    @break
                @case('food')
                    <span class="cat-label cat-green">Food</span>
                    @break
                @default
                    <span class="cat-label cat-gray">{{ $product->category->name }}</span>
            @endswitch

            <h3>{{ $product->name }}</h3>

            {{-- ── @unless (opposite of @if) ─────────────── --}}
            @unless($product->active)
                <div class="draft-notice">⚠️ This product is not published yet.</div>
            @endunless

            {{-- ── Conditional class using @class ─────────── --}}
            <div @class([
                'price',
                'price-sale'      => $product->is_on_sale,
                'price-expensive' => $product->price > 500,
                'text-muted'      => $product->stock === 0,
            ])>
                \${{ number_format($product->price, 2) }}
            </div>

            {{-- Loop info for debugging during development --}}
            {{-- Item {{ $loop->iteration }} of {{ $loop->count }} --}}

        </div>

        {{-- Divider after every 3 products --}}
        @if($loop->iteration % 3 === 0 && !$loop->last)
            <div class="grid-divider"></div>
        @endif

    @empty
        {{-- ── @empty renders when the collection is empty ── --}}
        <div class="empty-state">
            <h3>No products found</h3>
            <p>Try a different category or search term.</p>
            <a href="{{ route('products.index') }}">Clear filters</a>
        </div>
    @endforelse
</div>

{{-- ── Pass PHP data to JavaScript using @json ─────────────── --}}
@push('scripts')
<script>
    // @json safely encodes PHP array as JSON for JavaScript
    const productIds = @json($products->pluck('id'));
    const categoryMap = @json($categories->pluck('name', 'slug'));
    console.log('Loaded products:', productIds);
</script>
@endpush

{{-- ── @php block for view calculations ────────────────────── --}}
@php
    $avgPrice = $products->avg('price');
    $maxPrice = $products->max('price');
@endphp
<p class="text-muted">Average price: \${{ number_format($avgPrice, 2) }}</p>

@endsection`,
      output: `Controller passes to view:
  $products   → paginated Product collection (with category)
  $categories → all categories with products_count
  $stats      → ['total' => 50, 'in_stock' => 43, 'total_value' => 24999.50]

Blade renders:
  ✓ Stats bar with live counts
  ✓ Category tabs with active state highlighted
  ✓ Product grid with stock badges
  ✓ Empty state when no products match filter
  ✓ JavaScript receives product IDs via @json
  ✓ $loop->first / $loop->last work correctly`,
    },
    concepts: [
      { term: "{{ }} vs {!! !!}", def: "{{ $var }} escapes HTML — safe for user content. {!! $var !!} outputs raw HTML — only use for content YOU control (e.g. rich text from a CMS)." },
      { term: "@forelse / @empty", def: "@forelse($items as $item)...@empty...@endforelse. The @empty block renders when the collection has zero items. Always prefer over @foreach + @if count check." },
      { term: "$loop variable", def: "Available inside any @foreach. $loop->iteration (1-based count), $loop->index (0-based), $loop->first, $loop->last, $loop->count, $loop->remaining." },
      { term: "@class directive", def: "@class(['base-class', 'active' => $isActive, 'disabled' => $isDisabled]) — conditionally adds CSS classes. Much cleaner than ternary operators in class attributes." },
      { term: "@json", def: "@json($phpArray) safely encodes a PHP variable as JSON inside a script tag. Equivalent to json_encode() but escapes HTML entities for security." },
      { term: "@unless", def: "@unless($condition) is the opposite of @if. @unless($product->active) runs when active is FALSE. Reads like natural English." },
    ],
    tip: "Teach @class before Tailwind conditional classes — students who understand @class never go back to messy ternary operators in their class attributes. It is one of the most underused features in Blade.",
    project: null,
  },
  {
    id: "m14c", num: "14C", section: "Section 14 (cont.)", hours: "1.5h",
    title: "Blade Components — Complete System",
    titleKh: "Blade Components — ប្រព័ន្ធពេញលេញ",
    goal: "Build a complete, reusable component library — anonymous, class-based, slots, and Alpine.js",
    goalKh: "បង្កើត Component Library ពេញលេញ — Anonymous, Class-based, Slots, Alpine.js",
    color: "#ff8c42",
    badge: "FRONTEND",
    topics: [
      { en: "Anonymous components — simple, file-only components", kh: "Anonymous Components — Components ងាយស្រួល មានតែ File" },
      { en: "Class-based components — PHP logic + Blade view pair", kh: "Class-based Components — PHP Logic + Blade View" },
      { en: "Named slots, conditional slots & $attributes bag", kh: "Named Slots, Conditional Slots & $attributes bag" },
      { en: "Alpine.js — x-data, x-show, x-on, x-model for interactivity", kh: "Alpine.js — x-data, x-show, x-on, x-model សម្រាប់ Interactivity" },
    ],
    lab: {
      title: "Build a Complete UI Component Library",
      titleKh: "បង្កើត UI Component Library ពេញលេញ",
      duration: "60 min",
      objective: "Build Alert, Modal, Dropdown, DataTable, and Form components used throughout the shop app",
      steps: [
        "Create anonymous component: resources/views/components/alert.blade.php",
        "Create anonymous component: resources/views/components/badge.blade.php",
        "Create class-based: php artisan make:component ProductCard",
        "Build a modal component with Alpine.js x-show toggle",
        "Build a dropdown component with named slots",
        "Build a form input component with error display built-in",
        "Compose them together on the products/create page",
      ],
      code: `{{-- ════════════════════════════════════════════════════════ --}}
{{-- 1. ANONYMOUS COMPONENT — no PHP class, just a Blade file  --}}
{{-- resources/views/components/alert.blade.php                 --}}
{{-- ════════════════════════════════════════════════════════ --}}
@props([
    'type'        => 'info',      // info | success | warning | danger
    'dismissible' => false,
    'title'       => null,
])

@php
$colors = [
    'info'    => 'bg-blue-50 border-blue-400 text-blue-800',
    'success' => 'bg-green-50 border-green-400 text-green-800',
    'warning' => 'bg-yellow-50 border-yellow-400 text-yellow-800',
    'danger'  => 'bg-red-50 border-red-400 text-red-800',
];
$icons = ['info'=>'ℹ️','success'=>'✅','warning'=>'⚠️','danger'=>'❌'];
@endphp

<div {{ $attributes->merge(['class' => "border-l-4 p-4 mb-4 {$colors[$type]}"]) }}
     @if($dismissible) x-data="{ show: true }" x-show="show" @endif>
    <div class="flex justify-between items-start">
        <div>
            @if($title)
                <p class="font-bold">{{ $icons[$type] }} {{ $title }}</p>
            @endif
            <p>{{ $slot }}</p>
        </div>
        @if($dismissible)
            <button @click="show = false" class="ml-4 opacity-60 hover:opacity-100">✕</button>
        @endif
    </div>
</div>

{{-- Usage: --}}
{{-- <x-alert type="success" title="Saved!" :dismissible="true"> --}}
{{--     Product has been created successfully.                   --}}
{{-- </x-alert>                                                   --}}


{{-- ════════════════════════════════════════════════════════ --}}
{{-- 2. CLASS-BASED COMPONENT — PHP logic + dedicated view   --}}
{{-- php artisan make:component ProductCard                   --}}
{{-- ════════════════════════════════════════════════════════ --}}

// app/View/Components/ProductCard.php
class ProductCard extends Component
{
    public string $stockStatus;
    public string $stockColor;

    public function __construct(public Product $product)
    {
        // PHP logic lives in the class, not in the Blade view
        $this->stockStatus = match(true) {
            $product->stock === 0  => 'Sold Out',
            $product->stock < 5    => 'Low Stock',
            default                => 'In Stock',
        };
        $this->stockColor = match(true) {
            $product->stock === 0  => 'red',
            $product->stock < 5    => 'yellow',
            default                => 'green',
        };
    }

    public function render(): View
    {
        return view('components.product-card');
    }
}

{{-- resources/views/components/product-card.blade.php --}}
@props(['product'])  {{-- $stockStatus and $stockColor come from the class --}}

<div class="card" {{ $attributes }}>
    <img src="{{ $product->imageUrl }}" alt="{{ $product->name }}">
    <div class="card-body">
        <h5>{{ $product->name }}</h5>
        <x-badge :color="$stockColor">{{ $stockStatus }}</x-badge>
        <p class="price">\${{ number_format($product->price, 2) }}</p>
        {{-- Named slot: optional action buttons passed by the caller --}}
        @if($actions->isNotEmpty())
            <div class="card-actions">{{ $actions }}</div>
        @endif
    </div>
</div>

{{-- Usage with named slot: --}}
{{-- <x-product-card :product="$product"> --}}
{{--     <x-slot:actions>               --}}
{{--         <a href="...">Edit</a>      --}}
{{--         <button>Delete</button>     --}}
{{--     </x-slot:actions>              --}}
{{-- </x-product-card>                  --}}


{{-- ════════════════════════════════════════════════════════ --}}
{{-- 3. MODAL COMPONENT with Alpine.js                       --}}
{{-- resources/views/components/modal.blade.php              --}}
{{-- ════════════════════════════════════════════════════════ --}}
@props(['id', 'title' => 'Confirm'])

<div x-data="{ open: false }" id="{{ $id }}">

    {{-- Trigger slot — caller provides the button --}}
    <div @click="open = true">
        {{ $trigger }}
    </div>

    {{-- Backdrop --}}
    <div x-show="open"
         x-transition:enter="transition ease-out duration-200"
         x-transition:enter-start="opacity-0"
         x-transition:enter-end="opacity-100"
         x-transition:leave="transition ease-in duration-150"
         x-transition:leave-start="opacity-100"
         x-transition:leave-end="opacity-0"
         class="fixed inset-0 bg-black bg-opacity-50 z-40"
         @click="open = false">
    </div>

    {{-- Modal panel --}}
    <div x-show="open"
         x-transition
         class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
             @click.stop>
            <div class="flex justify-between mb-4">
                <h3 class="text-lg font-bold">{{ $title }}</h3>
                <button @click="open = false">✕</button>
            </div>
            <div>{{ $slot }}</div>
            @isset($footer)
                <div class="mt-4 flex justify-end gap-2">{{ $footer }}</div>
            @endisset
        </div>
    </div>
</div>

{{-- Usage: --}}
{{-- <x-modal title="Delete Product?"> --}}
{{--     <x-slot:trigger>              --}}
{{--         <button class="btn-danger">Delete</button> --}}
{{--     </x-slot:trigger>             --}}
{{--     Are you sure you want to delete this product? --}}
{{--     <x-slot:footer>               --}}
{{--         <form method="POST" action="...">@csrf @method('DELETE') --}}
{{--             <button type="submit" class="btn-danger">Yes, Delete</button> --}}
{{--         </form>                    --}}
{{--     </x-slot:footer>              --}}
{{-- </x-modal>                        --}}


{{-- ════════════════════════════════════════════════════════ --}}
{{-- 4. FORM INPUT COMPONENT with built-in error display     --}}
{{-- resources/views/components/form/input.blade.php         --}}
{{-- ════════════════════════════════════════════════════════ --}}
@props([
    'label'       => null,
    'name',
    'type'        => 'text',
    'placeholder' => '',
    'required'    => false,
    'hint'        => null,
])

<div class="form-group mb-4">
    @if($label)
        <label for="{{ $name }}" class="form-label fw-semibold">
            {{ $label }}
            @if($required) <span class="text-danger">*</span> @endif
        </label>
    @endif

    <input
        id="{{ $name }}"
        name="{{ $name }}"
        type="{{ $type }}"
        value="{{ old($name) }}"
        placeholder="{{ $placeholder }}"
        {{ $required ? 'required' : '' }}
        {{ $attributes->merge(['class' => 'form-control ' . ($errors->has($name) ? 'is-invalid' : '')]) }}
    >

    @if($hint && !$errors->has($name))
        <div class="form-text text-muted">{{ $hint }}</div>
    @endif

    @error($name)
        <div class="invalid-feedback d-block">{{ $message }}</div>
    @enderror
</div>

{{-- Usage on create.blade.php: --}}
{{-- <x-form.input name="name"  label="Product Name" :required="true"  --}}
{{--     hint="Max 255 characters" />                                   --}}
{{-- <x-form.input name="price" label="Price (USD)" type="number"      --}}
{{--     placeholder="0.00" />                                          --}}`,
      output: `Components registered automatically by Laravel (no config needed):

  <x-alert>              → components/alert.blade.php
  <x-badge>              → components/badge.blade.php
  <x-product-card>       → app/View/Components/ProductCard.php
                           + components/product-card.blade.php
  <x-modal>              → components/modal.blade.php
  <x-form.input>         → components/form/input.blade.php
                           (dot = subdirectory)

Alpine.js loaded via CDN in layout:
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>

Modal toggle: x-data="{ open: false }" @click="open = true" x-show="open"
Input binding: x-model="searchQuery" → live two-way binding
Transition: x-transition → smooth fade in/out`,
    },
    concepts: [
      { term: "Anonymous vs Class-based", def: "Anonymous: just a .blade.php file in components/ — good for pure HTML. Class-based: a PHP class + view pair — use when you need PHP logic before rendering." },
      { term: "Named Slots", def: "<x-slot:actions>...</x-slot:actions> passes a named HTML block into a component. Inside the component, access it as {{ $actions }}. Multiple named slots allowed." },
      { term: "$attributes bag", def: "All extra HTML attributes passed to a component are collected in $attributes. Use $attributes->merge(['class' => 'base-class']) to combine yours with the caller's." },
      { term: "Alpine.js x-data", def: "x-data='{ open: false }' declares a reactive state object. Any element inside it can use x-show, x-bind, x-on, and x-model to react to that state." },
      { term: "x-transition", def: "Adds smooth CSS enter/leave transitions to x-show elements. x-transition alone applies a default fade. Customise with :enter, :enter-start, :leave-end classes." },
      { term: "@isset / $slot->isNotEmpty()", def: "@isset($footer) checks if a named slot was provided by the caller. $slot->isNotEmpty() does the same for the default slot. Use to make slots optional." },
    ],
    tip: "Build the modal component live, then immediately use it as a delete-confirmation dialog on the products list page. Students see the real-world payoff of components instantly — it removes their DELETE button fear.",
    project: null,
  },
  {
    id: "m15", num: "15", section: "Section 15", hours: "1h",
    title: "File Storage & Media Uploads",
    titleKh: "File Storage & Media Uploads",
    goal: "Handle file uploads correctly — local disk, public URLs, and cloud-ready storage",
    goalKh: "គ្រប់គ្រង File Upload ត្រឹមត្រូវ — Local, Public, Cloud-ready",
    color: "#8a8680",
    badge: "STORAGE",
    topics: [
      { en: "Filesystem Disks — local, public, s3, custom", kh: "Filesystem Disks — local, public, s3, custom" },
      { en: "File upload handling & validation", kh: "ការ Upload File & Validation" },
      { en: "Storage::url() & storage:link symlink", kh: "Storage::url() & php artisan storage:link" },
      { en: "Image optimization with Intervention Image", kh: "Image Optimization ជាមួយ Intervention Image" },
    ],
    lab: {
      title: "Product Image Upload System",
      titleKh: "Product Image Upload System",
      duration: "45 min",
      objective: "Upload product images with validation, resize, and serve via public URL",
      steps: [
        "Run: php artisan storage:link",
        "Add image validation to StoreProductRequest",
        "Store image: $request->file('image')->store('products', 'public')",
        "Display: <img src=\"{{ Storage::url($product->image) }}\">",
        "Optional: Install intervention/image for resize",
        "Handle old image deletion on update",
      ],
      code: `# Create storage symlink (run once per project)
php artisan storage:link
# → public/storage → storage/app/public (symlink)

// StoreProductRequest.php — validation
'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],

// ProductController.php — store
public function store(StoreProductRequest $request)
{
    $data = $request->validated();

    if ($request->hasFile('image')) {
        // Store and get the path
        $data['image'] = $request->file('image')
            ->store('products', 'public');
        // Stored at: storage/app/public/products/randomname.jpg
        // Accessible: /storage/products/randomname.jpg
    }

    Product::create($data);
    return redirect()->route('products.index');
}

// ProductController.php — update (replace image)
public function update(UpdateProductRequest $request, Product $product)
{
    $data = $request->validated();

    if ($request->hasFile('image')) {
        // Delete old file first
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }
        $data['image'] = $request->file('image')->store('products', 'public');
    }

    $product->update($data);
}

// Blade template
@if($product->image)
    <img src="{{ Storage::url($product->image) }}"
         alt="{{ $product->name }}">
@else
    <img src="{{ asset('images/placeholder.png') }}" alt="No image">
@endif

// Optional: Resize with Intervention Image
use Intervention\\Image\\Laravel\\Facades\\Image;

$path = 'products/' . uniqid() . '.jpg';
Image::read($request->file('image'))
     ->cover(800, 600)
     ->toJpeg(90)
     ->save(storage_path('app/public/' . $path));`,
      output: `php artisan storage:link
INFO  The [public/storage] link has been connected to [storage/app/public].

Upload result:
  Stored:  storage/app/public/products/abc123.jpg
  URL:     http://localhost:8000/storage/products/abc123.jpg
  Column:  products.image = "products/abc123.jpg"`,
    },
    concepts: [
      { term: "Storage Disk", def: "An abstraction over a filesystem. 'public' disk stores in storage/app/public/ and files are web-accessible after storage:link." },
      { term: "storage:link", def: "Creates a symbolic link public/storage → storage/app/public. Allows browser to access uploaded files via /storage/..." },
      { term: "store(path, disk)", def: "$file->store('products', 'public') generates a unique filename and saves the file. Returns the path relative to disk root." },
      { term: "Storage::delete()", def: "Always delete old files when replacing them. Otherwise, your server fills up with orphaned image files over time." },
    ],
    tip: "Demo what happens when you skip storage:link — broken image icons everywhere. Then run the command. The images appear instantly. Students never forget the symlink.",
    project: null,
  },
  {
    id: "m16", num: "16", section: "Section 16", hours: "1h",
    title: "Queues & Background Jobs",
    titleKh: "Queues & Background Jobs",
    goal: "Move slow operations to the background — emails, image processing, notifications",
    goalKh: "ផ្ញើការងារចំណាយពេលទៅ Background — Emails, Image Processing",
    color: "#ff4d4d",
    badge: "ASYNC",
    topics: [
      { en: "Why queues? — keeping HTTP responses fast", kh: "ហេតុអ្វីប្រើ Queues? — Response លឿន" },
      { en: "Jobs — packaging background work into classes", kh: "Jobs — ខ្ចប់ Background Work ក្នុង Classes" },
      { en: "Queue drivers — database, redis, sync", kh: "Queue Drivers — database, redis, sync" },
      { en: "Failed jobs, retries & monitoring", kh: "Failed Jobs, Retries & Monitoring" },
    ],
    lab: {
      title: "Welcome Email & Order Notification Jobs",
      titleKh: "Welcome Email & Order Notification Jobs",
      duration: "45 min",
      objective: "Dispatch a welcome email job on registration, run the queue worker",
      steps: [
        "Configure: QUEUE_CONNECTION=database in .env",
        "Run: php artisan queue:table && php artisan migrate",
        "Create: php artisan make:job SendWelcomeEmail",
        "Create: php artisan make:mail WelcomeMail",
        "Dispatch from register controller: SendWelcomeEmail::dispatch($user)",
        "Start worker: php artisan queue:work",
      ],
      code: `// .env
QUEUE_CONNECTION=database
MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=1025  // Mailpit (Sail)

// Create queue tables
php artisan queue:table
php artisan migrate

// app/Jobs/SendWelcomeEmail.php
class SendWelcomeEmail implements ShouldQueue
{
    use Dispatchable, Queueable, SerializesModels;

    public int $tries = 3;           // retry 3 times on failure
    public int $timeout = 60;        // 60 second timeout

    public function __construct(public User $user) {}

    public function handle(): void
    {
        Mail::to($this->user->email)
            ->send(new WelcomeMail($this->user));
    }

    public function failed(Throwable $exception): void
    {
        Log::error("Welcome email failed for user {$this->user->id}: {$exception->getMessage()}");
    }
}

// In your RegisteredUserController
public function store(Request $request): RedirectResponse
{
    // ... create user ...
    $user = User::create($validated);

    event(new Registered($user));

    // Dispatch to queue — returns IMMEDIATELY, email sends in background
    SendWelcomeEmail::dispatch($user);

    // Optionally delay:
    SendWelcomeEmail::dispatch($user)->delay(now()->addMinutes(5));

    Auth::login($user);
    return redirect(route('dashboard', absolute: false));
}

// Start the queue worker in terminal
php artisan queue:work
// INFO  Processing jobs from the [default] queue.
// ✓ App\\Jobs\\SendWelcomeEmail ... 843ms DONE`,
      output: `php artisan queue:work

INFO  Processing jobs from the [default] queue.
2026-01-01 10:00:00 App\\Jobs\\SendWelcomeEmail ... RUNNING
2026-01-01 10:00:01 App\\Jobs\\SendWelcomeEmail ... 843ms DONE

View email at: http://localhost:8025 (Mailpit UI)`,
    },
    concepts: [
      { term: "ShouldQueue", def: "Implementing this interface on a Job tells Laravel to push it to the queue instead of running it synchronously in the HTTP request." },
      { term: "dispatch()", def: "Pushes the job to the queue and returns immediately. The HTTP response goes to the user while the job runs in the background." },
      { term: "queue:work", def: "A long-running process that watches the queue and executes jobs as they arrive. Run it with supervisor in production." },
      { term: "Mailpit", def: "A local mail trap (included in Sail). Catches all outgoing emails so they never reach real inboxes during development." },
    ],
    tip: "Demo timing: show response time with SendMail in the request (~1000ms). Then move to queue — response drops to <50ms. The speed difference is impossible to argue with.",
    project: null,
  },
  {
    id: "m17", num: "17", section: "Section 17", hours: "1h",
    title: "API Documentation (Swagger)",
    titleKh: "API Documentation ជាមួយ Swagger",
    goal: "Auto-generate professional interactive API documentation from your code",
    goalKh: "បង្កើត API Documentation ស្វ័យប្រវត្តិ ជាមួយ Swagger/OpenAPI",
    color: "#52e3a0",
    badge: "DOCS",
    topics: [
      { en: "OpenAPI Specification (OAS 3.0) standard", kh: "OpenAPI Specification (OAS 3.0) ស្តង់ដារ" },
      { en: "L5-Swagger — generating docs from PHP Attributes", kh: "L5-Swagger — Docs ពី PHP Attributes" },
      { en: "Documenting request bodies, responses & auth", kh: "Documentation Request Bodies, Responses & Auth" },
      { en: "Interactive Swagger UI — test live from browser", kh: "Swagger UI — Test API ផ្ទាល់ពី Browser" },
    ],
    lab: {
      title: "Document the Products API",
      titleKh: "Document Products API",
      duration: "45 min",
      objective: "Add OpenAPI attributes to ProductController and generate Swagger UI",
      steps: [
        "Install: composer require darkaonline/l5-swagger",
        "Publish config: php artisan vendor:publish --provider L5Swagger",
        "Add global @OA\\Info block in AppController",
        "Annotate ProductController index(), store(), show() methods",
        "Run: php artisan l5-swagger:generate",
        "Visit: /api/documentation",
      ],
      code: `# Install L5-Swagger
composer require "darkaonline/l5-swagger"
php artisan vendor:publish --provider "L5Swagger\\L5SwaggerServiceProvider"

// app/Http/Controllers/Controller.php
/**
 * @OA\\Info(
 *   title="MyShop API",
 *   version="1.0.0",
 *   description="E-Commerce REST API built with Laravel 12",
 *   @OA\\Contact(email="dev@myshop.com")
 * )
 * @OA\\SecurityScheme(
 *   securityScheme="bearerAuth",
 *   type="http",
 *   scheme="bearer"
 * )
 */

// app/Http/Controllers/Api/ProductController.php
/**
 * @OA\\Get(
 *   path="/api/v1/products",
 *   tags={"Products"},
 *   summary="List all products (paginated)",
 *   @OA\\Parameter(name="page", in="query", @OA\\Schema(type="integer")),
 *   @OA\\Response(
 *     response=200,
 *     description="Success",
 *     @OA\\JsonContent(ref="#/components/schemas/ProductCollection")
 *   )
 * )
 */
public function index() { ... }

/**
 * @OA\\Post(
 *   path="/api/v1/products",
 *   tags={"Products"},
 *   summary="Create a product",
 *   security={{"bearerAuth":{}}},
 *   @OA\\RequestBody(
 *     required=true,
 *     @OA\\JsonContent(ref="#/components/schemas/StoreProductRequest")
 *   ),
 *   @OA\\Response(response=201, description="Created"),
 *   @OA\\Response(response=422, description="Validation Error"),
 *   @OA\\Response(response=401, description="Unauthorized")
 * )
 */
public function store(StoreProductRequest $request) { ... }

# Generate documentation
php artisan l5-swagger:generate`,
      output: `INFO  Regenerating docs...
✓ Swagger JSON at: public/docs/api-docs.json
✓ Swagger UI at:   http://localhost:8000/api/documentation

Endpoints documented:
  GET    /api/v1/products        ✓
  POST   /api/v1/products        ✓ (requires auth)
  GET    /api/v1/products/{id}   ✓
  PUT    /api/v1/products/{id}   ✓ (requires auth)
  DELETE /api/v1/products/{id}   ✓ (requires auth)`,
    },
    concepts: [
      { term: "OpenAPI Spec", def: "A JSON/YAML standard for describing REST APIs. Tools like Postman, Swagger UI, and client generators can all read it." },
      { term: "Swagger UI", def: "A browser interface that renders OpenAPI spec as interactive documentation. Users can make real API calls from the browser." },
      { term: "PHP Attributes / DocBlocks", def: "L5-Swagger reads annotations in your PHP comments or PHP 8 Attributes to generate the OpenAPI JSON automatically." },
      { term: "Auto-sync", def: "Because docs come from annotations in code, they update when you run l5-swagger:generate. They never drift from reality." },
    ],
    tip: "Live demo the Swagger UI — click 'Try it out', paste a Bearer token, and make a real API call. Students see docs and testing in one tool.",
    project: "Mini-Project 2: Complete REST API with Sanctum auth, Resources, and Swagger documentation.",
  },
  {
    id: "m18", num: "18", section: "Section 18", hours: "1h",
    title: "Testing with Pest PHP",
    titleKh: "Testing ជាមួយ Pest PHP",
    goal: "Write automated tests that protect your app from regressions — feature and unit tests",
    goalKh: "សរសេរ Test ស្វ័យប្រវត្តិ ការពារ App ពី Regression Bugs",
    color: "#38c9c9",
    badge: "TESTING",
    topics: [
      { en: "Why test? — confidence, refactoring safety, documentation", kh: "ហេតុអ្វីតេស្ត? — ទំនុកចិត្ត, Refactoring, Documentation" },
      { en: "Pest PHP — modern, expressive test framework", kh: "Pest PHP — Test Framework ទំនើប" },
      { en: "Feature tests — HTTP, database assertions", kh: "Feature Tests — HTTP & Database Assertions" },
      { en: "Mocking, factories & database transactions", kh: "Mocking, Factories & Database Transactions" },
    ],
    lab: {
      title: "Test the Product CRUD System",
      titleKh: "Test Product CRUD System",
      duration: "45 min",
      objective: "Write feature tests covering all CRUD operations for products",
      steps: [
        "Pest is pre-installed in Laravel 12",
        "Write test: GET /products returns 200",
        "Write test: authenticated user can create product",
        "Write test: unauthenticated user gets 401",
        "Write test: only owner can delete their product",
        "Run: php artisan test -- see green results",
      ],
      code: `// tests/Feature/ProductTest.php

use App\\Models\\{User, Product, Category};

beforeEach(function () {
    // Refresh DB and seed basic data before each test
    $this->category = Category::factory()->create();
    $this->user     = User::factory()->create();
});

// ── Public Routes ─────────────────────────
it('shows the products list page', function () {
    Product::factory(5)->create(['category_id' => $this->category->id]);

    $this->get(route('products.index'))
         ->assertOk()
         ->assertViewIs('products.index')
         ->assertViewHas('products');
});

// ── Auth Protection ────────────────────────
it('guests cannot access the create form', function () {
    $this->get(route('products.create'))
         ->assertRedirect(route('login'));
});

// ── CRUD Operations ────────────────────────
it('authenticated user can create a product', function () {
    $this->actingAs($this->user)
         ->post(route('products.store'), [
             'category_id' => $this->category->id,
             'name'        => 'Test Product',
             'price'       => 99.99,
             'stock'       => 10,
         ])
         ->assertRedirect(route('products.index'));

    $this->assertDatabaseHas('products', ['name' => 'Test Product']);
});

it('validates required fields on create', function () {
    $this->actingAs($this->user)
         ->post(route('products.store'), [])
         ->assertSessionHasErrors(['name', 'price', 'category_id']);
});

it('only owners can delete their products', function () {
    $product  = Product::factory()->create(['user_id' => $this->user->id]);
    $other    = User::factory()->create();

    // Other user cannot delete
    $this->actingAs($other)
         ->delete(route('products.destroy', $product))
         ->assertForbidden();

    // Owner can delete
    $this->actingAs($this->user)
         ->delete(route('products.destroy', $product))
         ->assertRedirect();

    $this->assertSoftDeleted('products', ['id' => $product->id]);
});`,
      output: `php artisan test

PASS  Tests\\Feature\\ProductTest
  ✓ shows the products list page          0.12s
  ✓ guests cannot access the create form 0.08s
  ✓ authenticated user can create product 0.19s
  ✓ validates required fields on create   0.11s
  ✓ only owners can delete their products 0.24s

Tests: 5 passed (8 assertions)
Duration: 0.87s`,
    },
    concepts: [
      { term: "Pest PHP", def: "A modern testing framework for PHP built on PHPUnit. it('description', fn() => ...) syntax is readable and expressive." },
      { term: "actingAs()", def: "Authenticates a user for the test. $this->actingAs($user)->get('/dashboard') simulates a logged-in request." },
      { term: "assertDatabaseHas()", def: "Checks that a record matching the criteria exists in the database. Confirms the controller actually saved the data." },
      { term: "RefreshDatabase", def: "Trait that wraps each test in a database transaction and rolls it back. Tests are isolated and don't affect each other." },
    ],
    tip: "Run tests with --parallel flag for speed. Show the real-time test output in the terminal. Green checkmarks are satisfying — students want more of them.",
    project: null,
  },
  {
    id: "m19", num: "19", section: "Section 19", hours: "1h",
    title: "Performance & Deployment",
    titleKh: "Performance & Deployment",
    goal: "Optimize, cache, and deploy your Laravel application to production",
    goalKh: "Optimize, Cache, Deploy Laravel App ទៅ Production",
    color: "#f5c842",
    badge: "DEVOPS",
    topics: [
      { en: "Caching strategies — config, route, view, data cache", kh: "Caching — config, route, view, data cache" },
      { en: "Redis caching with Cache::remember()", kh: "Redis Caching ជាមួយ Cache::remember()" },
      { en: "Production checklist — env, debug, optimize", kh: "Production Checklist — env, debug, optimize" },
      { en: "Deployment to Railway, Forge, or VPS", kh: "Deployment ទៅ Railway, Forge, VPS" },
    ],
    lab: {
      title: "Production Optimization & Deploy",
      titleKh: "Optimization & Deploy",
      duration: "30 min",
      objective: "Run the full production optimization checklist and deploy",
      steps: [
        "Set APP_ENV=production, APP_DEBUG=false in .env",
        "Run: php artisan optimize (caches config, routes, views)",
        "Add Redis caching to expensive queries",
        "Set up GitHub Actions for CI/CD",
        "Deploy to Railway or Forge with zero-downtime",
      ],
      code: `# ── Production Optimization ──────────────
php artisan optimize
# → Caches config, routes, views, events

# Individual cache commands:
php artisan config:cache   # config/*.php → bootstrap/cache/config.php
php artisan route:cache    # routes/*.php → bootstrap/cache/routes.php
php artisan view:cache     # Blade → PHP files in storage/framework/views/

# Clear all caches
php artisan optimize:clear

# ── Redis Caching Example ─────────────────
// Bad: runs DB query on every page load
$products = Product::active()->with('category')->get();

// Good: cache for 1 hour
$products = Cache::remember('products.active', 3600, function () {
    return Product::active()->with('category')->get();
});

// Invalidate cache when product changes
public function store(StoreProductRequest $request)
{
    Product::create($request->validated());
    Cache::forget('products.active');  // ← clear stale cache
    return redirect()->route('products.index');
}

# ── .env Production Settings ──────────────
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:...           # php artisan key:generate
CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
DB_CONNECTION=mysql

# ── GitHub Actions CI/CD ──────────────────
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy via SSH
        run: |
          ssh user@server 'cd /var/www/myshop && git pull && composer install --no-dev && php artisan optimize && php artisan migrate --force'`,
      output: `php artisan optimize

INFO  Caching configuration.
INFO  Caching routes.
INFO  Caching Blade templates.
INFO  Caching events and listeners.
INFO  Application optimized successfully.

Deploy check:
  APP_DEBUG=false  ✓
  HTTPS enabled    ✓
  Migrations run   ✓
  Storage linked   ✓
  Queue worker     ✓ (Supervisor)`,
    },
    concepts: [
      { term: "php artisan optimize", def: "One command that caches config, routes, views, and events. Dramatically speeds up production by removing runtime parsing." },
      { term: "Cache::remember()", def: "Run the callback once, store the result for $seconds. On next call, return the cached value. Perfect for expensive queries." },
      { term: "APP_DEBUG=false", def: "In production, debug mode must be OFF. Debug mode shows full stack traces, SQL queries, and config — a security disaster if exposed." },
      { term: "Supervisor", def: "A process manager that keeps queue:work running 24/7 in production. Restarts it automatically if it crashes." },
    ],
    tip: "Show APP_DEBUG=true with a deliberate error — the full stack trace, SQL queries, env variables are all visible. Then switch to false. Students understand why immediately.",
    project: null,
  },
  {
    id: "m20", num: "20", section: "Section 20", hours: "3h",
    title: "Final Capstone — E-Commerce Platform",
    titleKh: "Capstone — E-Commerce Platform",
    goal: "Build and present a complete, production-ready e-commerce application",
    goalKh: "បង្កើតនិងដាក់បង្ហាញ E-Commerce App ពេញលេញ Production-ready",
    color: "#b06bff",
    badge: "FINAL PROJECT",
    topics: [
      { en: "Full system architecture — all 19 sections combined", kh: "System Architecture ពេញលេញ — Section ទាំង 19 រួមបញ្ចូលគ្នា" },
      { en: "Order management — cart, checkout, order history", kh: "Order Management — Cart, Checkout, Order History" },
      { en: "Admin dashboard — sales, inventory, analytics", kh: "Admin Dashboard — Sales, Inventory, Analytics" },
      { en: "Project presentation & code review", kh: "Project Presentation & Code Review" },
    ],
    lab: {
      title: "Full E-Commerce App",
      titleKh: "E-Commerce App ពេញលេញ",
      duration: "3h in-class + take-home",
      objective: "Combine all skills into one deployable e-commerce application (3h guided in-class + independent take-home)",
      steps: [
        "Database: users, products, categories, orders, order_items, carts",
        "Auth: Breeze login/register + roles (admin, customer)",
        "Shop: product listing, search, filter, category browse",
        "Cart: session-based cart with quantity management",
        "Checkout: address form, order creation, email confirmation (queued)",
        "Admin: manage products, view orders, update order status",
        "API: complete REST API for mobile app with Sanctum + Swagger",
        "Tests: 80%+ feature test coverage",
        "Deploy: live URL on Railway or similar",
      ],
      code: `// ── Final Project Database Schema ─────────

// Tables required:
// users (id, name, email, password, role, address, phone)
// categories (id, name, slug, image, parent_id)
// products (id, category_id, user_id, name, slug, price, stock, image)
// carts (id, user_id, session_id)
// cart_items (id, cart_id, product_id, quantity, price)
// orders (id, user_id, total, status, shipping_address, payment_status)
// order_items (id, order_id, product_id, name, price, quantity)

// ── Order Model ───────────────────────────
class Order extends Model
{
    protected $fillable = [
        'user_id', 'total', 'status', 'shipping_address',
    ];

    protected $casts = [
        'total'            => 'decimal:2',
        'shipping_address' => 'array',  // JSON column
    ];

    public function items()   { return $this->hasMany(OrderItem::class); }
    public function user()    { return $this->belongsTo(User::class); }

    // Status transition helper
    public function markAsProcessing(): void
    {
        $this->update(['status' => 'processing']);
        // Dispatch job to notify customer
        SendOrderStatusEmail::dispatch($this);
    }
}

// ── Admin Dashboard Controller ─────────────
class AdminDashboardController extends Controller
{
    public function index()
    {
        $stats = Cache::remember('admin.stats', 300, function () {
            return [
                'total_revenue'  => Order::where('status', 'completed')->sum('total'),
                'total_orders'   => Order::count(),
                'pending_orders' => Order::where('status', 'pending')->count(),
                'low_stock'      => Product::where('stock', '<', 10)->count(),
                'new_users'      => User::where('created_at', '>=', now()->subDays(7))->count(),
            ];
        });

        $recent_orders = Order::with('user')
            ->latest()
            ->take(10)
            ->get();

        $top_products = Product::withCount('orderItems')
            ->orderBy('order_items_count', 'desc')
            ->take(5)
            ->get();

        return view('admin.dashboard', compact('stats', 'recent_orders', 'top_products'));
    }
}

// ── Checkout Flow ──────────────────────────
class CheckoutController extends Controller
{
    public function store(CheckoutRequest $request)
    {
        DB::transaction(function () use ($request) {
            $cart = Cart::with('items.product')->forUser();

            // Validate stock for each item
            foreach ($cart->items as $item) {
                if ($item->product->stock < $item->quantity) {
                    throw new InsufficientStockException($item->product);
                }
            }

            // Create the order
            $order = Order::create([
                'user_id'          => auth()->id(),
                'total'            => $cart->total(),
                'shipping_address' => $request->only('name','address','city','phone'),
                'status'           => 'pending',
            ]);

            // Create order items & decrement stock
            foreach ($cart->items as $item) {
                $order->items()->create([
                    'product_id' => $item->product_id,
                    'name'       => $item->product->name,
                    'price'      => $item->price,
                    'quantity'   => $item->quantity,
                ]);
                $item->product->decrement('stock', $item->quantity);
            }

            // Clear cart & send confirmation email
            $cart->items()->delete();
            SendOrderConfirmation::dispatch($order);
        });

        return redirect()->route('orders.show', $order)
            ->with('success', 'Order placed successfully!');
    }
}`,
      output: `Final Project Deliverables:

  ✓ Full CRUD for Products, Categories, Orders
  ✓ Authentication (login, register, password reset)
  ✓ Authorization (admin vs customer roles)
  ✓ Shopping cart & checkout flow
  ✓ Background email jobs (queue)
  ✓ File uploads (product images)
  ✓ REST API with Sanctum auth
  ✓ Swagger documentation
  ✓ Automated tests (80% coverage)
  ✓ Live deployment with public URL

Grading (40% of final grade):
  Architecture & Code Quality  30%
  Feature Completeness         40%
  API & Documentation          20%
  Testing                      10%`,
    },
    concepts: [
      { term: "DB::transaction()", def: "Wraps multiple DB operations. If any fails, all are rolled back. Essential for checkout — never leave an order in a partial state." },
      { term: "Admin Middleware", def: "Create IsAdmin middleware: if (auth()->user()->role !== 'admin') abort(403). Apply to all admin routes." },
      { term: "Cache Strategy", def: "Cache expensive dashboard stats with short TTL (5 min). Clear caches on data changes. Balance freshness vs performance." },
      { term: "Code Review", def: "Each student presents their routing structure, a complex controller, and one test. Peer review builds better engineers." },
    ],
    tip: "Host a live demo day. Each student deploys to Railway (free tier) and presents their app for 5 minutes. Real deployment is the final lesson.",
    project: "FINAL PROJECT: Complete E-Commerce Platform with Auth, CRUD, Cart, API, Docs, Tests & Live Deployment.",
  },
];

// ─── CODE BLOCK ────────────────────────────────────────────────
function CodeBlock({ code, output, cmd, color }: { code: string; output?: string | null; cmd?: string; color: string }) {
  const [tab, setTab] = useState("code");
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(tab === "code" ? code : output || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hlLine = (line: string, i: number) => {
    const isComment = /^\s*(#|\/\/|\/\*|\*|{{--)/.test(line.trim());
    if (isComment) return (
      <div key={i} style={{ display: "flex", minHeight: "1.6em" }}>
        <span style={{ color: "rgba(255,255,255,0.25)", minWidth: 32, textAlign: "right", marginRight: 16, fontSize: 10, userSelect: "none", fontFamily: "var(--mono)", paddingTop: 2 }}>{i + 1}</span>
        <span style={{ color: "rgba(255,255,255,0.45)", fontStyle: "italic", fontFamily: "var(--mono)", fontSize: 12 }}>{line}</span>
      </div>
    );

    const parts = line.split(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\$[a-zA-Z_]\w*|\b\d+(?:\.\d+)?\b|\b[a-zA-Z_]\w*\b)/g);
    const KW = new Set(["php", "use", "class", "extends", "implements", "namespace", "public", "protected", "private", "static", "function", "fn", "return", "if", "else", "elseif", "foreach", "for", "while", "new", "array", "string", "int", "float", "bool", "void", "null", "true", "false", "require", "include", "throw", "try", "catch", "match", "readonly", "const", "abstract", "interface", "trait"]);

    return (
      <div key={i} style={{ display: "flex", minHeight: "1.6em" }}>
        <span style={{ color: "rgba(255,255,255,0.25)", minWidth: 32, textAlign: "right", marginRight: 16, fontSize: 10, userSelect: "none", fontFamily: "var(--mono)", paddingTop: 2 }}>{i + 1}</span>
        <span style={{ fontFamily: "var(--mono)", fontSize: 12 }}>
          {parts.map((p, j) => {
            if (!p) return null;
            if (p.startsWith("$")) return <span key={j} style={{ color: "#e05c5c" }}>{p}</span>;
            if (KW.has(p)) return <span key={j} style={{ color: color, fontWeight: 700 }}>{p}</span>;
            if ((p.startsWith('"') || p.startsWith("'")) && p.length > 1) return <span key={j} style={{ color: "#52a878" }}>{p}</span>;
            if (/^\d+/.test(p)) return <span key={j} style={{ color: "#d4a843" }}>{p}</span>;
            if (/^[A-Z]/.test(p) && p.length > 1) return <span key={j} style={{ color: "#7b5cbf" }}>{p}</span>;
            return <span key={j} style={{ color: "#ffffff" }}>{p}</span>;
          })}
        </span>
      </div>
    );
  };

  return (
    <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden", background: "#0e0e0c", display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#161614", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 4 }}>
          {([["code", "CODE"], output ? ["output", "OUTPUT"] : null] as [string, string][])
            .filter((item): item is [string, string] => !!item)
            .map(([v, lbl]) => (
              <button key={v} onClick={() => setTab(v)} style={{ padding: "3px 12px", border: "none", background: tab === v ? color + "22" : "transparent", color: tab === v ? color : "rgba(255,255,255,0.4)", fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer", borderRadius: 2, transition: "all 0.15s" }}>
                {lbl}
              </button>
            ))}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {cmd && <code style={{ fontSize: 10, color: color, fontFamily: "var(--mono)", opacity: 0.8 }}>{cmd}</code>}
          <button onClick={copy} className="copy-btn" style={{ fontSize: 10, fontFamily: "var(--mono)", fontWeight: 600, padding: "2px 10px", border: `1px solid ${copied ? color : "rgba(255,255,255,0.1)"}`, background: copied ? color + "22" : "transparent", color: copied ? color : "rgba(255,255,255,0.4)", cursor: "pointer", borderRadius: 2, opacity: 0.7, transition: "all 0.15s" }}>
            {copied ? "✓ COPIED" : "COPY"}
          </button>
        </div>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: "16px 14px" }}>
        {tab === "code"
          ? <pre style={{ margin: 0 }}>{code.split("\n").map((line, i) => hlLine(line, i))}</pre>
          : <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ color: color }}>$ </span>{cmd}
            </div>
            <pre style={{ margin: 0, fontFamily: "var(--mono)", fontSize: 12, lineHeight: 1.7, color: "#ffffff", whiteSpace: "pre-wrap" }}>{output}</pre>
          </div>
        }
      </div>
    </div>
  );
}

// ─── MODULE CARD ───────────────────────────────────────────────
function ModuleCard({ mod, index, onClick }: { mod: ModuleData; index: number; onClick: () => void }) {
  const icons: Record<string, string> = {
    "FOUNDATION": "⚡", "TOOLS": "🔧", "DEVOPS": "🐳",
    "ARCHITECTURE": "🏗️", "ROUTING": "🗺️", "DATABASE": "🗄️",
    "ORM": "💡", "SECURITY": "🛡️", "CORE LAB": "🔨",
    "AUTH": "🔐", "API": "📡", "API AUTH": "🎟️",
    "FRONTEND": "🎨", "STORAGE": "💾", "ASYNC": "⚡",
    "DOCS": "📑", "TESTING": "🧪", "FINAL PROJECT": "🏆",
  };
  const Icon = icons[mod.badge] || "📦";

  return (
    <button className="module-btn" onClick={onClick}
      style={{
        ["--hover-color" as any]: mod.color + "12",
        textAlign: "left", background: "var(--surface)", border: "1px solid var(--border)",
        borderTop: `2px solid ${mod.color}`, padding: "20px", cursor: "pointer",
        transition: "all 0.2s", position: "relative", borderRadius: 2,
        animationDelay: `${index * 0.03}s`,
      } as CSSProperties}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700, color: mod.color, opacity: 0.6 }}>{mod.num}</span>
          <span style={{ fontSize: 9, fontWeight: 700, fontFamily: "var(--mono)", color: mod.color, border: `1px solid ${mod.color}40`, padding: "1px 6px", borderRadius: 2, letterSpacing: "0.08em" }}>
            {mod.badge}
          </span>
          {mod.project && (
            <span style={{ fontSize: 9, background: mod.color + "22", color: mod.color, padding: "1px 6px", borderRadius: 2, fontFamily: "var(--mono)", fontWeight: 700 }}>
              PROJECT
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 9, fontFamily: "var(--mono)", color: "var(--ink-faint)", border: "1px solid var(--border)", padding: "1px 6px", borderRadius: 2 }}>{mod.hours}</span>
          <span style={{ fontSize: 14 }}>{Icon}</span>
        </div>
      </div>

      <div style={{ fontFamily: "var(--serif)", fontSize: 15, fontWeight: 700, color: "var(--ink)", lineHeight: 1.2, marginBottom: 6 }}>{mod.title}</div>
      <div style={{ fontFamily: "var(--sans)", fontSize: 11, color: "var(--ink-dim)", lineHeight: 1.4, marginBottom: 12 }}>{mod.titleKh}</div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-faint)" }}>{mod.section}</span>
        <span className="module-arrow" style={{ fontFamily: "var(--mono)", fontSize: 11, color: mod.color, transition: "transform 0.2s" }}>→</span>
      </div>
    </button>
  );
}

// ─── OVERVIEW ──────────────────────────────────────────────────
function Overview({ onSelect }: { onSelect: (index: number) => void }) {
  const totalHours = MODULES.reduce((sum, m) => sum + parseFloat(m.hours), 0);

  return (
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: "48px 24px 80px" }}>
      {/* Hero */}
      <div className="anim-up" style={{ marginBottom: 56 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 20 }}>
          <div style={{ width: 32, height: 2, background: "var(--red)" }} />
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700, color: "var(--red)", letterSpacing: "0.14em" }}>UNIVERSITY CURRICULUM · BACKEND DEVELOPMENT</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 48, alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(40px,6vw,72px)", fontWeight: 900, lineHeight: 0.95, marginBottom: 20, letterSpacing: "-0.02em" }}>
              Backend Dev<br />
              <span style={{ fontStyle: "italic", color: "var(--red)", fontWeight: 300 }}>with Laravel</span>
            </h1>
            <p style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--ink-dim)", lineHeight: 1.9, maxWidth: 520, marginBottom: 28 }}>
              A complete university-level course in <b style={{ color: "var(--ink)" }}>23 sections</b> totalling <b style={{ color: "var(--ink)" }}>34 hours</b> of hands-on teaching.<br />
              Built for live classroom delivery with real application labs, mini-projects, and a capstone e-commerce platform.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {[
                ["23", "Sections"],
                [totalHours + "h", "Total Time"],
                ["3", "Mini Projects"],
                ["1", "Capstone App"],
                ["Laravel 12", "Framework"],
                ["Bilingual", "KH + EN"],
              ].map(([n, l]) => (
                <div key={l} style={{ border: "1px solid var(--border-strong)", padding: "6px 14px", fontFamily: "var(--mono)", fontSize: 11, background: "var(--surface)", borderRadius: 2 }}>
                  <span style={{ color: "var(--red)" }}>{n}</span> <span style={{ color: "var(--ink-dim)" }}>{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Grading breakdown */}
          <div style={{ width: 260, border: "1px solid var(--border-strong)", padding: 24, background: "var(--surface)", borderRadius: 4, flexShrink: 0 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, fontWeight: 700, color: "var(--ink-faint)", letterSpacing: "0.12em", marginBottom: 18, borderBottom: "1px solid var(--border)", paddingBottom: 10 }}>GRADING BREAKDOWN</div>
            {[
              { label: "Final Capstone Project", pct: 40, color: "var(--purple)" },
              { label: "Weekly Assignments", pct: 30, color: "var(--blue)" },
              { label: "Mini Projects (×2)", pct: 20, color: "var(--teal)" },
              { label: "Participation", pct: 10, color: "var(--amber)" },
            ].map(g => (
              <div key={g.label} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-dim)" }}>{g.label}</span>
                  <span style={{ fontFamily: "var(--serif)", fontSize: 18, fontWeight: 700, color: g.color }}>{g.pct}%</span>
                </div>
                <div style={{ height: 2, background: "var(--border)", borderRadius: 1 }}>
                  <div style={{ height: "100%", width: g.pct + "%", background: g.color, borderRadius: 1 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline bar */}
      <div className="anim-up" style={{ animationDelay: "0.1s", marginBottom: 36 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-faint)", marginBottom: 12, letterSpacing: "0.1em" }}>COURSE TIMELINE — 34 HOURS · 23 SECTIONS</div>
        <div style={{ display: "flex", height: 6, borderRadius: 3, overflow: "hidden", gap: 1 }}>
          {MODULES.map(m => (
            <div key={m.id} title={m.title} onClick={() => onSelect(MODULES.indexOf(m))}
              style={{ flex: parseFloat(m.hours), background: m.color, cursor: "pointer", opacity: 0.8, transition: "opacity 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "0.8")}
            />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-faint)" }}>Week 1</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-faint)" }}>Week 10</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-faint)" }}>Week 20</span>
        </div>
      </div>

      {/* Module Grid */}
      <div className="anim-up" style={{ animationDelay: "0.15s" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-faint)", letterSpacing: "0.1em", marginBottom: 16 }}>ALL MODULES</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
          {MODULES.map((m, i) => (
            <ModuleCard key={m.id} mod={m} index={i} onClick={() => onSelect(i)} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MODULE PAGE ───────────────────────────────────────────────
function ModulePage({ mod: m, onBack, onPrev, onNext, canPrev, canNext, currentIndex }: { mod: ModuleData; onBack: () => void; onPrev: () => void; onNext: () => void; canPrev: boolean; canNext: boolean; currentIndex: number }) {
  const [tab, setTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "OVERVIEW" },
    { id: "concepts", label: "CONCEPTS" },
    { id: "lab", label: "LAB" },
    { id: "code", label: "CODE" },
  ];

  useEffect(() => { setTab("overview"); }, [m.id]);

  return (
    <div className="anim-in">
      {/* Module nav bar */}
      <div style={{ position: "sticky", top: 52, zIndex: 9, background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", gap: 0, height: 50 }}>
          <button onClick={onBack} style={{ padding: "0 16px", height: "100%", border: "none", borderRight: "1px solid var(--border)", background: "transparent", color: "var(--ink-dim)", fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer" }}>
            ← ALL
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 20px", flex: 1 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: m.color, flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: m.color, letterSpacing: "0.1em" }}>MODULE {m.num} · {m.section} · {m.hours}</div>
              <div style={{ fontFamily: "var(--serif)", fontSize: 14, fontWeight: 700, color: "var(--ink)", lineHeight: 1.2 }}>{m.title}</div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", height: "100%", borderLeft: "1px solid var(--border)" }}>
            {tabs.map(t => (
              <button key={t.id} className="tab-item" onClick={() => setTab(t.id)}
                style={{ padding: "0 16px", height: "100%", border: "none", borderLeft: "1px solid var(--border)", background: tab === t.id ? "var(--surface)" : "transparent", color: tab === t.id ? m.color : "var(--ink-dim)", fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer", borderBottom: tab === t.id ? `2px solid ${m.color}` : "2px solid transparent", transition: "all 0.15s" }}>
                {t.label}
              </button>
            ))}
          </div>
          {/* Prev/Next */}
          <div style={{ display: "flex", borderLeft: "1px solid var(--border)", height: "100%" }}>
            <button onClick={onPrev} disabled={!canPrev} style={{ padding: "0 14px", height: "100%", border: "none", background: "transparent", color: canPrev ? "var(--ink-dim)" : "var(--border)", fontFamily: "var(--mono)", fontSize: 12, cursor: canPrev ? "pointer" : "not-allowed" }}>‹</button>
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-faint)", display: "flex", alignItems: "center", padding: "0 4px" }}>{currentIndex + 1}/{MODULES.length}</span>
            <button onClick={onNext} disabled={!canNext} style={{ padding: "0 14px", height: "100%", border: "none", background: "transparent", color: canNext ? "var(--ink-dim)" : "var(--border)", fontFamily: "var(--mono)", fontSize: 12, cursor: canNext ? "pointer" : "not-allowed" }}>›</button>
          </div>
        </div>
        {/* Progress */}
        <div style={{ height: 2, background: "var(--border)" }}>
          <div style={{ height: "100%", width: `${((currentIndex + 1) / MODULES.length) * 100}%`, background: m.color, transition: "width 0.4s ease" }} />
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div className="anim-up">
            {/* Goal */}
            <div style={{ borderLeft: `3px solid ${m.color}`, paddingLeft: 20, marginBottom: 40 }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, fontWeight: 700, color: m.color, letterSpacing: "0.12em", marginBottom: 8 }}>LEARNING GOAL</div>
              <div style={{ fontFamily: "var(--serif)", fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 700, color: "var(--ink)", lineHeight: 1.3, marginBottom: 8 }}>{m.goal}</div>
              <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-dim)", lineHeight: 1.6 }}>{m.goalKh}</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              {/* Topics */}
              <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-faint)", letterSpacing: "0.1em", marginBottom: 14 }}>TOPICS COVERED ({m.topics.length})</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {m.topics.map((t, i) => (
                    <div key={i} style={{ padding: "14px 16px", background: "var(--surface)", border: "1px solid var(--border)", borderLeft: `3px solid ${m.color}`, borderRadius: 2 }}>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 12, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>{t.en}</div>
                      <div style={{ fontFamily: "var(--sans)", fontSize: 11, color: "var(--ink-dim)" }}>{t.kh}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right panel */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Lab callout */}
                <div style={{ border: `1px solid ${m.color}40`, background: m.color + "08", borderRadius: 4, padding: 20 }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 9, fontWeight: 700, color: m.color, letterSpacing: "0.1em", marginBottom: 10 }}>LAB EXERCISE · {m.lab.duration}</div>
                  <div style={{ fontFamily: "var(--serif)", fontSize: 17, fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>{m.lab.title}</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: "var(--ink-dim)", lineHeight: 1.5, marginBottom: 14 }}>{m.lab.titleKh}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-dim)", marginBottom: 14, fontStyle: "italic" }}>
                    Objective: {m.lab.objective}
                  </div>
                  <button onClick={() => setTab("lab")} style={{ background: m.color, color: "#000", border: "none", padding: "8px 18px", fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer", borderRadius: 2 }}>
                    OPEN LAB →
                  </button>
                </div>

                {/* Teaching tip */}
                <div style={{ padding: 20, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 4 }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 9, fontWeight: 700, color: "var(--amber)", letterSpacing: "0.1em", marginBottom: 10 }}>◆ TEACHING TIP</div>
                  <p style={{ fontFamily: "var(--serif)", fontSize: 13, color: "var(--ink-dim)", lineHeight: 1.75, fontStyle: "italic", margin: 0 }}>{m.tip}</p>
                </div>

                {/* Project badge */}
                {m.project && (
                  <div style={{ padding: 18, background: m.color + "15", border: `2px solid ${m.color}`, borderRadius: 4 }}>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 9, fontWeight: 700, color: m.color, letterSpacing: "0.1em", marginBottom: 8 }}>🏆 MILESTONE PROJECT</div>
                    <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink)", lineHeight: 1.6, margin: 0 }}>{m.project}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── CONCEPTS ── */}
        {tab === "concepts" && (
          <div className="anim-up">
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>Key Concepts</h2>
              <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-faint)" }}>Study these before starting the lab exercise</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
              {m.concepts.map((c, i) => (
                <div key={i} style={{ padding: 20, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 2, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${m.color}, transparent)` }} />
                  <div style={{ fontFamily: "var(--mono)", fontSize: 13, fontWeight: 700, color: m.color, marginBottom: 10 }}>{c.term}</div>
                  <p style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--ink-dim)", lineHeight: 1.7, margin: 0 }}>{c.def}</p>
                </div>
              ))}
            </div>

            <div style={{ padding: "18px 20px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 4, display: "flex", gap: 14, alignItems: "flex-start" }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
              <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--amber)", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 6 }}>TEACHING APPROACH</div>
                <p style={{ fontFamily: "var(--serif)", fontSize: 13, color: "var(--ink-dim)", fontStyle: "italic", lineHeight: 1.75, margin: 0 }}>{m.tip}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── LAB ── */}
        {tab === "lab" && (
          <div className="anim-up">
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 }}>
              <div>
                <h2 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>Lab: {m.lab.title}</h2>
                <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-dim)", marginBottom: 4 }}>{m.lab.titleKh}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: m.color }}>Duration: {m.lab.duration}</div>
              </div>
              <div style={{ padding: "10px 16px", background: m.color + "15", border: `1px solid ${m.color}40`, borderRadius: 4 }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: m.color, letterSpacing: "0.1em", marginBottom: 4 }}>OBJECTIVE</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-dim)", maxWidth: 300, lineHeight: 1.5 }}>{m.lab.objective}</div>
              </div>
            </div>

            <div style={{ maxWidth: 1000, margin: "0 auto" }}>
              {/* Steps */}
              <div style={{ marginBottom: 48 }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-faint)", letterSpacing: "0.1em", marginBottom: 18 }}>STEP-BY-STEP ({m.lab.steps.length} steps)</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
                  {m.lab.steps.map((s, i) => (
                    <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "16px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 4, height: "100%" }}>
                      <div style={{ width: 24, height: 24, flexShrink: 0, background: m.color, color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700, borderRadius: 2 }}>{i + 1}</div>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 11.5, color: "var(--ink)", lineHeight: 1.5 }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Concepts recap */}
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: 32 }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-faint)", letterSpacing: "0.1em", marginBottom: 16 }}>KEY CONCEPTS TO APPLY</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {m.concepts.map((c, i) => (
                    <div key={i} style={{ padding: "16px 18px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 4 }}>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 12, fontWeight: 700, color: m.color, marginBottom: 6 }}>{c.term}</div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-dim)", lineHeight: 1.6 }}>{c.def}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={{ marginTop: 24, padding: "20px 24px", background: "var(--surface)", border: `1px solid var(--amber)20`, borderLeft: `4px solid var(--amber)`, borderRadius: 4 }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--amber)", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>◆ PROFESSOR'S TIP</div>
                <p style={{ fontFamily: "var(--serif)", fontSize: 14, color: "var(--ink-dim)", fontStyle: "italic", margin: 0, lineHeight: 1.75 }}>{m.tip}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── CODE ── */}
        {tab === "code" && (
          <div className="anim-up">
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>Code: {m.lab.title}</h2>
              <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-faint)" }}>Study the code, run it locally, experiment</p>
            </div>

            <div style={{ height: 480, marginBottom: 20 }}>
              <CodeBlock code={m.lab.code} output={m.lab.output} cmd={m.lab.steps[0]} color={m.color} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {m.concepts.map((c, i) => (
                <div key={i} style={{ padding: "16px 18px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 2 }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700, color: m.color, marginBottom: 6 }}>{c.term}</div>
                  <p style={{ fontFamily: "var(--mono)", fontSize: 11.5, color: "var(--ink-dim)", margin: 0, lineHeight: 1.6 }}>{c.def}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ROOT ──────────────────────────────────────────────────────
export default function LaravelCourse() {
  const [selected, setSelected] = useState<number | null>(null);

  const goTo = useCallback((i: number) => { setSelected(i); window.scrollTo(0, 0); }, []);
  const back = useCallback(() => setSelected(null), []);
  const prev = useCallback(() => setSelected((s: number | null) => (s !== null ? Math.max(0, s - 1) : null)), []);
  const next = useCallback(() => setSelected((s: number | null) => (s !== null ? Math.min(MODULES.length - 1, s + 1) : null)), []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selected === null) return;
      if (e.key === "ArrowLeft" && selected > 0) prev();
      if (e.key === "ArrowRight" && selected < MODULES.length - 1) next();
      if (e.key === "Escape") back();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selected, prev, next, back]);

  const m = selected !== null ? MODULES[selected] : null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--ink)" }}>
      <style>{GLOBAL_CSS}</style>

      {/* Top navbar */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "rgba(10,10,8,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 52 }}>
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={back}>
            <div style={{ width: 28, height: 28, background: "var(--red)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--mono)", fontSize: 13, fontWeight: 900, color: "#fff", borderRadius: 4, letterSpacing: "-0.04em" }}>L</div>
            <div>
              <span style={{ fontFamily: "var(--serif)", fontSize: 15, fontWeight: 700, color: "var(--ink)", fontStyle: "italic" }}>Laravel</span>
              <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-faint)", marginLeft: 8 }}>University Edition</span>
            </div>
          </div>

          {/* Center info */}
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-faint)", textAlign: "center" }}>
            {m ? (
              <span><span style={{ color: m.color }}>{m.badge}</span> · Module {m.num} of {MODULES.length}</span>
            ) : (
              <span>23 Sections · 34 Hours · Laravel 12 · PHP 8.2+ (8.4 recommended)</span>
            )}
          </div>

          {/* Keyboard hint */}
          <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-faint)", display: "flex", gap: 6, alignItems: "center" }}>
            {m && <span>← → navigate · ESC back</span>}
            {!m && <span>Click any module to begin</span>}
          </div>
        </div>
      </div>

      {/* Page */}
      {selected === null
        ? <Overview onSelect={goTo} />
        : <ModulePage
          mod={m!}
          onBack={back}
          onPrev={prev}
          onNext={next}
          canPrev={selected > 0}
          canNext={selected < MODULES.length - 1}
          currentIndex={selected}
        />
      }
    </div>
  );
}