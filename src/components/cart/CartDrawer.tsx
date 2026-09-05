import React from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Heart, 
  Sparkles,
  MapPin
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    artisanTip,
    setArtisanTip,
    setIsCheckoutModalOpen,
    setActiveProductDetail,
    t 
  } = useApp();

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalArtisanDirectShare = cart.reduce((sum, item) => sum + item.product.pricingBreakdown.artisanPayout * item.quantity, 0);
  const totalAmount = subtotal + artisanTip;
  const directPercentage = subtotal > 0 ? Math.round((totalArtisanDirectShare / subtotal) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/40">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-artisan-500" />
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {t('cartTitle')}
                </h3>
                <p className="text-[11px] text-emerald-600 font-semibold">
                  100% Fair Trade Escrow Protected
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                  {t('emptyCart')}
                </h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Explore our authentic GI certified crafts made by marginalized master artisans.
                </p>
              </div>
            ) : (
              cart.map(item => (
                <div 
                  key={item.product.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex gap-3 relative"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 
                          onClick={() => {
                            setActiveProductDetail(item.product);
                            setIsCartOpen(false);
                          }}
                          className="text-xs font-bold text-slate-900 dark:text-white truncate hover:text-artisan-600 cursor-pointer"
                        >
                          {item.product.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-400 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                        <MapPin className="w-2.5 h-2.5 text-artisan-500" />
                        {item.product.artisanName} • {item.product.artisanLocation}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                      <div className="text-xs font-black text-slate-900 dark:text-white">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </div>

                      <div className="flex items-center border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-xs">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="px-2 py-0.5 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          -
                        </button>
                        <span className="px-2 font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="px-2 py-0.5 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Direct Artisan Tip Section */}
            {cart.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-300">
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    Direct Artisan Family Tip:
                  </span>
                  <span>₹{artisanTip}</span>
                </div>
                <p className="text-[10px] text-slate-500">
                  100% of this tip is disbursed directly to the artisan's personal bank account.
                </p>
                <div className="flex gap-2">
                  {[0, 100, 200, 500].map(tip => (
                    <button
                      key={tip}
                      onClick={() => setArtisanTip(tip)}
                      className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all ${
                        artisanTip === tip
                          ? 'bg-amber-600 text-white'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-amber-200 dark:border-slate-700'
                      }`}
                    >
                      {tip === 0 ? 'None' : `+₹${tip}`}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/60 space-y-3">
              {/* Impact Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Craft Subtotal</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 font-bold">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Direct Artisan Share ({directPercentage}%)
                  </span>
                  <span>₹{totalArtisanDirectShare.toLocaleString('en-IN')}</span>
                </div>
                {artisanTip > 0 && (
                  <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 font-semibold">
                    <span>Direct Artisan Tip</span>
                    <span>₹{artisanTip.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-slate-500">
                  <span>Insured Eco-Courier & Taxes</span>
                  <span className="text-emerald-600 font-semibold">Free / Included</span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-sm font-extrabold text-slate-900 dark:text-white">
                  <span>Total Amount</span>
                  <span className="text-lg">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout Trigger */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutModalOpen(true);
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-artisan-600 to-artisan-500 hover:from-artisan-700 hover:to-artisan-600 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-artisan-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <span>{t('checkout')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
