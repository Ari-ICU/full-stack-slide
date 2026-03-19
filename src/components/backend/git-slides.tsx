"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  GitBranch, Terminal, Code2, BookOpen, Clock, 
  ChevronLeft, ChevronRight, ArrowLeft, ArrowRight,
  Menu, X, ChevronDown, Check, Zap, Sparkles, 
  Play, RefreshCw, FileCode, Layers, Search, 
  Shield, Rocket, List, Activity, StickyNote,
  GitMerge, GitCommit, GitPullRequest, Database,
  ArrowUp, ArrowDown, Share2, Globe, Lock, HardDrive,
  Copy, CheckCircle2, RotateCcw, Box
} from 'lucide-react';

/* ─── TYPES ──────────────────────────────────────────────────────── */

interface Slide {
  id: string;
  chapter: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  accent: string;
  bg: string;
  concepts: { label: string; desc: string }[];
  tip: string;
  lab: string;
  result: string;
  code: string;
  filename: string;
  terminal: string;
  terminalOutput: string;
}

const CHAPTERS = [
  { id: 'foundations', label: '1. Git Foundations', color: '#10b981' },
  { id: 'branching', label: '2. Branch Management', color: '#3b82f6' },
  { id: 'merging', label: '3. Merging & Conflict Resolution', color: '#f59e0b' },
  { id: 'remotes', label: '4. Remotes & PR Workflows', color: '#a855f7' },
  { id: 'mastery', label: '5. Advanced Git Mastery', color: '#f43f5e' }
];

/* ─── SLIDE DATA ─────────────────────────────────────────────────── */

const GIT_SLIDES: Slide[] = [
  // FOUNDATIONS
  {
    id: 'intro', chapter: 'foundations',
    title: 'The Modern VCS', subtitle: 'Understanding Version Control',
    icon: GitBranch, accent: '#10b981', bg: 'radial-gradient(circle at 10% 10%, rgba(16,185,129,0.15) 0%, transparent 50%)',
    concepts: [
      { label: 'Version Control', desc: 'A system that records changes to a file or set of files over time so that you can recall specific versions later.' },
      { label: 'Snapshot Model', desc: 'Unlike other systems, Git thinks of its data more like a series of snapshots of a miniature filesystem.' }
    ],
    tip: 'Git was created by Linus Torvalds, the creator of Linux, to manage its massive codebase.',
    lab: 'Initialize a new repository and check its status.',
    result: 'You should see "Initialized empty Git repository" and "No commits yet".',
    code: '# Step 1: Initialize Git\ngit init\n\n# Step 2: Check current status\ngit status',
    filename: 'terminal.sh',
    terminal: 'git init\ngit status',
    terminalOutput: 'Initialized empty Git repository in /Users/dev/project/.git/\nOn branch main\n\nNo commits yet\n\nnothing to commit (create/copy files and use "git add" to track)'
  },
  {
    id: 'config', chapter: 'foundations',
    title: 'Identity & Config', subtitle: 'Setting Up Your Environment',
    icon: Lock, accent: '#10b981', bg: 'radial-gradient(circle at 90% 10%, rgba(16,185,129,0.1) 0%, transparent 60%)',
    concepts: [
      { label: 'Identity', desc: 'Git needs to know who you are so it can attribute commits to the right author.' },
      { label: 'Configuration', desc: 'Settings are stored in ~/.gitconfig (global) or project/.git/config (local).' }
    ],
    tip: 'Make sure the email matches your GitHub/GitLab account to get credit for your contributions.',
    lab: 'Configure your global username and email.',
    result: 'Use git config --list to verify the settings.',
    code: '# Set global username\ngit config --global user.name "John Doe"\n\n# Set global email\ngit config --global user.email "john@example.com"',
    filename: 'setup.sh',
    terminal: 'git config --global user.name "John Doe"\ngit config --list',
    terminalOutput: 'user.name=John Doe\nuser.email=john@example.com\ncore.repositoryformatversion=0\ncore.filemode=true'
  },
  {
    id: 'staging', chapter: 'foundations',
    title: 'The Three States', subtitle: 'Working, Staging, and Committed',
    icon: Layers, accent: '#10b981', bg: 'radial-gradient(circle at 50% 50%, rgba(16,185,129,0.08) 0%, transparent 70%)',
    concepts: [
      { label: 'Working Directory', desc: 'Where you edit files. These are "untracked" or "modified" until staged.' },
      { label: 'Staging Area', desc: 'The Index. A middle-ground where changes are prepared for the next commit.' },
      { label: 'Commit History', desc: 'The permanent record of snapshots in the .git directory.' }
    ],
    tip: 'Think of the staging area as a "checkout lane" where you confirm what goes into your purchase.',
    lab: 'Add files to the staging area and create your first commit.',
    result: 'Checking git log should show your commit hash, author info, and message.',
    code: '# 1. Track files\ngit add .\n\n# 2. Commit with message\ngit commit -m "feat: Initial project structure"\n\n# 3. View history\ngit log --oneline',
    filename: 'workflow.sh',
    terminal: 'git add index.php\ngit commit -m "Initial commit"\ngit log',
    terminalOutput: 'commit 8f2a4b1 (HEAD -> main)\nAuthor: John Doe <john@example.com>\nDate: Thu Mar 19 19:45:00 2026\n\n    Initial commit'
  },

  // BRANCHING
  {
    id: 'branch-intro', chapter: 'branching',
    title: 'Lightweight Branching', subtitle: 'Parallel Feature Development',
    icon: Share2, accent: '#3b82f6', bg: 'radial-gradient(circle at 10% 10%, rgba(59,130,246,0.15) 0%, transparent 50%)',
    concepts: [
      { label: 'Pointer Logic', desc: 'A branch in Git is simply a lightweight movable pointer to a specific commit.' },
      { label: 'Parallel Work', desc: 'Branches allow you to work on new features without breaking the main production code.' }
    ],
    tip: 'A branch costs almost nothing in Git. Create them often for every new task.',
    lab: 'Create a new feature branch and switch to it.',
    result: 'Verify your current branch with git branch.',
    code: '# Create a branch\ngit branch feature/auth\n\n# Switch to it\ngit switch feature/auth\n\n# OR do both in one command\ngit checkout -b feature/auth',
    filename: 'branches.sh',
    terminal: 'git checkout -b feature/login\ngit branch',
    terminalOutput: 'Switched to a new branch \'feature/login\'\n  main\n* feature/login'
  },
  {
    id: 'moving-changes', chapter: 'branching',
    title: 'Switch & Restore', subtitle: 'Managing Workspace Content',
    icon: RefreshCw, accent: '#3b82f6', bg: 'radial-gradient(circle at 90% 90%, rgba(59,130,246,0.1) 0%, transparent 60%)',
    concepts: [
      { label: 'git switch', desc: 'The modern way to change branches. Focused solely on HEAD movement.' },
      { label: 'git restore', desc: 'Used for taking files out of staging or resetting working directory changes.' }
    ],
    tip: 'Avoid git checkout for everything; "switch" and "restore" are clearer and harder to mess up.',
    lab: 'Undo a mistake in your working directory and switch back to main.',
    result: 'The file should revert to its last committed state.',
    code: '# Un-stage a file\ngit restore --staged README.md\n\n# Discard local changes\ngit restore README.md\n\n# Switch branches\ngit switch main',
    filename: 'ops.sh',
    terminal: 'git restore profile.php\ngit switch main',
    terminalOutput: 'Switched to branch \'main\'\nYour branch is up to date with \'origin/main\'.'
  },

  // MERGING
  {
    id: 'merge-basics', chapter: 'merging',
    title: 'Merging Streams', subtitle: 'Integrating Feature Changes',
    icon: GitMerge, accent: '#f59e0b', bg: 'radial-gradient(circle at 0% 90%, rgba(245,158,11,0.1) 0%, transparent 50%)',
    concepts: [
      { label: 'Fast-Forward', desc: 'Occurs when the current branch has no unique commits. Git just moves the pointer forward.' },
      { label: '3-Way Merge', desc: 'Occurs when branches have diverged. Git creates a new "Merge Commit" via a recursive strategy.' }
    ],
    tip: 'Always merge main INTO your feature branch before merging your feature INTO main to catch errors early.',
    lab: 'Merge your "feature/auth" branch back into main.',
    result: 'You should see "Fast-forward" or a merge commit in the logs.',
    code: '# Switch to main first\ngit switch main\n\n# Merge the feature\ngit merge feature/auth',
    filename: 'merge.sh',
    terminal: 'git merge feature/auth',
    terminalOutput: 'Updating 8f2a4b1..c3d4e5f\nFast-forward\n auth_controller.php | 12 ++++++++++++\n 1 file changed, 12 insertions(+)'
  },
  {
    id: 'conflict', chapter: 'merging',
    title: 'Conflict Resolution', subtitle: 'The Battle of Code Changes',
    icon: Shield, accent: '#f59e0b', bg: 'radial-gradient(circle at 100% 100%, rgba(245,158,11,0.1) 0%, transparent 60%)',
    concepts: [
      { label: 'Conflict Markers', desc: 'Git inserts <<<<<<<, =======, and >>>>>>> to show where changes clash.' },
      { label: 'Manual Fix', desc: 'You must edit the file, choose the correct lines, remove markers, and commit.' }
    ],
    tip: 'Conflicts are not errors! They are Git being polite and asking you which version is correct.',
    lab: 'Simulate and resolve a merge conflict.',
    result: 'The final file should contain the merged logic, and the repo status should be "clean".',
    code: '# If merge fails, check status\ngit status\n\n# Look for "Unmerged paths"\n# Edit file, then:\ngit add <conflicted-file>\ngit merge --continue',
    filename: 'conflict.txt',
    terminal: 'git merge feature/ui',
    terminalOutput: 'Auto-merging styles.css\nCONFLICT (content): Merge conflict in styles.css\nAutomatic merge failed; fix conflicts and then commit the result.'
  },

  // REMOTES
  {
    id: 'remote-intro', chapter: 'remotes',
    title: 'Remotes & Cloud', subtitle: 'Syncing with the World',
    icon: Globe, accent: '#a855f7', bg: 'radial-gradient(circle at 50% 0%, rgba(168,85,247,0.1) 0%, transparent 60%)',
    concepts: [
      { label: 'origin', desc: 'The default name given to the remote repository you cloned from.' },
      { label: 'git remote', desc: 'Command to manage connections to external repositories (GitHub, GitLab).' }
    ],
    tip: 'Always run "git fetch" to see remote changes without actually merging them into your current work.',
    lab: 'Add a new remote and push your code.',
    result: 'Verify remotes with git remote -v.',
    code: '# Add remote\ngit remote add origin https://github.com/user/repo.git\n\n# Push main branch\ngit push -u origin main',
    filename: 'remote.sh',
    terminal: 'git remote -v',
    terminalOutput: 'origin  https://github.com/fullstack/git-core.git (fetch)\norigin  https://github.com/fullstack/git-core.git (push)'
  },
  {
    id: 'prs', chapter: 'remotes',
    title: 'The PR Workflow', subtitle: 'Professional Team Collaboration',
    icon: GitPullRequest, accent: '#a855f7', bg: 'radial-gradient(circle at 50% 100%, rgba(168,85,247,0.08) 0%, transparent 70%)',
    concepts: [
      { label: 'Pull Request', desc: 'A formal way to ask a team to review your code before it merges into main.' },
      { label: 'Code Review', desc: 'Feedback from peers to ensure quality, catch bugs, and share knowledge.' }
    ],
    tip: 'Small, focused PRs are reviewed much faster and contain fewer bugs than massive changes.',
    lab: 'Pull the latest changes and push a New Feature PR.',
    result: 'Current branch updated with remote changes.',
    code: '# Get latest main\ngit checkout main\ngit pull origin main\n\n# Go back to feature\ngit checkout feature/new\ngit merge main\ngit push origin feature/new',
    filename: 'pr.sh',
    terminal: 'git pull origin main',
    terminalOutput: 'remote: Enumerating objects: 5, done.\nremote: Counting objects: 100% (5/5), done.\nUnpacking objects: 100% (3/3), 965 bytes | 965.00 KiB/s, done.\nFrom github.com/user/repo\n * branch            main       -> FETCH_HEAD\n   8f2a4b1..c3d4e5f  main       -> origin/main'
  },

  // MASTERY
  {
    id: 'stash', chapter: 'mastery',
    title: 'The Git Stash', subtitle: 'Quick Context Switching',
    icon: Box, accent: '#f43f5e', bg: 'radial-gradient(circle at 10% 10%, rgba(244,63,94,0.15) 0%, transparent 50%)',
    concepts: [
      { label: 'Stashing', desc: 'Temporarily shelves (or stashes) changes you\'ve made to your working directory.' },
      { label: 'Context Switch', desc: 'Allows you to revert to a clean state to work on something else without committing partial work.' }
    ],
    tip: 'Use "git stash pop" to apply the latest stashed changes and remove them from the list.',
    lab: 'Stash your current changes to pull an urgent fix.',
    result: 'git status should show "nothing to commit" after stashing.',
    code: '# Stash current work\ngit stash\n\n# ... pull fix ...\n\n# Retrieve work\ngit stash pop',
    filename: 'stash.sh',
    terminal: 'git stash',
    terminalOutput: 'Saved working directory and index state WIP on main: 8f2a4b1 Fix navigation\nHEAD is now at 8f2a4b1'
  },
  {
    id: 'rebase', chapter: 'mastery',
    title: 'Rebase Mastery', subtitle: 'Rewriting Local History',
    icon: RotateCcw, accent: '#f43f5e', bg: 'radial-gradient(circle at 90% 10%, rgba(244,63,94,0.1) 0%, transparent 60%)',
    concepts: [
      { label: 'Rebasing', desc: 'Re-applying commits on top of another base tip. Creates a clean, linear history.' },
      { label: 'Interactive', desc: 'Allows you to "squash" multiple small commits into one clean feature commit.' }
    ],
    tip: 'NEVER rebase commits that have already been pushed to a public repository.',
    lab: 'Rebase your feature branch on top of main.',
    result: 'Linear history with no "merge commit" pollution.',
    code: '# From your feature branch\ngit rebase main\n\n# Interactive (last 3 commits)\ngit rebase -i HEAD~3',
    filename: 'rebase.sh',
    terminal: 'git rebase main',
    terminalOutput: 'First, rewinding head to replay your work on top of it...\nApplying: feat: User profile view\nApplying: fix: Profile layout\nSuccessfully rebased and updated refs/heads/feature/profile.'
  }
];

/* ─── SYNTAX HIGHLIGHTER ─────────────────────────────────────────── */

const GIT_KW = new Set([
  'git', 'commit', 'branch', 'checkout', 'switch', 'merge', 'rebase',
  'pull', 'push', 'fetch', 'remote', 'add', 'status', 'log', 'init',
  'config', 'clone', 'stash', 'pop', 'apply', 'restore', 'diff',
  '--global', '--oneline', '-m', '-u', '-b', '-i', '--staged', '--list'
]);

const HighlightedCode = ({ code }: { code: string }) => {
  const tokenize = (line: string): React.ReactNode => {
    if (/^\s*#/.test(line))
      return <span style={{ color: '#6b7280', fontStyle: 'italic' }}>{line}</span>;

    const parts = line.split(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\B[a-z0-9/._-]+\B|\b\d+(?:\.\d+)?\b|\b[a-zA-Z_-]+\b)/g);
    return parts.map((p, i) => {
      if (!p) return null;
      if (GIT_KW.has(p)) return <span key={i} style={{ color: '#f87171', fontWeight: 700 }}>{p}</span>;
      if (p.startsWith('"') || p.startsWith("'")) return <span key={i} style={{ color: '#86efac' }}>{p}</span>;
      if (/^\d/.test(p)) return <span key={i} style={{ color: '#c084fc' }}>{p}</span>;
      if (p.startsWith('-')) return <span key={i} style={{ color: '#60a5fa' }}>{p}</span>;
      if (p.includes('/')) return <span key={i} style={{ color: '#fbbf24' }}>{p}</span>;
      return <span key={i} style={{ color: '#e2e8f0' }}>{p}</span>;
    });
  };

  return (
    <div className="font-mono text-[13px] leading-6 whitespace-pre"
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
  const [tab, setTab] = useState<'code' | 'terminal'>('terminal');
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
    <div className="flex flex-col h-full bg-[#07090f] rounded-2xl overflow-hidden border border-white/8 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0d1117] border-b border-white/5 flex-none">
        <div className="flex items-center gap-1 p-1 bg-black/40 rounded-xl border border-white/5">
          {(['code', 'terminal'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                tab === t ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}>
              {t === 'code' ? <Code2 className="w-3 h-3" /> : <Terminal className="w-3 h-3" />}
              {t === 'code' ? 'Commands' : 'Shell'}
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
             {running ? 'Executing...' : 'Run'}
           </button>
           <button onClick={copy} className="p-2 hover:bg-white/5 rounded-lg transition-colors group">
             {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-zinc-600 group-hover:text-white" />}
           </button>
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-2 bg-[#0d1117]/60 border-b border-white/5 flex-none font-mono text-[10px]">
        <div className="flex gap-1.5 mr-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]/80" />
        </div>
        <span className="text-zinc-500 uppercase tracking-widest font-black">{tab === 'code' ? filename : 'zsh'}</span>
      </div>

      <div className="flex-1 relative overflow-hidden">
        {tab === 'code' ? (
          <div className="flex h-full overflow-hidden">
            <div className="flex-none w-10 bg-[#07090f] border-r border-white/5 pt-4 flex flex-col items-end pr-3 select-none overflow-hidden text-zinc-700 font-mono text-[11px]">
               {lines.map((_, i) => <div key={i} className="leading-6">{i + 1}</div>)}
            </div>
            <div className="relative flex-1 overflow-hidden">
               <div ref={hlRef} className="absolute inset-0 overflow-auto p-4 pointer-events-none">
                 <HighlightedCode code={code} />
               </div>
               <textarea ref={taRef} value={code} onChange={e => setCode(e.target.value)} onScroll={syncScroll}
                 className="absolute inset-0 w-full h-full bg-transparent text-transparent resize-none outline-none p-4 font-mono text-[13px] leading-6 border-none overflow-auto selection:bg-emerald-500/20"
                 spellCheck={false} wrap="off" />
            </div>
          </div>
        ) : (
          <div className="p-6 font-mono text-sm leading-relaxed overflow-auto h-full">
            <div className="flex gap-2 text-zinc-500 mb-3">
              <span style={{ color: accent }}>➜</span>
              <span className="text-blue-400">~/git-project</span>
              <span className="text-zinc-600 font-bold">$</span>
              <span className="text-zinc-200">{terminal}</span>
            </div>
            {output ? <pre className="text-zinc-400 whitespace-pre-wrap">{output}</pre> : <div className="text-zinc-600 animate-pulse">Running...</div>}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── MAIN COMPONENT ─────────────────────────────────────────────── */

export default function GitSlides() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const chapterParam = searchParams.get('chapter') || 'foundations';
  const slideParam = searchParams.get('slide') || 'intro';

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState<any>({});
  const [dir, setDir] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('git_slide_notes');
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  const saveNote = (val: string) => {
    const newNotes = { ...notes, [slideParam]: val };
    setNotes(newNotes);
    localStorage.setItem('git_slide_notes', JSON.stringify(newNotes));
  };

  const displaySlides = useMemo(() => {
    return GIT_SLIDES.filter(s => s.chapter === chapterParam);
  }, [chapterParam]);

  const current = useMemo(() => {
    const idx = displaySlides.findIndex(s => s.id === slideParam);
    return idx === -1 ? 0 : idx;
  }, [displaySlides, slideParam]);

  const slide = displaySlides[current] || displaySlides[0];
  const Icon = slide.icon;
  const chapterInfo = CHAPTERS.find(c => c.id === chapterParam) || CHAPTERS[0];
  const progress = ((current + 1) / displaySlides.length) * 100;

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const newSlideVal = (current + 1).toString();
    const currentSlideParam = params.get('slide');

    if (current === 0) {
      if (currentSlideParam) {
        params.delete('slide');
        router.replace(`?${params.toString()}`, { scroll: false });
      }
    } else if (currentSlideParam !== newSlideVal) {
      params.set('slide', newSlideVal);
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [current, router, searchParams]);

  const goTo = useCallback((idx: number, d: number) => {
    if (isAnimating) return;
    setDir(d);
    setIsAnimating(true);
    setTimeout(() => {
        setCurrent(idx);
        setIsAnimating(false);
    }, 280);
  }, [isAnimating]);

  const next = () => {
    if (current < displaySlides.length - 1) {
      goTo(current + 1, 1);
    } else {
      const chIdx = CHAPTERS.findIndex(c => c.id === chapterParam);
      if (chIdx < CHAPTERS.length - 1) {
        setDir(1);
        const nextCh = CHAPTERS[chIdx + 1];
        const nextSlide = GIT_SLIDES.find(s => s.chapter === nextCh.id);
        router.push(`?chapter=${nextCh.id}&slide=${nextSlide?.id}`);
      }
    }
  };

  const prev = () => {
    if (current > 0) {
      goTo(current - 1, -1);
    } else {
      const chIdx = CHAPTERS.findIndex(c => c.id === chapterParam);
      if (chIdx > 0) {
        setDir(-1);
        const prevCh = CHAPTERS[chIdx - 1];
        const prevSlides = GIT_SLIDES.filter(s => s.chapter === prevCh.id);
        router.push(`?chapter=${prevCh.id}&slide=${prevSlides[prevSlides.length - 1].id}`);
      }
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [current, displaySlides]);

  const variants = {
    enter: (d: number) => ({ y: d > 0 ? 30 : -30, opacity: 0, scale: 0.98 }),
    center: { y: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ y: d > 0 ? -30 : 30, opacity: 0, scale: 0.98 })
  };

  return (
    <div className="min-h-screen bg-[#080c14] flex flex-col selecting-none overflow-hidden"
       style={{ fontFamily: "'Inter','DM Sans',system-ui,sans-serif" }}>
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none transition-all duration-1000" style={{ background: slide.bg }} />
      <div className="fixed inset-0 pointer-events-none opacity-20"
        style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />

      {/* ── HEADER ── */}
      <header className="relative z-[60] flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/5 bg-black/60 backdrop-blur-2xl">
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
            <div className="flex flex-col items-start leading-tight overflow-hidden text-left">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 hidden sm:block">Curriculum Map</span>
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-sm font-bold text-white tracking-tight truncate">{chapterInfo.label}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-600 flex-none transition-transform duration-500 ${isMenuOpen ? 'rotate-180 text-white' : ''}`} />
              </div>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-3 sm:gap-8">
          <div className="hidden sm:flex flex-col items-end gap-1.5 min-w-[100px] md:min-w-[140px]">
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="text-zinc-500 uppercase tracking-widest font-black hidden lg:block">Chapter Progress</span>
              <span className="text-white font-black bg-white/10 px-1.5 py-0.5 rounded-md">{Math.round(progress)}%</span>
            </div>
            <div className="w-24 md:w-44 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                className="h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.2)]" 
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
               <span className="text-sm font-mono text-white font-bold">{current + 1}<span className="text-zinc-800 mx-1">/</span>{displaySlides.length}</span>
            </div>
            <button onClick={next} className="w-10 h-10 rounded-xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all active:scale-90 border border-white/5 flex items-center justify-center">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── CHAPTER MENU ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-10 pointer-events-none">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)} className="absolute inset-0 bg-black/95 backdrop-blur-md pointer-events-auto" />
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
              className="relative w-full max-w-5xl max-h-full bg-[#0d1117] border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] flex flex-col pointer-events-auto overflow-hidden">
              <div className="flex-1 overflow-y-auto px-6 py-8 sm:p-12 scrollbar-none">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {CHAPTERS.map((ch, i) => {
                    const isActive = ch.id === chapterParam;
                    return (
                      <button key={ch.id} onClick={() => {
                          const firstSlide = GIT_SLIDES.find(s => s.chapter === ch.id);
                          router.push(`?chapter=${ch.id}&slide=${firstSlide?.id}`);
                          setIsMenuOpen(false);
                        }}
                        className={`group relative flex items-center gap-4 p-4 sm:p-5 rounded-2xl transition-all border ${
                          isActive ? 'bg-white/5 border-white/20 shadow-xl' : 'bg-transparent border-transparent hover:bg-white/5'
                        }`}>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm transition-all flex-none ${isActive ? 'scale-110' : 'opacity-60'}`}
                          style={{ background: isActive ? ch.color : `${ch.color}25`, color: isActive ? '#000' : ch.color }}>{String(i + 1).padStart(2, '0')}</div>
                        <div className="flex flex-col items-start leading-tight text-left truncate">
                           <span className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: ch.color }}>Phase {i + 1}</span>
                           <span className="text-sm sm:text-[15px] font-bold text-white truncate w-full">{ch.label.split('. ')[1]}</span>
                        </div>
                        {isActive && <div className="ml-auto w-2 h-2 rounded-full" style={{ background: ch.color, boxShadow: `0 0 10px ${ch.color}` }} />}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="p-6 sm:px-12 sm:py-8 bg-black/20 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                 <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-zinc-400">Collaboration Engine Lifecycle</div>
                 <div className="text-[10px] font-mono text-zinc-500 bg-white/5 px-3 py-1 rounded-lg">FULLSTACK ACADEMY • GIT MASTERCLASS</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ── */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT: CONTENT */}
        <AnimatePresence mode="wait" custom={dir}>
          {!isAnimating && (
            <motion.div key={`${chapterParam}-${slideParam}`} custom={dir} variants={variants}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              className="flex-none lg:w-[45%] flex flex-col p-6 sm:p-10 xl:p-14 lg:border-r border-white/8 overflow-y-auto gap-8 justify-center min-h-0">
              
              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10 flex-none shadow-2xl"
                    style={{ background: `${slide.accent}20` }}>
                    <Icon className="w-7 h-7" style={{ color: slide.accent }} />
                  </div>
                  <div className="min-w-0">
                     <div className="flex items-center gap-2 mb-2 flex-wrap text-[10px] font-black uppercase tracking-widest">
                        <span className="px-2.5 py-1 rounded-full border"
                          style={{ color: chapterInfo.color, borderColor: `${chapterInfo.color}30`, background: `${chapterInfo.color}10` }}>
                          {chapterInfo.label}
                        </span>
                        <span className="text-zinc-700">{slide.id}</span>
                     </div>
                     <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-white leading-[0.88] tracking-tighter italic uppercase">
                       {slide.title}
                     </h1>
                     <p className="text-[15px] font-bold text-white/40 tracking-widest mt-3 uppercase">{slide.subtitle}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {slide.concepts.map((c: any, i: number) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.1 }}
                      className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: slide.accent }}>{c.label}</span>
                      <p className="text-sm text-zinc-400 leading-relaxed font-light">{c.desc}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex gap-4">
                   <Sparkles className="w-5 h-5 text-amber-500 flex-none mt-0.5" />
                   <div className="text-sm">
                      <span className="font-black text-amber-400 uppercase tracking-widest block mb-1 underline decoration-amber-500/30 underline-offset-4">Pro Insight</span>
                      <p className="text-amber-200/70 leading-relaxed italic">{slide.tip}</p>
                   </div>
                </div>

                <div className="space-y-3.5">
                   <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.03] flex gap-4 shadow-xl">
                      <Play className="w-5 h-5 mt-1" style={{ color: slide.accent }} />
                      <div className="text-sm">
                         <p className="font-black uppercase tracking-widest mb-1 text-white/30 text-[10px]">Objective</p>
                         <p className="text-white font-bold leading-relaxed">{slide.lab}</p>
                      </div>
                   </div>
                   <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 flex gap-4">
                      <CheckCircle2 className="w-5 h-5 mt-1 text-emerald-400" />
                      <div className="text-sm">
                         <p className="font-black uppercase tracking-widest mb-1 text-emerald-400/30 text-[10px]">Expected Outcome</p>
                         <p className="text-emerald-50/60 leading-relaxed font-semibold italic">{slide.result}</p>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-4 pt-4">
                   <button onClick={prev} className="flex-none w-14 h-14 rounded-2xl border border-white/10 bg-white/5 text-zinc-400 hover:text-white transition-all active:scale-95 flex items-center justify-center">
                      <ChevronLeft className="w-6 h-6" />
                   </button>
                   <button onClick={next} className="flex-1 h-14 rounded-2xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-2xl"
                      style={{ background: slide.accent, color: '#000' }}>
                      {current === displaySlides.length - 1 ? 'Go to Next Phase' : 'Next Step'}
                      <ChevronRight className="w-5 h-5" />
                   </button>
                   <button onClick={() => setShowNotes(!showNotes)} 
                      className={`w-14 h-14 rounded-2xl border transition-all flex items-center justify-center ${
                        showNotes ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.1)]' : 'bg-white/5 border-white/5 text-zinc-600 hover:text-white'
                      }`}>
                      <StickyNote className="w-6 h-6" />
                   </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RIGHT: EDITOR */}
        <div className="flex-1 flex flex-col p-4 sm:p-8 lg:p-14 overflow-hidden bg-black/40 relative">
           <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
           <CodePanel 
              code={slide.code} 
              terminal={slide.terminal} 
              terminalOutput={slide.terminalOutput} 
              accent={slide.accent} 
              filename={slide.filename} 
           />
        </div>
      </main>

      {/* NOTES SLIDE-IN */}
      <AnimatePresence>
        {showNotes && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed inset-y-0 right-0 w-80 sm:w-96 bg-[#0d1117] border-l border-white/10 z-[100] p-10 pt-32 shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col">
            <div className="mb-8">
               <h3 className="text-amber-400 font-black uppercase tracking-[0.3em] text-xs underline decoration-amber-500/20 underline-offset-8">Field Notes</h3>
               <p className="mt-4 text-[11px] text-zinc-600 font-bold uppercase">{slide.id} · {slide.title}</p>
            </div>
            <textarea className="flex-1 w-full bg-black/60 rounded-[2rem] p-8 text-base text-zinc-300 font-mono focus:outline-none border border-white/5 focus:border-amber-500/30 transition-all resize-none shadow-inner"
              placeholder="Jot down commands, tips, or reminders..." value={notes[slide.id] || ''} onChange={(e) => saveNote(e.target.value)} />
            <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-zinc-600 font-black uppercase tracking-widest">
                <HardDrive className="w-3 h-3" />
                Persistent Cloud Syncing
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
