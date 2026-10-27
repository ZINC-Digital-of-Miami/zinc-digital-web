---
title: "WordPress, PHP security and the case for moving to Astro"
slug: wordpress-php-security-moving-to-astro
author: "Kirk Musick, MS, MBA"
layer: Build
status: draft
target_date: 2026-10-28
timezone: America/Chicago
source_checked: 2026-10-27
description: "What WordPress owners should check after PHP's October security updates, when staying makes sense, and how to plan a move to Astro."
related_services:
  - web-design
  - seo
featured_image: pending
---

# WordPress, PHP security and the case for moving to Astro

Your website can look fine while the software underneath it needs an urgent update.

A working homepage tells you very little about the PHP version serving it. That matters if your business runs on WordPress.

The immediate job is to get the current installation checked and patched. The separate business decision is whether that installation still makes sense for what your website needs to do.

We moved ZINC's public website from WordPress to Astro. That gives us a practical example to discuss. It does not make every WordPress site a migration candidate.

## What the PHP advisories actually say

On October 21, 2026, the PHP team released fixes for two critical remote-code-execution vulnerabilities: **CVE-2026-109618** and **CVE-2026-109619**. The fixed releases announced were **8.2.35, 8.3.36, 8.4.27 and 8.5.12**. The advisory covers PHP installations serving web requests, not just WordPress. Check the [PHP security announcement](https://www.php.net/archive/2026.php) and your hosting vendor's package guidance.

PHP also published follow-up guidance about session upload progress on October 23, and updated Windows builds for a Brotli dependency issue on October 26. The latter uses a `-1` package suffix; the PHP runtime version itself does not change. These are different notices with different conditions. A host saying “we updated PHP” needs to identify the applicable package and advisory.

**This section was checked on October 27, 2026.** Use the current [PHP announcements](https://www.php.net/index.php) when acting. Distribution backports and later releases can change what counts as patched. Do not copy an old version number from an article into a permanent maintenance policy.

## What to ask your host today

Send a specific request. “Is our website secure?” invites an answer that is difficult to verify.

Ask for:

1. **The PHP version actually serving the website.** Include the web runtime and hosting configuration. A command-line version alone does not establish what handles visitors.
2. **The installed package or vendor patch covering the advisories.** If the vendor backported a fix, ask for its bulletin or package reference.
3. **Confirmation that the updated runtime is active.** Downloading or installing an update is not the same as every web worker using it.
4. **A tested recovery point and a functional check.** Have the responsible team check forms, logins, checkout if present, background tasks and error logs after the change.
5. **An owner for the next update.** Put a person or a contracted service beside the task.

A WordPress core update and a hosting-level PHP update are different work. Confirm both responsibilities. Follow [WordPress's hardening guidance](https://developer.wordpress.org/advanced-administration/security/hardening/) for the broader installation: accounts, plugins, permissions and backups still matter.

If compromise is suspected, involve the host's incident-response team. A new website is not an investigation, and a clean-looking page is not evidence that an incident is over.

## First decide what your website really does

Write down the functions people depend on before discussing frameworks.

A services business might need a dozen service pages, case studies, a blog and a reliable inquiry form. Another company may need memberships, customer accounts, bookings, subscription billing and several editors working every day.

Those are different systems.

For each function, record who uses it, where its data lives, how it is maintained and what would break if it disappeared. Include the quiet dependencies: CRM delivery, consent, analytics, redirects, search, email notifications and downloadable files.

Then compare the options.

| Option | A reasonable fit | The responsibility you keep |
|---|---|---|
| Maintain and improve WordPress | Its publishing workflow and integrations work well, with an accountable maintenance owner | PHP, WordPress, plugins, themes, access and hosting |
| Use Astro with WordPress as the content system | Editors need WordPress, but the public presentation needs a different implementation | WordPress still needs maintenance; the Astro application adds its own |
| Move content and functionality off WordPress | A content-led site can be rebuilt without depending on its plugin ecosystem | Content editing, deployments, integrations, dependencies and any dynamic services |

[Astro explicitly supports retaining WordPress as a headless CMS](https://docs.astro.build/en/guides/migrate-to-astro/from-wordpress/). That can be a sensible compromise. It does not remove WordPress or PHP from the system.

## What changes with Astro

Astro can generate public pages ahead of time. For those prerendered pages, a visitor can receive the prepared HTML without a WordPress/PHP request executing to assemble it. Astro can also render routes on demand when the application requires that. The distinction is in the [rendering configuration](https://docs.astro.build/en/guides/on-demand-rendering/), not the framework name alone.

Our public ZINC pages are prerendered. The website also has dynamic functionality, including inquiry handling and a private administration area. Those parts still need authentication where appropriate, validation, updates and monitoring.

That is the useful conversation: **which moving parts does this business actually need?**

There is no honest “maintenance-free” column. A build pipeline can fail. A form can stop delivering. A third-party script can cause trouble. Replacing PHP does not retire the job of maintaining software.

## When I would keep WordPress

I would keep it when the editing workflow is doing its job, the integrations are necessary, the site performs acceptably for its users and someone owns maintenance.

An urgent patch is not automatically a business case for a rebuild.

Ask your agency to compare the cost of fixing the current installation with the cost of replacing its real functions. Include ongoing support and the editor's day-to-day work. A cheaper hosting invoice means little if publishing a service update now requires a developer every time.

[WordPress publishes its hosting requirements](https://wordpress.org/about/requirements/), and [PHP publishes its support windows](https://www.php.net/supported-versions.php). Those are starting points for a maintenance plan. Compatibility with your actual site still needs checking.

## What a move should include

For a content-led business site, an agency can assess and build an Astro replacement while the maintained WordPress site continues serving visitors. At ZINC, that work belongs in the [website design and development scope](/services/web-design/), with search preservation planned alongside it.

The proposal should name the deliverables:

- **Content and URL inventory.** Export the articles, pages, media, authors and relevant metadata. Identify important URLs before anyone changes them.
- **Feature map.** State what replaces each necessary plugin function and who owns it afterward. “We'll sort the forms later” is not a migration plan.
- **Editing demonstration.** Have the people who will maintain content try publishing, previewing and correcting a page.
- **Redirect decisions.** Preserve useful URLs where possible. Where paths change, map each old page to its appropriate replacement.
- **Real acceptance checks.** Test inquiry delivery, mobile navigation, consent, measurement, accessibility and any commercial transaction paths that remain in scope.
- **Cutover and recovery.** Define who changes the deployment, what gets monitored and how the team responds if a critical function fails.

Google's [site-move guidance](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes) covers URL mapping, redirects and monitoring. A CMS change does not require changing every URL. Redirecting an entire old blog to the homepage discards the relationship between the old pages and their replacements.

Check the live result, too. A successful build does not prove that an inquiry reached the right person or that an old article resolves to the right page.

## The decision I would make first

Get confirmation that the current PHP installation is patched. Then ask for a short architecture assessment with three things: the functions your business needs, the maintenance each option requires and the work needed to preserve your content and search presence.

If WordPress remains the best fit, maintain it properly. If Astro removes unnecessary complexity and gives your team a better publishing and customer experience, build the move around that evidence.

Choose the system you can operate well. Keep it that way.

