'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  ChevronLeft, ChevronRight, Menu, X, BookOpen, 
  Code2, Sparkles, Terminal, Copy, CheckCircle2, 
  Layers, Database, Lock, Globe, Box, ShieldCheck,
  Layout, Search, User, FileCode, Zap, List, 
  Hash, RotateCcw, ShieldAlert, ArrowLeft, StickyNote,
  HardDrive, Fingerprint, Rocket, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

/* ══════════════════════════════════════════════════════════════════
   TYPES & DATA
   Premium Educational Content for PHP Development
══════════════════════════════════════════════════════════════════ */

interface Concept {
  label: string;
  desc: string;
}

interface Slide {
  chapter: string;
  id: string;
  accent: string;
  title: string;
  subtitle: string;
  icon: any;
  concepts: Concept[];
  tip: string;
  lab: string;
  result: string;
  code: string;
  filename: string;
  terminalOutput: string;
}

interface DisplayPage extends Slide {
  subType: 'concept' | 'lab';
}

const CHAPTERS = [
  { id: 'intro', num: '01', label: 'PHP Introduction', color: '#8b5cf6' },
  { id: 'logic', num: '02', label: 'Logic & Flow', color: '#f43f5e' },
  { id: 'data', num: '03', label: 'Data Structures', color: '#22d3ee' },
  { id: 'forms', num: '04', label: 'Forms & Security', color: '#fb923c' },
  { id: 'db', num: '05', label: 'Database (PDO)', color: '#38bdf8' },
  { id: 'auth', num: '06', label: 'Auth & Session', color: '#f87171' },
  { id: 'files', num: '07', label: 'File Systems', color: '#fbbf24' },
  { id: 'oop', num: '08', label: 'OOP PHP', color: '#c084fc' },
  { id: 'security', num: '09', label: 'Advanced Security', color: '#f472b6' },
  { id: 'project', num: '10', label: 'Final Architecture', color: '#2dd4bf' },
];

const PHP_SLIDES: Slide[] = [
  // INTRO
  {
    chapter: 'intro', id: 'PH1-S1', accent: '#8b5cf6',
    title: 'PHP Origins', subtitle: 'ភាសាសម្រាប់បម្រើ​ Server-side Web Development',
    icon: Globe,
    concepts: [
      { label: 'Introduction', desc: 'PHP (Hypertext Preprocessor) ជា scripting language ដ៏ពេញនិយមបំផុតសម្រាប់ backend web ។ ថាមពលរបស់វាគឺ render HTML objects ចេញពី server ទៅឱ្យ browser ។' },
      { label: 'How it works', desc: 'Client ស្នើសុំ (Request) -> Server (PHP) រៀបចំ data -> បញ្ជូន HTML ត្រឡប់មកវិញ (Response) ។' },
      { label: 'Market Share', desc: '៧០% នៃគេហទំព័រលើពិភពលោកប្រើ PHP (រួមទាំង Facebook, Wikipedia, WordPress) ។' },
    ],
    tip: 'PHP មិនមែនស្គាល់តែអ្នកបច្ចេកទេសទេ តែវាជា "ឆ្អឹងខ្នង" នៃអ៊ីនធឺណិត។',
    lab: 'បង្កើត File ដំបូងឈ្មោះ index.php រួច echo message ចេញមកក្រៅ។',
    result: 'Browser បង្ហាញពាក្យ "Hello PHP World!" ពណ៌សស្អាត។',
    code: `<?php\n// index.php\necho "Hello PHP World!";`,
    filename: 'index.php',
    terminalOutput: 'Hello PHP World!',
  },
  {
    chapter: 'intro', id: 'PH1-S2', accent: '#8b5cf6',
    title: 'Variables & Types', subtitle: 'ការរក្សាទុកទិន្នន័យក្នុង Memory',
    icon: Hash,
    concepts: [
      { label: 'Variables', desc: 'ក្នុង PHP យើងប្រើសញ្ញា $ នៅពីមុខឈ្មោះ variable ជានិច្ច។ ឧទាហរណ៍៖ $name = "Ratha";' },
      { label: 'Dynamic Typing', desc: 'យើងមិនចាំបាច់កំណត់ប្រភេទ data ដូច Java ឬ C++ ទេ។ PHP នឹងដឹងដោយខ្លួនឯង។' },
      { label: 'Basic Types', desc: 'String (អត្ថបទ), Integer (លេខគត់), Float (លេខក្បៀស), Boolean (true/false) ។' },
    ],
    tip: 'ឈ្មោះ variable គឺ "Case-sensitive" ($age ខុសពី $Age)។',
    lab: 'សាកល្បងបង្កើត variable ពីរ (ឈ្មោះ និងអាយុ) រួចបង្ហាញវា។',
    result: 'ឃើញអត្ថបទ "Name: Ratha, Age: 21" ក្នុង terminal output។',
    code: `<?php\n$name = "Ratha";\n$age = 21;\necho "Name: $name, Age: $age";`,
    filename: 'vars.php',
    terminalOutput: 'Name: Ratha, Age: 21',
  },

  // LOGIC
  {
    chapter: 'logic', id: 'PH2-S1', accent: '#f43f5e',
    title: 'Conditionals', subtitle: 'ការសម្រេចចិត្តក្នុងកម្មវិធី (Control Flow)',
    icon: Zap,
    concepts: [
      { label: 'If Statement', desc: 'ប្រើសម្រាប់ឆែកលក្ខខណ្ឌ។ បើកាលណា condition ពិត វានឹងដំណើរការ code ខាងក្នុង។' },
      { label: 'Else / Elseif', desc: 'សម្រាប់ផ្ដល់ជម្រើសផ្សេងទៀត ប្រសិនបើលក្ខខណ្ឌដំបូងមិនពិត។' },
      { label: 'Switch case', desc: 'ស័ក្តិសមសម្រាប់ឆែក variable មួយដែលមានតម្លៃច្រើនជម្រើស។' }
    ],
    tip: 'ប្រើ === (Strict equality) ដើម្បីឆែកទាំង "Value" និង "Data Type" ឱ្យបានច្បាស់លាស់។',
    lab: 'ឆែកមើលពិន្ទុ ប្រសិនបើ >= 50 គឺ "Pass" ក្រៅពីនោះ "Fail"។',
    result: 'លទ្ធផលបង្ហាញ "Grade: Pass" ប្រសិនបើពិន្ទុស្មើ ៨០។',
    code: `<?php\n$score = 80;\nif ($score >= 50) {\n  echo "Grade: Pass";\n} else {\n  echo "Grade: Fail";\n}`,
    filename: 'logic.php',
    terminalOutput: 'Grade: Pass',
  },
  {
    chapter: 'logic', id: 'PH2-S2', accent: '#f43f5e',
    title: 'Loops', subtitle: 'ការធ្វើការងារដដែលៗ (Iteration)',
    icon: RotateCcw,
    concepts: [
      { label: 'For Loop', desc: 'ប្រើនៅពេលយើងដឹងចំនួនជុំច្បាស់លាស់។' },
      { label: 'While Loop', desc: 'ដំណើរការរហូតទាល់តែលក្ខខណ្ឌលែងពិត។' },
      { label: 'Break/Continue', desc: 'Break ដើម្បីឈប់ភ្លាម, Continue ដើម្បីរម្លងជុំបច្ចុប្បន្ន។' }
    ],
    tip: 'កុំភ្លេច "Increment" ($i++) ក្នុង While loop ក្រែងលោវាជាប់ "Infinite Loop"។',
    lab: 'Loop បង្ហាញលេខពី ១ ដល់ ៥។',
    result: 'ឃើញលេខ ១ ២ ៣ ៤ ៥ បញ្ឈរចុះក្រោម។',
    code: `<?php\nfor ($i = 1; $i <= 5; $i++) {\n  echo $i . "\\n";\n}`,
    filename: 'loop.php',
    terminalOutput: "1\n2\n3\n4\n5",
  },
  {
    chapter: 'logic', id: 'PH2-S3', accent: '#f43f5e',
    title: 'Functions', subtitle: 'ការបង្កើត Code ដែលអាចប្រើឡើងវិញបាន',
    icon: Code2,
    concepts: [
      { label: 'Definition', desc: 'Function គឺជាបណ្ដុំ code ដែលមានឈ្មោះ ហើយអាចហៅ (call) មកប្រើបានគ្រប់ពេល។' },
      { label: 'Parameters', desc: 'យើងអាចបញ្ជូនទិន្នន័យ (arguments) ចូលទៅក្នុង function បាន។' },
      { label: 'Return Value', desc: 'ប្រើពាក្យ return ដើម្បីបញ្ជូនលទ្ធផលចេញពី function មកវិញ។' }
    ],
    tip: 'Function ល្អ គួរតែធ្វើការងារតែមួយគត់ (Single Responsibility)។',
    lab: 'បង្កើត function បូកលេខពីរ រួចបង្ហាញលទ្ធផល។',
    result: 'កូដ return លេខដែលបានបូករួច (ឧទាហរណ៍៖ ៣០)។',
    code: `<?php\nfunction add($a, $b) {\n  return $a + $b;\n}\n\necho add(10, 20);\n\n// Default parameters\nfunction greet($name = "Guest") {\n  echo "Hello, $name!";\n}\ngreet();   // Hello, Guest!\ngreet("Ratha");`,
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
    tip: 'Associative array ≈ JavaScript object { key: value } ។ JSON encode/decode friendly. Database records = assoc arrays.',
    lab: 'Create $product = ["name","price","stock"] ។ Echo name + formatted price.',
    result: 'Product info display correctly. isset() check key existence work.',
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
      { label: 'HTML Rendering', desc: 'foreach inside HTML: generate <li>, <tr>, <option> ។ Most common pattern views.' },
    ],
    tip: 'foreach preferred over for loop arrays. Cleaner, no index management, works both indexed + assoc.',
    lab: 'foreach print all fruits. foreach $user assoc array print key: value pairs.',
    result: 'Each fruit prints on new line. User info prints as key: value.',
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

  // FORMS
  {
    chapter: 'forms', id: 'PH4-S1', accent: '#fb923c',
    title: 'GET vs POST', subtitle: 'HTTP Methods Form Submission',
    icon: Layout,
    concepts: [
      { label: 'GET Method', desc: 'Data visible URL: ?name=Ratha&age=21. Bookmarkable, cacheable. search, filter, read operations only.' },
      { label: 'POST Method', desc: 'Data hidden request body. Secure passwords, sensitive data. Cannot bookmark. create/update/delete.' },
      { label: '$_GET Superglobal', desc: '$_GET["key"] Access URL parameters. Always validate — users can manipulate URL.' },
      { label: '$_POST Superglobal', desc: '$_POST["key"] Access form data. Still must validate/sanitize — POST not automatically safe.' },
    ],
    tip: 'POST != secure by default. POST hides data from URL but not from browser DevTools. Always use HTTPS + validation.',
    lab: 'Simulate $_POST submission. Access name + email. Echo greeting.',
    result: 'Data accessible via $_POST["key"]. Nullish coalescing ?? provides fallback.',
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
      { label: 'Golden Rule', desc: 'Never trust user input. Validate format, sanitize content — every form field, every time.' },
      { label: 'htmlspecialchars()', desc: 'Convert HTML special chars to entities. < → &lt;. Prevents XSS attacks.' },
      { label: 'filter_var()', desc: 'FILTER_VALIDATE_EMAIL, FILTER_VALIDATE_URL, FILTER_SANITIZE_STRING. Built-in PHP validators.' },
      { label: 'empty() / isset()', desc: 'isset($var) checks if variable exists + not null. empty($var) checks falsy values "" 0 null [].' },
    ],
    tip: 'Sanitize before display, validate before store. Two different concerns — do both order.',
    lab: 'Sanitize input with htmlspecialchars(). Validate email with filter_var().',
    result: 'Malicious HTML tags converted to safe entities. Invalid email rejected.',
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
      { label: 'PDO Interface', desc: 'PDO = PHP Data Objects. Unified API MySQL, PostgreSQL, SQLite. Modern + secure raw mysqli.' },
      { label: 'DSN String', desc: '"mysql:host=localhost;dbname=mydb;charset=utf8mb4". Data Source Name defines connection details.' },
      { label: 'try/catch Block', desc: 'Wrap connection try/catch handle PDOException. Never crash silently — always catch errors.' },
      { label: 'PDO Attributes', desc: 'PDO::ATTR_ERRMODE = ERRMODE_EXCEPTION. PDO::ATTR_DEFAULT_FETCH_MODE = FETCH_ASSOC.' },
    ],
    tip: 'Store DB credentials .env file — never hard-code source code. .env + .gitignore = security.',
    lab: 'Write PDO connection code. Set ERRMODE_EXCEPTION. Echo success message.',
    result: '"Connection Successful!". PDOException caught if wrong credentials.',
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
      { label: 'SELECT (Read)', desc: '$pdo->query("SELECT * FROM users"). fetch() = one row. fetchAll() = all rows. Return assoc array.' },
      { label: 'INSERT (Create)', desc: 'prepare() + execute(). Never concatenate user input SQL string — SQL injection risk.' },
      { label: 'UPDATE / DELETE', desc: 'Always use WHERE clause. Missing WHERE = update/delete ALL rows. Test SELECT first.' },
      { label: 'Prepared Statements', desc: 'Parameterized queries: ? or :name placeholders. PDO escapes input automatically. Prevention SQL injection.' },
    ],
    tip: 'Prepared statements != optional. Raw string concatenation SQL = SQL injection vulnerability. Always prepare() + execute().',
    lab: 'Write SELECT query WHERE id = ?. Pass id via execute([$id]).',
    result: 'User data fetched securely. No SQL injection possible with prepared statements.',
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
      { label: 'HTTP Stateless Problem', desc: 'HTTP is stateless — request is independent. Server doesn\'t remember previous requests. Sessions solve this.' },
      { label: 'session_start()', desc: 'Must call every page wants session access. Place very top — before any output.' },
      { label: '$_SESSION Array', desc: '$_SESSION["user_id"] = 42. Persists across pages. Stored server-side. Session ID cookie.' },
      { label: 'Session Destruction', desc: 'session_destroy() logout. unset($_SESSION["key"]) single value. session_regenerate_id() security.' },
    ],
    tip: 'Regenerate session ID after login: session_regenerate_id(true). Prevents session fixation attacks.',
    lab: 'session_start(). Set $_SESSION["user_name"]. Access same request verify persistence.',
    result: 'Session data accessible. session_start() required before any $_SESSION access.',
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
      { label: 'Never Store Plain-text', desc: 'Plain-text passwords DB = catastrophic breach. Always hash storing. Hash is one-way.' },
      { label: 'password_hash()', desc: 'password_hash($pass, PASSWORD_DEFAULT). Auto-salts. Uses bcrypt by default. Secure and simple.' },
      { label: 'password_verify()', desc: 'password_verify($input, $hash). Compare plain input against stored hash. Returns true/false.' },
      { label: 'Auto Salt', desc: 'PHP auto-generates salt — never implement your own. PASSWORD_BCRYPT, PASSWORD_ARGON2ID options.' },
    ],
    tip: 'Never MD5 or SHA1 passwords — cryptographically broken. password_hash() with PASSWORD_DEFAULT is the minimum standard.',
    lab: 'Hash "secret123" password_hash(). Verify password_verify().',
    result: 'Hash generated (60 chars). password_verify() returns true for correct password.',
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
      { label: 'enctype Requirement', desc: '<form enctype="multipart/form-data"> Required file uploads work. Without it, $_FILES is empty.' },
      { label: '$_FILES Superglobal', desc: '$_FILES["field"]["name"], ["type"], ["size"], ["tmp_name"], ["error"]. tmp_name = temporary path.' },
      { label: 'move_uploaded_file()', desc: 'Move from tmp to destination. move_uploaded_file($tmp, "uploads/$name"). Validates upload origin.' },
      { label: 'Security Checks', desc: 'Validate MIME type, extension whitelist, file size. Never trust $_FILES["type"] — check real MIME.' },
    ],
    tip: 'Rename uploaded files save — prevent overwriting directory traversal attacks. uniqid() + extension.',
    lab: 'Handle $_FILES["profile"]. Check error == 0. move_uploaded_file() to uploads/.',
    result: 'File moves successfully. Error handling catches upload failures.',
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
    title: 'Classes & Objects', subtitle: 'មូលដ្ឋានគ្រឹះ OOP ក្នុង PHP',
    icon: Box,
    concepts: [
      { label: 'Class Blueprint', desc: 'Class ជាគំរូ (blueprint) ។ Object ជា instance បង្កើតពី class ។ $user = new User();' },
      { label: 'Properties & Methods', desc: 'Properties = variables ក្នុង class ។ Methods = functions ក្នុង class ។' },
      { label: 'Constructor', desc: '__construct() execute ភ្លាមៗពេល build object ។ ល្អសម្រាប់ initialize data ។' },
      { label: 'Access Modifiers', desc: 'public (គ្រប់គ្នា access បាន), private (តែក្នុង class), protected (class + children) ។' },
    ],
    tip: 'OOP ជួយឱ្យ code រៀបចំបានស្អាត, reusable និងងាយស្រួល scale ក្នុង project ធំៗ។',
    lab: 'បង្កើត class User ដែលមាន public property $name និង constructor ។',
    result: 'Object ត្រូវបានបង្កើត និងបង្ហាញឈ្មោះបានត្រឹមត្រូវតាមរយៈ property ។',
    code: `<?php
class User {
    public $name;
    
    public function __construct($name) {
        $this->name = $name;
    }
    
    public function sayHello() {
        return "Hello, my name is " . $this->name;
    }
}

$ratha = new User("Ratha");
echo $ratha->sayHello();`,
    filename: 'oop_basic.php',
    terminalOutput: 'Hello, my name is Ratha',
  },

  // SECURITY
  {
    chapter: 'security', id: 'PH9-S1', accent: '#f472b6',
    title: 'XSS Prevention', subtitle: 'Cross-Site Scripting Protection',
    icon: ShieldAlert,
    concepts: [
      { label: 'XSS Attack', desc: 'Hacker បញ្ចូល JavaScript code តាមរយៈ input field ដើម្បីលួច data ឬ cookies ។' },
      { label: 'Defense', desc: 'ជានិច្ចកាលត្រូវ export user data ជាមួយ htmlspecialchars() ។ កុំ echo raw data ឱ្យសោះ។' },
      { label: 'CSP Headers', desc: 'Content Security Policy (CSP) header ជួយរារាំង malicious scripts មិនឱ្យ run ។' },
    ],
    tip: 'Sanitize មុនបង្ហាញជានិច្ច។ "Filter input, Escape output" ជាមន្តអាគមរបស់ Web Dev ។',
    lab: 'បង្ហាញ input ដែលមាន script tag ឱ្យទៅជា safe text ។',
    result: 'Script មិន execute ទេ ប៉ុន្តែបង្ហាញជាអក្សរធម្មតាវិញ។',
    code: `<?php
$malicious = "<script>alert('hack')</script>";
echo htmlspecialchars($malicious, ENT_QUOTES, 'UTF-8');`,
    filename: 'xss_fix.php',
    terminalOutput: '&lt;script&gt;alert(\'hack\')&lt;/script&gt;',
  },

  // PROJECT
  {
    chapter: 'project', id: 'PH10-S1', accent: '#2dd4bf',
    title: 'Project Structure', subtitle: 'Folder Architecture & MVC Pattern',
    icon: Layout,
    concepts: [
      { label: 'Separation of Concerns', desc: 'Controllers handle logic. Models handle data. Views handle display. MVC = clean code.' },
      { label: 'Entry Point', desc: 'index.php = single entry point. All requests route through it via Router.' },
      { label: 'Autoloading', desc: 'Composer autoloader: spl_autoload_register. PSR-4 standard naming.' },
      { label: 'Environment Config', desc: '.env file for DB credentials, API keys. Never commit secrets to Git.' },
    ],
    tip: 'Good folder structure beginning saves hours of refactoring later. Follow PSR-4 naming conventions.',
    lab: 'Design folder structure blog app: posts, users, auth.',
    result: 'Clear separation: controllers/, models/, views/. index.php as router entry point.',
    code: `# PHP Project Structure (MVC)

/my-project
├── public/
│   └── index.php          # Entry point
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
      { label: 'Error Display OFF', desc: 'ini_set("display_errors", 0) production. Log errors to file instead.' },
      { label: 'Security Audit', desc: 'All inputs validated/sanitized. All queries use prepared statements. Passwords hashed.' },
      { label: 'HTTPS Required', desc: 'SSL certificate mandatory production. Free via Let\'s Encrypt.' },
      { label: 'Performance', desc: 'Compress images. Enable PHP OPcache. Minify CSS/JS. Use CDN.' },
    ],
    tip: 'Create deployment checklist. Run through every point before going live. Rollback plan if launch fails.',
    lab: 'Production config: hide errors, set environment constants.',
    result: 'Site live no error output ENVIRONMENT=production mode.',
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
    return [<span key="c" style={{ color: '#4b5563', fontStyle: 'italic' }}>{line}</span>];
  const parts = line.split(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\$[a-zA-Z_]\w*|\b\d+(?:\.\d+)?\b|\b[a-zA-Z_]\w*\b)/g);
  return parts.map((p, i) => {
    if (!p) return null;
    if (p.startsWith('$'))    return <span key={i} style={{ color: '#fbbf24' }}>{p}</span>;
    if (PHP_KW.has(p))        return <span key={i} style={{ color: '#f87171', fontWeight: 700 }}>{p}</span>;
    if (p.startsWith('"') || p.startsWith("'")) return <span key={i} style={{ color: '#86efac' }}>{p}</span>;
    if (/^\d/.test(p))        return <span key={i} style={{ color: '#c084fc' }}>{p}</span>;
    if (/^[A-Z]/.test(p))    return <span key={i} style={{ color: '#fbbf24' }}>{p}</span>;
    return <span key={i} style={{ color: '#fff' }}>{p}</span>;
  });
};

const HighlightedCode = ({ code }: { code: string }) => (
  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, lineHeight: 1.8, whiteSpace: 'pre' }}>
    {code.split('\n').map((line, i) => <div key={i} style={{ minHeight: '1.8em' }}>{tokenizeLine(line)}</div>)}
  </div>
);

/* ══════════════════════════════════════════════════════════════════
   CODE PANEL
══════════════════════════════════════════════════════════════════ */

const CodePanel = ({ code: initialCode, terminalOutput, accent, filename }: {
  code: string; terminal?: string; terminalOutput?: string; accent: string; filename: string;
}) => {
  const [tab, setTab] = useState<'code' | 'terminal'>('code');
  const [code, setCode] = useState(initialCode);
  const [copied, setCopied] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const hlRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setCode(initialCode); }, [initialCode]);

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
      border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '9px 13px', background: '#0a0e1a', borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {['#ff5f57','#febc2e','#28c840'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }}/>) }
          </div>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', borderRadius: 7, padding: 3, marginLeft: 6 }}>
            {(['code','terminal'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '4px 10px', borderRadius: 5, border: 'none', fontSize: 9.5, fontWeight: 800,
                fontFamily: "'JetBrains Mono',monospace", background: tab === t ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: tab === t ? '#fff' : '#4b5563', transition: 'all 0.18s', textTransform: 'uppercase',
              }}>{t}</button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 9, color: '#4b5563', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>{filename}</div>
          <button onClick={copy} style={{
            background: 'none', border: 'none', color: copied ? '#4ade80' : '#374151',
            display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.18s'
          }}>
            {copied ? <CheckCircle2 size={13}/> : <Copy size={13}/>}
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
          <div style={{ padding: 20, fontFamily: "'JetBrains Mono',monospace", fontSize: 13, lineHeight: 1.8, overflow: 'auto', height: '100%' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
              <span style={{ color: accent }}>❯</span>
              <span style={{ color: '#38bdf8' }}>~/php-lab</span>
              <span style={{ color: '#4b5563' }}>$</span>
              <span style={{ color: '#fff' }}>php {filename}</span>
            </div>
            {terminalOutput ? (
              <pre style={{ color: '#94a3b8', whiteSpace: 'pre-wrap', margin: 0 }}>{terminalOutput}</pre>
            ) : (
              <span style={{ color: '#1f2937' }}>Output will appear here.</span>
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

export default function PHPSlides() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chapterParam = searchParams.get('chapter') || 'intro';
  
  const displayPages = useMemo(() => {
    const filtered = PHP_SLIDES.filter(s => s.chapter === chapterParam);
    const result: DisplayPage[] = [];
    filtered.forEach(s => {
      result.push({ ...s, subType: 'concept' });
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
    if (current < displayPages.length - 1) {
      goTo(current + 1, 1);
    }
  }, [current, displayPages.length, goTo]);

  const prev = useCallback(() => {
    if (current > 0) goTo(current - 1, -1);
  }, [current, goTo]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
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
      `}</style>

      {/* Grid BG */}
      <div style={{ 
        position: 'fixed', inset: 0, opacity: 0.1, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}/>

      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `radial-gradient(circle at 70% 30%, ${slide.accent}15 0%, transparent 50%)`,
        transition: 'background 1s ease'
      }}/>

      {/* HEADER */}
      <header style={{
        position: 'relative', zIndex: 50, height: 64, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 24px', background: 'rgba(3,5,9,0.8)',
        backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/courses/backend" style={{
            width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center',
            justifyContent: 'center', background: 'rgba(255,255,255,0.03)', color: '#4b5563',
            border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none'
          }}><ArrowLeft size={16}/></Link>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '6px 14px',
            borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.03)', color: '#fff', transition: 'all 0.2s'
          }}>
            <div style={{ 
              width: 24, height: 24, borderRadius: 6, display: 'flex', alignItems: 'center', 
              justifyContent: 'center', background: ch.color, color: '#000'
            }}>
              {isMenuOpen ? <X size={14}/> : <Menu size={14}/>}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 9, fontWeight: 800, color: ch.color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Chapter {ch.num}</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{ch.label}</div>
            </div>
            <ChevronDown size={14} style={{ color: '#374151', transform: isMenuOpen ? 'rotate(180deg)' : 'none', transition: '0.3s' }}/>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {displayPages.map((_, i) => (
              <div key={i} style={{
                width: i === current ? 24 : 6, height: 6, borderRadius: 3,
                background: i === current ? slide.accent : i < current ? `${slide.accent}40` : 'rgba(255,255,255,0.1)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}/>
            ))}
          </div>
          <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)' }}/>
          <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono',monospace", color: '#4b5563' }}>{current + 1} / {displayPages.length}</span>
          <button onClick={() => setShowNotes(!showNotes)} style={{
            width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center',
            justifyContent: 'center', background: showNotes ? `${slide.accent}20` : 'rgba(255,255,255,0.03)',
            color: showNotes ? slide.accent : '#4b5563', border: `1px solid ${showNotes ? slide.accent : 'rgba(255,255,255,0.08)'}`
          }}><StickyNote size={18}/></button>
        </div>
      </header>

      {/* CHAPTER MENU */}
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
                    borderRadius: 14, border: 'none', background: chapterParam === c.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                    color: '#fff', transition: '0.2s', textAlign: 'left'
                  }}
                >
                  <div style={{ 
                    width: 32, height: 32, borderRadius: 8, background: `${c.color}20`,
                    color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 800, fontFamily: "'JetBrains Mono',monospace"
                  }}>{c.num}</div>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 800, color: c.color, letterSpacing: '0.1em' }}>CHAPTER {c.num}</div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{c.label}</div>
                  </div>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, display: 'flex', position: 'relative', zIndex: 10 }}>
        {/* LEFT PANEL */}
        <div style={{ width: '45%', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '40px 50px', overflowY: 'auto' }}>
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0, x: dir * 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -dir * 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <span style={{ 
                  padding: '4px 12px', borderRadius: 100, background: `${slide.accent}15`, 
                  color: slide.accent, fontSize: 10, fontWeight: 800, letterSpacing: '0.1em'
                }}>{ch.label}</span>
                <span style={{ color: '#1f2937', fontSize: 10, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>{slide.id}</span>
              </div>

              <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 40 }}>
                <div style={{ 
                  width: 56, height: 56, borderRadius: 16, background: `${slide.accent}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: slide.accent,
                  border: `1px solid ${slide.accent}30`
                }}>
                  <Icon size={28}/>
                </div>
                <div>
                  <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8, letterSpacing: '-0.02em', color: '#fff' }}>
                    {slide.subType === 'lab' ? `${slide.title} (Practice)` : slide.title}
                  </h1>
                  <p style={{ fontSize: 16, color: '#64748b', lineHeight: 1.6 }}>{slide.subtitle}</p>
                </div>
              </div>

              {slide.subType === 'concept' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {slide.concepts.map((c, i) => (
                    <div key={i} style={{ 
                      padding: '20px', borderRadius: 16, background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: slide.accent, marginBottom: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.label}</div>
                      <div style={{ fontSize: 15, lineHeight: 1.8, color: '#cbd5e1' }}>{c.desc}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Pro Insight */}
                  <div style={{ padding: '20px', borderRadius: 16, background: 'rgba(251,191,36,0.03)', border: '1px solid rgba(251,191,36,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <Sparkles size={14} style={{ color: '#fbbf24' }}/>
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#fbbf24', letterSpacing: '0.1em' }}>PRO INSIGHT</span>
                    </div>
                    <div style={{ fontSize: 15, lineHeight: 1.8, color: '#b45309', fontStyle: 'italic' }}>{slide.tip}</div>
                  </div>

                  {/* Objective */}
                  <div style={{ padding: '20px', borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <BookOpen size={14} style={{ color: slide.accent }}/>
                      <span style={{ fontSize: 11, fontWeight: 800, color: slide.accent, letterSpacing: '0.1em' }}>OBJECTIVE</span>
                    </div>
                    <div style={{ fontSize: 15, lineHeight: 1.8, color: '#cbd5e1' }}>{slide.lab}</div>
                  </div>

                  {/* Expected Outcome */}
                  <div style={{ padding: '20px', borderRadius: 16, background: 'rgba(74,222,128,0.03)', border: '1px solid rgba(74,222,128,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <CheckCircle2 size={14} style={{ color: '#4ade80' }}/>
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#4ade80', letterSpacing: '0.1em' }}>EXPECTED OUTCOME</span>
                    </div>
                    <div style={{ fontSize: 15, lineHeight: 1.8, color: '#065f46' }}>{slide.result}</div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
                <button onClick={prev} disabled={current === 0} style={{ 
                  width: 48, height: 48, borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.03)', color: '#fff', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', cursor: current === 0 ? 'not-allowed' : 'pointer'
                }}><ChevronLeft size={20}/></button>
                <button onClick={next} style={{ 
                  flex: 1, height: 48, borderRadius: 16, border: 'none', background: slide.accent,
                  color: '#000', fontWeight: 900, fontSize: 12, letterSpacing: '0.1em', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                }}>
                  {current === displayPages.length - 1 ? 'FINISH' : slide.subType === 'concept' ? 'START PRACTICE' : 'NEXT LESSON'}
                  <ChevronRight size={18}/>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT PANEL: CODE */}
        <div style={{ flex: 1, padding: '30px', background: 'rgba(0,0,0,0.2)' }}>
          <CodePanel 
            code={slide.code} 
            filename={slide.filename} 
            accent={slide.accent} 
            terminalOutput={slide.terminalOutput}
          />
        </div>
      </main>

      {/* NOTES DRAWER */}
      <AnimatePresence>
        {showNotes && (
          <motion.div initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }}
            style={{ 
              position: 'fixed', right: 0, top: 0, bottom: 0, width: 380, background: '#0a0e1a',
              zIndex: 200, borderLeft: '1px solid rgba(255,255,255,0.1)', padding: '80px 30px 30px',
              display: 'flex', flexDirection: 'column', boxShadow: '-20px 0 50px rgba(0,0,0,0.5)'
            }}
          >
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#fbbf24', letterSpacing: '0.1em', marginBottom: 6 }}>FIELD NOTES</div>
              <div style={{ fontSize: 13, color: '#4b5563' }}>{slide.title}</div>
            </div>
            <textarea 
              value={notes[slide.id] || ''} 
              onChange={e => saveNote(e.target.value)}
              placeholder="Take notes here..."
              style={{ 
                flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 20, padding: 20, color: '#94a3b8', fontSize: 15, lineHeight: 1.8,
                resize: 'none', outline: 'none', fontFamily: 'inherit'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}