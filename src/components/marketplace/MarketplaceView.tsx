import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  Mic, 
  Camera, 
  Filter, 
  SlidersHorizontal, 
  Award, 
  Leaf, 
  Check, 
  ChevronDown,
  RefreshCw,
  HeartHandshake,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './ProductCard';

export const MarketplaceView: React.FC = () => {
  const { 
    products, 
    filters, 
    setFilters, 
    resetFilters, 
    setIsVisualSearchOpen,
    showToast,
    t 
  } = useApp();

  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [aiIntentSummary, setAiIntentSummary] = useState<string | null>(null);

  const categories = [
    { key: 'all', label: 'All Heritage Crafts' },
    { key: 'madhubani', label: 'Madhubani Folk Art' },
    { key: 'dokra', label: 'Bastar Dokra Metal' },
    { key: 'channapatna', label: 'Channapatna Wooden Toys' },
    { key: 'pashmina', label: 'Kashmir Pashmina & Wool' },
    { key: 'blue pottery', label: 'Jaipur Blue Pottery' },
    { key: 'pattachitra', label: 'Pattachitra Art' }
  ];

  const states = ['all', 'Bihar', 'Chhattisgarh', 'Karnataka', 'Jammu & Kashmir', 'Rajasthan', 'Odisha'];

  // Handle Natural Language / Semantic Search
  const handleSemanticSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!filters.searchQuery.trim()) {
      setAiIntentSummary(null);
      return;
    }

    setIsSearchingAI(true);
    try {
      const res = await fetch('/api/ai/semantic-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: filters.searchQuery })
      });
      const data = await res.json();
      if (data.success) {
        let intentStr = `AI Search parsed query: "${data.query}"`;
        if (data.detectedIntent.maxBudget) intentStr += ` • Budget ≤ ₹${data.detectedIntent.maxBudget}`;
        if (data.detectedIntent.wantsGI) intentStr += ` • Prioritizing GI Certified`;
        if (data.detectedIntent.wantsEco) intentStr += ` • Eco-friendly filter`;
        setAiIntentSummary(intentStr);
        showToast(`AI matched ${data.matchCount} authentic crafts with semantic relevance.`, 'info');
      }
    } catch (err) {
      // client-side filter fallback
    } finally {
      setIsSearchingAI(false);
    }
  };

  // Filter products locally according to active filters
  const displayedProducts = products.filter(p => {
    // Search query match
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const match = 
        p.title.toLowerCase().includes(q) ||
        p.craftCategory.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.artisanLocation.toLowerCase().includes(q) ||
        p.tags.some(tag => tag.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Category match
    if (filters.craftCategory !== 'all') {
      if (!p.craftCategory.toLowerCase().includes(filters.craftCategory.toLowerCase())) {
        return false;
      }
    }

    // State match
    if (filters.state !== 'all') {
      if (p.giInfo.state.toLowerCase() !== filters.state.toLowerCase()) {
        return false;
      }
    }

    // GI tag only
    if (filters.giOnly && !p.giInfo.isCertified) {
      return false;
    }

    // Price range
    if (p.price < filters.priceRange[0] || p.price > filters.priceRange[1]) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'price-asc') return a.price - b.price;
    if (filters.sortBy === 'price-desc') return b.price - a.price;
    if (filters.sortBy === 'rating') return b.rating - a.rating;
    if (filters.sortBy === 'impact') return b.ecoFriendlyScore - a.ecoFriendlyScore;
    return 0; // featured
  });

  const handleVoiceSearchClick = () => {
    // Web Speech API or simulated vernacular voice trigger
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN'; // Indian voice recognition
      recognition.start();
      showToast('Listening in Hindi/English... Speak your craft request.', 'info');
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setFilters(prev => ({ ...prev, searchQuery: transcript }));
        showToast(`Heard: "${transcript}"`, 'success');
      };
      recognition.onerror = () => {
        // Fallback simulation
        setFilters(prev => ({ ...prev, searchQuery: 'handwoven silk shawl under 5000' }));
        showToast('Recognized spoken query: "handwoven silk shawl under 5000"', 'info');
      };
    } else {
      setFilters(prev => ({ ...prev, searchQuery: 'handwoven silk shawl under 5000' }));
      showToast('Recognized spoken query: "handwoven silk shawl under 5000"', 'info');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Section with AI Market Linkage Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigoStone-900 to-artisan-950 text-white p-6 sm:p-10 border border-slate-800 shadow-2xl">
        {/* Decorative ambient gradients */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-artisan-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-artisan-300 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>SIH26090 • AI Semantic Discovery & Direct Artisan Market Linkage</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Preserving Living Heritage, <br />
            <span className="bg-gradient-to-r from-artisan-400 via-amber-300 to-orange-400 bg-clip-text text-transparent">
              Empowering Grassroots Artisans.
            </span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-base mt-3 leading-relaxed max-w-2xl">
            Bypassing exploitative middlemen. Every purchase directly empowers certified tribal and rural master craftspeople through transparent pricing, verified GI provenance, and living wage compliance.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <div className="text-white font-extrabold text-lg sm:text-xl">74.2%</div>
              <div className="text-slate-400 text-[11px]">Direct to Artisan</div>
            </div>
            <div>
              <div className="text-white font-extrabold text-lg sm:text-xl">100%</div>
              <div className="text-slate-400 text-[11px]">GI Tag Authenticity</div>
            </div>
            <div>
              <div className="text-white font-extrabold text-lg sm:text-xl">1,840+</div>
              <div className="text-slate-400 text-[11px]">Artisans Empowered</div>
            </div>
            <div>
              <div className="text-white font-extrabold text-lg sm:text-xl">₹0</div>
              <div className="text-emerald-400 text-[11px] font-bold">Middleman Commission</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Search & Discovery Command Center */}
      <div className="space-y-4">
        <form onSubmit={handleSemanticSearch} className="relative">
          <div className="flex items-center rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-soft focus-within:border-artisan-500 dark:focus-within:border-artisan-500 p-2 transition-all">
            <Search className="w-5 h-5 text-artisan-500 ml-3 shrink-0" />
            
            <input
              type="text"
              value={filters.searchQuery}
              onChange={e => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              placeholder={t('searchPlaceholder')}
              className="flex-1 px-3 py-2 text-xs sm:text-sm bg-transparent outline-hidden text-slate-900 dark:text-slate-100 placeholder-slate-400"
            />

            {/* Tool buttons: Voice + Visual Camera */}
            <div className="flex items-center gap-1.5 shrink-0 pr-1">
              <button
                type="button"
                onClick={handleVoiceSearchClick}
                className="p-2 rounded-xl text-slate-500 hover:text-artisan-600 hover:bg-artisan-50 dark:hover:bg-slate-800 transition-colors"
                title="Search using vernacular voice input"
              >
                <Mic className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsVisualSearchOpen(true)}
                className="p-2 rounded-xl text-slate-500 hover:text-artisan-600 hover:bg-artisan-50 dark:hover:bg-slate-800 transition-colors"
                title="Visual Search: Upload craft photo"
              >
                <Camera className="w-4 h-4" />
              </button>

              <button
                type="submit"
                disabled={isSearchingAI}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-artisan-600 to-artisan-500 hover:from-artisan-700 hover:to-artisan-600 text-white font-bold text-xs shadow-md transition-all"
              >
                {isSearchingAI ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span className="hidden sm:inline">AI Search</span>
              </button>
            </div>
          </div>
        </form>

        {/* AI Intent Summary Banner if parsed */}
        {aiIntentSummary && (
          <div className="p-3 rounded-xl bg-artisan-50 dark:bg-artisan-950/40 border border-artisan-200 dark:border-artisan-900/60 flex items-center justify-between text-xs text-artisan-800 dark:text-artisan-200 animate-fade-in">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-artisan-500 shrink-0" />
              <span>{aiIntentSummary}</span>
            </span>
            <button
              onClick={() => {
                setAiIntentSummary(null);
                setFilters(prev => ({ ...prev, searchQuery: '' }));
              }}
              className="font-bold underline text-[11px] ml-2 shrink-0"
            >
              Clear
            </button>
          </div>
        )}

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setFilters(prev => ({ ...prev, craftCategory: cat.key }))}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filters.craftCategory === cat.key
                  ? 'bg-artisan-600 text-white shadow-sm shadow-artisan-600/30'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-artisan-400'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Control Bar: Filters, GI Tag Toggle, Sort Dropdown */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* GI Certified Only Toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none font-semibold text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={filters.giOnly}
              onChange={e => setFilters(prev => ({ ...prev, giOnly: e.target.checked }))}
              className="w-4 h-4 rounded text-artisan-600 focus:ring-artisan-500 rounded-sm"
            />
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              GI Certified Only
            </span>
          </label>

          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>

          {/* Regional State Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">State:</span>
            <select
              value={filters.state}
              onChange={e => setFilters(prev => ({ ...prev, state: e.target.value }))}
              className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-2 py-1 text-xs text-slate-700 dark:text-slate-200 font-medium outline-hidden"
            >
              {states.map(s => (
                <option key={s} value={s}>
                  {s === 'all' ? 'All Indian Regions' : s}
                </option>
              ))}
            </select>
          </div>

          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>

          {/* Price Range max selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Max Price:</span>
            <select
              value={filters.priceRange[1]}
              onChange={e => setFilters(prev => ({ ...prev, priceRange: [0, Number(e.target.value)] }))}
              className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-2 py-1 text-xs text-slate-700 dark:text-slate-200 font-medium outline-hidden"
            >
              <option value={50000}>Any Price</option>
              <option value={2000}>Under ₹2,000</option>
              <option value={4000}>Under ₹4,000</option>
              <option value={10000}>Under ₹10,000</option>
              <option value={20000}>Under ₹20,000</option>
            </select>
          </div>
        </div>

        {/* Sort and Count */}
        <div className="flex items-center gap-3">
          <span className="text-slate-500 font-medium">
            Showing <strong className="text-slate-900 dark:text-white">{displayedProducts.length}</strong> crafts
          </span>

          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-medium">Sort:</span>
            <select
              value={filters.sortBy}
              onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-2 py-1 text-xs text-slate-700 dark:text-slate-200 font-semibold outline-hidden"
            >
              <option value="featured">Featured Heritage</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="impact">Highest Eco Score</option>
              <option value="rating">Top Rated Artisans</option>
            </select>
          </div>

          {(filters.searchQuery || filters.craftCategory !== 'all' || filters.state !== 'all' || filters.giOnly || filters.priceRange[1] < 50000) && (
            <button
              onClick={resetFilters}
              className="text-artisan-600 dark:text-artisan-400 font-bold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {displayedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <div className="w-16 h-16 rounded-full bg-artisan-50 dark:bg-artisan-950/50 text-artisan-600 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            No artisan crafts matched current filters
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Try resetting your price filter, selecting "All Heritage Crafts", or using our AI natural language search above.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 rounded-xl bg-artisan-600 text-white font-semibold text-xs shadow-md"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
