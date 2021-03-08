import React from 'react'
import { Link, graphql, useStaticQuery } from 'gatsby'
import Logo from './icons/favicon.png'
import * as navStyles from './style/nav.module.css'

const Navigation = () => {
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
    <div className={navStyles.mainContainer}>
      <Link to="/">
        <img src={Logo} alt="ensō" className={navStyles.logo} />
      </Link>
      <div className={navStyles.textContainer}>
        <Link to="/">
          <h1 className={navStyles.siteTitle}>{metaData.siteTitle}</h1>
        </Link>
        <nav className={navStyles.nav}>
          {navData.map((navItem, i) => {
            return (
              <div className={navStyles.menuItem}>
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

export default Navigation
