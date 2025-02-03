import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  // Kiểm tra nếu không có refreshToken
  if (!refreshToken) {
    return NextResponse.redirect("/auth/login");
  }

  try {
    // Gửi yêu cầu đến backend để làm mới token
    const response = await axios.post(
      `${process.env.BACKEND_URL || "http://localhost:5000/api/v1"}/auth/refresh-token`,
      {refreshToken},
    );

    const newAccessToken = response.data.accessToken;

    // Lưu token mới vào cookie
    cookieStore.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return NextResponse.json({ accessToken: newAccessToken });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error refreshing token:", error.response?.data);
    return NextResponse.redirect("/auth/login");
  }
}
