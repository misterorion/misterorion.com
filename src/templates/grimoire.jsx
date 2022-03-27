import React from 'react'
import { graphql } from 'gatsby'
import { kebabCase } from 'lodash'

import Layout from '../components/Layout'
import Seo from '../components/Seo/Seo'
import { useSiteMetadata } from '../hooks/Metadata'
import { title } from '../components/Layout.module.css'

const GrimoirePage = ({ data }) => {
  const { frontmatter, html } = data.markdownRemark
  const { siteUrl } = useSiteMetadata()
  return (
    <Layout>
      <Seo
        title={frontmatter.title}
        description={frontmatter.title || 'nothin’'}
        url={`${siteUrl}/grimoire/${kebabCase(frontmatter.title)}/`}
      />
      <h1 className={title}>
        {frontmatter.title}
      </h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </Layout>
  )
}

export const GrimoireTitleQuery = graphql`
  query GrimoireTitleQuery($title: String!) {
    markdownRemark(frontmatter: { title: { eq: $title } }) {
      html
      frontmatter {
        title
      }
    }
  }
`

export default GrimoirePage
