import { Router, Request, Response } from 'express';
import { Order, OrderTrackingStep } from '../../src/types/index';

const router = Router();

// In-memory orders store
let orders: Order[] = [
  {
    id: 'ORD-2026-8941',
    createdAt: '2026-09-02T11:20:00Z',
    buyerName: 'Priya Sharma',
    buyerEmail: 'priya.s@example.com',
    shippingAddress: '42, Indiranagar 100ft Road, Bangalore, Karnataka - 560038',
    items: [
      {
        productId: 'prod-1',
        productTitle: 'Tree of Life with Sun & Moon - Mithila Folk Art',
        productImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
        price: 3499,
        quantity: 1,
        artisanId: 'art-1',
        artisanName: 'Gauri Devi Jha'
      }
    ],
    totalAmount: 3749,
    artisanTotalShare: 2600,
    tipAmount: 250,
    status: 'in_transit',
    trackingTimeline: [
      {
        title: 'Craft Creation Completed',
        description: 'Master Gauri Devi finished hand-painting with organic bamboo nibs in Madhubani village.',
        completed: true,
        timestamp: '2026-09-02T14:30:00Z'
      },
      {
        title: 'GI Tag & Quality Verification',
        description: 'Mithila Mahila Kalakriti Samiti certified authenticity and applied verifiable GI seal.',
        completed: true,
        timestamp: '2026-09-03T10:15:00Z'
      },
      {
        title: 'Eco-Packaging with Artisan Story',
        description: 'Packed in zero-plastic biodegradable kraft box with handwritten thank-you letter.',
        completed: true,
        timestamp: '2026-09-03T18:00:00Z'
      },
      {
        title: 'In Transit via Insured Craft Logistics',
        description: 'Departed Patna central logistics hub en route to Bangalore.',
        completed: true,
        timestamp: '2026-09-04T08:45:00Z'
      },
      {
        title: 'Out for Delivery',
        description: 'Expected arrival today by 4:00 PM.',
        completed: false
      }
    ],
    escrowStatus: 'partially_released',
    trackingNumber: 'KS-IND-774920'
  },
  {
    id: 'ORD-2026-8942',
    createdAt: '2026-09-04T15:10:00Z',
    buyerName: 'Arjun Mehta',
    buyerEmail: 'arjun.m@example.com',
    shippingAddress: '15, Altamount Road, Mumbai, Maharashtra - 400026',
    items: [
      {
        productId: 'prod-2',
        productTitle: 'Dancing Tribal Musician with Dhol - Lost-Wax Dokra Sculpture',
        productImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
        price: 2850,
        quantity: 1,
        artisanId: 'art-2',
        artisanName: 'Suresh Kumar Baghel'
      }
    ],
    totalAmount: 2850,
    artisanTotalShare: 2150,
    tipAmount: 0,
    status: 'gi_verified',
    trackingTimeline: [
      {
        title: 'Craft Creation Completed',
        description: 'Lost-wax casting executed at Kondagaon artisan pit.',
        completed: true,
        timestamp: '2026-09-04T16:00:00Z'
      },
      {
        title: 'GI Tag & Quality Verification',
        description: 'Gadhbastar Tribal Federation verified lost-wax authenticity.',
        completed: true,
        timestamp: '2026-09-05T09:00:00Z'
      },
      {
        title: 'Eco-Packaging with Artisan Story',
        description: 'Wrapping in recycled termite-clay protective padding.',
        completed: false
      },
      {
        title: 'In Transit via Insured Craft Logistics',
        description: 'Dispatched to transit hub.',
        completed: false
      },
      {
        title: 'Out for Delivery',
        description: 'Estimated delivery in 2 business days.',
        completed: false
      }
    ],
    escrowStatus: 'held_in_escrow',
    trackingNumber: 'KS-IND-881942'
  }
];

// GET /api/orders
router.get('/', (req: Request, res: Response) => {
  try {
    const { artisanId, buyerEmail } = req.query;
    let filtered = [...orders];

    if (artisanId) {
      filtered = filtered.filter(o => o.items.some(i => i.artisanId === artisanId));
    }
    if (buyerEmail) {
      filtered = filtered.filter(o => o.buyerEmail.toLowerCase() === (buyerEmail as string).toLowerCase());
    }

    res.json({ success: true, count: filtered.length, orders: filtered });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/orders/:id
router.get('/:id', (req: Request, res: Response) => {
  try {
    const order = orders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/orders - Checkout creation
router.post('/', (req: Request, res: Response) => {
  try {
    const { buyerName, buyerEmail, shippingAddress, items, totalAmount, artisanTotalShare, tipAmount } = req.body;

    const newOrder: Order = {
      id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      buyerName: buyerName || 'Conscious Buyer',
      buyerEmail: buyerEmail || 'buyer@example.com',
      shippingAddress: shippingAddress || 'Craft Connoisseur Suite, New Delhi, India',
      items: items || [],
      totalAmount: Number(totalAmount) || 0,
      artisanTotalShare: Number(artisanTotalShare) || Math.round(Number(totalAmount) * 0.72),
      tipAmount: Number(tipAmount) || 0,
      status: 'crafting',
      trackingTimeline: [
        {
          title: 'Order Confirmed & Escrow Initiated',
          description: 'Payment placed in secure fair-trade escrow. Artisan alerted with direct advance allocation.',
          completed: true,
          timestamp: new Date().toISOString()
        },
        {
          title: 'Artisan Workshop Preparation',
          description: 'Artisan gathering GI-grade materials in their heritage village studio.',
          completed: false
        },
        {
          title: 'GI Tag & Quality Verification',
          description: 'Cooperative verification inspection and QR certificate generation.',
          completed: false
        },
        {
          title: 'Eco-Packaging & Dispatch',
          description: 'Biodegradable packaging and dispatch with courier.',
          completed: false
        },
        {
          title: 'Delivered & Escrow Payout Released',
          description: '100% of artisan share transferred directly to their bank account.',
          completed: false
        }
      ],
      escrowStatus: 'held_in_escrow',
      trackingNumber: `KS-IND-${Math.floor(100000 + Math.random() * 900000)}`
    };

    orders.unshift(newOrder);
    res.status(201).json({ success: true, order: newOrder });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/orders/:id/status - Update order tracking status
router.patch('/:id/status', (req: Request, res: Response) => {
  try {
    const { status, stepIndex } = req.body;
    const order = orders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (status) {
      order.status = status;
      if (status === 'delivered') {
        order.escrowStatus = 'fully_paid_to_artisan';
      }
    }

    if (typeof stepIndex === 'number' && order.trackingTimeline[stepIndex]) {
      order.trackingTimeline[stepIndex].completed = true;
      order.trackingTimeline[stepIndex].timestamp = new Date().toISOString();
    }

    res.json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
