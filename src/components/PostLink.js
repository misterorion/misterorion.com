import React from 'react'
import { Link } from 'gatsby'
import { box, date, title } from './modules/PostLink.module.css'

const PostLink = ({ post }) => (
  <Link to={`/${post.frontmatter.slug}/`}>
    <div className={box}>
      <div className={title}>{post.frontmatter.title}</div>
      <div className={date}>{post.frontmatter.date}</div>
    </div>
  </Link>
)

export default PostLink
