'use client'

import { useState, useCallback, useEffect, useRef, type CSSProperties } from "react";

// ─── TYPES ─────────────────────────────────────────────────────
interface ModuleTopic {
  en: string;
  kh: string;
  answerEn: string;
  answerKh: string;
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
  explanation?: { title: string; desc: string; }[];
  lab: ModuleLab;
  concepts: ModuleConcept[];
  tip: string;
  project?: string | null;
}

// ─── GLOBAL STYLES ────────────────────────────────────────────
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,600;0,700;1,400&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,400&family=Noto+Sans+Khmer:wght@400;600;800;900&display=swap');

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

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

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

/* Responsive Utility Classes */
.hide-mobile { display: block; }
.mobile-stack { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.mobile-wrap { display: flex; flex-wrap: wrap; }
.mobile-padding { padding: 48px 24px 80px; }

@media (max-width: 1024px) {
  .mobile-stack { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .hide-mobile { display: none !important; }
  .mobile-padding { padding: 24px 16px 60px !important; }
  
  .hero-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
  .hero-title { font-size: 48px !important; }
  
  .module-nav { height: auto !important; flex-direction: column; align-items: stretch !important; }
  .module-nav-top { display: flex; align-items: center; border-bottom: 1px solid var(--border); height: 50px; }
  .module-tabs { overflow-x: auto; white-space: nowrap; scrollbar-width: none; }
  .module-tabs::-webkit-scrollbar { display: none; }
}
`;

// ─── DATA ──────────────────────────────────────────────────────
const MODULES = [
  {
    id: "m01", num: "01", section: "Section 1", hours: "1.5h",
    title: "Introduction to Laravel",
    titleKh: "ការណែនាំ Laravel",
    goal: "Understand how Laravel works, the ideas behind its design, and how its project structure is organized",
    goalKh: "យល់ដឹងពីរបៀបដែល Laravel ដំណើរការ គំនិតនៅពីក្រោយការរចនារបស់វា និងរបៀបរៀបចំរចនាសម្ព័ន្ធថត (Project Structure)",
    color: "#ff4d4d",
    badge: "FOUNDATION",
    topics: [
      {
        en: "What is Laravel?",
        kh: "Laravel ជាអ្វី?",
        answerEn: "A PHP framework to build web apps fast.",
        answerKh: "Framework PHP សម្រាប់បង្កើត Web App ងាយ។"
      },
      {
        en: "Why use Laravel? Security, Speed & Smart Defaults",
        kh: "ហេតុអ្វីប្រើ Laravel? សុវត្ថិភាព ល្បឿន និងកំណត់ឆ្លាត",
        answerEn: "It’s secure, fast, and easy to use.",
        answerKh: "សុវត្ថិភាព ល្បឿន និងងាយប្រើ។"
      },
      {
        en: "Laravel 12 Folder Structure",
        kh: "រចនាសម្ព័ន្ធថត Laravel 12",
        answerEn: "Folders like app/, routes/, resources/, config/ organize your project.",
        answerKh: "ថត app/, routes/, resources/, config/ រៀបចំ Project។"
      },
      {
        en: "How HTTP Requests Work in Laravel",
        kh: "របៀបដែល HTTP Request ដំណើរការ",
        answerEn: "Browser → Server → Controller → Response.",
        answerKh: "Browser → Server → Controller → Response។"
      }
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
      {
        term: "Laravel",
        def: "PHP Framework ទំនើប សម្រាប់បង្កើត Web Application ងាយ និងសុវត្ថិភាព។"
      },
      {
        term: "Framework",
        def: "រចនាសម្ព័ន្ធដែលមានឧបករណ៍ស្រាប់ ដើម្បីផ្តោតលើការបង្កើតមុខងារ។"
      },
      {
        term: "Composer",
        def: "Package Manager របស់ PHP សម្រាប់ដំឡើង និងគ្រប់គ្រង Library និង Dependency។"
      },
      {
        term: "Request Lifecycle",
        def: "ដំណើរការ Request ពី Browser → Server → Controller → Response។"
      },
      {
        term: "Convention over Configuration",
        def: "Laravel កំណត់លំនាំដើមឆ្លាត ដើម្បីកាត់បន្ថយការកំណត់ដោយដៃ។"
      },
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
      {
        en: "app/ — The application brain",
        kh: "app/ — ខួរក្បាលរបស់កម្មវិធី",
        answerEn: "Contains Models, Controllers, Middleware, and your core business logic.",
        answerKh: "ផ្ទុក Models, Controllers, Middleware និង Logic សំខាន់ៗរបស់កម្មវិធី។"
      },
      {
        en: "routes/ — The URL map",
        kh: "routes/ — ផែនទី URL",
        answerEn: "Defines all entry points: web.php for browsers and api.php for services.",
        answerKh: "កំណត់ច្រកចូលទាំងអស់៖ web.php សម្រាប់ Browser និង api.php សម្រាប់ API។"
      },
      {
        en: "resources/ & public/ — The UI and entry door",
        kh: "resources/ & public/ — UI និងច្រកចូល",
        answerEn: "resources/ holds Blade views; public/ index.php is the server entry point.",
        answerKh: "resources/ ផ្ទុក Blade views; public/ index.php គឺជាច្រកចូលដំបូងរបស់ Server។"
      },
      {
        en: "database/ & .env — Storage and secrets",
        kh: "database/ & .env — ការផ្ទុក និងអាថ៌កំបាំង",
        answerEn: "database/ contains migrations; .env stores sensitive credentials safely.",
        answerKh: "database/ ផ្ទុក migrations; .env រក្សាទុកព័ត៌មានសម្ងាត់ដោយសុវត្ថិភាព។"
      },
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
    goal: "The command-line interface and manage sensitive configuration with .env",
    goalKh: "Artisan CLI និងការគ្រប់គ្រង Configuration ដោយ .env",
    color: "#8a8680",
    badge: "TOOLS",
    topics: [
      { en: "Artisan CLI Architecture (built on Symfony Console)", kh: "Artisan CLI (បង្កើតផ្អែកលើ Symfony Console)", answerEn: "Artisan is built on the Symfony Console component, providing a powerful CLI for Laravel.", answerKh: "Artisan ត្រូវបានបង្កើតឡើងនៅលើ Symfony Console component ដែលផ្ដល់នូវ CLI ដ៏មានឥទ្ធិពលសម្រាប់ Laravel។" },
      { en: "make:* Code Generators — controllers, models, migrations", kh: "make:* — បង្កើត Controllers, Models, Migrations ដោយស្វ័យប្រវត្តិ", answerEn: "Artisan includes many generators to speed up development by scaffolding common classes.", answerKh: "Artisan រួមមាន generators ជាច្រើនដើម្បីបង្កើនល្បឿនអភិវឌ្ឍន៍ដោយការបង្កើត scaffold សម្រាប់ class ទូទៅ។" },
      { en: "Environment Variables (.env) and Config caching", kh: "Environment Variables (.env) និងការ Cache Config", answerEn: "Manage sensitive data via .env files and optimize performance with config:cache.", answerKh: "គ្រប់គ្រងទិន្នន័យសំខាន់ៗតាមរយៈ .env file និងបង្កើនល្បឿនជាមួយ config:cache។" },
      { en: "Tinker: Interactive PHP REPL for testing logic", kh: "Tinker — Shell PHP Interactive សម្រាប់ Test Logic", answerEn: "Tinker is a REPL that allows you to interact with your Laravel application and database in real-time.", answerKh: "Tinker គឺជា REPL ដែលអនុញ្ញាតឱ្យអ្នកធ្វើការជាមួយ Laravel application និង database ក្នុងពេលជាក់ស្តែង។" },
    ],
    lab: {
      title: "Artisan Exploration & Tinker Session",
      titleKh: "ស្វែងរក Artisan និង Tinker",
      duration: "45 min",
      objective: "Use artisan commands confidently and test PHP logic in Tinker",
      steps: [
        "Run: php artisan list — explore all available commands",
        "Run: php artisan about — see environment summary",
        "Run: php artisan route:list — check existing routes",
        "Run: php artisan tinker — test PHP expressions live",
        "Generate a standard controller: php artisan make:controller HomeController",
        "Generate an API controller: php artisan make:controller Api/UserController --api",
        "Generate a model with migration: php artisan make:model Product -m",
        "Run migrations: php artisan migrate",
        "Clear cache & config: php artisan config:clear, php artisan cache:clear"
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
php artisan make:controller Api/HomeController --api
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
    id: "m02a", num: "02a", section: "Section 2 (cont.)", hours: "1.5h",
    title: "Docker Fundamentals for Backend",
    titleKh: "មូលដ្ឋានគ្រឹះ Docker សម្រាប់ Backend",
    goal: "Understand container basics and run your first Docker environment",
    goalKh: "យល់ដឹងពីមូលដ្ឋាន Container និងដំណើរការ Docker ជាលើកដំបូង",
    color: "#4d9fff",
    badge: "DEVOPS",

    topics: [
      {
        en: "Docker Setup",
        kh: "ការតំឡើង Docker",
        answerEn: "Install Docker Desktop to run containers on your machine.",
        answerKh: "ដំឡើង Docker Desktop ដើម្បីដំណើរការ Container លើកុំព្យូទ័រ។"
      },
      {
        en: "Images vs Containers",
        kh: "Images និង Containers",
        answerEn: "Image = template, Container = running app.",
        answerKh: "Image = ប្លង់មេ, Container = កម្មវិធីកំពុងដំណើរការ។"
      },
      {
        en: "Why Docker?",
        kh: "ហេតុអ្វីប្រើ Docker?",
        answerEn: "Same environment everywhere, no conflict.",
        answerKh: "Environment ដូចគ្នា គ្មានបញ្ហា version conflict។"
      }
    ],

    lab: {
      title: "Run Your First Container",
      titleKh: "ដំណើរការ Container ដំបូង",
      duration: "45 min",
      objective: "Verify Docker works and understand container lifecycle",

      steps: [
        "Install Docker Desktop",
        "Run: docker --version",
        "Run: docker pull hello-world",
        "Run: docker run hello-world",
        "Check containers: docker ps -a",
        "Open Docker Dashboard to view container"
      ],

      code: `docker --version
docker pull hello-world
docker run hello-world

docker ps -a
docker images`,

      output: `Hello from Docker!
This shows Docker is working correctly.`
    },

    concepts: [
      { term: "Image", def: "Template សម្រាប់បង្កើត Container" },
      { term: "Container", def: "កម្មវិធីកំពុងដំណើរការ នៅក្នុង Docker" }
    ],

    tip: "Docker = run app without installing PHP/MySQL directly on your machine.",
    project: null
  },
  {
    id: "m02b", num: "02b", section: "Section 2 (cont.)", hours: "1.5h",
    title: "XAMPP Setup",
    titleKh: "ការតំឡើង XAMPP",
    goal: "Setup traditional local environment with XAMPP",
    goalKh: "ដំឡើង Environment Local បែបប្រពៃណីជាមួយ XAMPP",
    color: "#fbbf24",
    badge: "SETUP",

    topics: [
      {
        en: "What is XAMPP?",
        kh: "តើ XAMPP ជាអ្វី?",
        answerEn: "Apache, MariaDB, PHP and Perl distribution in one package.",
        answerKh: "កញ្ចប់កម្មវិធីរួមមាន Apache, MariaDB, PHP និង Perl។"
      },
      {
        en: "Control Panel",
        kh: "ផ្ទាំងបញ្ជា",
        answerEn: "Start/Stop Apache (Web Server) and MySQL (Database).",
        answerKh: "បញ្ជាបើក/បិទ Apache និង MySQL។"
      },
      {
        en: "htdocs folder",
        kh: "ថត htdocs",
        answerEn: "The place where you put your PHP project files.",
        answerKh: "ទីតាំងសម្រាប់ដាក់ឯកសារ Project PHP។"
      }
    ],

    lab: {
      title: "Run PHP with XAMPP",
      titleKh: "ដំណើរការ PHP ជាមួយ XAMPP",
      duration: "45 min",
      objective: "Verify XAMPP is working and understand htdocs",

      steps: [
        "Download and install XAMPP from apachefriends.org",
        "Open XAMPP Control Panel",
        "Start Apache and MySQL services",
        "Navigate to htdocs folder in XAMPP directory",
        "Create index.php with basic echo",
        "Visit: http://localhost"
      ],

      code: `<?php\necho "Hello from XAMPP!";\nphpinfo();`,

      output: `Hello from XAMPP!\nPHP Version ...`
    },

    concepts: [
      { term: "Local Server", def: "កុំព្យូទ័ររបស់អ្នកដើរតួជា Server សម្រាប់ផ្ទុក Website" },
      { term: "htdocs", def: "ថតលំនាំដើមសម្រាប់ដាក់ Project PHP ក្នុង XAMPP" },
      { term: "Services", def: "កម្មវិធីដែលដំណើរការនៅ Background (Apache, MySQL)" }
    ],

    tip: "XAMPP ងាយស្រួលសម្រាប់ចាប់ផ្តើមដំបូង ប៉ុន្តែវាអាចមានបញ្ហា version conflict ពេលមាន project ច្រើន។",
    project: null
  },
  {
    id: "m02c", num: "02C", section: "Section 2 (cont.)", hours: "1h",
    title: "Docker vs XAMPP",
    titleKh: "Docker ប្រៀបធៀប XAMPP",
    goal: "Clearly understand the difference between local server and containers",
    goalKh: "យល់ច្បាស់ពីភាពខុសគ្នារវាង Server Local និង Container",
    color: "#22c55e",
    badge: "COMPARISON",

    topics: [
      {
        en: "XAMPP",
        kh: "XAMPP",
        answerEn: "Runs PHP & MySQL directly on your OS.",
        answerKh: "ដំណើរការ PHP និង MySQL លើ OS ផ្ទាល់។"
      },
      {
        en: "Docker",
        kh: "Docker",
        answerEn: "Runs apps inside isolated containers.",
        answerKh: "ដំណើរការកម្មវិធីក្នុង Container ដាច់ដោយឡែក។"
      },
      {
        en: "Main Difference",
        kh: "ភាពខុសគ្នាសំខាន់",
        answerEn: "XAMPP = shared system, Docker = isolated per project.",
        answerKh: "XAMPP = ប្រើរួម, Docker = ដាច់ដោយឡែក។"
      }
    ],

    lab: {
      title: "XAMPP vs Docker Demo",
      titleKh: "សាកល្បង XAMPP និង Docker",
      duration: "60 min",
      objective: "Run Laravel in both environments and compare",

      steps: [
        "Create Laravel project (XAMPP)",
        "Run: php artisan serve",
        "Open: http://127.0.0.1:8000",

        "Install Sail in same project",
        "Run: php artisan sail:install",
        "Run: ./vendor/bin/sail up -d",
        "Open: http://localhost",

        "Compare results"
      ],

      code: `# XAMPP
php artisan serve

# Docker
composer require laravel/sail --dev
php artisan sail:install

cp .env.example .env
php artisan key:generate

./vendor/bin/sail up -d`,

      output: `XAMPP → http://127.0.0.1:8000
Docker → http://localhost`
    },

    concepts: [
      { term: "XAMPP", def: "Server ដំណើរការលើម៉ាស៊ីនផ្ទាល់" },
      { term: "Docker", def: "Container ដាច់ដោយឡែកសម្រាប់ Project" },
      { term: "Isolation", def: "Project មួយមិនប៉ះពាល់មួយទៀត" }
    ],

    tip: "XAMPP សម្រាប់រៀន → Docker សម្រាប់ការងារពិត",
    project: null
  },
  {
    id: "m03", num: "03", section: "Section 3", hours: "1.5h",
    title: "Docker & Laravel Sail",
    titleKh: "Docker និង Laravel Sail",
    goal: "Run Laravel using Docker like real-world projects",
    goalKh: "ដំណើរការ Laravel ជាមួយ Docker ដូចការងារពិត",
    color: "#4d9fff",
    badge: "DEVOPS",

    topics: [
      {
        en: "Laravel Sail",
        kh: "Laravel Sail",
        answerEn: "Simple way to use Docker in Laravel.",
        answerKh: "វិធីងាយស្រួលប្រើ Docker ក្នុង Laravel។"
      },
      {
        en: "Multi Services",
        kh: "Service ច្រើន",
        answerEn: "PHP, MySQL, Redis run together.",
        answerKh: "PHP, MySQL, Redis ដំណើរការជាមួយគ្នា។"
      }
    ],

    lab: {
      title: "Run Laravel with Docker",
      titleKh: "ដំណើរការ Laravel ជាមួយ Docker",
      duration: "60 min",
      objective: "Setup full Laravel Docker environment",

      steps: [
        "Install Sail",
        "Run sail:install (select mysql, redis, mailpit)",
        "Setup .env and key",
        "Start containers",
        "Check services",
        "Run migration"
      ],

      code: `composer require laravel/sail --dev

php artisan sail:install
# select: mysql, redis, mailpit

cp .env.example .env
php artisan key:generate

./vendor/bin/sail up -d

./vendor/bin/sail ps

./vendor/bin/sail artisan migrate`,

      output: `Containers running:
- laravel
- mysql
- redis
- mailpit`
    },

    concepts: [
      { term: "Sail", def: "CLI សម្រាប់ដំណើរការ Docker ក្នុង Laravel" },
      { term: "Container", def: "Environment ដាច់ដោយឡែក" }
    ],

    tip: "Use Docker → no more 'it works on my machine' problem",
    project: null
  },
  {
    id: "m04", num: "04", section: "Section 4", hours: "1.5h",
    title: "MVC Architecture: The Big Picture",
    titleKh: "ស្ថាបត្យកម្ម MVC និង Request Lifecycle",
    goal: "Understand the core architecture that powers 99% of professional web applications",
    goalKh: "យល់ដឹងពីស្ថាបត្យកម្មស្នូលដែលប្រើប្រាស់ក្នុង Web App អាជីព",
    color: "#b06bff",
    badge: "ARCHITECTURE",
    topics: [
      {
        en: "The MVC Philosophy",
        kh: "ទស្សនវិជ្ជា MVC",
        answerEn: "Separating data (Model), interface (View), and logic (Controller) to make code maintainable.",
        answerKh: "ការបែងចែកទិន្នន័យ (Model), ចំណុចប្រទាក់ (View) និង Logic (Controller) ដើម្បីឱ្យកូដងាយស្រួលថែទាំ។"
      },
      {
        en: "The Request Lifecycle",
        kh: "Request Lifecycle",
        answerEn: "The 6-step journey: User -> Route -> Controller -> Model -> View -> Browser.",
        answerKh: "ដំណើរការ ៦ ជំហាន៖ អ្នកប្រើ -> Route -> Controller -> Model -> View -> Browser។"
      },
      {
        en: "Directory Mapping",
        kh: "ការគ្រប់គ្រង Folder",
        answerEn: "Knowing exactly where code lives: app/Models, app/Http/Controllers, and resources/views.",
        answerKh: "ស្គាល់ទីតាំងកូដច្បាស់លាស់៖ Folder Models, Controllers និង Views។"
      },
      {
        en: "Naming Conventions",
        kh: "ស្តង់ដារនៃការដាក់ឈ្មោះ",
        answerEn: "Singular for Models (Product), Plural for Controllers (ProductController), lowercase for Views.",
        answerKh: "ឈ្មោះឯកវចនៈសម្រាប់ Model (Product), ពហុវចនៈសម្រាប់ Controller (ProductController)។"
      },
    ],
    explanation: [
      { title: "Step 1: The Request", desc: "User វាយ URL (ឧទាហរណ៍: /profile) ក្នុង Browser ផ្ញើ Request មកកាន់ Server។" },
      { title: "Step 2: The Router", desc: "Laravel ពិនិត្យ routes/web.php ដើម្បីស្វែងរកថា តើ Controller មួយណាត្រូវទទួលបន្ទុកលើ URL នេះ។" },
      { title: "Step 3: The Controller", desc: "Controller ទទួល Request រួចហៅ Model ឱ្យទៅទាញទិន្នន័យពី Database ឬអនុវត្ត Logic ផ្សេងៗ។" },
      { title: "Step 4: The View", desc: "Controller បញ្ជូនទិន្នន័យទៅឱ្យ Blade Template ដើម្បីរៀបចំជា HTML ដែល User អាចមើលឃើញ។" }
    ],
    lab: {
      title: "MVC Directory Walkthrough",
      titleKh: "ការស្វែងយល់ពី Directory MVC",
      duration: "30 min",
      objective: "Locate and identify the core MVC files in a fresh Laravel installation",
      steps: [
        "Open app/Http/Controllers — the 'Traffic Cop' folder",
        "Open app/Models — the 'Database Blueprint' folder",
        "Open resources/views — the 'Presentation' folder",
        "Trace a request from routes/web.php to a Controller method",
        "Locate the welcome.blade.php and modify it to see instant changes"
      ],
      code: `// ── Directory Structure ──────────────────────────
// Logic Layer: app/Http/Controllers/
// Data Layer: app/Models/
// Visual Layer: resources/views/
// Entry Point: routes/web.php

# Create a new controller to see the structure
php artisan make:controller DemoController`,
      output: `app/
├── Http/
│   └── Controllers/
│       └── DemoController.php (CREATED ✓)
├── Models/
│   └── User.php
resources/
└── views/
    └── welcome.blade.php`
    },
    concepts: [
      { term: "Separation of Concerns", def: "A design principle where each part of the app handles one specific task. Models ONLY handle data; Views ONLY handle visuals." },
      { term: "Request Lifecycle", def: "The technical path a web request takes through the framework before it becomes a response on the user's screen." },
      { term: "Router", def: "The gatekeeper. It maps a URL (e.g., /about) to a specific function in a Controller." },
    ],
    tip: "Think of MVC like a restaurant: The Model is the Kitchen, the View is the Dining Room, and the Controller is the Waiter who connects them.",
  },
  {
    id: "m04b", num: "04B", section: "Section 4 (cont.)", hours: "1.5h",
    title: "Controllers: The Traffic Cops",
    titleKh: "Controllers: អ្នកគ្រប់គ្រងចរាចរណ៍កូដ",
    goal: "Logic handling and data passing from the backend to the frontend",
    goalKh: "ស្ទាត់ជំនាញលើការបញ្ជូនទិន្នន័យពី Backend ទៅកាន់ Frontend",
    color: "#b06bff",
    badge: "ARCHITECTURE",
    topics: [
      {
        en: "Controller Anatomy",
        kh: "រចនាសម្ព័ន្ធ Controller",
        answerEn: "Methods (Actions) inside a class that handle specific URL routes.",
        answerKh: "ការប្រើប្រាស់ Method (Actions) ក្នុង Class ដើម្បីចាត់ចែង Route នីមួយៗ។"
      },
      {
        en: "Data Transfer (compact)",
        kh: "ការបញ្ជូនទិន្នន័យ (compact)",
        answerEn: "Passing variables from PHP logic into the Blade view for rendering.",
        answerKh: "ការផ្ញើ Variable ពី PHP Logic ទៅកាន់ Blade View ដើម្បីបង្ហាញលទ្ធផល។"
      },
      {
        en: "The View Helper",
        kh: "ការប្រើ function view()",
        answerEn: "The global helper used to return a rendered template with optional data.",
        answerKh: "Helper សម្រាប់ហៅ Template មកបង្ហាញជាមួយនឹងទិន្នន័យដែលចង់ផ្ញើទៅ។"
      },
      {
        en: "API vs Web Controllers",
        kh: "Web Controller ធៀបនឹង API",
        answerEn: "Web controllers return HTML; API controllers return JSON data.",
        answerKh: "Web Controller បញ្ជូន HTML ឯ API Controller បញ្ជូនទិន្នន័យជា JSON។"
      },
    ],
    explanation: [
      { title: "Method Creation", desc: "យើងបង្កើត public function ក្នុង Controller ដើម្បីតំណាងឱ្យ Action មួយ (ដូចជា index ឬ show)។" },
      { title: "Processing Logic", desc: "ក្នុង Method នោះ យើងអាចគណនាលេខ ទាញ Database ឬឆែកលក្ខខណ្ឌផ្សេងៗ។" },
      { title: "Passing Data", desc: "ប្រើ compact('var_name') ដើម្បីផ្ញើ Variable ទៅកាន់ View ដោយមិនបាច់សរសេរច្រើន។" },
      { title: "Returning View", desc: "Laravel ស្វែងរក File ក្នុង resources/views/ តាមរយៈឈ្មោះដែលយើងផ្ដល់ឱ្យ (ឧទាហរណ៍: return view('home'))។" }
    ],
    lab: {
      title: "Building the Product Controller",
      titleKh: "ការបង្កើត Product Controller",
      duration: "45 min",
      objective: "Create a functional controller that passes dynamic data to a view",
      steps: [
        "Generate controller: php artisan make:controller ProductController",
        "Create an array of fake products in the index() method",
        "Pass the array to the view using the compact() helper",
        "Set up a route that calls this index method",
        "Return a JSON response to see the difference for API usage"
      ],
      code: `// 1. Create the Controller
php artisan make:controller ProductController

// 2. app/Http/Controllers/ProductController.php
public function index() {
    $title = "Premium Catalog";
    $products = ['MacBook', 'iPhone', 'iPad'];
    
    // Pass data to resources/views/products.blade.php
    return view('products', compact('title', 'products'));
}

// 3. To return as API (JSON):
// return response()->json($products);`,
      output: `// Browser View:
<h1>Premium Catalog</h1>
<ul>
  <li>MacBook</li>
  <li>iPhone</li>
  <li>iPad</li>
</ul>`
    },
    concepts: [
      { term: "Action Method", def: "A public function inside a controller that is mapped to a route. Each method handles one specific page or API endpoint." },
      { term: "compact()", def: "A PHP function that creates an array containing variables and their values. In Laravel, it's the standard way to send data to views." },
      { term: "Dependency Injection", def: "Laravel's ability to automatically provide objects (like Request) to your controller methods just by type-hinting them." },
    ],
    tip: "Always keep your controllers 'Skinny'. If a controller becomes too long, move the heavy logic into a 'Service' class or the 'Model'.",
  },
  {
    id: "m04c", num: "04C", section: "Section 4 (cont.)", hours: "1.5h",
    title: "Blade: Presentation",
    titleKh: "Blade: Layout",
    goal: "Build professional, reusable user interfaces using Laravel's powerful template engine",
    goalKh: "បង្កើត UI ដែលអាចប្រើឡើងវិញបានខ្ពស់ជាមួយ Blade Engine",
    color: "#b06bff",
    badge: "ARCHITECTURE",
    topics: [
      {
        en: "Template Inheritance",
        kh: "ការប្រើប្រាស់ Inheritance",
        answerEn: "Using a layout to define the shell (header/footer) and extending it in child pages.",
        answerKh: "ការប្រើ Layout សម្រាប់ Header/Footer និងអនុញ្ញាតឱ្យ Page ផ្សេងៗទាញយកទៅប្រើ។"
      },
      {
        en: "Directives (@if, @foreach)",
        kh: "ការប្រើប្រាស់ Directives",
        answerEn: "Simplified PHP syntax for control structures directly inside HTML.",
        answerKh: "Syntax ងាយស្រួលសម្រាប់ការសរសេរ If-Else ឬ Loop នៅក្នុង HTML។"
      },
      {
        en: "Yield vs Section",
        kh: "Yield ធៀបនឹង Section",
        answerEn: "@yield defines a placeholder; @section fills that placeholder with content.",
        answerKh: "@yield កំណត់កន្លែងទំនេរ ឯ @section គឺជាអ្នកបំពេញខ្លឹមសារចូលក្នុងកន្លែងនោះ។"
      },
      {
        en: "XSS Protection ({{ }})",
        kh: "ការការពារសុវត្ថិភាព XSS",
        answerEn: "Double curly braces automatically escape dangerous scripts for security.",
        answerKh: "សញ្ញា {{ }} ជួយសម្អាតកូដដែលគ្រោះថ្នាក់ដោយស្វ័យប្រវត្តិកុំឱ្យដើរលើ Browser។"
      },
    ],
    explanation: [
      { title: "Layout", desc: "បង្កើត File មួយ (ឧទាហរណ៍: app.blade.php) ដែលមាន Header/Nav/Footer រួចប្រើ @yield('content')។" },
      { title: "Extending Layout", desc: "Page បន្ទាប់គ្រាន់តែសរសេរ @extends('layouts.app') វានឹងទាញរចនាសម្ព័ន្ធមេមកភ្លាម។" },
      { title: "Dynamic Content", desc: "ប្រើ @section('content') ... @endsection ដើម្បីបញ្ជូនខ្លឹមសារទៅក្នុង Layout មេ។" },
      { title: "Looping Data", desc: "ប្រើ @foreach($items as $item) ដើម្បីបង្ហាញបញ្ជីទិន្នន័យដែលមកពី Controller។" }
    ],
    lab: {
      title: "Creating a Reusable Layout",
      titleKh: "ការបង្កើត Layout",
      duration: "60 min",
      objective: "Set up a professional layout system and pass dynamic arrays to it",
      steps: [
        "Create resources/views/layouts/main.blade.php with HTML5 boilerplate",
        "Add @yield('title') and @yield('content') placeholders",
        "Create home.blade.php that @extends the main layout",
        "Use @foreach to display a list of categories passed from controller",
        "Add a CSS link inside the layout that applies to all pages"
      ],
      code: `// 1. resources/views/layouts/main.blade.php
<html>
  <head><title>@yield('title')</title></head>
  <body>
    <nav>Navigation Bar</nav>
    @yield('content')
    <footer>Copyright 2026</footer>
  </body>
</html>

// 2. resources/views/home.blade.php
@extends('layouts.main')
@section('title', 'Homepage')
@section('content')
  <h1>Our Services</h1>
  @foreach($services as $s)
    <p>{{ $s }}</p>
  @endforeach
@endsection`,
      output: `<!-- Rendered HTML -->
<html>
  <head><title>Homepage</title></head>
  <body>
    <nav>Navigation Bar</nav>
    <h1>Our Services</h1>
    <p>Web Dev</p>
    <p>Mobile App</p>
    <footer>Copyright 2026</footer>
  </body>
</html>`
    },
    concepts: [
      { term: "Blade Engine", def: "A powerful templating engine that compiles Blade files into plain PHP code and caches them for high performance." },
      { term: "XSS Prevention", def: "Cross-Site Scripting protection. {{ $data }} automatically converts characters like < to &lt; to prevent hackers from injecting scripts." },
      { term: "Component", def: "A small, reusable piece of UI (like a button or card) that can be included in any page using <x-name /> syntax." },
    ],
    tip: "Never put heavy logic or database queries inside a Blade file. Blade should only be used to 'Display' data, not 'Calculate' it.",
    project: null,
  },
  {
    id: "m05", num: "05", section: "Section 5", hours: "1.5h",
    title: "Routing Foundations",
    titleKh: "មូលដ្ឋានគ្រឹះនៃ Routing",
    goal: "The art of mapping URLs to logic with dynamic parameters and naming conventions",
    goalKh: "ស្ទាត់ជំនាញលើការផ្គូផ្គង URL ទៅកាន់ Logic ជាមួយ Parameter និងការដាក់ឈ្មោះ",
    color: "#52e3a0",
    badge: "ROUTING",
    topics: [
      {
        en: "HTTP Verbs (GET vs POST)",
        kh: "HTTP Verbs (GET ធៀបនឹង POST)",
        answerEn: "GET is for retrieving data; POST is for sending/creating data securely.",
        answerKh: "GET សម្រាប់ទាញទិន្នន័យ ឯ POST សម្រាប់ផ្ញើ ឬបង្កើតទិន្នន័យដោយសុវត្ថិភាព។"
      },
      {
        en: "Dynamic URI Parameters",
        kh: "Dynamic URI Parameters",
        answerEn: "Using curly braces {id} to capture values from the URL into your controller.",
        answerKh: "ប្រើសញ្ញា {id} ដើម្បីចាប់យកតម្លៃពី URL បញ្ជូនទៅកាន់ Controller។"
      },
      {
        en: "Named Routes",
        kh: "ការដាក់ឈ្មោះឱ្យ Route",
        answerEn: "Giving a nickname to a route so you can change the URL without breaking links.",
        answerKh: "ការដាក់ឈ្មោះក្រៅឱ្យ Route ដើម្បីងាយស្រួលហៅប្រើ និងប្ដូរ URL មិនឱ្យដាច់ Link។"
      },
      {
        en: "Parameter Constraints",
        kh: "លក្ខខណ្ឌលើ Parameter",
        answerEn: "Using regex (->where) to ensure parameters are only numbers or specific letters.",
        answerKh: "ប្រើ regex ដើម្បីកំណត់ថា Parameter ត្រូវតែជាលេខ ឬអក្សរតាមការចង់បាន។"
      },
    ],
    explanation: [
      { title: "Static Routing", desc: "URL ធម្មតាដូចជា /about ឬ /contact ដែលនាំទៅកាន់ Page ថេរ។" },
      { title: "Dynamic Routing", desc: "URL ដែលមានប្រែប្រួលដូចជា /user/{id} សម្រាប់បង្ហាញ Profile ខុសៗគ្នា។" },
      { title: "Route Naming", desc: "ប្រើ ->name('profile') ដើម្បីហៅក្នុង Blade តាមរយៈ route('profile')។" }
    ],
    lab: {
      title: "Building a Dynamic Profile System",
      titleKh: "ការបង្កើតប្រព័ន្ធ Profile ឌីណាមិក",
      duration: "45 min",
      objective: "Create routes that accept usernames and display them on the page",
      steps: [
        "Define a route in web.php that accepts a {username} parameter",
        "Add a constraint to ensure the username only contains letters",
        "Create a ProfileController with a show($username) method",
        "Pass the username to a Blade view and display it",
        "Add a button that links back home using a named route"
      ],
      code: `// routes/web.php
Route::get('/user/{username}', [ProfileController::class, 'show'])
    ->name('user.profile')
    ->where('username', '[A-Za-z]+');

// app/Http/Controllers/ProfileController.php
public function show($username) {
    return view('profile', compact('username'));
}

// resources/views/profile.blade.php
<h1>Profile of {{ $username }}</h1>
<a href="{{ route('home') }}">Back to Home</a>`,
      output: `URL: /user/rithy → "Profile of rithy"
URL: /user/123   → 404 Not Found (Constraint filter)`
    },
    concepts: [
      { term: "URI Segment", def: "A part of the URL separated by slashes. In /blog/post/1, 'post' is a segment." },
      { term: "Redirect", def: "A response that tells the browser to go to a different URL automatically." },
      { term: "Optional Parameter", def: "A parameter followed by a question mark {name?} which doesn't have to be in the URL." },
    ],
    tip: "Always name your routes. It turns Refactoring (changing URLs) from a nightmare into a 1-second task.",
    project: null,
  },
  {
    id: "m05b", num: "05B", section: "Section 5 (cont.)", hours: "1.5h",
    title: "Request & Response ",
    titleKh: "Request & Response ",
    goal: "Handle user input safely and return professional HTTP responses",
    goalKh: "គ្រប់គ្រងទិន្នន័យពី User និងបញ្ជូន Response ត្រឡប់ទៅវិញតាមស្ដង់ដារ",
    color: "#52e3a0",
    badge: "ROUTING",
    topics: [
      {
        en: "Request Injection",
        kh: "Request Injection",
        answerEn: "Using the Request object to access all incoming data, headers, and files.",
        answerKh: "ប្រើប្រាស់ Request Object ដើម្បីចូលទៅកាន់ទិន្នន័យ Headers និង File ដែលផ្ញើមក។"
      },
      {
        en: "Input Handling",
        kh: "ការគ្រប់គ្រង input",
        answerEn: "Methods like input(), all(), and only() to extract specific data from a request.",
        answerKh: "ប្រើ Method input(), all() ឬ only() ដើម្បីទាញយកទិន្នន័យជាក់លាក់ពី Request។"
      },
      {
        en: "Response Helpers",
        kh: "ការប្រើ Response Helpers",
        answerEn: "Global triggers for returning JSON, downloads, or custom status codes.",
        answerKh: "ឧបករណ៍សម្រាប់បញ្ជូនទិន្នន័យជា JSON ទាញយក File ឬកំណត់ Status Code។"
      },
      {
        en: "Flash Data",
        kh: "ទិន្នន័យ Flash",
        answerEn: "Temporary session data (success messages) that lasts for exactly one request.",
        answerKh: "ទិន្នន័យបណ្ដោះអាសន្ន (ដូចជាសារជោគជ័យ) ដែលបង្ហាញតែម្ដងគត់រួចបាត់ទៅវិញ។"
      },
    ],
    explanation: [
      { title: "Accessing Input", desc: "ប្រើ $request->input('name') ដើម្បីយកទិន្នន័យពី Form ឬ Query String។" },
      { title: "Header Check", desc: "យើងអាចឆែកមើលថា តើ Request មកពី Browser ឬក៏ជា AJAX តាមរយៈ $request->ajax()។" },
      { title: "JSON Delivery", desc: "សម្រាប់ Mobile Apps យើងបញ្ជូនទិន្នន័យជា return response()->json($data)។" },
      { title: "Redirecting", desc: "ក្រោយពេល Save ទិន្នន័យ យើងគួរប្រើ return redirect()->back() ដើម្បីផ្ញើ User ទៅកន្លែងដើម។" }
    ],
    lab: {
      title: "The Search & Feedback Flow",
      titleKh: "លំហូរនៃវេចារបស់ Response",
      duration: "45 min",
      objective: "Capture search queries and return filtered results with a flash message",
      steps: [
        "Create a search form in Blade with an input named 'q'",
        "In the Controller, capture 'q' using the Request object",
        "If the search is empty, redirect back with an error flash message",
        "Return a JSON response if the URL contains ?format=json",
        "Display the search term back to the user to confirm receipt"
      ],
      code: `public function search(Request $request) {
    $query = $request->input('q');
    
    if(!$query) {
        return redirect()->back()->with('error', 'Please enter a search term!');
    }
    
    if($request->has('json')) {
        return response()->json(['results' => [], 'query' => $query]);
    }
    
    return view('search', compact('query'));
}`,
      output: `User types 'Laravel' → Renders search view with "Showing results for: Laravel"
User clicks search without typing → Page reloads with "Please enter a search term!"`
    },
    concepts: [
      { term: "Dependency Injection", def: "A pattern where the framework gives you the tools you need (like Request) as arguments to your function automatically." },
      { term: "Status Codes", def: "Standard numbers like 200 (OK), 404 (Not Found), and 500 (Server Error) that explain the result of a request." },
      { term: "Query String", def: "The part of the URL after the ?, used to pass non-essential parameters like search terms or page numbers." },
    ],
    tip: "Never use $_POST or $_GET directly. Always use the $request object for better security and easier testing.",
    project: null,
  },
  {
    id: "m05c", num: "05C", section: "Section 5 (cont.)", hours: "1.5h",
    title: "Advanced Routing & Security",
    titleKh: "Routing កម្រិតខ្ពស់ និងសុវត្ថិភាព",
    goal: "Architect large-scale routing systems with grouping, middleware, and resource patterns",
    goalKh: "រៀបចំប្រព័ន្ធ Routing ធំៗជាមួយ Grouping, Middleware និង Resource Patterns",
    color: "#52e3a0",
    badge: "ROUTING",
    topics: [
      {
        en: "Route Groups & DRY",
        kh: "Route Groups & DRY",
        answerEn: "Nesting routes to share common prefixes, names, or security settings.",
        answerKh: "ការដាក់ Route បញ្ចូលគ្នាដើម្បីប្រើប្រាស់ Prefix ឬការកំណត់រួមគ្នា។"
      },
      {
        en: "Middleware Layer",
        kh: "ផ្នែក Middleware",
        answerEn: "The gateway that checks permissions (like being logged in) before reaching the controller.",
        answerKh: "ផ្នែកឆែកឆេរអាជ្ញាប័ណ្ណ (ដូចជាការ Login) មុនពេលអនុញ្ញាតឱ្យចូលដល់កូដ។"
      },
      {
        en: "Route Prefixes",
        kh: "ការប្រើ Route Prefixes",
        answerEn: "Adding /admin or /api to a whole group of routes automatically.",
        answerKh: "ការបន្ថែម /admin ឬ /api ទៅកាន់ក្រុមនៃ Route ទាំងមូលដោយស្វ័យប្រវត្តិ។"
      },
      {
        en: "Resource Routing",
        kh: "Resource Routing",
        answerEn: "Generating all 7 standard CRUD routes (index, create, store...) in one line.",
        answerKh: "ការបង្កើត Route ទាំង ៧ សម្រាប់ CRUD ក្នុងពេលតែមួយយ៉ាងរហ័ស។"
      },
    ],
    explanation: [
      { title: "Grouping Logic", desc: "ប្រើ Route::middleware(['auth'])->group(...) ដើម្បីការពារ Page ច្រើនក្នុងពេលតែមួយ។" },
      { title: "URL Prefixes", desc: "ងាយស្រួលគ្រប់គ្រង Dashboard ដោយប្រើ ->prefix('admin')។" },
      { title: "Naming Groups", desc: "ប្រើ ->as('admin.') ដើម្បីឱ្យគ្រប់ Route ក្នុង Group មានឈ្មោះផ្ដើមដោយ admin. ដូចគ្នា។" },
      { title: "Clean CRUD", desc: "Route::resource() ជួយកាត់បន្ថយការសរសេរ Route ដដែលៗសម្រាប់មុខងារ បង្កើត កែប្រែ លុប។" }
    ],
    lab: {
      title: "Building the Admin Route Tree",
      titleKh: "ការរៀបចំរចនាសម្ព័ន្ធ Route Admin",
      duration: "60 min",
      objective: "Set up a structured and secure admin area using groups and resources",
      steps: [
        "Create a group for '/admin' and apply 'auth' middleware",
        "Inside the group, register a resource for Products",
        "Add a nested prefix for '/settings' within the admin group",
        "Run 'php artisan route:list' to verify the nested structure",
        "Attempt to access an admin route and verify it redirects to login"
      ],
      code: `// routes/web.php
Route::middleware(['auth'])->prefix('admin')->as('admin.')->group(function () {
    
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('index');
    
    // Auto-generates 7 routes pre-fixed with /admin/products
    Route::resource('products', ProductController::class);
    
    Route::prefix('settings')->group(function() {
        Route::get('/profile', [SettingController::class, 'edit']);
    });
});`,
      output: `GET  /admin/dashboard        → admin.index
GET  /admin/products         → admin.products.index
POST /admin/products         → admin.products.store
GET  /admin/settings/profile → (Access checked by 'auth')`
    },
    concepts: [
      { term: "Middleware", def: "A filter that sits between the request and the controller. Used for authentication, logging, and CSRF protection." },
      { term: "Resourceful Route", def: "A single declaration that maps the 7 standard RESTful actions to their specific controller methods." },
      { term: "Route model binding", def: "Automatically injecting a database record directly into your controller based on the ID in the URL." },
    ],
    tip: "Use the 'auth' and 'guest' middleware to decide exactly who can see which pages. Combined with Route Groups, this is how you secure entire applications.",
    project: null,
  },
  {
    id: "m06", num: "06", section: "Section 6", hours: "1.5h",
    title: "Migrations & Schema",
    titleKh: "ការគ្រប់គ្រង Database តាមរយៈ Migrations",
    goal: "The full lifecycle of version-controlled database schemas in Laravel 12",
    goalKh: "ស្ទាត់ជំនាញលើការគ្រប់គ្រង Database Schema ជាមួយ Migrations",
    color: "#46a1ff",
    badge: "DATABASE",
    topics: [
      {
        en: "Migration Basics",
        kh: "មូលដ្ឋានគ្រឹះ Migration",
        answerEn: "Tracking database changes in code files rather than manual SQL adjustments.",
        answerKh: "ការតាមដានការផ្លាស់ប្តូរ Database តាមរយៈ File កូដ ជាជាងការសរសេរ SQL ដោយដៃ។"
      },
      {
        en: "Up vs Down Methods",
        kh: "Up ធៀបនឹង Down",
        answerEn: "Up creates/modifies tables; Down reverses those changes (rollback).",
        answerKh: "Up សម្រាប់បង្កើត ឬកែប្រែ Table ឯ Down សម្រាប់លុប ឬផ្លាស់ប្តូរមកវិញ។"
      },
      {
        en: "Core Column Types",
        kh: "ប្រភេទ Column សំខាន់ៗ",
        answerEn: "Standards like string, text, integer, boolean, and timestamps.",
        answerKh: "ប្រភេទ Column ស្តង់ដារដូចជា String, Text, Integer, Boolean និង Timestamps។"
      },
      {
        en: "Migration Lifecycle",
        kh: "Lifecycle នៃ Migration",
        answerEn: "Commands like migrate, rollback, and status to manage schema history.",
        answerKh: "ប្រើពាក្យបញ្ជា migrate, rollback និង status ដើម្បីគ្រប់គ្រងប្រវត្តិនៃ Schema។"
      },
    ],
    explanation: [
      { title: "Version Control", desc: "Migrations គឺជា Git សម្រាប់ Database របស់អ្នក។ វាអនុញ្ញាតឱ្យក្រុមការងារមានរចនាសម្ព័ន្ធ Table ដូចគ្នា។" },
      { title: "The Schema Class", desc: "Laravel ប្រើ Schema Builder ដើម្បីសរសេរកូដដែលដំណើរការបានទាំងលើ MySQL, PostgreSQL និង SQLite។" },
      { title: "Id & Timestamps", desc: "រាល់ Table ថ្មីគួរតែមាន id() និង timestamps() ជាលំនាំដើមសម្រាប់តាមដានទិន្នន័យ។" }
    ],
    lab: {
      title: "Building the Core Schema",
      titleKh: "ការបង្កើត Schema ស្នូល",
      duration: "45 min",
      objective: "Create and execute migrations for a basic blog system",
      steps: [
        "Generate a migration: php artisan make:migration create_posts_table",
        "Add columns: title (string), content (text), is_published (boolean)",
        "Run the migration and check the database using a GUI tool",
        "Add a 'category' column using a new migration (table update)",
        "Practice rolling back the last change with migrate:rollback"
      ],
      code: `// database/migrations/xxxx_create_posts_table.php
public function up(): void {
    Schema::create('posts', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->text('content');
        $table->boolean('is_published')->default(false);
        $table->timestamps();
    });
}

# Run it
php artisan migrate

# Check status
php artisan migrate:status`,
      output: `INFO  Running migrations.
  2026_01_01_000001_create_posts_table ... 18ms DONE
  
+------+------------------------------+-------+
| Ran? | Migration                    | Batch |
+------+------------------------------+-------+
| Yes  | create_posts_table           | 1     |
+------+------------------------------+-------+`
    },
    concepts: [
      { term: "Rollback", def: "The process of undoing the last batch of database migrations." },
      { term: "Migration Batch", def: "A group of migrations that were run at the same time. Rollback undoes one whole batch." },
      { term: "Schema Builder", def: "A tool that allows you to create tables using a fluent PHP interface instead of raw SQL strings." },
    ],
    tip: "Never edit a migration file that has already been pushed to production. Always create a NEW migration to modify existing tables.",
    project: null,
  },
  {
    id: "m06b", num: "06B", section: "Section 6 (cont.)", hours: "1.5h",
    title: "Relational Schema & Constraints",
    titleKh: "ទំនាក់ទំនង និងការរឹតត្បិតទិន្នន័យ",
    goal: "Design complex relationships with strong data integrity and optimized performance",
    goalKh: "រចនាទំនាក់ទំនងរវាង Table ឱ្យមានសុពលភាពខ្ពស់ និងល្បឿនលឿន",
    color: "#46a1ff",
    badge: "DATABASE",
    topics: [
      {
        en: "Foreign Keys (constrained)",
        kh: "ការប្រើ Foreign Keys",
        answerEn: "Linking tables together and ensuring a child record points to a valid parent.",
        answerKh: "ការភ្ជាប់ Table ចូលគ្នា និងធានាថាទិន្នន័យកូនមានទិន្នន័យមេច្បាស់លាស់។"
      },
      {
        en: "Cascade Strategies",
        kh: "យុទ្ធសាស្ត្រ Cascade",
        answerEn: "Automatically deleting child records when a parent is deleted (cascadeOnDelete).",
        answerKh: "ការលុបទិន្នន័យកូនដោយស្វ័យប្រវត្តិកាលណាមានការលុបទិន្នន័យមេ។"
      },
      {
        en: "Database Indexes",
        kh: "ការង្កើត Index",
        answerEn: "Speeding up searches by creating shortcuts for the database engine on specific columns.",
        answerKh: "បង្កើនល្បឿនស្វែងរកទិន្នន័យដោយបង្កើតផ្លូវកាត់សម្រាប់ Database Engine។"
      },
      {
        en: "Soft Deletes",
        kh: "ការលុបបែប Soft Delete",
        answerEn: "Hiding records instead of permanently erasing them, allowing for data recovery.",
        answerKh: "ការលាក់ទិន្នន័យជាជាងការលុបចោលទាំងស្រុង ដើម្បីអាចស្រោចស្រង់មកវិញបាន។"
      },
    ],
    explanation: [
      { title: "One-to-Many Link", desc: "ប្រើ foreignId('user_id')->constrained() ដើម្បីភ្ជាប់ Post ទៅកាន់ User ម្នាក់ៗ។" },
      { title: "Search Speed", desc: "រាល់ Column ណាដែលប្រើក្នុង 'where' clause ញឹកញាប់ គួរតែដាក់ ->index()។" },
      { title: "Unique Constraints", desc: "ប្រើ ->unique() សម្រាប់ Email ឬ Slug ដើម្បីការពារកុំឱ្យមានទិន្នន័យជាន់គ្នា។" }
    ],
    lab: {
      title: "Designing the Relational Web",
      titleKh: "ការរចនាទំនាក់ទំនង Table",
      duration: "45 min",
      objective: "Connect multiple tables with integrity and optimized indexes",
      steps: [
        "Create a 'categories' table first",
        "Add a 'category_id' to the posts table with a foreign key constraint",
        "Implement 'cascadeOnDelete' so deleting a category removes its posts",
        "Add a unique index to the post 'slug' for SEO friendliness",
        "Enable Soft Deletes on the posts table and test $table->softDeletes()"
      ],
      code: `Schema::create('posts', function (Blueprint $table) {
    $table->id();
    // Relational Foreign Key
    $table->foreignId('category_id')
          ->constrained()
          ->cascadeOnDelete();
          
    $table->string('title');
    $table->string('slug')->unique(); // Unique index for speed & logic
    $table->text('content')->index(); // Search index
    
    $table->softDeletes(); // Adds deleted_at column
    $table->timestamps();
});`,
      output: `MySQL Result:
INDEX post_slug_unique (slug)
FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE`
    },
    concepts: [
      { term: "Referential Integrity", def: "The rule that prevents 'orphaned' data — like a post belonging to a category that doesn't exist." },
      { term: "Composite Index", def: "An index that covers multiple columns at once, e.g., status AND created_at together." },
      { term: "UUID", def: "Universally Unique Identifier. A long string (like a-b-c-d) used instead of numbers for IDs to hide record counts." },
    ],
    tip: "Always name your foreign keys according to Laravel convention: {table_singular}_id. It makes your code 50% shorter because Laravel can guess the connection.",
    project: null,
  },
  {
    id: "m06c", num: "06C", section: "Section 6 (cont.)", hours: "1.5h",
    title: "Factories & Industrial Seeding",
    titleKh: "ការ Seeding ទិន្នន័យកម្រិតអាជីព",
    goal: "Automate the generation of massive, realistic datasets for testing and demos",
    goalKh: "បង្កើតទិន្នន័យគំរូរាប់ពាន់ដោយស្វ័យប្រវត្តិសម្រាប់ការសាកល្បង",
    color: "#46a1ff",
    badge: "DATABASE",
    topics: [
      {
        en: "Model Factories",
        kh: "Model Factories",
        answerEn: "Defining a 'blueprint' for what a fake record looks like for a specific model.",
        answerKh: "ការកំណត់គំរូនៃទិន្នន័យ Fake សម្រាប់ Model នីមួយៗ។"
      },
      {
        en: "Faker Library",
        kh: "Faker Library",
        answerEn: "A powerful tool to generate real-looking names, emails, sentences, and dates.",
        answerKh: "ឧបករណ៍ដ៏មានឥទ្ធិពលសម្រាប់បង្កើត ឈ្មោះ, Email, ប្រយោគ និងកាលបរិច្ឆេទឱ្យដូចពិតៗ។"
      },
      {
        en: "Database Seeders",
        kh: "Database Seeders",
        answerEn: "The 'executor' that calls factories to actually insert data into the database.",
        answerKh: "អ្នកបញ្ជាឱ្យ Factory បញ្ចូលទិន្នន័យទៅក្នុង Database ជាក់ស្តែង។"
      },
      {
        en: "Seeding Relationships",
        kh: "ការ Seeding ទំនាក់ទំនង",
        answerEn: "Automatically creating categories and users while generating posts to keep data consistent.",
        answerKh: "បង្កើត Category និង User ដោយស្វ័យប្រវត្តិនៅពេលបង្កើត Post ដើម្បីឱ្យទិន្នន័យមានសង្គតិភាព។"
      },
    ],
    explanation: [
      { title: "Why Seed?", desc: "កុំបញ្ចូលទិន្នន័យដោយដៃ! ការ Seeding ជួយឱ្យអ្នកមានទិន្នន័យរាប់ពាន់សម្រាប់សាកល្បង Pagination និងល្បឿន Query។" },
      { title: "Faker Power", desc: "ប្រើ $fake->name() ដើម្បីទទួលបានឈ្មោះពិត ឬ $fake->realText() ដើម្បីទទួលបានអត្ថបទវែងៗ។" },
      { title: "The Seeder", desc: "DatabaseSeeder.php គឺជាមេបញ្ជាការដែលហៅ Seeder ផ្សេងៗទៀតមកធ្វើការងារ។" }
    ],
    lab: {
      title: "Generating 1,000 Posts Instantly",
      titleKh: "ការបង្កើត Post ចំនួន ១០០០ ភ្លាមៗ",
      duration: "60 min",
      objective: "Scaffold a full dataset with complex relations using factories",
      steps: [
        "Create a PostFactory using Artisan: php artisan make:factory PostFactory",
        "Define attributes using the fake() helper for title, content, and dates",
        "Update DatabaseSeeder to create 10 users, each with 50 posts",
        "Run 'php artisan migrate:fresh --seed' to reset and repopulate",
        "Verify the results by counting rows in your database manager"
      ],
      code: `// PostFactory.php
public function definition(): array {
    return [
        'user_id' => User::factory(), // Auto-creates a User!
        'title'   => fake()->sentence(),
        'content' => fake()->paragraphs(3, true),
        'created_at' => fake()->dateTimeBetween('-1 year', 'now'),
    ];
}

// DatabaseSeeder.php
public function run(): void {
    Post::factory(1000)->create();
}`,
      output: `INFO  Seeding database.
  √ PostFactory ........................ 1000 records CREATED
  
Database seeding completed successfully.`
    },
    concepts: [
      { term: "Faker", def: "A PHP library that generates fake data like names, addresses, and phone numbers." },
      { term: "Recycle", def: "A Laravel factory feature to reuse existing models (like Users) instead of creating new ones for every post." },
      { term: "Industrial Data", def: "Large datasets (10k+ rows) used to test application performance and database indexing." },
    ],
    tip: "Run 'php artisan migrate:fresh --seed' daily. It ensures every developer and the automated tests are working with the same fresh data state.",
    project: null,
  },
  {
    id: "m07", num: "07", section: "Section 7", hours: "2h",
    title: "Eloquent ORM",
    titleKh: "Eloquent ORM",
    goal: "Work with database records as PHP objects — CRUD, relationships, and query optimization",
    goalKh: "ប្រើ Database Records ដូច PHP Objects — CRUD, Relationships, Query Optimization",
    color: "#f5c842",
    badge: "ORM",
    topics: [
      {
        en: "Eloquent CRUD",
        kh: "Eloquent CRUD",
        answerEn: "Interacting with the database using PHP objects instead of writing raw SQL.",
        answerKh: "ទាក់ទងជាមួយ Database ដោយប្រើ PHP objects ជំនួសឱ្យការសរសេរ raw SQL។"
      },
      {
        en: "Mass Assignment Security",
        kh: "Mass Assignment Security",
        answerEn: "Using $fillable and $guarded to prevent unauthorized data updates from forms.",
        answerKh: "ប្រើ $fillable និង $guarded ដើម្បីការពារការកែប្រែទិន្នន័យដែលមិនអនុញ្ញាតពី Form។"
      },
      {
        en: "Fluent Relationships",
        kh: "ទំនាក់ទំនង Eloquent",
        answerEn: "Defining how models connect using hasMany, belongsTo, and belongsToMany methods.",
        answerKh: "កំណត់របៀបដែល Model ភ្ជាប់គ្នាដោយប្រើ hasMany, belongsTo, និង belongsToMany។"
      },
      {
        en: "Eager Loading (with)",
        kh: "Eager Loading (with)",
        answerEn: "Optimizing database queries by pre-loading relationships and fixing N+1 issues.",
        answerKh: "បង្កើនល្បឿន Query ដោយផ្ទុកទំនាក់ទំនងទុកជាមុន និងដោះស្រាយបញ្ហា N+1។"
      },
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
    goal: "The three core relationship types and how to manipulate pivot data",
    goalKh: "ស្ទាត់ជំនាញលើទំនាក់ទំនង Database ទាំង ៣ ប្រភេទ និងការប្រើប្រាស់ Pivot Table",
    color: "#f5c842",
    badge: "ORM",
    topics: [
      {
        en: "One-to-One (1:1)",
        kh: "One-to-One (1:1)",
        answerEn: "Linking a single user to a single profile record (hasOne).",
        answerKh: "ភ្ជាប់ User ម្នាក់ទៅនឹង Profile តែមួយ (hasOne)។"
      },
      {
        en: "One-to-Many (1:N)",
        kh: "One-to-Many (1:N)",
        answerEn: "A single category containing multiple products (hasMany).",
        answerKh: "Category មួយអាចមានផលិតផលជាច្រើន (hasMany)។"
      },
      {
        en: "Many-to-Many (M:N)",
        kh: "Many-to-Many (M:N)",
        answerEn: "Products belonging to many tags and vice versa using pivot tables.",
        answerKh: "ផលិតផលដែលភ្ជាប់ទៅនឹង Tag ជាច្រើន និងផ្ទុយមកវិញតាមរយៈ Pivot Table។"
      },
      {
        en: "Pivot Operations",
        kh: "Pivot Operations",
        answerEn: "Using sync(), attach(), and detach() to manage relationships efficiently.",
        answerKh: "ប្រើ sync(), attach() និង detach() ដើម្បីគ្រប់គ្រងទំនាក់ទំនងបានយ៉ាងប្រសើរ។"
      },
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
    title: "Forms & CSRF: The Secure Gate",
    titleKh: "ការប្រើប្រាស់ Form និងការការពារ CSRF",
    goal: "Build secure, professional HTML forms that communicate with the Laravel backend",
    goalKh: "បង្កើត Form ដែលមានសុវត្ថិភាព និងវិជ្ជាជីវៈសម្រាប់ Backend",
    color: "#ff6bb5",
    badge: "SECURITY",
    topics: [
      {
        en: "CSRF Protection (@csrf)",
        kh: "ការការពារ CSRF (@csrf)",
        answerEn: "Using a secret token to ensure form submissions only come from your own website.",
        answerKh: "ប្រើ Token សម្ងាត់ដើម្បីធានាថាការផ្ញើ Form គឺមកពីវេបសាយផ្ទាល់ខ្លួនពិតមែន។"
      },
      {
        en: "Method Spoofing (@method)",
        kh: "ការកំណត់ Method (@method)",
        answerEn: "Allowing browsers (which only support GET/POST) to perform PUT, PATCH, and DELETE requests.",
        answerKh: "អនុញ្ញាតឱ្យ Browser អាចធ្វើការងារលើ Method PUT, PATCH និង DELETE បាន។"
      },
      {
        en: "Blade Form Structure",
        kh: "រចនាសម្ព័ន្ធ Form ក្នុង Blade",
        answerEn: "Organizing inputs with appropriate names, types, and labels for a clean user interface.",
        answerKh: "ការបន្ថែមឈ្មោះ និងប្រភេទ Input ឱ្យបានត្រឹមត្រូវសម្រាប់ UI ដែលស្អាត។"
      },
      {
        en: "Enctype for File Uploads",
        kh: "Enctype សម្រាប់ការ Upload File",
        answerEn: "Setting multipart/form-data when a form needs to send images or documents.",
        answerKh: "ការកំណត់ multipart/form-data នៅពេល Form ត្រូវបញ្ជូនរូបភាព ឬឯកសារផ្សេងៗ។"
      },
    ],
    explanation: [
      { title: "The @csrf Rule", desc: "រាល់ Form ដែលប្រើ Method POST ត្រូវតែមាន @csrf បើមិនដូច្នោះទេ Laravel នឹងផ្ដល់កំហុស '419 Page Expired'។" },
      { title: "PUT & DELETE", desc: "Browser ស្គាល់តែ GET និង POST ប៉ុណ្ណោះ។ ប្រើ @method('DELETE') ដើម្បីប្រាប់ Laravel ថាជាការលុបទិន្នន័យ។" },
      { title: "Input Naming", desc: "ឈ្មោះក្នុង attribute 'name' គឺជាសោរ (key) ដែលយើងនឹងយកទៅប្រើក្នុង Controller $request->input('name')។" }
    ],
    lab: {
      title: "Building the Secure Entry Form",
      titleKh: "ការបង្កើត Form បញ្ចូលទិន្នន័យ",
      duration: "45 min",
      objective: "Set up a complete Blade form with CSRF and method spoofing for a product",
      steps: [
        "Create products/create.blade.php with a POST method",
        "Add the @csrf directive inside the form tag",
        "Create inputs for name, price, and category_id",
        "Create a products/edit.blade.php form and add @method('PUT')",
        "Test submitting the form to verify if the CSRF token is present in the request"
      ],
      code: `{{-- resources/views/products/create.blade.php --}}
<form action="{{ route('products.store') }}" method="POST">
    @csrf
    <input type="text" name="name" placeholder="Name">
    <button type="submit">Save</button>
</form>

{{-- resources/views/products/edit.blade.php --}}
<form action="{{ route('products.update', $post) }}" method="POST">
    @csrf
    @method('PUT')
    <input type="text" name="name" value="{{ $post->name }}">
    <button type="submit">Update</button>
</form>`,
      output: `Inspect Element Result:
<input type="hidden" name="_token" value="abc123xyz...">
<input type="hidden" name="_method" value="PUT">`
    },
    concepts: [
      { term: "CSRF", def: "Cross-Site Request Forgery. A type of attack where a malicious site tricks a user into submitting a form to your backend." },
      { term: "Method Spoofing", def: "The technique of including a hidden _method field to support HTTP verbs not supported by standard HTML forms." },
      { term: "Action Attribute", def: "The URL where the form data will be sent (e.g., {{ route('name') }})." },
    ],
    tip: "If you ever get a '419 Page Expired' error, it's 99% of the time because you forgot to add the @csrf tag in your Blade form.",
    project: null,
  },
  {
    id: "m08b", num: "08B", section: "Section 8 (cont.)", hours: "1.5h",
    title: "Validation & User Feedback",
    titleKh: "ការត្រួតពិនិត្យ និងសារជូនដំណឹង",
    goal: "Server-side validation to ensure clean data and user-friendly error messages",
    goalKh: "ស្ទាត់ជំនាញលើការឆែកទិន្នន័យ និងការបង្ហាញសារកំហុសទៅកាន់ User",
    color: "#ff6bb5",
    badge: "SECURITY",
    topics: [
      {
        en: "The validate() Helper",
        kh: "ការប្រើ help validate()",
        answerEn: "Quickly running validation rules directly inside a controller method.",
        answerKh: "ការកំណត់ច្បាប់ឆែកទិន្នន័យយ៉ាងរហ័សនៅក្នុង Controller Method។"
      },
      {
        en: "Core Validation Rules",
        kh: "ច្បាប់ត្រួតពិនិត្យស្នូល",
        answerEn: "Essential rules like required, unique, min, max, numeric, and email.",
        answerKh: "ច្បាប់ចាំបាច់ដូចជា required (ត្រូវតែមាន), unique (មិនជាន់គ្នា) និង email ជាដើម។"
      },
      {
        en: "The @error Directive",
        kh: "ការប្រើ help @error",
        answerEn: "The cleanest way to show specific error messages next to an input field.",
        answerKh: "វិធីដែលល្អបំផុតសម្រាប់បង្ហាញសារកំហុសនៅក្បែរ Input នីមួយៗ។"
      },
      {
        en: "The old() Helper",
        kh: "ការប្រើ help old()",
        answerEn: "Keeping the user's previously typed data after a validation failure.",
        answerKh: "រក្សាទុកទិន្នន័យដែល User បានវាយរួចហើយ ប្រសិនបើការឆែកឃើញថាខុស។"
      },
    ],
    explanation: [
      { title: "Inline Validation", desc: "ប្រើ $request->validate([...])។ ប្រសិនបើកំហុសកើតឡើង Laravel នឹងបញ្ជូន User ត្រឡប់ទៅ Back វិញដោយស្វ័យប្រវត្តិ។" },
      { title: "Showing Errors", desc: "ប្រើ @error('field_name') ... @enderror ដើម្បីបង្ហាញអត្ថបទពណ៌ក្រហមនៅក្រោមប្រអប់ដែលខុស។" },
      { title: "Input Persistence", desc: "ប្រើ value='{{ old('name') }}' ដើម្បីការពារកុំឱ្យ User ត្រូវវាយអ្វីៗឡើងវិញទាំងអស់ពីដើម។" }
    ],
    lab: {
      title: "Friendly Validation Design",
      titleKh: "ការរចនាប្រព័ន្ធឆែកទិន្នន័យ",
      duration: "45 min",
      objective: "Implement basic inline validation and display localized error feedback",
      steps: [
        "In the Controller, add validation for name (required) and price (numeric)",
        "In Blade, wrap the input in a div that changes color if an error exists",
        "Add an @error block for each input field",
        "Test submitting an empty form to trigger the automatic redirect",
        "Add old() helper to all inputs to ensure data persistence"
      ],
      code: `// Controller logic
public function store(Request $request) {
    $request->validate([
        'name'  => 'required|min:3',
        'price' => 'required|numeric'
    ]);
    // Logic only runs if validation PASSES ✓
}

{{-- Blade markup --}}
<input type="text" name="name" value="{{ old('name') }}">
@error('name')
    <span class="text-red-600">{{ $message }}</span>
@enderror`,
      output: `Submit empty → Redirect back + "The name field is required"
Submit name=Ab → Redirect back + "The name must be at least 3 characters"`
    },
    concepts: [
      { term: "Server-side Validation", def: "Checks done on the server using PHP. Important because client-side (JS/HTML) checks can be bypassed by hackers." },
      { term: "Validation Session", def: "The temporary storage Laravel uses to send error messages back to the previous page." },
      { term: "Message bag", def: "The object ($errors) that holds all validation errors returned to the view." },
    ],
    tip: "Always use server-side validation. Your users will thank you for the feedback, and your database will thank you for the clean data.",
    project: null,
  },
  {
    id: "m08c", num: "08C", section: "Section 8 (cont.)", hours: "1.5h",
    title: "Form Requests & Reusable Logic",
    titleKh: "ការប្រើប្រាស់ Form Request Classes",
    goal: "Refactor your validation into professional, dedicated objects for cleaner code",
    goalKh: "រៀបចំកូដ Validation ឡើងវិញឱ្យមានសណ្ដាប់ធ្នាប់ និងវិជ្ជាជីវៈ",
    color: "#ff6bb5",
    badge: "SECURITY",
    topics: [
      {
        en: "Form Request Objects",
        kh: "Form Request Objects",
        answerEn: "Moving validation out of the controller and into a dedicated class (make:request).",
        answerKh: "ការបញ្ជូនកូដ Validation ឱ្យនៅក្រៅ Controller ដើម្បីឱ្យកូដខ្លី និងងាយមើល។"
      },
      {
        en: "Authorization Rules",
        kh: "ច្បាប់នៃសិទ្ធិអនុញ្ញាត",
        answerEn: "Using the authorize() method to check if a user is allowed to perform a request.",
        answerKh: "ប្រើ method authorize() ដើម្បីឆែកមើលថា User នោះមានសិទ្ធិផ្ញើ Request នេះឬអត់។"
      },
      {
        en: "Custom Error Messages",
        kh: "សារកំហុសកំណត់ដោយខ្លួនឯង",
        answerEn: "Overriding default messages to provide friendlier text or Khmer translations.",
        answerKh: "ការប្តូរសារកំហុសលំនាំដើមរបស់ Laravel មកជាអ្វីដែលយើងចង់បាន ឬជាភាសាខ្មែរ។"
      },
      {
        en: "Validated() Data",
        kh: "ទាញយកទិន្នន័យដែលឆែករួច",
        answerEn: "Using $request->validated() to retrieve only the data that passed your rules.",
        answerKh: "ប្រើ $request->validated() ដើម្បីយកតែទិន្នន័យណាដែលបានឆែករួចថាត្រឹមត្រូវ។"
      },
    ],
    explanation: [
      { title: "Request Creation", desc: "ប្រើ php artisan make:request StoreProductRequest ដើម្បីបង្កើត File ថ្មីនៅក្នុង app/Http/Requests/។" },
      { title: "Rules Method", desc: "សរសេរច្បាប់របស់អ្នកក្នុង method rules()។ ការងារនេះនឹងដំណើរការ 'មុន' នឹងចូលដល់ Controller។" },
      { title: "Clean Controller", desc: "Controller របស់អ្នកនឹងមិនចាំបាច់មាន IF ឬ Validation កូដវែងៗទៀតទេ $request នឹងផ្ដល់កូដដែល Ready រួចស្រេច។" }
    ],
    lab: {
      title: "Professional Requests",
      titleKh: "ការប្រើប្រាស់ Form Request កម្រិតខ្ពស់",
      duration: "45 min",
      objective: "Clean up a messy controller by delegating validation to a Form Request class",
      steps: [
        "Create StoreProductRequest using Artisan",
        "Define rules for name, price, category, and image",
        "Customize the 'unique' error message in the messages() method",
        "Type-hint the new Request class in your Controller",
        "Use $request->validated() to fill your model instead of $request->all()"
      ],
      code: `// 1. In app/Http/Requests/StoreProductRequest.php
public function rules(): array {
    return [
        'name' => 'required|unique:products,name',
        'price' => 'required|numeric|min:0'
    ];
}

// 2. In ProductController.php
public function store(StoreProductRequest $request) {
    Product::create($request->validated());
    return redirect()->back();
}`,
      output: `Controller code reduced from 15 lines to 2 lines! ✓
Validation logic is now reusable and isolated. ✓`
    },
    concepts: [
      { term: "Type-hinting", def: "Telling Laravel exactly which class you expect for the $request variable." },
      { term: "Validated Data", def: "An array containing ONLY the fields defined in your rules. Safer than using all()." },
      { term: "authorize()", def: "A boolean method that returns true or false. If false, Laravel returns a '403 Forbidden' response." },
    ],
    tip: "In large projects, always use Form Requests. They make your controllers 'Skinny' and your validation rules much easier to test and maintain.",
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
      {
        en: "Migration Blueprint",
        kh: "Migration Blueprint",
        answerEn: "Defining table schemas including names, prices, and image path columns.",
        answerKh: "កំណត់គ្រោងរបស់ Table រួមមានឈ្មោះ តម្លៃ និង Column សម្រាប់ផ្លូវរូបភាព។"
      },
      {
        en: "Foreign Keys Setup",
        kh: "ការរៀបចំ Foreign Keys",
        answerEn: "Linking products to categories with data integrity constraints.",
        answerKh: "ភ្ជាប់ផលិតផលទៅនឹង Category ជាមួយចំណងទិន្នន័យត្រឹមត្រូវ។"
      },
      {
        en: "Model Security",
        kh: "សុវត្ថិភាព Model",
        answerEn: "Implementing $fillable to whitelist mass-assignable attributes.",
        answerKh: "ប្រើប្រាស់ $fillable ដើម្បីកំណត់ Attribute ណាដែលអនុញ្ញាតឱ្យបញ្ចូលក្នុងពេលតែមួយ។"
      },
      {
        en: "Eloquent Casting",
        kh: "Eloquent Casting",
        answerEn: "Automatically converting database values to decimals or booleans.",
        answerKh: "បំប្លែងព័ត៌មានពី Database ទៅជា Decimal ឬ Boolean ដោយស្វ័យប្រវត្តិ។"
      },
      {
        en: "Relationship Linkage",
        kh: "ការភ្ជាប់ទំនាក់ទំនង",
        answerEn: "Establishing the BelongsTo category connection in the Product model.",
        answerKh: "បង្កើតការភ្ជាប់ BelongsTo Category នៅក្នុង Product model។"
      },
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
      {
        en: "Search Query Logic",
        kh: "Logic នៃ Query ស្វែងរក",
        answerEn: "Using when() to apply search filters only if a term is provided.",
        answerKh: "ប្រើ when() ដើម្បីឆែកស្វែងរក លុះត្រាតែមានពាក្យគន្លឹះដែលបានផ្ដល់ឱ្យ។"
      },
      {
        en: "Logic-based Pagination",
        kh: "ការបែងចែកទំព័រ",
        answerEn: "Breaking large datasets into manageable pages with links().",
        answerKh: "បែងចែកទិន្នន័យធំៗឱ្យទៅជាទំព័រងាយស្រួលគ្រប់គ្រងជាមួយ links()។"
      },
      {
        en: "N+1 Prevention",
        kh: "ការការពារ N+1",
        answerEn: "Pre-fetching category data in one query to boost performance.",
        answerKh: "ទាញយកទិន្នន័យ Category ទុកជាមុន ក្នុង Query តែមួយដើម្បីបង្កើនល្បឿន។"
      },
      {
        en: "@forelse Pattern",
        kh: "លំនាំ @forelse",
        answerEn: "Cleaner Blade code to handle both list display and empty search results.",
        answerKh: "កូដ Blade ដែលស្អាតជាងមុនសម្រាប់បង្ហាញបញ្ជី និងលទ្ធផលស្វែងរកដែលទទេ។"
      },
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
      {
        en: "Form Request Validation",
        kh: "Validation តាម Form Request",
        answerEn: "Keeping controllers lean by defining rules in a separate class.",
        answerKh: "ធ្វើឱ្យ Controller ខ្លីនិងស្អាត ដោយកំណត់ច្បាប់ក្នុង Class ផ្សេង។"
      },
      {
        en: "File & Storage handling",
        kh: "ការគ្រប់គ្រង File & Storage",
        answerEn: "Storing uploaded images safely onto the public storage disk.",
        answerKh: "រក្សាទុករូបភាពដែលបានបង្ហោះដោយសុវត្ថិភាព ទៅក្នុង Public Storage Disk។"
      },
      {
        en: "CSRF Security",
        kh: "សុវត្ថិភាព CSRF",
        answerEn: "Ensuring all POST requests carry a valid authentication token.",
        answerKh: "ធានាថាគ្រប់ POST requests ទាំងអស់មាន authentication token ត្រឹមត្រូវ។"
      },
      {
        en: "Input Preservation",
        kh: "ការរក្សាទុករាល់ input",
        answerEn: "Returning user values using old() after a validation failure.",
        answerKh: "បញ្ជូនតម្លៃដែលអ្នកប្រើវាយត្រឡប់មកវិញដោយ old() បន្ទាប់ពី Validation មិនជាប់។"
      },
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
      {
        en: "Method Spoofing (@method)",
        kh: "Method Spoofing (@method)",
        answerEn: "Using @method('PUT') to bypass HTML form limitations and send update requests.",
        answerKh: "ប្រើ @method('PUT') ដើម្បីដោះស្រាយបញ្ហា HTML Form និងបញ្ជូន Update Request។"
      },
      {
        en: "Route Model Binding",
        kh: "Route Model Binding",
        answerEn: "Automatically fetching a model instance from the database using the URL ID.",
        answerKh: "ទាញយក Model Instance ពី Database ស្វ័យប្រវត្តិដោយប្រើ ID របស់ URL។"
      },
      {
        en: "Image Replacement Logic",
        kh: "Logic នៃការពា្លស់ប្តូររូបភាព",
        answerEn: "Deleting the old image file from storage when a new one is uploaded during update.",
        answerKh: "លុប File រូបភាពចាស់ចេញពី Storage នៅពេលរូបភាពថ្មីត្រូវបានបង្ហោះ។"
      },
      {
        en: "Unique Rule Isolation",
        kh: "ការប្រើ Unique Rule ពេល Update",
        answerEn: "Configuring the unique validation rule to ignore the current record's ID.",
        answerKh: "កំណត់ច្បាប់ Unique Validation ដើម្បីកុំឱ្យវាឆែកជាន់ជាមួយ ID ខ្លួនឯង។"
      },
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
      {
        en: "Delete Spoofing",
        kh: "ការប្រើ @method('DELETE')",
        answerEn: "Using @method('DELETE') in a POST form to trigger the controller's destroy method.",
        answerKh: "ប្រើ @method('DELETE') ក្នុង POST form ដើម្បីហៅប្រើប្រាស់ method destroy។"
      },
      {
        en: "Flash Messages",
        kh: "Flash Messages",
        answerEn: "Storing short-term feedback in the session to show success or error alerts.",
        answerKh: "រក្សាទុក Feedback រយៈពេលខ្លីក្នុង Session ដើម្បីបង្ហាញដំណឹងជោគជ័យ ឬកំហុស។"
      },
      {
        en: "Confirmation UI Flow",
        kh: "លំហូរនៃ Confirmation UI",
        answerEn: "Implementing JavaScript confirmation dialogs to prevent accidental data deletion.",
        answerKh: "ប្រើប្រាស់ JavaScript confirmation ដើម្បីការពារការលុបទិន្នន័យដោយអចេតនា។"
      },
      {
        en: "Resource Summary",
        kh: "សង្ខេប Resource",
        answerEn: "Reviewing how Route::resource() automates the entire CRUD routing process.",
        answerKh: "រំលឹកឡើងវិញពីរបៀបដែល Route::resource() បង្កើត Route សម្រាប់ CRUD ទាំងអស់។"
      },
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
      {
        en: "Laravel Breeze Overview",
        kh: "ទិដ្ឋភាពទូទៅនៃ Laravel Breeze",
        answerEn: "A minimal, clean starter kit for implementing authentication in Laravel apps.",
        answerKh: "កញ្ចប់ឧបករណ៍ដំបូងដ៏សាមញ្ញសម្រាប់ដំឡើងប្រព័ន្ធ Auth ក្នុង Laravel។"
      },
      {
        en: "Installation Workflow",
        kh: "លំហូរនៃការដំឡើង",
        answerEn: "Steps to install Breeze via Composer and scaffold auth views and controllers.",
        answerKh: "ជំហានក្នុងការដំឡើង Breeze តាម Composer និងបង្កើត Views/Controllers សម្រាប់ Auth។"
      },
      {
        en: "Built-in Auth Routes",
        kh: "Routes របស់ Auth ដែលមានស្រាប់",
        answerEn: "Pre-defined routes for login, register, password reset, and logout.",
        answerKh: "Route ដែលមានស្រាប់សម្រាប់ Login, Register, Reset Password និង Logout។"
      },
      {
        en: "Database User Schema",
        kh: "Schema របស់ Table Users",
        answerEn: "Default user migration handles names, emails, and hashed passwords securely.",
        answerKh: "Migration របស់ User លំនាំដើមដែលគ្រប់គ្រងឈ្មោះ Email និង Password ដោយសុវត្ថិភាព។"
      },
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
      {
        en: "The 'auth' Middleware",
        kh: "Middleware 'auth'",
        answerEn: "Restricting page access to only those users who are currently logged in.",
        answerKh: "កំណត់ការចូលប្រើប្រាស់ទំព័របាន សម្រាប់តែអ្នកដែលបាន Login រួចប៉ុណ្ណោះ។"
      },
      {
        en: "Grouping Protected Routes",
        kh: "ការបែងចែកក្រុម Protected Routes",
        answerEn: "Applying security layers to multiple routes at once using route groups.",
        answerKh: "ដាក់កម្រិតសុវត្ថិភាពលើ Route ជាច្រើនក្នុងពេលតែមួយដោយប្រើ Route Group។"
      },
      {
        en: "The 'guest' Middleware",
        kh: "Middleware 'guest'",
        answerEn: "Redirecting authenticated users away from login and registration pages.",
        answerKh: "បង្វែរទិសដៅអ្នកដែល Login រួចហើយ មិនឱ្យចូលទៅកាន់ទំព័រ Login ឬ Register ទៀត។"
      },
      {
        en: "Customizing Redirects",
        kh: "ការកំណត់ផ្លូវ Redirect",
        answerEn: "Changing where users land after a successful login (e.g., from /home to /dashboard).",
        answerKh: "ប្តូរគោលដៅដែលអ្នកប្រើនឹងទៅដល់បន្ទាប់ពី Login (ដូចជាពី /home ទៅ /dashboard)។"
      },
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
      {
        en: "@auth & @guest Directives",
        kh: "Directives @auth និង @guest",
        answerEn: "Blade shortcuts to conditionally show content based on login status.",
        answerKh: "កូដ Blade សម្រាប់បង្ហាញ Content ផ្អែកលើស្ថានភាព Login របស់អ្នកប្រើ។"
      },
      {
        en: "Accessing Auth User",
        kh: "ការហៅប្រើប្រាស់ Auth User",
        answerEn: "Using the Auth facade to retrieve information about the current user instance.",
        answerKh: "ប្រើប្រាស់ Auth facade ដើម្បីទាញយកព័ត៌មានរបស់អ្នកប្រើប្រាស់បច្ចុប្បន្ន។"
      },
      {
        en: "User State Display",
        kh: "ការបង្ហាញស្ថានភាព User",
        answerEn: "Rendering personalized content like the user’s name, email, and role in views.",
        answerKh: "បង្ហាញព័ត៌មានផ្ទាល់ខ្លួនដូចជា ឈ្មោះ, Email និង Role នៅក្នុង Views។"
      },
      {
        en: "Secure Logout Flow",
        kh: "លំហូរនៃការ Logout ដោយសុវត្ថិភាព",
        answerEn: "Implementing logouts using POST requests to protect against session attacks.",
        answerKh: "អនុវត្តការ Logout ដោយប្រើ POST request ដើម្បីការពារពីការវាយប្រហារ Session។"
      },
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
    title: "Authorization & Gates",
    titleKh: "ការផ្ដល់សិទ្ធិ និង Gates",
    goal: "Handle global permissions and the core difference between identity and capability",
    goalKh: "គ្រប់គ្រងសិទ្ធិប្រើប្រាស់ និងការបែងចែករវាងអត្តសញ្ញាណ និងសមត្ថភាព",
    color: "#52e3a0",
    badge: "SECURITY",
    topics: [
      {
        en: "Auth vs Authorization",
        kh: "Auth និង Authorization",
        answerEn: "Confirming WHO a user is (Auth) vs determining WHAT they can do (Authorization).",
        answerKh: "ការបញ្ជាក់ថា អ្នកណាជាអ្នកប្រើ (Auth) និងអ្វីដែលពួកគេអាចធ្វើបាន (Authorization)។"
      },
      {
        en: "Defining Gates",
        kh: "ការកំណត់ Gates",
        answerEn: "Creating simple closures in AppServiceProvider for global, non-model permissions.",
        answerKh: "បង្កើតការឆែកសិទ្ធិសាមញ្ញក្នុង AppServiceProvider សម្រាប់បម្រជាទម្រង់រួម។"
      },
      {
        en: "Gate::allows() & Gate::denies()",
        kh: "ការឆែក Gate",
        answerEn: "Using the Gate facade to manually check permissions anywhere in your code.",
        answerKh: "ប្រើប្រាស់ Gate Facade ដើម្បីឆែកមើលសិទ្ធិនៅគ្រប់កន្លែងក្នុងកូដ PHP។"
      },
      {
        en: "Role-Based Logic",
        kh: "ការឆែកសិទ្ធិតាម Role",
        answerEn: "Checking user attributes like 'isAdmin' to control access to whole features.",
        answerKh: "ការឆែក Attributes របស់ User ដូចជា Role ដើម្បីបើក ឬបិទមុខងារខ្លះៗ។"
      },
    ],
    explanation: [
      { title: "Identity vs Permission", desc: "កុំច្រឡំរវាងការ Login (Auth) និងការអនុញ្ញាត (Authorization)។ User គ្រប់គ្នាអាច Login បាន តែមិនមែនគ្រប់គ្នាមានសិទ្ធិលុបទិន្នន័យឡើយ។" },
      { title: "The Gate Concept", desc: "Gate គឺដូចជា 'កន្លែងត្រួតពិនិត្យ'។ យើងសរសេរ Logic មួយដង រួចហៅប្រើគ្រប់កន្លែង (Blade, Controller, Middleware)។" },
      { title: "Universal Check", desc: "Gate ងាយស្រួលសម្រាប់មុខងារសកលដែលមិនសំដៅលើ Model ជាក់លាក់ ដូចជា 'ចូលទៅកាន់ Admin Panel'។" }
    ],
    lab: {
      title: "Creating the Admin Gate",
      titleKh: "ការបង្កើត Admin Gate",
      duration: "45 min",
      objective: "Define and test a global gate that only allows admins to see a secret area",
      steps: [
        "Open AppServiceProvider.php and import the Gate facade",
        "Define a gate called 'access-admin' that returns true only if the user role is 'admin'",
        "In a Controller, check the gate using Gate::authorize('access-admin')",
        "In Blade, use the @can('access-admin') tag to wrap a secret link",
        "Test with a normal user to verify the gate blocks access with a 403 error"
      ],
      code: `// app/Providers/AppServiceProvider.php
use Illuminate\\Support\\Facades\\Gate;

public function boot(): void {
    Gate::define('access-admin', function ($user) {
        return $user->role === 'admin';
    });
}

// Controller logic
public function dashboard() {
    Gate::authorize('access-admin');
    return view('admin.dashboard');
}`,
      output: `Admin User Dashboard → ✓ 200 OK
Regular User Dashboard → ✗ 403 Forbidden`
    },
    concepts: [
      { term: "Gate", def: "A simple closure-based authorization check. Best for non-model specific actions (like accessing an admin area)." },
      { term: "Facade", def: "A technical shortcut to call deep Laravel functions easily (e.g., Gate::allows())." },
      { term: "Abort 403", def: "The standard HTTP response meaning 'Forbidden'. Use it when a user is logged in but has no permission for an action." },
    ],
    tip: "Remember: Authentication (Auth) is always checked BEFORE Authorization. You can't ask 'What can John do?' until you're sure it's really John.",
    project: null,
  },
  {
    id: "m11b", num: "11B", section: "Section 11 (cont.)", hours: "1.5h",
    title: "Policies & Model Security",
    titleKh: "ការប្រើប្រាស់ Policies លើ Model",
    goal: "Organize complex authorization logic into dedicated, model-linked Policy classes",
    goalKh: "រៀបចំ Logic នៃ Authorization ឱ្យមានរបៀបតាមរយៈ Policy Classes",
    color: "#52e3a0",
    badge: "SECURITY",
    topics: [
      {
        en: "Policy Scaffolding",
        kh: "ការបង្កើត Policies",
        answerEn: "Using php artisan make:policy to create a dedicated class for a specific model.",
        answerKh: "ការប្រើ command make:policy ដើម្បីបង្កើត Class សម្រាប់ការពារ Model នីមួយៗ។"
      },
      {
        en: "The Owner Rule",
        kh: "ច្បាប់នៃភាពជាម្ចាស់ (Owner)",
        answerEn: "Logic that ensures only the user who created a record can edit or delete it.",
        answerKh: "Logic ដែលធានាថាមានតែម្ចាស់ទិន្នន័យប៉ុណ្ណោះ ទើបអាចកែ ឬលុបវាបាន។"
      },
      {
        en: "CRUD Mapping",
        kh: "ការផ្គូផ្គងជាមួយ CRUD",
        answerEn: "Defining specific methods like view, create, update, and delete in the Policy.",
        answerKh: "ការកំណត់ Method ជាក់លាក់ដូចជា View, Create, Update និង Delete ក្នុង Policy។"
      },
      {
        en: "Policy Bypass (Admins)",
        kh: "សិទ្ធិលើសពីគេ (Admin)",
        answerEn: "Writing logic so Admins can perform actions regardless of who owns the data.",
        answerKh: "ការសរសេរកូដឱ្យ Admin អាចធ្វើអ្វីៗបានគ្រប់យ៉ាង ទោះបីមិនមែនជាម្ចាស់ទិន្នន័យ។"
      },
    ],
    explanation: [
      { title: "Why Policies?", desc: "នៅពេលកម្មវិធីធំឡើង Gate នឹងធ្វើឱ្យ AppServiceProvider ញ៉េរញ៉ៃ។ Policy បំបែក Logic ទៅតាម Model (ឧទាហរណ៍: PostPolicy សម្រាប់ Post)។" },
      { title: "The mapping", desc: "Laravel ស្គាល់ដោយស្វ័យប្រវត្តិកាលណាឈ្មោះស្រដៀងគ្នា (Post → PostPolicy)។" },
      { title: "Automatic User", desc: "រាល់ Method ក្នុង Policy នឹងទទួលបាន $user (User ដែលកំពុង Login) ជា Parameter ទី១ ដោយស្វ័យប្រវត្តិ។" }
    ],
    lab: {
      title: "Content Ownership Control",
      titleKh: "ការគ្រប់គ្រងភាពជាម្ចាស់",
      duration: "45 min",
      objective: "Create a policy for Posts to ensure users don't edit each other's content",
      steps: [
        "Generate a Policy: php artisan make:policy PostPolicy --model=Post",
        "Implement the update() method: return $user->id === $post->user_id",
        "Enhance the policy: Allow 'admin' roles to update ANY post",
        "Map the policy in AuthServiceProvider (if using older Laravel) or let Auto-discovery work",
        "Test by logging in as two different users and trying to edit the same post"
      ],
      code: `// app/Policies/PostPolicy.php
public function update(User $user, Post $post): bool {
    // Only owner OR admin can update
    return $user->id === $post->user_id 
        || $user->role === 'admin';
}

public function delete(User $user, Post $post): bool {
    return $user->id === $post->user_id;
}`,
      output: `User ID 1 tries to edit Post (user_id 1) → ✓ Allowed
User ID 2 tries to edit Post (user_id 1) → ✗ Denied
Admin User tries to edit Post (user_id 1) → ✓ Allowed`
    },
    concepts: [
      { term: "Policy Class", def: "A class that organizes authorization logic for a particular model or resource." },
      { term: "Authorization Logic", def: "The PHP conditions that return either true (allowed) or false (denied)." },
      { term: "Auto-discovery", def: "A Laravel feature that automatically links Models to Policies if they follow naming standards." },
    ],
    tip: "Use --model when creating a policy (e.g. make:policy PostPolicy --model=Post). It scaffolds all 7 standard CRUD methods for you instantly.",
    project: null,
  },
  {
    id: "m11c", num: "11C", section: "Section 11 (cont.)", hours: "1.5h",
    title: "Blade Guards & Middleware",
    titleKh: "ការប្រើប្រាស់ក្នុង Blade និង Middleware",
    goal: "Integrate authorization into your UI and route layers for a seamless experience",
    goalKh: "បញ្ចូលសិទ្ធិប្រើប្រាស់ទៅក្នុង Interface និង Route ដើម្បីសុវត្ថិភាពសរុប",
    color: "#52e3a0",
    badge: "SECURITY",
    topics: [
      {
        en: "Blade Directives (@can)",
        kh: "ការប្រើ @can ក្នុង Blade",
        answerEn: "Hiding buttons and features from users who don't have the required permissions.",
        answerKh: "ការលាក់ប៊ូតុង ឬមុខងារផ្សេងៗពី User ដែលគ្មានសិទ្ធិប្រើប្រាស់។"
      },
      {
        en: "Middleware Checks",
        kh: "ការឆែកតាម Middleware",
        answerEn: "Protecting entire routes or route groups based on Policy rules (can:update,post).",
        answerKh: "ការពារ Route ទាំងមូលដោយយោងតាមច្បាប់ក្នុង Policy (can:update,post)។"
      },
      {
        en: "The authorize() Helper",
        kh: "ការប្រើ authorize() helper",
        answerEn: "Checking permissions inside Controller methods and throwing 403 status codes.",
        answerKh: "ឆែកមើលសិទ្ធិក្នុង Controller និងបញ្ជូន 403 Error ប្រសិនបើគ្មានសិទ្ធិ។"
      },
      {
        en: "Policy-Based Query Scoping",
        kh: "ការឆែកសិទ្ធិលើ Query",
        answerEn: "Filtering database results so users only see what they are allowed to see.",
        answerKh: "ចម្រាញ់ទិន្នន័យពី Database ឱ្យ User ឃើញតែអ្វីដែលពួកគេសិទ្ធិមើលប៉ុណ្ណោះ។"
      },
    ],
    explanation: [
      { title: "UI vs Security", desc: "ការប្រើ @can ក្នុង Blade គឺសម្រាប់ UX (កុំឱ្យ User ឃើញប៊ូតុងដែលចុចមិនកើត)។ ឯ Controller Check គឺសម្រាប់ Security។ ត្រូវធ្វើទាំងពីរ!" },
      { title: "Middleware Shortcut", desc: "ជំនួសឱ្យការសរសេរ Checks ក្នុងគ្រប់ Method យើងអាចដាក់ Middleware ក្នុង Route តែម្តង។" },
      { title: "Error Handling", desc: "Laravel នឹងបង្ហាញទំព័រ 403 ដោយស្វ័យប្រវត្តិ។ យើងអាចកែទម្រង់ទំព័រនេះឱ្យស្អាតបាន។" }
    ],
    lab: {
      title: "Dynamic UI & Route Protection",
      titleKh: "ការការពារ UI និង Route",
      duration: "45 min",
      objective: "Apply security guards across Blade, Middleware, and Controllers",
      steps: [
        "In index.blade.php, use @can('update', $post) to only show the edit button to owners",
        "Use @cannot('delete', $post) to disable the delete button for guests",
        "Add a middleware check to the update route: ->middleware('can:update,post')",
        "In the Controller show() method, use $this->authorize('view', $post)",
        "Try to access a blocked URL directly and observe the 403 response"
      ],
      code: `// routes/web.php
Route::put('/post/{post}', [PostController::class, 'update'])
    ->middleware('can:update,post');

// resources/views/posts/index.blade.php
@can('update', $post)
    <a href="{{ route('post.edit', $post) }}">Edit</a>
@endcan

// Controller method
public function show(Post $post) {
    $this->authorize('view', $post);
    return view('post.show', compact('post'));
}`,
      output: `Button stays HIDDEN for non-owners. ✓
Direct URL access returns 403 Forbidden. ✓
Controller provides the final layer of defense. ✓`
    },
    concepts: [
      { term: "@can / @cannot", def: "Blade tools that verify authorization logic before rendering HTML." },
      { term: "Middleware Gate", def: "A way to check permissions before the request even reaches the controller." },
      { term: "403 Forbidden", def: "The standard HTTP status indicating the user is logged in but doesn't have the required permissions." },
    ],
    tip: "Never rely on hiding UI as your only security. Skilled users can still send requests to your endpoints. Always verify permissions on the server too.",
    project: null,
  },
  {
    id: "m12", num: "12", section: "Section 12", hours: "1.5h",
    title: "REST API: Architecture & Routing",
    titleKh: "ស្ថាបត្យកម្ម REST API និង Routing",
    goal: "Understand the stateless principles of REST and set up the foundation for a modern API",
    goalKh: "យល់ដឹងពីគោលការណ៍ Stateless នៃ REST និងការរៀបចំគ្រឹះសម្រាប់ API ទំនើប",
    color: "#4d9fff",
    badge: "API",
    topics: [
      {
        en: "REST Principles & Statelessness",
        kh: "គោលការណ៍ REST និង Statelessness",
        answerEn: "Communication where each request contains all data needed to understand it, without a session.",
        answerKh: "ការទាក់ទងដែលរាល់ Request នីមួយៗផ្ទុកនូវរាល់ព័ត៌មានដែលចាំបាច់ទាំងអស់ (គ្មាន Session)។"
      },
      {
        en: "API Routing (routes/api.php)",
        kh: "API Routing (routes/api.php)",
        answerEn: "Using a dedicated route file for JSON communication, usually prefixed with /api.",
        answerKh: "ប្រើប្រាស់ File Route ជាក់លាក់សម្រាប់ JSON communication (ជាទូទៅមាន prefix /api)។"
      },
      {
        en: "The apiResource() Shortcut",
        kh: "ការប្រើ apiResource()",
        answerEn: "A route helper that excludes create/edit methods since APIs don't need HTML forms.",
        answerKh: "Shortcut សម្រាប់បង្កើត Route 5 (GET, POST, PUT, DELETE) សម្រាប់ API ដោយមិនយក create/edit។"
      },
      {
        en: "Testing with Postman",
        kh: "ការតេស្តជាមួយ Postman",
        answerEn: "Using tools like Postman or Insomnia to simulate frontend requests and check JSON responses.",
        answerKh: "ការប្រើប្រាស់កម្មវិធី Postman ដើម្បីសាកល្បងហៅ API និងឆែកមើលលទ្ធផល JSON។"
      },
    ],
    explanation: [
      { title: "HTML vs JSON", desc: "កាលពីមេរៀនមុនៗ Laravel ផ្ដល់មកវិញជា HTML (Blade)។ តែក្នុង API យើងផ្ដល់ជា JSON data សម្រាប់កម្មវិធីទូរស័ព្ទ ឬ React frontend។" },
      { title: "Install API", desc: "ប្រើ php artisan install:api ដើម្បីដំឡើង Laravel Sanctum និងបង្កើត File routes/api.php ឱ្យបានត្រឹមត្រូវ។" },
      { title: "Stateless Auth", desc: "នៅក្នុង API, Laravel មិនចាំ Users តាមរយៈ Cookies/Sessions ឡើយ។ រាល់ការហៅត្រូវមាន Token សម្ងាត់ភ្ជាប់មកជាមួយ។" }
    ],
    lab: {
      title: "Building Your First API Route",
      titleKh: "ការបង្កើត API Route ដំបូង",
      duration: "45 min",
      objective: "Set up the API infrastructure and create a simple JSON return route",
      steps: [
        "Run 'php artisan install:api' to initialize the API environment",
        "Define an endpoint GET /api/v1/status in routes/api.php",
        "Return a hardcoded JSON array with ['status' => 'online']",
        "Install and open Postman, then send a GET request to your URL",
        "Verify the 'Content-Type: application/json' header in the response"
      ],
      code: `// routes/api.php
Route::get('/v1/status', function() {
    return response()->json([
        'status' => 'online',
        'version' => '1.0.0'
    ]);
});

// Testing with curl
curl -X GET http://localhost/api/v1/status`,
      output: `HTTP status: 200 OK
Body: { "status": "online", "version": "1.0.0" }
Header: Content-Type: application/json ✓`
    },
    concepts: [
      { term: "JSON", def: "JavaScript Object Notation. The universal language for data exchange on the web today." },
      { term: "Statelessness", def: "The server does not store any state about the client session on its side." },
      { term: "Endpoint", def: "A specific URL that an API can receive requests on (e.g., /api/v1/users)." },
    ],
    tip: "Always prefix your routes with a version like /v1/ or /v2/. This allows you to upgrade your app later without breaking existing mobile apps.",
    project: null,
  },
  {
    id: "m12b", num: "12B", section: "Section 12 (cont.)", hours: "1.5h",
    title: "API Resources & Transformation",
    titleKh: "ការបំប្លែងទិន្នន័យ API Resources",
    goal: "The data transformation to hide database secrets and shape professional JSON outputs",
    goalKh: "ស្ទាត់ជំនាញលើការរៀបចំទិន្នន័យ និងការលាក់បាំងរចនាសម្ព័ន្ធ Database",
    color: "#4d9fff",
    badge: "API",
    topics: [
      {
        en: "Eloquent Resources",
        kh: "ការប្រើ Eloquent Resources",
        answerEn: "Using php artisan make:resource to create transition layers between Models and JSON.",
        answerKh: "ការប្រើ Layer កណ្ដាលដើម្បីកំណត់ថាតើ Column ណាខ្លះដែលគួរឱ្យ User ឃើញ។"
      },
      {
        en: "Data Masking",
        kh: "ការលាក់បាំងទិន្នន័យ",
        answerEn: "Hiding internal database names or sensitive fields (like created_at) from the public API.",
        answerKh: "ការប្ដូរឈ្មោះ Key ឬលាក់ព័ត៌មានសម្ងាត់មួយចំនួនពីមុខងារ API។"
      },
      {
        en: "Nested Relationships",
        kh: "ការបង្ហាញ Relationship ក្នុង JSON",
        answerEn: "Efficiently including related data (like a post's category) inside the JSON response.",
        answerKh: "បង្ហាញទិន្នន័យដែលពាក់ព័ន្ធ (ដូចជា Category របស់ Post) ក្នុង JSON តែម្តង។"
      },
      {
        en: "Formatting Values",
        kh: "ការកំណត់ទ្រង់ទ្រាយតម្លៃ",
        answerEn: "Converting raw database dates or decimals into consistent, readable formats.",
        answerKh: "បំប្លែងទិន្នន័យពី Database (ដូចជា តម្លៃ ឬ ថ្ងៃខែ) ឱ្យទៅជា Format ដែលស្អាត។"
      },
    ],
    explanation: [
      { title: "Transformation Layer", desc: "កុំបញ្ជូន Model ចេញទៅក្រៅផ្ទាល់ៗ (return $user)។ ប្រើ Resource ដើម្បីលាក់ password_hash និងប្តូរ id ទៅជា user_id ជាដើម។" },
      { title: "Resource Collections", desc: "ប្រើ Resource::collection($data) សម្រាប់ការងារដែលមានទិន្នន័យច្រើន (Array) ដើម្បីរក្សាស្តង់ដារតែមួយ។" },
      { title: "Computing Data", desc: "អ្នកអាចបន្ថែម Key ថ្មីដែលគ្មានក្នុង Database បាន ឧទាហរណ៍ 'is_expensive' => $this->price > 1000។" }
    ],
    lab: {
      title: "Building a Professional JSON Schema",
      titleKh: "ការរចនា JSON Schema កម្រិតខ្ពស់",
      duration: "45 min",
      objective: "Transform a raw Product model into a beautiful, clean API response",
      steps: [
        "Create a resource: php artisan make:resource ProductResource",
        "Define the keys you want: id, name, price_usd, and category_name",
        "In the Controller, return the resource: return new ProductResource($product)",
        "Test with Postman and confirm no extra database fields are visible",
        "Use mapping to rename 'image_path' to 'picture_url'"
      ],
      code: `// app/Http/Resources/ProductResource.php
public function toArray(Request $request): array {
    return [
        'product_id' => $this->id,
        'title'      => $this->name,
        'price'      => (float) $this->price,
        'category'   => $this->category->name,
        'created'    => $this->created_at->format('Y-m-d')
    ];
}`,
      output: `Response Structure:
{
  "data": {
    "product_id": 101,
    "title": "MacBook Air",
    "price": 999.00
  }
} ✓ (Internal DB fields hidden)`
    },
    concepts: [
      { term: "JsonResource", def: "A class that receives a model and defines how it should be converted to an array of data." },
      { term: "Data Leak", def: "An error where sensitive system data (like server paths or internal IDs) is exposed to the public." },
      { term: "Pagination Metadata", def: "Extra JSON info like 'total' and 'next_page' that comes automatically when using Resources with pagination." },
    ],
    tip: "Never return models directly in an API. Resources act as a shield, protecting your database structure from changing the public API unexpectedly.",
    project: null,
  },
  {
    id: "m12c", num: "12C", section: "Section 12 (cont.)", hours: "1.5h",
    title: "CRUD API & Logic Handling",
    titleKh: "ការបង្កើត CRUD API និងការគ្រប់គ្រង Error",
    goal: "Implement a full standard API with proper HTTP status codes and validation logic",
    goalKh: "អនុវត្តការងារ CRUD ពេញលេញជាមួយ Status Code និង Validation ត្រឹមត្រូវ",
    color: "#4d9fff",
    badge: "API",
    topics: [
      {
        en: "API CRUD Operations",
        kh: "ប្រតិបត្តិការ API CRUD",
        answerEn: "Handling GET (Index/Show), POST (Store), PUT (Update), and DELETE (Destroy) correctly.",
        answerKh: "ការគ្រប់គ្រងមុខងារមើល បញ្ចូល កែ និងលុបទិន្នន័យឱ្យបានត្រឹមត្រូវបំផុត។"
      },
      {
        en: "HTTP Status Codes (Standard)",
        kh: "ការប្រើ HTTP Status Codes",
        answerEn: "Using 201 for Created, 204 for Deleted, 404 for Not Found, and 422 for Validation Error.",
        answerKh: "ប្រើ Code ត្រឹមត្រូវតាមសកម្មភាព (201 បង្កើតបាន, 404 រកមិនឃើញ, 422 ឆែកឃើញខុស)។"
      },
      {
        en: "Validation in APIs",
        kh: "Validation ក្នុង APIs",
        answerEn: "Automatically returning 422 Unprocessable Entity with error details to the frontend.",
        answerKh: "បាយការណ៍កំហុស 422 ទៅកាន់ Frontend នៅពេល Data ផ្ញើមកមិនត្រឹមត្រូវតាមច្បាប់។"
      },
      {
        en: "Response Helpers",
        kh: "ការប្រើ Response Helpers",
        answerEn: "Using response()->json() to return consistent success or error messages.",
        answerKh: "ការប្រើ response()->json() ដើម្បីកំណត់ទម្រង់សារជូនដំណឹងឱ្យមានស្តង់ដារ។"
      },
    ],
    explanation: [
      { title: "No Forms, No Sessions", desc: "ក្នុង API គ្មាន redirect()->back() ឡើយ។ រាល់ Error ត្រូវឆ្លើយតបមកវិញជា JSON ភ្លាមៗ។" },
      { title: "Resource Not Found", desc: "ប្រើ Route Model Binding។ ប្រសិនបើរកទិន្នន័យមិនឃើញ Laravel នឹងផ្ដល់កំហុស 404 JSON ដោយស្វ័យប្រវត្តិ។" },
      { title: "Validation Auto-Logic", desc: "ប្រសិនបើ Validation ខុស វានឹងមិនបញ្ជូន User ទៅទំព័រចាស់ទេ តែវាបញ្ជូន JSON Error មកវិញ (ល្អបំផុតសម្រាប់ React/Mobile)។" }
    ],
    lab: {
      title: "Complete Product CRUD API",
      titleKh: "ការបង្កើត Product CRUD API ពេញលេញ",
      duration: "45 min",
      objective: "Build a full API to manage products with all standard HTTP operations",
      steps: [
        "Create a controller: php artisan make:controller Api/ProductController --api",
        "Implement store() and return the new item with a 201 Created status",
        "Implement destroy() and return a 204 No Content response",
        "Implement index() with pagination and Resources",
        "Test deleting a non-existent ID in Postman to confirm the 404 response",
        "Test submitting an empty POST to confirm the 422 validation response"
      ],
      code: `// Api/ProductController.php
public function store(StoreProductRequest $request) {
    $product = Product::create($request->validated());
    return new ProductResource($product); // Auto-returns 201 conceptually
}

public function destroy(Product $product) {
    $product->delete();
    return response()->json(null, 204);
}`,
      output: `POST /products → 201 Created (New body returned) ✓
GET /products/999 → 404 Not Found ✓
DELETE /products/1 → 204 No Content (Empty body) ✓`
    },
    concepts: [
      { term: "201 Created", def: "The HTTP success status code for a request that has resulted in a new resource being created." },
      { term: "422 Unprocessable Entity", def: "The standard code for validation failures in APIs." },
      { term: "Model Binding in API", def: "Laravel automatically finds the database record using the ID in the URL for you." },
    ],
    tip: "When building APIs, focus on the response codes. They are the universal language that tells the frontend developer exactly what happened to their request.",
    project: null,
  },
  {
    id: "m13", num: "13", section: "Section 13", hours: "1h",
    title: "API Auth: The Security Guard",
    titleKh: "ការការពារ API ជាមួយ Authentication",
    goal: "Secure your endpoints using modern token-based authentication and Sanctum",
    goalKh: "ការពារ Route របស់ API ជាមួយប្រព័ន្ធ Token និង Sanctum",
    color: "#b06bff",
    badge: "API AUTH",
    topics: [
      {
        en: "Personal Access Tokens",
        kh: "សំបុត្រអនុញ្ញាត (Tokens)",
        answerEn: "Long, unique strings that confirm a user's identity without using traditional sessions.",
        answerKh: "លេខកូដសម្ងាត់វែងៗដែលប្រើសម្រាប់បញ្ជាក់អត្តសញ្ញាណ User ដោយមិនប្រើ Session។"
      },
      {
        en: "Laravel Sanctum Setup",
        kh: "ការដំឡើង Sanctum",
        answerEn: "The official, lightweight package for issuing and verifying API tokens in Laravel.",
        answerKh: "Package ផ្លូវការរបស់ Laravel សម្រាប់បង្កើត និងឆែកមើល API Tokens។"
      },
      {
        en: "Authorization: Bearer",
        kh: "ការប្រើ Bearer Token",
        answerEn: "The standard HTTP header used to send a token from a frontend (mobile/web) to the API.",
        answerKh: "Header ស្តង់ដារ HTTP ដែលប្រើសម្រាប់បញ្ជូន Token ពី Frontend ទៅកាន់ API។"
      },
      {
        en: "The auth:sanctum Middleware",
        kh: "Middleware auth:sanctum",
        answerEn: "A guard that blocks any request that doesn't include a valid, unexpired token.",
        answerKh: "អ្នកការពារដែលរារាំងរាល់ Request ណាដែលគ្មាន Token ត្រឹមត្រូវ។"
      },
    ],
    explanation: [
      { title: "Tokens vs Sessions", desc: "API ជាទូទៅគឺ Stateless (មិនចាំ User)។ ដូច្នេះរាល់ការហៅ API ត្រូវភ្ជាប់ 'សំបុត្រ' (Token) មកជាមួយជានិច្ចក្នុង Header។" },
      { title: "Protection Guard", desc: "ប្រើ Auth:sanctum ដើម្បីការពារ Route សំខាន់ៗដូចជា ការទិញទំនិញ ឬការលុបទិន្នន័យ។" },
      { title: "Header Secret", desc: "Frontend ត្រូវផ្ញើ៖ Authorization: Bearer {your_token}។ ប្រសិនបើខុស Laravel នឹងឆើយ 401 Unauthorized។" }
    ],
    lab: {
      title: "Protecting Route Access",
      titleKh: "ការការពារច្រកចូល API",
      duration: "30 min",
      objective: "Set up the authentication guard and block unauthorized requests",
      steps: [
        "In User model, ensure 'HasApiTokens' trait is used (Laravel 11+ uses HasApiTokens by default)",
        "Open routes/api.php and wrap your Product 'store' route in auth:sanctum middleware",
        "Try to send a POST request with Postman WITHOUT a token",
        "Observe the 401 Unauthorized status code returned by Laravel",
        "Create a temporary token manually for testing if needed"
      ],
      code: `// routes/api.php
Route::middleware('auth:sanctum')->post('/products', function (Request $request) {
    return $request->user(); // Returns authenticated user data
});

// Testing without header
curl -X POST http://localhost/api/products -H "Accept: application/json"`,
      output: `Response: { "message": "Unauthenticated" }
Status: 401 Unauthorized ✓`
    },
    concepts: [
      { term: "Bearer Token", def: "The most common way to authenticate an API request. It 'bears' the user's identity." },
      { term: "HasApiTokens", def: "A PHP trait added to the User model that gives it the createToken() ability." },
      { term: "401 Unauthorized", def: "The HTTP status indicating the request lacks valid authentication credentials." },
    ],
    tip: "When testing APIs with authentication, always add the 'Accept: application/json' header. This tells Laravel to return JSON errors instead of redirecting to a login page.",
    project: null,
  },
  {
    id: "m13b", num: "13B", section: "Section 13 (cont.)", hours: "1h",
    title: "Issuing & Revoking Access",
    titleKh: "ការផ្ដល់ និងការដកសិទ្ធិ Token",
    goal: "Build the complete lifecycle of a secure token — from login to logout",
    goalKh: "បង្កើតវដ្តជីវិតពេញលេញនៃ Token — ចាប់ពីការចូល រហូតដល់ការចាកចេញ",
    color: "#b06bff",
    badge: "API AUTH",
    topics: [
      {
        en: "The Login API",
        kh: "ការបង្កើត Login API",
        answerEn: "Verifying credentials and returning a plainTextToken to the user.",
        answerKh: "ការឆែកមើល Email/Password និងផ្ដល់ Token មកវិញឱ្យ User ទុកប្រើ។"
      },
      {
        en: "Token Revocation (Logout)",
        kh: "ការលុប Token (Logout)",
        answerEn: "Deleting the specific token from the database to instantly invalidate access.",
        answerKh: "ការលុបទិន្នន័យ Token ចេញពី Database ដើម្បីឱ្យ User ឈប់មានសិទ្ធិចូលប្រើ។"
      },
      {
        en: "Multi-Device Management",
        kh: "ការគ្រប់គ្រងឧបករណ៍ច្រើន",
        answerEn: "Allowing users to have multiple tokens (Phone, Web) and revoking them individually.",
        answerKh: "អនុញ្ញាតឱ្យ User មាន Token ច្រើន (ទូរស័ព្ទ, វេបសាយ) និងការលុបវាដាច់ដោយឡែកពីគ្នា។"
      },
      {
        en: "Token Metadata",
        kh: "ព័ត៌មានបន្ថែមនៃ Token",
        answerEn: "Giving names to tokens (e.g., 'iPhone Pro') to help users identify their connected devices.",
        answerKh: "ការដាក់ឈ្មោះឱ្យ Token ដើម្បីឱ្យ User ដឹងថាប្រើលើឧបករណ៍អ្វី។"
      },
    ],
    explanation: [
      { title: "Issuing a Token", desc: "ប្រើ $user->createToken('name')->plainTextToken។ លទ្ធផលដែលបានមកគឺគ្រាន់តែជាអត្ថបទធម្មតាដែលត្រូវផ្ញើទៅ Frontend។" },
      { title: "Logout Logic", desc: "នៅពេល Logout យើងគ្រាន់តែលុប Row ចេញពី Table personal_access_tokens។" },
      { title: "Safety Tip", desc: "កុំបង្ហាញ Token ឱ្យអ្នកដទៃឃើញ ព្រោះវាស្មើនឹង Password របស់អ្នកដែរ។" }
    ],
    lab: {
      title: "Professional Login System",
      titleKh: "ប្រព័ន្ធ Login កម្រិតវិជ្ជាជីវៈ",
      duration: "45 min",
      objective: "Create a fully functioning login and logout system for your API",
      steps: [
        "Create an AuthController and a login method",
        "Use Auth::attempt() to verify the user credentials",
        "If successful, return a JSON response containing the generated token",
        "Create a logout route that deletes the currentAccessToken()",
        "Test the full flow: Login → Copy Token → Use in Header → Logout → Token Fail"
      ],
      code: `// AuthController.php
public function login(Request $request) {
    if (Auth::attempt($request->only('email', 'password'))) {
        $token = $request->user()->createToken('mobile-app')->plainTextToken;
        return response()->json(['token' => $token]);
    }
    return response()->json(['error' => 'Invalid'], 401);
}

public function logout(Request $request) {
    $request->user()->currentAccessToken()->delete();
    return response()->json(['message' => 'Logged out']);
}`,
      output: `POST /login → { "token": "1|xyz..." } ✓
POST /logout → { "message": "Logged out" } ✓
Immediate GET request with old token → 401 Unauthorized ✓`
    },
    concepts: [
      { term: "plainTextToken", def: "The only time you see the actual token string. After this, it is stored as a secret hash." },
      { term: "currentAccessToken()", def: "A Laravel method that targets the specific token string currently being used." },
      { term: "Revocation", def: "The process of making a token invalid so it can no longer be used for authentication." },
    ],
    tip: "In a real logout, always use $request->user()->currentAccessToken()->delete(); to only log out the current device. If you use tokens()->delete() you will log out the user from EVERY device at once!",
    project: null,
  },
  {
    id: "m13c", num: "13C", section: "Section 13 (cont.)", hours: "1h",
    title: "Understanding JWT vs Sanctum",
    titleKh: "ស្វែងយល់ពី JWT និង Sanctum",
    goal: "Architectural comparison: Choose the right authentication strategy for your project",
    goalKh: "ការប្រៀបធៀបស្ថាបត្យកម្ម៖ ជ្រើសរើសវិធីការពារឱ្យបានត្រឹមត្រូវ",
    color: "#b06bff",
    badge: "API AUTH",
    topics: [
      {
        en: "What is JWT?",
        kh: "តើអ្វីទៅជា JWT?",
        answerEn: "JSON Web Token — A self-contained, stateless token that encodes user data into the string itself.",
        answerKh: "សំបុត្រសម្ងាត់ដែលផ្ទុកទិន្នន័យ User នៅក្នុងអត្ថបទ Token នោះផ្ទាល់តែម្តង ( stateless)។"
      },
      {
        en: "JWT Structure",
        kh: "រចនាសម្ព័ន្ធ JWT",
        answerEn: "Consists of three parts separated by dots: Header, Payload, and Signature.",
        answerKh: "មាន ៣ ផ្នែកបំបែកដោយសញ្ញាចុច (.) គឺ Header, Payload និង Signature។"
      },
      {
        en: "Sanctum vs JWT",
        kh: "ការប្រៀបធៀប Sanctum និង JWT",
        answerEn: "Sanctum uses database lookups (easier to revoke), while JWT is decoded by code (faster but harder to revoke).",
        answerKh: "Sanctum ឆែកក្នុង Database (ងាយលុបចោល) ចំណែក JWT ឆែកតាមកូដ (លឿនតែពិបាកលុបចោល)។"
      },
      {
        en: "When to use which?",
        kh: "ពេលណាគួរប្រើមួយណា?",
        answerEn: "Use Sanctum for most Laravel web/mobile apps. Use JWT for microservices or massive-scale apps.",
        answerKh: "ប្រើ Sanctum សម្រាប់ App ទូទៅ។ ប្រើ JWT សម្រាប់ប្រព័ន្ធធំៗកម្រិត Microservices។"
      },
    ],
    explanation: [
      { title: "JWT Payload", desc: "JWT ផ្ទុកព័ត៌មានដូចជា User ID និងឈ្មោះនៅក្នុងអត្ថបទដែលបាន Encoded រួច។" },
      { title: "No DB Lookup", desc: "សម្រាប់ JWT, Server មិនចាំបាច់ឆែក Database ឱ្យខាតពេលរាល់ដងទេ គ្រាន់តែ Decode មើល Signature ក៏ដឹងថាពិតឬកុហក។" },
      { title: "The Sanctum Advantage", desc: "Sanctum ងាយស្រួលជាង ព្រោះវារួមបញ្ចូលក្នុង Laravel រួចជាស្រេច និងមានមុខងារលុប Token (Logout) ភ្លាមៗល្អជាង JWT។" }
    ],
    lab: {
      title: "Comparing Auth Responses",
      titleKh: "ការប្រៀបធៀបលទ្ធផល Auth",
      duration: "30 min",
      objective: "Analyze a token structure and understand how data is stored in different auth types",
      steps: [
        "Examine a Sanctum token: It looks like 1|xyz... (ID | Secret)",
        "Use an online tool like jwt.io to see how a JWT encodes its data",
        "Discuss the risks: If a JWT is stolen, it stays valid until it expires (no DB logout possible easily)",
        "Discuss the benefits: JWT works even if your database is offline temporarily",
        "Choose the right library: Discuss why Sanctum is usually the #1 choice for Laravel developers"
      ],
      code: `// Structure of a JWT (Conceptual)
xxxxx.yyyyy.zzzzz
- xxxxx: Algorithm & Token type
- yyyyy: Data (User ID, Expiry date)
- zzzzz: Signature (Verified by your SECRET key)

// Structure of a Sanctum Token
1|abc123456789...
- 1: Database numeric ID
- abc...: The actual secret string`,
      output: `JWT → Self-contained (Everything is inside the string) ✓
Sanctum → Database-backed (Server has the final say) ✓`
    },
    concepts: [
      { term: "JWT Payload", def: "The middle part of a JWT that contains the actual data being sent (claims)." },
      { term: "Statelessness", def: "The quality of JWT where the server doesn't need to remember anything to verify you." },
      { term: "Signature", def: "The cryptographic proof that a token hasn't been tampered with." },
    ],
    tip: "Stick with Sanctum unless you have a very specific reason to use JWT. Sanctum provides the best balance of security and developer experience for 99% of Laravel projects.",
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
      {
        en: "Asset Management",
        kh: "ការគ្រប់គ្រង Assets",
        answerEn: "Moving CSS, JS, and image files into the public directory for web access.",
        answerKh: "បញ្ជូន File CSS, JS និងរូបភាព ទៅក្នុង Public Directory ដើម្បីអាចប្រើលើ Web បាន។"
      },
      {
        en: "Blade Layout Conversion",
        kh: "ការបំប្លែង Blade Layout",
        answerEn: "Turning static HTML structures into reusable layout files.",
        answerKh: "បំប្លែងរចនាសម្ព័ន្ធ HTML ឱ្យទៅជា Layout ដែលអាចប្រើឡើងវិញបាន។"
      },
      {
        en: "Section & Yield Pattern",
        kh: "លំនាំ Section & Yield",
        answerEn: "Defining content slots in layouts and filling them from child pages.",
        answerKh: "កំណត់រន្ធសម្រាប់ Content ក្នុង Layout និងបំពេញវាពីទំព័រអនុវិទ្យាល័យ។"
      },
      {
        en: "Dynamic Data Integration",
        kh: "ការបញ្ចូលទិន្នន័យ Dynamic",
        answerEn: "Replacing placeholder text with real content from Eloquent and Blade.",
        answerKh: "ជំនួសអត្ថបទគំរូ ដោយខ្លឹមសារពិតដែលទាញចេញពី Eloquent និង Blade។"
      },
      {
        en: "Reusable Components",
        kh: "Components ដែលប្រើបានច្រើនដង",
        answerEn: "Building modular UI elements like cards and buttons for consistency.",
        answerKh: "បង្កើតផ្នែកនៃ UI ដូចជា Card និង Button ដើម្បីឱ្យមានភាពស៊ីសង្វាក់គ្នា។"
      },
      {
        en: "Asset Linking (Vite)",
        kh: "ការភ្ជាប់ Assets (Vite)",
        answerEn: "Correctly linking styles and scripts using asset() or Vite helpers.",
        answerKh: "ភ្ជាប់ Style និង Script ឱ្យបានត្រឹមត្រូវដោយប្រើ asset() ឬ Vite helpers។"
      },
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

{{-- STEP 2: resources/views/layouts/app.blade.php — the layout --}}
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
  ├── layouts/app.blade.php      ← layout (nav + footer)
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
    goal: "Every Blade directive and wire real database data into your HTML template",
    goalKh: "គ្រប់ Blade Directives ទាំងអស់ ហើយភ្ជាប់ Database Data ចូល Template",
    color: "#ff8c42",
    badge: "FRONTEND",
    topics: [
      {
        en: "Output Directives",
        kh: "Directives សម្រាប់ការបង្ហាញ",
        answerEn: "Using {{ }} for safe escaping and {!! !!} for raw HTML output.",
        answerKh: "ប្រើ {{ }} ដើម្បីសុវត្ថិភាព និង {!! !!} សម្រាប់ការបង្ហាញ raw HTML។"
      },
      {
        en: "Blade Control Flow",
        kh: "Blade Control Flow",
        answerEn: "Implementing logical conditions with @if, @unless, and @switch directives.",
        answerKh: "អនុវត្តលក្ខខណ្ឌ Logic ជាមួយ directive @if, @unless និង @switch។"
      },
      {
        en: "Loop Directives",
        kh: "Directives សម្រាប់ Loop",
        answerEn: "Iterating through data collections using @foreach and @forelse patterns.",
        answerKh: "បង្វិលទិន្នន័យ (Iterate) តាមរយៈការប្រើប្រាស់ @foreach និង @forelse។"
      },
      {
        en: "Template Helpers",
        kh: "Template Helpers",
        answerEn: "Streamlining UI logic with @class, @style, @checked and @selected helpers.",
        answerKh: "សម្រួល Logic នៃ UI ជាមួយ helper @class, @style, @checked និង @selected។"
      },
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
      { en: "Anonymous components — simple, file-only components", kh: "Anonymous Components — Components ងាយស្រួល មានតែ File", answerEn: "Anonymous components are simple Blade files used as reusable UI elements.", answerKh: "Anonymous components គឺជាឯកសារ Blade សាមញ្ញដែលប្រើជា UI element ប្រើឡើងវិញបាន។" },
      { en: "Class-based components — PHP logic + Blade view pair", kh: "Class-based Components — PHP Logic + Blade View", answerEn: "Class-based components have a dedicated PHP class for complex rendering logic.", answerKh: "Class-based components មាន PHP class ផ្ទាល់ខ្លួនសម្រាប់ logic បង្ហាញទិន្នន័យដែលសាំញ៉ាំ។" },
      { en: "Named slots, conditional slots & $attributes bag", kh: "Named Slots, Conditional Slots & $attributes bag", answerEn: "Slots allow you to inject HTML into components, while $attributes handles props.", answerKh: "Slots អនុញ្ញាតឱ្យអ្នកដាក់ HTML ចូល component ចំណែក $attributes គ្រប់គ្រងលើ props។" },
      { en: "Alpine.js — x-data, x-show, x-on, x-model for interactivity", kh: "Alpine.js — x-data, x-show, x-on, x-model សម្រាប់ Interactivity", answerEn: "Alpine.js adds simple front-end interactivity directly within your Blade files.", answerKh: "Alpine.js បន្ថែមនូវ interactivity ចំហៀង frontend ងាយស្រួលក្នុងឯកសារ Blade។" },
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
    title: "File Storage: Disks & Links",
    titleKh: "ការគ្រប់គ្រង Storage និង Disks",
    goal: "The Laravel filesystem abstraction to handle files across local and cloud storage",
    goalKh: "ស្ទាត់ជំនាញលើការគ្រប់គ្រង File ក្នុងប្រព័ន្ធ Storage និង Cloud",
    color: "#8a8680",
    badge: "STORAGE",
    topics: [
      {
        en: "Storage Disks (local vs public)",
        kh: "ប្រភេទ Storage Disks",
        answerEn: "Abstracting storage locations so you can swap local files for Amazon S3 with one config change.",
        answerKh: "បែងចែកកន្លែងរក្សាទុកឱ្យដាច់ពីគ្នា ដើម្បីងាយស្រួលប្តូរពី Local ទៅ Cloud Storage។"
      },
      {
        en: "The storage:link Symlink",
        kh: "ការប្រើ storage:link",
        answerEn: "Creating a bridge between your private app folder and the public web folder for image access.",
        answerKh: "បង្កើតស្ពានចម្លងទិន្នន័យពី folder សម្ងាត់ ទៅកាន់ public folder ដើម្បីបង្ហាញរូបភាព។"
      },
      {
        en: "Disk Configuration",
        kh: "ការកំណត់ Disk Config",
        answerEn: "Defining where files should live and their public URLs in config/filesystems.php.",
        answerKh: "កំណត់ទីតាំងរក្សាទុក និង URL សម្រាប់បង្ហាញក្នុង config/filesystems.php។"
      },
      {
        en: "Filesystem Facade",
        kh: "ការប្រើ Filesystem Facade",
        answerEn: "Using the Storage facade to perform operations like move, copy, and check existence.",
        answerKh: "ការប្រើ Storage facade ដើម្បីប្តូរឈ្មោះ ចម្លង ឬឆែកមើលថាមាន File ឬអត់។"
      },
    ],
    explanation: [
      { title: "Disk Abstraction", desc: "Laravel មិនឱ្យយើងខ្វល់ពី Path វែងៗក្នុង Server ទេ។ យើងគ្រាន់តែប្រាប់ថា 'រក្សាទុកក្នុង disk public' នោះវាចាត់ចែងឱ្យយើងភ្លាម។" },
      { title: "Public vs Private", desc: "Disk 'local' គឺសម្ងាត់ (Browser មើលមិនឃើញ)។ Disk 'public' គឺសម្រាប់រូបភាព Profile ឬ Product ដែលយើងចង់ឱ្យ User ឃើញ។" },
      { title: "The Symlink Bridge", desc: "Folder public/storage គឺជា Shortcut ទៅកាន់ storage/app/public។ បើគ្មាន 'storage:link' ទេ រូបភាពនឹងមិនបង្ហាញឡើយ។" }
    ],
    lab: {
      title: "Establishing the Media Bridge",
      titleKh: "ការរៀបចំស្ពានចម្លងរូបភាព",
      duration: "30 min",
      objective: "Set up the symbolic link and test disk access for public files",
      steps: [
        "Run the command: php artisan storage:link",
        "Verify that a new folder 'storage' appears inside your project's 'public' directory",
        "Manually place a test image in storage/app/public/test.jpg",
        "Try to access it in your browser via http://localhost/storage/test.jpg",
        "Check config/filesystems.php to see the 'public' disk configuration"
      ],
      code: `// Command to run (only once per project)
php artisan storage:link

// Check existing disks
'disks' => [
    'local' => [
        'driver' => 'local',
        'root' => storage_path('app'),
    ],
    'public' => [
        'driver' => 'local',
        'root' => storage_path('app/public'),
        'url' => env('APP_URL').'/storage',
        'visibility' => 'public',
    ],
]`,
      output: `INFO The [public/storage] link has been connected to [storage/app/public]. ✓
Browser Access: 200 OK for /storage/test.jpg ✓`
    },
    concepts: [
      { term: "Symbolic Link", def: "A special file that points to another file or directory. Like a desktop shortcut." },
      { term: "Disk root", def: "The main folder where all files for a specific disk are stored." },
      { term: "Filesystem Abstraction", def: "A way to use the same code for Local storage and Cloud storage (like S3)." },
    ],
    tip: "In a production environment (like Forge), remember that you need to run storage:link during your first deployment to make your images work.",
    project: null,
  },
  {
    id: "m15b", num: "15B", section: "Section 15 (cont.)", hours: "1h",
    title: "Handling Media Uploads",
    titleKh: "ការ Upload រូបភាព និងឯកសារ",
    goal: "Implement secure and organized file upload logic for your database records",
    goalKh: "អនុវត្តការងារ Upload រូបភាពឱ្យមានសណ្តាប់ធ្នាប់ និងសុវត្ថិភាព",
    color: "#8a8680",
    badge: "STORAGE",
    topics: [
      {
        en: "Validated File Uploads",
        kh: "ការ Upload ដែលមាន Validation",
        answerEn: "Ensuring users only upload specific types (JPG, PNG) and within size limits (e.g., 2MB).",
        answerKh: "ធានាថា User អាច Upload បានតែប្រភេទ File ត្រឹមត្រូវ និងទំហំមិនហួសកំណត់។"
      },
      {
        en: "The store() Method",
        kh: "ការប្រើ Method store()",
        answerEn: "Automatically generating a unique filename and saving the file to a specific folder.",
        answerKh: "ការបង្កើតឈ្មោះ File ថ្មីដោយស្វ័យប្រវត្តិ និងរក្សាទុកក្នុង Folder ជាក់លាក់។"
      },
      {
        en: "storeAs() for Custom Names",
        kh: "ការកំណត់ឈ្មោះដោយខ្លួនឯង",
        answerEn: "Controlling the exact filename (e.g., product_101.jpg) for better organization.",
        answerKh: "ការកំណត់ឈ្មោះ File ឱ្យចំតាមអ្វីដែលយើងចង់បាន (ឧទាហរណ៍ product_101.jpg)។"
      },
      {
        en: "Multipart Form Data",
        kh: "ការប្រើ Multipart Form",
        answerEn: "Essential HTML attribute (enctype) required to send files from a browser to the server.",
        answerKh: "Attribute ចាំបាច់ក្នុង HTML Form ដើម្បីអាចបញ្ជូន File ទៅកាន់ Server បាន។"
      },
    ],
    explanation: [
      { title: "Naming Strategy", desc: "Laravel ប្រើ store() ដើម្បីបញ្ចៀសបញ្ហា 'ឈ្មោះជាន់គ្នា'។ វាបង្កើតឈ្មោះវែងៗ (ដូចជា abc123xyz.jpg) ដោយស្វ័យប្រវត្តិ។" },
      { title: "Validation Rules", desc: "ប្រើ 'image|mimes:jpeg,png,webp|max:2048'។ 2048 គឺស្មើនឹង 2MB។" },
      { title: "DB vs Disk", desc: "យើងមិនរក្សាទុក 'រូបភាព' ក្នុង Database ទេ យើងរក្សាទុកតែ 'Path' (ផ្លូវទៅកាន់ File) ប៉ុណ្ណោះ។" }
    ],
    lab: {
      title: "Uploading Product Images",
      titleKh: "ការ Upload រូបភាពផលិតផល",
      duration: "45 min",
      objective: "Update your Product form to support image uploads and save paths to the DB",
      steps: [
        "Add enctype='multipart/form-data' to your Blade form",
        "In the Controller, check for a file using $request->hasFile('image')",
        "Upload the file to the 'products' folder on the 'public' disk",
        "Save the returned path string into your product's image column",
        "Verify the file exists in storage/app/public/products/"
      ],
      code: `// 1. Blade Form
<form action="..." method="POST" enctype="multipart/form-data">
    @csrf
    <input type="file" name="image">
</form>

// 2. Controller Store
if ($request->hasFile('image')) {
    $path = $request->file('image')->store('products', 'public');
    $product->image = $path;
    $product->save();
}`,
      output: `File saved: storage/app/public/products/random_name.jpg ✓
DB saved: "products/random_name.jpg" ✓`
    },
    concepts: [
      { term: "Multipart/form-data", def: "The encoding type that allows HTML forms to include binary data (files)." },
      { term: "UploadedFile", def: "The PHP/Laravel object that represents a file being uploaded from a request." },
      { term: "MIME types", def: "The standard way to identify file formats (e.g., image/jpeg)." },
    ],
    tip: "Always use the store() method's return value. It gives you the relative path you need to save in your database effortlessly.",
    project: null,
  },
  {
    id: "m15c", num: "15C", section: "Section 15 (cont.)", hours: "1h",
    title: "Media Retrieval & Cleanup",
    titleKh: "ការបង្ហាញ និងការលុប File",
    goal: "Complete the media lifecycle by serving images and managing disk space efficiently",
    goalKh: "បញ្ចប់វដ្តជីវិតនៃ Media — ការបង្ហាញ និងការគ្រប់គ្រងទំហំ Storage",
    color: "#8a8680",
    badge: "STORAGE",
    topics: [
      {
        en: "Storage::url()",
        kh: "ការទាញយក URL",
        answerEn: "Generating the correct, public URL to display an image in your HTML templates.",
        answerKh: "បង្កើតអាសយដ្ឋាន URL ត្រឹមត្រូវដើម្បីបង្ហាញរូបភាពក្នុងវេបសាយ។"
      },
      {
        en: "Deleting Old Files",
        kh: "ការលុប File ចាស់ៗ",
        answerEn: "Removing old images from the disk when a product is deleted or updated to save space.",
        answerKh: "លុបរូបភាពចាស់ៗចេញពី Storage នៅពេលទិន្នន័យត្រូវបានលុប ឬផ្លាស់ប្តូររូបភាពថ្មី។"
      },
      {
        en: "Temporary URLs",
        kh: "URL បណ្តោះអាសន្ន",
        answerEn: "Creating secure, expiring links for private files hosted on cloud storage like S3.",
        answerKh: "បង្កើត Link សម្ងាត់ដែលមានសុពលភាពខ្លី សម្រាប់ File សំខាន់ៗក្នុង Cloud។"
      },
      {
        en: "Intervention Image (Resize)",
        kh: "ការប្តូរទំហំរូបភាព",
        answerEn: "Using a third-party library to resize or crop images during upload for better performance.",
        answerKh: "ការប្រើ Library បន្ថែមដើម្បីកាត់ ឬប្តូរទំហំរូបភាពតាមតម្រូវការឌីហ្សាញ។"
      },
    ],
    explanation: [
      { title: "Dynamic URLs", desc: "កុំសរសេរ Path ផ្ទាល់ៗក្នុង Blade។ ប្រើ Storage::url($path) ដើម្បីឱ្យវាប្តូរទៅជា Domain ថ្មីដោយស្វ័យប្រវត្តិពេលអ្នកឡើង Production។" },
      { title: "Orphan Prevention", desc: "រាល់ពេល Update រូបភាពថ្មី ត្រូវលុបរូបភាពចាស់ចោលផង (Storage::delete) បើមិនដូច្នោះទេ Server អ្នកនឹងពេញដោយ 'រូបភាពខ្មោច'។" },
      { title: "Existance Check", desc: "ប្រើ Storage::exists() មុននឹងលុប ដើម្បីបញ្ចៀស Error ប្រសិនបើ File នោះត្រូវបានលុបដោយដៃបាត់ទៅហើយ។" }
    ],
    lab: {
      title: "Media Management Lifecycle",
      titleKh: "ការគ្រប់គ្រង Media ពេញលេញ",
      duration: "45 min",
      objective: "Implement a professional 'Update & Delete' flow that includes file cleanup",
      steps: [
        "In your Update method, check if a new file is uploaded",
        "If yes, delete the OLD file string stored in the database from the disk",
        "In the Delete (Destroy) method, ensure the image is removed from storage completely",
        "In Blade, build an @if(@else) block to show a placeholder if no image exists",
        "Test the full flow: Upload → Change → Verify old image is gone"
      ],
      code: `// Delete logic
public function destroy(Product $product) {
    if ($product->image) {
        Storage::disk('public')->delete($product->image);
    }
    $product->delete();
}

// Display logic in Blade
<img src="{{ $product->image ? Storage::url($product->image) : asset('default.png') }}">`,
      output: `Product Deleted → File removed from storage/app/public ✓
Edit Image → Old file deleted, new one created ✓
No Image → Placeholder shown instead of broken link ✓`
    },
    concepts: [
      { term: "Visibility", def: "A setting that controls if a file is publicly accessible (public) or locked (private)." },
      { term: "Disk Quota", def: "The limit of storage space allowed on your server - cleaning up prevents hitting this limit." },
      { term: "Placeholder", def: "A default image shown to users when a specific item doesn't have its own media." },
    ],
    tip: "Always wrap your Storage::delete() calls in a check to ensure the file path is not null/empty, especially if you have products created without images.",
    project: null,
  },
  {
    id: "m16", num: "16", section: "Section 16", hours: "1h",
    title: "Queues: The Async Mindset",
    titleKh: "ការយល់ដឹងពី Queues និង Async",
    goal: "Learn to move slow tasks out of the main request to keep your application lightning fast",
    goalKh: "រៀនបញ្ជូនការងារយឺតៗចេញពី Request ដើម្បីឱ្យ App ដើរលឿនបំផុត",
    color: "#ff4d4d",
    badge: "ASYNC",
    topics: [
      {
        en: "Sync vs Async Execution",
        kh: "Sync vs Async Execution",
        answerEn: "Synchronous runs one after another (blocking), while Async runs tasks in the background (non-blocking).",
        answerKh: "Sync គឺធ្វើការម្តងមួយៗ (រង់ចាំគ្នា) ចំណែក Async គឺធ្វើការនៅ Background (មិនបាច់ចាំគ្នា)។"
      },
      {
        en: "Why Queues Matter?",
        kh: "ហេتوىអ្វីត្រូវប្រើ Queues?",
        answerEn: "To prevent users from waiting for slow operations like sending emails or processing 4K videos.",
        answerKh: "ដើម្បីកុំឱ្យ User រង់ចាំការងារដែលយូរ ដូចជាការផ្ញើ Email ឬការកាត់តវីដេអូទំហំធំ។"
      },
      {
        en: "Queue Drivers (DB/Redis)",
        kh: "ប្រភេទ Queue Drivers",
        answerEn: "Drivers like 'database' are easy for development, while 'redis' is faster for production.",
        answerKh: "Driver 'database' ងាយស្រួលប្រើពេលរៀាន ចំណែក 'redis' គឺលឿនបំផុតសម្រាប់ប្រើការមែនទែន។"
      },
      {
        en: "Queue Configuration",
        kh: "ការកំណត់ Queue Config",
        answerEn: "Setting the default connection in .env via QUEUE_CONNECTION variable.",
        answerKh: "ការកំណត់ប្រព័ន្ធ Queue លំនាំដើមក្នុង .env តាមរយៈ QUEUE_CONNECTION។"
      },
    ],
    explanation: [
      { title: "Keeping Users Happy", desc: "ប្រសិនបើ User ចុះឈ្មោះ ហើយយើងផ្ញើ Email ភ្លាមៗ គេត្រូវរង់ចាំ ៥វិនាទី។ តែបើប្រើ Queue គេរង់ចាំតែ ០.១វិនាទីប៉ុណ្ណោះ។" },
      { title: "Work in Background", desc: "Queue នឹងទុកការងារនោះក្នុង 'ធុង' (Database) រួចត្រលប់ទៅប្រាប់ User ថា 'រួចរាល់ហើយ' បើទោះជាការងារពិតមិនទាន់ចប់ក៏ដោយ។" },
      { title: "Standard Connections", desc: "Laravel ផ្ដល់ជម្រើសច្រើនដូចជា Sync (ធ្វើភ្លាម), Database (ទុកក្នុង DB), Redis (ទុកក្នុង Memory) និង SQS (ទុកក្នុង Cloud)។" }
    ],
    lab: {
      title: "Setting Up the Background Engine",
      titleKh: "ការរៀបចំប្រព័ន្ធ Background",
      duration: "30 min",
      objective: "Prepare your database to act as a queue storage and configure your environment",
      steps: [
        "In your .env file, find QUEUE_CONNECTION and change it from 'sync' to 'database'",
        "Run 'php artisan queue:table' to generate the storage migration",
        "Run 'php artisan migrate' to create the jobs and failed_jobs tables",
        "Verify your database includes the 'jobs' table (this is the waiting room)",
        "Check how jobs are added to the table during development"
      ],
      code: `// .env configuration
QUEUE_CONNECTION=database

// Terminal commands
php artisan queue:table
php artisan migrate

// Checking the result
php artisan migrate:status`,
      output: `Migration: 2024_01_01_create_jobs_table ... DONE ✓
QUEUE_CONNECTION is now using the database engine. ✓`
    },
    concepts: [
      { term: "Blocking Request", def: "An operation that stops the user from continuing until the task is complete." },
      { term: "Asynchronicity", def: "The ability of a system to start a task and move to the next without waiting for completion." },
      { term: "Queue Migration", def: "Creating a database table to hold jobs while they wait to be processed." },
    ],
    tip: "Never use the 'sync' driver in production. It defeats the purpose of queues because it runs the task inside the current request just like normal code.",
    project: null,
  },
  {
    id: "m16b", num: "16B", section: "Section 16 (cont.)", hours: "1h",
    title: "Creating & Dispatching Jobs",
    titleKh: "ការបង្កើត និងបញ្ជូន Background Jobs",
    goal: "Encapsulate logic into reusable Job classes and trigger them on demand",
    goalKh: "ខ្ចប់កូដទៅក្នុង Job Classes និងបញ្ជាឱ្យវាដើរតាមតម្រូវការ",
    color: "#ff4d4d",
    badge: "ASYNC",
    topics: [
      {
        en: "The Job Class Pattern",
        kh: "រចនាសម្ព័ន្ធ Job Class",
        answerEn: "Using php artisan make:job to create a clean class for background tasks.",
        answerKh: "ប្រើប្រាស់ Job Class ដើម្បីរៀបចំកូដឱ្យមានសណ្តាប់ធ្នាប់សម្រាប់ការងារ Background។"
      },
      {
        en: "The handle() Method",
        kh: "មុខងារ handle()",
        answerEn: "The main entry point where your actual background logic (like sending mail) lives.",
        answerKh: "ជាកន្លែងដែលកូដពិតប្រាកដ (ដូចជាការផ្ញើ Email) ត្រូវបានសរសេរចូល។"
      },
      {
        en: "Dispatching Jobs",
        kh: "ការបញ្ជូន Job (Dispatch)",
        answerEn: "Using the static dispatch() method to push a task into the queue.",
        answerKh: "ប្រើ Method dispatch() ដើម្បីរុញការងារចូលទៅក្នុងប្រព័ន្ធ Queue។"
      },
      {
        en: "Delaying Tasks",
        kh: "ការពន្យារពេលការងារ (Delay)",
        answerEn: "Scheduling a job to run after a specific time (e.g., in 10 minutes) using delay().",
        answerKh: "ការកំណត់ឱ្យ Job មួយដើរនៅពេលក្រោយ (ឧទាហរណ៍៖ ២នាទីទៀត ទើបផ្ញើ)។"
      },
    ],
    explanation: [
      { title: "ShouldQueue Interface", desc: "ដើម្បីឱ្យ Job មួយដើរនៅ Background បាន យើងត្រូវឱ្យ Class នោះ implement ShouldQueue interface។" },
      { title: "SerializesModels", desc: "trait នេះជួយឱ្យ Laravel អាចចងចាំ Model (ID) របស់អ្នកបាន បើទោះជា Job នោះដើរនៅ ១ម៉ោងក្រោយក៏ដោយ។" },
      { title: "Clean Controllers", desc: "កូដដែលចំណាយពេលយូរ មិនគួរទុកក្នុង Controller ទេ។ គ្រាន់តែហៅ YourJob::dispatch() ហើយ Controller នឹងទំនេរភ្លាម។" }
    ],
    lab: {
      title: "Sending Background Welcome Emails",
      titleKh: "ការផ្ញើ Email ក្នុង Background",
      duration: "45 min",
      objective: "Move a welcome email operation from the user registration into a background job",
      steps: [
        "Create a job: php artisan make:job SendWelcomeEmail",
        "Inside the handle() method, add the Mail::send() logic",
        "Pass the User model through the constructor: __construct(public User $user)",
        "In your RegisterController, replace the Mail::send code with SendWelcomeEmail::dispatch($user)",
        "Try to register a new user and notice that the response is instant"
      ],
      code: `// app/Jobs/SendWelcomeEmail.php
public function handle(): void {
    Mail::to($this->user->email)->send(new WelcomeMail($this->user));
}

// In RegisteredUserController.php
public function store(Request $request) {
    $user = User::create($request->validated());
    
    // Dispatch and finish request instantly!
    SendWelcomeEmail::dispatch($user)->delay(now()->addSeconds(30));
    
    return redirect('/home');
}`,
      output: `Job dispatched successfully. ✓
HTTP Response received in < 100ms. ✓
Database 'jobs' table now contains 1 record. ✓`
    },
    concepts: [
      { term: "Job Payload", def: "The serialized data (like a user ID) that is stored in the database for the worker to read later." },
      { term: "Serialization", def: "The process of converting a PHP object into a string format that can be stored in a database." },
      { term: "Trait Queueable", def: "Gives your Job the ability to be delayed, prioritized, or sent to a specific queue folder." },
    ],
    tip: "Use Job Classes for anything that takes more than 1 second. Your users will perceive your app as much faster, even if the work takes the same time behind the scenes.",
    project: null,
  },
  {
    id: "m16c", num: "16C", section: "Section 16 (cont.)", hours: "1h",
    title: "Worker Management & Failures",
    titleKh: "ការគ្រប់គ្រង Worker និងការដោះស្រាយកំហុស",
    goal: "Handle background errors professionally with retries, failed job logs, and monitoring",
    goalKh: "គ្រប់គ្រងកំហុសនៅ Background ជាមួយការសាកល្បងសារជាថ្មី និងសង្កេតកំហុស",
    color: "#ff4d4d",
    badge: "ASYNC",
    topics: [
      {
        en: "Starting the Worker",
        kh: "ការបញ្ជាឱ្យ Worker ដើរ",
        answerEn: "Using php artisan queue:work to start the process that constantly watches for new jobs.",
        answerKh: "ប្រើប្រាស់ Command queue:work ដើម្បីឱ្យវាអង្គុយចាំធ្វើការងារដែលចូលមកក្នុង Queue។"
      },
      {
        en: "Handling Job Failures",
        kh: "ដោះស្រាយកំហុស Job",
        answerEn: "Configuring how many times a job should retry ($tries) before it's marked as failed.",
        answerKh: "កំណត់ចំនួនដងនៃការសាកល្បង (Retry) មុនពេលចាត់ទុកថា Job នោះខូច (Failed)។"
      },
      {
        en: "The failed() Method",
        kh: "មុខងារ failed()",
        answerEn: "A fallback function inside your Job class that runs only if the job fails completely.",
        answerKh: "កូដដែលនឹងដើរតែពេលដែល Job នោះធ្វើមិនកើតទាល់តែសោះ (សម្រាប់ផ្ញើសារប្រាប់ Admin)។"
      },
      {
        en: "The failed_jobs Table",
        kh: "តារាង Failed Jobs",
        answerEn: "A specific place where Laravel stores jobs that couldn't be finished for developers to review.",
        answerKh: "កន្លែងដែល Laravel ទុក Job ដែលខូច ដើម្បីឱ្យ Dev មកឆែកមើលតាមក្រោយ។"
      },
    ],
    explanation: [
      { title: "Work Forever", desc: "queue:work នឹងដើររហូតទាល់តែយើងបិទវា។ ក្នុងផលិតផលមែនទែន យើងប្រើ Supervisor ដើម្បីបើកវាឡើងវិញបើវាគាំង។" },
      { title: "Automatic Retries", desc: "បើ Internet ដាច់ពេលផ្ញើ Email, Laravel នឹងសាកល្បងម្ដងទៀតនៅ ១០នាទីក្រោយ បើអ្នកកំណត់ '$tries = 3'។" },
      { title: "Review & Replay", desc: "អ្នកអាចមើល Job ដែលខូចក្នុង 'failed_jobs' table ហើយបញ្ជាឱ្យវាដើរសារជាថ្មីបាន (queue:retry)។" }
    ],
    lab: {
      title: "Managing Background Failures",
      titleKh: "ការដោះស្រាយកំហុស Background",
      duration: "45 min",
      objective: "Simulate a job failure, inspect the logs, and retry the failed task",
      steps: [
        "In your SendWelcomeEmail job, add a line to throw an artistic Exception if name is 'Error'",
        "Run 'php artisan queue:work' in your terminal and watch it process",
        "Create a user with the name 'Error' to trigger a job failure",
        "Inspect the 'failed_jobs' table using your DB client",
        "Fix the code and run 'php artisan queue:retry all' to redo the task"
      ],
      code: `// Simulating a failure
public function handle(): void {
    if ($this->user->name === 'Error') {
        throw new \Exception("Manual Failure for testing!");
    }
}

// Queue monitoring commands
php artisan queue:work
php artisan queue:failed    // Show lost jobs
php artisan queue:retry all // Re-run all failures`,
      output: `[2024-02-01] Processing: SendWelcomeEmail
[2024-02-01] Failed:     SendWelcomeEmail (Manual Failure!)
Table 'failed_jobs' updated with new entry. ✓`
    },
    concepts: [
      { term: "Worker", def: "A background process that looks at the database, takes a job, and runs its code." },
      { term: "Retry Strategy", def: "A plan for how many times and how often to attempt a task that did not succeed." },
      { term: "Supervisor", def: "The gold standard for production – it's a Linux tool that ensures your queue workers NEVER stop." },
    ],
    tip: "Always run 'php artisan queue:restart' after you update your code. If you don't, the worker will keep running the OLD version of your code from memory!",
    project: null,
  },
  {
    id: "m17", num: "17", section: "Section 17", hours: "1h",
    title: "API Docs: Foundations & Setup",
    titleKh: "មូលដ្ឋានគ្រឹះ API Documentation",
    goal: "Learn the industry standard for documenting REST APIs using OpenAPI and Swagger",
    goalKh: "រៀនពីស្តង់ដារឧស្សាហកម្មសម្រាប់ធ្វើ Documentation ឱ្យ API ជាមួយ Swagger",
    color: "#52e3a0",
    badge: "DOCS",
    topics: [
      {
        en: "The OpenAPI Standard (OAS)",
        kh: "ស្តង់ដារ OpenAPI (OAS)",
        answerEn: "A globally recognized JSON/YAML format used to describe RESTful APIs precisely.",
        answerKh: "ជាទម្រង់ JSON/YAML ដែលគេទទួលស្គាល់ទូទាំងពិភពលោកសម្រាប់ពណ៌នាពី API។"
      },
      {
        en: "Why Document APIs?",
        kh: "ហេតុអ្វីត្រូវធ្វើ Documentation?",
        answerEn: "To allow frontend developers and external partners to use your API without reading your source code.",
        answerKh: "ដើម្បីឱ្យអ្នកដទៃ (Frontend Dev) អាចប្រើ API យើងបានដោយមិនបាច់មើលកូដយយើង។"
      },
      {
        en: "L5-Swagger for Laravel",
        kh: "ការប្រើ L5-Swagger",
        answerEn: "A popular package that bridges Swagger UI with your Laravel controller logic.",
        answerKh: "Package ដែលជួយភ្ជាប់ Swagger UI ជាមួយកូដ Laravel របស់យើង។"
      },
      {
        en: "Base Configuration",
        kh: "ការកំណត់ Configuration",
        answerEn: "Setting up the API title, version, and documentation URL in your app.",
        answerKh: "កំណត់ចំណងជើង API, Version និង URL សម្រាប់មើល Documentation។"
      },
    ],
    explanation: [
      { title: "Universal Language", desc: "OpenAPI មិនមែនសម្រាប់តែ PHP ទេ។ វាជាភាសាដែល App គ្រប់ប្រភេទ (React, Vue, Mobile) យល់ដូចគ្នាទាំងអស់។" },
      { title: "No More PDFs", desc: "កុំផ្ញើ Word ឬ PDF ទៅឱ្យ Frontend Dev ទៀតអី។ ផ្ញើតែ 'Swagger Link' គឺគេមានអ្វីៗគ្រប់យ៉ាងដែលគេត្រូវការ។" },
      { title: "L5-Swagger setup", desc: "យើងតម្លើងវាជាមួយ Composer ហើយវាផ្តល់ Command សម្រាប់ Generate Documentation ពីកូដរបស់យើងភ្លាមៗ។" }
    ],
    lab: {
      title: "Installing the Documentation Engine",
      titleKh: "ការតម្លើងប្រព័ន្ធ Documentation",
      duration: "30 min",
      objective: "Integrate L5-Swagger into your project and prepare the base configuration",
      steps: [
        "Install the package via Composer: composer require darkaonline/l5-swagger",
        "Publish the config files to your project",
        "Open app/Http/Controllers/Controller.php and add the @OA\\Info block",
        "Set the API title to 'My E-Commerce API' and version to '1.0.0'",
        "Run 'php artisan l5-swagger:generate' to build the initial JSON"
      ],
      code: `// Terminal
composer require "darkaonline/l5-swagger"
php artisan vendor:publish --provider "L5Swagger\\L5SwaggerServiceProvider"

// app/Http/Controllers/Controller.php
/**
 * @OA\\Info(
 *    title="Student API Project",
 *    version="1.0.0",
 *    description="Official API Documentation"
 * )
 */
class Controller extends BaseController { ... }`,
      output: `L5-Swagger installed successfully. ✓
JSON file generated at public/docs/api-docs.json ✓`
    },
    concepts: [
      { term: "OAS 3.0", def: "The third major version of the OpenAPI Specification, featuring better support for complex data types." },
      { term: "Vendor Publish", def: "Moving package configuration files into your local project so you can customize them." },
      { term: "@OA\\Info", def: "The mandatory global block that describes the metadata of your entire API." },
    ],
    tip: "Always keep your documentation version (1.0.0) updated as you add major features. It helps other developers track changes easily.",
    project: null,
  },
  {
    id: "m17b", num: "17B", section: "Section 17 (cont.)", hours: "1h",
    title: "Annotating API Endpoints",
    titleKh: "ការសរសេរ Documentation លើ Endpoints",
    goal: "Describe each URL, method, and parameter directly inside your controller code",
    goalKh: "ពណ៌នាពី URL, Method និង Parameter នីមួយៗក្នុង Controller",
    color: "#52e3a0",
    badge: "DOCS",
    topics: [
      {
        en: "Path & Operation Identifiers",
        kh: "ការកំណត់ Path និង Operation",
        answerEn: "Using @OA\\Get or @OA\\Post to link a documentation block to a specific route.",
        answerKh: "ប្រើ @OA\\Get ឬ @OA\\Post ដើម្បីភ្ជាប់ Documentation ទៅកាន់ Route ជាក់លាក់។"
      },
      {
        en: "Grouping with Tags",
        kh: "ការបែងចែកក្រុមជាមួយ Tags",
        answerEn: "Organizing your API into sections like 'Products', 'Orders', and 'Auth' for readability.",
        answerKh: "រៀបចំ API ជាផ្នែកៗដូចជា 'Products' ឬ 'Orders' ដើម្បីងាយស្រួលរក។"
      },
      {
        en: "Query & Path Parameters",
        kh: "ការប្រើ Parameters",
        answerEn: "Documenting required variables like {id} in the URL or ?search= in the query string.",
        answerKh: "ពណ៌នាពីអ្វីដែល API ត្រូវការ ដូចជា ID ក្នុង URL ឬ ពាក្យស្វែងរកក្នុង Query។"
      },
      {
        en: "Success Responses (200 OK)",
        kh: "ការពណ៌នាពីចម្លើយតប (Responses)",
        answerEn: "Defining exactly what data the user will receive when the request is successful.",
        answerKh: "កំណត់ឱ្យច្បាស់ថា តើទិន្នន័យអ្វីខ្លះដែល User នឹងទទួលបានពេល API ដើរត្រឹមត្រូវ។"
      },
    ],
    explanation: [
      { title: "Living Documentation", desc: "យើងសរសេរ Documentation នៅលើ Function តែម្តង។ ពេលកូដប្តូរ Documentation ក៏ប្តូរតាមដែរ (កុំឱ្យវាហួសសម័យ)។" },
      { title: "Input/Output Clarity", desc: "ប្រាប់ឱ្យគេដឹងថា API នេះត្រូវការ parameter អីខ្លះ (ឧទាហរណ៍៖ per_page) ហើយវានឹងតបមកវិញនូវ JSON ទម្រង់បែបណា។" },
      { title: "Tags for UX", desc: "ក្នុង Swagger UI, Tags នឹងបង្កើតជា Folder ស្អាតៗ។ បើអត់ដាក់ Tag ទេ Endpoints ទាំងអស់នឹងនៅគរលើគ្នាពិបាកមើល។" }
    ],
    lab: {
      title: "Documenting GET Endpoints",
      titleKh: "ការធ្វើ Documentation សម្រាប់ Request GET",
      duration: "45 min",
      objective: "Add Swagger annotations to your Product index and show methods",
      steps: [
        "Go to ProductController index() method",
        "Add an @OA\\Get block describing the /api/products path",
        "Include a 'tag' named 'Products'",
        "Define a 200 response with a description 'A list of products'",
        "Regenerate and check the Swagger UI at /api/documentation"
      ],
      code: `/**
 * @OA\\Get(
 *     path="/api/products",
 *     tags={"Products"},
 *     summary="Get all products",
 *     @OA\\Response(
 *         response=200,
 *         description="Successful operation"
 *     )
 * )
 */
public function index() { ... }`,
      output: `New 'Products' section appears in Swagger UI. ✓
Endpoint GET /api/products is now live in docs. ✓`
    },
    concepts: [
      { term: "@OA\\Parameter", def: "Describes a value that the user must or can provide as part of the request." },
      { term: "Summary vs Description", def: "Summary is a short title (e.g., 'List Products'), Description is a longer detail." },
      { term: "OpenAPI Tags", def: "Metadata used to group related operations in tools like Swagger UI." },
    ],
    tip: "Use the 'summary' field wisely. It's the first thing developers read in the documentation list.",
    project: null,
  },
  {
    id: "m17c", num: "17C", section: "Section 17 (cont.)", hours: "1h",
    title: "Advanced Swagger & Auth",
    titleKh: "ការប្រើ Swagger កម្រិតខ្ពស់ និង Auth",
    goal: "Implement interactive testing with Bearer tokens and complex JSON request bodies",
    goalKh: "អនុវត្តការតេស្ត API ជាមួយ Token និងទិន្នន័យ JSON ស្មុគស្មាញ",
    color: "#52e3a0",
    badge: "DOCS",
    topics: [
      {
        en: "JSON Request Bodies",
        kh: "ការប្រើ JSON Request Body",
        answerEn: "Documenting valid schemas for POST/PUT requests so users know what fields to send.",
        answerKh: "ពណ៌នាពី Field នីមួយៗ (ដូចជា name, price) ដែលត្រូវផ្ញើមកកាន់ API។"
      },
      {
        en: "Security Schemes (Bearer Auth)",
        kh: "ការកំណត់ប្រព័ន្ធសុវត្ថិភាព",
        answerEn: "Adding a lock icon to Swagger so developers can paste their Sanctum tokens for testing.",
        answerKh: "បន្ថែមរូបសោរក្នុង Swagger ដើម្បីឱ្យគេអាចដាក់ Token តេស្ត API បាន។"
      },
      {
        en: "Error Responses (401/422)",
        kh: "ការពណ៌នាពី Error Responses",
        answerEn: "Defining how the API behaves during validation failures or unauthorized access.",
        answerKh: "បង្ហាញពីអ្វីដែលនឹងកើតឡើងពេល User បំពេញកូដខុស ឬអត់មានសិទ្ធិចូលមើល។"
      },
      {
        en: "Live 'Try It Out' Feature",
        kh: "មុខងារ 'Try It Out' ផ្ទាល់",
        answerEn: "Allowing users to make real HTTP requests directly from the documentation web page.",
        answerKh: "អនុញ្ញាតឱ្យគេតេស្ត API ពិតៗ ភ្លាមៗនៅលើទំព័រ Documentation តែម្តង។"
      },
    ],
    explanation: [
      { title: "Interactive Documentation", desc: "Swagger មិនមែនគ្រាន់តែជាក្រដាសពណ៌នានោះទេ។ វាជាកម្មវិធីតេស្ត API (ដូច Postman ដែរ) ដែលអ្នកណាក៏អាចប្រើបាន។" },
      { title: "Sanctum Guarded", desc: "យើងកំណត់ SecurityScheme ជា 'bearer'។ ក្នុង Swagger UI នឹងមានប៊ូតុង 'Authorize' សម្រាប់វាយ Token។" },
      { title: "Component Schemas", desc: "កុំសរសេរ Field ដដែលៗច្រើនដង។ បង្កើត Schema ជា Component (ដូចជា Product) ហើយយកវាទៅប្រើឡើងវិញគ្រប់ Endpoints។" }
    ],
    lab: {
      title: "Secure API Testing in Swagger",
      titleKh: "ការតេស្ត API ដែលមានសុវត្ថិភាពក្នុង Swagger",
      duration: "45 min",
      objective: "Document a protected POST route and test it using a real Bearer token",
      steps: [
        "In Controller.php, add the @OA\\SecurityScheme for 'bearerAuth'",
        "In ProductController store(), add 'security={{\"bearerAuth\": {}}}'",
        "Define @OA\\RequestBody and specify required fields (name, price)",
        "Generate docs and open the URL. Notice the lock icon next to the route",
        "Login via your API, copy the token, click 'Authorize' in Swagger, and run the POST test"
      ],
      code: `// Define Security Scheme in Controller.php
/**
 * @OA\\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer"
 * )
 */

// Protect the endpoint
/**
 * @OA\\Post(
 *     path="/api/products",
 *     security={{"bearerAuth": {}}},
 *     ...
 * )
 */`,
      output: `Lock icon appears on POST /api/products. ✓
'Try it out' returns 201 Created with valid token. ✓
'Try it out' returns 401 Unauthorized without token. ✓`
    },
    concepts: [
      { term: "Bearer Authentication", def: "A security standard where the client sends a token in the 'Authorization' header." },
      { term: "RequestBody", def: "The part of the OpenAPI spec that describes the structure of data sent in POST/PUT requests." },
      { term: "Response Status Codes", def: "HTTP numbers (200, 201, 404, 500) that indicate the outcome of an API request." },
    ],
    tip: "Documentation is the bridge between your Backend and the Frontend team. Spending 1 extra minute on clear Swagger notes saves 1 hour of debugging meetings later.",
    project: "Mini-Project 2: Complete REST API with Sanctum auth, Resources, and Swagger documentation.",
  },
  {
    id: "m18", num: "18", section: "Section 18", hours: "1h",
    title: "Automated Testing Foundations",
    titleKh: "មូលដ្ឋានគ្រឹះនៃការតេស្តស្វ័យប្រវត្តិ",
    goal: "Understand the testing mindset and set up the Pest environment for total code confidence",
    goalKh: "យល់ដឹងពីការគិតបែប Testing និងរៀបចំប្រព័ន្ធ Pest សម្រាប់ទំនុកចិត្តលើកូដ",
    color: "#38c9c9",
    badge: "TESTING",
    topics: [
      {
        en: "Unit vs Feature Testing",
        kh: "Unit vs Feature Testing",
        answerEn: "Unit tests focus on single methods/logic, while Feature tests simulate real user HTTP requests.",
        answerKh: "Unit tests ផ្ដោតលើកូដតូចៗ (Function) ចំណែក Feature tests ធ្វើតេស្តលើ Route និង Request ពិតៗ។"
      },
      {
        en: "Why Pest PHP?",
        kh: "ហេតុអ្វីជ្រើសរើស Pest PHP?",
        answerEn: "A modern, expressive testing framework built on top of PHPUnit that reads like a story.",
        answerKh: "ជា Tool សម្រាប់តេស្តដ៏ទំនើប និងងាយស្រួលសរសេរ (Syntax ស្អាត) ដែលបន្តវេនពី PHPUnit។"
      },
      {
        en: "The Testing Environment",
        kh: "ប្រព័ន្ធដំនើរការ Testing",
        answerEn: "Using phpunit.xml to configure an isolated database (often SQLite :memory:) for fast tests.",
        answerKh: "ប្រើប្រាស់ config ដាច់ដោយឡែក (តែងតែប្រើ SQLite ក្នុង Memory) ដើម្បីតេស្តឱ្យលឿនបំផុត។"
      },
      {
        en: "Test-Driven Mindset",
        kh: "ការគិតបែប Test-Driven",
        answerEn: "Writing tests to protect your application from 'Regression' (breaking old things with new code).",
        answerKh: "សរសេរ Test ដើម្បីការពារកុំឱ្យកូដថ្មី ទៅធ្វើឱ្យខូចកូដចាស់ (Regression)។"
      },
    ],
    explanation: [
      { title: "Sleep Better", desc: "កូដដែលមាន Test ត្រឹមត្រូវ ជួយឱ្យអ្នកលែងបារម្ភពេលកែអ្វីមួយធំៗ (Refactoring) ព្រោះវាប្រាប់យើងភ្លាមបើមានបញ្ហា។" },
      { title: "Pest Syntax", desc: "Pest ប្រើ function 'it()' ឬ 'test()' ដែលធ្វើឱ្យកូដតេស្តរបស់អ្នកមើលទៅដូចជាការពណ៌នាពី App (ដូចជា 'it has a homepage')។" },
      { title: "Database Isolation", desc: "រាល់ពេលតេស្តចប់ Laravel នឹងសម្អាតទិន្នន័យចោលទាំងអស់ (RefreshDatabase) ដើម្បីកុំឱ្យប៉ះពាល់ដល់ការតេស្តក្រោយៗទៀត។" }
    ],
    lab: {
      title: "Running the Pest Test Runner",
      titleKh: "ការដំនើរការប្រព័ន្ធតេស្ត Pest",
      duration: "30 min",
      objective: "Explore the pre-installed Pest environment and run your first set of green tests",
      steps: [
        "In Laravel 11/12+, Pest is installed by default. Open the 'tests' directory",
        "Open Feature/ExampleTest.php to see the syntax using it()",
        "Run the command: php artisan test",
        "Observe the output showing 'PASS' in green",
        "Change the expected status code from 200 to 404 and run again to see a 'FAIL'"
      ],
      code: `// tests/Feature/ExampleTest.php
it('returns a successful response', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
});

// Terminal
php artisan test
// or
./vendor/bin/pest`,
      output: `PASS  Tests\\Feature\\ExampleTest
✓ returns a successful response (0.05s)

Tests:  1 passed (1 assertions)
Duration: 0.12s ✓`
    },
    concepts: [
      { term: "Assertion", def: "A statement that checks if a condition is true (e.g., 'Assert result is 200'). If not true, the test fails." },
      { term: "Regression", def: "A bug that appears in functionality that used to work perfectly after a new change is made." },
      { term: "Isolated Testing", def: "Ensuring that one test does not rely on or affect the data of another test." },
    ],
    tip: "Use 'php artisan test --parallel' in larger projects to run your tests across multiple CPU cores for massive speed gains.",
    project: null,
  },
  {
    id: "m18b", num: "18B", section: "Section 18 (cont.)", hours: "1h",
    title: "Feature Testing with Pest",
    titleKh: "ការធ្វើ Feature Testing ជាមួយ Pest",
    goal: "Write end-to-end tests for your API endpoints and database logic",
    goalKh: "សរសេរ Test ពេញលេញសម្រាប់ API និងប្រព័ន្ធ Database",
    color: "#38c9c9",
    badge: "TESTING",
    topics: [
      {
        en: "Simulating HTTP Requests",
        kh: "ការផ្ញើ HTTP Request តេស្ត",
        answerEn: "Using methods like $this->get(), post(), and put() to visit your application routes.",
        answerKh: "ប្រើប្រាស់ $this->get(), post() ដើម្បីសាកល្បងចូលទៅកាន់ Route ក្នុង App របស់អ្នក។"
      },
      {
        en: "Model Factories in Tests",
        kh: "ការប្រើ Factories ក្នុងតេស្ត",
        answerEn: "Using Product::factory()->create() to instantly populate your testing database with fake data.",
        answerKh: "ប្រើប្រាស់ Factories ដើម្បីបង្កើតទិន្នន័យគំរូដាក់ក្នុង Database ពេលកំពុងតេស្ត។"
      },
      {
        en: "JSON Assertions",
        kh: "ការពិនិត្យ HTML/JSON Response",
        answerEn: "Verifying that the API returns the correct data structure, like 'assertJsonPath()'.",
        answerKh: "ពិនិត្យមើលថា API ផ្ដល់ទិន្នន័យ (JSON) ត្រឹមត្រូវតាមទម្រង់ដែលយើងចង់បាន។"
      },
      {
        en: "RefreshDatabase Trait",
        kh: "មុខងារ RefreshDatabase",
        answerEn: "Ensuring each test starts with a clean database state by running migrations automatically.",
        answerKh: "ធានាថាការតេស្តនីមួយៗចាប់ផ្ដើមដោយភាពស្អាតស្អំ (គ្មានទិន្នន័យសល់ពីមុន)។"
      },
    ],
    explanation: [
      { title: "Real-world Simulation", desc: "យើងមិនគ្រាន់តែតេស្ត Function ទេ។ យើងតេស្ត 'ផ្លូវដើរ' របស់ Request ចាប់ពី Route, Middleware, Controller រហូតដល់ DB។" },
      { title: "Fluent Assertions", desc: "Laravel ផ្ដល់ method ច្រើនដូចជា assertOk(), assertCreated(), assertJsonCount() ដែលងាយស្រួលអាន។" },
      { title: "Factory Magic", desc: "កុំបង្កើត Data ដោយដៃក្នុងតេស្ត។ ប្រើ Factory ដើម្បីបង្កើតទិន្នន័យ ១០ ឬ ១០០ ក្នុងពេលត្រឹមតែ ១វិនាទី។" }
    ],
    lab: {
      title: "Testing the Product CRUD API",
      titleKh: "ការតេស្តប្រព័ន្ធ Product API",
      duration: "45 min",
      objective: "Write a feature test that creates a product and verifies it exists in the database",
      steps: [
        "Create a new test file: php artisan make:test ProductTest --pest",
        "Add 'use RefreshDatabase' at the top of your test file",
        "Inside a test('can create product') block, use $this->postJson()",
        "Assert that the response status is 201 (Created)",
        "Use $this->assertDatabaseHas('products', [...]) to verify DB storage",
        "Run the test and watch it pass"
      ],
      code: `// tests/Feature/ProductTest.php
use App\\Models\\Product;
use Illuminate\\Foundation\\Testing\\RefreshDatabase;

uses(RefreshDatabase::class);

it('can store a new product', function () {
    $data = [
        'name' => 'Testing Phone',
        'price' => 500
    ];

    $response = $this->postJson('/api/products', $data);

    $response->assertStatus(201);
    $this->assertDatabaseHas('products', ['name' => 'Testing Phone']);
});`,
      output: `PASS  Tests\\Feature\\ProductTest
✓ can store a new product (0.15s)

Total: 1 passed, 0 failed ✓`
    },
    concepts: [
      { term: "postJson()", def: "A helper that sends a POST request with 'application/json' headers automatically." },
      { term: "assertDatabaseHas", def: "A validation step that checks if a table contains a row that matches specific criteria." },
      { term: "Stateful Testing", def: "Tests that involve persistent data changes, like adding or deleting users." },
    ],
    tip: "Always test your validation rules too! Write a test that sends empty data and assert that you get a 422 Unprocessable Content error.",
    project: null,
  },
  {
    id: "m18c", num: "18C", section: "Section 18 (cont.)", hours: "1h",
    title: "Secure Testing & Mocking",
    titleKh: "ការតេស្តប្រព័ន្ធសុវត្ថិភាព និង Mocking",
    goal: "Handle authenticated routes and mock external services for isolated testing",
    goalKh: "តេស្ត Route ដែលមាន Login និងដោះស្រាយសេវាកម្មក្រៅ (Mocking)",
    color: "#38c9c9",
    badge: "TESTING",
    topics: [
      {
        en: "Testing Protected Routes",
        kh: "តេស្ត Route ដែលមាន Middleware",
        answerEn: "Using actingAs($user) to simulate a logged-in user session for your tests.",
        answerKh: "ប្រើប្រាស់ actingAs($user) ដើម្បីសន្មតថាមាន User កំពុង Login ចូលប្រើប្រាស់។"
      },
      {
        en: "Policy & Permission Testing",
        kh: "ការតេស្តសិទ្ធិ (Policies)",
        answerEn: "Verifying that User A cannot edit or delete data belonging to User B (403 Forbidden).",
        answerKh: "ពិនិត្យមើលថា User ម្នាក់មិនអាចទៅកែ ឬលុបទិន្នន័យរបស់ User ម្នាក់ទៀតបានឡើយ។"
      },
      {
        en: "What is Mocking?",
        kh: "តើអ្វីទៅជា Mocking?",
        answerEn: "Replacing slow or external dependencies (like Emails or APIs) with 'fake' versions during testing.",
        answerKh: "ការជំនួសសេវាកម្មដែលយឺត ឬសេវាកម្មខាងក្រៅ (ដូចជាការផ្ញើ Email) ជាមួយរបស់ក្លែងក្លាយពេលតេស្ត។"
      },
      {
        en: "Mail/Queue Fakes",
        kh: "ការប្រើ Mail/Queue Fakes",
        answerEn: "Using Mail::fake() to assert that an email WAS sent without actually sending it.",
        answerKh: "ប្រើ Mail::fake() ដើម្បីបញ្ជាក់ថា Email ត្រូវបានផ្ញើចេញ ដោយមិនបាច់ផ្ញើទៅមែនទែន។"
      },
    ],
    explanation: [
      { title: "Simulating Users", desc: "actingAs() ជួយឱ្យយើងតេស្ត API ដែលការពារដោយ Sanctum បានយ៉ាងងាយស្រួលបំផុត។" },
      { title: "Testing Forbidden", desc: "តេស្តដែលល្អ ត្រូវតែតេស្ត 'រឿងដែលមិនគួរកើតឡើង' ផងដែរ (ឧទាហរណ៍៖ User ធម្មតា លុបទិន្នន័យ Admin មិនបាន)។" },
      { title: "Speed of Fakes", desc: "ការផ្ញើ Email ពិតប្រាកដក្នុងតេស្ត ១០០ដង នឹងយឺតខ្លាំង។ ការប្រើ 'Fake' ជួយឱ្យតេស្តដើរលឿនដូចផ្លេកបន្ទោរ។" }
    ],
    lab: {
      title: "Testing Protected Logic",
      titleKh: "ការតេស្ត Logic ដែលមានការការពារ",
      duration: "45 min",
      objective: "Verify that only the creator of a product can update it, using authentication",
      steps: [
        "Create two users using factories: $user1 and $user2",
        "Create a product belonging to $user1",
        "Try to update the product while logged in as $user2 (expect 403 Forbidden)",
        "Try to update the product while logged in as $user1 (expect 200/Redirect)",
        "Check that the email notification was triggered using Mail::fake()"
      ],
      code: `it('forbids updating others products', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $product = Product::factory()->create(['user_id' => $user1->id]);

    $this->actingAs($user2)
         ->patchJson("/api/products/{$product->id}", ['name' => 'Hacked'])
         ->assertStatus(403);
});

it('allows updating own products', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
         ->patchJson("/api/products/{$product->id}", ['name' => 'Valid Update'])
         ->assertOk();
});`,
      output: `✓ forbids updating others products (0.21s)
✓ allows updating own products (0.18s)

Professional coverage for Authorization detected. ✓`
    },
    concepts: [
      { term: "actingAs()", def: "Sets the currently authenticated user for the duration of the test request." },
      { term: "403 Forbidden", def: "The HTTP status code meaning the user is authenticated but does not have permission for the action." },
      { term: "Dependency Mocking", def: "Decoupling your tests from external systems like payment gateways or mail servers." },
    ],
    tip: "Testing is not about finding bugs today, it's about making sure your application works perfectly tomorrow and for many months to come.",
    project: null,
  },

  {
    id: "m19", num: "19", section: "Section 19", hours: "1h",
    title: "Performance: The Caching Layer",
    titleKh: "ការបង្កើនល្បឿនជាមួយ Caching",
    goal: "Master Laravel's built-in optimization tools to make your application lightning fast",
    goalKh: "រៀនពីបច្ចេកទេសបង្កើនល្បឿន App ឱ្យដើរលឿនដូចផ្លេកបន្ទោរ",
    color: "#f5c842",
    badge: "DEVOPS",
    topics: [
      {
        en: "The Bootstrap Bottleneck",
        kh: "បញ្ហាល្បឿនពេល App ចាប់ផ្ដើម",
        answerEn: "Every request Laravel parses many files; caching converts them into a single fast-loading file.",
        answerKh: "រាល់ពេលមានអ្នកចូលមើល Laravel ត្រូវអាន File ច្រើន។ Caching ជួយបង្រួមវាឱ្យនៅកន្លែងតែមួយដើម្បីឱ្យលឿន។"
      },
      {
        en: "Config & Route Caching",
        kh: "ការធ្វើ Cache កូដ Config និង Route",
        answerEn: "Using php artisan optimize to store configuration and URLs in the server's memory.",
        answerKh: "ប្រើប្រាស់ 'php artisan optimize' ដើម្បីរក្សាទុកមុខងារ App ក្នុង Memory របស់ Server។"
      },
      {
        en: "Blade View Pre-compilation",
        kh: "ការចម្អិន Blade View ទុកជាមុន",
        answerEn: "Rendering Blade templates into plain PHP files ahead of time so the user doesn't wait.",
        answerKh: "បម្លែង Blade ឱ្យទៅជា PHP File ធម្មតាទុកជាមុន ដើម្បីកុំឱ្យ User រង់ចាំយូរ។"
      },
      {
        en: "Optimization Commands",
        kh: "ពាក្យបញ្ជាសម្រាប់ Optimization",
        answerEn: "Mastering 'php artisan optimize:clear' and 'optimize' for production workflows.",
        answerKh: "ប្រើប្រាស់ command ដើម្បីសម្អាត និងបង្កើត Cache ថ្មីសម្រាប់ Production។"
      },
    ],
    explanation: [
      { title: "Production Mode", desc: "ក្នុងដំណាក់កាលអភិវឌ្ឍន៍ យើងមិនធ្វើ Cache ទេ ព្រោះយើងប្តូរកូដរហូត។ តែលើ Production វាជារឿងខ្វះមិនបាន។" },
      { title: "One File to Rule Them", desc: "Laravel នឹងអាន Config រាប់សិប Files រួចបង្រួមមកត្រឹម 'bootstrap/cache/config.php' ក្នុងពេលត្រឹមតែ ០.០០១ វិនាទី។" },
      { title: "Route Speed", desc: "បើ App មាន Route ច្រើន (រាប់រយ) ការធ្វើ Cache នឹងជួយឱ្យ App រកឃើញ Route ត្រូវលឿនជាងមុន ៥ ដង។" }
    ],
    lab: {
      title: "The Optimization Checklist",
      titleKh: "ការអនុវត្ត Optimization",
      duration: "30 min",
      objective: "Prepare your application for high traffic by caching all static assets",
      steps: [
        "Open your terminal and run 'php artisan config:cache'",
        "Check bootstrap/cache directory to see generated files",
        "Run 'php artisan route:cache' and notice the speed increase in requests",
        "Run 'php artisan view:cache' to pre-compile all Blade templates",
        "Finally, run 'php artisan optimize' to combine all the above"
      ],
      code: `// Terminal Commands
php artisan config:cache
php artisan route:cache
php artisan view:cache

// The "Master" Command
php artisan optimize

// To Clear everything (during development)
php artisan optimize:clear`,
      output: `Configuration cached successfully! ✓
Routes cached successfully! ✓
Blade views cached successfully! ✓
Application optimized. ✓`
    },
    concepts: [
      { term: "I/O Overhead", def: "The time spent by the computer reading files from the hard drive instead of memory." },
      { term: "Pre-parsing", def: "Processing code once and saving the result so it doesn't need to be processed again on every request." },
      { term: "Static Cache", def: "Caches that don't change until the next time you deploy your code." },
    ],
    tip: "Never run 'php artisan optimize' on your local computer while coding! You will wonder why your .env changes aren't working.",
    project: null,
  },
  {
    id: "m19b", num: "19B", section: "Section 19 (cont.)", hours: "1h",
    title: "Data Caching with Redis",
    titleKh: "ការធ្វើ Cache ទិន្នន័យជាមួយ Redis",
    goal: "Reduce database load by storing expensive query results in high-speed storage",
    goalKh: "កាត់បន្ថយការងារ Database ដោយរក្សាទុកទិន្នន័យក្នុង Storage ល្បឿនលឿន",
    color: "#f5c842",
    badge: "DEVOPS",
    topics: [
      {
        en: "Why DB is a Bottleneck",
        kh: "មូលហេតុដែល Database ដើរយឺត",
        answerEn: "Databases read from disks; Caching stores result in RAM which is 100x faster.",
        answerKh: "Database អានទិន្នន័យពី Disk ចំណែក Caching រក្សាទុកក្នុង RAM ដែលលឿនជាង ១០០ដង។"
      },
      {
        en: "Cache Aside Pattern",
        kh: "ទម្រង់ Cache Aside",
        answerEn: "Check if data exists in cache; if not, get from DB and save to cache for next time.",
        answerKh: "ឆែកមើលក្នុង Cache បើអត់មានទើបទៅយកពី DB ហើយយកមកទុកក្នុង Cache វិញ។"
      },
      {
        en: "Using Cache::remember()",
        kh: "ការប្រើប្រាស់ Cache::remember()",
        answerEn: "A fluent method to wrap your query with a timeout (TTL) automatically.",
        answerKh: "វិធីសាស្ត្រងាយៗដើម្បីគ្រប់គ្រងការរក្សាទិន្នន័យរហូតដល់ផុតកំណត់។"
      },
      {
        en: "Cache Invalidation",
        kh: "ការសម្អាតទិន្នន័យ Cache ចាស់",
        answerEn: "Using Cache::forget() or Flush to clear old data when it becomes stale.",
        answerKh: "ប្រើប្រាស់ Cache::forget() ដើម្បីលុបទិន្នន័យចាស់ចោលពេលយើងប្តូរព័ត៌មានថ្មីក្នុង DB។"
      },
    ],
    explanation: [
      { title: "RAM vs DISK", desc: "RAM ដូចជាតុដែលយើងកំពុងធ្វើការ (ជិតដៃ) ចំណែក DISK ដូចជាទូដាក់ឯកសារនៅបន្ទប់ផ្សេង (ឆ្ងាយ)។" },
      { title: "Cache Expiry", desc: "យើងអាចកំណត់បានថាចង់ឱ្យ Cache នេះនៅបានយូរប៉ុណ្ណា (ឧទាហរណ៍៖ ៦០ នាទី)។" },
      { title: "Redis Engine", desc: "Redis គឺជា Storage ពិសេសក្នុង RAM ដែល Laravel ពេញចិត្តបំផុតសម្រាប់ការធ្វើ Cache កម្រិតខ្ពស់។" }
    ],
    lab: {
      title: "Caching a Product List",
      titleKh: "ការធ្វើ Cache ឱ្យបញ្ជីផលិតផល",
      duration: "45 min",
      objective: "Implement data caching for a high-traffic endpoint to avoid 100+ DB queries",
      steps: [
        "In your ProductController, find the index() method",
        "Wrap the Product::all() call in a Cache::remember block",
        "Set the time to 3600 seconds (1 hour)",
        "Refresh your page and check the Laravel Debugbar timing",
        "Notice the 2nd request finishes in 10-20ms instead of 200ms"
      ],
      code: `use Illuminate\\Support\\Facades\\Cache;

public function index()
{
    $products = Cache::remember('all_products', 3600, function () {
        return Product::with('category')->get();
    });

    return view('products.index', compact('products'));
}

// Clearing cache when product is added
public function store(Request $request) {
    Product::create($request->all());
    Cache::forget('all_products'); // Clear old data!
}`,
      output: `1st request: 240ms (Database involved)
2nd request: 12ms (From Cache) ✓
Speed boost: 20x faster! ✓`
    },
    concepts: [
      { term: "TTL (Time To Live)", def: "How long a piece of data stays in the cache before it is automatically deleted." },
      { term: "Cache Hit / Miss", def: "A 'Hit' is when data is found in cache. A 'Miss' is when we have to go to the Database." },
      { term: "Redis", def: "An open-source, in-memory data structure store, used as a database, cache, and message broker." },
    ],
    tip: "Only cache data that is read often but changed rarely. Caching things that change every second (like a clock) will slow you down.",
    project: null,
  },
  {
    id: "m19c", num: "19C", section: "Section 19 (cont.)", hours: "1h",
    title: "Deployment & Live Production",
    titleKh: "ការដាក់ឱ្យប្រើប្រាស់ និងប្រព័ន្ធ Production",
    goal: "Ship your application to the internet safely using professional CI/CD pipelines",
    goalKh: "បញ្ជូន App ទៅកាន់បណ្ដាញអ៊ីនធឺណិតដោយសុវត្ថិភាពខ្ពស់",
    color: "#f5c842",
    badge: "DEVOPS",
    topics: [
      {
        en: "The .env Production Safety",
        kh: "សុវត្ថិភាព File .env លើ Production",
        answerEn: "Setting APP_DEBUG=false is critical to hide sensitive error details from hackers.",
        answerKh: "ត្រូវតែបិទ APP_DEBUG=false ដើម្បីកុំឱ្យ Hacker ឃើញព័ត៌មានសំខាន់ៗពេល App មាន Error។"
      },
      {
        en: "SSL & Trusted Proxies",
        kh: "ប្រព័ន្ធ SSL និងសុវត្ថិភាព URL",
        answerEn: "Configuring HTTPS (SSL) to encrypt data between the user and your server.",
        answerKh: "កំណត់ឱ្យ App ប្រើប្រាស់ https:// ដើម្បីការពារការលួចមើលទិន្នន័យតាមផ្លូវ។"
      },
      {
        en: "CI/CD with GitHub Actions",
        kh: "ស្វ័យប្រវត្តិកម្ម CI/CD",
        answerEn: "Defining a script that tests and deploys your code automatically every time you push.",
        answerKh: "បង្កើតកូដដែលជួយតេស្ត និងដាក់ App ឱ្យដើរស្វ័យប្រវត្តិ ពេលយើង Push កូដចូល GitHub។"
      },
      {
        en: "Server Monitoring (Logs)",
        kh: "ការតាមដានសុខភាព Server",
        answerEn: "Checking storage/logs/laravel.log to debug issues that only happen in production.",
        answerKh: "ឆែកមើល Log ដើម្បីដឹងពីបញ្ហាដែលកែតឡើងលើ Server ពិតៗ។"
      },
    ],
    explanation: [
      { title: "No More FTP", desc: "កុំប្រើ FileZilla ឬ FTP ទៀត។ យើងប្រើ Git និង CI/CD ដើម្បីបញ្ជូនកូដបានលឿន និងច្បាស់លាស់។" },
      { title: "Railway & VPS", desc: "Railway គឺងាយស្រួលបំផុតសម្រាប់អ្នកចាប់ផ្ដើម។ VPS (DigitalOcean) គឺសម្រាប់អ្នកចង់គ្រប់គ្រង Server ខ្លួនឯង។" },
      { title: "Zero-Downtime", desc: "បច្ចេកទេសដែលធ្វើឱ្យ App យើងនៅតែដើររហូត ទោះបីជាយើងកំពុង Update កូដថ្មីក៏ដោយ។" }
    ],
    lab: {
      title: "Zero-Downtime Deployment Prep",
      titleKh: "ការត្រៀមរៀបចំ Deploy App",
      duration: "45 min",
      objective: "Configure your production environment and prepare a GitHub Action workflow",
      steps: [
        "Create .github/workflows/deploy.yml in your project",
        "Set up your environment variables for Production (APP_KEY, DB_HOST)",
        "Configure 'TrustedProxies' for secure URL generation",
        "Generate a strong Production password for your Database",
        "Link your GitHub repo to a hosting provider (like Railway or Forge)"
      ],
      code: `# .github/workflows/main.yml
name: Deploy
on: [push]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install dependencies
        run: composer install --no-dev
      - name: Run Tests
        run: php artisan test
      - name: Deploy to Server
        run: echo "Deploying to live environment..."`,
      output: `Tests: 12 passed ✓
Build: Success ✓
Deployment: Uploaded to live environment ✓`
    },
    concepts: [
      { term: "CI/CD", def: "Continuous Integration & Continuous Deployment. Automating the testing and shipping of code." },
      { term: "SSH Key", def: "A secure way to log into your server without using a password." },
      { term: "Env Encryption", def: "Encrypting your .env file so it can be safely stored in GitHub." },
    ],
    tip: "Always run 'php artisan migrate --force' in production to skip the 'Do you really want to run this command?' confirmation.",
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
      { en: "Full system architecture — all 19 sections combined", kh: "System Architecture ពេញលេញ — Section ទាំង 19 រួមបញ្ចូលគ្នា", answerEn: "Design the end-to-end flow of a complete web application from database to deployment.", answerKh: "រចនាលំហូរការងារទាំងមូលនៃ web application តាំងពី database រហូតដល់ការដាក់ឱ្យប្រើប្រាស់។" },
      { en: "Order management — cart, checkout, order history", kh: "Order Management — Cart, Checkout, Order History", answerEn: "Implement complex logic handling products, orders, and user shopping experiences.", answerKh: "បង្កើត logic ដែលសាំញ៉ាំក្នុងការពាក់ព័ន្ធជាមួយផលិតផល ការបញ្ជាទិញ និងបទពិសោធន៍ទិញទំនិញ។" },
      { en: "Admin dashboard — sales, inventory, analytics", kh: "Admin Dashboard — Sales, Inventory, Analytics", answerEn: "Build powerful interfaces for business owners to monitor and manage their application.", answerKh: "បង្កើត interface សម្រាប់ម្ចាស់អាជីវកម្មដើម្បីតាមដាន និងគ្រប់គ្រង application របស់ពួកគេ។" },
      { en: "Project presentation & code review", kh: "Project Presentation & Code Review", answerEn: "Demonstrate your completed application and receive feedback on your architecture.", answerKh: "បង្ហាញកម្មវិធីដែលអ្នកបានបញ្ចប់ និងទទួលមតិយោបល់លើស្ថាបត្យកម្មកូដរបស់អ្នក។" },
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
    <div className="mobile-padding" style={{ maxWidth: 1120, margin: "0 auto" }}>
      {/* Hero */}
      <div className="anim-up" style={{ marginBottom: 56 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 20 }}>
          <div style={{ width: 32, height: 2, background: "var(--red)" }} />
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700, color: "var(--red)", letterSpacing: "0.14em" }}>UNIVERSITY CURRICULUM · BACKEND DEVELOPMENT</span>
        </div>

        <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 48, alignItems: "start" }}>
          <div>
            <h1 className="hero-title" style={{ fontFamily: "var(--serif)", fontSize: "clamp(40px,6vw,72px)", fontWeight: 900, lineHeight: 0.95, marginBottom: 20, letterSpacing: "-0.02em" }}>
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
          <div style={{ width: "min(320px, 100%)", border: "1px solid var(--border-strong)", padding: 24, background: "var(--surface)", borderRadius: 4, flexShrink: 0 }}>
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
        <div className="module-nav" style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", gap: 0, height: 50 }}>
          <div className="module-nav-top" style={{ flex: 1, display: "flex", alignItems: "center" }}>
            <button onClick={onBack} style={{ padding: "0 16px", height: "100%", border: "none", borderRight: "1px solid var(--border)", background: "transparent", color: "var(--ink-dim)", fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer" }}>
              ← ALL
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 20px", flex: 1, minWidth: 0 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: m.color, flexShrink: 0 }} />
              <div style={{ overflow: "hidden" }}>
                <div className="hide-mobile" style={{ fontFamily: "var(--mono)", fontSize: 9, color: m.color, letterSpacing: "0.1em" }}>MODULE {m.num} · {m.section} · {m.hours}</div>
                <div style={{ fontFamily: "var(--serif)", fontSize: 14, fontWeight: 700, color: "var(--ink)", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.title}</div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
            {/* Tabs */}
            <div className="module-tabs" style={{ display: "flex", height: "100%", borderLeft: "1px solid var(--border)" }}>
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
              <span className="hide-mobile" style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-faint)", display: "flex", alignItems: "center", padding: "0 4px" }}>{currentIndex + 1}/{MODULES.length}</span>
              <button onClick={onNext} disabled={!canNext} style={{ padding: "0 14px", height: "100%", border: "none", background: "transparent", color: canNext ? "var(--ink-dim)" : "var(--border)", fontFamily: "var(--mono)", fontSize: 12, cursor: canNext ? "pointer" : "not-allowed" }}>›</button>
            </div>
          </div>
        </div>
        {/* Progress */}
        <div style={{ height: 2, background: "var(--border)" }}>
          <div style={{ height: "100%", width: `${((currentIndex + 1) / MODULES.length) * 100}%`, background: m.color, transition: "width 0.4s ease" }} />
        </div>
      </div>

      {/* Content */}
      <div className="mobile-padding" style={{ maxWidth: 1120, margin: "0 auto" }}>

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div className="anim-up">
            {/* Goal */}
            <div style={{ borderLeft: `3px solid ${m.color}`, paddingLeft: 20, marginBottom: 40 }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, fontWeight: 700, color: m.color, letterSpacing: "0.12em", marginBottom: 8 }}>LEARNING GOAL</div>
              <div style={{ fontFamily: "var(--serif)", fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 700, color: "var(--ink)", lineHeight: 1.3, marginBottom: 8 }}>{m.goal}</div>
              <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-dim)", lineHeight: 1.6 }}>{m.goalKh}</div>
            </div>

            <div className="mobile-stack">
              {/* Topics */}
              <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-faint)", letterSpacing: "0.1em", marginBottom: 14 }}>TOPICS COVERED ({m.topics.length})</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {m.topics.map((t, i) => (
                    <div key={i} style={{ padding: "14px 16px", background: "var(--surface)", border: "1px solid var(--border)", borderLeft: `3px solid ${m.color}`, borderRadius: 2 }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <div>
                          <div style={{ fontFamily: "var(--mono)", fontSize: 13, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>{t.en}</div>
                          <div style={{ fontFamily: "var(--sans)", fontSize: 11, color: "var(--ink-faint)" }}>{t.kh}</div>
                        </div>
                        <div style={{ padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 4, borderLeft: "2px solid rgba(255,255,255,0.1)" }}>
                          <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-dim)", marginBottom: 4, lineHeight: 1.5 }}>{t.answerEn}</div>
                          <div style={{ fontFamily: "var(--sans)", fontSize: 10, color: "var(--ink-faint)", lineHeight: 1.5 }}>{t.answerKh}</div>
                        </div>
                      </div>
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

            <div className="mobile-stack" style={{ gap: 12, marginBottom: 28 }}>
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
                <div className="mobile-stack" style={{ gap: 12 }}>
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
            <div className="hide-mobile">
              <span style={{ fontFamily: "var(--serif)", fontSize: 15, fontWeight: 700, color: "var(--ink)", fontStyle: "italic" }}>Laravel</span>
              <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-faint)", marginLeft: 8 }}>University Edition</span>
            </div>
            <div className="hide-desktop" style={{ display: "none" }}>
              {/* This style will be overridden by global css classes if I added them, but I'll use inline media query logic or just simple hiding */}
              <span style={{ fontFamily: "var(--serif)", fontSize: 15, fontWeight: 700, color: "var(--ink)", fontStyle: "italic" }}>Laravel</span>
            </div>
          </div>

          {/* Center info */}
          <div className="hide-mobile" style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-faint)", textAlign: "center" }}>
            {m ? (
              <span><span style={{ color: m.color }}>{m.badge}</span> · Module {m.num} of {MODULES.length}</span>
            ) : (
              <span>23 Sections · 34 Hours · Laravel 12 · PHP 8.2+</span>
            )}
          </div>

          {/* Keyboard hint */}
          <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-faint)", display: "flex", gap: 6, alignItems: "center" }}>
            {m && <span className="hide-mobile">← → navigate · ESC back</span>}
            {!m && <span className="hide-mobile">Click any module to begin</span>}
            {m && <button onClick={back} className="hide-desktop" style={{ display: "none", background: "var(--surface)", border: "1px solid var(--border)", padding: "2px 8px", borderRadius: 2, color: "var(--ink)" }}>CLOSE</button>}
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