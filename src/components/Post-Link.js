import React from "react"
import { Link } from "gatsby"

const PostLink = ({ post }) => (
  <Link to={post.frontmatter.slug}>
    <div className="mb-6 p-6 border border-gray-400 hover:border-red-500 hover:bg-orange-100 rounded hover:shadow">
      <div className="text-2xl text-gray-900 font-bold">{post.frontmatter.title}</div>
      <div className="text-gray-600">{post.frontmatter.date}</div>
    </div>
  </Link>
)
export default PostLink
