import React from "react";
import { graphql } from "gatsby";
import { kebabCase } from "lodash";

import Layout from "../components/Layout";
import Seo from "../components/Seo/Seo";
import { useSiteMetadata } from "../hooks/Metadata";
import { title } from "../components/Layout.module.css";

const GrimoirePage = ({ data }) => {
  const { frontmatter: entry, html: content } = data.markdownRemark;
  const { siteUrl } = useSiteMetadata();

  return (
    <Layout>
      <Seo
        title={entry.title}
        description={entry.title || "nothin’"}
        url={`${siteUrl}/grimoire/${kebabCase(entry.title)}/`}
      />
      <h1 className={title}>{entry.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </Layout>
  );
};

export const GrimoireTitleQuery = graphql`
  query GrimoireTitleQuery($title: String!) {
    markdownRemark(frontmatter: { title: { eq: $title } }) {
      html
      frontmatter {
        title
      }
    }
  }
`;

export default GrimoirePage;
