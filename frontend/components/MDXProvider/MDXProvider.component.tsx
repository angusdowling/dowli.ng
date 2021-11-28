import { MDXProvider as Provider } from "@mdx-js/react"
import { PageDescription } from "components/PageDescription/PageDescription.component"

export const MDXProvider: React.FC<any> = (props) => {
  return <Provider components={{ PageDescription }}>{props.children}</Provider>
}
