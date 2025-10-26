import mongoose, { Schema, Document } from "mongoose";

/* Interfaces */
export interface IExperience {
  id: number;
  title: string;
  companyName: string;
  country: String;
  city: string;
  state: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  workSummary: string; // typo fixed here
}

export interface IEducation {
  id: number;
  universityName: string;
  startDate: string;
  endDate: string;
  degree: string;
  major: string;
  description: string;
}

export interface ISkill {
  id: number;
  name: string;
  category: string;
}

export interface IPersonalDetails {
  id: number;
  firstName: string;
  lastName: string;
  jobTitle: string;
  address: string;
  phone: string;
  email: string;
  themeColor: string;
}

export interface ISummary {
  id: number;
  text: string;
  resumeId: string;
}

export interface IProject {
  id: number;
  title: string;
  description: string;
  link?: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
}

export interface IATSAnalysis {
  score: number;
  matchPercentage: number;
  jobDescription: string;
  analyzedAt: Date;
}

export interface IResume {
  _id?: mongoose.Types.ObjectId;
  id: number;
  title: string;
  personalDetails: IPersonalDetails[];
  experience: IExperience[];
  education: IEducation[];
  skills: ISkill[];
  summary: ISummary[];
  projects: IProject[]; // added projects here
  atsAnalysis?: IATSAnalysis; // ATS score data
  createdAt?: Date;
  updatedAt?: Date;
}

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
  resumes: IResume[];
}

/* Sub-Schemas */
const SummarySchema = new Schema<ISummary>({
  id: Number,
  text: { type: String, required: true },
  resumeId: { type: String, required: true },
});

const ExperienceSchema = new Schema<IExperience>({
  id: Number,
  title: String,
  companyName: String,
  country: String,
  city: String,
  state: String,
  startDate: String,
  endDate: String,
  currentlyWorking: Boolean,
  workSummary: String, // typo fixed here
});

const EducationSchema = new Schema<IEducation>({
  id: Number,
  universityName: String,
  startDate: String,
  endDate: String,
  degree: String,
  major: String,
  description: String,
});

const SkillSchema = new Schema<ISkill>({
  id: Number,
  name: String,
   category: { type: String, default: "General" },
});

const PersonalDetailsSchema = new Schema<IPersonalDetails>({
  id: Number,
  firstName: String,
  lastName: String,
  jobTitle: String,
  address: String,
  phone: String,
  email: String,
  themeColor: { type: String, default: "#ff6666" },
});

// Project schema added as requested
const ProjectSchema = new Schema<IProject>({
  id: Number,
  title: String,
  description: String,
  link: String,
  startDate: String,
  endDate: String,
  currentlyWorking: Boolean,
});

const ATSAnalysisSchema = new Schema<IATSAnalysis>({
  score: Number,
  matchPercentage: Number,
  jobDescription: String,
  analyzedAt: { type: Date, default: Date.now },
});

const ResumeSchema = new Schema<IResume>(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true },
    personalDetails: { type: [PersonalDetailsSchema], default: [] },
    experience: { type: [ExperienceSchema], default: [] },
    education: { type: [EducationSchema], default: [] },
    skills: { type: [SkillSchema], default: [] },
    summary: { type: [SummarySchema], default: [] },
    projects: { type: [ProjectSchema], default: [] }, // projects added here
    atsAnalysis: { type: ATSAnalysisSchema, default: undefined }, // ATS analysis
  },
  { timestamps: true }
);

const UserSchema = new Schema<IUser>(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: String,
    emailVerified: { type: Boolean, default: false },
    otp: String,
    otpCreatedAt: Date,
    passwordResetVerified: { type: Boolean, default: false },
    avatar: {
      type: String,
      default:
        "https://play-lh.googleusercontent.com/nV5JHE9tyyqNcVqh0JLVGoV2ldpAqC8htiBpsbjqxATjXQnpNTKgU99B-euShOJPu-8",
    },
    bio: { type: String, default: "" },
    resumes: { type: [ResumeSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
