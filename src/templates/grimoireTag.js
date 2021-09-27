import React from 'react'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'

import Layout from '../components/Layout'

const grimoireTags = ({ pageContext, data }) => {
  const { tag } = pageContext
  const Entries = data.allMarkdownRemark.edges.map((edge) => (
    <div key={edge.node.id}>
      <h2>{edge.node.frontmatter.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: edge.node.html }} />
    </div>
  ))
  return (
    <Layout>
      <Helmet title={`${tag} | ${data.site.siteMetadata.siteTitle}`} />
      <h1>Grimoire Entries tagged with “{tag}”</h1>
      <div className="py-6">{Entries}</div>
    </Layout>
  )
}

export const grimoireTagQuery = graphql`
  query($tag: String) {
    allMarkdownRemark(
      filter: {fileAbsolutePath: {regex: "/(grimoire)/"}, frontmatter: {tags: {in: [$tag]}}}
    ) {
      totalCount
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
    site {
      siteMetadata {
        siteTitle
      }
    }
  }
`
export default grimoireTags
