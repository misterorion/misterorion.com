import React from 'react'
import { Link, graphql, useStaticQuery } from 'gatsby'
import { mainContainer, menuItem, nav, siteTitle, textContainer } from './modules/nav.module.css'

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
          userFirstName
          userLastName
        }
      }
    }
  `)
  const Navigation = ({ navData, metaData }) => (
    <div className={mainContainer}>
      <div className={textContainer}>
        <Link to="/">
          <h1 className={siteTitle}>
            <span className="text-pink-700">{metaData.userFirstName}</span>
            <span className="text-teal-700">{metaData.userLastName}</span>
          </h1>
        </Link>
        <nav className={nav}>
          {navData.map((navItem, i) => {
            return (
              <div className={menuItem}>
                <Link to={`/${navItem.node.frontmatter.slug}/`} key={i}>
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
