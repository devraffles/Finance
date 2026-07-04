/** @type {import("next").NextConfig} */
const serverPackages = [
  "@kwak-finance/backend",
  "@prisma/client",
  "better-auth",
];

const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: serverPackages,
  },
};

export default nextConfig;
