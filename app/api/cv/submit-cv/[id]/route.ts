import { NextResponse } from 'next/server';
import axiosInstance from '@/utils/axiosInstance';

export async function PUT(request: Request) {
  try {
    // Lấy ID từ URL path
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json({ error: 'CV ID is required' }, { status: 400 });
    }

    // Parse dữ liệu từ body của yêu cầu
    const body = await request.json();

    // Kiểm tra dữ liệu
    const { fullName, email, phone, coverLetter } = body;
    if (!fullName || !email || !phone || !coverLetter) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Gửi yêu cầu PUT đến backend
    const response = await axiosInstance.put(`/submit-cv/${id}`, {
      fullName,
      email,
      phone,
      coverLetter,
    });

    // Trả về phản hồi từ backend
    return NextResponse.json(response.data, { status: response.status });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Xử lý lỗi
    const errorMessage = error.response?.data || { error: 'Failed to update CV' };
    const statusCode = error.response?.status || 500;
    return NextResponse.json(errorMessage, { status: statusCode });
  }
}
