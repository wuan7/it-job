import { NextResponse } from 'next/server';
import axiosInstance from '@/utils/axiosInstance';

export async function PUT (request: Request) {
    try {
      const url = new URL(request.url);
        const id = url.pathname.split('/').pop();
        const response = await axiosInstance.put(`/notification/toggle-read/${id}`);
        return NextResponse.json(response.data, { status: 200 });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log(error.response)
        const errorMessage = error.response?.data || { error: 'Failed to toggle notification as read' };
        const statusCode = error.response?.status || 500;
        return NextResponse.json(errorMessage, { status: statusCode });
      }
    
}