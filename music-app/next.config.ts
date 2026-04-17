import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Enable SharedArrayBuffer on the Ancient Ground admin page (FFmpeg WASM multi-threaded).
        // Uses "credentialless" so cross-origin resources (Supabase audio) load without CORP headers.
        source: "/admin/ancient-ground",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
        ],
      },
    ];
  },
};

export default nextConfig;
