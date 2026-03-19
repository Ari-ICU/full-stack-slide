"use client";

import BackendGenericSlides, { Slide } from "@/components/backend/lessons/backend-generic-slides";
import { ArrowLeft, Zap, Layers, ShieldCheck, Terminal, Cpu, Database, Globe, Command } from "lucide-react";
import Link from "next/link";

const laravelSlides: Slide[] = [

  // ── 01 · Hero ──────────────────────────────────────────────────────────────
  {
    type: 'hero',
    title: 'Laravel Internal Ops',
    subtitle: 'Module 02 · Advanced Framework Core',
    content: 'Most developers use Laravel. Few understand it. This module traces a request from the server entry point through the Kernel, Service Container, middleware pipeline, router, and controller — giving you the mental model to debug anything and architect everything.',
    icon: Zap,
  },

  // ── 02 · Concept: Entry Point ─────────────────────────────────────────────
  {
    type: 'concept',
    title: 'The Entry Point',
    subtitle: 'public/index.php',
    content: 'Every HTTP request to a Laravel application lands in one file: public/index.php. It loads the Composer autoloader, bootstraps the application from bootstrap/app.php, hands the request to the HTTP Kernel, and sends the response. The entire framework lifecycle starts in roughly 12 lines.',
    icon: Terminal,
    callout: 'public/ is the only directory that should be web-accessible. The framework, vendor packages, and .env file live outside it. Misconfigured servers that expose the root directory are a common source of secret leaks.',
    keyPoints: [
      'require __DIR__.\'/../vendor/autoload.php\' — Composer PSR-4 autoloader',
      '$app = require_once __DIR__.\'/../bootstrap/app.php\' — creates the Application instance',
      '$kernel->handle(Request::capture()) — the entire HTTP lifecycle in one call',
      '$response->send() — writes headers and body to the PHP output buffer',
    ],
  },

  // ── 03 · Diagram: HTTP Kernel ─────────────────────────────────────────────
  {
    type: 'diagram',
    title: 'The HTTP Kernel',
    subtitle: 'Request Transformation',
    content: 'The Kernel is a pipeline. It bootstraps the application (loads env, config, providers), then passes the Request through the global middleware stack, through route middleware, and finally to the controller. The response travels back through the same pipeline in reverse.',
    icon: Cpu,
    diagramNodes: [
      { label: 'index.php',     desc: 'entry point',           color: '#6366f1' },
      { label: 'Kernel',        desc: 'bootstrap + handle',    color: '#8b5cf6' },
      { label: 'Global MW',     desc: 'TrimStrings, CORS…',    color: '#0ea5e9' },
      { label: 'Route MW',      desc: 'auth, throttle…',       color: '#10b981' },
      { label: 'Controller',    desc: 'your code',             color: '#f59e0b' },
      { label: 'Response',      desc: 'back through pipeline', color: '#ef4444' },
    ],
  },

  // ── 04 · Concept: Bootstrapping ───────────────────────────────────────────
  {
    type: 'concept',
    title: 'Bootstrapping Phase',
    subtitle: 'Environment & Config',
    content: 'Before your first line of application code runs, Laravel executes a fixed sequence of bootstrappers: load environment variables from .env, merge all config/ files into the config repository, set up the exception handler, register facades, and boot all Service Providers. This sequence is deterministic and runs on every request.',
    icon: ShieldCheck,
    callout: 'php artisan config:cache merges all config/ files into a single serialized file. After caching, env() calls in config files return null — the cached values are used instead. Always clear the cache after changing .env in production: php artisan config:clear.',
    keyPoints: [
      'LoadEnvironmentVariables — reads .env via vlucas/phpdotenv',
      'LoadConfiguration — merges config/ into the config repository',
      'HandleExceptions — registers the custom exception handler',
      'RegisterFacades — binds Facade::getFacadeAccessor() to the container',
      'RegisterProviders → BootProviders — two-phase Service Provider boot',
    ],
  },

  // ── 05 · Code: Service Container ──────────────────────────────────────────
  {
    type: 'code',
    title: 'The Service Container',
    subtitle: 'DI Engine',
    content: 'The Service Container is Laravel\'s IoC container. It resolves class dependencies automatically by inspecting constructor type-hints — zero config required for most cases. When you need to bind an interface to a concrete implementation, you register the mapping in a Service Provider.',
    icon: Zap,
    language: 'php',
    codeFileName: 'AppServiceProvider.php',
    codeSnippet: `<?php
declare(strict_types=1);

namespace App\\Providers;

use Illuminate\\Support\\ServiceProvider;
use App\\Contracts\\PaymentGateway;
use App\\Services\\StripeGateway;
use App\\Services\\ReportGenerator;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Bind interface → concrete (resolved fresh each time)
        $this->app->bind(PaymentGateway::class, StripeGateway::class);

        // Bind with a closure for custom construction logic
        $this->app->bind(ReportGenerator::class, function ($app) {
            return new ReportGenerator(
                storage:  $app->make('filesystem')->disk('reports'),
                currency: config('app.currency'),
            );
        });
    }
}

// ── Zero-config injection ────────────────────────────
// The container reads the constructor type-hints and
// resolves OrderRepository automatically — no binding needed
// if it's a concrete class with no interface.

class OrderController
{
    public function __construct(
        private readonly OrderRepository $orders,
        private readonly PaymentGateway  $payments, // resolved via bind
    ) {}
}

// ── Manual resolution ────────────────────────────────
$gateway = app(PaymentGateway::class);   // resolves StripeGateway
$gateway = app()->make(PaymentGateway::class);  // identical`,
    keyPoints: [
      'bind() creates a new instance every time it is resolved',
      'Type-hint a concrete class → zero-config auto-resolution',
      'Type-hint an interface → must register a bind() in a provider',
      'app() and app()->make() are identical — both resolve from the container',
    ],
  },

  // ── 06 · Concept: Singleton Bindings ──────────────────────────────────────
  {
    type: 'concept',
    title: 'Singleton Bindings',
    subtitle: 'Memory Efficiency',
    content: 'A singleton binding tells the container to resolve the class once and reuse the same instance for the entire request lifecycle. Use singletons for expensive-to-construct objects: database connections, HTTP clients, configuration readers, or any stateful service that must be consistent across multiple consumers.',
    icon: Database,
    callout: 'Singletons are per-request in PHP-FPM — each worker process gets a fresh one. In long-running runtimes (Octane, Swoole, RoadRunner), singletons persist across requests. Stateful singletons in Octane will bleed data between users unless you reset them in the request lifecycle hooks.',
    keyPoints: [
      '$this->app->singleton(PaymentGateway::class, StripeGateway::class)',
      'instance() binds a pre-constructed object: $this->app->instance(\'config\', $config)',
      'In PHP-FPM: singletons die with the process at end of request',
      'In Octane: singletons survive across requests — test for state bleed',
    ],
  },

  // ── 07 · Diagram: Service Providers ───────────────────────────────────────
  {
    type: 'diagram',
    title: 'Service Providers',
    subtitle: 'The Boot Logic',
    content: 'Service Providers are the central place to configure the application. register() runs first across all providers — it must only bind things into the container. boot() runs second, after everything is registered — it is safe to resolve dependencies here.',
    icon: Layers,
    diagramNodes: [
      { label: 'bootstrap/app',  desc: 'withProviders()',      color: '#6366f1' },
      { label: 'register() ×N',  desc: 'bind to container',    color: '#8b5cf6' },
      { label: 'boot() ×N',      desc: 'safe to resolve',      color: '#0ea5e9' },
      { label: 'Routes',         desc: 'RouteServiceProvider', color: '#10b981' },
      { label: 'App Ready',      desc: 'handle request',       color: '#f59e0b' },
    ],
  },

  // ── 08 · Code: Deferred Providers ─────────────────────────────────────────
  {
    type: 'code',
    title: 'Deferred Providers',
    subtitle: 'Optimizing Load Time',
    content: 'A deferred provider is not loaded unless one of its declared services is actually resolved. If your PDF generation library is never needed on a typical API request, there is no reason to boot it. Implement DeferrableProvider and declare the provided services.',
    icon: Zap,
    language: 'php',
    codeFileName: 'PdfServiceProvider.php',
    codeSnippet: `<?php
declare(strict_types=1);

namespace App\\Providers;

use Illuminate\\Contracts\\Support\\DeferrableProvider;
use Illuminate\\Support\\ServiceProvider;
use App\\Services\\PdfGenerator;

// Implementing DeferrableProvider marks this as deferred
class PdfServiceProvider extends ServiceProvider implements DeferrableProvider
{
    public function register(): void
    {
        $this->app->singleton(PdfGenerator::class, function ($app) {
            // Expensive: loads wkhtmltopdf binary, sets up temp dirs
            return new PdfGenerator(
                binary:  config('pdf.binary_path'),
                tempDir: storage_path('pdf-temp'),
                timeout: 30,
            );
        });
    }

    // Laravel checks this list before deciding to load the provider.
    // If none of these are needed in the current request, the provider
    // is never instantiated — saving boot time and memory.
    public function provides(): array
    {
        return [PdfGenerator::class];
    }
}

// Register in bootstrap/providers.php (Laravel 11+):
// return [App\\Providers\\PdfServiceProvider::class];

// The provider only loads when PdfGenerator is first resolved:
// $pdf = app(PdfGenerator::class);  // ← triggers load`,
    keyPoints: [
      'implements DeferrableProvider — the signal to the framework',
      'provides() must list every service this provider registers',
      'php artisan optimize caches deferred provider manifests',
      'Deferred providers cannot use boot() for event listeners — those would be skipped',
    ],
  },

  // ── 09 · Concept: Middleware Pipeline ─────────────────────────────────────
  {
    type: 'concept',
    title: 'Middleware Pipeline',
    subtitle: 'Request Interception',
    content: 'Laravel\'s middleware system is a classic onion: each middleware wraps the next. The request travels inward through the stack; the response travels outward through the same stack in reverse. This means a middleware added to the end of the global stack is the last to touch the request but the first to touch the response.',
    icon: ShieldCheck,
    callout: 'Middleware order matters. TrimStrings runs early so later middleware sees cleaned input. StartSession runs before auth so the auth guard can read the session. If you add custom middleware to the global stack, think about what it needs to have already happened.',
    keyPoints: [
      'Global middleware: run on every request — defined in bootstrap/app.php (L11+)',
      'Route middleware: named and applied per-route or per-group',
      'Middleware groups: "web" (sessions, CSRF), "api" (throttle, stateless)',
      'handle(Request $request, Closure $next): return $next($request) to continue',
      'Terminate middleware: terminable() runs after the response is sent',
    ],
  },

  // ── 10 · Diagram: Route Discovery ─────────────────────────────────────────
  {
    type: 'diagram',
    title: 'Route Discovery',
    subtitle: 'Expressive Routing',
    content: 'Laravel compiles all route definitions into a RouteCollection. When a request arrives, the router matches the URI and HTTP method against this collection, resolves route model bindings, and dispatches to the controller. php artisan route:cache serializes this into a single file for near-zero routing overhead.',
    icon: Globe,
    diagramNodes: [
      { label: 'routes/*.php',   desc: 'your definitions',     color: '#6366f1' },
      { label: 'RouteCollection',desc: 'compiled routes',      color: '#8b5cf6' },
      { label: 'URI Match',      desc: 'method + pattern',     color: '#0ea5e9' },
      { label: 'Model Binding',  desc: 'auto-resolve {id}',    color: '#10b981' },
      { label: 'Controller',     desc: 'dispatch',             color: '#f59e0b' },
    ],
  },

  // ── 11 · Code: Controller Patterns ────────────────────────────────────────
  {
    type: 'code',
    title: 'Controller Patterns',
    subtitle: 'Thin Controllers',
    content: 'Controllers should orchestrate — not implement. A controller\'s job is to validate input, call the appropriate service or action, and return a response. Business logic in controllers cannot be reused from jobs, commands, or tests. Move it to dedicated Action or Service classes.',
    icon: Terminal,
    language: 'php',
    codeFileName: 'OrderController.php',
    codeSnippet: `<?php
declare(strict_types=1);

namespace App\\Http\\Controllers;

use App\\Actions\\PlaceOrder;
use App\\Http\\Requests\\PlaceOrderRequest;
use App\\Http\\Resources\\OrderResource;
use App\\Models\\Order;

// Single-action (invokable) controller — one responsibility, one file
class PlaceOrderController
{
    public function __invoke(
        PlaceOrderRequest $request,
        PlaceOrder        $action,  // injected by the container
    ): OrderResource {
        // 1. Request is already validated (Form Request)
        // 2. Delegate ALL business logic to the Action class
        $order = $action->execute(
            user:    $request->user(),
            items:   $request->validated('items'),
            address: $request->validated('shipping_address'),
        );

        // 3. Return a typed API Resource — not a raw model
        return new OrderResource($order);
    }
}

// Route registration:
// Route::post('/orders', PlaceOrderController::class);
//   — Laravel calls __invoke() automatically for invokable controllers

// ── The Action class (pure business logic) ────────────
// class PlaceOrder
// {
//     public function execute(User $user, array $items, array $address): Order
//     {
//         // Called from controllers, jobs, CLI commands, tests — all the same
//     }
// }`,
    keyPoints: [
      'Invokable controllers: Route::post(\'/path\', MyController::class) — no method string needed',
      'Form Requests handle validation AND authorization before the controller runs',
      'Action classes: one public method, no HTTP context — reusable everywhere',
      'API Resources transform Eloquent models — never return raw $model->toArray()',
    ],
  },

  // ── 12 · Quiz: Container & Controller ─────────────────────────────────────
  {
    type: 'quiz',
    title: 'Container Resolution Check',
    subtitle: 'Knowledge Check',
    content: '',
    icon: Zap,
    question: 'You bind an interface in register() using $this->app->bind(). In boot(), you try to resolve a dependency that uses that interface. Does this work?',
    options: [
      {
        text: 'No — boot() runs before register(), so the binding does not exist yet',
        correct: false,
        explanation: 'This is backwards. register() runs first across ALL providers, then boot() runs second. By the time any boot() method executes, every provider\'s register() has already completed.',
      },
      {
        text: 'Yes — register() across all providers completes before any boot() is called',
        correct: true,
        explanation: 'Correct. Laravel runs all provider register() methods first, then all boot() methods. This is why it is safe to resolve bindings in boot() — everything is registered by then.',
      },
      {
        text: 'Only if the binding is in the same provider as boot()',
        correct: false,
        explanation: 'The container is shared across all providers. A binding registered in AppServiceProvider::register() is immediately available to AuthServiceProvider::boot(), or any other provider\'s boot().',
      },
      {
        text: 'It depends on the order of providers in config/app.php',
        correct: false,
        explanation: 'While provider order matters for some edge cases, the register/boot phase separation is guaranteed regardless of order. All register() calls complete before any boot() call begins.',
      },
    ],
  },

  // ── 13 · Concept: Blade Engine ────────────────────────────────────────────
  {
    type: 'concept',
    title: 'Blade Compile Engine',
    subtitle: 'View Architecture',
    content: 'Blade templates are compiled to plain PHP files on first render and cached in storage/framework/views. On subsequent requests, Laravel checks if the source template has been modified (via filemtime) and only recompiles if it has changed. In production with opcache, compiled views are byte-cached by PHP itself.',
    icon: Layers,
    callout: 'php artisan view:cache pre-compiles all Blade templates at deploy time. This eliminates first-request compilation latency in production. Always pair it with php artisan view:clear in your deployment pipeline before re-caching.',
    keyPoints: [
      '{{ $var }} compiles to <?= e($var) ?> — htmlspecialchars() output escaping',
      '{!! $var !!} outputs raw — only use for trusted, already-sanitized HTML',
      '@php ... @endphp inlines raw PHP — avoid it; move logic to view composers',
      'Blade components (@component, <x-button>) compile to standard PHP class calls',
      'Custom directives: Blade::directive(\'money\', fn($e) => "<?php echo money($e); ?>")',
    ],
  },

  // ── 14 · Code: View Composers ─────────────────────────────────────────────
  {
    type: 'code',
    title: 'View Composers',
    subtitle: 'Data Decoupling',
    content: 'View Composers bind data to views automatically whenever that view is rendered — regardless of which controller renders it. This decouples shared layout data (navigation items, user notifications, site settings) from individual controller actions.',
    icon: Database,
    language: 'php',
    codeFileName: 'ViewServiceProvider.php',
    codeSnippet: `<?php
declare(strict_types=1);

namespace App\\Providers;

use Illuminate\\Support\\Facades\\View;
use Illuminate\\Support\\ServiceProvider;
use App\\Models\\Category;
use App\\Models\\Notification;

class ViewServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Runs every time 'layouts.app' (or any view using it) is rendered
        View::composer('layouts.app', function ($view) {
            $view->with('notificationCount',
                auth()->check()
                    ? Notification::unreadFor(auth()->id())->count()
                    : 0
            );
        });

        // Class-based composer — better for complex logic
        View::composer(
            ['partials.nav', 'partials.sidebar'],
            NavigationComposer::class,
        );

        // Share a value with ALL views (use sparingly)
        View::share('appName', config('app.name'));
    }
}

// ── Class-based composer ──────────────────────────────
// class NavigationComposer
// {
//     public function __construct(private CategoryRepository $categories) {}
//
//     public function compose(View $view): void
//     {
//         $view->with('navCategories', $this->categories->getTopLevel());
//     }
// }`,
    keyPoints: [
      'Composers run on every render — keep them fast, cache expensive queries',
      'Class-based composers receive dependencies via constructor injection',
      'View::share() injects into every view — prefer composers for targeted injection',
      'Composers decouple shared data from controllers, making both independently testable',
    ],
  },

  // ── 15 · Diagram: Artisan Internals ───────────────────────────────────────
  {
    type: 'diagram',
    title: 'Artisan Internals',
    subtitle: 'CLI Architecture',
    content: 'Artisan is built on top of the Symfony Console component. When you run php artisan, it boots the full Laravel application — the same container, providers, and configuration as an HTTP request — then dispatches to the matched Command class.',
    icon: Command,
    diagramNodes: [
      { label: 'php artisan',    desc: 'CLI entry point',      color: '#6366f1' },
      { label: 'Application',    desc: 'full bootstrap',       color: '#8b5cf6' },
      { label: 'ConsoleKernel',  desc: 'schedules + routes',   color: '#0ea5e9' },
      { label: 'Command',        desc: 'handle() method',      color: '#10b981' },
      { label: 'Exit Code',      desc: '0 = success',          color: '#f59e0b' },
    ],
  },

  // ── 16 · Code: Custom Artisan Command ─────────────────────────────────────
  {
    type: 'code',
    title: 'Custom Artisan Commands',
    subtitle: 'CLI Architecture',
    content: 'Artisan commands have access to the full service container — the same bindings, models, and services as your HTTP application. Build commands for data migrations, scheduled maintenance, report generation, and anything you need to run from a cron or CI pipeline.',
    icon: Command,
    language: 'php',
    codeFileName: 'PruneExpiredTokensCommand.php',
    codeSnippet: `<?php
declare(strict_types=1);

namespace App\\Console\\Commands;

use Illuminate\\Console\\Command;
use App\\Models\\PersonalAccessToken;
use Illuminate\\Support\\Carbon;

class PruneExpiredTokensCommand extends Command
{
    // Signature defines the CLI signature and arguments
    protected $signature = 'tokens:prune
                            {--days=30  : Delete tokens older than N days}
                            {--dry-run  : Preview without deleting}';

    protected $description = 'Remove expired personal access tokens from the database';

    public function handle(): int
    {
        $days   = (int) $this->option('days');
        $dryRun = $this->option('dry-run');
        $cutoff = Carbon::now()->subDays($days);

        $query = PersonalAccessToken::where('created_at', '<', $cutoff)
                                    ->whereNull('last_used_at');

        $count = $query->count();
        $this->info("Found {$count} tokens older than {$days} days.");

        if ($dryRun) {
            $this->warn('[dry-run] No tokens deleted.');
            return self::SUCCESS;
        }

        $query->delete();
        $this->info("Deleted {$count} expired tokens.");

        return self::SUCCESS; // exit code 0
    }
}

// Schedule in routes/console.php (Laravel 11+):
// Schedule::command('tokens:prune --days=30')->daily()->runInBackground();`,
    keyPoints: [
      '$signature defines the command name, options ({--flag}), and arguments ({name})',
      'handle() returns self::SUCCESS (0) or self::FAILURE (1) — used by CI/cron',
      'Use $this->info(), warn(), error() for colour-coded output',
      'Schedule in routes/console.php with ->daily(), ->hourly(), ->everyFiveMinutes()',
    ],
  },

  // ── 17 · Concept: Macroable Pattern ───────────────────────────────────────
  {
    type: 'concept',
    title: 'Macroable Pattern',
    subtitle: 'Extending the Core',
    content: 'The Macroable trait lets you add methods to existing Laravel classes at runtime without extending or modifying them. This is how packages augment Request, Response, Collection, and Builder with custom methods — and how you can do the same in your own Service Providers.',
    icon: Zap,
    callout: 'Macros are globally registered for the entire request. A macro added in AppServiceProvider::boot() is available everywhere. This is powerful but invisible — a macro on Collection called toExcel() gives no IDE hint it exists. Use plugin/stubs to add IDE support.',
    keyPoints: [
      'Str::macro(\'initials\', fn($v) => ...) — adds Str::initials() globally',
      'Collection::macro(\'toExcel\', fn() => ...) — chainable on all collections',
      'Request::macro(\'isFromMobile\', fn() => ...) — available on $request everywhere',
      'Macros receive $this as the instance — use fn() not static fn() for $this access',
      'Use @method PHPDoc in an IDE helper file for autocomplete support',
    ],
  },

  // ── 18 · Diagram: Error & Logging ─────────────────────────────────────────
  {
    type: 'diagram',
    title: 'Error & Logging',
    subtitle: 'Deep Visibility',
    content: 'Laravel\'s exception handler catches every uncaught Throwable. It decides whether to report it (log, send to Sentry/Flare) and how to render it (JSON for API requests, HTML for web). Monolog powers the logging layer with named channels that fan out to drivers.',
    icon: ShieldCheck,
    diagramNodes: [
      { label: 'Throwable',      desc: 'any exception',        color: '#ef4444' },
      { label: 'Handler',        desc: 'report + render',      color: '#8b5cf6' },
      { label: 'Monolog',        desc: 'Log facade',           color: '#0ea5e9' },
      { label: 'Stack Channel',  desc: 'daily + Sentry',       color: '#10b981' },
      { label: 'Response',       desc: 'JSON or HTML',         color: '#f59e0b' },
    ],
  },

  // ── 19 · Code: Collections API ────────────────────────────────────────────
  {
    type: 'code',
    title: 'Collections API',
    subtitle: 'Fluent Data Wrappers',
    content: 'Laravel Collections wrap arrays in a fluent, chainable API. Every Eloquent query that returns multiple models returns a Collection. They are lazy by default (Eloquent), or eagerly evaluated when created via collect(). Learn the 10 methods you will use every day.',
    icon: Layers,
    language: 'php',
    codeFileName: 'collection-examples.php',
    codeSnippet: `<?php
declare(strict_types=1);

$orders = Order::with('items')->get(); // Eloquent Collection

// ── filter() — keep items matching a condition ────────
$paid = $orders->filter(fn($o) => $o->status === 'paid');

// ── map() — transform each item ──────────────────────
$totals = $orders->map(fn($o) => [
    'id'    => $o->id,
    'total' => $o->items->sum('price'),
]);

// ── groupBy() — key by a field ────────────────────────
$byStatus = $orders->groupBy('status');
// ['paid' => Collection, 'pending' => Collection, ...]

// ── flatMap() — map + flatten one level ──────────────
$allItems = $orders->flatMap(fn($o) => $o->items);

// ── partition() — split into two collections ─────────
[$shipped, $pending] = $orders->partition(fn($o) => $o->shipped_at !== null);

// ── pipe() — pass the collection to a closure ─────────
$report = $orders
    ->filter(fn($o) => $o->total > 100)
    ->sortByDesc('total')
    ->take(10)
    ->pipe(fn($top) => ReportGenerator::fromOrders($top));

// ── Lazy Collections — for large datasets ────────────
// LazyCollection::make(fn() => User::cursor())
//     ->filter(fn($u) => $u->is_active)
//     ->each(fn($u) => SendWelcomeEmail::dispatch($u));`,
    keyPoints: [
      'filter() does not re-index — use values() after filter if you need 0-based keys',
      'map() returns a new Collection — the original is never mutated',
      'LazyCollection + cursor() streams large datasets with constant memory',
      'pipe() breaks method chains cleanly when you need to pass to a function',
    ],
  },

  // ── 20 · Quiz: Collections ────────────────────────────────────────────────
  {
    type: 'quiz',
    title: 'Collections Check',
    subtitle: 'Knowledge Check',
    content: '',
    icon: Layers,
    question: 'You call $orders->filter(fn($o) => $o->total > 100) and then access $result[0]. Why might this throw an error?',
    options: [
      {
        text: 'filter() returns an array, not a Collection',
        correct: false,
        explanation: 'filter() always returns a new Collection — never a plain array. The issue lies elsewhere.',
      },
      {
        text: 'filter() preserves original keys — key 0 may not exist if the first item was filtered out',
        correct: true,
        explanation: 'Correct. If the original Collection had keys [0, 1, 2] and index 0 was filtered out, the result has keys [1, 2]. Accessing [0] returns null or throws. Use ->values() to re-index from 0 after filtering.',
      },
      {
        text: 'You must use ->get(0) instead of array syntax',
        correct: false,
        explanation: 'Collections support array access syntax ([0]) via ArrayAccess. The problem is the missing key after filtering, not the syntax used to access it.',
      },
      {
        text: 'filter() is lazy — you must call ->all() first',
        correct: false,
        explanation: 'filter() on a standard Eloquent Collection is eagerly evaluated. LazyCollection::filter() is lazy. For a standard Collection returned by ->get(), filter() runs immediately.',
      },
    ],
  },

  // ── 21 · Concept: Localization ────────────────────────────────────────────
  {
    type: 'concept',
    title: 'Localization (i18n)',
    subtitle: 'Global Ready',
    content: 'Laravel\'s translation system maps string keys to locale-specific strings stored in lang/ directory PHP or JSON files. The active locale is set per-request via App::setLocale() — typically in middleware that reads the user\'s preference or the Accept-Language header.',
    icon: Globe,
    keyPoints: [
      '__("messages.welcome") — key-based lookup in lang/en/messages.php',
      '__(\'Welcome :name\', [\'name\' => $user->name]) — parameter replacement',
      'trans_choice(\'apples|apples\', $count) — pluralization rules',
      'App::setLocale(\'fr\') in middleware — runs before every request',
      'JSON translation files (lang/fr.json) for single-level key lookups',
    ],
    callout: 'Never hard-code user-facing strings in controllers or views. Even single-language apps benefit from centralised strings — they make copy changes, A/B testing, and future internationalisation trivial.',
  },

  // ── 22 · Code: Custom Helpers & Macros ────────────────────────────────────
  {
    type: 'code',
    title: 'Custom Helpers & Macros',
    subtitle: 'Global Utilities',
    content: 'Global helper functions are loaded via Composer\'s files autoload — they are available everywhere without an import. Use them for pure utility functions with no side effects. For methods on framework classes, use the Macroable pattern in a Service Provider.',
    icon: Terminal,
    language: 'php',
    codeFileName: 'helpers.php',
    codeSnippet: `<?php
declare(strict_types=1);

// app/Support/helpers.php — registered in composer.json autoload.files

if (! function_exists('money')) {
    function money(int $cents, string $currency = 'USD'): string
    {
        return (new \\NumberFormatter(app()->getLocale(), \\NumberFormatter::CURRENCY))
            ->formatCurrency($cents / 100, $currency);
    }
}

if (! function_exists('initials')) {
    function initials(string $name, int $limit = 2): string
    {
        return collect(explode(' ', trim($name)))
            ->map(fn($w) => strtoupper($w[0]))
            ->take($limit)
            ->implode('');
    }
}

// composer.json — register the file:
// "autoload": {
//   "files": ["app/Support/helpers.php"],
//   "psr-4": { "App\\\\": "app/" }
// }
// Then: composer dump-autoload

// ── Macro registration in a Service Provider ─────────
// Str::macro('toSlug', fn($v) => Str::slug($v, '-'));
// Collection::macro('toAssoc', fn() =>
//     $this->mapWithKeys(fn($item) => [$item['id'] => $item])
// );`,
    keyPoints: [
      'Wrap every helper in if (! function_exists(...)) — prevents conflicts with packages',
      'Pure functions only — no database calls, no side effects',
      'Register in composer.json autoload.files then run composer dump-autoload',
      'Macros go in Service Provider boot() — they extend framework classes, not define new functions',
    ],
  },

  // ── 23 · Hero: Final ──────────────────────────────────────────────────────
  {
    type: 'hero',
    title: 'Project Architecture',
    subtitle: 'Final Review',
    content: 'You have traced the full Laravel lifecycle: entry point, HTTP Kernel, bootstrapping, Service Container, singletons, Service Providers, deferred loading, middleware pipeline, routing, controller patterns, Blade compilation, view composers, Artisan, macros, error handling, Collections, localisation, and custom helpers. Now architect with confidence.',
    icon: Zap,
  },
];

export default function LaravelCoreLessonPage() {
  return (
    <main className="min-h-screen overflow-hidden" style={{ background: '#fafaf8' }}>
      <nav
        className="px-8 py-5 sticky top-0 z-50 border-b"
        style={{ borderColor: 'rgba(0,0,0,0.06)', background: 'rgba(250,250,248,0.92)', backdropFilter: 'blur(12px)' }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/courses/backend"
            className="flex items-center gap-2.5 text-sm font-medium transition-colors"
            style={{ color: '#7a7a7a' }}
          >
            <ArrowLeft size={15} />
            <span style={{ letterSpacing: '0.01em' }}>Back to Roadmap</span>
          </Link>

          <div
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold uppercase"
            style={{ borderColor: 'rgba(0,0,0,0.08)', color: '#b8b8b8', letterSpacing: '0.16em' }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: '#bf4e20' }}
            />
            Module 02 · Laravel Core
          </div>
        </div>
      </nav>

      <BackendGenericSlides lessonTitle="Laravel Engineering" slides={laravelSlides} />
    </main>
  );
}