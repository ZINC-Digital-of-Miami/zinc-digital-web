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
  markdown: `You should not have to become your website’s IT department.

But if nobody can tell you who handles its security updates, you already have a problem. A good-looking homepage does not answer that question.

WordPress runs on PHP. On October 21, 2026, the PHP team released fixes for two critical security flaws that could let an attacker run code on an affected server. In plain English: this is something your hosting company needs to check, even if your website appears to work perfectly.

The [official PHP notice](https://www.php.net/archive/2026.php) has the technical details. You do not need to memorize them. You need someone accountable for fixing the right thing.

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

That is the job the website is there to do.`,
}, {
  "id": 94002,
  "slug": "build-a-content-hub-people-can-use",
  "title": "Build a content hub people can actually use",
  "description": "Turn scattered articles into a useful customer guide. Wendy walks through a content hub with a worked page map, linking examples and practical launch checks.",
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
  markdown: `Publishing another article is easy. Helping someone find the answer you published six months ago takes a bit more thought.

If your blog lists everything by date, useful advice can disappear beneath company news and last month's announcement. Your customer does not care which post came first. They want to know what something costs, whether it suits them and what to do next.

A content hub gives those answers a home. It is a useful starting page that introduces one subject and links to more detailed help. Those pages link back and, where it helps the reader, to each other.

Think of it as a guide someone can use before they buy. Calling a page a “resource centre” and filling it with thumbnails does not quite finish the job.

Here is how to build one without commissioning a small library.

## 1. Choose a decision your customers need help making

Start with one service or product you actually sell. Then name the decision that tends to hold people up.

“Cleaning” is too broad. “Choosing a regular home-cleaning service” gives you something useful to organise.

Ask the people who answer enquiries what customers want to know before booking. Look at your emails, calls and existing website questions. Use questions you really receive, rather than asking a writing tool to invent fifty vaguely related topics.

Before you start, gather:

- Your relevant articles and service pages, with their web addresses.
- The questions customers ask before they buy.
- Someone who knows the service well enough to check the answers.
- Someone who can edit pages and add links on your website.

You can plan this in a spreadsheet or an ordinary document. You do not need a new platform.

Write the hub's purpose in one sentence: **“Help [customer] decide [specific thing], so they can [useful next action].”**

If you cannot finish that sentence, narrow the subject before writing anything.

## 2. Give each page a clear job

Here is a planning example for an imaginary residential cleaning business. It is not a client project or a claim about results.

**Hub purpose:** help a homeowner choose the right regular cleaning service and prepare for the first visit.

| Page | What it helps the customer do |
|---|---|
| **Hub: Your guide to regular home cleaning** | Understand the options, find the right detailed advice and know how to request a quote. |
| What's included in a regular clean? | Check the usual tasks and exclusions before enquiring. |
| Weekly or fortnightly cleaning? | Compare visit frequency against their household's needs. |
| What affects the price of home cleaning? | Understand what information the business needs for an accurate quote. |
| How to prepare for your first clean | Know what to move, what access to arrange and which details to share. |
| **Service page: Regular home cleaning** | Check the business's actual offer, service area and booking process. |

The hub is the overview. The supporting articles answer the detailed questions. The service page explains what this particular business offers and how to buy it.

These are different jobs. Do not turn every article into a second service page with a different opening paragraph.

The example has four supporting articles because those questions are useful here. Four is not a rule, and you do not need to fill empty boxes to match it.

Read each proposed title alongside its one-sentence answer. If two pages would say much the same thing, combine the questions or make their purpose clearer. A small collection of distinct answers is easier to maintain than several near-duplicates.

## 3. Use what you already have

Put your existing pages beside the plan. Mark each one **ready to use**, **needs work** or **missing**.

An accurate article may need nothing more than a clearer introduction and a link from the hub. An outdated article needs its answer checked. A missing question needs a brief before it needs a writer.

That is where our [content brief guide](/blog/content-briefs-search-intent-internal-links/) helps: name the reader's question, the evidence needed and the next useful page.

For the cleaning example, the price article should explain the real factors the business uses to quote. It should not invent a convenient price range. The inclusions page needs the actual exclusions. The first-visit guide needs the procedure the team really follows.

Google's [people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) provides useful questions for checking whether a page properly helps its reader. Use that as an editorial check, rather than treating a longer article as an automatic improvement.

Give each page a named owner who can confirm the details. Clear writing cannot rescue an incorrect answer.

## 4. Make the hub useful before someone clicks away

The hub needs enough explanation to help someone choose where to go. A title followed by six unexplained links leaves the sorting to your customer.

For our example, the opening might say:

> Thinking about regular home cleaning? Start with what's included, compare weekly and fortnightly visits, then check what information we need to prepare your quote. If your first visit is already booked, use the preparation checklist.

Then group the links around those tasks:

- **Deciding what you need:** inclusions and visit frequency.
- **Planning your budget:** what affects the quote.
- **Getting ready:** the first-visit checklist.
- **Ready to enquire:** the regular cleaning service page.

Add a short description beside each link. “See which tasks are included and which need arranging separately” gives someone a reason to open the inclusions article.

The page should also explain whose advice this is and why they can give it. Use a real author or reviewer and relevant experience you can substantiate. An invented expert biography will not improve anyone's trust.

## 5. Link the pages where the connection makes sense

From the hub, link to each useful supporting page. From those pages, offer a route back to the guide. Link between supporting articles when one answers a question raised by the other.

For example, the visit-frequency article could say:

> Deciding between weekly and fortnightly visits? Check **what's included in a regular clean** before comparing the two.

The bold words would be the link. They tell the reader what is on the other side. “Click here” tells them considerably less.

The price article might link to the quote page after explaining what information is needed. It does not need a link to every article in the hub.

Google's [link guidance](https://developers.google.com/search/docs/crawling-indexing/links-crawlable) supports descriptive, relevant link wording. Ask whoever builds the pages to use ordinary links that work when clicked or tapped, rather than controls that only look like links.

Try the journey yourself: start at an article, find the overview, open another answer and reach the enquiry page. If you have to use your browser's back button to escape a dead end, improve the route.

## 6. Check it on a phone before launch

Give someone who did not write the pages one realistic task: “Find out whether this service suits your household, then work out how to get a quote.”

Watch where they hesitate. You are checking whether the guide helps them, rather than whether they like the colour of its buttons.

Before publishing, confirm that:

- The opening explains who the guide is for and what it covers.
- Every linked page exists and answers the question promised by its title.
- Lists, tables and links are readable and usable on a phone.
- Service details match the current offer.
- Important claims have appropriate evidence or a factual reviewer.
- The route to an enquiry or purchase works, including the form or checkout.
- A named person owns the next review, with a reason to revisit it: a service change, new customer question or outdated instruction.

You do not have to write every possible article before launching. Start with a useful overview and the answers you can properly support. Add further pages when you have a real gap to fill.

## Keep a simple record of whether it helps

Before launch, note what you can already measure. That might include search visits to the relevant pages, common questions reaching your team and enquiries from those pages where your website records them reliably.

After launch, compare the same measures over a sensible period for your business. Check whether people use the guide's links, whether the important pages are being found and whether your team still receives the questions the guide was meant to answer.

Small numbers can be inconclusive. Seasonality, advertising and changes to your offer can affect the picture too. A rise in enquiries alone does not prove the hub caused it.

You can also learn something much sooner: ask a customer or colleague to complete the task and listen to where the explanation falls short.

A hub can support discovery, but it is not a ranking promise. Nor does it guarantee that an AI tool will cite you. Google's [guidance for its AI search features](https://developers.google.com/search/docs/appearance/ai-features) says the usual SEO practices remain relevant, without a special extra optimisation requirement. Answer the question properly and make the answer easy to reach.

## Your one-page hub brief

Copy this into a document before commissioning the work:

- **Customer:** Who needs this help?
- **Decision:** What should they understand or be able to do afterwards?
- **Hub:** What does the overview cover, and what does it leave to the detailed pages?
- **Supporting answers:** Which existing pages can we use, which need updating and which are missing?
- **Evidence:** Who can check the facts, and what sources or demonstrations do they need?
- **Links:** How does someone move from the overview to a detailed answer and on to the appropriate next action?
- **Owner:** Who writes, checks, publishes and maintains it?
- **Launch check:** Can someone complete the customer task on their phone?
- **Review:** What will we look at afterwards, and what would trigger a change?

That is enough to give the work a useful shape. For the wider search work around it, start with our [SEO framework](/blog/four-pillars-of-seo-operators-view/). If you want help planning and connecting the pages, our [SEO service](/services/seo/) covers that work.

Pick one decision your customers struggle with. Gather the answers you can stand behind. Give them a clear place to start and a useful place to go next.`,
}];
