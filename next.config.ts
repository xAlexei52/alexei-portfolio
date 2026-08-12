import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the filesystem root to this project so Turbopack ignores unrelated
  // lockfiles found further up the directory tree.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
