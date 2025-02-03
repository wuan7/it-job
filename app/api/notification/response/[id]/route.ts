import { NextResponse } from 'next/server';
import axiosInstance from '@/utils/axiosInstance';

export async function PUT (request: Request) {
    try {
        const url = new URL(request.url);
        const id = url.pathname.split('/').pop();
        const body = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Submission ID is required' }, { status: 400 });
    }
        const response = await axiosInstance.put(`/notification/cv-response/${id}`, body);
        return NextResponse.json(response.data, { status: 200 });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const errorMessage = error.response?.data || { error: 'Failed to update cv response' };
        const statusCode = error.response?.status || 500;
        return NextResponse.json(errorMessage, { status: statusCode });
      }
    
}