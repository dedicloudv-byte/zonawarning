import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    // Basic Auth Check (Check if headers exist, meaning the request came from our authenticated frontend)
    // In a real scenario, you might want to protect this more strictly.
    const email = req.headers.get("x-cf-email");
    const key = req.headers.get("x-cf-key");

    if (!email || !key) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Execute git pull
    const { stdout, stderr } = await execAsync("git pull");

    return NextResponse.json({
        success: true,
        message: "Update executed",
        output: stdout,
        error: stderr
    });

  } catch (error: any) {
    return NextResponse.json({
        success: false,
        message: "Update failed",
        error: error.message
    }, { status: 500 });
  }
}
