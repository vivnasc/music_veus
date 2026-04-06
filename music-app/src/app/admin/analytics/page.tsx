"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ALL_ALBUMS } from "@/data/albums";
import { adminFetch } from "@/lib/admin-fetch";

type TrackStat = {
  album_slug: string;
  track_number: number;
  total_listens: number;
  unique_listeners: number;
  last_listened: string;
};

type FavStat = {
  album_slug: string;
  track_number: number;
  count: number;
};

type Analytics = {
  topTracks: TrackStat[];
  topFavorited: FavStat[];
  topPlaylisted: FavStat[];
  totalListeners: number;
  totalPlays: number;
  recentListeners: number;
  subscriberCount: number;
};

function trackName(albumSlug: string, trackNumber: number): string {
  const album = ALL_ALBUMS.find(a => a.slug === albumSlug);
  const track = album?.tracks.find(t => t.number === trackNumber);
  return track?.title || `Faixa ${trackNumber}`;
}

function albumName(slug: string): string {
  return ALL_ALBUMS.find(a => a.slug === slug)?.title || slug;
}

function albumColor(slug: string): string {
  return ALL_ALBUMS.find(a => a.slug === slug)?.color || "#C9A96E";
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminFetch("/api/admin/analytics")
      .then(r => r.json())
      .then(d => {
        if (d.erro) setError(d.erro);
        else setData(d);
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center">
        <p className="text-sm text-[#666680] animate-pulse">A carregar analytics...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-red-400 mb-4">{error || "Erro"}</p>
          <Link href="/admin/producao" className="text-xs text-[#C9A96E] hover:underline">Voltar</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D1A] px-6 py-10">
      <div className="max-w-screen-lg mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-2xl font-bold text-[#F5F0E6]">Analytics</h1>
          <Link href="/admin/producao" className="text-xs text-[#666680] hover:text-[#a0a0b0]">Producao</Link>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
            <p className="text-2xl font-bold text-[#F5F0E6]">{data.totalPlays}</p>
            <p className="text-xs text-[#666680] mt-1">Plays totais</p>
          </div>
          <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
            <p className="text-2xl font-bold text-[#F5F0E6]">{data.totalListeners}</p>
            <p className="text-xs text-[#666680] mt-1">Ouvintes</p>
          </div>
          <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
            <p className="text-2xl font-bold text-[#F5F0E6]">{data.recentListeners}</p>
            <p className="text-xs text-[#666680] mt-1">Activos (7 dias)</p>
          </div>
          <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
            <p className="text-2xl font-bold text-[#F5F0E6]">{data.subscriberCount}</p>
            <p className="text-xs text-[#666680] mt-1">Subscritores</p>
          </div>
        </div>

        {/* Top tracks */}
        <section className="mb-10">
          <h2 className="text-sm font-medium text-[#a0a0b0] uppercase tracking-wider mb-4">Mais ouvidas</h2>
          <div className="rounded-xl bg-white/[0.02] border border-white/5 overflow-hidden">
            {data.topTracks.map((t, i) => (
              <div key={`${t.album_slug}-${t.track_number}`} className="flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-0">
                <span className="text-xs text-[#666680] w-6 text-right tabular-nums">{i + 1}</span>
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: albumColor(t.album_slug) }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#F5F0E6] truncate">{trackName(t.album_slug, t.track_number)}</p>
                  <p className="text-xs text-[#666680] truncate">{albumName(t.album_slug)}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm text-[#F5F0E6] tabular-nums">{t.total_listens}</p>
                  <p className="text-[10px] text-[#666680]">{t.unique_listeners} ouvintes</p>
                </div>
                <span className="text-[10px] text-[#666680] w-10 text-right">{timeAgo(t.last_listened)}</span>
              </div>
            ))}
            {data.topTracks.length === 0 && (
              <p className="px-4 py-6 text-xs text-[#666680] text-center">Sem dados ainda</p>
            )}
          </div>
        </section>

        {/* Top favorited */}
        <section className="mb-10">
          <h2 className="text-sm font-medium text-[#a0a0b0] uppercase tracking-wider mb-4">Mais favoritadas</h2>
          <div className="rounded-xl bg-white/[0.02] border border-white/5 overflow-hidden">
            {data.topFavorited.map((t, i) => (
              <div key={`${t.album_slug}-${t.track_number}`} className="flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-0">
                <span className="text-xs text-[#666680] w-6 text-right tabular-nums">{i + 1}</span>
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: albumColor(t.album_slug) }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#F5F0E6] truncate">{trackName(t.album_slug, t.track_number)}</p>
                  <p className="text-xs text-[#666680] truncate">{albumName(t.album_slug)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3 text-red-400">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  <span className="text-sm text-[#F5F0E6] tabular-nums">{t.count}</span>
                </div>
              </div>
            ))}
            {data.topFavorited.length === 0 && (
              <p className="px-4 py-6 text-xs text-[#666680] text-center">Sem favoritos ainda</p>
            )}
          </div>
        </section>

        {/* Top playlisted */}
        <section className="mb-10">
          <h2 className="text-sm font-medium text-[#a0a0b0] uppercase tracking-wider mb-4">Em mais playlists</h2>
          <div className="rounded-xl bg-white/[0.02] border border-white/5 overflow-hidden">
            {data.topPlaylisted.map((t, i) => (
              <div key={`${t.album_slug}-${t.track_number}`} className="flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-0">
                <span className="text-xs text-[#666680] w-6 text-right tabular-nums">{i + 1}</span>
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: albumColor(t.album_slug) }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#F5F0E6] truncate">{trackName(t.album_slug, t.track_number)}</p>
                  <p className="text-xs text-[#666680] truncate">{albumName(t.album_slug)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3 text-[#a0a0b0]">
                    <path d="M4 6h16M4 10h16M4 14h10M4 18h7" />
                  </svg>
                  <span className="text-sm text-[#F5F0E6] tabular-nums">{t.count}</span>
                </div>
              </div>
            ))}
            {data.topPlaylisted.length === 0 && (
              <p className="px-4 py-6 text-xs text-[#666680] text-center">Sem playlists ainda</p>
            )}
          </div>
        </section>

        <p className="text-[10px] text-[#666680] text-center">Os teus plays nao contam. So ouvintes reais.</p>
      </div>
    </div>
  );
}
