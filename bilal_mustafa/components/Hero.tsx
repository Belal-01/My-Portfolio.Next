'use client';

import { useState, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';
import Orb from '@/components/Orb';

const TITLES = [
  'Front-End Web Developer',
  'DevSecOps Enthusiast',
];

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
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
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.64a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
    </svg>
  );
}

export default function Hero() {
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullText = TITLES[titleIndex];
    let timer: NodeJS.Timeout;

    if (!isDeleting && displayText === currentFullText) {
      // Hold full text for 5 seconds
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 5000);
    } else if (isDeleting && displayText === '') {
      // Finished deleting, pause briefly then move to next title
      timer = setTimeout(() => {
        setIsDeleting(false);
        setTitleIndex((prev) => (prev + 1) % TITLES.length);
      }, 500);
    } else {
      // Type out or backspace character
      const speed = isDeleting ? 40 : 80;
      timer = setTimeout(() => {
        setDisplayText((prev) =>
          isDeleting
            ? currentFullText.substring(0, prev.length - 1)
            : currentFullText.substring(0, prev.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, titleIndex]);

  return (
    <section
      id="hero"
      className="-mt-20 min-h-screen flex flex-col items-center justify-center text-center pt-20 pb-12 relative overflow-hidden"
    >
      {/* Interactive WebGL Orb Background (hidden on screens < 780px) */}
      <div className="hidden min-[780px]:flex absolute inset-0 z-0 items-center justify-center pointer-events-none">
        <Orb
          hoverIntensity={2}
          rotateOnHover={true}
          hue={0}
          scale={1.02}
          forceHoverState={false}
        />
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 pointer-events-none">
        {/* Hero Main Heading */}
        <div className="space-y-4 max-w-4xl mb-6">
          <h1 className="text-4xl sm:text-6xl 2xl:text-7xl font-bold tracking-tight text-white leading-tight drop-shadow-md">
            Hi, I&apos;m <span className="gradient-text-purple-cyan font-extrabold">Bilal</span>
          </h1>

          {/* Animated Typewriter Subheading (5s interval loop) */}
          <p className="text-xl sm:text-2xl md:text-3xl font-medium text-slate-300 drop-shadow-sm min-h-[2.25rem] flex items-center justify-center gap-1">
            <span className="gradient-text-purple-cyan font-bold">{displayText}</span>
            <span className="w-0.5 h-6 sm:h-7 bg-cyan-400 inline-block animate-pulse ml-0.5 shrink-0" />
          </p>
        </div>

        {/* Technology Highlight Statement */}
        {/* <p className="text-sm sm:text-base text-slate-300 font-medium mb-6 drop-shadow-sm">
          I work with <span className="text-purple-400 font-semibold">Next.js</span>
        </p> */}

        {/* Hero Bio Description */}
        <p className="2xl:max-w-xl max-w-[500px] text-slate-400 text-sm sm:text-base leading-relaxed mb-10">
          Building innovative, user-centric web applications with modern technologies.
          
          Passionate about clean code and exceptional user experiences.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14 pointer-events-auto">
          <a
            href="#projects"
            className="btn-primary-gradient px-8 py-3.5 rounded-full text-sm font-semibold shadow-lg shadow-purple-500/25 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="btn-secondary-outline px-8 py-3.5 rounded-full text-sm font-medium hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-md"
          >
            Contact Me
          </a>
        </div>

        {/* Social Icons & Scroll Down Indicator */}
        <div className="flex flex-col items-center gap-4 mt-auto pointer-events-auto">
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Belal-01"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-slate-900/80 border border-purple-900/30 flex items-center justify-center text-slate-300 hover:text-white hover:border-purple-500/50 hover:bg-purple-950/40 transition-all duration-300 shadow-md backdrop-blur-md"
              aria-label="GitHub Profile"
            >
              <GithubIcon className="w-4 h-4" />
            </a>

            <a
              href="https://www.linkedin.com/in/bilallmustafaa/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-slate-900/80 border border-purple-900/30 flex items-center justify-center text-slate-300 hover:text-white hover:border-purple-500/50 hover:bg-purple-950/40 transition-all duration-300 shadow-md backdrop-blur-md"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
          </div>

          <div className="flex flex-col items-center gap-1 text-slate-400 text-xs font-medium animate-bounce pt-2">
            <span>Scroll down</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </section>
  );
}
