import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/Layout"
import Img from "gatsby-image"
import Helmet from "react-helmet"

export default ({ data }) => {
  const { markdownRemark: post } = data
  return (
    <Layout>
      <Helmet title={post.frontmatter.title} />

      <h1>
        {post.frontmatter.title}
      </h1>

      <div className="post-date">{post.frontmatter.date}</div>

      {/* Check for featured image */}

      {post.frontmatter.imageFluid ? (
        <div className="feat-img">
          <Img fluid={post.frontmatter.imageFluid.childImageSharp.fluid} />
        </div>
      ) : (
        <div className="feat-img">
          <Img fixed={post.frontmatter.imageFixed.childImageSharp.fixed} />
        </div>
      )}

      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </Layout>
  )
}
export const postQuery = graphql`
  query BlogPostByPath($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
        imageFluid {
          childImageSharp {
            fluid(maxWidth: 1000) {
              ...GatsbyImageSharpFluid_tracedSVG
            }
          }
        }
        imageFixed {
          childImageSharp {
            fixed {
              ...GatsbyImageSharpFixed_tracedSVG
            }
          }
        }
      }
    }
  }
`
