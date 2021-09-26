import React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../components/Layout'
import Seo from '../components/Seo'
import ContactForm from '../components/ContactForm'
import { GatsbyImage } from 'gatsby-plugin-image'
import { kebabCase } from 'lodash'
import { featImg, date, description, tags } from '../components/modules/post.module.css'

const Post = ({ data }) => {
  const { frontmatter: post } = data.markdownRemark
  const { html: content } = data.markdownRemark

  const image = post.imageFluid ? (
    <GatsbyImage
      alt={post.imageAlt}
      image={post.imageFluid.childImageSharp.gatsbyImageData} />
  ) : (
    <GatsbyImage
      alt={post.imageAlt}
      image={post.imageFixed.childImageSharp.gatsbyImageData} />
  )

  const imagePath = post.imageFluid
    ? post.imageFluid.childImageSharp.original.src
    : post.imageFixed.childImageSharp.original.src

  return (
    <Layout>
      <Seo
        title={post.title}
        description={post.description || ''}
        image={imagePath}
        url={`${data.site.siteMetadata.siteUrl}/${post.slug}/`}
      />
      <h1>{post.title}</h1>
      <div className={date}>{post.date}</div>
      <div className={description}>
        <p>{post.description}</p>
      </div>
      <div className={featImg}>{image}</div>
      <div dangerouslySetInnerHTML={{ __html: content }} />
      <div className={tags}>
        <h3>Tags:</h3>
        <ul>
          {post.tags.map((tag) => (
            <li key={tag}>
              <Link to={`/tags/${kebabCase(tag)}`}>{tag}</Link>
            </li>
          ))}
        </ul>
      </div>
      <ContactForm />
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
        description
        tags
        imageFluid {
          childImageSharp {
            gatsbyImageData(placeholder: NONE, layout: FULL_WIDTH)
            original {
              src
            }
          }
        }
        imageFixed {
          childImageSharp {
            gatsbyImageData(placeholder: NONE, layout: CONSTRAINED)
            original {
              src
            }
          }
        }
        imageAlt
      }
    }
    site {
      siteMetadata {
        siteUrl
      }
    }
  }
`
export default Post
