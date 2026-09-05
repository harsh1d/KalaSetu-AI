import { Router, Request, Response } from 'express';

const router = Router();

router.get('/metrics', (req: Request, res: Response) => {
  try {
    const kpis = {
      totalArtisansOnboarded: 1842,
      artisansGrowthPct: 24.8,
      averageIncomeIncreasePct: 186.5, // 186% increase compared to middleman channels
      totalFairTradeVolumeINR: 48920500, // ₹4.89 Cr
      directArtisanShareINR: 36201170, // Over 74% directly to artisans
      giCertificatesIssued: 3120,
      plasticFreePackagingKg: 4250,
      activeClustersCount: 38
    };

    const regionalClusters = [
      { state: 'Bihar', craft: 'Madhubani Painting & Sikki Grass', artisans: 480, avgMonthlyWage: 28500, compliance: 99.2 },
      { state: 'Chhattisgarh', craft: 'Bastar Dokra & Bell Metal', artisans: 310, avgMonthlyWage: 31200, compliance: 98.6 },
      { state: 'Karnataka', craft: 'Channapatna Wooden Toys & Kinhal', artisans: 340, avgMonthlyWage: 26400, compliance: 100 },
      { state: 'Jammu & Kashmir', craft: 'Pashmina Weaving & Kani Shawls', artisans: 220, avgMonthlyWage: 44000, compliance: 99.8 },
      { state: 'Rajasthan', craft: 'Jaipur Blue Pottery & Bagru Block', artisans: 290, avgMonthlyWage: 29800, compliance: 97.9 },
      { state: 'Odisha', craft: 'Pattachitra & Pipli Applique', artisans: 202, avgMonthlyWage: 27500, compliance: 99.0 }
    ];

    const marketTrends = [
      { craft: 'Terracotta & Earthen Tableware', demandScore: 94, trend: 'up', season: 'Festive Autumn', popularQuery: 'organic glazed tea set' },
      { craft: 'Madhubani Canvas Wall Panels', demandScore: 89, trend: 'up', season: 'Corporate Gifting', popularQuery: 'tree of life handpainted' },
      { craft: 'Channapatna Montessori Toys', demandScore: 92, trend: 'up', season: 'Year-round', popularQuery: 'non toxic wooden rainbow' },
      { craft: 'Pure Cashmere / Pashmina Wraps', demandScore: 86, trend: 'steady', season: 'Pre-Winter', popularQuery: 'certified sozni shawl' }
    ];

    res.json({
      success: true,
      kpis,
      regionalClusters,
      marketTrends
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
