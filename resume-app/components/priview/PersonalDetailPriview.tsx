"use client";

import { ResumeInfoType } from "@/context/ResumeInfoConext";
import { Country } from "country-state-city";

export default function PersonalDetailPriview({
  resumeInfo,
}: {
  resumeInfo: ResumeInfoType;
}) {

  return (
    <div className="text-center mb-4">
      {/* Name - Large and Bold */}
      <h1 className="font-bold text-[28px] text-black mb-2 tracking-tight">
        {resumeInfo?.firstName} {resumeInfo?.lastName}
      </h1>

      {/* Contact Info Line */}
      <div className="flex flex-wrap justify-center items-center gap-2 text-[11px] mb-2">
        {resumeInfo?.phone && (
          <a 
            href={`https://api.whatsapp.com/send?phone=${resumeInfo.phone.replace(/[^0-9]/g, '')}&text=Hello%20${resumeInfo?.firstName}%20%F0%9F%91%8B`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:underline"
          >
            {resumeInfo.phone}
          </a>
        )}
        {resumeInfo?.phone && resumeInfo?.email && <span className="text-black">|</span>}
        {resumeInfo?.email && (
          <a href={`mailto:${resumeInfo.email}`} className="text-blue-700 hover:underline">
            {resumeInfo.email}
          </a>
        )}
      </div>

      {/* Social Links with Icons */}
      {(resumeInfo?.linkedIn || resumeInfo?.github || resumeInfo?.twitter || resumeInfo?.medium) && (
        <div className="flex flex-wrap justify-center items-center gap-2 text-[11px] mb-2">
          {resumeInfo?.linkedIn && (
            <>
              <a 
                href={resumeInfo.linkedIn.includes('http') ? resumeInfo.linkedIn : `https://linkedin.com/in/${resumeInfo.linkedIn}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1 text-blue-700 hover:underline"
              >
                <svg className="w-3 h-3 fill-black" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                {resumeInfo.linkedInUsername || "LinkedIn"}
              </a>
              {(resumeInfo?.github || resumeInfo?.twitter || resumeInfo?.medium) && <span className="text-black">|</span>}
            </>
          )}
          {resumeInfo?.github && (
            <>
              <a 
                href={resumeInfo.github.includes('http') ? resumeInfo.github : `https://github.com/${resumeInfo.github}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1 text-blue-700 hover:underline"
              >
                <svg className="w-3 h-3 fill-black" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                {resumeInfo.githubUsername || "GitHub"}
              </a>
              {(resumeInfo?.twitter || resumeInfo?.medium) && <span className="text-black">|</span>}
            </>
          )}
          {resumeInfo?.twitter && (
            <>
              <a 
                href={resumeInfo.twitter.includes('http') ? resumeInfo.twitter : `https://twitter.com/${resumeInfo.twitter}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1 text-blue-700 hover:underline"
              >
                <svg className="w-3 h-3 fill-black" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                {resumeInfo.twitterUsername || "Twitter"}
              </a>
              {resumeInfo?.medium && <span className="text-black">|</span>}
            </>
          )}
          {resumeInfo?.medium && (
            <a 
              href={resumeInfo.medium.includes('http') ? resumeInfo.medium : `https://medium.com/@${resumeInfo.medium}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-1 text-blue-700 hover:underline"
            >
              <svg className="w-3 h-3 fill-black" viewBox="0 0 24 24">
                <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
              </svg>
              {resumeInfo.mediumUsername || "Medium"}
            </a>
          )}
        </div>
      )}

      {/* Address */}
      {(resumeInfo?.city || resumeInfo?.country) && (
        <p className="text-[11px] text-black">
          {resumeInfo?.city && `${resumeInfo.city}, `}
          {resumeInfo?.country && Country.getCountryByCode(resumeInfo.country)?.name}
        </p>
      )}
    </div>
  );
}
