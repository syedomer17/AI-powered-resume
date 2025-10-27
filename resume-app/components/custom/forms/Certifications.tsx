"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Upload, Link as LinkIcon } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useResumeInfo } from "@/context/ResumeInfoConext";
import { motion, AnimatePresence } from "framer-motion";

type CertificationType = {
  id?: string | number;
  name: string;
  link?: string;
  imageUrl?: string;
  date: string;
};

interface CertificationsProps {
  enableNext?: (value: boolean) => void;
  userId?: string;
  resumeId?: string;
}

const Certifications: React.FC<CertificationsProps> = ({
  enableNext,
  userId,
  resumeId,
}) => {
  const { resumeInfo, setResumeInfo } = useResumeInfo();
  const initialLoadRef = useRef(true);

  const [certificationList, setCertificationList] = useState<CertificationType[]>([
    {
      id: 1,
      name: "",
      link: "",
      imageUrl: "",
      date: "",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (
      initialLoadRef.current &&
      resumeInfo?.certifications &&
      Array.isArray(resumeInfo.certifications) &&
      resumeInfo.certifications.length > 0
    ) {
      setCertificationList(
        resumeInfo.certifications.map((cert, i) => ({
          id: cert.id ?? i + 1,
          name: cert.name || "",
          link: cert.link || "",
          imageUrl: cert.imageUrl || "",
          date: cert.date || "",
        }))
      );
      initialLoadRef.current = false;
    }
  }, [resumeInfo]);

  useEffect(() => {
    const updatedCertifications = certificationList.map((cert, i) => ({
      id: i + 1,
      name: cert.name,
      link: cert.link,
      imageUrl: cert.imageUrl,
      date: cert.date,
    }));

    console.log("Updating certifications in context:", updatedCertifications);

    setResumeInfo((prev) => ({
      ...prev,
      certifications: updatedCertifications,
    }));

    enableNext?.(certificationList.some((c) => c.name.trim() !== ""));
  }, [certificationList]);

  const handleChange = (
    index: number,
    field: keyof CertificationType,
    value: string
  ) => {
    setCertificationList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAdd = () => {
    const newId =
      certificationList.length > 0
        ? Math.max(...certificationList.map((c) => Number(c.id) || 0)) + 1
        : 1;

    setCertificationList((prev) => [
      ...prev,
      {
        id: newId,
        name: "",
        link: "",
        imageUrl: "",
        date: "",
      },
    ]);
  };

  const handleRemove = async (index: number) => {
    const certToRemove = certificationList[index];
    console.log("Deleting certification:", certToRemove);

    if (!userId || !resumeId) {
      toast.error("User or Resume ID missing.");
      return;
    }

    // If the certification was never saved, just remove locally
    if (!certToRemove?.id) {
      setCertificationList((prev) => prev.filter((_, i) => i !== index));
      await handleSave();
      return;
    }

    try {
      const res = await axios.delete("/api/user/certifications", {
        data: {
          userId,
          resumeId,
          certificationId: certToRemove.id,
        },
      });

      if (res.data?.success) {
        toast.success("Certification removed.");
        setCertificationList(
          res.data.certifications.map((cert: any) => ({
            id: cert.id,
            name: cert.name,
            link: cert.link,
            imageUrl: cert.imageUrl,
            date: cert.date,
          }))
        );
      } else {
        toast.error(res.data?.message || "Failed to remove certification.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error removing certification.");
    }
  };

  const handleSave = async () => {
    if (!userId) return toast.error("User ID missing.");
    if (!resumeId) return toast.error("Resume ID missing.");

    setLoading(true);
    try {
      const response = await axios.patch("/api/user/certifications", {
        userId,
        resumeId,
        certifications: certificationList,
      });

      if (response.data?.success) {
        toast.success("Certifications saved!");
        setCertificationList(
          response.data.certifications.map((cert: any) => ({
            id: cert.id,
            name: cert.name,
            link: cert.link,
            imageUrl: cert.imageUrl,
            date: cert.date,
          }))
        );
      } else {
        toast.error(response.data?.message || "Failed to save certifications.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving certifications.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (index: number, file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setUploadingIndex(index);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("/api/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.success) {
        handleChange(index, "imageUrl", response.data.imageUrl);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error(response.data?.message || "Failed to upload image");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error uploading image");
    } finally {
      setUploadingIndex(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-5 shadow-lg rounded-lg border-t-4 border-zinc-800 dark:border-zinc-600 mt-10"
    >
      <h2 className="font-bold text-lg mb-2">Certifications</h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
        Add your certifications with a link or upload an image
      </p>

      <AnimatePresence>
        {certificationList.map((field, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-zinc-200 dark:border-zinc-700 p-4 my-5 rounded-lg bg-zinc-50 dark:bg-zinc-800"
          >
            <div className="sm:col-span-2">
              <label className="text-xs font-medium">Certification Name</label>
              <Input
                value={field.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                placeholder="e.g., AWS Certified Developer"
              />
            </div>

            <div>
              <label className="text-xs font-medium">Certification Link (Optional)</label>
              <div className="flex gap-2">
                <Input
                  value={field.link}
                  onChange={(e) => handleChange(index, "link", e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium">Date</label>
              <Input
                type="date"
                value={field.date}
                onChange={(e) => handleChange(index, "date", e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-medium">Upload Image (Optional)</label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(index, file);
                  }}
                  disabled={uploadingIndex === index}
                  className="flex-1"
                />
                {uploadingIndex === index && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
              </div>
              {field.imageUrl && (
                <div className="mt-2">
                  <img
                    src={field.imageUrl}
                    alt="Certification"
                    className="h-20 object-contain border rounded"
                  />
                </div>
              )}
            </div>

            <div className="sm:col-span-2 flex justify-end">
              <Button
                type="button"
                onClick={() => handleRemove(index)}
                size="sm"
                variant="ghost"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="flex gap-2 justify-between mt-4">
        <Button
          type="button"
          onClick={handleAdd}
          variant="outline"
          size="sm"
          className="text-primary border-primary hover:bg-primary/10"
        >
          + Add Certification
        </Button>

        <Button
          type="button"
          onClick={handleSave}
          disabled={loading}
          size="sm"
          className=" bg-[#9f5bff] text-white hover:bg-[#9f5bff]/90"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default Certifications;
