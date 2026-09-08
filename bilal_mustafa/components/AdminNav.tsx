'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  FolderKanban,
  Award,
  Inbox,
  FileText,
  LogOut,
  User,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.email) {
        setUserEmail(data.user.email);
      }
    });
  }, []);

  const handleSignOut = async () => {
    setLoggingOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
      setLoggingOut(false);
    }
  };

  const navItems = [
    {
      name: 'Overview',
      href: '/admin',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: 'Projects',
      href: '/admin/projects',
      icon: FolderKanban,
      exact: false,
    },
    {
      name: 'Certifications',
      href: '/admin/certifications',
      icon: Award,
      exact: false,
    },
    {
      name: 'Resume / CV',
      href: '/admin/cv',
      icon: FileText,
      exact: false,
    },
    {
      name: 'Inbox',
      href: '/admin/inbox',
      icon: Inbox,
      exact: false,
    },
  ];

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  return (
    <aside className="w-full md:w-64 shrink-0 space-y-6">
      {/* Admin Profile & Status Card */}
      <div className="glass-card p-5 border-purple-500/20 bg-slate-950/60 backdrop-blur-md space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <h2 className="text-sm font-semibold text-slate-100 truncate">
              Admin Portal
            </h2>
            <p className="text-xs text-slate-400 truncate flex items-center gap-1">
              <User className="w-3 h-3 shrink-0" />
              {userEmail || 'Authenticated'}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Protected
          </span>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-slate-400 hover:text-purple-400 transition-colors"
          >
            Site View <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="glass-card p-3 border-purple-500/20 bg-slate-950/60 backdrop-blur-md space-y-1">
        <p className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Management
        </p>
        {navItems.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-md shadow-purple-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? 'text-purple-400' : 'text-slate-500'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}

        <div className="pt-4 mt-2 border-t border-slate-800/60">
          <Button
            variant="ghost"
            onClick={handleSignOut}
            disabled={loggingOut}
            className="w-full justify-start gap-3 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-950/30 cursor-pointer rounded-lg"
          >
            <LogOut className="w-4 h-4 text-red-400 shrink-0" />
            <span>{loggingOut ? 'Signing Out...' : 'Sign Out'}</span>
          </Button>
        </div>
      </nav>
    </aside>
  );
}
