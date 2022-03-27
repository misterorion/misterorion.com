import React from 'react'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'

import Layout from '../components/Layout'
import PostLink from '../components/PostLink/PostLink'

const Tags = ({ pageContext, data }) => {
  const { tag } = pageContext
  const posts = data.allMarkdownRemark.edges.map((edge) => (
    <PostLink key={edge.node.id} post={edge.node} />
  ))
  return (
    <Layout>
      <Helmet title={`${tag} | ${data.site.siteMetadata.siteTitle}`} />
      <h1>Posts tagged with “{tag}”</h1>
      <div className="py-6">{posts}</div>
    </Layout>
  )
}

export const tagQuery = graphql`
  query($tag: String) {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {fileAbsolutePath: {regex: "/(posts)/"}, frontmatter: {tags: {in: [$tag]}}}
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
    site {
      siteMetadata {
        siteTitle
      }
    }
  }
`

export default Tags
