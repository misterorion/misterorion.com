import React from "react";
import { graphql } from "gatsby";
import { kebabCase } from "lodash";

import Layout from "../components/Layout";
import Seo from "../components/Seo";
import { useSiteMetadata } from "../hooks/Metadata";

const GrimoirePage = ({ data }) => {
  const { frontmatter: page, html: content } = data.markdownRemark;

  return (
    <Layout>
      <h1>{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </Layout>
  );
};

export function Head({ data }) {
  const { title, description } = data.markdownRemark.frontmatter;
  const { siteUrl } = useSiteMetadata();

  return (
    <Seo
      title={title}
      description={description || "nothin’"}
      url={`${siteUrl}/grimoire/${kebabCase(title)}/`}
    />
  );
};

export const GrimoireTitleQuery = graphql`
  query GrimoireTitleQuery($title: String!) {
    markdownRemark(frontmatter: { title: { eq: $title } }) {
      html
      frontmatter {
        description
        title
      }
    }
  }
`;

export default GrimoirePage;
