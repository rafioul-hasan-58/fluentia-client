import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/api";

export async function GET() {
  try {
    const serverUrl = `${getApiBaseUrl()}/skills`;

    const response = await fetch(serverUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        message: error.message || "Failed to reach backend skills service",
      },
      { status: 500 }
    );
  }
}

