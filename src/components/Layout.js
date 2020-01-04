import React from "react"
import Metadata from "../components/Metadata"
import Navigation from "./Navigation"
import Footer from "./Footer"

export default ({ children }) => {
  return (
      <div className="mainContainer">
        <Metadata />
        <Navigation siteTitle="Orion Anderson" />
        <article>{children}</article>
        <Footer />
      </div>
  )
}
