import { Thing, WithContext } from "schema-dts"

type Props<T extends Thing> = {
  context: WithContext<T>
}

export default function JsonLD<T extends Thing>({ context }: Props<T>) {
  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(context).replace(/</g, "\\u003c"),
      }}
    />
  )
}