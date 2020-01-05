import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/Layout"
import Img from "gatsby-image"
import Helmet from "react-helmet"

export default ({ data }) => {
  const { frontmatter: post } = data.markdownRemark
  const { html: content } = data.markdownRemark
  const _ = require("lodash")

  const image = post.imageFluid ? (
    <Img fluid={post.imageFluid.childImageSharp.fluid} />
  ) : (
    <Img fixed={post.imageFixed.childImageSharp.fixed} />
  )

  return (
    <Layout>
      <Helmet title={post.title} />
      <h1>{post.title}</h1>
      <div className="post-date">{post.date}</div>
      <div className="feat-img">{image}</div>
      <div dangerouslySetInnerHTML={{ __html: content }} />
      <div className="tags border-t mt-6 pt-6 border-gray-400">
        <h3 className="inline">Tags:</h3>
        <ul className="inline ml-2">
          {post.tags.map(tag => (
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
