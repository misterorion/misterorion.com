import React from "react";
import Layout from "../components/Layout";
import { useSiteMetadata } from "../hooks/Metadata";
import Seo from "../components/Seo/Seo";

const Error = () => {
  return (
    <Layout>
      <h1>404 Not Found.</h1>
    </Layout>
  );
};

export const Head = () => {
  const { siteTitle } = useSiteMetadata();

  return <Seo title={`${siteTitle} - 404`} />;
};

export default Error;
