import React from 'react'
import { graphql } from 'gatsby'
import { kebabCase } from 'lodash'

import Layout from '../components/Layout'
import Seo from '../components/Seo/Seo'
import { title } from '../components/Layout.module.css'

const GrimoirePage = ({ data }) => {
  const { markdownRemark: page } = data
  return (
    <Layout>
      <Seo
        title={page.frontmatter.title}
        description={page.frontmatter.title || 'nothin’'}
        url={`${data.site.siteMetadata.siteUrl}/grimoire/${kebabCase(page.frontmatter.title)}/`}
      />
      <h1 className={title}>
        {page.frontmatter.title}
      </h1>
      <div dangerouslySetInnerHTML={{ __html: page.html }} />
    </Layout>
  )
}

export const pageQuery = graphql`
  query Grimoire($title: String!) {
    markdownRemark(frontmatter: { title: { eq: $title } }) {
      html
      frontmatter {
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

export default GrimoirePage
