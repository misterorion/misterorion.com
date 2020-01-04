module.exports = {
  siteMetadata: {
    siteTitle: `Orion Anderson`,
    userName: `Orion Anderson`,
    userEmail: `orion@mechapower.com`,
    userTwitter: `MisterOrion`,
    userLinkedIn: `orionanderson`,
    userGitHub: `MisterOrion`
  },
  plugins: [
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-postcss`,
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        tailwind: true,
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/content/images`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `${__dirname}/content/posts`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/content/pages`
      }
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-embed-video`,
          `gatsby-remark-responsive-iframe`,
          `gatsby-remark-smartypants`,
          {
            resolve: `gatsby-remark-prismjs`
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800,
              showCaptions: true,
              tracedSVG: true
            }
          }
        ]
      }
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "12345"
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "Orion Anderson",
        short_name: "Orion Anderson",
        start_url: `/`,
        background_color: `#6b37bf`,
        theme_color: `#6b37bf`,
        display: `standalone`,
        icon: `src/components/icons/favicon.png`
      }
    }
  ]
}
