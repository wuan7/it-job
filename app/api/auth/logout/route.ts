import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
export async function POST() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete('accessToken');
        cookieStore.delete('refreshToken');        
        return NextResponse.json({ status: 200, message: 'Logout successfully' });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err) {
        console.log(err)
        return NextResponse.json({ status: 500, message: 'Logout failed' });
      }
}

