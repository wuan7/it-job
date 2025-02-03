import { NextResponse } from "next/server";

import axiosInstance from "@/utils/axiosInstance";


export async function GET() {
  try {
    const response = await axiosInstance.get("/auth/save-job-ids");

    return NextResponse.json(response.data, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const errorMessage = error.response?.data || {
      error: "Failed to get saved jobs",
    };
    const statusCode = error.response?.status || 500;
    return NextResponse.json(errorMessage, { status: statusCode });
  }
}
