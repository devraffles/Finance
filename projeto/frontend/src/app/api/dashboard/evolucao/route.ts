import { getAuthenticatedUserId, respond, unauthorized } from "../../_lib/http";

export const runtime = "nodejs";

export const GET = async (request: Request) => {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) return unauthorized();

  const { obterDashboardEvolucao } =
    await import("@kwak-finance/backend/services");
  return respond(await obterDashboardEvolucao({ userId }));
};
