import * as contentful from "contentful"
import getConfig from "next/config"

const { publicRuntimeConfig } = getConfig()

/**
 * Note: We're using public runtime config here
 * instead of directly importing it from the config file
 * so that we can have it available on the browser as well
 */
export const ContentfulClient = contentful.createClient(
  publicRuntimeConfig.contentfulConfig
)
