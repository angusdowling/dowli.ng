import { Entry } from "contentful"
import { ContentfulClient } from "../client"

/**
 * Gets a single Contentful entry using a query.
 * @param query - Query to match.
 */
export const getEntry = async <T>(query?: any): Promise<Entry<T>> => {
  const entries = await ContentfulClient.getEntries<any>(query)
  return entries.items[0]
}
