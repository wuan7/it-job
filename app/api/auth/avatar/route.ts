import { NextResponse } from 'next/server';
import axiosInstance from '@/utils/axiosInstance';

export async function POST(request: Request) {
  try {

    const contentType = request.headers.get('Content-Type');
    if (contentType?.startsWith('multipart/form-data')) {
      const formData = await request.formData();
      if (formData.get('file')) {
        const response = await axiosInstance.post('/auth/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return NextResponse.json(response.data, { status: response.status });
      }
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Handle the error
    const errorMessage = error?.response?.data || { error: 'Failed to upload avatar' };
    const statusCode = error?.response?.status || 500;

    // Optionally log the error for debugging
    console.error('Error upload avatar:', error.response);

    return NextResponse.json(errorMessage, { status: statusCode });
  }
}
