import React from "react"
import Navigation from "./Navigation"
import Footer from "./Footer"
import SiteConfig from "../../SiteConfig"
import Metadata from "../components/Metadata"

export default ({ children }) => {
  return (
    <>
    <Metadata />
    <div class="container rounded px-6 py-6 sm:my-3 w-full sm:w-5/6 md:px-32 lg:w-4/5 max-w-5xl bg-gray-100 sm:border border-gray-400">
      <Navigation />
      <article>{children}</article>
      <Footer data={SiteConfig} />
    </div>
    </>
  )
}
