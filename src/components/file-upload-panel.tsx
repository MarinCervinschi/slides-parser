"use client";

import { FileUpload } from "@/components/file-upload";
import { RequestCounter } from "@/components/request-counter";

interface FileUploadPanelProps {
	onFileSelect: (file: File) => void;
	isProcessing: boolean;
}

export function FileUploadPanel({ onFileSelect, isProcessing }: FileUploadPanelProps) {
	return (
		<div className="bg-muted/30 w-80 shrink-0 border-r p-6">
			<div className="space-y-4">
				<div>
					<h2 className="text-lg font-semibold">Upload File</h2>
					<p className="text-muted-foreground text-sm">
						Upload a PDF file to get started
					</p>
				</div>
				<FileUpload onFileSelect={onFileSelect} isProcessing={isProcessing} />
				<div className="pt-2">
					<RequestCounter />
				</div>
			</div>
		</div>
	);
}
