import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'

import { box, image, text } from './styles/Hero.module.css'

const Hero = () => {
  const data = useStaticQuery(graphql`
    query HeroQuery {
      homeImg: file(relativePath: {eq: "hero.jpg" }) {
        childImageSharp {
          gatsbyImageData(
            width: 250
            height: 250
            placeholder: NONE
            layout: CONSTRAINED
          )
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
    <div className={box}>
      <div className={image}>
        <GatsbyImage
          alt={data.site.siteMetadata.userName}
          image={data.homeImg.childImageSharp.gatsbyImageData}
        />
      </div>
      <div className={text}>
        Greetings. My name is Orion Anderson. I'm a DevOps Developer New York
        City. I love all things Linux, Docker, AWS and automation.
      </div>
    </div>
  )
}

export default Hero
