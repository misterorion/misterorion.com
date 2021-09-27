import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'

import GithubLogo from './icons/github.svg'
import LinkedInLogo from './icons/linkedin.svg'
import TwitterLogo from './icons/twitter.svg'
import { container, icon } from './Footer.module.css'

const Footer = () => {
  const data = useStaticQuery(graphql`
    query FooterQuery {
      site {
        siteMetadata {
          userTwitter
          userLinkedIn
          userGitHub
        }
      }
    }
  `)

  const meta = data.site.siteMetadata

  const FooterLink = (props) => (
    <a href={props.link} className={icon}>
      <img src={props.logo} alt={props.logoAlt} width="36" />
    </a>
  )

  return (
    <footer className={container}>
      <FooterLink
        link={`https://www.linkedin.com/in/${meta.userLinkedIn}`}
        logo={LinkedInLogo}
        logoAlt={'LinkedIn'}
      />
      <FooterLink
        link={`https://twitter.com/${meta.userTwitter}`}
        logo={TwitterLogo}
        logoAlt={'Twitter'}
      />
      <FooterLink
        link={`https://github.com/${meta.userGitHub}`}
        logo={GithubLogo}
        logoAlt={'GitHub'}
      />
    </footer>
  )
}

export default Footer