'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function Navigation() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { href: '/', labelKey: 'groupStage' },
    { href: '/terceros', labelKey: 'thirdPlaces' },
    { href: '/bracket', labelKey: 'knockoutMap' },
    { href: '/stats', labelKey: 'stats' },
    { href: '/venues', labelKey: 'venues' },
  ];

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/10 shadow-lg">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
              WC26
            </span>
          </div>
          
          <div className="flex space-x-1 md:space-x-4 overflow-x-auto no-scrollbar py-2 flex-1 md:justify-center mx-4">
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
  );
}
