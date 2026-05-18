

import { useState, useRef, useCallback } from "react";
import type { ReactNode } from "react";
import { cn } from "../lib/utils";
import { FileText, Upload } from "lucide-react";

interface DragDropZoneProps {
  children: ReactNode;
  onFileDrop: (file: File) => void;
  className?: string;
  acceptTypes?: string[];
}

export function DragDropZone({
  children,
  onFileDrop,
  className,
  acceptTypes = [".md", ".markdown", ".txt"]
}: DragDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if any of the dragged items are files
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      const hasFiles = Array.from(e.dataTransfer.items).some(item => 
        item.kind === "file"
      );
      
      if (hasFiles) {
        setDragCounter(prev => prev + 1);
        setIsDragOver(true);
      }
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDragCounter(prev => prev - 1);
    if (dragCounter <= 1) {
      setIsDragOver(false);
    }
  }, [dragCounter]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragOver(false);
    setDragCounter(0);

    const files = Array.from(e.dataTransfer.files);
    const markdownFile = files.find(file => {
      const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      return acceptTypes.includes(extension) || file.type === "text/markdown" || file.type === "text/plain";
    });

    if (markdownFile) {
      onFileDrop(markdownFile);
    }
  }, [onFileDrop, acceptTypes]);

  return (
    <div
      ref={dropZoneRef}
      className={cn("relative", className)}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}
      
      {/* Drag Overlay */}
      {isDragOver && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm border-2 border-dashed border-primary rounded-lg z-50 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                Drop Markdown File
              </h3>
              <p className="text-sm text-muted-foreground">
                Drop your .md file here to load it
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <FileText className="w-4 h-4" />
                Supported: {acceptTypes.join(", ")}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
