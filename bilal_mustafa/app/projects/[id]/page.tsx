import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { MOCK_PROJECTS } from '@/lib/supabase/mockData';
import { Project } from '@/types';
import ProjectDetailView from '@/components/ProjectDetailView';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

async function getProject(id: string): Promise<Project> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('projects')
      .select('*, images:project_images(*)')
      .or(`id.eq.${id},slug.eq.${id}`)
      .single();

    if (data) {
      const project = data as unknown as Project;
      if (project.images && Array.isArray(project.images)) {
        project.images.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
      }
      return project;
    }
  } catch (err) {
    console.error('Error fetching project detail from Supabase:', err);
  }

  return (
    MOCK_PROJECTS.find((p) => p.id === id || p.slug === id) || MOCK_PROJECTS[0]
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);
  return {
    title: `${project.title} | Projects Showcase`,
    description: project.short_description,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const project = await getProject(id);

  return <ProjectDetailView project={project} />;
}