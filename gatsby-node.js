const path = require(`path`)
const kebabCase = require('lodash/kebabCase')

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
      allPost: allMarkdownRemark(filter: {fileAbsolutePath: {regex: "/(posts)/"}}) {
        edges {
          node {
            frontmatter {
              slug
            }
          }
        }
      }
      allPage: allMarkdownRemark(filter: {fileAbsolutePath: {regex: "/(pages)/"}}) {
        edges {
          node {
            frontmatter {
              slug
            }
          }
        }
      }
      allGrimoire: allMarkdownRemark(
        filter: {fileAbsolutePath: {regex: "/(grimoire)/"}}
      ) {
        edges {
          node {
            frontmatter {
              title
            }
          }
        }
      }
      allGrimoireTag: allMarkdownRemark(
        filter: {fileAbsolutePath: {regex: "/(grimoire)/"}}
      ) {
        group(field: frontmatter___tags) {
          fieldValue
        }
      }
      allTag: allMarkdownRemark(filter: {fileAbsolutePath: {regex: "/(posts)/"}}) {
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
  const grimoire = result.data.allGrimoire.edges
  const grimoireTags = result.data.allGrimoireTag.group
  const tags = result.data.allTag.group

  // Load templates
  const postTemplate = path.resolve(`src/templates/post.jsx`)
  const pageTemplate = path.resolve(`src/templates/page.jsx`)
  const tagTemplate = path.resolve(`src/templates/tags.jsx`)
  const grimoireTemplate = path.resolve(`src/templates/grimoire.jsx`)
  const grimoireTagTemplate = path.resolve(`src/templates/grimoireTag.jsx`)

  // Create post pages
  posts.forEach((post) => {
    createPage({
      path: `/${post.node.frontmatter.slug}/`,
      component: postTemplate,
      context: {
        slug: post.node.frontmatter.slug,
      },
    })
  })

  // Create pages
  pages.forEach((page) => {
    createPage({
      path: `/${page.node.frontmatter.slug}/`,
      component: pageTemplate,
      context: {
        slug: page.node.frontmatter.slug,
      },
    })
  })

  // Create Grimoire pages
  grimoire.forEach((entry) => {
    createPage({
      path: `/grimoire/${kebabCase(entry.node.frontmatter.title)}/`,
      component: grimoireTemplate,
      context: {
        title: entry.node.frontmatter.title,
      },
    })
  })

  // Create Grimoire Tag pages
  grimoireTags.forEach((tag) => {
    createPage({
      path: `/grimoire/tag/${kebabCase(tag.fieldValue)}/`,
      component: grimoireTagTemplate,
      context: {
        tag: tag.fieldValue,
      },
    })
  })

  // Create Post tag pages
  tags.forEach((tag) => {
    createPage({
      path: `/tags/${kebabCase(tag.fieldValue)}/`,
      component: tagTemplate,
      context: {
        tag: tag.fieldValue,
      },
    })
  })

}
