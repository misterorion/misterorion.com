const path = require(`path`)

// Log out information after a build is done
exports.onPostBuild = ({ reporter }) => {
  reporter.info(`Your Gatsby site has been built!`)
}

// Create pages dynamically
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  // Query Ghost data
  const result = await graphql(`
    {
      allPost: allMarkdownRemark(
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
      allPage: allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        filter: { fileAbsolutePath: { regex: "/(pages)/" } }
      ) {
        edges {
          node {
            id
            frontmatter {
              slug
              title
            }
          }
        }
      }
    }
  `)
  // Handle errors
  if (result.errors) {
    throw new Error(result.errors)
  }

  // Extract query results
  const posts = result.data.allPost.edges
  const pages = result.data.allPage.edges

  // Load templates
  const postTemplate = path.resolve(`src/templates/post.js`)
  const pageTemplate = path.resolve(`src/templates/page.js`)

  // Create post pages
  posts.forEach(({ node }) => {
    createPage({
      path: `/${node.frontmatter.slug}/`,
      component: postTemplate,
      context: {
        slug: node.frontmatter.slug,
      },
    })
  })

  // Create pages
  pages.forEach(({ node }) => {
    createPage({
      path: `/${node.frontmatter.slug}/`,
      component: pageTemplate,
      context: {
        slug: node.frontmatter.slug,
      },
    })
  })
}
