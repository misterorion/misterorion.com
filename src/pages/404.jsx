import React from 'react'
import { Helmet } from "react-helmet"
import Layout from '../components/Layout'

const Error = () => {
  return (
    <Layout>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Orion Anderson - 404</title>
      </Helmet>
      <h1>404 Not Found.</h1>
    </Layout>
  )
}

export default Error
