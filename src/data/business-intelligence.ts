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
  category: string;
  title: [string, string];
  description: string;
  decision: string;
  sources: string[];
  focus: [string, string];
  signals: string[];
};
export const businessIntelligenceScenarios: IntelligenceScenario[] = [
  {
    "id": "commerce",
    "category": "Revenue & customer behavior",
    "title": [
      "What is holding back",
      "the next purchase?"
    ],
    "description": "Connect acquisition, shopping behavior, orders, and seasonal demand to find where interest stops becoming revenue—and what deserves a closer look.",
    "decision": "Where to focus the next improvement across the customer journey.",
    "sources": [
      "Acquisition",
      "Behavior",
      "Orders",
      "Seasonality"
    ],
    "focus": [
      "The gap between",
      "interest and purchase."
    ],
    "signals": [
      "Changes in visitor intent",
      "Friction in the purchase journey",
      "Product availability and demand"
    ]
  },
  {
    "id": "procurement",
    "category": "Market context & purchasing decisions",
    "title": [
      "What should change",
      "your buying window?"
    ],
    "description": "Connect soybean oil prices, supply and demand, energy markets, and policy changes to understand the forces around a purchasing decision.",
    "decision": "How to weigh purchasing timing, supply exposure, and cost risk.",
    "sources": [
      "Market prices",
      "Supply & demand",
      "Energy & policy",
      "Risk signals"
    ],
    "focus": [
      "The forces behind",
      "the purchasing decision."
    ],
    "signals": [
      "Unusual relationships between market signals",
      "Changes in supply and demand",
      "Developments that could affect cost or timing"
    ]
  }
];
