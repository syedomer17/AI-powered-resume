import React from "react";
import { ResumeInfoType } from "@/context/ResumeInfoConext";

const Summery = ({ resumeInfo }: { resumeInfo: ResumeInfoType }) => {
  return <div className="text-xs">{resumeInfo?.summery}</div>;
};

export default Summery;
