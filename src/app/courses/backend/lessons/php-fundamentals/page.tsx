"use client";

import BackendGenericSlides, { Slide } from "@/components/backend/lessons/backend-generic-slides";
import { ArrowLeft, Code, Zap, Layers, Terminal, Cpu, ShieldCheck, Database } from "lucide-react";
import Link from "next/link";

const phpSlides: Slide[] = [
  // ── 01 · Hero ──────────────────────────────────────────────────────────────
  {
    type: 'hero',
    title: 'PHP 8.x Architecture',
    subtitle: 'Module 01 · Modern Foundations',
    content: 'PHP is no longer the "simple" scripting language of the early web. It is a high-performance, strictly-typed backend runtime powering some of the largest systems on the planet. This module covers the internals and modern features of PHP 8.x.',
    icon: Code,
  },

  // ── 02 · Concept: Zend Engine ─────────────────────────────────────────────
  {
    type: 'concept',
    title: 'The Zend Engine',
    subtitle: 'PHP Internals',
    content: 'Every PHP script you write is processed by the Zend Engine — the virtual machine at PHP\'s core. It lexes your source into tokens, parses them into an AST, compiles to opcodes, and executes them. Understanding this pipeline explains why opcache is transformative and where JIT fits in.',
    icon: Cpu,
    callout: 'Opcache stores pre-compiled opcode on disk, skipping the lex → parse → compile phases on repeat requests. Enable it in production — always.',
    keyPoints: [
      'Lexing: source text → token stream',
      'Parsing: tokens → Abstract Syntax Tree (AST)',
      'Compilation: AST → Zend opcodes',
      'Execution: opcodes run on the Zend VM',
    ],
  },

  // ── 03 · Diagram: JIT ─────────────────────────────────────────────────────
  {
    type: 'diagram',
    title: 'JIT Compilation',
    subtitle: 'Performance Breakthrough',
    content: 'Without JIT, the Zend VM interprets opcodes on every execution. With JIT enabled, hot opcodes are compiled to native machine code on first run and cached — removing the interpreter entirely for those paths.',
    icon: Zap,
    diagramNodes: [
      { label: 'PHP Source', desc: '.php file',         color: '#6366f1' },
      { label: 'Opcache',    desc: 'cached opcodes',    color: '#8b5cf6' },
      { label: 'JIT',        desc: 'tracing / function',color: '#0ea5e9' },
      { label: 'Native',     desc: 'machine code',      color: '#10b981' },
      { label: 'CPU',        desc: 'direct execution',  color: '#f59e0b' },
    ],
  },

  // ── 04 · Code: Strict Types ────────────────────────────────────────────────
  {
    type: 'code',
    title: 'Strict Type Safety',
    subtitle: 'Modern Type System',
    content: 'Placing declare(strict_types=1) at the top of a file forces PHP to reject coercions — passing a string "42" where an int is expected throws a TypeError instead of silently converting. It\'s the single most impactful line in any professional PHP codebase.',
    icon: ShieldCheck,
    language: 'php',
    codeFileName: 'UserService.php',
    codeSnippet: `<?php
declare(strict_types=1);

namespace App\\Services;

class UserService
{
    public function getAge(int $userId): int
    {
        // Strict mode: passing "42" throws TypeError
        $user = $this->repository->find($userId);
        return $user->age; // guaranteed int
    }

    public function formatName(string $first, string $last): string
    {
        return trim("$first $last");
    }
}

// Without strict_types — this would silently work:
// $service->getAge("42");  // "42" coerced to 42

// With strict_types — this throws TypeError:
// $service->getAge("42");  // TypeError: must be int`,
    keyPoints: [
      'Per-file declaration — each file opts in independently',
      'Applies to calls made FROM that file, not calls TO it',
      'Catches bugs at call sites before they corrupt data',
    ],
  },

  // ── 05 · Code: Union & Intersection Types ─────────────────────────────────
  {
    type: 'code',
    title: 'Union & Intersection Types',
    subtitle: 'Advanced Type Logic',
    content: 'Union types (|) let a parameter accept multiple distinct types. Intersection types (&) require a value to satisfy multiple interfaces simultaneously. Together they give PHP a powerful and expressive type algebra.',
    icon: Terminal,
    language: 'php',
    codeFileName: 'types.php',
    codeSnippet: `<?php
declare(strict_types=1);

// Union type: int OR float OR null
function divide(int|float $a, int|float $b): int|float
{
    if ($b === 0) {
        throw new \\DivisionByZeroError();
    }
    return $a / $b;
}

// Intersection type: must be BOTH Countable AND Stringable
function describe(Countable&Stringable $collection): string
{
    return "Items: " . count($collection)
         . " — " . (string) $collection;
}

// DNF (Disjunctive Normal Form) — PHP 8.2
// (A&B) | null
function process((Countable&Stringable)|null $data): void
{
    if ($data === null) return;
    echo describe($data);
}`,
    keyPoints: [
      'Union (|) — either this OR that type',
      'Intersection (&) — must satisfy ALL listed interfaces',
      'DNF types combine both: (A&B)|null is valid in PHP 8.2',
    ],
  },

  // ── 06 · Quiz: Types ──────────────────────────────────────────────────────
  {
    type: 'quiz',
    title: 'Type System Check',
    subtitle: 'Knowledge Check',
    content: '',
    icon: ShieldCheck,
    question: 'You have a function typed as fn process(Countable&Stringable $x). Which of the following would satisfy it?',
    options: [
      {
        text: 'An object implementing only Countable',
        correct: false,
        explanation: 'Intersection types require ALL constraints. An object that only implements Countable fails the Stringable requirement and will cause a TypeError.',
      },
      {
        text: 'An object implementing both Countable and Stringable',
        correct: true,
        explanation: 'Correct — intersection types require the value to satisfy every interface listed. Both must be implemented simultaneously.',
      },
      {
        text: 'A plain PHP array',
        correct: false,
        explanation: 'Arrays are Countable natively, but they do not implement Stringable. They fail the intersection constraint and will throw a TypeError.',
      },
      {
        text: 'null',
        correct: false,
        explanation: 'null satisfies neither Countable nor Stringable. To allow null you\'d need a DNF type: (Countable&Stringable)|null.',
      },
    ],
  },

  // ── 07 · Code: Match Expressions ──────────────────────────────────────────
  {
    type: 'code',
    title: 'Match Expressions',
    subtitle: 'Powerful Control Flow',
    content: 'match is the strict, expression-form successor to switch. It uses strict (===) comparison, throws UnhandledMatchError if no arm matches, and each arm returns a value directly — no break needed, no silent fall-through.',
    icon: Layers,
    language: 'php',
    codeFileName: 'StatusMapper.php',
    codeSnippet: `<?php
declare(strict_types=1);

enum Status: string
{
    case Active   = 'active';
    case Inactive = 'inactive';
    case Banned   = 'banned';
}

function getStatusLabel(Status $status): string
{
    return match($status) {
        Status::Active   => 'Active User',
        Status::Inactive => 'Account Inactive',
        Status::Banned   => 'Access Revoked',
    };
    // UnhandledMatchError thrown if new enum case
    // is added but not handled here — a compile-time
    // safety net that switch never gave us.
}

// Multiple conditions per arm:
$httpLabel = match(true) {
    $code >= 500 => 'Server Error',
    $code >= 400 => 'Client Error',
    $code >= 300 => 'Redirect',
    default      => 'Success',
};`,
    keyPoints: [
      'Strict === comparison — no type coercion surprises',
      'Returns a value — assign it directly to a variable',
      'UnhandledMatchError forces you to handle every case',
      'Multiple conditions per arm: case1, case2 => value',
    ],
  },

  // ── 08 · Code: Named Arguments ────────────────────────────────────────────
  {
    type: 'code',
    title: 'Named Arguments',
    subtitle: 'Self-Documenting Code',
    content: 'Named arguments let you pass values by parameter name instead of position. This eliminates parameter-order confusion, lets you skip optional parameters in the middle, and makes call sites far more readable — especially for built-in functions with many options.',
    icon: Code,
    language: 'php',
    codeFileName: 'named-args.php',
    codeSnippet: `<?php
declare(strict_types=1);

// ── Before named args ─────────────────────────────
// Which position is which? Must read the signature.
$result = array_slice($items, 0, 5, true);

// ── After named args ──────────────────────────────
$result = array_slice(
    array:        $items,
    offset:       0,
    length:       5,
    preserve_keys: true,  // skip nothing, crystal clear
);

// ── Skip optional middle params ───────────────────
function createUser(
    string $name,
    string $role   = 'viewer',
    bool   $active = true,
    ?string $team  = null,
): User {
    // ...
}

// Only set what you need — role keeps its default:
$user = createUser(
    name:   'Amara Nwosu',
    active: true,
    team:   'backend',
);`,
    keyPoints: [
      'Pass in any order — the name is the contract, not the position',
      'Skip optional parameters without passing dummy values',
      'Combine with positional args — named args must come last',
    ],
  },

  // ── 09 · Code: Constructor Promotion ──────────────────────────────────────
  {
    type: 'code',
    title: 'Constructor Promotion',
    subtitle: 'Reducing Boilerplate',
    content: 'Constructor property promotion lets you declare and assign class properties directly in the constructor signature using a visibility modifier. It eliminates three lines of boilerplate per property — declaration, parameter, assignment — condensing them into one.',
    icon: Zap,
    language: 'php',
    codeFileName: 'OrderService.php',
    codeSnippet: `<?php
declare(strict_types=1);

// ── Old style (verbose) ───────────────────────────
class OrderServiceOld
{
    private OrderRepository $orders;
    private PaymentGateway  $payments;
    private EventDispatcher $events;

    public function __construct(
        OrderRepository $orders,
        PaymentGateway  $payments,
        EventDispatcher $events,
    ) {
        $this->orders   = $orders;
        $this->payments = $payments;
        $this->events   = $events;
    }
}

// ── New style (promoted) ──────────────────────────
class OrderService
{
    public function __construct(
        private readonly OrderRepository $orders,
        private readonly PaymentGateway  $payments,
        private readonly EventDispatcher $events,
    ) {} // body empty — PHP wires it all up
}`,
    keyPoints: [
      'Add public/protected/private to any constructor param to promote it',
      'readonly prevents accidental mutation after construction',
      'Works with default values: private string $role = "viewer"',
    ],
  },

  // ── 10 · Concept: PHP Attributes ──────────────────────────────────────────
  {
    type: 'concept',
    title: 'PHP Attributes',
    subtitle: 'Native Metadata',
    content: 'Attributes replace DocBlock annotations with first-class PHP syntax. They are parsed by the reflection API at runtime, making them reliable and IDE-friendly. Frameworks like Laravel and Symfony use Attributes for routing, dependency injection, middleware, and validation — all without runtime string parsing.',
    icon: Layers,
    callout: 'Attributes are not executed when the class loads — they are inert metadata until something reads them via reflection. This makes them zero-cost unless inspected.',
    keyPoints: [
      '#[Route(\'/api/users\', methods: [\'GET\'])] replaces /** @Route(...) */',
      'Repeatable attributes: stack multiple #[Middleware(...)] on one method',
      'Target-aware: attributes can be restricted to class/method/property/parameter',
      'Fully tree-shakeable by static analysis and IDE tooling',
    ],
  },

  // ── 11 · Diagram: Attributes in Laravel ───────────────────────────────────
  {
    type: 'diagram',
    title: 'Attribute Processing',
    subtitle: 'From Source to Runtime',
    content: 'Laravel\'s service container reads Attributes from your controller via reflection, resolves the matching middleware and route definitions, and registers them — all without a separate routing config file.',
    icon: Layers,
    diagramNodes: [
      { label: 'Controller',  desc: '#[Route] attribute',   color: '#6366f1' },
      { label: 'Reflection',  desc: 'ReflectionClass API',  color: '#8b5cf6' },
      { label: 'Container',   desc: 'Service container',    color: '#0ea5e9' },
      { label: 'Router',      desc: 'Route registration',   color: '#10b981' },
      { label: 'Request',     desc: 'Incoming HTTP',        color: '#f59e0b' },
    ],
  },

  // ── 12 · Concept: SOLID ───────────────────────────────────────────────────
  {
    type: 'concept',
    title: 'SOLID in PHP',
    subtitle: 'Clean Architecture',
    content: 'SOLID is not a PHP concept — but PHP\'s type system, interfaces, and traits make all five principles directly expressible in code. Applying them consistently produces codebases that are testable by default, open to extension, and resistant to cascading breakage.',
    icon: ShieldCheck,
    keyPoints: [
      'S — Single Responsibility: one class, one reason to change',
      'O — Open/Closed: extend behaviour without modifying existing code',
      'L — Liskov Substitution: subtypes must honour the parent contract',
      'I — Interface Segregation: many thin interfaces beat one fat one',
      'D — Dependency Inversion: depend on abstractions, inject concretions',
    ],
    callout: 'The "D" in SOLID is why PHP frameworks use DI containers. Your classes declare what they need via constructor types; the container wires up the concrete implementations.',
  },

  // ── 13 · Diagram: Interface Segregation ───────────────────────────────────
  {
    type: 'diagram',
    title: 'Interface Segregation',
    subtitle: 'Decoupling Logic',
    content: 'Rather than a single UserRepository interface with 12 methods, split by consumer need. A read-only dashboard only needs ReadableUserRepository. A command handler only needs WritableUserRepository. Neither is forced to implement what it does not use.',
    icon: Database,
    diagramNodes: [
      { label: 'ReadableRepo',  desc: 'find, findAll, paginate', color: '#0ea5e9' },
      { label: 'WritableRepo',  desc: 'save, delete, update',    color: '#10b981' },
      { label: 'UserRepo',      desc: 'implements both',         color: '#6366f1' },
      { label: 'Dashboard',     desc: 'uses Readable only',      color: '#f59e0b' },
      { label: 'CommandHandler',desc: 'uses Writable only',      color: '#ef4444' },
    ],
  },

  // ── 14 · Concept: Traits ──────────────────────────────────────────────────
  {
    type: 'concept',
    title: 'Understanding Traits',
    subtitle: 'Horizontal Code Reuse',
    content: 'PHP\'s single-inheritance model limits vertical reuse. Traits solve the horizontal problem: share concrete method implementations across unrelated classes without a common parent. Think mixins — but with PHP\'s type system enforcing the contract.',
    icon: Layers,
    callout: 'If you find yourself copying the same 3 methods into multiple unrelated classes, that\'s the trait signal. Extract them, give the trait a clear single responsibility, then use it.',
    keyPoints: [
      '"has-a" behaviour vs "is-a" inheritance — traits express behaviour',
      'Conflict resolution: insteadof and as resolve method name collisions',
      'Traits can declare abstract methods — enforcing consuming class contracts',
      'Avoid state in traits — stateful traits cause subtle bugs across classes',
    ],
  },

  // ── 15 · Code: Enums ──────────────────────────────────────────────────────
  {
    type: 'code',
    title: 'Enums in PHP 8.1',
    subtitle: 'Type-Safe Constants',
    content: 'PHP 8.1 Enums are first-class types, not syntactic sugar over constants. Backed Enums map each case to a string or int value for serialisation. You can attach methods, implement interfaces, and use them in match expressions — getting compile-time exhaustiveness.',
    icon: Layers,
    language: 'php',
    codeFileName: 'PaymentStatus.php',
    codeSnippet: `<?php
declare(strict_types=1);

// Backed Enum (string-backed)
enum PaymentStatus: string
{
    case Pending   = 'pending';
    case Captured  = 'captured';
    case Refunded  = 'refunded';
    case Failed    = 'failed';

    public function label(): string
    {
        return match($this) {
            self::Pending  => 'Awaiting Capture',
            self::Captured => 'Payment Successful',
            self::Refunded => 'Amount Returned',
            self::Failed   => 'Transaction Declined',
        };
    }

    public function isFinal(): bool
    {
        return match($this) {
            self::Captured,
            self::Refunded,
            self::Failed => true,
            default      => false,
        };
    }
}

// Usage
$status = PaymentStatus::from('captured');   // PaymentStatus::Captured
echo $status->label();                        // "Payment Successful"
echo $status->value;                          // "captured"

$maybe = PaymentStatus::tryFrom('unknown');  // null — safe`,
    keyPoints: [
      'from() throws ValueError on invalid input — use tryFrom() for safety',
      'Enums implement Stringable? No — call ->value explicitly',
      'Implement interfaces on Enums: enum Status: string implements HasLabel',
      'Store backed enum values in the DB, hydrate with from() on read',
    ],
  },

  // ── 16 · Quiz: Enums ──────────────────────────────────────────────────────
  {
    type: 'quiz',
    title: 'Enum Knowledge Check',
    subtitle: 'Knowledge Check',
    content: '',
    icon: Layers,
    question: "What is the difference between PaymentStatus::from('unknown') and PaymentStatus::tryFrom('unknown')?",
    options: [
      {
        text: "Both return null when the value doesn't exist",
        correct: false,
        explanation: "Only tryFrom() returns null. from() throws a ValueError. Using from() without a try/catch on untrusted input will crash your application.",
      },
      {
        text: "from() throws ValueError; tryFrom() returns null",
        correct: true,
        explanation: "Correct. from() is for trusted data (e.g. reading from your own DB). tryFrom() is for untrusted input (API payloads, user input) where the value may not exist.",
      },
      {
        text: "from() returns null; tryFrom() throws an exception",
        correct: false,
        explanation: "This is backwards. from() is the strict version that throws. tryFrom() is the safe version that returns null on failure.",
      },
      {
        text: "There is no difference — they are aliases",
        correct: false,
        explanation: "They have distinct, intentional semantics. from() = strict (throws). tryFrom() = lenient (returns null). Always choose based on whether the input is trusted.",
      },
    ],
  },

  // ── 17 · Code: Fibers ─────────────────────────────────────────────────────
  {
    type: 'code',
    title: 'The Fibers API',
    subtitle: 'Concurrency Prelims',
    content: 'Fibers are lightweight coroutines added in PHP 8.1. They allow a function to pause execution mid-run and yield control back to the caller, then resume exactly where it left off. This is the building block that async PHP runtimes like Revolt and ReactPHP use under the hood.',
    icon: Zap,
    language: 'php',
    codeFileName: 'fiber-demo.php',
    codeSnippet: `<?php
declare(strict_types=1);

$fiber = new Fiber(function(): string {
    echo "Fiber started\\n";

    // Suspend: yield value to caller, wait for resume
    $valueFromCaller = Fiber::suspend('first suspend');

    echo "Fiber resumed with: $valueFromCaller\\n";

    Fiber::suspend('second suspend');

    echo "Fiber finishing\\n";
    return 'done';
});

// Start the fiber — runs until first suspend
$val1 = $fiber->start();           // "Fiber started"
echo "Got: $val1\\n";              // "Got: first suspend"

// Resume — runs until next suspend or return
$val2 = $fiber->resume('hello');   // "Fiber resumed with: hello"
echo "Got: $val2\\n";              // "Got: second suspend"

$fiber->resume();                   // "Fiber finishing"
echo $fiber->getReturn() . "\\n";  // "done"`,
    keyPoints: [
      'Fibers are NOT threads — they run on the same OS thread, no parallelism',
      'Fiber::suspend() pauses execution and returns a value to the caller',
      'resume($value) passes a value back INTO the fiber at the suspend point',
      'Async libraries (Revolt, ReactPHP) build event loops on top of Fibers',
    ],
  },

  // ── 18 · Diagram: Fibers vs Traditional ───────────────────────────────────
  {
    type: 'diagram',
    title: 'Sync vs Fiber Execution',
    subtitle: 'Concurrency Model',
    content: 'In synchronous PHP, one blocking I/O call stalls the entire thread. With Fibers, the event loop can suspend the waiting fiber and run another — squeezing more work into the same CPU time without threads or processes.',
    icon: Zap,
    diagramNodes: [
      { label: 'Event Loop',  desc: 'Revolt / ReactPHP',  color: '#6366f1' },
      { label: 'Fiber A',     desc: 'DB query (waiting)',  color: '#0ea5e9' },
      { label: 'Fiber B',     desc: 'HTTP call (waiting)', color: '#10b981' },
      { label: 'Fiber C',     desc: 'CPU work (running)',  color: '#f59e0b' },
      { label: 'OS I/O',      desc: 'epoll / kqueue',     color: '#8b5cf6' },
    ],
  },

  // ── 19 · Concept: Composer ────────────────────────────────────────────────
  {
    type: 'concept',
    title: 'Composer Mastery',
    subtitle: 'Dependency Ecosystem',
    content: 'Composer is PHP\'s dependency manager — but it is also an autoloader, a build tool, and a package publisher. The composer.lock file is the source of truth for reproducible deployments: it pins every transitive dependency to an exact version so that "works on my machine" stays dead.',
    icon: Database,
    callout: 'Commit composer.lock to version control. Always. It is not an artifact — it is part of your application. CI should run composer install (not update) to reproduce the exact locked state.',
    keyPoints: [
      'composer.json declares constraints; composer.lock declares exact versions',
      'Semantic versioning: ^2.0 allows 2.x, ~2.1 allows 2.1.x',
      'composer install — reproduces lock exactly (use in CI and production)',
      'composer update — resolves newest versions within constraints (use locally)',
      'Private packages: host on Satis, Packeton, or use path repositories',
    ],
  },

  // ── 20 · Concept: PSR Standards ───────────────────────────────────────────
  {
    type: 'concept',
    title: 'PSR Standards',
    subtitle: 'PHP FIG Consistency',
    content: 'The PHP-FIG (Framework Interoperability Group) publishes PSRs that let libraries interoperate without knowing about each other. PSR-4 autoloading is why you never write require again. PSR-12 is the coding style that keeps the global PHP community readable across teams.',
    icon: Layers,
    keyPoints: [
      'PSR-1 — Basic coding standard: one class per file, StudlyCaps class names',
      'PSR-4 — Autoloading: namespace App\\Services maps to src/Services/ directory',
      'PSR-7 — HTTP message interfaces: framework-agnostic request/response objects',
      'PSR-11 — Container interface: swap DI containers without changing consumers',
      'PSR-12 — Extended coding style: indentation, braces, line length rules',
      'PSR-15 — HTTP middleware: the interface Laravel and Slim both implement',
    ],
    callout: 'PSR-4 autoloading + Composer = zero require/include in modern PHP. Define the namespace-to-path mapping in composer.json autoload and never look back.',
  },

  // ── 21 · Code: Pest Testing ───────────────────────────────────────────────
  {
    type: 'code',
    title: 'Pest Testing',
    subtitle: 'Beautiful Testing',
    content: 'Pest is built on PHPUnit but replaces the verbose class-per-test-case model with a minimal expressive syntax inspired by Jest. Tests read like sentences. Architectural tests, mutation testing, and parallel execution come built-in.',
    icon: Zap,
    language: 'php',
    codeFileName: 'UserTest.php',
    codeSnippet: `<?php
declare(strict_types=1);

use App\\Models\\User;
use App\\Services\\UserService;

// Group related tests in a describe block
describe('UserService', function () {

    beforeEach(function () {
        $this->service = new UserService(
            new InMemoryUserRepository()
        );
    });

    it('creates a user with the given name', function () {
        $user = $this->service->create('Amara Nwosu');

        expect($user)
            ->toBeInstanceOf(User::class)
            ->and($user->name)->toBe('Amara Nwosu')
            ->and($user->id)->not->toBeNull();
    });

    it('throws when name is empty', function () {
        $this->service->create('');
    })->throws(\\InvalidArgumentException::class);

    // Data-driven: run the same test with different inputs
    it('formats names correctly', function (string $input, string $expected) {
        expect($this->service->formatName($input))->toBe($expected);
    })->with([
        ['  john doe  ', 'john doe'],
        ['JANE',         'JANE'],
    ]);
});`,
    keyPoints: [
      'it() replaces test methods — reads like a specification',
      'expect() chains: expect($x)->toBe()->and()->not->toBeNull()',
      'with() drives parametric tests without copy-paste',
      'arch()->preset()->php() enforces architecture rules in CI',
    ],
  },

  // ── 22 · Quiz: Final ──────────────────────────────────────────────────────
  {
    type: 'quiz',
    title: 'Module Review',
    subtitle: 'Knowledge Check',
    content: '',
    icon: Code,
    question: "In a Composer project, what is the correct command to run in CI and production to get a reproducible build?",
    options: [
      {
        text: 'composer update',
        correct: false,
        explanation: 'composer update resolves the newest versions satisfying your constraints and writes a new lock file. This is non-deterministic across environments — never use it in CI or production.',
      },
      {
        text: 'composer install',
        correct: true,
        explanation: 'Correct. composer install reads composer.lock and installs the exact pinned versions. If the lock file is missing it falls back to update — which is why you must commit the lock file.',
      },
      {
        text: 'composer require',
        correct: false,
        explanation: 'composer require adds a new package to composer.json and resolves its version. It is for adding new dependencies during development, not for deploying.',
      },
      {
        text: 'composer dump-autoload',
        correct: false,
        explanation: 'composer dump-autoload regenerates the autoloader class map. It does not install packages. You might run it after install, but not instead of it.',
      },
    ],
  },

  // ── 23 · Hero: Final ──────────────────────────────────────────────────────
  {
    type: 'hero',
    title: 'PHP Mastery Project',
    subtitle: 'Final Module Review',
    content: 'You have covered the Zend Engine, JIT, strict typing, union and intersection types, match expressions, named arguments, constructor promotion, Attributes, SOLID principles, Traits, Enums, Fibers, Composer, PSR standards, and modern testing with Pest. Now build something with all of it.',
    icon: Code,
  },
];

export default function PhpFundamentalsLessonPage() {
  return (
    <main className="min-h-screen bg-[#fafaf8] overflow-hidden">
      <nav
        className="px-8 py-5 sticky top-0 z-50 border-b"
        style={{ borderColor: 'rgba(0,0,0,0.06)', background: 'rgba(250,250,248,0.92)', backdropFilter: 'blur(12px)' }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/courses/backend"
            className="group flex items-center gap-2.5 text-sm font-medium transition-colors"
            style={{ color: '#7a7a7a' }}
          >
            <ArrowLeft size={15} />
            <span style={{ letterSpacing: '0.01em' }}>Back to Roadmap</span>
          </Link>

          <div
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-widest"
            style={{ borderColor: 'rgba(0,0,0,0.08)', color: '#b8b8b8', letterSpacing: '0.16em' }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: '#bf4e20' }}
            />
            Module 01 · PHP Foundations
          </div>
        </div>
      </nav>

      <BackendGenericSlides lessonTitle="PHP Specialist Core" slides={phpSlides} />
    </main>
  );
}