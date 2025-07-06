import mongoose, { Schema, models, model } from "mongoose";

const userSchema = new Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    image: String,
    login: String,
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

export const User = models.User || model("User", userSchema);
