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

  const { obterEmpresa } = await import("@kwak-finance/backend/services");
  return respond(await obterEmpresa({ userId, id: params.id }));
};

export const PUT = async (request: Request, { params }: RouteContext) => {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) return unauthorized();

  const { atualizarEmpresa } = await import("@kwak-finance/backend/services");
  return respond(
    await atualizarEmpresa({
      userId,
      id: params.id,
      body: await jsonFromRequest(request),
    }),
  );
};

export const DELETE = async (request: Request, { params }: RouteContext) => {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) return unauthorized();

  const { removerEmpresa } = await import("@kwak-finance/backend/services");
  return respond(await removerEmpresa({ userId, id: params.id }));
};
