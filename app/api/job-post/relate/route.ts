import { NextResponse } from 'next/server';
import axiosInstance from '@/utils/axiosInstance';

export async function GET(request: Request) {
  try {
    // Lấy query params từ URL
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const jobPostId = searchParams.get('jobPostId');
    const limit = searchParams.get('limit') || '5';
    if (!category || !limit || !jobPostId) {
        return NextResponse.json({ error: 'Category, JobPostId and limit are required' }, { status: 400 });
      }
    // Gửi request đến backend qua Axios
    const response = await axiosInstance.get('/job-post/relate', {
      params: { category, jobPostId, limit }, // Thêm query params vào request
    });
    
    return NextResponse.json(response.data, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const errorMessage = error.response?.data || { error: 'Failed to fetch job posts' };
    const statusCode = error.response?.status || 500;
    console.log(error.response)
    return NextResponse.json(errorMessage, { status: statusCode });
  }
}


