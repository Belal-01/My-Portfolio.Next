'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Upload,
  Download,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
  FileCheck,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Resume } from '@/types';

export default function AdminCVPage() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchActiveResume = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/cv');
      const json = await res.json();
      if (json.success && json.data) {
        setResume(json.data);
      } else {
        setErrorMsg('Could not fetch active CV status.');
      }
    } catch (err: any) {
      console.error('Error fetching CV:', err);
      setErrorMsg('Failed to load active CV details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveResume();
  }, []);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setErrorMsg('Please select a valid PDF file (.pdf).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('File size exceeds the 10 MB limit.');
      return;
    }

    setUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/cv', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (json.success && json.data) {
        setResume(json.data);
        setSuccessMsg(`Successfully uploaded "${file.name}" to Supabase Storage!`);
      } else {
        setErrorMsg(json.error || 'Failed to upload CV file to Supabase.');
      }
    } catch (err: any) {
      console.error('Error uploading CV:', err);
      setErrorMsg(err.message || 'An unexpected error occurred during file upload.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleCopyLink = () => {
    if (!resume?.file_url) return;
    const fullUrl = resume.file_url.startsWith('http')
      ? resume.file_url
      : `${window.location.origin}${resume.file_url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatBytes = (bytes?: number | null) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-400" />
            Resume / CV Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Upload, preview, and update your active CV stored on Supabase Storage.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchActiveResume}
          disabled={loading}
          className="bg-slate-900/60 border-slate-800 text-slate-300 hover:text-white text-xs gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Status</span>
        </Button>
      </div>

      {/* Alert Messages */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">{errorMsg}</div>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-sm flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1">{successMsg}</div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload & Active Status Card */}
        <div className="lg:col-span-5 space-y-6">
          {/* Upload New CV Card */}
          <div className="glass-card p-6 border-purple-500/20 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800/60">
              <Upload className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-semibold text-white">Upload New CV</h2>
            </div>

            {/* Drag and Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center space-y-3 ${
                dragActive
                  ? 'border-purple-400 bg-purple-950/40 scale-[1.01]'
                  : 'border-slate-800 hover:border-purple-500/50 bg-slate-950/40 hover:bg-slate-900/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />

              <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-400 shadow-inner">
                {uploading ? (
                  <RefreshCw className="w-6 h-6 animate-spin" />
                ) : (
                  <Upload className="w-6 h-6" />
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-200">
                  {uploading ? 'Uploading to Supabase...' : 'Click to upload or drag & drop'}
                </p>
                <p className="text-xs text-slate-400 mt-1">PDF format required (Max size: 10 MB)</p>
              </div>
            </div>
          </div>

          {/* Active CV Details Card */}
          <div className="glass-card p-6 border-purple-500/20 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-semibold text-white">Active CV Information</h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 border border-emerald-800/60 text-emerald-300">
                ACTIVE
              </span>
            </div>

            {loading ? (
              <div className="py-8 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
                Loading active CV details...
              </div>
            ) : resume ? (
              <div className="space-y-4">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800/40">
                    <span className="text-slate-400">File Name:</span>
                    <span className="font-semibold text-slate-200 truncate max-w-[200px]">
                      {resume.file_name}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-800/40">
                    <span className="text-slate-400">File Size:</span>
                    <span className="font-medium text-slate-300">{formatBytes(resume.file_size)}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-800/40">
                    <span className="text-slate-400">Last Updated:</span>
                    <span className="font-medium text-slate-300">{formatDate(resume.created_at)}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-800/40">
                    <span className="text-slate-400">Storage Provider:</span>
                    <span className="font-medium text-purple-300 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                      Supabase Storage
                    </span>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex flex-col gap-2 pt-2">
                  <a
                    href={resume.file_url}
                    download={resume.file_name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full btn-primary-gradient py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Active CV</span>
                  </a>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={resume.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 text-slate-300 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Link</span>
                    </a>

                    <button
                      onClick={handleCopyLink}
                      className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 text-slate-300 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Right Column: Live Embedded PDF Viewer */}
        <div className="lg:col-span-7">
          <div className="glass-card p-6 border-purple-500/20 h-full flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/60">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-semibold text-white">Live PDF Preview</h2>
              </div>
              {resume?.file_url && (
                <a
                  href={resume.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium"
                >
                  Full Screen <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {resume?.file_url ? (
              <div className="flex-1 w-full rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-950/80 min-h-[440px] relative">
                <iframe
                  src={`${resume.file_url}#toolbar=0&navpanes=0`}
                  className="w-full h-full min-h-[440px] border-0"
                  title="CV Document Preview"
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
                <FileText className="w-12 h-12 text-slate-600" />
                <p className="text-sm">No PDF preview available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
