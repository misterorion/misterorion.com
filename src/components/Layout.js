import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
// import Navigation from "./Navigation"

export default ({ children }) => {
//   const data = useStaticQuery(graphql`
//     query MySiteQuery {
//     }
//   `)
  return (
    <>
      <section className="section">
        <div className="container is-main">
          <div className="column is-three-fifths is-offset-one-fifth">
            <h1 className="title has-text-centered">
              <Link to="/">x</Link>
            </h1>
            <h2 className="has-text-centered">
              x
            </h2>
            <Navigation />
            <hr />
            x
            <hr />
          </div>
        </div>
      </section>
    </>
  )
}
