import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Package, 
  Clock, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowUpRight, 
  Sparkles,
  MapPin,
  ExternalLink,
  ChevronRight,
  Eye
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';

export const ArtisanDashboard: React.FC = () => {
  const { 
    orders, 
    artisans, 
    setActiveView, 
    setActiveTrackingOrder, 
    showToast,
    t 
  } = useApp();

  const artisan = artisans[0] || {
    name: 'Gauri Devi Jha',
    craft: 'Madhubani Painting',
    village: 'Ranti, Madhubani',
    state: 'Bihar',
    totalEarnings: 342000,
    ordersFulfilled: 142,
    rating: 4.95
  };

  const [trends, setTrends] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/analytics/metrics')
      .then(res => res.json())
      .then(data => {
        if (data.marketTrends) setTrends(data.marketTrends);
      })
      .catch(() => {
        setTrends([
          { craft: 'Terracotta & Earthen Tableware', demandScore: 94, trend: 'up', season: 'Festive Autumn' },
          { craft: 'Madhubani Canvas Wall Panels', demandScore: 89, trend: 'up', season: 'Corporate Gifting' },
          { craft: 'Channapatna Montessori Toys', demandScore: 92, trend: 'up', season: 'Year-round' }
        ]);
      });
  }, []);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Artisan Identity Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-artisan-900 via-indigoStone-900 to-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={artisan.avatar}
            alt={artisan.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-artisan-500 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black">{artisan.name}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> GI Verified
              </span>
            </div>
            <p className="text-xs text-artisan-300 font-medium mt-0.5">
              Master Craftsperson • {artisan.craft}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <MapPin className="w-3.5 h-3.5 text-artisan-400" />
              <span>{artisan.village}, {artisan.state}</span>
              <span>•</span>
              <span>Mithila Mahila Kalakriti Samiti</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('catalog-wizard')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-artisan-600 to-artisan-500 hover:from-artisan-700 hover:to-artisan-600 text-white font-bold text-xs shadow-lg shadow-artisan-600/30 flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Catalog New Craft with Voice</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Total Direct Fair Earnings</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            ₹{artisan.totalEarnings.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +186% vs traditional middlemen
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Orders Handcrafted & Sold</span>
            <span className="p-1.5 rounded-lg bg-artisan-50 dark:bg-artisan-950 text-artisan-600">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {artisan.ordersFulfilled}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            100% On-time dispatch
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Escrow Balance Ready for Payout</span>
            <span className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            ₹18,500
          </div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">
            Auto-transfers upon delivery
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Customer Heritage Rating</span>
            <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {artisan.rating} / 5.0
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            From 98 verified buyers
          </div>
        </div>
      </div>

      {/* Main Content Grid: Live Orders & Market Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Active Orders Table */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Active Orders & Direct Escrow Payouts
              </h3>
              <p className="text-xs text-slate-500">Track and advance craft creation stages</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {orders.length} Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-2">Order ID</th>
                  <th className="py-3 px-2">Craft Item</th>
                  <th className="py-3 px-2">Buyer & Destination</th>
                  <th className="py-3 px-2">Your Fair Share</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-2 font-mono font-bold text-artisan-600">
                      {order.id}
                    </td>
                    <td className="py-3 px-2 font-semibold text-slate-900 dark:text-white">
                      {order.items[0]?.productTitle.slice(0, 24)}...
                    </td>
                    <td className="py-3 px-2 text-slate-500">
                      <div>{order.buyerName}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{order.shippingAddress}</div>
                    </td>
                    <td className="py-3 px-2 font-bold text-emerald-600">
                      ₹{order.artisanTotalShare.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 capitalize">
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => setActiveTrackingOrder(order)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-artisan-50 text-slate-700 dark:text-slate-300 hover:text-artisan-600 font-semibold text-[11px] transition-colors"
                      >
                        Track Lifecycle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: AI Market Demand & Trend Radar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-artisan-500" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  AI Market Demand Radar
                </h3>
                <p className="text-[11px] text-slate-500">Real-time buyer trends in urban metros</p>
              </div>
            </div>

            <div className="space-y-3">
              {trends.map((item, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{item.craft}</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      {item.demandScore}/100 Demand
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Peak Season: {item.season}</span>
                    <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> High Volume
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-2xl bg-artisan-50 dark:bg-artisan-950/40 border border-artisan-200 dark:border-artisan-800 text-[11px] text-artisan-800 dark:text-artisan-300">
              <strong className="block font-bold mb-0.5">AI Copilot Recommendation:</strong>
              Terracotta tea sets and natural Madhubani wall panels are experiencing a 42% spike in queries ahead of the upcoming festival season. Preparing 10-15 pieces is highly recommended.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
