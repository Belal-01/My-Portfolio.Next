'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    sender_name: '',
    sender_email: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setFeedbackMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setFeedbackMsg('Thank you! Your message has been sent successfully.');
        setFormData({ sender_name: '', sender_email: '', message: '' });
      } else {
        setStatus('error');
        setFeedbackMsg(data.error || 'Failed to send message. Please try again.');
      }
    } catch (err: any) {
      setStatus('error');
      setFeedbackMsg(err.message || 'An error occurred while sending your message.');
    }
  };

  return (
    <section id="contact" className="py-20 flex flex-col items-center relative">
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Section Badge */}
        <div className="badge-available px-4 py-1.5 rounded-full inline-flex items-center gap-2 text-xs font-medium text-slate-200 shadow-md mb-6 backdrop-blur-md bg-slate-900/60 border border-slate-700/50">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Get In Touch</span>
        </div>

        {/* Section Heading */}
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
          Let&apos;s Work <span className="gradient-text-purple-cyan font-extrabold">Together</span>
        </h2>

        <p className="max-w-xl text-slate-400 text-sm sm:text-base leading-relaxed mb-16">
          Have a project, job opportunity, or question in mind? Feel free to connect directly via phone, email, or send a message below!
        </p>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 w-full text-left">
          {/* Left Column: Direct Contact Info Cards (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Phone Card */}
            <a
              href="tel:+963981091343"
              className="glass-card p-6 rounded-3xl flex items-center gap-4 group border border-purple-900/30 hover:border-purple-500/50 transition-all duration-300 shadow-lg block"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-800/50 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Phone</div>
                <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  +963-981-091-343
                </div>
                <p className="text-[11px] text-slate-400">Click to call directly</p>
              </div>
            </a>

            {/* Email Card */}
            <a
              href="mailto:belalkhobieh343@gmail.com"
              className="glass-card p-6 rounded-3xl flex items-center gap-4 group border border-purple-900/30 hover:border-cyan-500/50 transition-all duration-300 shadow-lg block"
            >
              <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-800/50 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 overflow-hidden">
                <div className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">Email</div>
                <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                  belalkhobieh343@gmail.com
                </div>
                <p className="text-[11px] text-slate-400">Click to send an email</p>
              </div>
            </a>

            {/* Address Card */}
            <div className="glass-card p-6 rounded-3xl flex items-center gap-4 border border-purple-900/30 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 border border-indigo-800/50 flex items-center justify-center text-indigo-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Address</div>
                <div className="text-sm font-bold text-white">
                  Syria - Damascus
                </div>
                <p className="text-[11px] text-slate-400">Open to Remote &amp; On-Site Opportunities</p>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Message Form (3 cols) */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="glass-card p-8 sm:p-10 rounded-3xl space-y-6 border border-purple-900/30 shadow-2xl relative overflow-hidden"
            >
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Send Me a Message</h3>
                <p className="text-xs text-slate-400">Fill out the form below and I will respond as soon as possible.</p>
              </div>

              {/* Status Alert Notification */}
              {status === 'success' && (
                <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{feedbackMsg}</span>
                </div>
              )}

              {status === 'error' && (
                <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{feedbackMsg}</span>
                </div>
              )}

              <div className="space-y-4 text-left">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.sender_name}
                    onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
                    placeholder="e.g. John Doe"
                    className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-purple-900/40 text-slate-100 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Your Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.sender_email}
                    onChange={(e) => setFormData({ ...formData, sender_email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-purple-900/40 text-slate-100 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Your Message</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your message or project details here..."
                    className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-purple-900/40 text-slate-100 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full btn-primary-gradient py-4 rounded-full text-sm font-semibold shadow-lg shadow-purple-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{status === 'loading' ? 'Sending Message...' : 'Send Message'}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
