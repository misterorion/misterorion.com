import React from "react"
import Me from "../../content/images/me.jpg"
import { graphql, useStaticQuery } from "gatsby"
import HeroStyles from "./style/hero.module.css"

export default () => {
  const data = useStaticQuery(graphql`
    query HeroQuery {
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
        <img src={Me} alt={data.site.siteMetadata.userName} />
      </div>
      <div className={HeroStyles.text}>
        Greetings! My name is Orion Anderson. I'm a DevOps Developer located in
        New York City. I love all things Linux, Docker, AWS and automation. I
        also dabble in front-end development.
      </div>
    </div>
  )
}
