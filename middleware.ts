import { NextRequest, NextResponse } from "next/server";

export const middleware = (req: NextRequest) => {
  return NextResponse.next();
};
