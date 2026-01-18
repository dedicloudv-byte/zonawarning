import { getCredentials, proxyRequest } from "@/lib/api-helper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const creds = getCredentials(req);
  if (!creds.accountId || !creds.key) {
    return NextResponse.json({ success: false, errors: [{ message: "Unauthorized" }] }, { status: 401 });
  }

  return proxyRequest(
    `https://api.cloudflare.com/client/v4/accounts/${creds.accountId}/workers/scripts`,
    "GET",
    creds
  );
}
