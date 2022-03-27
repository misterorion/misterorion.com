import React from 'react'
import { graphql } from 'gatsby'
import { kebabCase } from 'lodash'

import Layout from '../components/Layout'
import Seo from '../components/Seo/Seo'
import { title } from '../components/Layout.module.css'

const GrimoirePage = ({ data }) => {
  const { frontmatter, html } = data.markdownRemark
  return (
    <Layout>
      <Seo
        title={frontmatter.title}
        description={frontmatter.title || 'nothin’'}
        url={`${data.site.siteMetadata.siteUrl}/grimoire/${kebabCase(frontmatter.title)}/`}
      />
      <h1 className={title}>
        {frontmatter.title}
      </h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </Layout>
  )
}

export const GimoireQuery = graphql`
  query GimoireQuery($title: String!) {
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
