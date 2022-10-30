import React from 'react'
import { Helmet } from "react-helmet"
import Layout from '../components/Layout'
import { useSiteMetadata } from '../hooks/Metadata'

const Error = () => {
  const { siteTitle } = useSiteMetadata()
  return (
    <Layout>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{siteTitle} - 404</title>
      </Helmet>
      <h1>404 Not Found.</h1>
    </Layout>
  )
}

export default Error
