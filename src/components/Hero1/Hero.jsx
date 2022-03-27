import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'

import { useSiteMetadata } from '../../hooks/Metadata'
import { box, image, text } from './Hero.module.css'

const Hero = () => {
  const { siteGreeting, userName } = useSiteMetadata()
  const { homeImg } = useStaticQuery(
    graphql`
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
      }
    `
  )

  return (
    <div className={box}>
      <div className={image}>
        <GatsbyImage
          alt={userName}
          image={homeImg.childImageSharp.gatsbyImageData}
        />
      </div>
      <div className={text}>
        {siteGreeting}
      </div>
    </div>
  )
}

export default Hero
