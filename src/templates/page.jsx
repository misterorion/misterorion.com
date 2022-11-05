import React from "react";
import { graphql } from "gatsby";

import Layout from "../components/Layout";
import Seo from "../components/Seo";
import { useSiteMetadata } from "../hooks/Metadata";
import { title } from "../components/Layout.module.css";

const Page = ({ data }) => {
  const { frontmatter: page, html: content } = data.markdownRemark;

  return (
    <Layout>
      <h1 className={title}>{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </Layout>
  );
};

export function Head({ data }) {
  const { frontmatter: page } = data.markdownRemark;
  const { siteUrl } = useSiteMetadata();

  return (
    <Seo
      title={page.title}
      description={page.description || "No Description"}
      url={`${siteUrl}/${page.slug}/`}
    />
  );
}

export const PageBySlugQuery = graphql`
  query PageBySlugQuery($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        description
        slug
        title
      }
    }
  }
`;

export default Page;
