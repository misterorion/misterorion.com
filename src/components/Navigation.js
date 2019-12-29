import React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import Logo from "../../content/images/favicon.png"
import SiteConfig from "../../SiteConfig"

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
    }
  `)
  const Navigation = ({ navData }) => (
    <div className="flex items-center border-b mb-12 py-6 border-teal-400">
      <Link to="/">
        <img src={Logo} alt="ensō" className="fill-current h-8 w-8 mr-4" />
      </Link>
      <div className="flex w-full items-baseline">
        <Link to="/">
          <h1 className="text-2xl font-bold">{SiteConfig.siteTitle}</h1>
        </Link>
        <nav className="ml-auto">
          {navData.map((navItem, i) => {
            return (
              <div className="ml-4 text-lg text-gray-600 hover:text-red-600">
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
    <div>
      <Navigation navData={data.allMarkdownRemark.edges} />
    </div>
  )
}
