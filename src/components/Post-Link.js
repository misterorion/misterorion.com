import React from 'react'
import { Link } from 'gatsby'
import * as postStyles from './style/post-link.module.css'

const PostLink = ({ post }) => (
  <Link to={`/${post.frontmatter.slug}`}>
    <div className={postStyles.box}>
      <div className={postStyles.title}>{post.frontmatter.title}</div>
      <div className={postStyles.date}>{post.frontmatter.date}</div>
    </div>
  </Link>
)

export default PostLink
