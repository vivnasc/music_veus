"use client";

import { useTrackVersions } from "@/hooks/useTrackVersions";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import { ALL_ALBUMS, type TrackEnergy } from "@/data/albums";

type Props = {
  energy: TrackEnergy;
  listColor: string;
  startIndex: number;
};

/**
 * Shows version variants that match a mood/energy.
 * Fetches from Supabase and displays below the static track list.
 */
export default function VersionTracks({ energy, listColor, startIndex }: Props) {
  const { versions, loading } = useTrackVersions(energy);
  const { playTrack, currentTrack, isPlaying, togglePlay } = useMusicPlayer();

  if (loading || versions.length === 0) return null;

  // Resolve version info (album title, track title, etc.)
  const resolved = versions.map(v => {
    const album = ALL_ALBUMS.find(a => a.slug === v.album_slug);
    const track = album?.tracks.find(t => t.number === v.track_number);
    if (!album || !track) return null;
    return { ...v, album, track };
  }).filter(Boolean) as Array<{
    id: string;
    album_slug: string;
    track_number: number;
    version_name: string;
    energy: TrackEnergy;
    audio_url: string;
    album: (typeof ALL_ALBUMS)[number];
    track: (typeof ALL_ALBUMS)[number]["tracks"][number];
  }>;

  if (resolved.length === 0) return null;

  return (
    <div className="mt-6">
      <p className="text-[10px] uppercase tracking-widest text-[#666680] mb-3 px-2">
        Versoes alternativas
      </p>
      <div className="divide-y divide-white/5">
        {resolved.map((v, i) => {
          const isActive = currentTrack?.title === `${v.track.title} (${v.version_name})`
            && currentTrack?.audioUrl === v.audio_url;

          return (
            <button
              key={v.id}
              onClick={() => {
                if (isActive) {
                  togglePlay();
                } else {
                  // Play with overridden audio URL
                  playTrack(
                    { ...v.track, title: `${v.track.title} (${v.version_name})`, audioUrl: v.audio_url },
                    v.album
                  );
                }
              }}
              className="flex items-center gap-4 py-3 px-2 hover:bg-white/5 rounded-lg transition-colors w-full text-left"
            >
              <span className="w-6 text-right text-xs text-[#666680] tabular-nums flex-shrink-0">
                {startIndex + i + 1}
              </span>
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: listColor }} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm truncate ${isActive ? "font-semibold" : "text-[#F5F0E6]"}`}
                  style={isActive ? { color: listColor } : {}}
                >
                  {v.track.title}
                  <span className="text-[#666680] font-normal ml-1.5">({v.version_name})</span>
                </p>
                <p className="text-xs text-[#666680] truncate">{v.album.title}</p>
              </div>
              {isActive && isPlaying && (
                <div className="flex items-end gap-0.5 h-3 shrink-0">
                  <div className="w-0.5 bg-current animate-pulse" style={{ height: "60%", color: listColor }} />
                  <div className="w-0.5 bg-current animate-pulse" style={{ height: "100%", color: listColor, animationDelay: "0.2s" }} />
                  <div className="w-0.5 bg-current animate-pulse" style={{ height: "40%", color: listColor, animationDelay: "0.4s" }} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
