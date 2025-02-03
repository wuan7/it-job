import { NextResponse } from 'next/server';
import axiosInstance from '@/utils/axiosInstance';
export async function GET(request: Request) {
    try {
      const { searchParams } = new URL(request.url);
      const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
        const response = await axiosInstance.get('/submit-cv/recruiter', {
          params: { page, limit },
        });
        
        return NextResponse.json(response.data, { status: 200 });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const errorMessage = error.message|| { error: 'Failed to fetch user cv' };
        const statusCode = error.status;
        return NextResponse.json(errorMessage, { status: statusCode });
      }
}