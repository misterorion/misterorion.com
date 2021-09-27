import React from 'react'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'
import Layout from '../components/Layout'
import PostLink from '../components/modules/PostLink'

const Tags = ({ pageContext, data }) => {
  const { tag } = pageContext
  const Posts = data.allMarkdownRemark.edges.map((edge) => (
    <PostLink key={edge.node.id} post={edge.node} />
  ))
  return (
    <Layout>
      <Helmet title={`${tag} | ${data.site.siteMetadata.siteTitle}`} />
      <h1>Posts tagged with “{tag}”</h1>
      <div className="py-6">{Posts}</div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query($tag: String) {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
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
