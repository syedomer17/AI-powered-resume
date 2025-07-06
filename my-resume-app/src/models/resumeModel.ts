import mongoose, { Schema, models, model } from "mongoose";

const resumeSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    atsScore: Number,
    content: String,
    aiGenerated: { type: Boolean, default: false },
    updatedByAI: { type: Boolean, default: false },
    fileUrl: String,
    fileType: String,
    jobType: { type: String, enum: ["intern", "full-time", "part-time"] },
  },
  { timestamps: true }
);

export const Resume = models.Resume || model("Resume", resumeSchema);
