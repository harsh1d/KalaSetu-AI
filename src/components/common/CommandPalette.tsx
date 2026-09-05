import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  Mic, 
  ShoppingBag, 
  ShieldCheck, 
  Palette, 
  ArrowRight, 
  X,
  Languages,
  DollarSign
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CommandPalette: React.FC = () => {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen, 
    products, 
    setActiveProductDetail, 
    setActiveView, 
    setRole,
    setLanguage,
    setIsCartOpen,
    filters,
    setFilters
  } = useApp();

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.craftCategory.toLowerCase().includes(query.toLowerCase()) ||
    p.artisanLocation.toLowerCase().includes(query.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 5);

  const quickActions = [
    {
      label: 'Record New Craft via Vernacular Voice',
      category: 'Smart Cataloging',
      icon: Mic,
      action: () => {
        setRole('artisan');
        setActiveView('catalog-wizard');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      label: 'Calculate Fair Trade Wage & Living Cost',
      category: 'Artisan Studio',
      icon: DollarSign,
      action: () => {
        setRole('artisan');
        setActiveView('catalog-wizard');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      label: 'Inspect GI Registry & Verification Hub',
      category: 'Cooperative Portal',
      icon: ShieldCheck,
      action: () => {
        setRole('admin');
        setActiveView('admin-cooperative');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      label: 'Switch to Hindi (हिन्दी)',
      category: 'Language',
      icon: Languages,
      action: () => {
        setLanguage('hi');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      label: 'Open Conscious Shopping Cart',
      category: 'Marketplace',
      icon: ShoppingBag,
      action: () => {
        setIsCartOpen(true);
        setIsCommandPaletteOpen(false);
      }
    }
  ].filter(a => a.label.toLowerCase().includes(query.toLowerCase()) || a.category.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-artisan-500 mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a craft name, GI region, artisan, or action..."
            className="w-full bg-transparent text-sm sm:text-base outline-hidden text-slate-900 dark:text-slate-100 placeholder-slate-400"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="ml-2 text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded font-mono"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-3">
          {/* Quick Actions */}
          {quickActions.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase px-3 py-1 tracking-wider">
                Quick Actions
              </div>
              <div className="space-y-1">
                {quickActions.map((action, idx) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={idx}
                      onClick={action.action}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-artisan-50 dark:hover:bg-artisan-950/40 text-slate-700 dark:text-slate-200 group transition-colors text-xs sm:text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-artisan-600 dark:text-artisan-400 group-hover:bg-artisan-100 dark:group-hover:bg-artisan-900">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-semibold">{action.label}</span>
                          <span className="ml-2 text-[10px] text-slate-400">({action.category})</span>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-artisan-600 transition-colors" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Crafts Results */}
          {filteredProducts.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase px-3 py-1 tracking-wider">
                Authentic Artisanal Crafts ({filteredProducts.length})
              </div>
              <div className="space-y-1">
                {filteredProducts.map(prod => (
                  <button
                    key={prod.id}
                    onClick={() => {
                      setActiveProductDetail(prod);
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-artisan-50 dark:hover:bg-artisan-950/40 text-slate-700 dark:text-slate-200 group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={prod.images[0]} 
                        alt={prod.title} 
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-800"
                      />
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                          {prod.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                          <span className="text-artisan-600 dark:text-artisan-400 font-medium">{prod.craftCategory}</span>
                          <span>•</span>
                          <span>{prod.artisanLocation}</span>
                          <span>•</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{prod.price.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-artisan-600 dark:text-artisan-400 font-semibold group-hover:underline">
                      Inspect →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {quickActions.length === 0 && filteredProducts.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-xs sm:text-sm">
              No matching craft or action found. Try "Dokra", "Pashmina", "Voice", or "Price".
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Tip: Press <kbd className="px-1 py-0.5 bg-white dark:bg-slate-900 border rounded font-mono">Esc</kbd> to close</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-artisan-500" /> Powered by KalaSetu Semantic Engine
          </span>
        </div>
      </div>
    </div>
  );
};
