import React from "react";
import { graphql } from "gatsby";
import PostLink from "../components/Post-Link";
import SiteConfig from "../../SiteConfig";

const IndexPage = ({
  data: {
    allMarkdownRemark: { edges }
  }
}) => {
  const Posts = edges
    .filter(edge => !!edge.node.frontmatter.date) // You can filter your posts based on some criteria
    .map(edge => <PostLink key={edge.node.id} post={edge.node} />);

  return (
    <div>
      <h1>{SiteConfig.siteTitle}</h1>
      <h3>{SiteConfig.userTwitter}</h3>
      <div>{Posts}</div>
    </div>
  );
};

export default IndexPage;

export const pageQuery = graphql`
  query MyQuery {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { frontmatter: { template: { ne: "page" } } }
    ) {
      edges {
        node {
          id
          excerpt(pruneLength: 250)
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            path
            title
          }
        }
      }
    }
  }
`;
