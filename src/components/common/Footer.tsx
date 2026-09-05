import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Leaf, 
  HeartHandshake, 
  Award, 
  Globe,
  ExternalLink,
  MapPin
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveView, setRole, t } = useApp();

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-xs">
      {/* Top Value Badges */}
      <div className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-artisan-100 dark:bg-artisan-950/60 text-artisan-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-slate-900 dark:text-white text-xs">100% Direct Fair Wage</h5>
              <p className="text-[11px] text-slate-500">Over 70% paid directly to the artisan's personal bank account.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-slate-900 dark:text-white text-xs">GI Registry Authenticity</h5>
              <p className="text-[11px] text-slate-500">Verifiable Geographical Indication certificates on every craft.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-slate-900 dark:text-white text-xs">Zero-Plastic Eco Packaging</h5>
              <p className="text-[11px] text-slate-500">Biodegradable unbleached materials preserving our environment.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-slate-900 dark:text-white text-xs">Voice-Assisted AI Cataloging</h5>
              <p className="text-[11px] text-slate-500">Breaking literacy barriers with native dialect voice recognition.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-artisan-600 text-white flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight">
              KalaSetu AI
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
            SIH26090: AI-Driven Market Linkage & Smart Cataloging for Marginalized Artisans. Rebuilding the bridges between India's generational craft clusters and global conscious markets.
          </p>
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            Al-Powered GI Provenance Architecture Active
          </div>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-wider">
            Marketplace
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => setActiveView('marketplace')} className="hover:text-artisan-600">
                All Heritage Crafts
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView('marketplace')} className="hover:text-artisan-600">
                GI Certified Works
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView('marketplace')} className="hover:text-artisan-600">
                Eco-Friendly Living
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView('marketplace')} className="hover:text-artisan-600">
                Corporate Gifting
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-wider">
            For Artisans
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => { setActiveView('catalog-wizard'); setRole('artisan'); }} className="hover:text-artisan-600">
                Voice Smart Cataloging
              </button>
            </li>
            <li>
              <button onClick={() => { setActiveView('artisan-hub'); setRole('artisan'); }} className="hover:text-artisan-600">
                Living Wage Calculator
              </button>
            </li>
            <li>
              <button onClick={() => { setActiveView('artisan-hub'); setRole('artisan'); }} className="hover:text-artisan-600">
                Direct Escrow Payouts
              </button>
            </li>
            <li>
              <button onClick={() => { setActiveView('artisan-hub'); setRole('artisan'); }} className="hover:text-artisan-600">
                AI Market Trend Radar
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-wider">
            Governance & GI
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => { setActiveView('admin-cooperative'); setRole('admin'); }} className="hover:text-artisan-600">
                GI Verification Portal
              </button>
            </li>
            <li>
              <button onClick={() => { setActiveView('admin-cooperative'); setRole('admin'); }} className="hover:text-artisan-600">
                Regional Cluster Heatmap
              </button>
            </li>
            <li>
              <a href="#un-sdg" className="hover:text-artisan-600">UN SDG 8 & 12 Compliance</a>
            </li>
            <li>
              <a href="#transparency" className="hover:text-artisan-600">Cost Transparency Charter</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal & Attribution */}
      <div className="border-t border-slate-100 dark:border-slate-800 py-4 px-4 text-center text-[11px] text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2026 KalaSetu AI • Developed for Smart India Hackathon (SIH26090)
          </span>
          <div className="flex items-center gap-4">
            <span>Ethical E-Commerce</span>
            <span>•</span>
            <span>Zero Middleman Markups</span>
            <span>•</span>
            <span>Open Provenance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
