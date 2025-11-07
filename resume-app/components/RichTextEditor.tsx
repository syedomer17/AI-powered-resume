"use client";

import React, { useState } from "react";
import { LexicalComposer, InitialConfigType } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { EditorState } from "lexical";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $getRoot, $insertNodes } from "lexical";

import { ContentEditable } from "@/components/editor/editor-ui/content-editable";
import { editorTheme } from "@/components/editor/themes/editor-theme";
import { ToolbarPlugin } from "@/components/editor/plugins/toolbar/toolbar-plugin";
import { BlockFormatDropDown } from "@/components/editor/plugins/toolbar/block-format-toolbar-plugin";
import { FormatParagraph } from "@/components/editor/plugins/toolbar/block-format/format-paragraph";
import { FormatHeading } from "@/components/editor/plugins/toolbar/block-format/format-heading";
import { FormatNumberedList } from "@/components/editor/plugins/toolbar/block-format/format-numbered-list";
import { FormatBulletedList } from "@/components/editor/plugins/toolbar/block-format/format-bulleted-list";
import { FormatCheckList } from "@/components/editor/plugins/toolbar/block-format/format-check-list";
import { FormatQuote } from "@/components/editor/plugins/toolbar/block-format/format-quote";
import { FontFamilyToolbarPlugin } from "@/components/editor/plugins/toolbar/font-family-toolbar-plugin";
import { FontFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/font-format-toolbar-plugin";
import { FontSizeToolbarPlugin } from "@/components/editor/plugins/toolbar/font-size-toolbar-plugin";
import { LinkToolbarPlugin } from "@/components/editor/plugins/toolbar/link-toolbar-plugin";
import { AutoLinkPlugin } from "@/components/editor/plugins/auto-link-plugin";
import { LinkPlugin } from "@/components/editor/plugins/link-plugin";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "./ui/button";
import { Brain, Loader2 } from "lucide-react";
import { useResumeInfo } from "@/context/ResumeInfoConext";
import { toast } from "sonner";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

const nodes = [
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  CodeNode,
  CodeHighlightNode,
  AutoLinkNode,
  LinkNode,
];

const editorConfig: InitialConfigType = {
  namespace: "RichTextEditor",
  theme: editorTheme,
  nodes,
  onError: (error: Error) => {
    console.error(error);
  },
};

function HtmlToEditorPlugin({ html }: { html: string }) {
  const [editor] = useLexicalComposerContext();

  React.useEffect(() => {
    if (!html) return;
    
    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(html, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);
      
      const root = $getRoot();
      root.clear();
      root.select();
      $insertNodes(nodes);
    });
  }, [html, editor]);

  return null;
}

function HtmlOutputPlugin({ onChange }: { onChange: (html: string) => void }) {
  const [editor] = useLexicalComposerContext();

  const handleChange = (editorState: EditorState) => {
    editorState.read(() => {
      const htmlString = $generateHtmlFromNodes(editor, null);
      onChange(htmlString);
    });
  };

  return <OnChangePlugin onChange={handleChange} ignoreSelectionChange={true} />;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const [loading, setLoading] = useState(false);
  const [isLinkEditMode, setIsLinkEditMode] = useState(false);
  const { resumeInfo } = useResumeInfo();

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

      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({
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
    <div className="space-y-2">
      <div className="flex justify-end items-center">
        <Button
          className="ai-generate-btn gap-2 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100"
          size="sm"
          onClick={handleGenerate}
          disabled={loading}
          type="button"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-white dark:text-black" />
          ) : (
            <Brain className="h-4 w-4 text-white dark:text-black" />
          )}
          <span className="hidden sm:inline">
            {loading ? "Generating..." : "Generate from AI"}
          </span>
          <span className="sm:hidden">Generate</span>
        </Button>
      </div>

      <div className="bg-white dark:bg-background rounded-lg border shadow-sm overflow-hidden">
        <LexicalComposer initialConfig={editorConfig}>
          <TooltipProvider>
            <ToolbarPlugin>
              {({ blockType }) => (
                <div className="flex flex-wrap items-center gap-2 border-b p-2 bg-white dark:bg-background text-black dark:text-white">
                  {/* Block Format Dropdown */}
                  <BlockFormatDropDown>
                    <FormatParagraph />
                    <FormatHeading levels={["h1", "h2", "h3"]} />
                    <FormatNumberedList />
                    <FormatBulletedList />
                    <FormatCheckList />
                    <FormatQuote />
                  </BlockFormatDropDown>
                  
                  {/* Divider */}
                  <div className="h-6 w-px bg-border" />
                  
                  {/* Font Family */}
                  <FontFamilyToolbarPlugin />
                  
                  {/* Font Size */}
                  <FontSizeToolbarPlugin />
                  
                  {/* Divider */}
                  <div className="h-6 w-px bg-border" />
                  
                  {/* Text Formatting */}
                  <FontFormatToolbarPlugin />
                  
                  {/* Divider */}
                  <div className="h-6 w-px bg-border" />
                  
                  {/* Link */}
                  <LinkToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
                </div>
              )}
            </ToolbarPlugin>

            <div className="relative">
              <RichTextPlugin
                contentEditable={
                  <div className="editor-scroller min-h-[140px] max-h-[400px] overflow-y-auto">
                    <div className="editor p-4">
                      <ContentEditable 
                        placeholder="Start typing..." 
                        className="min-h-[100px] outline-none"
                      />
                    </div>
                  </div>
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
              <HtmlOutputPlugin onChange={onChange} />
              <HtmlToEditorPlugin html={value} />
              <ListPlugin />
              <CheckListPlugin />
              <AutoLinkPlugin />
              <LinkPlugin />
            </div>
          </TooltipProvider>
        </LexicalComposer>
      </div>
    </div>
  );
};

export default RichTextEditor;