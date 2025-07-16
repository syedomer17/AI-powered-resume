"use client";

import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LayoutGrid } from "lucide-react";
import { Button } from "../ui/button";
import { useResumeInfo } from "@/context/ResumeInfoConext";
import axios from "axios";
import { toast } from "sonner";

interface ThemeColorProps {
  userId?: string;
  resumeId: string;
}

const ThemeColor: React.FC<ThemeColorProps> = ({ userId, resumeId }) => {
  const { resumeInfo, setResumeInfo } = useResumeInfo();
  const [loading, setLoading] = useState(false);

  const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF",
    "#33FFA1", "#FF7133", "#71FF33", "#7133FF", "#FF3371",
    "#33FF71", "#3371FF", "#A1FF33", "#33A1FF", "#000000",
    "#5733FF", "#33FF5A", "#5A33FF", "#FF335A", "#335AFF",
    "#FFD700", "#00CED1", "#FF4500", "#8A2BE2", "#7FFF00",
    "#DC143C", "#20B2AA", "#FF1493", "#ADFF2F", "#1E90FF",
  ];

  const onColorSelect = async (color: string) => {
    if (!userId || !resumeId) {
      toast.error("Missing user or resume ID.");
      return;
    }

    setLoading(true);

    try {
      await axios.patch("/api/user/personal", {
        userId,
        resumeId,
        firstName: resumeInfo.firstName,
        lastName: resumeInfo.lastName,
        jobTitle: resumeInfo.jobTitle,
        address: resumeInfo.address,
        phone: resumeInfo.phone,
        email: resumeInfo.email,
        themeColor: color,
      });

      // Update only the themeColor locally, keep other fields unchanged
      setResumeInfo((prev) => ({
        ...prev,
        themeColor: color,
      }));

      toast.success("Theme color updated!");
    } catch (error) {
      console.error("Failed to update theme color:", error);
      toast.error("Failed to update theme color.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex gap-2 items-center"
          disabled={loading}
        >
          <LayoutGrid className="w-4 h-4" />
          Theme
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-4 rounded-lg shadow-md">
        <h2 className="mb-3 text-sm font-semibold text-gray-700">
          Select Theme Color
        </h2>
        <div className="grid grid-cols-5 gap-4">
          {colors.map((color, index) => (
            <div
              key={index}
              onClick={() => onColorSelect(color)}
              title={color}
              aria-label={`Select color ${color}`}
              className={`h-6 w-6 rounded-full cursor-pointer border transition-transform duration-150 hover:scale-110 shadow-sm ${
                resumeInfo.themeColor === color
                  ? "ring-2 ring-offset-2 ring-black"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ThemeColor;
