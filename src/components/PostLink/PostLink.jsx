import React from 'react'
import { Link } from 'gatsby'

import { box, postDate, postTitle, postLink } from './PostLink.module.css'

const PostLink = ({ post }) => {
  const { slug, title, date } = post.frontmatter
  return (
    <Link className={postLink} to={`/${slug}/`}>
      <div className={box}>
        <div className={postTitle}>{title}</div>
        <div className={postDate}>{date}</div>
      </div>
    </Link>
  )
}

export default PostLink
