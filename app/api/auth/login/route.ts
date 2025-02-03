import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers'
import axiosInstance from '@/utils/axiosInstance';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    // Lấy dữ liệu từ body
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Gửi request đến backend
    const response = await axiosInstance.post('/auth/login', { email, password });
    const { accessToken, refreshToken } = response.data.data;
    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { message: 'Invalid tokens received' },
        { status: 500 }
      );
    }
    cookieStore.set('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 3600, // Token sống 1 giờ
      path: '/',
    });

    cookieStore.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // Token sống 7 ngày
      path: '/',
    });
    // Trả về dữ liệu từ backend
    return NextResponse.json({ message: 'Login successful' }, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const status = error.status || 500;
    if(status === 401) {
      return NextResponse.json(
        {
          message: 'Tài khoản hoặc mật khẩu không chính xác',
        },
        { status }
      );
    }
    return NextResponse.json(
      {
        message: error.message || 'Internal Server Error',
      },
      { status }
    );
  }
}
