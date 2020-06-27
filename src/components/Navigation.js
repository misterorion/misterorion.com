import React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import Logo from "./icons/favicon.png"
import NavStyles from "./style/nav.module.css"

export default () => {
  const data = useStaticQuery(graphql`
    query NavQuery {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        filter: { fileAbsolutePath: { regex: "/(pages)/" } }
      ) {
        edges {
          node {
            id
            frontmatter {
              slug
              title
            }
          }
        }
      }
      site {
        siteMetadata {
          siteTitle
        }
      }
    }
  `)
  const Navigation = ({ navData, metaData }) => (
    <div className={NavStyles.mainContainer}>
      <Link to="/">
        <img src={Logo} alt="ensō" className={NavStyles.logo} />
      </Link>
      <div className={NavStyles.textContainer}>
        <Link to="/">
          <h1 className={NavStyles.siteTitle}>{metaData.siteTitle}</h1>
        </Link>
        <nav className={NavStyles.nav}>
          {navData.map((navItem, i) => {
            return (
              <div className={NavStyles.menuItem}>
                <Link to={`/${navItem.node.frontmatter.slug}`} key={i}>
                  {navItem.node.frontmatter.title}
                </Link>
              </div>
            )
          })}
        </nav>
      </div>
    </div>
  )
  return (
    <Navigation
      navData={data.allMarkdownRemark.edges}
      metaData={data.site.siteMetadata}
    />
  )
}
