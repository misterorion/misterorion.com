const path = require(`path`)
const _ = require("lodash")

// Log out information after a build is done
exports.onPostBuild = ({ reporter }) => {
  reporter.info(`Your Gatsby site has been built!`)
}

// Create pages dynamically
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  // Query post and page data
  const result = await graphql(`
    {
      allPost: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/(posts)/" } }
      ) {
        edges {
          node {
            frontmatter {
              slug
            }
          }
        }
      }
      allPage: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/(pages)/" } }
      ) {
        edges {
          node {
            frontmatter {
              slug
            }
          }
        }
      }
      allTag: allMarkdownRemark(limit: 2000) {
        group(field: frontmatter___tags) {
          fieldValue
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
  const tags = result.data.allTag.group

  // Load templates
  const postTemplate = path.resolve(`src/templates/post.js`)
  const pageTemplate = path.resolve(`src/templates/page.js`)
  const tagTemplate = path.resolve(`src/templates/tags.js`)

  // Create post pages
  posts.forEach(post => {
    createPage({
      path: post.node.frontmatter.slug,
      component: postTemplate,
      context: {
        slug: post.node.frontmatter.slug
      }
    })
  })

  // Create pages
  pages.forEach(page => {
    createPage({
      path: page.node.frontmatter.slug,
      component: pageTemplate,
      context: {
        slug: page.node.frontmatter.slug
      }
    })
  })

  // Create tag pages
  tags.forEach(tag => {
    createPage({
      path: `/tags/${_.kebabCase(tag.fieldValue)}/`,
      component: tagTemplate,
      context: {
        tag: tag.fieldValue
      }
    })
  })
}
