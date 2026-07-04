import {
  getAuthenticatedUserId,
  jsonFromRequest,
  respond,
  unauthorized,
} from "../_lib/http";

export const runtime = "nodejs";

export const GET = async (request: Request) => {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) return unauthorized();

  const { listarInvestimentos } =
    await import("@kwak-finance/backend/services");
  return respond(await listarInvestimentos({ userId }));
};

export const POST = async (request: Request) => {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) return unauthorized();

  const { criarInvestimento } = await import("@kwak-finance/backend/services");
  return respond(
    await criarInvestimento({ userId, body: await jsonFromRequest(request) }),
  );
};
