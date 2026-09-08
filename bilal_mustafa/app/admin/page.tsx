import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FolderKanban, Award, Inbox, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
  let publishedProjectsCount = 0;
  let totalProjectsCount = 0;
  let unreadMessagesCount = 0;
  let totalMessagesCount = 0;
  let totalCertificationsCount = 0;

  try {
    const supabase = await createClient();

    const [projectsRes, certsRes, msgsRes] = await Promise.all([
      supabase.from('projects').select('status'),
      supabase.from('certifications').select('id', { count: 'exact', head: true }),
      supabase.from('messages').select('is_read'),
    ]);

    if (projectsRes.data) {
      totalProjectsCount = projectsRes.data.length;
      publishedProjectsCount = projectsRes.data.filter((p) => p.status === 'published').length;
    }

    if (certsRes.count !== null) {
      totalCertificationsCount = certsRes.count;
    }

    if (msgsRes.data) {
      totalMessagesCount = msgsRes.data.length;
      unreadMessagesCount = msgsRes.data.filter((m) => !m.is_read).length;
    }
  } catch (err) {
    console.error('Error fetching dashboard stats from Supabase:', err);
  }

  const stats = [
    {
      title: 'Projects Managed',
      value: `${publishedProjectsCount} / ${totalProjectsCount}`,
      subtitle: `${publishedProjectsCount} Published`,
      icon: FolderKanban,
      href: '/admin/projects',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      title: 'Certifications',
      value: `${totalCertificationsCount}`,
      subtitle: 'Active credentials',
      icon: Award,
      href: '/admin/certifications',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10 border-cyan-500/20',
    },
    {
      title: 'Inbox Messages',
      value: `${unreadMessagesCount}`,
      subtitle: `${unreadMessagesCount} Unread (${totalMessagesCount} Total)`,
      icon: Inbox,
      href: '/admin/inbox',
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10 border-indigo-500/20',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="glass-card p-6 border-purple-500/20 bg-gradient-to-r from-slate-950/80 via-purple-950/30 to-slate-950/80 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Supabase Protected Dashboard
            </div>
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
              Welcome back, Admin
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage your portfolio content, review incoming messages, and update certifications.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/admin/projects">
              <Button className="btn-primary-gradient cursor-pointer gap-2 text-xs">
                Manage Projects
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="glass-card border-purple-500/20 bg-slate-950/60 hover:border-purple-500/40 transition-all group">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    {stat.title}
                  </CardDescription>
                  <div className={`p-2 rounded-xl border ${stat.bgColor} ${stat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-extrabold text-slate-100 mt-2">
                  {stat.value}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-slate-400 mb-4">{stat.subtitle}</p>
                <Link
                  href={stat.href}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors group-hover:translate-x-1 duration-200"
                >
                  View Details <ArrowRight className="w-3 h-3" />
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Info Card */}
      <Card className="glass-card border-purple-500/20 bg-slate-950/60 p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-slate-200">
              Authentication & Security Active
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
              All routes under <code className="text-purple-300 font-mono bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-800/40">/admin/*</code> are protected by Next.js Middleware with Supabase session validation. Unauthenticated requests are automatically intercepted and redirected to the login endpoint.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}


