import { ContentType } from "contentful-management/dist/typings/export-types"

export interface CustomContentType extends Partial<ContentType> {
  /** ID of the content type */
  id: string
}
