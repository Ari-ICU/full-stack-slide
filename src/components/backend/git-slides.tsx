'use client';
import { useState, useCallback } from 'react';
import { 
  Sprout, Settings, RefreshCcw, Search, GitBranch, 
  Globe, RotateCcw, EyeOff, Beaker, Calendar, 
  BookOpen, Monitor, Lightbulb, CheckCircle2,
  Briefcase, ShoppingCart, Newspaper, Smartphone, Code2,
  Building2, User, Zap, Shield, Package, Layers,
  LucideIcon 
} from 'lucide-react';

// ─── TYPES ────────────────────────────────────────────────────
interface Command { cmd: string; desc: string; output: string; }
interface FlowItem { step: string; cmd: string; label: string; desc: string; color: string; }

interface RealWorldBox {
  company: string;
  role: string;
  icon: LucideIcon;
  color: string;
  story: string;
  khmer: string;
  cmds: { cmd: string; why: string }[];
  result: string;
}

interface RealWorldScenario {
  id: string; company: string; role: string; icon: LucideIcon; color: string;
  situation: string; khmer: string;
  steps: { action: string; cmd: string; why: string }[];
  outcome: string;
}

interface GitSection {
  id: string; num: string; label: string; icon: LucideIcon; color: string;
  title: string; khmer: string; subtitle: string; desc: string;
  realWorld?: RealWorldBox;
  concept?: { without: string[]; with: string[] };
  objectives?: string[];
  commands?: Command[];
  flow?: FlowItem[];
  tip?: string;
  ignoreContent?: string;
  steps?: { n: number; task: string; cmd: string }[];
  assignment?: { title: string; items: string[] };
  schedule?: { time: string; type: string; icon: LucideIcon; items: string[] }[];
  next?: string[];
  integration?: { stack: string; desc: string }[];
  scenarios?: RealWorldScenario[];
  jobs?: { title: string; salary: string; uses: string[] }[];
  mistakes?: { bad: string; good: string; why: string }[];
  setupSteps?: {
    os: 'windows' | 'mac';
    items: { task: string; cmd?: string; note?: string; khmer?: string }[];
  }[];
}

// ─── GLOBAL STYLES ────────────────────────────────────────────
const G = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Noto+Sans+Khmer:wght@400;700;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --ink:#000000; --paper:#ffffff; --cream:#f5f5f5; --warm:#f8f9fa;
  --rule:rgba(0,0,0,0.96); --faint:rgba(0,0,0,0.05); --ghost:rgba(0,0,0,0.02);
  --red:#c0392b; --green:#16a34a; --blue:#0284c7; --amber:#d97706; --purple:#7c3aed;
  --serif:'Playfair Display',Georgia,serif;
  --mono:'Courier Prime',Courier,monospace;
  --khmer:'Noto Sans Khmer',sans-serif;
}
body{background:var(--paper);color:var(--ink);}
::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-thumb{background:var(--rule);}
button{cursor:pointer;border:none;outline:none;background:none;font-family:var(--mono);}
body::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:0;
  background-image:radial-gradient(circle,#c8b89840 1px,transparent 1px);background-size:24px 24px;}
@keyframes fadeSlide{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes stamp{0%{transform:rotate(-2deg) scale(1.2);opacity:0}100%{transform:rotate(-2deg) scale(1);opacity:1}}
@keyframes rwIn{from{opacity:0;transform:translateX(8px)}to{opacity:1;transform:none}}
.cmd-line:hover{background:var(--faint)!important;}
.nav-tab:hover{background:var(--warm)!important;}
.nav-tab.active{background:var(--ink)!important;color:var(--paper)!important;}
.rw-cmd:hover{background:rgba(255,255,255,0.06)!important;}
.main-layout{display:flex;max-width:1000px;margin:0 auto;position:relative;z-index:1;}
.sidebar{width:190px;flex-shrink:0;border-right:1px solid var(--rule);min-height:calc(100vh - 52px);position:sticky;top:52px;height:calc(100vh - 52px);overflow-y:auto;background:var(--paper);}
.content-area{flex:1;padding:32px 28px;min-width:0;}
.intro-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.workflow-container{display:flex;align-items:center;gap:0;border:1px solid var(--rule);overflow:hidden;}
.plan-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.mistake-grid{display:grid;grid-template-columns:1fr 1fr;gap:0;}
code.term{font-family:var(--mono);font-size:0.88em;background:rgba(0,0,0,0.06);padding:1px 5px;border-radius:3px;color:inherit;}
@media(max-width:850px){
  .main-layout{flex-direction:column;}
  .sidebar{width:100%;height:auto;min-height:0;position:relative;top:0;border-right:none;border-bottom:1px solid var(--rule);display:flex;overflow-x:auto;overflow-y:hidden;padding:0;white-space:nowrap;scrollbar-width:none;}
  .sidebar::-webkit-scrollbar{display:none;}
  .sidebar > div{display:flex;padding:0 !important;}
  .nav-tab{width:auto !important;padding:12px 20px !important;border-left:none !important;border-bottom:3px solid transparent;}
  .nav-tab.active{border-bottom:3px solid var(--amber) !important;}
  .content-area{padding:20px 16px;}
  .intro-grid,.plan-grid{grid-template-columns:1fr;}
  .workflow-container{flex-direction:column;}
  .workflow-container > div{border-right:none !important;border-bottom:1px solid var(--rule);width:100%;}
  .mistake-grid{grid-template-columns:1fr;}
}
@media(max-width:600px){
  .header-content{flex-wrap:wrap;height:auto !important;padding:10px 16px !important;gap:10px;}
  .header-brand{width:100%;justify-content:space-between;}
  .hide-xs{display:none !important;}
}
`;

// ─── INLINE CODE HELPER (for Khmer story text) ────────────────
function T({ children }: { children: string }) {
  return <code className="term">{children}</code>;
}

// ─── DATA ─────────────────────────────────────────────────────
const SECTIONS: GitSection[] = [
  {
    id:'intro', num:'01', label:'What is Git?', icon:Sprout, color:'var(--green)',
    title:'What is Git?', khmer:'Git ជាអ្វី?', subtitle:'Version Control System',
    desc:'Git = Version Control System ─ ប្រព័ន្ធ track ការផ្លាស់ប្តូរ code ─ Save history ─ undo mistakes ─ collaborate with teams ─ industry standard tool used worldwide',
    realWorld:{
      company:'Wing Bank', role:'Junior Developer, 3-person team',
      icon:Building2, color:'var(--green)',
      story:'Sophea ចូលធ្វើការជា junior developer នៅ Wing Bank ថ្ងៃដំបូង។ Tech lead នាំនាងទៅ terminal ហើយ run git log — history ២ ឆ្នាំ, record រៀងរាល់ commit, ឈ្មោះ developer, និង message ច្បាស់លាស់។ "No zip files. No final_v3_REAL.php. We use Git for everything." Sophea យល់ភ្លាម — Git ជា difference រវាង amateur និង professional developer។',
      khmer:'Sophea ចូលធ្វើការ — tech lead run git log — history ២ ឆ្នាំ — គ្រប់ commit clean ហើយ traceable — professional workflow ពី day 1',
      cmds:[
        {cmd:'git log --oneline', why:'មើល history ២ ឆ្នាំ ក្នុង codebase ក្នុងពេល 2 វិនាទី'},
        {cmd:'git show a3f9c12',  why:'មើល exact code change ដែល developer ណាម្នាក់ commit នៅ snapshot នោះ'},
      ],
      result:'✓ Sophea ចាប់ផ្តើមយល់ភ្លាម — Git ជា foundation ដែល professional developer គ្រប់រូបត្រូវចេះ',
    },
    concept:{
      without:['project-final.zip','project-final-v2.zip','project-REAL-final.zip','project-final-real-final-v2.zip 😅'],
      with:['git log → clean history ✔','git diff → see changes ✔','git revert → undo safely ✔','git branch → parallel work ✔'],
    },
    objectives:[
      'យល់អំពី version control concept',
      'Track code changes បែបជា professional',
      'Collaborate ជាមួយ teammate តាមរយៈ Git',
      'ប្រើ Git + GitHub ជាមួយគ្នា',
    ],
    tip:'Git ≠ GitHub ─ Git ជា tool នៅលើ machine របស់អ្នក ─ GitHub ជា cloud platform ដែល host repo',
  },
  {
    id:'setup', num:'02', label:'Install & Setup', icon:Settings, color:'var(--blue)',
    title:'Install & Setup', khmer:'ការដំឡើង', subtitle:'Configure Git on your machine',
    desc:'ដំឡើង Git ម្តងគត់ក្នុង computer ─ Configure identity ─ Git ប្រើ name + email របស់អ្នក សម្រាប់រៀងរាល់ commit ─ បង្ហាញក្នុង history ជារៀងរហូត',
    realWorld:{
      company:'Smart Axiata Digital', role:'New hire onboarding — Day 1',
      icon:User, color:'var(--blue)',
      story:'Dara ចូលធ្វើការថ្ងៃដំបូង នៅ Smart Axiata។ IT team ប្រគល់ MacBook ហើយ Step 1 ក្នុង onboarding guide គឺ: "Run git config ដោយប្រើ company email." ហេតុអ្វី? ពីព្រោះរៀងរាល់ commit ដែល Dara push ទៅ GitHub នឹងបង្ហាញឈ្មោះ និង email របស់គាត់។ 6 ខែក្រោយ CTO review codebase — គាត់ឃើញច្បាស់ថា Dara សរសេរ feature អ្វី នៅ commit ណា។ Identity = accountability។',
      khmer:'Dara ចូលធ្វើការ — IT setup — run git config ដោយប្រើ company email — រៀងរាល់ commit នឹងបង្ហាញឈ្មោះ Dara — accountability ពី day 1',
      cmds:[
        {cmd:'git config --global user.name "Dara Sok"',         why:'ឈ្មោះរបស់អ្នកបង្ហាញ នៅ commit ទាំងអស់ជារៀងរហូត'},
        {cmd:'git config --global user.email "dara@smart.com.kh"', why:'Linked ទៅ GitHub identity — ប្រើ company email'},
      ],
      result:'✓ គ្រប់ commit បង្ហាញ "Dara Sok" — professional identity ក្នុង codebase ពី day one',
    },
    setupSteps:[
      {
        os:'windows',
        items:[
          {task:'Download Git for Windows', khmer:'ទាញយក Git installer ពី git-scm.com', note:'Download from https://git-scm.com/download/win'},
          {task:'Run the Installer (.exe)', khmer:'ចុចដំឡើង .exe file ដែលបានទាញយក', note:'Keep default options — make sure "Git from the command line" is selected'},
          {task:'Open CMD or PowerShell', khmer:'បើក terminal (CMD) ដើម្បីពិនិត្យ', cmd:'git --version'},
          {task:'Set up your Identity', khmer:'កំណត់ name និង email — required សម្រាប់រៀងរាល់ commit', note:'Required for every commit'},
          {task:'Configure Name', khmer:'កំណត់ display name', cmd:'git config --global user.name "Your Name"'},
          {task:'Configure Email', khmer:'កំណត់ email (ប្រើ email តែមួយជាមួយ GitHub)', cmd:'git config --global user.email "you@email.com"'}
        ]
      },
      {
        os:'mac',
        items:[
          {task:'Check if already installed', khmer:'ពិនិត្យថា git មាន install រួចហើយឬនៅ', cmd:'git --version'},
          {task:'Install via Xcode Tools', khmer:'ដំឡើងតាម Xcode Command Line Tools', note:'If git --version fails, macOS will ask you to install tools. Click "Install".'},
          {task:'Alternative: via Homebrew', khmer:'ឬដំឡើងតាម Homebrew package manager', cmd:'brew install git'},
          {task:'Configure Identity', khmer:'កំណត់ name និង email — same commands ដូច Windows', note:'Run the same config commands as Windows'}
        ]
      }
    ],
    commands:[
      {cmd:'git --version',                                         desc:'ពិនិត្យថា Git install ហើយ',  output:'git version 2.43.0'},
      {cmd:'git config --global user.name "Your Name"',            desc:'កំណត់ display name',      output:'(no output = success)'},
      {cmd:'git config --global user.email "you@email.com"',       desc:'កំណត់ email',             output:'(no output = success)'},
      {cmd:'git config --list',                                     desc:'Verify settings របស់អ្នក',       output:'user.name=Your Name\nuser.email=you@email.com'},
    ],
    tip:'ប្រើ email តែមួយជាមួយ GitHub account ─ Git links commits ទៅ GitHub profile របស់អ្នក',
  },
  {
    id:'workflow', num:'03', label:'Basic Workflow', icon:RefreshCcw, color:'var(--red)',
    title:'The Core Workflow', khmer:'ការប្រើប្រាស់មូលដ្ឋាន', subtitle:'init → add → commit',
    desc:'Git workflow = 3 states ─ Working Directory (edit) → Staging Area (select) → Repository (save) ─ យល់ concept នេះ = master Git',
    realWorld:{
      company:'BookMeBus', role:'Backend Developer — Laravel API',
      icon:ShoppingCart, color:'var(--red)',
      story:'Rathana ជា backend developer នៅ BookMeBus កំពុង build ticket booking API ជា Laravel។ ជំនួសឱ្យការ commit ម្តងនៅចុងបញ្ចប់ថ្ងៃ, Rathana commit រៀងរាល់ feature តូចៗ — seat selection endpoint, payment validation, booking confirmation — ម្នាក់ម្តង។ 6 ខែក្រោយ bug ១ ចេញ។ គាត់ run git log ហើយ trace exact commit ដែល introduce bug នោះ ក្នុង 90 វិនាទី។',
      khmer:'Rathana commit រៀងរាល់ feature — seat selection, payment validation, booking confirmation — 6 ខែក្រោយ bug ១ — git log — រក commit ក្នុង 90 វិនាទី',
      cmds:[
        {cmd:'git add app/Http/Controllers/BookingController.php', why:'Stage តែ file ដែល Rathana ទើបតែ finish — files ផ្សេងមិនប៉ះពាល់'},
        {cmd:'git commit -m "feat: add seat selection validation"', why:'1 feature = 1 commit = ងាយស្រួលរក bug ក្រោយ 6 ខែ'},
      ],
      result:'✓ Commits 847 ក្នុង 6 ខែ — គ្រប់ feature tracked, គ្រប់ bug traceable, គ្រប់ change reversible',
    },
    flow:[
      {step:'1',cmd:'git init',            label:'Initialize',desc:'Create .git/ folder',      color:'var(--green)'},
      {step:'2',cmd:'git add .',           label:'Stage',     desc:'Mark files for commit',    color:'var(--amber)'},
      {step:'3',cmd:'git commit -m "msg"', label:'Commit',    desc:'Save snapshot to history', color:'var(--blue)'},
    ],
    commands:[
      {cmd:'git init',                     desc:'ចាប់ផ្តើម Git repository ថ្មី',   output:'Initialized empty Git repository in .git/'},
      {cmd:'git add .',                    desc:'Stage files ដែល changed ទាំងអស់',       output:'(files added to staging)'},
      {cmd:'git add index.php',            desc:'Stage file ១ ជាក់លាក់',       output:'(file staged)'},
      {cmd:'git commit -m "First commit"', desc:'Save snapshot ជាមួយ message',           output:'[main (root-commit) a3f9c12] First commit\n 1 file changed, 1 insertion(+)'},
    ],
    tip:'សរសេរ commit message ច្បាស់លាស់ ─ "feat: add login page" មិនមែន "update stuff" ─ future self អ្នកនឹងអរគុណ',
  },
  {
    id:'inspect', num:'04', label:'Status & History', icon:Search, color:'var(--amber)',
    title:'Status & History', khmer:'ពិនិត្យ Code', subtitle:'log · status · diff',
    desc:'ពិនិត្យ repository state ─ git status = files ដែល changed ─ git log = full history ─ git diff = exact line changes ─ ប្រើ commands ទាំងនេះ ជារៀងរហូត',
    realWorld:{
      company:'Khmer 24 News Portal', role:'Full Stack Developer — React + Node',
      icon:Newspaper, color:'var(--amber)',
      story:'Visal ជា developer នៅ Khmer24.com កំពុង debug slow page load។ Performance ល្អ នៅសប្តាហ៍មុន។ គាត់ run git log --oneline ហើយ scan recent commits — ឃើញ commit មួយ: "perf: optimize images" merge 3 ថ្ងៃមុន, ត្រូវពេលដែល reports ចាប់ផ្តើមមក។ គាត់ run git diff ហើយឃើញ missing lazy-load attribute នៅ component ArticleList.jsx។ Bug រក ហើយ fix ក្នុង 8 នាទី។',
      khmer:'Visal debug slow page — run git log --oneline — ឃើញ commit 3 ថ្ងៃមុន — run git diff — ឃើញ bug ក្នុង component — fix ក្នុង 8 នាទី',
      cmds:[
        {cmd:'git log --oneline -10',                           why:'Scan commits ចុងក្រោយ 10 — រក commit គួរសង្ស័យ'},
        {cmd:'git diff HEAD~3 HEAD -- src/ArticleList.jsx',     why:'មើល exact changes នៅ file ១ ក្នុង commits ចុងក្រោយ 3'},
      ],
      result:'✓ Bug រក ក្នុង 8 នាទី — បើគ្មាន Git ការ investigate នេះ អាចចំណាយ hours នៃការ guess',
    },
    commands:[
      {cmd:'git status',        desc:'មើល files ដែល changed',   output:'On branch main\nChanges not staged for commit:\n  modified: index.php'},
      {cmd:'git log',           desc:'Full commit history',       output:'commit e4f8a21 (HEAD -> main)\nAuthor: Dara <dara@email.com>\nDate:   Mon Mar 21 2026\n\n    First commit'},
      {cmd:'git log --oneline', desc:'Compact one-line history', output:'e4f8a21 (HEAD -> main) First commit\na3f9c12 Add login form\nb1e8a24 Initial setup'},
      {cmd:'git diff',          desc:'មើល unstaged line changes', output:'diff --git a/index.php b/index.php\n-echo "Hello";\n+echo "Hello World";'},
    ],
    tip:'git log --oneline --graph --all ─ view ល្អបំផុត ដើម្បីឃើញ history ពេញ ជាមួយ branches visualized',
  },
  {
    id:'branching', num:'05', label:'Branching', icon:GitBranch, color:'var(--green)',
    title:'Branching', khmer:'ការបំបែក Branch', subtitle:'Work safely in parallel',
    desc:'Branch = pointer ទៅ commit ─ cheap to create ─ isolate features ─ មិន break main code ─ 1 feature = 1 branch ─ professional workflow',
    realWorld:{
      company:'Pi Pay Fintech', role:'3-developer team, live payment app',
      icon:Zap, color:'var(--green)',
      story:'Pi Pay មាន 50,000 transactions ក្នុងមួយថ្ងៃ។ Developers 3 នាក់ work ក្នុងពេលតែមួយ: Chanda build QR payment flow នៅ branch feature/qr-payment, Bopha fix currency rounding bug នៅ branch fix/currency, Makara add merchant analytics នៅ branch feat/analytics។ Branch main នៅ clean ជានិច្ច — deployable ជានិច្ច — នោះហើយជាអ្វីដែល customers ប្រើ។ Bopha \'s fix pass QA → merge → deploy ក្នុងពេល minutes — Chanda និង Makara មិនប៉ះពាល់អ្វី។',
      khmer:'Pi Pay — 50,000 transactions/day — developers 3 នាក់ — branches 3 — parallel work — main branch clean — deploy any time — zero conflict',
      cmds:[
        {cmd:'git checkout -b fix/currency-rounding',  why:'Bopha isolate fix — developers ផ្សេង continue work ធម្មតា'},
        {cmd:'git checkout -b feat/qr-payment-flow',   why:'Chanda build QR flow — main branch មិនប៉ះពាល់'},
        {cmd:'git checkout main && git merge fix/currency-rounding', why:'Bopha\'s fix ship — developers ផ្សេង unaffected ទាំងស្រុង'},
      ],
      result:'✓ Features 3 ship ក្នុងពេលតែមួយ — live app មិនដែល interrupt — zero cross-contamination រវាង developers',
    },
    commands:[
      {cmd:'git branch',                    desc:'List branches ទាំងអស់',            output:'* main\n  feature-login'},
      {cmd:'git branch feature-login',      desc:'Create branch ថ្មី',          output:'(branch created)'},
      {cmd:'git checkout feature-login',    desc:'Switch ទៅ branch នោះ',        output:"Switched to branch 'feature-login'"},
      {cmd:'git checkout -b feature-login', desc:'Create AND switch (shortcut)', output:"Switched to a new branch 'feature-login'"},
      {cmd:'git checkout main',             desc:'Switch ត្រឡប់ main',          output:"Switched to branch 'main'"},
      {cmd:'git merge feature-login',       desc:'Merge feature ចូល main',      output:'Updating a3f9c12..e4f8a21\nFast-forward\n login.php | 10 +++++'},
    ],
    tip:'1 feature = 1 branch ─ short-lived ─ merge ហើយ delete ─ មិនដែល work directly on main branch',
  },
  {
    id:'github', num:'06', label:'GitHub', icon:Globe, color:'var(--blue)',
    title:'Connect to GitHub', khmer:'ភ្ជាប់ GitHub', subtitle:'Push · Pull · Clone',
    desc:'GitHub = cloud hosting សម្រាប់ Git repositories ─ share code ─ collaborate ─ portfolio ─ open source ─ industry standard ─ free for students',
    realWorld:{
      company:'Remote Agency — Developer នៅ Phnom Penh, Client នៅ Singapore',
      role:'Freelance Developer',
      icon:Globe, color:'var(--blue)',
      story:'Kosal ជា freelance developer base Phnom Penh។ Client CTO គាត់ base Singapore — ពួកគេមិនដែល meet in person។ ប៉ុន្តែ រៀងរាល់ព្រឹក CTO check GitHub: មើល commits ដែល Kosal push overnight, review code, leave comments, approve pull requests។ GitHub = office ដែលពួកគេ share។ Kosal push → client ឃើញ progress real-time។ No emails. No zip files. No "let me send you the latest version."',
      khmer:'Kosal ធ្វើការ Phnom Penh — client Singapore — GitHub = office រួមគ្នា — push commits — client review pull requests — transparent ទាំងស្រុង',
      cmds:[
        {cmd:'git push -u origin main',  why:'First push — connect local repo ទៅ GitHub permanently'},
        {cmd:'git push',                 why:'Daily push — client ឃើញ progress real-time'},
        {cmd:'git pull',                 why:'Pull commits ដែល client feedback ឬ co-developer push'},
      ],
      result:'✓ Client review code រៀងរាល់ព្រឹក នៅ GitHub — no emails, no confusion, workflow transparent ទាំងស្រុង',
    },
    commands:[
      {cmd:'git remote add origin https://github.com/user/repo.git', desc:'Link local repo ទៅ GitHub',           output:'(remote added)'},
      {cmd:'git push -u origin main',                                 desc:'Upload code ទៅ GitHub (first time)', output:'Branch main set up to track remote\nTo https://github.com/user/repo.git\n * [new branch] main → main'},
      {cmd:'git push',                                                desc:'Push ក្រោយ -u set រួច',          output:'Everything up-to-date'},
      {cmd:'git pull',                                                desc:'Download changes ពី team',         output:'Already up to date.'},
      {cmd:'git clone https://github.com/user/repo.git',             desc:'Download project ពី GitHub',            output:"Cloning into 'repo'...\nDone."},
    ],
    tip:'git push -u origin main ម្តងគត់ ─ ក្រោយនោះ type git push ធម្មតា ─ flag -u set upstream tracking រួចហើយ',
  },
  {
    id:'undo', num:'07', label:'Undo Changes', icon:RotateCcw, color:'var(--red)',
    title:'Undo Changes', khmer:'លប់ចោល', subtitle:'Recover from mistakes safely',
    desc:'Git អាច undo បាន ─ unstage files ─ discard changes ─ undo commits ─ SAFE undo preserves history ─ ប្រើ git revert on public branches ជានិច្ច',
    realWorld:{
      company:'ABA Bank Mobile App', role:'Senior Developer — React Native',
      icon:Shield, color:'var(--red)',
      story:'Sreymom deploy login screen ថ្មី ទៅ ABA mobile app។ 30 នាទីក្រោយ support tickets ចូលពោរពេញ: "Cannot log in." គាត់ check git log ហើយឃើញ commit របស់គាត់ introduce broken JWT token check។ គាត់មិន panic។ គាត់ run git revert — command ១ — create new commit ដែល undo commit មុន។ Push ទៅ production។ App ដំណើរការ ក្នុង 4 នាទី។ Manager សួរ: "You fixed it so fast?" Sreymom ឆ្លើយ: "Git."',
      khmer:'Sreymom deploy login screen — 30 នាទី — users cannot login — git log — រក commit — git revert — fix ក្នុង 4 នាទី — professional',
      cmds:[
        {cmd:'git log --oneline -5',  why:'រក commit hash ដែល introduce bug ភ្លាមៗ'},
        {cmd:'git revert e4f8a21',    why:'Safe undo — create NEW commit, never rewrite history'},
        {cmd:'git push origin main',  why:'Fix deploy — users back online ភ្លាម'},
      ],
      result:'✓ Production outage resolve ក្នុង 4 នាទី — git revert ជា professional safety net',
    },
    commands:[
      {cmd:'git restore index.php',          desc:'Discard file changes (⚠️ permanent)', output:'(changes gone)'},
      {cmd:'git restore --staged index.php', desc:'Unstage file (safe)',               output:'(file unstaged, changes kept)'},
      {cmd:'git reset --soft HEAD~1',        desc:'Undo last commit, keep changes staged',      output:'(commit undone, files still staged)'},
      {cmd:'git reset --mixed HEAD~1',       desc:'Undo commit + unstage files',               output:'(commit undone, files in working dir)'},
      {cmd:'git revert HEAD',                desc:'Safe undo ─ create new commit',      output:"[main abc1234] Revert 'bad feature'\n 1 file changed"},
    ],
    tip:'git revert = SAFE (create new commit) ─ git reset = LOCAL only ─ never reset --hard on commits ដែល push រួច',
  },
  {
    id:'ignore', num:'08', label:'.gitignore', icon:EyeOff, color:'var(--amber)',
    title:'.gitignore', khmer:'ឯកសារ .gitignore', subtitle:'Exclude files from tracking',
    desc:'.gitignore = list of files ដែល Git skip ─ node_modules ─ .env (secrets!) ─ vendor/ ─ build files ─ create នៅ project root ─ add មុន first commit',
    realWorld:{
      company:'Startup — Food Delivery App Phnom Penh', role:'Full Stack Developer',
      icon:Package, color:'var(--amber)',
      story:'Piseth push food delivery app ទៅ GitHub សម្រាប់ client demo។ គាត់ forget add .env ក្នុង .gitignore។ AWS keys, database password, និង Stripe API secret ក្លាយជា public នៅ GitHub។ GitHub security bot detect ក្នុង 11 នាទី ហើយ send alert។ Piseth ត្រូវ rotate credentials ទាំងអស់, notify client, delay demo, ហើយ ចំណាយ 6 ម៉ោង clean Git history។ ".gitignore 3 lines អាច prevent ទាំងអស់នេះ" គាត់និយាយ។',
      khmer:'Piseth push .env ទៅ GitHub — AWS key, DB password, Stripe secret public — GitHub bot detect 11 នាទី — rotate all credentials — worst day — .gitignore 3 lines prevent ទាំងអស់',
      cmds:[
        {cmd:'echo ".env" >> .gitignore',    why:'ត្រូវ run ប្រការនេះ មុន git add ដំបូង'},
        {cmd:'git rm --cached .env',         why:'បើ track រួចហើយ — remove ពី Git index (keep file នៅ local)'},
        {cmd:'git commit -m "fix: remove .env from tracking"', why:'Secrets មិនគួរ live ក្នុង Git history ទោះ commit ចាស់'},
      ],
      result:'✓ .gitignore create មុន first commit = secrets safe = មិនដែល repeat worst day របស់ Piseth',
    },
    ignoreContent:`# Dependencies
node_modules/
vendor/

# Environment secrets
.env
.env.local

# Build outputs
/dist
/build

# OS files
.DS_Store
Thumbs.db

# Laravel specific
storage/
bootstrap/cache/
*.log`,
    tip:'.env ត្រូវ add ក្នុង .gitignore ─ never commit passwords ឬ API keys ─ add .gitignore មុន git add ដំបូង',
  },
  {
    id:'realworld', num:'09', label:'Real World', icon:Briefcase, color:'var(--purple)',
    title:'Real World Usage', khmer:'ការប្រើប្រាស់ជាក់ស្តែង',
    subtitle:'Industry scenarios · Jobs · Common mistakes',
    desc:'Git ប្រើប្រាស់ ជារៀងរាល់ថ្ងៃ នៅ tech companies ទាំងអស់ worldwide ─ startup ដល់ enterprise ─ solo developer ដល់ team 1000 នាក់ ─ workflows ទាំងនេះ ជាអ្វីដែលអ្នកនឹងជួប នៅ first job ក្នុង Cambodia ឬ Southeast Asia',
    realWorld:{
      company:'Future Employer — Tech Company ណាមួយ ក្នុង Cambodia',
      role:'Day 1 ជា Professional Developer',
      icon:Briefcase, color:'var(--purple)',
      story:'វា ជា first day ធ្វើការ។ Tech lead clone company repo, add អ្នក ជា collaborator, ហើយ explain: "Our workflow: branch off main, build your feature, open a Pull Request, get it reviewed, merge." ជារៀងរាល់ថ្ងៃ។ Branch → build → push → PR → review → merge → repeat។ នេះ មិនមែន theory — នេះ ជា practice ពីថ្ងៃដំបូង',
      khmer:'ថ្ងៃដំបូងធ្វើការ — tech lead clone repo — add you — workflow: branch + PR + review + merge — every day — not theory — practice',
      cmds:[
        {cmd:'git clone https://github.com/company/project.git', why:'Get codebase មក machine អ្នក'},
        {cmd:'git checkout -b feat/your-first-feature',          why:'Never work on main — branch ជានិច្ច'},
        {cmd:'git push origin feat/your-first-feature',          why:'Open Pull Request — code អ្នក reviewed មុន merge'},
      ],
      result:'✓ នេះ ជា workflow — Branch → build → push → PR → review → merge → repeat ជារៀងរាល់ថ្ងៃ',
    },
    scenarios:[
      {
        id:'ecommerce', company:'E-Commerce Startup', role:'Junior Backend Dev — Laravel',
        icon:ShoppingCart, color:'var(--green)',
        situation:'Team អ្នកកំពុង build Khmer online shop។ Lead dev ស្នើ ឱ្យ add discount coupon feature ដោយមិន break live checkout page ដែល customers កំពុងប្រើ right now។',
        khmer:'ក្រុមហ៊ុន build shop online — boss ចង់បាន coupon feature — checkout live រួចហើយ — ត្រូវ isolate work',
        steps:[
          {action:'Create feature branch ពី main',    cmd:'git checkout -b feature/coupon-system',            why:'Never touch main — main branch power live site'},
          {action:'Build coupon logic, commit often',     cmd:'git add . && git commit -m "feat: add coupon validation"', why:'Small commits = ងាយស្រួលរក bugs ក្រោយ'},
          {action:'Push branch សម្រាប់ code review',          cmd:'git push origin feature/coupon-system',            why:'Lead dev review code អ្នក នៅ GitHub Pull Request'},
          {action:'After approval, merge ចូល main',        cmd:'git checkout main && git merge feature/coupon-system', why:'Tested code land on live site ដោយ safe'},
          {action:'Delete feature branch',            cmd:'git branch -d feature/coupon-system',              why:'Keep repo clean — branch served its purpose'},
        ],
        outcome:'✓ Live site មិន break — coupon feature ship safely — git log បង្ហាញ contribution របស់អ្នក ច្បាស់លាស់',
      },
      {
        id:'newspaper', company:'Khmer News Website', role:'Frontend Dev — React + Next.js',
        icon:Newspaper, color:'var(--red)',
        situation:'Breaking news ត្រូវការ article template ថ្មី។ Colleague កំពុង redesign homepage ក្នុងពេលតែមួយ។ Changes ទាំង 2 ត្រូវ ship week នេះ ដោយ conflict គ្នា',
        khmer:'Developers 2 នាក់ work ក្នុង project តែមួយ — homepage redesign + article template — parallel work — no conflict',
        steps:[
          {action:'Create feature branch ផ្ទាល់ខ្លួន',   cmd:'git checkout -b feat/article-template',            why:'Parallel branches = developers 2 នាក់ មិន step on each other'},
          {action:'Colleague work នៅ branch ផ្ទាល់',   cmd:'git checkout -b feat/homepage-redesign',           why:'ទាំង 2 work independently ក្នុងពេលតែមួយ'},
          {action:'Finish ដំបូង — push and open Pull Request',  cmd:'git push origin feat/article-template',            why:'Open Pull Request on GitHub ដើម្បី team review'},
          {action:'Pull latest main មុន merge',      cmd:'git pull origin main',                             why:'Sync changes ដែល merge ពេលអ្នក work'},
          {action:'Clean merge — features 2 land',     cmd:'git merge main && git push',                       why:'No conflicts — history clean ហើយ traceable'},
        ],
        outcome:'✓ Developers 2 នាក់ ship features 2 ក្នុងពេលតែមួយ — zero conflicts — deadline met',
      },
      {
        id:'mobile', company:'App Agency — Phnom Penh', role:'Full Stack Dev — Node.js + React Native',
        icon:Smartphone, color:'var(--blue)',
        situation:'Bug crash app សម្រាប់ users នៅ Android 14។ Bug ចូល 3 commits មុន។ ត្រូវ find ហើយ fix ក្នុង production ក្នុង 30 នាទី',
        khmer:'App crash on Android — bug ចូល 3 commits មុន — ត្រូវ find ហើយ fix ក្នុង 30 នាទី',
        steps:[
          {action:'View recent commit history',           cmd:'git log --oneline -10',                            why:'រក commit ណា ដែល introduce bug'},
          {action:'Inspect exactly what changed',         cmd:'git show a3f9c12',                                 why:'មើល exact code changes ដែល cause crash'},
          {action:'Revert ONLY that commit safely',       cmd:'git revert a3f9c12',                               why:'Create undo commit — does NOT delete history'},
          {action:'Push fix ភ្លាម',             cmd:'git push origin main',                             why:'Fix go live — users stop crashing'},
          {action:'Tag hotfix release',              cmd:'git tag -a v1.2.1 -m "hotfix: android crash"',    why:'Version tagged សម្រាប់ QA and release tracking'},
        ],
        outcome:'✓ Bug រក ក្នុង 2 នាទី — revert safely — code ផ្សេង unaffected — users back online ក្នុង 10 នាទី',
      },
      {
        id:'solo', company:'Freelance / Solo Project', role:'Full Stack Developer',
        icon:Code2, color:'var(--amber)',
        situation:'អ្នក build portfolio website solo។ ចង់ try dark mode redesign ប៉ុន្តែ មិន ចង់ risk break version ដែល clients កំពុង view',
        khmer:'Solo developer — ចង់ try dark mode — មិន ចង់ break design ដែល work ហើយ — client កំពុង មើល',
        steps:[
          {action:'Create safe experiment branch',      cmd:'git checkout -b experiment/dark-mode',             why:'Sandbox — main branch untouched ទាំងស្រុង'},
          {action:'Make drastic changes ដោយ free',          cmd:'git add . && git commit -m "test: dark palette"',  why:'Experiment without fear — revert instant'},
          {action:'Compare experiment vs main',           cmd:'git diff main experiment/dark-mode',               why:'មើល exact differences រវាង versions ទាំង 2'},
          {action:'Like it? Merge ចូល main',               cmd:'git checkout main && git merge experiment/dark-mode', why:'Bring experiment ចូល production'},
          {action:'Hate it? Delete ដោយ zero damage',     cmd:'git branch -D experiment/dark-mode',               why:'Branch gone — main untouched ទាំងស្រុង'},
        ],
        outcome:'✓ Experiment ដោយ free — main branch safe ជានិច្ច — Git = professional undo button',
      },
    ],
    jobs:[
      {title:'Junior Web Developer',     salary:'$400–800/mo',  uses:['git clone projects','daily git pull','commit features','push to GitHub']},
      {title:'Mid-level Full Stack Dev', salary:'$800–1500/mo', uses:['branch strategy','code review via PR','resolve conflicts','CI/CD pipelines']},
      {title:'Senior / Lead Developer',  salary:'$1500–3000/mo',uses:['Git workflow design','release tagging','git bisect debugging','team mentoring']},
      {title:'DevOps / Infra Engineer',  salary:'$1200–2500/mo',uses:['Git + GitHub Actions','auto-deploy on push','secrets management','monorepo tools']},
    ],
    mistakes:[
      {bad:'git push origin main (directly)',       good:'feature branch → PR → merge to main',         why:'Push direct ទៅ main អាច break live site ដល់ users ទាំងអស់ ភ្លាមៗ'},
      {bad:'git commit -m "update"',                good:'git commit -m "feat: add JWT login endpoint"', why:'Vague messages ធ្វើ ឱ្យ debug impossible ក្រោយ 6 ខែ'},
      {bad:'Committed .env file with passwords',    good:'Add .env to .gitignore before first git add', why:'Secrets នៅ GitHub = security breach ភ្លាម, hard to undo'},
      {bad:'git reset --hard on a public branch',   good:'git revert HEAD — creates safe undo commit',  why:'Hard reset rewrite shared history ហើយ break teammates ទាំងអស់'},
      {bad:'One giant commit after 3 days of work', good:'Commit after each small working change',      why:'Huge commits impossible to review, bisect ឬ roll back'},
      {bad:'Working directly on main branch',       good:'Always: git checkout -b feature-name first',  why:'Bad merge ១ → team ទាំងអស់ blocked ហើយ live site break'},
    ],
    tip:'ក្នុង job interview ដំបូង ពួកគេ WILL ask អំពី Git workflow ─ ដឹងអំពី branch + PR + merge = stand out ពី applicants 90% ក្នុង Cambodia',
  },
  {
    id:'lab', num:'10', label:'Lab Exercise', icon:Beaker, color:'var(--green)',
    title:'Lab Exercise', khmer:'លំហាត់ Lab', subtitle:'Hands-on practice',
    desc:'Complete lab ក្នុង class ─ 60 នាទី ─ steps នីមួយៗ build on previous ─ សួរ បើ stuck ─ real workflow ដែលអ្នកនឹងប្រើ ជារៀងរាល់ថ្ងៃ',
    realWorld:{
      company:'First week ក្នុង tech company ណាក៏ដោយ',
      role:'Junior Developer Onboarding',
      icon:Layers, color:'var(--green)',
      story:'Junior developer រៀងរាល់រូប ក្នុង tech companies ក្នុង Cambodia ចូលកន្លងតាម sequence ដូចគ្នា first week: init repo, make commits, branch, merge, push។ Names ផ្លាស់ — Laravel, React, Node, Flutter — ប៉ុន្តែ Git workflow មិនដែល ផ្លាស់។ Developer ដែល ដឹង workflow នេះ ពី day one stand out ភ្លាម។ Developer ដែល ត្រូវ teach ក្រោយ ចាប់ផ្តើម behind ពីដំបូង',
      khmer:'Junior developers ទាំងអស់ — first week — same workflow — init, commit, branch, merge, push — ដឹងមុន = stand out ពី day one',
      cmds:[
        {cmd:'git init && git add . && git commit -m "init"', why:'Commands 3 ដំបូង នៃ project ទាំងអស់ ដែលអ្នកនឹង build ទៅអនាគត'},
        {cmd:'git checkout -b feat/first-feature',             why:'Tech lead expect ឱ្យ អ្នក ដឹង workflow នេះ ពី day one'},
      ],
      result:'✓ Complete lab នេះ = ចូល first job ជាមួយ daily workflow ដែល ដឹង រួចហើយ',
    },
    steps:[
      {n:1, task:'Create folder ហើយ init Git repo',            cmd:'mkdir my-project && cd my-project && git init'},
      {n:2, task:'Create index.php ជាមួយ echo statement',  cmd:'echo "<?php echo \'Hello Git!\'; ?>" > index.php'},
      {n:3, task:'Stage ហើយ commit file',                      cmd:'git add index.php && git commit -m "feat: add index page"'},
      {n:4, task:'Check history ជាមួយ git log',                     cmd:'git log --oneline'},
      {n:5, task:'Create feature branch',                        cmd:'git checkout -b feature-about'},
      {n:6, task:'Add about.php ហើយ commit on branch',         cmd:'echo "<?php echo \'About\'; ?>" > about.php && git add . && git commit -m "feat: add about page"'},
      {n:7, task:'Merge feature branch ចូល main',                 cmd:'git checkout main && git merge feature-about'},
      {n:8, task:'Push ទៅ GitHub repository',                 cmd:'git remote add origin <URL> && git push -u origin main'},
    ],
    assignment:{
      title:'Homework Assignment',
      items:[
        'Create Git repo សម្រាប់ PHP ឬ Laravel project របស់អ្នក',
        'Make commits យ៉ាងតិច 5 commits ដែល meaningful',
        'Create feature branch 1 ហើយ merge',
        'Add README.md ជាមួយ project description',
        'Push ទៅ GitHub — submit repo URL',
      ],
    },
  },
  {
    id:'plan', num:'11', label:'Class Plan', icon:Calendar, color:'var(--blue)',
    title:'Teaching Plan', khmer:'ផែនការបង្រៀន', subtitle:'Lecture → Demo → Lab → Assignment',
    desc:'Class structure ─ 2 ម៉ោង ─ theory ដំបូង ─ live demo ─ hands-on lab ─ real project integration ─ next lesson: Pull Requests & Collaboration',
    realWorld:{
      company:'Industry Standard — ការ work ក្នុង real developer team',
      role:'Git lifecycle ក្នុង real project',
      icon:Code2, color:'var(--blue)',
      story:'Structure ក្នុង class នេះ mirror real software teams: learn concept, watch someone do it live, then do it yourself។ Assignment មិនមែន homework ដើម្បីពិន្ទុ — វា ជា first real Git project របស់អ្នក។ Employers ក្នុង Cambodia ទាំងអស់ នឹងសួរ GitHub profile អ្នក។ បើ empty, you have no proof។ បើ repo ជាមួយ commits clean ហើយ branches, you have proof។ Start building GitHub profile ថ្ងៃនេះ',
      khmer:'Class structure = mirror real team — learn, watch, do — assignment = first real Git project — GitHub profile = proof of skill ដើម្បី employers',
      cmds:[
        {cmd:'git push origin main',               why:'Assignment public on GitHub — employers នឹង see it'},
        {cmd:'git log --oneline --graph --all',     why:'History ស្អាត ដែល show ថាអ្នក ដឹង Git properly'},
      ],
      result:'✓ ក្រោយ class នេះ GitHub profile ជាមួយ real commits — first professional proof of skill',
    },
    schedule:[
      {time:'0:00–0:30', type:'Lecture',   icon:BookOpen, items:['Git concept & why it matters','Workflow: init → add → commit','Core commands overview']},
      {time:'0:30–1:00', type:'Live Demo', icon:Monitor,  items:['Init real repo','Make commits & view log','Create branch & merge']},
      {time:'1:00–2:00', type:'Lab',       icon:Beaker,   items:['Students follow step-by-step','Create repo from scratch','Push to GitHub']},
    ],
    next:['Pull Requests (PR)','Conflict resolution','GitHub collaboration workflow','Git + Laravel API project','Git + React frontend'],
    integration:[
      {stack:'Git + Laravel API',   desc:'Version control backend'},
      {stack:'Git + React',         desc:'Track frontend changes'},
      {stack:'Git + Docker',        desc:'Containerized projects'},
      {stack:'Git + GitHub Actions',desc:'Automated deployment'},
    ],
  },
];

// ─── SYNTAX HIGHLIGHT ─────────────────────────────────────────
function hlCmd(line: string) {
  const parts = line.split(/(\b(?:git|echo|mkdir|cd)\b|"[^"]*"|'[^']*'|--\w[\w-]*|-\w|<[^>]+>)/g);
  return parts.map((p,i) => {
    if (!p) return null;
    if (['git','echo','mkdir','cd'].includes(p))  return <span key={i} style={{color:'var(--red)',fontWeight:700}}>{p}</span>;
    if (p.startsWith('"')||p.startsWith("'"))     return <span key={i} style={{color:'var(--green)'}}>{p}</span>;
    if (p.startsWith('--')||p.startsWith('-'))    return <span key={i} style={{color:'var(--blue)'}}>{p}</span>;
    if (p.startsWith('<'))                        return <span key={i} style={{color:'var(--amber)',fontStyle:'italic'}}>{p}</span>;
    return <span key={i} style={{color:'var(--ink)'}}>{p}</span>;
  });
}

// ─── REAL WORLD BOX ───────────────────────────────────────────
function RealWorldBox({rw}: {rw: RealWorldBox}) {
  const [open, setOpen] = useState(false);

  // Inline: wrap technical terms in monospace spans inside Khmer text
  function renderStory(text: string) {
    // Split on backtick-style terms encoded as `word`
    const parts = text.split(/(`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        const term = part.slice(1, -1);
        return (
          <code key={i} style={{
            fontFamily:'var(--mono)', fontSize:'0.88em',
            background:'rgba(0,0,0,0.08)', padding:'1px 5px',
            borderRadius:3, color:'inherit'
          }}>{term}</code>
        );
      }
      return <span key={i}>{part}</span>;
    });
  }

  return (
    <div style={{marginTop:20,border:`2px solid ${rw.color}`,overflow:'hidden',animation:'rwIn 0.4s ease'}}>
      <button onClick={()=>setOpen(v=>!v)}
        style={{width:'100%',display:'flex',alignItems:'center',gap:12,padding:'12px 16px',
          background:`${rw.color}12`,borderBottom:open?`1px solid ${rw.color}`:'none',
          textAlign:'left',transition:'background 0.2s'}}>
        <div style={{width:32,height:32,background:rw.color,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
          <rw.icon size={17} strokeWidth={2.5} color="#fff"/>
        </div>
        <div style={{flex:1}}>
          <div style={{fontFamily:'var(--mono)',fontSize:9,fontWeight:700,color:rw.color,letterSpacing:'0.12em',marginBottom:2}}>🏢 REAL WORLD EXAMPLE</div>
          <div style={{fontFamily:'var(--mono)',fontSize:11,fontWeight:700,color:'var(--ink)'}}>{rw.company}</div>
          <div style={{fontFamily:'var(--mono)',fontSize:10,color:'#8a7060'}}>{rw.role}</div>
        </div>
        <span style={{fontFamily:'var(--mono)',fontSize:9,color:rw.color,fontWeight:700,flexShrink:0}}>
          {open ? '▲ HIDE' : '▼ READ'}
        </span>
      </button>

      {open && (
        <div style={{animation:'fadeSlide 0.25s ease'}}>
          <div style={{padding:'14px 18px',borderBottom:`1px dashed ${rw.color}40`}}>
            <p style={{fontFamily:'var(--khmer)',fontSize:13.5,color:'var(--ink)',lineHeight:1.85,marginBottom:10}}>
              {renderStory(rw.story)}
            </p>
            <p style={{fontFamily:'var(--khmer)',fontSize:12,color:'#6a5840',fontStyle:'italic',lineHeight:1.65,
              borderTop:'1px dashed rgba(0,0,0,0.08)',paddingTop:8,marginTop:4}}>
              {rw.khmer}
            </p>
          </div>

          <div style={{background:'var(--ink)'}}>
            <div style={{padding:'6px 18px',fontFamily:'var(--mono)',fontSize:9,fontWeight:700,color:'#4a6070',letterSpacing:'0.12em',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
              COMMANDS USED IN THIS STORY
            </div>
            {rw.cmds.map((c,i)=>(
              <div key={i} className="rw-cmd" style={{padding:'8px 18px',borderBottom:i<rw.cmds.length-1?'1px dashed rgba(255,255,255,0.07)':'none',transition:'background 0.15s'}}>
                <pre style={{fontFamily:'var(--mono)',fontSize:11.5,color:'var(--amber)',margin:'0 0 4px',whiteSpace:'pre-wrap'}}>{hlCmd(c.cmd)}</pre>
                <div style={{fontFamily:'var(--khmer)',fontSize:11.5,color:'#5a8070'}}>↳ {c.why}</div>
              </div>
            ))}
          </div>

          <div style={{padding:'10px 18px',background:`${rw.color}0d`,borderTop:`1px solid ${rw.color}30`}}>
            <span style={{fontFamily:'var(--khmer)',fontSize:13,color:rw.color,fontWeight:700}}>{rw.result}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── COMMAND BLOCK ─────────────────────────────────────────────
function CmdBlock({cmd, desc, output}: Command) {
  const [showOut, setShowOut] = useState(false);
  return (
    <div className="cmd-line" onClick={()=>setShowOut(v=>!v)}
      style={{borderBottom:'1px dashed var(--rule)',padding:'10px 14px',cursor:'pointer',transition:'background 0.15s'}}>
      <div style={{display:'flex',alignItems:'flex-start',gap:12}}>
        <span style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--amber)',flexShrink:0,paddingTop:2}}>$</span>
        <div style={{flex:1}}>
          <pre style={{fontFamily:'var(--mono)',fontSize:12.5,fontWeight:700,margin:0,color:'var(--ink)',whiteSpace:'pre-wrap'}}>{hlCmd(cmd)}</pre>
          <div style={{fontFamily:'var(--khmer)',fontSize:12,color:'#6a5840',marginTop:3}}>↳ {desc}</div>
        </div>
        <span style={{fontFamily:'var(--mono)',fontSize:9,color:'var(--rule)',paddingTop:4}}>{showOut?'▲':'▼'}</span>
      </div>
      {showOut&&output&&(
        <div style={{marginTop:8,marginLeft:24,padding:'8px 12px',background:'var(--ink)',fontFamily:'var(--mono)',fontSize:11,color:'#a8d8a8',lineHeight:1.7,whiteSpace:'pre-wrap'}}>
          {output}
        </div>
      )}
    </div>
  );
}

// ─── SECTION RENDERERS ────────────────────────────────────────
function SectionIntro({s}: {s: GitSection}) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:20,animation:'fadeSlide 0.3s ease'}}>
      <div className="intro-grid">
        <div style={{border:'2px dashed var(--red)',padding:'16px 18px'}}>
          <div style={{fontFamily:'var(--mono)',fontSize:10,fontWeight:700,color:'var(--red)',letterSpacing:'0.1em',marginBottom:10}}>WITHOUT GIT</div>
          {s.concept?.without.map((l,i)=>(
            <div key={i} style={{fontFamily:'var(--mono)',fontSize:12,color:'#6a3828',padding:'4px 0',borderBottom:'1px dotted var(--rule)'}}>{l}</div>
          ))}
        </div>
        <div style={{border:'2px solid var(--green)',padding:'16px 18px',background:'rgba(42,107,58,0.04)'}}>
          <div style={{fontFamily:'var(--mono)',fontSize:10,fontWeight:700,color:'var(--green)',letterSpacing:'0.1em',marginBottom:10}}>WITH GIT</div>
          {s.concept?.with.map((l,i)=>(
            <div key={i} style={{fontFamily:'var(--mono)',fontSize:12,color:'var(--green)',padding:'4px 0',borderBottom:'1px dotted var(--rule)'}}>{l}</div>
          ))}
        </div>
      </div>
      <div style={{border:'1px solid var(--rule)',padding:'18px 20px'}}>
        <div style={{fontFamily:'var(--serif)',fontSize:13,fontWeight:700,color:'var(--blue)',letterSpacing:'0.04em',textTransform:'uppercase',marginBottom:12,display:'flex',alignItems:'center',gap:8}}>
          <CheckCircle2 size={16}/> Learning Objectives
        </div>
        {s.objectives?.map((o,i)=>(
          <div key={i} style={{display:'flex',gap:10,padding:'6px 0',borderBottom:'1px dotted rgba(0,0,0,0.06)',alignItems:'flex-start'}}>
            <span style={{color:'var(--green)',fontWeight:700,fontFamily:'var(--mono)',flexShrink:0}}>0{i+1}</span>
            <span style={{fontFamily:'var(--khmer)',fontSize:13,color:'var(--ink)',lineHeight:1.55}}>{o}</span>
          </div>
        ))}
      </div>
      {s.realWorld && <RealWorldBox rw={s.realWorld}/>}
    </div>
  );
}

function SectionSetup({s}: {s: GitSection}) {
  const [os, setOs] = useState<'windows' | 'mac'>('windows');
  const setup = s.setupSteps?.find(x => x.os === os);

  return (
    <div style={{display:'flex',flexDirection:'column',gap:16,animation:'fadeSlide 0.3s ease'}}>
      <div style={{display:'flex',border:'1px solid var(--rule)',overflow:'hidden',borderRadius:2}}>
        {(['windows', 'mac'] as const).map(type => (
          <button key={type} onClick={() => setOs(type)}
            style={{flex:1,padding:'12px',fontFamily:'var(--mono)',fontSize:11,fontWeight:700,
              background:os===type?'var(--ink)':'transparent',
              color:os===type?'var(--paper)':'var(--ink)',
              transition:'all 0.2s',
              borderRight:type==='windows'?'1px solid var(--rule)':'none'}}>
            {type === 'windows' ? '🪟 WINDOWS' : '🍎 MACOS'}
          </button>
        ))}
      </div>

      {setup && (
        <div style={{border:'1px solid var(--rule)',background:'var(--paper)'}}>
          <div style={{padding:'10px 16px',background:'var(--ink)',fontFamily:'var(--mono)',fontSize:10,fontWeight:700,color:'var(--paper)',letterSpacing:'0.08em',display:'flex',justifyContent:'space-between'}}>
            <span>STEP-BY-STEP {os.toUpperCase()} SETUP</span>
            <span style={{color:os==='windows'?'#60a5fa':'#a78bfa'}}>FOCUS: {os.toUpperCase()}</span>
          </div>
          {setup.items.map((it, i) => (
            <div key={i} style={{padding:'16px 20px',borderBottom:i<setup.items.length-1?'1px dashed var(--faint)':'none'}}>
              <div style={{display:'flex',gap:15,alignItems:'flex-start'}}>
                 <div style={{width:24,height:24,borderRadius:'50%',background:os==='windows'?'var(--blue)':'var(--purple)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontFamily:'var(--mono)',fontSize:11,fontWeight:700,flexShrink:0,marginTop:2}}>
                   {i+1}
                 </div>
                 <div style={{flex:1}}>
                   <div style={{fontFamily:'var(--mono)',fontSize:13,fontWeight:700,color:'var(--ink)'}}>{it.task}</div>
                   {it.khmer && <div style={{fontFamily:'var(--khmer)',fontSize:12.5,color:'#6a5840',marginTop:3}}>{it.khmer}</div>}
                   {it.note && (
                     <div style={{fontFamily:'var(--khmer)',fontSize:11.5,color:'var(--amber)',marginTop:8,background:'rgba(217,119,6,0.04)',padding:'6px 10px',borderLeft:'3px solid var(--amber)'}}>
                       <span style={{fontWeight:700,fontFamily:'var(--mono)'}}>NOTE:</span> {it.note}
                     </div>
                   )}
                   {it.cmd && (
                     <div style={{marginTop:10}}>
                       <pre style={{padding:'10px 14px',background:'var(--ink)',color:'var(--paper)',fontFamily:'var(--mono)',fontSize:12,borderRadius:4,overflowX:'auto',margin:0}}>
                         {hlCmd(it.cmd)}
                       </pre>
                     </div>
                   )}
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{border:'1px solid var(--rule)'}}>
        <div style={{padding:'8px 14px',fontFamily:'var(--mono)',fontSize:10,fontWeight:700,color:'var(--ink)',letterSpacing:'0.06em',borderBottom:'1px solid var(--rule)',background:'var(--warm)'}}>
           🔍 VERIFY — RUN AFTER INSTALL
        </div>
        {s.commands?.map((c,i)=><CmdBlock key={i} {...c}/>)}
      </div>

      {s.realWorld && <RealWorldBox rw={s.realWorld}/>}
    </div>
  );
}

function SectionWorkflow({s}: {s: GitSection}) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16,animation:'fadeSlide 0.3s ease'}}>
      <div className="workflow-container">
        {s.flow?.map((f: FlowItem, i: number)=>(
          <div key={i} style={{flex:1,padding:'14px 16px',borderRight:i<(s.flow?.length||0)-1?'1px solid var(--rule)':'none',background:i%2===0?'var(--paper)':'var(--cream)'}}>
            <div style={{fontFamily:'var(--mono)',fontSize:9,fontWeight:700,color:f.color,letterSpacing:'0.12em',marginBottom:4}}>STEP {f.step}</div>
            <div style={{fontFamily:'var(--mono)',fontSize:13,fontWeight:700,color:'var(--ink)',marginBottom:4}}>{f.cmd}</div>
            <div style={{fontFamily:'var(--mono)',fontSize:10,color:'var(--amber)'}}>{f.label}</div>
            <div style={{fontFamily:'var(--mono)',fontSize:10,color:'#8a7060',marginTop:2}}>{f.desc}</div>
          </div>
        ))}
      </div>
      <div style={{border:'1px solid var(--rule)'}}>
        {s.commands?.map((c,i)=><CmdBlock key={i} {...c}/>)}
      </div>
      {s.realWorld && <RealWorldBox rw={s.realWorld}/>}
    </div>
  );
}

function SectionIgnore({s}: {s: GitSection}) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16,animation:'fadeSlide 0.3s ease'}}>
      <div style={{border:'1px solid var(--rule)',overflow:'hidden'}}>
        <div style={{padding:'8px 14px',background:'var(--ink)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <span style={{fontFamily:'var(--mono)',fontSize:10,fontWeight:700,color:'#a8c8d8',letterSpacing:'0.08em'}}>.gitignore</span>
          <span style={{fontFamily:'var(--mono)',fontSize:9,color:'#4a6070'}}>project root</span>
        </div>
        <pre style={{padding:'16px',fontFamily:'var(--mono)',fontSize:12,lineHeight:1.85,color:'var(--ink)',background:'var(--paper)',margin:0}}>
          {s.ignoreContent?.split('\n').map((line,i)=>{
            const isComment = line.startsWith('#');
            return <div key={i} style={{color:isComment?'#8a7060':'var(--ink)',fontStyle:isComment?'italic':'normal'}}>{line||'\u00A0'}</div>;
          })}
        </pre>
      </div>
      <div style={{padding:'12px 16px',background:'rgba(139,98,0,0.06)',border:'1px solid var(--amber)',fontFamily:'var(--khmer)',fontSize:13,color:'var(--amber)',lineHeight:1.7}}>
        ⚠️ &nbsp;Add .gitignore BEFORE first git add — បើ commit files ហើយ ពិបាក remove ពី history
      </div>
      {s.realWorld && <RealWorldBox rw={s.realWorld}/>}
    </div>
  );
}

function SectionLab({s}: {s: GitSection}) {
  const [done, setDone] = useState<Record<number, boolean>>({});
  return (
    <div style={{display:'flex',flexDirection:'column',gap:20,animation:'fadeSlide 0.3s ease'}}>
      {s.realWorld && <RealWorldBox rw={s.realWorld}/>}
      <div style={{border:'1px solid var(--rule)'}}>
        <div style={{padding:'10px 16px',background:'var(--ink)',fontFamily:'var(--mono)',fontSize:10,fontWeight:700,color:'#a8d8a8',letterSpacing:'0.1em'}}>
          STEP-BY-STEP ─ Click to mark complete
        </div>
        {s.steps?.map((st,i)=>(
          <div key={i} onClick={()=>setDone(d=>({...d,[i]:!d[i]}))}
            style={{display:'flex',gap:14,padding:'12px 16px',borderBottom:'1px dashed var(--rule)',cursor:'pointer',background:done[i]?'rgba(42,107,58,0.05)':'transparent',transition:'background 0.2s'}}>
            <div style={{width:24,height:24,border:`2px solid ${done[i]?'var(--green)':'var(--rule)'}`,background:done[i]?'var(--green)':'transparent',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontFamily:'var(--mono)',fontSize:11,fontWeight:700,flexShrink:0,transition:'all 0.2s'}}>
              {done[i]?'✓':st.n}
            </div>
            <div style={{flex:1}}>
              <div style={{fontFamily:'var(--khmer)',fontSize:13,color:done[i]?'var(--green)':'var(--ink)',lineHeight:1.5,textDecoration:done[i]?'line-through':'none',marginBottom:4}}>{st.task}</div>
              <pre style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--amber)',margin:0,whiteSpace:'pre-wrap'}}>{hlCmd(st.cmd)}</pre>
            </div>
          </div>
        ))}
        <div style={{padding:'10px 16px',background:'var(--warm)',fontFamily:'var(--khmer)',fontSize:12,color:'var(--green)'}}>
          ✓ {Object.values(done).filter(Boolean).length} / {s.steps?.length||0} steps complete
        </div>
      </div>
      <div style={{border:'2px solid var(--ink)',padding:'20px 22px'}}>
        <div style={{fontFamily:'var(--serif)',fontStyle:'italic',fontSize:15,fontWeight:700,color:'var(--ink)',marginBottom:14,display:'flex',alignItems:'center',gap:10}}>
          <BookOpen size={18}/> {s.assignment?.title}
        </div>
        {s.assignment?.items.map((item,i)=>(
          <div key={i} style={{display:'flex',gap:10,padding:'7px 0',borderBottom:'1px dotted var(--rule)',alignItems:'flex-start'}}>
            <span style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--red)',flexShrink:0}}>→</span>
            <span style={{fontFamily:'var(--khmer)',fontSize:13,color:'var(--ink)',lineHeight:1.5}}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionPlan({s}: {s: GitSection}) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16,animation:'fadeSlide 0.3s ease'}}>
      {s.realWorld && <RealWorldBox rw={s.realWorld}/>}
      <div style={{display:'flex',flexDirection:'column',gap:1}}>
        {s.schedule?.map((block,i)=>(
          <div key={i} style={{display:'flex',border:'1px solid var(--rule)',overflow:'hidden'}}>
            <div style={{width:90,background:'var(--ink)',padding:'12px 10px',display:'flex',flexDirection:'column',justifyContent:'center'}}>
              <div style={{fontFamily:'var(--mono)',fontSize:9,color:'#4a6070'}}>TIME</div>
              <div style={{fontFamily:'var(--mono)',fontSize:10,color:'var(--paper)',fontWeight:700}}>{block.time}</div>
            </div>
            <div style={{flex:1,padding:'12px 16px',background:i%2===0?'var(--paper)':'var(--cream)'}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                <block.icon size={16} strokeWidth={2.5} style={{color:'var(--blue)'}}/>
                <span style={{fontFamily:'var(--mono)',fontSize:11,fontWeight:700,color:'var(--blue)',letterSpacing:'0.06em'}}>{block.type.toUpperCase()}</span>
              </div>
              <div style={{display:'flex',flexWrap:'wrap',gap:'4px 16px'}}>
                {block.items.map((item,j)=>(
                  <span key={j} style={{fontFamily:'var(--khmer)',fontSize:12,color:'var(--ink)'}}>• {item}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="plan-grid">
        <div style={{border:'1px solid var(--blue)',padding:'16px 18px'}}>
          <div style={{fontFamily:'var(--serif)',fontStyle:'italic',fontSize:13,fontWeight:700,color:'var(--blue)',marginBottom:10}}>🚀 Next Lesson</div>
          {s.next?.map((n,i)=>(
            <div key={i} style={{fontFamily:'var(--khmer)',fontSize:12,color:'var(--blue)',padding:'4px 0',borderBottom:'1px dotted rgba(0,0,0,0.06)'}}>→ {n}</div>
          ))}
        </div>
        <div style={{border:'1px solid var(--green)',padding:'16px 18px'}}>
          <div style={{fontFamily:'var(--serif)',fontStyle:'italic',fontSize:13,fontWeight:700,color:'var(--green)',marginBottom:10}}>🔥 Real-World Stack</div>
          {s.integration?.map((itg,i)=>(
            <div key={i} style={{padding:'4px 0',borderBottom:'1px dotted rgba(0,0,0,0.06)'}}>
              <div style={{fontFamily:'var(--mono)',fontSize:11,fontWeight:700,color:'var(--green)'}}>{itg.stack}</div>
              <div style={{fontFamily:'var(--khmer)',fontSize:11,color:'#6a8070'}}>{itg.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── REAL WORLD SECTION (09) ──────────────────────────────────
function SectionRealWorld({s}: {s: GitSection}) {
  const [activeScenario, setActiveScenario] = useState(0);
  const [activeTab, setActiveTab] = useState<'scenarios'|'jobs'|'mistakes'>('scenarios');
  const sc = s.scenarios?.[activeScenario];
  const tabLabels = ['🏢 Scenarios','💼 Jobs & Salary','⚠️ Common Mistakes'];

  return (
    <div style={{display:'flex',flexDirection:'column',gap:20,animation:'fadeSlide 0.3s ease'}}>
      {s.realWorld && <RealWorldBox rw={s.realWorld}/>}

      <div style={{display:'flex',border:'1px solid var(--rule)',overflow:'hidden'}}>
        {(['scenarios','jobs','mistakes'] as const).map((tab,ti)=>(
          <button key={tab} onClick={()=>setActiveTab(tab)}
            style={{flex:1,padding:'10px 6px',fontFamily:'var(--mono)',fontSize:11,fontWeight:700,
              background:activeTab===tab?'var(--ink)':'transparent',
              color:activeTab===tab?'var(--paper)':'var(--ink)',
              borderRight:ti<2?'1px solid var(--rule)':'none',
              transition:'all 0.2s'}}>
            {tabLabels[ti]}
          </button>
        ))}
      </div>

      {activeTab==='scenarios' && sc && (
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {s.scenarios?.map((sc2,i)=>(
              <button key={sc2.id} onClick={()=>setActiveScenario(i)}
                style={{display:'flex',alignItems:'center',gap:6,padding:'6px 14px',
                  border:`2px solid ${activeScenario===i?'var(--ink)':sc2.color}`,
                  background:activeScenario===i?'var(--ink)':'transparent',
                  color:activeScenario===i?'var(--paper)':sc2.color,
                  fontFamily:'var(--mono)',fontSize:10,fontWeight:700,transition:'all 0.2s'}}>
                <sc2.icon size={13} strokeWidth={2.5}/>{sc2.company.split(' ')[0]}
              </button>
            ))}
          </div>
          <div style={{border:`2px solid ${sc.color}`,overflow:'hidden'}}>
            <div style={{padding:'14px 18px',background:'rgba(0,0,0,0.015)',borderBottom:`1px solid ${sc.color}`}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
                <sc.icon size={20} strokeWidth={2.5} style={{color:sc.color}}/>
                <div>
                  <div style={{fontFamily:'var(--mono)',fontSize:11,fontWeight:700,color:sc.color,letterSpacing:'0.08em'}}>{sc.company}</div>
                  <div style={{fontFamily:'var(--mono)',fontSize:10,color:'#8a7060'}}>{sc.role}</div>
                </div>
              </div>
              <p style={{fontFamily:'var(--khmer)',fontSize:13,color:'var(--ink)',lineHeight:1.65,marginBottom:6}}>{sc.situation}</p>
              <p style={{fontFamily:'var(--khmer)',fontSize:12,color:'#6a5840',fontStyle:'italic'}}>{sc.khmer}</p>
            </div>
            {sc.steps.map((step,i)=>(
              <div key={i} style={{display:'flex',borderBottom:i<sc.steps.length-1?'1px dashed rgba(0,0,0,0.1)':'none'}}>
                <div style={{width:36,background:sc.color,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <span style={{fontFamily:'var(--mono)',fontSize:11,fontWeight:700,color:'#fff'}}>{i+1}</span>
                </div>
                <div style={{flex:1,padding:'10px 14px'}}>
                  <div style={{fontFamily:'var(--khmer)',fontSize:12.5,color:'var(--ink)',fontWeight:700,marginBottom:4}}>{step.action}</div>
                  <pre style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--amber)',margin:'0 0 4px',whiteSpace:'pre-wrap'}}>{hlCmd(step.cmd)}</pre>
                  <div style={{fontFamily:'var(--khmer)',fontSize:11.5,color:'#8a7060'}}>↳ {step.why}</div>
                </div>
              </div>
            ))}
            <div style={{padding:'12px 18px',background:'rgba(22,163,74,0.06)',borderTop:'1px solid rgba(22,163,74,0.2)'}}>
              <span style={{fontFamily:'var(--khmer)',fontSize:13,color:'var(--green)',fontWeight:700}}>{sc.outcome}</span>
            </div>
          </div>
        </div>
      )}

      {activeTab==='jobs' && (
        <div style={{border:'1px solid var(--rule)',overflow:'hidden'}}>
          <div style={{padding:'10px 16px',background:'var(--ink)',fontFamily:'var(--mono)',fontSize:10,fontWeight:700,color:'#a8d8a8',letterSpacing:'0.1em'}}>
            GIT IN THE CAMBODIA / SOUTHEAST ASIA JOB MARKET
          </div>
          {s.jobs?.map((job,i)=>(
            <div key={i} style={{display:'flex',borderBottom:i<(s.jobs?.length||0)-1?'1px dashed var(--rule)':'none',flexWrap:'wrap'}}>
              <div style={{width:220,padding:'14px 16px',borderRight:'1px solid var(--rule)',background:i%2===0?'var(--paper)':'var(--cream)',flexShrink:0}}>
                <div style={{fontFamily:'var(--mono)',fontSize:12,fontWeight:700,color:'var(--ink)',marginBottom:4}}>{job.title}</div>
                <div style={{fontFamily:'var(--mono)',fontSize:14,fontWeight:700,color:'var(--green)'}}>{job.salary}</div>
              </div>
              <div style={{flex:1,padding:'14px 16px',background:i%2===0?'var(--paper)':'var(--cream)',minWidth:180}}>
                <div style={{fontFamily:'var(--mono)',fontSize:9,fontWeight:700,color:'var(--blue)',letterSpacing:'0.1em',marginBottom:8}}>GIT SKILLS REQUIRED</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:'4px 8px'}}>
                  {job.uses.map((u,j)=>(
                    <span key={j} style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--ink)',padding:'2px 6px',background:'var(--faint)',border:'1px solid rgba(0,0,0,0.12)'}}>{u}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <div style={{padding:'12px 16px',background:'rgba(124,58,237,0.06)',borderTop:'1px solid rgba(124,58,237,0.25)'}}>
            <span style={{fontFamily:'var(--khmer)',fontSize:13,color:'var(--purple)',fontWeight:700}}>
              💜 Tech jobs ទាំងអស់ ក្នុង Cambodia ត្រូវការ Git — មិនមែន optional — វា ជា minimum baseline skill ពី day one
            </span>
          </div>
        </div>
      )}

      {activeTab==='mistakes' && (
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          <div style={{fontFamily:'var(--khmer)',fontSize:12,fontWeight:700,color:'var(--red)',letterSpacing:'0.04em',padding:'8px 14px',background:'rgba(192,57,43,0.06)',border:'1px solid var(--red)'}}>
            ⚠️ Mistakes ដែល beginners ទាំងអស់ធ្វើ — learn ទាំងនេះ មុន first job
          </div>
          {s.mistakes?.map((m,i)=>(
            <div key={i} style={{border:'1px solid var(--rule)',overflow:'hidden'}}>
              <div className="mistake-grid">
                <div style={{padding:'12px 14px',borderRight:'1px solid var(--rule)',background:'rgba(192,57,43,0.04)'}}>
                  <div style={{fontFamily:'var(--mono)',fontSize:9,fontWeight:700,color:'var(--red)',letterSpacing:'0.1em',marginBottom:6}}>❌ WRONG</div>
                  <div style={{fontFamily:'var(--mono)',fontSize:11.5,color:'var(--red)',lineHeight:1.55}}>{m.bad}</div>
                </div>
                <div style={{padding:'12px 14px',background:'rgba(22,163,74,0.04)'}}>
                  <div style={{fontFamily:'var(--mono)',fontSize:9,fontWeight:700,color:'var(--green)',letterSpacing:'0.1em',marginBottom:6}}>✓ CORRECT</div>
                  <div style={{fontFamily:'var(--mono)',fontSize:11.5,color:'var(--green)',lineHeight:1.55}}>{m.good}</div>
                </div>
              </div>
              <div style={{padding:'8px 14px',background:'var(--warm)',borderTop:'1px dashed var(--rule)'}}>
                <span style={{fontFamily:'var(--khmer)',fontSize:12.5,color:'#4a3828'}}>↳ {m.why}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function GenericSection({s}: {s: GitSection}) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16,animation:'fadeSlide 0.3s ease'}}>
      <div style={{border:'1px solid var(--rule)'}}>
        {s.commands?.map((c,i)=><CmdBlock key={i} {...c}/>)}
      </div>
      {s.realWorld && <RealWorldBox rw={s.realWorld}/>}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────
export default function GitLesson() {
  const [active, setActive] = useState('intro');
  const sect = SECTIONS.find(s=>s.id===active) || SECTIONS[0];

  const prevSect = useCallback(()=>{
    const i = SECTIONS.findIndex(s=>s.id===active);
    if (i>0) setActive(SECTIONS[i-1].id);
  },[active]);
  const nextSect = useCallback(()=>{
    const i = SECTIONS.findIndex(s=>s.id===active);
    if (i<SECTIONS.length-1) setActive(SECTIONS[i+1].id);
  },[active]);

  const idx = SECTIONS.findIndex(s=>s.id===active);

  function renderContent() {
    if (active==='intro')     return <SectionIntro s={sect}/>;
    if (active==='setup')     return <SectionSetup s={sect}/>;
    if (active==='workflow')  return <SectionWorkflow s={sect}/>;
    if (active==='ignore')    return <SectionIgnore s={sect}/>;
    if (active==='realworld') return <SectionRealWorld s={sect}/>;
    if (active==='lab')       return <SectionLab s={sect}/>;
    if (active==='plan')      return <SectionPlan s={sect}/>;
    return <GenericSection s={sect}/>;
  }

  const badgeBg = sect.color==='var(--green)'?'rgba(42,107,58,0.06)'
    :sect.color==='var(--blue)'?'rgba(30,61,107,0.06)'
    :sect.color==='var(--red)'?'rgba(184,50,40,0.06)'
    :sect.color==='var(--purple)'?'rgba(124,58,237,0.06)'
    :'rgba(139,98,0,0.06)';

  return (
    <div style={{minHeight:'100vh',background:'var(--paper)',color:'var(--ink)',position:'relative',zIndex:1}}>
      <style>{G}</style>

      <header style={{position:'sticky',top:0,zIndex:50,background:'var(--ink)',borderBottom:'3px solid var(--amber)'}}>
        <div className="header-content" style={{maxWidth:1000,margin:'0 auto',padding:'0 20px',display:'flex',alignItems:'center',justifyContent:'space-between',height:52}}>
          <div className="header-brand" style={{display:'flex',alignItems:'center',gap:12}}>
            <div style={{fontFamily:'var(--serif)',fontStyle:'italic',fontSize:22,fontWeight:700,color:'var(--paper)',letterSpacing:'-0.01em'}}>
              Git<span style={{color:'var(--amber)'}}>.</span>
            </div>
            <div className="hide-xs" style={{width:1,height:18,background:'rgba(255,255,255,0.15)'}}/>
            <div className="hide-xs" style={{fontFamily:'var(--mono)',fontSize:9,fontWeight:700,color:'#6a7a8a',letterSpacing:'0.12em',textTransform:'uppercase'}}>
              University Lesson ─ Beginner
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div className="hide-xs" style={{display:'flex',gap:3}}>
              {SECTIONS.map((s,i)=>(
                <div key={s.id} onClick={()=>setActive(s.id)} style={{width:i===idx?20:5,height:5,background:i===idx?'var(--amber)':i<idx?'#4a6070':'rgba(255,255,255,0.1)',transition:'all 0.3s',cursor:'pointer'}}/>
              ))}
            </div>
            <span style={{fontFamily:'var(--mono)',fontSize:9,color:'#4a6070'}}>{idx+1}/{SECTIONS.length}</span>
          </div>
          <div style={{display:'flex',gap:6}}>
            <button onClick={prevSect} disabled={idx===0} style={{fontFamily:'var(--mono)',fontSize:10,fontWeight:700,padding:'5px 12px',border:'1px solid rgba(255,255,255,0.15)',color:idx===0?'#2a3a4a':'var(--paper)',letterSpacing:'0.06em'}}>← PREV</button>
            <button onClick={nextSect} disabled={idx===SECTIONS.length-1} style={{fontFamily:'var(--mono)',fontSize:10,fontWeight:700,padding:'5px 12px',border:'1px solid var(--amber)',background:'var(--amber)',color:'var(--ink)',letterSpacing:'0.06em'}}>NEXT →</button>
          </div>
        </div>
      </header>

      <div className="main-layout">
        <aside className="sidebar">
          <div style={{padding:'16px 0'}}>
            <div className="hide-xs" style={{fontFamily:'var(--mono)',fontSize:8,fontWeight:700,letterSpacing:'0.18em',color:'var(--rule)',padding:'0 14px',marginBottom:12}}>SECTIONS</div>
            {SECTIONS.map((s)=>(
              <button key={s.id} className={`nav-tab ${active===s.id?'active':''}`} onClick={()=>setActive(s.id)}
                style={{width:'100%',textAlign:'left',padding:'9px 14px',display:'flex',gap:8,alignItems:'center',borderLeft:active===s.id?`3px solid ${s.color}`:'3px solid transparent',background:active===s.id?'var(--ink)':'transparent',transition:'all 0.15s'}}>
                <s.icon size={16} strokeWidth={2.5} style={{color:active===s.id?s.color:'#666'}}/>
                <div>
                  <div className="hide-xs" style={{fontFamily:'var(--mono)',fontSize:8,color:active===s.id?'rgba(255,255,255,0.4)':'var(--rule)',letterSpacing:'0.1em'}}>{s.num}</div>
                  <div style={{fontFamily:'var(--mono)',fontSize:11,fontWeight:600,color:active===s.id?'var(--paper)':'var(--ink)',lineHeight:1.3}}>{s.label}</div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <main className="content-area">
          <div style={{marginBottom:28,paddingBottom:20,borderBottom:'2px solid var(--ink)'}}>
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:16,flexWrap:'wrap'}}>
              <div>
                <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                  <div style={{fontFamily:'var(--mono)',fontSize:9,fontWeight:700,letterSpacing:'0.14em',color:'rgba(0,0,0,0.3)'}}>{sect.num}</div>
                  <div style={{fontFamily:'var(--mono)',fontSize:9,fontWeight:700,color:sect.color,letterSpacing:'0.1em',padding:'2px 8px',border:`1px solid ${sect.color}`,background:badgeBg}}>
                    {sect.subtitle}
                  </div>
                </div>
                <h1 style={{fontFamily:'var(--serif)',fontSize:'clamp(28px,4vw,44px)',fontWeight:900,lineHeight:1.1,color:'var(--ink)',letterSpacing:'-0.02em',display:'flex',alignItems:'center',gap:16}}>
                  <sect.icon size={44} strokeWidth={2.5} style={{color:sect.color}}/> {sect.title}
                </h1>
                <div style={{fontFamily:'var(--khmer)',fontSize:14,color:'var(--amber)',fontWeight:700,marginTop:6}}>{sect.khmer}</div>
              </div>
              <div style={{fontFamily:'var(--serif)',fontStyle:'italic',fontSize:11,color:'var(--rule)',border:'2px solid var(--rule)',padding:'6px 12px',transform:'rotate(-2deg)',animation:'stamp 0.4s ease',flexShrink:0}}>
                Lesson {sect.num}<br/>of {SECTIONS.length}
              </div>
            </div>
            <p style={{fontFamily:'var(--khmer)',fontSize:13.5,color:'#4a3c28',lineHeight:1.75,marginTop:14,maxWidth:600}}>{sect.desc}</p>
          </div>

          {renderContent()}

          {sect.tip&&(
            <div style={{marginTop:20,display:'flex',gap:12,padding:'14px 18px',background:'rgba(139,98,0,0.06)',border:'1px solid var(--amber)',borderLeft:'4px solid var(--amber)'}}>
              <Lightbulb size={24} style={{color:'var(--amber)',flexShrink:0}}/>
              <div>
                <div style={{fontFamily:'var(--mono)',fontSize:9,fontWeight:700,color:'var(--amber)',letterSpacing:'0.1em',marginBottom:5}}>PRO TIP</div>
                <p style={{fontFamily:'var(--khmer)',fontSize:13,color:'#6a4a00',lineHeight:1.65}}>{sect.tip}</p>
              </div>
            </div>
          )}

          <div style={{marginTop:32,paddingTop:20,borderTop:'1px dashed var(--rule)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <button onClick={prevSect} disabled={idx===0} style={{fontFamily:'var(--mono)',fontSize:10,fontWeight:700,padding:'8px 18px',border:'1px solid var(--rule)',color:idx===0?'var(--faint)':'var(--ink)',letterSpacing:'0.06em',background:'transparent'}}>← PREV</button>
            <div style={{display:'flex',gap:4}}>
              {SECTIONS.map((s,i)=>(
                <button key={s.id} onClick={()=>setActive(s.id)} style={{width:i===idx?18:6,height:6,padding:0,background:i===idx?'var(--ink)':i<idx?'var(--rule)':'var(--faint)',transition:'all 0.3s'}}/>
              ))}
            </div>
            <button onClick={nextSect} disabled={idx===SECTIONS.length-1} style={{fontFamily:'var(--mono)',fontSize:10,fontWeight:700,padding:'8px 18px',border:'2px solid var(--ink)',color:'var(--paper)',background:'var(--ink)',letterSpacing:'0.06em'}}>NEXT →</button>
          </div>
        </main>
      </div>
    </div>
  );
}