import React from 'react'
import { Helmet } from 'react-helmet'

import { useSiteMetadata } from '../../hooks/Metadata'

const Seo = ({ title, description, image, url }) => {
  const {
    siteUrl,
    siteTitle,
    siteDescription,
    siteImage,
    userName,
    userTwitter
  } = useSiteMetadata()

  if (siteUrl === '') {
    console.error('Please set a siteUrl in your site metadata!')
    return null
  }

  const seo = {
    title: title || siteTitle,
    description: description || siteDescription,
    url: url || `${siteUrl}`,
    author: userName,
    twitter: `@${userTwitter}`,
    image: `${siteUrl}${image || siteImage}`,
  }

  return (
    <Helmet>
      <html lang="en" />
      <link rel="canonical" href={seo.url} />
      <meta name="description" content={seo.description} />

      <title>{seo.title}</title>

      <meta name="author" content={seo.author} />

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

      <script defer data-domain="misterorion.com" src="/js/script.js"></script>
    </Helmet>
  )
}

export default Seo
