"use client";

import { useMusicPlayer, formatTime as fmt } from "@/contexts/MusicPlayerContext";
import { ALL_ALBUMS, type AlbumTrack } from "@/data/albums";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function QueuePanel({ isOpen, onClose }: Props) {
  const {
    currentTrack,
    currentAlbum,
    queue,
    queueAlbum,
    isPlaying,
    shuffle,
    infinite,
    repeat,
    playTrack,
  } = useMusicPlayer();

  const albumColor = currentAlbum?.color || queueAlbum?.color || "#C9A96E";
  const albumName = queueAlbum?.title || currentAlbum?.title || "";

  const currentIndex = currentTrack
    ? queue.findIndex((t) => {
        if (t.number !== currentTrack.number) return false;
        const tAlbum = (t as AlbumTrack & { albumSlug?: string }).albumSlug;
        const cAlbum = currentAlbum?.slug;
        if (tAlbum && cAlbum) return tAlbum === cAlbum;
        return true;
      })
    : -1;

  const upcomingTracks = currentIndex >= 0 ? queue.slice(currentIndex + 1) : [];

  const totalDuration = queue.reduce((sum, t) => sum + (t.durationSeconds || 0), 0);

  function handleTrackClick(track: AlbumTrack) {
    // Resolve the correct album for this track (queue may have tracks from multiple albums)
    const trackAlbumSlug = (track as AlbumTrack & { albumSlug?: string }).albumSlug;
    const album = trackAlbumSlug
      ? ALL_ALBUMS.find(a => a.slug === trackAlbumSlug) || queueAlbum
      : queueAlbum;
    if (!album) return;
    playTrack(track, album, queue);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 max-h-[85vh] flex flex-col rounded-t-2xl bg-[#1A1A2E]/98 backdrop-blur-xl border-t border-white/10 transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-[#F5F0E6]">A seguir</h2>
              {shuffle && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: `${albumColor}20`, color: albumColor }}
                >
                  (Aleatorio)
                </span>
              )}
              {infinite && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: `${albumColor}20`, color: albumColor }}
                >
                  Infinito
                </span>
              )}
              {repeat !== "off" && (
                <span
                  className="flex items-center text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: `${albumColor}20`, color: albumColor }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3 h-3"
                  >
                    <polyline points="17 1 21 5 17 9" />
                    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                    <polyline points="7 23 3 19 7 15" />
                    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                  </svg>
                  {repeat === "one" && (
                    <span className="ml-0.5">1</span>
                  )}
                </span>
              )}
            </div>
            {albumName && (
              <p className="text-xs text-[#666680] truncate mt-0.5">{albumName}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-full hover:bg-white/5 transition-colors"
            aria-label="Fechar fila"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-[#F5F0E6]"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-2 pb-16 min-h-0">
          {/* Now playing */}
          {currentTrack && (
            <div className="px-3 mb-4">
              <p className="text-[11px] uppercase tracking-wider text-[#666680] mb-2 px-1">
                A tocar agora
              </p>
              <div
                className="flex items-center gap-3 px-3 py-3 rounded-xl"
                style={{ backgroundColor: `${albumColor}15` }}
              >
                {/* Playing indicator — 3 animated bars */}
                <div className="w-8 flex items-end justify-center gap-[3px] h-4 shrink-0">
                  {isPlaying ? (
                    <>
                      <div
                        className="w-[3px] rounded-full animate-pulse"
                        style={{
                          height: "60%",
                          backgroundColor: albumColor,
                          animationDuration: "0.8s",
                        }}
                      />
                      <div
                        className="w-[3px] rounded-full animate-pulse"
                        style={{
                          height: "100%",
                          backgroundColor: albumColor,
                          animationDuration: "0.6s",
                          animationDelay: "0.15s",
                        }}
                      />
                      <div
                        className="w-[3px] rounded-full animate-pulse"
                        style={{
                          height: "45%",
                          backgroundColor: albumColor,
                          animationDuration: "0.9s",
                          animationDelay: "0.3s",
                        }}
                      />
                    </>
                  ) : (
                    <span
                      className="text-sm font-semibold tabular-nums"
                      style={{ color: albumColor }}
                    >
                      {currentTrack.number}
                    </span>
                  )}
                </div>

                {/* Track info */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold truncate"
                    style={{ color: albumColor }}
                  >
                    {currentTrack.title}
                  </p>
                  <p className="text-xs text-[#888898] truncate">
                    {currentTrack.description}
                  </p>
                </div>

                {/* Language badge */}
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded border shrink-0"
                  style={{ borderColor: `${albumColor}30`, color: albumColor }}
                >
                  {currentTrack.lang}
                </span>

                {/* Duration */}
                <span className="text-xs text-[#666680] tabular-nums shrink-0 w-10 text-right">
                  {fmt(currentTrack.durationSeconds)}
                </span>
              </div>
            </div>
          )}

          {/* Upcoming tracks */}
          {upcomingTracks.length > 0 && (
            <div className="px-3">
              <p className="text-[11px] uppercase tracking-wider text-[#666680] mb-2 px-1">
                Próximas
              </p>
              <div className="space-y-0.5">
                {upcomingTracks.map((track, i) => (
                  <button
                    key={`${(track as AlbumTrack & { albumSlug?: string }).albumSlug || "q"}-${track.number}-${i}`}
                    onClick={() => handleTrackClick(track)}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-left hover:bg-white/5"
                  >
                    {/* Track number */}
                    <div className="w-8 text-center shrink-0">
                      <span className="text-sm tabular-nums text-[#666680]">
                        {track.number}
                      </span>
                    </div>

                    {/* Track info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#F5F0E6] truncate">{track.title}</p>
                      <p className="text-xs text-[#666680] truncate">
                        {track.description}
                      </p>
                    </div>

                    {/* Language badge */}
                    <span className="text-[10px] px-1.5 py-0.5 rounded border border-white/10 text-[#666680] shrink-0">
                      {track.lang}
                    </span>

                    {/* Duration */}
                    <span className="text-xs text-[#666680] tabular-nums shrink-0 w-10 text-right">
                      {fmt(track.durationSeconds)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!currentTrack && queue.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-[#666680]">Nenhuma faixa na fila</p>
            </div>
          )}
        </div>

        {/* Footer — total count and duration */}
        {queue.length > 0 && (
          <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-[#666680]">
              {queue.length} {queue.length === 1 ? "faixa" : "faixas"}
            </span>
            <span className="text-xs text-[#666680] tabular-nums">
              {fmt(totalDuration)}
            </span>
          </div>
        )}
      </div>
    </>
  );
}
