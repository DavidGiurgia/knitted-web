/** @type {import('next').NextConfig} */
const nextConfig = {
    // Alte configurări
    images: {
      domains: ['i.ibb.co'],  // Adaugă aici domeniile permise
    },
    reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  },
  };

export default nextConfig;
