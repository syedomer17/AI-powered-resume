"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

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
  linkedInUsername: string;
  github: string;
  githubUsername: string;
  twitter: string;
  twitterUsername: string;
  medium: string;
  mediumUsername: string;
  experience: any[];
  education: any[];
  skills: any[];
  projects: any[];
  certifications: any[];
  hasPersonalDetails?: boolean;
}

interface ResumeInfoContextType {
  resumeInfo: ResumeInfoType;
  setResumeInfo: React.Dispatch<React.SetStateAction<ResumeInfoType>>;
}

const ResumeInfoContext = createContext<ResumeInfoContextType | undefined>(
  undefined
);

export const ResumeInfoProvider = ({
  children,
  defaultValue,
}: {
  children: ReactNode;
  defaultValue?: ResumeInfoType;
}) => {
  const [resumeInfo, setResumeInfo] = useState<ResumeInfoType>({
    firstName: defaultValue?.firstName ?? "",
    lastName: defaultValue?.lastName ?? "",
    jobTitle: defaultValue?.jobTitle ?? "",
    address: defaultValue?.address ?? "",
    phone: defaultValue?.phone ?? "",
    email: defaultValue?.email ?? "",
    themeColor: defaultValue?.themeColor ?? "#ff6666",
    summery: defaultValue?.summery ?? "",
    country: defaultValue?.country ?? "",
    state: defaultValue?.state ?? "",
    city: defaultValue?.city ?? "",
    linkedIn: defaultValue?.linkedIn ?? "",
    linkedInUsername: defaultValue?.linkedInUsername ?? "",
    github: defaultValue?.github ?? "",
    githubUsername: defaultValue?.githubUsername ?? "",
    twitter: defaultValue?.twitter ?? "",
    twitterUsername: defaultValue?.twitterUsername ?? "",
    medium: defaultValue?.medium ?? "",
    mediumUsername: defaultValue?.mediumUsername ?? "",
    experience: defaultValue?.experience ?? [],
    education: defaultValue?.education ?? [],
    skills: defaultValue?.skills ?? [],
    projects: defaultValue?.projects ?? [],
    certifications: defaultValue?.certifications ?? [],
    hasPersonalDetails: defaultValue?.hasPersonalDetails ?? false,
  });

  useEffect(() => {
    if (defaultValue) {
      setResumeInfo({
        firstName: defaultValue.firstName ?? "",
        lastName: defaultValue.lastName ?? "",
        jobTitle: defaultValue.jobTitle ?? "",
        address: defaultValue.address ?? "",
        phone: defaultValue.phone ?? "",
        email: defaultValue.email ?? "",
        themeColor: defaultValue.themeColor ?? "#ff6666",
        summery: defaultValue.summery ?? "",
        country: defaultValue.country ?? "",
        state: defaultValue.state ?? "",
        city: defaultValue.city ?? "",
        linkedIn: defaultValue.linkedIn ?? "",
        linkedInUsername: defaultValue.linkedInUsername ?? "",
        github: defaultValue.github ?? "",
        githubUsername: defaultValue.githubUsername ?? "",
        twitter: defaultValue.twitter ?? "",
        twitterUsername: defaultValue.twitterUsername ?? "",
        medium: defaultValue.medium ?? "",
        mediumUsername: defaultValue.mediumUsername ?? "",
        experience: defaultValue.experience ?? [],
        education: defaultValue.education ?? [],
        skills: defaultValue.skills ?? [],
        projects: defaultValue.projects ?? [],
        certifications: defaultValue.certifications ?? [],
        hasPersonalDetails: defaultValue.hasPersonalDetails ?? false,
      });
    }
  }, [defaultValue]);

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      {children}
    </ResumeInfoContext.Provider>
  );
};

export const useResumeInfo = () => {
  const context = useContext(ResumeInfoContext);
  if (!context) {
    throw new Error("useResumeInfo must be used within a ResumeInfoProvider");
  }
  return context;
};
