import mongoose, { Schema, models, model } from "mongoose";

const submissionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    resume: { type: Schema.Types.ObjectId, ref: "Resume" },
    company: String,
    status: { type: String, enum: ["pending", "submitted", "error"], default: "pending" },
    response: String,
  },
  { timestamps: true }
);

export const Submission = models.Submission || model("Submission", submissionSchema);
