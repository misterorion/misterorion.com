import React from "react"
import Helmet from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

const SEO = ({ title, description, image, url }) => {
  const data = useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          siteTitle
          siteDescription
          siteUrl
          siteImage
          userTwitter
        }
      }
    }
  `)

  const defaults = data.site.siteMetadata

  if (defaults.siteUrl === "") {
    console.error("Please set a siteUrl in your site metadata!")
    return null
  }

  const seo = {
    title: title || defaults.siteTitle,
    description: description || defaults.siteDescription,
    url: url || `${defaults.siteUrl}`,
    twitter: `@${defaults.userTwitter}`,
    image: `${defaults.siteUrl}${image || defaults.siteImage}`
  }

  return (
    <Helmet>
      <title>{seo.title}</title>
      <link rel="canonical" href={seo.url} />
      <meta name="description" content={seo.description} />

      <meta property="og:url" content={seo.url} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={seo.title} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:description" content={seo.description} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={seo.twitter} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:image" content={seo.image} />
      <meta name="twitter:description" content={seo.description} />
      
      <html lang="en" />
    </Helmet>
  )
}

export default SEO
