import React from "react";
import { Link, graphql, useStaticQuery } from "gatsby";

import { useSiteMetadata } from "../../hooks/Metadata";
import { container, menuItem, nav, title } from "./Nav.module.css";

const Nav = () => {
  const { userFirstName, userLastName } = useSiteMetadata();
  const { allMarkdownRemark: pages } = useStaticQuery(
    graphql`
      query NavQuery {
        allMarkdownRemark(
          sort: { frontmatter: { date: DESC } }
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
    `
  );

  return (
    <div className={container}>
      <Link to="/">
        <h1 className={title}>
          <span className="text-pink-700">{userFirstName}</span>
          <span className="text-teal-700">{userLastName}</span>
        </h1>
      </Link>
      <nav className={nav}>
        <div className={menuItem}>
          <Link to={`/grimoire/`} key="grimoire">
            ✨ Grimoire
          </Link>
        </div>
        {pages.edges.map((edge) => {
          return (
            <div className={menuItem} key={edge.node.id}>
              <Link to={`/${edge.node.frontmatter.slug}/`}>
                {edge.node.frontmatter.title}
              </Link>
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Nav;
