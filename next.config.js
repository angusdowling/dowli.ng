const contentfulConfig = require("./services/contentful/client/config")

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  serverRuntimeConfig: {},
  publicRuntimeConfig: {
    contentfulConfig
  }
}
