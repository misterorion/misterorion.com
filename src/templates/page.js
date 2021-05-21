import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Seo from '../components/Seo'

const Page = ({ data }) => {
  const { markdownRemark: page } = data
  return (
    <Layout>
      <Seo
        title={page.frontmatter.title}
        description={page.description || 'nothin’'}
        url={`${data.site.siteMetadata.siteUrl}/${page.frontmatter.slug}/`}
      />
      <h1 className="text-4xl mb-4 mt-12 font-bold">
        {page.frontmatter.title}
      </h1>
      <div dangerouslySetInnerHTML={{ __html: page.html }} />
    </Layout>
  )
}
export const pageQuery = graphql`
  query PageByPath($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
        description
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
