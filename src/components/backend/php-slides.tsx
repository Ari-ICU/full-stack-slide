'use client';

import * as React from 'react';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  ChevronLeft, ChevronRight, Menu, X, BookOpen,
  Code2, Sparkles, Terminal, Copy, CheckCircle2,
  Layers, Database, Lock, Globe, Box, ShieldCheck,
  Layout, Search, User, FileCode, Zap, List,
  Hash, RotateCcw, ShieldAlert, ArrowLeft, ArrowRight, StickyNote,
  HardDrive, Fingerprint, Rocket, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

/* ══════════════════════════════════════════════════════════════════
   TYPES & DATA
   Web Application Development with PHP
══════════════════════════════════════════════════════════════════ */

interface Concept {
  label: string;
  desc: string;
}

interface Slide {
  chapter: string;
  section: string;
  id: string;
  accent: string;
  title: string;
  subtitle: string;
  icon: any;
  concepts: Concept[];
  variables?: Concept[]; // Adding variables for code explanation
  tip: string;
  lab: string;
  result: string;
  code: string;
  filename: string;
  terminalOutput: string;
  outputType?: 'browser' | 'terminal';
}

interface DisplayPage extends Slide {
  subType: 'concept' | 'variables' | 'lab';
}

const CHAPTERS = [
  { id: 'intro', num: '01', label: 'PHP for the Web', color: '#8b5cf6' },
  { id: 'logic', num: '02', label: 'Logic & Functions', color: '#f43f5e' },
  { id: 'data', num: '03', label: 'Arrays & Loops', color: '#22d3ee' },
  { id: 'oop', num: '04', label: 'OOP Fundamentals', color: '#c084fc' },
  { id: 'forms', num: '05', label: 'Forms & Validation', color: '#fb923c' },
  { id: 'db', num: '06', label: 'Database (PDO)', color: '#38bdf8' },
  { id: 'auth', num: '07', label: 'Login & Sessions', color: '#f87171' },
  { id: 'files', num: '08', label: 'File Uploads', color: '#fbbf24' },
  { id: 'security', num: '09', label: 'Web Security', color: '#f472b6' },
  { id: 'project', num: '10', label: 'MVC & Final Web App', color: '#2dd4bf' },
];

const PHP_SLIDES: Slide[] = [

  /* ══════════════════════════════════════════════════════
     CHAPTER 1: PHP FOR THE WEB
  ══════════════════════════════════════════════════════ */
  {
    chapter: 'intro', id: 'PH1-S1', accent: '#8b5cf6',
    section: 'Overview',
    title: 'PHP Renders Web Pages', subtitle: 'Server-side HTML Generation',
    icon: Globe,
    concepts: [
      { label: 'PHP Script Execution', desc: 'PHP engine ដំណើរការ logic ─ code ត្រូវបាន execute on server ─ result generates text output ─ works independently from UI .' },
      { label: 'Syntax & $Variables', desc: 'សរសេរជាមួយ <?php tags ─ variables គឺ case-sensitive ($Name vs $name) ─ ប្រើ ; បញ្ចប់ Statement ─ comments // ឬ /* */ ។' },
      { label: 'Data Types', desc: 'String (អត្ថបទ), Integer (លេខគត់), Float (លេខទសភាគ), Boolean (true/false) ─ PHP creates types automatically (Dynamic typing) ។' },
      { label: 'Dynamic Content', desc: 'PHP អាចបញ្ចូល data ទៅក្នុង HTML ─ ប្រើ <?= $var ?> សម្រាប់ shorthand echo ─ បង្កើត interface ដែលផ្លាស់ប្តូរតាម data ។' },
    ],
    tip: 'php -S localhost:8000 ─ built-in dev server ─ no Apache needed for testing ។ Open http://localhost:8000 in browser ！',
    lab: 'Create index.php ─ define variables for name and role ─ output a welcome message wrapped in HTML/CSS.',
    result: 'Browser displays a dynamic welcome card with the current date using PHP logic .',
    outputType: 'browser',
    code: `<?php
$userName = "Ratha";
$role     = "Backend Developer";
$date     = date("Y-m-d");
?>
<!DOCTYPE html>
<html>
<head>
    <style>
        .welcome-card { font-family: sans-serif; padding: 2.5rem; background: #f5f3ff; border: 2px solid #ddd6fe; border-radius: 16px; max-width: 380px; text-align: center; }
        h1 { color: #5b21b6; margin: 0 0 0.5rem; }
        .role { font-weight: 800; color: #7c3aed; background: #ede9fe; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; }
    </style>
</head>
<body>
    <div class="welcome-card">
        <h1>Welcome, <?= $userName ?>!</h1>
        <span class="role"><?= $role ?></span>
        <p style="color: #6d28d9; font-size: 0.85rem; margin-top: 20px;">Logged in: <?= $date ?></p>
    </div>
</body>
</html>`,
    filename: 'index.php',
    terminalOutput: `<!DOCTYPE html>
<html>
<head>
    <style>
        .welcome-card { font-family: sans-serif; padding: 2.5rem; background: #f5f3ff; border: 2px solid #ddd6fe; border-radius: 20px; max-width: 320px; text-align: center; box-shadow: 0 10px 15px -3px rgba(139, 92, 246, 0.1); }
        .avatar { width: 64px; height: 64px; background: #8b5cf6; border-radius: 50%; border: 4px solid white; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: 800; }
        h1 { color: #5b21b6; margin: 0 0 0.5rem; font-size: 1.5rem; }
        .role { font-weight: 800; color: #7c3aed; background: #ede9fe; padding: 5px 14px; border-radius: 20px; font-size: 0.75rem; text-transform: uppercase; }
        .date { color: #8b5cf6; font-size: 0.8rem; margin-top: 1.5rem; border-top: 1px dashed #c4b5fd; padding-top: 1rem; }
    </style>
</head>
<body>
    <div class="welcome-card">
        <div class="avatar">R</div>
        <h1>Welcome, Ratha!</h1>
        <span class="role">Backend Developer</span>
        <div class="date">📅 Today: 2024-03-20</div>
    </div>
</body>
</html>`,
  },

  {
    chapter: 'intro', id: 'PH1-S2', accent: '#8b5cf6',
    section: '1. Variables',
    title: 'PHP Variables', subtitle: 'Basic Data Storage',
    icon: Hash,
    concepts: [
      { label: 'Variable Assignment', desc: '$name = "Value" ─ points to a memory location ─ can change value anytime ─ used for dynamic processing .' },
      { label: 'Data Types', desc: 'String (text), Integer (number), Float (decimal), Boolean (true/false) ─ Dynamic typing in PHP .' },
      { label: 'Constants', desc: 'define("KEY", "VALUE") ─ immutable values ─ cannot be redefined ─ shared global config .' },
    ],
    variables: [
      { label: '$title', desc: 'String variable for page/section heading.' },
      { label: '$score', desc: 'Float variable representing numeric calculation results.' },
      { label: '$isActive', desc: 'Boolean variable used for status flags (True/False).' },
    ],
    tip: 'Rule: Variable names are case-sensitive ($Name !== $name) ─ choose descriptive names for readability !',
    lab: 'Create index.php ─ define variables and constants ─ output them inside a styled card representation.',
    result: 'Browser displays variable values processed and rendered by PHP server-side.',
    outputType: 'browser',
    code: `<?php
$title = "Course Statistics";
$score = 8.5;
$isActive = true;
define("SERVER_NAME", "PHP_Node_A1");
?>
<div style="font-family: sans-serif; max-width: 320px; padding: 2rem; border-radius: 16px; background: #fff; border: 1px solid #ddd;">
    <h3 style="color: #8b5cf6; margin-top: 0;"><?= $title ?></h3>
    <div style="padding: 1rem; background: #f9fafb; border-radius: 8px;">
        <p><strong>Score:</strong> <?= $score ?></p>
        <p><strong>Status:</strong> <?= $isActive ? "Active ✅" : "Inactive ❌" ?></p>
        <p style="font-size: 0.8rem; color: #64748b; margin-top: 1rem;">Server: <?= SERVER_NAME ?></p>
    </div>
</div>`,
    filename: 'variables.php',
    terminalOutput: `<!DOCTYPE html>
<html>
<head>
    <style>
        .stats { font-family: sans-serif; max-width: 300px; padding: 2rem; background: #f8fafc; border-radius: 20px; border: 1.5px solid #e2e8f0; }
        .badge { background: #8b5cf6; color: white; padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: 800; display: inline-block; margin-bottom: 1rem; }
        .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
        .label { color: #64748b; }
        .val { font-weight: 700; color: #1e293b; }
    </style>
</head>
<body>
    <div class="stats">
        <div class="badge">SYSTEM READY</div>
        <div class="row"><span class="label">Course Status</span><span class="val">Active ✅</span></div>
        <div class="row"><span class="label">User Score</span><span class="val">8.5 / 10</span></div>
        <div style="margin-top:20px; font-size:11px; color:#94a3b8; border-top:1px solid #e2e8f0; padding-top:10px">Server: PHP_Node_A1</div>
    </div>
</body>
</html>`,
  },

  {
    chapter: 'intro', id: 'PH1-S3', accent: '#8b5cf6',
    section: '2. Basic Arrays',
    title: 'PHP Arrays', subtitle: 'Structuring Complex Data',
    icon: List,
    concepts: [
      { label: 'Array Basics', desc: 'List of values in a single variable ─ accessed by index (0, 1, 2) or custom keys (associative) .' },
      { label: 'Associative Arrays', desc: 'ប្រើ keys (string) ដើម្បីសម្គាល់ data ─ ["name" => "Value"] ─ ស្រដៀងទៅនឹង JavaScript Objects ─ Core concept !' },
      { label: 'Dynamic Foreach', desc: 'Loop through arrays → generate dynamic HTML elements (lists, cards, tables) effortlessly .' },
    ],
    variables: [
      { label: '$user', desc: 'Associative array storing developer profile data records.' },
      { label: '$user["skills"]', desc: 'A nested indexed array containing specific technology strings.' },
    ],
    tip: 'Associative arrays are the heart of PHP web development ─ perfect for representing Database Rows !',
    lab: 'Build profile.php ─ use a multi-dimensional associative array for user data ─ render a styled profile card.',
    result: 'Browser displays a structured user profile card generated from PHP array data .',
    outputType: 'browser',
    code: `<?php
$user = [
    "name"   => "Channary Sok",
    "role"   => "Full-stack Developer",
    "skills" => ["PHP", "Next.js", "MySQL"],
    "bio"    => "Building high-performance web applications."
];
?>
<div style="font-family: sans-serif; max-width: 400px; padding: 2rem; border: 1px solid #ddd; border-radius: 12px;">
    <h2 style="color: #8b5cf6; margin-top: 0;"><?= $user['name'] ?></h2>
    <p><strong>Role:</strong> <?= $user['role'] ?></p>
    <p><?= $user['bio'] ?></p>
    <div style="display: flex; gap: 8px;">
        <?php foreach($user['skills'] as $s): ?>
            <span style="background: #f3f4f6; padding: 4px 10px; border-radius: 4px; font-size: 0.8rem;"><?= $s ?></span>
        <?php endforeach; ?>
    </div>
</div>`,
    filename: 'profile.php',
    terminalOutput: `<!DOCTYPE html>
<html>
<head>
    <style>
        .profile-card { font-family: sans-serif; max-width: 350px; background: white; border-radius: 16px; overflow: hidden; border: 1.5px solid #eee; box-shadow: 0 10px 20px rgba(0,0,0,0.02); }
        .header { background: #8b5cf6; color: white; padding: 1.5rem; text-align: center; }
        .content { padding: 1.5rem; }
        .skill { background: #f5f3ff; color: #7c3aed; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; border: 1px solid #ddd6fe; margin-right: 5px; }
    </style>
</head>
<body>
    <div class="profile-card">
        <div class="header"><h2 style="margin:0">Channary Sok</h2></div>
        <div class="content">
            <p><strong>Role:</strong> Full-stack Developer</p>
            <div style="display:flex"><span class="skill">PHP</span><span class="skill">Next.js</span><span class="skill">MySQL</span></div>
        </div>
    </div>
</body>
</html>`,
  },

  /* ══════════════════════════════════════════════════════
     CHAPTER 2: LOGIC & FUNCTIONS
  ══════════════════════════════════════════════════════ */
  {
    chapter: 'logic', id: 'PH2-S1', accent: '#f43f5e',
    section: '1. Conditionals',
    title: 'Conditionals in Web Pages', subtitle: 'Show/Hide HTML Based on Conditions',
    icon: Zap,
    concepts: [
      { label: 'If/Else Statements', desc: 'Decision making ─ execute code only IF condition is true ─ handle multiple branches with elseif/else .' },
      { label: 'Comparison Operators', desc: '== (equal), === (identical), !=, <, > ─ compare values to control program flow .' },
      { label: 'Logical Operators', desc: '&& (AND), || (OR), ! (NOT) ─ combine multiple conditions for complex logic decisions .' },
      { label: 'Null Coalescing ??', desc: '$val = $input ?? "Default" ─ provide fallback values ─ prevent errors when data is missing .' },
    ],
    variables: [
      { label: '$isLoggedIn', desc: 'Boolean flag controlling which parts of the UI are rendered (Guest vs Member).' },
    ],
    tip: 'Use alternate syntax if(): ... endif; for cleaner HTML templates ─ easier to read than nested braces .',
    lab: 'Build navbar.php ─ use a conditional to check login status ─ render different UI for guests and members.',
    result: 'Browser shows "Welcome back" for logged-in users and "Please login" for guests .',
    outputType: 'browser',
    code: `<?php $isLoggedIn = true; ?>
<nav style="display: flex; justify-content: space-between; padding: 1rem; background: #fff1f2; border-radius: 8px;">
    <?php if ($isLoggedIn): ?>
        <div style="color: #e11d48; font-weight: bold;">[✓] Welcome Dashboard</div>
        <a href="#" style="color: #f43f5e;">Logout</a>
    <?php else: ?>
        <div style="color: #475569;">Hello, Guest</div>
        <a href="#" style="color: #f43f5e;">Login / Join</a>
    <?php endif; ?>
</nav>`,
    filename: 'navbar.php',
    terminalOutput: `<!DOCTYPE html>
<html>
<head>
    <style>
        .nav-sim { font-family: sans-serif; width: 400px; padding: 1rem; background: #fff; border-radius: 12px; border: 1px solid #fecdd3; display: flex; justify-content: space-between; align-items: center; }
        .status { font-weight: 800; font-size: 0.85rem; color: #e11d48; }
        .links a { font-size: 0.8rem; color: #f43f5e; font-weight: 700; text-decoration: none; margin-left: 10px; }
    </style>
</head>
<body>
    <div class="nav-sim">
        <div class="status">✓ Welcome back, Ratha!</div>
        <div class="links">
            <a href="#">Dashboard</a>
            <a href="#">Logout</a>
        </div>
    </div>
</body>
</html>`,
  },

  {
    chapter: 'logic', id: 'PH2-S2', accent: '#f43f5e',
    section: '2. Loops',
    title: 'Loops Generating HTML', subtitle: 'Repeat HTML Elements with PHP Loops',
    icon: RotateCcw,
    concepts: [
      { label: 'foreach for Lists', desc: 'Iterate through arrays ─ process every item in a collection ─ perform actions on each record .' },
      { label: 'while / for loops', desc: 'Repeat code based on counters or conditions ─ automate repetitive tasks efficiently .' },
      { label: 'Control Flow', desc: 'break (exit loop), continue (skip current item) ─ precise control over loop execution .' },
      { label: 'Generating UI Lists', desc: "Process raw data arrays → generate dynamic HTML tables or cards ─ Core backend task !" },
    ],
    variables: [
      { label: '$users', desc: 'Multidimensional array containing user record objects (Name, Role).' },
      { label: '$u', desc: 'Current item variable in the foreach loop representing one user.' },
    ],
    tip: 'Never build HTML by string-concatenating in a loop ─ use alternate syntax inside HTML for readability .',
    lab: 'Generate user list ─ loop through a multi-dimensional array ─ create a styled table of users in the browser.',
    result: 'Browser displays a list of formatted user summaries generated by the PHP loop .',
    outputType: 'browser',
    code: `<?php
$users = [
    ["name" => "Ratha", "role" => "Admin"],
    ["name" => "Channa", "role" => "Editor"],
];
?>
<table style="width: 100%; font-family: sans-serif; border-collapse: collapse;">
    <tr style="background: #f1f5f9;">
        <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Name</th>
        <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Role</th>
    </tr>
    <?php foreach($users as $u): ?>
    <tr>
        <td style="padding: 10px; border: 1px solid #ddd;"><?= $u['name'] ?></td>
        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; color: #f43f5e;"><?= $u['role'] ?></td>
    </tr>
    <?php endforeach; ?>
</table>`,
    filename: 'user-list.php',
    terminalOutput: `<!DOCTYPE html>
<html>
<head>
    <style>
        .user-list { font-family: sans-serif; max-width: 400px; }
        .row { display: flex; align-items: center; gap: 1rem; padding: 12px; border-bottom: 1px solid #fecdd3; }
        .badge { font-size: 10px; background: #fef2f2; color: #f43f5e; padding: 2px 8px; border-radius: 4px; font-weight: 800; border: 1px solid #fecdd3; }
        .name { font-weight: 700; color: #4b5563; flex: 1; }
    </style>
</head>
<body>
    <div class="user-list">
        <h4 style="margin: 0 0 10px; color:#9f1239">SYSTEM MEMBERS</h4>
        <div class="row"><div class="name">Ratha</div><div class="badge">ADMIN</div></div>
        <div class="row"><div class="name">Channa</div><div class="badge">EDITOR</div></div>
        <div class="row"><div class="name">Dara</div><div class="badge">USER</div></div>
    </div>
</body>
</html>`,
  },

  {
    chapter: 'logic', id: 'PH2-S3', accent: '#f43f5e',
    section: '3. Web Functions',
    title: 'PHP Functions in Web Apps', subtitle: 'Reusable Logic for Your Website',
    icon: Code2,
    concepts: [
      { label: 'User Defined Functions', desc: 'Custom reusable code blocks ─ accept input parameters ─ return processed results .' },
      { label: 'Type Hinting', desc: 'function(array $data, string $name) ─ enforce data types ─ catch bugs early ─ professional code standards .' },
      { label: 'Return Values', desc: 'return statement exits function + sends value back to caller ─ used for calculations and logic mapping .' },
      { label: 'Scope (Global vs Local)', desc: 'Understand where variables can be accessed ─ use global or pass as arguments ─ safe data management .' },
    ],
    variables: [
      { label: '$data', desc: 'Input array of numbers passed to the custom math functions.' },
      { label: 'calculate_sum()', desc: 'Helper function that wraps array_sum() for cleaner logic.' },
      { label: 'calculate_avg()', desc: 'Function that computes the mean average of a numeric array.' },
    ],
    tip: 'Create helpers.php with all utility functions ─ require_once it at top of every page ─ DRY web app .',
    lab: 'Build math_helpers.php ─ create functions for sum() and average() ─ render results in a styled card.',
    result: 'Browser executes the logic inside functions and displays the calculated results correctly .',
    outputType: 'browser',
    code: `<?php
function calculate_sum(array $numbers): float {
    return array_sum($numbers);
}

function calculate_avg(array $numbers): float {
    return array_sum($numbers) / count($numbers);
}

$data = [10, 20, 30, 40, 50];
?>
<div style="font-family: sans-serif; background: #fff1f2; border: 2.5px solid #fecdd3; padding: 2rem; border-radius: 16px; max-width: 320px;">
    <h3 style="color: #e11d48; margin-top: 0;">Math Helpers Result</h3>
    <p>Data: <strong><?= implode(", ", $data) ?></strong></p>
    <div style="background: #fff; padding: 15px; border-radius: 12px;">
        <p style="margin: 5px 0;">Sum: <span style="color: #f43f5e; font-weight: 800;"><?= calculate_sum($data) ?></span></p>
        <p style="margin: 5px 0;">Avg: <span style="color: #f43f5e; font-weight: 800;"><?= calculate_avg($data) ?></span></p>
    </div>
</div>`,
    filename: 'helpers.php',
    terminalOutput: `<!DOCTYPE html>
<html>
<head>
    <style>
        .calc-card { font-family: sans-serif; max-width: 350px; background: white; border-radius: 16px; border: 1px solid #fecdd3; overflow: hidden; box-shadow: 0 10px 20px rgba(225, 29, 72, 0.05); }
        .header { background: #f43f5e; color: white; padding: 1rem; font-weight: 800; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .body { padding: 1.5rem; }
        .stat-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed #fecdd3; }
        .label { color: #64748b; font-size: 0.85rem; }
        .val { color: #e11d48; font-weight: 800; font-family: monospace; }
    </style>
</head>
<body>
    <div class="calc-card">
        <div class="header">System Math Logic</div>
        <div class="body">
            <div class="stat-row"><span class="label">Processed Array</span><span class="val">10, 20, 30, 40, 50</span></div>
            <div class="stat-row"><span class="label">Total Sum</span><span class="val">150.00</span></div>
            <div class="stat-row" style="border:none"><span class="label">Average Value</span><span class="val">30.00</span></div>
        </div>
    </div>
</body>
</html>`,
  },

  /* ══════════════════════════════════════════════════════
     CHAPTER 3: ARRAYS & LOOPS (WEB)
  ══════════════════════════════════════════════════════ */
  {
    chapter: 'data', id: 'PH3-S1', accent: '#22d3ee',
    section: '1. Data Arrays',
    title: 'Arrays for Web Data', subtitle: 'Storing Page Content in PHP Arrays',
    icon: List,
    concepts: [
      { label: 'Associative Arrays', desc: 'Key-value pairs ─ like mini databases ─ record-like structures using named keys (id, title, author) .' },
      { label: 'Multi-dimensional Arrays', desc: 'Arrays inside arrays ─ store collections of records (e.g., list of users, blog posts, or orders) .' },
      { label: 'Array Sorting', desc: 'sort(), asort(), ksort(), usort() ─ organize data alphabetically, numerically, or by custom logic .' },
      { label: 'Filtering Data', desc: 'array_filter(), array_map() ─ transform or thin out collections based on specific business rules .' },
    ],
    variables: [
      { label: '$posts', desc: 'Main data collection (array of arrays) representing system blog content.' },
      { label: 'usort()', desc: 'Built-in function to sort the array by popularity (likes) globally.' },
    ],
    tip: 'Think of PHP arrays as your "in-memory database" ─ before adding real DB, prototype with hardcoded arrays .',
    lab: 'Build post-manager.php ─ use an array of associative arrays ─ render a sorted list of posts in the browser.',
    result: 'Browser displays a sorted list of blog posts ─ demonstrating array manipulation logic .',
    outputType: 'browser',
    code: `<?php
$posts = [
    ['title' => 'PHP for Beginners', 'date' => '2024-03-10', 'likes' => 45],
    ['title' => 'Laravel Tips',      'date' => '2024-03-12', 'likes' => 120],
    ['title' => 'MySQL Design',      'date' => '2024-03-11', 'likes' => 85],
];

// Sort by likes (descending)
usort($posts, fn($a, $b) => $b['likes'] <=> $a['likes']);
?>
<div style="font-family: sans-serif; max-width: 400px; padding: 1.5rem; background: #ecfeff; border-radius: 12px; border: 2px solid #a5f3fc;">
    <h4 style="color: #0891b2; margin-top: 0;">Popular Posts (PHP Sorted)</h4>
    <div style="display: flex; flex-direction: column; gap: 10px;">
        <?php foreach ($posts as $post): ?>
            <div style="background: white; padding: 15px; border-radius: 8px; display: flex; justify-content: space-between; border: 1px solid #bae6fd;">
                <span style="font-weight: bold; color: #164e63;"><?= $post['title'] ?></span>
                <span style="color: #0891b2; font-size: 0.85rem;"><?= $post['likes'] ?> 🔥</span>
            </div>
        <?php endforeach; ?>
    </div>
</div>`,
    filename: 'post-manager.php',
    terminalOutput: `<!DOCTYPE html>
<html>
<head>
    <style>
        .post-list { font-family: sans-serif; max-width: 350px; background: white; border-radius: 16px; border: 1px solid #a5f3fc; overflow: hidden; box-shadow: 0 10px 30px rgba(6, 182, 212, 0.05); }
        .header { background: #06b6d4; color: white; padding: 1rem; font-weight: 800; font-size: 0.85rem; }
        .post-item { display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #cffafe; }
        .title { font-weight: 700; color: #164e63; font-size: 0.9rem; }
        .meta { color: #0891b2; font-weight: 800; font-size: 0.8rem; background: #ecfeff; padding: 4px 10px; border-radius: 20px; }
    </style>
</head>
<body>
    <div class="post-list">
        <div class="header">🔥 POPULAR POSTS</div>
        <div class="post-item"><span class="title">Laravel Tips</span><span class="meta">120 Likes</span></div>
        <div class="post-item"><span class="title">MySQL Design</span><span class="meta">85 Likes</span></div>
        <div class="post-item" style="border:none"><span class="title">PHP for Beginners</span><span class="meta">45 Likes</span></div>
    </div>
</body>
</html>`,
  },

  {
    chapter: 'data', id: 'PH3-S2', accent: '#22d3ee',
    section: '2. Array Logic',
    title: 'Foreach for Web Templates', subtitle: 'Dynamic HTML Lists, Tables & Dropdowns',
    icon: RotateCcw,
    concepts: [
      { label: 'Iterating Collections', desc: 'Loop through data records ─ perform bulk updates, calculations, or formatting on every item in the set .' },
      { label: 'Nested foreach', desc: 'Loops within loops ─ process grouped data (e.g., categories with their underlying products) .' },
      { label: 'Array Manipulation Logic', desc: 'Push, pop, shift, and merge arrays ─ dynamic data structure management for complex backend tasks .' },
      { label: 'Extracting Keys', desc: 'array_keys(), array_values() ─ isolate specific metadata from records for analysis or transformation .' },
    ],
    variables: [
      { label: '$data', desc: 'Nested dictionary mapping months to an array of sales numbers.' },
      { label: 'array_sum()', desc: 'Calculates the total numeric value of all items in a sub-array.' },
    ],
    tip: 'foreach + HTML alternate syntax = clean templates ─ avoid echo-ing entire HTML strings ─ hard to maintain .',
    lab: 'Build report.php ─ use nested loops to generate a styled sales report table in the browser.',
    result: 'Browser displays a generated grid of data with calculated totals per row .',
    outputType: 'browser',
    code: `<?php
$data = [
    "Jan" => [100, 200, 150],
    "Feb" => [120, 180, 210],
    "Mar" => [150, 220, 180],
];
?>
<div style="font-family: sans-serif; padding: 1.5rem; background: white; border: 1.5px solid #a5f3fc; border-radius: 12px; max-width: 420px;">
    <h4 style="color: #0891b2; margin-top: 0;">Monthly Sales Report</h4>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr style="background: #ecfeff; color: #0891b2;">
            <th style="padding: 10px; border: 1px solid #cffafe; text-align: left;">Month</th>
            <th style="padding: 10px; border: 1px solid #cffafe; text-align: left;">Data</th>
            <th style="padding: 10px; border: 1px solid #cffafe; text-align: left;">TOTAL</th>
        </tr>
        <?php foreach ($data as $month => $sales): ?>
            <tr>
                <td style="padding: 10px; border: 1px solid #cffafe; font-weight: bold;"><?= $month ?></td>
                <td style="padding: 10px; border: 1px solid #cffafe; color: #64748b;"><?= implode(", ", $sales) ?></td>
                <td style="padding: 10px; border: 1px solid #cffafe; font-weight: 800; color: #0e7490;">$<?= array_sum($sales) ?></td>
            </tr>
        <?php endforeach; ?>
    </table>
</div>`,
    filename: 'report.php',
    terminalOutput: `<!DOCTYPE html>
<html>
<head>
    <style>
        .report-card { font-family: sans-serif; max-width: 400px; padding: 2rem; background: #ecfeff; border: 1.5px solid #a5f3fc; border-radius: 16px; box-shadow: 0 10px 15px -3px rgba(6, 182, 212, 0.1); }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .row { display: flex; justify-content: space-between; padding: 12px; background: white; border-radius: 10px; margin-bottom: 8px; border: 1px solid #cffafe; }
        .month { font-weight: 800; color: #0e7490; width: 60px; }
        .total { color: #0891b2; font-weight: 800; border-left: 2px solid #a5f3fc; padding-left: 1rem; }
    </style>
</head>
<body>
    <div class="report-card">
        <div class="header"><h5 style="margin:0; color:#0e7490">SALES SUMMARY</h5><span style="font-size:10px; color:#0891b2; font-weight:800">Q1 2024</span></div>
        <div class="row"><span class="month">JAN</span><span style="flex:1; color:#64748b; font-size:12px">100, 200, 150</span><span class="total">$450</span></div>
        <div class="row"><span class="month">FEB</span><span style="flex:1; color:#64748b; font-size:12px">120, 180, 210</span><span class="total">$510</span></div>
        <div class="row"><span class="month">MAR</span><span style="flex:1; color:#64748b; font-size:12px">150, 220, 180</span><span class="total">$550</span></div>
    </div>
</body>
</html>`,
  },

  {
    chapter: 'data', id: 'PH3-S3', accent: '#22d3ee',
    section: '3. For Loops',
    title: 'Counter Loops (For)', subtitle: 'Iterating with a Fixed Start and End',
    icon: RotateCcw,
    concepts: [
      { label: 'Initializer ($i=0)', desc: 'Sets the starting point of the loop counter ─ only runs once at the beginning .' },
      { label: 'Condition ($i < 10)', desc: 'Checked before every iteration ─ if false, the loop stops immediately .' },
      { label: 'Increment ($i++)', desc: 'Updates the counter after the code block runs ─ moves the loop to the next step .' },
      { label: 'Generating UI Patterns', desc: 'Perfect for grids, pagination, or repeating a structural element a specific number of times .' },
    ],
    variables: [
      { label: '$i', desc: 'The "Iterator" variable tracking the current cycle number.' },
      { label: '$limit', desc: 'Max value determining how many times the loop should repeat.' },
    ],
    tip: 'Use for loops when you know the EXACT number of times you want to repeat ─ like 12 months or 10 pages .',
    lab: 'Build pagination.php ─ use a for loop to generate 5 page number buttons in a styled horizontal list.',
    result: 'Browser renders a numbered pagination menu from 1 to 5 using for loop logic .',
    outputType: 'browser',
    code: `<?php
$pages = 5;
?>
<div style="font-family: sans-serif; display: flex; gap: 8px;">
    <?php for ($i = 1; $i <= $pages; $i++): ?>
        <button style="width: 36px; height: 36px; border: 1px solid #06b6d4; background: <?= $i === 1 ? '#06b6d4' : '#fff' ?>; color: <?= $i === 1 ? '#fff' : '#06b6d4' ?>; border-radius: 6px; cursor: pointer; font-weight: bold;">
            <?= $i ?>
        </button>
    <?php endfor; ?>
</div>`,
    filename: 'pagination.php',
    terminalOutput: `<!DOCTYPE html>
<html>
<head>
    <style>
        .page-wrap { font-family: sans-serif; display: flex; align-items: center; gap: 10px; padding: 1rem; background: #ecfeff; border-radius: 12px; border: 1.5px solid #a5f3fc; width: fit-content; }
        .btn { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border: 1px solid #06b6d4; border-radius: 8px; font-weight: 800; color: #06b6d4; background: white; }
        .active { background: #06b6d4; color: white; border-color: #0891b2; }
    </style>
</head>
<body>
    <div class="page-wrap">
        <div class="btn active">1</div>
        <div class="btn">2</div>
        <div class="btn">3</div>
        <div class="btn">4</div>
        <div class="btn">5</div>
    </div>
</body>
</html>`,
  },

  {
    chapter: 'data', id: 'PH3-S4', accent: '#22d3ee',
    section: '4. While Loops',
    title: 'Conditional Loops (While)', subtitle: 'Repeating While a Condition is True',
    icon: RotateCcw,
    concepts: [
      { label: 'Continuous Check', desc: 'The loop body repeats as long as the expressions evaluates to TRUE ─ checked at START .' },
      { label: 'Breaking the Loop', desc: 'The logic inside MUST eventually make the condition FALSE ─ otherwise you get an "Infinite Loop" !' },
      { label: 'Searching Data', desc: 'Useful for tasks where you don\'t know the count, like reading lines from a text file or database record stream .' },
    ],
    variables: [
      { label: '$running', desc: 'Boolean flag or counter used to determine if the cycle should continue.' },
      { label: '$status', desc: 'Dynamic state checked at the top of every loop iteration.' },
    ],
    tip: 'While loops are dangerous ─ always make sure your counter increments $i++ to avoid crashing the server !',
    lab: 'Build countdown.php ─ start at 5 and use a while loop to display a status message until 0.',
    result: 'Browser shows a vertical status log counting down from 5 to 1 using while logic .',
    outputType: 'browser',
    code: `<?php
$count = 5;
?>
<div style="font-family: sans-serif; border-left: 3px solid #06b6d4; padding-left: 1rem;">
    <?php while ($count > 0): ?>
        <p style="margin: 4px 0; color: #164e63;">
            Processing step: <strong>#<?= $count ?></strong>
        </p>
        <?php $count--; ?>
    <?php endwhile; ?>
    <p style="color: #0891b2; font-weight: bold; margin-top: 10px;">✅ Process Finished!</p>
</div>`,
    filename: 'countdown.php',
    terminalOutput: `<!DOCTYPE html>
<html>
<head>
    <style>
        .log-box { font-family: monospace; background: #083344; color: #22d3ee; padding: 20px; border-radius: 12px; max-width: 300px; box-shadow: 0 10px 15px rgba(0,0,0,0.15); border: 2px solid #0e7490; }
        .entry { margin-bottom: 6px; display: flex; gap: 10px; font-size: 13px; }
        .num { opacity: 0.5; }
    </style>
</head>
<body>
    <div class="log-box">
        <div style="font-size: 10px; font-weight: 800; margin-bottom: 12px; color: #06b6d4">SYSTEM WHILE_LOOP TRACE</div>
        <div class="entry"><span class="num">[5]</span> OK: Signal Active</div>
        <div class="entry"><span class="num">[4]</span> OK: Signal Active</div>
        <div class="entry"><span class="num">[3]</span> OK: Signal Active</div>
        <div class="entry"><span class="num">[2]</span> OK: Signal Active</div>
        <div class="entry"><span class="num">[1]</span> OK: Signal Active</div>
        <div style="margin-top: 12px; border-top: 1px solid #164e63; padding-top: 8px; color: #fff; font-weight: 800">>>> DONE.</div>
    </div>
</body>
</html>`,
  },

  {
    chapter: 'data', id: 'PH3-S5', accent: '#22d3ee',
    section: '5. Do While Loops',
    title: 'Post-Test Loops (Do While)', subtitle: 'Execute First, Check Condition Later',
    icon: RotateCcw,
    concepts: [
      { label: 'Guaranteed Execution', desc: 'The code inside the "do" block always runs at least ONCE before the condition is even checked .' },
      { label: 'Condition at Bottom', desc: 'while ($cond) is at the end ─ perfect for tasks that need an initial try (e.g., initial DB attempt) .' },
      { label: 'Retry Logic', desc: 'Used for scenarios like "Try to connect once, then repeat while connection is missing" pattern .' },
    ],
    variables: [
      { label: '$attempts', desc: 'Numeric tracker showing how many times the block has been triggered.' },
    ],
    tip: 'Use do-while when you need your UI to render at least once, even if the data set happens to be empty .',
    lab: 'Build retry-ui.php ─ use do-while to render a "Connecting..." message that repeats until a limit is hit.',
    result: 'Browser displays "Attempt 1" even if the condition is false from the start.',
    outputType: 'browser',
    code: `<?php
$attempts = 0;
?>
<div style="font-family: sans-serif; background: #f0fdfa; border: 1px solid #5eead4; padding: 1.5rem; border-radius: 12px; max-width: 320px;">
    <?php do { ?>
        <div style="font-weight: bold; color: #0d9488; margin-bottom: 5px;">
            Attempting Connection: #<?= ++$attempts ?>
        </div>
    <?php } while ($attempts < 3); ?>
</div>`,
    filename: 'retry.php',
    terminalOutput: `<!DOCTYPE html>
<html>
<head>
    <style>
        .retry-status { font-family: sans-serif; background: white; border-left: 4px solid #0d9488; padding: 1rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(13, 148, 136, 0.1); width: 280px; }
        .item { padding: 8px 0; border-bottom: 1px solid #f0fdfa; font-size: 14px; color: #0f766e; }
    </style>
</head>
<body>
    <div class="retry-status">
        <div style="font-size: 10px; font-weight: 900; margin-bottom: 10px; color: #14b8a6">INITIALIZING BOOTSTRAP</div>
        <div class="item">✓ Attempt #1: Logic Core</div>
        <div class="item">✓ Attempt #2: Logic Core</div>
        <div class="item" style="border:none">✓ Attempt #3: Logic Core</div>
    </div>
</body>
</html>`,
  },

  /* ══════════════════════════════════════════════════════
     CHAPTER 4: OOP FUNDAMENTALS
  ══════════════════════════════════════════════════════ */
  {
    chapter: 'oop', id: 'PH4-S1', accent: '#c084fc',
    section: '1. PHP Classes',
    title: 'OOP in Web Applications', subtitle: 'Classes, Models & Reusable Components',
    icon: Box,
    concepts: [
      {
        label: 'Model Class = Database Table', desc: 'class Post { } represents posts table ─ methods like find(), create(), delete() ─ data access layer .',
      },
      {
        label: 'Constructor Injection', desc: '__construct(PDO $db) ─ pass database connection in ─ testable, flexible, reusable model class .',
      },
      {
        label: 'Encapsulation for Web', desc: 'private $pdo ─ hide implementation details ─ expose only what callers need ─ public API for controllers .',
      },
      {
        label: 'Object to HTML', desc: '$post->title in template ─ $user->getAvatarUrl() returns web path ─ objects carry web-ready data .',
      },
      { label: 'OOP Benefits', desc: '- Data and logic grouped in classes - Reusable Database Models - Easier to maintain large apps ' },
    ],
    variables: [
      { label: '$p1, $p2', desc: 'Constructed instances (objects) of the Product class blueprint.' },
      { label: '$this', desc: 'Internal reference to the current object instance within class methods.' },
      { label: '__construct', desc: 'Magic method called automatically when creating a new object.' },
    ],
    tip: 'Model class = re-usable data layer ─ controller calls $postModel->getLatest(10) ─ view loops results ─ MVC .',
    lab: 'Build Product model class ─ instantiate objects ─ render their details in a styled object inspector.',
    result: 'Browser displays an Object Inspector showing live properties of the PHP objects.',
    outputType: 'browser',
    code: `<?php
class Product {
    public string $name;
    public float $price;
    public string $status;

    public function __construct(string $name, float $price) {
        $this->name = $name;
        $this->price = $price;
        $this->status = "In Stock";
    }

    public function formatPrice() {
        return "$" . number_format($this->price, 2);
    }
}

$p1 = new Product("MacBook Pro", 1999.00);
$p2 = new Product("iPhone 15", 999.50);
?>
<div style="font-family: sans-serif; background: #faf5ff; border: 2px solid #e9d5ff; padding: 2rem; border-radius: 20px; max-width: 400px;">
    <h3 style="color: #7c3aed; margin-top: 0;">Object Inspector</h3>
    <div style="background: white; padding: 15px; border-radius: 12px; border: 1px solid #ddd6fe; margin-bottom: 15px;">
        <div style="font-size: 11px; color: #a855f7; font-weight: 800;">OBJECT: Product</div>
        <div style="font-size: 18px; font-weight: bold;"><?= $p1->name ?></div>
        <div style="color: #6d28d9;"><?= $p1->formatPrice() ?></div>
    </div>
</div>`,
    filename: 'Product.php',
    terminalOutput: `<!DOCTYPE html>
<html>
<head>
    <style>
        .oop-browser { font-family: sans-serif; max-width: 380px; background: #fdfaff; border-radius: 24px; border: 1.5px solid #e9d5ff; overflow: hidden; box-shadow: 0 20px 40px rgba(124, 58, 237, 0.05); }
        .header { background: #7c3aed; color: white; padding: 1.5rem; display: flex; align-items: center; gap: 12px; }
        .body { padding: 1.5rem; }
        .obj-card { background: white; border-radius: 16px; border: 1px solid #ddd6fe; padding: 1rem; margin-bottom: 1rem; position: relative; overflow: hidden; }
        .prop { display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0; border-top: 1px dashed #f3e8ff; margin-top: 8px; }
    </style>
</head>
<body>
    <div class="oop-browser">
        <div class="header"><h4 style="margin:0">PHP Object Memory</h4></div>
        <div class="body">
            <div class="obj-card">
                <div style="font-weight:800; color:#4c1d95; margin-bottom:12px">MacBook Pro</div>
                <div class="prop"><span style="color:#6b7280">$price</span><span>1999.00</span></div>
            </div>
        </div>
    </div>
</body>
</html>`,
  },

  {
    chapter: 'oop', id: 'PH4-S2', accent: '#c084fc',
    section: '2. Encapsulation',
    title: 'Data Encapsulation', subtitle: 'Protecting Object Internal State',
    icon: ShieldCheck,
    concepts: [
      { label: 'Bundling State', desc: 'Group data (properties) and behavior (methods) inside one class black box .' },
      { label: 'Access Control', desc: 'Use private properties to hide internal data ─ protect variables from illegal external access .' },
      { label: 'Gatekeepers (Get/Set)', desc: 'Public methods (getters/setters) validate and control how data is read or modified .' },
      { label: 'Authorized Entry', desc: 'External code interacts with the object only through authorized, safe method interfaces .' },
    ],
    variables: [
      { label: 'private $balance', desc: 'Sensitive property that cannot be modified directly from outside the class.' },
      { label: 'public getBalance()', desc: 'Secure method providing controlled read access to private data.' },
    ],
    tip: 'Rule: Properties should be private by default ─ only expose them through public methods for safety !',
    lab: 'Build Account.php ─ create a class with private balance ─ add deposit/withdraw logic with validation.',
    result: 'Object inspector shows private property inaccessible directly ─ modification only via method logic .',
    outputType: 'browser',
    code: `<?php
class Account {
    private float $balance = 0;
    
    public function deposit(float $amount) {
        if($amount > 0) $this->balance += $amount;
    }
    
    public function getBalance() {
        return "$" . number_format($this->balance, 2);
    }
}

$bank = new Account();
$bank->deposit(2500.75);
?>
<div style="font-family: sans-serif; background: #faf5ff; padding: 1.5rem; border-radius: 12px; border: 2px solid #e9d5ff; max-width: 320px;">
    <h3 style="color: #7c3aed; margin-top: 0;">Bank Vault</h3>
    <div style="background: #fff; padding: 15px; border-radius: 8px; border: 1px solid #ddd6fe;">
        <p style="font-size: 0.8rem; color: #6b7280; text-transform: uppercase;">Private Balance</p>
        <p style="font-size: 24px; font-weight: 800; color: #4c1d95; margin: 0;"><?= $bank->getBalance() ?> 🔐</p>
    </div>
</div>`,
    filename: 'Account.php',
    terminalOutput: `<!DOCTYPE html>
<html>
<head>
    <style>
        .encap-card { font-family: sans-serif; max-width: 300px; padding: 2rem; background: #fdfaff; border: 1.5px solid #e9d5ff; border-radius: 20px; text-align: center; }
        .vault { font-size: 40px; margin-bottom: 1rem; }
        .lock-status { background: #fee2e2; color: #dc2626; font-size: 10px; font-weight: 900; padding: 4px 10px; border-radius: 20px; display: inline-block; margin-bottom: 1rem; }
    </style>
</head>
<body>
    <div class="encap-card">
        <div class="lock-status">SECURITY: PRIVATE</div>
        <div class="vault">🏦</div>
        <h3 style="color:#4c1d95; margin:0">Status: Protected</h3>
        <p style="font-size:13px; color:#6b7280">Internal balance variable is invisible to global scope.</p>
    </div>
</body>
</html>`,
  },

  {
    chapter: 'oop', id: 'PH4-S3', accent: '#c084fc',
    section: '3. Abstraction',
    title: 'Code Abstraction', subtitle: 'Exposing Interface, Hiding Complexity',
    icon: Code2,
    concepts: [
      { label: 'Simplification', desc: 'Hide complex implementation details ─ user only sees essential public functionality .' },
      { label: 'Abstract Classes', desc: 'Blueprints that cannot be instantiated ─ force child classes to follow a specific structure .' },
      { label: 'Interface Only', desc: 'Defines WHAT methods are needed ─ like a coffee machine button interface ─ logic stays hidden .' },
      { label: 'System Contract', desc: "Guarantee that specific functionality exists without knowing how it's executed technically ." },
    ],
    variables: [
      { label: 'abstract class Auth', desc: 'Generic template for all login methods in the system.' },
      { label: 'interface Logger', desc: 'Contract ensuring any logger has a log() method.' },
    ],
    tip: 'Think of Abstraction as a remote control ─ you press "Power" button without knowing the internal wiring .',
    lab: 'Interface Check ─ create a Logger interface ─ implement it for both Database and File logging.',
    result: 'Objects maintain different logic but share the exact same method signature .',
    outputType: 'browser',
    code: `<?php
interface Logger {
    public function log(string $msg);
}

class DatabaseLogger implements Logger {
    public function log(string $msg) {
        return "Saving to MySQL: " . $msg;
    }
}

$logger = new DatabaseLogger();
?>
<div style="font-family: sans-serif; background: #ecfeff; border-radius: 12px; padding: 1.5rem; border: 2px solid #a5f3fc; max-width: 320px;">
    <p style="font-size: 11px; font-weight: 800; color: #0891b2;">INTERFACE: Logger</p>
    <div style="background: white; padding: 10px; border-radius: 8px; font-family: monospace; border: 1px solid #bae6fd;">
        <?= $logger->log("User logged in") ?>
    </div>
</div>`,
    filename: 'Logger.php',
    terminalOutput: `<!DOCTYPE html>
<html>
<head>
    <style>
        .abstract-ui { font-family: sans-serif; padding: 2rem; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; }
        .layer { background: #fff; padding: 12px; border-radius: 8px; border: 1px solid #e0f2fe; margin-top: 10px; font-size: 13px; }
        .badge { font-size: 9px; font-weight: 800; color: #0891b2; background: #cffafe; padding: 2px 6px; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="abstract-ui">
        <span class="badge">SYSTEM INTERFACE</span>
        <div class="layer">⚙️ Log Handler Initialized...</div>
    </div>
</body>
</html>`,
  },

  {
    chapter: 'oop', id: 'PH4-S4', accent: '#c084fc',
    section: '4. Inheritance',
    title: 'Inherit & Re-use', subtitle: 'Extending Properties and Methods',
    icon: RotateCcw,
    concepts: [
      { label: 'Reusable Templates', desc: 'New classes (subclasses) copy properties/methods from existing ones (parent) .' },
      { label: 'Extends Keyword', desc: 'Use class Admin extends Member to inherit all member profile features automatically .' },
      { label: 'Is-A Relationship', desc: 'An Admin "is a" Member with extra privileges ─ hierarchical system organization .' },
      { label: 'Scalability', desc: 'Update a parent class to fix or upgrade every child class in the entire application instantly .' },
    ],
    variables: [
      { label: 'extends User', desc: 'Link establishing the inheritance from a base user class.' },
      { label: 'parent::__construct()', desc: 'Calls the constructor of the parent class from the child.' },
    ],
    tip: 'Inheritance prevents "Copy-Paste" code ─ put common logic in the parent and unique logic in children .',
    lab: 'Extend User class ─ create a SuperAdmin class that adds a unique manageSystem() capability.',
    result: 'SuperAdmin object shows both User properties (name) AND its own unique methods.',
    outputType: 'browser',
    code: `<?php
class User {
    public $name = "Basic User";
}

class Admin extends User {
    public $permissions = "ALL_ACCESS";
}

$admin = new Admin();
?>
<div style="font-family: sans-serif; padding: 1.5rem; background: #fef2f2; border: 2.5px solid #fecdd3; border-radius: 16px; max-width: 320px;">
    <h4 style="color: #9f1239; margin-top: 0;">Inheritance Trace</h4>
    <div style="background: white; border-radius: 10px; padding: 12px; border: 1px solid #fda4af;">
        <span style="font-size: 11px; color: #e11d48; font-weight: bold;">OBJECT: Admin</span>
        <p>Name (from User): <b><?= $admin->name ?></b></p>
        <p>Permissions: <b><?= $admin->permissions ?></b></p>
    </div>
</div>`,
    filename: 'Inheritance.php',
    terminalOutput: `<!DOCTYPE html>
<html>
<head>
    <style>
        .inherit-box { font-family: sans-serif; padding: 2rem; background: #fff1f2; border: 1.5px solid #fecdd3; border-radius: 16px; width: 280px; }
        .node { padding: 10px; border: 1px solid #fda4af; background: white; border-radius: 8px; margin-bottom: 20px; position: relative; }
        .line { width: 2px; height: 20px; background: #fecdd3; margin: -20px auto 0; }
    </style>
</head>
<body>
    <div class="inherit-box">
        <div class="node" style="text-align:center">Class: User</div>
        <div class="line"></div>
        <div class="node" style="text-align:center; background:#fecdd3; border-color:#f43f5e">Class: Admin</div>
    </div>
</body>
</html>`,
  },

  {
    chapter: 'oop', id: 'PH4-S5', accent: '#c084fc',
    section: '5. Polymorphism',
    title: 'Multiple Forms', subtitle: 'Same Interface, Different Behavior',
    icon: Box,
    concepts: [
      { label: 'Method Overriding', desc: 'Child classes redefine parent methods to perform unique, specialized logic .' },
      { label: 'Single Interface', desc: 'Call draw() on a list of shapes ─ each shape knows how to draw itself differently .' },
      { label: 'Flexibility', desc: 'Add new types to your system without changing the code that calls their methods .' },
      { label: 'Dynamic Action', desc: "The exact logic executed is decided based on the object's type at runtime ." },
    ],
    variables: [
      { label: '$shapes[]', desc: 'Collection containing different object types (Circle, Square) sharing a common method.' },
    ],
    tip: 'Polymorphism allows your code to say: "Every shape should draw!" without knowing how to draw a Circle .',
    lab: 'Polymorphic Shapes ─ create Circle and Square classes ─ call getArea() on an array of shapes.',
    result: 'Single loop calls getArea() ─ different math is executed for each object automatically .',
    outputType: 'browser',
    code: `<?php
class Shape { public function draw() { return "Generic Shape"; } }
class Circle extends Shape { public function draw() { return "Drawing ⭕"; } }
class Square extends Shape { public function draw() { return "Drawing 🟦"; } }

$shapes = [new Circle(), new Square()];
?>
<div style="font-family: sans-serif; background: #fdf4ff; border-radius: 16px; padding: 1.5rem; border: 2px solid #f5d0fe; max-width: 320px;">
    <h4 style="color: #86198f; margin-top: 0;">Polymorphic UI</h4>
    <?php foreach($shapes as $s): ?>
        <div style="background: white; padding: 10px; border-radius: 8px; margin-top: 10px; color: #a21caf; border: 1px solid #f0abfc;">
            <?= $s->draw() ?>
        </div>
    <?php endforeach; ?>
</div>`,
    filename: 'Polymorphism.php',
    terminalOutput: `<!DOCTYPE html>
<html>
<head>
    <style>
        .poly-ui { font-family: sans-serif; padding: 2rem; background: #faf5ff; border: 1px solid #f3e8ff; border-radius: 12px; display: flex; gap: 1rem; }
        .box { width: 60px; height: 60px; background: white; border: 2px solid #d8b4fe; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
    </style>
</head>
<body>
    <div class="poly-ui">
        <div class="box">⭕</div>
        <div class="box">🟦</div>
        <div class="box">🔺</div>
    </div>
</body>
</html>`,
  },

  /* ══════════════════════════════════════════════════════
     CHAPTER 5: FORMS & VALIDATION
  ══════════════════════════════════════════════════════ */
  {
    chapter: 'forms', id: 'PH5-S1', accent: '#fb923c',
    section: '1. Web Forms',
    title: 'HTML Forms with PHP', subtitle: 'Receive and Process User Input',
    icon: Layout,
    concepts: [
      {
        label: 'POST vs GET for Web Forms', desc: 'GET = URL params (search/filter) ─ bookmarkable ─ visible ។ POST = form body (login/create) ─ hidden ─ for data changes .',
      },
      {
        label: '$_POST Superglobal', desc: '$_POST["email"] accesses submitted form data ─ always validate before using ─ POST is NOT automatically safe .',
      },
      {
        label: 'Form Handling Pattern', desc: 'if ($_SERVER["REQUEST_METHOD"] === "POST") { process } else { show form } ─ single file handles both .',
      },
      {
        label: 'old() Pattern (Sticky Forms)', desc: '$old = $_POST ?? [] ─ pre-fill form fields after validation error ─ better UX ─ user doesn\'t retype everything .',
      },
    ],
    variables: [
      { label: '$_GET', desc: 'Superglobal used to read data submitted via the browser address bar.' },
      { label: '$_POST', desc: 'Superglobal used to receive sensitive or state-changing form data.' },
    ],
    tip: 'Self-processing form: same URL shows empty form (GET) and processes submission (POST) ─ clean single-file pattern .',
    lab: 'Build a contact form ─ name, email, message ─ POST to same page ─ validate and show success/error .',
    result: 'Form submits → PHP validates → success message shown or error with sticky field values .',
    outputType: 'browser',
    code: `<?php
$error = "";
$name = "";

// Only process if form was submitted
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = $_POST["name"] ?? "";
    if (empty($name)) {
        $error = "Name is required to continue!";
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <style>
        .form-card { font-family: sans-serif; max-width: 320px; padding: 2rem; background: #fff; border-radius: 12px; }
        .field { margin-bottom: 12px; }
        label { display: block; font-size: 0.75rem; font-weight: 700; color: #64748b; margin-bottom: 4px; }
        input, textarea { width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; box-sizing: border-box; }
        button { width: 100%; background: #fb923c; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 800; cursor: pointer; }
        .error-msg { color: #f43f5e; font-size: 0.7rem; margin-top: 4px; font-weight: 600; }
    </style>
</head>
<body>
    <div class="form-card">
        <h3 style="margin-top:0">Contact Us</h3>
        <form method="POST">
            <div class="field">
                <label>Name</label>
                <input name="name" value="<?= htmlspecialchars($name) ?>" placeholder="Your Name">
                <?php if ($error): ?><div class="error-msg"><?= $error ?></div><?php endif; ?>
            </div>
            <div class="field">
                <label>Email Address</label>
                <input name="email" placeholder="email@example.com">
            </div>
            <div class="field">
                <label>Message</label>
                <textarea name="message" rows="3" placeholder="How can we help?"></textarea>
            </div>
            <button type="submit">Send Message</button>
        </form>
    </div>
</body>
</html>`,
    filename: 'contact.php',
    terminalOutput: `<!DOCTYPE html>
<html>
<head>
    <style>
        .form-card { font-family: sans-serif; max-width: 320px; padding: 2rem; background: #fff; border-radius: 12px; }
        .field { margin-bottom: 12px; }
        label { display: block; font-size: 0.75rem; font-weight: 700; color: #64748b; margin-bottom: 4px; }
        input, textarea { width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; box-sizing: border-box; }
        button { width: 100%; background: #fb923c; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 800; cursor: pointer; transition: 0.2s opacity; }
        button:disabled { opacity: 0.6; cursor: not-allowed; }
        .error-msg { color: #f43f5e; font-size: 0.7rem; font-weight: 600; margin-top: 4px; }
    </style>
</head>
<body>
    <div class="form-card">
        <h3 style="margin-top:0;color:#1e293b">Contact Form</h3>
        <form id="demoForm">
            <div class="field" id="nameField">
                <label>Name</label>
                <input name="name" placeholder="Your Name">
            </div>
            <div class="field" id="emailField">
                <label>Email Address</label>
                <input name="email" placeholder="email@example.com">
            </div>
            <div class="field">
                <label>Message</label>
                <textarea name="message" rows="3" placeholder="How can we help?"></textarea>
            </div>
            <button type="submit">Send Message</button>
        </form>
    </div>
    <script>
        document.getElementById("demoForm").onsubmit = (e) => {
            e.preventDefault();
            const btn = e.target.querySelector("button");
            btn.textContent = "Processing...";
            btn.disabled = true;
            
            setTimeout(() => {
                const name = e.target.name.value.trim();
                const email = e.target.email.value.trim();
                
                document.querySelectorAll(".error-msg").forEach(m => m.remove());

                if (!name || !email) {
                    btn.textContent = "Send Message";
                    btn.disabled = false;
                    if (!name) {
                        const err = document.createElement("div");
                        err.className = "error-msg";
                        err.innerHTML = "<b>⚠️ Validation Error:</b> Name is required";
                        document.getElementById("nameField").appendChild(err);
                    }
                    if (!email) {
                        const err = document.createElement("div");
                        err.className = "error-msg";
                        err.innerHTML = "<b>⚠️ Validation Error:</b> Email is required";
                        document.getElementById("emailField").appendChild(err);
                    }
                } else {
                    document.body.innerHTML = \`<div class="form-card" style="text-align:center;font-family:sans-serif;padding:3rem 2rem;background:#fff;border-radius:12px;max-width:320px;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1)">
                        <div style="color:#10b981;font-size:48px;margin-bottom:16px">✓</div>
                        <h2 style="margin-top:0;color:#1e293b">Message Sent!</h2>
                        <p style="color:#64748b;font-size:14px;line-height:1.6;margin-bottom:20px">The PHP server has successfully processed your POST data.</p>
                        <button onclick="window.location.reload()" style="background:#fb923c;color:white;border:none;padding:12px 24px;border-radius:8px;font-weight:800;cursor:pointer">Back to Form</button>
                    </div>\`;
                }
            }, 800);
        };
    </script>
</body>
</html>`,
  },

  {
    chapter: 'forms', id: 'PH5-S2', accent: '#fb923c',
    section: '2. Validation',
    title: 'Validation & XSS Prevention', subtitle: 'Secure Every Web Form Input',
    icon: ShieldCheck,
    concepts: [
      {
        label: 'Server-Side Validation', desc: 'Client-side JS validation is UX only ─ NEVER trust it ─ always re-validate server-side ─ users can disable JS .',
      },
      {
        label: 'htmlspecialchars() on Output', desc: 'Encode before printing to HTML ─ <script> → &lt;script&gt; ─ prevents XSS ─ applied to EVERY user value .',
      },
      {
        label: 'filter_var() Validators', desc: 'FILTER_VALIDATE_EMAIL, FILTER_VALIDATE_INT, FILTER_VALIDATE_URL ─ built-in validators ─ use them .',
      },
      {
        label: 'CSRF Token for Forms', desc: 'Hidden token in form ─ validate on POST ─ prevents cross-site request forgery ─ essential for state-changing forms .',
      },
    ],
    tip: 'Sanitize on INPUT (strip dangerous chars) ─ Escape on OUTPUT (htmlspecialchars) ─ two different steps .',
    lab: 'Add CSRF token to contact form ─ validate token on submit ─ reject if missing/wrong .',
    result: 'Form protected against CSRF ─ any forged cross-site submission gets 403 response .',
    code: `<?php
session_start();
$csrf = $_SESSION['csrf'] ?? "token123";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if ($_POST['csrf'] !== $csrf) {
        die("CSRF Token Invalid 🛡️");
    }
    $name = htmlspecialchars($_POST['name'] ?? '');
    echo "Processing for: " . $name;
}
?>
<!DOCTYPE html>
<html>
<head>
    <style>
        .form-box { max-width: 400px; padding: 2.5rem; background: white; border-top: 4px solid #f97316; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        .input { width: 100%; padding: 12px; margin-bottom: 20px; border: 1.5px solid #fed7aa; border-radius: 6px; box-sizing: border-box; }
        .btn { background: #f97316; color: white; border: none; padding: 14px; border-radius: 6px; width: 100%; font-weight: bold; }
    </style>
</head>
<body>
    <div class="form-box">
        <h3 style="margin-top:0">Secure Contact</h3>
        <form method="POST">
            <input name="csrf" type="hidden" value="<?= $csrf ?>">
            <input name="name" class="input" placeholder="Your Name">
            <button class="btn">Validated Submit</button>
        </form>
    </div>
</body>
</html>`,
    filename: 'contact.php',
    outputType: 'browser',
    terminalOutput: `<!DOCTYPE html>
<html>
<head>
    <style>
        .form-box { font-family: sans-serif; max-width: 320px; padding: 2.5rem; background: white; border-top: 4px solid #f97316; border-radius: 12px; box-shadow: 0 10px 25px -10px rgba(0,0,0,0.1); }
        h3 { color: #c2410b; margin-top: 0; font-size: 1.25rem; }
        .input-group { margin-bottom: 1.5rem; }
        label { display: block; font-size: 0.75rem; font-weight: 800; color: #9a3412; margin-bottom: 6px; text-transform: uppercase; }
        .input { width: 100%; padding: 12px; border: 1.5px solid #fed7aa; border-radius: 8px; font-size: 14px; box-sizing: border-box; transition: 0.2s; outline: none; }
        .input:focus { border-color: #f97316; box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.1); }
        .btn { background: #f97316; color: white; border: none; padding: 14px; border-radius: 10px; width: 100%; cursor: pointer; font-weight: 800; font-size: 0.9rem; transition: 0.2s; }
        .btn:hover { background: #ea580c; transform: translateY(-1px); }
        .btn:active { transform: translateY(0); }
        .status-badge { display: inline-block; padding: 4px 10px; background: #fff7ed; color: #c2410b; border-radius: 6px; font-size: 10px; font-weight: 900; margin-bottom: 20px; border: 1px solid #ffedd5; }
    </style>
</head>
<body>
    <div class="form-box" id="content">
        <div class="status-badge">🛡️ CSRF PROTECTION ACTIVE</div>
        <h3>Secure Form</h3>
        <form id="secureForm">
            <input name="csrf" type="hidden" value="token123">
            <div class="input-group">
                <label>Verification Token</label>
                <input class="input" style="background:#f8fafc; color:#94a3b8" value="token123" readonly>
            </div>
            <div class="input-group">
                <label>Your Name</label>
                <input id="nameInput" name="name" class="input" placeholder="Enter name...">
            </div>
            <button type="submit" class="btn">Validated Submit</button>
        </form>
    </div>
    <script>
        document.getElementById("secureForm").onsubmit = (e) => {
            e.preventDefault();
            const btn = e.target.querySelector("button");
            const name = document.getElementById("nameInput").value;
            
            btn.textContent = "Verifying CSRF...";
            btn.disabled = true;
            
            setTimeout(() => {
                if (!name) {
                    btn.textContent = "Validated Submit";
                    btn.disabled = false;
                    alert("⚠️ PHP Error: Submission rejected. Validation failed - Name cannot be empty.");
                    return;
                }
                
                document.getElementById("content").innerHTML = \`<div style="text-align:center; padding: 1rem 0">
                    <div style="background:#f0fdf4; color:#166534; padding:2rem; border-radius:12px; border:1.5px solid #bbf7d0">
                        <div style="font-size:40px; margin-bottom:12px">✅</div>
                        <h3 style="color:#14532d; margin:0 0 10px">Securely Processed</h3>
                        <p style="font-size:13px; color:#166534; line-height:1.6">The PHP server verified the <b>CSRF token</b> and sanitized your input successfully.</p>
                        <div style="background:#fff; border-radius:8px; padding:12px; margin-top:1.5rem; text-align:left; border:1px solid #dcfce7; font-family:monospace; font-size:11px">
                            <b style="color:#15803d">Sanitized Output:</b><br>
                            &lt;?php echo htmlspecialchars("\${name}"); ?&gt;
                        </div>
                        <button onclick="window.location.reload()" style="background:#16a34a; color:white; border:none; padding:10px 24px; border-radius:8px; margin-top:2rem; font-weight:800; cursor:pointer">Back To Form</button>
                    </div>
                </div>\`;
            }, 1000);
        };
    </script>
</body>
</html>`,
  },

  /* ══════════════════════════════════════════════════════
     CHAPTER 6: DATABASE (PDO)
  ══════════════════════════════════════════════════════ */
  {
    chapter: 'db', id: 'PH6-S1', accent: '#38bdf8',
    section: '1. Database',
    title: 'MySQL Connection with PDO', subtitle: 'Connecting PHP to MySQL Database',
    icon: HardDrive,
    concepts: [
      { label: 'PDO (PHP Data Objects)', desc: 'Standard database interface ─ works with MySQL, PostgreSQL, etc. ─ consistent API ─ error modes ─ prepared statements .' },
      { label: 'DSN (Data Source Name)', desc: '"mysql:host=localhost;dbname=db" ─ connection string ─ type of driver + server location + database name .' },
      { label: 'try/catch for Connect', desc: 'DB connection can fail (server down/wrong password) ─ wrap in try/catch to handle errors gracefully .' },
      { label: 'Persistent Connections', desc: 'Reuse connection across requests ─ performance win ─ singleton or static property in config class .' },
    ],
    tip: 'Create db.php once, require_once "db.php" everywhere ─ single connection point ─ easy to swap DB later .',
    lab: 'Create db.php with PDO connection ─ require it in index.php ─ fetch first 5 posts from posts table .',
    result: 'Web page renders posts list fetched live from MySQL database .',
    code: `<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=pdev", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected successfully to Database! ✅";
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
?>`,
    filename: 'db.php',
    outputType: 'browser',
    terminalOutput: `<!DOCTYPE html>
<html>
<head>
    <style>
        .connect-card { font-family: sans-serif; max-width: 380px; padding: 2.5rem; background: #f0f9ff; border: 1.5px solid #bae6fd; border-radius: 16px; text-align: center; box-shadow: 0 10px 25px -10px rgba(0,0,0,0.05); }
        .icon { width: 48px; height: 48px; background: #38bdf8; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 24px; box-shadow: 0 4px 12px rgba(56, 189, 248, 0.3); }
        .badge { display: inline-block; padding: 6px 12px; background: #0ea5e9; color: white; border-radius: 20px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem; }
        h3 { margin: 0 0 0.5rem; color: #0369a1; font-size: 1.25rem; }
        p { color: #64748b; font-size: 0.9rem; margin-bottom: 2rem; line-height: 1.6; }
        .details { background: #fff; padding: 1rem; border-radius: 10px; border: 1px solid #e0f2fe; text-align: left; font-family: monospace; font-size: 0.8rem; color: #0c4a6e; }
    </style>
</head>
<body>
    <div class="connect-card">
        <div class="icon">🔌</div>
        <div class="badge">Connection Active</div>
        <h3>Success! Database Linked</h3>
        <p>PHP has established a secure PDO session with your local MySQL server.</p>
        <div class="details">
            Host: localhost<br>
            DB: pdev_main<br>
            User: root@localhost<br>
            Status: ATTR_ERRMODE_EXCEPTION
        </div>
    </div>
</body>
</html>`,
  },

  {
    chapter: 'db', id: 'PH6-S2', accent: '#38bdf8',
    section: '2. Prepared Statements',
    title: 'Web CRUD with PDO', subtitle: 'Create, Read, Update, Delete via Browser',
    icon: Database,
    concepts: [
      { label: 'Read → Render Logic', desc: 'fetchAll() → foreach logic ─ process data for display on web page .' },
      { label: 'Create → INSERT Logic', desc: 'Data → validate → prepare("INSERT INTO posts...") → execute() .' },
      { label: 'Update → UPDATE Logic', desc: 'ID → SELECT row → process → UPDATE WHERE id = ? .' },
      { label: 'Delete → DELETE Logic', desc: 'ID → confirm → DELETE WHERE id = ? .' },
    ],
    tip: 'Always use prepare() + execute() ─ NEVER concatenate variables into SQL strings ─ SQL injection prevention ！',
    lab: 'Build add-post logic ─ take title + content ─ INSERT into posts table .',
    result: 'PHP logic saves post to MySQL ─ prevents SQL injection automatically .',
    code: `<?php
$success = false;
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $stmt = $pdo->prepare("INSERT INTO posts (title) VALUES (:title)");
    $stmt->execute([':title' => $_POST['title'] ?? 'Untitled']);
    $success = true;
}
?>
<!DOCTYPE html>
<html>
<head>
    <style>
        .db-form { font-family: sans-serif; max-width: 320px; padding: 2rem; background: #fff; border-radius: 12px; }
        .alert { padding: 1rem; background: #dcfce7; color: #166534; border-radius: 8px; font-weight: 600; font-size: 0.9rem; margin-bottom: 1.5rem; }
        input { width: 100%; padding: 12px; border: 1.5px solid #bae6fd; border-radius: 10px; margin-bottom: 12px; box-sizing: border-box; outline: none; }
        button { width: 100%; padding: 14px; background: #38bdf8; color: white; border: none; border-radius: 10px; font-weight: 800; cursor: pointer; }
    </style>
</head>
<body>
    <div class="db-form">
        <?php if ($success): ?>
            <div class="alert">✅ Successfully saved!</div>
        <?php endif; ?>
        <form method="POST">
            <h3 style="margin-top:0; color:#0369a1">New Database Entry</h3>
            <input name="title" placeholder="Post Title">
            <button type="submit">Save to MySQL</button>
        </form>
    </div>
</body>
</html>`,
    filename: 'add-post.php',
    outputType: 'browser',
    terminalOutput: `<!DOCTYPE html>
<html>
<head>
    <style>
        .db-form { font-family: sans-serif; max-width: 320px; padding: 2rem; background: #fff; border-radius: 16px; border: 1.5px solid #bae6fd; }
        .alert { display: none; padding: 1rem; background: #dcfce7; color: #166534; border-radius: 10px; font-weight: 600; font-size: 0.9rem; margin-bottom: 1.5rem; text-align: center; }
        input { width: 100%; padding: 12px; border: 1.5px solid #bae6fd; border-radius: 10px; margin-bottom: 12px; box-sizing: border-box; outline: none; }
        button { width: 100%; padding: 14px; background: #38bdf8; color: white; border: none; border-radius: 10px; font-weight: 800; cursor: pointer; transition: 0.3s; }
        button:disabled { opacity: 0.6; }
    </style>
</head>
<body>
    <div class="db-form">
        <div id="msg" class="alert">✅ Saved to MySQL DB!</div>
        <form id="dbForm">
            <h3 style="margin-top:0; color:#0369a1">New Database Entry</h3>
            <input name="title" placeholder="Post Title">
            <button type="submit" id="btn">Save to MySQL</button>
        </form>
    </div>
    <script>
        document.getElementById("dbForm").onsubmit = (e) => {
            e.preventDefault();
            const btn = document.getElementById("btn");
            const msg = document.getElementById("msg");
            btn.textContent = "Connecting...";
            btn.disabled = true;
            
            setTimeout(() => {
                btn.textContent = "INSERT into posts...";
                setTimeout(() => {
                    msg.style.display = "block";
                    btn.textContent = "Save to MySQL";
                    btn.disabled = false;
                    e.target.reset();
                }, 1000);
            }, 800);
        };
    </script>
</body>
</html>`,
  },

  /* ══════════════════════════════════════════════════════
     CHAPTER 7: LOGIN & SESSIONS
  ══════════════════════════════════════════════════════ */
  {
    chapter: 'auth', id: 'PH7-S1', accent: '#f87171',
    section: '1. Sessions',
    title: 'Login System with Sessions', subtitle: 'Web Authentication Flow',
    icon: User,
    concepts: [
      {
        label: 'Session-Based Auth', desc: 'User logs in → server creates $_SESSION["user_id"] ─ browser stores session cookie ─ sent with every request .',
      },
      {
        label: 'Login Flow', desc: 'POST email+password → find user in DB → password_verify() → set $_SESSION → redirect to dashboard .',
      },
      {
        label: 'Protecting Web Pages', desc: 'Top of every protected page: if (!$_SESSION["user_id"]) redirect("/login.php") ─ simple but effective .',
      },
      {
        label: 'session_regenerate_id()', desc: 'Call after successful login ─ prevents session fixation attack ─ one line of code, big security win .',
      },
    ],
    tip: 'Always session_regenerate_id(true) after login ─ and session_destroy() on logout ─ session hygiene .',
    lab: 'Build login.php ─ form + POST handler ─ check DB ─ set session ─ redirect to dashboard.php .',
    result: 'Login works end-to-end ─ wrong password shows error ─ success redirects to protected dashboard .',
    code: `<?php
session_start();
$error = "";

// Mocking a login check
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = $_POST['email'] ?? "";
    $pass  = $_POST['password'] ?? "";

    if ($email === "dev@pdev.io" && $pass === "secure123") {
        $_SESSION['user'] = ['name' => 'Ratha', 'role' => 'Admin'];
        echo "Redirecting to Dashboard... 🚀";
    } else {
        $error = "Invalid Credentials!";
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <style>
        .login-card { font-family: sans-serif; max-width: 320px; padding: 2.5rem; background: #fff1f2; border-radius: 16px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
        .avatar-circle { width: 56px; height: 56px; background: #f43f5e; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 24px; font-weight: 800; }
        .field { margin-bottom: 12px; }
        label { display: block; font-size: 0.7rem; font-weight: 800; color: #9f1239; margin-bottom: 4px; text-transform: uppercase; }
        input { width: 100%; padding: 12px; border: 1.5px solid #fecdd3; border-radius: 10px; font-size: 14px; box-sizing: border-box; outline: none; }
        button { width: 100%; padding: 14px; background: #f43f5e; color: white; border: none; border-radius: 10px; font-weight: 800; cursor: pointer; }
        .error { color: #e11d48; font-size: 0.75rem; text-align: center; margin-top: 10px; font-weight: 600; }
    </style>
</head>
<body>
    <div class="login-card">
        <div class="avatar-circle">?</div>
        <?php if (!empty($_SESSION['user'])): ?>
            <div style="text-align:center">
                <h3>Welcome back, <?= $_SESSION['user']['name'] ?>!</h3>
                <p>Role: <?= $_SESSION['user']['role'] ?></p>
            </div>
        <?php else: ?>
            <form method="POST">
                <div class="field"><label>Email</label><input name="email" placeholder="dev@pdev.io"></div>
                <div class="field"><label>Password</label><input type="password" name="password" placeholder="••••••••"></div>
                <button type="submit">Sign In</button>
                <?php if ($error): ?><div class="error"><?= $error ?></div><?php endif; ?>
            </form>
        <?php endif; ?>
    </div>
</body>
</html>`,
    filename: 'login.php',
    outputType: 'browser',
    terminalOutput: `<!DOCTYPE html>
<html>
<head>
    <style>
        .login-card { font-family: sans-serif; max-width: 320px; padding: 2.5rem; background: #fff1f2; border-radius: 16px; }
        .avatar-circle { width: 56px; height: 56px; background: #f43f5e; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 24px; font-weight: 800; }
        label { display: block; font-size: 0.7rem; font-weight: 800; color: #9f1239; margin-bottom: 4px; text-transform: uppercase; }
        input { width: 100%; padding: 12px; border: 1.5px solid #fecdd3; border-radius: 10px; font-size: 14px; box-sizing: border-box; margin-bottom: 12px; }
        button { width: 100%; padding: 14px; background: #f43f5e; color: white; border: none; border-radius: 10px; font-weight: 800; cursor: pointer; transition: 0.2s; }
        button:disabled { opacity: 0.6; }
    </style>
</head>
<body>
    <div id="content">
        <div class="login-card">
            <div class="avatar-circle">?</div>
            <form id="authForm">
                <label>Email Address</label>
                <input name="email" placeholder="dev@pdev.io">
                <label>Password</label>
                <input type="password" name="password" placeholder="••••••••">
                <button type="submit" id="btn">Sign In</button>
            </form>
        </div>
    </div>
    <script>
        document.getElementById("authForm").onsubmit = (e) => {
            e.preventDefault();
            const btn = document.getElementById("btn");
            const email = e.target.email.value;
            btn.textContent = "Authenticating...";
            btn.disabled = true;

            setTimeout(() => {
                if (email === "dev@pdev.io") {
                    document.getElementById("content").innerHTML = \`<div class="login-card" style="text-align:center">
                        <div class="avatar-circle">R</div>
                        <h3 style="margin:0;color:#9f1239">Welcome back, Ratha!</h3>
                        <p style="color:#e11d48;font-size:0.8rem;font-weight:700">✓ Secure Session Established (Admin)</p>
                        <button onclick="window.location.reload()" style="background:#f43f5e;color:white;border:none;padding:10px 20px;border-radius:10px;margin-top:1.5rem;cursor:pointer">Sign Out</button>
                    </div>\`;
                } else {
                    btn.textContent = "Sign In";
                    btn.disabled = false;
                    alert("PHP Error: Invalid Credentials. Please check your email and password.");
                }
            }, 1200);
        };
    </script>
</body>
</html>`,
  },

  {
    chapter: 'auth', id: 'PH7-S2', accent: '#f87171',
    section: '2. Security',
    title: 'Password Hashing', subtitle: 'Secure Credential Storage for Web Apps',
    icon: Lock,
    concepts: [
      {
        label: 'Register: Hash Before Store', desc: '$hash = password_hash($password, PASSWORD_DEFAULT) ─ save $hash to DB, never plain password .',
      },
      {
        label: 'Login: Verify Hash', desc: 'password_verify($inputPassword, $storedHash) ─ compares safely ─ returns true/false ─ one function .',
      },
      {
        label: 'Why Not MD5/SHA1?', desc: 'MD5/SHA1 broken ─ rainbow tables crack in seconds ─ NEVER use for passwords ─ bcrypt/argon2 only .',
      },
      {
        label: 'Auto Salt in PHP', desc: 'password_hash() generates unique salt automatically ─ same password → different hash every time ─ safe .',
      },
    ],
    tip: 'Same password, different users → different hashes (random salt) ─ database breach doesn\'t reveal duplicates .',
    lab: 'Build register.php ─ hash password before INSERT ─ then verify in login.php with password_verify() .',
    result: 'DB stores "$2y$10$..." hashed password ─ login correctly verifies ─ plain text never stored .',
    code: `<?php
$hash = password_hash("mySecret123", PASSWORD_DEFAULT);
?>
<!DOCTYPE html>
<html>
<head>
    <style>
        .key { font-family: monospace; background: #f1f5f9; padding: 1rem; border-radius: 8px; word-break: break-all; color: #0f172a; }
    </style>
</head>
<body>
    <h3>Hashed Password for DB:</h3>
    <div class="key"><?= $hash ?></div>
    <p style="font-size: 0.8rem; color: #64748b;">Ready to be saved in MySQL users table.</p>
</body>
</html>`,
    filename: 'register.php',
    outputType: 'browser',
    terminalOutput: `<!DOCTYPE html>
<html>
<head>
    <style>
        .key-box { max-width: 440px; padding: 2.5rem; background: #fff; border-radius: 16px; border: 1.5px solid #fecdd3; font-family: sans-serif; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); }
        .badge { display: inline-block; padding: 5px 10px; background: #f43f5e; color: white; border-radius: 20px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; margin-bottom: 1rem; }
        h3 { margin: 0 0 1rem; color: #881337; }
        .key { font-family: 'JetBrains Mono', monospace; background: #1e293b; color: #fb7185; padding: 1.5rem; border-radius: 12px; word-break: break-all; margin: 10px 0; font-size: 0.8rem; line-height: 1.6; border: 1px solid #4c0519; }
        .info { font-size: 0.85rem; color: #9f1239; font-weight: 600; margin-top: 1rem; }
    </style>
</head>
<body>
    <div class="key-box">
        <div class="badge">Argon2id Active</div>
        <h3>Secure DB Storage</h3>
        <div class="key">$argon2id$v=19$m=65536,t=4,p=1$Zmt...pWq7...O1a2vE3r4y5t6h7i8n9g0s1e2c3u4r5e6v</div>
        <p class="info">✓ Password transformed into a irreversible one-way hash.</p>
    </div>
</body>
</html>`,
  },

  /* ══════════════════════════════════════════════════════
     CHAPTER 8: FILE UPLOADS
  ══════════════════════════════════════════════════════ */
  {
    chapter: 'files', id: 'PH8-S1', accent: '#fbbf24',
    section: '1. File Uploads',
    title: 'File Upload Web Form', subtitle: 'Profile Photos & Document Uploads',
    icon: HardDrive,
    concepts: [
      {
        label: 'enctype="multipart/form-data"', desc: 'REQUIRED attribute for file upload forms ─ without it $_FILES is empty ─ no file data received .',
      },
      {
        label: '$_FILES Superglobal', desc: '$_FILES["avatar"]["tmp_name"] ─ temporary server path ─ ["name"] original name ─ ["size"] bytes ─ ["error"] code .',
      },
      {
        label: 'move_uploaded_file()', desc: 'Moves from temp to permanent location ─ ONLY use this function, not rename() ─ validates upload origin .',
      },
      {
        label: 'Serve from Web Root', desc: 'Store in public/uploads/ ─ accessible via browser URL ─ display with <img src="/uploads/file.jpg"> .',
      },
    ],
    tip: 'Always rename uploaded files ─ uniqid() + extension ─ prevents overwriting and directory traversal .',
    lab: 'Build avatar upload form ─ validate image type + size ─ save to uploads/ ─ display uploaded image .',
    result: 'User uploads photo ─ saved as unique filename ─ browser shows uploaded image immediately .',
    code: `<?php
$uploaded = $_FILES ? true : false;
?>
<!DOCTYPE html>
<html>
<head>
    <style>
        .upload-zone { border: 2px dashed #fbbf24; padding: 2rem; border-radius: 12px; text-align: center; background: #fffbeb; }
        .preview { width: 60px; height: 60px; background: #fbbf24; border-radius: 8px; margin: 10px auto; }
    </style>
</head>
<body>
    <div class="upload-zone">
        <?php if ($uploaded): ?>
            <div class="preview"></div>
            <p style="color: #92400e; font-weight: bold;">✓ Upload Successful!</p>
        <?php else: ?>
            <form method="POST" enctype="multipart/form-data">
                <input type="file" name="avatar" style="margin-bottom: 10px;"><br>
                <button style="padding: 10px 20px; background: #fbbf24; color: #451a03; border: none; font-weight: bold;">Upload File</button>
            </form>
        <?php endif; ?>
    </div>
</body>
</html>`,
    filename: 'upload-avatar.php',
    outputType: 'browser',
    terminalOutput: `<!DOCTYPE html>
<html>
<head>
    <style>
        .upload-card { font-family: sans-serif; max-width: 400px; padding: 2.5rem; background: #fff; border-radius: 16px; border: 2px dashed #fbbf24; text-align: center; background: #fffbeb; }
        .preview-box { width: 80px; height: 80px; background: #fbbf24; border-radius: 12px; margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center; font-size: 32px; color: white; border: 4px solid white; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); overflow: hidden; }
        .success-text { color: #92400e; font-weight: 800; font-size: 1.1rem; margin-bottom: 0.5rem; opacity: 0; transform: translateY(10px); transition: 0.5s; }
        .meta { color: #b45309; font-size: 0.8rem; opacity: 0; transition: 0.5s 0.2s; }
        .progress-bar { width: 100%; height: 8px; background: #fef3c7; border-radius: 4px; margin: 1rem 0; overflow: hidden; display: none; }
        .progress-fill { width: 0%; height: 100%; background: #fbbf24; transition: 0.8s ease-in-out; }
        #uploadForm { transition: 0.3s; }
        button { background: #fbbf24; color: #451a03; border: none; padding: 12px 24px; border-radius: 10px; font-weight: 800; cursor: pointer; margin-top: 1rem; }
    </style>
</head>
<body>
    <div class="upload-card">
        <div class="preview-box" id="preview">📁</div>
        <div id="formContainer">
            <h3 style="margin-top:0; color:#92400e">Select Profile Photo</h3>
            <form id="uploadForm">
                <input type="file" style="font-size: 0.8rem;">
                <button type="submit">Start Upload</button>
            </form>
        </div>
        <div id="progress" class="progress-bar"><div class="progress-fill" id="fill"></div></div>
        <div id="success" style="display:none">
            <div class="success-text" id="st">✓ Upload Complete!</div>
            <div class="meta" id="sm">File: avatar_v8.jpg (256 KB)</div>
            <button onclick="window.location.reload()" style="background:#d97706; color:white; font-size: 0.8rem; margin-top:2rem">Reset Simulation</button>
        </div>
    </div>
    <script>
        document.getElementById("uploadForm").onsubmit = (e) => {
            e.preventDefault();
            document.getElementById("formContainer").style.display = "none";
            document.getElementById("progress").style.display = "block";
            
            setTimeout(() => {
                document.getElementById("fill").style.width = "100%";
                setTimeout(() => {
                    document.getElementById("progress").style.display = "none";
                    document.getElementById("success").style.display = "block";
                    document.getElementById("preview").innerHTML = "📸";
                    setTimeout(() => {
                        document.getElementById("st").style.opacity = "1";
                        document.getElementById("st").style.transform = "translateY(0)";
                        document.getElementById("sm").style.opacity = "1";
                    }, 50);
                }, 1000);
            }, 100);
        };
    </script>
</body>
</html>`,
  },

  /* ══════════════════════════════════════════════════════
     CHAPTER 9: WEB SECURITY
  ══════════════════════════════════════════════════════ */
  {
    chapter: 'security', id: 'PH9-S1', accent: '#f472b6',
    section: '1. Security',
    title: 'Web Security Essentials', subtitle: 'XSS, CSRF, SQL Injection Prevention',
    icon: ShieldAlert,
    concepts: [
      {
        label: 'XSS (Cross-Site Scripting)', desc: 'Hacker injects <script> via form ─ runs in victims\' browsers ─ steals cookies/sessions ─ fix: htmlspecialchars() on output .',
      },
      {
        label: 'SQL Injection', desc: '"SELECT * WHERE name = \'$input\'" ─ input = "\' OR 1=1--" ─ dumps entire DB ─ fix: prepare()+execute() always .',
      },
      {
        label: 'CSRF (Cross-Site Request Forgery)', desc: 'Evil site tricks logged-in user into submitting form to your site ─ fix: CSRF token in every form .',
      },
      {
        label: 'Security Headers', desc: 'X-Content-Type-Options, X-Frame-Options, Content-Security-Policy ─ one header() call each ─ big protection .',
      },
    ],
    tip: 'Three rules: htmlspecialchars() on every echo ─ prepare() every query ─ CSRF token on every form .',
    lab: 'Audit an existing form page ─ add all three protections ─ test each with an attack attempt .',
    result: 'XSS script tags neutralized ─ SQL injection returns error ─ CSRF forgery rejected .',
    code: `<?php
$audit = [
    'XSS Protection' => 'ACTIVE',
    'SQLi Shield'    => 'ACTIVE',
    'CSRF Guard'     => 'ACTIVE'
];
?>
<!DOCTYPE html>
<html>
<head>
    <style>
        .security-item { display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #fce7f3; }
        .status { color: #db2777; font-weight: bold; font-size: 0.8rem; }
    </style>
</head>
<body>
    <h3 style="color: #9d174d;">Web Security Scan</h3>
    <?php foreach ($audit as $key => $val): ?>
        <div class="security-item">
            <span><?= $key ?></span>
            <span class="status">✓ <?= $val ?></span>
        </div>
    <?php endforeach; ?>
</body>
</html>`,
    filename: 'secure-page.php',
    outputType: 'browser',
    terminalOutput: `<!DOCTYPE html>
<html>
<head>
    <style>
        .security-container { font-family: 'JetBrains Mono', sans-serif; max-width: 440px; border-radius: 16px; overflow: hidden; border: 1.5px solid #f472b6; background: #fff; box-shadow: 0 10px 30px -10px rgba(244, 114, 182, 0.2); }
        .header { background: linear-gradient(135deg, #f472b6, #db2777); color: white; padding: 1.5rem; display: flex; align-items: center; gap: 12px; }
        .pulse { width: 12px; height: 12px; background: #fff; border-radius: 50%; box-shadow: 0 0 0 0 rgba(255,255,255,0.7); animation: pulse 1.5s infinite; }
        .security-item { display: flex; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid #fce7f3; background: #fffdfc; align-items: center; }
        .label { color: #831843; font-weight: 800; font-size: 0.85rem; }
        .status { background: #fdf2f8; color: #db2777; padding: 4px 12px; border-radius: 20px; font-weight: 800; font-size: 0.75rem; border: 1px solid #fbcfe8; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(255,255,255,0.7); } 70% { box-shadow: 0 0 0 10px rgba(255,255,255,0); } 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); } }
    </style>
</head>
<body>
    <div class="security-container">
        <div class="header"><div class="pulse"></div> <span>Security Shield V2.1</span></div>
        <div class="security-item"><span class="label">XSS Sanitizer</span><span class="status">✓ ACTIVE</span></div>
        <div class="security-item"><span class="label">SQLi Prepared Stmt</span><span class="status">✓ ACTIVE</span></div>
        <div class="security-item"><span class="label">CSRF Token Guard</span><span class="status">✓ ACTIVE</span></div>
        <div class="security-item" style="border:none"><span class="label">Security Headers</span><span class="status">✓ ACTIVE</span></div>
    </div>
</body>
</html>`,
  },

  /* ══════════════════════════════════════════════════════
     CHAPTER 10: FINAL WEB APP
  ══════════════════════════════════════════════════════ */
  {
    chapter: 'project', id: 'PH10-S1', accent: '#2dd4bf',
    section: '1. Architecture',
    title: 'Web App Architecture', subtitle: 'MVC Folder Structure for Production',
    icon: Layout,
    concepts: [
      {
        label: 'Front Controller Pattern', desc: 'All requests → public/index.php → router → controller ─ single entry point ─ centralizes security .',
      },
      {
        label: 'MVC Separation', desc: 'models/ = DB logic ─ views/ = HTML templates ─ controllers/ = request handling ─ each layer independent .',
      },
      {
        label: 'Include Layout Parts', desc: 'include "views/partials/header.php" ─ DRY nav/footer ─ change once = updates everywhere .',
      },
      {
        label: '.htaccess URL Rewriting', desc: 'RewriteRule ^posts/([0-9]+)$ index.php?page=post&id=$1 ─ clean URLs ─ /posts/5 not /index.php?id=5 .',
      },
    ],
    tip: 'public/ is the only folder accessible by browser ─ config/, models/, views/ stay ABOVE web root = secure .',
    lab: 'Set up MVC folder structure ─ create router ─ test /blog and /post?id=1 routes resolve to controllers .',
    result: 'Clean URL routing: /blog → BlogController ─ /post/5 → PostController with id=5 .',
    code: `<?php
// index.php - Front Controller
$page = $_GET['page'] ?? 'home';

$routes = [
    'home' => 'Welcome to our MVC App!',
    'blog' => 'Read our latest posts.',
    'contact' => 'Get in touch with us.'
];

$content = $routes[$page] ?? '404 - Page Not Found';
?>
<!DOCTYPE html>
<html>
<head>
    <style>
        .mvc-container { font-family: sans-serif; max-width: 600px; margin: 2rem auto; }
        .nav { background: #2dd4bf; padding: 1rem; border-radius: 8px; display: flex; gap: 1rem; }
        .nav a { color: #042f2e; text-decoration: none; font-weight: bold; }
        .content { margin-top: 2rem; padding: 2rem; border: 2px dashed #2dd4bf; border-radius: 8px; }
    </style>
</head>
<body>
    <div class="mvc-container">
        <div class="nav">
            <a href="?page=home">Home</a>
            <a href="?page=blog">Blog</a>
            <a href="?page=contact">Contact</a>
        </div>
        <div class="content">
            <h1><?= $content ?></h1>
            <p>Requested route: <strong>/<?= htmlspecialchars($page) ?></strong></p>
        </div>
    </div>
</body>
</html>`,
    filename: 'index.php',
    outputType: 'browser',
    terminalOutput: `<!DOCTYPE html>
<html>
<head>
    <style>
        .mvc-container { font-family: sans-serif; max-width: 600px; margin: 1rem auto; padding: 1rem; }
        .nav { background: #2dd4bf; padding: 12px; border-radius: 12px; display: flex; gap: 1rem; box-shadow: 0 4px 10px rgba(45, 212, 191, 0.2); }
        .nav a { color: #042f2e; text-decoration: none; font-weight: 800; font-size: 0.9rem; padding: 6px 12px; border-radius: 8px; transition: 0.2s; }
        .nav a:hover { background: rgba(255,255,255,0.2); }
        .nav a.active { background: white; color: #0d9488; }
        .content { margin-top: 2rem; padding: 2.5rem; border: 2.5px dashed #2dd4bf; border-radius: 16px; background: #f0fdfa; animation: fadeIn 0.4s; }
        h1 { color: #0d9488; margin-top: 0; font-size: 1.5rem; }
        .route-info { display: inline-block; background: #ccfbf1; color: #0f766e; padding: 4px 10px; border-radius: 6px; font-family: monospace; font-size: 0.8rem; margin-top: 1rem; font-weight: bold; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    </style>
</head>
<body>
    <div class="mvc-container">
        <div class="nav">
            <a href="#" onclick="route('home', this)" class="active">Home</a>
            <a href="#" onclick="route('blog', this)">Blog</a>
            <a href="#" onclick="route('contact', this)">Contact</a>
        </div>
        <div id="app" class="content">
            <h1>Welcome to our MVC App!</h1>
            <p style="color:#134e4a">The front controller has successfully routed your request.</p>
            <div class="route-info">Requested route: /home</div>
        </div>
    </div>
    <script>
        const pages = {
            home: { title: 'Welcome to our MVC App!', desc: 'The front controller has successfully routed your request.' },
            blog: { title: 'Latest Blog Posts', desc: 'Fetching data from the BlogController...' },
            contact: { title: 'Contact Support', desc: 'How can we help you today?' }
        };
        function route(p, el) {
            document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));
            el.classList.add('active');
            const app = document.getElementById('app');
            app.style.animation = 'none';
            app.offsetHeight; // trigger reflow
            app.style.animation = 'fadeIn 0.4s';
            app.innerHTML = \`<h1>\${pages[p].title}</h1>
                <p style="color:#134e4a">\${pages[p].desc}</p>
                <div class="route-info">Requested route: /\${p}</div>\`;
        }
    </script>
</body>
</html>`,
  },

  {
    chapter: 'project', id: 'PH10-S2', accent: '#2dd4bf',
    section: '2. Deployment',
    title: 'Production Deployment', subtitle: 'Launch Your PHP Web App Safely',
    icon: Rocket,
    concepts: [
      {
        label: 'Error Display OFF', desc: 'ini_set("display_errors", 0) ─ log to file not browser ─ users never see stack traces .',
      },
      {
        label: 'HTTPS Everywhere', desc: 'Redirect HTTP → HTTPS via .htaccess ─ free cert via Let\'s Encrypt ─ required for login/forms .',
      },
      {
        label: 'Environment Config', desc: '$_ENV["DB_PASS"] from .env file ─ different values dev/staging/production ─ no secrets in code .',
      },
      {
        label: 'Pre-Launch Checklist', desc: 'APP_DEBUG=false ─ all inputs validated ─ all queries prepared ─ CSRF on all forms ─ HTTPS enabled .',
      },
    ],
    tip: 'Test production config locally first: define("APP_ENV","production") then check no errors leak to browser .',
    lab: 'Create production config ─ hide errors ─ force HTTPS ─ set Content-Security-Policy header .',
    result: 'Site live with HTTPS ─ errors log to file ─ no sensitive info exposed in browser .',
    code: `<?php echo "App is Live! 🚀"; ?>
<!DOCTYPE html>
<html>
<head>
    <style>
        .launch-card { background: linear-gradient(135deg, #0d9488, #06b6d4); color: white; padding: 3rem; border-radius: 20px; text-align: center; font-family: sans-serif; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
        .rocket { font-size: 64px; margin-bottom: 1rem; display: block; }
        h1 { margin: 0; font-size: 2rem; }
        p { opacity: 0.9; margin: 10px 0 2rem; }
        .btn-live { background: white; color: #0d9488; padding: 12px 30px; border-radius: 12px; font-weight: 800; text-decoration: none; display: inline-block; }
    </style>
</head>
<body>
    <div class="launch-card">
        <span class="rocket">🚀</span>
        <h1>Production Ready!</h1>
        <p>Security checked. Database connected. Application launched.</p>
        <a href="#" class="btn-live">View Production Site</a>
    </div>
</body>
</html>`,
    filename: 'config/app.php',
    outputType: 'browser',
    terminalOutput: `<!DOCTYPE html>
<html>
<head>
    <style>
        .launch-card { background: linear-gradient(135deg, #0d9488, #06b6d4); color: white; padding: 3rem; border-radius: 24px; text-align: center; font-family: sans-serif; max-width: 500px; box-shadow: 0 10px 30px -5px rgba(13, 148, 136, 0.4); }
        .rocket { font-size: 72px; margin-bottom: 1rem; display: block; animation: float 3s ease-in-out infinite; }
        h1 { margin: 0; font-size: 2.25rem; font-weight: 900; }
        p { opacity: 0.85; margin: 0.5rem 0 2rem; line-height: 1.6; }
        .badge-list { display: flex; gap: 8px; justify-content: center; margin-bottom: 2rem; }
        .badge { background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
        .btn-live { background: white; color: #0d9488; padding: 14px 34px; border-radius: 12px; font-weight: 900; text-decoration: none; display: inline-block; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
    </style>
</head>
<body>
    <div class="launch-card">
        <span class="rocket">🚀</span>
        <h1>Application Live!</h1>
        <p>Congratulations! Your full-stack PHP application is now running securely in production.</p>
        <div class="badge-list">
            <div class="badge">HTTPS</div>
            <div class="badge">PHP 8.3</div>
            <div class="badge">PDO MySQL</div>
        </div>
        <a href="#" class="btn-live">Visit live-app.com</a>
    </div>
</body>
</html>`,
  },
];

/* ══════════════════════════════════════════════════════════════════
   SYNTAX HIGHLIGHTER
══════════════════════════════════════════════════════════════════ */

const PHP_KW = new Set([
  'php', 'echo', 'return', 'if', 'else', 'elseif', 'foreach', 'for', 'while', 'do',
  'class', 'extends', 'implements', 'namespace', 'use', 'new', 'public', 'protected',
  'private', 'static', 'function', 'fn', 'array', 'string', 'int', 'float', 'bool',
  'void', 'null', 'true', 'false', 'require', 'include', 'throw', 'try', 'catch',
  'match', 'readonly', 'const', 'switch', 'case', 'break', 'continue', 'die',
  'isset', 'empty', 'unset', 'header', 'session_start', 'require_once',
]);

const tokenizeLine = (line: string, mode: 'php' | 'html' = 'php'): React.ReactNode[] => {
  if (mode === 'php' && /^\s*(\/\/|#|\/\*|\*)/.test(line))
    return [<span key="c" style={{ color: '#4b5563', fontStyle: 'italic' }}>{line}</span>];

  if (mode === 'html') {
    const parts = line.split(/(<[\/]?[a-zA-Z0-9]+|[\/]?>|"[^"]*"|'[^']*'|&[a-z]+;)/g);
    return parts.map((p, i) => {
      if (!p) return null;
      if (p.startsWith('<') || p.endsWith('>')) return <span key={i} style={{ color: '#f87171', fontWeight: 600 }}>{p}</span>;
      if (p.startsWith('"') || p.startsWith("'")) return <span key={i} style={{ color: '#86efac' }}>{p}</span>;
      if (p.startsWith('&')) return <span key={i} style={{ color: '#fbbf24' }}>{p}</span>;
      return <span key={i} style={{ color: '#cbd5e1' }}>{p}</span>;
    });
  }

  const parts = line.split(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\$[a-zA-Z_]\w*|\b\d+(?:\.\d+)?\b|\b[a-zA-Z_]\w*\b)/g);
  return parts.map((p, i) => {
    if (!p) return null;
    if (p.startsWith('$')) return <span key={i} style={{ color: '#fbbf24' }}>{p}</span>;
    if (PHP_KW.has(p)) return <span key={i} style={{ color: '#f87171', fontWeight: 700 }}>{p}</span>;
    if (p.startsWith('"') || p.startsWith("'")) return <span key={i} style={{ color: '#86efac' }}>{p}</span>;
    if (/^\d/.test(p)) return <span key={i} style={{ color: '#c084fc' }}>{p}</span>;
    if (/^[A-Z]/.test(p)) return <span key={i} style={{ color: '#fbbf24' }}>{p}</span>;
    return <span key={i} style={{ color: '#fff' }}>{p}</span>;
  });
};

const HighlightedCode = ({ code, mode = 'php' }: { code: string; mode?: 'php' | 'html' }) => (
  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, lineHeight: 1.8, whiteSpace: 'pre' }}>
    {code.split('\n').map((line, i) => <div key={i} style={{ minHeight: '1.8em' }}>{tokenizeLine(line, mode)}</div>)}
  </div>
);

/* ══════════════════════════════════════════════════════════════════
   CODE PANEL
══════════════════════════════════════════════════════════════════ */

const CodePanel = ({ code: initialCode, terminalOutput, accent, filename, outputType = 'browser' }: {
  code: string; terminal?: string; terminalOutput?: string; accent: string; filename: string;
  outputType?: 'browser' | 'terminal';
}) => {
  const [tab, setTab] = useState<'code' | 'terminal'>('code');
  const [browserMode, setBrowserMode] = useState<'preview' | 'html' | 'headers'>('preview');
  const [code, setCode] = useState(initialCode);
  const [copied, setCopied] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const hlRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setCode(initialCode); }, [initialCode]);

  const copy = () => {
    const textToCopy = tab === 'code'
      ? code
      : (outputType === 'browser'
        ? (browserMode === 'html' ? terminalOutput : (browserMode === 'headers' ? 'Mock Headers' : terminalOutput))
        : terminalOutput) || '';
    navigator.clipboard.writeText(textToCopy);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const syncScroll = () => {
    if (taRef.current && hlRef.current) {
      hlRef.current.scrollTop = taRef.current.scrollTop;
      hlRef.current.scrollLeft = taRef.current.scrollLeft;
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: '#06080f', borderRadius: 14, overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '9px 13px', background: '#0a0e1a', borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {['#ff5f57', '#febc2e', '#28c840'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
          </div>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', borderRadius: 7, padding: 3, marginLeft: 6 }}>
            {(['code', 'terminal'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '4px 10px', borderRadius: 5, border: 'none', fontSize: 9.5, fontWeight: 800,
                fontFamily: "'JetBrains Mono',monospace", background: tab === t ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: tab === t ? '#fff' : '#4b5563', transition: 'all 0.18s', textTransform: 'uppercase',
              }}>{t === 'code' ? 'PHP' : (outputType === 'terminal' ? 'Terminal' : 'Browser Output')}</button>
            ))}
          </div>

          {tab === 'terminal' && outputType === 'browser' && (
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', borderRadius: 6, padding: 2, marginLeft: 10 }}>
              {(['preview', 'html', 'headers'] as const).map(m => (
                <button key={m} onClick={() => setBrowserMode(m)} style={{
                  padding: '3px 8px', borderRadius: 4, border: 'none', fontSize: 8, fontWeight: 700,
                  fontFamily: "'JetBrains Mono',monospace", background: browserMode === m ? accent : 'transparent',
                  color: browserMode === m ? '#000' : '#4b5563', transition: 'all 0.1s', textTransform: 'uppercase',
                }}>{m}</button>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 9, color: '#4b5563', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>{filename}</div>
          <button onClick={copy} style={{
            background: 'none', border: 'none', color: copied ? '#4ade80' : '#374151',
            display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.18s', cursor: 'pointer',
          }}>
            {copied ? <CheckCircle2 size={13} /> : <Copy size={13} />}
          </button>
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {tab === 'code' ? (
          <div style={{ position: 'relative', height: '100%' }}>
            <div ref={hlRef} style={{
              position: 'absolute', inset: 0, padding: 20, overflow: 'auto', pointerEvents: 'none', zIndex: 1
            }}>
              <HighlightedCode code={code} />
            </div>
            <textarea
              ref={taRef} value={code} onChange={e => setCode(e.target.value)} onScroll={syncScroll}
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                background: 'transparent', color: 'transparent', resize: 'none', outline: 'none',
                padding: 20, fontFamily: "'JetBrains Mono',monospace", fontSize: 13,
                lineHeight: 1.8, border: 'none', zIndex: 2, caretColor: accent, whiteSpace: 'pre',
              }} spellCheck={false} wrap="off"
            />
          </div>
        ) : (
          <div style={{
            display: 'flex', flexDirection: 'column', height: '100%',
            background: outputType === 'terminal' ? '#0a0e1a' : (browserMode === 'preview' ? '#fff' : '#0a0e1a'),
            color: outputType === 'terminal' ? '#64748b' : (browserMode === 'preview' ? '#000' : '#64748b')
          }}>
            {/* Browser Navigation Bar - ONLY if browser mode */}
            {outputType === 'browser' && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '8px 16px',
                background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', flexShrink: 0
              }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <ArrowLeft size={14} color="#94a3b8" style={{ cursor: 'not-allowed' }} />
                  <ArrowRight size={14} color="#94a3b8" style={{ cursor: 'not-allowed' }} />
                  <RotateCcw size={14} color="#64748b" style={{ cursor: 'pointer' }} />
                </div>
                <div style={{
                  flex: 1, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6,
                  padding: '4px 12px', fontSize: 11, color: '#64748b', display: 'flex', alignItems: 'center', gap: 8,
                  fontFamily: 'system-ui, sans-serif'
                }}>
                  <Globe size={12} color="#94a3b8" />
                  <span style={{ opacity: 0.8 }}>localhost:8000/</span>
                  <span style={{ color: '#1e293b', fontWeight: 500 }}>{filename}</span>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#cbd5e1' }} />
                  <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#cbd5e1' }} />
                  <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#cbd5e1' }} />
                </div>
              </div>
            )}

            {/* Terminal Header - ONLY if terminal mode */}
            {outputType === 'terminal' && (
              <div style={{
                padding: '12px 20px', background: 'rgba(255,255,255,0.02)',
                borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 8
              }}>
                <Terminal size={14} color="#4b5563" />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#4b5563' }}>PHP CLI TERMINAL</span>
              </div>
            )}

            {/* Browser/Terminal Content Viewport */}
            <div style={{
              flex: 1, overflow: 'hidden', position: 'relative',
              background: outputType === 'terminal' || (outputType === 'browser' && browserMode !== 'preview') ? '#080a12' : '#fff',
            }}>
              {terminalOutput ? (
                <div style={{ height: '100%' }}>
                  {/* Iframe Preview - Kept mounted to preserve state */}
                  {outputType === 'browser' && (
                    <div style={{
                      height: '100%',
                      display: browserMode === 'preview' ? 'block' : 'none'
                    }}>
                      <iframe
                        srcDoc={terminalOutput}
                        title="Preview"
                        style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }}
                      />
                    </div>
                  )}

                  {/* Headers Mode */}
                  {outputType === 'browser' && browserMode === 'headers' && (
                    <div style={{ padding: '24px 28px', height: '100%', overflow: 'auto', background: '#080a12', color: '#94a3b8' }}>
                      {/* Request Section */}
                      <div style={{ marginBottom: 32 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                          <span style={{ fontSize: 9, fontWeight: 900, color: '#4b5563', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Request Information</span>
                          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.03)' }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px 24px', fontFamily: 'monospace', fontSize: 10 }}>
                          <span style={{ color: '#4b5563' }}>Request Method:</span>
                          <span style={{ color: code.includes('$_POST') ? accent : '#fff', fontWeight: 700 }}>{code.includes('$_POST') ? 'POST' : 'GET'}</span>
                          <span style={{ color: '#4b5563' }}>Request URL:</span>
                          <span style={{ color: '#fff' }}>http://localhost:8000/{filename}</span>
                          <span style={{ color: '#4b5563' }}>Remote Address:</span>
                          <span style={{ color: '#fff' }}>127.0.0.1:443</span>
                        </div>
                      </div>

                      {/* Response Headers */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                          <span style={{ fontSize: 9, fontWeight: 900, color: '#4b5563', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Response Headers</span>
                          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.03)' }} />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                          <div style={{
                            padding: '4px 10px', borderRadius: 4,
                            background: code.includes('header("Location') ? '#3b82f620' : '#10b98120',
                            color: code.includes('header("Location') ? '#3b82f6' : '#10b981',
                            fontSize: 10, fontWeight: 900
                          }}>
                            {code.includes('header("Location') ? '302 Found' : '200 OK'}
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {(() => {
                            const h = [
                              { k: 'Content-Type', v: 'text/html; charset=UTF-8' },
                              { k: 'Server', v: 'PHP/8.3.4 (Build-Active)' },
                            ];
                            if (code.includes('session_start()')) {
                              h.push({ k: 'Set-Cookie', v: 'PHPSESSID=' + Math.random().toString(36).substring(2, 10) + '; path=/; HttpOnly' });
                            }
                            if (code.includes('header("Location')) {
                              h.push({ k: 'Location', v: 'dashboard.php' });
                            }
                            h.push(
                              { k: 'X-Powered-By', v: 'PHP/8.3.4' },
                              { k: 'Cache-Control', v: 'no-store, no-cache, must-revalidate' },
                              { k: 'Date', v: new Date().toUTCString() }
                            );
                            return h.map(({ k, v }) => (
                              <div key={k} style={{
                                display: 'flex', padding: '10px 14px', background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.03)', borderRadius: 8, gap: 16, marginBottom: 2
                              }}>
                                <div style={{ width: 120, color: accent, fontSize: 10, fontWeight: 700, fontFamily: 'monospace', opacity: 0.8 }}>{k}:</div>
                                <div style={{ color: '#e2e8f0', fontSize: 10, fontFamily: 'monospace', wordBreak: 'break-all' }}>{v}</div>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>

                      <div style={{ marginTop: 32, padding: 20, borderRadius: 14, border: '1px dashed rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.01)' }}>
                        <div style={{ fontSize: 9, fontWeight: 900, color: '#4b5563', marginBottom: 12, letterSpacing: '0.1em' }}>SERVER PERFORMANCE</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                          <div style={{ position: 'relative', width: '60%', height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '30%', background: accent, borderRadius: 2 }} />
                          </div>
                          <div style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'monospace', fontWeight: 600 }}>TTFB: 7.2ms</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* HTML/Terminal Mode */}
                  {(outputType === 'terminal' || (outputType === 'browser' && browserMode === 'html')) && (
                    <div style={{ padding: 24, height: '100%', overflow: 'auto' }}>
                      <pre style={{
                        margin: 0, whiteSpace: 'pre-wrap', fontFamily: "'JetBrains Mono',monospace",
                        color: '#f8fafc', fontSize: outputType === 'terminal' ? 14 : 13,
                        background: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 12,
                        border: '1px solid rgba(255,255,255,0.05)', lineHeight: 1.6
                      }}>
                        {outputType === 'terminal' ? (
                          <>
                            <span style={{ color: accent, marginRight: 8 }}>$ php {filename}</span>
                            {terminalOutput}
                          </>
                        ) : (
                          <HighlightedCode code={terminalOutput} mode="html" />
                        )}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#cbd5e1' }}>
                  <Globe size={48} strokeWidth={1} style={{ marginBottom: 16, opacity: 0.5 }} />
                  <p style={{ fontSize: 13, fontWeight: 500 }}>Browser waiting for response...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════ */

export default function PHPSlides() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chapterParam = searchParams.get('chapter') || 'intro';

  const displayPages = useMemo(() => {
    const filtered = PHP_SLIDES.filter(s => s.chapter === chapterParam);
    const result: DisplayPage[] = [];
    filtered.forEach(s => {
      result.push({ ...s, subType: 'concept' });
      if (s.variables && s.variables.length > 0) {
        result.push({ ...s, subType: 'variables' });
      }
      result.push({ ...s, subType: 'lab' });
    });
    return result.length > 0 ? result : [{ ...PHP_SLIDES[0], subType: 'concept' }];
  }, [chapterParam]);

  const slideParam = searchParams.get('slide');
  const initialSlide = slideParam
    ? Math.max(0, Math.min(parseInt(slideParam) - 1, displayPages.length - 1))
    : 0;

  const [current, setCurrent] = useState(initialSlide);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dir, setDir] = useState(1);
  const [showNotes, setShowNotes] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const slide = displayPages[current];
  const Icon = slide.icon;
  const ch = CHAPTERS.find(c => c.id === chapterParam) || CHAPTERS[0];

  useEffect(() => {
    const saved = localStorage.getItem('php_notes_v3');
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  const saveNote = (val: string) => {
    const next = { ...notes, [slide.id]: val };
    setNotes(next);
    localStorage.setItem('php_notes_v3', JSON.stringify(next));
  };

  useEffect(() => {
    const s = slideParam ? parseInt(slideParam) - 1 : 0;
    if (s !== current) {
      setCurrent(Math.max(0, Math.min(s, displayPages.length - 1)));
    }
  }, [chapterParam, slideParam, displayPages.length]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (current === 0) params.delete('slide');
    else params.set('slide', String(current + 1));
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [current, router, searchParams]);

  const goTo = useCallback((idx: number, d: number) => {
    if (isAnimating) return;
    setDir(d); setIsAnimating(true);
    setTimeout(() => { setCurrent(idx); setIsAnimating(false); }, 250);
  }, [isAnimating]);

  const next = useCallback(() => {
    if (current < displayPages.length - 1) goTo(current + 1, 1);
  }, [current, displayPages.length, goTo]);

  const prev = useCallback(() => {
    if (current > 0) goTo(current - 1, -1);
  }, [current, goTo]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === 'TEXTAREA' || t.tagName === 'INPUT') return;
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [next, prev]);

  return (
    <div style={{
      minHeight: '100vh', background: '#030509', color: '#fff',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      fontFamily: "'Noto Sans Khmer', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer:wght@300;400;500;600;700;900&family=JetBrains+Mono:wght@400;700;800&display=swap');
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        * { box-sizing: border-box; }
      `}</style>

      {/* Grid BG */}
      <div style={{
        position: 'fixed', inset: 0, opacity: 0.06, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `radial-gradient(circle at 70% 30%, ${slide.accent}12 0%, transparent 50%)`,
        transition: 'background 1s ease'
      }} />

      {/* ── HEADER ── */}
      <header style={{
        position: 'relative', zIndex: 50, height: 64, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 24px', background: 'rgba(3,5,9,0.85)',
        backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/courses/backend" style={{
            width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center',
            justifyContent: 'center', background: 'rgba(255,255,255,0.03)', color: '#4b5563',
            border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none'
          }}><ArrowLeft size={16} /></Link>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '6px 14px',
            borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.03)', color: '#fff', cursor: 'pointer',
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: 6, display: 'flex', alignItems: 'center',
              justifyContent: 'center', background: ch.color, color: '#000'
            }}>
              {isMenuOpen ? <X size={14} /> : <Menu size={14} />}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 9, fontWeight: 800, color: ch.color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Chapter {ch.num}</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{ch.label}</div>
            </div>
            <ChevronDown size={14} style={{ color: '#374151', transform: isMenuOpen ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            {displayPages.map((_, i) => (
              <div key={i} onClick={() => goTo(i, i > current ? 1 : -1)} style={{
                width: i === current ? 20 : 5, height: 5, borderRadius: 3, cursor: 'pointer',
                background: i === current ? slide.accent : i < current ? `${slide.accent}50` : 'rgba(255,255,255,0.1)',
                transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)'
              }} />
            ))}
          </div>
          <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)' }} />
          <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono',monospace", color: '#4b5563' }}>{current + 1} / {displayPages.length}</span>
          <button onClick={() => setShowNotes(!showNotes)} style={{
            width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center',
            justifyContent: 'center', background: showNotes ? `${slide.accent}20` : 'rgba(255,255,255,0.03)',
            color: showNotes ? slide.accent : '#4b5563',
            border: `1px solid ${showNotes ? slide.accent + '60' : 'rgba(255,255,255,0.08)'}`,
            cursor: 'pointer',
          }}><StickyNote size={18} /></button>
        </div>
      </header>

      {/* ── CHAPTER MENU ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            />
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
              style={{
                position: 'fixed', top: 80, left: 24, zIndex: 101, width: 320,
                background: '#0a0e1a', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 20, padding: 10, boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
              }}
            >
              {CHAPTERS.map(c => (
                <button key={c.id} onClick={() => { router.push(`?chapter=${c.id}`); setIsMenuOpen(false); }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                    borderRadius: 14, border: 'none', cursor: 'pointer',
                    background: chapterParam === c.id ? 'rgba(255,255,255,0.06)' : 'transparent',
                    color: '#fff', transition: '0.2s', textAlign: 'left'
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, background: `${c.color}20`,
                    color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 800, fontFamily: "'JetBrains Mono',monospace",
                    flexShrink: 0,
                  }}>{c.num}</div>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 800, color: c.color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>CHAPTER {c.num}</div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{c.label}</div>
                  </div>
                  {chapterParam === c.id && (
                    <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex: 1, display: 'flex', position: 'relative', zIndex: 10, overflow: 'hidden' }}>

        {/* LEFT PANEL */}
        <div style={{ width: '45%', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '40px 50px', overflowY: 'auto' }}>
          <AnimatePresence mode="wait">
            <motion.div key={`${current}-${slide.subType}`}
              initial={{ opacity: 0, x: dir * 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -dir * 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {/* Chapter + type badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                <span style={{
                  padding: '4px 12px', borderRadius: 100, background: `${slide.accent}15`,
                  color: slide.accent, fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
                }}>{ch.label}</span>
                <span style={{
                  padding: '4px 10px', borderRadius: 100,
                  background: slide.subType === 'concept' ? 'rgba(59,130,246,0.12)' :
                    slide.subType === 'variables' ? 'rgba(168,85,247,0.12)' : 'rgba(34,197,94,0.12)',
                  color: slide.subType === 'concept' ? '#60a5fa' :
                    slide.subType === 'variables' ? '#a855f7' : '#4ade80',
                  fontSize: 9, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase',
                }}>{slide.subType === 'concept' ? '● ទ្រឹស្តី' :
                  slide.subType === 'variables' ? '● ការពន្យល់កូដ' : '● ការអនុវត្ត'}</span>
                <span style={{ color: '#1f2937', fontSize: 10, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", marginLeft: 'auto' }}>{slide.id}</span>
              </div>

              {/* Icon + Title */}
              <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 36 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16, background: `${slide.accent}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: slide.accent,
                  border: `1px solid ${slide.accent}30`, flexShrink: 0,
                }}>
                  <Icon size={28} />
                </div>
                <div>
                  {/* Section Badge */}
                  {slide.section && (
                    <div style={{
                      fontSize: 9, fontWeight: 900, color: slide.accent,
                      background: `${slide.accent}14`, padding: '4px 10px',
                      borderRadius: 6, display: 'inline-block', marginBottom: 12,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      border: `1px solid ${slide.accent}20`
                    }}>
                      {slide.section}
                    </div>
                  )}
                  <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8, letterSpacing: '-0.02em', color: '#fff', lineHeight: 1.2 }}>
                    {slide.title}
                  </h1>
                  <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{slide.subtitle}</p>
                </div>
              </div>

              {/* Content */}
              {slide.subType === 'concept' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {slide.concepts.map((c, i) => (
                    <div key={i} style={{
                      padding: '18px 20px', borderRadius: 14, background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                    }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: slide.accent, marginBottom: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.label}</div>
                      <div style={{ fontSize: 14, lineHeight: 1.8, color: '#cbd5e1' }}>{c.desc}</div>
                    </div>
                  ))}
                </div>
              )}

              {slide.subType === 'variables' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{
                    fontSize: 9, fontWeight: 900, color: slide.accent,
                    marginBottom: 8, letterSpacing: '0.12em', paddingLeft: 4,
                  }}>VARIABLES DICTIONARY</div>
                  {slide.variables?.map((v, i) => (
                    <div key={i} style={{
                      padding: '18px 20px', borderRadius: 14, background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 8
                    }}>
                      <div style={{ color: slide.accent, fontFamily: "'JetBrains Mono',monospace", fontSize: 15, fontWeight: 900 }}>{v.label}</div>
                      <div style={{ fontSize: 14, lineHeight: 1.8, color: '#64748b' }}>{v.desc}</div>
                    </div>
                  ))}
                </div>
              )}

              {slide.subType === 'lab' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {/* Pro Tip */}
                  <div style={{ padding: '18px 20px', borderRadius: 14, background: 'rgba(251,191,36,0.04)', border: '1px solid rgba(251,191,36,0.12)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <Sparkles size={13} style={{ color: '#fbbf24' }} />
                      <span style={{ fontSize: 10, fontWeight: 800, color: '#fbbf24', letterSpacing: '0.1em' }}>PRO TIP</span>
                    </div>
                    <div style={{ fontSize: 14, lineHeight: 1.8, color: '#ca8a04', fontStyle: 'italic' }}>{slide.tip}</div>
                  </div>

                  {/* Objective */}
                  <div style={{ padding: '18px 20px', borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <BookOpen size={13} style={{ color: slide.accent }} />
                      <span style={{ fontSize: 10, fontWeight: 800, color: slide.accent, letterSpacing: '0.1em' }}>OBJECTIVE</span>
                    </div>
                    <div style={{ fontSize: 14, lineHeight: 1.8, color: '#cbd5e1' }}>{slide.lab}</div>
                  </div>

                  {/* Expected Outcome */}
                  <div style={{ padding: '18px 20px', borderRadius: 14, background: 'rgba(74,222,128,0.03)', border: '1px solid rgba(74,222,128,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <CheckCircle2 size={13} style={{ color: '#4ade80' }} />
                      <span style={{ fontSize: 10, fontWeight: 800, color: '#4ade80', letterSpacing: '0.1em' }}>EXPECTED RESULT</span>
                    </div>
                    <div style={{ fontSize: 14, lineHeight: 1.8, color: '#166534' }}>{slide.result}</div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div style={{ display: 'flex', gap: 12, marginTop: 36 }}>
                <button onClick={prev} disabled={current === 0} style={{
                  width: 48, height: 48, borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.03)', color: current === 0 ? '#1f2937' : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: current === 0 ? 'not-allowed' : 'pointer', flexShrink: 0,
                }}><ChevronLeft size={20} /></button>

                <button onClick={next} style={{
                  flex: 1, height: 48, borderRadius: 14, border: 'none', background: slide.accent,
                  color: '#000', fontWeight: 900, fontSize: 11, letterSpacing: '0.1em',
                  textTransform: 'uppercase', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                }}>
                  {current === displayPages.length - 1
                    ? 'FINISH CHAPTER'
                    : slide.subType === 'concept' ? 'SEE VARIABLES →'
                      : slide.subType === 'variables' ? 'START PRACTICE →' : 'NEXT LESSON →'}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT PANEL: CODE */}
        <div style={{ flex: 1, padding: 24, background: 'rgba(0,0,0,0.15)', overflow: 'hidden' }}>
          <AnimatePresence mode="wait">
            <motion.div key={`code-${current}`}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{ height: '100%' }}
            >
              <CodePanel
                code={slide.code}
                filename={slide.filename}
                accent={slide.accent}
                terminalOutput={slide.terminalOutput}
                outputType={slide.outputType}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ── NOTES DRAWER ── */}
      <AnimatePresence>
        {showNotes && (
          <motion.div initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }}
            transition={{ type: 'spring', damping: 28, stiffness: 200 }}
            style={{
              position: 'fixed', right: 0, top: 0, bottom: 0, width: 360, background: '#0a0e1a',
              zIndex: 200, borderLeft: '1px solid rgba(255,255,255,0.1)', padding: '80px 28px 28px',
              display: 'flex', flexDirection: 'column', boxShadow: '-20px 0 50px rgba(0,0,0,0.5)'
            }}
          >
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#fbbf24', letterSpacing: '0.1em', marginBottom: 4, textTransform: 'uppercase' }}>Field Notes</div>
              <div style={{ fontSize: 12, color: '#374151' }}>{slide.id} · {slide.title}</div>
            </div>
            <textarea
              value={notes[slide.id] || ''}
              onChange={e => saveNote(e.target.value)}
              placeholder="Take notes here... (auto-saved)"
              style={{
                flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16, padding: 18, color: '#94a3b8', fontSize: 14, lineHeight: 1.8,
                resize: 'none', outline: 'none', fontFamily: 'inherit',
              }}
            />
            <button onClick={() => setShowNotes(false)} style={{
              marginTop: 12, padding: '10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
              background: 'transparent', color: '#6b7280', cursor: 'pointer', fontSize: 12,
            }}>Close Notes</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}