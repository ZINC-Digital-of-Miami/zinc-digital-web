import type { AddedArticle } from './article-additions.ts';

export const articleFeatures: AddedArticle[] = [{
  id: 94001,
  slug: 'wordpress-php-security-moving-to-astro',
  title: "WordPress security—and why we moved ZINC to Astro",
  description: "Astro does not use PHP. Kirk explains what WordPress owners should check now, why ZINC moved, and what a sensible website migration should include.",
  keywords: ['WordPress security', 'PHP security update', 'WordPress to Astro migration', 'Astro website'],
  authorName: 'Kirk Musick, MS, MBA',
  authorId: 1,
  layer: 'Build',
  format: 'feature',
  related: ['web-design', 'seo'],
  dateGmt: '2026-10-27T11:00:04Z',
  modifiedGmt: '2026-11-03T14:53:14Z',
  markdown: `You should not have to become your website’s IT department.

But if nobody can tell you who handles its security updates, you already have a problem. A good-looking homepage does not answer that question.

WordPress runs on PHP. On October 21, 2026, the PHP team released fixes for two critical security flaws that could let an attacker run code on an affected server. In plain English: this is something your hosting company needs to check, even if your website appears to work perfectly.

The [official PHP notice](https://www.php.net/archive/2026.php) has the technical details. You do not need to memorize them. You need someone accountable for fixing the right thing.

![A platform change moves responsibility. 01 / Address the immediate issue: Confirm current PHP fixes: Test forms, logins and checkout: Save who checked and when. 02 / Choose the editing arrangement: Keep WordPress: maintain PHP too: Replace it: test the new editor: Inventory every required function. 03 / Verify the replacement: Check old links and public pages: Confirm the receiving form record: Name support and recovery owners](/media/blog-review/platform-responsibility.svg)

## Deal with the security issue first

Send your host or agency this:

> Please confirm that the PHP software running our website has the current security fixes, including the October 21 advisories and any follow-up updates that apply to our hosting. Please also confirm that our forms, logins and checkout still work after the update.

Ask who completed the check and when. Save the answer.

Updating WordPress and updating the PHP software underneath it are separate jobs. “We updated your plugins” does not answer both. PHP published additional guidance on October 23 and updated Windows packages on October 26, so the person responsible should check the current notices rather than stop at an old version number.

If your site may already have been compromised, get your host involved immediately. Rebuilding it does not replace investigating what happened.

Then, once the immediate issue is handled, have the bigger conversation.

## Is the website earning its upkeep?

WordPress can be the right choice. It has a familiar editor, a huge ecosystem and plenty of businesses running it successfully.

What I question is keeping a setup nobody would choose again simply because it is already there.

If changing an ordinary service page starts a chain of plugin updates, compatibility checks and support tickets, ask what you are getting in return. The useful comparison is the total effort needed to keep the site working: hosting, support, editing, maintenance and the cost of things going wrong.

Your website does not need its own management committee.

A business with memberships, bookings and a complex WooCommerce store has a different decision from a company that needs service pages, useful articles, proof of its work and an inquiry form.

Start with what customers and your team actually use. Then choose the technology.

## Astro does not use PHP

**Astro itself does not use PHP. Neither does our Astro website need WordPress running behind it.**

We moved ZINC’s public site from WordPress to Astro. Our public pages are prepared ahead of time and served to visitors, instead of WordPress assembling those pages when someone requests them.

For our site, that removes the WordPress themes, plugins and PHP installation from the public website’s operating requirements. It gives us direct control over the design and how the site works.

That is a real architectural difference. It is not a promise that nothing can ever break.

Our inquiry form and private administration still need proper security and maintenance. So do the services and software they depend on. We chose a different setup; we did not discover a website that looks after itself.

There is one detail worth getting right: an agency can put an Astro website in front of WordPress and keep WordPress for editing. [Astro supports that arrangement](https://docs.astro.build/en/guides/migrate-to-astro/from-wordpress/). If you choose it, the WordPress part still uses PHP and still needs updating.

Ask whether the proposal replaces WordPress or just changes the part visitors see.

## Three sensible choices

| Your situation | The option worth considering |
|---|---|
| WordPress works well, your team likes the editor and maintenance is handled properly | Keep it. Fix the current security issue and maintain it. |
| Your editors need WordPress, but the public site needs a different design or delivery setup | Consider Astro with WordPress retained for editing. Budget for maintaining both. |
| You want to replace WordPress and its plugin dependencies on a content-led business site | Assess a complete move to Astro, including a suitable way for your team to edit content. |

The editing part matters. You should be able to change a phone number, add a case study or publish an article without wondering whether you need to learn to code.

An agency should show you that process before you agree to it.

## What we should bring across

A migration is more than rebuilding the homepage and moving the logo.

Your articles, images, useful page addresses and search visibility have value. So do the less visible things that keep business moving: where inquiries go, how appointments are booked, whether a purchase is measured and who receives an error notification.

For a move to Astro, I would expect the project to include:

- **An inventory of what you have.** Pages, articles, images and the features customers actually use.
- **A plan for every necessary function.** Explain how forms, search, bookings or other tools will work after the move.
- **A working editing demonstration.** Let your team try the tasks they will do regularly.
- **A plan for old links.** Keep useful addresses where possible. Send changed addresses to their proper replacements, rather than dumping everything onto the homepage.
- **Checks on the finished site.** Open it on a phone. Send an inquiry. Follow an old link. Verify that the right person receives the message.
- **Clear responsibility after launch.** Know who handles support, updates and recovery.

Google’s [migration guidance](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes) explains why changed URLs and redirects need care. A new platform does not give you a fresh start on the search value you have already earned. Our [SEO framework](/blog/four-pillars-of-seo-operators-view/) covers the connected work behind that visibility.

## Ask for a recommendation you can understand

At ZINC, we can assess whether to improve the WordPress site you have or build an Astro replacement as part of our [website design and development work](/services/web-design/).

The recommendation should explain what gets easier, what still needs maintenance, how your team edits the site and what the move costs to deliver and support. You should not need a technical translator to compare the options.

Get the current security issue handled. Then make the platform decision around the business you run.

That is the job the website is there to do.

## Compare the upkeep before choosing a platform

Use one row per business function: editing, forms, bookings or checkout. Record the current arrangement, the proposed replacement and who will test it. The specimen is fictional; security confirmation and migration acceptance stay pending until someone verifies them.

[Download the website platform decision sheet](/downloads/website-platform-decision.csv). Open the CSV in your spreadsheet application, keep the specimen labelled, and add your own rows. Pending observations are work to complete, not failed or successful results.`,
}, {
  "id": 94002,
  "slug": "build-a-content-hub-people-can-use",
  "title": "Build a content hub people can actually use",
  "description": "Plan service-aligned blog pillars, map topics and links, and use a complete launch checklist with illustrated, fillable PDF tools.",
  "keywords": [
    "content hub",
    "content planning",
    "internal linking",
    "business blog"
  ],
  "authorName": "Wendy Funnell",
  "authorId": 3,
  "layer": "Demand",
  "format": "feature",
  "related": [
    "seo",
    "ai-search-optimization"
  ],
  "dateGmt": "2026-10-30T14:04:34Z",
  modifiedGmt: '2026-10-30T14:39:19Z',
  markdown: `A pile of articles is not a pillar strategy. Neither is a page called “Resources” with everything filed under “Latest”.

A useful content hub helps a particular customer understand a subject, explore the questions that matter and take a sensible next step. You need to decide what the main guide owns, which questions deserve separate pages and how the collection supports the business.

This guide walks through those decisions, with illustrated maps and a checklist you can use to sign off the work.

**Take the tools with you:** [Download the six-page content hub workbook (PDF)](/downloads/content-hub-workbook.pdf) for a worked example, fillable planning sheets and the complete checklist. [Download the illustrated architecture reference (PDF)](/downloads/content-hub-architecture.pdf) to share with your writer or website team. No email required.

## 1. Start with the service or collection, then its blog category

A **pillar is a main blog category aligned with a primary service or product collection**. It houses the blogs about that main topic. For a cleaning business, “Regular home cleaning” can be a pillar aligned with that service. For a shop, a product collection such as “Garden lighting” can anchor the category.

The **category landing page** is the hub: it introduces the topic and helps readers find the relevant blogs. It should explain what belongs there and organise the articles around useful questions. An article can be a substantial guide, comparison or how-to inside that category; the article itself is not the category.

A **topic cluster** is a related set of articles within the pillar. It lets you plan narrower questions without creating a new top-level category for every keyword. A service or collection page remains the commercial destination, describing the actual offer and helping someone enquire or buy.

This is ZINC's editorial planning model, not a special Google ranking feature. Google's [SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) supports logical organisation and useful information. Neither a category name nor a fixed number of posts guarantees authority.

![A regular-home-cleaning pillar category aligned with that primary service houses a choosing guide and four related blogs. A separate service page provides the commercial next step.](/media/content-hub/pillar-map.svg)

*The category houses the articles. The service page sells the service. A broad guide is one article within the category, not a replacement for the category.*

## 2. Set the business goal and the boundaries

Choose an offer the collection should support, the reader and the decision they need help making. A topic can attract attention while being a poor fit for what you sell.

Our **illustrative example** is an imaginary residential cleaning business. These are planning examples, not a client project or measured results.

- **Business goal:** help suitable households request a regular-cleaning quote.
- **Reader:** a homeowner considering professional cleaning for the first time.
- **Pillar category:** Regular home cleaning, aligned with the service of the same name.
- **Inside the boundary:** inclusions, frequency, quote factors and first-visit preparation.
- **Outside the boundary:** office cleaning, holiday-rental changeovers and detailed end-of-tenancy advice. Those serve different situations and may need their own collections if the business offers them.
- **Commercial destination:** the regular-cleaning service page and quote form.

“Everything about cleaning” leaves an endless assignment. “Why weekly cleaning is good” is a blog subject within it. The category should hold several related questions without swallowing the rest of the website.

Gather actual customer enquiries, existing pages and input from the people delivering the service. Reliable Search Console data can add questions and landing pages to investigate. It describes searches where your site appeared, rather than every question your market might ask.

## 3. Map the questions before commissioning pages

**Search intent** means what someone is trying to accomplish: learn, compare, prepare or buy, for example. Similar wording can hide different tasks. Different wording can describe the same task.

Review customer questions and current search results for representative phrases. Note the date, location and kinds of pages you see. Use results to test assumptions, rather than copying competitors' headings.

Assign each meaningful task a preferred existing or proposed page, the evidence it needs and a suitable next action.

| Reader task | Page that owns the answer | Depth and next step |
|---|---|---|
| Understand how to choose a provider | Guide within the category: choosing regular home cleaning | Explain scope, options, quotes and preparation; signpost detailed answers. |
| Check tasks and exclusions | What's included in a regular clean? | Give the verified task list and exclusions; return to the guide or view the service. |
| Decide visit frequency | Weekly or fortnightly cleaning? | Compare household needs and trade-offs; link to inclusions where useful. |
| Understand a quote | What affects the price of home cleaning? | Explain genuine quote factors and required details; link to the quote request. |
| Prepare for a booked visit | How to prepare for your first clean | Give practical access and preparation instructions. |
| Choose this business and enquire | Regular home-cleaning service | State the actual offer, service area, proof, process and contact route. |

These are suggested titles, not measured search demand. Four supporting pages fit this example; there is no minimum cluster size.

**Do not create one page per keyword variation.** “What's included in a weekly clean?” and “What does regular cleaning cover?” may need the same answer. A price explainer and a booking page can share language while serving different purposes.

## 4. Audit what exists and resolve overlap

Record each relevant page's address, purpose, accuracy, useful material, known incoming links, owner and proposed action. Choose:

- **Keep:** it answers its assigned question accurately. Add missing links or navigation.
- **Update:** it owns the right question but needs evidence, detail or a clearer next step.
- **Combine:** pages substantially answer the same question without a separate purpose. Preserve useful material and plan what happens to the retired address.
- **Create:** a necessary question has no suitable existing answer.

Two pages mentioning the same phrase is not proof of a problem. Look for competing purposes, unnecessary duplication or customers reaching the wrong answer. One quiet month is not a deletion reason.

For a combination, choose the destination, preserve useful content, arrange a relevant redirect for the retired address and update internal links. Have your website team verify it. A canonical tag does not fix two poorly scoped articles; Google's [canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) concerns duplicate or very similar URLs.

The workbook has space for the old address, action and replacement. Do not approve a “merge” with no destination recorded.

## 5. Build the category hub and useful articles inside it

The category hub should introduce the main topic, explain its relationship to your service or collection, and make its blogs easy to find. A bare chronological list gives the customer little help choosing where to start.

Organise the posts by task: understanding the service, comparing options, planning the budget and getting ready. Give each link a useful description. If a comprehensive introductory guide would help, publish it as a blog within the pillar and signpost it from the category hub.

For the cleaning example, the category hub offers routes to the choosing guide, inclusions, frequency, quote factors and first-visit preparation. The choosing guide gives a substantial answer to its own broad question, summarises the relevant decisions and links to detailed posts. It should still be useful without opening every link.

Give the reader a clear opening answer, a defined scope, navigable headings, relevant examples, appropriate evidence and a sensible next action. There is no word-count quota. Include what completes the answer.

Write supporting pages from focused briefs: the question, what the category overview or another guide already covers, facts to check and the useful next page. Our [content brief guide](/blog/content-briefs-search-intent-internal-links/) explains that assignment.

The inclusions page needs the real exclusions; the price page needs the genuine quote factors. Neither needs an invented national average. Google's [helpful-content questions](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) offer a useful editorial check for originality, completeness and trust.

## 6. Specify the links and navigation

A list of URLs in a spreadsheet does not create the connections on your website. Name where each link belongs and why a reader would use it.

![The category hub links to its blogs, which offer a route back to the category. Selected related answers connect contextually, and useful commercial links lead to the separate service page.](/media/content-hub/link-plan.svg)

*The category membership and the separate comparison and quote routes serve different reader needs. Every page does not need to link to every other page.*

For the example:

- The category hub links to every published blog it houses, including the frequency comparison.
- The comparison offers a clearly labelled route back to its category and links to inclusions where readers need to check what they are comparing.
- The price article links to the quote request after explaining the information required.
- The service page offers explanatory guidance for customers who are not ready to enquire.
- Relevant navigation or existing content links to the category hub so the blogs can be found.

Use link wording such as **what's included in a regular clean**. Google's [link guidance](https://developers.google.com/search/docs/crawling-indexing/links-crawlable) explains crawlable links and meaningful wording. Ask your website team to verify that links work on a phone and reach the intended addresses.

You do not need to move every URL into a new folder. Keep useful addresses unless there is a sound reason to change them. Breadcrumbs or a visible category label can explain which pillar houses a post, but do not replace useful contextual links. Avoid rigid silos that hide relevant answers elsewhere on the site.

## 7. See how this article fits ZINC's SEO pillar

This article belongs to the [SEO blog category](/blog/category/seo/), aligned with our [SEO service](/services/seo/). That category houses the blogs about SEO, including content planning, technical search work and measurement. It is the pillar; this how-to is one blog within it.

Within that category, these related blogs form the content-planning cluster:

- [Write a content brief](/blog/content-briefs-search-intent-internal-links/) to assign the question, evidence and links.
- [Audit internal links](/blog/internal-link-audit/) to check whether the planned routes exist.
- [Check a service page](/blog/service-page-content-checklist/) to make the commercial destination clear.
- [Review existing content](/blog/content-refresh-review/) to decide what needs keeping, updating or combining.
- [Plan content for AI discovery](/blog/ai-search-content-strategy/) to review answer quality and evidence.

The [SEO framework](/blog/four-pillars-of-seo-operators-view/) explains technical SEO, content, authority and experience as disciplines. Its “four pillars” title describes those disciplines; it does not define four blog categories. Keep the category structure tied to the business's services and collections.

## 8. Complete the launch checklist

Use **Pass / Fix / Not applicable**, record evidence and give unresolved issues an owner. The workbook contains the same checks, with status boxes and a review record. “Looks fine” is not particularly useful to the next person.

**Strategy and page ownership**

- Reader, business goal, pillar category, aligned service or collection, and excluded subjects are recorded.
- Each planned page has one primary reader task, a preferred address and next action.
- Similar questions have been reviewed together; unnecessary duplicates are resolved.
- Existing useful material is accounted for before new pages are commissioned.

**Content and evidence**

- The category hub introduces the topic and houses the relevant blogs; each guide answers its own question in substance.
- Blogs within the category add distinct answers rather than repeating one another.
- Service details, prices, exclusions and procedures match the current offer.
- Claims have suitable sources or a factual reviewer; examples are labelled.
- Each page has a useful title, headings, descriptive search summary and accurate author or reviewer identity.

**Links and technical delivery**

- The category hub links to the blogs it houses, which display a route back to the category.
- Contextual links connect related answers where helpful, without compulsory links to everything.
- Relevant navigation or content reaches the category hub; no required page is isolated.
- Links reach correct live destinations; redirects and replacement links are verified.
- The website team has checked successful responses, indexing access and preferred addresses; intended public pages have no accidental draft blocking.
- The sitemap includes the intended public pages; structured data, if used, matches visible content. Neither guarantees indexing or ranking.

**Customer use and downloads**

- Someone who did not write the guide can find the answer and complete the intended task.
- Mobile headings, diagrams, tables and links are usable; keyboard users can reach actions.
- Images have useful alternatives; important information is also explained in the text.
- Downloads open, contain the promised pages and have descriptive names; workbook fields can be used or printed.
- The form, checkout or booking route works, including confirmation and delivery to the right person.

**Ownership and measurement**

- Someone owns factual approval, publication and maintenance.
- The team has recorded the collection's pages and measures it can reliably use.
- Existing performance is recorded with dates and known limitations.
- A review date and triggers are assigned: changed services, questions, links or instructions.

Fix failures that prevent an accurate answer or a completed task before calling the hub ready. Mark not applicable only with a reason. An unanswered check is not a pass.

## 9. Measure the collection and improve the weak answer

Review the pillar category and its blogs as a group as well as individually. Search Console can help compare relevant queries and pages. Website analytics may show movement between pages and completed enquiries where those events work correctly.

Choose measures suited to the purpose: visibility for relevant questions, visits to useful answers, quote requests and questions still reaching your team. A preparation guide can help an already-booked customer even if it rarely starts an enquiry.

Record a baseline, comparable review dates, changes and who owns the response. Allow for low volumes, seasonality and other campaigns. Enquiry growth alone does not prove the hub caused it. A download count shows interest in a tool, not successful use.

If the audience is wrong, review scope. If the next answer is hard to find, repair the route. When the offer changes, update the affected pages together. Use our [content refresh process](/blog/content-refresh-review/) for the maintenance work.

Google's [AI search guidance](https://developers.google.com/search/docs/appearance/ai-features) does not prescribe a special category format or promise inclusion. Treat citations as something to observe, not something a diagram can guarantee.

## Download the planning pack

- [Six-page content hub workbook — fillable PDF](/downloads/content-hub-workbook.pdf): worked architecture, scope brief, question-to-page map, audit and linking plan, complete checklist and measurement record.
- [Two-page architecture and linking reference — PDF](/downloads/content-hub-architecture.pdf): both illustrations with explanations.
- [Pillar architecture illustration — SVG](/media/content-hub/pillar-map.svg) and [linking illustration — SVG](/media/content-hub/link-plan.svg): scalable copies for working documents.

Print the workbook or fill its fields in a PDF reader that supports forms. Keep a copy with the work you commission so the writer and website team use the same decisions.

Start with one commercially relevant subject, align its category with the service or collection, give each blog a clear responsibility and check the complete journey. Our [SEO service](/services/seo/) covers the connected content and technical work when you need help.`,
}, {
  "id": 94003,
  "slug": "what-can-you-afford-to-spend-on-an-order",
  "title": "What can you afford to spend on an order?",
  "description": "Calculate an order’s media spending limit after discounts, returns, delivery and fees. Includes a worked example, Excel calculator and fillable checklist.",
  "keywords": [
    "ecommerce acquisition cost",
    "order contribution margin",
    "customer acquisition cost",
    "break-even ROAS"
  ],
  "authorName": "Jaymie Wilhoit",
  "authorId": 2,
  "layer": "Demand",
  "format": "feature",
  "related": [
    "shopify",
    "shopping-ads",
    "business-intelligence"
  ],
  "dateGmt": "2026-11-02T15:13:34Z",
  markdown: `A sale can look great in the ad account and leave very little in the bank.

Before you raise the budget, work out what one order leaves after the product, delivery, discounts, refunds and the cost of getting it out the door. Then decide how much of that money you can spend to win it.

This is a first-order spending limit, not a lifetime-value forecast. You can build it with your store records, fulfilment bills and advertising costs. No dashboard overhaul required.

**Use the tools:** [Download the order economics calculator (Excel)](/downloads/order-acquisition-calculator.xlsx) for the worked example, editable inputs and a downside test. [Download the illustrated worksheet and sign-off checklist (PDF)](/downloads/order-acquisition-worksheet.pdf) for your next budget conversation. The spreadsheet calculates; the PDF is fillable and printable. Neither needs an email address.

## 1. Pick the orders you are actually measuring

Start with a group of first orders placed by new customers in one period. Choose a currency, a timezone and a date when you will check their refunds again. Keep one row per order and a separate customer identifier so you can distinguish an order from a person.

You need:

- Order-level product charges, discounts, refunds, shipping collected and tax.
- Product costs, outbound delivery, packing, fulfilment, payment fees and return costs.
- Advertising spend plus the other acquisition costs you intend to include, such as campaign creative and agency fees.
- A sensible amount to retain for overhead and profit, agreed with whoever owns the finances.

Use an older group of orders whose normal return window and processing lag have passed. For a new offer, use a clearly labelled estimate based on similar products, then replace it with actual results. A week with no refunds yet is not evidence that refunds cost nothing.

Exclude test and duplicate orders. Record how you handle unpaid orders, cancellations, exchanges, chargebacks and replacements. A canceled order can still leave a fee or fulfilment cost; do not erase the cost because the sale disappeared.

This guide uses **100 paid first orders from 100 distinct new customers**. All dollar amounts below are invented USD examples, not ZINC or client results. A fully refunded order remains in that original group of 100.

## 2. Find the money those orders keep

For this worksheet, retained revenue means product sales after discounts and product refunds, plus shipping income after shipping refunds. It excludes sales tax and duties collected for others. Keep all the inputs on that same basis.

| Per original first order | Illustrative amount |
|---|---:|
| Product price before discounts | $100 |
| Less discounts | −$10 |
| Less product refunds and other product revenue reversals | −$8 |
| Add shipping collected, after shipping refunds | $4 |
| **Retained revenue** | **$86** |

Across 100 orders, that is $8,600. Do not subtract the $8 again if your starting export already includes those refunds.

Shopify's [sales report definitions](https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/report-types/default-reports/sales-report) distinguish net sales from total sales, which also includes items such as tax and shipping. They also explain why a reversal can land on a later date. For this calculation, match later adjustments back to the original order group rather than comparing an order month with an unrelated refund month.

An ad platform's purchase value may use a different basis. Write down what it includes before comparing it with your worksheet. Our [ecommerce event validation guide](/blog/ga4-ecommerce-event-validation/) helps you check what the website sends.

## 3. Subtract the cost of serving the order

Revenue does not tell you what is available for marketing. Subtract the costs that rise with these orders.

| Per original first order | Illustrative cost |
|---|---:|
| Product cost, net of verified recovery on returned stock | $32 |
| Outbound delivery paid by the store | $8 |
| Packaging, picking and fulfilment | $4 |
| Payment and transaction fees actually retained by providers | $3 |
| Return labels, inspection and handling | $3 |
| **Total order costs** | **$50** |

**$86 retained revenue − $50 order costs = $36 before acquisition spending.** That $36 is the order's contribution: the money left to help pay marketing, overhead and profit. It is not net profit.

Count shipping income and delivery cost separately. “Free shipping” removes the customer's charge; it does not remove your carrier bill. Keep refunded product value in the revenue section and return labels or handling in the cost section.

If returned stock is genuinely sellable again, use a documented cost recovery. Do not assume every return recovers its full cost, or count a write-off twice. Include chargeback losses and fees where applicable without also subtracting a loss already included in revenue reversals. Ask your bookkeeper to confirm the treatment.

Shopify's [profit report guidance](https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/report-types/default-reports/profit-reports) notes that product profit reporting depends on cost information recorded at the time of sale. Check missing costs before trusting the margin. For this budget decision, add the other order costs above rather than treating product gross profit as the full answer.

![Illustrative first-order spending bridge: $86 retained revenue less $50 order costs leaves $36; less $6 other acquisition cost and $12 retained for overhead and profit leaves an $18 media ceiling.](/media/order-economics/spending-bridge.svg)

*All amounts are per original first order in the same example. The $12 is a chosen business allowance, not an industry benchmark.*

## 4. Give the remaining money a job

You could spend the whole $36 acquiring the customer and leave nothing from that first order for rent, salaries or profit. That is a break-even limit before overhead, not a comfortable budget.

In this example, the business wants to retain **$12 per first order** for overhead and profit. That leaves **$24 for total acquisition costs**.

It also allocates **$6 per first order** to campaign creative and agency fees. Those costs are outside the media budget, so the remaining **media ceiling is $18 per first order**.

> Media ceiling per first order = retained revenue − order costs − other acquisition costs − amount retained for overhead and profit.

Here, **$86 − $50 − $6 − $12 = $18**.

Allocate shared creative and agency costs once, using a written rule. Do not charge the same fee to every channel and then add the channels together. Fixed overhead belongs in the business allowance unless you have deliberately allocated it elsewhere; avoid counting it twice.

If the answer is zero or negative, the first order cannot fund paid media while meeting your chosen allowance. Review the offer, costs or allowance before buying more traffic. Do not turn a negative answer into a positive target by dropping an inconvenient cost.

## 5. Keep cost per order and customer acquisition cost separate

**Media cost per first order** is advertising spend divided by the first orders in the group. **Fully loaded customer acquisition cost**, or CAC, is the acquisition spending you have defined divided by distinct new customers. A repeat order is not another new customer.

Our example happens to have 100 first orders and 100 new customers, so the denominators match:

- Media spend: $1,800 ÷ 100 first orders = **$18 per first order**.
- Other acquisition costs: $600 ÷ 100 new customers = **$6 per new customer**.
- Fully loaded CAC: ($1,800 + $600) ÷ 100 new customers = **$24**.
- Money retained: $8,600 − $5,000 − $1,800 − $600 = **$1,200**, or **$12 per original first order**, before overhead and profit are paid.

In a real business, advertising spend may also support repeat orders and people who do not buy. Explain the allocation and call an unallocated storewide number a blended measure. Do not label it a channel's proven CAC.

Two ad platforms can both claim the same sale. Adding those reported purchases does not produce a count of unique new customers. Use store order and customer records for that count, and state that attribution cannot prove how many sales the advertising caused.

## 6. Translate the ceiling into a useful ROAS check

Return on ad spend, or ROAS, divides the purchase value being measured by media spend. Google explains that relationship in its [Target ROAS guidance](https://support.google.com/google-ads/answer/6268637?hl=en). The value you send is part of what determines the number you see.

On **this worksheet's retained-revenue basis**, $86 ÷ $18 gives about **4.78× ROAS**, or **478%**. That is the illustrative media ceiling translated into a revenue ratio. It is not a target to copy into an ad account that reports gross sales, tax, different refunds or a different customer mix.

With the same $6 of other acquisition cost but **no $12 allowance**, the media-only break-even ceiling would be $30. That is $86 ÷ $30, or about **2.87× ROAS**, before overhead and profit. You can hit that ratio and still have no money left for the business.

Use ROAS as a cross-check on a defined calculation. It cannot replace the order costs, and a bidding target does not guarantee an achieved result.

Before changing a [Shopping campaign](/services/shopping-ads/), check the product mix and feed as well. Our [Shopify launch guide](/blog/shopify-seo-launch-checklist/) covers the store and product-data foundations; an affordable order still needs a working checkout.

## 7. Test the offer before you scale it

The calculator includes a downside scenario. Keep the allowance and other acquisition costs visible while changing the parts of the offer that move.

| Change from the example | Revised media ceiling |
|---|---:|
| No change | $18 |
| Another $5 discount, with other inputs unchanged | $13 |
| Another $4 in product refunds plus $1 in return handling | $13 |
| Another $5 discount and $2 in outbound delivery | $11 |

These are simple sensitivity tests, not forecasts. A promotion can change conversion rate, order value and product mix as well. Calculate from the expected basket, then check the actual orders.

Do not fund today's budget with repeat purchases you have not demonstrated. If the business deliberately accepts a first-order loss, agree the cash limit, payback deadline and evidence for repeat-order contribution. Revenue alone is not payback.

## Sign off the number, then review the orders

Before using the ceiling, complete these checks. The downloadable PDF gives you a place to record the evidence and the person responsible.

1. **Scope:** the dates, currency, timezone and original order/customer counts are written down.
2. **Order quality:** duplicates, tests, unpaid orders and cancellations have a stated treatment; their real costs are not silently lost.
3. **Revenue:** discounts and refunds are included once; tax and duties are excluded; shipping income is net of shipping refunds.
4. **Returns:** later refunds are matched to original orders, with a stated return-maturity date or clearly labelled estimate.
5. **Costs:** product, delivery, fulfilment, fees, returns and applicable chargeback losses are covered; missing costs remain visible.
6. **Recovery:** returned inventory recovery is supported and no refund, fee or write-off is counted twice.
7. **Acquisition:** media and other acquisition costs are separate, with shared-cost allocation documented.
8. **Denominators:** first orders and distinct new customers are counted separately; platform attribution totals are not added together.
9. **Allowance:** finance has agreed what must remain for overhead and profit, and checked that it is sufficient for the business.
10. **Reconciliation:** the per-order figures multiplied by the original order count match the group totals; differences have explanations.
11. **Downside:** the offer still works under a realistic discount, delivery and return scenario, or has an explicit stop condition.
12. **Ownership:** someone owns the weekly check and the review after the return window; any planned loss has a cash limit and payback deadline.

Start with a controlled budget below the ceiling, not an automatic instruction to spend up to it. Review the actual retained revenue, costs and customer mix each week. Recheck after returns mature and after a meaningful change to price, delivery or the offer.

If the totals do not reconcile, hold the increase and fix the inputs. If the economics no longer work, the answer may be a better basket, a delivery change or a different promotion. More advertising is only one option.

Bring the [calculator](/downloads/order-acquisition-calculator.xlsx) and [worksheet](/downloads/order-acquisition-worksheet.pdf) to that conversation. A clear spending limit gives your store team, finance lead and agency something useful to agree on before the next campaign goes live.`,
}
];
