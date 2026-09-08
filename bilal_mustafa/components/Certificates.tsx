'use client';

import { useState, useEffect } from 'react';
import { Award, ExternalLink, Calendar, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { Certification } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { MOCK_CERTIFICATIONS } from '@/lib/supabase/mockData';

export default function Certificates() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let ignore = false;

    async function fetchCertifications() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('certifications')
          .select('*')
          .order('issue_date', { ascending: false });

        if (ignore) return;

        if (!error && data && data.length > 0) {
          setCertifications(data as Certification[]);
        } else {
          const res = await fetch('/api/certifications');
          const json = await res.json();

          if (ignore) return;

          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            setCertifications(json.data as Certification[]);
          } else {
            setCertifications(MOCK_CERTIFICATIONS);
          }
        }
      } catch (err) {
        if (ignore) return;
        console.error('Error fetching certifications:', err);
        setCertifications(MOCK_CERTIFICATIONS);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchCertifications();

    return () => {
      ignore = true;
    };
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    } catch {
      return dateStr;
    }
  };

  return (
    <section id="certificates" className="py-20 flex flex-col items-center relative">
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Section Badge */}
        <div className="badge-available px-4 py-1.5 rounded-full inline-flex items-center gap-2 text-xs font-medium text-slate-200 shadow-md mb-6 backdrop-blur-md bg-slate-900/60 border border-slate-700/50">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Accreditations &amp; Badges</span>
        </div>

        {/* Section Heading */}
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
          Verified <span className="gradient-text-purple-cyan font-extrabold">Certifications</span>
        </h2>

        <p className="max-w-xl text-slate-400 text-sm sm:text-base leading-relaxed mb-16">
          Professional cloud security credentials, system architecture certifications, and industry-recognized technical validations.
        </p>

        {/* Loading Skeleton State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full text-left">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="glass-card rounded-3xl overflow-hidden border border-purple-900/30 animate-pulse flex flex-col justify-between"
              >
                <div className="h-56 bg-slate-900/80 w-full"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-slate-800/80 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-900/80 rounded w-1/2"></div>
                  <div className="h-10 bg-slate-900/50 rounded-xl w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Certifications Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full text-left">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="glass-card rounded-3xl overflow-hidden flex flex-col justify-between group border border-purple-900/30 hover:border-purple-500/50 transition-all duration-300 shadow-xl relative"
              >
                {/* Top Half - Full Width Image Container */}
                <div className="relative w-full h-56 sm:h-64 bg-gradient-to-br from-purple-950/40 via-slate-950 to-black p-6 border-b border-purple-900/30 flex items-center justify-center overflow-hidden">
                  {/* Subtle Ambient Background Glow */}
                  <div className="absolute inset-0 bg-purple-600/10 blur-2xl group-hover:bg-cyan-500/15 transition-all duration-500 pointer-events-none"></div>

                  {/* Verified Badge Overlay */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-900/90 text-cyan-300 border border-cyan-500/40 backdrop-blur-md shadow-md inline-flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      Verified Credential
                    </span>
                  </div>

                  {/* Certificate Image / Badge (Fully Visible) */}
                  {cert.badge_image ? (
                    <img
                      src={cert.badge_image}
                      alt={cert.name}
                      className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500 z-0"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-2 text-amber-400 z-0">
                      <ShieldCheck className="w-16 h-16 text-amber-400 group-hover:scale-110 transition-transform duration-500" />
                      <span className="text-xs font-semibold text-slate-300">Official Accreditation</span>
                    </div>
                  )}
                </div>

                {/* Bottom Half - Certificate Details */}
                <div className="p-6 sm:p-8 space-y-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
                      {cert.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 font-medium">
                      Issued by <span className="text-purple-300 font-semibold">{cert.issuer}</span>
                    </p>
                  </div>

                  {/* Dates & Skills */}
                  <div className="space-y-4">
                    {/* Issue Date & Expiry */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-slate-800/60">
                        <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span>Issued: <strong className="text-slate-200">{formatDate(cert.issue_date)}</strong></span>
                      </div>

                      {cert.expiry_date && (
                        <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-slate-800/60">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>Expires: <strong className="text-slate-200">{formatDate(cert.expiry_date)}</strong></span>
                        </div>
                      )}
                    </div>

                    {/* Skills Acquired Tags */}
                    {cert.skills_acquired && cert.skills_acquired.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Skills Validated:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {cert.skills_acquired.map((skill, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-purple-950/50 text-purple-200 border border-purple-800/30"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer - Credential Verification Link */}
                  <div className="pt-4 border-t border-purple-900/30 flex items-center justify-between">
                    {cert.credential_url ? (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group/link"
                      >
                        <span>Verify Credential</span>
                        <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Credential Verified</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
