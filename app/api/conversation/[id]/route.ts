import { NextRequest, NextResponse } from 'next/server';
import axiosInstance from '@/utils/axiosInstance';


export async function GET(req: NextRequest) {
    try {
      const url = new URL(req.url);
      const conversationId = url.pathname.split("/").pop();
      if (!conversationId) {
        return NextResponse.json(
          { error: "conversation ID is required" },
          { status: 400 }
        );
      }
      const response = await axiosInstance.get(`/conversation/${conversationId}`);
  
      return NextResponse.json(response.data, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }
  }