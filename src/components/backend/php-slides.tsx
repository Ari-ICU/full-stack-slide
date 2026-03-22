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
    --dim: ${theme === 'dark' ? '#a0a0a0' : '#888888'};
    --ink: ${theme === 'dark' ? '#ffffff' : '#000000'};
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

const ACCENT = "#e8ff47", GREEN = "#4ade80", BLUE = "#38bdf8";
const PINK = "#f472b6", ORANGE = "#fb923c", PURPLE = "#a78bfa", TEAL = "#2dd4bf", RED = "#f87171";

// ─────────────────────────────────────────────────────────────
interface Lab {
  title: string;
  titleKh: string;
  duration: string;
  objective: string;
  steps: string[];
  code: string;
  output: string;
}

interface Bullet {
  icon: string;
  label: string;
  desc: string;
}

interface ExplanationStep {
  title: string;
  desc: string;
  targetLine?: number; // Highlight specific line
}

interface SlideData {
  num: string;
  chapter: string;
  chapterColor: string;
  tag: string;
  tagColor: string;
  icon: string;
  title: string;
  subtitle: string;
  body: string;
  bullets: Bullet[];
  code: string | null;
  concept?: string | null;
  syntax?: string | null;
  workflow?: string | null;
  explanation?: ExplanationStep[]; // New field for animated explanations
  output: string | null;
  tip: string;
  lab?: Lab | null;
}

interface ChapterData {
  name: string;
  color: string;
  nums: string[];
  icon: string;
}

// ─────────────────────────────────────────────────────────────
const SLIDES: SlideData[] = [
  {
    num: "01", chapter: "Foundations", chapterColor: BLUE,
    tag: "Intro", tagColor: BLUE, icon: "🖥️",
    title: "What's PHP ? ",
    subtitle: "Server-side Processing · Hypertext Preprocessor · Backend Logic",
    body: `**PHP** is the engine of the web. មិនដូច JavaScript ដែលដើរលើ Browser, PHP ដំណើរការនៅលើ **Server** ។ វាទទួលយក Request, គណនា Logic, និងបង្កើតជា **HTML** ដើម្បីផ្ញើទៅកាន់ Browser វិញ។ នេះជាមូលដ្ឋានគ្រឹះនៃ Dynamic Website ។`,
    bullets: [
      { icon: "🛡️", label: "Server-side", desc: "Code processes on your hardware/cloud, not the user's laptop." },
      { icon: "📦", label: "Runtime", desc: "PHP transforms raw scripts into valid HTML strings for visitors." },
      { icon: "⚙️", label: "Backend Power", desc: "Handles Databases, Files, Sessions, and API integrations." },
      { icon: "📈", label: "Industry standard", desc: "Powers 77%+ of the internet including WordPress & Laravel." },
    ],
    explanation: [
      { title: "Browser Request", desc: "User វាយ URL (ឧទាហរណ៍: facebook.com) ។ Browser ផ្ញើ Request ទៅកាន់ Server តាមរយៈ HTTP ។" },
      { title: "Server Action", desc: "Server (Nginx/Apache) ទទួលយក Request រួចហៅ PHP Engine ឲ្យដំណើរការ Code ក្នុង File .php នោះ។" },
      { title: "HTML Generation", desc: "PHP គណនា Logic រួចបង្កើតជា HTML Output ។ Server បញ្ជូន HTML ត្រឡប់ទៅ User វិញ។" },
      { title: "User View", desc: "Browser ទទួលយកតែ HTML/CSS ប៉ុណ្ណោះ ─ User មិនអាចមើលឃើញកូដ PHP ដើមឡើយ។" }
    ],
    code: `<?php
/**
 * PHP Request/Response Lifecycle
 * Level: Academic Overview
 */

echo "PHP Version: " . PHP_VERSION . " ";
echo "Server Node: " . php_uname('n') . " ";
echo "Generated at: " . date("H:i:s") . " UTC";

// This string is sent to the client as clean HTML
echo "<h1>Hello from the Backend! 🚀</h1>";
?>`,
    output: `PHP Version: 8.3.4
Server Node: local-runtime-env
Generated at: 13:50:42 UTC
<h1>Hello from the Backend! 🚀</h1>`,
    syntax: `// ── PHP Core Syntax ────────────────────────
//
//  echo        : Command to output data
//  PHP_VERSION : Global constant for engine version
//  date()      : Function for system timestamps
//  .           : String concatenation operator
//  "" vs ''    : Double quotes allow $variables
//
// ──────────────────────────────────────────`,
    tip: "PHP គឺជា 'Preprocessor' ─ វាមានន័យថាវាបំប្លែង Script របស់អ្នកទៅជា HTML មុនពេលវាទៅដល់ភ្នែករបស់ User!",
    workflow: `// ── Execution Workflow ────────────────────
//
// 1. Request: Browser calls server (ហៅទៅកាន់ server)
// 2. Parser: PHP engine starts (engine ចាប់ផ្ដើមអានកូដ)
// 3. Logic: Database/Math processed (ដំណើរការ logic)
// 4. Buffer: HTML output generated (បង្កើតជា HTML)
// 5. Response: Sent back to client (បញ្ជូនទៅកាន់ client)
//
// ──────────────────────────────────────────`,
  },
  {
    num: "02", chapter: "Foundations", chapterColor: BLUE,
    tag: "Execution", tagColor: GREEN, icon: "🚀",
    title: "Syntax & Anatomy",
    subtitle: "Directives · Semicolons · Tags · Code Blocks",
    body: `កូដ PHP ត្រូវតែស្ថិតនៅក្នុង **<?php ... ?>** tags ។ Statement នីមួយៗត្រូវតែបញ្ចប់ដោយ **semicolon ( ; )** ជានិច្ច ។ ប្រសិនបើអ្នកភ្លេចបិទ semicolon, PHP នឹងឈប់ដំណើរការភ្លាមៗ (Fatal Error) ។`,
    bullets: [
      { icon: "🏷️", label: "Open Tags", desc: "PHP mode starts with <?php and optionally ends with ?>" },
      { icon: "📢", label: "Output Directives", desc: "echo for data strings, print for single expressions." },
      { icon: "🔚", label: "Semicolon", desc: "Required sentence terminator for every PHP command line." },
      { icon: "📄", label: "Commentary", desc: "// Single line, # shell style, and /* Multi line */ blocks." },
    ],
    explanation: [
      { title: "The Entry Point", desc: "PHP Engine ស្វែងរក <?php tag ដើម្បីចាប់ផ្ដើមបកស្រាយកូដនៅក្នុង File ។" },
      { title: "Processing Commands", desc: "Engine អានកូដពីលើចុះក្រោម បន្ទាត់នីមួយៗត្រូវបញ្ចប់ដោយ semicolon (;) ។" },
      { title: "HTML Hybrid", desc: "អ្នកអាចសរសេរ PHP លាយជាមួយ HTML បាន ─ Engine នឹងប្តូរ Mode ទៅតាម Tag កូដ។" },
      { title: "The Exit Signal", desc: "Tag ?> ប្រាប់បញ្ឈប់ PHP Mode ─ ចាប់ពីទីនេះទៅគឺ HTML សុទ្ធសាធ។" }
    ],
    code: `<?php
// Traditional echo
echo "Modern Backend Development";

// Shorthand syntax (used inside HTML templates)
# Result: <h2>Hello</h2>
?>
<h2><?= "Hello Studies" ?></h2>

<?php
/* Double quotes support variable 
   interpolation and escaping */
echo "I'm learning \"PHP\""; 

// Missing semicolon here would cause an error:
echo "This works because it has a semicolon";
?>`,
    syntax: `// ── Syntax Standards ────────────────────────
//
//  <?php ... ?> : Full PHP block
//  <?= ... ?>   : Shorthand echo (Echo Tag)
//  ;            : Mandatory Line Terminator ⚠️
//  //           : Inline Comment
//  /* ... */    : Documentation Block
//
// ──────────────────────────────────────────`,
    output: `Modern Backend Development
<h2>Hello Studies</h2>
I'm learning "PHP"
This works because it has a semicolon`,
    tip: "ក្នុង File ដែលមានតែ PHP សុទ្ធ (ដូចជា Controller), គេមិនដែលដាក់ Tag បិទ ?> ទេ ដើម្បីការពារបញ្ហា Whitespace Error!",
    workflow: `// ── Tag Lifecycle ─────────────────────────
//
// 1. Search: Find opening tag (ស្វែងរក tag បើក)
// 2. Interpret: Process script (បកស្រាយកូដ)
// 3. Output: Write to buffer (សរសេរចូល buffer)
// 4. Close: End at closing tag (ឈប់ត្រឹម tag បិទ)
// 5. Raw: Render HTML outside (បង្ហាញ HTML ធម្មតា)
//
// ──────────────────────────────────────────`,
  },
  {
    num: "03", chapter: "Foundations", chapterColor: BLUE,
    tag: "Core Data", tagColor: ORANGE, icon: "📦",
    title: "Variables & State",
    subtitle: "Memory Containers · Case Sensitivity · Naming Conventions",
    body: `**Variable** គឺជាឈ្មោះដែលយើងដាក់ឲ្យ Memory សម្រាប់រក្សាទុកទិន្នន័យ ។ ក្នុង PHP, វាត្រូវតែចាប់ផ្ដើមដោយ **$** ជានិច្ច ។ PHP គឺជា **Dynamically Typed**, មានន័យថាយើងមិនបាច់ប្រាប់ប្រភេទ data (int/string) មុនឡើយ ។`,
    bullets: [
      { icon: "$", label: "The Prefix", desc: "Every variable requires a dollar sign prefix (e.g. $user)." },
      { icon: "🔠", label: "Case-Sensitive", desc: "$user and $USER are different memory locations." },
      { icon: "📝", label: "Valid Names", desc: "Must start with a letter or underscore, never a number." },
      { icon: "🧳", label: "Dynamic Typing", desc: "One variable can store a string, then later an integer." },
    ],
    explanation: [
      { title: "Allocation", desc: "នៅពេលអ្នកសរសេរ $x = 10, PHP រៀបចំកន្លែងក្នុង Memory រក្សាទុកតម្លៃ 10 ។" },
      { title: "Variable Access", desc: "គ្រប់ពេលដែលអ្នកហៅ $x, Engine ទៅទាញយកតម្លៃ 10 ចេញពី Memory មកប្រើ។" },
      { title: "Dynamic Nature", desc: "អ្នកអាចប្ដូរ $x = 'PHP' បានភ្លាមៗ ─ PHP នឹងប្តូរប្រភេទ Data ដោយស្វ័យប្រវត្តិ។" },
      { title: "Debugging State", desc: "ប្រើ var_dump($x) ដើម្បីមើលព័ត៌មានលម្អិតទាំង Value និង Data Type ។" }
    ],
    code: `<?php
// Initialization
$username = "ratha_dev"; // String
$age      = 22;          // Integer
$isActive = true;        // Boolean

// Naming standards (CamelCase or Snake_case)
$total_price = 105.50; 
$isAdmin     = false;

// Variable expansion in double quotes
echo "Profile: $username (Age: $age)";

// Strict Debugging
var_dump($total_price); // float(105.5)
var_dump($isAdmin);     // bool(false)

// Re-assignment (Dynamic)
$score = 10;
$score = "Ten"; // Valid in PHP
?>`,
    syntax: `// ── Variable Rules ──────────────────────────
//
//  $variable = v : Assign value (starts with $)
//  var_dump($v)  : Deep inspection (debug)
//  "Hello $v"    : String interpolation
//  'Hello $v'    : Literal string (no expansion)
//  gettype($v)   : Get data type name
//
// ──────────────────────────────────────────`,
    output: `Profile: ratha_dev (Age: 22)
float(105.5)
bool(false)
(score changed from int to string)`,
    tip: "ចូរប្រើ var_dump() ជាឧបករណ៍ចម្បងក្នុងពេល Debug ព្រោះវាប្រាប់យើងគ្រប់យ៉ាង ទាំងផ្ទាំងទិន្នន័យ និងប្រភេទរបស់វា!",
    workflow: `// ── State Management Flow ──────────────────
//
// 1. Declare: Define name with $ (បង្កើតឈ្មោះ)
// 2. Assign: Put value into memory (ដាក់តម្លៃចូល)
// 3. Reference: Use value in code (យកតម្លៃមកប្រើ)
// 4. Mutate: Overwrite with new (ប្ដូរតម្លៃថ្មី)
// 5. Inspect: var_dump for check (ឆែកលទ្ធផល)
//
// ──────────────────────────────────────────`,
  },
  {
    num: "04", chapter: "Foundations", chapterColor: BLUE,
    tag: "Data Types", tagColor: PINK, icon: "📝",
    title: "Data Type ",
    subtitle: "Scalar · Compound · Special · Type Casting",
    body: `PHP គឺជា **Weakly Typed** language ប៉ុន្តែវាមាន Data Type ច្បាស់លាស់ ។ យើងបែងចែកវាជា ៣ ក្រុមធំៗ: **Scalar** (តម្លៃទោល), **Compound** (សំណុំតម្លៃ), និង **Special** (តម្លៃពិសេសដូចជា NULL) ។`,
    bullets: [
      { icon: "🔢", label: "Integers & Floats", desc: "Whole numbers (42) and decimals (3.14) for math." },
      { icon: "📝", label: "Strings", desc: "Sequence of characters 'Hello' - used for text data." },
      { icon: "✅", label: "Booleans", desc: "Logic states: true or false - used in conditions." },
      { icon: "📦", label: "Compound", desc: "Arrays and Objects - for complex data structures." },
    ],
    explanation: [
      { title: "Type Detection", desc: "PHP សម្គាល់ប្រភេទ Data ដោយស្វ័យប្រវត្តិតាមរយៈតម្លៃដែលអ្នកដាក់ឲ្យវា ($x = 5 ─ integer)។" },
      { title: "Type Juggling", desc: "PHP អាចបំប្លែង Type ភ្លាមៗ (ឧទាហរណ៍: យក String '5' ទៅបូកលេខ ─ វានឹងក្លាយជាលេខបូកលេខ)។" },
      { title: "Explicit Casting", desc: "អ្នកអាចបង្ខំ Type ដោយប្រើ (int), (string), ឬ (bool) នៅពីមុខ Variable ។" },
      { title: "Inspection", desc: "ប្រើ gettype() ដើម្បីដឹងពីប្រភេទបច្ចេកទេស ឬ var_dump() ដើម្បីមើលយ៉ាងស៊ីជម្រៅ។" }
    ],
    code: `<?php
// Scalar Types
$name   = "Ratha";  // string
$points = 95;       // integer
$price  = 12.99;    // double (float)
$isPaid = true;     // boolean

// Compound & Special
$items = ["A", "B"]; // array
$none  = null;       // NULL


?>`,
    output: ` `,
    syntax: `// ── Type Casting Syntax ───────────────────
//
//  (int)$v    : To Integer
//  (string)$v : To String
//  (bool)$v   : To Boolean
//  gettype()  : Return type string
//  is_int()   : Check if integer (bool)
//
// ──────────────────────────────────────────`,
    tip: "PHP តែងតែហៅ Float ថា 'double' នៅក្នុង gettype() ─ កុំបារម្ភ វាគឺជាប្រភេទលេខក្បៀសដូចគ្នា!",
    workflow: `// ── Type Lifecycle ───────────────────────
//
// 1. Assign: Value enters system (បញ្ចូលតម្លៃ)
// 2. Detect: PHP identifies type (កំណត់ប្រភេទ)
// 3. Juggling: Auto-conversion if needed (បំប្លែងអូតូ)
// 4. Casting: Forced conversion by dev (បំប្លែងដោយដៃ)
// 5. Validation: Check before logic (ពិនិត្យប្រភេទ)
//
// ──────────────────────────────────────────`,
  },
  {
    num: "04-L", chapter: "Foundations", chapterColor: BLUE,
    tag: "Practice", tagColor: GREEN, icon: "🧪",
    title: "Lab: Your First Script",
    subtitle: "Hands-on Scripting · Variables · Output",
    body: `ក្នុងលំហាត់នេះ យើងនឹងអនុវត្តការសរសេរ Script PHP ដំបូងបង្អស់របស់អ្នក។ អ្នកនឹងរៀនពីរបៀបបង្ហាញព័ត៌មាន Profile និងប្រើប្រាស់ Variable ឱ្យបានត្រឹមត្រូវបំផុតតាមលក្ខណៈបច្ចេកទេស។`,
    bullets: [
      { icon: "📄", label: "File Structure", desc: "Start with <?php tag and end with correct semicolon." },
      { icon: "🛠️", label: "Variable Declaration", desc: "Define name, age, and skill variables with proper types." },
      { icon: "📡", label: "Output Formatting", desc: "Use double quotes for variable expansion in echo." },
      { icon: "🔍", label: "Validation", desc: "Use gettype() to verify your data storage." },
    ],
    lab: {
      title: "Creating a Personal Profile Script",
      titleKh: "ការបង្កើត Script បង្ហាញព័ត៌មានផ្ទាល់ខ្លួន",
      duration: "20 min",
      objective: "Set up a script that stores and displays user data using variables.",
      steps: [
        "Create variables: $name (string), $age (int), $isStudent (bool).",
        "Echo a greeting using the name variable.",
        "Print a sentence about your age.",
        "Toggle $isStudent and var_dump it to see the change."
      ],
      code: `<?php
// Define my profile variables
$name      = "Ratha";
$age       = 24;
$isStudent = true;

echo "Hello, my name is $name \n";
echo "I am $age years old. \n";

// Show internal data type
var_dump($isStudent);
?>`,
      output: `Hello, my name is Ratha
I am 24 years old.
bool(true)`
    },
    code: `<?php
echo "Ready to start the lab!";
?>`,
    output: `Ready to start the lab!`,
    tip: "ចចងចាំថា PHP មិនបង្ហាញ Variable ក្នុង 'Single Quotes' ទេ! អ្នកត្រូវតែប្រើ \"Double Quotes\" ដើម្បីឱ្យវាដំណើរការ!",
  },
  {
    num: "05", chapter: "Operators & Flow", chapterColor: ORANGE,
    tag: "Operators", tagColor: ORANGE, icon: "➕",
    title: "Logic & Math",
    subtitle: "Arithmetic · Comparison · Strict Equality · Coalescing",
    body: `**Operators** ប្រើសម្រាប់អនុវត្តការងារលើ Variable ។ ចំណុចសំខាន់បំផុតគឺ **=== (Strict Equality)** ─ វាឆែកទាំង **Value** និង **Type** ដើម្បីការពារកំហុស Logic (Type Juggling) ដែលតែងតែកើតមានក្នុង PHP ។`,
    bullets: [
      { icon: "➕", label: "Arithmetic", desc: "+, -, *, /, % (modulo), ** (power)." },
      { icon: "⚖️", label: "Strict Compare", desc: "=== and !== are safer than == and != in PHP." },
      { icon: "🔗", label: "Logical", desc: "&& (AND), || (OR), ! (NOT) for complex conditions." },
      { icon: "⚡", label: "Coalescing ??", desc: "Returns first value if exists/not-null, else the fallback." },
    ],
    explanation: [
      { title: "Math Power", desc: "PHP គាំទ្រការគណនាគ្រប់ប្រភេទ រួមទាំង Modulo (%) និងស្វ័យគុណ (**) ។" },
      { title: "The '===' Rule", desc: "ប្រើ === ជានិច្ច! ព្រោះ 0 == 'false' អាចនឹង true ក្នុង PHP ចាស់ៗ ─ វគ្រោះថ្នាក់ណាស់។" },
      { title: "Null Safety", desc: "Operator ?? ជួយឲ្យកូដខ្លី និងសុវត្ថិភាពនៅពេលទាញទិន្នន័យពី User Input ។" },
      { title: "Short-circuit", desc: "ក្នុង &&, បើលក្ខខណ្ឌទី១ ខុស វានឹងមិនទៅឆែកលក្ខខណ្ឌទី២ ទៀតទេ ─ ចំណេញ Performance ។" }
    ],
    code: `<?php
$a = 10; $b = 3;

// Math
$result = ($a * $b) + 5; // 35

// Strict vs Loose
var_dump(10 == "10");  // true (Values match)
var_dump(10 === "10"); // false (Types differ!)

// Null Coalescing (Elegant Fallback)
$userInput = null;
$name = $userInput ?? "Guest User"; 

// Logical Chains
$isAdult = true;
$hasId   = false;
var_dump($isAdult && $hasId); // false
?>`,
    output: `true
false
Guest User
false`,
    syntax: `// ── Essential Operators ────────────────────
//
//  ===   : Strict Identity
//  !==   : Strict Inequality
//  .     : Concatenation (Join strings)
//  ??    : Null Coalescing
//  && || : Logic operators
//
// ──────────────────────────────────────────`,
    tip: "កុំប្រើ ==! ប្រើ === ជានិច្ចដើម្បីកុំឱ្យ PHP បន្លំភ្នែកអ្នកជាមួយ Type Casting របស់វា!",
    workflow: `// ── Evaluation Priority ───────────────────
//
// 1. Grouping: ( )
// 2. Unary: ! ++ --
// 3. Power: **
// 4. Multiplication: * / %
// 5. Addition: + - .
// 6. Relational: < > <= >=
// 7. Equality: === !==
//
// ──────────────────────────────────────────`,
  },
  {
    num: "06", chapter: "Operators & Flow", chapterColor: ORANGE,
    tag: "Logic", tagColor: BLUE, icon: "🚦",
    title: "Control Flow: If/Else",
    subtitle: "Branching · Multi-conditions · Nested Logic",
    body: `**Conditionals** អនុញ្ញាតឲ្យកម្មវិធីសរសេរផ្លូវដើរផ្សេងៗគ្នា ។ **if** ដំណើរការកូដលុះត្រាតែលក្ខខណ្ឌជា **true** ។ យើងប្រើ **elseif** សម្រាប់ឆែកលក្ខខណ្ឌបន្ទាប់ និង **else** ជាករណីចុងក្រោយគេបង្អស់។`,
    bullets: [
      { icon: "❓", label: "if block", desc: "The primary entry point for conditional execution." },
      { icon: "🛤️", label: "elseif", desc: "Additional checks if the previous one failed." },
      { icon: "🏁", label: "else", desc: "The 'catch-all' block if no conditions match." },
      { icon: "📐", label: "Nesting", desc: "Placing if-statements inside other if-statements." },
    ],
    explanation: [
      { title: "Evaluation", desc: "PHP ពិនិត្យលក្ខខណ្ឌក្នុងវង់ក្រចក ( ) ។ ប្រសិនបើ True, វាដើរកូដក្នុង { } ។" },
      { title: "Exclusivity", desc: "ក្នុងសំណុំ If/Elseif/Else, មានតែ Block មួយគត់ដែលនឹងត្រូវដើរ ទោះមានលក្ខខណ្ឌត្រូវច្រើនក៏ដោយ។" },
      { title: "Falsy values", desc: "ក្នុង PHP, 0, '', null, និង [] ត្រូវបានចាត់ទុកជា false ក្នុង if condition ។" },
      { title: "Return context", desc: "ក្នុង Web App, យើងប្រើ If/Else ដើម្បីឆែក Login Status ឬឆែក Error Form ជាដើម។" }
    ],
    code: `<?php
$score = 85;

if ($score >= 90) {
    echo "Grade: A 🏆";
} elseif ($score >= 80) {
    // Nested check (demonstration)
    if ($score >= 80 && $score < 90) {
        echo "Grade: B 🥈";
    }
} elseif ($score >= 70) {
    echo "Grade: C 🥉";
} else {
    echo "Grade: F ❌";
}

// Inline ternary check
$status = ($score >= 50) ? "Passed" : "Failed";
echo "\nStatus: $status";
?>`,
    output: `Grade: B 🥈
Status: Passed`,
    syntax: `// ── Comparison Control ──────────────────────
//
//  if (c) { }      : Standard if
//  elseif (c) { }  : Else if 
//  else { }        : Default fallback
//  (c) ? t : f     : Ternary (Short if)
//
// ──────────────────────────────────────────`,
    tip: "ចូរប្រើ Ternary Operator ( ? : ) សម្រាប់លក្ខខណ្ឌងាយៗ ដើម្បីឲ្យកូដរបស់អ្នកមើលទៅខ្លី និងស្អាត!",
    workflow: `// ── Decision Tree ─────────────────────────
//
// 1. Start: Condition check (ឆែកលក្ខខណ្ឌ)
// 2. Path A: If true -> run and exit (ត្រូវ -> ដើររួចឈប់)
// 3. Path B: Elseif check next (ខុស -> ឆែកបន្ត)
// 4. Path C: Else run fallback (ខុសទាំងអស់ -> ដើរ else)
// 5. Resume: Continue script (បន្តកូដខាងក្រោម)
//
// ──────────────────────────────────────────`,
  },
  {
    num: "07", chapter: "Operators & Flow", chapterColor: ORANGE,
    tag: "Selection", tagColor: PURPLE, icon: "🔀",
    title: "Match & Switch",
    subtitle: "Value Matching · Modern Match Expression · Fallthroughs",
    body: `សម្រាប់កិច្ចការដែលឆែកតម្លៃតែមួយ (Single Value) ច្រើនលទ្ធផល, PHP 8 ផ្ដល់នូវ **match** expression ដែលខ្លី និងមានសុវត្ថិភាពជាង **switch** ។ **match** ប្រើការប្រៀបធៀបបែប **Strict (===)** និងអាស្រ័យលើ 'Value Mapping'។`,
    bullets: [
      { icon: "🏎️", label: "match expression", desc: "PHP 8 feature - shorter, returns a value, uses strict check." },
      { icon: "🎛️", label: "switch statement", desc: "Traditional method - requires 'break' to prevent fallthrough." },
      { icon: "🛡️", label: "Strict Check", desc: "Match uses === which prevents common loose-typing bugs." },
      { icon: "🎭", label: "Default case", desc: "Always handle unknown values with 'default' or 'UnhandledMatchError'." },
    ],
    explanation: [
      { title: "Switch logic", desc: "Switch អានតម្លៃម្ដងមួយ block រហូតដល់ឃើញពាក្យ break ទើបវាឈប់។" },
      { title: "The Match Power", desc: "Match គឺជា Expression (វា return តម្លៃ) ─ វាមានន័យថាអ្នកអាចដាក់ $x = match(...) បានភ្លាមៗ។" },
      { title: "Strict Equality", desc: "Match មិនបត់បែនដូច Switch ទេ ─ ប្រសិនបើ Type ខុសគ្នា គឺវាមិនយកតែម្ដង (Safe behavior)។" },
      { title: "Return context", desc: "ស័ក្តិសមបំផុតសម្រាប់បកប្រែ Status Code (200, 404) ទៅជាអត្ថបទ។" }
    ],
    code: `<?php
$status = 200;

// 1. Modern Match (Recommended)
$message = match($status) {
    200, 201 => "Success!",
    404      => "Not Found",
    500      => "Server Error",
    default  => "Unknown Status",
};
echo $message;

// 2. Traditional Switch
switch ($status) {
    case 200:
        echo "OK";
        break; 
    default:
        echo "Other";
}
?>`,
    output: `Success!
OK`,
    syntax: `// ── Switch & Match Syntax ────────────────────
//
//  match($v) { v => res } : Modern Expression
//  switch($v) { case v: } : Old Statement
//  break                  : Stop switch execution
//  default                : Last resort path
//
// ──────────────────────────────────────────`,
    tip: "ប្រសិនបើអ្នកប្រើ PHP 8+, ចូរប្រើ match ជំនួស switch ជានិច្ច ព្រោះវាខ្លីជាង និងប្រើ Strict Comparison កាត់បន្ថយ Bug!",
    workflow: `// ── Mapping Process ────────────────────────
//
// 1. Input: Get target value (ទទួលតម្លៃគោលដៅ)
// 2. Compare: Match against keys (ប្រៀបធៀបនឹង key)
// 3. Select: Find matching block (ជ្រើសរើស block)
// 4. Return: Output mapped value (បញ្ជូនតម្លៃចេញ)
// 5. Default: Handle if no match (ករណីមិនមានក្នុងបញ្ជី)
//
// ──────────────────────────────────────────`,
  },
  {
    num: "08", chapter: "Operators & Flow", chapterColor: ORANGE,
    tag: "Iteration", tagColor: GREEN, icon: "🔄",
    title: "Loops",
    subtitle: "For · While · Do-While · Breaking Control",
    body: `**Loop** ប្រើសម្រាប់អនុវត្តកូដដដែលៗ ។ ក្នុង PHP, **for** ស័ក្តិសមសម្រាប់ចំនួនជុំដែលដឹងមុន, ចំណែក **while** ស័ក្តិសមសម្រាប់លក្ខខណ្ឌដែលមិនច្បាស់លាស់ ។ យើងប្រើ **break** ដើម្បីឈប់ និង **continue** ដើម្បីរំលងជុំបច្ចុប្បន្ន។`,
    bullets: [
      { icon: "🔢", label: "for loop", desc: "Classic counter-based loop: for ($i=0; $i<10; $i++)." },
      { icon: "🔄", label: "while loop", desc: "Runs as long as the condition remains true." },
      { icon: "🛑", label: "break", desc: "Immediately terminates the loop and moves to next script." },
      { icon: "⏭️", label: "continue", desc: "Skips the rest of code in the current round and starts next round." },
    ],
    explanation: [
      { title: "Initializer", desc: "For loop ចាប់ផ្ដើមដោយកំណត់តម្លៃដំបូង (ឧទាហរណ៍: $i = 0) ។" },
      { title: "Condition Check", desc: "មុននឹងដើរជុំនីមួយៗ PHP ឆែកលក្ខខណ្ឌ (Is $i < 10?) ។ បើ False វានឹងឈប់ភ្លាម។" },
      { title: "Iteration", desc: "បន្ទាប់ពីចប់កូដក្នុង Block, វានឹងអនុវត្តការបង្កើនតម្លៃ ($i++) រួចទៅចាប់ផ្ដើមឆែកលក្ខខណ្ឌឡើងវិញ។" },
      { title: "Infinite Danger", desc: "ប្រយ័ត្ន! បើលក្ខខណ្ឌ While True ជានិច្ច វានឹងគាំង Browser/Server (Infinite Loop) ។" }
    ],
    code: `<?php
// 1. For Loop (Standard)
for ($i = 1; $i <= 3; $i++) {
    echo "Iteration: $i \n";
}

// 2. While Loop (Condition based)
$fuel = 2;
while ($fuel > 0) {
    echo "Driving... Fuel: $fuel \n";
    $fuel--;
}

// 3. Break & Continue
for ($x = 1; $x <= 5; $x++) {
    if ($x === 2) continue; // Skip 2
    if ($x === 4) break;    // Stop at 4
    echo "Number: $x \n";
}
?>`,
    output: `Iteration: 1 
Iteration: 2 
Iteration: 3 
Driving... Fuel: 2 
Driving... Fuel: 1 
Number: 1 
Number: 3 `,
    syntax: `// ── Loop Control Syntax ─────────────────────
//
//  for (init; cond; step) : Structured loop
//  while (cond) { }       : Simple condition loop
//  do { } while (cond);    : Runs at least once
//  break                  : Exit loop
//  continue               : Skip current round
//
// ──────────────────────────────────────────`,
    tip: "ក្នុងកូដខ្លះដែលពិបាកកំណត់ចំនួនជុំ (ឧទាហរណ៍: អាន File រហូតដល់អស់), while គឺជាជម្រើសដ៏ល្អបំផុត!",
    workflow: `// ── Loop Lifecycle ─────────────────────────
//
// 1. Entry: Check condition (ឆែកលក្ខខណ្ឌផ្ដើម)
// 2. Execution: Run code block (ដំណើរការកូដ)
// 3. Step: Increment/Decrement (ប្ដូរតម្លៃជំហាន)
// 4. Reset: Jump back to start (ត្រឡប់ទៅផ្ដើមវិញ)
// 5. Exit: Condition failed (ឈប់នៅពេលលក្ខខណ្ឌខុស)
//
// ──────────────────────────────────────────`,
  },
  {
    num: "08-L", chapter: "Operators & Flow", chapterColor: ORANGE,
    tag: "Practice", tagColor: GREEN, icon: "🎮",
    title: "Lab: Flow Control Game",
    subtitle: "Logic Practice · If/Else · Loops · Modulo",
    body: `លំហាត់នេះនឹងធ្វើឱ្យអ្នកជំនាញលើ **Logic** ។ យើងនឹងសរសេរកម្មវិធីសម្រាប់ឆែក **Even/Odd Number** និងបង្កើតជា **Number Sequence** តាមរយៈការប្រើ loops និង conditions រួមគ្នា។`,
    bullets: [
      { icon: "🛤️", label: "Logic Branching", desc: "Use if-statements to solve mathematical problems." },
      { icon: "🔄", label: "Loop Practice", desc: "Generate sequences based on dynamic conditions." },
      { icon: "⚖️", label: "Modulo Operator", desc: "Use % operator to determine divisibility." },
      { icon: "🏎️", label: "Speed Hack", desc: "Optimize your conditions for maximum readability." },
    ],
    lab: {
      title: "Even/Odd Number Generator",
      titleKh: "កម្មវិធីស្វែងរកលេខគូ និងលេខសេស",
      duration: "30 min",
      objective: "Combine loops and if-statements to process a sequence of numbers.",
      steps: [
        "Create a for loop that runs from 1 to 10.",
        "Inside the loop, use an if-statement and modulo (%) to check if the number is even.",
        "Echo 'Even' or 'Odd' next to each number.",
        "Break the loop if the number reaches 7."
      ],
      code: `<?php
echo "Number Sequence Analysis:\n";

for ($i = 1; $i <= 10; $i++) {
    if ($i % 2 === 0) {
        echo "$i is EVEN \n";
    } else {
        echo "$i is ODD \n";
    }
    
    // Safety break at 7
    if ($i === 7) {
        echo "Stopping at 7... \n";
        break;
    }
}
?>`,
      output: `Number Sequence Analysis:
1 is ODD
2 is EVEN
3 is ODD
4 is EVEN
5 is ODD
6 is EVEN
7 is ODD
Stopping at 7...`
    },
    code: `<?php
// Test your modulo logic here
$n = 42;
echo ($n % 2 === 0) ? "Even" : "Odd";
?>`,
    output: `Even`,
    tip: "ការប្រើ Modulo (%) គឺជាបច្ចេកទេសដ៏សំខាន់បំផុតក្នុង Programming សម្រាប់បែងចែកក្រុមទិន្នន័យ!",
  },
  {
    num: "09", chapter: "Functions & Arrays", chapterColor: PINK,
    tag: "Reusability", tagColor: PINK, icon: "📦",
    title: "Functions: Logic Blocks",
    subtitle: "Declarations · Parameters · Return Types · Type Hinting",
    body: `**Function** គឺជាសំណុំកូដដែលយើងអាចហៅមកប្រើឡើងវិញបានច្រើនដង ។ ក្នុង PHP 8, យើងគួរតែប្រើ **Type Hinting** (កំណត់ប្រភេទ Data ឲ្យ Parameter និង Return) ដើម្បីឲ្យ Code របស់យើងរឹងមាំ និងងាយស្រួល Debug ។`,
    bullets: [
      { icon: "🛠️", label: "Declaration", desc: "function name($arg) { ... } - define your logic unit." },
      { icon: "↩️", label: "Return", desc: "Sends a value back to the caller using the 'return' keyword." },
      { icon: "🏷️", label: "Type Hinting", desc: "Declare types in PHP 8: function(int $a): string." },
      { icon: "🎯", label: "Default Args", desc: "Declare optional parameters: function($user = 'Guest')." },
    ],
    explanation: [
      { title: "Definiton", desc: "យើងបង្កើតកិច្ចការមួយទុកក្នុង Function (ឧទាហរណ៍: ការគណនាពន្ធ) ។" },
      { title: "Input Flow", desc: "នៅពេលហៅប្រើ យើងបញ្ជូនទិន្នន័យ (Arguments) ទៅកាន់ Parameter របស់ Function ។" },
      { title: "Logic Execution", desc: "កូដក្នុង { } ដើរដោយប្រើតម្លៃដែលបញ្ជូនមក ─ វាមាន Scope ផ្ទាល់ខ្លួនរបស់វា។" },
      { title: "The Handover", desc: "ពាក្យ return បញ្ឈប់ Function រួចបញ្ជូនលទ្ធផលចេញក្រៅឱ្យទៅអ្នកហៅ (Caller) ។" }
    ],
    code: `<?php
/**
 * A proper PHP 8 Function
 */
function calculateTotal(int $price, float $tax = 0.1): float {
    $total = $price + ($price * $tax);
    return $total;
}

// Using the function
$payable = calculateTotal(100); // Uses default tax
echo "Total: $" . $payable . " ";

$custom = calculateTotal(200, 0.05); // Custom tax
echo "Custom Total: $" . $custom;

// Anonymous / Arrow function (PHP 7.4+)
$add = fn($n) => $n + 10;
echo "Arrow result: " . $add(5);
?>`,
    output: `Total: $110
Custom Total: $210
Arrow result: 15`,
    syntax: `// ── Modern Function Standards ───────────────
//
//  function n(type $p): type { } : Typed decl
//  return v                      : Send result back
//  $p = val                      : Default value
//  void                          : No return value
//  fn() => res                   : Arrow Function
//
// ──────────────────────────────────────────`,
    tip: "ចងចាំថា កូដនៅក្នុង Function មាន Scope ផ្ទាល់ខ្លួន ─ វាមានន័យថា Variable ខាងក្រៅមិនអាចស្គាល់ក្នុង Function ទេ បើមិនបញ្ជូនមក!",
    workflow: `// ── Execution Pipe ─────────────────────────
//
// 1. Call: Invocation starts (ហៅទៅប្រើ)
// 2. Map: Args match parameters (ភ្ជាប់ទិន្នន័យ)
// 3. Eval: Internal logic runs (ដំណើរការ logic)
// 4. Return: Value sent back (ផ្ញើលទ្ធផលចេញ)
// 5. Clear: Local memory freed (សម្អាត memory)
//
// ──────────────────────────────────────────`,
  },
  {
    num: "10", chapter: "Functions & Arrays", chapterColor: PINK,
    tag: "Data Structures", tagColor: ORANGE, icon: "📋",
    title: "The Heart of PHP: Arrays",
    subtitle: "Indexed · Associative · Multi-dimensional · Modern Ops",
    body: `**Array** គឺជាបេះដូងរបស់ PHP ។ វាអាចដើរតួជា List សាមញ្ញ (Indexed) ឬជា Map ស្មុគស្មាញ (Associative) ។ រាល់ទិន្នន័យដែលចេញពី Database (PDO) គឺតែងតែស្ថិតនៅក្នុងទម្រង់ជា Array ជានិច្ច ។`,
    bullets: [
      { icon: "📋", label: "Indexed Array", desc: "Access values by position: $list[0]. Great for simple queues." },
      { icon: "🗂️", label: "Associative Array", desc: "Access by naming keys: $user['id']. Acts like a JSON object." },
      { icon: "🛠️", label: "Built-in Helpers", desc: "count(), sort(), array_merge(), in_array() for manipulation." },
      { icon: "⚡", label: "Modern Ops", desc: "array_map, array_filter, and arrow functions for clean logic." },
    ],
    explanation: [
      { title: "Storage", desc: "Array អាចផ្ទុក Data ច្រើនក្នុងឈ្មោះតែមួយ ($students) ─ វារក្សាទុកតម្លៃជាលំដាប់លំដោយ។" },
      { title: "Key-Value Pair", desc: "ក្នុង Associative Array, អ្នកអាចកំណត់ឈ្មោះ (Key) ឱ្យតម្លៃនីមួយៗបាន ─ ងាយស្រួលយល់ជាងលេខ index ។" },
      { title: "Multi-dim", desc: "Array ក្នុង Array ─ គឺជាទម្រង់ដែលយើងប្រើសម្រាប់តំណាងឱ្យតារាង Database (Rows & Columns)។" },
      { title: "Foreach Power", desc: "យើងប្រើ Foreach ដើម្បីដើរកាត់រាល់ទិន្នន័យក្នុង Array ដោយមិនបាច់បារម្ភពីរឿងចំនួនជុំឡើយ។" }
    ],
    code: `<?php
/**
 * Advanced Array Patterns
 */

// 1. Associative (The Dictionary)
$profile = [
    "id"   => 101,
    "name" => "Ratha Dev",
    "role" => "Admin"
];

// 2. Multi-dimensional (Database Mockup)
$database = [
    ["id" => 1, "user" => "Dara"],
    ["id" => 2, "user" => "Bona"]
];

// 3. Functional Mapping
$nums    = [1, 2, 3];
$squared = array_map(fn($n) => $n ** 2, $nums); 

echo "User: " . $profile['name'] . " ";
echo "DB Row 0: " . $database[0]['user'] . " ";
var_dump($squared);
?>`,
    output: `User: Ratha Dev
DB Row 0: Dara
array(3) { [0]=> int(1), [1]=> int(4), [2]=> int(9) }`,
    syntax: `// ── Array Operations Cheat Sheet ────────────
//
//  []            : Empty / New Array
//  $a['key']     : Access associative
//  count($a)     : Get size
//  array_push()  : Add to end
//  in_array()    : Check if value exists
//
// ──────────────────────────────────────────`,
    tip: "ចូរប្រើ Associative Arrays ជានិច្ចនៅពេលអ្នកចង់រក្សាទុកទិន្នន័យដែលមានអត្ថន័យ (ឧទាហរណ៍: ឈ្មោះបុគ្គលិក អាយុ តួនាទី)!",
    workflow: `// ── Data Processing Flow ──────────────────
//
// 1. Define: Create structure (រៀបចំរចនាសម្ព័ន្ធ)
// 2. Insert: Add elements (បញ្ចូលទិន្នន័យ)
// 3. Transform: Map/Filter (បំប្លែងទិន្នន័យ)
// 4. View: Access keys/values (ហៅមកប្រើ)
// 5. Clean: unset() if needed (សម្អាត memory)
//
// ──────────────────────────────────────────`,
  },
  {
    num: "11", chapter: "Functions & Arrays", chapterColor: PINK,
    tag: "Practice", tagColor: GREEN, icon: "🧪",
    title: "Lab: Array",
    subtitle: "Hands-on Data Processing · Associative Arrays · Loops",
    body: `ក្នុងលំហាត់នេះ យើងនឹងយកចំណេះដឹងពី **Arrays** និង **Foreach Loop** មកសរសេរជាកម្មវិធីគ្រប់គ្រងបញ្ជីឈ្មោះសិស្សសាមញ្ញមួយ។ គោលដៅគឺចេះបង្កើត, បន្ថែមទិន្នន័យ, និងបង្ហាញវាត្រឡប់មកវិញ។`,
    bullets: [
      { icon: "📝", label: "Initialization", desc: "Create an associative array with sample student records." },
      { icon: "➕", label: "Mutation", desc: "Dynamically add new elements using array_push or [] syntax." },
      { icon: "🔄", label: "Traversal", desc: "Use foreach to iterate and generate formatted output." },
      { icon: "🛡️", label: "Verification", desc: "Use var_dump to inspect the final structure." },
    ],
    lab: {
      title: "Building a Dynamic Student List",
      titleKh: "ការបង្កើតបញ្ជីឈ្មោះសិស្សតាមបែប Dynamic",
      duration: "45 min",
      objective: "Master array manipulation and looping in a real-world context.",
      steps: [
        "Initialize an array $students with at least 2 students (id, name, major).",
        "Add a 3rd student to the array manually.",
        "Loop through all students and echo their names in an <li> tag.",
        "Count the total number of students using count().",
        "Bonus: Use array_filter to find students in a specific major."
      ],
      code: `<?php
// 1. Setup multi-dimensional array
$students = [
    ["id" => 1, "name" => "Sok", "major" => "IT"],
    ["id" => 2, "name" => "Dara", "major" => "Design"]
];

// 2. Add new student
$students[] = ["id" => 3, "name" => "Vibol", "major" => "IT"];

// 3. Display total count
echo "Total Students: " . count($students) . "\n\n";

// 4. Loop & Display
echo "Student List:\n";
foreach ($students as $s) {
    echo "- " . $s['name'] . " (" . $s['major'] . ")\n";
}

// 5. Advanced: Filter IT students
echo "\nIT Students Only:\n";
$itOnly = array_filter($students, fn($s) => $s['major'] === "IT");
foreach ($itOnly as $s) {
    echo "✓ " . $s['name'] . "\n";
}
?>`,
      output: `Total Students: 3

Student List:
- Sok (IT)
- Dara (Design)
- Vibol (IT)

IT Students Only:
✓ Sok
✓ Vibol`
    },
    code: `<?php
// Practice Area: Try building your own data array here
$data = [
    "app" => "PHP Lab",
    "version" => 8.2
];

echo "Welcome to " . $data['app'];
?>`,
    output: `Welcome to PHP Lab`,
    tip: "ចូរកុំភ្លេចប្រើ [] ជំនួសឱ្យ array_push() សម្រាប់បច្ចេកទេសសរសេរកូដបែបសម័យថ្មី (Modern PHP)!",
  },
];



const CHAPTERS: ChapterData[] = [
  { name: "Foundations", color: BLUE, nums: ["01", "02", "03", "04", "04-L"], icon: "🧱" },
  { name: "Operators & Flow", color: ORANGE, nums: ["05", "06", "07", "08", "08-L"], icon: "⚙️" },
  { name: "Functions & Arrays", color: PINK, nums: ["09", "10", "11"], icon: "📦" },
];

// ── SYNTAX HIGHLIGHTER ────────────────────────────────────────
const PHP_KW = new Set(["php", "echo", "print", "return", "if", "else", "elseif", "foreach", "for", "while", "do", "class", "extends", "implements", "interface", "abstract", "trait", "use", "new", "public", "protected", "private", "static", "readonly", "function", "fn", "array", "string", "int", "float", "bool", "void", "null", "true", "false", "require", "require_once", "include", "throw", "try", "catch", "match", "const", "switch", "case", "break", "continue", "die", "isset", "empty", "unset", "exit", "header", "session_start", "define", "self", "parent", "sprintf", "date"]);
const SQL_KW = new Set(["SELECT", "FROM", "WHERE", "INSERT", "INTO", "VALUES", "UPDATE", "SET", "DELETE", "CREATE", "TABLE", "ORDER", "BY", "LIMIT", "AND", "OR", "NOT", "IN", "IS", "NULL", "PRIMARY", "KEY", "FOREIGN", "REFERENCES", "JOIN", "ON"]);

function hl(code: string) {
  return code.split('\n').map((line: string, li: number) => {
    const t = line.trim();
    if (t.startsWith('//') || t.startsWith('#') || t.startsWith('*') || t.startsWith('/*'))
      return <div key={li} style={{ color: '#6b8e6b', fontStyle: 'italic', minHeight: '1.65em' }}>{line}</div>;
    if (t.startsWith('--'))
      return <div key={li} style={{ color: '#6b8e6b', fontStyle: 'italic', minHeight: '1.65em' }}>{line}</div>;
    if (/^\s*<[^?]/.test(line))
      return <div key={li} style={{ color: '#79c0ff', minHeight: '1.65em' }}>{line}</div>;
    const parts = line.split(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\$[a-zA-Z_]\w*|\b\d+(?:\.\d+)?\b|\b[A-Z_]{2,}\b|\b[a-zA-Z_]\w*\b)/g);
    return (
      <div key={li} style={{ minHeight: '1.65em' }}>
        {parts.map((p: string, i: number) => {
          if (!p) return null;
          if (p.startsWith('$')) return <span key={i} style={{ color: '#ffd700' }}>{p}</span>;
          if (p.startsWith('"') || p.startsWith("'")) return <span key={i} style={{ color: '#98d98e' }}>{p}</span>;
          if (PHP_KW.has(p)) return <span key={i} style={{ color: '#ff7b72', fontWeight: 700 }}>{p}</span>;
          if (SQL_KW.has(p)) return <span key={i} style={{ color: '#ffa07a', fontWeight: 700 }}>{p}</span>;
          if (/^\d/.test(p)) return <span key={i} style={{ color: '#b19cd9' }}>{p}</span>;
          if (/^[A-Z_]{2,}$/.test(p)) return <span key={i} style={{ color: '#56b3d8' }}>{p}</span>;
          return <span key={i} style={{ color: 'inherit' }}>{p}</span>;
        })}
      </div>
    );
  });
}

// ── MOCK PHP EXECUTOR ──────────────────────────────────────────
function simulatePHP(code: string, isPost: boolean = false, stripHtml: boolean = false): string {
  const vars: Record<string, any> = {
    _GET: { name: "Guest", search: "Coffee" },
    _POST: isPost ? { name: "New Student", major: "Design" } : {},
    _SESSION: { user_name: "Ratha" },
    students: [
      { id: 1, name: "Dara", major: "Computer Science" },
      { id: 2, name: "Ratha", major: "Information Technology" }
    ]
  };
  if (isPost) {
    vars.students.push({ id: 3, name: "New Student", major: "Marketing" });
  }
  const consts: Record<string, any> = {
    'PHP_VERSION': '8.3.4'
  };
  
  // Helper to resolve PHP-style expressions to JS equivalents
  const evalExpr = (expr: string): any => {
    try {
      let js = expr.trim();
      // 1. Handle string interpolation: "Hello $name"
      js = js.replace(/"([^"]*)"/g, (_, content) => {
        return '`' + content.replace(/\$([a-zA-Z_]\w*)/g, '${vars["$1"]}') + '`';
      });
      // 2. Handle concatenation . -> +
      js = js.replace(/(?<!\d)\.|\.(?!\d)/g, ' + ');
      // 3. Handle casting: (int), (float), (string), (bool)
      js = js.replace(/\(int\)/g, 'Number');
      js = js.replace(/\(float\)/g, 'Number');
      js = js.replace(/\(string\)/g, 'String');
      js = js.replace(/\(bool\)/g, 'Boolean');
      // 4. Handle superglobals: $_GET['x']
      js = js.replace(/\$_([A-Z]+)\[['"](.*?)['"]\]/g, "vars._$1['$2']");
      // Handle isset specifically
      js = js.replace(/isset\(\s*\$_POST\[['"](.*?)['"]\]\s*\)/g, "vars._POST['$1'] !== undefined");
      js = js.replace(/empty\(\s*([\s\S]*?)\s*\)/g, "(!$1 || $1.length === 0)");

      // 5. Handle remaining variables: $var -> vars.var
      js = js.replace(/\$([a-zA-Z_][\w]*)/g, (_, v) => {
        if (v === 'this') return 'this';
        return `vars['${v}']`;
      });
      // 6. Provide built-in PHP functions
      const builtins = {
        gettype: (v: any) => {
          if (v === null) return "NULL";
          if (Array.isArray(v)) return "array";
          if (typeof v === 'number') return Number.isInteger(v) ? "integer" : "double";
          if (typeof v === 'boolean') return "boolean";
          return typeof v;
        },
        is_int: (v: any) => Number.isInteger(v),
        is_integer: (v: any) => Number.isInteger(v),
        is_float: (v: any) => typeof v === 'number' && !Number.isInteger(v),
        is_double: (v: any) => typeof v === 'number' && !Number.isInteger(v),
        is_string: (v: any) => typeof v === 'string',
        is_bool: (v: any) => typeof v === 'boolean',
        is_null: (v: any) => v === null,
        is_array: (v: any) => Array.isArray(v),
        min: (arr: any[]) => Math.min(...arr),
        max: (arr: any[]) => Math.max(...arr),
      };

      return new Function('vars', 'consts', 'builtins', `
        const { gettype, is_int, is_integer, is_float, is_double, is_string, is_bool, is_null, is_array, min, max } = builtins;
        try { return (${js}); } catch(e) { return undefined; }
      `)(vars, consts, builtins);
    } catch (e) { return undefined; }
  };

  const formatValue = (val: any) => {
    if (val === null || val === undefined) return "";
    if (val === false) return ""; 
    if (val === true) return "1";  
    return String(val);
  };

  const formatVarDump = (val: any) => {
    if (val === null || val === undefined) return "NULL";
    if (typeof val === 'number') return `${Number.isInteger(val) ? 'int' : 'float'}(${val})`;
    if (typeof val === 'string') return `string(${val.length}) "${val}"`;
    if (typeof val === 'boolean') return `bool(${val ? 'true' : 'false'})`;
    return "unknown";
  };

  const processedCode = code.replace(/<\?=\s*([\s\S]*?)\s*\?>/g, '<?php echo $1; ?>');
  const tokens = processedCode.split(/(<\?php[\s\S]*?\?>)/g);
  let buffer = "";

  const execPHP = (token: string) => {
    let cleanBlock = token.replace(/<\?php/g, '').replace(/\?>/g, '').trim();
    const lines = cleanBlock.split('\n');
    let skip = false;
    let braceCount = 0;

    for (let line of lines) {
      let t = line.trim();
      t = t.split('//')[0].split('#')[0].trim();
      if (!t) continue;

      if (skip) {
        if (t.includes('{')) braceCount++;
        if (t.includes('}')) {
          if (braceCount === 0) skip = false;
          else braceCount--;
        }
        continue;
      }

      if (t.startsWith('if')) {
        const m = t.match(/if\s*\((.*)\)/);
        if (m && !evalExpr(m[1])) {
           if (t.includes('{')) skip = true;
        }
        continue;
      }
      if (t === '{' || t === '}') continue;

      const statements = t.split(';');
      for (let s of statements) {
        let stmt = s.trim();
        if (!stmt) continue;
        
        // Foreach start
        const feMatch = stmt.match(/foreach\s*\(\s*\$([a-zA-Z_]\w*)\s*as\s*\$([a-zA-Z_]\w*)\s*\)\s*:/);
        if (feMatch) return { type: 'loop_start', array: feMatch[1], item: feMatch[2] };
        if (stmt === 'endforeach') return { type: 'loop_end' };

        // Simple local parser
        const assignMatch = stmt.match(/^\$([a-zA-Z_]\w*)\s*([\+\-\*\/%]|(?:\?\?))?=\s*(.+)$/);
        if (assignMatch) {
          const [, name, op, expr] = assignMatch;
          const val = evalExpr(expr);
          if (!op) vars[name] = val;
          else if (op === '??') { if (!vars[name]) vars[name] = val; }
          else {
            const current = vars[name] || 0;
            if (op === '+') vars[name] = current + val;
            if (op === '-') vars[name] = current - val;
            if (op === '*') vars[name] = current * val;
            if (op === '/') vars[name] = current / val;
            if (op === '%') vars[name] = current % val;
          }
          continue;
        }
        if (stmt.startsWith('echo ') || stmt.startsWith('print ')) {
          const rawArgs = stmt.replace(/^(echo|print)\s+/, '').trim();
          const parts = rawArgs.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
          parts.forEach(p => buffer += formatValue(evalExpr(p)));
          continue;
        }
        if (stmt.match(/^var_dump\((.*)\)$/)) {
           buffer += formatVarDump(evalExpr(stmt.match(/^var_dump\((.*)\)$/)![1])) + "\n";
           continue;
        }
        evalExpr(stmt);
      }
    }
    return { type: 'normal' };
  };

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.startsWith('<?php')) {
      const res = execPHP(token);
      if (res.type === 'loop_start' && res.array && res.item) {
        // Collect loop body
        let bodyTokens: string[] = [];
        let j = i + 1;
        let depth = 1;
        while (j < tokens.length) {
          if (tokens[j].includes('foreach') && tokens[j].includes(':')) depth++;
          if (tokens[j].includes('endforeach')) depth--;
          if (depth === 0) break;
          bodyTokens.push(tokens[j]);
          j++;
        }
        // Run loop
        const dataArr = vars[res.array] || [];
        if (Array.isArray(dataArr)) {
          dataArr.forEach(itemVal => {
            vars[res.item] = itemVal;
            // Process body tokens
            for (let subToken of bodyTokens) {
              if (subToken.startsWith('<?php')) execPHP(subToken);
              else buffer += subToken;
            }
          });
        }
        i = j; // skip to endforeach
      }
    } else {
      buffer += token;
    }
  }
  
  if (stripHtml) {
     return buffer.replace(/<[^>]*>/g, '').trim() || "(no output)";
  }
  return buffer || "(no output)";
}

// ── LAB VIEW ──────────────────────────────────────────────────
function LabView({ lab, accent, theme }: { lab: Lab, accent: string, theme: 'dark' | 'light' }) {
  const [done, setDone] = useState<Record<number, boolean>>({});
  
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: accent, letterSpacing: '0.14em', marginBottom: 8 }}>LAB EXERCISE · {lab.duration}</div>
        <h2 style={{ fontFamily: 'DM Serif Display,serif', fontSize: 26, color: 'var(--ink)', marginBottom: 6 }}>{lab.title}</h2>
        <div style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.6, fontFamily: "'Noto Sans Khmer', sans-serif" }}>{lab.titleKh}</div>
      </div>

      <div style={{ padding: '16px', background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--border)' }}>
         <div style={{ fontSize: 10, fontWeight: 700, color: accent, marginBottom: 8, fontFamily: 'Space Mono,monospace', letterSpacing: '0.05em' }}>OBJECTIVE</div>
         <div style={{ fontSize: 12, color: 'var(--ink)', lineHeight: 1.6, fontFamily: "'Noto Sans Khmer', sans-serif" }}>{lab.objective}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--ink)', marginBottom: 4, fontFamily: 'Space Mono,monospace' }}>STEPS TO COMPLETE:</div>
        {lab.steps.map((step, i) => (
          <div key={i} onClick={() => setDone(d => ({...d, [i]: !d[i]}))}
            style={{ display: 'flex', gap: 12, padding: '12px', background: done[i] ? accent + '10' : 'transparent', border: `1px solid ${done[i] ? accent + '40' : 'var(--border)'}`, borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s' }}>
            <div style={{ width: 22, height: 22, borderRadius: 5, background: done[i] ? accent : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: done[i] ? '#000' : 'var(--ink)', fontSize: 10, fontWeight: 800, flexShrink: 0 }}>
              {done[i] ? '✓' : i + 1}
            </div>
            <div style={{ fontSize: 12.5, color: done[i] ? 'var(--ink)' : 'var(--ink)', textDecoration: done[i] ? 'line-through' : 'none', lineHeight: 1.5, fontFamily: "'Noto Sans Khmer', sans-serif" }}>
              {step}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CODE PANEL ────────────────────────────────────────────────
function CodePanel({ code: initialCode, output, syntax, workflow, explanation, lab, showPreview, accent, theme }: { 
  code: string, 
  output: string | null, 
  syntax?: string | null, 
  workflow?: string | null, 
  explanation?: ExplanationStep[] | null,
  lab?: Lab | null,
  showPreview?: boolean,
  accent: string, 
  theme: 'dark' | 'light' 
}) {
  const [tab, setTab] = useState(lab ? 'lab' : 'code');
  const [code, setCode] = useState(initialCode);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [mockPost, setMockPost] = useState(false);
  const [expStep, setExpStep] = useState(0);

  // Sync state when slide changes
  useEffect(() => { 
    setCode(initialCode); 
    setIsEditing(false); 
    setMockPost(false); 
    setExpStep(0);
    if (lab) setTab('lab');
    else setTab('code');
  }, [initialCode, lab]);

  useEffect(() => {
    if (tab === 'preview') {
      const timer = setTimeout(() => {
        const preview = document.querySelector('.browser-preview');
        if (preview) {
           const btn = preview.querySelector('button');
           if (btn) {
              btn.onclick = (e) => {
                e.preventDefault();
                setMockPost(true);
              };
           }
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [tab, code, mockPost]);

  const copy = () => {
    const textToCopy = tab === 'code' ? code : 
                        tab === 'lab' ? (lab?.code || '') :
                        tab === 'syntax' ? (syntax || '') : 
                        tab === 'workflow' ? (workflow || '') : (output || '');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true); setTimeout(() => setCopied(false), 1800);
  };

  const runCode = () => {
    setIsRunning(true);
    setTab('output');
    setTimeout(() => setIsRunning(false), 800);
  };

  const currentOutput = (tab === 'preview' || code !== initialCode)
    ? simulatePHP(code, mockPost, tab === 'output')
    : (output || '(no output)');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--card)', borderRadius: 14, overflow: 'hidden', border: `1px solid var(--border)`, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: `1px solid var(--border)`, background: 'var(--header-bg)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {['#ff5f57', '#febc2e', '#28c840'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
          </div>
          <div style={{ width: 1, height: 14, background: 'var(--border)', margin: '0 4px' }} />
          <button
            onClick={runCode}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 6, border: 'none',
              background: isRunning ? '#28c84030' : ACCENT,
              color: '#000', fontSize: 9, fontWeight: 900, fontFamily: 'Space Mono,monospace',
              transition: 'all 0.2s', transform: isRunning ? 'scale(0.95)' : 'none'
            }}
          >
            {isRunning ? 'RUNNING...' : 'RUN CODE ▶'}
          </button>
        </div>

        <div style={{ display: 'flex', background: '#000', borderRadius: 8, padding: 2, gap: 1, border: '1px solid var(--border)' }}>
          {[
            ['code', 'PHP'], 
            ['lab', 'LAB'],
            ['explain', 'EXPLAIN'], 
            ['syntax', 'SYNTAX'], 
            ['workflow', 'WORKFLOW'], 
            ['preview', 'PREVIEW'], 
            ['output', 'OUTPUT']
          ].map(([v, lbl]) => (
            ((v === 'code' || v === 'output') || 
             (v === 'syntax' && syntax) || 
             (v === 'workflow' && workflow) || 
             (v === 'explain' && explanation) ||
             (v === 'lab' && lab) ||
             (v === 'preview' && showPreview)) && (
              <button
                key={v}
                onClick={() => setTab(v)}
                style={{
                  padding: '5px 12px', borderRadius: 6, border: 'none',
                  background: tab === v ? (theme === 'dark' ? '#222' : '#eee') : 'transparent',
                  color: tab === v ? accent : 'var(--ink)',
                  fontSize: 9, fontWeight: 800, fontFamily: 'Space Mono,monospace',
                  transition: 'all 0.15s'
                }}
              >
                {lbl}
              </button>
            )
          ))}
        </div>

        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <button
            onClick={() => setIsEditing(!isEditing)}
            style={{ background: 'none', border: 'none', color: isEditing ? ACCENT : 'var(--ink)', fontSize: 10, fontWeight: 700, fontFamily: 'Space Mono,monospace' }}
          >
            {isEditing ? '✓ SAVED' : 'EDIT'}
          </button>
          <button onClick={copy} style={{ background: 'none', border: 'none', color: copied ? GREEN : 'var(--ink)', fontSize: 10, fontWeight: 700, fontFamily: 'Space Mono,monospace' }}>
            {copied ? '✓ COPIED' : 'COPY'}
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: 0, position: 'relative', background: tab === 'output' ? '#050505' : 'transparent' }}>
        {isRunning && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
            <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 12, color: ACCENT, animation: 'pulse 1s infinite' }}>executing php runtime...</div>
          </div>
        )}

        <div style={{ padding: '24px', height: '100%' }}>
          {tab === 'code'
            ? (isEditing
              ? <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Tab') {
                    e.preventDefault();
                    const target = e.target as HTMLTextAreaElement;
                    const start = target.selectionStart;
                    const end = target.selectionEnd;
                    const newValue = code.substring(0, start) + "  " + code.substring(end);
                    setCode(newValue);
                    // Using a slight delay to ensure the re-render happens before setting selection
                    setTimeout(() => {
                      target.selectionStart = target.selectionEnd = start + 2;
                    }, 0);
                  }
                }}
                spellCheck={false}
                style={{
                  width: '100%', height: '100%', minHeight: 300,
                  background: 'none', border: 'none', outline: 'none',
                  color: 'var(--ink)', fontFamily: 'Space Mono,monospace', fontSize: 12.5, lineHeight: 1.75,
                  resize: 'none', padding: 0
                }}
              />
              : <pre style={{ margin: 0, fontFamily: 'Space Mono,monospace', fontSize: 12.5, lineHeight: 1.75 }}>{hl(code)}</pre>
            )
            : tab === 'lab' && lab
              ? <LabView lab={lab} accent={accent} theme={theme} />
            : tab === 'explain' && explanation
              ? <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={expStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 20px' }}
                      >
                        <div style={{ fontSize: 10, color: accent, fontFamily: 'Space Mono,monospace', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>Stage {expStep + 1} of {explanation.length}</div>
                        <h2 style={{ fontFamily: 'DM Serif Display,serif', fontSize: 28, color: 'var(--ink)', marginBottom: 16 }}>{explanation[expStep].title}</h2>
                        <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--ink)', maxWidth: 450, fontFamily: "'Noto Sans Khmer', sans-serif" }}>{explanation[expStep].desc}</p>
                        
                        {/* Visual Animation Placeholder */}
                        <div style={{ marginTop: 30, width: '100%', display: 'flex', justifyContent: 'center' }}>
                           <div style={{ width: 60, height: 60, borderRadius: '50%', background: accent + '20', border: `2px solid ${accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse 2s infinite' }}>
                             <span style={{ fontSize: 24 }}>{expStep === explanation.length - 1 ? '✅' : '⚙️'}</span>
                           </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  
                  {/* Controls */}
                  <div style={{ padding: '20px 0', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'center', gap: 15 }}>
                    <button 
                      onClick={() => setExpStep(Math.max(0, expStep - 1))}
                      disabled={expStep === 0}
                      style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'none', color: expStep === 0 ? '#333' : 'var(--ink)', fontSize: 10, fontFamily: 'Space Mono,monospace', fontWeight: 700 }}
                    >
                      ← PREV
                    </button>
                    <button 
                      onClick={() => setExpStep(Math.min(explanation.length - 1, expStep + 1))}
                      disabled={expStep === explanation.length - 1}
                      style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: expStep === explanation.length - 1 ? 'var(--border)' : accent, color: '#000', fontSize: 10, fontFamily: 'Space Mono,monospace', fontWeight: 700 }}
                    >
                      {expStep === explanation.length - 1 ? 'COMPLETED' : 'NEXT STEP →'}
                    </button>
                  </div>
                </div>
            : tab === 'syntax'
              ? <pre style={{ margin: 0, fontFamily: 'Space Mono,monospace', fontSize: 12.5, lineHeight: 1.75, color: accent, whiteSpace: 'pre-wrap' }}>{syntax}</pre>
            : tab === 'workflow'
              ? <pre style={{ margin: 0, fontFamily: 'Space Mono,monospace', fontSize: 12.5, lineHeight: 1.75, color: '#f0f0f0', whiteSpace: 'pre-wrap' }}>{workflow}</pre>
            : tab === 'preview'
              ? <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: accent, opacity: 0.6, marginBottom: 15, borderBottom: '1px solid #222', paddingBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                    <span>PREVIEW — BROWSER ENGINE</span>
                    <span>127.0.0.1:8000</span>
                  </div>
                  <div 
                    className="browser-preview"
                    style={{ 
                      flex: 1,
                      padding: '24px', 
                      background: '#fff', 
                      color: '#333', 
                      borderRadius: 12, 
                      overflowY: 'auto',
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                    dangerouslySetInnerHTML={{ __html: currentOutput }}
                  />
                </div>
              : <div>
                <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: accent, opacity: 0.6, marginBottom: 15, borderBottom: '1px solid #222', paddingBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                  <span>{code === initialCode ? 'TERMINAL — PHP 8.3.4' : 'SIMULATION — MOCK PHP RUNNER'}</span>
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>
                <pre style={{ margin: 0, fontFamily: 'Space Mono,monospace', fontSize: 12.5, lineHeight: 1.75, color: GREEN, whiteSpace: 'pre-wrap' }}>
                  <span style={{ color: accent, marginRight: 10 }}>$ php runtime.php</span>
                  {'\n'}{currentOutput}
                  {'\n\n'}<span style={{ color: accent, animation: 'blink 1s infinite' }}>_</span>
                </pre>
                {code !== initialCode && (
                  <button
                    onClick={() => setCode(initialCode)}
                    style={{ marginTop: 20, background: 'none', border: `1px solid #333`, color: 'var(--ink)', fontSize: 9, padding: '4px 10px', borderRadius: 4, fontFamily: 'Space Mono,monospace' }}
                  >
                    RESET CODE TO ORIGINAL
                  </button>
                )}
              </div>
          }
        </div>
      </div>
    </div>
  );
}

// ── BULLET CARD ───────────────────────────────────────────────
function BulletCard({ bullet, accent }: { bullet: Bullet, accent: string }) {
  return (
    <div style={{ display: 'flex', gap: 10, padding: '10px 12px', background: 'var(--card)', border: `1px solid var(--border)`, borderRadius: 9, alignItems: 'flex-start' }}>
      <div style={{ width: 30, height: 30, borderRadius: 7, flexShrink: 0, background: accent + '15', border: `1px solid ${accent}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontFamily: 'Space Mono,monospace', color: accent, fontWeight: 700 }}>{bullet.icon}</div>
      <div>
        <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 11, color: accent, fontWeight: 700, marginBottom: 2 }}>{bullet.label}</div>
        <div style={{ fontSize: 12, color: 'var(--ink)', lineHeight: 1.5 }}>{bullet.desc}</div>
      </div>
    </div>
  );
}

// ── SLIDE ─────────────────────────────────────────────────────
function Slide({ slide, current, total, onNext, onPrev, theme, toggleTheme }: {
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
    i % 2 === 1 ? <strong key={i} style={{ color: accent }}>{p}</strong> : <span key={i}>{p}</span>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 22px', borderBottom: `1px solid var(--border)`, flexShrink: 0, background: 'var(--header-bg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18, marginRight: 2 }}>{slide.icon}</span>
          <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 13, fontWeight: 700, color: ACCENT }}>PHP<span style={{ color: 'var(--ink)' }}>_</span>101</span>
          <span style={{ color: 'var(--border)' }}>│</span>
          <span style={{ padding: '2px 8px', borderRadius: 4, background: slide.chapterColor + '18', border: `1px solid ${slide.chapterColor}30`, color: slide.chapterColor, fontSize: 9, fontFamily: 'Space Mono,monospace', fontWeight: 700, letterSpacing: '0.07em' }}>
            {slide.chapter}
          </span>
          <span style={{ padding: '2px 8px', borderRadius: 4, background: accent + '12', border: `1px solid ${accent}25`, color: accent, fontSize: 9, fontFamily: 'Space Mono,monospace', fontWeight: 700 }}>
            {slide.tag}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={toggleTheme}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px',
              borderRadius: 6, border: `1px solid var(--border)`,
              background: 'var(--card)', color: theme === 'dark' ? ACCENT : '#000',
              fontFamily: 'Space Mono,monospace', fontSize: 9, fontWeight: 700
            }}
          >
            <Monitor size={12} />
            {theme.toUpperCase()}
          </button>
          <div style={{ display: 'flex', gap: 3 }}>
            {SLIDES.map((_, i) => (
              <div key={i} style={{ width: i === current ? 16 : 4, height: 4, borderRadius: 3, background: i === current ? accent : i < current ? accent + '40' : (theme === 'dark' ? '#1e1e1e' : '#e0e0e0'), transition: 'all 0.3s' }} />
            ))}
          </div>
          <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: 'var(--ink)' }}>{slide.num}/{String(total).padStart(2, '0')}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* LEFT */}
        <div style={{ width: '38%', minWidth: 290, padding: '22px 22px 14px', overflowY: 'auto', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'DM Serif Display,serif', fontSize: 32, fontWeight: 400, color: 'var(--ink)', lineHeight: 1.1, margin: '0 0 5px' }}>{slide.title}</h1>
            <p style={{ fontFamily: 'Space Mono,monospace', fontSize: 9.5, color: 'var(--ink)', margin: 0 }}>{slide.subtitle}</p>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.75, color: theme === 'dark' ? 'var(--ink)' : '#444', fontFamily: "'Noto Sans Khmer',sans-serif", margin: 0 }}>
            {rb(slide.body)}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: slide.bullets.length > 4 ? '1fr 1fr' : '1fr', gap: 6 }}>
            {slide.bullets.map((b, i) => <BulletCard key={i} bullet={b} accent={accent} />)}
          </div>
          {/* Tip */}
          <div style={{ marginTop: 'auto', padding: '11px 13px', borderRadius: 9, background: accent + '08', border: `1px solid ${accent}22`, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
            <p style={{ fontSize: 11.5, lineHeight: 1.6, color: accent + 'cc', margin: 0, fontFamily: "'Noto Sans Khmer',sans-serif" }}>{slide.tip}</p>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ flex: 1, padding: 16, background: 'rgba(0,0,0,0.22)', display: 'flex', flexDirection: 'column' }}>
        {slide.code
            ? <CodePanel 
                code={slide.code} 
                output={slide.output} 
                syntax={slide.syntax} 
                workflow={slide.workflow} 
                explanation={slide.explanation}
                lab={slide.lab}
                showPreview={slide.title === "Your First PHP Code" || slide.chapter === "Web & Database" || slide.num === "15"}
                accent={accent} 
                theme={theme} 
              />
            : slide.concept
              ? <div style={{ flex: 1, background: 'var(--header-bg)', border: '1px solid var(--border)', borderRadius: 14, padding: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <pre style={{ fontFamily: 'Space Mono,monospace', fontSize: 13, lineHeight: 2.2, color: 'var(--ink)', textAlign: 'left', whiteSpace: 'pre', margin: 0 }}>{slide.concept}</pre>
              </div>
              : null
          }
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 22px', borderTop: `1px solid var(--border)`, flexShrink: 0, background: 'var(--bg)' }}>
        <button onClick={onPrev} disabled={current === 0} style={{ padding: '8px 16px', borderRadius: 7, border: `1px solid var(--border)`, background: current === 0 ? 'transparent' : 'var(--card)', color: current === 0 ? 'var(--border)' : 'var(--ink)', fontFamily: 'Space Mono,monospace', fontSize: 10 }}>← PREV</button>
        <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--border)' }}>← → arrow keys · Esc = menu</span>
        <button onClick={onNext} style={{ padding: '8px 20px', borderRadius: 7, border: 'none', background: accent, color: '#000', fontFamily: 'Space Mono,monospace', fontSize: 10, fontWeight: 700 }}>
          {current === total - 1 ? 'RESTART ↺' : 'NEXT →'}
        </button>
      </div>
    </div>
  );
}

// ── TABLE OF CONTENTS ─────────────────────────────────────────
function TOC({ onStart, onGoTo, theme, toggleTheme }: { onStart: () => void, onGoTo: (idx: number) => void, theme: 'dark' | 'light', toggleTheme: () => void }) {
  return (
    <div style={{ height: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '36px 24px 28px' }}>
      <div style={{ textAlign: 'center', marginBottom: 36, position: 'relative' }}>
        {/* Theme Toggle in Header/Hero */}
        <button
          onClick={toggleTheme}
          style={{
            position: 'relative', top: 0, right: 0,
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
        <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: ACCENT, letterSpacing: '0.2em', marginBottom: 12, textTransform: 'uppercase' }}>University Course · 10 Lessons</div>
        <h1 style={{ fontFamily: 'DM Serif Display,serif', fontSize: 52, fontWeight: 400, color: 'var(--ink)', lineHeight: 1.05, margin: '0 0 12px' }}>
          PHP<br /><em style={{ color: ACCENT }}>Basics</em>
        </h1>
        <p style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: 'var(--ink)', maxWidth: 400, lineHeight: 1.8 }}>
          Foundations → Operators → Logic → Functions → Arrays
        </p>
      </div>

      <div style={{ width: '100%', maxWidth: 900, display: 'flex', flexDirection: 'column', gap: 22, marginBottom: 32 }}>
        {CHAPTERS.map(ch => (
          <div key={ch.name}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9 }}>
              <div style={{ width: 3, height: 16, background: ch.color, borderRadius: 2 }} />
              <span style={{ fontSize: 16, marginRight: 2 }}>{ch.icon}</span>
              <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, fontWeight: 700, color: ch.color, letterSpacing: '0.08em' }}>{ch.name}</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(185px,1fr))', gap: 7 }}>
              {ch.nums.map(num => {
                const s = SLIDES.find(sl => sl.num === num);
                if (!s) return null;
                const idx = SLIDES.indexOf(s);
                return (
                  <button key={num} onClick={() => onGoTo(idx)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 11px', background: 'var(--card)', border: `1px solid var(--border)`, borderRadius: 8, cursor: 'pointer', textAlign: 'left', transition: 'all 0.18s' }}
                    onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.borderColor = ch.color + '65'; e.currentTarget.style.background = ch.color + '09'; }}
                    onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--card)'; }}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: 6, background: ch.color + '20', color: ch.color, fontFamily: 'Space Mono,monospace', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
                      <span style={{ position: 'absolute', top: 2, left: 4, fontSize: 8, opacity: 0.6 }}>{s.num}</span>
                      <span style={{ fontSize: 16 }}>{s.icon}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink)', fontFamily: 'Space Mono,monospace', lineHeight: 1.2 }}>{s.title}</div>
                      <div style={{ fontSize: 9, color: 'var(--ink)', marginTop: 2 }}>{s.tag}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button onClick={onStart} style={{ padding: '13px 44px', borderRadius: 8, border: 'none', background: ACCENT, color: '#000', fontFamily: 'Space Mono,monospace', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em' }}>
        START FROM LESSON 01 →
      </button>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────
export default function PHPSlides() {
  const [screen, setScreen] = useState('toc');
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');


  const goTo = useCallback((idx: number) => {
    setDir(idx > current ? 1 : -1); setCurrent(idx); setScreen('slide');
  }, [current]);

  const next = useCallback(() => {
    if (current < SLIDES.length - 1) { setDir(1); setCurrent(c => c + 1); }
    else { setScreen('toc'); setCurrent(0); }
  }, [current]);

  const prev = useCallback(() => {
    if (current > 0) { setDir(-1); setCurrent(c => c - 1); }
  }, [current]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (screen !== 'slide') return;
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'Escape') setScreen('toc');
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [screen, next, prev]);

  const slide = SLIDES[current]!;

  return (
    <div style={{ width: '100%', height: '100vh', background: 'var(--bg)', color: 'var(--ink)', overflow: 'hidden', fontFamily: "'Noto Sans Khmer','Inter',sans-serif" }}>
      <style>{GLOBAL_STYLE(theme)}</style>
      {/* grid texture */}
      <div style={{ position: 'fixed', inset: 0, opacity: theme === 'dark' ? 0.02 : 0.05, pointerEvents: 'none', backgroundImage: `linear-gradient(${theme === 'dark' ? '#fff' : '#000'} 1px,transparent 1px),linear-gradient(90deg,${theme === 'dark' ? '#fff' : '#000'} 1px,transparent 1px)`, backgroundSize: '32px 32px' }} />
      {/* accent glow */}
      {screen === 'slide' && (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', transition: 'background 0.6s', background: `radial-gradient(ellipse at 75% 15%, ${slide.tagColor}10 0%, transparent 55%)` }} />
      )}
      <AnimatePresence mode="wait">
        {screen === 'toc' ? (
          <motion.div key="toc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
            <TOC onStart={() => { setCurrent(0); setScreen('slide'); }} onGoTo={goTo} theme={theme} toggleTheme={toggleTheme} />
          </motion.div>
        ) : (
          <motion.div key={`s${current}`} initial={{ opacity: 0, x: dir * 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -dir * 20 }} transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }} style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
            <Slide slide={slide} current={current} total={SLIDES.length} onNext={next} onPrev={prev} theme={theme} toggleTheme={toggleTheme} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}