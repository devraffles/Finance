export const runtime = "nodejs";

const handleAuthRequest = async (request: Request) => {
  const { auth } = await import("@kwak-finance/backend/lib/auth");

  return auth.handler(request);
};

export const GET = handleAuthRequest;
export const POST = handleAuthRequest;
