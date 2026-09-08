'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ProjectCategory, ProjectStatus } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  FolderPlus,
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  X,
  Layout,
  Cpu,
  ShieldAlert,
  Loader2,
  AlertCircle,
  Sparkles,
  Link as LinkIcon,
  FolderGit2,
  Tv,
  Image as ImageIcon,
  CheckCircle2,
  FileCode2,
  UploadCloud,
  RefreshCw,
  Database,
  Images,
  Trash2,
  ShieldX
} from 'lucide-react';

const CATEGORY_OPTIONS: { id: ProjectCategory; label: string; icon: typeof Layout }[] = [
  { id: 'frontend', label: 'FrontEnd', icon: Layout },
  { id: 'devops', label: 'DevOps', icon: Cpu },
  { id: 'cybersecurity', label: 'Cybersecurity', icon: ShieldAlert },
];

const STEPS = [
  { id: 1, name: 'Basic Info', description: 'Title, slug, description & categories' },
  { id: 2, name: 'Case Study', description: 'Challenge, solution & architecture' },
  { id: 3, name: 'Media & Gallery', description: 'Cover, gallery images & links' },
  { id: 4, name: 'Publish & Review', description: 'Status, featured toggle & summary' },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function uploadFileToSupabaseStorage(file: File, folder = 'projects'): Promise<string> {
  const supabase = createClient();
  const fileExt = file.name.split('.').pop() || 'jpg';
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { error } = await supabase.storage
    .from('portfolio-media')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    throw new Error(`Supabase Storage Upload Error: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('portfolio-media')
    .getPublicUrl(fileName);

  return publicUrl;
}

export default function CreateProjectPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);
  const [shortDescription, setShortDescription] = useState('');
  const [categories, setCategories] = useState<ProjectCategory[]>(['frontend']);
  const [techStack, setTechStack] = useState<string[]>(['Next.js 16', 'TypeScript', 'Tailwind CSS']);
  const [techInput, setTechInput] = useState('');

  const [challenge, setChallenge] = useState('');
  const [solution, setSolution] = useState('');
  const [architectureDiagram, setArchitectureDiagram] = useState('');

  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop');
  const [galleryImages, setGalleryImages] = useState<{ url: string; caption: string }[]>([]);
  
  const [liveUrl, setLiveUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [videoDemoUrl, setVideoDemoUrl] = useState('');

  const [status, setStatus] = useState<ProjectStatus>('published');
  const [isFeatured, setIsFeatured] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(1);

  // Upload & Mode states
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingDiagram, setUploadingDiagram] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [coverMode, setCoverMode] = useState<'upload' | 'url'>('upload');
  const [diagramMode, setDiagramMode] = useState<'upload' | 'url'>('upload');

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [rlsErrorHelp, setRlsErrorHelp] = useState(false);

  // Handle Title change + auto slug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (autoSlug) {
      setSlug(slugify(val));
    }
  };

  // Toggle Category Selection
  const toggleCategory = (cat: ProjectCategory) => {
    if (categories.includes(cat)) {
      if (categories.length > 1) {
        setCategories(categories.filter((c) => c !== cat));
      }
    } else {
      setCategories([...categories, cat]);
    }
  };

  // Add Tech Stack tag
  const handleAddTech = () => {
    if (techInput.trim() && !techStack.includes(techInput.trim())) {
      setTechStack([...techStack, techInput.trim()]);
      setTechInput('');
    }
  };

  const handleRemoveTech = (tag: string) => {
    setTechStack(techStack.filter((t) => t !== tag));
  };

  // Cover Image File Upload Handler
  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    setErrorMsg(null);

    try {
      const url = await uploadFileToSupabaseStorage(file, 'covers');
      setCoverImage(url);
    } catch (err: any) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCoverImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
      setErrorMsg(`Storage Note: ${err?.message || 'Storage upload error'}. Local image preview generated.`);
    } finally {
      setUploadingCover(false);
    }
  };

  // Architecture Diagram File Upload Handler
  const handleDiagramFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDiagram(true);
    setErrorMsg(null);

    try {
      const url = await uploadFileToSupabaseStorage(file, 'architecture');
      setArchitectureDiagram(url);
    } catch (err: any) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setArchitectureDiagram(reader.result);
        }
      };
      reader.readAsDataURL(file);
      setErrorMsg(`Storage Note: ${err?.message || 'Storage upload error'}. Local image preview generated.`);
    } finally {
      setUploadingDiagram(false);
    }
  };

  // Multi-file Gallery Image Upload Handler
  const handleGalleryMultiFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingGallery(true);
    setErrorMsg(null);

    const uploadedItems: { url: string; caption: string }[] = [];

    for (const file of files) {
      try {
        const url = await uploadFileToSupabaseStorage(file, 'gallery');
        uploadedItems.push({ url, caption: '' });
      } catch (err: any) {
        // Fallback Base64 URL if storage fails
        await new Promise<void>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === 'string') {
              uploadedItems.push({ url: reader.result, caption: '' });
            }
            resolve();
          };
          reader.readAsDataURL(file);
        });
      }
    }

    setGalleryImages((prev) => [...prev, ...uploadedItems]);
    setUploadingGallery(false);
  };

  const handleUpdateGalleryCaption = (index: number, caption: string) => {
    setGalleryImages((prev) =>
      prev.map((img, idx) => (idx === index ? { ...img, caption } : img))
    );
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Validate step before advancing
  const validateStep = (step: number): boolean => {
    setErrorMsg(null);
    setRlsErrorHelp(false);

    if (step === 1) {
      if (!title.trim()) {
        setErrorMsg('Please enter a project title.');
        return false;
      }
      if (!slug.trim()) {
        setErrorMsg('Please specify a URL slug.');
        return false;
      }
      if (!shortDescription.trim()) {
        setErrorMsg('Please enter a short description.');
        return false;
      }
      if (categories.length === 0) {
        setErrorMsg('Please select at least one project category.');
        return false;
      }
    } else if (step === 3) {
      if (!coverImage.trim()) {
        setErrorMsg('Please provide a cover image or upload an image file.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrev = () => {
    setErrorMsg(null);
    setRlsErrorHelp(false);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Final Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(3)) return;

    setLoading(true);
    setErrorMsg(null);
    setRlsErrorHelp(false);

    const payload = {
      title,
      slug: slug || slugify(title),
      short_description: shortDescription,
      challenge: challenge || null,
      solution: solution || null,
      categories,
      tech_stack: techStack,
      cover_image: coverImage,
      architecture_diagram: architectureDiagram || null,
      github_url: githubUrl || null,
      live_url: liveUrl || null,
      video_demo_url: videoDemoUrl || null,
      status,
      is_featured: isFeatured,
      display_order: Number(displayOrder) || 0,
    };

    try {
      const supabase = createClient();
      
      // 1. Insert into projects table
      const { data: insertedProject, error: projectError } = await supabase
        .from('projects')
        .insert([payload])
        .select('id')
        .single();

      if (projectError) {
        if (
          projectError.message.includes('row-level security') ||
          projectError.message.includes('RLS') ||
          projectError.message.includes('policy') ||
          projectError.message.includes('categories')
        ) {
          setRlsErrorHelp(true);
          setErrorMsg(
            `Supabase RLS Policy / Schema Exception: ${projectError.message}. Please copy and run 'supabase/schema.sql' in your Supabase SQL Editor to update RLS permissions.`
          );
        } else {
          setErrorMsg(projectError.message);
        }
        setLoading(false);
        return;
      }

      // 2. Insert into project_images table if gallery images were uploaded
      if (insertedProject?.id && galleryImages.length > 0) {
        const imagePayloads = galleryImages.map((img, idx) => ({
          project_id: insertedProject.id,
          image_url: img.url,
          caption: img.caption || null,
          display_order: idx + 1,
        }));

        const { error: galleryError } = await supabase
          .from('project_images')
          .insert(imagePayloads);

        if (galleryError) {
          console.warn('Gallery images insert note:', galleryError.message);
        }
      }

      router.push('/admin/projects');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err?.message || 'An error occurred while creating the project.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-purple-400 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Projects List
          </Link>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <FolderPlus className="w-6 h-6 text-purple-400" />
            Create New Project
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Upload single/multiple images & add a project through our wizard.
          </p>
        </div>
      </div>

      {/* Stepper Header */}
      <div className="glass-card border-purple-500/20 bg-slate-950/70 p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STEPS.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  if (step.id < currentStep || validateStep(currentStep)) {
                    setCurrentStep(step.id);
                  }
                }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all text-left border ${
                  isActive
                    ? 'bg-purple-950/40 border-purple-500/50 text-white shadow-lg shadow-purple-500/10'
                    : isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-slate-900/30 border-slate-800 text-slate-400'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate">{step.name}</p>
                  <p className="text-[10px] text-slate-400 truncate hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <Alert variant="destructive" className="bg-red-950/40 border-red-500/30 text-red-300 space-y-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <AlertDescription className="text-xs leading-relaxed">{errorMsg}</AlertDescription>
          </div>
          {rlsErrorHelp && (
            <div className="pt-2 border-t border-red-900/50 text-[11px] text-red-200 space-y-1">
              <p className="font-semibold flex items-center gap-1">
                <ShieldX className="w-3.5 h-3.5 text-amber-400" /> Resolution Steps for RLS Error:
              </p>
              <p>1. Open your <strong>Supabase Dashboard &gt; SQL Editor</strong>.</p>
              <p>2. Copy & paste the contents of <code className="bg-black/60 px-1 py-0.5 rounded text-amber-300 font-mono">supabase/schema.sql</code> and click <strong>Run</strong>.</p>
              <p>This configures RLS policies allowing authenticated admins to insert projects and images.</p>
            </div>
          )}
        </Alert>
      )}

      {/* Wizard Form Body */}
      <Card className="glass-card border-purple-500/20 bg-slate-950/70 shadow-2xl relative overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400" />

        <form onSubmit={handleSubmit}>
          {/* STEP 1: BASIC INFO */}
          {currentStep === 1 && (
            <CardContent className="p-6 space-y-6">
              <div className="space-y-1 pb-2 border-b border-slate-800/60">
                <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Step 1: General Information
                </h3>
                <p className="text-xs text-slate-400">
                  Define title, URL slug, summary, and categories.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-xs uppercase font-semibold text-slate-300">
                    Project Title *
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g. DevSecOps Automated Pipeline"
                    value={title}
                    onChange={handleTitleChange}
                    className="bg-slate-900/60 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-purple-500/60"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="slug" className="text-xs uppercase font-semibold text-slate-300">
                      URL Slug *
                    </Label>
                    <label className="flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoSlug}
                        onChange={(e) => {
                          setAutoSlug(e.target.checked);
                          if (e.target.checked) setSlug(slugify(title));
                        }}
                        className="rounded border-slate-800 text-purple-600 focus:ring-0"
                      />
                      Auto-generate
                    </label>
                  </div>
                  <Input
                    id="slug"
                    placeholder="devsecops-automated-pipeline"
                    value={slug}
                    onChange={(e) => {
                      setAutoSlug(false);
                      setSlug(e.target.value);
                    }}
                    className="bg-slate-900/60 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-purple-500/60 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div className="space-y-2">
                <Label htmlFor="short_description" className="text-xs uppercase font-semibold text-slate-300">
                  Short Description / Summary *
                </Label>
                <Textarea
                  id="short_description"
                  rows={3}
                  placeholder="A brief overview of the project shown on showcase cards..."
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="bg-slate-900/60 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-purple-500/60 text-xs"
                />
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <Label className="text-xs uppercase font-semibold text-slate-300">
                  Project Categories * (Select all that apply)
                </Label>
                <div className="flex flex-wrap gap-3 pt-1">
                  {CATEGORY_OPTIONS.map((cat) => {
                    const selected = categories.includes(cat.id);
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCategory(cat.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                          selected
                            ? 'bg-purple-600/20 text-purple-200 border-purple-500/60 shadow-md shadow-purple-500/10'
                            : 'bg-slate-900/40 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${selected ? 'text-purple-400' : 'text-slate-500'}`} />
                        <span>{cat.label}</span>
                        {selected && <Check className="w-3.5 h-3.5 text-purple-400 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tech Stack Tag Manager */}
              <div className="space-y-2">
                <Label className="text-xs uppercase font-semibold text-slate-300">
                  Tech Stack Technologies
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add technology (e.g. Docker, Terraform, Next.js)"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTech();
                      }
                    }}
                    className="bg-slate-900/60 border-slate-800 text-slate-100 text-xs"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTech}
                    className="bg-slate-900 border-slate-800 text-slate-200 hover:text-white shrink-0 text-xs gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {techStack.map((tech) => (
                    <Badge
                      key={tech}
                      className="bg-purple-950/60 text-purple-300 border border-purple-800/40 px-3 py-1 text-xs gap-1.5 flex items-center"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tech)}
                        className="hover:text-red-300 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          )}

          {/* STEP 2: CASE STUDY & ARCHITECTURE */}
          {currentStep === 2 && (
            <CardContent className="p-6 space-y-6">
              <div className="space-y-1 pb-2 border-b border-slate-800/60">
                <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                  <FileCode2 className="w-4 h-4 text-purple-400" />
                  Step 2: Deep Dive Case Study
                </h3>
                <p className="text-xs text-slate-400">
                  Provide detailed challenge narrative, solution implementation, and architecture diagram.
                </p>
              </div>

              {/* Challenge */}
              <div className="space-y-2">
                <Label htmlFor="challenge" className="text-xs uppercase font-semibold text-rose-400">
                  The Challenge
                </Label>
                <Textarea
                  id="challenge"
                  rows={4}
                  placeholder="Describe the problem, bottlenecks, or security vulnerabilities addressed by this project..."
                  value={challenge}
                  onChange={(e) => setChallenge(e.target.value)}
                  className="bg-slate-900/60 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-purple-500/60 text-xs"
                />
              </div>

              {/* Solution */}
              <div className="space-y-2">
                <Label htmlFor="solution" className="text-xs uppercase font-semibold text-emerald-400">
                  The Solution
                </Label>
                <Textarea
                  id="solution"
                  rows={4}
                  placeholder="Explain the architectural pattern, tools, and technical strategy used to solve the challenge..."
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  className="bg-slate-900/60 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-purple-500/60 text-xs"
                />
              </div>

              {/* Architecture Diagram Upload / URL */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs uppercase font-semibold text-slate-300">
                    Architecture Diagram Image
                  </Label>
                  <button
                    type="button"
                    onClick={() => setDiagramMode(diagramMode === 'upload' ? 'url' : 'upload')}
                    className="text-[11px] text-purple-400 hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Switch to {diagramMode === 'upload' ? 'URL input' : 'File upload'}
                  </button>
                </div>

                {diagramMode === 'upload' ? (
                  <div className="border-2 border-dashed border-slate-800 hover:border-purple-500/50 transition-colors rounded-2xl p-6 text-center bg-slate-950/40 relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleDiagramFileUpload}
                      disabled={uploadingDiagram}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        {uploadingDiagram ? (
                          <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                        ) : (
                          <UploadCloud className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-200">
                          {uploadingDiagram ? 'Uploading to Supabase Storage...' : 'Click or Drag & Drop Architecture Image'}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          PNG, JPG, WEBP, or SVG diagram formats
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Input
                    id="architecture_diagram"
                    placeholder="https://images.unsplash.com/..."
                    value={architectureDiagram}
                    onChange={(e) => setArchitectureDiagram(e.target.value)}
                    className="bg-slate-900/60 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-purple-500/60 text-xs"
                  />
                )}

                {architectureDiagram && (
                  <div className="p-3 bg-black/40 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span className="truncate max-w-md">Diagram image: {architectureDiagram}</span>
                    <a
                      href={architectureDiagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:underline shrink-0"
                    >
                      View Full
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          )}

          {/* STEP 3: MEDIA & MULTIPLE GALLERY IMAGES */}
          {currentStep === 3 && (
            <CardContent className="p-6 space-y-6">
              <div className="space-y-1 pb-2 border-b border-slate-800/60">
                <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                  <Images className="w-4 h-4 text-purple-400" />
                  Step 3: Cover & Multiple Gallery Images
                </h3>
                <p className="text-xs text-slate-400">
                  Upload main cover image and additional gallery images with captions.
                </p>
              </div>

              {/* Cover Image Upload / Input */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs uppercase font-semibold text-slate-300">
                    Cover Image * (Main Showcase Image)
                  </Label>
                  <button
                    type="button"
                    onClick={() => setCoverMode(coverMode === 'upload' ? 'url' : 'upload')}
                    className="text-[11px] text-purple-400 hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Switch to {coverMode === 'upload' ? 'URL input' : 'File upload'}
                  </button>
                </div>

                {coverMode === 'upload' ? (
                  <div className="border-2 border-dashed border-purple-500/30 hover:border-purple-500 transition-colors rounded-2xl p-6 text-center bg-purple-950/10 relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverFileUpload}
                      disabled={uploadingCover}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {uploadingCover ? (
                          <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                        ) : (
                          <UploadCloud className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-200">
                          {uploadingCover ? 'Uploading to Supabase Storage...' : 'Click or Drag & Drop Main Cover Image'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Input
                    id="cover_image"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    required
                    className="bg-slate-900/60 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-purple-500/60 text-xs"
                  />
                )}

                {coverImage && (
                  <div className="mt-3 rounded-2xl overflow-hidden h-40 border border-purple-900/40 relative bg-black/40 shadow-xl">
                    <img
                      src={coverImage}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-3">
                      <span className="text-[11px] font-semibold text-purple-300 bg-purple-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-purple-500/30">
                        ✓ Main Cover Image
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* MULTIPLE GALLERY IMAGES SECTION */}
              <div className="space-y-4 pt-4 border-t border-slate-800/60">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs uppercase font-semibold text-slate-200 flex items-center gap-1.5">
                      <Images className="w-4 h-4 text-cyan-400" /> Multiple Project Gallery Images
                    </Label>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Upload multiple screenshots, UI flows, or architecture diagrams to project_images.
                    </p>
                  </div>
                  <Badge className="bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 text-xs">
                    {galleryImages.length} Images Attached
                  </Badge>
                </div>

                {/* Dropzone for Multiple Files */}
                <div className="border-2 border-dashed border-cyan-500/30 hover:border-cyan-500 transition-colors rounded-2xl p-6 text-center bg-cyan-950/10 relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleGalleryMultiFileUpload}
                    disabled={uploadingGallery}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-3 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      {uploadingGallery ? (
                        <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                      ) : (
                        <UploadCloud className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">
                        {uploadingGallery ? 'Uploading Multiple Images to Storage...' : 'Click or Drag & Drop Multiple Gallery Images'}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Select multiple files at once. Each image will be stored in <code className="text-cyan-300">project_images</code>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Gallery Images List with Editable Captions */}
                {galleryImages.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {galleryImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="glass-card p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2 flex flex-col justify-between"
                      >
                        <div className="relative h-32 w-full rounded-lg overflow-hidden bg-black/40">
                          <img
                            src={img.url}
                            alt={`Gallery image ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-950/80 text-red-300 hover:bg-red-900 transition-colors"
                            title="Remove image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="absolute bottom-2 left-2 text-[10px] font-mono bg-black/70 px-2 py-0.5 rounded text-slate-300">
                            #{idx + 1}
                          </span>
                        </div>
                        <Input
                          placeholder="Optional image caption..."
                          value={img.caption}
                          onChange={(e) => handleUpdateGalleryCaption(idx, e.target.value)}
                          className="bg-slate-950/60 border-slate-800 text-xs text-slate-200 placeholder:text-slate-600"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* External Link Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800/60">
                {/* Live Demo URL */}
                <div className="space-y-2">
                  <Label htmlFor="live_url" className="text-xs uppercase font-semibold text-slate-300 flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-cyan-400" /> Live Demo URL
                  </Label>
                  <Input
                    id="live_url"
                    placeholder="https://project.demo.com"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    className="bg-slate-900/60 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-purple-500/60 text-xs"
                  />
                </div>

                {/* GitHub URL */}
                <div className="space-y-2">
                  <Label htmlFor="github_url" className="text-xs uppercase font-semibold text-slate-300 flex items-center gap-1.5">
                    <FolderGit2 className="w-3.5 h-3.5 text-purple-400" /> GitHub Repository URL
                  </Label>
                  <Input
                    id="github_url"
                    placeholder="https://github.com/username/repo"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="bg-slate-900/60 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-purple-500/60 text-xs"
                  />
                </div>
              </div>

              {/* Video Demo URL */}
              <div className="space-y-2">
                <Label htmlFor="video_demo_url" className="text-xs uppercase font-semibold text-slate-300 flex items-center gap-1.5">
                  <Tv className="w-3.5 h-3.5 text-indigo-400" /> Video Demo URL (Optional)
                </Label>
                <Input
                  id="video_demo_url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={videoDemoUrl}
                  onChange={(e) => setVideoDemoUrl(e.target.value)}
                  className="bg-slate-900/60 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-purple-500/60 text-xs"
                />
              </div>
            </CardContent>
          )}

          {/* STEP 4: PUBLISH & REVIEW */}
          {currentStep === 4 && (
            <CardContent className="p-6 space-y-6">
              <div className="space-y-1 pb-2 border-b border-slate-800/60">
                <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  Step 4: Publishing Settings & Review
                </h3>
                <p className="text-xs text-slate-400">
                  Select publication status, featured flag, and verify details before saving.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status Selection */}
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-semibold text-slate-300">
                    Publication Status *
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['published', 'draft', 'archived'] as ProjectStatus[]).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setStatus(st)}
                        className={`py-2 px-3 rounded-lg text-xs font-semibold capitalize border transition-all cursor-pointer ${
                          status === st
                            ? st === 'published'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md'
                              : st === 'draft'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                            : 'bg-slate-900/40 text-slate-400 border-slate-800'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Display Order */}
                <div className="space-y-2">
                  <Label htmlFor="display_order" className="text-xs uppercase font-semibold text-slate-300">
                    Display Priority / Order
                  </Label>
                  <Input
                    id="display_order"
                    type="number"
                    min={0}
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="bg-slate-900/60 border-slate-800 text-slate-100 text-xs"
                  />
                </div>
              </div>

              {/* Is Featured Toggle */}
              <div className="flex items-center justify-between p-4 bg-purple-950/20 rounded-xl border border-purple-500/20">
                <div>
                  <h4 className="text-sm font-semibold text-slate-100">
                    Feature on Homepage Hero & Showcase?
                  </h4>
                  <p className="text-xs text-slate-400">
                    Featured projects get highlighted badges and top placement.
                  </p>
                </div>
                <Switch
                  checked={isFeatured}
                  onCheckedChange={(checked: boolean) => setIsFeatured(checked)}
                />
              </div>

              {/* Summary Card */}
              <div className="glass-card p-5 bg-slate-900/60 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Summary Review:
                </h4>
                <div className="space-y-1 text-xs text-slate-300">
                  <p><span className="text-slate-500">Title:</span> <strong className="text-white">{title || '—'}</strong></p>
                  <p><span className="text-slate-500">Slug:</span> <code className="text-purple-300 font-mono">{slug || '—'}</code></p>
                  <p><span className="text-slate-500">Categories:</span> {categories.join(', ')}</p>
                  <p><span className="text-slate-500">Tech Stack:</span> {techStack.join(', ')}</p>
                  <p><span className="text-slate-500">Gallery Images:</span> <span className="font-semibold text-cyan-300">{galleryImages.length} Attached</span></p>
                  <p><span className="text-slate-500">Status:</span> <span className="capitalize font-semibold text-emerald-400">{status}</span></p>
                </div>
              </div>
            </CardContent>
          )}

          {/* Footer Controls */}
          <CardFooter className="flex items-center justify-between p-6 border-t border-slate-800/60 bg-slate-950/40">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 1 || loading}
              className="bg-slate-900 border-slate-800 text-slate-300 hover:text-white cursor-pointer text-xs gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </Button>

            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="btn-primary-gradient px-6 py-2.5 text-xs font-semibold text-white shadow-md cursor-pointer gap-1.5"
              >
                Next Step <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={loading}
                className="btn-primary-gradient px-8 py-2.5 font-bold text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    Saving Project & Gallery...
                  </span>
                ) : (
                  'Create Project'
                )}
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
