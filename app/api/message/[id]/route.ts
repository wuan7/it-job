import { NextResponse } from "next/server";
import axiosInstance from "@/utils/axiosInstance";
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const conversationId = url.pathname.split("/").pop();
    if (!conversationId) {
      return NextResponse.json(
        { error: "conversation ID is required" },
        { status: 400 }
      );
    }

    const response = await axiosInstance.get(`/message/${conversationId}`);

    return NextResponse.json(response.data, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const errorMessage = error.response.data.message || {
      error: "Failed to fetch message",
    };

    const statusCode = error.status;
    return NextResponse.json(errorMessage, { status: statusCode });
  }
}
