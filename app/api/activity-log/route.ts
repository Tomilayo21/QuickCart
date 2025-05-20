import { NextResponse } from "next/server";

const logs: { action: string; detail: string; timestamp: string }[] = [];

export async function GET() {
  try {
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to load activity logs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { action, detail } = await request.json();

    if (!action || !detail) {
      return NextResponse.json({ error: "Missing action or detail" }, { status: 400 });
    }

    logs.push({
      action,
      detail,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to log activity" }, { status: 500 });
  }
}
