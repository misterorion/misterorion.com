import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/Layout"
import Hero from "../components/Hero"
import PostLink from "../components/Post-Link"

const IndexPage = ({
  data: {
    posts: { edges }
  }
}) => {
  const Posts = edges.map(edge => <PostLink key={edge.node.id} post={edge.node} />)
  return (
    <Layout>
    <Hero />
      <div className="py-6">{Posts}</div>
    </Layout>
  )
}

export default IndexPage

export const pageQuery = graphql`
  query MyQuery {
    posts: allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { fileAbsolutePath: { regex: "/(posts)/" } }
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
  }
`
