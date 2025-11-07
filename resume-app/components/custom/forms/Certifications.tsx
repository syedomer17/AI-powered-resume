"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Upload, Link as LinkIcon } from "lucide-react";
import { useApi } from "@/hooks/useApi";
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
  const { callApi, loading: apiLoading } = useApi();
  const initialLoadRef = useRef(true);

  const [certificationList, setCertificationList] = useState<
    CertificationType[]
  >([
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
      const res = await callApi("/api/user/certifications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          resumeId,
          certificationId: certToRemove.id,
        }),
      });

      if (!res) return;

      if (res.success) {
        toast.success("Certification removed.");
        setCertificationList(
          res.certifications.map((cert: any) => ({
            id: cert.id,
            name: cert.name,
            link: cert.link,
            imageUrl: cert.imageUrl,
            date: cert.date,
          }))
        );
      } else {
        toast.error(res.message || "Failed to remove certification.");
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
      const response = await callApi("/api/user/certifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          resumeId,
          certifications: certificationList,
        }),
      });

      if (!response) {
        setLoading(false);
        return;
      }

      if (response.success) {
        toast.success("Certifications saved!");
        setCertificationList(
          response.certifications.map((cert: any) => ({
            id: cert.id,
            name: cert.name,
            link: cert.link,
            imageUrl: cert.imageUrl,
            date: cert.date,
          }))
        );
      } else {
        toast.error(response.message || "Failed to save certifications.");
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

      const response = await callApi("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response) {
        setUploadingIndex(null);
        return;
      }

      if (response.success) {
        handleChange(index, "imageUrl", response.imageUrl);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error(response.message || "Failed to upload image");
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
      className="p-6 md:p-8 bg-card border border-border rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 mt-6"
    >
      <div className="mb-6 pb-4 border-b border-border">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          Certifications
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Add your certifications with a link or upload an image
        </p>
      </div>

      <AnimatePresence>
        {certificationList.map((field, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-border p-5 my-5 rounded-xl bg-muted/30"
          >
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-foreground">
                Certification Name
              </label>
              <Input
                className="mt-1 h-11 focus:ring-2 focus:ring-blue-500/20"
                value={field.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                placeholder="e.g., AWS Certified Developer"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                Certification Link (Optional)
              </label>
              <div className="flex gap-2 mt-1">
                <Input
                  className="h-11 focus:ring-2 focus:ring-blue-500/20"
                  value={field.link}
                  onChange={(e) => handleChange(index, "link", e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                Date
              </label>
              <Input
                type="date"
                className="mt-1 h-11 focus:ring-2 focus:ring-blue-500/20"
                value={field.date}
                onChange={(e) => handleChange(index, "date", e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-foreground">
                Upload Image (Optional)
              </label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="file"
                  accept="image/*"
                  className="h-11"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(index, file);
                  }}
                  disabled={uploadingIndex === index}
                />
                {uploadingIndex === index && (
                  <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                )}
              </div>
              {field.imageUrl && (
                <div className="mt-3">
                  <img
                    src={field.imageUrl}
                    alt="Certification"
                    className="h-24 object-contain border border-border rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="sm:col-span-2 flex justify-end mt-2">
              <Button
                type="button"
                onClick={() => handleRemove(index)}
                size="sm"
                variant="outline"
                className="btn-danger-invert flex items-center gap-1"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="flex gap-2 justify-between mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handleAdd}
          className="btn-add-invert flex items-center gap-1 "
        >
          + Add Certification
        </Button>

        <Button
          onClick={handleSave}
          disabled={loading}
          className="btn-save-invert shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
        >
          {loading && <Loader2 className="spinner w-4 h-4 animate-spin" />}
          Save
        </Button>
      </div>
    </motion.div>
  );
};

export default Certifications;
