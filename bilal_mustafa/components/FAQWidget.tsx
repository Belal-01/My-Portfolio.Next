'use client';

import React, { useState, useRef, useMemo } from 'react';
import Image from 'next/image';
import {
  X,
  Minus,
  Search,
  MessageCircle,
  ChevronDown,
  Sparkles,
  HelpCircle,
  ExternalLink,
  RotateCcw,
  PhoneCall,
  MousePointerClick,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  keywords?: string[];
}

export interface FAQWidgetProps {
  /**
   * Phone number for WhatsApp redirection (international format without + or symbols).
   * Defaults to Bilal's portfolio phone number: 963981091343
   */
  phoneNumber?: string;
  /**
   * Custom FAQ items array. If omitted, uses default portfolio FAQs.
   */
  customFaqs?: FAQItem[];
  /**
   * Floating widget anchor position. Defaults to 'bottom-right'.
   */
  position?: 'bottom-right' | 'bottom-left';
  /**
   * Path to avatar image. Defaults to '/avatar.png'.
   */
  avatarSrc?: string;
  /**
   * Assistant display title.
   */
  assistantName?: string;
  /**
   * Initially open state. Defaults to false.
   */
  initialOpen?: boolean;
}

// Pre-configured FAQ items in English tailored to Bilal Khubieh's portfolio & services
export const DEFAULT_FAQS: FAQItem[] = [
  {
    id: 'pricing',
    question: 'How much does a web development project cost?',
    answer:
      'Project pricing depends on scope, architectural complexity, and required features (such as high-conversion landing pages, interactive dashboards, or full-stack web applications). I offer flexible milestone-based pricing tailored to both startups and established businesses with clear deliverables. Reach out with your requirements for an immediate, transparent estimate.',
    category: 'Pricing',
    keywords: ['cost', 'price', 'pricing', 'quote', 'rate', 'budget', 'fees', 'how much', 'expense', 'payment'],
  },
  {
    id: 'services',
    question: 'What tech stack and engineering services do you specialize in?',
    answer:
      'I specialize in modern Front-End engineering and high-performance web architecture using Next.js (App Router), React, TypeScript, and Tailwind CSS. For robust state management, I utilize Zustand and Redux Toolkit. I also implement DevSecOps best practices, API integrations, and AI-assisted workflows with a strict focus on responsive UI/UX.',
    category: 'Services',
    keywords: ['services', 'tech', 'stack', 'technologies', 'react', 'nextjs', 'typescript', 'tailwind', 'frontend', 'devops', 'skills'],
  },
  {
    id: 'timeline',
    question: 'What is the typical turnaround time for delivering a project?',
    answer:
      'Timelines vary depending on project complexity. Responsive landing pages and portfolio sites typically take 3 to 7 business days. Full-featured SaaS applications or custom administrative dashboards usually take 2 to 6 weeks, broken down into iterative sprints with weekly staging previews.',
    category: 'Timeline',
    keywords: ['time', 'duration', 'timeline', 'turnaround', 'deadline', 'delivery', 'how long', 'days', 'weeks', 'schedule'],
  },
  {
    id: 'support',
    question: 'Do you offer warranty and post-launch technical support?',
    answer:
      'Yes, absolutely! Every project includes 30 days of complimentary post-launch support covering bug fixes, performance monitoring, and smooth deployment. Ongoing monthly maintenance, security audits, and continuous feature development retainers are also available.',
    category: 'Support',
    keywords: ['support', 'maintenance', 'warranty', 'guarantee', 'updates', 'bugs', 'fixes', 'help', 'monitoring'],
  },
  {
    id: 'work-type',
    question: 'Are you available for freelance projects or full-time remote roles?',
    answer:
      'Yes! I am actively available for freelance contracts, technical consultations, and full-time remote positions worldwide. I collaborate seamlessly across different time zones using agile communication tools.',
    category: 'Availability',
    keywords: ['freelance', 'remote', 'hire', 'job', 'full-time', 'contract', 'availability', 'work', 'employment', 'career'],
  },
  {
    id: 'start-process',
    question: 'How do we get started working on my project?',
    answer:
      'Getting started is quick and straightforward! Reach out directly via WhatsApp or the Contact form below. We will hold an initial scoping session to analyze your requirements, choose the optimal tech stack, and deliver a detailed roadmap and quote.',
    category: 'Getting Started',
    keywords: ['start', 'begin', 'process', 'steps', 'contact', 'consultation', 'onboarding', 'kickoff', 'call'],
  },
];

export default function FAQWidget({
  phoneNumber = '963981091343',
  customFaqs = DEFAULT_FAQS,
  position = 'bottom-left',
  avatarSrc = '/avatar.png',
  assistantName = 'Quick FAQ',
  initialOpen = false,
}: FAQWidgetProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [showPromptBubble, setShowPromptBubble] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [noMatchFound, setNoMatchFound] = useState(false);

  // References for scrolling and inputs
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Filter categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    customFaqs.forEach((faq) => {
      if (faq.category) set.add(faq.category);
    });
    return ['All', ...Array.from(set)];
  }, [customFaqs]);

  // Clean WhatsApp phone number
  const cleanPhone = useMemo(() => phoneNumber.replace(/\D/g, ''), [phoneNumber]);

  // Search logic (English case-insensitive token search)
  const filteredFaqs = useMemo(() => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (!trimmed) {
      if (activeCategory === 'All') return customFaqs;
      return customFaqs.filter((f) => f.category === activeCategory);
    }

    const queryTokens = trimmed.split(/\s+/).filter(Boolean);

    return customFaqs.filter((faq) => {
      const q = faq.question.toLowerCase();
      const a = faq.answer.toLowerCase();
      const cat = (faq.category || '').toLowerCase();
      const keywords = (faq.keywords || []).map((k) => k.toLowerCase()).join(' ');

      const combinedText = `${q} ${a} ${cat} ${keywords}`;
      return queryTokens.some((token) => combinedText.includes(token));
    });
  }, [searchQuery, activeCategory, customFaqs]);

  // Handle Ask / Submit button
  const handleAskSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      inputRef.current?.focus();
      return;
    }

    const queryTokens = query.split(/\s+/).filter(Boolean);

    // Score matching
    let bestFaq: FAQItem | null = null;
    let highestScore = 0;

    customFaqs.forEach((faq) => {
      const q = faq.question.toLowerCase();
      const a = faq.answer.toLowerCase();
      const keywords = (faq.keywords || []).map((k) => k.toLowerCase()).join(' ');

      let score = 0;
      queryTokens.forEach((token) => {
        if (q.includes(token)) score += 5;
        if (keywords.includes(token)) score += 4;
        if (a.includes(token)) score += 2;
      });

      if (score > highestScore) {
        highestScore = score;
        bestFaq = faq;
      }
    });

    if (bestFaq && highestScore > 0) {
      const matchedId = (bestFaq as FAQItem).id;
      setNoMatchFound(false);
      setActiveCategory('All');
      setExpandedId(matchedId);
      setHighlightedId(matchedId);

      // Smooth scroll to the matched element
      setTimeout(() => {
        const el = itemRefs.current[matchedId];
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 150);

      // Auto-clear highlight after 3.5 seconds
      setTimeout(() => {
        setHighlightedId((prev) => (prev === matchedId ? null : prev));
      }, 3500);
    } else {
      // Fallback mode: no direct match found
      setNoMatchFound(true);
      setExpandedId(null);
    }
  };

  // Toggle open and auto-focus search
  const handleOpenWidget = () => {
    setIsOpen(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 200);
  };

  const handleCloseWidget = () => {
    setIsOpen(false);
  };

  const toggleAccordion = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleResetSearch = () => {
    setSearchQuery('');
    setNoMatchFound(false);
    setExpandedId(null);
    setHighlightedId(null);
    inputRef.current?.focus();
  };

  // Pre-configured WhatsApp direct URLs
  const directWhatsAppUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    'Hi Bilal, I would like to inquire about your web development services and availability.'
  )}`;

  const fallbackWhatsAppUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hi Bilal, I have a question regarding:\n"${searchQuery.trim()}"`
  )}`;

  // Position alignment
  const positionClasses =
    position === 'bottom-left'
      ? 'left-4 sm:left-6 bottom-4 sm:bottom-6'
      : 'right-4 sm:right-6 bottom-4 sm:bottom-6';

  return (
    <div
      dir="ltr"
      className={`fixed ${positionClasses} z-50 font-sans select-none print:hidden`}
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        {/* ================= MODAL CHAT VIEW ================= */}
        {isOpen ? (
          <motion.div
            key="faq-modal"
            initial={{ opacity: 0, scale: 0.88, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            className="w-[calc(100vw-2rem)] sm:w-[420px] max-h-[86vh] sm:max-h-[640px] flex flex-col rounded-3xl overflow-hidden glass-card border border-purple-500/25 shadow-[0_25px_60px_rgba(0,0,0,0.65),0_0_40px_rgba(139,92,246,0.25)] bg-[#0c0618]/95 backdrop-blur-2xl text-slate-100"
          >
            {/* --- TOP HEADER --- */}
            <div className="relative p-4 sm:p-5 border-b border-purple-900/30 bg-gradient-to-r from-purple-950/50 via-slate-900/60 to-purple-950/40 flex items-center justify-between">
              {/* Subtle top glow line */}
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500 to-cyan-400 opacity-80" />

              {/* Avatar + Title Info */}
              <div className="flex items-center gap-3.5">
                <div className="relative shrink-0 w-11 h-11">
                  <div className="relative w-full h-full">
                    <Image
                      src={avatarSrc}
                      alt="Bilal Khubieh"
                      width={48}
                      height={48}
                      className="w-full h-full object-contain object-bottom drop-shadow-[0_4px_10px_rgba(139,92,246,0.5)]"
                      priority
                    />
                  </div>
                  {/* Active Online Pulse Dot */}
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0c0618] flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  </span>
                </div>

                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-white tracking-tight leading-none">
                      {assistantName}
                    </h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                      Online
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    Instant Helper &amp; Project FAQ
                  </p>
                </div>
              </div>

              {/* Minimize & Close Actions */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleCloseWidget}
                  aria-label="Minimize FAQ assistant"
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all active:scale-95"
                  title="Minimize"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleCloseWidget}
                  aria-label="Close FAQ assistant"
                  className="p-1.5 text-slate-400 hover:text-rose-300 hover:bg-rose-500/15 rounded-xl transition-all active:scale-95"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* --- SEARCH & ASK INPUT BAR --- */}
            <div className="p-3.5 sm:p-4 border-b border-purple-900/25 bg-slate-950/40 space-y-2.5">
              <form onSubmit={handleAskSubmit} className="relative flex items-center gap-2">
                <div className="relative flex-1 group">
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (noMatchFound) setNoMatchFound(false);
                    }}
                    placeholder="e.g. How much does a project cost?"
                    className="w-full pl-9 pr-9 py-2.5 rounded-2xl bg-slate-900/80 border border-purple-900/40 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/70 focus:ring-2 focus:ring-purple-500/20 transition-all shadow-inner"
                  />
                  <Search className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-purple-300 transition-colors" />

                  {searchQuery && (
                    <button
                      type="button"
                      onClick={handleResetSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded-full hover:bg-slate-800 transition-all"
                      aria-label="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn-primary-gradient px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer shadow-md hover:shadow-purple-500/30"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask</span>
                </button>
              </form>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
                {categories.map((category) => {
                  const isActive = activeCategory === category && !searchQuery;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => {
                        setActiveCategory(category);
                        setSearchQuery('');
                        setNoMatchFound(false);
                      }}
                      className={`px-3 py-1 rounded-full whitespace-nowrap transition-all duration-200 font-medium ${
                        isActive
                          ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(139,92,246,0.4)]'
                          : 'bg-slate-900/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-purple-950/40'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* --- BODY: FAQ ACCORDION LIST OR NO-MATCH FALLBACK --- */}
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3 custom-scroll overscroll-contain"
            >
              {/* Fallback state when query was searched and nothing matched */}
              {noMatchFound ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900/80 to-indigo-950/40 border border-purple-500/30 text-center space-y-4 shadow-xl"
                >
                  <div className="w-12 h-12 rounded-2xl bg-purple-900/40 border border-purple-700/40 mx-auto flex items-center justify-center text-purple-300 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                    <HelpCircle className="w-6 h-6" />
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-sm sm:text-base font-bold text-white">
                      Didn&apos;t find your answer? Ask me directly on WhatsApp
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed px-2">
                      Your query: &ldquo;<span className="text-purple-300 font-semibold">{searchQuery}</span>&rdquo; — I will personally review your questions and respond right away.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                    <a
                      href={fallbackWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all hover:scale-[1.02] active:scale-95"
                    >
                      <MessageCircle className="w-4 h-4 fill-white/20" />
                      <span>Send Question via WhatsApp</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </a>

                    <button
                      type="button"
                      onClick={handleResetSearch}
                      className="btn-secondary-outline py-2 px-3 text-xs flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Show All Questions</span>
                    </button>
                  </div>
                </motion.div>
              ) : filteredFaqs.length === 0 ? (
                /* Empty search results */
                <div className="text-center py-10 space-y-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900/90 border border-slate-800 mx-auto flex items-center justify-center text-slate-500">
                    <Search className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-slate-400">
                    No FAQs match your search query at this time.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetSearch}
                    className="text-xs text-purple-400 hover:text-purple-300 underline underline-offset-4"
                  >
                    Reset search
                  </button>
                </div>
              ) : (
                /* Normal FAQ Accordion */
                <div className="space-y-2.5">
                  {filteredFaqs.map((faq) => {
                    const isExpanded = expandedId === faq.id;
                    const isHighlighted = highlightedId === faq.id;

                    return (
                      <div
                        key={faq.id}
                        ref={(el) => {
                          itemRefs.current[faq.id] = el;
                        }}
                        className={`rounded-2xl transition-all duration-300 border overflow-hidden ${
                          isHighlighted
                            ? 'border-purple-400/80 bg-purple-950/35 ring-2 ring-purple-500/50 shadow-[0_0_25px_rgba(139,92,246,0.35)]'
                            : isExpanded
                            ? 'border-purple-500/40 bg-slate-900/80 shadow-md'
                            : 'border-purple-950/30 bg-slate-900/40 hover:bg-slate-900/70 hover:border-purple-900/50'
                        }`}
                      >
                        {/* Question Trigger */}
                        <button
                          type="button"
                          onClick={() => toggleAccordion(faq.id)}
                          aria-expanded={isExpanded}
                          className="w-full p-3.5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white transition-colors group cursor-pointer"
                        >
                          <span className="flex items-center gap-2 leading-snug">
                            {isHighlighted && (
                              <Sparkles className="w-4 h-4 text-purple-400 shrink-0 animate-spin" />
                            )}
                            <span className="group-hover:text-purple-300 transition-colors">
                              {faq.question}
                            </span>
                          </span>

                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 bg-slate-800/80 text-slate-400 group-hover:text-white ${
                              isExpanded ? 'rotate-180 bg-purple-600/30 text-purple-300' : ''
                            }`}
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </div>
                        </button>

                        {/* Answer Animated Content */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              key="content"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <div className="px-3.5 pb-3.5 pt-1 text-xs sm:text-[13px] text-slate-300 leading-relaxed border-t border-purple-950/30">
                                <p className="mb-3 whitespace-pre-line">{faq.answer}</p>

                                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
                                  {faq.category && (
                                    <span className="px-2 py-0.5 rounded-md bg-purple-950/50 border border-purple-900/40 text-purple-300 text-[10px]">
                                      {faq.category}
                                    </span>
                                  )}

                                  <a
                                    href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                                      `Hi Bilal, I would like to learn more about:\n"${faq.question}"`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1 hover:underline"
                                  >
                                    <span>Discuss on WhatsApp</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* --- BOTTOM QUICK ACTIONS BAR --- */}
            <div className="p-3 sm:p-3.5 border-t border-purple-900/30 bg-slate-950/70 flex items-center justify-between gap-2.5">
              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.02] active:scale-95 group"
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                </div>
                <span>Chat directly on WhatsApp</span>
              </a>

              <a
                href={`tel:+${cleanPhone}`}
                className="p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-purple-900/40 text-slate-300 hover:text-white transition-all active:scale-95 shrink-0"
                title="Direct Phone Call"
                aria-label="Direct Phone Call"
              >
                <PhoneCall className="w-4 h-4 text-purple-400" />
              </a>
            </div>
          </motion.div>
        ) : (
          /* ================= COMPACT FLOATING TRIGGER VIEW ================= */
          /* Matching user's provided reference design: Free unclipped avatar standing above the prompt card */
          <motion.div
            key="faq-trigger"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: 'spring', damping: 20, stiffness: 280 }}
            className="relative flex items-end select-none"
          >
            {/* Interactive Card Box */}
            <div
              onClick={handleOpenWidget}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleOpenWidget();
              }}
              className="relative group cursor-pointer flex items-center pl-24 sm:pl-28 pr-3.5 py-3 rounded-2xl border border-purple-500/30 hover:border-purple-400/60 bg-gradient-to-r from-[#170a2c]/95 via-[#0f0721]/95 to-[#160829]/95 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.65),0_0_25px_rgba(139,92,246,0.2)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.75),0_0_35px_rgba(139,92,246,0.35)] transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* --- FREE AVATAR EXTENDING ABOVE THE BOX (NO CIRCLE) --- */}
              <div className="absolute -bottom-1 left-1 sm:left-2 w-24 sm:w-28 h-36 sm:h-44 pointer-events-none z-10">
                <Image
                  src={avatarSrc}
                  alt="Bilal Khubieh Avatar"
                  width={112}
                  height={176}
                  className="w-full h-full object-contain object-bottom drop-shadow-[0_12px_20px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform duration-300"
                  priority
                />

                {/* Little speech bubble above avatar's head */}
                {showPromptBubble && (
                  <div className="absolute -top-4 sm:-top-5 left-1 sm:left-2 bg-white text-slate-900 font-extrabold text-[11px] sm:text-xs px-2.5 py-1 rounded-xl shadow-[0_6px_20px_rgba(0,0,0,0.35)] flex items-center gap-1 z-20 whitespace-nowrap animate-bounce">
                    <span>Hi there! 👋</span>
                    {/* Speech bubble pointer arrow */}
                    <div className="absolute -bottom-1 left-4 w-2 h-2 bg-white rotate-45" />
                  </div>
                )}
              </div>

              {/* Text content inside the card box */}
              <div className="text-left space-y-0.5 pr-3">
                <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-purple-200 transition-colors leading-tight">
                  Have a question before we start?
                </h4>
                <p className="text-[11px] sm:text-xs text-purple-300/90 font-medium">
                  Quick answers in seconds
                </p>
              </div>

              {/* Action Button Badge on the right corner */}
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/40 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all shadow-sm shrink-0">
                <MousePointerClick className="w-4 h-4 transition-transform group-hover:scale-110" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
