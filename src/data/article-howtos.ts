import type { AddedArticle } from './article-additions';

// Procedural guides published in October 2026; no predicted platform changes.
export const articleHowtos: AddedArticle[] = [
  {
    id: 90005,
    slug: 'ga4-utm-naming-conventions',
    title: 'GA4 UTM Naming Conventions: Build a Clean Campaign Record',
    description: 'Create consistent GA4 UTM names, test campaign links and review acquisition data. A practical workflow for source, medium, campaign and creative records.',
    keywords: ['GA4 UTM naming conventions', 'campaign tracking', 'UTM parameters', 'traffic acquisition'],
    authorName: 'Kirk Musick, MS, MBA',
    authorId: 1,
    layer: 'Intelligence',
    related: ['business-intelligence', 'google-search-ads'],
    dateGmt: '2026-10-06T12:00:00',
    markdown: `Campaign names are data. Inconsistent spelling makes the report describe the naming committee instead of the campaign.

I use one vocabulary, a link register and a click test. Start with the channel decisions in our [planning guide](/blog/seven-digital-channels-which-to-skip/).

## 1. Define the fields

Use source for the originating platform or publication, medium for the channel and campaign for the shared marketing effort. Use content when a creative or placement needs to be distinguished.

Google's [campaign URL guidance](https://support.google.com/analytics/answer/10917952?hl=en) documents these parameters and their acquisition-report dimensions. Write each field's meaning before building links.

## 2. Choose one spelling

Keep an approved list of source and medium values. Choose one case and separator. Google notes that UTM values are case-sensitive.

An illustrative newsletter convention could use source newsletter, medium email, campaign desk_lighting_guide and content hero_link. These are example labels, not universal defaults. Review existing auto-tagging before changing platform links.

## 3. Build and record the destination

Open the clean destination first. Add the agreed parameters with a URL builder or consistent template. Check for duplicate names, missing values and malformed separators.

Keep personal information out of campaign URLs. Google's [Analytics privacy guidance](https://support.google.com/analytics/answer/6366371?hl=en) includes campaign parameters in that rule.

## 4. Test the published path

Click the exact link in its intended placement. Follow redirects, confirm the destination and inspect collection in the intended Analytics property under the approved consent state.

For ecommerce, continue with [purchase-event validation](/blog/ga4-ecommerce-event-validation/). A tagged visit does not establish that an order is measured correctly.

## 5. Check the processed names

Inspect the relevant session source, medium and campaign dimensions after processing. Compare them with the register.

Investigate the actual link, redirects and reporting dimensions when values differ. For [Google Search Ads](/services/google-search-ads/), preserve the account's intended integration. [Business intelligence](/services/business-intelligence/) connects stable campaign records to outcome data.

## Keep this link register

- Final URL and published placement.
- Source, medium, campaign and content values.
- Stable campaign ID where one is used.
- Owner and test date.
- Observed destination and processed values.
- Exceptions or unresolved measurement limits.

Do not rename an existing campaign casually. Record changes so later comparisons have a reliable explanation.`,
  },
  {
    id: 90006,
    slug: 'search-console-query-page-review',
    title: 'Search Console Query and Page Review: A Working Routine',
    description: 'Review Search Console queries and pages with consistent filters. Turn clicks, impressions and observed search intent into a focused editorial action list.',
    keywords: ['Search Console query review', 'page performance', 'organic search', 'SEO reporting'],
    authorName: 'Jaymie Wilhoit',
    authorId: 2,
    layer: 'Intelligence',
    related: ['seo', 'business-intelligence'],
    dateGmt: '2026-10-06T12:00:00',
    markdown: `End a Search Console review with a page decision: improve an answer, investigate a technical issue or leave the page alone.

Choose important pages using [the four-pillar framework](/blog/four-pillars-of-seo-operators-view/), then review them consistently.

## 1. Record the comparison

Open the intended property and Search results report. Save the dates, search type, country and device filters. Use comparable complete periods and note seasonality or releases.

Google's [filtering guidance](https://support.google.com/webmasters/answer/17011165?hl=en) explains how filters combine. Preserve them with the review.

## 2. Filter to one page

Inspect the queries associated with the page, alongside clicks and impressions. Group them by the reader's likely task.

Open the page. Does it answer those tasks clearly? An unexpected do-it-yourself query on a service page warrants investigation; it does not automatically justify a tutorial rewrite.

## 3. Reverse the view

Filter to an important query and inspect its pages. Read each before treating multiple results as a problem. A guide and service page can serve different needs.

Google's [dimensions documentation](https://support.google.com/webmasters/answer/17011259?hl=en) notes that most performance is assigned to canonical URLs. Use [canonical debugging](/blog/search-console-canonical-indexing-debugging/) when the address differs from the expected page.

## 4. Check the limits

Query tables omit anonymized searches and may not contain every row. Google's dimensions guidance explains that query filters also affect how anonymized queries contribute to totals.

A filtered export is not the entire property. Review query mix before interpreting an aggregate change, and do not treat a search click as a qualified inquiry or order.

## 5. Write one supported action

Choose a specific edit or investigation. Record the page, observed query group, supporting view and intended reader benefit. Leave accurate useful pages alone.

[SEO work](/services/seo/) owns the search repair. [Business intelligence](/services/business-intelligence/) connects search observations with approved outcomes. Our [Search Console guide](/blog/google-search-console-the-operators-guide/) provides broader context.

## Use this action record

- Page and query group.
- Dates and exact filters.
- Observation and reporting limitation.
- Proposed change, owner and release date.
- Comparable view to check next.

Preserve the original evidence. Later movement is an observation, not automatic proof that the edit caused it.`,
  },
  {
    id: 90007,
    slug: 'shopify-product-page-seo',
    title: 'Shopify Product Page SEO: A Practical Editing Checklist',
    description: 'Improve a Shopify product page with accurate product copy, search metadata, image alt text and useful links. Verify the published page before judging results.',
    keywords: ['Shopify product page SEO', 'product descriptions', 'product metadata', 'image alt text'],
    authorName: 'Jaymie Wilhoit',
    authorId: 2,
    layer: 'Demand',
    related: ['shopify', 'seo'],
    dateGmt: '2026-10-06T12:00:00',
    markdown: `Improve the product information and search presentation together. Start with one representative item before applying a catalog-wide template.

Use our [Shopify SEO launch guide](/blog/shopify-seo-launch-checklist/) for the wider storefront checks.

## 1. Verify the product facts

Collect current dimensions, options, included items and purchasing conditions. Name the source and reviewer for each.

Shopify's [product details documentation](https://help.shopify.com/en/manual/products/details/product-details-page) describes the relevant content, media, variant and search-listing fields. Use the right field rather than one unstructured description.

## 2. Answer the buying questions

Write a descriptive title and a short opening identifying the item. Explain features, fit and important limitations from verified facts.

An illustrative lamp page could explain dimensions and adjustment instead of claiming it suits every workspace. Keep specifications easy to compare; do not invent reviews or performance results.

## 3. Edit the search listing

Write a concise title and unique description that match the actual product. Shopify's [metadata guidance](https://help.shopify.com/en/manual/promoting-marketing/seo/adding-keywords) recommends readable wording and notes that search engines may display different text.

Keep a working URL unless a change has a real purpose. Plan redirects and connected-data updates when an address must change.

## 4. Describe the images

Review each important media item's alt text. Describe the actual view and relevant variant; avoid unrelated keywords.

Shopify's [alt text instructions](https://help.shopify.com/en/manual/products/product-media/add-alt-text) explain saving the value in the media editor. Check suggestions before accepting them.

## 5. Connect and test the page

Confirm the product is reachable from its collection and relevant guides. Google's [ecommerce structure guidance](https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure) recommends navigational links through categories to products.

Save, then open the public URL on mobile. Check descriptions, options, images, metadata and purchase behavior. [Shopify development](/services/shopify/) addresses template defects; [SEO review](/services/seo/) checks the page's search role.

## Final checklist

- Facts and limitations have an approved source.
- Copy, images and options describe the same item.
- Search metadata is unique and accurate.
- Alt text describes each image.
- Collection and guide links work.
- The published buying path has been tested.

Record the release before reviewing comparable search periods. An edited title does not guarantee better rankings.`,
  },
  {
    id: 90008,
    slug: 'google-shopping-variant-feed-checklist',
    title: 'Google Shopping Variant Feed Checklist: Test Each Option',
    description: 'Check Shopping product variants across IDs, grouping, options and landing pages. Trace each submitted item to its selected price, image and availability.',
    keywords: ['Google Shopping variants', 'variant feed checklist', 'item group ID', 'Merchant Center'],
    authorName: 'Jaymie Wilhoit',
    authorId: 2,
    layer: 'Demand',
    related: ['shopping-ads', 'shopify'],
    dateGmt: '2026-10-06T12:00:00',
    markdown: `Review the product family and each submitted option separately. A correct family name can still lead to the wrong variant.

Start with [the ecommerce launch guide](/blog/shopify-seo-launch-checklist/) for the broader setup.

## 1. Map the real variants

List the actual purchasable options from the catalog. Create one working row for each submitted item.

Google's [item group guidance](https://support.google.com/merchants/answer/6324507?hl=en) describes separate variant records with shared grouping and variant-identifying attributes. Check the current required fields for your products and destinations.

## 2. Compare the option fields

Match each item ID, group ID, title and relevant option value with the source record. Keep unrelated products out of the family.

If the storefront uses branded color labels, document the integration mapping. A visual swatch alone does not verify the submitted data. Fix a repeated mapping error at its source.

## 3. Open the submitted link directly

Use the processed item's URL in a fresh browser context. Confirm the selected option without manually correcting it.

Google's [product link documentation](https://support.google.com/merchants/answer/6324416?hl=en) and [variant URL guidance](https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites) describe relevant destination requirements. Check whether redirects or theme scripts change the selection.

## 4. Check that option's offer

Compare its image, price and availability across the catalog, processed record and landing page. Repeat on mobile. A family-level price range does not verify a particular option.

Use Google's [availability guidance](https://support.google.com/merchants/answer/6324448?hl=en) for supported states. Check the affected variant's ability to be ordered; do not borrow another option's availability.

## 5. Correct and verify the processed record

Repair the source or mapping, submit through the approved integration and reopen the item. Inspect its current issue status and landing selection.

Our [feed diagnostics guide](/blog/merchant-center-feed-diagnostics/) traces broader mismatches. [Shopping management](/services/shopping-ads/) separates eligibility from campaign performance; [Shopify work](/services/shopify/) owns storefront defects.

## Use this variant test row

- Item ID, group ID and required option fields.
- Submitted URL and observed selected option.
- Expected and observed image, price and availability.
- Market, device and test date.
- Source correction and processed result.
- Current issue status.

Recheck linked specifications when maintaining the integration. The durable test is whether the submitted item and the shopper's selected offer agree.`,
  },
  {
    id: 90009,
    slug: 'internal-link-audit',
    title: 'Internal Link Audit: Find the Pages Your Site Hides',
    description: 'Audit internal links around important pages, crawlable destinations and reader tasks. Find broken paths and missing connections without adding link clutter.',
    keywords: ['internal link audit', 'site structure', 'crawlable links', 'pillar content'],
    authorName: 'Kirk Musick, MS, MBA',
    authorId: 1,
    layer: 'Demand',
    related: ['seo', 'web-design'],
    dateGmt: '2026-10-06T12:00:00',
    markdown: `A useful page can exist without a useful route to it. Leaving discovery to a search box and optimism is not much of a handoff.

I start with important reader tasks, using [the four-pillar framework](/blog/four-pillars-of-seo-operators-view/).

## 1. Name the pages worth reaching

List important services, categories and core guides. Write each page's purpose and the reader task it supports.

Do not prescribe an arbitrary link count. Decide which connections help someone use the content.

## 2. Walk the public routes

Browse from the homepage, relevant overview and article hub. Repeat with mobile navigation. Record unclear labels, dead ends and pages reachable only through search.

Google's [ecommerce structure guidance](https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure) explains navigational discovery and notes that Google generally does not submit site-search queries.

## 3. Inspect destinations and labels

Use an existing crawler or inspect rendered links. Record source, destination and visible text. Google's [link guidance](https://developers.google.com/search/docs/crawling-indexing/links-crawlable) recommends real crawlable destinations and descriptive text.

Check missing pages, unnecessary redirects and label/destination disagreements. Resolve [canonical questions](/blog/search-console-canonical-indexing-debugging/) before replacing URL versions everywhere.

## 4. Add the connection where it helps

Read the likely introducing page. Link at the point where the reader needs a deeper explanation, relevant service or product choice.

Connect core guides with useful supporting articles. Skip links that repeat the same answer. Our [content brief guide](/blog/content-briefs-search-intent-internal-links/) helps plan these relationships before drafting.

## 5. Repair shared defects at the source

Fix a broken header link in the header. Fix outdated generated URLs in the template, rather than editing isolated output.

[Web development](/services/web-design/) owns navigation behavior; [SEO work](/services/seo/) defines useful content relationships. Retest the original journeys after release.

## Use this link repair record

- Important destination and reader task.
- Source page and existing link text.
- Observed problem or missing connection.
- Preferred destination and proposed wording.
- Template or editorial owner.
- Mobile and desktop retest result.

A newly added link should explain a relationship. Verify that the intended page became easier to reach before calling the audit complete.`,
  },
  {
    id: 90010,
    slug: 'content-refresh-review',
    title: 'Content Refresh Review: Update the Answer, Not the Date',
    description: 'Review existing articles for outdated claims, missing answers and broken links. Choose keep, revise or consolidate from evidence, with honest update dates.',
    keywords: ['content refresh review', 'evergreen content', 'article updates', 'content maintenance'],
    authorName: 'Wendy Funnell',
    authorId: 3,
    layer: 'Demand',
    related: ['seo', 'ai-search-optimization'],
    dateGmt: '2026-10-06T12:00:00',
    markdown: `Refresh the answer, not just the date. Review what changed, what the reader needs and whether the existing page still serves that task.

Use [the four-pillar framework](/blog/four-pillars-of-seo-operators-view/) to keep content and technical questions distinct.

## 1. Reconfirm the reader task

Read the article and write its intended question in one sentence. Can the reader find a useful answer quickly?

Compare the scope with the actual current offer or procedure. Mark gaps without immediately expanding the page into every related subject.

## 2. Verify time-sensitive claims

List platform steps, capabilities, policies and named results. Check each against its approved or current primary source.

Google's [people-first guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) warns against changing dates without substantive changes. Mark claims accurate, needs revision or unverified. Remove unsupported results.

## 3. Choose keep, revise or consolidate

Keep an accurate useful page. Revise a specific missing or outdated answer. Consider consolidation only when pages genuinely serve the same task.

For consolidation, plan content preservation, relevant URL handling and link updates with [SEO review](/services/seo/). Smaller traffic alone is not a deletion reason.

## 4. Edit from a focused brief

Name the changed question, supporting evidence and reviewer. Our [content brief workflow](/blog/content-briefs-search-intent-internal-links/) provides the structure.

Check references, internal links, illustrations and captions alongside the edit. Rewrite metadata only when needed to describe the revised answer accurately.

## 5. Publish truthful dates and verify

Retain the original publication date. Record a real modification date for a substantial update. Google's [sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) describes accurate last-modification values for significant changes.

Open the published page and test updated links. [Generative search optimization](/services/ai-search-optimization/) benefits from verifiable explanations, but a refresh does not guarantee citations. Do not invent a future year's rules to make an evergreen procedure look newer.

## Keep this refresh record

- Reader task and reason for the review.
- Claims checked and current source URLs.
- Keep, revise or consolidate decision.
- Changed sections and approved reviewer.
- Actual modification date and release check.
- Next review trigger, such as a platform or product change.

Preserve the evidence behind the edit. A future reviewer should understand what changed and why.`,
  },
  {
    id: 90011,
    slug: 'service-page-content-checklist',
    title: 'Service Page Content Checklist: Make the Offer Clear',
    description: 'Review a service page for scope, process, evidence, practical questions and the inquiry path. Build a clear answer without unsupported promises or filler.',
    keywords: ['service page content checklist', 'service page SEO', 'website copy', 'inquiry journey'],
    authorName: 'Wendy Funnell',
    authorId: 3,
    layer: 'Demand',
    related: ['seo', 'web-design'],
    dateGmt: '2026-10-06T12:00:00',
    markdown: `A service page should explain fit: what the work includes, its boundaries and what happens next.

Use [the four-pillar framework](/blog/four-pillars-of-seo-operators-view/) to connect that answer with search discovery.

## 1. State the offer clearly

Name the service and practical problem. Identify the relevant customer or situation when it matters.

Read the heading and opening together. Someone arriving directly should understand the service without visiting the homepage first.

## 2. Define scope and constraints

List the main activities or deliverables. Explain what needs assessment before timing or scope can be confirmed.

Verify service area, supported platforms, access requirements and customer responsibilities. Do not turn an estimate into a guaranteed result.

## 3. Describe the real process

Write the sequence from inquiry to handover. Name the information collected and decisions made.

Have an operator confirm it matches actual delivery. [Web design](/services/web-design/) connects the described process with the form and surrounding journey.

## 4. Support important claims

Use approved examples, photographs or verifiable qualifications where they help assess the offer. A workflow screenshot does not establish revenue improvement without supporting evidence.

Google's [SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) recommends useful reliable content and clear organization. Keep private reports and unapproved testimonials out of public proof.

## 5. Answer fit questions and test the next step

Choose practical questions about preparation, ownership, maintenance or review. Verify answers with the business and place meaningful limitations near the relevant claim.

Check title, metadata and links. Google's [title-link guidance](https://developers.google.com/search/docs/appearance/title-link) explains that displayed search titles are influenced by multiple signals. Test the inquiry form and confirmation behavior on mobile and desktop.

## Use this page review checklist

- The offer and intended situation are clear.
- Scope and constraints are approved.
- Process matches actual delivery.
- Evidence supports each specific claim.
- Practical questions have verified answers.
- Metadata and supporting links are accurate.
- An authorized inquiry reaches the receiving system.

Use our [content brief guide](/blog/content-briefs-search-intent-internal-links/) to capture sources and reviewers. [SEO work](/services/seo/) connects the page to relevant topics while preserving its service-selection purpose.

The useful result is fewer important assumptions in the first conversation.`,
  },
  {
    id: 90012,
    slug: 'paid-media-landing-page-checklist',
    title: 'Paid Media Landing Page Checklist: Test the Whole Path',
    description: 'Check the path from an ad to its landing page and inquiry or purchase. Verify the offer, mobile experience, form behavior and measurement before launch.',
    keywords: ['paid media landing page checklist', 'landing page experience', 'conversion testing', 'ad destination'],
    authorName: 'Jaymie Wilhoit',
    authorId: 2,
    layer: 'Demand',
    related: ['google-search-ads', 'social-ads', 'web-design'],
    dateGmt: '2026-10-06T12:00:00',
    markdown: `Test the path from the ad promise to an accepted inquiry or purchase. A polished page alone cannot establish that the journey works.

Start with the campaign purpose in our [channel planning guide](/blog/seven-digital-channels-which-to-skip/).

## 1. Compare the promise and offer

Save the final creative, wording and destination. State what the visitor should receive after clicking.

Compare that expectation with the page's heading, offer and qualifications. Google's [landing-page guidance](https://support.google.com/google-ads/answer/6238826?hl=en) recommends relevant useful content aligned with the advertising.

## 2. Open the exact destination

Use the published link with approved parameters. Follow redirects and confirm the final page, domain and selected product option.

Review current [Google destination requirements](https://support.google.com/adspolicy/answer/6368661?hl=en) where applicable. A working page does not establish platform approval. Save the tested destination with [Search Ads](/services/google-search-ads/) or [social campaign](/services/social-ads/) records.

## 3. Complete the task on mobile

Read the offer and use its controls at phone size. Check clipped content, obscured fields, overlays and changes after the keyboard opens.

Record the exact action and failure. A screenshot of the page does not verify its interaction.

## 4. Test the accepted outcome

Exercise required fields, invalid input and correction. Make an authorized test submission or purchase, then confirm the receiving record through the approved test process.

A confirmation screen alone does not prove delivery. [Web development](/services/web-design/) repairs page or integration defects. For ecommerce, use [purchase-event validation](/blog/ga4-ecommerce-event-validation/).

## 5. Check measurement and retest

Verify that the chosen event represents the accepted inquiry or order, rather than a button click or attempted submission.

Use [GA4 campaign naming](/blog/ga4-utm-naming-conventions/) for consistent traffic records. Preserve approved consent behavior. Retest the relevant path after a repair; behavior verification does not establish conversion lift.

## Keep this release record

- Tested creative, promise and final URL.
- Device and browser used.
- Offer or option observed.
- Authorized test outcome and receiving record.
- Measurement evidence and its limits.
- Defect owner and retest result.

Treat campaign outcomes as a later observation requiring reliable data. The launch check establishes that the visitor can complete the intended path.`,
  },
];
