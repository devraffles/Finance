export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  [key: string]: unknown;
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    issues?: unknown;
  };
}

export interface ApiSuccessBody<T> {
  data: T;
  meta?: ApiMeta;
}

export type ApiResult<T> =
  | {
      ok: true;
      status: number;
      body: ApiSuccessBody<T>;
    }
  | {
      ok: false;
      status: number;
      body: ApiErrorBody;
    };

export const success = <T>(
  data: T,
  status = 200,
  meta?: ApiMeta,
): {
  ok: true;
  status: number;
  body: ApiSuccessBody<T>;
} => {
  return {
    ok: true,
    status,
    body: meta ? { data, meta } : { data },
  };
};

export const failure = ({
  code,
  message,
  status,
  issues,
}: {
  code: string;
  message: string;
  status: number;
  issues?: unknown;
}): {
  ok: false;
  status: number;
  body: ApiErrorBody;
} => {
  return {
    ok: false,
    status,
    body: {
      error: {
        code,
        message,
        issues,
      },
    },
  };
};
