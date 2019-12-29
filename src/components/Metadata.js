import React from "react"
import { Helmet } from "react-helmet"

export default () => {
  return (
    <Helmet defer={false} defaultTitle="Orion Anderson">
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1,shrink-to-fit=no,viewport-fit=cover"
      />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en" />
    </Helmet>
  )
}
