export interface PackageTier {
  name: string;
  price: number;
  badge?: string;
  benefits: string[];
  description: string;
}

export interface Experience {
  id: string;
  title: string;
  category: 'Tennis' | 'Motorsport' | 'Football' | 'Music' | 'Golf' | 'Heritage' | 'Rugby' | 'Basketball';
  location: string;
  venue: string;
  dates: string;
  image: string;
  shortDescription: string;
  description: string;
  highlightBenefit: string;
  tagline: string;
  packages: PackageTier[];
}

export const EXPERIENCES: Experience[] = [
  {
    id: 'roland-garros',
    title: 'Roland Garros Tournament',
    category: 'Tennis',
    location: 'Paris, France',
    venue: 'Stade Roland Garros',
    dates: 'May 24 – June 7, 2026',
    image: '/assets/images/tennis_event_1791372556153.jpg',
    tagline: 'L’Art de Vivre sur Terre Battue',
    shortDescription: 'Witness tennis history under the Parisian sun with official clay-court hospitality of unmatched prestige.',
    description: 'Immerse yourself in the authentic atmosphere of French elegance. Roland Garros hospitality merges legendary tennis battles with high Parisian gastronomy. Watch top global players slide on the iconic ochre clay from your prime Court Philippe-Chatrier seating, and network in lounges decorated in rich forest green, bronze, and warm clay.',
    highlightBenefit: 'Michelin-starred multi-course lunch paired with vintage champagne & premium Court Philippe-Chatrier category 1 seating.',
    packages: [
      {
        name: 'The Pavilion Club',
        price: 950,
        benefits: [
          'Category 1 seating on Court Philippe-Chatrier',
          'Gourmet buffet lunch by celebrated chefs',
          'Complimentary bar of premium wine, beer & soft drinks',
          'Dedicated VIP entrance and welcome hostess service',
          'Official tournament souvenir gift and program booklet'
        ],
        description: 'Perfect for active sports enthusiasts who want an elegant social setting and guaranteed prime views of the matches.'
      },
      {
        name: 'La Terrasse d’Or',
        price: 1850,
        badge: 'Most Popular',
        benefits: [
          'Premium Box Seating (Loges) closer to the court action',
          'Multi-course sit-down gourmet lunch curated by a Michelin-Starred Guest Chef',
          'All-day flowing vintage Champagne, fine French wines & cocktails',
          'Exclusive access to a beautiful tree-lined terrace lounge',
          'Q&A sessions with tennis legends & tennis analysts'
        ],
        description: 'Our signature experience, combining French culinary art with premium seat views, ideal for corporate entertaining.'
      },
      {
        name: 'The President’s Suite',
        price: 3400,
        badge: 'Ultra-Exclusive',
        benefits: [
          'Front-row VIP Box (Loge) on Court Philippe-Chatrier or Court Suzanne-Lenglen',
          'Ultra-private suite with dedicated butler and customized branding options',
          'Five-course bespoke degustation menu prepared by a private chef',
          'Rare vintage champagne, prestige Bordeaux, and custom mixology',
          'Chauffeur transfer within Paris & backstage tournament tour'
        ],
        description: 'The pinnacle of global tennis hospitality. Reserved for those who demand the absolute ultimate in privacy, prestige, and custom service.'
      }
    ]
  },
  {
    id: 'monaco-gp',
    title: 'Monaco Formula 1 Grand Prix',
    category: 'Motorsport',
    location: 'Monte Carlo, Monaco',
    venue: 'Circuit de Monaco',
    dates: 'May 21 – May 24, 2026',
    image: '/assets/images/f1_event_1791372569144.jpg',
    tagline: 'High-Octane Glamour on the Côte d’Azur',
    shortDescription: 'The ultimate bucket-list race, viewed from multi-deck luxury superyachts or high-altitude penthouse balconies.',
    description: 'Experience the world’s most prestigious motorsport spectacle. Watch the Formula 1 cars rush through the narrow streets of Monte Carlo at blistering speeds. Sip chilled champagne with the global elite from a multi-deck mega yacht docked in Port Hercule, or enjoy panoramic views from a penthouse terrace overlooking the famous Ste Devote corner and the harbor.',
    highlightBenefit: 'Exclusive harbor yacht access with open bar, DJ sets, celebrity hosts, and clear close-ups of the race track.',
    packages: [
      {
        name: 'Harbor Penthouse Terrace',
        price: 1200,
        benefits: [
          'High-altitude, double-aspect panoramic views of the start/finish straight',
          'Premium buffet dining featuring fresh Mediterranean seafood',
          'All-day open bar of fine French wines, spirits, and beers',
          'Live large screen race commentary and timing feeds',
          'VIP access passes for Monte Carlo elevator shortcuts'
        ],
        description: 'Enjoy sweeping panoramic views of 60% of the circuit from an airy, elevated terrace perfect for tracking race strategy.'
      },
      {
        name: 'Superyacht VIP Deck',
        price: 2600,
        badge: 'Highly Requested',
        benefits: [
          'Aboard a 45-meter luxury yacht docked trackside between Tabac & Chicane',
          'Gourmet hot & cold canapés and freshly prepared main courses',
          'Unlimited premium Champagne, signature F1 cocktails & mocktails',
          'Meet & Greet with a former F1 driver or racing presenter',
          'Live DJ entertainment and post-qualifying yacht party access'
        ],
        description: 'The definitive Monaco F1 experience. Feel the rumble of the engines as cars speed past just meters away at eye-level.'
      },
      {
        name: 'Royal Box & Paddock Club',
        price: 4950,
        badge: 'VIP Elite',
        benefits: [
          'Official Formula 1 Paddock Club access with Pit Lane walks',
          'Luxury viewing directly above the F1 team garages and start grid',
          'Caviar reception and bespoke fine dining throughout the weekend',
          'Invitations to F1 driver briefing rooms and private paddock tours',
          'Helicopter transfers from Nice Côte d’Azur airport'
        ],
        description: 'Step into the inner sanctum of motorsport. Unrivaled inside access combined with the highest standard of international catering.'
      }
    ]
  },
  {
    id: 'wembley-concerts',
    title: 'Wembley VIP Concert Suites',
    category: 'Music',
    location: 'London, United Kingdom',
    venue: 'Wembley Stadium',
    dates: 'Varying Dates - Summer 2026',
    image: '/assets/images/concert_event_1791372583508.jpg',
    tagline: 'Unparalleled Sound, Sovereign Comfort',
    shortDescription: 'Witness legendary performers from your own private luxury suite or premium front-tier stadium boxes.',
    description: 'Avoid the massive stadium queues and enjoy global music superstars (including headliner stadium tours) with pristine hospitality. Relax in air-conditioned comfort with a private balcony of padded seats right on the center line, and enjoy pre-concert dining, dedicated cocktail bars, and an electric atmosphere.',
    highlightBenefit: 'Skip the crowds with fast-track VIP entry, private cocktail lounge, and cushioned seats directly in front of the main stage.',
    packages: [
      {
        name: 'Gold Hospitality Bar',
        price: 495,
        benefits: [
          'Premium padded seat in the Level 2 Club Wembley tier',
          'Access to exclusive VIP bars, lounges, and street-food stalls',
          'Complimentary pre-show drink (Champagne, craft beer or soft drink)',
          'Fast-track stadium entrance to bypass general admission lines',
          'Commemorative event lanyard and premium tour program'
        ],
        description: 'An excellent informal package for couples and small groups who want premium seating and hassle-free stadium access.'
      },
      {
        name: 'The Elite Lounge',
        price: 850,
        badge: 'Superb Value',
        benefits: [
          'Premium front-center tier 1 seating (closest blocks to the stage)',
          'Three-course hot chef-station dining inside the private lounge',
          'Unlimited complimentary bar of wine, beer, select spirits & cider',
          'Post-show lounge afterparty access with live DJ',
          'Dedicated table reservation for your group'
        ],
        description: 'A luxurious, lively hospitality package combining premier front-row seats with top-tier lounge dining and cocktails.'
      },
      {
        name: 'Sovereign Private Suite',
        price: 1950,
        badge: 'Private Oasis',
        benefits: [
          'Ultra-private 8, 12, or 20-person suite on Level 3',
          'Dedicated private balcony with high-backed plush armchairs',
          'Bespoke multi-course dining menu customized to your requests',
          'Personal host and dedicated mixologist serving top-shelf spirits',
          'Private en-suite restroom and multiple flat-screens with pre-show feeds',
          'In-suite acoustic presentation and post-concert champagne toast'
        ],
        description: 'The ultimate entertainment canvas. Ideal for high-profile business clients or special family occasions demanding perfect seclusion.'
      }
    ]
  },
  {
    id: 'wimbledon',
    title: 'Wimbledon Tennis Championships',
    category: 'Tennis',
    location: 'London, United Kingdom',
    venue: 'All England Lawn Tennis Club',
    dates: 'June 29 – July 12, 2026',
    image: '/assets/images/elevate_hero_1791372544717.jpg',
    tagline: 'Strawberries, Cream & Court-Side Elegance',
    shortDescription: 'Savor English heritage and grass-court drama from premium debenture tickets and exclusive garden hospitality.',
    description: 'The oldest and most prestigious tennis tournament in the world. Experience the serene elegance of SW19. Watch historic matches from guaranteed Debenture Seats on Centre Court or No. 1 Court, and escape to an award-winning award-winning garden lounge for chilled Pimm’s, afternoon tea, and gourmet food created by elite culinary minds.',
    highlightBenefit: 'Guaranteed Centre Court or Court No.1 Debenture Seats with all-day luxury pavilion hospitality.',
    packages: [
      {
        name: 'The Lawn Pavilion',
        price: 895,
        benefits: [
          'Official Debenture seat on Court No. 1',
          'Three-course fine dining lunch inside an English-garden styled pavilion',
          'Complimentary bar of Pimm’s, premium wines, champagne, and beers',
          'Traditional Wimbledon afternoon tea with fresh strawberries & cream',
          'Complimentary shuttle transfers from Southfields tube station'
        ],
        description: 'A beautifully relaxed, quintessentially British garden hospitality experience that sets the tone for a historic day of sport.'
      },
      {
        name: 'The Centre Court Club',
        price: 1650,
        badge: 'Highly Coveted',
        benefits: [
          'Premium guaranteed Debenture Seat on Centre Court',
          'Four-course sit-down a la carte menu by Michelin-honored chefs',
          'Vintage Champagne flowing all-day with fine vintage Claret',
          'Live harpist and string quartet performing in the private club',
          'Official tournament merchandise and individual souvenir gifts'
        ],
        description: 'The ultimate tennis fan’s dream. Centrally located within the grounds, putting you a heartbeat away from the royal box action.'
      }
    ]
  },
  {
    id: 'six-nations',
    title: 'Six Nations Rugby Championship',
    category: 'Rugby',
    location: 'Paris, France',
    venue: 'Stade de France',
    dates: 'February 7 – March 14, 2026',
    image: '/assets/images/rugby_event_1791381084724.jpg',
    tagline: 'Le Tournoi de l’Élite Européenne',
    shortDescription: 'Savor the peak of European Rugby inside the exclusive presidential lounges of the legendary Stade de France.',
    description: 'Experience the roar of Stade de France from the highest vantage point of private luxury. The Six Nations Tournament brings together Europe’s rugby giants in a test of pure power, strategy, and sportsmanship. Combine the adrenaline of international test match rugby with three-star French gastronomy, vintage Bordeaux blends, and dedicated host services.',
    highlightBenefit: 'Presidential Suite Category 1 seats overlooking the half-way line, all-day premium open bar, and legendary player meeting.',
    packages: [
      {
        name: 'Le Salon d’Honneur',
        price: 850,
        benefits: [
          'Official Category 1 seating directly on the 50m line',
          'Exquisite pre-match buffet dining curated by a master chef',
          'Open bar offering selection of fine wines, beers, and spirits',
          'Exclusive post-match briefing with rugby legends & pundits',
          'Dedicated VIP entrance bypassing general stadium crowds'
        ],
        description: 'Perfect for passionate rugby connoisseurs looking for elite seat positioning and premium corporate entertainment.'
      },
      {
        name: 'The Grand Slam Loge',
        price: 1750,
        badge: 'Most Prestigious',
        benefits: [
          'Private luxury loge with panoramic floor-to-ceiling glass',
          'Bespoke four-course sit-down menu with wine pairing',
          'All-day unlimited Bollinger Champagne and premier cru Bordeaux',
          'Dedicated butler service and private in-loge catering',
          'Gift box containing official tournament jersey & souvenir program'
        ],
        description: 'An unmatched private oasis designed for top-tier executive hospitality, providing sovereign views of the pitch.'
      }
    ]
  },
  {
    id: 'nba-paris',
    title: 'NBA Paris Game',
    category: 'Basketball',
    location: 'Paris, France',
    venue: 'Bercy Accor Arena',
    dates: 'January 22, 2026',
    image: '/assets/images/basketball_event_1791381113513.jpg',
    tagline: 'American Spectacle, Parisian Sophistication',
    shortDescription: 'Witness courtside NBA action in Paris from highly exclusive private suites with VIP access to the official afterparties.',
    description: 'The glamour and high-intensity energy of the NBA returns to the heart of Paris at the Accor Arena. Watch world-class basketball stars battle from premium courtside seats, or network inside elegant private lounges. Indulge in custom mixology, gourmet American-French fusion cuisine, and receive exclusive access to the official post-game VIP gala.',
    highlightBenefit: 'Row 1 courtside seating, exclusive pre-game access, and invitations to the official NBA players afterparty.',
    packages: [
      {
        name: 'The Courtside Club',
        price: 1250,
        benefits: [
          'Guaranteed Row 1-3 courtside seating near the team benches',
          'Access to the exclusive backstage VIP lounge before and after the game',
          'Gourmet food stations with interactive chef demonstrations',
          'Flowing Champagne, custom signature cocktails, and premium beers',
          'Exclusive NBA souvenir merchandise gift bag'
        ],
        description: 'Feel the sweat and energy of the players. Unrivaled court proximity paired with high-end luxury styling.'
      },
      {
        name: 'The All-Star Suite',
        price: 2900,
        badge: 'Ultra Elite',
        benefits: [
          'Private VIP suite on the main balcony with premium terrace seats',
          'Custom French-American fusion dinner prepared in-suite',
          'Pre-game shootaround court access and photograph on center court',
          'Flowing Dom Pérignon champagne, top-shelf spirits, and fine wines',
          'Two passes to the official closed-door NBA Paris Afterparty'
        ],
        description: 'For those seeking the ultimate entertainment canvas. A private suite experience combining the NBA glamour with French hospitality.'
      }
    ]
  }
];
