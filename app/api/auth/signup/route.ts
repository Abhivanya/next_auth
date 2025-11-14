import { connectDB } from "@/app/lib/connectDB";
import { User } from "@/app/models/User.model";
import { hashPassword } from "@/app/util/password.util";
import { sendResponse } from "@/app/util/response.util";
import { NextRequest } from "next/server";

// route for Createing new User
export const Post = async (req: NextRequest) => {
  try {
    await connectDB();
    const { email, username, password } = await req.json();

    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return sendResponse(false, 409, "User Already Exists");
    }

    const hashedPass = await hashPassword(password);
    const user = new User({ email, username, password: hashedPass });

    await user.save();
    sendResponse(true, 201, "User Created Successfully", user);
  } catch (error) {
    console.error("Error While Singuper", error);
    sendResponse(false);
  }
};
