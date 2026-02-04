/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,   // 👈 YE LINE ADD KAR

  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig