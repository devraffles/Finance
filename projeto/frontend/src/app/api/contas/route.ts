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

  const { listarContas } = await import("@kwak-finance/backend/services");
  return respond(await listarContas({ userId }));
};

export const POST = async (request: Request) => {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) return unauthorized();

  const { criarConta } = await import("@kwak-finance/backend/services");
  return respond(
    await criarConta({ userId, body: await jsonFromRequest(request) }),
  );
};
