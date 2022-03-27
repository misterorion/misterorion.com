import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/Layout'
import Seo from '../components/Seo/Seo'
import { title } from '../components/Layout.module.css'

const Page = ({ data }) => {
  const { frontmatter, html } = data.markdownRemark
  const { siteUrl } = data.site.siteMetadata
  return (
    <Layout>
      <Seo
        title={frontmatter.title}
        description={frontmatter.description || 'nothin’'}
        url={`${siteUrl}/${frontmatter.slug}/`}
      />
      <h1 className={title}>
        {frontmatter.title}
      </h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </Layout>
  )
}

export const pageQuery = graphql`
  query PageByPath($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        description
        slug
        title
      }
    }
    site {
      siteMetadata {
        siteUrl
      }
    }
  }
`

export default Page
