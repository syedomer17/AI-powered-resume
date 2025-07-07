"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResumeInfoContext } from "@/context/ResumeInfoConext";
import { createPersonalDetails } from "@/service/GlobalApi";
import React, { useContext, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const PersonalDetail = ({ enableNext }: { enableNext: (value: boolean) => void }) => {
  const context = useContext(ResumeInfoContext);
  if (!context) return null;

  const { resumeInfo, setResumeInfo } = context;
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResumeInfo({
      ...resumeInfo,
      [name]: value,
    });
  };

  const onSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createPersonalDetails({
        ...resumeInfo,
      });
      enableNext(true);
      toast.success("Details saved successfully!");
    } catch (err) {
      console.error("Error saving personal details:", err);
      toast.error("Failed to save details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Personal Details</h2>
      <p>Get started with your basic information.</p>

      <form onSubmit={onSave}>
        <div className="grid grid-cols-2 mt-5 gap-3">
          <div>
            <label className="text-sm" defaultValue={resumeInfo?.firstName}>First Name</label>
            <Input
              name="firstName"
              required
              onChange={handleInputChange}
              value={resumeInfo.firstName}
            />
          </div>
          <div>
            <label className="text-sm" defaultValue={resumeInfo?.lastName}>Last Name</label>
            <Input
              name="lastName"
              required
              onChange={handleInputChange}
              value={resumeInfo.lastName}
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm" defaultValue={resumeInfo?.jobTitle}>Job Title</label>
            <Input
              name="jobTitle"
              required
              onChange={handleInputChange}
              value={resumeInfo.jobTitle}
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm" defaultValue={resumeInfo?.address}>Address</label>
            <Input
              name="address"
              required
              onChange={handleInputChange}
              value={resumeInfo.address}
            />
          </div>
          <div>
            <label className="text-sm" defaultValue={resumeInfo?.phone}>Phone</label>
            <Input
              name="phone"
              required
              onChange={handleInputChange}
              value={resumeInfo.phone}
            />
          </div>
          <div>
            <label className="text-sm" defaultValue={resumeInfo?.email}>Email</label>
            <Input
              type="email"
              name="email"
              required
              onChange={handleInputChange}
              value={resumeInfo.email}
            />
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <Button type="submit" className="bg-[#9f5bff]" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PersonalDetail;
