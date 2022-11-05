import React from "react";
import { graphql } from "gatsby";

import Seo from "../components/Seo";
import Hero from "../components/Hero/Hero";
import Layout from "../components/Layout";
import PostLink from "../components/PostLink/PostLink";

const Index = ({ data }) => {
  const posts = data.allMarkdownRemark.edges.map((edge) => (
    <PostLink key={edge.node.id} post={edge.node} />
  ));
  return (
    <Layout>
      <Hero />
      <div className="py-6">{posts}</div>
    </Layout>
  );
};

export function Head() {
  return <Seo />;
}

export const PostByDateQuery = graphql`
  query PostByDateQuery {
    allMarkdownRemark(
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
`;

export default Index;
