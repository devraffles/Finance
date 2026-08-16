import {
  getAuthenticatedUserId,
  jsonFromRequest,
  respond,
  unauthorized,
} from "../../_lib/http";

export const runtime = "nodejs";

export const POST = async (request: Request) => {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) return unauthorized();

  const { criarCategoria } = await import("@kwak-finance/backend/services");
  return respond(
    await criarCategoria({ userId, body: await jsonFromRequest(request) }),
  );
};
