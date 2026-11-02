export type AddedArticle = {
  id: number;
  format?: 'feature';
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  authorName: string;
  authorId: number;
  layer: 'Build' | 'Demand' | 'Intelligence';
  related: string[];
  markdown: string;
  dateGmt: string;
  modifiedGmt?: string;
};

// Original editorial additions. Examples describe test procedures, not client results.
export const articleAdditions: AddedArticle[] = [
  {
    id: 90001,
    slug: 'ga4-ecommerce-event-validation',
    title: 'GA4 Ecommerce Event Validation: Trace the Order',
    description: 'Validate GA4 ecommerce events from product view to purchase. Check item data, transaction IDs, value, consent and reporting against a controlled order.',
    keywords: ['GA4 ecommerce event validation', 'GA4 purchase event', 'ecommerce analytics', 'transaction ID', 'DebugView'],
    authorName: 'Kirk Musick, MS, MBA',
    authorId: 1,
    layer: 'Intelligence',
    related: ['business-intelligence', 'shopify'],
    dateGmt: '2026-10-06T12:00:00',
    modifiedGmt: '2026-11-02T18:13:42Z',
    markdown: `A purchase event firing is not the same as a purchase being measured correctly.

Trace one controlled order before trusting the revenue chart.

## 1. Define the expected events

Write the shopping actions, triggers, source fields and implementation owner. Use Google's [ecommerce guide](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce) to map product views, cart actions, checkout, purchases and refunds to what actually happens in the store.

Choose a test order whose quantities, discounts and payment route are easy to inspect. Record its identifier without exposing customer details.

## 2. Inspect the purchase payload

Compare the sent fields with the order record. Google's [purchase reference](https://developers.google.com/analytics/devguides/collection/ga4/reference/events#purchase) specifies a unique **transaction_id** and an **items** array. Include **currency** when sending **value**.

Check product or variant identity, numeric prices and quantities, and the merchandise value: item price multiplied by quantity, summed across items. Keep shipping and tax in their separate parameters. Check the amounts even when the tag fires successfully.

## 3. Follow the journey in DebugView

Enable debug mode for the test device and inspect the intended property using Google's [DebugView guidance](https://support.google.com/analytics/answer/7201382?hl=en). Select a variant, add to cart, change quantity and complete the authorized test purchase. Compare each action with its event and parameters.

Record the consent state. Privacy controls or denied Analytics-cookie consent can prevent events appearing in DebugView. Diagnose that condition through the approved consent implementation; do not disable consent to produce a successful test.

## 4. Test duplicate and refund paths

Refresh or revisit the confirmation page and look for another purchase submission. Check for overlapping senders, such as a store integration and custom tag. A unique transaction ID helps prevent duplicate purchase events; inspect the implementation too.

Test a discount, multiple items and an accelerated payment route if offered. Verify that refunds reference the original transaction and relevant items. Cancellation, failed payment and refund are different states.

## 5. Reconcile the recorded transaction

After report processing, compare the controlled order using the same property, dates, currency and revenue definition. Separate order creation, event collection and attribution. Document consent gaps and refunds instead of forcing unlike totals to match.

**Test record:** scenario; expected event; observed fields; consent state; transaction ID; report check; issue owner.

Repeat relevant checks after [Shopify changes](/services/shopify/). The [channel planning guide](/blog/seven-digital-channels-which-to-skip/) connects measurement to the decisions behind [business intelligence](/services/business-intelligence/).

## Worked check: one order, one purchase

Use an authorized test order and record its ID before opening Analytics. In this illustrative example, two units at $30 each plus $6 shipping and $4 tax produce a $70 order total. The purchase event’s item revenue is $60, with shipping and tax supplied in their separate fields; inspect the current event specification rather than placing the whole order total in every field.

Check quantity, item ID, currency and the unique transaction ID. Reload the confirmation page and verify that the implementation does not create a second purchase. Test the approved consent states separately; do not bypass consent to make the report look complete. Keep the test order identifiable and exclude it from commercial conclusions. Pass the check only when the captured event, item details and source order reconcile under the documented definitions.`,
  },
  {
    id: 90002,
    slug: 'search-console-canonical-indexing-debugging',
    title: 'Search Console Canonical Debugging: Follow the Evidence',
    description: 'Debug canonical and indexing problems in Search Console. Compare indexed and live evidence, redirects, canonicals, internal links and sitemap URLs.',
    keywords: ['Search Console canonical debugging', 'Google-selected canonical', 'URL Inspection', 'indexing problems', 'technical SEO'],
    authorName: 'Kirk Musick, MS, MBA',
    authorId: 1,
    layer: 'Demand',
    related: ['seo', 'web-design'],
    dateGmt: '2026-10-06T12:00:00',
    modifiedGmt: '2026-11-02T18:13:42Z',
    markdown: `A canonical tag is a preference. It is not a command.

When Google chooses another URL, inspect the disagreement before changing the template.

## 1. Identify the intended page

Copy the exact URL, including hostname and parameters. Write why it should represent this content: the main service, product or article page. A generated URL is not automatically a distinct page worth indexing.

Use the [four pillars of SEO](/blog/four-pillars-of-seo-operators-view/) to place this technical check within the wider plan.

## 2. Separate indexed and live evidence

Inspect the URL in Search Console. Record status, last crawl, declared canonical and Google-selected canonical where available.

Google's [URL Inspection guide](https://support.google.com/webmasters/answer/9012289?hl=en) distinguishes the stored indexed version from the live test. A successful live test checks current access and potential indexability. It does not prove indexing or predict canonical selection. If the crawl predates a release, record that timing.

## 3. Compare the selected URL

Open and inspect Google's selected address too. Compare substantive content, response codes, redirect destinations and canonical declarations. Look for parameter duplicates, another hostname or a legacy route.

Document whether the pages serve the same purpose. Do not merge distinct useful pages simply to make the export shorter.

## 4. Align the site's signals

Google's [canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) describes redirects and canonical annotations as strong signals; sitemap inclusion is weaker. Choose the appropriate treatment for the actual duplicate or retired page.

Point relevant internal links and sitemap entries to the intended address. Use [crawlable links](https://developers.google.com/search/docs/crawling-indexing/links-crawlable) with real destinations. Check rendered output after a [website change](/services/web-design/), not just the template source.

## 5. Check access, then verify the repair

Inspect HTTP responses, robots rules and indexing directives separately. Google's [robots.txt guide](https://developers.google.com/search/docs/crawling-indexing/robots/intro) explains that crawling controls do not reliably prevent indexing. Its [robots meta guidance](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag) covers directives the crawler must be able to read. Private pages need actual access protection.

Fix the conflict you found and retest the published page. Request indexing when appropriate, then inspect the next crawl. A completed release and Google's subsequent selection are separate observations.

**Inspection record:** intended URL; selected URL; crawl date; response; canonical; access rules; conflicting signals; repair; next check.

Use the [Search Console operator's guide](/blog/google-search-console-the-operators-guide/) for recurring review. For [technical SEO](/services/seo/), identify the affected URLs and the conflicting signals before changing a shared template.

## Work one pair of URLs

Suppose a campaign parameter URL and a clean product URL show the same item. Record both addresses, their responses and their canonical declarations. If internal links favor the parameter URL while the sitemap lists the clean URL, fix that disagreement before requesting another inspection.

A product and its collection are not an equivalent pair merely because their text overlaps. Preserve their separate buying purposes. After the change, verify the live signals immediately and record Google’s indexed selection separately when it updates. The live test can show current accessibility; it cannot guarantee the selected canonical. Your investigation record should contain the preferred URL, reason, conflicting signal, correction and next inspection date.`,
  },
  {
    id: 90003,
    slug: 'merchant-center-feed-diagnostics',
    title: 'Merchant Center Feed Diagnostics: Fix the Product Record',
    description: 'A practical Merchant Center diagnostic workflow for product issues, price mismatches, availability and variant data, with a repeatable verification record.',
    keywords: ['Merchant Center feed diagnostics', 'product disapprovals', 'price mismatch', 'product availability', 'Shopping feed'],
    authorName: 'Jaymie Wilhoit',
    authorId: 2,
    layer: 'Demand',
    related: ['shopping-ads', 'shopify'],
    dateGmt: '2026-10-06T12:00:00',
    modifiedGmt: '2026-11-02T18:13:42Z',
    markdown: `A Merchant Center issue needs a product-level explanation. Changing a campaign budget cannot repair a price or an unavailable variant.

## 1. Record the reported issue

Capture the item ID, exact issue, destination, market and observation time. Group affected products by shared field or template before editing.

Use Google's [product data specification](https://support.google.com/merchants/answer/7052112?hl=en) to identify the relevant requirements. Missing attributes, landing-page mismatches and policy issues need different investigations.

## 2. Trace the item across systems

Compare the catalog record, submitted data, processed Merchant Center item and customer-facing page. Keep the market, currency and variant consistent. Open the actual submitted landing URL and continue through variant selection.

Record each field's source value, submitted value and page value. This shows whether the correction belongs in the catalog, integration mapping or storefront. Repair a shared source when several items have the same defect.

## 3. Check price and update timing

Google's [price mismatch guidance](https://support.google.com/merchants/answer/12159029?hl=en) covers agreement between submitted prices, landing pages and structured data. Compare the issue time with the price change and last successful feed update.

Inspect sale prices, dates and currency, including initial page data. Today's correct visible price does not establish what the crawler saw earlier. Check the selected variant rather than a product family's lowest displayed price.

## 4. Verify stock and variant identity

Test whether the affected option can actually be ordered. Google's [availability documentation](https://support.google.com/merchants/answer/6324448?hl=en) distinguishes in-stock, out-of-stock, preorder and backorder states; preorder and backorder require an availability date.

Compare sibling variants: individual IDs, option details, images and landing selections must describe the right item. Use genuine manufacturer identifiers where applicable. Do not invent identifiers or confuse a published page with available inventory.

## 5. Repair the source and recheck status

Assign the correction to the system that supplies the incorrect field. Google's [automatic update guidance](https://support.google.com/merchants/answer/12157888) states that these updates do not replace regular accurate product submissions.

After the next update, inspect the processed item and issue status. Keep submitted, verified on the page and approved as separate states. Follow the issue's specified review process where applicable.

**Diagnostic record:** item; issue; market; variant; source/page disagreement; correction owner; update time; current status.

Use the [Merchant Center checklist](/blog/shopify-google-merchant-center-checklist/) and [Shopify SEO launch guide](/blog/shopify-seo-launch-checklist/) for the wider setup. [Shopping ads](/services/shopping-ads/) decisions follow product eligibility; [Shopify work](/services/shopify/) fixes the storefront when the disagreement begins there.

## Example: a price mismatch on one size

Imagine a shirt whose medium costs $40 and large costs $45. The submitted large variant says $45, but its link opens the medium by default at $40. Changing the feed price to $40 would conceal the wrong landing selection rather than repair the large item.

Open the submitted URL as a customer, confirm the selected size, inspect the visible price and continue far enough to verify the purchase terms. Correct the variant link or source mapping, then wait for the next processing cycle and inspect that same item again. Keep item ID, market, source timestamp, landing option and issue status in the record. If eligibility remains blocked, follow the actual issue’s review instructions; do not repeatedly resubmit unrelated changes.`,
  },
  {
    id: 90004,
    slug: 'content-briefs-search-intent-internal-links',
    title: 'Content Briefs: Search Intent, Evidence and Internal Links',
    description: 'Build a useful content brief around a reader decision, verified evidence and contextual internal links. Include practical editorial and post-publication checks.',
    keywords: ['content brief', 'search intent', 'internal linking', 'pillar content strategy', 'SEO content planning'],
    authorName: 'Wendy Funnell',
    authorId: 3,
    layer: 'Demand',
    related: ['seo', 'ai-search-optimization'],
    dateGmt: '2026-10-06T12:00:00',
    modifiedGmt: '2026-11-02T18:10:55Z',
    markdown: `A useful brief tells the writer what the reader needs to decide, which evidence supports the answer and where to link next.

## 1. Name the reader and task

Describe the reader in one sentence. State the decision or task the article should support. “Desk lamps” is a topic; “choose lighting for a small desk without screen glare” is an assignment.

List what the reader already knows and what needs explanation. Place the assignment in the blog category aligned with its primary service or product collection. The [SEO category](/blog/category/seo/) is one example; the [SEO framework guide](/blog/four-pillars-of-seo-operators-view/) is an article within it.

## 2. Review queries and page formats

Search the relevant questions and record the formats you see: guides, comparisons, categories or troubleshooting pages. Date the observation. Use it to test the task you identified, rather than copying competitors' headings.

Google's [SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) recommends considering the language different readers use. Combine closely related questions when one useful page can answer them.

## 3. Specify the evidence

For each substantive claim, name the source: verified specifications, approved expert input, a demonstration or official documentation. Mark missing information before drafting. Label hypothetical examples as examples; keep private client figures out of public copy.

Google's [people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) emphasizes original value, clear sourcing and usefulness. It has no preferred word count. Include what completes the answer, then stop.

## 4. Outline the answer and links

Open with the answer or practical starting point. Give each section a clear job and identify its supporting evidence. Add exceptions where they change the decision.

Link to the appropriate category, a useful supporting article and a relevant next step. Specify the reason for each link. Google's [link guidance](https://developers.google.com/search/docs/crawling-indexing/links-crawlable) calls for crawlable links and descriptive, relevant anchor text. Verify destinations rather than inserting the same link list everywhere.

## 5. Assign review and maintenance

Name the writer and factual reviewer. Before publishing, check the opening, claims, examples, title, description, images and links. Set a review trigger, such as a specification change or a new unanswered customer question.

After publication, inspect relevant queries and page behavior against the original task. Use observations to improve missing explanations without turning one isolated query into a new strategy.

**Brief template:** reader; task; main question; verified sources; section jobs; pillar; supporting links; next step; writer; reviewer; update trigger.

Use the [channel planning framework](/blog/seven-digital-channels-which-to-skip/) to give content a job alongside the other channels. Connect assignments through the [content planning guide](/blog/content-marketing-plan-that-produces-pipeline/) and [SEO work](/services/seo/). Clear sourcing also supports [generative search optimization](/services/ai-search-optimization/), without promising citations.

## A completed brief: choosing a reporting dashboard

Here is an illustrative assignment for a business that sells reporting services. It is not a client case study.

| Brief field | Completed example |
| --- | --- |
| Reader | A business owner comparing reporting options after receiving conflicting revenue reports |
| Main question | What should we check before paying for a dashboard? |
| Category/pillar | Business intelligence, aligned with the reporting service |
| Article’s job | Help the owner prepare a short requirements list |
| Evidence | Approved source definitions, a labelled sample report and documentation for the source systems |
| Sections | Decision to support; records required; metric definitions; access; acceptance checks |
| Useful next links | Metric-definition guide, data-preparation guide, then the reporting service if implementation help is needed |
| Exclusions | No invented savings, no promise that connecting two tools reconciles their definitions |
| Deliverable | A one-page requirements checklist the reader can complete |

Notice that the brief gives the writer a decision to help with, not a keyword to repeat. The category holds this article alongside related guidance. The service page explains the commercial offer.

## Test the brief before commissioning it

Ask someone unfamiliar with the assignment to explain what the finished reader should be able to do. If the answer is “understand business intelligence”, the task is still too broad. In this example, they should be able to list the decision, source systems, definition questions and acceptance checks for their dashboard.

For each proposed link, finish the sentence “The reader needs this next because…”. Remove links without a useful answer. Use [Google’s link guidance](https://developers.google.com/search/docs/crawling-indexing/links-crawlable) for the technical checks, not as a reason to squeeze a link into every paragraph.

Use the downloadable workbook in the [content hub guide](/blog/build-a-content-hub-people-can-use/) to map the category and supporting pages. Your final brief should leave the writer room to write, while making the required evidence and outcome unmistakable.

[Download the content hub workbook](/downloads/content-hub-workbook.pdf) to record category scope, article assignments, links and launch checks. Complete the example brief above before handing the assignment to a writer.`,
  },
];
