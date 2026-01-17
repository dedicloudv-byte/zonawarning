import { NextRequest, NextResponse } from "next/server";

export interface CFCredentials {
  email?: string | null;
  key?: string | null;
  accountId?: string | null;
}

export function getCredentials(req: NextRequest): CFCredentials {
  return {
    email: req.headers.get("x-cf-email"),
    key: req.headers.get("x-cf-key"),
    accountId: req.headers.get("x-cf-account-id"),
  };
}

export function buildCFHeaders(creds: CFCredentials): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (creds.email && creds.key) {
    headers["X-Auth-Email"] = creds.email;
    headers["X-Auth-Key"] = creds.key;
  } else if (creds.key) {
    headers["Authorization"] = `Bearer ${creds.key}`;
  }
  return headers;
}

export async function proxyRequest(
  url: string,
  method: string,
  creds: CFCredentials,
  body?: any,
  contentType: string = "application/json"
) {
    const headers = buildCFHeaders(creds);
    if (contentType !== "multipart/form-data") {
        (headers as any)["Content-Type"] = contentType;
    } else {
        // Let fetch handle boundary
        delete (headers as any)["Content-Type"];
    }

    const options: RequestInit = {
        method,
        headers,
    };

    if (body) {
        options.body = body;
    }

    const res = await fetch(url, options);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}
