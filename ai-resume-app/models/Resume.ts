import mongoose, { Schema, Document, Model } from "mongoose";

export interface ExperienceItem {
  id: number;
  title: string;
  companyName: string;
  city: string;
  state: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  workSummery: string;
}

export interface EducationItem {
  id: number;
  universityName: string;
  startDate: string;
  endDate: string;
  degree: string;
  major: string;
  description: string;
}

export interface SkillItem {
  id: number;
  name: string;
  rating: number;
}

export interface ResumeDocument extends Document {
  firstName: string;
  lastName: string;
  jobTitle: string;
  address: string;
  phone: string;
  email: string;
  themeColor: string;
  summery: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  createdAt: Date;
}

const ExperienceSchema = new Schema<ExperienceItem>(
  {
    id: { type: Number, required: true },
    title: { type: String, default: "" },
    companyName: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
    currentlyWorking: { type: Boolean, default: false },
    workSummery: { type: String, default: "" },
  },
  { _id: false }
);

const EducationSchema = new Schema<EducationItem>(
  {
    id: { type: Number, required: true },
    universityName: { type: String, default: "" },
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
    degree: { type: String, default: "" },
    major: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const SkillSchema = new Schema<SkillItem>(
  {
    id: { type: Number, required: true },
    name: { type: String, default: "" },
    rating: { type: Number, default: 0 },
  },
  { _id: false }
);

const ResumeSchema = new Schema<ResumeDocument>(
  {
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    jobTitle: { type: String, default: "" },
    address: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    themeColor: { type: String, default: "#000000" },
    summery: { type: String, default: "" },
    experience: { type: [ExperienceSchema], default: [] },
    education: { type: [EducationSchema], default: [] },
    skills: { type: [SkillSchema], default: [] },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const ResumeModel: Model<ResumeDocument> =
  mongoose.models.Resume || mongoose.model("Resume", ResumeSchema);

export default ResumeModel;
