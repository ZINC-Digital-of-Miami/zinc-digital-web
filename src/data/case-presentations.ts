export type PresentationKind = 'feed' | 'vertical' | 'shopping' | 'sheet' | 'catalog' | 'identity' | 'app';

interface PresentationFrame {
  asset: string;
  kind: PresentationKind;
  surface: string;
  label: string;
  title: string;
  caption: string;
  alt: string;
}

interface CasePresentation {
  client: string;
  title: string;
  intro: string;
  frames: PresentationFrame[];
}

// Platform treatments present approved source artwork; they do not assert a
// particular campaign, platform interface, delivery state or performance result.
export const casePresentations: Record<string, CasePresentation> = {
  'summit-marine-development': {
    client: 'Summit Marine Development',
    title: 'The waterfront work comes first.',
    intro: 'Dock and seawall campaign artwork connects the service being searched for with the construction work customers can see.',
    frames: [
      { asset: 'smd-dock-ad-previews', kind: 'sheet', surface: 'Google', label: 'Source ad previews', title: 'Dock construction.', caption: 'Dock campaign artwork from the original Google ad previews, with waterfront construction photographs and service copy.', alt: 'Summit Marine dock-construction campaign source preview sheet across Google placements.' },
      { asset: 'smd-seawall-ad-previews', kind: 'sheet', surface: 'Google', label: 'Source ad previews', title: 'Seawalls and retaining walls.', caption: 'Seawall campaign artwork from the original Google ad previews connects completed waterfront work with the service offer.', alt: 'Summit Marine seawall and retaining-wall campaign source preview sheet across Google placements.' },
    ],
  },
  'las-vegas-safety': {
    client: 'Las Vegas Safety & Supply',
    title: 'Built around the buying task.',
    intro: 'The storefront, product artwork and identity belong to one wholesale ecommerce rebuild.',
    frames: [
      { asset: 'lvs-case-devices-restaurant', kind: 'catalog', surface: 'Ecommerce', label: 'Delivered storefront', title: 'Find the right supplies.', caption: 'The original ZINC storefront brings restaurant and safety supplies, quick reorder and account navigation together.', alt: 'Las Vegas Safety and Supply original ZINC storefront.' },
      { asset: 'lvs-food-service-product-hero', kind: 'catalog', surface: 'Food service', label: 'Catalog artwork', title: 'Products in context.', caption: 'Food-service catalog artwork brings containers, gloves and hair nets into one product presentation.', alt: 'Las Vegas Safety catalog artwork featuring takeout containers, gloves and hair nets.' },
      { asset: 'lvs-logo-black', kind: 'identity', surface: 'Brand identity', label: 'Delivered brand mark', title: 'A consistent identity.', caption: 'The primary shield and wordmark created for Las Vegas Safety & Supply.', alt: 'Las Vegas Safety and Supply primary shield logo and wordmark.' },
    ],
  },
  'us-oil-solutions': {
    client: 'U.S. Oil Solutions',
    title: 'The operations app.',
    intro: 'Built separately from the public website, the app gives technicians and supervisors scheduling, check-ins, fryer records, photo capture and reporting.',
    frames: [
      { asset: 'uos-current-technicians-mobile', kind: 'app', surface: 'Operations app', label: 'Current mobile view', title: 'Technician oversight.', caption: 'The supervisor dashboard brings the technician roster and shift handover into view. Identifying details are removed.', alt: 'Sanitized U.S. Oil operations app technician roster and shift-handover screen.' },
      { asset: 'uos-current-schedule-mobile', kind: 'app', surface: 'Operations app', label: 'Current mobile view', title: 'Restaurant scheduling.', caption: 'Restaurant assignments appear in the schedule view of the same app. Identifying details are removed.', alt: 'Sanitized U.S. Oil operations app restaurant scheduling screen.' },
      { asset: 'uos-current-fryers-mobile', kind: 'app', surface: 'Operations app', label: 'Current mobile view', title: 'Fryer records.', caption: 'Restaurant and fryer records connect equipment information with service scheduling. Identifying details are removed.', alt: 'Sanitized U.S. Oil operations app restaurant fryer records screen.' },
    ],
  },
};
