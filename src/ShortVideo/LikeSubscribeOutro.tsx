import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { spring } from 'remotion';
import React from 'react';
import { Style } from '../styles';

export const LikeSubscribeOutro: React.FC<{ style: Style }> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 👍 Like animation: frame 0–20
  const likeScale = spring({
    frame: frame < 20 ? 0 : Math.min(frame, 40),
    fps,
    from: 0,
    to: 1,
    durationInFrames: 20,
  });

  // 🔴 Subscribe animation: frame 20–40
  const subscribeScale = spring({
    frame: Math.max(0, frame - 40),
    fps,
    from: 0,
    to: 1,
    durationInFrames: 10,
  });

  // 🔔 Bell animation: frame 40–60
  const bellScale = spring({
    frame: Math.max(0, frame - 51),
    fps,
    from: 0,
    to: 1,
    durationInFrames: 10,
  });

  const bellFrame = Math.max(0, frame - 60);
  const bellWobble =
    bellFrame > 0
      ? Math.sin(bellFrame / 2) * 10 * Math.exp(-bellFrame / 10)
      : 0;

  // Fade in the whole component
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: style.primary,
        color: style.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'MV Boli',
        fontSize: 52,
        opacity,
      }}
    >
      <h2 style={{ marginBottom: 40 }}>Danke fürs Zuschauen!</h2>

      <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
        {/* Like */}
        <div
          style={{
            transform: `scale(${likeScale})`,
            transition: 'transform 0.3s',
            fontSize: 60,
          }}
        >
          👍
        </div>

        {/* Subscribe */}
        <div
          style={{
            padding: '12px 24px',
            backgroundColor: 'red',
            color: 'white',
            borderRadius: 8,
            fontWeight: 'bold',
            fontSize: 42,
            cursor: 'pointer',
            transform: `scale(${subscribeScale})`,
          }}
        >
          ABONNIEREN
        </div>

        {/* Notification Bell */}
        <div
          style={{
            fontSize: 60,
            transform: `scale(${bellScale}) rotate(${bellWobble}deg)`,
            transformOrigin: 'center',
          }}
        >
          🔔
        </div>
      </div>
    </div>
  );
};

