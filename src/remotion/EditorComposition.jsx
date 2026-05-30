import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { getClipAtPlayhead } from "../editor/timeline.js";

function getAsset(project, clip) {
  return project.mediaAssets.find((asset) => asset.id === clip?.assetId);
}

export function EditorComposition({ project }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;
  const clip = getClipAtPlayhead(project, seconds);
  const asset = getAsset(project, clip);
  const activeOverlays = project.textOverlays.filter((overlay) => (
    seconds >= overlay.startSeconds &&
    seconds < overlay.startSeconds + overlay.durationSeconds
  ));
  const subtleZoom = interpolate(frame % 180, [0, 180], [1, 1.035], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#07090d", color: "white", overflow: "hidden" }}>
      {asset?.posterSrc ? (
        <Img
          src={asset.posterSrc}
          style={{
            height: "100%",
            objectFit: "cover",
            transform: `scale(${subtleZoom})`,
            width: "100%",
          }}
        />
      ) : (
        <AbsoluteFill
          style={{
            alignItems: "center",
            background: "linear-gradient(180deg, #243140 0%, #0d1118 100%)",
            display: "flex",
            fontFamily: "Inter, system-ui, sans-serif",
            justifyContent: "center",
            padding: 64,
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: 58, lineHeight: 1.05 }}>{asset?.name || "Reselect media"}</h1>
        </AbsoluteFill>
      )}

      <AbsoluteFill
        style={{
          border: "2px solid rgba(255,255,255,0.22)",
          bottom: 132,
          left: 64,
          pointerEvents: "none",
          right: 64,
          top: 132,
        }}
      />

      {activeOverlays.map((overlay) => (
        <div
          key={overlay.id}
          style={{
            background: "rgba(7, 10, 14, 0.76)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 28,
            bottom: overlay.position === "bottom" ? 170 : undefined,
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 54,
            fontWeight: 800,
            left: 70,
            lineHeight: 1.08,
            padding: "28px 34px",
            position: "absolute",
            right: 70,
            textAlign: "center",
            textShadow: "0 2px 14px rgba(0,0,0,0.45)",
            top: overlay.position === "top" ? 170 : overlay.position === "center" ? "44%" : undefined,
          }}
        >
          {overlay.text}
        </div>
      ))}

      <div
        style={{
          bottom: 46,
          color: "rgba(255,255,255,0.72)",
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 24,
          left: 44,
          position: "absolute",
        }}
      >
        {clip?.title || "No clip"} · {project.aspectRatio}
      </div>
    </AbsoluteFill>
  );
}
