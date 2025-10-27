export interface ResumeInfoType {
  firstName: string;
  lastName: string;
  jobTitle: string;
  address: string;
  phone: string;
  email: string;
  themeColor: string;
  summery: string;
  // Address fields
  country: string;
  state: string;
  city: string;
  // Social media links
  linkedIn: string;
  github: string;
  twitter: string;
  medium: string;
  experience: {
    id: number;
    title: string;
    companyName: string;
    city: string;
    state: string;
    startDate: string;
    endDate: string;
    currentlyWorking: boolean;
    workSummery: string;
  }[];
  education: {
    id: number;
    universityName: string;
    startDate: string;
    endDate: string;
    degree: string;
    major: string;
    description: string;
  }[];
  skills: {
    id: number;
    name: string;
    rating: number;
  }[];
}
