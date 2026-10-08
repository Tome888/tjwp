/** @type {import('next').NextConfig} */
const nextConfig = {
  // Type errors (e.g. a missing field in content/site.ts) fail the build,
  // so a broken edit never reaches the live site.
  typescript: {
    ignoreBuildErrors: false,
  },
  // Inline the (small) stylesheet so it doesn't block first paint.
  experimental: {
    inlineCss: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
}

export default nextConfig
