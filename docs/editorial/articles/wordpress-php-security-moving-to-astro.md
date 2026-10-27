---
title: "WordPress security—and why we moved ZINC to Astro"
slug: wordpress-php-security-moving-to-astro
author: "Kirk Musick, MS, MBA"
layer: Build
status: prepared-for-release
target_date: 2026-10-27
timezone: America/Chicago
source_checked: 2026-10-27
description: "What WordPress owners should check after PHP's October security updates, when staying makes sense, and how to plan a move to Astro."
related_services:
  - web-design
  - seo
featured_image: src/assets/articles/article-wordpress-astro.png
---

# WordPress security—and why we moved ZINC to Astro

You should not have to become your website’s IT department.

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

That is the job the website is there to do.
