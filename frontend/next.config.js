const contentfulConfig = require("./services/contentful/client/config")
const withMDX = require("@next/mdx")({
  extension: /\.mdx$/
})

/** @type {import('next').NextConfig} */
module.exports = withMDX({
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  reactStrictMode: true,
  serverRuntimeConfig: {},
  publicRuntimeConfig: {
    contentfulConfig
  }
})
