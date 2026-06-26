'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Global auto-refresh every 60 seconds to update server data for ALL pages without hitting rate limits
    const interval = setInterval(() => {
      router.refresh();
    }, 60000);
    return () => clearInterval(interval);
  }, [router]);

  const navLinks = [
    { href: '/', labelKey: 'groupStage' },
    { href: '/terceros', labelKey: 'thirdPlaces' },
    { href: '/bracket', labelKey: 'knockoutMap' },
    { href: '/stats', labelKey: 'stats' },
    { href: '/venues', labelKey: 'venues' },
  ];

  return (
    <>
      <nav className="glass sticky top-0 z-50 border-b border-white/10 shadow-lg">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Mobile Hamburger Button */}
            <div className="flex items-center md:hidden">
              <button onClick={() => setIsOpen(true)} className="p-2 -ml-2 text-slate-300 hover:text-white transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
                WC26
              </span>
            </div>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-1 md:space-x-4 flex-1 md:justify-center mx-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 md:px-5 py-2 rounded-lg text-sm md:text-base font-semibold whitespace-nowrap transition-all duration-300 ${
                      isActive
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                    }`}
                  >
                    {t(link.labelKey)}
                  </Link>
                );
              })}
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex bg-slate-800/50 rounded-lg p-1 border border-white/5">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-1 text-xs font-bold rounded-md transition-colors ${language === 'en' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('es')}
                  className={`px-2 py-1 text-xs font-bold rounded-md transition-colors ${language === 'es' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  ES
                </button>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-xs font-medium text-emerald-400/80 tracking-widest uppercase">Live</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={() => setIsOpen(false)}
          ></div>
          
          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 w-72 glass border-r border-white/10 shadow-2xl flex flex-col p-6 animate-in slide-in-from-left duration-300 z-10">
            <div className="flex justify-between items-center mb-8">
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
                WC26
              </span>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`px-5 py-4 rounded-xl text-lg font-bold transition-all duration-300 flex items-center gap-4 ${
                      isActive
                        ? 'bg-gradient-to-r from-sky-500/20 to-emerald-500/10 text-sky-300 border border-sky-500/30'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white border border-transparent'
                    }`}
                  >
                    {t(link.labelKey)}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
