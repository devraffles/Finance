import {
  getAuthenticatedUserId,
  jsonFromRequest,
  respond,
  unauthorized,
} from "../../../_lib/http";

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

  const { listarAportes } = await import("@kwak-finance/backend/services");
  return respond(await listarAportes({ userId, id }));
};

export const POST = async (request: Request, { params }: RouteContext) => {
  const { id } = await params;
  const userId = await getAuthenticatedUserId(request);
  if (!userId) return unauthorized();

  const { criarAporte } = await import("@kwak-finance/backend/services");
  return respond(
    await criarAporte({
      userId,
      id,
      body: await jsonFromRequest(request),
    }),
  );
};
