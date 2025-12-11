import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns:[
      {
        hostname:'lms-nextjs-karan.t3.storage.dev',
        protocol:'https',
      }
    ],
    unoptimized:true
  }
};

export default nextConfig;
