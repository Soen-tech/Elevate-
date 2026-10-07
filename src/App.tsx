import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Calendar, 
  MapPin, 
  Users, 
  Check, 
  Plus, 
  ChevronRight, 
  Star, 
  Sliders, 
  Download, 
  Sparkles, 
  Menu, 
  X, 
  Heart, 
  ShoppingBag, 
  TrendingUp, 
  Award, 
  ShieldCheck, 
  HelpCircle, 
  Coffee, 
  Car, 
  Plane, 
  Wine, 
  ArrowRight,
  Maximize2,
  Trash2,
  Send,
  PhoneCall,
  Clock,
  Briefcase
} from 'lucide-react';
import { usePWAInstall } from './usePWAInstall';
import { useOnlineStatus } from './useOnlineStatus';
import { EXPERIENCES, Experience, PackageTier } from './data/experiences';

export default function App() {
  // PWA installation & online status hooks
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const isOnline = useOnlineStatus();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // Core navigation state
  const [currentTab, setCurrentTab] = useState<'home' | 'vip' | 'wishlist' | 'basket' | 'requests'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Tennis' | 'Motorsport' | 'Football' | 'Music' | 'Golf' | 'Heritage'>('All');

  // Selected experience for detailed customizer view
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  
  // Customizer state
  const [selectedTier, setSelectedTier] = useState<PackageTier | null>(null);
  const [customGuests, setCustomGuests] = useState<number>(4);
  const [upgrades, setUpgrades] = useState({
    chauffeur: false,
    helicopter: false,
    michelinDining: false,
    security: false,
    branding: false,
  });

  // Saved Wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('elevate_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Basket State (holds customized packages for inquiry)
  const [basket, setBasket] = useState<Array<{
    id: string; // unique item id
    experienceId: string;
    experienceTitle: string;
    experienceLocation: string;
    image: string;
    tier: PackageTier;
    guests: number;
    upgrades: typeof upgrades;
    calculatedTotal: number;
  }>>(() => {
    const saved = localStorage.getItem('elevate_basket');
    return saved ? JSON.parse(saved) : [];
  });

  // Submitted Requests state (simulating real backend response & custom VIP briefing status)
  const [requests, setRequests] = useState<Array<{
    requestId: string;
    date: string;
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    status: 'Awaiting Agent' | 'Proposal Ready' | 'Confirmed';
    items: Array<{
      experienceTitle: string;
      tierName: string;
      guests: number;
      pricePerGuest: number;
      total: number;
      upgradesList: string[];
    }>;
    vipNotes?: string;
    customBudget?: number;
  }>>(() => {
    const saved = localStorage.getItem('elevate_requests');
    if (saved) return JSON.parse(saved);
    
    // Default seed requests for VIP feel
    return [
      {
        requestId: 'ELV-2026-089',
        date: 'Oct 06, 2026',
        companyName: 'Vanguard Partners Europe',
        contactName: 'Jean-Luc Laurent',
        email: 'uxhumekile@gmail.com',
        phone: '+33 1 42 27 78 90',
        status: 'Proposal Ready',
        items: [
          {
            experienceTitle: 'Roland Garros Tournament',
            tierName: 'La Terrasse d’Or',
            guests: 8,
            pricePerGuest: 2100, // custom price with some upgrades
            total: 16800,
            upgradesList: ['Private Chauffeur', 'Pre-Event Michelin Dining'],
          }
        ],
        vipNotes: 'Annual executive retreat for top partners. Looking to align with premium branding in the lounge.',
      }
    ];
  });

  // VIP Portal Interactive Planner State
  const [vipBudget, setCorpBudget] = useState<number>(1500);
  const [vipGuests, setCorpGuests] = useState<number>(20);
  const [vipCategory, setCorpCategory] = useState<'Tennis' | 'Motorsport' | 'Music' | 'Golf' | 'All'>('All');
  const [vipUpgrades, setCorpUpgrades] = useState({
    chauffeur: true,
    helicopter: false,
    concierge: true,
    branding: true,
  });
  const [vipInquirySubmitted, setCorpInquirySubmitted] = useState(false);
  const [companyDetails, setCompanyDetails] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    notes: '',
  });

  // Simple inquiry submission modal / states
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [directInquiryDetails, setDirectInquiryDetails] = useState({
    companyName: '',
    contactName: '',
    email: 'uxhumekile@gmail.com',
    phone: '',
    notes: '',
  });

  // Keep localStorage in sync
  useEffect(() => {
    localStorage.setItem('elevate_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('elevate_basket', JSON.stringify(basket));
  }, [basket]);

  useEffect(() => {
    localStorage.setItem('elevate_requests', JSON.stringify(requests));
  }, [requests]);

  // Calculations for customizer
  const getUpgradeCost = (key: keyof typeof upgrades) => {
    switch (key) {
      case 'chauffeur': return 250;
      case 'helicopter': return 850;
      case 'michelinDining': return 400;
      case 'security': return 300;
      case 'branding': return 150;
      default: return 0;
    }
  };

  const calculateCustomizerTotal = () => {
    if (!selectedTier) return 0;
    let basePrice = selectedTier.price;
    let upgradeTotal = 0;
    (Object.keys(upgrades) as Array<keyof typeof upgrades>).forEach((key) => {
      if (upgrades[key]) {
        upgradeTotal += getUpgradeCost(key);
      }
    });
    return (basePrice + upgradeTotal) * customGuests;
  };

  const handleToggleUpgrade = (key: keyof typeof upgrades) => {
    setUpgrades(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Wishlist handler
  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Add customized package to basket
  const handleAddToBasket = (experience: Experience) => {
    if (!selectedTier) return;
    const newItem = {
      id: `basket-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      experienceId: experience.id,
      experienceTitle: experience.title,
      experienceLocation: experience.location,
      image: experience.image,
      tier: selectedTier,
      guests: customGuests,
      upgrades: { ...upgrades },
      calculatedTotal: calculateCustomizerTotal(),
    };
    setBasket(prev => [...prev, newItem]);
    setCurrentTab('basket');
    setSelectedEventId(null);
    // Reset tailor states
    setUpgrades({
      chauffeur: false,
      helicopter: false,
      michelinDining: false,
      security: false,
      branding: false,
    });
  };

  // Submit direct basket inquiry
  const handleSubmitBasketInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (basket.length === 0) return;

    const newRequest = {
      requestId: `ELV-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      companyName: directInquiryDetails.companyName || 'Private Client',
      contactName: directInquiryDetails.contactName,
      email: directInquiryDetails.email,
      phone: directInquiryDetails.phone,
      status: 'Awaiting Agent' as const,
      items: basket.map(item => {
        const activeUpgrades: string[] = [];
        if (item.upgrades.chauffeur) activeUpgrades.push('Private Chauffeur');
        if (item.upgrades.helicopter) activeUpgrades.push('Helicopter Transfer');
        if (item.upgrades.michelinDining) activeUpgrades.push('Michelin Dining');
        if (item.upgrades.security) activeUpgrades.push('Personal Concierge');
        if (item.upgrades.branding) activeUpgrades.push('Suite VIP Branding');

        return {
          experienceTitle: item.experienceTitle,
          tierName: item.tier.name,
          guests: item.guests,
          pricePerGuest: item.calculatedTotal / item.guests,
          total: item.calculatedTotal,
          upgradesList: activeUpgrades,
        };
      }),
      vipNotes: directInquiryDetails.notes,
    };

    setRequests(prev => [newRequest, ...prev]);
    setBasket([]); // clear basket
    setShowInquiryModal(false);
    setCurrentTab('requests');
  };

  // Submit customized VIP planner proposal
  const handleSubmitVipProposal = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find matching experience based on category and budget limits
    const filtered = EXPERIENCES.filter(exp => {
      if (vipCategory !== 'All' && exp.category !== vipCategory) return false;
      return true;
    });

    const recommendedExperience = filtered.length > 0 ? filtered[0] : EXPERIENCES[0];
    const recommendedTier = recommendedExperience.packages[1] || recommendedExperience.packages[0];

    // Calc custom total based on sliders
    let perGuestPrice = recommendedTier.price;
    const activeUpgrades: string[] = [];
    if (vipUpgrades.chauffeur) { perGuestPrice += 250; activeUpgrades.push('Private Chauffeur'); }
    if (vipUpgrades.helicopter) { perGuestPrice += 850; activeUpgrades.push('Helicopter Transfer'); }
    if (vipUpgrades.concierge) { perGuestPrice += 300; activeUpgrades.push('Personal Concierge'); }
    if (vipUpgrades.branding) { perGuestPrice += 150; activeUpgrades.push('Suite VIP Branding'); }

    const newRequest = {
      requestId: `ELV-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      companyName: companyDetails.companyName,
      contactName: companyDetails.contactName,
      email: companyDetails.email,
      phone: companyDetails.phone,
      status: 'Awaiting Agent' as const,
      items: [
        {
          experienceTitle: `${recommendedExperience.title} (Custom VIP Package)`,
          tierName: recommendedTier.name,
          guests: vipGuests,
          pricePerGuest: perGuestPrice,
          total: perGuestPrice * vipGuests,
          upgradesList: activeUpgrades,
        }
      ],
      vipNotes: `VIP Planner Inquiry. Target Per-Guest Budget: £${vipBudget}. Additional details: ${companyDetails.notes}`,
      customBudget: vipBudget * vipGuests,
    };

    setRequests(prev => [newRequest, ...prev]);
    setCorpInquirySubmitted(true);
    // Auto shift view after brief delay or keep showing success screen
  };

  // Custom filtering algorithm for home events
  const filteredExperiences = EXPERIENCES.filter((exp) => {
    const matchesCategory = selectedCategory === 'All' || exp.category === selectedCategory;
    const matchesSearch = exp.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          exp.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          exp.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          exp.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate statistics for proof adjacency
  const totalSubmissionsVal = requests.reduce((acc, curr) => {
    return acc + curr.items.reduce((sum, item) => sum + item.total, 0);
  }, 0);

  return (
    <div className="min-h-screen flex flex-col relative bg-[#F9F6EE]">
      {/* 15% Mobile Sticky Navigation - TOP BAR CONTRACT (Strict 3 zones) */}
      <header className="sticky top-0 z-40 bg-brand-green text-brand-sand border-b border-brand-gold/20 shadow-lg px-4 md:px-8 py-3.5 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* ZONE 1: Brand title, one line wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => { setCurrentTab('home'); setSelectedEventId(null); }}
              className="text-xl md:text-2xl font-serif tracking-widest text-brand-gold font-bold focus:outline-none flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-full border border-brand-gold flex items-center justify-center font-serif bg-brand-green-light">
                E
              </div>
              <span>E L E V A T E</span>
            </button>
          </div>

          {/* ZONE 2: 4-6 nav links, 1-2 word labels, single-line */}
          <nav className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-widest font-semibold text-brand-sand-dark">
            <button 
              onClick={() => { setCurrentTab('home'); setSelectedEventId(null); }}
              className={`hover:text-brand-gold pb-1 border-b transition-all duration-200 ${currentTab === 'home' && !selectedEventId ? 'text-brand-gold border-brand-gold' : 'border-transparent text-brand-sand-dark'}`}
            >
              Experiences
            </button>
            <button 
              onClick={() => { setCurrentTab('vip'); setSelectedEventId(null); }}
              className={`hover:text-brand-gold pb-1 border-b transition-all duration-200 ${currentTab === 'vip' ? 'text-brand-gold border-brand-gold' : 'border-transparent text-brand-sand-dark'}`}
            >
              VIP Portal
            </button>
            <button 
              onClick={() => { setCurrentTab('wishlist'); setSelectedEventId(null); }}
              className={`hover:text-brand-gold pb-1 border-b transition-all duration-200 flex items-center gap-1 ${currentTab === 'wishlist' ? 'text-brand-gold border-brand-gold' : 'border-transparent text-brand-sand-dark'}`}
            >
              Wishlist {wishlist.length > 0 && <span className="bg-brand-clay text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-mono font-bold">{wishlist.length}</span>}
            </button>
            <button 
              onClick={() => { setCurrentTab('basket'); setSelectedEventId(null); }}
              className={`hover:text-brand-gold pb-1 border-b transition-all duration-200 flex items-center gap-1.5 ${currentTab === 'basket' ? 'text-brand-gold border-brand-gold' : 'border-transparent text-brand-sand-dark'}`}
            >
              Inquiry Basket {basket.length > 0 && <span className="bg-brand-gold text-brand-green rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-mono font-bold">{basket.length}</span>}
            </button>
            <button 
              onClick={() => { setCurrentTab('requests'); setSelectedEventId(null); }}
              className={`hover:text-brand-gold pb-1 border-b transition-all duration-200 flex items-center gap-1.5 ${currentTab === 'requests' ? 'text-brand-gold border-brand-gold' : 'border-transparent text-brand-sand-dark'}`}
            >
              Requests {requests.length > 0 && <span className="bg-[#3b82f6] text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-mono font-bold">{requests.length}</span>}
            </button>
          </nav>

          {/* ZONE 3: 1-2 primary actions */}
          <div className="flex items-center gap-3.5 shrink-0">
            {/* PWA Install Button integrated in header */}
            {!isInstalled && isInstallable && (
              <button
                onClick={install}
                className="hidden sm:flex items-center gap-2 rounded bg-brand-gold hover:bg-brand-gold-light text-brand-green font-semibold tracking-wider uppercase text-[11px] px-3.5 py-2 transition shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install App</span>
              </button>
            )}

            {/* iOS Safari Trigger */}
            {!isInstalled && !isInstallable && isIOS && (
              <button
                onClick={() => setShowIOSGuide(true)}
                className="hidden sm:flex items-center gap-1.5 rounded border border-brand-gold/40 hover:border-brand-gold text-brand-gold text-[11px] tracking-wider uppercase font-semibold px-3.5 py-1.5 transition"
              >
                <span>Add to Home Screen</span>
              </button>
            )}

            <button 
              onClick={() => { setCurrentTab('vip'); setSelectedEventId(null); }}
              className="bg-brand-clay hover:bg-brand-clay-dark text-white font-semibold text-[11px] uppercase tracking-widest px-4 py-2 rounded-sm transition shadow-md whitespace-nowrap"
            >
              VIP Concierge
            </button>

            {/* Mobile burger */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-brand-sand hover:text-brand-gold focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-brand-green border-t border-brand-gold/25 mt-3 py-4 space-y-3.5 animate-fadeIn">
            <div className="flex flex-col gap-2.5 px-2">
              <button 
                onClick={() => { setCurrentTab('home'); setSelectedEventId(null); setMobileMenuOpen(false); }}
                className={`w-full text-left py-2 px-3 text-sm font-semibold uppercase tracking-wider rounded transition-all ${currentTab === 'home' && !selectedEventId ? 'bg-brand-green-light text-brand-gold border-l-2 border-brand-gold' : 'text-brand-sand-dark'}`}
              >
                Hospitality Events
              </button>
              <button 
                onClick={() => { setCurrentTab('vip'); setSelectedEventId(null); setMobileMenuOpen(false); }}
                className={`w-full text-left py-2 px-3 text-sm font-semibold uppercase tracking-wider rounded transition-all ${currentTab === 'vip' ? 'bg-brand-green-light text-brand-gold border-l-2 border-brand-gold' : 'text-brand-sand-dark'}`}
              >
                VIP Portal
              </button>
              <button 
                onClick={() => { setCurrentTab('wishlist'); setSelectedEventId(null); setMobileMenuOpen(false); }}
                className={`w-full text-left py-2 px-3 text-sm font-semibold uppercase tracking-wider rounded transition-all flex justify-between items-center ${currentTab === 'wishlist' ? 'bg-brand-green-light text-brand-gold border-l-2 border-brand-gold' : 'text-brand-sand-dark'}`}
              >
                <span>My Wishlist</span>
                <span className="bg-brand-clay text-white text-xs rounded-full px-2 py-0.5">{wishlist.length}</span>
              </button>
              <button 
                onClick={() => { setCurrentTab('basket'); setSelectedEventId(null); setMobileMenuOpen(false); }}
                className={`w-full text-left py-2 px-3 text-sm font-semibold uppercase tracking-wider rounded transition-all flex justify-between items-center ${currentTab === 'basket' ? 'bg-brand-green-light text-brand-gold border-l-2 border-brand-gold' : 'text-brand-sand-dark'}`}
              >
                <span>Inquiry Basket</span>
                <span className="bg-brand-gold text-brand-green text-xs rounded-full px-2 py-0.5 font-bold">{basket.length}</span>
              </button>
              <button 
                onClick={() => { setCurrentTab('requests'); setSelectedEventId(null); setMobileMenuOpen(false); }}
                className={`w-full text-left py-2 px-3 text-sm font-semibold uppercase tracking-wider rounded transition-all flex justify-between items-center ${currentTab === 'requests' ? 'bg-brand-green-light text-brand-gold border-l-2 border-brand-gold' : 'text-brand-sand-dark'}`}
              >
                <span>Requests Log</span>
                <span className="bg-[#3b82f6] text-white text-xs rounded-full px-2 py-0.5">{requests.length}</span>
              </button>
            </div>
            
            {/* Mobile PWA Prompts */}
            <div className="px-5 pt-2 border-t border-brand-gold/15 flex flex-col gap-2">
              {!isInstalled && isInstallable && (
                <button
                  onClick={() => { install(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 rounded bg-brand-gold text-brand-green font-bold text-xs uppercase py-2.5 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Install Elevate App</span>
                </button>
              )}
              {!isInstalled && !isInstallable && isIOS && (
                <button
                  onClick={() => { setShowIOSGuide(true); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 rounded border border-brand-gold/50 text-brand-gold font-bold text-xs uppercase py-2.5"
                >
                  <span>Install on iOS</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        
        {/* VIEW 1: HOME PAGE (Grid of events & Luxury Hero) */}
        {currentTab === 'home' && !selectedEventId && (
          <div className="animate-fadeIn">
            {/* HERO BANNER - Roland Garros look, elegant and clean layout */}
            <div className="relative bg-brand-green text-brand-sand min-h-[520px] flex flex-col justify-center overflow-hidden">
              <div className="absolute inset-0 z-0">
                <img 
                  src="/assets/images/elevate_hero_1791372544717.jpg" 
                  alt="Luxury Tennis Hospitality Suite"
                  className="w-full h-full object-cover object-center opacity-45 mix-blend-multiply"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-green via-brand-green/70 to-transparent"></div>
              </div>

              <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-6 pt-12 pb-16">
                <p className="text-brand-gold uppercase tracking-[0.3em] text-xs font-semibold md:text-sm">
                  The Pinnacle of VIP Hospitality & Official Access
                </p>
                <h1 className="text-4xl md:text-6xl font-serif text-brand-sand tracking-wide leading-none text-wrap-balance font-bold">
                  ELEVATE EXPERIENCES
                </h1>
                <p className="max-w-2xl mx-auto text-brand-sand-dark text-sm md:text-lg leading-relaxed font-light">
                  Handcrafted access to the world’s most prestigious sporting contests and exclusive arenas. Merging court-side and track-side adrenaline with five-star French gastronomic hospitality.
                </p>

                {/* SEARCH AND FILTER COMBINE BAR (Zero-pill, high usability) */}
                <div className="max-w-3xl mx-auto bg-brand-sand-dark/95 backdrop-blur-md p-2.5 rounded-lg border border-brand-gold/30 shadow-2xl mt-8">
                  <div className="flex flex-col md:flex-row gap-2.5">
                    
                    {/* Search query input */}
                    <div className="flex-grow flex items-center bg-white border border-brand-green/10 rounded px-3 py-2">
                      <Search className="w-4 h-4 text-brand-green/60 mr-2.5 shrink-0" />
                      <input 
                        type="text" 
                        placeholder="Search Grand Slams, Grands Prix, Concerts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent text-sm text-brand-dark focus:outline-none placeholder-brand-green/50"
                      />
                      {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="p-0.5 hover:bg-brand-sand rounded text-brand-clay">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Quick navigation selectors */}
                    <div className="flex gap-2.5 shrink-0">
                      <button 
                        onClick={() => { setCurrentTab('vip'); }}
                        className="flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green-light text-brand-sand px-4 py-2.5 rounded text-xs font-semibold uppercase tracking-wider transition duration-200"
                      >
                        <Sliders className="w-3.5 h-3.5 text-brand-gold" />
                        <span>VIP Planner</span>
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* BRAND VALUE COUNTERS / PROOF ADJACENCY */}
            <div className="bg-brand-green-light text-brand-sand py-7 px-6 border-y border-brand-gold/35">
              <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="space-y-1">
                  <p className="font-serif text-3xl text-brand-gold font-bold">15+</p>
                  <p className="text-[11px] uppercase tracking-wider text-brand-sand-dark font-medium">Years Elite Presence</p>
                </div>
                <div className="space-y-1">
                  <p className="font-serif text-3xl text-brand-gold font-bold">100%</p>
                  <p className="text-[11px] uppercase tracking-wider text-brand-sand-dark font-medium">Official Debenture Access</p>
                </div>
                <div className="space-y-1">
                  <p className="font-serif text-3xl text-brand-gold font-bold">98.4%</p>
                  <p className="text-[11px] uppercase tracking-wider text-brand-sand-dark font-medium">VIP Retainer Rate</p>
                </div>
                <div className="space-y-1">
                  <p className="font-serif text-3xl text-brand-gold font-bold">12k+</p>
                  <p className="text-[11px] uppercase tracking-wider text-brand-sand-dark font-medium">Bespoke Guest Experiences</p>
                </div>
              </div>
            </div>

            {/* CATEGORY SELECTOR BUTTONS (Segmented filter control - NOT static pills) */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-brand-green/10">
                <div>
                  <h2 className="text-2xl md:text-3xl font-serif text-brand-green font-bold">Bespoke Hospitality Catalog</h2>
                  <p className="text-xs text-brand-green/60 uppercase tracking-widest mt-0.5">Filter exclusive reservations by tournament or event type</p>
                </div>

                <div className="flex flex-wrap gap-1.5 p-1 bg-brand-sand-dark rounded-md border border-brand-green/5">
                  {(['All', 'Tennis', 'Motorsport', 'Football', 'Music', 'Golf'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 text-xs font-semibold tracking-wider uppercase rounded transition ${selectedCategory === cat ? 'bg-brand-green text-brand-sand shadow-sm' : 'text-brand-green/70 hover:text-brand-green hover:bg-brand-sand-dark'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* EXPERIENCES GRID (Masonry feel, highly editorial, zero badge clutter) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                {filteredExperiences.map((experience) => {
                  const isSaved = wishlist.includes(experience.id);
                  return (
                    <div 
                      key={experience.id}
                      onClick={() => {
                        setSelectedEventId(experience.id);
                        // Default to mid tier package for interactive view
                        setSelectedTier(experience.packages[1] || experience.packages[0]);
                      }}
                      className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl border border-brand-green/15 transition-all duration-300 flex flex-col h-full"
                    >
                      {/* Image Frame with hover expansion */}
                      <div className="relative h-72 overflow-hidden bg-brand-green-light shrink-0">
                        <img 
                          src={experience.image} 
                          alt={experience.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-brand-dark/25 to-transparent opacity-85"></div>
                        
                        {/* Static Metadata: Category (Clean inline label - NO capsule pill) */}
                        <div className="absolute top-4 left-4 text-xs font-bold tracking-widest uppercase text-brand-sand-dark drop-shadow">
                          {experience.category} HOSPITALITY
                        </div>

                        {/* Wishlist Button */}
                        <button
                          onClick={(e) => toggleWishlist(experience.id, e)}
                          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-brand-green hover:text-brand-clay shadow-sm transition-all"
                          aria-label="Add to wishlist"
                        >
                          <Heart className={`w-4 h-4 ${isSaved ? 'fill-brand-clay text-brand-clay' : ''}`} />
                        </button>

                        <div className="absolute bottom-4 left-4 right-4 text-brand-sand">
                          <p className="text-brand-gold font-serif italic text-sm">{experience.tagline}</p>
                          <h3 className="text-xl md:text-2xl font-serif tracking-wide text-white mt-1 font-semibold">{experience.title}</h3>
                        </div>
                      </div>

                      {/* Content Box */}
                      <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5 text-xs text-brand-green/75 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-brand-clay shrink-0" />
                            <span>{experience.venue}, {experience.location}</span>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-brand-green/75 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-brand-clay shrink-0" />
                            <span>{experience.dates}</span>
                          </div>

                          <p className="text-brand-dark/85 text-xs md:text-sm leading-relaxed pt-2">
                            {experience.shortDescription}
                          </p>
                        </div>

                        {/* Highlighted benefit in a subtle box matching brand-green border */}
                        <div className="bg-[#ECE5D3]/50 border-l-2 border-brand-gold p-3 rounded-sm text-xs text-brand-green font-medium leading-relaxed">
                          <span className="text-brand-clay uppercase tracking-wider text-[10px] font-bold block mb-0.5">EXCLUSIVE INCLUSION</span>
                          {experience.highlightBenefit}
                        </div>

                        {/* Price footer bar with action */}
                        <div className="flex items-center justify-between pt-4 border-t border-brand-green/10">
                          <div>
                            <span className="text-[10px] text-brand-green/60 block uppercase tracking-wider">OFFICIAL PACKAGES</span>
                            <span className="font-serif text-lg font-bold text-brand-green">
                              from <span className="font-mono text-xl text-brand-clay font-semibold">£{Math.min(...experience.packages.map(p => p.price))}</span> <span className="text-xs text-brand-green/70 font-sans">/ guest</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-xs font-semibold text-brand-clay group-hover:text-brand-clay-dark transition">
                            <span>Tailor Packages</span>
                            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })}

                {filteredExperiences.length === 0 && (
                  <div className="col-span-2 text-center py-16 bg-white rounded-lg border border-brand-green/10">
                    <p className="text-lg font-serif text-brand-green">No experiences match your luxury search filters.</p>
                    <button 
                      onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                      className="mt-4 bg-brand-green hover:bg-brand-green-light text-brand-sand px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition"
                    >
                      Reset Catalog Search
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* TRUST, HERITAGE & FRENCH HOSPITALITY STANDARDS */}
            <section className="bg-brand-green text-brand-sand py-16 px-6 mt-16 border-t border-brand-gold/25">
              <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="inline-block text-xs uppercase tracking-[0.2em] text-brand-gold font-bold">The Heritage of Service</div>
                  <h2 className="text-3xl md:text-4xl font-serif text-brand-sand font-bold tracking-wide">
                    Art de Vivre & Grand Slam Standards
                  </h2>
                  <p className="text-brand-sand-dark text-sm leading-relaxed font-light">
                    Inspired by the supreme luxury of Paris Roland Garros tennis hospitality, Elevate Experiences crafts curated social and networking spaces for VIP leadership. We do not sell plain general tickets; we author complete multi-sensory experiences from customized catering to legendary player meetings.
                  </p>

                  <div className="space-y-4 pt-2">
                    <div className="flex gap-3">
                      <div className="p-1 rounded bg-brand-green-light border border-brand-gold/20 shrink-0 h-7 w-7 flex items-center justify-center">
                        <Award className="w-4 h-4 text-brand-gold" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold tracking-wide text-brand-sand">Authorized Debentures Only</h4>
                        <p className="text-xs text-brand-sand-dark font-light mt-0.5">Every seat we provide belongs to official VIP or debenture allotments with verified ground access.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="p-1 rounded bg-brand-green-light border border-brand-gold/20 shrink-0 h-7 w-7 flex items-center justify-center">
                        <Wine className="w-4 h-4 text-brand-gold" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold tracking-wide text-brand-sand">Michelin Gastronomy Partner</h4>
                        <p className="text-xs text-brand-sand-dark font-light mt-0.5">Our menus are conceptualized and run by Michelin-Starred chefs using seasonal French & regional ingredients.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Testimonial Panel */}
                <div className="bg-brand-green-light border border-brand-gold/30 p-8 rounded-lg relative space-y-6">
                  <span className="text-6xl text-brand-gold/20 font-serif absolute -top-4 left-4 select-none">“</span>
                  <p className="text-brand-sand-dark text-sm md:text-base italic leading-relaxed pt-4 font-light">
                    The standard is truly matchless. Our VIP clients from Asia and America were treated to an afternoon of sheer excellence in Paris. The combination of Michelin-starred dining, vintage champagne, and perfect box seat views of Philippe-Chatrier court was spectacular.
                  </p>
                  
                  {/* Attributable Testimonial - WCAG AA check */}
                  <div className="pt-4 border-t border-brand-gold/15 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#ECE5D3] flex items-center justify-center text-brand-green font-serif text-sm font-bold">
                      LL
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-brand-sand">Jean-Luc Laurent</p>
                      <p className="text-[10px] text-brand-gold uppercase tracking-widest font-medium">Head of Partner Relations, Vanguard Europe</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}


        {/* VIEW 2: EXPERIENCE DETAIL & TACTILE CONCISE CUSTOMIZER */}
        {selectedEventId && (
          (() => {
            const exp = EXPERIENCES.find(e => e.id === selectedEventId);
            if (!exp) return <p className="text-center py-10 font-serif text-brand-green">Experience not found.</p>;
            const isSaved = wishlist.includes(exp.id);

            return (
              <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-fadeIn">
                
                {/* Back button */}
                <button 
                  onClick={() => setSelectedEventId(null)}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-green hover:text-brand-clay pb-6 transition"
                >
                  <span>← Back to Luxury Catalog</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Left Column: Visuals & Description (7 cols) */}
                  <div className="lg:col-span-7 space-y-6">
                    
                    {/* Event Banner */}
                    <div className="relative h-96 rounded-lg overflow-hidden border border-brand-green/10">
                      <img 
                        src={exp.image} 
                        alt={exp.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/20 to-transparent"></div>
                      <div className="absolute top-4 left-4 text-xs font-bold tracking-widest uppercase text-brand-sand bg-brand-green/80 px-2.5 py-1 rounded-sm">
                        {exp.category}
                      </div>

                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => toggleWishlist(exp.id, e)}
                        className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 hover:bg-white text-brand-green hover:text-brand-clay shadow-md transition-all"
                      >
                        <Heart className={`w-4 h-4 ${isSaved ? 'fill-brand-clay text-brand-clay' : ''}`} />
                      </button>

                      <div className="absolute bottom-6 left-6 right-6 text-brand-sand">
                        <p className="text-brand-gold font-serif italic text-sm md:text-base mb-1">{exp.tagline}</p>
                        <h1 className="text-3xl md:text-4xl font-serif text-white tracking-wide font-bold">{exp.title}</h1>
                      </div>
                    </div>

                    {/* Description and metadata */}
                    <div className="bg-white p-6 md:p-8 rounded-lg border border-brand-green/10 space-y-4">
                      <div className="grid grid-cols-2 gap-4 pb-4 border-b border-brand-green/10 text-xs md:text-sm font-medium text-brand-green">
                        <div className="space-y-1">
                          <span className="text-[10px] text-brand-green/60 uppercase block font-semibold">VENUE & CITY</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-brand-clay" />
                            {exp.venue}, {exp.location}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-brand-green/60 uppercase block font-semibold">EVENT TIMEFRAME</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-brand-clay" />
                            {exp.dates}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        <h3 className="text-lg font-serif text-brand-green font-bold">The Luxury Overview</h3>
                        <p className="text-brand-dark/85 text-sm leading-relaxed font-light">
                          {exp.description}
                        </p>
                      </div>

                      {/* Seat Map Placeholder / Mock visual */}
                      <div className="bg-brand-sand-dark border border-brand-green/10 rounded p-4 text-center mt-6">
                        <span className="text-[10px] text-brand-green/60 uppercase font-bold tracking-widest block mb-2">INTEGRATED HOSPITALITY MAP</span>
                        <div className="h-28 bg-[#ECE5D3] rounded flex items-center justify-center border-dashed border border-brand-green/20">
                          <div className="text-center space-y-1 p-2">
                            <p className="text-xs font-semibold text-brand-green">Guaranteed Court/Trackside Loges (Boxes)</p>
                            <p className="text-[10px] text-brand-green/70 font-light">Debenture Seat Allotment: Sector Central 102 & President Corridor</p>
                          </div>
                        </div>
                        <p className="text-[10px] text-brand-green/60 mt-2 italic font-light">Interactive virtual seat-preview is pre-assigned according to tier level selection.</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Interactive Tailor Customizer (5 cols) */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white p-6 md:p-8 rounded-lg border border-brand-green/15 shadow-lg space-y-6">
                      
                      <div>
                        <h2 className="text-xl md:text-2xl font-serif text-brand-green font-bold">Tailor Your Package</h2>
                        <p className="text-xs text-brand-green/60 uppercase tracking-widest mt-0.5">Customize options and calculate live budget</p>
                      </div>

                      {/* Tier selection (Buttons) */}
                      <div className="space-y-2.5">
                        <label className="text-xs uppercase tracking-wider font-semibold text-brand-green">1. Select Hospitality Tier</label>
                        <div className="space-y-2">
                          {exp.packages.map((tier) => (
                            <button
                              key={tier.name}
                              type="button"
                              onClick={() => setSelectedTier(tier)}
                              className={`w-full text-left p-3.5 rounded border transition-all ${selectedTier?.name === tier.name ? 'bg-brand-green/5 border-brand-gold ring-1 ring-brand-gold' : 'bg-brand-sand-dark hover:bg-brand-sand border-brand-green/10'}`}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-serif text-sm font-bold text-brand-green">{tier.name}</span>
                                {tier.badge && <span className="bg-brand-clay text-white text-[9px] uppercase font-bold px-1.5 py-0.5 rounded">{tier.badge}</span>}
                              </div>
                              <p className="text-[11px] text-brand-green/60 mt-1 font-light italic leading-normal">{tier.description}</p>
                              <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-brand-green/5">
                                <span className="text-[10px] text-brand-green/60 uppercase tracking-wider">BASE TARIFF</span>
                                <span className="font-mono text-sm text-brand-clay font-bold">£{tier.price} <span className="text-[10px] font-sans text-brand-green/70">/ guest</span></span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Guest Count Slider */}
                      <div className="space-y-2 pt-2">
                        <div className="flex justify-between items-center text-xs uppercase tracking-wider font-semibold text-brand-green">
                          <label>2. Number of Guests</label>
                          <span className="font-mono text-brand-clay font-bold">{customGuests} Guests</span>
                        </div>
                        <input 
                          type="range" 
                          min="1" 
                          max="50" 
                          value={customGuests}
                          onChange={(e) => setCustomGuests(parseInt(e.target.value))}
                          className="w-full accent-brand-clay"
                        />
                        <div className="flex justify-between text-[10px] text-brand-green/50">
                          <span>1 Guest</span>
                          <span>20 Guests</span>
                          <span>50 Guests</span>
                        </div>
                      </div>

                      {/* Custom Upgrades (Toggles with prices) */}
                      <div className="space-y-2.5 pt-2 border-t border-brand-green/10">
                        <label className="text-xs uppercase tracking-wider font-semibold text-brand-green block">3. Premium Additions & Upgrades</label>
                        
                        <div className="space-y-2">
                          <button
                            type="button"
                            onClick={() => handleToggleUpgrade('chauffeur')}
                            className={`w-full flex items-center justify-between p-2.5 rounded border text-left transition ${upgrades.chauffeur ? 'bg-brand-green/5 border-brand-gold' : 'bg-transparent border-brand-green/10 hover:bg-brand-sand-dark'}`}
                          >
                            <div className="flex items-center gap-2.5">
                              <Car className="w-4 h-4 text-brand-clay shrink-0" />
                              <div>
                                <span className="text-xs font-semibold text-brand-green block">Private Chauffeur Service</span>
                                <span className="text-[10px] text-brand-green/60">Mercedes S-Class luxury airport/venue transfers</span>
                              </div>
                            </div>
                            <span className="font-mono text-xs font-bold text-brand-green/80 shrink-0">+£250</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleUpgrade('helicopter')}
                            className={`w-full flex items-center justify-between p-2.5 rounded border text-left transition ${upgrades.helicopter ? 'bg-brand-green/5 border-brand-gold' : 'bg-transparent border-brand-green/10 hover:bg-brand-sand-dark'}`}
                          >
                            <div className="flex items-center gap-2.5">
                              <Plane className="w-4 h-4 text-brand-clay shrink-0" />
                              <div>
                                <span className="text-xs font-semibold text-brand-green block">Helicopter Transit</span>
                                <span className="text-[10px] text-brand-green/60">Direct heli-port dropoff (Monaco/Paris/London)</span>
                              </div>
                            </div>
                            <span className="font-mono text-xs font-bold text-brand-green/80 shrink-0">+£850</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleUpgrade('michelinDining')}
                            className={`w-full flex items-center justify-between p-2.5 rounded border text-left transition ${upgrades.michelinDining ? 'bg-brand-green/5 border-brand-gold' : 'bg-transparent border-brand-green/10 hover:bg-brand-sand-dark'}`}
                          >
                            <div className="flex items-center gap-2.5">
                              <Wine className="w-4 h-4 text-brand-clay shrink-0" />
                              <div>
                                <span className="text-xs font-semibold text-brand-green block">Pre-Event Michelin Dining</span>
                                <span className="text-[10px] text-brand-green/60">Exclusive tasting menu with wine pairings</span>
                              </div>
                            </div>
                            <span className="font-mono text-xs font-bold text-brand-green/80 shrink-0">+£400</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleUpgrade('security')}
                            className={`w-full flex items-center justify-between p-2.5 rounded border text-left transition ${upgrades.security ? 'bg-brand-green/5 border-brand-gold' : 'bg-transparent border-brand-green/10 hover:bg-brand-sand-dark'}`}
                          >
                            <div className="flex items-center gap-2.5">
                              <ShieldCheck className="w-4 h-4 text-brand-clay shrink-0" />
                              <div>
                                <span className="text-xs font-semibold text-brand-green block">Personal VIP Concierge</span>
                                <span className="text-[10px] text-brand-green/60">On-site host, hostesses, and personal security</span>
                              </div>
                            </div>
                            <span className="font-mono text-xs font-bold text-brand-green/80 shrink-0">+£300</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleUpgrade('branding')}
                            className={`w-full flex items-center justify-between p-2.5 rounded border text-left transition ${upgrades.branding ? 'bg-brand-green/5 border-brand-gold' : 'bg-transparent border-brand-green/10 hover:bg-brand-sand-dark'}`}
                          >
                            <div className="flex items-center gap-2.5">
                              <Briefcase className="w-4 h-4 text-brand-clay shrink-0" />
                              <div>
                                <span className="text-xs font-semibold text-brand-green block">Suite VIP Branding</span>
                                <span className="text-[10px] text-brand-green/60">Custom VIP signage, logos, and color palettes</span>
                              </div>
                            </div>
                            <span className="font-mono text-xs font-bold text-brand-green/80 shrink-0">+£150</span>
                          </button>
                        </div>
                      </div>

                      {/* Real-Time Live Quote Breakdown */}
                      <div className="bg-brand-sand-dark p-4 rounded border border-brand-green/10 space-y-2.5 pt-4">
                        <span className="text-[10px] text-brand-green/60 uppercase tracking-widest font-bold block">LIVE COST CALCULATOR</span>
                        
                        <div className="space-y-1.5 text-xs text-brand-green/85">
                          <div className="flex justify-between font-medium">
                            <span>Base {selectedTier?.name} Ticket:</span>
                            <span className="font-mono text-brand-dark">£{selectedTier?.price} × {customGuests} guests</span>
                          </div>

                          {Object.keys(upgrades).map((key) => {
                            if (upgrades[key as keyof typeof upgrades]) {
                              const label = key === 'chauffeur' ? 'Private Chauffeur' : key === 'helicopter' ? 'Helicopter' : key === 'michelinDining' ? 'Michelin Dining' : key === 'security' ? 'Personal Concierge' : 'Suite Branding';
                              return (
                                <div key={key} className="flex justify-between pl-3 border-l border-brand-gold/30 text-[11px]">
                                  <span>+ {label}:</span>
                                  <span className="font-mono">£{getUpgradeCost(key as keyof typeof upgrades)} × {customGuests}</span>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>

                        <div className="border-t border-brand-green/10 pt-3 flex justify-between items-end">
                          <span className="text-xs font-semibold uppercase text-brand-green tracking-wider">Estimated Total Value:</span>
                          <span className="font-serif text-2xl font-bold text-brand-clay">
                            <span className="text-xs font-sans text-brand-green/60 font-medium align-middle mr-1">GBP</span>
                            £{calculateCustomizerTotal().toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Add Customizer to Inquiry Basket Button */}
                      <button
                        onClick={() => handleAddToBasket(exp)}
                        disabled={!selectedTier}
                        className="w-full bg-brand-green hover:bg-brand-green-light disabled:bg-gray-400 text-brand-sand font-bold text-xs uppercase tracking-widest py-3.5 rounded-sm shadow-md transition duration-200 flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4 text-brand-gold" />
                        <span>Add customized package to basket</span>
                      </button>

                    </div>
                  </div>

                </div>

              </div>
            );
          })()
        )}


        {/* VIEW 3: CORPORATE PORTAL & INTERACTIVE PROPOSAL PLANNER */}
        {currentTab === 'vip' && (
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Side: Explanatory Content (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-3">
                  <span className="text-xs uppercase tracking-[0.2em] text-brand-clay font-bold block">Enterprise Services</span>
                  <h1 className="text-3xl md:text-4xl font-serif text-brand-green font-bold tracking-wide">
                    The VIP Entertainment Architect
                  </h1>
                  <p className="text-brand-dark/85 text-sm leading-relaxed font-light">
                    Elevate Experiences specializes in tailored client networking packages and bespoke annual VIP event planning. Use our tactical design portal on the right to align event tiers with your aggregate headcount and per-guest targets.
                  </p>
                </div>

                {/* Proof Adjacency section */}
                <div className="bg-[#ECE5D3]/40 border-l-4 border-brand-gold p-5 space-y-4 rounded-r-lg">
                  <div className="flex gap-3">
                    <TrendingUp className="w-5 h-5 text-brand-clay shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-brand-green">98.4% Retention</h4>
                      <p className="text-xs text-brand-green/75 mt-0.5">Top-tier financial firms and tech conglomerates rely on our annual debenture suite assignments year after year.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Award className="w-5 h-5 text-brand-clay shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-brand-green">Full Brand Alignment</h4>
                      <p className="text-xs text-brand-green/75 mt-0.5">We customize physical hospitality suites with VIP coloring, logos, high-end signage, and tailored presentation collateral.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-brand-green text-brand-sand p-6 rounded-lg border border-brand-gold/25 space-y-4">
                  <h4 className="font-serif text-lg text-brand-gold font-bold">Have an offline request?</h4>
                  <p className="text-xs text-brand-sand-dark font-light leading-relaxed">
                    Our dedicated VIP concierge agents are standing by to draw custom seat maps and organize helicopter or private charter flights globally.
                  </p>
                  <div className="flex gap-4 text-xs font-semibold tracking-wider uppercase pt-2">
                    <span className="flex items-center gap-1.5"><PhoneCall className="w-4 h-4 text-brand-gold" /> +44 20 7946 0192</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-brand-gold" /> 24/7 Priority</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Interactive Budget & Headcount Planner Form (7 cols) */}
              <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-lg border border-brand-green/15 shadow-xl">
                {vipInquirySubmitted ? (
                  <div className="text-center py-12 space-y-6">
                    <div className="w-16 h-16 bg-brand-green/10 text-brand-gold rounded-full flex items-center justify-center mx-auto">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-serif text-brand-green font-bold">Inquiry Proposal Dispatched</h3>
                      <p className="text-sm text-brand-dark/75 max-w-md mx-auto">
                        Your custom VIP briefing has been successfully compiled. A senior Elevate accounts representative has been assigned to analyze matching debenture seats and draft a customized pitch.
                      </p>
                    </div>
                    <div className="bg-brand-sand-dark p-4 rounded border border-brand-green/10 text-xs text-brand-green max-w-sm mx-auto font-mono">
                      <span>Assigned Agent: Antoine de Saint-Exupéry</span><br />
                      <span>Tracking ID: ELV-2026-CORP</span><br />
                      <span>Status: Preparing Seat Deck</span>
                    </div>
                    <div className="flex justify-center gap-4 pt-4">
                      <button 
                        onClick={() => { setCorpInquirySubmitted(false); }}
                        className="border border-brand-green/30 hover:border-brand-green px-4 py-2 rounded text-xs font-bold uppercase tracking-wider text-brand-green transition"
                      >
                        Plan Another Event
                      </button>
                      <button 
                        onClick={() => { setCurrentTab('requests'); }}
                        className="bg-brand-green hover:bg-brand-green-light text-brand-sand px-5 py-2 rounded text-xs font-bold uppercase tracking-wider transition"
                      >
                        View Requests Log
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitVipProposal} className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-serif text-brand-green font-bold">Interactive Brief Generator</h2>
                      <p className="text-xs text-brand-green/60 uppercase tracking-widest mt-0.5">Define aggregate constraints below to find recommended matches</p>
                    </div>

                    {/* Target Budget Per Guest Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs uppercase tracking-wider font-semibold text-brand-green">
                        <label>Target Budget Per Guest</label>
                        <span className="font-mono text-brand-clay font-bold">£{vipBudget} / guest</span>
                      </div>
                      <input 
                        type="range" 
                        min="500" 
                        max="5000" 
                        step="100"
                        value={vipBudget}
                        onChange={(e) => setCorpBudget(parseInt(e.target.value))}
                        className="w-full accent-brand-clay"
                      />
                      <div className="flex justify-between text-[10px] text-brand-green/50">
                        <span>£500 Min</span>
                        <span>£2,500 Avg</span>
                        <span>£5,000 Max</span>
                      </div>
                    </div>

                    {/* Estimated Headcount Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs uppercase tracking-wider font-semibold text-brand-green">
                        <label>Estimated Headcount (Delegation size)</label>
                        <span className="font-mono text-brand-clay font-bold">{vipGuests} Guests</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="300" 
                        step="5"
                        value={vipGuests}
                        onChange={(e) => setCorpGuests(parseInt(e.target.value))}
                        className="w-full accent-brand-clay"
                      />
                      <div className="flex justify-between text-[10px] text-brand-green/50">
                        <span>10 Guests</span>
                        <span>150 Guests</span>
                        <span>300 Guests</span>
                      </div>
                    </div>

                    {/* Category Selection Dropdown */}
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider font-semibold text-brand-green block">Event Category Focus</label>
                      <select 
                        value={vipCategory} 
                        onChange={(e) => setCorpCategory(e.target.value as any)}
                        className="w-full bg-brand-sand-dark border border-brand-green/10 rounded px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold text-brand-green font-medium"
                      >
                        <option value="All">All Exclusive Events</option>
                        <option value="Tennis">Tennis Championships (Wimbledon/Roland Garros)</option>
                        <option value="Motorsport">Grand Prix Racing (Monaco/Silverstone)</option>
                        <option value="Music">Stadium Concert Series (VIP Boxes)</option>
                        <option value="Golf">Golf Tournaments (The Masters/The Open)</option>
                      </select>
                    </div>

                    {/* Core Upgrade checklist */}
                    <div className="space-y-2.5">
                      <label className="text-xs uppercase tracking-wider font-semibold text-brand-green block">Premium Logistics Requested</label>
                      <div className="grid grid-cols-2 gap-3 text-xs text-brand-green">
                        <button
                          type="button"
                          onClick={() => setCorpUpgrades(prev => ({...prev, chauffeur: !prev.chauffeur}))}
                          className={`flex items-center gap-2 p-2 rounded border text-left transition ${vipUpgrades.chauffeur ? 'bg-brand-green/5 border-brand-gold font-semibold' : 'bg-transparent border-brand-green/10 hover:bg-brand-sand-dark'}`}
                        >
                          <Check className={`w-4 h-4 text-brand-gold shrink-0 ${vipUpgrades.chauffeur ? 'opacity-100' : 'opacity-20'}`} />
                          <span>Chauffeur Transfers</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCorpUpgrades(prev => ({...prev, helicopter: !prev.helicopter}))}
                          className={`flex items-center gap-2 p-2 rounded border text-left transition ${vipUpgrades.helicopter ? 'bg-brand-green/5 border-brand-gold font-semibold' : 'bg-transparent border-brand-green/10 hover:bg-brand-sand-dark'}`}
                        >
                          <Check className={`w-4 h-4 text-brand-gold shrink-0 ${vipUpgrades.helicopter ? 'opacity-100' : 'opacity-20'}`} />
                          <span>Heli-Port Drops</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCorpUpgrades(prev => ({...prev, concierge: !prev.concierge}))}
                          className={`flex items-center gap-2 p-2 rounded border text-left transition ${vipUpgrades.concierge ? 'bg-brand-green/5 border-brand-gold font-semibold' : 'bg-transparent border-brand-green/10 hover:bg-brand-sand-dark'}`}
                        >
                          <Check className={`w-4 h-4 text-brand-gold shrink-0 ${vipUpgrades.concierge ? 'opacity-100' : 'opacity-20'}`} />
                          <span>On-Site VIP Concierge</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCorpUpgrades(prev => ({...prev, branding: !prev.branding}))}
                          className={`flex items-center gap-2 p-2 rounded border text-left transition ${vipUpgrades.branding ? 'bg-brand-green/5 border-brand-gold font-semibold' : 'bg-transparent border-brand-green/10 hover:bg-brand-sand-dark'}`}
                        >
                          <Check className={`w-4 h-4 text-brand-gold shrink-0 ${vipUpgrades.branding ? 'opacity-100' : 'opacity-20'}`} />
                          <span>Custom VIP Branding</span>
                        </button>
                      </div>
                    </div>

                    {/* Company Details (Inputs) */}
                    <div className="space-y-3 pt-3 border-t border-brand-green/10">
                      <label className="text-xs uppercase tracking-wider font-semibold text-brand-green block">Company & Contact Details</label>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">VIP Entity</span>
                          <input 
                            type="text" 
                            required
                            placeholder="e.g. LVMH / McKinsey & Company" 
                            value={companyDetails.companyName}
                            onChange={(e) => setCompanyDetails({...companyDetails, companyName: e.target.value})}
                            className="w-full bg-brand-sand-dark border border-brand-green/10 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-gold text-brand-dark"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">Contact Representative</span>
                          <input 
                            type="text" 
                            required
                            placeholder="e.g. Jean-Luc Laurent" 
                            value={companyDetails.contactName}
                            onChange={(e) => setCompanyDetails({...companyDetails, contactName: e.target.value})}
                            className="w-full bg-brand-sand-dark border border-brand-green/10 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-gold text-brand-dark"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">Contact Email</span>
                          <input 
                            type="email" 
                            required
                            placeholder="uxhumekile@gmail.com" 
                            value={companyDetails.email}
                            onChange={(e) => setCompanyDetails({...companyDetails, email: e.target.value})}
                            className="w-full bg-brand-sand-dark border border-brand-green/10 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-gold text-brand-dark"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">Direct Telephone</span>
                          <input 
                            type="tel" 
                            placeholder="e.g. +33 1 42 27 78" 
                            value={companyDetails.phone}
                            onChange={(e) => setCompanyDetails({...companyDetails, phone: e.target.value})}
                            className="w-full bg-brand-sand-dark border border-brand-green/10 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-gold text-brand-dark"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">Custom Directives / Note to Concierge</span>
                        <textarea 
                          rows={3}
                          placeholder="Please mention specific court preference (e.g. Chatrier Loge 104) or details about dietary requirements, custom branding graphics or luxury transport."
                          value={companyDetails.notes}
                          onChange={(e) => setCompanyDetails({...companyDetails, notes: e.target.value})}
                          className="w-full bg-brand-sand-dark border border-brand-green/10 rounded p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-gold text-brand-dark resize-none"
                        />
                      </div>
                    </div>

                    {/* Submit Brief Button */}
                    <button
                      type="submit"
                      className="w-full bg-brand-green hover:bg-brand-green-light text-brand-sand font-bold text-xs uppercase tracking-widest py-3.5 rounded-sm shadow-md transition duration-200 flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4 text-brand-gold" />
                      <span>Submit Customized Event Brief</span>
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>
        )}


        {/* VIEW 4: WISHLIST VIEW */}
        {currentTab === 'wishlist' && (
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-fadeIn">
            <div className="space-y-3 pb-6 border-b border-brand-green/10 mb-8">
              <h1 className="text-3xl md:text-4xl font-serif text-brand-green font-bold tracking-wide">
                Your Saved VIP Wishlist
              </h1>
              <p className="text-xs text-brand-green/60 uppercase tracking-widest">Review and tailor your shortlisted prestigious tournaments</p>
            </div>

            {wishlist.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg border border-brand-green/10 max-w-xl mx-auto space-y-4">
                <Heart className="w-12 h-12 text-brand-green/20 mx-auto" />
                <p className="text-lg font-serif text-brand-green font-medium">Your luxury wishlist is currently empty.</p>
                <p className="text-xs text-brand-dark/70 max-w-sm mx-auto">Shortlist premium packages by tapping the heart icon on any tournament, Grand Prix, or concert card in our catalog.</p>
                <button 
                  onClick={() => setCurrentTab('home')}
                  className="bg-brand-green hover:bg-brand-green-light text-brand-sand px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition"
                >
                  Browse Experiences
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {EXPERIENCES.filter(exp => wishlist.includes(exp.id)).map((experience) => {
                  return (
                    <div 
                      key={experience.id}
                      onClick={() => {
                        setSelectedEventId(experience.id);
                        setSelectedTier(experience.packages[1] || experience.packages[0]);
                      }}
                      className="group cursor-pointer bg-white rounded-lg overflow-hidden border border-brand-green/10 hover:shadow-lg transition flex flex-col h-full"
                    >
                      <div className="relative h-48 overflow-hidden bg-brand-green-light shrink-0">
                        <img 
                          src={experience.image} 
                          alt={experience.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-transparent"></div>
                        <button
                          onClick={(e) => toggleWishlist(experience.id, e)}
                          className="absolute top-3 right-3 p-1.5 rounded-full bg-white text-brand-clay hover:bg-brand-sand"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-3 left-3 text-brand-sand">
                          <p className="text-brand-gold font-serif italic text-xs">{experience.tagline}</p>
                          <h4 className="text-base font-serif font-bold text-white leading-tight">{experience.title}</h4>
                        </div>
                      </div>

                      <div className="p-4 space-y-3 flex-grow flex flex-col justify-between">
                        <div className="space-y-1 text-xs text-brand-green/80">
                          <p className="flex items-center gap-1.5 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-brand-clay" />
                            {experience.venue}, {experience.location}
                          </p>
                          <p className="flex items-center gap-1.5 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-brand-clay" />
                            {experience.dates}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-brand-green/10">
                          <span className="font-serif text-sm font-bold text-brand-green">
                            from <span className="font-mono text-brand-clay font-bold">£{Math.min(...experience.packages.map(p => p.price))}</span>
                          </span>
                          <span className="text-xs font-semibold text-brand-clay flex items-center gap-0.5">
                            Tailor Event <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}


        {/* VIEW 5: INQUIRY BASKET VIEW */}
        {currentTab === 'basket' && (
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-fadeIn">
            <div className="space-y-3 pb-6 border-b border-brand-green/10 mb-8">
              <h1 className="text-3xl md:text-4xl font-serif text-brand-green font-bold tracking-wide">
                Your Luxury Inquiry Basket
              </h1>
              <p className="text-xs text-brand-green/60 uppercase tracking-widest">Consolidate multiple custom packages into a single official concierge request</p>
            </div>

            {basket.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg border border-brand-green/10 max-w-xl mx-auto space-y-4">
                <ShoppingBag className="w-12 h-12 text-brand-green/20 mx-auto" />
                <p className="text-lg font-serif text-brand-green font-medium">Your inquiry basket is empty.</p>
                <p className="text-xs text-brand-dark/70 max-w-sm mx-auto">Select any tournament in our catalog, select your tier, toggles premium upgrades and click add to basket.</p>
                <button 
                  onClick={() => setCurrentTab('home')}
                  className="bg-brand-green hover:bg-brand-green-light text-brand-sand px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition"
                >
                  Browse Experiences
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* List of customized basket items (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  {basket.map((item) => {
                    return (
                      <div key={item.id} className="bg-white p-5 rounded-lg border border-brand-green/10 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                        <div className="flex gap-4">
                          <img 
                            src={item.image} 
                            alt={item.experienceTitle}
                            className="w-20 h-20 object-cover rounded border border-brand-green/5 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="space-y-1">
                            <span className="text-[10px] text-brand-clay uppercase tracking-wider font-bold block">{item.tier.name} Tier</span>
                            <h3 className="font-serif text-base font-bold text-brand-green leading-snug">{item.experienceTitle}</h3>
                            <p className="text-[11px] text-brand-green/75">{item.experienceLocation} · {item.guests} Guests</p>
                            
                            {/* Upgrades listed */}
                            {Object.keys(item.upgrades).some(k => item.upgrades[k as keyof typeof upgrades]) && (
                              <p className="text-[10px] text-brand-green/60 pt-1 font-light italic leading-normal">
                                Upgrades: {Object.keys(item.upgrades).filter(k => item.upgrades[k as keyof typeof upgrades]).map(k => k === 'chauffeur' ? 'Chauffeur' : k === 'helicopter' ? 'Helicopter' : k === 'michelinDining' ? 'Michelin Dining' : k === 'security' ? 'Concierge' : 'Branding').join(', ')}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Value and Remove */}
                        <div className="flex md:flex-col justify-between items-center md:items-end w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-brand-green/5">
                          <div className="text-left md:text-right">
                            <span className="text-[9px] text-brand-green/60 uppercase block">INQUIRY VALUE</span>
                            <span className="font-mono text-sm font-bold text-brand-clay">£{item.calculatedTotal.toLocaleString()}</span>
                          </div>

                          <button 
                            onClick={() => setBasket(prev => prev.filter(i => i.id !== item.id))}
                            className="text-xs text-brand-clay hover:text-brand-clay-dark flex items-center gap-1 py-1 md:mt-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  <div className="flex justify-between items-center p-4 bg-brand-sand-dark rounded border border-brand-green/10">
                    <span className="text-xs font-semibold text-brand-green uppercase tracking-wider">Total Est. Portfolio Value:</span>
                    <span className="font-serif text-xl font-bold text-brand-clay">
                      £{basket.reduce((acc, curr) => acc + curr.calculatedTotal, 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Submit Form (5 cols) */}
                <div className="lg:col-span-5 bg-white p-6 rounded-lg border border-brand-green/15 shadow-md">
                  <form onSubmit={handleSubmitBasketInquiry} className="space-y-4">
                    <div>
                      <h3 className="font-serif text-lg text-brand-green font-bold">Consolidated Inquiry Form</h3>
                      <p className="text-[11px] text-brand-green/60">Fill in representative details to generate official pricing proposal decks</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">VIP / Client Name</span>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Private Client / LVMH Partners"
                        value={directInquiryDetails.companyName}
                        onChange={(e) => setDirectInquiryDetails({...directInquiryDetails, companyName: e.target.value})}
                        className="w-full bg-brand-sand-dark border border-brand-green/10 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-gold text-brand-dark"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">Contact Representative</span>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Jean-Luc Laurent"
                        value={directInquiryDetails.contactName}
                        onChange={(e) => setDirectInquiryDetails({...directInquiryDetails, contactName: e.target.value})}
                        className="w-full bg-brand-sand-dark border border-brand-green/10 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-gold text-brand-dark"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">Contact Email</span>
                      <input 
                        type="email" 
                        required
                        placeholder="uxhumekile@gmail.com"
                        value={directInquiryDetails.email}
                        onChange={(e) => setDirectInquiryDetails({...directInquiryDetails, email: e.target.value})}
                        className="w-full bg-brand-sand-dark border border-brand-green/10 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-gold text-brand-dark"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">Telephone Number</span>
                      <input 
                        type="tel"
                        required
                        placeholder="e.g. +33 1 42 27 78"
                        value={directInquiryDetails.phone}
                        onChange={(e) => setDirectInquiryDetails({...directInquiryDetails, phone: e.target.value})}
                        className="w-full bg-brand-sand-dark border border-brand-green/10 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-gold text-brand-dark"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">Additional Directives</span>
                      <textarea 
                        rows={3}
                        placeholder="Mention any specific requests such as hotel requirements, flight transfers, custom menus, VIP speech times, or legend meet & greets."
                        value={directInquiryDetails.notes}
                        onChange={(e) => setDirectInquiryDetails({...directInquiryDetails, notes: e.target.value})}
                        className="w-full bg-brand-sand-dark border border-brand-green/10 rounded p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-gold text-brand-dark resize-none text-wrap"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-brand-clay hover:bg-brand-clay-dark text-white font-bold text-xs uppercase tracking-widest py-3.5 rounded-sm shadow transition duration-200"
                    >
                      Dispatch Official Inquiry
                    </button>
                  </form>
                </div>

              </div>
            )}
          </div>
        )}


        {/* VIEW 6: REQUESTS LOG & STATUS INTERACTIVE BRIEF (PWA PERSISTENCE) */}
        {currentTab === 'requests' && (
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-fadeIn">
            <div className="space-y-3 pb-6 border-b border-brand-green/10 mb-8">
              <h1 className="text-3xl md:text-4xl font-serif text-brand-green font-bold tracking-wide">
                VIP Requests & Proposal Decks
              </h1>
              <p className="text-xs text-brand-green/60 uppercase tracking-widest">Real-time status updates and customized briefing documents assigned to your company</p>
            </div>

            {requests.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg border border-brand-green/10 max-w-xl mx-auto space-y-4">
                <Clock className="w-12 h-12 text-brand-green/20 mx-auto" />
                <p className="text-lg font-serif text-brand-green font-medium">No previous requests logged.</p>
                <p className="text-xs text-brand-dark/70 max-w-sm mx-auto">Once you submit an inquiry basket or a VIP planner brief, it will be catalogued here with direct agent assignment statuses.</p>
                <button 
                  onClick={() => setCurrentTab('home')}
                  className="bg-brand-green hover:bg-brand-green-light text-brand-sand px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {requests.map((req) => {
                  return (
                    <div key={req.requestId} className="bg-white rounded-lg border border-brand-green/15 shadow-md overflow-hidden">
                      {/* Header with status */}
                      <div className="bg-brand-green text-brand-sand p-4 md:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-brand-gold/20">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-brand-gold font-bold uppercase tracking-widest">PROPOSAL LOG</span>
                            <span className="bg-brand-green-light border border-brand-gold/30 text-brand-gold text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                              {req.requestId}
                            </span>
                          </div>
                          <h3 className="font-serif text-lg font-semibold tracking-wide text-white">{req.companyName}</h3>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-left md:text-right">
                            <span className="text-[10px] text-brand-sand-dark block uppercase">SUBMITTED ON</span>
                            <span className="text-xs font-medium">{req.date}</span>
                          </div>

                          <span className={`text-xs uppercase font-bold tracking-wider px-3 py-1.5 rounded-sm ${req.status === 'Proposal Ready' ? 'bg-[#10b981] text-white' : 'bg-brand-clay text-white animate-pulse'}`}>
                            {req.status}
                          </span>
                        </div>
                      </div>

                      {/* Details of items in request */}
                      <div className="p-6 space-y-6">
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-brand-green border-b border-brand-green/10 pb-1.5">Shortlisted VIP Line-items</h4>
                          
                          <div className="space-y-4">
                            {req.items.map((item, idx) => (
                              <div key={idx} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-1.5">
                                <div className="space-y-1">
                                  <h5 className="font-serif text-base font-bold text-brand-green">{item.experienceTitle}</h5>
                                  <p className="text-xs text-brand-dark/80">
                                    <span className="font-semibold text-brand-clay">{item.tierName} Suite</span> · {item.guests} VIP Attendees
                                  </p>
                                  
                                  {/* Render upgrades list */}
                                  {item.upgradesList && item.upgradesList.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                                      {item.upgradesList.map((upg, uidx) => (
                                        <span key={uidx} className="text-[9px] font-medium text-brand-green/80 bg-brand-sand-dark border border-brand-green/10 rounded px-1.5 py-0.5">
                                          + {upg}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                <div className="text-left md:text-right shrink-0">
                                  <span className="text-[10px] text-brand-green/60 uppercase block">INDICATIVE TARIFF</span>
                                  <span className="font-mono text-sm font-bold text-brand-clay">£{item.total.toLocaleString()}</span>
                                  <span className="text-[10px] text-brand-green/60 block mt-0.5">£{Math.round(item.pricePerGuest).toLocaleString()} / guest</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* VIP metadata & interactive notes */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-brand-green/10 text-xs text-brand-green">
                          <div className="space-y-2">
                            <span className="text-[10px] text-brand-green/60 uppercase block font-bold tracking-wider">REPRESENTATIVE CONTACT</span>
                            <div className="space-y-1 text-brand-dark/85">
                              <p className="font-semibold">{req.contactName}</p>
                              <p>{req.email}</p>
                              {req.phone && <p>{req.phone}</p>}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <span className="text-[10px] text-brand-green/60 uppercase block font-bold tracking-wider">NOTES & DIRECTIVES</span>
                            <p className="text-brand-dark/85 italic leading-relaxed font-light text-wrap">
                              {req.vipNotes || 'No special directives submitted. Suite mapping assigned standard central court priority.'}
                            </p>
                          </div>
                        </div>

                        {/* PDF / proposal download simulation */}
                        <div className="bg-[#ECE5D3]/40 p-4 rounded border border-brand-green/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                          <div className="space-y-1">
                            <p className="font-semibold text-brand-green flex items-center gap-1.5">
                              <Star className="w-4 h-4 text-brand-gold shrink-0 fill-brand-gold" />
                              {req.status === 'Proposal Ready' ? 'Official Interactive Pitch Deck Compiled' : 'Concierge Assigned: Antoine de Saint-Exupéry'}
                            </p>
                            <p className="text-brand-green/75 font-light">
                              {req.status === 'Proposal Ready' 
                                ? 'Contains custom floor layouts for Court Philippe-Chatrier, bespoke Michelin lunch courses, and official debenture ticket certifications.' 
                                : 'Analyzing seating capacity availability. Real-time updates will automatically display here.'}
                            </p>
                          </div>

                          {req.status === 'Proposal Ready' && (
                            <button
                              type="button"
                              onClick={() => {
                                alert(`Downloading compiled PDF proposal for ${req.companyName} (File ID: ${req.requestId}_Brief.pdf)`);
                              }}
                              className="bg-brand-green hover:bg-brand-green-light text-brand-sand px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition shrink-0"
                            >
                              <Download className="w-4 h-4 text-brand-gold" />
                              <span>Download Pitch Deck</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-brand-green text-brand-sand border-t border-brand-gold/25 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3 col-span-1 md:col-span-2">
            <h4 className="font-serif text-lg text-brand-gold font-bold tracking-widest">E L E V A T E</h4>
            <p className="text-xs text-brand-sand-dark leading-relaxed font-light max-w-sm">
              The supreme progressive web application for VIP hospitality, elite sports debentures, and customized VIP social calendar bookings. Clone inspired by Official VIP, visual aesthetics inspired by Roland Garros French luxury.
            </p>
          </div>

          <div className="space-y-3">
            <h5 className="text-xs uppercase tracking-widest text-brand-gold font-bold">Quick Navigation</h5>
            <ul className="space-y-1.5 text-xs text-brand-sand-dark font-light">
              <li>
                <button onClick={() => { setCurrentTab('home'); setSelectedEventId(null); }} className="hover:text-brand-gold text-left">
                  Hospitality Events
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentTab('vip'); setSelectedEventId(null); }} className="hover:text-brand-gold text-left">
                  VIP Concierge
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentTab('wishlist'); setSelectedEventId(null); }} className="hover:text-brand-gold text-left">
                  Saved Shortlists
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentTab('basket'); setSelectedEventId(null); }} className="hover:text-brand-gold text-left">
                  Inquiry Basket
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-xs uppercase tracking-widest text-brand-gold font-bold">VIP Concierge</h5>
            <div className="space-y-1 text-xs text-brand-sand-dark font-light">
              <p>Email: <span className="font-medium text-brand-sand">uxhumekile@gmail.com</span></p>
              <p>Hotline: <span className="font-medium text-brand-sand">+44 20 7946 0192</span></p>
              <p>Presence: Paris · London · Monaco</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-brand-gold/15 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-brand-sand-dark font-light">
          <p>© 2026 Elevate Experiences. Authorized ticketing & hospitality arrangements only. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:underline">Privacy Charter</a>
            <a href="#terms" className="hover:underline">Booking Terms</a>
            <span className="text-brand-gold">PWA Active</span>
          </div>
        </div>
      </footer>

      {/* OFFLINE INDICATOR BAR (Mandatory PWA skill constraint) */}
      {!isOnline && (
        <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded bg-brand-clay text-white px-3.5 py-2 text-xs font-semibold shadow-2xl border border-white/10 animate-bounce">
          <span className="h-2 w-2 rounded-full bg-white animate-ping" />
          <span>Offline Mode — Displaying cached VIP packages.</span>
        </div>
      )}

      {/* iOS Safari Installation Guide Overlay */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-2xl border border-brand-gold/30 text-brand-green">
            <div className="flex justify-between items-start pb-3 border-b border-brand-green/10">
              <h3 className="font-serif text-lg font-bold text-brand-green">Install on iOS Device</h3>
              <button 
                onClick={() => setShowIOSGuide(false)}
                className="p-1 hover:bg-brand-sand-dark rounded text-brand-clay"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="mt-3 text-xs text-brand-dark/85 leading-relaxed font-light">
              To install <strong>Elevate Experiences</strong> directly onto your iPhone or iPad home screen:
            </p>

            <div className="my-4 p-3 bg-brand-sand-dark rounded border border-brand-green/10 text-xs space-y-2 font-medium text-brand-green">
              <p className="flex items-start gap-2">
                <span className="bg-brand-green text-brand-sand rounded-full w-5 h-5 flex items-center justify-center shrink-0 font-bold text-[10px]">1</span>
                <span>Tap the <strong>Share</strong> icon in your Safari browser navigation bar.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="bg-brand-green text-brand-sand rounded-full w-5 h-5 flex items-center justify-center shrink-0 font-bold text-[10px]">2</span>
                <span>Scroll down and tap <strong>Add to Home Screen</strong>.</span>
              </p>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full rounded bg-brand-green hover:bg-brand-green-light text-brand-sand text-xs font-bold uppercase py-2.5 transition"
            >
              Acknowledged
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
