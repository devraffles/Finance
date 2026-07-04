import {
  getAuthenticatedUserId,
  jsonFromRequest,
  queryFromRequest,
  respond,
  unauthorized,
} from "../_lib/http";

export const runtime = "nodejs";

export const GET = async (request: Request) => {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) return unauthorized();

  const { listarTransacoes } = await import("@kwak-finance/backend/services");
  return respond(
    await listarTransacoes({ userId, query: queryFromRequest(request) }),
  );
};

export const POST = async (request: Request) => {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) return unauthorized();

  const { criarTransacao } = await import("@kwak-finance/backend/services");
  return respond(
    await criarTransacao({ userId, body: await jsonFromRequest(request) }),
  );
};
