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
  Briefcase,
  User,
  Lock,
  CreditCard,
  QrCode,
  Ticket,
  CheckCircle2
} from 'lucide-react';
import { usePWAInstall } from './usePWAInstall';
import { useOnlineStatus } from './useOnlineStatus';
import { EXPERIENCES, Experience, PackageTier } from './data/experiences';

export default function App() {
  // PWA installation & online status hooks
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const isOnline = useOnlineStatus();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // User auth state
  const [currentUser, setCurrentUser] = useState<{
    uid: string;
    email: string;
    name: string;
    company: string;
    phone: string;
    isAdmin?: boolean;
  } | null>(() => {
    const saved = localStorage.getItem('elevate_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [experiencesList, setExperiencesList] = useState<Experience[]>(() => {
    const saved = localStorage.getItem('elevate_experiences_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Experience[];
        const hasCoachella = parsed.some(exp => exp.id === 'coachella-safari');
        if (hasCoachella) return parsed;
      } catch (e) {
        console.error(e);
      }
      localStorage.removeItem('elevate_experiences_list');
    }
    return EXPERIENCES;
  });

  // Global Upgrades list state for dynamic additions and pricing edits
  const [globalUpgrades, setGlobalUpgrades] = useState<Array<{
    id: string;
    name: string;
    description: string;
    cost: number;
    icon: 'Car' | 'Plane' | 'Wine' | 'ShieldCheck' | 'Briefcase' | 'Coffee';
  }>>(() => {
    const saved = localStorage.getItem('elevate_global_upgrades');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      { id: 'chauffeur', name: 'Private Chauffeur Service', description: 'Mercedes S-Class luxury airport/venue transfers', cost: 250, icon: 'Car' },
      { id: 'helicopter', name: 'Helicopter Transit', description: 'Direct heli-port dropoff (Monaco/Paris/London)', cost: 850, icon: 'Plane' },
      { id: 'michelinDining', name: 'Pre-Event Michelin Dining', description: 'Exclusive tasting menu with wine pairings', cost: 400, icon: 'Wine' },
      { id: 'security', name: 'Personal VIP Concierge', description: 'On-site host, hostesses, and personal security', cost: 300, icon: 'ShieldCheck' },
      { id: 'branding', name: 'Suite VIP Branding', description: 'Custom VIP signage, logos, and color palettes', cost: 150, icon: 'Briefcase' },
    ];
  });

  // Dynamic Event Packages configuration editor state
  const [adminEventPackages, setAdminEventPackages] = useState<PackageTier[]>(() => [
    {
      name: 'The Pavilion Club',
      price: 750,
      benefits: ['Premium padded seating', 'Gourmet buffet', 'Fine wines & champagne'],
      description: 'Standard luxury hospitality with prime seat allotments and catered food/bars.'
    },
    {
      name: 'The President’s Suite',
      price: 2200,
      benefits: ['Front-row Box Seating', 'Five-course private menu', 'Dedicated butler', 'Chauffeur transfers'],
      description: 'Ultra-exclusive private suite access with bespoke dining, personal butler, and custom transfers.'
    }
  ]);

  // Dynamic list of active upgrade IDs for the event being configured
  const [adminEventUpgrades, setAdminEventUpgrades] = useState<string[]>([]);

  // Upgrades editor state
  const [editingUpgradeId, setEditingUpgradeId] = useState<string | null>(null);
  const [adminUpgradeForm, setAdminUpgradeForm] = useState({
    id: '',
    name: '',
    description: '',
    cost: 100,
    icon: 'Coffee' as any,
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [authForm, setAuthForm] = useState({
    email: '',
    name: '',
    company: '',
    phone: '',
    password: '',
  });
  const [authError, setAuthError] = useState('');

  // Completed bookings state
  const [completedBookings, setCompletedBookings] = useState<Array<{
    bookingId: string;
    date: string;
    experienceId: string;
    experienceTitle: string;
    experienceLocation: string;
    image: string;
    tierName: string;
    guests: number;
    guestNames: string[];
    pricePerGuest: number;
    total: number;
    upgradesList: string[];
    paymentCard: string;
    status: 'Confirmed & Issued';
  }>>(() => {
    const saved = localStorage.getItem('elevate_completed_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  // Checkout UI States
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<1 | 2>(1); // 1: guest list, 2: card payment
  const [guestNames, setGuestNames] = useState<Record<string, string[]>>({}); // basketItemId -> list of names
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  // Admin Dashboard States
  const [adminSubTab, setAdminSubTab] = useState<'events' | 'purchases' | 'upgrades'>('events');
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [adminEventForm, setAdminEventForm] = useState({
    title: '',
    category: 'Tennis' as any,
    location: '',
    venue: '',
    dates: '',
    tagline: '',
    shortDescription: '',
    description: '',
    highlightBenefit: '',
    image: '',
    package1Name: 'The Pavilion Club',
    package1Price: 750,
    package1Benefits: 'Premium padded seating, Gourmet buffet, Fine wines & champagne',
    package2Name: 'The President’s Suite',
    package2Price: 2200,
    package2Benefits: 'Front-row Box Seating, Five-course private menu, Dedicated butler, Chauffeur transfers',
  });

  // Core navigation state
  const [currentTab, setCurrentTab] = useState<'home' | 'vip' | 'wishlist' | 'basket' | 'requests' | 'admin'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState<'All' | 'Sports' | 'Music' | 'Other'>('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');

  // Helper to map experience category to main category
  const mapCategoryToMain = (cat: string): 'Sports' | 'Music' | 'Other' => {
    const sports = ['Tennis', 'Motorsport', 'Football', 'Golf', 'Rugby', 'Basketball', 'Cricket'];
    const music = ['Music', 'Festival', 'Live Band'];
    if (sports.includes(cat)) return 'Sports';
    if (music.includes(cat)) return 'Music';
    return 'Other';
  };

  const preferredSubCategoryOrder = [
    'Tennis', 'Motorsport', 'Football', 'Golf', 'Rugby', 'Basketball', 'Cricket', 
    'Music', 'Festival', 'Live Band', 'Heritage'
  ];

  // Dynamically compute subcategories under the selected main category
  const availableSubCategories = React.useMemo(() => {
    const list = experiencesList.map(exp => exp.category);
    const unique = Array.from(new Set(list));
    
    const filtered = selectedMainCategory === 'All' 
      ? unique 
      : unique.filter(cat => mapCategoryToMain(cat) === selectedMainCategory);
      
    return filtered.sort((a, b) => {
      const idxA = preferredSubCategoryOrder.indexOf(a);
      const idxB = preferredSubCategoryOrder.indexOf(b);
      if (idxA === -1 && idxB === -1) return a.localeCompare(b);
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
    });
  }, [experiencesList, selectedMainCategory]);

  // Selected experience for detailed customizer view
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  
  // Customizer state
  const [selectedTier, setSelectedTier] = useState<PackageTier | null>(null);
  const [customGuests, setCustomGuests] = useState<number>(4);
  const [upgrades, setUpgrades] = useState<Record<string, boolean>>({});

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
    upgrades: Record<string, boolean>;
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
  const [vipCategory, setCorpCategory] = useState<'Tennis' | 'Motorsport' | 'Music' | 'Golf' | 'Rugby' | 'Basketball' | 'Cricket' | 'All'>('All');
  const [vipUpgrades, setCorpUpgrades] = useState<Record<string, boolean>>({
    chauffeur: true,
    helicopter: false,
    security: true,
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

  useEffect(() => {
    localStorage.setItem('elevate_current_user', currentUser ? JSON.stringify(currentUser) : '');
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('elevate_completed_bookings', JSON.stringify(completedBookings));
  }, [completedBookings]);

  useEffect(() => {
    localStorage.setItem('elevate_experiences_list', JSON.stringify(experiencesList));
  }, [experiencesList]);

  useEffect(() => {
    localStorage.setItem('elevate_global_upgrades', JSON.stringify(globalUpgrades));
  }, [globalUpgrades]);

  // Seed default registered users for instant testing
  useEffect(() => {
    const usersStr = localStorage.getItem('elevate_users');
    let users = usersStr ? JSON.parse(usersStr) : [];
    
    const adminEmail = 'soentechnologies@gmail.com';
    const adminIndex = users.findIndex((u: any) => u.email.toLowerCase() === adminEmail.toLowerCase());
    
    if (adminIndex === -1) {
      users.push({
        email: adminEmail,
        name: 'Soen Technologies',
        company: 'Soen Tech Ltd',
        phone: '+44 20 7946 0192',
        password: '1234',
        isAdmin: true,
      });
      localStorage.setItem('elevate_users', JSON.stringify(users));
    } else {
      let modified = false;
      if (!users[adminIndex].isAdmin) {
        users[adminIndex].isAdmin = true;
        modified = true;
      }
      if (users[adminIndex].password !== '1234') {
        users[adminIndex].password = '1234';
        modified = true;
      }
      if (modified) {
        localStorage.setItem('elevate_users', JSON.stringify(users));
      }
    }
  }, []);

  // Auto-promote soentechnologies@gmail.com if signed in without admin flag
  useEffect(() => {
    if (currentUser && currentUser.email.toLowerCase() === 'soentechnologies@gmail.com' && !currentUser.isAdmin) {
      setCurrentUser(prev => prev ? { ...prev, isAdmin: true } : null);
    }
  }, [currentUser]);

  // Calculations for customizer
  const getUpgradeCost = (key: string) => {
    const matchingUpg = globalUpgrades.find(u => u.id === key);
    return matchingUpg ? matchingUpg.cost : 0;
  };

  const calculateCustomizerTotal = () => {
    if (!selectedTier) return 0;
    const exp = experiencesList.find(e => e.id === selectedEventId);
    let basePrice = selectedTier.price;
    let upgradeTotal = 0;
    Object.keys(upgrades).forEach((key) => {
      if (upgrades[key]) {
        const isUpgAvailable = !exp || !exp.upgrades || exp.upgrades.length === 0 || exp.upgrades.includes(key);
        if (isUpgAvailable) {
          upgradeTotal += getUpgradeCost(key);
        }
      }
    });
    return (basePrice + upgradeTotal) * customGuests;
  };

  const handleToggleUpgrade = (key: string) => {
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
    const activeUpgradesOnly: Record<string, boolean> = {};
    Object.keys(upgrades).forEach((key) => {
      if (upgrades[key]) {
        const isUpgAvailable = !experience.upgrades || experience.upgrades.length === 0 || experience.upgrades.includes(key);
        if (isUpgAvailable) {
          activeUpgradesOnly[key] = true;
        }
      }
    });

    const newItem = {
      id: `basket-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      experienceId: experience.id,
      experienceTitle: experience.title,
      experienceLocation: experience.location,
      image: experience.image,
      tier: selectedTier,
      guests: customGuests,
      upgrades: activeUpgradesOnly,
      calculatedTotal: calculateCustomizerTotal(),
    };
    setBasket(prev => [...prev, newItem]);
    setCurrentTab('basket');
    setSelectedEventId(null);
    // Reset tailor states
    setUpgrades({});
  };

  // Sign In handler
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const usersStr = localStorage.getItem('elevate_users');
    const users = usersStr ? JSON.parse(usersStr) : [];
    
    const user = users.find((u: any) => u.email.toLowerCase() === authForm.email.toLowerCase() && u.password === authForm.password);
    if (user) {
      const loggedInUser = {
        uid: `user-${Math.random().toString(36).substr(2, 9)}`,
        email: user.email,
        name: user.name,
        company: user.company || '',
        phone: user.phone || '',
        isAdmin: !!user.isAdmin || user.email.toLowerCase() === 'soentechnologies@gmail.com',
      };
      setCurrentUser(loggedInUser);
      setAuthModalOpen(false);
      // Pre-fill card name
      setCardDetails(prev => ({ ...prev, name: user.name }));
      setAuthForm(prev => ({ ...prev, password: '' }));
    } else {
      setAuthError('Invalid email or access PIN. Try using soentechnologies@gmail.com with PIN 1234');
    }
  };

  // Sign Up handler
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!authForm.email || !authForm.name || !authForm.password) {
      setAuthError('Please fill in all required fields.');
      return;
    }
    const usersStr = localStorage.getItem('elevate_users');
    const users = usersStr ? JSON.parse(usersStr) : [];
    
    const exists = users.some((u: any) => u.email.toLowerCase() === authForm.email.toLowerCase());
    if (exists) {
      setAuthError('This email is already registered. Please sign in instead.');
      return;
    }

    const newUser = {
      email: authForm.email,
      name: authForm.name,
      company: authForm.company,
      phone: authForm.phone,
      password: authForm.password,
    };
    users.push(newUser);
    localStorage.setItem('elevate_users', JSON.stringify(users));

    const loggedInUser = {
      uid: `user-${Math.random().toString(36).substr(2, 9)}`,
      email: newUser.email,
      name: newUser.name,
      company: newUser.company || '',
      phone: newUser.phone || '',
    };
    setCurrentUser(loggedInUser);
    setAuthModalOpen(false);
    setCardDetails(prev => ({ ...prev, name: newUser.name }));
    setAuthForm({ email: '', name: '', company: '', phone: '', password: '' });
  };

  // Sign Out handler
  const handleSignOut = () => {
    setCurrentUser(null);
    setIsCheckingOut(false);
    setCurrentTab('home');
  };

  // Checkout submission handler
  const handleCompleteCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || basket.length === 0) return;

    // Generate completed bookings
    const newBookings = basket.map(item => {
      const activeUpgrades: string[] = [];
      Object.keys(item.upgrades).forEach(key => {
        if (item.upgrades[key]) {
          const matchingUpg = globalUpgrades.find(u => u.id === key);
          if (matchingUpg) {
            activeUpgrades.push(matchingUpg.name);
          }
        }
      });

      // Get guest names
      const attendeeNames = guestNames[item.id] || [];
      const completeNames = Array.from({ length: item.guests }, (_, i) => {
        return attendeeNames[i] || `VIP Guest ${i + 1} (${currentUser.name})`;
      });

      return {
        bookingId: `ELV-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        experienceId: item.experienceId,
        experienceTitle: item.experienceTitle,
        experienceLocation: item.experienceLocation,
        image: item.image,
        tierName: item.tier.name,
        guests: item.guests,
        guestNames: completeNames,
        pricePerGuest: item.calculatedTotal / item.guests,
        total: item.calculatedTotal,
        upgradesList: activeUpgrades,
        paymentCard: `AMEX Centurion (•••• ${cardDetails.number.slice(-4) || '8820'})`,
        status: 'Confirmed & Issued' as const,
      };
    });

    setCompletedBookings(prev => [...newBookings, ...prev]);
    setBasket([]); // clear basket
    setIsCheckingOut(false);
    setCheckoutStep(1);
    setGuestNames({});
    setCardDetails({ number: '', name: '', expiry: '', cvv: '' });
    
    // Switch to My Bookings tab
    setCurrentTab('requests');
  };

  // Save/Create Event Handler
  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEventForm.title || !adminEventForm.location || !adminEventForm.venue || !adminEventForm.dates) {
      alert('Please fill in all required event details.');
      return;
    }

    if (adminEventPackages.length === 0) {
      alert('An event must have at least one Package Tier defined.');
      return;
    }

    const parsedExperience: Experience = {
      id: editingEventId || `event-${Date.now()}-${adminEventForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      title: adminEventForm.title,
      category: adminEventForm.category,
      location: adminEventForm.location,
      venue: adminEventForm.venue,
      dates: adminEventForm.dates,
      image: adminEventForm.image || '/assets/images/elevate_hero_1791372544717.jpg',
      tagline: adminEventForm.tagline || 'L’Art de Vivre d’Élite',
      shortDescription: adminEventForm.shortDescription || 'Experience unmatched VIP hospitality access under sovereign guidelines.',
      description: adminEventForm.description || 'Step into the supreme luxury arena where high adrenaline sport meets three-star gastronomy. Secure official debentures and Loge box seating allotments.',
      highlightBenefit: adminEventForm.highlightBenefit || 'Premium category seating combined with Michelin-Starred menus.',
      packages: adminEventPackages,
      upgrades: adminEventUpgrades,
    };

    setExperiencesList(prev => {
      if (editingEventId) {
        return prev.map(exp => exp.id === editingEventId ? parsedExperience : exp);
      } else {
        return [...prev, parsedExperience];
      }
    });

    alert(editingEventId ? 'Event updated successfully!' : 'New luxury event added to the catalog!');
    handleResetEventForm();
  };

  // Delete Event Handler
  const handleDeleteEvent = (id: string) => {
    if (confirm('Are you absolutely certain you want to remove this elite event from the catalog? This action is irreversible.')) {
      setExperiencesList(prev => prev.filter(exp => exp.id !== id));
    }
  };

  // Load Event for Editing
  const handleEditEventStart = (exp: Experience) => {
    setEditingEventId(exp.id);
    setAdminEventForm({
      title: exp.title,
      category: exp.category,
      location: exp.location,
      venue: exp.venue,
      dates: exp.dates,
      tagline: exp.tagline,
      shortDescription: exp.shortDescription,
      description: exp.description,
      highlightBenefit: exp.highlightBenefit,
      image: exp.image,
      package1Name: exp.packages[0]?.name || 'The Pavilion Club',
      package1Price: exp.packages[0]?.price || 750,
      package1Benefits: exp.packages[0]?.benefits.join(', ') || '',
      package2Name: exp.packages[1]?.name || 'The President’s Suite',
      package2Price: exp.packages[1]?.price || 2200,
      package2Benefits: exp.packages[1]?.benefits.join(', ') || '',
    });
    setAdminEventPackages(exp.packages || []);
    setAdminEventUpgrades(exp.upgrades || []);
  };

  // Reset Event Form
  const handleResetEventForm = () => {
    setEditingEventId(null);
    setAdminEventForm({
      title: '',
      category: 'Tennis' as any,
      location: '',
      venue: '',
      dates: '',
      tagline: '',
      shortDescription: '',
      description: '',
      highlightBenefit: '',
      image: '',
      package1Name: 'The Pavilion Club',
      package1Price: 750,
      package1Benefits: 'Premium padded seating, Gourmet buffet, Fine wines & champagne',
      package2Name: 'The President’s Suite',
      package2Price: 2200,
      package2Benefits: 'Front-row Box Seating, Five-course private menu, Dedicated butler, Chauffeur transfers',
    });
    setAdminEventPackages([
      {
        name: 'The Pavilion Club',
        price: 750,
        benefits: ['Premium padded seating', 'Gourmet buffet', 'Fine wines & champagne'],
        description: 'Standard luxury hospitality with prime seat allotments and catered food/bars.'
      },
      {
        name: 'The President’s Suite',
        price: 2200,
        benefits: ['Front-row Box Seating', 'Five-course private menu', 'Dedicated butler', 'Chauffeur transfers'],
        description: 'Ultra-exclusive private suite access with bespoke dining, personal butler, and custom transfers.'
      }
    ]);
    setAdminEventUpgrades([]);
  };

  // Upgrades management handlers
  const handleSaveUpgrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUpgradeForm.name.trim() || !adminUpgradeForm.description.trim() || adminUpgradeForm.cost === null || adminUpgradeForm.cost === undefined || isNaN(adminUpgradeForm.cost)) {
      alert('Please fill in all upgrade fields with valid values.');
      return;
    }

    const trimmedName = adminUpgradeForm.name.trim();
    const upgradeId = editingUpgradeId || `upg-${Date.now()}-${trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

    const parsedUpgrade = {
      id: upgradeId,
      name: trimmedName,
      description: adminUpgradeForm.description.trim(),
      cost: Number(adminUpgradeForm.cost),
      icon: adminUpgradeForm.icon || 'Coffee',
    };

    setGlobalUpgrades(prev => {
      if (editingUpgradeId) {
        return prev.map(u => u.id === editingUpgradeId ? parsedUpgrade : u);
      } else {
        return [...prev, parsedUpgrade];
      }
    });

    alert(editingUpgradeId ? 'Premium upgrade updated successfully!' : 'New premium upgrade added to the portal!');
    handleResetUpgradeForm();
  };

  const handleResetUpgradeForm = () => {
    setEditingUpgradeId(null);
    setAdminUpgradeForm({
      id: '',
      name: '',
      description: '',
      cost: 100,
      icon: 'Coffee',
    });
  };

  const handleDeleteUpgrade = (id: string) => {
    if (confirm('Are you sure you want to remove this premium upgrade? This will affect new custom quotes immediately.')) {
      setGlobalUpgrades(prev => prev.filter(u => u.id !== id));
      // Clean up from the active form's selections
      setAdminEventUpgrades(prev => prev.filter(upgId => upgId !== id));
      // Clean up from all experiences
      setExperiencesList(prev => prev.map(exp => {
        if (exp.upgrades) {
          return {
            ...exp,
            upgrades: exp.upgrades.filter(upgId => upgId !== id)
          };
        }
        return exp;
      }));
    }
  };

  const handleEditUpgradeStart = (upg: any) => {
    setEditingUpgradeId(upg.id);
    setAdminUpgradeForm({
      id: upg.id,
      name: upg.name,
      description: upg.description,
      cost: upg.cost,
      icon: upg.icon,
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
        Object.keys(item.upgrades).forEach(key => {
          if (item.upgrades[key]) {
            const matchingUpg = globalUpgrades.find(u => u.id === key);
            if (matchingUpg) {
              activeUpgrades.push(matchingUpg.name);
            }
          }
        });

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
    const filtered = experiencesList.filter(exp => {
      if (vipCategory !== 'All' && exp.category !== vipCategory) return false;
      return true;
    });

    const recommendedExperience = filtered.length > 0 ? filtered[0] : experiencesList[0];
    const recommendedTier = recommendedExperience.packages[1] || recommendedExperience.packages[0];

    // Calc custom total based on sliders
    let perGuestPrice = recommendedTier.price;
    const activeUpgrades: string[] = [];
    Object.keys(vipUpgrades).forEach((key) => {
      if (vipUpgrades[key]) {
        const matchingUpg = globalUpgrades.find(u => u.id === key);
        if (matchingUpg) {
          perGuestPrice += matchingUpg.cost;
          activeUpgrades.push(matchingUpg.name);
        }
      }
    });

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

  // Custom filtering algorithm for home events with main and sub categories
  const filteredExperiences = experiencesList.filter((exp) => {
    // 1. Filter by Main Category
    const mainCat = mapCategoryToMain(exp.category);
    const matchesMain = selectedMainCategory === 'All' || mainCat === selectedMainCategory;
    
    // 2. Filter by Sub Category
    const matchesSub = selectedSubCategory === 'All' || exp.category === selectedSubCategory;
    
    // 3. Filter by Search Query
    const matchesSearch = exp.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          exp.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          exp.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          exp.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
                          
    return matchesMain && matchesSub && matchesSearch;
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
              My Bookings {(requests.length > 0 || completedBookings.length > 0) && <span className="bg-brand-clay text-white rounded-full px-1.5 py-0.5 text-[9px] flex items-center justify-center font-mono font-bold">{requests.length + completedBookings.length}</span>}
            </button>
            {currentUser?.isAdmin && (
              <button 
                onClick={() => { setCurrentTab('admin'); setSelectedEventId(null); }}
                className={`hover:text-brand-gold pb-1 border-b transition-all duration-200 font-bold ${currentTab === 'admin' ? 'text-brand-gold border-brand-gold' : 'border-transparent text-brand-gold/90'}`}
              >
                Admin Console
              </button>
            )}
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

            {currentUser ? (
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded bg-brand-green-light border border-brand-gold/40 hover:border-brand-gold text-brand-gold font-semibold text-[11px] tracking-wider uppercase px-3.5 py-2 transition shadow-sm"
                >
                  <User className="w-3.5 h-3.5 text-brand-gold" />
                  <span className="max-w-[100px] truncate">{currentUser.name}</span>
                </button>
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-brand-green border border-brand-gold/30 rounded-md shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-1 text-xs text-brand-sand-dark">
                  <div className="px-3.5 py-2 border-b border-brand-gold/15 text-[10px] text-brand-gold uppercase tracking-wider font-semibold">
                    Corporate Account
                  </div>
                  <button
                    onClick={() => { setCurrentTab('requests'); setSelectedEventId(null); }}
                    className="w-full text-left px-3.5 py-2 hover:bg-brand-green-light hover:text-brand-gold transition"
                  >
                    My Portfolio / Bookings
                  </button>
                  {currentUser.isAdmin && (
                    <button
                      onClick={() => { setCurrentTab('admin'); setSelectedEventId(null); }}
                      className="w-full text-left px-3.5 py-2 hover:bg-brand-green-light text-brand-gold font-semibold transition border-t border-brand-gold/10"
                    >
                      Admin Console
                    </button>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3.5 py-2 hover:bg-brand-green-light hover:text-brand-clay transition border-t border-brand-gold/10"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => { setAuthTab('signin'); setAuthModalOpen(true); }}
                className="border border-brand-gold hover:border-brand-gold-light hover:text-brand-gold text-brand-gold font-semibold text-[11px] uppercase tracking-widest px-4 py-2 rounded-sm transition whitespace-nowrap"
              >
                Sign In
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
                <span>My Bookings</span>
                <span className="bg-brand-clay text-white text-xs rounded-full px-2 py-0.5">{requests.length + completedBookings.length}</span>
              </button>
              {currentUser?.isAdmin && (
                <button 
                  onClick={() => { setCurrentTab('admin'); setSelectedEventId(null); setMobileMenuOpen(false); }}
                  className={`w-full text-left py-2 px-3 text-sm font-bold uppercase tracking-wider rounded transition-all ${currentTab === 'admin' ? 'bg-brand-green-light text-brand-gold border-l-2 border-brand-gold' : 'text-brand-gold hover:text-brand-gold-light'}`}
                >
                  Admin Console
                </button>
              )}

              {currentUser ? (
                <div className="border-t border-brand-gold/15 pt-2.5 px-3 flex flex-col gap-1.5">
                  <div className="text-[10px] text-brand-gold uppercase tracking-wider font-semibold">Logged in: {currentUser.name}</div>
                  <button 
                    onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
                    className="w-full text-left text-xs uppercase tracking-wider font-bold py-1 text-brand-clay"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="border-t border-brand-gold/15 pt-2.5 px-3">
                  <button 
                    onClick={() => { setAuthTab('signin'); setAuthModalOpen(true); setMobileMenuOpen(false); }}
                    className="w-full text-center rounded border border-brand-gold text-brand-gold text-xs uppercase font-bold py-2"
                  >
                    Sign In Member
                  </button>
                </div>
              )}
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

                <div className="flex flex-col gap-3 w-full md:w-auto">
                  {/* Main Categories Segmented Control */}
                  <div className="flex flex-wrap gap-1 p-1 bg-brand-sand-dark rounded-md border border-brand-green/5 self-end">
                    {(['All', 'Sports', 'Music', 'Other'] as const).map((mainCat) => {
                      const labelMap = {
                        All: 'All',
                        Sports: 'Sports',
                        Music: 'Music',
                        Other: 'Other'
                      };
                      const isActive = selectedMainCategory === mainCat;
                      return (
                        <button
                          key={mainCat}
                          type="button"
                          onClick={() => {
                            setSelectedMainCategory(mainCat);
                            setSelectedSubCategory('All');
                          }}
                          className={`px-3 py-1.5 text-xs font-bold tracking-wider uppercase rounded transition-all duration-200 ${
                            isActive 
                              ? 'bg-brand-green text-brand-sand shadow-sm font-bold' 
                              : 'text-brand-green/70 hover:text-brand-green hover:bg-brand-sand-dark/50'
                          }`}
                        >
                          {labelMap[mainCat]}
                        </button>
                      );
                    })}
                  </div>

                  {/* Sub-categories segment */}
                  {availableSubCategories.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 justify-end">
                      <button
                        type="button"
                        onClick={() => setSelectedSubCategory('All')}
                        className={`px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase rounded-sm border transition-all ${
                          selectedSubCategory === 'All'
                            ? 'bg-brand-gold/15 text-brand-gold border-brand-gold/30'
                            : 'bg-transparent text-brand-green/60 border-transparent hover:text-brand-green hover:bg-brand-sand-dark'
                        }`}
                      >
                        All {selectedMainCategory === 'All' ? 'Types' : selectedMainCategory}
                      </button>
                      {availableSubCategories.map((subCat) => {
                        const isActive = selectedSubCategory === subCat;
                        return (
                          <button
                            key={subCat}
                            type="button"
                            onClick={() => setSelectedSubCategory(subCat)}
                            className={`px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase rounded-sm border transition-all ${
                              isActive
                                ? 'bg-brand-gold/15 text-brand-gold border-brand-gold/30'
                                : 'bg-transparent text-brand-green/60 border-transparent hover:text-brand-green hover:bg-brand-sand-dark'
                            }`}
                          >
                            {subCat}
                          </button>
                        );
                      })}
                    </div>
                  )}
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
                      onClick={() => { setSearchQuery(''); setSelectedMainCategory('All'); setSelectedSubCategory('All'); }}
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
            const exp = experiencesList.find(e => e.id === selectedEventId);
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
                          {globalUpgrades.filter((upg) => {
                            // If event does not specify any specific upgrades, default to all upgrades
                            if (!exp.upgrades || exp.upgrades.length === 0) return true;
                            return exp.upgrades.includes(upg.id);
                          }).map((upg) => {
                            const isSelected = !!upgrades[upg.id];
                            const IconComponent = upg.icon === 'Car' ? Car 
                              : upg.icon === 'Plane' ? Plane 
                              : upg.icon === 'Wine' ? Wine 
                              : upg.icon === 'ShieldCheck' ? ShieldCheck 
                              : upg.icon === 'Briefcase' ? Briefcase 
                              : Coffee;

                            return (
                              <button
                                key={upg.id}
                                type="button"
                                onClick={() => handleToggleUpgrade(upg.id)}
                                className={`w-full flex items-center justify-between p-2.5 rounded border text-left transition ${isSelected ? 'bg-brand-green/5 border-brand-gold ring-1 ring-brand-gold' : 'bg-transparent border-brand-green/10 hover:bg-brand-sand-dark'}`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <IconComponent className="w-4 h-4 text-brand-clay shrink-0" />
                                  <div>
                                    <span className="text-xs font-semibold text-brand-green block">{upg.name}</span>
                                    <span className="text-[10px] text-brand-green/60">{upg.description}</span>
                                  </div>
                                </div>
                                <span className="font-mono text-xs font-bold text-brand-green/80 shrink-0">+£{upg.cost}</span>
                              </button>
                            );
                          })}
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
                            if (upgrades[key]) {
                              const upg = globalUpgrades.find(u => u.id === key);
                              const label = upg ? upg.name : key;
                              return (
                                <div key={key} className="flex justify-between pl-3 border-l border-brand-gold/30 text-[11px]">
                                  <span>+ {label}:</span>
                                  <span className="font-mono">£{getUpgradeCost(key)} × {customGuests}</span>
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
                        <option value="Rugby">Rugby Championships (Six Nations)</option>
                        <option value="Basketball">Basketball Elite Games (NBA Paris)</option>
                        <option value="Cricket">Cricket Test Matches (Lord’s Test)</option>
                      </select>
                    </div>

                    {/* Core Upgrade checklist */}
                    <div className="space-y-2.5">
                      <label className="text-xs uppercase tracking-wider font-semibold text-brand-green block">Premium Logistics Requested</label>
                      <div className="grid grid-cols-2 gap-3 text-xs text-brand-green">
                        {globalUpgrades.map((upg) => {
                          const isSelected = !!vipUpgrades[upg.id];
                          const IconComponent = upg.icon === 'Car' ? Car 
                            : upg.icon === 'Plane' ? Plane 
                            : upg.icon === 'Wine' ? Wine 
                            : upg.icon === 'ShieldCheck' ? ShieldCheck 
                            : upg.icon === 'Briefcase' ? Briefcase 
                            : Coffee;

                          return (
                            <button
                              key={upg.id}
                              type="button"
                              onClick={() => setCorpUpgrades(prev => ({...prev, [upg.id]: !prev[upg.id]}))}
                              className={`flex items-center gap-2 p-2 rounded border text-left transition ${isSelected ? 'bg-brand-green/5 border-brand-gold font-semibold' : 'bg-transparent border-brand-green/10 hover:bg-brand-sand-dark'}`}
                            >
                              <Check className={`w-4 h-4 text-brand-gold shrink-0 ${isSelected ? 'opacity-100' : 'opacity-20'}`} />
                              <div className="truncate">
                                <span className="block font-semibold text-xs leading-none">{upg.name}</span>
                                <span className="text-[9px] text-brand-green/60">+£{upg.cost}/guest</span>
                              </div>
                            </button>
                          );
                        })}
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
                {experiencesList.filter(exp => wishlist.includes(exp.id)).map((experience) => {
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
                            {Object.keys(item.upgrades).some(k => item.upgrades[k]) && (
                              <p className="text-[10px] text-brand-green/60 pt-1 font-light italic leading-normal">
                                Upgrades: {Object.keys(item.upgrades)
                                  .filter(k => item.upgrades[k])
                                  .map(k => {
                                    const matched = globalUpgrades.find(g => g.id === k);
                                    return matched ? matched.name : k;
                                  })
                                  .join(', ')}
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

                {/* Consolidated Panel (5 cols) */}
                <div className="lg:col-span-5 bg-white p-6 rounded-lg border border-brand-green/15 shadow-md">
                  
                  {isCheckingOut ? (
                    /* ACTIVE CHECKOUT CONTAINER */
                    <div className="space-y-5 animate-fadeIn">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-brand-clay uppercase tracking-wider font-bold mb-1">
                          <CreditCard className="w-4 h-4" />
                          <span>Secure Corporate Checkout</span>
                        </div>
                        <h3 className="font-serif text-lg text-brand-green font-bold">Complete VIP Reservation</h3>
                        <p className="text-[11px] text-brand-green/60">
                          Step {checkoutStep} of 2 · Authorized member session active
                        </p>
                      </div>

                      {checkoutStep === 1 ? (
                        /* CHECKOUT STEP 1: GUEST LIST */
                        <form onSubmit={(e) => { e.preventDefault(); setCheckoutStep(2); }} className="space-y-4">
                          <div className="max-h-80 overflow-y-auto pr-1 space-y-4 divide-y divide-brand-green/10">
                            {basket.map((item) => (
                              <div key={item.id} className="space-y-2 pt-3 first:pt-0">
                                <h4 className="text-xs uppercase tracking-wider font-bold text-brand-green">{item.experienceTitle}</h4>
                                <p className="text-[10px] text-brand-green/60 italic leading-relaxed">
                                  Provide guest credentials below to personalize their commemorative physical badges and security credentials:
                                </p>
                                <div className="space-y-2 mt-2">
                                  {Array.from({ length: item.guests }).map((_, i) => (
                                    <div key={i} className="flex gap-2 items-center">
                                      <span className="text-[10px] text-brand-green font-semibold shrink-0 w-16">Guest {i + 1}:</span>
                                      <input
                                        type="text"
                                        required
                                        placeholder={`Attendee ${i + 1} Full Name`}
                                        value={guestNames[item.id]?.[i] || ''}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setGuestNames(prev => {
                                            const current = prev[item.id] ? [...prev[item.id]] : [];
                                            current[i] = val;
                                            return { ...prev, [item.id]: current };
                                          });
                                        }}
                                        className="w-full bg-brand-sand-dark border border-brand-green/10 rounded px-2.5 py-1.5 text-xs text-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-gold"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-3 pt-2">
                            <button
                              type="button"
                              onClick={() => setIsCheckingOut(false)}
                              className="w-1/3 border border-brand-green/15 text-brand-green text-xs font-semibold uppercase py-3 rounded-sm hover:bg-brand-sand transition"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="w-2/3 bg-brand-green hover:bg-brand-green-light text-brand-sand font-bold text-xs uppercase tracking-widest py-3 rounded-sm shadow transition duration-200"
                            >
                              Next: Payment
                            </button>
                          </div>
                        </form>
                      ) : (
                        /* CHECKOUT STEP 2: PAYMENT CARD DETAILS */
                        <form onSubmit={handleCompleteCheckout} className="space-y-4">
                          
                          {/* Luxe Centurion Black Card Visual */}
                          <div className="relative h-44 rounded-xl bg-gradient-to-br from-[#1C1F1E] via-[#0E100F] to-[#151716] border border-brand-gold/30 shadow-2xl p-5 text-brand-sand font-sans flex flex-col justify-between overflow-hidden">
                            <div className="absolute inset-0 bg-white/[0.02] mix-blend-overlay"></div>
                            
                            {/* Gold Wordmark & Chip */}
                            <div className="flex justify-between items-start">
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[10px] tracking-[0.25em] text-brand-gold uppercase font-bold">E L E V A T E</span>
                                <span className="text-[6px] tracking-wider text-brand-gold-light/60 uppercase">SOVEREIGN PRIVÉ MEMBERSHIP</span>
                              </div>
                              <div className="w-8 h-6 rounded bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold opacity-90 relative overflow-hidden flex items-center justify-center text-[7px] text-[#0F1E17] font-bold font-mono">
                                <div className="absolute inset-0 bg-white/10 flex items-center justify-center">CHIP</div>
                              </div>
                            </div>

                            {/* Card Number */}
                            <div className="text-sm font-mono tracking-[0.25em] text-brand-gold-light text-center">
                              {cardDetails.number || '••••  ••••  ••••  8820'}
                            </div>

                            {/* Cardholder name & Expiry */}
                            <div className="flex justify-between items-end text-[9px] font-medium text-brand-sand-dark">
                              <div className="flex flex-col">
                                <span className="text-[6px] text-brand-gold/50 uppercase">MEMBER INITIATOR</span>
                                <span className="uppercase tracking-wider truncate max-w-[130px] font-serif italic text-brand-gold">
                                  {cardDetails.name || currentUser?.name || 'MEMBER PRIVÉ'}
                                </span>
                              </div>
                              <div className="flex flex-col text-right">
                                <span className="text-[6px] text-brand-gold/50 uppercase">EXPIRES</span>
                                <span className="font-mono tracking-wider">{cardDetails.expiry || '12 / 29'}</span>
                              </div>
                            </div>
                          </div>

                          <p className="text-[10px] text-brand-green/60 text-center font-light leading-relaxed">
                            Authorized payment session secures instant debenture validation with 100% money-back booking guarantee.
                          </p>

                          <div className="space-y-3 pt-1">
                            <div className="space-y-1">
                              <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">Initiator Name on Card</span>
                              <input
                                type="text"
                                required
                                value={cardDetails.name}
                                onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                                className="w-full bg-brand-sand-dark border border-brand-green/10 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-gold text-brand-dark"
                              />
                            </div>

                            <div className="space-y-1">
                              <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">Corporate Card Number</span>
                              <input
                                type="text"
                                required
                                placeholder="4000 1234 5678 8820"
                                maxLength={19}
                                value={cardDetails.number}
                                onChange={(e) => {
                                  // Simple space auto-insert for formatting
                                  const val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                                  const matches = val.match(/\d{4,16}/g);
                                  const match = (matches && matches[0]) || '';
                                  const parts = [];
                                  for (let i = 0, len = match.length; i < len; i += 4) {
                                    parts.push(match.substring(i, i + 4));
                                  }
                                  setCardDetails({ ...cardDetails, number: parts.length > 0 ? parts.join(' ') : val });
                                }}
                                className="w-full bg-brand-sand-dark border border-brand-green/10 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-gold text-brand-dark font-mono"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">Expiry Date</span>
                                <input
                                  type="text"
                                  required
                                  placeholder="MM/YY"
                                  maxLength={5}
                                  value={cardDetails.expiry}
                                  onChange={(e) => {
                                    let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                                    if (val.length > 2) {
                                      val = `${val.slice(0, 2)}/${val.slice(2, 4)}`;
                                    }
                                    setCardDetails({ ...cardDetails, expiry: val });
                                  }}
                                  className="w-full bg-brand-sand-dark border border-brand-green/10 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-gold text-brand-dark font-mono"
                                />
                              </div>

                              <div className="space-y-1">
                                <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">CVV Code</span>
                                <input
                                  type="password"
                                  required
                                  placeholder="•••"
                                  maxLength={4}
                                  value={cardDetails.cvv}
                                  onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/[^0-9]/g, '') })}
                                  className="w-full bg-brand-sand-dark border border-brand-green/10 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-gold text-brand-dark font-mono"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-3 pt-2">
                            <button
                              type="button"
                              onClick={() => setCheckoutStep(1)}
                              className="w-1/3 border border-brand-green/15 text-brand-green text-xs font-semibold uppercase py-3 rounded-sm hover:bg-brand-sand transition"
                            >
                              Back
                            </button>
                            <button
                              type="submit"
                              className="w-2/3 bg-brand-clay hover:bg-brand-clay-dark text-white font-bold text-xs uppercase tracking-widest py-3 rounded-sm shadow transition duration-200"
                            >
                              Authorize Purchase
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  ) : (
                    /* NO-CHECKOUT PASSIVE STATE (Decision Gate) */
                    <div className="space-y-6 text-brand-green">
                      <div className="space-y-1">
                        <h3 className="font-serif text-lg font-bold">Secure Purchase & Reservation</h3>
                        <p className="text-[11px] text-brand-green/60">
                          Deploy your selected elite assets. Choose your preferred processing route:
                        </p>
                      </div>

                      <div className="space-y-4">
                        {/* Option 1: Complete Secure Direct Purchase */}
                        <div className="bg-brand-sand-dark border border-brand-gold/30 p-4 rounded-md space-y-3">
                          <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-brand-clay">
                            <CreditCard className="w-4 h-4 text-brand-gold shrink-0" />
                            <span>Direct Secure Purchase</span>
                          </div>
                          <p className="text-[11px] leading-relaxed font-light text-brand-dark/85">
                            Validate debenture seat numbers instantly, authorize secure payment billing, and print your physical luxury boarding passes immediately.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              if (!currentUser) {
                                setAuthTab('signin');
                                setAuthModalOpen(true);
                              } else {
                                setIsCheckingOut(true);
                                setCheckoutStep(1);
                              }
                            }}
                            className="w-full bg-brand-clay hover:bg-brand-clay-dark text-white font-bold text-xs uppercase tracking-widest py-2.5 rounded-sm shadow transition duration-200"
                          >
                            Proceed to Secure Checkout
                          </button>
                        </div>

                        {/* Option 2: Submit Passive Information Request */}
                        <div className="border border-brand-green/10 p-4 rounded-md space-y-3">
                          <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-brand-green">
                            <Send className="w-4 h-4 shrink-0" />
                            <span>Request Pricing Proposal</span>
                          </div>
                          <p className="text-[11px] leading-relaxed font-light text-brand-dark/85">
                            Submit a traditional passive brief. An expert VIP concierge will construct a personalized PDF pitch deck and contact you within 24 hours.
                          </p>
                          
                          {/* Expandable toggle or inline form */}
                          <div className="pt-1.5 border-t border-brand-green/5 space-y-3.5">
                            <form onSubmit={handleSubmitBasketInquiry} className="space-y-3.5">
                              <div className="space-y-1">
                                <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">VIP / Client Name</span>
                                <input 
                                  type="text" 
                                  required
                                  placeholder="e.g. Private Client / LVMH Partners"
                                  value={directInquiryDetails.companyName}
                                  onChange={(e) => setDirectInquiryDetails({...directInquiryDetails, companyName: e.target.value})}
                                  className="w-full bg-brand-sand-dark border border-brand-green/10 rounded px-2.5 py-1.5 text-[11px] text-brand-dark focus:outline-none"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">Contact Representative</span>
                                  <input 
                                    type="text" 
                                    required
                                    placeholder="e.g. Jean-Luc"
                                    value={directInquiryDetails.contactName}
                                    onChange={(e) => setDirectInquiryDetails({...directInquiryDetails, contactName: e.target.value})}
                                    className="w-full bg-brand-sand-dark border border-brand-green/10 rounded px-2.5 py-1.5 text-[11px] text-brand-dark focus:outline-none"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">Contact Email</span>
                                  <input 
                                    type="email" 
                                    required
                                    placeholder="email@example.com"
                                    value={directInquiryDetails.email}
                                    onChange={(e) => setDirectInquiryDetails({...directInquiryDetails, email: e.target.value})}
                                    className="w-full bg-brand-sand-dark border border-brand-green/10 rounded px-2.5 py-1.5 text-[11px] text-brand-dark focus:outline-none"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">Telephone Number</span>
                                <input 
                                  type="tel"
                                  required
                                  placeholder="Telephone number"
                                  value={directInquiryDetails.phone}
                                  onChange={(e) => setDirectInquiryDetails({...directInquiryDetails, phone: e.target.value})}
                                  className="w-full bg-brand-sand-dark border border-brand-green/10 rounded px-2.5 py-1.5 text-[11px] text-brand-dark focus:outline-none"
                                />
                              </div>

                              <button
                                type="submit"
                                className="w-full border border-brand-green text-brand-green hover:bg-brand-sand font-bold text-xs uppercase tracking-widest py-2 rounded-sm transition duration-200"
                              >
                                Dispatch Concierge Inquiry
                              </button>
                            </form>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        )}


        {/* VIEW 6: MY BOOKINGS & VIP PORTFOLIO (COMPLETED PURCHASES & REQUESTS) */}
        {currentTab === 'requests' && (
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-fadeIn text-brand-green">
            
            {/* Header section */}
            <div className="space-y-3 pb-6 border-b border-brand-green/10 mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-wide">
                  Your VIP Portfolio
                </h1>
                <p className="text-xs text-brand-green/60 uppercase tracking-widest mt-1">
                  Manage confirmed luxury reservations, boarding passes, and custom quote requests
                </p>
              </div>
              
              {currentUser && (
                <div className="text-left md:text-right text-xs">
                  <span className="text-[10px] uppercase text-brand-green/50 block">MEMBER CREDENTIAL</span>
                  <span className="font-semibold text-brand-clay font-mono">{currentUser.email}</span>
                </div>
              )}
            </div>

            {completedBookings.length === 0 && requests.length === 0 ? (
              /* EMPTY PORTFOLIO VIEW */
              <div className="text-center py-16 bg-white rounded-lg border border-brand-green/10 max-w-xl mx-auto space-y-4">
                <Ticket className="w-12 h-12 text-brand-green/20 mx-auto" />
                <p className="text-lg font-serif font-semibold">Your portfolio is currently empty.</p>
                <p className="text-xs text-brand-dark/70 max-w-sm mx-auto">
                  Log in to your corporate account, tailor a package in our catalog, and either complete a direct secure purchase or request an official proposal deck.
                </p>
                
                <div className="flex gap-3 justify-center pt-2">
                  {!currentUser && (
                    <button
                      onClick={() => { setAuthTab('signin'); setAuthModalOpen(true); }}
                      className="border border-brand-green hover:bg-brand-sand text-brand-green px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition"
                    >
                      Member Sign In
                    </button>
                  )}
                  <button 
                    onClick={() => setCurrentTab('home')}
                    className="bg-brand-green hover:bg-brand-green-light text-brand-sand px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition"
                  >
                    Browse Catalog
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                
                {/* COMPLETED BOOKINGS SECTION */}
                {completedBookings.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-brand-green/10">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <h2 className="text-lg uppercase tracking-wider font-bold">Confirmed Reservations ({completedBookings.length})</h2>
                    </div>

                    <div className="space-y-8">
                      {completedBookings.map((booking) => (
                        <div key={booking.bookingId} className="bg-white rounded-lg border border-brand-green/15 shadow-md overflow-hidden">
                          
                          {/* Booking Banner Info */}
                          <div className="bg-brand-green text-brand-sand px-5 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-brand-gold/20">
                            <div className="space-y-0.5">
                              <span className="text-[9px] uppercase tracking-widest text-brand-gold block font-semibold">RESERVATION SECURED</span>
                              <h3 className="font-serif text-lg font-bold tracking-wide text-white">{booking.experienceTitle}</h3>
                              <p className="text-[11px] text-brand-sand-dark font-light">{booking.experienceLocation} · {booking.tierName} Suite</p>
                            </div>
                            
                            <div className="flex sm:flex-col items-start sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-brand-gold/15">
                              <div className="text-xs">
                                <span className="text-[8px] text-brand-gold-light uppercase block">ORDER ID</span>
                                <span className="font-mono text-brand-gold font-bold">{booking.bookingId}</span>
                              </div>
                              <div className="text-right ml-4 sm:ml-0 text-xs">
                                <span className="text-[8px] text-brand-gold-light uppercase block">BILLING DATE</span>
                                <span className="font-medium text-white">{booking.date}</span>
                              </div>
                            </div>
                          </div>

                          {/* Guest Passes Grid */}
                          <div className="p-5 bg-brand-sand/30">
                            <span className="text-[10px] text-brand-green/50 uppercase tracking-widest font-bold block mb-4">Digital VIP Boarding Passes</span>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {booking.guestNames.map((name, idx) => {
                                const passId = `ELV-${booking.bookingId.split('-')[2]}-${100 + idx}`;
                                return (
                                  /* INDIVIDUAL BOARDING PASS */
                                  <div key={idx} className="bg-brand-sand-dark rounded-xl border border-brand-gold/20 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between">
                                    {/* Pass Header */}
                                    <div className="bg-gradient-to-r from-brand-green to-brand-green-light px-4 py-2.5 flex justify-between items-center text-brand-sand">
                                      <div className="flex flex-col">
                                        <span className="text-[7px] tracking-[0.2em] text-brand-gold font-bold uppercase">E L E V A T E</span>
                                        <span className="text-[5px] uppercase tracking-wider text-brand-sand-dark/60 font-medium">VIP Hospitality Ticket</span>
                                      </div>
                                      <span className="font-mono text-[9px] text-brand-gold-light tracking-wider font-semibold">{passId}</span>
                                    </div>

                                    {/* Pass Body */}
                                    <div className="p-4 grid grid-cols-12 gap-3 items-center">
                                      
                                      {/* Left side details (8 cols) */}
                                      <div className="col-span-8 space-y-2.5 text-[11px]">
                                        <div>
                                          <span className="text-[6px] text-brand-green/50 uppercase block font-semibold">ATTENDEE CREDENTIAL</span>
                                          <span className="font-serif text-sm font-bold text-brand-green uppercase tracking-wide truncate max-w-[200px] block">
                                            {name}
                                          </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                          <div>
                                            <span className="text-[6px] text-brand-green/50 uppercase block font-semibold">SEAT CORRIDOR</span>
                                            <span className="font-semibold text-brand-clay font-mono block">Loge 102, S-C</span>
                                          </div>
                                          <div>
                                            <span className="text-[6px] text-brand-green/50 uppercase block font-semibold">TIER SUITE</span>
                                            <span className="font-semibold block truncate">{booking.tierName}</span>
                                          </div>
                                        </div>

                                        {booking.upgradesList && booking.upgradesList.length > 0 && (
                                          <div>
                                            <span className="text-[6px] text-brand-green/50 uppercase block font-semibold mb-0.5">COMMITTED UPGRADES</span>
                                            <div className="flex flex-wrap gap-1">
                                              {booking.upgradesList.map((upg, uidx) => (
                                                <span key={uidx} className="text-[7px] font-bold text-brand-green bg-white border border-brand-green/10 rounded px-1 py-0.5 uppercase">
                                                  {upg.split(' ')[0]} {/* shortened */}
                                                </span>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      {/* Right side QR Code (4 cols) */}
                                      <div className="col-span-4 flex flex-col items-center justify-center border-l border-brand-green/10 pl-3">
                                        <div className="w-16 h-16 bg-white border border-brand-green/15 rounded flex items-center justify-center p-1.5 shadow-inner">
                                          {/* Styled vector-like representation of a secure premium QR Code */}
                                          <div className="w-full h-full relative grid grid-cols-3 gap-0.5 opacity-90">
                                            <div className="bg-brand-green border-[1.5px] border-white"></div>
                                            <div className="bg-brand-green border-[1.5px] border-white"></div>
                                            <div className="bg-transparent"></div>
                                            <div className="bg-transparent"></div>
                                            <div className="bg-brand-green border-[1.5px] border-white"></div>
                                            <div className="bg-brand-green border-[1.5px] border-white"></div>
                                            <div className="bg-brand-green border-[1.5px] border-white"></div>
                                            <div className="bg-transparent"></div>
                                            <div className="bg-brand-green border-[1.5px] border-white"></div>
                                          </div>
                                        </div>
                                        <span className="text-[5px] text-brand-green/50 mt-1 uppercase font-bold tracking-wider">SCAN GATE</span>
                                      </div>

                                    </div>

                                    {/* Pass Footer */}
                                    <div className="bg-white border-t border-brand-green/5 px-4 py-2 flex justify-between items-center text-[9px] text-brand-green/75">
                                      <span className="font-light truncate max-w-[140px]">{booking.experienceLocation}</span>
                                      <button
                                        type="button"
                                        onClick={() => alert(`Simulating PDF ticket download for ${name}. (Pass ID: ${passId})`)}
                                        className="text-brand-clay hover:text-brand-clay-dark font-bold uppercase tracking-wider flex items-center gap-0.5"
                                      >
                                        <Download className="w-2.5 h-2.5" />
                                        <span>Download PDF</span>
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Booking Details Footer */}
                          <div className="bg-brand-sand-dark px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                            <div className="space-y-1">
                              <p className="font-semibold flex items-center gap-1.5 text-brand-green">
                                <ShieldCheck className="w-4 h-4 text-brand-gold fill-brand-gold/20" />
                                <span>Official Debenture Seats Guaranteed</span>
                              </p>
                              <p className="text-brand-green/75 font-light">
                                Authenticated transaction via {booking.paymentCard}. Digital badges issued. Your dedicated concierge has emailed you the full itinerary.
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => alert(`Printing invoice receipt for reservation ${booking.bookingId}`)}
                              className="border border-brand-green/15 text-brand-green hover:bg-brand-sand hover:border-brand-green px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition shrink-0"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Receipt Invoice</span>
                            </button>
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PENDING REQUESTS LOG SECTION */}
                {requests.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-brand-green/10">
                      <Clock className="w-5 h-5 text-brand-clay" />
                      <h2 className="text-lg uppercase tracking-wider font-bold">Active Proposal Quotes & Inquiry Logs ({requests.length})</h2>
                    </div>

                    <div className="space-y-8">
                      {requests.map((req) => (
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
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        )}

        {/* VIEW 7: ADMIN/MANAGEMENT CONSOLE */}
        {currentTab === 'admin' && currentUser?.isAdmin && (
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-fadeIn text-brand-green">
            
            {/* Header section with KPIs */}
            <div className="space-y-3 pb-6 border-b border-brand-green/10 mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-wide">
                    Sovereign Management Console
                  </h1>
                  <p className="text-xs text-brand-green/60 uppercase tracking-widest mt-1">
                    Configure official experiences catalog, track premium transactions, and process concierge proposals
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setAdminSubTab('events')}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition ${adminSubTab === 'events' ? 'bg-brand-green text-brand-sand shadow' : 'bg-brand-sand-dark text-brand-green hover:bg-brand-sand'}`}
                  >
                    Experiences Configurator
                  </button>
                  <button
                    onClick={() => setAdminSubTab('purchases')}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition ${adminSubTab === 'purchases' ? 'bg-brand-green text-brand-sand shadow' : 'bg-brand-sand-dark text-brand-green hover:bg-brand-sand'}`}
                  >
                    Purchase & Quote Tracker
                  </button>
                  <button
                    onClick={() => setAdminSubTab('upgrades')}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition ${adminSubTab === 'upgrades' ? 'bg-brand-green text-brand-sand shadow' : 'bg-brand-sand-dark text-brand-green hover:bg-brand-sand'}`}
                  >
                    Premium Additions & Upgrades
                  </button>
                </div>
              </div>

              {/* STATS HIGHLIGHTS BAR */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                <div className="bg-white p-4 rounded border border-brand-green/10 text-center space-y-1">
                  <span className="text-[10px] text-brand-green/50 uppercase block font-bold">TOTAL RESERVATIONS REVENUE</span>
                  <p className="font-serif text-2xl font-bold text-brand-clay font-mono">
                    £{completedBookings.reduce((acc, curr) => acc + curr.total, 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-white p-4 rounded border border-brand-green/10 text-center space-y-1">
                  <span className="text-[10px] text-brand-green/50 uppercase block font-bold">VIP ATTENDEES SECURED</span>
                  <p className="font-serif text-2xl font-bold text-brand-green font-mono">
                    {completedBookings.reduce((acc, curr) => acc + curr.guests, 0)} Passengers
                  </p>
                </div>
                <div className="bg-white p-4 rounded border border-brand-green/10 text-center space-y-1">
                  <span className="text-[10px] text-brand-green/50 uppercase block font-bold">ACTIVE PROPOSALS LOGGED</span>
                  <p className="font-serif text-2xl font-bold text-[#3b82f6] font-mono">
                    {requests.length} Quotes
                  </p>
                </div>
                <div className="bg-white p-4 rounded border border-brand-green/10 text-center space-y-1">
                  <span className="text-[10px] text-brand-green/50 uppercase block font-bold">OFFICIAL CATALOG LISTINGS</span>
                  <p className="font-serif text-2xl font-bold text-brand-gold font-mono">
                    {experiencesList.length} Active Events
                  </p>
                </div>
              </div>
            </div>

            {/* TAB 1: EXPERIENCES CONFIGURATOR (ADD/EDIT EVENTS) */}
            {adminSubTab === 'events' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* CONFIGURATOR FORM (5 cols) */}
                <div className="lg:col-span-5 bg-white p-6 rounded-lg border border-brand-green/15 shadow-md space-y-4">
                  <div>
                    <h3 className="font-serif text-lg font-bold">
                      {editingEventId ? 'Modify Event Settings' : 'Publish New Luxury Event'}
                    </h3>
                    <p className="text-[11px] text-brand-green/60">
                      Configure seat allotments, description assets, and pricing tier benefits
                    </p>
                  </div>

                  <form onSubmit={handleSaveEvent} className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">Event Title *</span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Roland Garros, Super Bowl"
                        value={adminEventForm.title}
                        onChange={(e) => setAdminEventForm({ ...adminEventForm, title: e.target.value })}
                        className="w-full bg-brand-sand-dark border border-brand-green/10 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-gold text-brand-dark"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">Category Focus *</span>
                        <select
                          value={adminEventForm.category}
                          onChange={(e) => setAdminEventForm({ ...adminEventForm, category: e.target.value as any })}
                          className="w-full bg-brand-sand-dark border border-brand-green/10 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-gold text-brand-green font-medium"
                        >
                          <option value="Tennis">Tennis</option>
                          <option value="Motorsport">Motorsport</option>
                          <option value="Football">Football</option>
                          <option value="Music">Music</option>
                          <option value="Festival">Festival (Music)</option>
                          <option value="Live Band">Live Band (Music)</option>
                          <option value="Golf">Golf</option>
                          <option value="Rugby">Rugby</option>
                          <option value="Basketball">Basketball</option>
                          <option value="Cricket">Cricket</option>
                          <option value="Heritage">Heritage</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">Event Dates *</span>
                        <input
                          type="text"
                          required
                          placeholder="e.g. May 24 – June 7, 2026"
                          value={adminEventForm.dates}
                          onChange={(e) => setAdminEventForm({ ...adminEventForm, dates: e.target.value })}
                          className="w-full bg-brand-sand-dark border border-brand-green/10 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-gold text-brand-dark"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">City & Country *</span>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Paris, France"
                          value={adminEventForm.location}
                          onChange={(e) => setAdminEventForm({ ...adminEventForm, location: e.target.value })}
                          className="w-full bg-brand-sand-dark border border-brand-green/10 rounded px-3 py-2 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">Arena / Venue *</span>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Stade de France"
                          value={adminEventForm.venue}
                          onChange={(e) => setAdminEventForm({ ...adminEventForm, venue: e.target.value })}
                          className="w-full bg-brand-sand-dark border border-brand-green/10 rounded px-3 py-2 text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">Luxury Tagline</span>
                        <input
                          type="text"
                          placeholder="e.g. L’Art de Vivre d’Élite"
                          value={adminEventForm.tagline}
                          onChange={(e) => setAdminEventForm({ ...adminEventForm, tagline: e.target.value })}
                          className="w-full bg-brand-sand-dark border border-brand-green/10 rounded px-3 py-2 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">Highlight Benefit</span>
                        <input
                          type="text"
                          placeholder="e.g. Michelin lunch, Category 1 seat"
                          value={adminEventForm.highlightBenefit}
                          onChange={(e) => setAdminEventForm({ ...adminEventForm, highlightBenefit: e.target.value })}
                          className="w-full bg-brand-sand-dark border border-brand-green/10 rounded px-3 py-2 text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">Image URL Reference</span>
                      <input
                        type="text"
                        placeholder="/assets/images/elevate_hero_1791372544717.jpg"
                        value={adminEventForm.image}
                        onChange={(e) => setAdminEventForm({ ...adminEventForm, image: e.target.value })}
                        className="w-full bg-brand-sand-dark border border-brand-green/10 rounded px-3 py-2 text-xs focus:outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">Short Editorial Description</span>
                      <textarea
                        rows={2}
                        placeholder="Provide a glossy, high-end short overview for the event card..."
                        value={adminEventForm.shortDescription}
                        onChange={(e) => setAdminEventForm({ ...adminEventForm, shortDescription: e.target.value })}
                        className="w-full bg-brand-sand-dark border border-brand-green/10 rounded p-2 text-xs focus:outline-none resize-none"
                      />
                    </div>

                    {/* DYNAMIC PRICING TIERS CONFIG */}
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">Hospitality Package Tiers ({adminEventPackages.length}) *</span>
                        <button
                          type="button"
                          onClick={() => setAdminEventPackages([
                            ...adminEventPackages,
                            { name: 'New Luxury Tier', price: 1000, benefits: ['Category 1 seats', 'Gourmet hospitality lounge'], description: 'A bespoke hospitality package with premium inclusion allotments.' }
                          ])}
                          className="bg-brand-gold/15 text-brand-gold hover:bg-brand-gold/25 border border-brand-gold/30 text-[9px] uppercase font-bold px-2.5 py-1 rounded-sm transition"
                        >
                          + Add Package Tier
                        </button>
                      </div>

                      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                        {adminEventPackages.map((tier, index) => (
                          <div key={index} className="p-3 bg-brand-sand-dark rounded border border-brand-gold/25 space-y-2 relative">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] uppercase tracking-wider font-bold text-brand-green block">Tier {index + 1} Settings</span>
                              {adminEventPackages.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => setAdminEventPackages(adminEventPackages.filter((_, i) => i !== index))}
                                  className="text-[9px] uppercase tracking-wider font-bold text-brand-clay hover:text-brand-clay-dark"
                                >
                                  Remove Tier
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <span className="text-[8px] text-brand-green/60 uppercase block font-semibold mb-0.5">Tier Name</span>
                                <input
                                  type="text"
                                  required
                                  placeholder="e.g. Pavilion Club"
                                  value={tier.name}
                                  onChange={(e) => {
                                    const updated = [...adminEventPackages];
                                    updated[index] = { ...updated[index], name: e.target.value };
                                    setAdminEventPackages(updated);
                                  }}
                                  className="w-full bg-white border border-brand-green/10 rounded px-2.5 py-1 text-xs text-brand-dark"
                                />
                              </div>
                              <div>
                                <span className="text-[8px] text-brand-green/60 uppercase block font-semibold mb-0.5">Price in GBP (£)</span>
                                <input
                                  type="number"
                                  required
                                  placeholder="e.g. 750"
                                  value={tier.price}
                                  onChange={(e) => {
                                    const updated = [...adminEventPackages];
                                    updated[index] = { ...updated[index], price: Number(e.target.value) };
                                    setAdminEventPackages(updated);
                                  }}
                                  className="w-full bg-white border border-brand-green/10 rounded px-2.5 py-1 text-xs font-mono text-brand-dark"
                                />
                              </div>
                            </div>

                            <div>
                              <span className="text-[8px] text-brand-green/60 uppercase block font-semibold mb-0.5">Short Description</span>
                              <input
                                type="text"
                                required
                                placeholder="Pinnacle of luxury hospitality..."
                                value={tier.description}
                                onChange={(e) => {
                                    const updated = [...adminEventPackages];
                                    updated[index] = { ...updated[index], description: e.target.value };
                                    setAdminEventPackages(updated);
                                }}
                                className="w-full bg-white border border-brand-green/10 rounded px-2.5 py-1 text-xs text-brand-dark"
                              />
                            </div>

                            <div>
                              <span className="text-[8px] text-brand-green/60 uppercase block font-semibold mb-0.5">Benefits (comma separated)</span>
                              <input
                                type="text"
                                required
                                placeholder="Luxury catering, Front-row loge, Helicopter access"
                                value={tier.benefits.join(', ')}
                                onChange={(e) => {
                                    const updated = [...adminEventPackages];
                                    updated[index] = { ...updated[index], benefits: e.target.value.split(',').map(b => b.trim()).filter(Boolean) };
                                    setAdminEventPackages(updated);
                                }}
                                className="w-full bg-white border border-brand-green/10 rounded px-2.5 py-1 text-xs text-brand-dark"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* DYNAMIC PREMIUM UPGRADES SELECTOR */}
                    <div className="space-y-2 pt-2 border-t border-brand-green/10">
                      <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">Available Premium Additions & Upgrades</span>
                      <p className="text-[9px] text-brand-green/50 mb-2">Select which premium additions are offered for this specific event. If none are checked, all premium additions are active by default.</p>
                      
                      <div className="grid grid-cols-1 gap-2 bg-brand-sand-dark p-3 rounded border border-brand-green/15 max-h-48 overflow-y-auto">
                        {globalUpgrades.map((upg) => {
                          const isChecked = adminEventUpgrades.includes(upg.id);
                          return (
                            <label key={upg.id} className="flex items-center gap-2 text-[11px] font-medium text-brand-green cursor-pointer p-1.5 rounded hover:bg-brand-sand-dark/50 transition">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  if (isChecked) {
                                    setAdminEventUpgrades(adminEventUpgrades.filter(id => id !== upg.id));
                                  } else {
                                    setAdminEventUpgrades([...adminEventUpgrades, upg.id]);
                                  }
                                }}
                                className="rounded border-brand-green/20 text-brand-clay focus:ring-brand-gold w-3.5 h-3.5"
                              />
                              <div className="flex flex-col">
                                <span className="font-semibold text-xs">{upg.name}</span>
                                <span className="text-[9px] text-brand-green/60">£{upg.cost} / guest</span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex gap-2.5 pt-1">
                      {editingEventId && (
                        <button
                          type="button"
                          onClick={handleResetEventForm}
                          className="w-1/3 border border-brand-green/15 text-brand-green text-xs font-bold uppercase py-3 rounded-sm hover:bg-brand-sand transition"
                        >
                          Clear
                        </button>
                      )}
                      <button
                        type="submit"
                        className="w-full bg-brand-clay hover:bg-brand-clay-dark text-white font-bold text-xs uppercase tracking-widest py-3 rounded-sm shadow transition duration-200"
                      >
                        {editingEventId ? 'Update Event Settings' : 'Publish & Sync Event'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* CURRENT CATALOG TABLE (7 cols) */}
                <div className="lg:col-span-7 bg-white rounded-lg border border-brand-green/10 shadow-md overflow-hidden">
                  <div className="bg-brand-sand-dark p-4 border-b border-brand-green/10 flex justify-between items-center">
                    <span className="text-xs uppercase tracking-widest font-bold">Active Catalog Listings ({experiencesList.length})</span>
                    <span className="text-[10px] text-brand-green/60 uppercase">Drives client portal live data</span>
                  </div>

                  <div className="divide-y divide-brand-green/10 max-h-[750px] overflow-y-auto">
                    {experiencesList.map((exp) => (
                      <div key={exp.id} className="p-4 flex justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={exp.image}
                            alt={exp.title}
                            className="w-12 h-12 object-cover rounded border border-brand-green/5 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="space-y-0.5">
                            <span className="text-[8px] bg-brand-green/10 text-brand-green px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">
                              {exp.category}
                            </span>
                            <h4 className="font-serif text-sm font-bold text-brand-green">{exp.title}</h4>
                            <p className="text-[10px] text-brand-green/60">{exp.venue}, {exp.location}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleEditEventStart(exp)}
                            className="bg-brand-sand hover:bg-brand-gold-light/20 text-brand-green border border-brand-green/10 rounded px-3 py-1.5 text-xs font-bold transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(exp.id)}
                            className="bg-red-50 hover:bg-red-100 text-brand-clay border border-brand-clay/10 rounded px-3 py-1.5 text-xs font-bold transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: PREMIUM ADDITIONS & UPGRADES CONFIGURATOR */}
            {adminSubTab === 'upgrades' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* CONFIGURATOR FORM (5 cols) */}
                <div className="lg:col-span-5 bg-white p-6 rounded-lg border border-brand-green/15 shadow-md space-y-4">
                  <div>
                    <h3 className="font-serif text-lg font-bold">
                      {editingUpgradeId ? 'Modify Premium Upgrade' : 'Create Custom VIP Upgrade'}
                    </h3>
                    <p className="text-[11px] text-brand-green/60">
                      Configure dynamic customer inclusions and real-time live cost additions
                    </p>
                  </div>

                  <form onSubmit={handleSaveUpgrade} className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">Upgrade / Addition Name *</span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. VIP Helicopter Transfer, Private Box Champagne Host"
                        value={adminUpgradeForm.name}
                        onChange={(e) => setAdminUpgradeForm({ ...adminUpgradeForm, name: e.target.value })}
                        className="w-full bg-brand-sand-dark border border-brand-green/10 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-gold text-brand-dark"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">Cost per Guest (£) *</span>
                        <input
                          type="number"
                          required
                          min="0"
                          placeholder="e.g. 250"
                          value={adminUpgradeForm.cost}
                          onChange={(e) => setAdminUpgradeForm({ ...adminUpgradeForm, cost: Number(e.target.value) })}
                          className="w-full bg-brand-sand-dark border border-brand-green/10 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-gold text-brand-dark font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">Inclusion Icon *</span>
                        <select
                          value={adminUpgradeForm.icon}
                          onChange={(e) => setAdminUpgradeForm({ ...adminUpgradeForm, icon: e.target.value as any })}
                          className="w-full bg-brand-sand-dark border border-brand-green/10 rounded px-2.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-gold text-brand-green font-medium"
                        >
                          <option value="Car">Car (Chauffeur, Transfer)</option>
                          <option value="Plane">Plane (Helicopter, Flight)</option>
                          <option value="Wine">Wine (Michelin Food, Drinks)</option>
                          <option value="ShieldCheck">ShieldCheck (Security, Guard)</option>
                          <option value="Briefcase">Briefcase (Branding, Corporate)</option>
                          <option value="Coffee">Coffee (General Lounge, Valet)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">Upgrade Description / Inclusions *</span>
                      <textarea
                        rows={3}
                        required
                        placeholder="Detail the luxury inclusions provided by this option. E.g. Personal host, meet & greets..."
                        value={adminUpgradeForm.description}
                        onChange={(e) => setAdminUpgradeForm({ ...adminUpgradeForm, description: e.target.value })}
                        className="w-full bg-brand-sand-dark border border-brand-green/10 rounded p-2 text-xs focus:outline-none resize-none text-brand-dark"
                      />
                    </div>

                    <div className="flex gap-2.5 pt-1">
                      {editingUpgradeId && (
                        <button
                          type="button"
                          onClick={handleResetUpgradeForm}
                          className="w-1/3 border border-brand-green/15 text-brand-green text-xs font-bold uppercase py-3 rounded-sm hover:bg-brand-sand transition"
                        >
                          Clear
                        </button>
                      )}
                      <button
                        type="submit"
                        className="w-full bg-brand-gold text-brand-green hover:bg-brand-gold-light font-bold text-xs uppercase tracking-widest py-3 rounded-sm shadow transition duration-200"
                      >
                        {editingUpgradeId ? 'Update Upgrade Item' : 'Publish & Enable Upgrade'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* CURRENT UPGRADES LIST (7 cols) */}
                <div className="lg:col-span-7 bg-white rounded-lg border border-brand-green/10 shadow-md overflow-hidden animate-fadeIn">
                  <div className="bg-brand-sand-dark p-4 border-b border-brand-green/10 flex justify-between items-center">
                    <span className="text-xs uppercase tracking-widest font-bold">Active Premium Upgrades & Additions ({globalUpgrades.length})</span>
                    <span className="text-[10px] text-brand-green/60 uppercase">Injects customizers in real-time</span>
                  </div>

                  <div className="divide-y divide-brand-green/10 max-h-[750px] overflow-y-auto">
                    {globalUpgrades.map((upg) => {
                      const IconComponent = upg.icon === 'Car' ? Car 
                        : upg.icon === 'Plane' ? Plane 
                        : upg.icon === 'Wine' ? Wine 
                        : upg.icon === 'ShieldCheck' ? ShieldCheck 
                        : upg.icon === 'Briefcase' ? Briefcase 
                        : Coffee;

                      return (
                        <div key={upg.id} className="p-4 flex justify-between items-center gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-sand flex items-center justify-center border border-brand-green/10 text-brand-clay shrink-0">
                              <IconComponent className="w-5 h-5 text-brand-clay" />
                            </div>
                            <div className="space-y-0.5">
                              <h4 className="font-serif text-sm font-bold text-brand-green">{upg.name}</h4>
                              <p className="text-[11px] text-brand-green/60">{upg.description}</p>
                              <span className="font-mono text-xs text-brand-clay font-bold block mt-1">£{upg.cost} / guest</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => handleEditUpgradeStart(upg)}
                              className="bg-brand-sand hover:bg-brand-gold-light/20 text-brand-green border border-brand-green/10 rounded px-3 py-1.5 text-xs font-bold transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteUpgrade(upg.id)}
                              className="bg-red-50 hover:bg-red-100 text-brand-clay border border-brand-clay/10 rounded px-3 py-1.5 text-xs font-bold transition"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: PURCHASE & REQUEST TRACKER (DETAILED LISTS) */}
            {adminSubTab === 'purchases' && (
              <div className="space-y-10 animate-fadeIn">
                
                {/* 1. CONFIRMED DIRECT CLIENT PURCHASES */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-brand-green/10 pb-2">
                    <h3 className="text-base uppercase tracking-wider font-bold text-brand-green">Confirmed Client Purchases ({completedBookings.length})</h3>
                    <span className="text-[10px] text-brand-green/60 uppercase">Direct Secure Checkout Transactions</span>
                  </div>

                  {completedBookings.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded border border-brand-green/10 text-xs italic text-brand-green/60">
                      No customer transactions recorded yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {completedBookings.map((booking) => (
                        <div key={booking.bookingId} className="bg-white rounded border border-brand-green/15 overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center">
                          <div className="md:col-span-4 space-y-1">
                            <span className="text-[9px] font-mono text-brand-gold font-bold">{booking.bookingId} · Confirmed</span>
                            <h4 className="font-serif text-base font-bold text-brand-green leading-snug">{booking.experienceTitle}</h4>
                            <p className="text-xs text-brand-green/75">Suite: <strong className="text-brand-clay font-medium">{booking.tierName}</strong></p>
                          </div>

                          <div className="md:col-span-3 space-y-1 text-xs">
                            <span className="text-[8px] text-brand-green/50 uppercase block font-semibold">ATTENDEE ROSTER ({booking.guests})</span>
                            <div className="text-brand-dark/80 text-[11px] truncate max-w-[200px]">
                              {booking.guestNames.join(', ')}
                            </div>
                          </div>

                          <div className="md:col-span-3 space-y-1 text-xs">
                            <span className="text-[8px] text-brand-green/50 uppercase block font-semibold">BILLING & PAYMENT DETAILS</span>
                            <p className="font-medium text-brand-green font-mono">{booking.paymentCard}</p>
                            <p className="text-[10px] text-brand-green/60">Processed on {booking.date}</p>
                          </div>

                          <div className="md:col-span-2 text-left md:text-right shrink-0">
                            <span className="text-[8px] text-brand-green/50 uppercase block font-semibold">TARIFF CHARGED</span>
                            <span className="font-mono text-base font-bold text-brand-clay">£{booking.total.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. PENDING REQUESTS QUOTES (ADMIN CAN INTERACTIVELY ADVANCE STATUS!) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-brand-green/10 pb-2">
                    <h3 className="text-base uppercase tracking-wider font-bold text-brand-green">Corporate Proposals & Passive Quotes ({requests.length})</h3>
                    <span className="text-[10px] text-brand-green/60 uppercase"> concierge can advance status interactively</span>
                  </div>

                  {requests.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded border border-brand-green/10 text-xs italic text-brand-green/60">
                      No concierge proposals logged.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {requests.map((req) => (
                        <div key={req.requestId} className="bg-white rounded border border-brand-green/15 overflow-hidden shadow-sm p-5 space-y-4">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-brand-green/5">
                            <div className="space-y-1">
                              <span className="bg-brand-sand-dark text-brand-green text-[10px] font-mono px-2 py-0.5 rounded font-bold">{req.requestId}</span>
                              <h4 className="font-serif text-base font-bold text-brand-green">{req.companyName}</h4>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="text-xs">
                                <span className="text-[8px] text-brand-green/50 uppercase block font-semibold">Inquiry Status</span>
                                <select
                                  value={req.status}
                                  onChange={(e) => {
                                    const nextStatus = e.target.value as any;
                                    setRequests(prev => prev.map(r => r.requestId === req.requestId ? { ...r, status: nextStatus } : r));
                                  }}
                                  className="bg-brand-sand-dark border border-brand-green/10 rounded px-2.5 py-1 text-xs font-semibold text-brand-green focus:outline-none"
                                >
                                  <option value="Awaiting Agent">Awaiting Agent</option>
                                  <option value="Proposal Ready">Proposal Ready</option>
                                  <option value="Confirmed">Confirmed</option>
                                </select>
                              </div>

                              <div className="text-right text-xs">
                                <span className="text-[8px] text-brand-green/50 block uppercase">SUBMITTED ON</span>
                                <span className="font-medium text-brand-green">{req.date}</span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                            <div className="space-y-1.5">
                              <span className="text-[8px] text-brand-green/50 uppercase block font-semibold">Line Items Shortlisted</span>
                              {req.items.map((it, idx) => (
                                <p key={idx} className="font-medium">
                                  {it.experienceTitle} ({it.guests} Guests) - <span className="font-mono text-brand-clay font-bold">£{it.total.toLocaleString()}</span>
                                </p>
                              ))}
                            </div>

                            <div className="space-y-1.5">
                              <span className="text-[8px] text-brand-green/50 uppercase block font-semibold">Corporate Representative</span>
                              <p className="font-medium">{req.contactName}</p>
                              <p className="text-brand-green/75">{req.email} · {req.phone}</p>
                            </div>

                            <div className="space-y-1.5">
                              <span className="text-[8px] text-brand-green/50 uppercase block font-semibold">Special Directives / Notes</span>
                              <p className="italic font-light text-brand-dark/85 leading-relaxed">
                                "{req.vipNotes || 'No special directives logged.'}"
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

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

      {/* MEMBER ACCESS (AUTH) MODAL */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-lg bg-white overflow-hidden shadow-2xl border border-brand-gold/45 text-brand-green flex flex-col">
            
            {/* Modal Brand Banner */}
            <div className="bg-brand-green p-6 text-brand-sand border-b border-brand-gold/30 flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] tracking-[0.25em] text-brand-gold uppercase font-semibold">E L E V A T E</span>
                  <span className="text-[7px] text-brand-gold-light/60 uppercase">MEMBER PORTAL</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-white">
                  {authTab === 'signin' ? 'Verify Account Access' : 'Create Member Profile'}
                </h3>
                <p className="text-[11px] text-brand-sand-dark/80 font-light">
                  {authTab === 'signin' ? 'Enter corporate credentials to authorize elite seat orders' : 'Establish verified portfolio identity and booking credentials'}
                </p>
              </div>
              <button 
                onClick={() => { setAuthModalOpen(false); setAuthError(''); }}
                className="p-1.5 hover:bg-brand-green-light text-brand-gold-light hover:text-brand-clay rounded-full transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body & Forms */}
            <div className="p-6 space-y-4">
              
              {/* Tabs Switcher */}
              <div className="flex bg-brand-sand-dark p-1 rounded border border-brand-green/5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => { setAuthTab('signin'); setAuthError(''); }}
                  className={`w-1/2 py-2 text-center rounded transition ${authTab === 'signin' ? 'bg-brand-green text-brand-sand shadow-sm' : 'text-brand-green/60 hover:text-brand-green'}`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthTab('signup'); setAuthError(''); }}
                  className={`w-1/2 py-2 text-center rounded transition ${authTab === 'signup' ? 'bg-brand-green text-brand-sand shadow-sm' : 'text-brand-green/60 hover:text-brand-green'}`}
                >
                  Create Profile
                </button>
              </div>

              {authError && (
                <div className="bg-red-50 border-l-2 border-brand-clay p-3 rounded-sm text-[11px] text-brand-clay font-medium leading-relaxed">
                  {authError}
                </div>
              )}

              {authTab === 'signin' ? (
                /* SIGN IN FORM */
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">Corporate Email Address</span>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 w-4 h-4 text-brand-green/40" />
                      <input
                        type="email"
                        required
                        placeholder="e.g. corporate@client.com"
                        value={authForm.email}
                        onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                        className="w-full bg-brand-sand-dark border border-brand-green/10 rounded pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-gold text-brand-dark"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">Security Access PIN</span>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 w-4 h-4 text-brand-green/40" />
                      <input
                        type="password"
                        required
                        placeholder="Enter 4-digit PIN or password"
                        value={authForm.password}
                        onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                        className="w-full bg-brand-sand-dark border border-brand-green/10 rounded pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-gold text-brand-dark font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-green hover:bg-brand-green-light text-brand-sand font-bold text-xs uppercase tracking-widest py-3 rounded-sm shadow transition duration-200"
                  >
                    Authenticate Membership
                  </button>
                </form>
              ) : (
                /* SIGN UP FORM */
                <form onSubmit={handleSignUp} className="space-y-3.5">
                  <div className="space-y-1">
                    <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">Initiator Full Name *</span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jean-Luc Laurent"
                      value={authForm.name}
                      onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                      className="w-full bg-brand-sand-dark border border-brand-green/10 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-gold text-brand-dark"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">Corporate Email Address *</span>
                    <input
                      type="email"
                      required
                      placeholder="corporate@client.com"
                      value={authForm.email}
                      onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                      className="w-full bg-brand-sand-dark border border-brand-green/10 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-gold text-brand-dark"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">Company Name</span>
                      <input
                        type="text"
                        placeholder="e.g. Vanguard Partners"
                        value={authForm.company}
                        onChange={(e) => setAuthForm({ ...authForm, company: e.target.value })}
                        className="w-full bg-brand-sand-dark border border-brand-green/10 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-gold text-brand-dark"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">Corporate Telephone</span>
                      <input
                        type="tel"
                        placeholder="e.g. +33 1 42..."
                        value={authForm.phone}
                        onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })}
                        className="w-full bg-brand-sand-dark border border-brand-green/10 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-gold text-brand-dark"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-brand-green/70 uppercase block font-semibold">Create Security PIN *</span>
                    <input
                      type="password"
                      required
                      placeholder="Choose 4-digit PIN or password"
                      value={authForm.password}
                      onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                      className="w-full bg-brand-sand-dark border border-brand-green/10 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-gold text-brand-dark font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-clay hover:bg-brand-clay-dark text-white font-bold text-xs uppercase tracking-widest py-3 rounded-sm shadow transition duration-200 mt-2"
                  >
                    Establish Luxury Membership
                  </button>
                </form>
              )}

              {/* DEMO / TEST CREDENTIAL INDICATOR (High usability) */}
              <div className="mt-4 p-3 bg-brand-sand-dark rounded border border-brand-gold/20 text-[10px] space-y-1 text-brand-green">
                <span className="font-bold text-brand-clay uppercase block tracking-wider">Instant System Testing Credentials:</span>
                <p>To avoid filling forms, login instantly with our seeded corporate account:</p>
                <div className="font-mono text-xs pt-1 flex justify-between">
                  <span>Email: <strong className="text-brand-green">soentechnologies@gmail.com</strong></span>
                  <span>Access PIN: <strong className="text-brand-green">1234</strong></span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
