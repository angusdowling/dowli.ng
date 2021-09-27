export interface SeoModel {
  /** Internal name */
  name?: string

  /** SEO title */
  title?: string

  /** Description */
  description?: string

  /** Keywords */
  keywords?: string[]

  /** Hide page from search engines (noindex) */
  no_index?: boolean

  /** Exclude links from search rankings (nofollow) */
  no_follow?: boolean
}
