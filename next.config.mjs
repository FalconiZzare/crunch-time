/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "e2pjinezlh5u4bcl.public.blob.vercel-storage.com"
      }
    ]
  }
};

export default nextConfig;
