import React from "react"
import SEO from "../components/SEO"
import Navigation from "./Navigation"
import Footer from "./Footer"

export default ({ children }) => {
  return (
      <div className="mainContainer">
        <SEO />
        <Navigation siteTitle="Orion Anderson" />
        <article>{children}</article>
        <Footer />
      </div>
  )
}
