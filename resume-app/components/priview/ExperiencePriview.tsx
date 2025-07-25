"use client";

import React from "react";
import { ResumeInfoType } from "@/context/ResumeInfoConext";
import { motion } from "framer-motion";
import { Country, State } from "country-state-city";

// Helpers to get full names
const getCountryName = (code: string) => {
  if (!code) return "";
  const country = Country.getCountryByCode(code);
  return country ? country.name : "";
};

const getStateName = (countryCode: string, stateCode: string) => {
  if (!countryCode || !stateCode) return "";
  const state = State.getStateByCodeAndCountry(stateCode, countryCode);
  return state ? state.name : "";
};

const ExperiencePriview = ({ resumeInfo }: { resumeInfo: ResumeInfoType }) => {
  const themeColor = resumeInfo?.themeColor || "#9f5bff";

  return (
    <div className="my-6">
      {/* Section Title */}
      <h2
        className="text-center font-bold text-sm tracking-wide mb-2"
        style={{ color: themeColor }}
      >
        Professional Experience
      </h2>
      <hr className="mb-6 border-t-2" style={{ borderColor: themeColor }} />

      {/* Experience Entries */}
      {resumeInfo?.experience?.length > 0 ? (
        resumeInfo.experience.map((experience, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="mb-5 px-4 py-3 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm"
          >
            {/* Job Title */}
            <h3
              className="text-sm font-semibold mb-1 capitalize"
              style={{ color: themeColor }}
            >
              {experience?.title}
            </h3>

            {/* Company and Dates */}
            <div
              className="
                flex flex-col gap-1 
                sm:flex-row sm:justify-between sm:items-center 
                text-xs text-muted-foreground mb-1 capitalize
              "
            >
              <span>
                {experience?.companyName}
                {experience?.city ? `, ${experience.city}` : ""}
                {experience?.state
                  ? `, ${getStateName(experience.country, experience.state)}`
                  : ""}
                {experience?.country
                  ? `, ${getCountryName(experience.country)}`
                  : ""}
              </span>
              <span>
                {experience?.startDate} –{" "}
                {experience?.currentlyWorking ? "Present" : experience?.endDate}
              </span>
            </div>

            {/* Summary */}
            {experience?.workSummery && (
              <div
                className="text-xs mt-2 text-zinc-700 dark:text-zinc-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: experience.workSummery }}
              />
            )}
          </motion.div>
        ))
      ) : (
        <p className="text-xs text-center text-muted-foreground">
          No experience details added.
        </p>
      )}
    </div>
  );
};

export default ExperiencePriview;
