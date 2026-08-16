import {
  getAuthenticatedUserId,
  jsonFromRequest,
  respond,
  unauthorized,
} from "../../_lib/http";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export const GET = async (request: Request, { params }: RouteContext) => {
  const { id } = await params;
  const userId = await getAuthenticatedUserId(request);
  if (!userId) return unauthorized();

  const { obterInvestimento } = await import("@kwak-finance/backend/services");
  return respond(await obterInvestimento({ userId, id }));
};

export const PUT = async (request: Request, { params }: RouteContext) => {
  const { id } = await params;
  const userId = await getAuthenticatedUserId(request);
  if (!userId) return unauthorized();

  const { atualizarInvestimento } =
    await import("@kwak-finance/backend/services");
  return respond(
    await atualizarInvestimento({
      userId,
      id,
      body: await jsonFromRequest(request),
    }),
  );
};

export const DELETE = async (request: Request, { params }: RouteContext) => {
  const { id } = await params;
  const userId = await getAuthenticatedUserId(request);
  if (!userId) return unauthorized();

  const { removerInvestimento } =
    await import("@kwak-finance/backend/services");
  return respond(await removerInvestimento({ userId, id }));
};
