import React from 'react';
import { 
  ShieldCheck, 
  Leaf, 
  Clock, 
  MapPin, 
  ShoppingBag, 
  Eye, 
  Sparkles,
  Award
} from 'lucide-react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setActiveProductDetail, language, t } = useApp();

  const artisanSharePercent = Math.round(
    (product.pricingBreakdown.artisanPayout / product.price) * 100
  );

  // Localized title if available
  const displayTitle = (language !== 'en' && product.vernacularTitles && product.vernacularTitles[language])
    ? product.vernacularTitles[language]
    : product.title;

  return (
    <div className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Top Media Area */}
      <div 
        onClick={() => setActiveProductDetail(product)}
        className="relative h-60 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer"
      >
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Gradient Overlay for badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Badges Top */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {product.giInfo.isCertified && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/95 text-white shadow-md backdrop-blur-xs">
              <Award className="w-3 h-3" />
              GI Certified ({product.giInfo.region})
            </span>
          )}

          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600/90 text-white shadow-md backdrop-blur-xs">
            <Leaf className="w-3 h-3 text-emerald-200" />
            {product.ecoFriendlyScore}% Eco
          </span>
        </div>

        {/* Bottom Image Overlay: Artisan Signature */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white pointer-events-none">
          <div className="flex items-center gap-2">
            <img 
              src={product.artisanAvatar} 
              alt={product.artisanName} 
              className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-sm"
            />
            <div className="leading-tight">
              <span className="text-xs font-bold block drop-shadow-xs">{product.artisanName}</span>
              <span className="text-[10px] text-white/90 flex items-center gap-0.5 drop-shadow-xs">
                <MapPin className="w-2.5 h-2.5 text-artisan-400" />
                {product.artisanLocation}
              </span>
            </div>
          </div>
          <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            {product.productionTimeHours}h craft
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Craft Tag & GI State */}
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-artisan-600 dark:text-artisan-400">
              {product.craftCategory}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              {product.giInfo.state}
            </span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => setActiveProductDetail(product)}
            className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-artisan-600 dark:hover:text-artisan-400 transition-colors cursor-pointer line-clamp-2 leading-snug"
          >
            {displayTitle}
          </h3>

          {/* Cultural summary snippet */}
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
            {product.culturalStory}
          </p>
        </div>

        {/* Price & Fair-Trade Breakdown Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          {/* Transparent Fair Trade Share Bar */}
          <div className="mb-2">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> {artisanSharePercent}% Direct to Artisan
              </span>
              <span className="text-slate-400 line-through text-[10px]">
                ₹{product.pricingBreakdown.marketComparisonPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
              <div 
                className="bg-emerald-500 h-full rounded-full" 
                style={{ width: `${artisanSharePercent}%` }} 
                title={`Artisan Share: ₹${product.pricingBreakdown.artisanPayout}`} 
              />
              <div 
                className="bg-amber-400 h-full" 
                style={{ width: `${Math.round((product.pricingBreakdown.materialsCost / product.price) * 100)}%` }} 
                title="Raw Materials" 
              />
              <div 
                className="bg-blue-400 h-full" 
                style={{ width: `${Math.round((product.pricingBreakdown.logisticsAndPackaging / product.price) * 100)}%` }} 
                title="Logistics" 
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400">Fair Price</span>
              <div className="text-base font-extrabold text-slate-900 dark:text-slate-50">
                ₹{product.price.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveProductDetail(product)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                title="Inspect Craft Story"
              >
                <Eye className="w-4 h-4" />
              </button>

              <button
                onClick={() => addToCart(product, 1)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-artisan-600 to-artisan-500 text-white font-semibold text-xs shadow-md shadow-artisan-600/20 hover:opacity-95 transition-all"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{t('addToCart')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
