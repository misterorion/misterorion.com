---
title: "Sailing from Gatsby to Astro"
date: "2024-05-27"
description: "My Gatsby story and sailing to fresh water."
cover: "@images/sailing-chop.jpg"
coverAlt: "Sailing boat, before the storm (unsplash.com)"
tags: ["Gatsby", "Astro", "Code"]
---

You probably can't tell from the way this site looks and functions, but about a year and a half ago, I started using Astro instead of Gatsby as my web framework. It's not such a big deal since this site is so small, but I thought I'd tell my Gatsby story.

To start, I can't mention Gatsby without also mentioning [Hugo](https://gohugo.io), another static website generator. For a few years, Hugo had been my go-to for building static websites thanks to its simplicity and speed, but also because of my reluctance to subject myself to the frontend world’s manic ecosystem (and my admitted weakness in JavaScript).

Towards the middle of 2019 I decided to rectify that weakness since it was beginning to hamper me professionally, and dive into the maelstrom. [Gatsby](https://www.gatsbyjs.com) caught my eye because it touted itself as fast, modular, and had the step-up in complexity and features I needed to scratch my developer itch.

I dove in. After a few weekends of deep-learning and coding, I finally shipped the Gatsby version of this site, simple as it was. As a frontend tyro, the experience was not as rough as I expected. The documentation was sound, the community seemed active, and the developer feedback loop was swift. I was so excited that I wrote a [blog post](https://misterorion.com/moving-to-gatsby/) about the switch over.

Now, my code was fast, flexible, modular, and extensible with plugins. I even managed the upkeep of a few Gatsby sites for my employer, despite being a DevOps developer. Compared to the Angular sites I was also working with at the time, Gatsby was stable, understandable, and satisfying. Those were sunny days.

Besides the other major worldwide event in 2020 that changed everything, there were some dramatic changes coming from the Gatsby organization. If you know about Gatsby, you undoubtedly also know about Gatsby Cloud, their proprietary hosting platform that launched in late 2019.

While Gatsby Cloud seemed like a decent platform, some features like incremental builds were exclusive to the platform, leaving you feeling penalized for not using it. It was also becoming clear that modularity through plugins wasn't such a great idea in practice, many of them competing for the same features, while others became abandonware.

There were storm clouds on the horizon so I decided to change course. Having quenched my curiosity about JavaScript, TypeScript, React, GraphQL and a raft of other technologies, the pendulum swung the other way; I wanted simplicity again, though without throwing away all of my learnings.

I started looking for a new framework; one that was simple and open, but still seeped in the JavaScript ecosystem. I looked at Next.js, and a few others, but rejected them because of doing too much for my purposes. On the verge of returning to Hugo, I suddenly discovered Astro, a fresh and new project. Their claim of shipping "zero JavaScript by default" while having complete JS developer tooling at your disposal seemed like the best of both worlds. A few weekends later, what you are reading was built with Astro.

In early 2023, Netlify [bought](https://www.netlify.com/press/netlify-acquires-gatsby-inc-to-accelerate-adoption-of-composable-web-architectures/) Gatsby. The Gatsby [repository](https://github.com/gatsbyjs/gatsby) seems to be in "maintenance mode", having no substantial updates since December 2023. In my mind, this is fine. Delivering patches for those customers that still use it seems like a reasonable decision. But I would wager very few new projects are reaching for Gatsby. You can read an interesting discussion about the state of things in this [GitHub issue](https://github.com/gatsbyjs/gatsby/issues/38696).

I'm not upset about what happened to Gatsby, or about the state of software development. Every technology has its time in the sun, some longer than others. I learned a lot along the way that pushed me towards new destinations, and will continue to change course as it serves me. It's up to us to accept change and move forward, always seeking new waters.
