import { connectDB } from "@/app/lib/connectDB";
import { User } from "@/app/models/User.model";
import { setRefreshTokenCookie } from "@/app/util/cookies.util";
import { hashPassword } from "@/app/util/password.util";
import { sendResponse } from "@/app/util/response.util";
import { generateRefreshToken, generateToken } from "@/app/util/token.util";
import { NextRequest } from "next/server";

// route for Createing new User
export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const { email, username, password } = await req.json();

    if (!email || !username || !password)
      return sendResponse(false, 400, "All Field are Required");

    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return sendResponse(false, 409, "User Already Exists");
    }

    const hashedPass = await hashPassword(password);
    const user = new User({ email, username, password: hashedPass });

    const res = await user.save();

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();
    const userObject = res.toObject();
    delete userObject.password;
    delete userObject.refreshToken;

    await setRefreshTokenCookie(refreshToken);

    return sendResponse(true, 201, "User Created Successfully", {
      user: userObject,
      token,
    });
  } catch (error) {
    console.error("Error During Singup", error);
    return sendResponse(false);
  }
};
