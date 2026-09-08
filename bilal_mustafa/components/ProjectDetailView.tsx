'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ExternalLink,
  PlayCircle,
  Target,
  CheckCircle2,
  Images,
  Boxes,
  Sparkles,
  Calendar,
  Layers,
  Layout,
  Cpu,
  ShieldCheck,
  Tag,
  Copy,
  Check,
  Maximize2,
  X,
  Clock,
} from 'lucide-react';
import { Project } from '@/types';

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

const CATEGORY_CONFIG: Record<
  string,
  { label: string; icon: typeof Layout; badgeStyle: string }
> = {
  frontend: {
    label: 'FrontEnd',
    icon: Layout,
    badgeStyle: 'bg-cyan-950/70 border-cyan-500/40 text-cyan-300 shadow-cyan-900/20',
  },
  devops: {
    label: 'DevOps',
    icon: Cpu,
    badgeStyle: 'bg-purple-950/70 border-purple-500/40 text-purple-300 shadow-purple-900/20',
  },
  cybersecurity: {
    label: 'Cybersecurity',
    icon: ShieldCheck,
    badgeStyle: 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300 shadow-emerald-900/20',
  },
};

interface ProjectDetailViewProps {
  project: Project;
}

export default function ProjectDetailView({ project }: ProjectDetailViewProps) {
  const [copiedSlug, setCopiedSlug] = useState(false);
  const [activeModalImage, setActiveModalImage] = useState<{
    url: string;
    caption?: string;
  } | null>(null);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const copySlugToClipboard = () => {
    if (project.slug) {
      navigator.clipboard.writeText(project.slug);
      setCopiedSlug(true);
      setTimeout(() => setCopiedSlug(false), 2000);
    }
  };

  const statusLabel =
    project.status === 'published'
      ? 'Live / Published'
      : project.status === 'draft'
      ? 'Under Development'
      : 'Archived';

  const statusDotColor =
    project.status === 'published'
      ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse'
      : project.status === 'draft'
      ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
      : 'bg-slate-400';

  const createdFormatted = formatDate(project.created_at);
  const updatedFormatted = formatDate(project.updated_at);
  const hasChallenge = Boolean(project.challenge);
  const hasSolution = Boolean(project.solution);

  return (
    <div className="relative min-h-screen pb-20">
      {/* Background Glow Orbs */}
      <div className="pointer-events-none fixed top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/15 blur-[140px] rounded-full -z-10" />
      <div className="pointer-events-none fixed top-96 left-1/3 w-[500px] h-[250px] bg-cyan-500/10 blur-[140px] rounded-full -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 space-y-10">
        {/* Back Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/#projects"
            className="btn-secondary-outline inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold hover:border-purple-500/50"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Projects
          </Link>

          {/* Quick Slug Pill */}
          {project.slug && (
            <button
              onClick={copySlugToClipboard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title="Click to copy slug"
            >
              <Tag className="w-3 h-3 text-purple-400" />
              <span>/{project.slug}</span>
              {copiedSlug ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3 opacity-60" />
              )}
            </button>
          )}
        </div>

        {/* Header Hero Section */}
        <div className="space-y-6">
          {/* Status & Category Badges Row */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Featured Badge */}
            {project.is_featured && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-sm backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Featured Project
              </span>
            )}

            {/* Status Badge */}
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-slate-900/80 text-slate-200 border border-slate-700/60 backdrop-blur-md">
              <span className={`w-2 h-2 rounded-full ${statusDotColor}`} />
              {statusLabel}
            </span>

            {/* Category Badges */}
            {project.categories?.map((cat) => {
              const config = CATEGORY_CONFIG[cat] || {
                label: cat,
                icon: Tag,
                badgeStyle: 'bg-slate-900/80 text-slate-300 border-slate-700',
              };
              const IconComponent = config.icon;
              return (
                <span
                  key={cat}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md shadow-sm ${config.badgeStyle}`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                  {config.label}
                </span>
              );
            })}
          </div>

          {/* Title & Description */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {project.title}
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl">
              {project.short_description}
            </p>
          </div>

          {/* Primary Action Links Header */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary-gradient inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-bold shadow-lg"
              >
                Live Demo
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary-outline inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold"
              >
                <GithubIcon className="w-4 h-4 text-slate-300" />
                Repository
              </a>
            )}
            {project.video_demo_url && (
              <a
                href={project.video_demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary-outline inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold"
              >
                <PlayCircle className="w-4 h-4 text-purple-400" />
                Video Demo
              </a>
            )}
          </div>
        </div>

        {/* Cover Image Showcase */}
        {project.cover_image && (
          <div className="relative group rounded-3xl overflow-hidden glass-card p-2 border-purple-900/40 shadow-2xl">
            <div className="relative w-full h-[280px] sm:h-[420px] rounded-2xl overflow-hidden bg-slate-950">
              <img
                src={project.cover_image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

              <button
                onClick={() =>
                  setActiveModalImage({
                    url: project.cover_image,
                    caption: `${project.title} - Cover Preview`,
                  })
                }
                className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-black/70 backdrop-blur-md border border-white/20 text-white hover:bg-black/90 transition-all opacity-0 group-hover:opacity-100"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                View Fullscreen
              </button>
            </div>
          </div>
        )}

        {/* Overview Grid: Tech Stack & Metadata Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tech Stack Box */}
          <div className="md:col-span-2 glass-card p-6 sm:p-7 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Layers className="w-4 h-4 text-purple-400" />
              Technologies & Architecture Stack
            </div>
            {project.tech_stack && project.tech_stack.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {project.tech_stack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-mono px-3 py-1.5 rounded-full bg-purple-950/60 text-purple-200 border border-purple-800/40 shadow-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No specific technologies listed.</p>
            )}
          </div>

          {/* Quick Specifications / Meta Info */}
          <div className="glass-card p-6 sm:p-7 rounded-2xl space-y-4 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Clock className="w-4 h-4 text-cyan-400" />
              Project Specifications
            </div>
            <div className="space-y-2.5 text-xs text-slate-300 font-mono">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-slate-400">Status</span>
                <span className="text-emerald-400 font-semibold">{statusLabel}</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-slate-400">Priority Order</span>
                <span className="text-purple-300">#{project.display_order ?? 0}</span>
              </div>
              {createdFormatted && (
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Created</span>
                  <span className="text-slate-200">{createdFormatted}</span>
                </div>
              )}
              {updatedFormatted && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Updated</span>
                  <span className="text-slate-200">{updatedFormatted}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Problem & Solution Panel */}
        {(hasChallenge || hasSolution) && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              Case Study Analysis
            </h2>
            <div
              className={`glass-card rounded-2xl divide-y divide-purple-900/30 overflow-hidden ${
                hasChallenge && hasSolution ? 'md:grid md:grid-cols-2 md:divide-y-0 md:divide-x' : ''
              }`}
            >
              {hasChallenge && (
                <div className="p-6 sm:p-8 space-y-3 bg-amber-950/10">
                  <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
                    <Target className="w-4 h-4 text-amber-400" />
                    The Challenge
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed font-sans">
                    {project.challenge}
                  </p>
                </div>
              )}
              {hasSolution && (
                <div className="p-6 sm:p-8 space-y-3 bg-emerald-950/10">
                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    The Solution
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed font-sans">
                    {project.solution}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Architecture Diagram Section */}
        {project.architecture_diagram && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Boxes className="w-5 h-5 text-purple-400" />
                System Architecture Diagram
              </h2>
              <a
                href={project.architecture_diagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                Open Original
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div
              onClick={() =>
                setActiveModalImage({
                  url: project.architecture_diagram!,
                  caption: `${project.title} - Architecture Diagram`,
                })
              }
              className="group cursor-pointer rounded-2xl glass-card border-purple-900/40 p-4 sm:p-6 bg-black/40 relative overflow-hidden text-center"
            >
              <img
                src={project.architecture_diagram}
                alt={`${project.title} architecture diagram`}
                className="max-h-[420px] mx-auto object-contain rounded-xl group-hover:scale-[1.01] transition-transform duration-300"
              />
              <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-slate-400 group-hover:text-cyan-300 transition-colors">
                <Maximize2 className="w-3.5 h-3.5" />
                Click to expand architecture diagram
              </div>
            </div>
          </div>
        )}

        {/* Image Gallery Section */}
        {project.images && project.images.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Images className="w-5 h-5 text-cyan-400" />
              Project Screenshots Gallery
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {project.images.map((img, idx) => (
                <div
                  key={img.id || idx}
                  onClick={() =>
                    setActiveModalImage({
                      url: img.image_url,
                      caption: img.caption || `${project.title} screenshot ${idx + 1}`,
                    })
                  }
                  className="group cursor-pointer rounded-2xl overflow-hidden glass-card border border-purple-900/30 flex flex-col justify-between transition-all duration-300 hover:border-purple-500/50"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                    <img
                      src={img.image_url}
                      alt={img.caption || `${project.title} screenshot ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Maximize2 className="w-6 h-6 text-white drop-shadow-md" />
                    </div>
                  </div>
                  {img.caption && (
                    <div className="p-3 bg-black/60 backdrop-blur-md border-t border-white/5">
                      <p className="text-xs text-slate-300 truncate">{img.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Contact Banner */}
        <div className="mt-16 glass-card p-8 sm:p-10 rounded-3xl border border-purple-900/40 text-center space-y-4 bg-gradient-to-b from-purple-950/20 to-slate-950/80">
          <h3 className="text-2xl sm:text-3xl font-bold text-white">
            Interested in building something similar?
          </h3>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Let&apos;s collaborate on your next DevOps pipeline, Cloud Infrastructure, or Modern Web Application.
          </p>
          <div className="pt-2">
            <Link
              href="/#contact"
              className="btn-primary-gradient inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold shadow-xl"
            >
              Get in Touch
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </div>
      </div>

      {/* Lightbox / Modal for Image Preview */}
      {activeModalImage && (
        <div
          onClick={() => setActiveModalImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full glass-card p-3 rounded-2xl border border-white/20 flex flex-col items-center max-h-[90vh]"
          >
            <button
              onClick={() => setActiveModalImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/80 text-slate-300 hover:text-white border border-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={activeModalImage.url}
              alt={activeModalImage.caption || 'Project Image'}
              className="max-h-[75vh] w-auto object-contain rounded-xl"
            />
            {activeModalImage.caption && (
              <p className="mt-3 text-xs sm:text-sm text-slate-300 font-mono text-center">
                {activeModalImage.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
