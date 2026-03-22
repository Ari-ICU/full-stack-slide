'use client';

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor } from "lucide-react";

const GLOBAL_STYLE = (theme: 'dark' | 'light') => `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Serif+Display:ital@0;1&family=Noto+Sans+Khmer:wght@400;700;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: ${theme === 'dark' ? '#0d0d0d' : '#ffffff'};
    --card: ${theme === 'dark' ? '#161616' : '#f9f9f9'};
    --border: ${theme === 'dark' ? '#2a2a2a' : '#eeeeee'};
    --dim: ${theme === 'dark' ? '#666666' : '#888888'};
    --ink: ${theme === 'dark' ? '#f0f0f0' : '#000000'};
    --ghost: ${theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
    --header-bg: ${theme === 'dark' ? '#080a11' : '#f0f4f8'};
  }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-thumb { background: #444; border-radius: 2px; }
  body { background: var(--bg); color: var(--ink); }
  button { cursor: pointer; }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
  @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.02); } }
`;

const ACCENT="#e8ff47",GREEN="#4ade80",BLUE="#38bdf8";
const PINK="#f472b6",ORANGE="#fb923c",PURPLE="#a78bfa",TEAL="#2dd4bf";

// ─────────────────────────────────────────────────────────────
interface Bullet {
  icon: string;
  label: string;
  desc: string;
}

interface SlideData {
  num: string;
  chapter: string;
  chapterColor: string;
  tag: string;
  tagColor: string;
  icon: string; // New field
  title: string;
  subtitle: string;
  body: string;
  bullets: Bullet[];
  code: string | null;
  concept?: string | null;
  syntax?: string | null; // Added syntax field
  output: string | null;
  tip: string;
}

interface ChapterData {
  name: string;
  color: string;
  nums: string[];
  icon: string; // New field
}

// ─────────────────────────────────────────────────────────────
const SLIDES: SlideData[] = [
  {
    num:"01", chapter:"Foundations", chapterColor:BLUE,
    tag:"Intro", tagColor:BLUE, icon:"🖥️",
    title:"What is PHP?",
    subtitle:"Server-side · Dynamic web · Request/Response flow",
    body:`PHP (Hypertext Preprocessor) គឺជា **server-side scripting language** ។ PHP ដំណើរការនៅ **server** ─ generate HTML ─ ផ្ញើ HTML ទៅ browser ។ User មើលឃើញតែ HTML, មិនឃើញ PHP source code ។`,
    bullets:[
      {icon:"🖥️",label:"Server-side",    desc:"Code ដំណើរការនៅ server ─ មិនមែន browser"},
      {icon:"🔗",label:"Works with HTML", desc:"Embed PHP ក្នុង HTML ដោយ <?php ?> tags"},
      {icon:"⚙️",label:"Backend language",desc:"Handle DB, forms, authentication, file uploads"},
      {icon:"🌍",label:"77% of the web",  desc:"WordPress · Wikipedia · Facebook ─ all PHP"},
    ],
    code:`<?php
// ── Request / Response Flow ──────────────────
//
//   Browser  ──── HTTP Request ────▶  Server
//                                       │
//                                  PHP runs here
//                                  generates HTML
//                                       │
//   Browser  ◀─── HTML Response ────  Server
//
// ─────────────────────────────────────────────

echo "PHP Version: " . phpversion();
echo "Hello from the server! 👋";
?>`,
    output:`PHP Version: 8.3.4
Hello from the server! 👋`,
    syntax: `// ── Version Check Syntax ──────────────────
//
//  phpversion();  : Get current PHP version
//  echo "s";     : Print string output
//  .            : String join (concatenation)
//
// ─────────────────────────────────────────`,
    tip:"PHP ត្រូវ run លើ server ─ install XAMPP ឬ Laragon ដើម្បីចាប់ផ្តើម!",
  },
  {
    num:"02", chapter:"Foundations", chapterColor:BLUE,
    tag:"First Code", tagColor:GREEN, icon:"🚀",
    title:"Your First PHP Code",
    subtitle:"<?php ?> · echo · print · comments · semicolon",
    body:`PHP code ត្រូវ wrap ក្នុង **<?php ?>** tags ។ ប្រើ **echo** ឬ **print** ដើម្បី output text ។ Statement ទាំងអស់ចប់ដោយ **semicolon (;)** ─ missing semicolon = Parse Error ។`,
    bullets:[
      {icon:"🏷️",label:"<?php ?>",   desc:"PHP tags ─ server processes code inside these"},
      {icon:"📢",label:"echo",        desc:"Output text/HTML ─ most used, accepts multiple args"},
      {icon:"🔚",label:"Semicolon ;", desc:"Ends every statement ─ missing = fatal Parse Error!"},
      {icon:"💬",label:"Comments",    desc:"// single line   /* multi-line */   # old style"},
    ],
    code:`<?php
// Single-line comment
# Also single-line (legacy)

/*
 * Multi-line comment block
 * PHP ignores all of this
 */

// Basic output
echo "Hello, World!";
echo "One", " Two", " Three"; // multiple args

// print (one argument, returns 1)
print "Hello Students!";

// Shorthand echo <?= ?> — cleaner in HTML
?>
<h2><?= "Welcome to PHP!" ?></h2>
<?php

// Double quotes: interpolate variables
$name = "Ratha";
echo "Hello $name!";   // Hello Ratha!

// Single quotes: literal (no interpolation)
echo 'Hello $name!';   // Hello $name!
?>`,
    syntax: `// ── PHP Basic Syntax ──────────────────────
//
//  <?php ... ?>    : PHP tags
//  echo "text";    : Output text (no return)
//  print "text";   : Output text (returns 1)
//  ;               : Every statement must end with semicolon
//  // or #         : Single-line comment
//  /* ... */       : Multi-line comment block
//  <?= ... ?>      : Shorthand for echo
//
// ─────────────────────────────────────────`,
    output:`Hello, World!
One Two Three
Hello Students!
<h2>Welcome to PHP!</h2>
Hello Ratha!
Hello $name!`,
    tip:"Omit the closing ?> tag when file is pure PHP ─ prevents accidental whitespace before HTTP headers!",
  },
  {
    num:"03", chapter:"Foundations", chapterColor:BLUE,
    tag:"Variables", tagColor:ORANGE, icon:"📦",
    title:"Variables",
    subtitle:"$ · naming rules · assignment · var_dump · constants",
    body:`Variable ជា **named container** ដែល store data ។ PHP variables ចាប់ផ្តើមដោយ **$** ─ case-sensitive ─ dynamically typed ។ ប្រើ **var_dump()** debug ─ **define()** ឬ **const** សម្រាប់ constants ។`,
    bullets:[
      {icon:"$",  label:"Dollar sign $",  desc:"All variables: $name $age $total ─ required prefix"},
      {icon:"=",  label:"Assignment =",   desc:"$x = 10; ─ = assigns, == compares, === strict compare"},
      {icon:"🔤", label:"Case-sensitive", desc:"$Name ≠ $name ─ completely different variables!"},
      {icon:"🔍", label:"var_dump()",     desc:"Shows TYPE + VALUE ─ best debugging tool in PHP"},
    ],
    code:`<?php
// Variable declaration
$firstName = "Ratha";
$age       = 20;
$height    = 1.70;
$isStudent = true;
$score     = null;

// Output variables
echo $firstName . " ";           // Ratha
echo "Age: $age";                // interpolation (double quotes)
echo "Hi " . $firstName . "!";  // concatenation with dot

// var_dump — shows TYPE + VALUE
var_dump($age);       // int(20)
var_dump($height);    // float(1.7)
var_dump($isStudent); // bool(true)
var_dump($score);     // NULL

// Constants — cannot be changed later
define("APP_NAME", "UniPortal");  // runtime constant
const VERSION = "1.0";            // compile-time constant

echo APP_NAME . " ";   // UniPortal
echo VERSION . " ";    // 1.0

// Multiple assignment shorthand
$a = $b = $c = 0;
echo "$a $b $c\n"; // 0 0 0
?>`,
    syntax: `// ── Variable Syntax ──────────────────────
//
//  $name = value;  : Prefix with $
//  $a = $b = 0;   : Multi-assignment
//  define("N", v); : Constant (global)
//  const N = v;    : Constant (class/file)
//  "$var"         : Interpolation (Double quotes)
//  '$var'         : Literal (Single quotes)
//  .              : Concatenation operator
//
// ─────────────────────────────────────────`,
    output:`Ratha
Age: 20
Hi Ratha!
int(20)
float(1.7)
bool(true)
NULL
UniPortal
1.0
0 0 0`,
    tip:"var_dump() is better than echo for debugging ─ it shows the TYPE and VALUE so you know exactly what PHP sees!",
  },
  {
    num:"04", chapter:"Foundations", chapterColor:BLUE,
    tag:"Data Types", tagColor:PINK, icon:"📝",
    title:"Data Types",
    subtitle:"string · int · float · bool · null · array · gettype · casting",
    body:`PHP មាន **8 data types** ─ 4 scalar, 2 compound, 2 special ។ PHP ជា **dynamically typed** ─ type auto-detected ។ ប្រើ **gettype()** ពិនិត្យ type ─ **===** strict comparison ─ **(int)** casting ។`,
    bullets:[
      {icon:"📝",label:"string",  desc:'"Hello" or \'World\' ─ text, any length'},
      {icon:"🔢",label:"integer", desc:"42  -5  0 ─ whole numbers, no decimal point"},
      {icon:"📊",label:"float",   desc:"3.14  1.5 ─ decimals (PHP internally calls it 'double')"},
      {icon:"✅",label:"boolean", desc:"true / false ─ only two possible values"},
      {icon:"📋",label:"array",   desc:'["A","B","C"] ─ ordered list of values'},
      {icon:"∅", label:"NULL",    desc:"null ─ no value assigned (different from 0 or \"\")"},
    ],
    code:`<?php
$str     = "Hello PHP";
$int     = 42;
$float   = 3.14;
$bool    = true;
$arr     = ["A", "B", "C"];
$nothing = null;

// gettype() — returns type name as string
echo gettype($str);     // string
echo gettype($int);     // integer
echo gettype($float);   // double  ← NOT "float"!
echo gettype($bool);    // boolean
echo gettype($arr);     // array
echo gettype($nothing); // NULL

// var_dump — type + value in detail
var_dump($float);   // float(3.14)
var_dump($bool);    // bool(true)

// is_* type checking functions
var_dump(is_string($str));   // bool(true)
var_dump(is_int($int));      // bool(true)
var_dump(is_null($nothing)); // bool(true)

// Type casting (explicit conversion)
$price = (float)"19.99 USD"; // 19.99
$count = (int)"5 items";     // 5
echo "$price  $count";
?>`,
    syntax: `// ── Data Types & Casting ──────────────────
//
//  (int)$val      : Cast to Integer
//  (float)$val    : Cast to Float
//  (string)$val   : Cast to String
//  (bool)$val     : Cast to Boolean
//  (array)$val    : Cast to Array
//
//  gettype($x);   : Check internal type name
//  is_int($x);    : Returns true if integer
//  is_null($x);   : Returns true if null
//
// ─────────────────────────────────────────`,
    output:`string
integer
double
boolean
array
NULL
float(3.14)
bool(true)
bool(true)
bool(true)
bool(true)
19.99  5`,
    tip:"gettype(3.14) returns 'double' not 'float' ─ that is PHP's internal name. Do not be confused!",
  },

  // ── WEEK 2 ────────────────────────────────────────────────
  {
    num:"05", chapter:"Operators & Flow", chapterColor:ORANGE,
    tag:"Operators", tagColor:ORANGE, icon:"➕",
    title:"Operators",
    subtitle:"arithmetic · comparison · logical · assignment · ??",
    body:`Operators ប្រើដើម្បី **calculate**, **compare** ឬ **combine** values ។ **=== (strict equality)** essential ─ PHP type juggling ជាមួយ == creates dangerous bugs ។ **??** (null coalescing) ─ clean default value pattern ។`,
    bullets:[
      {icon:"➕",label:"Arithmetic", desc:"+ − * / % (modulo) ** (power)"},
      {icon:"⚖️",label:"Comparison", desc:"=== strict  == loose  != !== > < >= <="},
      {icon:"🔗",label:"Logical",    desc:"&& AND   || OR   ! NOT ─ short-circuit evaluation"},
      {icon:"⚡",label:"Assignment", desc:"+= −= *= /= .= (string append) ??= (null assign)"},
    ],
    code:`<?php
$a = 10; $b = 3;

// Arithmetic operators
echo ($a + $b) . " ";   // 13
echo ($a - $b) . " ";   // 7
// echo ($a * $b) . " ";   // Commented out
// echo ($a / $b) . " ";   // Commented out
echo ($a % $b) . " ";   // 1 (modulo = remainder)
echo ($a ** 2) . " ";   // 100 (power)

// Comparison — STRICT vs LOOSE
var_dump(5 === 5);     // bool(true)  ← same type + value
var_dump(5 === "5");   // bool(false) ← different type!
var_dump(5 ==  "5");   // bool(true)  ← DANGEROUS: type juggling
var_dump(0 ==  "foo"); // bool(true)  ← VERY DANGEROUS bug!

// ALWAYS use === in PHP!
var_dump("" === false); // bool(false) ─ correct
var_dump("" ==  false); // bool(true)  ─ wrong!

// Logical operators
$age = 20; $score = 85;
var_dump($age >= 18 && $score >= 50); // bool(true)
var_dump($age < 18  || $score >= 50); // bool(true)

// Assignment shorthand
$x = 10;
$x += 5;  echo "$x "; // 15
$x *= 2;  echo "$x "; // 30

// Null coalescing — safe default value
$name = $_GET['name'] ?? "Guest";
$cfg  = [];
$cfg['debug'] ??= false; // assign only if null
echo "Hello, $name!";
?>`,
    syntax: `// ── Operators Syntax ──────────────────────
//
//  + - * / % **   : Math operators
//  .              : String join (concatenation)
//  ===            : Strict compare (Value + Type)
//  ==             : Loose compare (DANGEROUS!)
//  &&  ||  !      : AND, OR, NOT
//  ??             : Null check (if null, use default)
//  += -= .=       : Combined assignment
//
// ─────────────────────────────────────────`,
    output:`13
7
1
100
bool(true)
bool(false)
bool(true)
bool(true)
bool(false)
bool(true)
bool(true)
bool(true)
15
30
Hello, Guest!`,
    tip:"ALWAYS use === not == ─ '0' == false is TRUE in PHP and causes real production bugs!",
  },
  {
    num:"06", chapter:"Operators & Flow", chapterColor:ORANGE,
    tag:"Strings", tagColor:TEAL, icon:"📏",
    title:"String Functions",
    subtitle:"strlen · trim · str_replace · explode · substr · str_contains",
    body:`PHP មាន **string functions** ជាង 100 built-in ។ ប្រើ **mb_** prefix for Khmer/Unicode ─ regular functions count bytes not characters ។ **explode/implode** ─ convert between string and array ។`,
    bullets:[
      {icon:"📏",label:"strlen / mb_strlen",  desc:"String length ─ use mb_ for Unicode/Khmer text"},
      {icon:"✂️",label:"trim / explode",       desc:"Remove whitespace / split string into array by separator"},
      {icon:"🔍",label:"str_contains (PHP 8)", desc:"Returns bool ─ cleaner than strpos() !== false"},
      {icon:"🔄",label:"str_replace",          desc:"str_replace('old','new',$str) ─ find and replace"},
    ],
    code:`<?php
$text = "  Hello PHP World!  ";

// Case & trim
echo strtoupper(trim($text)) . ""; // HELLO PHP WORLD!
echo strtolower(trim($text)) . ""; // hello php world!
echo ucwords(strtolower(trim($text))) . ""; // Hello Php World!
echo strlen(trim($text)) . "";     // 17

// Search
echo strpos($text, "PHP") . "";              // 9
var_dump(str_contains($text, "PHP"));  // bool(true)  PHP 8+
var_dump(str_starts_with(trim($text), "Hello")); // bool(true)

// Replace
echo str_replace("PHP", "Laravel", $text) . "";

// Split & join
$csv   = "Dara,Ratha,Sophal,Channa";
$names = explode(",", $csv);   // string → array
print_r($names);               // print_r includes newlines
echo implode(" | ", $names) . "";   // array → string

// Substring
$s = "Hello World";
echo substr($s, 0, 5) . "";   // Hello
echo substr($s, -5) . "";     // World

// Padding & repeat
echo str_pad("42", 6, "0", STR_PAD_LEFT) . ""; // 000042
echo str_repeat("-", 20) . "";                  // --------------------
?>`,
    syntax: `// ── Common String Functions ───────────────
//
//  strlen($s);          : Get character count
//  trim($s);            : Remove edge spaces
//  strtolower($s);      : Convert to lowercase
//  str_replace(f, r, s) : Find & replace text
//  explode(",", $s);    : Split string into array
//  substr($s, 0, 5);    : Extract part of string
//  str_contains($s, t); : Check if text exists
//
// ─────────────────────────────────────────`,
    output:`HELLO PHP WORLD!
hello php world!
Hello Php World!
17
9
bool(true)
bool(true)
  Hello Laravel World!  
Array ( [0] => Dara [1] => Ratha [2] => Sophal [3] => Channa )
Dara | Ratha | Sophal | Channa
Hello
World
000042
--------------------`,
    tip:"Use mb_strlen() / mb_strtolower() for Khmer text ─ regular functions count bytes, not characters!",
  },
  {
    num:"07", chapter:"Operators & Flow", chapterColor:ORANGE,
    tag:"Control Flow", tagColor:BLUE, icon:"🔀",
    title:"If / Else / Match",
    subtitle:"if · elseif · else · match · ternary · null coalescing ??",
    body:`**if/else** ប្រើសម្រាប់ decision making ─ execute code based on condition ។ PHP 8 **match** ─ strict, no fallthrough, returns value ─ cleaner than switch ។ **Ternary** (?:) ─ one-liner ─ **??** safe default ។`,
    bullets:[
      {icon:"❓",label:"if / elseif / else",  desc:"Classic conditional ─ chain multiple with elseif"},
      {icon:"🔀",label:"match (PHP 8)",       desc:"Strict === ─ no fallthrough ─ returns a value"},
      {icon:"⚡",label:"Ternary ?:",           desc:"$x = cond ? 'yes' : 'no' ─ one-line if/else"},
      {icon:"🛡️",label:"?? null coalescing",  desc:'$n = $_GET["n"] ?? "Guest" ─ default if null/missing'},
    ],
    code:`<?php
$score = 75;

// if / elseif / else
if      ($score >= 90) $grade = "A";
elseif  ($score >= 80) $grade = "B";
elseif  ($score >= 70) $grade = "C";
elseif  ($score >= 60) $grade = "D";
else                   $grade = "F";
echo "Grade: $grade";  // Grade: C

// switch (older style — use match instead)
switch ($grade) {
    case "A": echo "Excellent!"; break;
    case "B": echo "Very good!"; break;
    case "C": echo "Good";       break;
    default:  echo "Keep trying";
}

// match (PHP 8) — strict, cleaner, returns value
$day  = "Monday";
$type = match($day) {
    "Saturday", "Sunday" => "Weekend 🎉",
    default              => "Workday 💼",
};
echo $type;  // Workday 💼

// Ternary operator
$age    = 20;
$status = $age >= 18 ? "Adult ✅" : "Minor ❌";
echo $status;

// Nested ternary (readable chaining)
$badge = $score >= 90 ? "🥇 Gold"
       : ($score >= 70 ? "🥈 Silver" : "📖 Study more");
echo $badge;  // 🥈 Silver

// Null coalescing — safe default
$name = $_GET['name'] ?? "Guest";
echo "Hello, $name!";
?>`,
    syntax: `// ── Control Flow Syntax ──────────────────
//
//  if (cond) { ... }    : Conditional block
//  elseif (cond) { ... }: Else if check
//  else { ... }         : Default block
//  match ($v) {         : Modern switch (PHP 8)
//    "key" => value,
//    default => val
//  };
//  $res = cond ? t : f; : Shorthand if/else
//
// ─────────────────────────────────────────`,
    output:`Grade: C
Good
Workday 💼
Adult ✅
🥈 Silver
Hello, Guest!`,
    tip:"Prefer match over switch in PHP 8 ─ match uses === strict comparison and always returns a value!",
  },
  {
    num:"08", chapter:"Operators & Flow", chapterColor:ORANGE,
    tag:"Loops", tagColor:GREEN, icon:"🔢",
    title:"Loops",
    subtitle:"for · while · do-while · foreach · break · continue",
    body:`Loops ប្រើដើម្បី **repeat code** ។ **foreach** ─ best for arrays ─ use 99% of the time ─ no off-by-one errors ។ **for** ─ when count is known ─ **break** exits loop ─ **continue** skips current iteration ។`,
    bullets:[
      {icon:"🔢",label:"for",      desc:"for ($i=0; $i<n; $i++) ─ use when count is known"},
      {icon:"🔄",label:"while",    desc:"Checks condition FIRST ─ may run 0 times"},
      {icon:"🔁",label:"do-while", desc:"Checks condition AFTER ─ runs at least once"},
      {icon:"📋",label:"foreach",  desc:"Best for arrays ─ foreach ($arr as $key => $val)"},
    ],
    code:`<?php
    echo "=== FOR ===";
    for ($i = 1; $i <= 5; $i++) {
        echo "Count: $i";
    }
    
    // while — unknown count, check first
    echo "=== WHILE ===";
    $x = 10;
    while ($x > 0) {
        echo "$x ";
        $x -= 3;
    }
    
    // do-while — always runs at least once
    echo "=== DO-WHILE ===";
    $tries = 1;
    do {
        echo "Attempt #$tries";
        $tries++;
    } while ($tries <= 3);
    
    // foreach — indexed array (most common!)
    echo "=== FOREACH indexed ===";
    $fruits = ["Apple", "Banana", "Mango"];
    foreach ($fruits as $fruit) {
        echo "- $fruit";
    }
    
    // foreach — associative array with key => value
    echo "=== FOREACH key => value ===";
    $student = ["name" => "Ratha", "age" => 20, "gpa" => 3.5];
    foreach ($student as $key => $value) {
        echo "$key: $value";
    }
    
    // break and continue
    echo "=== ODD NUMBERS 1-9 ===";
for ($i = 1; $i <= 10; $i++) {
    if ($i % 2 === 0) continue; // skip even numbers
    if ($i > 9)       break;    // stop when > 9
    echo "$i ";
}
?>`,
    syntax: `// ── Loop Syntax ──────────────────────────
//
//  for ($i=0; $i<5; $i++)   : Repeat n times
//  while (cond)             : Loop while true
//  foreach ($arr as $v)     : Loop through array
//  foreach ($arr as $k=>$v) : Loop with Keys
//  continue;                : Skip to next cycle
//  break;                   : Exit loop completely
//
// ─────────────────────────────────────────`,
    output:`=== FOR ===
Count: 1
Count: 2
Count: 3
Count: 4
Count: 5

=== WHILE ===
10 7 4 1

=== DO-WHILE ===
Attempt #1
Attempt #2
Attempt #3

=== FOREACH indexed ===
- Apple
- Banana
- Mango

=== FOREACH key => value ===
name: Ratha
age: 20
gpa: 3.5

=== ODD NUMBERS 1-9 ===
1 3 5 7 9`,
    tip:"Use foreach for 99% of array iteration ─ safer and cleaner than for ($i=0; $i<count($arr); $i++)!",
  },

  // ── WEEK 3 ────────────────────────────────────────────────
  {
    num:"09", chapter:"Functions & Arrays", chapterColor:PINK,
    tag:"Functions", tagColor:PINK, icon:"🧪",
    title:"Functions",
    subtitle:"declare · params · default · return · type hints · arrow fn",
    body:`Function ជា **reusable block of code** ─ declare once, call anywhere ─ DRY principle ។ PHP 8 **type hints** ─ declare param & return types ─ safer, self-documenting code ។ **Arrow functions** (fn) ─ concise one-liners ។`,
    bullets:[
      {icon:"📦",label:"function keyword",  desc:"function name($params) { return $val; }"},
      {icon:"↩️",label:"return",            desc:"Exits function and sends value back to caller"},
      {icon:"🎯",label:"Default params",    desc:'function greet($n, $lang = "en") ─ optional argument'},
      {icon:"🏷️",label:"Type hints PHP 8",  desc:"function add(int $a, int $b): int ─ enforced types"},
    ],
    code:`<?php
// Basic function with type hints
function greet(string $name): string {
    return "Hello, $name!";
}
echo greet("Ratha");   // Hello, Ratha!
echo greet("Sophal");  // Hello, Sophal!

// Default parameter value
function welcome(string $name, string $lang = "en"): string {
    return match($lang) {
        "km"    => "សួស្ដី $name!",
        "fr"    => "Bonjour $name!",
        default => "Hello $name!",
    };
}
echo welcome("Dara");        // Hello Dara!
echo welcome("Dara", "km");  // សួស្ដី Dara!

// Return multiple values as array
function minMax(array $nums): array {
    return ["min" => min($nums), "max" => max($nums)];
}
$r = minMax([5, 2, 8, 1, 9, 3]);
echo "Min: {$r['min']}, Max: {$r['max']}";
// Min: 1, Max: 9

// Arrow functions (PHP 7.4+) — single expression
$double  = fn($n) => $n * 2;
$squared = fn($n) => $n ** 2;
echo $double(5);    // 10
echo $squared(4);   // 16

// Scope — variables inside function are LOCAL
$appName = "UniPortal";
function testScope(): void {
    // $appName NOT accessible here without global keyword
    $local = "local only";
    echo $local;  // local only
}
testScope();
// $local is gone after function ends
// $local is gone after function ends
?>`,
    syntax: `// ── Function Syntax ───────────────────────
//
//  function name($p) {  : Define function
//    return $val;       : Return data
//  }
//  function f(type $p)  : Type hint params
//  function f(): type   : Type hint return
//  $f = fn($x) => $x*2; : Shorthand Arrow Fn
//
// ─────────────────────────────────────────`,
    output:`Hello, Ratha!
Hello, Sophal!
Hello Dara!
សួស្ដី Dara!
Min: 1, Max: 9
10
16
local only`,
    tip:"Functions should do ONE thing. If you say 'and' when describing it, split it into two functions!",
  },
  {
    num:"10", chapter:"Functions & Arrays", chapterColor:PINK,
    tag:"Arrays", tagColor:ORANGE, icon:"📋",
    title:"Arrays",
    subtitle:"indexed · associative · multi-dim · map · filter · reduce",
    body:`Array ជា **list** ដែល store multiple values ។ **Indexed** ─ number keys (0,1,2) ─ **Associative** ─ string keys ─ **Multi-dimensional** ─ arrays inside arrays ─ simulates database rows ─ PDO returns this exact format ។`,
    bullets:[
      {icon:"📋",label:"Indexed",        desc:'$arr = ["A","B","C"] ─ access with $arr[0]'},
      {icon:"🗂️",label:"Associative",    desc:'$u = ["name"=>"Ratha"] ─ access with $u["name"]'},
      {icon:"🔧",label:"Array functions", desc:"count() sort() array_push() in_array() array_column()"},
      {icon:"⚡",label:"map/filter/reduce",desc:"Functional style ─ transform arrays cleanly"},
    ],
    code:`<?php
// ── Indexed Array ───────────────────────────
$fruits = ["Apple", "Banana", "Mango"];
echo $fruits[0];       // Apple
echo count($fruits);   // 3
$fruits[] = "Grape";   // append to end
sort($fruits);         // alphabetical A-Z
print_r($fruits);

// ── Associative Array ───────────────────────
$student = [
    "name"  => "Ratha",
    "age"   => 20,
    "major" => "Computer Science",
];
echo $student["name"];          // Ratha
$student["gpa"] = 3.5;          // add field
unset($student["age"]);         // remove field
foreach ($student as $k => $v) {
    echo "$k: $v";
}

// ── Functional array operations ─────────────
$nums = [3, 1, 4, 1, 5, 9, 2, 6];

// filter — keep only even numbers
$evens = array_filter($nums, fn($n) => $n % 2 === 0);
print_r(array_values($evens));  // [4, 2, 6]

// map — double each number
$doubled = array_map(fn($n) => $n * 2, $nums);

// reduce — sum all numbers
$sum = array_reduce($nums, fn($carry, $n) => $carry + $n, 0);
echo "Sum: $sum";  // Sum: 31

// ── Multi-dimensional (like DB rows) ────────
$students = [
    ["name" => "Ratha",  "gpa" => 3.5],
    ["name" => "Sophal", "gpa" => 3.8],
];
foreach ($students as $s) {
    echo "{$s['name']}: GPA {$s['gpa']}";
}

// Extract one column from all rows
$names = array_column($students, "name");
echo implode(", ", $names);  // Ratha, Sophal
echo implode(", ", $names);  // Ratha, Sophal
?>`,
    syntax: `// ── Array Syntax ──────────────────────────
//
//  ["A", "B", "C"]      : Indexed array
//  ["k" => "v"]         : Associative array
//  $arr[0]              : Access by index
//  $arr["name"]         : Access by key
//  count($arr);         : Get size
//  array_filter($a, fn) : Filter elements
//  array_map(fn, $a)    : Transform elements
//
// ─────────────────────────────────────────`,
    output:`Apple
3
Array ( [0] => Apple [1] => Banana [2] => Grape [3] => Mango )
name: Ratha
major: Computer Science
gpa: 3.5
Array ( [0] => 4 [1] => 2 [2] => 6 )
Sum: 31
Ratha: GPA 3.5
Sophal: GPA 3.8
Ratha, Sophal`,
    tip:"Multi-dimensional arrays = database rows! PDO fetchAll() returns data in EXACTLY this format.",
  },

  // ── WEEK 4: OOP ───────────────────────────────────────────
  {
    num:"11", chapter:"OOP", chapterColor:PURPLE,
    tag:"Classes & Objects", tagColor:PURPLE, icon:"🏗️",
    title:"Classes & Objects",
    subtitle:"class · __construct · $this · methods · new · instanceof",
    body:`**OOP** organizes code ជា **objects** ─ bundles data + behavior ។ **Class** ជា blueprint ─ **Object** ជា instance ─ **$this** refers to current object ។ PHP 8 **constructor promotion** ─ declare properties directly in constructor ─ no duplication ។`,
    bullets:[
      {icon:"📐",label:"class",           desc:"Blueprint/template ─ defines properties & methods"},
      {icon:"📦",label:"new ClassName()", desc:"Creates an object (instance) from the class"},
      {icon:"🔧",label:"__construct()",   desc:"Constructor ─ auto-called when object is created"},
      {icon:"👉",label:"$this->",         desc:"Refers to the current object's own data & methods"},
    ],
    code:`<?php
class Student {
    // PHP 8: Constructor Promotion
    // Declare + assign properties directly in constructor!
    public function __construct(
        public string $name,
        public int    $age,
        public float  $gpa = 0.0   // default value
    ) {} // ← empty body, PHP handles assignment

    // Method — uses $this to access own properties
    public function introduce(): string {
        return "Hi! I'm {$this->name}, age {$this->age}.";
    }

    public function getStatus(): string {
        return $this->gpa >= 2.0 ? "Passing ✅" : "At Risk ⚠️";
    }

    // Setter with validation
    public function setGpa(float $gpa): void {
        if ($gpa < 0 || $gpa > 4.0) {
            throw new InvalidArgumentException("GPA must be 0-4.0");
        }
        $this->gpa = $gpa;
    }
}

// Create instances (objects)
$ratha  = new Student("Ratha",  20, 3.5);
$sophal = new Student("Sophal", 22, 1.8);

// Call methods
echo $ratha->introduce();   // Hi! I'm Ratha, age 20.
echo $sophal->introduce();  // Hi! I'm Sophal, age 22.
echo $ratha->getStatus();   // Passing ✅
echo $sophal->getStatus();  // At Risk ⚠️

// Access property
echo $ratha->name;  // Ratha

// Use setter
$ratha->setGpa(3.9);
echo $ratha->gpa;   // 3.9

// instanceof operator
var_dump($ratha instanceof Student); // bool(true)
var_dump($ratha instanceof Student); // bool(true)
?>`,
    syntax: `// ── Class & Object Syntax ─────────────────
//
//  class Name { ... }   : Define class
//  new Name();          : Create object
//  public $p;           : Property (accessible)
//  $this->p             : Internal access
//  $obj->p              : External access
//  __construct(...)     : Initializer
//  $o instanceof Class  : Check type
//
// ─────────────────────────────────────────`,
    output:`Hi! I'm Ratha, age 20.
Hi! I'm Sophal, age 22.
Passing ✅
At Risk ⚠️
Ratha
3.9
bool(true)`,
    tip:"PHP 8 constructor promotion: write 'public string $name' inside __construct() params ─ no need to declare properties separately!",
  },
  {
    num:"12", chapter:"OOP", chapterColor:PURPLE,
    tag:"Inheritance", tagColor:PURPLE, icon:"🔗",
    title:"Inheritance",
    subtitle:"extends · parent:: · method override · access modifiers",
    body:`**Inheritance** ─ child class (**extends**) gets all properties & methods from parent ─ reuse code ─ DRY ។ **Access modifiers** control visibility ─ public/protected/private ─ **parent::** ─ call parent's version of a method ។`,
    bullets:[
      {icon:"🔗",label:"extends",           desc:"class Admin extends User ─ inherit all from User"},
      {icon:"🔒",label:"Access modifiers",  desc:"public=anywhere │ protected=class+children │ private=class only"},
      {icon:"🔄",label:"Method override",   desc:"Child redefines parent method ─ called polymorphism"},
      {icon:"⬆️",label:"parent::",          desc:"parent::__construct() ─ call parent's version explicitly"},
    ],
    code:`<?php
// Parent Class
class User {
    public    string $name;
    protected string $email;    // accessible in child classes
    private   string $password; // ONLY in this class, not children

    public function __construct(
        string $name,
        string $email,
        string $password
    ) {
        $this->name     = $name;
        $this->email    = $email;
        // NEVER store plain text passwords!
        $this->password = password_hash($password, PASSWORD_DEFAULT);
    }

    public function getRole(): string { return "user"; }

    public function describe(): string {
        return "{$this->name} <{$this->email}> — {$this->getRole()}";
    }
}

// Child Class — inherits everything from User
class Admin extends User {
    public function __construct(
        string $name,
        string $email,
        string $password,
        public string $department  // extra property for Admin
    ) {
        parent::__construct($name, $email, $password); // call parent!
    }

    // Override — replace parent's getRole()
    public function getRole(): string { return "admin ★"; }
}

// Usage
$user  = new User("Ratha", "ratha@uni.edu", "pass123");
$admin = new Admin("Dara",  "dara@uni.edu",  "admin99", "IT Dept");

echo $user->describe();   // Ratha <ratha@uni.edu> — user
echo $admin->describe();  // Dara <dara@uni.edu> — admin ★
echo $admin->department;  // IT Dept

// instanceof — Admin is also a User!
var_dump($admin instanceof Admin); // bool(true)
var_dump($admin instanceof User);  // bool(true)
var_dump($admin instanceof User);  // bool(true)
?>`,
    syntax: `// ── Inheritance Syntax ────────────────────
//
//  class A extends B    : A inherits from B
//  parent::__construct(): Call parent constructor
//  public function f()  : Visible everywhere
//  protected $p;        : Visible to child classes
//  private $p;          : Visible only in self
//  parent::f();         : Call parent method
//
// ─────────────────────────────────────────`,
    output:`Ratha <ratha@uni.edu> — user
Dara <dara@uni.edu> — admin ★
IT Dept
bool(true)
bool(true)`,
    tip:"Admin instanceof User = true ─ a child object is always also an instance of the parent. This is polymorphism!",
  },
  {
    num:"13", chapter:"OOP", chapterColor:PURPLE,
    tag:"Abstract & Interface", tagColor:PURPLE, icon:"📜",
    title:"Abstract & Interface",
    subtitle:"abstract class · interface · implements · contracts · polymorphism",
    body:`**Abstract class** ─ cannot instantiate directly ─ defines shared code + forces children to implement abstract methods ─ **IS-A** relationship ។ **Interface** ─ pure contract ─ class can implement **multiple** interfaces ─ **CAN-DO** relationship ។`,
    bullets:[
      {icon:"🏗️",label:"abstract class",    desc:"Has abstract methods (no body) ─ child MUST implement"},
      {icon:"📜",label:"interface",           desc:"Pure contract ─ only method signatures, zero implementation"},
      {icon:"✅",label:"implements",          desc:"class Report implements Printable ─ must provide all methods"},
      {icon:"🔀",label:"Multiple interfaces", desc:"class Foo implements A, B, C ─ unlike extends (only 1 parent)"},
    ],
    code:`<?php
// Abstract Class — partial implementation, forces contract
abstract class Shape {
    abstract public function area(): float;       // no body!
    abstract public function perimeter(): float;  // child MUST implement

    // Concrete shared method — all shapes can use this
    public function describe(): string {
        return sprintf("%s → Area: %.2f | Perimeter: %.2f",
            get_class($this), $this->area(), $this->perimeter());
    }
}

class Circle extends Shape {
    public function __construct(private float $r) {}
    public function area(): float      { return M_PI * $this->r ** 2; }
    public function perimeter(): float { return 2 * M_PI * $this->r; }
}

class Rectangle extends Shape {
    public function __construct(
        private float $w, private float $h) {}
    public function area(): float      { return $this->w * $this->h; }
    public function perimeter(): float { return 2 * ($this->w + $this->h); }
}

// Interface — pure contract (no code, just signatures)
interface Printable  { public function printInfo(): void; }
interface Exportable { public function exportPDF(): string; }

// A class can implement MULTIPLE interfaces
class Report implements Printable, Exportable {
    public function __construct(private string $title) {}
    public function printInfo(): void   { echo "📄 {$this->title}"; }
    public function exportPDF(): string { return "{$this->title}.pdf"; }
}

// Polymorphism — same code works for any Shape
$shapes = [new Circle(5), new Rectangle(4, 6)];
foreach ($shapes as $shape) {
    echo $shape->describe() . " ";
}

$r = new Report("Grade Summary");
$r->printInfo();
echo $r->exportPDF();
echo $r->exportPDF();
?>`,
    syntax: `// ── Abstract & Interface Syntax ───────
//
//  abstract class A { } : Cannot instantiate
//  abstract function f(): Forced to implement
//  interface I { }      : Pure contract
//  class C implements I : Must use all I methods
//  class C implements A,B: Multiple interfaces ok
//
// ─────────────────────────────────────────`,
    output:`Circle → Area: 78.54 | Perimeter: 31.42
Rectangle → Area: 24.00 | Perimeter: 20.00
📄 Grade Summary
Grade Summary.pdf`,
    tip:"Use abstract class for related classes sharing code (IS-A). Use interface for unrelated classes sharing behavior (CAN-DO)!",
  },
  {
    num:"14", chapter:"OOP", chapterColor:PURPLE,
    tag:"Static & Traits", tagColor:PURPLE, icon:"🧩",
    title:"Static, Traits & Magic",
    subtitle:"static · self:: · trait · use · __toString · namespaces",
    body:`**Static** properties/methods belong to the **class itself** ─ not to any instance ─ call with **ClassName::** ─ shared across all instances ─ useful for counters, singletons ។ **Traits** ─ inject reusable code into any class ─ solves multiple inheritance problem ។`,
    bullets:[
      {icon:"⚡",label:"static",        desc:"ClassName::method() ─ no object needed, class-level data"},
      {icon:"🧩",label:"Traits",         desc:"trait Logger { } then use Logger; inside any class body"},
      {icon:"✨",label:"Magic methods",  desc:"__toString() __get() __set() ─ PHP calls these automatically"},
      {icon:"📁",label:"Namespaces",     desc:"namespace App\\Models; ─ organize code, avoid name conflicts"},
    ],
    code:`<?php
// Static — belongs to class, not to any instance
class Counter {
    private static int $count = 0;

    public static function increment(): void { self::$count++; }
    public static function getCount(): int   { return self::$count; }
    public static function reset(): void     { self::$count = 0; }
}

Counter::increment();
Counter::increment();
Counter::increment();
echo Counter::getCount(); // 3
Counter::reset();
echo Counter::getCount(); // 0

// Traits — reusable code blocks, injected into classes
trait Timestampable {
    private string $createdAt;
    public function setCreated(): void {
        $this->createdAt = date('Y-m-d H:i:s');
    }
    public function getCreated(): string {
        return $this->createdAt ?? 'not set';
    }
}

trait Loggable {
    public function log(string $msg): void {
        echo "[LOG " . get_class($this) . "] $msg";
    }
}

class Article {
    use Timestampable, Loggable;  // inject BOTH traits!

    public function __construct(private string $title) {
        $this->setCreated();
    }

    // Magic method — PHP calls this when object used as string
    public function __toString(): string {
        return "'{$this->title}' created: {$this->getCreated()}";
    }
}

$a = new Article("PHP OOP Guide");
echo $a;               // calls __toString automatically
$a->log("Published!"); // from Loggable trait
$a->log("Published!"); // from Loggable trait
?>`,
    syntax: `// ── Static & Traits Syntax ─────────────
//
//  static $p;           : Belong to class
//  self::$p;            : Internal static access
//  Class::$p;           : External static access
//  trait T { ... }      : Reusable code block
//  use T;               : Inject trait into class
//  __toString()         : Auto-call when echo $obj
//
// ─────────────────────────────────────────`,
    output:`3
0
'PHP OOP Guide' created: 2026-03-22 10:00:00
[LOG Article] Published!`,
    tip:"Traits solve the multiple inheritance problem ─ inject the same code into unrelated classes with 'use TraitName;'!",
  },

  // ── WEEK 5: WEB & DATABASE ────────────────────────────────
  {
    num:"15", chapter:"Web & Forms", chapterColor:TEAL,
    tag:"Forms", tagColor:TEAL, icon:"📝",
    title:"Forms (GET & POST)",
    subtitle:"$_GET · $_POST · validate · sanitize · filter_var · XSS",
    body:`PHP handles form submissions via **$_GET** (URL params) and **$_POST** (form body) ។ **NEVER trust user input** ─ always **validate** (check rules) then **sanitize** (clean data) ─ every input is a potential security attack ។`,
    bullets:[
      {icon:"🔍",label:"$_GET",              desc:"?name=Ratha in URL ─ visible, use for search/filters"},
      {icon:"📤",label:"$_POST",             desc:"Form body ─ hidden from URL ─ use for passwords/mutations"},
      {icon:"🛡️",label:"htmlspecialchars()", desc:"< > & → HTML entities ─ prevents XSS attacks"},
      {icon:"✅",label:"filter_var()",        desc:"Validate email, URL, int ─ returns false if invalid"},
    ],
    code:`<!-- HTML Form -->
<form method="POST" action="process.php">
  <input type="text"     name="username"  placeholder="Username">
  <input type="password" name="password"  placeholder="Password">
  <input type="email"    name="email"     placeholder="Email">
  <button type="submit">Register</button>
</form>

<?php
// process.php — Handle POST Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // 1. Read raw input (use ?? for safe default)
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    $email    = $_POST['email']    ?? '';

    // 2. Validate — check business rules
    $errors = [];
    if (empty($username))           $errors[] = "Username required";
    if (strlen($password) < 6)      $errors[] = "Password: min 6 chars";
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format";
    }

    if (!empty($errors)) {
        foreach ($errors as $e) echo "❌ $e\n";
        exit;
    }

    // 3. Sanitize — prevent XSS attacks
    $username = htmlspecialchars(trim($username));
    $email    = htmlspecialchars(trim($email));

    // 4. Hash password — NEVER store plain text!
    $hashed = password_hash($password, PASSWORD_DEFAULT);

    echo "✅ Welcome, $username!\n";
    echo "📧 $email\n";
    echo "🔐 Hash: " . substr($hashed, 0, 25) . "...\n";
}
?>`,
    syntax: `// ── Web Forms Syntax ──────────────────────
//
//  $_POST['key']        : Access hidden form data
//  $_GET['key']         : Access URL parameters
//  htmlspecialchars($s) : Prevent XSS attacks
//  password_hash($p, D) : Securely hash password
//  filter_var($e, F)    : Validate Email/URL
//
// ─────────────────────────────────────────`,
    output:`// Valid: username=Ratha, email=ratha@test.com, pass=secret99
✅ Welcome, Ratha!
📧 ratha@test.com
🔐 Hash: $2y$10$Km9xyZ3abc...

// Invalid: short password + bad email:
❌ Password: min 6 chars
❌ Invalid email format`,
    tip:"NEVER store plain-text passwords! Always password_hash() to store and password_verify() to check login!",
  },
  {
    num:"16", chapter:"Web & Forms", chapterColor:TEAL,
    tag:"Include & Session", tagColor:GREEN, icon:"🔐",
    title:"Include Files & Sessions",
    subtitle:"require_once · partials · session_start · $_SESSION · logout",
    body:`**require_once** ─ include a file once ─ fatal error if missing ─ use for all config/helpers ។ **$_SESSION** ─ store user login state across pages ─ server-side ─ call **session_start()** as very first line ─ before ANY output ។`,
    bullets:[
      {icon:"🔒",label:"require_once",    desc:"Include once ─ FATAL error if missing ─ always prefer this"},
      {icon:"🧩",label:"Partials pattern", desc:"header.php, footer.php, config.php ─ modular reusable structure"},
      {icon:"🗝️",label:"session_start()", desc:"Must be FIRST ─ before any echo, whitespace, or HTML!"},
      {icon:"💾",label:"$_SESSION",       desc:"Store user login state across pages ─ server-side, secure"},
    ],
    code:`<?php
// ── config.php ──────────────────────────────
define('DB_HOST', 'localhost');
define('DB_NAME', 'university_db');
define('APP_NAME', 'UniPortal');
define('VERSION',  '2.0');

// ── header.php ──────────────────────────────
?>
<!DOCTYPE html>
<html><head><title><?= APP_NAME ?></title></head>
<body>
<nav><?= APP_NAME ?> v<?= VERSION ?></nav>
<?php

// ── auth.php — session helper functions ─────
function login(string $name, int $id): void {
    session_start();  // MUST be first!
    $_SESSION['user_id']   = $id;
    $_SESSION['user_name'] = $name;
    $_SESSION['logged_at'] = time();
}

function isLoggedIn(): bool {
    if (session_status() === PHP_SESSION_NONE) session_start();
    return isset($_SESSION['user_id']);
}

function logout(): void {
    session_start();
    session_unset();    // clear all session vars
    session_destroy();  // delete session file
}

function requireLogin(): void {
    if (!isLoggedIn()) {
        header("Location: /login.php");
        exit;
    }
}

// ── index.php — assemble page from parts ────
require_once 'config.php';   // constants
require_once 'header.php';   // HTML header
require_once 'auth.php';     // session functions

login("Ratha", 42);    // simulate login
requireLogin();        // protect the page
echo "<h1>Welcome " . $_SESSION['user_name'] . "!</h1>";
echo "<p>Session ID: " . session_id() . "</p>";
// require_once 'footer.php';
// require_once 'footer.php';
?>`,
    syntax: `// ── Session & Includes Syntax ────────────
//
//  require_once "f.php" : Import file (fatal if missing)
//  include "f.php"      : Import file (warning if missing)
//  session_start()      : MUST be line 1 of file
//  $_SESSION['k'] = v   : Persistent user data
//  session_destroy()    : Clear all session data
//  header("Location: f"): Redirect to new page
//
// ─────────────────────────────────────────`,
    output:`// File structure:
project/
├── config.php       ← DB + App constants
├── auth.php         ← Session helper functions
├── header.php       ← Reusable HTML header
├── footer.php       ← Reusable HTML footer
└── index.php        ← Main page

// Output of index.php:
<!DOCTYPE html>
<html><head><title>UniPortal</title></head>
<body>
<nav>UniPortal v2.0</nav>
<h1>Welcome Ratha!</h1>
<p>Session ID: abc123xyz789...</p>`,
    tip:"session_start() must be the VERY FIRST LINE before any echo, whitespace, or HTML ─ even a blank line breaks it!",
  },
  {
    num:"17", chapter:"Web & Forms", chapterColor:TEAL,
    tag:"Database PDO", tagColor:BLUE, icon:"🗄️",
    title:"MySQL & PDO",
    subtitle:"PDO connect · prepared statements · CRUD · fetch · fetchAll",
    body:`PHP ភ្ជាប់ MySQL ដោយ **PDO** ─ modern, secure, multi-database ។ **Prepared statements** with **?** placeholders ─ NEVER concatenate user input into SQL ─ prevents SQL Injection ─ the most critical security rule in backend development ។`,
    bullets:[
      {icon:"🔌",label:"PDO connect",        desc:"new PDO($dsn, $user, $pass) ─ connect to MySQL"},
      {icon:"🛡️",label:"Prepared statements", desc:"prepare() + execute([$val]) ─ prevents SQL injection"},
      {icon:"📥",label:"fetch()",             desc:"One row ─ for detail/show page (WHERE id = ?)"},
      {icon:"📋",label:"fetchAll()",           desc:"All rows as array ─ for listing/index page"},
    ],
    code:`<?php
// ── Database Connection ──────────────────────
function getDB(): PDO {
    $dsn = "mysql:host=localhost;dbname=university;charset=utf8mb4";
    try {
        return new PDO($dsn, "root", "", [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    } catch (PDOException $e) {
        die("DB Error: " . $e->getMessage());
    }
}

$db = getDB();
echo "Connected!\n";

// ── CREATE (INSERT) ──────────────────────────
// Use ? placeholders — NEVER string concatenation!
$stmt = $db->prepare(
    "INSERT INTO students (name, email, major) VALUES (?, ?, ?)"
);
$stmt->execute(["Ratha", "ratha@uni.edu", "CS"]);
echo "Added! New ID: " . $db->lastInsertId() . "\n";

// ── READ ALL (SELECT) ────────────────────────
$stmt     = $db->query("SELECT * FROM students ORDER BY name");
$students = $stmt->fetchAll();  // returns array of assoc arrays
foreach ($students as $s) {
    echo "{$s['name']} — {$s['major']}\n";
}

// ── READ ONE (SELECT WHERE id) ───────────────
$stmt = $db->prepare("SELECT * FROM students WHERE id = ?");
$stmt->execute([1]);
$student = $stmt->fetch();  // one row or false

if ($student) {
    echo "Found: {$student['name']}\n";
} else {
    http_response_code(404);
    echo "404 Not found!\n";
}

// ── UPDATE ───────────────────────────────────
$stmt = $db->prepare("UPDATE students SET major = ? WHERE id = ?");
$stmt->execute(["Software Engineering", 1]);
echo "Updated: " . $stmt->rowCount() . " row(s)\n";

// ── DELETE ───────────────────────────────────
$stmt = $db->prepare("DELETE FROM students WHERE id = ?");
$stmt->execute([5]);
echo "Deleted!\n";
?>`,
    syntax: `// ── Database PDO Syntax ───────────────────
//
//  new PDO($dsn, u, p)  : Connect to MySQL
//  $db->prepare($sql)   : Create safe template
//  $stmt->execute([$v]) : Send safe data
//  $stmt->fetch()       : Get 1 row (assoc array)
//  $stmt->fetchAll()    : Get all rows (nested array)
//  $db->lastInsertId()  : Get ID of new row
//
// ─────────────────────────────────────────`,
    output:`Connected!
Added! New ID: 3
Dara — Math
Ratha — CS
Sophal — IT
Found: Ratha
Updated: 1 row(s)
Deleted!`,
    tip:"NEVER do: 'WHERE id = ' . $id ─ that is SQL Injection! ALWAYS use ? placeholders with prepare() + execute().",
  },
];

// ── CHAPTER GROUPS for TOC ────────────────────────────────────
const CHAPTERS: ChapterData[] = [
  {name:"Foundations",        color:BLUE,   nums:["01","02","03","04"], icon:"🧱"},
  {name:"Operators & Flow",   color:ORANGE, nums:["05","06","07","08"], icon:"⚙️"},
  {name:"Functions & Arrays", color:PINK,   nums:["09","10"],           icon:"📦"},
  {name:"OOP",                color:PURPLE, nums:["11","12","13","14"], icon:"🏛️"},
  {name:"Web & Database",     color:TEAL,   nums:["15","16","17"],      icon:"🌐"},
];

// ── SYNTAX HIGHLIGHTER ────────────────────────────────────────
const PHP_KW = new Set(["php","echo","print","return","if","else","elseif","foreach","for","while","do","class","extends","implements","interface","abstract","trait","use","new","public","protected","private","static","readonly","function","fn","array","string","int","float","bool","void","null","true","false","require","require_once","include","throw","try","catch","match","const","switch","case","break","continue","die","isset","empty","unset","exit","header","session_start","define","self","parent","sprintf","date"]);
const SQL_KW = new Set(["SELECT","FROM","WHERE","INSERT","INTO","VALUES","UPDATE","SET","DELETE","CREATE","TABLE","ORDER","BY","LIMIT","AND","OR","NOT","IN","IS","NULL","PRIMARY","KEY","FOREIGN","REFERENCES","JOIN","ON"]);

function hl(code: string) {
  return code.split('\n').map((line: string, li: number) => {
    const t = line.trim();
    if (t.startsWith('//') || t.startsWith('#') || t.startsWith('*') || t.startsWith('/*'))
      return <div key={li} style={{color:'#6b8e6b',fontStyle:'italic',minHeight:'1.65em'}}>{line}</div>;
    if (t.startsWith('--'))
      return <div key={li} style={{color:'#6b8e6b',fontStyle:'italic',minHeight:'1.65em'}}>{line}</div>;
    if (/^\s*<[^?]/.test(line))
      return <div key={li} style={{color:'#79c0ff',minHeight:'1.65em'}}>{line}</div>;
    const parts = line.split(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\$[a-zA-Z_]\w*|\b\d+(?:\.\d+)?\b|\b[A-Z_]{2,}\b|\b[a-zA-Z_]\w*\b)/g);
    return (
      <div key={li} style={{minHeight:'1.65em'}}>
        {parts.map((p: string, i: number) => {
          if (!p) return null;
          if (p.startsWith('$'))                    return <span key={i} style={{color:'#ffd700'}}>{p}</span>;
          if (p.startsWith('"')||p.startsWith("'")) return <span key={i} style={{color:'#98d98e'}}>{p}</span>;
          if (PHP_KW.has(p))                        return <span key={i} style={{color:'#ff7b72',fontWeight:700}}>{p}</span>;
          if (SQL_KW.has(p))                        return <span key={i} style={{color:'#ffa07a',fontWeight:700}}>{p}</span>;
          if (/^\d/.test(p))                        return <span key={i} style={{color:'#b19cd9'}}>{p}</span>;
          if (/^[A-Z_]{2,}$/.test(p))               return <span key={i} style={{color:'#56b3d8'}}>{p}</span>;
          return <span key={i} style={{color:'inherit'}}>{p}</span>;
        })}
      </div>
    );
  });
}

// ── CODE PANEL ────────────────────────────────────────────────
function CodePanel({code, output, syntax, accent, theme}: {code: string, output: string | null, syntax?: string | null, accent: string, theme: 'dark' | 'light'}) {
  const [tab, setTab] = useState('code');
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(tab==='code' ? code : tab==='syntax' ? (syntax||'') : (output||''));
    setCopied(true); setTimeout(()=>setCopied(false), 1800);
  };

  const runCode = () => {
    setIsRunning(true);
    setTab('output');
    setTimeout(() => setIsRunning(false), 800);
  };

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',background:'var(--card)',borderRadius:14,overflow:'hidden',border:`1px solid var(--border)`,boxShadow:'0 10px 30px rgba(0,0,0,0.2)'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 16px',borderBottom:`1px solid var(--border)`,background:'var(--header-bg)',flexShrink:0}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{display:'flex',gap:6}}>
            {['#ff5f57','#febc2e','#28c840'].map(c=><div key={c} style={{width:10,height:10,borderRadius:'50%',background:c}}/>)}
          </div>
          <div style={{width:1,height:14,background:'var(--border)',margin:'0 4px'}}/>
          <button 
            onClick={runCode}
            style={{
              display:'flex',alignItems:'center',gap:6,padding:'4px 10px',borderRadius:6,border:'none',
              background:isRunning ? '#28c84030' : ACCENT, 
              color:'#000',fontSize:9,fontWeight:900,fontFamily:'Space Mono,monospace',
              transition:'all 0.2s', transform: isRunning ? 'scale(0.95)' : 'none'
            }}
          >
            {isRunning ? 'RUNNING...' : 'RUN CODE ▶'}
          </button>
        </div>

        <div style={{display:'flex',background:'#000',borderRadius:8,padding:3,gap:2,border:'1px solid var(--border)'}}>
          {[['code','PHP'],['syntax','SYNTAX'],['output','OUTPUT']].map(([v,lbl])=>(
            (v !== 'syntax' || syntax) && (
              <button 
                key={v} 
                onClick={()=>setTab(v)} 
                style={{
                  padding:'5px 14px',borderRadius:6,border:'none',
                  background:tab===v ? (theme==='dark'?'#222':'#eee') : 'transparent',
                  color:tab===v ? accent : 'var(--dim)',
                  fontSize:9,fontWeight:800,fontFamily:'Space Mono,monospace',
                  transition:'all 0.15s'
                }}
              >
                {lbl}
              </button>
            )
          ))}
        </div>

        <button onClick={copy} style={{background:'none',border:'none',color:copied?GREEN:'var(--dim)',fontSize:10,fontWeight:700,fontFamily:'Space Mono,monospace',display:'flex',alignItems:'center',gap:4}}>
          {copied ? '✓ COPIED' : 'COPY'}
        </button>
      </div>

      <div style={{flex:1,overflow:'auto',padding:0,position:'relative',background:tab==='output'?'#050505':'transparent'}}>
        {isRunning && (
          <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.4)',zIndex:5,display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(2px)'}}>
            <div style={{fontFamily:'Space Mono,monospace',fontSize:12,color:ACCENT,animation:'pulse 1s infinite'}}>executing php runtime...</div>
          </div>
        )}
        
        <div style={{padding:'20px 24px'}}>
          {tab==='code'
            ? <pre style={{margin:0,fontFamily:'Space Mono,monospace',fontSize:12.5,lineHeight:1.75}}>{hl(code)}</pre>
            : tab==='syntax'
              ? <pre style={{margin:0,fontFamily:'Space Mono,monospace',fontSize:12.5,lineHeight:1.75,color:accent,whiteSpace:'pre-wrap'}}>{syntax}</pre>
              : <div>
                  <div style={{fontFamily:'Space Mono,monospace',fontSize:10,color:accent,opacity:0.6,marginBottom:15,borderBottom:'1px solid #222',paddingBottom:8,display:'flex',justifyContent:'space-between'}}>
                    <span>TERMINAL — PHP 8.3.4</span>
                    <span>{new Date().toLocaleTimeString()}</span>
                  </div>
                  <pre style={{margin:0,fontFamily:'Space Mono,monospace',fontSize:12.5,lineHeight:1.75,color:GREEN,whiteSpace:'pre-wrap'}}>
                    <span style={{color:accent,marginRight:10}}>$ php runtime.php</span>
                    {'\n'}{output||'(no output)'}
                    {'\n\n'}<span style={{color:accent,animation:'blink 1s infinite'}}>_</span>
                  </pre>
                </div>
          }
        </div>
      </div>
    </div>
  );
}

// ── BULLET CARD ───────────────────────────────────────────────
function BulletCard({bullet, accent}: {bullet: Bullet, accent: string}) {
  return (
    <div style={{display:'flex',gap:10,padding:'10px 12px',background:'var(--card)',border:`1px solid var(--border)`,borderRadius:9,alignItems:'flex-start'}}>
      <div style={{width:30,height:30,borderRadius:7,flexShrink:0,background:accent+'15',border:`1px solid ${accent}25`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontFamily:'Space Mono,monospace',color:accent,fontWeight:700}}>{bullet.icon}</div>
      <div>
        <div style={{fontFamily:'Space Mono,monospace',fontSize:11,color:accent,fontWeight:700,marginBottom:2}}>{bullet.label}</div>
        <div style={{fontSize:12,color:'var(--dim)',lineHeight:1.5}}>{bullet.desc}</div>
      </div>
    </div>
  );
}

// ── SLIDE ─────────────────────────────────────────────────────
function Slide({slide, current, total, onNext, onPrev, theme, toggleTheme}: {
  slide: SlideData,
  current: number,
  total: number,
  onNext: () => void,
  onPrev: () => void,
  theme: 'dark' | 'light',
  toggleTheme: () => void
}) {
  const accent = slide.tagColor;
  const rb = (t: string) => t.split(/\*\*(.*?)\*\*/g).map((p: string, i: number) =>
    i%2===1 ? <strong key={i} style={{color:accent}}>{p}</strong> : <span key={i}>{p}</span>
  );
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      {/* Top bar */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 22px',borderBottom:`1px solid var(--border)`,flexShrink:0,background:'var(--header-bg)'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontSize:18,marginRight:2}}>{slide.icon}</span>
          <span style={{fontFamily:'Space Mono,monospace',fontSize:13,fontWeight:700,color:ACCENT}}>PHP<span style={{color:'var(--ink)'}}>_</span>101</span>
          <span style={{color:'var(--border)'}}>│</span>
          <span style={{padding:'2px 8px',borderRadius:4,background:slide.chapterColor+'18',border:`1px solid ${slide.chapterColor}30`,color:slide.chapterColor,fontSize:9,fontFamily:'Space Mono,monospace',fontWeight:700,letterSpacing:'0.07em'}}>
            {slide.chapter}
          </span>
          <span style={{padding:'2px 8px',borderRadius:4,background:accent+'12',border:`1px solid ${accent}25`,color:accent,fontSize:9,fontFamily:'Space Mono,monospace',fontWeight:700}}>
            {slide.tag}
          </span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <button 
            onClick={toggleTheme}
            style={{
              display:'flex', alignItems:'center', gap:6, padding:'5px 10px',
              borderRadius:6, border:`1px solid var(--border)`,
              background:'var(--card)', color:theme === 'dark' ? ACCENT : '#000',
              fontFamily:'Space Mono,monospace', fontSize:9, fontWeight:700
            }}
          >
            <Monitor size={12}/>
            {theme.toUpperCase()}
          </button>
          <div style={{display:'flex',gap:3}}>
            {SLIDES.map((_,i)=>(
              <div key={i} style={{width:i===current?16:4,height:4,borderRadius:3,background:i===current?accent:i<current?accent+'40':(theme === 'dark' ? '#1e1e1e' : '#e0e0e0'),transition:'all 0.3s'}}/>
            ))}
          </div>
          <span style={{fontFamily:'Space Mono,monospace',fontSize:10,color:'var(--dim)'}}>{slide.num}/{String(total).padStart(2,'0')}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{flex:1,display:'flex',overflow:'hidden'}}>
        {/* LEFT */}
        <div style={{width:'38%',minWidth:290,padding:'22px 22px 14px',overflowY:'auto',borderRight:'1px solid var(--border)',display:'flex',flexDirection:'column',gap:16}}>
          <div>
            <h1 style={{fontFamily:'DM Serif Display,serif',fontSize:32,fontWeight:400,color:'var(--ink)',lineHeight:1.1,margin:'0 0 5px'}}>{slide.title}</h1>
            <p style={{fontFamily:'Space Mono,monospace',fontSize:9.5,color:'var(--dim)',margin:0}}>{slide.subtitle}</p>
          </div>
          <p style={{fontSize:13,lineHeight:1.75,color:theme === 'dark' ? '#bbb' : '#444',fontFamily:"'Noto Sans Khmer',sans-serif",margin:0}}>
            {rb(slide.body)}
          </p>
          <div style={{display:'grid',gridTemplateColumns:slide.bullets.length>4?'1fr 1fr':'1fr',gap:6}}>
            {slide.bullets.map((b,i)=><BulletCard key={i} bullet={b} accent={accent}/>)}
          </div>
          {/* Tip */}
          <div style={{marginTop:'auto',padding:'11px 13px',borderRadius:9,background:accent+'08',border:`1px solid ${accent}22`,display:'flex',gap:8,alignItems:'flex-start'}}>
            <span style={{fontSize:14,flexShrink:0}}>💡</span>
            <p style={{fontSize:11.5,lineHeight:1.6,color:accent+'cc',margin:0,fontFamily:"'Noto Sans Khmer',sans-serif"}}>{slide.tip}</p>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{flex:1,padding:16,background:'rgba(0,0,0,0.22)',display:'flex',flexDirection:'column'}}>
          {slide.code
            ? <CodePanel code={slide.code} output={slide.output} syntax={slide.syntax} accent={accent} theme={theme}/>
            : slide.concept
              ? <div style={{flex:1,background:'var(--header-bg)',border:'1px solid var(--border)',borderRadius:14,padding:'36px',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <pre style={{fontFamily:'Space Mono,monospace',fontSize:13,lineHeight:2.2,color:theme === 'dark' ? '#3a5a3a' : '#226b22',textAlign:'left',whiteSpace:'pre',margin:0}}>{slide.concept}</pre>
                </div>
              : null
          }
        </div>
      </div>

      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'11px 22px',borderTop:`1px solid var(--border)`,flexShrink:0,background:'var(--bg)'}}>
        <button onClick={onPrev} disabled={current===0} style={{padding:'8px 16px',borderRadius:7,border:`1px solid var(--border)`,background:current===0?'transparent':'var(--card)',color:current===0?'var(--border)':'var(--dim)',fontFamily:'Space Mono,monospace',fontSize:10}}>← PREV</button>
        <span style={{fontFamily:'Space Mono,monospace',fontSize:9,color:'var(--border)'}}>← → arrow keys · Esc = menu</span>
        <button onClick={onNext} style={{padding:'8px 20px',borderRadius:7,border:'none',background:accent,color:'#000',fontFamily:'Space Mono,monospace',fontSize:10,fontWeight:700}}>
          {current===total-1?'RESTART ↺':'NEXT →'}
        </button>
      </div>
    </div>
  );
}

// ── TABLE OF CONTENTS ─────────────────────────────────────────
function TOC({onStart, onGoTo, theme, toggleTheme}: {onStart: () => void, onGoTo: (idx: number) => void, theme: 'dark' | 'light', toggleTheme: () => void}) {
  return (
    <div style={{height:'100%',overflow:'auto',display:'flex',flexDirection:'column',alignItems:'center',padding:'36px 24px 28px'}}>
      <div style={{textAlign:'center',marginBottom:36, position: 'relative'}}>
        {/* Theme Toggle in Header/Hero */}
        <button 
          onClick={toggleTheme}
          style={{
            position: 'absolute', top: -10, right: 0,
            padding: '8px 12px', borderRadius: 8,
            border: `1px solid var(--border)`,
            background: theme === 'dark' ? 'transparent' : '#000',
            color: theme === 'dark' ? 'var(--ink)' : '#fff',
            fontFamily: 'Space Mono,monospace', fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 8
          }}
        >
          <Monitor size={14} />
          {theme === 'dark' ? 'PROJECTOR MODE' : 'DARK MODE'}
        </button>
        <div style={{fontFamily:'Space Mono,monospace',fontSize:10,color:ACCENT,letterSpacing:'0.2em',marginBottom:12,textTransform:'uppercase'}}>University Course · 17 Lessons</div>
        <h1 style={{fontFamily:'DM Serif Display,serif',fontSize:52,fontWeight:400,color:'var(--ink)',lineHeight:1.05,margin:'0 0 12px'}}>
          PHP<br/><em style={{color:ACCENT}}>Programming</em>
        </h1>
        <p style={{fontFamily:'Space Mono,monospace',fontSize:10,color:'var(--dim)',maxWidth:400,lineHeight:1.8}}>
          Step-by-step: Foundations → Operators → Functions → Arrays → OOP → Web → Database
        </p>
      </div>

      <div style={{width:'100%',maxWidth:900,display:'flex',flexDirection:'column',gap:22,marginBottom:32}}>
        {CHAPTERS.map(ch => (
          <div key={ch.name}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:9}}>
              <div style={{width:3,height:16,background:ch.color,borderRadius:2}}/>
              <span style={{fontSize:16,marginRight:2}}>{ch.icon}</span>
              <span style={{fontFamily:'Space Mono,monospace',fontSize:10,fontWeight:700,color:ch.color,letterSpacing:'0.08em'}}>{ch.name}</span>
              <div style={{flex:1,height:1,background:'var(--border)'}}/>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(185px,1fr))',gap:7}}>
              {ch.nums.map(num => {
                const s = SLIDES.find(sl=>sl.num===num);
                if (!s) return null;
                const idx = SLIDES.indexOf(s);
                return (
                  <button key={num} onClick={()=>onGoTo(idx)}
                    style={{display:'flex',alignItems:'center',gap:10,padding:'10px 11px',background:'var(--card)',border:`1px solid var(--border)`,borderRadius:8,cursor:'pointer',textAlign:'left',transition:'all 0.18s'}}
                    onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) =>{e.currentTarget.style.borderColor=ch.color+'65';e.currentTarget.style.background=ch.color+'09';}}
                    onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) =>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.background='var(--card)';}}
                  >
                    <div style={{width:32,height:32,borderRadius:6,background:ch.color+'20',color:ch.color,fontFamily:'Space Mono,monospace',fontSize:10,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,position:'relative'}}>
                      <span style={{position:'absolute',top:2,left:4,fontSize:8,opacity:0.6}}>{s.num}</span>
                      <span style={{fontSize:16}}>{s.icon}</span>
                    </div>
                    <div>
                      <div style={{fontSize:11,fontWeight:700,color:'var(--ink)',fontFamily:'Space Mono,monospace',lineHeight:1.2}}>{s.title}</div>
                      <div style={{fontSize:9,color:'var(--dim)',marginTop:2}}>{s.tag}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button onClick={onStart} style={{padding:'13px 44px',borderRadius:8,border:'none',background:ACCENT,color:'#000',fontFamily:'Space Mono,monospace',fontSize:12,fontWeight:700,letterSpacing:'0.06em'}}>
        START FROM LESSON 01 →
      </button>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────
export default function PHPSlides() {
  const [screen,  setScreen]  = useState('toc');
  const [current, setCurrent] = useState(0);
  const [dir,     setDir]     = useState(1);
  const [theme,   setTheme]   = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');


  const goTo = useCallback((idx: number) => {
    setDir(idx>current?1:-1); setCurrent(idx); setScreen('slide');
  }, [current]);

  const next = useCallback(() => {
    if (current<SLIDES.length-1){setDir(1);setCurrent(c=>c+1);}
    else {setScreen('toc');setCurrent(0);}
  }, [current]);

  const prev = useCallback(() => {
    if (current>0){setDir(-1);setCurrent(c=>c-1);}
  }, [current]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (screen!=='slide') return;
      if (e.key==='ArrowRight') next();
      if (e.key==='ArrowLeft')  prev();
      if (e.key==='Escape')     setScreen('toc');
    };
    window.addEventListener('keydown',h);
    return ()=>window.removeEventListener('keydown',h);
  }, [screen,next,prev]);

  const slide = SLIDES[current]!;

  return (
    <div style={{width:'100%',height:'100vh',background:'var(--bg)',color:'var(--ink)',overflow:'hidden',fontFamily:"'Noto Sans Khmer','Inter',sans-serif"}}>
      <style>{GLOBAL_STYLE(theme)}</style>
      {/* grid texture */}
      <div style={{position:'fixed',inset:0,opacity:theme === 'dark' ? 0.02 : 0.05,pointerEvents:'none',backgroundImage:`linear-gradient(${theme === 'dark' ? '#fff' : '#000'} 1px,transparent 1px),linear-gradient(90deg,${theme === 'dark' ? '#fff' : '#000'} 1px,transparent 1px)`,backgroundSize:'32px 32px'}}/>
      {/* accent glow */}
      {screen==='slide'&&(
        <div style={{position:'fixed',inset:0,pointerEvents:'none',transition:'background 0.6s',background:`radial-gradient(ellipse at 75% 15%, ${slide.tagColor}10 0%, transparent 55%)`}}/>
      )}
      <AnimatePresence mode="wait">
        {screen==='toc' ? (
          <motion.div key="toc" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.2}} style={{position:'absolute',inset:0,zIndex:10}}>
            <TOC onStart={()=>{setCurrent(0);setScreen('slide');}} onGoTo={goTo} theme={theme} toggleTheme={toggleTheme}/>
          </motion.div>
        ) : (
          <motion.div key={`s${current}`} initial={{opacity:0,x:dir*20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-dir*20}} transition={{duration:0.2,ease:[0.32,0.72,0,1]}} style={{position:'absolute',inset:0,zIndex:10}}>
            <Slide slide={slide} current={current} total={SLIDES.length} onNext={next} onPrev={prev} theme={theme} toggleTheme={toggleTheme}/>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}