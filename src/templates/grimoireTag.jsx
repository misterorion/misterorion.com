import React from 'react'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'

import Layout from '../components/Layout'
import { useSiteMetadata } from '../hooks/Metadata'

const GrimoireTags = ({ pageContext, data }) => {
  const { tag } = pageContext
  const { edges: tags } = data.allMarkdownRemark
  const { siteTitle } = useSiteMetadata()
  const Entries = tags.map((edge) => (
    <div key={edge.node.id}>
      <h2>{edge.node.frontmatter.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: edge.node.html }} />
    </div>
  ))

  return (
    <Layout>
      <Helmet title={`${tag} | ${siteTitle}`} />
      <h1>Grimoire Entries tagged with “{tag}”</h1>
      <div className="py-6">{Entries}</div>
    </Layout>
  )
}

export const GrimoireTagQuery = graphql`
  query GrimoireTagQuery($tag: String!) {
    allMarkdownRemark(
      filter: {fileAbsolutePath: {regex: "/(grimoire)/"}, frontmatter: {tags: {in: [$tag]}}}
    ) {
      edges {
        node {
          id
          frontmatter {
            title
          }
          html
        }
      }
    }
  }
`

export default GrimoireTags
