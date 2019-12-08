import React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"

export default () => {
  const data = useStaticQuery(graphql`
  query MyNavQuery {
    allMarkdownRemark(filter: {frontmatter: {template: {eq: "page"}}}) {
      edges {
        node {
          id
          frontmatter {
            title
            path
          }
        }
      }
    }
  }
  `)
  const Navigation = ({ navData, navClass }) => (
    <>
      {navData.map((navItem, i) => {
        return (
          <Link className={navClass} to={navItem.url} key={i}>
            {navItem.label}
          </Link>
        )
      })}
    </>
  )
  const Pages = ({ pagesData, pagesClass }) => (
    <>
      {pagesData.map(({ node }) => {
        return (
          <Link to={`/${node.slug}/`} className={pagesClass} key={node.id}>
            {node.title}
          </Link>
        )
      })}
    </>
  )
  return (
    <nav
      className="navbar is-light has-background-white-ter"
      role="navigation"
      aria-label="main navigation"
    >
      <div id="navbarMain" className="navbar-menu">
        <div className="navbar-start">
          <Navigation
            navData={data.allGhostSettings.edges[0].node.navigation}
            navClass="navbar-item"
          />
          <Pages pagesData={data.allGhostPage.edges} pagesClass="navbar-item" />
        </div>
      </div>
    </nav>
  )
}
