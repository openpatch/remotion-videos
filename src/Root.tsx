import { Composition, staticFile } from "remotion";
import {
  ShortVideo,
  calculateShortVideoMetadata,
  shortVideoSchema,
} from "./ShortVideo";
import {
  LongVideo,
  calculateLongVideoMetadata,
  longVideoSchema,
} from "./LongVideo";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ShortVideo"
        component={ShortVideo}
        calculateMetadata={calculateShortVideoMetadata}
        schema={shortVideoSchema}
        width={1080}
        height={1920}
        defaultProps={{
          src: staticFile("video.mkv"),
          style: "mathematik",
          title: "Die die die die die die die die natürliche Exponentialfunktion"
        }}
      />
      <Composition
        id="LongVideo"
        component={LongVideo}
        calculateMetadata={calculateLongVideoMetadata}
        schema={longVideoSchema}
        width={1920}
        height={1080}
        defaultProps={{
          src: staticFile("video.mkv"),
          style: "informatik",
          title: "Die die die die die die die die natürliche Exponentialfunktion, die sehr lange titel hat und sogar noch länger"
        }}
      />
    </>
  );
};
