'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ExternalLink, ArrowRight, FolderGit2, ShieldAlert, Cpu, Layout, Server, Loader2 } from 'lucide-react';
import { Project } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { MOCK_PROJECTS } from '@/lib/supabase/mockData';

type CategoryFilter = 'All' | 'frontend' | 'backend' | 'devops' | 'cybersecurity';

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}

const FILTERS: { key: CategoryFilter; label: string; icon: typeof Layout }[] = [
  { key: 'All', label: 'All Projects', icon: FolderGit2 },
  { key: 'frontend', label: 'FrontEnd', icon: Layout },
  { key: 'backend', label: 'BackEnd', icon: Server },
  { key: 'devops', label: 'DevOps', icon: Cpu },
  { key: 'cybersecurity', label: 'Cybersecurity', icon: ShieldAlert },
];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('All');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('status', 'published')
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          setProjects(data as Project[]);
        } else {
          // Fallback to API route or MOCK_PROJECTS if database table is empty / unconfigured
          const res = await fetch('/api/projects');
          const json = await res.json();

          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            setProjects(json.data as Project[]);
          } else {
            setProjects(MOCK_PROJECTS);
          }
        }
      } catch (err) {
        console.error('Error fetching projects from Supabase:', err);
        setProjects(MOCK_PROJECTS);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    if (activeFilter === 'All') return true;
    return project.categories?.includes(activeFilter);
  });

  return (
    <section id="projects" className="py-20 flex flex-col items-center relative">
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Section Badge */}
        <div className="badge-available px-4 py-1.5 rounded-full inline-flex items-center gap-2 text-xs font-medium text-slate-200 shadow-md mb-6 backdrop-blur-md bg-slate-900/60 border border-slate-700/50">
          <FolderGit2 className="w-3.5 h-3.5 text-purple-400" />
          <span>Showcase</span>
        </div>

        {/* Section Heading */}
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
          Featured <span className="gradient-text-purple-cyan font-extrabold">Projects</span>
        </h2>

        <p className="max-w-xl text-slate-400 text-sm sm:text-base leading-relaxed mb-10">
          Explore my latest work across FrontEnd engineering, DevOps automation pipelines, and Cybersecurity implementations.
        </p>

        {/* Interactive Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 p-1.5 rounded-full bg-slate-900/80 border border-purple-900/40 backdrop-blur-md">
          {FILTERS.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`px-5 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all duration-300 ${
                  isActive
                    ? 'btn-primary-gradient text-white shadow-lg shadow-purple-500/25 scale-105'
                    : 'text-slate-400 hover:text-white hover:bg-purple-950/30'
                }`}
              >
                <IconComponent className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Loading Skeleton State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full text-left">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="glass-card rounded-3xl overflow-hidden h-96 border border-purple-900/30 animate-pulse flex flex-col justify-between p-6 space-y-4"
              >
                <div className="h-48 bg-slate-900/80 rounded-2xl w-full"></div>
                <div className="space-y-3">
                  <div className="h-6 bg-slate-800/80 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-900/80 rounded w-full"></div>
                  <div className="h-4 bg-slate-900/80 rounded w-2/3"></div>
                </div>
                <div className="h-8 bg-slate-900/50 rounded w-full pt-4"></div>
              </div>
            ))}
          </div>
        ) : (
          /* Projects Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full text-left">
            {filteredProjects.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-400 text-sm">
                No projects found for category &ldquo;{activeFilter}&rdquo;.
              </div>
            ) : (
              filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="glass-card rounded-3xl overflow-hidden flex flex-col justify-between group border border-purple-900/30 hover:border-purple-500/50 transition-all duration-300 shadow-xl"
                >
                  {/* Image Preview Container */}
                  <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-950">
                    <img
                      src={project.cover_image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute overflow-hidden -inset-2  group-hover:scale-108 transition-transform duration-400 opacity-90 group-hover:opacity-100  bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                    
                    {/* Category Badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                      {project.categories.map((cat) => (
                        <span
                          key={cat}
                          className="text-[10px] font-semibold px-3 py-1 rounded-full bg-slate-900/90 text-cyan-300 border border-cyan-500/40 backdrop-blur-md shadow-md"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
                        {project.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                        {project.short_description}
                      </p>
                    </div>

                    {/* Tech Stack Pills */}
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {project.tech_stack?.map((tech) => (
                        <span
                          key={tech}
                          className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-purple-950/50 text-purple-200 border border-purple-800/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="px-6 py-4 sm:px-8 bg-black/40 border-t border-purple-900/30 flex items-center justify-between gap-4 text-xs font-semibold">
                    <Link
                      href={`/projects/${project.id}`}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 group/link"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                    </Link>

                    <div className="flex items-center gap-3">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                          aria-label="GitHub Repository"
                        >
                          <GithubIcon className="w-3.5 h-3.5" />
                          <span>Code</span>
                        </a>
                      )}
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
                          aria-label="Live Demo"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Demo</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}

