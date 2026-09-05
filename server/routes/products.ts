import { Router, Request, Response } from 'express';
import { seedProducts } from '../data/seedData';
import { Product } from '../../src/types/index';

const router = Router();

// In-memory products store seeded with initial authentic crafts
let products: Product[] = [...seedProducts];

// GET /api/products - list with filters
router.get('/', (req: Request, res: Response) => {
  try {
    const { category, state, minPrice, maxPrice, giOnly, sort, artisanId } = req.query;

    let filtered = [...products];

    if (artisanId) {
      filtered = filtered.filter(p => p.artisanId === artisanId);
    }

    if (category && typeof category === 'string' && category !== 'all') {
      filtered = filtered.filter(p => p.craftCategory.toLowerCase().includes(category.toLowerCase()));
    }

    if (state && typeof state === 'string' && state !== 'all') {
      filtered = filtered.filter(p => p.giInfo.state.toLowerCase() === state.toLowerCase());
    }

    if (minPrice) {
      filtered = filtered.filter(p => p.price >= Number(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter(p => p.price <= Number(maxPrice));
    }

    if (giOnly === 'true') {
      filtered = filtered.filter(p => p.giInfo.isCertified);
    }

    if (sort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'impact') {
      filtered.sort((a, b) => b.ecoFriendlyScore - a.ecoFriendlyScore);
    }

    res.json({
      success: true,
      count: filtered.length,
      products: filtered
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/products/:id
router.get('/:id', (req: Request, res: Response) => {
  try {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/products - Create new product (from AI Smart Cataloging)
router.post('/', (req: Request, res: Response) => {
  try {
    const newProduct: Product = {
      ...req.body,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      rating: 5.0,
      reviewCount: 0,
      stock: req.body.stock || 10
    };

    products.unshift(newProduct);
    res.status(201).json({ success: true, product: newProduct });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/products/:id - Update product
router.patch('/:id', (req: Request, res: Response) => {
  try {
    const idx = products.findIndex(p => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    products[idx] = { ...products[idx], ...req.body };
    res.json({ success: true, product: products[idx] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/products/:id
router.delete('/:id', (req: Request, res: Response) => {
  try {
    products = products.filter(p => p.id !== req.params.id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
