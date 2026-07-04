const sessionCookieNames = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
];

export const hasSessionCookie = (requestHeaders: Headers) => {
  const cookieHeader = requestHeaders.get("cookie");

  if (!cookieHeader) {
    return false;
  }

  return sessionCookieNames.some((cookieName) =>
    cookieHeader.includes(cookieName),
  );
};

export const getOptionalSession = async (requestHeaders: Headers) => {
  if (
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.npm_lifecycle_event === "build"
  ) {
    return null;
  }

  if (!hasSessionCookie(requestHeaders)) {
    return null;
  }

  try {
    const { getSession } = await import("@kwak-finance/backend/lib/auth");

    return await getSession(requestHeaders);
  } catch {
    return null;
  }
};
