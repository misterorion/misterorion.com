import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/Layout"
import Img from "gatsby-image"
import Helmet from "react-helmet"

export default ({ data }) => {
  const { markdownRemark: post } = data
  const _ = require("lodash")
  
  // Check for featured image in frontmatter
  const featImg = post.frontmatter.imageFluid ? (
    <Img fluid={post.frontmatter.imageFluid.childImageSharp.fluid} />
  ) : (
    <Img fixed={post.frontmatter.imageFixed.childImageSharp.fixed} />
  )

  return (
    <Layout>
      <Helmet title={post.frontmatter.title} />
      <h1>{post.frontmatter.title}</h1>
      <div className="post-date">{post.frontmatter.date}</div>
      <div className="feat-img">{featImg}</div>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
      <div className="tags border-t mt-6 pt-6 border-gray-400">
        <h3 className="inline">Tags:</h3>
        <ul className="inline ml-2">
          {post.frontmatter.tags.map(tag => (
            <li className="inline-block mx-2">
              <Link to={`/tags/${_.kebabCase(tag)}`}>{tag}</Link>
            </li>
          ))}
        </ul>
      </div>
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
        tags
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
