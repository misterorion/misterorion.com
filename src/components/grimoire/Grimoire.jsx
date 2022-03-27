import React from 'react'
import { Link } from 'gatsby'
import { kebabCase } from 'lodash'

import { arrow, title, excerpt, row, tagStyle, tagsList } from './Grimoire.module.css'

const GrimoireEntry = ({ entry }) => (
  <div className={row}>
    <div>
      <Link to={`/grimoire/${kebabCase(entry.title)}/`} className={title}>
        {entry.title}
      </Link>
      <span className={arrow}>▶</span>
      <span className={excerpt}>{entry.excerpt}</span>
    </div>
    <div className={tagsList}>
      {entry.tags.map(tag => (
        <Link
          to={`/grimoire/tag/${kebabCase(tag)}/`}
          className={tagStyle}
          key={tag}>
          {tag}
        </Link>
      ))}
    </div>
  </div>
)

export default GrimoireEntry
