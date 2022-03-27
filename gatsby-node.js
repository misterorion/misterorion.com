const path = require(`path`);
const kebabCase = require("lodash/kebabCase");

exports.onPostBuild = ({ reporter }) => {
  reporter.info(`Your Gatsby site has been built!`);
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

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
      allGrimoire: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/(grimoire)/" } }
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
        filter: { fileAbsolutePath: { regex: "/(grimoire)/" } }
      ) {
        group(field: frontmatter___tags) {
          fieldValue
        }
      }
      allTag: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/(posts)/" } }
      ) {
        group(field: frontmatter___tags) {
          fieldValue
        }
      }
    }
  `);
  if (result.errors) {
    throw new Error(result.errors);
  }

  // Extract query results
  const posts = result.data.allPost.edges;
  const pages = result.data.allPage.edges;
  const grimoire = result.data.allGrimoire.edges;
  const grimoireTags = result.data.allGrimoireTag.group;
  const tags = result.data.allTag.group;

  // Create pages
  pages.forEach((page) => {
    createPage({
      path: `/${page.node.frontmatter.slug}/`,
      component: path.resolve(`src/templates/page.jsx`),
      context: {
        slug: page.node.frontmatter.slug,
      },
    });
  });

  // Create posts
  posts.forEach((post) => {
    createPage({
      path: `/${post.node.frontmatter.slug}/`,
      component: path.resolve(`src/templates/post.jsx`),
      context: {
        slug: post.node.frontmatter.slug,
      },
    });
  });

  // Create Post tag pages
  tags.forEach((tag) => {
    createPage({
      path: `/tags/${kebabCase(tag.fieldValue)}/`,
      component: path.resolve(`src/templates/tags.jsx`),
      context: {
        tag: tag.fieldValue,
      },
    });
  });

  // Create Grimoire pages
  grimoire.forEach((entry) => {
    createPage({
      path: `/grimoire/${kebabCase(entry.node.frontmatter.title)}/`,
      component: path.resolve(`src/templates/grimoire.jsx`),
      context: {
        title: entry.node.frontmatter.title,
      },
    });
  });

  // Create Grimoire Tag pages
  grimoireTags.forEach((tag) => {
    createPage({
      path: `/grimoire/tag/${kebabCase(tag.fieldValue)}/`,
      component: path.resolve(`src/templates/grimoireTag.jsx`),
      context: {
        tag: tag.fieldValue,
      },
    });
  });
};
