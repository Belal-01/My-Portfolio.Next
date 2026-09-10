import { Award, Briefcase, Code, Rocket, Sparkles } from 'lucide-react';

export default function AboutMe() {
  return (
    <section id="about" className="py-20 flex flex-col items-center relative">
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Top Section Badge */}
        <div className="badge-available px-4 py-1.5 rounded-full inline-flex items-center gap-2 text-xs font-medium text-slate-200 shadow-md mb-6 backdrop-blur-md bg-slate-900/60 border border-slate-700/50">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>About Me</span>
        </div>

        {/* Section Heading */}
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
          Crafting Scalable &amp; <span className="gradient-text-purple-cyan font-extrabold">User-Centric Applications</span>
        </h2>

        {/* Main Glassmorphic Bio Card */}
        <div className="glass-card p-8 sm:p-10 rounded-3xl text-left space-y-6 mb-12 shadow-2xl relative overflow-hidden border border-purple-900/30">
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Hi, I&apos;m a passionate <span className="text-white font-semibold">Front-End Developer</span> with <span className="text-purple-300 font-semibold">2 years of experience</span> building responsive, user-friendly web applications. Skilled in <span className="text-cyan-300 font-semibold">React, Next.js, TypeScript, Tailwind CSS</span>, and modern state management tools (<span className="text-indigo-300 font-semibold">Redux, Zustand</span>). Proven track record of delivering scalable solutions in freelance, hackathon, and professional settings, including a <span className="text-amber-300 font-semibold">1st-place win at the Syrian Hackathon among 350 teams</span>.
          </p>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Currently expanding my expertise by learning <span className="text-emerald-400 font-semibold">Spring Boot</span> to expand into <span className="text-purple-300 font-semibold">Full-Stack development</span> and leverage Java-based backend technologies, with a strong ambition to integrate <span className="text-cyan-400 font-semibold">Artificial Intelligence</span> into modern web applications. Actively seeking new opportunities and challenges to leverage my skills in building dynamic, innovative, and smarter digital experiences.
          </p>

          {/* Quick Core Skills Pills */}
          <div className="pt-4 border-t border-purple-900/30 flex flex-wrap gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800/40 text-purple-200">
              React &amp; Next.js
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-200">
              TypeScript &amp; Tailwind CSS
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/40 text-indigo-200">
              Redux &amp; Zustand
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-200">
              Spring Boot &amp; Java (In Progress)
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800/40 text-amber-200">
              AI Web Integration
            </span>
          </div>
        </div>

        {/* Key Metrics & Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
          {/* Stat 1 */}
          <div className="glass-card p-6 rounded-2xl flex flex-col items-center text-center space-y-3 group hover:border-purple-500/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-800/50 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Briefcase className="w-6 h-6" />
            </div>
            <div className="text-3xl font-extrabold text-white">2+</div>
            <div className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Years Experience</div>
            <p className="text-xs text-slate-400">Building responsive &amp; scalable web applications</p>
          </div>

          {/* Stat 2 */}
          <div className="glass-card p-6 rounded-2xl flex flex-col items-center text-center space-y-3 group hover:border-cyan-500/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-800/50 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Code className="w-6 h-6" />
            </div>
            <div className="text-3xl font-extrabold text-white">15+</div>
            <div className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">Projects Completed</div>
            <p className="text-xs text-slate-400">Freelance, hackathons &amp; production web apps</p>
          </div>

          {/* Stat 3 */}
          <div className="glass-card p-6 rounded-2xl flex flex-col items-center text-center space-y-3 group hover:border-amber-500/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-800/50 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <div className="text-3xl font-extrabold text-amber-300">1st Place</div>
            <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Hackathon Winner</div>
            <p className="text-xs text-slate-400">Top winner out of 350 competing teams</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#projects"
            className="btn-primary-gradient px-8 py-3.5 rounded-full text-sm font-semibold shadow-lg shadow-purple-500/25 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
          >
            <span>Explore Projects</span>
            <Rocket className="w-4 h-4" />
          </a>
          <a
            href="#contact"
            className="btn-secondary-outline px-8 py-3.5 rounded-full text-sm font-medium hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Get In Touch
          </a>
        </div>
      </div>
    </section>
  );
}
