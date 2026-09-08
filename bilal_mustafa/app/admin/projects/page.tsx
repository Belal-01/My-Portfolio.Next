'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MOCK_PROJECTS } from '@/lib/supabase/mockData';
import { Project } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  FolderKanban,
  Plus,
  Eye,
  EyeOff,
  Trash2,
  Loader2,
  AlertCircle,
  ExternalLink,
  Pencil,
} from 'lucide-react';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects from Supabase:', error);
        setErrorMsg('Could not fetch projects from database. Showing fallback data.');
        setProjects(MOCK_PROJECTS);
      } else if (data && data.length > 0) {
        setProjects(data as Project[]);
      } else {
        // Table is empty or no projects returned
        setProjects([]);
      }
    } catch (err) {
      console.error('Unexpected error fetching projects:', err);
      setErrorMsg('An unexpected error occurred while loading projects.');
      setProjects(MOCK_PROJECTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: false });

        if (ignore) return;

        if (error) {
          console.error('Error fetching projects from Supabase:', error);
          setErrorMsg('Could not fetch projects from database. Showing fallback data.');
          setProjects(MOCK_PROJECTS);
        } else if (data && data.length > 0) {
          setProjects(data as Project[]);
        } else {
          setProjects([]);
        }
      } catch (err) {
        if (ignore) return;
        console.error('Unexpected error fetching projects:', err);
        setErrorMsg('An unexpected error occurred while loading projects.');
        setProjects(MOCK_PROJECTS);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      ignore = true;
    };
  }, []);

  const togglePublish = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
    setActionLoadingId(id);
    setErrorMsg(null);

    // Optimistic update
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: nextStatus as any } : p))
    );

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('projects')
        .update({ status: nextStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Error toggling project publish status:', error);
        setErrorMsg(`Failed to update status: ${error.message}`);
        // Revert optimistic update
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: currentStatus as any } : p))
        );
      }
    } catch (err) {
      console.error('Error updating project status:', err);
      setErrorMsg('Failed to update project status in Supabase.');
      // Revert optimistic update
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: currentStatus as any } : p))
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const deleteProject = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    setActionLoadingId(id);
    setErrorMsg(null);

    // Optimistic remove
    const prevProjects = [...projects];
    setProjects((prev) => prev.filter((p) => p.id !== id));

    try {
      const supabase = createClient();
      const { error } = await supabase.from('projects').delete().eq('id', id);

      if (error) {
        console.error('Error deleting project from Supabase:', error);
        setErrorMsg(`Failed to delete project: ${error.message}`);
        setProjects(prevProjects);
      }
    } catch (err) {
      console.error('Unexpected error deleting project:', err);
      setErrorMsg('Failed to delete project from Supabase.');
      setProjects(prevProjects);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-purple-400" />
            Projects Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Live management of your portfolio showcase projects stored in Supabase.
          </p>
        </div>

        <Link href="/admin/projects/new">
          <Button className="btn-primary-gradient cursor-pointer gap-2 text-xs">
            <Plus className="w-4 h-4" />
            Add New Project
          </Button>
        </Link>
      </div>

      {errorMsg && (
        <Alert className="bg-rose-950/40 border-rose-800/50 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <AlertDescription>{errorMsg}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="py-20 text-center space-y-3 glass-card rounded-2xl border-purple-500/20">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
          <p className="text-sm text-slate-400 font-medium">Fetching projects from Supabase...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="py-16 text-center space-y-4 glass-card rounded-2xl border-purple-500/20 p-8">
          <FolderKanban className="w-12 h-12 text-slate-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-slate-200">No projects found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Your Supabase database does not have any project records yet. Create your first project to get started!
            </p>
          </div>
          <Link href="/admin/projects/new" className="inline-block pt-2">
            <Button className="btn-primary-gradient cursor-pointer gap-2 text-xs">
              <Plus className="w-4 h-4" />
              Create First Project
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {projects.map((project) => {
            const isProcessing = actionLoadingId === project.id;

            return (
              <Card key={project.id} className="glass-card border-purple-500/20 bg-slate-950/60 p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {project.cover_image && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-purple-900/30 hidden sm:block">
                        <img
                          src={project.cover_image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-semibold text-slate-100">
                          {project.title}
                        </h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            project.status === 'published'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}
                        >
                          {project.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                        {project.is_featured && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-950/60 text-purple-300 border border-purple-800/40">
                            ★ Featured
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 max-w-2xl">
                        {project.short_description}
                      </p>

                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {project.categories?.map((cat) => (
                          <span
                            key={cat}
                            className="px-2.5 py-0.5 rounded-full bg-cyan-950/40 text-cyan-300 text-[10px] font-semibold border border-cyan-800/30 uppercase tracking-wider"
                          >
                            {cat}
                          </span>
                        ))}
                        {project.tech_stack?.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-purple-950/40 text-purple-300 text-[11px] border border-purple-800/30"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                    <Link href={`/projects/${project.id}`} target="_blank">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-slate-200 text-xs gap-1"
                        title="Preview Public Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Preview
                      </Button>
                    </Link>

                    <Link href={`/admin/projects/${project.id}/edit`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-purple-950/40 border-purple-800/40 text-purple-300 hover:bg-purple-900/60 hover:text-white cursor-pointer text-xs gap-1.5"
                        title="Edit Project Details"
                      >
                        <Pencil className="w-3.5 h-3.5 text-purple-400" />
                        Edit
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isProcessing}
                      onClick={() => togglePublish(project.id, project.status)}
                      className="bg-slate-900/60 border-slate-800 text-slate-300 hover:text-white cursor-pointer text-xs gap-1.5"
                    >
                      {isProcessing ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : project.status === 'published' ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-amber-400" /> Unpublish
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 text-emerald-400" /> Publish
                        </>
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isProcessing}
                      onClick={() => deleteProject(project.id, project.title)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-950/30 cursor-pointer text-xs"
                      title="Delete Project"
                    >
                      {isProcessing ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

