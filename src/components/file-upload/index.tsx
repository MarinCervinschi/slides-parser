"use client";

import { useMemo } from "react";

import { File, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useFileUpload } from "@/hooks/use-file-upload";
import { cn } from "@/lib/utils";

interface FileUploadProps {
	onFileSelect: (file: File) => void;
	isProcessing?: boolean;
}

const maxSize = process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB
	? parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB) * 1024 * 1024
	: 15 * 1024 * 1024; // Default to 15MB if not set

export function FileUpload({ onFileSelect, isProcessing = false }: FileUploadProps) {
	const isProduction = useMemo(() => {
		if (typeof window === "undefined") return false;
		return window.location.hostname !== "localhost";
	}, []);

	const {
		isDragging,
		selectedFile,
		error,
		handleDragOver,
		handleDragLeave,
		handleDrop,
		handleFileInput,
		clearFile,
	} = useFileUpload({ onFileSelect });

	return (
		<div className="space-y-4">
			{!selectedFile ? (
				<Card
					className={cn(
						"flex h-64 cursor-pointer items-center justify-center border-2 border-dashed transition-colors",
						isDragging && "border-primary bg-primary/5",
						error && "border-destructive"
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
							Maximum file size: {isProduction ? 4.5 : maxSize / 1024 / 1024}MB
						</p>
						{isProduction && (
							<p className="text-muted-foreground text-xs">
								(vercel limits | run locally to have more flexibility)
							</p>
						)}
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
					<div className="flex items-start justify-between gap-3">
						<div className="flex min-w-0 flex-1 items-start gap-3">
							<div className="bg-primary/10 shrink-0 rounded-lg p-2">
								<File className="text-primary h-5 w-5" />
							</div>
							<div className="min-w-0 flex-1">
								<p className="text-sm font-medium wrap-break-word">
									{selectedFile.name}
								</p>
								<p className="text-muted-foreground text-xs">
									{(selectedFile.size / 1024).toFixed(1)} KB
								</p>
							</div>
						</div>
						{!isProcessing && (
							<Button
								variant="ghost"
								size="icon-sm"
								onClick={clearFile}
								className="shrink-0"
							>
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
