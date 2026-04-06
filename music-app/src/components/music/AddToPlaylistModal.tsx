"use client";

import { useState, useEffect } from "react";
import { usePlaylists } from "@/hooks/usePlaylists";
import { useLocalPlaylists } from "@/hooks/useLocalPlaylists";
import { supabase } from "@/lib/supabase";

type Props = {
  trackNumber: number;
  albumSlug: string;
  onClose: () => void;
};

export default function AddToPlaylistModal({ trackNumber, albumSlug, onClose }: Props) {
  const [userId, setUserId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id || null);
      setChecked(true);
    });
  }, []);

  if (!checked) return null;

  return userId ? (
    <SupabasePlaylistPicker trackNumber={trackNumber} albumSlug={albumSlug} onClose={onClose} />
  ) : (
    <LocalPlaylistPicker trackNumber={trackNumber} albumSlug={albumSlug} onClose={onClose} />
  );
}

function SupabasePlaylistPicker({ trackNumber, albumSlug, onClose }: Props) {
  const { playlists, createPlaylist, addToPlaylist, loading } = usePlaylists();
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [added, setAdded] = useState<string | null>(null);

  async function handleAdd(playlistId: string) {
    await addToPlaylist(playlistId, trackNumber, albumSlug);
    setAdded(playlistId);
    setTimeout(onClose, 600);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    const id = await createPlaylist(newName.trim());
    if (id) {
      await addToPlaylist(id, trackNumber, albumSlug);
      setAdded(id);
      setTimeout(onClose, 600);
    }
  }

  return (
    <ModalShell onClose={onClose}>
      {creating ? (
        <form onSubmit={handleCreate} className="flex gap-2 mb-3">
          <input autoFocus value={newName} onChange={e => setNewName(e.target.value)}
            placeholder="Nome da playlist..." className="flex-1 bg-white/10 text-sm px-3 py-2 rounded-lg border border-white/10 focus:border-[#C9A96E]/50 outline-none placeholder:text-[#666680]" />
          <button type="submit" className="text-sm text-[#C9A96E] px-2">Criar</button>
        </form>
      ) : (
        <NewPlaylistButton onClick={() => setCreating(true)} />
      )}
      {loading ? <LoadingState /> : playlists.length === 0 ? <EmptyState /> : (
        <div className="space-y-0.5">
          {playlists.map(pl => (
            <PlaylistRow key={pl.id} name={pl.name} count={pl.trackCount} added={added === pl.id} onAdd={() => handleAdd(pl.id)} />
          ))}
        </div>
      )}
    </ModalShell>
  );
}

function LocalPlaylistPicker({ trackNumber, albumSlug, onClose }: Props) {
  const { playlists, createPlaylist, addToPlaylist } = useLocalPlaylists();
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [added, setAdded] = useState<string | null>(null);

  function handleAdd(playlistId: string) {
    addToPlaylist(playlistId, trackNumber, albumSlug);
    setAdded(playlistId);
    setTimeout(onClose, 600);
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    const id = createPlaylist(newName.trim());
    addToPlaylist(id, trackNumber, albumSlug);
    setAdded(id);
    setTimeout(onClose, 600);
  }

  return (
    <ModalShell onClose={onClose}>
      {creating ? (
        <form onSubmit={handleCreate} className="flex gap-2 mb-3">
          <input autoFocus value={newName} onChange={e => setNewName(e.target.value)}
            placeholder="Nome da playlist..." className="flex-1 bg-white/10 text-sm px-3 py-2 rounded-lg border border-white/10 focus:border-[#C9A96E]/50 outline-none placeholder:text-[#666680]" />
          <button type="submit" className="text-sm text-[#C9A96E] px-2">Criar</button>
        </form>
      ) : (
        <NewPlaylistButton onClick={() => setCreating(true)} />
      )}
      {playlists.length === 0 ? <EmptyState /> : (
        <div className="space-y-0.5">
          {playlists.map(pl => (
            <PlaylistRow key={pl.id} name={pl.name} count={pl.tracks.length} added={added === pl.id} onAdd={() => handleAdd(pl.id)} />
          ))}
        </div>
      )}
    </ModalShell>
  );
}

// Shared UI components

function ModalShell({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative w-full max-w-md bg-[#1A1A2E] rounded-t-2xl border-t border-white/10 pb-8 max-h-[70vh] flex flex-col"
        onClick={e => e.stopPropagation()}>
        <div className="px-5 pt-4 pb-3 border-b border-white/5">
          <h3 className="text-sm font-medium text-[#F5F0E6]">Adicionar a playlist</h3>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {children}
        </div>
        <div className="px-5 pt-2">
          <button onClick={onClose} className="w-full py-2.5 text-sm text-[#666680] hover:text-[#a0a0b0] transition-colors">Cancelar</button>
        </div>
      </div>
    </div>
  );
}

function NewPlaylistButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-left mb-2">
      <svg viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="2" className="h-5 w-5">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      <span className="text-sm text-[#C9A96E]">Nova playlist</span>
    </button>
  );
}

function LoadingState() {
  return (
    <div className="space-y-2">
      {[...Array(3)].map((_, i) => <div key={i} className="h-10 rounded-lg bg-white/5 animate-pulse" />)}
    </div>
  );
}

function EmptyState() {
  return <p className="text-xs text-[#666680] text-center py-4">Cria a tua primeira playlist</p>;
}

function PlaylistRow({ name, count, added, onAdd }: { name: string; count: number; added: boolean; onAdd: () => void }) {
  return (
    <button onClick={onAdd} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${added ? "bg-green-500/10" : "hover:bg-white/5"}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke={added ? "#22c55e" : "#a0a0b0"} strokeWidth="2" className="h-5 w-5 shrink-0">
        {added ? <path d="M20 6L9 17l-5-5" /> : <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />}
      </svg>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[#F5F0E6] truncate">{name}</p>
        <p className="text-xs text-[#666680]">{count} faixas</p>
      </div>
    </button>
  );
}
