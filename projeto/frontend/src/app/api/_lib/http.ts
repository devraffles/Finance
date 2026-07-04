import { NextResponse } from "next/server";

import type {
  ApiErrorBody,
  ApiSuccessBody,
} from "@kwak-finance/backend/services";

const sessionCookieNames = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
];

const hasSessionCookie = (requestHeaders: Headers) => {
  const cookieHeader = requestHeaders.get("cookie");

  if (!cookieHeader) {
    return false;
  }

  return sessionCookieNames.some((cookieName) =>
    cookieHeader.includes(`${cookieName}=`),
  );
};

export const jsonFromRequest = async (request: Request): Promise<unknown> => {
  try {
    return await request.json();
  } catch {
    return {};
  }
};

export const queryFromRequest = (request: Request) => {
  const params = new URL(request.url).searchParams;
  const query: Record<string, string | undefined> = {};

  params.forEach((value, key) => {
    query[key] = value;
  });

  return query;
};

export const getAuthenticatedUserId = async (request: Request) => {
  if (!hasSessionCookie(request.headers)) {
    return null;
  }

  const { getSession } = await import("@kwak-finance/backend/lib/auth");
  const session = await getSession(request.headers);

  return session?.user?.id ?? null;
};

export const unauthorized = () => {
  return NextResponse.json(
    {
      error: {
        code: "UNAUTHORIZED",
        message: "Nao autenticado.",
      },
    },
    { status: 401 },
  );
};

export const respond = (result: {
  body: ApiErrorBody | ApiSuccessBody<unknown>;
  status: number;
}) => {
  return NextResponse.json(result.body, { status: result.status });
};
