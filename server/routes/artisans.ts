import { Router, Request, Response } from 'express';
import { seedArtisans } from '../data/seedData';
import { Artisan } from '../../src/types/index';

const router = Router();

let artisans: Artisan[] = [...seedArtisans];

// GET /api/artisans
router.get('/', (req: Request, res: Response) => {
  try {
    const { craft, state, verified } = req.query;
    let filtered = [...artisans];

    if (craft && typeof craft === 'string') {
      filtered = filtered.filter(a => a.craft.toLowerCase().includes(craft.toLowerCase()));
    }
    if (state && typeof state === 'string') {
      filtered = filtered.filter(a => a.state.toLowerCase() === state.toLowerCase());
    }
    if (verified === 'true') {
      filtered = filtered.filter(a => a.verifiedStatus === 'verified');
    }

    res.json({ success: true, count: filtered.length, artisans: filtered });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/artisans/:id
router.get('/:id', (req: Request, res: Response) => {
  try {
    const artisan = artisans.find(a => a.id === req.params.id);
    if (!artisan) {
      return res.status(404).json({ success: false, message: 'Artisan not found' });
    }
    res.json({ success: true, artisan });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/artisans/:id/tip - Direct customer tip to artisan
router.post('/:id/tip', (req: Request, res: Response) => {
  try {
    const { amount } = req.body;
    const tipVal = Number(amount) || 100;
    const artisan = artisans.find(a => a.id === req.params.id);
    if (!artisan) {
      return res.status(404).json({ success: false, message: 'Artisan not found' });
    }
    artisan.totalEarnings += tipVal;
    res.json({
      success: true,
      message: `Direct tip of ₹${tipVal} transferred directly to ${artisan.name}'s verified bank account.`,
      newTotalEarnings: artisan.totalEarnings
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/artisans/:id/verify - Admin/Cooperative verification
router.patch('/:id/verify', (req: Request, res: Response) => {
  try {
    const { status } = req.body; // 'verified' | 'rejected'
    const artisan = artisans.find(a => a.id === req.params.id);
    if (!artisan) {
      return res.status(404).json({ success: false, message: 'Artisan not found' });
    }
    artisan.verifiedStatus = status || 'verified';
    res.json({ success: true, artisan });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
