"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft, ChevronRight, Code2, Copy, Check, Play, RotateCcw,
  Server, Database, Globe, Globe2, Lock, Shield, ShieldAlert, ShieldCheck,
  Search, Send, Activity, Layers, List, RefreshCw, Zap, Sparkles,
  Key, Link as LinkIcon, FileCode, Package, Box, ArrowRight, ArrowLeft,
  Terminal, Rocket, HardDrive, Layout, Workflow,
  Fingerprint, GitBranch, Edit3, Star, Trophy, ShoppingCart, StickyNote, CheckCircle2,
  Menu, X, ChevronDown,
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
      'Environment Setup: Install Laravel Herd (Mac) or XAMPP (Windows) to get a local PHP server running.',
      'Execution: PHP code is executed on the server, and the result is returned to the browser as plain HTML.',
      'Variable Rules: All variables must start with the "$" sign and are case-sensitive ($age != $Age).',
      'Data Types: PHP is loosely typed; variables can hold Strings, Integers, Floats, Booleans, and Arrays.'
    ],
    syntax: '<?php \n$name = "Ari"; // Variable definition\necho $name; // Outputting data\n?>',
    lab: 'Create a variable $greeting with the value "Hello World" and echo it inside an <h2> tag.',
    result: 'The browser displays a large heading saying "Hello World".',
    filename: 'index.php',
    code: `<?php
$greeting = "Hello PHP World";
echo "<h2>$greeting</h2>";
echo "Current PHP Version: " . phpversion();`,
    icon: Code2,
    terminalOutput: "<h2>Hello PHP World</h2>\nCurrent PHP Version: 8.3.0",
  },
  {
    chapter: 'intro', id: 'P01-S2', tag: 'Week 1', tagColor: '#10b981',
    title: 'Data Types & Strings', subtitle: 'Manipulating Text', accent: '#10b981',
    bg: 'radial-gradient(ellipse at 80% 30%, rgba(16,185,129,0.12) 0%, transparent 55%)',
    content: [
      'String Concatenation: PHP uses the dot (".") operator to join two strings together.',
      'Interpolation: Double quotes (") allow variables to be evaluated inside the string, single quotes (\') do not.',
      'String Length: Use strlen() to get the character count of any string.',
      'Modification: Use str_replace() to swap specific words or chars within a string.'
    ],
    syntax: '$full = $first . " " . $last;\necho "Hello $name";',
    lab: 'Write a script that takes a sentence, prints its length, and then replaces a specific word.',
    result: 'The output shows the number of characters and the modified sentence.',
    filename: 'strings.php',
    code: `<?php
$text = "PHP is hard";
$clean = str_replace("hard", "fun", $text);
echo "Length: " . strlen($text) . "\\n";
echo "Updated: " . $clean;`,
    icon: Sparkles,
    terminalOutput: "Length: 11\nUpdated: PHP is fun",
  },
  {
    chapter: 'intro', id: 'P01-S3', tag: 'Week 1', tagColor: '#10b981',
    title: 'Operators & Constants', subtitle: 'Immutable Values', accent: '#10b981',
    bg: 'radial-gradient(ellipse at 50% 50%, rgba(16,185,129,0.1) 0%, transparent 60%)',
    content: [
      'Arithmetic: Standard math ops (+, -, *, /) plus Modulus (%) for finding remainders.',
      'Comparison: Use "==" for value check and "===" for strict value and type check.',
      'Defining Constants: Constants are global and cannot be changed once defined.',
      'Usage: Best used for configuration like API keys, DB names, or app-wide settings.'
    ],
    syntax: 'define("SITE_URL", "https://api.com");\nconst VERSION = 1.0;',
    lab: 'Define a constant for a sales tax rate and calculate a subtotal of multiple items.',
    result: 'Terminal displays a clean total including the calculation.',
    filename: 'math.php',
    code: `<?php
define("TAX_RATE", 0.08); // 8% sales tax
$items = [25.00, 15.50, 4.25];
$subtotal = array_sum($items);
$total = $subtotal * (1 + TAX_RATE);
echo "Final Price: $" . number_format($total, 2);`,
    icon: Database,
    terminalOutput: "Final Price: $48.33",
  },

  /* ── CHAPTER 2: CONTROL STRUCTURES ── */
  {
    chapter: 'logic', id: 'P02-S1', tag: 'Week 2', tagColor: '#6366f1',
    title: 'Conditionals', subtitle: 'Making Decisions', accent: '#6366f1',
    bg: 'linear-gradient(135deg, rgba(99,102,241,0.06) 0%, transparent 100%)',
    content: [
      'If / Else: The cornerstone of logic. Executes code block if condition is true.',
      'Elseif: Allows checking multiple conditions in sequence.',
      'Shorthand: Use the Ternary operator ($age > 18 ? "Adult" : "Minor") for quick checks.',
      'Logical Operators: && (And), || (Or), and ! (Not) join conditions.'
    ],
    syntax: 'if ($score >= 50) { echo "Pass"; }',
    lab: 'Check a boolean variable $isLoggedIn. If true, echo "Welcome back!", else echo "Please sign up."',
    result: 'Appropriate message is printed based on the variable state.',
    filename: 'if.php',
    code: `<?php
$isLoggedIn = true;
$name = "Ari";

if ($isLoggedIn && !empty($name)) {
    echo "Welcome back, $name!";
} else {
    echo "Access Denied.";
}`,
    icon: ShieldCheck,
    terminalOutput: "Welcome back, Ari!",
  },
  {
    chapter: 'logic', id: 'P02-S2', tag: 'Week 2', tagColor: '#6366f1',
    title: 'Switch & Match', subtitle: 'Advanced Branching', accent: '#6366f1',
    bg: 'radial-gradient(ellipse at center, rgba(99,102,241,0.04) 0%, transparent 70%)',
    content: [
      'Switch: A cleaner way to compare the same variable against many values.',
      'Break Keyword: Crucial to prevent "falling through" to the next case.',
      'Match Expression: PHP 8.0+ modern alternative that returns a value.',
      'Default Case: Always include a default to handle unexpected inputs.'
    ],
    syntax: '$status = match($code) { 200 => "OK", 404 => "Not Found" };',
    lab: 'Convert an old Switch statement for user roles into a modern PHP Match expression.',
    result: 'Code is more concise and easier to read.',
    filename: 'branch.php',
    code: `<?php
$role = 'editor';

$access = match ($role) {
    'admin'  => 'Full Access',
    'editor' => 'Edit content only',
    'guest'  => 'Read only',
    default  => 'No Access',
};

echo "Permission Level: " . $access;`,
    icon: Terminal,
    terminalOutput: "Permission Level: Edit content only",
  },
  {
    chapter: 'logic', id: 'P02-S3', tag: 'Week 2', tagColor: '#6366f1',
    title: 'Loops & Iteration', subtitle: 'Automating Tasks', accent: '#6366f1',
    bg: 'radial-gradient(ellipse at 10% 80%, rgba(99,102,241,0.08) 0%, transparent 55%)',
    content: [
      'While Loop: Continues as long as a condition is true. Be careful of infinite loops!',
      'For Loop: Used when you know exactly how many times the loop should run.',
      'Foreach: THE way to iterate over arrays in PHP. Simple and effective.',
      'Continue/Break: "Continue" skips the current iteration, "Break" stops the loop entirely.'
    ],
    syntax: 'foreach ($items as $index => $value) { ... }',
    lab: 'Use a for loop to print numbers from 10 down to 1.',
    result: 'Terminal shows a countdown sequence.',
    filename: 'loops.php',
    code: `<?php
echo "Countdown: ";
for ($i = 10; $i >= 1; $i--) {
    echo $i . ($i == 1 ? "!" : ", ");
}`,
    icon: RotateCcw,
    terminalOutput: "Countdown: 10, 9, 8, 7, 6, 5, 4, 3, 2, 1!",
  },

  /* ── CHAPTER 3: FUNCTIONS & ARRAYS ── */
  {
    chapter: 'functions', id: 'P03-S1', tag: 'Week 3', tagColor: '#06b6d4',
    title: 'Custom Functions', subtitle: 'Reusable Logic', accent: '#06b6d4',
    bg: 'radial-gradient(ellipse at center, rgba(6,182,212,0.08) 0%, transparent 70%)',
    content: [
      'Declaration: Functions group code into named blocks to keep your project DRY (Don\'t Repeat Yourself).',
      'Parameters: You can pass data into functions. Always use type hinting (e.g., int $x) for safer code.',
      'Returns: Functions should return a value instead of echoing, allowing the result to be used elsewhere.',
      'Scope: Variables defined inside a function are local and cannot be accessed from the outside.'
    ],
    syntax: 'function name(string $param): string { return "Hi $param"; }',
    lab: 'Write a function "totalPrice" that takes a price and a quantity and returns the total.',
    result: 'The function returns a calculated numeric value.',
    filename: 'funcs.php',
    code: `<?php
function calculateTotal(float $price, int $qty): float {
    return $price * $qty;
}

$bill = calculateTotal(19.99, 3);
echo "Final Bill: $" . $bill;`,
    icon: Code2,
    terminalOutput: "Final Bill: $59.97",
  },
  {
    chapter: 'functions', id: 'P03-S2', tag: 'Week 3', tagColor: '#06b6d4',
    title: 'Array Foundations', subtitle: 'Data Structures', accent: '#06b6d4',
    bg: 'radial-gradient(ellipse at center, rgba(6,182,212,0.08) 0%, transparent 70%)',
    content: [
      'Indexed Arrays: Lists of items identified by a numeric index starting at 0.',
      'Associative Arrays: Use named keys instead of numbers, like a dictionary or object ($user["id"]).',
      'Multidimensional: Arrays containing more arrays, useful for tables or complex data.',
      'Count: Use count() to find out how many elements are in an array.'
    ],
    syntax: '$list = ["Apple", "Orange"];\n$user = ["name" => "Ari"];',
    lab: 'Create an associative array for a product including name, price, and stock status.',
    result: 'Array data is printed using print_r() for inspection.',
    filename: 'arrays.php',
    code: `<?php
$product = [
    "name" => "Coffee Bean",
    "price" => 14.50,
    "inStock" => true
];

echo "Product: " . $product["name"] . " costs $" . $product["price"];`,
    icon: Layers,
    terminalOutput: "Product: Coffee Bean costs $14.5",
  },
  {
    chapter: 'functions', id: 'P03-S3', tag: 'Week 3', tagColor: '#06b6d4',
    title: 'Array Masterclass', subtitle: 'Processing Data', accent: '#06b6d4',
    bg: 'radial-gradient(ellipse at 90% 10%, rgba(6,182,212,0.1) 0%, transparent 55%)',
    content: [
      'Sorting: Use sort() for values, ksort() for keys, and asort() to keep associations.',
      'Filtering: array_filter() removes unwanted items based on a callback rule.',
      'Mapping: array_map() applies a function to every item in the array.',
      'Existence: use in_array() or array_key_exists() to check for data without looping.'
    ],
    syntax: '$clean = array_filter($data, fn($n) => $n > 0);',
    lab: 'Take a list of prices and apply a 20% discount to all of them using array_map.',
    result: 'A new array with discounted prices is displayed.',
    filename: 'array_ops.php',
    code: `<?php
$prices = [100, 200, 300];
$discounted = array_map(fn($p) => $p * 0.8, $prices);

echo "New Prices: " . implode(", ", $discounted);`,
    icon: List,
    terminalOutput: "New Prices: 80, 160, 240",
  },

  /* ── CHAPTER 4: FORM HANDLING ── */
  {
    chapter: 'forms', id: 'P04-S1', tag: 'Week 4', tagColor: '#f59e0b',
    title: 'GET vs POST', subtitle: 'The Transfer Logic', accent: '#f59e0b',
    bg: 'radial-gradient(ellipse at center, rgba(245,158,11,0.08) 0%, transparent 70%)',
    content: [
      'GET: Data is appended to the URL. Use for searches, bookmarks, and non-sensitive data.',
      'POST: Data is sent in the request body. Required for passwords, file uploads, and data creation.',
      'Superglobals: PHP collects form data into $_GET and $_POST associative arrays.',
      'Check Submission: Always wrap processing logic in an if(isset($_POST["submit"])) block.'
    ],
    syntax: '$name = $_POST["username"]; // Captures form input',
    lab: 'Create a mini-form with an input field and check if it was submitted via POST.',
    result: 'The script correctly identifies and echoes the submitted name.',
    filename: 'submit.php',
    code: `<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $user = $_POST["username"] ?? "Guest";
    echo "Processing for user: " . $user;
} else {
    echo "Wait for form submission...";
}`,
    icon: Send,
    terminalOutput: "Processing for user: Guest",
  },
  {
    chapter: 'forms', id: 'P04-S2', tag: 'Week 4', tagColor: '#f59e0b',
    title: 'Validation & Hygiene', subtitle: 'Secure Input', accent: '#f59e0b',
    bg: 'radial-gradient(ellipse at center, rgba(245,158,11,0.08) 0%, transparent 70%)',
    content: [
      'Sanitization: Removing illegal characters (e.g., stripping tags from a comment).',
      'Validation: Checking if data meets rules (e.g., is the email valid? Is the age a number?).',
      'Filter Var: Use filter_var() with built-in constants for robust validation.',
      'XSS Protection: Always use htmlspecialchars() before echoing user data back to the page.'
    ],
    syntax: '$email = filter_var($_POST["email"], FILTER_VALIDATE_EMAIL);',
    lab: 'Write a script that validates an email and sanitizes an age input to be an integer.',
    result: 'Confirmation messages for whether the data is valid or has been cleaned.',
    filename: 'sanitize.php',
    code: `<?php
$dirty_email = "ari@example.com";
$clean_email = filter_var($dirty_email, FILTER_SANITIZE_EMAIL);

if (filter_var($clean_email, FILTER_VALIDATE_EMAIL)) {
    echo "Email is VALID: " . $clean_email;
} else {
    echo "Invalid Email.";
}`,
    icon: Shield,
    terminalOutput: "Email is VALID: ari@example.com",
  },
  {
    chapter: 'forms', id: 'P04-S3', tag: 'Week 4', tagColor: '#f59e0b',
    title: 'Handling JSON Input', subtitle: 'Modern API Intake', accent: '#f59e0b',
    bg: 'radial-gradient(ellipse at 80% 80%, rgba(245,158,11,0.06) 0%, transparent 60%)',
    content: [
      'Application/JSON: Modern JS frameworks (React/Vue) send data as JSON, not form-data.',
      'php://input: Use this stream to read the raw request body.',
      'Json Decode: Convert the JSON string into an associative PHP array for processing.',
      'Error Handling: Check json_last_error() to ensure the data was formatted correctly.'
    ],
    syntax: '$data = json_decode(file_get_contents("php://input"), true);',
    lab: 'Simulate receiving a JSON payload and echo back a specific property.',
    result: 'The script successfully parses the pseudo-JSON and accesses the key.',
    filename: 'api_form.php',
    code: `<?php
$json = '{"user": "Ari", "course": "Backend"}';
$data = json_decode($json, true);

echo "API Received: User " . $data["user"];`,
    icon: Package,
    terminalOutput: "API Received: User Ari",
  },

  /* ── CHAPTER 5: FILE HANDLING ── */
  {
    chapter: 'files', id: 'P05-S1', tag: 'Week 5', tagColor: '#f97316',
    title: 'File IO Foundations', subtitle: 'Read & Write', accent: '#f97316',
    bg: 'radial-gradient(ellipse at center, rgba(249,115,22,0.08) 0%, transparent 70%)',
    content: [
      'Simple Reading: file_get_contents() reads an entire file into a string — fast but memory heavy.',
      'Simple Writing: file_put_contents() writes data to a file. Use FILE_APPEND to add rather than overwrite.',
      'Streaming: fopen() and fgets() are better for large files as they read line-by-line.',
      'Closing: Always close your file handles with fclose() to free system resources.'
    ],
    syntax: 'file_put_contents("test.txt", "Data", FILE_APPEND);',
    lab: 'Create a script that writes "Log Entry" followed by the current timestamp to a log.txt file.',
    result: 'The log.txt file is created or updated with a new entry each run.',
    filename: 'logger.php',
    code: `<?php
$entry = "User Login at " . date("H:i:s") . "\\n";
file_put_contents("logs.txt", $entry, FILE_APPEND);
echo "Log saved summary: " . file_get_contents("logs.txt");`,
    icon: HardDrive,
    terminalOutput: "Log saved summary: User Login at 19:15:02",
  },
  {
    chapter: 'files', id: 'P05-S2', tag: 'Week 5', tagColor: '#f97316',
    title: 'Directory Ops', subtitle: 'Organizing Assets', accent: '#f97316',
    bg: 'radial-gradient(ellipse at 10% 20%, rgba(249,115,22,0.06) 0%, transparent 60%)',
    content: [
      'Scanning: Use scandir() to list all files and folders within a specific directory.',
      'Checking: file_exists() and is_dir() are vital before attempting any operations.',
      'Management: mkdir() creates folders, and unlink() deletes files. Use with caution.',
      'Path Hygiene: Use realpath() to prevent directory traversal security vulnerabilities.'
    ],
    syntax: 'if (file_exists("data/")) { ... }',
    lab: 'Check if a directory "uploads" exists. If not, create it with correct permissions.',
    result: 'The folder is created and ready for file storage.',
    filename: 'dirs.php',
    code: `<?php
$dir = "media";
if (!is_dir($dir)) {
    mkdir($dir, 0777, true);
    echo "Directory '$dir' created.";
} else {
    echo "Directory already exists.";
}`,
    icon: Box,
    terminalOutput: "Directory 'media' created.",
  },
  {
    chapter: 'files', id: 'P05-S3', tag: 'Week 5', tagColor: '#f97316',
    title: 'Safe File Uploads', subtitle: 'Handling User Content', accent: '#f97316',
    bg: 'radial-gradient(ellipse at center, rgba(249,115,22,0.08) 0%, transparent 70%)',
    content: [
      '$_FILES Superglobal: Contains metadata like name, type, size, and temporary path.',
      'Temporary Storage: Uploaded files are first stored in a temp folder and must be moved.',
      'Move Function: move_uploaded_file() validates that the file was actually an upload.',
      'Security: ALWAYS validate the extension and file size. Never trust the mime-type sent by the user.'
    ],
    syntax: 'move_uploaded_file($temp, "uploads/" . $filename);',
    lab: 'Write a validation check that only allows .php, .jpg, or .png files under 2MB.',
    result: 'Unauthorized files are rejected with a clear error message.',
    filename: 'upload_logic.php',
    code: `<?php
$allowed = ["jpg", "png"];
$ext = "png";
$size = 1500000; // 1.5MB

if (in_array($ext, $allowed) && $size < 2000000) {
    echo "File is safe to upload.";
} else {
    echo "Security block: Invalid file.";
}`,
    icon: Rocket,
    terminalOutput: "File is safe to upload.",
  },

  /* ── CHAPTER 6: STATE MANAGEMENT ── */
  {
    chapter: 'state', id: 'P06-S1', tag: 'Week 6', tagColor: '#f43f5e',
    title: 'Session Management', subtitle: 'User Context', accent: '#f43f5e',
    bg: 'radial-gradient(ellipse at center, rgba(244,63,94,0.08) 0%, transparent 70%)',
    content: [
      'Session Start: You must call session_start() at the very top of your script before any HTML is sent.',
      'Superglobal: $_SESSION is an associative array that persists data across different pages.',
      'Storage: Unlike cookies, session data is stored on the server, making it much more secure for sensitive info.',
      'Destruction: Use session_destroy() and unset() to log users out and clear their data.'
    ],
    syntax: 'session_start();\n$_SESSION["user_id"] = 42;',
    lab: 'Create a "Visit Counter" that increments every time the user refreshes any page on the site.',
    result: 'The browser displays a persistent count that increases on each reload.',
    filename: 'session.php',
    code: `<?php
session_start();
$_SESSION['visits'] = ($_SESSION['visits'] ?? 0) + 1;
echo "<h1>Welcome! You have visited this site " . $_SESSION['visits'] . " times.</h1>";`,
    icon: Lock,
    terminalOutput: "<h1>Welcome! You have visited this site 1 times.</h1>",
  },
  {
    chapter: 'state', id: 'P06-S2', tag: 'Week 6', tagColor: '#f43f5e',
    title: 'Mastering Cookies', subtitle: 'Client-Side Storage', accent: '#f43f5e',
    bg: 'radial-gradient(ellipse at 70% 20%, rgba(244,63,94,0.06) 0%, transparent 60%)',
    content: [
      'SetCookie: Use the setcookie() function to store data directly on the user\'s browser.',
      'Expiration: You can set a time for cookies to expire (e.g., time() + 3600 for one hour).',
      'Security: Use the "httponly" flag to prevent JavaScript from accessing your sensitive cookies.',
      'Retrieval: Cookies are accessed via the $_COOKIE superglobal on subsequent requests.'
    ],
    syntax: 'setcookie("theme", "dark", time() + 86400, "/");',
    lab: 'Create a "Remember Me" feature that stores the user\'s preferred theme color for 7 days.',
    result: 'The preference remains even after the browser is closed and reopened.',
    filename: 'cookies.php',
    code: `<?php
$theme = $_COOKIE['theme'] ?? 'light';
setcookie('theme', 'ocean-blue', time() + (7 * 86400));
echo "Current App Theme: " . $theme;`,
    icon: Fingerprint,
    terminalOutput: "Current App Theme: light",
  },
  {
    chapter: 'state', id: 'P06-S3', tag: 'Week 6', tagColor: '#f43f5e',
    title: 'Auth Logic', subtitle: 'Simple Login System', accent: '#f43f5e',
    bg: 'radial-gradient(ellipse at center, rgba(244,63,94,0.08) 0%, transparent 70%)',
    content: [
      'Authentication Flow: Verify credentials -> Start Session -> Store User ID -> Redirect.',
      'Authorization: Check $_SESSION at the top of protected pages to ensure the user is logged in.',
      'Restricting Access: If the session variable is missing, use header("Location: login.php") to boot them out.',
      'Clean Logout: Always clear the session cookie and destroy the session internally for safety.'
    ],
    syntax: 'if (!isset($_SESSION["logged_in"])) { exit("Denied"); }',
    lab: 'Build a gatekeeper script that only displays "Top Secret" if a specific session key exists.',
    result: 'Unauthorized users are redirected to a public page.',
    filename: 'auth_check.php',
    code: `<?php
session_start();
// Simulate login
$_SESSION['user'] = 'Ari Admin';

if (isset($_SESSION['user'])) {
    echo "Access GRANTED for: " . $_SESSION['user'];
} else {
    echo "ACCESS DENIED. PLEASE LOGIN.";
}`,
    icon: ShieldCheck,
    terminalOutput: "Access GRANTED for: Ari Admin",
  },

  /* ── CHAPTER 7: MYSQL & CRUD ── */
  {
    chapter: 'mysql', id: 'P07-S1', tag: 'Week 7', tagColor: '#3b82f6',
    title: 'PDO Bridge', subtitle: 'Connecting to Data', accent: '#3b82f6',
    bg: 'radial-gradient(ellipse at center, rgba(59,130,246,0.08) 0%, transparent 70%)',
    content: [
      'PDO Advantage: PHP Data Objects is a database-neutral way to interact with MySQL, SQLite, and more.',
      'DSN String: The Data Source Name contains the host, database name, and charset ($dsn = "mysql:host=localhost;dbname=test").',
      'Attributes: Set PDO::ATTR_ERRMODE to ERRMODE_EXCEPTION to catch database errors with Try/Catch.',
      'Fetch Modes: Choose between FETCH_ASSOC (array) or FETCH_OBJ (object) based on your preference.'
    ],
    syntax: '$pdo = new PDO($dsn, $user, $pass, $options);',
    lab: 'Initialize a PDO connection and catch any connection errors using a Try/Catch block.',
    result: 'The script either confirms "Connected" or displays a friendly error message.',
    filename: 'connect.php',
    code: `<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=demo", "root", "");
    echo "Database: Connected Successfully.";
} catch (PDOException $e) {
    echo "Connection Failed: Check credentials.";
}`,
    icon: Database,
    terminalOutput: "Database: Connected Successfully.",
  },
  {
    chapter: 'mysql', id: 'P07-S2', tag: 'Week 7', tagColor: '#3b82f6',
    title: 'Safe Queries', subtitle: 'Prepared Statements', accent: '#3b82f6',
    bg: 'radial-gradient(ellipse at 20% 80%, rgba(59,130,246,0.06) 0%, transparent 60%)',
    content: [
      'Injection Risk: Never put variables directly into a SQL string ($sql = "SELECT * FROM users WHERE id = $id").',
      'Preparation: Use placeholders (either "?" or ":id") to define where data will go.',
      'Binding: Use bindValue() or pass an array to execute() to safely inject your variables.',
      'Security: Prepared statements ensure that malicious code cannot be executed as SQL commands.'
    ],
    syntax: '$stmt = $pdo->prepare("SELECT * FROM users WHERE id = :id");',
    lab: 'Write a prepared statement to fetch a user record based on an ID provided in the URL.',
    result: 'The user record is fetched safely and printed to the screen.',
    filename: 'secure_query.php',
    code: `<?php
$id = 1; // From $_GET['id']
$stmt = $pdo->prepare("SELECT name FROM users WHERE id = ?");
$stmt->execute([$id]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

echo "Found User: " . ($user['name'] ?? 'Not Found');`,
    icon: Shield,
    terminalOutput: "Found User: Ari Master",
  },
  {
    chapter: 'mysql', id: 'P07-S3', tag: 'Week 7', tagColor: '#3b82f6',
    title: 'CRUD Mastery', subtitle: 'Insert & Update', accent: '#3b82f6',
    bg: 'radial-gradient(ellipse at center, rgba(59,130,246,0.08) 0%, transparent 70%)',
    content: [
      'Insert: Use INSERT INTO queries to add new rows to your tables. Always bind your values.',
      'Last Insert ID: Use $pdo->lastInsertId() to get the ID of the record you just created.',
      'Update: Use UPDATE queries to modify existing data. Ensure you have a WHERE clause to avoid wiping data!',
      'Row Count: use $stmt->rowCount() to verify how many rows were actually changed by your query.'
    ],
    syntax: '$stmt = $pdo->prepare("UPDATE users SET name = ? WHERE id = ?");',
    lab: 'Create a script that adds a new "Post" to a blog table and then returns the new primary key.',
    result: 'Terminal displays "Post Created with ID: 15".',
    filename: 'insert.php',
    code: `<?php
// Pseudo-code for insertion logic
$stmt = $pdo->prepare("INSERT INTO posts (title, body) VALUES (?, ?)");
$stmt->execute(["New Tutorial", "PHP is awesome"]);

echo "Success: Record #" . $pdo->lastInsertId() . " created.";`,
    icon: Zap,
    terminalOutput: "Success: Record #15 created.",
  },

  /* ── CHAPTER 8: OOP FOUNDATIONS ── */
  {
    chapter: 'oop', id: 'P08-S1', tag: 'Week 8', tagColor: '#a855f7',
    title: 'Classes & Objects', subtitle: 'The Blueprints', accent: '#a855f7',
    bg: 'radial-gradient(ellipse at center, rgba(168,85,247,0.08) 0%, transparent 70%)',
    content: [
      'Class: A blueprint for creating objects. It defines properties (data) and methods (behavior).',
      'Object: An instance of a class. You can create multiple objects from a single blueprint.',
      'Properties: Use visibility keywords like public, protected, and private to control access.',
      'Constructor: The __construct() method runs automatically when a new object is created.'
    ],
    syntax: 'class User { public function __construct() { ... } }',
    lab: 'Define a "Car" class with properties for make and model, and instantiate a new object.',
    result: 'Object properties are accessible and can be printed.',
    filename: 'car_oop.php',
    code: `<?php
class Car {
    public function __construct(public string $make, public string $model) {}
    public function getInfo() { return "$this->make $this->model"; }
}

$myCar = new Car("Tesla", "Model S");
echo "Car Info: " . $myCar->getInfo();`,
    icon: Layers,
    terminalOutput: "Car Info: Tesla Model S",
  },
  {
    chapter: 'oop', id: 'P08-S2', tag: 'Week 8', tagColor: '#a855f7',
    title: 'Inheritance & Power', subtitle: 'Extending Logic', accent: '#a855f7',
    bg: 'radial-gradient(ellipse at 10% 80%, rgba(168,85,247,0.06) 0%, transparent 60%)',
    content: [
      'Extends: Use the "extends" keyword to create a child class that inherits all properties from a parent.',
      'Parent Call: Use parent::__construct() to trigger the parent class logic inside a child constructor.',
      'Polymorphism: Different classes can have the same method name but perform different actions.',
      'Visibility: "Protected" properties are invisible to the public but accessible to child classes.'
    ],
    syntax: 'class Admin extends User { ... }',
    lab: 'Create a "Shape" parent class and a "Square" child class that calculates its own area.',
    result: 'The Square object successfully uses its inherited methods.',
    filename: 'shapes.php',
    code: `<?php
class Shape {
    public function __construct(public string $name) {}
}

class Square extends Shape {
    public function __construct(public int $side) {
        parent::__construct("Square");
    }
    public function getArea() { return $this->side ** 2; }
}

$sq = new Square(5);
echo "The $sq->name area is: " . $sq->getArea();`,
    icon: Box,
    terminalOutput: "The Square area is: 25",
  },
  {
    chapter: 'oop', id: 'P08-S3', tag: 'Week 8', tagColor: '#a855f7',
    title: 'Interfaces & Traits', subtitle: 'Advanced Architecture', accent: '#a855f7',
    bg: 'radial-gradient(ellipse at center, rgba(168,85,247,0.08) 0%, transparent 70%)',
    content: [
      'Interface: A contract that forces a class to implement specific methods ($class must have "save()").',
      'Traits: Allow you to reuse groups of methods in several independent classes (horizontal reuse).',
      'Abstract: Abstract classes cannot be instantiated; they exist only to be inherited from.',
      'Static: Static methods belong to the class itself, not an object instance (Utils::log()).'
    ],
    syntax: 'interface Payable { public function pay(); }',
    lab: 'Write an interface for "Logger" and implement it in two different service classes.',
    result: 'Both classes adhere to the same method signatures.',
    filename: 'interface.php',
    code: `<?php
interface Logger {
    public function log(string $msg);
}

class FileLogger implements Logger {
    public function log(string $msg) { echo "FILE: $msg"; }
}

$logger = new FileLogger();
$logger->log("OOP Mastered!");`,
    icon: Workflow,
    terminalOutput: "FILE: OOP Mastered!",
  },

  /* ── CHAPTER 9: SECURITY OPS ── */
  {
    chapter: 'security', id: 'P09-S1', tag: 'Week 9', tagColor: '#ec4899',
    title: 'Modern Security', subtitle: 'Defensive Coding', accent: '#ec4899',
    bg: 'radial-gradient(ellipse at center, rgba(236,72,153,0.08) 0%, transparent 70%)',
    content: [
      'Injection: We covered SQLi, but also beware of Command Injection and LDAP injection.',
      'XSS Protection: Never trust user data in HTML. Use htmlspecialchars() or a library like HTML Purifier.',
      'CSRF Protection: Cross-Site Request Forgery is avoided by using unique tokens for every form.',
      'Headers: Set security headers like Content-Security-Policy to restrict where scripts can run.'
    ],
    syntax: 'echo htmlspecialchars($user_input, ENT_QUOTES, "UTF-8");',
    lab: 'Take an "alert" tag string and pass it through a cleaning function to make it safe for display.',
    result: 'The script tag is rendered as literal text rather than executing code.',
    filename: 'xss_shield.php',
    code: `<?php
$malicious = "<script>alert('Hacked!');</script>";
$safe = htmlspecialchars($malicious);
echo "Original: $malicious (Executed!)\\n";
echo "Protected: $safe (Safe text)";`,
    icon: ShieldAlert,
    terminalOutput: "Protected: &lt;script&gt;alert('Hacked!');&lt;/script&gt; (Safe text)",
  },
  {
    chapter: 'security', id: 'P09-S2', tag: 'Week 9', tagColor: '#ec4899',
    title: 'Crypto & Hashing', subtitle: 'Protecting Passwords', accent: '#ec4899',
    bg: 'radial-gradient(ellipse at 80% 20%, rgba(236,72,153,0.06) 0%, transparent 60%)',
    content: [
      'Never Plain Text: Storing passwords in plain text is a critical failure. Use hashing.',
      'Bcrypt: PHP\'s password_hash() uses the Bcrypt algorithm by default — modern and secure.',
      'Salting: Hashing automatically adds a unique salt to each password to prevent rainbow table attacks.',
      'Verification: Use password_verify() to check a plain text password against its secure hash.'
    ],
    syntax: '$hash = password_hash("secret", PASSWORD_DEFAULT);',
    lab: 'Hash a password, then simulate a login by verifying a correct and an incorrect attempt.',
    result: 'The script returns "Login Success" only for the matching original string.',
    filename: 'hashing.php',
    code: `<?php
$pw = "my-secret-123";
$hash = password_hash($pw, PASSWORD_BCRYPT);

$attempt = "my-secret-123";
if (password_verify($attempt, $hash)) {
    echo "VERIFIED: Access Granted.";
} else {
    echo "ERROR: Invalid Credentials.";
}`,
    icon: Lock,
    terminalOutput: "VERIFIED: Access Granted.",
  },
  {
    chapter: 'security', id: 'P09-S3', tag: 'Week 9', tagColor: '#ec4899',
    title: 'Environment Safety', subtitle: 'Hidden Credentials', accent: '#ec4899',
    bg: 'radial-gradient(ellipse at center, rgba(236,72,153,0.08) 0%, transparent 70%)',
    content: [
      '.env Files: Never hardcode passwords in your PHP files. Store them in a hidden .env file.',
      'Git Ignore: Ensure your .env file is added to .gitignore so it never reaches GitHub.',
      'Dotenv Library: Use a package like phpdotenv to load these variables into the $_ENV superglobal.',
      'Production: Use server-level environment variables in production (Forge, AWS, Cloud).'
    ],
    syntax: 'DB_PASS=123456; // Inside .env file',
    lab: 'Simulate reading a database password from an environment variable rather than a string.',
    result: 'Code is decoupled from sensitive data.',
    filename: 'dotenv.php',
    code: `<?php
// Simulate loading .env
$_ENV['DB_KEY'] = 'SUPER_SECRET_TOKEN_99';

$key = $_ENV['DB_KEY'] ?? 'fallback-key';
echo "Connecting using key: " . substr($key, 0, 5) . "...";`,
    icon: Key,
    terminalOutput: "Connecting using key: SUPER...",
  },

  /* ── CHAPTER 10: ADVANCED PHP ── */
  {
    chapter: 'advanced', id: 'P10-S1', tag: 'Week 10', tagColor: '#14b8a6',
    title: 'Modern PHP APIs', subtitle: 'JSON & Rest', accent: '#14b8a6',
    bg: 'radial-gradient(ellipse at center, rgba(20,184,166,0.08) 0%, transparent 70%)',
    content: [
      'Header Control: Use header("Content-Type: application/json") to tell the browser what data is coming.',
      'Json Encode: Convert arrays/objects into JSON strings for API consumption.',
      'Status Codes: Use http_response_code() to send 200 (OK), 404 (Not Found), or 500 (Error).',
      'REST Basics: Use HTTP methods (GET, POST, PUT, DELETE) to define actions on your resources.'
    ],
    syntax: 'echo json_encode(["data" => $results]);',
    lab: 'Build a script that returns a list of users as a professional JSON object.',
    result: 'The output is a valid JSON string that a mobile app or React frontend can use.',
    filename: 'api_response.php',
    code: `<?php
header("Content-Type: application/json");
$data = [
    ["id" => 1, "name" => "Ari"],
    ["id" => 2, "name" => "Dev"]
];
echo json_encode($data);`,
    icon: RefreshCw,
    terminalOutput: '[{"id":1,"name":"Ari"},{"id":2,"name":"Dev"}]',
  },
  {
    chapter: 'advanced', id: 'P10-S2', tag: 'Week 10', tagColor: '#14b8a6',
    title: 'AJAX Interactivity', subtitle: 'Waitless Updates', accent: '#14b8a6',
    bg: 'radial-gradient(ellipse at 10% 20%, rgba(20,184,166,0.06) 0%, transparent 60%)',
    content: [
      'No Reload: AJAX allows the page to talk to the server in the background without refreshing.',
      'Fetch API: Modern JavaScript uses the fetch() command to send requests to your PHP scripts.',
      'Data Lifecycle: JS sends Request -> PHP processes -> PHP sends JSON -> JS updates the UI.',
      'Applications: Real-time search, Infinite scrolling, and live form validation.'
    ],
    syntax: 'fetch("api.php").then(res => res.json()).then(data => ...);',
    lab: 'Write a PHP script that receives a "term" and returns matching results for a live search box.',
    result: 'A small JSON array of strings is returned to the simulated frontend.',
    filename: 'live_search.php',
    code: `<?php
$q = "ar"; // Simulated from $_GET['q']
$db = ["Ari", "Alice", "Bob"];
$matches = array_filter($db, fn($u) => str_contains(strtolower($u), $q));

echo json_encode(array_values($matches));`,
    icon: Zap,
    terminalOutput: '["Ari","Alice"]',
  },
  {
    chapter: 'advanced', id: 'P10-S3', tag: 'Week 10', tagColor: '#14b8a6',
    title: 'Composer & Packages', subtitle: 'The Modern Ecosystem', accent: '#14b8a6',
    bg: 'radial-gradient(ellipse at center, rgba(20,184,166,0.08) 0%, transparent 70%)',
    content: [
      'Composer: The dependency manager for PHP. It downloads and updates external libraries.',
      'Autoloading: Use vendor/autoload.php to automatically load all your project classes.',
      'Packagist: The central repository for thousands of PHP packages (Carbon, Guzzle, PDF generators).',
      'Namespaces: Use namespacing to prevent class name collisions when using many libraries.'
    ],
    syntax: 'composer require guzzlehttp/guzzle',
    lab: 'Explain how you would add a "Date and Time" library like Carbon to your project.',
    result: 'Understanding of how modular PHP development works in industry.',
    filename: 'composer.md',
    code: `# 1. Install Composer
# 2. Run: composer require nesbot/carbon
# 3. Use in PHP:
# use Carbon\\Carbon;
# echo Carbon::now()->addDays(7);`,
    icon: Package,
    terminalOutput: "Ready to install: Carbon v2.72.3",
  },

  /* ── CHAPTER 11: MVC INTRO ── */
  {
    chapter: 'mvc', id: 'P11-S1', tag: 'Week 11', tagColor: '#f97316',
    title: 'MVC Architecture', subtitle: 'Separation of Concerns', accent: '#f97316',
    bg: 'radial-gradient(ellipse at center, rgba(249,115,22,0.08) 0%, transparent 70%)',
    content: [
      'Model: The Data Layer. Handles database queries and business logic.',
      'View: The UI Layer. Pure HTML/CSS with minimal PHP logic (printing variables ONLY).',
      'Controller: The Brain. Receives Input -> Calls Model -> Feeds Data to View.',
      'Benefit: Makes your code organized, scalable, and easier for teams to work on.'
    ],
    syntax: 'Controller::index() -> return view("home");',
    lab: 'Sketch the folder structure for a simple MVC application.',
    result: 'A clear hierarchy with app/, public/, and view/ folders.',
    filename: 'mvc_concept.md',
    code: `/controllers/
  UserController.php
/models/
  User.php
/views/
  profile.php
index.php (Router)`,
    icon: Layout,
  },
  {
    chapter: 'mvc', id: 'P11-S2', tag: 'Week 11', tagColor: '#f97316',
    title: 'The Modern Router', subtitle: 'Clean Friendly URLs', accent: '#f97316',
    bg: 'radial-gradient(ellipse at 80% 30%, rgba(249,115,22,0.06) 0%, transparent 60%)',
    content: [
      'Front Controller: All requests (e.g., /about, /contact) are sent to a single index.php file.',
      'URL Parsing: Using parse_url() and $_SERVER["REQUEST_URI"] to determine what the user wants.',
      'Dispatching: Calling a specific function or class based on the URL path.',
      '.htaccess: Use Apache/Nginx rules to hide the "index.php" from your clean URLs.'
    ],
    syntax: '$router->get("/profile", "ProfileController@show");',
    lab: 'Create a simple router that echoes "Homepage" for / and "About" for /about.',
    result: 'The script properly identifies the path and echoes the correct page title.',
    filename: 'router.php',
    code: `<?php
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$route = match ($path) {
    '/' => 'home',
    '/contact' => 'contact',
    default => '404'
};
echo "Routing to: " . $route;`,
    icon: Globe2,
    terminalOutput: "Routing to: home",
  },
  {
    chapter: 'mvc', id: 'P11-S3', tag: 'Week 11', tagColor: '#f97316',
    title: 'Templating Engines', subtitle: 'Clean Views', accent: '#f97316',
    bg: 'radial-gradient(ellipse at center, rgba(249,115,22,0.08) 0%, transparent 70%)',
    content: [
      'PHP as Templates: Use the alternative syntax (if: ... endif;) for cleaner HTML files.',
      'Partials: Include common components like header.php and footer.php to avoid duplicates.',
      'Escaping: Every variable printed in a view should be wrapped in htmlspecialchars().',
      'Modern Engines: Introduction to advanced engines like Blade (Laravel) or Twig.'
    ],
    syntax: '<?php if($user): ?> <h1>Hi</h1> <?php endif; ?>',
    lab: 'Refactor a messy PHP file into a clean layout with included header and footer partials.',
    result: ' कोड much cleaner and more modular.',
    filename: 'view_logic.php',
    code: `<?php
// Layout Partial Simulation
include "header.php"; // <nav>...
echo "<main>Hello from the Page Content</main>";
include "footer.php"; // <footer>...`,
    icon: Box,
    terminalOutput: "Layout Rendered Successfully",
  },

  /* ── CHAPTER 12: PROJECT LAB ── */
  {
    chapter: 'project', id: 'P12-S1', tag: 'Week 12', tagColor: '#10b981',
    title: 'System Design', subtitle: 'Database Planning', accent: '#10b981',
    bg: 'radial-gradient(ellipse at center, rgba(16,185,129,0.08) 0%, transparent 70%)',
    content: [
      'Entity Relations: Identify your tables (Users, Posts, Comments) and how they connect.',
      'Schema Types: Choose correct data types (VARCHAR for names, TEXT for bios, INT for counts).',
      'Primary/Foreign Keys: Essential for linking records between tables securely.',
      'Normalization: Organize data to minimize redundancy and protect data integrity.'
    ],
    syntax: 'User (1) <---> (*) Posts (1) <---> (*) Comments',
    lab: 'Draw a schema diagram for a simple Blog. List every column for the "Users" table.',
    result: 'A complete blueprint for the project database.',
    filename: 'schema.sql',
    code: `CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
    icon: Database,
  },
  {
    chapter: 'project', id: 'P12-S2', tag: 'Week 12', tagColor: '#10b981',
    title: 'Feature Implementation', subtitle: 'Authentication & CRUD', accent: '#10b981',
    bg: 'radial-gradient(ellipse at 20% 80%, rgba(16,185,129,0.06) 0%, transparent 60%)',
    content: [
      'Registration: Securely hash passwords and insert users into the database.',
      'Session Login: Set up a secure login flow with error handling for invalid credentials.',
      'CRUD Flow: Build the logic to create, read, update, and delete blog posts.',
      'Middleware: Protect the dashboard so only logged-in users can add content.'
    ],
    syntax: 'Login -> Dashboard -> Create Post -> View Post',
    lab: 'Implement a "Delete" button for posts that only shows for the post owner.',
    result: 'Functional security gate in the project UI.',
    filename: 'dashboard.php',
    code: `<?php
// Simplified Dashboard logic
if ($user_id === $post_owner_id) {
    echo "<button>Delete Post</button>";
}`,
    icon: ShieldCheck,
  },
  {
    chapter: 'project', id: 'P12-S3', tag: 'Week 12', tagColor: '#10b981',
    title: 'Final Deployment', subtitle: 'Polishing & Launch', accent: '#10b981',
    bg: 'radial-gradient(ellipse at center, rgba(16,185,129,0.08) 0%, transparent 70%)',
    content: [
      'Error Cleaning: Disable display_errors in production to hide sensitive server info.',
      'Validation Review: Run a final security audit on all form inputs and SQL queries.',
      'Environment Sync: Upload your code and migrate your local database to the live server.',
      'Performance: Optimize images, minify CSS, and enable PHP OPcache for max speed.'
    ],
    syntax: 'git push production main',
    lab: 'Simulate a final site check. If "prod" environment is active, hide PHP notices.',
    result: 'Professional, secure launch environment.',
    filename: 'launch.php',
    code: `<?php
define("ENVIRONMENT", "production");
if (ENVIRONMENT === "production") {
    ini_set('display_errors', 0);
    echo "Site is LIVE - Security Mode ON.";
}`,
    icon: Rocket,
    terminalOutput: "Site is LIVE - Security Mode ON.",
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
            {running ? (
              <div className="flex flex-col gap-2 animate-pulse text-zinc-500">
                <span className="flex items-center gap-2">
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" /> 
                  Standard Output Processing...
                </span>
                <div className="h-[1px] bg-white/5 w-full my-2" />
              </div>
            ) : output ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400/50">
                  <CheckCircle2 className="w-3 h-3" /> Execution Success
                </div>
                <pre className="text-zinc-200 indent-2 whitespace-pre-wrap font-bold">{output}</pre>
              </div>
            ) : (
              <div className="text-zinc-600 animate-pulse italic">No output yet. Click 'Run' to execute.</div>
            )}
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

      {/* ── CHAPTER NAV BAR (CONSISTENT WITH LARAVEL) ── */}
      <div className="relative z-[60] flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/5 bg-black/60 backdrop-blur-2xl custom-header">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/courses/backend" 
            className="group flex items-center gap-3 px-3 sm:px-4 h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all active:scale-95 shadow-xl">
            <ArrowLeft className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-white transition-colors hidden lg:block">Exit</span>
          </Link>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="group flex items-center gap-3 sm:gap-4 px-4 sm:px-5 h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/12 hover:border-white/30 transition-all active:scale-95 shadow-2xl overflow-hidden max-w-[150px] sm:max-w-none">
            <div className={`w-7 h-7 rounded-lg flex-none flex items-center justify-center transition-all duration-300 ${isMenuOpen ? 'bg-white text-black rotate-0' : 'bg-black/40 text-zinc-400 group-hover:text-white'}`}>
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div key="x" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }}>
                    <X className="w-3.5 h-3.5" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ scale: 0, rotate: 90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: -90 }}>
                    <Menu className="w-3.5 h-3.5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex flex-col items-start leading-tight overflow-hidden">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 hidden sm:block">Curriculum Map</span>
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-sm font-bold text-white tracking-tight truncate">{chapterInfo.label}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-600 flex-none transition-transform duration-500 ${isMenuOpen ? 'rotate-180 text-white' : ''}`} />
              </div>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-3 sm:gap-8 transition-all">
          <div className="hidden sm:flex flex-col items-end gap-1.5 min-w-[100px] md:min-w-[140px]">
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="text-zinc-500 uppercase tracking-widest font-black hidden lg:block">Chapter Mastery</span>
              <span className="text-white font-black bg-white/10 px-1.5 py-0.5 rounded-md">{Math.round(progress)}%</span>
            </div>
            <div className="w-24 md:w-44 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.2)]" 
                style={{ background: chapterInfo.color }} />
            </div>
          </div>
          <div className="h-10 w-px bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-1.5 sm:gap-3">
            <button onClick={prev} className="w-10 h-10 rounded-xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all active:scale-90 border border-white/5 flex items-center justify-center">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center min-w-[40px] sm:min-w-[45px]">
               <span className="text-[9px] font-black text-zinc-600 uppercase tracking-tighter mb-0.5 hidden xs:block">Slide</span>
               <span className="text-sm font-mono text-zinc-500 flex items-center gap-1 leading-none">
                 <span className="text-white font-bold">{current + 1}</span>
                 <span className="text-zinc-800">/</span>
                 <span>{displaySlides.length}</span>
               </span>
            </div>
            <button onClick={next} className="w-10 h-10 rounded-xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all active:scale-90 border border-white/5 flex items-center justify-center">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── CHAPTER OVERLAY MENU (FULLY RESPONSIVE) ── */}
      <AnimatePresence mode="wait">
        {isMenuOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-10 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-md pointer-events-auto"
            />
            <motion.div
              initial={{ y: 30, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.98 }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="relative w-full max-w-5xl max-h-full bg-[#0d1117] border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] flex flex-col pointer-events-auto overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto px-6 py-8 sm:p-12 scrollbar-none">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {CHAPTERS.map((ch, i) => {
                    const isActive = ch.id === chapterParam;
                    return (
                      <button key={ch.id} 
                        onClick={() => {
                          router.push(`?chapter=${ch.id}`);
                          setIsMenuOpen(false);
                        }}
                        className={`group relative flex items-center gap-4 sm:gap-5 p-4 sm:p-5 rounded-2xl transition-all duration-300 border ${
                          isActive 
                            ? 'bg-white/5 border-white/20 shadow-xl' 
                            : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/10 hover:-translate-y-1'
                        }`}>
                        
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-500 overflow-hidden flex-none ${
                           isActive ? 'scale-110 shadow-2xl' : 'opacity-60 filter group-hover:opacity-100 group-hover:scale-105'
                        }`}
                        style={{ 
                          background: isActive ? ch.color : `${ch.color}25`, 
                          color: isActive ? '#000' : ch.color,
                          border: isActive ? 'none' : `1.5px solid ${ch.color}40`
                        }}>
                          {String(i + 1).padStart(2, '0')}
                        </div>

                        <div className="flex flex-col items-start leading-snug overflow-hidden text-left">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}
                              style={{ color: ch.color }}>
                              Part {i + 1}
                            </span>
                            {isActive && (
                              <span className="text-[7px] sm:text-[8px] font-black px-1.5 py-0.5 rounded bg-white text-black uppercase tracking-tighter">Current</span>
                            )}
                          </div>
                          <span className={`text-sm sm:text-[15px] font-bold tracking-tight transition-all truncate w-full ${isActive ? 'text-white' : 'text-zinc-200 group-hover:text-white'}`}>
                            {ch.label.split(' · ')[1] || ch.label}
                          </span>
                        </div>

                        {isActive && (
                          <div className="ml-auto w-2.5 h-2.5 rounded-full animate-pulse flex-none" style={{ background: ch.color, boxShadow: `0 0 12px ${ch.color}` }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex-none p-6 sm:px-12 sm:py-8 bg-black/20 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-5">
                   <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">
                      Module Navigation
                   </div>
                   <div className="hidden lg:flex items-center gap-2 text-zinc-600 text-[10px] font-bold">
                      <span className="w-1 h-1 rounded-full bg-zinc-700" />
                      Select a chapter to jump directly to those slides
                   </div>
                </div>
                <div className="text-[9px] sm:text-[10px] font-mono text-zinc-500 bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                   FULLSTACK ACADEMY • PHP FUNDAMENTALS
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
