'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Mail, Eye, EyeOff, ArrowLeft, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err?.message || 'An unexpected authentication error occurred.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md px-4 py-8">
      {/* Background Decorative Glow Elements */}
      <div className="relative">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <Card className="glass-card border-purple-500/20 bg-slate-950/70 backdrop-blur-xl shadow-2xl relative z-10 overflow-hidden">
          {/* Top Decorative Gradient Accent Line */}
          <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400" />

          <CardHeader className="text-center pt-8 pb-4 space-y-2">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shadow-lg shadow-purple-500/10">
              <ShieldCheck className="w-7 h-7 text-purple-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-100 tracking-tight">
              Admin Access
            </CardTitle>
            <CardDescription className="text-slate-400 text-sm">
              Sign in with your Supabase credentials to manage portfolio settings.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            {errorMsg && (
              <Alert variant="destructive" className="bg-red-950/40 border-red-500/30 text-red-300 animate-in fade-in slide-in-from-top-2 duration-200">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <AlertDescription className="text-xs leading-relaxed">
                  {errorMsg}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Input Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="pl-10 bg-slate-900/60 border-slate-800 focus:border-purple-500/60 focus:ring-purple-500/20 text-slate-100 placeholder:text-slate-600 rounded-lg transition-all"
                  />
                </div>
              </div>

              {/* Password Input Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Password
                  </Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="pl-10 pr-10 bg-slate-900/60 border-slate-800 focus:border-purple-500/60 focus:ring-purple-500/20 text-slate-100 placeholder:text-slate-600 rounded-lg transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full btn-primary-gradient py-5 font-semibold text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 active:scale-[0.99] transition-all duration-200 mt-2 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    Authenticating...
                  </span>
                ) : (
                  'Sign In to Dashboard'
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col items-center justify-center pt-2 pb-6 border-t border-slate-800/40 text-xs text-slate-400">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-purple-400 transition-colors py-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Return to Portfolio
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4">
      <Suspense fallback={
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          <p className="text-sm">Loading security panel...</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
