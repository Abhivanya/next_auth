import { connectDB } from "@/app/lib/connectDB";
import { User } from "@/app/models/User.model";
import { sendResponse } from "@/app/util/response.util";
import { validateToken } from "@/app/util/token.util";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const token = await req.headers.get("authorization")?.split(" ")[1];

    if (!token) return sendResponse(false, 401, "Token Not provided");

    const decoded = validateToken(token);
    if (!decoded) {
      return sendResponse(false, 403, "Token Invalid");
    }

    const existingUser = await User.findOne({ _id: decoded.sub }).lean();

    if (!existingUser) {
      return sendResponse(false, 404, "User not found");
    }

    return sendResponse(true, 200, "User Profile", existingUser);
  } catch (error) {
    console.log(error);
    return sendResponse(false);
  }
}
