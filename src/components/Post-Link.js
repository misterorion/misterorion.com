import React from 'react'
import { Link } from 'gatsby'

import { box } from './post-Link.module.css'
import { title } from './post-Link.module.css'
import { date } from './post-Link.module.css'

const PostLink = ({ post }) => (
  <Link to={`/${post.frontmatter.slug}`}>
    <div className={box}>
      <div className={title}>{post.frontmatter.title}</div>
      <div className={date}>{post.frontmatter.date}</div>
    </div>
  </Link>
)

export default PostLink
