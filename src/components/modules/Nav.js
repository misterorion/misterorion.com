import React from 'react'
import { Link, graphql, useStaticQuery } from 'gatsby'

import { container, menuItem, nav, siteTitle } from './Nav.module.css'

const Nav = () => {
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
  const Nav = ({ navData, metaData }) => (
    <div className={container}>
      <Link to="/">
        <h1 className={siteTitle}>
          <span className="text-pink-700">{metaData.userFirstName}</span>
          <span className="text-teal-700">{metaData.userLastName}</span>
        </h1>
      </Link>
      <nav className={nav}>
        <div className={menuItem}>
          <Link to={`/grimoire/`} key="grimoire">
          ✨ Grimoire
          </Link>
        </div>
        {navData.map((navItem) => {
          return (
            <div className={menuItem} key={navItem.node.id}>
              <Link to={`/${navItem.node.frontmatter.slug}/`} >
                {navItem.node.frontmatter.title}
              </Link>
            </div>
          )
        })}
      </nav>
    </div>
  )
  return (
    <Nav
      navData={data.allMarkdownRemark.edges}
      metaData={data.site.siteMetadata}
    />
  )
}

export default Nav
