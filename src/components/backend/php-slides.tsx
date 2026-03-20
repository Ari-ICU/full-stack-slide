"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft, ChevronRight, Code2, Copy, Check, Play, RotateCcw,
  Server, Database, Globe, Lock, Shield, ShieldCheck, ShieldAlert,
  Layers, List, RefreshCw, Zap, Sparkles, Key, FileCode, Box,
  Terminal, Rocket, HardDrive, Layout, Fingerprint, GitBranch,
  Star, StickyNote, CheckCircle2, Menu, X, ChevronDown, User,
  BookOpen, ArrowLeft,
} from 'lucide-react';

/* ══════════════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════════════ */

interface Slide {
  chapter: string; id: string; title: string; subtitle: string;
  accent: string;
  concepts: { label: string; desc: string }[];
  tip: string; lab: string; result: string;
  code: string; filename: string;
  terminal?: string; terminalOutput?: string;
  icon: React.ElementType;
}

/* ══════════════════════════════════════════════════════════════════
   CHAPTERS
══════════════════════════════════════════════════════════════════ */

const CHAPTERS = [
  { id: 'intro',    label: 'មូលដ្ឋានគ្រឹះ PHP',          num: '01', color: '#4ade80' },
  { id: 'logic',    label: 'លក្ខខណ្ឌ និង Loop',            num: '02', color: '#818cf8' },
  { id: 'data',     label: 'Array Management',             num: '03', color: '#22d3ee' },
  { id: 'forms',    label: 'Form & Validation',            num: '04', color: '#fb923c' },
  { id: 'db',       label: 'PHP & Database',               num: '05', color: '#38bdf8' },
  { id: 'auth',     label: 'Login & Session',              num: '06', color: '#f87171' },
  { id: 'files',    label: 'File Upload',                  num: '07', color: '#fbbf24' },
  { id: 'oop',      label: 'OOP in PHP',                   num: '08', color: '#c084fc' },
  { id: 'security', label: 'Security Basics',              num: '09', color: '#f472b6' },
  { id: 'project',  label: 'Final Project',                num: '10', color: '#2dd4bf' },
];

/* ══════════════════════════════════════════════════════════════════
   SLIDE DATA — Real Khmer, technical terms untranslated
══════════════════════════════════════════════════════════════════ */

const slides: Slide[] = [
  // INTRO
  {
    chapter: 'intro', id: 'PH1-S1', accent: '#4ade80',
    title: 'PHP គឺជាអ្វី?', subtitle: 'ការស្វែងយល់ពី Server-Side Scripting',
    icon: Globe,
    concepts: [
      { label: 'Hypertext Preprocessor', desc: 'PHP ជាភាសា scripting ដំណើរការនៅ server ។ Browser ទទួល HTML result — មិន​មើលឃើញ source code PHP ឡើយ ។' },
      { label: 'Client-Server Model', desc: 'Client ផ្ញើ request → Server ដំណើរការ PHP → Return HTML ទៅ browser ។ PHP ដំណើរការ "ពីក្រោយឆាក" ទាំងស្រុង ។' },
      { label: 'Popularity', desc: 'WordPress, Facebook (ដំបូង), Wikipedia — ប្រើ PHP ។ ៧៧% នៃ server-side websites ប្រើ PHP ។' },
      { label: 'LAMP Stack', desc: 'Linux + Apache + MySQL + PHP = LAMP ។ ឬប្រើ XAMPP / Laragon សម្រាប់ local development ។' },
    ],
    tip: 'PHP ដំណើរការលើ server — User browser មើល​មិនឃើញ source code ។ នេះជាអត្ថប្រយោជន៍ security ។',
    lab: 'ពន្យល់ client-side vs server-side execution model ។ ហេតុអ្វី PHP ត្រូវការ web server?',
    result: 'យល់ថា PHP code execute នៅ server ។ Browser ទទួល HTML output ប៉ុណ្ណោះ ។',
    code: `# PHP Request-Response Cycle

Step 1: User visits http://localhost/index.php
Step 2: Apache finds and sends the file to PHP
Step 3: PHP engine executes the script
Step 4: Result (HTML) sent back to browser

# Browser NEVER sees PHP code — only output`,
    filename: 'intro.txt',
    terminalOutput: 'PHP 8.2 — Server-Side Execution Ready',
  },
  {
    chapter: 'intro', id: 'PH1-S2', accent: '#4ade80',
    title: 'XAMPP Setup', subtitle: 'ការ Setup Local Development Environment',
    icon: Server,
    concepts: [
      { label: 'XAMPP Package', desc: 'XAMPP ដំឡើង Apache + MySQL + PHP ក្នុងតែ installer ១ ។ ដំណើរការបានគ្រប់ OS ។' },
      { label: 'Laragon (Windows)', desc: 'Laragon ជា XAMPP alternative ដ៏ light និង fast ជាងសម្រាប់ Windows users ។ Modern PHP development ។' },
      { label: 'htdocs Directory', desc: 'Folder htdocs = document root ។ PHP files ទាំងអស់ត្រូវ​ដាក់ក្នុង htdocs ។ Apache serve files ពី​ folder នេះ ។' },
      { label: 'localhost URL', desc: 'http://localhost/project-name ជា URL ចូលដំណើរការ project ។ Port 80 = Apache, Port 3306 = MySQL ។' },
    ],
    tip: 'Start Apache ជានិច្ចមុនបើក PHP file ក្នុង browser ។ Control Panel ចេញ status "Running" ពណ៌បៃតង ។',
    lab: 'ដំឡើង XAMPP ។ Start Apache + MySQL ។ Create file index.php ក្នុង htdocs ។ Access via browser ។',
    result: 'Apache service running (green) ។ Browser show PHP output via http://localhost ។',
    code: `# XAMPP Setup Steps

1. Download: apachefriends.org/download.html
2. Install XAMPP → Open Control Panel
3. Click "Start" for Apache and MySQL
4. Place PHP files in: C:/xampp/htdocs/
5. Access via: http://localhost/your-project/`,
    filename: 'setup.md',
    terminalOutput: 'Apache/2.4.58 (Win64)\nMySQL: Running on port 3306',
  },
  {
    chapter: 'intro', id: 'PH1-S3', accent: '#4ade80',
    title: 'PHP Syntax', subtitle: 'ចាប់ផ្ដើមសរសេរ PHP Code ដំបូង',
    icon: Code2,
    concepts: [
      { label: '<?php Opening Tag', desc: 'PHP code ត្រូវ​ wrap ក្នុង <?php ... ?> ។ Engine ចាប់ parse code ពី tag <?php ។' },
      { label: 'echo Statement', desc: 'echo បង្ហាញ output ទៅ browser ។ អាច echo string, variable, HTML ។ print ជា alternative ។' },
      { label: 'Semicolon Rule', desc: 'រាល់ statement ត្រូវ​បញ្ចប់ ; ។ Forget semicolon = Parse error ។ PHP ខ្លាំង syntax enforcement ។' },
      { label: 'Comments', desc: '// single-line, # single-line, /* multi-line */ ។ Comments មិន execute — documentation ប៉ុណ្ណោះ ។' },
    ],
    tip: 'File PHP-only (គ្មាន HTML) — omit closing tag ?> ។ Prevents accidental whitespace output ។ Standard practice ។',
    lab: 'Create hello.php ។ echo ឈ្មោះ​ wrapped ក្នុង <strong> tag ។ View ក្នុង browser ។',
    result: 'ឈ្មោះ​បង្ហាញ bold នៅ browser ។ View source shows HTML — មិន​ PHP code ។',
    code: `<?php
// Single-line comment
echo "Hello World!";
echo "<br>";

# Also a comment
echo "<strong>Welcome to PHP</strong>";

/*
  Multi-line comment
  This won't execute
*/
echo "Learning PHP in Cambodia";`,
    filename: 'hello.php',
    terminalOutput: 'Hello World!\nWelcome to PHP\nLearning PHP in Cambodia',
  },
  {
    chapter: 'intro', id: 'PH1-S4', accent: '#4ade80',
    title: 'Variables & Types', subtitle: 'ការរក្សាទុក Data ក្នុង Memory',
    icon: FileCode,
    concepts: [
      { label: '$ Dollar Sign Prefix', desc: 'Variable ទាំងអស់ចាប់ផ្ដើម $ ។ $name, $age, $price — ជា variables ។ Case-sensitive: $Name ≠ $name ។' },
      { label: 'Dynamic Typing', desc: 'PHP auto-detect type ។ $x = "hello" → string ។ $x = 42 → integer ។ Type changes at runtime ។' },
      { label: 'Core Data Types', desc: 'String ("text"), Integer (42), Float (3.14), Boolean (true/false), Null (empty) — types ជ្រើស​ PHP handle ។' },
      { label: 'String Interpolation', desc: '"Hello $name" → PHP replace variable ក្នុង double-quoted string ។ Single-quote \'$name\' → literal $name ។' },
    ],
    tip: 'Variable name មិន​ចាប់ផ្ដើម​ digit ។ ប្រើ snake_case ($user_name) ជា PHP convention ។',
    lab: 'Create variables: $name, $age, $is_student ។ Echo ចេញ​ formatted string ។',
    result: 'Output show ព័ត៌មានពី variables ។ String interpolation work ក្នុង double-quotes ។',
    code: `<?php
$name = "Ratha";
$age  = 21;
$gpa  = 3.85;
$is_student = true;

echo "Name: $name\\n";
echo "Age: $age\\n";
echo "GPA: $gpa\\n";
echo "Student: " . ($is_student ? "Yes" : "No");`,
    filename: 'variables.php',
    terminalOutput: 'Name: Ratha\nAge: 21\nGPA: 3.85\nStudent: Yes',
  },
  {
    chapter: 'intro', id: 'PH1-S5', accent: '#4ade80',
    title: 'Operators', subtitle: 'ការគណនា និង Logic Operations',
    icon: Zap,
    concepts: [
      { label: 'Arithmetic Operators', desc: '+, -, *, /, % (modulo), ** (exponent) ។ % returns remainder: 10 % 3 = 1 ។' },
      { label: 'Comparison Operators', desc: '== (loose equal), === (strict equal type+value), !=, !==, >, <, >=, <= ។ ប្រើ === ជា best practice ។' },
      { label: 'Logical Operators', desc: '&& (AND), || (OR), ! (NOT) ។ Short-circuit: && stops at first false, || stops at first true ។' },
      { label: 'Concatenation (.)', desc: 'dot . operator ភ្ជាប់ strings ។ $first . " " . $last ។ .= append: $str .= " more" ។' },
    ],
    tip: 'PHP dot operator (.) = JavaScript + operator សម្រាប់ string ។ Arithmetic + vs string . ត្រូវ​ distinguish ជានិច្ច ។',
    lab: 'គណនា total price: items [100, 200, 300] ។ Echo formatted total ។',
    result: 'Total: $600 ។ ការ​គណនា arithmetic work ។ String concatenation output ត្រូវ ។',
    code: `<?php
$item1 = 100;
$item2 = 200;
$item3 = 300;
$total = $item1 + $item2 + $item3;

// Comparison
$is_expensive = $total > 500;

echo "Total: $" . $total . "\\n";
echo "Expensive: " . ($is_expensive ? "Yes" : "No");`,
    filename: 'operators.php',
    terminalOutput: 'Total: $600\nExpensive: Yes',
  },

  // LOGIC
  {
    chapter: 'logic', id: 'PH2-S1', accent: '#818cf8',
    title: 'Conditionals', subtitle: '',
    icon: ShieldCheck,
    concepts: [
      { label: 'if Statement', desc: 'Execute code block លុះត្រាតែ condition true ។ if ($age >= 18) { ... } ។' },
      { label: 'else / elseif', desc: 'else handles false case ។ elseif adds more conditions ។ Chain: if → elseif → elseif → else ។' },
      { label: 'Ternary Operator', desc: '$result = condition ? "true_val" : "false_val" ។ One-liner for simple if/else ។' },
      { label: 'switch Statement', desc: 'switch($var) { case "x": ... break; } ។ Cleaner than multiple elseif ។ Always add break ។' },
    ],
    tip: 'ប្រើ === (strict) ជំនួស == (loose) ។ == ប្រៀបធៀប type-coercion: 0 == "a" returns true (bug!) ។',
    lab: 'Check $role variable ។ "admin" → show dashboard message ។ "user" → basic welcome ។ else → access denied ។',
    result: 'Correct message display​ per role ។ Strict comparison prevent type bugs ។',
    code: `<?php
$role = "admin";

if ($role === "admin") {
    echo "Admin Dashboard: Full access granted";
} elseif ($role === "user") {
    echo "User Dashboard: Limited access";
} else {
    echo "Access Denied. Please login.";
}

// Ternary shorthand
$status = ($role === "admin") ? "ADMIN" : "GUEST";
echo "\\nStatus: $status";`,
    filename: 'conditionals.php',
    terminalOutput: 'Admin Dashboard: Full access granted\nStatus: ADMIN',
  },
  {
    chapter: 'logic', id: 'PH2-S2', accent: '#818cf8',
    title: 'Loops', subtitle: 'ការ​ Automate ការងារ​ Repetitive',
    icon: RefreshCw,
    concepts: [
      { label: 'for Loop', desc: 'for ($i = 0; $i < 10; $i++) { } ។ ប្រើ​ពេល​ count ត្រូវ​ known ។ Counter-controlled ។' },
      { label: 'while Loop', desc: 'while (condition) { } ។ Execute ​ condition true ។ ប្រើ​​ count unknown ។' },
      { label: 'do-while Loop', desc: 'do { } while (condition) ។ Execute once ជាមុន ។ Guarantees ≥1 execution ។' },
      { label: 'break / continue', desc: 'break exits loop ។ continue skips to next iteration ។ Avoid infinite loops — always update counter ។' },
    ],
    tip: 'Infinite loop crash server ។ Always ensure condition eventually becomes false ។ Test with small ranges first ។',
    lab: 'for loop print 1–10 ។ while loop print even numbers 2–20 ។',
    result: '1 2 3…10 ។ 2 4 6…20 ។ Loops execute correctly ។',
    code: `<?php
// For loop: 1 to 10
for ($i = 1; $i <= 10; $i++) {
    echo $i . " ";
}
echo "\\n";

// While loop: even numbers
$n = 2;
while ($n <= 20) {
    echo $n . " ";
    $n += 2;
}`,
    filename: 'loops.php',
    terminalOutput: '1 2 3 4 5 6 7 8 9 10\n2 4 6 8 10 12 14 16 18 20',
  },
  {
    chapter: 'logic', id: 'PH2-S3', accent: '#818cf8',
    title: 'Functions', subtitle: 'Reusable Code Blocks',
    icon: Code2,
    concepts: [
      { label: 'Function Declaration', desc: 'function name($param) { return $value; } ។ Define once, call anywhere ។ DRY principle: Don\'t Repeat Yourself ។' },
      { label: 'Parameters & Arguments', desc: 'Parameter = variable ក្នុង definition ។ Argument = value pass​ when calling ។ Default values: function greet($name = "Guest") ។' },
      { label: 'Return Values', desc: 'return sends value back ។ Function without return → returns null ។ Type hints: function add(int $a, int $b): int ។' },
      { label: 'Scope', desc: 'Variables ក្នុង function = local scope ។ Global variables ត្រូវ declare global $var inside function ។' },
    ],
    tip: 'Function name គួរ verb-based: calculateTotal(), getUserById(), validateEmail() ។ Describe what it does ។',
    lab: 'Write function addNums($a, $b) ។ Write function greet($name = "Guest") ។ Call both ។',
    result: 'addNums(10, 20) returns 30 ។ greet() returns "Hello Guest" ។ greet("Ratha") returns "Hello Ratha" ។',
    code: `<?php
function addNums(int $a, int $b): int {
    return $a + $b;
}

function greet(string $name = "Guest"): string {
    return "Hello, " . $name . "!";
}

echo addNums(10, 20) . "\\n";   // 30
echo greet() . "\\n";            // Hello, Guest!
echo greet("Ratha");             // Hello, Ratha!`,
    filename: 'functions.php',
    terminalOutput: '30\nHello, Guest!\nHello, Ratha!',
  },

  // DATA
  {
    chapter: 'data', id: 'PH3-S1', accent: '#22d3ee',
    title: 'Indexed Array', subtitle: 'បញ្ជីទិន្នន័យ​ Index-based',
    icon: List,
    concepts: [
      { label: 'Array Concept', desc: 'Array = variable ១ ផ្ទុក values ច្រើន ។ $colors = ["red", "blue", "green"] ។ Index ចាប់ from 0 ។' },
      { label: 'Index Access', desc: '$colors[0] = "red" ។ Index zero-based ។ Negative index ⟹ error ។ Access out-of-bounds ⟹ null warning ។' },
      { label: 'count() Function', desc: 'count($arr) returns number of elements ។ ប្រើ​​ loops ។ sizeof() ជា alias ។' },
      { label: 'Array Functions', desc: 'array_push(), array_pop(), sort(), array_reverse(), in_array(), array_search() — built-in helpers ។' },
    ],
    tip: 'Array index ចាប់ 0 — element ទី ១ = [0] ។ $arr[count($arr)-1] = last element ។ ឬ end($arr) ។',
    lab: 'Create array $fruits = ["Mango","Durian","Banana"] ។ Echo 2nd fruit ។ Add new fruit ។ Print count ។',
    result: 'Durian (index 1) ។ count shows 4 after push ។ array_push works ។',
    code: `<?php
$fruits = ["Mango", "Durian", "Banana"];

echo $fruits[1] . "\\n";          // Durian (index 1)
echo count($fruits) . "\\n";      // 3

array_push($fruits, "Longan");
echo count($fruits) . "\\n";      // 4

sort($fruits);
echo implode(", ", $fruits);      // sorted`,
    filename: 'indexed_array.php',
    terminalOutput: 'Durian\n3\n4\nBanana, Durian, Longan, Mango',
  },
  {
    chapter: 'data', id: 'PH3-S2', accent: '#22d3ee',
    title: 'Associative Array', subtitle: 'Key-Value Data Structure',
    icon: Layers,
    concepts: [
      { label: 'Key-Value Pairs', desc: '$user = ["name" => "Ratha", "age" => 21] ។ Key = string identifier ។ Access: $user["name"] ។' },
      { label: 'Arrow Syntax =>', desc: '"key" => value ។ Key ចាំបាច់ unique ។ Duplicate key → overwrite previous value ។' },
      { label: 'Practical Use', desc: 'Model real-world objects: user profile, product, config settings ។ JSON-like structure ។' },
      { label: 'Manipulation', desc: 'array_keys(), array_values(), array_merge(), isset($arr["key"]) check existence ។' },
    ],
    tip: 'Associative array ≈ JavaScript object { key: value } ។ JSON encode/decode friendly ។ Database records = assoc arrays ។',
    lab: 'Create $product = ["name","price","stock"] ។ Echo name + formatted price ។',
    result: 'Product info display correctly ។ isset() check key existence work ។',
    code: `<?php
$product = [
    "name"  => "iPhone 15 Pro",
    "price" => 1199.99,
    "stock" => 42,
    "in_stock" => true,
];

echo $product["name"] . "\\n";
echo "Price: $" . $product["price"] . "\\n";
echo "Stock: " . $product["stock"] . " units";`,
    filename: 'assoc_array.php',
    terminalOutput: 'iPhone 15 Pro\nPrice: $1199.99\nStock: 42 units',
  },
  {
    chapter: 'data', id: 'PH3-S3', accent: '#22d3ee',
    title: 'Foreach Loop', subtitle: 'Iterating Over Arrays',
    icon: RotateCcw,
    concepts: [
      { label: 'foreach Syntax', desc: 'foreach ($array as $item) ។ foreach ($array as $key => $value) ។ Auto-iterate — no counter needed ។' },
      { label: 'Indexed Iteration', desc: 'foreach ($colors as $color) { echo $color; } ។ $color = current element each iteration ។' },
      { label: 'Assoc Iteration', desc: 'foreach ($user as $key => $val) ។ Access both key + value simultaneously ។' },
      { label: 'HTML Rendering', desc: 'foreach inside HTML: generate <li>, <tr>, <option> ។ Most common pattern ​ views ។' },
    ],
    tip: 'foreach ​ preferred over for loop ​ arrays ។ Cleaner, no index management, works both indexed + assoc ។',
    lab: 'foreach ​ print all fruits ។ foreach ​ $user assoc array ​ print key: value pairs ។',
    result: 'Each fruit prints on new line ។ User info prints as key: value ។',
    code: `<?php
$fruits = ["Mango", "Durian", "Banana", "Longan"];

foreach ($fruits as $fruit) {
    echo "Fruit: $fruit\\n";
}

echo "---\\n";

$user = ["name" => "Ratha", "age" => 21, "city" => "Phnom Penh"];
foreach ($user as $key => $value) {
    echo "$key: $value\\n";
}`,
    filename: 'foreach.php',
    terminalOutput: 'Fruit: Mango\nFruit: Durian\nFruit: Banana\nFruit: Longan\n---\nname: Ratha\nage: 21\ncity: Phnom Penh',
  },
  {
    chapter: 'data', id: 'PH3-S4', accent: '#22d3ee',
    title: 'Array Functions', subtitle: 'Built-in Array Manipulation',
    icon: Zap,
    concepts: [
      { label: 'array_map()', desc: 'Transform every element ។ array_map(fn($x) => $x * 2, $arr) ។ Returns new array — original unchanged ។' },
      { label: 'array_filter()', desc: 'Keep elements where callback returns true ។ array_filter($arr, fn($x) => $x > 10) ។' },
      { label: 'array_reduce()', desc: 'Reduce array to single value ។ Sum, product, concatenation ។ Most powerful of the three ។' },
      { label: 'implode / explode', desc: 'implode(", ", $arr) → "a, b, c" string ។ explode(",", "a,b,c") → ["a","b","c"] ។' },
    ],
    tip: 'array_map + array_filter + array_reduce = functional programming ។ Cleaner code vs manual loops ។ Learn all three ។',
    lab: 'array_map discount 20% on $prices ។ array_filter keep > 100 ។ implode result ។',
    result: 'Discounted prices calculated ។ Filtered array correct ។ implode output formatted string ។',
    code: `<?php
$prices = [80, 150, 50, 300, 120];

// Apply 20% discount
$discounted = array_map(fn($p) => $p * 0.8, $prices);

// Keep items > 100
$premium = array_filter($discounted, fn($p) => $p > 100);

echo "Discounted: " . implode(", ", $discounted) . "\\n";
echo "Premium: "    . implode(", ", $premium);`,
    filename: 'array_funcs.php',
    terminalOutput: 'Discounted: 64, 120, 40, 240, 96\nPremium: 120, 240',
  },

  // FORMS
  {
    chapter: 'forms', id: 'PH4-S1', accent: '#fb923c',
    title: 'GET vs POST', subtitle: 'HTTP Methods ​ Form Submission',
    icon: Layout,
    concepts: [
      { label: 'GET Method', desc: 'Data visible ​ URL: ?name=Ratha&age=21 ។ Bookmarkable, cacheable ។ ​ search, filter, read operations only ។' },
      { label: 'POST Method', desc: 'Data hidden ​ request body ។ Secure ​ passwords, sensitive data ។ Cannot bookmark ។ ​ create/update/delete ។' },
      { label: '$_GET Superglobal', desc: '$_GET["key"] ។ Access URL parameters ។ Always validate — users can manipulate URL ។' },
      { label: '$_POST Superglobal', desc: '$_POST["key"] ។ Access form data ។ Still must validate/sanitize — POST not automatically safe ។' },
    ],
    tip: 'POST ≠ secure by default ។ POST hides data from URL but not from browser DevTools ។ Always use HTTPS + validation ។',
    lab: 'Simulate $_POST submission ។ Access name + email ។ Echo greeting ។',
    result: 'Data accessible via $_POST["key"] ។ Nullish coalescing ?? provides fallback ។',
    code: `<?php
// Simulating POST form submission
$_POST["username"] = "Ratha";
$_POST["email"]    = "ratha@example.com";

$username = $_POST["username"] ?? "Guest";
$email    = $_POST["email"]    ?? "no-email";

echo "Welcome, $username!\\n";
echo "Email: $email";`,
    filename: 'forms.php',
    terminalOutput: 'Welcome, Ratha!\nEmail: ratha@example.com',
  },
  {
    chapter: 'forms', id: 'PH4-S2', accent: '#fb923c',
    title: 'Validation & Sanitization', subtitle: 'Never Trust User Input',
    icon: ShieldCheck,
    concepts: [
      { label: 'Golden Rule', desc: 'Never trust user input ។ Validate format, sanitize content — every form field, every time ។' },
      { label: 'htmlspecialchars()', desc: 'Convert HTML special chars to entities ។ < → &lt; ។ Prevents XSS (Cross-Site Scripting) attacks ។' },
      { label: 'filter_var()', desc: 'FILTER_VALIDATE_EMAIL, FILTER_VALIDATE_URL, FILTER_SANITIZE_STRING ។ Built-in PHP validators ។' },
      { label: 'empty() / isset()', desc: 'isset($var) checks if variable exists + not null ។ empty($var) checks falsy values "" 0 null [] ។' },
    ],
    tip: 'Sanitize before display, validate before store ។ Two different concerns — do both ​ ​ order ។',
    lab: 'Sanitize input with htmlspecialchars() ។ Validate email with filter_var() ។',
    result: 'Malicious HTML tags converted to safe entities ។ Invalid email rejected ។',
    code: `<?php
$raw_input = "<script>alert('XSS')</script> Hello!";
$safe      = htmlspecialchars($raw_input, ENT_QUOTES, 'UTF-8');

echo $safe . "\\n";

// Email validation
$email = "ratha@example.com";
if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "Valid email: $email";
} else {
    echo "Invalid email format";
}`,
    filename: 'validation.php',
    terminalOutput: '&lt;script&gt;alert(\'XSS\')&lt;/script&gt; Hello!\nValid email: ratha@example.com',
  },

  // DB
  {
    chapter: 'db', id: 'PH5-S1', accent: '#38bdf8',
    title: 'PDO Connection', subtitle: 'PHP Data Objects — Database Bridge',
    icon: Database,
    concepts: [
      { label: 'PDO Interface', desc: 'PDO = PHP Data Objects ។ Unified API ​ MySQL, PostgreSQL, SQLite ។ Modern + secure ​ raw mysqli ។' },
      { label: 'DSN String', desc: '"mysql:host=localhost;dbname=mydb;charset=utf8mb4" ។ Data Source Name defines connection details ។' },
      { label: 'try/catch Block', desc: 'Wrap connection ​ try/catch ​ handle PDOException ។ Never crash silently — always catch errors ។' },
      { label: 'PDO Attributes', desc: 'PDO::ATTR_ERRMODE = ERRMODE_EXCEPTION ។ PDO::ATTR_DEFAULT_FETCH_MODE = FETCH_ASSOC ។' },
    ],
    tip: 'Store DB credentials ​ .env file — never hard-code ​ source code ។ .env + .gitignore = security ។',
    lab: 'Write PDO connection code ។ Set ERRMODE_EXCEPTION ។ Echo success message ។',
    result: '"Connection Successful!" ។ PDOException caught if wrong credentials ។',
    code: `<?php
$host = "localhost";
$db   = "my_database";
$user = "root";
$pass = "";

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$db;charset=utf8mb4",
        $user, $pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
         PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
    );
    echo "Connection Successful!";
} catch (PDOException $e) {
    die("DB Error: " . $e->getMessage());
}`,
    filename: 'connection.php',
    terminalOutput: 'Connection Successful!',
  },
  {
    chapter: 'db', id: 'PH5-S2', accent: '#38bdf8',
    title: 'CRUD Operations', subtitle: 'Create · Read · Update · Delete',
    icon: Database,
    concepts: [
      { label: 'SELECT (Read)', desc: '$pdo->query("SELECT * FROM users") ។ fetch() = one row ។ fetchAll() = all rows ។ Return assoc array ។' },
      { label: 'INSERT (Create)', desc: 'prepare() + execute() ។ Never concatenate user input ​ SQL string — SQL injection risk ។' },
      { label: 'UPDATE / DELETE', desc: 'Always use WHERE clause ។ Missing WHERE = update/delete ALL rows ។ Test ​ SELECT first ។' },
      { label: 'Prepared Statements', desc: 'Parameterized queries: ? or :name placeholders ។ PDO escapes input automatically ។ Prevention SQL injection ។' },
    ],
    tip: 'Prepared statements ≠ optional ។ Raw string concatenation ​ SQL = SQL injection vulnerability ។ Always prepare() + execute() ។',
    lab: 'Write SELECT query ​ WHERE id = ? ។ Pass id via execute([$id]) ។',
    result: 'User data fetched securely ។ No SQL injection possible with prepared statements ។',
    code: `<?php
// READ — Prepared statement
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([1]);
$user = $stmt->fetch();
echo "User: " . htmlspecialchars($user["name"]) . "\\n";

// INSERT — Named placeholders
$stmt = $pdo->prepare(
    "INSERT INTO users (name, email) VALUES (:name, :email)"
);
$stmt->execute(["name" => "Ratha", "email" => "r@example.com"]);
echo "Inserted ID: " . $pdo->lastInsertId();`,
    filename: 'crud.php',
    terminalOutput: 'User: Ratha\nInserted ID: 42',
  },

  // AUTH
  {
    chapter: 'auth', id: 'PH6-S1', accent: '#f87171',
    title: 'Sessions', subtitle: 'ការ​ Persist State ​ Across Requests',
    icon: User,
    concepts: [
      { label: 'HTTP Stateless Problem', desc: 'HTTP is stateless — ​ request is independent ។ Server doesn\'t remember previous requests ។ Sessions solve this ។' },
      { label: 'session_start()', desc: 'Must call ​ every page ​ wants session access ។ Place ​ very top — before any output ។' },
      { label: '$_SESSION Array', desc: '$_SESSION["user_id"] = 42 ។ Persists across pages ។ Stored server-side ។ Session ID ​ cookie ។' },
      { label: 'Session Destruction', desc: 'session_destroy() ​ logout ។ unset($_SESSION["key"]) ​ single value ។ session_regenerate_id() ​ security ។' },
    ],
    tip: 'Regenerate session ID after login: session_regenerate_id(true) ។ Prevents session fixation attacks ។',
    lab: 'session_start() ។ Set $_SESSION["user_name"] ។ Access ​ same request ​ verify persistence ។',
    result: 'Session data accessible ។ session_start() required before any $_SESSION access ។',
    code: `<?php
session_start();

// Store user data in session
$_SESSION["user_id"]   = 42;
$_SESSION["user_name"] = "Ratha";
$_SESSION["role"]      = "admin";

echo "Session started for: " . $_SESSION["user_name"] . "\\n";
echo "Role: " . $_SESSION["role"] . "\\n";
echo "Session ID: " . session_id();`,
    filename: 'session.php',
    terminalOutput: 'Session started for: Ratha\nRole: admin\nSession ID: abc123xyz789',
  },
  {
    chapter: 'auth', id: 'PH6-S2', accent: '#f87171',
    title: 'Password Hashing', subtitle: 'Secure Credential Storage',
    icon: Lock,
    concepts: [
      { label: 'Never Store Plain-text', desc: 'Plain-text passwords ​ DB = catastrophic breach ។ Always hash ​ storing ។ Hash is one-way ។' },
      { label: 'password_hash()', desc: 'password_hash($pass, PASSWORD_DEFAULT) ។ Auto-salts ។ Uses bcrypt by default ។ Secure and simple ។' },
      { label: 'password_verify()', desc: 'password_verify($input, $hash) ។ Compare plain input against stored hash ។ Returns true/false ។' },
      { label: 'Auto Salt', desc: 'PHP auto-generates salt — never implement your own ។ PASSWORD_BCRYPT, PASSWORD_ARGON2ID options ។' },
    ],
    tip: 'Never MD5 or SHA1 passwords — cryptographically broken ។ password_hash() with PASSWORD_DEFAULT is the minimum standard ។',
    lab: 'Hash "secret123" ​ password_hash() ។ Verify ​ password_verify() ។',
    result: 'Hash generated (60 chars) ។ password_verify() returns true for correct password ។',
    code: `<?php
$password = "secret123";

// Hash the password (use PASSWORD_DEFAULT)
$hash = password_hash($password, PASSWORD_DEFAULT);
echo "Hash: " . substr($hash, 0, 25) . "...\\n";

// Verify on login
$input = "secret123";  // from login form
if (password_verify($input, $hash)) {
    echo "Password correct — login granted!";
} else {
    echo "Wrong password.";
}`,
    filename: 'password.php',
    terminalOutput: 'Hash: $2y$10$KIjFqVnqrF...\nPassword correct — login granted!',
  },

  // FILES
  {
    chapter: 'files', id: 'PH7-S1', accent: '#fbbf24',
    title: 'File Upload', subtitle: 'ការ​ Handle Uploaded Files Securely',
    icon: HardDrive,
    concepts: [
      { label: 'enctype Requirement', desc: '<form enctype="multipart/form-data"> ។ Required ​ file uploads ​ work ។ Without it, $_FILES is empty ។' },
      { label: '$_FILES Superglobal', desc: '$_FILES["field"]["name"], ["type"], ["size"], ["tmp_name"], ["error"] ។ tmp_name = temporary path ។' },
      { label: 'move_uploaded_file()', desc: 'Move from tmp to destination ។ move_uploaded_file($tmp, "uploads/$name") ។ Validates upload origin ។' },
      { label: 'Security Checks', desc: 'Validate MIME type, extension whitelist, file size ។ Never trust $_FILES["type"] — check real MIME ។' },
    ],
    tip: 'Rename uploaded files ​ save — prevent overwriting ​ directory traversal attacks ។ uniqid() + extension ។',
    lab: 'Handle $_FILES["profile"] ។ Check error == 0 ។ move_uploaded_file() to uploads/ ។',
    result: 'File moves successfully ។ Error handling catches upload failures ។',
    code: `<?php
if (isset($_FILES["profile"])) {
    $file = $_FILES["profile"];
    
    // Check for upload errors
    if ($file["error"] !== UPLOAD_ERR_OK) {
        die("Upload failed: " . $file["error"]);
    }
    
    // Validate extension
    $ext = pathinfo($file["name"], PATHINFO_EXTENSION);
    $allowed = ["jpg","jpeg","png","gif"];
    
    if (in_array(strtolower($ext), $allowed)) {
        $new_name = uniqid() . "." . $ext;
        move_uploaded_file($file["tmp_name"], "uploads/$new_name");
        echo "Uploaded: $new_name";
    }
}`,
    filename: 'upload.php',
    terminalOutput: 'Uploaded: 65a1b2c3d4e5f.jpg',
  },

  // OOP
  {
    chapter: 'oop', id: 'PH8-S1', accent: '#c084fc',
    title: 'Classes & Objects', subtitle: 'Object-Oriented Programming Fundamentals',
    icon: Code2,
    concepts: [
      { label: 'Class = Blueprint', desc: 'class User { } ។ Class defines structure ។ Object = instance of class ។ $user = new User() ។' },
      { label: 'Properties', desc: 'Variables inside class ។ public $name ។ private $password (hidden) ។ Access with $this->name ។' },
      { label: '__construct()', desc: 'Magic method called ​ new ClassName() ។ Initialize properties ។ $this->name = $name ។' },
      { label: 'Methods', desc: 'Functions inside class ។ public function introduce() ។ Access: $user->introduce() ។' },
    ],
    tip: 'OOP = organize code ​ objects with data + behavior ។ Easier to manage as projects grow ។ Framework backbone ។',
    lab: 'Create class Car ​ properties brand, model, year ។ Method describe() ​ return info string ។',
    result: 'new Car("Toyota","Camry",2024)->describe() works ។ Multiple objects from one class ។',
    code: `<?php
class User {
    public string $name;
    private string $email;

    public function __construct(string $name, string $email) {
        $this->name  = $name;
        $this->email = $email;
    }

    public function introduce(): string {
        return "Hi, I am {$this->name}";
    }

    public function getEmail(): string {
        return $this->email;  // controlled access
    }
}

$user = new User("Ratha", "r@example.com");
echo $user->introduce() . "\\n";
echo $user->getEmail();`,
    filename: 'oop.php',
    terminalOutput: 'Hi, I am Ratha\nr@example.com',
  },

  // SECURITY
  {
    chapter: 'security', id: 'PH9-S1', accent: '#f472b6',
    title: 'SQL Injection', subtitle: 'Most Critical Web Vulnerability',
    icon: ShieldAlert,
    concepts: [
      { label: 'The Attack', desc: 'Attacker injects SQL code via input ។ username: admin\'-- ​ logs in without password ។ Can dump entire database ។' },
      { label: 'String Concatenation Danger', desc: '"SELECT * FROM users WHERE id = " . $id → DANGEROUS ។ $id = "1 OR 1=1" → returns all rows ។' },
      { label: 'Prepared Statements', desc: 'Parameterize ALL user input ។ prepare() + execute([$val]) ។ PDO separates SQL from data — impossible to inject ។' },
      { label: 'Input Validation', desc: 'Validate type, range, format before DB ។ Reject unexpected input early ​ application level ។' },
    ],
    tip: 'Never concatenate user input into SQL ​ any form ។ No exceptions ។ Even admin interfaces must use prepared statements ។',
    lab: 'Compare vulnerable vs secure query ​ same operation ។',
    result: 'Secure version uses prepare() + execute() ។ No SQL injection possible ​ parameterized queries ។',
    code: `<?php
// DANGEROUS — Never do this!
// $id = $_GET["id"];  // could be "1 OR 1=1"
// $sql = "SELECT * FROM users WHERE id = " . $id;

// SECURE — Always use prepared statements
$id = $_GET["id"] ?? 1;

$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$id]);
$user = $stmt->fetch();

if ($user) {
    echo "Found: " . htmlspecialchars($user["name"]);
} else {
    echo "User not found";
}`,
    filename: 'sql_security.php',
    terminalOutput: 'Found: Ratha',
  },

  // PROJECT
  {
    chapter: 'project', id: 'PH10-S1', accent: '#2dd4bf',
    title: 'Project Structure', subtitle: 'Folder Architecture & MVC Pattern',
    icon: Layout,
    concepts: [
      { label: 'Separation of Concerns', desc: 'Controllers handle logic ។ Models handle data ។ Views handle display ។ MVC = clean, maintainable code ។' },
      { label: 'Entry Point', desc: 'index.php = single entry point ។ All requests route through it ។ Router directs to correct controller ។' },
      { label: 'Autoloading', desc: 'Composer autoloader: spl_autoload_register ។ PSR-4 standard ។ require_once manually otherwise ។' },
      { label: 'Environment Config', desc: '.env file for DB credentials, API keys ។ .gitignore .env ។ Never commit secrets ។' },
    ],
    tip: 'Good folder structure ​ beginning saves hours of refactoring later ។ Follow PSR-4 naming conventions ។',
    lab: 'Design folder structure ​ blog app: posts, users, auth ។',
    result: 'Clear separation: controllers/, models/, views/ ។ index.php as router entry point ។',
    code: `# PHP Project Structure (MVC)

/my-project
├── public/
│   └── index.php          # Entry point (route all requests here)
├── src/
│   ├── Controllers/
│   │   └── PostController.php
│   ├── Models/
│   │   └── Post.php
│   └── Views/
│       └── posts/index.php
├── config/
│   └── database.php
├── .env                   # Never commit this!
├── .gitignore
└── composer.json`,
    filename: 'structure.txt',
    terminalOutput: 'Project structure initialized ✓',
  },
  {
    chapter: 'project', id: 'PH10-S2', accent: '#2dd4bf',
    title: 'Deployment', subtitle: 'Going Live — Production Checklist',
    icon: Rocket,
    concepts: [
      { label: 'Error Display OFF', desc: 'ini_set("display_errors", 0) ​ production ។ Log errors to file instead ។ Never show errors to users ។' },
      { label: 'Security Audit', desc: 'All inputs validated/sanitized ។ All queries use prepared statements ។ Passwords hashed ។ HTTPS enabled ។' },
      { label: 'HTTPS Required', desc: 'SSL certificate mandatory ​ production ។ Free via Let\'s Encrypt ។ HTTP → HTTPS redirect always ។' },
      { label: 'Performance', desc: 'Compress images ។ Enable PHP OPcache ។ Minify CSS/JS ។ Use CDN ​ static assets ។' },
    ],
    tip: 'Create deployment checklist ។ Run through every point before going live ។ Rollback plan if launch fails ។',
    lab: 'Production config: hide errors, set environment constants ។',
    result: 'Site live ​ no error output ​ ENVIRONMENT=production mode ។',
    code: `<?php
// config/production.php
define("ENVIRONMENT", "production");

if (ENVIRONMENT === "production") {
    ini_set("display_errors", 0);
    ini_set("log_errors", 1);
    ini_set("error_log", "/var/log/php_errors.log");
} else {
    ini_set("display_errors", 1);
    error_reporting(E_ALL);
}

echo "Site is LIVE.\\n";
echo "Environment: " . ENVIRONMENT;`,
    filename: 'production.php',
    terminalOutput: 'Site is LIVE.\nEnvironment: production',
  },
];

/* ══════════════════════════════════════════════════════════════════
   SYNTAX HIGHLIGHTER
══════════════════════════════════════════════════════════════════ */

const PHP_KW = new Set([
  'php','echo','return','if','else','elseif','foreach','for','while','do',
  'class','extends','implements','namespace','use','new','public','protected',
  'private','static','function','fn','array','string','int','float','bool',
  'void','null','true','false','require','include','throw','try','catch',
  'match','readonly','const','switch','case','break','continue','die',
  'isset','empty','unset',
]);

const tokenizeLine = (line: string): React.ReactNode[] => {
  if (/^\s*(\/\/|#|\/\*|\*)/.test(line))
    return [<span key="c" style={{ color: '#374151', fontStyle: 'italic' }}>{line}</span>];
  const parts = line.split(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\$[a-zA-Z_]\w*|\b\d+(?:\.\d+)?\b|\b[a-zA-Z_]\w*\b)/g);
  return parts.map((p, i) => {
    if (!p) return null;
    if (p.startsWith('$'))    return <span key={i} style={{ color: '#fbbf24' }}>{p}</span>;
    if (PHP_KW.has(p))        return <span key={i} style={{ color: '#f87171', fontWeight: 700 }}>{p}</span>;
    if (p.startsWith('"') || p.startsWith("'")) return <span key={i} style={{ color: '#86efac' }}>{p}</span>;
    if (/^\d/.test(p))        return <span key={i} style={{ color: '#c084fc' }}>{p}</span>;
    if (/^[A-Z]/.test(p))    return <span key={i} style={{ color: '#fbbf24' }}>{p}</span>;
    return <span key={i} style={{ color: '#94a3b8' }}>{p}</span>;
  });
};

const HighlightedCode = ({ code }: { code: string }) => (
  <div style={{ fontFamily: "'JetBrains Mono','Fira Code',monospace", fontSize: 13, lineHeight: 1.8, whiteSpace: 'pre' }}>
    {code.split('\n').map((line, i) => <div key={i} style={{ minHeight: '1.8em' }}>{tokenizeLine(line)}</div>)}
  </div>
);

/* ══════════════════════════════════════════════════════════════════
   CODE PANEL
══════════════════════════════════════════════════════════════════ */

const CodePanel = ({ code: initCode, terminal, terminalOutput, accent, filename }: {
  code: string; terminal?: string; terminalOutput?: string; accent: string; filename: string;
}) => {
  const [tab, setTab]       = useState<'code' | 'terminal'>('code');
  const [code, setCode]     = useState(initCode);
  const [copied, setCopied] = useState(false);
  const [running, setRunning] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const hlRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setCode(initCode); }, [initCode]);

  const copy = () => {
    navigator.clipboard.writeText(tab === 'code' ? code : terminalOutput || '');
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
      border: '1px solid rgba(255,255,255,0.06)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    }}>
      {/* Title bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '9px 13px', background: '#0a0e1a',
        borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {['#ff5f57','#febc2e','#28c840'].map(c => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }}/>
            ))}
          </div>
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', borderRadius: 7, padding: 3, border: '1px solid rgba(255,255,255,0.05)', marginLeft: 6 }}>
            {(['code','terminal'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 5,
                border: 'none', cursor: 'pointer', fontSize: 9.5,
                fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
                fontFamily: "'JetBrains Mono',monospace",
                background: tab === t ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: tab === t ? '#e2e8f0' : '#374151', transition: 'all 0.18s',
              }}>
                {t === 'code' ? <Code2 size={9}/> : <Terminal size={9}/>}
                {t === 'code' ? 'Code' : 'Output'}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={async () => {
            setTab('terminal'); setRunning(true);
            await new Promise(r => setTimeout(r, 700)); setRunning(false);
          }} disabled={running} style={{
            display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px',
            borderRadius: 5, border: 'none', cursor: running ? 'not-allowed' : 'pointer',
            fontSize: 9.5, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
            fontFamily: "'JetBrains Mono',monospace",
            background: `${accent}15`, color: running ? '#374151' : accent, transition: 'all 0.18s',
          }}>
            <Play size={9}/> {running ? 'Running…' : 'Run'}
          </button>
          <button onClick={() => setCode(initCode)} style={{
            padding: 5, borderRadius: 5, border: 'none', cursor: 'pointer',
            background: 'transparent', color: '#374151', transition: 'color 0.18s',
          }}>
            <RotateCcw size={12}/>
          </button>
          <button onClick={copy} style={{
            padding: 5, borderRadius: 5, border: 'none', cursor: 'pointer',
            background: 'transparent', color: copied ? '#4ade80' : '#374151', transition: 'color 0.18s',
          }}>
            {copied ? <Check size={13}/> : <Copy size={13}/>}
          </button>
        </div>
      </div>

      {/* Path bar */}
      <div style={{
        padding: '4px 13px', background: 'rgba(10,14,26,0.7)',
        borderBottom: '1px solid rgba(255,255,255,0.04)', flexShrink: 0,
        fontFamily: "'JetBrains Mono',monospace",
        fontSize: 9.5, color: '#1f2937', display: 'flex', alignItems: 'center', gap: 5,
      }}>
        <span style={{ color: `${accent}60` }}>~/php-project</span>
        <span>/</span>
        <span>{tab === 'code' ? filename : 'bash'}</span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {tab === 'code' ? (
          <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
            <div style={{
              flexShrink: 0, width: 40, background: '#06080f',
              borderRight: '1px solid rgba(255,255,255,0.04)',
              paddingTop: 14, display: 'flex', flexDirection: 'column',
              alignItems: 'flex-end', paddingRight: 9, userSelect: 'none',
              fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: '#1a2030',
            }}>
              {code.split('\n').map((_, i) => <div key={i} style={{ lineHeight: '1.8em', height: '1.8em' }}>{i + 1}</div>)}
            </div>
            <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
              <div ref={hlRef} style={{ position: 'absolute', inset: 0, overflow: 'auto', padding: 14, pointerEvents: 'none' }}>
                <HighlightedCode code={code}/>
              </div>
              <textarea ref={taRef} value={code} onChange={e => setCode(e.target.value)} onScroll={syncScroll}
                style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  background: 'transparent', color: 'transparent', resize: 'none',
                  outline: 'none', padding: 14, fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 13, lineHeight: 1.8, border: 'none', overflow: 'auto', caretColor: '#fff',
                }} spellCheck={false} wrap="off"
              />
            </div>
          </div>
        ) : (
          <div style={{ padding: '14px 16px', fontFamily: "'JetBrains Mono',monospace", fontSize: 12.5, lineHeight: 1.9, overflow: 'auto', height: '100%' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ color: accent }}>❯</span>
              <span style={{ color: '#38bdf8' }}>~/php-project</span>
              <span style={{ color: '#1f2937' }}>$</span>
              <span style={{ color: '#e2e8f0' }}>{terminal || 'php ' + filename}</span>
            </div>
            {running ? (
              <span style={{ color: '#374151', fontStyle: 'italic' }}>Executing…</span>
            ) : terminalOutput ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <CheckCircle2 size={11} style={{ color: '#4ade80' }}/>
                  <span style={{ fontSize: 9, fontWeight: 800, color: '#166534', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Output</span>
                </div>
                <pre style={{ color: '#64748b', whiteSpace: 'pre-wrap', margin: 0, lineHeight: 1.75 }}>{terminalOutput}</pre>
              </div>
            ) : (
              <span style={{ color: '#1f2937' }}>Click Run to execute ↑</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════ */

export default function PHPLessonContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const chapterParam = searchParams.get('chapter') || 'intro';

  const displaySlides = slides.filter(s => s.chapter === chapterParam);
  const safeSlides    = displaySlides.length > 0 ? displaySlides : slides.filter(s => s.chapter === 'intro');

  const slideParam   = searchParams.get('slide');
  const initialSlide = slideParam
    ? Math.max(0, Math.min(parseInt(slideParam) - 1, safeSlides.length - 1))
    : 0;

  const [current,     setCurrent]     = useState(initialSlide);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dir,         setDir]         = useState(1);
  const [showNotes,   setShowNotes]   = useState(false);
  const [isMenuOpen,  setIsMenuOpen]  = useState(false);
  const [notes,       setNotes]       = useState<Record<string, string>>({});

  const slide = safeSlides[current] ?? safeSlides[0];
  const Icon  = slide.icon;
  const ch    = CHAPTERS.find(c => c.id === chapterParam) ?? CHAPTERS[0];

  useEffect(() => {
    try {
      const saved = localStorage.getItem('php_notes_v2');
      if (saved) setNotes(JSON.parse(saved));
    } catch {}
  }, []);

  const saveNote = (val: string) => {
    const next = { ...notes, [slide.id]: val };
    setNotes(next);
    localStorage.setItem('php_notes_v2', JSON.stringify(next));
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (current === 0) params.delete('slide');
    else params.set('slide', String(current + 1));
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [current]);

  const goTo = useCallback((idx: number, d: number) => {
    if (isAnimating) return;
    setDir(d); setIsAnimating(true);
    setTimeout(() => { setCurrent(idx); setIsAnimating(false); }, 250);
  }, [isAnimating]);

  const next = useCallback(() => {
    if (current < safeSlides.length - 1) { goTo(current + 1, 1); return; }
    // wrap around
    goTo(0, 1);
  }, [current, safeSlides.length, goTo]);

  const prev = useCallback(() => {
    if (current > 0) { goTo(current - 1, -1); return; }
    goTo(safeSlides.length - 1, -1);
  }, [current, safeSlides.length, goTo]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); prev(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev]);

  const V = {
    enter: (d: number) => ({ x: d > 0 ? 32 : -32, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -32 : 32, opacity: 0 }),
  };

  /* ─── RENDER ─────────────────────────────────────────────────── */
  return (
    <div style={{
      minHeight: '100vh', background: '#030509',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      fontFamily: "'Noto Sans Khmer','Hanuman',serif",
    }}>
      {/* Fonts + global */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer:wght@300;400;500;600;700;900&family=Hanuman:wght@400;700;900&family=JetBrains+Mono:ital,wght@0,400;0,700;0,800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; height: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 2px; }
        button { cursor: pointer; }
      `}</style>

      {/* Grid BG */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),' +
          'linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)',
        backgroundSize: '52px 52px',
      }}/>
      {/* Chapter glow */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `radial-gradient(ellipse 55% 60% at 70% 50%, ${slide.accent}09 0%, transparent 65%)`,
        transition: 'background 1.2s ease',
      }}/>

      {/* ════════════ HEADER */}
      <header style={{
        position: 'relative', zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: 58,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(3,5,9,0.85)', backdropFilter: 'blur(24px)',
        flexShrink: 0,
      }}>
        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/courses/backend" style={{
            display: 'flex', alignItems: 'center', gap: 7, height: 34, padding: '0 12px',
            borderRadius: 8, textDecoration: 'none',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
            color: '#4b5563', transition: 'all 0.18s',
          }}>
            <ArrowLeft size={12}/>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.05em' }}>Back</span>
          </Link>

          <button onClick={() => setIsMenuOpen(o => !o)} style={{
            display: 'flex', alignItems: 'center', gap: 9, height: 34, padding: '0 12px',
            borderRadius: 8, border: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(255,255,255,0.04)', color: '#e2e8f0', transition: 'all 0.18s',
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: 5, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: isMenuOpen ? ch.color : 'rgba(255,255,255,0.07)',
              color: isMenuOpen ? '#000' : '#6b7280', transition: 'all 0.22s',
            }}>
              {isMenuOpen ? <X size={11}/> : <Menu size={11}/>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{
                fontSize: 8.5, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase',
                color: ch.color, lineHeight: 1.1, fontFamily: "'JetBrains Mono',monospace",
              }}>Chapter {ch.num}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', lineHeight: 1.2 }}>{ch.label}</span>
            </div>
            <ChevronDown size={12} style={{
              color: '#374151',
              transform: isMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s',
            }}/>
          </button>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Dot nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            {safeSlides.map((_, i) => (
              <button key={i} onClick={() => goTo(i, i > current ? 1 : -1)} style={{
                width: i === current ? 20 : 5, height: 5, borderRadius: 3,
                background: i === current ? ch.color : i < current ? `${ch.color}35` : 'rgba(255,255,255,0.08)',
                border: 'none', padding: 0,
                transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
              }}/>
            ))}
            <span style={{
              marginLeft: 8, fontSize: 9.5, color: '#2d3748',
              fontFamily: "'JetBrains Mono',monospace", fontWeight: 700,
            }}>{current + 1}/{safeSlides.length}</span>
          </div>

          <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.06)' }}/>

          {[{ icon: ChevronLeft, action: prev }, { icon: ChevronRight, action: next }].map(({ icon: Ic, action }, k) => (
            <button key={k} onClick={action} style={{
              width: 34, height: 34, borderRadius: 8, border: '1px solid rgba(255,255,255,0.07)',
              background: 'rgba(255,255,255,0.04)', color: '#4b5563', transition: 'all 0.18s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Ic size={14}/>
            </button>
          ))}

          <button onClick={() => setShowNotes(o => !o)} style={{
            width: 34, height: 34, borderRadius: 8,
            border: `1px solid ${showNotes ? 'rgba(251,191,36,0.25)' : 'rgba(255,255,255,0.07)'}`,
            background: showNotes ? 'rgba(251,191,36,0.07)' : 'rgba(255,255,255,0.04)',
            color: showNotes ? '#fbbf24' : '#4b5563', transition: 'all 0.18s',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <StickyNote size={14}/>
          </button>
        </div>
      </header>

      {/* ════════════ CHAPTER MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)' }}
            />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.32,0.72,0,1] }}
              style={{
                position: 'fixed', top: 66, left: 20, zIndex: 90,
                width: 520, background: '#080b15',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16, overflow: 'hidden',
                boxShadow: '0 24px 60px rgba(0,0,0,0.7)',
              }}
            >
              <div style={{ padding: 6, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                {CHAPTERS.map((c, i) => {
                  const active = c.id === chapterParam;
                  return (
                    <button key={c.id}
                      onClick={() => { router.push(`?chapter=${c.id}`); setIsMenuOpen(false); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 12px', borderRadius: 10,
                        border: `1px solid ${active ? 'rgba(255,255,255,0.1)' : 'transparent'}`,
                        background: active ? 'rgba(255,255,255,0.04)' : 'transparent',
                        color: '#e2e8f0', transition: 'all 0.18s',
                      }}
                    >
                      <div style={{
                        width: 32, height: 32, borderRadius: 7, flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: active ? c.color : `${c.color}14`,
                        color: active ? '#000' : c.color,
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: 10, fontWeight: 900,
                      }}>{c.num}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
                        <span style={{
                          fontSize: 8.5, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase',
                          color: c.color, fontFamily: "'JetBrains Mono',monospace",
                        }}>Chapter {i + 1}</span>
                        <span style={{
                          fontSize: 11.5, fontWeight: 600,
                          color: active ? '#f1f5f9' : '#64748b',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>{c.label}</span>
                      </div>
                      {active && <div style={{ marginLeft: 'auto', flexShrink: 0, width: 5, height: 5, borderRadius: '50%', background: c.color }}/>}
                    </button>
                  );
                })}
              </div>
              <div style={{
                padding: '8px 16px', borderTop: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', justifyContent: 'space-between',
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 8.5, color: '#1f2937', letterSpacing: '0.12em', textTransform: 'uppercase',
              }}>
                <span>Fullstack Academy</span><span>PHP Masterclass</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ════════════ MAIN LAYOUT */}
      <main style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ── LEFT: Content ────────────────── */}
        <div style={{
          width: '44%', flexShrink: 0,
          borderRight: '1px solid rgba(255,255,255,0.05)',
          overflow: 'hidden', position: 'relative',
        }}>
          <AnimatePresence mode="wait" custom={dir}>
            {!isAnimating && (
              <motion.div
                key={`${chapterParam}-${current}`}
                custom={dir} variants={V}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.25, ease: [0.32,0.72,0,1] }}
                style={{
                  height: '100%', overflow: 'auto',
                  padding: '32px 36px',
                  display: 'flex', flexDirection: 'column', gap: 22,
                }}
              >
                {/* Chapter pill + id */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '3px 10px', borderRadius: 100,
                    border: `1px solid ${ch.color}28`, background: `${ch.color}0e`,
                    fontSize: 9, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase',
                    color: ch.color, fontFamily: "'JetBrains Mono',monospace",
                  }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: ch.color, display: 'inline-block' }}/>
                    {ch.label}
                  </span>
                  <span style={{
                    fontSize: 9, color: '#1f2937', fontFamily: "'JetBrains Mono',monospace",
                    fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                  }}>{slide.id}</span>
                </div>

                {/* Hero title block */}
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 11, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `${slide.accent}12`, border: `1px solid ${slide.accent}22`,
                  }}>
                    <Icon size={20} style={{ color: slide.accent }}/>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h1 style={{
                      fontSize: 36, fontWeight: 800, lineHeight: 1,
                      color: '#f8fafc', letterSpacing: '-0.025em',
                      fontFamily: "'JetBrains Mono',monospace",
                      textTransform: 'uppercase', marginBottom: 8,
                    }}>
                      {slide.title}
                    </h1>
                    <p style={{
                      fontSize: 14, lineHeight: 1.6, color: '#475569', fontWeight: 400,
                      fontFamily: "'Noto Sans Khmer','Hanuman',serif",
                    }}>
                      {slide.subtitle}
                    </p>
                    <div style={{
                      marginTop: 10, height: 2, width: 48, borderRadius: 2,
                      background: `linear-gradient(to right, ${slide.accent}, transparent)`,
                    }}/>
                  </div>
                </div>

                {/* Concept cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {slide.concepts.map((c, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + i * 0.07 }}
                      style={{
                        padding: '14px 16px', borderRadius: 12,
                        border: '1px solid rgba(255,255,255,0.055)',
                        background: 'rgba(255,255,255,0.018)',
                      }}
                    >
                      <div style={{
                        fontSize: 9.5, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase',
                        color: slide.accent, marginBottom: 7,
                        fontFamily: "'JetBrains Mono',monospace",
                      }}>
                        {c.label}
                      </div>
                      <p style={{
                        fontSize: 14.5, lineHeight: 2, color: '#64748b', fontWeight: 400,
                        fontFamily: "'Noto Sans Khmer','Hanuman',serif",
                      }}>
                        {c.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Pro Insight */}
                <div style={{
                  padding: '13px 15px', borderRadius: 12,
                  border: '1px solid rgba(251,191,36,0.13)',
                  background: 'rgba(251,191,36,0.035)',
                  display: 'flex', gap: 10,
                }}>
                  <Sparkles size={13} style={{ color: '#d97706', flexShrink: 0, marginTop: 3 }}/>
                  <div>
                    <div style={{
                      fontSize: 8.5, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase',
                      color: '#d97706', marginBottom: 5, fontFamily: "'JetBrains Mono',monospace",
                    }}>Pro Insight</div>
                    <p style={{
                      fontSize: 13.5, lineHeight: 1.9, color: '#78634a', fontStyle: 'italic',
                      fontFamily: "'Noto Sans Khmer','Hanuman',serif",
                    }}>
                      {slide.tip}
                    </p>
                  </div>
                </div>

                {/* Objective + Outcome */}
                {[
                  { icon: BookOpen, color: slide.accent, label: 'Objective',        labelC: '#1f2937',  text: slide.lab,    textC: '#94a3b8', bg: 'rgba(255,255,255,0.018)', border: 'rgba(255,255,255,0.055)', italic: false },
                  { icon: CheckCircle2, color: '#4ade80', label: 'Expected Outcome', labelC: '#14532d', text: slide.result, textC: '#4a6a40', bg: 'rgba(74,222,128,0.025)', border: 'rgba(74,222,128,0.1)',  italic: true },
                ].map(({ icon: Ic, color, label, labelC, text, textC, bg, border, italic }, k) => (
                  <div key={k} style={{
                    padding: '13px 15px', borderRadius: 12,
                    border: `1px solid ${border}`, background: bg,
                    display: 'flex', gap: 10,
                  }}>
                    <Ic size={13} style={{ color, flexShrink: 0, marginTop: 3 }}/>
                    <div>
                      <div style={{
                        fontSize: 8.5, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase',
                        color: labelC, marginBottom: 5, fontFamily: "'JetBrains Mono',monospace",
                      }}>{label}</div>
                      <p style={{
                        fontSize: 14, lineHeight: 1.9, color: textC,
                        fontFamily: "'Noto Sans Khmer','Hanuman',serif",
                        fontStyle: italic ? 'italic' : 'normal', fontWeight: k === 0 ? 500 : 400,
                      }}>{text}</p>
                    </div>
                  </div>
                ))}

                {/* Nav buttons */}
                <div style={{ display: 'flex', gap: 8, paddingTop: 4, paddingBottom: 16 }}>
                  <button onClick={prev} style={{
                    width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)', color: '#4b5563',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.18s',
                  }}><ChevronLeft size={16}/></button>
                  <button onClick={next} style={{
                    flex: 1, height: 42, borderRadius: 10, border: 'none',
                    background: slide.accent, color: '#000',
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 10, fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'opacity 0.18s',
                  }}>
                    {current === safeSlides.length - 1 ? 'Restart' : 'Next'} <ChevronRight size={13}/>
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── RIGHT: Code panel ────────────── */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          padding: '20px', background: 'rgba(0,0,0,0.3)', overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
            <Terminal size={10} style={{ color: '#1f2937' }}/>
            <span style={{
              fontSize: 8.5, fontWeight: 800, color: '#1f2937',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              fontFamily: "'JetBrains Mono',monospace",
            }}>PHP Sandbox</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.04)' }}/>
            <span style={{ fontSize: 8.5, color: '#1f2937', fontFamily: "'JetBrains Mono',monospace" }}>
              {slide.filename}
            </span>
          </div>
          <CodePanel
            code={slide.code}
            terminal={slide.terminal}
            terminalOutput={slide.terminalOutput}
            accent={slide.accent}
            filename={slide.filename}
          />
        </div>
      </main>

      {/* ════════════ NOTES DRAWER */}
      <AnimatePresence>
        {showNotes && (
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 210 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0,
              width: 340, background: '#070a14',
              borderLeft: '1px solid rgba(255,255,255,0.07)',
              zIndex: 150, display: 'flex', flexDirection: 'column',
              padding: '72px 24px 24px',
              boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <div style={{
                fontSize: 8.5, fontWeight: 800, letterSpacing: '0.25em', textTransform: 'uppercase',
                color: '#d97706', fontFamily: "'JetBrains Mono',monospace", marginBottom: 5,
              }}>Field Notes</div>
              <div style={{ fontSize: 10, color: '#1f2937', fontFamily: "'JetBrains Mono',monospace" }}>
                {slide.id} · {slide.title}
              </div>
            </div>
            <textarea
              value={notes[slide.id] || ''}
              onChange={e => saveNote(e.target.value)}
              placeholder="ចំណាំ commands, tips, ឬ reminders…"
              style={{
                flex: 1, borderRadius: 12, padding: '14px',
                background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.06)',
                color: '#64748b', resize: 'none', outline: 'none',
                fontFamily: "'Noto Sans Khmer','Hanuman',serif",
                fontSize: 14.5, lineHeight: 1.85, transition: 'border-color 0.18s',
              }}
              onFocus={e => (e.target.style.borderColor = 'rgba(251,191,36,0.25)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.06)')}
            />
            <div style={{
              marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              fontSize: 8.5, color: '#1f2937', fontFamily: "'JetBrains Mono',monospace",
              letterSpacing: '0.15em', textTransform: 'uppercase',
            }}>
              <HardDrive size={9}/> Auto-saved locally
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}