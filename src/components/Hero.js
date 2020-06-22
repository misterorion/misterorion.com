import React from "react"
import { graphql, useStaticQuery } from "gatsby"

import Img from "gatsby-image"
import HeroStyles from "./style/hero.module.css"

export default () => {
  const data = useStaticQuery(graphql`
    query HeroQuery {
      homeImg: file(relativePath: { eq: "me3.jpg" }) {
        childImageSharp {
          fluid(maxWidth: 250, maxHeight: 250) {
            ...GatsbyImageSharpFluid_tracedSVG
          }
        }
      }
      site {
        siteMetadata {
          userName
        }
      }
    }
  `)
  return (
    <div className={HeroStyles.box}>
      <div className={HeroStyles.image}>
        <Img
          fluid={data.homeImg.childImageSharp.fluid}
          alt={data.site.siteMetadata.userName}
        />
      </div>
      <div className={HeroStyles.text}>
        Greetings. My name is Orion Anderson. I'm a DevOps Developer located in New York City. I love all things Linux, Docker, AWS and automation.
      </div>
    </div>
  )
}
