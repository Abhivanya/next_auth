import { connectDB } from "@/app/lib/connectDB";
import { User } from "@/app/models/User.model";
import { comparePassword } from "@/app/util/password.util";
import { sendResponse } from "@/app/util/response.util";
import { generateToken } from "@/app/util/token.util";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const { email, password } = await req.json();
    if (!email || !password)
      return sendResponse(false, 400, "Email and Password Required");

    const user = await User.findOne({ email }).select("+password");
    console.log(user);
    if (!user) return sendResponse(false, 404, "User Not Found");

    const isValid = await comparePassword(password, user.password);
    if (!isValid) return sendResponse(false, 400, "Invalid Credentials");

    const token = generateToken(user._id);
    const userObject = user.toObject();
    delete userObject.password;
    return sendResponse(true, 201, "User Login Successfully", {
      user,
      token,
    });
  } catch (error) {
    console.log("Error During Login", error);
    return sendResponse(false);
  }
};
