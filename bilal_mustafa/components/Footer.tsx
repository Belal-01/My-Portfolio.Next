'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowUp, ExternalLink } from 'lucide-react';

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Certificates', href: '#certificates' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative w-full border-t border-purple-900/30 bg-slate-950/40 backdrop-blur-xl text-slate-300 overflow-hidden">
      {/* Subtle Background Glow Orbs */}
      <div className="pointer-events-none absolute -bottom-20 left-1/4 w-[400px] h-[200px] bg-purple-600/10 blur-[120px] rounded-full -z-10" />
      <div className="pointer-events-none absolute -bottom-20 right-1/4 w-[400px] h-[200px] bg-cyan-500/10 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-6 pt-14 pb-8 space-y-12">
        {/* Main 4-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand & Profile */}
          <div className="space-y-4">
            <Link href="/" onClick={scrollToTop} className="inline-flex items-center gap-3 group focus:outline-none">
              <img
                src="/logo.svg"
                alt="Bilal Khubieh Logo"
                className="w-9 h-9 object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(139,92,246,0.3)]"
              />
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-purple-300 transition-colors">
                Bilal Khubieh
              </span>
            </Link>
            <p className="text-xs text-purple-300 font-semibold tracking-wide">
              FrontEnd &amp; DevOps Engineer
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Crafting high-performance web applications, resilient CI/CD pipelines, and secure cloud infrastructure.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://github.com/Belal-01"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900/80 border border-purple-900/40 flex items-center justify-center text-slate-300 hover:text-white hover:border-purple-500/60 hover:bg-purple-950/60 transition-all duration-300 shadow-md"
                aria-label="GitHub Profile"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/bilallmustafaa/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900/80 border border-purple-900/40 flex items-center justify-center text-slate-300 hover:text-white hover:border-purple-500/60 hover:bg-purple-950/60 transition-all duration-300 shadow-md"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href="mailto:belalkhobieh343@gmail.com"
                className="w-9 h-9 rounded-full bg-slate-900/80 border border-purple-900/40 flex items-center justify-center text-slate-300 hover:text-white hover:border-purple-500/60 hover:bg-purple-950/60 transition-all duration-300 shadow-md"
                aria-label="Send Email"
              >
                <Mail className="w-4 h-4 text-cyan-400" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Items */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-purple-500 pl-2.5">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              {NAV_LINKS.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-purple-500/60 text-[10px]">▸</span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Base Contact Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-cyan-500 pl-2.5">
              Contact Information
            </h4>
            <div className="space-y-3 text-xs">
              <a
                href="mailto:belalkhobieh343@gmail.com"
                className="flex items-center gap-2.5 text-slate-300 hover:text-cyan-300 transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">belalkhobieh343@gmail.com</span>
              </a>

              <a
                href="tel:+963981091343"
                className="flex items-center gap-2.5 text-slate-300 hover:text-purple-300 transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <span>+963 981 091 343</span>
              </a>

              <div className="flex items-center gap-2.5 text-slate-300">
                <div className="w-7 h-7 rounded-lg bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center text-indigo-400 shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span>Damascus, Syria</span>
              </div>
            </div>
          </div>

          {/* Column 4: Availability Status & Back To Top */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-emerald-500 pl-2.5">
                Current Status
              </h4>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-purple-900/30 backdrop-blur-md space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  Available for Hire
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Open to full-time remote roles &amp; consulting projects worldwide.
                </p>
              </div>
            </div>

            <button
              onClick={scrollToTop}
              className="btn-secondary-outline self-start sm:self-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold hover:border-purple-500/60 transition-all cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5 text-purple-400" />
            </button>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-6 border-t border-purple-900/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Bilal Khubieh. All rights reserved.</p>
          <div className="flex items-center gap-2 text-[11px] font-mono">
            <span>Next.js 16</span>
            <span>•</span>
            <span>Tailwind CSS</span>
            <span>•</span>
            <span>Supabase</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
