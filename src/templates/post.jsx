import React from "react";
import { Link, graphql } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import { kebabCase } from "lodash";

import ContactForm from "../components/ContactForm/ContactForm";
import Layout from "../components/Layout";
import Seo from "../components/Seo";
import { useSiteMetadata } from "../hooks/Metadata";
import {
  featImg,
  date,
  description,
  tags,
} from "../components/Layout.module.css";

const Post = ({ data }) => {
  const { frontmatter: post, html: content } = data.markdownRemark;

  const image = post.imageFluid ? (
    <GatsbyImage
      alt={post.imageAlt}
      loading="eager"
      image={post.imageFluid.childImageSharp.gatsbyImageData}
    />
  ) : (
    <GatsbyImage
      alt={post.imageAlt}
      loading="eager"
      image={post.imageFixed.childImageSharp.gatsbyImageData}
    />
  );

  return (
    <Layout>
      <h1>{post.title}</h1>
      <div className={date}>{post.date}</div>
      <div className={description}>
        <p>{post.description}</p>
      </div>
      <div className={featImg}>{image}</div>
      <div dangerouslySetInnerHTML={{ __html: content }} />
      <div className={tags}>
        <h3>Tags:</h3>
        <ul>
          {post.tags.map((tag) => (
            <li key={tag}>
              <Link to={`/tags/${kebabCase(tag)}`}>{tag}</Link>
            </li>
          ))}
        </ul>
      </div>
      <ContactForm />
    </Layout>
  );
};

export function Head({ data }) {
  const { siteUrl } = useSiteMetadata();
  const { frontmatter: post } = data.markdownRemark;

  const imagePath = post.imageFluid
    ? post.imageFluid.childImageSharp.original.src
    : post.imageFixed.childImageSharp.original.src;

  return (
    <Seo
      title={post.title}
      description={post.description || ""}
      image={imagePath}
      url={`${siteUrl}/${post.slug}/`}
    />
  );
};

export const PostBySlugQuery = graphql`
  query PostBySlugQuery($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
        description
        tags
        imageFluid {
          childImageSharp {
            gatsbyImageData(placeholder: NONE, layout: FULL_WIDTH)
            original {
              src
            }
          }
        }
        imageFixed {
          childImageSharp {
            gatsbyImageData(placeholder: NONE, layout: CONSTRAINED)
            original {
              src
            }
          }
        }
        imageAlt
      }
    }
  }
`;

export default Post;
