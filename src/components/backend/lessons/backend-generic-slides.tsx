"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react';

export interface DiagramNode {
  label: string;
  desc: string;
  color: string;
}

export interface QuizOption {
  text: string;
  correct: boolean;
  explanation: string;
}

export interface Slide {
  title: string;
  subtitle: string;
  content: string;
  type: 'concept' | 'code' | 'diagram' | 'hero' | 'quiz';
  icon: React.ElementType;
  // Code slides
  codeSnippet?: string;
  language?: 'php' | 'ts' | 'js' | 'bash';
  codeFileName?: string;
  keyPoints?: string[];
  // Diagram slides
  diagramNodes?: DiagramNode[];
  // Quiz slides
  question?: string;
  options?: QuizOption[];
  // Concept slides
  callout?: string;
}

// ─── PHP-aware Syntax Highlighter ─────────────────────────────────────────────
function highlightPHP(line: string): React.ReactNode[] {
  const rules: { regex: RegExp; cls: string }[] = [
    { regex: /(#\[.*?\])/g,                                                                        cls: 'tok-attr' },
    { regex: /(\/\/.*|#(?!\[).*)/g,                                                                cls: 'tok-comment' },
    { regex: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g,                                            cls: 'tok-str' },
    { regex: /\b(declare|strict_types|namespace|use|class|interface|trait|enum|abstract|final|readonly|extends|implements|new|return|fn|function|match|throw|try|catch|finally|if|else|elseif|foreach|for|while|echo|print|yield|static|public|protected|private|const|case|default|break|continue|null|true|false)\b/g, cls: 'tok-kw' },
    { regex: /\b(string|int|float|bool|array|void|never|mixed|self|parent|iterable|callable|object)\b/g, cls: 'tok-type' },
    { regex: /(\$[a-zA-Z_][a-zA-Z0-9_]*)/g,                                                       cls: 'tok-var' },
    { regex: /\b(\d+(\.\d+)?)\b/g,                                                                cls: 'tok-num' },
    { regex: /([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g,                                               cls: 'tok-fn' },
    { regex: /\b([A-Z][a-zA-Z0-9_]*)\b/g,                                                         cls: 'tok-class' },
  ];

  type Seg = { s: number; e: number; cls: string };
  const segs: Seg[] = [];
  for (const { regex, cls } of rules) {
    regex.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = regex.exec(line)) !== null) {
      const s = m.index, e = m.index + m[0].length;
      if (!segs.some(x => s < x.e && e > x.s)) segs.push({ s, e, cls });
    }
  }
  segs.sort((a, b) => a.s - b.s);
  const out: React.ReactNode[] = [];
  let cur = 0;
  for (const { s, e, cls } of segs) {
    if (s > cur) out.push(line.slice(cur, s));
    out.push(<span key={s} className={cls}>{line.slice(s, e)}</span>);
    cur = e;
  }
  if (cur < line.length) out.push(line.slice(cur));
  return out;
}

// ─── Slide Components ─────────────────────────────────────────────────────────

function HeroSlide({ slide, lessonTitle, index, total }: { slide: Slide; lessonTitle: string; index: number; total: number }) {
  const Icon = slide.icon;
  return (
    <div className="hero-slide">
      <div className="hero-left">
        <div className="hero-eyebrow">{lessonTitle}</div>
        <h1 className="hero-title">{slide.title}</h1>
        <div className="hero-rule" />
        <p className="hero-sub">{slide.subtitle}</p>
        <p className="hero-body">{slide.content}</p>
        <div className="hero-progress">
          <div className="hero-progress-bar" style={{ width: `${((index + 1) / total) * 100}%` }} />
        </div>
        <span className="hero-progress-label">{index + 1} of {total} slides</span>
      </div>
      <div className="hero-right">
        <div className="hero-icon-circle"><Icon size={40} strokeWidth={1.2} /></div>
        <div className="hero-type-badge">{slide.subtitle}</div>
      </div>
    </div>
  );
}

function ConceptSlide({ slide }: { slide: Slide }) {
  const Icon = slide.icon;
  return (
    <div className="concept-slide">
      <div className="concept-left">
        <div className="slide-label">Concept</div>
        <h2 className="slide-title">{slide.title}</h2>
        <div className="slide-sub">{slide.subtitle}</div>
        <p className="concept-body">{slide.content}</p>
        {slide.callout && (
          <div className="concept-callout">
            <span className="callout-icon">💡</span>
            <span>{slide.callout}</span>
          </div>
        )}
        {slide.keyPoints && (
          <ul className="key-points">
            {slide.keyPoints.map((pt, i) => (
              <li key={i} className="key-point"><span className="kp-dot" />{pt}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="concept-right">
        <div className="concept-panel">
          <Icon size={88} strokeWidth={0.5} className="concept-bg-icon" />
          <div className="concept-badge">Architectural Pattern</div>
        </div>
        {slide.subtitle && (
          <blockquote className="concept-pull">&ldquo;{slide.subtitle}&rdquo;</blockquote>
        )}
      </div>
    </div>
  );
}

function CodeSlide({ slide }: { slide: Slide }) {
  const Icon = slide.icon;
  const lines = (slide.codeSnippet ?? '').split('\n');
  const lang = slide.language ?? 'php';
  const fileName = slide.codeFileName ?? `example.${lang}`;
  return (
    <div className="code-slide">
      <div className="code-header">
        <div className="code-meta">
          <div className="slide-label">Code</div>
          <h2 className="slide-title">{slide.title}</h2>
          <p className="code-desc">{slide.content}</p>
        </div>
        <div className="code-icon"><Icon size={20} /></div>
      </div>
      <div className="code-terminal">
        <div className="code-bar">
          <div className="dots"><div className="dot dr" /><div className="dot dy" /><div className="dot dg" /></div>
          <span className="code-filename">{fileName}</span>
          <span className="code-lang">{lang.toUpperCase()}</span>
        </div>
        <div className="code-body">
          <div className="code-gutter">
            {lines.map((_, i) => <div key={i} className="ln">{i + 1}</div>)}
          </div>
          <pre className="code-pre">
            {lines.map((line, i) => (
              <div key={i} className="code-line">{highlightPHP(line)}</div>
            ))}
          </pre>
        </div>
      </div>
      {slide.keyPoints && (
        <div className="code-takeaways">
          <span className="takeaway-label">Key takeaways</span>
          <div className="takeaway-list">
            {slide.keyPoints.map((pt, i) => (
              <div key={i} className="takeaway-item"><span className="kp-dot" />{pt}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DiagramSlide({ slide }: { slide: Slide }) {
  const Icon = slide.icon;
  const nodes = slide.diagramNodes ?? [];
  return (
    <div className="diagram-slide">
      <div className="diagram-header">
        <div>
          <div className="slide-label">Diagram</div>
          <h2 className="slide-title">{slide.title}</h2>
          <p className="slide-sub">{slide.subtitle}</p>
        </div>
        <div className="code-icon"><Icon size={20} /></div>
      </div>
      <div className="diagram-flow">
        {nodes.map((node, i) => (
          <React.Fragment key={i}>
            <div className="d-node">
              <div className="d-dot" style={{ background: node.color }} />
              <div className="d-label">{node.label}</div>
              <div className="d-desc">{node.desc}</div>
            </div>
            {i < nodes.length - 1 && (
              <div className="d-arrow">
                <div className="d-line" />
                <div className="d-head" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <p className="diagram-caption">{slide.content}</p>
    </div>
  );
}

function QuizSlide({ slide }: { slide: Slide }) {
  const [selected, setSelected] = useState<number | null>(null);
  const opts = slide.options ?? [];
  const answered = selected !== null;
  return (
    <div className="quiz-slide">
      <div className="slide-label">Knowledge Check</div>
      <h2 className="quiz-question">{slide.question ?? slide.title}</h2>
      <div className="quiz-options">
        {opts.map((opt, i) => {
          const chosen = selected === i;
          const reveal = answered;
          const state = !reveal ? 'idle' : opt.correct ? 'correct' : chosen ? 'wrong' : 'idle';
          return (
            <button
              key={i}
              className={`quiz-option qo-${state} ${chosen ? 'qo-chosen' : ''}`}
              onClick={() => !answered && setSelected(i)}
              disabled={answered}
            >
              <span className="qo-letter">{String.fromCharCode(65 + i)}</span>
              <span className="qo-text">{opt.text}</span>
              {reveal && opt.correct && <CheckCircle size={16} className="qo-icon" />}
              {reveal && chosen && !opt.correct && <XCircle size={16} className="qo-icon" />}
            </button>
          );
        })}
      </div>
      {answered && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`quiz-explain ${opts[selected!]?.correct ? 'qe-correct' : 'qe-wrong'}`}
        >
          <strong>{opts[selected!]?.correct ? '✓ Correct!' : '✗ Not quite.'}</strong>{' '}
          {opts[selected!]?.explanation}
        </motion.div>
      )}
    </div>
  );
}

// ─── Shell ─────────────────────────────────────────────────────────────────────
export default function BackendGenericSlides({
  lessonTitle = 'Backend Engineering',
  slides = [],
}: {
  lessonTitle?: string;
  slides?: Slide[];
}) {
  const [cur, setCur] = useState(0);
  const next = useCallback(() => setCur(c => Math.min(c + 1, slides.length - 1)), [slides.length]);
  const prev = useCallback(() => setCur(c => Math.max(c - 1, 0)), []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'ArrowRight') next(); if (e.key === 'ArrowLeft') prev(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [next, prev]);

  const slide = slides[cur];
  const pct = ((cur + 1) / slides.length) * 100;

  const renderSlide = () => {
    switch (slide.type) {
      case 'hero':    return <HeroSlide slide={slide} lessonTitle={lessonTitle} index={cur} total={slides.length} />;
      case 'concept': return <ConceptSlide slide={slide} />;
      case 'code':    return <CodeSlide slide={slide} />;
      case 'diagram': return <DiagramSlide slide={slide} />;
      case 'quiz':    return <QuizSlide slide={slide} />;
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="shell">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="top-bar">
          <span className="top-lesson">{lessonTitle}</span>
          <span className="top-type">{slide.type}</span>
          <span className="top-count">{cur + 1} / {slides.length}</span>
        </div>
        <div className="stage">
          <AnimatePresence mode="wait">
            <motion.div
              key={cur}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="slide-frame"
            >
              {renderSlide()}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="nav-bar">
          <button className="nav-btn" onClick={prev} disabled={cur === 0}>
            <ChevronLeft size={16} /><span>Prev</span>
          </button>
          <div className="nav-dots">
            {slides.map((s, i) => (
              <button
                key={i}
                title={s.title}
                onClick={() => setCur(i)}
                className={`nav-dot ${i === cur ? 'nd-active' : ''} nd-${s.type}`}
              />
            ))}
          </div>
          <button className="nav-btn" onClick={next} disabled={cur === slides.length - 1}>
            <span>Next</span><ChevronRight size={16} />
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=JetBrains+Mono:wght@400;500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

:root {
  --ink:   #0e0e0e;
  --ink-2: #383838;
  --ink-3: #7a7a7a;
  --ink-4: #b8b8b8;
  --paper:   #fafaf8;
  --paper-2: #f2f1ee;
  --paper-3: #e5e3de;
  --rule: rgba(0,0,0,0.07);
  --accent: #bf4e20;
  --green: #1e7a45;
  --red:   #a82020;
  --code-bg: #0d1117;
  --code-border: rgba(255,255,255,0.07);
}

.shell {
  font-family: 'DM Sans', sans-serif;
  background: var(--paper);
  color: var(--ink);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.progress-track { height: 2px; background: var(--paper-3); }
.progress-fill  { height: 100%; background: var(--accent); transition: width 0.4s ease; }

.top-bar {
  display: flex; align-items: center; gap: 12px;
  padding: 13px 40px; border-bottom: 1px solid var(--rule);
}
.top-lesson { font-size: 11px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--ink-3); flex: 1; }
.top-type { font-size: 10px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: var(--accent); background: rgba(191,78,32,0.08); padding: 3px 10px; border-radius: 20px; }
.top-count { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--ink-4); }

.stage { flex: 1; padding: 40px 56px 24px; display: flex; align-items: stretch; }
.slide-frame { width: 100%; display: flex; flex-direction: column; justify-content: center; }

.nav-bar { display: flex; align-items: center; justify-content: space-between; padding: 18px 40px; border-top: 1px solid var(--rule); }
.nav-btn {
  display: flex; align-items: center; gap: 6px;
  font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; color: var(--ink-3);
  background: none; border: 1px solid var(--paper-3); border-radius: 8px; padding: 8px 16px; cursor: pointer;
  transition: color .15s, border-color .15s, background .15s;
}
.nav-btn:hover:not(:disabled) { color: var(--ink); border-color: var(--ink-4); background: var(--paper-2); }
.nav-btn:disabled { opacity: 0.22; cursor: default; }
.nav-dots { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; max-width: 500px; justify-content: center; }
.nav-dot { width: 7px; height: 7px; border-radius: 50%; border: none; background: var(--paper-3); cursor: pointer; padding: 0; transition: background .2s, transform .2s; }
.nav-dot:hover { background: var(--ink-4); }
.nd-active { background: var(--accent) !important; transform: scale(1.5); }
.nd-quiz.nd-active  { background: #1a6b8a !important; }
.nd-hero.nd-active  { background: var(--ink-2) !important; }

.slide-label { font-size: 10px; font-weight: 600; letter-spacing: 0.28em; text-transform: uppercase; color: var(--accent); margin-bottom: 8px; }
.slide-title { font-family: 'Playfair Display', serif; font-size: clamp(30px, 4vw, 50px); font-weight: 900; line-height: 1.0; color: var(--ink); margin: 0 0 8px; }
.slide-sub   { font-size: 12px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-3); margin: 0; }

/* ─── HERO ─── */
.hero-slide { display: grid; grid-template-columns: 1fr 280px; gap: 56px; align-items: center; min-height: 400px; }
.hero-left  { display: flex; flex-direction: column; gap: 16px; }
.hero-eyebrow { font-size: 10px; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase; color: var(--accent); }
.hero-title { font-family: 'Playfair Display', serif; font-size: clamp(48px, 6.5vw, 80px); font-weight: 900; font-style: italic; line-height: 0.93; letter-spacing: -0.02em; color: var(--ink); margin: 0; }
.hero-rule  { height: 1px; width: 56px; background: var(--ink); }
.hero-sub   { font-size: 12px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-3); margin: 0; }
.hero-body  { font-size: 17px; line-height: 1.65; color: var(--ink-2); font-weight: 300; max-width: 520px; margin: 0; }
.hero-progress { height: 2px; background: var(--paper-3); border-radius: 2px; max-width: 320px; overflow: hidden; }
.hero-progress-bar { height: 100%; background: var(--accent); transition: width 0.4s; }
.hero-progress-label { font-size: 11px; color: var(--ink-4); font-family: 'JetBrains Mono', monospace; }
.hero-right { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; border-left: 1px solid var(--rule); padding-left: 40px; height: 100%; }
.hero-icon-circle { width: 88px; height: 88px; border-radius: 50%; border: 1px solid var(--paper-3); display: flex; align-items: center; justify-content: center; color: var(--ink-3); }
.hero-type-badge { font-size: 10px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: var(--ink-4); text-align: center; }

/* ─── CONCEPT ─── */
.concept-slide { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; min-height: 400px; }
.concept-left  { display: flex; flex-direction: column; gap: 18px; }
.concept-body  { font-size: 16px; line-height: 1.72; color: var(--ink-2); font-weight: 300; margin: 0; }
.concept-callout { display: flex; gap: 10px; align-items: flex-start; background: rgba(191,78,32,0.06); border-left: 2px solid var(--accent); padding: 12px 14px; border-radius: 0 4px 4px 0; font-size: 14px; color: var(--ink-2); line-height: 1.5; }
.callout-icon { flex-shrink: 0; font-size: 14px; }
.key-points { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
.key-point  { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: var(--ink-2); line-height: 1.5; }
.kp-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); flex-shrink: 0; margin-top: 7px; }
.concept-right { display: flex; flex-direction: column; gap: 20px; }
.concept-panel { background: var(--paper-2); border: 1px solid var(--paper-3); border-radius: 4px; aspect-ratio: 4/3; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
.concept-bg-icon { color: var(--paper-3); }
.concept-badge { position: absolute; bottom: 12px; left: 12px; font-size: 9px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--ink-4); background: var(--paper); padding: 4px 8px; border: 1px solid var(--paper-3); }
.concept-pull { font-family: 'Playfair Display', serif; font-size: 20px; font-style: italic; font-weight: 700; line-height: 1.3; color: var(--ink-3); border-top: 1px solid var(--rule); padding-top: 18px; margin: 0; }

/* ─── CODE ─── */
.code-slide  { display: flex; flex-direction: column; gap: 20px; }
.code-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; }
.code-meta   { display: flex; flex-direction: column; gap: 6px; }
.code-desc   { font-size: 14px; color: var(--ink-3); margin: 0; font-weight: 300; max-width: 560px; line-height: 1.6; }
.code-icon   { color: var(--ink-4); flex-shrink: 0; padding-top: 4px; }
.code-terminal { background: var(--code-bg); border-radius: 8px; overflow: hidden; border: 1px solid var(--code-border); }
.code-bar { display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: rgba(255,255,255,0.04); border-bottom: 1px solid var(--code-border); }
.dots { display: flex; gap: 5px; }
.dot { width: 10px; height: 10px; border-radius: 50%; }
.dr { background: #ff5f57; } .dy { background: #ffbd2e; } .dg { background: #28c840; }
.code-filename { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: rgba(255,255,255,0.3); margin-left: 4px; flex: 1; }
.code-lang     { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: rgba(255,255,255,0.18); letter-spacing: 0.1em; }
.code-body     { display: flex; overflow-x: auto; max-height: 320px; overflow-y: auto; }
.code-gutter   { padding: 16px 0; border-right: 1px solid rgba(255,255,255,0.05); flex-shrink: 0; user-select: none; }
.ln  { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: rgba(255,255,255,0.18); padding: 0 14px; line-height: 1.75; text-align: right; }
.code-pre  { margin: 0; padding: 16px 20px; font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.75; color: #cdd5e0; white-space: pre; }
.code-line { display: block; }

.tok-kw      { color: #c792ea; }
.tok-type    { color: #80cbc4; }
.tok-var     { color: #f07178; }
.tok-str     { color: #c3e88d; }
.tok-comment { color: #546e7a; font-style: italic; }
.tok-num     { color: #f78c6c; }
.tok-fn      { color: #82aaff; }
.tok-class   { color: #ffcb6b; }
.tok-attr    { color: #89ddff; }

.code-takeaways { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; padding: 12px 16px; background: var(--paper-2); border: 1px solid var(--paper-3); border-radius: 4px; }
.takeaway-label { font-size: 10px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--ink-3); }
.takeaway-list  { display: flex; flex-wrap: wrap; gap: 8px; }
.takeaway-item  { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--ink-2); }

/* ─── DIAGRAM ─── */
.diagram-slide  { display: flex; flex-direction: column; gap: 28px; }
.diagram-header { display: flex; justify-content: space-between; align-items: flex-start; }
.diagram-flow   { display: flex; align-items: center; background: var(--paper-2); border: 1px solid var(--paper-3); border-radius: 4px; padding: 28px 24px; overflow-x: auto; gap: 0; }
.d-node { display: flex; flex-direction: column; align-items: center; gap: 8px; flex-shrink: 0; min-width: 88px; }
.d-dot  { width: 42px; height: 42px; border-radius: 50%; opacity: 0.85; transition: opacity .15s, transform .15s; }
.d-node:hover .d-dot { opacity: 1; transform: scale(1.12); }
.d-label { font-size: 12px; font-weight: 600; color: var(--ink); text-align: center; }
.d-desc  { font-size: 10px; color: var(--ink-3); text-align: center; font-family: 'JetBrains Mono', monospace; }
.d-arrow { flex: 1; display: flex; align-items: center; min-width: 18px; margin-bottom: 28px; }
.d-line  { flex: 1; height: 1px; background: var(--ink-4); }
.d-head  { width: 0; height: 0; border-top: 5px solid transparent; border-bottom: 5px solid transparent; border-left: 7px solid var(--ink-4); }
.diagram-caption { font-size: 15px; line-height: 1.65; color: var(--ink-3); font-weight: 300; margin: 0; font-style: italic; border-left: 2px solid var(--paper-3); padding-left: 16px; }

/* ─── QUIZ ─── */
.quiz-slide    { display: flex; flex-direction: column; gap: 24px; max-width: 680px; margin: 0 auto; width: 100%; }
.quiz-question { font-family: 'Playfair Display', serif; font-size: clamp(22px, 3vw, 32px); font-weight: 700; line-height: 1.2; color: var(--ink); margin: 0; }
.quiz-options  { display: flex; flex-direction: column; gap: 10px; }
.quiz-option   { display: flex; align-items: center; gap: 14px; padding: 14px 18px; border: 1px solid var(--paper-3); border-radius: 6px; background: var(--paper); cursor: pointer; text-align: left; font-family: 'DM Sans', sans-serif; font-size: 15px; color: var(--ink-2); transition: border-color .15s, background .15s; }
.quiz-option:hover:not(:disabled) { border-color: var(--accent); background: var(--paper-2); }
.qo-letter { width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0; border: 1px solid var(--paper-3); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; color: var(--ink-3); }
.qo-text   { flex: 1; line-height: 1.4; }
.qo-icon   { flex-shrink: 0; }
.qo-correct { border-color: var(--green) !important; background: rgba(30,122,69,0.06) !important; }
.qo-correct .qo-letter { border-color: var(--green); color: var(--green); }
.qo-correct .qo-icon   { color: var(--green); }
.qo-wrong   { border-color: var(--red)   !important; background: rgba(168,32,32,0.06) !important; }
.qo-wrong   .qo-letter { border-color: var(--red);   color: var(--red); }
.qo-wrong   .qo-icon   { color: var(--red); }
.quiz-explain { padding: 14px 18px; border-radius: 6px; font-size: 14px; line-height: 1.6; border-left: 3px solid transparent; }
.qe-correct { background: rgba(30,122,69,0.07); border-color: var(--green); color: var(--ink-2); }
.qe-wrong   { background: rgba(168,32,32,0.07); border-color: var(--red);   color: var(--ink-2); }
`;