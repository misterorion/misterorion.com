import React from "react";
import { graphql, useStaticQuery } from "gatsby";

import GrimoireLink from "../components/GrimoireLink/GrimoireLink";
import Layout from "../components/Layout";
import Seo from "../components/Seo";
import { entryList } from "../components/GrimoireLink/GrimoireLink.module.css";
import { title } from "../components/Layout.module.css";
import { useSiteMetadata } from "../hooks/Metadata";

const Grimoire = () => {
  const { allMarkdownRemark } = useStaticQuery(
    graphql`
      query GrimoirePageQuery {
        allMarkdownRemark(
          filter: { fileAbsolutePath: { regex: "/(grimoire)/" } }
        ) {
          edges {
            node {
              id
              frontmatter {
                title
                excerpt
                tags
              }
            }
          }
        }
      }
    `
  );

  const entries = allMarkdownRemark.edges.map((edge) => (
    <GrimoireLink entry={edge.node.frontmatter} key={edge.node.id} />
  ));

  return (
    <Layout>
      <h1 className={title}>✨ Grimoire</h1>
      <p>
        <strong>Grimoire</strong>
        &nbsp;&nbsp;&nbsp;/grəm-wär′/&nbsp;&nbsp;&nbsp;
        <strong>▶&nbsp;&nbsp;&nbsp;noun</strong>
        &nbsp;&nbsp;&nbsp;A book of magical knowledge.
      </p>
      <p>
        Wherein I record knowledge of a technical nature for future reference.
      </p>
      <h2>All Entries</h2>
      <div className={entryList}>{entries}</div>
    </Layout>
  );
};

export function Head() {
  const { siteTitle, siteUrl } = useSiteMetadata();
  return (
    <Seo
      description="Wherein I record knowledge of a technical nature for future reference."
      title={`${siteTitle} - Grimoire`}
      url={`${siteUrl}/grimoire/`}
    />
  );
}

export default Grimoire;
