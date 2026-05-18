

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
  Save,
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

  // Handle save
  const handleSave = useCallback(() => {
    onSave(content);
    toast.success("Content saved!");
  }, [content, onSave]);

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
