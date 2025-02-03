
import { NextResponse } from 'next/server';
import axiosInstance from '@/utils/axiosInstance';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop(); // Lấy ID từ URL path
    if (!id) {
      return NextResponse.json({ error: 'Job post ID is required' }, { status: 400 });
    }

    // Gửi request đến backend để lấy job post theo ID
    const response = await axiosInstance.get(`/submit-cv/check-submit-cv/${id}`);
  
    return NextResponse.json(response.data, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const errorMessage = error.response?.data || { error: 'Failed to fetch check submit cv' };
    const statusCode = error.response?.status || 500;
    return NextResponse.json(errorMessage, { status: statusCode });
  }
}
