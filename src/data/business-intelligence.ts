// Owner-approved Business Intelligence page, 15 October 2026 CT.
// Industry examples explain capabilities only: no client identities, screens, readings, or links.
export const businessIntelligenceLine = 'We build intelligence platforms that connect your data, uncover hidden patterns, and help you decide where to act.';
export const businessIntelligenceDescription = 'Custom business intelligence platforms that connect your data, uncover hidden patterns and anomalies, and turn findings into decisions. Built by ZINC.';

export const businessIntelligenceQuestions: [string, string][] = [
  [
    "How is this different from a dashboard?",
    "A dashboard is one way to view information. A custom intelligence platform also connects data across systems, investigates relationships, surfaces anomalies, and brings the findings into decisions and workflows. Its dashboard is part of that experience."
  ],
  [
    "What can a custom platform uncover?",
    "It can help reveal changes in customer behavior, friction in a purchase journey, shifts in demand, emerging cost pressures, or unusual relationships between signals. The analysis is designed around your business questions and the data needed to answer them."
  ],
  [
    "Can it work with our existing systems?",
    "We investigate the required systems and available connections, including APIs, databases, and approved exports. Data definitions and refresh schedules are agreed for each source so the platform reflects how the business actually operates."
  ],
  [
    "How does AI support the decisions?",
    "AI helps analyze large datasets, identify relationships, and surface patterns worth investigating. The platform connects its findings to supporting evidence so your team can assess the explanation and decide how to act. A relationship between signals is not, by itself, proof of cause."
  ],
  [
    "What makes the platform custom?",
    "The data model, analysis, interfaces, and workflows are built around your industry and operating decisions. An ecommerce business and a procurement team need different signals, different questions, and different ways to use the answers."
  ],
  [
    "Who owns the platform and the data?",
    "You own your business data and the reporting code and metric definitions agreed in the scope. Ownership, access, and third-party dependencies are documented before the build begins."
  ]
];

export type IntelligenceScenario = {
  id: string;
  label: string;
  category: string;
  title: [string, string];
  description: string;
  decision: string;
  sources: string[];
  focus: [string, string];
  signals: string[];
  trigger: string;
};
export const businessIntelligenceScenarios: IntelligenceScenario[] = [
  {
    "id": "ecommerce",
    "label": "Ecommerce",
    "category": "Shopping behavior & revenue",
    "title": [
      "Where does shopping",
      "turn into friction?"
    ],
    "description": "Connect browsing, cart activity, checkout errors, and order history to uncover where shoppers struggle. See how friction, product mix, and repeat purchases relate to conversion and average order value (AOV).",
    "decision": "Prioritize checkout fixes, product recommendations, or bundles using the affected journeys, order value, and margin.",
    "sources": [
      "Shopping journeys",
      "Checkout events",
      "Order value",
      "Product margins"
    ],
    "focus": [
      "The moments that",
      "interrupt a purchase."
    ],
    "signals": [
      "Repeated clicks, failed searches, and abandoned carts",
      "Payment errors and drop-off by checkout step",
      "AOV, basket mix, and repeat-purchase patterns"
    ],
    "trigger": "Checkout abandonment rises for a device or payment method while purchase intent holds steady. Surface the affected journeys and the change worth investigating."
  },
  {
    "id": "services",
    "label": "Services",
    "category": "Lead quality & competitive positioning",
    "title": [
      "Why are the right leads",
      "choosing someone else?"
    ],
    "description": "Connect inquiries, booking behavior, proposals, and customer feedback with public competitor offers and search visibility. Compare service demand with the work you win, the capacity you have, and the reasons prospects hesitate.",
    "decision": "Refine the offer, address booking friction, or shift marketing toward services with qualified demand and available capacity.",
    "sources": [
      "Leads & bookings",
      "Proposals & wins",
      "Public competitor offers",
      "Reviews & demand"
    ],
    "focus": [
      "The gap between",
      "an inquiry and a win."
    ],
    "signals": [
      "Booking drop-off and lead-to-client conversion",
      "Competitor scoring across offer, visibility, and reputation",
      "Pricing objections, response times, and service demand"
    ],
    "trigger": "Qualified inquiries increase while proposal wins fall, or a competitor changes an overlapping offer. Flag the affected service and compare the evidence before adjusting positioning."
  },
  {
    "id": "startup",
    "label": "Start Up",
    "category": "Market strategy & early traction",
    "title": [
      "Where is there room",
      "for your next move?"
    ],
    "description": "Bring customer research, search demand, acquisition, and early product usage into one view. Score competitors against defined customer needs to find gaps in the market and distinguish early interest from sustained traction.",
    "decision": "Choose which audience, positioning, feature, or acquisition channel deserves the next focused experiment.",
    "sources": [
      "Customer research",
      "Search demand",
      "Competitor positioning",
      "Product activation"
    ],
    "focus": [
      "The space between",
      "market interest and traction."
    ],
    "signals": [
      "Unmet needs and recurring customer objections",
      "Competitor strengths, gaps, and changes in positioning",
      "Acquisition quality, activation, and early retention"
    ],
    "trigger": "Interest grows in a customer segment but activation stalls, or competitors leave a recurring need underserved. Surface a specific positioning or product hypothesis to investigate."
  },
  {
    "id": "retail",
    "label": "Retail",
    "category": "Merchandising & inventory decisions",
    "title": [
      "What should be on",
      "the next shelf?"
    ],
    "description": "Connect sales, inventory, returns, promotions, and local demand to understand which products earn their space. Find mismatches between what customers want, what is available, and what delivers margin across stores and channels.",
    "decision": "Adjust replenishment, assortment, product placement, or promotions with demand, stock exposure, and margin in view.",
    "sources": [
      "Sales & returns",
      "Stock & lead times",
      "Promotions & margins",
      "Local demand"
    ],
    "focus": [
      "The relationship between",
      "demand, stock, and margin."
    ],
    "signals": [
      "Sell-through and stockout patterns by product or location",
      "Promotion response after discounts and returns",
      "Seasonal shifts and products frequently bought together"
    ],
    "trigger": "Demand accelerates while stock coverage tightens, or a promotion lifts sales but weakens margin. Highlight the products and locations that need a purchasing or merchandising decision."
  },
  {
    "id": "forecasting",
    "label": "Financial Forecasting",
    "category": "Cash flow & scenario planning",
    "title": [
      "What could change",
      "your financial outlook?"
    ],
    "description": "Connect revenue drivers, receivables, payables, payroll, and purchasing commitments to model the financial outlook. Compare scenarios with explicit assumptions, and trace forecast changes back to the operational signals behind them.",
    "decision": "Plan spending, hiring, purchasing, and cash requirements against a range of outcomes, with assumptions and uncertainty visible.",
    "sources": [
      "Revenue & pipeline",
      "Receivables & payables",
      "Costs & commitments",
      "Forecast assumptions"
    ],
    "focus": [
      "The changes behind",
      "your next financial scenario."
    ],
    "signals": [
      "Actual performance against forecast assumptions",
      "Collection timing, cost changes, and margin pressure",
      "Cash requirements across base, upside, and downside scenarios"
    ],
    "trigger": "Collections slow, a major cost changes, or sales diverge from plan. Flag the assumption to revisit and show how the revised scenario affects cash timing and available resources."
  }
];
