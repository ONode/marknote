

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { cn } from "../lib/utils";
import { MarkdownViewer } from "./markdown-viewer";
import { toast } from "sonner";
import {
  Edit3,
  Eye,
  Download,
  Upload,
  Save,
  Split,
  Maximize2
} from "lucide-react";

interface MarkdownEditorProps {
  initialContent: string;
  onSave: (content: string) => void;
  className?: string;
  activeTab: "edit" | "preview";
  onViewModeChange: (mode: "split" | "fullscreen") => void;
  onActiveTabChange: (tab: "edit" | "preview") => void;
  viewMode: "split" | "fullscreen";
}

export function MarkdownEditor({
  initialContent,
  onSave,
  className,
  activeTab,
  onViewModeChange,
  onActiveTabChange,
  viewMode,
}: MarkdownEditorProps) {
  const [content, setContent] = useState(initialContent);

  // Update content when initialContent changes
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  // Handle content changes
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    // Immediately propagate content changes to parent for real-time share URL updates
    // onSave(newContent);
  };

  // Handle file import
  const handleFileImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === "string") {
          setContent(text);
          onSave(text);
          toast.success(`File "${file.name}" imported successfully!`);
        }
      };
      reader.readAsText(file);
    }
  }, [onSave]);

  // Handle file export
  const handleFileExport = useCallback(() => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("File exported successfully!");
  }, [content]);

  // Handle save
  const handleSave = useCallback(() => {
    onSave(content);
    toast.success("Content saved!");
  }, [content, onSave]);

  // Trigger file input click
  const triggerFileInput = useCallback(() => {
    const fileInput = document.getElementById("file-input") as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }, []);

  return (
    <Card className={cn("h-full flex flex-col", className)}>

      <CardContent className="flex-1 flex flex-col">
        <Tabs
          value={activeTab}
          onValueChange={(value) => onActiveTabChange(value as "edit" | "preview")}
          className="flex-1 flex flex-col"
        >
          {viewMode === "fullscreen" && (
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger
                value="edit"
                className="flex items-center gap-2"
                onClick={() => onActiveTabChange("edit")}
              >
                <Edit3 className="h-4 w-4" />
                Edit
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="flex items-center gap-2"
                onClick={() => onActiveTabChange("preview")}
              >
                <Eye className="h-4 w-4" />
                Preview
              </TabsTrigger>
            </TabsList>
          )}

          <TabsContent value="edit" className="flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={triggerFileInput}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Import
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleFileExport}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button
                onClick={handleSave}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save
              </Button>
            </div>

            <Textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Write your markdown here..."
              className="flex-1 min-h-[400px] font-mono text-sm resize-none"
            />

            {/* Hidden file input for import */}
            <input
              id="file-input"
              type="file"
              accept=".md,.markdown,.txt"
              onChange={handleFileImport}
              className="hidden"
            />
          </TabsContent>
          <TabsContent value="preview" className="flex-1">
            <div className="h-full overflow-auto">
              <MarkdownViewer
                content={content}
                className="h-full  border-0 w-full prose prose-lg max-w-none dark:prose-invert"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
