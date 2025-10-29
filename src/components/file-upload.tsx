"use client";

import type React from "react";
import { useCallback, useState } from "react";

import { File, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing?: boolean;
}

export function FileUpload({
  onFileSelect,
  isProcessing = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    setError(null);

    // Check file type
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return false;
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File size must be less than 10MB");
      return false;
    }

    return true;
  };

  const handleFile = useCallback(
    (file: File) => {
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    },
    [onFileSelect],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile],
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {!selectedFile ? (
        <Card
          className={cn(
            "flex h-64 cursor-pointer items-center justify-center border-2 border-dashed transition-colors",
            isDragging && "border-primary bg-primary/5",
            error && "border-destructive",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <div className="p-6 text-center">
            <Upload className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <p className="mb-1 text-sm font-medium">
              Drop your PDF here or click to browse
            </p>
            <p className="text-muted-foreground text-xs">
              Maximum file size: 10MB
            </p>
          </div>
          <input
            id="file-input"
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={handleFileInput}
            disabled={isProcessing}
          />
        </Card>
      ) : (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-lg p-2">
                <File className="text-primary h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {selectedFile.name}
                </p>
                <p className="text-muted-foreground text-xs">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            {!isProcessing && (
              <Button variant="ghost" size="icon-sm" onClick={clearFile}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>
      )}

      {error && <p className="text-destructive text-sm">{error}</p>}

      {selectedFile && !isProcessing && (
        <Button className="w-full" onClick={() => onFileSelect(selectedFile)}>
          Process File
        </Button>
      )}

      {isProcessing && (
        <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
          <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
          Processing...
        </div>
      )}
    </div>
  );
}
