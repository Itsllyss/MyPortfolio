import type { NextConfig } from 'next';

// The chat needs a server route (/api/chat), so this is a normal Next.js server
// build, not a static export. Runs as-is on Vercel and on Render (`npm start`).
const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
