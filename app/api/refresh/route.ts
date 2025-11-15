import { connectDB } from "@/app/lib/connectDB";
import { User } from "@/app/models/User.model";
import { sendResponse } from "@/app/util/response.util";
import { generateToken, verifyRefreshToken } from "@/app/util/token.util";
import { cookies } from "next/headers";

export const GET = async () => {
  try {
    await connectDB();
    const refreshToken = (await cookies()).get("refreshToken")?.value;

    if (!refreshToken) return sendResponse(false, 401, "No Refresh Token");

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) return sendResponse(false, 401, "Invalid refresh Token");

    const user = await User.findById(decoded.sub).select("+refreshToken");

    if (!user || user.refreshToken !== refreshToken)
      return sendResponse(false, 401, "Aunothorised");

    const newAccessToken = await generateToken(user._id.toString());
    return sendResponse(true, 200, "Token Genrated", { token: newAccessToken });
  } catch (error) {
    return sendResponse(false);
  }
};
