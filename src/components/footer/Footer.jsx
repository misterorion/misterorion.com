import React from 'react'

import GithubLogo from '../../assets/github.svg'
import LinkedInLogo from '../../assets/linkedin.svg'
import TwitterLogo from '../../assets/twitter.svg'
import { container, icon } from './Footer.module.css'

import { useSiteMetadata } from '../../hooks/Metadata'

const Footer = () => {
  const { userTwitter, userGitHub, userLinkedIn } = useSiteMetadata()
  const FooterLink = (props) => (
    <a href={props.link} className={icon}>
      <img src={props.logo} alt={props.logoAlt} width="36" />
    </a>
  )

  return (
    <footer className={container}>
      <FooterLink
        link={`https://www.linkedin.com/in/${userLinkedIn}`}
        logo={LinkedInLogo}
        logoAlt={'LinkedIn'}
      />
      <FooterLink
        link={`https://twitter.com/${userTwitter}`}
        logo={TwitterLogo}
        logoAlt={'Twitter'}
      />
      <FooterLink
        link={`https://github.com/${userGitHub}`}
        logo={GithubLogo}
        logoAlt={'GitHub'}
      />
    </footer>
  )
}

export default Footer
