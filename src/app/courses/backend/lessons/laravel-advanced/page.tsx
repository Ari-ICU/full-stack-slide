"use client";

import BackendGenericSlides, { Slide } from "@/components/backend/lessons/backend-generic-slides";
import { ArrowLeft, Layers, Zap, Database, ShieldCheck, Radio, Share2, Cpu, Activity, Clock, PackageX, Monitor, Cloud } from "lucide-react";
import Link from "next/link";

const advancedSlides: Slide[] = [

  // ── 01 · Hero ──────────────────────────────────────────────────────────────
  {
    type: 'hero',
    title: 'Enterprise Laravel',
    subtitle: 'Module 05 · High-Concurrency Architecture',
    content: 'Synchronous request-response is only one mode of operation. Enterprise applications dispatch background jobs, broadcast real-time events, batch parallel workloads, cache aggressively, and expose audit trails. This module covers the full async and event-driven surface of Laravel.',
    icon: Layers,
  },

  // ── 02 · Concept: Queue Architecture ──────────────────────────────────────
  {
    type: 'concept',
    title: 'Queue Architecture',
    subtitle: 'Beyond Sync Execution',
    content: 'A queue decouples the trigger of work from its execution. The HTTP request dispatches a job and returns a 202 immediately — the worker picks it up and processes it asynchronously. This eliminates slow operations (email, PDF, third-party APIs) from the request cycle.',
    icon: Share2,
    callout: 'Never use QUEUE_CONNECTION=sync in production. Sync executes the job inline, inside the HTTP request, defeating the entire purpose. It exists only for local testing without a running worker.',
    keyPoints: [
      'database driver — stores jobs in a MySQL/Postgres table; easy setup, low throughput',
      'redis driver — stores jobs in Redis lists; high throughput, sub-millisecond dispatch',
      'sqs driver — AWS managed queue; infinite scale, at-least-once delivery guarantee',
      'Worker pulls jobs from the queue, executes them, marks complete or failed',
      'Failed jobs land in the failed_jobs table — inspectable and retryable via Horizon',
    ],
  },

  // ── 03 · Code: Job Dispatching ────────────────────────────────────────────
  {
    type: 'code',
    title: 'Job Dispatching',
    subtitle: 'Encapsulating Logic',
    content: 'A Job class is a plain PHP class with a handle() method. Dependencies are injected into handle() by the container, not the constructor — because jobs are serialised to the queue and the constructor arguments become the job payload.',
    icon: Zap,
    language: 'php',
    codeFileName: 'SendWelcomeEmailJob.php',
    codeSnippet: `<?php
declare(strict_types=1);

namespace App\\Jobs;

use App\\Models\\User;
use App\\Mail\\WelcomeEmail;
use Illuminate\\Bus\\Queueable;
use Illuminate\\Contracts\\Queue\\ShouldQueue;
use Illuminate\\Foundation\\Bus\\Dispatchable;
use Illuminate\\Queue\\InteractsWithQueue;
use Illuminate\\Queue\\SerializesModels;
use Illuminate\\Support\\Facades\\Mail;

class SendWelcomeEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    // SerializesModels stores only the model ID in the payload —
    // the full model is re-fetched from the DB when the job runs.
    public function __construct(
        private readonly User $user,
    ) {}

    // Dependencies (Mail, etc.) are injected here by the container
    public function handle(): void
    {
        Mail::to($this->user->email)
            ->send(new WelcomeEmail($this->user));
    }

    // Called if the job throws an exception after all retries
    public function failed(\\Throwable $e): void
    {
        \Log::error('Welcome email failed', [
            'user_id' => $this->user->id,
            'error'   => $e->getMessage(),
        ]);
    }
}

// ── Dispatch variants ────────────────────────────────
SendWelcomeEmailJob::dispatch($user);                      // immediate
SendWelcomeEmailJob::dispatch($user)->onQueue('emails');   // named queue
SendWelcomeEmailJob::dispatch($user)->delay(now()->addMinutes(5));
SendWelcomeEmailJob::dispatchIf($user->wantsEmail, $user); // conditional`,
    keyPoints: [
      'ShouldQueue interface marks this for background execution — remove it to run inline',
      'SerializesModels stores only the ID — model is re-hydrated fresh when job runs',
      'failed() is your last chance to alert/log before the job is moved to failed_jobs',
      'onQueue(\'emails\') separates email jobs from CPU-heavy jobs for independent scaling',
    ],
  },

  // ── 04 · Diagram: Retries & Backoff ───────────────────────────────────────
  {
    type: 'diagram',
    title: 'Retries & Backoff',
    subtitle: 'Resilient Job Execution',
    content: 'When a job throws an exception it is released back to the queue with a delay. Exponential backoff increases that delay on each retry — preventing a thundering herd against a flaky third-party API. After all retries are exhausted, the job moves to failed_jobs.',
    icon: Clock,
    diagramNodes: [
      { label: 'Job Dispatched', desc: 'attempt 1',            color: '#6366f1' },
      { label: 'Exception',      desc: 'release + delay',      color: '#ef4444' },
      { label: 'Retry 2',        desc: 'backoff: 10s',         color: '#f59e0b' },
      { label: 'Retry 3',        desc: 'backoff: 100s',        color: '#f59e0b' },
      { label: 'failed_jobs',    desc: 'exhausted retries',    color: '#8b5cf6' },
    ],
  },

  // ── 05 · Code: Retries, Backoff & Delayed Jobs ────────────────────────────
  {
    type: 'code',
    title: 'Retries, Backoff & Delayed Jobs',
    subtitle: 'Resilient & Scheduled Execution',
    content: 'Job retry behaviour is configured directly on the class as properties or methods. Exponential backoff prevents hammering a failing external service. Delayed dispatch schedules a job for future execution — the worker ignores it until the delay expires.',
    icon: Clock,
    language: 'php',
    codeFileName: 'ProcessPaymentJob.php',
    codeSnippet: `<?php
declare(strict_types=1);

namespace App\\Jobs;

use App\\Models\\Order;
use App\\Services\\PaymentGateway;
use Illuminate\\Bus\\Queueable;
use Illuminate\\Contracts\\Queue\\ShouldQueue;
use Illuminate\\Foundation\\Bus\\Dispatchable;
use Illuminate\\Queue\\InteractsWithQueue;
use Illuminate\\Queue\\SerializesModels;

class ProcessPaymentJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    // Max attempts before job goes to failed_jobs
    public int $tries = 5;

    // Max execution time in seconds (prevents zombie jobs)
    public int $timeout = 60;

    // Exponential backoff: wait 10s, 100s, 1000s, 10000s between retries
    public function backoff(): array
    {
        return [10, 100, 1000, 10000];
    }

    public function __construct(
        private readonly Order $order,
    ) {}

    public function handle(PaymentGateway $gateway): void
    {
        $gateway->charge($this->order);
    }
}

// ── Delayed dispatch — runs 24 hours from now ────────
ProcessPaymentJob::dispatch($order)
    ->delay(now()->addHours(24));

// ── Dispatch at a specific datetime ──────────────────
ProcessPaymentJob::dispatch($order)
    ->delay(Carbon::parse('2026-01-01 09:00:00'));

// ── Unique jobs — prevent duplicate concurrent runs ──
// Add ShouldBeUnique to the class + uniqueId() method:
// public function uniqueId(): string { return (string) $this->order->id; }`,
    keyPoints: [
      'backoff() array maps retry N to delay in seconds — first retry waits 10s, second 100s',
      '$timeout prevents zombie workers stuck on a hung HTTP call',
      'ShouldBeUnique + uniqueId() prevents the same order being charged twice',
      'delay() uses the queue driver\'s visibility timeout — SQS supports this natively',
    ],
  },

  // ── 06 · Concept: Job Batching ────────────────────────────────────────────
  {
    type: 'concept',
    title: 'Job Batching',
    subtitle: 'Parallel Processing',
    content: 'A Bus batch dispatches multiple jobs in parallel and tracks overall progress. The then() callback fires when all jobs succeed. catch() fires if any job fails after its retries. finally() fires unconditionally when the batch is finished — success or failure.',
    icon: Layers,
    callout: 'Batches require the job_batches table: php artisan queue:batches-table && php artisan migrate. Each job in the batch must use the Batchable trait — otherwise it cannot report back to the batch.',
    keyPoints: [
      'Bus::batch([...jobs...])->dispatch() — creates a tracked batch',
      'then(fn($batch) => ...) — all jobs succeeded',
      'catch(fn($batch, $e) => ...) — at least one job failed permanently',
      'finally(fn($batch) => ...) — always runs — cleanup, notifications',
      '$batch->progress() — percentage of completed jobs (0–100)',
      'allowFailures() — batch continues even if individual jobs fail',
    ],
  },

  // ── 07 · Code: Job Batching ───────────────────────────────────────────────
  {
    type: 'code',
    title: 'Job Batching in Practice',
    subtitle: 'Parallel Processing',
    content: 'Batching is ideal for fan-out workloads: process 10,000 rows by splitting them into chunks and dispatching each chunk as a separate job. The batch callback fires when all chunks are done — giving you a reliable "all chunks processed" hook.',
    icon: Layers,
    language: 'php',
    codeFileName: 'ImportController.php',
    codeSnippet: `<?php
declare(strict_types=1);

namespace App\\Http\\Controllers;

use App\\Jobs\\ProcessImportChunkJob;
use App\\Models\\Import;
use Illuminate\\Bus\\Batch;
use Illuminate\\Support\\Buses\\Bus;
use Illuminate\\Http\\Request;

class ImportController
{
    public function store(Request $request): array
    {
        $import = Import::create(['status' => 'processing']);

        // Split 10,000 rows into 100-row chunks, one job per chunk
        $chunks = array_chunk($request->validated('rows'), 100);

        $jobs = collect($chunks)->map(
            fn($chunk) => new ProcessImportChunkJob($import, $chunk)
        )->all();

        $batch = Bus::batch($jobs)
            ->name("Import #{$import->id}")
            ->allowFailures()   // partial success is acceptable
            ->then(function (Batch $batch) use ($import) {
                $import->update(['status' => 'complete']);
            })
            ->catch(function (Batch $batch, \\Throwable $e) use ($import) {
                $import->update([
                    'status'        => 'failed',
                    'error_message' => $e->getMessage(),
                ]);
            })
            ->finally(function (Batch $batch) use ($import) {
                // Always notify regardless of outcome
                $import->owner->notify(new ImportFinishedNotification($import));
            })
            ->dispatch();

        return [
            'batch_id'  => $batch->id,
            'total'     => $batch->totalJobs,
            'progress'  => $batch->progress(), // 0%
        ];
    }
}`,
    keyPoints: [
      'array_chunk() splits a large dataset — one job per chunk avoids memory issues',
      'allowFailures() lets the batch continue even if some chunks error out',
      'finally() is the only guaranteed callback — use it for notifications and cleanup',
      'Poll GET /batches/{id} on the frontend to show a real-time progress bar',
    ],
  },

  // ── 08 · Quiz: Queues ─────────────────────────────────────────────────────
  {
    type: 'quiz',
    title: 'Queue Architecture Check',
    subtitle: 'Knowledge Check',
    content: '',
    icon: Share2,
    question: 'Your job calls a third-party payment API that is currently rate-limiting you (429 responses). You have $tries = 5 and backoff() = [10, 100, 1000, 10000]. The API recovers after 3 minutes. Which retry succeeds?',
    options: [
      {
        text: 'Retry 1 (after 10 seconds)',
        correct: false,
        explanation: '10 seconds is far too short. The API is rate-limiting for 3 minutes (180 seconds). Retry 1 at 10s will also receive a 429 and fail.',
      },
      {
        text: 'Retry 2 (after 100 seconds)',
        correct: false,
        explanation: '100 seconds is still under 3 minutes (180 seconds). The API is still rate-limiting. Retry 2 will also fail.',
      },
      {
        text: 'Retry 3 (after 1000 seconds from the previous retry)',
        correct: true,
        explanation: 'Correct. 1000 seconds is well past the 3-minute window. By retry 3, the API has recovered and the job succeeds. Exponential backoff is specifically designed for this scenario — giving external services time to recover.',
      },
      {
        text: 'The job goes straight to failed_jobs after the first 429',
        correct: false,
        explanation: 'A 429 typically throws an exception which triggers the retry cycle. It only goes to failed_jobs after all $tries are exhausted. You can also implement a RateLimitedException that calls $this->release() to re-queue without consuming a retry attempt.',
      },
    ],
  },

  // ── 09 · Diagram: Horizon ─────────────────────────────────────────────────
  {
    type: 'diagram',
    title: 'Laravel Horizon',
    subtitle: 'Queue Visibility Dashboard',
    content: 'Horizon replaces vanilla queue:work with a process supervisor that auto-balances workers across queues based on throughput. It stores metrics in Redis and exposes them via the /horizon dashboard — giving you real-time visibility into throughput, wait times, and failed jobs.',
    icon: Monitor,
    diagramNodes: [
      { label: 'Supervisor',     desc: 'keeps Horizon alive',  color: '#6366f1' },
      { label: 'Horizon Master', desc: 'process supervisor',   color: '#bf4e20' },
      { label: 'Redis',          desc: 'jobs + metrics',       color: '#ef4444' },
      { label: 'Workers ×N',     desc: 'auto-balanced',        color: '#10b981' },
      { label: '/horizon',       desc: 'live dashboard',       color: '#0ea5e9' },
    ],
  },

  // ── 10 · Concept: Event System ────────────────────────────────────────────
  {
    type: 'concept',
    title: 'Event Listeners',
    subtitle: 'Decoupled Architecture',
    content: 'Events decouple the thing that happened from the things that should happen next. An OrderPlaced event fires once; an EmailListener, an InventoryListener, and an AnalyticsListener all respond independently. Adding a new reaction requires only a new listener — the controller that fired the event is untouched.',
    icon: Share2,
    callout: 'Make listeners implement ShouldQueue to execute asynchronously. A synchronous listener that sends email inside the request cycle defeats the purpose — it makes the HTTP response wait for the mail server.',
    keyPoints: [
      'php artisan make:event OrderPlaced — creates the event class',
      'php artisan make:listener SendOrderConfirmation --event=OrderPlaced',
      'Event::dispatch(new OrderPlaced($order)) — fire the event',
      'Listeners auto-discovered in L11+ — no EventServiceProvider registration needed',
      'ShouldQueue on the listener — runs asynchronously via the queue',
      '$event->broadcastOn() — automatically broadcast the event over WebSockets',
    ],
  },

  // ── 11 · Code: Events & Listeners ─────────────────────────────────────────
  {
    type: 'code',
    title: 'Events & Listeners',
    subtitle: 'Decoupled Reactions',
    content: 'The event class is just a data container — it holds the context of what happened. Listeners are independent responders. This architecture means you can add, remove, or test each listener in complete isolation from the others.',
    icon: Share2,
    language: 'php',
    codeFileName: 'OrderPlaced.php + Listeners',
    codeSnippet: `<?php
declare(strict_types=1);

// ── The Event (data container) ────────────────────────
namespace App\\Events;

use App\\Models\\Order;
use Illuminate\\Broadcasting\\InteractsWithSockets;
use Illuminate\\Foundation\\Events\\Dispatchable;
use Illuminate\\Queue\\SerializesModels;

class OrderPlaced
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly Order $order,
    ) {}
}

// ── Listener 1: sends email asynchronously ────────────
namespace App\\Listeners;

use App\\Events\\OrderPlaced;
use App\\Mail\\OrderConfirmationMail;
use Illuminate\\Contracts\\Queue\\ShouldQueue;
use Illuminate\\Support\\Facades\\Mail;

class SendOrderConfirmation implements ShouldQueue
{
    public string $queue = 'emails';

    public function handle(OrderPlaced $event): void
    {
        Mail::to($event->order->customer_email)
            ->send(new OrderConfirmationMail($event->order));
    }
}

// ── Listener 2: decrements stock ─────────────────────
class DeductInventory implements ShouldQueue
{
    public function handle(OrderPlaced $event): void
    {
        foreach ($event->order->items as $item) {
            $item->product->decrement('stock', $item->quantity);
        }
    }
}

// ── Fire from anywhere ────────────────────────────────
// OrderPlaced::dispatch($order);
// event(new OrderPlaced($order));  // identical`,
    keyPoints: [
      'The event class holds data only — no logic, no side effects',
      'Each listener is independently queueable, testable, and deployable',
      'Add a third listener without touching OrderPlaced or any existing listener',
      'Test listeners in isolation: (new SendOrderConfirmation)->handle($event)',
    ],
  },

  // ── 12 · Diagram: Real-time Broadcasting ─────────────────────────────────
  {
    type: 'diagram',
    title: 'Real-time Broadcasting',
    subtitle: 'WebSockets Architecture',
    content: 'When a broadcastable event fires, Laravel pushes it to a WebSocket server (Reverb, Pusher, or Ably). The browser, connected via Laravel Echo, receives the event in real time. Private channels are JWT-authenticated — only the correct user receives their events.',
    icon: Radio,
    diagramNodes: [
      { label: 'Event Fired',    desc: 'ShouldBroadcast',      color: '#6366f1' },
      { label: 'Queue Worker',   desc: 'BroadcastEvent job',   color: '#8b5cf6' },
      { label: 'Reverb Server',  desc: 'WebSocket hub',        color: '#bf4e20' },
      { label: 'Echo Client',    desc: 'browser JS',           color: '#0ea5e9' },
      { label: 'UI Update',      desc: 'real-time render',     color: '#10b981' },
    ],
  },

  // ── 13 · Code: Reverb & Broadcasting ──────────────────────────────────────
  {
    type: 'code',
    title: 'Laravel Reverb',
    subtitle: 'Native WebSocket Server',
    content: 'Reverb is Laravel\'s first-party WebSocket server — a high-performance PHP process that handles thousands of concurrent connections. It replaces third-party services like Pusher for self-hosted deployments. Broadcasting an event requires only implementing ShouldBroadcast on the event class.',
    icon: Zap,
    language: 'php',
    codeFileName: 'OrderStatusUpdated.php',
    codeSnippet: `<?php
declare(strict_types=1);

namespace App\\Events;

use App\\Models\\Order;
use Illuminate\\Broadcasting\\Channel;
use Illuminate\\Broadcasting\\PrivateChannel;
use Illuminate\\Broadcasting\\PresenceChannel;
use Illuminate\\Broadcasting\\InteractsWithSockets;
use Illuminate\\Contracts\\Broadcasting\\ShouldBroadcast;
use Illuminate\\Foundation\\Events\\Dispatchable;
use Illuminate\\Queue\\SerializesModels;

class OrderStatusUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly Order $order,
    ) {}

    // Private channel — only the order's owner receives this
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("orders.{$this->order->id}"),
        ];
    }

    // Control exactly what data is broadcast — never expose full models
    public function broadcastWith(): array
    {
        return [
            'order_id' => $this->order->id,
            'status'   => $this->order->status,
            'updated'  => $this->order->updated_at->toISOString(),
        ];
    }

    // Custom event name on the JS side (default: App\\Events\\OrderStatusUpdated)
    public function broadcastAs(): string
    {
        return 'order.status.updated';
    }
}

// ── Frontend (Laravel Echo + Reverb) ─────────────────
// Echo.private(\`orders.\${orderId}\`)
//     .listen('.order.status.updated', (e) => {
//         console.log('New status:', e.status);
//     });`,
    keyPoints: [
      'PrivateChannel requires the user to be authenticated — Reverb enforces this',
      'broadcastWith() controls the payload — never broadcast raw Eloquent toArray()',
      'broadcastAs() sets a dot-prefixed event name — cleaner for JS listeners',
      'ShouldBroadcastNow skips the queue and broadcasts synchronously — use sparingly',
    ],
  },

  // ── 14 · Code: Object Caching with Tags ───────────────────────────────────
  {
    type: 'code',
    title: 'Object Caching & Tags',
    subtitle: 'Redis Cache Management',
    content: 'Cache tags group related keys under a single label. Invalidating a tag instantly clears all associated keys — without knowing their individual names and without flushing the entire cache. Essential for efficiently invalidating Eloquent model caches.',
    icon: Database,
    language: 'php',
    codeFileName: 'ProductRepository.php',
    codeSnippet: `<?php
declare(strict_types=1);

namespace App\\Repositories;

use App\\Models\\Product;
use Illuminate\\Support\\Facades\\Cache;
use Illuminate\\Database\\Eloquent\\Collection;

class ProductRepository
{
    private const TTL = 3600; // 1 hour

    public function getActive(): Collection
    {
        // Tag: 'products' — all product listing caches share this tag
        return Cache::tags(['products'])->remember(
            'products.active',
            self::TTL,
            fn() => Product::where('active', true)->with('category')->get()
        );
    }

    public function getByCategory(int $categoryId): Collection
    {
        return Cache::tags(['products', "category.{$categoryId}"])->remember(
            "products.category.{$categoryId}",
            self::TTL,
            fn() => Product::where('category_id', $categoryId)->get()
        );
    }

    // ── Call this when ANY product changes ───────────────
    public function invalidateAll(): void
    {
        // Clears every key tagged 'products' — instantly
        Cache::tags(['products'])->flush();
    }

    // ── Call this when a specific category changes ────────
    public function invalidateCategory(int $categoryId): void
    {
        Cache::tags(["category.{$categoryId}"])->flush();
    }
}

// ── Automatic invalidation via Model Observer ─────────
// class ProductObserver
// {
//     public function saved(Product $product): void
//     {
//         app(ProductRepository::class)->invalidateCategory($product->category_id);
//     }
// }`,
    keyPoints: [
      'Cache tags require Redis or Memcached — not available with the file driver',
      'tags([\'a\', \'b\'])->flush() clears only keys tagged with a OR b',
      'Model observers are the cleanest place to trigger cache invalidation',
      'remember() is read-through: cache hit returns immediately, miss executes the closure',
    ],
  },

  // ── 15 · Quiz: Caching & Events ───────────────────────────────────────────
  {
    type: 'quiz',
    title: 'Caching Architecture Check',
    subtitle: 'Knowledge Check',
    content: '',
    icon: Database,
    question: 'You update a Product and call Cache::tags([\'products\'])->flush(). A cached query tagged [\'products\', \'category.5\'] — is it cleared?',
    options: [
      {
        text: 'No — you must flush all tags in the array: flush([\'products\', \'category.5\'])',
        correct: false,
        explanation: 'Tags work as a union — a cache entry is invalidated if ANY of its tags are flushed. Flushing the "products" tag is sufficient to clear this entry, even though it also has the "category.5" tag.',
      },
      {
        text: 'Yes — flushing any tag that an entry is associated with clears that entry',
        correct: true,
        explanation: 'Correct. A cache entry belongs to all tags it was stored under. Flushing any one of those tags removes the entry. This is what makes tag-based invalidation powerful — one flush clears all related keys regardless of how they were tagged.',
      },
      {
        text: 'Only if the Redis driver is configured with tag persistence enabled',
        correct: false,
        explanation: 'There is no "tag persistence" setting. As long as you use Redis or Memcached as the cache driver, tags work automatically. File-based cache does not support tags at all.',
      },
      {
        text: 'It depends on the TTL — if the cache hasn\'t expired, flush has no effect',
        correct: false,
        explanation: 'Cache::tags()->flush() immediately removes the entries regardless of their TTL. TTL is a maximum lifetime — explicit flush overrides it.',
      },
    ],
  },

  // ── 16 · Concept: Repository Pattern ──────────────────────────────────────
  {
    type: 'concept',
    title: 'Repository Pattern',
    subtitle: 'Abstracting Data Access',
    content: 'A repository sits between your business logic and your data layer. It exposes a domain-oriented interface (getActiveProducts(), findByEmail()) rather than Eloquent\'s query builder. Business logic calls the interface; Eloquent is an implementation detail that can be swapped or mocked.',
    icon: Layers,
    callout: 'The Repository Pattern has real costs: more files, more abstraction, more indirection. Apply it when testability demands it (complex queries that are hard to mock) or when you genuinely may swap data sources. Do not apply it cargo-cult style to every model.',
    keyPoints: [
      'Define an interface: interface UserRepository { find(int $id): User; }',
      'Implement it: class EloquentUserRepository implements UserRepository',
      'Bind in a Service Provider: $this->app->bind(UserRepository::class, EloquentUserRepository::class)',
      'Inject the interface in controllers — they never import Eloquent directly',
      'In tests: bind a mock implementation — no database required',
    ],
  },

  // ── 17 · Diagram: Service Layer ───────────────────────────────────────────
  {
    type: 'diagram',
    title: 'Service Layer Logic',
    subtitle: 'Thin Everything',
    content: 'The service layer holds business rules that span multiple models, repositories, or external services. Controllers become pure HTTP adapters — they validate input, call the service, and return a response. Services become reusable from controllers, jobs, commands, and tests.',
    icon: Cpu,
    diagramNodes: [
      { label: 'Controller',     desc: 'HTTP adapter only',    color: '#6366f1' },
      { label: 'Form Request',   desc: 'validate + authorize', color: '#8b5cf6' },
      { label: 'Service',        desc: 'business rules',       color: '#bf4e20' },
      { label: 'Repository',     desc: 'data access',          color: '#0ea5e9' },
      { label: 'Eloquent / DB',  desc: 'persistence',          color: '#10b981' },
    ],
  },

  // ── 18 · Concept: Multi-Tenancy ───────────────────────────────────────────
  {
    type: 'concept',
    title: 'Multi-Tenancy Concepts',
    subtitle: 'SaaS Architecture',
    content: 'Multi-tenancy serves multiple customers from one codebase. The two main strategies are single-database (a tenant_id column on every table) and database-per-tenant (each customer gets their own schema). Each trades off simplicity, isolation, and scalability differently.',
    icon: Cloud,
    callout: 'Single-database is simpler but one missing WHERE tenant_id = ? leaks one customer\'s data to another. Database-per-tenant has strong isolation but complex migrations (you must migrate N databases on deploy). The tenancy/tenancy package handles both.',
    keyPoints: [
      'Single-DB: add tenant_id to every table + global scope on every model',
      'DB-per-tenant: switch the DB connection at the start of each request',
      'Global Eloquent scopes enforce tenant isolation automatically',
      'Stancl\\Tenancy is the ecosystem standard — supports both strategies',
      'Tenant-aware queues: job payload must include the tenant context',
      'Central DB stores tenant metadata; tenant DBs store tenant data',
    ],
  },

  // ── 19 · Diagram: Laravel Pulse ───────────────────────────────────────────
  {
    type: 'diagram',
    title: 'Laravel Pulse',
    subtitle: 'Real-time App Monitoring',
    content: 'Pulse is a first-party performance monitoring dashboard. It records slow queries, slow routes, queue throughput, exception rates, and server CPU/memory — all stored in your own database with zero external service dependency. Mount it at /pulse and restrict access in production.',
    icon: Activity,
    diagramNodes: [
      { label: 'HTTP Requests',  desc: 'slow route detection', color: '#6366f1' },
      { label: 'DB Queries',     desc: 'n+1 + slow query log', color: '#ef4444' },
      { label: 'Queue Jobs',     desc: 'throughput + failures',color: '#f59e0b' },
      { label: 'Pulse Recorder', desc: 'aggregates metrics',   color: '#8b5cf6' },
      { label: '/pulse',         desc: 'live dashboard',       color: '#10b981' },
    ],
  },

  // ── 20 · Code: Activity Logging ───────────────────────────────────────────
  {
    type: 'code',
    title: 'Activity Logging',
    subtitle: 'Audit Trail',
    content: 'spatie/laravel-activitylog records model changes and user actions to an activity_log table. Use it for GDPR audit trails, admin action logging, and debugging production data mutations. LogsActivity on the model is the zero-config path — useLogName() and getActivitylogOptions() give full control.',
    icon: ShieldCheck,
    language: 'php',
    codeFileName: 'Order.php + ActivityLog',
    codeSnippet: `<?php
declare(strict_types=1);

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Spatie\\Activitylog\\Traits\\LogsActivity;
use Spatie\\Activitylog\\LogOptions;

class Order extends Model
{
    use LogsActivity;

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['status', 'total', 'shipped_at']) // only log these fields
            ->logOnlyDirty()      // only log if value actually changed
            ->dontSubmitEmptyLogs()
            ->setDescriptionForEvent(
                fn(string $event) => "Order #{$this->id} was {$event}"
            );
    }
}

// ── Manual log entry ─────────────────────────────────
activity('payments')
    ->causedBy(auth()->user())
    ->performedOn($order)
    ->withProperties([
        'amount'   => $order->total,
        'gateway'  => 'stripe',
        'charge_id' => $chargeId,
    ])
    ->log('Payment captured');

// ── Query the log ─────────────────────────────────────
// All changes to a specific order:
$order->activities()->latest()->get();

// All actions by a user:
Activity::causedBy($user)->get();

// All failed payment logs:
Activity::inLog('payments')
    ->where('description', 'LIKE', '%failed%')
    ->get();`,
    keyPoints: [
      'logOnlyDirty() skips a log entry if the value did not change — reduces noise',
      'dontSubmitEmptyLogs() prevents empty entries when only non-logged fields change',
      'causedBy() records who made the change — null for system-triggered changes',
      'Clean up old logs: php artisan activitylog:clean --days=365',
    ],
  },

  // ── 21 · Concept: Package Development ────────────────────────────────────
  {
    type: 'concept',
    title: 'Package Development',
    subtitle: 'Reusable Ecosystem',
    content: 'A Laravel package is a standard Composer package with a Service Provider. The provider registers the package\'s bindings, publishes config/views/migrations, and registers commands. The skeleton gives you the structure — the rest is the same code you already write.',
    icon: PackageX,
    keyPoints: [
      'Use spatie/laravel-package-tools skeleton — saves 90% of the boilerplate',
      'PackageServiceProvider::configurePackage() declares name, config, migrations, commands',
      'php artisan vendor:publish --tag=your-package-config lets users override defaults',
      'Pest + Orchestra Testbench runs your package tests with a full Laravel app context',
      'Tag releases with semantic versioning — packages with unstable APIs break consumers',
      'Private packages: host on Satis or use "repositories": [{"type": "path"}] locally',
    ],
    callout: 'Extract logic into a package only when it is genuinely reusable across projects — not just to feel organised. Premature extraction creates maintenance overhead with no benefit. A domain folder inside your app is usually the right first step.',
  },

  // ── 22 · Quiz: Architecture ───────────────────────────────────────────────
  {
    type: 'quiz',
    title: 'Enterprise Architecture Check',
    subtitle: 'Knowledge Check',
    content: '',
    icon: Layers,
    question: 'An OrderPlaced event has three listeners: SendConfirmation, DeductInventory, and TrackAnalytics. SendConfirmation implements ShouldQueue. The mail server is down. What happens to the other two listeners?',
    options: [
      {
        text: 'All three listeners fail — events are atomic',
        correct: false,
        explanation: 'Events are not atomic transactions. Each listener runs independently. A failure in one does not roll back or block the others — unless they share a database transaction explicitly.',
      },
      {
        text: 'DeductInventory and TrackAnalytics run normally — SendConfirmation is queued separately',
        correct: true,
        explanation: 'Correct. ShouldQueue on SendConfirmation means it dispatches to the queue immediately and returns — the mail server failure happens later when the worker tries to send. The other two synchronous listeners run and complete without any knowledge of the email failure.',
      },
      {
        text: 'SendConfirmation blocks the event dispatch — the other listeners never run',
        correct: false,
        explanation: 'ShouldQueue dispatches the job and returns immediately. There is no blocking. The queueing itself is nearly instant (a Redis write). The actual mail sending happens later in a worker process.',
      },
      {
        text: 'The event is rolled back and re-dispatched when the mail server recovers',
        correct: false,
        explanation: 'There is no automatic event replay in Laravel. The queued job retries according to its $tries and backoff() configuration. The event itself is not re-dispatched — only the queued listener job retries.',
      },
    ],
  },

  // ── 23 · Hero: Final ──────────────────────────────────────────────────────
  {
    type: 'hero',
    title: 'Enterprise Graduation',
    subtitle: 'Final Module Review',
    content: 'You have covered queue drivers and job dispatching, retry backoff strategies, delayed jobs, job batching with progress tracking, Laravel Horizon, decoupled event/listener architecture, WebSocket broadcasting with Reverb, Redis cache tags and invalidation, the Repository and Service Layer patterns, multi-tenancy strategies, Laravel Pulse monitoring, activity logging, and package development. Build the distributed app.',
    icon: Zap,
  },
];

export default function LaravelAdvancedLessonPage() {
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
            Module 05 · Advanced Laravel
          </div>
        </div>
      </nav>

      <BackendGenericSlides lessonTitle="Laravel Enterprise Patterns" slides={advancedSlides} />
    </main>
  );
}