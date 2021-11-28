/**
 * Note: This is formatted as a commonjs module export so
 * that it can be imported into next.config.js without errors
 */
module.exports = {
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_DELIVERY_ACCESS_TOKEN,
  host: process.env.CONTENTFUL_HOST,
  environment: process.env.CONTENTFUL_ENVIRONMENT
}
