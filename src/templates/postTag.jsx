import React from "react";
import { graphql } from "gatsby";

import Layout from "../components/Layout";
import PostLink from "../components/PostLink/PostLink";
import { useSiteMetadata } from "../hooks/Metadata";
import Seo from "../components/Seo";

const Tags = ({ pageContext, data }) => {
  const { tag } = pageContext;
  const { edges: tags } = data.allMarkdownRemark;
  const posts = tags.map((edge) => (
    <PostLink key={edge.node.id} post={edge.node} />
  ));

  return (
    <Layout>
      <h1>Posts tagged with “{tag}”</h1>
      <div className="py-6">{posts}</div>
    </Layout>
  );
};

export function Head({ pageContext }) {
  const { siteTitle } = useSiteMetadata();
  const { tag } = pageContext;

  return <Seo title={`${tag} | ${siteTitle}`} />;
}

export const PostTagQuery = graphql`
  query PostTagQuery($tag: String) {
    allMarkdownRemark(
      limit: 2000
      sort: { frontmatter: { date: DESC } }
      filter: {
        fileAbsolutePath: { regex: "/(posts)/" }
        frontmatter: { tags: { in: [$tag] } }
      }
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
`;

export default Tags;
