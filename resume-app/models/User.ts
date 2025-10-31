import mongoose, { Schema, Document } from "mongoose";

/* Interfaces */
export interface IExperience {
  id: number;
  title: string;
  companyName: string;
  workType: string; // Remote, Hybrid, In-office
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
  city: string;
  country: string;
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
  country?: string;
  state?: string;
  city?: string;
  linkedIn?: string;
  linkedInUsername?: string;
  github?: string;
  githubUsername?: string;
  twitter?: string;
  twitterUsername?: string;
  medium?: string;
  mediumUsername?: string;
}

export interface ISummary {
  id: number;
  text: string;
  resumeId: string;
}

export interface IProject {
  id: number;
  title: string;
  techStack: string;
  description: string;
  link?: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
}

export interface ICertification {
  id: number;
  name: string;
  link?: string;
  imageUrl?: string;
  date: string;
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
  certifications: ICertification[]; // added certifications
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
  workType: String, // Remote, Hybrid, In-office
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
  city: String,
  country: String,
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
  country: String,
  state: String,
  city: String,
  linkedIn: String,
  linkedInUsername: String,
  github: String,
  githubUsername: String,
  twitter: String,
  twitterUsername: String,
  medium: String,
  mediumUsername: String,
});

// Project schema added as requested
const ProjectSchema = new Schema<IProject>({
  id: Number,
  title: String,
  techStack: String,
  description: String,
  link: String,
  startDate: String,
  endDate: String,
  currentlyWorking: Boolean,
});

const CertificationSchema = new Schema<ICertification>({
  id: Number,
  name: String,
  link: String,
  imageUrl: String,
  date: String,
});

const ATSAnalysisSchema = new Schema<IATSAnalysis>({
  score: Number,
  matchPercentage: Number,
  jobDescription: String,
  analyzedAt: { type: Date, default: Date.now },
});

const ResumeSchema = new Schema<IResume>(
  {
    id: { type: Number, required: true, index: true },
    title: { type: String, required: true, index: true },
    personalDetails: { type: [PersonalDetailsSchema], default: [] },
    experience: { type: [ExperienceSchema], default: [] },
    education: { type: [EducationSchema], default: [] },
    skills: { type: [SkillSchema], default: [] },
    summary: { type: [SummarySchema], default: [] },
    projects: { type: [ProjectSchema], default: [] }, // projects added here
    certifications: { type: [CertificationSchema], default: [] }, // certifications added
    atsAnalysis: { type: ATSAnalysisSchema, default: undefined }, // ATS analysis
  },
  { timestamps: true }
);

// ✅ Index for sorting or filtering by creation time
ResumeSchema.index({ createdAt: -1 });

const UserSchema = new Schema<IUser>(
  {
    userName: { type: String, required: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
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

UserSchema.index({ email: 1, userName: 1 });

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
