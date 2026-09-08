import { Briefcase, Calendar, MapPin, Trophy, GraduationCap, CheckCircle2, Sparkles } from 'lucide-react';

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  isHighlight?: boolean;
  highlightBadge?: string;
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
    isHighlight: true,
    highlightBadge: '🏆 1st Place Winner (350 Teams)',
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
  return (
    <section id="experience" className="py-20 flex flex-col items-center relative">
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Top Section Badge */}
        <div className="badge-available px-4 py-1.5 rounded-full inline-flex items-center gap-2 text-xs font-medium text-slate-200 shadow-md mb-6 backdrop-blur-md bg-slate-900/60 border border-slate-700/50">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Career Journey</span>
        </div>

        {/* Section Heading */}
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
          Work <span className="gradient-text-purple-cyan font-extrabold">Experience</span>
        </h2>

        <p className="max-w-xl text-slate-400 text-sm sm:text-base leading-relaxed mb-16">
          My professional timeline showcasing key roles, hackathon achievements, and impactful engineering contributions.
        </p>

        {/* Timeline Container */}
        <div className="relative w-full text-left pl-6 sm:pl-10 space-y-12">
          {/* Vertical Timeline Line */}
          <div className="absolute top-3 bottom-3 left-4 sm:left-6 w-0.5 bg-gradient-to-b from-purple-500 via-indigo-500 to-cyan-500"></div>

          {EXPERIENCES.map((exp) => {
            const IconComponent = exp.icon;
            return (
              <div key={exp.id} className="relative group">
                {/* Timeline Circle Node */}
                <div className={`absolute -left-6 sm:-left-10 top-0.5 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center border transition-all duration-300 shadow-lg ${
                  exp.isHighlight
                    ? 'bg-amber-950/90 border-amber-500 text-amber-300 shadow-amber-500/30 group-hover:scale-110'
                    : 'bg-slate-900 border-purple-500/50 text-purple-400 group-hover:border-cyan-400 group-hover:text-cyan-300 group-hover:scale-110'
                }`}>
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                {/* Content Card */}
                <div className={`glass-card p-6 sm:p-8 rounded-3xl space-y-5 shadow-xl transition-all duration-300 border ${
                  exp.isHighlight
                    ? 'border-amber-500/40 bg-amber-950/10 hover:border-amber-400/60'
                    : 'border-purple-900/30 hover:border-purple-500/50'
                }`}>
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-900/30 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
                          {exp.role}
                        </h3>
                        {exp.highlightBadge && (
                          <span className="text-xs px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 font-semibold shadow-sm animate-pulse">
                            {exp.highlightBadge}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-300 flex-wrap">
                        <span className="font-semibold text-cyan-300">{exp.company}</span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-purple-400" />
                          {exp.location}
                        </span>
                      </div>
                    </div>

                    {/* Date Badge */}
                    <div className="inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-purple-800/40 text-purple-300 self-start sm:self-center shrink-0">
                      <Calendar className="w-3.5 h-3.5 text-purple-400" />
                      <span>{exp.period}</span>
                    </div>
                  </div>

                  {/* Responsibilities List */}
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {exp.responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Skill Tag Pills */}
                  <div className="pt-3 border-t border-purple-900/20 flex flex-wrap gap-2">
                    {exp.skills.map((skill) => (
                      <span
                        key={skill}
                        className={`text-xs px-3 py-1 rounded-full font-medium ${
                          exp.isHighlight
                            ? 'bg-amber-950/50 border border-amber-800/40 text-amber-200'
                            : 'bg-purple-950/40 border border-purple-800/30 text-purple-200'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
