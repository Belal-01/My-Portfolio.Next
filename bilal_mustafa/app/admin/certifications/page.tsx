'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MOCK_CERTIFICATIONS } from '@/lib/supabase/mockData';
import { Certification } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Award,
  Plus,
  Trash2,
  ExternalLink,
  Calendar,
  Loader2,
  AlertCircle,
  RefreshCw,
  X,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  Pencil,
  Save,
} from 'lucide-react';

export default function AdminCertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Add Form State
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [uploadingBadge, setUploadingBadge] = useState<boolean>(false);
  const [badgeMode, setBadgeMode] = useState<'upload' | 'url'>('upload');

  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    issue_date: '',
    expiry_date: '',
    badge_image: '',
    credential_url: '',
    skills_acquired: '',
  });

  // Edit Form State
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [editFormData, setEditFormData] = useState({
    id: '',
    name: '',
    issuer: '',
    issue_date: '',
    expiry_date: '',
    badge_image: '',
    credential_url: '',
    skills_acquired: '',
  });
  const [editUploadingBadge, setEditUploadingBadge] = useState<boolean>(false);
  const [editBadgeMode, setEditBadgeMode] = useState<'upload' | 'url'>('url');

  const fetchCertifications = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .order('issue_date', { ascending: false });

      if (error) {
        console.error('Error fetching certifications from Supabase:', error);
        setErrorMsg('Could not fetch certifications from database. Showing fallback data.');
        setCertifications(MOCK_CERTIFICATIONS);
      } else if (data && data.length > 0) {
        setCertifications(data as Certification[]);
      } else {
        setCertifications([]);
      }
    } catch (err) {
      console.error('Unexpected error fetching certifications:', err);
      setErrorMsg('An unexpected error occurred while loading certifications.');
      setCertifications(MOCK_CERTIFICATIONS);
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
          .from('certifications')
          .select('*')
          .order('issue_date', { ascending: false });

        if (ignore) return;

        if (error) {
          console.error('Error fetching certifications from Supabase:', error);
          setErrorMsg('Could not fetch certifications from database. Showing fallback data.');
          setCertifications(MOCK_CERTIFICATIONS);
        } else if (data && data.length > 0) {
          setCertifications(data as Certification[]);
        } else {
          setCertifications([]);
        }
      } catch (err) {
        if (ignore) return;
        console.error('Unexpected error fetching certifications:', err);
        setErrorMsg('An unexpected error occurred while loading certifications.');
        setCertifications(MOCK_CERTIFICATIONS);
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

  // Upload badge image helper
  const uploadBadgeImage = async (file: File): Promise<string> => {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop() || 'png';
    const fileName = `certifications/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('portfolio-media')
      .upload(fileName, file, { cacheControl: '3600', upsert: true });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from('portfolio-media')
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  };

  const handleFileUpload = async (file: File) => {
    setUploadingBadge(true);
    setErrorMsg(null);
    try {
      const publicUrl = await uploadBadgeImage(file);
      setFormData((prev) => ({ ...prev, badge_image: publicUrl }));
    } catch (err: any) {
      console.error('Badge upload failed:', err);
      setErrorMsg(`Badge upload failed: ${err.message || 'Storage bucket missing or permission denied.'}`);
    } finally {
      setUploadingBadge(false);
    }
  };

  const handleEditFileUpload = async (file: File) => {
    setEditUploadingBadge(true);
    setErrorMsg(null);
    try {
      const publicUrl = await uploadBadgeImage(file);
      setEditFormData((prev) => ({ ...prev, badge_image: publicUrl }));
    } catch (err: any) {
      console.error('Badge upload failed:', err);
      setErrorMsg(`Badge upload failed: ${err.message || 'Storage bucket missing or permission denied.'}`);
    } finally {
      setEditUploadingBadge(false);
    }
  };

  const handleCreateCertification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.issuer || !formData.issue_date) {
      setErrorMsg('Please fill in Name, Issuer, and Issue Date.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const skillsArray = formData.skills_acquired
      ? formData.skills_acquired.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('certifications')
        .insert({
          name: formData.name,
          issuer: formData.issuer,
          issue_date: formData.issue_date,
          expiry_date: formData.expiry_date || null,
          badge_image: formData.badge_image || null,
          credential_url: formData.credential_url || null,
          skills_acquired: skillsArray,
        })
        .select('*')
        .single();

      if (error) throw error;

      setSuccessMsg('Certification added successfully!');
      if (data) {
        setCertifications((prev) => [data as Certification, ...prev]);
      } else {
        fetchCertifications();
      }

      setFormData({
        name: '',
        issuer: '',
        issue_date: '',
        expiry_date: '',
        badge_image: '',
        credential_url: '',
        skills_acquired: '',
      });
      setShowAddForm(false);
    } catch (err: any) {
      console.error('Error creating certification:', err);
      setErrorMsg(`Failed to add certification: ${err.message || 'Unknown database error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const startEditingCert = (cert: Certification) => {
    setEditingCert(cert);
    setEditFormData({
      id: cert.id,
      name: cert.name || '',
      issuer: cert.issuer || '',
      issue_date: cert.issue_date || '',
      expiry_date: cert.expiry_date || '',
      badge_image: cert.badge_image || '',
      credential_url: cert.credential_url || '',
      skills_acquired: cert.skills_acquired ? cert.skills_acquired.join(', ') : '',
    });
    setEditBadgeMode('url');
    setShowAddForm(false);
  };

  const handleUpdateCertification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData.name || !editFormData.issuer || !editFormData.issue_date) {
      setErrorMsg('Please fill in Name, Issuer, and Issue Date.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const skillsArray = editFormData.skills_acquired
      ? editFormData.skills_acquired.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const payload = {
      name: editFormData.name,
      issuer: editFormData.issuer,
      issue_date: editFormData.issue_date,
      expiry_date: editFormData.expiry_date || null,
      badge_image: editFormData.badge_image || null,
      credential_url: editFormData.credential_url || null,
      skills_acquired: skillsArray,
    };

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('certifications')
        .update(payload)
        .eq('id', editFormData.id);

      if (error) throw error;

      setSuccessMsg('Certification updated successfully!');
      setCertifications((prev) =>
        prev.map((c) => (c.id === editFormData.id ? { ...c, ...payload } : c))
      );
      setEditingCert(null);
    } catch (err: any) {
      console.error('Error updating certification:', err);
      setErrorMsg(`Failed to update certification: ${err.message || 'Database error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteCert = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    setActionLoadingId(id);
    setErrorMsg(null);
    setSuccessMsg(null);

    const prevCerts = [...certifications];
    setCertifications((prev) => prev.filter((c) => c.id !== id));

    try {
      const supabase = createClient();
      const { error } = await supabase.from('certifications').delete().eq('id', id);

      if (error) {
        console.error('Error deleting certification from Supabase:', error);
        setErrorMsg(`Failed to delete certification: ${error.message}`);
        setCertifications(prevCerts);
      } else {
        setSuccessMsg('Certification deleted successfully.');
      }
    } catch (err) {
      console.error('Unexpected error deleting certification:', err);
      setErrorMsg('Failed to delete certification from database.');
      setCertifications(prevCerts);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Award className="w-6 h-6 text-cyan-400" />
            Certifications Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage your verified certificates, badges, and credentials stored in Supabase.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCertifications}
            disabled={loading}
            className="bg-slate-900/60 border-slate-800 text-slate-300 hover:text-white text-xs gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            onClick={() => {
              setEditingCert(null);
              setShowAddForm(!showAddForm);
            }}
            className="btn-primary-gradient cursor-pointer gap-2 text-xs"
          >
            {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showAddForm ? 'Cancel' : 'Add Certification'}
          </Button>
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

      {/* EDIT CERTIFICATION MODAL / EXPANDABLE CARD */}
      {editingCert && (
        <Card className="glass-card border-purple-500/50 bg-slate-950/90 p-6 space-y-4 animate-in slide-in-from-top duration-300">
          <div className="flex items-center justify-between border-b border-purple-900/30 pb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Pencil className="w-5 h-5 text-purple-400" />
              Edit Certification: <span className="text-purple-300">{editingCert.name}</span>
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingCert(null)}
              className="text-slate-400 hover:text-white text-xs"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <form onSubmit={handleUpdateCertification} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-name" className="text-xs font-semibold text-slate-200">
                  Certification Name <span className="text-rose-400">*</span>
                </Label>
                <Input
                  id="edit-name"
                  placeholder="e.g. AWS Certified Security - Specialty"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="bg-slate-900/80 border-slate-800 text-slate-100 text-xs focus:border-purple-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-issuer" className="text-xs font-semibold text-slate-200">
                  Issuing Organization <span className="text-rose-400">*</span>
                </Label>
                <Input
                  id="edit-issuer"
                  placeholder="e.g. Amazon Web Services (AWS)"
                  value={editFormData.issuer}
                  onChange={(e) => setEditFormData({ ...editFormData, issuer: e.target.value })}
                  className="bg-slate-900/80 border-slate-800 text-slate-100 text-xs focus:border-purple-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-issue-date" className="text-xs font-semibold text-slate-200">
                  Issue Date <span className="text-rose-400">*</span>
                </Label>
                <Input
                  id="edit-issue-date"
                  type="date"
                  value={editFormData.issue_date}
                  onChange={(e) => setEditFormData({ ...editFormData, issue_date: e.target.value })}
                  className="bg-slate-900/80 border-slate-800 text-slate-100 text-xs focus:border-purple-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-expiry-date" className="text-xs font-semibold text-slate-200">
                  Expiration Date (Optional)
                </Label>
                <Input
                  id="edit-expiry-date"
                  type="date"
                  value={editFormData.expiry_date}
                  onChange={(e) => setEditFormData({ ...editFormData, expiry_date: e.target.value })}
                  className="bg-slate-900/80 border-slate-800 text-slate-100 text-xs focus:border-purple-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-slate-200">Badge Image</Label>
                <div className="flex bg-slate-900/80 p-0.5 rounded-lg border border-slate-800 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setEditBadgeMode('url')}
                    className={`px-2.5 py-1 rounded-md font-semibold ${
                      editBadgeMode === 'url' ? 'bg-purple-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditBadgeMode('upload')}
                    className={`px-2.5 py-1 rounded-md font-semibold ${
                      editBadgeMode === 'upload' ? 'bg-purple-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Upload File
                  </button>
                </div>
              </div>

              {editBadgeMode === 'url' ? (
                <Input
                  placeholder="https://images.unsplash.com/photo-..."
                  value={editFormData.badge_image}
                  onChange={(e) => setEditFormData({ ...editFormData, badge_image: e.target.value })}
                  className="bg-slate-900/80 border-slate-800 text-slate-100 text-xs font-mono focus:border-purple-500"
                />
              ) : (
                <div className="flex items-center gap-3">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleEditFileUpload(file);
                    }}
                    disabled={editUploadingBadge}
                    className="bg-slate-900/80 border-slate-800 text-slate-100 text-xs"
                  />
                  {editUploadingBadge && <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />}
                </div>
              )}

              {editFormData.badge_image && (
                <div className="mt-2 flex items-center gap-3 bg-black/40 p-2 rounded-lg border border-purple-900/30 w-fit">
                  <img
                    src={editFormData.badge_image}
                    alt="Badge Preview"
                    className="w-10 h-10 object-cover rounded-md border border-purple-800/40"
                  />
                  <span className="text-[10px] text-slate-400 font-mono truncate max-w-xs">
                    {editFormData.badge_image}
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-credential-url" className="text-xs font-semibold text-slate-200">
                  Verification URL (Optional)
                </Label>
                <Input
                  id="edit-credential-url"
                  placeholder="https://aws.amazon.com/verification/..."
                  value={editFormData.credential_url}
                  onChange={(e) => setEditFormData({ ...editFormData, credential_url: e.target.value })}
                  className="bg-slate-900/80 border-slate-800 text-slate-100 text-xs font-mono focus:border-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-skills" className="text-xs font-semibold text-slate-200">
                  Skills Acquired (Comma Separated)
                </Label>
                <Input
                  id="edit-skills"
                  placeholder="IAM, KMS Key Management, VPC Flow Logs"
                  value={editFormData.skills_acquired}
                  onChange={(e) => setEditFormData({ ...editFormData, skills_acquired: e.target.value })}
                  className="bg-slate-900/80 border-slate-800 text-slate-100 text-xs focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-purple-900/30">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEditingCert(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="btn-primary-gradient cursor-pointer text-xs gap-1.5 px-5"
              >
                {submitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Add Certification Expandable Card */}
      {showAddForm && (
        <Card className="glass-card border-purple-500/30 bg-slate-950/80 p-6 space-y-4 animate-in slide-in-from-top duration-300">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Award className="w-5 h-5 text-cyan-400" />
            Add New Certification
          </h2>

          <form onSubmit={handleCreateCertification} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold text-slate-200">
                  Certification Name <span className="text-rose-400">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g. AWS Certified Security - Specialty"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-slate-900/80 border-slate-800 text-slate-100 text-xs focus:border-purple-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="issuer" className="text-xs font-semibold text-slate-200">
                  Issuing Organization <span className="text-rose-400">*</span>
                </Label>
                <Input
                  id="issuer"
                  placeholder="e.g. Amazon Web Services (AWS)"
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  className="bg-slate-900/80 border-slate-800 text-slate-100 text-xs focus:border-purple-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="issue_date" className="text-xs font-semibold text-slate-200">
                  Issue Date <span className="text-rose-400">*</span>
                </Label>
                <Input
                  id="issue_date"
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                  className="bg-slate-900/80 border-slate-800 text-slate-100 text-xs focus:border-purple-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="expiry_date" className="text-xs font-semibold text-slate-200">
                  Expiration Date (Optional)
                </Label>
                <Input
                  id="expiry_date"
                  type="date"
                  value={formData.expiry_date}
                  onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                  className="bg-slate-900/80 border-slate-800 text-slate-100 text-xs focus:border-purple-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-slate-200">Badge Image</Label>
                <div className="flex bg-slate-900/80 p-0.5 rounded-lg border border-slate-800 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setBadgeMode('upload')}
                    className={`px-2.5 py-1 rounded-md font-semibold ${
                      badgeMode === 'upload' ? 'bg-purple-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setBadgeMode('url')}
                    className={`px-2.5 py-1 rounded-md font-semibold ${
                      badgeMode === 'url' ? 'bg-purple-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    URL
                  </button>
                </div>
              </div>

              {badgeMode === 'upload' ? (
                <div className="flex items-center gap-3">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    disabled={uploadingBadge}
                    className="bg-slate-900/80 border-slate-800 text-slate-100 text-xs"
                  />
                  {uploadingBadge && <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />}
                </div>
              ) : (
                <Input
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.badge_image}
                  onChange={(e) => setFormData({ ...formData, badge_image: e.target.value })}
                  className="bg-slate-900/80 border-slate-800 text-slate-100 text-xs font-mono focus:border-purple-500"
                />
              )}

              {formData.badge_image && (
                <div className="mt-2 flex items-center gap-3 bg-black/40 p-2 rounded-lg border border-purple-900/30 w-fit">
                  <img
                    src={formData.badge_image}
                    alt="Badge Preview"
                    className="w-10 h-10 object-cover rounded-md border border-purple-800/40"
                  />
                  <span className="text-[10px] text-slate-400 font-mono truncate max-w-xs">
                    {formData.badge_image}
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="credential_url" className="text-xs font-semibold text-slate-200">
                  Verification URL (Optional)
                </Label>
                <Input
                  id="credential_url"
                  placeholder="https://aws.amazon.com/verification/..."
                  value={formData.credential_url}
                  onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                  className="bg-slate-900/80 border-slate-800 text-slate-100 text-xs font-mono focus:border-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="skills_acquired" className="text-xs font-semibold text-slate-200">
                  Skills Acquired (Comma Separated)
                </Label>
                <Input
                  id="skills_acquired"
                  placeholder="IAM, KMS Key Management, VPC Flow Logs"
                  value={formData.skills_acquired}
                  onChange={(e) => setFormData({ ...formData, skills_acquired: e.target.value })}
                  className="bg-slate-900/80 border-slate-800 text-slate-100 text-xs focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-purple-900/30">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowAddForm(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="btn-primary-gradient cursor-pointer text-xs gap-1.5 px-5"
              >
                {submitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
                Save Certification
              </Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="py-20 text-center space-y-3 glass-card rounded-2xl border-purple-500/20">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
          <p className="text-sm text-slate-400 font-medium">Fetching certifications from Supabase...</p>
        </div>
      ) : certifications.length === 0 ? (
        <div className="py-16 text-center space-y-4 glass-card rounded-2xl border-purple-500/20 p-8">
          <Award className="w-12 h-12 text-slate-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-slate-200">No certifications found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Your Supabase database does not have any certification records yet. Add your first certificate!
            </p>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            className="btn-primary-gradient cursor-pointer gap-2 text-xs"
          >
            <Plus className="w-4 h-4" />
            Add First Certification
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certifications.map((cert) => {
            const isProcessing = actionLoadingId === cert.id;

            return (
              <Card key={cert.id} className="glass-card border-purple-500/20 bg-slate-950/60 p-5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {cert.badge_image ? (
                        <img
                          src={cert.badge_image}
                          alt={cert.name}
                          className="w-12 h-12 rounded-xl object-cover border border-cyan-500/30 shrink-0"
                        />
                      ) : (
                        <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
                          <Award className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-base font-semibold text-slate-100 leading-snug">
                          {cert.name}
                        </h3>
                        <p className="text-xs text-purple-400 font-medium mt-0.5">
                          {cert.issuer}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    {cert.issue_date && (
                      <p className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        Issued: {new Date(cert.issue_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                      </p>
                    )}
                    {cert.expiry_date && (
                      <p className="text-slate-500">
                        • Expires: {new Date(cert.expiry_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                      </p>
                    )}
                  </div>

                  {cert.skills_acquired && cert.skills_acquired.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {cert.skills_acquired.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-purple-950/40 text-purple-300 text-[10px] border border-purple-800/30 font-mono"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/60">
                  {cert.credential_url ? (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                    >
                      Verify Link <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span />
                  )}

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEditingCert(cert)}
                      className="bg-purple-950/40 border-purple-800/40 text-purple-300 hover:bg-purple-900/60 hover:text-white cursor-pointer text-xs gap-1.5"
                      title="Edit Certification Details"
                    >
                      <Pencil className="w-3.5 h-3.5 text-purple-400" />
                      Edit
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isProcessing}
                      onClick={() => deleteCert(cert.id, cert.name)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-950/30 cursor-pointer text-xs"
                      title="Delete Certification"
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
