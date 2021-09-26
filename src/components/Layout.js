import React from 'react'
import Seo from './Seo'
import Nav from './modules/nav/Nav'
import Footer from './modules/footer/Footer'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/400-italic.css'
import '@fontsource/roboto/700.css'
import '@fontsource/quicksand/700.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/400-italic.css'
import '@fontsource/jetbrains-mono/600.css'
import '@fontsource/jetbrains-mono/600-italic.css'

const Layout = ({ children }) => {
  return (
    <div className="mainContainer">
      <Seo />
      <Nav siteTitle="Orion Anderson" />
      <article>{children}</article>
      <Footer />
    </div>
  )
}

export default Layout
