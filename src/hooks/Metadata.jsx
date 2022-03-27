import { useStaticQuery, graphql } from "gatsby"

export const useSiteMetadata = () => {
  const { site } = useStaticQuery(
    graphql`
      query SiteMetadataQuery {
        site {
          siteMetadata {
            siteUrl
            siteTitle
            siteDescription
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
  return site.siteMetadata
}