'use client'


import { useState, useCallback, useEffect } from "react";
import {
  Rocket, Terminal, Box, Layers, Globe, Database,
  Cpu, Layout, Shield, Lock, Zap, Server,
  Code2, FileJson, LucideIcon, Trophy, Hammer,
  ChevronRight, ArrowLeft, ArrowRight,
  ClipboardList, Milestone, Settings, Users,
  Folder, FolderOpen, FileText, ChevronDown, CheckCircle2,
  HelpCircle, MoveRight, Monitor
} from "lucide-react";

// ─── GLOBAL STYLES ────────────────────────────────────────────
const G = (theme: 'dark' | 'light') => `
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Serif+Display:ital@0;1&family=Noto+Sans+Khmer:wght@400;700;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --ink: ${theme === 'dark' ? '#ffffff' : '#000000'};
  --paper: ${theme === 'dark' ? '#0d0d0d' : '#ffffff'};
  --card: ${theme === 'dark' ? '#161616' : '#f9f9f9'};
  --red:#f43f5e;
  --red-dim:rgba(244,63,94,0.1);
  --green:#4ade80;
  --blue:#38bdf8;
  --amber:#fb923c;
  --purple:#a78bfa;
  --pink:#f472b6;
  --teal:#2dd4bf;
  --rule: ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
  --ghost: ${theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
  --mono:'Space Mono',monospace;
  --serif:'DM Serif Display',serif;
  --sans:'Noto Sans Khmer',sans-serif;
}
body{background:var(--paper);color:var(--ink);font-family:var(--sans);-webkit-font-smoothing:antialiased;}
::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-thumb{background:var(--rule);border-radius:2px;}
button{cursor:pointer;font-family:var(--sans);}

@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes slideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}

.module-card:hover .arrow{transform:translateX(4px);}
.tab-btn:hover{background:var(--ghost)!important;}
`;

// ─── DATA ──────────────────────────────────────────────────────
interface Concept {
  term: string;
  def: string;
}

interface Topic {
  title: string;
  desc: string;
}

interface Lab {
  title: string;
  steps: string[];
  code: string;
  output?: string;
  cmd?: string;
}

interface Module {
  id: string;
  week: string;
  num: string;
  title: string;
  goal: string;
  stripe: string;
  icon: LucideIcon;
  topics: Topic[];
  lab: Lab;
  tip: string;
  concepts: Concept[];
  optional?: boolean;
}

interface GradingItem {
  label: string;
  pct: number;
  stripe: string;
  desc: string;
  icon: LucideIcon;
}

const MODULES: Module[] = [
  {
    id: "m01", week: "Week 1", num: "01",
    title: "Introduction to Laravel",
    goal: "Learn the core ideas behind the Laravel framework — ស្វែងយល់ពីគំនិតចម្បង និងគោលការណ៍នៃ Laravel Framework",
    stripe: "var(--red)",
    icon: Rocket,
    topics: [
      { title: "📦 What is Laravel? (MVC framework)", desc: "The structure and design philosophy of a modern PHP framework." },
      { title: "⚖️ Why use Laravel instead of plain PHP", desc: "Better security, faster development, and a smoother developer experience." },
      { title: "📁 Laravel folder structure overview", desc: "Where to find routes, controllers, models, and view files." },
      { title: "🔄 How an HTTP request travels through Laravel", desc: "Tracing a request from public/index.php all the way to the response." }
    ],
    lab: {
      title: "Your First Laravel Project",
      steps: ["Install PHP 8.2+ and Composer", "Run: composer create-project laravel/laravel blog", "Run: php artisan serve", "Visit http://localhost:8000"],
      code: `# Install Laravel globally
composer global require laravel/installer

# Create a new project
laravel new my-blog

# Go into the folder and start the server
cd my-blog
php artisan serve
# → Server running at http://127.0.0.1:8000`,
      output: "INFO  Server running on [http://127.0.0.1:8000]\n\nPress Ctrl+C to stop the server",
      cmd: "php artisan serve"
    },
    tip: "Laravel makes PHP enjoyable. វាដោះស្រាយការងារដដែលៗ ដូចជាការផ្ទៀងផ្ទាត់ទម្រង់ ការតភ្ជាប់មូលដ្ឋានទិន្នន័យ និងការគ្រប់គ្រង Session ដើម្បីឲ្យអ្នកផ្តោតលើការបង្កើតមុខងារជាក់ស្តែង។",
    concepts: [
      { term: "Framework", def: "ជាគ្រោងឆ្អឹងកូដដែលបានរៀបចំទុកជាមុន — ជួយឲ្យអ្នកអភិវឌ្ឍន៍ Web App បានលឿនជាង និងតាមស្តង់ដារ។" },
      { term: "MVC Pattern", def: "Model-View-Controller: ការបំបែករចនាសម្ព័ន្ធកូដជា ៣ ផ្នែក — Data (M), Interface (V), និង Logic (C)។" },
      { term: "Artisan CLI", def: "Laravel's built-in command line tool for creating files, running migrations, and managing the app." },
      { term: "Composer", def: "PHP's package manager — like npm for JavaScript. It installs and manages all your project dependencies." },
    ]
  },
  {
    id: "m02", week: "Week 1–2", num: "02",
    title: "Artisan CLI & Dev Tools",
    goal: "Get comfortable using the command line to speed up development — ស្ទាត់ជំនាញប្រើប្រាស់ Command Line ដើម្បីបង្កើន ល្បឿននៃការអភិវឌ្ឍ",
    stripe: "#4a4a4a",
    icon: Terminal,
    topics: [
      { title: "⌨️ Command structure: php artisan [cmd]", desc: "Learning how to use Laravel's powerful built-in command line tool." },
      { title: "📝 Generating code with make:*", desc: "Create controllers, models, and more with a single command." },
      { title: "🔍 Checking app state with route:list and about", desc: "Tools to inspect routes and review your application setup." },
      { title: "🖥️ Using Tinker as an interactive shell", desc: "Talk to your database and test PHP code in real time." }
    ],
    lab: {
      title: "Command Line Practice",
      steps: ["List all available commands", "Open the Tinker shell", "Check application info", "Generate a test controller"],
      code: `# See all available commands
php artisan list

# App versions and environment info
php artisan about

# List every registered URL in the app
php artisan route:list

# Open an interactive PHP shell
php artisan tinker
>>> $now = now();
>>> $now->addDay();
>>> echo $now;

# Quickly generate a new controller file
php artisan make:controller ArtisanDemoController`,
      output: "Available commands:\n  make:controller      Create a new controller\n  make:model           Create a new model\n  migrate              Run migrations\n  route:list           List all registered routes",
      cmd: "php artisan list"
    },
    tip: "Artisan គឺដូចជា remote control សម្រាប់កម្មវិធីរបស់អ្នក — វាអាចបង្កើតឯកសារ រៀបចំ Database និងដំណើរការការងារផ្ទៃខាងក្នុងជាច្រើន ដោយគ្រាន់តែវាយពាក្យមួយបន្ទាត់។",
    concepts: [
      { term: "CLI", def: "Command Line Interface. Artisan is built on the Symfony Console component and runs directly in your terminal." },
      { term: "Tinker", def: "A live PHP shell (REPL) for Laravel — test queries, create records, and explore your app without a browser." },
      { term: "Generator", def: "Commands like make:controller create ready-to-use class files that follow Laravel's coding standards." },
      { term: "Artisan About", def: "Shows a summary of your app's PHP version, database driver, cache driver, and environment." },
    ]
  },
  {
    id: "m03", week: "Week 1–2", num: "03",
    title: "Docker & Laravel Sail",
    goal: "Run your app in an isolated environment that works the same everywhere — ដំណើរការកម្មវិធីក្នុងបរិស្ថានដាច់ដោយឡែក ដែលដំណើរការដូចគ្នារាល់ទីកន្លែង",
    stripe: "var(--blue)",
    icon: Box,
    topics: [
      { title: "🐳 What is Docker? (Containers vs VMs)", desc: "A modern way to isolate your app's environment so it runs the same on any computer." },
      { title: "⛵ Laravel Sail — Docker made simple", desc: "A zero-config Docker setup designed specifically for Laravel projects." },
      { title: "📦 Services: PHP, MySQL, Redis, and Mailpit", desc: "The building blocks of a full backend development stack." },
      { title: "⚡ Running Sail commands with ./vendor/bin/sail", desc: "How to run your normal commands inside the Docker container." }
    ],
    lab: {
      title: "Starting Up with Laravel Sail",
      steps: ["Install Docker Desktop", "Add Sail to your project via Composer", "Set up Sail: php artisan sail:install", "Start everything: sail up -d"],
      code: `# Add Sail to an existing project
composer require laravel/sail --dev

# Choose your services (MySQL, Redis, etc.)
php artisan sail:install

# Start the environment in the background
./vendor/bin/sail up -d

# Run artisan and composer inside Docker:
./vendor/bin/sail artisan migrate
./vendor/bin/sail composer require ...`,
      output: "Creating laravel-app_mysql_1 ... done\nCreating laravel-app_sail_1  ... done\n\n✓ Application running at http://localhost",
      cmd: "./vendor/bin/sail up"
    },
    tip: "Docker solves the 'it works on my machine' problem. ជាមួយ Docker គ្រប់សមាជិកក្រុមការងារ ព្រមទាំង Server ផ្ទាល់ ដំណើរការ PHP និង MySQL នៅលើ Version តែមួយ ដោយមិនចំណាយពេលដំឡើងដោយដៃ។",
    concepts: [
      { term: "Container", def: "A lightweight, self-contained package that includes your app's code, runtime, and all libraries it needs." },
      { term: "Laravel Sail", def: "A simple command-line wrapper around Laravel's default Docker setup. Makes Docker easy to use." },
      { term: "Docker Compose", def: "A tool for running multiple containers together — for example, PHP + MySQL + Redis as one stack." },
      { term: "Isolation", def: "Docker keeps your project's PHP and MySQL versions separate from anything installed globally on your computer." },
    ]
  },
  {
    id: "m04", week: "Week 2", num: "04",
    title: "MVC Architecture",
    goal: "Build your first Model, View, and Controller",
    stripe: "#6c3483",
    icon: Layers,
    topics: [
      { title: "📐 Model — represents your database data", desc: "How Laravel maps database tables to PHP objects you can work with." },
      { title: "🎨 View — Blade template engine", desc: "Building dynamic HTML pages using Laravel's clean template syntax." },
      { title: "🎮 Controller — handles incoming requests", desc: "The part that connects models and views to respond to user actions." },
      { title: "🛣️ Routing — linking URLs to actions", desc: "Registering URLs and telling Laravel what to do when they are visited." }
    ],
    lab: {
      title: "Simple Home & About Pages",
      steps: ["Define routes in routes/web.php", "Create HomeController with an index() method", "Create Blade view files", "Link pages using named routes"],
      code: `// routes/web.php
Route::get('/', [HomeController::class, 'index'])
    ->name('home');

Route::get('/about', function () {
    return view('about');
})->name('about');

// HomeController.php
public function index()
{
    $data = ['title' => 'Welcome!'];
    return view('home', $data);
}

// resources/views/home.blade.php
<h1>{{ $title }}</h1>
<a href="{{ route('about') }}">About Us</a>`,
      output: "Pages render at / and /about\nBlade templates compile to optimized PHP",
      cmd: "php artisan make:controller HomeController"
    },
    tip: "Think of MVC like a restaurant: Model = kitchen (prepares the data), View = dining room (displays it), Controller = waiter (connects the two).",
    concepts: [
      { term: "Route", def: "Maps a URL and HTTP method to a specific controller action or function." },
      { term: "Blade", def: "Laravel's template engine — write HTML with @directives like @if, @foreach, and @extends." },
      { term: "Controller", def: "A PHP class that receives HTTP requests, works with data, and returns a response." },
      { term: "View", def: "A .blade.php file whose only job is to display data — no business logic should go here." },
    ]
  },
  {
    id: "m05", week: "Week 2–3", num: "05",
    title: "Routing & Controllers",
    goal: "Master URL mapping and request handling",
    stripe: "#1a6b3c",
    icon: Milestone,
    topics: [
      { title: "🌐 Web routes vs API routes", desc: "The difference between routes that return HTML pages and routes that return JSON data." },
      { title: "🔢 Route parameters (required and optional)", desc: "Pulling dynamic values out of the URL, like /user/{id}." },
      { title: "🏷️ Named routes and route groups", desc: "Organizing your routes and generating clean URLs throughout the app." },
      { title: "⚡ Resource controllers (7 RESTful actions)", desc: "A standard way to handle all CRUD operations in a single controller class." }
    ],
    lab: {
      title: "Product Controller",
      steps: ["Generate a controller with the --resource flag", "Register it with Route::resource()", "Write the index() method to list products", "Add show($id) to display a single product"],
      code: `# Generate a resourceful controller
php artisan make:controller ProductController --resource

# routes/web.php — one line creates 7 routes
Route::resource('products', ProductController::class);

# ProductController.php
public function index()
{
    return view('products.index');
}

public function show(Product $product)
{
    // Route Model Binding — Laravel fetches the record automatically
    return view('products.show', compact('product'));
}`,
      output: "GET    /products           → index\nGET    /products/create    → create\nPOST   /products           → store\nGET    /products/{id}      → show\nGET    /products/{id}/edit → edit\nPUT    /products/{id}      → update\nDELETE /products/{id}      → destroy",
      cmd: "php artisan route:list"
    },
    tip: "Route::resource() creates all 7 CRUD routes in one line — always use it instead of writing each route by hand.",
    concepts: [
      { term: "Route::resource()", def: "Creates 7 standard RESTful routes (index, create, store, show, edit, update, destroy) automatically." },
      { term: "Route Model Binding", def: "Laravel looks up the model record for you when you type-hint it: show(Product $product)." },
      { term: "Named Routes", def: "Give a route a name with ->name('products.show'), then generate its URL with route('products.show', $product)." },
      { term: "Middleware", def: "Code that runs before or after a request — commonly used for auth checks, logging, and rate limiting." },
    ]
  },
  {
    id: "m06", week: "Week 3–4", num: "06",
    title: "Database & Migrations",
    goal: "Design your database schema and keep it under version control",
    stripe: "#1a3a6b",
    icon: Database,
    topics: [
      { title: "🔐 Set up database credentials in .env", desc: "Connecting your app to MySQL or PostgreSQL using environment variables." },
      { title: "🛠️ Create and run migrations", desc: "Writing PHP code to define and version-control your database structure." },
      { title: "📐 Schema Builder — choosing column types", desc: "Picking the right data types for each column in your tables." },
      { title: "🔄 Rollback, refresh, and fresh strategies", desc: "Managing database changes safely across different environments." }
    ],
    lab: {
      title: "Products Table",
      steps: ["Set up DB credentials in .env", "Generate a migration with make:migration", "Define columns in the up() method", "Run: php artisan migrate"],
      code: `# .env
DB_CONNECTION=mysql
DB_DATABASE=my_shop
DB_USERNAME=root
DB_PASSWORD=secret

# Generate migration
php artisan make:migration create_products_table

# Migration file — up() method
public function up(): void
{
    Schema::create('products', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->decimal('price', 8, 2);
        $table->text('description')->nullable();
        $table->integer('stock')->default(0);
        $table->boolean('active')->default(true);
        $table->timestamps();
    });
}`,
      output: "INFO  Running migrations.\n  2024_01_01_create_products_table ... 18ms DONE\n\nMigration table created.",
      cmd: "php artisan migrate"
    },
    tip: "Treat migrations like Git commits for your database. Never change tables manually — always write a new migration instead.",
    concepts: [
      { term: "Migration", def: "A PHP class that defines how to create or change a database table — version control for your schema." },
      { term: "Schema Builder", def: "A fluent API: Schema::create('table', fn($t) => $t->string('name')). Writes the SQL for you." },
      { term: "migrate:fresh", def: "Drops all tables and re-runs every migration from scratch. Only use this during development." },
      { term: "Soft Deletes", def: "$table->softDeletes() adds a deleted_at column. Records look deleted but stay in the database." },
    ]
  },
  {
    id: "m07", week: "Week 4–5", num: "07",
    title: "Eloquent ORM",
    goal: "Work with database records as plain PHP objects",
    stripe: "#7d6608",
    icon: Cpu,
    topics: [
      { title: "📂 Models — one class per table", desc: "Defining the connection between your PHP code and database tables." },
      { title: "🔄 CRUD operations with Eloquent", desc: "Reading, creating, updating, and deleting records using simple method calls." },
      { title: "🛡️ Mass assignment and $fillable", desc: "Protecting your database from unexpected or malicious user input." },
      { title: "🔗 Relationships: hasOne, hasMany, belongsToMany", desc: "Connecting related data across tables using Eloquent's relationship methods." }
    ],
    lab: {
      title: "Product CRUD in Tinker",
      steps: ["Create the Product model: make:model Product", "Define the $fillable array", "Test CRUD operations in php artisan tinker", "Define a User hasMany Products relationship"],
      code: `// app/Models/Product.php
class Product extends Model
{
    protected $fillable = [
        'name', 'price', 'description', 'stock'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

// CRUD operations:
// CREATE
Product::create(['name' => 'Laptop', 'price' => 999.99]);

// READ
$products = Product::where('active', true)->get();
$product  = Product::find(1);

// UPDATE
$product->update(['price' => 899.99]);

// DELETE
$product->delete();`,
      output: ">>> Product::count()\n= 5\n>>> Product::where('price', '<', 100)->count()\n= 3\n>>> Product::latest()->first()->name\n= \"Laptop Pro\"",
      cmd: "php artisan tinker"
    },
    tip: "Eloquent turns database rows into PHP objects. Reading $product->name reads a column value. Calling $product->save() writes it back to the database.",
    concepts: [
      { term: "Eloquent Model", def: "One model = one table. The Product model maps to the products table and handles all SQL automatically." },
      { term: "$fillable", def: "A security whitelist — only the fields listed here can be set via ::create() or ->update()." },
      { term: "hasMany()", def: "User hasMany Products. Access them via $user->products (lazy load) or User::with('products')->get() (eager load)." },
      { term: "N+1 Problem", def: "Loading 100 posts then calling $post->user in a loop runs 101 queries. Fix it: Post::with('user')->get() = just 2 queries." },
    ]
  },
  {
    id: "m08", week: "Week 5", num: "08",
    title: "Forms & Validation",
    goal: "Safely handle and validate user input",
    stripe: "#8e1a5c",
    icon: Layout,
    topics: [
      { title: "🛡️ CSRF protection — @csrf in every form", desc: "Security tokens that prevent cross-site request forgery attacks." },
      { title: "✅ Built-in validation rules (80+)", desc: "Checking data with rules like required, email, min, max, and unique." },
      { title: "📝 Custom Form Request classes", desc: "Moving validation logic out of controllers to keep your code clean." },
      { title: "⚠️ Showing error messages in Blade with @error", desc: "Giving users clear feedback when their input does not pass validation." }
    ],
    lab: {
      title: "Product Creation Form",
      steps: ["Build an HTML form with the @csrf token", "Create a StoreProductRequest class", "Define validation rules in the rules() method", "Display $errors in the Blade template"],
      code: `{{-- resources/views/products/create.blade.php --}}
<form method="POST" action="{{ route('products.store') }}">
    @csrf

    <input type="text" name="name" value="{{ old('name') }}">
    @error('name')
        <p class="error">{{ $message }}</p>
    @enderror

    <input type="number" name="price" step="0.01">
    <button type="submit">Create Product</button>
</form>

// app/Http/Requests/StoreProductRequest.php
public function rules(): array
{
    return [
        'name'  => 'required|string|max:255',
        'price' => 'required|numeric|min:0',
        'stock' => 'integer|min:0',
        'image' => 'nullable|image|max:2048',
    ];
}`,
      output: "Validation passes → Product created!\nValidation fails → Back to form with $errors\nold() helper refills fields automatically",
      cmd: "php artisan make:request StoreProductRequest"
    },
    tip: "Always use Form Request classes — they keep your controller short and put all validation rules in one clear place.",
    concepts: [
      { term: "@csrf", def: "Generates a hidden token in your form. Laravel checks it on every POST/PUT to block cross-site attacks." },
      { term: "Form Request", def: "A dedicated class with a rules() method for validation and an authorize() method for permission checks." },
      { term: "old('field')", def: "Refills a form input with the user's previous value after a failed validation — much better for the user." },
      { term: "$errors", def: "A global Blade variable. Use @error('field') ... @enderror to show the error message for a specific field." },
    ]
  },
  {
    id: "m09", week: "Week 5–6", num: "09",
    title: "Mastering CRUD Logic",
    goal: "Master the 4 basic operations that drive every web app — ស្ទាត់ជំនាញលើប្រតិបត្តិការមូលដ្ឋានទាំង ៤ (CRUD)",
    stripe: "var(--teal)",
    icon: Hammer,
    topics: [
      { title: "🏗️ CRUD Definition (Create, Read, Update, Delete)", desc: "Understanding the four pillars of data management in any application." },
      { title: "🛣️ Route::resource() — One line, 7 routes", desc: "How Laravel maps standard URLs to specific controller actions automatically." },
      { title: "🎮 Resourceful Controllers & Model Binding", desc: "Writing clean, predictable logic for handling each CRUD action." },
      { title: "🎨 Full CRUD Flow: Route → Controller → Model → View", desc: "The step-by-step journey of data from user input to database and back." }
    ],
    lab: {
      title: "Build a Product Management System",
      steps: ["Generate: php artisan make:controller ProductController --resource", "Register: Route::resource('products')", "Implement index(), create(), and store()", "Build the edit() and update() logic"],
      code: `// routes/web.php
Route::resource('products', ProductController::class);

// ProductController.php
class ProductController extends Controller
{
    public function index() {
        $products = Product::all();
        return view('products.index', compact('products'));
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'name'  => 'required|max:255',
            'price' => 'required|numeric',
        ]);
        Product::create($validated);
        return redirect()->route('products.index');
    }

    public function update(Request $request, Product $product) {
        $product->update($request->all());
        return redirect()->route('products.index');
    }

    public function destroy(Product $product) {
        $product->delete();
        return redirect()->route('products.index');
    }
}`,
      output: "GET    /products          → index   (Read)\nPOST   /products          → store   (Create)\nPUT    /products/{id}     → update  (Update)\nDELETE /products/{id}     → destroy (Delete)",
      cmd: "php artisan make:controller ProductController --resource"
    },
    tip: "CRUD គឺជាបេះដូងនៃ Web App។ ចូរអនុវត្តតាមលំដាប់លំដោយ៖ ចាប់ផ្តើមពី Route -> Controller -> Model រួចបញ្ចប់នៅ View។ កុំភ្លេចប្រើ @csrf ក្នុងគ្រប់ Form!",
    concepts: [
      { term: "CRUD", def: "Create (បង្កើត), Read (មើល), Update (កែប្រែ), Delete (លុប) — ប្រតិបត្តិការ ៤ យ៉ាងដែលគ្រប់គ្រងទិន្នន័យ។" },
      { term: "Resourceful Controller", def: "Controller ដែលមាន Methods ៧ តាមស្តង់ដារ RESTful សម្រាប់គ្រប់គ្រង CRUD ទាំងអស់។" },
      { term: "Route::resource", def: "Shortcut ក្នុង Laravel ដែលបង្កើត Route ៧ ក្នុងពេលតែមួយដោយប្រើកូដត្រឹមតែមួយបន្ទាត់។" },
      { term: "Full Flow", def: "ដំណើរការទិន្នន័យ៖ User Action → Route → Controller → Model → View → Response។" },
    ]
  },
  {
    id: "m10", week: "Week 6", num: "10",
    title: "Authentication System",
    goal: "Build a secure login, registration, and session system",
    stripe: "#b25000",
    icon: Lock,
    topics: [
      { title: "🍃 Laravel Breeze starter kit", desc: "Instantly set up a full authentication system with Blade, Vue, or React." },
      { title: "🔐 Login and registration flows", desc: "Handling user credentials, password hashing, and login sessions securely." },
      { title: "🎟️ Session-based authentication", desc: "How Laravel remembers who is logged in across multiple page requests." },
      { title: "🛡️ Auth middleware and protected routes", desc: "Blocking access to certain pages unless the user is logged in." }
    ],
    lab: {
      title: "Install Laravel Breeze",
      steps: ["Install Breeze via Composer", "Run php artisan breeze:install", "Run migrations for the users table", "Test login at /login and register at /register"],
      code: `# Install Breeze
composer require laravel/breeze --dev
php artisan breeze:install blade
php artisan migrate
npm install && npm run dev

# Protect routes with auth middleware
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');
    Route::resource('products', ProductController::class);
});

// In Blade
@auth
    <p>Welcome, {{ Auth::user()->name }}!</p>
    <form method="POST" action="/logout">
        @csrf
        <button>Logout</button>
    </form>
@endauth`,
      output: "Breeze created:\n ✓ Login at /login\n ✓ Register at /register\n ✓ Dashboard at /dashboard\n ✓ Password reset flow",
      cmd: "php artisan breeze:install"
    },
    tip: "Never build authentication from scratch. Use Breeze (simple) or Fortify (headless) — they handle all the security edge cases for you.",
    concepts: [
      { term: "Laravel Breeze", def: "Laravel's official authentication starter kit. Provides login, registration, password reset, and email verification out of the box." },
      { term: "auth Middleware", def: "Redirects users who are not logged in to the login page. Add it to any route: Route::middleware('auth')." },
      { term: "Auth::user()", def: "Returns the currently logged-in User model. Returns null if nobody is authenticated." },
      { term: "Session", def: "Server-side storage that keeps user data between requests. Laravel stores the logged-in user's identity here." },
    ]
  },
  {
    id: "m11", week: "Week 6–7", num: "11",
    title: "Authorization & Security",
    goal: "Control what each authenticated user is allowed to do",
    stripe: "#0d6b5e",
    icon: Shield,
    topics: [
      { title: "🚪 Gates — simple permission checks", desc: "Closure-based checks for quick, one-off permission logic." },
      { title: "📜 Policies — per-model authorization", desc: "Organizing permission logic into classes that match your models." },
      { title: "👥 Roles and permissions design pattern", desc: "Building a scalable system for managing what different users can do." },
      { title: "🛡️ Protecting against CSRF, XSS, and SQL injection", desc: "How Laravel guards your app against the most common web attacks." }
    ],
    lab: {
      title: "Product Policy",
      steps: ["Generate: make:policy ProductPolicy --model=Product", "Write the update() and delete() methods", "Register the policy (automatic in Laravel 11)", "Use $this->authorize() in your controller"],
      code: `// app/Policies/ProductPolicy.php
class ProductPolicy
{
    public function update(User $user, Product $product): bool
    {
        return $user->id === $product->user_id
            || $user->role === 'admin';
    }

    public function delete(User $user, Product $product): bool
    {
        return $user->id === $product->user_id;
    }
}

// In Controller
public function update(Request $request, Product $product)
{
    $this->authorize('update', $product);
    $product->update($request->validated());
    return redirect()->route('products.index');
}

// In Blade
@can('update', $product)
    <a href="{{ route('products.edit', $product) }}">Edit</a>
@endcan`,
      output: "Authorized users → action proceeds\nUnauthorized users → 403 Forbidden page\n@can hides UI elements automatically",
      cmd: "php artisan make:policy ProductPolicy --model=Product"
    },
    tip: "Authentication = who you are. Authorization = what you are allowed to do. They solve two different problems and should never be confused.",
    concepts: [
      { term: "Policy", def: "A class with methods that match model actions (view, create, update, delete). Keeps your permission logic organized." },
      { term: "Gate", def: "A simple closure-based check: Gate::define('edit-post', fn($user, $post) => $user->id === $post->user_id)." },
      { term: "$this->authorize()", def: "Throws a 403 error automatically if the policy returns false. Cleaner than writing if/abort yourself." },
      { term: "@can / @cannot", def: "Blade directives that show or hide UI elements based on permissions. Never rely on hiding UI as your only security." },
    ]
  },
  {
    id: "m12", week: "Week 7–8", num: "12",
    title: "REST API Development",
    goal: "Build clean, well-structured JSON APIs",
    stripe: "#1a5c1a",
    icon: Globe,
    topics: [
      { title: "🛣️ API routes in routes/api.php", desc: "Building stateless routes that return JSON instead of HTML pages." },
      { title: "⚡ API Resource controllers", desc: "Focused controllers built specifically for API endpoints." },
      { title: "📦 JSON responses and HTTP status codes", desc: "Communicating properly with mobile apps and frontend clients." },
      { title: "🔄 API Resources — shaping your JSON output", desc: "Controlling exactly what data gets sent back to the client." }
    ],
    lab: {
      title: "Products JSON API",
      steps: ["Create an API controller with the --api flag", "Register it in routes/api.php", "Create a ProductResource to shape the JSON", "Test GET /api/products in your browser"],
      code: `// routes/api.php
Route::apiResource('products', ProductController::class);
// Creates: GET, POST, GET/{id}, PUT/{id}, DELETE/{id}

// Api/ProductController.php
public function index()
{
    return ProductResource::collection(
        Product::with('user')->latest()->paginate(15)
    );
}

public function store(StoreProductRequest $request)
{
    $product = Product::create($request->validated());
    return new ProductResource($product, 201);
}

// ProductResource.php
public function toArray($request): array
{
    return [
        'id'         => $this->id,
        'name'       => $this->name,
        'price'      => $this->price,
        'author'     => $this->user->name,
        'created_at' => $this->created_at->toDateString(),
    ];
}`,
      output: '{\n  "data": [\n    { "id": 1, "name": "Laptop", "price": 999.99 },\n    { "id": 2, "name": "Phone",  "price": 699.99 }\n  ],\n  "meta": { "total": 2, "per_page": 15 }\n}',
      cmd: "php artisan make:controller Api/ProductController --api"
    },
    tip: "Always use API Resources — never return raw Models. You decide exactly what data is sent to clients, including hiding sensitive fields.",
    concepts: [
      { term: "API Resource", def: "Transforms a Model into a specific JSON shape. Hides sensitive fields, renames keys, and adds computed values." },
      { term: "apiResource()", def: "Like resource() but skips the create and edit routes, since APIs don't need HTML forms." },
      { term: "HTTP 201", def: "The status code for 'Created'. Return it when a POST request successfully creates a new resource." },
      { term: "Pagination", def: "paginate(15) returns 15 items per page plus metadata (total count, links). Clients can page through large datasets." },
    ]
  },
  {
    id: "m13-swagger", week: "Week 8", num: "13",
    title: "API Documentation with Swagger",
    goal: "Automatically generate professional documentation for your APIs",
    stripe: "#85ea2d",
    icon: FileJson,
    topics: [
      { title: "📑 OpenAPI Specification (OAS)", desc: "The industry standard for defining and documenting RESTful APIs." },
      { title: "📦 L5-Swagger package integration", desc: "Automatically generating API docs from your Laravel controller code." },
      { title: "🏷️ PHP 8.1 Attributes for API documentation", desc: "Writing documentation as code annotations directly above your methods." },
      { title: "🚀 Testing endpoints from the Swagger UI", desc: "Trying out your API calls directly from the browser interface." }
    ],
    lab: {
      title: "Generating Swagger Docs",
      steps: ["Install: darkaonline/l5-swagger", "Add Swagger attributes to your controller", "Run: php artisan l5-swagger:generate", "Visit /api/documentation"],
      code: `# Install the package
composer require \"darkaonline/l5-swagger\"

# Controller Attribute Example
#[OA\\Get(
    path: \"/api/products\",
    responses: [
        new OA\\Response(response: 200, description: \"List products\")
    ]
)]
public function index() { ... }

# Generate the JSON spec and UI
php artisan l5-swagger:generate

# Open in browser:
# http://localhost:8000/api/documentation`,
      output: "INFO  Regenerating docs...\n✓ JSON generated successfully\n✓ Swagger UI updated",
      cmd: "php artisan l5-swagger:generate"
    },
    tip: "Never write API documentation by hand — it goes out of date immediately. Swagger attributes live right next to your code, so docs stay accurate automatically.",
    concepts: [
      { term: "OpenAPI", def: "A standard format for describing RESTful APIs in a machine-readable way (JSON or YAML)." },
      { term: "Swagger UI", def: "A browser-based interface that reads your OpenAPI spec and generates interactive API documentation." },
      { term: "Attributes", def: "A PHP 8 feature used by L5-Swagger to attach documentation metadata directly above your controller methods." },
      { term: "OAS-compliant", def: "An API that follows the OpenAPI Specification, making it compatible with tools like Postman and Swagger." },
    ]
  },
  {
    id: "m14", week: "Week 8–9", num: "14",
    title: "Laravel + React Frontend",
    goal: "Connect a React app to a Laravel API backend",
    stripe: "#1a3a6b",
    icon: Code2,
    optional: true,
    topics: [
      { title: "🌐 Set up CORS for cross-origin requests", desc: "Allowing your React app to securely make requests to your Laravel backend." },
      { title: "🎟️ Sanctum token authentication for SPAs", desc: "Issuing API tokens so your React app can log users in and out." },
      { title: "🔄 Fetching data from React using fetch or axios", desc: "Calling your Laravel JSON endpoints from inside React components." },
      { title: "🔐 Managing API URLs with .env in React", desc: "Keeping your API base URL out of the code using environment variables." }
    ],
    lab: {
      title: "React Fetching the Products API",
      steps: ["Install Sanctum: composer require laravel/sanctum", "Set allowed origins in config/cors.php", "In React: fetch('/api/products') with a Bearer token", "Handle loading states and errors gracefully"],
      code: `// config/cors.php
'allowed_origins' => ['http://localhost:5173'],

// React component — fetch and display products
import { useState, useEffect } from 'react';

function ProductList() {
    const [products, setProducts] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetch('http://localhost:8000/api/products', {
            headers: {
                'Authorization': \`Bearer \${token}\`,
                'Accept': 'application/json',
            }
        })
        .then(res => res.json())
        .then(data => setProducts(data.data));
    }, []);

    return (
        <ul>
            {products.map(p => (
                <li key={p.id}>{p.name} — \${p.price}</li>
            ))}
        </ul>
    );
}`,
      output: "React sends: Authorization: Bearer 1|abc123...\nLaravel validates the token via Sanctum\nReturns JSON — React renders the list",
      cmd: "php artisan install:api"
    },
    tip: "React is optional — Laravel can serve Blade views or act as a pure API backend. Choose based on your project's needs.",
    concepts: [
      { term: "CORS", def: "Cross-Origin Resource Sharing. Browsers block requests between different domains — Laravel must whitelist your React app's URL." },
      { term: "Sanctum", def: "Laravel's lightweight token package. Issues Bearer tokens that React and mobile apps use to authenticate." },
      { term: "Bearer Token", def: "Sent in the request header: Authorization: Bearer <token>. Laravel checks it on every protected route." },
      { term: "SPA", def: "Single Page Application. React runs in the browser and calls Laravel for data — no full page reloads." },
    ]
  },
  {
    id: "m15", week: "Week 9–10", num: "15",
    title: "Advanced Features",
    goal: "Queues, jobs, events, and file uploads",
    stripe: "#6b3a00",
    icon: Zap,
    topics: [
      { title: "⛓️ Queues and Jobs — background processing", desc: "Offloading slow tasks like sending emails so your app stays fast." },
      { title: "🔈 Events and Listeners — loosely coupled design", desc: "Triggering multiple actions across your app from a single event." },
      { title: "💾 File Storage — local, public, and S3 disks", desc: "Handling file uploads and cloud storage through a single unified API." },
      { title: "⚡ Caching with Redis for better performance", desc: "Storing frequently read data in memory so the database is not hit every time." }
    ],
    lab: {
      title: "File Upload and Background Email",
      steps: ["Add an image upload field to the product form", "Save the file with Storage::disk('public')", "Dispatch a SendWelcomeEmail job to the queue", "Run: php artisan queue:work"],
      code: `// ProductController.php
public function store(StoreProductRequest $request)
{
    $data = $request->validated();

    if ($request->hasFile('image')) {
        $data['image'] = $request->file('image')
            ->store('products', 'public');
    }

    $product = Product::create($data);

    // Dispatch a background job — does not block the response
    SendProductNotification::dispatch($product);

    return redirect()->route('products.index');
}

// In Blade — show the uploaded image
<img src="{{ Storage::url($product->image) }}"
     alt="{{ $product->name }}">

// Create the storage symlink (run once)
// php artisan storage:link`,
      output: "Image saved to: storage/app/public/products/abc.jpg\nPublic URL: /storage/products/abc.jpg\nEmail job queued — sent in background ✓",
      cmd: "php artisan storage:link"
    },
    tip: "Queues keep slow operations (sending email, resizing images) from blocking the HTTP response. Always use them for anything that takes more than a second.",
    concepts: [
      { term: "Queue / Job", def: "Runs tasks in the background. dispatch(new SendEmail($user)) returns immediately — the email is sent later by a worker." },
      { term: "Storage Disk", def: "local = private storage (no direct URL). public = accessible via a URL after running storage:link." },
      { term: "Event / Listener", def: "A UserRegistered event can trigger a SendWelcomeEmail listener. Keeps different parts of your code independent." },
      { term: "Cache", def: "Cache::remember('key', 3600, fn() => DB::query()) — runs the query once and stores the result for 1 hour." },
    ]
  },
  {
    id: "m16", week: "Week 11", num: "16",
    title: "Deployment & Production",
    goal: "Ship your application to the real world",
    stripe: "#c0392b",
    icon: Server,
    topics: [
      { title: "☁️ Hosting on Railway, Render, or Fly.io", desc: "Deploying your Laravel app to modern cloud hosting platforms." },
      { title: "⚙️ Configuring your app for production", desc: "Locking down and optimizing your settings for a live environment." },
      { title: "⚡ Optimization commands (config, routes, views)", desc: "Caching everything to get the best performance in production." },
      { title: "🔄 Deploying without downtime", desc: "Updating a live app without interrupting users who are currently using it." }
    ],
    lab: {
      title: "Deploy to Railway",
      steps: ["Push your code to a GitHub repository", "Connect Railway to your GitHub repo", "Set all .env variables in the Railway dashboard", "Add the start command: php artisan serve"],
      code: `# Full production deployment checklist

# 1. Set up the environment
cp .env.example .env
php artisan key:generate

# 2. Install only production dependencies
composer install --no-dev --optimize-autoloader

# 3. Build frontend assets
npm ci && npm run build

# 4. Run database migrations
php artisan migrate --force

# 5. Cache everything for speed
php artisan optimize
# → Caches config, routes, views, and events

# 6. Create the storage symlink
php artisan storage:link

# IMPORTANT .env settings for production:
# APP_ENV=production
# APP_DEBUG=false   ← NEVER set this to true in production!
# APP_URL=https://your-domain.com`,
      output: "INFO  Caching configuration.\nINFO  Caching routes.\nINFO  Caching views.\nINFO  Caching events.\n\n✓ Application optimized for production",
      cmd: "php artisan optimize"
    },
    tip: "APP_DEBUG=true in production exposes your database credentials and source code to anyone on the internet. Always set it to false before going live.",
    concepts: [
      { term: "php artisan optimize", def: "Caches config, routes, views, and events all at once. Noticeably improves app speed in production." },
      { term: "APP_DEBUG=false", def: "Hides detailed error messages from end users. Critical for security — must always be false in production." },
      { term: "Storage link", def: "Creates a symbolic link from public/storage to storage/app/public. Required for uploaded files to have public URLs." },
      { term: "Zero-downtime deploy", def: "Deploy to a new folder, then instantly switch a symlink to point to it. The old version keeps running until the swap." },
    ]
  },
  {
    id: "m17", week: "Week 12", num: "17",
    title: "Final Project — E-Commerce",
    goal: "Build a complete, production-ready web application from scratch",
    stripe: "#6c3483",
    icon: Trophy,
    topics: [
      { title: "🛒 Users, Products, Orders, Categories schema", desc: "Designing a solid database structure for a real online store." },
      { title: "🛍️ Shopping cart using session storage", desc: "A persistent cart that remembers items across page loads." },
      { title: "💳 Stripe payment integration", desc: "Accepting credit card payments securely inside your application." },
      { title: "🛠️ Admin dashboard with role-based access", desc: "A management area that only admin users can access." }
    ],
    lab: {
      title: "E-Commerce System Architecture",
      steps: ["Design the ERD: User, Product, Category, Order, OrderItem", "Set up all Eloquent relationships", "Build the cart logic using Laravel sessions", "Add the Stripe checkout flow"],
      code: `// Core Models and Relationships

// User.php
public function orders()
{
    return $this->hasMany(Order::class);
}

// Product.php
public function category()
{
    return $this->belongsTo(Category::class);
}
public function orders()
{
    return $this->belongsToMany(Order::class)
                ->withPivot('quantity', 'price');
}

// Cart session logic
Session::push('cart', [
    'product_id' => $product->id,
    'quantity'   => $request->quantity,
    'price'      => $product->price,
]);

$total = collect(Session::get('cart'))
    ->sum(fn($item) => $item['price'] * $item['quantity']);

// Stripe Checkout
$checkout = $stripe->checkout->sessions->create([
    'payment_method_types' => ['card'],
    'line_items'           => $lineItems,
    'mode'                 => 'payment',
    'success_url'          => route('order.success'),
]);`,
      output: "Database: 6 tables with proper foreign keys\nCart: Session-based, persists across pages\nStripe: Secure payment handling\nAdmin: Role-protected dashboard",
      cmd: "php artisan migrate:fresh --seed"
    },
    tip: "Start with the database schema — a well-designed ERD saves weeks of rewriting later. Plan all relationships on paper before writing a single line of code.",
    concepts: [
      { term: "Shopping cart", def: "Store cart items in the session with Session::put/get/push. The cart clears when the session expires or the user logs out." },
      { term: "Stripe Integration", def: "Never handle raw card numbers yourself. Stripe's SDK manages all PCI compliance and secure payment processing." },
      { term: "Admin Role", def: "Add a role column to the users table. Check it in middleware: if($user->role !== 'admin') abort(403)." },
      { term: "OrderItem pivot", def: "A many-to-many table between Order and Product that also stores quantity and the price at the time of purchase." },
    ]
  },
];

const GRADING: GradingItem[] = [
  { label: "Assignments", pct: 30, stripe: "var(--purple)", desc: "Weekly lab exercises and homework — លំហាត់ប្រចាំសប្តាហ៍", icon: ClipboardList },
  { label: "Final Project", pct: 40, stripe: "var(--red)", desc: "Full e-commerce capstone project — គម្រោងចុងក្រោយ", icon: Trophy },
  { label: "Participation", pct: 10, stripe: "var(--amber)", desc: "In-class discussion and engagement — ការចូលរួម និងការពិភាក្សា", icon: Users },
];


// ─── SYNTAX HIGHLIGHT ──────────────────────────────────────────
const PHP_KW = new Set(["php", "echo", "return", "if", "else", "elseif", "foreach", "for", "while", "class", "extends", "implements", "namespace", "use", "new", "public", "protected", "private", "static", "function", "fn", "array", "string", "int", "float", "bool", "void", "null", "true", "false", "require", "include", "throw", "try", "catch", "match", "readonly", "const"]);

function hl(code: string) {
  return code.split("\n").map((line: string, i: number) => {
    const isComment = /^\s*(\/\/|#|\/\*|\*|{{--)/.test(line);
    if (isComment) return (
      <div key={i} style={{ display: "flex", minHeight: "1.7em" }}>
        <span style={{ color: "#8a8070", minWidth: 28, textAlign: "right", marginRight: 14, fontSize: 10, userSelect: "none", paddingTop: 2 }}>{i + 1}</span>
        <span style={{ color: "#8a8070", fontStyle: "italic" }}>{line}</span>
      </div>
    );
    const parts = line.split(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\$[a-zA-Z_]\w*|\b\d+(?:\.\d+)?\b|\b[a-zA-Z_]\w*\b)/g);
    return (
      <div key={i} style={{ display: "flex", minHeight: "1.7em" }}>
        <span style={{ color: "#8a8070", minWidth: 28, textAlign: "right", marginRight: 14, fontSize: 10, userSelect: "none", paddingTop: 2 }}>{i + 1}</span>
        <span>
          {parts.map((p: string, j: number) => {
            if (!p) return null;
            if (p.startsWith("$")) return <span key={j} style={{ color: "#c0392b" }}>{p}</span>;
            if (PHP_KW.has(p)) return <span key={j} style={{ color: "#1a3a6b", fontWeight: 700 }}>{p}</span>;
            if (p.startsWith('"') || p.startsWith("'")) return <span key={j} style={{ color: "#1a6b3c" }}>{p}</span>;
            if (/^\d/.test(p)) return <span key={j} style={{ color: "#7d6608" }}>{p}</span>;
            if (/^[A-Z]/.test(p)) return <span key={j} style={{ color: "#6c3483" }}>{p}</span>;
            return <span key={j} style={{ color: "#2c2416" }}>{p}</span>;
          })}
        </span>
      </div>
    );
  });
}

// ─── CODE BLOCK ────────────────────────────────────────────────
function CodeBlock({ code, output, cmd, stripe }: {
  code: string;
  output?: string;
  cmd?: string;
  stripe: string;
}) {
  const [tab, setTab] = useState("code");
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(tab === "code" ? code : output || "");
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", border: "1.5px solid var(--rule)", borderRadius: 0, overflow: "hidden", background: "var(--card)" }}>
      {/* toolbar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 14px", borderBottom: "1.5px solid var(--rule)", background: "var(--ghost)", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 2 }}>
          {[["code", "CODE"], ["output", "OUTPUT"]].map(([v, lbl]: string[]) => (
            <button key={v} onClick={() => setTab(v)} style={{ padding: "4px 12px", border: "1.5px solid", borderColor: tab === v ? stripe : "transparent", background: tab === v ? "var(--paper)" : "transparent", color: tab === v ? stripe : "#8a8070", fontSize: 10, fontWeight: 800, fontFamily: "var(--mono)", letterSpacing: "0.08em", cursor: "pointer", transition: "all 0.15s" }}>
              {lbl}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {cmd && <code style={{ fontSize: 10, color: stripe, background: "var(--paper)", padding: "2px 8px", border: `1px solid ${stripe}40`, fontFamily: "var(--mono)" }}>{cmd}</code>}
          <button onClick={copy} style={{ fontSize: 10, fontWeight: 700, fontFamily: "var(--mono)", padding: "3px 10px", border: "1px solid var(--rule)", background: copied ? "var(--paper)" : "transparent", color: copied ? stripe : "#8a8070", cursor: "pointer" }}>
            {copied ? "✓ COPIED" : "COPY"}
          </button>
        </div>
      </div>
      {/* content */}
      <div style={{ flex: 1, overflow: "auto", padding: "16px 14px" }}>
        {tab === "code"
          ? <pre style={{ margin: 0, fontFamily: "var(--mono)", fontSize: 12.5, lineHeight: 1.7 }}>{hl(code)}</pre>
          : <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#8a8070", marginBottom: 10, borderBottom: "1px solid var(--rule)", paddingBottom: 8 }}>
              <span style={{ color: stripe }}>$</span> {cmd}
            </div>
            <pre style={{ margin: 0, fontFamily: "var(--mono)", fontSize: 12.5, lineHeight: 1.7, color: "#2c2416", whiteSpace: "pre-wrap" }}>{output}</pre>
          </div>
        }
      </div>
    </div>
  );
}

// ─── OVERVIEW ──────────────────────────────────────────────────
function Overview({ onSelect }: { onSelect: (i: number) => void }) {
  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "48px 24px 64px", animation: "fadeIn 0.3s ease" }}>
      {/* Hero */}
      <div style={{ borderBottom: "2px solid var(--ink)", paddingBottom: 40, marginBottom: 48 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 32, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700, color: "var(--red)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ display: "inline-block", width: 24, height: 2, background: "var(--red)" }} />
              University Curriculum · Backend Development
            </div>
            <h1 style={{ fontFamily: "var(--sans)", fontSize: "clamp(36px,5vw,64px)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.03em", color: "var(--ink)", margin: "0 0 20px" }}>
              Laravel<br />
              <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400, color: "var(--red)" }}>Web Development</span>
            </h1>
            <p style={{ fontFamily: "var(--mono)", fontSize: 12.5, color: "#5a5040", lineHeight: 1.8, maxWidth: 480, margin: "0 0 24px" }}>
              Beginner → Intermediate → Advanced<br />
              10–12 Weeks · Real-world Backend &amp; API Development
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[["17", "Modules"], ["12", "Weeks"], ["Hands-on", "Labs"], ["1", "Final Project"]].map(([n, l]) => (
                <div key={l} style={{ border: "1.5px solid var(--ink)", padding: "6px 14px", fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700, background: "transparent" }}>
                  <span style={{ color: "var(--red)" }}>{n}</span> {l}
                </div>
              ))}
            </div>
          </div>
          {/* Grading box */}
          <div style={{ width: 280, border: "1.5px solid var(--ink)", padding: 24, background: "var(--card)" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8a8070", borderBottom: "1px solid var(--rule)", paddingBottom: 10, marginBottom: 16 }}>
              Grading Breakdown
            </div>
            {GRADING.map((g: GradingItem) => (
              <div key={g.label} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700, color: "var(--ink)", display: "flex", alignItems: "center", gap: 8 }}><g.icon size={14} style={{ color: g.stripe }} /> {g.label}</span>
                  <span style={{ fontFamily: "var(--sans)", fontSize: 20, fontWeight: 900, color: g.stripe }}>{g.pct}%</span>
                </div>
                <div style={{ height: 3, background: "var(--ghost)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${g.pct}%`, background: g.stripe }} />
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "#8a8070", marginTop: 4 }}>{g.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Module Grid */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700, color: "#8a8070", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 24 }}>
          Course Modules ──────────────────────────────────────────────────
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 1, border: "1.5px solid var(--ink)", overflow: "hidden" }}>
          {MODULES.map((m: Module, i: number) => (
            <button key={m.id} className="module-card" onClick={() => onSelect(i)}
              style={{ textAlign: "left", background: "var(--card)", border: "none", borderRight: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)", padding: "22px 24px", cursor: "pointer", transition: "background 0.15s", position: "relative", overflow: "hidden" }}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.background = m.stripe + "0d")}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.background = "var(--card)")}
            >
              {/* color stripe top */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: m.stripe }} />
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700, color: m.stripe, letterSpacing: "0.08em" }}>
                    {m.num}
                  </span>
                  {m.optional && <span style={{ fontSize: 9, fontWeight: 700, fontFamily: "var(--mono)", color: "#8a8070", border: "1px solid var(--rule)", padding: "1px 6px" }}>OPTIONAL</span>}
                </div>
                <m.icon size={20} strokeWidth={2.5} style={{ color: m.stripe }} />
              </div>
              <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 800, color: "var(--ink)", lineHeight: 1.25, marginBottom: 8 }}>{m.title}</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#6a5840", lineHeight: 1.5, marginBottom: 14 }}>{m.goal}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "#8a8070" }}>{m.week}</span>
                <span className="arrow" style={{ fontFamily: "var(--mono)", fontSize: 11, color: m.stripe, fontWeight: 700, transition: "transform 0.2s" }}>View →</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── LARAVEL STRUCTURE VIEWER ──────────────────────────────────
const FOLDERS = [
  { name: "app/", analogy: "🧠 Brain (Logic) — ខួរក្បាល", desc: "The heart of your app. Contains Controllers (waiters), Models (data), and Middleware (filters).", color: "var(--red)", items: ["Http/Controllers", "Models", "Http/Middleware", "Http/Requests"] },
  { name: "routes/", analogy: "🗺️ Map (URLs) — ផែនទី", desc: "The traffic controller. Maps URLs to specific logic. web.php is for browsers, api.php is for data.", color: "var(--blue)", items: ["web.php", "api.php", "console.php"] },
  { name: "resources/views/", analogy: "🎨 UI (HTML) — ចំណុចប្រទាក់", desc: "Where your Blade templates live. HTML + Laravel logic that the user actually sees.", color: "var(--purple)", items: ["welcome.blade.php", "layouts/", "components/"] },
  { name: "database/", analogy: "🗄️ Storage (Data) — មូលដ្ឋានទិន្នន័យ", desc: "Blueprints for your database tables (Migrations) and fake test data (Seeders).", color: "var(--amber)", items: ["migrations/", "seeders/", "factories/"] },
  { name: "public/", analogy: "🚪 Door (Entry) — ទ្វារ/ច្រកចូល", desc: "The ONLY folder accessible to the world. Contains the index.php entry point and assets.", color: "var(--green)", items: ["index.php", "css/", "js/", "img/"] },
  { name: "config/", analogy: "⚙️ Configuration — ការកំណត់", desc: "Central settings for database, mail, services, and app-wide behavior.", color: "var(--teal)", items: ["app.php", "database.php", "auth.php"] },
  { name: ".env", analogy: "🔐 Secrets — អាថ៌កំបាំង", desc: "Environment variables (Passwords, API keys). Most important: NEVER share or commit this file!", color: "var(--pink)", isFile: true },
  { name: "vendor/", analogy: "📦 Tools — កញ្ចប់ជំនួយ", desc: "Third-party libraries used by Laravel (installed via Composer). Do not edit manually.", color: "#8a8070" },
];

const FLOW_STEPS = [
  { step: "USER", icon: Users, desc: "User types /products in browser", color: "var(--ink)" },
  { step: "ROUTE", icon: Milestone, desc: "Matches URL to Controller action", code: "Route::get('/products', [ProductController::class, 'index']);", color: "var(--blue)" },
  { step: "CONTROLLER", icon: Cpu, desc: "Handles logic: Gets data, picks View", code: "public function index() {\n  $products = Product::all();\n  return view('products.index', ['products' => $products]);\n}", color: "var(--red)" },
  { step: "MODEL", icon: Database, desc: "Asks database for all product records", code: "$products = Product::all();", color: "var(--amber)" },
  { step: "VIEW", icon: Layout, desc: "Compiles HTML with dynamic data", code: "@foreach($products as $p)\n  <h1>{{ $p->name }}</h1>\n@endforeach", color: "var(--purple)" },
  { step: "RESPONSE", icon: Globe, desc: "User sees finished webpage", color: "var(--green)" },
];

function LaravelStructure() {
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState<"tree" | "flow">("tree");
  const [flowIdx, setFlowIdx] = useState(0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, animation: "fadeIn 0.4s ease" }}>
      {/* Mode Switcher */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, borderBottom: "1.5px solid var(--rule)", paddingBottom: 24 }}>
        <button onClick={() => setMode("tree")} style={{ padding: "10px 24px", background: mode === "tree" ? "var(--ink)" : "transparent", color: mode === "tree" ? "var(--paper)" : "var(--ink)", border: "1.5px solid var(--ink)", fontFamily: "var(--mono)", fontWeight: 800, fontSize: 11, cursor: "pointer", transition: "0.2s" }}>
          FOLDER STRUCTURE
        </button>
        <button onClick={() => setMode("flow")} style={{ padding: "10px 24px", background: mode === "flow" ? "var(--ink)" : "transparent", color: mode === "flow" ? "var(--paper)" : "var(--ink)", border: "1.5px solid var(--ink)", fontFamily: "var(--mono)", fontWeight: 800, fontSize: 11, cursor: "pointer", transition: "0.2s" }}>
          REQUEST FLOW (THE LIFE OF A REQUEST)
        </button>
      </div>

      {mode === "tree" ? (
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 32, alignItems: "start" }}>
          {/* Tree Side */}
          <div style={{ background: "var(--card)", border: "1.5px solid var(--ink)", padding: 20 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700, color: "#8a8070", marginBottom: 16 }}>laravel-project /</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {FOLDERS.map((f, i) => (
                <button key={f.name} onClick={() => setActive(i)} style={{ width: "100%", textAlign: "left", padding: "8px 12px", background: active === i ? f.color : "transparent", color: active === i ? "#fff" : "var(--ink)", border: "none", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", transition: "0.1s" }}>
                  {f.isFile ? <FileText size={14} /> : active === i ? <FolderOpen size={14} /> : <Folder size={14} />}
                  <span style={{ fontFamily: "var(--mono)", fontSize: 13, fontWeight: active === i ? 700 : 400 }}>{f.name}</span>
                </button>
              ))}
            </div>
          </div>
          {/* Info Side */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: "8px 0" }}>
            <div style={{ borderLeft: `6px solid ${FOLDERS[active].color}`, paddingLeft: 24 }}>
              <div style={{ fontFamily: "var(--sans)", fontSize: 32, fontWeight: 900, marginBottom: 8, color: FOLDERS[active].color }}>
                {FOLDERS[active].analogy}
              </div>
              <p style={{ fontFamily: "var(--mono)", fontSize: 15, color: "var(--ink)", lineHeight: 1.6, maxWidth: 600 }}>
                {FOLDERS[active].desc}
              </p>
            </div>
            {FOLDERS[active].items && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                {FOLDERS[active].items?.map((item, idx) => (
                  <div key={idx} style={{ padding: "12px 16px", background: "var(--card)", border: "1.5px solid var(--rule)", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: FOLDERS[active].color }} />
                    <span style={{ fontFamily: "var(--mono)", fontSize: 12, fontWeight: 700 }}>{item}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ marginTop: 12, padding: "16px 20px", background: "var(--ghost)", border: "1px dashed var(--rule)", display: "flex", gap: 12, alignItems: "center" }}>
              <HelpCircle size={20} style={{ color: "#8a8070" }} />
              <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#8a8070" }}>
                <b>Teaching Tip:</b> Remind students that <b>app</b> and <b>routes</b> are where they will spend 90% of their time.
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Request Flow Mode */
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
            {FLOW_STEPS.map((s, i) => (
              <div key={s.step} onClick={() => setFlowIdx(i)} style={{ cursor: "pointer", transition: "0.3s", opacity: flowIdx === i ? 1 : 0.4 }}>
                <div style={{ border: flowIdx === i ? `2.5px solid ${s.color}` : "1.5px solid var(--rule)", background: flowIdx === i ? `${s.color}10` : "transparent", padding: "16px", textAlign: "center", marginBottom: 12, position: "relative" }}>
                  <s.icon size={22} style={{ color: s.color, marginBottom: 8 }} />
                  <div style={{ fontFamily: "var(--mono)", fontSize: 10, fontWeight: 900, color: s.color }}>{s.step}</div>
                  {i < FLOW_STEPS.length - 1 && (
                    <div style={{ position: "absolute", right: -20, top: "50%", transform: "translateY(-50%)", zIndex: 1, color: "var(--rule)" }}>
                      <MoveRight size={16} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "stretch" }}>
            {/* Step Detail */}
            <div style={{ border: `3px solid ${FLOW_STEPS[flowIdx].color}`, padding: 32, background: "var(--paper)" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#8a8070", marginBottom: 16 }}>STEP {flowIdx + 1} OF 6</div>
              <h3 style={{ fontFamily: "var(--sans)", fontSize: 36, fontWeight: 900, color: FLOW_STEPS[flowIdx].color, marginBottom: 12 }}>
                {FLOW_STEPS[flowIdx].step}
              </h3>
              <p style={{ fontFamily: "var(--sans)", fontSize: 18, fontWeight: 700, lineHeight: 1.5 }}>
                {FLOW_STEPS[flowIdx].desc}
              </p>
              <div style={{ marginTop: 40, display: "flex", gap: 8 }}>
                 <button onClick={() => setFlowIdx(i => Math.max(0, i-1))} disabled={flowIdx === 0} style={{ padding: "12px 20px", border: "1.5px solid var(--ink)", flex: 1, fontFamily: "var(--mono)", fontSize: 12, fontWeight: 700 }}>← PREVIOUS</button>
                 <button onClick={() => setFlowIdx(i => Math.min(FLOW_STEPS.length-1, i+1))} disabled={flowIdx === FLOW_STEPS.length-1} style={{ padding: "12px 20px", border: "1.5px solid var(--ink)", flex: 1, background: "var(--ink)", color: "var(--paper)", fontFamily: "var(--mono)", fontSize: 12, fontWeight: 700 }}>NEXT STEP →</button>
              </div>
            </div>
            {/* Code Context */}
            {FLOW_STEPS[flowIdx].code && (
              <div style={{ height: "100%" }}>
                <CodeBlock code={FLOW_STEPS[flowIdx].code} stripe={FLOW_STEPS[flowIdx].color} output="Execution context..." cmd={`laravel/${FLOW_STEPS[flowIdx].step.toLowerCase()}`} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MODULE PAGE ───────────────────────────────────────────────
function ModulePage({ mod: m, onBack }: { mod: Module; onBack: () => void }) {
  const [tab, setTab] = useState<string>("overview");
  const tabs = [
    { id: "overview", label: "OVERVIEW" },
    m.id === "m01" && { id: "structure", label: "STRUCTURE" },
    { id: "concepts", label: "CONCEPTS" },
    { id: "lab", label: "LAB" },
    { id: "code", label: "CODE" },
  ].filter(Boolean) as { id: string, label: string }[];
  return (
    <div style={{ animation: "fadeIn 0.25s ease" }}>
      {/* Sticky module header */}
      <div style={{ position: "sticky", top: 56, zIndex: 9, background: "var(--paper)", borderBottom: "1.5px solid var(--ink)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 54 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={onBack} style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700, padding: "5px 12px", border: "1.5px solid var(--ink)", background: "transparent", color: "var(--ink)", letterSpacing: "0.06em" }}>
              ← BACK
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <m.icon size={26} strokeWidth={2.5} style={{ color: m.stripe, transform: "translateY(1px)" }} />
              <div style={{ width: 1.5, height: 28, background: "var(--rule)" }} />
              <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, fontWeight: 700, color: m.stripe, letterSpacing: "0.1em", textTransform: "uppercase" }}>MODULE {m.num} · {m.week}</div>
                <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 800, color: "var(--ink)", lineHeight: 1.2 }}>{m.title}</div>
              </div>
            </div>
          </div>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, borderLeft: "1px solid var(--rule)" }}>
            {tabs.map((t: { id: string, label: string }) => (
              <button key={t.id} className="tab-btn" onClick={() => setTab(t.id)} style={{ padding: "0 18px", height: 54, border: "none", borderLeft: "1px solid var(--rule)", background: tab === t.id ? "var(--card)" : "transparent", color: tab === t.id ? m.stripe : "#8a8070", fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer", borderBottom: tab === t.id ? `2px solid ${m.stripe}` : "2px solid transparent", transition: "all 0.15s" }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 24px 64px", animation: "slideIn 0.25s ease" }}>

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div>
            {/* Goal banner */}
            <div style={{ borderLeft: `4px solid ${m.stripe}`, paddingLeft: 24, marginBottom: 40 }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700, color: m.stripe, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Learning Goal</div>
              <div style={{ fontFamily: "var(--sans)", fontSize: "clamp(20px,3vw,28px)", fontWeight: 800, color: "var(--ink)", lineHeight: 1.2 }}>{m.goal}</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              {/* Topics */}
              <div style={{ border: "1.5px solid var(--ink)", padding: "28px" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700, color: "#8a8070", letterSpacing: "0.1em", textTransform: "uppercase", borderBottom: "1px solid var(--rule)", paddingBottom: 12, marginBottom: 20 }}>
                  Topics Covered
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {m.topics.map((t: Topic, i: number) => (
                    <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                      <div style={{ width: 22, height: 22, background: m.stripe, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", fontFamily: "var(--mono)", fontWeight: 700, flexShrink: 0, marginTop: 4 }}>
                        {String(i + 1).padStart(2, "0").slice(-2)}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <div style={{ fontFamily: "var(--mono)", fontSize: 13, fontWeight: 700, color: "var(--ink)", lineHeight: 1.4 }}>{t.title}</div>
                        <div style={{ fontFamily: "var(--mono)", fontSize: 11.5, color: "#8a8070", lineHeight: 1.5 }}>{t.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right column */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Pro Tip */}
                <div style={{ border: "1.5px solid var(--amber)", padding: "22px", background: "rgba(251,146,60,0.05)" }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700, color: "var(--amber)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
                    ◆ Pro Tip
                  </div>
                  <p style={{ fontFamily: "var(--serif)", fontSize: 14, color: "#4a3c0a", lineHeight: 1.7, fontStyle: "italic", margin: 0 }}>
                    "{m.tip}"
                  </p>
                </div>
                {/* Lab callout */}
                <div style={{ border: `1.5px solid ${m.stripe}`, padding: "22px", display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700, color: m.stripe, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Lab Exercise</div>
                    <div style={{ fontFamily: "var(--sans)", fontSize: 17, fontWeight: 800, color: "var(--ink)" }}>{m.lab.title}</div>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {m.lab.steps.slice(0, 2).map((s: string, i: number) => (
                      <div key={i} style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#6a5840", display: "flex", gap: 6, alignItems: "flex-start" }}>
                        <span style={{ color: m.stripe, fontWeight: 700 }}>→</span> {s}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setTab("lab")} style={{ border: `1.5px solid ${m.stripe}`, background: m.stripe, color: "#fff", fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700, padding: "9px 18px", letterSpacing: "0.08em", alignSelf: "flex-start", cursor: "pointer" }}>
                    START LAB →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STRUCTURE (MOD 1 ONLY) ── */}
        {tab === "structure" && (
          <div>
            <div style={{ borderBottom: "1.5px solid var(--ink)", paddingBottom: 20, marginBottom: 32, display: "flex", alignItems: "baseline", gap: 16 }}>
              <h2 style={{ fontFamily: "var(--sans)", fontSize: 28, fontWeight: 900, color: "var(--ink)", letterSpacing: "-0.02em" }}>Visualizing Laravel</h2>
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#8a8070" }}>Folders & Flow</span>
            </div>
            <LaravelStructure />
          </div>
        )}

        {/* ── CONCEPTS ── */}
        {tab === "concepts" && (
          <div>
            <div style={{ borderBottom: "1.5px solid var(--ink)", paddingBottom: 20, marginBottom: 32, display: "flex", alignItems: "baseline", gap: 16 }}>
              <h2 style={{ fontFamily: "var(--sans)", fontSize: 28, fontWeight: 900, color: "var(--ink)", letterSpacing: "-0.02em" }}>Key Concepts</h2>
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#8a8070" }}>Understand before the lab</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, border: "1.5px solid var(--ink)", overflow: "hidden", marginBottom: 28 }}>
              {m.concepts.map((c: Concept, i: number) => (
                <div key={i} style={{ padding: "24px", borderRight: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)", background: "#fff", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 2, background: m.stripe }} />
                  <div style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700, color: m.stripe, marginBottom: 10, letterSpacing: "0.04em" }}>
                    {String(i + 1).padStart(2, "0")} / {c.term}
                  </div>
                  <p style={{ fontFamily: "var(--mono)", fontSize: 12.5, color: "#3a2c18", lineHeight: 1.65, margin: 0 }}>{c.def}</p>
                </div>
              ))}
            </div>
            {/* Tip */}
            <div style={{ display: "flex", gap: 16, padding: "20px 24px", background: "rgba(251,146,60,0.05)", border: "1.5px solid var(--amber)" }}>
              <div style={{ fontFamily: "var(--sans)", fontSize: 24, lineHeight: 1 }}>💡</div>
              <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700, color: "var(--amber)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Remember</div>
                <p style={{ fontFamily: "var(--serif)", fontSize: 13.5, color: "#4a3c0a", fontStyle: "italic", lineHeight: 1.7, margin: 0 }}>"{m.tip}"</p>
              </div>
            </div>
          </div>
        )}

        {/* ── LAB ── */}
        {tab === "lab" && (
          <div>
            <div style={{ borderBottom: "1.5px solid var(--ink)", paddingBottom: 20, marginBottom: 32, display: "flex", alignItems: "baseline", gap: 16 }}>
              <h2 style={{ fontFamily: "var(--sans)", fontSize: 28, fontWeight: 900, color: "var(--ink)", letterSpacing: "-0.02em" }}>
                Lab: {m.lab.title}
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              {/* Steps */}
              <div style={{ border: "1.5px solid var(--ink)", padding: "28px" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700, color: "#8a8070", letterSpacing: "0.1em", textTransform: "uppercase", borderBottom: "1px solid var(--rule)", paddingBottom: 12, marginBottom: 22 }}>
                  Step-by-Step
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {m.lab.steps.map((s: string, i: number) => (
                    <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                      <div style={{ width: 28, height: 28, background: m.stripe, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--mono)", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                        {i + 1}
                      </div>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 12.5, color: "var(--ink)", lineHeight: 1.6, paddingTop: 4 }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Concepts used */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700, color: "#8a8070", letterSpacing: "0.1em", textTransform: "uppercase", paddingBottom: 12, borderBottom: "1px solid var(--rule)", marginBottom: 2 }}>
                  Concepts Used in This Lab
                </div>
                {m.concepts.map((c: Concept, i: number) => (
                  <div key={i} style={{ padding: "14px 16px", border: `1.5px solid ${m.stripe}20`, borderLeft: `3px solid ${m.stripe}`, background: "#fff" }}>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700, color: m.stripe, marginBottom: 5 }}>{c.term}</div>
                    <p style={{ fontFamily: "var(--mono)", fontSize: 11.5, color: "#4a3c24", margin: 0, lineHeight: 1.5 }}>{c.def}</p>
                  </div>
                ))}
              </div>
              {/* Tip */}
              <div style={{ gridColumn: "1/-1", display: "flex", gap: 14, padding: "18px 22px", background: "rgba(251,146,60,0.05)", border: "1.5px solid var(--amber)" }}>
                <span style={{ fontFamily: "var(--sans)", fontSize: 20 }}>💡</span>
                <p style={{ fontFamily: "var(--serif)", fontSize: 13.5, color: "#4a3c0a", fontStyle: "italic", lineHeight: 1.7, margin: 0 }}>{m.tip}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── CODE ── */}
        {tab === "code" && (
          <div>
            <div style={{ borderBottom: "1.5px solid var(--ink)", paddingBottom: 20, marginBottom: 28, display: "flex", alignItems: "baseline", gap: 16 }}>
              <h2 style={{ fontFamily: "var(--sans)", fontSize: 28, fontWeight: 900, color: "var(--ink)", letterSpacing: "-0.02em" }}>
                Code: {m.lab.title}
              </h2>
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#8a8070" }}>Study and run locally</span>
            </div>
            <div style={{ height: 480, marginBottom: 24 }}>
              <CodeBlock code={m.lab.code} output={m.lab.output} cmd={m.lab.cmd} stripe={m.stripe} />
            </div>
            {/* All 4 concepts below code */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, border: "1.5px solid var(--ink)", overflow: "hidden" }}>
              {m.concepts.map((c: Concept, i: number) => (
                <div key={i} style={{ padding: "18px 20px", borderRight: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)", background: "#fff" }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700, color: m.stripe, marginBottom: 6 }}>{c.term}</div>
                  <p style={{ fontFamily: "var(--mono)", fontSize: 11.5, color: "#4a3c24", margin: 0, lineHeight: 1.55 }}>{c.def}</p>
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
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const goTo = useCallback((i: number) => setSelected(i), []);
  const back = useCallback(() => setSelected(null), []);

  const m = selected !== null ? MODULES[selected] : null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selected === null) return;
      if (e.key === "ArrowLeft") {
        setSelected(s => (s !== null ? Math.max(0, s - 1) : null));
      } else if (e.key === "ArrowRight") {
        setSelected(s => (s !== null ? Math.min(MODULES.length - 1, s + 1) : null));
      } else if (e.key === "Escape") {
        setSelected(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected]);

  return (
    <div style={{ fontFamily: "var(--sans)", minHeight: "100vh", background: "var(--paper)", color: "var(--ink)" }}>
      <style>{G(theme)}</style>

      {/* Top nav */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "var(--paper)", borderBottom: "1.5px solid var(--ink)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={back}>
            <div style={{ width: 30, height: 30, background: "var(--red)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#fff", fontWeight: 900, fontFamily: "var(--mono)" }}>L</div>
            <div>
              <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 900, letterSpacing: "-0.01em", color: "var(--ink)" }}>Laravel</span>
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "#8a8070", marginLeft: 8 }}>University Edition</span>
            </div>
          </div>

          {/* Module nav */}
          {selected !== null && m && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={() => setSelected(s => (s !== null ? Math.max(0, s - 1) : null))}
                disabled={selected === 0}
                style={{ padding: "5px 12px", border: "1.5px solid", borderColor: selected === 0 ? "var(--rule)" : "var(--ink)", background: "transparent", fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700, color: selected === 0 ? "var(--rule)" : "var(--ink)", letterSpacing: "0.06em", cursor: selected === 0 ? "not-allowed" : "pointer" }}
              >← PREV</button>
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#8a8070", minWidth: 50, textAlign: "center" }}>
                {selected + 1} / {MODULES.length}
              </span>
              <button
                onClick={() => setSelected(s => (s !== null ? Math.min(MODULES.length - 1, s + 1) : null))}
                disabled={selected === MODULES.length - 1}
                style={{ padding: "5px 12px", border: "1.5px solid", borderColor: selected === MODULES.length - 1 ? "var(--rule)" : "var(--ink)", background: "transparent", fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700, color: selected === MODULES.length - 1 ? "var(--rule)" : "var(--ink)", letterSpacing: "0.06em", cursor: selected === MODULES.length - 1 ? "not-allowed" : "pointer" }}
              >NEXT →</button>
            </div>
          )}

          {/* Module count badge */}
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "#8a8070", display: "flex", alignItems: "center", gap: 6 }}>
            {m ? (
              <span style={{ color: m.stripe, fontWeight: 700 }}>MODULE {m.num}</span>
            ) : (
              <span>17 Modules · PHP + Laravel</span>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? "Switch to Projector Mode (Light)" : "Switch to Dark Mode"}
            style={{
              padding: "6px 12px",
              border: "1.5px solid var(--ink)",
              background: theme === 'light' ? "var(--ink)" : "transparent",
              color: theme === 'light' ? "var(--paper)" : "var(--ink)",
              fontFamily: "var(--mono)",
              fontSize: 10,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.2s"
            }}
          >
            <Monitor size={14} />
            {theme === 'dark' ? "PROJECTOR" : "DARK MODE"}
          </button>
        </div>

        {/* Progress bar */}
        {selected !== null && m && (
          <div style={{ height: 2, background: "var(--ghost)" }}>
            <div style={{ height: "100%", width: `${((selected + 1) / MODULES.length) * 100}%`, background: m.stripe, transition: "width 0.4s ease" }} />
          </div>
        )}
      </div>

      {/* Page */}
      {m === null
        ? <Overview onSelect={goTo} />
        : <ModulePage mod={m} onBack={back} />
      }
    </div>
  );
}