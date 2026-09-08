'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const NAV_ITEMS = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Certificates', href: '#certificates' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('Home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cvUrl, setCvUrl] = useState('/cv.pdf');
  const [cvFileName, setCvFileName] = useState('Belal_Mustafa_CV.pdf');

  useEffect(() => {
    async function fetchCv() {
      try {
        const res = await fetch('/api/cv');
        const json = await res.json();
        if (json.success && json.data?.file_url) {
          setCvUrl(json.data.file_url);
          if (json.data.file_name) {
            setCvFileName(json.data.file_name);
          }
        }
      } catch (err) {
        console.error('Error loading active CV link:', err);
      }
    }
    fetchCv();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = NAV_ITEMS
        .filter((item) => item.href.startsWith('#'))
        .map((item) => {
          const id = item.href.substring(1);
          const el = document.getElementById(id);
          return {
            name: item.name,
            offsetTop: el ? el.offsetTop : 0,
          };
        })
        .filter((sec) => sec.offsetTop > 0)
        .sort((a, b) => a.offsetTop - b.offsetTop);

      if (sections.length === 0) return;

      const currentScroll = window.scrollY + 150;

      if (currentScroll < sections[0].offsetTop) {
        setActiveSection('Home');
        return;
      }

      let matchedName = 'Home';
      for (let i = 0; i < sections.length; i++) {
        if (currentScroll >= sections[i].offsetTop) {
          matchedName = sections[i].name;
        } else {
          break;
        }
      }

      setActiveSection(matchedName);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: typeof NAV_ITEMS[0]) => {
    setActiveSection(item.name);

    if (item.name === 'Home' || item.href === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setActiveSection('Home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`w-full sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'backdrop-blur-xl border-b border-purple-900/30 shadow-lg shadow-purple-950/20 py-3.5'
          : 'bg-transparent border-b border-transparent shadow-none backdrop-blur-none py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-12">
        {/* Brand Logo */}
        <Link 
          href="/" 
          onClick={handleLogoClick}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <img
            src="/logo.svg"
            alt="Bilal Khubieh Logo"
            className="w-9 h-9 object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(139,92,246,0.3)]"
          />
          <span className="font-bold text-lg sm:text-xl tracking-tight text-slate-100 group-hover:text-purple-300 transition-colors">
            Bilal Khubieh
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.name;
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={`relative py-1 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.name}
                {isActive && (
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.8)] origin-left"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Action Button: Download CV */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href={cvUrl}
            download={cvFileName}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary-gradient text-sm px-6 py-2.5 rounded-full font-medium flex items-center gap-2 shadow-lg shadow-purple-500/25 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <span>Download CV</span>
            <Download className="w-4 h-4" />
          </a>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-slate-300 hover:text-white p-2.5 rounded-xl bg-slate-900/60 border border-purple-900/30 focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-purple-900/30 px-6 py-6 overflow-hidden mt-3"
          >
            <nav className="flex flex-col gap-3">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.name;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      handleNavClick(e, item);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-base font-medium py-2.5 px-4 rounded-xl transition-colors flex items-center justify-between ${
                      isActive
                        ? 'bg-purple-500/10 text-white border-l-4 border-purple-500 font-semibold'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <span>{item.name}</span>
                  </a>
                );
              })}
              <div className="pt-4 border-t border-purple-900/20">
                <a
                  href={cvUrl}
                  download={cvFileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary-gradient w-full text-center text-sm py-3 rounded-full font-semibold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                >
                  <span>Download CV</span>
                  <Download className="w-4 h-4" />
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
