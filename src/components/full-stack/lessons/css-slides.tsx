"use client";

import React, { useState, useEffect, useCallback, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ChevronLeft, ChevronRight, Palette, Layout, Box, Type,
  MousePointer2, Layers, Move, Sparkles, Smartphone, Code2,
  Copy, Check, Monitor, Globe, RefreshCw, ArrowLeft, ArrowRight,
  Target, Grid, AlignJustify, List, Play, RotateCcw, FileCode,
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
  html: string;
  css: string;
  icon: React.ElementType;
}

const slides: Slide[] = [
  {
    id: "01", title: "CSS Intro", subtitle: "What is CSS?",
    tag: "Foundation", tagColor: "#60a5fa", accent: "#3b82f6",
    bg: "radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.12) 0%, transparent 60%)",
    content: ["CSS adds colour, layout, and style to HTML", "Selectors choose which element to target", "Properties define what changes (color, size…)", "Values set the exact outcome (blue, 40px…)"],
    lab: "Change the background color of the box to orange.",
    html: `<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <title>CSS Intro</title>\n</head>\n<body>\n  <div class="box">\n    Hello World\n  </div>\n</body>\n</html>`,
    css: `.box {\n  color: white;\n  background: #3b82f6;\n  padding: 40px;\n  border-radius: 20px;\n  text-align: center;\n  font-size: 40px;\n  font-weight: bold;\n}`,
    icon: Palette,
  },
  {
    id: "02", title: "CSS Inclusion", subtitle: "How to Add Styles",
    tag: "Foundation", tagColor: "#34d399", accent: "#10b981",
    bg: "radial-gradient(ellipse at 70% 30%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    content: ["Inline — style attribute on the element itself", "Internal — <style> block inside the <head>", "External — separate .css file (recommended)", "External keeps HTML clean and styles reusable"],
    lab: "Move the internal styles into the 'style.css' tab.",
    html: `<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <title>Inclusion Methods</title>\n  <link rel="stylesheet" href="style.css">\n  <style>\n    .internal-box {\n      background: #fdf2f2;\n      border: 2px solid #ef4444;\n      padding: 30px;\n      text-align: center;\n      font-size: 24px;\n      font-weight: bold;\n    }\n  </style>\n</head>\n<body>\n  <div class="internal-box">Internal CSS</div>\n  <br>\n  <div class="external-box">External CSS</div>\n</body>\n</html>`,
    css: `.external-box {\n  background: #f0fdf4;\n  border: 2px solid #22c55e;\n  padding: 30px;\n  text-align: center;\n  border-radius: 10px;\n  font-size: 24px;\n  font-weight: bold;\n}`,
    icon: Globe,
  },
  {
    id: "03", title: "Class vs ID", subtitle: "Group vs Unique",
    tag: "Selectors", tagColor: "#fb923c", accent: "#f97316",
    bg: "radial-gradient(ellipse at 30% 70%, rgba(249,115,22,0.12) 0%, transparent 60%)",
    content: [".class — styles many elements at once", "#id — styles exactly one unique element", "IDs have higher specificity and 'win' battles", "Classes are preferred for reusable components"],
    lab: "Create a second card and style it using the .card class.",
    html: `<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <title>Class vs ID</title>\n</head>\n<body>\n  <h1 id="main-title">Professional Lab</h1>\n  <div class="card">Card Item 1</div>\n  <div class="card shadow">Card Item 2</div>\n  <div class="card">Card Item 3</div>\n</body>\n</html>`,
    css: `#main-title {\n  color: #3b82f6;\n  font-size: 3.5rem;\n  text-align: center;\n}\n\n.card {\n  background: #f8fafc;\n  border: 1px solid #e2e8f0;\n  padding: 25px;\n  margin-top: 15px;\n  border-radius: 12px;\n  color: #475569;\n  font-size: 1.5rem;\n  font-weight: 600;\n}\n\n.shadow {\n  box-shadow: 0 4px 12px rgba(0,0,0,0.1);\n  border-color: #3b82f6;\n}`,
    icon: Target,
  },
  {
    id: "04", title: "The Box Model", subtitle: "Spacing & Borders",
    tag: "Layout", tagColor: "#818cf8", accent: "#6366f1",
    bg: "radial-gradient(ellipse at 60% 40%, rgba(99,102,241,0.12) 0%, transparent 60%)",
    content: ["Content — the actual text or image inside", "Padding — space inside between content and border", "Border — the visible line around the element", "Margin — space outside between elements"],
    lab: "Increase the margin to 50px and see the gap grow.",
    html: `<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <title>Box Model</title>\n</head>\n<body>\n  <div class="container">\n    <div class="box">Item 1</div>\n  </div>\n</body>\n</html>`,
    css: `.container {\n  background: #f1f5f9;\n  padding: 60px;\n}\n\n.box {\n  background: white;\n  padding: 40px;\n  border: 8px solid #6366f1;\n  margin: 20px;\n  color: #1e293b;\n  font-size: 2rem;\n  font-weight: bold;\n  text-align: center;\n}`,
    icon: Box,
  },
  {
    id: "05", title: "Color Systems", subtitle: "Picking the Right Colors",
    tag: "Styling", tagColor: "#22d3ee", accent: "#06b6d4",
    bg: "radial-gradient(ellipse at 25% 55%, rgba(6,182,212,0.12) 0%, transparent 60%)",
    content: ["HEX (#ffffff) — the most common web format", "RGB(255,255,255) — mix red, green, and blue", "HSL(0,100%,50%) — hue, saturation, lightness", "rgba() / hsla() — add transparency with alpha"],
    lab: "Change the gradient to go from red (#ef4444) to yellow (#f59e0b).",
    html: `<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <title>Colors</title>\n</head>\n<body>\n  <div class="card">\n    <h3>Vibrant Colors</h3>\n    <p>Using Gradients and Opacity</p>\n  </div>\n</body>\n</html>`,
    css: `.card {\n  background: linear-gradient(45deg, #6366f1, #a855f7);\n  color: white;\n  padding: 50px;\n  border-radius: 30px;\n  box-shadow: 0 20px 40px rgba(0,0,0,0.2);\n  text-align: center;\n}\n\nh3 {\n  font-size: 3rem;\n  margin-bottom: 10px;\n}\n\np {\n  font-size: 1.5rem;\n  opacity: 0.9;\n}`,
    icon: Palette,
  },
  {
    id: "06", title: "Typography", subtitle: "Font & Text Styles",
    tag: "Styling", tagColor: "#4ade80", accent: "#22c55e",
    bg: "radial-gradient(ellipse at 70% 60%, rgba(34,197,94,0.12) 0%, transparent 60%)",
    content: ["font-family — picks the typeface", "font-size — controls text size (px, rem, em)", "font-weight — thickness from 100 to 900", "line-height — vertical spacing between lines"],
    lab: "Increase the font-size of the h1 to 5rem.",
    html: `<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <title>Typography</title>\n</head>\n<body>\n  <div class="text-area">\n    <h1>Modern Design</h1>\n    <p>Good typography makes reading effortless and enjoyable.</p>\n  </div>\n</body>\n</html>`,
    css: `.text-area {\n  font-family: 'Inter', sans-serif;\n  padding: 40px;\n}\n\nh1 {\n  font-size: 4.5rem;\n  font-weight: 900;\n  letter-spacing: -3px;\n  color: #1e293b;\n  margin-bottom: 20px;\n}\n\np {\n  font-size: 1.8rem;\n  line-height: 1.6;\n  color: #64748b;\n  max-width: 600px;\n}`,
    icon: Type,
  },
  {
    id: "07", title: "Border Radius", subtitle: "Rounding the Edges",
    tag: "Styling", tagColor: "#fb7185", accent: "#f43f5e",
    bg: "radial-gradient(ellipse at 40% 25%, rgba(244,63,94,0.12) 0%, transparent 60%)",
    content: ["border-radius rounds the corners of a box", "Use 50% for a perfect circle", "Smaller values give subtle rounding (8px, 12px)", "border-radius: 40px gives the 'squircle' look"],
    lab: "Turn the green squircle into a perfect circle.",
    html: `<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <title>Border Radius</title>\n</head>\n<body>\n  <div class="shapes-row">\n    <div class="circle"></div>\n    <div class="squircle"></div>\n  </div>\n</body>\n</html>`,
    css: `.shapes-row {\n  display: flex;\n  gap: 40px;\n  padding: 40px;\n  justify-content: center;\n}\n\n.circle {\n  width: 150px;\n  height: 150px;\n  background: #ef4444;\n  border-radius: 50%;\n}\n\n.squircle {\n  width: 150px;\n  height: 150px;\n  background: #10b981;\n  border-radius: 40px;\n}`,
    icon: Sparkles,
  },
  {
    id: "08", title: "Hover Effects", subtitle: "Reacting to the Mouse",
    tag: "Interaction", tagColor: "#f472b6", accent: "#ec4899",
    bg: "radial-gradient(ellipse at 65% 45%, rgba(236,72,153,0.12) 0%, transparent 60%)",
    content: [":hover — triggers when the mouse enters", "transition — smoothly animates the change", "transform — moves, scales, or rotates an element", "Combine all three for polished micro-interactions"],
    lab: "Add 'rotate(10deg)' to the transform in the hover state.",
    html: `<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <title>Hover</title>\n</head>\n<body>\n  <button class="btn">Hover Me</button>\n</body>\n</html>`,
    css: `.btn {\n  padding: 30px 60px;\n  background: #ec4899;\n  color: white;\n  border: none;\n  border-radius: 60px;\n  font-size: 2rem;\n  font-weight: 900;\n  cursor: pointer;\n  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);\n}\n\n.btn:hover {\n  background: #db2777;\n  transform: translateY(-10px) scale(1.1);\n  box-shadow: 0 20px 40px rgba(219,39,119,0.4);\n}`,
    icon: MousePointer2,
  },
  {
    id: "09", title: "Positioning", subtitle: "Layering Elements",
    tag: "Layout", tagColor: "#a78bfa", accent: "#8b5cf6",
    bg: "radial-gradient(ellipse at 20% 40%, rgba(139,92,246,0.12) 0%, transparent 60%)",
    content: ["static — default, follows normal document flow", "relative — stays in flow but can offset itself", "absolute — removed from flow, positioned to parent", "z-index — controls which element stacks on top"],
    lab: "Move the badge to the bottom-right (bottom: -10px, right: -10px).",
    html: `<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <title>Positioning</title>\n</head>\n<body>\n  <div class="parent">\n    I am the parent\n    <div class="badge">New</div>\n  </div>\n</body>\n</html>`,
    css: `.parent {\n  position: relative;\n  padding: 120px;\n  background: #334155;\n  color: white;\n  border-radius: 20px;\n  font-size: 2rem;\n  font-weight: 700;\n  text-align: center;\n}\n\n.badge {\n  position: absolute;\n  top: -20px;\n  right: -20px;\n  background: #f43f5e;\n  padding: 10px 24px;\n  border-radius: 40px;\n  font-size: 1.2rem;\n  font-weight: 900;\n  box-shadow: 0 10px 20px rgba(244,63,94,0.4);\n}`,
    icon: Move,
  },
  {
    id: "10", title: "Flexbox Basics", subtitle: "One-Direction Layout",
    tag: "Flexbox", tagColor: "#fbbf24", accent: "#f59e0b",
    bg: "radial-gradient(ellipse at 55% 35%, rgba(245,158,11,0.12) 0%, transparent 60%)",
    content: ["display: flex — activates the flexbox model", "justify-content — distributes items on main axis", "align-items — aligns items on the cross axis", "gap — adds uniform space between flex children"],
    lab: "Change justify-content to 'space-between' to separate the boxes.",
    html: `<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <title>Flexbox</title>\n</head>\n<body>\n  <div class="parent">\n    <div class="child">1</div>\n    <div class="child">2</div>\n    <div class="child">3</div>\n  </div>\n</body>\n</html>`,
    css: `.parent {\n  display: flex;\n  gap: 30px;\n  justify-content: center;\n  align-items: center;\n  min-height: 300px;\n  background: #f8fafc;\n  border-radius: 20px;\n}\n\n.child {\n  width: 80px;\n  height: 80px;\n  background: #f59e0b;\n  color: white;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  border-radius: 15px;\n  font-size: 2rem;\n  font-weight: bold;\n}`,
    icon: Layout,
  },
  {
    id: "11", title: "Flex Direction", subtitle: "Row vs Column",
    tag: "Flexbox", tagColor: "#818cf8", accent: "#6366f1",
    bg: "radial-gradient(ellipse at 35% 65%, rgba(99,102,241,0.12) 0%, transparent 60%)",
    content: ["flex-direction: row — items side by side (default)", "flex-direction: column — items stacked vertically", "row-reverse / column-reverse flip the order", "Switch direction in media queries for responsive layouts"],
    lab: "Flip the stack to 'row' and see how the layout reacts.",
    html: `<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <title>Flex Direction</title>\n</head>\n<body>\n  <div class="stack">\n    <div class="box">Header</div>\n    <div class="box">Content</div>\n    <div class="box">Footer</div>\n  </div>\n</body>\n</html>`,
    css: `.stack {\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n  padding: 40px;\n}\n\n.box {\n  background: #6366f1;\n  color: white;\n  padding: 30px;\n  text-align: center;\n  border-radius: 15px;\n  font-size: 1.8rem;\n  font-weight: bold;\n}`,
    icon: List,
  },
  {
    id: "12", title: "Flex Wrap", subtitle: "Auto-stacking Items",
    tag: "Flexbox", tagColor: "#38bdf8", accent: "#0ea5e9",
    bg: "radial-gradient(ellipse at 70% 50%, rgba(14,165,233,0.12) 0%, transparent 60%)",
    content: ["flex-wrap: wrap — items drop to the next line", "flex: 1 1 200px — grow, shrink, and base-width", "Creates responsive card grids without media queries", "Combine with gap for clean, even spacing"],
    lab: "Set the item width to 200px and see the wrapping in action.",
    html: `<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <title>Flex Wrap</title>\n</head>\n<body>\n  <div class="gallery">\n    <div class="item">Box 1</div>\n    <div class="item">Box 2</div>\n    <div class="item">Box 3</div>\n    <div class="item">Box 4</div>\n  </div>\n</body>\n</html>`,
    css: `.gallery {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 20px;\n  padding: 20px;\n}\n\n.item {\n  flex: 1 1 150px;\n  height: 150px;\n  background: #0ea5e9;\n  color: white;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  border-radius: 12px;\n  font-size: 1.5rem;\n  font-weight: 900;\n}`,
    icon: Layers,
  },
  {
    id: "13", title: "CSS Grid", subtitle: "Two-Dimensional Layout",
    tag: "Grid", tagColor: "#c084fc", accent: "#a855f7",
    bg: "radial-gradient(ellipse at 45% 30%, rgba(168,85,247,0.12) 0%, transparent 60%)",
    content: ["display: grid — activates the grid layout system", "grid-template-columns — defines column widths", "fr unit — proportional fraction of available space", "gap — space between all rows and columns"],
    lab: "Change to 3 columns using '1fr 1fr 1fr'.",
    html: `<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <title>CSS Grid</title>\n</head>\n<body>\n  <div class="grid-container">\n    <div class="item">A</div>\n    <div class="item">B</div>\n    <div class="item">C</div>\n    <div class="item">D</div>\n  </div>\n</body>\n</html>`,
    css: `.grid-container {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 30px;\n  padding: 30px;\n}\n\n.item {\n  background: #a855f7;\n  color: white;\n  padding: 60px;\n  text-align: center;\n  border-radius: 20px;\n  font-weight: 900;\n  font-size: 3rem;\n}`,
    icon: Grid,
  },
  {
    id: "14", title: "Grid Areas", subtitle: "Named Layout Zones",
    tag: "Grid", tagColor: "#60a5fa", accent: "#3b82f6",
    bg: "radial-gradient(ellipse at 25% 60%, rgba(59,130,246,0.12) 0%, transparent 60%)",
    content: ["grid-template-areas — name zones with strings", "grid-area — assign an element to a named zone", "Great for header / sidebar / main / footer layouts", "Change the template string to redesign the layout"],
    lab: "Swap the 'side' and 'main' area names in the template.",
    html: `<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <title>Grid Areas</title>\n</head>\n<body>\n  <div class="layout">\n    <header>Header</header>\n    <aside>Side</aside>\n    <main>Main Content</main>\n  </div>\n</body>\n</html>`,
    css: `.layout {\n  display: grid;\n  grid-template-areas:\n    "head head"\n    "side main";\n  grid-template-columns: 150px 1fr;\n  gap: 20px;\n  padding: 20px;\n  font-size: 1.5rem;\n  font-weight: bold;\n}\n\nheader {\n  grid-area: head;\n  background: #3b82f6;\n  padding: 30px;\n  color: white;\n  border-radius: 12px;\n  text-align: center;\n}\n\naside {\n  grid-area: side;\n  background: #f1f5f9;\n  padding: 30px;\n  border-radius: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\nmain {\n  grid-area: main;\n  background: #e2e8f0;\n  padding: 60px;\n  border-radius: 12px;\n  min-height: 200px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}`,
    icon: AlignJustify,
  },
  {
    id: "15", title: "Media Queries", subtitle: "Responsive Design",
    tag: "Responsive", tagColor: "#94a3b8", accent: "#64748b",
    bg: "radial-gradient(ellipse at 60% 30%, rgba(100,116,139,0.12) 0%, transparent 60%)",
    content: ["@media — applies styles at specific breakpoints", "max-width: 600px — targets screens ≤600px wide", "min-width: 768px — targets screens ≥768px wide", "Mobile-first: start small, add complexity upward"],
    lab: "Add a second @media for width 800px and change the color to green.",
    html: `<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Responsive</title>\n</head>\n<body>\n  <div class="responsive-box">\n    Resize this window!\n  </div>\n</body>\n</html>`,
    css: `.responsive-box {\n  background: #3b82f6;\n  color: white;\n  padding: 60px;\n  text-align: center;\n  transition: 0.3s;\n  font-size: 2.5rem;\n  font-weight: bold;\n  border-radius: 20px;\n}\n\n@media (max-width: 600px) {\n  .responsive-box {\n    background: #ec4899;\n    font-size: 1.5rem;\n  }\n}`,
    icon: Smartphone,
  },
  {
    id: "FA", title: "Final Project", subtitle: "Styled Dashboard",
    tag: "Assignment", tagColor: "#fde047", accent: "#eab308",
    bg: "radial-gradient(ellipse at 50% 50%, rgba(234,179,8,0.15) 0%, transparent 60%), radial-gradient(ellipse at 10% 90%, rgba(249,115,22,0.08) 0%, transparent 50%)",
    content: ["Center a card using Flexbox or Grid", "Apply a gradient background with linear-gradient()", "Add a :hover scale effect to buttons", "Use a Google Font (add @import at the top)", "Switch to single column on mobile with @media"],
    lab: "Build a responsive profile dashboard with sidebar, content area, and hover effects.",
    html: `<!-- START YOUR CSS PROJECT -->\n<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>My Dashboard</title>\n</head>\n<body>\n  <div class="dashboard">\n    <div class="sidebar">\n      <h2>Menu</h2>\n      <ul>\n        <li>Home</li>\n        <li>Profile</li>\n        <li>Settings</li>\n      </ul>\n    </div>\n    <div class="content">\n      <h1>Welcome, Student!</h1>\n      <p>Start building your dashboard here.</p>\n      <button class="btn">Get Started</button>\n    </div>\n  </div>\n</body>\n</html>`,
    css: `.dashboard {\n  display: flex;\n  min-height: 400px;\n  gap: 20px;\n  padding: 20px;\n  background: #f8fafc;\n}\n\n/* Add your styles here... */\n.sidebar {\n  width: 200px;\n  background: #1e293b;\n  color: white;\n  padding: 24px;\n  border-radius: 16px;\n}\n\n.content {\n  flex: 1;\n  background: white;\n  padding: 40px;\n  border-radius: 16px;\n  border: 1px solid #e2e8f0;\n}`,
    icon: Sparkles,
  },
];

/* ─── CSS SYNTAX HIGHLIGHTER ─────────────────────────────────────── */
const HighlightedCss = ({ code }: { code: string }) => {
  const tokenizeLine = (line: string): React.ReactNode => {
    // Comments
    if (line.trimStart().startsWith('/*')) {
      return <span style={{ color: '#6b7280', fontStyle: 'italic' }}>{line}</span>;
    }
    // At-rules (@media, @import, @keyframes)
    if (line.trimStart().startsWith('@')) {
      return <span style={{ color: '#34d399', fontWeight: 700 }}>{line}</span>;
    }
    // Property: value; lines
    const propMatch = line.match(/^(\s*)([a-zA-Z-]+)(\s*:\s*)(.+?)(;?\s*)$/);
    if (propMatch) {
      const [, indent, prop, colon, value, semi] = propMatch;
      return <>
        <span>{indent}</span>
        <span style={{ color: '#f87171' }}>{prop}</span>
        <span style={{ color: '#e2e8f0' }}>{colon}</span>
        <span style={{ color: '#86efac' }}>{value}</span>
        <span style={{ color: '#e2e8f0' }}>{semi}</span>
      </>;
    }
    // Selectors (lines ending with {)
    if (line.trim().endsWith('{') || line.trim() === '{') {
      return <span style={{ color: '#fbbf24', fontWeight: 700 }}>{line}</span>;
    }
    // Closing brace
    if (line.trim() === '}') {
      return <span style={{ color: '#e2e8f0' }}>{line}</span>;
    }
    return <span style={{ color: '#e2e8f0' }}>{line}</span>;
  };

  return (
    <div
      className="font-mono text-sm leading-6 whitespace-pre"
      style={{ fontFamily: "'JetBrains Mono','Fira Code','Cascadia Code',monospace" }}
    >
      {code.split('\n').map((line, i) => (
        <div key={i} className="min-h-[1.5rem]">{tokenizeLine(line)}</div>
      ))}
    </div>
  );
};

/* ─── HTML SYNTAX HIGHLIGHTER ────────────────────────────────────── */
const HighlightedHtml = ({ code }: { code: string }) => {
  const tokenizeLine = (line: string): React.ReactNode => {
    if (line.trimStart().startsWith('<!--')) {
      return <span style={{ color: '#6b7280', fontStyle: 'italic' }}>{line}</span>;
    }
    // Split on tags
    const parts = line.split(/(<\/?[a-zA-Z][^>]*\/?>)/g);
    return parts.map((part, i) => {
      if (!part) return null;
      if (part.startsWith('</')) {
        return <span key={i} style={{ color: '#f87171' }}>{part}</span>;
      }
      if (part.startsWith('<')) {
        // Colour attributes inside tag
        const coloured = part.replace(
          /(\s[a-zA-Z-]+=)("(?:[^"]*)")/g,
          (_, attr, val) => `<attr>${attr}</attr><val>${val}</val>`
        );
        if (coloured.includes('<attr>')) {
          const segments = coloured.split(/(<attr>|<\/attr>|<val>|<\/val>)/g).filter(Boolean);
          let inAttr = false, inVal = false;
          return (
            <span key={i}>
              {segments.map((s, j) => {
                if (s === '<attr>') { inAttr = true; return null; }
                if (s === '</attr>') { inAttr = false; return null; }
                if (s === '<val>') { inVal = true; return null; }
                if (s === '</val>') { inVal = false; return null; }
                if (inAttr) return <span key={j} style={{ color: '#fbbf24' }}>{s}</span>;
                if (inVal) return <span key={j} style={{ color: '#86efac' }}>{s}</span>;
                return <span key={j} style={{ color: '#f87171' }}>{s}</span>;
              })}
            </span>
          );
        }
        return <span key={i} style={{ color: '#f87171' }}>{part}</span>;
      }
      return <span key={i} style={{ color: '#e2e8f0' }}>{part}</span>;
    });
  };

  return (
    <div
      className="font-mono text-sm leading-6 whitespace-pre"
      style={{ fontFamily: "'JetBrains Mono','Fira Code','Cascadia Code',monospace" }}
    >
      {code.split('\n').map((line, i) => (
        <div key={i} className="min-h-[1.5rem]">{tokenizeLine(line)}</div>
      ))}
    </div>
  );
};

/* ─── DUAL-FILE EDITOR ───────────────────────────────────────────── */
type FileTab = 'html' | 'css';

const DualEditor = ({
  htmlCode, cssCode,
  onHtmlChange, onCssChange,
  activeTab, onTabChange,
  accent,
}: {
  htmlCode: string; cssCode: string;
  onHtmlChange: (v: string) => void; onCssChange: (v: string) => void;
  activeTab: FileTab; onTabChange: (t: FileTab) => void;
  accent: string;
}) => {
  const [copied, setCopied] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  const activeCode = activeTab === 'css' ? cssCode : htmlCode;
  const lines = activeCode.split('\n');

  const copy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (val: string) => {
    if (activeTab === 'css') onCssChange(val);
    else onHtmlChange(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.currentTarget;
      const s = ta.selectionStart;
      const next = activeCode.slice(0, s) + '  ' + activeCode.slice(ta.selectionEnd);
      handleChange(next);
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
          {/* File tabs */}
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={() => onTabChange('html')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'html'
                  ? 'bg-orange-500/20 border border-orange-500/40 text-orange-400'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <FileCode className="w-3 h-3" />index.html
            </button>
            <button
              onClick={() => onTabChange('css')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'css'
                  ? 'border text-purple-400'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              style={activeTab === 'css' ? { background: `${accent}20`, borderColor: `${accent}40`, color: accent } : {}}
            >
              <FileCode className="w-3 h-3" />style.css
            </button>
          </div>
        </div>
        <button
          onClick={copy}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
            copied
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
              : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
          }`}
        >
          {copied ? <><Check className="w-3 h-3" />Copied!</> : <><Copy className="w-3 h-3" />Copy</>}
        </button>
      </div>

      {/* Editor body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Line numbers */}
        <div className="flex-none w-9 bg-[#0d1117] border-r border-white/5 pt-4 pb-4 flex flex-col items-end pr-2 overflow-hidden select-none">
          {lines.map((_, i) => (
            <div key={i} className="text-[11px] font-mono text-zinc-600 leading-6 min-h-[1.5rem]">{i + 1}</div>
          ))}
        </div>
        {/* Highlight + textarea */}
        <div className="relative flex-1 overflow-hidden">
          <div
            ref={highlightRef}
            className="absolute inset-0 overflow-auto p-4 pointer-events-none"
            style={{ scrollbarWidth: 'none' }}
          >
            {activeTab === 'css'
              ? <HighlightedCss code={cssCode} />
              : <HighlightedHtml code={htmlCode} />
            }
          </div>
          <textarea
            ref={taRef}
            value={activeCode}
            onChange={e => handleChange(e.target.value)}
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

/* ─── LIVE PREVIEW ───────────────────────────────────────────────── */
const LivePreview = ({ htmlCode, cssCode }: { htmlCode: string; cssCode: string }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    // Extract body contents and internal styles
    const bodyMatch = htmlCode.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    const bodyContent = bodyMatch ? bodyMatch[1] : htmlCode;
    const internalStyleMatch = htmlCode.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
    const internalStyles = internalStyleMatch
      ? internalStyleMatch.map(s => s.replace(/<\/?style[^>]*>/gi, '')).join('\n')
      : '';

    const src = `<!DOCTYPE html><html><head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { box-sizing: border-box; }
        body { margin: 0; font-family: sans-serif; }
        ${internalStyles}
        ${cssCode}
      </style>
    </head><body>${bodyContent}</body></html>`;

    doc.open();
    doc.write(src);
    doc.close();
  }, [htmlCode, cssCode]);

  return (
    <div className="w-full h-full flex flex-col bg-zinc-100">
      {/* Chrome bar */}
      <div className="bg-zinc-200 border-b border-zinc-300 px-3 py-1.5 flex items-center gap-3 flex-none">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 bg-white border border-zinc-300 rounded px-2 py-0.5 text-[9px] font-mono text-zinc-500 flex items-center gap-1.5">
          <Globe className="w-3 h-3 text-blue-400 flex-none" />
          127.0.0.1:5500/style-test.html
        </div>
        <span className="text-[9px] font-bold text-emerald-600 uppercase flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Live
        </span>
      </div>
      <iframe
        ref={iframeRef}
        className="flex-1 w-full border-none bg-white"
        title="CSS preview"
        sandbox="allow-scripts"
      />
    </div>
  );
};

/* ─── MAIN COMPONENT ─────────────────────────────────────────────── */
function CssLessonContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSlide = Math.max(0, Math.min(parseInt(searchParams.get('slide') || '1') - 1, slides.length - 1));

  const [current, setCurrent] = useState(initialSlide);
  const [panelView, setPanelView] = useState<'code' | 'preview'>('code');
  const [activeTab, setActiveTab] = useState<FileTab>('css');
  const [htmlCodes, setHtmlCodes] = useState<string[]>(slides.map(s => s.html));
  const [cssCodes, setCssCodes] = useState<string[]>(slides.map(s => s.css));
  const [isAnimating, setIsAnimating] = useState(false);
  const [dir, setDir] = useState(1);

  const slide = slides[current];
  const IconComp = slide.icon;
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
      setActiveTab('css');
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

  const updateHtml = (val: string) => {
    const n = [...htmlCodes]; n[current] = val; setHtmlCodes(n);
  };
  const updateCss = (val: string) => {
    const n = [...cssCodes]; n[current] = val; setCssCodes(n);
  };
  const resetCodes = () => {
    const nh = [...htmlCodes]; nh[current] = slides[current].html; setHtmlCodes(nh);
    const nc = [...cssCodes]; nc[current] = slides[current].css; setCssCodes(nc);
  };

  const variants = {
    enter: (d: number) => ({ x: d * 50, opacity: 0, scale: 0.97 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit:  (d: number) => ({ x: d * -50, opacity: 0, scale: 0.97 }),
  };

  return (
    <div
      className="min-h-screen text-white flex flex-col overflow-hidden"
      style={{ background: '#080c14', fontFamily: "'Inter','DM Sans',system-ui,sans-serif" }}
    >
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none transition-all duration-700" style={{ background: slide.bg }} />
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.02) 0%, transparent 70%)' }} />

      {/* ── HEADER ── */}
      <header className="relative z-20 flex items-center gap-4 px-6 py-3 border-b border-white/8 bg-black/20 backdrop-blur-xl flex-none">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center border border-white/10 flex-none"
          style={{ background: `${slide.accent}20` }}
        >
          <IconComp className="w-3.5 h-3.5" style={{ color: slide.accent }} />
        </div>
        <div className="flex-none">
          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-600 font-bold">Module 02 · Weeks 02–03</p>
          <p className="text-xs font-black text-white tracking-tight">CSS Essentials</p>
        </div>

        {/* Progress bar */}
        <div className="flex-1 mx-6 hidden md:block">
          <div className="h-0.5 bg-white/8 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: slide.accent }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span
            className="text-[9px] font-bold px-2 py-0.5 rounded-full border"
            style={{ color: slide.tagColor, borderColor: `${slide.tagColor}40`, background: `${slide.tagColor}12` }}
          >
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

            {/* Navigation */}
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

        {/* RIGHT — Editor / Preview */}
        <div className="flex-1 flex flex-col overflow-hidden p-4 lg:p-5 gap-3">

          {/* Panel toolbar */}
          <div className="flex items-center justify-between flex-none">
            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/8">
              <button
                onClick={() => setPanelView('code')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
                  panelView === 'code' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Code2 className="w-3 h-3" /> Editor
              </button>
              <button
                onClick={() => setPanelView('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
                  panelView === 'preview' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3 h-3" /> Preview
              </button>
            </div>
            <button
              onClick={resetCodes}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-white border border-white/8 hover:border-white/20 bg-white/3 hover:bg-white/8 transition-all"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Panel content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`panel-${current}-${panelView}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-hidden rounded-xl border border-white/8"
            >
              {panelView === 'code' ? (
                <DualEditor
                  htmlCode={htmlCodes[current]}
                  cssCode={cssCodes[current]}
                  onHtmlChange={updateHtml}
                  onCssChange={updateCss}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  accent={slide.accent}
                />
              ) : (
                <LivePreview htmlCode={htmlCodes[current]} cssCode={cssCodes[current]} />
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

export default function CssLessonSlides() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto" />
          <p className="text-zinc-600 text-sm font-mono">Loading CSS Lab...</p>
        </div>
      </div>
    }>
      <CssLessonContent />
    </Suspense>
  );
}