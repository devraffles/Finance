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

  const { obterConfiguracao } = await import("@kwak-finance/backend/services");
  return respond(await obterConfiguracao({ userId }));
};

export const PUT = async (request: Request) => {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) return unauthorized();

  const { atualizarConfiguracao } =
    await import("@kwak-finance/backend/services");
  return respond(
    await atualizarConfiguracao({
      userId,
      body: await jsonFromRequest(request),
    }),
  );
};
