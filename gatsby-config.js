require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    siteUrl: `https://misterorion.com`,
    siteTitle: `Orion Anderson`,
    siteDescription: `My personal home on the web.`,
    siteGreeting: `Greetings. My name is Orion Anderson. I'm a DevOps Developer in New York City. I love all things Docker, AWS, and automation.`,
    userName: `Orion Anderson`,
    userFirstName: `orion`,
    userLastName: `anderson`,
    userTwitter: `MisterOrion`,
    userLinkedIn: `orionanderson`,
    userGitHub: `MisterOrion`,
    siteImage: `/enso.jpg`,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-advanced-sitemap`,
      options: {
        additionalSitemaps: [
          {
            name: `ghost-posts`,
            url: `https://misterorion.com/gg/sitemap-posts.xml`
          }
        ],
        exclude: [
          /(\/)?404\S*/,
          /(\/)?tag\S*/
        ]
      }
    },
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-postcss`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/content/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `${__dirname}/content/posts`,
        ignore: [`**/_*`],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/content/pages`,
        ignore: [`**/_*`],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `grimoire`,
        path: `${__dirname}/content/grimoire`,
        ignore: [`**/_*`],
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-embed-video`,
          `gatsby-remark-responsive-iframe`,
          `gatsby-remark-smartypants`,
          {
            resolve: 'gatsby-remark-external-links',
            options: {
              target: '_blank',
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800,
              showCaptions: true,
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'Orion Anderson',
        short_name: 'Orion Anderson',
        start_url: `/`,
        background_color: `#6b37bf`,
        theme_color: `#6b37bf`,
        display: `standalone`,
        icon: `content/images/favicon.png`,
      },
    },
  ],
}
