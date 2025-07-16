"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useResumeInfo } from "@/context/ResumeInfoConext";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

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

  const [personalDetails, setPersonalDetails] = useState({
    firstName: "",
    lastName: "",
    jobTitle: "",
    address: "",
    phone: "",
    email: "",
  });

  // Prefill
  useEffect(() => {
    setPersonalDetails({
      firstName: resumeInfo.firstName || "",
      lastName: resumeInfo.lastName || "",
      jobTitle: resumeInfo.jobTitle || "",
      address: resumeInfo.address || "",
      phone: resumeInfo.phone || "",
      email: resumeInfo.email || "",
    });
  }, []);

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
          <div className="sm:col-span-2 capitalize">
            <label className="text-xs font-medium">Job Title</label>
            <Input
            className="capitalize"
              name="jobTitle"
              value={personalDetails.jobTitle}
              onChange={handleChange}
              placeholder="e.g., Software Engineer"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-medium">Address</label>
            <Input
            className="capitalize"
              name="address"
              value={personalDetails.address}
              onChange={handleChange}
              placeholder="e.g., 123 Main St, City, State"
            />
          </div>
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
              placeholder="e.g., john.doe@example.com"
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
