"use client";

import React, { useState, useEffect, useCallback, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import {
  ChevronLeft, ChevronRight, BookOpen, Layout, ListChecks,
  Smartphone, Code2, Copy, Check, Monitor, Type, Link as LinkIcon,
  Hash, Tag, Image as ImageIcon, Table as TableIcon, RefreshCw,
  Globe, ArrowLeft, ArrowRight, Sparkles, Play, RotateCcw, RotateCw
} from 'lucide-react';

/* ─── SLIDE DATA ─────────────────────────────────────────────────── */
const slides = [
  {
    id: "01",
    title: "Document Structure",
    subtitle: "The Web's Frame",
    tag: "Foundation",
    tagColor: "#60a5fa",
    content: [
      "Defines the frame of your page",
      "<html> is the main container",
      "<head> holds hidden metadata",
      "<body> holds what users see",
    ],
    lab: "Create a basic document structure with a unique <title> and <h1>.",
    code: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Document Structure</title>\n</head>\n<body>\n  <h1>Welcome!</h1>\n  <p>HTML is the foundation.</p>\n</body>\n</html>`,
    icon: BookOpen,
    accent: "#3b82f6",
    bg: "radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.08) 0%, transparent 50%)",
  },
  {
    id: "02",
    title: "Global Attributes",
    subtitle: "Names & Groups",
    tag: "Core Concept",
    tagColor: "#94a3b8",
    content: [
      "'class' groups multiple elements",
      "'id' targets one specific element",
      "Useful for styling and scripting",
      "IDs must be unique per page",
    ],
    lab: "Add a unique ID to a div and a shared class to two paragraphs.",
    code: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Attributes Example</title>\n</head>\n<body>\n  <div id="main-container">\n    <p class="highlight">First Highlight</p>\n    <p class="highlight">Second Highlight</p>\n  </div>\n</body>\n</html>`,
    icon: Hash,
    accent: "#64748b",
    bg: "radial-gradient(ellipse at 70% 30%, rgba(100,116,139,0.12) 0%, transparent 60%)",
  },
  {
    id: "03",
    title: "Text Hierarchy",
    subtitle: "Headings & Titles",
    tag: "Typography",
    tagColor: "#818cf8",
    content: [
      "h1 → h6 defines visual importance",
      "Helps search engines understand structure",
      "Use only one h1 per page",
      "Nest headings in logical order",
    ],
    lab: "Create a tiered heading structure using H1, H2, and H3.",
    code: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Headings Example</title>\n</head>\n<body>\n  <h1>Main Title</h1>\n  <h2>Section Header</h2>\n  <h3>Sub-section</h3>\n  <h4>Detail header</h4>\n  <h5>Minor header</h5>\n  <h6>Annotation</h6>\n</body>\n</html>`,
    icon: Type,
    accent: "#6366f1",
    bg: "radial-gradient(ellipse at 30% 70%, rgba(99,102,241,0.12) 0%, transparent 60%)",
  },
  {
    id: "04",
    title: "Text Elements",
    subtitle: "Inline Formatting",
    tag: "Typography",
    tagColor: "#22d3ee",
    content: [
      "<p> wraps blocks of paragraph text",
      "<strong> makes text bold (important)",
      "<em> italicizes text (emphasis)",
      "<span> groups inline content",
    ],
    lab: "Write a paragraph, bold one word with <strong>, and italicize another with <em>.",
    code: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Text Elements</title>\n</head>\n<body>\n  <p>\n    This is a standard paragraph.\n    <strong>This text is bold.</strong>\n    <em>This is italicized.</em>\n    <span>Ordinary span text.</span>\n  </p>\n</body>\n</html>`,
    icon: Tag,
    accent: "#06b6d4",
    bg: "radial-gradient(ellipse at 60% 40%, rgba(6,182,212,0.12) 0%, transparent 60%)",
  },
  {
    id: "05",
    title: "Hyperlinks",
    subtitle: "Navigating the Web",
    tag: "Navigation",
    tagColor: "#34d399",
    content: [
      "<a> is the anchor (link) tag",
      "'href' holds the destination URL",
      "'target=\"_blank\"' opens a new tab",
      "Use descriptive link text always",
    ],
    lab: "Add a link to Google that opens in a new tab.",
    code: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Links Example</title>\n</head>\n<body>\n  <a href="https://google.com" target="_blank">\n    Visit Google\n  </a>\n  <br>\n  <a href="/about">\n    Internal About Page\n  </a>\n</body>\n</html>`,
    icon: LinkIcon,
    accent: "#10b981",
    bg: "radial-gradient(ellipse at 20% 60%, rgba(16,185,129,0.12) 0%, transparent 60%)",
  },
  {
    id: "06",
    title: "Images",
    subtitle: "Visual Content",
    tag: "Media",
    tagColor: "#fbbf24",
    content: [
      "<img> embeds an image element",
      "'src' points to the image file",
      "'alt' describes the image in text",
      "Always add alt for accessibility",
    ],
    lab: "Display an image with a meaningful ALT description.",
    code: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Image Example</title>\n</head>\n<body>\n  <h3>Check out this image:</h3>\n  <img \n    src="https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=400" \n    alt="Laptop on a clean desk workspace"\n    width="100%"\n  />\n</body>\n</html>`,
    icon: ImageIcon,
    accent: "#f59e0b",
    bg: "radial-gradient(ellipse at 80% 60%, rgba(245,158,11,0.12) 0%, transparent 60%)",
  },
  {
    id: "07",
    title: "List Structures",
    subtitle: "Bullets & Numbers",
    tag: "Content",
    tagColor: "#f472b6",
    content: [
      "<ul> creates a bulleted list",
      "<ol> creates a numbered list",
      "<li> wraps each individual item",
      "Lists can be nested inside each other",
    ],
    lab: "Create a 3-item bulleted list and a 3-item numbered list.",
    code: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Lists Example</title>\n</head>\n<body>\n  <h3>Shopping List (UL)</h3>\n  <ul>\n    <li>Milk</li>\n    <li>Bread</li>\n    <li>Eggs</li>\n  </ul>\n  <h3>Recipe Steps (OL)</h3>\n  <ol>\n    <li>Mix ingredients</li>\n    <li>Pour into pan</li>\n    <li>Bake for 30 minutes</li>\n  </ol>\n</body>\n</html>`,
    icon: ListChecks,
    accent: "#ec4899",
    bg: "radial-gradient(ellipse at 40% 30%, rgba(236,72,153,0.12) 0%, transparent 60%)",
  },
  {
    id: "08",
    title: "Data Tables",
    subtitle: "Grids of Information",
    tag: "Structure",
    tagColor: "#fb923c",
    content: [
      "<table> is the outer container",
      "<tr> defines each table row",
      "<th> creates a header cell",
      "<td> holds actual data values",
    ],
    lab: "Build a table with 2 columns and 2 data rows.",
    code: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Tables Example</title>\n</head>\n<body>\n  <table border="1">\n    <tr>\n      <th>Course</th>\n      <th>Credits</th>\n    </tr>\n    <tr>\n      <td>HTML 101</td>\n      <td>3</td>\n    </tr>\n    <tr>\n      <td>CSS 101</td>\n      <td>3</td>\n    </tr>\n  </table>\n</body>\n</html>`,
    icon: TableIcon,
    accent: "#f97316",
    bg: "radial-gradient(ellipse at 75% 50%, rgba(249,115,22,0.12) 0%, transparent 60%)",
  },
  {
    id: "09",
    title: "Forms & Inputs",
    subtitle: "Collecting User Data",
    tag: "Interactivity",
    tagColor: "#38bdf8",
    content: [
      "<form> wraps all input elements",
      "<label> names each input field",
      "<input> accepts user-typed data",
      "<button type='submit'> sends the form",
    ],
    lab: "Create a form with Name, Email inputs and a Submit button.",
    code: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Form Example</title>\n</head>\n<body>\n  <form>\n    <label for="name">Name:</label>\n    <input type="text" id="name"><br><br>\n    <label for="email">Email:</label>\n    <input type="email" id="email"><br><br>\n    <button type="submit">Send</button>\n  </form>\n</body>\n</html>`,
    icon: Smartphone,
    accent: "#0ea5e9",
    bg: "radial-gradient(ellipse at 25% 45%, rgba(14,165,233,0.12) 0%, transparent 60%)",
  },
  {
    id: "10",
    title: "The Div Tag",
    subtitle: "Generic Container",
    tag: "Layout",
    tagColor: "#a78bfa",
    content: [
      "A plain box with no built-in meaning",
      "Great for grouping elements together",
      "Used heavily for layout & styling",
      "Pair with class/id to target with CSS",
    ],
    lab: "Wrap two paragraphs inside a single <div> container.",
    code: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Div Example</title>\n</head>\n<body>\n  <div style="background: #f0f0f0; padding: 20px; border-radius: 10px;">\n    <h2>Container Box</h2>\n    <div>\n       <p>Inside another container!</p>\n    </div>\n  </div>\n</body>\n</html>`,
    icon: Layout,
    accent: "#8b5cf6",
    bg: "radial-gradient(ellipse at 55% 65%, rgba(139,92,246,0.12) 0%, transparent 60%)",
  },
  {
    id: "11",
    title: "Semantic Layout",
    subtitle: "Meaningful Structure",
    tag: "Advanced",
    tagColor: "#c084fc",
    content: [
      "<header> and <footer> for top/bottom",
      "<main> contains the core page content",
      "<section> groups related content",
      "Helps screen readers and Google",
    ],
    lab: "Rewrite a page using <header>, <main>, <section>, and <footer>.",
    code: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Semantic Page</title>\n</head>\n<body>\n  <header>Site Header</header>\n  <main>\n    <section>\n      <h2>Section Title</h2>\n      <article>\n        <h3>Article Heading</h3>\n        <p>Content goes here.</p>\n      </article>\n    </section>\n  </main>\n  <footer>Site Footer</footer>\n</body>\n</html>`,
    icon: Layout,
    accent: "#a855f7",
    bg: "radial-gradient(ellipse at 35% 25%, rgba(168,85,247,0.12) 0%, transparent 60%)",
  },
  {
    id: "FA",
    title: "Final Project",
    subtitle: "Personal Profile Page",
    tag: "Assignment",
    tagColor: "#fde047",
    content: [
      "Use semantic HTML structure",
      "Include H1, H2, and 3+ paragraphs",
      "Add a skills list (3 items minimum)",
      "Link to an external social profile",
      "Include a profile image with alt text",
    ],
    lab: "Build a complete personal profile page using everything you've learned.",
    code: `<!-- START YOUR PROJECT HERE -->\n<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>My Portfolio</title>\n</head>\n<body>\n  <header>\n    <h1>Your Name</h1>\n    <nav>\n      <a href="#about">About</a>\n      <a href="#skills">Skills</a>\n    </nav>\n  </header>\n  <main>\n    <section id="about">\n      <h2>About Me</h2>\n      <img src="" alt="Profile photo of Your Name">\n      <p>Write your bio here...</p>\n    </section>\n    <section id="skills">\n      <h2>My Skills</h2>\n      <ul>\n        <li>HTML5</li>\n        <li>CSS3</li>\n        <li>JavaScript</li>\n      </ul>\n    </section>\n  </main>\n  <footer>\n    <a href="https://linkedin.com" target="_blank">LinkedIn</a>\n  </footer>\n</body>\n</html>`,
    icon: Sparkles,
    accent: "#eab308",
    bg: "radial-gradient(ellipse at 50% 50%, rgba(234,179,8,0.15) 0%, transparent 60%), radial-gradient(ellipse at 10% 90%, rgba(249,115,22,0.08) 0%, transparent 50%)",
  },
];

/* ─── SYNTAX HIGHLIGHTER ─────────────────────────────────────────── */
const tokenize = (line: string) => {
  const result: { text: string; cls: string }[] = [];
  let i = 0;
  while (i < line.length) {
    // Comment
    if (line.startsWith('<!--', i)) {
      const end = line.indexOf('-->', i);
      const stop = end === -1 ? line.length : end + 3;
      result.push({ text: line.slice(i, stop), cls: 'tok-comment' });
      i = stop;
    }
    // Opening/closing tag start
    else if (line[i] === '<') {
      let j = i + 1;
      if (line[j] === '/') j++;
      while (j < line.length && /[a-zA-Z0-9!]/.test(line[j])) j++;
      result.push({ text: line.slice(i, j), cls: 'tok-tag' });
      i = j;
      // Attrs inside tag
      while (i < line.length && line[i] !== '>') {
        if (/[a-zA-Z]/.test(line[i])) {
          let k = i;
          while (k < line.length && line[k] !== '=' && line[k] !== '>' && line[k] !== ' ') k++;
          result.push({ text: line.slice(i, k), cls: 'tok-attr' });
          i = k;
        } else if (line[i] === '"' || line[i] === "'") {
          const q = line[i];
          let k = i + 1;
          while (k < line.length && line[k] !== q) k++;
          result.push({ text: line.slice(i, k + 1), cls: 'tok-value' });
          i = k + 1;
        } else {
          result.push({ text: line[i], cls: 'tok-tag' });
          i++;
        }
      }
      if (i < line.length && line[i] === '>') {
        result.push({ text: '>', cls: 'tok-tag' });
        i++;
      }
    }
    // Plain text
    else {
      let j = i;
      while (j < line.length && line[j] !== '<') j++;
      result.push({ text: line.slice(i, j), cls: 'tok-text' });
      i = j;
    }
  }
  return result;
};

const HighlightedCode = ({ code }: { code: string }) => (
  <div
    className="font-mono text-sm sm:text-base leading-6 whitespace-pre select-none"
    style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace" }}
  >
    {code.split('\n').map((line, i) => (
      <div key={i} className="min-h-[1.5rem]">
        {tokenize(line).map((tok, j) => {
          const colors: Record<string, string> = {
            'tok-comment': '#6b7280',
            'tok-tag': '#f87171',
            'tok-attr': '#fbbf24',
            'tok-value': '#86efac',
            'tok-text': '#e2e8f0',
          };
          return <span key={j} style={{ color: colors[tok.cls] }}>{tok.text}</span>;
        })}
      </div>
    ))}
  </div>
);

/* ─── BROWSER PREVIEW ────────────────────────────────────────────── */
const BrowserPreview = ({
  indexCode, aboutCode, slideIndex
}: { indexCode: string; aboutCode: string; slideIndex: number }) => {
  const [view, setView] = useState<'main' | 'about' | 'ext'>('main');
  const [extUrl, setExtUrl] = useState('');

  const getBody = (html: string) => html.split('<body>')[1]?.split('</body>')[0] ?? html;

  const previewStyles = `
    ul{list-style:disc!important;padding-left:1.5rem!important;margin-bottom:1rem!important}
    ol{list-style:decimal!important;padding-left:1.5rem!important;margin-bottom:1rem!important}
    li{display:list-item!important;margin-bottom:.25rem!important}
    h1{font-size:2em!important;font-weight:700!important;margin:.67em 0!important}
    h2{font-size:1.5em!important;font-weight:700!important;margin:.75em 0!important}
    h3{font-size:1.17em!important;font-weight:700!important;margin:.83em 0!important}
    p{margin-bottom:1em!important}
    a{color:#1d4ed8!important;text-decoration:underline!important;cursor:pointer!important}
    table{border-collapse:collapse;width:100%;margin-bottom:1rem}
    th,td{padding:8px;text-align:left}
    table[border="1"] th,table[border="1"] td{border:1px solid #d1d5db}
    th{background:#f9fafb!important}
    img{max-width:100%}
    input,button{padding:.25rem .5rem;border:1px solid #d1d5db;border-radius:.25rem}
    button[type=submit]{background:#1d4ed8;color:#fff;cursor:pointer;border:none;padding:.375rem .75rem}
    form label{display:inline-block;min-width:60px}
  `;

  const titleMatch = indexCode.match(/<title>(.*?)<\/title>/);
  const tabTitle = titleMatch?.[1] ?? `lesson-${slideIndex + 1}.html`;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const link = (e.target as HTMLElement).closest('a');
    if (!link) return;
    const href = link.getAttribute('href') ?? '';
    e.preventDefault();
    if (href.startsWith('http')) { setExtUrl(href); setView('ext'); }
    else if (href === '/about' || href === 'about.html') setView('about');
    else if (href === 'index.html' || href === '/') setView('main');
  };

  return (
    <div className="w-full h-full flex flex-col bg-zinc-100 rounded-xl overflow-hidden">
      {/* Chrome bar */}
      <div className="bg-zinc-200 border-b border-zinc-300 flex-none">
        <div className="flex items-center gap-2 px-3 pt-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="bg-white px-3 py-1 rounded-t-lg border-x border-t border-zinc-300 text-[10px] flex items-center gap-1.5 min-w-[140px] shadow-sm">
            <Globe className="w-3 h-3 text-blue-500 flex-none" />
            <span className="font-medium truncate text-zinc-700">{view === 'main' ? tabTitle : view === 'about' ? 'about.html' : extUrl.replace('https://', '')}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/40 border-t border-zinc-100">
          <ArrowLeft className={`w-3.5 h-3.5 cursor-pointer transition-colors ${view !== 'main' ? 'text-blue-500' : 'text-zinc-300'}`} onClick={() => setView('main')} />
          <ArrowRight className="w-3.5 h-3.5 text-zinc-300" />
          <RefreshCw className="w-3.5 h-3.5 text-zinc-400 cursor-pointer hover:text-zinc-600" onClick={() => { const v = view; setView('main'); setTimeout(() => setView(v), 30); }} />
          <div className="flex-1 bg-white border border-zinc-300 rounded px-2 py-0.5 text-[9px] font-mono text-zinc-500 flex items-center justify-between">
            <span>http://127.0.0.1:5500/{view === 'main' ? `lesson-${slideIndex + 1}.html` : view === 'about' ? 'about.html' : extUrl.replace('https://', '')}</span>
            <span className="flex items-center gap-1 ml-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-emerald-600 font-bold uppercase tracking-tight text-[8px]">Live</span>
            </span>
          </div>
        </div>
      </div>

      {/* Page content */}
      <div className="flex-1 overflow-auto bg-white" onClick={handleClick}>
        <style dangerouslySetInnerHTML={{ __html: previewStyles }} />
        {view === 'ext' ? (
          <div className="h-full flex flex-col items-center justify-center gap-4 text-center p-6">
            <Globe className="w-12 h-12 text-zinc-200" />
            <p className="text-sm text-zinc-500">Simulated: <strong className="text-zinc-700">{extUrl}</strong></p>
            <button onClick={() => setView('main')} className="px-4 py-1.5 bg-blue-600 text-white text-xs rounded-full font-bold hover:bg-blue-700 transition-colors">← Back to lesson</button>
          </div>
        ) : (
          <div
            className="p-6 text-left text-sm text-zinc-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: getBody(view === 'main' ? indexCode : aboutCode) }}
          />
        )}
      </div>
    </div>
  );
};

/* ─── CODE EDITOR ────────────────────────────────────────────────── */
const CodeEditor = ({
  code, onChange
}: { code: string; onChange: (v: string) => void }) => {
  const [copied, setCopied] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
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
      const s = ta.selectionStart, end = ta.selectionEnd;
      const next = code.slice(0, s) + '  ' + code.slice(end);
      onChange(next);
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = s + 2; }, 0);
    }
  };

  const syncScroll = () => {
    if (taRef.current && scrollRef.current) {
      scrollRef.current.scrollTop = taRef.current.scrollTop;
      scrollRef.current.scrollLeft = taRef.current.scrollLeft;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] rounded-xl overflow-hidden">
      {/* Editor toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-white/8 flex-none">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]/60" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]/60" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]/60" />
          </div>
          <div className="flex items-center gap-1 bg-white/5 rounded-md px-2.5 py-1">
            <Code2 className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] font-mono text-zinc-400 font-medium">index.html</span>
          </div>
        </div>
        <button
          onClick={copy}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-200 border ${
            copied ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
          }`}
        >
          {copied ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
        </button>
      </div>

      {/* Editor body: line numbers + highlight + textarea */}
      <div className="flex flex-1 overflow-hidden">
        {/* Line numbers */}
        <div className="flex-none w-10 bg-[#0d1117] border-r border-white/5 pt-4 pb-4 flex flex-col items-end pr-2 overflow-hidden select-none">
          {lines.map((_, i) => (
            <div key={i} className="text-[11px] font-mono text-zinc-600 leading-6 min-h-[1.5rem]">{i + 1}</div>
          ))}
        </div>

        {/* Editable zone */}
        <div className="relative flex-1 overflow-hidden">
          {/* Highlighted layer */}
          <div
            ref={scrollRef}
            className="absolute inset-0 overflow-auto p-4 pointer-events-none"
            style={{ scrollbarWidth: 'none' }}
          >
            <HighlightedCode code={code} />
          </div>

          {/* Textarea (transparent) */}
          <textarea
            ref={taRef}
            value={code}
            onChange={e => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onScroll={syncScroll}
            className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-blue-400 resize-none outline-none p-4 font-mono text-sm leading-6 border-none overflow-auto selection:bg-blue-500/25"
            style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", whiteSpace: 'pre', overflowWrap: 'normal' }}
            spellCheck={false}
            wrap="off"
          />
        </div>
      </div>
    </div>
  );
};

/* ─── MAIN COMPONENT ─────────────────────────────────────────────── */
function HtmlLessonContent() {
  const searchParams = useSearchParams();
  const initialSlide = Math.max(0, Math.min(parseInt(searchParams.get('slide') || '1') - 1, slides.length - 1));

  const [current, setCurrent] = useState(initialSlide);
  const [viewMode, setViewMode] = useState<'code' | 'preview'>('code');
  const [codes, setCodes] = useState<string[]>(slides.map(s => s.code));
  const [isAnimating, setIsAnimating] = useState(false);
  const [dir, setDir] = useState(1); // 1 = forward, -1 = back

  const slide = slides[current];
  const IconComp = slide.icon;

  const goTo = useCallback((idx: number, direction: number) => {
    if (isAnimating) return;
    setDir(direction);
    setIsAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setViewMode('code');
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

  const resetCode = () => {
    const next = [...codes];
    next[current] = slides[current].code;
    setCodes(next);
  };

  const variants = {
    enter: (d: number) => ({ x: d * 60, opacity: 0, scale: 0.97 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d * -60, opacity: 0, scale: 0.97 }),
  };

  const progress = ((current + 1) / slides.length) * 100;

  return (
    <div
      className="min-h-screen text-white flex flex-col overflow-hidden"
      style={{ background: '#080c14', fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif" }}
    >
      {/* Dynamic background */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: slide.bg, transition: 'background 0.7s ease' }} />
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 70%)' }} />

      {/* ── TOP BAR ── */}
      <header className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-white/8 bg-black/20 backdrop-blur-xl flex-none">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/10" style={{ background: `${slide.accent}20` }}>
            <IconComp className="w-4 h-4" style={{ color: slide.accent }} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Module 01 · Week 01</p>
            <p className="text-sm font-bold text-white tracking-tight">HTML5 Essentials</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex-1 mx-8 hidden md:block">
          <div className="h-1 bg-white/8 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${slide.accent}, ${slide.accent}aa)` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full border"
            style={{ color: slide.tagColor, borderColor: `${slide.tagColor}40`, background: `${slide.tagColor}12` }}
          >
            {slide.tag}
          </span>
          <span className="text-xs font-mono text-zinc-500 ml-2">{current + 1}<span className="text-zinc-700">/{slides.length}</span></span>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden">

        {/* LEFT PANEL — Lesson Content */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={`left-${current}`}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="flex-none lg:w-[420px] xl:w-[460px] flex flex-col justify-between p-8 lg:p-10 lg:border-r border-white/8 overflow-y-auto"
          >
            {/* Slide number + title */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div
                  className="text-5xl font-black tabular-nums leading-none flex-none"
                  style={{ color: `${slide.accent}40`, fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {slide.id}
                </div>
                <div>
                  <h1 className="text-2xl xl:text-3xl font-black leading-tight text-white">{slide.title}</h1>
                  <p className="text-base text-zinc-400 font-medium mt-1">{slide.subtitle}</p>
                </div>
              </div>

              {/* Bullet points */}
              <div className="space-y-3">
                {slide.content.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.3 }}
                    className="flex items-start gap-3"
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-2 flex-none"
                      style={{ background: slide.accent }}
                    />
                    <p className="text-sm xl:text-base text-zinc-300 leading-relaxed font-medium">{item}</p>
                  </motion.div>
                ))}
              </div>

              {/* Lab callout */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-xl border p-4 flex gap-3"
                style={{ background: `${slide.accent}0c`, borderColor: `${slide.accent}30` }}
              >
                <Play className="w-4 h-4 flex-none mt-0.5" style={{ color: slide.accent }} />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: slide.accent }}>Lab Exercise</p>
                  <p className="text-xs text-zinc-300 leading-relaxed">{slide.lab}</p>
                </div>
              </motion.div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-3 mt-8 lg:mt-0">
              <button
                onClick={prev}
                className="p-3 rounded-xl bg-white/5 border border-white/8 hover:bg-white/10 active:scale-95 transition-all flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-xs font-bold hidden sm:inline">Prev</span>
              </button>
              <button
                onClick={next}
                className="flex-1 py-3 px-5 rounded-xl font-bold text-sm active:scale-95 transition-all flex items-center justify-center gap-2"
                style={{ background: slide.accent, color: '#000' }}
              >
                {current === slides.length - 1 ? 'Restart' : 'Next Lesson'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* RIGHT PANEL — Code / Preview */}
        <div className="flex-1 flex flex-col overflow-hidden p-4 lg:p-6 gap-3">
          {/* Panel toolbar */}
          <div className="flex items-center justify-between flex-none">
            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/8">
              <button
                onClick={() => setViewMode('code')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'code' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:text-white'}`}
              >
                <Code2 className="w-3.5 h-3.5" />
                Code Editor
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'preview' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:text-white'}`}
              >
                <Monitor className="w-3.5 h-3.5" />
                Preview
              </button>
            </div>
            <button
              onClick={resetCode}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white border border-white/8 hover:border-white/20 bg-white/3 hover:bg-white/8 transition-all"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Editor / Preview */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`panel-${current}-${viewMode}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex-1 overflow-hidden rounded-xl border border-white/8"
            >
              {viewMode === 'code' ? (
                <CodeEditor code={codes[current]} onChange={updateCode} />
              ) : (
                <BrowserPreview indexCode={codes[current]} aboutCode={slides[current].code} slideIndex={current} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ── BOTTOM DOT NAV ── */}
      <footer className="relative z-20 flex justify-center items-center gap-2 py-3 border-t border-white/8 bg-black/20 backdrop-blur-xl flex-none">
        {slides.map((s, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? 1 : -1)}
            title={s.title}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === current ? 28 : 8,
              height: 8,
              background: i === current ? slide.accent : 'rgba(255,255,255,0.15)',
            }}
          />
        ))}
      </footer>

      {/* Keyboard hint */}
      <div className="fixed bottom-14 right-4 text-[10px] text-zinc-700 font-mono hidden lg:flex items-center gap-1">
        <kbd className="px-1 py-0.5 border border-zinc-800 rounded text-[9px]">←</kbd>
        <kbd className="px-1 py-0.5 border border-zinc-800 rounded text-[9px]">→</kbd>
        navigate
      </div>
    </div>
  );
}

export default function HtmlLessonSlides() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
          <p className="text-zinc-600 text-sm font-mono">Loading lesson...</p>
        </div>
      </div>
    }>
      <HtmlLessonContent />
    </Suspense>
  );
}