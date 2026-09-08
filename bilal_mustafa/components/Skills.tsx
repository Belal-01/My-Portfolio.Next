'use client';

import { useState } from 'react';
import { Code2, Cpu, ShieldCheck, Wrench } from 'lucide-react';

interface Skill {
  name: string;
  level: 'Intermediate' | 'Proficient' | 'Advanced';
}

interface SkillCategory {
  id: string;
  title: string;
  icon: typeof Code2;
  description: string;
  textAccent: string;
  borderAccent: string;
  barAccent: string;
  skills: Skill[];
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend engineering',
    icon: Code2,
    description: 'Building responsive, high-performance interfaces with modern frameworks.',
    textAccent: 'text-cyan-400',
    borderAccent: 'border-l-cyan-400',
    barAccent: 'bg-cyan-400',
    skills: [
      { name: 'React 19', level: 'Advanced' },
      { name: 'Next.js 16 (App Router)', level: 'Advanced' },
      { name: 'Astro', level: 'Advanced' },
      { name: 'TypeScript', level: 'Advanced' },
      { name: 'JavaScript (ES6+)', level: 'Advanced' },
      { name: 'Tailwind CSS v4', level: 'Advanced' },
      { name: 'Zustand', level: 'Advanced' },
      { name: 'Redux Toolkit & Zustand', level: 'Proficient' },
      { name: 'HTML5 & modern CSS3', level: 'Advanced' },
      { name: 'Responsive UI/UX design', level: 'Advanced' },
    ],
  },
  {
    id: 'devops',
    title: 'DevSecOps & cloud',
    icon: Cpu,
    description: 'Automating deployment pipelines, containers, and cloud infrastructure.',
    textAccent: 'text-purple-400',
    borderAccent: 'border-l-purple-400',
    barAccent: 'bg-purple-400',
    skills: [
      { name: 'Docker containers', level: 'Proficient' },
      // { name: 'Kubernetes', level: 'Intermediate' },
      { name: 'GitHub Actions (CI/CD)', level: 'Proficient' },
      // { name: 'Terraform (IaC)', level: 'Intermediate' },
      { name: 'Supabase / PostgreSQL', level: 'Proficient' },
      { name: 'Linux system admin', level: 'Proficient' },
    ],
  },
  // {
  //   id: 'security',
  //   title: 'Security & compliance',
  //   icon: ShieldCheck,
  //   description: 'Zero-trust patterns, vulnerability audits, and database security.',
  //   textAccent: 'text-emerald-400',
  //   borderAccent: 'border-l-emerald-400',
  //   barAccent: 'bg-emerald-400',
  //   skills: [
  //     { name: 'Trivy container security', level: 'Proficient' },
  //     { name: 'SAST & DAST code scans', level: 'Proficient' },
  //     { name: 'Supabase RLS policies', level: 'Advanced' },
  //     { name: 'Secrets management', level: 'Proficient' },
  //     { name: 'CSP & XSS prevention', level: 'Advanced' },
  //   ],
  // },
  {
    id: 'tools',
    title: 'Tools & workflow',
    icon: Wrench,
    description: 'Developer tooling, version control, and rapid prototyping.',
    textAccent: 'text-indigo-400',
    borderAccent: 'border-l-indigo-400',
    barAccent: 'bg-indigo-400',
    skills: [
      { name: 'Git & GitHub workflow', level: 'Advanced' },
      { name: 'Vite & Turbopack', level: 'Proficient' },
      { name: 'REST API integration', level: 'Advanced' },
      { name: 'Code reviews & standards', level: 'Advanced' },
      { name: 'Performance optimization', level: 'Advanced' },
    ],
  },
];

const LEVELS: Skill['level'][] = ['Intermediate', 'Proficient', 'Advanced'];

function LevelBars({ level, barAccent }: { level: Skill['level']; barAccent: string }) {
  const filled = LEVELS.indexOf(level) + 1;
  return (
    <span className="flex items-center gap-1" aria-label={`Proficiency: ${level}`}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`h-1.5 w-5 rounded-sm ${i < filled ? barAccent : 'bg-white/10'}`}
        />
      ))}
    </span>
  );
}

export default function Skills() {
  const [activeId, setActiveId] = useState(SKILL_CATEGORIES[0].id);
  const active = SKILL_CATEGORIES.find((c) => c.id === activeId)!;
  const ActiveIcon = active.icon;

  return (
    <section id="skills" className="py-20 flex flex-col items-center relative">
      <style>{`
        @keyframes skill-panel-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>

      <div className="w-full max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Section Badge */}
        <div className="badge-available px-4 py-1.5 rounded-full inline-flex items-center gap-2 text-xs font-medium text-slate-200 shadow-md mb-6 backdrop-blur-md bg-slate-900/60 border border-slate-700/50">
          <Cpu className="w-3.5 h-3.5 text-purple-400" />
          <span>Technical Stack</span>
        </div>

        {/* Section Heading */}
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
          Skills &amp; <span className="gradient-text-purple-cyan font-extrabold">Expertise</span>
        </h2>

        {/* Section Subtitle */}
        <p className="max-w-xl text-slate-400 text-sm sm:text-base leading-relaxed mb-12 sm:mb-16">
          A breakdown of what I build with across frontend engineering, DevSecOps pipelines, and application security.
        </p>

        {/* Grid & Tabs Container */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-10 w-full text-left">
          {/* Category selector */}
          <div
            role="tablist"
            aria-label="Skill categories"
            className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0"
          >
            {SKILL_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = cat.id === activeId;
              return (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveId(cat.id)}
                  className={`group flex shrink-0 lg:shrink lg:w-full items-center gap-3.5 text-left px-4 py-3.5 rounded-2xl border-l-2 transition-all duration-300 backdrop-blur-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40 ${
                    isActive
                      ? `${cat.borderAccent} bg-slate-900/90 border-r border-t border-b border-purple-800/40 shadow-lg shadow-purple-950/40`
                      : 'border-l-transparent bg-slate-900/40 border border-slate-800/40 hover:bg-slate-900/70 hover:border-slate-700/60'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isActive ? 'bg-purple-950/80 border border-purple-800/50' : 'bg-slate-950/50 border border-slate-800/50'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${isActive ? cat.textAccent : 'text-slate-400 group-hover:text-slate-200'}`}
                    />
                  </div>
                  <div>
                    <div
                      className={`text-sm font-semibold transition-colors ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}
                    >
                      {cat.title}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 hidden lg:block leading-snug">
                      {cat.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          <div
            key={activeId}
            role="tabpanel"
            className="glass-card p-6 sm:p-8 rounded-3xl border border-purple-900/30 shadow-2xl relative overflow-hidden text-left"
            style={{ animation: 'skill-panel-in 0.25s ease-out' }}
          >
            <div className="flex items-center justify-between gap-4 pb-5 border-b border-purple-900/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800/50 flex items-center justify-center">
                  <ActiveIcon className={`w-5 h-5 ${active.textAccent}`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{active.title}</h3>
                  <p className="text-xs text-slate-400 lg:hidden">{active.description}</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800/40 text-purple-300 shrink-0">
                {active.skills.length} skills
              </span>
            </div>

            <ul className="mt-3 divide-y divide-purple-900/20">
              {active.skills.map((skill) => (
                <li key={skill.name} className="flex items-center justify-between py-3.5">
                  <span className="text-sm font-medium text-slate-200">{skill.name}</span>
                  <LevelBars level={skill.level} barAccent={active.barAccent} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}