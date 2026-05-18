

import React, { useState, useEffect, Suspense, useCallback } from "react";
import { MarkdownEditor } from "../components/markdown-editor";
import { MarkdownViewer } from "../components/markdown-viewer";
import { DragDropZone } from "../components/drag-drop-zone";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { useFileManager } from "../hooks/use-file-manager";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/ui/resizable";
import {
  FileText,
  Split,
  Maximize2,
  Copy,
  Check,
  Share2,
  Eye,
  ExternalLink,
} from "lucide-react";
import { cn } from "../lib/utils";
import { ThemeToggle } from "../components/theme-toggle";
import { Layout } from "../components/layout";
// MathJaxProvider removed - using Mathpix for LaTeX rendering
import {
  getShareableUrl,
  getCompressionStats,
  decompressContent,
  isCompressedContent,
} from "../lib/compression";
import type { FileMetadata } from "../actions/file-actions";
import { getSearchParam } from "../lib/url-utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../components/ui/dialog";
import { SAMPLE_MARKDOWN } from "@/lib/sample";
import logoUrl from "@/styles/svg/logo.svg";

function HomeContent({
  viewMode,
  onCopy,
  activeTab,
  onViewModeChange,
  onActiveTabChange,
  contentToLoad,
  onContentLoaded,
  createFile,
  updateFile,
  currentFile,
}: {
  viewMode: "split" | "fullscreen";
  onCopy: (content: string) => void;
  activeTab: "edit" | "preview";
  onViewModeChange: (mode: "split" | "fullscreen") => void;
  onActiveTabChange: (tab: "edit" | "preview") => void;
  contentToLoad?: string | null;
  onContentLoaded?: () => void;
  createFile: (name: string, content: string, tags?: string[]) => Promise<any>;
  updateFile: (id: string, content: string) => Promise<any>;
  currentFile: FileMetadata | null;
}) {
  // Helper function to decode content parameter (handles both compressed and raw content)
  const decodeContentParam = (param: string | null): string => {
    if (!param) return SAMPLE_MARKDOWN;

    try {
      // Check if the content is compressed
      if (isCompressedContent(param)) {
        // Decompress the content
        const decompressed = decompressContent(param);
        console.log("Content decompressed successfully from URL parameter");
        return decompressed;
      } else {
        // Content is raw, use as-is
        console.log("Using raw content from URL parameter");
        return param;
      }
    } catch (error) {
      console.error("Error decoding content parameter:", error);
      // Fallback to sample markdown if decoding fails
      return SAMPLE_MARKDOWN;
    }
  };
  const contentParam = getSearchParam("content");
  const [markdown, setMarkdown] = useState(decodeContentParam(contentParam));
  // Update markdown when contentParam changes
  useEffect(() => {
    if (contentParam) {
      const decodedContent = decodeContentParam(contentParam);
      setMarkdown(decodedContent);
      onViewModeChange("fullscreen");
      onActiveTabChange("preview");
      toast.success("Switched to Fullscreen Preview Mode", {
        description: "Content loaded from URL. Press 'Q' to return to split view."
      });
    }
  }, [contentParam, onViewModeChange, onActiveTabChange]);

  // Handle content passed from navigation
  useEffect(() => {
    if (contentToLoad) {
      setMarkdown(contentToLoad);
      onViewModeChange("fullscreen");
      onActiveTabChange("preview");
      toast.success("Switched to Fullscreen Preview Mode", {
        description: "Document loaded. Press 'Q' to return to split view."
      });
      // Notify that content has been loaded
      onContentLoaded?.();
    }
  }, [contentToLoad, onViewModeChange, onActiveTabChange, onContentLoaded]);


  // Smart save logic: update existing file or create new file
  const handleSave = async (content: string) => {
    setMarkdown(content);
    // Update the copy function's access to current content
    onCopy(content);

    try {
      if (currentFile) {
        // Update existing file from file manager
        await updateFile(currentFile.id, content);
        toast.success(`File "${currentFile.name}" updated successfully`);
      } else {
        // Create new file for new content
        await createFile("new-doc", content);
        toast.success('File "new-doc" created successfully');
      }
    } catch (error) {
      console.error('Failed to save file:', error);
      toast.error('Failed to save file');
    }
  };

  // Handle file drop from drag and drop
  const handleFileDrop = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === "string") {
        setMarkdown(text);
        onCopy(text);
        // Automatically switch to fullscreen mode and preview mode when file is uploaded
        onViewModeChange("fullscreen");
        onActiveTabChange("preview");
        // Show success notification
        toast.success(`File "${file.name}" loaded successfully!`, {
          description: "Switched to fullscreen preview mode. Press 'Q' to return to split view."
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <DragDropZone
      onFileDrop={handleFileDrop}
      className="mx-auto container py-6 flex-1"
    >
      {viewMode === "split" ? (
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-[600px] rounded-lg border"
        >
          <ResizablePanel defaultSize={50}>
            <MarkdownEditor
              initialContent={markdown}
              onSave={handleSave}
              className="border-0 rounded-none h-full"
              activeTab={activeTab}
              onViewModeChange={onViewModeChange}
              onActiveTabChange={onActiveTabChange}
              viewMode={viewMode}
            />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={50}>
            <MarkdownViewer content={markdown} className="rounded-none border-0 h-full w-full" />
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <div className="rounded-lg border-0">
          <MarkdownEditor
            initialContent={markdown}
            onSave={handleSave}
            className="border-0 rounded-none"
            activeTab={activeTab}
            onViewModeChange={onViewModeChange}
            onActiveTabChange={onActiveTabChange}
            viewMode={viewMode}
          />
        </div>
      )}
    </DragDropZone>
  );
}

interface HomePageProps {
  onNavigate?: (route: 'home' | 'doc', content?: string, fileMetadata?: FileMetadata) => void;
  contentToLoad?: string | null;
  fileToLoad?: FileMetadata | null;
  onContentLoaded?: () => void;
}

export default function HomePage({ onNavigate, contentToLoad, fileToLoad, onContentLoaded }: HomePageProps) {
  const [viewMode, setViewMode] = useState<"split" | "fullscreen">("fullscreen");
  const [copySuccess, setCopySuccess] = useState(false);
  const [currentMarkdown, setCurrentMarkdown] = useState(SAMPLE_MARKDOWN);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [lastSharedUrl, setLastSharedUrl] = useState<string | null>(null);
  const [showUrlDialog, setShowUrlDialog] = useState(false);
  const [currentFile, setCurrentFile] = useState<FileMetadata | null>(null);

  // File manager hook for creating and updating files
  const { createFile, updateFile } = useFileManager({
    autoSave: false,
    maxFiles: 100
  });

  const handleCopy = useCallback(async () => {
    try {
      if (currentMarkdown) {
        await navigator.clipboard.writeText(currentMarkdown);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
      }
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  }, [currentMarkdown]);

  const handleMarkdownUpdate = (content: string) => {
    setCurrentMarkdown(content);
  };

  // Sync currentMarkdown with contentToLoad for share URL
  useEffect(() => {
    if (contentToLoad) {
      setCurrentMarkdown(contentToLoad);
    }
  }, [contentToLoad]);

  // Sync currentFile with fileToLoad for smart save logic
  useEffect(() => {
    if (fileToLoad) {
      setCurrentFile(fileToLoad);
    } else {
      setCurrentFile(null);
    }
  }, [fileToLoad]);

  // Generate shareable URL with gzip compression
  const handleShare = useCallback(() => {
    setIsSharing(true);
    const shareableUrl = getShareableUrl(currentMarkdown);
    const stats = getCompressionStats(currentMarkdown);

    navigator.clipboard
      .writeText(shareableUrl)
      .then(() => {
        // Store the last shared URL for display
        setLastSharedUrl(shareableUrl);
        // Show success toast with compression info
        if (stats.shouldCompress) {
          toast.success("URL copied!", {
            description: `Content compressed: ${stats.originalSize} → ${stats.compressedSize} chars (${stats.compressionRatio.toFixed(1)}% reduction)`
          });
        } else {
          toast.success("URL copied to clipboard!");
        }
      })
      .catch((err) => {
        console.error("Failed to copy URL:", err);
        toast.error("Failed to copy URL to clipboard");
      })
      .finally(() => {
        setIsSharing(false);
      });
  }, [currentMarkdown]);

  // Global drag and drop handlers
  useEffect(() => {
    const handleGlobalDragEnter = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
        const hasFiles = Array.from(e.dataTransfer.items).some(
          (item) => item.kind === "file",
        );
        if (hasFiles) {
          setIsDragOver(true);
        }
      }
    };

    const handleGlobalDragLeave = (e: DragEvent) => {
      e.preventDefault();
      // Only hide if we're leaving the window entirely
      if (
        e.clientX <= 0 ||
        e.clientY <= 0 ||
        e.clientX >= window.innerWidth ||
        e.clientY >= window.innerHeight
      ) {
        setIsDragOver(false);
      }
    };

    const handleGlobalDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleGlobalDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
    };

    // Add global event listeners
    document.addEventListener("dragenter", handleGlobalDragEnter);
    document.addEventListener("dragleave", handleGlobalDragLeave);
    document.addEventListener("dragover", handleGlobalDragOver);
    document.addEventListener("drop", handleGlobalDrop);

    return () => {
      document.removeEventListener("dragenter", handleGlobalDragEnter);
      document.removeEventListener("dragleave", handleGlobalDragLeave);
      document.removeEventListener("dragover", handleGlobalDragOver);
      document.removeEventListener("drop", handleGlobalDrop);
    };
  }, []);

  // Auto-scroll to top when switching to fullscreen preview mode
  useEffect(() => {
    if (viewMode === "fullscreen" && activeTab === "preview") {
      // Scroll to top of the page for better fullscreen experience
      window.scrollTo({ top: 0, behavior: "smooth" });
      // Show toast notification for fullscreen mode
      toast.success("Switched to Fullscreen Preview Mode", {
        description: "Press 'Q' to return to split view or 'E' to edit"
      });
    }
  }, [viewMode, activeTab]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger if not typing in an input/textarea
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case "q":
          event.preventDefault();
          setViewMode("split");
          break;
        case "w":
          event.preventDefault();
          setViewMode("fullscreen");
          toast.success("Switched to Fullscreen Preview Mode", {
            description: "Press 'Q' to return to split view or 'E' to edit"
          });
          break;
        case "e":
          event.preventDefault();
          setActiveTab("edit");
          break;
        case "p":
          event.preventDefault();
          setActiveTab("preview");
          break;
        case "v":
          event.preventDefault();
          // Toggle between edit and preview
          setActiveTab(activeTab === "edit" ? "preview" : "edit");
          break;
        case "c":
          event.preventDefault();
          handleCopy();
          break;
        case "i":
          event.preventDefault();
          // Trigger import functionality
          console.log("Import triggered via keyboard shortcut");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleCopy, activeTab]);

  return (
    <Layout className={cn(
      "flex min-h-screen flex-col transition-all duration-300 ease-in-out",
      viewMode === "fullscreen" &&
      activeTab === "preview" &&
      "bg-gradient-to-br from-background to-muted/20",
    )}>
      <header
        className={cn(
          "border-b sticky top-0 z-50 glass transition-all duration-300 ease-in-out",
          isDragOver && "bg-primary/5 border-primary/50",
          viewMode === "fullscreen" &&
          activeTab === "preview" &&
          "border-primary/20",
        )}
      >
        <div className="mx-auto container flex h-11 items-center px-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate?.('doc')}
            className="flex items-center gap-2"
          >
            <img
              src={logoUrl}
              alt=""
              className={cn(
                "h-5 w-5 transition-opacity duration-200",
                isDragOver && "opacity-70",
              )}
            />
            Library
          </Button>

          <div className="ml-auto flex gap-2">
            <ThemeToggle />
            {isDragOver && (
              <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-md text-sm font-medium">
                <FileText className="h-4 w-4" />
                Drop markdown file here
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="flex items-center gap-2"
            >
              {copySuccess ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
              <span className="sr-only">Copy markdown content</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-2"
              disabled={isSharing}
            >
              {isSharing ? (
                <svg
                  className="animate-spin h-4 w-4 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <Share2 className="h-4 w-4" />
              )}
              {isSharing ? "Sharing..." : "Share"}
            </Button>
            <Button
              variant={viewMode === "split" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("split")}
              className="flex items-center gap-2"
            >
              <Split className="h-4 w-4" />
              Split
              <span className="text-xs text-muted-foreground ml-1">(Q)</span>
            </Button>
            <Button
              variant={viewMode === "fullscreen" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setViewMode("fullscreen");
                toast.success("Switched to Fullscreen Preview Mode", {
                  description: "Press 'Q' to return to split view or 'E' to edit"
                });
              }}
              className="flex items-center gap-2"
            >
              <Maximize2 className="h-4 w-4" />
              Full
              <span className="text-xs text-muted-foreground ml-1">(W)</span>
            </Button>
          </div>
        </div>
      </header>


      {/* Last Shared URL Display */}
      {lastSharedUrl && (
        <div className="bg-green-50 border-b border-green-200 px-4 py-2 max-h-100">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-green-800">
              <Share2 className="h-4 w-4" />
              <span>Last shared URL:</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="max-w-md">
                <code
                  className=" text-xs bg-green-100 px-2 py-1 rounded text-green-700 block truncate"
                  title={lastSharedUrl}
                >
                  {lastSharedUrl}
                </code>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(lastSharedUrl);
                  toast.success("URL copied to clipboard!");
                }}
                className="h-6 px-2 py-1 text-green-600 hover:text-green-800 text-xs"
                title="Copy URL to clipboard"
              >
                Copy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUrlDialog(true)}
                className="h-6 px-2 py-1 text-green-600 hover:text-green-800 text-xs"
                title="View full URL"
              >
                <Eye className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLastSharedUrl(null)}
                className="h-6 w-6 p-0 text-green-600 hover:text-green-800"
                title="Hide URL display"
              >
                ×
              </Button>
            </div>
          </div>
        </div>
      )}

      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center">
            Loading...
          </div>
        }
      >
        <HomeContent
          viewMode={viewMode}
          onCopy={handleMarkdownUpdate}
          activeTab={activeTab}
          onViewModeChange={setViewMode}
          onActiveTabChange={setActiveTab}
          contentToLoad={contentToLoad}
          onContentLoaded={onContentLoaded}
          createFile={createFile}
          updateFile={updateFile}
          currentFile={currentFile}
        />
      </Suspense>

      {!(viewMode === "fullscreen" && activeTab === "preview") && (
        <footer className="py-6 border-t">
          <div className="container px-4 text-center text-sm text-muted-foreground">
            Build by MorganX
          </div>
        </footer>
      )}

      {/* URL Dialog */}
      <Dialog open={showUrlDialog} onOpenChange={setShowUrlDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Shared URL</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <label className="text-sm font-medium text-muted-foreground">
              URL to share:
            </label>
            <div className="max-h-96 mt-2 p-3 overflow-y-auto bg-muted rounded-md">
              <code className=" text-sm break-all">{lastSharedUrl}</code>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (lastSharedUrl) {
                      const content = `[solution ref.](${lastSharedUrl})`;
                      navigator.clipboard.writeText(content);
                      toast.success("Markdown link is copied to clipboard!");
                    }
                  }}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Markdown
                </Button>

                <Button
                  onClick={() => {
                    if (lastSharedUrl) {
                      navigator.clipboard.writeText(lastSharedUrl);
                      toast.success("URL copied to clipboard!");
                    }
                  }}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy URL
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (lastSharedUrl) {
                      window.open(lastSharedUrl, "_blank");
                    }
                  }}
                  className="flex-1"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open URL
                </Button>
              </div>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
