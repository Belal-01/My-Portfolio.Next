'use client';

import { useState } from 'react';
import {
  Briefcase,
  Calendar,
  MapPin,
  Trophy,
  GraduationCap,
  CheckCircle2,
  ChevronDown,
  Zap,
  Building2,
} from 'lucide-react';
import { motion } from 'motion/react';

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  category: 'commercial' | 'awards' | 'training';
  categoryLabel: string;
  isHighlight?: boolean;
  highlightBadge?: string;
  impactMetrics?: string[];
  icon: typeof Briefcase;
  responsibilities: string[];
  skills: string[];
}

const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'exp-1',
    role: 'Front-End Developer',
    company: 'MiddleEast Company',
    location: 'Damascus, Syria',
    period: 'Oct 2025 – June 2026',
    category: 'commercial',
    categoryLabel: 'Enterprise System',
    impactMetrics: ['Global Scale (1M+ Users)', 'Next.js 16 & TypeScript', 'SEO Optimization'],
    icon: Briefcase,
    responsibilities: [
      'Engineering a large-scale, global E-commerce system designed to serve millions of users worldwide, focusing on high availability and seamless user experience.',
      'Leading the development of modern web interfaces using Next.js and TypeScript, ensuring optimal performance and SEO.',
      'Working closely with Engineers, Product Managers, and Quality Assurance Engineers to achieve team goals, while communicating effectively throughout the process.',
      'Writing clean, maintainable, and reusable code and conducting code reviews to ensure adherence to coding standards and best practices.',
    ],
    skills: ['Next.js 16', 'TypeScript', 'E-Commerce System', 'SEO Optimization', 'Code Reviews'],
  },
  {
    id: 'exp-2',
    role: 'Front-End Developer',
    company: 'Fractals Company',
    location: 'Damascus, Syria',
    period: 'March 2025 – Sep 2025',
    category: 'commercial',
    categoryLabel: 'Client & Agency',
    impactMetrics: ['Cross-Browser Compatibility', 'REST APIs Integration', 'UI/UX Translation'],
    icon: Briefcase,
    responsibilities: [
      'Translated web design mockups and feature requirements into functional, mobile-friendly websites using HTML, CSS, and JavaScript frameworks such as React.',
      'Worked closely with UI/UX designers to translate design wireframes into reusable code and collaborated with backend developers to integrate APIs and services.',
      'Ensured cross-browser compatibility and optimized applications for maximum speed and scalability.',
    ],
    skills: ['React', 'JavaScript (ES6+)', 'REST APIs', 'UI/UX Integration', 'Cross-Browser Compatibility'],
  },
  {
    id: 'exp-3',
    role: 'Front-End Developer & Participant',
    company: 'Syrian Hackathon',
    location: 'Damascus, Syria',
    period: 'Feb 2025 – Feb 2025',
    category: 'awards',
    categoryLabel: 'Competition & Award',
    isHighlight: true,
    highlightBadge: '🏆 1st Place Winner (350 Teams)',
    impactMetrics: ['1st / 350 Competing Teams', '48h Prototype Sprint', 'High-Performance ERP'],
    icon: Trophy,
    responsibilities: [
      'Collaborated with the team to conceptualize and support the development of an ERP system as part of the project scope.',
      'Designed and developed a fully responsive, visually appealing landing page from scratch during the Syrian Hackathon within a very limited timeframe.',
      'Managed all front-end development independently, ensuring fast load times and smooth user experience despite strict time constraints.',
      'Delivered a polished final product demonstrating strong design and coding skills under high pressure.',
    ],
    skills: ['React', 'Tailwind CSS', 'Rapid Prototyping', 'ERP Landing Page', '1st Place Win'],
  },
  {
    id: 'exp-4',
    role: 'Trainee Front-End Developer',
    company: 'Mad Solution Company',
    location: 'Damascus, Syria',
    period: 'Sep 2024 – Dec 2024',
    category: 'training',
    categoryLabel: 'Intensive Training',
    impactMetrics: ['3-Month Intensive Track', 'Agile & Best Practices', 'Component Architecture'],
    icon: GraduationCap,
    responsibilities: [
      'Completed an intensive 3-month training program focused on web development using React, TailwindCSS, and JavaScript.',
      'Participated in code reviews, improving code quality, learning industry best practices, and enhancing collaboration within the development team.',
      'Developed proficiency in creating responsive, user-friendly interfaces and collaborating in a project-based learning environment.',
    ],
    skills: ['React', 'TailwindCSS', 'JavaScript', 'Frontend Training', 'Agile Collaboration'],
  },
];

export default function Experience() {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    'exp-1': true,
    'exp-3': true,
  });

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="experience" className="py-24 flex flex-col items-center relative w-full">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[600px] h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
        {/* Section Heading */}
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4 text-center leading-tight">
          Work <span className="gradient-text-purple-cyan font-extrabold">Experience</span>
        </h2>

        <p className="max-w-2xl text-slate-400 text-sm sm:text-base leading-relaxed mb-16 text-center">
          A chronological breakdown of large-scale commercial engineering, 1st-place hackathon triumphs, and modern front-end craft.
        </p>

        {/* Alternating Dual-Sided 3D Bento Timeline Container */}
        <div className="relative w-full">
          {/* Desktop Center Spine Line */}
          <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-6 bottom-6 w-0.5 bg-gradient-to-b from-purple-500 via-cyan-400 to-indigo-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] rounded-full" />

          {/* Mobile Left-Aligned Spine Line */}
          <div className="lg:hidden absolute left-5 top-6 bottom-6 w-0.5 bg-gradient-to-b from-purple-500 via-cyan-400 to-indigo-500 shadow-[0_0_12px_rgba(168,85,247,0.3)] rounded-full" />

          {/* Timeline Items List with Motion */}
          <div className="space-y-12 sm:space-y-16">
            {EXPERIENCES.map((exp, index) => {
              const IconComponent = exp.icon;
              const isEven = index % 2 === 0;
              const isExpanded = !!expandedItems[exp.id];

              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                    className={`relative flex flex-col lg:flex-row items-start ${
                      isEven ? 'lg:flex-row-reverse' : ''
                    } group`}
                  >
                    {/* Desktop Center Node Marker */}
                    <div
                      className={`hidden lg:flex absolute left-1/2 -translate-x-1/2 top-6 z-20 w-12 h-12 rounded-full items-center justify-center border transition-all duration-300 shadow-xl ${
                        exp.isHighlight
                          ? 'bg-amber-950 border-amber-400 text-amber-300 shadow-[0_0_24px_rgba(245,158,11,0.5)] scale-110 group-hover:scale-125'
                          : 'bg-slate-900 border-purple-500/60 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.35)] group-hover:border-cyan-400 group-hover:text-cyan-300 group-hover:scale-115'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    {/* Mobile Left Node Marker */}
                    <div
                      className={`lg:hidden absolute left-5 -translate-x-1/2 top-6 z-20 w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 shadow-md ${
                        exp.isHighlight
                          ? 'bg-amber-950 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                          : 'bg-slate-900 border-purple-500/60 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>

                    {/* Desktop Connector Arm Line */}
                    <div
                      className={`hidden lg:block absolute top-12 h-0.5 w-10 z-10 ${
                        isEven
                          ? 'right-1/2 bg-gradient-to-l from-purple-500/60 to-transparent'
                          : 'left-1/2 bg-gradient-to-r from-purple-500/60 to-transparent'
                      }`}
                    />

                    {/* Card Body Container */}
                    <div
                      className={`w-full pl-12 lg:pl-0 lg:w-[calc(50%-2.5rem)] ${
                        isEven ? 'lg:mr-auto lg:text-left' : 'lg:ml-auto lg:text-left'
                      }`}
                    >
                      <div
                        className={`glass-card p-6 sm:p-8 rounded-3xl space-y-5 transition-all duration-300 border relative overflow-hidden shadow-2xl ${
                          exp.isHighlight
                            ? 'border-amber-500/50 bg-gradient-to-br from-amber-950/20 via-slate-950/90 to-purple-950/20 hover:border-amber-400 shadow-[0_10px_35px_-10px_rgba(245,158,11,0.2)]'
                            : 'border-purple-900/30 hover:border-purple-500/60 hover:shadow-[0_10px_35px_-10px_rgba(139,92,246,0.25)]'
                        }`}
                      >
                        {/* Decorative Top Highlight Bar */}
                        <div
                          className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                            exp.isHighlight
                              ? 'from-amber-500 via-yellow-400 to-amber-600'
                              : 'from-purple-500 via-indigo-500 to-cyan-400'
                          }`}
                        />

                        {/* Card Header */}
                        <div className="space-y-3 border-b border-purple-900/30 pb-4">
                          <div className="flex flex-wrap items-center justify-between gap-2.5">
                            {/* Category & Highlight Badge */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                                  exp.isHighlight
                                    ? 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                                    : 'bg-purple-950/60 border-purple-800/40 text-purple-300'
                                }`}
                              >
                                {exp.categoryLabel}
                              </span>

                              {exp.highlightBadge && (
                                <span className="text-[11px] px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 font-bold shadow-[0_0_12px_rgba(245,158,11,0.3)] animate-pulse flex items-center gap-1">
                                  {exp.highlightBadge}
                                </span>
                              )}
                            </div>

                            {/* Date Badge */}
                            <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-slate-900/90 border border-purple-800/40 text-purple-300 shrink-0">
                              <Calendar className="w-3.5 h-3.5 text-purple-400" />
                              <span>{exp.period}</span>
                            </div>
                          </div>

                          {/* Role & Company */}
                          <div>
                            <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
                              {exp.role}
                            </h3>
                            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300 mt-1 flex-wrap">
                              <span className="font-semibold text-cyan-300 flex items-center gap-1">
                                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                                {exp.company}
                              </span>
                              <span className="text-slate-500">•</span>
                              <span className="flex items-center gap-1 text-slate-400">
                                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                                {exp.location}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Impact Metrics Chips */}
                        {exp.impactMetrics && exp.impactMetrics.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {exp.impactMetrics.map((metric, i) => (
                              <div
                                key={i}
                                className={`text-[11px] font-medium px-2.5 py-1 rounded-lg flex items-center gap-1.5 border ${
                                  exp.isHighlight
                                    ? 'bg-amber-950/40 border-amber-500/30 text-amber-200'
                                    : 'bg-purple-950/40 border-purple-800/30 text-cyan-300'
                                }`}
                              >
                                <Zap className="w-3 h-3 text-purple-400 shrink-0" />
                                <span>{metric}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Key Responsibilities List (with smooth expand/collapse) */}
                        <div className="space-y-3">
                          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                            {/* Always display top responsibilities */}
                            {(isExpanded ? exp.responsibilities : exp.responsibilities.slice(0, 2)).map(
                              (resp, idx) => (
                                <li key={idx} className="flex items-start gap-2.5">
                                  <CheckCircle2
                                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                                      exp.isHighlight ? 'text-amber-400' : 'text-purple-400'
                                    }`}
                                  />
                                  <span>{resp}</span>
                                </li>
                              )
                            )}
                          </ul>

                          {/* Expand Toggle if more than 2 items */}
                          {exp.responsibilities.length > 2 && (
                            <button
                              onClick={() => toggleExpand(exp.id)}
                              className="text-xs font-semibold text-purple-400 hover:text-cyan-300 inline-flex items-center gap-1 transition-colors pt-1 cursor-pointer"
                            >
                              <span>{isExpanded ? 'Show Less' : `+${exp.responsibilities.length - 2} More Details`}</span>
                              <ChevronDown
                                className={`w-3.5 h-3.5 transition-transform duration-300 ${
                                  isExpanded ? 'rotate-180' : ''
                                }`}
                              />
                            </button>
                          )}
                        </div>

                        {/* Skills Pill Tags */}
                        <div className="pt-3 border-t border-purple-900/30 flex flex-wrap gap-1.5">
                          {exp.skills.map((skill) => (
                            <span
                              key={skill}
                              className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-colors ${
                                exp.isHighlight
                                  ? 'bg-amber-950/50 border border-amber-800/40 text-amber-200 hover:border-amber-400'
                                  : 'bg-purple-950/50 border border-purple-800/30 text-purple-200 hover:border-cyan-400'
                              }`}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
}

