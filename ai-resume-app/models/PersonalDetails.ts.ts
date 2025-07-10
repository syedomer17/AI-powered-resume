import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema({
  title: String,
  companyName: String,
  city: String,
  state: String,
  startDate: String,
  endDate: String,
  currentlyWorking: Boolean,
  workSummery: String,
});

const PersonalDetailsSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, required: true, unique: true },
    phone: String,
    address: String,
    jobTitle: String,
    experience: [ExperienceSchema],
  },
  { timestamps: true }
);

export default mongoose.models.PersonalDetails ||
  mongoose.model("PersonalDetails", PersonalDetailsSchema);
