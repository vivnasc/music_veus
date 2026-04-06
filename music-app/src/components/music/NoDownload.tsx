"use client";

import { useEffect } from "react";

/**
 * Protections against downloading music and copying lyrics.
 *
 * - Blocks right-click everywhere (not just audio elements)
 * - Blocks save shortcuts (Ctrl+S, Cmd+S)
 * - Blocks devtools shortcuts (F12, Ctrl+Shift+I/J/C)
 * - Blocks drag on audio/image elements
 * - Blocks text selection on lyrics via CSS class
 * - Blocks "Save As" (Ctrl+Shift+S)
 *
 * Note: These are deterrents, not bulletproof. A determined user
 * can always bypass client-side protections. The goal is to make
 * casual downloading/copying inconvenient.
 */
export default function NoDownload() {
  useEffect(() => {
    // Block right-click globally
    function blockContext(e: MouseEvent) {
      e.preventDefault();
    }

    // Block keyboard shortcuts for save, devtools, source view
    function blockKeys(e: KeyboardEvent) {
      // Ctrl/Cmd + S (save)
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
      }
      // Ctrl/Cmd + Shift + S (save as)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "S") {
        e.preventDefault();
      }
      // Ctrl/Cmd + U (view source)
      if ((e.ctrlKey || e.metaKey) && e.key === "u") {
        e.preventDefault();
      }
      // F12 (devtools)
      if (e.key === "F12") {
        e.preventDefault();
      }
      // Ctrl/Cmd + Shift + I (devtools)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "I") {
        e.preventDefault();
      }
      // Ctrl/Cmd + Shift + J (console)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "J") {
        e.preventDefault();
      }
      // Ctrl/Cmd + Shift + C (inspect element)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "C") {
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
  }, []);

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
