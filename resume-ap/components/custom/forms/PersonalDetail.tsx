"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useResumeInfo } from "@/context/ResumeInfoConext";
import axios from "axios";
import { toast } from "sonner";

interface PersonalDetailProps {
  enableNext?: (value: boolean) => void;
  userId?: string;
  resumeId?: string;  // <-- Added resumeId here
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

  // Prefill ONCE when mounting
  useEffect(() => {
    setPersonalDetails({
      firstName: resumeInfo?.firstName || "",
      lastName: resumeInfo?.lastName || "",
      jobTitle: resumeInfo?.jobTitle || "",
      address: resumeInfo?.address || "",
      phone: resumeInfo?.phone || "",
      email: resumeInfo?.email || "",
    });
  }, []); // only on mount

  // Update context whenever user types
  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      ...personalDetails,
    }));

    // Enable next if anything is filled
    if (enableNext) {
      const filled = Object.values(personalDetails).some(
        (val) => val.trim() !== ""
      );
      enableNext(filled);
    }
  }, [personalDetails, setResumeInfo, enableNext]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!userId) {
      toast.error("User ID missing. Cannot save.");
      return;
    }
    if (!resumeId) {
      toast.error("Resume ID missing. Cannot save.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/user/personal", {
        userId,
        resumeId,  // <-- Send resumeId to backend
        ...personalDetails,
      });

      toast.success("Personal details saved!");
    } catch (error) {
      console.error("Failed to save personal details:", error);
      toast.error("Something went wrong while saving.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Personal Details</h2>
      <p>Get started with your basic information.</p>

      <form>
        <div className="grid grid-cols-2 mt-5 gap-3">
          <div>
            <label className="text-sm">First Name</label>
            <Input
              name="firstName"
              value={personalDetails.firstName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-sm">Last Name</label>
            <Input
              name="lastName"
              value={personalDetails.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm">Job Title</label>
            <Input
              name="jobTitle"
              value={personalDetails.jobTitle}
              onChange={handleChange}
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm">Address</label>
            <Input
              name="address"
              value={personalDetails.address}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-sm">Phone</label>
            <Input
              name="phone"
              value={personalDetails.phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-sm">Email</label>
            <Input
              type="email"
              name="email"
              value={personalDetails.email}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <Button
            type="button"
            className="bg-[#9f5bff] text-white flex items-center gap-2"
            onClick={handleSave}
            disabled={loading}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PersonalDetail;
