"use client";

import React, { useState } from "react";
import {
  Editor,
  EditorProvider,
  Toolbar,
  BtnBold,
  BtnItalic,
  BtnUnderline,
  BtnStrikeThrough,
  BtnLink,
  Separator,
} from "react-simple-wysiwyg";
import { Button } from "./ui/button";
import { Brain, Loader2 } from "lucide-react";
import { useResumeInfo } from "@/context/ResumeInfoConext"; // ✅ fixed import
import { toast } from "sonner";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const [loading, setLoading] = useState(false);
  const { resumeInfo } = useResumeInfo(); // ✅ use hook

  const handleGenerate = async () => {
    if (!resumeInfo?.summery) {
      toast.error("Resume summary is empty. Please fill it first.");
      return;
    }

    const resumeSummary = resumeInfo.summery;

    setLoading(true);
    try {
      const prompt = `
Given the following resume summary:

"${resumeSummary}"

Generate 3–4 number points summarizing this experience in professional resume language. Return only HTML in the format:

<ol>
  <li>First point...</li>
  <li>Second point...</li>
  ...
</ol>
      `.trim();

      const ai = new (await import("@google/genai")).GoogleGenAI({
        apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
      });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      });

      let rawText =
        response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!rawText) {
        throw new Error("No text returned from Gemini.");
      }

      if (rawText.startsWith("```")) {
        rawText = rawText
          .replace(/```[a-z]*\n?/i, "")
          .replace(/```$/, "")
          .trim();
      }

      onChange(rawText);
    } catch (error) {
      console.error("Error generating summary:", error);
      toast.error("Error generating summary. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-2">
      <div className="flex justify-between my-2">
        <label className="text-sm">Summary</label>
        <Button
          variant="outline"
          className="flex gap-2 border-b-fuchsia-500 text-fuchsia-500"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Brain className="h-4 w-4" />
          )}
          {loading ? "Generating..." : "Generate from Summary"}
        </Button>
      </div>
      <EditorProvider>
        <Editor value={value} onChange={(e) => onChange(e.target.value)} />
        <Toolbar>
          <Separator />
          <BtnBold />
          <BtnItalic />
          <BtnUnderline />
          <BtnStrikeThrough />
          <Separator />
          <BtnLink />
        </Toolbar>
      </EditorProvider>
    </div>
  );
};

export default RichTextEditor;