import { NextRequest, NextResponse } from 'next/server';
import axiosInstance from '@/utils/axiosInstance';

export async function POST(req: NextRequest) {
  try {
   
    const { recruiterId } = await req.json();
    const response = await axiosInstance.post('/conversation', { employerId: recruiterId });
    
    return NextResponse.json(response.data, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
}



