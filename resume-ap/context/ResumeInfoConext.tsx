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

interface ResumeInfoContextType {
  resumeInfo: ResumeInfoType;
  setResumeInfo: React.Dispatch<React.SetStateAction<ResumeInfoType>>;
}

const ResumeInfoContext = createContext<ResumeInfoContextType | undefined>(
  undefined
);

export const ResumeInfoProvider = ({ children }: { children: ReactNode }) => {
  const [resumeInfo, setResumeInfo] = useState<ResumeInfoType>(dummy);

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
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
