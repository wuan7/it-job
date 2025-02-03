import { NextResponse } from 'next/server';
import axiosInstance from '@/utils/axiosInstance';

export async function POST(request: Request) {
  try {

    const contentType = request.headers.get('Content-Type');
    if (contentType?.startsWith('multipart/form-data')) {
      const formData = await request.formData();
      if (formData.get('file')) {
        const response = await axiosInstance.post('/submit-cv', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return NextResponse.json(response.data, { status: response.status });
      }
    }

    // If no file, assume the data is JSON
    const body = await request.json();
    const response = await axiosInstance.post('/submit-cv', body);
    
    // Return the response from backend
    return NextResponse.json(response.data, { status: response.status });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Handle the error
    const errorMessage = error?.response?.data || { error: 'Failed to submit CV' };
    const statusCode = error?.response?.status || 500;

    // Optionally log the error for debugging
    console.error('Error submitting CV:', error.response);

    return NextResponse.json(errorMessage, { status: statusCode });
  }
}
