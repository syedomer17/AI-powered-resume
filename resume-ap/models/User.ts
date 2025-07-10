import mongoose, { Schema, Document } from "mongoose";

/* Experience */
export interface IExperience {
  _id?: mongoose.Types.ObjectId;
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

/* Education */
export interface IEducation {
  _id?: mongoose.Types.ObjectId;
  id: number;
  universityName: string;
  startDate: string;
  endDate: string;
  degree: string;
  major: string;
  description: string;
}

/* Skill */
export interface ISkill {
  _id?: mongoose.Types.ObjectId;
  id: number;
  name: string;
  rating: number;
}

/* Personal Details */
export interface IPersonalDetails {
  _id?: mongoose.Types.ObjectId;
  id: number;
  firstName: string;
  lastName: string;
  jobTitle: string;
  address: string;
  phone: string;
  themeColor: string;
  summery: string;
}

/* Resume */
export interface IResume {
  _id?: mongoose.Types.ObjectId;
  id: number;             // sequential identifier
  title: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/* Summary */
export interface ISummary {
  _id?: mongoose.Types.ObjectId;
  id: number;
  text: string;
}

/* User */
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
  personalDetails: IPersonalDetails[];
  experience: IExperience[];
  education: IEducation[];
  skills: ISkill[];
  resumes: IResume[];         // 🟢 Add this
  summary: ISummary[];
}

const SummarySchema = new Schema<ISummary>({
  id: { type: Number },
  text: { type: String, required: true },
});


/* Experience Schema */
const ExperienceSchema = new Schema<IExperience>({
  id: { type: Number },
  title: { type: String, required: true },
  companyName: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String },
  currentlyWorking: { type: Boolean, default: false },
  workSummery: { type: String, default: "" },
});

/* Education Schema */
const EducationSchema = new Schema<IEducation>({
  id: { type: Number },
  universityName: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  degree: { type: String, required: true },
  major: { type: String, required: true },
  description: { type: String, default: "" },
});

/* Skill Schema */
const SkillSchema = new Schema<ISkill>({
  id: { type: Number },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
});

/* Personal Details Schema */
const PersonalDetailsSchema = new Schema<IPersonalDetails>({
  id: { type: Number },
  firstName: { type: String },
  lastName: { type: String },
  jobTitle: { type: String },
  address: { type: String },
  phone: { type: String },
  themeColor: { type: String, default: "#ff6666" },
  // summery: { type: String, default: "" },
});

/* Resume Schema */
const ResumeSchema = new Schema<IResume>(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true },
  },
  { timestamps: true }
);

/* User Schema */
const UserSchema = new Schema<IUser>(
  {
    userName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String },
    emailVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpCreatedAt: { type: Date },
    passwordResetVerified: { type: Boolean, default: false },
    avatar: {
      type: String,
      default:
        "https://play-lh.googleusercontent.com/nV5JHE9tyyqNcVqh0JLVGoV2ldpAqC8htiBpsbjqxATjXQnpNTKgU99B-euShOJPu-8",
    },
    bio: { type: String, default: "" },
    personalDetails: { type: [PersonalDetailsSchema], default: [] }, // ✅ Array
    experience: { type: [ExperienceSchema], default: [] },
    education: { type: [EducationSchema], default: [] },
    skills: { type: [SkillSchema], default: [] },
    resumes: { type: [ResumeSchema], default: [] },
    summary: { type: [SummarySchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
