import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  env: {
    DATABASE_URL: process.env.DATABASE_URL ?? "",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    AUTH_SECRET: process.env.AUTH_SECRET ?? "",
  },
};

export default nextConfig;
