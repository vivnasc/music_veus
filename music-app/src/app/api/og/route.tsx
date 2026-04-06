import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { ALL_ALBUMS } from "@/data/albums";

export const runtime = "nodejs";

function pickLyric(lyrics: string | undefined): string | null {
  if (!lyrics) return null;
  const lines = lyrics.split("\n").filter(l => {
    const t = l.trim();
    return t.length > 15 && t.length < 70 && !t.startsWith("[");
  });
  if (lines.length === 0) return null;
  const day = Math.floor(Date.now() / 86400000);
  return lines[day % lines.length].trim();
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const albumSlug = searchParams.get("album") || "";
  const trackNum = parseInt(searchParams.get("track") || "1", 10);

  const album = ALL_ALBUMS.find(a => a.slug === albumSlug);
  const track = album?.tracks.find(t => t.number === trackNum);

  const title = track?.title || "Loranne";
  const albumTitle = album?.title || "";
  const color = album?.color || "#C9A96E";
  const lyric = pickLyric(track?.lyrics);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const pad = String(trackNum).padStart(2, "0");
  const coverUrl = `${supabaseUrl}/storage/v1/object/public/audios/albums/${albumSlug}/faixa-${pad}-cover.jpg`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "#0D0D1A",
          fontFamily: "serif",
          position: "relative",
          padding: "50px",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "-50px",
            left: "30%",
            width: "500px",
            height: "400px",
            borderRadius: "50%",
            background: color,
            opacity: 0.15,
            filter: "blur(100px)",
          }}
        />

        {/* Cover + play button */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, marginRight: 50, position: "relative" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverUrl}
            alt=""
            width={300}
            height={300}
            style={{
              borderRadius: 24,
              objectFit: "cover",
              boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
            }}
          />
          {/* Play button overlay */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <div style={{
              width: 0,
              height: 0,
              borderLeft: "22px solid rgba(255,255,255,0.9)",
              borderTop: "14px solid transparent",
              borderBottom: "14px solid transparent",
              marginLeft: 4,
            }} />
          </div>
        </div>

        {/* Text content */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, position: "relative" }}>
          <p style={{ fontSize: 18, letterSpacing: "0.15em", textTransform: "uppercase", color, marginBottom: 8 }}>
            {albumTitle}
          </p>

          <h1 style={{ fontSize: 56, fontWeight: 700, color: "#F5F0E6", lineHeight: 1.1, marginBottom: 16, maxWidth: 550 }}>
            {title}
          </h1>

          {lyric && (
            <p style={{ fontSize: 24, fontStyle: "italic", color: "#F5F0E6", opacity: 0.7, marginBottom: 16, maxWidth: 500 }}>
              &ldquo;{lyric}&rdquo;
            </p>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
            <p style={{ fontSize: 22, color: "#C9A96E", fontStyle: "italic" }}>
              Loranne
            </p>
            <div style={{ width: 1, height: 20, background: "#666680" }} />
            <p style={{ fontSize: 14, color: "#666680", letterSpacing: "0.15em" }}>
              VÉUS
            </p>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
