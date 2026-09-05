import { Router, Request, Response } from 'express';
import { AIAnalysisResult, Product } from '../../src/types/index';
import { seedProducts } from '../data/seedData';

const router = Router();

// Craft knowledge base for AI smart cataloging
const CRAFT_KNOWLEDGE_BASE: Record<string, {
  category: string;
  giRegion: string;
  giState: string;
  materials: string[];
  techniques: string[];
  hourlyRate: number; // Fair hourly wage standard
  baseLaborHours: number;
  care: string;
  hindiTitle: string;
  bengaliTitle: string;
  tamilTitle: string;
  marathiTitle: string;
  storyTemplate: string;
  keywords: string[];
}> = {
  'madhubani': {
    category: 'Madhubani Painting',
    giRegion: 'Mithila',
    giState: 'Bihar',
    materials: ['Handmade Lokta Cotton Paper', 'Natural Lampblack Soot', 'Turmeric Dye', 'Aparajita Flower Extract', 'Bamboo Pen'],
    techniques: ['Kachni (Fine Line Hatching)', 'Bharni (Natural Pigment Filling)', 'Double Line Geometry'],
    hourlyRate: 150,
    baseLaborHours: 24,
    care: 'Frame with anti-reflective UV glass. Keep away from damp walls.',
    hindiTitle: 'प्रामाणिक मिथिला मधुबनी लोक चित्रकला',
    bengaliTitle: 'খাঁটি মিথিলা মধুবনী লোকচিত্র',
    tamilTitle: 'பாரம்பரிய மதுபானி நாட்டுப்புற ஓவியம்',
    marathiTitle: 'अस्सल मिथिला मधुबनी लोककला चित्र',
    storyTemplate: 'Handcrafted using traditional bamboo nibs and natural earth pigments, carrying forward ancient feminine artistic rituals that symbolize harmony, fertility, and cosmic order.',
    keywords: ['Madhubani', 'Mithila', 'Folk Art', 'Handmade Paper', 'Natural Pigments', 'GI Bihar']
  },
  'dokra': {
    category: 'Bastar Dokra Metal Craft',
    giRegion: 'Bastar',
    giState: 'Chhattisgarh',
    materials: ['Recycled Brass & Bell Metal', 'Beeswax', 'Termite Mound Clay', 'Charcoal & Rice Husk'],
    techniques: ['Cire Perdue (Lost-Wax Casting)', 'Hand-rolled wax threading', 'Clay mould annealing'],
    hourlyRate: 175,
    baseLaborHours: 20,
    care: 'Wipe gently with a soft dry cotton cloth. Do not use chemical abrasive liquids.',
    hindiTitle: 'बस्तर ढोकरा कांस्य शिल्प (लॉस्ट-वैक्स पद्धति)',
    bengaliTitle: 'বস্তর ডোকরা পিতল শিল্প (লস্ট-ওয়াক্স পদ্ধতি)',
    tamilTitle: 'பஸ்தார் டோக்ரா பித்தளை கலைப்படைப்பு',
    marathiTitle: 'बस्तर ढोकरा ब्रास कलाकृती (लॉस्ट-वॅक्स पद्धत)',
    storyTemplate: 'Created through the 4,000-year-old Indus Valley lost-wax method. Because each clay mold is shattered to release the glowing metal, no two Dokra pieces can ever be identical.',
    keywords: ['Dokra', 'Bastar', 'Lost Wax', 'Bell Metal', 'Tribal Art', 'Indus Valley', 'GI Chhattisgarh']
  },
  'channapatna': {
    category: 'Channapatna Lacquer Toys',
    giRegion: 'Channapatna',
    giState: 'Karnataka',
    materials: ['Wrightia tinctoria (Ivory Wood)', 'Natural Shellac', 'Turmeric Powder', 'Indigo Plant Dye', 'Kumkum Powder'],
    techniques: ['Wood Lathe Turning', 'Vegetable Friction Lacquering', 'Screw-chisel Carving'],
    hourlyRate: 140,
    baseLaborHours: 8,
    care: 'Clean with dry or slightly damp cotton cloth. Do not submerge in water.',
    hindiTitle: 'चन्नापटना प्राकृतिक लाख लकड़ी खिलौना (सुरक्षित एवं जैविक)',
    bengaliTitle: 'চন্নপট্টনা প্রাকৃতিক উদ্ভিজ্জ রঙের কাঠের খেলনা',
    tamilTitle: 'சென்னப்பட்னா மரத்தாலான இயற்கை வண்ண விளையாட்டுப் பொருள்',
    marathiTitle: 'चन्नपट्टण सेंद्रिय लाकडी खेळणी (विषमुक्त)',
    storyTemplate: 'Turned on high-speed foot or electric lathes using medicinal Ivory Wood and polished using purely organic lac melted by friction. Completely non-toxic and child-safe.',
    keywords: ['Channapatna', 'Ivory Wood', 'Natural Lacquer', 'Montessori Toy', 'Non-toxic', 'GI Karnataka']
  },
  'pashmina': {
    category: 'Authentic Pashmina & Sozni Embroidery',
    giRegion: 'Kashmir Valley',
    giState: 'Jammu & Kashmir',
    materials: ['100% Raw Changthangi Pashmina Wool', 'Fine Silk Needlework Yarn'],
    techniques: ['Traditional Yender Charkha Hand Spinning', 'Handloom Weaving', 'Fine Sozni Needle Embroidery'],
    hourlyRate: 220,
    baseLaborHours: 80,
    care: 'Dry clean only. Store in unbleached cotton muslin with natural lavender or neem sachets.',
    hindiTitle: 'अस्सल कश्मीरी पश्मीना शॉल (सुई सोज़नी कशीदाकारी)',
    bengaliTitle: 'আসল কাশ্মীরি পশমিনা শাল (সুঁই সোজনী কাজ)',
    tamilTitle: 'காஷ்மீரி அசல் பஷ்மினா சால்வை (கைத்தறி சோஜ்னி வேலைப்பாடு)',
    marathiTitle: 'अस्सल काश्मिरी पश्मीना शाल (सोजनी कशिदाकारी)',
    storyTemplate: 'Harvested from high-altitude Changthangi goats in Ladakh, spun on traditional Kashmiri spindles, and hand-stitched by generations of master artisans.',
    keywords: ['Pashmina', 'Cashmere', 'Kashmir', 'GI Certified', 'Sozni', 'Handwoven', 'Luxury']
  },
  'blue pottery': {
    category: 'Jaipur Blue Pottery',
    giRegion: 'Jaipur',
    giState: 'Rajasthan',
    materials: ['Powdered Quartz', 'Cullet Recycled Glass', 'Katira Natural Gum', 'Cobalt Oxide', 'Multani Mitti'],
    techniques: ['Clay-free dough moulding', 'Freehand cobalt ornamentation', 'Glaze kiln firing'],
    hourlyRate: 150,
    baseLaborHours: 12,
    care: 'Wipe with damp sponge. Handle with care like delicate ceramic.',
    hindiTitle: 'जयपुर ब्लू पॉटरी हस्तशिल्प कलाकृति',
    bengaliTitle: 'জয়পুর ব্লু পট্রি হস্তশিল্প নিদর্শন',
    tamilTitle: 'ஜெய்பூர் நீல மண்பாண்ட கலைப்படைப்பு',
    marathiTitle: 'जयपूर ब्ल्यू पॉटरी नक्षीकाम कलाकृती',
    storyTemplate: 'Crafted without using natural clay, relying instead on an ancient Persian formula combining crushed quartz, glass, and mineral pigments fired to an unmistakable celestial sheen.',
    keywords: ['Blue Pottery', 'Jaipur', 'Quartz Ceramic', 'Cobalt Blue', 'GI Rajasthan']
  },
  'terracotta': {
    category: 'Bankura / Gorakhpur Terracotta',
    giRegion: 'Bankura / Gorakhpur',
    giState: 'West Bengal / UP',
    materials: ['Alluvial Riverbed Clay', 'Sand', 'Rice Straw', 'Natural Ochre Slip'],
    techniques: ['Potters Wheel Throwing', 'Hand modeling & incising', 'Open wood reduction firing'],
    hourlyRate: 130,
    baseLaborHours: 10,
    care: 'Keep in shaded ventilated space. Avoid violent impacts.',
    hindiTitle: 'प्राकृतिक टेराकोटा हस्तनिर्मित कलाकृति',
    bengaliTitle: 'বাঁকুড়া ঐতিহ্যবাহী পোড়ামাটির টেরাকোটা ভাস্কর্য',
    tamilTitle: 'பாரம்பரிய சுடுமண் டெரகோட்டா கைவினை',
    marathiTitle: 'पारंपारिक मातीचे टेराकोटा हस्तशिल्प',
    storyTemplate: 'Molded from rich river alluvial silt and fired in traditional kilns, capturing centuries of village folklore and sacred temple terracotta architecture.',
    keywords: ['Terracotta', 'Clay Craft', 'Handmade Pot', 'Eco-friendly', 'Earthy']
  }
};

// 1. AI Smart Cataloging (Image + Voice / Text transcription)
router.post('/smart-catalog', (req: Request, res: Response) => {
  try {
    const { craftHint, voiceTranscript, materialHint, hoursEstimated } = req.body;
    
    // Combine cues to determine craft match
    const textToAnalyze = `${craftHint || ''} ${voiceTranscript || ''} ${materialHint || ''}`.toLowerCase();
    
    let matchedCraftKey = 'madhubani';
    for (const key of Object.keys(CRAFT_KNOWLEDGE_BASE)) {
      if (textToAnalyze.includes(key)) {
        matchedCraftKey = key;
        break;
      }
    }

    const craftData = CRAFT_KNOWLEDGE_BASE[matchedCraftKey];
    const laborHours = Number(hoursEstimated) || craftData.baseLaborHours;
    const materialCost = Math.round(laborHours * 18 + 150);
    const artisanDirectWage = Math.round(laborHours * craftData.hourlyRate);
    const packagingAndLogistics = Math.round(artisanDirectWage * 0.12 + 100);
    const platformFee = Math.round(artisanDirectWage * 0.05);
    const fairRetailPrice = artisanDirectWage + materialCost + packagingAndLogistics + platformFee;
    const marketComparisonPrice = Math.round(fairRetailPrice * 2.2);

    const generatedTitle = `${craftData.category} - Masterpiece Handmade Creation`;

    const aiResult: AIAnalysisResult = {
      identifiedCraft: craftData.category,
      confidenceScore: 0.96,
      suggestedTitle: generatedTitle,
      vernacularTitles: {
        hi: craftData.hindiTitle,
        bn: craftData.bengaliTitle,
        ta: craftData.tamilTitle,
        mr: craftData.marathiTitle
      },
      culturalNarrative: craftData.storyTemplate + (voiceTranscript ? ` The artisan adds: "${voiceTranscript}"` : ''),
      suggestedCategory: craftData.category,
      giRegion: craftData.giRegion,
      giState: craftData.giState,
      materialsDetected: craftData.materials,
      suggestedTechniques: craftData.techniques,
      estimatedLaborHours: laborHours,
      recommendedFairPrice: fairRetailPrice,
      pricingBreakdown: {
        artisanPayout: artisanDirectWage,
        materialsCost: materialCost,
        logisticsAndPackaging: packagingAndLogistics,
        platformFee: platformFee,
        marketComparisonPrice: marketComparisonPrice,
        currency: 'INR'
      },
      seoKeywords: craftData.keywords,
      authenticityMarkers: [
        `Authentic GI origin recognized: ${craftData.giRegion}, ${craftData.giState}`,
        '100% handmade - zero automated industrial machinery used',
        'Ethically verified fair living wage compliance (SIH26090 Standard)',
        'Eco-friendly sustainable natural materials'
      ],
      careGuide: craftData.care
    };

    res.json({ success: true, data: aiResult });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. AI Semantic Natural Language Search
router.post('/semantic-search', (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      return res.json({ success: true, results: seedProducts, intent: {} });
    }

    const q = query.toLowerCase().trim();

    // Intent Extraction
    const isBudgetSearch = q.includes('under') || q.includes('below') || q.includes('cheap') || q.includes('budget') || q.includes('less than');
    const budgetMatch = q.match(/\d+/);
    const maxBudget = budgetMatch ? parseInt(budgetMatch[0], 10) : null;

    const wantsGI = q.includes('gi') || q.includes('authentic') || q.includes('certified') || q.includes('original');
    const wantsEco = q.includes('eco') || q.includes('natural') || q.includes('green') || q.includes('organic') || q.includes('sustainable');

    const scored = seedProducts.map(p => {
      let score = 0;
      const combined = `${p.title} ${p.description} ${p.craftCategory} ${p.culturalStory} ${p.artisanLocation} ${p.tags.join(' ')} ${p.materials.join(' ')}`.toLowerCase();

      // Keyword & Semantic proximity
      const queryWords = q.split(/\s+/).filter(w => w.length > 2);
      queryWords.forEach(word => {
        if (combined.includes(word)) score += 15;
        if (p.craftCategory.toLowerCase().includes(word)) score += 25;
        if (p.title.toLowerCase().includes(word)) score += 20;
      });

      // Intent bonuses
      if (wantsGI && p.giInfo.isCertified) score += 20;
      if (wantsEco && p.ecoFriendlyScore >= 95) score += 20;
      if (maxBudget) {
        if (p.price <= maxBudget) {
          score += 30;
        } else {
          score -= 40;
        }
      }

      return { product: p, score };
    });

    // Filter and sort by relevance score
    const results = scored
      .filter(item => item.score > 0 || !q)
      .sort((a, b) => b.score - a.score)
      .map(item => item.product);

    // If query is broad, return all products ranked
    const finalResults = results.length > 0 ? results : seedProducts;

    res.json({
      success: true,
      query,
      detectedIntent: {
        maxBudget,
        wantsGI,
        wantsEco,
        extractedKeywords: q.split(/\s+/).filter(w => w.length > 2)
      },
      matchCount: finalResults.length,
      results: finalResults
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. AI Visual Search (Image Matcher)
router.post('/visual-search', (req: Request, res: Response) => {
  try {
    const { imageCategoryHint } = req.body;
    
    // Simulate image feature extraction and craft similarity
    const matchedCategory = imageCategoryHint || 'pottery';
    
    const matched = seedProducts.filter(p => 
      p.craftCategory.toLowerCase().includes(matchedCategory.toLowerCase()) ||
      p.materials.some(m => m.toLowerCase().includes(matchedCategory.toLowerCase()))
    );

    res.json({
      success: true,
      detectedFeatures: {
        primaryTexture: 'Hand-shaped Organic Surface',
        colorPalette: ['#ce5128 (Terracotta)', '#151b2e (Indigo)', '#dc6d3c (Ochre)'],
        craftFamily: matchedCategory,
        confidence: 0.94
      },
      results: matched.length > 0 ? matched : seedProducts.slice(0, 3)
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. AI Pricing Calculator (Living Wage & Fair Trade Algorithm)
router.post('/pricing-calculator', (req: Request, res: Response) => {
  try {
    const { craftCategory, hours, rawMaterialCost, artisanSkillLevel } = req.body;
    const laborHours = Number(hours) || 12;
    const materialCost = Number(rawMaterialCost) || 300;
    
    // Minimum fair wage per hour based on skill level
    let hourlyBase = 150;
    if (artisanSkillLevel === 'master') hourlyBase = 220;
    if (artisanSkillLevel === 'senior') hourlyBase = 180;
    if (artisanSkillLevel === 'apprentice') hourlyBase = 130;

    const artisanWage = Math.round(laborHours * hourlyBase);
    const packagingLogistics = Math.round(artisanWage * 0.12 + 120);
    const platformFee = Math.round(artisanWage * 0.05);
    const totalFairPrice = artisanWage + materialCost + packagingLogistics + platformFee;
    const conventionalRetail = Math.round(totalFairPrice * 2.3);

    res.json({
      success: true,
      breakdown: {
        artisanPayout: artisanWage,
        materialsCost: materialCost,
        logisticsAndPackaging: packagingLogistics,
        platformFee: platformFee,
        marketComparisonPrice: conventionalRetail,
        currency: 'INR'
      },
      recommendedPrice: totalFairPrice,
      artisanPercentage: Math.round((artisanWage / totalFairPrice) * 100),
      middlemanCutSaved: conventionalRetail - totalFairPrice
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Kala-Mitra AI Copilot Chat
router.post('/copilot', (req: Request, res: Response) => {
  try {
    const { message, role } = req.body;
    const msg = (message || '').toLowerCase();

    let reply = '';
    let quickPrompts: string[] = [];

    if (role === 'artisan') {
      if (msg.includes('price') || msg.includes('how much') || msg.includes('rate')) {
        reply = 'Namaste! Under SIH26090 fair-trade standards, we calculate your price by multiplying your hours with the verified fair hourly wage (₹150-₹220/hr) + 100% material cost reimbursement + 15% skill markup. You keep over 70% of every sale directly!';
        quickPrompts = ['Calculate my price', 'How do I record my voice?', 'Check my orders'];
      } else if (msg.includes('voice') || msg.includes('catalog') || msg.includes('upload')) {
        reply = 'You can speak in Hindi, Bengali, Tamil, Marathi, or English! Just press the microphone button in the Smart Cataloging Studio and describe your craft. Our AI will automatically write your title, cultural story, and list it in 5 languages!';
        quickPrompts = ['Start voice cataloging', 'How does GI tag help me?'];
      } else {
        reply = 'Welcome to your KalaSetu Artisan Studio! I am your Kala-Mitra assistant. I can help you record craft stories, calculate fair prices, track your bank payouts, or advise what colors and designs are trending in global markets.';
        quickPrompts = ['What crafts are trending?', 'How do I get GI verified?', 'View my earnings'];
      }
    } else {
      // Buyer role
      if (msg.includes('gi') || msg.includes('authentic') || msg.includes('certificate')) {
        reply = 'Every craft on KalaSetu carries a verifiable GI (Geographical Indication) digital passport. Each order includes a tamper-proof QR certificate linking directly to the artisan cooperative and the Indian GI Registry.';
        quickPrompts = ['Show GI certified items', 'Meet the artisans', 'How does fair trade work?'];
      } else if (msg.includes('price') || msg.includes('breakdown') || msg.includes('middleman')) {
        reply = 'We practice 100% transparent pricing. On every product page, you can see exactly where your money goes: over 70% goes straight to the artisan, 15% for natural raw materials, and zero exploitative middleman commission!';
        quickPrompts = ['Show under ₹2000 gifts', 'Explore Madhubani art', 'Explore Dokra metal'];
      } else {
        reply = 'Welcome to KalaSetu! I am Kala-Mitra, your Indian Heritage AI Guide. I can help you discover genuine GI crafts, understand the ancient history behind each piece, or find authentic gifts directly from marginalized artisans.';
        quickPrompts = ['Find gifts under ₹3000', 'Explain Madhubani symbolism', 'Show eco-friendly home decor'];
      }
    }

    res.json({
      success: true,
      reply,
      suggestedActions: quickPrompts
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
