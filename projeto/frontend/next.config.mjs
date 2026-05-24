/** @type {import("next").NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      "@kwak-finance/backend",
      "@prisma/client",
      "better-auth",
    ],
  },
};

export default nextConfig;
