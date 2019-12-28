module.exports = {
  plugins: [
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/content/images`
      }
    },
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        postCssPlugins: [
          require("tailwindcss"),
          require("./tailwind.config.js")
        ]
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
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Orion Anderson`,
        short_name: `Orion Anderson`,
        start_url: `/`,
        background_color: `#6b37bf`,
        theme_color: `#6b37bf`,
        // Enables "Add to Homescreen" prompt and disables browser UI (including back button)
        // see https://developers.google.com/web/fundamentals/web-app-manifest/#display
        display: `standalone`,
        icon: `content/images/favicon.png` // This path is relative to the root of the site.
      }
    }
  ]
}
