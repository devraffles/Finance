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

  const { obterConta } = await import("@kwak-finance/backend/services");
  return respond(await obterConta({ userId, id }));
};

export const PUT = async (request: Request, { params }: RouteContext) => {
  const { id } = await params;
  const userId = await getAuthenticatedUserId(request);
  if (!userId) return unauthorized();

  const { atualizarConta } = await import("@kwak-finance/backend/services");
  return respond(
    await atualizarConta({
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

  const { removerConta } = await import("@kwak-finance/backend/services");
  return respond(await removerConta({ userId, id }));
};
