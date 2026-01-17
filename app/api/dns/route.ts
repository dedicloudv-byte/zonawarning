import { getCredentials, proxyRequest } from "@/lib/api-helper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const creds = getCredentials(req);
  if (!creds.key) {
    return NextResponse.json({ success: false, errors: [{ message: "Unauthorized" }] }, { status: 401 });
  }

  const { zoneId, type, name, content, proxied } = await req.json();

  if (!zoneId || !type || !name || !content) {
      return NextResponse.json({ success: false, errors: [{ message: "Missing required fields" }] }, { status: 400 });
  }

  const body = {
      type,
      name,
      content,
      ttl: 1, // Automatic
      proxied: proxied || false
  };

  return proxyRequest(
    `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`,
    "POST",
    creds,
    JSON.stringify(body)
  );
}
