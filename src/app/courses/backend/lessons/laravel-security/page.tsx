"use client";

import BackendGenericSlides, { Slide } from "@/components/backend/lessons/backend-generic-slides";
import { ArrowLeft, ShieldCheck, Zap, Layers, Terminal, Fingerprint, Lock, Key, EyeOff, AlertTriangle, UserCheck } from "lucide-react";
import Link from "next/link";

const securitySlides: Slide[] = [

  // ── 01 · Hero ──────────────────────────────────────────────────────────────
  {
    type: 'hero',
    title: 'Laravel Hardening',
    subtitle: 'Module 04 · Industrial Security Architecture',
    content: 'Security is not a feature you bolt on at the end. It is a discipline woven into every route, every model, every response. This module teaches the complete Laravel security surface — from hashing and CSRF to OAuth2, RBAC, and CSP headers.',
    icon: ShieldCheck,
  },

  // ── 02 · Concept: Security Layer ──────────────────────────────────────────
  {
    type: 'concept',
    title: 'The Security Layer',
    subtitle: 'Deep Core Protection',
    content: 'Laravel provides automatic defence against the three most common web vulnerabilities without you writing a single line of security code. Understanding what it does — and why — tells you exactly where the gaps are when you step outside the framework.',
    icon: Lock,
    callout: 'Laravel\'s protections are only active when you use the framework properly. Raw DB::statement() bypasses query binding. Unescaped {!! !!} bypasses XSS protection. Knowing the escape hatches means knowing where to be vigilant.',
    keyPoints: [
      'SQL Injection — Eloquent and the query builder use PDO prepared statements everywhere',
      'XSS — Blade\'s {{ }} syntax HTML-escapes all output by default',
      'CSRF — the VerifyCsrfToken middleware validates every non-GET state-changing request',
      'Mass Assignment — $fillable / $guarded controls which columns a user can touch',
    ],
  },

  // ── 03 · Code: Password Hashing ───────────────────────────────────────────
  {
    type: 'code',
    title: 'Password Hashing',
    subtitle: 'Bcrypt & Argon2',
    content: 'Passwords must never be stored in plain text or with reversible encryption. Laravel\'s Hash facade uses bcrypt by default (cost factor 12) and supports Argon2id — a memory-hard algorithm recommended by OWASP for modern systems. Verification is always constant-time.',
    icon: Key,
    language: 'php',
    codeFileName: 'AuthService.php',
    codeSnippet: `<?php
declare(strict_types=1);

namespace App\\Services;

use Illuminate\\Support\\Facades\\Hash;
use App\\Models\\User;

class AuthService
{
    public function register(string $email, string $password): User
    {
        // Hash::make() uses bcrypt (cost=12) by default.
        // Never pass $password directly to the DB.
        return User::create([
            'email'    => $email,
            'password' => Hash::make($password),
        ]);
    }

    public function attempt(string $email, string $password): bool
    {
        $user = User::where('email', $email)->first();

        if (! $user) {
            // Run a dummy check to prevent timing attacks —
            // an attacker can't detect "no user" vs "wrong pass"
            Hash::check($password, '$2y$12$dummy.hash.prevent.timing');
            return false;
        }

        // hash_equals() under the hood — constant-time compare
        return Hash::check($password, $user->password);
    }

    public function rehashIfNeeded(User $user, string $plaintext): void
    {
        // Automatically upgrade old bcrypt cost to current config
        if (Hash::needsRehash($user->password)) {
            $user->update(['password' => Hash::make($plaintext)]);
        }
    }
}`,
    keyPoints: [
      'Hash::make() is one-way — you can never reverse it',
      'Hash::check() uses constant-time comparison to prevent timing attacks',
      'Hash::needsRehash() upgrades passwords automatically on next login',
      'Switch to Argon2id in config/hashing.php for memory-hard resistance',
    ],
  },

  // ── 04 · Diagram: Session vs Token ────────────────────────────────────────
  {
    type: 'diagram',
    title: 'Session vs Token Auth',
    subtitle: 'Stateful vs Stateless',
    content: 'Sessions store state server-side and use a cookie to reference it — great for monolithic web apps. Tokens (JWT/Sanctum) are stateless: the server verifies the token cryptographically and needs no memory of previous requests — ideal for APIs and SPAs.',
    icon: Layers,
    diagramNodes: [
      { label: 'Browser',       desc: 'sends cookie',          color: '#6366f1' },
      { label: 'Session Store', desc: 'Redis / DB / file',     color: '#8b5cf6' },
      { label: 'Auth Guard',    desc: 'resolves user',         color: '#0ea5e9' },
      { label: 'Controller',    desc: 'auth()->user()',        color: '#10b981' },
      { label: 'Response',      desc: 'JSON / HTML',           color: '#f59e0b' },
    ],
  },

  // ── 05 · Code: Laravel Sanctum ────────────────────────────────────────────
  {
    type: 'code',
    title: 'Laravel Sanctum',
    subtitle: 'Lightweight Auth',
    content: 'Sanctum handles two scenarios with one package: cookie-based SPA authentication (for your Next.js or React frontend on the same domain) and API token authentication (for mobile apps and third-party clients). It is the right choice for 90% of Laravel projects.',
    icon: Fingerprint,
    language: 'php',
    codeFileName: 'AuthController.php',
    codeSnippet: `<?php
declare(strict_types=1);

namespace App\\Http\\Controllers\\Api;

use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Auth;
use App\\Models\\User;

class AuthController
{
    // Issue a named token — store only the plain-text
    // version once; the DB stores the hashed form.
    public function login(Request $request): array
    {
        $request->validate([
            'email'       => 'required|email',
            'password'    => 'required|string',
            'device_name' => 'required|string|max:255',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Auth::attempt($request->only('email', 'password'))) {
            abort(422, 'Invalid credentials.');
        }

        // Tokens can have abilities (scopes)
        $token = $user->createToken(
            name:       $request->device_name,
            abilities:  ['orders:read', 'profile:write'],
            expiresAt:  now()->addDays(30),
        );

        return ['token' => $token->plainTextToken];
    }

    public function logout(Request $request): void
    {
        // Revoke the current token only (not all tokens)
        $request->user()->currentAccessToken()->delete();
    }

    public function logoutAll(Request $request): void
    {
        // Revoke ALL tokens for this user (e.g. "sign out everywhere")
        $request->user()->tokens()->delete();
    }
}`,
    keyPoints: [
      'plainTextToken is returned once — Sanctum stores only the hashed version',
      'abilities act as scopes — check with $request->user()->tokenCan(\'orders:read\')',
      'SPA auth uses cookies + CSRF; token auth uses Authorization: Bearer headers',
      'expiresAt on createToken() sets automatic expiry — no cron needed',
    ],
  },

  // ── 06 · Quiz: Sanctum ────────────────────────────────────────────────────
  {
    type: 'quiz',
    title: 'Sanctum Token Check',
    subtitle: 'Knowledge Check',
    content: '',
    icon: Fingerprint,
    question: 'A user logs in from two devices. You call $user->tokens()->delete(). What happens?',
    options: [
      {
        text: 'Only the current request\'s token is revoked',
        correct: false,
        explanation: 'That is what currentAccessToken()->delete() does. tokens()->delete() targets the entire tokens relationship — all rows for this user.',
      },
      {
        text: 'All tokens for this user are revoked across every device',
        correct: true,
        explanation: 'Correct. tokens() is an Eloquent relationship returning all personal access tokens for this user. Calling delete() on the query removes every token — a "sign out everywhere" operation.',
      },
      {
        text: 'Tokens are soft-deleted and can be restored',
        correct: false,
        explanation: 'Personal access tokens do not use soft deletes by default. The rows are hard-deleted from personal_access_tokens. The user must log in again to get a new token.',
      },
      {
        text: 'The user\'s password is also reset',
        correct: false,
        explanation: 'Token revocation and password management are completely independent. Only the personal_access_tokens rows are affected.',
      },
    ],
  },

  // ── 07 · Diagram: OAuth2 / Passport ───────────────────────────────────────
  {
    type: 'diagram',
    title: 'Passport & OAuth2',
    subtitle: 'Full Authorization Server',
    content: 'Passport turns your Laravel app into a full OAuth2 authorization server. Use it when third-party apps need delegated access to your users\' data — not for securing your own SPA (that\'s Sanctum\'s job).',
    icon: ShieldCheck,
    diagramNodes: [
      { label: 'Client App',    desc: 'third-party',          color: '#6366f1' },
      { label: 'Auth Server',   desc: 'Laravel Passport',     color: '#bf4e20' },
      { label: 'User',          desc: 'grants permission',    color: '#0ea5e9' },
      { label: 'Access Token',  desc: 'JWT / opaque',         color: '#10b981' },
      { label: 'Resource API',  desc: 'your endpoints',       color: '#f59e0b' },
    ],
  },

  // ── 08 · Code: Gates ──────────────────────────────────────────────────────
  {
    type: 'code',
    title: 'Gates: Simple Closures',
    subtitle: 'Quick Authorization',
    content: 'Gates are closure-based authorization checks registered in your AuthServiceProvider. They are ideal for actions that are not tied to a specific Eloquent model — admin panel access, feature flags, global toggles. For model-specific rules, use Policies.',
    icon: Zap,
    language: 'php',
    codeFileName: 'AuthServiceProvider.php',
    codeSnippet: `<?php
declare(strict_types=1);

namespace App\\Providers;

use Illuminate\\Support\\Facades\\Gate;
use Illuminate\\Foundation\\Support\\Providers\\AuthServiceProvider as ServiceProvider;
use App\\Models\\User;

class AuthServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Simple role check — define once, use anywhere
        Gate::define('access-admin', function (User $user): bool {
            return $user->role === 'admin';
        });

        // Gate with additional argument
        Gate::define('manage-team', function (User $user, string $teamId): bool {
            return $user->teams()->where('id', $teamId)->exists();
        });

        // Super-admin bypass — before() runs BEFORE all other checks
        Gate::before(function (User $user): ?bool {
            if ($user->isSuperAdmin()) {
                return true; // skip all other gates and policies
            }
            return null; // continue to normal check
        });
    }
}

// ── Usage ──────────────────────────────────────────
// In a controller:
Gate::authorize('access-admin');          // throws 403 if denied
$can = Gate::allows('manage-team', $id);  // boolean, no throw

// In Blade:
// @can('access-admin') ... @endcan`,
    keyPoints: [
      'Gates receive the authenticated user automatically as the first argument',
      'Gate::authorize() throws AuthorizationException (403) — no if/abort needed',
      'Gate::before() acts as a super-admin bypass — return null to pass through',
      'Gates are for non-model rules; Policies are for CRUD on specific models',
    ],
  },

  // ── 09 · Code: Model Policies ─────────────────────────────────────────────
  {
    type: 'code',
    title: 'Model Policies',
    subtitle: 'Class-Based Authorization',
    content: 'Policies group all authorization logic for a model into a single class. Laravel automatically discovers PostPolicy for the Post model. Every resource controller maps to a policy method — making authorization predictable, testable, and centralized.',
    icon: UserCheck,
    language: 'php',
    codeFileName: 'PostPolicy.php',
    codeSnippet: `<?php
declare(strict_types=1);

namespace App\\Policies;

use App\\Models\\Post;
use App\\Models\\User;

class PostPolicy
{
    // Called before all other methods — return true to bypass
    public function before(User $user): ?bool
    {
        return $user->isAdmin() ? true : null;
    }

    public function viewAny(User $user): bool
    {
        return true; // any authenticated user can list posts
    }

    public function view(User $user, Post $post): bool
    {
        return $post->is_published || $user->id === $post->author_id;
    }

    public function create(User $user): bool
    {
        return $user->hasVerifiedEmail();
    }

    public function update(User $user, Post $post): bool
    {
        return $user->id === $post->author_id;
    }

    public function delete(User $user, Post $post): bool
    {
        // Author can delete drafts; only admin can delete published
        return $user->id === $post->author_id && ! $post->is_published;
    }
}

// ── Usage in controller ────────────────────────────
// $this->authorize('update', $post);  // throws 403
// In Blade: @can('update', $post) ... @endcan`,
    keyPoints: [
      'Laravel auto-discovers PostPolicy for Post — no registration needed in L10+',
      'before() in a Policy only applies to that model, unlike Gate::before()',
      '$this->authorize() in controllers maps to the policy method by action name',
      'Policies are unit-testable: $user->can(\'update\', $post) returns bool',
    ],
  },

  // ── 10 · Diagram: Middleware Guarding ─────────────────────────────────────
  {
    type: 'diagram',
    title: 'Middleware Guarding',
    subtitle: 'The First Barrier',
    content: 'Middleware runs before your controller. Stack auth, ability, and throttle middleware on route groups to reject invalid requests at the edge — before any database query or business logic executes.',
    icon: Lock,
    diagramNodes: [
      { label: 'HTTP Request',  desc: 'from client',          color: '#6366f1' },
      { label: 'throttle',      desc: '60/min per IP',        color: '#ef4444' },
      { label: 'auth:sanctum',  desc: 'valid token?',         color: '#8b5cf6' },
      { label: 'can:publish',   desc: 'ability check',        color: '#0ea5e9' },
      { label: 'Controller',    desc: 'safe to execute',      color: '#10b981' },
    ],
  },

  // ── 11 · Concept: Mass Assignment ─────────────────────────────────────────
  {
    type: 'concept',
    title: 'Mass Assignment',
    subtitle: 'Fillable vs Guarded',
    content: 'Mass assignment lets you pass an array of attributes directly to Model::create() or $model->fill(). Without protection, a malicious user can include fields like "is_admin=1" in a POST body and escalate their own privileges. Laravel blocks this by default — you must explicitly opt in.',
    icon: EyeOff,
    callout: 'Never use $guarded = [] (unguard everything) in production. And never pass $request->all() directly to create() without checking what fields are actually in the request.',
    keyPoints: [
      '$fillable = [\'name\', \'email\'] — whitelist: only these columns can be mass-assigned',
      '$guarded = [\'is_admin\', \'role\'] — blacklist: every column except these',
      'Whitelist ($fillable) is always safer — new columns are blocked by default',
      'Use $request->only([...]) or $request->validated() before passing to create()',
    ],
  },

  // ── 12 · Code: Rate Limiting ──────────────────────────────────────────────
  {
    type: 'code',
    title: 'Rate Limiting',
    subtitle: 'Anti-Brute Force',
    content: 'Laravel\'s RateLimiter facade lets you define named throttle rules with custom keys, limits, and decay windows. Apply them via middleware or manually in controllers. Combine per-IP and per-user keys to block both anonymous hammering and authenticated abuse.',
    icon: AlertTriangle,
    language: 'php',
    codeFileName: 'AppServiceProvider.php',
    codeSnippet: `<?php
declare(strict_types=1);

namespace App\\Providers;

use Illuminate\\Cache\\RateLimiting\\Limit;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\RateLimiter;
use Illuminate\\Support\\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Login endpoint: 5 attempts per minute per IP+email combo
        RateLimiter::for('login', function (Request $request): Limit {
            return Limit::perMinute(5)
                ->by($request->input('email') . '|' . $request->ip())
                ->response(function () {
                    return response()->json([
                        'message' => 'Too many attempts. Try again in 60s.',
                    ], 429);
                });
        });

        // API: authenticated users get 120/min; guests get 30/min
        RateLimiter::for('api', function (Request $request): Limit {
            return $request->user()
                ? Limit::perMinute(120)->by($request->user()->id)
                : Limit::perMinute(30)->by($request->ip());
        });

        // Global daily cap per user (e.g. AI generation endpoint)
        RateLimiter::for('ai-generate', function (Request $request): Limit {
            return Limit::perDay(50)->by($request->user()?->id ?? $request->ip());
        });
    }
}

// routes/api.php
// Route::middleware(['auth:sanctum', 'throttle:api'])->group(...)
// Route::middleware(['auth:sanctum', 'throttle:ai-generate'])->group(...)`,
    keyPoints: [
      'Key by email|IP together — prevents one IP from locking all accounts',
      'Differentiate authenticated vs guest limits in the same named limiter',
      'Custom response() callback controls the 429 JSON body',
      'perDay(), perHour(), perMinute() — all supported natively',
    ],
  },

  // ── 13 · Quiz: Rate Limiting ──────────────────────────────────────────────
  {
    type: 'quiz',
    title: 'Rate Limiting Check',
    subtitle: 'Knowledge Check',
    content: '',
    icon: AlertTriangle,
    question: 'Your login limiter keys by email|IP. An attacker tries the same password against 1000 different email addresses from the same IP. Are they blocked?',
    options: [
      {
        text: 'Yes — the IP portion of the key catches this',
        correct: false,
        explanation: 'The key is email|IP combined. Each email+IP pair gets its own counter. Trying 1000 different emails creates 1000 separate counters — each starts fresh at 0. The combined key does NOT protect against this pattern.',
      },
      {
        text: 'No — each email gets its own counter, so the attacker can spray freely',
        correct: true,
        explanation: 'Correct. This is a "password spray" attack. To block it, add a second IP-only limiter: Limit::perMinute(20)->by($request->ip()) as a Limit array — rate limiters accept arrays to combine multiple rules.',
      },
      {
        text: 'Yes — Laravel detects spray patterns automatically',
        correct: false,
        explanation: 'Laravel\'s rate limiter is a counter, not a pattern detector. It has no concept of "spray." You must explicitly add an IP-only limit to block this vector.',
      },
      {
        text: 'It depends on whether the user exists in the database',
        correct: false,
        explanation: 'Rate limiting happens before any database lookup. Whether the email exists is irrelevant — the counter increments on the request itself.',
      },
    ],
  },

  // ── 14 · Diagram: CORS ────────────────────────────────────────────────────
  {
    type: 'diagram',
    title: 'CORS Configuration',
    subtitle: 'Cross-Origin Safety',
    content: 'CORS is enforced by the browser, not the server. Your server sends Access-Control-Allow-Origin headers that tell the browser which origins are allowed. A misconfigured wildcard (*) with credentials allows any site to make authenticated requests to your API on behalf of your users.',
    icon: Layers,
    diagramNodes: [
      { label: 'Browser',       desc: 'app.yourco.com',       color: '#6366f1' },
      { label: 'Preflight',     desc: 'OPTIONS request',      color: '#8b5cf6' },
      { label: 'CORS Middleware',desc: 'HandleCors',          color: '#0ea5e9' },
      { label: 'Allow Header',  desc: 'Access-Control-*',     color: '#10b981' },
      { label: 'API Response',  desc: 'actual data',          color: '#f59e0b' },
    ],
  },

  // ── 15 · Concept: Secret Management ──────────────────────────────────────
  {
    type: 'concept',
    title: 'Secret Management',
    subtitle: '.env & Encryption',
    content: 'The .env file is for local development only. In production, secrets are injected as environment variables by your hosting platform (Forge, Vapor, Railway, ECS task definitions). Laravel\'s Crypt facade provides authenticated AES-256-CBC encryption for sensitive values you must persist to the database.',
    icon: Key,
    callout: 'Never commit .env to version control. Add it to .gitignore permanently. Use php artisan key:generate once and rotate APP_KEY only with careful planning — it invalidates all encrypted values and sessions.',
    keyPoints: [
      'config() caches env values — never call env() outside of config/ files',
      'Crypt::encryptString($value) stores AES-256-CBC ciphertext in the DB',
      'Crypt::decryptString() verifies the MAC — tampered values throw DecryptException',
      'Use Laravel Vault integration or AWS Secrets Manager for production secrets at scale',
    ],
  },

  // ── 16 · Code: Attribute Hiding ───────────────────────────────────────────
  {
    type: 'code',
    title: 'Attribute Hiding',
    subtitle: 'Data Privacy',
    content: 'The $hidden array on an Eloquent model prevents listed attributes from appearing in toArray() or toJson() output — protecting passwords, tokens, and internal flags from leaking into API responses or logs. Use $visible for the inverse: only these fields are ever exposed.',
    icon: EyeOff,
    language: 'php',
    codeFileName: 'User.php',
    codeSnippet: `<?php
declare(strict_types=1);

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Casts\\Attribute;
use Illuminate\\Support\\Facades\\Crypt;

class User extends Model
{
    // These columns are NEVER included in JSON/array output
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    // These columns ARE encrypted at rest in the database
    protected $casts = [
        'email_verified_at' => 'datetime',
        'two_factor_secret' => 'encrypted',  // auto Crypt on read/write
    ];

    // Custom accessor — expose only masked card number
    protected function cardNumber(): Attribute
    {
        return Attribute::make(
            get: fn (string $value) => '****' . substr(Crypt::decryptString($value), -4),
        );
    }
}

// API Resource — the professional alternative to $hidden:
// Explicitly declare which fields an endpoint exposes.
// class UserResource extends JsonResource
// {
//     public function toArray(Request $request): array
//     {
//         return ['id' => $this->id, 'name' => $this->name, ...];
//     }
// }`,
    keyPoints: [
      '$hidden blocks fields in all JSON responses, forever — use API Resources for per-endpoint control',
      '\'encrypted\' cast in $casts auto-encrypts on save and decrypts on read',
      'makeVisible([\'password\']) temporarily un-hides — use only in internal seeder/admin code',
      'API Resources are better than $hidden for most cases — explicit over implicit',
    ],
  },

  // ── 17 · Diagram: CSP Headers ─────────────────────────────────────────────
  {
    type: 'diagram',
    title: 'CSP Headers',
    subtitle: 'In-Browser Security',
    content: 'A Content Security Policy is a response header that tells the browser which sources are allowed to load scripts, styles, images, and fonts. A strict CSP stops XSS payloads from executing even if an attacker successfully injects a script tag.',
    icon: ShieldCheck,
    diagramNodes: [
      { label: 'Server',        desc: 'Content-Security-Policy', color: '#6366f1' },
      { label: 'Browser',       desc: 'parses directives',       color: '#8b5cf6' },
      { label: 'script-src',    desc: 'self + cdn only',         color: '#0ea5e9' },
      { label: 'Inline Script', desc: 'blocked by nonce',        color: '#ef4444' },
      { label: 'Violation',     desc: 'report-uri logged',       color: '#f59e0b' },
    ],
  },

  // ── 18 · Concept: CSRF Internals ──────────────────────────────────────────
  {
    type: 'concept',
    title: 'CSRF Internals',
    subtitle: 'Token Exchange',
    content: 'Cross-Site Request Forgery tricks a logged-in user\'s browser into submitting a state-changing request to your app from a malicious site. Laravel prevents this by issuing a random token per session and requiring it on every POST, PUT, PATCH, and DELETE request.',
    icon: Fingerprint,
    callout: 'When building SPAs with Sanctum, call GET /sanctum/csrf-cookie first. Sanctum sets the XSRF-TOKEN cookie; Axios and fetch automatically include it as the X-XSRF-TOKEN header on subsequent requests.',
    keyPoints: [
      'The CSRF token is stored in the session and in a XSRF-TOKEN cookie',
      'VerifyCsrfToken middleware compares the header/form field to the session value',
      'Route::post() without @csrf in the Blade form throws TokenMismatchException (419)',
      'Exclude webhook endpoints in VerifyCsrfToken::$except — they use signed secrets instead',
    ],
  },

  // ── 19 · Code: Input Sanitization ─────────────────────────────────────────
  {
    type: 'code',
    title: 'Input Sanitization',
    subtitle: 'Cleaner Data',
    content: 'Validation confirms shape and type. Sanitization removes or transforms dangerous content. Both are necessary. Use Form Requests to co-locate validation rules and prepareForValidation() to normalise input before rules run.',
    icon: Terminal,
    language: 'php',
    codeFileName: 'StorePostRequest.php',
    codeSnippet: `<?php
declare(strict_types=1);

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;
use Illuminate\\Support\\Str;

class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Post::class);
    }

    // Runs BEFORE validation rules — normalise input here
    protected function prepareForValidation(): void
    {
        $this->merge([
            // Trim whitespace from all string fields
            'title'   => trim($this->input('title', '')),
            // Strip all HTML tags from user-generated content
            'excerpt' => strip_tags($this->input('excerpt', '')),
            // Slugify title for URL
            'slug'    => Str::slug($this->input('title', '')),
            // Normalise boolean
            'published' => filter_var(
                $this->input('published', false),
                FILTER_VALIDATE_BOOLEAN,
            ),
        ]);
    }

    public function rules(): array
    {
        return [
            'title'     => ['required', 'string', 'min:3', 'max:200'],
            'excerpt'   => ['nullable', 'string', 'max:500'],
            'slug'      => ['required', 'string', 'unique:posts,slug'],
            'body'      => ['required', 'string', 'min:50'],
            'published' => ['boolean'],
        ];
    }
}`,
    keyPoints: [
      'prepareForValidation() mutates input before rules run — ideal for normalization',
      'strip_tags() removes HTML; use HTMLPurifier for rich-text content with allowed tags',
      'filter_var(FILTER_VALIDATE_BOOLEAN) handles "true"/"false"/"1"/"0" safely',
      'Never sanitize to prevent SQL injection — use parameterized queries (Eloquent does this)',
    ],
  },

  // ── 20 · Code: Security Auditing ──────────────────────────────────────────
  {
    type: 'code',
    title: 'Security Auditing',
    subtitle: 'Active Scanning',
    content: 'composer audit scans your installed packages against the PHP Security Advisories Database and exits non-zero if vulnerable packages are found — making it trivial to block deployments with known CVEs in CI. Pair it with Enlightn for Laravel-specific checks.',
    icon: AlertTriangle,
    language: 'bash',
    codeFileName: '.github/workflows/security.yml',
    codeSnippet: `# .github/workflows/security.yml
name: Security Audit

on: [push, pull_request, schedule]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install dependencies
        run: composer install --no-dev --prefer-dist

      # Fails the build if any installed package has a known CVE
      - name: Composer Security Audit
        run: composer audit --format=json | tee audit.json
        continue-on-error: false

      # Laravel-specific checks: debug mode, queue encryption,
      # open redirects, unprotected routes, exposed env files...
      - name: Enlightn Security Scan
        run: php artisan enlightn --ci --report

      # Upload report as artifact for review
      - uses: actions/upload-artifact@v4
        with:
          name: security-audit
          path: audit.json

# composer.json — run locally before every commit:
# "scripts": {
#   "audit": "composer audit && php artisan enlightn"
# }`,
    keyPoints: [
      'composer audit checks installed packages against PHP Security Advisories',
      'Enlightn checks 100+ Laravel-specific security rules — config leaks, header issues, etc.',
      'Pin this as a required CI check — block merges if the audit fails',
      'composer audit --abandoned also flags unmaintained packages',
    ],
  },

  // ── 21 · Concept: RBAC ────────────────────────────────────────────────────
  {
    type: 'concept',
    title: 'Roles & Permissions',
    subtitle: 'RBAC Logic',
    content: 'Role-Based Access Control maps users to roles and roles to permissions. Laravel does not ship RBAC out of the box — but Spatie\'s laravel-permission package is the ecosystem standard. It stores roles and permissions in the database and integrates with Gates and Policies transparently.',
    icon: UserCheck,
    callout: 'Always check permissions, not roles, in application code. Check roles only at the admin UI level. "Can publish posts" is a permission. "Editor" is a role. Roles change; permission checks stay stable.',
    keyPoints: [
      '$user->givePermissionTo(\'publish posts\') — direct permission',
      '$user->assignRole(\'editor\') — all editor permissions inherited',
      '@can(\'publish posts\') works in Blade without any extra config',
      'Cache permissions with php artisan permission:cache-reset after bulk changes',
      'Super-admin pattern: assign a wildcard role in Gate::before(), not in the DB',
    ],
  },

  // ── 22 · Quiz: RBAC ───────────────────────────────────────────────────────
  {
    type: 'quiz',
    title: 'RBAC Final Check',
    subtitle: 'Knowledge Check',
    content: '',
    icon: UserCheck,
    question: 'You check if ($user->hasRole(\'editor\')) throughout your codebase. The business renames "editor" to "author". What happens?',
    options: [
      {
        text: 'Nothing — Spatie handles role renames automatically',
        correct: false,
        explanation: 'Spatie stores role names as strings in the database. Renaming the row does not update your PHP code. Every hasRole(\'editor\') call will return false for all users until the code is updated too.',
      },
      {
        text: 'All hasRole checks silently return false — breaking authorization',
        correct: true,
        explanation: 'Correct. This is why checking permissions (can(\'edit articles\')) is safer than checking roles (hasRole(\'editor\')). Permissions are stable; role names are cosmetic. The role can be renamed without touching permission checks.',
      },
      {
        text: 'A MissingRoleException is thrown on the first check',
        correct: false,
        explanation: 'hasRole() returns a boolean — it does not throw on a missing role name. The silent false return is precisely what makes this bug hard to catch in testing.',
      },
      {
        text: 'The user is automatically assigned the new "author" role',
        correct: false,
        explanation: 'Spatie does not automatically migrate user assignments when a role is renamed. The user\'s role assignment row in the database still references the old role ID.',
      },
    ],
  },

  // ── 23 · Hero: Final ──────────────────────────────────────────────────────
  {
    type: 'hero',
    title: 'Bulletproof Backend',
    subtitle: 'Final Security Project',
    content: 'You have covered password hashing with timing-safe verification, Sanctum token auth, OAuth2 with Passport, Gates, Policies, middleware stacking, mass assignment protection, rate limiting with spray defence, CORS, CSRF internals, input sanitization, CI security auditing, and RBAC. Build the hardened app.',
    icon: ShieldCheck,
  },
];

export default function LaravelSecurityLessonPage() {
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
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-widest"
            style={{ borderColor: 'rgba(0,0,0,0.08)', color: '#b8b8b8', letterSpacing: '0.16em' }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: '#bf4e20' }}
            />
            Module 04 · Laravel Security
          </div>
        </div>
      </nav>

      <BackendGenericSlides lessonTitle="Laravel Security Specialist" slides={securitySlides} />
    </main>
  );
}