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
    modifiedGmt: '2026-11-02T20:44:16Z',
    markdown: `A purchase event firing is not the same as a purchase being measured correctly.

Trace one controlled order before trusting the revenue chart.

## 1. Define the expected events

Write the shopping actions, triggers, source fields and implementation owner. Use Google's [ecommerce guide](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce) to map product views, cart actions, checkout, purchases and refunds to what actually happens in the store.

Choose a test order whose quantities, discounts and payment route are easy to inspect. Record its identifier without exposing customer details.

## 2. Inspect the purchase payload

Compare the sent fields with the order record. Google's [purchase reference](https://developers.google.com/analytics/devguides/collection/ga4/reference/events#purchase) specifies a unique **transaction_id** and an **items** array. Include **currency** when sending **value**.

Check product or variant identity, numeric prices and quantities, and the merchandise value: item price multiplied by quantity, summed across items. Keep shipping and tax in their separate parameters. Check the amounts even when the tag fires successfully.

## 3. Follow the journey in DebugView

Ask the person maintaining tracking to join the test. You need access to the intended Analytics property, a working tag installation and permission to place a controlled order. Establish how the order will be identified and refunded or cancelled in the store's accounting process before testing.

For a website, open Google's Tag Assistant, connect the public test URL and use the connected browser tab. Tag Manager users can start through Preview. Then open **Analytics → Admin → Data display → DebugView**, select the test device and perform one shopping action at a time. Open each event to inspect its parameters. This is the personal-device route in Google's [DebugView instructions](https://support.google.com/analytics/answer/7201382?hl=en); it avoids turning on debugging for every customer.

Select a variant, add to cart, change quantity and complete the controlled purchase. If nothing appears, first check the property, connected tab, selected debug device and consent state. A missing DebugView event is a problem to diagnose, not permission to add another tracking integration on top of the existing one.

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

![Illustrative order: two thirty-dollar bags produce sixty dollars in purchase value; six dollars shipping and four dollars tax are separate, making seventy dollars paid in total.](/media/blog-review/purchase-value-map.svg)

This is the corresponding illustrative event data. It is a comparison specimen for the person checking tracking, not code to paste into a live store:

\`\`\`json
{
  "event": "purchase",
  "transaction_id": "TEST-1001",
  "currency": "USD",
  "value": 60,
  "shipping": 6,
  "tax": 4,
  "items": [
    { "item_id": "BAG-BLK", "item_name": "Black day bag", "price": 30, "quantity": 2 }
  ]
}
\`\`\`

The event name is shown with its parameters for readability. The actual sending format depends on the installed integration. Google supplies both tag and Tag Manager examples in its [ecommerce implementation guide](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce).

| Test | Expected comparison | What a failure tells you |
| --- | --- | --- |
| Original purchase | Two units × $30 = $60 merchandise value; $6 shipping and $4 tax remain separate | $70 in merchandise value would mix definitions |
| $5 discount per unit in a separate test | Discounted item price $25, quantity two, merchandise value $50 | Subtracting that discount again would understate the purchase |
| Confirmation reload | No new purchase submission; original transaction identity retained | A second sender or repeated trigger needs investigation |
| One-unit refund | Original transaction ID and refunded item's quantity one; merchandise refund $30 | A refund without the item detail cannot support the same item-level check |
| Declined payment | No completed purchase for an order that never succeeded | The trigger may be tied to a button click instead of completion |

[Download the order-event test sheet](/downloads/ga4-order-test.csv). Record expected and observed values separately, including the consent state and the later report check. Keep the test orders out of commercial conclusions. Close the test session afterwards; if a developer added a debug parameter manually, they should remove it rather than assuming setting it to false disables debugging.`,
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
    modifiedGmt: '2026-11-02T20:44:16Z',
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

## Fill the inspection record before asking for a fix

Use the paired-URL example in our [duplicate-content guide](/blog/duplicate-content-isnt-a-penalty-but-its-a-tax/) and [download its canonical inspection sheet](/downloads/canonical-inspection.csv). Here is how to populate the Google-specific fields.

Paste the exact affected URL into Search Console's inspection bar and run the inspection. Expand the indexing details and copy the user-declared and Google-selected canonical values where available, plus the last-crawl date. Repeat for the preferred URL. Missing information stays “not available”; it does not mean that Google agrees with your preference.

Illustrative result: the parameter URL declares itself, Google selects the clean URL, and both show the same product. This may already be a sensible Google selection. The repair is the site's conflicting declaration and internal link—not an attempt to force Google to index both copies. If instead Google selects an unrelated collection, first compare the actual product content and inspect whether the intended page redirects or has an access problem.

After the developer changes the conflicting signal, open the published URL and repeat the live check. Record, for example, “200; clean product canonical; category link corrected” in the live-result column. Leave the indexed-result column pending until the inspected crawl reflects the change. A screenshot of the deployment succeeding cannot fill that column.`,
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
    modifiedGmt: '2026-11-02T20:44:16Z',
    markdown: `A Merchant Center issue needs a product-level explanation. Changing a campaign budget cannot repair a price or an unavailable variant.

## 1. Record the reported issue

Open **Products → Needs attention** in Merchant Center and select the relevant issue. The [issue details page](https://support.google.com/merchants/answer/16431300?hl=en) explains the issue, affected product samples and available corrective or review actions. Download the affected-product list when you need to check a group rather than the displayed sample.

Capture the item ID, exact issue, destination, market and observation time. Open the affected item's details and identify the data source supplying it. Compare the processed fields with that source's latest submission and the actual linked product page. Group affected products by shared field or template before editing.

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

The filled comparison looks like this. All values are illustrative.

| Layer | Large shirt record | Conclusion |
| --- | --- | --- |
| Store catalogue | SHIRT-L, size large, $45 | Source price describes large |
| Submitted item | SHIRT-L, $45, URL selecting medium | The link mapping disagrees with the item |
| Merchant Center processed item | Same submitted large ID and $45 | Processing retained the submitted price |
| Landing page | Medium selected, $40 | The customer reaches the wrong variant |
| After correction | URL selects large; visible page and cart show $45 | Live journey repaired; processed issue status still requires recheck |

Use the [variant comparison sheet](/downloads/product-variant-comparison.csv) to retain those fields for each affected item. Open the submitted URL as a customer, confirm the selected size, inspect the visible price and continue far enough to verify the purchase terms. Correct the variant link or source mapping, then wait for the next processing cycle and inspect that same item again. Keep item ID, market, source timestamp, landing option and issue status in the record. If eligibility remains blocked, follow the actual issue’s review instructions; do not repeatedly resubmit unrelated changes.`,
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
    modifiedGmt: '2026-11-02T20:44:16Z',
    markdown: `A useful brief tells the writer what the reader needs to decide, which evidence supports the answer and where to link next.

## Start with the existing pages and a real customer question

Before you start, gather your service or collection list, the existing blog URLs, the customer question and any approved source material. A spreadsheet is enough. Search your own site for the question and inspect the closest existing pages. If one already answers it, commission an update with a precise gap list instead of another competing article.

Describe the reader in one sentence and name the task. “Desk lamps” is a topic; “choose lighting for a small desk without screen glare” is an assignment. List the questions the answer must resolve and the evidence you can actually supply.

The pillar is the category aligned with the service or collection. The article sits inside it. A commercial service page has a different job: helping someone choose and enquire about the offer. Do not turn all three into copies of the same sales pitch.

![Business intelligence service aligns with its blog category; the dashboard preparation article sits in that category and links to a useful supporting guide and the service when relevant.](/media/blog-review/content-brief-map.svg)

Google's [people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) emphasises original value, clear sourcing and usefulness. It has no preferred word count. Decide what the reader needs to finish the task, then commission that work.

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

## Specify the links and their purpose

For the dashboard example, make the linking instructions specific enough to implement:

| Placement | Link text and destination | Why it belongs there |
| --- | --- | --- |
| Category navigation | [Business intelligence articles](/blog/category/business-intelligence/) | Houses this and other articles about reporting decisions |
| Section explaining conflicting figures | [Define the reporting measures](/blog/business-intelligence-basics/) | Helps the owner identify definitions before comparing tools |
| Section on website purchase records | [Check an ecommerce purchase event](/blog/ga4-ecommerce-event-validation/) | Relevant only when the example uses website purchase tracking; omit it for other data |
| Final implementation step | [Business intelligence support](/services/business-intelligence/) | Gives the reader somewhere to ask for help with the requirements they have assembled |

Also choose an existing article that should link **to** the new one. Note the paragraph and proposed link wording, then review that change when the new article goes live. A link plan needs incoming routes as well as exits. There is no useful universal quota for links.

Google's [link guidance](https://developers.google.com/search/docs/crawling-indexing/links-crawlable) explains crawlable links and useful anchor text. Verify each destination and the reason for including it; a link quota is not an editorial strategy.

## Copy this assignment into your next brief

Complete the fields below. The downloadable version has space for the answers, a worked example and a separate review checklist.

- **Reader and starting knowledge:** who is doing the task, and what can we reasonably assume they know?
- **One question and finished outcome:** what will the reader be able to decide, prepare or do?
- **Category and commercial connection:** which service or collection does the category support? Which existing article could be updated instead?
- **Required answer:** write a provisional two-sentence answer. List anything that still needs confirmation.
- **Section plan:** give each section a reader question, an answer to develop and a piece of evidence or a demonstration.
- **Evidence register:** record each consequential claim, its exact source, what the source supports, the date checked and the reviewer. Mark any example figures as illustrative.
- **Link plan:** record source paragraph, destination, proposed link text and reader benefit. Include an incoming link from an existing page.
- **Instructional resource:** specify what the reader should fill in or learn from the diagram. A decorative featured image does not do this job.
- **Boundaries:** list what the article will not cover, including topics already handled elsewhere.
- **Delivery and review:** name the writer, factual reviewer, due date, approval owner and event that should trigger an update.

For the dashboard assignment, the opening answer might be: “Before buying a dashboard, write down the decision it must support, the source records and the definitions behind its numbers. Agree on a small example that both you and the supplier can calculate before approving the full report.” The article then shows how to do each part. “Explore the power of data” can remain in the bin.

## Run a practical handover check

Give the brief to the writer and ask them to describe the planned example, the source they will use and the finished reader outcome. Resolve disagreements before drafting. If a claim has no usable evidence, remove it or commission the missing research; an empty source field is not permission to improvise.

When the draft returns, work through its instructions as the intended reader. Can you produce the promised requirements list using the article alone? Open every source and check the actual claim, test the download, and follow the links on a phone. Send back specific omissions such as “show how the owner checks the refund definition”, rather than “make this more authoritative”.

After publication, open the final URL, confirm its category listing and incoming link, and check that the title, summary and search description describe the article you actually published. Record a review date and a change trigger. Search appearances and enquiries can inform later improvements; one new query does not justify rewriting the whole assignment.

[Download the content brief and review worksheet](/downloads/content-brief-worksheet.pdf). It includes the dashboard example, a fillable assignment, a source-and-link record and the handover checks. Use the [content hub guide](/blog/build-a-content-hub-people-can-use/) and its [planning workbook](/downloads/content-hub-workbook.pdf) when deciding how this assignment fits the wider category and article collection.`,
  },
];
