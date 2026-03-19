"use client";

import React, { useState, useEffect, useCallback, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ChevronLeft, ChevronRight, Code2, Copy, Check, Play, RotateCcw,
  Server, Database, Globe, Globe2, Lock, Shield, ShieldAlert, ShieldCheck,
  Search, Send, Activity, Layers, List, RefreshCw, Zap, Sparkles,
  Key, Link as LinkIcon, FileCode, Package, Box, ArrowRight,
  Terminal, Rocket, HardDrive, Layout, Workflow,
} from 'lucide-react';

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
    id: "00", title: "PHP & Laravel", subtitle: "The Engine Room",
    tag: "Overview", tagColor: "#34d399", accent: "#10b981",
    bg: "radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    content: [
      "PHP powers 77% of all websites on the internet",
      "Laravel is the most popular PHP framework in the world",
      "Backend handles data, auth, and logic users never see",
      "Database: the place where application data persists",
    ],
    lab: "List three types of data a web app needs to store (e.g., users, posts).",
    syntax: `// PHP runs on the server\n// Laravel adds structure, routing & tools\n// MySQL or PostgreSQL stores your data`,
    code: `<?php\n// Your first PHP script\necho "Hello from the Backend!";\n\n// PHP is embedded in HTML\n// or used as a pure API backend\n\n$name = "Student";\n$version = PHP_VERSION;\n\necho "Welcome, $name!";\necho "Running PHP $version";`,
    icon: Database,
  },
  {
    id: "01", title: "PHP Basics", subtitle: "Variables & Types",
    tag: "PHP", tagColor: "#818cf8", accent: "#6366f1",
    bg: "radial-gradient(ellipse at 70% 30%, rgba(99,102,241,0.12) 0%, transparent 60%)",
    content: [
      "All PHP variables start with a $ dollar sign",
      "PHP is loosely typed — types are inferred automatically",
      "Strings use single ' or double \" quotes",
      "echo or print output values to the response",
    ],
    lab: "Create a variable $fruit = 'mango' and echo it inside a sentence.",
    syntax: `$name   = "Ratha";   // string\n$age    = 21;        // integer\n$price  = 9.99;      // float\n$active = true;      // boolean\n$items  = [1, 2, 3]; // array`,
    code: `<?php\n$name  = "Ratha";\n$age   = 21;\n$score = 98.5;\n$pass  = true;\n\n// String interpolation with double quotes\necho "Hello, $name! You are $age years old.";\n\n// Concatenation with dot operator\necho "Score: " . $score;\n\n// Conditional\nif ($pass) {\n    echo "You passed!";\n} else {\n    echo "Try again.";\n}`,
    icon: Code2,
  },
  {
    id: "02", title: "Arrays & Loops", subtitle: "Working with Lists",
    tag: "PHP", tagColor: "#22d3ee", accent: "#06b6d4",
    bg: "radial-gradient(ellipse at 30% 70%, rgba(6,182,212,0.12) 0%, transparent 60%)",
    content: [
      "Indexed arrays — list of values with numeric keys",
      "Associative arrays — key => value pairs (like JS objects)",
      "foreach — the most common loop for arrays in PHP",
      "count() — returns the number of items in an array",
    ],
    lab: "Create an associative array for a 'student' and echo their name.",
    syntax: `$arr = ['a', 'b', 'c'];\n\nforeach ($arr as $item) {\n    echo $item;\n}\n\n// Associative\n$user = ['name' => 'Ratha', 'age' => 21];`,
    code: `<?php\n// Indexed array\n$skills = ['PHP', 'Laravel', 'MySQL'];\n\nforeach ($skills as $skill) {\n    echo "- $skill\\n";\n}\n\n// Associative array\n$student = [\n    'name'  => 'Ratha',\n    'grade' => 'A',\n    'score' => 98,\n];\n\necho $student['name'];   // Ratha\necho count($skills);     // 3\n\n// Array functions\n$upper = array_map('strtoupper', $skills);\nsort($skills);`,
    icon: List,
  },
  {
    id: "03", title: "Functions & OOP", subtitle: "Code Organisation",
    tag: "PHP", tagColor: "#fbbf24", accent: "#f59e0b",
    bg: "radial-gradient(ellipse at 60% 40%, rgba(245,158,11,0.12) 0%, transparent 60%)",
    content: [
      "Functions are declared with the function keyword",
      "Classes group data (properties) and behaviour (methods)",
      "PHP supports full OOP: inheritance, interfaces, traits",
      "Constructor (__construct) runs when an object is created",
    ],
    lab: "Create a class 'Car' with a property $brand and a method describe().",
    syntax: `function greet(string $name): string {\n    return "Hello, $name!";\n}\n\nclass User {\n    public function __construct(\n        public string $name\n    ) {}\n}`,
    code: `<?php\n// Function with type hints\nfunction add(int $a, int $b): int {\n    return $a + $b;\n}\n\necho add(10, 25); // 35\n\n// Class\nclass Product {\n    public function __construct(\n        public string $name,\n        public float  $price,\n    ) {}\n\n    public function formatted(): string {\n        return "$this->name (\$$this->price)";\n    }\n}\n\n$p = new Product("Laptop", 999.99);\necho $p->formatted(); // Laptop ($999.99)`,
    icon: Box,
  },
  {
    id: "04", title: "Composer & Setup", subtitle: "PHP Package Manager",
    tag: "Setup", tagColor: "#fb923c", accent: "#f97316",
    bg: "radial-gradient(ellipse at 25% 55%, rgba(249,115,22,0.12) 0%, transparent 60%)",
    content: [
      "Composer is PHP's package manager — like npm for Node",
      "composer.json tracks your project dependencies",
      "Autoloading: Composer maps namespaces to file paths",
      "Install packages from Packagist (packagist.org)",
    ],
    lab: "Run 'composer init' and explore the generated composer.json.",
    syntax: `# Install a package\ncomposer require vendor/package\n\n# Install all dependencies\ncomposer install`,
    code: `// composer.json\n{\n    "name": "my/backend",\n    "require": {\n        "php": "^8.2",\n        "laravel/framework": "^11.0",\n        "tymon/jwt-auth": "^2.0"\n    },\n    "autoload": {\n        "psr-4": {\n            "App\\\\": "app/"\n        }\n    }\n}`,
    icon: Package,
  },
  {
    id: "05", title: "Laravel Install", subtitle: "Scaffold a New Project",
    tag: "Laravel", tagColor: "#f43f5e", accent: "#e11d48",
    bg: "radial-gradient(ellipse at 70% 60%, rgba(225,29,72,0.12) 0%, transparent 60%)",
    content: [
      "Laravel Installer or Composer creates a new project instantly",
      "The /app directory holds your Models, Controllers, Providers",
      "/routes holds your URL definitions — start with routes/api.php",
      "php artisan serve starts the local dev server on port 8000",
    ],
    lab: "Create a new Laravel project and run 'php artisan serve'.",
    syntax: `# Create a new project\ncomposer create-project laravel/laravel my-api\ncd my-api\nphp artisan serve`,
    code: `// Project structure\n// app/\n//   Models/         ← Eloquent models\n//   Http/\n//     Controllers/  ← Route handlers\n//     Middleware/   ← Before/after logic\n// routes/\n//   api.php         ← API routes\n//   web.php         ← Web routes\n// database/\n//   migrations/     ← Schema definitions\n// .env              ← Environment secrets\n\n// Artisan CLI — your best friend:\n// php artisan make:model Post -m\n// php artisan make:controller PostController`,
    icon: Zap,
  },
  {
    id: "06", title: "Routing", subtitle: "Mapping URLs to Logic",
    tag: "Laravel", tagColor: "#34d399", accent: "#10b981",
    bg: "radial-gradient(ellipse at 40% 25%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    content: [
      "Routes live in routes/api.php and routes/web.php",
      "Route::get(), post(), put(), delete() match HTTP verbs",
      "Route parameters: /users/{id} — accessed via $id",
      "Route::apiResource() generates all CRUD routes at once",
    ],
    lab: "Create a GET route /api/hello that returns a JSON greeting.",
    syntax: `Route::get('/users', [UserController::class, 'index']);\nRoute::post('/users', [UserController::class, 'store']);\nRoute::apiResource('posts', PostController::class);`,
    code: `<?php\n// routes/api.php\nuse App\\Http\\Controllers\\UserController;\nuse Illuminate\\Support\\Facades\\Route;\n\n// Simple closure route\nRoute::get('/ping', function () {\n    return response()->json(['status' => 'ok']);\n});\n\n// Controller routes\nRoute::get('/users',     [UserController::class, 'index']);\nRoute::post('/users',    [UserController::class, 'store']);\nRoute::get('/users/{id}', [UserController::class, 'show']);\nRoute::put('/users/{id}', [UserController::class, 'update']);\nRoute::delete('/users/{id}', [UserController::class, 'destroy']);\n\n// One line generates all 7 routes:\nRoute::apiResource('posts', PostController::class);`,
    icon: Workflow,
  },
  {
    id: "07", title: "Controllers", subtitle: "Request Handlers",
    tag: "Laravel", tagColor: "#818cf8", accent: "#6366f1",
    bg: "radial-gradient(ellipse at 55% 65%, rgba(99,102,241,0.12) 0%, transparent 60%)",
    content: [
      "Controllers handle incoming HTTP requests and return responses",
      "Generate with: php artisan make:controller UserController",
      "Request — read incoming data; Response — return JSON data",
      "Type-hint Request in method params — Laravel injects it automatically",
    ],
    lab: "Generate a UserController and add an index() method that returns 'hello'.",
    syntax: `php artisan make:controller UserController --api`,
    code: `<?php\nnamespace App\\Http\\Controllers;\n\nuse App\\Models\\User;\nuse Illuminate\\Http\\Request;\nuse Illuminate\\Http\\JsonResponse;\n\nclass UserController extends Controller\n{\n    // GET /api/users\n    public function index(): JsonResponse\n    {\n        $users = User::all();\n        return response()->json($users);\n    }\n\n    // POST /api/users\n    public function store(Request $request): JsonResponse\n    {\n        $user = User::create($request->validated());\n        return response()->json($user, 201);\n    }\n\n    // GET /api/users/{id}\n    public function show(User $user): JsonResponse\n    {\n        return response()->json($user);\n    }\n}`,
    icon: Server,
  },
  {
    id: "08", title: "Request & Response", subtitle: "I/O Handling",
    tag: "Laravel", tagColor: "#38bdf8", accent: "#0ea5e9",
    bg: "radial-gradient(ellipse at 20% 40%, rgba(14,165,233,0.12) 0%, transparent 60%)",
    content: [
      "$request->input('field') — read a single field from the body",
      "$request->all() — get all incoming data as an array",
      "$request->query('param') — read URL query string ?param=value",
      "response()->json($data, $status) — return JSON with status code",
    ],
    lab: "Read 'email' from a POST request body and return it as JSON.",
    syntax: `$name  = $request->input('name');\n$query = $request->query('search');\nreturn response()->json($data, 200);`,
    code: `<?php\npublic function search(Request $request): JsonResponse\n{\n    $term  = $request->query('q', '');\n    $limit = $request->query('limit', 10);\n\n    // Read JSON body fields\n    $name  = $request->input('name');\n    $email = $request->input('email');\n\n    // Read all fields at once\n    $all = $request->all();\n\n    return response()->json([\n        'query'   => $term,\n        'results' => [],\n        'limit'   => $limit,\n    ], 200);\n}`,
    icon: Send,
  },
  {
    id: "09", title: "Middleware", subtitle: "Before & After Logic",
    tag: "Laravel", tagColor: "#fbbf24", accent: "#f59e0b",
    bg: "radial-gradient(ellipse at 65% 35%, rgba(245,158,11,0.12) 0%, transparent 60%)",
    content: [
      "Middleware runs before (or after) the route handler",
      "Built-in: auth, throttle, verified, cors, and more",
      "Generate custom middleware: php artisan make:middleware LogRequest",
      "Apply via route definition or controller constructor"],
    lab: "Create a middleware that logs 'Ping!' on every request.",
    syntax: `php artisan make:middleware LogRequest\n\n// Apply to route:\nRoute::get('/data', handler)->middleware('log.request');`,
    code: `<?php\nnamespace App\\Http\\Middleware;\n\nuse Closure;\nuse Illuminate\\Http\\Request;\n\nclass LogRequest\n{\n    public function handle(Request $request, Closure $next): mixed\n    {\n        // --- BEFORE route handler ---\n        $start = microtime(true);\n        logger("→ {$request->method()} {$request->path()}");\n\n        $response = $next($request); // run the route\n\n        // --- AFTER route handler ---\n        $ms = round((microtime(true) - $start) * 1000);\n        logger("← {$response->status()} ({$ms}ms)");\n\n        return $response;\n    }\n}`,
    icon: Lock,
  },
  {
    id: "10", title: "Validation", subtitle: "Guarding Your Data",
    tag: "Laravel", tagColor: "#fb7185", accent: "#f43f5e",
    bg: "radial-gradient(ellipse at 35% 60%, rgba(244,63,94,0.12) 0%, transparent 60%)",
    content: [
      "$request->validate() throws a 422 automatically if rules fail",
      "Rules: required, string, email, min, max, unique, exists",
      "Form Requests — dedicated classes for complex validation logic",
      "Error messages are returned as JSON for API consumers"],
    lab: "Validate that 'email' is required, is a valid email, and is unique in users table.",
    syntax: `$request->validate([\n    'email' => 'required|email|unique:users',\n    'age'   => 'required|integer|min:18',\n]);`,
    code: `<?php\npublic function store(Request $request): JsonResponse\n{\n    // Automatically returns 422 JSON if invalid\n    $validated = $request->validate([\n        'name'     => 'required|string|max:100',\n        'email'    => 'required|email|unique:users,email',\n        'password' => 'required|string|min:8|confirmed',\n        'age'      => 'nullable|integer|min:16',\n    ]);\n\n    // Only reaches here if valid\n    $user = User::create($validated);\n\n    return response()->json($user, 201);\n}\n\n// Error response shape (automatic):\n// {\n//   "message": "The email field is required.",\n//   "errors": { "email": ["..."] }\n// }`,
    icon: ShieldCheck,
  },
  {
    id: "11", title: "Eloquent ORM", subtitle: "PHP Objects ↔ Database",
    tag: "Database", tagColor: "#34d399", accent: "#10b981",
    bg: "radial-gradient(ellipse at 70% 50%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    content: [
      "Eloquent maps a PHP class to a database table automatically",
      "Model name 'User' → table 'users' (plural, snake_case)",
      "Generate: php artisan make:model Post -m (creates migration too)",
      "Every model gets create(), find(), update(), delete() for free",
    ],
    lab: "Generate a Post model with a migration using the artisan command.",
    syntax: `php artisan make:model Post -m\n\n// Eloquent operations:\nPost::all();\nPost::find($id);\nPost::create($data);\n$post->update($data);`,
    code: `<?php\nnamespace App\\Models;\n\nuse Illuminate\\Database\\Eloquent\\Model;\n\nclass Post extends Model\n{\n    // Columns allowed for mass assignment\n    protected $fillable = [\n        'title',\n        'body',\n        'user_id',\n        'published',\n    ];\n\n    // Type casting\n    protected $casts = [\n        'published'  => 'boolean',\n        'created_at' => 'datetime',\n    ];\n\n    // Relationship: a Post belongs to a User\n    public function author()\n    {\n        return $this->belongsTo(User::class, 'user_id');\n    }\n}`,
    icon: Database,
  },
  {
    id: "12", title: "Migrations", subtitle: "Version-Controlled Schema",
    tag: "Database", tagColor: "#a78bfa", accent: "#8b5cf6",
    bg: "radial-gradient(ellipse at 25% 45%, rgba(139,92,246,0.12) 0%, transparent 60%)",
    content: [
      "Migrations define your database schema in PHP code",
      "up() creates the table; down() rolls it back",
      "php artisan migrate — run all pending migrations",
      "php artisan migrate:rollback — undo the last batch",
    ],
    lab: "Create a migration for a 'posts' table with title, body, and user_id.",
    syntax: `php artisan make:migration create_posts_table\nphp artisan migrate\nphp artisan migrate:rollback`,
    code: `<?php\n// database/migrations/2024_01_01_create_posts_table.php\nuse Illuminate\\Database\\Migrations\\Migration;\nuse Illuminate\\Database\\Schema\\Blueprint;\nuse Illuminate\\Support\\Facades\\Schema;\n\nreturn new class extends Migration\n{\n    public function up(): void\n    {\n        Schema::create('posts', function (Blueprint $table) {\n            $table->id();\n            $table->string('title');\n            $table->text('body');\n            $table->boolean('published')->default(false);\n            $table->foreignId('user_id')\n                  ->constrained()\n                  ->cascadeOnDelete();\n            $table->timestamps(); // created_at + updated_at\n        });\n    }\n\n    public function down(): void\n    {\n        Schema::dropIfExists('posts');\n    }\n};`,
    icon: HardDrive,
  },
  {
    id: "13", title: "CRUD: Create & Read", subtitle: "Saving & Fetching Data",
    tag: "Database", tagColor: "#fbbf24", accent: "#f59e0b",
    bg: "radial-gradient(ellipse at 55% 30%, rgba(245,158,11,0.12) 0%, transparent 60%)",
    content: [
      "Post::create($data) — inserts one row; returns the model",
      "Fields must be listed in \$fillable to prevent mass-assignment attack",
      "Post::all() — fetch every row as a collection",
      "Post::find($id) — fetch one by primary key (returns null if missing)",
    ],
    lab: "Create a POST /api/posts route that saves a new post to the database.",
    syntax: `$post = Post::create($request->validated());\n$posts = Post::all();\n$post  = Post::find($id);`,
    code: `<?php\n// CREATE\npublic function store(Request $request): JsonResponse\n{\n    $request->validate([\n        'title' => 'required|string|max:255',\n        'body'  => 'required|string',\n    ]);\n\n    $post = Post::create([\n        'title'   => $request->input('title'),\n        'body'    => $request->input('body'),\n        'user_id' => auth()->id(),\n    ]);\n\n    return response()->json($post, 201);\n}\n\n// READ ALL\npublic function index(): JsonResponse\n{\n    $posts = Post::latest()->get();\n    return response()->json($posts);\n}\n\n// READ ONE\npublic function show(Post $post): JsonResponse\n{\n    return response()->json($post);\n}`,
    icon: Send,
  },
  {
    id: "14", title: "CRUD: Update & Delete", subtitle: "Modifying Data",
    tag: "Database", tagColor: "#fb7185", accent: "#f43f5e",
    bg: "radial-gradient(ellipse at 70% 65%, rgba(244,63,94,0.12) 0%, transparent 60%)",
    content: [
      "$model->update($data) — saves changes to an existing row",
      "$model->delete() — permanently removes the row",
      "Route model binding: Laravel auto-fetches the model from the URL id",
      "findOrFail($id) — returns 404 automatically if not found"],
    lab: "Create a DELETE /api/posts/{id} route that removes the post.",
    syntax: `$post->update($request->validated());\n$post->delete();\nPost::findOrFail($id);`,
    code: `<?php\n// UPDATE\npublic function update(Request $request, Post $post): JsonResponse\n{\n    $post->update($request->validate([\n        'title' => 'sometimes|string|max:255',\n        'body'  => 'sometimes|string',\n    ]));\n\n    return response()->json($post);\n}\n\n// DELETE\npublic function destroy(Post $post): JsonResponse\n{\n    $post->delete();\n    return response()->json(null, 204); // No Content\n}\n\n// Route Model Binding (automatic!)\n// Route: /api/posts/{post}\n// Laravel fetches Post::findOrFail($id) for you`,
    icon: RefreshCw,
  },
  {
    id: "15", title: "Query Builder", subtitle: "Advanced Filtering",
    tag: "Database", tagColor: "#22d3ee", accent: "#06b6d4",
    bg: "radial-gradient(ellipse at 40% 70%, rgba(6,182,212,0.12) 0%, transparent 60%)",
    content: [
      "where() — filter rows by column value",
      "orderBy() — sort results ascending or descending",
      "paginate($n) — automatically paginates with links in the response",
      "Chaining: queries are lazy — nothing runs until ->get() or ->first()",
    ],
    lab: "Fetch 10 published posts sorted by newest first.",
    syntax: `Post::where('published', true)\n     ->orderBy('created_at', 'desc')\n     ->paginate(10);`,
    code: `<?php\n// Filtering\n$posts = Post::where('published', true)\n             ->where('user_id', auth()->id())\n             ->get();\n\n// Search\n$results = Post::where('title', 'like', "%$term%")\n               ->orWhere('body', 'like', "%$term%")\n               ->get();\n\n// Sorting + Pagination\n$page = Post::where('published', true)\n            ->orderBy('created_at', 'desc')\n            ->paginate(10); // returns { data, links, meta }\n\n// Limit & offset\n$top5 = Post::latest()->limit(5)->get();\n\n// Aggregates\n$count = Post::where('published', true)->count();\n$avg   = Order::avg('amount');`,
    icon: Search,
  },
  {
    id: "16", title: "Eloquent Relationships", subtitle: "Linking Tables",
    tag: "Database", tagColor: "#c084fc", accent: "#a855f7",
    bg: "radial-gradient(ellipse at 25% 35%, rgba(168,85,247,0.12) 0%, transparent 60%)",
    content: [
      "hasMany — one User has many Posts",
      "belongsTo — each Post belongs to one User",
      "hasOne — one User has one Profile",
      "belongsToMany — many Posts belong to many Tags (pivot table)",
    ],
    lab: "Add a posts() relationship to the User model.",
    syntax: `// User model\npublic function posts() {\n    return $this->hasMany(Post::class);\n}\n\n// Post model\npublic function author() {\n    return $this->belongsTo(User::class, 'user_id');\n}`,
    code: `<?php\n// User.php\nclass User extends Authenticatable\n{\n    // One user → many posts\n    public function posts()\n    {\n        return $this->hasMany(Post::class);\n    }\n\n    // One user → one profile\n    public function profile()\n    {\n        return $this->hasOne(Profile::class);\n    }\n}\n\n// Post.php\nclass Post extends Model\n{\n    // Each post → one author\n    public function author()\n    {\n        return $this->belongsTo(User::class, 'user_id');\n    }\n\n    // Each post → many tags (pivot)\n    public function tags()\n    {\n        return $this->belongsToMany(Tag::class);\n    }\n}`,
    icon: LinkIcon,
  },
  {
    id: "17", title: "Eager Loading", subtitle: "Avoiding N+1 Queries",
    tag: "Database", tagColor: "#4ade80", accent: "#22c55e",
    bg: "radial-gradient(ellipse at 60% 55%, rgba(34,197,94,0.12) 0%, transparent 60%)",
    content: [
      "N+1 problem: fetching 100 posts + 100 separate author queries",
      "with() — eager loads relationships in just 2 queries total",
      "withCount() — adds a _count column without loading all relations",
      "Lazy eager loading: $posts->load('author') after the fact",
    ],
    lab: "Fetch all posts and eager-load their author in a single query call.",
    syntax: `// BAD: N+1 queries\n$posts = Post::all();\nforeach ($posts as $p) { $p->author->name; }\n\n// GOOD: 2 queries\n$posts = Post::with('author')->get();`,
    code: `<?php\n// ❌ N+1 — 101 queries for 100 posts!\n$posts = Post::all();\nforeach ($posts as $post) {\n    echo $post->author->name; // a new query each time!\n}\n\n// ✅ Eager load — always 2 queries\n$posts = Post::with('author')->get();\n\n// ✅ Multiple relationships at once\n$posts = Post::with(['author', 'tags', 'comments'])->get();\n\n// ✅ Nested relationships\n$users = User::with('posts.comments')->get();\n\n// ✅ Counts without loading data\n$posts = Post::withCount('comments')->get();\necho $posts[0]->comments_count;`,
    icon: Zap,
  },
  {
    id: "18", title: "API Resources", subtitle: "Shaping JSON Output",
    tag: "Laravel", tagColor: "#f97316", accent: "#ea580c",
    bg: "radial-gradient(ellipse at 35% 25%, rgba(234,88,12,0.12) 0%, transparent 60%)",
    content: [
      "API Resources transform models into JSON — like a serializer",
      "Hide internal fields (password, pivot) from the API response",
      "Generate: php artisan make:resource PostResource",
      "ResourceCollection wraps paginated results with metadata",
    ],
    lab: "Create a PostResource that only exposes id, title, and author name.",
    syntax: `php artisan make:resource PostResource\nphp artisan make:resource PostCollection`,
    code: `<?php\nnamespace App\\Http\\Resources;\n\nuse Illuminate\\Http\\Resources\\Json\\JsonResource;\n\nclass PostResource extends JsonResource\n{\n    public function toArray($request): array\n    {\n        return [\n            'id'         => $this->id,\n            'title'      => $this->title,\n            'body'       => $this->body,\n            'published'  => $this->published,\n            'author'     => [\n                'id'   => $this->author->id,\n                'name' => $this->author->name,\n            ],\n            'created_at' => $this->created_at->toDateString(),\n            // 'password' is excluded — never exposed!\n        ];\n    }\n}\n\n// In controller:\nreturn new PostResource($post);\nreturn PostResource::collection($posts);`,
    icon: Layout,
  },
  {
    id: "19", title: "Authentication", subtitle: "Laravel Sanctum",
    tag: "Security", tagColor: "#60a5fa", accent: "#3b82f6",
    bg: "radial-gradient(ellipse at 70% 40%, rgba(59,130,246,0.12) 0%, transparent 60%)",
    content: [
      "Sanctum is Laravel's official lightweight API auth package",
      "Generates personal access tokens stored in the database",
      "Attach 'auth:sanctum' middleware to protect routes",
      "Works for SPAs (cookies) and mobile apps (tokens)",
    ],
    lab: "Create a /api/login route that returns a Sanctum token on success.",
    syntax: `php artisan install:api\n\nRoute::middleware('auth:sanctum')\n     ->get('/user', fn($req) => $req->user());`,
    code: `<?php\n// AuthController.php\npublic function login(Request $request): JsonResponse\n{\n    $credentials = $request->validate([\n        'email'    => 'required|email',\n        'password' => 'required',\n    ]);\n\n    if (!Auth::attempt($credentials)) {\n        return response()->json(\n            ['message' => 'Invalid credentials'],\n            401\n        );\n    }\n\n    $user  = Auth::user();\n    $token = $user->createToken('api-token')->plainTextToken;\n\n    return response()->json([\n        'token' => $token,\n        'user'  => $user,\n    ]);\n}\n\npublic function logout(Request $request): JsonResponse\n{\n    $request->user()->currentAccessToken()->delete();\n    return response()->json(['message' => 'Logged out']);\n}`,
    icon: Lock,
  },
  {
    id: "20", title: "Password Hashing", subtitle: "Bcrypt & Security",
    tag: "Security", tagColor: "#fb7185", accent: "#f43f5e",
    bg: "radial-gradient(ellipse at 25% 60%, rgba(244,63,94,0.12) 0%, transparent 60%)",
    content: [
      "NEVER store plain-text passwords in the database",
      "Laravel's Hash facade uses bcrypt automatically",
      "Hash::make($password) — hashes for storage",
      "Hash::check($plain, $hashed) — verifies on login",
    ],
    lab: "Hash a password before saving a user and verify it on login.",
    syntax: `Hash::make('secret');         // hash\nHash::check('secret', $hash); // verify`,
    code: `<?php\nuse Illuminate\\Support\\Facades\\Hash;\n\n// REGISTER: hash before saving\npublic function register(Request $request): JsonResponse\n{\n    $user = User::create([\n        'name'     => $request->name,\n        'email'    => $request->email,\n        'password' => Hash::make($request->password),\n    ]);\n\n    return response()->json($user, 201);\n}\n\n// LOGIN: verify hash\npublic function login(Request $request): JsonResponse\n{\n    $user = User::where('email', $request->email)->first();\n\n    if (!$user || !Hash::check($request->password, $user->password)) {\n        return response()->json(['message' => 'Invalid credentials'], 401);\n    }\n\n    $token = $user->createToken('api')->plainTextToken;\n    return response()->json(compact('token'));\n}`,
    icon: Shield,
  },
  {
    id: "21", title: "Environment & Config", subtitle: ".env & Config Files",
    tag: "Setup", tagColor: "#94a3b8", accent: "#64748b",
    bg: "radial-gradient(ellipse at 55% 35%, rgba(100,116,139,0.12) 0%, transparent 60%)",
    content: [
      ".env holds secrets — NEVER commit this file to Git",
      "Add .env to .gitignore immediately after creating the project",
      "config/database.php reads from .env using env()",
      "env('KEY', 'default') — access env values with a fallback",
    ],
    lab: "Set up your .env with DB_DATABASE, DB_USERNAME, and DB_PASSWORD.",
    syntax: `# .env\nDB_CONNECTION=mysql\nDB_HOST=127.0.0.1\nDB_DATABASE=my_app\nDB_USERNAME=root\nDB_PASSWORD=secret`,
    code: `# .env file (never commit this!)\nAPP_NAME=MyAPI\nAPP_ENV=local\nAPP_KEY=base64:...\nAPP_DEBUG=true\nAPP_URL=http://localhost\n\nDB_CONNECTION=mysql\nDB_HOST=127.0.0.1\nDB_PORT=3306\nDB_DATABASE=my_app\nDB_USERNAME=root\nDB_PASSWORD=secret\n\nSANCTUM_STATEFUL_DOMAINS=localhost:3000\nJWT_SECRET=super-secret-key\n\n# Access in PHP:\n# env('DB_DATABASE')\n# config('database.default')`,
    icon: HardDrive,
  },
  {
    id: "22", title: "Seeders & Factories", subtitle: "Populating Test Data",
    tag: "Database", tagColor: "#fbbf24", accent: "#f59e0b",
    bg: "radial-gradient(ellipse at 40% 60%, rgba(245,158,11,0.12) 0%, transparent 60%)",
    content: [
      "Factories generate fake model data using Faker library",
      "Seeders populate the database with initial or test data",
      "php artisan db:seed — runs all seeders",
      "php artisan migrate:fresh --seed — wipes and reseeds everything",
    ],
    lab: "Create a PostFactory and seed 50 posts using DatabaseSeeder.",
    syntax: `php artisan make:factory PostFactory\nphp artisan make:seeder PostSeeder\nphp artisan db:seed`,
    code: `<?php\n// database/factories/PostFactory.php\nclass PostFactory extends Factory\n{\n    public function definition(): array\n    {\n        return [\n            'title'     => $this->faker->sentence(),\n            'body'      => $this->faker->paragraphs(3, true),\n            'published' => $this->faker->boolean(70),\n            'user_id'   => User::factory(),\n        ];\n    }\n}\n\n// database/seeders/DatabaseSeeder.php\nclass DatabaseSeeder extends Seeder\n{\n    public function run(): void\n    {\n        // Create 10 users, each with 5 posts\n        User::factory(10)\n            ->has(Post::factory(5))\n            ->create();\n    }\n}`,
    icon: Database,
  },
  {
    id: "23", title: "File Uploads", subtitle: "Storage & Disk",
    tag: "Laravel", tagColor: "#c084fc", accent: "#a855f7",
    bg: "radial-gradient(ellipse at 65% 25%, rgba(168,85,247,0.12) 0%, transparent 60%)",
    content: [
      "$request->file('avatar') — access an uploaded file",
      "store('folder', 'disk') — saves to local or cloud storage",
      "Storage::url($path) — generates a public URL for the file",
      "Disks: local, public, s3 — configure in config/filesystems.php",
    ],
    lab: "Create an upload route that stores an image and returns its URL.",
    syntax: `$path = $request->file('image')->store('uploads', 'public');\n$url  = Storage::url($path);`,
    code: `<?php\nuse Illuminate\\Support\\Facades\\Storage;\n\npublic function upload(Request $request): JsonResponse\n{\n    $request->validate([\n        'avatar' => 'required|image|max:2048', // max 2MB\n    ]);\n\n    // Store in storage/app/public/avatars/\n    $path = $request->file('avatar')\n                    ->store('avatars', 'public');\n\n    // Generate public URL\n    $url = Storage::url($path);\n\n    // Save path to user record\n    $request->user()->update(['avatar' => $path]);\n\n    return response()->json([\n        'path' => $path,\n        'url'  => $url,\n    ]);\n}`,
    icon: HardDrive,
  },
  {
    id: "24", title: "Queues & Jobs", subtitle: "Background Processing",
    tag: "Laravel", tagColor: "#34d399", accent: "#10b981",
    bg: "radial-gradient(ellipse at 20% 55%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    content: [
      "Queues defer slow tasks (emails, resizing) to the background",
      "php artisan make:job SendWelcomeEmail — generates a Job class",
      "dispatch($job) — pushes the job onto the queue",
      "php artisan queue:work — processes jobs from the queue",
    ],
    lab: "Create a SendWelcomeEmail job and dispatch it after user registration.",
    syntax: `php artisan make:job SendWelcomeEmail\nSendWelcomeEmail::dispatch($user);\nphp artisan queue:work`,
    code: `<?php\nnamespace App\\Jobs;\n\nuse App\\Models\\User;\nuse App\\Mail\\WelcomeMail;\nuse Illuminate\\Bus\\Queueable;\nuse Illuminate\\Contracts\\Queue\\ShouldQueue;\nuse Illuminate\\Support\\Facades\\Mail;\n\nclass SendWelcomeEmail implements ShouldQueue\n{\n    use Queueable;\n\n    public function __construct(public User $user) {}\n\n    public function handle(): void\n    {\n        Mail::to($this->user->email)\n            ->send(new WelcomeMail($this->user));\n    }\n}\n\n// Dispatch from controller (non-blocking):\npublic function register(Request $request): JsonResponse\n{\n    $user = User::create($request->validated());\n\n    SendWelcomeEmail::dispatch($user); // runs in background!\n\n    return response()->json($user, 201);\n}`,
    icon: Zap,
  },
  {
    id: "25", title: "Caching", subtitle: "Speed Up Responses",
    tag: "Performance", tagColor: "#38bdf8", accent: "#0ea5e9",
    bg: "radial-gradient(ellipse at 60% 40%, rgba(14,165,233,0.12) 0%, transparent 60%)",
    content: [
      "Cache::put($key, $value, $ttl) — stores data in Redis/Memcached",
      "Cache::get($key) — retrieves cached value; null if missing",
      "Cache::remember($key, $ttl, fn) — get or compute and cache",
      "Cache::forget($key) — invalidate a specific cached item",
    ],
    lab: "Cache a list of posts for 60 seconds using Cache::remember().",
    syntax: `Cache::remember('posts', 60, fn () => Post::all());\nCache::forget('posts'); // invalidate`,
    code: `<?php\nuse Illuminate\\Support\\Facades\\Cache;\n\n// Basic get/put\nCache::put('featured_posts', $posts, 300); // 5 min\n$cached = Cache::get('featured_posts');\n\n// Remember pattern (most common)\npublic function index(): JsonResponse\n{\n    $posts = Cache::remember(\n        'published_posts',\n        60,                         // seconds\n        fn () => Post::where('published', true)\n                     ->with('author')\n                     ->latest()\n                     ->get()\n    );\n\n    return response()->json($posts);\n}\n\n// Invalidate on update\npublic function update(Request $request, Post $post): JsonResponse\n{\n    $post->update($request->validated());\n    Cache::forget('published_posts'); // clear stale cache\n    return response()->json($post);\n}`,
    icon: Activity,
  },
  {
    id: "26", title: "Rate Limiting", subtitle: "Throttle API Requests",
    tag: "Security", tagColor: "#fb923c", accent: "#f97316",
    bg: "radial-gradient(ellipse at 45% 65%, rgba(249,115,22,0.12) 0%, transparent 60%)",
    content: [
      "throttle middleware limits requests per minute per IP",
      "Default: 60 requests/minute — adjust as needed",
      "Returns 429 Too Many Requests when limit is exceeded",
      "RateLimiter facade for custom per-user or per-route limits",
    ],
    lab: "Apply throttle:10,1 to your login route to prevent brute force.",
    syntax: `Route::middleware('throttle:60,1')  // 60/min\n     ->get('/users', handler);\n\nRoute::middleware('throttle:10,1')  // 10/min\n     ->post('/login', handler);`,
    code: `<?php\n// routes/api.php\n\n// Global: 60 requests per minute\nRoute::middleware('throttle:api')\n     ->group(function () {\n         Route::apiResource('posts', PostController::class);\n     });\n\n// Strict: 5 login attempts per minute\nRoute::middleware('throttle:5,1')\n     ->post('/login', [AuthController::class, 'login']);\n\n// Custom limiter in AppServiceProvider\nuse Illuminate\\Cache\\RateLimiting\\Limit;\nuse Illuminate\\Support\\Facades\\RateLimiter;\n\nRateLimiter::for('api', function ($request) {\n    return Limit::perMinute(60)\n                ->by($request->user()?->id ?: $request->ip());\n});`,
    icon: ShieldAlert,
  },
  {
    id: "27", title: "Testing with Pest", subtitle: "PHPUnit & Feature Tests",
    tag: "Testing", tagColor: "#4ade80", accent: "#22c55e",
    bg: "radial-gradient(ellipse at 25% 40%, rgba(34,197,94,0.12) 0%, transparent 60%)",
    content: [
      "Pest is a modern PHP testing framework built on PHPUnit",
      "Feature tests hit real HTTP endpoints — end-to-end style",
      "actingAs($user) — authenticate a user for a test request",
      "php artisan test — runs your entire test suite",
    ],
    lab: "Write a test that creates a user and asserts the response is 201.",
    syntax: `php artisan make:test PostTest\nphp artisan test\n./vendor/bin/pest`,
    code: `<?php\n// tests/Feature/PostTest.php\nuse App\\Models\\User;\nuse App\\Models\\Post;\n\ntest('authenticated user can create a post', function () {\n    $user = User::factory()->create();\n\n    $response = $this\n        ->actingAs($user)\n        ->postJson('/api/posts', [\n            'title' => 'My First Post',\n            'body'  => 'Content goes here.',\n        ]);\n\n    $response->assertStatus(201)\n             ->assertJsonFragment(['title' => 'My First Post']);\n\n    $this->assertDatabaseHas('posts', [\n        'title'   => 'My First Post',\n        'user_id' => $user->id,\n    ]);\n});\n\ntest('guest cannot create a post', function () {\n    $this->postJson('/api/posts', ['title' => 'Hack'])\n         ->assertStatus(401);\n});`,
    icon: ShieldCheck,
  },
  {
    id: "28", title: "Artisan Commands", subtitle: "CLI Productivity",
    tag: "Laravel", tagColor: "#818cf8", accent: "#6366f1",
    bg: "radial-gradient(ellipse at 65% 30%, rgba(99,102,241,0.12) 0%, transparent 60%)",
    content: [
      "php artisan list — shows every available artisan command",
      "make:* commands generate boilerplate code instantly",
      "php artisan tinker — REPL shell to run PHP against your app",
      "Custom commands: php artisan make:command CleanupOldPosts",
    ],
    lab: "Use 'php artisan tinker' to create a user and a post interactively.",
    syntax: `php artisan list\nphp artisan make:model -m -c -r Post\nphp artisan tinker\nphp artisan route:list`,
    code: `# Most-used Artisan commands:\n\n# Generate everything for a resource at once:\nphp artisan make:model Post -m -c -r --api\n# -m = migration\n# -c = controller\n# -r = resource controller\n# --api = API methods only\n\n# Database management\nphp artisan migrate\nphp artisan migrate:fresh --seed\nphp artisan db:seed --class=PostSeeder\n\n# Clear all caches\nphp artisan optimize:clear\n\n# View all registered routes\nphp artisan route:list --path=api\n\n# Interactive REPL\nphp artisan tinker\n>>> User::factory()->create();\n>>> Post::count();`,
    icon: Terminal,
  },
  {
    id: "29", title: "CORS & Headers", subtitle: "Cross-Origin & Security Headers",
    tag: "Security", tagColor: "#22d3ee", accent: "#06b6d4",
    bg: "radial-gradient(ellipse at 30% 60%, rgba(6,182,212,0.12) 0%, transparent 60%)",
    content: [
      "CORS prevents unauthorized domains from calling your API",
      "Laravel's cors config is in config/cors.php",
      "allowed_origins — list domains that may access your API",
      "Add security headers in middleware for production hardening",
    ],
    lab: "Update config/cors.php to allow your frontend domain (localhost:3000).",
    syntax: `// config/cors.php\n'allowed_origins' => ['http://localhost:3000'],\n'allowed_methods' => ['*'],`,
    code: `<?php\n// config/cors.php\nreturn [\n    'paths'                => ['api/*', 'sanctum/csrf-cookie'],\n    'allowed_methods'      => ['*'],\n    'allowed_origins'      => [\n        'http://localhost:3000',  // dev\n        'https://myapp.com',      // production\n    ],\n    'allowed_headers'      => ['*'],\n    'exposed_headers'      => [],\n    'max_age'              => 0,\n    'supports_credentials' => true,\n];\n\n// Security Headers Middleware (custom)\npublic function handle(Request $request, Closure $next): mixed\n{\n    $response = $next($request);\n    $response->headers->set('X-Content-Type-Options', 'nosniff');\n    $response->headers->set('X-Frame-Options', 'DENY');\n    return $response;\n}`,
    icon: Globe,
  },
  {
    id: "30", title: "Deployment", subtitle: "Launching the API",
    tag: "Production", tagColor: "#fbbf24", accent: "#f59e0b",
    bg: "radial-gradient(ellipse at 50% 35%, rgba(245,158,11,0.12) 0%, transparent 60%)",
    content: [
      "Set APP_ENV=production and APP_DEBUG=false in production .env",
      "php artisan optimize — caches routes, config, and views",
      "Use Railway, Render, or a VPS (DigitalOcean/Vultr)",
      "Run php artisan migrate --force on the production server",
    ],
    lab: "Deploy your Laravel API to Railway and set all environment variables.",
    syntax: `php artisan optimize\nphp artisan migrate --force\nnpm run build  # if using Vite assets`,
    code: `# Production deployment checklist\n\n# 1. Set production .env\nAPP_ENV=production\nAPP_DEBUG=false\nAPP_URL=https://api.myapp.com\n\n# 2. Install dependencies (no dev)\ncomposer install --no-dev --optimize-autoloader\n\n# 3. Generate app key (if new server)\nphp artisan key:generate\n\n# 4. Cache everything for speed\nphp artisan config:cache\nphp artisan route:cache\nphp artisan view:cache\n\n# 5. Run database migrations\nphp artisan migrate --force\n\n# 6. Set storage permissions\nchmod -R 775 storage bootstrap/cache\nphp artisan storage:link`,
    icon: Rocket,
  },
  {
    id: "FA", title: "Final Project", subtitle: "Task Management API",
    tag: "Assignment", tagColor: "#fde047", accent: "#eab308",
    bg: "radial-gradient(ellipse at 50% 50%, rgba(234,179,8,0.15) 0%, transparent 60%), radial-gradient(ellipse at 10% 90%, rgba(249,115,22,0.08) 0%, transparent 50%)",
    content: [
      "Laravel API with MySQL database and migrations",
      "User registration and login with Sanctum tokens",
      "Tasks CRUD — title, description, status, due_date",
      "Protected routes — users only see their own tasks",
      "Deployed to Railway or Render with full .env config",
    ],
    lab: "Build, test, and deploy a complete Task Management REST API.",
    syntax: `php artisan make:model Task -m -c -r --api\nphp artisan install:api\nphp artisan test`,
    code: `<?php\n/*\n * FINAL PROJECT ROUTE MAP:\n *\n * Public:\n *   POST /api/register\n *   POST /api/login\n *\n * Protected (auth:sanctum):\n *   GET    /api/tasks         → index\n *   POST   /api/tasks         → store\n *   GET    /api/tasks/{task}  → show\n *   PUT    /api/tasks/{task}  → update\n *   DELETE /api/tasks/{task}  → destroy\n *   POST   /api/logout\n *\n * CONGRATULATIONS! 🎓\n *\n * You've mastered PHP, Laravel,\n * Eloquent ORM, Sanctum auth,\n * Migrations, Validation, Testing,\n * and Production Deployment.\n *\n * You are officially a Full-Stack Dev.\n * The backend is yours to build!\n */`,
    icon: Sparkles,
  },
];

/* ─── PHP SYNTAX HIGHLIGHTER ─────────────────────────────────────── */
const PHP_KEYWORDS = new Set([
  'php','echo','print','return','if','else','elseif','foreach','for',
  'while','do','switch','case','break','continue','class','extends',
  'implements','interface','trait','namespace','use','new','public',
  'protected','private','static','abstract','final','function','fn',
  'array','string','int','float','bool','void','null','true','false',
  'require','include','require_once','include_once','throw','try',
  'catch','finally','match','readonly','const','enum',
]);

const HighlightedCode = ({ code }: { code: string }) => {
  const tokenizeLine = (line: string): React.ReactNode => {
    if (line.trimStart().startsWith('//') || line.trimStart().startsWith('#'))
      return <span style={{ color: '#6b7280', fontStyle: 'italic' }}>{line}</span>;
    if (line.trimStart().startsWith('/*') || line.trimStart().startsWith('*'))
      return <span style={{ color: '#6b7280', fontStyle: 'italic' }}>{line}</span>;

    const parts = line.split(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\$[a-zA-Z_]\w*|\b\d+(?:\.\d+)?\b|\b[a-zA-Z_]\w*\b)/g);
    return parts.map((part, i) => {
      if (!part) return null;
      if (part.startsWith('$')) return <span key={i} style={{ color: '#fbbf24' }}>{part}</span>;
      if (PHP_KEYWORDS.has(part)) return <span key={i} style={{ color: '#f87171', fontWeight: 700 }}>{part}</span>;
      if (/^["']/.test(part)) return <span key={i} style={{ color: '#86efac' }}>{part}</span>;
      if (/^\d/.test(part)) return <span key={i} style={{ color: '#c084fc' }}>{part}</span>;
      if (/^[A-Z]/.test(part)) return <span key={i} style={{ color: '#fbbf24' }}>{part}</span>;
      return <span key={i} style={{ color: '#e2e8f0' }}>{part}</span>;
    });
  };

  return (
    <div className="font-mono text-sm leading-6 whitespace-pre"
      style={{ fontFamily: "'JetBrains Mono','Fira Code','Cascadia Code',monospace" }}>
      {code.split('\n').map((line, i) => (
        <div key={i} className="min-h-[1.5rem]">{tokenizeLine(line)}</div>
      ))}
    </div>
  );
};

/* ─── SYNTAX PANEL ───────────────────────────────────────────────── */
const SyntaxPanel = ({ syntax, accent }: { syntax: string; accent: string }) => {
  if (!syntax) return null;
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: `${accent}30`, background: `${accent}08` }}>
      <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: `${accent}20` }}>
        <Code2 className="w-3 h-3" style={{ color: accent }} />
        <span className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: accent }}>Syntax Reference</span>
      </div>
      <div className="p-3 text-xs leading-6 font-mono whitespace-pre text-zinc-300 overflow-x-auto"
        style={{ fontFamily: "'JetBrains Mono','Fira Code',monospace" }}>
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

/* ─── CODE VIEWER ────────────────────────────────────────────────── */
const CodeViewer = ({ code, accent }: { code: string; accent: string }) => {
  const [copied, setCopied] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const lines = code.split('\n');

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const syncScroll = () => {
    if (taRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = taRef.current.scrollTop;
      highlightRef.current.scrollLeft = taRef.current.scrollLeft;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-white/8 flex-none">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]/60" />
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 rounded px-2 py-1 ml-1">
            <FileCode className="w-3 h-3" style={{ color: accent }} />
            <span className="text-[10px] font-mono text-zinc-400">Controller.php</span>
          </div>
        </div>
        <button onClick={copy}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${copied ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'}`}>
          {copied ? <><Check className="w-3 h-3" />Copied!</> : <><Copy className="w-3 h-3" />Copy</>}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-none w-9 bg-[#0d1117] border-r border-white/5 pt-4 pb-4 flex flex-col items-end pr-2 overflow-hidden select-none">
          {lines.map((_, i) => (
            <div key={i} className="text-[11px] font-mono text-zinc-600 leading-6 min-h-[1.5rem]">{i + 1}</div>
          ))}
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div ref={highlightRef} className="absolute inset-0 overflow-auto p-4 pointer-events-none" style={{ scrollbarWidth: 'none' }}>
            <HighlightedCode code={code} />
          </div>
          <textarea ref={taRef} readOnly value={code} onScroll={syncScroll}
            className="absolute inset-0 w-full h-full bg-transparent text-transparent resize-none outline-none p-4 font-mono text-sm leading-6 border-none overflow-auto selection:bg-emerald-500/25"
            style={{ fontFamily: "'JetBrains Mono',monospace", whiteSpace: 'pre', overflowWrap: 'normal' }}
            spellCheck={false} wrap="off" />
        </div>
      </div>
    </div>
  );
};

/* ─── MAIN COMPONENT ─────────────────────────────────────────────── */
function BackendLessonContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSlide = Math.max(0, Math.min(parseInt(searchParams.get('slide') || '1') - 1, slides.length - 1));

  const [current, setCurrent] = useState(initialSlide);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dir, setDir] = useState(1);

  const slide = slides[current];
  const IconComp = slide.icon;
  const progress = ((current + 1) / slides.length) * 100;

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('slide', (current + 1).toString());
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [current]);

  const goTo = useCallback((idx: number, direction: number) => {
    if (isAnimating) return;
    setDir(direction);
    setIsAnimating(true);
    setTimeout(() => { setCurrent(idx); setIsAnimating(false); }, 300);
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
    <div className="min-h-screen text-white flex flex-col overflow-hidden"
      style={{ background: '#080c14', fontFamily: "'Inter','DM Sans',system-ui,sans-serif" }}>

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none transition-all duration-700" style={{ background: slide.bg }} />
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.02) 0%, transparent 70%)' }} />

      {/* ── HEADER ── */}
      <header className="relative z-20 flex items-center gap-4 px-6 py-3 border-b border-white/8 bg-black/20 backdrop-blur-xl flex-none">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center border border-white/10 flex-none"
          style={{ background: `${slide.accent}20` }}>
          <IconComp className="w-3.5 h-3.5" style={{ color: slide.accent }} />
        </div>
        <div className="flex-none">
          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-600 font-bold">Module 08 · Weeks 15–16</p>
          <p className="text-xs font-black text-white tracking-tight">PHP & Laravel Masterclass</p>
        </div>

        <div className="flex-1 mx-6 hidden md:block">
          <div className="h-0.5 bg-white/8 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: slide.accent }} />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border"
            style={{ color: slide.tagColor, borderColor: `${slide.tagColor}40`, background: `${slide.tagColor}12` }}>
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
          <motion.div key={`left-${current}`} custom={dir} variants={variants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
            className="flex-none lg:w-[400px] xl:w-[440px] flex flex-col justify-between p-6 lg:p-8 lg:border-r border-white/8 overflow-y-auto">

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="text-4xl font-black tabular-nums leading-none flex-none pt-1"
                  style={{ color: `${slide.accent}35`, fontFamily: "'JetBrains Mono',monospace" }}>
                  {slide.id}
                </div>
                <div>
                  <h1 className="text-xl xl:text-2xl font-black leading-tight text-white">{slide.title}</h1>
                  <p className="text-sm text-zinc-400 font-medium mt-0.5">{slide.subtitle}</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {slide.content.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.05 }} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-none" style={{ background: slide.accent }} />
                    <p className="text-sm text-zinc-300 leading-relaxed font-medium">{item}</p>
                  </motion.div>
                ))}
              </div>

              <SyntaxPanel syntax={slide.syntax} accent={slide.accent} />

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="rounded-xl border p-3.5 flex gap-2.5"
                style={{ background: `${slide.accent}0a`, borderColor: `${slide.accent}28` }}>
                <Play className="w-3.5 h-3.5 flex-none mt-0.5" style={{ color: slide.accent }} />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest mb-0.5" style={{ color: slide.accent }}>Lab Exercise</p>
                  <p className="text-xs text-zinc-300 leading-relaxed">{slide.lab}</p>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center gap-3 mt-6 lg:mt-0">
              <button onClick={prev}
                className="p-2.5 rounded-xl bg-white/5 border border-white/8 hover:bg-white/10 active:scale-95 transition-all flex items-center gap-1.5">
                <ChevronLeft className="w-4 h-4" />
                <span className="text-xs font-bold hidden sm:inline">Prev</span>
              </button>
              <button onClick={next}
                className="flex-1 py-2.5 px-4 rounded-xl font-black text-xs active:scale-95 transition-all flex items-center justify-center gap-2"
                style={{ background: slide.accent, color: '#000' }}>
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
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest"
                style={{ background: `${slide.accent}25`, color: slide.accent }}>
                <FileCode className="w-3 h-3" /> Implementation
              </div>
            </div>
            <div className="text-[9px] font-mono text-zinc-700 hidden lg:flex items-center gap-1">
              <kbd className="px-1 py-0.5 border border-zinc-800 rounded text-[8px]">←</kbd>
              <kbd className="px-1 py-0.5 border border-zinc-800 rounded text-[8px]">→</kbd>
              navigate
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={`code-${current}`}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}
              className="flex-1 overflow-hidden rounded-xl border border-white/8">
              {slide.code ? (
                <CodeViewer code={slide.code} accent={slide.accent} />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-6 bg-[#0d1117]">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
                    className="absolute w-64 h-64 rounded-full"
                    style={{ background: `conic-gradient(from 0deg, ${slide.accent}08, ${slide.accent}20, ${slide.accent}08)`, filter: 'blur(40px)' }} />
                  <div className="relative w-20 h-20 rounded-2xl flex items-center justify-center border border-white/10"
                    style={{ background: `${slide.accent}20` }}>
                    <IconComp className="w-10 h-10" style={{ color: slide.accent }} />
                  </div>
                  <div className="text-center relative">
                    <p className="text-xs font-black uppercase tracking-[0.3em] mb-2" style={{ color: slide.accent }}>PHP & Laravel</p>
                    <p className="text-3xl font-black text-white">{slide.title}</p>
                    <p className="text-sm text-zinc-500 mt-1">{slide.subtitle}</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ── FOOTER DOTS ── */}
      <footer className="relative z-20 flex justify-center items-center gap-1.5 py-3 border-t border-white/8 bg-black/20 backdrop-blur-xl flex-none flex-wrap px-4">
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i, i > current ? 1 : -1)}
            title={slides[i].title}
            className="rounded-full transition-all duration-300"
            style={{ width: i === current ? 20 : 5, height: 5, background: i === current ? slide.accent : 'rgba(255,255,255,0.12)' }} />
        ))}
      </footer>
    </div>
  );
}

export default function BackendLesson() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto" />
          <p className="text-zinc-600 text-sm font-mono">Loading PHP Lab...</p>
        </div>
      </div>
    }>
      <BackendLessonContent />
    </Suspense>
  );
}