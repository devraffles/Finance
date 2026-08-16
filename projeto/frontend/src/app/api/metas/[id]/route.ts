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

  const { obterMeta } = await import("@kwak-finance/backend/services");
  return respond(await obterMeta({ userId, id }));
};

export const PUT = async (request: Request, { params }: RouteContext) => {
  const { id } = await params;
  const userId = await getAuthenticatedUserId(request);
  if (!userId) return unauthorized();

  const { atualizarMeta } = await import("@kwak-finance/backend/services");
  return respond(
    await atualizarMeta({
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

  const { removerMeta } = await import("@kwak-finance/backend/services");
  return respond(await removerMeta({ userId, id }));
};
