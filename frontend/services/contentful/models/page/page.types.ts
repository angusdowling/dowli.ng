import { ContentTypeLink } from "contentful"

export interface PageModel {
  /** Internal name */
  name: string

  /** Page title */
  title: string

  /** Slug */
  slug: string

  /** SEO metadata */
  seo?: ContentTypeLink
}
