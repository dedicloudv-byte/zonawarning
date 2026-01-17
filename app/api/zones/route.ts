import { getCredentials, proxyRequest } from "@/lib/api-helper";
import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const creds = getCredentials(req);
  if (!creds.key) {
    return NextResponse.json({ success: false, errors: [{ message: "Unauthorized" }] }, { status: 401 });
  }

  let url = "https://api.cloudflare.com/client/v4/zones";
  if (creds.accountId) {
      url += `?account.id=${creds.accountId}`;
  }

  return proxyRequest(
    url,
    "GET",
    creds
  );
}
