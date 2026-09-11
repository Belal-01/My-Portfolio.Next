import Link from 'next/link';
import { ExternalLink, Maximize2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { MOCK_CERTIFICATIONS } from '@/lib/supabase/mockData';
import { Certification } from '@/types';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CertificationDetailPage({ params }: Props) {
  const { id } = await params;
  let cert: Certification | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('certifications')
      .select('*')
      .eq('id', id)
      .single();

    if (data) {
      cert = data as Certification;
    }
  } catch (err) {
    console.error('Error fetching certification detail from Supabase:', err);
  }

  if (!cert) {
    cert = MOCK_CERTIFICATIONS.find((c) => c.id === id) || MOCK_CERTIFICATIONS[0];
  }


  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
      <Link href="/#certifications" className="text-xs font-semibold text-cyan-400 hover:underline inline-flex items-center gap-1">
        ← Back to Certifications
      </Link>

      <div className="glass-card p-8 sm:p-10 rounded-2xl space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-purple-900/30 pb-6">
          <div>
            <span className="text-xs font-semibold text-purple-400 font-mono">{cert.issuer}</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">{cert.name}</h1>
          </div>
          {cert.credential_url && (
            <a
              href={cert.credential_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary-gradient px-6 py-3 text-xs font-bold shadow-lg self-start sm:self-center"
            >
              Verify Credential ↗
            </a>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-sm font-bold text-slate-200">Credential Metadata:</h2>
              <ul className="text-xs text-slate-300 space-y-2 font-mono bg-black/40 p-4 rounded-xl border border-purple-900/30">
                <li>• Issuer Authority: <span className="text-cyan-300">{cert.issuer}</span></li>
                <li>• Issue Date: <span className="text-purple-300">{cert.issue_date}</span></li>
                {cert.expiry_date && (
                  <li>• Expiration Date: <span className="text-purple-300">{cert.expiry_date}</span></li>
                )}
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-200">Skills Acquired:</h2>
              <ul className="text-xs text-slate-300 space-y-2">
                {cert.skills_acquired.map((skill) => (
                  <li key={skill} className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-black/50 p-6 rounded-2xl border border-purple-900/30 flex flex-col items-center justify-center text-center gap-4">
            {cert.badge_image && (
              <a
                href={cert.badge_image}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block cursor-pointer"
                title="Click to view full original certificate"
              >
                <img
                  src={cert.badge_image}
                  alt={cert.name}
                  className="max-h-64 max-w-full object-contain rounded-xl shadow-2xl border border-purple-800/30 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                  <span className="text-xs font-semibold text-cyan-300 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-400/50 shadow-xl flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>View Original Image</span>
                  </span>
                </div>
              </a>
            )}
            <div className="flex items-center gap-3">
              <p className="text-xs text-slate-400">Official Authenticated Credential Badge</p>
              {cert.badge_image && (
                <a
                  href={cert.badge_image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-purple-300 hover:text-white inline-flex items-center gap-1 underline underline-offset-4 font-semibold"
                >
                  <span>Open Full Size</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
