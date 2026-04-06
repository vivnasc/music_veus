"use client";

import { useEffect } from "react";
import { useLibrary } from "@/hooks/useLibrary";
import { ADMIN_EMAIL } from "@/lib/admin-auth";

/**
 * Protections against downloading music and copying lyrics.
 * Disabled for admin users so they can use devtools and right-click.
 */
export default function NoDownload() {
  const { userEmail } = useLibrary();
  const isAdmin = userEmail === ADMIN_EMAIL;

  useEffect(() => {
    // Skip all protections for admin
    if (isAdmin) return;

    // Block right-click on audio/media elements only (not globally)
    function blockContext(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === "AUDIO" || target.tagName === "VIDEO" || target.closest(".lyrics-content")) {
        e.preventDefault();
      }
    }

    // Block keyboard shortcuts for save only (not devtools)
    function blockKeys(e: KeyboardEvent) {
      // Ctrl/Cmd + S (save)
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
      }
      // Ctrl/Cmd + Shift + S (save as)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "S") {
        e.preventDefault();
      }
    }

    // Block drag on audio and image elements
    function blockDrag(e: DragEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === "AUDIO" || target.tagName === "IMG" || target.tagName === "VIDEO") {
        e.preventDefault();
      }
    }

    // Block copy on protected elements
    function blockCopy(e: ClipboardEvent) {
      const selection = window.getSelection();
      const target = e.target as HTMLElement;
      // Block copy if selection is inside lyrics or protected area
      if (
        target.closest("[data-no-copy]") ||
        target.closest(".lyrics-content") ||
        (selection && selection.toString().length > 0 && target.closest(".font-display"))
      ) {
        e.preventDefault();
        e.clipboardData?.setData("text/plain", "");
      }
    }

    document.addEventListener("contextmenu", blockContext);
    document.addEventListener("keydown", blockKeys);
    document.addEventListener("dragstart", blockDrag);
    document.addEventListener("copy", blockCopy);

    return () => {
      document.removeEventListener("contextmenu", blockContext);
      document.removeEventListener("keydown", blockKeys);
      document.removeEventListener("dragstart", blockDrag);
      document.removeEventListener("copy", blockCopy);
    };
  }, [isAdmin]);

  // Global CSS to prevent text selection on lyrics
  return (
    <style jsx global>{`
      .lyrics-content,
      .lyrics-content * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
      }
      audio {
        pointer-events: none;
      }
      audio::-webkit-media-controls-enclosure {
        pointer-events: auto;
      }
    `}</style>
  );
}
