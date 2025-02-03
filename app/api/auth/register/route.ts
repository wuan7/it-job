import { NextResponse } from 'next/server';
import axiosInstance from '@/utils/axiosInstance';

export async function POST(request: Request) {
  try {

    const contentType = request.headers.get('Content-Type');
    if (contentType?.startsWith('multipart/form-data')) {
      const formData = await request.formData();
        const response = await axiosInstance.post('/auth/register', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log(response)
        return NextResponse.json(response.data, { status: response.status });
      
    }

    const body = await request.json();

    // Gửi request đến backend qua Axios
    const response = await axiosInstance.post('/auth/register', body);

    return NextResponse.json(response.data, { status: response.status });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const errorMessage = error.response?.data || { error: 'Failed to register user' };
    const statusCode = error.response?.status || 500;
    console.log(error.response)
    return NextResponse.json(errorMessage, { status: statusCode });
  }
}
