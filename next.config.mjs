/** @type {import('next').NextConfig} */
const nextConfig = {
    // Alte configurări
    images: {
      domains: ['res.cloudinary.com'],  // Adaugă aici domeniile permise
    },
    reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  },
  };

export default nextConfig;
