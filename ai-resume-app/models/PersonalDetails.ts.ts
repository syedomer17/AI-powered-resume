// models/PersonalDetails.ts
import mongoose from "mongoose";

const PersonalDetailsSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    jobTitle: { type: String },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
  },
  { timestamps: true }
);

const PersonalDetails =
  mongoose.models.PersonalDetails ||
  mongoose.model("PersonalDetails", PersonalDetailsSchema);

export default PersonalDetails;
