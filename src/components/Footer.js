import React from "react"

import TwitterLogo from "../../content/images/icons/twitter.svg"
import EmailLogo from "../../content/images/icons/email.svg"
import GithubLogo from "../../content/images/icons/github.svg"
import LinkedInLogo from "../../content/images/icons/linkedin.svg"
import GatsbyLogo from "../../content/images/icons/gatsby.png"

export default ({ data }) => (
  <footer className="flex flex-row py-10 border-t border-teal-400">
    <div className="mr-3">
      <a href={`mailto:${data.userEmail}`}>
        <img src={EmailLogo} alt="Email" width="35" />
      </a>
    </div>
    <div className="mr-3">
      <a href={`https://www.linkedin.com/in/${data.userLinkedIn}`}>
        <img src={LinkedInLogo} alt="Twitter" width="35" />
      </a>
    </div>
    <div className="mr-3">
      <a href={`https://twitter.com/${data.userTwitter}`}>
        <img src={TwitterLogo} alt="Twitter" width="35" />
      </a>
    </div>
    <div className="mr-3">
      <a href={`https://github.com/${data.userGitHub}`}>
        <img src={GithubLogo} alt="Twitter" width="35" />
      </a>
    </div>
    <div className="justify-end ml-auto flex flex-row items-center">
      <div className="ml-5">
        <a href="https://gatsbyjs.org">
          <img src={GatsbyLogo} alt="Made with GatsbyJS" width="35" />
        </a>
      </div>
    </div>
  </footer>
)
