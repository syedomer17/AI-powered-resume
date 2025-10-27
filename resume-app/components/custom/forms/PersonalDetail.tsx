"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useResumeInfo } from "@/context/ResumeInfoConext";
import axios from "axios";
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
      await axios.patch("/api/user/personal", {
        userId,
        resumeId,
        ...personalDetails,
        themeColor: resumeInfo.themeColor,
      });

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
      className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg mt-10"
    >
      <h2 className="font-semibold text-xl mb-1">👤 Personal Details</h2>
      <p className="text-sm text-zinc-500 mb-4">
        Get started with your basic information.
      </p>

      <form>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="text-xs font-medium capitalize">First Name</label>
            <Input
              className="capitalize"
              name="firstName"
              value={personalDetails.firstName}
              onChange={handleChange}
              placeholder="e.g., John"
            />
          </div>
          <div>
            <label className="text-xs font-medium capitalize">Last Name</label>
            <Input
              className="capitalize"
              name="lastName"
              value={personalDetails.lastName}
              onChange={handleChange}
              placeholder="e.g., Doe"
            />
          </div>

          {/* Job Title */}
          <div className="sm:col-span-2">
            <label className="text-xs font-medium">Job Title</label>
            <Input
              className="capitalize"
              name="jobTitle"
              value={personalDetails.jobTitle}
              onChange={handleChange}
              placeholder="e.g., Software Engineer"
            />
          </div>

          {/* Contact */}
          <div>
            <label className="text-xs font-medium">Phone</label>
            <PhoneInput
              country={"in"}
              value={personalDetails.phone.replace("+", "")}
              onChange={handlePhoneChange}
              enableSearch
              inputClass="!w-full !h-10 !text-sm"
              containerClass="!w-full"
            />
          </div>
          <div>
            <label className="text-xs font-medium">Email</label>
            <Input
              type="email"
              name="email"
              value={personalDetails.email}
              onChange={handleChange}
              placeholder="omerali.code@gmail.com"
            />
          </div>

          {/* Address Section */}
          <div className="sm:col-span-2">
            <h3 className="text-sm font-semibold mb-3">📍 Location</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Country */}
              <div>
                <label className="text-xs font-medium">Country</label>
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
                  <SelectTrigger>
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
              <div>
                <label className="text-xs font-medium">State</label>
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
                  <SelectTrigger>
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
              <div>
                <label className="text-xs font-medium">City</label>
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
                  <SelectTrigger>
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
          <div className="sm:col-span-2">
            <h3 className="text-sm font-semibold mb-2 mt-4 border-t pt-4">🔗 Social Media</h3>
            <p className="text-xs text-zinc-500 mb-3">Add your social media profile links and display names</p>
          </div>

          {/* LinkedIn */}
          <div>
            <label className="text-xs font-medium">LinkedIn Username</label>
            <Input
              name="linkedInUsername"
              value={personalDetails.linkedInUsername}
              onChange={handleChange}
              placeholder="e.g., Syed Omer Ali"
            />
          </div>
          <div>
            <label className="text-xs font-medium">LinkedIn Profile URL</label>
            <Input
              name="linkedIn"
              value={personalDetails.linkedIn}
              onChange={handleChange}
              placeholder="e.g., https://linkedin.com/in/syed-omer-ali"
            />
          </div>

          {/* GitHub */}
          <div>
            <label className="text-xs font-medium">GitHub Username</label>
            <Input
              name="githubUsername"
              value={personalDetails.githubUsername}
              onChange={handleChange}
              placeholder="e.g., Syed Omer Ali"
            />
          </div>
          <div>
            <label className="text-xs font-medium">GitHub Profile URL</label>
            <Input
              name="github"
              value={personalDetails.github}
              onChange={handleChange}
              placeholder="e.g., https://github.com/syedomer17"
            />
          </div>

          {/* Twitter */}
          <div>
            <label className="text-xs font-medium">Twitter Username</label>
            <Input
              name="twitterUsername"
              value={personalDetails.twitterUsername}
              onChange={handleChange}
              placeholder="e.g., Syed Omer Ali"
            />
          </div>
          <div>
            <label className="text-xs font-medium">Twitter Profile URL</label>
            <Input
              name="twitter"
              value={personalDetails.twitter}
              onChange={handleChange}
              placeholder="e.g., https://twitter.com/syedomerali"
            />
          </div>

          {/* Medium */}
          <div>
            <label className="text-xs font-medium">Medium Username</label>
            <Input
              name="mediumUsername"
              value={personalDetails.mediumUsername}
              onChange={handleChange}
              placeholder="e.g., Syed Omer Ali"
            />
          </div>
          <div>
            <label className="text-xs font-medium">Medium Profile URL</label>
            <Input
              name="medium"
              value={personalDetails.medium}
              onChange={handleChange}
              placeholder="e.g., https://medium.com/@syedomerali"
            />
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="mt-4 flex justify-end"
        >
          <Button
            type="button"
            className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white flex items-center gap-2 transition"
            onClick={handleSave}
            disabled={loading}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Save
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default PersonalDetail;
