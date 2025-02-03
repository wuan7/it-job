import { NextRequest, NextResponse } from "next/server";

import axiosInstance from "@/utils/axiosInstance";

export async function POST(req: NextRequest) {
  try {
    const { jobId } = await req.json();

    if (!jobId) {
      return NextResponse.json(
        { message: "Job ID is required" },
        { status: 400 }
      );
    }

    // Gửi request đến backend
    const response = await axiosInstance.post("/auth/save-job", { jobId });

    return NextResponse.json(response.data, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const errorMessage = error.response?.data || {
      error: "Failed to save job",
    };
    const statusCode = error.response?.status || 500;
    return NextResponse.json(errorMessage, { status: statusCode });
  }
}

export async function GET() {
  try {
    const response = await axiosInstance.get("/auth/save-jobs");

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
