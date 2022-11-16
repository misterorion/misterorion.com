const path = require(`path`);
const kebabCase = require("lodash/kebabCase");

exports.onPostBuild = ({ reporter }) => {
  reporter.info(`Your Gatsby site has been built!`);
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const content = await graphql(`
    {
      allPosts: allMarkdownRemark(
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
      allPages: allMarkdownRemark(
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
      allGrimoireEntries: allMarkdownRemark(
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
      allGrimoireTags: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/(grimoire)/" } }
      ) {
        group(field: { frontmatter: { tags: SELECT } }) {
          fieldValue
        }
      }
      allPostTags: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/(posts)/" } }
      ) {
        group(field: { frontmatter: { tags: SELECT } }) {
          fieldValue
        }
      }
    }
  `);
  if (content.errors) {
    throw new Error(content.errors);
  }

  // Extract content data
  const posts = content.data.allPosts.edges;
  const pages = content.data.allPages.edges;
  const grimoireEntries = content.data.allGrimoireEntries.edges;
  const grimoireTags = content.data.allGrimoireTags.group;
  const postTags = content.data.allPostTags.group;

  pages.forEach((page) => {
    createPage({
      path: `/${page.node.frontmatter.slug}/`,
      component: path.resolve(`src/templates/page.jsx`),
      context: {
        slug: page.node.frontmatter.slug,
      },
    });
  });
  posts.forEach((post) => {
    createPage({
      path: `/${post.node.frontmatter.slug}/`,
      component: path.resolve(`src/templates/post.jsx`),
      context: {
        slug: post.node.frontmatter.slug,
      },
    });
  });
  postTags.forEach((tag) => {
    createPage({
      path: `/tag/${kebabCase(tag.fieldValue)}/`,
      component: path.resolve(`src/templates/postTag.jsx`),
      context: {
        tag: tag.fieldValue,
      },
    });
  });
  grimoireEntries.forEach((entry) => {
    createPage({
      path: `/grimoire/${kebabCase(entry.node.frontmatter.title)}/`,
      component: path.resolve(`src/templates/grimoire.jsx`),
      context: {
        title: entry.node.frontmatter.title,
      },
    });
  });
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
