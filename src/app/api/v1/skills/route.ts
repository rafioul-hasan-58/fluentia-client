import { NextResponse } from "next/server";

export async function GET() {
  try {
    const serverUrl = "http://127.0.0.1:5000/api/v1/skills";

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
        message: error.message || "Failed to reach backend server on port 5000",
      },
      { status: 500 }
    );
  }
}
