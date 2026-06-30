import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  webpack: (config) => {
    // Fix: @supabase/realtime-js can't resolve @supabase/phoenix via ESM imports
    config.resolve.alias["@supabase/phoenix"] = path.resolve(
      __dirname,
      "node_modules/@supabase/phoenix"
    );
    return config;
  },
};

export default nextConfig;
