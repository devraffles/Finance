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

  const { obterTransacao } = await import("@kwak-finance/backend/services");
  return respond(await obterTransacao({ userId, id }));
};

export const PUT = async (request: Request, { params }: RouteContext) => {
  const { id } = await params;
  const userId = await getAuthenticatedUserId(request);
  if (!userId) return unauthorized();

  const { atualizarTransacao } = await import("@kwak-finance/backend/services");
  return respond(
    await atualizarTransacao({
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

  const { removerTransacao } = await import("@kwak-finance/backend/services");
  return respond(await removerTransacao({ userId, id }));
};
