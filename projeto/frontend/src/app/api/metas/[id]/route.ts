import {
  getAuthenticatedUserId,
  jsonFromRequest,
  respond,
  unauthorized,
} from "../../_lib/http";

export const runtime = "nodejs";

interface RouteContext {
  params: {
    id: string;
  };
}

export const GET = async (request: Request, { params }: RouteContext) => {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) return unauthorized();

  const { obterMeta } = await import("@kwak-finance/backend/services");
  return respond(await obterMeta({ userId, id: params.id }));
};

export const PUT = async (request: Request, { params }: RouteContext) => {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) return unauthorized();

  const { atualizarMeta } = await import("@kwak-finance/backend/services");
  return respond(
    await atualizarMeta({
      userId,
      id: params.id,
      body: await jsonFromRequest(request),
    }),
  );
};

export const DELETE = async (request: Request, { params }: RouteContext) => {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) return unauthorized();

  const { removerMeta } = await import("@kwak-finance/backend/services");
  return respond(await removerMeta({ userId, id: params.id }));
};
