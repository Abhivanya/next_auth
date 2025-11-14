import mongoose, { models, Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  passwrod: string;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    passwrod: {
      type: String,
      requrired: true,
      minLength: 6,
      select: false,
    },
  },
  { timestamps: true }
);

export const User = models.User || mongoose.model<IUser>("User", userSchema);
