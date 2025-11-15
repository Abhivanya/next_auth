import { cookies } from "next/headers";

export const setRefreshTokenCookie = async (refreshToken: string) => {
  const cookieStore = await cookies();

  cookieStore.set("refreshToken", refreshToken, {
    secure: true,
    httpOnly: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 10,
    path: "/",
  });
};

export const removeRefreshTokenCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.set("refreshToken", "", {
    secure: true,
    httpOnly: true,
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
};
