import {
  AbsoluteFill,
  CalculateMetadataFunction,
  OffthreadVideo,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { getVideoMetadata } from "@remotion/media-utils";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Intro } from "./Intro";
import { LikeSubscribeOutro } from "./LikeSubscribeOutro";
import styles from "../styles";

export type SubtitleProp = {
  startInSeconds: number;
  text: string;
};

export const longVideoSchema = z.object({
  src: z.string(),
  style: z.union([z.literal("openpatch"), z.literal("mathematik"), z.literal("informatik")]),
  title: z.string()
});

export const calculateLongVideoMetadata: CalculateMetadataFunction<
  z.infer<typeof longVideoSchema>
> = async ({ props }) => {
  const fps = 30;
  const metadata = await getVideoMetadata(props.src);

  return {
    fps,
    durationInFrames: Math.floor(metadata.durationInSeconds * fps) + 2 * fps,
  };
};

export const LongVideo: React.FC<{
  src: string;
  style: keyof typeof styles
  title: string;
}> = ({ src, style, title }) => {
  const styleConfig = styles[style];
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "white" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={2 * fps}>
          <Intro title={title} style={styleConfig} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: fps * 1 })} />
        <TransitionSeries.Sequence
          durationInFrames={durationInFrames - 3 * fps}>
          <AbsoluteFill>
            <OffthreadVideo
              style={{
                objectFit: "cover",
              }}
              src={src}
            />
          </AbsoluteFill>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: fps * 1 })} />
        <TransitionSeries.Sequence durationInFrames={3 * fps}>
          <LikeSubscribeOutro style={styleConfig} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
