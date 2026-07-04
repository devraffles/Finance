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

  const { listarMetas } = await import("@kwak-finance/backend/services");
  return respond(await listarMetas({ userId }));
};

export const POST = async (request: Request) => {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) return unauthorized();

  const { criarMeta } = await import("@kwak-finance/backend/services");
  return respond(
    await criarMeta({ userId, body: await jsonFromRequest(request) }),
  );
};
