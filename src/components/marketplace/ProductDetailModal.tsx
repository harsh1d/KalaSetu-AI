import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Leaf, 
  Clock, 
  MapPin, 
  Award, 
  ShoppingBag, 
  Heart, 
  Share2, 
  CheckCircle2, 
  Volume2, 
  Info,
  Layers,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProductDetailModal: React.FC = () => {
  const { 
    activeProductDetail, 
    setActiveProductDetail, 
    addToCart, 
    showToast,
    language,
    t 
  } = useApp();

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [directTip, setDirectTip] = useState(150);

  if (!activeProductDetail) return null;

  const product = activeProductDetail;
  const pricing = product.pricingBreakdown;

  const displayTitle = (language !== 'en' && product.vernacularTitles && product.vernacularTitles[language])
    ? product.vernacularTitles[language]
    : product.title;

  const artisanSharePercent = Math.round((pricing.artisanPayout / product.price) * 100);
  const middlemanMarkupSaved = pricing.marketComparisonPrice - product.price;

  const handlePlayVoice = () => {
    setIsPlayingAudio(true);
    showToast(`Playing artisan craft oral history in regional dialect...`, 'info');
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 4500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div 
        className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/40">
          <div className="flex items-center gap-2 text-xs font-semibold text-artisan-600 dark:text-artisan-400">
            <Sparkles className="w-4 h-4" />
            <span>KalaSetu Verified Heritage Craft</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-slate-500 dark:text-slate-400">{product.giInfo.region}, {product.giInfo.state}</span>
          </div>

          <button
            onClick={() => setActiveProductDetail(null)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Imagery & Provenance Badge */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {/* Primary Main Image */}
            <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-inner group">
              <img
                src={product.images[selectedImageIdx] || product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* GI Seal Watermark */}
              {product.giInfo.isCertified && (
                <div className="absolute top-3 left-3 bg-amber-500/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                  <Award className="w-4 h-4" />
                  <span>GI Certified • {product.giInfo.registrationNumber}</span>
                </div>
              )}

              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs flex items-center gap-1.5 font-medium">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                <span>{product.ecoFriendlyScore}% Sustainable</span>
              </div>
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      selectedImageIdx === idx 
                        ? 'border-artisan-500 scale-105 shadow-md' 
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Meet the Artisan Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/80 via-artisan-50/50 to-orange-50/80 dark:from-slate-800/80 dark:via-slate-800/50 dark:to-slate-800/80 border border-amber-200/60 dark:border-slate-700/60 shadow-sm">
              <div className="flex items-start gap-3.5">
                <img
                  src={product.artisanAvatar}
                  alt={product.artisanName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-artisan-500 shadow-md"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base flex items-center gap-1.5">
                        {product.artisanName}
                        <ShieldCheck className="w-4 h-4 text-emerald-500 inline" />
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-artisan-500" />
                        {product.artisanLocation}
                      </p>
                    </div>

                    <button
                      onClick={handlePlayVoice}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isPlayingAudio 
                          ? 'bg-artisan-600 text-white animate-pulse' 
                          : 'bg-white dark:bg-slate-700 text-artisan-700 dark:text-artisan-300 hover:bg-artisan-100 border border-artisan-200 dark:border-slate-600'
                      }`}
                      title="Listen to artisan oral narrative"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isPlayingAudio ? 'Listening...' : 'Hear Artisan Voice'}</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed italic bg-white/70 dark:bg-slate-900/60 p-2.5 rounded-xl border border-amber-100 dark:border-slate-700/50">
                    "{product.culturalStory}"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing Transparency, Specs, Purchase */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-6">
            <div>
              {/* Category & GI Body */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-artisan-100 text-artisan-800 dark:bg-artisan-950/60 dark:text-artisan-300">
                  {product.craftCategory}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {product.giInfo.certifyingBody}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-50 leading-tight">
                {displayTitle}
              </h2>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                {product.description}
              </p>

              {/* Materials & Heritage Techniques */}
              <div className="mt-4 space-y-2">
                <div className="flex items-start gap-2 text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 shrink-0 w-24">Materials:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.materials.map((m, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px]">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-2 text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 shrink-0 w-24">Techniques:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.techniques.map((t, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-artisan-50 dark:bg-artisan-950/40 text-artisan-700 dark:text-artisan-300 text-[11px] font-medium border border-artisan-100 dark:border-artisan-900">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {product.dimensions && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300 shrink-0 w-24">Dimensions:</span>
                    <span className="text-slate-600 dark:text-slate-400">{product.dimensions} ({product.weightGrams}g)</span>
                  </div>
                )}
              </div>

              {/* 100% Transparent Pricing Breakdown Box */}
              <div className="mt-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Transparent Fair Living Wage Breakdown</span>
                  </div>
                  <span className="text-[11px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                    {artisanSharePercent}% To Artisan
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center py-2 border-y border-slate-200 dark:border-slate-700/60">
                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <div className="text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold">Artisan Payout</div>
                    <div className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400">₹{pricing.artisanPayout.toLocaleString('en-IN')}</div>
                    <div className="text-[9px] text-slate-500">{product.productionTimeHours} hrs labor</div>
                  </div>

                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="text-[10px] text-slate-500 font-semibold">Raw Materials</div>
                    <div className="text-sm font-extrabold text-slate-800 dark:text-slate-200">₹{pricing.materialsCost.toLocaleString('en-IN')}</div>
                    <div className="text-[9px] text-slate-400">100% natural</div>
                  </div>

                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="text-[10px] text-slate-500 font-semibold">Eco Logistics</div>
                    <div className="text-sm font-extrabold text-slate-800 dark:text-slate-200">₹{pricing.logisticsAndPackaging.toLocaleString('en-IN')}</div>
                    <div className="text-[9px] text-slate-400">Insured courier</div>
                  </div>

                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="text-[10px] text-slate-500 font-semibold">KalaSetu Fee</div>
                    <div className="text-sm font-extrabold text-slate-800 dark:text-slate-200">₹{pricing.platformFee.toLocaleString('en-IN')}</div>
                    <div className="text-[9px] text-slate-400">5% server cost</div>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
                  <span>Traditional Middleman Price: <s className="text-rose-500">₹{pricing.marketComparisonPrice.toLocaleString('en-IN')}</s></span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    You save ₹{middlemanMarkupSaved.toLocaleString('en-IN')} in middlemen fees
                  </span>
                </div>
              </div>

              {/* Direct Artisan Tip Slider */}
              <div className="mt-4 p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40">
                <div className="flex items-center justify-between text-xs font-semibold text-amber-900 dark:text-amber-300 mb-1.5">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    Direct Artisan Tipping (100% to Gauri Devi's family)
                  </span>
                  <span className="font-bold">₹{directTip}</span>
                </div>
                <div className="flex gap-2">
                  {[50, 100, 200, 500].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setDirectTip(amt)}
                      className={`flex-1 py-1 rounded-lg text-xs font-bold transition-colors ${
                        directTip === amt 
                          ? 'bg-amber-600 text-white shadow-xs' 
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-amber-200 dark:border-slate-700 hover:bg-amber-100'
                      }`}
                    >
                      +₹{amt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions: Price & Add to Cart */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Fair Trade Total</span>
                <div className="text-2xl font-black text-slate-900 dark:text-slate-50">
                  ₹{(product.price * quantity + directTip).toLocaleString('en-IN')}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-l-xl"
                  >
                    -
                  </button>
                  <span className="px-2 font-bold text-xs">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-r-xl"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={() => {
                    addToCart(product, quantity);
                    setActiveProductDetail(null);
                  }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-artisan-600 to-artisan-500 hover:from-artisan-700 hover:to-artisan-600 text-white font-bold text-sm shadow-lg shadow-artisan-600/30 transition-all hover:scale-102"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t('addToCart')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
