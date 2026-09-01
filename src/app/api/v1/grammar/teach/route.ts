import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const serverUrl = "http://127.0.0.1:5000/api/v1/grammar/teach";

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
        message: error.message || "Failed to reach backend server on port 5000",
      },
      { status: 500 }
    );
  }
}
