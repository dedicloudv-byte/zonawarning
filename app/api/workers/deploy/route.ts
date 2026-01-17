import { getCredentials, proxyRequest } from "@/lib/api-helper";
import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const creds = getCredentials(req);
  if (!creds.accountId || !creds.key) {
    return NextResponse.json({ success: false, errors: [{ message: "Unauthorized" }] }, { status: 401 });
  }

  const { name, script } = await req.json();

  if (!name || !script) {
      return NextResponse.json({ success: false, errors: [{ message: "Missing name or script" }] }, { status: 400 });
  }

  // Upload as application/javascript
  return proxyRequest(
    `https://api.cloudflare.com/client/v4/accounts/${creds.accountId}/workers/scripts/${name}`,
    "PUT",
    creds,
    script,
    "application/javascript"
  );
}
