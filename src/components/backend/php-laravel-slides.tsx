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

/* ─── SLIDE DATA ─────────────────────────────────────────────────── */
interface Slide {
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
  showPreview?: boolean;
  icon: React.ElementType;
}

const slides: Slide[] = [
  /* ─── MONTH 1: PHP + LARAVEL FOUNDATION ─── */
  /* WEEK 1: PHP Essentials */
  /* Day 1: Tools & Intro */
  {
    id: "W1-D1-S0", 
    title: "Choose Your IDE", 
    subtitle: "The Developer's Cockpit",
    tag: "PHP Foundation", tagColor: "#34d399", accent: "#10b981",
    bg: "radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    filename: "ide.md",
    content: [
      "VS Code (Free): The industry standard. FAST and flexible.",
      "https://code.visualstudio.com/",
      "PHPStorm (Professional): Deep intelligence for Laravel.",
      "https://www.jetbrains.com/phpstorm/",
      "Antigravity AI: Your Pro-level real-time AI coding collaborator.",
      "https://antigravity.ai/",
      "Pro Tip: Install 'PHP Intelephense' for perfect autocomplete.",
    ],
    lab: "Download and install VS Code or PHPStorm on your machine.",
    result: "Successfully established a professional local development environment.",
    syntax: `Code Editor + Terminal = Power`,
    code: `/* RECOMMENDED EXTENSIONS */\n\n- PHP Intelephense\n- Laravel Extra Intellisense\n- PHP Debug (Xdebug Support)\n- Tailwind CSS IntelliSense`,
    icon: Layout,
  },
  {
    id: "W1-D1-S1", 
    title: "The Backend Engine", 
    subtitle: "What is PHP?",
    tag: "PHP Foundation", tagColor: "#34d399", accent: "#10b981",
    bg: "radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    filename: "theory.md",
    content: [
      "Definition: Hypertext Preprocessor — a server-side language.",
      "Role: Processes data, talks to DBs, and serves dynamic HTML.",
      "Market Share: Powers ~77% of the web (including WordPress/Laravel).",
      "Ecosystem: Robust, mature, and remarkably fast in version 8.x.",
    ],
    lab: "Research how PHP differs from client-side Javascript.",
    result: "Understood that PHP hidden on server while JS runs in browser.",
    syntax: `Client <--- HTML --- Server [PHP + SQL]`,
    code: `/* PHP ARCHITECTURE */\n\n1. User requests page.php\n2. Server executes PHP code\n3. PHP pulls data from Database\n4. Server sends ONLY HTML to browser`,
    icon: Globe,
  },
  {
    id: "W1-D1-S2", 
    title: "Server Environment", 
    subtitle: "XAMPP & Localhost",
    tag: "PHP Foundation", tagColor: "#34d399", accent: "#10b981",
    bg: "radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    filename: "Setup Guide",
    content: [
      "Local Server: Apache or Nginx is needed to 'run' PHP.",
      "Bundles: XAMPP/Laragon provide PHP + Apache + MySQL.",
      "Homebrew: Preferred for Mac users (brew install php).",
      "Document Root: The 'htdocs' folder where your files live.",
    ],
    lab: "Install PHP 8.2+ and check version in terminal.",
    result: "Terminal shows 'PHP 8.x.x (cli)' successfully.",
    syntax: `php -v            # Check version\nphp -S localhost:8000 # Built-in server`,
    code: `# To start a quick server without XAMPP:\ncd your-project-folder\nphp -S localhost:8000`,
    terminal: "php -v",
    terminalOutput: "PHP 8.2.12 (cli) (built: Oct 24 2023)\nCopyright (c) The PHP Group\nZend Engine v4.2.12",
    icon: HardDrive,
  },
  {
    id: "W1-D1-S3", 
    title: "First Echo", 
    subtitle: "Hello PHP World",
    tag: "PHP Foundation", tagColor: "#34d399", accent: "#10b981",
    bg: "radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    filename: "index.php",
    content: [
      "Open Tag: Every script must start with <?php",
      "Semicolons: Every statement MUST end with a ;",
      "Echo: The primary command for printing text to the screen.",
      "Comments: Use // for single line or /* */ for blocks.",
    ],
    lab: "Echo your name and current date using the date() function.",
    result: "Browser displays: 'Hello, [Your Name]! Today is 2026-03-19'.",
    syntax: `<?php\necho "Text";\n?>`,
    code: `<?php\n\n// My first backend script\necho "Hello, Ratha! ";\n\n/* Show the current year */\necho "Copyright " . date("Y");`,
    terminal: "php index.php",
    terminalOutput: "Hello, Ratha! Copyright 2026",
    showPreview: true,
    icon: Terminal,
  },
  {
    id: "W1-D1-S4", 
    title: "PHP in HTML", 
    subtitle: "The Injection Power",
    tag: "PHP Foundation", tagColor: "#34d399", accent: "#10b981",
    bg: "radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    filename: "welcome.php",
    content: [
      "Mixing: PHP can be injected directly into HTML files.",
      "Short Tags: Use <?= 'Text' ?> as a shortcut for echo.",
      "Logic Flow: Wrap HTML inside PHP conditions for dynamic UIs.",
      "Rendering: The user never sees the <?php tags in the source.",
    ],
    lab: "Create an H1 tag and use PHP to put your name inside it.",
    result: "HTML h1 rendered with dynamic PHP content.",
    syntax: `<h1><?= $title; ?></h1>`,
    code: `<!DOCTYPE html>\n<html>\n<body>\n    <h1>Welcome</h1>\n    <p>Server Time: <?php echo date("H:i:s"); ?></p>\n</body>\n</html>`,
    terminalOutput: `<!DOCTYPE html>\n<html>\n<body>\n    <h1>Welcome</h1>\n    <p>Server Time: 16:44:08</p>\n</body>\n</html>`,
    showPreview: true,
    icon: Layout,
  },

  /* Day 2: Data & Storage */
  {
    id: "W1-D2-S1", 
    title: "Variables & Types", 
    subtitle: "Memory for your data",
    tag: "PHP Foundation", tagColor: "#818cf8", accent: "#6366f1",
    bg: "radial-gradient(ellipse at 70% 30%, rgba(99,102,241,0.12) 0%, transparent 60%)",
    filename: "variables.php",
    content: [
      "Dollar Sign: All variables start with $ (e.g., $price).",
      "Case Sensitive: $User and $user are different.",
      "Loose Typing: No need to declare 'String' or 'Int'.",
      "Types: String, Integer, Float, Boolean, Array, Object, NULL.",
    ],
    lab: "Create variables for a Product: Name, Price, and IsAvailable.",
    result: "Defined $name (string), $price (float), and $active (bool).",
    syntax: `$varName = value;`,
    code: `<?php\n\n$title = "Laravel Course"; // String\n$price = 49.99;          // Float\n$qty = 10;                // Integer\n$isFull = false;          // Boolean\n\necho "Course: $title costs $price";`,
    terminal: "php variables.php",
    terminalOutput: "Course: Laravel Course costs $49.99",
    icon: Code2,
  },
  {
    id: "W1-D2-S2", 
    title: "Operators", 
    subtitle: "Math & Logic",
    tag: "PHP Foundation", tagColor: "#818cf8", accent: "#6366f1",
    bg: "radial-gradient(ellipse at 70% 30%, rgba(99,102,241,0.12) 0%, transparent 60%)",
    filename: "math.php",
    content: [
      "Arithmetic: +, -, *, /, % (Modulus).",
      "Assignment: =, +=, -=, *=.",
      "Concatenation: The dot (.) is used to join strings.",
      "Increment: ++$x (pre) vs $x++ (post).",
    ],
    lab: "Calculate the total price for 3 items with 10% tax.",
    result: "Formula: ($price * 3) * 1.1.",
    syntax: `$total = $subtotal . " USD";`,
    code: `<?php\n\n$price = 100;\n$tax = 0.10;\n\n$total = $price + ($price * $tax);\n\necho "The total is: " . $total . " USD";`,
    terminal: "php math.php",
    terminalOutput: "The total is: 110 USD",
    icon: Sparkles,
  },
  {
    id: "W1-D2-S3", 
    title: "Indexed Arrays", 
    subtitle: "Ordered Lists",
    tag: "PHP Foundation", tagColor: "#818cf8", accent: "#6366f1",
    bg: "radial-gradient(ellipse at 70% 30%, rgba(99,102,241,0.12) 0%, transparent 60%)",
    filename: "arrays.php",
    content: [
      "Index: Starts at 0, not 1.",
      "Creation: Use [] (modern) or array() (old).",
      "Count: Use count($arr) to get the length.",
      "Push: $arr[] = 'new' adds to the end.",
    ],
    lab: "Create a list of 5 colors. Print the 3rd color.",
    result: "Correctly accessed index 2 of the array.",
    syntax: `$colors = ["Red", "Blue"];\necho $colors[0];`,
    code: `<?php\n\n$students = ["Sok", "Chea", "Bora"];\n\n// Add new student\n$students[] = "Dara"; \n\necho "Total students: " . count($students) . "\\n";\necho "Third student is: " . $students[2];`,
    terminal: "php arrays.php",
    terminalOutput: "Total students: 4\nThird student is: Bora",
    icon: List,
  },
  {
    id: "W1-D2-S4", 
    title: "Assoc Arrays", 
    subtitle: "The Bridge Operator (=>)",
    tag: "PHP Foundation", tagColor: "#818cf8", accent: "#6366f1",
    bg: "radial-gradient(ellipse at 70% 30%, rgba(99,102,241,0.12) 0%, transparent 60%)",
    filename: "users.php",
    content: [
      "Key-Value: Map custom keys to values (like ID -> Name).",
      "Bridge: Use => to link key to value.",
      "Access: $user['email'] returns the value.",
      "Nesting: Arrays can contain other arrays.",
    ],
    lab: "Build a user profile with name, email, and role.",
    result: "Created a complex data structure for a user.",
    syntax: `[ "key" => "value" ]`,
    code: `<?php\n\n$profile = [\n    "username" => "ratha_dev",\n    "email" => "ratha@example.com",\n    "followers" => 1200\n];\n\necho "User: " . $profile["username"];\necho "\\nEmail: " . $profile["email"];`,
    terminal: "php users.php",
    terminalOutput: "User: ratha_dev\nEmail: ratha@example.com",
    icon: LinkIcon,
  },

  /* Day 3: Logic & Control */
  {
    id: "W1-D3-S1", 
    title: "Conditionals", 
    subtitle: "If / Else Statements",
    tag: "PHP Foundation", tagColor: "#22d3ee", accent: "#06b6d4",
    bg: "radial-gradient(ellipse at 30% 70%, rgba(6,182,212,0.12) 0%, transparent 60%)",
    filename: "logic.php",
    content: [
      "If: Runs code if condition is TRUE.",
      "Else: Runs code if condition is FALSE.",
      "Elseif: Checks a second condition if the first fails.",
      "Braces: {} wrap the block of code to execute.",
    ],
    lab: "Check if $grade is >= 50. Echo 'Pass' or 'Fail'.",
    result: "Logical flow correctly branching based on input.",
    syntax: `if (cond) { ... } else { ... }`,
    code: `<?php\n\n$hour = date("H");\n\nif ($hour < 12) {\n    echo "Good Morning!";\n} elseif ($hour < 18) {\n    echo "Good Afternoon!";\n} else {\n    echo "Good Evening!";\n}`,
    terminal: "php logic.php",
    terminalOutput: "Good Afternoon!",
    icon: ShieldCheck,
  },
  {
    id: "W1-D3-S2", 
    title: "Comparisons", 
    subtitle: "Strict vs Loose",
    tag: "PHP Foundation", tagColor: "#22d3ee", accent: "#06b6d4",
    bg: "radial-gradient(ellipse at 30% 70%, rgba(6,182,212,0.12) 0%, transparent 60%)",
    filename: "compare.php",
    content: [
      "==: Loose equality (1 == '1' is true).",
      "===: Strict equality (1 === '1' is false) — Best Practice.",
      "!= / !==: Inequalities.",
      ">, <, >=, <=: Numeric comparisons.",
    ],
    lab: "Test comparison between integer 10 and string '10'.",
    result: "Understood why === is safer for security.",
    syntax: `$a === $b // Check type AND value`,
    code: `<?php\n\n$password = "12345";\n\n// Strict check is safer\nif ($password === 12345) {\n    echo "Logged In";\n} else {\n    echo "Invalid Type!";\n}`,
    terminal: "php compare.php",
    terminalOutput: "Invalid Type!",
    icon: Lock,
  },
  {
    id: "W1-D3-S3", 
    title: "Logical Ops", 
    subtitle: "Complex conditions",
    tag: "PHP Foundation", tagColor: "#22d3ee", accent: "#06b6d4",
    bg: "radial-gradient(ellipse at 30% 70%, rgba(6,182,212,0.12) 0%, transparent 60%)",
    filename: "security.php",
    content: [
      "&& (AND): Both conditions must be true.",
      "|| (OR): At least one must be true.",
      "! (NOT): Reverses the boolean value.",
      "Combined: if ($isLoggedIn && $isAdmin).",
    ],
    lab: "Allow entry only if user has an 'Active' status AND is 18+.",
    result: "Restricted content based on multiple conditions.",
    syntax: `if ($age > 18 && $id === true)`,
    code: `<?php\n\n$is_admin = true;\n$is_blocked = false;\n\nif ($is_admin && !$is_blocked) {\n    echo "Welcome to Dashboard";\n} else {\n    echo "Access Denied";\n}`,
    terminal: "php security.php",
    terminalOutput: "Welcome to Dashboard",
    icon: ShieldAlert,
  },
  {
    id: "W1-D3-S4", 
    title: "Switch / Match", 
    subtitle: "Multiple values",
    tag: "PHP Foundation", tagColor: "#22d3ee", accent: "#06b6d4",
    bg: "radial-gradient(ellipse at 30% 70%, rgba(6,182,212,0.12) 0%, transparent 60%)",
    filename: "roles.php",
    content: [
      "Switch: Better for checking many values of one variable.",
      "Break: Stops the execution once a match is found.",
      "Default: Fallback if no cases match.",
      "Match (PHP 8): Cleaner, returnable version of switch.",
    ],
    lab: "Assign a message based on user role: 'admin', 'editor', 'guest'.",
    result: "Used switch to handle 3 different roles.",
    syntax: `switch($role) { case 'admin': ... }`,
    code: `<?php\n\n$role = "admin";\n\nswitch ($role) {\n    case "admin":\n        echo "Full Access granted";\n        break;\n    case "editor":\n        echo "Edit access only";\n        break;\n    default:\n        echo "View only";\n}`,
    terminal: "php roles.php",
    terminalOutput: "Full Access granted",
    icon: Activity,
  },

  /* Day 4: Repetition & Reusability */
  {
    id: "W1-D4-S1", 
    title: "The Foreach King", 
    subtitle: "Looping through life",
    tag: "PHP Foundation", tagColor: "#fbbf24", accent: "#f59e0b",
    bg: "radial-gradient(ellipse at 60% 40%, rgba(245,158,11,0.12) 0%, transparent 60%)",
    filename: "loop.php",
    content: [
      "Foreach: The industry standard for arrays.",
      "Syntax: foreach ($array as $value).",
      "Keys: foreach ($array as $key => $value).",
      "Dynamic: Automatically stops at the end of the data.",
    ],
    lab: "Loop through [10, 20, 30] and echo 'Price: [number]'.",
    result: "Dynamically generated 3 lines of output.",
    syntax: `foreach ($arr as $v)`,
    code: `<?php\n\n$colors = ["Red", "Green", "Blue"];\n\nforeach ($colors as $color) {\n    echo "I love $color\\n";\n}`,
    terminal: "php loop.php",
    terminalOutput: "I love Red\nI love Green\nI love Blue",
    showPreview: true,
    icon: RotateCcw,
  },
  {
    id: "W1-D4-S2", 
    title: "While & For", 
    subtitle: "Traditional loops",
    tag: "PHP Foundation", tagColor: "#fbbf24", accent: "#f59e0b",
    bg: "radial-gradient(ellipse at 60% 40%, rgba(245,158,11,0.12) 0%, transparent 60%)",
    filename: "counter.php",
    content: [
      "For: Used when you know the total loop count.",
      "While: Used when you loop 'until' something happens.",
      "Infinity: Beware of while(true) without a break!",
      "Structure: (Init; Condition; Increment).",
    ],
    lab: "Count from 10 down to 1 using a for loop.",
    result: "Countdown visible in terminal.",
    syntax: `for ($i=0; $i<5; $i++)`,
    code: `<?php\n\n// Classic For\nfor ($i = 1; $i <= 3; $i++) {\n    echo "Step $i\\n";\n}\n\n// While\n$c = 0;\nwhile ($c < 2) {\n    echo "Counting...\\n";\n    $c++;\n}`,
    terminal: "php counter.php",
    terminalOutput: "Step 1\nStep 2\nStep 3\nCounting...\nCounting...",
    icon: RefreshCw,
  },
  {
    id: "W1-D4-S3", 
    title: "Intro to Functions", 
    subtitle: "Don't Repeat Yourself (DRY)",
    tag: "PHP Foundation", tagColor: "#fbbf24", accent: "#f59e0b",
    bg: "radial-gradient(ellipse at 60% 40%, rgba(245,158,11,0.12) 0%, transparent 60%)",
    filename: "functions.php",
    content: [
      "Functions: Reusable blocks of code stored in memory.",
      "Naming: CamelCase or snake_case are common.",
      "Parameters: Variables passed into the function.",
      "Arguments: The actual values provided when calling.",
    ],
    lab: "Write a function greet($name) that echoes 'Hi [name]!'.",
    result: "Successfully reused code by calling greet('Ratha').",
    syntax: `function myFunc($p) { ... }`,
    code: `<?php\n\nfunction showUser($name) {\n    echo "User: " . $name . "\\n";\n}\n\nshowUser("Alice");\nshowUser("Bob");`,
    terminal: "php functions.php",
    terminalOutput: "User: Alice\nUser: Bob",
    icon: Zap,
  },
  {
    id: "W1-D4-S4", 
    title: "Returns & Scopes", 
    subtitle: "Sending data back",
    tag: "PHP Foundation", tagColor: "#fbbf24", accent: "#f59e0b",
    bg: "radial-gradient(ellipse at 60% 40%, rgba(245,158,11,0.12) 0%, transparent 60%)",
    filename: "calculation.php",
    content: [
      "Return: Ends function execution and gives back a value.",
      "Local Scope: Variables inside functions stay inside.",
      "Global Scope: Variables outside are not accessible inside (usually).",
      "Type Hinting: function add(int $a): int { }.",
    ],
    lab: "Create a function add($a, $b) that returns the sum.",
    result: "Calculated sum and used it in a calculation outside.",
    syntax: `return $result;`,
    code: `<?php\n\nfunction calculateTax($sub) {\n    return $sub * 0.10;\n}\n\n$tax = calculateTax(500);\necho "Tax to pay: $$tax";`,
    terminal: "php calculation.php",
    terminalOutput: "Tax to pay: $50",
    icon: Sparkles,
  },

  /* Day 5: OOP & Advanced */
  {
    id: "W1-D5-S1", 
    title: "OOP: Classes", 
    subtitle: "The Blueprint",
    tag: "PHP Foundation", tagColor: "#fb923c", accent: "#f97316",
    bg: "radial-gradient(ellipse at 25% 55%, rgba(249,115,22,0.12) 0%, transparent 60%)",
    filename: "User.php",
    content: [
      "Class: The model or template (e.g., User).",
      "Properties: Data held by the class.",
      "Visibility: public, private, protected.",
      "Instance: A concrete realization (e.g., $me = new User()).",
    ],
    lab: "Define a class 'Car' with $brand property.",
    result: "Created a template to build multiple Car objects.",
    syntax: `class MyClass { ... }`,
    code: `<?php\n\nclass User {\n    public $username;\n}\n\n$ratha = new User();\n$ratha->username = "Ratha";\n\necho "Active User: " . $ratha->username;`,
    terminal: "php User.php",
    terminalOutput: "Active User: Ratha",
    icon: Box,
  },
  {
    id: "W1-D5-S2", 
    title: "OOP: Methods", 
    subtitle: "Object Actions",
    tag: "PHP Foundation", tagColor: "#fb923c", accent: "#f97316",
    bg: "radial-gradient(ellipse at 25% 55%, rgba(249,115,22,0.12) 0%, transparent 60%)",
    filename: "Product.php",
    content: [
      "Methods: Functions defined within a class.",
      "$this: Refers to the current object instance.",
      "Calling: Use the arrow operator ($obj->method()).",
      "Logic: Methods handle the behavior of the object.",
    ],
    lab: "Add a method 'getDiscountedPrice()' to a Product class.",
    result: "The object now calculates its own discounted price.",
    syntax: `$this->property`,
    code: `<?php\n\nclass Product {\n    public $price = 100;\n\n    public function getPrice() {\n        return $this->price;\n    }\n}\n\n$p = new Product();\necho "Price is: " . $p->getPrice();`,
    terminal: "php Product.php",
    terminalOutput: "Price is: 100",
    icon: Workflow,
  },
  {
    id: "W1-D5-S3", 
    title: "OOP: Construct", 
    subtitle: "Magic initialization",
    tag: "PHP Foundation", tagColor: "#fb923c", accent: "#f97316",
    bg: "radial-gradient(ellipse at 25% 55%, rgba(249,115,22,0.12) 0%, transparent 60%)",
    filename: "Construct.php",
    content: [
      "__construct: Runs automatically when 'new' is called.",
      "Purpose: Setting initial data for the object.",
      "Parameters: Pass data into object on creation.",
      "Magic Method: Starts with double underscores.",
    ],
    lab: "Pass 'MacBook' and 1200 into a Product constructor.",
    result: "Object initialized with data in one line.",
    syntax: `public function __construct()`,
    code: `<?php\n\nclass Course {\n    public $name;\n\n    public function __construct($n) {\n        $this->name = $n;\n    }\n}\n\n$api = new Course("Laravel API");\necho "Course initialized: " . $api->name;`,
    terminal: "php Construct.php",
    terminalOutput: "Course initialized: Laravel API",
    icon: Sparkles,
  },
  {
    id: "W1-D5-S4", 
    title: "Week 1 Finale", 
    subtitle: "Foundation Complete",
    tag: "PHP Foundation", tagColor: "#34d399", accent: "#10b981",
    bg: "radial-gradient(ellipse at 50% 50%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    filename: "Pro Challenge",
    content: [
      "Recap: You learned Setup, Variables, Logic, Loops, and OOP.",
      "Next Level: Moving from pure PHP to the Laravel Framework.",
      "Milestone: You can now build CLI tools and simple scripts.",
      "Pro Tip: Use Antigravity AI to debug and refactor your logic.",
    ],
    lab: "Build a mini system that loops through users and echoes their roles.",
    result: "Synthesized all Week 1 knowledge into a working project.",
    syntax: `DONE: Week 1 Foundation`,
    code: `<?php\n\n// --- ZERO TO PRO STATUS ---\n\n1. Setup OK ✅\n2. Logic OK ✅\n3. Loops OK ✅\n4. Classes OK ✅\n\nMOVING TO WEEK 2...`,
    terminal: "php --version",
    terminalOutput: "PHP Mastery: Level 1 ACHIEVED\nProceeding to Laravel Routing...",
    icon: Trophy,
  },


  /* WEEK 2: Laravel Setup + Routing */
  {
    id: "W2-D1-S1", 
    title: "Intro to Composer", 
    subtitle: "The Dependency Engine",
    tag: "Laravel Basics", tagColor: "#f43f5e", accent: "#e11d48",
    bg: "radial-gradient(ellipse at 70% 60%, rgba(225,29,72,0.12) 0%, transparent 60%)",
    content: [
      "Composer: PHP's package manager handles all dependencies.",
      "Autoloading: Automatically loads all classes in your project.",
      "Vendor folder: Stores all third-party code like the Laravel framework.",
      "Checks: Essential to have Composer installed globally.",
    ],
    lab: "Check your composer version in the terminal.",
    result: "Output shows Composer version 2.x.x.",
    syntax: `composer --version`,
    code: `{
    "name": "laravel/laravel",
    "description": "The Laravel Framework.",
    "require": {
        "php": "^8.2",
        "laravel/framework": "^11.0",
        "laravel/sanctum": "^4.0"
    }
}`,
    terminal: "composer --version",
    icon: Package,
  },
  {
    id: "W2-D1-S2", 
    title: "Installing Laravel", 
    subtitle: "The create-project command",
    tag: "Laravel Basics", tagColor: "#f43f5e", accent: "#e11d48",
    bg: "radial-gradient(ellipse at 70% 60%, rgba(225,29,72,0.12) 0%, transparent 60%)",
    content: [
      "Command: composer create-project laravel/laravel app-name.",
      "Skeleton: Downloads a fresh, ready-to-run project folder.",
      "Configuration: Sets up .env file and application key automatically.",
      "Modern PHP: Requires PHP 8.2 or higher for latest versions.",
    ],
    lab: "Run the install command to create 'my-app'.",
    result: "A new folder is created with all Laravel files.",
    syntax: `composer create-project laravel/laravel <name>`,
    code: `# This command downloads the latest Laravel skeleton\ncomposer create-project laravel/laravel backend-app`,
    terminal: "composer create-project laravel/laravel my-app",
    terminalOutput: "Creating a \"laravel/laravel\" project at \"./my-app\"\nInstalling laravel/laravel (v11.x.x)\n- Downloading laravel/laravel (v11.x.x)\n- Installing laravel/laravel (v11.x.x): Extracting archive\n- Installing symfony/console (v7.x.x): Extracting archive\n...\nProject scaffolded successfully.\n\nType 'cd my-app' to start.",
    icon: Rocket,
  },
  {
    id: "W2-D1-S3", 
    title: "Starting the App", 
    subtitle: "php artisan serve",
    tag: "Laravel Basics", tagColor: "#f43f5e", accent: "#e11d48",
    bg: "radial-gradient(ellipse at 70% 60%, rgba(225,29,72,0.12) 0%, transparent 60%)",
    content: [
      "Artisan: Laravel's powerful command-line interface.",
      "Serve CLI: Starts a local development server efficiently.",
      "Access: Open http://localhost:8000 in your browser.",
      "Logging: Every request will show up in your terminal.",
    ],
    lab: "Serve your application and visit the dashboard.",
    result: "The classic Laravel welcome screen appears.",
    syntax: `php artisan serve`,
    code: `/* --- DONE INSTALL --- */\n// Run this inside your project folder\nphp artisan serve`,
    terminal: "php artisan serve",
    terminalOutput: "   INFO  Server running on [http://127.0.0.1:8000].\n\n  Press Ctrl+C to stop the server\n\n2026-03-19 16:24:43 ................... GET / ✔\n2026-03-19 16:24:45 ................... GET /favicon.ico ✔",
    icon: Server,
  },
  {
    id: "W2-D2", 
    title: "Folder Structure", 
    subtitle: "Knowing your way around",
    tag: "Laravel Basics", tagColor: "#34d399", accent: "#10b981",
    bg: "radial-gradient(ellipse at 40% 25%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    content: [
      "app/: Where your core code lives (Models, Controllers).",
      "routes/: The map of your URL paths.",
      "resources/: Views (HTML/Blade) and Frontend assets.",
      "database/: Migrations and Seeders for your schema.",
    ],
    lab: "Explore the app directory. Find where Controllers are stored.",
    result: "Navigated to app/Http/Controllers successfully.",
    syntax: `app/Http/Controllers/  -- Logic\nroutes/web.php         -- URLs\nresources/views/       -- UI`,
    code: `// --- PROJECT MAP ---\n\n// 📂 app/          ← Logic (Models, Controllers)\n// 📂 config/       ← Settings\n// 📂 database/     ← Schema & Migrations\n// 📂 public/       ← Entry point (index.php)\n// 📂 resources/    ← Blade Views, CSS, JS\n// 📂 routes/       ← URL routes\n// 📂 storage/      ← Uploads & Cache\n// .env             ← Environment secrets`,
    icon: HardDrive,
  },
  {
    id: "W2-D3", 
    title: "Basic Routing", 
    subtitle: "Connecting URLs to code",
    tag: "Laravel Basics", tagColor: "#818cf8", accent: "#6366f1",
    bg: "radial-gradient(ellipse at 55% 65%, rgba(99,102,241,0.12) 0%, transparent 60%)",
    content: [
      "Route::get(): Handles GET requests (opening a page).",
      "Closures: Simple functions used directly in the route file.",
      "web.php: Main file for browser-based routes.",
      "Returns: You can return strings, arrays, or views.",
    ],
    lab: "Create a route '/about' that returns 'This is the about page'.",
    result: "Visiting /about shows the message in your browser.",
    syntax: `use Illuminate\\Support\\Facades\\Route;\n\nRoute::get('/hello', fn() => "Hello");`,
    code: `<?php\n\nuse Illuminate\\Support\\Facades\\Route;\n\n// 1. Simple text return\nRoute::get('/welcome', function () {\n    return "Welcome to our platform!";\n});\n\n// 2. Returning an array (auto-converts to JSON)\nRoute::get('/api/status', function () {\n    return ['status' => 'online', 'version' => '1.0'];\n});`,
    icon: Workflow,
  },
  {
    id: "W2-D4", 
    title: "Route Parameters", 
    subtitle: "Dynamic URL parts",
    tag: "Laravel Basics", tagColor: "#38bdf8", accent: "#0ea5e9",
    bg: "radial-gradient(ellipse at 20% 40%, rgba(14,165,233,0.12) 0%, transparent 60%)",
    content: [
      "{id}: Curly braces define a placeholder in the URL.",
      "Dependency Injection: Route passes variables to your logic.",
      "Optional Params: Adding ? (e.g., {name?}) makes it optional.",
      "Validation: You can regex-constrain parameters.",
    ],
    lab: "Create a route /user/{id}. Display 'User ID is: [id]'.",
    result: "Visiting /user/42 displays 'User ID is: 42'.",
    syntax: `Route::get('/user/{id}', function ($id) {\n    return "User: " . $id;\n});`,
    code: `<?php\n\n// 1. Mandatory Parameter\nRoute::get('/post/{slug}', function ($slug) {\n    return "Reading post: {$slug}";\n});\n\n// 2. Optional Parameter with default\nRoute::get('/search/{term?}', function ($term = 'all') {\n    return "Searching for: {$term}";\n});`,
    icon: Send,
  },
  {
    id: "W2-D5", 
    title: "Routing Practice", 
    subtitle: "Consolidating knowledge",
    tag: "Laravel Basics", tagColor: "#fbbf24", accent: "#f59e0b",
    bg: "radial-gradient(ellipse at 65% 35%, rgba(245,158,11,0.12) 0%, transparent 60%)",
    content: [
      "Naming Routes: Give paths aliases for easy linking.",
      "Route Groups: Apply shared logic to multiple routes.",
      "Debugging: use php artisan route:list to see all paths.",
      "Redirects: Send users from one URL to another.",
    ],
    lab: "Create 3 routes: Home, Profile, Contact. Name them.",
    result: "Artisan route:list should show your named routes clearly.",
    syntax: `Route::get('/', fn() => "Home")->name('home');\nRoute::redirect('/old', '/new');`,
    code: `<?php\n\n// Named routes make links cleaner\nRoute::get('/contact-us', function() {\n    return "Contact form";\n})->name('contact');\n\n// Using Grouping (Advanced Preview)\nRoute::prefix('admin')->group(function () {\n    Route::get('/dashboard', fn() => 'Dashboard');\n    Route::get('/users', fn() => 'Users List');\n});`,
    icon: List,
  },

  /* WEEK 3: Controllers */
  {
    id: "W3-D1", 
    title: "MVC Architecture", 
    subtitle: "The brain of your app",
    tag: "Controllers", tagColor: "#c084fc", accent: "#a855f7",
    bg: "radial-gradient(ellipse at 70% 50%, rgba(168,85,247,0.12) 0%, transparent 60%)",
    content: [
      "Model: Handles data and database logic.",
      "View: Handles what the user sees (HTML).",
      "Controller: The 'glue' — receives request, talks to Model, returns View.",
      "Separation of Concerns: Keeps code clean and maintainable.",
    ],
    lab: "Sketch an MVC flow for a 'Login' request on paper or whiteboard.",
    result: "Understood that Controller logic doesn't belong in route files.",
    syntax: `Request → Controller → View\nRequest → Controller → Model → View`,
    code: `# WHY MVC?\n\n# ❌ BAD: Routes.php handling database logic\n# Route::get('/users', function() {\n#    $users = DB::table('users')->get(); // This is messy!\n#    return view('users', ['users' => $users]);\n# });\n\n# ✅ GOOD: Route points to Controller\n# Route::get('/users', [UserController::class, 'index']);`,
    icon: Layers,
  },
  {
    id: "W3-D2", 
    title: "Create Controller", 
    subtitle: "Organising your handlers",
    tag: "Controllers", tagColor: "#f43f5e", accent: "#e11d48",
    bg: "radial-gradient(ellipse at 35% 60%, rgba(225,29,72,0.12) 0%, transparent 60%)",
    content: [
      "Artisan make:controller: Generates the file instantly.",
      "--resource flag: Generates all CRUD methods (index, store, etc).",
      "Location: app/Http/Controllers.",
      "Namespaces: Ensure paths are correct for autoloading.",
    ],
    lab: "Run 'php artisan make:controller ProductController'.",
    result: "ProductController.php exists in your Controllers folder.",
    syntax: `php artisan make:controller UserController`,
    code: `# Run this in terminal:\nphp artisan make:controller UserController\n\n# --- Code in file ---\n<?php\n\nnamespace App\\Http\\Controllers;\n\nuse Illuminate\\Http\\Request;\n\nclass UserController extends Controller {\n    // methods go here\n}`,
    icon: Terminal,
  },
  {
    id: "W3-D3", 
    title: "Controller Methods", 
    subtitle: "Where the logic lives",
    tag: "Controllers", tagColor: "#a78bfa", accent: "#8b5cf6",
    bg: "radial-gradient(ellipse at 25% 45%, rgba(139,92,246,0.12) 0%, transparent 60%)",
    content: [
      "Methods: Public functions that handle specific actions.",
      "index(): Usually for listing multiple items.",
      "show(): For displaying a single item by its ID.",
      "Request $request: Auto-injected to read form or URL data.",
    ],
    lab: "Add an 'index' and a 'greet' method to your Controller.",
    result: "Controller has two working methods returning different text.",
    syntax: `public function index() {\n    return "List of users";\n}`,
    code: `<?php\n\nclass UserController extends Controller {\n    \n    public function index() {\n        return "All Users Page";\n    }\n\n    public function show($id) {\n        return "Viewing User Profile: " . $id;\n    }\n\n    public function greet(Request $request) {\n        $name = $request->input('name', 'Guest');\n        return "Hello, " . $name;\n    }\n}`,
    icon: Code2,
  },
  {
    id: "W3-D4", 
    title: "Connect Routes", 
    subtitle: "Linking URL to Method",
    tag: "Controllers", tagColor: "#fbbf24", accent: "#f59e0b",
    bg: "radial-gradient(ellipse at 55% 30%, rgba(245,158,11,0.12) 0%, transparent 60%)",
    content: [
      "Controller Array: [Controller::class, 'method_name'].",
      "Imports: You MUST use 'use' statement at the top of web.php.",
      "Single Action Controllers: Use __invoke() for controllers with 1 task.",
      "Resource Routes: One line for all 7 CRUD routes.",
    ],
    lab: "Connect web.php route '/products' to ProductController index().",
    result: "Visiting /products runs the index function successfully.",
    syntax: `use App\\Http\\Controllers\\PostController;\n\nRoute::get('/posts', [PostController::class, 'index']);`,
    code: `<?php\n// routes/web.php\n\nuse App\\Http\\Controllers\\ProductController;\n\n// 1. Individual Connection\nRoute::get('/products', [ProductController::class, 'index']);\n\n// 2. Resource Connection (Advanced)\nRoute::resource('posts', PostController::class);\n\n// Result of Resource Route:\n// GET /posts (index)\n// POST /posts (store)\n// GET /posts/{id} (show)...`,
    icon: Workflow,
  },
  {
    id: "W3-D5", 
    title: "Controller Practice", 
    subtitle: "Clean logic separation",
    tag: "Controllers", tagColor: "#fb7185", accent: "#f43f5e",
    bg: "radial-gradient(ellipse at 70% 65%, rgba(244,63,94,0.12) 0%, transparent 60%)",
    content: [
      "Passing Data: Sending variables from Controller to View.",
      "Input Handling: Reading from $request->all().",
      "Validation Preview: Checking data before processing.",
      "Refactoring: Moving logic out of web.php into Controllers.",
    ],
    lab: "Create a CalculatorController with an 'add' method.",
    result: "Visiting /add/10/20 returns 30 via the controller.",
    syntax: `public function add($a, $b) {\n    return $a + $b;\n}`,
    code: `<?php\n\n// routes/web.php\nRoute::get('/calc/add/{a}/{b}', [CalcController::class, 'add']);\n\n// CalcController.php\npublic function add($a, $b) {\n    $sum = $a + $b;\n    return "The result is: " . $sum;\n}`,
    icon: Activity,
  },

  /* WEEK 4: Blade Views */
  {
    id: "W4-D1", 
    title: "Blade Basics", 
    subtitle: "Laravel's Template Engine",
    tag: "Blade UI", tagColor: "#14b8a6", accent: "#0d9488",
    bg: "radial-gradient(ellipse at 40% 70%, rgba(13,148,136,0.12) 0%, transparent 60%)",
    content: [
      "The {{ $var }} Syntax: For echoing escaped data safely.",
      "File extension: Files must end in .blade.php.",
      "Directives: Start with @ (e.g., @if, @foreach).",
      "Vanilla PHP still works, but Blade is much cleaner.",
    ],
    lab: "Create home.blade.php and display a variable $site_name using {{ }}.",
    result: "Page shows the site name correctly without HTML entities.",
    syntax: `{{ $name }} -- Echo\n@if(true) -- Condition`,
    code: `<!-- home.blade.php -->\n\n<h1>Welcome, {{ $user->name }}</h1>\n\n<p>\n    Status: \n    @if($isOnline)\n        <span class="text-green">Active</span>\n    @else\n        <span class="text-gray">Away</span>\n    @endif\n</p>`,
    terminalOutput: `<h1>Welcome, Ratha</h1>\n\n<p>\n    Status: \n    <span style="color: green">Active</span>\n</p>`,
    showPreview: true,
    icon: Layout,
  },
  {
    id: "W4-D2", 
    title: "Layout & Slots", 
    subtitle: "Reusable UI structures",
    tag: "Blade UI", tagColor: "#c084fc", accent: "#a855f7",
    bg: "radial-gradient(ellipse at 25% 35%, rgba(168,85,247,0.12) 0%, transparent 60%)",
    content: [
      "Main Layout: A single file for header, footer, and navigation.",
      "@yield('content'): Defines a gap where specific pages inject content.",
      "@extends: Tells a page to use a specific layout.",
      "@section: Wraps the content to be injected.",
    ],
    lab: "Create 'layout.blade.php' with Nav/Footer. Extend it in 'about.blade.php'.",
    result: "About page shows the shared navigation and unique content.",
    syntax: `@yield('content')\n@extends('layout')\n@section('content')`,
    code: `<!-- layout.blade.php -->\n<html>\n  <body>\n    <nav>...</nav>\n    @yield('content')\n    <footer>...</footer>\n  </body>\n</html>\n\n<!-- home.blade.php -->\n@extends('layout')\n@section('content')\n  <h1>Welcome Home</h1>\n@endsection`,
    icon: Layers,
  },
  {
    id: "W4-D3", 
    title: "Passing Data to Views", 
    subtitle: "Connecting Logic to UI",
    tag: "Blade UI", tagColor: "#4ade80", accent: "#22c55e",
    bg: "radial-gradient(ellipse at 60% 55%, rgba(34,197,94,0.12) 0%, transparent 60%)",
    content: [
      "view($path, $data): The function to return a template.",
      "Data Array: Key in array becomes variable in Blade.",
      "compact(): Shorthand to create an array from variables.",
      "Nested folders: use dot notation (e.g., users.profile).",
    ],
    lab: "Pass an array of 5 skills from UserController to a view and display them.",
    result: "Skills are printed on the web page using Blade syntax.",
    syntax: `return view('user', ['u' => $user]);\nreturn view('user', compact('user'));`,
    code: `<?php\n\npublic function index() {\n    $name = "Ratha";\n    $skills = ["PHP", "Laravel", "MySQL", "React"];\n\n    return view('portfolio', [\n        'name' => $name,\n        'skills' => $skills\n    ]);\n}`,
    icon: Database,
  },
  {
    id: "W4-D4", 
    title: "Loops in Blade", 
    subtitle: "Displaying lists beautifully",
    tag: "Blade UI", tagColor: "#f97316", accent: "#ea580c",
    bg: "radial-gradient(ellipse at 35% 25%, rgba(234,88,12,0.12) 0%, transparent 60%)",
    content: [
      "@foreach: Iterates over collections or arrays.",
      "$loop variable: Provides info like index, first, last, count.",
      "@empty: Handles the case where the array is empty.",
      "@forelse: Shorthand for foreach + empty check.",
    ],
    lab: "Use @forelse to loop through an array of products. Show 'No items' if empty.",
    result: "A clean list or a fallback message depending on item count.",
    syntax: `@foreach($users as $u) ... @endforeach\n@forelse($items as $i) ... @empty ... @endforelse`,
    code: `<!-- products.blade.php -->\n<ul>\n    @forelse($products as $p)\n        <li>{{ $p['name'] }} - \${{ $p['price'] }}</li>\n    @empty\n        <p>No products found in the store.</p>\n    @endforelse\n</ul>`,
    icon: RotateCcw,
  },
  {
    id: "W4-D5", 
    title: "Static Mini Project", 
    subtitle: "Month 1 Graduation",
    tag: "Blade UI", tagColor: "#60a5fa", accent: "#3b82f6",
    bg: "radial-gradient(ellipse at 70% 40%, rgba(59,130,246,0.12) 0%, transparent 60%)",
    content: [
      "Goal: Build a static multi-page portfolio website.",
      "Features: Home, About, Skills, Projects, Contact.",
      "Requirements: Shared Layout, Controller for data, Blade loops.",
      "No Database yet: Hardcode data in the Controller for now.",
    ],
    lab: "Build the Portfolio. Connect all pages using named routes.",
    result: "A fully functional multi-page site with cohesive design.",
    syntax: `<a href="{{ route('home') }}">Home</a>\n<a href="{{ route('about') }}">About</a>`,
    code: `<?php\n// PortfolioController.php\npublic function index() {\n    $projects = [\n        ['t' => 'Ecom UI', 's' => 'Laravel'],\n        ['t' => 'Mobile App', 's' => 'Flutter'],\n    ];\n    return view('welcome', compact('projects'));\n}\n\n// welcome.blade.php\n@extends('layout')\n@section('content')\n  <h2>My Work</h2>\n  @foreach($projects as $p)\n    <div class="card">{{ $p['t'] }}</div>\n  @endforeach\n@endsection`,
    icon: Sparkles,
  },

  /* ─── MONTH 2: DATABASE + CRUD ─── */
  /* WEEK 5: Database & Migration */
  /* WEEK 5: Database & Migration */
  {
    id: "W5-D1-S1", 
    title: "Database Intro", 
    subtitle: "Schema Design Concepts",
    tag: "Database", tagColor: "#34d399", accent: "#10b981",
    bg: "radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    content: [
      "Relational Databases: Data is stored in Tables linked by Keys.",
      "Columns: Define the type of data (string, integer, boolean).",
      "Laravel Schema: A PHP blueprint to define database tables.",
      "MySQL/PostgreSQL: The engines Laravel talks to primary.",
    ],
    lab: "Design a 'products' table on paper with 5 essential columns.",
    result: "Identified title, description, price, stock, and timestamps.",
    syntax: `Schema::create('table', function (Blueprint $table) {\n    $table->id();\n    $table->string('name');\n});`,
    code: `// Conceptual Schema for E-commerce\n\n// Table: categories\n// - id\n// - name\n\n// Table: products\n// - id\n// - category_id\n// - name\n// - price\n// - stock`,
    icon: Database,
  },
  {
    id: "W5-D1-S2", 
    title: "The .env File", 
    subtitle: "Configuring Connections",
    tag: "Database", tagColor: "#34d399", accent: "#10b981",
    bg: "radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    content: [
      "Environment Variables: Sensitive data stays out of your code.",
      "DB_CONNECTION: Usually 'mysql'.",
      "DB_DATABASE: The name of the database you create.",
      "DB_USERNAME/DB_PASSWORD: Your local database credentials.",
    ],
    lab: "Edit your .env file to set DB_DATABASE=laravel_mastery.",
    result: "Laravel is now configured to look for that specific database.",
    syntax: `DB_CONNECTION=mysql\nDB_DATABASE=my_app`,
    code: `# .env file\nDB_CONNECTION=mysql\nDB_HOST=127.0.0.1\nDB_PORT=3306\nDB_DATABASE=laravel_mastery\nDB_USERNAME=root\nDB_PASSWORD=root`,
    terminal: "nano .env",
    icon: Shield,
  },
  {
    id: "W5-D1-S3", 
    title: "Creating the DB", 
    subtitle: "MySQL Terminal Commands",
    tag: "Database", tagColor: "#34d399", accent: "#10b981",
    bg: "radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    content: [
      "Requirement: Laravel doesn't create the DB itself; you must.",
      "SQL Command: CREATE DATABASE name_here;",
      "Testing: Ensure the server is running (MySQL).",
      "Verification: Use SHOW DATABASES; to list existing ones.",
    ],
    lab: "Use terminal or TablePlus to create 'laravel_mastery'.",
    result: "The database exists and is ready for migrations.",
    syntax: `CREATE DATABASE my_db;`,
    code: `# Inside mysql shell\nCREATE DATABASE laravel_mastery;\n\n# Exit\nexit;`,
    terminal: "mysql -u root -p -e 'CREATE DATABASE laravel_mastery;'",
    icon: Database,
  },
  {
    id: "W5-D2", 
    title: "Eloquent Models", 
    subtitle: "PHP Objects ↔ Data",
    tag: "Database", tagColor: "#818cf8", accent: "#6366f1",
    bg: "radial-gradient(ellipse at 70% 30%, rgba(99,102,241,0.12) 0%, transparent 60%)",
    content: [
      "Model: A PHP class that represents one database table.",
      "Conventions: 'Product' model maps to 'products' table.",
      "Fillable: Guarding columns from mass-assignment attacks.",
      "Casting: Automatically convert data (e.g., price to float).",
    ],
    lab: "Create a 'Product' model using php artisan make:model Product.",
    result: "app/Models/Product.php file is created and configured.",
    syntax: `protected $fillable = ['name', 'price'];\nprotected $casts = ['price' => 'decimal:2'];`,
    code: `<?php\n\nnamespace App\\Models;\n\nuse Illuminate\\Database\\Eloquent\\Model;\n\nclass Product extends Model\n{\n    protected $fillable = [\n        'name', \n        'price', \n        'stock'\n    ];\n\n    protected $casts = [\n        'price' => 'decimal:2'\n    ];\n}`,
    icon: Package,
  },
  {
    id: "W5-D3", 
    title: "Migrations", 
    subtitle: "Version Control for DB",
    tag: "Database", tagColor: "#22d3ee", accent: "#06b6d4",
    bg: "radial-gradient(ellipse at 30% 70%, rgba(6,182,212,0.12) 0%, transparent 60%)",
    content: [
      "Migration: A file that modifies the database schema.",
      "up() method: Runs to create/alter tables.",
      "down() method: Runs to rollback/undo the changes.",
      "php artisan migrate: Executing the changes safely.",
    ],
    lab: "Create a migration for products table with name and price.",
    result: "Table 'products' appears in your database after running migrate.",
    syntax: `php artisan make:migration create_products_table\nphp artisan migrate`,
    code: `<?php\n\npublic function up(): void {\n    Schema::create('products', function (Blueprint $table) {\n        $table->id();\n        $table->string('name');\n        $table->decimal('price', 8, 2);\n        $table->timestamps();\n    });\n}`,
    icon: HardDrive,
  },
  {
    id: "W5-D4", 
    title: "Data Seeding", 
    subtitle: "Filling the database",
    tag: "Database", tagColor: "#fbbf24", accent: "#f59e0b",
    bg: "radial-gradient(ellipse at 60% 40%, rgba(245,158,11,0.12) 0%, transparent 60%)",
    content: [
      "Seeders: Populate your database with test/dummy data.",
      "Faker: A library to generate realistic names, texts, and dates.",
      "Factories: Blueprints for generating multiple model instances.",
      "artisan db:seed: Command to run your seeder classes.",
    ],
    lab: "Seed 10 products into your database using a Seeder.",
    result: "Database row count for products grows to 10.",
    syntax: `php artisan make:seeder ProductSeeder\nphp artisan db:seed`,
    code: `<?php\n\n// DatabaseSeeder.php\npublic function run(): void {\n    \\App\\Models\\Product::create([\n        'name' => 'Laptop',\n        'price' => 999.00\n    ]);\n}`,
    icon: List,
  },
  {
    id: "W5-D5", 
    title: "DB Practice", 
    subtitle: "Reviewing Schema",
    tag: "Database", tagColor: "#fb923c", accent: "#f97316",
    bg: "radial-gradient(ellipse at 25% 55%, rgba(249,115,22,0.12) 0%, transparent 60%)",
    content: [
      "Rollbacks: Undoing migrations with migrate:rollback.",
      "Fresh: Wiping and re-running all migrations from scratch.",
      "Visual Tools: User TablePlus or PHPMyAdmin to check schema.",
      "Table Relationships Preview: Connecting products to users.",
    ],
    lab: "Add a 'category' string column to products and rollback.",
    result: "Successfully modified, migrated, and then reversed the schema.",
    syntax: `php artisan migrate:rollback\nphp artisan migrate:fresh --seed`,
    code: `# TERMINAL COMMANDS\n\n# Undo last batch\nphp artisan migrate:rollback\n\n# Reset everything & Seed\nphp artisan migrate:fresh --seed`,
    icon: Activity,
  },
  {
    id: "W6-D1", 
    title: "Basic Fetching", 
    subtitle: "Retrieving records",
    tag: "Eloquent ORM", tagColor: "#f43f5e", accent: "#e11d48",
    bg: "radial-gradient(ellipse at 70% 60%, rgba(225,29,72,0.12) 0%, transparent 60%)",
    content: [
      "all(): Returns every record in the table.",
      "find($id): Retrieves one record by primary key.",
      "findOrFail($id): Throws a 404 error if not found.",
      "Collections: Eloquent returns a Collection object.",
    ],
    lab: "Fetch all products in your Controller and return them.",
    result: "A list of products is displayed in the browser.",
    syntax: `$products = Product::all();\n$product = Product::find(1);`,
    filename: "app/Http/Controllers/ProductController.php",
    code: `<?php\n\nnamespace App\\Http\\Controllers;\n\nuse App\\Models\\Product;\n\nclass ProductController extends Controller\n{\n    public function index() \n    {\n        // Fetch all products\n        $products = Product::all();\n        \n        return view('products.index', compact('products'));\n    }\n}`,
    icon: Search,
  },
  {
    id: "W6-D2", 
    title: "Creating Data", 
    subtitle: "Inserting new records",
    tag: "Eloquent ORM", tagColor: "#34d399", accent: "#10b981",
    bg: "radial-gradient(ellipse at 40% 25%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    content: [
      "create(): Quickest way to insert a record.",
      "save(): Standard way to set properties and save.",
      "Return: create() returns the new model object.",
      "Validation: Always validate before creating (later).",
    ],
    lab: "Write a route /test-create that creates a hardcoded product.",
    result: "A new row appears in the products table.",
    syntax: `Product::create(['name' => 'Mac']);\n\n$p = new Product(); $p->save();`,
    code: `<?php\n\n// Create\n$p = Product::create([\n    'name' => 'New Headphones',\n    'price' => 59.99\n]);`,
    icon: Send,
  },
  {
    id: "W6-D3", 
    title: "Update & Delete", 
    subtitle: "Modifying stored data",
    tag: "Eloquent ORM", tagColor: "#818cf8", accent: "#6366f1",
    bg: "radial-gradient(ellipse at 55% 65%, rgba(99,102,241,0.12) 0%, transparent 60%)",
    content: [
      "update(): Modifies the model with new data.",
      "delete(): Permanently removes the record.",
      "First fetch, then modify: $model = Product::find(1); $model->delete();.",
      "Soft Deletes: A way to 'hide' records without deletion.",
    ],
    lab: "Update the price of product ID 1 to 10.00.",
    result: "Successfully changed the value in database.",
    syntax: `$product->update([...]);\n$product->delete();`,
    filename: "app/Http/Controllers/ProductController.php",
    code: `<?php\n\n// Method to modify a product\npublic function update(Request $request, $id)\n{\n    $product = Product::findOrFail($id);\n    \n    $product->update([\n        'price' => 19.99\n    ]);\n\n    return back()->with('success', 'Updated!');\n}\n\n// Method to remove a product\npublic function destroy($id)\n{\n    Product::destroy($id);\n    return redirect()->route('products.index');\n}`,
    icon: RefreshCw,
  },
  {
    id: "W6-D4", 
    title: "Where & Querying", 
    subtitle: "Filtering your data",
    tag: "Eloquent ORM", tagColor: "#38bdf8", accent: "#0ea5e9",
    bg: "radial-gradient(ellipse at 20% 40%, rgba(14,165,233,0.12) 0%, transparent 60%)",
    content: [
      "where(): Filter rows by column value.",
      "Chainable: Add multiple where clauses.",
      "get(): Executes query and returns results.",
      "first(): Returns only the first result.",
    ],
    lab: "Fetch all products where stock is 0.",
    result: "List of out-of-stock products returned.",
    syntax: `Product::where('status', 'active')->get();`,
    code: `<?php\n\n$cheap = Product::where('price', '<', 50)->get();`,
    icon: Search,
  },
  {
    id: "W6-D5", 
    title: "Sort & Paginate", 
    subtitle: "Clean data delivery",
    tag: "Eloquent ORM", tagColor: "#fbbf24", accent: "#f59e0b",
    bg: "radial-gradient(ellipse at 65% 35%, rgba(245,158,11,0.12) 0%, transparent 60%)",
    content: [
      "orderBy(): Sort results by column.",
      "latest(): Shorthand for newest items.",
      "paginate(n): Splits results into pages.",
      "Links: Blade provides pagination UI automatically.",
    ],
    lab: "Sort products by 'price' High to Low and paginate by 5.",
    result: "Browser shows a limited list of expensive items.",
    syntax: `Product::latest()->paginate(10);`,
    code: `<?php\n\n$page = Product::paginate(10); \n// In Blade: {{ $page->links() }}`,
    icon: List,
  },
  /* WEEK 7: CRUD (VERY IMPORTANT) */
  {
    id: "W7-D1", 
    title: "Create Form", 
    subtitle: "Accepting Input",
    tag: "CRUD Ops", tagColor: "#fbbf24", accent: "#f59e0b",
    bg: "radial-gradient(ellipse at 50% 50%, rgba(245,158,11,0.12) 0%, transparent 60%)",
    content: [
      "Forms in Blade: Need a POST method and @csrf token.",
      "@csrf: Security token to prevent CSRF attacks.",
      "Input Names: Must match your database columns.",
    ],
    lab: "Build a form to create a new Product.",
    result: "Submitting the form saves data to the database.",
    syntax: `<form method="POST">\n    @csrf\n    <input name="name">\n</form>`,
    code: `<!-- create.blade.php -->\n<form action="/products" method="POST">\n    @csrf\n    <input name="name" placeholder="Name">\n    <button>Save</button>\n</form>`,
    icon: Send,
  },
  {
    id: "W7-D2", 
    title: "Read & List", 
    subtitle: "Displaying data",
    tag: "CRUD Ops", tagColor: "#34d399", accent: "#10b981",
    bg: "radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    content: [
      "Master-Detail Pattern: List page + Single detail page.",
      "Links: Use {{ route('...') }} or URLs to navigate.",
      "Tables: Display data cleanly with @foreach.",
    ],
    lab: "Create a table showing all products with Edit links.",
    result: "All records are visible in a table.",
    syntax: `@foreach($products as $p) ... @endforeach`,
    code: `<!-- index.blade.php -->\n<table>\n  @foreach($products as $p)\n    <tr>\n      <td>{{ $p->name }}</td>\n      <td><a href="/products/{{ $p->id }}">View</a></td>\n    </tr>\n  @endforeach\n</table>`,
    icon: List,
  },
  {
    id: "W7-D3", 
    title: "Update Logic", 
    subtitle: "Editing records",
    tag: "CRUD Ops", tagColor: "#818cf8", accent: "#6366f1",
    bg: "radial-gradient(ellipse at 70% 30%, rgba(99,102,241,0.12) 0%, transparent 60%)",
    content: [
      "Edit Page: Pre-fills the form with current values.",
      "@method('PUT'): Spoofs the PUT verb for the browser.",
      "Update Method: Fetches by ID, validates, and saves.",
    ],
    lab: "Create an edit page that updates name and price.",
    result: "Record is updated after submission.",
    syntax: `@method('PUT')`,
    code: `<!-- edit.blade.php -->\n<form action="/products/{{ $product->id }}" method="POST">\n    @csrf\n    @method('PUT')\n    <input name="name" value="{{ $product->name }}">\n    <button>Update</button>\n</form>`,
    icon: RefreshCw,
  },
  {
    id: "W7-D4", 
    title: "Delete Action", 
    subtitle: "Removing data",
    tag: "CRUD Ops", tagColor: "#fb7185", accent: "#f43f5e",
    bg: "radial-gradient(ellipse at 50% 70%, rgba(244,63,94,0.12) 0%, transparent 60%)",
    content: [
      "DELETE Route: Requires a form for security.",
      "@method('DELETE'): Spoofs the DELETE verb.",
      "Redirect: Return with a success message.",
    ],
    lab: "Add a delete button next to each product.",
    result: "Clicking delete removes the item.",
    syntax: `@method('DELETE')`,
    code: `<!-- delete form -->\n<form action="/products/{{ $p->id }}" method="POST">\n    @csrf\n    @method('DELETE')\n    <button onclick="return confirm('Clear?')">Delete</button>\n</form>`,
    icon: ShieldAlert,
  },
  {
    id: "W7-D5", 
    title: "Full CRUD Review", 
    subtitle: "Month 2 Milestone",
    tag: "CRUD Ops", tagColor: "#a855f7", accent: "#9333ea",
    bg: "radial-gradient(ellipse at 10% 90%, rgba(147,51,234,0.15) 0%, transparent 60%)",
    content: [
      "Flash Messages: Show success alerts after actions.",
      "Validation: Prevent empty inputs.",
      "The result: A real management system.",
    ],
    lab: "Refine your Product CRUD with alerts.",
    result: "Professional dashboard for managing data.",
    syntax: `session('success')`,
    code: `@if(session('success'))\n    <div class="alert text-green-400">\n        {{ session('success') }}\n    </div>\n@endif`,
    icon: Sparkles,
  },

  /* WEEK 8: API Development */
  {
    id: "W8-D1", 
    title: "API Intro", 
    subtitle: "Building for apps",
    tag: "REST API", tagColor: "#34d399", accent: "#10b981",
    bg: "radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    content: [
      "routes/api.php: Home for API endpoints.",
      "Stateless: No cookies or sessions.",
      "JSON: The standard communication language.",
    ],
    lab: "Create an API route returning your name.",
    result: "Browser shows JSON data.",
    syntax: `Route::get('/ping', fn() => ['ok' => true]);`,
    code: `// routes/api.php\nRoute::get('/health', function() {\n    return [\n        'status' => 'active',\n        'time' => now()\n    ];\n});`,
    icon: Workflow,
  },
  {
    id: "W8-D2", 
    title: "JSON Responses", 
    subtitle: "Status Codes",
    tag: "REST API", tagColor: "#818cf8", accent: "#6366f1",
    bg: "radial-gradient(ellipse at 70% 30%, rgba(99,102,241,0.12) 0%, transparent 60%)",
    content: [
      "Response helper: response()->json().",
      "Codes: 200 (OK), 201 (Created), 404 (Not Found).",
      "Automatic: Larvel auto-converts arrays to JSON.",
    ],
    lab: "Return a 404 error if an ID is not found.",
    result: "Browser shows JSON error message.",
    syntax: `return response()->json(['msg' => 'Err'], 404);`,
    code: `<?php\n\nif (!$item) {\n    return response()->json([\n        'error' => 'Not Found'\n    ], 404);\n}`,
    icon: Send,
  },
  {
    id: "W8-D3", 
    title: "API Controllers", 
    subtitle: "Stateless logic",
    tag: "REST API", tagColor: "#22d3ee", accent: "#06b6d4",
    bg: "radial-gradient(ellipse at 30% 70%, rgba(6,182,212,0.12) 0%, transparent 60%)",
    content: [
      "API Controller: No create/edit view methods.",
      "Resource Routing: Handles all 5 core routes at once.",
      "Input: Reading POST data from $request->all().",
    ],
    lab: "Generate an API controller for Products.",
    result: "Route list shows /api/products endpoints.",
    syntax: `php artisan make:controller Api/ProductController --api`,
    code: `// routes/api.php\nRoute::apiResource('products', ProductController::class);`,
    icon: Server,
  },
  {
    id: "W8-D4", 
    title: "API Resources", 
    subtitle: "Transforming JSON",
    tag: "REST API", tagColor: "#fbbf24", accent: "#f59e0b",
    bg: "radial-gradient(ellipse at 60% 40%, rgba(245,158,11,0.12) 0%, transparent 60%)",
    content: [
      "Resource Class: Middle layer for structuring JSON.",
      "Why? Hide passwords or rename database columns.",
      "Consistency: Keep the API format even if DB changes.",
    ],
    lab: "Format the product price with a '$' in the JSON.",
    result: "API output shows the formatted price.",
    syntax: `php artisan make:resource ProductResource`,
    code: `<?php\n\npublic function toArray($request) {\n    return [\n        'id' => $this->id,\n        'display_name' => $this->name,\n        'price' => '$' . $this->price\n    ];\n}`,
    icon: Layout,
  },
  {
    id: "W8-D5", 
    title: "Final API Lab", 
    subtitle: "Month 2 Graduation",
    tag: "REST API", tagColor: "#fb923c", accent: "#f97316",
    bg: "radial-gradient(ellipse at 25% 55%, rgba(249,115,22,0.12) 0%, transparent 60%)",
    content: [
      "Goal: A product API with full CRUD control.",
      "Testing: Use Postman or another API client.",
      "Auth Preview: Mentioning protection (Token/Sanctum).",
    ],
    lab: "Perform full CRUD on products using Postman.",
    result: "Endpoints verified; Month 2 complete!",
    syntax: `GET /api/products\nPOST /api/products`,
    code: `/* --- DONE MONTH 2 --- */\n\n// We can now:\n// 1. Manage DB (Migrations)\n// 2. Control Logic (Controllers)\n// 3. Build UI (Blade)\n// 4. Build Service (API)`,
    icon: Sparkles,
  },

  /* ─── MONTH 3: AUTH + ADVANCED ─── */
  /* WEEK 9: Authentication & Security */
  {
    id: "W9-D1-S1", 
    title: "Auth Basics", 
    subtitle: "Security Foundations",
    tag: "Security", tagColor: "#34d399", accent: "#10b981",
    bg: "radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    content: [
      "Authentication: Verifying who a user is (Login).",
      "Authorization: Controlling what an authenticated user can do.",
      "Sessions: Laravel's way to 'remember' a logged-in user.",
      "Security: CSRF and XSS protection come standard.",
    ],
    lab: "Identify the middleware for authentication in routes.",
    result: "Found the 'auth' middleware usage.",
    syntax: `Route::middleware('auth')->...`,
    code: `// routes/web.php\nRoute::get('/dashboard', function() {\n    // Only logged in users see this\n})->middleware('auth');`,
    icon: ShieldCheck,
  },
  {
    id: "W9-D1-S2", 
    title: "Laravel Breeze", 
    subtitle: "Minimal Starter Kit",
    tag: "Security", tagColor: "#34d399", accent: "#10b981",
    bg: "radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    content: [
      "Breeze: A lightweight, simple implementation for Auth.",
      "Setup: Requires a Composer install and an Artisan command.",
      "Frontend: Generates Blade views for Login, Register, Profile.",
      "Modern: Uses Tailwind CSS for the auth UI.",
    ],
    lab: "Install breeze: php artisan breeze:install blade.",
    result: "Auth routes and views are generated automatically.",
    syntax: `php artisan breeze:install`,
    code: `# STEP 1: Compose Require\ncomposer require laravel/breeze --dev\n\n# STEP 2: Install Blade\nphp artisan breeze:install blade\n\n# STEP 3: Migrate\nphp artisan migrate`,
    terminal: "php artisan breeze:install blade",
    icon: ShieldCheck,
  },
  {
    id: "W9-D2", 
    title: "Middleware", 
    subtitle: "The Gatekeeper",
    tag: "Security", tagColor: "#818cf8", accent: "#6366f1",
    bg: "radial-gradient(ellipse at 70% 30%, rgba(99,102,241,0.12) 0%, transparent 60%)",
    content: [
      "Middleware: Logic before hitting controllers.",
      "'auth': Redirects guests to login.",
      "'guest': Prevents logged-in users from seeing login.",
    ],
    lab: "Protect /dashboard with the 'auth' middleware.",
    result: "Guests redirected to login.",
    syntax: `->middleware('auth')`,
    code: `Route::get('/dash', [DashController::class, 'index'])->middleware(['auth']);`,
    icon: Lock,
  },
  {
    id: "W9-D3", 
    title: "Password Hashing", 
    subtitle: "Security Standards",
    tag: "Security", tagColor: "#22d3ee", accent: "#06b6d4",
    bg: "radial-gradient(ellipse at 30% 70%, rgba(6,182,212,0.12) 0%, transparent 60%)",
    content: [
      "BCRYPT: Laravel's default hashing.",
      "Hash::make(): Manually hash a string.",
      "Never Store Plaintext: Security rule #1.",
    ],
    lab: "Hash a password in a test route.",
    result: "Password verified using Hash::check().",
    syntax: `Hash::make('secret')`,
    code: `<?php\n\n$hashed = Hash::make('my-password');\nif (Hash::check('my-password', $hashed)) {\n    return 'Verified';\n}`,
    icon: Key,
  },
  {
    id: "W9-D4", 
    title: "API Tokens", 
    subtitle: "Sanctum Tokens",
    tag: "Security", tagColor: "#fbbf24", accent: "#f59e0b",
    bg: "radial-gradient(ellipse at 60% 40%, rgba(245,158,11,0.12) 0%, transparent 60%)",
    content: [
      "createToken(): Issue tokens for apps.",
      "Bearer Token: Sent in Header for requests.",
      "Revoking: Logout users everywhere.",
    ],
    lab: "Issue a token for user ID 1.",
    result: "Token string returned to client.",
    syntax: `$user->createToken('cli')->plainTextToken`,
    code: `<?php\n// Authenticating a user and issuing a token\n\nuse App\\Models\\User;\nuse Illuminate\\Http\\Request;\n\n$user = User::where('email', 'ratha@example.com')->first();\n\n$token = $user->createToken('react-app')->plainTextToken;\n\nreturn response()->json([\n    'message' => 'Login Successful',\n    'token' => $token\n]);`,
    icon: Zap,
  },
  {
    id: "W9-D5", 
    title: "Hidden Fields", 
    subtitle: "JSON Privacy",
    tag: "Security", tagColor: "#fb923c", accent: "#f97316",
    bg: "radial-gradient(ellipse at 25% 55%, rgba(249,115,22,0.12) 0%, transparent 60%)",
    content: [
      "$hidden property: Hide sensitive DB columns.",
      "Mass Assignment: Use $fillable for safety.",
      "CSRF: Protected by default in web routes.",
    ],
    lab: "Hide 'password' in User model.",
    result: "API no longer sends passwords.",
    syntax: `protected $hidden = ['...'];`,
    code: `<?php\n\nnamespace App\\Models;\n\nuse Illuminate\\Foundation\\Auth\\User as Authenticatable;\n\nclass User extends Authenticatable\n{\n    // Hide these fields from JSON outputs\n    protected $hidden = [\n        'password', \n        'remember_token', \n        'two_factor_secret'\n    ];\n}`,
    icon: Fingerprint,
  },

  /* WEEK 10: Advanced Eloquent (Relationships) */
  {
    id: "W10-D1", 
    title: "One-to-Many", 
    subtitle: "HasMany / BelongsTo",
    tag: "Eloquent Plus", tagColor: "#818cf8", accent: "#6366f1",
    bg: "radial-gradient(ellipse at 70% 30%, rgba(99,102,241,0.12) 0%, transparent 60%)",
    content: [
      "hasMany: Defined on Parent (Category -> Products).",
      "belongsTo: Defined on Child (Product -> Category).",
      "Foreign Key: Connecting the dots.",
    ],
    lab: "Link a Category to multiple Products.",
    result: "$category->products returns related items.",
    syntax: `return $this->hasMany(Product::class);`,
    code: `<?php\n\nnamespace App\\Models;\n\nuse Illuminate\\Database\\Eloquent\\Model;\n\nclass Category extends Model\n{\n    // A Category has many Products\n    public function products()\n    {\n        return $this->hasMany(Product::class);\n    }\n}`,
    icon: LinkIcon,
  },
  {
    id: "W10-D2", 
    title: "Many-to-Many", 
    subtitle: "Pivot Tables",
    tag: "Eloquent Plus", tagColor: "#f43f5e", accent: "#e11d48",
    bg: "radial-gradient(ellipse at 40% 25%, rgba(225,29,72,0.12) 0%, transparent 60%)",
    content: [
      "belongsToMany: Uses a junction table.",
      "attach/detach: Link items easily.",
      "Scenario: Post has many Tags.",
    ],
    lab: "Create a pivot table product_tag.",
    result: "Products can now have multiple tags.",
    syntax: `belongsToMany(...)`,
    code: `<?php\n\n$product->tags()->attach($tagId);`,
    icon: GitBranch,
  },
  {
    id: "W10-D3", 
    title: "Eager Loading", 
    subtitle: "Fixing N+1",
    tag: "Eloquent Plus", tagColor: "#34d399", accent: "#10b981",
    bg: "radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    content: [
      "N+1 Problem: Looping relations creates too many queries.",
      "with(): Loads relations in one go.",
      "Speed: Huge performance boost.",
    ],
    lab: "Use with('category') in your product list.",
    result: "Query count drops from 100+ to 2.",
    syntax: `Product::with('cat')->get();`,
    code: `<?php\n\n$list = Product::with('category')->get();`,
    icon: Zap,
  },
  {
    id: "W10-D4", 
    title: "Accessors", 
    subtitle: "Dynamic Attributes",
    tag: "Eloquent Plus", tagColor: "#fbbf24", accent: "#f59e0b",
    bg: "radial-gradient(ellipse at 60% 40%, rgba(245,158,11,0.12) 0%, transparent 60%)",
    content: [
      "Accessors: Format data when read.",
      "Example: full_name from first/last.",
      "Virtual Fields: Non-DB fields.",
    ],
    lab: "Create a formatted_price accessor.",
    result: "$product->formatted_price returns '$19.00'.",
    syntax: `protected function price(): Attribute`,
    code: `<?php\n\nprotected function price(): Attribute {\n    return Attribute::make(\n        get: fn ($v) => '$' . number_format($v, 2)\n    );\n}`,
    icon: Edit3,
  },
  {
    id: "W10-D5", 
    title: "Eloquent Mastery", 
    subtitle: "Advanced Querying",
    tag: "Eloquent Plus", tagColor: "#fb923c", accent: "#f97316",
    bg: "radial-gradient(ellipse at 25% 55%, rgba(249,115,22,0.12) 0%, transparent 60%)",
    content: [
      "whereHas: Filter items by relation state.",
      "withCount: Add related counts to results.",
      "Scopes: Reusable query filters.",
    ],
    lab: "Fetch Active Users with their post count.",
    result: "$user->posts_count is accessible.",
    syntax: `User::withCount('posts')->get();`,
    code: `<?php\n\n$cats = Category::withCount('products')->get();`,
    icon: Star,
  },

  /* WEEK 11: Backend Project (Ecommerce API) */
  {
    id: "W11-D1", 
    title: "Project Setup", 
    subtitle: "Ecommerce Foundation",
    tag: "Final Project", tagColor: "#a855f7", accent: "#9333ea",
    bg: "radial-gradient(ellipse at 10% 90%, rgba(147,51,234,0.15) 0%, transparent 60%)",
    content: [
      "Requirement: Categories, Products, Users, Orders.",
      "Architecture: Clean API controllers.",
      "Goal: A functional shopping backend.",
    ],
    lab: "Sketch the final DB schema.",
    result: "Full understanding of the system flow.",
    syntax: `Relations + Validations`,
    code: `// TABLES:\n// - users\n// - products\n// - categories\n// - orders\n// - order_items`,
    icon: Layers,
  },
  {
    id: "W11-D2", 
    title: "Category & Products", 
    subtitle: "Schema relations",
    tag: "Final Project", tagColor: "#a855f7", accent: "#9333ea",
    bg: "radial-gradient(ellipse at 10% 90%, rgba(147,51,234,0.15) 0%, transparent 60%)",
    filename: "database/migrations/create_products_table.php",
    content: [
      "FK: Adding category_id to products table.",
      "Index: Optimizing search for faster queries.",
      "Cascade: Deleting category deletes products?",
    ],
    lab: "Write the migration with a foreignId('category_id').",
    result: "Migration created successfully with relation.",
    syntax: `$table->foreignId('category_id')->constrained();`,
    code: `<?php\n\nSchema::create('products', function (Blueprint $table) {\n    $table->id();\n    $table->foreignId('category_id')->constrained();\n    $table->string('name');\n    $table->decimal('price', 8, 2);\n    $table->timestamps();\n});`,
    icon: Database,
  },
  {
    id: "W11-D3", 
    title: "Order Logic", 
    subtitle: "Calculating totals",
    tag: "Final Project", tagColor: "#a855f7", accent: "#9333ea",
    bg: "radial-gradient(ellipse at 10% 90%, rgba(147,51,234,0.15) 0%, transparent 60%)",
    filename: "app/Services/OrderService.php",
    content: [
      "Goal: Calculate total price including tax.",
      "Iteration: Sum up all products in the cart.",
      "Database: Storing the final order amount.",
    ],
    lab: "Write a function to sum prices in an array.",
    result: "Correct sum returned based on input.",
    syntax: `collect($items)->sum('price')`,
    code: `<?php\n\nfunction calculateTotal($items) {\n    return collect($items)->sum(function($item) {\n        return $item->price * $item->quantity;\n    });\n}`,
    icon: ShoppingCart,
  },
  {
    id: "W11-D5", 
    title: "Project Milestone", 
    subtitle: "Logic Complete",
    tag: "Final Project", tagColor: "#f43f5e", accent: "#e11d48",
    bg: "radial-gradient(ellipse at 50% 50%, rgba(225,29,72,0.12) 0%, transparent 60%)",
    filename: "routes/api.php",
    content: [
      "Endpoints: Verify all routes for CRUD.",
      "Testing: Ensure the API returns valid JSON.",
      "Auth: Protect the user profile route.",
    ],
    lab: "Test the 'POST /orders' route.",
    result: "Order is created in DB and 201 Created returned.",
    syntax: `Route::post('/orders', [OrderController::class, 'store']);`,
    code: `<?php\n\nuse Illuminate\\Support\\Facades\\Route;\n\nRoute::middleware('auth:sanctum')->group(function () {\n    Route::apiResource('orders', 'OrderController');\n});`,
    icon: Trophy,
  },

  /* WEEK 12: Deployment & Git */
  /* WEEK 12: Deployment & Git */
  {
    id: "W12-D1", 
    title: "Git Collaboration", 
    subtitle: "Branching Strategy",
    tag: "DevOps", tagColor: "#60a5fa", accent: "#3b82f6",
    bg: "radial-gradient(ellipse at 70% 40%, rgba(59,130,246,0.12) 0%, transparent 60%)",
    filename: "Terminal",
    content: [
      "Branches: feat/orders, fix/naming.",
      "Merging: Bringing code back to 'main'.",
      "Conflicts: Resolving code overlaps.",
    ],
    lab: "Create and switch to a feature branch.",
    result: "Clean commit on a separate branch.",
    syntax: `git checkout -b <name>`,
    code: `git checkout -b feat/checkout-api\ngit add .\ngit commit -m "feat: implement checkout endpoint"\ngit push origin feat/checkout-api`,
    terminal: "git status",
    icon: GitBranch,
  },
  {
    id: "W12-D2", 
    title: "Env Management", 
    subtitle: ".env.production",
    tag: "DevOps", tagColor: "#60a5fa", accent: "#3b82f6",
    bg: "radial-gradient(ellipse at 70% 40%, rgba(59,130,246,0.12) 0%, transparent 60%)",
    filename: ".env.example",
    content: [
      "Production Keys: Using different DBs for prod.",
      "App Debug: Never set to 'true' in production.",
      "App Key: Essential for encryption.",
    ],
    lab: "Create a .env.example file.",
    result: "Safely documented environment requirements.",
    syntax: `APP_DEBUG=false\nAPP_ENV=production`,
    code: `APP_NAME=Laravel\nAPP_ENV=production\nAPP_KEY=base64:xxx...\nAPP_DEBUG=false\nAPP_URL=https://my-app.com\n\nDB_CONNECTION=mysql\nDB_HOST=127.0.0.1`,
    icon: Lock,
  },
  {
    id: "W12-D3", 
    title: "Optimization", 
    subtitle: "Artisan Caching",
    tag: "DevOps", tagColor: "#60a5fa", accent: "#3b82f6",
    bg: "radial-gradient(ellipse at 70% 40%, rgba(59,130,246,0.12) 0%, transparent 60%)",
    filename: "Terminal",
    content: [
      "Config Cache: Speeds up settings loading.",
      "Route Cache: Huge performance win for URLs.",
      "View Cache: Compiles all Blade templates.",
    ],
    lab: "Run all optimize commands.",
    result: "Application response time improved.",
    syntax: `php artisan optimize`,
    code: `# Prepare for production\nphp artisan config:cache\nphp artisan route:cache\nphp artisan view:cache`,
    terminal: "php artisan optimize",
    icon: Zap,
  },
  {
    id: "W12-D4", 
    title: "Error Monitoring", 
    subtitle: "Log Files",
    tag: "DevOps", tagColor: "#60a5fa", accent: "#3b82f6",
    bg: "radial-gradient(ellipse at 70% 40%, rgba(59,130,246,0.12) 0%, transparent 60%)",
    filename: "storage/logs/laravel.log",
    content: [
      "Log Level: debug, info, warning, error.",
      "Daily Logs: Rotating files to save space.",
      "Reading: How to debug production issues.",
    ],
    lab: "Check the laravel.log file.",
    result: "Found recent application errors.",
    syntax: `Log::error('Something broke');`,
    code: `[2026-03-19 16:26:21] production.ERROR: Database connection timed out {"user_id":1}\n[2026-03-19 16:27:00] production.INFO: Order #456 created.`,
    icon: Activity,
  },
  {
    id: "W12-D5", 
    title: "Deployment", 
    subtitle: "Going Live",
    tag: "DevOps", tagColor: "#10b981", accent: "#059669",
    bg: "radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    filename: "Terminal",
    content: [
      "Platforms: Railway, Forge, or VPS.",
      "Migrations: php artisan migrate --force.",
      "Production: Final SSL checks.",
    ],
    lab: "Deploy your final Ecommerce API.",
    result: "Your backend URL works globally! Month 3 Complete!",
    syntax: `php artisan migrate --force`,
    code: `php artisan optimize\nphp artisan migrate --force\nphp artisan config:cache`,
    terminal: "php artisan migrate --force",
    terminalOutput: "INFO  Preparing database.\n\n  2024_03_21_000000_create_users_table ........... 10ms DONE\n  2024_03_21_000001_create_products_table ........ 12ms DONE\n\nDatabase migration successful.",
    icon: Globe,
  },
];

/* ─── PHP SYNTAX HIGHLIGHTER ─────────────────────────────────────── */
const PHP_KEYWORDS = new Set([
  'php','echo','print','return','if','else','elseif','foreach','for',
  'while','do','switch','case','break','continue','class','extends',
  'implements','interface','trait','namespace','use','new','public',
  'protected','private','static','abstract','final','function','fn',
  'array','string','int','float','bool','void','null','true','false',
  'require','include','require_once','include_once','throw','try',
  'catch','finally','match','readonly','const','enum',
]);

const HighlightedCode = ({ code }: { code: string }) => {
  const tokenizeLine = (line: string): React.ReactNode => {
    if (line.trimStart().startsWith('//') || line.trimStart().startsWith('#'))
      return <span style={{ color: '#6b7280', fontStyle: 'italic' }}>{line}</span>;
    if (line.trimStart().startsWith('/*') || line.trimStart().startsWith('*'))
      return <span style={{ color: '#6b7280', fontStyle: 'italic' }}>{line}</span>;

    const parts = line.split(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\$[a-zA-Z_]\w*|\b\d+(?:\.\d+)?\b|\b[a-zA-Z_]\w*\b)/g);
    return parts.map((part, i) => {
      if (!part) return null;
      if (part.startsWith('$')) return <span key={i} style={{ color: '#fbbf24' }}>{part}</span>;
      if (PHP_KEYWORDS.has(part)) return <span key={i} style={{ color: '#f87171', fontWeight: 700 }}>{part}</span>;
      if (part.startsWith('"')) {
        const internalParts = part.split(/(\$[a-zA-Z_]\w*)/g);
        return (
          <span key={i} style={{ color: '#86efac' }}>
            {internalParts.map((ip, j) => 
              ip.startsWith('$') 
                ? <span key={j} style={{ color: '#fbbf24', fontWeight: 600 }}>{ip}</span>
                : ip
            )}
          </span>
        );
      }
      if (part.startsWith("'")) return <span key={i} style={{ color: '#86efac' }}>{part}</span>;
      if (/^\d/.test(part)) return <span key={i} style={{ color: '#c084fc' }}>{part}</span>;
      if (/^[A-Z]/.test(part)) return <span key={i} style={{ color: '#fbbf24' }}>{part}</span>;
      return <span key={i} style={{ color: '#e2e8f0' }}>{part}</span>;
    });
  };

  return (
    <div className="font-mono text-sm leading-6 whitespace-pre"
      style={{ fontFamily: "'JetBrains Mono','Fira Code','Cascadia Code',monospace" }}>
      {code.split('\n').map((line, i) => (
        <div key={i} className="min-h-[1.5rem]">{tokenizeLine(line)}</div>
      ))}
    </div>
  );
};

/* ─── SYNTAX PANEL ───────────────────────────────────────────────── */
const SyntaxPanel = ({ syntax, accent }: { syntax: string; accent: string }) => {
  if (!syntax) return null;
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: `${accent}30`, background: `${accent}08` }}>
      <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: `${accent}20` }}>
        <Code2 className="w-3 h-3" style={{ color: accent }} />
        <span className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: accent }}>Syntax Reference</span>
      </div>
      <div className="p-3 text-xs leading-6 font-mono whitespace-pre text-zinc-300 overflow-x-auto"
        style={{ fontFamily: "'JetBrains Mono','Fira Code',monospace" }}>
        {syntax.split('\n').map((line, i) => (
          <div key={i} className="min-h-[1.5rem]">
            {line.trimStart().startsWith('//') || line.trimStart().startsWith('#')
              ? <span style={{ color: '#6b7280', fontStyle: 'italic' }}>{line}</span>
              : line}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── CODE VIEWER ────────────────────────────────────────────────── */
const CodeViewer = ({ code: initialCode, terminal, terminalOutput: initialOutput, accent, title, showPreview }: { code: string; terminal?: string; terminalOutput?: string; accent: string; title: string; showPreview?: boolean }) => {
  const [activeTab, setActiveTab] = useState<'code' | 'terminal' | 'preview'>('code');
  const [code, setCode] = useState(initialCode);
  const [terminalOutput, setTerminalOutput] = useState(initialOutput);
  const [copied, setCopied] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  // Sync state when slide changes
  useEffect(() => {
    setCode(initialCode);
    setTerminalOutput(initialOutput);
  }, [initialCode, initialOutput]);

  const lines = code.split('\n');

  const copy = () => {
    const textToCopy = activeTab === 'code' ? code : (terminalOutput || '');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const syncScroll = () => {
    if (taRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = taRef.current.scrollTop;
      highlightRef.current.scrollLeft = taRef.current.scrollLeft;
    }
  };

  const simulateExecution = (newCode: string) => {
    // If the code is identical to initial, don't simulate (keep hardcoded output)
    if (newCode.trim() === initialCode.trim()) {
      setTerminalOutput(initialOutput);
      return;
    }

    if (title.includes('.php')) {
      // Improved regex to capture more of the echo statement
      const echoRegex = /(?:echo|print)\s+["'](.*?)["'](?:\s*\.\s*\.[^;]+)?;/g;
      const shortEchoRegex = /<\?=\s+["'](.*?)["']\s*\?>/g;
      
      let outputs: string[] = [];
      let match;
      
      while ((match = echoRegex.exec(newCode)) !== null) {
        outputs.push(match[1]);
      }
      while ((match = shortEchoRegex.exec(newCode)) !== null) {
        outputs.push(match[1]);
      }

      if (outputs.length > 0) {
        setTerminalOutput(outputs.join('\n'));
      }
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setCode(val);
    simulateExecution(val);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#080c14] overflow-hidden">
      {/* Top Controller Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0d1117] border-b border-white/5 flex-none">
        <div className="flex items-center gap-1 p-1 bg-black/40 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'code' 
                ? 'bg-white/10 text-white shadow-lg' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Code Editor
          </button>
          <button
            onClick={() => {
              setActiveTab('terminal');
              simulateExecution(code);
            }}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'terminal' 
                ? 'bg-white/10 text-white shadow-lg' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Terminal
          </button>
          
          {showPreview && (
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'preview' 
                  ? 'bg-white/10 text-white shadow-lg' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              Preview
            </button>
          )}
        </div>

        <button
          className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
          onClick={() => {
            setCode(initialCode);
            setTerminalOutput(initialOutput);
          }}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* File Info Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0d1117]/50 border-b border-white/5 flex-none">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]/40" />
          </div>
          <div className="flex items-center gap-2 bg-white/5 rounded-lg px-2.5 py-1">
            <FileCode className="w-3 h-3" style={{ color: accent }} />
            <span className="text-[10px] font-mono text-zinc-400">
              {activeTab === 'code' ? title : activeTab === 'terminal' ? 'bash — terminal' : 'browser — preview'}
            </span>
          </div>
        </div>
        <button 
          onClick={copy}
          className={`flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${
            copied 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
              : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
          }`}
        >
          {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
        </button>
      </div>

      {/* Editor Content */}
      <div className="flex-1 relative overflow-hidden bg-[#080c14]">
        {activeTab === 'code' ? (
          <div className="flex h-full overflow-hidden">
            <div className="flex-none w-10 bg-[#080c14] border-r border-white/5 pt-4 pb-4 flex flex-col items-end pr-3 overflow-hidden select-none">
              {lines.map((_, i) => (
                <div key={i} className="text-[11px] font-mono text-zinc-700 leading-6 min-h-[1.5rem]">{i + 1}</div>
              ))}
            </div>
            <div className="relative flex-1 overflow-hidden">
              <div ref={highlightRef} className="absolute inset-0 overflow-auto p-4 pt-4 pointer-events-none" style={{ scrollbarWidth: 'none' }}>
                <HighlightedCode code={code} />
              </div>
              <textarea 
                ref={taRef} 
                value={code} 
                onChange={handleCodeChange}
                onScroll={syncScroll}
                className="absolute inset-0 w-full h-full bg-transparent text-transparent resize-none outline-none p-4 pt-4 font-mono text-sm leading-6 border-none overflow-auto selection:bg-emerald-500/25"
                style={{ fontFamily: "'JetBrains Mono',monospace", whiteSpace: 'pre', overflowWrap: 'normal' }}
                spellCheck={false} wrap="off" />
            </div>
          </div>
        ) : activeTab === 'terminal' ? (
          <div className="p-6 font-mono text-sm leading-relaxed overflow-auto h-full">
            <div className="flex gap-2 text-zinc-500 mb-2">
              <span className="text-emerald-500">➜</span>
              <span className="text-blue-400">~/laravel-project</span>
              <span className="text-zinc-600 font-bold">$</span>
              <span className="text-zinc-200">{terminal || (title.includes('index.php') || title.includes('script.php') ? "php index.php" : "php artisan serve")}</span>
            </div>
            <div className="text-zinc-200 mt-4 h-full">
              {terminalOutput ? (
                <pre className="whitespace-pre-wrap">{terminalOutput}</pre>
              ) : (
                <div className="text-zinc-400 animate-pulse">
                   &gt; No server output yet.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-white p-8 overflow-auto text-black">
             {terminalOutput ? (
               <div dangerouslySetInnerHTML={{ __html: terminalOutput }} />
             ) : (
               <div className="text-zinc-400 italic">No preview available. Run the code first.</div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── MAIN COMPONENT ─────────────────────────────────────────────── */
export default function PHPLaravelLessonContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSlide = Math.max(0, Math.min(parseInt(searchParams.get('slide') || '1') - 1, slides.length - 1));

  const [current, setCurrent] = useState(initialSlide);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dir, setDir] = useState(1);
  const [showNotes, setShowNotes] = useState(false);
  const [userNotes, setUserNotes] = useState<Record<string, string>>({});

  const slide = slides[current];
  const IconComp = slide.icon;
  const progress = ((current + 1) / slides.length) * 100;

  // Persistence for notes
  useEffect(() => {
    const saved = localStorage.getItem('php_laravel_masterclass_notes');
    if (saved) setUserNotes(JSON.parse(saved));
  }, []);

  const saveNote = (val: string) => {
    const next = { ...userNotes, [slide.id]: val };
    setUserNotes(next);
    localStorage.setItem('php_laravel_masterclass_notes', JSON.stringify(next));
  };

  useEffect(() => {
    const mod = searchParams.get('module');
    if (mod) {
      const moduleMap: Record<string, number> = {
        '01': 0,  // W1-D1
        '02': 28, // W3-D1
        '03': 38, // W5-D1
        '04': 50, // W7-D1
        '05': 60, // W9-D1
        '06': 71, // W11-D1
      };
      if (moduleMap[mod] !== undefined) {
        setCurrent(moduleMap[mod]);
      }
    }
  }, []); // Only on mount

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('slide', (current + 1).toString());
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [current]);

  const goTo = useCallback((idx: number, direction: number) => {
    if (isAnimating) return;
    setDir(direction);
    setIsAnimating(true);
    setTimeout(() => { setCurrent(idx); setIsAnimating(false); }, 300);
  }, [isAnimating]);

  const next = () => goTo((current + 1) % slides.length, 1);
  const prev = () => goTo((current - 1 + slides.length) % slides.length, -1);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, isAnimating]);

  const variants = {
    enter: (d: number) => ({ x: d * 50, opacity: 0, scale: 0.97 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit:  (d: number) => ({ x: d * -50, opacity: 0, scale: 0.97 }),
  };

  return (
    <div className="min-h-screen text-white flex flex-col overflow-hidden"
      style={{ background: '#080c14', fontFamily: "'Inter','DM Sans',system-ui,sans-serif" }}>

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none transition-all duration-700" style={{ background: slide.bg }} />
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.02) 0%, transparent 70%)' }} />

      {/* ── HEADER ── */}
      <header className="relative z-20 flex items-center gap-4 px-6 py-4 border-b border-white/8 bg-black/20 backdrop-blur-xl flex-none mt-16 lg:mt-0">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center border border-white/10 flex-none"
          style={{ background: `${slide.accent}20` }}>
          <IconComp className="w-4 h-4" style={{ color: slide.accent }} />
        </div>
        <div className="flex-none">
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-bold">Month 1-3 · Weeks 1–12</p>
          <p className="text-sm font-black text-white tracking-tight uppercase">PHP & Laravel Masterclass</p>
        </div>

        <div className="flex-1 mx-6 hidden md:block">
          <div className="h-0.5 bg-white/8 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: slide.accent }} />
          </div>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
              showNotes 
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' 
              : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <StickyNote className="w-3.5 h-3.5" />
            {userNotes[slide.id] ? 'Edit Notes' : 'Take Notes'}
          </button>
          <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border"
            style={{ color: slide.tagColor, borderColor: `${slide.tagColor}40`, background: `${slide.tagColor}12` }}>
            {slide.tag}
          </span>
          <span className="text-xs font-mono text-zinc-600 ml-1">
            {current + 1}<span className="text-zinc-800">/{slides.length}</span>
          </span>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row overflow-hidden">

        {/* LEFT — Lesson content */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={`left-${current}`} custom={dir} variants={variants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
            className="flex-none lg:w-1/2 flex flex-col justify-between p-7 lg:p-12 xl:p-16 lg:border-r border-white/8 overflow-y-auto">

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl font-black tabular-nums leading-none flex-none pt-1"
                  style={{ color: `${slide.accent}35`, fontFamily: "'JetBrains Mono',monospace" }}>
                  {slide.id}
                </div>
                <div>
                  <h1 className="text-3xl xl:text-5xl font-black leading-tight text-white mb-2 group-hover:text-blue-400 tracking-tighter italic">
                    {slide.title}
                  </h1>
                  <p className="text-lg xl:text-xl text-white/50 font-bold uppercase tracking-widest">💡 {slide.subtitle}</p>
                </div>
              </div>

              <div className="space-y-3">
                {slide.content.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.05 }} className="flex items-start gap-3">
                    <div className="w-2.5 h-2.5 rounded-full mt-2.5 flex-none shadow-[0_0_10px_rgba(255,255,255,0.3)]" style={{ background: slide.accent }} />
                    {item.startsWith('http') ? (
                      <a href={item} target="_blank" rel="noopener noreferrer" 
                        className="text-lg xl:text-2xl text-blue-400 hover:text-blue-300 underline underline-offset-8 transition-colors break-all">
                        {item}
                      </a>
                    ) : (
                      <p className="text-lg xl:text-2xl text-white leading-relaxed font-medium tracking-tight whitespace-pre-line">{item}</p>
                    )}
                  </motion.div>
                ))}
              </div>

              <SyntaxPanel syntax={slide.syntax} accent={slide.accent} />

              <div className="space-y-3">
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="rounded-2xl border p-4 flex gap-3.5"
                  style={{ background: `${slide.accent}0a`, borderColor: `${slide.accent}28` }}>
                  <Play className="w-4 h-4 flex-none mt-1" style={{ color: slide.accent }} />
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] mb-2" style={{ color: slide.accent }}>🛠 Lab Exercise</p>
                    <p className="text-lg xl:text-xl text-white leading-relaxed font-bold">{slide.lab}</p>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="rounded-2xl border p-4 flex gap-3.5 bg-emerald-500/5 border-emerald-500/15">
                  <Check className="w-4 h-4 flex-none mt-1 text-emerald-400" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] mb-2 text-emerald-400">✅ Expected Result</p>
                    <p className="text-lg xl:text-xl text-white leading-relaxed font-bold">{slide.result}</p>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-10 lg:mt-0">
              <button onClick={prev}
                className="p-3.5 rounded-2xl bg-white/5 border border-white/8 hover:bg-white/10 active:scale-95 transition-all flex items-center gap-2 group">
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs font-bold hidden sm:inline">Previous</span>
              </button>
              <button onClick={next}
                className="flex-1 py-3.5 px-6 rounded-2xl font-black text-xs active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/20"
                style={{ background: slide.accent, color: '#000' }}>
                {current === slides.length - 1 ? 'Start Again' : 'Next Lesson'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* RIGHT — Code viewer */}
        <div className="flex-none lg:w-1/2 flex flex-col overflow-hidden p-4 lg:p-8 xl:p-12 gap-4">
          <div className="flex items-center justify-between flex-none">
            <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1.5 border border-white/8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest shadow-inner"
                style={{ background: `${slide.accent}25`, color: slide.accent }}>
                <Terminal className="w-4 h-4" /> 💻 Interactive Implementation
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={`code-${current}`}
              initial={{ opacity: 0, y: 12, scale: 0.99 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.99 }} 
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="flex-1 overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
              <CodeViewer 
                code={slide.code} 
                terminal={slide.terminal} 
                terminalOutput={slide.terminalOutput} 
                accent={slide.accent} 
                title={slide.filename || (slide.id.startsWith('W1') ? 'index.php' : (slide.id.startsWith('W4') ? 'view.blade.php' : 'app/Http/Controllers/Controller.php'))} 
                showPreview={slide.showPreview}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* --- NOTES PANEL (Overlay) --- */}
      <AnimatePresence>
        {showNotes && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-80 bg-[#161b22] border-l border-white/10 z-[100] shadow-2xl p-6 flex flex-col pt-24"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-amber-400">Student Notes</h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">Slide {slide.id}</p>
              </div>
              <button onClick={() => setShowNotes(false)} className="text-zinc-500 hover:text-white transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <textarea
              autoFocus
              value={userNotes[slide.id] || ''}
              onChange={(e) => saveNote(e.target.value)}
              placeholder="Type your notes for this slide here... (Auto-saves)"
              className="flex-1 w-full bg-black/40 rounded-2xl p-4 text-sm font-medium text-zinc-300 resize-none outline-none border border-white/5 focus:border-amber-500/40 transition-all placeholder:text-zinc-700 font-mono"
            />

            <div className="mt-6 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
              <p className="text-[10px] text-amber-500/70 font-bold uppercase leading-relaxed">
                💡 Tip: Use notes to save lab results, snippets, or questions for your mentor.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
