"use client";

import React, { useState, useEffect, useCallback, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ChevronLeft, ChevronRight, Code2, Copy, Check, Play, RotateCcw,
  Zap, MousePointer2, SplitSquareHorizontal, Cpu, Layout, Workflow,
  FormInput, List, ArrowRight, Share2, Atom, Sparkles, Layers, Target,
  Smartphone, RefreshCw, Box, Eye, Activity, ShieldAlert, FastForward,
  Gauge, ShieldCheck, Rocket, Palette, Globe, Send, Terminal,
  Component, FileCode, GitBranch, Package,
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
  icon: React.ElementType;
}

const slides: Slide[] = [
  {
    id: "00", title: "Welcome to React", subtitle: "The UI Library",
    tag: "Overview", tagColor: "#60a5fa", accent: "#3b82f6",
    bg: "radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.12) 0%, transparent 60%)",
    content: ["A JavaScript library for building user interfaces", "Uses a Virtual DOM for lightning-fast updates", "Created by Meta — powers Instagram and Netflix", "Core idea: UI = f(State)"],
    lab: "Change the core concept text to 'UI = Function(Data)'.",
    syntax: `// UI is a pure function of state\nfunction App() {\n  return <h1>Hello World</h1>;\n}`,
    code: `// React is just JavaScript!\nimport React from 'react';\nimport ReactDOM from 'react-dom/client';\n\nfunction App() {\n  return (\n    <div>\n      <h1>Hello, React!</h1>\n      <p>UI = f(State)</p>\n    </div>\n  );\n}\n\nReactDOM.createRoot(\n  document.getElementById('root')\n).render(<App />);`,
    icon: Atom,
  },
  {
    id: "01", title: "Project Setup", subtitle: "Vite & Structure",
    tag: "Setup", tagColor: "#fbbf24", accent: "#f59e0b",
    bg: "radial-gradient(ellipse at 70% 30%, rgba(245,158,11,0.12) 0%, transparent 60%)",
    content: ["Vite is the modern way to scaffold React projects", "'src/' is where you write all your code", "'node_modules/' holds your installed packages", "Run 'npm run dev' to start the live dev server"],
    lab: "Identify the main folder where you write your code (src).",
    syntax: `# Create a React + TypeScript project\nnpm create vite@latest my-app -- --template react-ts\ncd my-app && npm install && npm run dev`,
    code: `// src/main.tsx — entry point\nimport React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\nimport './index.css';\n\nReactDOM.createRoot(\n  document.getElementById('root')!\n).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);\n\n// src/App.tsx — root component\nexport default function App() {\n  return <h1>It works!</h1>;\n}`,
    icon: Zap,
  },
  {
    id: "02", title: "JSX Syntax", subtitle: "JavaScript XML",
    tag: "Syntax", tagColor: "#818cf8", accent: "#6366f1",
    bg: "radial-gradient(ellipse at 30% 70%, rgba(99,102,241,0.12) 0%, transparent 60%)",
    content: ["JSX — write HTML-like structure inside JavaScript", "Expressions in curly braces { } are evaluated as JS", "Use className instead of class (it's JavaScript)", "Every JSX element must have a single root"],
    lab: "Add a second variable 'score' and display it in a <p> tag.",
    syntax: `// JSX expression\nconst element = <h1 className="title">Hello {user}</h1>;`,
    code: `function Header() {\n  const user = "Student";\n  const score = 95;\n\n  return (\n    <header>\n      <h1>Welcome, {user}!</h1>\n      <p>Score: {score}</p>\n      <p>Math: {10 + 5 * 2}</p>\n      <p className="highlight">\n        {score >= 90 ? "Excellent!" : "Good work"}\n      </p>\n    </header>\n  );\n}`,
    icon: Code2,
  },
  {
    id: "03", title: "Components", subtitle: "Reusable Building Blocks",
    tag: "Core", tagColor: "#2dd4bf", accent: "#14b8a6",
    bg: "radial-gradient(ellipse at 60% 40%, rgba(20,184,166,0.12) 0%, transparent 60%)",
    content: ["Components are functions that return JSX", "Must start with a Capital letter (PascalCase)", "Build complex UIs by composing small components", "Hierarchy: Page → Section → Card → Button"],
    lab: "Create a 'Footer' component and add it inside 'Page'.",
    syntax: `// Define once, use anywhere\nfunction MyComponent() { return <div />; }`,
    code: `function Button({ label }: { label: string }) {\n  return (\n    <button className="btn">{label}</button>\n  );\n}\n\nfunction Header() {\n  return <h1>My App</h1>;\n}\n\nfunction Page() {\n  return (\n    <div>\n      <Header />\n      <Button label="Sign In" />\n      <Button label="Sign Up" />\n    </div>\n  );\n}`,
    icon: Component,
  },
  {
    id: "04", title: "Props", subtitle: "Passing Data Down",
    tag: "Data", tagColor: "#fb7185", accent: "#f43f5e",
    bg: "radial-gradient(ellipse at 25% 55%, rgba(244,63,94,0.12) 0%, transparent 60%)",
    content: ["Props — inputs passed from parent to child component", "They are read-only (immutable) inside the child", "Destructure props for cleaner code", "Think of props like function arguments"],
    lab: "Pass an additional 'points' prop to the Profile component.",
    syntax: `// Pass props like HTML attributes\n<Profile name="Alice" role="Dev" />`,
    code: `// Child: receives props\nfunction Profile({\n  name,\n  role,\n  avatar\n}: {\n  name: string;\n  role: string;\n  avatar: string;\n}) {\n  return (\n    <div className="card">\n      <img src={avatar} alt={name} />\n      <h2>{name}</h2>\n      <p>{role}</p>\n    </div>\n  );\n}\n\n// Parent: passes data\nfunction App() {\n  return (\n    <Profile\n      name="Ratha"\n      role="Developer"\n      avatar="/ratha.jpg"\n    />\n  );\n}`,
    icon: ArrowRight,
  },
  {
    id: "05", title: "State", subtitle: "Component Memory",
    tag: "Hooks", tagColor: "#fbbf24", accent: "#f59e0b",
    bg: "radial-gradient(ellipse at 70% 60%, rgba(245,158,11,0.12) 0%, transparent 60%)",
    content: ["State — private data that lives inside a component", "Changing state triggers a UI re-render automatically", "useState returns [value, setterFunction]", "Never mutate state directly — always use the setter"],
    lab: "Add a 'Reset' button that sets count back to 0.",
    syntax: `const [val, setVal] = useState(initialValue);`,
    code: `import { useState } from 'react';\n\nfunction Likes() {\n  const [count, setCount] = useState(0);\n  const [liked, setLiked] = useState(false);\n\n  return (\n    <div>\n      <button\n        onClick={() => {\n          setCount(count + 1);\n          setLiked(true);\n        }}\n      >\n        {liked ? "❤️" : "🤍"} {count} Likes\n      </button>\n      <button onClick={() => setCount(0)}>\n        Reset\n      </button>\n    </div>\n  );\n}`,
    icon: RotateCcw,
  },
  {
    id: "06", title: "Lifting State Up", subtitle: "Sharing Between Siblings",
    tag: "Patterns", tagColor: "#60a5fa", accent: "#3b82f6",
    bg: "radial-gradient(ellipse at 40% 25%, rgba(59,130,246,0.12) 0%, transparent 60%)",
    content: ["When siblings need the same data, move state to their parent", "Parent owns the state and passes it down via props", "Children call parent functions to trigger changes", "This keeps a single source of truth"],
    lab: "Move 'activeId' state from a child up to the Parent component.",
    syntax: `// Parent shares state and handlers\n<Child value={state} onChange={handler} />`,
    code: `function Parent() {\n  const [activeId, setActiveId] = useState(0);\n\n  return (\n    <div>\n      {/* Both stay in sync via parent */}\n      <Tabs\n        current={activeId}\n        onSelect={setActiveId}\n      />\n      <Content current={activeId} />\n    </div>\n  );\n}\n\nfunction Tabs({ current, onSelect }: {\n  current: number;\n  onSelect: (id: number) => void;\n}) {\n  return (\n    <nav>\n      {[0, 1, 2].map(i => (\n        <button key={i} onClick={() => onSelect(i)}>\n          Tab {i + 1}\n        </button>\n      ))}\n    </nav>\n  );\n}`,
    icon: Workflow,
  },
  {
    id: "07", title: "Rendering Logic", subtitle: "Conditions & Lists",
    tag: "Core", tagColor: "#34d399", accent: "#10b981",
    bg: "radial-gradient(ellipse at 55% 65%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    content: ["Conditional: {condition && <JSX />} for toggle visibility", "Ternary: {a ? <X /> : <Y />} for if/else in JSX", "Lists: .map() to render arrays of elements", "key prop: required on list items for React's reconciler"],
    lab: "Add a 'delete' button next to each list item in the map.",
    syntax: `{isReady && <Spinner />}\n{items.map(i => <li key={i.id}>{i.name}</li>)}`,
    code: `function TaskList({ tasks }: {\n  tasks: { id: number; name: string; done: boolean }[];\n}) {\n  const [show, setShow] = useState(true);\n\n  return (\n    <div>\n      <button onClick={() => setShow(!show)}>\n        {show ? "Hide" : "Show"} Tasks\n      </button>\n\n      {show && (\n        <ul>\n          {tasks.map(task => (\n            <li key={task.id}>\n              {task.done ? "✅" : "⬜"} {task.name}\n            </li>\n          ))}\n        </ul>\n      )}\n    </div>\n  );\n}`,
    icon: List,
  },
  {
    id: "08", title: "Forms & Inputs", subtitle: "Controlled Components",
    tag: "Interactivity", tagColor: "#c084fc", accent: "#a855f7",
    bg: "radial-gradient(ellipse at 20% 40%, rgba(168,85,247,0.12) 0%, transparent 60%)",
    content: ["Controlled component — React owns the input value via state", "Every keystroke calls onChange to update state", "This enables real-time validation and live feedback", "onSubmit — handle form submission with e.preventDefault()"],
    lab: "Add a 'Clear' button that empties the search query.",
    syntax: `<input value={text} onChange={e => setText(e.target.value)} />`,
    code: `function Search() {\n  const [query, setQuery] = useState("");\n  const [results, setResults] = useState<string[]>([]);\n\n  const handleSubmit = (e: React.FormEvent) => {\n    e.preventDefault();\n    setResults([query, "result 2", "result 3"]);\n  };\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input\n        placeholder="Search..."\n        value={query}\n        onChange={e => setQuery(e.target.value)}\n      />\n      <button type="submit">Search</button>\n      <button type="button" onClick={() => setQuery("")}>\n        Clear\n      </button>\n      {results.map((r, i) => <p key={i}>{r}</p>)}\n    </form>\n  );\n}`,
    icon: FormInput,
  },
  {
    id: "09", title: "Fragments", subtitle: "Ghost Wrappers",
    tag: "Syntax", tagColor: "#38bdf8", accent: "#0ea5e9",
    bg: "radial-gradient(ellipse at 65% 35%, rgba(14,165,233,0.12) 0%, transparent 60%)",
    content: ["Fragments group elements without adding DOM nodes", "Use <> ... </> shorthand or <React.Fragment>", "Essential for table rows, flex children, and grid items", "Prevents unnecessary div wrappers that break layouts"],
    lab: "Replace a wrapper <div> with a Fragment <> in your component.",
    syntax: `// Groups without adding a DOM node\n<> <A /> <B /> </>`,
    code: `// Without Fragment — BREAKS table layout!\nfunction BadColumns() {\n  return (\n    <div>         {/* <div> inside <tr>? ❌ */}\n      <td>Name</td>\n      <td>Price</td>\n    </div>\n  );\n}\n\n// With Fragment — WORKS correctly! ✅\nfunction GoodColumns() {\n  return (\n    <>\n      <td>Name</td>\n      <td>Price</td>\n    </>\n  );\n}\n\nfunction Table() {\n  return (\n    <table><tbody>\n      <tr><GoodColumns /></tr>\n    </tbody></table>\n  );\n}`,
    icon: Layers,
  },
  {
    id: "10", title: "useEffect", subtitle: "Side Effects Hook",
    tag: "Hooks", tagColor: "#fb923c", accent: "#f97316",
    bg: "radial-gradient(ellipse at 35% 60%, rgba(249,115,22,0.12) 0%, transparent 60%)",
    content: ["useEffect — run code outside the React render cycle", "[] — runs once when component mounts", "[dep] — runs whenever 'dep' changes", "Return a cleanup function to avoid memory leaks"],
    lab: "Use useEffect to console.log('Mounted!') once when the app starts.",
    syntax: `useEffect(() => {\n  // side effect here\n  return () => { /* cleanup */ };\n}, [dependencies]);`,
    code: `import { useState, useEffect } from 'react';\n\nfunction DataFetcher() {\n  const [users, setUsers] = useState<string[]>([]);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    // Runs once on mount\n    fetch('/api/users')\n      .then(res => res.json())\n      .then(data => {\n        setUsers(data);\n        setLoading(false);\n      });\n\n    // Cleanup (e.g. cancel subscriptions)\n    return () => console.log("unmounted");\n  }, []); // empty = once only\n\n  if (loading) return <p>Loading...</p>;\n  return <div>{users.length} users loaded</div>;\n}`,
    icon: Zap,
  },
  {
    id: "11", title: "useContext", subtitle: "Global State Broadcasting",
    tag: "Hooks", tagColor: "#a78bfa", accent: "#8b5cf6",
    bg: "radial-gradient(ellipse at 70% 50%, rgba(139,92,246,0.12) 0%, transparent 60%)",
    content: ["Context avoids 'prop drilling' through many layers", "createContext — creates a named data channel", "Provider — wraps the tree that needs the data", "useContext — reads the value from any descendant"],
    lab: "Create a 'LanguageContext' to switch between English and Khmer.",
    syntax: `const ThemeCtx = createContext('dark');\n// Any child: const theme = useContext(ThemeCtx);`,
    code: `import { createContext, useContext, useState } from 'react';\n\nconst ThemeContext = createContext<'light' | 'dark'>('dark');\n\nfunction App() {\n  const [theme, setTheme] = useState<'light' | 'dark'>('dark');\n\n  return (\n    <ThemeContext.Provider value={theme}>\n      <button onClick={() =>\n        setTheme(t => t === 'dark' ? 'light' : 'dark')\n      }>\n        Toggle Theme\n      </button>\n      <Navbar />\n      <Content />\n    </ThemeContext.Provider>\n  );\n}\n\nfunction Navbar() {\n  const theme = useContext(ThemeContext);\n  return <nav className={theme}>Navbar</nav>; // no props needed!\n}`,
    icon: Share2,
  },
  {
    id: "12", title: "Advanced Hooks", subtitle: "Performance & Complexity",
    tag: "Hooks", tagColor: "#fb923c", accent: "#ea580c",
    bg: "radial-gradient(ellipse at 25% 30%, rgba(234,88,12,0.12) 0%, transparent 60%)",
    content: ["useReducer — complex state (shopping carts, forms)", "useMemo — cache expensive computed values", "useCallback — cache function references for children", "useRef — access DOM nodes or persist values without re-render"],
    lab: "Use useMemo to calculate the total price of items in a cart.",
    syntax: `const val = useMemo(() => heavyCalc(), [dep]);\nconst fn  = useCallback(() => action(), [dep]);`,
    code: `import { useReducer, useMemo, useCallback } from 'react';\n\ntype Action = { type: 'ADD' | 'REMOVE'; id: number };\ntype Item   = { id: number; name: string; price: number };\n\nfunction cartReducer(state: Item[], action: Action): Item[] {\n  if (action.type === 'REMOVE')\n    return state.filter(i => i.id !== action.id);\n  return state;\n}\n\nfunction Cart({ items }: { items: Item[] }) {\n  const [cart, dispatch] = useReducer(cartReducer, items);\n\n  const total = useMemo(\n    () => cart.reduce((sum, i) => sum + i.price, 0),\n    [cart] // recalculates only when cart changes\n  );\n\n  const remove = useCallback(\n    (id: number) => dispatch({ type: 'REMOVE', id }),\n    [] // stable reference\n  );\n\n  return <div>Total: \${total}</div>;\n}`,
    icon: Cpu,
  },
  {
    id: "13", title: "Custom Hooks", subtitle: "Reusable Logic",
    tag: "Patterns", tagColor: "#4ade80", accent: "#22c55e",
    bg: "radial-gradient(ellipse at 60% 20%, rgba(34,197,94,0.12) 0%, transparent 60%)",
    content: ["Extract repeated hook logic into a 'use' function", "Custom hooks can use other hooks inside them", "They return whatever the consuming component needs", "Example: useToggle, useFetch, useLocalStorage"],
    lab: "Create a 'useWindowSize' hook that returns the screen width.",
    syntax: `function useToggle(init = false) {\n  const [on, set] = useState(init);\n  return [on, () => set(!on)] as const;\n}`,
    code: `import { useState, useEffect } from 'react';\n\n// Reusable toggle logic\nfunction useToggle(initial = false) {\n  const [state, setState] = useState(initial);\n  const toggle = () => setState(s => !s);\n  return [state, toggle] as const;\n}\n\n// Reusable fetch logic\nfunction useFetch<T>(url: string) {\n  const [data, setData]     = useState<T | null>(null);\n  const [loading, setLoad]  = useState(true);\n  const [error, setError]   = useState<string | null>(null);\n\n  useEffect(() => {\n    fetch(url)\n      .then(r => r.json())\n      .then(setData)\n      .catch(e => setError(e.message))\n      .finally(() => setLoad(false));\n  }, [url]);\n\n  return { data, loading, error };\n}\n\nfunction Modal() {\n  const [isOpen, toggle] = useToggle();\n  return <button onClick={toggle}>{isOpen ? "Close" : "Open"}</button>;\n}`,
    icon: Sparkles,
  },
  {
    id: "14", title: "RSCs & Suspense", subtitle: "Modern React Patterns",
    tag: "Advanced", tagColor: "#60a5fa", accent: "#3b82f6",
    bg: "radial-gradient(ellipse at 45% 65%, rgba(59,130,246,0.12) 0%, transparent 60%)",
    content: ["React Server Components render on the server — zero client JS", "No useEffect needed — fetch data directly with await", "Suspense — show a fallback while async children load", "Next.js makes RSCs the default for all /app components"],
    lab: "Wrap a component in <Suspense> and show a 'Loading…' fallback.",
    syntax: `<Suspense fallback={<Skeleton />}>\n  <SlowComponent />\n</Suspense>`,
    code: `// app/profile/page.tsx — Server Component\nasync function getUser(id: string) {\n  return fetch(\`/api/users/\${id}\`).then(r => r.json());\n}\n\nexport default async function ProfilePage(\n  { params }: { params: { id: string } }\n) {\n  // No useEffect — direct await!\n  const user = await getUser(params.id);\n\n  return (\n    <section>\n      <h2>{user.name}</h2>\n      <p>{user.bio}</p>\n    </section>\n  );\n}\n\n// Parent wraps with Suspense\nimport { Suspense } from 'react';\n\nexport default function Page() {\n  return (\n    <Suspense fallback={<p>Loading profile…</p>}>\n      <ProfilePage params={{ id: "1" }} />\n    </Suspense>\n  );\n}`,
    icon: Layers,
  },
  {
    id: "15", title: "Performance & Deploy", subtitle: "Ship It Right",
    tag: "Production", tagColor: "#34d399", accent: "#10b981",
    bg: "radial-gradient(ellipse at 70% 40%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    content: ["React DevTools Profiler — find slow re-renders visually", "React Testing Library — test what the user sees", "Vercel / Netlify — zero-config deploy from GitHub", "Build runs dead-code elimination and tree-shaking"],
    lab: "Find one slow component using the React DevTools Profiler.",
    syntax: `# Build for production\nnpm run build\n# Preview the build locally\nnpm run preview`,
    code: `/* PRODUCTION CHECKLIST 2026:\n\n  Architecture:\n  ✅ TypeScript — type safety\n  ✅ Next.js    — routing + RSC\n  ✅ Tailwind   — utility CSS\n\n  Data:\n  ✅ TanStack Query — server state\n  ✅ Zustand        — client state\n\n  Quality:\n  ✅ Vitest + RTL   — unit tests\n  ✅ Playwright     — E2E tests\n  ✅ ESLint + Prettier\n\n  Deploy:\n  ✅ Vercel (connect GitHub → done)\n*/`,
    icon: Target,
  },
  {
    id: "16", title: "Virtual DOM", subtitle: "The Reconciler",
    tag: "Internals", tagColor: "#38bdf8", accent: "#0ea5e9",
    bg: "radial-gradient(ellipse at 30% 55%, rgba(14,165,233,0.12) 0%, transparent 60%)",
    content: ["Virtual DOM — a lightweight JS copy of the real DOM", "React compares old vs new snapshot (diffing algorithm)", "Only the changed nodes get updated in the real browser", "Keys tell React which list item moved or stayed"],
    lab: "Add unique 'id' keys to a list and observe warnings without them.",
    syntax: `// React: "Only the color changed — patch that one attribute."\n// Result: No full re-render needed.`,
    code: `/* RECONCILIATION STEPS:\n\n  1. State update triggers re-render\n  2. React creates new Virtual DOM tree\n  3. Diffing algorithm: Old vs New\n  4. "Fiber" applies minimal patches\n     to the real DOM\n\n  Example diff:\n  OLD: <button style={{ color: 'red' }} />\n  NEW: <button style={{ color: 'blue' }} />\n\n  React patches: element.style.color = 'blue'\n  NOT: remove old button, insert new button\n*/`,
    icon: Eye,
  },
  {
    id: "17", title: "Immutable State", subtitle: "Objects & Arrays",
    tag: "Patterns", tagColor: "#fbbf24", accent: "#f59e0b",
    bg: "radial-gradient(ellipse at 55% 35%, rgba(245,158,11,0.12) 0%, transparent 60%)",
    content: ["Golden rule — never mutate state directly", "React can't detect mutations — always create a new copy", "Spread operator (...) to copy and modify objects/arrays", "For arrays: spread, filter, and map are your tools"],
    lab: "Update a user's 'age' property in state using the spread operator.",
    syntax: `// Correct: create a new object\nsetUser({ ...user, name: 'Alice' });\n// Correct: create a new array\nsetList([...list, newItem]);`,
    code: `const [list, setList] = useState([1, 2, 3]);\nconst [profile, setProfile] = useState({\n  name: "Ratha",\n  active: false,\n});\n\n// ✅ Add — create new array\nconst addItem = (item: number) => {\n  setList(prev => [...prev, item]);\n};\n\n// ✅ Remove — filter creates new array\nconst removeItem = (item: number) => {\n  setList(prev => prev.filter(i => i !== item));\n};\n\n// ✅ Update object — spread + override\nconst activate = () => {\n  setProfile(prev => ({ ...prev, active: true }));\n};\n\n// ❌ WRONG — direct mutation React won't see\n// profile.active = true; // never do this!`,
    icon: Box,
  },
  {
    id: "18", title: "Composition", subtitle: "The Children Prop",
    tag: "Patterns", tagColor: "#fb7185", accent: "#f43f5e",
    bg: "radial-gradient(ellipse at 20% 60%, rgba(244,63,94,0.12) 0%, transparent 60%)",
    content: ["Composition — pass components as children to other components", "children prop holds whatever is nested inside the tag", "Use slots pattern for multiple named insert points", "Prefer composition over deeply nested prop passing"],
    lab: "Create a 'Card' component that styles its children with a border.",
    syntax: `function Box({ children }) {\n  return <div className="box">{children}</div>;\n}`,
    code: `function Card({\n  title,\n  children,\n  footer,\n}: {\n  title: string;\n  children: React.ReactNode;\n  footer?: React.ReactNode;\n}) {\n  return (\n    <div className="card">\n      <header><h3>{title}</h3></header>\n      <main>{children}</main>\n      {footer && <footer>{footer}</footer>}\n    </div>\n  );\n}\n\n// Usage:\n<Card\n  title="Profile"\n  footer={<button>Edit</button>}\n>\n  <p>Bio: Full Stack Developer</p>\n  <p>Location: Phnom Penh</p>\n</Card>`,
    icon: Share2,
  },
  {
    id: "19", title: "Styling with Tailwind", subtitle: "Utility-First CSS",
    tag: "Styling", tagColor: "#f472b6", accent: "#ec4899",
    bg: "radial-gradient(ellipse at 65% 25%, rgba(236,72,153,0.12) 0%, transparent 60%)",
    content: ["Apply design directly in JSX using class names", "No separate .css files — styles live next to markup", "Tailwind v4: even faster builds, zero config needed", "Responsive: md:, lg: — Hover: hover: — Dark: dark:"],
    lab: "Style a button with hover effects and rounded corners using Tailwind.",
    syntax: `<div className="p-4 bg-blue-500 text-white rounded-xl" />`,
    code: `function ModernButton({\n  label,\n  variant = 'primary'\n}: {\n  label: string;\n  variant?: 'primary' | 'ghost';\n}) {\n  const base = "px-8 py-3 font-bold rounded-xl transition-all active:scale-95";\n  const styles = {\n    primary: "bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105",\n    ghost:   "border border-white/20 text-white hover:bg-white/10",\n  };\n\n  return (\n    <button className={[base, styles[variant]].join(" ")}>\n      {label}\n    </button>\n  );\n}\n\n// Usage:\n<ModernButton label="Get Started" />\n<ModernButton label="Learn More" variant="ghost" />`,
    icon: Palette,
  },
  {
    id: "20", title: "TanStack Query", subtitle: "Server State Manager",
    tag: "Data", tagColor: "#34d399", accent: "#10b981",
    bg: "radial-gradient(ellipse at 40% 70%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    content: ["Handles loading, error, and data states automatically", "Built-in caching — no duplicate requests", "Background refetching keeps UI fresh", "useMutation for POST/PUT/DELETE with cache invalidation"],
    lab: "Use useQuery to fetch data from 'https://api.github.com/users/octocat'.",
    syntax: `const { data, isLoading } = useQuery({\n  queryKey: ['users'],\n  queryFn: fetchUsers,\n});`,
    code: `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';\n\nfunction UserBoard() {\n  const qc = useQueryClient();\n\n  const { data, isLoading, isError } = useQuery({\n    queryKey: ['users'],\n    queryFn: () =>\n      fetch('/api/users').then(r => r.json()),\n    staleTime: 1000 * 60, // cache for 1 minute\n  });\n\n  const addUser = useMutation({\n    mutationFn: (user: { name: string }) =>\n      fetch('/api/users', { method: 'POST', body: JSON.stringify(user) }),\n    onSuccess: () =>\n      qc.invalidateQueries({ queryKey: ['users'] }),\n  });\n\n  if (isLoading) return <Spinner />;\n  if (isError)   return <p>Error loading users</p>;\n\n  return (\n    <ul>\n      {data.map((u: { id: number; name: string }) => (\n        <li key={u.id}>{u.name}</li>\n      ))}\n    </ul>\n  );\n}`,
    icon: Activity,
  },
  {
    id: "21", title: "React Router v7", subtitle: "Client-Side Routing",
    tag: "Routing", tagColor: "#60a5fa", accent: "#3b82f6",
    bg: "radial-gradient(ellipse at 25% 45%, rgba(59,130,246,0.12) 0%, transparent 60%)",
    content: ["SPA — swap components without full page reload", "BrowserRouter + Routes + Route define the URL map", "useParams — read dynamic segments like /items/:id", "Link — navigate without causing a full reload"],
    lab: "Add a 'Link' that takes the user to the '/profile' page.",
    syntax: `<Link to="/profile">Profile</Link>\nconst { id } = useParams();`,
    code: `import {\n  BrowserRouter, Routes, Route,\n  Link, useParams\n} from 'react-router-dom';\n\nfunction App() {\n  return (\n    <BrowserRouter>\n      <nav>\n        <Link to="/">Home</Link>\n        <Link to="/shop">Shop</Link>\n      </nav>\n      <Routes>\n        <Route path="/"          element={<Home />} />\n        <Route path="/shop"      element={<Shop />} />\n        <Route path="/item/:id"  element={<ItemDetail />} />\n        <Route path="*"          element={<NotFound />} />\n      </Routes>\n    </BrowserRouter>\n  );\n}\n\nfunction ItemDetail() {\n  const { id } = useParams();\n  return <h1>Item #{id}</h1>;\n}`,
    icon: Globe,
  },
  {
    id: "22", title: "React Portals", subtitle: "Escape the DOM Tree",
    tag: "Advanced", tagColor: "#a78bfa", accent: "#8b5cf6",
    bg: "radial-gradient(ellipse at 60% 55%, rgba(139,92,246,0.12) 0%, transparent 60%)",
    content: ["Portals teleport JSX to a different DOM node", "Useful for modals, tooltips, and toasts", "The component stays in the React tree (events bubble up)", "Render into document.body to escape overflow: hidden"],
    lab: "Create a basic Modal using createPortal at document.body.",
    syntax: `createPortal(<Modal />, document.body);`,
    code: `import { createPortal } from 'react-dom';\nimport { useState } from 'react';\n\nfunction Modal({ children, onClose }: {\n  children: React.ReactNode;\n  onClose: () => void;\n}) {\n  return createPortal(\n    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">\n      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">\n        {children}\n        <button onClick={onClose}>Close</button>\n      </div>\n    </div>,\n    document.body // ← rendered outside root div!\n  );\n}\n\nfunction App() {\n  const [open, setOpen] = useState(false);\n  return (\n    <>\n      <button onClick={() => setOpen(true)}>Open Modal</button>\n      {open && (\n        <Modal onClose={() => setOpen(false)}>\n          <h2>Hello from Portal!</h2>\n        </Modal>\n      )}\n    </>\n  );\n}`,
    icon: Layers,
  },
  {
    id: "23", title: "Error Boundaries", subtitle: "Crash Protection",
    tag: "Resilience", tagColor: "#f87171", accent: "#ef4444",
    bg: "radial-gradient(ellipse at 35% 25%, rgba(239,68,68,0.12) 0%, transparent 60%)",
    content: ["Error boundaries catch runtime errors in child components", "Prevents one broken widget from crashing the whole app", "Works like try/catch for the component tree", "Show a fallback UI instead of a white screen"],
    lab: "Wrap a component in ErrorBoundary and trigger a fake error.",
    syntax: `<ErrorBoundary fallback={<ErrorUI />}>\n  <RiskyComponent />\n</ErrorBoundary>`,
    code: `import { Component, ReactNode } from 'react';\n\ninterface Props {\n  fallback: ReactNode;\n  children: ReactNode;\n}\ninterface State { hasError: boolean; }\n\nclass ErrorBoundary extends Component<Props, State> {\n  state = { hasError: false };\n\n  static getDerivedStateFromError() {\n    return { hasError: true };\n  }\n\n  componentDidCatch(err: Error) {\n    console.error("Boundary caught:", err);\n  }\n\n  render() {\n    if (this.state.hasError) return this.props.fallback;\n    return this.props.children;\n  }\n}\n\n// Usage:\n<ErrorBoundary fallback={<p>Something went wrong.</p>}>\n  <DataGrid />   {/* if this crashes… */}\n</ErrorBoundary> {/* …user sees fallback */}`,
    icon: ShieldAlert,
  },
  {
    id: "24", title: "Code Splitting", subtitle: "Lazy Loading",
    tag: "Performance", tagColor: "#fbbf24", accent: "#eab308",
    bg: "radial-gradient(ellipse at 70% 60%, rgba(234,179,8,0.12) 0%, transparent 60%)",
    content: ["Lazy loading defers code until the user needs it", "React.lazy() imports a component dynamically", "Suspense shows a fallback while the chunk downloads", "Dramatically improves initial page load time"],
    lab: "Lazy load an 'About' page component and wrap it in <Suspense>.",
    syntax: `const Admin = React.lazy(() => import('./Admin'));\n// Only downloads when <Admin /> is rendered`,
    code: `import { Suspense, lazy } from 'react';\nimport { Routes, Route } from 'react-router-dom';\n\n// These chunks are NOT in the initial bundle\nconst Home       = lazy(() => import('./pages/Home'));\nconst AdminPanel = lazy(() => import('./pages/Admin'));\nconst Profile    = lazy(() => import('./pages/Profile'));\n\nfunction App() {\n  return (\n    <Suspense\n      fallback={\n        <div className="flex justify-center items-center h-screen">\n          <Spinner />\n        </div>\n      }\n    >\n      <Routes>\n        <Route path="/"       element={<Home />} />\n        <Route path="/admin"  element={<AdminPanel />} />\n        <Route path="/me"     element={<Profile />} />\n      </Routes>\n    </Suspense>\n  );\n}`,
    icon: FastForward,
  },
  {
    id: "25", title: "Zustand", subtitle: "Simple Global State",
    tag: "State", tagColor: "#34d399", accent: "#10b981",
    bg: "radial-gradient(ellipse at 45% 30%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    content: ["Zustand — minimal global state, feels like useState", "No Provider needed — just import and use anywhere", "Slices pattern for large apps with many domains", "Selective subscription prevents unnecessary re-renders"],
    lab: "Add an 'increment' action to your Zustand store.",
    syntax: `const useStore = create<Store>(set => ({\n  count: 0,\n  inc: () => set(s => ({ count: s.count + 1 }))\n}));`,
    code: `import { create } from 'zustand';\n\ninterface UserStore {\n  user: { name: string } | null;\n  count: number;\n  login:  (data: { name: string }) => void;\n  logout: () => void;\n  inc:    () => void;\n}\n\nconst useUserStore = create<UserStore>(set => ({\n  user:   null,\n  count:  0,\n  login:  (data) => set({ user: data }),\n  logout: ()     => set({ user: null }),\n  inc:    ()     => set(s => ({ count: s.count + 1 })),\n}));\n\n// Use in ANY component — no Provider!\nfunction Profile() {\n  const { user, logout } = useUserStore();\n  if (!user) return <p>Not logged in</p>;\n  return (\n    <div>\n      <h1>{user.name}</h1>\n      <button onClick={logout}>Log out</button>\n    </div>\n  );\n}`,
    icon: RefreshCw,
  },
  {
    id: "26", title: "React Hook Form", subtitle: "Performant Forms",
    tag: "Libraries", tagColor: "#818cf8", accent: "#6366f1",
    bg: "radial-gradient(ellipse at 20% 70%, rgba(99,102,241,0.12) 0%, transparent 60%)",
    content: ["Minimal re-renders — only updates on submit by default", "register — connects inputs without controlled state", "handleSubmit — wraps your submit logic safely", "Built-in validation rules with clear error messages"],
    lab: "Use React Hook Form to create a Contact form with email field.",
    syntax: `const { register, handleSubmit, formState } = useForm();\n<input {...register("email", { required: true })} />`,
    code: `import { useForm } from 'react-hook-form';\n\ntype ContactForm = {\n  name:  string;\n  email: string;\n  message: string;\n};\n\nfunction ContactPage() {\n  const {\n    register,\n    handleSubmit,\n    formState: { errors, isSubmitting },\n    reset,\n  } = useForm<ContactForm>();\n\n  const onSubmit = async (data: ContactForm) => {\n    await sendEmail(data);\n    reset();\n  };\n\n  return (\n    <form onSubmit={handleSubmit(onSubmit)}>\n      <input\n        {...register("email", {\n          required: "Email is required",\n          pattern:  { value: /.+@.+/, message: "Invalid email" },\n        })}\n        placeholder="Email"\n      />\n      {errors.email && <p>{errors.email.message}</p>}\n\n      <button disabled={isSubmitting}>\n        {isSubmitting ? "Sending…" : "Send"}\n      </button>\n    </form>\n  );\n}`,
    icon: Send,
  },
  {
    id: "27", title: "Vitest & RTL", subtitle: "Unit Testing",
    tag: "Testing", tagColor: "#4ade80", accent: "#22c55e",
    bg: "radial-gradient(ellipse at 60% 40%, rgba(34,197,94,0.12) 0%, transparent 60%)",
    content: ["React Testing Library — test what users see, not internals", "getByRole, getByText — query by accessibility semantics", "fireEvent / userEvent — simulate user interactions", "Vitest is blazing fast, Vite-native test runner"],
    lab: "Write a test to check if your Button renders the correct text.",
    syntax: `expect(screen.getByText('Submit')).toBeInTheDocument();`,
    code: `import { render, screen, fireEvent } from '@testing-library/react';\nimport { vi, test, expect } from 'vitest';\n\n// Component under test\nfunction Counter() {\n  const [n, setN] = useState(0);\n  return (\n    <>\n      <p>Count: {n}</p>\n      <button onClick={() => setN(n + 1)}>Increment</button>\n      <button onClick={() => setN(0)}>Reset</button>\n    </>\n  );\n}\n\ntest('counter increments on click', () => {\n  render(<Counter />);\n  const btn = screen.getByRole('button', { name: /increment/i });\n  fireEvent.click(btn);\n  expect(screen.getByText('Count: 1')).toBeInTheDocument();\n});\n\ntest('counter resets to zero', () => {\n  render(<Counter />);\n  fireEvent.click(screen.getByText('Increment'));\n  fireEvent.click(screen.getByText('Reset'));\n  expect(screen.getByText('Count: 0')).toBeInTheDocument();\n});`,
    icon: ShieldCheck,
  },
  {
    id: "28", title: "Playwright", subtitle: "End-to-End Testing",
    tag: "Testing", tagColor: "#fb7185", accent: "#f43f5e",
    bg: "radial-gradient(ellipse at 35% 65%, rgba(244,63,94,0.12) 0%, transparent 60%)",
    content: ["E2E tests simulate a real user in a real browser", "Playwright opens Chrome, Firefox, or WebKit", "Test the full journey: login → add to cart → checkout", "Runs in CI/CD — catches regressions before deploy"],
    lab: "Write a Playwright script to go to the home page and click a button.",
    syntax: `await page.goto('/login');\nawait page.click('#submit');\nawait expect(page).toHaveURL(/dashboard/);`,
    code: `import { test, expect } from '@playwright/test';\n\ntest.describe('Purchase flow', () => {\n  test.beforeEach(async ({ page }) => {\n    await page.goto('https://myshop.com');\n  });\n\n  test('user can add item and checkout', async ({ page }) => {\n    // Navigate to product\n    await page.click('text=Shop Now');\n    await expect(page).toHaveURL(/shop/);\n\n    // Add to cart\n    await page.click('[data-testid="add-to-cart"]');\n    await expect(\n      page.locator('[data-testid="cart-count"]')\n    ).toHaveText('1');\n\n    // Checkout\n    await page.click('text=Checkout');\n    await expect(page).toHaveURL(/checkout/);\n    await expect(\n      page.locator('h1')\n    ).toContainText('Order Summary');\n  });\n});`,
    icon: Smartphone,
  },
  {
    id: "29", title: "Framer Motion", subtitle: "Fluid Animations",
    tag: "Animation", tagColor: "#fbbf24", accent: "#f59e0b",
    bg: "radial-gradient(ellipse at 55% 25%, rgba(245,158,11,0.12) 0%, transparent 60%)",
    content: ["motion.div — drop-in replacement for animated elements", "initial / animate — define start and end states", "whileHover / whileTap — interaction micro-animations", "AnimatePresence — animates elements as they leave the DOM"],
    lab: "Add a 'whileHover' animation to your main button component.",
    syntax: `<motion.div\n  initial={{ opacity: 0, y: 20 }}\n  animate={{ opacity: 1, y: 0 }}\n  exit={{ opacity: 0 }}\n/>`,
    code: `import { motion, AnimatePresence } from 'framer-motion';\nimport { useState } from 'react';\n\nfunction AnimatedCard({ visible }: { visible: boolean }) {\n  return (\n    <AnimatePresence>\n      {visible && (\n        <motion.div\n          initial={{ opacity: 0, y: 40, scale: 0.95 }}\n          animate={{ opacity: 1, y: 0,  scale: 1    }}\n          exit={{    opacity: 0, y: -20, scale: 0.95 }}\n          transition={{ type: "spring", stiffness: 300, damping: 25 }}\n          className="card"\n        >\n          <p>I animate in and out!</p>\n        </motion.div>\n      )}\n    </AnimatePresence>\n  );\n}\n\nfunction App() {\n  const [show, setShow] = useState(true);\n  return (\n    <>\n      <motion.button\n        whileHover={{ scale: 1.05 }}\n        whileTap={{   scale: 0.95 }}\n        onClick={() => setShow(s => !s)}\n      >\n        Toggle Card\n      </motion.button>\n      <AnimatedCard visible={show} />\n    </>\n  );\n}`,
    icon: Sparkles,
  },
  {
    id: "30", title: "React 19 Actions", subtitle: "useOptimistic",
    tag: "React 19", tagColor: "#38bdf8", accent: "#0ea5e9",
    bg: "radial-gradient(ellipse at 25% 55%, rgba(14,165,233,0.12) 0%, transparent 60%)",
    content: ["Show success state instantly before server confirms", "useOptimistic — renders temporary 'optimistic' state", "React auto-rolls back if the server request fails", "Perfect for likes, comments, and quick actions"],
    lab: "Use useOptimistic to show 'Liked!' immediately on click.",
    syntax: `const [optimistic, addOptimistic] = useOptimistic(state);\naddOptimistic(tempValue); // instant UI update`,
    code: `import { useState, useOptimistic } from 'react';\n\ntype Message = { id: number; text: string; sending?: boolean };\n\nfunction Chat() {\n  const [messages, setMessages] = useState<Message[]>([]);\n  const [optimistic, addOptimistic] = useOptimistic(\n    messages,\n    (state, newMsg: Message) => [...state, newMsg]\n  );\n\n  const sendMessage = async (text: string) => {\n    const temp = { id: Date.now(), text, sending: true };\n\n    // 1. Immediately show in UI\n    addOptimistic(temp);\n\n    // 2. Actually send to server\n    const saved = await api.send(text);\n\n    // 3. Replace temp with real data\n    setMessages(prev => [...prev, saved]);\n  };\n\n  return (\n    <ul>\n      {optimistic.map(m => (\n        <li key={m.id} style={{ opacity: m.sending ? 0.5 : 1 }}>\n          {m.text}\n        </li>\n      ))}\n    </ul>\n  );\n}`,
    icon: Zap,
  },
  {
    id: "31", title: "useFormStatus", subtitle: "React 19 Forms",
    tag: "React 19", tagColor: "#c084fc", accent: "#a855f7",
    bg: "radial-gradient(ellipse at 65% 35%, rgba(168,85,247,0.12) 0%, transparent 60%)",
    content: ["useFormStatus reads the status of the closest parent form", "pending — true while the form action is executing", "No props needed — works via React's form context", "Pairs with Server Actions for zero-boilerplate forms"],
    lab: "Use useFormStatus to disable a Submit button while the form sends.",
    syntax: `const { pending } = useFormStatus();\n// true while form action is running`,
    code: `import { useFormStatus } from 'react-dom';\n\n// Child reads parent form status — no props needed!\nfunction SubmitButton() {\n  const { pending } = useFormStatus();\n\n  return (\n    <button\n      type="submit"\n      disabled={pending}\n      className={pending ? "opacity-50 cursor-not-allowed" : ""}\n    >\n      {pending ? "Saving…" : "Save Changes"}\n    </button>\n  );\n}\n\nasync function saveProfile(formData: FormData) {\n  "use server";\n  await db.updateProfile({\n    name:  formData.get('name') as string,\n    email: formData.get('email') as string,\n  });\n}\n\nexport default function ProfileForm() {\n  return (\n    <form action={saveProfile}>\n      <input name="name"  placeholder="Name" />\n      <input name="email" placeholder="Email" />\n      <SubmitButton /> {/* knows about form pending state! */}\n    </form>\n  );\n}`,
    icon: Target,
  },
  {
    id: "32", title: "Optimisation", subtitle: "60fps Target",
    tag: "Performance", tagColor: "#22d3ee", accent: "#06b6d4",
    bg: "radial-gradient(ellipse at 40% 60%, rgba(6,182,212,0.12) 0%, transparent 60%)",
    content: ["React DevTools Profiler — record and visualise re-renders", "Flame graph — tall bars = slow, wide bars = frequent", "memo() — skip re-renders when props haven't changed", "Target: every interaction below 16ms (60 fps)"],
    lab: "Record a profile and find a component that re-renders too often.",
    syntax: `// Wrap expensive components\nconst Slow = memo(SlowComponent);\n// Pro tip: useMemo only for genuinely heavy work`,
    code: `import { memo, useMemo, useCallback } from 'react';\n\n// memo: skip re-render if props didn't change\nconst ExpensiveList = memo(function ExpensiveList({\n  items\n}: { items: string[] }) {\n  console.log("ExpensiveList rendered");\n  return <ul>{items.map(i => <li key={i}>{i}</li>)}</ul>;\n});\n\nfunction Parent() {\n  const [count, setCount] = useState(0);\n\n  // Without useCallback, this would be a new reference\n  // every render — forcing ExpensiveList to re-render\n  const handleClick = useCallback(() => {\n    console.log("clicked");\n  }, []); // stable reference\n\n  return (\n    <>\n      <button onClick={() => setCount(c => c + 1)}>+</button>\n      {/* WON'T re-render when count changes */}\n      <ExpensiveList items={["HTML", "CSS", "JS"]} />\n    </>\n  );\n}`,
    icon: Gauge,
  },
  {
    id: "33", title: "Portfolio Power", subtitle: "Career Builder",
    tag: "Career", tagColor: "#fb923c", accent: "#f97316",
    bg: "radial-gradient(ellipse at 55% 40%, rgba(249,115,22,0.12) 0%, transparent 60%)",
    content: ["Companies care about what you've built, not certificates", "Project 1: Real-time app (Firebase / Socket.io)", "Project 2: E-commerce dashboard with filters and cart", "Project 3: SaaS landing page with auth and pricing"],
    lab: "Pick one of the three project ideas and create the GitHub repo today.",
    syntax: `// Focus on: clean code + documentation + mobile-first`,
    code: `/* THE HIRING CHECKLIST 2026:\n\n  Code Quality:\n  ✅ TypeScript — no 'any' types\n  ✅ ESLint + Prettier — consistent style\n  ✅ Meaningful commit messages\n  ✅ README with screenshots\n\n  Architecture:\n  ✅ Clean folder structure\n  ✅ Reusable, small components\n  ✅ Custom hooks for shared logic\n\n  UX:\n  ✅ Responsive design (mobile first)\n  ✅ Loading and error states\n  ✅ Accessible (aria labels, keyboard nav)\n\n  Bonus:\n  ✅ Unit test coverage\n  ✅ Deployed + shareable URL\n*/`,
    icon: Rocket,
  },
  {
    id: "34", title: "Deploying Live", subtitle: "Vercel & Netlify",
    tag: "Deploy", tagColor: "#60a5fa", accent: "#3b82f6",
    bg: "radial-gradient(ellipse at 30% 50%, rgba(59,130,246,0.12) 0%, transparent 60%)",
    content: ["Connect GitHub → Vercel auto-deploys every push", "Zero-config for Next.js — Vercel made both", "Environment variables: set in dashboard, not in code", "Preview deployments for every pull request"],
    lab: "Connect your GitHub to Vercel and deploy your first React project.",
    syntax: `# Push code → website updates automatically\ngit add . && git commit -m "feat: launch"\ngit push origin main`,
    code: `// Deployment checklist:\n\n// 1. Create a GitHub repository\n// 2. Push your project:\n//    git push origin main\n\n// 3. Go to vercel.com\n// 4. "Import Git Repository"\n// 5. Set environment variables:\n//    VITE_API_URL = https://api.example.com\n//    DATABASE_URL = postgresql://...\n\n// 6. Set build settings:\n//    Build Command:  npm run build\n//    Output Dir:     dist   (Vite)\n//                    .next  (Next.js)\n\n// 7. Click Deploy\n// ✅ Your app is live in ~30 seconds!`,
    icon: Globe,
  },
  {
    id: "35", title: "The Journey Continues", subtitle: "Stay Curious",
    tag: "Mindset", tagColor: "#4ade80", accent: "#22c55e",
    bg: "radial-gradient(ellipse at 50% 50%, rgba(34,197,94,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(59,130,246,0.06) 0%, transparent 50%)",
    content: ["React Blog — follow the core team for updates", "React 19 ships new primitives every year", "The best developers ship products, not tutorials", "Keep building, stay curious, help others"],
    lab: "Find one new React 19 feature on react.dev and share it with a peer.",
    syntax: `console.log("Welcome to the community! 🎓");`,
    code: `/* CONGRATULATIONS! 🎓\n\n   You have mastered 35 core concepts\n   of modern React development.\n\n   Topics covered:\n   • JSX, Components, Props, State\n   • Hooks: useState, useEffect,\n     useContext, useReducer, useMemo\n   • Custom Hooks & Composition\n   • RSCs, Suspense, Error Boundaries\n   • Testing: Vitest, RTL, Playwright\n   • Libraries: TanStack Query, Zustand,\n     React Hook Form, Framer Motion\n   • React 19: Actions, useOptimistic\n   • Deployment & Career\n\n   The web belongs to you now.\n   Happy Coding! 🚀\n*/`,
    icon: Terminal,
  },
  {
    id: "FA", title: "Final Project", subtitle: "Task Dashboard",
    tag: "Assignment", tagColor: "#fde047", accent: "#eab308",
    bg: "radial-gradient(ellipse at 50% 50%, rgba(234,179,8,0.15) 0%, transparent 60%), radial-gradient(ellipse at 10% 90%, rgba(249,115,22,0.08) 0%, transparent 50%)",
    content: ["useQuery — fetch a list of tasks from an API", "useState — add and delete tasks locally", "Framer Motion — animate task entry and exit", "Tailwind CSS — dark-mode, professional UI", "TypeScript — fully typed throughout"],
    lab: "Build and deploy the Task Management Dashboard to Vercel.",
    syntax: `export default function Dashboard() {\n  // Your masterpiece starts here!\n}`,
    code: `/* YOUR CAREER STARTS HERE! 🚀\n\n   Once you finish this dashboard:\n\n   1. Write a README with screenshots\n   2. Push to GitHub with clean commits\n   3. Deploy to Vercel\n   4. Add the live URL to your portfolio\n   5. Share it on LinkedIn\n\n   Suggested features:\n   • Filter tasks by status\n   • Drag-and-drop reordering\n   • Dark / light theme toggle\n   • Due date with overdue highlight\n   • Local storage persistence\n\n   The path from Junior → Senior is\n   one component at a time.\n   You've got this! 💪\n*/`,
    icon: Sparkles,
  },
];

/* ─── TS SYNTAX HIGHLIGHTER ──────────────────────────────────────── */
const TS_KEYWORDS = new Set([
  'const','let','var','function','return','if','else','for','while',
  'async','await','export','import','default','from','type','interface',
  'extends','class','new','this','true','false','null','undefined',
  'typeof','as','in','of','break','continue','throw','try','catch',
  'finally','static','readonly','abstract','implements','super',
]);

const HighlightedCode = ({ code }: { code: string }) => {
  const tokenizeLine = (line: string): React.ReactNode => {
    if (line.trimStart().startsWith('//'))
      return <span style={{ color: '#6b7280', fontStyle: 'italic' }}>{line}</span>;
    if (line.trimStart().startsWith('/*') || line.trimStart().startsWith('*'))
      return <span style={{ color: '#6b7280', fontStyle: 'italic' }}>{line}</span>;

    const parts = line.split(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\b\d+(?:\.\d+)?\b|\b[a-zA-Z_$][a-zA-Z0-9_$]*\b)/g);
    return parts.map((part, i) => {
      if (!part) return null;
      if (TS_KEYWORDS.has(part)) return <span key={i} style={{ color: '#f87171', fontWeight: 700 }}>{part}</span>;
      if (/^["'`]/.test(part)) return <span key={i} style={{ color: '#86efac' }}>{part}</span>;
      if (/^\d/.test(part)) return <span key={i} style={{ color: '#c084fc' }}>{part}</span>;
      if (/^[A-Z]/.test(part)) return <span key={i} style={{ color: '#fbbf24' }}>{part}</span>;
      return <span key={i} style={{ color: '#e2e8f0' }}>{part}</span>;
    });
  };

  return (
    <div className="font-mono text-sm leading-6 whitespace-pre"
      style={{ fontFamily: "'JetBrains Mono','Fira Code',monospace" }}>
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
const CodeViewer = ({ code, accent }: { code: string; accent: string }) => {
  const [copied, setCopied] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const lines = code.split('\n');

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const syncScroll = () => {
    if (taRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = taRef.current.scrollTop;
      highlightRef.current.scrollLeft = taRef.current.scrollLeft;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-white/8 flex-none">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]/60" />
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 rounded px-2 py-1 ml-1">
            <FileCode className="w-3 h-3" style={{ color: accent }} />
            <span className="text-[10px] font-mono text-zinc-400">Component.tsx</span>
          </div>
        </div>
        <button onClick={copy}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${copied ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'}`}>
          {copied ? <><Check className="w-3 h-3" />Copied!</> : <><Copy className="w-3 h-3" />Copy</>}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-none w-9 bg-[#0d1117] border-r border-white/5 pt-4 pb-4 flex flex-col items-end pr-2 overflow-hidden select-none">
          {lines.map((_, i) => (
            <div key={i} className="text-[11px] font-mono text-zinc-600 leading-6 min-h-[1.5rem]">{i + 1}</div>
          ))}
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div ref={highlightRef} className="absolute inset-0 overflow-auto p-4 pointer-events-none" style={{ scrollbarWidth: 'none' }}>
            <HighlightedCode code={code} />
          </div>
          <textarea ref={taRef} readOnly value={code} onScroll={syncScroll}
            className="absolute inset-0 w-full h-full bg-transparent text-transparent resize-none outline-none p-4 font-mono text-sm leading-6 border-none overflow-auto selection:bg-blue-500/25"
            style={{ fontFamily: "'JetBrains Mono',monospace", whiteSpace: 'pre', overflowWrap: 'normal' }}
            spellCheck={false} wrap="off" />
        </div>
      </div>
    </div>
  );
};

/* ─── MAIN COMPONENT ─────────────────────────────────────────────── */
function ReactLessonContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSlide = Math.max(0, Math.min(parseInt(searchParams.get('slide') || '1') - 1, slides.length - 1));

  const [current, setCurrent] = useState(initialSlide);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dir, setDir] = useState(1);

  const slide = slides[current];
  const IconComp = slide.icon;
  const progress = ((current + 1) / slides.length) * 100;

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
      <header className="relative z-20 flex items-center gap-4 px-6 py-3 border-b border-white/8 bg-black/20 backdrop-blur-xl flex-none">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center border border-white/10 flex-none"
          style={{ background: `${slide.accent}20` }}>
          <IconComp className="w-3.5 h-3.5" style={{ color: slide.accent }} />
        </div>
        <div className="flex-none">
          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-600 font-bold">Module 05 · Weeks 08–10</p>
          <p className="text-xs font-black text-white tracking-tight">React Mastery</p>
        </div>

        <div className="flex-1 mx-6 hidden md:block">
          <div className="h-0.5 bg-white/8 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: slide.accent }} />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border"
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

        {/* LEFT — Lesson */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={`left-${current}`} custom={dir} variants={variants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
            className="flex-none lg:w-[400px] xl:w-[440px] flex flex-col justify-between p-6 lg:p-8 lg:border-r border-white/8 overflow-y-auto">

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="text-4xl font-black tabular-nums leading-none flex-none pt-1"
                  style={{ color: `${slide.accent}35`, fontFamily: "'JetBrains Mono',monospace" }}>
                  {slide.id}
                </div>
                <div>
                  <h1 className="text-xl xl:text-2xl font-black leading-tight text-white">{slide.title}</h1>
                  <p className="text-sm text-zinc-400 font-medium mt-0.5">{slide.subtitle}</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {slide.content.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.05 }} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-none" style={{ background: slide.accent }} />
                    <p className="text-sm text-zinc-300 leading-relaxed font-medium">{item}</p>
                  </motion.div>
                ))}
              </div>

              <SyntaxPanel syntax={slide.syntax} accent={slide.accent} />

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="rounded-xl border p-3.5 flex gap-2.5"
                style={{ background: `${slide.accent}0a`, borderColor: `${slide.accent}28` }}>
                <Play className="w-3.5 h-3.5 flex-none mt-0.5" style={{ color: slide.accent }} />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest mb-0.5" style={{ color: slide.accent }}>Lab Exercise</p>
                  <p className="text-xs text-zinc-300 leading-relaxed">{slide.lab}</p>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center gap-3 mt-6 lg:mt-0">
              <button onClick={prev}
                className="p-2.5 rounded-xl bg-white/5 border border-white/8 hover:bg-white/10 active:scale-95 transition-all flex items-center gap-1.5">
                <ChevronLeft className="w-4 h-4" />
                <span className="text-xs font-bold hidden sm:inline">Prev</span>
              </button>
              <button onClick={next}
                className="flex-1 py-2.5 px-4 rounded-xl font-black text-xs active:scale-95 transition-all flex items-center justify-center gap-2"
                style={{ background: slide.accent, color: '#000' }}>
                {current === slides.length - 1 ? 'Restart' : 'Next Lesson'}
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* RIGHT — Code viewer */}
        <div className="flex-1 flex flex-col overflow-hidden p-4 lg:p-5 gap-3">
          <div className="flex items-center justify-between flex-none">
            <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1 border border-white/8">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest"
                style={{ background: `${slide.accent}25`, color: slide.accent }}>
                <FileCode className="w-3 h-3" /> Implementation
              </div>
            </div>
            <div className="text-[9px] font-mono text-zinc-700 hidden lg:flex items-center gap-1">
              <kbd className="px-1 py-0.5 border border-zinc-800 rounded text-[8px]">←</kbd>
              <kbd className="px-1 py-0.5 border border-zinc-800 rounded text-[8px]">→</kbd>
              navigate
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={`code-${current}`}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}
              className="flex-1 overflow-hidden rounded-xl border border-white/8">
              {slide.code ? (
                <CodeViewer code={slide.code} accent={slide.accent} />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-6 bg-[#0d1117]">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
                    className="absolute w-64 h-64 rounded-full"
                    style={{ background: `conic-gradient(from 0deg, ${slide.accent}08, ${slide.accent}20, ${slide.accent}08)`, filter: 'blur(40px)' }} />
                  <div className="relative w-20 h-20 rounded-2xl flex items-center justify-center border border-white/10"
                    style={{ background: `${slide.accent}20` }}>
                    <IconComp className="w-10 h-10" style={{ color: slide.accent }} />
                  </div>
                  <div className="text-center relative">
                    <p className="text-xs font-black uppercase tracking-[0.3em] mb-2" style={{ color: slide.accent }}>React</p>
                    <p className="text-3xl font-black text-white">{slide.title}</p>
                    <p className="text-sm text-zinc-500 mt-1">{slide.subtitle}</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ── FOOTER DOTS ── */}
      <footer className="relative z-20 flex justify-center items-center gap-1.5 py-3 border-t border-white/8 bg-black/20 backdrop-blur-xl flex-none flex-wrap px-4">
        {slides.map((s, i) => (
          <button key={i} onClick={() => goTo(i, i > current ? 1 : -1)} title={s.title}
            className="rounded-full transition-all duration-300"
            style={{ width: i === current ? 20 : 5, height: 5, background: i === current ? slide.accent : 'rgba(255,255,255,0.12)' }} />
        ))}
      </footer>
    </div>
  );
}

export default function ReactLesson() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
          <p className="text-zinc-600 text-sm font-mono">Loading React Lab...</p>
        </div>
      </div>
    }>
      <ReactLessonContent />
    </Suspense>
  );
}