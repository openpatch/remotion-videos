import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  cancelRender,
  continueRender,
  delayRender,
  getStaticFiles,
  OffthreadVideo,
  Sequence,
  useVideoConfig,
  watchStaticFile,
} from "remotion";
import { z } from "zod";
import SubtitlePage from "./SubtitlePage";
import { getVideoMetadata } from "@remotion/media-utils";
import { loadFont } from "../load-font";
import { NoCaptionFile } from "./NoCaptionFile";
import { Caption, createTikTokStyleCaptions } from "@remotion/captions";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Intro } from "./Intro";
import { LikeSubscribeOutro } from "./LikeSubscribeOutro";
import styles from "../styles";

export type SubtitleProp = {
  startInSeconds: number;
  text: string;
};

export const shortVideoSchema = z.object({
  src: z.string(),
  style: z.union([z.literal("openpatch"), z.literal("mathematik"), z.literal("informatik")]),
  title: z.string()
});

export const calculateShortVideoMetadata: CalculateMetadataFunction<
  z.infer<typeof shortVideoSchema>
> = async ({ props }) => {
  const fps = 30;
  const metadata = await getVideoMetadata(props.src);

  return {
    fps,
    durationInFrames: Math.floor(metadata.durationInSeconds * fps) + 2 * fps,
  };
};

const getFileExists = (file: string) => {
  const files = getStaticFiles();
  const fileExists = files.find((f) => {
    return f.src === file;
  });
  return Boolean(fileExists);
};

// How many captions should be displayed at a time?
// Try out:
// - 1500 to display a lot of words at a time
// - 200 to only display 1 word at a time
const SWITCH_CAPTIONS_EVERY_MS = 1000;

export const ShortVideo: React.FC<{
  src: string;
  style: keyof typeof styles
  title: string;
}> = ({ src, style, title }) => {
  const styleConfig = styles[style];
  const [subtitles, setSubtitles] = useState<Caption[]>([]);
  const [handle] = useState(() => delayRender());
  const { fps, durationInFrames } = useVideoConfig();

  const subtitlesFile = src
    .replace(/.mp4$/, ".json")
    .replace(/.mkv$/, ".json")
    .replace(/.mov$/, ".json")
    .replace(/.webm$/, ".json");

  const fetchSubtitles = useCallback(async () => {
    try {
      await loadFont();
      const res = await fetch(subtitlesFile);
      const data = (await res.json()) as Caption[];
      setSubtitles(data);
      continueRender(handle);
    } catch (e) {
      cancelRender(e);
    }
  }, [handle, subtitlesFile]);

  useEffect(() => {
    fetchSubtitles();

    const c = watchStaticFile(subtitlesFile, () => {
      fetchSubtitles();
    });

    return () => {
      c.cancel();
    };
  }, [fetchSubtitles, src, subtitlesFile]);

  const { pages } = useMemo(() => {
    return createTikTokStyleCaptions({
      combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
      captions: subtitles ?? [],
    });
  }, [subtitles]);

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
          {pages.map((page, index) => {
            const nextPage = pages[index + 1] ?? null;
            const nextStartMs = nextPage?.startMs + 1000;
            const startMs = page.startMs + 1000;
            const subtitleStartFrame = (startMs / 1000) * fps;
            const subtitleEndFrame = Math.min(
              nextPage ? (nextStartMs / 1000) * fps : Infinity,
              subtitleStartFrame + SWITCH_CAPTIONS_EVERY_MS,
            );
            const durationInFrames = subtitleEndFrame - subtitleStartFrame;
            if (durationInFrames <= 0) {
              return null;
            }

            return (
              <Sequence
                key={index}
                from={subtitleStartFrame}
                durationInFrames={durationInFrames}
              >
                <SubtitlePage key={index} style={styleConfig} page={page} />;
              </Sequence>
            );
          })}
          {getFileExists(subtitlesFile) ? null : <NoCaptionFile />}
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: fps * 1 })} />
        <TransitionSeries.Sequence durationInFrames={3 * fps}>
          <LikeSubscribeOutro style={styleConfig} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
