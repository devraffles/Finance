export const runtime = "nodejs";

const handleAuthRequest = async (request: Request) => {
  const { auth } = await import("@financas360/backend/lib/auth");

  return auth.handler(request);
};

export const GET = handleAuthRequest;
export const POST = handleAuthRequest;
