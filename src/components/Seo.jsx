import React, { Fragment } from "react";

import { useSiteMetadata } from "../hooks/Metadata";

const Seo = ({ title, description, image, url }) => {
  const {
    siteUrl,
    siteTitle,
    siteDescription,
    siteImage,
    userName,
    userTwitter,
  } = useSiteMetadata();

  if (siteUrl === "") {
    console.error("Please set a siteUrl in your site metadata!");
    return null;
  }

  // if (!image) {
  //   image = siteImage;
  // }

  // if (!description) {
  //   description = siteDescription;
  // }

  return (
    <Fragment>
      <title>{title || siteTitle}</title>
      <link rel="canonical" href={url || `${siteUrl}`} />
      <meta name="description" content={description || siteDescription} />
      <meta name="author" content={userName} />
      <meta property="og:image" content={`${siteUrl}${image || siteImage}`} />
      <meta property="og:description" content={description || siteDescription} />
      <meta property="og:title" content={title || siteTitle} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={url || `${siteUrl}`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={`@${userTwitter}`} />
      <meta name="twitter:description" content={description || siteDescription} />
      <meta name="twitter:image" content={`${siteUrl}${image || siteImage}`} />
      <meta name="twitter:title" content={title || siteTitle} />
      <script defer data-domain="misterorion.com" src="/js/script.js"></script>
    </Fragment>
  );
};

export default Seo;
