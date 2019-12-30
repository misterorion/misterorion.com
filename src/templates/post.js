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

      <h1 className="text-4xl mb-4 mt-12 font-bold">
        {post.frontmatter.title}
      </h1>
      <div className="text-gray-600 mb-10">{post.frontmatter.date}</div>

      {/* Check for featured image */}

      {post.frontmatter.imageFluid ? (
        <div className="my-20">
          <Img fluid={post.frontmatter.imageFluid.childImageSharp.fluid} />
        </div>
      ) : (
        <div className="my-20">
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
