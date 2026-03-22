'use client';
import { useState, useCallback } from 'react';
import { 
  Sprout, Settings, RefreshCcw, Search, GitBranch, 
  Globe, RotateCcw, EyeOff, Beaker, Calendar, 
  BookOpen, Monitor, Lightbulb, CheckCircle2,
  LucideIcon 
} from 'lucide-react';

// ─── TYPES ────────────────────────────────────────────────────
interface Command {
  cmd: string;
  desc: string;
  output: string;
}

interface FlowItem {
  step: string;
  cmd: string;
  label: string;
  desc: string;
  color: string;
}

interface GitSection {
  id: string;
  num: string;
  label: string;
  icon: LucideIcon;
  color: string;
  title: string;
  khmer: string;
  subtitle: string;
  desc: string;
  concept?: {
    without: string[];
    with: string[];
  };
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
}

// ─── GLOBAL STYLES ────────────────────────────────────────────
const G = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Noto+Sans+Khmer:wght@400;700;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --ink:#000000;
  --paper:#ffffff;
  --cream:#f5f5f5;
  --warm:#f8f9fa;
  --rule:rgba(0,0,0,0.15);
  --faint:rgba(0,0,0,0.05);
  --ghost:rgba(0,0,0,0.02);
  --red:#c0392b;
  --green:#16a34a;
  --blue:#0284c7;
  --amber:#d97706;
  --serif:'Playfair Display',Georgia,serif;
  --mono:'Courier Prime',Courier,monospace;
  --khmer:'Noto Sans Khmer',sans-serif;
}
body{background:var(--paper);color:var(--ink);}
::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-thumb{background:var(--rule);}
button{cursor:pointer;border:none;outline:none;background:none;font-family:var(--mono);}

/* Dotted grid paper texture */
body::before{
  content:'';
  position:fixed;inset:0;pointer-events:none;z-index:0;
  background-image:radial-gradient(circle, #c8b89840 1px, transparent 1px);
  background-size:24px 24px;
}

@keyframes fadeSlide{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes stamp{0%{transform:rotate(-2deg) scale(1.2);opacity:0}100%{transform:rotate(-2deg) scale(1);opacity:1}}

.section-card{transition:border-color 0.2s,box-shadow 0.2s;}
.section-card:hover{box-shadow:4px 4px 0 var(--rule)!important;}
.cmd-line:hover{background:var(--faint)!important;}
.nav-tab:hover{background:var(--warm)!important;}
.nav-tab.active{background:var(--ink)!important;color:var(--paper)!important;}
`;

// ─── DATA ─────────────────────────────────────────────────────
const SECTIONS: GitSection[] = [
  {
    id:'intro',
    num:'01',
    label:'What is Git?',
    icon:Sprout,
    color:'var(--green)',
    title:'What is Git?',
    khmer:'Git ជាអ្វី?',
    subtitle:'Version Control System',
    desc:'Git = Version Control System ─ ប្រព័ន្ធ track ការផ្លាស់ប្តូរ code ─ Save history ─ undo mistakes ─ collaborate with teams ─ industry standard tool used worldwide',
    concept:{
      without:[
        'project-final.zip',
        'project-final-v2.zip',
        'project-REAL-final.zip',
        'project-final-real-final-v2.zip 😅',
      ],
      with:[
        'git log → clean history ✔',
        'git diff → see changes ✔',
        'git revert → undo safely ✔',
        'git branch → parallel work ✔',
      ],
    },
    objectives:[
      'Understand version control concepts',
      'Track code changes professionally',
      'Collaborate with teammates via Git',
      'Use Git + GitHub together',
    ],
    tip:'Git ≠ GitHub ─ Git is the tool on your machine ─ GitHub is the cloud platform that hosts your repos',
  },
  {
    id:'setup',
    num:'02',
    label:'Install & Setup',
    icon:Settings,
    color:'var(--blue)',
    title:'Install & Setup',
    khmer:'ការដំឡើង',
    subtitle:'Configure Git on your machine',
    desc:'ដំឡើង Git ម្តងក្នុងម្តង computer ─ Configure identity ─ Git uses your name + email for every commit ─ shows in history forever',
    commands:[
      {cmd:'git --version',             desc:'Check if Git is installed',                  output:'git version 2.43.0'},
      {cmd:'git config --global user.name "Your Name"', desc:'Set your display name',     output:'(no output = success)'},
      {cmd:'git config --global user.email "you@email.com"',desc:'Set your email',        output:'(no output = success)'},
      {cmd:'git config --list',         desc:'Verify your settings',                       output:'user.name=Your Name\nuser.email=you@email.com'},
    ],
    tip:'Use the same email as your GitHub account ─ Git links commits to your GitHub profile',
  },
  {
    id:'workflow',
    num:'03',
    label:'Basic Workflow',
    icon:RefreshCcw,
    color:'var(--red)',
    title:'The Core Workflow',
    khmer:'ការប្រើប្រាស់មូលដ្ឋាន',
    subtitle:'init → add → commit',
    desc:'Git workflow = 3 states ─ Working Directory (edit) → Staging Area (select) → Repository (save) ─ understand this = master Git',
    flow:[
      {step:'1',cmd:'git init',             label:'Initialize',  desc:'Create .git/ folder',         color:'var(--green)'},
      {step:'2',cmd:'git add .',            label:'Stage',       desc:'Mark files for commit',        color:'var(--amber)'},
      {step:'3',cmd:'git commit -m "msg"',  label:'Commit',      desc:'Save snapshot to history',     color:'var(--blue)'},
    ],
    commands:[
      {cmd:'git init',                    desc:'Start a new Git repository',          output:'Initialized empty Git repository in .git/'},
      {cmd:'git add .',                   desc:'Stage ALL changed files',              output:'(files added to staging)'},
      {cmd:'git add index.php',           desc:'Stage ONE specific file',             output:'(file staged)'},
      {cmd:'git commit -m "First commit"',desc:'Save with a message',                 output:'[main (root-commit) a3f9c12] First commit\n 1 file changed, 1 insertion(+)'},
    ],
    tip:'Write clear commit messages ─ "feat: add login page" not "update stuff" ─ your future self will thank you',
  },
  {
    id:'inspect',
    num:'04',
    label:'Status & History',
    icon:Search,
    color:'var(--amber)',
    title:'Status & History',
    khmer:'ពិនិត្យ Code',
    subtitle:'log · status · diff',
    desc:'ពិនិត្យ repository state ─ git status = what changed ─ git log = full history ─ git diff = exact line changes ─ use these constantly',
    commands:[
      {cmd:'git status',              desc:'See what files changed',         output:'On branch main\nChanges not staged for commit:\n  modified: index.php'},
      {cmd:'git log',                 desc:'Full commit history',             output:'commit e4f8a21 (HEAD -> main)\nAuthor: Dara <dara@email.com>\nDate:   Mon Mar 21 2026\n\n    First commit'},
      {cmd:'git log --oneline',       desc:'Compact one-line history',       output:'e4f8a21 (HEAD -> main) First commit\na3f9c12 Add login form\nb1e8a24 Initial setup'},
      {cmd:'git diff',                desc:'See unstaged line changes',       output:'diff --git a/index.php b/index.php\n-echo "Hello";\n+echo "Hello World";'},
    ],
    tip:'git log --oneline --graph --all ─ best view of your full history with branches visualized',
  },
  {
    id:'branching',
    num:'05',
    label:'Branching',
    icon:GitBranch,
    color:'var(--green)',
    title:'Branching',
    khmer:'ការបំបែក Branch',
    subtitle:'Work safely in parallel',
    desc:'Branch = pointer ទៅ commit ─ cheap to create ─ isolate features ─ never break main code ─ 1 feature = 1 branch ─ professional workflow',
    commands:[
      {cmd:'git branch',                      desc:'List all branches',                output:'* main\n  feature-login'},
      {cmd:'git branch feature-login',        desc:'Create a new branch',              output:'(branch created)'},
      {cmd:'git checkout feature-login',      desc:'Switch to that branch',            output:"Switched to branch 'feature-login'"},
      {cmd:'git checkout -b feature-login',   desc:'Create AND switch (shortcut)',     output:"Switched to a new branch 'feature-login'"},
      {cmd:'git checkout main',               desc:'Switch back to main',              output:"Switched to branch 'main'"},
      {cmd:'git merge feature-login',         desc:'Merge feature into main',          output:'Updating a3f9c12..e4f8a21\nFast-forward\n login.php | 10 +++++'},
    ],
    tip:'1 feature = 1 branch ─ short-lived ─ merge and delete ─ NEVER work directly on main',
  },
  {
    id:'github',
    num:'06',
    label:'GitHub',
    icon:Globe,
    color:'var(--blue)',
    title:'Connect to GitHub',
    khmer:'ភ្ជាប់ GitHub',
    subtitle:'Push · Pull · Clone',
    desc:'GitHub = cloud hosting for Git repos ─ share code ─ collaborate ─ portfolio ─ open source ─ industry standard ─ free for students',
    commands:[
      {cmd:'git remote add origin https://github.com/user/repo.git', desc:'Link to GitHub repo',         output:'(remote added)'},
      {cmd:'git push -u origin main',      desc:'Upload code to GitHub (first time)',  output:'Branch main set up to track remote\nTo https://github.com/user/repo.git\n * [new branch] main → main'},
      {cmd:'git push',                     desc:'Push after -u is set',               output:'Everything up-to-date'},
      {cmd:'git pull',                     desc:'Download team changes',              output:'Already up to date.'},
      {cmd:'git clone https://github.com/user/repo.git', desc:'Download a project',   output:"Cloning into 'repo'...\nDone."},
    ],
    tip:'git push -u origin main only once ─ after that just type git push ─ the -u sets the upstream tracking',
  },
  {
    id:'undo',
    num:'07',
    label:'Undo Changes',
    icon:RotateCcw,
    color:'var(--red)',
    title:'Undo Changes',
    khmer:'លប់ចោល',
    subtitle:'Recover from mistakes safely',
    desc:'Git អាច undo បាន ─ unstage files ─ discard file changes ─ undo commits ─ SAFE undo preserves history ─ always use revert on public branches',
    commands:[
      {cmd:'git restore index.php',        desc:'Discard file changes (⚠️ permanent)',  output:'(changes gone)'},
      {cmd:'git restore --staged index.php',desc:'Unstage a file (safe)',               output:'(file unstaged, changes kept)'},
      {cmd:'git reset --soft HEAD~1',      desc:'Undo last commit, keep changes',      output:'(commit undone, files still staged)'},
      {cmd:'git reset --mixed HEAD~1',     desc:'Undo commit + unstage',               output:'(commit undone, files in working dir)'},
      {cmd:'git revert HEAD',              desc:'Safe undo ─ creates new commit',      output:"[main abc1234] Revert 'bad feature'\n 1 file changed"},
    ],
    tip:'git revert = SAFE (creates new commit) ─ git reset = LOCAL only ─ never reset --hard on pushed commits',
  },
  {
    id:'ignore',
    num:'08',
    label:'.gitignore',
    icon:EyeOff,
    color:'var(--amber)',
    title:'.gitignore',
    khmer:'ឯកសារ .gitignore',
    subtitle:'Exclude files from tracking',
    desc:'.gitignore = list of files Git should ignore ─ node_modules ─ .env (secrets!) ─ vendor/ ─ build files ─ create at project root ─ add before first commit',
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
    tip:'.env MUST be in .gitignore ─ never commit passwords or API keys ─ add .gitignore before first git add',
  },
  {
    id:'lab',
    num:'09',
    label:'Lab Exercise',
    icon:Beaker,
    color:'var(--green)',
    title:'Lab Exercise',
    khmer:'លំហាត់ Lab',
    subtitle:'Hands-on practice',
    desc:'Complete this lab during class ─ 60 minutes ─ each step builds on previous ─ ask if stuck ─ real workflow you will use every day',
    steps:[
      {n:1, task:'Create a folder and init a Git repo',               cmd:'mkdir my-project && cd my-project && git init'},
      {n:2, task:'Create index.php with a simple echo statement',     cmd:'echo "<?php echo \'Hello Git!\'; ?>" > index.php'},
      {n:3, task:'Stage and commit the file',                         cmd:'git add index.php && git commit -m "feat: add index page"'},
      {n:4, task:'Check history with git log',                        cmd:'git log --oneline'},
      {n:5, task:'Create a feature branch',                           cmd:'git checkout -b feature-about'},
      {n:6, task:'Add about.php and commit on the branch',            cmd:'echo "<?php echo \'About\'; ?>" > about.php && git add . && git commit -m "feat: add about page"'},
      {n:7, task:'Merge feature branch into main',                    cmd:'git checkout main && git merge feature-about'},
      {n:8, task:'Push to your GitHub repository',                    cmd:'git remote add origin <URL> && git push -u origin main'},
    ],
    assignment:{
      title:'Homework Assignment',
      items:[
        'Create a Git repo for your PHP or Laravel project',
        'Make at least 5 meaningful commits',
        'Create 1 feature branch and merge it',
        'Add a README.md with project description',
        'Push to GitHub — submit your repo URL',
      ],
    },
  },
  {
    id:'plan',
    num:'10',
    label:'Class Plan',
    icon:Calendar,
    color:'var(--blue)',
    title:'Teaching Plan',
    khmer:'ផែនការបង្រៀន',
    subtitle:'Lecture → Demo → Lab → Assignment',
    desc:'Class structure ─ 2 hours total ─ theory first ─ live demo ─ hands-on lab ─ real project integration ─ next lesson: Pull Requests & Collaboration',
    schedule:[
      {time:'0:00–0:30', type:'Lecture',   icon:BookOpen, items:['Git concept & why it matters','Workflow: init → add → commit','Core commands overview']},
      {time:'0:30–1:00', type:'Live Demo', icon:Monitor, items:['Init a real repo','Make commits & view log','Create branch & merge']},
      {time:'1:00–2:00', type:'Lab',       icon:Beaker, items:['Students follow step-by-step','Create repo from scratch','Push to GitHub']},
    ],
    next:[
      'Pull Requests (PR)',
      'Conflict resolution',
      'GitHub collaboration workflow',
      'Git + Laravel API project',
      'Git + React frontend',
    ],
    integration:[
      {stack:'Git + Laravel API',  desc:'Version control your backend'},
      {stack:'Git + React',        desc:'Track frontend changes'},
      {stack:'Git + Docker',       desc:'Containerized projects'},
      {stack:'Git + GitHub Actions',desc:'Automated deployment'},
    ],
  },
];

// ─── SYNTAX HIGHLIGHT ─────────────────────────────────────────
function hlCmd(line: string) {
  const parts = line.split(/(\b(?:git|echo|mkdir|cd)\b|"[^"]*"|'[^']*'|--\w[\w-]*|-\w|<[^>]+>)/g);
  return parts.map((p,i) => {
    if (!p) return null;
    if (['git','echo','mkdir','cd'].includes(p))    return <span key={i} style={{color:'var(--red)',fontWeight:700}}>{p}</span>;
    if (p.startsWith('"')||p.startsWith("'"))       return <span key={i} style={{color:'var(--green)'}}>{p}</span>;
    if (p.startsWith('--')||p.startsWith('-'))      return <span key={i} style={{color:'var(--blue)'}}>{p}</span>;
    if (p.startsWith('<'))                          return <span key={i} style={{color:'var(--amber)',fontStyle:'italic'}}>{p}</span>;
    return <span key={i} style={{color:'var(--ink)'}}>{p}</span>;
  });
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
          <pre style={{fontFamily:'var(--mono)',fontSize:12.5,fontWeight:700,margin:0,color:'var(--ink)',whiteSpace:'pre-wrap'}}>
            {hlCmd(cmd)}
          </pre>
          <div style={{fontFamily:'var(--mono)',fontSize:11,color:'#6a5840',marginTop:3}}>↳ {desc}</div>
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
      {/* Without/With comparison */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
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
      {/* Objectives */}
      <div style={{border:'1px solid var(--rule)',padding:'18px 20px'}}>
        <div style={{fontFamily:'var(--serif)',fontSize:13,fontWeight:700,color:'var(--blue)',letterSpacing:'0.04em',textTransform:'uppercase',marginBottom:12,display:'flex',alignItems:'center',gap:8}}>
          <CheckCircle2 size={16} /> Learning Objectives
        </div>
        {s.objectives?.map((o,i)=>(
          <div key={i} style={{display:'flex',gap:10,padding:'6px 0',borderBottom:'1px dotted var(--faint)',alignItems:'flex-start'}}>
            <span style={{color:'var(--green)',fontWeight:700,fontFamily:'var(--mono)',flexShrink:0}}>0{i+1}</span>
            <span style={{fontFamily:'var(--khmer)',fontSize:13,color:'var(--ink)',lineHeight:1.55}}>{o}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionSetup({s}: {s: GitSection}) {
  return (
    <div style={{border:'1px solid var(--rule)',animation:'fadeSlide 0.3s ease'}}>
      {s.commands?.map((c,i)=><CmdBlock key={i} {...c}/>)}
    </div>
  );
}

function SectionWorkflow({s}: {s: GitSection}) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16,animation:'fadeSlide 0.3s ease'}}>
      {/* Flow diagram */}
      <div style={{display:'flex',alignItems:'center',gap:0,border:'1px solid var(--rule)',overflow:'hidden'}}>
        {s.flow?.map((f: FlowItem, i: number)=>(
          <div key={i} style={{flex:1,padding:'14px 16px',borderRight:i<(s.flow?.length || 0)-1?'1px solid var(--rule)':'none',background:i%2===0?'var(--paper)':'var(--cream)'}}>
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
            return (
              <div key={i} style={{color:isComment?'#8a7060':'var(--ink)',fontStyle:isComment?'italic':'normal'}}>
                {line||'\u00A0'}
              </div>
            );
          })}
        </pre>
      </div>
      <div style={{padding:'12px 16px',background:'rgba(139,98,0,0.06)',border:'1px solid var(--amber)',fontFamily:'var(--mono)',fontSize:12,color:'var(--amber)',lineHeight:1.7}}>
        ⚠️ &nbsp;Add .gitignore BEFORE your first git add ─ once committed, files are hard to remove from history
      </div>
    </div>
  );
}

function SectionLab({s}: {s: GitSection}) {
  const [done, setDone] = useState<Record<number, boolean>>({});
  return (
    <div style={{display:'flex',flexDirection:'column',gap:20,animation:'fadeSlide 0.3s ease'}}>
      {/* Steps */}
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
        <div style={{padding:'10px 16px',background:'var(--warm)',fontFamily:'var(--mono)',fontSize:11,color:'var(--green)'}}>
          ✓ {Object.values(done).filter(Boolean).length} / {s.steps?.length || 0} steps complete
        </div>
      </div>
      {/* Assignment */}
      <div style={{border:'2px solid var(--ink)',padding:'20px 22px'}}>
        <div style={{fontFamily:'var(--serif)',fontStyle:'italic',fontSize:15,fontWeight:700,color:'var(--ink)',marginBottom:14,display:'flex',alignItems:'center',gap:10}}>
          <BookOpen size={18} /> {s.assignment?.title}
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
      {/* Schedule */}
      <div style={{display:'flex',flexDirection:'column',gap:1}}>
        {s.schedule?.map((block,i)=>(
          <div key={i} style={{display:'flex',gap:0,border:'1px solid var(--rule)',overflow:'hidden'}}>
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
      {/* Next lesson + integration */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        <div style={{border:'1px solid var(--blue)',padding:'16px 18px'}}>
          <div style={{fontFamily:'var(--serif)',fontStyle:'italic',fontSize:13,fontWeight:700,color:'var(--blue)',marginBottom:10}}>🚀 Next Lesson</div>
          {s.next?.map((n,i)=>(
            <div key={i} style={{fontFamily:'var(--khmer)',fontSize:12,color:'var(--blue)',padding:'4px 0',borderBottom:'1px dotted var(--faint)'}}>→ {n}</div>
          ))}
        </div>
        <div style={{border:'1px solid var(--green)',padding:'16px 18px'}}>
          <div style={{fontFamily:'var(--serif)',fontStyle:'italic',fontSize:13,fontWeight:700,color:'var(--green)',marginBottom:10}}>🔥 Real-World Stack</div>
          {s.integration?.map((itg,i)=>(
            <div key={i} style={{padding:'4px 0',borderBottom:'1px dotted var(--faint)'}}>
              <div style={{fontFamily:'var(--mono)',fontSize:11,fontWeight:700,color:'var(--green)'}}>{itg.stack}</div>
              <div style={{fontFamily:'var(--mono)',fontSize:10,color:'#6a8070'}}>{itg.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GenericSection({s}: {s: GitSection}) {
  return (
    <div style={{border:'1px solid var(--rule)',animation:'fadeSlide 0.3s ease'}}>
      {s.commands?.map((c,i)=><CmdBlock key={i} {...c}/>)}
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
    if (active==='intro')    return <SectionIntro s={sect}/>;
    if (active==='setup')    return <SectionSetup s={sect}/>;
    if (active==='workflow') return <SectionWorkflow s={sect}/>;
    if (active==='ignore')   return <SectionIgnore s={sect}/>;
    if (active==='lab')      return <SectionLab s={sect}/>;
    if (active==='plan')     return <SectionPlan s={sect}/>;
    return <GenericSection s={sect}/>;
  }

  return (
    <div style={{minHeight:'100vh',background:'var(--paper)',color:'var(--ink)',position:'relative',zIndex:1}}>
      <style>{G}</style>

      {/* ── TOPBAR ── */}
      <header style={{position:'sticky',top:0,zIndex:50,background:'var(--ink)',borderBottom:'3px solid var(--amber)'}}>
        <div style={{maxWidth:1000,margin:'0 auto',padding:'0 20px',display:'flex',alignItems:'center',justifyContent:'space-between',height:52}}>
          {/* Brand */}
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div style={{fontFamily:'var(--serif)',fontStyle:'italic',fontSize:22,fontWeight:700,color:'var(--paper)',letterSpacing:'-0.01em'}}>
              Git<span style={{color:'var(--amber)'}}>.</span>
            </div>
            <div style={{width:1,height:18,background:'rgba(255,255,255,0.15)'}}/>
            <div style={{fontFamily:'var(--mono)',fontSize:9,fontWeight:700,color:'#6a7a8a',letterSpacing:'0.12em',textTransform:'uppercase'}}>
              University Lesson ─ Beginner
            </div>
          </div>
          {/* Progress */}
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{display:'flex',gap:3}}>
              {SECTIONS.map((s,i)=>(
                <div key={s.id} onClick={()=>setActive(s.id)} style={{width:i===idx?20:5,height:5,background:i===idx?'var(--amber)':i<idx?'#4a6070':'rgba(255,255,255,0.1)',transition:'all 0.3s',cursor:'pointer'}}/>
              ))}
            </div>
            <span style={{fontFamily:'var(--mono)',fontSize:9,color:'#4a6070'}}>{idx+1}/{SECTIONS.length}</span>
          </div>
          {/* Nav */}
          <div style={{display:'flex',gap:6}}>
            <button onClick={prevSect} disabled={idx===0} style={{fontFamily:'var(--mono)',fontSize:10,fontWeight:700,padding:'5px 12px',border:'1px solid rgba(255,255,255,0.15)',color:idx===0?'#2a3a4a':'var(--paper)',letterSpacing:'0.06em'}}>← PREV</button>
            <button onClick={nextSect} disabled={idx===SECTIONS.length-1} style={{fontFamily:'var(--mono)',fontSize:10,fontWeight:700,padding:'5px 12px',border:'1px solid var(--amber)',background:'var(--amber)',color:'var(--ink)',letterSpacing:'0.06em'}}>NEXT →</button>
          </div>
        </div>
      </header>

      <div style={{maxWidth:1000,margin:'0 auto',display:'flex',position:'relative',zIndex:1}}>

        {/* ── SIDEBAR ── */}
        <aside style={{width:190,flexShrink:0,borderRight:'1px solid var(--rule)',minHeight:'calc(100vh - 52px)',position:'sticky',top:52,height:'calc(100vh - 52px)',overflowY:'auto',background:'var(--paper)'}}>
          <div style={{padding:'16px 0'}}>
            <div style={{fontFamily:'var(--mono)',fontSize:8,fontWeight:700,letterSpacing:'0.18em',color:'var(--rule)',padding:'0 14px',marginBottom:12}}>SECTIONS</div>
            {SECTIONS.map((s,i)=>(
              <button key={s.id} className={`nav-tab ${active===s.id?'active':''}`} onClick={()=>setActive(s.id)}
                style={{width:'100%',textAlign:'left',padding:'9px 14px',display:'flex',gap:8,alignItems:'center',borderLeft:active===s.id?`3px solid ${s.color}`:'3px solid transparent',background:active===s.id?'var(--ink)':'transparent',transition:'all 0.15s'}}>
                <s.icon size={16} strokeWidth={2.5} style={{color:active===s.id?s.color:'#666'}} />
                <div>
                  <div style={{fontFamily:'var(--mono)',fontSize:8,color:active===s.id?'rgba(255,255,255,0.4)':'var(--rule)',letterSpacing:'0.1em'}}>{s.num}</div>
                  <div style={{fontFamily:'var(--mono)',fontSize:11,fontWeight:600,color:active===s.id?'var(--paper)':'var(--ink)',lineHeight:1.3}}>{s.label}</div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main style={{flex:1,padding:'32px 28px',minWidth:0}}>

          {/* Section header */}
          <div style={{marginBottom:28,paddingBottom:20,borderBottom:'2px solid var(--ink)'}}>
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:16,flexWrap:'wrap'}}>
              <div>
                <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                  <div style={{fontFamily:'var(--mono)',fontSize:9,fontWeight:700,letterSpacing:'0.14em',color:'rgba(0,0,0,0.3)'}}>{sect.num}</div>
                  <div style={{fontFamily:'var(--mono)',fontSize:9,fontWeight:700,color:sect.color,letterSpacing:'0.1em',padding:'2px 8px',border:`1px solid ${sect.color}`,background:sect.color==='var(--green)'?'rgba(42,107,58,0.06)':sect.color==='var(--blue)'?'rgba(30,61,107,0.06)':sect.color==='var(--red)'?'rgba(184,50,40,0.06)':'rgba(139,98,0,0.06)'}}>
                    {sect.subtitle}
                  </div>
                </div>
                <h1 style={{fontFamily:'var(--serif)',fontSize:'clamp(28px,4vw,44px)',fontWeight:900,lineHeight:1.1,color:'var(--ink)',letterSpacing:'-0.02em',display:'flex',alignItems:'center',gap:16}}>
                  <sect.icon size={44} strokeWidth={2.5} style={{color:sect.color}} /> {sect.title}
                </h1>
                <div style={{fontFamily:'var(--khmer)',fontSize:14,color:'var(--amber)',fontWeight:700,marginTop:6}}>{sect.khmer}</div>
              </div>
              {/* Stamp */}
              <div style={{fontFamily:'var(--serif)',fontStyle:'italic',fontSize:11,color:'var(--rule)',border:'2px solid var(--rule)',padding:'6px 12px',transform:'rotate(-2deg)',animation:'stamp 0.4s ease',flexShrink:0}}>
                Lesson {sect.num}<br/>of {SECTIONS.length}
              </div>
            </div>
            <p style={{fontFamily:'var(--khmer)',fontSize:13.5,color:'#4a3c28',lineHeight:1.75,marginTop:14,maxWidth:600}}>{sect.desc}</p>
          </div>

          {/* Section body */}
          {renderContent()}

          {/* Pro tip */}
          {sect.tip&&(
            <div style={{marginTop:20,display:'flex',gap:12,padding:'14px 18px',background:'rgba(139,98,0,0.06)',border:'1px solid var(--amber)',borderLeft:'4px solid var(--amber)'}}>
              <Lightbulb size={24} style={{color:'var(--amber)',flexShrink:0}} />
              <div>
                <div style={{fontFamily:'var(--mono)',fontSize:9,fontWeight:700,color:'var(--amber)',letterSpacing:'0.1em',marginBottom:5}}>PRO TIP</div>
                <p style={{fontFamily:'var(--khmer)',fontSize:13,color:'#6a4a00',lineHeight:1.65}}>{sect.tip}</p>
              </div>
            </div>
          )}

          {/* Bottom nav */}
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