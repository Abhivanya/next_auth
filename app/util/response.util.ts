import { NextResponse } from "next/server";

export const sendResponse = <T>(
  succes: boolean,
  status: number = 500,
  message: string = "Internal Server Error ",
  data?: T
) => {
  return NextResponse.json(
    {
      message,
      succes,
      data: data ?? null,
    },
    { status }
  );
};
