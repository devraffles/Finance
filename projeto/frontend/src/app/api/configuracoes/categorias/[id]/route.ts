import {
  getAuthenticatedUserId,
  jsonFromRequest,
  respond,
  unauthorized,
} from "../../../_lib/http";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export const PUT = async (request: Request, { params }: RouteContext) => {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) return unauthorized();

  const { id } = await params;
  const { atualizarCategoria } = await import("@kwak-finance/backend/services");
  return respond(
    await atualizarCategoria({
      userId,
      id,
      body: await jsonFromRequest(request),
    }),
  );
};

export const DELETE = async (request: Request, { params }: RouteContext) => {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) return unauthorized();

  const { id } = await params;
  const { removerCategoria } = await import("@kwak-finance/backend/services");
  return respond(await removerCategoria({ userId, id }));
};
