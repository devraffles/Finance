/** @type {import("next").NextConfig} */
const serverPackages = [
  "@kwak-finance/backend",
  "@prisma/client",
  "better-auth",
];

const isDockerBuild = process.env.KWAK_DOCKER_BUILD === "true";

const nextConfig = {
  output: isDockerBuild ? "standalone" : undefined,
  experimental: {
    serverComponentsExternalPackages: serverPackages,
  },
};

export default nextConfig;
