import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, apiToken } = await req.json();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (email && apiToken) {
       // Global API Key
       headers["X-Auth-Email"] = email;
       headers["X-Auth-Key"] = apiToken;
    } else if (apiToken) {
       // API Token
       headers["Authorization"] = `Bearer ${apiToken}`;
    } else {
        return NextResponse.json({ success: false, errors: [{ message: "Missing credentials" }] }, { status: 400 });
    }

    const res = await fetch("https://api.cloudflare.com/client/v4/user", {
      method: "GET",
      headers,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ success: false, errors: [{ message: "Internal Server Error" }] }, { status: 500 });
  }
}
