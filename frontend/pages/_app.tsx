// import '../styles/globals.css'
import { MDXProvider } from "components/MDXProvider/MDXProvider.component"
import type { AppProps } from "next/app"

function App({ Component, pageProps }: AppProps) {
  return (
    <MDXProvider>
      <Component {...pageProps} />
    </MDXProvider>
  )
}
export default App
