import { NextResponse } from "next/server";

export const sendResponse = <T>(
  success: boolean,
  status: number = 500,
  message: string = "Internal Server Error ",
  data?: T
) => {
  return NextResponse.json(
    {
      message,
      success,
      data: data ?? null,
    },
    { status }
  );
};
