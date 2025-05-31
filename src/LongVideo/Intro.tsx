import { AbsoluteFill } from "remotion"
import { Banner } from "./Banner"
import type { Style } from "../styles"

export const Intro: React.FC<{ style: Style, title: string }> = ({ style, title }) => {
  return <AbsoluteFill style={{
    backgroundColor: "white",
  }}
  >
    <Banner style={style} title={title} />
  </AbsoluteFill >
}
