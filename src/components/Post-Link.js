import React from "react"
import { Link } from "gatsby"
import PostStyles from "./style/post-link.module.css"

export default ({ post }) => (
  <Link to={`/${post.frontmatter.slug}`}>
    <div className={PostStyles.box}>
      <div className={PostStyles.title}>{post.frontmatter.title}</div>
      <div className={PostStyles.date}>{post.frontmatter.date}</div>
    </div>
  </Link>
)
