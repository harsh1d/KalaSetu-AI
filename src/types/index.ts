export type Language = 'en' | 'hi' | 'bn' | 'ta' | 'mr';

export type UserRole = 'buyer' | 'artisan' | 'admin';

export interface TransparentPricing {
  artisanPayout: number;        // Direct to artisan (typically 70-75%)
  materialsCost: number;        // Direct reimbursement for raw silk, natural dye, brass, clay
  logisticsAndPackaging: number;// Eco-friendly packaging & insured transport
  platformFee: number;          // Minimal 5% platform maintenance & server costs
  marketComparisonPrice: number;// What middlemen/retailers typically charge (often 2x-3x)
  currency: string;
}

export interface GIInfo {
  isCertified: boolean;
  registrationNumber?: string;
  region: string;
  state: string;
  certifyingBody: string;
  yearRecognized?: number;
}

export interface Artisan {
  id: string;
  name: string;
  vernacularName?: string;
  avatar: string;
  coverImage?: string;
  craft: string;
  experienceYears: number;
  village: string;
  district: string;
  state: string;
  cooperativeName: string;
  bio: string;
  voiceNoteUrl?: string;
  verifiedStatus: 'verified' | 'pending' | 'rejected';
  totalEarnings: number;
  ordersFulfilled: number;
  rating: number;
  reviewCount: number;
  specialties: string[];
  badges: string[];
}

export interface Product {
  id: string;
  title: string;
  vernacularTitles?: Partial<Record<Language, string>>;
  craftCategory: string;
  artisanId: string;
  artisanName: string;
  artisanAvatar: string;
  artisanLocation: string;
  price: number;
  originalFairPrice: number;
  pricingBreakdown: TransparentPricing;
  giInfo: GIInfo;
  images: string[];
  description: string;
  culturalStory: string;
  materials: string[];
  techniques: string[];
  productionTimeHours: number;
  ecoFriendlyScore: number; // 1-100
  stock: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  dimensions?: string;
  weightGrams?: number;
  careInstructions?: string;
  isAiCataloged?: boolean;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productTitle: string;
  productImage: string;
  price: number;
  quantity: number;
  artisanId: string;
  artisanName: string;
}

export interface OrderTrackingStep {
  title: string;
  description: string;
  completed: boolean;
  timestamp?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  buyerName: string;
  buyerEmail: string;
  shippingAddress: string;
  items: OrderItem[];
  totalAmount: number;
  artisanTotalShare: number;
  tipAmount: number;
  status: 'crafting' | 'quality_check' | 'gi_verified' | 'in_transit' | 'delivered';
  trackingTimeline: OrderTrackingStep[];
  escrowStatus: 'held_in_escrow' | 'partially_released' | 'fully_paid_to_artisan';
  trackingNumber: string;
}

export interface AIAnalysisResult {
  identifiedCraft: string;
  confidenceScore: number;
  suggestedTitle: string;
  vernacularTitles: Partial<Record<Language, string>>;
  culturalNarrative: string;
  suggestedCategory: string;
  giRegion: string;
  giState: string;
  materialsDetected: string[];
  suggestedTechniques: string[];
  estimatedLaborHours: number;
  recommendedFairPrice: number;
  pricingBreakdown: TransparentPricing;
  seoKeywords: string[];
  authenticityMarkers: string[];
  careGuide: string;
}

export interface FilterOptions {
  searchQuery: string;
  craftCategory: string;
  state: string;
  priceRange: [number, number];
  giOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'impact' | 'rating';
}
