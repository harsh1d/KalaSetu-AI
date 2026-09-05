import React, { useState } from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  Search, 
  Globe, 
  Sun, 
  Moon, 
  Layers, 
  Palette, 
  ShieldCheck, 
  UserCheck, 
  ChevronDown,
  Compass,
  Mic,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { Language, UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const { 
    role, 
    setRole, 
    activeView, 
    setActiveView, 
    language, 
    setLanguage, 
    t, 
    cart, 
    setIsCartOpen,
    setIsCommandPaletteOpen
  } = useApp();
  
  const { theme, toggleTheme } = useTheme();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' }
  ];

  const roles: { key: UserRole; title: string; subtitle: string; icon: any }[] = [
    { key: 'buyer', title: t('buyerRole'), subtitle: 'Discover & Buy Authentic GI Crafts', icon: Compass },
    { key: 'artisan', title: t('artisanRole'), subtitle: 'Voice Cataloging & Direct Fair Payouts', icon: Palette },
    { key: 'admin', title: t('adminRole'), subtitle: 'GI Verification & Cooperative Analytics', icon: ShieldCheck }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 glass-panel">
      {/* Top Banner: SIH 26090 Mission & Fair Living Wage Guarantee */}
      <div className="bg-gradient-to-r from-artisan-600 via-artisan-500 to-amber-600 text-white text-xs py-1.5 px-4 font-medium flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 text-white font-bold px-1.5 py-0.5 rounded text-[10px] tracking-wide uppercase">
              SIH 26090
            </span>
            <span>AI-Driven Market Linkage & Smart Cataloging for Marginalized Artisans</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-white/90 text-[11px]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Direct Fair Wage Escrow
            </span>
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5" /> AI Provenance Verification
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div 
          onClick={() => setActiveView('marketplace')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-artisan-500 via-amber-500 to-artisan-700 flex items-center justify-center text-white shadow-lg shadow-artisan-500/20 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5 text-white animate-pulse-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-artisan-600 to-amber-600 dark:from-artisan-400 dark:to-amber-400 bg-clip-text text-transparent">
                {t('brandName')}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                GI Verified
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5 hidden sm:block">
              {t('brandTagline')}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveView('marketplace')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeView === 'marketplace'
                ? 'bg-white dark:bg-slate-900 text-artisan-600 dark:text-artisan-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            {t('marketplace')}
          </button>

          <button
            onClick={() => {
              setActiveView('catalog-wizard');
              setRole('artisan');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeView === 'catalog-wizard'
                ? 'bg-white dark:bg-slate-900 text-artisan-600 dark:text-artisan-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-artisan-500" />
            <span>{t('catalogWizard')}</span>
            <span className="px-1 py-0.2 rounded text-[9px] bg-artisan-100 text-artisan-700 dark:bg-artisan-950/60 dark:text-artisan-300 font-bold">
              AI Voice
            </span>
          </button>

          <button
            onClick={() => {
              setActiveView('artisan-hub');
              setRole('artisan');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeView === 'artisan-hub'
                ? 'bg-white dark:bg-slate-900 text-artisan-600 dark:text-artisan-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            {t('artisanHub')}
          </button>

          <button
            onClick={() => {
              setActiveView('admin-cooperative');
              setRole('admin');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeView === 'admin-cooperative'
                ? 'bg-white dark:bg-slate-900 text-artisan-600 dark:text-artisan-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            {t('adminPortal')}
          </button>
        </nav>

        {/* Actions & Utilities */}
        <div className="flex items-center gap-2">
          {/* Quick Search trigger (Ctrl+K) */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium transition-colors"
            title="Global AI Search (Ctrl + K)"
          >
            <Search className="w-3.5 h-3.5 text-artisan-500" />
            <span className="hidden md:inline text-slate-400 dark:text-slate-500">AI Search...</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-500 font-mono shadow-xs">
              Ctrl+K
            </kbd>
          </button>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-artisan-500" />
              <span className="capitalize font-semibold">{role}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 animate-fade-in"
                onMouseLeave={() => setRoleDropdownOpen(false)}
              >
                <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 px-2.5 py-1 uppercase tracking-wider">
                  Select User Perspective
                </div>
                {roles.map(r => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.key}
                      onClick={() => {
                        setRole(r.key);
                        if (r.key === 'artisan') setActiveView('catalog-wizard');
                        else if (r.key === 'admin') setActiveView('admin-cooperative');
                        else setActiveView('marketplace');
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg flex items-start gap-2.5 transition-colors ${
                        role === r.key
                          ? 'bg-artisan-50 dark:bg-artisan-950/50 text-artisan-700 dark:text-artisan-300'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-artisan-600 dark:text-artisan-400 mt-0.5">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold leading-snug">{r.title}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                          {r.subtitle}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span className="uppercase text-[11px] font-bold">{language}</span>
            </button>

            {langDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-36 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-1.5 z-50 animate-fade-in"
                onMouseLeave={() => setLangDropdownOpen(false)}
              >
                {languages.map(l => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                      language === l.code
                        ? 'bg-artisan-500 text-white font-bold'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{l.label}</span>
                    <span className="text-[11px] opacity-75">{l.native}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark / Light Mode */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Theme"
          >
            {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-artisan-600 to-artisan-500 text-white font-semibold text-xs shadow-md shadow-artisan-600/20 hover:opacity-95 transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('cartTitle')}</span>
            {totalCartItems > 0 && (
              <span className="ml-0.5 bg-white text-artisan-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-xs">
                {totalCartItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-200 dark:border-slate-800 py-1.5 bg-slate-50 dark:bg-slate-900/90 text-xs">
        <button 
          onClick={() => setActiveView('marketplace')}
          className={`flex flex-col items-center gap-0.5 ${activeView === 'marketplace' ? 'text-artisan-600 font-bold' : 'text-slate-500'}`}
        >
          <Compass className="w-4 h-4" />
          <span>{t('marketplace')}</span>
        </button>
        <button 
          onClick={() => {
            setActiveView('catalog-wizard');
            setRole('artisan');
          }}
          className={`flex flex-col items-center gap-0.5 ${activeView === 'catalog-wizard' ? 'text-artisan-600 font-bold' : 'text-slate-500'}`}
        >
          <Mic className="w-4 h-4 text-artisan-500" />
          <span>{t('catalogWizard')}</span>
        </button>
        <button 
          onClick={() => {
            setActiveView('artisan-hub');
            setRole('artisan');
          }}
          className={`flex flex-col items-center gap-0.5 ${activeView === 'artisan-hub' ? 'text-artisan-600 font-bold' : 'text-slate-500'}`}
        >
          <Palette className="w-4 h-4" />
          <span>{t('artisanHub')}</span>
        </button>
        <button 
          onClick={() => {
            setActiveView('admin-cooperative');
            setRole('admin');
          }}
          className={`flex flex-col items-center gap-0.5 ${activeView === 'admin-cooperative' ? 'text-artisan-600 font-bold' : 'text-slate-500'}`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{t('adminPortal')}</span>
        </button>
      </div>
    </header>
  );
};
