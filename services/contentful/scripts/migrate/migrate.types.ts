import { ContentType } from "contentful-management/dist/typings/export-types"

export interface CreateOrUpdateContentTypeInterface {
  /** Space ID */
  spaceId: string

  /** Environment ID */
  environmentId: string

  /** Content type ID */
  contentTypeId: string

  /** Content type data model */
  data: Partial<ContentType>

  /** Action to do. Defaults to "update" */
  action?: "create" | "update"
}
