import { NextResponse } from 'next/server';
import axiosInstance from '@/utils/axiosInstance';

export async function GET(request: Request) {
  try {
    // Lấy query params từ URL
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const location = searchParams.get('location') || ''; // Lấy location
    const salary = searchParams.get('salary') || ''; // Lấy salary
    const experience = searchParams.get('experience') || ''; // Lấy experience
    const searchQuery = searchParams.get('searchQuery') || '';

    // Gửi request đến backend qua Axios
    const response = await axiosInstance.get('/job-post', {
      params: { 
        page, 
        limit, 
        location, 
        salary, 
        experience,
        searchQuery
      }, // Thêm query params vào request
    });

    return NextResponse.json(response.data, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const errorMessage = error.response?.data || { error: 'Failed to fetch job posts' };
    const statusCode = error.response?.status || 500;
    return NextResponse.json(errorMessage, { status: statusCode });
  }
}
