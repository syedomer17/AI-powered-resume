"use client";

import React, { createContext, useState } from "react";
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

// Create the Context
export const ResumeInfoContext = createContext<{
  resumeInfo: ResumeInfoType;
  setResumeInfo: React.Dispatch<React.SetStateAction<ResumeInfoType>>;
} | null>(null);

// Provider component to wrap your app or page
export const ResumeInfoProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [resumeInfo, setResumeInfo] = useState<ResumeInfoType>(dummy);

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      {children}
    </ResumeInfoContext.Provider>
  );
};
