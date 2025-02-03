import { NextResponse } from 'next/server';
import axiosInstance from '@/utils/axiosInstance';

export async function GET() {
    try {
        const response = await axiosInstance.get('/auth/current-user');
       
        return NextResponse.json({ status: response.status, data: response.data });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        // Lấy mã lỗi và thông báo từ error response
        const statusCode = error.response?.status || 500;
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch current user';

        return NextResponse.json({ status: statusCode, message: errorMessage });
    }
}
