import React from "react"
import Navigation from "./Navigation"
import Footer from "./Footer"
import SiteConfig from "../../SiteConfig"

export default ({ children }) => {
  return (
    <div class="container rounded px-6 py-6 my-3 sm:w-5/6 md:px-32 lg:w-4/5 max-w-5xl bg-gray-100 border border-gray-400">
      <Navigation />
      <article>{children}</article>
      <Footer data={SiteConfig} />
    </div>
  )
}
