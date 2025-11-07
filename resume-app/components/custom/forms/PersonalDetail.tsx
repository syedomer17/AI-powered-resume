"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useResumeInfo } from "@/context/ResumeInfoConext";
import { useApi } from "@/hooks/useApi";
import { toast } from "sonner";
import { motion } from "framer-motion";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Country, State, City } from "country-state-city";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PersonalDetailProps {
  enableNext?: (value: boolean) => void;
  userId?: string;
  resumeId?: string;
}

const PersonalDetail: React.FC<PersonalDetailProps> = ({
  enableNext,
  userId,
  resumeId,
}) => {
  const { resumeInfo, setResumeInfo } = useResumeInfo();
  const { callApi, loading: apiLoading } = useApi();
  const [loading, setLoading] = useState(false);
  const initialLoadRef = useRef(true);

  const [personalDetails, setPersonalDetails] = useState({
    firstName: "",
    lastName: "",
    jobTitle: "",
    address: "",
    phone: "",
    email: "",
    country: "",
    state: "",
    city: "",
    linkedIn: "",
    linkedInUsername: "",
    github: "",
    githubUsername: "",
    twitter: "",
    twitterUsername: "",
    medium: "",
    mediumUsername: "",
  });

  // Get countries, states, and cities
  const countries = Country.getAllCountries();
  const states = personalDetails.country
    ? State.getStatesOfCountry(personalDetails.country)
    : [];
  const cities =
    personalDetails.country && personalDetails.state
      ? City.getCitiesOfState(personalDetails.country, personalDetails.state)
      : [];

  // Prefill - only on initial load or when resumeInfo has actual data
  useEffect(() => {
    if (initialLoadRef.current && resumeInfo.firstName) {
      setPersonalDetails({
        firstName: resumeInfo.firstName || "",
        lastName: resumeInfo.lastName || "",
        jobTitle: resumeInfo.jobTitle || "",
        address: resumeInfo.address || "",
        phone: resumeInfo.phone || "",
        email: resumeInfo.email || "",
        country: resumeInfo.country || "",
        state: resumeInfo.state || "",
        city: resumeInfo.city || "",
        linkedIn: resumeInfo.linkedIn || "",
        linkedInUsername: resumeInfo.linkedInUsername || "",
        github: resumeInfo.github || "",
        githubUsername: resumeInfo.githubUsername || "",
        twitter: resumeInfo.twitter || "",
        twitterUsername: resumeInfo.twitterUsername || "",
        medium: resumeInfo.medium || "",
        mediumUsername: resumeInfo.mediumUsername || "",
      });
      initialLoadRef.current = false;
    }
  }, [resumeInfo]);

  // Update context + enableNext
  useEffect(() => {
    const isFilled = Object.values(personalDetails).some(
      (val) => val.trim() !== ""
    );

    setResumeInfo((prev) => ({
      ...prev,
      ...personalDetails,
      hasPersonalDetails: isFilled,
    }));

    if (enableNext) enableNext(isFilled);
  }, [personalDetails, enableNext, setResumeInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneChange = (value: string) => {
    setPersonalDetails((prev) => ({
      ...prev,
      phone: `+${value}`, // Always prefix +
    }));
  };

  const handleSave = async () => {
    if (!userId || !resumeId) {
      toast.error("User ID or Resume ID missing");
      return;
    }

    setLoading(true);
    try {
      const response = await callApi("/api/user/personal", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          resumeId,
          ...personalDetails,
          themeColor: resumeInfo.themeColor,
        }),
      });

      if (!response) {
        setLoading(false);
        return;
      }

      toast.success("Personal details saved!");
    } catch (err) {
      console.error("Save failed:", err);
      toast.error("Failed to save personal details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 md:p-8 bg-card border border-border rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 mt-6"
    >
      <div className="mb-6 pb-4 border-b border-border">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
          <span className="text-2xl">👤</span>
          Personal Details
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Get started with your basic information
        </p>
      </div>

      <form>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-1">
              First Name <span className="text-destructive">*</span>
            </label>
            <Input
              className="capitalize h-11 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
              name="firstName"
              value={personalDetails.firstName}
              onChange={handleChange}
              placeholder="e.g., John"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-1">
              Last Name <span className="text-destructive">*</span>
            </label>
            <Input
              className="capitalize h-11 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
              name="lastName"
              value={personalDetails.lastName}
              onChange={handleChange}
              placeholder="e.g., Doe"
            />
          </div>

          {/* Job Title */}
          <div className="sm:col-span-2 space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-1">
              Job Title <span className="text-destructive">*</span>
            </label>
            <Input
              className="capitalize h-11 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
              name="jobTitle"
              value={personalDetails.jobTitle}
              onChange={handleChange}
              placeholder="e.g., Software Engineer"
            />
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Phone</label>
            <PhoneInput
              country={"in"}
              value={personalDetails.phone.replace("+", "")}
              onChange={handlePhoneChange}
              enableSearch
              inputClass="!w-full !h-11 !text-sm dark:!bg-background dark:!border-border dark:!text-foreground"
              containerClass="!w-full"
              dropdownClass="dark:!bg-background dark:!border-border dark:!text-foreground"
              searchClass="dark:!bg-background dark:!border-border dark:!text-foreground"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <Input
              type="email"
              name="email"
              className="h-11 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
              value={personalDetails.email}
              onChange={handleChange}
              placeholder="omerali.code@gmail.com"
            />
          </div>

          {/* Address Section */}
          <div className="sm:col-span-2 mt-2">
            <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20">
              <span className="text-xl">📍</span>
              <h3 className="text-sm font-semibold text-foreground">Location Information</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Country */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Country</label>
                <Select
                  value={personalDetails.country}
                  onValueChange={(val) =>
                    setPersonalDetails((prev) => ({
                      ...prev,
                      country: val,
                      state: "",
                      city: "",
                    }))
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c.isoCode} value={c.isoCode}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* State */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">State</label>
                <Select
                  value={personalDetails.state}
                  onValueChange={(val) =>
                    setPersonalDetails((prev) => ({
                      ...prev,
                      state: val,
                      city: "",
                    }))
                  }
                  disabled={!personalDetails.country}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((s) => (
                      <SelectItem key={s.isoCode} value={s.isoCode}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* City */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">City</label>
                <Select
                  value={personalDetails.city}
                  onValueChange={(val) =>
                    setPersonalDetails((prev) => ({
                      ...prev,
                      city: val,
                    }))
                  }
                  disabled={!personalDetails.state}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((c) => (
                      <SelectItem key={c.name} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="sm:col-span-2 mt-4">
            <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/20">
              <span className="text-xl">🔗</span>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Social Media</h3>
                <p className="text-xs text-muted-foreground">Add your social media profiles (optional)</p>
              </div>
            </div>
          </div>

          {/* LinkedIn */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">LinkedIn Username</label>
            <Input
              name="linkedInUsername"
              className="h-11 transition-all duration-200 focus:ring-2 focus:ring-purple-500/20"
              value={personalDetails.linkedInUsername}
              onChange={handleChange}
              placeholder="e.g., Syed Omer Ali"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">LinkedIn Profile URL</label>
            <Input
              name="linkedIn"
              className="h-11 transition-all duration-200 focus:ring-2 focus:ring-purple-500/20"
              value={personalDetails.linkedIn}
              onChange={handleChange}
              placeholder="e.g., https://linkedin.com/in/syed-omer-ali"
            />
          </div>

          {/* GitHub */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">GitHub Username</label>
            <Input
              name="githubUsername"
              className="h-11 transition-all duration-200 focus:ring-2 focus:ring-purple-500/20"
              value={personalDetails.githubUsername}
              onChange={handleChange}
              placeholder="e.g., Syed Omer Ali"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">GitHub Profile URL</label>
            <Input
              name="github"
              className="h-11 transition-all duration-200 focus:ring-2 focus:ring-purple-500/20"
              value={personalDetails.github}
              onChange={handleChange}
              placeholder="e.g., https://github.com/syedomer17"
            />
          </div>

          {/* Twitter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Twitter Username</label>
            <Input
              name="twitterUsername"
              className="h-11 transition-all duration-200 focus:ring-2 focus:ring-purple-500/20"
              value={personalDetails.twitterUsername}
              onChange={handleChange}
              placeholder="e.g., Syed Omer Ali"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Twitter Profile URL</label>
            <Input
              name="twitter"
              className="h-11 transition-all duration-200 focus:ring-2 focus:ring-purple-500/20"
              value={personalDetails.twitter}
              onChange={handleChange}
              placeholder="e.g., https://twitter.com/syedomerali"
            />
          </div>

          {/* Medium */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Medium Username</label>
            <Input
              name="mediumUsername"
              className="h-11 transition-all duration-200 focus:ring-2 focus:ring-purple-500/20"
              value={personalDetails.mediumUsername}
              onChange={handleChange}
              placeholder="e.g., Syed Omer Ali"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Medium Profile URL</label>
            <Input
              name="medium"
              className="h-11 transition-all duration-200 focus:ring-2 focus:ring-purple-500/20"
              value={personalDetails.medium}
              onChange={handleChange}
              placeholder="e.g., https://medium.com/@syedomerali"
            />
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="mt-8 flex justify-end"
        >
          <Button
            type="button"
            className="save-changes-btn bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 h-11 px-8"
            onClick={handleSave}
            disabled={loading}
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default PersonalDetail;
