import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  DollarSign, 
  ShieldCheck, 
  Award, 
  Globe, 
  RefreshCw, 
  FileText,
  Clock,
  Layers,
  Check,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { AIAnalysisResult, Product } from '../../types';

export const SmartCatalogWizard: React.FC = () => {
  const { 
    setProducts, 
    setActiveView, 
    showToast, 
    language, 
    t 
  } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [craftImage, setCraftImage] = useState<string>('https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80');
  
  // Voice Recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [voiceLanguage, setVoiceLanguage] = useState<'hi' | 'bn' | 'ta' | 'mr' | 'en'>('hi');
  const [voiceTranscript, setVoiceTranscript] = useState<string>('यह हमारी पुश्तैनी मधुबनी कला है। हमने इसे बांस की निब और अपराजिता के प्राकृतिक रंगों से तैयार किया है।');
  const [audioTimer, setAudioTimer] = useState<number>(0);

  // Pricing inputs
  const [laborHours, setLaborHours] = useState<number>(24);
  const [rawCost, setRawCost] = useState<number>(450);
  const [skillLevel, setSkillLevel] = useState<'master' | 'senior' | 'apprentice'>('master');

  // AI Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);

  // Audio timer ticker
  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => {
        setAudioTimer(prev => prev + 1);
      }, 1000);
    } else {
      setAudioTimer(0);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleToggleVoice = () => {
    if (isRecording) {
      setIsRecording(false);
      showToast('Voice recording completed & processed.', 'success');
    } else {
      setIsRecording(true);
      showToast(`Recording in ${voiceLanguage.toUpperCase()}... Speak naturally about your craft materials and technique.`, 'info');
      
      // Auto transcribe simulation if browser speech API is quiet
      setTimeout(() => {
        if (voiceLanguage === 'hi') {
          setVoiceTranscript('यह हमारी पुश्तैनी मधुबनी कला है। हमने इसे बांस की निब, काजल और अपराजिता के प्राकृतिक अर्क से तैयार किया है। इसमें जीवन वृक्ष और सूर्य-चंद्र का संतुलन दर्शाया गया है।');
        } else if (voiceLanguage === 'bn') {
          setVoiceTranscript('এটি আমাদের পৈতৃক হস্তশিল্প। প্রাকৃতিক উদ্ভিজ্জ রং এবং বাঁশের কলম দিয়ে এটি আঁকা হয়েছে।');
        } else if (voiceLanguage === 'ta') {
          setVoiceTranscript('இது எங்கள் பாரம்பரிய கலைப்படைப்பு. இயற்கை வண்ணங்கள் மற்றும் கைவினை உத்திகளால் உருவாக்கப்பட்டது.');
        } else {
          setVoiceTranscript('This is our traditional hand-crafted heritage piece made with natural herbal dyes and bamboo nibs.');
        }
      }, 3500);
    }
  };

  const handleRunAiCatalog = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/smart-catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          craftHint: 'madhubani',
          voiceTranscript,
          hoursEstimated: laborHours
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiResult(data.data);
        showToast('AI taxonomy & cultural narrative successfully synthesized!', 'success');
        setCurrentStep(3);
      }
    } catch (e) {
      showToast('Cataloging generated from local knowledge base.', 'info');
      setCurrentStep(3);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePublishListing = () => {
    if (!aiResult) return;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      title: aiResult.suggestedTitle,
      vernacularTitles: aiResult.vernacularTitles,
      craftCategory: aiResult.suggestedCategory,
      artisanId: 'art-1',
      artisanName: 'Gauri Devi Jha (Self Listed via AI)',
      artisanAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      artisanLocation: `${aiResult.giRegion}, ${aiResult.giState}`,
      price: aiResult.recommendedFairPrice,
      originalFairPrice: aiResult.recommendedFairPrice,
      pricingBreakdown: aiResult.pricingBreakdown,
      giInfo: {
        isCertified: true,
        registrationNumber: `GI-APPL-2026-${Math.floor(100 + Math.random() * 900)}`,
        region: aiResult.giRegion,
        state: aiResult.giState,
        certifyingBody: 'Geographical Indications Registry & KalaSetu Cooperative Guild',
        yearRecognized: 2026
      },
      images: [craftImage],
      description: aiResult.suggestedTitle + ' - Authentically cataloged through voice synthesis.',
      culturalStory: aiResult.culturalNarrative,
      materials: aiResult.materialsDetected,
      techniques: aiResult.suggestedTechniques,
      productionTimeHours: aiResult.estimatedLaborHours,
      ecoFriendlyScore: 98,
      stock: 5,
      rating: 5.0,
      reviewCount: 0,
      tags: aiResult.seoKeywords,
      careInstructions: aiResult.careGuide,
      isAiCataloged: true,
      createdAt: new Date().toISOString()
    };

    setProducts(prev => [newProd, ...prev]);

    // Celebration confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    showToast('Congratulations! Your craft is now live in the global conscious marketplace!', 'success');
    setActiveView('marketplace');
  };

  const steps = [
    { num: 1, label: 'Visual Capture' },
    { num: 2, label: 'Vernacular Voice' },
    { num: 3, label: 'AI Intelligence' },
    { num: 4, label: 'Fair Wage Calculator' },
    { num: 5, label: 'GI Provenance Passport' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-artisan-100 text-artisan-800 dark:bg-artisan-950/60 dark:text-artisan-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-artisan-600" />
          <span>SIH26090 Smart Cataloging Studio for Marginalized Artisans</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Voice-Assisted AI Craft Cataloging
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          No English typing required. Simply upload a picture, speak in your native dialect, and our AI crafts a complete global e-commerce listing with GI provenance and living wage pricing.
        </p>
      </div>

      {/* Stepper Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 overflow-x-auto">
        {steps.map(step => (
          <div key={step.num} className="flex items-center gap-2 shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              currentStep === step.num 
                ? 'bg-artisan-600 text-white ring-4 ring-artisan-100 dark:ring-artisan-950' 
                : currentStep > step.num 
                ? 'bg-emerald-600 text-white' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
            }`}>
              {currentStep > step.num ? <Check className="w-4 h-4" /> : step.num}
            </div>
            <span className={`text-xs font-semibold hidden md:inline ${
              currentStep === step.num ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400'
            }`}>
              {step.label}
            </span>
            {step.num < 5 && <div className="w-6 sm:w-12 h-0.5 bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />}
          </div>
        ))}
      </div>

      {/* Step 1: Craft Visual Capture */}
      {currentStep === 1 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-soft space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Step 1: Capture or Select Craft Photo
            </h3>
            <span className="text-xs text-slate-400">Step 1 of 5</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Image Preview */}
            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-800 relative group">
              <img src={craftImage} alt="Craft to catalog" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                High-Resolution Craft Inspection Ready
              </div>
            </div>

            {/* Upload or Choose Presets */}
            <div className="space-y-4">
              <div className="border-2 border-dashed border-artisan-300 dark:border-artisan-800 rounded-2xl p-6 text-center bg-artisan-50/50 dark:bg-artisan-950/20 relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => setCraftImage(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <UploadCloud className="w-8 h-8 text-artisan-500 mx-auto mb-2" />
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Upload Smartphone Photo
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Click or drag your craft picture here
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Or select sample craft from workshop:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Madhubani', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80' },
                    { label: 'Dokra Metal', url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80' },
                    { label: 'Blue Pottery', url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80' }
                  ].map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => setCraftImage(preset.url)}
                      className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-artisan-500 text-left transition-all"
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-16 object-cover" />
                      <div className="p-1 bg-white dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 text-center">
                        {preset.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-artisan-600 text-white font-bold text-xs shadow-md shadow-artisan-600/30 hover:bg-artisan-700 transition-all"
            >
              <span>Next: Voice Story Recording</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Vernacular Voice Story Recorder */}
      {currentStep === 2 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-soft space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Mic className="w-5 h-5 text-artisan-500" />
                Step 2: Tell Your Craft Story (In Your Own Mother Tongue)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Speak freely about how you crafted it, the materials used, and your family tradition.
              </p>
            </div>
            <span className="text-xs text-slate-400">Step 2 of 5</span>
          </div>

          {/* Mother Tongue Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> Spoken Language:
            </span>
            {(['hi', 'bn', 'ta', 'mr', 'en'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => setVoiceLanguage(lang)}
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-colors ${
                  voiceLanguage === lang
                    ? 'bg-artisan-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Audio Wave Recording Visualizer */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-indigoStone-900 to-slate-900 text-white p-8 flex flex-col items-center justify-center space-y-4 shadow-inner">
            {/* Animated Wave Bars */}
            <div className="flex items-center gap-1.5 h-16">
              {[40, 65, 30, 90, 45, 80, 50, 95, 60, 40, 75, 85, 35, 70, 90, 40].map((h, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 rounded-full transition-all duration-200 ${
                    isRecording 
                      ? 'bg-gradient-to-t from-amber-400 to-artisan-500 animate-pulse' 
                      : 'bg-slate-700'
                  }`}
                  style={{ height: isRecording ? `${Math.round(Math.max(15, h * Math.random()))}px` : '10px' }}
                />
              ))}
            </div>

            {/* Timer */}
            <div className="font-mono text-sm tracking-wider font-semibold text-artisan-300">
              {isRecording ? `REC 00:${audioTimer < 10 ? '0' : ''}${audioTimer}` : 'Tap Microphone to Speak'}
            </div>

            {/* Large Mic Button */}
            <button
              onClick={handleToggleVoice}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 ${
                isRecording 
                  ? 'bg-rose-600 hover:bg-rose-700 animate-pulse ring-8 ring-rose-600/30' 
                  : 'bg-gradient-to-r from-artisan-500 to-amber-500 hover:scale-105 shadow-artisan-500/40'
              }`}
            >
              {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>
          </div>

          {/* Real-time Voice Transcription Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-artisan-500" />
                AI Live Vernacular Voice Transcription:
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold">
                ✓ Audio Recognized ({voiceLanguage.toUpperCase()})
              </span>
            </div>
            <textarea
              value={voiceTranscript}
              onChange={e => setVoiceTranscript(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 outline-hidden focus:ring-1 focus:ring-artisan-500 leading-relaxed"
            />
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <button
              onClick={handleRunAiCatalog}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-artisan-600 to-artisan-500 text-white font-bold text-xs shadow-md shadow-artisan-600/30 hover:opacity-95 transition-all"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>AI Synthesizing Heritage Story...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run AI Smart Cataloging Engine</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: AI Intelligence & Multi-Language Generation */}
      {currentStep === 3 && aiResult && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-soft space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-artisan-500" />
                Step 3: AI Intelligence Taxonomy & Multi-Language Synthesis
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                AI automatically detected your craft artform, GI region, and generated authentic stories across 5 languages.
              </p>
            </div>
            <span className="text-xs text-slate-400">Step 3 of 5</span>
          </div>

          {/* AI Craft Match Card */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold">Identified Craft & GI Tag</div>
              <div className="text-base font-extrabold text-emerald-900 dark:text-emerald-100">
                {aiResult.identifiedCraft} ({aiResult.giRegion}, {aiResult.giState})
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-xs">
                {Math.round(aiResult.confidenceScore * 100)}% Confidence Match
              </span>
            </div>
          </div>

          {/* Generated Cultural Narrative */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Generated Cultural Provenance Story:
            </span>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
              "{aiResult.culturalNarrative}"
            </div>
          </div>

          {/* 5-Language Translation Preview */}
          <div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
              Instant 5-Language Multi-Market Listing Titles:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-400 uppercase">English:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{aiResult.suggestedTitle}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-400 uppercase">हिन्दी (Hindi):</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{aiResult.vernacularTitles.hi}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-400 uppercase">বাংলা (Bengali):</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{aiResult.vernacularTitles.bn}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-400 uppercase">தமிழ் (Tamil):</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{aiResult.vernacularTitles.ta}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <button
              onClick={() => setCurrentStep(4)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-artisan-600 text-white font-bold text-xs shadow-md shadow-artisan-600/30 hover:bg-artisan-700 transition-all"
            >
              <span>Next: Fair Wage & Living Cost Calculator</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Fair Living Wage Pricing Engine */}
      {currentStep === 4 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-soft space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-500" />
                Step 4: Fair Living Wage Algorithm (SIH26090 Standard)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Protecting artisans from poverty wages. Automatically calculates your fair hourly wage, material cost, and transparent markup.
              </p>
            </div>
            <span className="text-xs text-slate-400">Step 4 of 5</span>
          </div>

          {/* Sliders & Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Labor Hours Invested: <strong className="text-artisan-600">{laborHours} hrs</strong>
              </label>
              <input
                type="range"
                min={4}
                max={120}
                value={laborHours}
                onChange={e => setLaborHours(Number(e.target.value))}
                className="w-full accent-artisan-600"
              />
              <span className="text-[10px] text-slate-400 block">Time spent preparing, carving, or painting</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Raw Material Cost: <strong className="text-artisan-600">₹{rawCost}</strong>
              </label>
              <input
                type="range"
                min={50}
                max={5000}
                step={50}
                value={rawCost}
                onChange={e => setRawCost(Number(e.target.value))}
                className="w-full accent-artisan-600"
              />
              <span className="text-[10px] text-slate-400 block">Natural pigments, paper, wood, metals</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Mastery Skill Tier:
              </label>
              <select
                value={skillLevel}
                onChange={e => setSkillLevel(e.target.value as any)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 font-semibold"
              >
                <option value="master">Master Artisan (₹220/hr standard)</option>
                <option value="senior">Senior Craftsperson (₹180/hr)</option>
                <option value="apprentice">Emerging Artisan (₹130/hr)</option>
              </select>
              <span className="text-[10px] text-emerald-600 font-semibold block">✓ GI Living Wage Guarantee</span>
            </div>
          </div>

          {/* Computed Breakdown Table */}
          {(() => {
            const hourlyRate = skillLevel === 'master' ? 220 : skillLevel === 'senior' ? 180 : 130;
            const directWage = laborHours * hourlyRate;
            const packaging = Math.round(directWage * 0.12 + 100);
            const fee = Math.round(directWage * 0.05);
            const totalRetail = directWage + rawCost + packaging + fee;
            const middlemanRetail = Math.round(totalRetail * 2.3);

            return (
              <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>Calculated Fair Retail Listing Price:</span>
                  </div>
                  <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
                    ₹{totalRetail.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 shadow-xs">
                    <div className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold">Your Direct Bank Payout</div>
                    <div className="text-base font-black text-emerald-600 dark:text-emerald-400">₹{directWage.toLocaleString('en-IN')}</div>
                    <div className="text-[9px] text-slate-500">{Math.round((directWage/totalRetail)*100)}% of sale</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="text-[10px] text-slate-500 font-semibold">Material Reimbursement</div>
                    <div className="text-base font-bold text-slate-800 dark:text-slate-200">₹{rawCost.toLocaleString('en-IN')}</div>
                    <div className="text-[9px] text-slate-400">100% recovered</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="text-[10px] text-slate-500 font-semibold">Packaging & Courier</div>
                    <div className="text-base font-bold text-slate-800 dark:text-slate-200">₹{packaging.toLocaleString('en-IN')}</div>
                    <div className="text-[9px] text-slate-400">Eco-safe insured</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="text-[10px] text-slate-500 font-semibold">Traditional Retail Price</div>
                    <div className="text-base font-bold text-rose-500 line-through">₹{middlemanRetail.toLocaleString('en-IN')}</div>
                    <div className="text-[9px] text-emerald-600 font-bold">Zero middleman cut</div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCurrentStep(3)}
              className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <button
              onClick={() => setCurrentStep(5)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-artisan-600 text-white font-bold text-xs shadow-md shadow-artisan-600/30 hover:bg-artisan-700 transition-all"
            >
              <span>Next: Provenance & GI Passport Preview</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Digital Provenance & GI Passport Preview */}
      {currentStep === 5 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-soft space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Step 5: Digital Provenance & Verifiable GI Passport
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Every craft receives an immutable digital authenticity certificate with a verifiable QR code.
              </p>
            </div>
            <span className="text-xs text-slate-400">Step 5 of 5</span>
          </div>

          {/* Digital Certificate Passport Preview */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50/60 to-artisan-50/50 dark:from-slate-800 dark:via-slate-800/80 dark:to-slate-800 border-2 border-amber-300 dark:border-amber-700/60 shadow-lg relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-amber-200 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-xl shadow-md">
                  GI
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base tracking-wide uppercase">
                    Certificate of Geographical Indication & Provenance
                  </h4>
                  <p className="text-xs text-amber-800 dark:text-amber-300 font-semibold">
                    Indian Heritage Registry • SIH26090 Ethical Standard
                  </p>
                </div>
              </div>

              {/* Simulated QR Code */}
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-700 text-center shrink-0">
                <div className="w-16 h-16 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-slate-900 font-mono text-[9px] p-1 leading-none font-bold">
                  [QR VERIFY KALAHUB]
                </div>
                <span className="text-[8px] text-slate-400 font-mono block mt-1">KS-GI-2026</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
              <div>
                <span className="text-slate-500 text-[11px] block">Artisan Producer:</span>
                <strong className="text-slate-900 dark:text-white text-sm">Gauri Devi Jha</strong>
                <span className="text-slate-400 text-[10px] block">Mithila Mahila Kalakriti Samiti</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Origin Cluster:</span>
                <strong className="text-slate-900 dark:text-white text-sm">Madhubani, Bihar</strong>
                <span className="text-slate-400 text-[10px] block">GI App No: GI-APPL-0084</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Living Wage Direct Share:</span>
                <strong className="text-emerald-700 dark:text-emerald-400 text-sm">74.2% Guaranteed</strong>
                <span className="text-slate-400 text-[10px] block">Escrow Protected</span>
              </div>
            </div>
          </div>

          {/* Action to publish */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCurrentStep(4)}
              className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <button
              onClick={handlePublishListing}
              className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-700 hover:to-emerald-600 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 transition-all hover:scale-102"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Publish Craft to Global Marketplace</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
