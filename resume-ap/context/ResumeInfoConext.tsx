"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
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
  });

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo } }>
      {children}
    </ResumeInfoContext.Provider>
  );
};

export const useResumeInfo = () => {
  const context = useContext(ResumeInfoContext);
  if (context === undefined) {
    throw new Error("useResumeInfo must be used within a ResumeInfoProvider");
  }
  return context;
};
