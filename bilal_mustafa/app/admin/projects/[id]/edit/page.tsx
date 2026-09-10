'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { MOCK_PROJECTS } from '@/lib/supabase/mockData';
import { Project, ProjectCategory, ProjectStatus } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  FolderEdit,
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
  Images,
  Trash2,
  Save,
  Server,
} from 'lucide-react';

const CATEGORY_OPTIONS: { id: ProjectCategory; label: string; icon: typeof Layout }[] = [
  { id: 'frontend', label: 'FrontEnd', icon: Layout },
  { id: 'backend', label: 'BackEnd', icon: Server },
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

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditProjectPage({ params }: Props) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [categories, setCategories] = useState<ProjectCategory[]>(['frontend']);
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');

  const [challenge, setChallenge] = useState('');
  const [solution, setSolution] = useState('');
  const [architectureDiagram, setArchitectureDiagram] = useState('');

  const [coverImage, setCoverImage] = useState('');
  const [galleryImages, setGalleryImages] = useState<{ url: string; caption: string }[]>([]);

  const [liveUrl, setLiveUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [videoDemoUrl, setVideoDemoUrl] = useState('');

  const [status, setStatus] = useState<ProjectStatus>('published');
  const [isFeatured, setIsFeatured] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(0);

  // File Upload Modes
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingDiagram, setUploadingDiagram] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [coverMode, setCoverMode] = useState<'upload' | 'url'>('url');
  const [diagramMode, setDiagramMode] = useState<'upload' | 'url'>('url');

  // Load project details on mount
  useEffect(() => {
    async function loadProjectData() {
      setInitialLoading(true);
      setErrorMsg(null);

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('projects')
          .select('*, images:project_images(*)')
          .or(`id.eq.${projectId},slug.eq.${projectId}`)
          .single();

        let proj: Project | null = null;
        if (data) {
          proj = data as unknown as Project;
        } else {
          proj = MOCK_PROJECTS.find((p) => p.id === projectId || p.slug === projectId) || null;
        }

        if (proj) {
          setTitle(proj.title || '');
          setSlug(proj.slug || '');
          setShortDescription(proj.short_description || '');
          setCategories(proj.categories && proj.categories.length > 0 ? proj.categories : ['frontend']);
          setTechStack(proj.tech_stack || []);
          setChallenge(proj.challenge || '');
          setSolution(proj.solution || '');
          setArchitectureDiagram(proj.architecture_diagram || '');
          setCoverImage(proj.cover_image || '');
          setLiveUrl(proj.live_url || '');
          setGithubUrl(proj.github_url || '');
          setVideoDemoUrl(proj.video_demo_url || '');
          setStatus(proj.status || 'published');
          setIsFeatured(Boolean(proj.is_featured));
          setDisplayOrder(proj.display_order ?? 0);

          if (proj.images && Array.isArray(proj.images) && proj.images.length > 0) {
            const sortedImages = [...proj.images].sort(
              (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
            );
            setGalleryImages(
              sortedImages.map((img) => ({
                url: img.image_url,
                caption: img.caption || '',
              }))
            );
          }
        } else {
          setErrorMsg('Project not found in database or fallback records.');
        }
      } catch (err) {
        console.error('Error fetching project for edit:', err);
        const fallback = MOCK_PROJECTS.find((p) => p.id === projectId || p.slug === projectId);
        if (fallback) {
          setTitle(fallback.title);
          setSlug(fallback.slug);
          setShortDescription(fallback.short_description);
          setCategories(fallback.categories);
          setTechStack(fallback.tech_stack);
          setChallenge(fallback.challenge || '');
          setSolution(fallback.solution || '');
          setArchitectureDiagram(fallback.architecture_diagram || '');
          setCoverImage(fallback.cover_image);
          setLiveUrl(fallback.live_url || '');
          setGithubUrl(fallback.github_url || '');
          setVideoDemoUrl(fallback.video_demo_url || '');
          setStatus(fallback.status);
          setIsFeatured(fallback.is_featured);
          setDisplayOrder(fallback.display_order);
        } else {
          setErrorMsg('Could not load project details.');
        }
      } finally {
        setInitialLoading(false);
      }
    }

    loadProjectData();
  }, [projectId]);

  // Category Toggle
  const toggleCategory = (cat: ProjectCategory) => {
    if (categories.includes(cat)) {
      if (categories.length === 1) return;
      setCategories(categories.filter((c) => c !== cat));
    } else {
      setCategories([...categories, cat]);
    }
  };

  // Tech Stack Handlers
  const addTechItem = () => {
    if (techInput.trim() && !techStack.includes(techInput.trim())) {
      setTechStack([...techStack, techInput.trim()]);
      setTechInput('');
    }
  };

  const removeTechItem = (techToRemove: string) => {
    setTechStack(techStack.filter((t) => t !== techToRemove));
  };

  // Cover Image Upload Handler
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    setErrorMsg(null);
    try {
      const publicUrl = await uploadFileToSupabaseStorage(file, 'covers');
      setCoverImage(publicUrl);
    } catch (err: any) {
      setErrorMsg(`Failed to upload cover image: ${err?.message || 'Storage error'}`);
    } finally {
      setUploadingCover(false);
    }
  };

  // Architecture Diagram Upload Handler
  const handleDiagramUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDiagram(true);
    setErrorMsg(null);
    try {
      const publicUrl = await uploadFileToSupabaseStorage(file, 'diagrams');
      setArchitectureDiagram(publicUrl);
    } catch (err: any) {
      setErrorMsg(`Failed to upload architecture diagram: ${err?.message || 'Storage error'}`);
    } finally {
      setUploadingDiagram(false);
    }
  };

  // Gallery Multiple Files Upload Handler
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    setErrorMsg(null);
    try {
      const newImages: { url: string; caption: string }[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadFileToSupabaseStorage(files[i], 'gallery');
        newImages.push({ url, caption: '' });
      }
      setGalleryImages((prev) => [...prev, ...newImages]);
    } catch (err: any) {
      setErrorMsg(`Failed to upload gallery image: ${err?.message || 'Storage error'}`);
    } finally {
      setUploadingGallery(false);
    }
  };

  const addGalleryUrl = () => {
    setGalleryImages((prev) => [...prev, { url: '', caption: '' }]);
  };

  const updateGalleryImage = (index: number, field: 'url' | 'caption', value: string) => {
    setGalleryImages((prev) =>
      prev.map((img, idx) => (idx === index ? { ...img, [field]: value } : img))
    );
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const validateStep = (step: number): boolean => {
    setErrorMsg(null);
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
        setErrorMsg('Please provide a cover image URL or upload a cover image.');
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
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(3)) return;

    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

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
      updated_at: new Date().toISOString(),
    };

    try {
      const supabase = createClient();

      // 1. Update projects table
      const { error: updateError } = await supabase
        .from('projects')
        .update(payload)
        .eq('id', projectId);

      if (updateError) {
        throw new Error(updateError.message);
      }

      // 2. Refresh gallery images
      const validGalleryImages = galleryImages.filter((img) => img.url.trim() !== '');
      
      // Clear old gallery images
      await supabase.from('project_images').delete().eq('project_id', projectId);

      if (validGalleryImages.length > 0) {
        const imagePayloads = validGalleryImages.map((img, idx) => ({
          project_id: projectId,
          image_url: img.url,
          caption: img.caption || null,
          display_order: idx + 1,
        }));

        await supabase.from('project_images').insert(imagePayloads);
      }

      setSuccessMsg('Project updated successfully!');
      setTimeout(() => {
        router.push('/admin/projects');
        router.refresh();
      }, 1000);
    } catch (err: any) {
      console.error('Error updating project:', err);
      setErrorMsg(err?.message || 'Failed to update project in database.');
      setSaving(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="py-24 text-center space-y-3 glass-card rounded-2xl border-purple-500/20 max-w-xl mx-auto my-10">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
        <p className="text-sm text-slate-300 font-medium">Loading project details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-purple-400 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Projects Management
          </Link>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <FolderEdit className="w-6 h-6 text-purple-400" />
            Edit Project
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Update project metadata, architecture diagrams, images & status.
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
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-purple-950/60 border-purple-500/50 text-white shadow-lg'
                    : isCompleted
                    ? 'bg-slate-900/60 border-emerald-500/30 text-emerald-300 hover:border-emerald-500/50'
                    : 'bg-slate-900/30 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isActive
                      ? 'bg-purple-500 text-white'
                      : isCompleted
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.id}
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

      {errorMsg && (
        <Alert className="bg-rose-950/40 border-rose-800/50 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <AlertDescription>{errorMsg}</AlertDescription>
        </Alert>
      )}

      {successMsg && (
        <Alert className="bg-emerald-950/40 border-emerald-800/50 text-emerald-300 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <AlertDescription>{successMsg}</AlertDescription>
        </Alert>
      )}

      {/* Main Wizard Form Card */}
      <form onSubmit={handleSubmit}>
        <Card className="glass-card border-purple-500/20 bg-slate-950/80 p-6 sm:p-8 space-y-6">
          {/* STEP 1: BASIC INFO */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="border-b border-purple-900/30 pb-4">
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <FileCode2 className="w-5 h-5 text-purple-400" />
                  Basic Information & Categorization
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Define title, URL slug, categories, and technical tags.
                </p>
              </div>

              {/* Title & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-xs font-semibold text-slate-200">
                    Project Title <span className="text-purple-400">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g. DevSecOps Automated Pipeline"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-slate-900/80 border-slate-800 text-slate-100 text-sm focus:border-purple-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-xs font-semibold text-slate-200">
                    URL Slug <span className="text-purple-400">*</span>
                  </Label>
                  <Input
                    id="slug"
                    placeholder="devsecops-automated-pipeline"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="bg-slate-900/80 border-slate-800 text-slate-100 text-sm font-mono focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              {/* Short Description */}
              <div className="space-y-2">
                <Label htmlFor="shortDescription" className="text-xs font-semibold text-slate-200">
                  Short Summary / Subtitle <span className="text-purple-400">*</span>
                </Label>
                <Textarea
                  id="shortDescription"
                  placeholder="A concise overview of the project's purpose and architecture..."
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  rows={3}
                  className="bg-slate-900/80 border-slate-800 text-slate-100 text-sm focus:border-purple-500"
                  required
                />
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <Label className="text-xs font-semibold text-slate-200">
                  Project Categories <span className="text-purple-400">*</span>
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {CATEGORY_OPTIONS.map((cat) => {
                    const IconComp = cat.icon;
                    const isSelected = categories.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCategory(cat.id)}
                        className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-purple-950/60 border-purple-500/60 text-purple-200 shadow-md'
                            : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <IconComp className={`w-4 h-4 ${isSelected ? 'text-purple-400' : 'text-slate-500'}`} />
                        <span className="text-xs font-semibold">{cat.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-purple-400 ml-auto" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tech Stack Tags */}
              <div className="space-y-3">
                <Label className="text-xs font-semibold text-slate-200">
                  Technologies & Tools Stack
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. Next.js 16, Docker, Terraform"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTechItem();
                      }
                    }}
                    className="bg-slate-900/80 border-slate-800 text-slate-100 text-sm focus:border-purple-500"
                  />
                  <Button
                    type="button"
                    onClick={addTechItem}
                    variant="outline"
                    className="bg-purple-950/40 border-purple-800/40 text-purple-300 hover:bg-purple-900/60 text-xs shrink-0 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {techStack.map((tech) => (
                    <Badge
                      key={tech}
                      className="bg-purple-950/60 text-purple-200 border-purple-800/40 px-3 py-1 text-xs gap-1.5 flex items-center"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTechItem(tech)}
                        className="text-purple-400 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: CASE STUDY */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="border-b border-purple-900/30 pb-4">
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Case Study: Challenge & Solution
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Detail the engineering challenge faced and the solution implemented.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="challenge" className="text-xs font-semibold text-slate-200">
                  The Challenge
                </Label>
                <Textarea
                  id="challenge"
                  placeholder="Describe the problem, bottlenecks, or security vulnerability..."
                  value={challenge}
                  onChange={(e) => setChallenge(e.target.value)}
                  rows={4}
                  className="bg-slate-900/80 border-slate-800 text-slate-100 text-sm focus:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="solution" className="text-xs font-semibold text-slate-200">
                  The Solution
                </Label>
                <Textarea
                  id="solution"
                  placeholder="Describe the architectural fix, automated pipeline, or security strategy..."
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  rows={4}
                  className="bg-slate-900/80 border-slate-800 text-slate-100 text-sm focus:border-purple-500"
                />
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-slate-200">
                    System Architecture Diagram
                  </Label>
                  <div className="flex bg-slate-900/80 p-0.5 rounded-lg border border-slate-800 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setDiagramMode('url')}
                      className={`px-2.5 py-1 rounded-md font-semibold ${
                        diagramMode === 'url' ? 'bg-purple-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      Image URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setDiagramMode('upload')}
                      className={`px-2.5 py-1 rounded-md font-semibold ${
                        diagramMode === 'upload' ? 'bg-purple-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      Upload File
                    </button>
                  </div>
                </div>

                {diagramMode === 'url' ? (
                  <Input
                    placeholder="https://images.unsplash.com/photo-..."
                    value={architectureDiagram}
                    onChange={(e) => setArchitectureDiagram(e.target.value)}
                    className="bg-slate-900/80 border-slate-800 text-slate-100 text-sm font-mono focus:border-purple-500"
                  />
                ) : (
                  <div className="flex items-center gap-3">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleDiagramUpload}
                      disabled={uploadingDiagram}
                      className="bg-slate-900/80 border-slate-800 text-slate-100 text-xs"
                    />
                    {uploadingDiagram && <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />}
                  </div>
                )}

                {architectureDiagram && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-purple-900/30 max-h-48 max-w-md bg-black/40 p-2">
                    <img
                      src={architectureDiagram}
                      alt="Architecture Diagram Preview"
                      className="max-h-44 object-contain mx-auto rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: MEDIA & GALLERY */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="border-b border-purple-900/30 pb-4">
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-purple-400" />
                  Cover Showcase, Screenshots & External Links
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Upload cover photo, add multiple gallery screenshots, and project URLs.
                </p>
              </div>

              {/* Cover Image Upload / Input */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-slate-200">
                    Project Cover Image <span className="text-purple-400">*</span>
                  </Label>
                  <div className="flex bg-slate-900/80 p-0.5 rounded-lg border border-slate-800 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setCoverMode('url')}
                      className={`px-2.5 py-1 rounded-md font-semibold ${
                        coverMode === 'url' ? 'bg-purple-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      Image URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverMode('upload')}
                      className={`px-2.5 py-1 rounded-md font-semibold ${
                        coverMode === 'upload' ? 'bg-purple-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      Upload File
                    </button>
                  </div>
                </div>

                {coverMode === 'url' ? (
                  <Input
                    placeholder="https://images.unsplash.com/photo-..."
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="bg-slate-900/80 border-slate-800 text-slate-100 text-sm font-mono focus:border-purple-500"
                    required
                  />
                ) : (
                  <div className="flex items-center gap-3">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      disabled={uploadingCover}
                      className="bg-slate-900/80 border-slate-800 text-slate-100 text-xs"
                    />
                    {uploadingCover && <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />}
                  </div>
                )}

                {coverImage && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-purple-900/30 max-h-48 max-w-md bg-black/40 p-2">
                    <img
                      src={coverImage}
                      alt="Cover Preview"
                      className="max-h-44 object-cover w-full rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Gallery Images List */}
              <div className="space-y-4 pt-4 border-t border-purple-900/20">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      <Images className="w-4 h-4 text-purple-400" />
                      Project Screenshot Gallery ({galleryImages.length})
                    </Label>
                    <p className="text-[11px] text-slate-400">
                      Add extra images/screenshots shown on the project details page.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="btn-secondary-outline cursor-pointer px-3 py-1.5 text-xs font-semibold inline-flex items-center gap-1">
                      <UploadCloud className="w-3.5 h-3.5 text-purple-400" />
                      Upload Files
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryUpload}
                        className="hidden"
                        disabled={uploadingGallery}
                      />
                    </label>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addGalleryUrl}
                      className="bg-slate-900/60 border-slate-800 text-slate-300 text-xs"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add URL
                    </Button>
                  </div>
                </div>

                {uploadingGallery && (
                  <div className="flex items-center gap-2 text-xs text-purple-300 bg-purple-950/30 p-2.5 rounded-lg border border-purple-800/30">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Uploading gallery images to Supabase storage...
                  </div>
                )}

                {galleryImages.length === 0 ? (
                  <p className="text-xs text-slate-500 italic bg-slate-900/30 p-4 rounded-xl border border-slate-800 text-center">
                    No screenshot gallery images added yet. Click &quot;Upload Files&quot; or &quot;Add URL&quot; above.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {galleryImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800"
                      >
                        {img.url ? (
                          <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-700 bg-slate-950">
                            <img
                              src={img.url}
                              alt={`Gallery screenshot ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-12 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 text-slate-500 text-[10px]">
                            No URL
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1 w-full">
                          <Input
                            placeholder="Image URL"
                            value={img.url}
                            onChange={(e) => updateGalleryImage(idx, 'url', e.target.value)}
                            className="bg-slate-950/80 border-slate-800 text-xs font-mono text-slate-200"
                          />
                          <Input
                            placeholder="Caption (e.g. Security Audit Log View)"
                            value={img.caption}
                            onChange={(e) => updateGalleryImage(idx, 'caption', e.target.value)}
                            className="bg-slate-950/80 border-slate-800 text-xs text-slate-200"
                          />
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeGalleryImage(idx)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-950/30 shrink-0 self-end sm:self-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* External URLs */}
              <div className="space-y-4 pt-4 border-t border-purple-900/20">
                <Label className="text-xs font-semibold text-slate-200">External Links</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="liveUrl" className="text-[11px] text-slate-400 flex items-center gap-1">
                      <LinkIcon className="w-3 h-3 text-cyan-400" /> Live Demo URL
                    </Label>
                    <Input
                      id="liveUrl"
                      placeholder="https://demo.com"
                      value={liveUrl}
                      onChange={(e) => setLiveUrl(e.target.value)}
                      className="bg-slate-900/80 border-slate-800 text-slate-100 text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="githubUrl" className="text-[11px] text-slate-400 flex items-center gap-1">
                      <FolderGit2 className="w-3 h-3 text-purple-400" /> GitHub Repository
                    </Label>
                    <Input
                      id="githubUrl"
                      placeholder="https://github.com/username/repo"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      className="bg-slate-900/80 border-slate-800 text-slate-100 text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="videoDemoUrl" className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Tv className="w-3 h-3 text-emerald-400" /> Video Demo URL
                    </Label>
                    <Input
                      id="videoDemoUrl"
                      placeholder="https://youtube.com/watch?v=..."
                      value={videoDemoUrl}
                      onChange={(e) => setVideoDemoUrl(e.target.value)}
                      className="bg-slate-900/80 border-slate-800 text-slate-100 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PUBLISH & REVIEW */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="border-b border-purple-900/30 pb-4">
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Publishing Controls & Summary
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Configure status, featured state, and display order before saving.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Status Selection */}
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-xs font-semibold text-slate-200">
                    Publication Status
                  </Label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                    className="w-full h-9 rounded-md bg-slate-900 border border-slate-800 text-slate-100 text-xs px-3 focus:border-purple-500"
                  >
                    <option value="published">Published (Visible on Portfolio)</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                {/* Display Order */}
                <div className="space-y-2">
                  <Label htmlFor="displayOrder" className="text-xs font-semibold text-slate-200">
                    Display Order / Priority
                  </Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="bg-slate-900/80 border-slate-800 text-slate-100 text-xs"
                  />
                </div>

                {/* Is Featured Toggle */}
                <div className="space-y-2 flex flex-col justify-end">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <div className="space-y-0.5">
                      <Label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        Featured Project
                      </Label>
                      <p className="text-[10px] text-slate-400">Show high-priority highlight badge</p>
                    </div>
                    <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
                  </div>
                </div>
              </div>

              {/* Review Summary Box */}
              <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-900/40 space-y-3">
                <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                  Summary of Changes
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400">Title:</span>{' '}
                    <span className="text-white font-medium">{title}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Slug:</span>{' '}
                    <span className="text-purple-300 font-mono">/{slug}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Categories:</span>{' '}
                    <span className="text-cyan-300">{categories.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Tech Stack:</span>{' '}
                    <span className="text-slate-200">{techStack.join(', ') || 'None'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Status:</span>{' '}
                    <span className="text-emerald-400 font-semibold">{status}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Gallery Images:</span>{' '}
                    <span className="text-slate-200">{galleryImages.length} images</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Wizard Navigation Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-purple-900/30">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrev}
                disabled={saving}
                className="bg-slate-900/60 border-slate-800 text-slate-300 hover:text-white text-xs cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Previous Step
              </Button>
            ) : (
              <Link href="/admin/projects">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-slate-400 hover:text-slate-200 text-xs"
                >
                  Cancel
                </Button>
              </Link>
            )}

            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="btn-primary-gradient cursor-pointer text-xs"
              >
                Next Step <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={saving}
                className="btn-primary-gradient cursor-pointer text-xs px-6 py-2.5 font-bold shadow-lg flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Project Changes
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>
      </form>
    </div>
  );
}
