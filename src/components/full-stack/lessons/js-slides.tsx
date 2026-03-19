"use client";

import React, { useState, useEffect, useCallback, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ChevronLeft, ChevronRight, Copy, Check, Play, RotateCcw,
  Zap, Variable, Repeat, GitBranch, Box, Braces, Layers, ArrowRight,
  MousePointer2, Globe, Package, Terminal, ToggleLeft, SplitSquareHorizontal,
  CircuitBoard, Infinity as InfinityIcon, Code2, Share2, Timer, RefreshCw,
  Monitor, Sparkles, ArrowLeft, ChevronDown
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
  syntax: string;
  code: string;
  html?: string;
  css?: string;
  icon: React.ElementType;
}

const slides: Slide[] = [
  {
    id: "01", title: "What is JS?", subtitle: "The Language of the Web",
    tag: "Foundation", tagColor: "#fbbf24", accent: "#f59e0b",
    bg: "radial-gradient(ellipse at 20% 50%, rgba(245,158,11,0.12) 0%, transparent 60%)",
    content: ["Makes web pages interactive and alive", "Runs directly in your web browser", "No setup or installation needed", "Works perfectly alongside HTML & CSS"],
    lab: "Use console.log() to print your name to the console.",
    syntax: `// Single-line comment\nconsole.log(value);\n\n// JS runs top-to-bottom\n// Semicolons are optional`,
    code: `// Your first JavaScript!\nconsole.log("Hello, World!");\nconsole.log("JS makes pages come alive.");\n\n// You can do math\nconsole.log(10 + 5 * 2);`,
    icon: Zap,
  },
  {
    id: "02", title: "Variables", subtitle: "Storing Information",
    tag: "Core Syntax", tagColor: "#60a5fa", accent: "#3b82f6",
    bg: "radial-gradient(ellipse at 70% 30%, rgba(59,130,246,0.12) 0%, transparent 60%)",
    content: ["let — for data that can change later", "const — for data that stays fixed", "var — the old way (avoid using it)", "Give your variables clear, readable names"],
    lab: "Create a variable 'fruit' with the value 'apple' and log it.",
    syntax: `const name = "value";   // fixed\nlet count = 0;          // reassignable\nvar old = true;         // avoid this`,
    code: `// const: value stays fixed\nconst name = "Ratha";\nconst age = 21;\n\n// let: value can change\nlet score = 0;\nscore = 100;\n\nconsole.log(name);\nconsole.log("Age:", age);\nconsole.log("Score:", score);`,
    icon: Variable,
  },
  {
    id: "03", title: "Data Types", subtitle: "Types of Information",
    tag: "Core Syntax", tagColor: "#22d3ee", accent: "#06b6d4",
    bg: "radial-gradient(ellipse at 30% 70%, rgba(6,182,212,0.12) 0%, transparent 60%)",
    content: ["String — text wrapped in \"quotes\"", "Number — plain numbers (12, 5.5)", "Boolean — simple true or false", "Array — an ordered list of many items"],
    lab: "Create an array 'hobbies' with 3 of your favorite strings.",
    syntax: `typeof "hello"    // "string"\ntypeof 42         // "number"\ntypeof true       // "boolean"\ntypeof []         // "object"`,
    code: `const text = "Hello";      // String\nconst price = 9.99;        // Number\nconst isActive = true;     // Boolean\nconst colors = ["red", "blue", "green"];\n\nconsole.log(typeof text);\nconsole.log(typeof price);\nconsole.log(typeof isActive);\nconsole.log(colors[0]);    // First item`,
    icon: Box,
  },
  {
    id: "04", title: "Operators", subtitle: "Math and Logic",
    tag: "Logic", tagColor: "#fb923c", accent: "#f97316",
    bg: "radial-gradient(ellipse at 65% 45%, rgba(249,115,22,0.12) 0%, transparent 60%)",
    content: ["Arithmetic: +, -, *, /, %", "Comparison: ===, !==, >, <=", "Logical: AND (&&), OR (||), NOT (!)", "Concatenation: join text with +"],
    lab: "Calculate the area of a rectangle (width * height).",
    syntax: `a + b   a - b   a * b\na / b   a % b   a ** b\n\na === b   a !== b\na > b     a <= b`,
    code: `const a = 10;\nconst b = 3;\n\nconsole.log(a + b);   // 13\nconsole.log(a - b);   // 7\nconsole.log(a * b);   // 30\nconsole.log(a % b);   // 1 (remainder)\n\n// String joining\nconst first = "John";\nconst last = "Doe";\nconsole.log(first + " " + last);`,
    icon: Zap,
  },
  {
    id: "05", title: "If / Else", subtitle: "Making Decisions",
    tag: "Control Flow", tagColor: "#a78bfa", accent: "#8b5cf6",
    bg: "radial-gradient(ellipse at 20% 60%, rgba(139,92,246,0.12) 0%, transparent 60%)",
    content: ["if — run code when a condition is true", "else if — try another condition next", "else — the fallback when nothing matches", "Conditions always evaluate to true or false"],
    lab: "Write an if/else to check if age (20) is 18 or older.",
    syntax: `if (condition) {\n  // runs when true\n} else if (other) {\n  // another check\n} else {\n  // fallback\n}`,
    code: `const score = 85;\n\nif (score >= 90) {\n  console.log("Grade: A");\n} else if (score >= 80) {\n  console.log("Grade: B");\n} else if (score >= 70) {\n  console.log("Grade: C");\n} else {\n  console.log("Grade: F");\n}\n\n// Ternary shorthand\nconst pass = score >= 50 ? "PASS" : "FAIL";\nconsole.log(pass);`,
    icon: GitBranch,
  },
  {
    id: "06", title: "Switch / Case", subtitle: "Picking from a List",
    tag: "Control Flow", tagColor: "#818cf8", accent: "#6366f1",
    bg: "radial-gradient(ellipse at 75% 25%, rgba(99,102,241,0.12) 0%, transparent 60%)",
    content: ["switch — match one value against many cases", "break — stops the code from falling through", "default — runs when no case matches", "Cleaner than long if/else if chains"],
    lab: "Add a case for 'Saturday' and see it work.",
    syntax: `switch (value) {\n  case "a":\n    // do something\n    break;\n  case "b":\n    // do something\n    break;\n  default:\n    // fallback\n}`,
    code: `const day = "Monday";\n\nswitch (day) {\n  case "Monday":\n    console.log("Start of the week!");\n    break;\n  case "Friday":\n    console.log("Almost weekend!");\n    break;\n  case "Saturday":\n  case "Sunday":\n    console.log("It's the weekend!");\n    break;\n  default:\n    console.log("A regular weekday.");\n}`,
    icon: ToggleLeft,
  },
  {
    id: "07", title: "Ternary Operator", subtitle: "Quick Inline Checks",
    tag: "Shorthand", tagColor: "#38bdf8", accent: "#0ea5e9",
    bg: "radial-gradient(ellipse at 40% 70%, rgba(14,165,233,0.12) 0%, transparent 60%)",
    content: ["A compact shorthand for if/else", "Format: condition ? doThis : doThat", "Perfect for setting simple values inline", "Keep it short — one line stays readable"],
    lab: "Use a ternary to check if a number 'x' is even or odd.",
    syntax: `// Basic ternary\nconst result = condition ? "yes" : "no";\n\n// Inline usage\nconsole.log(age >= 18 ? "Adult" : "Minor");`,
    code: `const age = 20;\nconst status = age >= 18 ? "Adult" : "Minor";\nconsole.log(status);\n\nconst score = 75;\nconsole.log("Result: " + (score >= 50 ? "PASS" : "FAIL"));\n\n// Chaining (use sparingly)\nconst grade =\n  score >= 90 ? "A" :\n  score >= 80 ? "B" :\n  score >= 70 ? "C" : "F";\nconsole.log("Grade:", grade);`,
    icon: SplitSquareHorizontal,
  },
  {
    id: "08", title: "Logical Operators", subtitle: "AND, OR, and NOT",
    tag: "Logic", tagColor: "#34d399", accent: "#10b981",
    bg: "radial-gradient(ellipse at 55% 35%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    content: ["&& (AND) — both sides must be true", "|| (OR) — at least one side must be true", "! (NOT) — flips true to false", "Short-circuits: stops as soon as result is known"],
    lab: "Check if 'speed' (75) is between 60 AND 80.",
    syntax: `// AND — both conditions true\nif (a > 0 && b > 0) { }\n\n// OR — at least one true\nif (a > 0 || b > 0) { }\n\n// NOT — flip the result\nif (!isLoggedIn) { }`,
    code: `const age = 22;\nconst hasID = true;\n\nif (age >= 18 && hasID) {\n  console.log("Access granted!");\n}\n\nconst isWeekend = false;\nconst isHoliday = true;\nif (isWeekend || isHoliday) {\n  console.log("Day off!");\n}\n\nconst isLoggedIn = false;\nif (!isLoggedIn) {\n  console.log("Please log in.");\n}`,
    icon: CircuitBoard,
  },
  {
    id: "09", title: "Nullish & Optional", subtitle: "Handling Missing Data",
    tag: "Safety", tagColor: "#f472b6", accent: "#ec4899",
    bg: "radial-gradient(ellipse at 25% 55%, rgba(236,72,153,0.12) 0%, transparent 60%)",
    content: ["?? — use a fallback if value is null/undefined", "|| — use a fallback for any falsy value", "?. — safely access nested object properties", "Prevents your app from crashing on bad data"],
    lab: "Set a default 'Guest' name if user.name is missing using ??.",
    syntax: `// Nullish coalescing\nconst val = input ?? "default";\n\n// Optional chaining\nconst city = user?.address?.city;\n\n// Combine both\nconst name = user?.name ?? "Guest";`,
    code: `const input = 0;\nconsole.log(input ?? "default");  // 0\nconsole.log(input || "default");  // "default"\n\nconst user = {\n  name: "Ratha",\n  address: null\n};\n\nconsole.log(user?.name);\nconsole.log(user?.address?.city);\n\nconst city = user?.address?.city ?? "Unknown";\nconsole.log("City:", city);`,
    icon: InfinityIcon,
  },
  {
    id: "10", title: "Loops", subtitle: "Repeating Actions",
    tag: "Iteration", tagColor: "#4ade80", accent: "#22c55e",
    bg: "radial-gradient(ellipse at 70% 60%, rgba(34,197,94,0.12) 0%, transparent 60%)",
    content: ["for — repeat a set number of times", "while — repeat until a condition stops it", "forEach — loop through every array item", "break — exit the loop immediately"],
    lab: "Use a for loop to print numbers from 10 down to 1.",
    syntax: `for (let i = 0; i < n; i++) { }\n\nwhile (condition) { }\n\narray.forEach((item) => { });`,
    code: `// For loop\nfor (let i = 1; i <= 5; i++) {\n  console.log("Count:", i);\n}\n\n// Array forEach\nconst fruits = ["apple", "banana", "cherry"];\nfruits.forEach((fruit) => {\n  console.log("Fruit:", fruit);\n});`,
    icon: Repeat,
  },
  {
    id: "11", title: "Functions", subtitle: "Reusable Code Blocks",
    tag: "Functions", tagColor: "#f472b6", accent: "#ec4899",
    bg: "radial-gradient(ellipse at 30% 40%, rgba(236,72,153,0.12) 0%, transparent 60%)",
    content: ["Define logic once, call it many times", "Parameters are the inputs a function needs", "return sends the result back to the caller", "Keeps your code DRY (Don't Repeat Yourself)"],
    lab: "Create a function 'multiply' that takes two numbers and returns the result.",
    syntax: `function name(param1, param2) {\n  // logic here\n  return result;\n}\n\n// Call it:\nname(arg1, arg2);`,
    code: `function greet(name) {\n  return "Hello, " + name + "!";\n}\n\nconsole.log(greet("Ratha"));\nconsole.log(greet("World"));\n\nfunction add(a, b) {\n  return a + b;\n}\nconsole.log("Sum:", add(10, 25));`,
    icon: Braces,
  },
  {
    id: "12", title: "Arrow Functions", subtitle: "Modern Shorthand",
    tag: "Functions", tagColor: "#38bdf8", accent: "#0ea5e9",
    bg: "radial-gradient(ellipse at 60% 20%, rgba(14,165,233,0.12) 0%, transparent 60%)",
    content: ["A shorter way to write functions", "Uses the () => {} arrow syntax", "Single-line: return is implicit", "Common in modern JS and React code"],
    lab: "Convert your 'multiply' function into an arrow function.",
    syntax: `// Full arrow function\nconst fn = (a, b) => {\n  return a + b;\n};\n\n// Implicit return (1 line)\nconst fn = (a, b) => a + b;`,
    code: `// Regular function\nfunction square(n) {\n  return n * n;\n}\n\n// Arrow function (same thing!)\nconst squareArrow = (n) => n * n;\n\nconsole.log(square(4));\nconsole.log(squareArrow(4));\n\nconst greet = (name) => {\n  const msg = "Hi, " + name;\n  return msg + "!";\n};\nconsole.log(greet("Ratha"));`,
    icon: ArrowRight,
  },
  {
    id: "13", title: "Arrays", subtitle: "Grouped Lists",
    tag: "Data", tagColor: "#c084fc", accent: "#a855f7",
    bg: "radial-gradient(ellipse at 45% 65%, rgba(168,85,247,0.12) 0%, transparent 60%)",
    content: ["Store many items in one variable", "Access items by index, starting at [0]", "push() to add, pop() to remove from end", "map() transforms every item in the list"],
    lab: "Add 'Orange' to the fruits array using .push().",
    syntax: `const arr = [1, 2, 3];\narr[0]               // access\narr.push(4)          // add to end\narr.pop()            // remove last\narr.map(x => x * 2) // transform`,
    code: `const students = ["Ratha", "Dara", "Sophea"];\n\nconsole.log(students[0]);\nconsole.log(students.length);\n\nstudents.push("Maly");\nconsole.log(students);\n\nconst upper = students.map(s => s.toUpperCase());\nconsole.log(upper);`,
    icon: Layers,
  },
  {
    id: "14", title: "Objects", subtitle: "Key-Value Data",
    tag: "Data", tagColor: "#fbbf24", accent: "#f59e0b",
    bg: "radial-gradient(ellipse at 75% 50%, rgba(245,158,11,0.12) 0%, transparent 60%)",
    content: ["Groups related data into one unit", "Access values with dot notation (user.name)", "Can contain methods (functions as values)", "Most common data structure in JavaScript"],
    lab: "Add a 'subject' property to the student object.",
    syntax: `const obj = {\n  key: "value",\n  num: 42,\n  method() { return this.key; }\n};\nobj.key       // "value"\nobj["num"]    // 42`,
    code: `const student = {\n  name: "Ratha",\n  age: 21,\n  grade: "A",\n  greet() {\n    return "Hi, I am " + this.name;\n  }\n};\n\nconsole.log(student.name);\nconsole.log(student.age);\nconsole.log(student.greet());\n\nstudent.city = "Phnom Penh";\nconsole.log(student.city);`,
    icon: Package,
  },
  {
    id: "15", title: "DOM Selectors", subtitle: "Finding Page Elements",
    tag: "DOM", tagColor: "#2dd4bf", accent: "#14b8a6",
    bg: "radial-gradient(ellipse at 20% 40%, rgba(20,184,166,0.12) 0%, transparent 60%)",
    content: ["DOM — the browser's map of your HTML", "getElementById — find one element by ID", "querySelector — find elements with CSS syntax", "querySelectorAll — returns a list of matches"],
    lab: "Select the paragraph using querySelector and log its textContent.",
    syntax: `const h1  = document.getElementById("title");\nconst p   = document.querySelector(".desc");\nconst btn = document.querySelector("#btn");`,
    code: `const title = document.getElementById("title");\nconst desc  = document.querySelector(".desc");\nconst btn   = document.querySelector("#btn");\n\nconsole.log("Tag:",  title.tagName);\nconsole.log("Text:", title.textContent);\nconsole.log("Desc:", desc.textContent);\nconsole.log("Btn:",  btn.textContent);\n\nconst all = document.querySelectorAll("p, button");\nall.forEach(el => console.log("Found:", el.tagName));`,
    html: `<!DOCTYPE html>\n<html>\n<head><link rel="stylesheet" href="style.css"></head>\n<body>\n  <h1 id="title">Hello, World!</h1>\n  <p class="desc">A paragraph element.</p>\n  <button id="btn">Click me</button>\n  <script src="script.js"></script>\n</body>\n</html>`,
    css: `#title { color: teal; font-size: 2rem; }\n.desc { font-size: 1.2rem; color: #888; }\nbutton { padding: 8px 16px; background: teal; color: white; border: none; border-radius: 6px; cursor: pointer; }`,
    icon: Globe,
  },
  {
    id: "16", title: "DOM Styles & Classes", subtitle: "Changing Design with JS",
    tag: "DOM", tagColor: "#22d3ee", accent: "#06b6d4",
    bg: "radial-gradient(ellipse at 65% 35%, rgba(6,182,212,0.12) 0%, transparent 60%)",
    content: [".style — change inline CSS directly", ".classList.add — attach a CSS class", ".classList.remove — detach a CSS class", ".classList.toggle — flip a class on/off"],
    lab: "Change the box background to 'purple' using .style.background.",
    syntax: `box.style.color = "gold";\nbox.classList.add("active");\nbox.classList.remove("old");\nbox.classList.toggle("hidden");`,
    code: `const box       = document.getElementById("box");\nconst toggleBtn = document.getElementById("toggleBtn");\n\nbox.style.border = "2px solid gold";\nconsole.log("Border set!");\n\nbox.classList.add("active");\nconsole.log("Added .active");\n\nbox.classList.remove("card");\nconsole.log("Removed .card");\n\nconsole.log("Has .active?", box.classList.contains("active"));\n\ntoggleBtn.addEventListener("click", () => {\n  box.classList.toggle("active");\n  console.log("Toggled .active!");\n});`,
    html: `<!DOCTYPE html>\n<html>\n<head><link rel="stylesheet" href="style.css"></head>\n<body>\n  <div id="box" class="card">Hello, I am a box!</div>\n  <button id="toggleBtn">Toggle Active</button>\n  <script src="script.js"></script>\n</body>\n</html>`,
    css: `.card { background: #1a1a2e; color: white; padding: 24px; border-radius: 12px; font-size: 1.5rem; transition: all 0.3s ease; }\n.active { background: teal; color: gold; transform: scale(1.05); box-shadow: 0 8px 32px rgba(0,128,128,0.4); }\nbutton { margin-top: 16px; padding: 8px 20px; background: #333; color: white; border: none; border-radius: 8px; cursor: pointer; }`,
    icon: Globe,
  },
  {
    id: "17", title: "DOM Content", subtitle: "Changing Text and HTML",
    tag: "DOM", tagColor: "#38bdf8", accent: "#0ea5e9",
    bg: "radial-gradient(ellipse at 35% 60%, rgba(14,165,233,0.12) 0%, transparent 60%)",
    content: [".textContent — update plain text safely", ".innerHTML — inject HTML markup", ".value — read what a user has typed", "Prefer textContent for simple text updates"],
    lab: "Update the greeting to say 'Welcome to JS!' using textContent.",
    syntax: `title.textContent = "New Title";\nlist.innerHTML = "<li>Item</li>";\nconst val = input.value;`,
    code: `const title    = document.getElementById("title");\nconst list     = document.getElementById("list");\nconst input    = document.getElementById("nameInput");\nconst greeting = document.getElementById("greeting");\n\nconsole.log("Before:", title.textContent);\ntitle.textContent = "DOM is Powerful!";\nconsole.log("After:",  title.textContent);\n\nconst skills = ["HTML", "CSS", "JavaScript"];\nlist.innerHTML = skills.map(s => "<li>" + s + "</li>").join("");\nconsole.log("List built!");\n\nconsole.log("Input value:", input.value || "(empty)");\ngreeting.textContent = "Hello, " + (input.value || "World") + "!";`,
    html: `<!DOCTYPE html>\n<html>\n<head><link rel="stylesheet" href="style.css"></head>\n<body>\n  <h2 id="title">Old Title</h2>\n  <ul id="list"></ul>\n  <input id="nameInput" type="text" placeholder="Type your name...">\n  <p id="greeting"></p>\n  <script src="script.js"></script>\n</body>\n</html>`,
    css: `body { font-family: sans-serif; padding: 2rem; background: #0a0a0b; color: white; }\nh2 { color: skyblue; font-size: 2rem; }\nul { list-style: none; padding: 0; }\nli { padding: 8px 16px; background: #1a1a2e; border-radius: 6px; margin-bottom: 6px; color: #28c840; }\ninput { padding: 8px; border-radius: 6px; border: 1px solid #333; background: #1a1a2e; color: white; width: 200px; }`,
    icon: Globe,
  },
  {
    id: "18", title: "Events", subtitle: "Reacting to Users",
    tag: "Interactivity", tagColor: "#fb7185", accent: "#f43f5e",
    bg: "radial-gradient(ellipse at 70% 70%, rgba(244,63,94,0.12) 0%, transparent 60%)",
    content: ["Events fire when users interact with the page", "addEventListener — waits for a specific action", "Common: click, input, keydown, submit", "The event object tells you what happened"],
    lab: "Log 'Mouse entered' when the mouse hovers over the button.",
    syntax: `btn.addEventListener("click", (e) => {\n  console.log(e.type);   // "click"\n  console.log(e.target); // button\n});`,
    code: `const btn    = document.getElementById("btn");\nconst inp    = document.getElementById("inp");\nconst output = document.getElementById("output");\n\nlet clickCount = 0;\n\nbtn.addEventListener("click", (e) => {\n  clickCount++;\n  console.log("Clicked!", "type:", e.type);\n  output.textContent = "Clicked " + clickCount + " time(s)!";\n});\n\ninp.addEventListener("input", (e) => {\n  console.log("Typed:", e.target.value);\n  output.textContent = "You typed: " + e.target.value;\n});\n\ninp.addEventListener("keydown", (e) => {\n  if (e.key === "Enter") {\n    console.log("Enter pressed!");\n    output.textContent = "Submitted: " + e.target.value;\n  }\n});`,
    html: `<!DOCTYPE html>\n<html>\n<head><link rel="stylesheet" href="style.css"></head>\n<body>\n  <button id="btn">Click Me!</button>\n  <input id="inp" type="text" placeholder="Type something...">\n  <p id="output">Waiting for events...</p>\n  <script src="script.js"></script>\n</body>\n</html>`,
    css: `body { font-family: sans-serif; padding: 2rem; background: #0a0a0b; color: white; }\n#btn { padding: 10px 24px; background: teal; color: white; border: none; border-radius: 8px; font-size: 1rem; cursor: pointer; }\n#inp { display: block; margin-top: 12px; padding: 8px; background: #1a1a2e; color: white; border: 1px solid #333; border-radius: 6px; width: 240px; }\n#output { margin-top: 16px; color: #28c840; font-family: monospace; }`,
    icon: MousePointer2,
  },
  {
    id: "19", title: "Destructuring", subtitle: "Unpacking Data",
    tag: "ES6+", tagColor: "#60a5fa", accent: "#3b82f6",
    bg: "radial-gradient(ellipse at 25% 30%, rgba(59,130,246,0.12) 0%, transparent 60%)",
    content: ["Extract values from objects and arrays quickly", "No more repetitive obj.prop syntax", "Can rename variables while destructuring", "Great for function parameters too"],
    lab: "Destructure 'email' from the user object.",
    syntax: `// Object Destructuring\nconst { name, age } = user;\n\n// Array Destructuring\nconst [first, second] = list;`,
    code: `const user = {\n  username: "ratha_dev",\n  gmail: "ratha@test.com",\n  level: 5\n};\n\nconst { username, level } = user;\nconsole.log(username, "is level", level);\n\nconst colors = ["#ff0000", "#00ff00", "#0000ff"];\nconst [red, green] = colors;\nconsole.log("First color is", red);`,
    icon: Code2,
  },
  {
    id: "20", title: "Spread & Rest", subtitle: "The Three Dots (...)",
    tag: "ES6+", tagColor: "#fb923c", accent: "#f97316",
    bg: "radial-gradient(ellipse at 60% 55%, rgba(249,115,22,0.12) 0%, transparent 60%)",
    content: ["Spread (...) — copy or merge arrays/objects", "Rest (...) — gather arguments into an array", "Original data stays safe and unchanged", "Immutability is a golden rule of modern JS"],
    lab: "Create a copy of the user object and change the 'name' property.",
    syntax: `// Spread: copy/merge\nconst newArr = [...oldArr, 4];\nconst newObj = { ...oldObj, key: 'val' };\n\n// Rest: gather\nfunction sum(...numbers) { }`,
    code: `const original = [1, 2, 3];\nconst copy = [...original, 4, 5];\nconsole.log("Copy:", copy);\n\nconst user = { name: "Ratha", role: "Student" };\nconst updatedUser = { ...user, role: "Pro Developer" };\nconsole.log("Updated:", updatedUser);\n\nfunction listSkills(first, ...others) {\n  console.log("Main:", first);\n  console.log("Others:", others);\n}\nlistSkills("HTML", "CSS", "JS", "React");`,
    icon: Layers,
  },
  {
    id: "21", title: "ES Modules", subtitle: "Import & Export",
    tag: "ES6+", tagColor: "#a78bfa", accent: "#8b5cf6",
    bg: "radial-gradient(ellipse at 40% 25%, rgba(139,92,246,0.12) 0%, transparent 60%)",
    content: ["Break code into small, focused files", "export — share functions or values", "import — bring code from another file", "Keeps projects clean and maintainable"],
    lab: "Imagine you have a 'subtract' function. How would you export it?",
    syntax: `// helpers.js\nexport const add = (a, b) => a + b;\n\n// main.js\nimport { add } from './helpers.js';`,
    code: `// --- Simulating Modules in Browser ---\n// In a real project these live in separate files\n\nconst MathUtils = {\n  add: (a, b) => a + b,\n  sub: (a, b) => a - b\n};\n\n// export default MathUtils;\n// import Utils from './math.js';\n\nconst result = MathUtils.add(10, 5);\nconsole.log("Module Result:", result);\nconsole.log("Sub:", MathUtils.sub(10, 5));`,
    icon: Share2,
  },
  {
    id: "22", title: "Promises", subtitle: "Async Operations",
    tag: "Async", tagColor: "#34d399", accent: "#10b981",
    bg: "radial-gradient(ellipse at 70% 40%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    content: ["Used for tasks that take time (fetching data)", "A Promise is pending, resolved, or rejected", ".then() — runs after success", ".catch() — handles errors gracefully"],
    lab: "Create a promise that resolves after 2 seconds.",
    syntax: `const p = new Promise((res, rej) => {\n  if (success) res(data);\n  else rej(error);\n});\n\np.then(d => ...).catch(e => ...);`,
    code: `console.log("Step 1: Starting request...");\n\nconst fetchData = new Promise((resolve) => {\n  setTimeout(() => {\n    resolve({ id: 1, name: "Data from Internet" });\n  }, 1500);\n});\n\nfetchData.then((data) => {\n  console.log("Step 3: Success!", data.name);\n});\n\nconsole.log("Step 2: Doing other things while waiting...");`,
    icon: Timer,
  },
  {
    id: "23", title: "Async / Await", subtitle: "Cleaner Async Code",
    tag: "Async", tagColor: "#38bdf8", accent: "#0ea5e9",
    bg: "radial-gradient(ellipse at 30% 55%, rgba(14,165,233,0.12) 0%, transparent 60%)",
    content: ["Syntactic sugar built on top of Promises", "Write async code that reads like sync code", "await — pause until a Promise resolves", "try/catch — handle errors cleanly"],
    lab: "Create an async function that awaits fetchData.",
    syntax: `async function getData() {\n  try {\n    const data = await fetch('url');\n    console.log(data);\n  } catch (err) {\n    console.error(err);\n  }\n}`,
    code: `const wait = (ms) => new Promise(res => setTimeout(res, ms));\n\nasync function runProcess() {\n  console.log("Initializing...");\n  await wait(1000);\n\n  console.log("Loading user profile...");\n  await wait(1000);\n\n  console.log("Everything Ready!");\n  return "Welcome Back!";\n}\n\nrunProcess().then(msg => console.log(msg));`,
    icon: RefreshCw,
  },
  {
    id: "FA", title: "Final Project", subtitle: "Digital Clock",
    tag: "Assignment", tagColor: "#fde047", accent: "#eab308",
    bg: "radial-gradient(ellipse at 50% 50%, rgba(234,179,8,0.15) 0%, transparent 60%), radial-gradient(ellipse at 10% 90%, rgba(249,115,22,0.08) 0%, transparent 50%)",
    content: ["Use a function to get the current time", "Update the <h1> every second with setInterval", "Format the time nicely as HH:MM:SS", "Display it in a dark, full-screen layout"],
    lab: "Build a complete live digital clock that updates every second.",
    syntax: `// Hint:\nsetInterval(() => {\n  // your code here\n}, 1000);`,
    code: `// START YOUR JS PROJECT\nfunction updateClock() {\n  const now = new Date();\n  console.log("Time is:", now.toLocaleTimeString());\n}\n\n// Update every second\nsetInterval(updateClock, 1000);`,
    html: `<!DOCTYPE html>\n<html>\n<body>\n  <h1 id="clock">00:00:00</h1>\n</body>\n</html>`,
    css: `body { background: #000; color: #0f0; display: flex; justify-content: center; align-items: center; height: 100vh; font-family: monospace; }\nh1 { font-size: 6rem; }`,
    icon: Sparkles,
  },
];

/* ─── JS SYNTAX HIGHLIGHTER ──────────────────────────────────────── */
const JS_KEYWORDS = new Set([
  'const','let','var','function','return','if','else','for','while',
  'forEach','map','new','this','true','false','null','undefined','typeof',
  'break','continue','switch','case','async','await','Promise','try','catch',
  'export','import','default','from','of','in','class','extends','super',
  'static','get','set','do','throw','finally'
]);

const HighlightedJs = ({ code }: { code: string }) => {
  const lines = code.split('\n');

  const tokenizeLine = (line: string): React.ReactNode => {
    const commentIdx = line.indexOf('//');
    if (commentIdx !== -1) {
      return <>
        {tokenizeLine(line.slice(0, commentIdx))}
        <span style={{ color: '#6b7280', fontStyle: 'italic' }}>{line.slice(commentIdx)}</span>
      </>;
    }
    const parts = line.split(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\b\d+(?:\.\d+)?\b|\b[a-zA-Z_$][a-zA-Z0-9_$]*\b)/g);
    return parts.map((part, i) => {
      if (!part) return null;
      if (JS_KEYWORDS.has(part)) return <span key={i} style={{ color: '#f87171', fontWeight: 700 }}>{part}</span>;
      if (/^["'`]/.test(part)) return <span key={i} style={{ color: '#86efac' }}>{part}</span>;
      if (/^\d/.test(part)) return <span key={i} style={{ color: '#c084fc' }}>{part}</span>;
      if (/^[A-Z]/.test(part)) return <span key={i} style={{ color: '#fbbf24' }}>{part}</span>;
      return <span key={i} style={{ color: '#e2e8f0' }}>{part}</span>;
    });
  };

  return (
    <div
      className="font-mono text-sm leading-6 whitespace-pre"
      style={{ fontFamily: "'JetBrains Mono','Fira Code','Cascadia Code',monospace" }}
    >
      {lines.map((line, i) => (
        <div key={i} className="min-h-[1.5rem]">{tokenizeLine(line)}</div>
      ))}
    </div>
  );
};

/* ─── SYNTAX REFERENCE PANEL ─────────────────────────────────────── */
const SyntaxPanel = ({ syntax, accent }: { syntax: string; accent: string }) => (
  <div className="rounded-xl border overflow-hidden" style={{ borderColor: `${accent}30`, background: `${accent}08` }}>
    <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: `${accent}20` }}>
      <Code2 className="w-3 h-3" style={{ color: accent }} />
      <span className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: accent }}>Syntax Reference</span>
    </div>
    <div
      className="p-3 text-xs leading-6 font-mono whitespace-pre text-zinc-300 overflow-x-auto"
      style={{ fontFamily: "'JetBrains Mono','Fira Code',monospace" }}
    >
      {syntax.split('\n').map((line, i) => (
        <div key={i} className="min-h-[1.5rem]">
          {line.trimStart().startsWith('//') ? (
            <span style={{ color: '#6b7280', fontStyle: 'italic' }}>{line}</span>
          ) : line}
        </div>
      ))}
    </div>
  </div>
);

/* ─── CODE EDITOR ────────────────────────────────────────────────── */
const CodeEditor = ({ code, onChange, accent }: { code: string; onChange: (v: string) => void; accent: string }) => {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const lines = code.split('\n');

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.currentTarget;
      const s = ta.selectionStart;
      const next = code.slice(0, s) + '  ' + code.slice(ta.selectionEnd);
      onChange(next);
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = s + 2; }, 0);
    }
  };

  const syncScroll = () => {
    if (taRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = taRef.current.scrollTop;
      highlightRef.current.scrollLeft = taRef.current.scrollLeft;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-white/8 flex-none">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]/60" />
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 rounded px-2 py-1 ml-1">
            <Code2 className="w-3 h-3" style={{ color: accent }} />
            <span className="text-[10px] font-mono text-zinc-400">script.js</span>
          </div>
        </div>
        <button
          onClick={copy}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${copied ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'}`}
        >
          {copied ? <><Check className="w-3 h-3" />Copied!</> : <><Copy className="w-3 h-3" />Copy</>}
        </button>
      </div>

      {/* Editor body */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-none w-9 bg-[#0d1117] border-r border-white/5 pt-4 pb-4 flex flex-col items-end pr-2 overflow-hidden select-none">
          {lines.map((_, i) => (
            <div key={i} className="text-[11px] font-mono text-zinc-600 leading-6 min-h-[1.5rem]">{i + 1}</div>
          ))}
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div ref={highlightRef} className="absolute inset-0 overflow-auto p-4 pointer-events-none" style={{ scrollbarWidth: 'none' }}>
            <HighlightedJs code={code} />
          </div>
          <textarea
            ref={taRef}
            value={code}
            onChange={e => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onScroll={syncScroll}
            className="absolute inset-0 w-full h-full bg-transparent text-transparent resize-none outline-none p-4 font-mono text-sm leading-6 border-none overflow-auto selection:bg-blue-500/25"
            style={{ fontFamily: "'JetBrains Mono','Fira Code',monospace", caretColor: accent, whiteSpace: 'pre', overflowWrap: 'normal' }}
            spellCheck={false}
            wrap="off"
          />
        </div>
      </div>
    </div>
  );
};

/* ─── BROWSER PREVIEW ────────────────────────────────────────────── */
const DomPreview = ({ html, css, jsCode }: { html: string; css: string; jsCode: string }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;
    const src = html
      .replace('href="style.css"', '')
      .replace('<link rel="stylesheet" href="style.css">', `<style>${css}</style>`)
      .replace('<script src="script.js"></script>', `<script>${jsCode}</script>`);
    doc.open();
    doc.write(src);
    doc.close();
  }, [html, css, jsCode]);

  return (
    <div className="w-full h-full flex flex-col bg-zinc-100">
      <div className="bg-zinc-200 border-b border-zinc-300 px-3 py-1.5 flex items-center gap-3 flex-none">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 bg-white border border-zinc-300 rounded px-2 py-0.5 text-[9px] font-mono text-zinc-500">preview.html</div>
        <span className="text-[9px] font-bold text-emerald-600 uppercase">Live</span>
      </div>
      <iframe ref={iframeRef} className="flex-1 w-full border-none bg-white" title="preview" sandbox="allow-scripts" />
    </div>
  );
};

/* ─── CONSOLE OUTPUT ─────────────────────────────────────────────── */
const ConsoleOutput = ({ output, hasError, onRun, onClear, accent }: {
  output: string[]; hasError: boolean; onRun: () => void; onClear: () => void; accent: string;
}) => (
  <div className="w-full h-full flex flex-col bg-[#0d0d0e]">
    <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-white/8 flex-none">
      <div className="flex items-center gap-2">
        <Terminal className="w-4 h-4" style={{ color: accent }} />
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Console</span>
      </div>
      <div className="flex gap-2">
        <button onClick={onClear} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest bg-white/5 border border-white/8 text-zinc-400 hover:text-white transition-all">
          <RotateCcw className="w-3 h-3" /> Clear
        </button>
        <button onClick={onRun} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all" style={{ background: `${accent}20`, borderColor: `${accent}40`, color: accent }}>
          <Play className="w-3 h-3" /> Run
        </button>
      </div>
    </div>
    <div className="flex-1 p-4 font-mono text-sm overflow-auto space-y-0.5" style={{ fontFamily: "'JetBrains Mono','Fira Code',monospace" }}>
      {output.length === 0 ? (
        <div className="text-zinc-600 italic text-xs">Press Run to execute your code...</div>
      ) : output.map((line, i) => (
        <div key={i} className="flex gap-3 py-0.5">
          <span className="text-zinc-700 select-none text-xs w-5 text-right flex-none">{i + 1}</span>
          <span className={line.startsWith('❌') || hasError ? 'text-red-400' : 'text-emerald-400'}>{line}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ─── MAIN COMPONENT ─────────────────────────────────────────────── */
type PanelView = 'code' | 'preview' | 'output';
type FileTab = 'js' | 'html' | 'css';

function JsLessonContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSlide = Math.max(0, Math.min(parseInt(searchParams.get('slide') || '1') - 1, slides.length - 1));

  const [current, setCurrent] = useState(initialSlide);
  const [panelView, setPanelView] = useState<PanelView>('code');
  const [fileTab, setFileTab] = useState<FileTab>('js');
  const [codes, setCodes] = useState<string[]>(slides.map(s => s.code));
  const [output, setOutput] = useState<string[]>([]);
  const [hasError, setHasError] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dir, setDir] = useState(1);

  const slide = slides[current];
  const IconComp = slide.icon;
  const hasDOM = !!(slide.html || slide.css);
  const progress = ((current + 1) / slides.length) * 100;

  // URL sync
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('slide', (current + 1).toString());
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [current]);

  const goTo = useCallback((idx: number, direction: number) => {
    if (isAnimating) return;
    setDir(direction);
    setIsAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setPanelView('code');
      setFileTab('js');
      setOutput([]);
      setHasError(false);
      setIsAnimating(false);
    }, 300);
  }, [isAnimating]);

  const next = () => goTo((current + 1) % slides.length, 1);
  const prev = () => goTo((current - 1 + slides.length) % slides.length, -1);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, isAnimating]);

  const updateCode = (val: string) => {
    const next = [...codes];
    next[current] = val;
    setCodes(next);
  };

  const runCode = () => {
    const workerSrc = `
      self.onmessage = function(ev) {
        const logs = [];
        const con = {
          log: (...a) => logs.push(a.map(x => typeof x === 'object' && x !== null ? JSON.stringify(x) : String(x)).join(' ')),
          warn: (...a) => con.log('WARN:', ...a),
          error: (...a) => con.log('ERROR:', ...a),
        };
        try {
          new Function('console', ev.data)(con);
          self.postMessage({ ok: true, logs });
        } catch(e) {
          self.postMessage({ ok: false, logs, msg: e && e.message ? e.message : String(e) });
        }
      };
    `;
    const url = URL.createObjectURL(new Blob([workerSrc], { type: 'application/javascript' }));
    const worker = new Worker(url);
    const tid = setTimeout(() => {
      worker.terminate();
      URL.revokeObjectURL(url);
      setOutput(['❌ Timed out — possible infinite loop']);
      setHasError(true);
      setPanelView('output');
    }, 2500);
    worker.onmessage = ev => {
      clearTimeout(tid);
      worker.terminate();
      URL.revokeObjectURL(url);
      const { ok, logs, msg } = ev.data;
      const out = ok ? (logs.length ? logs : ['// No output']) : [...(logs || []), `❌ ${msg}`];
      setOutput(out);
      setHasError(!ok);
      setPanelView('output');
    };
    worker.onerror = ev => {
      clearTimeout(tid);
      worker.terminate();
      URL.revokeObjectURL(url);
      setOutput([`❌ ${ev.message}`]);
      setHasError(true);
      setPanelView('output');
    };
    worker.postMessage(codes[current]);
  };

  const variants = {
    enter: (d: number) => ({ x: d * 50, opacity: 0, scale: 0.97 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d * -50, opacity: 0, scale: 0.97 }),
  };

  return (
    <div
      className="min-h-screen text-white flex flex-col overflow-hidden"
      style={{ background: '#080c14', fontFamily: "'Inter','DM Sans',system-ui,sans-serif" }}
    >
      {/* Dynamic bg glow */}
      <div className="fixed inset-0 pointer-events-none transition-all duration-700" style={{ background: slide.bg }} />
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.02) 0%, transparent 70%)' }} />

      {/* ── HEADER ── */}
      <header className="relative z-20 flex items-center gap-4 px-6 py-3 border-b border-white/8 bg-black/20 backdrop-blur-xl flex-none">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center border border-white/10 flex-none" style={{ background: `${slide.accent}20` }}>
          <IconComp className="w-3.5 h-3.5" style={{ color: slide.accent }} />
        </div>
        <div className="flex-none">
          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-600 font-bold">Module 03 · Weeks 04–06</p>
          <p className="text-xs font-black text-white tracking-tight">JavaScript Mastery</p>
        </div>

        {/* Progress */}
        <div className="flex-1 mx-6 hidden md:block">
          <div className="h-0.5 bg-white/8 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: slide.accent }} />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border" style={{ color: slide.tagColor, borderColor: `${slide.tagColor}40`, background: `${slide.tagColor}12` }}>{slide.tag}</span>
          <span className="text-xs font-mono text-zinc-600 ml-1">{current + 1}<span className="text-zinc-800">/{slides.length}</span></span>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row overflow-hidden">

        {/* LEFT — Lesson */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={`left-${current}`}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
            className="flex-none lg:w-[400px] xl:w-[440px] flex flex-col justify-between p-6 lg:p-8 lg:border-r border-white/8 overflow-y-auto"
          >
            <div className="space-y-5">
              {/* ID + Title */}
              <div className="flex items-start gap-3">
                <div
                  className="text-4xl font-black tabular-nums leading-none flex-none pt-1"
                  style={{ color: `${slide.accent}35`, fontFamily: "'JetBrains Mono',monospace" }}
                >
                  {slide.id}
                </div>
                <div>
                  <h1 className="text-xl xl:text-2xl font-black leading-tight text-white">{slide.title}</h1>
                  <p className="text-sm text-zinc-400 font-medium mt-0.5">{slide.subtitle}</p>
                </div>
              </div>

              {/* Bullets */}
              <div className="space-y-2.5">
                {slide.content.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.05 }}
                    className="flex items-start gap-2.5"
                  >
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-none" style={{ background: slide.accent }} />
                    <p className="text-sm text-zinc-300 leading-relaxed font-medium">{item}</p>
                  </motion.div>
                ))}
              </div>

              {/* Syntax panel */}
              <SyntaxPanel syntax={slide.syntax} accent={slide.accent} />

              {/* Lab callout */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="rounded-xl border p-3.5 flex gap-2.5"
                style={{ background: `${slide.accent}0a`, borderColor: `${slide.accent}28` }}
              >
                <Play className="w-3.5 h-3.5 flex-none mt-0.5" style={{ color: slide.accent }} />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest mb-0.5" style={{ color: slide.accent }}>Lab Exercise</p>
                  <p className="text-xs text-zinc-300 leading-relaxed">{slide.lab}</p>
                </div>
              </motion.div>
            </div>

            {/* Nav */}
            <div className="flex items-center gap-3 mt-6 lg:mt-0">
              <button onClick={prev} className="p-2.5 rounded-xl bg-white/5 border border-white/8 hover:bg-white/10 active:scale-95 transition-all flex items-center gap-1.5">
                <ChevronLeft className="w-4 h-4" />
                <span className="text-xs font-bold hidden sm:inline">Prev</span>
              </button>
              <button
                onClick={next}
                className="flex-1 py-2.5 px-4 rounded-xl font-black text-xs active:scale-95 transition-all flex items-center justify-center gap-2"
                style={{ background: slide.accent, color: '#000' }}
              >
                {current === slides.length - 1 ? 'Restart' : 'Next Lesson'}
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* RIGHT — Editor / Preview / Output */}
        <div className="flex-1 flex flex-col overflow-hidden p-4 lg:p-5 gap-3">

          {/* Panel toolbar */}
          <div className="flex items-center justify-between flex-none">
            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/8">
              {/* JS tab always */}
              <button
                onClick={() => { setPanelView('code'); setFileTab('js'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${panelView === 'code' && fileTab === 'js' ? 'text-black shadow-sm' : 'text-zinc-400 hover:text-white'}`}
                style={panelView === 'code' && fileTab === 'js' ? { background: slide.accent } : {}}
              >
                <Code2 className="w-3 h-3" /> JS
              </button>

              {/* HTML/CSS only for DOM slides */}
              {hasDOM && <>
                <button
                  onClick={() => { setPanelView('code'); setFileTab('html'); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${panelView === 'code' && fileTab === 'html' ? 'bg-orange-500 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}
                >
                  HTML
                </button>
                <button
                  onClick={() => { setPanelView('code'); setFileTab('css'); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${panelView === 'code' && fileTab === 'css' ? 'bg-pink-500 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}
                >
                  CSS
                </button>
                <button
                  onClick={() => setPanelView('preview')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${panelView === 'preview' ? 'bg-emerald-500 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}
                >
                  <Monitor className="w-3 h-3" /> Preview
                </button>
              </>}

              <button
                onClick={() => { runCode(); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${panelView === 'output' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:text-white'}`}
              >
                <Play className="w-3 h-3" /> Run
              </button>
            </div>

            <button
              onClick={() => { const n = [...codes]; n[current] = slides[current].code; setCodes(n); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-white border border-white/8 hover:border-white/20 bg-white/3 hover:bg-white/8 transition-all"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Panel content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`panel-${current}-${panelView}-${fileTab}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-hidden rounded-xl border border-white/8"
            >
              {panelView === 'code' && fileTab === 'js' && (
                <CodeEditor code={codes[current]} onChange={updateCode} accent={slide.accent} />
              )}
              {panelView === 'code' && fileTab === 'html' && (
                <div className="w-full h-full bg-[#0d1117] p-4 overflow-auto">
                  <pre className="text-xs leading-6 text-orange-300 font-mono whitespace-pre" style={{ fontFamily: "'JetBrains Mono',monospace" }}>{slide.html}</pre>
                </div>
              )}
              {panelView === 'code' && fileTab === 'css' && (
                <div className="w-full h-full bg-[#0d1117] p-4 overflow-auto">
                  <pre className="text-xs leading-6 text-pink-300 font-mono whitespace-pre" style={{ fontFamily: "'JetBrains Mono',monospace" }}>{slide.css}</pre>
                </div>
              )}
              {panelView === 'preview' && hasDOM && (
                <DomPreview html={slide.html!} css={slide.css!} jsCode={codes[current]} />
              )}
              {panelView === 'output' && (
                <ConsoleOutput
                  output={output}
                  hasError={hasError}
                  onRun={runCode}
                  onClear={() => { setOutput([]); setHasError(false); }}
                  accent={slide.accent}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ── FOOTER DOTS ── */}
      <footer className="relative z-20 flex justify-center items-center gap-2 py-3 border-t border-white/8 bg-black/20 backdrop-blur-xl flex-none">
        {slides.map((s, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? 1 : -1)}
            title={s.title}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? 24 : 6,
              height: 6,
              background: i === current ? slide.accent : 'rgba(255,255,255,0.12)',
            }}
          />
        ))}
      </footer>

      {/* Keyboard hint */}
      <div className="fixed bottom-12 right-4 text-[9px] text-zinc-800 font-mono hidden lg:flex items-center gap-1">
        <kbd className="px-1 py-0.5 border border-zinc-800 rounded text-[8px]">←</kbd>
        <kbd className="px-1 py-0.5 border border-zinc-800 rounded text-[8px]">→</kbd>
        navigate
      </div>
    </div>
  );
}

export default function JsLessonSlides() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin mx-auto" />
          <p className="text-zinc-600 text-sm font-mono">Loading JS Lab...</p>
        </div>
      </div>
    }>
      <JsLessonContent />
    </Suspense>
  );
}