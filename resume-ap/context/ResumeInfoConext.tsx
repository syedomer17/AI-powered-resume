"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import dummy from "@/data/DefaultResumeData";

export interface ResumeInfoType {
  firstName: string;
  lastName: string;
  jobTitle: string;
  address: string;
  phone: string;
  email: string;
  themeColor: string;
  summery: string;
  experience: any[];
  education: any[];
  skills: any[];
  projects: any[]; // ✅ Added projects here
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
    ...dummy,
    ...defaultValue,
    experience: defaultValue?.experience ?? dummy.experience,
    education: defaultValue?.education ?? dummy.education,
    skills: defaultValue?.skills ?? dummy.skills,
    projects: defaultValue?.projects ?? dummy.projects, // ✅ Added here
    hasPersonalDetails: defaultValue?.hasPersonalDetails ?? false,
  });

  useEffect(() => {
    if (defaultValue) {
      setResumeInfo({
        ...dummy,
        ...defaultValue,
        experience: defaultValue.experience ?? dummy.experience,
        education: defaultValue.education ?? dummy.education,
        skills: defaultValue.skills ?? dummy.skills,
        projects: defaultValue.projects ?? dummy.projects, // ✅ Added here
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
