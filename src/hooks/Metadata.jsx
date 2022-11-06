import { useStaticQuery, graphql } from "gatsby"

export const useSiteMetadata = () => {
  const data = useStaticQuery(graphql`
      query {
        site {
          siteMetadata {
            siteUrl
            siteTitle
            siteDescription
            siteGreeting
            siteImage
            userName
            userFirstName
            userLastName
            userGitHub
            userTwitter
            userLinkedIn
          }
        }
      }
    `
  )

  return data.site.siteMetadata
}