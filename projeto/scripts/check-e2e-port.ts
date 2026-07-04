import net from "node:net";

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
const parsedUrl = new URL(baseUrl);
const host = parsedUrl.hostname;
const port = Number(
  parsedUrl.port || (parsedUrl.protocol === "https:" ? 443 : 80),
);
const hostsToCheck =
  host === "localhost" ? ["127.0.0.1", "::1", "localhost"] : [host];

const canConnect = async (targetHost: string) => {
  return new Promise<boolean>((resolve) => {
    const socket = net.createConnection({ host: targetHost, port });

    socket.setTimeout(1_000);
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("timeout", () => {
      socket.destroy();
      resolve(false);
    });
    socket.once("error", () => {
      resolve(false);
    });
  });
};

const main = async () => {
  const connectionResults = await Promise.all(hostsToCheck.map(canConnect));
  const portInUse = connectionResults.some(Boolean);

  if (!portInUse) {
    return;
  }

  console.error(
    `Porta ${port} ja esta em uso. Encerre o processo nessa porta antes de rodar pnpm run test:e2e, ou defina PLAYWRIGHT_BASE_URL para uma URL livre e compativel com o app.`,
  );
  process.exit(1);
};

void main();
