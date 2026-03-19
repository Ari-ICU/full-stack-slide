"use client";

import BackendGenericSlides, { Slide } from "@/components/backend/lessons/backend-generic-slides";
import { ArrowLeft, HardDrive, Terminal, Zap, Layers, Globe, Server, Shield, Cloud, Activity, Settings, RefreshCw, Database, Cpu, Search } from "lucide-react";
import Link from "next/link";

const devopsSlides: Slide[] = [

  // ── 01 · Hero ──────────────────────────────────────────────────────────────
  {
    type: 'hero',
    title: 'Production Engineering',
    subtitle: 'Module 06 · Industrial Laravel Ops',
    content: 'Localhost is a lie. Production is a distributed, stateless, multi-process environment that exposes every assumption you made in development. This module covers the complete path from a blank Ubuntu server to a zero-downtime, auto-scaling, fully monitored Laravel deployment.',
    icon: HardDrive,
  },

  // ── 02 · Concept: Environment Parity ──────────────────────────────────────
  {
    type: 'concept',
    title: 'Environment Parity',
    subtitle: 'Local vs Production',
    content: 'The most common source of "it works on my machine" bugs is environmental drift: different PHP versions, different extension sets, different filesystem case sensitivity, different timezone settings, and different env variable values. The fix is to make every environment — local, CI, staging, production — as identical as possible.',
    icon: Settings,
    callout: 'macOS filesystems are case-insensitive by default. Linux is case-sensitive. File::exists("Model.php") succeeds locally but fails on the server for "model.php". Docker eliminates this entire class of bug by running Linux locally.',
    keyPoints: [
      'Use the same PHP version everywhere — pin it in .php-version and docker-compose.yml',
      'The same extensions in the same order — opcache, redis, pdo_pgsql',
      'The same timezone — UTC in production, UTC in Docker, UTC in php.ini',
      'The same queue driver — never use sync locally if production uses Redis',
      'CI runs the same Docker image as production — drift is caught before deployment',
    ],
  },

  // ── 03 · Code: Laravel Sail / Docker ──────────────────────────────────────
  {
    type: 'code',
    title: 'Laravel Sail Deep Dive',
    subtitle: 'Dockerized Development',
    content: 'Sail is a thin CLI wrapper around a docker-compose.yml. The real value is in customising it — adding services, tuning PHP config, and ensuring the dev image mirrors your production environment. Publish the Dockerfiles to your repo so they are version-controlled.',
    icon: Terminal,
    language: 'bash',
    codeFileName: 'docker-compose.yml (excerpt)',
    codeSnippet: `# Publish Sail stubs so you can edit them:
php artisan sail:publish

# docker-compose.yml — customize the laravel.test service
services:
  laravel.test:
    build:
      context: ./vendor/laravel/sail/runtimes/8.3
      dockerfile: Dockerfile
      args:
        WWWGROUP: '\${WWWGROUP}'
    image: sail-8.3/app
    environment:
      WWWUSER: '\${WWWUSER}'
      LARAVEL_SAIL: 1
      XDEBUG_MODE: '\${SAIL_XDEBUG_MODE:-off}'
    volumes:
      - '.:/var/www/html'
    depends_on:
      - mysql
      - redis
      - meilisearch

  mysql:
    image: 'mysql/mysql-server:8.0'
    environment:
      MYSQL_ROOT_PASSWORD: '\${DB_PASSWORD}'
      MYSQL_DATABASE: '\${DB_DATABASE}'
    volumes:
      - 'sail-mysql:/var/lib/mysql'   # named volume = data persists

  redis:
    image: 'redis:alpine'
    volumes:
      - 'sail-redis:/data'

  meilisearch:
    image: 'getmeili/meilisearch:latest'
    environment:
      MEILI_NO_ANALYTICS: '\${MEILISEARCH_NO_ANALYTICS:-false}'

  mailpit:
    image: 'axllent/mailpit:latest'
    ports:
      - '\${FORWARD_MAILPIT_PORT:-1025}:1025'
      - '\${FORWARD_MAILPIT_DASHBOARD_PORT:-8025}:8025'

volumes:
  sail-mysql:
  sail-redis:`,
    keyPoints: [
      'sail:publish copies vendor stubs into your repo — keep them in version control',
      'Named volumes (sail-mysql:) persist data across container restarts',
      'XDEBUG_MODE=debug enables step debugging — leave off in normal dev for speed',
      'Add services here that mirror production: Meilisearch, Horizon, Reverb',
    ],
  },

  // ── 04 · Diagram: PHP-FPM ─────────────────────────────────────────────────
  {
    type: 'diagram',
    title: 'PHP-FPM Optimization',
    subtitle: 'Process Manager Tuning',
    content: 'PHP-FPM manages a pool of worker processes. Nginx passes each request to an available worker via a Unix socket. The pm.max_children setting is the most critical — too low and requests queue up; too high and the server runs out of memory and starts swapping.',
    icon: Cpu,
    diagramNodes: [
      { label: 'Nginx',          desc: 'reverse proxy',        color: '#6366f1' },
      { label: 'Unix Socket',    desc: 'php-fpm.sock',         color: '#8b5cf6' },
      { label: 'FPM Master',     desc: 'pool manager',         color: '#0ea5e9' },
      { label: 'Worker ×N',      desc: 'php processes',        color: '#10b981' },
      { label: 'OPcache',        desc: 'bytecode cache',       color: '#f59e0b' },
    ],
  },

  // ── 05 · Code: Nginx Config ────────────────────────────────────────────────
  {
    type: 'code',
    title: 'Nginx for Laravel',
    subtitle: 'Reverse Proxy Config',
    content: 'A properly hardened Nginx config does more than serve files. It enforces HTTPS, hides server tokens, sets security headers, blocks direct access to sensitive files, and routes all non-asset requests to PHP-FPM through Laravel\'s front controller.',
    icon: Globe,
    language: 'bash',
    codeFileName: '/etc/nginx/sites-available/laravel',
    codeSnippet: `server {
    listen 443 ssl http2;
    server_name app.example.com;
    root /var/www/app/current/public;  # Envoyer symlink target

    # SSL (managed by Certbot / Forge)
    ssl_certificate     /etc/letsencrypt/live/app.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.example.com/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;

    # Security headers
    add_header X-Frame-Options           "SAMEORIGIN"     always;
    add_header X-Content-Type-Options    "nosniff"        always;
    add_header Referrer-Policy           "strict-origin"  always;
    add_header Permissions-Policy        "camera=()"      always;

    # Hide Nginx version from attackers
    server_tokens off;

    index index.php;
    charset utf-8;

    # Block access to hidden files (.env, .git, etc.)
    location ~ /\\.(?!well-known).* {
        deny all;
    }

    # Static assets — served directly, bypass PHP
    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # All other requests → Laravel front controller
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \\.php$ {
        fastcgi_pass  unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include       fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }
}

# Redirect all HTTP to HTTPS
server {
    listen 80;
    server_name app.example.com;
    return 301 https://$host$request_uri;
}`,
    keyPoints: [
      'try_files $uri $uri/ /index.php — the Laravel front-controller pattern',
      'location ~ /\\. blocks .env, .git, .htaccess from being served directly',
      'Unix socket (php-fpm.sock) is faster than TCP (127.0.0.1:9000) for local FPM',
      'immutable Cache-Control on versioned assets eliminates repeat downloads',
    ],
  },

  // ── 06 · Diagram: Zero-Downtime Deploy ────────────────────────────────────
  {
    type: 'diagram',
    title: 'Zero-Downtime Deploy',
    subtitle: 'Symlink Strategy',
    content: 'Envoyer and Deployer use the same strategy: deploy each release to a timestamped directory, run migrations and cache warming on the new release, then atomically flip a "current" symlink to point at it. Nginx\'s root points at current/ — the switch is instant.',
    icon: RefreshCw,
    diagramNodes: [
      { label: 'releases/v42',   desc: 'new code cloned',      color: '#6366f1' },
      { label: 'composer install',desc: 'deps + optimize',     color: '#8b5cf6' },
      { label: 'artisan migrate', desc: 'schema up',            color: '#0ea5e9' },
      { label: 'ln -nfs v42',    desc: 'atomic symlink flip',  color: '#10b981' },
      { label: 'current →',      desc: 'Nginx root target',    color: '#f59e0b' },
    ],
  },

  // ── 07 · Code: Deployment Hooks ───────────────────────────────────────────
  {
    type: 'code',
    title: 'Deployment Hooks',
    subtitle: 'Post-Push Automation',
    content: 'Every deployment must clear stale caches, rebuild optimised caches, and restart long-running processes. A missed step causes subtle production bugs — old routes, stale config, dead queue workers. Codify the exact sequence as a deploy script.',
    icon: Zap,
    language: 'bash',
    codeFileName: 'deploy.sh',
    codeSnippet: `#!/usr/bin/env bash
set -euo pipefail  # exit on any error, treat unset vars as errors

RELEASE_DIR="/var/www/app/releases/$(date +%Y%m%d%H%M%S)"
SHARED_DIR="/var/www/app/shared"
CURRENT_DIR="/var/www/app/current"
REPO="git@github.com:yourorg/app.git"
BRANCH="\${1:-main}"

echo "▶ Cloning $BRANCH into $RELEASE_DIR"
git clone --depth=1 --branch "$BRANCH" "$REPO" "$RELEASE_DIR"

# Link shared files (storage, .env) — created once, shared across releases
ln -nfs "$SHARED_DIR/storage"     "$RELEASE_DIR/storage"
ln -nfs "$SHARED_DIR/.env"        "$RELEASE_DIR/.env"

cd "$RELEASE_DIR"

echo "▶ Installing dependencies"
composer install --no-dev --optimize-autoloader --no-interaction

echo "▶ Running migrations (with --force for production)"
php artisan migrate --force

echo "▶ Warming caches"
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

echo "▶ Activating release (atomic symlink)"
ln -nfs "$RELEASE_DIR" "$CURRENT_DIR"

echo "▶ Restarting queue workers gracefully"
php artisan queue:restart     # signals workers to finish & exit
sudo systemctl reload php8.3-fpm

echo "▶ Pruning old releases (keep last 5)"
ls -dt /var/www/app/releases/* | tail -n +6 | xargs rm -rf

echo "✓ Deploy complete"`,
    keyPoints: [
      'set -euo pipefail — any failed command aborts the script immediately',
      '--depth=1 git clone — fetches only the latest commit, much faster',
      'ln -nfs is atomic — Nginx never sees a partial state during the flip',
      'queue:restart signals workers to drain current jobs then exit — no job loss',
    ],
  },

  // ── 08 · Quiz: Deploy ─────────────────────────────────────────────────────
  {
    type: 'quiz',
    title: 'Deployment Check',
    subtitle: 'Knowledge Check',
    content: '',
    icon: RefreshCw,
    question: 'You deploy new code and run php artisan config:cache. A user still sees the old behaviour. You confirmed the new code is in current/. What did you most likely forget?',
    options: [
      {
        text: 'You forgot to run composer install',
        correct: false,
        explanation: 'If composer install was missing, the autoloader would be stale and you\'d see class-not-found errors — not stale behaviour. The symptom points elsewhere.',
      },
      {
        text: 'You forgot to restart PHP-FPM — OPcache still serves bytecode of the old files',
        correct: true,
        explanation: 'Correct. OPcache caches compiled bytecode by file path. Even though the symlink points at new files, OPcache may hold the old bytecode until the process is reloaded. sudo systemctl reload php8.3-fpm clears OPcache without dropping connections.',
      },
      {
        text: 'You forgot to run php artisan view:cache',
        correct: false,
        explanation: 'Missing view:cache means Blade templates are recompiled on first render — a minor performance hit, not stale behaviour. The config and route caches are what affect application logic.',
      },
      {
        text: 'The symlink did not flip because ln requires sudo',
        correct: false,
        explanation: 'You confirmed the new code is in current/ — so the symlink did flip. The issue is in the runtime serving the code, not the code itself.',
      },
    ],
  },

  // ── 09 · Concept: Config & Route Caching ──────────────────────────────────
  {
    type: 'concept',
    title: 'Config & Route Caching',
    subtitle: 'Production Tuning',
    content: 'In development, Laravel reads every config/ file and every routes/ file on each request. In production, you serialise them once into a single PHP file. config:cache eliminates file I/O across all config reads. route:cache compiles all route definitions into a static array that the router matches with no regex overhead.',
    icon: Activity,
    callout: 'After running config:cache, calls to env() anywhere outside of config/ files return null — the cached values are already embedded. This is the most common production-only bug after first deployment. Audit your codebase for env() calls outside config/.',
    keyPoints: [
      'php artisan config:cache → bootstrap/cache/config.php',
      'php artisan route:cache → bootstrap/cache/routes-v7.php',
      'php artisan view:cache → storage/framework/views/*.php',
      'php artisan event:cache → bootstrap/cache/events.php',
      'php artisan optimize combines all four — run it on every deploy',
      'php artisan optimize:clear removes all caches — run before re-caching',
    ],
  },

  // ── 10 · Diagram: Supervisor ───────────────────────────────────────────────
  {
    type: 'diagram',
    title: 'Supervisor Management',
    subtitle: 'Queue Worker Persistence',
    content: 'Supervisor is a Linux process control system that ensures your queue workers run continuously. If a worker crashes (out of memory, uncaught exception), Supervisor restarts it automatically. Configure it with a numprocs matching your server\'s CPU count for maximum throughput.',
    icon: Search,
    diagramNodes: [
      { label: 'Supervisor',     desc: 'process monitor',      color: '#6366f1' },
      { label: 'Worker 1',       desc: 'php artisan queue:work',color: '#10b981' },
      { label: 'Worker 2',       desc: 'php artisan queue:work',color: '#10b981' },
      { label: 'Worker N',       desc: 'php artisan queue:work',color: '#10b981' },
      { label: 'Redis Queue',    desc: 'job backlog',          color: '#f59e0b' },
    ],
  },

  // ── 11 · Code: Supervisor Config ──────────────────────────────────────────
  {
    type: 'code',
    title: 'Supervisor Configuration',
    subtitle: 'Worker Persistence',
    content: 'A well-tuned Supervisor config sets the right number of worker processes, caps memory to prevent leaks from accumulating, and logs both stdout and stderr for visibility. Use queue:work --max-jobs to recycle workers periodically and prevent slow memory growth.',
    icon: Search,
    language: 'bash',
    codeFileName: '/etc/supervisor/conf.d/laravel-worker.conf',
    codeSnippet: `[program:laravel-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/app/current/artisan queue:work redis
    --sleep=3
    --tries=3
    --max-time=3600
    --max-jobs=1000
    --queue=critical,default,low
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=4                       ; one per CPU core
redirect_stderr=true
stdout_logfile=/var/log/supervisor/worker.log
stdout_logfile_maxbytes=50MB
stdout_logfile_backups=5
stopwaitsecs=300                 ; wait 5 min for jobs to finish before SIGKILL

; After editing this file:
; sudo supervisorctl reread
; sudo supervisorctl update
; sudo supervisorctl start laravel-worker:*

; Check status:
; sudo supervisorctl status
; sudo supervisorctl tail -f laravel-worker:laravel-worker_00`,
    keyPoints: [
      '--max-jobs=1000 recycles the worker after 1000 jobs — prevents slow memory leaks',
      '--max-time=3600 forces a restart every hour — a safety net for runaway processes',
      '--queue=critical,default,low processes higher-priority queues first',
      'stopwaitsecs=300 gives long-running jobs time to finish before SIGKILL',
    ],
  },

  // ── 12 · Concept: SSL & HTTPS ─────────────────────────────────────────────
  {
    type: 'concept',
    title: "Let's Encrypt SSL",
    subtitle: 'Automated HTTPS',
    content: "Let's Encrypt issues free 90-day TLS certificates via the ACME protocol. Certbot automates the issuance and renewal cycle. Forge handles this for you — but understanding the underlying process lets you debug renewal failures and configure HSTS correctly.",
    icon: Shield,
    callout: 'Set Strict-Transport-Security: max-age=31536000; includeSubDomains; preload only after you are certain HTTPS works everywhere. Once a browser has seen HSTS, it will refuse HTTP connections to your domain for the max-age period — even if you remove the header.',
    keyPoints: [
      'certbot certonly --webroot — issues a cert without stopping Nginx',
      'Auto-renewal: certbot renew is added to cron or a systemd timer',
      'Forge runs certbot automatically and reloads Nginx on renewal',
      'TLSv1.2 + TLSv1.3 only — disable TLSv1.0 and TLSv1.1',
      'OCSP Stapling reduces handshake latency — enable in Nginx with ssl_stapling on',
    ],
  },

  // ── 13 · Code: Database Backups ───────────────────────────────────────────
  {
    type: 'code',
    title: 'Database Backups',
    subtitle: 'Data Resilience',
    content: 'spatie/laravel-backup creates compressed, encrypted database dumps and ships them to S3, GCS, or any Flysystem disk. It also monitors backup health and alerts you if a backup is missing or too old. Configure it once; let it run on a schedule.',
    icon: Database,
    language: 'php',
    codeFileName: 'config/backup.php (key settings)',
    codeSnippet: `<?php
// config/backup.php — key sections

return [
    'backup' => [
        'name' => env('APP_NAME', 'laravel'),

        'source' => [
            'databases' => ['mysql'],   // or 'pgsql', 'sqlite'

            'files' => [
                'include' => [base_path()],
                'exclude' => [
                    base_path('vendor'),
                    base_path('node_modules'),
                    storage_path('framework'),
                    storage_path('logs'),
                ],
            ],
        ],

        'destination' => [
            'disks'              => ['s3-backups'],
            'compression_method' => ZipArchive::CM_DEFLATE,
        ],

        'password' => env('BACKUP_ARCHIVE_PASSWORD'), // AES-256 encryption
    ],

    'cleanup' => [
        'strategy' => \\Spatie\\Backup\\Tasks\\Cleanup\\Strategies\\DefaultStrategy::class,
        'default_strategy' => [
            'keep_all_backups_for_days'            => 7,
            'keep_daily_backups_for_days'          => 30,
            'keep_weekly_backups_for_weeks'        => 8,
            'keep_monthly_backups_for_months'      => 4,
            'delete_oldest_backups_when_using_more_than_megabytes' => 5000,
        ],
    ],
];

// Schedule in routes/console.php:
// Schedule::command('backup:run --only-db')->dailyAt('02:00');
// Schedule::command('backup:monitor')->dailyAt('09:00');
// Schedule::command('backup:clean')->dailyAt('03:00');`,
    keyPoints: [
      'BACKUP_ARCHIVE_PASSWORD encrypts the zip — required for GDPR-sensitive data',
      'backup:monitor sends a notification if the latest backup is missing or too old',
      'Test restores regularly — an untested backup is not a backup',
      'Use a separate S3 bucket with a different AWS account — prevents accidental deletion',
    ],
  },

  // ── 14 · Diagram: Error Tracking ──────────────────────────────────────────
  {
    type: 'diagram',
    title: 'Error Tracking',
    subtitle: 'Sentry & Flare',
    content: 'Sentry captures every unhandled exception, enriches it with breadcrumbs, Git commit hash, user context, and release info, and groups duplicates. You are alerted once per new issue — not once per occurrence. Flare is a Laravel-specific alternative with Blade variable dumps and context.',
    icon: Activity,
    diagramNodes: [
      { label: 'Exception',      desc: 'uncaught Throwable',   color: '#ef4444' },
      { label: 'Handler::report',desc: 'Laravel exception handler', color: '#8b5cf6' },
      { label: 'Sentry SDK',     desc: 'enrich + send',        color: '#6366f1' },
      { label: 'Sentry Cloud',   desc: 'group + alert',        color: '#0ea5e9' },
      { label: 'Slack / Email',  desc: 'team notification',    color: '#f59e0b' },
    ],
  },

  // ── 15 · Concept: Horizontal Scaling ──────────────────────────────────────
  {
    type: 'concept',
    title: 'Horizontal Scaling',
    subtitle: 'Scaling to Millions',
    content: 'Adding more servers behind a load balancer is horizontal scaling. It is only possible if your application is stateless — no local session files, no local cache, no local file uploads. All shared state must live in a central service: Redis for sessions and cache, S3 for file storage.',
    icon: Cloud,
    callout: 'The load balancer must either be sticky (same user always hits the same server) or your sessions must be in Redis. Sticky sessions are a crutch — Redis sessions are the correct solution and take 5 minutes to configure.',
    keyPoints: [
      'SESSION_DRIVER=redis — sessions stored in Redis, readable by all nodes',
      'CACHE_STORE=redis — cache is shared across all nodes',
      'FILESYSTEM_DISK=s3 — uploaded files stored in S3, not local disk',
      'QUEUE_CONNECTION=redis — jobs dispatched to Redis, consumed by any worker node',
      'Each node is identical — any node can handle any request',
    ],
  },

  // ── 16 · Code: Redis for Sessions & Cache ─────────────────────────────────
  {
    type: 'code',
    title: 'Redis Persistence',
    subtitle: 'Shared State Across Nodes',
    content: 'Switching Laravel from file-based to Redis-based sessions and cache requires a .env change and a predis/phpredis dependency. Use separate Redis databases (select 0, 1, 2) for cache, sessions, and queues so a cache:clear does not wipe your sessions or queued jobs.',
    icon: Database,
    language: 'php',
    codeFileName: 'config/database.php (redis section)',
    codeSnippet: `<?php
// config/database.php — redis connections

'redis' => [
    'client' => env('REDIS_CLIENT', 'phpredis'),  // faster than predis

    'default' => [  // used by Cache
        'url'      => env('REDIS_URL'),
        'host'     => env('REDIS_HOST', '127.0.0.1'),
        'password' => env('REDIS_PASSWORD'),
        'port'     => env('REDIS_PORT', '6379'),
        'database' => env('REDIS_DB', '0'),       // DB 0 = cache
    ],

    'cache' => [
        'host'     => env('REDIS_HOST', '127.0.0.1'),
        'password' => env('REDIS_PASSWORD'),
        'port'     => env('REDIS_PORT', '6379'),
        'database' => env('REDIS_CACHE_DB', '1'), // DB 1 = cache store
    ],

    'sessions' => [
        'host'     => env('REDIS_HOST', '127.0.0.1'),
        'password' => env('REDIS_PASSWORD'),
        'port'     => env('REDIS_PORT', '6379'),
        'database' => '2',                         // DB 2 = sessions
    ],
],

// .env settings for a horizontally-scaled deployment:
// SESSION_DRIVER=redis
// SESSION_CONNECTION=sessions
// CACHE_STORE=redis
// CACHE_PREFIX=app_             ← prevents key collisions between apps
// QUEUE_CONNECTION=redis
// BROADCAST_DRIVER=redis        ← for Reverb / Pusher-compatible broadcasting`,
    keyPoints: [
      'Separate Redis DBs (0, 1, 2) prevent cache:clear from wiping sessions or jobs',
      'phpredis (C extension) is 2-5× faster than the predis PHP library',
      'CACHE_PREFIX prevents key collisions when multiple apps share one Redis instance',
      'Set a maxmemory-policy (allkeys-lru) on the Redis instance to handle memory pressure',
    ],
  },

  // ── 17 · Quiz: Scaling ────────────────────────────────────────────────────
  {
    type: 'quiz',
    title: 'Scaling Architecture Check',
    subtitle: 'Knowledge Check',
    content: '',
    icon: Cloud,
    question: 'You add a second server behind a load balancer. Users randomly get logged out. SESSION_DRIVER is still set to "file". What is happening?',
    options: [
      {
        text: 'The load balancer is corrupting session cookies',
        correct: false,
        explanation: 'Load balancers are transparent to cookies — they do not modify cookie headers. The session cookie reaches the server intact. The problem is what happens when the server tries to read the session file.',
      },
      {
        text: 'Each server has its own local session files — a request hitting a different server finds no session',
        correct: true,
        explanation: 'Correct. File sessions are stored in storage/framework/sessions/ on each server. Server A\'s sessions are invisible to Server B. The fix: SESSION_DRIVER=redis with a shared Redis instance both servers can reach.',
      },
      {
        text: 'PHP-FPM restarts between requests clear the session store',
        correct: false,
        explanation: 'File sessions persist on disk across PHP-FPM restarts. The issue is cross-server visibility, not process lifecycle.',
      },
      {
        text: 'The session encryption key is different on each server',
        correct: false,
        explanation: 'If APP_KEY differs between servers the session would fail to decrypt — you\'d see a 500 error, not a logout. Both servers must have the same APP_KEY, but that\'s a separate issue from where the session is stored.',
      },
    ],
  },

  // ── 18 · Diagram: Log Management ──────────────────────────────────────────
  {
    type: 'diagram',
    title: 'Log Management',
    subtitle: 'Centralised Visibility',
    content: 'Multiple servers each writing to local log files is unmanageable. Ship logs to a central aggregator — CloudWatch, Papertrail, or an ELK stack. Configure Laravel\'s Monolog stack channel to send to multiple destinations simultaneously.',
    icon: Search,
    diagramNodes: [
      { label: 'Server A logs',  desc: 'Monolog channel',      color: '#6366f1' },
      { label: 'Server B logs',  desc: 'Monolog channel',      color: '#6366f1' },
      { label: 'Log Shipper',    desc: 'Fluentd / Vector',     color: '#8b5cf6' },
      { label: 'Aggregator',     desc: 'CloudWatch / Loki',    color: '#0ea5e9' },
      { label: 'Dashboard',      desc: 'search + alert',       color: '#f59e0b' },
    ],
  },

  // ── 19 · Concept: Server Hardening ────────────────────────────────────────
  {
    type: 'concept',
    title: 'Server Hardening',
    subtitle: 'UFW & Firewalls',
    content: 'A freshly provisioned Ubuntu server has all ports open. The attack surface should be reduced to the absolute minimum: only the ports your application actually needs. UFW (Uncomplicated Firewall) is a wrapper around iptables that makes this straightforward.',
    icon: Shield,
    callout: 'Never open port 3306 (MySQL) or 6379 (Redis) to the public internet. These services should only be reachable on the private network interface. If you need remote DB access, tunnel over SSH.',
    keyPoints: [
      'ufw default deny incoming — block everything by default',
      'ufw allow 22/tcp — SSH (or your custom port)',
      'ufw allow 80/tcp && ufw allow 443/tcp — HTTP and HTTPS only',
      'ufw enable — activate rules',
      'Forge configures UFW automatically — but audit it after provision',
      'fail2ban bans IPs with repeated failed SSH logins — install it on every server',
    ],
  },

  // ── 20 · Diagram: Horizon Monitoring ──────────────────────────────────────
  {
    type: 'diagram',
    title: 'Horizon Monitoring',
    subtitle: 'Queue Worker Health',
    content: 'Laravel Horizon replaces vanilla queue:work with a dashboard showing real-time throughput, wait times, and failed jobs. It supervises workers itself — you only need Supervisor to keep the horizon process alive. Balance workloads between queues using its config.',
    icon: Activity,
    diagramNodes: [
      { label: 'Supervisor',     desc: 'keeps Horizon alive',  color: '#6366f1' },
      { label: 'Horizon',        desc: 'php artisan horizon',  color: '#bf4e20' },
      { label: 'Redis',          desc: 'job backlog + metrics',color: '#ef4444' },
      { label: 'Workers ×N',     desc: 'auto-balanced',        color: '#10b981' },
      { label: 'Dashboard',      desc: '/horizon UI',          color: '#0ea5e9' },
    ],
  },

  // ── 21 · Code: Cron & Scheduling ──────────────────────────────────────────
  {
    type: 'code',
    title: 'Cron & Task Scheduling',
    subtitle: 'The Task Runner',
    content: 'Laravel\'s scheduler replaces a sprawling crontab with a single entry that runs every minute. All scheduled tasks are defined in routes/console.php (Laravel 11+) with an expressive fluent API. Missed schedules, overlapping runs, and output logging are all handled by the framework.',
    icon: Settings,
    language: 'php',
    codeFileName: 'routes/console.php',
    codeSnippet: `<?php

use Illuminate\\Support\\Facades\\Schedule;

// The ONLY crontab entry needed on the server:
// * * * * * cd /var/www/app/current && php artisan schedule:run >> /dev/null 2>&1

Schedule::command('backup:run --only-db')
    ->dailyAt('02:00')
    ->timezone('UTC')
    ->runInBackground()           // does not block other scheduled tasks
    ->withoutOverlapping()        // skip if a previous run is still active
    ->onFailure(function () {
        \Slack::message('⚠️ DB backup failed!');
    });

Schedule::command('tokens:prune --days=30')
    ->weekly()
    ->runInBackground();

Schedule::command('horizon:snapshot')
    ->everyFiveMinutes();

// Job-based scheduling — dispatch to a queue worker
Schedule::job(new GenerateDailyReportJob(), 'low')
    ->dailyAt('06:00')
    ->when(fn() => config('features.reports_enabled'));

// Closure-based — for quick inline tasks
Schedule::call(function () {
    \Cache::forget('homepage_stats');
})->hourly()->name('clear-homepage-cache')->withoutOverlapping();

// View pending schedule:
// php artisan schedule:list`,
    keyPoints: [
      'withoutOverlapping() prevents two instances of the same command running simultaneously',
      'runInBackground() dispatches commands to OS background — does not block the scheduler',
      'onFailure() / onSuccess() hooks send notifications without external cron monitoring',
      'schedule:list shows the next run time for every scheduled task',
    ],
  },

  // ── 22 · Quiz: Cron & OPcache ─────────────────────────────────────────────
  {
    type: 'quiz',
    title: 'Production Ops Check',
    subtitle: 'Knowledge Check',
    content: '',
    icon: Settings,
    question: 'Your scheduled backup:run task occasionally overlaps — two instances run simultaneously and the backup is corrupted. Which scheduler option fixes this?',
    options: [
      {
        text: '->runInBackground()',
        correct: false,
        explanation: 'runInBackground() dispatches the command to the OS background, freeing the scheduler to continue — but it does not prevent two instances from running at the same time. A slow first run and the next scheduled trigger will still overlap.',
      },
      {
        text: '->withoutOverlapping()',
        correct: true,
        explanation: 'Correct. withoutOverlapping() creates a cache lock before running. If the lock already exists from a previous run, the scheduler skips this execution. The lock is released when the task completes — or after a configurable expiry timeout.',
      },
      {
        text: '->onOneServer()',
        correct: false,
        explanation: 'onOneServer() prevents the same task from running on multiple servers simultaneously in a horizontal setup — it does not prevent the same server from starting a second instance of the same task if the first is still running.',
      },
      {
        text: '->timezone(\'UTC\')',
        correct: false,
        explanation: 'timezone() only affects when the schedule triggers — it has no bearing on concurrent execution. Overlapping runs happen regardless of timezone settings.',
      },
    ],
  },

  // ── 23 · Hero: Final ──────────────────────────────────────────────────────
  {
    type: 'hero',
    title: 'Graduation Project',
    subtitle: 'Final Deployment',
    content: 'You have covered environment parity, Docker/Sail, PHP-FPM tuning, hardened Nginx config, zero-downtime symlink deploys, automated deploy scripts, OPcache + route/config caching, Supervisor worker management, SSL, automated database backups, Sentry error tracking, horizontal Redis-backed scaling, UFW hardening, Horizon monitoring, and cron scheduling. Ship it.',
    icon: Zap,
  },
];

export default function LaravelDevopsLessonPage() {
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
            Module 06 · Laravel DevOps
          </div>
        </div>
      </nav>

      <BackendGenericSlides lessonTitle="Laravel Production Ops" slides={devopsSlides} />
    </main>
  );
}