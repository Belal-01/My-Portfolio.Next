'use client';

import { useState, useEffect } from 'react';
import { Award, ExternalLink, Calendar, CheckCircle2, ShieldCheck, Sparkles, Maximize2, Eye, X } from 'lucide-react';
import { Certification } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { MOCK_CERTIFICATIONS } from '@/lib/supabase/mockData';

export default function Certificates() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  // Close modal on Escape key and prevent body scroll when open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedCert(null);
      }
    };
    if (selectedCert) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedCert]);

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
                {/* Top Half - Full Width Image Container (Clickable for full view) */}
                <div
                  onClick={() => cert.badge_image && setSelectedCert(cert)}
                  className={`relative w-full h-56 sm:h-64 bg-gradient-to-br from-purple-950/40 via-slate-950 to-black p-6 border-b border-purple-900/30 flex items-center justify-center overflow-hidden ${
                    cert.badge_image ? 'cursor-pointer group/image' : ''
                  }`}
                  title={cert.badge_image ? 'Click to view original certificate' : undefined}
                >
                  {/* Subtle Ambient Background Glow */}
                  <div className="absolute inset-0 bg-purple-600/10 blur-2xl group-hover:bg-cyan-500/15 transition-all duration-500 pointer-events-none"></div>

                  {/* Verified Badge Overlay */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-900/90 text-cyan-300 border border-cyan-500/40 backdrop-blur-md shadow-md inline-flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      Verified Credential
                    </span>
                  </div>

                  {/* Top Right "View Original" Micro-Pill */}
                  {cert.badge_image && (
                    <div className="absolute top-4 right-4 z-10 opacity-80 group-hover/image:opacity-100 transition-opacity">
                      <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-slate-950/80 text-purple-200 border border-purple-500/40 backdrop-blur-md shadow-md inline-flex items-center gap-1">
                        <Maximize2 className="w-3 h-3 text-cyan-300" />
                        <span>View Original</span>
                      </span>
                    </div>
                  )}

                  {/* Certificate Image / Badge (Fully Visible) */}
                  {cert.badge_image ? (
                    <>
                      <img
                        src={cert.badge_image}
                        alt={cert.name}
                        className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500 z-0"
                      />
                      {/* Hover Overlay with Call-to-action */}
                      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                        <span className="px-4 py-2 rounded-full bg-slate-900/95 text-cyan-300 border border-cyan-400/50 text-xs font-semibold backdrop-blur-md shadow-2xl flex items-center gap-2 transform translate-y-2 group-hover/image:translate-y-0 transition-transform duration-300">
                          <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>View Original Certificate</span>
                        </span>
                      </div>
                    </>
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

                  {/* Card Footer - Actions */}
                  <div className="pt-4 border-t border-purple-900/30 flex items-center justify-between gap-3">
                    {cert.badge_image ? (
                      <button
                        type="button"
                        onClick={() => setSelectedCert(cert)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-300 hover:text-white transition-colors group/view"
                      >
                        <Eye className="w-3.5 h-3.5 text-purple-400 group-hover/view:scale-110 transition-transform" />
                        <span>View Original</span>
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500 italic">No image available</span>
                    )}

                    {cert.credential_url ? (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group/link"
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

      {/* High-Resolution Certificate Lightbox Modal */}
      {selectedCert && selectedCert.badge_image && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md transition-all duration-300"
          onClick={() => setSelectedCert(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Certificate Image Viewer"
        >
          <div
            className="relative max-w-4xl w-full max-h-[92vh] glass-card border border-purple-500/40 rounded-3xl overflow-hidden flex flex-col shadow-2xl bg-slate-950/95 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-purple-900/40 flex items-center justify-between gap-4 bg-slate-900/60">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider truncate">
                    {selectedCert.issuer}
                  </p>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white truncate">{selectedCert.name}</h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={selectedCert.badge_image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800/40 text-purple-200 hover:text-white transition-colors text-xs font-semibold flex items-center gap-1.5"
                  title="Open original image file in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Open Full Image</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedCert(null)}
                  className="p-2 rounded-xl bg-slate-800/70 hover:bg-slate-700 border border-slate-700/50 text-slate-300 hover:text-white transition-colors"
                  title="Close viewer (Esc)"
                  aria-label="Close viewer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Image Viewport */}
            <div className="p-4 sm:p-8 flex-1 overflow-auto flex items-center justify-center bg-black/80 relative min-h-[300px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/10 via-cyan-500/10 to-transparent pointer-events-none blur-3xl"></div>
              <img
                src={selectedCert.badge_image}
                alt={selectedCert.name}
                className="max-w-full max-h-[60vh] sm:max-h-[68vh] object-contain rounded-xl shadow-2xl border border-purple-900/40 relative z-10"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-purple-900/40 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  Issued: <strong className="text-white">{formatDate(selectedCert.issue_date)}</strong>
                </span>
                {selectedCert.expiry_date && (
                  <span className="text-slate-400">
                    • Expires: <strong className="text-slate-200">{formatDate(selectedCert.expiry_date)}</strong>
                  </span>
                )}
              </div>

              {selectedCert.credential_url && (
                <a
                  href={selectedCert.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary-gradient px-4 py-2 rounded-full text-xs font-semibold shadow-md flex items-center gap-1.5"
                >
                  <span>Verify Credential</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
