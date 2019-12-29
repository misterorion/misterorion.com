import React from "react"
import Navigation from "./Navigation"
import Footer from "./Footer"
import SiteConfig from "../../SiteConfig"
import Metadata from "../components/Metadata"

export default ({ children }) => {
  return (
    <div class="container rounded px-6 py-6 max-w-5xl bg-gray-100 border-gray-400 sm:my-3 sm:w-5/6 md:px-32 lg:w-4/5 sm:border">
    <Metadata />
      <Navigation />
      <article>{children}</article>
      <Footer data={SiteConfig} />
    </div>
  )
}
