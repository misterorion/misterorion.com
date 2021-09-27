import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import GrimoireEntry from '../components/modules/Grimoire'
import { title } from '../components/modules/page.module.css'
import { entryList } from '../components/modules/Grimoire/grimoire.module.css'

const Grimoire = ({ data }) => {
  const Entries = data.allMarkdownRemark.edges.map((edge) => (
    <GrimoireEntry entry={edge.node.frontmatter} key={edge.node.id} />
  ))
  return (
    <Layout>
      <h1 className={title}>✨ Grimoire</h1>
      <p><strong>Grimoire</strong> /gri·​moire/ <strong>▶ noun</strong> A book of magic spells and invocations.</p>
      <p>Wherein I record knowledge of a technical nature for future reference.</p>
      <h2>All Entries</h2>
      <div className={entryList}>
        {Entries}
      </div>
    </Layout>
  )
}

export const grimoireList = graphql`
  query GrimQuery {
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
