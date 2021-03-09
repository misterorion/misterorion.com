import React from 'react'
import SEO from '../components/SEO'
import Navigation from './Navigation'
import Footer from './Footer'
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/400-italic.css"
import "@fontsource/roboto/700.css"
import "@fontsource/quicksand/700.css"

const Layout = ({ children }) => {
  return (
    <div className="mainContainer">
      <SEO />
      <Navigation siteTitle="Orion Anderson" />
      <article>{children}</article>
      <Footer />
    </div>
  )
}

export default Layout
