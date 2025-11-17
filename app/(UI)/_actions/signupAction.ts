"use server";
import { cookies } from "next/headers";

export const signupAction = async (formData: FormData) => {
  const body = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/signup`,
    {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  const data = await res.json();
  if (data.success) {
    const cookieStore = await cookies();

    if (data.token) {
      cookieStore.set("token", data.token, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24,
      });
    }
  }
  return data;
};
