import { NextResponse } from 'next/server';
import axiosInstance from '@/utils/axiosInstance';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const response = await axiosInstance.put('/auth', body);

    return NextResponse.json(response.data, { status: response.status });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const errorMessage = error.response?.data || { error: 'Failed to update user' };
    const statusCode = error.response?.status || 500;
    console.log(error.response)
    return NextResponse.json(errorMessage, { status: statusCode });
  }
}
