"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  GitBranch, Terminal, Code2, ChevronLeft, ChevronRight,
  ArrowLeft, Menu, X, ChevronDown, Sparkles, Play,
  RefreshCw, Layers, Share2, Shield, GitMerge,
  GitPullRequest, Globe, Lock, HardDrive, Copy,
  CheckCircle2, RotateCcw, Box, StickyNote, BookOpen
} from 'lucide-react';

/* ══════════════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════════════ */

interface Concept { label: string; desc: string }
interface Slide {
  id: string; chapter: string; title: string; subtitle: string;
  icon: React.ElementType; accent: string;
  concepts: Concept[]; tip: string; lab: string; result: string;
  code: string; filename: string; terminal: string; terminalOutput: string;
}

const CHAPTERS = [
  { id: 'foundations', label: 'គ្រឹះ Git',         num: '01', color: '#4ade80' },
  { id: 'branching',   label: 'Branch Management', num: '02', color: '#38bdf8' },
  { id: 'merging',     label: 'Merge & Conflict',  num: '03', color: '#fb923c' },
  { id: 'remotes',     label: 'Remote & PR Flow',  num: '04', color: '#e879f9' },
  { id: 'mastery',     label: 'Advanced Git',      num: '05', color: '#f87171' },
];

/* ══════════════════════════════════════════════════════════════════
   SLIDE DATA
══════════════════════════════════════════════════════════════════ */

const GIT_SLIDES: Slide[] = [
  {
    id: 'intro', chapter: 'foundations',
    title: 'Version Control', subtitle: 'ការស្វែងយល់ពី Version Control System',
    icon: GitBranch, accent: '#4ade80',
    concepts: [
      { label: 'VCS គឺជាអ្វី?', desc: 'Version Control System ជាប្រព័ន្ធដែលកត់ត្រារាល់ការផ្លាស់ប្ដូរ (change) ចំពោះ file តាមពេលវេលា ។ ឱ្យអ្នកអាច revert ទៅ version ណាមួយក្នុងអតីតកាល, compare changes, ឬ collaborate ជាមួយ team ។' },
      { label: 'Snapshot Model', desc: 'Git ខុសពី VCS ផ្សេង — វា snapshot ប្រព័ន្ធ file ទាំងមូលគ្រប់ commit ។ File ដែលមិនផ្លាស់ប្ដូរ Git គ្រាន់ link ទៅ snapshot មុន ដើម្បី efficient ។' }
    ],
    tip: 'Git ត្រូវបានសរសេរដោយ Linus Torvalds ក្នុង ១០ ថ្ងៃ ក្នុងឆ្នាំ ២០០៥ ដើម្បីគ្រប់គ្រង source code របស់ Linux kernel ។',
    lab: 'Initialize repository ថ្មីមួយ ហើយ inspect state ដំបូងរបស់វា ។',
    result: 'Terminal បង្ហាញ "Initialized empty Git repository" — repository ស្អាត ready ។',
    code: `git init\ngit status`,
    filename: 'init.sh', terminal: 'git init && git status',
    terminalOutput: `Initialized empty Git repository in /project/.git/\n\nOn branch main\nnothing to commit`
  },
  {
    id: 'config', chapter: 'foundations',
    title: 'Config & Identity', subtitle: 'ការ Setup Global Configuration',
    icon: Lock, accent: '#4ade80',
    concepts: [
      { label: 'Identitiy', desc: 'Git attach ឈ្មោះ និង email ទៅ commit ។ Setup ម្ដង global — apply ទៅ repository ទាំងអស់ក្នុង machine ។' },
      { label: 'Config Layers', desc: 'Git មាន ៣ levels: system, global (~/.gitconfig), និង local (.git/config) ។' }
    ],
    tip: 'Email ត្រូវ match ជាមួយ GitHub account ដើម្បី contribution graph track បានត្រូវ ។',
    lab: 'Set global user.name និង user.email ហើយ verify ជាមួយ git config --list ។',
    result: 'List បង្ហាញ user.name, user.email ត្រូវតាម input ។',
    code: `git config --global user.name "Dara Sok"\ngit config --global user.email "dara@example.com"`,
    filename: 'config.sh', terminal: 'git config --list',
    terminalOutput: `user.name=Dara Sok\nuser.email=dara@example.com`
  },
  {
    id: 'staging', chapter: 'foundations',
    title: 'Three States', subtitle: 'Working Directory · Staging Area · Repository',
    icon: Layers, accent: '#4ade80',
    concepts: [
      { label: 'Working Directory', desc: 'កន្លែង edit file ។ Git ដឹង file ត្រូវ modify ប៉ុន្ដែ មិន track change ដោយ auto ។' },
      { label: 'Staging Area', desc: 'Draft commit ។ git add ដាក់ snapshot នៃ change ចូល index ។ git commit យក index ទៅ permanent history ។' }
    ],
    tip: 'Staging area ជា superpower — ឱ្យអ្នក craft atomic commit — stage file ដែល related ជាមួយ ។',
    lab: 'Create file → git add → git commit → inspect log ។',
    result: 'git log --oneline បង្ហាញ commit hash, author, date, message ត្រូវ ។',
    code: `git add .\ngit commit -m "feat: add initial files"\ngit log --oneline`,
    filename: 'staging.sh', terminal: 'git log --oneline',
    terminalOutput: `a3f9c12 (HEAD -> main) feat: add initial files`
  },
  {
    id: 'gitignore', chapter: 'foundations',
    title: 'Ignoring Files', subtitle: 'ការប្រើ .gitignore ដើម្បីដក file មិនចាំបាច់',
    icon: Shield, accent: '#4ade80',
    concepts: [
      { label: '.gitignore គឺជាអ្វី?', desc: 'ជា file ដែលប្រាប់ Git ថា file ឬ directory ណាខ្លះមិនបាច់ track ។ សំខាន់សម្រាប់ node_modules ឬ secrets ។' },
      { label: 'Pattern Rules', desc: 'ប្រើ wildcard (*) ដូចជា *.log ដើម្បី ignore files ទាំងអស់ដែលមាន extension .log ។' }
    ],
    tip: 'កុំ commit របស់ធំៗ ឬ secrets ឱ្យសោះ ។ ប្រើ .gitignore ជានិច្ចតាំងពី start project ។',
    lab: 'បង្កើត file .gitignore ហើយដាក់ pattern ដើម្បី ignore log files ។',
    result: 'File ដែល ignore នឹងមិនបង្ហាញក្នុង staging area ពេលប្រើ git status ឡើយ ។',
    code: `echo "node_modules/" >> .gitignore\necho "*.log" >> .gitignore`,
    filename: '.gitignore', terminal: 'git status',
    terminalOutput: `On branch main\nUntracked files: .gitignore`
  },
  {
    id: 'diff', chapter: 'foundations',
    title: 'Git Diff', subtitle: 'ពិនិត្យមើល Changes line-by-line',
    icon: Code2, accent: '#4ade80',
    concepts: [
      { label: 'diff command', desc: 'git diff បង្ហាញភាពខុសគ្នារវាង working directory និង staging area ។' },
      { label: 'Staged Diff', desc: 'ប្រើ --staged ដើម្បីមើលអ្វីដែលបាន add ចូល staging area រួចហើយ ។' }
    ],
    tip: 'មុននឹង commit, ប្រើ git diff ជានិច្ច ដើម្បីប្រាកដថាអ្នកមិនបានដាក់ code trash ចូលទៅក្នុង repository ។',
    lab: 'កែប្រែ file រួចប្រើ git diff ដើម្បីមើល changes មុននឹង git add ។',
    result: 'Terminal បង្ហាញបន្ទាត់បន្ថែម (+) ពណ៌បៃតង និងបន្ទាត់លុប (-) ពណ៌ក្រហម ។',
    code: `git diff\ngit diff --staged`,
    filename: 'diff.sh', terminal: 'git diff',
    terminalOutput: `--- a/app.js\n+++ b/app.js\n-console.log("Old");\n+console.log("New");`
  },
  {
    id: 'history', chapter: 'foundations',
    title: 'History Review', subtitle: 'បច្ចេកទេសក្នុង​ការមើល Log',
    icon: BookOpen, accent: '#4ade80',
    concepts: [
      { label: 'git log', desc: 'បង្ហាញ list នៃ commits ក្នុង branch បច្ចុប្បន្ន ។ រួមមាន hash, author, date, និង message ។' },
      { label: 'Compact View', desc: '--oneline បង្ហាញក្នុង ១ ជួរ ។ --graph បង្ហាញ branch structure ជា visual ។' }
    ],
    tip: 'Git log ជា source of truth របស់ project ។ ប្រើ "git log -p" ដើម្បីមើល patch របស់ commit នីមួយៗ ។',
    lab: 'ប្រើ options ផ្សេងៗរបស់ git log ដើម្បី explore project history ។',
    result: 'ឃើញ graph និង timeline នៃ commits ច្បាស់លាស់ ។',
    code: `git log --oneline --graph --all --decorate\ngit log -p -3`,
    filename: 'log.sh', terminal: 'git log --oneline --graph',
    terminalOutput: `* a3f9c12 (HEAD -> main) feat: add initial project files\n* 7e2b102 chore: initial commit`
  },
  {
    id: 'branch-intro', chapter: 'branching',
    title: 'Branch Model', subtitle: 'ការអភិវឌ្ឍ Parallel ជាមួយ Branch',
    icon: Share2, accent: '#38bdf8',
    concepts: [
      { label: 'Branch = Pointer', desc: 'Branch ក្នុង Git គ្រាន់តែជា lightweight pointer ទៅ commit ។ Switch branch instant ។' },
      { label: 'Parallel Dev', desc: 'Branch ឱ្យ developer ធ្វើ feature, bugfix ដោយ isolate ពី production code ។' }
    ],
    tip: 'Create branches ឱ្យបានច្រើន, ញឹកញាប់ ។ ១ task = ១ branch ។',
    lab: 'Create feature/auth branch ហើយ switch ទៅ branch នោះ ។',
    result: 'git branch បង្ហាញ asterisk (*) នៅ branch ថ្មី ។',
    code: `git switch -c feature/auth\ngit branch`,
    filename: 'branch.sh', terminal: 'git branch',
    terminalOutput: `* feature/auth\n  main`
  },
  {
    id: 'moving-changes', chapter: 'branching',
    title: 'Switch & Restore', subtitle: 'Modern Commands ជំនួស checkout',
    icon: RefreshCw, accent: '#38bdf8',
    concepts: [
      { label: 'git switch', desc: 'Command dedicated សម្រាប់ change branch ។ ច្បាស់ជាង git checkout ដែល overloaded ។' },
      { label: 'git restore', desc: 'Discard changes ក្នុង working directory ឬ unstage file ។ ជំនួស git checkout -- <file> ។' }
    ],
    tip: 'Git 2.23 (2019) ណែនាំ switch + restore ដើម្បី split checkout functionality ។',
    lab: 'Restore file ដែល accidentally modified ហើយ switch ត្រឡប់ main ។',
    result: 'File ត្រឡប់ content committed ។ git status clean ។',
    code: `git restore profile.php\ngit restore --staged README.md\ngit switch main`,
    filename: 'restore.sh', terminal: 'git switch main',
    terminalOutput: `Switched to branch 'main'`
  },
  {
    id: 'merge-basics', chapter: 'merging',
    title: 'Merge Strategies', subtitle: 'Fast-Forward vs Three-Way Merge',
    icon: GitMerge, accent: '#fb923c',
    concepts: [
      { label: 'Fast-Forward', desc: 'Git move pointer ទៅ ahead — history ត្រង់ (linear) ។' },
      { label: 'Three-Way Merge', desc: 'ប្រើពេល branches diverge ។ បង្កើត merge commit ។' }
    ],
    tip: 'Resolve conflicts ក្នុង feature branch មុននឹង merge ចូល main branch ។',
    lab: 'Merge feature/auth ចូល main ។ Inspect history ជាមួយ --graph ។',
    result: 'Log បង្ហាញ "Fast-forward" ឬ merge commit node ក្នុង graph ។',
    code: `git switch main\ngit merge feature/auth`,
    filename: 'merge.sh', terminal: 'git merge feature/auth',
    terminalOutput: `Updating a3f9c12..e7b4d91\nFast-forward`
  },
  {
    id: 'conflict', chapter: 'merging',
    title: 'Conflict Resolution', subtitle: 'ការដោះស្រាយ Merge Conflict',
    icon: Shield, accent: '#fb923c',
    concepts: [
      { label: 'Markers', desc: 'Git inject markers ទៅ conflicted file: <<<<<<<, =======, >>>>>>> ។' },
      { label: 'Resolution', desc: 'Edit file → delete markers → git add <file> → git merge --continue ។' }
    ],
    tip: 'Conflict គ្មានអ្វីខ្លាចទេ — Git សួរ "version ណាត្រូវ?" ។ Small frequent merges = conflicts តិច ។',
    lab: 'Trigger conflict ដោយ edit line តែមួយ ក្នុង ២ branches → merge → resolve ។',
    result: 'Repo state clean ។ git log show resolved merge commit ។',
    code: `git status\ngit add styles.css\ngit merge --continue`,
    filename: 'conflict.sh', terminal: 'git merge feature/ui',
    terminalOutput: `CONFLICT (content): Merge conflict in styles.css\nAutomatic merge failed; fix conflicts.`
  },
  {
    id: 'remote-intro', chapter: 'remotes',
    title: 'Remotes & Push', subtitle: 'Sync ជាមួយ GitHub / GitLab',
    icon: Globe, accent: '#e879f9',
    concepts: [
      { label: 'origin', desc: '"origin" ជា alias convention សម្រាប់ remote URL ។ git clone auto-set origin ។' },
      { label: 'fetch vs pull', desc: 'git fetch download changes ប៉ុន្ដែមិន merge ។ git pull = fetch + merge ។' }
    ],
    tip: 'git remote -v ជា habit ។ Always verify remote URL មុន push ។',
    lab: 'Add remote origin ហើយ push main branch ទៅ GitHub ។',
    result: 'Branch live on GitHub ។',
    code: `git remote add origin https://github.com/user/repo.git\ngit push -u origin main`,
    filename: 'remote.sh', terminal: 'git remote -v',
    terminalOutput: `origin  https://github.com/dara/repo.git (fetch)\norigin  https://github.com/dara/repo.git (push)`
  },
  {
    id: 'prs', chapter: 'remotes',
    title: 'PR Workflow', subtitle: 'Professional Code Review Process',
    icon: GitPullRequest, accent: '#e879f9',
    concepts: [
      { label: 'Pull Request', desc: 'PR ជា formal request ឱ្យ teammates review code មុន merge ។' },
      { label: 'Code Review', desc: 'Review ≠ personal attack — review = technical feedback ។' }
    ],
    tip: 'PR < ៤០០ lines ទទួល review ២០x លឿន ។ "One PR = One concern" ។',
    lab: 'Pull latest main → merge ចូល feature → push feature branch ។',
    result: 'Feature branch updated ។ Ready to open PR ។',
    code: `git pull origin main\ngit switch feature/dashboard\ngit merge main\ngit push origin feature/dashboard`,
    filename: 'pr.sh', terminal: 'git pull origin main',
    terminalOutput: `From github.com/dara/git-demo\n* branch main -> FETCH_HEAD`
  },
  {
    id: 'stash', chapter: 'mastery',
    title: 'Git Stash', subtitle: 'Context Switching ដោយ​មិន Commit',
    icon: Box, accent: '#f87171',
    concepts: [
      { label: 'Stash Stack', desc: 'git stash save work-in-progress ទៅ temporary stack ។ Working directory ក្លាយ clean ។' },
      { label: 'Named Stashes', desc: 'git stash push -m "label" ឱ្យ label stash entry ដើម្បីងាយចំណាំ ។' }
    ],
    tip: 'Label stash ជានិច្ច ។ Unnamed stash list វែង = confusing ។',
    lab: 'Stash uncommitted work → switch branch → apply stash ត្រឡប់ ។',
    result: 'Work ត្រឡប់បន្ទាប់ pop ។',
    code: `git stash push -m "wip: login"\ngit stash list\ngit stash pop`,
    filename: 'stash.sh', terminal: 'git stash list',
    terminalOutput: `stash@{0}: On main: wip: login`
  }
];

/* ══════════════════════════════════════════════════════════════════
   SYNTAX HIGHLIGHTER
══════════════════════════════════════════════════════════════════ */

const GIT_KW = new Set(['git','commit','branch','checkout','switch','merge','rebase','pull','push','fetch','remote','add','status','log','init','config','clone','stash','pop','apply','restore','diff','--global','--oneline','-m','-u','-b','-i','--staged','--list','--graph','--all','--force-with-lease','-c','--continue','-v','-p']);

const tokenizeLine = (line: string): React.ReactNode[] => {
  if (/^\s*#/.test(line)) return [<span key="c" style={{ color: '#4b5563', fontStyle: 'italic' }}>{line}</span>];
  const parts = line.split(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\B[a-z0-9/._-]+\B|\b[a-zA-Z_-]+\b)/g);
  return parts.map((p, i) => {
    if (!p) return null;
    if (GIT_KW.has(p)) return <span key={i} style={{ color: '#f87171', fontWeight: 700 }}>{p}</span>;
    if (p.startsWith('"') || p.startsWith("'")) return <span key={i} style={{ color: '#86efac' }}>{p}</span>;
    if (/^\d/.test(p)) return <span key={i} style={{ color: '#c084fc' }}>{p}</span>;
    if (p.startsWith('-')) return <span key={i} style={{ color: '#7dd3fc' }}>{p}</span>;
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

const CodePanel = ({ code: initialCode, terminal, terminalOutput, accent, filename }: {
  code: string; terminal?: string; terminalOutput?: string; accent: string; filename: string;
}) => {
  const [tab, setTab] = useState<'code' | 'terminal'>('terminal');
  const [code, setCode] = useState(initialCode);
  const [copied, setCopied] = useState(false);
  const [running, setRunning] = useState(false);
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
            {['#ff5f57','#febc2e','#28c840'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }}/>)}
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
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={async () => { setTab('terminal'); setRunning(true); await new Promise(r => setTimeout(r, 700)); setRunning(false); }} disabled={running} style={{
            padding: '4px 10px', borderRadius: 5, border: 'none', fontSize: 9.5, fontWeight: 800,
            fontFamily: "'JetBrains Mono',monospace", background: `${accent}15`, color: running ? '#4b5563' : accent,
          }}>{running ? 'Running…' : 'Run'}</button>
          <button onClick={copy} style={{ padding: 5, background: 'transparent', border: 'none', color: copied ? '#4ade80' : '#4b5563' }}>
            {copied ? <CheckCircle2 size={13}/> : <Copy size={13}/>}
          </button>
        </div>
      </div>
      <div style={{ padding: '4px 13px', background: 'rgba(10,14,26,0.7)', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 9.5, color: '#4b5563', fontFamily: "'JetBrains Mono',monospace" }}>
        ~/project/{tab === 'code' ? filename : 'zsh'}
      </div>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {tab === 'code' ? (
          <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ width: 40, background: '#06080f', borderRight: '1px solid rgba(255,255,255,0.04)', paddingTop: 14, textAlign: 'right', paddingRight: 9, fontSize: 10.5, color: 'rgba(255,255,255,0.1)', fontFamily: "'JetBrains Mono',monospace" }}>
              {code.split('\n').map((_, i) => <div key={i} style={{ height: '1.8em' }}>{i + 1}</div>)}
            </div>
            <div style={{ position: 'relative', flex: 1 }}>
              <div ref={hlRef} style={{ position: 'absolute', inset: 0, padding: 14, overflow: 'auto', pointerEvents: 'none' }}><HighlightedCode code={code}/></div>
              <textarea ref={taRef} value={code} onChange={e => setCode(e.target.value)} onScroll={syncScroll} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: 'transparent', color: 'transparent', resize: 'none', outline: 'none', padding: 14, fontFamily: "'JetBrains Mono',monospace", fontSize: 13, lineHeight: 1.8, border: 'none', caretColor: '#fff' }} spellCheck={false} wrap="off"/>
            </div>
          </div>
        ) : (
          <div style={{ padding: '14px 16px', fontFamily: "'JetBrains Mono',monospace", fontSize: 12.5, lineHeight: 1.9, overflow: 'auto', height: '100%' }}>
            <div style={{ color: accent, marginBottom: 8 }}>❯ <span style={{ color: '#fff' }}>~/project $ {terminal}</span></div>
            <pre style={{ color: '#ccc', whiteSpace: 'pre-wrap', margin: 0 }}>{terminalOutput || 'Running…'}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════ */

export default function GitSlides() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const chapterParam = searchParams.get('chapter') || 'foundations';

  const displayPages = useMemo(() => {
    const filtered = GIT_SLIDES.filter(s => s.chapter === chapterParam);
    const result: (Slide & { subType: 'concept' | 'lab' })[] = [];
    filtered.forEach(s => {
      result.push({ ...s, subType: 'concept' });
      result.push({ ...s, subType: 'lab' });
    });
    return result;
  }, [chapterParam]);

  const slideParam = searchParams.get('slide');
  const initialSlide = slideParam ? Math.max(0, Math.min(parseInt(slideParam) - 1, displayPages.length - 1)) : 0;

  const [current, setCurrent] = useState(initialSlide);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [dir, setDir] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => { setCurrent(initialSlide); }, [initialSlide, chapterParam]);
  useEffect(() => {
    try {
      const saved = localStorage.getItem('git_notes_v3');
      if (saved) setNotes(JSON.parse(saved));
    } catch {}
  }, []);

  const saveNote = (val: string) => {
    const key = displayPages[current]?.id || 'x';
    const next = { ...notes, [key]: val };
    setNotes(next);
    localStorage.setItem('git_notes_v3', JSON.stringify(next));
  };

  const slide = displayPages[current] ?? displayPages[0];
  const Icon = slide.icon;
  const ch = CHAPTERS.find(c => c.id === chapterParam) ?? CHAPTERS[0];

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
    if (current < displayPages.length - 1) { goTo(current + 1, 1); return; }
    const ci = CHAPTERS.findIndex(c => c.id === chapterParam);
    if (ci < CHAPTERS.length - 1) { setDir(1); router.push(`?chapter=${CHAPTERS[ci + 1].id}`); }
  }, [current, displayPages.length, chapterParam, goTo]);

  const prev = useCallback(() => {
    if (current > 0) { goTo(current - 1, -1); return; }
    const ci = CHAPTERS.findIndex(c => c.id === chapterParam);
    if (ci > 0) {
      setDir(-1);
      const pc = CHAPTERS[ci - 1];
      const cnt = GIT_SLIDES.filter(s => s.chapter === pc.id).length * 2;
      router.push(`?chapter=${pc.id}&slide=${cnt}`);
    }
  }, [current, chapterParam, goTo]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev]);

  const V = {
    enter: (d: number) => ({ x: d > 0 ? 32 : -32, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -32 : 32, opacity: 0 }),
  };

  return (
    <div style={{ minHeight: '100vh', background: '#030509', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: "'Noto Sans Khmer','Hanuman',serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer:wght@300;400;500;600;700;900&family=Hanuman:wght@400;700;900&family=JetBrains+Mono:wght@400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        button { cursor: pointer; border: none; outline: none; background: none; }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse at 70% 50%, ${slide.accent}0a 0%, transparent 70%)` }}/>

      <header style={{ height: 58, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', background: 'rgba(3,5,9,0.8)', backdropFilter: 'blur(20px)', zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/courses/backend" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, color: '#fff', textDecoration: 'none', fontSize: 11, fontWeight: 700 }}><ArrowLeft size={14}/> Back</Link>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, color: '#fff' }}>
            <div style={{ width: 22, height: 22, background: isMenuOpen ? ch.color : 'rgba(255,255,255,0.1)', color: isMenuOpen ? '#000' : '#4b5563', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{isMenuOpen ? <X size={12}/> : <Menu size={12}/>}</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 8, color: ch.color, fontWeight: 800, textTransform: 'uppercase' }}>Chapter {ch.num}</div>
              <div style={{ fontSize: 12, fontWeight: 700 }}>{ch.label}</div>
            </div>
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            {displayPages.map((_, i) => <button key={i} onClick={() => goTo(i, i > current ? 1 : -1)} style={{ width: i === current ? 18 : 6, height: 6, borderRadius: 3, background: i === current ? ch.color : 'rgba(255,255,255,0.1)', transition: 'all 0.3s' }}/>)}
            <span style={{ marginLeft: 8, fontSize: 10, color: '#4b5563', fontFamily: "'JetBrains Mono',monospace" }}>{current + 1}/{displayPages.length}</span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={prev} style={{ padding: 8, borderRadius: 8, background: 'rgba(255,255,255,0.03)', color: '#fff' }}><ChevronLeft size={16}/></button>
            <button onClick={next} style={{ padding: 8, borderRadius: 8, background: 'rgba(255,255,255,0.03)', color: '#fff' }}><ChevronRight size={16}/></button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}/>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ position: 'fixed', top: 68, left: 20, width: 320, background: '#0a0e1a', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', padding: 8, zIndex: 90, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
              {CHAPTERS.map(c => (
                <button key={c.id} onClick={() => { router.push(`?chapter=${c.id}`); setIsMenuOpen(false); }} style={{ width: '100%', padding: 10, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12, background: c.id === chapterParam ? 'rgba(255,255,255,0.05)' : 'transparent' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: c.id === chapterParam ? c.color : 'rgba(255,255,255,0.05)', color: c.id === chapterParam ? '#000' : c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{c.num}</div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 9, color: c.color, fontWeight: 800 }}>CHAPTER</div>
                    <div style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>{c.label}</div>
                  </div>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ width: '42%', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '30px 40px', overflowY: 'auto' }}>
          <AnimatePresence mode="wait" custom={dir}>
            {!isAnimating && (
              <motion.div key={current} custom={dir} variants={V} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: ch.color, background: `${ch.color}15`, padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase' }}>{ch.label}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#4b5563' }}>{slide.id}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: `${slide.accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: slide.accent }}><Icon size={24}/></div>
                    <div>
                      <h1 style={{ fontSize: 36, fontWeight: 800, color: '#f8fafc', lineHeight: 1.1 }}>{slide.subType === 'lab' ? `${slide.title} (Practice)` : slide.title}</h1>
                      <p style={{ fontSize: 15, color: '#94a3b8', marginTop: 6 }}>{slide.subType === 'lab' ? 'អនុវត្តជាក់ស្តែងជាមួយ commands' : slide.subtitle}</p>
                    </div>
                  </div>
                </div>

                {slide.subType === 'concept' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {slide.concepts.map((c, i) => (
                      <div key={i} style={{ padding: 20, background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <div style={{ width: 4, height: 4, borderRadius: '50%', background: slide.accent }}/>
                          <div style={{ fontSize: 10, fontWeight: 800, color: slide.accent, textTransform: 'uppercase' }}>{c.label}</div>
                        </div>
                        <p style={{ fontSize: 16, color: '#fff', lineHeight: 1.6 }}>{c.desc}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ padding: 20, background: 'rgba(251,191,36,0.03)', borderRadius: 16, border: '1px solid rgba(251,191,36,0.1)', borderLeft: '4px solid #fbbf24', display: 'flex', gap: 16 }}>
                      <Sparkles size={20} style={{ color: '#fbbf24', flexShrink: 0 }}/>
                      <p style={{ fontSize: 15, color: '#fff', fontStyle: 'italic', lineHeight: 1.6 }}>{slide.tip}</p>
                    </div>
                    <div style={{ padding: 20, background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', borderLeft: `4px solid ${slide.accent}` }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: slide.accent, textTransform: 'uppercase', marginBottom: 6 }}>Objective</div>
                      <p style={{ fontSize: 15, color: '#fff' }}>{slide.lab}</p>
                    </div>
                    <div style={{ padding: 20, background: 'rgba(74,222,128,0.03)', borderRadius: 16, border: '1px solid rgba(74,222,128,0.1)', borderLeft: '4px solid #4ade80' }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: '#4ade80', textTransform: 'uppercase', marginBottom: 6 }}>Expected Result</div>
                      <p style={{ fontSize: 15, color: '#fff' }}>{slide.result}</p>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10, marginTop: 'auto', paddingBottom: 20 }}>
                  <button onClick={prev} style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.03)', borderRadius: 12, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={18}/></button>
                  <button onClick={next} style={{ flex: 1, background: slide.accent, borderRadius: 12, color: '#000', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    {current === displayPages.length - 1 ? 'Next Chapter' : slide.subType === 'concept' ? 'Start Practice' : 'Next Lesson'} <ChevronRight size={16}/>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div style={{ flex: 1, padding: 24, background: 'rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Terminal size={12} style={{ color: '#4b5563' }}/>
            <span style={{ fontSize: 9, fontWeight: 800, color: '#4b5563', textTransform: 'uppercase' }}>Terminal & Code Area</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }}/>
          </div>
          <CodePanel code={slide.code} terminal={slide.terminal} terminalOutput={slide.terminalOutput} accent={slide.accent} filename={slide.filename}/>
        </div>
      </main>

      <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 100 }}>
        <button onClick={() => setShowNotes(!showNotes)} style={{ width: 44, height: 44, background: showNotes ? '#fbbf24' : 'rgba(255,255,255,0.05)', color: showNotes ? '#000' : '#fff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}><StickyNote size={20}/></button>
      </div>

      <AnimatePresence>
        {showNotes && (
          <motion.div initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }} style={{ position: 'fixed', top: 80, right: 20, bottom: 80, width: 300, background: '#0a0e1a', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)', padding: 20, zIndex: 110, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Field Notes</h3>
            <textarea value={notes[slide.id] || ''} onChange={e => saveNote(e.target.value)} placeholder="កត់ត្រាចំណាំនៅទីនេះ..." style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: 'none', borderRadius: 12, padding: 12, color: '#fff', resize: 'none', outline: 'none', fontSize: 14 }}/>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}