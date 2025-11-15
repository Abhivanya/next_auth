import { connectDB } from "@/app/lib/connectDB";
import { User } from "@/app/models/User.model";
import { removeRefreshTokenCookie } from "@/app/util/cookies.util";
import { sendResponse } from "@/app/util/response.util";
import { cookies } from "next/headers";

export const POST = async () => {
  try {
    connectDB();
    const refreshToken = (await cookies()).get("refreshToken")?.value;

    if (refreshToken) {
      const user = await User.findOne({ refreshToken }).select("+refreshToken");
      if (user) {
        user.refreshToken = "";
        await user.save();
      }
    }
    await removeRefreshTokenCookie();
    return sendResponse(true, 200, "logout succesfully");
  } catch (error) {
    console.log("Logout error", error);
    return sendResponse(false);
  }
};
