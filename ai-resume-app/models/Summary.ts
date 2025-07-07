import mongoose from "mongoose";

const SummarySchema = new mongoose.Schema(
  {
    summary: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Summary ||
  mongoose.model("Summary", SummarySchema);
