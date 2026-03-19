"use client";

import React, { useState, useEffect, useCallback, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ChevronLeft, ChevronRight, Copy, Check, Play, RotateCcw,
  GitBranch, GitCommit, GitMerge, GitPullRequest, Github,
  Terminal, Folder, FileCode, Globe, Shield, Zap, Sparkles,
  ArrowRight, Package, Layers, RefreshCw, AlertCircle,
  Lock, Rocket, Search, Users, Code2, Star, Eye, Download,
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
    id: "00", title: "What is Git?", subtitle: "The Version Control System",
    tag: "Overview", tagColor: "#f97316", accent: "#f97316",
    bg: "radial-gradient(ellipse at 20% 50%, rgba(249,115,22,0.12) 0%, transparent 60%)",
    content: [
      "Git is a distributed version control system created by Linus Torvalds",
      "Tracks every change to your files over time — like an infinite undo button",
      "Allows many developers to work on the same project simultaneously",
      "Industry standard: used in 94% of professional development teams",
    ],
    lab: "Run 'git --version' in your terminal to verify Git is installed.",
    syntax: `# Git is a tool — GitHub is a website\n# Git: installed on your machine\n# GitHub: cloud hosting for your Git repos`,
    code: `# Check Git version\ngit --version\n# git version 2.43.0\n\n# Who uses Git?\n# - Linux kernel (1,000+ contributors)\n# - React, Vue, Angular\n# - Every major tech company\n\n# Core concepts:\n# Repository (repo) — a project folder tracked by Git\n# Commit           — a saved snapshot of your files\n# Branch           — a parallel version of your project\n# Remote           — a copy of the repo on GitHub`,
    icon: GitBranch,
  },
  {
    id: "01", title: "Install & Config", subtitle: "First-Time Setup",
    tag: "Setup", tagColor: "#60a5fa", accent: "#3b82f6",
    bg: "radial-gradient(ellipse at 70% 30%, rgba(59,130,246,0.12) 0%, transparent 60%)",
    content: [
      "Install Git from git-scm.com — free for all operating systems",
      "Set your name and email — these appear on every commit you make",
      "--global applies the setting to ALL your projects",
      "git config --list shows all your current settings",
    ],
    lab: "Configure your name and email, then verify with 'git config --list'.",
    syntax: `git config --global user.name "Your Name"\ngit config --global user.email "you@email.com"\ngit config --global core.editor "code --wait"`,
    code: `# Install Git (macOS with Homebrew)\nbrew install git\n\n# Install Git (Windows)\n# Download from: https://git-scm.com/downloads\n\n# First-time configuration\ngit config --global user.name "Ratha Dev"\ngit config --global user.email "ratha@dev.com"\ngit config --global core.editor "code --wait"\ngit config --global init.defaultBranch main\n\n# Verify your setup\ngit config --list\n# user.name=Ratha Dev\n# user.email=ratha@dev.com\n# core.editor=code --wait`,
    icon: Terminal,
  },
  {
    id: "02", title: "git init", subtitle: "Creating a Repository",
    tag: "Basics", tagColor: "#34d399", accent: "#10b981",
    bg: "radial-gradient(ellipse at 30% 70%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    content: [
      "git init — turns any folder into a Git repository",
      "Creates a hidden .git folder that stores all history",
      "Never manually edit files inside .git",
      "git status — your most-used command; shows what's changed",
    ],
    lab: "Create a new folder 'my-project', run 'git init', then 'git status'.",
    syntax: `git init             # initialise new repo\ngit init my-project  # create folder + init`,
    code: `# Create a new project\nmkdir my-project\ncd my-project\ngit init\n# Initialized empty Git repository in /my-project/.git/\n\n# Check the status\ngit status\n# On branch main\n# No commits yet\n# nothing to commit\n\n# See the hidden .git folder\nls -la\n# .git/    ← all history stored here\n\n# What's inside .git?\nls .git/\n# HEAD   config   description\n# hooks/ info/    objects/    refs/`,
    icon: Folder,
  },
  {
    id: "03", title: "Staging Area", subtitle: "The Three States",
    tag: "Basics", tagColor: "#fbbf24", accent: "#f59e0b",
    bg: "radial-gradient(ellipse at 60% 40%, rgba(245,158,11,0.12) 0%, transparent 60%)",
    content: [
      "Working Directory — files you're actively editing",
      "Staging Area (Index) — files you've marked as ready to save",
      "Repository — permanently saved snapshots (commits)",
      "git add moves files from Working → Staging",
    ],
    lab: "Create a file, run 'git status', then 'git add' and check status again.",
    syntax: `git add filename.txt  # stage one file\ngit add .            # stage ALL changes\ngit add -p           # stage chunks interactively`,
    code: `# Create a file\necho "Hello Git" > README.md\n\n# Status: file is Untracked\ngit status\n# Untracked files:\n#   README.md\n\n# Move to Staging Area\ngit add README.md\n\n# Status: file is Staged\ngit status\n# Changes to be committed:\n#   new file: README.md\n\n# Stage everything at once\ngit add .\n\n# Unstage a file (keep changes)\ngit restore --staged README.md`,
    icon: Layers,
  },
  {
    id: "04", title: "git commit", subtitle: "Saving Snapshots",
    tag: "Basics", tagColor: "#818cf8", accent: "#6366f1",
    bg: "radial-gradient(ellipse at 25% 55%, rgba(99,102,241,0.12) 0%, transparent 60%)",
    content: [
      "A commit is a permanent snapshot of your staged changes",
      "Every commit gets a unique SHA hash (e.g. a3f9b2c)",
      "Write commits in present tense: 'Add login form' not 'Added'",
      "git log — view the full history of commits",
    ],
    lab: "Make your first commit with message 'Initial commit' and view it with git log.",
    syntax: `git commit -m "feat: add login form"\ngit commit --amend  # edit last commit message`,
    code: `# Commit staged files\ngit commit -m "Initial commit"\n# [main (root-commit) a3f9b2c] Initial commit\n# 1 file changed, 1 insertion(+)\n\n# Shortcut: stage + commit in one step\ngit commit -am "fix: correct typo in header"\n# (only works for tracked files)\n\n# View commit history\ngit log\n# commit a3f9b2c...\n# Author: Ratha Dev <ratha@dev.com>\n# Date:   Mon Jan 15 2024\n#     Initial commit\n\n# Compact one-line view\ngit log --oneline\n# a3f9b2c Initial commit\n# 7d2e1f8 Add CSS styles`,
    icon: GitCommit,
  },
  {
    id: "05", title: "Commit Messages", subtitle: "Writing History",
    tag: "Best Practice", tagColor: "#22d3ee", accent: "#06b6d4",
    bg: "radial-gradient(ellipse at 70% 60%, rgba(6,182,212,0.12) 0%, transparent 60%)",
    content: [
      "Conventional Commits — industry standard format",
      "feat: new feature | fix: bug fix | docs: documentation",
      "chore: maintenance | refactor: code restructure",
      "First line: 50 chars max; body: 72 chars per line",
    ],
    lab: "Write 3 commits using Conventional Commits format for a login feature.",
    syntax: `feat: add user authentication\nfix: resolve login redirect loop\ndocs: update README with setup steps`,
    code: `# ✅ Good commit messages:\ngit commit -m "feat: add Google OAuth login"\ngit commit -m "fix: handle null user on profile page"\ngit commit -m "refactor: extract auth logic to hook"\ngit commit -m "chore: update dependencies to latest"\ngit commit -m "style: format with Prettier"\ngit commit -m "test: add unit tests for UserCard"\n\n# ❌ Bad commit messages:\ngit commit -m "fix"\ngit commit -m "changes"\ngit commit -m "asdfgh"\ngit commit -m "WIP"\n\n# Multi-line commit (opens editor)\ngit commit\n# First line: short summary (50 chars)\n# Blank line\n# Body: detailed explanation (72 chars/line)`,
    icon: FileCode,
  },
  {
    id: "06", title: "Branches", subtitle: "Parallel Development",
    tag: "Branching", tagColor: "#f472b6", accent: "#ec4899",
    bg: "radial-gradient(ellipse at 40% 25%, rgba(236,72,153,0.12) 0%, transparent 60%)",
    content: [
      "A branch is an independent line of development",
      "main/master — the primary production branch",
      "Feature branches isolate new work from stable code",
      "Branches are cheap and instant to create in Git",
    ],
    lab: "Create a 'feature/login' branch, add a commit, then switch back to main.",
    syntax: `git branch feature/login   # create branch\ngit switch feature/login   # switch to it\ngit switch -c feature/login # create + switch`,
    code: `# List all branches (* = current)\ngit branch\n# * main\n\n# Create a new branch\ngit switch -c feature/user-auth\n# Switched to a new branch 'feature/user-auth'\n\n# Make changes and commit on this branch\necho "auth code" > auth.js\ngit add auth.js\ngit commit -m "feat: add auth module"\n\n# Switch back to main\ngit switch main\n# auth.js is GONE here — it's on the feature branch!\n\n# See all branches\ngit branch -a\n# * main\n#   feature/user-auth\n\n# Delete a merged branch\ngit branch -d feature/user-auth`,
    icon: GitBranch,
  },
  {
    id: "07", title: "git merge", subtitle: "Combining Branches",
    tag: "Branching", tagColor: "#a78bfa", accent: "#8b5cf6",
    bg: "radial-gradient(ellipse at 55% 65%, rgba(139,92,246,0.12) 0%, transparent 60%)",
    content: [
      "Merge brings changes from one branch into another",
      "Fast-forward merge — no new commit needed (linear history)",
      "3-way merge — creates a merge commit when histories diverge",
      "Always merge INTO the branch you want to update",
    ],
    lab: "Merge 'feature/login' into main and view the result with git log --graph.",
    syntax: `git switch main\ngit merge feature/login\ngit log --oneline --graph`,
    code: `# Step 1: Switch to the destination branch\ngit switch main\n\n# Step 2: Merge the feature branch\ngit merge feature/user-auth\n# Updating a3f9b2c..7d2e1f8\n# Fast-forward\n#  auth.js | 1 +\n\n# Visualise the branch history\ngit log --oneline --graph --all\n# *   d4c1e9a (HEAD -> main) Merge feature/user-auth\n# |\\  \n# | * 7d2e1f8 (feature/user-auth) feat: add auth module\n# |/  \n# *   a3f9b2c Initial commit\n\n# After merging, delete the branch\ngit branch -d feature/user-auth`,
    icon: GitMerge,
  },
  {
    id: "08", title: "Merge Conflicts", subtitle: "Resolving Disagreements",
    tag: "Branching", tagColor: "#fb7185", accent: "#f43f5e",
    bg: "radial-gradient(ellipse at 20% 40%, rgba(244,63,94,0.12) 0%, transparent 60%)",
    content: [
      "A conflict occurs when two branches change the same line differently",
      "Git marks conflicts with <<<<<<, =======, and >>>>>>> markers",
      "You decide which version to keep — or combine both",
      "After resolving: git add + git commit to complete the merge",
    ],
    lab: "Intentionally create a conflict by editing the same line on two branches.",
    syntax: `<<<<<<< HEAD\nyour current branch code\n=======\nincoming branch code\n>>>>>>> feature/login`,
    code: `# Git shows a conflict like this:\n# <<<<<<< HEAD (your current branch)\n# const name = "Ratha";\n# =======    (separator)\n# const name = "Dara";\n# >>>>>>> feature/rename\n\n# RESOLVE: edit the file to keep what you want:\n# const name = "Ratha Dara"; // your decision\n\n# Then finalise the merge:\ngit add conflicted-file.js\ngit commit -m "merge: resolve name conflict"\n\n# Or ABORT the merge and start over:\ngit merge --abort\n\n# Use VS Code's merge editor (recommended):\n# It shows Accept Current | Accept Incoming | Both`,
    icon: AlertCircle,
  },
  {
    id: "09", title: "git rebase", subtitle: "Rewriting History",
    tag: "Advanced", tagColor: "#fbbf24", accent: "#f59e0b",
    bg: "radial-gradient(ellipse at 65% 35%, rgba(245,158,11,0.12) 0%, transparent 60%)",
    content: [
      "Rebase moves your branch commits on top of another branch",
      "Creates a cleaner, linear history compared to merge",
      "Golden rule: NEVER rebase a public/shared branch",
      "Interactive rebase: squash, edit, reorder commits",
    ],
    lab: "Rebase your feature branch onto main and compare with git log --graph.",
    syntax: `git switch feature/login\ngit rebase main          # rebase onto main\ngit rebase -i HEAD~3     # interactive: last 3 commits`,
    code: `# Regular rebase\ngit switch feature/user-auth\ngit rebase main\n# Rebasing: re-applies commits on top of main\n\n# Interactive rebase — powerful!\ngit rebase -i HEAD~3\n# Opens editor showing last 3 commits:\n# pick a3f9b2c feat: add auth module\n# pick 7d2e1f8 fix: typo\n# pick d4c1e9a docs: add comments\n\n# Change 'pick' to:\n# squash (s) — combine with previous commit\n# reword (r) — edit commit message\n# drop  (d) — delete this commit entirely\n# edit  (e) — stop to amend the commit\n\n# After rebase onto main, fast-forward merge:\ngit switch main && git merge feature/user-auth`,
    icon: RefreshCw,
  },
  {
    id: "10", title: "git stash", subtitle: "Temporary Storage",
    tag: "Workflow", tagColor: "#34d399", accent: "#10b981",
    bg: "radial-gradient(ellipse at 35% 60%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    content: [
      "Stash saves your uncommitted changes without committing them",
      "Use stash when you need to switch branches with unfinished work",
      "git stash list — see all saved stashes",
      "git stash pop — restore latest stash and remove it",
    ],
    lab: "Make changes, stash them, switch branches, then pop the stash back.",
    syntax: `git stash              # save uncommitted work\ngit stash pop          # restore latest stash\ngit stash list         # see all stashes`,
    code: `# You're working on a feature but need to switch branches\ngit stash\n# Saved working directory and index state WIP on main\n\n# Now safely switch branches\ngit switch hotfix/critical-bug\n# fix the bug...\ngit switch main\n\n# Restore your work\ngit stash pop\n# Restored stash@{0}: WIP on main\n\n# Named stash (recommended)\ngit stash push -m "half-done login form"\n\n# List all stashes\ngit stash list\n# stash@{0}: On main: half-done login form\n# stash@{1}: WIP on feature/auth\n\n# Apply specific stash without removing it\ngit stash apply stash@{1}`,
    icon: Package,
  },
  {
    id: "11", title: "GitHub Setup", subtitle: "Cloud Repository",
    tag: "GitHub", tagColor: "#e2e8f0", accent: "#94a3b8",
    bg: "radial-gradient(ellipse at 70% 50%, rgba(148,163,184,0.1) 0%, transparent 60%)",
    content: [
      "GitHub hosts your Git repositories in the cloud",
      "Create a repo on GitHub — it becomes the 'remote' origin",
      "SSH keys allow passwordless authentication to GitHub",
      "Personal Access Tokens (PAT) for HTTPS authentication",
    ],
    lab: "Create a new repository on GitHub and connect your local project to it.",
    syntax: `git remote add origin https://github.com/user/repo.git\ngit push -u origin main`,
    code: `# 1. Create repo on GitHub (github.com → New repository)\n\n# 2. Connect local repo to GitHub remote\ngit remote add origin https://github.com/ratha/my-project.git\n\n# 3. Verify the remote was added\ngit remote -v\n# origin  https://github.com/ratha/my-project.git (fetch)\n# origin  https://github.com/ratha/my-project.git (push)\n\n# 4. Push for the first time (-u sets upstream)\ngit push -u origin main\n# Branch 'main' set up to track remote branch 'main' from 'origin'\n\n# Setup SSH key (recommended — no password needed)\nssh-keygen -t ed25519 -C "ratha@dev.com"\ncat ~/.ssh/id_ed25519.pub\n# Copy and paste into GitHub → Settings → SSH Keys`,
    icon: Github,
  },
  {
    id: "12", title: "git push & pull", subtitle: "Syncing with Remote",
    tag: "GitHub", tagColor: "#60a5fa", accent: "#3b82f6",
    bg: "radial-gradient(ellipse at 25% 45%, rgba(59,130,246,0.12) 0%, transparent 60%)",
    content: [
      "git push — upload local commits to GitHub",
      "git pull — download + merge remote changes locally",
      "git fetch — download remote changes without merging",
      "Always pull before push to avoid conflicts",
    ],
    lab: "Push your local commits to GitHub and pull a change made on another machine.",
    syntax: `git push origin main    # push to remote\ngit pull origin main    # fetch + merge\ngit fetch origin        # download only`,
    code: `# Push local commits to GitHub\ngit push origin main\n# Counting objects: 5, done\n# To https://github.com/ratha/my-project.git\n#    a3f9b2c..7d2e1f8  main -> main\n\n# Pull latest changes from GitHub\ngit pull origin main\n# Fast-forward: 2 files changed\n\n# Fetch without merging (safe preview)\ngit fetch origin\ngit log HEAD..origin/main  # see what's new\ngit merge origin/main      # then manually merge\n\n# Force push (DANGEROUS — only on your own branches!)\ngit push --force-with-lease origin feature/my-branch\n\n# Pull with rebase instead of merge (cleaner history)\ngit pull --rebase origin main`,
    icon: Globe,
  },
  {
    id: "13", title: "Pull Requests", subtitle: "Code Review Workflow",
    tag: "GitHub", tagColor: "#c084fc", accent: "#a855f7",
    bg: "radial-gradient(ellipse at 55% 30%, rgba(168,85,247,0.12) 0%, transparent 60%)",
    content: [
      "A Pull Request (PR) proposes merging your branch into another",
      "Team members review your code before it merges to main",
      "Add reviewers, labels, and link related Issues",
      "Squash and merge — combines all commits into one",
    ],
    lab: "Create a feature branch, push it, and open a Pull Request on GitHub.",
    syntax: `# Push feature branch to GitHub\ngit push origin feature/login\n# Then open a PR on github.com`,
    code: `# Typical Pull Request workflow:\n\n# 1. Create feature branch\ngit switch -c feature/user-profile\n\n# 2. Do your work + commit\ngit commit -m "feat: add user profile page"\ngit commit -m "feat: add avatar upload"\ngit commit -m "test: add profile component tests"\n\n# 3. Push to GitHub\ngit push origin feature/user-profile\n\n# 4. Go to GitHub → your repo → Compare & Pull Request\n\n# 5. Fill in:\n#    Title:       feat: add user profile page\n#    Description: What changed and why\n#    Reviewers:   @teammate\n#    Labels:      enhancement\n\n# 6. After review approval → Merge Pull Request\n# 7. Delete the remote branch on GitHub\n# 8. Locally: git switch main && git pull && git branch -d feature/user-profile`,
    icon: GitPullRequest,
  },
  {
    id: "14", title: "Forking & Cloning", subtitle: "Contributing to Open Source",
    tag: "GitHub", tagColor: "#fb923c", accent: "#f97316",
    bg: "radial-gradient(ellipse at 40% 70%, rgba(249,115,22,0.12) 0%, transparent 60%)",
    content: [
      "Fork — creates your personal copy of someone else's repository",
      "Clone — downloads a repo from GitHub to your local machine",
      "Upstream — the original repository you forked from",
      "Keep your fork in sync by pulling from upstream",
    ],
    lab: "Fork the 'first-contributions' GitHub repo and submit your first PR.",
    syntax: `git clone https://github.com/user/repo.git\ngit remote add upstream https://github.com/original/repo.git`,
    code: `# Clone a repository from GitHub\ngit clone https://github.com/ratha/project.git\ncd project/\n\n# Clone into a custom folder name\ngit clone https://github.com/ratha/project.git my-folder\n\n# Fork workflow:\n# 1. Fork on GitHub (click Fork button)\n# 2. Clone YOUR fork\ngit clone https://github.com/YOUR-USERNAME/project.git\n\n# 3. Add the original as 'upstream'\ngit remote add upstream https://github.com/ORIGINAL/project.git\n\n# 4. Keep your fork in sync\ngit fetch upstream\ngit switch main\ngit merge upstream/main\ngit push origin main\n\n# 5. Now create your feature branch and PR`,
    icon: GitBranch,
  },
  {
    id: "15", title: ".gitignore", subtitle: "Hiding Files from Git",
    tag: "Config", tagColor: "#94a3b8", accent: "#64748b",
    bg: "radial-gradient(ellipse at 65% 25%, rgba(100,116,139,0.12) 0%, transparent 60%)",
    content: [
      ".gitignore tells Git which files to never track",
      "Always ignore: node_modules/, .env, build/, dist/",
      "Patterns: *.log (all log files), !important.log (exceptions)",
      "gitignore.io generates templates for any language/framework",
    ],
    lab: "Create a .gitignore that ignores node_modules, .env, and .DS_Store.",
    syntax: `# .gitignore examples:\nnode_modules/\n.env\n.env.local\ndist/\n*.log`,
    code: `# Create a .gitignore file\ntouch .gitignore\n\n# Contents of .gitignore:\n\n# Dependencies\nnode_modules/\n.pnp/\n.pnp.js\n\n# Environment variables (NEVER commit these!)\n.env\n.env.local\n.env.*.local\n\n# Build output\ndist/\nbuild/\n.next/\nout/\n\n# OS files\n.DS_Store\nThumbs.db\n\n# Editor files\n.vscode/settings.json\n.idea/\n*.swp\n\n# If you already committed a file by mistake:\ngit rm --cached .env        # remove from tracking\ngit commit -m "chore: untrack .env"\n# Now add .env to .gitignore`,
    icon: Shield,
  },
  {
    id: "16", title: "git reset & revert", subtitle: "Undoing Mistakes",
    tag: "Advanced", tagColor: "#fb7185", accent: "#f43f5e",
    bg: "radial-gradient(ellipse at 20% 55%, rgba(244,63,94,0.12) 0%, transparent 60%)",
    content: [
      "git revert — creates a new commit that undoes a previous one (safe)",
      "git reset --soft — undo commit, keep changes staged",
      "git reset --mixed — undo commit, unstage changes (default)",
      "git reset --hard — undo commit AND discard changes (DANGEROUS)",
    ],
    lab: "Commit a mistake, then use git revert to safely undo it.",
    syntax: `git revert HEAD          # safely undo last commit\ngit reset --soft HEAD~1  # undo commit, keep staged\ngit reset --hard HEAD~1  # undo commit + changes`,
    code: `# SAFE: revert creates a new "undo" commit\ngit revert HEAD\n# [main a4e5f1b] Revert "feat: bad feature"\n# History is preserved — safe for shared branches\n\n# SOFT reset: uncommit but keep files staged\ngit reset --soft HEAD~1\n# Files are back in staging, ready to re-commit\n\n# MIXED reset (default): unstage but keep file changes\ngit reset HEAD~1\n# Files are changed but unstaged\n\n# HARD reset: PERMANENTLY discard changes\ngit reset --hard HEAD~1\n# WARNING: changes are gone forever!\n\n# Recover a lost commit with reflog\ngit reflog\n# a3f9b2c HEAD@{1}: commit: feat: add feature\ngit checkout a3f9b2c  # go back to that point\n\n# Discard changes to a single file\ngit restore index.js`,
    icon: RotateCcw,
  },
  {
    id: "17", title: "Tags & Releases", subtitle: "Marking Versions",
    tag: "Workflow", tagColor: "#fbbf24", accent: "#eab308",
    bg: "radial-gradient(ellipse at 60% 65%, rgba(234,179,8,0.12) 0%, transparent 60%)",
    content: [
      "Tags mark specific commits as important (releases, milestones)",
      "Lightweight tag — just a name pointing to a commit",
      "Annotated tag — includes author, date, and message",
      "Semantic Versioning: v1.0.0 = MAJOR.MINOR.PATCH",
    ],
    lab: "Tag your project's first stable version as v1.0.0 and push the tag.",
    syntax: `git tag v1.0.0                       # lightweight\ngit tag -a v1.0.0 -m "First release" # annotated\ngit push origin v1.0.0               # push tag`,
    code: `# List all tags\ngit tag\n# v0.1.0\n# v1.0.0\n\n# Create an annotated tag (recommended)\ngit tag -a v1.0.0 -m "First stable release"\n\n# Tag a specific past commit\ngit log --oneline\n# a3f9b2c feat: complete login system\ngit tag -a v1.0.0 a3f9b2c -m "v1.0.0 release"\n\n# Push a single tag to GitHub\ngit push origin v1.0.0\n\n# Push all tags at once\ngit push origin --tags\n\n# Delete a tag\ngit tag -d v0.1.0\ngit push origin --delete v0.1.0\n\n# Semantic Versioning:\n# v1.0.0 → major.minor.patch\n# Breaking change → bump MAJOR (2.0.0)\n# New feature     → bump MINOR (1.1.0)\n# Bug fix         → bump PATCH (1.0.1)`,
    icon: Star,
  },
  {
    id: "18", title: "GitHub Actions", subtitle: "CI/CD Automation",
    tag: "DevOps", tagColor: "#4ade80", accent: "#22c55e",
    bg: "radial-gradient(ellipse at 35% 25%, rgba(34,197,94,0.12) 0%, transparent 60%)",
    content: [
      "GitHub Actions automates tasks when you push code",
      "Workflows live in .github/workflows/ as YAML files",
      "Common uses: run tests, deploy to Vercel, lint code",
      "Events: push, pull_request, schedule, workflow_dispatch",
    ],
    lab: "Create a workflow that runs 'npm test' on every push to main.",
    syntax: `# .github/workflows/ci.yml\non: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest`,
    code: `# .github/workflows/ci.yml\nname: CI Pipeline\n\non:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\n\njobs:\n  test:\n    name: Run Tests\n    runs-on: ubuntu-latest\n\n    steps:\n      - name: Checkout code\n        uses: actions/checkout@v4\n\n      - name: Setup Node.js\n        uses: actions/setup-node@v4\n        with:\n          node-version: '20'\n\n      - name: Install dependencies\n        run: npm ci\n\n      - name: Run linter\n        run: npm run lint\n\n      - name: Run tests\n        run: npm test`,
    icon: Zap,
  },
  {
    id: "19", title: "Git Flow", subtitle: "Professional Branching Strategy",
    tag: "Workflow", tagColor: "#818cf8", accent: "#6366f1",
    bg: "radial-gradient(ellipse at 70% 50%, rgba(99,102,241,0.12) 0%, transparent 60%)",
    content: [
      "main — always deployable production code",
      "develop — integration branch for features",
      "feature/* — individual feature branches from develop",
      "hotfix/* — urgent bug fixes branched from main",
    ],
    lab: "Map out the Git Flow for adding a 'user profile' feature to your project.",
    syntax: `main ← hotfix/*\nmain ← release/* ← develop ← feature/*`,
    code: `# Git Flow branching strategy:\n\n# Permanent branches:\n# main    → production (always deployable)\n# develop → pre-production integration\n\n# Temporary branches:\n# feature/xxx  → new feature (from develop)\n# release/x.x  → release prep (from develop)\n# hotfix/xxx   → urgent fix  (from main)\n\n# Example workflow:\ngit switch develop\ngit switch -c feature/user-profile\n# ... develop the feature ...\ngit commit -m "feat: add user profile page"\ngit switch develop\ngit merge --no-ff feature/user-profile\ngit branch -d feature/user-profile\n\n# When ready for release:\ngit switch -c release/1.2.0\n# bump version number, final fixes\ngit switch main && git merge release/1.2.0\ngit tag -a v1.2.0 -m "Release 1.2.0"\ngit switch develop && git merge release/1.2.0`,
    icon: GitBranch,
  },
  {
    id: "20", title: "GitHub Issues", subtitle: "Tracking Work",
    tag: "GitHub", tagColor: "#38bdf8", accent: "#0ea5e9",
    bg: "radial-gradient(ellipse at 25% 60%, rgba(14,165,233,0.12) 0%, transparent 60%)",
    content: [
      "Issues track bugs, features, and tasks on GitHub",
      "Reference issues in commits with #123 to auto-link them",
      "Close issues automatically with 'Closes #123' in a commit",
      "Labels, milestones, and assignees organise large projects",
    ],
    lab: "Create an issue for a feature, then link it to a commit using 'Closes #1'.",
    syntax: `git commit -m "feat: add login  Closes #42"\ngit commit -m "fix: null error  Fixes #18"`,
    code: `# GitHub Issues are the task board for your project\n\n# Reference in a commit (links but doesn't close):\ngit commit -m "feat: start working on auth  #42"\n\n# Close issue automatically when merged to main:\ngit commit -m "feat: complete authentication  Closes #42"\ngit commit -m "fix: resolve crash on iOS       Fixes #18"\ngit commit -m "update README                  Resolves #7"\n\n# Labels for issues:\n# bug        → something is broken\n# enhancement → new feature\n# good first issue → beginner-friendly\n# help wanted     → need a contributor\n# documentation   → docs update needed\n\n# Milestones: group issues by release\n# v1.0.0 milestone → all issues that block the release`,
    icon: Search,
  },
  {
    id: "21", title: "Git Aliases", subtitle: "Custom Shortcuts",
    tag: "Productivity", tagColor: "#fb923c", accent: "#f97316",
    bg: "radial-gradient(ellipse at 55% 35%, rgba(249,115,22,0.12) 0%, transparent 60%)",
    content: [
      "Aliases create shorthand for long Git commands",
      "Set globally in ~/.gitconfig under [alias]",
      "Most-used aliases: st, co, br, lg, last",
      "Shell aliases can also wrap git commands",
    ],
    lab: "Set up the 'lg' alias for a pretty log and use it on your project.",
    syntax: `git config --global alias.st status\ngit config --global alias.co switch\ngit config --global alias.lg "log --oneline --graph"`,
    code: `# Set up useful aliases\ngit config --global alias.st status\ngit config --global alias.co switch\ngit config --global alias.br branch\ngit config --global alias.last "log -1 HEAD"\n\n# Beautiful log alias\ngit config --global alias.lg \\\n  "log --oneline --graph --decorate --all"\n\n# Now use them:\ngit st         # instead of: git status\ngit co main    # instead of: git switch main\ngit br         # instead of: git branch\ngit lg         # pretty graph of all branches\ngit last       # see the last commit\n\n# Check all aliases in config\ngit config --global --list | grep alias\n\n# ~/.gitconfig file:\n# [alias]\n#   st  = status\n#   co  = switch\n#   br  = branch\n#   lg  = log --oneline --graph --decorate --all`,
    icon: Zap,
  },
  {
    id: "22", title: "Collaboration Tips", subtitle: "Working in Teams",
    tag: "Team", tagColor: "#c084fc", accent: "#a855f7",
    bg: "radial-gradient(ellipse at 40% 70%, rgba(168,85,247,0.12) 0%, transparent 60%)",
    content: [
      "Never force push to main or shared branches",
      "Pull before you push — always sync first",
      "Keep PRs small (under 400 lines) for easier review",
      "Write PR descriptions that explain WHY, not just WHAT",
    ],
    lab: "Review someone else's PR and leave a helpful comment or suggestion.",
    syntax: `# Team Git rules:\n# ✅ git pull --rebase  (before pushing)\n# ❌ git push --force   (on shared branches)`,
    code: `# ✅ Professional team Git workflow:\n\n# 1. Always start from a fresh main\ngit switch main && git pull\n\n# 2. Create a well-named branch\ngit switch -c feature/TICKET-123-add-dark-mode\n\n# 3. Commit frequently with good messages\ngit commit -m "feat(ui): add dark mode toggle component"\n\n# 4. Pull latest main before submitting PR\ngit fetch origin\ngit rebase origin/main\n\n# 5. Push and open PR\ngit push origin feature/TICKET-123-add-dark-mode\n\n# ❌ Things that make teammates upset:\n# - Committing directly to main\n# - Force pushing shared branches\n# - Giant PRs with 2000+ line changes\n# - Commit messages like "fix stuff"\n# - Not resolving conflicts before requesting review`,
    icon: Users,
  },
  {
    id: "23", title: "GitHub Pages", subtitle: "Free Static Hosting",
    tag: "Deploy", tagColor: "#34d399", accent: "#10b981",
    bg: "radial-gradient(ellipse at 65% 45%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    content: [
      "GitHub Pages hosts static sites directly from your repository",
      "Perfect for portfolios, documentation, and landing pages",
      "Deploy from main branch or a /docs folder",
      "Custom domain support — point your domain to GitHub Pages",
    ],
    lab: "Deploy your HTML/CSS portfolio to GitHub Pages and share the URL.",
    syntax: `# Enable in: GitHub → Settings → Pages\n# Source: Deploy from branch → main → /root`,
    code: `# Deploy to GitHub Pages (simple HTML site):\n# 1. Push HTML/CSS to GitHub\ngit push origin main\n\n# 2. GitHub → Repo Settings → Pages\n#    Source: Deploy from a branch\n#    Branch: main / (root)\n\n# 3. Your site is live at:\n#    https://username.github.io/repository-name\n\n# For a Next.js/React project:\nnpm install --save-dev gh-pages\n\n# package.json:\n# "homepage": "https://ratha.github.io/my-app",\n# "predeploy": "npm run build",\n# "deploy": "gh-pages -d build"\n\nnpm run deploy\n# Published to gh-pages branch\n\n# Custom domain:\n# 1. Add CNAME file to repo: echo "mysite.com" > CNAME\n# 2. Configure DNS: CNAME record → username.github.io`,
    icon: Globe,
  },
  {
    id: "FA", title: "Final Project", subtitle: "Team Portfolio Repository",
    tag: "Assignment", tagColor: "#fde047", accent: "#eab308",
    bg: "radial-gradient(ellipse at 50% 50%, rgba(234,179,8,0.15) 0%, transparent 60%), radial-gradient(ellipse at 10% 90%, rgba(249,115,22,0.08) 0%, transparent 50%)",
    content: [
      "Set up a team repo with branch protection on main",
      "Each member adds their profile in a feature branch",
      "Submit work via Pull Requests with code review",
      "Tag v1.0.0 and deploy to GitHub Pages",
      "Set up a CI workflow that runs on every PR",
    ],
    lab: "Build a team portfolio site with 3+ contributors using full Git Flow.",
    syntax: `git flow init\ngit switch -c feature/your-profile\n# build → PR → review → merge → deploy`,
    code: `# FINAL PROJECT CHECKLIST:\n#\n# Repository setup:\n# ✅ Initialised with README, .gitignore, LICENSE\n# ✅ Branch protection on main (require PRs)\n# ✅ Labels set up (bug, enhancement, docs)\n#\n# Development:\n# ✅ Each feature on its own branch\n# ✅ Conventional commit messages throughout\n# ✅ At least 10 meaningful commits per member\n#\n# Collaboration:\n# ✅ Every branch merged via Pull Request\n# ✅ At least 1 code review comment per PR\n# ✅ Conflicts resolved properly\n#\n# Release:\n# ✅ Tagged v1.0.0 with annotated tag\n# ✅ GitHub Pages deployment live\n# ✅ CI workflow running on all PRs\n#\n# CONGRATULATIONS! 🎓\n# You are now a Git professional.`,
    icon: Sparkles,
  },
];

/* ─── BASH SYNTAX HIGHLIGHTER ────────────────────────────────────── */
const GIT_KEYWORDS = new Set([
  'git','init','add','commit','push','pull','fetch','merge','rebase',
  'switch','branch','checkout','stash','pop','status','log','diff',
  'remote','clone','tag','reset','revert','restore','config','rm',
]);

const HighlightedCode = ({ code }: { code: string }) => {
  const tokenizeLine = (line: string): React.ReactNode => {
    const trimmed = line.trimStart();

    // Comments (# ...)
    if (trimmed.startsWith('#')) {
      return <span style={{ color: '#6b7280', fontStyle: 'italic' }}>{line}</span>;
    }

    // Split on tokens
    const parts = line.split(/(\b[a-zA-Z_][\w-]*\b|"[^"]*"|'[^']*'|-{1,2}[\w-]+|\d+)/g);
    return parts.map((part, i) => {
      if (!part) return null;
      if (GIT_KEYWORDS.has(part)) return <span key={i} style={{ color: '#f87171', fontWeight: 700 }}>{part}</span>;
      if (/^["']/.test(part)) return <span key={i} style={{ color: '#86efac' }}>{part}</span>;
      if (/^-{1,2}[\w-]+/.test(part)) return <span key={i} style={{ color: '#fbbf24' }}>{part}</span>;
      if (/^\d+$/.test(part)) return <span key={i} style={{ color: '#c084fc' }}>{part}</span>;
      if (/^v\d+\.\d+/.test(part)) return <span key={i} style={{ color: '#34d399' }}>{part}</span>;
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

/* ─── SYNTAX PANEL ───────────────────────────────────────────────── */
const SyntaxPanel = ({ syntax, accent }: { syntax: string; accent: string }) => {
  if (!syntax) return null;
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: `${accent}30`, background: `${accent}08` }}>
      <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: `${accent}20` }}>
        <Terminal className="w-3 h-3" style={{ color: accent }} />
        <span className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: accent }}>Syntax Reference</span>
      </div>
      <div
        className="p-3 text-xs leading-6 font-mono whitespace-pre text-zinc-300 overflow-x-auto"
        style={{ fontFamily: "'JetBrains Mono','Fira Code',monospace" }}
      >
        {syntax.split('\n').map((line, i) => (
          <div key={i} className="min-h-[1.5rem]">
            {line.trimStart().startsWith('#')
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
            <Terminal className="w-3 h-3" style={{ color: accent }} />
            <span className="text-[10px] font-mono text-zinc-400">terminal</span>
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

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-none w-9 bg-[#0d1117] border-r border-white/5 pt-4 pb-4 flex flex-col items-end pr-2 overflow-hidden select-none">
          {lines.map((_, i) => (
            <div key={i} className="text-[11px] font-mono text-zinc-600 leading-6 min-h-[1.5rem]">{i + 1}</div>
          ))}
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div
            ref={highlightRef}
            className="absolute inset-0 overflow-auto p-4 pointer-events-none"
            style={{ scrollbarWidth: 'none' }}
          >
            <HighlightedCode code={code} />
          </div>
          <textarea
            ref={taRef}
            readOnly
            value={code}
            onScroll={syncScroll}
            className="absolute inset-0 w-full h-full bg-transparent text-transparent resize-none outline-none p-4 font-mono text-sm leading-6 border-none overflow-auto selection:bg-orange-500/25"
            style={{ fontFamily: "'JetBrains Mono',monospace", whiteSpace: 'pre', overflowWrap: 'normal' }}
            spellCheck={false}
            wrap="off"
          />
        </div>
      </div>
    </div>
  );
};

/* ─── MAIN COMPONENT ─────────────────────────────────────────────── */
function GitLessonContent() {
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
    exit: (d: number) => ({ x: d * -50, opacity: 0, scale: 0.97 }),
  };

  return (
    <div
      className="min-h-screen text-white flex flex-col overflow-hidden"
      style={{ background: '#080c14', fontFamily: "'Inter','DM Sans',system-ui,sans-serif" }}
    >
      {/* Dynamic background */}
      <div className="fixed inset-0 pointer-events-none transition-all duration-700" style={{ background: slide.bg }} />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.02) 0%, transparent 70%)' }}
      />

      {/* ── HEADER ── */}
      <header className="relative z-20 flex items-center gap-4 px-6 py-3 border-b border-white/8 bg-black/20 backdrop-blur-xl flex-none">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center border border-white/10 flex-none"
          style={{ background: `${slide.accent}20` }}
        >
          <IconComp className="w-3.5 h-3.5" style={{ color: slide.accent }} />
        </div>
        <div className="flex-none">
          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-600 font-bold">Tools · Bonus Module</p>
          <p className="text-xs font-black text-white tracking-tight">Git & GitHub Mastery</p>
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

        <div className="flex items-center gap-3 ml-auto">
          <a
            href="https://git-scm.com/downloads"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all group"
          >
            <Download className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
            Downloads
          </a>
          <div className="flex items-center gap-2">
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
                  <p className="text-[9px] font-black uppercase tracking-widest mb-0.5" style={{ color: slide.accent }}>
                    Lab Exercise
                  </p>
                  <p className="text-xs text-zinc-300 leading-relaxed">{slide.lab}</p>
                </div>
              </motion.div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-3 mt-6 lg:mt-0">
              <button
                onClick={prev}
                className="p-2.5 rounded-xl bg-white/5 border border-white/8 hover:bg-white/10 active:scale-95 transition-all flex items-center gap-1.5"
              >
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

        {/* RIGHT — Code viewer */}
        <div className="flex-1 flex flex-col overflow-hidden p-4 lg:p-5 gap-3">
          <div className="flex items-center justify-between flex-none">
            <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1 border border-white/8">
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest"
                style={{ background: `${slide.accent}25`, color: slide.accent }}
              >
                <Terminal className="w-3 h-3" /> Terminal
              </div>
            </div>
            <div className="text-[9px] font-mono text-zinc-700 hidden lg:flex items-center gap-1">
              <kbd className="px-1 py-0.5 border border-zinc-800 rounded text-[8px]">←</kbd>
              <kbd className="px-1 py-0.5 border border-zinc-800 rounded text-[8px]">→</kbd>
              navigate
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`code-${current}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-hidden rounded-xl border border-white/8"
            >
              <CodeViewer code={slide.code} accent={slide.accent} />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ── FOOTER DOTS ── */}
      <footer className="relative z-20 flex justify-center items-center gap-1.5 py-3 border-t border-white/8 bg-black/20 backdrop-blur-xl flex-none flex-wrap px-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? 1 : -1)}
            title={slides[i].title}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? 20 : 5,
              height: 5,
              background: i === current ? slide.accent : 'rgba(255,255,255,0.12)',
            }}
          />
        ))}
      </footer>
    </div>
  );
}

export default function GitLesson() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#080c14] flex items-center justify-center">
          <div className="text-center space-y-3">
            <div
              className="w-8 h-8 border-2 border-t-orange-500 rounded-full animate-spin mx-auto"
              style={{ borderColor: 'rgba(249,115,22,0.3)', borderTopColor: '#f97316' }}
            />
            <p className="text-zinc-600 text-sm font-mono">Loading Git Lab...</p>
          </div>
        </div>
      }
    >
      <GitLessonContent />
    </Suspense>
  );
}