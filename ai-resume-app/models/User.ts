import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  userName: string;
  email: string;
  password?: string;
  emailVerified: boolean;
  otp?: string;
  otpCreatedAt?: Date;
  passwordResetVerified: boolean;
  avatar?: string;
  bio?: string;
}

const UserSchema = new Schema<IUser>(
  {
    userName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String },
    emailVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpCreatedAt: { type: Date },
    passwordResetVerified: { type: Boolean, default: false },
    avatar: {
      type: String,
      default:
        "https://play-lh.googleusercontent.com/nV5JHE9tyyqNcVqh0JLVGoV2ldpAqC8htiBpsbjqxATjXQnpNTKgU99B-euShOJPu-8",
    },
    bio: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
