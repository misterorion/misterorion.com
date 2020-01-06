---
title: "Moving from Hugo to Gatsby"
date:  "2020-01-05"
slug: "moving-to-gatsby"
description: "I moved my personal site from Hugo to Gatsby and now it's fast as hell."
imageFluid:  "../images/great-gatsby.jpg"
tags: ["Code", "Gatsby"]
---

This site is now made with Gatsby! Meant as a learning experience, this update forced me to get my hands dirty with two technologies I had no prior experience with: React and GraphQL. As a result, this site is now a screaming-fast Progressive Web App and gets 100s across the board in Google's Lighthouse audit.

> If you just want to see the code, [here's the GitHub repository](https://github.com/misterorion/misterorion.com).

At the beginning, the process wasn't straightforward for me, coming from many years of writing static HTML templates for Hugo, and Jekyll before that. If you're just getting started with Gatsby and React in general, do yourself a favor and go through the excellent [tutorial](https://www.gatsbyjs.org/tutorial/) on the Gatsby site. It's very well done. Other links that helped me a lot are at the end of this post.

As an example of what you'll be writing, here's the code for the home page of this site:

```jsx
// index.js

import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/Layout"
import Hero from "../components/Hero"
import PostLink from "../components/Post-Link"

export default ({ data }) => {
  const Posts = data.posts.edges.map(edge => (
    <PostLink key={edge.node.id} post={edge.node} />
  ))
  return (
    <Layout>
      <Hero />
      <div className="py-6">{Posts}</div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query MyQuery {
    posts: allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { fileAbsolutePath: { regex: "/(posts)/" } }
    ) {
      edges {
        node {
          id
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            slug
            title
          }
        }
      }
    }
  }
`
```

It's not your daddy's HTML/CSS/JS, that's for sure. In the example above, we have React components for Layout and Hero, followed by a component for the post links themselves. SEO is handled by the imported Layout component. Finally, a GraphQL query uses some regex to find markdown files in my posts folder, extracting only the information necessary to create the list of posts before passing it into the main function. GraphQL is very powerful, indeed. It's definitely the future.

In general, I tried to modularize everything, extracting components for Layout, SEO, CSS modules, and so on. This makes the codebase a bit easier to understand and update.

## Room for improvement

### Plugins

Gatsby is fast and made modular and robust via its plugin system. That said, I'm wary of plugins. Compared to Hugo with its single do-it-all binary package, the plugin approach is something I'm not comfortable with yet. In general, plugins tend be abandoned, or have supply-chain issues such as insecure dependencies. Fortunately, Gatsby's most popular plugins seem to have a lot of developer support.

### Documentation

I'm extremely grateful for Gatsby's docs but there are occasional inconsistencies in completeness. One example is the documentation for adding SEO to Gatsby posts. The documentation only goes as far as fetching the data with GraphQL, but does not document how to pass the data into posts in a programmatic way. For this final, crucial step the docs link you to some examples. The examples, while correct, are inconsistent in their approach. In the end I rolled my own solution. Maybe I'll find the time contribute to the docs in some way.

## Other updates: CSS framework and hosting

For my CSS framework, I switched Bootstrap to TailwindCSS. I like Tailwind because it's less opinionated than Bootstrap. Fighting with CSS frameworks is something I just don't want to do anymore. That said, Tailwind is a pretty big framework in terms of file size, so I run it through PurgeCSS to remove the classes I don't need. The result is very small set of CSS classes.

FOr hosting, I moved from an complex-yet-solid S3/CloudFront/CodeBuild setup on AWS to a simpler, yet still fully featured setup on Netlify. The complexity of AWS for such a small site like this isn't worth it. Netlify has been great so far; it's fast and easy to use. I really recommend Netfliy for developers using Continuous Integration with their static sites. Netlify even supports Hugo if you don't want to use Gatsby.

## Conclusion

Overall, this migration was a pretty standard developer experience: reading docs, troubleshooting, DuckDuckGo and Google searches, coffee, and banging my head against the keyboard. In the end, I'm really happy with this setup despite the pain points outlined above. I learned a lot about React and took my JavaScript up a notch. A great learning experience resulting in a screaming-fast, good-looking site if I do say so myself.

## Links

Here are the links that pointed me in the right direction during development:

- [Gatsby.js Tutorial (gatsbyjs.org)](https://www.gatsbyjs.org/tutorial/)
- [TailwindCSS Documentation (tailwindcss.com)](https://tailwindcss.com/docs/installation)
- [All the JavaScript you need to know before starting with React (jscomplete.com)](https://jscomplete.com/learn/javascript-for-react)
- [A Step-by-Step Guide: Gatsby on Netlify (netlify.com)](https://www.netlify.com/blog/2016/02/24/a-step-by-step-guide-gatsby-on-netlify/)
- [Introduction to GraphQL (graphql.org)](https://graphql.org/learn/)
- [Repository of Tania Rascia's Gatsby site (github.org)](https://github.com/taniarascia/taniarascia.com)
