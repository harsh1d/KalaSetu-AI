import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Award, 
  Users, 
  TrendingUp, 
  DollarSign, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Download, 
  Sparkles,
  ExternalLink,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminCooperativePortal: React.FC = () => {
  const { artisans, showToast } = useApp();

  const [metrics, setMetrics] = useState<any>({
    kpis: {
      totalArtisansOnboarded: 1842,
      artisansGrowthPct: 24.8,
      averageIncomeIncreasePct: 186.5,
      totalFairTradeVolumeINR: 48920500,
      directArtisanShareINR: 36201170,
      giCertificatesIssued: 3120,
      activeClustersCount: 38
    },
    regionalClusters: [
      { state: 'Bihar', craft: 'Madhubani Painting & Sikki Grass', artisans: 480, avgMonthlyWage: 28500, compliance: 99.2 },
      { state: 'Chhattisgarh', craft: 'Bastar Dokra & Bell Metal', artisans: 310, avgMonthlyWage: 31200, compliance: 98.6 },
      { state: 'Karnataka', craft: 'Channapatna Wooden Toys', artisans: 340, avgMonthlyWage: 26400, compliance: 100 },
      { state: 'Jammu & Kashmir', craft: 'Pashmina Weaving & Kani Shawls', artisans: 220, avgMonthlyWage: 44000, compliance: 99.8 },
      { state: 'Rajasthan', craft: 'Jaipur Blue Pottery & Bagru Block', artisans: 290, avgMonthlyWage: 29800, compliance: 97.9 },
      { state: 'Odisha', craft: 'Pattachitra & Pipli Applique', artisans: 202, avgMonthlyWage: 27500, compliance: 99.0 }
    ]
  });

  const [verificationQueue, setVerificationQueue] = useState([
    {
      id: 'reg-01',
      artisanName: 'Santosh Kumar Chitrakar',
      craft: 'Pattachitra Scroll Painting',
      village: 'Raghurajpur',
      state: 'Odisha',
      giRegistryNumber: 'GI-APPL-0112-REV',
      submittedDate: '2026-09-04',
      status: 'pending'
    },
    {
      id: 'reg-02',
      artisanName: 'Amina Begum',
      craft: 'Zardozi Hand Embroidery',
      village: 'Bareilly Old City',
      state: 'Uttar Pradesh',
      giRegistryNumber: 'GI-APPL-0145',
      submittedDate: '2026-09-03',
      status: 'pending'
    }
  ]);

  useEffect(() => {
    fetch('/api/analytics/metrics')
      .then(res => res.json())
      .then(data => {
        if (data.kpis) setMetrics(data);
      })
      .catch(() => {});
  }, []);

  const handleApprove = (id: string, name: string) => {
    setVerificationQueue(prev => prev.filter(item => item.id !== id));
    showToast(`Approved ${name}'s GI credentials and issued Digital Provenance Certificate.`, 'success');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-indigoStone-900 text-white p-6 sm:p-8 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>SIH26090 Cooperative Governance & GI Authenticity Registry</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            National Artisan Federation & GI Verification Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Real-time compliance monitoring of direct artisan payouts, authentic GI certifications, and regional craft cluster livelihoods.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-center">
            <div className="text-emerald-400 text-xl font-extrabold">99.4%</div>
            <div className="text-[10px] text-slate-300">Fair Wage Compliance</div>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-center">
            <div className="text-amber-400 text-xl font-extrabold">38</div>
            <div className="text-[10px] text-slate-300">Active GI Clusters</div>
          </div>
        </div>
      </div>

      {/* Executive KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft">
          <div className="text-xs text-slate-500 font-semibold mb-1">Total Empowered Artisans</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics.kpis.totalArtisansOnboarded.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            +{metrics.kpis.artisansGrowthPct}% growth YoY
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft">
          <div className="text-xs text-slate-500 font-semibold mb-1">Total Fair Trade Trade Volume</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            ₹{(metrics.kpis.totalFairTradeVolumeINR / 10000000).toFixed(2)} Cr
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            ₹{(metrics.kpis.directArtisanShareINR / 10000000).toFixed(2)} Cr paid directly to artisans
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft">
          <div className="text-xs text-slate-500 font-semibold mb-1">Average Artisan Income Increase</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            +{metrics.kpis.averageIncomeIncreasePct}%
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            Zero middleman deductions
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft">
          <div className="text-xs text-slate-500 font-semibold mb-1">Verifiable GI QR Passports Issued</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics.kpis.giCertificatesIssued.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">
            100% Tamper-proof
          </div>
        </div>
      </div>

      {/* Regional Clusters Heatmap Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-artisan-500" />
              Regional Artisan Craft Clusters Livelihood Index
            </h3>
            <p className="text-xs text-slate-500">
              State-wise distribution of certified artisans and living wage compliance
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-3">State Origin</th>
                <th className="py-3 px-3">Heritage Craft Tradition</th>
                <th className="py-3 px-3">Certified Artisans</th>
                <th className="py-3 px-3">Avg. Monthly Wage</th>
                <th className="py-3 px-3">Fair Wage Compliance</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {metrics.regionalClusters.map((cluster: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white">
                    {cluster.state}
                  </td>
                  <td className="py-3.5 px-3 font-medium text-artisan-600 dark:text-artisan-400">
                    {cluster.craft}
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-slate-700 dark:text-slate-300">
                    {cluster.artisans} active master craftspeople
                  </td>
                  <td className="py-3.5 px-3 font-bold text-emerald-600">
                    ₹{cluster.avgMonthlyWage.toLocaleString('en-IN')}/mo
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${cluster.compliance}%` }} />
                      </div>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{cluster.compliance}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Active Cluster
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* GI Verification & Pending Artisan Queue */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Pending GI Tag & Artisan Credential Verification Queue
            </h3>
            <p className="text-xs text-slate-500">
              Inspect craft sample proofs and authenticate GI registration before global marketplace publishing
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
            {verificationQueue.length} Pending Approvals
          </span>
        </div>

        {verificationQueue.length > 0 ? (
          <div className="space-y-3">
            {verificationQueue.map(item => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.artisanName}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-bold">
                      {item.giRegistryNumber}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Craft: <strong className="text-slate-700 dark:text-slate-300">{item.craft}</strong> • {item.village}, {item.state}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleApprove(item.id, item.artisanName)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve & Certify GI</span>
                  </button>
                  <button
                    onClick={() => {
                      setVerificationQueue(prev => prev.filter(i => i.id !== item.id));
                      showToast(`Requested additional provenance documents from ${item.artisanName}.`, 'info');
                    }}
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold"
                  >
                    Request Documents
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
            All artisan credential submissions have been verified and authorized.
          </div>
        )}
      </div>
    </div>
  );
};
