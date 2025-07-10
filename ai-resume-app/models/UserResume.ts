import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IUserResume extends Document {
  title: string;
  userEmail: string;
  userName: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserResumeSchema = new Schema<IUserResume>(
  {
    title: { type: String, required: true },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
  },
  { timestamps: true,id:true }
);

export default models.UserResume || model<IUserResume>("UserResume", UserResumeSchema);
