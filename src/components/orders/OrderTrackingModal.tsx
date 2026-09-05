import React from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Package, 
  ShieldCheck, 
  Truck, 
  Award,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OrderTrackingModal: React.FC = () => {
  const { 
    activeTrackingOrder, 
    setActiveTrackingOrder 
  } = useApp();

  if (!activeTrackingOrder) return null;

  const order = activeTrackingOrder;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-artisan-600 bg-artisan-50 dark:bg-artisan-950 px-2 py-0.5 rounded-md">
                {order.id}
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Craft Lifecycle & Escrow Tracking
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">Waybill: {order.trackingNumber}</span>
          </div>

          <button
            onClick={() => setActiveTrackingOrder(null)}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Item & Payout Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {order.items[0]?.productImage && (
                <img
                  src={order.items[0].productImage}
                  alt={order.items[0].productTitle}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                />
              )}
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                  {order.items[0]?.productTitle}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Artisan: <strong className="text-artisan-600">{order.items[0]?.artisanName}</strong>
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] text-slate-400 block">Artisan Direct Share:</span>
              <div className="text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                ₹{order.artisanTotalShare.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Escrow Status Pill */}
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold">
                Escrow Status: {order.escrowStatus === 'partially_released' ? 'Advance Paid, Balance in Escrow' : order.escrowStatus === 'fully_paid_to_artisan' ? 'Payout Fully Released to Artisan' : 'Secured in Escrow'}
              </span>
            </div>
            <span className="text-[10px] uppercase font-bold bg-emerald-100 dark:bg-emerald-900 px-2 py-0.5 rounded-full">
              Verified
            </span>
          </div>

          {/* Interactive Timeline of Stages */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Artisanal Handcraft & Delivery Lifecycle:
            </h4>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {order.trackingTimeline.map((step, idx) => (
                <div key={idx} className="relative group">
                  {/* Indicator Dot */}
                  <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] transition-all ${
                    step.completed
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400'
                  }`}>
                    {step.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                  </div>

                  <div className={`p-3.5 rounded-2xl border transition-all ${
                    step.completed
                      ? 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 shadow-xs'
                      : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 opacity-60'
                  }`}>
                    <div className="flex items-center justify-between">
                      <h5 className={`text-xs font-bold ${
                        step.completed ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                      }`}>
                        {step.title}
                      </h5>
                      {step.timestamp && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(step.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 flex items-center justify-between text-xs text-slate-500">
          <span>Destination: {order.shippingAddress.slice(0, 36)}...</span>
          <button
            onClick={() => setActiveTrackingOrder(null)}
            className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
