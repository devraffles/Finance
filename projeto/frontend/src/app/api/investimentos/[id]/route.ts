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

  const { obterInvestimento } = await import("@kwak-finance/backend/services");
  return respond(await obterInvestimento({ userId, id: params.id }));
};

export const PUT = async (request: Request, { params }: RouteContext) => {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) return unauthorized();

  const { atualizarInvestimento } =
    await import("@kwak-finance/backend/services");
  return respond(
    await atualizarInvestimento({
      userId,
      id: params.id,
      body: await jsonFromRequest(request),
    }),
  );
};

export const DELETE = async (request: Request, { params }: RouteContext) => {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) return unauthorized();

  const { removerInvestimento } =
    await import("@kwak-finance/backend/services");
  return respond(await removerInvestimento({ userId, id: params.id }));
};
