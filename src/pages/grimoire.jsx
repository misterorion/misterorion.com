import React from 'react'
import { graphql } from 'gatsby'

import GrimoireEntry from '../components/grimoire/Grimoire'
import Layout from '../components/Layout'
import { entryList } from '../components/grimoire/Grimoire.module.css'
import { title } from '../components/Layout.module.css'

const Grimoire = ({ data }) => {
  const { edges } = data.allMarkdownRemark
  const entries = edges.map((edge) => (
    <GrimoireEntry entry={edge.node.frontmatter} key={edge.node.id} />
  ))
  return (
    <Layout>
      <h1 className={title}>✨ Grimoire</h1>
      <p>
        <strong>Grimoire</strong>
        &nbsp;&nbsp;&nbsp;/grəm-wär′/&nbsp;&nbsp;&nbsp;
        <strong>▶&nbsp;&nbsp;&nbsp;noun</strong>
        &nbsp;&nbsp;&nbsp;A book of magical knowledge.
      </p>
      <p>Wherein I record knowledge of a technical nature for future reference.</p>
      <h2>All Entries</h2>
      <div className={entryList}>
        {entries}
      </div>
    </Layout>
  )
}

export const GrimoirePageQuery = graphql`
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

export default Grimoire
