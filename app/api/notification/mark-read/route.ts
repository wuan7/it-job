import { NextResponse } from 'next/server';
import axiosInstance from '@/utils/axiosInstance';

export async function PATCH () {
    try {
        const response = await axiosInstance.patch('/notification/mark-all-read');
        return NextResponse.json(response.data, { status: 200 });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const errorMessage = error.response?.data || { error: 'Failed to mark all notifications as read' };
        const statusCode = error.response?.status || 500;
        return NextResponse.json(errorMessage, { status: statusCode });
      }
    
}