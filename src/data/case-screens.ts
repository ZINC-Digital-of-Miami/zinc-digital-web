export type CaseScreensPresentation = {
  slug: string;
  title: string;
  intro: string;
  kind?: 'website' | 'application';
  pages: Array<{
    key: string;
    title: string;
    url?: string;
    detail: string;
    images: { desktop?: string; tablet?: string; mobile?: string };
  }>;
};

export const caseScreens: Record<string, CaseScreensPresentation> = {
  'once-upon-a-book-club': {
    slug: 'once-upon-a-book-club',
    title: 'The storefront, across screens.',
    intro: 'The rebuilt Shopify storefront, shown on desktop and mobile.',
    pages: [
      {
        key: 'storefront',
        title: 'The storefront',
        url: 'https://www.onceuponabookclub.com/',
        detail: 'Subscription boxes, one-time releases and bookish gifts brought into one shopping experience.',
        images: { desktop: 'ouabc-website-after', mobile: 'ouabc-mobile' },
      },
    ],
  },
  'zinc-fusion-v16': {
    slug: 'zinc-fusion-v16',
    title: 'Inside the forecasting workspace.',
    intro: 'Four connected views from the application in development. Private figures are removed from these portfolio images.',
    kind: 'application',
    pages: [
      {
        key: 'dashboard',
        title: 'Market dashboard',
        detail: 'Soybean-oil futures, related markets, forecast probabilities and source intelligence in one workspace.',
        images: { desktop: 'fusion-v16-dashboard' },
      },
      {
        key: 'strategy',
        title: 'Procurement strategy',
        detail: 'Forecast checkpoints and purchasing scenarios connect market expectations with timing and cost exposure.',
        images: { desktop: 'fusion-v16-strategy' },
      },
      {
        key: 'legislation',
        title: 'Policy intelligence',
        detail: 'Government activity and source priority give procurement decisions their policy context.',
        images: { desktop: 'fusion-v16-legislation' },
      },
      {
        key: 'sentiment',
        title: 'Market sentiment',
        detail: 'Fund positioning, market mood and headline context sit alongside the price and forecast views.',
        images: { desktop: 'fusion-v16-sentiment' },
      },
    ],
  },
  "us-oil-solutions": {
    "slug": "us-oil-solutions",
    "title": "The second website, in progress",
    "intro": "The new public website introduces the service program, filtration and available oils. This website is in progress and separate from the operations app.",
    "pages": [
      {
        "key": "home",
        "title": "Home",
        "url": "https://usos-website-blush.vercel.app/",
        "detail": "The in-progress website introduces oil management for venues.",
        "images": {
          "desktop": "case-uos-home-desktop",
          "tablet": "case-uos-home-tablet",
          "mobile": "case-uos-home-mobile"
        }
      },
      {
        "key": "filtration",
        "title": "Oil filtration",
        "url": "https://usos-website-blush.vercel.app/services/filtration/",
        "detail": "A service page explains filtration within the oil-management program.",
        "images": {
          "desktop": "case-uos-filtration-desktop",
          "tablet": "case-uos-filtration-tablet",
          "mobile": "case-uos-filtration-mobile"
        }
      },
      {
        "key": "oils",
        "title": "Our oils",
        "url": "https://usos-website-blush.vercel.app/oils/",
        "detail": "The oil range is presented on a dedicated product overview page.",
        "images": {
          "desktop": "case-uos-oils-desktop",
          "tablet": "case-uos-oils-tablet",
          "mobile": "case-uos-oils-mobile"
        }
      }
    ]
  },
  "las-vegas-safety": {
    "slug": "las-vegas-safety",
    "title": "The storefront, across devices",
    "intro": "The homepage, catalog and a product page show the public shopping experience on desktop, tablet and mobile.",
    "pages": [
      {
        "key": "home",
        "title": "Home",
        "url": "https://lasvegassafety.net/",
        "detail": "The storefront introduces safety, first-aid and restaurant supplies.",
        "images": {
          "desktop": "case-lvs-home-desktop",
          "tablet": "case-lvs-home-tablet",
          "mobile": "case-lvs-home-mobile"
        }
      },
      {
        "key": "catalog",
        "title": "Product catalog",
        "url": "https://lasvegassafety.net/shop/",
        "detail": "The catalog brings product categories and inventory into one browsing view.",
        "images": {
          "desktop": "case-lvs-catalog-desktop",
          "tablet": "case-lvs-catalog-tablet",
          "mobile": "case-lvs-catalog-mobile"
        }
      },
      {
        "key": "product",
        "title": "Product detail",
        "url": "https://lasvegassafety.net/product/woundseal-rapid-response-24-boxes-per-case/",
        "detail": "A product page combines imagery, product information and ordering options.",
        "images": {
          "desktop": "case-lvs-product-desktop",
          "tablet": "case-lvs-product-tablet",
          "mobile": "case-lvs-product-mobile"
        }
      }
    ]
  },
  "summit-marine-development": {
    "slug": "summit-marine-development",
    "title": "Waterfront services, across screens",
    "intro": "Explore the homepage and dedicated seawall and dock service pages across desktop, tablet and mobile.",
    "pages": [
      {
        "key": "home",
        "title": "Home",
        "url": "https://summitmarinedevelopment.com/",
        "detail": "Waterfront construction services, project imagery and estimate inquiries.",
        "images": {
          "desktop": "case-smd-home-desktop",
          "tablet": "case-smd-home-tablet",
          "mobile": "case-smd-home-mobile"
        }
      },
      {
        "key": "seawalls",
        "title": "Seawalls and bulkheads",
        "url": "https://summitmarinedevelopment.com/services/seawall-and-bulkhead-installation/",
        "detail": "A dedicated service page for shoreline protection and construction.",
        "images": {
          "desktop": "case-smd-seawalls-desktop",
          "tablet": "case-smd-seawalls-tablet",
          "mobile": "case-smd-seawalls-mobile"
        }
      },
      {
        "key": "docks",
        "title": "Piers and docks",
        "url": "https://summitmarinedevelopment.com/services/pier-and-dock-construction/",
        "detail": "Dock construction information and waterfront project imagery.",
        "images": {
          "desktop": "case-smd-docks-desktop",
          "tablet": "case-smd-docks-tablet",
          "mobile": "case-smd-docks-mobile"
        }
      }
    ]
  },
  "the-lampstand-va": {
    "slug": "the-lampstand-va",
    "title": "Ministry information, across screens",
    "intro": "The homepage, prevention education and Night of Hope pages shown at desktop, tablet and mobile sizes.",
    "pages": [
      {
        "key": "home",
        "title": "Home",
        "url": "https://www.thelampstandva.org/",
        "detail": "An introduction to the ministry, its services and ways to support its work.",
        "images": {
          "desktop": "case-lampstand-home-desktop",
          "tablet": "case-lampstand-home-tablet",
          "mobile": "case-lampstand-home-mobile"
        }
      },
      {
        "key": "education",
        "title": "Prevention education",
        "url": "https://www.thelampstandva.org/prevention-education/",
        "detail": "Information for schools, churches and community organizations.",
        "images": {
          "desktop": "case-lampstand-education-desktop",
          "tablet": "case-lampstand-education-tablet",
          "mobile": "case-lampstand-education-mobile"
        }
      },
      {
        "key": "night-of-hope",
        "title": "Night of Hope",
        "url": "https://www.thelampstandva.org/night-of-hope/",
        "detail": "Event information and ways for the community to participate.",
        "images": {
          "desktop": "case-lampstand-night-of-hope-desktop",
          "tablet": "case-lampstand-night-of-hope-tablet",
          "mobile": "case-lampstand-night-of-hope-mobile"
        }
      }
    ]
  },
  "straight-street-ministries": {
    "slug": "straight-street-ministries",
    "title": "Community connections, across screens",
    "intro": "The homepage, organization background and program information shown across desktop, tablet and mobile.",
    "pages": [
      {
        "key": "home",
        "title": "Home",
        "url": "https://www.straightstreet.org/",
        "detail": "The ministry’s mission, community programs and ways to get involved.",
        "images": {
          "desktop": "case-straight-street-home-desktop",
          "tablet": "case-straight-street-home-tablet",
          "mobile": "case-straight-street-home-mobile"
        }
      },
      {
        "key": "about",
        "title": "About",
        "url": "https://www.straightstreet.org/about/",
        "detail": "Background on the organization and its work with young people.",
        "images": {
          "desktop": "case-straight-street-about-desktop",
          "tablet": "case-straight-street-about-tablet",
          "mobile": "case-straight-street-about-mobile"
        }
      },
      {
        "key": "volunteer",
        "title": "Programs and volunteering",
        "url": "https://www.straightstreet.org/volunteer/",
        "detail": "Community programs, mentoring and opportunities to support the ministry.",
        "images": {
          "desktop": "case-straight-street-volunteer-desktop",
          "tablet": "case-straight-street-volunteer-tablet",
          "mobile": "case-straight-street-volunteer-mobile"
        }
      }
    ]
  },
};
