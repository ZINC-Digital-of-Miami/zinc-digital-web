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
  'bear-claw-usa': {
    client: 'Bear Claw USA',
    title: 'From the screen to the container.',
    intro: 'The shield, wordmark and orange-and-black palette carry through the product packaging and business cards.',
    frames: [
      { asset: 'bear-claw-product', kind: 'catalog', surface: 'Packaging', label: 'Product presentation', title: 'The product in hand.', caption: 'The container label brings the shield, wordmark and product information into one layout.', alt: 'Black Bear Claw form-release container with an orange-and-black product label.' },
      { asset: 'bear-claw-business-card', kind: 'sheet', surface: 'Print', label: 'Business card', title: 'A consistent introduction.', caption: 'Front and back business-card artwork with the shield, wordmark and diagonal stripe motif.', alt: 'Bear Claw business-card artwork for Chris Stacy, with orange shield and wordmark on black and orange backgrounds.' },
    ],
  },
  'once-upon-a-book-club': {
    client: 'Once Upon a Book Club',
    title: 'Google Shopping. Meta. TikTok.',
    intro: 'We manage all three paid channels around subscription boxes, limited editions and seasonal releases. These presentations use the client’s campaign artwork.',
    frames: [
      { asset: 'ouabc-halloween-campaign-square', kind: 'feed', surface: 'Meta', label: 'Creative presentation', title: 'A seasonal story.', caption: 'Client-approved Halloween artwork, presented for the Meta feed.', alt: 'Once Upon a Book Club Halloween campaign artwork in a Meta creative presentation.' },
      { asset: 'ouabc-bridgerton-campaign-product', kind: 'vertical', surface: 'TikTok', label: 'Creative presentation', title: 'The box becomes the story.', caption: 'Bridgerton product artwork in a vertical creative presentation for TikTok.', alt: 'Once Upon a Book Club Bridgerton box and book artwork in a TikTok creative presentation.' },
      { asset: 'ouabc-shopping-creative-2024', kind: 'shopping', surface: 'Google Shopping', label: 'Creative presentation', title: 'Show what arrives.', caption: 'Shopping campaign source artwork from 2024: the book, box and gifts shown together.', alt: 'Once Upon a Book Club Shopping source artwork showing Love of My Lives, its box and numbered gifts.' },
    ],
  },
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
      { asset: 'lvs-storefront-first-aid', kind: 'catalog', surface: 'Ecommerce', label: 'Delivered storefront', title: 'Find the right supplies.', caption: 'First-aid storefront artwork with product search, quick reorder and account navigation.', alt: 'Las Vegas Safety first-aid ecommerce storefront presented on a laptop.' },
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
