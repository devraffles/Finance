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

  const { listarEmpresas } = await import("@kwak-finance/backend/services");
  return respond(await listarEmpresas({ userId }));
};

export const POST = async (request: Request) => {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) return unauthorized();

  const { criarEmpresa } = await import("@kwak-finance/backend/services");
  return respond(
    await criarEmpresa({ userId, body: await jsonFromRequest(request) }),
  );
};
