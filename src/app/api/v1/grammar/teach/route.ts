import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const serverUrl = `${getApiBaseUrl()}/grammar/teach`;

    const response = await fetch(serverUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        message: error.message || "Failed to reach backend grammar service",
      },
      { status: 500 }
    );
  }
}

