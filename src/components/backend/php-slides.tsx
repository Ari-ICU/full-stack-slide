"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ChevronLeft, ChevronRight, Code2, Copy, Check, Play, RotateCcw,
  Server, Database, Globe, Globe2, Lock, Shield, ShieldAlert, ShieldCheck,
  Search, Send, Activity, Layers, List, RefreshCw, Zap, Sparkles,
  Key, Link as LinkIcon, FileCode, Package, Box, ArrowRight,
  Terminal, Rocket, HardDrive, Layout, Workflow,
  Fingerprint, GitBranch, Edit3, Star, Trophy, ShoppingCart, StickyNote,
} from 'lucide-react';

/* ─── TYPES ──────────────────────────────────────────────────────── */
interface Slide {
  chapter: string;
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  tagColor: string;
  accent: string;
  bg: string;
  content: string[];
  lab: string;
  result: string;
  syntax: string;
  code: string;
  filename?: string;
  terminal?: string;
  terminalOutput?: string;
  icon: React.ElementType;
}

/* ─── CHAPTERS ───────────────────────────────────────────────────── */
const CHAPTERS = [
  { id: 'intro',      label: '01 · Intro & Syntax', color: '#10b981' },
  { id: 'logic',      label: '02 · Control Struct', color: '#6366f1' },
  { id: 'functions',  label: '03 · Func & Arrays',  color: '#06b6d4' },
  { id: 'forms',      label: '04 · Form Handling',  color: '#f59e0b' },
  { id: 'files',      label: '05 · File Handling',  color: '#f97316' },
  { id: 'state',      label: '06 · State Mgmt',     color: '#f43f5e' },
  { id: 'mysql',      label: '07 · MySQL & CRUD',   color: '#3b82f6' },
  { id: 'oop',        label: '08 · OOP Foundations', color: '#a855f7' },
  { id: 'security',   label: '09 · Security Ops',   color: '#ec4899' },
  { id: 'advanced',   label: '10 · Advanced PHP',   color: '#14b8a6' },
  { id: 'mvc',        label: '11 · MVC Intro',     color: '#f97316' },
  { id: 'project',    label: '12 · Project Lab',    color: '#10b981' },
];

/* ─── SLIDE DATA ─────────────────────────────────────────────────── */
const slides: Slide[] = [
  /* ── CHAPTER 1: INTRO ── */
  {
    chapter: 'intro', id: 'P01-S1', tag: 'Week 1', tagColor: '#10b981',
    title: 'PHP Foundations', subtitle: 'Setup & Syntax', accent: '#10b981',
    bg: 'radial-gradient(ellipse at 10% 20%, rgba(16,185,129,0.15) 0%, transparent 55%)',
    content: [
      'Setup: Install Herd (Mac) or XAMPP (Windows/Linux) for local PHP.',
      'Echo Tag: use <?php echo "Hi"; ?> or the shortcut <?= "Hi" ?>.',
      'Variables: Defined with a $ sign ($name = "Ari").',
      'Data Types: String, Integer, Float, Boolean, Array, Object, NULL.'
    ],
    syntax: '$variable = value; // PHP has dynamic type casting.',
    lab: 'Install Herd or XAMPP and echo your name inside an <h1> tag.',
    result: 'Browser displays your name at localhost:8000.',
    filename: 'index.php',
    code: `<?php
$name = "Ari Master";
echo "<h1>Welcome, $name</h1>";`,
    icon: Code2,
  },
  {
    chapter: 'intro', id: 'P01-S2', tag: 'Week 1', tagColor: '#10b981',
    title: 'Operators & Constants', subtitle: 'Immutable Values', accent: '#10b981',
    bg: 'radial-gradient(ellipse at 80% 30%, rgba(16,185,129,0.12) 0%, transparent 55%)',
    content: [
      'Math: Arithmetic operators like +, -, *, /.',
      'Comparison: == vs === (Check type and value).',
      'Constants: Use define() or const keyword for immutable values.'
    ],
    syntax: 'define("APP_KEY", "ABC-123");',
    lab: 'Calculate a total price including a defined tax rate.',
    result: 'Terminal outputting the final calculated numeric result.',
    filename: 'math.php',
    code: `<?php
const TAX = 0.1;
$price = 100;
echo "Total: " . ($price * (1 + TAX));`,
    icon: Database,
  },

  /* ── CHAPTER 2: CONTROL STRUCTURES ── */
  {
    chapter: 'logic', id: 'P02-S1', tag: 'Week 2', tagColor: '#6366f1',
    title: 'Control Flow', subtitle: 'If-Else & Switch', accent: '#6366f1',
    bg: 'linear-gradient(135deg, rgba(99,102,241,0.06) 0%, transparent 100%)',
    content: [
      'If/Else: Conditional branch execution.',
      'Switch: Multi-way branching.',
      'Match: PHP 8.1+ modern expression syntax.'
    ],
    syntax: 'if ($isAdmin) { grantAccess(); }',
    lab: 'Write a score checker for grades A, B, C.',
    result: 'Correct grade string output based on variable input.',
    filename: 'logic.php',
    code: `<?php
$score = 85;
if ($score > 80) {
    echo "Grade B";
} else {
    echo "Try again!";
}`,
    icon: Terminal,
  },
  {
    chapter: 'logic', id: 'P02-S2', tag: 'Week 2', tagColor: '#6366f1',
    title: 'Loops in PHP', subtitle: 'Iterators', accent: '#6366f1',
    bg: 'radial-gradient(ellipse at center, rgba(99,102,241,0.04) 0%, transparent 70%)',
    content: [
      'For: Standard numeric iterations.',
      'Foreach: Perfect for working with arrays.',
      'While: Loop until a condition is false.'
    ],
    syntax: 'foreach ($arr as $row) { ... }',
    lab: 'Print numbers 1-5 using a simple while loop.',
    result: 'Output shows sequence of numbers neatly.',
    filename: 'loops.php',
    code: `<?php
$i = 1;
while ($i <= 5) {
    echo $i++ . " ";
}`,
    icon: RotateCcw,
  },

  /* ── CHAPTER 3: FUNCTIONS & ARRAYS ── */
  {
    chapter: 'functions', id: 'P03-S1', tag: 'Week 3', tagColor: '#06b6d4',
    title: 'Functions', subtitle: 'Modular Logic', accent: '#06b6d4',
    bg: 'radial-gradient(ellipse at center, rgba(6,182,212,0.08) 0%, transparent 70%)',
    content: ['Reusable logic blocks', 'Type hinting parameters', 'Returning filtered values'],
    syntax: 'function add(int $a): int { ... }',
    lab: 'Create a function to calculate a total with a discount.',
    result: 'Function returns expected discounted float value.',
    filename: 'funcs.php',
    code: `<?php
function discount($price) {
    return $price * 0.9;
}
echo "Final Price: " . discount(100);`,
    icon: Code2,
  },
  {
    chapter: 'functions', id: 'P03-S2', tag: 'Week 3', tagColor: '#06b6d4',
    title: 'Arrays', subtitle: 'Data Collections', accent: '#06b6d4',
    bg: 'radial-gradient(ellipse at center, rgba(6,182,212,0.08) 0%, transparent 70%)',
    content: ['Indexed arrays (0, 1, 2)', 'Associative arrays (key => val)', 'Sorting techniques'],
    syntax: '$user = ["id" => 1, "name" => "Ari"];',
    lab: 'Sort a list of user names alphabetically.',
    result: 'Output shows list in correct alphabetical order.',
    filename: 'arrays.php',
    code: `<?php
$names = ["Zoe", "Ari"];
sort($names);
print_r($names);`,
    icon: Layers,
  },

  /* ── CHAPTER 4: FORM HANDLING ── */
  {
    chapter: 'forms', id: 'P04-S1', tag: 'Week 4', tagColor: '#f59e0b',
    title: 'Form Handling', subtitle: 'Inputs', accent: '#f59e0b',
    bg: 'radial-gradient(ellipse at center, rgba(245,158,11,0.08) 0%, transparent 70%)',
    content: ['$_GET superglobal', '$_POST superglobal', 'Sanitization basics'],
    syntax: '$name = $_POST["name"] ?? "";',
    lab: 'Handle a search query using the GET method.',
    result: 'Browser displays "Searching for: [Query]".',
    filename: 'form.php',
    code: `<?php
if (isset($_GET['q'])) {
    echo "Search results for: " . htmlspecialchars($_GET['q']);
}`,
    icon: Send,
  },

  /* ── CHAPTER 5: FILE HANDLING ── */
  {
    chapter: 'files', id: 'P05-S1', tag: 'Week 5', tagColor: '#f97316',
    title: 'File System', subtitle: 'Reading & Writing', accent: '#f97316',
    bg: 'radial-gradient(ellipse at center, rgba(249,115,22,0.08) 0%, transparent 70%)',
    content: ['fopen and fclose', 'file_get_contents', 'Secure file uploads'],
    syntax: 'file_put_contents("log.txt", "Ari");',
    lab: 'Write a basic logging script for user actions.',
    result: 'A text file named logs.txt is created/updated.',
    filename: 'files.php',
    code: `<?php
$log = "Action logged at " . date("H:i:s") . "\\n";
file_put_contents("logs.txt", $log, FILE_APPEND);`,
    icon: HardDrive,
  },

  /* ── CHAPTER 6: STATE MANAGEMENT ── */
  {
    chapter: 'state', id: 'P06-S1', tag: 'Week 6', tagColor: '#f43f5e',
    title: 'State Mgmt', subtitle: 'Sessions', accent: '#f43f5e',
    bg: 'radial-gradient(ellipse at center, rgba(244,63,94,0.08) 0%, transparent 70%)',
    content: ['session_start() usage', '$_SESSION array storage', 'Simple Auth logic'],
    syntax: '$_SESSION["authenticated"] = true;',
    lab: 'Create a simple counter using PHP Sessions.',
    result: 'The refresh counter increases persistence.',
    filename: 'session.php',
    code: `<?php
session_start();
$_SESSION['views'] = ($_SESSION['views'] ?? 0) + 1;
echo "Views: " . $_SESSION['views'];`,
    icon: Lock,
  },

  /* ── CHAPTER 7: MYSQL & CRUD ── */
  {
    chapter: 'mysql', id: 'P07-S1', tag: 'Week 7', tagColor: '#3b82f6',
    title: 'MySQL & CRUD', subtitle: 'Database Core', accent: '#3b82f6',
    bg: 'radial-gradient(ellipse at center, rgba(59,130,246,0.08) 0%, transparent 70%)',
    content: ['PDO connection bridge', 'Queries with SELECT', 'Destructive DELETE/UPDATE'],
    syntax: '$pdo = new PDO($dsn, $user, $pass);',
    lab: 'Fetch all users from a local MySQL database.',
    result: 'HTML data table rendered from DB rows.',
    filename: 'db.php',
    code: `<?php
$pdo = new PDO("mysql:host=localhost;dbname=test", "root", "");
$results = $pdo->query("SELECT * FROM users")->fetchAll();`,
    icon: Database,
  },

  /* ── CHAPTER 8: OOP FOUNDATIONS ── */
  {
    chapter: 'oop', id: 'P08-S1', tag: 'Week 8', tagColor: '#a855f7',
    title: 'OOP Foundations', subtitle: 'Objects', accent: '#a855f7',
    bg: 'radial-gradient(ellipse at center, rgba(168,85,247,0.08) 0%, transparent 70%)',
    content: ['Classes and properties', 'Constructor functions', 'Inheritance and Traits'],
    syntax: 'class User { public $name; }',
    lab: 'Build a User class with a getName() method.',
    result: 'Instantiated object returns its name property.',
    filename: 'oop.php',
    code: `<?php
class User {
    public function __construct(public $name) {}
    public function getName() { return $this->name; }
}
$me = new User("Ari");
echo $me->getName();`,
    icon: Layers,
  },

  /* ── CHAPTER 9: SECURITY OPS ── */
  {
    chapter: 'security', id: 'P09-S1', tag: 'Week 9', tagColor: '#ec4899',
    title: 'Security Ops', subtitle: 'Defensive Coding', accent: '#ec4899',
    bg: 'radial-gradient(ellipse at center, rgba(236,72,153,0.08) 0%, transparent 70%)',
    content: ['Preventing SQLi with PDO', 'Encoding XSS with htmlspecialchars', 'Password Hashing'],
    syntax: 'password_hash($pw, PASSWORD_BCRYPT);',
    lab: 'Secure a vulnerable search bar with prepared statements.',
    result: 'Search remains functional but SQL injection-proof.',
    filename: 'secure.php',
    code: `<?php
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$_GET['id']]);`,
    icon: Shield,
  },

  /* ── CHAPTER 10: ADVANCED PHP ── */
  {
    chapter: 'advanced', id: 'P10-S1', tag: 'Week 10', tagColor: '#14b8a6',
    title: 'Advanced PHP', subtitle: 'Modern Features', accent: '#14b8a6',
    bg: 'radial-gradient(ellipse at center, rgba(20,184,166,0.08) 0%, transparent 70%)',
    content: ['JSON handling', 'Fetch and AJAX Interaction', 'Try/Catch error handling'],
    syntax: 'echo json_encode($data);',
    lab: 'Create a simple JSON API endpoint.',
    result: 'Browser receives standard JSON payload.',
    filename: 'api.php',
    code: `<?php
header("Content-Type: application/json");
echo json_encode(["status" => "success"]);`,
    icon: RefreshCw,
  },

  /* ── CHAPTER 11: MVC INTRO ── */
  {
    chapter: 'mvc', id: 'P11-S1', tag: 'Week 11', tagColor: '#f97316',
    title: 'MVC Patterns', subtitle: 'App Structure', accent: '#f97316',
    bg: 'radial-gradient(ellipse at center, rgba(249,115,22,0.08) 0%, transparent 70%)',
    content: ['Separation of concerns', 'Models vs Controllers', 'Router theory'],
    syntax: 'Controller -> Model -> View',
    lab: 'Structure a basic index.php as a simple router.',
    result: 'Clean URL architecture for the application.',
    filename: 'mvc.php',
    code: `<?php
// Unified Router Logic
$route = $_GET['r'] ?? 'home';`,
    icon: Layout,
  },

  /* ── CHAPTER 12: PROJECT LAB ── */
  {
    chapter: 'project', id: 'P12-S1', tag: 'Week 12', tagColor: '#10b981',
    title: 'Final Project', subtitle: 'Capestone Lab', accent: '#10b981',
    bg: 'radial-gradient(ellipse at center, rgba(16,185,129,0.08) 0%, transparent 70%)',
    content: ['Full CRUD application', 'User authentication', 'Database migration'],
    syntax: 'Combine ALL PHP modules',
    lab: 'Build a production-ready Portfolio platform.',
    result: 'Complete PHP app running with DB integration.',
    filename: 'final.php',
    code: `<?php
// PHP Capestone Project Complete`,
    icon: Trophy,
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

    const parts = line.split(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\$[a-zA-Z_]\w*|\b\d+(?:\.\d+)?\b|\b[a-zA-Z_]\w*\b)/g);
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
              <span className="text-blue-400">~/php-app</span>
              <span className="text-zinc-600 font-bold">$</span>
              <span className="text-zinc-200">{terminal || 'php index.php'}</span>
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
export default function PHPLessonContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chapterParam = searchParams.get('chapter') || 'intro';

  // ISOLATE SLIDES: Only show slides for the active chapter
  const activeSlides = slides.filter(s => s.chapter === chapterParam);
  const displaySlides = activeSlides.length > 0 ? activeSlides : slides.filter(s => s.chapter === 'intro');

  const slideParam = searchParams.get('slide');
  const initialSlide = slideParam ? Math.max(0, Math.min(parseInt(slideParam) - 1, displaySlides.length - 1)) : 0;

  const [current, setCurrent] = useState(initialSlide);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dir, setDir] = useState(1);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const slide = displaySlides[current];
  const Icon = slide.icon;
  const progress = ((current + 1) / displaySlides.length) * 100;
  const chapterInfo = CHAPTERS.find(c => c.id === slide.chapter)!;

  useEffect(() => {
    const saved = localStorage.getItem('php_slide_notes');
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  const saveNote = (val: string) => {
    const next = { ...notes, [slide.id]: val };
    setNotes(next);
    localStorage.setItem('php_slide_notes', JSON.stringify(next));
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
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, isAnimating]);

  const variants = {
    enter: (d: number) => ({ y: d * 30, opacity: 0, scale: 0.98 }),
    center: { y: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ y: d * -30, opacity: 0, scale: 0.98 }),
  };

  return (
    <div className="min-h-screen text-white flex flex-col overflow-hidden"
      style={{ background: '#07090f', fontFamily: "'Inter','DM Sans',system-ui,sans-serif" }}>

      <div className="fixed inset-0 pointer-events-none transition-all duration-700" style={{ background: slide.bg }} />
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(168,85,247,0.04) 0%, transparent 60%)' }} />

      <div className="relative z-20 flex items-center gap-1 px-6 py-3 border-b border-white/5 bg-black/30 backdrop-blur-xl overflow-x-auto mt-16 lg:mt-0">
        {CHAPTERS.map((ch) => {
          const isActive = ch.id === chapterParam;
          return (
            <button key={ch.id} onClick={() => router.push(`?chapter=${ch.id}`)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                isActive ? 'text-black border-transparent' : 'bg-transparent border-white/8 text-zinc-500 hover:text-zinc-300'
              }`}
              style={isActive ? { background: ch.color, borderColor: ch.color } : {}}>
              {ch.label}
            </button>
          );
        })}
        <div className="ml-auto flex items-center gap-3 flex-none pl-4">
          <div className="w-32 h-0.5 bg-white/8 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: chapterInfo.color }} />
          </div>
          <span className="text-[10px] font-mono text-zinc-600">
            {current + 1}<span className="text-zinc-800">/{displaySlides.length}</span>
          </span>
        </div>
      </div>

      <main className="relative z-10 flex-1 flex flex-col lg:flex-row overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={`left-${current}`} custom={dir} variants={variants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="flex-none lg:w-[45%] flex flex-col p-6 lg:p-10 xl:p-14 lg:border-r border-white/6 overflow-y-auto gap-6">

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-none border border-white/10"
                style={{ background: `${slide.accent}18` }}>
                <Icon className="w-6 h-6" style={{ color: slide.accent }} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] px-2 py-0.5 rounded-full border"
                    style={{ color: slide.tagColor, borderColor: `${slide.tagColor}40`, background: `${slide.tagColor}12` }}>
                    {slide.tag}
                  </span>
                  <span className="text-[9px] font-mono text-zinc-700">{slide.id}</span>
                </div>
                <h1 className="text-3xl xl:text-4xl font-black leading-tight text-white tracking-tighter">{slide.title}</h1>
                <p className="text-sm text-white/40 font-bold uppercase tracking-widest mt-1">{slide.subtitle}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {slide.content.map((text, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                  className="rounded-xl border p-4 flex items-center gap-4"
                  style={{ borderColor: `${slide.accent}20`, background: `${slide.accent}05` }}>
                  <div className="w-1.5 h-1.5 rounded-full flex-none" style={{ background: slide.accent }} />
                  <p className="text-sm text-zinc-300 leading-relaxed font-medium">{text}</p>
                </motion.div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border p-4 flex gap-3" style={{ background: `${slide.accent}08`, borderColor: `${slide.accent}25` }}>
                <Play className="w-4 h-4 flex-none mt-0.5" style={{ color: slide.accent }} />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1.5" style={{ color: slide.accent }}>Lab Exercise</p>
                  <p className="text-sm text-white font-semibold leading-relaxed">{slide.lab}</p>
                </div>
              </div>
              <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-4 flex gap-3">
                <Check className="w-4 h-4 flex-none mt-0.5 text-emerald-400" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1.5 text-emerald-400">Expected Result</p>
                  <p className="text-sm text-white font-semibold leading-relaxed">{slide.result}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2 mt-auto">
              <button onClick={prev} className="p-3 rounded-xl bg-white/5 border border-white/8 hover:text-white transition-all">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={next} className="flex-1 py-3 px-5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg"
                style={{ background: slide.accent, color: '#000' }}>
                {current === displaySlides.length - 1 ? 'Restart Chapter' : 'Next Slide'}
                <ChevronRight className="w-4 h-4" />
              </button>
              <button onClick={() => setShowNotes(!showNotes)}
                className={`p-3 rounded-xl border transition-all ${
                  showNotes ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-white/5 border-white/8 text-zinc-500 hover:text-white'
                }`}>
                <StickyNote className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex-none lg:w-[55%] flex flex-col p-4 lg:p-8 xl:p-10 gap-4 overflow-hidden">
          <div className="flex items-center gap-2 flex-none">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/8 bg-white/5"
              style={{ color: slide.accent }}>
              <Terminal className="w-3.5 h-3.5" /> Code Sandbox
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/5 font-mono text-[10px] text-zinc-500">
              {slide.filename || 'sandbox.php'}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={`code-${current}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="flex-1 overflow-hidden">
              <CodePanel code={slide.code} terminal={slide.terminal} terminalOutput={slide.terminalOutput}
                accent={slide.accent} filename={slide.filename || 'sandbox.php'} />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {showNotes && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28 }}
            className="fixed inset-y-0 right-0 w-80 bg-[#12151e] border-l border-white/8 z-[100] p-6 flex flex-col pt-24 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-amber-400">Lesson Notes</h3>
              <button onClick={() => setShowNotes(false)} className="text-zinc-600 hover:text-white"><List className="w-5 h-5" /></button>
            </div>
            <textarea autoFocus value={notes[slide.id] || ''} onChange={e => saveNote(e.target.value)}
              placeholder="Jot down key takeaways..."
              className="flex-1 w-full bg-black/40 rounded-xl p-4 text-sm text-zinc-300 resize-none outline-none border border-white/5 focus:border-amber-500/30 font-mono" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
