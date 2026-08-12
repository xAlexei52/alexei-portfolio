import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The site is one static page deployed over FTP to public_html, so there is
  // no Node server at the other end — `next build` has to emit plain files.
  output: "export",

  // Emit `out/index.html` instead of `out/index.txt`-style flat files, and let
  // Apache resolve directory URLs with its own DirectoryIndex. Without this,
  // shared hosting serves nothing for a bare `/`.
  trailingSlash: true,

  // Pin the filesystem root to this project so Turbopack ignores unrelated
  // lockfiles found further up the directory tree.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
