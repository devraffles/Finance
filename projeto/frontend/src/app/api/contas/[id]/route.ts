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

  const { obterConta } = await import("@kwak-finance/backend/services");
  return respond(await obterConta({ userId, id: params.id }));
};

export const PUT = async (request: Request, { params }: RouteContext) => {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) return unauthorized();

  const { atualizarConta } = await import("@kwak-finance/backend/services");
  return respond(
    await atualizarConta({
      userId,
      id: params.id,
      body: await jsonFromRequest(request),
    }),
  );
};

export const DELETE = async (request: Request, { params }: RouteContext) => {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) return unauthorized();

  const { removerConta } = await import("@kwak-finance/backend/services");
  return respond(await removerConta({ userId, id: params.id }));
};
